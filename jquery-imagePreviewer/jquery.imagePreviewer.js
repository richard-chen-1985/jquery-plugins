;(function($, document) {

  var defaultSettings = {
    // 预览图片元素
    previewImg: null,
    // 回调函数
    callback: function() {}
  }

  function ImagePreviewer(input, opts) {
    // 接收传入参数
    this.opts = $.extend({}, defaultSettings, opts)
    this.input = $(input)
    // 图片路径
    this.fileSrc = ''
    // 获取图片尺寸的标签
    this.previewSize = $('<img>')

    this.init()
  }
  ImagePreviewer.prototype.init = function(opts) {
    var previewImg = this.opts.previewImg[0]
    var previewSize = this.previewSize[0]
    previewImg.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)'
    previewSize.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image)'
    previewSize.style.visibility = 'hidden'
    this.previewSize.appendTo($('body'))
    this.bindEvents()
  }
  ImagePreviewer.prototype.bindEvents = function() {
    var self = this
    var file = this.input
    var previewSize = this.previewSize
    var cb = self.opts.callback

    file.bind('change', function() {
      // 预览图片
      self.showPreview()
    })
    previewSize.bind('load', function() {
      var img = this
      setTimeout(function() {
        self.callback(img.offsetWidth, img.offsetHeight)
      }, 100)

    })
  }
  ImagePreviewer.prototype.showPreview = function() {
    var self = this
    var file = this.input[0]
    var previewImg = this.opts.previewImg[0]
    var previewSize = this.previewSize[0]

    previewSize.src = ''
    previewSize.style.display = 'block'

    var readByFileReader = function(file, img1, img2) {
      var reader = new FileReader()
      reader.onload = function(ev) {
        img1.src = ev.target.result
        img2.src = ev.target.result
      }
      reader.readAsDataURL(file.files[0])
    }

    var readBySelection = function(file, img1, img2, callback) {
      var fileSrc = ''
      file.select()
      fileSrc = document.selection.createRange().text

      img1.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = fileSrc
      img2.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = fileSrc

      callback(img2.offsetWidth, img2.offsetHeight)
    }

    if(file.files && file.files[0]) {
      readByFileReader(file, previewImg, previewSize)
    } else {
      readBySelection(file, previewImg, previewSize, function(width, height) {
        self.callback(width, height)
      })
    }
  }
  // 图片格式校验
  ImagePreviewer.prototype.isImageFile = function(src) {
    return src.match(/.jpg|.gif|.png|.bmp/i);
  }
  ImagePreviewer.prototype.callback = function(width, height) {
    this.previewSize.css('display', 'none');
    this.opts.callback(width, height)
  }

  $.fn.imagePreviewer = function(opts) {
    $(this).each(function(index, input) {
      new ImagePreviewer(input, opts)
    })
    return this;
  }

})(jQuery, window.document)