<template>
  <div class="blockList-contain" @onload="loadMore">
    <div class="user-box"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <div v-for="(blockInfo, index) in blockUserList" @click="unblockUserSheet(blockInfo, index)">
        <mt-cell>
          <span class="block-user-name">{{blockInfo.uname}}</span>
          <span class="block-info">{{blockInfo.block_end_time}}</span>
          <span class="block-info">{{blockInfo.admin_uname}}</span>
        </mt-cell>
      </div>
      <mt-cell>
      </mt-cell>
      <mt-cell>
      </mt-cell>
      <mt-cell>
      </mt-cell>
    </div>
        <mt-actionsheet :actions="unBlockUserSheetActions" v-model="unBlockSheetVisible"></mt-actionsheet>

  </div>
</template>


<script>

  import {Cell, Toast, Actionsheet} from 'mint-ui';


  export default {
    components: {
      'mt-cell': Cell,
     'mt-actionsheet': Actionsheet
    },
    name: 'SmallDarkRoom',
    data() {
      return {
        blockUserList: [],
        page: 1,
        unBlockSheetVisible: false,
        unBlockId: 0,
        unBlockIndex: 0,
        unBlockUserName: ''
      }
    },
    mounted: function () {
      var self = this
      if (this.userService && this.danmakuService) {
        return this.userService._api.getBlockUserList(this.danmakuService.roomId, self.page).then(res => {
          if (res.data && res.data.length > 0) {
            self.blockUserList = Array.prototype.concat(self.blockUserList, res.data)
            self.page++
          }
        })
      }
    },
    watch: {
      userService() {
        this.loadMore()
      },
      danmakuService() {
        this.loadMore()
      }
    },
    computed: {
      userService() {
        return this.$store.state.userService
      },
      danmakuService() {
        return this.$store.state.danmakuService
      },
      unBlockUserSheetActions() {
        return [{
          name: '用户: ' + this.unBlockUserName
        },
          {
            name: '解除禁言',
            method: this.removeBlock
          }]
      },
    },
    methods: {
      loadMore() {
        this.loading = true;
        var self = this
        if (this.userService && this.danmakuService) {
          return this.userService._api.getBlockUserList(this.danmakuService.roomId, self.page).then(res => {
            if (res.data && res.data.length > 0) {
              self.blockUserList = Array.prototype.concat(self.blockUserList, res.data)
              self.page++
            }
          })
        }
      },
      unblockUserSheet(blockInfo, index) {
        this.unBlockId = blockInfo.id
        this.unBlockIndex = index
        this.unBlockUserName = blockInfo.uname
        this.unBlockSheetVisible = true
      },
      removeBlock() {
        let blockID = this.unBlockId
        let idx = this.unBlockIndex
        var self = this
        this.userService._api.deleteBlockUser(this.danmakuService.roomId, blockID).then(res => {
          if (res.msg) {
            return Toast({
              message: res.msg,
              position: 'bottom',
            })
          } else {
            self.blockUserList.splice(idx, 1)
            return Toast({
              message: '成功撤销禁言',
              position: 'bottom',
            })
          }
        })
      },
    }
  }
</script>


<style scoped>
  .blockList-contain {
    height: 100%;
    margin-bottom: 180px;
  }

  .user-box {
    line-height: 24px;
    padding: 4px 4px;
    user-select: none;
    cursor: default;
    color: #fff;
    text-align: left;
    height: 150%;
  }

  .block-user-name {
    font-size: 12px;
  }

  .block-info {
    font-size: 12px;
    margin-left: 20px;
  }
</style>
