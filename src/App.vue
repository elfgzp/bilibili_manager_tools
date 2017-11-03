<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
    <app-tabbar></app-tabbar>
  </div>
</template>

<script>
  import AppHeader from "./components/AppHeader.vue";
  import AppTabbar from "./components/AppTabbar.vue";

  export default {
    components: {
      'app-tabbar': AppTabbar,
      'app-header': AppHeader
    },
    name: 'app'
  }
</script>

<style>
  html, body {
    height: 100%;
    overflow: hidden;

  }

  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    overflow-y: scroll;
  }

  .mint-cell-value {
    width: 100%;
  }

  .mint-cell-wrapper {
    background-color: #f8f8f8;
  }

  .mint-field-core {
    background-color: #f8f8f8;
  }
</style>
