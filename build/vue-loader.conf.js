'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

var env = process.env.NODE_ENV === 'testing'
? require('../config/test.env')
: config.build.env
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 20 versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8']
      })
    ]
  },
  postcss: [
    require('autoprefixer')({
      browsers: ['last 20 versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8']
     })]
  // postcss: [
  //   require('autoprefixer')({
  //     browsers: ['last 7 versions', 'Firefox >= 3', 'Chrome >= 30']
  //   })
  // ]
}
