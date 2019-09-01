'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
console.log(process.env,8787);
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Element Admin' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
// process.env.port 这个其实就是默认是8080端口，也就是说你不设置8214端口默认就会启动8080端口，这个其实就是启动项目的端口设置问题
const port = process.env.port || process.env.npm_config_port || 8126 // dev port
// process.env.port 与 process.env.NODE_ENV 的区别
// All configuration item explanations can be find in https://cli.vuejs.org/config/
// vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   * https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE 全局cli配置链接
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  // 在开发环境启动eslint代码检查，我这里关闭了。
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  /*
   * 就是生产环境的时候，出错了就会输出一些map文件。一般设置为false即可。把这个改为false。不然在最终打包的文件中会出现一些map文件，map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出*的错误信息无法准确得知是哪里的代码报错。
	 *有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
  */
  productionSourceMap: false,
  /*vue启动项目时候的配置  链接：https://webpack.js.org/configuration/dev-server/#devserveropen*/
  devServer: {
    port: port,//服务启动的端口
    open: true,//服务启动后true就是自动打开默认的浏览器
    // 看下面errors设为true，就是编译的时候，出现错误的时候全屏显示出现的错误位置。如果warning也显示全屏的话也设置为true即可，一般不需要。
    overlay: {
      warnings: false,
      errors: true
    },
    /*
			代理。如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。这会告诉开发服务器将任何未知请求 (没有匹配到静态文件的请求) 代理到你设置的地址。
			proxyTable: {
        '/api': { 
             target: 'http://jddaudit.jd.com', //代理地址
             changeOrigin: true, //可否跨域
             pathRewrite: {
             '^/api': '/' //重写接口，去掉/api
            }
        }
    },
    */ 
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      ///dev-api
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${port}/mock`,//目标域，即远程请求域
        changeOrigin: true,//true是允许跨域
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''//以 /dev-api 开头
        }
      }
    },
    // 服务器启动完成之后要干的事，钩子函数，在启动服务的时候，把mock服务启动起来了
    after: require('./mock/mock-server.js')

    // function(app, server) {
    //   // do fancy stuff
    //   console.log("服务器启动之后的钩子函数");
    // }
  },
  // 这是对webpack配置的一些调整
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    // 这个name是index.html那里使用的
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  // webpack链式操作。chainWebpack 配置项允许我们更细粒度的控制 webpack 的内部配置，其集成的是 webpack-chain这一插件，该插件可以让我们能够使用链式操作来修改配置
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
