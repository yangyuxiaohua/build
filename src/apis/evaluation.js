import rq from '../utils/request.js';

// 根据项目主键获取所有验收记录
export const getRecordsByProjectId = params => rq.post('/record/curr/getRecordsByProjectId', params)

// 更新验收记录
export const updateRecode = params => rq.post('/record/curr/update', params)

// Pc 获取上传验收文件地址信息
export const getUploadsByChecklistId = params => rq.post('/getUploadsByChecklistId', params)

//ip地址
// export const IP = "http://192.168.0.200:2225/image?url="
export const IP = "http://39.104.90.111:2225/image?url="
// /record/curr/getRecordsByProjectId2
// 3.根据项目主键获取所有验收记录
export const getRecordsByProjectId2 = params => rq.post('/record/curr/getRecordsByProjectId2', params)

// 1.根据项目主键获取所有一级菜单
export const getRecordsByProjectIdGroup1 = params => rq.post('/record/curr/getRecordsByProjectIdGroup1', params)

// 1.根据项目主键获取所有二级菜单
export const getRecordsByProjectIdGroup2 = params => rq.post('/record/curr/getRecordsByProjectIdGroup2', params)


// 3.根据项目主键获取所有验收记录(竣工查验和消防检测)
export const getRecordsByProjectId3 = params => rq.post('/record/curr/getRecordsByProjectId3', params)