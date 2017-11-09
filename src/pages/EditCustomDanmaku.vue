<template>
  <div>
    <sub-header :headerTitle='headerTitle' :rightButton="{name: '保存', method: this.saveDanmaku}"></sub-header>
    <mt-field placeholder="请输入弹幕内容" type="textarea" rows="4" v-model="danmaku"></mt-field>
    <mt-button v-if="this.index !== false" class="delete-button" size="large" @click.native="deleteDanmaku">删除弹幕
    </mt-button>
  </div>
</template>

<script>
  import {Field, Button, Toast} from 'mint-ui'
  import SubHeader from '../components/SubHeader.vue'

  export default {
    components: {
      'sub-header': SubHeader,
      'mt-field': Field,
      'mt-button': Button
    },
    name: 'EditCustomDanmaku',
    data() {
      return {
        danmaku: '',
        index: false
      }
    },
    mounted() {
      if (this.$router.history.current.params.index || this.$router.history.current.params.index === 0) {
        this.danmaku = this.$store.state.customDanmakuList[this.$router.history.current.params.index]
        this.index = this.$router.history.current.params.index
      }
    },
    computed: {
      headerTitle() {
        if (this.index !== false) {
          return '编辑自定义弹幕'
        } else {
          return '新建自定义弹幕'
        }
      }
    },
    methods: {
      saveDanmaku() {
        if (this.danmaku.replace(/[\s\r\n]/g, "") !== '') {
          if (this.index === false) {
            this.$store.dispatch({
              type: 'ADD_CUSTOM_DANMAKU',
              danmaku: this.danmaku,
              index: false
            })
            this.$router.go(-1)
          } else {
            this.$store.dispatch({
              type: 'UPDATE_CUSTOM_DANMAKU',
              danmaku: this.danmaku,
              index: this.index
            })
            this.$router.go(-1)
          }
        } else {
          return Toast({
            message: '请输入弹幕内容',
            position: 'bottom',
          })
        }
      },
      deleteDanmaku() {
        this.$store.dispatch({
          type: 'DELETE_CUSTOM_DANMAKU',
          danmaku: this.danmaku,
          index: this.index
        })
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .delete-button {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid #fb7299;
    background-color: transparent;
    color: #fb7299;
  }
</style>
