"use strict";(self.webpackChunkpolygon_app=self.webpackChunkpolygon_app||[]).push([[278],{56:(t,e,n)=>{t.exports=function(t){var e=n.nc;e&&t.setAttribute("nonce",e)}},72:t=>{var e=[];function n(t){for(var n=-1,r=0;r<e.length;r++)if(e[r].identifier===t){n=r;break}return n}function r(t,r){for(var a={},i=[],c=0;c<t.length;c++){var u=t[c],s=r.base?u[0]+r.base:u[0],f=a[s]||0,l="".concat(s," ").concat(f);a[s]=f+1;var p=n(l),v={css:u[1],media:u[2],sourceMap:u[3],supports:u[4],layer:u[5]};if(-1!==p)e[p].references++,e[p].updater(v);else{var d=o(v,r);r.byIndex=c,e.splice(c,0,{identifier:l,updater:d,references:1})}i.push(l)}return i}function o(t,e){var n=e.domAPI(e);return n.update(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap&&e.supports===t.supports&&e.layer===t.layer)return;n.update(t=e)}else n.remove()}}t.exports=function(t,o){var a=r(t=t||[],o=o||{});return function(t){t=t||[];for(var i=0;i<a.length;i++){var c=n(a[i]);e[c].references--}for(var u=r(t,o),s=0;s<a.length;s++){var f=n(a[s]);0===e[f].references&&(e[f].updater(),e.splice(f,1))}a=u}}},113:t=>{t.exports=function(t,e){if(e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},314:t=>{t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n="",r=void 0!==e[5];return e[4]&&(n+="@supports (".concat(e[4],") {")),e[2]&&(n+="@media ".concat(e[2]," {")),r&&(n+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),n+=t(e),r&&(n+="}"),e[2]&&(n+="}"),e[4]&&(n+="}"),n})).join("")},e.i=function(t,n,r,o,a){"string"==typeof t&&(t=[[null,t,void 0]]);var i={};if(r)for(var c=0;c<this.length;c++){var u=this[c][0];null!=u&&(i[u]=!0)}for(var s=0;s<t.length;s++){var f=[].concat(t[s]);r&&i[f[0]]||(void 0!==a&&(void 0===f[5]||(f[1]="@layer".concat(f[5].length>0?" ".concat(f[5]):""," {").concat(f[1],"}")),f[5]=a),n&&(f[2]?(f[1]="@media ".concat(f[2]," {").concat(f[1],"}"),f[2]=n):f[2]=n),o&&(f[4]?(f[1]="@supports (".concat(f[4],") {").concat(f[1],"}"),f[4]=o):f[4]="".concat(o)),e.push(f))}},e}},540:t=>{t.exports=function(t){var e=document.createElement("style");return t.setAttributes(e,t.attributes),t.insert(e,t.options),e}},601:t=>{t.exports=function(t){return t[1]}},659:t=>{var e={};t.exports=function(t,n){var r=function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}e[t]=n}return e[t]}(t);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(n)}},825:t=>{t.exports=function(t){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var e=t.insertStyleElement(t);return{update:function(n){!function(t,e,n){var r="";n.supports&&(r+="@supports (".concat(n.supports,") {")),n.media&&(r+="@media ".concat(n.media," {"));var o=void 0!==n.layer;o&&(r+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),r+=n.css,o&&(r+="}"),n.media&&(r+="}"),n.supports&&(r+="}");var a=n.sourceMap;a&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleTagTransform(r,t,e.options)}(e,t,n)},remove:function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(e)}}}},904:(t,e,n)=>{n.d(e,{A:()=>C});const r=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)},o="object"==typeof global&&global&&global.Object===Object&&global;var a="object"==typeof self&&self&&self.Object===Object&&self;const i=o||a||Function("return this")(),c=function(){return i.Date.now()};var u=/\s/;var s=/^\s+/;const f=function(t){return t?t.slice(0,function(t){for(var e=t.length;e--&&u.test(t.charAt(e)););return e}(t)+1).replace(s,""):t},l=i.Symbol;var p=Object.prototype,v=p.hasOwnProperty,d=p.toString,m=l?l.toStringTag:void 0;var y=Object.prototype.toString;var h=l?l.toStringTag:void 0;const b=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":h&&h in Object(t)?function(t){var e=v.call(t,m),n=t[m];try{t[m]=void 0;var r=!0}catch(t){}var o=d.call(t);return r&&(e?t[m]=n:delete t[m]),o}(t):function(t){return y.call(t)}(t)};var g=/^[-+]0x[0-9a-f]+$/i,j=/^0b[01]+$/i,x=/^0o[0-7]+$/i,T=parseInt;const w=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return null!=t&&"object"==typeof t}(t)&&"[object Symbol]"==b(t)}(t))return NaN;if(r(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=r(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=f(t);var n=j.test(t);return n||x.test(t)?T(t.slice(2),n?2:8):g.test(t)?NaN:+t};var S=Math.max,O=Math.min;const C=function(t,e,n){var o,a,i,u,s,f,l=0,p=!1,v=!1,d=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function m(e){var n=o,r=a;return o=a=void 0,l=e,u=t.apply(r,n)}function y(t){var n=t-f;return void 0===f||n>=e||n<0||v&&t-l>=i}function h(){var t=c();if(y(t))return b(t);s=setTimeout(h,function(t){var n=e-(t-f);return v?O(n,i-(t-l)):n}(t))}function b(t){return s=void 0,d&&o?m(t):(o=a=void 0,u)}function g(){var t=c(),n=y(t);if(o=arguments,a=this,f=t,n){if(void 0===s)return function(t){return l=t,s=setTimeout(h,e),p?m(t):u}(f);if(v)return clearTimeout(s),s=setTimeout(h,e),m(f)}return void 0===s&&(s=setTimeout(h,e)),u}return e=w(e)||0,r(n)&&(p=!!n.leading,i=(v="maxWait"in n)?S(w(n.maxWait)||0,e):i,d="trailing"in n?!!n.trailing:d),g.cancel=function(){void 0!==s&&clearTimeout(s),l=0,o=f=a=s=void 0},g.flush=function(){return void 0===s?u:b(c())},g}}}]);