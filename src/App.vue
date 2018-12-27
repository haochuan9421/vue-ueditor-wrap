<template>
  <div id="app">
    <div class="preview" v-html="msg"></div>
    <vue-ueditor-wrap v-model="msg" :config="myConfig" @beforeInit="addCustomButtom" :key="1"></vue-ueditor-wrap>
    <vue-ueditor-wrap v-model="msg" :config="myConfig" @beforeInit="addCustomDialog" :key="2"></vue-ueditor-wrap>
  </div>
</template>

<script>
// import VueUeditorWrap from './components/vue-ueditor-wrap.vue';

// 检测构建之后vue-ueditor-wrap.js的可用性：

// import VueUeditorWrap from '../lib/vue-ueditor-wrap.min.js'; // ES6 Module
// const VueUeditorWrap = require('../lib/vue-ueditor-wrap.min.js'); // CommonJS
const VueUeditorWrap = window.VueUeditorWrap; // 全局变量，通过 script 标签引入

export default {
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      msg: '',
      myConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 200,
        initialFrameWidth: '100%',
        UEDITOR_HOME_URL: '/UEditor/',
        serverUrl: 'http://35.201.165.105:8000/controller.php'
      }
    };
  },
  methods: {
    // 添加自定义按钮
    addCustomButtom (editorId) {
      window.UE.registerUI('test-button', function (editor, uiName) {
        // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: function () {
            editor.execCommand('inserthtml', `<span>这是一段由自定义按钮添加的文字</span>`);
          }
        });

        // 创建一个 button
        var btn = new window.UE.ui.Button({
          // 按钮的名字
          name: uiName,
          // 提示
          title: '鼠标悬停时的提示文字',
          // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
          cssRules: "background-image: url('/test-button.png') !important;background-size: cover;",
          // 点击时执行的命令
          onclick: function () {
            // 这里可以不用执行命令，做你自己的操作也可
            editor.execCommand(uiName);
          }
        });

        // 当点到编辑内容上时，按钮要做的状态反射
        editor.addListener('selectionchange', function () {
          var state = editor.queryCommandState(uiName);
          if (state === -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
          } else {
            btn.setDisabled(false);
            btn.setChecked(state);
          }
        });

        // 因为你是添加 button，所以需要返回这个 button
        return btn;
      }, 0 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */);
    },
    // 添加自定义弹窗
    addCustomDialog (editorId) {
      window.UE.registerUI('test-dialog', function (editor, uiName) {
        // 创建 dialog
        var dialog = new window.UE.ui.Dialog({
          // 指定弹出层中页面的路径，这里只能支持页面，路径参考常见问题 2
          iframeUrl: '/customizeDialogPage.html',
          // 需要指定当前的编辑器实例
          editor: editor,
          // 指定 dialog 的名字
          name: uiName,
          // dialog 的标题
          title: '这是一个自定义的 Dialog 浮层',
          // 指定 dialog 的外围样式
          cssRules: 'width:600px;height:300px;',
          // 如果给出了 buttons 就代表 dialog 有确定和取消
          buttons: [
            {
              className: 'edui-okbutton',
              label: '确定',
              onclick: function () {
                dialog.close(true);
              }
            },
            {
              className: 'edui-cancelbutton',
              label: '取消',
              onclick: function () {
                dialog.close(false);
              }
            }
          ]
        });

        // 参考上面的自定义按钮
        var btn = new window.UE.ui.Button({
          name: 'dialog-button',
          title: '鼠标悬停时的提示文字',
          cssRules: `background-image: url('/test-dialog.png') !important;background-size: cover;`,
          onclick: function () {
            // 渲染dialog
            dialog.render();
            dialog.open();
          }
        });

        return btn;
      }, 0 /* 指定添加到工具栏上的那个位置，默认时追加到最后 */, editorId /* 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */);
    }
  }
};
</script>

<style>
.preview{
  min-height: 200px;
  width: 100%;
}
</style>
