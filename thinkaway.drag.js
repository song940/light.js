(function($) {

	var Class = {
		create: function() {
			return function() {
				this.initialize.apply(this, arguments);
			}
		}
	};
	
	var Drag = Class.create();

	Drag.event = function(object, func) {
		return function(event) {
			return func.call(object, (event || window.event));
		}
	};

	Drag.prototype = {
		//拖放对象
		initialize: function(drag, options) {
			this.Drag = drag; //拖放对象
			this._x = this._y = 0; //记录鼠标相对拖放对象的位置
			this._marginLeft = this._marginTop = 0; //记录margin
			//事件对象(用于绑定移除事件)
			this._event_move = Drag.event(this, this.Move);
			this._event_stop = Drag.event(this, this.Stop);

			this.SetOptions(options);

			this.limit = !! this.options.limit;
			this.min_x = parseInt(this.options.min_x);
			this.max_x = parseInt(this.options.max_x);
			this.min_y = parseInt(this.options.min_y);
			this.max_y = parseInt(this.options.max_y);

			this.lock = !! this.options.lock;
			this.lock_x = !! this.options.lock_x;
			this.lock_y = !! this.options.lock_y;


			this.start = this.options.start;
			this.move = this.options.move;
			this.stop = this.options.stop;

			this._handle = (this.options.handle ? $('#' + this.options.handle) : this.Drag);
			this._box = (this.options.box ? $('#' + this.options.box) : false);

			this.Drag.css('position', "absolute");
			//透明
			if($.browser.ie && !! this.options.transparent) {
				//填充拖放对象
				with(this._handle.appendChild(document.createElement("div")).style) {
					width = height = "100%";
					backgroundColor = "#fff";
					filter = "alpha(opacity:0)";
					fontSize = 0;
				}
			}
			//修正范围
			this.Repair();
			this._handle.on("mousedown", Drag.event(this, this.Start));
			//touch event
			this._handle.on("touchstart", Drag.event(this, this.Start));
		},
		//设置默认属性
		SetOptions: function(options) {
			var defaults = { //默认值
				handle: "",
				//设置触发对象（不设置则使用拖放对象）
				box: "",
				//指定限制在容器内
				limit: false,
				//是否设置范围限制(为true时下面参数有用,可以是负数)
				min_x: 0,
				//左边限制
				max_x: 9999,
				//右边限制
				min_y: 0,
				//上边限制
				max_y: 9999,
				//下边限制		
				lock_x: false,
				//是否锁定水平方向拖放
				lock_y: false,
				//是否锁定垂直方向拖放
				lock: false,
				//是否锁定
				start: function() {},
				//开始移动时执行
				move: function() {},
				//移动时执行
				stop: function() {},
				//结束移动时执行
				transparent: false //是否透明
			};
			this.options = $.extend(defaults, options || {});
		},
		//准备拖动
		Start: function(ev) {
			ev = ev || window.event;
			//alert(this);
			if(this.lock) {
				return;
			}

			this.Repair();


			//记录鼠标相对拖放对象的位置
			this._x = ev.clientX - this.Drag.attr('offsetLeft');
			this._y = ev.clientY - this.Drag.attr('offsetTop');
			//记录margin
			this._marginLeft = parseInt(this.Drag.css('marginLeft')) || 0;
			this._marginTop = parseInt(this.Drag.css('marginTop')) || 0;
			//mousemove时移动 mouseup时停止
			$(document).on("mousemove", this._event_move);
			$(document).on("mouseup", this._event_stop);

			//touch event
			$(document).on("touchmove", this._event_move);
			$(document).on("touchend", this._event_stop);


			if($.browser.ie) {
				//焦点丢失
				this._handle.on("losecapture", this._event_stop, true);
			} else {
				//焦点丢失
				$(window).on("blur", this._event_stop);
				//阻止默认动作
				ev.preventDefault();
			};
			//附加程序
			this.start.call(this.Drag, ev);
		},
		//修正范围
		Repair: function() {
			if(this.limit) {
				//修正错误范围参数
				this.max_x = Math.max(this.max_x, this.min_x + this.Drag.attr('offsetWidth'));
				this.max_y = Math.max(this.max_y, this.min_y + this.Drag.attr('offsetHeight'));
				//如果有容器必须设置position为relative或absolute来相对或绝对定位，并在获取offset之前设置
				!this._box || this._box.css('position') == "relative" || this._box.css('position') == "absolute" || (this._box.css('position', "relative"));
			}
		},
		//拖动
		Move: function(ev) {
			ev = ev || window.event;
			//判断是否锁定
			if(this.lock) {
				this.Stop();
				return;
			};


			//清除选择
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			//设置移动参数
			var iLeft = ev.clientX - this._x,
				iTop = ev.clientY - this._y;
			//设置范围限制
			if(this.limit) {
				//设置范围参数
				var min_x = this.min_x,
					max_x = this.max_x,
					min_y = this.min_y,
					max_y = this.max_y;
				//如果设置了容器，再修正范围参数
				if( !! this._box) {
					min_x = Math.max(min_x, 0);
					min_y = Math.max(min_y, 0);
					max_x = Math.min(max_x, this._box.attr('clientWidth'));
					max_y = Math.min(max_y, this._box.attr('clientHeight'));
				};
				//修正移动参数
				iLeft = Math.max(Math.min(iLeft, max_x - this.Drag.attr('offsetWidth')), min_x);
				iTop = Math.max(Math.min(iTop, max_y - this.Drag.attr('offsetHeight')), min_y);
			}
			//设置位置，并修正margin
			if(!this.lock_x) {
				this.Drag.css('left', iLeft - this._marginLeft + "px");
			}
			if(!this.lock_y) {
				this.Drag.css('top', iTop - this._marginTop + "px");
			}

			//附加程序
			this.move.call(this.Drag, ev);
		},
		//停止拖动
		Stop: function() {
			//移除事件
			$(document).un("mousemove", this._event_move);
			$(document).un("mouseup", this._event_stop);
			//touch event
			$(document).un("touchmove", this._event_move);
			$(document).un("touchend", this._event_stop);

			if($.browser.ie) {
				this._handle.un("losecapture", this._event_stop, true);
			} else {
				$(window).un("blur", this._event_stop);
			};
			//附加程序
			this.stop.call(this.Drag);
		}
	};
	$.extend($.fn, {
		draggable: function(options) {
			return new Drag(this, options);
		}
	});
	$.extend($, {
		Direction: function(_x, _y, offet) {
			var x, y, xold = _x,
				yold = _y,
				xdiff, ydiff;
			return function(x, y) {
				xdiff = x - xold;
				ydiff = y - yold
				if((xdiff < offet) && (ydiff < -offet)) return(0); //n上
				if((xdiff < offet) && (ydiff > offet)) return(4); //s下
				if((xdiff > offet) && (ydiff < offet)) return(2); //e右
				if((xdiff < -offet) && (ydiff < offet)) return(6); //w左
				if((xdiff > offet) && (ydiff > offet)) return(3); //se
				if((xdiff > offet) && (ydiff < -offet)) return(1); //ne
				if((xdiff < -offet) && (ydiff > offet)) return(5); //sw
				if((xdiff < -offet) && (ydiff < -offet)) return(7); //nw
				xold = x;
				yold = y;
				return -1;
			};
		}
	});
})(ThinkAway);