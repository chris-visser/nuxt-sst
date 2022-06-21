import { StackContext } from '@serverless-stack/resources'

import { runNuxtBuild } from './helpers/runNuxtBuild'
import { createBucket, NuxtBucketCdkProps } from './helpers/createBucket'
import { createNuxtEdgeFunction, NuxtEdgeFunctionCdkProps } from './helpers/createNuxtEdgeFunction'
import { createCloudfrontDistribution, NuxtCfDistributionCdkProps } from './helpers/createCloudfrontDistribution'
import { deployToBucket, NuxtS3DeployCdkProps } from './helpers/deployToBucket'

type NuxtStackOptions = {
  srcDir?: string,
  cdk?: {
    bucket?: NuxtBucketCdkProps,
    distribution?: NuxtCfDistributionCdkProps,
    bucketDeployment?: NuxtS3DeployCdkProps
    edgeFunction?: NuxtEdgeFunctionCdkProps
  }
}

export function NuxtStack({ stack, app }: StackContext, {
  srcDir = 'app',
  cdk = {}
}: NuxtStackOptions= {}) {

  const buildDir = `${ srcDir }/.output`

  // Takes care of building the nuxt site
  // How its built depends on the nitro config in nuxt
  runNuxtBuild(srcDir)

  const bucket = createBucket({ stack, app }, cdk.bucket)

  // This uploads all files for the static file to the S3 bucket
  const bucketDeployment = deployToBucket({ stack, app }, {
    buildDir,
    destinationBucket: bucket
  }, cdk.bucketDeployment)

  // This creates a lambda edge function for the Nuxt Server
  const mainFunctionVersion = createNuxtEdgeFunction({ stack, app }, {
    buildDir
  }, {
    ...cdk.edgeFunction,
    // Workaround until PR is merged: https://github.com/unjs/nitro/pull/240
    handler: 'wrapper.handler'
  })

  // This creates the cloudfront distribution
  // and the connection to the S3 bucket + edge function
  const distribution = createCloudfrontDistribution({ stack, app }, {
    bucket,
    mainFunctionVersion
  }, cdk.distribution)

  distribution.node.addDependency(bucketDeployment)

  stack.addOutputs({
    url: `https://${ distribution.distributionDomainName }`
  })
}
