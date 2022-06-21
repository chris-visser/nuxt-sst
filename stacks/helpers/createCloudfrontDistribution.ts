import { Duration } from 'aws-cdk-lib'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { StackContext } from '@serverless-stack/resources'

export type NuxtCfDistributionCdkProps = Partial<cloudfront.DistributionProps>

type NuxtCfDistributionConfig = {
  bucket: s3.Bucket
  mainFunctionVersion: lambda.IVersion
}

const lambdaCachePolicyProps: cloudfront.CachePolicyProps = {
  queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
  headerBehavior: cloudfront.CacheHeaderBehavior.none(),
  cookieBehavior: cloudfront.CacheCookieBehavior.all(),
  defaultTtl: Duration.seconds(0),
  maxTtl: Duration.days(365),
  minTtl: Duration.seconds(0),
  enableAcceptEncodingBrotli: true,
  enableAcceptEncodingGzip: true,
  comment: 'SST Nuxt Lambda Default Cache Policy'
}

const staticCachePolicyProps: cloudfront.CachePolicyProps = {
  queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
  headerBehavior: cloudfront.CacheHeaderBehavior.none(),
  cookieBehavior: cloudfront.CacheCookieBehavior.none(),
  defaultTtl: Duration.days(30),
  maxTtl: Duration.days(30),
  minTtl: Duration.days(30),
  enableAcceptEncodingBrotli: true,
  enableAcceptEncodingGzip: true,
  comment: 'SST Nuxt Site Static Default Cache Policy'
}

export const createCloudfrontDistribution = (
  { stack }: StackContext,
  config: NuxtCfDistributionConfig,
  cdkProps: NuxtCfDistributionCdkProps = {}
) => {
  const { bucket, mainFunctionVersion } = config

  const viewerProtocolPolicy = cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
  const origin = new origins.S3Origin(bucket, {
    originPath: '/public'
  })

  const lambdaCachePolicy = new cloudfront.CachePolicy(
    stack,
    'LambdaCache',
    lambdaCachePolicyProps
  )

  const staticCachePolicy = new cloudfront.CachePolicy(
    stack,
    'StaticsCache',
    staticCachePolicyProps
  )

  const edgeLambdas: cloudfront.EdgeLambda[] = [
    {
      includeBody: true,
      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
      functionVersion: mainFunctionVersion
    },
    {
      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
      functionVersion: mainFunctionVersion
    }
  ]

  return new cloudfront.Distribution(stack, 'Distribution', {
    defaultRootObject: '',
    // Override props.
    ...cdkProps,
    defaultBehavior: {
      viewerProtocolPolicy,
      origin,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
      ...(cdkProps.defaultBehavior || {}),
      cachePolicy: staticCachePolicy
    },
    additionalBehaviors: {
      'api/*': {
        viewerProtocolPolicy,
        origin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: lambdaCachePolicy,
        edgeLambdas
      },
      ...(cdkProps.additionalBehaviors || {})
    }
  })
}