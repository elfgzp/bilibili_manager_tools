<template>
    <mt-tabbar fixed class="mt-tabbar" v-model="selected">
      <mt-tab-item id="settingTab">
        <img slot="icon" src="../assets/imgs/setting.svg">
        设置
      </mt-tab-item>
      <mt-tab-item id="danmakuTab">
        <img slot="icon" src="../assets/imgs/danmaku.svg">

        弹幕
      </mt-tab-item>
      <mt-tab-item id="smallDarkRoomTab">
        <img slot="icon" src="../assets/imgs/small_dark_room.svg">

        小黑屋
      </mt-tab-item>
      <mt-tab-item id="aboutTab">
        <img slot="icon" src="../assets/imgs/about.svg">
        关于
      </mt-tab-item>
    </mt-tabbar>
</template>

<script>
  import {Tabbar, TabItem} from 'mint-ui'

  export default {
    name: 'AppTabbar',
    data() {
      return {
        selected: ''
      }
    },
    components: {
      'mt-tabbar': Tabbar,
      'mt-tab-item': TabItem
    },
    watch: {
      selected: function (val) {
        this.$router.push({path: '/' + val})
      }
    }
  }
</script>

<style scoped>

</style>
