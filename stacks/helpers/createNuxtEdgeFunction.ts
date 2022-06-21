import { Code, Runtime } from 'aws-cdk-lib/aws-lambda'
import { experimental } from 'aws-cdk-lib/aws-cloudfront'
import { StackContext } from '@serverless-stack/resources'
import { EdgeFunctionProps } from 'aws-cdk-lib/aws-cloudfront/lib/experimental'
import * as iam from 'aws-cdk-lib/aws-iam'

export type NuxtEdgeFunctionConfig = {
  buildDir: string
}

export type NuxtEdgeFunctionCdkProps = Partial<EdgeFunctionProps>

export const createNuxtEdgeFunction = ({ stack, app }: StackContext, config: NuxtEdgeFunctionConfig, {
  handler = 'index.handler',
  runtime = Runtime.NODEJS_16_X,
  description = 'Main handler for Nuxt Server Routes',
  ...cdkProps
}: NuxtEdgeFunctionCdkProps) => {
  const functionName = cdkProps.functionName || `${ app.stage }-${ app.name }-nuxt-server-edge`

  new iam.Role(stack, `EdgeLambdaRole`, {
    assumedBy: new iam.CompositePrincipal(
      new iam.ServicePrincipal('lambda.amazonaws.com'),
      new iam.ServicePrincipal('edgelambda.amazonaws.com')
    ),
    managedPolicies: [
      iam.ManagedPolicy.fromManagedPolicyArn(
        stack,
        'EdgeLambdaPolicy',
        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      )
    ]
  })

  return new experimental.EdgeFunction(stack, 'NuxtServer', {
    ...cdkProps,
    functionName,
    description,
    runtime,
    handler,
    code: Code.fromAsset(`${ config.buildDir }/server`),
    stackId: `${ app.logicalPrefixedName('nuxt-edge-lambda') }`
  } as EdgeFunctionProps)
}