<template>
  <script :id="id" type="text/plain"></script>
</template>

<script>
export default {
	name: 'VueUeditorWrap',
	data() {
		return {
			id: 'editor' + Math.random().toString().slice(-10),
			editor: null,
			defaultConfig: {
				UEDITOR_HOME_URL: './static/UEditor/',
				zIndex: 9999
			}
		}
	},
	props: {
		value: {
			type: String,
			default: 'Vue2.x + UEditor + v-model双向绑定'
		},
		config: {
			type: Object,
			default: function() {
				return {}
			}
		},
	},
	computed: {
		mixedConfig() {
			return Object.assign({}, this.defaultConfig, this.config)
		}
	},
	methods: {
		// 实例化编辑器之前-JS依赖检测
		_beforeInitEditor(value) {
			// 准确判断ueditor.config.js和ueditor.all.js均已加载 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象也存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象也存在,但为空对象
			!!window.UE && !!window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0 && !!window.UE.getEditor ? this._initEditor(value) : this._loadScripts().then(() => this._initEditor(value))
		},
		// 实例化编辑器
		_initEditor(value) {
			this.$nextTick(() => {
				// 没有按官网示例那样链式调用ready方法的原因在于需要拿到getEditor返回的实例
				this.editor = UE.getEditor(this.id, this.mixedConfig)
				this.editor.addListener("ready", () => {
					this.$emit('ready', this.editor)
					this.editor.setContent(value)
					this.editor.addListener("contentChange", () => {
						this.$emit('input', this.editor.getContent())
					});
				});
			})
		},
		// 动态添加JS依赖
		_loadScripts() {
			// 确保多个实例同时渲染时不会重复创建SCRIPT标签
			if (window.loadEnv) {
				return new Promise((reslove, reject) => {
					window.addEventListener('loadEnv', function() {
						reslove()
					});
				})
			} else {
				window.loadEnv = new Event('loadEnv')
				return new Promise((reslove, reject) => {
					// 如果在其他地方只引用ueditor.all.min.js，在加载ueditor.config.js之后仍需要重新加载ueditor.all.min.js，所以必须确保ueditor.config.js已加载
					this._loadConfig().then(() => this._loadCore()).then(() => {
						window.dispatchEvent(window.loadEnv);
						reslove()
					})
				})
			}
		},
		_loadConfig() {
			return new Promise((reslove, reject) => {
				if (!!window.UE && !!window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0) {
					reslove()
					return
				}
				let configScript = document.createElement('script')
				configScript.type = 'text/javascript'
				configScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'ueditor.config.js'
				document.getElementsByTagName('head')[0].appendChild(configScript)
				configScript.onload = function() {
					if (!!window.UE && !!window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0) {
						reslove()
					} else {
						console && console.error('加载ueditor.config.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!')
					}
				};
			})
		},
		_loadCore() {
			return new Promise((reslove, reject) => {
				if (!!window.UE && !!window.UE.getEditor) {
					reslove()
					return
				}
				let coreScript = document.createElement('script')
				coreScript.type = 'text/javascript'
				coreScript.src = this.mixedConfig.UEDITOR_HOME_URL + 'ueditor.all.min.js'
				document.getElementsByTagName('head')[0].appendChild(coreScript)
				coreScript.onload = function() {
					if (!!window.UE && !!window.UE.getEditor) {
						reslove()
					} else {
						console && console.error('加载ueditor.all.min.js失败,请检查您的配置地址UEDITOR_HOME_URL填写是否正确!')
					}
				};
			})
		},
		// 设置内容
		_setContent(value) {
			value === this.editor.getContent() || this.editor.setContent(value)
		},
	},
	// v-model语法糖实现
	watch: {
		value: {
			handler(value) {
				!!this.editor ? this._setContent(value) : this._beforeInitEditor(value)
			},
			immediate: true
		}
	}
}
</script>
