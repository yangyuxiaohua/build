/**
 * 通用的请求axios  --- 工具函数层
 * 2019-10-22 by 小貂蝉
 */

// 引入库
import axios from 'axios'
import qs from 'qs'

// 引入本地存储工具函数
import {
    getSid
} from "@/utils/local";

// 按需引入组件
import {
    Message
} from 'element-ui'
// import { setSid } from './local';

// 设置默认请求的接口地址
// axios.defaults.baseURL = 'http://192.168.0.200:2225'
// axios.defaults.baseURL = 'http://39.104.90.111:2225'
axios.defaults.baseURL = 'http://172.16.2.99:2225'
// axios.defaults.baseURL = 'http://192.168.0.19:2221'
// axios.defaults.baseURL = 'http://192.168.0.19:3221'
axios.defaults.timeout = 6000

// axios.defaults.withCredentials=true  //请求跨域的时候是否需要凭证
// 请求拦截器
axios.interceptors.request.use(config => {
    // 所有的axios请求，在请求发送出去之前 带上sid
    if (sessionStorage.sid) {
        config.headers['sid'] = getSid() // 让每个请求携带自定义
    }
    //   console.log('请求拦截器',config)
    return config
}, error => {
    return Promise.reject(error); // 请求错误处理
})

// 响应拦截器
axios.interceptors.response.use(response => {
    // console.log('返回的错误',response.data)
    // if (response.data.httpStatus == 417) {
    //     console.log('重复')
    //     // this.$message({
    //     //     type: 'warning',
    //     //     Message: response.data.msg
    //     // })
    // } else if (response.data.httpStatus == 403) {
    //     this.$router.history.push('*')
    // } else if (response.data.httpStatus == 500) {
    //     Message.error("网络请求发生错误，请稍后再试")
    // }
    return response;

}, error => {
    // console.log('异常',error)
    return Promise.reject(error); // 响应错误处理
});


// 导出两个方法
export default {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                    params
                })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    post(url, params = {}, type) {
        if (type == 'json') {
            axios.defaults.headers = {
                'Content-type': 'application/json' //设置请求参数格式
            }
            return new Promise((resolve, reject) => {
                axios.post(url, params, type)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })

        } else {
            axios.defaults.headers = {
                'Content-type': 'application/x-www-form-urlencoded' //设置请求参数格式
            }
            return new Promise((resolve, reject) => {
                axios.post(url, qs.stringify(params), type)
                    .then(res => {
                        resolve(res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    }
}