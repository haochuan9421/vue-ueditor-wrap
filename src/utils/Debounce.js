// 防抖函数
export default function (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  let later = function () {
    let last = Date.now() - timestamp
    if (last < wait && last >= 0) {
      // 间隔太小，频率过多，继续延迟
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null // 间隔够长，运行函数
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (..._args) {
    context = this
    args = _args
    timestamp = Date.now()
    let callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
