/**
 * 一个简单的函数防抖
 * @param {Function} fun 需要限制执行频率的函数
 * @param {Number} delay 延迟时间，这段时间过后，才可触发第二次
 */
export default function (fun, delay) {
  let timer = null;
  const debounced = function () {
    const ctx = this;
    const args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      fun.apply(ctx, args);
    }, delay);
  };
  return debounced;
}
