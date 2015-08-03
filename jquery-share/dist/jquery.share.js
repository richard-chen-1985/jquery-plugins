/**
 * jquery.share.js
 * e.g.
 *   // 配置分享参数
 *   $.share.config({
 *     content: [String] 要分享的内容
 *     url: [String] 要分享的url地址
 *     pic: [String] 缩略图片
 *   });
 *   // 绑定按钮
 *   $.share({
 *     elem: [jQuery Object] 要绑定的按钮
 *     type: [String] 分享框类型 [pop|tip]， pop为弹出框，tip为tooltip
 *   });
 */
;(function($) {

// 各社交网站分享api
// {{content}}: 描述内容
// {{url}}: 要分享的url地址
// {{pic}}: 分享的图标
var api = {
    // 新浪微博
    sinaweibo : {
        url: 'http://v.t.sina.com.cn/share/share.php?appkey=583395093&title={{content}}&url={{url}}&source=bshare&retcode=0&pic={{pic}}',
        text: '新浪微博'
    },
    // 腾讯微博
    qqweibo : {
        url: 'http://v.t.qq.com/share/share.php?title={{content}}&site={{url}}&pic={{pic}}&url={{url}}&appkey=dcba10cb2d574a48a16f24c9b6af610c',
        text: '腾讯微博'
    },
    // 人人网
    renren : {
        url: 'http://widget.renren.com/dialog/share?resourceUrl={{url}}&title={{content}}&images={{pic}}&description={{content}}',
        text: '人人网'
    },
    // QQ空间
    qzone : {
        url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{url}}&title={{content}}&pics={{pic}}&summary={{content}}',
        text: 'QQ空间'
    },
    // 开心网
    kaixin001 : {
        url: 'http://www.kaixin001.com/rest/records.php?url={{url}}&content={{content}}&pic={{pic}}&aid=100013770&style=111',
        text: '开心网'
    },
    // 豆瓣
    douban : {
        url: 'http://www.douban.com/recommend/?url={{url}}&title={{content}}&v=1',
        text: '豆瓣'
    },
    // 美丽说
    meilishuo : {
        url: 'http://www.meilishuo.com/meilishuo_share?siteurl={{url}}&content={{content}}',
        text: '美丽说'
    },
    // 蘑菇街
    mogujie : {
        url: 'http://www.mogujie.com/mshare?url={{url}}&content={{content}}&from=mogujie&pic={{pic}}',
        text: '蘑菇街'
    },
    // facebook
    facebook : {
        url: 'http://www.facebook.com/share.php?src=360buy&u={{url}}',
        text: 'facebook'
    },
    twitter : {
        url: 'http://twitter.com/intent/tweet?text={{content}}&url={{url}}',
        text: 'twitter'
    },
    // google+
    googleplus : {
        url: 'https://plus.google.com/share?url={{url}}&hl=zh-CN',
        text: 'googleplus'
    },
    // pinterest
    pinterest : {
        url: 'https://pinterest.com/login/?next=/pin/create/bookmarklet/?media=&url={{url}}&alt=&title={{content}}&is_video=false',
        text: 'pinterest'
    }
};

// 分享条目
var tplItem = '<li><a href="javascript:;" class="share-btn share-{{name}}" data-name="{{name}}">{{text}}</a></li>';

var isIE6 = /MSIE 6/.test(navigator.userAgent);

// 默认配置
var defaultConfig = {
    // 分享内容
    content: '',
    // url地址
    url: '',
    // 缩略图片
    pic: ''
};

function SharePop(elem) {
    // 遮罩层
    this.mask = $('<div class="ui-share-mask">');
    // 弹出层
    this.modal = $('<div class="ui-sharepop">' +
        '<div class="ui-sharepop-hd">分享到：</div>' +
        '<div class="ui-sharepop-cont">' +
        '<ul class="ui-share-list"></ul>' +
        '</div>' +
        '<div class="ui-sharepop-close">×</div>' +
        '</div>');

    // 接收触发元素
    this.elem = elem;
    
    // 初始化
    this.init();
}
SharePop.prototype = {
    constructor: SharePop,
    init: function() {
        // 生成各分享子项
        var tmpHtml = [];
        for(var item in api) {
            tmpHtml.push(tplItem.replace(/{{name}}/g, item).replace(/{{text}}/, api[item].text));
        }
        this.modal.find('.ui-share-list').append(tmpHtml.join(''));
        
        // 将遮罩及弹出层隐藏并加入body
        this.mask.hide().appendTo($('body'));
        this.modal.hide().appendTo($('body'));

        // 加载CSS样式
        this.loadStyle();
        
        // 绑定事件
        this.bindEvents();
    },
    bindEvents: function() {
        var self = this,
            modal = this.modal;

        // 给触发元素绑定click事件
        this.pushElem(this.elem);
        
        // 给各分享子项添加click事件
        modal.find('.share-btn').bind('click', function() {
            var tmpUrl = api[$(this).attr('data-name')].url;
            tmpUrl = tmpUrl.replace(/{{content}}/g, defaultConfig.content);
            tmpUrl = tmpUrl.replace(/{{url}}/g, defaultConfig.url);
            tmpUrl = tmpUrl.replace(/{{pic}}/g, defaultConfig.pic);
            window.open(tmpUrl, 'newwindow', 'width=1000,height=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
            return false;
        });

        // 关闭事件
        modal.find('.ui-sharepop-close').bind('click', function() {
            self.close();
        });
        this.mask.bind('click', function() {
            self.close();
        });
        
        // 滚动或者改变窗口大小时重新计算位置
        $(window).bind('resize scroll', function() {
            if(self.opened) {
                self.loadStyle();
            }
        });
    },
    pushElem: function(elem) {
        var self = this;
        elem.bind('click', function() {
            self.show();
        });
    },
    show: function() {
        this.mask.fadeIn(200);
        this.modal.fadeIn(200);
        this.opened = true;
    },
    loadStyle: function() {
        var modal = this.modal,
            mask = this.mask,
            docElem = document.documentElement,
            winWidth = $(window).width(),
            winHeight = $(window).height(),
            contWidth = Math.max(docElem.scrollWidth, docElem.clientWidth),
            contHeight = Math.max(docElem.scrollHeight, docElem.clientHeight),
            modalWidth = modal.outerWidth(),
            modalHeight = modal.outerHeight();

        modal.css({
            'top': (winHeight - modalHeight) / 2,
            'left': (winWidth - modalWidth) / 2
        });

        if(isIE6) {
            mask.css({
                'position': 'absolute',
                'width': contWidth,
                'height': contHeight
            });
            modal.css({
                'position': 'absolute'
            }).get(0).style.setExpression('top', 'documentElement.scrollTop+(documentElement.clientHeight-this.clientHeight)/2');
        }
    },
    close: function() {
        this.mask.hide();
        this.modal.hide();
        this.opened = false;
    }
};
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
var Share = {
    sharePop: null,
    createSharePop: function(elem) {
        if(this.sharePop === null) {
            this.sharePop = new SharePop(elem);
        } else {
            this.sharePop.pushElem(elem);
        }
        return this.sharePop;
    },
    shareTip: null,
    createShareTip: function(elem) {
        if(this.shareTip === null) {
            this.shareTip = new ShareTip(elem);
        } else {
            this.shareTip.pushElem(elem, true);
        }
        return this.shareTip;
    }
}

$.share = function(opts) {
    if(opts.type === 'pop') {
        Share.createSharePop(opts.elem);
    } else if(opts.type === 'tip') {
        Share.createShareTip(opts.elem);
    }
};

$.share.config = function(cfg) {
    $.extend(defaultConfig, cfg);
};
})(jQuery);