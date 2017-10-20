<template>
  <div>
    <p>登录</p>
    <sub-header></sub-header>
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
      return {}
    }
  }
</script>

<style scoped>

</style>
