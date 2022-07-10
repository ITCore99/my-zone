const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//优化压缩css 使用后会导致js压缩失败必须使用uglifyjs对js在进行压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')
const CssExtract = new MiniCssExtractPlugin({
    filename: '../css/[name].css'
});
const LessExtract = new MiniCssExtractPlugin({
    filename: '../scss/[name].css'
});
const webpack = require('webpack');
module.exports = {
    optimization: {
        minimizer: [
            new UglifyJSWebpackPlugin({
                cache: true,
                parallel: true, //并发压缩
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    mode: "production",
    entry: {
        'index':'./src/js/main.js'
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname,'dist/js'),
        // publicPath: "dist/"
    },
    _externals: {
      jquery: '$'
    },
    get externals() {
      return this._externals;
    },
    set externals(value) {
      this._externals = value;
    },
    module: {
        rules: [
            // {
            //     test:require.resolve('jquery'), //import引入时暴露到全局(window)变量
            //     use: 'expose-loader?$'
            // },
            // {
            //     test: /\.js$/,
            //     use:{
            //         loader: 'eslint-loader',
            //         options: {
            //             enforce: 'pre',  //强制提前执行
            //         }
            //     },
            //     exclude: /node_modules/
            // },
            // {
            //     test: /\.html$/,
            //     use: 'html-withimg-loader'
            // },
            {
                test:/\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'}
                ]
            },
            {
                test:/\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'},
                    {loader: 'sass-loader'}
                ]
            },
            {
                test:/.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 600, //小600使用base64大于600则使用file-loader处理
                        name:"[name].[hash:8].[ext]",
                        outputPath:'../img'
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            thunks: ['index'],
            hash: true,
            minify: {
                removeAttributeQuotes: true
            }
        }),
        new CleanWebpackPlugin(),
        CssExtract,
        LessExtract,
        new webpack.ProvidePlugin({     //全局注入变量模块
            '$': 'jquery'
        })
    ],
    devServer: {
        contentBase: 'dist',
        // open: true,
        progress: true,
        hot:true,
        compress: true
    }
}