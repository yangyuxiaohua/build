import rq from '../utils/request.js';

// 查询一批政策法规
export const pageByCondition = params => rq.post('/tips/policies/pageByCondition', params)

// 删除政策法规
export const deletedLaw = params => rq.post('/tips/policies/deleted', params)

// 添加政策法规
export const addLaw = params => rq.post('/tips/policies/add', params)

// 修改政策法规
export const updateLaws = params => rq.post('/tips/policies/update', params)

