/**
 * 登录 
 */

import req from '@/utils/request'

// 1登录
export const login = params => req.post('/s_login', params)
// 获取用户详情
export const getUserInfor = params => req.post('/getLoginAccountInfo', params)

// 获取正在使用的角色
export const getCurrentRole = params => req.post('/getCurrentRole', params)

// 获取登录用户详情
export const getLoginAccountInfo = params => req.post('/getLoginAccountInfo', params)

