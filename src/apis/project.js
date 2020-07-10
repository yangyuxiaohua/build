import rq from '../utils/request.js';

// 获取验收单位所有项目
export const getProjectsByAcceptanceFactoryId = params => rq.post('/project/getProjectsByAcceptanceFactoryId', params)

// 获取建设单位所有项目
export const getProjectsByConstructionFactoryId = params => rq.post('/project/getProjectsByConstructionFactoryId', params)


// 获取项目基本信息
export const getProjectInfor = params => rq.post('/project/info/get', params)

// 获取三级联动地理区域
export const getRegions = params => rq.post('/project/info/getRegions', params)


// 建设单位管理员添加项目
export const addProject = params => rq.post('/project/add', params)

//basic

// 获取 项目->基本信息界面中需要的(工程类别)
export const getEngineering = params => rq.post('/dictionary/getEngineering', params)
// 获取 项目->基本信息界面中需要的(火灾危险性)
export const getFire = params => rq.post('/dictionary/getFire', params)
// 获取 项目->基本信息界面中需要的(使用性质)
export const getUsed = params => rq.post('/dictionary/getUsed', params)

// 添加项目基本信息
export const addProjectInfor = params => rq.post('/project/info/add', params)

// 添加项目基本信息 -> 使用性质
export const addUsages = params => rq.post('/project/info/addUsages', params)

// 更新项目基本信息
export const updateProject = params => rq.post('/project/info/update', params)

// 分页查询单位
export const pageFactory = params => rq.post('/project/factory/pageFactory', params)

// 查询建设单位
export const getConstructionFactorys = params => rq.post('/project/factory/getConstructionFactorys', params)


// 创建项目 + 项目基本信息 + 使用性质

export const addProject2 = params => rq.post('/project/add2', params)


// 获取验收单位列表 (单位 + (特殊的部门) 单位)
export const getAcceptanceFactorys = params => rq.post('/project/factory/getAcceptanceFactorys', params)
