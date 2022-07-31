### 1、如何设置 UEDITOR_HOME_URL

使用 UEditor 时需要加载相关的静态资源，这些资源会通过 script、link 标签等直接引入。UEditor 相关文件的目录结构是固定的，所以只需要知道这些静态资源所在的根路径，再拼接上具体文件自己的 path 就可以了，如下图：

<img src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/home_url.png" style="width: 500px; border-radius: 0;" />

UEDITOR_HOME_URL 说白了就是 UEditor 文件夹的访问路径。所以具体怎么设置，就取决于你的项目了。可能你项目部署之后 UEditor 静态资源的访问路径是 `/UEditor/`，也有可以能是 `/my-app/UEditor/`。

拿这个文档网站举例子，我本地开放的时候，是 `/UEditor/`，部署到 GitHub Pages 之后的路径就是 `/vue-ueditor-wrap/UEditor/`，那么我的设置就是:

```js
process.env.NODE_ENV === 'development' ? '/UEditor/' : `${process.env.PUBLIC_PATH}UEditor/`;
```

如果 UEDITOR_HOME_URL 设置错误，无法加载到 UEditor 相关的资源，会在控制台抛出如下的错误：

<img src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/load-error.png" style="width: 400px; border-radius: 0;" />

### 2、如何上传图片和文件？为什么我会看到“后台配置项返回格式出错”

<img src="//cdn.zhenghaochuan.com/p/vue-ueditor-wrap/doc/error-server.png" style="width: 500px; border-radius: 0;" />

UEditor 需要部署对应的后端服务，才能正常使用图片上传、远程图片抓取等功能。

正确部署后的 UEditor 服务，一般会提供一个统一的 HTTP 请求接口，前端同学只需要把他配置到 UEDITOR_CONFIG.serverUrl 中即可。UEditor 官方已经提供了 PHP、ASP、ASP.NET、JSP 的[部署说明](http://fex.baidu.com/ueditor/#server-deploy)。

我在参考 PHP 代码后，简单实现了一个 [Node.js 版的 UEditor 服务](https://github.com/HaoChuan9421/ueditor-koa-server)，以供有需要的同学参考。基于 Koa2 + TypeScript 开发。

`serverUrl` 为 `https://ueditor.zhenghaochuan.com/cos`。仅供测试！！！万不可用于生产环境！！！⛔️⛔️⛔️

### 3、图片、文件等如何上传到腾讯云对象存储、阿里云对象存储。。。

这类云存储服务一般都会提供针对后端的 SDK，后端只需要在接收到前端上传的文件后把它们转存到这些三方的存储服务中即可，这和把文件存储到服务器的磁盘上并没多大区别，并不需要前端同学做什么。

这个 `serverUrl` —— `https://ueditor.zhenghaochuan.com/cos`，就是基于腾讯云 COS 的 Node.js SDK 做的，其他后端语言也差不多，代码还是在 [这个仓库](https://github.com/HaoChuan9421/ueditor-koa-server) 里。

### 4、UEDITOR_HOME_URL 可以设置为 xxx 对象存储、xxx CDN 的地址吗

UEditor 相关的静态资源比较多，体积也比较大，有些同学为了优化性能，可能会考虑把这些文件放到第三方存储服务上，甚至有的项目打包后会把所有静态资源产物都上传到 CDN，出现**网站域名和这些静态资源所在域名之间的跨域**，比如 [有赞官网](https://www.youzan.com/)，虽然网站是 https://www.youzan.com/，但是加载的静态资源很多都在 b.yzcdn.cn 域名下的。这样当然是可以的，**对于这类情况，UEDITOR_HOME_URL 也是可以设置为这类第三方存储服务的地址滴~。**

<br>

但是，上传图片等弹窗都是无法使用的（比如下面这个 Demo），这是因为弹窗中内嵌的 iframe 网页（`UEditor/dialogs/**/*.html`）也是在第三方存储服务上。而这些 iframe 网页需要访问父页面的全局变量，由于同源策略的限制，跨域 iframe 是无法这么做的。可以看一下 `UEditor/dialogs/internal.js` 文件。

<demo-code compact>demo/cos.vue</demo-code>

如果你项目确实有这种需求，提供两种思路，仅供参考：

一、改写所有的 `UEditor/dialogs/**/*.html`，把需要执行的命令和数据通过 postMessage 发送给父页面，父页面接受到这些数据之后，再去调用 editor 的各种 API 执行命令。

二、把弹窗相关的按钮都隐藏掉，通过 [自定义按钮](#/custom-btn) 自己写一个可以通过执行一个方法就打开的 Vue 弹窗。可以参考一下 [自定义 Vue 弹窗](#/custom-vue-dialog) 的示例。由于这种方式不存在 iframe 跨域访问的限制，也可以灵活实现业务诉求，所以推荐用这种方式。
