// 对uni.request二次封装
import store from '@/vuex/store.js'
import context from '@/main.js'
import { isTokenExpired } from '@/common/utils.js'
export function request({api, method = "POST", params, header = {} }) {
	//判断时间是否超过55分钟
		return new Promise((resolve, reject) => {
			let objToken = store.state.objToken
			if(objToken && objToken.access_token){
				header.Authorization = objToken.token_type + ' ' + objToken.access_token
			}
			let url = context.$baseUrl + api
			uni.request({
				url,
				data:params,
				method,
				header,
				success: res => {
					isTokenExpired()
					if(res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
						resolve(res)
					}else if(res.statusCode === 401){
						if(store.state.userInfo && store.state.userInfo.id){
							uni.clearStorageSync()
							store.commit('clearUserInfo')
							uni.navigateTo({
								url:'/pages/login/index'
							})
						}
					}else {
							reject(res)
					}
				}
			})
		})
}
// 'Content-Type': 'application/json; charset=utf-8'
// 'Content-Type':'application/x-www-form-urlencoded'
// 'Content-Type': 'multipart/form-data'