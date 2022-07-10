//webpack是基于node的所以webpack遵循commonJs的规范
let path = require("path");
let HtmlWepackPlugin = require("html-webpack-plugin");  //插件是一个类 会导出一个函数 使用时new这个插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
//css文件分别抽离
let LessExtract= new ExtractTextWebpackPlugin({
    filename: 'css/less.css',
    disable: false,      //开发不抽离 上线在抽离
});
let CssExtract= new ExtractTextWebpackPlugin({
    filename: 'css/css.css',
    disable: false
});
//css 筛
let PurifyCssWebpack = require('purifycss-webpack');
let glob = require('glob');
//copy
let copyWbepackPlugin = require('copy-webpack-plugin');
//热更新
let webpack = require("webpack"); 
//单页：index.html 引用多个js
//多页： a.html引入a.js b.html引入b.js 
module.exports = {
    // entry: "./src/index.js" ,     //单文件入口 文件之间互相引用
    entry: ['./src/index.js','./src/b.js'] ,     //多文件入口  文件之间没有引用
    // entry: {                                //打包出多页 key-value key是打包完的页面名称 value是引入的js
    //     index: "./src/index.js",
    //     b: "./src/b.js"
    // },
    output: {       //出口 这是将项目打包为实体文件
        filename: "build.[hash:8].js",       //中间的hash是随机的哈希值 一个出口
        // filename: "[name].[hash:8].js",       //中间的hash是随机的哈希值 多个出口
        path: path.resolve("./build")              //这个路径必须是绝对路径
    }, 
    devServer: {                //开发服务器 让其不要打包成实体文件而是在内存中打包 
        contentBase:"./build", //就是以build目录起一个服务访问时会先访访问文件内存中找不到再找build目录下面 
        port: 1025,
        compress: true,     //服务器压缩
        open: true,      //打包完之后自动的弹出浏览器
        hot: true
    },
    module : {      //webpack 加载器
        rules: [     //从右往左写
            {
                test:/\.css$/,
                use:CssExtract.extract({
                    fallback: 'style-loader',        //当插件禁用时使用备用的style.less;
                    use: [
                        // {loader: 'style-loader'},使用这个插件我们的css样式将会已script标签的形式插入所以不需要style
                        {loader: 'css-loader'},      //注意css-loader本身自带热更新
                        {loader: 'postcss-loader'}
                    ]
                }) 
            }, 
            {
                test: /\.less/,
                use:LessExtract.extract({
                    fallback: 'style-loader',        //当插件禁用时使用备用的style.less;
                    use: [
                        // {loader: 'style-loader'},
                        {loader: 'css-loader'},
                        {loader: 'postcss-loader'},
                        {loader: 'less-loader'}
                    ]
                })
                
            }
        ]
    },
    plugins:[       //webpack插件 插件执行是由顺序的
        // new ExtractTextWebpackPlugin({       //单个抽离
        //    filename:"css/index.css" 
        // }),
        LessExtract,
        CssExtract,
        new copyWbepackPlugin([
            {
                from: "./src/public",
                to: 'public'
            }
        ]),
        new webpack.HotModuleReplacementPlugin (),
        new CleanWebpackPlugin(),   //重新打包时将上次打包好的文件 先删除再生成
        new HtmlWepackPlugin({
            filename: "index.html",         //打包完后文件的名称
            template: "./src/index.html",       //定义以页面为模板
            title: "这是我的第一个webpack项目(#^.^#)",      //打包后的title
            hash: true,  //会在引入文件时带上hash值
            minify: {       //将index文件进行迷你化
                removeAttributeQuotes: true,         //删除属性的双引号
                //collapseWhitespace: true            //折叠空行
            },
            //chunks:['index']        //引入的js文件
        }),
        // new HtmlWepackPlugin({
        //     filename: "b.html",
        //     template: "./src/index.html",       
        //     title: "这是我的第一个webpack项目(#^.^#)",      
        //     hash: true,  //会在引入文件时带上hash值
        //     minify: {       //将index文件进行迷你化
        //         removeAttributeQuotes: true,        
        //         //collapseWhitespace: true            
        //     },
        //     chunks:['b']        //引入的js文件
        // }),
        new PurifyCssWebpack({
            paths: glob.sync(path.resolve('src/*.html'))
        })
      
    ],
    mode: "development",        //可以更改模式 
    resolve: {      //配置解析

    }
}
/**
 * webpack开发服务器
 * 在webpack中如何配置开发服务器 需要安装一个模块叫做webpack-dev-server 我们在pack.json中通过start就可以启动 *我们的webpack服务 服务启动是根据devServe的参数来进行的。
 */
/**
 * wepack 插件 
 * 1、html-webpack-plugin 插件可以将我们开发的index.html页面，打包到build中作为项目入口文件，并且可以自动的引
 * 入生产的js。类似的vue脚手架dist下面的index.html 
 * 在webpack中要使用插件首先第一步就要将插件通过node的方式引入进来。
 * 对于每一个插件有哪些的参数能做什么功能我们不可能一一的记住但是使我们学会去哪里找 ？ 当然是npm官网去搜了。如* * https://www.npmjs.com/package/html-webpack-plugin。
 * 2、clear-webpack-plugin 插件是在打包之前先将之前的打包好的build文件夹删掉 再重新生成一个。 类似的vue打包的
 * 时候会将之前的dist删掉 在重新生成一个
 */
/***
 * webpack处理css 
 * webpack的两个核心一个是plugin一个是loader loader是专门用来处理模块
 */
/**
 * webpack抽离样式 将样式抽离到css文件中 如果我们不进行样式的抽离的话 所有的样式会以style的形式插入到打包完的js中会导致文件太庞大的问题。所以我们要抽离样式将样式抽离为css文件通过css的方式去引入样式。所以我们有需要安装插件extract-text-webpack-plugin@next(4.0以上安装) 代替的是mini-css-extract-plugin(目前有点bug)
 */
/**
 * css 筛选调无用样式 purifycss-webpck 配合插件 purify-css 和 glob 注意使用的时候必须要用到html plugin后面。
 */
/**
 * css加上hack兼容的插件postcss-loader autoprefixer 自动加前缀
 */
/**
 * 我们需要实现将一个src目录下的静态文件原封不动的放到build的目录下 不需要打包 插件 copy-webpack-plugin
 */