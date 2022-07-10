import Vue from 'vue'
// import Router from 'vue-router'
import Router from '../myRouter/index'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/t',
      name: 'test',
      component: Test
    }
  ]
})
