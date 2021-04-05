import { App } from 'vue';
import { camelize } from './camelize';

export type WithInstall<T> = T & {
  install(app: App): void;
};

export function withInstall<T>(options: any): WithInstall<T> {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options as any;
    app.component(name, options);
    app.component(camelize(`-${name}`), options);
  };

  return options;
}
