// pages/index/index.js
var uploadAliyunOss = require('../../utils/uploadAliyunOss')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: []
    },
    // 选择照片
    chooseImg(){
        // 文档地址-https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html
        let that = this
        wx.chooseMedia({
          count:1,
          mediaType:['image'],
          success(res){
              console.log('上传成功',res)
              
              let tempFilePath = res.tempFiles[0]['tempFilePath']
              that.uploadImage(tempFilePath)
          }
        })
    },
    // 上传照片
    uploadImage(tempFilePath) {
        let that = this
  
        uploadAliyunOss.upload_image(tempFilePath, 'lich').then(res => {
            if (res != false) {
                const { fileList = []  } = this.data;
                fileList.push({
                    ...file,
                    url: res
                });
                that.setData({
                    fileList
                });
            } else {
                wx.showToast({
                    title: '上传失败,请重试!',
                    success: 'none',
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
