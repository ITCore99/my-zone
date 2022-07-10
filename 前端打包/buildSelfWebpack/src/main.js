import  "./js/test";
import {add,mul} from "./js/mathUtils";
import "./css/normal.css";
import "./css/specialLess.less";
import "./css/specialSass.scss"
console.log(add(1,2));
console.log(mul(2,3));

//进行vue开发
import Vue from "vue";
import App from "./views/app.vue"
new Vue({
     el: "#app",
     components:{
        App:App
     },
     template: '<App/>'
 })