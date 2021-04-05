### 背景

当网站域名和 UEditor 静态资源所在域名之间存在跨域时是无法使用普通弹窗的，比如上传图片弹窗，表情包弹窗。。。因为他们都是基于 iframe 的。但是可以通过自定按钮，我们可以唤起一个普通的 Vue 弹窗，这样就不会被跨域限制，也能更加灵活的实现业务诉求。[参考 FAQ 4](#/faq)

<demo-code>demo/custom-vue-dialog.vue</demo-code>
