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
        title: '开发指南',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
          {
            path: 'quickstart',
            title: '快速上手',
          },
        ],
      },
      {
        title: '基础组件',
        items: [
          {
            path: 'demo-button',
            title: 'DemoButton 按钮',
          },
        ],
      },
    ],
  },
};
