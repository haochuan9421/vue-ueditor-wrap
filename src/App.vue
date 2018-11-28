<template>
  <div id="app">
    <div class="prev" v-html="msg"></div>
    <vue-ueditor-wrap v-model="msg" :config="myConfig"></vue-ueditor-wrap>
  </div>
</template>

<script>
import VueUeditorWrap from './components/vue-ueditor-wrap.vue'

// 检测构建之后vue-ueditor-wrap.js的可用性：

// import VueUeditorWrap from '../lib/vue-ueditor-wrap.min.js' // ES6 Module
// const VueUeditorWrap = require('../lib/vue-ueditor-wrap.min.js') // CommonJS
// const VueUeditorWrap = window.VueUeditorWrap // 全局变量，通过 script 标签引入

export default {
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      msg: '',
      myConfig: {
        UEDITOR_HOME_URL: '/UEditor/',
        serverUrl: 'http://35.201.165.105:8000/controller.php'
      }
    }
  }
}
</script>

<style>
.prev{
  min-height: 200px;
  width: 100%;
}
</style>
