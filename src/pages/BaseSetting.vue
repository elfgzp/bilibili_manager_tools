<template>
  <div>
    <div class="login-contain">
      <sub-header headerTitle="基础设置"></sub-header>
      <mt-field label="直播间ID:" v-model="roomId" placeholder="请输入直播间ID" @change="startDanmakuService" :state="statusInfo"
                type="number">
        <mt-switch v-model="status" ref="statusSwitch"></mt-switch>
      </mt-field>
    </div>
  </div>
</template>

<script>
  import {Button, Field, Switch, Toast} from 'mint-ui';
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
          return this.$store.state.roomId
        },
        set (val) {
          this.$store.dispatch({
            type: 'UPDATE_ROOMID',
            roomId: val
          })
        }
      },
      status: {
        get () {
          return this.$store.state.danmakuServiceStatus === 'open';
        },
        set (val) {
          if (val === true) {
            if (!this.roomId) {
              this.$store.dispatch({
                type: 'STOP_DANMAKU_SERVICE'
              })
              return
            }
            this.$store.dispatch({
              type: 'START_DANMAKU_SERVICE'
            })
          } else {
            this.$store.dispatch({
              type: 'STOP_DANMAKU_SERVICE'
            })
          }
        }
      },
      statusInfo: function () {
        if (this.$store.state.danmakuService) {
          return 'success'
        } else {
          return 'error'
        }
      }
    },
    methods: {
      startDanmakuService() {
        if (this.status === true) {
          if (!this.roomId) {
            this.$store.dispatch({
              type: 'STOP_DANMAKU_SERVICE'
            })
          }
          this.$store.dispatch({
            type: 'START_DANMAKU_SERVICE'
          })
        }
      },
    }
  }
</script>

<style scoped>
  .login-contain {
    height: 100%;
  }
</style>
