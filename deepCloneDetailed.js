const
   mapTag = '[object Map]',
   setTag = '[object Set]',
   arrayTag = '[object Array]',
   objectTag = '[object Object]',
   argsTag = '[object Arguments]',
   boolTag = '[object Boolean]',
   dateTag = '[object Date]',
   numberTag = '[object Number]',
   stringTag = '[object String]',
   symbolTag = '[object Symbol]',
   errorTag = '[object Error]',
   regexpTag = '[object RegExp]',
   funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];


function forEach(array, iteratee) {
   let index = -1;
   const length = array.length;
   while (++index < length) {
      iteratee(array[index], index);
   }
   return array;
}

function isObject(target) {
   const type = typeof target;
   return target !== null && (type === 'object' || type === 'function');
}

function getType(target) {
   return Object.prototype.toString.call(target);
}

function getInit(target) {
   const Ctor = target.constructor;
   return new Ctor();
}

function cloneSymbol(target) {
   return Object(Symbol.prototype.valueOf.call(target));
}

function cloneReg(target) {
   const reFlags = /\w*$/;
   const result = new target.constructor(target.source, reFlags.exec(target));
   result.lastIndex = target.lastIndex;
   return result;
}

function cloneFunction(func) {
   const bodyReg = /(?<={)(.|\n)+(?=})/m;
   const paramReg = /(?<=\().+(?=\)\s+{)/;
   const funcString = func.toString();
   if (func.prototype) {
      const param = paramReg.exec(funcString);
      const body = bodyReg.exec(funcString);
      if (body) {
         if (param) {
            const paramArr = param[0].split(',');
            return new Function(...paramArr, body[0]);
         } else {
            return new Function(body[0]);
         }
      } else {
         return null;
      }
   } else {
      return eval(funcString);
   }
}

function cloneOtherType(target, type) {
   const Ctor = target.constructor;
   switch (type) {
      case boolTag:
      case numberTag:
      case stringTag:
      case errorTag:
      case dateTag:
         return new Ctor(target);
      case regexpTag:
         return cloneReg(target);
      case symbolTag:
         return cloneSymbol(target);
      case funcTag:
         return cloneFunction(target);
      default:
         return null;
   }
}

export default function clone(target, map = new WeakMap()) {

   // 克隆原始类型
   if (!isObject(target)) {
      return target;
   }

   // 初始化
   const type = getType(target);
   let cloneTarget;
   if (deepTag.includes(type)) {
      cloneTarget = getInit(target, type);
   } else {
      return cloneOtherType(target, type);
   }

   // 防止循环引用
   if (map.has(target)) {
      return map.get(target);
   }
   map.set(target, cloneTarget);

   // 克隆 Set
   if (type === setTag) {
      target.forEach(value => {
         cloneTarget.add(clone(value, map));
      });
      return cloneTarget;
   }

   // 克隆 Map
   if (type === mapTag) {
      target.forEach((value, key) => {
         cloneTarget.set(key, clone(value, map));
      });
      return cloneTarget;
   }

   // 克隆对象和数组
   const keys = type === arrayTag ? undefined : Object.keys(target);
   forEach(keys || target, (value, key) => {
      if (keys) {
         key = value;
      }
      cloneTarget[key] = clone(target[key], map);
   });

   return cloneTarget;
}
