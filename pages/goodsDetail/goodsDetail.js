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
    goId: 'a0',
    showMask: false,
    showCart: false,
    cartNum: 1,
    totalNum: 0
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
  changeCartNum(e) {
    let num = Number(e.currentTarget.dataset.cartnum)
    let cartNum = this.data.cartNum + num
    if (cartNum <= 1) {
      cartNum = 1
    }
    this.setData({
      cartNum: cartNum
    })
  },
  addCart() {
    let cartData = wx.getStorageSync('cart') || []
    let goodsInfo = this.data.goodsInfo
    let basic_info = goodsInfo.basic_info
    let cartNum = this.data.cartNum
    let basic = {
      basic_id: basic_info.id,
      basic_name: basic_info.shop_name,
      selected: true,
      goods: []
    }
    let good = {
      goods_id: goodsInfo.goods_id,
      goods_name: goodsInfo.goods_name,
      goods_price: goodsInfo.shop_price,
      selected: true,
      img: goodsInfo.gallery_list[0].img_url,
      goods_num: cartNum
    }
    if (cartData.length == 0) {
      basic.goods.push(good)
      cartData.unshift(basic)
    } else {
      var index = cartData.map((item, index) => {
        if (item.basic_id == basic_info.id) {
          return index
        }
      })
      if (index[0] != undefined) {
        let basicIndex = index[0]
        let indexArr = cartData[basicIndex].goods.map((item, index) => {
          if (item.goods_id == good.goods_id) {
            return index
          }
        })
        if (indexArr[0] != undefined) {
          let goodIndex = indexArr[0]
          cartData[basicIndex].goods[goodIndex].goods_num += cartNum
        } else {
          cartData[basicIndex].goods.push(good)
        }
      } else {
        basic.goods.push(good)
        cartData.unshift(basic)
      }
    }
    wx.setStorageSync('cart', cartData)
    let totalNum = wx.getStorageSync('totalNum') + 1
    wx.setStorageSync('totalNum', totalNum)
    wx.showToast({
      title: '加入购物车',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      totalNum: totalNum
    })
  },
  showCart() {
    this.setData({
      showMask: true,
      showCart: true
    })
  },
  closeMask() {
    this.setData({
      showMask: false,
      showCart: false
    })
  },
  toGoodsDetail(e) {
    let gid = e.currentTarget.dataset.gid
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?goods_id=' + gid,
    })
  },
  toCart() {
    wx.switchTab({
      url: '/pages/cart/cart',
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
    this.setData({
      totalNum: wx.getStorageSync('totalNum')
    })
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