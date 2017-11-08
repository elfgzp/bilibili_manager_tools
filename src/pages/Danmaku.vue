<template>
  <div class="danmaku-contain-parent" ref="danmakuContainParent">
    <div class="danmaku-contain" ref="danmakuContain" @touchstart="danmakuContainTouchStart"
         @touchmove="danmakuContainTouchMove">
      <mt-cell v-for="(danmaku, index) in danmakuPool">
        <div class="danmaku-box">
          <div v-if="danmaku.type == 'connected'" class="msg-connected">弹幕服务器连接成功...</div>
          <div v-else-if="danmaku.type == 'error'" class="msg-error">连接发生错误，3秒后自动重连...</div>
          <div v-else-if="danmaku.type == 'live'" class="msg-live">开始直播啦！</div>
          <div v-else-if="danmaku.type == 'preparing'" class="msg-preparing">直播已结束，下次再见！</div>
          <div v-else-if="danmaku.type == 'welcome'" class="msg-welcome">
            <span v-if="danmaku.user.isVIP" class="vip-user">爷</span>
            <span v-if="danmaku.user.isSVIP" class="svip-user">爷</span>
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="welcome-message">进入直播间</span>
          </div>
          <div v-else-if="danmaku.type == 'welcomeGuard'" class="msg-welcome-guard">
            <span v-if="danmaku.user.guard > 0" class="guard-user" :class="userGuardLevel(danmaku.user.guard)"></span>
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="welcome-message">进入直播间</span>
          </div>
          <div v-else-if="danmaku.type == 'comment'" class="msg-comment" @click="blockUserSheet(danmaku.user)"
          >
            <span v-if="danmaku.user.guard > 0" class="guard-user" :class="userGuardLevel(danmaku.user.guard)"></span>
            <span v-if="danmaku.user.isAdmin" class="admin-user">管</span>
            <span v-if="danmaku.user.isSVIP" class="svip-user">爷</span>
            <span v-else-if="danmaku.user.isVIP" class="vip-user">爷</span>
            <span v-if="danmaku.user.badge" class="user-badge"
                  :class="userBadgeLevelColor(danmaku.user.badge.level)"><span
              class="user-badge-title">{{ danmaku.user.badge.title }}</span><span
              class="user-badge-level">{{ danmaku.user.badge.level }}</span></span>
            <span v-if="danmaku.user.title && danmaku.user.title.source" class="user-title"><img
              :src="titleImage(danmaku.user.title.source)"></span>
            <span v-if="danmaku.user.level" class="user-level"
                  :class="userLevelColor(danmaku.user.level)">{{ "UL " + danmaku.user.level }}</span>
            <span class="user-name">{{ danmaku.user.name }}:</span>
            <span class="user-comment">{{ danmaku.comment }}</span>
          </div>
          <div v-else-if="danmaku.type == 'gift'" class="msg-gift">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="gift-action">赠送</span>
            <span class="gift-img"><img :src="giftImage(danmaku.gift.id)"></span>
            <span class="user-gift">{{ `${danmaku.gift.name} × ${danmaku.gift.count}` }}</span>
          </div>
          <div v-else-if="danmaku.type == 'guardBuy'" class="msg-guard-buy">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="buy-msg">购买</span>
            <span class="guard-user-gift" :class="userGuardLevel(danmaku.level)"></span>
            <span class="buy-count">{{ `× ${danmaku.count}` }}</span>
          </div>
          <div v-else-if="danmaku.type == 'block'" class="msg-block">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="block-msg">被管理员禁言</span>
          </div>
          <div v-else-if="danmaku.type == 'newFans'" class="msg-new-fans">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="follow-msg">关注了直播间</span>
          </div>
        </div>
      </mt-cell>
    </div>
    <div class="danmaku-action" ref="danmakuAction">
      <div class="danmaku-config">
        <img v-if="lockDanmaku" class="danmaku-lock-button" src="../assets/imgs/lock-danmaku.svg"
             @click="changeLockDanmaku">
        <img v-else class="danmaku-unlock-button" src="../assets/imgs/unlock-danmaku.svg" @click="changeLockDanmaku">
      </div>
      <div class="danmaku-sender">
        <mt-field v-model="danmakuContent" class="danmaku-sender-field" placeholder="请输入要发送的弹幕"
                  v-focas="focasSendField" v-blur="blurSendField">
          <mt-button class="danmaku-sender-button" type="danger" size="small" @click.native="sendMessage">
            发射
          </mt-button>
        </mt-field>
      </div>
    </div>
    <mt-actionsheet :actions="blockUserSheetActions" v-model="blockSheetVisible"></mt-actionsheet>
  </div>
</template>

<script>
  import {Cell, Button, Field, Toast, Actionsheet} from 'mint-ui';

  export default {
    components: {
      'mt-cell': Cell,
      'mt-button': Button,
      'mt-field': Field,
      'mt-actionsheet': Actionsheet
    },
    name: 'Danmaku',
    data() {
      return {
        config: {
          welcomeMessage: true,
          welcomeGuardMessage: true,
          commentMessage: true,
          giftMessage: true,
          guardBuyMessage: true,
          newFansMessage: true,
          blockMessage: true,
          useBlock: true,
          useAdmin: false,
          lockDanmakuList: false
        },
        inDanmakuList: false,
        hoverIndex: -1,
        danmakuContent: '',
        blockSheetVisible: false,
        blockUid: 0,
        blockUserName: '',
        touchStartY: 0
      }
    },
    mounted: function () {
      this.$refs.danmakuContainParent.scrollTop = this.$refs.danmakuContainParent.scrollHeight
    },
    computed: {
      danmakuPool() {
        return this.$store.state.danmakuPool.filter(msg => {
          return this.config[msg.type + 'Message']
        })
      },
      maxDanmakuCount() {
        return parseInt(this.$store.state.danmakuConfig.maxDanmakuCount)
      },
      userService() {
        return this.$store.state.userService
      },
      danmakuService() {
        return this.$store.state.danmakuService
      },
      blockUserSheetActions() {
        return [{
          name: '用户: ' + this.blockUserName
        },
          {
            name: '禁言',
            method: this.blockUser
          }]
      },
      danmakuMode: {
        get () {
          return this.$store.state.danmakuConfig.mode
        },
        set (val) {
          this.$store.dispatch({
            type: 'UPDATE_DANMAKU_MODE',
            mode: val
          })
        }
      },
      danmakuColor: {
        get () {
          return this.$store.state.danmakuConfig.color
        },
        set (val) {
          this.$store.dispatch({
            type: 'UPDATE_DANMAKU_COLOR',
            color: val
          })
        }
      },
      lockDanmaku: {
        get () {
          return this.$store.state.danmakuLockState
        },
        set (val) {
          this.$store.dispatch({
            type: 'UPDATE_DANMAKU_LOCK_STATE',
            state: val
          })
        }
      },
      tabbarVisible: {
        get () {
          return this.$store.state.tabbarVisible
        },
        set (val) {
          this.$store.dispatch({
            type: 'UPDATE_TABBAR_VISIBLE',
            state: val
          })
        }
      }
    },
    watch: {
      danmakuPool() {
        var self = this;
        if (!this.lockDanmaku) {
          this.$nextTick(() => {
            self.$refs.danmakuContainParent.scrollTop = self.$refs.danmakuContainParent.scrollHeight
          })
        }
      },
    },
    methods: {
      focasSendField() {
        this.$refs.danmakuAction.style.bottom = '5px'
        this.changeTabbarVisible()
      },
      blurSendField() {
        this.$refs.danmakuAction.style.bottom = '60px'
        this.changeTabbarVisible()
      },
      changeTabbarVisible() {
        this.tabbarVisible = !this.tabbarVisible
      },
      changeLockDanmaku() {
        this.lockDanmaku = !this.lockDanmaku
      },
      danmakuContainTouchStart(event) {
        this.touchStartY = event.changedTouches[0].pageY
        if (this.$refs.danmakuContainParent.offsetHeight + this.$refs.danmakuContainParent.scrollTop === this.$refs.danmakuContainParent.scrollHeight) {
          this.lockDanmaku = false
        }
      },
      danmakuContainTouchMove(event) {
        let touchMoveEndY = event.changedTouches[0].pageY
        let Y = touchMoveEndY - this.touchStartY

        if (Y > 0) {
          this.lockDanmaku = true
        }
        if (this.$refs.danmakuContainParent.offsetHeight + this.$refs.danmakuContainParent.scrollTop === this.$refs.danmakuContainParent.scrollHeight) {
          this.lockDanmaku = false
        }
      },
      userLevelColor(level) {
        return "user-level-" + Math.ceil(Number(level) / 10)
      },
      userBadgeLevelColor(level) {
        return "user-badge-level-" + Math.ceil(Number(level) / 4)
      },
      userGuardLevel(level) {
        return "guard-user-" + level
      },
      giftImage(id) {
        return `http://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/gift-images/image-gif-grey/gift-grey-${id}.gif`
      },
      titleImage(source) {
        let uri = source.replace('title-', 'title/')
        return `http://s1.hdslb.com/bfs/static/blive/live-assets/${uri}.png`
      },
      sendMessage() {
        if (!this.danmakuContent) {
          return Toast({
            message: '请输入弹幕内容',
            position: 'bottom',
          })
        }
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
        this.danmakuContent = ''
      },
      blockUserSheet(user) {
        this.blockUid = user.id
        this.blockUserName = user.name
        this.blockSheetVisible = true
      },
      blockUser() {
        let uid = this.blockUid
        if (!this.userService) {
          return Toast({
            message: '请先登录',
            position: 'bottom',
          })
        }
        this.userService.api.blockUser(uid, 720).then(res => {
          if (res.msg) {
            return Toast({
              message: res.msg,
              position: 'bottom',
            })
          } else {
            return Toast({
              message: '成功禁言该用户',
              position: 'bottom',
            })
          }
        })
      },
      setAdmin(uid) {
        if (!this.userService) {
          this.$Message.warning('请先登录')
          return
        }
        this.userService.api.setAdmin(uid).then(res => {
          if (res.msg) {
            this.$Message.error(res.msg)
          } else {
            this.$Message.success('成功任命管理员')
          }
        })
      }
    }

  }
</script>

<style scoped>
  .danmaku-contain {
    margin-bottom: 10em;
    left: 0;
    right: 0;
  }

  .danmaku-contain-parent {
    height: 100%;
    overflow-y: scroll;
  }

  .danmaku-action {
    position: fixed;
    left: 0;
    bottom: 60px;
    z-index: 1;
    height: 58px;
    width: 100%;
  }

  .danmaku-sender {
    left: 0;
    right: 0;
    height: 65%;
    width: 100%;
  }

  .danmaku-sender-field {
    background-color: #f4f4f4;
    border: 1px solid #e3e3e3;
    border-radius: .533333333333333rem;
    font-size: .32rem;
    line-height: .8rem;
    color: #999;
    height: 100%;
  }

  .danmaku-config {
    left: 0;
    right: 0;
    height: 35%;
    width: 100%;
  }

  .danmaku-lock-button, .danmaku-unlock-button {
    height: 24px;
    width: 24px;
    float: left;
    margin-left: 10px;
  }

  .danmaku-sender-button {
    color: #fff;
    background-color: #fb7299;
    display: inline-block;
    font-size: 12px;
    padding: 0 12px;
    height: 30px;
    width: 50px;
  }

  * {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  .danmaku-page {
    height: 100vh;
    overflow: hidden;
  }

  .reset-hint {
    background-color: rgba(25, 25, 25, 0.4);
  }

  .toolbar {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
  }

  .toolbar .item {
    flex: 1;
    color: #fff;
    background-color: rgba(25, 25, 25, 0.8);
  }

  .toolbar .item + .item {
    margin-left: 1px;
  }

  .toolbar .online {
    display: inline-block;
    padding: 5px 8px;
    font-size: 14px;
    line-height: 16px;
    flex: 3;
  }

  .toolbar .online span {
    float: right;
  }

  .danmaku-enter {
    opacity: 0;
    transform: translateY(100%);
  }

  .danmaku-leave-to {
    opacity: 0;
    transform: translateY(-75%);
  }

  .danmaku-enter-active {
    transition: all 1s;
  }

  .danmaku-leave-active {
    transition: all 1s;
  }

  .danmaku-list {
    position: absolute;
    left: 0;
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
  }

  .danmaku-box {
    font-size: 12px;
    line-height: 16px;
    padding: 4px 4px;
    user-select: none;
    cursor: default;
    color: #fff;
    text-align: left;
    height: 80%;
    width: 100%;
  }

  .danmaku-box .admin-user {
    padding: 1px 2px;
    border-radius: 4px;
    background-color: #ea9336;
  }

  .danmaku-box .vip-user {
    padding: 1px 2px;
    border-radius: 4px;
    background-color: #f25d8e;
  }

  .danmaku-box .svip-user {
    padding: 1px 2px;
    border-radius: 4px;
    background-color: #ffb100;
  }

  .danmaku-box .user-name {
    color: #4fc1e9;
  }

  .danmaku-box .user-comment {
    color: #000000;
  }

  .danmaku-box .user-level {
    padding: 0 2px;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
  }

  .danmaku-box .user-level-1 {
    color: #939393;
  }

  .danmaku-box .user-level-2 {
    color: #5dbb57;
  }

  .danmaku-box .user-level-3 {
    color: #5595d9;
  }

  .danmaku-box .user-level-4 {
    color: #9a65ed;
  }

  .danmaku-box .user-level-5 {
    color: #fc84ae;
  }

  .danmaku-box .user-level-6 {
    color: #fc953a;
  }

  .danmaku-box .user-badge {
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    overflow: hidden;
  }

  .danmaku-box .user-badge .user-badge-title {
    padding: 0 4px;
  }

  .danmaku-box .user-badge .user-badge-level {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    padding: 0 3px;
  }

  .danmaku-box .user-badge-level-1 {
    background-color: #61decb;
    border-color: #61decb;
  }

  .danmaku-box .user-badge-level-1 .user-badge-level {
    background-color: #fff;
    color: #61decb;
  }

  .danmaku-box .user-badge-level-2 {
    background-color: #5896de;
    border-color: #5896de;
  }

  .danmaku-box .user-badge-level-2 .user-badge-level {
    background-color: #fff;
    color: #5896de;
  }

  .danmaku-box .user-badge-level-3 {
    background-color: #a068f1;
    border-color: #a068f1;
  }

  .danmaku-box .user-badge-level-3 .user-badge-level {
    background-color: #fff;
    color: #a068f1;
  }

  .danmaku-box .user-badge-level-4 {
    background-color: #ff86b2;
    border-color: #ff86b2;
  }

  .danmaku-box .user-badge-level-4 .user-badge-level {
    background-color: #fff;
    color: #ff86b2;
  }

  .danmaku-box .user-badge-level-5 {
    background-color: #f6be18;
    border-color: #f6be18;
  }

  .danmaku-box .user-badge-level-5 .user-badge-level {
    background-color: #fff;
    color: #f6be18;
  }

  .danmaku-box .user-title img {
    vertical-align: middle;
  }

  .danmaku-box .guard-user {
    display: inline-block;
    vertical-align: top;
    background-image: url("http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png");
  }

  .danmaku-box .guard-user-1 {
    background-position: 100% 0;
  }

  .danmaku-box .guard-user-2 {
    background-position: 50% 0;
  }

  .danmaku-box .guard-user-3 {
    background-position: 0% 0;
  }

  .danmaku-box .guard-user-gift {
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: bottom;
    background-image: url("http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png");
    background-size: auto 24px;
  }

  .danmaku-box .msg-gift .gift-img > img {
    height: 32px;
  }

  .danmaku-box .msg-gift .user-name {
    color: #ff8f34;
  }

  .danmaku-box .success {
    color: #19be6b;
  }

  .danmaku-box .failed {
    color: #ed3f14;
  }

  .gift-action {
    color: #fc84ae;
  }

  .user-gift {
    color: #fc84ae;
  }

  .follow-msg {
    color: #000000;
  }

  .welcome-message {
    color: #000000;
  }

  .block-msg {
    color: #000000;
  }

  .msg-comment {
    width: 100%;
  }
</style>
