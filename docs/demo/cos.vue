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
      serverUrl: '//ueditor.szcloudplus.com/cos',
      UEDITOR_HOME_URL: '//ueditor-1302968899.cos.ap-guangzhou.myqcloud.com/static/UEditor/utf8-php/',
      listiconpath: `//ueditor-1302968899.cos.ap-guangzhou.myqcloud.com/static/UEditor/utf8-php/listicon/`,
    };
  },
};
</script>
