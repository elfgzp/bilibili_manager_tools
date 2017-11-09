<template>
    <mt-header class="sub-header" fixed v-bind:title="headerTitle">
      <mt-button icon="back" slot="left" @click.native="handleBack">返回</mt-button>
      <mt-button v-if="rightButton" icon="rightButton.icon" slot="right" @click.native="rightButton.method">{{rightButton.name}}</mt-button>
    </mt-header>
</template>

<script>
  import {Button, Header} from 'mint-ui'

  export default {
    props: ['headerTitle', 'rightButton'],
    components: {
      'mt-button': Button,
      'mt-header': Header
    },
    name: 'SubHeader',
    data() {
      return {
      }
    },
    methods: {
      handleBack: function (event) {
        this.$router.go(-1)
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
