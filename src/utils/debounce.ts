type Procedure = (...args: any[]) => any;

interface DebouncedFunction<F extends Procedure> {
  (this: ThisParameterType<F>, ...args: Parameters<F>): void;
  cancel: () => void;
}
/**
 * 一个简单的防抖函数
 * @param func 需要限制执行频率的函数
 * @param delay 延迟时间，这段时间过后，才可触发第二次
 * @returns void
 */
export function debounce<F extends Procedure>(func: F, delay: number): DebouncedFunction<F> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debouncedFunction = function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  debouncedFunction.cancel = function () {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  };

  return debouncedFunction;
}
