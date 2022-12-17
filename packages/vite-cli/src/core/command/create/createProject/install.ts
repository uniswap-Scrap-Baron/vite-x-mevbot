import options from '@/shared/options'
import { cyan } from '@/utils/log'
import createSpawnCmd from '@/utils/createSpawnCmd'
import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import gradient from 'gradient-string'
async function installationDeps() {
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  // 目录
  const cmdIgnore = createSpawnCmd(options.dest, 'ignore')
  const cmdInherit = createSpawnCmd(options.dest, 'inherit')
  // 开始记录用时
  const startTime: number = new Date().getTime()
  logger(
    `> The project template is generated in the directory： ${options.dest}`
  )
  // Git 初始化
  await cmdIgnore('git', ['init'])
  await cmdIgnore('git', ['add .'])
  await cmdIgnore('git', ['commit -m "Initialize by VITE_CLI"'])
  gradient('cyan', 'purple')(`> repository initialized successfully`)
  if (options.package !== 'none') {
    // 依赖安装
    logger(
      `> Dependencies are being installed automatically, please wait a moment...`
    )
    await cmdInherit(options.package, ['install'])
  }

  const endTime: number = new Date().getTime()
  const usageTime: number = (endTime - startTime) / 1000
  logger(
    `> 📦📦 Usage time ${usageTime}s , Please enter the following command to continue...`
  )
  logger('Project created successfully')
  logger(`cd ${options.name}`)
  if (options.package !== 'none') {
    logger(
      options.package === 'npm'
        ? `${options.package} run dev`
        : `${options.package} dev`
    )
  } else {
    logger(`npm run install`)
    logger('npm run dev')
  }
}
export default installationDeps

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}

function logger(string: string) {
  console.log(gradient('cyan', 'purple')(string))
  console.log('')
}
