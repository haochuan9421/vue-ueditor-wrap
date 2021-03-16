// 一个简单的事件订阅发布的实现，取代原生 Event 对象，提升兼容性
export class LoadEvent {
  listeners: { [key: string]: Array<() => void> };

  constructor() {
    this.listeners = {};
  }

  on(eventName: string, callback: () => void) {
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  emit(eventName: string) {
    this.listeners[eventName] && this.listeners[eventName].forEach((callback) => callback());
  }
}
