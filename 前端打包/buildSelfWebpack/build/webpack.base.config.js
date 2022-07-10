const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack")
module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    filename: "bundle.[thunkHash].js",
    path: path.resolve(__dirname, "../dist"),
    //publicPath:'dist/'      //会在所有的url前面拼接上 由于解决在未打包html之前解决图片路径问题
  },
  watch: true, // 监控
  watchOptions: {
    poll: 1000, // 每秒 检查1000次
    ignored: /node_modules/
  },
  module: {
    noParse: /jquery/, // 可以指定一些包不去解析，上面的例子表示不想解析jquery中包的依赖
    rules: [
      // {
      //   test: require.resolve('jquery'), // 只要在代码中引用了就将其暴露出去到全局window上
      //   use: 'expose-loader?$'
      // },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader', options: { insertAt: 'top' } }, 'css-loader', 'postcss-loader']
      },
      {
        test: /.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 600,
              name: "img/[name].[hash:8].[ext]",
              outputPath: 'img/',  //表示我们将文件输出到那个目录下
              publicPath: 'http://www.baidu.com' // 图片引入会统一使用拼接路径

            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-loader', //解决html中通过img方式引入的图片问题
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'eslint-loader', // 先安装elslint
          options: {
            enforce: 'pre' //强制在前面执行
          }
        }

      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  resolve: {  // 解析第三方包 解决一些
    //别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'bootstrap': 'bootstrap/dist/css/bootstrap.css',
    },
    extensions: ['.js', '.css'], // 这样就是我们先找js js找不到再找css 这样我们引入的时候可以不用谢后缀名
    mainFields: ['style', 'main'], // 通过修改寻找主入口文件名字 会先找style如果找不到style再找main
    module: [path.resolve('node_modules')] // 告诉commonjs 查找的时候只需要在当前模块下查找 不需要往上层找
  },
  externals: {        //表示是外部引入模块不需要打包如情况：使用cdn引入后又通过import引入
    jquery: '$'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.ProvidePlugin({ // 在每一个模块中都注入$符可以在模块中直接使用$调用jquery方法
      $: 'jquery',
      axios: 'axios'
    }),
    new webpack.DefinePlugin({ // 定义一些环境变量
      // DEV: "'dev'"  // 等同于下面的两种写法方式
      DEV: JSON.stringify('dev')
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "创建自己的webpack项目",
      template: "./index.html",
      filename: "index.html",
      favicon: "./src/img/small.jpg",
      hash: true,
      showErrors: true,
      minify: {
        removeAttributeQuotes: true,
      }
    }),
    new copyWebpackPlugin(
      [
        {
          from: "./src/public",
          to: "public"
        }
      ]),

  ]
}