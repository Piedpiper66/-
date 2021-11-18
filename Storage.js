export default class Storage {
   constructor() {
      this.name = 'Storage';
   }

   /**
    *    @expires 过期时间 （毫秒）
   */
   set(key, value, expires) {

      const wrapper = {
         value,
         expires,
         startTime: new Date().getTime() /* 起始时间（毫秒） */
      };

      // 如果需要有效期, 则存入整个 wrapper, 否则只存入 value
      localStorage.setItem(key, JSON.stringify(
         expires ? wrapper : wrapper.value
      ));
   }

   get(key) {

      // 先定义一个变量临时存放提取的值
      let origin = JSON.parse(localStorage.getItem(key));

      // 如果存在 expires, 则判断是否过期
      if (origin.expires) {

         const now = new Date().getTime();

         // 过期删除
         if (now - origin.startTime > origin.expires) {
            localStorage.removeItem(key);
            return;
         }
         else {
            // 没过期则返回 value
            return origin.value;
         }
      }
      // 如果没有设置过期时间直接返回
      else {
         return origin;
      }
   }

   remove(key) {
      localStorage.removeItem(key);
   }
}