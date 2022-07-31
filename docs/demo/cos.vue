<template>
  <vue-ueditor-wrap v-model="msg" :config="editorConfig" editor-id="editor-cos-demo"></vue-ueditor-wrap>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const msg = ref('<h2>Hello World!</h2>');
    return {
      msg,
    };
  },
  created() {
    this.editorConfig = {
      serverUrl: '//ueditor.zhenghaochuan.com/cos',
      UEDITOR_HOME_URL: '//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/static/UEditor/utf8-php/',
      listiconpath: `//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/static/UEditor/utf8-php/listicon/`,
    };
  },
};
</script>
