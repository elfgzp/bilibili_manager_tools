<template>
  <div class="login-contain">
    <sub-header headerTitle="用户登录"></sub-header>
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
</style>
