(function($) {
    $.Animate = function(elem, cssObj, durtime,callback) {
        var defaults = {
            time: 1000,
            css: {},
            animType: 'Tween.Linear'
        };

        var options = $.extend(defaults, {});

        if(arguments.length > 1) {
            options.elem = elem;
            options.css = cssObj;
            options.time = durtime;
            options.complete = callback;
        } else {
            options = $.extend(defaults, arguments[0]);
        }
        //
        if(typeof options.elem === 'string'){
            this.elem = $(options.elem).element;
        }else{
            this.elem = options.elem;
        }
        
        this.animType = options.animType;
        this.onStop = options.stop;
        this.onStart = options.start;        
        this.onCompleted = options.complete;
        //
        this.options = options;
        //--
        //
        var cssKeys = [];
        for(var key in options.css) {
            cssKeys.push(key);
        }
        //预期值
        var forValue = this.toValue(options.css);
        //当前值
        var currentStyle = this.getStyle(this.elem, cssKeys);
        var currentValue = this.toValue(currentStyle);

        var currentKey,value,that = this,
            time = 0,
            fps = 60;//options.time / 60;
        /**
         * [calc description]
         * @param  {[type]} b [description]
         * @param  {[type]} c [description]
         * @return {[type]}   [description]
         */
        var calc = function(b, c) {
                if($.typeOf(b) === 'Array' && $.typeOf(c) === 'Array') {
                    var result = [];
                    for(var i = 0; i < b.length; i++) {
                        result.push(c[i] - b[i]);
                    }
                    return result;
                }
                return(c - b);
            };        
        //
        this.timer = $.timer(function(args) {            
            //code in here ..
            if(time < fps) {
                time++;
                for(var i = 0; i < cssKeys.length; i++) {
                    currentKey = cssKeys[i];
                    var forStyle = forValue[currentKey];
                    var cutStyle = currentValue[currentKey];
                    var stepStyle = calc(cutStyle, forStyle);
                    //color
                    if(ThinkAway.typeOf(stepStyle) === 'Array') {
                        value = '#';
                        for(var j=0;j<stepStyle.length;j++){
                            value += (that.hex(that.computerStyle(time, cutStyle[j], stepStyle[j], fps)));
                        }
                    } else {
                        value = that.computerStyle(time, cutStyle, stepStyle, fps);
                        value = (currentKey === 'opacity') ? (value / 100) : (value + 'px');
                    }                    
                    //set style ..
                    that.elem.style[currentKey] = value;

                    console.info(currentKey);
                }
            } else {
                that.timer.stop();
                //
                for(var key in options.css) {
                    that.elem.style[key] = options.css[key];
                }
                //debug
               that.onCompleted && that.onCompleted.apply(that.elem,[]);
            }
        }, options.time / fps);

        return this;
    };
    /**
     * [prototype description]
     * @type {Object}
     */
    $.Animate.prototype = {
        /**
         * [start description]
         * @return {[type]} [description]
         */
        start: function() {
            //start
            if(this.onStart){
                this.onStart.apply(this.elem,[]);
            }
            this.timer.start();


        },
        /**
         * [stop description]
         * @return {[type]} [description]
         */
        stop: function() {
            this.timer.stop();
            if(this.onStop){
                this.onStop.apply(this.elem,[]);
            }
        },
        /**
         * [getStyle description]
         * @param  {[type]} elem [description]
         * @param  {[type]} keys [description]
         * @return {[type]}      [description]
         */
        getStyle: function(elem, keys) {
            var result = {},
                key, value;
            for(var i = 0; i < keys.length; i++) {
                key = keys[i];
                value = $.DOM.style(elem, key);
                result[key] = value;
            }
            return result;
        },
        /**
         * [toValue description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        toValue: function(data) {
            var result = {},
                value;
            for(var key in data) {
                value = data[key];
                if(value === 'transparent') {
                    result[key] = [255, 255, 255];
                } else if(/^#|rgb/.test(value)) {
                    var color = new $.Color(value);
                    result[key] = color.toArray();
                    delete color;
                } else if(key === 'opacity') {
                    result[key] = (100 * value);
                } else if(value === 'auto') {
                    result[key] = 0;
                } else {
                    result[key] = parseInt(value);
                }
            }
            return result;
        },
        /**
         * [computerStyle description]
         * @param  {[type]} t [description]
         * @param  {[type]} b [description]
         * @param  {[type]} c [description]
         * @param  {[type]} d [description]
         * @return {[type]}   [description]
         */
        computerStyle: function(t, b, c, d) {
            //console.info(''+t+b+c+d);            
            try{
                var func = (eval(this.animType));
                return Math.ceil(func(t, b, c, d));
            }catch(e){
                $.error('animType not find :' + this.animType);
            }            
        },
        /**
         * [hex description]
         * @param  {[type]} i [description]
         * @return {[type]}   [description]
         */
        hex: function(i) { // 返回16进制颜色表示
            if(i < 0) return "00";
            else if(i > 255) return "ff";
            else {
                var str = "0" + i.toString(16);
                return str.substring(str.length - 2);
            }
        }
    };
    /**
     * [Tween t=次,b=开始值,c=步进量,d=持续时间]
     * @type {Object}
     */
    var Tween = {
        Linear: function(t, b, c, d) {
            return c * t / d + b;
        },
        Quad: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function(t, b, c, d) {
                if((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: {
            easeIn: function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function(t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: {
            easeIn: function(t, b, c, d) {
                return(t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function(t, b, c, d) {
                return(t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if(t == 0) return b;
                if(t == d) return b + c;
                if((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: {
            easeIn: function(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function(t, b, c, d) {
                if((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Elastic: {
            easeIn: function(t, b, c, d, a, p) {
                if(t == 0) return b;
                if((t /= d) == 1) return b + c;
                if(!p) p = d * .3;
                if(!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function(t, b, c, d, a, p) {
                if(t == 0) return b;
                if((t /= d) == 1) return b + c;
                if(!p) p = d * .3;
                if(!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return(a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function(t, b, c, d, a, p) {
                if(t == 0) return b;
                if((t /= d / 2) == 2) return b + c;
                if(!p) p = d * (.3 * 1.5);
                if(!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if(t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        },
        Back: {
            easeIn: function(t, b, c, d, s) {
                if(s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function(t, b, c, d, s) {
                if(s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function(t, b, c, d, s) {
                if(s == undefined) s = 1.70158;
                if((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Bounce: {
            easeIn: function(t, b, c, d) {
                return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function(t, b, c, d) {
                if((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if(t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if(t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function(t, b, c, d) {
                if(t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    };
    /**
     *
     */
    $.extend($.fn, {
        /**
         * [animate description]
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        animate: function() {
            var args = {};
            var func = $.overload({
                'Object':function(options){
                    options.elem = this.element;
                    return options;
                },
                'Object,Number':function(cssObj,durtime){
                    args.css = cssObj;
                    args.time = durtime;
                    args.elem = this.element;
                    return args;
                },
                'Object,Number,Function':function(cssObj,durtime,callback){
                    args.css = cssObj;
                    args.time = durtime;
                    args.complete = callback;
                    args.elem = this.element;                    
                    return args;
                },
                'Object,Number,String,Function':function(cssObj,durtime,animType,callback){
                    args.css = cssObj;
                    args.time = durtime;
                    args.complete = callback;
                    args.animType = animType;
                    args.elem = this.element;
                    return args;
                },
                'Object,Number,String,Object':function(cssObj,durtime,animType,callback){
                    args.css = cssObj;
                    args.time = durtime;                   
                    args.animType = animType;
                    args.elem = this.element;
                    args.stop = callback.stop;
                    args.start = callback.start;
                    args.complete = callback.complete;
                    return args;
                }
            });
            args = func.apply(this,arguments);
            var animate = new $.Animate(args);
            animate.start();
            return animate;
        }
    });

})(ThinkAway);