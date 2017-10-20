<template>
  <div>
    <p>设置页面</p>
    <mt-button type="default" size="large" @click.native="handleLogin">default</mt-button>
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
        alert(event)
      }
    }
  }
</script>

<style scoped>
  .mint-header{
    background-color: #fb7299
  }

</style>
