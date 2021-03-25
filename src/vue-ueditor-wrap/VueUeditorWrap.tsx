import { defineComponent, PropType, watch, nextTick, toRef, onDeactivated, onUnmounted } from 'vue';
import { LoadEvent, debounce, asyncSeries, randomString } from '../utils';

export type ModeType = 'observer' | 'listener';
export type EditorDependency = {
  isFullUrl: boolean;
  url: string;
};

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
    },
    // 检测依赖的静态资源是否加载完成的方法
    editorDependenciesReadyChecker: {
      type: Function as PropType<() => boolean>,
    },
  },

  emits: ['update:modelValue', 'before-init', 'ready'],

  setup(props, { emit }) {
    let isEditorReady = false;
    let editor: any;
    let observer: MutationObserver;
    let container: any = null;

    const modelValue = toRef(props, 'modelValue');

    // 创建加载资源的事件通信载体
    if (!window.$loadEventBus) {
      window.$loadEventBus = new LoadEvent();
    }

    // 动态创建 script 标签来加载 JS 脚本，保证同一个脚本只被加载一次
    const loadScript = (link: string) => {
      return new Promise<void>((resolve, reject) => {
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
    };

    // 加载 UEditor 相关的静态资源
    const loadEditorDependencies = () => {
      // 默认要加载的资源
      const defaultEditorDependencies = [
        {
          isFullUrl: false,
          url: 'ueditor.config.js',
        },
        {
          isFullUrl: false,
          url: 'ueditor.all.js',
        },
      ];
      // 判断上面的默认资源是否已经加载过的校验函数
      const defaultEditorDependenciesReadyChecker = () => {
        // 判断 ueditor.config.js 和 ueditor.all.js 是否均已加载
        // 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象存在,但为空对象
        return (
          window.UE && window.UE.getEditor && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0
        );
      };

      return new Promise<void>((resolve, reject) => {
        if (
          props.editorDependencies &&
          props.editorDependenciesReadyChecker &&
          props.editorDependenciesReadyChecker()
        ) {
          resolve();
          return;
        }

        if (!props.editorDependencies && defaultEditorDependenciesReadyChecker()) {
          resolve();
          return;
        }

        const baseUrl = typeof process !== 'undefined' && process.env.BASE_URL;
        // 转化为完整链接
        const editorDependencies = (props.editorDependencies || defaultEditorDependencies).map((dep) => {
          const link = dep.isFullUrl
            ? dep.url
            : (props.config?.UEDITOR_HOME_URL || (baseUrl ? `${baseUrl}UEditor/` : '/UEditor/')) + dep.url;
          return link;
        });

        // 依次加载依赖的资源文件，这些依赖执行是有顺序要求的，比如 ueditor.all.js 就要晚于 ueditor.config.js 执行
        // 动态创建 script 是先加载完的先执行，所以不可以一次性创建所有资源的引入脚本
        asyncSeries(editorDependencies.map((link) => () => loadScript(link)))
          .then(resolve)
          .catch(reject);
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
        if (isEditorReady) {
          // 使用 keep-alive 组件会出现这种情况
          editor.setContent(props.modelValue);
        } else {
          isEditorReady = true;
          emit('ready', editor);
          if (props.modelValue) {
            editor.setContent(props.modelValue);
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
        if (isEditorReady) {
          value === editor.getContent() || editor.setContent(value);
        } else {
          (props.forceInit || typeof window !== 'undefined') &&
            loadEditorDependencies().then(() => {
              container ? initEditor() : nextTick(() => initEditor());
            });
        }
      },
      {
        immediate: true,
      }
    );

    onDeactivated(() => {
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
