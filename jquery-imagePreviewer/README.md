## jquery-imagePreviewer
基于jQuery的本地图片预览插件，支持获取图片尺寸

## 用法
```js
  $('#file1').imagePreviewer({
    // 预览图片元素
    previewImg: $('#imghead'),
    // 图片加载成功的回调函数，两个参数分别为图片的宽和高
    callback: function(width, height) {
      console.log(width, height)
    }
  })
```