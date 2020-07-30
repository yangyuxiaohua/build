<template>
  <div id="AcceptTaskWrapper">
    <div class="left">
      <div class="tit">
        <div class="titText">
          <img src="../../assets/imgs/index/xiangmu.png" alt="">
          <span>任务安排</span>
        </div>
      </div>
      <el-divider></el-divider>
      <el-input placeholder="请输入" v-model="projectSearch">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick"></i>
      </el-input>
      <div class="projectList">
        <div class="c409eff">已分配：</div>
        <p v-for="(item) in projectList" :key="item.projectId" @click="clickProject(item)" :class="{chosedProjectClass:chosedProjectIdNum==item.projectId}">{{item.projectName}}</p>
        <el-divider></el-divider>
        <div class="c409eff">未分配：</div>
        <p v-for="(item,index) in projectList2" :key="index" @click="clickProject(item)" :class="{chosedProjectClass:chosedProjectIdNum==item.projectId}">{{item.projectName}}</p>
      </div>

    </div>
    <div class="right">
      <!-- <div class="rightNav">
        <span :class="{c409eff:cindex==item.id}" @click="clickRightNav(item.id,item.path)" v-for="item in rightNav" :key="item.id" v-show="item.roleShow4">{{item.text}}</span>
      </div> -->
      <!-- <div class="rightContainer"> -->
      <router-view></router-view>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { inDexOfStr } from "../../utils/publictool.js";
// import {
//   getProjectsByAcceptanceFactoryId,
//   getProjectsByConstructionFactoryId
// } from "@/apis/project.js";
import { getProjects } from "@/apis/home.js";

export default {
  data() {
    return {
      projectSearch: "",
      cindex: 1,
      // rightNav: [
      //   { id: 1, path: "", text: "资料审查",roleShow4:true },
      //   { id: 2, path: "", text: "竣工查验",roleShow4:true },
      //   { id: 3, path: "", text: "消防检测",roleShow4:true },
      //   { id: 4, path: "", text: "现场评定",roleShow4:true }
      //   // { id: 3, path: "/index/project/taskArrangement", text: "任务安排",roleShow4:true }
      // ],
      projectList: [], // 项目列表
      projectList2:[],//为分配任务项目
      // dialogProjectFormVisible: false,
      // addProjectForm: {}, //新增项目
      formLabelWidth: "100px",
      chosedProjectIdNum: "", //选中的项目
    };
  },
  created() {
    this.roleShow();
    // if (inDexOfStr(this.$route.path, "basicInfor")) {
    //   this.cindex = 1;
    // } else if (inDexOfStr(this.$route.path, "acceptanceContent")) {
    //   this.cindex = 2;
    // } else if (inDexOfStr(this.$route.path, "taskArrangement")) {
    //   this.cindex = 3;
    // }
    this.getProjectList();
    if (this.$store.state.projectInfor.projectId) {
      this.chosedProjectIdNum = this.$store.state.projectInfor.projectId;
    }
  },
  methods: {
    //角色控制
    roleShow() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (
        roleCode == 600 ||
        roleCode == 650 ||
        roleCode == 700 ||
        roleCode == 500
      ) {
      }
    },
    handleIconClick() {
      // console.log(this.projectSearch)
      this.getProjectList(this.projectSearch);
    },
    // clickRightNav(index, path) {
    //   this.cindex = index;
    //   // this.$router.history.push(path);
    // },
    // 查询项目列表
    getProjectList(name = "") {
      getProjects({ name,distribution:1 })
        .then(res => {
          if (res.httpStatus == 200) {
            this.projectList = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
      getProjects({ name,distribution:-1 })
        .then(res => {
          if (res.httpStatus == 200) {
            this.projectList2 = res.result;
            if(this.$store.state.projectInfor.projectId&&!this.$store.state.projectInfor.reviewStandardId){
              this.projectList2.forEach(item=>{
                if(item.projectId ==this.$store.state.projectInfor.projectId){
                  this.$store.commit('chosedProjectId',item)
                }
              })
            }
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
      
    },

    //点击某一个项目
    clickProject(i) {
      this.chosedProjectIdNum = i.projectId;
      this.$store.commit("chosedProjectId", i);
      this.cindex = 1;
      // this.$router.history.push("/index/project/basicInfor");
    }
  },
  computed: {
    addProjectSuccess() {
      return this.$store.state.addProjectSuccessed;
    }
  },
  watch: {
    addProjectSuccess: function changeaddProjectStatus(val1,val2) {
      this.getProjectList();
    }
  }
};
</script>

<style lang="less" >
#AcceptTaskWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  // box-sizing: border-box;
  .left {
    // width: 320px;
    flex: 0 0 320px;
    // height: 100%;
    // height: 1120px;
    padding: 0 10px 0 15px;
    border-right: 4px solid #f4f4f4;
    box-shadow: 3px 0px 0px #f2f2f2;
    // box-sizing: border-box;
    .tit {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .titText {
        display: flex;
        align-items: center;
        img {
          width: 26px;
          height: 26px;
        }
        span {
          font-size: 20px;
          line-height: 40px;
          font-weight: 500;
          margin-left: 5px;
        }
      }

      .el-button {
        // height: 30px;
        // line-height: 30px;
      }
    }
    .el-divider--horizontal {
      margin: 10px 0;
    }
    .projectList {
      margin-top: 15px;
      height: 720px;
      overflow-y: auto;
      p {
        text-indent: 20px;
        line-height: 30px;
        border-radius: 4px;
      }
      p:hover {
        cursor: pointer;
        background-color: #F5F7FA;
        // color: #fff;
      }
      .chosedProjectClass {
        background-color: #F0F7FF;
        // color: #fff;
      }
    }
  }
  .right {
    flex: 1;
    // display: flex;
    // flex-direction: column;
    // padding: 0 10px 0 15px;
    // margin-left: 10px;

    // .rightContainer {
    //   flex: 1;
    //   padding: 20px 10px 0 15px;
    // }
  }
  .c409eff {
      // background-color: #409eff;
      color: #409eff;
    }
}
</style>