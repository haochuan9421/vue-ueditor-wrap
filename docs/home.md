### 介绍

一个“包装”了 UEditor 的 Vue 组件，支持通过 v-model 来绑定富文本编辑器的内容，让 UEditor 的使用简单到像 Input 框一样。省去了初始化 UEditor、手动调用 getContent，setContent 等繁琐的步骤。

### 快速上手

##### 1. 安装组件

```bash
# vue-ueditor-wrap v3 仅支持 Vue 3
npm i vue-ueditor-wrap@3.x -S
# or
yarn add vue-ueditor-wrap@3.x
```

> Vue 2 项目 [点击此处](https://github.com/HaoChuan9421/vue-ueditor-wrap/tree/2.x) 查看使用说明。

##### 2. 下载 UEditor

> UEditor 并不支持通过 npm 的方式来安装，vue-ueditor-wrap 也只是一个 Vue 组件，组件本身并不是 **UEditor 的 Vue 版**。了解 UEditor 基本使用，请参考 [UEditor 官网](http://fex.baidu.com/ueditor/#start-start)。

| 编码方式\语言 | PHP                                                                         | NET                                                                         | JSP                                                                         | ASP                                                                         |
| ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| utf8          | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/utf8-php.zip) | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/utf8-net.zip) | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/utf8-jsp.zip) | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/utf8-asp.zip) |
| gbk           | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/gbk-php.zip)  | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/gbk-net.zip)  | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/gbk-jsp.zip)  | [下载](//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/zip/gbk-asp.zip)  |

<p style="color: #999;">说明：不同语言的 UEditor，前端部分，并无区别，只是包含了对应语言的 <a href="http://fex.baidu.com/ueditor/#server-deploy" target="_blank" rel="noopener noreferrer">服务端</a> 示例代码。UEditor 官方并没有提供 Node.js 版的示例代码，有需求的同学可以参考 <a href="https://github.com/HaoChuan9421/ueditor-koa-server" target="_blank" rel="noopener noreferrer">此处</a>。</p>

<br/>

将解压的文件夹重命名为 UEditor 并移动到你项目的[静态资源](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#public-文件夹)目录下，比如下面是一个由 Vue CLI（v3+）创建的项目，静态资源目录就是 public。

<image src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/static-dir.png" style="width:300px;"/>

##### 3. 注册组件

```js
// main.js
import { createApp } from 'vue';
import VueUeditorWrap from 'vue-ueditor-wrap';
import App from './App.vue';

createApp(App).use(VueUeditorWrap).mount('#app');
```

##### 4. v-model 绑定数据

```html
<vue-ueditor-wrap v-model="msg" :config="editorConfig" editor-id="editor-demo-01"></vue-ueditor-wrap>
```

```js
import { ref } from 'vue';

export default {
  setup() {
    const msg = ref('<h2>Hello World!</h2>');
    return {
      msg,
    };
  },
  created() {
    // 更多 UEditor 配置，参考 http://fex.baidu.com/ueditor/#start-config
    this.editorConfig = {
      UEDITOR_HOME_URL: '/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
      serverUrl: '//ueditor.zhenghaochuan.com/cos', // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
    };
  },
};
```

至此你已经可以在页面中看到一个初始化之后的 UEditor 了，并且它已经成功和数据绑定了！👏👏👏

<br/>

<demo-code inline>demo/home.vue</demo-code>

<br/>

了解更多，请参考 [组件 API](#/api)

### 问题反馈

##### 方式一、去 GitHub 提 [ISSUE](https://github.com/HaoChuan9421/vue-ueditor-wrap/issues)

##### 方式二、添加我的微信，备注 "ueditor"。

<img src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/wechat.JPG" style="width: 200px" />

如果你感兴趣的话，可以阅读一下本组件的源码，并不复杂，欢迎 PR。

### 推广链接

<a href="https://curl.qcloud.com/xn64xbRz" target="_blank"><img src="https://cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/qcloud-cps.jpg" style="width: 280px;"></a>
