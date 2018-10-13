# vue-ueditor-wrap

<p align="center">
    <a href="https://gitter.im/haochuan9421/vue-ueditor-wrap/"><img src="https://badges.gitter.im/haochuan9421/vue-ueditor-wrap.svg" alt="Chatroom"></a>
    <a href="https://www.npmjs.com/package/vue-ueditor-wrap"><img src="https://img.shields.io/npm/v/vue-ueditor-wrap.svg" alt="Version"></a>
    <a href="https://npmcharts.com/compare/vue-ueditor-wrap?minimal=true"><img src="https://img.shields.io/npm/dm/vue-ueditor-wrap.svg" alt="Downloads"></a>
    <a href="https://github.com/HaoChuan9421/vue-ueditor-wrap/commits/master"><img src="https://img.shields.io/github/last-commit/haochuan9421/vue-ueditor-wrap.svg" alt="Commit"></a>
    <a href="https://github.com/HaoChuan9421/vue-ueditor-wrap/issues"><img src="https://img.shields.io/github/issues-closed/haochuan9421/vue-ueditor-wrap.svg" alt="Issues"></a>
    <a href="https://www.npmjs.com/package/vue-ueditor-wrap"><img src="https://img.shields.io/npm/l/vue-ueditor-wrap.svg" alt="License"></a>
</p>

> Vue + UEditor + v-model双向绑定。之所以有这个`repo`的原因是:<br>&emsp;1、UEditor依然是国内使用频率极高的所见即所得编辑器而Vue又有着广泛的使用，所以将两者结合使用，是很多Vue项目开发者的切实需求。<br>&emsp;2、目前没有发现满足这种需求，而使用又很方便的`repo`、有的可能也只是简单的暴露一个`UEditor`的实例，仍然需要开发者手动去调用`getContent`,`setContent`,而通过v-model绑定数据也是很多人期待的方式。于是自己在写公司项目时就手动撸了一个，周末整理一下分享出来，希望能帮助到有同样需求的小伙伴。

<img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/demo.gif" width="400" />

[点击预览](https://haochuan9421.github.io/vue-ueditor-wrap-demo/)&emsp;[加入聊天室](https://gitter.im/haochuan9421/vue-ueditor-wrap/)

## Installation
```bash
$ npm i vue-ueditor-wrap
```

## Quick Start(基于vue-cli 2.x,[完整DEMO](https://github.com/HaoChuan9421/vue-ueditor-wrap-demo))

1. ~~下载[官方资源文件](http://ueditor.baidu.com/website/download.html)~~

    > 下载[最新编译的资源文件](https://github.com/HaoChuan9421/vue-ueditor-wrap/tree/master/dist)
    官网下载的版本是`1.4.3.3`,存在诸多BUG,例如[Issue1](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues/1)和[Issue8](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues/8),且官方不再积极维护。为了世界的和平,针对一些BUG,我进行了[修复](https://github.com/HaoChuan9421/ueditor/commits/dev-1.4.3.3)，并把编译好的文件放在了本仓库的`dist`目录下，你可以放心[下载](https://github.com/HaoChuan9421/vue-ueditor-wrap/tree/master/dist),当然你也可以自己`clone`[官方源码](https://github.com/fex-team/ueditor)并[编译](http://fex.baidu.com/ueditor/#dev-bale_width_grunt)
    
    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/dist.png" width="200">

    将dist目录下的UEditor资源文件解压并重命名为`UEditor`(只需要选择一个你需要的版本,比如utf8-php),放入你项目的`static`目录下
    
    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/file.png" width="200">

    > 如果你使用的是 [vue-cli 3.x](https://cli.vuejs.org/zh/guide/), 把UEditor资源文件解压并重命名为`UEditor`,然后放入你项目的`public`目录下, 并在第五步添加配置 `UEDITOR_HOME_URL: './UEditor/'`(路由使用`history`模式需要使用绝对路径)

2. 引入`VueUeditorWrap`组件

    `import VueUeditorWrap from 'vue-ueditor-wrap'`

3. 注册组件
    ```js
    components: {
        VueUeditorWrap
    },
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
    > 至此你已经可以在页面中看到一个初始化之后的`UEditor`了，并且它已经成功和数据绑定了！

5. 根据项目需求修改配置，完整配置选项查看ueditor.config.js源码或 [官方文档](http://fex.baidu.com/ueditor/)
    ```html
    <vue-ueditor-wrap :config="myConfig"></vue-ueditor-wrap>
    ```
    ```js
    data () {
        return {
            myConfig: {
                // 如果需要上传功能,找后端小伙伴要服务器接口地址
                // serverUrl: 'http://api.demo.com/ueditor/upload',
                // 你的UEditor资源存放的路径,相对于打包后的index.html(路由使用history模式注意使用绝对路径或者填写正确的相对路径)
                UEDITOR_HOME_URL: './static/UEditor/',
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 240,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 关闭自动保存
                enableAutoSave: false
            }
        }
    }
    ```
6. 获取`UEditor`实例
    ```html
    <vue-ueditor-wrap @ready="ready"></vue-ueditor-wrap>
    ```
    ```js
    methods: {
        ready(editorInstance) {
            console.log(`编辑器实例${editorInstance.key}: `,editorInstance)
        }
    }
    ```

7. 设置是否在组件的`beforeDestroy`钩子里销毁`UEditor`实例
    ```html
    <vue-ueditor-wrap :destroy="true"></vue-ueditor-wrap>
    ```

8. 通过传入 init 参数来对 window.UE 进行二次开发，如添加自定义按钮等。init 函数将在 scripts 加载完毕、editor 初始化之前运行。
    ```html
    <vue-ueditor-wrap :init="myInit"></vue-ueditor-wrap>
    ```
    ```js
    methods: {
        myInit() {
            window.UE.registerUI(/* ... */)
        }
    }
    ```

9. 结合 `init` 参数以及本组件提供的 `registerButton` 方法，方便地添加自定义按钮：

    ```html
    <template>
        <vue-ueditor-wrap ref="ueditor" v-model="html" :init="myInit"></vue-ueditor-wrap>
    </template>

    <script>
    export default {
        ...
        methods: {
            myInit() {
                this.$refs.ueditor.registerButton({
                    name: 'test',
                    icon: '/static/test-button.png',
                    tip: 'this is a test tip',
                    handler: (editor, name) => {
                            editor.execCommand('inserthtml', `<span>text inserted by test button</span>`)
                    }
                })
            }
        }
    }
    </script>
    ```

    > 参数： `name` 按钮名称；`icon` 按钮图标；`tip` 按钮 hover 时显示的简介；`handler` 以 editor 和 name 为入参的按钮动作函数。
## Features
1. `v-model`双向数据绑定!简单、易用。像绑定input框一样绑定`vue-ueditor-wrap`组件即可，你的代码里将没有实例化，没有`getContent`,`setContent`。

2. 完全遵从官方API。所有的配置参数和实例方法与官方完全一致，通过给`vue-ueditor-wrap`组件的`config`属性传递一个对象，你就可以得到一个完全独立配置的`UEditor`编辑器。

3. 自动添加依赖文件。你不需要自己在`index.html`或`main.js`里引入`UEditor`的各种`js`文件。更重要的是即使你在一个页面里同时使用多个`vue-ueditor-wrap`组件，它所依赖的`js`文件也只会加载一次。这么做的原因在于你不需要当用户一打开项目就先加载大量`UEditor`相关的资源,所有的资源文件只会在`vue-ueditor-wrap`组件第一次被激活时才加载。当然如果你在`index.html`或`main.js`里引入了相关资源、`vue-ueditor-wrap`也会准确判断，你不用担心它会重复加载资源。

4. 每个`vue-ueditor-wrap`组件是完全独立的。你甚至可以在上面使用`v-for`一次渲染99个兔斯基(不要忘记添加`key`值)。
<img src="http://img.baidu.com/hi/jx2/j_0003.gif">

## Issues

1. 是否支持IE等低版本浏览器？

    ~~因为使用了`Promise`,事件对象`Event`等,所以请自行`babel`,后续也许会加~~

    支持IE9

    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/ie.jpg" width="500"/>

2. 为什么我会看到这个?

    ![image](https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error1.png)

    这是因为你的`UEDITOR_HOME_URL`路径填写错误,请参考`步骤5`

3. 为什么我会看到`后台配置项返回格式出错`？我如何上传图片和文件？

    ![image](https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error2.png)

    `UEditor`的上传图片、文件等是需要与后台配合的功能，而你没有在`config`中设置正确的`serverUrl`,`UEditor`默认的地址是根据你下载版本生成的，去找你的后端小伙伴要吧

    ![image](https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error3.png)

4. 为什么我输入`"? ! $ #"` 这些特殊字符，没有绑定上去？

    那时因为`v-model`的实现基于`UEditor`实例上`contentChange`事件的监听，由于你输入这些特殊字符时通常是按住`shift`键的，`UEditor`本身的`contentChange`在`shift`键按住时不会触发，你也可以尝试同时按下多个键，你会发现`contentChange`只触发一次。所有我也很无奈呀！请移步[UEditor](https://github.com/fex-team/ueditor)

5. 单图片上传后v-model绑定的是loading小图标,我最新编辑的版本,修复了官方的这个BUG,如果你使用的是官网的资源文件,请替换资源文件或参见[Issue1](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues/1))

> 更多[Issues](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues),由于个人能力有限，如果小伙伴们有好的建议或更炫酷的操作，欢迎`PR`,如果你觉得这个组件给你的开发带来了实实在在的方便，也非常感谢你的Star和关注

> PR之前请先执行`npm run lint`进行代码风格检测,大部分语法细节可以通过`npm run fix`修正,记得修改`package.json`的版本号`version`

## License

[MIT](http://opensource.org/licenses/MIT)

