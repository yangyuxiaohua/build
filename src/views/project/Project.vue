<template>
  <div id="projectWrapper">
    <div class="left">
      <div class="tit">
        <div class="titText">
          <img src="../../assets/imgs/index/xiangmu.png" alt="">
          <span>工程项目</span>
        </div>
        <el-button type="primary" plain size="small" @click="addProject()" v-show="roleShowAddBtn">新增</el-button>
      </div>
      <el-divider></el-divider>
      <el-input placeholder="请输入" v-model="projectSearch">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick"></i>
      </el-input>
      <div class="projectList">
        <p v-for="item in projectList" :key="item.projectId" @click="clickProject(item)" :class="{chosedProjectClass:chosedProjectIdNum==item.projectId}">{{item.projectName}}</p>
      </div>

    </div>
    <div class="right">
      <div class="rightNav">
        <span :class="{c409eff:cindex==item.id}" @click="clickRightNav(item.id,item.path)" v-for="item in rightNav" :key="item.id" v-show="item.roleShow4">{{item.text}}</span>
      </div>
      <div class="rightContainer">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { inDexOfStr } from "../../utils/publictool.js";
// import {
//   getProjectsByAcceptanceFactoryId,
//   getProjectsByConstructionFactoryId
//   // addProject
// } from "@/apis/project.js";
import { getProjects } from "@/apis/home.js";

export default {
  data() {
    return {
      projectSearch: "",
      cindex: 1,
      rightNav: [
        {
          id: 1,
          path: "/index/project/basicInfor",
          text: "基本信息",
          roleShow4: true
        },
        {
          id: 2,
          path: "/index/project/acceptanceContent",
          text: "验收内容",
          roleShow4: true
        }
        // { id: 3, path: "/index/project/taskArrangement", text: "任务安排",roleShow4:true }
      ],
      projectList: [], // 项目列表
      dialogProjectFormVisible: false,
      // addProjectForm: {}, //新增项目
      formLabelWidth: "100px",
      chosedProjectIdNum: "", //选中的项目
      roleShowAddBtn:false
    };
  },
  created() {
    this.roleShow();
    if (inDexOfStr(this.$route.path, "basicInfor")) {
      this.cindex = 1;
    } else if (inDexOfStr(this.$route.path, "acceptanceContent")) {
      this.cindex = 2;
    } else if (inDexOfStr(this.$route.path, "taskArrangement")) {
      this.cindex = 3;
    }
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
        roleCode == 300
      ) {
       this.roleShowAddBtn = true
      }else{
        this.roleShowAddBtn = false
      }
    },
    handleIconClick() {
      // console.log(this.projectSearch)
      this.getProjectList(this.projectSearch);
    },
    clickRightNav(index, path) {
      this.cindex = index;
      this.$router.history.push(path);
    },
    // 查询项目列表
    getProjectList(name = "") {
      getProjects({ name })
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
    },
    // 新增项目
    addProject() {
      // this.dialogProjectFormVisible = true;
      this.$store.commit("chosedProjectId", {});
      this.cindex = 1;
      this.chosedProjectIdNum = "";
      this.$router.history.push("/index/project/basicInfor");
    },
    //点击某一个项目
    clickProject(i) {
      this.chosedProjectIdNum = i.projectId;
      this.$store.commit("chosedProjectId", i);
      this.cindex = 1;
      this.$router.history.push("/index/project/basicInfor");
    }
  },
  computed: {
    addProjectSuccess() {
      return this.$store.state.addProjectSuccessed;
    }
  },
  watch: {
    addProjectSuccess: function changeaddProjectStatus(val1, val2) {
      this.getProjectList();
    }
  }
};
</script>

<style lang="less" >
#projectWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  // box-sizing: border-box;
  .left {
    // width: 320px;
    flex: 0 0 320px;
    // height: 100%;
    padding: 0 10px 0 15px;
    border-right: 1px solid #f4f4f4;
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
      // border: 1px solid red;
      margin-top: 15px;
       height: 740px;
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
    display: flex;
    flex-direction: column;
    padding: 0 10px 0 15px;
    // margin-left: 10px;
    .rightNav {
      height: 50px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      span {
        display: inline-block;
        width: 120px;
        height: 48px;
        line-height: 48px;
        // background-color: #409eff;
        text-align: center;
      }
      span:hover {
        cursor: pointer;
      }
      .c409eff {
        background-color: #409eff;
        color: #fff;
      }
    }
    .rightContainer {
      flex: 1;
      padding: 20px 10px 0 15px;
    }
  }
}
</style>