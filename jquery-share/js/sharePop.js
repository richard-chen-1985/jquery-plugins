function SharePop(opts) {
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

    // 接收默认参数
    this.opts = $.extend({}, defaultSettings, opts);
    
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
        this.pushElem(this.opts.elem, this.opts);
        
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
    pushElem: function(elem, opts) {
        var self = this;
        $.extend(this.opts, opts);
        elem.bind('click', function() {
            self.show();
        });
    },
    show: function() {
        this.mask.fadeIn(200);
        this.modal.fadeIn(200);
        this.opened = true;
        this.opts.onshow.call(this);
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

        if(isIE6) {
            mask.css({
                'position': 'absolute',
                'width': contWidth,
                'height': contHeight
            });
            modal.css({
                'position': 'absolute',
                'left': (winWidth - modalWidth) / 2
            }).get(0).style.setExpression('top', 'documentElement.scrollTop+(documentElement.clientHeight-this.clientHeight)/2');
        } else {
            modal.css({
                'top': (winHeight - modalHeight) / 2,
                'left': (winWidth - modalWidth) / 2
            });
        }
    },
    close: function() {
        this.mask.hide();
        this.modal.hide();
        this.opened = false;
        this.opts.onclose.call(this);
    }
};