(function($) {
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
    var tplItem = '<a href="javascript:;" class="share-btn share-btn-{{name}}" data-name="{{name}}"><i></i><em>{{text}}</em></a>';

    var isIE6 = /MSIE 6/.test(navigator.userAgent);

    function SharePop(opts) {
        this.mask = $('<div class="ui-sharepop-mask">');
        this.modal = $('<div class="ui-sharepop-modal">' +
            '<div class="ui-sharepop-hd">分享到：</div>' +
            '<div class="ui-sharepop-cont"></div>' +
            '<div class="ui-sharepop-close">×</div>' +
            '</div>');

        this.opts = $.extend({}, opts);

        this.init();
    }
    SharePop.prototype = {
        constructor: SharePop,
        init: function() {
            var tmpHtml = [];
            for(var item in api) {
                tmpHtml.push(tplItem.replace(/{{name}}/g, item).replace(/{{text}}/, api[item].text));
            }
            this.modal.find('.ui-sharepop-cont').append(tmpHtml.join(''));

            this.bindEvents();
        },
        bindEvents: function() {
            var self = this,
                modal = this.modal,
                opts = this.opts;

                modal.find('.share-btn').bind('click', function() {
                    var tmpUrl = api[$(this).attr('data-name')].url;
                    tmpUrl = tmpUrl.replace(/{{content}}/g, opts.content);
                    tmpUrl = tmpUrl.replace(/{{url}}/g, opts.url);
                    tmpUrl = tmpUrl.replace(/{{pic}}/g, opts.pic);
                    window.open(tmpUrl, 'newwindow', 'width=1000,height=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
                    return false;
                });

            modal.find('.ui-sharepop-close').bind('click', function() {
                self.close();
            });
            this.mask.bind('click', function() {
                self.close();
            });
        },
        show: function() {
            $('body').append(this.mask).append(this.modal);
            this.loadStyle();
        },
        loadStyle: function() {
            var self = this,
                modal = this.modal,
                mask = this.mask,
                modalWidth = modal.outerWidth(),
                modalHeight = modal.outerHeight();

            var maskCss = {
                'position': 'fixed',
                'width': '100%',
                'height': '100%',
                'top': '0',
                'left': '0',
                'background': '#000',
                'opacity': '0.5',
                'filter': 'alpha(opacity=50)',
                'z-index': 99999
            };

            var modalCss = {
                'position': 'fixed',
                'top': '50%',
                'left': '50%',
                'background': '#fff',
                'margin-top': -modalHeight / 2,
                'margin-left': -modalWidth / 2,
                'z-index': 100000
            };

            if(isIE6) {
                var docElem = document.documentElement;
                var contWidth = Math.max(docElem.scrollWidth, docElem.clientWidth);
                var contHeight = Math.max(docElem.scrollHeight, docElem.clientHeight);
                $.extend(maskCss, {
                    'position': 'absolute',
                    'width': contWidth,
                    'height': contHeight
                });
                $.extend(modalCss, {
                    'position': 'absolute',
                    'left': (contWidth - modalWidth) / 2,
                    'margin-top': 0,
                    'margin-left': 0
                });
                modal.get(0).style.setExpression('top', 'documentElement.scrollTop+(documentElement.clientHeight-this.clientHeight)/2');
            }
            mask.css(maskCss);
            modal.css(modalCss);
        },
        close: function() {
            this.mask.remove();
            this.modal.remove();
        }
    };

    $.sharePop = function(opts) {
        new SharePop(opts).show();
    };

})(jQuery);