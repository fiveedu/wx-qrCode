var QR = require("../utils/qrcode.js"); //前端自己生成二维码的js插件
//qrcode.js下载地址：https://github.com/davidshimjs/qrcodejs
Page({
  data: {
    qrCodeImg: 'www.baidu.com', //要生成的二维码图片链接
    qrCodeImgs: '', //二维码图片路径
    modalDisplay: false, //是否显示遮罩
    canvasWidth: '', //画布宽度
    canvasHeight: '', //画布高度
  },

  /**生命周期函数--监听页面初次渲染完成*/
  onReady: function() {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        let scrollHeight = res.windowHeight - 233 - 43;
        let ratio = 750 / res.windowWidth;
        that.setData({
          scrollHeight: scrollHeight,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          ratio: ratio,
          ercode_canvasWidth: 98 / ratio,
          ercode_canvasHeight: 98 / ratio,
          canvasWidth: 375 / ratio,
          canvasHeight: 375 / ratio,
          canvasWidth_y: 50 / ratio
        });
      }
    });
  },

  //分享按钮
  showQrcode: function() {
    console.log("点击了分享,分享链接", this.data.qrCodeImg)
    wx.showLoading({
      title: '分享图片生成中...',
      icon: 'loading'
    })
    this.setData({
      modalDisplay: true,
      qrCodeImgs: ''
    })
    var size = this.setCanvasSize(); //动态设置画布大小
    var qrUrl = this.data.qrCodeImg;
    if (qrUrl !== '') {
      this.createQrCode(qrUrl, "myCanvas", size.w, size.h);
    }
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function() {
    var size = {};
    try {
      size.w = this.data.ercode_canvasWidth;
      size.h = this.data.ercode_canvasHeight;
    } catch (e) {
      //console.log("获取设备信息失败" + e);
    }
    return size;
  },

  //生成二维码
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    /**
     * @url: 二维码地址（必填）
     * @canvasId： canvas的唯一标示符（必填）
     * @cavW: 宽度（必填）
     * @cavH: 高度（必填）
     * @qrCodestyle: 二维码样式选项 （可选参数）
     *    forecolor: 前景色 (16进制)
     *    foreground: 背景色 (16进制)
     */
    let qrCodestyle = {
      forecolor: '#ffffff',
      foreground: '#0076bf'
    }
    QR.api.draw(url, canvasId, cavW, cavH, qrCodestyle);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },

  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          qrCodeImgs: tempFilePath //二维码图片
        });
        wx.hideLoading()
      },
      fail: function(res) {
        //console.log(res);
      }
    });
  },


  //保存图片
  savePic: function() {
    console.log('点击了分享')
    let that = this;
    //console.log("保存图片,大画布", that.data.postUrl)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.qrCodeImgs,
      success: function(data) {
        wx.showToast({
          title: '图片保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  //关闭
  closeRejectModal: function() {
    this.setData({
      modalDisplay: false
    })
  }
})