<template>
  <vue-ueditor-wrap
    v-model="msg"
    editor-id="custom-btn-demo-01"
    :config="editorConfig"
    @before-init="addCustomButton"
  ></vue-ueditor-wrap>
</template>

<script>
export default {
  data() {
    return {
      msg: '',
    };
  },
  created() {
    // 这里根据你项目的具体情况设置，我这么设置是针对这个文档网站的
    this.UEDITOR_HOME_URL = process.env.NODE_ENV === 'development' ? '/UEditor/' : `${process.env.PUBLIC_PATH}UEditor/`;
    this.editorConfig = {
      serverUrl: '//ueditor.zhenghaochuan.com/cos',
      UEDITOR_HOME_URL: this.UEDITOR_HOME_URL,
      listiconpath: `${this.UEDITOR_HOME_URL}listicon/`,
    };
  },
  methods: {
    addCustomButton(editorId) {
      window.UE.registerUI(
        'my-custom-button',
        (editor, uiName) => {
          // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
          editor.registerCommand(uiName, {
            execCommand() {
              editor.execCommand('inserthtml', `<span>这是一段由自定义按钮添加的文字</span>`);
            },
          });

          // 创建一个 button
          const btn = new window.UE.ui.Button({
            // 按钮的名字
            name: uiName,
            // 提示
            title: '鼠标悬停时的提示文字',
            // 需要添加的额外样式，可指定 icon 图标
            cssRules: `background-image: url('${this.UEDITOR_HOME_URL}custom/my-custom-button.png') !important; background-size: cover;`,
            // 点击时执行的命令
            onclick() {
              // 这里可以不用执行命令，做你自己的操作也可
              editor.execCommand(uiName);
            },
          });

          // 当点到编辑内容上时，按钮要做的状态反射
          editor.addListener('selectionchange', function () {
            const state = editor.queryCommandState(uiName);
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
        },
        0 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */,
        editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */
      );
    },
  },
};
</script>
