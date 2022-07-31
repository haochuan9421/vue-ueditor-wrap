<template>
  <vue-ueditor-wrap v-model="msg" :config="editorConfig" editor-id="editor-demo-01"></vue-ueditor-wrap>
  <vue-ueditor-wrap v-model="msg" :config="editorConfig" editor-id="editor-demo-02"></vue-ueditor-wrap>
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
    const UEDITOR_HOME_URL =
      process.env.NODE_ENV === 'development' ? '/UEditor/' : `${process.env.PUBLIC_PATH}UEditor/`;

    this.editorConfig = {
      // 上传文件接口（这个地址是我为了方便开发者体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
      serverUrl: '//ueditor.zhenghaochuan.com/cos',
      // 访问 UEditor 静态资源的根路径，例如这个文档网站的项目来说，开发环境是在 /UEditor/，部署到 GitHub Pages 之后的路径就是 /vue-ueditor-wrap/UEditor/ 了
      UEDITOR_HOME_URL,
      // 默认是 http://bs.baidu.com/listicon/，不过这个链接下的列表小图片都已经 404 了，所以下载了一份放到项目里啦
      listiconpath: `${UEDITOR_HOME_URL}listicon/`,
    };
  },
};
</script>
