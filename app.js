//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    let result = wx.getSystemInfoSync()
    this.globalData.windowInfo = result
    console.log(this.globalData);
    
  },
  globalData: {
    userInfo: null,
    base_url: 'https://x.dscmall.cn/api',
    loadImgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604051667427&di=906e97d072f38d8d8b3768e5d267507f&imgtype=0&src=http%3A%2F%2Fimg.ui.cn%2Fdata%2Ffile%2F7%2F2%2F9%2F1813927.gif',
    windowInfo: ''
  }
})