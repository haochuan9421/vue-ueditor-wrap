import { withInstall } from '../utils';
import _VueUeditorWrap from './VueUeditorWrap';

const VueUeditorWrap = withInstall<typeof _VueUeditorWrap>(_VueUeditorWrap);

export default VueUeditorWrap;
export { VueUeditorWrap };
export type { ModeType, EditorDependency } from './VueUeditorWrap';
