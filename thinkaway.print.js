/**
 * PrintHelper
 *
 * for jQuery
 *
 * Lsong
 * i@lsong.org
 * http://lsong.org
 */
(function($) {

	/**
	 *
	 */
	$.print = function(files, callback) {
		//修正参数
		if(typeof files === 'string') {
			files = files.split(';');
		}
		//修正回调函数
		callback = callback ||
		function() {};
		//ActiveX API 句柄 
		var api = null;
		//标志量
		var paused = false,
			index = 0;
		/**
		 * UI 确认提示
		 */
		var waitConfirm = function (msg,callback) {
			var div = document.createElement('div');
			div.id = "dialog"
			//jQuery UI
			$(document.body).append(div);
			$(div).text(msg).dialog({
				title:'安装插件',
				modal:true,
				width:600,
				buttons:[
						{
							text:'安装好了 , 继续打印',
							click:function(){
								$(this).dialog('close');
								setTimeout(callback,1000);
							}
						}
					]
			});
		};
		/**
		 * Print Core Function
		 */
		var doPrint = function() {
				try{
					if(index >= files.length) {
						index = files.length;
						callback(3, null, index, files.length);
						return;
					};
					//move to first file .
					var file = files[index];
					//load file from a url . 
					var fileName = api.DownloadFile(file);
					//current jobs
					var startJobs = api.GetPrintJobs();
					//put file to printer list.
					api.PrintFile(fileName);
					//process ...
					(function() {
						//has added .
						if(startJobs !== api.GetPrintJobs()) {
							//trigger callback .
							callback && callback(1, file, index, files.length);
							(function() {
								//has print jobs .
								if(api.GetPrintJobs()) {//wait ..
									setTimeout(arguments.callee, 1000);
								} else {//print success .
									callback && callback(2, file, index, files.length);
									index++;//move to next file ..
									(function() {
										if(paused) {//wait to resume ..
											setTimeout(arguments.callee, 100);
										} else {
											doPrint();//print next file .
										}
									})();//cloure.
								}
							})();
						} else {//no add , wait .a 1000 ms
							setTimeout(arguments.callee, 1000);
						}
					})();
				}catch(e){
					console.log('print error:'+e);
				}
			};

		/**
		 * 
		 */
		var install = function() {
				confirm("无法安装插件, 是否尝试手动安装 ?") && (window.location = "http://13.141.43.227/print_addon_ie.exe");
			};

			try{
				//test for ActiveX .
				var obj = new ActiveXObject("ThinkAway.PrintHelper");
				//test a method .
				obj.GetPrintJobs();
				api = obj;
				//ok
				doPrint();
			}catch(e){
				var html = '<object id="PrintHelper" ' 
					+ 'CLASSID="CLSID:619289F3-32D3-442A-8439-2A6D5222C958" ' 
					+ 'CODEBASE="http://13.141.43.227/print_addon_ie.cab#version=1,0,0,0" >' 
					+ '</object>';
				//append to document
				$(document.body).append(html);
				//waiting for user confirm. 
				waitConfirm("正在尝试安装打印控件,请允许浏览器安装并在操作完成后确认.",function(){
					try{
						//test <object>
						var obj = document.getElementById("PrintHelper");
						obj.GetPrintJobs();
						api = obj;
						doPrint();
					}catch(e){
						//install.
						install();
					}
				});
			}

		return {
			/**
			 * canPause
			 */
			canPause: function() {
				return !paused;
			},
			/**
			 * pause
			 */
			pause: function() {
				paused = true;
			},
			/**
			 * resume
			 */
			resume: function() {
				paused = false;
			}
		};
	};

})(jQuery);