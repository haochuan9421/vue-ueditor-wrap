# vue-ueditor-wrap

> Vue2.x + UEditor + v-model双向绑定。之所以有这个`repo`的原因是1、UEditor依然是国内使用频率极高的所见即所得编辑器而Vue又有着广泛的使用，所以将两者结合使用，是很多Vue项目开发者的切实需求。2、目前没有发现满足这种需求，而使用又很方便的`repo`、有的可能也只是简单的暴露一个`UEditor`的实例，仍然需要开发者手动去调用`getContent`,`setContent`,而通过v-model绑定数据也是很多人期待的方式。于是自己在写公司项目时就手动撸了一个，周末整理一下分享出来，希望能帮助到有同样需求的小伙伴。

![image](https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/demo.gif)

## Installation
```bash
$ npm i vue-ueditor-wrap
```
## Features
1. `v-model`双向数据绑定!简单、易用。你的代码里将没有实例化，没有`getContent`,`setContent`，你只需要像绑定input框一样绑定`vue-ueditor-wrap`组件。当然如果你需要获取当前`UEditor`的实例，`vue-ueditor-wrap`也提供`ready`事件，你只需要接收`ready`事件触发函数的第一个参数即可，那就是你想要的。

2. 完全遵从官方API。所有的配置参数和实例方法与官方完全一致，通过给`vue-ueditor-wrap`组件的`config`属性传递一个对象，你就可以得到一个完全独立配置的`UEditor`编辑器。

3. 自动添加依赖。你不需要自己在`index.html`或`main.js`里引入`UEditor`的各种`js`文件。更重要的是即使你在一个页面里同时使用多个`vue-ueditor-wrap`组件，它所依赖的`js`文件也只会加载一次。这么做的原因在于你不需要在用户一打开项目时就先加载大量`UEditor`相关的资源,所有的资源只会在`vue-ueditor-wrap`组件所在页面打开时才加载、当然如果你在`index.html`或`main.js`里引入了相关资源、`vue-ueditor-wrap`也会自动准确判断，你不用担心它会重复加载资源。

4. 每个`vue-ueditor-wrap`组件是完全独立的。你甚至可以在上面使用`v-for`一次渲染99个兔斯基(不要忘记添加`key`值)。
<img src="http://img.baidu.com/hi/jx2/j_0003.gif">

## Quick Start(基于vue-cli,[完整DEMO](https://github.com/HaoChuan9421/vue-ueditor-wrap-demo))

1. ~~下载[官方资源文件](http://ueditor.baidu.com/website/download.html)~~
下载[基于官方并修复bug的资源文件](https://codeload.github.com/HaoChuan9421/vue-ueditor-wrap/zip/master)(参见[Issue1](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues/1))
    
    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/dist.png" width="500">

    将dist目录下的UEditor资源文件复制并重命名为`UEditor`(只需要选择一个你需要的版本,比如utf8-php),放入`static`目录下
    
    <img src="https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/file.png" width="200">

    > 因为`Ueditor`本身也依赖`ZeroClipboard`,`codemirror`等第三方库，并在`Ueditor`源码中有自动引入依赖的方法。所以没有直接将`Ueditor`封装在当前组件中，我提供的只是一个`Wrapper`以及自动加载。这也就是为什么你还需要去官网下载`Ueditor`。如果小伙伴们有更好的解决方案，欢迎`PR`。
    
    > 如果你的项目中有出现`ZeroClipboard`,`codemirror`等字眼的相关报错,很可能的原因就是因为你没有按照我的方法放置`Ueditor`资源文件。当然你也可以根据你的项目结构修改`UEDITOR_HOME_URL`,具体参见[官方文档](http://fex.baidu.com/ueditor/)和`步骤5`

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
            msg: '<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>Vue2.x + UEditor + v-model双向绑定</h2>'
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
                // 你的UEditor资源存放的路径，相对于打包后的index.html
                UEDITOR_HOME_URL: './static/UEditor/', 
                // 编辑器不自动被内容撑高 
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 240,
                // 初始容器宽度
                initialFrameWidth: '100%'
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
            console.log(`你要的实例${editorInstance.key}: `,editorInstance)
        }
    }
    ```
## Issues

1. 是否支持IE等低版本浏览器？

    因为使用了`Promise`,事件对象`Event`等,所以请自行`bable`,后续也许会加

2. 为什么我会看到这个?

    ![image](https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error1.png)

    这是因为你的`UEDITOR_HOME_URL`路径填写错误,请参考`步骤5`

3. 为什么我会看到`后台配置项返回格式出错`  

    ![image](https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error2.png)

    那时因为`UEditor`包含上传图片、文件等需要与后台配合的功能，而你没有在`config`中设置正确的`serverUrl`,`UEditor`默认的地址是根据你下载版本生成的，去找你的后端小伙伴要吧

    ![image](https://github.com/HaoChuan9421/vue-ueditor-wrap/raw/master/assets/images/error3.png)

4. 为什么我输入`"? ! $ #"` 这些特殊字符，没有绑定上去？

    那时因为`v-model`的实现基于`UEditor`实例上`contentChange`事件的监听，由于你输入这些特殊字符时通常是按住`shift`键的，`UEditor`本身的`contentChange`在`shift`键按住时不会触发，你也可以尝试同时按下多个键，你会发现`contentChange`只触发一次。所有我也很无奈呀！请移步[UEditor](https://github.com/fex-team/ueditor)

5. 单图片上传后v-model绑定的是loading小图标,我最新编辑的版本,修复了官方的这个BUG,如果你使用的是官网的资源文件,请替换资源文件或参见[Issue1](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues/1))

> 更多[Issues](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues),由于个人能力有限，如果小伙伴们有好的建议或更炫酷的操作，欢迎`PR`,如果你觉得这个组件给你的开发带来了实实在在的方便，也非常感谢你的Star和关注

## License

[MIT](http://opensource.org/licenses/MIT)

