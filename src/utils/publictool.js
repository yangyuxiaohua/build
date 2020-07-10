//原生js注册
// export function addEvent(obj, sType, fn) {
//     if (obj.addEventListener) {
//         obj.addEventListener(sType, fn, false);
//     } else {
//         obj.attachEvent('on' + sType, fn);
//     }
// };
// export function removeEvent(obj, sType, fn) {
//     if (obj.removeEventListener) {
//         obj.removeEventListener(sType, fn, false);
//     } else {
//         obj.detachEvent('on' + sType, fn);
//     }
// };
export function prEvent(ev) {
    var oEvent = ev || window.event;
    if (oEvent.preventDefault) {
        oEvent.preventDefault();
    }
    return oEvent;
}
//将数组深度转字符串或转回数组
export function getObjStr(obj) {
    if (typeof obj == 'string') {
        // console.log('字符串')
        return JSON.parse(JSON.parse(new String(JSON.stringify(obj)).toString()))
    } else {
        //    console.log('不是字符串')
        return new String(JSON.stringify(obj)).toString()
    }
}
export function getTime(time) {
    if (time && time != 'null') {
        var strDate = ''
        var date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

        strDate = Y + M + D + h + m + s;
        return strDate;
    } else {
        return
    }

}
// 检验某个字符串是否包含某个字段
export function inDexOfStr(str, s) {
    if (str.indexOf(s) != -1) {
        return true
    } else {
        return false
    }
}

//根据数组对象的某一个属性值将一维数组合并维二维数组
// export function mergeArray(arr, p) {
//     arr.reduce((res, item) => {
//         res[item[p]] ? res[item[p]].push(item) : (res[item[p]] = [item])
//         return res
//     }, {})
// }
// 切割字符串(-)
export function splitStr(str){
     let s = '';
     s = str.split('_')
     return s
}
// 切割字符串(,)
export function splitStr2(str){
     let s = '';
     s = str.split(',')
     return s
}
//时间戳格式化
export function getlTime(time) {
    let str = ''
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    str = `${year}-${month}-${day}`
    return str
}
export function getYMTime(time) {
    let str = ''
    let date = new Date(time)
    // let year = date.getFullYear()
    let month = date.getMonth() + 1
    // let day = date.getDate()
    str = `${month}月`
    return str
}
//将富文内容变为普通文本
export function changeEdit(str) {
    if(!str){
        return ''
    }
   str = str.replace()
   str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str=str.replace(/ /ig,'');//去掉 
            return str
}