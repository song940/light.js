
/**
 * [ JavaScript Color Helper ]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 * @namespace [ThinkAway.Color]
 *
 * @author [Lsong]
 * @copyright [http://lsong.org]
 */
(function($) {
  /**
   * [Color 颜色转换]
   * @param {[type]} str [颜色值]
   */
  $.Color = function(str) {
    //r,g,b,a
    this.color = [0, 0, 0];
    //#fff,#00ff00
    if(/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(str)) {
      str = str.substring(1); //#...      
      var hex = function(s) { //tohex
          (s.length < 2) && (s += s); //f -> ff
          s = '0x' + s; //0xff
          return Number(s) //0xff -> 255;
        };
      //fff -> 255,255,255 | ff00ff -> 255,0,255
      var n = str.length / 3; //n = 1 | 2 , (fff | ff00ff) = (3 or 6) = min(3)
      for(var i = 0; i < this.color.length; i++) {
        this.color[i] = hex(str.substring(i * n, (i + 1) * n));
      }
    } else if(/^(rgb|rgba)/.test(str)) { //rgb(255,100,12),rgba(100,200,90,255)
      this.color = str.replace(/\(|rgba|rgb|\)/g, '').split(',');
    } else { //255,255,0  0,0,0,255
      this.color = str.split(',');
    }
    //"255","255","0" -> 255,255,0
    for(var i = 0; i < this.color.length; i++) {
      this.color[i] = parseInt(this.color[i]);
    }
    //put r,g,b,a
    this.r = this.color[0];
    this.g = this.color[1];
    this.b = this.color[2];
    this.a = this.color[3];
    //
    return this;
  };
  /**
   * [prototype description]
   * @type {Object}
   */
  $.Color.prototype = {
    toHex: function() {
      var hex = '#';
      for(var i = 0; i < this.color.length; i++) {
        var t = parseInt(this.color[i]);
        t = t.toString(16); //to hex , ff,c6,...
        hex += ((t.length == 1) ? (t + t) : t);
      }
      return hex;
    },
    toNumber: function() {
      //to . 255,255,0
      return this.color.join(',');
    },
    toArray: function() {
      //[255,255,0]
      return this.color;
    },
    toRGB: function() {
      //has 'a'(alpha) ,...
      return 'rgb' + (this.a ? 'a' : '') + '(' + this.toNumber() + ')';
    }
  };

})(ThinkAway || {});
