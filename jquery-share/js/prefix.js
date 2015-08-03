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
