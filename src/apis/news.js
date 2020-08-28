import rq from '../utils/request.js';

// 查询一批消息
export const pageByCondition = params => rq.post('/notice/pageByCondition', params)

// 删除通知
export const deletedNews = params => rq.post('/notice/deleted', params)

// 消费一条消息
export const getNews = params => rq.post('/notice/get', params)

// 发送通知
export const sendNews = params => rq.post('/notice/send', params,'json')


