export default function deepClone(target) {
   // 创建储存容器
   const map = new WeakMap();

   // 判断 target 是否为对象
   const isObject = target => target !== null && typeof target === 'object';

   // 判断 target 是否为数组
   const isArray = 
      target => 
      typeof target === 'object' && 
      String.prototype.toString.call(target) === '[object Array]';

   // 克隆单个属性值
   function clone(target) {
       // target 如果是对象, 则生成一个新的对象
       if (isObject(target)) {

           let cloneTarget = isArray(target) ? [] : {};

           // 若容器中存在直接返回, 解决循环引用问题
           if (map.has(target)) {
               return map.get(target);
           }
           // 否则在容器中注册
           map.set(target, cloneTarget);
           for (const key in target) {
               cloneTarget[key] = clone(target[key]);
           }

           return cloneTarget;
       } else {
           return target;
       }
   }

   return clone(target);
}