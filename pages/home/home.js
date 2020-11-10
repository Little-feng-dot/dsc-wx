// pages/home/home.js
const app = getApp()
let {
    requestApi
} = require('../../utils/api')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tablist: [],
        goodsTabList: [{
                title: '精选',
                describe: '为你推荐'
            },
            {
                title: '社区',
                describe: '新奇好物'
            },
            {
                title: '新品',
                describe: '潮流上新'
            },
            {
                title: '热卖',
                describe: '火热爆款'
            }
        ],
        swiperList: [],
        quickNavList: [],
        newList: [],
        timeList: [],
        currentIndex: 0,
        tabIndex: 0,
        oLeft: 0,
        tabIndex2: 0,
        goodsTabListIndex: 0,
        resultTime: {},
        seckill_list: [],
        goodsList: [],
        loadingImg: true,
        loadImgSrc: '',
        page: 1,
        type: 'is_best',
        swiperH: 4600,
        indexMore: []
    },
    changeSwiper(e) {
        this.setData({
            currentIndex: e.detail.current
        })
    },
    changeTab(e) {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })
        this.setData({
            tabIndex: e.detail.current,
            swiperH: 4600,
            page: 1
        })
        if (e.detail.current > 2) {
            this.setData({
                oLeft: ((e.detail.current - 2) * 75) + 45
            })
        } else {
            this.setData({
                oLeft: 0
            })
        }
        if (e.detail.current != 0) {
            this.getGoodsData(this.data.page, this.data.type)
            let cid = this.data.tablist[e.detail.current].cat_id
            this.getIndexMoreData(cid)
            this.setData({
                tabIndex: e.detail.current,
                swiperH: (app.globalData.windowInfo.windowHeight - 75) * 2,
                page: 1
            })
        }
    },
    changeTabClick(e) {
        this.setData({
            tabIndex: e.target.dataset.index
        })
    },
    clickTab(e) {
        let tabIndex = e.currentTarget.dataset.tabindex2
        this.setData({
            tabIndex2: tabIndex
        })
        let gid = this.data.timeList[tabIndex].id
        requestApi(app.globalData.base_url + '/visual/visual_seckill', {
            id: gid
        }).then(res => {
            this.setData({
                seckill_list: res.data.data.seckill_list
            })
        })
    },
    togoodslist(e) {
        let cid = e.currentTarget.dataset.cid
        let index = cid.indexOf('=')
        cid = cid.slice(index + 1)
        wx.navigateTo({
            url: '/pages/goodslist/goodslist?cid=' + cid,
        })
    },
    toGoodsDetail(e) {
        let gid = e.currentTarget.dataset.gid
        wx.navigateTo({
            url: '/pages/goodsDetail/goodsDetail?goods_id=' + gid,
        })
    },
    toCategroy() {
        wx.switchTab({
            url: '/pages/creagory/creagory',
        })
    },
    seckillCountDown() {
        let tabIndex2 = this.data.timeList.findIndex(item => item.status == true)
        setInterval(() => {
            let nowTime = new Date()
            let targetTime = +new Date(this.data.timeList.find(item => item.status == true).frist_end_time)
            let residueTime = targetTime - nowTime
            let hour = parseInt(residueTime / 1000 / 60 / 60 % 24)
            let min = parseInt(residueTime / 1000 / 60 % 60)
            let sec = parseInt(residueTime / 1000 % 60)
            let resultTime = {
                hour: hour < 10 ? '0' + hour : hour,
                min: min < 10 ? '0' + min : min,
                sec: sec < 10 ? '0' + sec : sec
            }
            this.setData({
                resultTime
            })
        }, 1000);
        this.setData({
            tabIndex2
        })
    },
    goodsTabClick(e) {
        this.setData({
            loadingImg: true,
            page: 1,
            swiperH: 4600
        })
        let goodsindex = e.currentTarget.dataset.goodsindex
        this.setData({
            goodsTabListIndex: goodsindex
        })
        switch (goodsindex) {
            case 0:
                this.setData({
                    type: 'is_best'
                })
                break;
            case 2:
                this.setData({
                    type: 'is_new'
                })
                break;
            case 3:
                this.setData({
                    type: 'is_hot'
                })
                break;

        }
        this.getGoodsData(this.data.page, this.data.type)
    },
    getGoodsData(page, type) {
        wx.showLoading({
            title: '拼命加载中...',
            mask: true
        })
        requestApi(app.globalData.base_url + '/goods/type_list', {
            page: page,
            size: 10,
            type: type
        }).then(res => {
            if (this.data.page == 1) {
                this.setData({
                    loadingImg: false,
                    goodsList: res.data.data
                })
            } else {
                this.setData({
                    loadingImg: false,
                    goodsList: this.data.goodsList.concat(res.data.data)
                })
            }
            wx.hideLoading()
        })
    },
    getListData() {
        requestApi(app.globalData.base_url + '/catalog/list').then(res => {
            res.data.data.unshift({
                cat_name: '首页'
            })
            this.setData({
                tablist: res.data.data
            })
        })
    },
    getIndexMoreData(cid) {
        wx.showLoading()
        requestApi(app.globalData.base_url + '/visual/visual_second_category', {
            cat_id: cid
        }).then(res => {
            this.setData({
                indexMore: res.data.data,
                'indexMore.cid': cid
            })
            wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.showLoading({
            title: '拼命加载中',
            mask: true
        })
        let that = this

        that.setData({
            loadImgSrc: app.globalData.loadImgSrc
        })
        requestApi(app.globalData.base_url + '/visual/view', {
            id: 3,
            type: 'index',
            device: 'h5'
        }, 'POST').then(res => {
            let quickNavListdata = JSON.parse(res.data.data.data)[3].data.list
            let quickNavList = []
            for (let i = 0; i < quickNavListdata.length / 10; i++) {
                quickNavList.push(quickNavListdata.splice(0, 10))
            }
            quickNavList.push(quickNavListdata)
            that.setData({
                swiperList: JSON.parse(res.data.data.data)[2].data.list,
                quickNavList: quickNavList
            })
            wx.hideLoading()
        })
        console.log(that.data);
        requestApi(app.globalData.base_url + '/visual/article', {
            cat_id: 20,
            num: 10
        }, "POST").then(res => {
            that.setData({
                newList: res.data.data
            })
        })

        requestApi(app.globalData.base_url + '/visual/visual_seckill').then(res => {
            that.setData({
                timeList: res.data.data.time_list,
                seckill_list: res.data.data.seckill_list
            })
            that.seckillCountDown()
        })

        this.getGoodsData(this.data.page, this.data.type)
        this.getListData()
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
        // wx.startPullDownRefresh({
        //     success:()=>{
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 1000)
        //     }
        // })

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.tabIndex == 0) {
            this.setData({
                page: ++this.data.page,
                swiperH: this.data.swiperH + 490 * 5
            })
            this.getGoodsData(this.data.page, this.data.type)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})