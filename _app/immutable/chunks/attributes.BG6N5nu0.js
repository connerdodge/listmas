import{L as g,g as c,h as d,a as n}from"./runtime.DqadTwwG.js";function h(r,s,o,i){var f=r.__attributes??(r.__attributes={});d&&(f[s]=r.getAttribute(s),s==="src"||s==="srcset"||s==="href"&&r.nodeName==="LINK")||f[s]!==(f[s]=o)&&(s==="style"&&"__styles"in r&&(r.__styles={}),s==="loading"&&(r[g]=o),o==null?r.removeAttribute(s):typeof o!="string"&&a(r).includes(s)?r[s]=o:r.setAttribute(s,o))}var p=new Map;function a(r){var s=p.get(r.nodeName);if(s)return s;p.set(r.nodeName,s=[]);for(var o,i=r,f=Element.prototype;f!==i;){o=n(i);for(var _ in o)o[_].set&&s.push(_);i=c(i)}return s}export{h as s};
