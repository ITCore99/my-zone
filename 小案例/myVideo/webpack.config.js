const path = require('path')
const webpack = require('webpack')
const {CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const ScssExtract = new ExtractTextWebpackPlugin({
    filename: '../css/scss.css',
    disable: false
});

module.exports = {
    mode: "development",
    entry: {
        'index': './src/js/index.js'
    },
    output: {
        filename: '[name]_bundle.[hash:8].js',
        path: path.resolve(__dirname,"dist/js")
    },
    module: {
        rules: [
           {
               test: /\.scss$/,
               use: ScssExtract.extract({
                   fallback:'style-loader',
                   use: [
                        { loader: "css-loader"},
                        { loader: "sass-loader"}
                    ]
               })
           } 
        ]
    },
    devServer: {
        contentBase: './dist',
        port: 1024,
        compress: false,
        hot: true,
        open: true
    },
    plugins: [
      
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: '../index.html',
            inject: true,
            title: 'myVideo',
            chunks: ['index']
        }),
        new webpack.HotModuleReplacementPlugin(),
        ScssExtract,
        new CleanWebpackPlugin()

    ]
}