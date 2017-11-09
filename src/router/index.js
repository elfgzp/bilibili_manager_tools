import Vue from 'vue'
import Router from 'vue-router'
import About from '../pages/About.vue'
import Danmaku from '../pages/Danmaku.vue'
import Login from '../pages/Login.vue'
import Setting from '../pages/Setting.vue'
import SmallDarkRoom from '../pages/SmallDarkRoom.vue'
import BaseSetting from '../pages/BaseSetting.vue'
import UserCenter from '../pages/UserCenter.vue'
import CustomDanmaku from '../pages/CustomDanmaku.vue'
import EditCustomDanmaku from '../pages/EditCustomDanmaku.vue'

Vue.use(Router)

export default new Router({
  routes: [
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
    },
    {
      path: '/BaseSetting',
      name: 'BaseSetting',
      component: BaseSetting
    },
    {
      path: '/UserCenter',
      name: 'UserCenter',
      component: UserCenter
    },
    {
      path: '/CustomDanmaku',
      name: 'CustomDanmaku',
      component: CustomDanmaku
    },
    {
      path: '/EditCustomDanmaku',
      name: 'EditCustomDanmaku',
      component: EditCustomDanmaku
    },
  ]
})
