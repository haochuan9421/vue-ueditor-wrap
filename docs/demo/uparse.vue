<template>
  <vue-ueditor-wrap v-model="msg" :config="editorConfig" editor-id="uparse-demo"></vue-ueditor-wrap>
  <button @click="onPreview">预览</button>
  <div id="previewer"></div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const UEDITOR_HOME_URL =
      process.env.NODE_ENV === 'development' ? '/UEditor/' : `${process.env.PUBLIC_PATH}UEditor/`;
    const msg = ref('<h2>Hello World!</h2>');

    return {
      msg,
      editorConfig: {
        // 上传文件接口（这个地址是我为了方便开发者体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: '//ueditor.szcloudplus.com/cos',
        // 访问 UEditor 静态资源的根路径，例如这个文档网站的项目来说，开发环境是在 /UEditor/，部署到 GitHub Pages 之后的路径就是 /vue-ueditor-wrap/UEditor/ 了
        UEDITOR_HOME_URL,
        // 自定义列表标号图片的地址，默认是 http://bs.baidu.com/listicon/，不过默认链接下的列表小图片都已经 404 了，所以下载了一份放到项目里啦
        listiconpath: `${UEDITOR_HOME_URL}listicon/`,
      },
    };
  },
  methods: {
    // 加载 UEditor/ueditor.parse.js，可以提前在 html 中引入
    loadUparseScript() {
      return new Promise((resolve, reject) => {
        if (window.uParse) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src = `${this.editorConfig.UEDITOR_HOME_URL}ueditor.parse.js`;
          script.onload = resolve;
          script.onerror = reject;
          document.getElementsByTagName('head')[0].appendChild(script);
        }
      });
    },
    onPreview() {
      const previewer = document.getElementById('previewer');
      previewer.innerHTML = this.msg;
      this.loadUparseScript().then(() => {
        window.uParse('#previewer', {
          // UEditor 所在的路径，这个要给出，让 uparse 能找到 third-party 目录
          rootPath: this.editorConfig.UEDITOR_HOME_URL,
          // 同 listiconpath
          liiconpath: this.editorConfig.listiconpath,
        });
      });
    },
  },
};
</script>
