// 一个简单的事件订阅发布的实现，取代原生Event对象，提升IE下的兼容性
function LoadEvent () {
  this.listeners = {};
  this.on = function (eventName, callback) {
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  };
  this.emit = function (eventName) {
    this.listeners[eventName] && this.listeners[eventName].forEach(callback => callback());
  };
}
export default LoadEvent;
