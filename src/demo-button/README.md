# DemoButton 按钮

### 介绍

DemoButton 是一个示例按钮组件

### 引入

```js
import Vue from 'vue';
import { DemoButton } from 'vue-ueditor-wrap';

Vue.use(DemoButton);
```

## 代码演示

### 基础用法

```html
<demo-button type="primary" />
```

## API

### Props

| 参数          | 说明                                                  | 类型     | 默认值    |
| ------------- | ----------------------------------------------------- | -------- | --------- |
| type          | 类型，可选值为 `primary` `success` `warning` `danger` | _string_ | `primary` |
| text          | 按钮文本                                              | _string_ | -         |
| color `1.0.0` | 按钮颜色                                              | _string_ | -         |

### Events

| 事件名 | 说明       | 回调参数     |
| ------ | ---------- | ------------ |
| click  | 点击时触发 | event: Event |

### Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 默认插槽 |
