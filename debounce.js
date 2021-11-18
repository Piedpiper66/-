/**
 *    在指定时候后执行回调函数，若此时间段内再次被触发，则重新计时
 *    @fn 回调函数
 *    @delay 延迟执行的时间
 *    @immediate 是否立即执行
*/
export default function debounce(fn, delay = 300, immediate = false) {
   let timer = null;

   return function (...args) {
      // 倘若定时还未设置且 immediate 为真, 执行回调
      if (!timer && immediate) fn.apply(this, args);
      // 若定时器已开启则清除上一个并重设定时器
      clearTimeout(timer);
      timer = setTimeout(() => {
         immediate ? timer = null : fn.apply(this, args);
      }, delay);
   };
};