import rq from '../utils/request.js';


// 获取验收单位所有项目
export const getProjectsSites = params => rq.post('/statistical/getProjectsSites', params)

// 根据项目主键获取项目全部信息
export const getProjectInfo = params => rq.post('/project/info/get', params)

// 获取指定项目一级菜单合格情况
export const getXianCHangPingDingDocStatisticalByProjectId = params => rq.post('/statistical/getXianCHangPingDingDocStatisticalByProjectId', params)

