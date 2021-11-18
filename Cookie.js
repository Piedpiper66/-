/**
 *   处理 document.cookie
*/
export default CookieUtil = {
   get: function (name) {
      const cookie = document.cookie,
            cookieName = encodeURIComponent(name) + '=',
            cookieStart = cookie.indexOf(cookieName); /* cookie 初始索引 */
      let cookieValue = null;
      
      // 倘若该 cookie 存在
      if (cookieStart > -1) {
         // 获取 cookie 末尾索引
         let cookieEnd = cookie.indexOf(';', cookieStart);
         // 尾部 cookie 没有 ';' 结尾, 则末尾索引为 document.cookie 的长度
         if (cookieEnd == -1) {
            cookieEnd = cookie.length;
         }
         // 从 cookie 名的后一位开始截取 cookie 的值
         cookieValue = decodeURIComponent(cookie.substring(cookieStart + cookieName.length, cookieEnd))
      }

      return cookieValue;
   },
   set: function (name, value, expires, path, domain, secure) {
      let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (expires instanceof Date) {
         cookieText += `; expires=${expires.toUTCString()}`;
      }

      if (path) {
         cookieText += `; path=${path}`;
      }

      if (domain) {
         cookieText += `; domain=${domain}`;
      }

      if (secure) {
         cookieText += '; secure';
      }

      document.cookie = cookieText;
   },
   remove: function (name, path, domain, secure) {
      this.set(name, '', new Date(0), path, domain, secure);
   }
}