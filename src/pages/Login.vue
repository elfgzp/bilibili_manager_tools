<template>
  <div class="login-contain">
    <sub-header headerTitle="用户登录"></sub-header>
    <iframe src="http://passport.bilibili.com/ajax/miniLogin/minilogin"></iframe>
  </div>
</template>

<script>
  import SubHeader from '../components/SubHeader.vue'

  export default {
    components: {
      'sub-header': SubHeader,
    },
    name: 'Login',
    data() {
      return {
      }
    }
  }
</script>

<style scoped>
.login-contain {
  height: 100%;
}
iframe {
  width: 100%;
  height: 100%;
}
</style>
