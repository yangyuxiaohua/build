import rq from '../utils/request.js';

// 根据验收方式获取最新适用的标准内容
export const getPcStatisticalDto = params => rq.post('/statistical/getPcStatisticalDto', params)

// 按照条件搜索项目
export const getProjects = params => rq.post('/project/getProjects', params)

// 获取所有项目区域
export const getProjectsRegion = params => rq.post('/statistical/getProjectsRegion', params)

// 统计4项
export const getPcProjectsStatisticalDto = params => rq.post('/statistical/getPcProjectsStatisticalDto', params)

// 建设单位 6 类操作指引
export const get6ConstructionProcess = params => rq.post('/statistical/get6ConstructionProcess', params)
