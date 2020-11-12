// pages/cart/cart.js
let app = getApp()
let {
  requestApi
} = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noCart: true,
    cartData: [],
    checkedAll: true,
    total: {},
    startPageX: 0,
    x: 0,
    touchid: 0,
    touchindex: 0,
    goodsGuessData: [],
    noMore: false,
    page: 1
  },
  setStorage() {
    this.total()
    wx.setStorageSync('cart', this.data.cartData)
  },
  total() {
    let totalPrice = 0
    let totalNum = 0
    let cartData = this.data.cartData
    cartData.forEach(item => {
      item.goods.forEach(item => {
        if (item.selected) {
          totalNum += item.goods_num
          totalPrice += item.goods_num * item.goods_price
        }
      })
    })
    wx.setStorageSync('totalNum', totalNum)
    let total = {
      totalPrice,
      totalNum
    }
    this.setData({
      total: total
    })
  },
  checkedAll() {
    this.setData({
      checkedAll: !this.data.checkedAll
    })
    let checkedAll = this.data.checkedAll
    let cartData = this.data.cartData
    cartData.forEach(item => {
      item.selected = checkedAll
      item.goods.forEach(item => {
        item.selected = checkedAll
      })
    })
    this.setData({
      cartData: cartData
    })
    this.setStorage()
  },
  checkGood(e) {
    let index = e.currentTarget.dataset.index
    let store = e.currentTarget.dataset.store
    let cartData = this.data.cartData
    let checkedAll = this.data.checkAll
    cartData.forEach(item => {
      if (item.basic_id == store) {
        item.goods[index].selected = !item.goods[index].selected
        item.selected = !item.goods.some(item => item.selected == false)
      }
    })
    checkedAll = !cartData.some(item => item.selected == false)
    this.setData({
      cartData: cartData,
      checkedAll: checkedAll
    })
    this.setStorage()
  },
  checkStore(e) {
    let index = e.currentTarget.dataset.index
    let cartData = this.data.cartData
    let checkedAll = this.data.checkAll
    cartData[index].selected = !cartData[index].selected
    cartData[index].goods.forEach(item => {
      item.selected = cartData[index].selected
    })
    checkedAll = !cartData.some(item => item.selected == false)
    this.setData({
      cartData: cartData,
      checkedAll: checkedAll
    })
    this.setStorage()
  },
  changeCartNum(e) {
    let index = e.currentTarget.dataset.index
    let store = e.currentTarget.dataset.store
    let cartnum = Number(e.currentTarget.dataset.cartnum)
    let cartData = this.data.cartData
    cartData.forEach(item => {
      if (item.basic_id == store) {
        item.goods[index].goods_num += cartnum
        if (item.goods[index].goods_num <= 1) {
          item.goods[index].goods_num = 1
        }
      }
    })
    this.setData({
      cartData: cartData
    })
    this.setStorage()
  },
  dele(e) {
    wx.showModal({
      title: '提示',
      content: '亲,您确定要删除改宝贝么!',
      success: (res) => {
        if (res.confirm) {
          let cartData = this.data.cartData
          let goodindex = e.currentTarget.dataset.index
          let store = e.currentTarget.dataset.store
          cartData.forEach((item, index) => {
            if (item.basic_id == store) {
              item.goods.splice(goodindex, 1)
            }
            if (item.goods.length == 0) {
              cartData.splice(index, 1)
            }
          })
          this.setData({
            cartData: cartData
          }, () => {
            if (this.data.cartData.length == 0) {
              this.setData({
                noCart: true
              })
            }
          })
          this.setStorage()
        } else if (res.cancel) {
          this.setData({
            x: 0
          })
        }
      }
    })

  },


  // 触摸开始
  startFn(e) {
    var index = e.currentTarget.dataset.index
    let store = e.currentTarget.dataset.store
    this.setData({
      touchid: store,
      touchindex: index
    })
    var startPageX = e.touches[0].pageX
    this.setData({
      startPageX: startPageX
    })
  },
  //触摸结束
  endFn(e) {
    var endPageX = e.changedTouches[0].pageX;
    var startPageX = this.data.startPageX
    var x = startPageX - endPageX
    //向左拖动
    if (startPageX > endPageX) {
      if (x > 20) {
        this.setData({
          x: -90
        })
      } else {
        this.setData({
          x: 0
        })
      }
    } else if (startPageX < endPageX) {
      if (-x > 20) {
        this.setData({
          x: 0
        })
      } else {
        this.setData({
          x: -90
        })
      }
    }
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
    this.getGoodsGuessData()
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
    let cartData = wx.getStorageSync('cart')
    let checkedAll = !cartData.some(item => item.selected == false)
    this.setData({
      noCart: !wx.getStorageSync('cart') || wx.getStorageSync('cart').length == 0,
      cartData: cartData,
      checkedAll: checkedAll,
      winW: wx.getSystemInfoSync().windowWidth
    })
    this.total()
    console.log(this.data);
  },

  toGoodsDetail(e) {
    let gid = e.currentTarget.dataset.gid
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goods_id=' + gid,
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
    let page = this.data.page + 1
    this.setData({
      page: page
    })
    this.getGoodsGuessData(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})