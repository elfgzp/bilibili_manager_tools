<template>
  <div class="setting-contain">
    <div class="setting-button-group">
      <mt-button class="login-button" size="large" @click.native="handleLogin">用户登录</mt-button>
    </div>
  </div>
</template>

<script>
  import {Button} from 'mint-ui'

  export default {
    components: {
      'mt-button': Button
    },
    name: 'Setting',
    data() {
      return {}
    },
    methods: {
      handleLogin: function (event) {
        this.$router.push('/Login')
      }
    }
  }
</script>

<style scoped>
  .mint-header {
    background-color: #fb7299
  }

  .setting-contain {
    height: 100%;
    position: relative;
  }

  .setting-button-group {
    width: 100%;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .login-button {
    border: 1px solid #fb7299;
    background-color: transparent;
    color: #fb7299;
  }
</style>
