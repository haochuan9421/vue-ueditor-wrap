/**
 * 生成指定长度的随机字符串
 * @param {number} length 字符串长度
 * @returns 随机字符串
 */
export function randomString(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return str;
}
