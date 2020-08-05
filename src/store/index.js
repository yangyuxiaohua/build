import Vue from 'vue'
import Vuex from 'vuex'
import vuexAlong from 'vuex-along'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userRole: {},
    userInfor: {},
    projectInfor: {},
    contentId:'',
    standardId: {}, // 标准模块
    addProjectSuccessed: '1',
    point:{},
    unitInfo:{}, //用户管理的单位用户信息
    unitStatus:'', // user主页面的增加和修改
    confiflag:'',//单位操作成功的flag
    filterMarkersData:"", //首页筛选的marker的条件
    cindex:null,//首页跳转记住跳转的菜单
    recodeStandard:{} , //记录的4个菜单数据
    factoryType:'',// 单位类型
    ScreeningRecordObj:{}, //记录筛选
  },
  mutations: {
    saveUserRole(state, role) {
      state.userRole = role
    },
    saveUserInfor(state, infor) {
      state.userInfor = infor
    },
    chosedProjectId(state, infor) {  // 切换项目
      state.projectInfor = infor
    },
    saveContentId(state, id) { // 新增项目信息存入
      state.contentId = id
    },
    saveStandardId(state, obj) { // 标准菜单切换
      state.standardId = obj
    },
    addProjectSuccess(state, bool) { //增加项目成功
      // if()
      state.addProjectSuccessed = bool
    },
    // 保存单位坐标
    savePoint(state,point){
      state.point = point
    },
    // 保存单位节点信息
    saveUnitInfo(state,info){
      state.unitInfo = info
    },
    //判断组织结构是点击add还是updata
    changeUnitStatus(state,s){
      state.unitStatus = s
    },
    changeConfiFlag(state,s){ // 改变操作状态
      state.confiflag = s
    },
    filterMarkers(state,obj){
      state.filterMarkersData = obj
    },
    changeCindex(state,i){ //首页跳转变化菜单索引
         state.cindex = i
    },
    saveRecodeStandard(state,obj){ //记录的菜单
          state.recodeStandard = obj
    },
    saveFactoryType(state,str){ //保存单位类型
      state.factoryType = str
    },
    saveScreeningRecordObj(state,obj){ // 筛选记录
      state.ScreeningRecordObj = obj
    }
  },
  actions: {},
  modules: {},
  plugins: [vuexAlong()]
})