/**
 * 使用dll技术可以对某些库(第三方库:jquery、react、vue...)进行单独打包
 */
const path = require('path');
const webpack = require('webpack')
module.exports = {
  entry: {
    // 最终打包生成的[name] ==> jquery
    // ['jquery'] 指的是要打包的库是jquery,由于是数组可以将多个库进行合并打包 
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',   //取上面的name
    path: path.resolve(__dirname, 'dll'),  //指输出的路径
    library: '[name]_[hash:8]' //打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包一个manifest.json为我们提供一个映射关系 告诉我们jquery不在需要打包 并且向外暴露的是[name]_       [hash:8]这个名称
    new webpack.DllPlugin({
      name: '[name]_[hash:8]', // 映射库的暴露的名称
      path: path.resolve(__dirname, 'dll/manifest.json') //输出文件的名称
    })
  ],
  mode: 'production'
}