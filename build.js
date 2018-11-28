const path = require('path')
const ora = require('ora')
const rm = require('rimraf')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.js')

const spinner = ora('building for production...')
spinner.start()

rm(path.resolve(__dirname, 'lib'), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('大功告成！👏 👏 👏\n'))
    console.log(chalk.yellow(
      'Tip: 提交 PR 之前不要忘记修改 package.json 里的版本号哦！方便我 Review 后麻溜溜的发布到 npm。\n'
    ))
  })
})
