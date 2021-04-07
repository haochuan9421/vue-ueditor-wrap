> 先阅读一下 UEditor 官网关于[编辑内容展示](http://fex.baidu.com/ueditor/#start-uparse)的介绍。

<demo-code>demo/uparse.vue</demo-code>

<details>
	  <summary>/UEditor/previewer.html</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!-- 1. 引入 parse 脚本 -->
    <script src="./ueditor.parse.min.js"></script>
  </head>
  <body>
    <div id="previewer"></div>
    <script>
      // 2. 接收父页面发送过来的富文本内容，并渲染到 previewer 内
      var previewer = document.getElementById('previewer');
      window.addEventListener(
        'message',
        function (event) {
          if (event.origin !== window.location.origin) {
            return false;
          }
          previewer.innerHTML = event.data;
          uParse('#previewer', {
            // UEditor 所在的路径，这个要给出，让 uparse 能找到 third-party 目录
            rootPath: './',
            // 自定义列表标号图片的地址
            liiconpath: './listicon/',
          });
        },
        false
      );
    </script>
  </body>
</html>
```

</details>

> 关于列表序号不显示的问题可以参考这个 [ISSUE](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues/155)
