<template>
    <div class="user-center-contain">
      <sub-header headerTitle="个人中心"></sub-header>
      <section class="section-block with-radius with-padding">
        <div class="user">
          <a class="user-hd" v-bind:style="{'background-image': userAvatar}"></a>
          <div class="user-info">

            <span v-bind:title="userInfo.name" class="user-name">{{userInfo.name}}</span>
            <span class="uid middle">UID</span><span class="user-uid middle">{{userInfo.id}}</span>
          </div>
        </div>
        <div class="user-box">

        </div>
      </section>
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
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      userInfo() {
        console.log(this.$store.state.userInfo)
        return this.$store.state.userInfo
      },
      userAvatar() {
        return 'url("' + this.userInfo.avatar + '"'
      },
      ulProgress() {
        return Math.floor(this.userInfo.current / this.userInfo.next * 100)
      },
      upProgress() {
        return Math.floor(this.userRoom.current / this.userRoom.next * 100)
      }
    },
    methods: {}
  }
</script>

<style scoped>
  .user-center-contain {

  }

  .user-hd {
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-size: cover;
    background-position: 50%;
    background-color: #ececec;
    border: 4px solid #ececec;
  }

  .user-center-contain {
    border-radius: 12px;
    border: 1px solid #e9eaec;
    padding: 24px;
    margin-bottom: 22px;
    background-color: #fff;
    display: block;
  }

  .user {
    position: relative;
    padding-bottom: 12px;
    border-bottom: 1px solid #e3e8ec;
    display: block;
  }

  .user-info {
  }

  .user-info > .uid {
    width: 32px;
    margin: 0 8px 0 10px;
    background: #9bd7f1;
    color: #fff;
  }

  .user-info > .middle {
    display: inline-block;
    vertical-align: middle;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 2px;
  }

  .user-info > .user-uid {
    color: #999;
  }


  .user-box > .admin-user {
    padding: 1px 2px;
    border-radius: 4px;
    background-color: #ea9336;
  }

  .user-box > .vip-user {
    padding: 1px 2px;
    border-radius: 4px;
    background-color: #f25d8e;
  }

  .user-box > .svip-user {
    padding: 1px 2px;
    border-radius: 4px;
    background-color: #ffb100;
  }

  .user-box > .user-name {
    color: #4fc1e9;
  }

  .user-box > .user-comment {
    color: #000000;
  }

  .user-box > .user-level {
    padding: 0 2px;
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
  }

  .user-box > .user-level-1 {
    color: #939393;
  }

  .user-box > .user-level-2 {
    color: #5dbb57;
  }

  .user-box > .user-level-3 {
    color: #5595d9;
  }

  .user-box > .user-level-4 {
    color: #9a65ed;
  }

  .user-box > .user-level-5 {
    color: #fc84ae;
  }

  .user-box > .user-level-6 {
    color: #fc953a;
  }

</style>
