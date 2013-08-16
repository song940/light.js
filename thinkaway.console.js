/**
 * [ 控制台调试工具]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 * @namespace [ThinkAway.Console]
 * 
 * @author [Lsong]
 * @copyright [http://lsong.org]
 */
(function($){

/**
 * [Logger 日志]
 * @param {[type]} options [选项]
 */
$.Logger = function(options){
	/**
	 * [LEVEL 日志级别]
	 * @type {Object}
	 */
	$.Logger.LEVEL = {
		INFO: 	1,
		DEBUG: 	2,
		WARN: 	3,
		ERROR: 	4
	};

	/**
	 * [defaults description]
	 * @type {Object}
	 */
	var defaults = {
		id:'console',
		tag:['tag','log','sys'],
		level:$.Logger.LEVEL.INFO,
		format:'{DATE} {LOG}'
	};

	options = $.extend(defaults,options);

	var ul = options.view || document.createElement('ul');

	/**
	 * [out 输出文本内容]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
	this.out = function(log,flag) {
		var li = document.createElement('li');
		var text = document.createTextNode(log);
		li.appendChild(document.createElement('i'));
		li.appendChild(text);
		ul.appendChild(li);
		//class
		li.className = 'log-flag' + (flag === undefined ? '': flag);

		//focus
		var scroll = document.createElement('li');
		scroll.innerHTML = '<!-- log -->';
		ul.appendChild(scroll);
		scroll.scrollIntoView();
		$(scroll).remove();
	};
	/**
	 * [log 根据日志模板输出日志]
	 * @param  {[type]} level [description]
	 * @param  {[type]} tag   [description]
	 * @param  {[type]} log   [description]
	 * @param  {[type]} args  [description]
	 * @return {[type]}       [description]
	 */
	this.log = function(level,tag,log,args){
		log += '';
		log = $.format(log,args);
		log = $.format(options.format,{
			'DATE'	:$.getDate('HH:mm:ss'),
			'LEVEL'	:level,
			'LOG'	:log,
			'TAG'	:tag
		});
		//
		
		if(level >= options.level){
			this.out(log,level);
		}
	};
	/**
	 * [show 显示日志]
	 * @return {[type]} [description]
	 */
	this.show = function (element) {
		if(element){
			element.appendChild(ul);
		}else{
			$('#' + options.id).append(ul);
		}	
	};

	//say hello !
	this.out('Welcome use ThinkAway !');

	return this;
};
/**
 * [prototype description]
 * @type {Object}
 */
$.Logger.prototype = {
	info:function(tag,log,args){
		return this.log($.Logger.LEVEL.INFO,tag,log,args);
	},
	debug:function(tag,log,args){
		return this.log($.Logger.LEVEL.DEBUG,tag,log,args);
	},
	warn:function(tag,log,args){
		return this.log($.Logger.LEVEL.WARN,tag,log,args);
	},
	error:function(tag,log,args,error){
		return this.log($.Logger.LEVEL.ERROR,tag,log,args);
	}
};
/**
 * [Profiler 性能监视器]
 * @param {[type]} component [description]
 */
$.Profiler = function(component) {
  this.timers = {};
  this.logger = new $.Logger();
  this.component = component;  
  for(var key in this.component) {
    // Ensure that the property is a function.
    if(typeof this.component[key] !== 'function') {
      continue;
    }
    // Add the method.
    var that = this;
    (function(methodName) {
      that[methodName] = function() {
        that.startTimer(methodName);
        var returnValue = that.component[methodName].apply(that.component,arguments);
        that.displayTime(methodName, that.getElapsedTime(methodName));
        return returnValue;
      };
    })(key); }
};

$.Profiler.prototype = {
  startTimer: function(methodName) {
    this.timers[methodName] = (new Date()).getTime();
  },
  getElapsedTime: function(methodName) {
    return (new Date()).getTime() - this.timers[methodName];
  },
  displayTime: function(methodName, time) {
  	//alert(time);
	this.logger.log(9,'profiler','{name}: {time} ms',{
		'name':methodName,
		'time':time
	});
  }
};
/**
 * [Console 控制台工具]
 */
$.Console = function(){

	this.view = $("<div>")
		.attr({
			'id'	:'console',
			'class'	:'console'
		});
	this.view_head = $('<div>')
		.attr('id','console-header')
		.html([
				"<b>Console</b>",
				"<a id='console-close'>X</a>",
				"<a id='console-clear'>C</a>",
				"<a id='console-help'>H</a>"
			].join(''));
	this.view_body 	= $('<div>').attr('class','console-display');
	this.view_log 	= $('<ul>').attr('id','console-logger');
	this.view_foot 	= $('<div>')
		.attr('class','console-footer')
		.html("&gt;<input id='console-input' />");

	this.view_body.append(this.view_log);
	//
	this.view.append(this.view_head);
	this.view.append(this.view_body);
	this.view.append(this.view_foot);
	
	/**
	 * [logger description]
	 * @type {Logger}
	 */
	this.logger = new $.Logger({view:this.view_log[0]});
	/**
	 * [execute description]
	 * @param  {[type]} cmd [description]
	 * @return {[type]}     [description]
	 */
	this.execute = function(cmd){
		var result = '';		
		try{
			result =  eval(cmd);			
			if(undefined === result){
				result = cmd;
			}
		}catch(e){
			result = e;
		}
		return result;
	};
	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	this.history = this.history || new function(){
		var cache = [],index = 0;
		return {
			get:function(i){
				index += i;
				index = Math.min(index,cache.length - 1);
				index = Math.max(index,0);
				return cache[index];
			},
			add:function(r){
				if(r != cache[index - 1]){
					cache.push(r);
					index = cache.length;
				}
			},
			clear:function(){
				index = 0;
				cache = [];
				cache.length = 0;
			}
		}
	};

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	this.init = function(){
		$(document.body).append(this.view);
		////drag & drop plugin.
		if($.fn.draggable){			
			$("#console").draggable({handle:'console-header'});	
			$("#console").css('position','fixed');
		}
		var that = this;
		$("#console-input").on('keydown',function(ev){
			switch(ev.keyCode){
				case 13://enter
					var cmd = $(this).val();
					if(!(cmd == null || cmd == '')){						
						that.logger.out(that.execute(cmd));
						that.history.add(cmd);
						$(this).val('');
					}
					break;
				case 38://up
					ev.preventDefault();
					$(this).val(that.history.get(-1));
					break;
				case 40://down
					ev.preventDefault();
					$(this).val(that.history.get(+1));
					break;
			}
		});
		$("#console-close").on('click',function(){
			that.view.hide();
		});
		$("#console-clear").on('click',function(){
			that.view_log.html('');
			that.logger.out('Welcome use ThinkAway !');
		});
		$("#console-help").on('click',function(){
			that.logger.out('help!');
		});
		this.created = true;
	};

};
/**
 * [prototype description]
 * @type {Object}
 */
$.Console.prototype = {
	/**
	 * [show description]
	 * @return {[type]} [description]
	 */
	show:function(){
		if(!this.created){
			this.init();
		}
		this.view.show();
	},
	/**
	 * [log description]
	 * @return {[type]} [description]
	 */
	log:function(){
		this.logger.log.apply(this.logger,arguments);
	},
	info:function(){
		this.logger.info.apply(this.logger,arguments);
	},
	/**
	 * [debug description]
	 * @return {[type]} [description]
	 */
	debug:function(){
		this.logger.debug.apply(this.logger,arguments);
	},
	/**
	 * [warn description]
	 * @return {[type]} [description]
	 */
	warn:function(){
		this.logger.warn.apply(this.logger,arguments);
	},
	/**
	 * [error description]
	 * @return {[type]} [description]
	 */
	error:function(){
		this.logger.error.apply(this.logger,arguments);
	},
	/**
	 * [profiler description]
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	profiler:function(obj){
		this.profiler 	= new $.Profiler(obj);
		this.profiler.logger = this.logger;
		return this.profiler;
	}
};
/***/
$.console = new $.Console();

/**
 * 
 */
$.extend($.console,{
	debug:function(tag,msg,args){
		if(!msg){msg = tag;tag = 'tag_debug'};
		this.log($.Logger.LEVEL.DEBUG,tag,msg,args||{});
	},
	info:function(tag,msg,args){
		if(!msg){msg = tag;tag = 'tag_info'};
		this.log($.Logger.LEVEL.INFO,tag,msg,args||{});
	},
	warn:function(tag,msg,args){
		if(!msg){msg = tag;tag = 'tag_warn'};
		this.log($.Logger.LEVEL.WARN,tag,msg,args||{});
	},
	error:function(tag,msg,args){
		if(!msg){msg = tag;tag = 'tag_error'};
		this.log($.Logger.LEVEL.ERROR,tag,msg,args||{});
	}
});

})(ThinkAway);
