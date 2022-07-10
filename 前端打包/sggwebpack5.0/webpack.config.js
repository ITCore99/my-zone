const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 抽离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css压缩
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const workboxWebpackPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack');
// 
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
//设置node js环境变量
process.env.NODE_ENV = 'development';

module.exports = {
  entry: ['./src/js/index.js'],
  // entry: {
  //   main: './src/js/index.js',
  //   test: './src/js/test.js'
  // },
  output: {
    filename: 'js/[name].[contentHash:10].js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          // 自动修复
          fix: true
        }
      },
      {
        // 一下的loader只会匹配一个
        // 注意: 不能有两个配置处理同一个类型的问文件 如：eslint-loader 和babel-loader就不能放到oneOf中
        oneOf: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {  // 开启多进程打包
                loader: 'thread-loader',
                options: {
                  workers: 2 //开启两个进程打包
                }
              },
              {

                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        // 按需加载
                        useBuiltIns: 'usage',
                        //指定core-js版本
                        corejs: {
                          version: 3
                        },
                        // 指定兼容性做到那个版本的浏览器
                        targets: {
                          chrome: '60',
                          firefox: '50',
                          ie: '9',
                          safari: '10'
                        }
                      }
                    ]
                  ],
                  // 开启babe缓存
                  cacheDirectory: true
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              // 'style-loader', 
              // 这个loader取代style-loader。作用是提取js中的css为单独文件
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-preset-env')()
                  ]
                }
              }
            ]
          },
          {
            test: /\.less$/,
            use: [
              'style-loader',
              'css-loader',
              'less-loader'
            ]
          },
          {
            test: /\.(png|gif|jpg)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8 * 1024,
                  esModule: false,
                  name: '[hash:10].[ext]',
                  outputPath: 'imgs'
                }
              }
            ]
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          },
          // 打包其他资源(除了html/js/css资源以外的资源)
          {
            exclude: /\.(css|less|js|html|png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[hash:10].[ext]',
                  outputPath: 'assets'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.[contentHash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new workboxWebpackPlugin.GenerateSW({
      /**
       * 1、帮助serviceworker快速启动
       * 2、删除旧的serviceworker
       * 
       * 生成一个serviceworker配置文件
       */
      clientsClaim: true,
      skipWaiting: true
    }),
    // 告诉webpack那些库不参与打包 同时在代码中使用这些库时 名称也得变
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ],
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    port: 1024,
    open: true,
    // 开启HMR功能那
    hot: true,
    compress: true
  },
  // 代码分割
  optimization: {
    splitChunks: {
      cacheGroups: { //缓存组
        common: { // 公共代码块
          chunks: 'initial', // 从哪里开始 从入口开始
          miniChunks: 3,  // 引用多少次
        },
        vendor: { //抽离第三方模块
          priority: 1,  // 权重
          test: /node_modules/, //将引入的第三方模块抽离
          chunks: 'initial', // 从哪里开始 从入口开始
          miniChunks: 3,  // 引用多少次
        }
      },
    }
  },

  mode: 'production',
  // externals: {
  //   // 忽略npm库名----包名 拒绝jquery被打包进来 需要我们手动的引入jquery cdn
  //   jquery: 'jQuery'
  // },
  devtool: 'eval-source-map'

}
/**
 * source-map
 * [inline-|hidden-|eval-][nosources-][cheap-[module]]source-map
  能提示到错误代码准确信息和源代码的位置
  source-map: 外部
  能提示到错误代码准确信息和源代码的位置
  inline-source-map: 内联 只生成一个内联的source-map中
  // 能提示到错误代码错误原因 不能追踪中到源代码位置只能提示到构建后代码的位置。不隐藏构建后
  hidden-source-map: 外部
  能提示到错误代码准确信息和源代码的位置
  eval-source-map: 内联 每一个文件会生成一个source-map都在eval中
  能提示到错误代码准确信息 但是没有任何源代码信息 全部隐藏
  nosources-source-map: 外部
  能提示到错误代码准确信息和源代码的位置 但只能精确到行而其他的话不仅可以行还可以到列
  cheap-source-map: 外部
  能提示到错误代码准确信息和源代码的位置 但只能精确到行而其他的话不仅可以行还可以到列
  module会将webpackde loader也及再进来
  cheap-module-source-map: 外部
 */