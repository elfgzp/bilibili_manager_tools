<template>
  <div>
    <mt-header class="sub-header" fixed v-bind:title="headerTitle">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
  </div>
</template>

<script>
  import {Button, Header} from 'mint-ui'

  export default {
    components: {
      'mt-button': Button,
      'mt-header': Header
    },
    name: 'SubHeader',
    data() {
      return {
        headerTitle: ''
      }
    }
  }
</script>

<style scoped>
  .mint-header {
    background-color: #fb7299
  }

  .sub-header {
    z-index: 2;
  }
</style>
