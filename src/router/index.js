import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../pages/HelloWorld.vue'
import About from '../pages/About.vue'
import Danmaku from '../pages/Danmaku.vue'
import Login from '../pages/Login.vue'
import Setting from '../pages/Setting.vue'
import SmallDarkRoom from '../pages/SmallDarkRoom.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/settingTab',
      name: 'settingTab',
      component: Setting
    },
    {
      path: '/danmakuTab',
      name: 'danmakuTab',
      component: Danmaku
    },
    {
      path: '/smallDarkRoomTab',
      name: 'smallDarkRoomTab',
      component: SmallDarkRoom
    },
    {
      path: '/aboutTab',
      name: 'aboutTab',
      component: About
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
