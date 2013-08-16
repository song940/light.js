/**
 * [ JavaScript URL Parser ]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 * @namespace [ThinkAway.URLParser]
 *
 * @author [Lsong]
 * @copyright [http://lsong.org]
 */
(function($, undefined) {

  /**
   * Creates an URLParser instance
   *
   * @classDescription    Creates an URLParser instance
   * @return {Object} return an URLParser object
   * @param {String} url  The url to parse
   * @constructor
   * @exception {String}  Throws an exception if the specified url is invalid
   */
  $.URLParser = function(url) {

    //var url = 'http://user:password@www.codebit.cn:9901/pub/article.php?offset&perpage=10#fragment';
    /**
     * [fields description]
     * @type {Object}
     */
    this.fields = {
      'UserName': 4,
      'Password': 5,
      'Port': 7,
      'Protocol': 2,
      'Host': 6,
      'Path': 8,
      'URL': 0,
      'QueryString': 9,
      'Fragment': 10
    };
    /**
     * [regex description]
     * @type {RegExp}
     */
    this.regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
    /**
     * parse url
     */
    url && this.parse(url);

    return this;

  };
  /**
   * [prototype description]
   * @type {Object}
   */
  $.URLParser.prototype = {
    /**
     * [parse description]
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    parse: function(url) {
      var regex = this.regex.exec(url);
      if(!regex) {
        $.error('ThinkAway.URLParser::parse -> Invalid URL');
      }
      for(var field in this.fields) {
        var value = regex[this.fields[field]];
        this[field] = (value === undefined ? '' : value);
      }
      //parse query string args .
      this['Arguments'] = {};
      var args = this.QueryString.split('&');
      for(var i = 0; i < args.length; i++) {
        var arg = args[i].split('=');
        this.Arguments[arg[0]] = arg[1];
      }
    }
  };


})(ThinkAway);