import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
/** 首先我们在这里准备下准备下vue插件的创建的的原理 众所周知我们在vue中使用插件就是使用vue.use()函数来进行。
 * 那么对于这样一个函数他到底做了什么其实use()函数做了两件事第会对你传入的东西进行执行。如函数含有一个特性是如果你传入的无论是函数还是对象如果存在install属性就只会执行install属性,并会将vue的对象传入作为参数 如下例子。
 */
function a (param) {
  // 这里如我们的所说确实打印了,参数为vue对象
  // console.log(`我被打印了`)
  // console.log(param)
}
function b () {
  // console.log(`我被打印了？`)
}
b.install = function (param) {
  // 确实如上面所说只会执行install
  // console.log(`我是install`)
  // console.log('install 中的参数', param)
}
Vue.use(a)
Vue.use(b)

/**
 * 我们也可以也可以在调用vue.utils.defineReactive()方法来对我们vue外层的对象进行响应式变化这里要配合我们的mixin
 * mixin函数就是混入 我们可将将我们逻辑混入到所需要混入的vue组件实例中 特别需要注意的是如果我们混入生命周期会在组件的生命周期执行时也会执行我们混入的生命周期，一般用户混入公用的方法以便在其他组件中使用。mixin中的this指的就是当前的vue组件对象。
 * vue的一系列api
 */
// 申明一个外部的对象
var test = {
  a: 1
}
// 定时器延时的去改变外部变量
setTimeout(() => {
  test.a = 4
}, 5000)
function c () {

}
c.install = function (Vue) {
  // 监听外部对象
  Vue.util.defineReactive(test, 'a')
  Vue.mixin({
    data () {
      return {
        messageMIx: 'mixin 测试字符串'
      }
    },
    beforeCreate () {
      // 会打印三份 第一份new vue的全局实beforeCreate时 第二份时app.vue的第三份是helloWorld.vue的
      // console.log('I am beforeCreate')
      // 给vue实例注册外部的对象
      this.testA = test
    }
  })
}
Vue.use(c)
// console.log(`vue的一系列 api`, Vue.util)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
