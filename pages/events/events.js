// pages/events/events.js
var time=require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    date: '',
    events: []
  },

  moreClick: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    console.log('位置：' + index);
    var id = this.data.events[index].id;
    var time = this.data.events[index].time;
    var location = this.data.events[index].location;
    var info = this.data.events[index].info;
    wx.showModal({
      'content': '详情：'+ info,
      'cancelColor': '#0076FF',
      'confirmColor': '#0076FF',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
        else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    /*
    wx.navigateTo({
      url: '../one_event/one_event?id='+this.data.events[index].id,
    })
    */
  },

  addnew: function(intime, inloc, ininfo){
    let that = this;
    let events = this.data.events;
    let newevents = [];
    var lastid = 0;
    for (var i in events) {
      var item = events[i];
      if (item.id >= lastid) {
        lastid = item.id;
      }
      newevents.push(item);
    } 
    let id = lastid - 1 + 2;
    
    newevents.push({
      "id":id,
      "time":intime,
      "location":inloc,
      "info":ininfo
    });
    this.setData({
      events: newevents
    })
  },

  delClick: function (e) {
    let that = this;
    console.log(e);
    let deldeid = e.currentTarget.dataset.id;
    let events = that.data.events;
    let newevents = [];
    for (var i in events) {
      var item = events[i];
      if (item.id != deldeid) {
        newevents.push(item);
      }
    }
    console.log(newevents)
    wx.showModal({
      'content': '确认删除该地址信息吗？',
      'cancelColor': '#0076FF',
      'confirmColor': '#0076FF',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            events: newevents
          })
        }
        else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      events: app.globalData.events
    })
    if(app.globalFlag.flag==1){
      let time = app.globalData.time;
      let info = app.globalData.info;
      this.addnew(time, 'nanjing', info)
    }
    app.globalFlag.flag = 0;
    app.globalData.time=0;
    app.globalData.info='';
  },



/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {
  app.globalData.events = this.data.events;
}
})