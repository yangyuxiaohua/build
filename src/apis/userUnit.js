import rq from '../utils/request.js';
// 添加单位
export const addFactory = params => rq.post('/project/factory/add', params)
// 分页查询单位
export const pageFactory = params => rq.post('/project/factory/pageFactory', params)

// 删除单位
export const deletedFactory = params => rq.post('/project/factory/deleted', params)

// 修改单位
export const updateFactory = params => rq.post('/project/factory/update', params)

// 添加验收单位管理员
export const addAcceptanceMasterUser = params => rq.post('/user/addAcceptanceMasterUser', params)

// 添加验收人员
export const addAcceptanceUser = params => rq.post('/user/addAcceptanceUser', params)

// 添加人员
export const addUser = params => rq.post('/user/addUser', params,'json')

// 添加建设单位管理员
export const addConstructionMasterUser = params => rq.post('/user/addConstructionMasterUser', params)

// 分页查询用户列表
export const pageUser = params => rq.post('/user/pageUser', params)

// 删除一个用户
export const deletedUser = params => rq.post('/user/deletedUser', params)

// 修改密码
export const updateUser = params => rq.post('/user/updateUser', params)
//==========================================================================

// 修改人员及部门权限信息
export const updateUserAndParts = params => rq.post('/user/updateUserAndParts', params,'json')

// 获取单位列表 (单位 + 部门)

export const getFactoryMenus = params => rq.post('/project/factory2/getFactoryMenus', params)

// 添加部门
export const addPart = params => rq.post('/project/factory/part/add', params)

// 删除部门
export const deletedPart = params => rq.post('/project/factory/part/deleted', params)

// 修改部门
export const updatedPart = params => rq.post('/project/factory/part/update', params)

// 查询部门所属单位信息
export const getFactoryByPartsId = params => rq.post('/project/factory/part/getFactoryByPartsId', params)