import { defineComponent, PropType, watch, nextTick, toRef, onDeactivated, onUnmounted } from 'vue';
import { LoadEvent, debounce, asyncSeries, randomString } from '../utils';

export type ModeType = 'observer' | 'listener';
export type EditorDependency = {
  isFullUrl: boolean;
  url: string;
};

enum EDITOR_STATUS {
  UNREADY,
  PENDING,
  READY,
}

export default defineComponent({
  name: 'vue-ueditor-wrap',

  props: {
    // 手动设置 UEditor ID
    editorId: String,
    // 常用于表单中 http://fex.baidu.com/ueditor/#start-submit
    name: String,
    modelValue: {
      type: String,
      default: '',
    },
    // http://fex.baidu.com/ueditor/#start-config
    config: Object as PropType<UEDITOR_CONFIG>,
    // 监听富文本内容变化的方式
    mode: {
      type: String as PropType<ModeType>,
      default: 'observer',
      validator: (value: string) => {
        // 1. observer 借助 MutationObserver API https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
        // 2. listener 借助 UEditor 的 contentChange 事件 https://ueditor.baidu.com/doc/#UE.Editor:contentChange
        return ['observer', 'listener'].indexOf(value) !== -1;
      },
    },
    // MutationObserver 的配置 https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
    observerOptions: {
      type: Object as PropType<MutationObserverInit>,
      default: () => {
        return {
          attributes: true, // 是否监听 DOM 元素的属性变化
          attributeFilter: ['src', 'style', 'type', 'name'], // 只有在该数组中的属性值的变化才会监听
          characterData: true, // 是否监听文本节点
          childList: true, // 是否监听子节点
          subtree: true, // 是否监听后代元素
        };
      },
    },
    // MutationObserver 的回调函数防抖间隔
    observerDebounceTime: {
      type: Number,
      default: 50,
      validator: (value: number) => {
        return value >= 20;
      },
    },
    //  SSR 项目，服务端实例化组件时组件内部不会对 UEditor 进行初始化，仅在客户端初始化 UEditor，这个参数设置为 true 可以跳过环境检测，直接初始化
    forceInit: Boolean,
    // 指定 UEditor 依赖的静态资源
    editorDependencies: {
      type: Array as PropType<EditorDependency[]>,
      default: () => {
        return [
          {
            isFullUrl: false,
            url: 'ueditor.config.js',
          },
          {
            isFullUrl: false,
            url: 'ueditor.all.js',
          },
        ];
      },
    },
    // 检测依赖的静态资源是否加载完成的方法
    editorDependenciesReadyChecker: {
      type: Function as PropType<() => boolean>,
      default: () => {
        // 判断 ueditor.config.js 和 ueditor.all.js 是否均已加载
        // 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象存在,但为空对象
        return (
          window.UE && window.UE.getEditor && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0
        );
      },
    },
  },

  emits: ['update:modelValue', 'before-init', 'ready'],

  setup(props, { emit }) {
    let editorStatus = EDITOR_STATUS.UNREADY;
    let initValue = '';
    let editor: any;
    let observer: MutationObserver;
    let container: any = null;

    const modelValue = toRef(props, 'modelValue');

    // 动态创建 script 标签来加载 JS 脚本
    const loadScript = (link: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = link;
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
      });
    };

    // 加载 UEditor 相关的静态资源
    const loadEditorDependencies = () => {
      return new Promise<void>((resolve, reject) => {
        if (props.editorDependenciesReadyChecker()) {
          resolve();
        } else if (window.$loadEventBus) {
          // 利用订阅发布，确保同时渲染多个组件时，不会重复创建 script 标签
          window.$loadEventBus.on('dependencies-ready', resolve);
        } else {
          window.$loadEventBus = new LoadEvent();
          // 依次加载依赖的资源文件，这些依赖执行是有顺序要求的，比如 ueditor.all.js 就要晚于 ueditor.config.js 执行
          // 动态创建 script 是先加载完的先执行，所以不可以一次性创建所有资源的引入脚本
          const baseUrl = typeof process !== 'undefined' && process.env.BASE_URL;
          asyncSeries(
            props.editorDependencies.map((dep) => () => {
              const link = dep.isFullUrl
                ? dep.url
                : (props.config?.UEDITOR_HOME_URL || baseUrl ? `${baseUrl}UEditor/` : '') + dep.url;
              return loadScript(link);
            })
          )
            .then(() => {
              resolve();
              window.$loadEventBus.emit('dependencies-ready');
            })
            .catch(reject);
        }
      });
    };

    // 基于 UEditor 的 contentChange 事件
    const observerContentChangeHandler = () => {
      emit('update:modelValue', editor.getContent());
    };
    const normalChangeListener = () => {
      editor.addListener('contentChange', observerContentChangeHandler);
    };

    // 基于 MutationObserver API
    const changeHandle = () => {
      if (editor.document.getElementById('baidu_pastebin')) {
        return;
      }
      emit('update:modelValue', editor.getContent());
    };
    const observerChangeListener = () => {
      observer = new MutationObserver(debounce(changeHandle, props.observerDebounceTime));
      observer.observe(editor.body, props.observerOptions);
    };

    // 实例化编辑器
    const initEditor = () => {
      const editorId = props.editorId || 'editor_' + randomString(8);
      container.id = editorId;
      emit('before-init', editorId);
      editor = window.UE.getEditor(editorId, props.config);
      editor.addListener('ready', () => {
        if (editorStatus === EDITOR_STATUS.READY) {
          // 使用 keep-alive 组件会出现这种情况
          editor.setContent(props.modelValue);
        } else {
          editorStatus = EDITOR_STATUS.READY;
          emit('ready', editor);
          if (initValue) {
            editor.setContent(initValue);
          }
        }
        if (props.mode === 'observer' && window.MutationObserver) {
          observerChangeListener();
        } else {
          normalChangeListener();
        }
      });
    };

    watch(
      modelValue,
      (value) => {
        console.log('modelValue change', value);
        if (value === null) {
          modelValue.value = '';
        }
        switch (editorStatus) {
          case EDITOR_STATUS.UNREADY:
            editorStatus = EDITOR_STATUS.PENDING;
            initValue = value;
            (props.forceInit || typeof window !== 'undefined') &&
              loadEditorDependencies().then(() => {
                container ? initEditor() : nextTick(() => initEditor());
              });
            break;
          case EDITOR_STATUS.PENDING:
            initValue = value;
            break;
          case EDITOR_STATUS.READY:
            if (value !== editor.getContent()) {
              editor.setContent(value);
            }
            break;
          default:
            break;
        }
      },
      {
        immediate: true,
      }
    );

    onDeactivated(() => {
      console.log('vue-ueditor-wrap deactivated');
      editor && editor.removeListener('contentChange', observerContentChangeHandler);
      observer && observer.disconnect();
    });

    onUnmounted(() => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
      if (editor && editor.destroy) {
        editor.destroy();
      }
    });

    return () => {
      return (
        <div>
          <div
            ref={(el) => {
              container = el;
            }}
            name={props.name}
          />
        </div>
      );
    };
  },
});
