/**
 * [ JavaScript Ajax Helper ]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 * @namespace [ThinkAway.Ajax]
 *
 * @author [Lsong]
 * @copyright [http://lsong.org]
 */
(function($) {
  /**
   * [ajax Ajax 请求相关]
   * @param  {[type]} options [Ajax 选项]
   * @return {[type]}
   */
  $.ajax = function(options) {
    var defaults = {
      method: 'GET',
      data: null,
      type: 'text',
      async: false,
      cache: false
    };
    options = ThinkAway.extend(defaults, options);
    /**
     * [createXMLHttpRequest 创建XMLHttpRequest,兼容浏览器]
     * @return {[XMLHttpRequest]}
     */
    var createXMLHttpRequest = function() {
        var request = false;
        if(window.XMLHttpRequest) {
          request = new XMLHttpRequest();
        } else if(window.ActiveXObject) {
          var versions = ['MSXML.XMLHTTP', 'MSXML2.XMLHTTP', 'MSXML2.XMLHTTP.7.0', 'MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];
          for(var i = 0; i < versions.length; i++) {
            try {
              request = new ActiveXObject(versions[i]);
              if(request) {
                return request;
              }
            } catch(e) {
              options.error && options.error(e);
            }
          }
        }
        return request;
      };
    /**
     * [readyStateChangeProcess 处理状态改变]
     * @param  {[type]} XMLHttpRequest [XMLHttpRequest]
     * @return {[type]}
     */
    var readyStateChangeProcess = function(XMLHttpRequest) {
        /**
         * [completed 处理完成时解析HTTP状态码]
         * @param  {[type]} status [状态码]
         * @return {[type]}
         */
        var completed = function(status) {
            switch(status) {
            case 200:
              //OK                
              (function(type, callback) {
                switch(type.toUpperCase()) {
                case 'XML':
                  callback(XMLHttpRequest.responseXML);
                  break;
                case 'TEXT':
                  callback(XMLHttpRequest.responseText);
                  break;
                default:
                  callback(XMLHttpRequest.response);
                  break;
                }
              })(options.type, options.success);
              break;
            default:
              var error_info = {
                0: 'access denied',
                404: 'page not find.'
              };
              options.error && options.error(error_info[status] || 'unknow error', status);
              break;
            }
          };
        /**
         * 分析 XMLHttpRequest 请求状态
         */
        switch(XMLHttpRequest.readyState) {
        case 0:
          //0: (Uninitialized) the send( ) method has not yet been invoked. 
          break;
        case 1:
          //1: (Loading) the send( ) method has been invoked, request in progress. 
          break;
        case 2:
          //2: (Loaded) the send( ) method has completed, entire response received. 
          break;
        case 3:
          //3: (Interactive) the response is being parsed. 
          break;
        case 4:
          //4: (Completed) the response has been parsed, is ready for harvesting. 
          completed(XMLHttpRequest.status);
          break;
        default:
          break;
        }
      };
    /**
     * [xmlHttpRequest 创建 XMLHttpRequest]
     * @type {[type]}
     */
    var xmlHttpRequest = createXMLHttpRequest();
    //监听 onreadystatechange 事件
    xmlHttpRequest.onreadystatechange = function() {
      (options.callback || readyStateChangeProcess)(xmlHttpRequest);
    };

    if( !! !options.cache) {
      options.url += ('?' + (new Date()).getTime());
    }

    try {

      if(options.method == 'post') {
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }

      xmlHttpRequest.open(options.method, options.url, options.async);
      // If the server doesn't apply the text/xml Content-Type header,
      // can use overrideMimeType()to force XMLHttpRequest to parse it as XML anyway.
      // 
      if(xmlHttpRequest.overrideMimeType && options.type == 'xml') {
        xmlHttpRequest.overrideMimeType('text/xml');
      }
      xmlHttpRequest.send(options.data);
    } catch(e) {
      options.error && options.error(e);
    }
    return this;
  }
};

})(ThinkAway);