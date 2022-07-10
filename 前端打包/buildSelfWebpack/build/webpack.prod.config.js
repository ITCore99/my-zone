const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const WebpackMerge = require("webpack-merge");
const WebpackBaseConfig = require("./webpack.base.config")
module.exports = WebpackMerge(WebpackBaseConfig,{
    plugins: [
        new UglifyjsWebpackPlugin(),
    ]
})