// pages/creagory/creagory.js
let app = getApp()
let {
  requestApi
} = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    tabIndex: 0,
    categoryData: [],
    categoryRightData: [],
    goId: '',
    heightArr: []
  },
  changeTabIndex(e) {
    let index = e.currentTarget.dataset.tabindex
    this.setData({
      tabIndex: index,
      goId: 'a' + index
    })
  },
  scrollFn(e) {
    let scrollTop = e.detail.scrollTop
    let heightArr = this.data.heightArr

    for (let i = 0; i < heightArr.length; i++) {
      if (scrollTop > 0 && scrollTop > heightArr[i] - heightArr[0] * 2 && scrollTop < heightArr[i + 1] - heightArr[0] * 2) {
        this.setData({
          tabIndex: i
        })
      }
      if (scrollTop > heightArr[heightArr.length - 1] - heightArr[0]) {
        this.setData({
          tabIndex: heightArr.length - 1
        })
      }
    }
  },

  getViewH() {
    let heightArr = []
    for (let i = 0; i < this.data.categoryRightData.length; i++) {
      const query = wx.createSelectorQuery().in(this)

      let id = '#a' + i
      query.select(id).boundingClientRect()
      query.exec(res => {
        let top = res[0].top
        heightArr.push(top)
        this.setData({
          heightArr: heightArr
        })
      })
    }
  },

  toList(e) {
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '/pages/goodslist/goodslist?cid=' + cid,
    })
  },

  async getCategoryData() {
    wx.showLoading({
      title: '加载中...',
    })
    let result = await requestApi(app.globalData.base_url + '/catalog/list')
    this.setData({
      categoryData: result.data.data
    })
    let categoryData = result.data.data
    let categoryRightData = []
    for (let i = 0; i < categoryData.length; i++) {
      let res = await requestApi(app.globalData.base_url + '/catalog/list/' + categoryData[i].cat_id)
      categoryRightData.push(res.data.data)
    }
    if (categoryRightData.length == 0) {
      this.getCategoryData()
    } else {
      this.setData({
        categoryRightData: categoryRightData
      })
      wx.hideLoading()
      this.getViewH()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let height = app.globalData.windowInfo.windowHeight - 46 * (app.globalData.windowInfo.windowWidth / 375)
    this.setData({
      height: height
    })
    this.getCategoryData()
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