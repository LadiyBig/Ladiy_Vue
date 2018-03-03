var token = null;
console.log(123123213);

(function() {
    var $ = function() {
        if (arguments.length > 0) {
            if ( typeof arguments[0] === 'function') {
                document.addEventListener('DOMContentLoaded', arguments[0]);
            } else if ( typeof arguments[0] == 'string') {
                var selectors = arguments[0].trim().split(/\s+/);
                var children = [],
                    selector,
                    res,
                    isId = false;

                var parents = arguments.length > 1 ? arguments[1] : document;
                if (!Array.isArray(parents)) {
                    parents = [parents];
                    isId = true;
                }
                for (var i = 0; i < selectors.length; ++i) {
                    selector = selectors[i];
                    for (var j = 0; j < parents.length; ++j) {
                        switch(selector.charAt(0)) {
                        case '#':
                            res = $.byId.call(this, selector.substr(1), parents[j]);
                            isId = true;
                            break;
                        case '.':
                            res = $.byClass.call(this, selector.substr(1), parents[j]);
                            isId = false;
                            break;
                        default:
                            res = $.byTag.call(this, selector, parents[j]);
                            isId = false;
                        }
                        if ( res instanceof HTMLCollection || res instanceof NodeList) {
                            for (var k = 0; k < res.length; ++k) {
                                children.push(res[k]);
                            }
                        } else {
                            children = children.concat(res);
                        }
                    }
                    console.log(children);
                    parents = children;
                    children = [];
                }
                return isId ? parents[0] : parents;
            }
        }
    };

    $.byId = function(id, target) {
        if ( typeof target === 'undefined') {
            target = document;
        }
        return target.getElementById(id);
    };

    $.byClass = function(className, target) {
        if ( typeof target === 'undefined') {
            target = window.document;
        }
        return target.getElementsByClassName(className);
    };

    $.byTag = function(tag, target) {
        if ( typeof target === 'undefined') {
            target = document;
        }
        return target.getElementsByTagName(tag);
    };

    $.bind = function(target, event, fn) {
        if (Array.isArray(target)) {
            for (var i = 0; i < target.length; ++i) {
                target[i].addEventListener(event, fn);
            }
        } else {
            console.log(target);
            target.addEventListener(event, fn);
        }
    }

    $.hide = function(target) {
        target.style.display = 'none';
    }

    $.show = function(target) {
        target.style.display = '';
    }

    $.platform = /android/i.test(navigator.userAgent) ? 'android' : (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ? 'ios' : '');

    $.invoke = function(method, params) {
        console.log(JSON.stringify(params));
        switch ($.platform) {
        case 'ios':
			//调用方法实现JS与原生IOS ObjectC交互数据
            window[method](JSON.stringify(params));//6.0
			break;
        case 'android':
            //调用方法实现JS与原生Android ObjectC交互数据
            var PROXY_OBJECT = 'android';
            window[PROXY_OBJECT][method](JSON.stringify(params));//6.0
            break;
        default:
            switch (method) {
            case 'alert':
                alert(params.message);
                break;
            default:
                console.log({
                    action : 'call',
                    method : method,
                    params : params,
                });
            }

        }
    }
    var globalName;
    $.setName = function(name) {
        if (globalName) {
            delete window[globalName];
        }
        window[name] = $;
        globalName = name;
    };
    $.setName('$');
    window[name] = $;
    //当另一个域进行AJAX请求；操作状况不同时作不同的响应
    $.jsonp = function(url, callback, error) {
        var callbackName;
        do {
            callbackName = 'jsonpCallback' + Math.floor(Math.random() * 0xffffff);
        } while(typeof window[callbackName] != 'undefined');
        window[callbackName] = callback;
        var script = document.createElement('script');
        script.onerror = error;
        script.src = url + "&callback=" + callbackName;
        document.head.appendChild(script);
    }
    
    //超时状况时的回调函数
    $.error=function() {
        var objErr = new Object();
        objErr.Msg = "操作异常";
        $.invoke("call", objErr);
    }

   
    
    $.param = function() {
        if (( json = location.href.match(/\?(.*)/))) {
            var params = JSON.parse(decodeURIComponent(json[1]));
            console.log(params);
            return params;
        }
        return {};
    };
})();


