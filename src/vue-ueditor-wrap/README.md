### Props

| 参数                        | 说明                                                                                              | 类型          | 默认值                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- | ------------- | ---------------------------- |
| v-model                     | 当前富文本编辑器内容                                                                              | _string_      |                              |
| config                      | [UEditor 配置](http://fex.baidu.com/ueditor/#start-config)                                        | _object_      |                              |
| editor-id                   | 富文本编辑器 ID                                                                                   | _string_      | `editor_` + 随机八位小写字母 |
| name                        | 类似 input 框的 name 属性，[常用于表单中](http://fex.baidu.com/ueditor/#start-submit)             | _string_      |                              |
| mode                        | 监听内容变化的方式，可选值为 `observer`, `listener`                                               | _string_      | `observer`                   |
| observer-options            | [MutationObserver 的参数 ](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) | _object_      | 见文档网站                   |
| observer-debounce-time      | MutationObserver 的回调函数防抖间隔                                                               | _number_      | 50                           |
| forceInit                   | 跳过环境检测，直接初始化                                                                          | _boolean_     | false                        |
| editor-dependencies         | 指定使用 UEditor 所需要加载的 JS 和 CSS                                                           | _string[]_    |                              |
| editor-dependencies-checker | 检测依赖的静态资源是否加载完成的方法                                                              | _()=>boolean_ |                              |

### Events

| 事件名      | 说明                                                     | 回调参数               |
| ----------- | -------------------------------------------------------- | ---------------------- |
| before-init | 在 UEditor 的 scripts 加载完毕之后、编辑器初始化之前触发 | _editorId: string_     |
| ready       | UEditor ready 时触发                                     | _editor: UEditor 实例_ |
