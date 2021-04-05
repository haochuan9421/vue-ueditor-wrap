import { mount } from '@vue/test-utils';
import VueUeditorWrap from '..';

test('render vue-ueditor-wrap', () => {
  const wrapper = mount(VueUeditorWrap);
  expect(wrapper.html()).toMatchSnapshot();
});
