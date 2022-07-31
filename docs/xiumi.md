### 秀米官方文档

[秀米的第三方对接方案](https://r.xiumi.us/board/v5/2a5va/16516964)

[秀米图文排版 UEditor 插件示例](https://ent.xiumi.us/ue/)

### 方式一、使用 editor-dependencies 属性

```html
<template>
  <vue-ueditor-wrap
    v-model="msg"
    editor-id="editor-with-xiumi"
    :config="editorConfig"
    :editor-dependencies="editorDependencies"
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
      this.editorConfig = {
        serverUrl: '//ueditor.zhenghaochuan.com/cos',
        UEDITOR_HOME_URL: '/UEditor/',
        catchRemoteImageEnable: true, // 抓取远程图片
        // whiteList 已经在 ueditor.config.js 里改过了，此处略
      };

      // 指定依赖的资源列表，下面的 JS 会依次加载，注意顺序。实际请求资源时会拼接上 UEDITOR_HOME_URL，当然你也可以填完整的 URL
      this.editorDependencies = [
        'ueditor.config.js',
        'ueditor.all.min.js',
        // 添加秀米相关的资源
        'xiumi/xiumi-ue-dialog-v5.js',
        'xiumi/xiumi-ue-v5.css',
      ];
    },
  };
</script>
```

文件结构如下图所示：

<img src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/xiumi.png" style="width: 100px; cursor: zoom-in;" onclick="this.style = this.style.width === '100px'? 'width: 500px; cursor: zoom-out;': 'width: 100px; cursor: zoom-in;'"/>

<details>
	  <summary>xiumi/xiumi-ue-dialog-v5.js</summary>

```js
UE.registerUI('dialog', function (editor, uiName) {
  const btn = new UE.ui.Button({
    name: 'xiumi-connect',
    title: '秀米',
    onclick() {
      const dialog = new UE.ui.Dialog({
        iframeUrl: '/UEditor/xiumi/xiumi-ue-dialog-v5.html', // 注意这个路径要指向 xiumi-ue-dialog-v5.html
        editor,
        name: 'xiumi-connect',
        title: '秀米图文消息助手',
        cssRules: 'width: ' + (window.innerWidth - 60) + 'px; height: ' + (window.innerHeight - 60) + 'px;',
      });
      dialog.render();
      dialog.open();
    },
  });

  return btn;
});
```

</details>

<details>
	  <summary>xiumi/xiumi-ue-v5.css</summary>

```css
.edui-button.edui-for-xiumi-connect .edui-button-wrap .edui-button-body .edui-icon {
  background-image: url('https://dl.xiumi.us/connect/ue/xiumi-connect-icon.png') !important;
  background-size: contain;
}
```

</details>

<details>
	  <summary>xiumi/xiumi-ue-dialog-v5.html</summary>

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>XIUMI connect</title>
    <style>
      html,
      body {
        padding: 0;
        margin: 0;
      }

      #xiumi {
        position: absolute;
        width: 100%;
        height: 100%;
        border: none;
        box-sizing: border-box;
      }
    </style>
  </head>

  <body>
    <iframe id="xiumi" src="//xiumi.us/studio/v5#/paper"> </iframe>
    <!-- 注意：这个路径要指向 dialogs/internal.js -->
    <script type="text/javascript" src="/UEditor/dialogs/internal.js"></script>
    <script>
      var xiumi = document.getElementById('xiumi');
      var xiumi_url = window.location.protocol + '//xiumi.us';
      console.log('xiumi_url is %o', xiumi_url);
      xiumi.onload = function () {
        console.log('postMessage to %o', xiumi_url);
        xiumi.contentWindow.postMessage('ready', xiumi_url);
      };
      document.addEventListener('mousewheel', function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
      window.addEventListener(
        'message',
        function (event) {
          console.log('Received message from xiumi, origin: %o %o', event.origin, xiumi_url);
          if (event.origin == xiumi_url) {
            console.log('Inserting html');
            editor.execCommand('insertHtml', event.data);
            editor.fireEvent('catchRemoteImage'); // 注意：这里要触发一下抓取远程图片的事件，才能把秀米图片转存到自己的存储服务上
            console.log('Xiumi dialog is closing');
            dialog.close();
          }
        },
        false
      );
    </script>
  </body>
</html>
```

</details>

### 方式二、使用 before-init 钩子【**推荐 ⭐️⭐️⭐️⭐️⭐️**】

点击右下角 `</>` 查看代码：

<demo-code compact>demo/xiumi.vue</demo-code>

文件结构如下图所示：

<img src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/xiumi2.png" style="width: 100px; cursor: zoom-in;" onclick="this.style = this.style.width === '100px'? 'width: 500px; cursor: zoom-out;': 'width: 100px; cursor: zoom-in;'"/>

<details>
	  <summary>xiumi/xiumi-ue-dialog-v5.html</summary>

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>XIUMI connect</title>
    <style>
      html,
      body {
        padding: 0;
        margin: 0;
      }

      #xiumi {
        position: absolute;
        width: 100%;
        height: 100%;
        border: none;
        box-sizing: border-box;
      }
    </style>
  </head>

  <body>
    <iframe id="xiumi" src="//xiumi.us/studio/v5#/paper"> </iframe>
    <!-- 注意这个文件的路径 -->
    <script type="text/javascript" src="../dialogs/internal.js"></script>
    <script>
      var xiumi = document.getElementById('xiumi');
      var xiumi_url = window.location.protocol + '//xiumi.us';
      console.log('xiumi_url is %o', xiumi_url);
      xiumi.onload = function () {
        console.log('postMessage to %o', xiumi_url);
        xiumi.contentWindow.postMessage('ready', xiumi_url);
      };
      document.addEventListener('mousewheel', function (event) {
        event.preventDefault();
        event.stopPropagation();
      });
      window.addEventListener(
        'message',
        function (event) {
          console.log('Received message from xiumi, origin: %o %o', event.origin, xiumi_url);
          if (event.origin == xiumi_url) {
            console.log('Inserting html');
            editor.execCommand('insertHtml', event.data);
            editor.fireEvent('catchRemoteImage'); // 注意：这里要触发一下抓取远程图片的事件，才能把秀米图片转存到自己的存储服务上
            console.log('Xiumi dialog is closing');
            dialog.close();
          }
        },
        false
      );
    </script>
  </body>
</html>
```

</details>
