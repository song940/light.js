/**
 * [ ThinkAway JavaScript Library 1.0]
 * @copyright [Copyright 2012,Lsong]
 * @author [Lsong]
 * @mail   [dev@lsong.org]
 * @website[http://lsong.org]
 *
 * Thanks for your use it,enjoy it !
 *
 * @param  {[type]} window    [description]
 * @param  {[type]} ThinkAway [description]
 * @param  {[type]} undefined [description]
 * @return {[type]} ThinkAway [description]
 */
(function(window, ThinkAway , undefined) {
  "use strict";
  /**
   * backup old $ named lib .
   * @type {[type]}
   */
  window._$ = window.$;
  /**
   * [ThinkAway 工厂函数 , 用于通过选择器和上下文产生包装的对象]
   * @param {[type]} selector [选择器]
   * @param {[type]} context  [上下文]
   */
  ThinkAway = function(selector, context) {
    return new ThinkAway.prototype.init(selector,context);
  };
  /**
   * [version description]
   * @type {Array}
   */
  ThinkAway.version = [1, 0, 0, 1];

  /**
   * [extend 对象继承 , 使用 source 中的元素覆盖 destination ]
   * @param  {[type]} destination [description]
   * @param  {[type]} source      [description]
   * @return {[type]}
   */
  ThinkAway.extend = function(destination, source) {
    var newObj = {};
    for(var property in destination) {
      newObj[property] = destination[property];
    }
    for(var property in source) {
      destination[property] = newObj[property] = source[property];
    }
    return newObj;
  };

  /**
   * [overload 函数重载]
   * @param  {[type]} funcs [description]
   * @return {[type]}       [description]
   */
  ThinkAway.overload = function(funcs) {
    return function() {
      var args = [];
      for(var i = 0; i < arguments.length; i++) {
        args.push(ThinkAway.typeOf(arguments[i]));
      }
      var func = funcs[args.join(',')];
      if(!func) {
        //default function.
        func = funcs['Any'];
      }
      if(func) {
        return func.apply(this || funcs, arguments);
      } else {
        //not impl
        ThinkAway.error('function(' + args + ') not impl .');
      }
    };
  };

  /**
   * [typeOf 获取对象类型]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  ThinkAway.typeOf = function(obj) {
    var type = Object.prototype.toString.call(obj);
    var reg = /\[|object |\]/gm;
    return type.replace(reg, ''); // || (typeof obj);
  };

  /**
   * [timer 根据指定的时钟周期调用函数]
   * @param  {Function} callback [回调函数]
   * @param  {[type]}   t        [时钟周期]
   * @return {[type]}
   */
  ThinkAway.timer = function(callback, t) {
    var timer, i = 0;
    return {
      /**
       * [start 根据指定的参数启动时钟]
       * @param  {[type]} args [回调参数]
       * @return {[type]}
       */
      start: function(args) {
        timer = setInterval(function() {
          if(false === callback(args, i)) {
            clearInterval(timer);
          }
          i++;
        }, t);
      },
      /**
       * [stop 终止时钟回调]
       * @return {[type]}
       */
      stop: function() {
        clearInterval(timer);
      }
    }
  };

  /**
   * [realArray description]
   * @param  {[type]} c [description]
   * @return {[type]}   [description]
   */
  ThinkAway.toArray = function(obj) {
    var result = [];
    if(obj === undefined) {
      return result;
    }
    if('length' in obj) {
      for(var i = 0; i < obj.length; i++) {
        result.push(obj[i]);
      }
    } else {
      result.push(obj);
    }
    return result;
  };


  /**
   * [ description]
   * @return {[type]} [description]
   */
  ThinkAway.browser = new function() {
    //alert('in');
    this.userAgent = navigator.userAgent.toLowerCase();
    this.version = (this.userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1];
    this.opera = /opera/i.test(this.userAgent);
    this.webkit = /webkit/i.test(this.userAgent);
    this.firefox = /firefox/i.test(this.userAgent);
    this.mozilla = /mozilla/i.test(this.userAgent);
    this.ie = /msie/i.test(this.userAgent) && !this.opera;
    this.chrome = /chrome/i.test(this.userAgent) && this.webkit && this.mozilla;
    this.mozilla = this.mozilla && !/(compatible|webkit)/.test(this.userAgent) && !this.chrome;
    this.safari = this.webkit && !this.chrome;
    /**
     * [toString 显示浏览器名称 , 版本 ]
     * @return {[type]} [description]
     */
    this.toString = function() {
      var browser = ['ie', 'chrome', 'firefox', 'opera', 'safari'];
      for(var i = 0; i < browser.length; i++) {
        var key = browser[i];
        if(this[key] === true) {
          return key + ' ' + this.version;
        }
      }
    };

    return this;
  };

  /**
   * ThinkAway 工具函数扩展
   */
  ThinkAway.extend(ThinkAway, {
    /**
     * [each description]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    each: function(data, callback) {
      if(data === undefined) {
        return data;
      }
      if(ThinkAway.typeOf(data) == 'Object') {
        for(var key in data) {
          callback(data[key], key);
        }
      } else if('length' in data) {
        for(var i = 0; i < data.length; i++) {
          callback(data[i], i);
        }
      } else {
        callback(data);
      }
    },
    /**
     * [format 格式化字符串]
     * @param  {[type]} str  [字符串模板]
     * @param  {[type]} args [格式化参数]
     * @return {[type]}
     */
    format: function(str, args) {
      if(typeof args === 'string') {
        args = Array.prototype.slice.call(arguments, 1);
      }
      return str.replace(/{([^{}]+)}/gm, function(match, name) {
        return args[name];
      });
    },
    /**
     * [random 在指定的值之间产生随机数]
     * @param  {[type]} min [最小值]
     * @param  {[type]} max [最大值]
     * @return {[type]}
     */
    random: function(min, max) {
      var r = Math.random();
      if(min === undefined || max === undefined) {
        return r;
      }
      return Math.floor(r * (max - min) + min);
    },
    /**
     * [getDate 获取格式化时间日期]
     * @param  {[type]} format [description]
     * @return {[type]}        [description]
     */
    getDate: function(format) {
      var date = new Date();
      if(format === undefined) {
        return date;
      }
      var obj = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
      };
      if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for(var k in obj) {
        if(new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (obj[k]) : (("00" + obj[k]).substr(("" + obj[k]).length)));
        }
      }
      return format;
    },
    clone: function(obj) {
      var objClone;
      if(obj.constructor == Object) {
        objClone = new obj.constructor();
      } else {
        objClone = new obj.constructor(obj.valueOf());
      }
      for(var key in obj) {
        if(objClone[key] != obj[key]) {
          if(typeof(obj[key]) == 'object') {
            objClone[key] = ThinkAway.clone(obj[key]);
          } else {
            objClone[key] = obj[key];
          }
        }
      }
      objClone.toString = obj.toString;
      objClone.valueOf = obj.valueOf;
      return objClone;
    },
    /**
     * [cookie Cookie 操作函数 ]
     * @return {[type]} [description]
     */
    cookie: function() {
      var func = ThinkAway.overload({
        /**
         * [ 获取所有 Cookie ]
         * @return {[type]} [description]
         */
        'Any': function() {
          var data = {};
          var tmp = document.cookie.split('; ');
          for(var i = 0; i < tmp.length; i++) {
            var t = tmp[i].split('=');
            data[t[0]] = unescape(t[1]);
          }
          return data;
        },
        /**
         * [ 设置 Cookie ]
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        'Object': function(options) {
          for(var key in options) {
            var value = options[key];
            this['String,String'](key, value);
          }
          return document.cookie;
        },
        /**
         * [ 获取指定 Key 的值 ]
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
        'String': function(key) {
          return this['Any']()[key];
        },
        /**
         * [ 设置指定 Key 的值 ]
         * @param  {[type]} key   [description]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        'String,String': function(key, value) {
          return document.cookie = (key + '=' + escape(value));
        }

      });
      return func.apply(this, arguments);
    },
    /**
     * [parseXML 解析XML文档]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    parseXML: function(data) { // Cross-browser xml parsing
      if(typeof data !== "string" || !data) {
        return null;
      }
      var xml, tmp;
      try {
        if(window.DOMParser) { // Standard
          tmp = new DOMParser();
          xml = tmp.parseFromString(data, "text/xml");
        } else { // IE
          xml = new ActiveXObject("Microsoft.XMLDOM");
          xml.async = "false";
          xml.loadXML(data);
        }
      } catch(e) {
        xml = undefined;
      }
      if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
        ThinkAway.error("Invalid XML: " + data);
      }
      return xml;
    },
    /**
     * [eval 在空间内执行代码]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    exec: function(code,context) {
      var execCode = Function(code);
      if(context === undefined){
        // Evaluates a script in a context
        return(window.execScript || window["eval"])(code);
      }
      return execCode.call(context,code);
    },
    /**
     * [error 向浏览器抛出异常信息]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    error: function(msg) {
      var err = new Error(msg);
      throw err;
    },
    /**
     * [console 控制台输出]
     * @type {Object}
     */
    console: {
      /**
       * [log 在浏览器控制台中输出 log 日志]
       * @param  {[type]} msg [description]
       * @return {[type]}
       */
      log: function(msg) {
        window.console && console.log(msg);
      },
      /**
       * [info 在浏览器控制台中输出 info 日志]
       * @param  {[type]}  msg [description]
       * @return {[type]}
       */
      info: function(msg) {
        window.console && console.info(msg);
      },
      error: function(err) {
        ThinkAway.error(err);
      }
    },
    /**
     * [noConflict 出让 $ 使用权]
     * @param  {[type]} obj [其他要使用 $ 的对象]
     * @return {[type]}
     */
    noConflict: function(obj) {
      if(window.$ === ThinkAway) {
        window.$ = window._$;
      }
      if(obj) {
        window.$ = obj;
      }
    }
  });


  /**
   * [ThinkAway description]
   * @type {[type]}
   */
  window.ThinkAway = window.$ = ThinkAway;

})(window, ThinkAway = window.ThinkAway || {});

/**
 * [ ThinkAway DOM Engine 1.0]
 * @copyright [Copyright 2012,Lsong]
 * @author [Lsong]
 * @mail   [dev@lsong.org]
 * @website[http://lsong.org]
 *
 * Thanks for your use it,enjoy it !
 */
(function($, undefined) {


  /**
   * [DOM description]
   * @param {[type]} selector [description]
   * @param {[type]} context  [description]
   */
  $.DOM = function(selector, context) {
    return new $.DOM.prototype.init(selector, context);
  };
  /**
   * [id description]
   * @param  {[type]} id      [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  $.DOM.id = function(id, context) {
    var result = [];
    context = context || document;
    id = id.split(',');
    $.each(id, function(id) {
      var element = context.getElementById(id);
      if(element) {
        result.push(element);
      }
    });
    return result;
  };
  /**
   * [tag description]
   * @param  {[type]} tag     [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  $.DOM.tag = function(tag, context) {
    var result = [];
    context = context || document;
    tag = tag.split(',');
    $.each(tag, function(tag) {
      var elements = context.getElementsByTagName(tag);
      if(elements) {
        result = result.concat($.toArray(elements));
      }
    });
    return result;
  };
  /**
   * [name description]
   * @param  {[type]} name    [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  $.DOM.byName = function(name, context) {
    var result = [];
    context = context || document;
    name = name && name.split(',');
    $.each(name, function(name) {
      var elements = context.getElementsByName(name);
      if(elements) {
        result = result.concat($.toArray(elements));
      }
    });
    return result;
  };

  $.DOM.byClass = function(className, context) {
    var result = [];
    var tags = $.DOM.tag('*', context);
    $.each(tags, function(tag) {
      if($.DOM.hasClass(tag, className)) {
        result.push(tag);
      }
    });
    return result;
  };
  /**
   * [create description]
   * @param  {[type]} name    [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  $.DOM.create = function(tag, context) {
    var result = [];
    context = context || document;
    tag = tag && tag.split(',');
    $.each(tag, function(tag) {
      var elements = context.createElement(tag);
      if(elements) {
        result = result.concat($.toArray(elements));
      }
    });
    return result;
  };

  /**
   * @class util
   * @singleton
   */
  $.DOM.Util = {

    /**
     * 去首尾空格，包括全角
     * @method trim
     * @param  {String} 要去空格的字符串
     * @return {return} 返回去空白符的字符串
     */
    trim: function(s) {
      return s.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
    },

    /**
     * 替换函数，使方法：Uti.substitube('{$a}test', {a:'abc'})，返回abctest
     * @method substitute
     * @param  {String} tpl 替换模板
     * @param  {JSON}   json 数据
     * @return {return} 返回替换后的字符串
     */
    substitute: function(tpl, json) {
      return tpl.replace(/\{\$(\w+)\}/g, function(a, b) {
        return json[b]
      });
    },

    /**
     * 找出一个元素在集合中的索引
     * @method indexOf
     * @param  {Array Like} arr 集合数据
     * @param  {ANY}        item 要找的元素
     * @param  {Number}     from 从第几个索引开始查找
     * @return {Number} 返回元素所在索引，如找不到返回-1
     */
    indexOf: function(arr, item, from) {
      var len = arr.length;
      from = from | 0;
      if(from < 0) from += len;
      if(from < 0) from = 0;

      for(; from < len; from++) {
        if(from in arr && arr[from] === item) return from;
      }
      return -1;
    },

    /**
     * 求两个集合的并集
     * @method union
     * @param  {Array Like} a 集合a
     * @param  {Array Like} b 集合b
     * @return {Array Like} 返回并集
     */
    union: function(a, b) {
      return $.DOM.Util.uniquelize(a.concat(b));
    },

    /**
     * 找出一个元素是否存在于一个集合中
     * @method contains
     * @param  {Array Like} arr  集合数据
     * @param  {ANY}        item 要找的元素
     * @return {Number} 返回查找的布尔结果
     */
    contains: function(arr, item) {
      return $.DOM.Util.indexOf(arr, item) > -1;
    },

    /**
     * 集合去重
     * @method uniquelize
     * @param  {Array Like} arr  集合数据
     * @return {Array LIke} 去重后的结果
     */
    uniquelize: function(arr) {
      var result = [],
        contains = $.DOM.Util.contains;
      for(var i = 0, len = arr.length; i < len; i++) {
        if(!contains(result, arr[i])) {
          result.push(arr[i]);
        }
      }
      return result;
    },

    /**
     * 数组过滤，对集合每个元素都执行一次过滤函数，并返回过滤结果。
     * @method arrayFilter
     * @param  {Array Like} arr    集合数据
     * @param  {Function}   filter 过滤函数
     * @return {Array LIke} 过滤后的集合
     */
    arrayFilter: function(arr, filter) {
      var result = [],
        n = 0;
      for(var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        if(filter(item)) result[n++] = item;
      }
      return result;
    },

    /**
     * 将输入参数生成为数组，HTMLElements将生成数组。
     * @method makeArray
     * @param  {ANY}   arr    任意数据
     * @param  {Array} result 可返回数组的引用
     * @return {Array LIke} 返回数组
     */
    makeArray: (function() {
      var slice = Array.prototype.slice,
        push = Array.prototype.push;

      try {

        slice.call(document.documentElement.childNodes, 0)[0].nodeType;
        return function(arr, result) {
          result = result || [];
          if(arr.length) result = slice.call(arr, 0);
          else result.push(arr);
          return result;
        };

      } catch(ex) {

        return function(arr, result) {
          result = result || [];
          if(Object.prototype.toString.call(arr) == '[object Array]' || !arr.length) {
            push.call(result, arr);
          } else if(arr.length) {
            for(var i = 0, len = arr.length; i < len; i++) {
              result.push(arr[i]);
            }
          } else {
            throw new Error(['makeArray', 'unexpect arguments "' + arr + '"']);
          }
          return result;
        }

      };
    })()
  };

  /**
   * 查找时间戳
   * @property
   * @default {NULL}
   */
  $.DOM.timestamp = null;


  /** 
   * 通用抛异常函数
   * @method exception
   * @static
   * @param  {String} expr 要抛出的异常字符串
   * @return {Error}  返回一个Error对象
   */
  $.DOM.exception = function(expr) {
    throw new Error(['selector', 'unexpect expressions ["' + expr + '"]']);
  };

  $.DOM.customHandle = function(expr) {
    //<div>
    if(/^</.test(expr)) {
      return $.DOM.create(expr.replace(/<|>/g, ''));
    }

  };


  /** 
   * 跨浏览器兼容的contains函数，即一个元素是否是包含另一个节点。
   * @method contains
   * @static
   * @param  {HTMLElement} a 祖先节点
   * @param  {HTMLElement} b 子孙节点
   * @return {Boolean}     返回布尔值。
   */
  $.DOM.contains = document.compareDocumentPosition ?
  function(a, b) {
    return !!(a.compareDocumentPosition(b) & 16);
  } : function(a, b) {
    return a !== b && (a.contains ? a.contains(b) : true);
  };


  /** 
   * 跨浏览器兼容的children函数，返回一个元素下的所有子节点
   * @method children
   * @static
   * @param  {HTMLElement} el 祖先节点
   * @return {Boolean}     返回所有子节点。
   */
  $.DOM.children = document.documentElement.children ?
  function(el) {
    return el.children;
  } : function(el) {
    return $.DOM.Util.arrayFilter(el.children, function(el) {
      return !!el.tagName;
    });
  };


  /** 
   * 得到一个树集合中第一层级的节点
   * @method getFirstLevelNodes
   * @static
   * @param  {HTMLElements|Array} 树集合节点
   * @return {Array}  返回第一层的节点集合数组
   */
  $.DOM.getFirstLevelNodes = function(nodes) {
    for(var i = 1; i < nodes.length; i++) {
      if($.DOM.contains(nodes[i - 1], nodes[i])) {
        //除重，复杂度O(N)。
        //如果dom里前者包含后者，则移者后者
        //当前循环标记-1
        //结果将是
        //第一轮：[1,3,4,5,6], i=1
        //第二轮：[1,4,5,6] i=1
        //第三轮：[1,5,6] i=1
        //第四轮：[1,6] i=1
        //第五轮：[1] i=1
        nodes.splice(i, 1);
        i--;
      }
    }
    return nodes;
  };


  /**
   * 创建nth索引，方便nth查找
   * @method buildIndex
   * @static
   * @param  {HTMLElement} el 要创建节点的索引
   * @return {void}
   */
  $.DOM.buildIndex = function(el) {

    var parentEl = el.parentNode,
      childs = parentEl.childNodes,
      index = 1;

    for(var i = 0, len = childs.length; i < len; i++) {
      if(childs[i].tagName) childs[i]._index = index++;
    }

    parentEl._length = index;
    parentEl._timestamp = $.DOM.timestamp;
  };

  /**
   * 找到当前节点的索引值。
   * @method position
   * @static
   * @param  {HTMLElement} 要创建节点的索引
   * @param  {Boolean
   * @return {Number}
   * @remark nth-child(N): matches elements on the basis of their positions within a parent element's list of child elements.
   */
  $.DOM.position = function(el, reverse) {
    var p = el.parentNode;
    if(p.timestamp != $.DOM.timestamp) $.DOM.buildIndex(el);
    if(reverse) return p._length - el._index + 1; //nth-last-child的反转查法
    else return el._index; //顺序nth返回当前索引
  };


  /** 
   * 程序入口点，即浏览器里的document.querySelectorAll函数
   * @method query
   * @static
   * @param  {String} selector 选择器字符串
   * @param  {HTMLElement|HTMLElements|Array} context  上下文的节点或节点集合
   * @return {Array}  返回根据selector查找出来的结果集数组
   */
  $.DOM.find = function(selector, context) {

    /**
     * [selectors 存储解析好的数据]
     * @type {Array}
     */
    var selectors = [],
      /**
       * [result 返回结果]
       * @type {Array}
       */
      result = [],
      /**
       * [regExp 解析规则
       * (关系符{1}(标签元素{1})((?:属性选择符)*)(:伪类)?)+]
       * @type {RegExp}
       */
      regExp = /(^|\s*[>+~ ]\s*)(([\w\-\:.#*]+|\([^\)]*\)|\[[^\]]*\])+)(?=($|\s*[>+~ ]\s*))/g,

      /**
       * [tagName 关系符为空，默认tagName为*]
       * @type {String}
       */
      tagName = '*',

      /**
       * [last_relation 最后一个关系符]
       * @type {[type]}
       */
      last_relation = null,

      /**
       * [trim trim引用]
       * @type {[type]}
       */
      trim = $.DOM.Util.trim,

      /**
       * [makeArray makeArray引用]
       * @type {[type]}
       */
      makeArray = $.DOM.Util.makeArray;


    /**
     * [context  如果context参数为空，则默认从document根元素开始查找]
     * @type {[type]}
     */
    context = context || document.documentElement;

    /**
     * [timestamp 最后查询时间戳]
     * @type {Date}
     */
    $.DOM.timestamp = +new Date;

    /**
     * [ 解析输入的selector，处理成格式化好处理的形式，形如：
     * [[relation, tagname+attribute+pseudo]]]
     */
    selector = selector.replace(regExp, function(all, relation, tagName, attribute, pseudo) {
      selectors.push([relation, tagName]);
      return ''; //将输入参数进行替代，最后不为空，则输入的selector不合法。
    });
    //如果遇到不能解析的selector给出异常
    if(selector != '') {
      var customHandleResult = ($.DOM.customHandle(selector));
      if(customHandleResult) {
        return customHandleResult;
      } else {
        $.DOM.exception(selector);
      }
    }
    /**
     * result 转成数组
     * 可以调用$.DOM.makeArray方法]
     * @type {[type]}
     */
    result = makeArray(context);

    /**
     * 主要的parser程序
     * 从前往后查找，暂不作优化。
     * 如遇到div div.a的情况就需要除重处理，因为第一次解析成
     * document.documentElement div处理时已经包括了div.a
     */
    for(var i = 0, sl = selectors.length; i < sl; i++) {

      var part = selectors[i];
      var relation = trim(part[0]) || ' '; //取出的关系
      var attri = trim(part[1]); //取出的属性。
      var tmpNodes = []; //临时存储节点数组
      //如果关系符为祖先（包含关系符）时，取出tagName，而后的$.DOM.Expr则用element.getElementsByTagName(tagName)来找节点集合。
      if(relation == ' ') attri = attri.replace(/^[\w-]+/, function(t) {
        tagName = t;
        return ''
      });

      if(relation == ' ' && last_relation == ' ') {
        //前一个的关系为祖先（包含选择符），当前的关系选择符也为祖先时，则用快速去重法；
        //得到第一层节点集合。
        result = $.DOM.getFirstLevelNodes(result);
      }

      var relationHandle = $.DOM.Expr.relations[relation];
      var filterHandle = $.DOM.Expr.parseToFilter(attri);

      //兄弟节点除重
      if(relation == '~') {

        for(var j = 0, len = result.length; j < len; j++) {
          var queryResult = relationHandle(result[j], filterHandle, tagName);
          tmpNodes = $.DOM.Util.union(tmpNodes, queryResult);
        }

      } else {

        for(var j = 0, len = result.length; j < len; j++) {
          var queryResult = relationHandle(result[j], filterHandle, tagName);
          tmpNodes = tmpNodes.concat(queryResult);
        }

      }

      //存储到结果集
      result = tmpNodes;

      //记录最后一次关系符。
      last_relation = relation;
    };

    return result;
  };



  /**
   * selector 表达式
   * @class $.DOM.Expr
   * @singleton
   */
  $.DOM.Expr = $.DOM.selectors = {

    /** 
     * 伪类配置过滤函数
     * 由前向后找的过滤总是以前一个节点为基础上进行过滤的。
     * 如果由后往前找的过滤，则刚好相反
     * @perperty pseudos
     * @static
     */
    pseudos: {

      "first-child": function(el) {
        return el.parentNode.getElementsByTagName("*")[0] == el;
      },
      "last-child": function(el) {
        return !(el = el.nextSibling) || !el.tagName && !el.nextSibling;
      },
      "only-child": function(el) {
        return $.DOM.children(el.parentNode).length == 1;
      },
      "nth-child": function(el, nth) {
        //element position
        var pos = $.DOM.position(el, false); //要把转化position这步closure起来以提高效率。
        return $.DOM.Expr.nthFilter(nth, pos);
      },
      "nth-last-child": function(el, nth) {
        //element position
        var pos = $.DOM.position(el, true);
        return $.DOM.Expr.nthFilter(nth, pos);
      },
      "nth-of-type": function(el, nth) {
        var i = 1;
        while(el = el.previousSibling) {
          if(el.tagName == el.tagName) i++;
        }
        return $.DOM.Expr.nthFilter(nth, i);
      },
      "nth-last-of-type": function(el, nth) {
        var i = 1;
        while(el = el.nextSibling) {
          if(el.tagName == el.tagName) i++;
        }
        return $.DOM.Expr.nthFilter(nth, i);
      },
      "first-of-type": function(el) {
        var tag = el.tagName;
        while(el = el.previousSlibling) {
          if(el.tagName == tag) return false;
        }
        return true;
      },
      "last-of-type": function(el) {
        var tag = el.tagName;
        while(el = el.nextSibling) {
          if(el.tagName == tag) return false;
        }
        return true;
      },
      "only-of-type": function(el) {
        var els = el.parentNode.childNodes;
        for(var i = els.length - 1; i > -1; i--) {
          if(els[i].tagName == el.tagName && els[i] != el) return false;
        }
        return true;
      },
      "empty": function(el) {
        return !el.firstChild;
      },
      "parent": function(el) {
        return !!el.firstChild;
      },
      "not": function(el, selector) {
        return !$.DOM.Expr.parseToFilter(selector)(el);
        //return !filter(el); 
      },
      "enabled": function(el) {
        return !el.disabled && el.type !== "hidden";
      },
      "disabled": function(el) {
        return el.disabled;
      },
      "checked": function(el) {
        return el.checked;
      },
      "contains": function(el, txt) {
        return(el.textContent || el.innerText || "").indexOf(txt) >= 0;
      },
      'eq': function(el, arg) {
        return el.childNodes && el.childNodes[arg];
      }
    },
    /**
     * [operators 表达式配置字符串方法，其中{$handle}表示获
     * 取attribute的方法，{$value}表示值]
     * @type {Object}
     */
    operators: {
      '': '{$handle}',
      //isTrue|hasValue
      '=': '{$handle}=="{$value}"',
      //equal
      '!=': '{$handle}!="{$value}"',
      //unequal
      '~=': '{$handle}&&(" "+{$handle}+" ").indexOf(" {$value} ")>-1',
      //onePart
      '|=': '{$handle}&&({$handle}+"-").indexOf("{$value}-")==0',
      //firstPart
      '^=': '{$handle}&&{$handle}.indexOf("{$value}")==0',
      // beginWith
      '$=': '{$handle}&&{$handle}.lastIndexOf("{$value}")=={$handle}.length-"{$value}".length',
      // endWith
      '*=': '{$handle}&&{$handle}.indexOf("{$value}")>-1' //contains
    },
    /** 
     * 关系selector配置查找函数
     * @perperty relations
     * @static
     */
    relations: {

      //contains
      " ": function(el, filter, tagName) {
        var result = el.getElementsByTagName(tagName || "*");
        return $.DOM.Util.arrayFilter(result, filter);
      },

      //children
      ">": function(el, filter) {
        var nodes = el.childNodes,
          result = [];
        for(var i = 0, len = nodes.length; i < len; i++) {
          var node = nodes[i];
          if(("tagName" in node) && filter(node)) result.push(node);
        }
        return result;
      },

      //nextSibling
      "+": function(el, filter) {
        while(el = el.nextSibling) {
          if("tagName" in el) {
            if(filter(el)) return [el];
            else return [];
          }
        }
        return [];
      },

      //nextSiblings
      "~": function(el, filter) {
        var arr = [];
        while(el = el.nextSibling) {
          if(el.tagName && filter(el)) arr.push(el);
        }
        return arr;
      }
    },
    /** 
     * 快捷选择符配置替换函数
     * @perperty shortcuts
     * @static
     */
    shortcuts: [
      [/\#([\w\-]+)/g, '[id="$1"]'], //id缩略写法
      [/^([\w\-]+)/g, function(a, b) {
        return '[tagName="' + b.toUpperCase() + '"]';
      }], //tagName缩略写法
      [/\.([\w\-]+)/g, '[className~="$1"]'], //className缩略写法
      [/^\*/g, '[tagName]'] //任意tagName缩略写法
      ],

    /** 
     * 快捷选择符解析函数，将快捷选符符解析成普通选择符
     * @method parseShortcuts
     * @param  {String} selector 选择符的字符串
     * @static
     * @return {String} 替换完成的普通选择字符串
     */
    parseShortcuts: function(selector) {
      var sc = $.DOM.Expr.shortcuts;
      for(var i = 0, len = sc.length; i < len; i++) {
        selector = selector.replace(sc[i][0], sc[i][1]);
      }
      return selector;
    },
    /** 
     * 比较nth值与当前position，通过则为true，否则为false
     * @method nthFilter
     * @param  {String} nthValue 选择符的字符串
     * @param  {Number} pos      HTMLElement在父元素下的索引值
     * @static
     * @return {Function} 返回nth的数字值
     */
    nthFilter: function(nthValue, pos) {

      if(nthValue == "even") nthValue = '2n';
      if(nthValue == "odd") nthValue = '2n+1';

      var nthValue = nthValue.replace(/(^|\D+)n/g, "$11n");

      if(!(/n/.test(nthValue))) {
        //没有N乘数
        return pos == nthValue;
      } else {
        //a * n + b = pos;
        //(pos - b) % n = 0
        var arr = nthValue.split("n");
        var a = arr[0] | 0,
          b = arr[1] | 0;
        var d = pos - b;
        return d >= 0 && d % a == 0;
      }

    },
    /**
     * 将一个格式化好的attribute selector数组解析成过滤函数
     * @method parseAttributesToFilter
     * @static
     * @param  {Array}    一个格式化好的attribute selector数组
     * @return {Function} 返回一个filter的过滤函数。
     * @remark 接口：属性的格式是[[名,运算符,值]] 的二维数组；
     */
    parseAttributesToFilter: function(attris) {

      if(attris.length == 0) return null; //如果没有属性选择符
      var attriFunc = [];

      for(var i = 0, attr; attr = attris[i]; i++) {
        //属性过滤
        //得到attribute函数
        var sAttri = $.DOM.Expr.getAttriHandle(attr[0]);
        var operator = attr[1];
        var value = attr[2];

        attriFunc.push($.DOM.Util.substitute($.DOM.Expr.operators[operator], {
          handle: sAttri,
          value: value
        }));

      }

      attriFunc = 'return ' + attriFunc.join("&&");
      //一个短路条件写法，提高效率；据说jquery实际上也是通过这样的方法提高效率；
      return new Function("el", attriFunc);
    },
    /**
     * 将一个格式化好的pseudos selector数组解析成过滤函数
     * @method parsePseudosToFilter
     * @static
     * @param  {Array}    一个格式化好的pseudos selector数组
     * @return {Function} 返回一个filter的过滤函数。
     * @remark 接口：伪类的格式是[[名,值]] 的二维数组；
     */
    parsePseudosToFilter: function(pseudos) {

      var filters = [];

      for(var i = 0, p; p = pseudos[i]; i++) {
        //伪类过滤
        var name = p[0],
          value = p[1];
        var pseHandle = $.DOM.Expr.pseudos[name];
        if(!pseHandle) $.DOM.exception(name); //找不到伪类hash里面的函数则抛异常
        /*if(name.indexOf('nth') == 0 || name == "not" || name == 'contains' || name == 'eq') {
                    //后期需要优化
                    filters.push(function(el) {
                        return pseHandle(el, value);
                    });

                } else filters.push(pseHandle);
                */
        filters.push(function(el) {
          return pseHandle(el, value);
        });

      }
      return filters;
    },
    /** 
     * 解析selector成过滤函数
     * @method parseToFilter
     * @static
     * @param  {String}   selector 需要处理的selector字符串，包括属性选择器和伪类选择器
     * @return {Function} 返回一个filter的过滤函数，该函数的参数是一个HTMLElement。
     */
    parseToFilter: function(selector) {

      /**
       * 伪类的格式是[[名,值]] 的二维数组；
       * 属性的格式是[[名,运算符,值]] 的二维数组；
       * @type {Array}
       */
      var attris = [],
        pseudos = [];

      var pseudoReg = /\:([\w\-]+)(\(([^)]+)\))?/g,
        attriReg = /\[\s*([\w\-]+)\s*([!~|^$*]?\=)?\s*(?:(["']?)([^\]'"]*)\3)?\s*\]/g;

      //生成的函数队列
      var filterFuncs = [],
        attriFuncs = [],
        pseudoFuncs = [];

      //标准快捷方式转换
      selector = $.DOM.Expr.parseShortcuts(selector);

      //伪类存储[name,value]
      selector = selector.replace(pseudoReg, function(a, b, c, d, e) {
        pseudos.push([b, d]);
        return "";
      });

      //属性存储[name,operator,value]
      selector = selector.replace(attriReg, function(a, b, c, d, e) {
        attris.push([b, c || "", e || ""]);
        return "";
      });

      if(selector != '') $.DOM.exception(selector);

      //解析attributes
      attriFuncs = $.DOM.Expr.parseAttributesToFilter(attris);
      attriFuncs && filterFuncs.push(attriFuncs);
      //解析pseudos
      pseudoFuncs = $.DOM.Expr.parsePseudosToFilter(pseudos);
      if(pseudoFuncs.length) filterFuncs = filterFuncs.concat(pseudoFuncs);

      //只是为了不循环，采用加速，去除也可。
      switch(filterFuncs.length) {
      case 0:
        return function(el) {
          return true;
        };
      case 1:
        return filterFuncs[0];
      case 2:
        return function(el) {
          return filterFuncs[0](el) && filterFuncs[1](el);
        };
      }

      //循环返回过滤结果
      return function(el) {

        for(var i = 0; i < funcLength; i++) {
          if(!filterFuncs[i](el)) return false;
        }

        return true;
      };
    },
    /** 
     * 通过一个attribute来判断是用内置还是getAttribute方法来获得相应的属性值。
     * @method getAttriHandle
     * @param  {String} attri attribute名称
     * @static
     * @return {String} 查找相应的attribute的方式，以字符串方式返回。
     */
    getAttriHandle: (function() { /* 是否使用内置.attribute形式来获取属性 */

      //内置attribute相关属性转换
      var attriMap = {
        'class': 'el.className',
        'for': 'el.htmlFor',
        'href': 'el.getAttribute("href", 2)'
      };

      //优先.attribute属性获取
      var nativeAttris = 'name,id,className,value,selected,checked,disabled,type,tagName,readOnly'.split(',');

      //内置属性获取
      for(var i = 0, len = nativeAttris.length; i < len; i++) {
        attriMap[nativeAttris[i]] = 'el.' + nativeAttris[i];
      }

      return function(attri) {
        return attriMap[attri] || 'el.getAttribute("' + attri + '")';
      };
    })()

  };
  /**
   * [addEvent description]
   * @param {[type]} element [description]
   * @param {[type]} event   [description]
   * @param {[type]} func    [description]
   */
  $.DOM.addEvent = function(element, event, func, useCapture) {
    if(element.addEventListener) {
      element.addEventListener(event, func, useCapture || false);
    } else if(element.attachEvent) {
      element.attachEvent("on" + event, func);
    } else {
      element["on" + event] = func;
    }
  };
  /**
   * [removeEvent description]
   * @return {[type]} [description]
   */
  $.DOM.removeEvent = function(element, event, func, useCapture) {
    if(element.removeEventListener) {
      element.removeEventListener(event, func, useCapture || false);
    } else if(element.detachEvent) {
      element.detachEvent("on" + event, func);
    } else {
      element["on" + event] = null;
    }
  };
  /**
   * [attr 获取或设置元素的属性]
   * @param  {[type]} element [元素]
   * @param  {[type]} key     [属性键]
   * @param  {[type]} value   [属性值]
   * @return {[type]}         [description]
   */
  $.DOM.attr = function(element, key, value) {
    var support = {
      'value': 0,
      'innerHTML': 0,
      'innerText': 0,
      'className': 0,
      'textContent': 0
    };
    //get or set
    if(value === undefined) {
      //get value
      if(element[key]) {
        return element[key];
      }
      return element.getAttribute(key);
    } else {
      if(true === (key in support)) {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    }
  };

  /**
   * [style 获取或设置元素的样式]
   * @param  {[type]} element [元素]
   * @param  {[type]} key     [样式名]
   * @param  {[type]} value   [样式值]
   * @return {[type]}         [description]
   */
  $.DOM.style = function(element, key, value) {
    if(value === undefined) {
      //w3style
      if(document.defaultView && document.defaultView.getComputedStyle) {
        var style = document.defaultView.getComputedStyle(element, null);
        if(key in style) {
          return style[key];
        } else {
          return style.getPropertyValue(key);
        }
      } else if(element.currentStyle) { //ie
        return element.currentStyle[key];
      } else if(key in element.style) {
        return element.style[key];
      }
    } else if(element.style) {
      element.style[key] = value;
    }
  };

  /**
   * [hasClass description]
   * @param  {[type]}  className [description]
   * @return {Boolean}           [description]
   */
  $.DOM.hasClass = function(element, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    return !!element.className.match(reg);
  };
  /**
   * [addClass description]
   * @param {[type]} className [description]
   */
  $.DOM.addClass = function(element, className) {
    if(!$.DOM.hasClass(element, className)) {
      element.className += ' ' + className;
    }
  };
  /**
   * [removeClass description]
   * @param  {[type]} className [description]
   * @return {[type]}           [description]
   */
  $.DOM.removeClass = function(element, className) {
    if($.DOM.hasClass(element, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      element.className = element.className.replace(reg, '');
    }
  };
  /**
   * [toggleClass description]
   * @param  {[type]} className [descrip tion]
   * @return {[type]}           [description]
   */
  $.DOM.toggleClass = function(element, className) {
    if($.DOM.hasClass(element, className)) {
      $.DOM.removeClass(element, className);
    } else {
      $.DOM.addClass(element, className);
    }
  };
  /**
   * [ JavaScript DOM Ready ]
   * @param  {[type]} $ [description]
   * @return {[type]}   [description]
   * @namespace [ThinkAway.Ready]
   * @document [http://blog.lsong.org/2012/10/dom-ready-in-javascript/]
   * @author [Lsong]
   * @copyright [http://lsong.org]
   */

  $.DOM.ready = function(callback, options) {
    var that = this;
    var isReady = false;
    var defaults = {
      //'DOMContentLoaded' event in 'firefox 2.x' has a bug ..
      enableMozDOMReady: true
    };

    options = $.extend(defaults, options);
    //发布 ready 事件
    var onReady = function() {
        if(isReady) return;
        isReady = !isReady;
        callback.apply(that.element, [$]);
      };
    if($.browser.ie) {
      (function() {
        if(isReady) return;
        try {
          document.documentElement.doScroll("left");
        } catch(error) {
          setTimeout(arguments.callee, 0);
          return;
        }
        onReady();
      })();
    } else if($.browser.webkit && $.browser.version > 525) {
      //webkit browser with version > 525 can be used 'readyState' attribute .
      (function() {
        if(isReady) return;
        if(/loaded|complete/.test(document.readyState)) {
          onReady();
        } else {
          setTimeout(arguments.callee, 0);
        }
      })();
    } else if(!($.browser.firefox && $.browser.version == 2) || options.enableMozDOMReady) {
      $(document).on('DOMContentLoaded', function() {
        $(this).un('DOMContentLoaded', arguments.callee);
        onReady();
      });
    }
    //保险起见 , 还是绑定了 load 事件, 防止丢失事件
    $(window).on('load', function() {
      $(this).un('load', arguments.callee);
      onReady();
    });
  };

  /**
   * [createMask 创建页面遮罩]
   * @param  {[type]} options [description]
   * @return {[type]}
   */
  $.DOM.createMask = function(options) {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var defaults = {
      'x': '0px',
      'y': '0px',
      'width': width + 'px',
      'height': height + 'px',
      'color': "rgba(0, 0, 0, 0.5)"
    };
    options = $.extend(defaults, options);

    var mask = $('<div>')
      .css('zIndex', '100')
      .css('position', 'fixed')
      .css('overflow', 'hidden')
      .css('top', options.y)
      .css('left', options.x)
      .css('width', options.width)
      .css('height', options.height)
      .css('background-color', options.color);

    window.onresize =  function(){
      console.info(document.documentElement.clientWidth);
      mask.css({
        width :document.documentElement.clientWidth+'px',
        height:document.documentElement.clientHeight+'px'
      });
    };

    $(document.body).append(mask);
    
    return {
      /**
       * [show 在页面中显示遮罩]
       * @return {[type]}
       */
      show: function() {
        mask.show();
      },
      /**
       * [close 关闭在页面中显示的遮罩]
       * @return {[type]}
       */
      close: function() {
        mask.remove();
      },
      /**
       * [append 添加视图到遮罩]
       * @param  {[type]} view [description]
       * @return {[type]}
       */
      append: function(view) {
        view.css('zIndex', '101');
        mask.append(view);
      }
    }
  };

  /**
   * [fn ThinkAway 内核函数]
   * @type {Function}
   */
  $.DOM.prototype = {
    /**
     * [init 根据选择器和元素包装 ThinkAway 对象]
     * @param  {[type]} selector [选择器]
     * @param  {[type]} element  [元素]
     * @return {[type]}
     */
    init: function(selector, context) {
      this.selector = selector;
      switch(typeof selector) {
      case 'string':
        this.obj = $.DOM.find.apply(this, arguments);
        break;
      case 'object':
        if('length' in selector) {
          this.obj = [];
          for(var i = 0; i < selector.length; i++) {
            this.obj[i] = selector[i];
          }
        } else {
          this.obj = [selector];
        }
        break;
      case 'function':
        this.obj = [document];
        $.DOM.ready(selector);
        break;
      default:
        this.obj = [document];
        break;
      }
      //            
      this.length = this.obj.length;

      //copy to this;
      for(var i = 0; i < this.length; i++) {
        this[i] = this.obj[i];
      }
      //set first element to element ..
      for(var i = 0; i < this.length; i++) {
        if(this[i] instanceof Element) {
          this.element = this[i];
        }
      }
      return this;
    },
    /**
     * [find 在当前元素中查找]
     * @param  {[type]} selector [选择器]
     * @return {[type]}
     */
    find: function(selector) {
      return $.DOM.find(selector, this.element);
    },
    /**
     * [each 迭代回调集合元素]
     * @param  {Function} callback [回调函数]
     * @return {[type]}
     */
    each: function(callback) {
      var result = [];

      for(var i = 0; i < this.length; i++) {
        var ret = callback(this.obj[i], i);
        if(ret === undefined) {
          //
        } else if(ret === true) {
          result.push(this.obj[i]);
        } else if(ret === false) {
          return this;
        }
      }
      //filter
      if(result.length) return result;
      //
      return this;
    },
    /**
     * [attr 设置或获取当前元素的属性]
     * @param  {[type]} key   [属性名称]
     * @param  {[type]} value [属性值]
     * @return {[type]}
     */
    attr: function(key, value) {
      var that = this;
      var func = ThinkAway.overload({
        'Object': function(obj) {
          this.each(function(element, i) {
            for(var key in obj) {
              var value = obj[key];
              $.DOM.attr(element, key, value);
            }
          });
          return this;
        },
        'String': function(key) {
          return $.DOM.attr(this.element, key);
        },
        'String,String': function(key, value) {
          this.each(function(element, i) {
            $.DOM.attr(element, key, value);
          });
          return this;
        },
        //兼容非预期值
        'Any': function(key, value) {
          if(value === undefined) {
            return $.DOM.attr(this.element, key);
          } else {
            this.each(function(element, i) {
              $.DOM.attr(element, key, value);
            });
          }
          return this;
        }
      });
      return func.apply(this, arguments);
    },
    /**
     * [css 设置或获取当前元素的 CSS 样式]
     * @param  {[type]} key   [CSS 样式名称]
     * @param  {[type]} value [CSS 样式值]
     * @return {[type]}
     */
    css: function(key, value) {
      var func = ThinkAway.overload({
        'Object': function(obj) {
          this.each(function(element, i) {
            for(var key in obj) {
              var value = obj[key];
              $.DOM.style(element, key, value);
            }
          });
          return this;
        },
        'String': function(key) {
          if(document.defaultView) {
            //修正浏览器样式解析(BETA,TEST)
            key = key.replace('borderWidth', 'borderLeftWidth');
          }
          var value = $.DOM.style(this.element, key);
          //修正 auto 值(BETA,TEST)
          value = value.replace('auto', '0px');
          return value;
        },
        'String,String': function(key, value) {
          this.each(function(element) {
            $.DOM.style(element, key, value);
          });
          return this;
        },
        //兼容非预期值
        'Any': function(key, value) {
          this.each(function(element, i) {
            $.DOM.style(element, key, value);
          });
          return this;
        }
      });
      return func.apply(this, arguments);
    },
    /**
     * [on 绑定事件]
     * @param  {[type]} event      [事件名称]
     * @param  {[type]} func       [事件函数]
     * @param  {[type]} useCapture [description]
     * @return {[type]}
     */
    on: function(event, func, useCapture) {
      this.each(function(elem) {
        $.DOM.addEvent(elem, event, func, useCapture);
      });
      return this;
    },
    /**
     * [un 解除事件绑定]
     * @param  {[type]} event      [事件名称]
     * @param  {[type]} func       [事件函数]
     * @param  {[type]} useCapture [description]
     * @return {[type]}
     */
    un: function(event, func, useCapture) {
      this.each(function(elem) {
        $.DOM.removeEvent(elem, event, func, useCapture);
      });
      return this;
    },
    /**
     * [append 将指定元素追加到当前元素]
     * @param  {[type]} element [元素]
     * @return {[type]}
     */
    append: function(element) {
      if(element instanceof ThinkAway) {
        element = element.element;
      }
      this.each(function(item) {
        item.appendChild(element);
      });
      return this;
    },
    /**
     * [get description]
     * @param  {[type]} index [description]
     * @return {[type]}
     */
    get: function(index) {
      var result;
      if(index >= 0) {
        result = this[index];
      } else {
        result = this[this.length + index];
      }
      return result;
    },
    /**
     * [ready description]
     * @param  {[type]} func [description]
     * @return {[type]}      [description]
     */
    ready: function(func) {
      return $.DOM.ready(func);
    },
    /**
     * [text 获取或设置当前元素内的文本内容]
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
    text: function(text) {
      //firefox hav't 'innerText' attribute .
      if(this.element.innerText) {
        return this.attr('innerText', text);
      } else {
        //set , has 'textContent' , use it .
        if(!(text === undefined && text == this.element.textContent)) {
          return this.attr('textContent', text);
        } else {
          //get , use innerHTML , ...
          var html = this.attr('innerHTML');
          return html.replace(/<.+?>/gim, '');
        }
      }
    },
    /**
     * [clone 对象克隆 , 对象拷贝]
     * @return {[type]}
     */
    clone: function() {
      return ThinkAway.clone(this.element);
    },
    /**
     * [contains 检查元素中是否存在某项]
     * @param  {[type]} value [description]
     * @return {[type]}
     */
    contains: function(value) {
      this.each(function(item, i) {
        if(item == value) return true;
      });
      return false;
    },
    /**
     * [remove 移除当前元素]
     * @return {[type]} [description]
     */
    remove: function() {
      return this.each(function(self) {
        var parent = self.parentNode;
        parent.removeChild(self);
      });
    },
    /**
     * [hasClass description]
     * @param  {[type]}  className [description]
     * @return {Boolean}           [description]
     */
    hasClass: function(className) {
      $.DOM.hasClass(this.element, className);
    },
    /**
     * [addClass description]
     * @param {[type]} className [description]
     */
    addClass: function(className) {
      this.each(function(element) {
        $.DOM.addClass(element, className);
      });
    },
    /**
     * [removeClass description]
     * @param  {[type]} className [description]
     * @return {[type]}           [description]
     */
    removeClass: function(className) {
      this.each(function(element) {
        $.DOM.removeClass(element, className);
      });
    },
    /**
     * [toggleClass description]
     * @param  {[type]} className [description]
     * @return {[type]}           [description]
     */
    toggleClass: function(className) {
      this.each(function(element) {
        $.DOM.toggleClass(element, className);
      });

    },
    /**
     * [size description]
     * @return {[type]} [description]
     */
    size: function() {
      return this.attr('length');
    },
    /**
     * [show description]
     * @return {[type]} [description]
     */
    show: function() {
      return this.css('display', 'block');
    },
    /**
     * [hide description]
     * @return {[type]} [description]
     */
    hide: function() {
      return this.css('display', 'none');
    },
    /**
     * [val description]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    val: function(val) {
      return this.attr('value', val);
    },
    /**
     * [html description]
     * @param  {[type]} html [description]
     * @return {[type]}      [description]
     */
    html: function(html) {
      return this.attr('innerHTML', html);
    }
  };

  /**
   * [prototype description]
   * @type {[type]}
   */
  $.prototype = $.fn = $.DOM.prototype.init.prototype = $.DOM.prototype;

})(ThinkAway);

/**
 * [ JavaScript Module Loader ]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 * @namespace [ThinkAway.Loader]
 *
 * @author [Lsong]
 * @copyright [http://lsong.org]
 */
(function($) {
  $.extend($, {
    /**
     * [loaderConfig description]
     * @type {Object}
     */
    loaderConfig: {
      require: [],
      path: './js',
      prefix: 'thinkaway.',
      suffix: '.js',
      source: {
        'jquery': 'http://code.jquery.com/jquery.js'
      },
      cache: false,
      asDefault: false,
      load: function() {},
      ready: function() {},
      error: function(e) {
        ThinkAway.error('js loader error:' + e.message);
      }
    },
    /**
     * [loaderTask description]
     * @type {Object}
     */
    loaderTask: {
      //some text..
    },
    /**
     * [loader JS 模块加载器]
     * @param  {[type]} [...],callback
     * @param  {[type]} options
     * @return {[type]} [description]
     */
    loader: function() {
      var defaults = $.clone(this.loaderConfig);
      var options = $.extend(defaults, {});
      if(arguments.length > 1) {
        var pkg = arguments[0];
        options.ready = arguments[1];
        switch(typeof pkg) {
        case 'string':
          options.require = [pkg];
          break;
        case 'object':
          options.require = pkg;
          break;
        }
      } else {
        options = $.extend(options, arguments[0]);
        if(options.asDefault === true) {
          this.loaderConfig = options;
        }
      }

      //--
      var progress = 0,
        that = this,
        callback = function(name) {
          progress++;
          options.load(name);
          if(progress == options.require.length) {
            //console.info('All ready.');
            options.ready();
          } else {
            //load next mod .
            loadjs(options.require[progress], callback);
          }
        };
      /**
       * [loadjs 加载 js 模块]
       * @param  {[type]}   mod      [模块名称]
       * @param  {Function} callback [回调事件]
       * @return {[type]}            [description]
       */
      var loadjs = function(mod, callback) {
          var path = options.source[mod];
          if(!path) {
            var m = $.extend(options, {
              pkg: mod
            });
            path = $.format('{path}/{prefix}{pkg}{suffix}', m);
          }
          if(!options.cache) {
            path += '?nocache=' + (new Date()).getTime();
          }
          /**
           * [onload 发布事件]
           * @return {[type]} [description]
           */
          var onload = function() {
              //console.info(mod + ' is ready.');
              that.loaderTask[mod].state = 'loaded';
              $(that.loaderTask[mod].callback).each(function(cbk) {
                cbk();
              });
            };
          //检测当前模块状态
          if(that.loaderTask.hasOwnProperty(mod)) {
            switch(that.loaderTask[mod].state) {
            case 'loading':
              that.loaderTask[mod].callback.push(callback);
              break;
            case 'loaded':
              //console.info(mod + ' already .');
              callback();
              break;
            }
          } else {
            //首次加载模块 , 初始化数据信息
            that.loaderTask[mod] = {
              state: 'loading',
              callback: [callback]
            };
            //console.info('load ' + mod);
            try {
              $('head:eq(0)').append($('<script>').attr('src', path).attr('name', mod + '')
              //.attr('async','false')
              .attr('type', 'text/javascript').on('load', function() {
                onload();
              }).on('readystatechange', function() {
                if(this.readyState == 4 || this.readyState == 'complete' || this.readyState == 'loaded') {
                  onload();
                }
              }));
            } catch(e) {
              //error.
              options.error(e);
            }
          }
        };
      //begin load js mod .
      loadjs(options.require[0], callback);
    }
  });
})(ThinkAway);