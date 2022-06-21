import { NuxtStack } from "./NuxtStack";
import { App } from "@serverless-stack/resources";

export default function (app: App) {

  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "app",
    bundle: {
      format: "esm",
    },
  });
  app.stack(NuxtStack, {
    description: 'Nuxt hybrid stack. Server routes + dynamic pages are handled by Lambda@edge and static pages by S3'
  });
}
