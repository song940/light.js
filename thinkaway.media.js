(function($){
$.TPlayer = function(options){
	return new $.TPlayer.fn.init(options); 
}
$.TPlayer.fn = {
	init:function(options){
		var videoArray = [];
		for(i in options.file){
			var files = [];
			var name = options.file[i];
			for(j in options.format){
				var ext = options.format[j];
				var filename = options.path + name + '.' + ext;
				files.push({
					'name':name,
					'type':ext,
					'file':filename
				});
			}
			videoArray.push(files);
		}
		this.playList = videoArray;
		this.video = options.video;
		this.options = options;
		return this;
	},
	play:function(index){
		var files = this.playList[index];
		
		var poster = this.options.path + files[0].name+'.'+this.options.thumb;
		$(this.video).attr('poster',poster);	
		for(f in files){
			//alert(this.video.canPlayType('video/'+files[f].type))
			if(this.video.canPlayType('video/'+files[f].type)){
				$(this.video).on('ended',this.options.ended);
				$(this.video).attr('src',files[f].file);
				break;
			}
		}
		this.video.play();
	},
	pause:function(){
		this.video.pause();	
	},
	stop:function(){
		//alert($(this.video).attr('currentTime'));
		this.video.currentTime = 0;
		this.video.pause();	
	}
}

$.TPlayer.fn.init.prototype = $.TPlayer.fn;

$.extend($.fn,{
	tplayer:function(options){
		options['video'] = this.element;
		return $.TPlayer.fn.init(options); 
	}
});
})(ThinkAway);