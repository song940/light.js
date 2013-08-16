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