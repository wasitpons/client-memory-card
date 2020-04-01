const withPlugins = require('next-compose-plugins');
const withCss = require('@zeit/next-css');
const withSaas = require('@zeit/next-sass');
const withSourceMaps = require('@zeit/next-source-maps');
const withImages = require('next-images');

const webpackConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style\/css.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }
    return config;
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  devIndicators: {
    autoPrerender: false,
  },
}

module.exports = withPlugins([
  [ withSaas, webpackConfig ],
  [ withCss ],
  // [ withSourceMaps ],
  [ withImages ]
])
