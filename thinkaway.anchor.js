/**
 * [ JavaScript Anchor Jumper ]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 * @namespace [ThinkAway.Scroller]
 *
 * @author [Lsong]
 * @copyright [http://lsong.org]
 */
(function($) {
  $.Anchor = function(duration) {
    var init = function() {
      /**
       * [gotoView description]
       * @param  {[type]} hash [description]
       * @return {[type]}      [description]
       */
        var gotoView = function(hash) {
            var hashIndex = hash.indexOf('#');
            if(hashIndex > -1) {
              var targetId = hash.substring(hashIndex + 1);
              $.scrollTo(targetId, duration || 800);
            }
          };
        $('a[href*=#]').on('click', function(ev) {
          if(this.target !== '_blank') {
            gotoView(this.href);
          }
          return false;
        });
        //
        gotoView(window.location.hash);
      };    
    if((typeof window.onload) === 'function') {
      var old_load = window.onload;
      window.onload = function() {
        init();
        old_load();
      };
    } else {
      init();
    }
  };  
})(ThinkAway);