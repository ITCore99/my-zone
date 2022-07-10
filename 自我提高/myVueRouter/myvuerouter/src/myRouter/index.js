// 首先我们理解设置路由的思路：思路是这样的第一步就是我们去监听浏览器端的路径变化->我们人修改router中的一个变量 ->在接着我们通过这个变量去匹配我们的路由映射表并且找到我们对应的组件 ->对组件的渲染。

// History类我们用来存储我们router中的变量current
class History {
  constructor () {
    this.current = null
  }
}
// Router类就是我们的路由类
class MyRouter {
  constructor (options) {
    // 定义路由的模式
    this.mode = options.mode || 'hash'
    this.routes = options.routes || []
    this.routeMap = this.createRouteMap(options.routes)
    this.history = new History()
    this.init()
  }
  // 初始我们的路由
  init () {
    if (this.mode === 'hash') {
      // 为输入的路由添加#值
      location.hash = location.hash ? location.hash : '/'
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1)
        // 注册hash改变事件
        window.addEventListener('hashchange', function () {
          this.history.current = location.hash.slice(1)
        })
      })
    } else {
      location.pathname = location.pathname ? location.pathname : '/'
      window.addEventListener('load', () => {
        this.history.current = location.pathname
        window.addEventListener('popstate', () => {
          let path = location.pathname
          this.history.current = path
        })
      })
    }
  }
  // 创建组件映射对象
  createRouteMap (routeArr) {
    return routeArr.reduce((prev, current) => {
      prev[current.path] = current.component
      return prev
    }, {})
  }
}
MyRouter.install = function (Vue) {
  Vue.mixin({
    beforeCreate () {
      if (this.$options && this.$options.router) {
        this._root = this // 给vue实例添加_root指向自己
        this._router = this.$options.router
        // 监听 render函数依赖current current变化会触发render更新
        Vue.util.defineReactive(this, 'current', this._router.history)
      } else { // 使得_root永远指向vue根实例
        this._root = this.$parent._root
      }
    }
  })
  // 注册router-view 组件作为出口
  Vue.component('router-view', {
    render (h) {
      // this指向要渲染组件的代理 this._self 指向这个渲染组件 this._self._root Vue根实例
      console.log('render', this._self._root)
      let current = this._self._root._router.history.current
      let routeMap = this._self._root._router.routeMap
      console.log(`${current} => ${routeMap[current]}`)
      return h(routeMap[current])
    }
  })
}
export default MyRouter
