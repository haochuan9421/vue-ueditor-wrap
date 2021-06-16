### Props

| 参数                        | 说明                                                                                              | 类型          | 默认值                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- | ------------- | ---------------------------- |
| v-model                     | 当前富文本编辑器内容                                                                              | _string_      |                              |
| config                      | [UEditor 配置](http://fex.baidu.com/ueditor/#start-config)                                        | _object_      |                              |
| editor-id                   | 富文本编辑器 ID                                                                                   | _string_      | `editor_` + 随机八位小写字母 |
| name                        | 类似 input 框的 name 属性，[常用于表单中](http://fex.baidu.com/ueditor/#start-submit)             | _string_      |                              |
| mode                        | 监听内容变化的方式，可选值为 `observer`, `listener`                                               | _string_      | `observer`                   |
| observer-options            | [MutationObserver 的参数 ](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) | _object_      | 见下方说明                   |
| observer-debounce-time      | MutationObserver 的回调函数防抖间隔                                                               | _number_      | 50                           |
| forceInit                   | 跳过环境检测，直接初始化                                                                          | _boolean_     | false                        |
| destroy                     | 是否在组建销毁时销毁 UEditor 实例                                                                 | _boolean_     | true                         |
| editor-dependencies         | 指定使用 UEditor 所需要加载的 JS 和 CSS                                                           | _string[]_    |                              |
| editor-dependencies-checker | 检测依赖的静态资源是否加载完成的方法                                                              | _()=>boolean_ |                              |

#### mode 属性说明

v-model 的实现依赖对编辑器内容变化的监听，组件提供了两种可选的监听方式，但是不建议修改，除非你知道自己在干什么。

1. `listener` 模式借助 UEditor 的 contentChange 事件，优点在于依赖官方提供的事件 API，无需额外的性能消耗，浏览器兼容性更好。但缺点在于监听不准确，存在如“特殊字符（? ! $ #）输入时不触发”的 BUG。
2. `observer` 模式借助 [MutationObserver API](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)。它能提供更准确的监听，但编辑器内容变化时，observer 回调可能会连续触发多次，从而导致频繁的 `emit('update:modelValue', editor.getContent());`。你可以通过 `observer-debounce-time` 属性控制 `emit` 的最小时间间隔，还可以通过 `observer-options` 属性有选择的设置 [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) 的监听行为。兼容性[参考此处](https://caniuse.com/?search=MutationObserver)，`vue-ueditor-wrap` 会在不支持的浏览器中自动启用 `listener` 模式。`observer-options` 的默认值为

```js
{
  attributes: true, // 是否监听 DOM 元素的属性变化
  attributeFilter: ['src', 'style', 'type', 'name'], // 只有在该数组中的属性值的变化才会监听
  characterData: true, // 是否监听文本节点
  childList: true, // 是否监听子节点
  subtree: true, // 是否监听后代元素
};
```

#### forceInit 属性说明

在 SSR 项目中，服务端实例化组件时组件内部不会对 UEditor 进行初始化，仅在客户端初始化 UEditor，这个参数设置为 true 可以跳过环境检测，直接初始化 UEditor，但你大概率不需要手动设置这个值。

#### editor-dependencies 属性说明

使用 UEditor 时，我们通常都是在 index.html 中提前加载好 UEditor 的脚本，如下所示。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <!-- 加载配置文件 -->
    <script type="text/javascript" src="ueditor.config.js"></script>
    <!-- 加载编辑器源码文件 -->
    <script type="text/javascript" src="ueditor.all.js"></script>
  </head>
  <body>
    <div id="container"></div>

    <!-- 实例化编辑器 -->
    <script type="text/javascript">
      var ue = UE.getEditor('container');
    </script>
  </body>
</html>
```

但是富文本编辑器通常并不是在首页使用的，例如有一个“商品编辑页”通过 UEditor 来编辑商品介绍，如果用户不需要编辑商品，根本就用不到 UEditor，对这个用户来说完全可以不加载 UEditor 相关的资源。所以最好是能做到“**按需加载**”。

<br/>

为此 `vue-ueditor-wrap` 内部会在组件实例化时通过动态创建 `script` 的方式来加载 UEditor 脚本，等脚本加载完成后，再实例化 UEditor。默认加载的脚本是 `ueditor.config.js` 和 `ueditor.all.min.js`，如果你希望自定义要加载的 JS，比如集成第三方的插件，那你就可以利用 `editor-dependencies` 属性直接指定依赖的资源，支持填写 js 和 css 文件的链接。具体用法可参考[集成秀米的示例](#/xiumi)。

<br/>

但这又带来一个问题，如果已经通过其他方式加载了 UEditor 脚本，`vue-ueditor-wrap` 还是会创建 `script` 来再加载一遍 UEditor 脚本。所以组件也提供了 `editor-dependencies-checker` 属性，这个属性接受一个函数作为参数，函数在组件创建 `script` 之前执行，如果返回 ture，则认为 UEditor 资源已存在，不会再创建 `script`。通常你不需要手动指定，组件内部已经实现了判断 `ueditor.config.js` 和 `ueditor.all.min.js` 是否加载过的默认检测函数。也就是说，如果你在网站的其他位置加载过 UEditor 的脚本，`vue-ueditor-wrap` 是不会重复加载的。

<br/>

除此之外，还需要解决的一个问题是，如果一个页面，存在多个 `vue-ueditor-wrap` 组件，那么每个组件实例化的时候，脚本都还没有加载下来，默认的检测函数也都认为不存在 UEditor 资源，就会多次创建同一个文件的 `script` 脚本。组件内部利用了 **Promise** 和 **事件机制** 解决了这个问题，感兴趣的可以去看一下组件的实现。它保证了针对同一个资源，不会创建两次 `script` 标签。

### Events

| 事件名      | 说明                                                     | 回调参数               |
| ----------- | -------------------------------------------------------- | ---------------------- |
| before-init | 在 UEditor 的 scripts 加载完毕之后、编辑器初始化之前触发 | _editorId: string_     |
| ready       | UEditor ready 时触发                                     | _editor: UEditor 实例_ |

#### before-init 事件说明

`before-init` 在 UEditor 相关的资源已经加载完毕之后、编辑器初始化之前触发。你可以在此时机，通过操作 window.UE 对象，来进行诸如添加自定义按钮、弹窗等的二次开发。`before-init` 的触发函数以 `编辑器 id` 作为入参。具体使用方式可参考[自定义按钮](#/custom-btn)，[自定义弹窗](#/custom-dialog) 的示例。

#### ready 事件说明

UEditor ready 时触发此事件，触发函数以 UEditor 实例作为入参，通过 UEditor 实例你可以调用各种 UEditor 的 API，具体参考[UEditor API 文档](http://fex.baidu.com/ueditor/#api-common)。

```html
<vue-ueditor-wrap @ready="ready"></vue-ueditor-wrap>
```

```js
methods: {
  ready (editorInstance) {
    console.log(`编辑器实例${editorInstance.key}: `, editorInstance);
  }
}
```
