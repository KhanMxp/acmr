/*
* 锁定表头加排序
* */
define(function(require, exports, module) {
	var jQuery = require('jquery');

	(function($){
	    $.fn.yflockTable = function(options){
	        var opts;
	        var PLUGIN = $.fn.yflockTable;
	        var options = options || {};
	
	        opts = $.extend(true,{},PLUGIN.defaults,options);
	        var yflockTable = new yfjs.yflockTable(opts);
	        yflockTable.$applyTo = $(this);
	        yflockTable.init();
	        return yflockTable;
	
	    };
	    /*默认参数*/
	    $.fn.yflockTable.defaults = {
	        //锁定栏
	        fixColumnNumber:1
	    }
	    function getScrollbarWidth() {
			var virtualObj, scrollNone, scrollExist;
			virtualObj = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
			$('body').append(virtualObj);
			scrollNone = $('div', virtualObj).innerWidth();
			virtualObj.css('overflow-y', 'auto');
			scrollExist = $('div', virtualObj).innerWidth();
			$(virtualObj).remove();
			return (scrollNone - scrollExist);
		}
	    var yfjs = yfjs || {};
	    yfjs.yflockTable = function(options){
	        /*设置参数*/
	        this.options = options;
	        /*起作用的对象*/
	        this.$applyTo = this.options.applyTo && $(this.options.applyTo) || null;
	        /*要锁定列数*/
	        this.fixColumnNumber = options.fixColumnNumber;
	        this.isScroll = options.isScroll;
	        /*显示宽度和高度*/
	        this.width = this.options.width;
	        this.height = this.options.height;
	        if( !this.isScroll ){
	        	if(this.width>document.body.clientWidth)
	        	{
	        		this.width=this.width-getScrollbarWidth();
	        	}
	        }
	        /*滚动体宽度*/
	        this.scrollWidth = 0;
	        this.scrollHeight=0;
	        this.needlock=true;//超过一定数量时，不进行锁定，否则会造成浏览器奔溃
	    };
	    yfjs.yflockTable.prototype = {
	        /* 初始化 */
			        init : function() {
				this.originalTable = this.$applyTo.children("table");
//				if (this.originalTable.outerHeight() < this.height) {//只有表的高度大于要锁定的高度时才锁定
//					this.needlock = false;
//				} else {
					this.needlock = (typeof (this.originalTable
							.attr("datacount")) == "undefined")
							|| (this.originalTable.attr("datacount") < 10000);// 小于10000才锁定
//				}
				if (this.needlock) {
					this.creationHtml();
					this.setHtmlCss();
					this.setSynchronous();
				}
			},
	        // 把所需的html结构框架动态生成出来
	        creationHtml : function(){
	            this.$applyTo.append(
	                    '<div class="lockTable_container" style="width: '+this.width+'px; height: '+this.height+'px;overflow: hidden;position: relative;">' +
	                        '<div class="table_container_fix" style="overflow: hidden;position: absolute;z-index: 100;top:0;left:0;"></div>'+
	                        '<div class="table_container_head" style="overflow: hidden;position: absolute;z-index: 50;top:0;left:0;"></div>'+
	                        '<div class="table_container_column" style="overflow: hidden;position: absolute;z-index: 40;top:0;left:0;"></div>'+
	                         '<div class="table_container_main" style="overflow: auto;width: '+this.width+'px;height: '+this.height+'px;"></div>'+
	                    '</div>'
	            );
	  
	            this.tableFix = this.$applyTo.find(".table_container_fix").append(this.originalTable.clone().addClass("table_fix"));      //左上角固定不动的容器
	            this.tableHead = this.$applyTo.find(".table_container_head").append(this.originalTable.clone().addClass("table_head"));    //最上面的头部表容器
	            this.tableColumn = this.$applyTo.find(".table_container_column").append(this.originalTable.clone().addClass("table_column"));    //左边列表容器
	            this.table_main = this.$applyTo.find(".table_container_main");        //原始表容器
	            this.table_main.append(this.originalTable.addClass("table_main").attr("id","table_main"));
	            //判断是否出现滚动条
	            if(this.table_main.children("table").outerHeight() > this.height){
	                this.scrollWidth=17;
	            }
	            //判断是否出现横向滚动条
	            if(this.table_main.children("table").outerWidth() > this.width){
	                this.scrollHeight=17;
	            }
	
	        },
	        //设置html  css
	        setHtmlCss : function(){
	            //判断ie7
	            var width = $.support.getSetAttribute ?  0 : this.scrollWidth;
	            var lockWidth = 0;
	            var lockHeight = this.originalTable.children("thead").outerHeight()+1;
	            for(var i=0;i<this.fixColumnNumber;i++){
	            	var w = this.originalTable.children("tbody").find("tr:eq(0)").children().eq(i).outerWidth();
	                lockWidth += w;
	            };
	          //  if(lockWidth>$(window).width())
	            lockWidth+=1;
//	            this.$applyTo.css({"white-space": "nowrap"});
	            //if(lockWidth)
	            this.table_main.css({position:"relative"});
	            this.tableFix.css({"height":lockHeight,"width":lockWidth}).children("table").css({"width":this.width-width,"max-width":"none"});
	            this.tableColumn.css({"height":this.height-17,"width":lockWidth-width}).children("table").css({"width":this.width-width,"max-width":"none"});
	            this.tableHead.css({"height":lockHeight,"width":this.width-this.scrollWidth}).children("table").css({"width":this.width-width,"max-width":"none"});
	            this.originalTable.css({"width":this.width-width}).children("table").css({"max-width":"none"});
	        },
	        //设置同步滚动
	        setSynchronous : function(){
	            var self = this;
	            this.table_main.scroll(function () {
	                self.tableHead.scrollLeft($(this).scrollLeft());
	                self.tableColumn.scrollTop($(this).scrollTop());
	            });
				
	            if( $(".createtype").size() > 0 ){//如果是作图页面，重锁时记住滚动条位置
		            //$(".table_container_main").scrollLeft();
				}
	        },
	        anewlock : function(curTable) {
				if (this.needlock) {
					//重新获取表格
					this.originalTable = curTable.clone()
							.removeAttr("id class").addClass(
									"table table-striped");
					//this.originalTable = this.$applyTo.find(".table_main").clone().removeAttr("id").removeClass("table_main");
					this.width = this.$applyTo.find(".table_container_main")
							.width();
					//清空容器表格
					this.$applyTo.html("");
					this.creationHtml();
					this.setHtmlCss();
					this.setSynchronous();
				}
			}
	    };
	})(jQuery);
});