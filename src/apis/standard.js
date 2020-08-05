import rq from '../utils/request.js';


// 获取验收方式
export const getCategorys = params => rq.post('/standard/category/getCategorys', params)


// 根据验收方式获取最新适用的标准内容
export const getCurrStandardDocument = params => rq.post('/standard/getCurrStandardDocument', params)


//现场评定
// 3.获取现场评定 -> 三级验收项
export const getCurrChecklistById = params => rq.post('/standard/checklist/getCurrChecklistById', params)

// 1.添加一级菜单
export const addPrimaryMenu = params => rq.post('/standard/checklist/addPrimaryMenu', params)

// 1.修改一级菜单
export const updatePrimaryMenu = params => rq.post('/standard/checklist/updatePrimaryMenu', params,'json')

// 1.删除一级菜单
export const deletedPrimaryMenu = params => rq.post('/standard/checklist/deletedPrimaryMenu', params)

// 2.添加二级菜单
export const addSecondaryMenu = params => rq.post('/standard/checklist/addSecondaryMenu', params)

// 2.修改二级菜单
export const updateSecondaryMenu = params => rq.post('/standard/checklist/updateSecondaryMenu', params,'json')

// 2.删除二级菜单
export const deletedSecondaryMenu = params => rq.post('/standard/checklist/deletedSecondaryMenu', params)

// 3.添加三级验收项
export const addChecklist = params => rq.post('/standard/checklist/addChecklist', params)

// 3.更新三级验收项
export const updateChecklist = params => rq.post('/standard/checklist/updateChecklist', params,'json')

// 3.删除三级验收项
export const deletedChecklist = params => rq.post('/standard/checklist/deletedChecklist', params)

// (新)获取标准名称
export const getChecklistStandards = params => rq.post('/record/personnel/getChecklistStandards', params)

// 获取评定规则
export const getStandardRules = params => rq.post('/standard/rules/getStandardRules', params)

// 替换规则
export const replaceStandardRules = params => rq.post('/standard/rules/replace', params)