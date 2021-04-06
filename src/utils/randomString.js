/**
 * 生成指定长度的随机字符串
 * @param {number} length 字符串长度
 * @returns 随机字符串
 */
export default function randomString (length) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return str;
}
