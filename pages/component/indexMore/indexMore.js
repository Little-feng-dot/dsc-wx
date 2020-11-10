// pages/component/indexMore/indexMore.js
const app = getApp()
let {
  requestApi
} = require('../../../utils/api')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indexMore: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    indexMoreListData: [],
    page: 1,
    size: 10,
    scrollH: 0,
    noMore: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getIndexMoreData(cid, page, size) {
      wx.showLoading()
      requestApi(app.globalData.base_url + '/catalog/goodslist', {
        cat_id: cid,
        size: size,
        page: page
      }, 'post').then(res => {
        if (res.data.data.length) {
          this.setData({
            indexMoreListData: this.data.indexMoreListData.concat(res.data.data)
          })
        } else {
          console.log('没有数据了~');
          this.setData({
            noMore: true
          })
        }
        wx.hideLoading()
      })
    },
    toBottom() {
      if (!this.data.noMore) {
        let page = this.data.page + 1
        let cid = this.data.cid
        let size = this.data.size
        this.setData({
          page: page
        })
        this.getIndexMoreData(cid, page, size)
      }
    },
    toGoodsDetail(e) {
      let gid = e.currentTarget.dataset.gid
      wx.navigateTo({
        url: '/pages/goodsDetail/goodsDetail?goods_id=' + gid,
      })
    }
  },

  attached() {
    // console.log(this.data);
    this.setData({
      page: 1,
      indexMoreListData: []
    })
    setTimeout(() => {
      this.setData({
        isShow: true,
        cid: ''
      })
    }, 300)
    setTimeout(() => {
      this.setData({
        cid: this.data.indexMore.cid
      })
      let page = this.data.page
      let size = this.data.size
      let cid = this.data.cid
      this.getIndexMoreData(cid, page, size)
    }, 600)
    let scrollH = app.globalData.windowInfo.windowHeight - 75
    this.setData({
      scrollH: scrollH
    })
  }
})