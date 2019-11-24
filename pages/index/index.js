//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    my_pic: '',
    ret: '',
    upload_data: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindEventTap: function () {
    wx.navigateTo({
      url: '../events/events',
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPic:function(option){
    wx.navigateTo({
      url: '../cropper/cropper'
    })
  },
  onShow: function () {
    this.setData({
      my_pic: app.globalData.imgSrc
    })
  },
  uploadPic:function(option){
    var that = this
    wx.showLoading({
      title: '上传中…',
    })
    wx.uploadFile({
      url: 'https://sm.ms/api/upload',
      filePath: this.data.my_pic,
      name: 'smfile',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        that.setData({              
          upload_data: res.data
        })
        const RET=JSON.parse(res.data)
        if(RET['success']==false){
          var upload_link=RET['message'].slice(50)       
        }
        else{
          var upload_link=RET['data']['url']
        }
        wx.request({
          url: 'https://ooccrr.cognitiveservices.azure.cn/vision/v2.0/ocr',
          method: 'POST',
          header: { 'Ocp-Apim-Subscription-Key': 'be9db9dddc8c48ebb8c6dd63a439c476' },
          data: { 'url': upload_link, 'language': 'zh-Hans', 'detectOrientation': 'true' },
          dataType: JSON,
          success: function (res) {
            that.setData({
              ret: res.data
            })
            const ANS=JSON.parse(res.data)
            var i;
            var len=ANS['regions'][0]['lines']['length'];
            for(i=0;i<len;i++){
              var j;
              var len2 = ANS['regions'][0]['lines'][i]['words']['length'];
              var s='';
              for(j=0;j<len2;j++){
                s = s + ANS['regions'][0]['lines'][i]['words'][j]['text']               
              }
              if (/^(0?[1-9]|1[0-2])['月']((0?[1-9])|((1|2)[0-9])|30|31)['日']$/.test(s)) {
                app.globalData.time=s;
              }
              else{
                app.globalData.info+=s;
              }
              s=''
            }

            wx.navigateTo({
              url: '../events/events',
            })

          },
          fail: function (res) {
            that.setData({
              ret: 'error'
            })
          }
        })
        wx.hideLoading()
      },
      fail: function (res) {
        that.setData({
          upload_data: 'error'
        })
      }
    })
    app.globalFlag.flag = 1;
    
  },
})
