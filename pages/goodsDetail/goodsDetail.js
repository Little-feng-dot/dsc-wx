// pages/goodsDetaul/goodsDetaul.js
let app = getApp()
let {
  requestApi
} = require('../../utils/api')
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    width: 0,
    navbarList: ['商品', '详情', '推荐', '评论'],
    activeIndex: 0,
    opacity: 0,
    goodsInfo: {},
    detailFlag: "true",
    brStyle: {
      width: "100%",
      height: "20rpx",
      background: "#efefef"
    },
    goodsGuessData: [],
    page: 1,
    noMore: false,
    goId: 'a0'
  },
  changeActive(e) {
    let index = e.currentTarget.dataset.index
    if (index != 3) {
      let goId = "a" + index
      this.setData({
        goId: goId
      })
    }
    if (index == 3) {
      let goods_id = this.data.goodsInfo.goods_id
      wx.navigateTo({
        url: '../comment/comment?goods_id=' + goods_id,
      })
    }
    this.setData({
      activeIndex: index
    })
  },
  changeDetailTab(e) {
    let flag = e.currentTarget.dataset.flag
    this.setData({
      detailFlag: flag
    })
  },
  toBottom() {
    let page = this.data.page + 1
    this.setData({
      page: page
    })
    this.getGoodsGuessData(page)
  },
  changeScroll(e) {
    let top = e.detail.scrollTop
    let opacity = top / 200
    if (opacity >= 1) {
      opacity = 1
    }
    if (top <= 50) {
      opacity = 0
    }
    this.setData({
      opacity: opacity
    })
  },
  toGoodsDetail(e) {
    let gid = e.currentTarget.dataset.gid
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?goods_id=' + gid,
    })
  },
  async getGoodsInfo(goods_id = 1153) {
    wx.showLoading({
      title: '加载中...',
    })
    let result = await requestApi(app.globalData.base_url + '/goods/show', {
      goods_id: goods_id
    }, 'post')
    this.setData({
      goodsInfo: result.data.data
    })
    WxParse.wxParse('article', 'html', result.data.data.goods_desc, this, 5);
    wx.hideLoading()
  },
  async getGoodsGuessData(page = 1, size = 10) {
    if (this.data.page != 1 && !this.data.noMore) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    let result = await requestApi(app.globalData.base_url + '/goods/goodsguess', {
      page: page,
      size: size
    }, 'post')
    if (result.data.data.length != 0) {
      this.setData({
        goodsGuessData: this.data.goodsGuessData.concat(result.data.data)
      })
      if (this.data.page != 1) {
        wx.hideLoading()
      }
    } else {
      this.setData({
        noMore: true
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goods_id = options.goods_id
    this.getGoodsInfo(goods_id)
    console.log(this.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let height = app.globalData.windowInfo.windowHeight
    let width = app.globalData.windowInfo.windowWidth
    this.setData({
      height: height,
      width: width
    })
    this.getGoodsGuessData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})