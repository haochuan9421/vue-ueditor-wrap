module.exports = {
  name: 'vue-ueditor-wrap',
  build: {
    css: {
      preprocessor: 'less',
    },
    site: {
      publicPath: '/vue-ueditor-wrap/',
    },
    vetur: {
      test: /\.md/,
      tagPrefix: '',
    },
  },
  site: {
    title: 'vue-ueditor-wrap',
    description: 'Vue + UEditor + v-model双向绑定',
    logo: 'https://img.yzcdn.cn/vant/logo.png',
    hideSimulator: true,
    links: [
      {
        logo: 'https://b.yzcdn.cn/vant/logo/github.svg',
        url: 'https://github.com/HaoChuan9421/vue-ueditor-wrap',
      },
    ],
    nav: [
      {
        title: '组件',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
          {
            path: 'api',
            title: '组件 API',
          },
          {
            path: 'faq',
            title: '常见问题',
          },
          {
            path: 'changelog',
            title: '更新日志',
          },
        ],
      },
      {
        title: '示例',
        items: [
          {
            path: 'custom-btn',
            title: '自定义按钮',
          },
          {
            path: 'custom-dialog',
            title: '自定义弹窗',
          },
          {
            path: 'xiumi',
            title: '集成秀米',
          },
        ],
      },
    ],
  },
};
