<template>
  <div class="login-contain">
    <sub-header headerTitle="基础设置"></sub-header>
    <mt-field label="直播间ID：" v-model="roomId" v-on:change="startDanmakuService"></mt-field>
    <mt-field label="弹幕状态：">
      <mt-switch v-on:change="startDanmakuService"></mt-switch>
    </mt-field>
  </div>
</template>

<script>
  import {Button, Field, Switch} from 'mint-ui';
  import SubHeader from '../components/SubHeader.vue'

  export default {
    components: {
      'sub-header': SubHeader,
      'mt-field': Field,
      'mt-button': Button,
      'mt-switch': Switch
    },
    name: 'BaseSetting',
    data() {
      return {}
    },
    computed: {
      roomId: {
        get () {
        },
        set (val) {
        }
      }
    },
    methods: {
      startDanmakuService() {
      }
    }
  }
</script>

<style scoped>
  .login-contain {
    height: 100%;
  }
</style>
