# [WIP] Nuxt3 SST (Serverless Stack)

This boilerplate uses [Serverless Stack](https://serverless-stack.com/) 
to deploy a [Nuxt3](https://v3.nuxtjs.org/) application to AWS as a 
hybrid site. This means that the pages will be statically rendered 
while the server routes will be handled in AWS
[Lambda@edge](https://aws.amazon.com/lambda/edge/).

> This boilerplate is under active development. Right now this boilerplate 
> works around a limitation in Nuxt3 where it doesn't have an aws-lambda-edge 
> preset 'yet'. This feature is about to be merged and can be tracked here:
> https://github.com/unjs/nitro/pull/240

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

## Any requests?

Feel free to request any features or fixes. My aim is to have a fully functioning NuxtStack for most of the Nuxt site scenarios and then make a PR on SST to have it as a Stack that you can use out of the box.
