var Share = {
    sharePop: null,
    createSharePop: function(opts) {
        if(this.sharePop === null) {
            this.sharePop = new SharePop(opts);
        } else {
            this.sharePop.pushElem(opts.elem, opts);
        }
    },
    shareTip: null,
    createShareTip: function(opts) {
        if(this.shareTip === null) {
            this.shareTip = new ShareTip(opts);
        } else {
            this.shareTip.pushElem(opts.elem, opts, true);
        }
    }
}

$.share = function(opts) {
    if(opts.type === 'pop') {
        Share.createSharePop(opts);
    } else if(opts.type === 'tip') {
        Share.createShareTip(opts);
    }
};

$.share.config = function(cfg) {
    $.extend(defaultConfig, cfg);
};