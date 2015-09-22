## jquery-fixable
基于jQuery的位置固定插件，将指定元素固定在页面的某个位置

## 用法
```js
  $('.fixable-1').fixable({
    // window.resize超时时间(毫秒)
    deplay: 50,
    // x轴的位置 [left|center|right]
    x: 'left',
    // y轴的位置 [top|center|bottom]
    y: 'top',
    // x轴的偏移量
    xValue: 50,
    // y轴的偏移量
    yValue: 50,
    // z-index
    zIndex: null
  });
```