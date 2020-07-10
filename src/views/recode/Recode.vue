<template>
  <div id="recodeWrapper">
    <div class="headerWrapper">
      <div class="headerNav">
        <span class="navList" v-for="(item,index) in navList" :key='index' :class="{chosedNav:cindex==item.standardId}" @click="changeNav(item)">{{item.name}}</span>
       
      </div>
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
    <div class="projectSelect">
      <el-select v-model="projectValue" :placeholder="pProjectName" @change="chosedProject()">
        <el-option v-for="item in ProjectOptions" :key="item.value" :label="item.label" :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="switch">
      <span>记录归档</span>
      <el-switch v-model="status" active-color="#13ce66" inactive-color="#777A82" active-value="100" inactive-value="1" @change='changeStatus()'>
      </el-switch>
    </div>
     <div class="searchContent">
          <el-select v-model="primaryTitleId" clearable placeholder="分部" class="w100px">
            <el-option v-for="item in primaryTitleIdOptopns" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="secondaryTitleId" clearable placeholder="分项" class="w100px">
            <el-option v-for="item in secondaryTitleIdOptopns" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="result" clearable placeholder="结论" class="w100px">
            <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" plain @click="unitCurrentChange(1)">查询</el-button>
        </div>
  </div>
</template>

<script>
import { getCategorys } from "@/apis/standard";
import { inDexOfStr } from "../../utils/publictool.js";
import { updateProject } from "../../apis/project.js";
import {
  getProjectsByAcceptanceFactoryId,
  getProjectsByConstructionFactoryId
} from "@/apis/project.js";
export default {
  data() {
    return {
      navList: [],
      cindex: "",
      ProjectOptions: [],
      projectValue: {},
      pProjectName: "",
      status: "1",
      chosedPro: {},
      result: "", //下拉框的筛选
      resultOptions: [
        { label: "合格", value: "1" },
        { label: "不合格", value: "5" }
      ],
      primaryTitleId: "",
      primaryTitleIdOptopns: [],
      secondaryTitleId: "",
      secondaryTitleIdOptopns: []
    };
  },
  created() {
    this.getCategorysMethods();
    this.getProjectList();
    this.projectValue = this.$store.state.projectInfor;
    this.pProjectName = this.$store.state.projectInfor.projectName;
  },
  methods: {
    changeNav(index, path) {
      this.cindex = index;
      this.$router.history.push(path);
    },
    getProjectList() {
      if (
        this.$store.state.userRole.roleCode == 300 ||
        this.$store.state.userRole.roleCode == 600
      ) {
        getProjectsByConstructionFactoryId()
          .then(res => {
            if (res.httpStatus == 200) {
              this.ProjectOptions = res.result.map(item => {
                item.label = item.projectName;
                item.value = item.projectId;
                return item;
              });
              if (!this.$store.state.projectInfor.standardId) {
                this.$store.commit("chosedProjectId", this.ProjectOptions[0]);
              }
            }
          })
          .catch(err => {
            this.$message({
              type: "warning",
              message: err.msg
            });
          });
      } else {
        getProjectsByAcceptanceFactoryId()
          .then(res => {
            if (res.httpStatus == 200) {
              this.ProjectOptions = res.result.map(item => {
                item.label = item.projectName;
                item.value = item.projectId;
                return item;
              });
              if (!this.$store.state.projectInfor.standardId) {
                this.$store.commit("chosedProjectId", this.ProjectOptions[0]);
              }
            }
          })
          .catch(err => {
            this.$message({
              type: "warning",
              message: err.msg
            });
          });
      }
    },
    chosedProject() {
      this.status = this.projectValue.status;
      this.$store.commit("chosedProjectId", this.projectValue);
    },
    //改变开关状态
    changeStatus() {
      updateProject({
        projectId: this.$store.state.projectInfor.projectId,
        status: this.status
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "档案归档成功"
            });
          } else {
            this.status = this.status == 1 ? 100 : 1;
            this.$message({
              type: "warning",
              message: res.msg
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err
          });
        });
    },
    //获取验收方式
    getCategorysMethods() {
      getCategorys()
        .then(res => {
          if (res.httpStatus == 200) {
            this.navList = res.result.map((item, index) => {
              let path;
              switch(item.categoryName){
               case '现场评定' :
               path = '/index/recode/evaluation';
               break;
               case '资料审查' :
               path = '/index/recode/dataReview';
               break;
               case '竣工查验' :
               path = '/index/recode/completionInspection';
               break;
               default :
               path = '/index/recode/fireDetection';//消防检测
              }
              return {
                id: index,
                standardId: item.standard.standardId,
                name: item.categoryName,
                path
              };
            });
            this.cindex = this.navList[0].standardId;
            this.$router.history.push(this.navList[0].path)
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    //获取一二级菜单的数据
    getRecode12() {
      getRecordsByProjectIdGroup1({
        projectId: this.$store.state.projectInfor.projectId
      })
        .then(res => {
          if (res.httpStatus == 200) {
            // console.log(res)
            this.primaryTitleIdOptopns = res.result.map(item => {
              return {
                label: item.primaryTitle,
                value: item.primaryTitleId
              };
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      getRecordsByProjectIdGroup2({
        projectId: this.$store.state.projectInfor.projectId
      })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
            this.secondaryTitleIdOptopns = res.result.map(item => {
              return {
                label: item.secondaryTitle,
                value: item.secondaryTitleId
              };
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击菜单
    changeNav(i) {
      this.cindex = i.standardId;
      this.$router.history.push(i.path)
      // this.$store.commit("saveStandardId", i.standardId);
      this.$store.commit('saveRecodeStandard',i)
    },
  }
};
</script>

<style lang="less">
#recodeWrapper {
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
  position: relative;
  .headerWrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .headerNav {
      flex: 0 0 50px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      span {
        display: inline-block;
        width: 120px;
        height: 48px;
        line-height: 48px;
        // background-color: #409eff;
        text-align: center;
        color: #409eff;
      }
      span:hover {
        cursor: pointer;
      }
      .chosedNav {
        background-color: #409eff;
        color: #fff;
      }
    }
    .container {
      flex: 1;
      padding: 10px 10px 0 10px;
    }
  }
  .projectSelect {
    position: absolute;
    width: 250px;
    height: 40px;
    left: 1200px;
    top: -60px;
    border-radius: 10px;
    .el-input__inner {
      background-color: #000;
      color: #fff;
    }
  }
  .switch {
    width: 200px;
    height: 50px;
    position: absolute;
    right: 0;
    top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      width: 80px;
    }
    .el-switch {
      width: 50px;
    }
  }
  .searchContent {
    width: 600px;
    height: 40px;
    position: absolute;
    left: 540px;
    top: 15px;
    display: flex;
    .el-select {
      margin-left: 10px;
    }
    .el-button {
      margin-left: 20px;
    }
  }
  // .w100px{
  //   width: 100px;
  // }
}
</style>