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