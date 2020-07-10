const path = require("path");
const pkg = require("./package.json");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = pkg.name || "特色产业金融服务平台"; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527; // dev port

function addStyleResource(rule){
  rule.use('style-resource')
  .loader('style-resources-loader')
  .options({
    patterns:[
      path.resolve(__dirname,'./src/styles/base.less')
    ]
  })
}
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api/busiess': {
        target: `http://127.0.0.1:8080`,
        changeOrigin: true,
        ws:true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      // modules: [path.resolve('node_modules')], // 对于需要引入的模块去node_modules下找
      extensions: ['.js', '.css', '.json', '.vue', '.ts'], // 配置扩展名，使用场景如下
      alias: {
        "@": resolve("src")
      }
    },
    // plugins:[new CompressionWebpackPlugin({
    //   filename:'[path].gz[query]',
    //   algorithm:'gzip',
    //   test:new RegExp('\\.('+['js','css'].join('|')+')$'),
    //   threshold:102,
    //   minRatio:0.8,
    //   deleteOriginalAssets:false
    // })]
  },
  chainWebpack(config) {
    config.plugins.delete("preload-index"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // less变量全局使用 需要安装style-resources-loader
    // const types=['vue-modules','vue','normal-modules','normal']
    // types.forEach(type=>addStyleResource(config.module.rule('less').oneOf(type)))
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
