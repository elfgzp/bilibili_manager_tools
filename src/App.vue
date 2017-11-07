<template>
  <div id="app">
    <app-header></app-header>
    <router-view class="main-contain"></router-view>
    <app-tabbar></app-tabbar>
  </div>
</template>

<script>
  import AppHeader from "./components/AppHeader.vue";
  import AppTabbar from "./components/AppTabbar.vue";

  export default {
    components: {
      'app-tabbar': AppTabbar,
      'app-header': AppHeader
    },
    name: 'app',
    data() {
      return {}
    },
    computed: {
      version() {
        return this.$store.state.version
      },
      roomId() {
        return this.$store.state.roomId
      },
      cookie() {
        return this.$store.state.cookie
      },
      userService() {
        return this.$store.state.userService
      },
      danmakuService() {
        return this.$store.state.danmakuService
      },
      userInfo() {
        return this.$store.state.userInfo
      },
      userRoom() {
        return this.$store.state.userRoom
      },
    },
    watch: {
      cookie(val) {
        if (val) {
          this.loginUser()

        }
      }
    },
    mounted() {
      if (this.cookie && !this.userService) {
        this.loginUser()
      }
      if (this.roomId && !this.danmakuService){
        this.startDanmaku()
      }
    },
    methods: {
      loginUser() {
        this.$store.dispatch({
          type: 'START_USER_SERVICE'
        })
      },
      startDanmaku() {
        this.$store.dispatch({
          type: 'START_DANMAKU_SERVICE'
        })
      }
    }
  }
</script>

<style>
  html, body {
    height: 100%;
    overflow: hidden;

  }

  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 40px;
    overflow-y: scroll;
  }

  .mint-cell {
    min-height: 35px;
    width:  100%;
  }

  .mint-cell-value {
    width: 100%;
  }

  .mint-cell-text {
    font-size: 12px;
  }

  .mint-cell-wrapper {
    background-color: #f8f8f8;
  }

  .mint-field-core {
    background-color: #f8f8f8;
  }


</style>
