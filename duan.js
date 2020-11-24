
       (function() {
            var ua = navigator.userAgent,
                isWindowsPhone = /(?:Windows Phone)/.test(ua),
                isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
                isAndroid = /(?:Android)/.test(ua),
                isFireFox = /(?:Firefox)/.test(ua),
                isChrome = /(?:Chrome|CriOS)/.test(ua),
                isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
                isPhone = /(?:iPhone)/.test(ua) && !isTablet,
                isPc = !isPhone && !isAndroid && !isSymbian,
                script = document.createElement('script');
                script.type = 'text/javascript';
                if(isAndroid || isPhone) {
                  script.src = 'hahaha';
                } else {
                  script.src = 'hahaha';
                }
                var isIE = !-[1];
                if (isIE) {
                  // alert("IE");
                  script.onreadystatechange = function() {
                    if (this.readyState == "loaded" || this.readyState == "complete") {
                      // callback();
                    }
                  };
                } else {
                  // IE9及以上浏览器，Firefox，Chrome，Opera
                  script.onload = function() {
                    // callback();
                  };
                }
                document.body.appendChild(script)
        })();