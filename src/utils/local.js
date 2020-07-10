
/**
 * 对于本地存储操作的封装
 */
export function getSid() {
  return sessionStorage.getItem('sid')
}
export function getKey(Infor) {
  return JSON.parse(sessionStorage.getItem(Infor))
}

export function setKey(key,value) {
  sessionStorage.setItem(key,JSON.stringify(value)) 
}

export function removeKey(key) {
  return sessionStorage.removeItem(key)
}


