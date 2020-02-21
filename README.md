# wx-qrCode
小程序分享动态生成二维码基础组件

## 原理
利用qrcode.js 调用插件中的draw方法，绘制二维码图片
利用小程序canvas组件绘制
利用wx.canvasToTempFilePath()获取临时缓存照片路径，存入data中
利用wx.saveImageToPhotosAlbum()保存图片到本地(此方法会调起用户授权

## 基础组件
此demo为基础组件，原理相同，可在此方法二次封装扩展业务组件
