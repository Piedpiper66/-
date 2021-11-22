/**
 *    在指定时间内只执行一次回调函数
 *    @fn 回调函数
 *    @delay 延迟执行的时间
 *    @immediate 是否立即执行
*/
export default function throttle (fn, delay = 300, immediate = false) {
   let timer = null, canInvoke = true;
   return function (...args) {
      // 如果函数未执行直接跳出
      if (!canInvoke) return;

      // 将要执行前设置 canInvoke 为假
      canInvoke = false;

      // 立即执行
      if (immediate) fn.apply(this, args);

      timer = setTimeout(() => {
         // 若已经立即执行, 则忽略
         if (!immediate) fn.apply(this, args);
         // 重设 canInvoke, 执行下一次
         canInvoke = true;
      }, delay);
   }
}