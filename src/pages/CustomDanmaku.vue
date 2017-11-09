<template>
  <div>
    <sub-header headerTitle="自定义弹幕" :rightButton="{name: '添加', method: this.addCustomDanmaku}"></sub-header>
    <div class="customDanmakuList" v-for="(danmaku, index) in customDanmakuList">
      <mt-cell>
        <div class="customDanmaku" @click="customDanmakuSelect(danmaku, index)">{{danmaku}}</div>
      </mt-cell>
    </div>
    <mt-actionsheet :actions="customDanmakuSheetActions" v-model="customDanmakuSheetVisible"></mt-actionsheet>
  </div>
</template>

<script>
  import {Cell, Button, Toast, Actionsheet} from 'mint-ui';

  import SubHeader from '../components/SubHeader.vue'


  export default {
    components: {
      'sub-header': SubHeader,
      'mt-cell': Cell,
      'mt-button': Button,
      'mt-actionsheet': Actionsheet
    },
    name: 'CustomDanmaku',
    data() {
      return {
        danmakuContent: '',
        danmakuIndex: 0,
        customDanmakuSheetVisible: false
      }
    },
    computed: {
      userService() {
        return this.$store.state.userService
      },
      danmakuService() {
        return this.$store.state.danmakuService
      },
      customDanmakuList() {
        return this.$store.state.customDanmakuList
      },
      customDanmakuSheetActions() {
        return [
          {
            name: '发射',
            method: this.sendDanmaku
          }, {
            name: '编辑',
            method: this.editDanmaku
          }]
      }
    },
    methods: {
      addCustomDanmaku() {
        this.$router.push('/EditCustomDanmaku')
      },
      customDanmakuSelect(danmaku, index) {
        this.danmakuContent = danmaku
        this.danmakuIndex = index
        this.customDanmakuSheetVisible = true
      },
      sendDanmaku() {
        if (!this.danmakuService) {
          return Toast({
            message: '请先开启弹幕姬',
            position: 'bottom',
          })
        }
        if (!this.userService) {
          return Toast({
            message: '请先登录',
            position: 'bottom',
          })
        }
        this.userService.sendMessage(this.danmakuContent)
        this.$router.go(-1)
      },
      editDanmaku() {
        this.$router.push({name: 'EditCustomDanmaku', params: {index: this.danmakuIndex}})
      }
    }
  }
</script>

<style scoped>
  .customDanmaku {
    color: #000000;
    width: 100%;
    text-align: left;
  }

  .tips {
    color: #000000;
  }
</style>
