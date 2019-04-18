'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      
      '/api/getPurlUrl': {
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',//设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        bypass:function(req,res,proxyOptions){
          req.headers.referer="https://y.qq.com/";
          req.headers.origin="https://y.qq.com/";
          res.header("Content-Type", "application/x-www-form-urlencoded");
        },
        pathRewrite: {
          '^/api/getPurlUrl': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/api/getLyric': {
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',//设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        bypass:function(req,res,proxyOptions){
          req.headers.referer="https://c.y.qq.com";
          req.headers.host="c.y.qq.com";
        },
        pathRewrite: {
          '^/api/getLyric': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/api/getCdInfo':{
          target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',//设置你调用的接口域名和端口号 别忘了加http
          changeOrigin: true,
          bypass:function(req,res,proxyOptions){
            req.headers.referer="https://y.qq.com/";//不是https://c.y.qq.com/
            req.headers.host="c.y.qq.com";
          },
          pathRewrite: {
            '^/api/getCdInfo': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
          }
      },

      '/api/getSuggest':{
        target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',//设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        bypass:function(req,res,proxyOptions){
          req.headers.referer="https://c.y.qq.com/";//不是https://c.y.qq.com/
          req.headers.host="c.y.qq.com";
        },
        pathRewrite: {
          '^/api/getSuggest': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
    }
    },

    // Various Dev Server settings
    host: '192.168.177.42', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
