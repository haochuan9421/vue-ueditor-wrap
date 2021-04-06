// 一个简单的事件订阅发布的实现
function LoadEvent () {
  this.listeners = {};
  this.on = function (eventName, callback) {
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = {
        triggered: false,
        cbs: []
      };
    }
    // 如果已经触发过，后续添加监听的 callback 会被直接执行
    if (this.listeners[eventName].triggered) {
      callback();
    }
    this.listeners[eventName].cbs.push(callback);
  };
  this.emit = function (eventName) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].triggered = true;
      this.listeners[eventName].cbs.forEach(callback => callback());
    }
  };
}
export default LoadEvent;
