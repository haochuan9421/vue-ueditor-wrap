<template>
  <vue-ueditor-wrap
    v-model="msg"
    :config="editorConfig"
    editor-id="uparse-demo"
    @ready="onEditorReady"
  ></vue-ueditor-wrap>
  <button @click="preview">预览</button>
  <!-- 通过 iframe 预览可以隔绝父页面的样式干扰 -->
  <iframe ref="previewer" :src="iframeSrc" frameborder="0" style="width: 100%; min-height: 180px"></iframe>
</template>

<script>
import { ref } from 'vue';

const defaultContent =
  '<ol class="custom_cn2 list-paddingleft-1"><li class="list-cn-3-1 list-cn2-paddingleft-1"><p>Vue</p></li><li class="list-cn-3-2 list-cn2-paddingleft-1"><p>React</p></li></ol>';

export default {
  setup() {
    const UEDITOR_HOME_URL =
      process.env.NODE_ENV === 'development' ? '/UEditor/' : `${process.env.PUBLIC_PATH}UEditor/`;
    const msg = ref(defaultContent);

    return {
      msg,
      editorConfig: {
        // 上传文件接口（这个地址是我为了方便开发者体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: '//ueditor.zhenghaochuan.com/cos',
        // 访问 UEditor 静态资源的根路径，例如这个文档网站的项目来说，开发环境是在 /UEditor/，部署到 GitHub Pages 之后的路径就是 /vue-ueditor-wrap/UEditor/ 了
        UEDITOR_HOME_URL,
        // 自定义列表标号图片的地址，默认是 http://bs.baidu.com/listicon/，不过默认链接下的列表小图片都已经 404 了，所以下载了一份放到项目里啦
        listiconpath: `${UEDITOR_HOME_URL}listicon/`,
      },
      iframeSrc: `${UEDITOR_HOME_URL}previewer.html`,
    };
  },
  watch: {
    msg() {
      this.preview();
    },
  },
  methods: {
    onEditorReady(editor) {
      this.editor = editor;
    },
    preview() {
      const frame = this.$refs.previewer;
      const frameWindow = frame.contentWindow;
      // 通过 postMessage 把富文本内容发送给 iframe 子页面
      frameWindow.postMessage(this.msg);
      // 调整预览区域的高度
      frame.style.height = this.editor.body.style.height;
    },
  },
};
</script>
