import Vue from 'vue'
import Vuex from 'vuex'
import VueLocalStorage from 'vue-localstorage'
import Live from '../bilibili-live/src/index.js'

Vue.use(VueLocalStorage)
Vue.use(Vuex)

let localStorage = Vue.localStorage
let blockList = []
let roomId = ''
let cookie = ''
const RECONNECT_DELAY = 3e3
let restartService = null


let userConfig = JSON.parse(localStorage.get('localConfig') || '{}')
let config = {
  onlineMessage: false,
  fansMessage: false,
  welcomeMessage: false,
  welcomeGuardMessage: false,
  commentMessage: true,
  giftMessage: true,
  guardBuyMessage: false,
  newFansMessage: false,
  blockMessage: true,
  showUserLevel: true,
  showUserTitle: true,
  showUserBadge: true,
  showUserVIP: true,
  showUserGuard: true,
  useGiftEnd: true,
  hideToolbar: false,
  showOnlineAndFans: false,
  danmakuFontSize: 14,
  danmakuDisplayTime: 10,
  danmakuBackgroundOpacity: 80,
  lockWindowHeight: false,
  danmakuMaxHeight: 600,
  useWebsocket: true,
  useHttps: false,
  useNotification: false,
}

let danmakuConfig = {
  mode: 'scroll',
  color: 'white',
  maxDanmakuCount: 100
}

if (userConfig) {
  roomId = userConfig.roomId || ''
  cookie = userConfig.cookie || ''
  blockList = userConfig.blockList || []
  if (userConfig.config) {
    Object.keys(config).forEach((key) => {
      if (userConfig.config.hasOwnProperty(key)) {
        config[key] = userConfig.config[key]
      }
    })
  }
  if (userConfig.danmakuConfig) {
    Object.keys(danmakuConfig).forEach((key) => {
      if (userConfig.danmakuConfig.hasOwnProperty(key)) {
        danmakuConfig[key] = userConfig.danmakuConfig[key]
      }
    })
  }
}

export default new Vuex.Store({

  namespaced: true,
  state: {
    roomId,
    cookie,
    config,
    danmakuConfig,
    userService: null,
    danmakuService: null,
    danmakuServiceStatus: 'close',
    lastDanmakuServiceRoomID: '',
    onlineNumber: '--',
    fansNumber: '--',
    roomInfo: null,
    userInfo: {
      archives: 0,
      avatar: "",
      bcoins: 0,
      coins: 0,
      current: 0,
      gold: "0",
      id: 0,
      level: 0,
      levelRank: 0,
      name: "正在加载...",
      next: 0,
      silver: "0",
      svip: true,
      vip: true
    },
    userRoom: null,
    danmakuPool: [],
    commentPool: [],
    giftPool: [],
    onlinePool: [],
    fansPool: [],
    areaList: []
  },
  getters: {
    localData(state) {
      return {
        roomId: state.roomId,
        cookie: state.cookie,
        config: state.config,
        danmakuConfig: state.danmakuConfig,
        musicConfig: state.musicConfig,
        blockList: state.blockList
      }
    }
  },
  mutations: {
    'SET_ROOM_ID'(state, payload) {
      state.roomId = payload.roomId
    },
    'SET_MAX_DANMAKU_COUNT'(state, payload) {
      state.danmakuConfig.maxDanmakuCount = payload.count
      if (state.danmakuPool.length > payload.count) {
          state.danmakuPool.splice(state.danmakuConfig.maxDanmakuCount - state.danmakuPool.length)
      }
    },
    'UPDATE_LAST_ROOM_ID'(state, payload) {
      state.lastDanmakuServiceRoomID = state.roomId
    },
    'SET_USER_SERVICE'(state, payload) {
      if (payload.userService) {
        payload.userService.setDanmakuConfig({
          danmakuMode: state.danmakuConfig.mode,
          danmakuColor: state.danmakuConfig.color
        })
        if (state.danmakuService) {
          payload.userService.setRoomId(state.danmakuService.roomId)
        }
      } else {
        if (state.userService) {
          state.userService.disconnect()
        }
      }
      state.userService = payload.userService
    },
    'SET_USER_INFO'(state, payload) {
      state.userInfo = payload.userInfo
    },
    'SET_USER_ROOM'(state, payload) {
      state.userRoom = payload.userRoom
    },
    'SET_DANMAKU_SERVICE'(state, payload) {
      state.danmakuService = payload.danmakuService
    },
    'SET_USER_COOKIE'(state, payload) {
      state.cookie = payload.cookie
    },
    'SET_CONFIG'(state, payload) {
      state.config = Object.assign({}, payload.config)
    },
    'SET_DANMAKU_MODE'(state, payload) {
      state.danmakuConfig.mode = payload.mode
      if (state.userService) {
        state.userService.setDanmakuConfig({
          danmakuMode: state.danmakuConfig.mode,
          danmakuColor: state.danmakuConfig.color
        })
      }
    },
    'SET_DANMAKU_COLOR'(state, payload) {
      state.danmakuConfig.color = payload.color
      if (state.userService) {
        state.userService.setDanmakuConfig({
          danmakuMode: state.danmakuConfig.mode,
          danmakuColor: state.danmakuConfig.color
        })
      }
    },
    'SET_MUSIC_CONFIG'(state, payload) {
      state.musicConfig = Object.assign({}, payload.musicConfig)
    },
    'SET_DANMAKU_SERVICE_STATUS'(state, payload) {
      state.danmakuServiceStatus = payload.status
    },
    'SET_ONLINE_NUMBER'(state, payload) {
      state.onlineNumber = payload.number
    },
    'SET_FANS_NUMBER'(state, payload) {
      state.fansNumber = payload.number
    },
    'SET_ROOM_INFO'(state, payload) {
      state.roomInfo = payload.info
    },
    'CLEAR_ALL_POOL'(state, payload) {
      state.danmakuPool = []
      state.commentPool = []
      state.giftPool = []
      state.onlinePool = []
      state.fansPool = []
      state.roomInfo = null
    },
    'PUSH_DANMAKU_POOL'(state, payload) {
      state.danmakuPool.push(payload.danmaku)
      if (state.danmakuPool.length > 0 && state.danmakuPool.length > state.danmakuConfig.maxDanmakuCount) {
        state.danmakuPool.splice(0, 1)
      }
    },
    'PUSH_COMMENT_POOL'(state, payload) {
      state.commentPool.push(payload.danmaku)
    },
    'PUSH_GIFT_POOL'(state, payload) {
      state.giftPool.push(payload.danmaku)
    },
    'PUSH_ONLINE_POOL'(state, payload) {
      state.onlinePool.push(payload.danmaku)
    },
    'PUSH_FANS_POOL'(state, payload) {
      state.fansPool.push(payload.danmaku)
    },
    'SET_AREA_LIST'(state, payload) {
      state.areaList = payload.areaList
    }
  },
  actions: {
    'UPDATE_ROOMID'({commit, getters}, roomId) {
      commit('SET_ROOM_ID', roomId)
      localStorage.set('localConfig', JSON.stringify(getters.localData))
    },
    'UPDATE_MAX_DANMAKU_COUNT'({commit, getters}, count) {
      commit('SET_MAX_DANMAKU_COUNT', count)
      localStorage.set('localConfig', JSON.stringify(getters.localData))
    },
    'UPDATE_COOKIE'({commit, getters}, cookie) {
      commit('SET_USER_COOKIE', cookie)
      localStorage.set('localConfig', JSON.stringify(getters.localData))
    },
    'UPDATE_CONFIG'({commit, getters}, config) {
      commit('SET_CONFIG', config)
      localStorage.set('localConfig', JSON.stringify(getters.localData))
    },
    'UPDATE_DANMAKU_MODE'({commit, getters}, mode) {
      commit('SET_DANMAKU_MODE', mode)
      localStorage.set('localConfig', JSON.stringify(getters.localData))
    },
    'UPDATE_DANMAKU_COLOR'({commit, getters}, color) {
      commit('SET_DANMAKU_COLOR', color)
      localStorage.set('localConfig', JSON.stringify(getters.localData))
    },
    'START_DANMAKU_SERVICE'({state, commit, dispatch}) {
      clearTimeout(restartService)
      commit('SET_DANMAKU_SERVICE_STATUS', {
        status: 'connect'
      })
      new Live.Room({
        url: state.roomId,
        useWebsocket: state.config.useWebsocket,
        useWSS: state.config.useHttps,
        useGiftBundle: state.config.useGiftEnd
      }).connect().then(room => {
        if (state.danmakuService) {
          state.danmakuService.disconnect()
          state.danmakuService.removeAllListeners()
          if (state.lastDanmakuServiceRoomID != state.roomId) {
            commit('SET_ONLINE_NUMBER', {
              number: '--'
            })
            commit('SET_FANS_NUMBER', {
              number: '--'
            })
            commit('CLEAR_ALL_POOL')
          }
          commit('UPDATE_LAST_ROOM_ID')
        }
        room
          .on('danmaku.connect', () => {
            console.log('正在连接至弹幕服务器')
            commit('SET_DANMAKU_SERVICE_STATUS', {
              status: 'open'
            })
          })
          .on('danmaku.close', () => {
            console.log('弹幕服务已关闭')
            commit('SET_DANMAKU_SERVICE_STATUS', {
              status: 'close'
            })
          })
          .on('danmaku.error', () => {
            commit('SET_DANMAKU_SERVICE_STATUS', {
              status: 'error'
            })
            restartService = setTimeout(() => {
              dispatch('START_DANMAKU_SERVICE')
            }, RECONNECT_DELAY)
          })
          .on('danmaku.message', (msg) => {
            console.log(msg)
            if (msg.type == 'gift') {
              commit('PUSH_DANMAKU_POOL', {
                danmaku: msg
              })
              commit('PUSH_GIFT_POOL', {
                danmaku: msg
              })
            } else if (msg.type == 'online') {
              commit('PUSH_ONLINE_POOL', {
                danmaku: msg
              })
              commit('SET_ONLINE_NUMBER', {
                number: msg.number
              })
            } else if (msg.type == 'comment') {
              commit('PUSH_DANMAKU_POOL', {
                danmaku: msg
              })
              commit('PUSH_COMMENT_POOL', {
                danmaku: msg
              })
            } else if (msg.type == 'welcome' || msg.type == 'welcomeGuard' || msg.type == 'guardBuy' || msg.type == 'block') {
              commit('PUSH_DANMAKU_POOL', {
                danmaku: msg
              })
            }
          })
          .on('info', (info) => {
            commit('SET_FANS_NUMBER', {
              number: info.fans
            })
            commit('SET_ROOM_INFO', {
              info: info
            })
          })
          .on('newFans', (fans) => {
            commit('PUSH_FANS_POOL', {
              danmaku: fans
            })
            commit('PUSH_DANMAKU_POOL', {
              danmaku: fans
            })
          })
        if (state.danmakuPool.length === 0) {
          room._api.getRoomMessage().then(res => {
            state.danmakuPool = res || []
            if (state.danmakuPool.length > state.danmakuConfig.maxDanmakuCount) {
              state.danmakuPool.splice(state.danmakuConfig.maxDanmakuCount - state.danmakuPool.length)
            }
          })
        }
        if (state.userService) {
          state.userService.setRoomId(room.roomId)
        }
        commit('SET_DANMAKU_SERVICE', {
          danmakuService: room
        })
      })
    },
    'STOP_DANMAKU_SERVICE'({state, commit, dispatch}) {
      commit('SET_DANMAKU_SERVICE_STATUS', {
        status: 'close'
      })
      if (state.danmakuService) {
        state.danmakuService.disconnect()
        commit('SET_ONLINE_NUMBER', {
          number: '--'
        })
        commit('SET_FANS_NUMBER', {
          number: '--'
        })
        commit('CLEAR_ALL_POOL')
        commit('SET_DANMAKU_SERVICE', {
          danmakuService: null
        })

      }

    },
    'START_USER_SERVICE'({state, commit, dispatch}) {
      new Live.User({
        cookie: state.cookie,
        useInfoService: true
      }).connect().then(user => {
        if (!user) {
          dispatch('UPDATE_COOKIE', {
            cookie: ''
          })
          commit('SET_USER_SERVICE', {
            userService: null
          })
          return
        }
        new Live.API({
          cookie: state.cookie
        }).getUserInfo().then(res => {
        })
        user
          .on('info.user', (info) => {
            commit('SET_USER_INFO', {
              userInfo: info
            })
          })
          .on('info.room', (info) => {
            commit('SET_USER_ROOM', {
              userRoom: info
            })
          })
          .on('send.success', (danmaku) => {
            commit('PUSH_DANMAKU_POOL', {
              danmaku: {
                type: 'sendLog',
                success: true,
                msg: ''
              }
            })
          })
          .on('send.failed', (danmaku, msg) => {
            commit('PUSH_DANMAKU_POOL', {
              danmaku: {
                type: 'sendLog',
                success: false,
                msg: msg
              }
            })
          })
        commit('SET_USER_SERVICE', {
          userService: user
        })
      })
    },
    'UPDATE_AREA_LIST'({state, commit, dispatch}) {
      new API().getAreaList().then(res => {
        commit('SET_AREA_LIST', {
          areaList: res
        })
      })
    }
  }

})
