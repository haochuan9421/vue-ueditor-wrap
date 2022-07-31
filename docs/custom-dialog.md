> 不了解二次开发的同学，可以先阅读一下 UEditor 官网关于[二次开发](http://fex.baidu.com/ueditor/#dev-developer)的介绍。

<demo-code>demo/custom-dialog.vue</demo-code>

文件结构如下图所示：

<img src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/custom-dialog.png" style="width: 100px; cursor: zoom-in;" onclick="this.style = this.style.width === '100px'? 'width: 500px; cursor: zoom-out;': 'width: 100px; cursor: zoom-in;'"/>

<details>
	  <summary>custom/customizeDialogPage.html</summary>

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="renderer" content="webkit" />
    <!--页面中一定要引入internal.js为了能直接使用当前打开dialog的实例变量-->
    <!--internal.js默认是放到 UEditor/dialogs 目录下的-->
    <script type="text/javascript" src="../dialogs/internal.js"></script>
  </head>

  <body>
    <h1>hello vue-ueditor-wrap</h1>
    <script>
      //可以直接使用以下全局变量
      //当前打开dialog的实例变量
      console.log('editor: ' + editor);
      //一些常用工具
      console.log('domUtils: ' + domUtils);
      console.log('utils: ' + utils);
      console.log('browser: ' + browser);
      dialog.onok = function () {
        editor.execCommand('inserthtml', '<span>我点击了确定</span>');
      };
      dialog.oncancel = function () {
        editor.execCommand('inserthtml', '<span>我点击了取消</span>');
      };
    </script>
  </body>
</html>
```

</details>
