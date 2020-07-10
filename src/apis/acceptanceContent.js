import rq from '../utils/request.js';


// 验收内容 -> 添加
export const addAc1 = params => rq.post('/ac1/add', params)


// deleted
export const deletedAc1 = params => rq.post('/ac1/deleted', params)

// update
export const updateAc1 = params => rq.post('/ac1/update', params)
// 验收内容 -> 添加
export const addAc2 = params => rq.post('/ac2/add', params)


// deleted
export const deletedAc2 = params => rq.post('/ac2/deleted', params)

// update
export const updateAc2 = params => rq.post('/ac2/update', params)
// 验收内容 -> 添加
export const addAc3 = params => rq.post('/ac3/add', params)


// deleted
export const deletedAc3 = params => rq.post('/ac3/deleted', params)

// update
export const updateAc3 = params => rq.post('/ac3/update', params)
// 验收内容 -> 添加
export const addAc4 = params => rq.post('/ac4/add', params)


// deleted
export const deletedAc4 = params => rq.post('/ac4/deleted', params)

// update
export const updateAc4 = params => rq.post('/ac4/update', params)
// 验收内容 -> 添加
export const addAc5 = params => rq.post('/ac5/add', params)


// deleted
export const deletedAc5 = params => rq.post('/ac5/deleted', params)

// update
export const updateAc5 = params => rq.post('/ac5/update', params)
// 验收内容 -> 添加
export const addAc6 = params => rq.post('/ac6/add', params)


// deleted
export const deletedAc6 = params => rq.post('/ac6/deleted', params)

// update
export const updateAc6 = params => rq.post('/ac6/update', params)

// 获取 验收内容； 单体建筑 - 结构类型
export const getConsTypes = params => rq.post('/dictionary/getAc_1_jie_gou_type', params)

// 获取 验收内容；单体建筑 - 耐火等级
export const getFireTypes = params => rq.post('/dictionary/getAc_1_nai_huo_level', params)

// 获取 验收内容； 储罐 - 设置型式
export const getSetTypes = params => rq.post('/dictionary/getAc_2_setting_type', params)

// 获取 验收内容； 储罐 - 存储形式
export const getSaveTypes = params => rq.post('/dictionary/getAc_2_storage_type', params)

// 获取 验收内容； 建筑保温 - 材料类别
export const getMaterialTypes = params => rq.post('/dictionary/getAc_4_m_type', params)

// 获取 验收内容； 装修工程 - 装修部位
export const getPartTypes = params => rq.post('/dictionary/getAc_5_parts', params)

// 获取 验收内容； 用途改变 - 使用性质
export const getUseTypes = params => rq.post('/dictionary/getAc_6_usages', params)

// 验收内容(回填6大类)
export const getAcceptInfor = params => rq.post('/ac/get', params)

// 验收单位 -> 获取消防设施一级菜单
export const getMenus = params => rq.post('/ac/getMenus', params)

// 验收单位 -> 提交一级菜单(必传 projectId , standardPrimaryTitleId , standardId, menuLevel = 1)
export const replaceMenus = params => rq.post('/ac/replace', params,'json')

