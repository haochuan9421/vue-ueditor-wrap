/**
 * 串行执行异步任务的函数，函数参数是一个数组，数组的每一项都是一个函数，这些函数会返回 promise，前一个函数 promise resolve 的值会作为下一个函数的入参
 * @param funs
 * @returns
 */
export default function asyncSeries (funs) {
  return funs.reduce((promise, fun) => promise.then(fun), Promise.resolve());
}
