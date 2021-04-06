<template>
  <div>
    <div ref="container" :name="name"></div>
  </div>
</template>

<script>
import LoadEvent from '../utils/Event.js';
import debounce from '../utils/debounce.js';
import asyncSeries from '../utils/async-series.js';
import randomString from '../utils/randomString.js';

export default {
  name: 'VueUeditorWrap',
  data () {
    return {
      isEditorReady: false,
      defaultConfig: {
        // VUE CLI 3 会添加 process.env.BASE_URL 的环境变量，而 VUE CLI 2 没有，所以借此设置 UEDITOR_HOME_URL，能涵盖大部分 Vue 开发者的使用场景
        UEDITOR_HOME_URL:
          typeof process !== 'undefined' && process.env.BASE_URL
            ? process.env.BASE_URL + 'UEditor/'
            : '/static/UEditor/'
      }
    };
  },
  props: {
    // v-model 实现方式
    mode: {
      type: String,
      default: 'observer',
      validator: function (value) {
        // 1. observer 借助 MutationObserver API https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
        // 2. listener 借助 UEditor 的 contentChange 事件 https://ueditor.baidu.com/doc/#UE.Editor:contentChange
        return ['observer', 'listener'].indexOf(value) !== -1;
      }
    },
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: function () {
        return {};
      }
    },
    init: {
      type: Function,
      default: () => {}
    },
    destroy: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    observerDebounceTime: {
      type: Number,
      default: 50,
      validator: function (value) {
        return value >= 20;
      }
    },
    observerOptions: {
      type: Object,
      default: function () {
        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
        return {
          attributes: true, // 是否监听 DOM 元素的属性变化
          attributeFilter: ['src', 'style', 'type', 'name'], // 只有在该数组中的属性值的变化才会监听
          characterData: true, // 是否监听文本节点
          childList: true, // 是否监听子节点
          subtree: true // 是否监听后代元素
        };
      }
    },
    // 本组件提供对普通 Vue 项目和 Nuxt 项目开箱即用的支持，但如果是自己搭建的 Vue SSR 项目，可能需要自行区分是客户端还是服务端环境并跳过环境检测，直接初始化
    forceInit: {
      type: Boolean,
      default: false
    },
    // 手动设置 UEditor ID
    editorId: {
      type: String
    },
    // 指定 UEditor 依赖的静态资源，js & css
    editorDependencies: Array,
    // 检测依赖的静态资源是否加载完成的方法
    editorDependenciesChecker: Function
  },
  computed: {
    mixedConfig () {
      return {
        ...this.defaultConfig,
        ...this.config
      };
    }
  },
  methods: {
    // 添加自定义按钮（自定义按钮，自定义弹窗等操作从 2.2.0 版本开始不再考虑直接集成，这会使得组件和 UEditor 过度耦合，但为了兼容一些老版用户的写法，这个方法依然保留）
    registerButton ({ name, icon, tip, handler, index, UE = window.UE }) {
      UE.registerUI(
        name,
        (editor, name) => {
          editor.registerCommand(name, {
            execCommand: () => {
              handler(editor, name);
            }
          });
          const btn = new UE.ui.Button({
            name,
            title: tip,
            cssRules: `background-image: url(${icon}) !important;background-size: cover;`,
            onclick () {
              editor.execCommand(name);
            }
          });
          editor.addListener('selectionchange', () => {
            const state = editor.queryCommandState(name);
            if (state === -1) {
              btn.setDisabled(true);
              btn.setChecked(false);
            } else {
              btn.setDisabled(false);
              btn.setChecked(state);
            }
          });
          return btn;
        },
        index,
        this.id
      );
    },
    // 实例化编辑器
    _initEditor () {
      this.$refs.container.id = this.id =
        this.editorId || 'editor_' + randomString(8); // 这么做是为了支持 Vue SSR，因为如果把 id 属性放在 data 里会导致服务端和客户端分别计算该属性的值，而造成 id 不匹配无法初始化的 BUG
      this.init();
      this.$emit('before-init', this.id, this.mixedConfig);
      this.$emit('beforeInit', this.id, this.mixedConfig); // 虽然这个驼峰的写法会导致使用 DOM 模版时出现监听事件自动转小写的 BUG，但如果经过编译的话并不会有这个问题，为了兼容历史版本，不做删除，参考 https://vuejs.org/v2/guide/components-custom-events.html#Event-Names
      this.editor = window.UE.getEditor(this.id, this.mixedConfig);
      this.editor.addListener('ready', () => {
        if (this.isEditorReady) {
          // 使用 keep-alive 组件会出现这种情况
          this.editor.setContent(this.value);
        } else {
          this.isEditorReady = true;
          this.$emit('ready', this.editor);
          if (this.value) {
            this.editor.setContent(this.value);
          }
        }
        if (this.mode === 'observer' && window.MutationObserver) {
          this._observerChangeListener();
        } else {
          this._normalChangeListener();
        }
      });
    },
    // 动态创建 script 标签来加载 JS 脚本，保证同一个脚本只被加载一次
    _loadScript (link) {
      return new Promise((resolve, reject) => {
        if (!window.$loadEventBus.listeners[link]) {
          // 如果这个资源从未被请求过，就手动创建脚本去加载
          const script = document.createElement('script');
          script.src = link;
          document.getElementsByTagName('head')[0].appendChild(script);

          script.onload = () => {
            window.$loadEventBus.emit(link);
          };
          script.onerror = reject;
        }
        window.$loadEventBus.on(link, resolve);
      });
    },
    // 动态创建 link 标签来加载 CSS 文件
    _loadCss (link) {
      return new Promise((resolve, reject) => {
        if (!window.$loadEventBus.listeners[link]) {
          const css = document.createElement('link');
          css.type = 'text/css';
          css.rel = 'stylesheet';
          css.href = link;
          document.getElementsByTagName('head')[0].appendChild(css);
          css.onload = () => {
            window.$loadEventBus.emit(link);
          };
          css.onerror = reject;
        }
        window.$loadEventBus.on(link, resolve);
      });
    },
    // 加载 UEditor 相关的静态资源
    _loadEditorDependencies () {
      // 创建加载资源的事件通信载体
      if (!window.$loadEventBus) {
        window.$loadEventBus = new LoadEvent();
      }
      // 默认要加载的资源
      const defaultEditorDependencies = [
        'ueditor.config.js',
        'ueditor.all.min.js'
      ];
      // 判断上面的默认资源是否已经加载过的校验函数
      const defaultEditorDependenciesChecker = () => {
        // 判断 ueditor.config.js 和 ueditor.all.js 是否均已加载
        // 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象存在,但为空对象
        return (
          window.UE &&
          window.UE.getEditor &&
          window.UEDITOR_CONFIG &&
          Object.keys(window.UEDITOR_CONFIG).length !== 0
        );
      };

      return new Promise((resolve, reject) => {
        if (
          this.editorDependencies &&
          this.editorDependenciesChecker &&
          this.editorDependenciesChecker()
        ) {
          resolve();
          return;
        }

        if (!this.editorDependencies && defaultEditorDependenciesChecker()) {
          resolve();
          return;
        }

        // 把 js 和 css 分组
        const { jsLinks, cssLinks } = (
          this.editorDependencies || defaultEditorDependencies
        ).reduce(
          (res, link) => {
            // 如果不是完整的 URL 就在前面补上 UEDITOR_HOME_URL, 完整的 URL 形如：
            // 1. http://www.example.com/xxx.js
            // 2. https://www.example.com/xxx.js
            // 3. //www.example.com/xxx.js
            // 4. www.example.com/xxx.js
            const isFullUrl = /^((https?:)?\/\/)?[-a-zA-Z0-9]+(\.[-a-zA-Z0-9]+)+\//.test(
              link
            );
            if (!isFullUrl) {
              link = (this.mixedConfig.UEDITOR_HOME_URL || '') + link;
            }
            if (link.endsWith('.js')) {
              res.jsLinks.push(link);
            } else if (link.endsWith('.css')) {
              res.cssLinks.push(link);
            }
            return res;
          },
          {
            jsLinks: [],
            cssLinks: []
          }
        );

        Promise.all([
          Promise.all(cssLinks.map((link) => this._loadCss(link))),
          // 依次加载依赖的 JS 文件，JS 执行是有顺序要求的，比如 ueditor.all.js 就要晚于 ueditor.config.js 执行
          // 动态创建 script 是先加载完的先执行，所以不可以一次性创建所有资源的引入脚本
          asyncSeries(jsLinks.map((link) => () => this._loadScript(link)))
        ])
          .then(() => resolve())
          .catch(reject);
      });
    },
    _contentChangeHandler () {
      this.$emit('input', this.editor.getContent());
    },
    // 基于 UEditor 的 contentChange 事件
    _normalChangeListener () {
      this.editor.addListener('contentChange', this._contentChangeHandler);
    },
    // 基于 MutationObserver API
    _observerChangeListener () {
      const changeHandle = () => {
        if (this.editor.document.getElementById('baidu_pastebin')) {
          return;
        }
        this.$emit('input', this.editor.getContent());
      };
      // 函数防抖
      this.observer = new MutationObserver(
        debounce(changeHandle, this.observerDebounceTime)
      );
      this.observer.observe(this.editor.body, this.observerOptions);
    }
  },
  deactivated () {
    if (this.editor) {
      this.editor.removeListener('contentChange', this._contentChangeHandler);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  beforeDestroy () {
    if (this.destroy && this.editor && this.editor.destroy) {
      this.editor.destroy();
    }
    if (this.observer && this.observer.disconnect) {
      this.observer.disconnect();
    }
  },
  // v-model语法糖实现
  watch: {
    value: {
      handler (value) {
        if (this.isEditorReady) {
          value === this.editor.getContent() || this.editor.setContent(value);
        } else {
          (this.forceInit || typeof window !== 'undefined') &&
            this._loadEditorDependencies()
              .then(() => {
                this.$refs.container
                  ? this._initEditor()
                  : this.$nextTick(() => this._initEditor());
              })
              .catch(() => {
                throw new Error(
                  '[vue-ueditor-wrap] UEditor 资源加载失败！请检查资源是否存在，UEDITOR_HOME_URL 是否配置正确！'
                );
              });
        }
      },
      immediate: true
    }
  }
};
</script>
