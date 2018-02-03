~function () {
    //=>封装CSS工具方法
    var utils = (function () {
        var isCompatible = 'getElementsByClassName' in document;

        function getCss(curEle, attr) {
            var value = null, reg = null;
            if (isCompatible) {
                value = window.getComputedStyle(curEle, null)[attr];
            } else {
                if (attr === 'opacity') {
                    value = curEle.currentStyle['filter'];
                    reg = /^alpha\(opacity=(.+)\)$/i;
                    return reg.test(value) ? reg.exec(value)[1] / 100 : 1;
                }
                value = curEle.currentStyle[attr];
            }
            reg = /^-?\d+(.\d+)?(pt|px|rem|em)?$/i;
            return reg.test(value) ? parseFloat(value) : value;
        }

        function setCss(curEle, attr, value) {
            if (attr === 'opacity') {
                curEle.style.opacity = value;

                curEle.style.filter = 'alpha(opacity=' + value * 100 + ')';
                return;
            }
            !isNaN(value) && !/(fontWeight|lineHeight|zoom|zIndex)/i.test(attr) ? value += 'px' : null;
            curEle.style[attr] = value;
        }

        function setGroupCss(curEle, options) {
            if (Object.prototype.toString.call(options) !== '[object Object]') return;
            for (var attr in options) {
                if (options.hasOwnProperty(attr)) {
                    setCss(curEle, attr, options[attr])
                }
            }
        }

        function css() {
            var len = arguments.length,
                type = Object.prototype.toString.call(arguments[1]),
                fn = getCss;
            len >= 3 ? fn = setCss : (len === 2 && type === '[object Object]' ? fn = setGroupCss : null)
            return fn.apply(this, arguments);
        }

        return {
            css: css
        }
    })();

    //=>封装动画公式:匀速运动和非匀速运动
    //http://old.zhufengpeixun.cn/tween/
    var animationEffect = {
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        },
    };

    //=>实现动画
    function animate(options) {
        //=>init parameter
        var _default = {
            curEle: null,
            target: {},
            duration: 1000,
            effect: animationEffect.Linear,
            callBack: null
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }
        var curEle = _default.curEle,
            target = _default.target,
            duration = _default.duration,
            effect = _default.effect,
            callBack = _default.callBack;

        //=>prepare t/b/c/d
        var time = null,
            begin = {},
            change = {};
        for (var attr in target) {
            if (target.hasOwnProperty(attr)) {
                begin[attr] = utils.css(curEle, attr);
                change[attr] = target[attr] - begin[attr];
            }
        }

        //=>move
        clearInterval(curEle.animateTimer);
        curEle.animateTimer = setInterval(function () {
            time += 17;
            if (time >= duration) {
                utils.css(curEle, target);
                clearInterval(curEle.animateTimer);
                callBack && callBack.call(curEle);
                return;
            }
            var curPos = {};
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    curPos[key] = effect(time, begin[key], change[key], duration);
                }
            }
            utils.css(curEle, curPos);
        }, 17);
    }


    window.animate = animate;
    window.animateEffect = animationEffect;
}();
