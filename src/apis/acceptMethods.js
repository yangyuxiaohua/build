import rq from '../utils/request.js';


// 获取验收方式
export const getCategorys = params => rq.post('/standard/category/getCategorys', params)

// 获取一批标准
export const getStandards = params => rq.post('/standard/getStandards', params)

// 根据验收方式获取最新适用的标准内容
export const getCurrStandardDocument = params => rq.post('/standard/getCurrStandardDocument', params)


// 任务指派 -> 获取验收单位列表
export const getAcceptanceFactoryPartsMenuDto = params => rq.post('/project/factory/getAcceptanceFactoryPartsMenuDto', params)

// 统一提交验收项和人员指派
export const submitData = params => rq.post('/record/personnel/submit', params,'json')

// projectId

// 验收单位 -> 现场评定 获取复制状态
export const getCurrCopyStatus = params => rq.post('/record/personnel/getCurrCopyStatus', params,'json')


// // 根据项目获取现场评定内容
// export const getDocumentByProjectId1 = params => rq.post('/record/curr/getDocumentByProjectId', params)

// // 根据项目获取资料审查内容
// export const getDocumentByProjectId2 = params => rq.post('/record/getDocumentByProjectId', params)

// 根据验收方式获取最新适用的标准内容
// export const getDocumentByProjectId1 = params => rq.post('/record/curr/getDocumentByProjectId', params)


// (新)获取标准名称
export const getChecklistStandards2 = params => rq.post('/record/personnel/getChecklistStandardsRules', params,'json')