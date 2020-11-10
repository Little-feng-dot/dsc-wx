function requestApi (url,params={},methoud='get'){
  return new Promise((resolve,reject)=>{
   wx.request({
     url: url,
     data:params,
     method:methoud,
     success:res=>{
       if(res.statusCode==200){
        resolve(res)
       }
     },
     fail:err=>{
      reject(err)
     }
   })
  })
}
module.exports={
  requestApi
}