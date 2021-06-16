# 更新日志

### 提示

当前文档为 vue-ueditor-wrap v3 的更新日志。

使用 Vue 2 的同学请继续安装 vue-ueditor-wrap v2。组件的 v3 版本与 Vue 2 不兼容，请不要在 Vue 2 项目中安装最新版的组件。

本项目遵循 [Semver](https://semver.org/lang/zh-CN/) 语义化版本规范。

### 从 v2 升级

请先把 Vue 升级到 3.x，组件的变更内容如下：

1. 移除了 init 属性
2. 移除了 registerButton 方法
3. 不再提供默认的 UEDITOR_HOME_URL，必须明确的指定。
4. umd 文件暴露的全局变量从 VueUeditorWrap 变成了 vue-ueditor-wrap

请检查自己的代码中是否涉及到上述属性或方法：

1. init 属性和 registerButton 方法是为了实现自定义按钮的，如果有自定义按钮的需求，请参考 [自定义按钮示例](#/custom-btn)
2. UEDITOR_HOME_URL 原默认值为 `process.env.BASE_URL ? process.env.BASE_URL + 'UEditor/' : '/static/UEditor/'`。提供默认值会导致即使开发者没有传递该属性，ueditor.config.js 中的 UEDITOR_HOME_URL 也会被覆盖。

## 更新内容

### v3.0.6

`2021-06-16`

**Feature**

- 新增 destroy 属性

**Fix**

- 修复可能重复渲染组建的 BUG

### v3.0.3

`2021-04-07`

**Feature**

- 性能和兼容性优化

### v3.0.2

`2021-04-06`

**Fixes**

- 支持在 VSCode（需安装 [Vetur 插件](https://vuejs.github.io/vetur/guide/component-data.html#supported-frameworks)）和 WebStorm 中自动提示和补全组件属性。

### v3.0.0

`2021-04-05`

**Feature**

- 支持 Vue 3
- 支持 TypeScript
- 使用 Composition API 重构
- 新增 editor-dependencies 和 editor-dependencies-checker 属性，支持更灵活的依赖加载并重构了依赖加载的逻辑
- 更完善的文档网站
