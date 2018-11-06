<template>
  <script :id="id" :name="name" type="text/plain"></script>
</template>

<script>
// 一个简单的事件订阅发布的实现,取代原始Event对象,提升IE下的兼容性
class LoadEvent {
  constructor () {
    this.listeners = {}
  }
  on (eventName, callback) {
    this.listeners[eventName] === undefined ? this.listeners[eventName] = [] : ''
    this.listeners[eventName].push(callback)
  }
  emit (eventName) {
    this.listeners[eventName] && this.listeners[eventName].forEach(callback => callback())
  }
}
export default {
  name: 'VueUeditorWrap',
  data () {
    return {
      id: 'editor' + Math.random().toString().slice(-10),
      editor: null,
      status: 0,
      initValue: '',
      defaultConfig: {
        UEDITOR_HOME_URL: './static/UEditor/',
        enableAutoSave: false
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    init: {
      type: Function,
      default: function () {
        return () => {}
      }
    },
    destroy: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    mixedConfig () {
      return Object.assign({}, this.defaultConfig, this.config)
    }
  },
  methods: {
    // 添加自定义按钮
    registerButton: ({ name, icon, tip, handler, UE = window.UE }) => {
      UE.registerUI(name, (editor, name) => {
        editor.registerCommand(name, {
          execCommand: () => {
            handler(editor, name)
          }
        })
        const btn = new UE.ui.Button({
          name,
          title: tip,
          cssRules: `background-image: url(${icon}) !important;background-size: cover;`,
          onclick () {
            editor.execCommand(name)
          }
        })
        editor.addListener('selectionchange', () => {
          const state = editor.queryCommandState(name)
          if (state === -1) {
            btn.setDisabled(true)
            btn.setChecked(false)
          } else {
            btn.setDisabled(false)
            btn.setChecked(state)
          }
        })
        return btn
      })
    },
    // 实例化编辑器
    _initEditor () {
      this.$nextTick(() => {
        this.init()
        this.editor = window.UE.getEditor(this.id, this.mixedConfig)
        this.editor.addListener('ready', () => {
          this.status = 2
          this.editor.setContent(this.initValue)
          this.$emit('ready', this.editor)
          this.editor.addListener('contentChange', () => {
            this.$emit('input', this.editor.getContent())
          })
        })
      })
    },
    // 检测依赖,确保 UEditor 资源文件已加载完毕
    _checkDependencies () {
      return new Promise((resolve, reject) => {
        // 判断ueditor.config.js和ueditor.all.js是否均已加载(仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象存在,但为空对象)
        let scriptsLoaded = !!window.UE && !!window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0 && !!window.UE.getEditor
        if (scriptsLoaded) {
          resolve()
        } else if (window.loadEnv) { // 利用订阅发布，确保同时渲染多个组件时，不会重复创建script标签
          window.loadEnv.on('scriptsLoaded', () => {
            resolve()
          })
        } else {
          window.loadEnv = new LoadEvent()
          // 如果在其他地方只引用ueditor.all.min.js，在加载ueditor.config.js之后仍需要重新加载ueditor.all.min.js，所以必须确保ueditor.config.js已加载
          this._loadConfig().then(() => this._loadCore()).then(() => {
            resolve()
            window.loadEnv.emit('scriptsLoaded')
          })
        }
      })
    },
    _loadConfig () {
      return new Promise((resolve, reject) => {
        if (window.UE && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0) {
          resolve()
          return
        }
        let configScript = document.createElement('script')
        configScript.type = 'text/javascript'
        configScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'ueditor.config.js'
        document.getElementsByTagName('head')[0].appendChild(configScript)
        configScript.onload = function () {
          if (window.UE && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0) {
            resolve()
          } else {
            console.error('加载ueditor.config.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!\n', configScript.src)
          }
        }
      })
    },
    _loadCore () {
      return new Promise((resolve, reject) => {
        if (window.UE && window.UE.getEditor) {
          resolve()
          return
        }
        let coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'ueditor.all.min.js'
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function () {
          if (window.UE && window.UE.getEditor) {
            resolve()
          } else {
            console.error('加载ueditor.all.min.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!\n', coreScript.src)
          }
        }
      })
    },
    // 设置内容
    _setContent (value) {
      value === this.editor.getContent() || this.editor.setContent(value)
    }
  },
  beforeDestroy () {
    if (this.destroy && this.editor && this.editor.destroy) this.editor.destroy()
  },
  // v-model语法糖实现
  watch: {
    value: {
      handler (value) {
        // 0: 尚未初始化 1: 开始初始化但尚未ready 2 初始化完成并已ready
        switch (this.status) {
          case 0:
            this.status = 1
            this.initValue = value
            this._checkDependencies().then(() => this._initEditor())
            break
          case 1:
            this.initValue = value
            break
          case 2:
            this._setContent(value)
            break
          default:
            break
        }
      },
      immediate: true
    }
  }
}
</script>
