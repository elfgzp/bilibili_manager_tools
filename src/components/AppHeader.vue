<template>
    <mt-header class="mt-header" fixed title="Bilibili房管工具">
      <div slot="left">
            <img class="header-icon-left" slot="icon" src="../assets/imgs/bilibili-header-left.svg">
      </div>
      <div slot="right">
            <img class="header-icon-right" slot="icon" src="../assets/imgs/bilibili-header-right.svg">
      </div>
    </mt-header>
</template>

<script>

  import {Header} from 'mint-ui'

  export default {
    name: 'AppHeader',
    data() {
      return {}
    },
    components: {
      'mt-header': Header
    }
  }
</script>

<style scoped>
  .mint-header{
    background-color: #fb7299
  }

  .header-icon-left{
    width: 40px;
  }

  .header-icon-right{
    width: 40px;
  }

</style>
