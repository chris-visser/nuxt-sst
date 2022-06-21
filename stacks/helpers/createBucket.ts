import { StackContext } from '@serverless-stack/resources'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { RemovalPolicy } from 'aws-cdk-lib'

export type NuxtBucketCdkProps = Partial<s3.Bucket>

export const createBucket = ({ stack, app }: StackContext, cdkProps: NuxtBucketCdkProps = {}) => {
  return new s3.Bucket(stack, 'S3Bucket', {
    publicReadAccess: true,
    autoDeleteObjects: true,
    websiteIndexDocument: 'index.html',
    removalPolicy: RemovalPolicy.DESTROY,
    bucketName: app.logicalPrefixedName('nuxt-site'),
    ...cdkProps
  })
}