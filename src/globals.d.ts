import { LoadEvent } from '../utils/LoadEvent';

declare global {
  interface UE {
    [key: string]: any;
  }
  interface UEDITOR_CONFIG {
    UEDITOR_HOME_URL: string;
    [key: string]: any;
  }

  declare const UE: UE;
  declare const UEDITOR_CONFIG: UEDITOR_CONFIG;

  declare interface Window {
    UE: UE;
    UEDITOR_CONFIG: UEDITOR_CONFIG;
    $loadEventBus: InstanceType<typeof LoadEvent>;
  }
}
