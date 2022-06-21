# [WIP] Nuxt3 SST (Serverless Stack)

This boilerplate uses [Serverless Stack](https://serverless-stack.com/) 
to deploy a [Nuxt3](https://v3.nuxtjs.org/) application to AWS as a 
hybrid site. This means that the pages will be statically rendered 
while the server routes will be handled in AWS
[Lambda@edge](https://aws.amazon.com/lambda/edge/).

> This boilerplate is under active development. Right now this boilerplate 
> works around a limitation in Nuxt3 where it doesn't have an aws-lambda-edge 
> preset 'yet'.

## Getting started

Assuming you have your AWS CLI set-up:

```bash
yarn
```

To run locally just visit the `app` folder and run `yarn dev`.

To deploy simply run

```bash
yarn deploy
```