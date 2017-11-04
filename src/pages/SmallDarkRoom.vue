<template>
  <div class="blockList-contain">
    <div class="user-box"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10">
      <mt-cell-swipe
        v-bind:right="renderRemoveBlockButton(blockInfo, index)" v-for="(blockInfo, index) in blockUserList">
        <span class="block-user-name">{{blockInfo.uname}}</span>
        <span class="block-info">{{blockInfo.block_end_time}}</span>
        <span class="block-info">{{blockInfo.admin_uname}}</span>
      </mt-cell-swipe>
      <mt-cell-swipe>
      </mt-cell-swipe>
      <mt-cell-swipe>
      </mt-cell-swipe>
      <mt-cell-swipe>
      </mt-cell-swipe>
    </div>
  </div>
</template>


<script>

  import {CellSwipe, Toast} from 'mint-ui';


  export default {
    components: {
      'mt-cell-swipe': CellSwipe
    },
    name: 'SmallDarkRoom',
    data() {
      return {
        blockUserList: [],
        page: 0,
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
    },
    methods: {
      loadMore() {
        this.loading = true;
        var self = this
        if (this.userService && this.danmakuService) {
          return this.userService._api.getBlockUserList(this.danmakuService.roomId, self.page).then(res => {
            if (res.data.length > 0) {
              self.blockUserList = Array.prototype.concat(self.blockUserList, res.data)
              self.page++
            }
          })
        }
      },
      removeBlock(blockInfo, idx) {
        console.log(blockInfo.uname)
        let blockID = blockInfo.id
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
      renderRemoveBlockButton(blockInfo, index) {
        let self = this
        return [
          {
            content: '解除禁言',
            style: {background: '#fb7299', color: '#fff'},
            handler: function () {
              return self.removeBlock(blockInfo, index)
            }
          }
        ]
      }

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
    margin-bottom: 180px;
  }

  .block-info {
    margin-left: 20px;
  }
</style>
