/**
 * [ JavaScript Scroller ]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 * @namespace [ThinkAway.Scroller]
 *
 * @author [Lsong]
 * @copyright [http://lsong.org]
 */
(function($) {


  var _lock_ = false;
  // 转换为数字
  var toInt = function(value) {
    value = parseInt(value);
    return isNaN(value) ? 0 : value;
  };

  // 获取元素信息
  $.getPos = function(e) {
    var l = 0;
    var t = 0;
    var w = toInt(e.style.width);
    var h = toInt(e.style.height);
    var wb = e.offsetWidth;
    var hb = e.offsetHeight;
    while(e.offsetParent) {
      l += e.offsetLeft + (e.currentStyle ? toInt(e.currentStyle.borderLeftWidth) : 0);
      t += e.offsetTop + (e.currentStyle ? toInt(e.currentStyle.borderTopWidth) : 0);
      e = e.offsetParent;
    }
    l += e.offsetLeft + (e.currentStyle ? toInt(e.currentStyle.borderLeftWidth) : 0);
    t += e.offsetTop + (e.currentStyle ? toInt(e.currentStyle.borderTopWidth) : 0);
    return {
      x: l,
      y: t,
      w: w,
      h: h,
      wb: wb,
      hb: hb
    };
  };

  // 获取滚动条信息
  $.getScroll = function() {
    var t, l, w, h;
    if(document.documentElement && document.documentElement.scrollTop) {
      t = document.documentElement.scrollTop;
      l = document.documentElement.scrollLeft;
      w = document.documentElement.scrollWidth;
      h = document.documentElement.scrollHeight;
    } else if(document.body) {
      t = document.body.scrollTop;
      l = document.body.scrollLeft;
      w = document.body.scrollWidth;
      h = document.body.scrollHeight;
    }
    return {
      t: t,
      l: l,
      w: w,
      h: h
    };
  };

  $.scrollTo = function(element, duration) {
      if(typeof element != 'object') {
        element = document.getElementById(element);
      }
      if(!element || _lock_ ) return;
      var that = this;
      that.element = element;
      that.p = $.getPos(element);
      that.s = $.getScroll();
      that.clear = function() {
        window.clearInterval(that.timer);
        that.timer = null
      };
      that.t = (new Date).getTime();
      that.step = function() {
        var t = (new Date).getTime();
        var p = (t - that.t) / duration;
        if(t >= duration + that.t) {
          that.clear();
          window.setTimeout(function() {
            that.scroll(that.p.y, that.p.x)
          }, 13);
          //free lock ..
          _lock_ = false;
        } else {
          st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (that.p.y - that.s.t) + that.s.t;
          sl = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (that.p.x - that.s.l) + that.s.l;
          that.scroll(st, sl);
        }
      };
      that.scroll = function(t, l) {
        window.scrollTo(l, t)
      };
      that.timer = window.setInterval(function() {
        that.step();
      }, 13);
      //set lock ..
      _lock_ = true;
    };

})(ThinkAway);
