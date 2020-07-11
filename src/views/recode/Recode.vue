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
      <el-cascader :options="primaryTitleIdOptopns" :props="props" clearable placeholder='分部/分项' @focus='getPrimaryTitleIdOptopns()' ref="ascaderPrimaryTitleId"></el-cascader>

      <el-select v-model="result" clearable placeholder="重要程度" class="w120px">
        <el-option v-for="item in importantOption" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="result" clearable placeholder="查验结论" class="w120px">
        <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="result" clearable placeholder="检测结论" class="w120px">
        <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="result" clearable placeholder="评定结论" class="w120px">
        <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" plain @click="RecodeCurrentChange()">查询</el-button>
    </div>
  </div>
</template>

<script>
import { getCategorys } from "@/apis/standard";
import { inDexOfStr } from "../../utils/publictool.js";
import { updateProject } from "../../apis/project.js";
import {
  getEvaluationData12,
  getFiData12,
  getDataReviewData12
} from "../../apis/evaluation.js";
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
      importantOption: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" }
      ],
      primaryTitleIdOptopns: [], // 分部分项
      primaryTitleId: "",
      standardName: "",
      props:{ //级联选择器配置
         children: "secondaryCategory",
        label: "name",
        value: "secondaryId",
        checkStrictly: true
      }
      // primaryTitleId: "",
      // primaryTitleIdOptopns: [],
      // secondaryTitleId: "",
      // secondaryTitleIdOptopns: []
    };
  },
  created() {
    this.getCategorysMethods();
    this.getProjectList();
    this.projectValue = this.$store.state.projectInfor;
    this.pProjectName = this.$store.state.projectInfor.projectName;
    // console.log(this.$store.state.projectInfor.projectId)
  },
  methods: {
    // 获取项目列表
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
    //选中项目
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
              switch (item.categoryName) {
                case "现场评定":
                  path = "/index/recode/evaluation";
                  break;
                case "资料审查":
                  path = "/index/recode/dataReview";
                  break;
                case "竣工查验":
                  path = "/index/recode/completionInspection";
                  break;
                default:
                  path = "/index/recode/fireDetection"; //消防检测
              }
              return {
                id: index,
                standardId: item.standard.standardId,
                name: item.categoryName,
                path
              };
            });
            this.cindex = this.navList[0].standardId;
            this.standardName = this.navList[0].name;
            this.$router.history.push(this.navList[0].path);
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    //获取一二级菜单的数据(现场评定)
    getEvaluationRecode12() {
      getEvaluationData12({
        projectId: this.$store.state.projectInfor.projectId
      })
        .then(res => {
          // console.log(res);
          if(res.httpStatus==200){
            this.primaryTitleIdOptopns = res.result.map(item=>{
              // console.log(item.primaryId)
              item.secondaryId = "menuLevel1_" + item.primaryId
              return item
            })

          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "获取数据失败"
          });
        });
    },
    //获取一二级菜单的数据(资料评审)
    getDataReviewRecode12() {
      getDataReviewData12({
        projectId: this.$store.state.projectInfor.projectId
      })
        .then(res => {
          // console.log(res);
           if(res.httpStatus==200){
            this.primaryTitleIdOptopns = res.result.map(item=>{
              // console.log(item.primaryId)
              item.secondaryId = "menuLevel1_" + item.primaryId
              return item
            })

          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "获取数据失败"
          });
        });
    },
    //获取一二级菜单的数据(消防检测和竣工查验)
    getFireRecode12() {
      getFiData12({
        projectId: this.$store.state.projectInfor.projectId
      })
        .then(res => {
          // console.log(res);
           if(res.httpStatus==200){
            this.primaryTitleIdOptopns = res.result.map(item=>{
              // console.log(item.primaryId)
              item.secondaryId = "menuLevel1_" + item.primaryId
              return item
            })

          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "获取数据失败"
          });
        });
    },
    // 点击菜单
    changeNav(i) {
      this.cindex = i.standardId;
      this.standardName = i.name;
      this.$router.history.push(i.path);
      // this.$store.commit("saveStandardId", i.standardId);
      this.$store.commit("saveRecodeStandard", i);
    },
    //获取分部/分项选项
    getPrimaryTitleIdOptopns() {
      if (this.standardName == "现场评定") {
        this.getEvaluationRecode12();
      } else if (this.standardName == "资料审查") {
        this.getDataReviewRecode12();
      } else {
        this.getFireRecode12();
      }
    },
    RecodeCurrentChange(){
      console.log(this.$refs.ascaderPrimaryTitleId.getCheckedNodes())
    }
    // ascaderPrimaryTitleId
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
    width: 720px;
    height: 40px;
    position: absolute;
    left: 540px;
    top: 15px;
    display: flex;
    .el-select {
      margin-left: 10px;
      // width: 100px;
    }
    .el-button {
      margin-left: 20px;
    }
    .w120px {
      width: 120px;
    }
  }
  // .w100px{
  //   width: 100px;
  // }
}
</style>