const path = require('path')

module.exports = {
  productionSourceMap: false,
  outputDir: path.resolve(__dirname, '../backend/public/'),
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/'
      },
      '/static': {
        target: 'http://localhost:3000/'
      }
    }
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: './index.html',
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://morning-sands-06185.herokuapp.com/'),
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 20,
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.whitespace = 'condense'
        return options
      })

    config
      .plugin('html')
      .tap(options => {
        options[0].minify = {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true
        }
        return options
      })
  }
}
