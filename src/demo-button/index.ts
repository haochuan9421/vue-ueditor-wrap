import { withInstall } from '../utils';
import DemoButton from './DemoButton';

const Button = withInstall<typeof DemoButton>(DemoButton);

export default Button;
export { Button };
export type { ButtonType } from './DemoButton';
