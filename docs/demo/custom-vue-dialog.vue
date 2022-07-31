<template>
  <vue-ueditor-wrap
    v-model="msg"
    editor-id="custom-vue-dialog-demo-01"
    :config="editorConfig"
    @ready="onEditorReady"
    @before-init="addVueDialogButton"
  ></vue-ueditor-wrap>

  <teleport to="body">
    <div v-if="showCustomVueDialog" class="modal-mask">
      <div class="modal-content">
        <p>hi! Vue Dialog!</p>
        <button @click="onVueDialogClose">关闭</button>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  data() {
    return {
      msg: '',
      showCustomVueDialog: false,
    };
  },
  created() {
    this.editorConfig = {
      serverUrl: '//ueditor.zhenghaochuan.com/cos',
      UEDITOR_HOME_URL: '//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/static/UEditor/utf8-php/',
      toolbars: [
        [
          'undo',
          'redo',
          '|',
          'bold',
          'italic',
          'underline',
          'fontborder',
          'strikethrough',
          'superscript',
          'subscript',
          'removeformat',
          'formatmatch',
          'autotypeset',
          'blockquote',
          'pasteplain',
          '|',
          'forecolor',
          'backcolor',
          'insertorderedlist',
          'insertunorderedlist',
          'selectall',
          'cleardoc',
          '|',
          'rowspacingtop',
          'rowspacingbottom',
          'lineheight',
          '|',
          'customstyle',
          'paragraph',
          'fontfamily',
          'fontsize',
          '|',
          'directionalityltr',
          'directionalityrtl',
          'indent',
          '|',
          'justifyleft',
          'justifycenter',
          'justifyright',
          'justifyjustify',
          '|',
          'touppercase',
          'tolowercase',
          '|',
          'imagenone',
          'imageleft',
          'imageright',
          'imagecenter',
          '|',
          'simpleupload',
          'insertcode',
          'pagebreak',
          '|',
          'horizontal',
          'date',
          'time',
          '|',
          'inserttable',
          'deletetable',
          'insertparagraphbeforetable',
          'insertrow',
          'deleterow',
          'insertcol',
          'deletecol',
          'mergecells',
          'mergeright',
          'mergedown',
          'splittocells',
          'splittorows',
          'splittocols',
          '|',
          'drafts',
        ],
      ],
      listiconpath: `//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/static/UEditor/utf8-php/listicon/`,
    };
  },
  methods: {
    onEditorReady(editor) {
      this.editor = editor;
    },

    onVueDialogClose() {
      this.showCustomVueDialog = false;
      this.editor && this.editor.execCommand('inserthtml', `<span>弹窗被关闭了!</span>`);
    },

    addVueDialogButton(editorId) {
      window.UE.registerUI(
        'my-custom-button',
        (editor, uiName) => {
          const btn = new window.UE.ui.Button({
            name: uiName,
            title: '鼠标悬停时的提示文字',
            cssRules: `background-image: url('//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/static/UEditor/utf8-php/custom/my-custom-button.png') !important; background-size: cover;`,
            onclick: () => {
              this.showCustomVueDialog = true;
            },
          });

          return btn;
        },
        0,
        editorId
      );
    },
  },
};
</script>

<style scoped>
.modal-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 300px;
  height: 300px;
  padding: 5px;
}
</style>
