// pages/comment/comment.js
let app = getApp()
let {
  requestApi
} = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brStyle: {
      width: "100%",
      height: "20rpx",
      background: "#efefef"
    },
    commentData: [],
    commentTitle: {},
    active: 0,
    goods_id: 1153,
    page: 1,
    noData: false
  },
  async getCommentData(goods_id = 1153, rank = 'all', page = 1, size = 10) {
    this.setData({
      page: 1,
      noData: false
    })
    let result = await requestApi(app.globalData.base_url + '/comment/goods', {
      goods_id,
      rank,
      page,
      size
    }, 'post')
    console.log(result);
    if (result.data.data.length != 0) {
      var rankArr = []
      result.data.data.forEach(item => {
        for (let i = 0; i < item.rank; i++) {
          rankArr.push('1')
        }
        item.rankArr = rankArr
      })

      if (this.data.page == 1) {
        this.setData({
          commentData: result.data.data
        })
      } else {
        this.setData({
          commentData: this.data.commentData.concat(result.data.data)
        })
      }

      console.log(result.data.data);
    } else {
      this.setData({
        noData: true
      })
    }

  },

  async getCommentTitle(goods_id = 1153) {
    let result = await requestApi(app.globalData.base_url + '/comment/title', {
      goods_id
    }, 'post')
    console.log(result);

    this.setData({
      commentTitle: result.data.data
    })
  },

  changeActive(e) {
    let index = e.currentTarget.dataset.index
    let rank = e.currentTarget.dataset.rank
    let goods_id = this.data.goods_id
    let page = this.data.page
    this.setData({
      active: index
    })
    this.getCommentData(goods_id, rank, page)
  },
  back() {
    let goods_id = this.data.goods_id
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goods_id' + goods_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goods_id = options.goods_id
    this.getCommentData(goods_id)
    this.getCommentTitle(goods_id)
    this.setData({
      goods_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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