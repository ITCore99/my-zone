let str = require("./a.js");
import './index.css'        //webpack默认只支持js模块 所以我们要引用插件将css处理成一个模块
import './index.less'
console.log(str+ "啊哈哈哈");
document.getElementById("app").innerHTML = str;
if(module.hot) {        //只要有热更新 页面改了 就调用
    module.hot.accept();
}