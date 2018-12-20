const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const portfinder = require('portfinder')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const webpackConfig = {
  entry: './src/main.js',
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true, // 模块热替换
    quiet: true, // 终端安静
    clientLogLevel: 'error', // 浏览器控制台安静
    disableHostCheck: true
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, 'src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules/webpack-dev-server/client')]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 模块热替换
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public'),
        to: ''
      }
    ])
  ]
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = webpackConfig.devServer.port
  portfinder.getPort((err, port) => { // 端口占用检测
    if (err) {
      reject(err)
    } else {
      webpackConfig.devServer.port = port
      webpackConfig.plugins.push(
        new FriendlyErrorsWebpackPlugin({
          compilationSuccessInfo: { // 监听构建成功
            messages: [`启动成功: http://${webpackConfig.devServer.host}:${port}`]
          }
        })
      )
      resolve(webpackConfig)
    }
  })
})
