import { StackContext } from '@serverless-stack/resources'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as s3 from 'aws-cdk-lib/aws-s3'

export type NuxtS3DeployConfig = {
  buildDir: string
  destinationBucket: s3.Bucket
}

export type NuxtS3DeployCdkProps = Partial<s3deploy.BucketDeploymentProps>

export const deployToBucket = ({ stack, app }: StackContext, config: NuxtS3DeployConfig, cdkProps: NuxtS3DeployCdkProps = {}) => {
  return new s3deploy.BucketDeployment(stack, 'DeployNuxt', {
    ...cdkProps,
    destinationBucket: config.destinationBucket,
    sources: [
      s3deploy.Source.asset(config.buildDir),
      ...(cdkProps.sources ? cdkProps.sources : [])
    ]
  })
}