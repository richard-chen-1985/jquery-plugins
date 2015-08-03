function ShareTip(elem) {
    // tip层
    this.tip = $('<div class="ui-sharetip">' +
        '<div class="ui-sharetip-hd">分享到：</div>' +
        '<div class="ui-sharetip-cont"><ul class="ui-share-list"></ul></div>' +
        '<div class="ui-sharetip-arrow"><span class="arrow1"></span><span class="arrow2"></span></div>' +
        '</div>');

    // 接收触发元素
    this.elem = elem;
	
	// 隐藏tip层定时器
	this.timer = null;
    
	// 延时多少毫秒关闭tip层
	this.closeInterval = 500;
    
    // 保存当前触发show的元素，用于在滚动或者改变窗口大小时重新计算tip位置
    this.currentTarget = null;
    
    // 初始化
    this.init();
}
ShareTip.prototype = {
    constructor: ShareTip,
    init: function() {
        // 生成各分享子项
        var tmpHtml = [];
        for(var item in api) {
            tmpHtml.push(tplItem.replace(/{{name}}/g, item).replace(/{{text}}/, api[item].text));
        }
        this.tip.find('.ui-share-list').append(tmpHtml.join(''));
        
        // 将tip层隐藏并加入body
        this.tip.hide().appendTo($('body'));
        
        // 绑定事件
        this.bindEvents();
    },
    bindEvents: function() {
        var self = this,
            tip = this.tip;

        // 给触发元素绑定hover事件
        this.pushElem(this.elem, true);
		
		// 给tip层添加hover事件
		this.pushElem(tip, false);
        
        // 给各分享子项添加click事件
        tip.find('.share-btn').bind('click', function() {
            var tmpUrl = api[$(this).attr('data-name')].url;
            tmpUrl = tmpUrl.replace(/{{content}}/g, defaultConfig.content);
            tmpUrl = tmpUrl.replace(/{{url}}/g, defaultConfig.url);
            tmpUrl = tmpUrl.replace(/{{pic}}/g, defaultConfig.pic);
            window.open(tmpUrl, 'newwindow', 'width=1000,height=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
            return false;
        });
        
        // 滚动或者改变窗口大小时重新计算位置
        $(window).bind('resize scroll', function() {
            if(self.currentTarget) {
                self.loadStyle(self.currentTarget);
            }
        });
    },
    // 给指定元素添加hover事件, bStyle: 是否在hover时重新计算tip层位置，主要用于tip本身hover时避免重复计算样式
    pushElem: function(elem, bStyle) {
        var self = this;
        elem.hover(function() {
			clearTimeout(self.timer);
            self.show($(this), bStyle);
        }, function() {
			self.timer = setTimeout(function() {
				self.close();
			}, self.closeInterval);
		});
    },
    show: function(elem, bStyle) {
        if(bStyle) {
            this.loadStyle(elem);
            this.currentTarget = elem;
        }
        this.tip.show();
    },
    loadStyle: function(elem) {
        var elemOffset = elem.offset(),
            elemHeight = elem.outerHeight();
            
        this.tip.css({
            top: elemOffset.top + elemHeight + 6,
            left: elemOffset.left
        });
    },
    close: function() {
        this.tip.hide();
        this.currentTarget = null;
    }
};