;(function($) {
  function GoTop(elem, opts) {
    this.elem = elem;
    this.opts = $.extend({}, GoTop.DEFAULTS, opts);
    this.timer = null;
    this.isTop = true;
    this.clientHeight = $(window).height();
    this.bindEvents();
  }
  GoTop.DEFAULTS = {
    autoShow: true
  };
  GoTop.prototype = {
    constructor: GoTop,
    bindEvents: function() {
      var self = this;
      var clientHeight = self.clientHeight;
      var elem = self.elem;

      $(window).bind('scroll', function() {
        //获取滚动条距离顶部的高度
        var osTop = $(window).scrollTop();
        self.opts.autoShow && (osTop >= clientHeight ? elem.show() : elem.hide());
        if (!self.isTop){
          clearInterval(self.timer);
        }
        self.isTop = false;
      });

      $(window).bind('resize', function() {
        self.clientHeight = $(window).height();
      });

      elem.bind('click', function() {
        //设置定时器
        self.timer = setInterval(function() {
          //获取滚动条距离顶部的高度
          var osTop = $(window).scrollTop();
          var ispeed = Math.floor(osTop * 0.75);

          $(window).scrollTop(ispeed);
          self.isTop = true;
          if (osTop == 0){
            clearInterval(self.timer);
          }
        },30);
      });
    }
  }

  $.fn.gotop = function(opts) {
    this.each(function(index, elem) {
      new GoTop($(elem), opts);
    })
    return this;
  }
})(jQuery)