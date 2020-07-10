import rq from '../utils/request.js';

// 根据项目主键获取所有验收记录
export const getDocumentByProjectId = params => rq.post('/record/getDocumentByProjectId', params)

// 提交验收记录
export const addRecode = params => rq.post('/record/add', params)

// 批量提交验收记录
export const replacesRecode = params => rq.post('/record/replaces', params,'json')



//验收记录的资料评审接口


// 根据项目主键获取所有 - 资料审查验收记录
export const getRecordsByProjectId = params => rq.post('/record/getRecordsByProjectId', params)

// 更新验收记录
export const updateRecode = params => rq.post('/record/update', params)

// 3.根据项目主键获取所有验收记录
export const getRecordsByProjectId2 = params => rq.post('/record/getRecordsByProjectId2', params)