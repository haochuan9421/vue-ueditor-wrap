<template>
  <vue-ueditor-wrap
    v-model="msg"
    editor-id="custom-dialog-demo-01"
    :config="editorConfig"
    @before-init="addCustomDialog"
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
    addCustomDialog(editorId) {
      window.UE.registerUI(
        'my-custom-dialog',
        (editor, uiName) => {
          // 创建 dialog
          const dialog = new window.UE.ui.Dialog({
            // 指定弹出层中页面的路径，这里只能支持页面
            iframeUrl: `${this.UEDITOR_HOME_URL}custom/customizeDialogPage.html`,
            // 需要指定当前的编辑器实例
            editor,
            // 指定 dialog 的名字
            name: uiName,
            // dialog 的标题
            title: '这是一个自定义的 Dialog 浮层',
            // 指定 dialog 的外围样式
            cssRules: 'width:600px; height:300px;',
            // 如果给出了 buttons 就代表 dialog 有确定和取消
            buttons: [
              {
                className: 'edui-okbutton',
                label: '确定',
                onclick() {
                  dialog.close(true);
                },
              },
              {
                className: 'edui-cancelbutton',
                label: '取消',
                onclick() {
                  dialog.close(false);
                },
              },
            ],
          });

          // 参考上面的自定义按钮
          const btn = new window.UE.ui.Button({
            name: 'my-custom-dialog-btn',
            title: '鼠标悬停时的提示文字',
            cssRules: `background-image: url('${this.UEDITOR_HOME_URL}custom/my-custom-dialog.png') !important; background-size: cover;`,
            onclick() {
              // 渲染dialog
              dialog.render();
              dialog.open();
            },
          });

          return btn;
        },
        0 /* 指定添加到工具栏上的那个位置，默认时追加到最后 */,
        editorId /* 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */
      );
    },
  },
};
</script>
