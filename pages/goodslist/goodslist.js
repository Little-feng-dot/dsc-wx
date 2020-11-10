// pages/goodslist/goodslist.js
let app = getApp()
let {
  requestApi
} = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsListData: [],
    activeIndex: 0,
    clickFlag: false,
    plFlag: true,
    page: 1,
    cid: '',
    sort: '',
    order: '',
    noMore: false,
    filterTabList: [{
        title: '综合',
        icon: ['icon-xiajiantou', 'icon-shishangjiantou-'],
        order: ['desc', 'asc'],
        sort: 'goods_id',
        iconIndex: 0
      },
      {
        title: '新品',
        icon: '',
        order: ['desc'],
        sort: 'last_update',
        iconIndex: 0
      },
      {
        title: '销量',
        icon: '',
        order: ['desc'],
        sort: 'sales_volume',
        iconIndex: 0
      },
      {
        title: '价格',
        icon: ['icon-xiajiantou', 'icon-shishangjiantou-'],
        order: ['desc', 'asc'],
        sort: 'shop_price',
        iconIndex: 0
      },
      {
        title: '筛选',
        icon: ['icon-shaixuan'],
        order: 'desc',
        sort: 'last_update',
        iconIndex: 0
      },
    ]
  },

  getListData(cat_id = 1131, page = 1, sort = 'goods_id', order = 'desc',
    min = '', max = '', size = 10, ) {
    if (!this.data.noMore) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    return requestApi(app.globalData.base_url + '/catalog/goodslist', {
      cat_id: cat_id,
      page: page,
      sort: sort,
      order: order,
      min: min,
      max: max,
      size: size
    }, 'post')
  },
  changeActive(e) {
    let index = e.currentTarget.dataset.activeindex
    this.setData({
      noMore: false
    })
    if (index == this.data.activeIndex) {
      this.setData({
        clickFlag: !this.data.clickFlag
      })
    } else {
      this.setData({
        clickFlag: false
      })
    }
    if (index == 0) {
      if (!this.data.clickFlag) {
        console.log('第一次点击');
        this.setData({
          "filterTabList[0].iconIndex": 0
        })
      } else {
        console.log('第二次点击');
        this.setData({
          "filterTabList[0].iconIndex": 1
        })
      }
    } else if (index == 3) {
      if (!this.data.clickFlag) {
        console.log('第一次点击');
        this.setData({
          "filterTabList[3].iconIndex": 0
        })
      } else {
        console.log('第二次点击');
        this.setData({
          "filterTabList[3].iconIndex": 1
        })
      }
    }
    let cid = this.data.cid
    let page = 1
    let sort = this.data.filterTabList[index].sort
    let order = this.data.filterTabList[index].order[this.data.filterTabList[index].iconIndex]
    console.log();

    this.setData({
      activeIndex: index,
      page,
      sort,
      order
    })
    this.getListData(cid, page, sort, order).then(res => {
      console.log(res);

      this.setData({
        goodsListData: res.data.data
      })
      wx.hideLoading()
    })

  },
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },
  changePL() {
    this.setData({
      plFlag: !this.data.plFlag
    })
  },
  toGoodsDetail(e) {
    let gid = e.currentTarget.dataset.gid
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?goods_id=' + gid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let cid = options.cid
    this.setData({
      cid: cid
    })
    this.getListData(cid).then(res => {
      this.setData({
        goodsListData: this.data.goodsListData.concat(res.data.data)
      })
      wx.hideLoading()
    })
    console.log(this.data);
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
    this.setData({
      page: this.data.page + 1
    })
    this.getListData(this.data.cid, this.data.page, this.data.sort, this.data.order).then(res => {
      console.log(res);

      if (res.data.data && res.data.data.length != 0) {
        this.setData({
          goodsListData: this.data.goodsListData.concat(res.data.data)
        })
        wx.hideLoading()
      } else {
        console.log('没有数据了');
        this.setData({
          noMore: true
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})