# vue-ueditor-wrap

<p align="center">
  <a href="https://gitter.im/haochuan9421/vue-ueditor-wrap/"><img src="https://badges.gitter.im/haochuan9421/vue-ueditor-wrap.svg" alt="Chatroom"></a>
  <a href="https://www.npmjs.com/package/vue-ueditor-wrap"><img src="https://img.shields.io/npm/v/vue-ueditor-wrap.svg" alt="Version"></a>
  <a href="https://npmcharts.com/compare/vue-ueditor-wrap?minimal=true"><img src="https://img.shields.io/npm/dm/vue-ueditor-wrap.svg" alt="Downloads"></a>
  <a href="https://www.jsdelivr.com/package/npm/vue-ueditor-wrap"><img src="https://data.jsdelivr.com/v1/package/npm/vue-ueditor-wrap/badge?style=rounded" alt="jsdelivr"></a>
  <a href="https://www.jsdelivr.com/package/npm/vue-ueditor-wrap"><img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/vue-ueditor-wrap@latest/lib/vue-ueditor-wrap.min.js?compression=gzip" alt="size"></a>
  <a href="https://github.com/HaoChuan9421/vue-ueditor-wrap/issues"><img src="https://img.shields.io/github/issues-closed/haochuan9421/vue-ueditor-wrap.svg" alt="Issues"></a>
  <a href="https://github.com/HaoChuan9421/vue-ueditor-wrap/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/vue-ueditor-wrap.svg" alt="License"></a>
</p>

> Vue + UEditor + v-model 双向绑定。UEditor 依然是国内使用频率较高的富文本编辑器而 Vue 又有着广泛的使用，将两者结合，是很多 Vue 开发者的切实需求。自己在写公司项目时封装了这个组件，它省去了初始化 UEditor、手动调用 `getContent`，`setContent` 等繁琐的操作，而是直接采用 `v-model` 来绑定数据，使得在 Vue 项目中的使用UEditor 可以像 Input 框一样简单。整理之后分享了出来，希望能帮助到有同样需求的小伙伴。

<img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/demo.gif" width="400" />

[在线 Demo 预览](https://haochuan9421.github.io/vue-ueditor-wrap-demo/)

## Installation

```bash
npm i vue-ueditor-wrap
# 或者
yarn add vue-ueditor-wrap
```

## Quick Start

1. 下载[最新的 UEditor 资源文件](https://github.com/HaoChuan9421/vue-ueditor-wrap/tree/master/assets/downloads)

    > 你可以选择 [官方的 UEditor 资源文件](http://ueditor.baidu.com/website/download.html)。官网目前最新的版本是`1.4.3.3`，但是存在一些 BUG，针对部分常见 BUG，我进行了[修复](https://github.com/HaoChuan9421/ueditor/commits/dev-1.4.3.3)，并把编译好的文件放在了本仓库的 `assets/downloads` 目录下，你可以放心[使用](https://github.com/HaoChuan9421/vue-ueditor-wrap/tree/master/assets/downloads)，当然你也可以 `clone` [官方源码](https://github.com/fex-team/ueditor)自行修复 BUG 并[编译](http://fex.baidu.com/ueditor/#dev-bale_width_grunt)（UEditor 本身的 BUG 请不要提交到本仓库的 ISSUE 中，这个仓库只是只是一个针对 UEditor 的 Vue 封装组件而已）。
    
    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/downloads.png" width="200">

    将下载的压缩包解压并重命名为 `UEditor`（只需要选择一个你需要的版本,比如 `utf8-php`）,放入你项目的静态资源目录中（比如 `static` 或者 `public`，这取决于你项目的配置）。
    
    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/file.png" width="200">

2. 引入`VueUeditorWrap`组件

	```js
	import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
	// 或者
	const VueUeditorWrap = require('vue-ueditor-wrap') // CommonJS
	```

	> 你也可以通过直接引入 `CDN` 链接的方式来使用，它会暴露一个全局的 `VueUeditorWrap` 变量，具体如何使用你可以参考我的这篇[博客](https://juejin.im/post/5b97b84ee51d450e6c7492f6)。

	```html
	<script src="https://cdn.jsdelivr.net/npm/vue-ueditor-wrap@latest/lib/vue-ueditor-wrap.min.js"></script>
	```

3. 注册组件
    ```js
    components: {
      VueUeditorWrap
    }
    // 或者在 main.js 里将它注册为全局组件
    Vue.component('vue-ueditor-wrap', VueUeditorWrap)
    ```
4. `v-model`绑定数据

    ```html
    <vue-ueditor-wrap v-model="msg"></vue-ueditor-wrap>
    ```
    ```js
    data () {
      return {
        msg: '<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>Vue + UEditor + v-model双向绑定</h2>'
      }
    }
    ```
	> 至此你已经可以在页面中看到一个初始化之后的 `UEditor` 了，并且它已经成功和数据绑定了！👏👏👏

5. 根据项目需求修改配置，完整配置请参考 [ueditor.config.js](https://github.com/HaoChuan9421/vue-ueditor-wrap/blob/master/public/UEditor/ueditor.config.js) 或 [官方文档](http://fex.baidu.com/ueditor/)

    ```html
    <vue-ueditor-wrap v-model="msg" :config="myConfig"></vue-ueditor-wrap>
    ```

    ```js
    data () {
      return {
        msg: '<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>Vue + UEditor + v-model双向绑定</h2>',
        myConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 240,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！部署在国外的服务器，如果无法访问，请自备梯子）
          serverUrl: 'http://35.201.165.105:8000/controller.php',
          // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
          UEDITOR_HOME_URL: '/static/UEditor/'
        }
      }
    }
    ```

	> [基于 VUE CLI 2 的完整 DEMO](https://github.com/HaoChuan9421/vue-ueditor-wrap-demo)<br/>[基于 Nuxt 的服务端渲染 DEMO](https://github.com/HaoChuan9421/vue-ueditor-wrap-nuxt)。

## Advanced

1. 如何获取 `UEditor` 实例？

    ```html
    <vue-ueditor-wrap @ready="ready"></vue-ueditor-wrap>
    ```

    ```js
    methods: {
      ready (editorInstance) {
        console.log(`编辑器实例${editorInstance.key}: `, editorInstance)
      }
    }
    ```

2. 设置是否在组件的 `beforeDestroy` 钩子里销毁 `UEditor` 实例

    ```html
    <vue-ueditor-wrap :destroy="true"></vue-ueditor-wrap>
    ```
3. 选取 `v-model` 的实现方式。双向绑定的实现依赖对编辑器内容变化的监听，不同的监听方式，会有一些差异性，你可以自行选择，但建议不要修改，除非你知道自己在干吗。

    ```html
    <vue-ueditor-wrap mode="listener"></vue-ueditor-wrap>
    ```
    可选值：`listener`，`observer`
    
    默认值：`observer`
    
    参数说明：
    1. `listener` 模式借助 UEditor 的 [contentChange 事件](https://ueditor.baidu.com/doc/#UE.Editor:contentChange)，优点在于依赖官方提供的事件 API，无需额外的性能消耗，浏览器兼容性更好，但缺点在于监听的准确性并不高，存在如下方 [常见问题 5] 中的提到的 BUG。

	2. `observer` 模式借助 [MutationObserver API](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)。优点在于监听的准确性，缺点在于它会带来一点额外的性能开销。你可以通过 `observer-debounce-time` 属性设置触发间隔，还可以通过 `observer-options` 属性有选择的设置 [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) 的监听行为。该 API 只兼容到 IE11+，但 `vue-ueditor-wrap` 会在不支持的浏览器中自动启用 `listener` 模式。

	```html
	<vue-ueditor-wrap
		mode="observer"
		:observer-debounce-time="100"
		:observer-options="{ attributes: true, characterData: true, childList: true, subtree: true }"
		>
	</vue-ueditor-wrap>
	```

4. 如何进行二次开发（添加自定义按钮、弹窗等）？

	本组件提供了 `before-init` 钩子，它会在 `UEditor` 的 scripts 加载完毕之后、编辑器初始化之前触发，你可以在此时机，通过操作 window.UE 对象，来进行诸如添加自定义按钮、弹窗等的二次开发。`before-init` 的触发函数以 编辑器 id 和 配置参数 作为入参。下面提供了一个简单的自定义按钮和自定义弹窗的示例，如果有更多二次开发的需求，你可以参考[官方 API](https://ueditor.baidu.com/doc/) 或者 [UEditor 源码](https://github.com/HaoChuan9421/ueditor/tree/dev-1.4.3.3/_examples) 中的示例。
  
	<details>
	  <summary>自定义按钮 Demo</summary>
	  
	```html
	<vue-ueditor-wrap v-model="msg" @before-init="addCustomButtom"></vue-ueditor-wrap>
	```
	  
	```js
	addCustomButtom (editorId) {
	  window.UE.registerUI('test-button', function (editor, uiName) {
	    // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
	    editor.registerCommand(uiName, {
	      execCommand: function () {
	        editor.execCommand('inserthtml', `<span>这是一段由自定义按钮添加的文字</span>`)
	      }
	    })
	
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
	        editor.execCommand(uiName)
	      }
	    })
	
	    // 当点到编辑内容上时，按钮要做的状态反射
	    editor.addListener('selectionchange', function () {
	      var state = editor.queryCommandState(uiName)
	      if (state === -1) {
	        btn.setDisabled(true)
	        btn.setChecked(false)
	      } else {
	        btn.setDisabled(false)
	        btn.setChecked(state)
	      }
	    })
	
	    // 因为你是添加 button，所以需要返回这个 button
	    return btn
	  }, 0 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
	}
	```
	</details>

	<details>
	  <summary>自定义弹窗 Demo</summary>
	  
	```html
	<vue-ueditor-wrap v-model="msg" @before-init="addCustomDialog"></vue-ueditor-wrap>
	```
	  
	```js
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
	            dialog.close(true)
	          }
	        },
	        {
	          className: 'edui-cancelbutton',
	          label: '取消',
	          onclick: function () {
	            dialog.close(false)
	          }
	        }
	      ]
	    })
	
	    // 参考上面的自定义按钮
	    var btn = new window.UE.ui.Button({
	      name: 'dialog-button',
	      title: '鼠标悬停时的提示文字',
	      cssRules: `background-image: url('/test-dialog.png') !important;background-size: cover;`,
	      onclick: function () {
	        // 渲染dialog
	        dialog.render()
	        dialog.open()
	      }
	    })
	
	    return btn
	  }, 0 /* 指定添加到工具栏上的那个位置，默认时追加到最后 */, editorId /* 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
	}
	```
	
	弹出层中的 HTML 页面 `customizeDialogPage.html`
	
	```html
	<!DOCTYPE html>
	<html>
	
	<head>
	  <meta charset="UTF-8">
	  <title>Title</title>
	  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	  <meta name="renderer" content="webkit">
	  <!--页面中一定要引入internal.js为了能直接使用当前打开dialog的实例变量-->
	  <!--internal.js默认是放到 UEditor/dialogs 目录下的-->
	  <script type="text/javascript" src="./UEditor/dialogs/internal.js"></script>
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
	    dialog.onok = function() {
	      editor.execCommand('inserthtml', '<span>我点击了确定</span>');
	    };
	    dialog.oncancel = function() {
	      editor.execCommand('inserthtml', '<span>我点击了取消</span>');
	    };
	  </script>
	</body>
	
	</html>
	```
	
	</details>

5. 是否支持 `Vue SSR`？

    自 `2.4.0` 版本开始支持服务端渲染！本组件提供对 `Nuxt` 项目开箱即用的支持。但如果你是自己搭建的 `Vue SSR` 项目，可能需要自行区分服务端和客户端环境并结合 `force-init` 属性强制初始化编辑器，但大概率你用不到该属性。

## Features

1. `v-model` 双向数据绑定！你不需要考虑何时初始化 UEditor，也不需要考虑何时 `getContent`，何时`setContent`，简单到像使用 `input` 框一样！

2. 完全遵从官方 `API`，针对 UEditor 本身的配置和实例方法，完全和官方保持一致。通过给 `vue-ueditor-wrap` 组件的 `config` 属性传递一个对象，你就可以得到一个完全独立配置的 `UEditor` 编辑器。通过监听 `ready` 事件你就可以得到初始化后的 `UEditor` 实例并执行实例上的各种方法。

3. 自动添加依赖文件。你不需要自己在 `index.html` 或 `main.js` 里引入 `UEditor` 的 JS 文件。更重要的是即使你在一个页面里同时使用多个 `vue-ueditor-wrap` 组件，它所依赖的 JS 文件也只会加载一次。这么做的原因在于你不需要当用户一打开项目就先加载大量 `UEditor` 相关的资源，所有的资源文件只会在 `vue-ueditor-wrap` 组件第一次被激活时才加载。当然，如果你在 `index.html` 或 `main.js` 里引入了相关资源，`vue-ueditor-wrap` 也会准确判断，你不用担心组件会导致二次加载。

4. 每个 `vue-ueditor-wrap` 组件是完全独立的。你甚至可以在上面使用 `v-for` 指令一次渲染 99个 兔斯基（不要忘记添加 `key` 值）。
<img src="http://img.baidu.com/hi/jx2/j_0003.gif">

## FAQ（常见问题）

1. 是否支持 `IE` 等低版本浏览器？

    与 `Vue` 相同，“整体”支持到 `IE9+`，建议在 `IE11+` 中使用。

    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/ie.jpg" width="500"/>

2. 为什么我会看到这个报错?

    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error1.png" height="25"/>

    这是 `UEDITOR_HOME_URL` 参数配置错误导致的。在 VUE CLI 2 生成的项目中使用本组件，默认值是 `'/static/UEditor/'`，在 VUE CLI 3+ 生成的项目中，默认值是 `process.env.BASE_URL + 'UEditor/'` 。但这并不能满足所有情况。例如你的项目不是部署在网站根目录下，如`"http://www.example.com/my-app/"`，你可能需要设置为`"/my-app/static/UEditor/"`。是否使用了相对路径、路由是否使用 `history` 模式、服务器配置是否正确等等都有可能会产生影响。总而言之：无论本地开发和部署到服务器，你所指定的 `UEditor` 资源文件是需要真实存在的，`vue-ueditor-wrap` 也会在 JS 加载失败时通过 console 输出它试图去加载的资源文件的完整路径，你可以借此分析如何填写。当需要区分环境时，你可以通过判断 `process.env.NODE_ENV` 来分别设置。

3. 我该如何上传图片和文件？为什么我会看到`后台配置项返回格式出错`？

	<img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error2.png" height="25"/>
	
	 上传图片、文件等功能是需要与后台配合的，而你没有给 `config` 属性传递正确的 `serverUrl` ，我提供了`http://35.201.165.105:8000/controller.php` 的临时接口，你可以用于测试，**但切忌在生产环境使用！！！** 关于如何搭建上传接口，可以参考[官方文档](http://fex.baidu.com/ueditor/#server-deploy)。

4. 单图片跨域上传失败！

	`UEditor` 的单图上传是通过 Form 表单 + iframe 的方式实现的，但由于同源策略的限制，父页面无法访问跨域 iframe 的文档内容，所以会出现单图片跨域上传失败的问题。我通过 XHR 重构了单图上传的方式，[下载最新编译的 UEditor](https://github.com/HaoChuan9421/vue-ueditor-wrap/tree/master/assets/downloads) 资源文件即可在 `IE10+` 的浏览器中实现单图跨域上传了。具体细节，[点此查看](https://github.com/HaoChuan9421/ueditor/commit/31f9207142d21a406041da0bd97968b466530c76)。当然你也可以通过配置 `toolbars` 参数来隐藏单图片上传按钮，并结合上面介绍的“自定义按钮”，曲线救国，以下代码仅供参考。
  
	```js
	var input = document.createElement('input')
	input.type = "file"
	input.style.display = 'none'
	document.body.appendChild(input)
	input.click()
	input.addEventListener('change',(e)=>{
	    // 利用 AJAX 上传，上传成功之后销毁 DOM
	    console.log(e.target.files)
	})
	```

5. 为什么我输入的`"? ! $ #"` 这些特殊字符，没有成功绑定？

    当你使用 `listener` 模式时，由于 `v-model` 的实现是基于对 `UEditor` 实例上 `contentChange` 事件的监听，而你输入这些特殊字符时通常是按住 `shift` 键的，`UEditor` 本身的 `contentChange` 在 `shift` 键按住时不会触发，你也可以尝试同时按下多个键，你会发现 `contentChange` 只触发一次。你可以使用 `observer` 模式或移步 [UEditor](https://github.com/fex-team/ueditor)。

6. 如果上传图片、文件等到阿里云 OSS、腾讯云 COS 等第三方的对象存储服务中？

	**方式一**、参考上面 [ Advanced 4 ] 中提到的“二次开发”，借助自定义按钮、弹窗来实现，并通过配置 `toolbars` 来隐藏工具栏原本自带的上传按钮，这种方式比较麻烦。

	**方式二**、云存储服务一般都会提供针对后端的 API，后端同学只需要按照 [UEditor 官方文档](http://fex.baidu.com/ueditor/#server-deploy) 搭建上传接口，然后稍加改动，在收到前端上传的文件之后转存到这些三方的存储服务中即可。一般优秀的后端同学会采用这种方式，而偷懒的后端会让前端采用方式一。

> 更多问题，欢迎提交 [ISSUE](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues)。但由于这是一个个人维护的项目，我平时也有自己的工作，所以并不能保证及时解决你们的所有问题，如果小伙伴们有好的建议或更炫酷的操作，也欢迎 `PR`。

> 代码修改请遵循指定的 `ESLint` 规则，`PR` 之前请先执行 `npm run lint` 进行代码风格检测，大部分语法细节可以通过 `npm run fix` 修正，构建之后，记得修改 `package.json` 里的版本号，方便我 `Review` 通过后麻溜溜的发布到 `npm`。

## License

[MIT](https://github.com/HaoChuan9421/vue-ueditor-wrap/blob/master/LICENSE)
