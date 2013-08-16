(function($) {
	$.extend($.fn, {
		img360: function(options) {

			var defaults = {
				speed: 0.9,
				direction: false
			};
			options = $.extend(defaults, options);

			var timer = null;
			var startX = lastX = 0;
			var currentImg = lastImg = null;
			var index = current = offset = 0,
				speed = 0;
			var imgArray = this.element.getElementsByTagName('img');
			//calc eg:
			var _get = function(c, o, l) {
					return parseInt((c + o + (Math.abs(Math.floor(o / l)) * l)) % l);
				}
			var _set = function(i) {
					currentImg = imgArray[i];
					if(lastImg != currentImg) {
						if(lastImg) $(lastImg).css('display', 'none');
						$(currentImg).css('display', 'block');
						lastImg = currentImg;
					}
				}
			var _down = function(ev) {
					ev = ev || event;
					lastX = startX = ev.clientX;
					clearInterval(timer);
					document.onmousemove = _move;
					document.onmouseup = _up;
					return false;
				};
			var _move = function(ev) {
					ev = ev || event;
					//Çå³ýÑ¡Ôñ
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
					//-
					offset = ((ev.clientX - startX) / options.scale);
					offset = (options.direction ? offset : -offset);
					index = _get(current, offset, imgArray.length);
					_set(index);
					//-
					speed = ((ev.clientX - lastX) / options.scale);
					speed = (options.direction ? speed : -speed);
					lastX = ev.clientX;
					return false;
				};
			var _up = function() {
					current = index;
					timer = setInterval(function() {
						current = _get(current, speed, imgArray.length);
						_set(current);
						speed *= options.speed; //0.9;
						if(Math.abs(speed) <= 1) {
							clearInterval(timer);
							speed = 0;
						}
					}, 30);
					//free event
					document.onmousemove = null;
					document.onmouseup = null;
				};
			//this.on('mousedown',_down,true);
			this.element.onmousedown = _down; //firefox!!
			//set first thubm
			_set(0);
		}
	});
})(ThinkAway);