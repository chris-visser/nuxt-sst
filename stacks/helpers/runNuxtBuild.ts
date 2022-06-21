import spawn from 'cross-spawn'
import chalk from 'chalk'
import { copyFileSync } from 'fs'

export const runNuxtBuild = (sitePath: string) => {

  console.log(chalk.grey(`Building Nuxt site "${ sitePath }"`))
  const result = spawn.sync(
    'yarn build',
    [],
    {
      cwd: sitePath,
      stdio: 'inherit',
      env: process.env
    }
  )
  if (result.status !== 0) {
    console.error(
      `There was a problem building the NuxtSite.`
    )
    process.exit(1)
  }

  // Workaround to allow nuxt in lambda edge until preset is available. See:
  // https://github.com/unjs/nitro/pull/240
  copyFileSync(`${sitePath}/static/wrapper.mjs`, `${sitePath}/.output/server/wrapper.mjs`);

}