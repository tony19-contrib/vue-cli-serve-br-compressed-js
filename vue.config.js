const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.js$/,
      }),
    ],
  },
  devServer: {
    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      middlewares.unshift({
        name: 'serve-brotli-js',
        path: '*.js',
        middleware: (req, res, next) => {
          if (req.get('Accept-Encoding')?.includes('br')) {
            req.url += '.br'
            res.set('Content-Encoding', 'br')
            res.set('Content-Type', 'application/javascript; charset=utf-8')
          }
          next()
        }
      })

      return middlewares
    }
  },
}
