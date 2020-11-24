/*
 *@functionName: insertDataToHtml
 *@params: option={text}
 *@description: 向html加数据
 *@author: zhanhui
 *@date: 2020-11-10 14:39:37
*/
class insertDataToHtml {
    constructor(option) {
      this.option = option
    }
    apply (compiler) {
      compiler.plugin('compilation', (compilation) => {
        compilation.plugin(
          'html-webpack-plugin-after-html-processing',
          (data, cb) => {
            let reg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
            // let reg = /<script.*>.*<\/script>/g
            data.html = data.html.replace(reg, '')
            let pcUrl = JSON.parse(data.plugin.assetJson).slice(-1)[0]
            let moveUrl = JSON.parse(data.plugin.assetJson).slice(-2,-1)[0]
            let preStr = `<script>(function(){var b=navigator.userAgent,k=/(?:Windows Phone)/.test(b),c=/(?:SymbianOS)/.test(b)||k,i=/(?:Android)/.test(b),d=/(?:Firefox)/.test(b),a=/(?:Chrome|CriOS)/.test(b),g=/(?:iPad|PlayBook)/.test(b)||(i&&!/(?:Mobile)/.test(b))||(d&&/(?:Tablet)/.test(b)),h=/(?:iPhone)/.test(b)&&!g,f=!h&&!i&&!c,j=document.createElement("script");j.type="text/javascript";if(i||h){j.src="${moveUrl}"}else{j.src="${pcUrl}"}var e=!-[1];if(e){alert("IE");j.onreadystatechange=function(){if(this.readyState=="loaded"||this.readyState=="complete"){}}}else{j.onload=function(){}}document.body.appendChild(j)})()</script>`
            data.html = data.html.replace(/<\/body>/, `${preStr}</body>`)
            cb&&cb(null, data)
          }
        )
      })
    }
  }
  module.exports = insertDataToHtml