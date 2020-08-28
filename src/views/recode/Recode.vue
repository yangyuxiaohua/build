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
    <div class="switch" v-show="isDataReview">
      <span>记录归档</span>
      <el-switch v-model="status" active-color="#13ce66" inactive-color="#777A82" :active-value="true" :inactive-value="false" @change='changeStatus()' :disabled='roleDisabled'>
      </el-switch>
    </div>
    <div class="searchContent">
      <el-cascader :options="primaryTitleIdOptopns" :props="props" clearable placeholder='分部/分项' @focus='getPrimaryTitleIdOptopns()' ref="ascaderPrimaryTitleId" v-model="primaryTitleIdValue"></el-cascader>

      <el-select v-model="importantValue" clearable placeholder="重要程度" class="w120px" v-show="importantShow">
        <el-option v-for="item in importantOption" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="inspectionValue" clearable placeholder="查验结论" class="w120px" v-show="completionInspectionShow">
        <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="detectionValue" clearable placeholder="检测结论" class="w120px" v-show="fireDetectionShow">
        <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="evaluationValue" clearable placeholder="评定结论" class="w120px" v-show="evaluationShow">
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
// import { updateProject } from "../../apis/project.js";
import {
  getEvaluationData12,
  getFiData12,
  getDataReviewData12,
  toArchive
} from "../../apis/evaluation.js";
import {
  // getProjectsByAcceptanceFactoryId,
  // getProjectsByConstructionFactoryId,
  getProjectInfor
} from "@/apis/project.js";
import { getProjects } from "@/apis/home.js";

export default {
  data() {
    return {
      navList: [],
      cindex: "",
      ProjectOptions: [],
      projectValue: {},
      pProjectName: "",
      status: false,
      chosedPro: {},
      result: "", //下拉框的筛选
      resultOptions: [
        { label: "合格项", value: "1" },
        { label: "不合格项", value: "5" }
      ],
      importantOption: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" }
      ],
      primaryTitleIdOptopns: [], // 分部分项
      primaryTitleId: "",
      standardName: "",
      props: {
        //级联选择器配置
        children: "secondaryCategory",
        label: "name",
        value: "secondaryId",
        checkStrictly: true
      },
      isDataReview: false, //是否是资料评审，控制记录归档是否显示
      //下拉框显示
      importantShow: false,
      completionInspectionShow: false,
      fireDetectionShow: false,
      evaluationShow: false,
      primaryTitleIdValue: "", //分部/分项
      importantValue: "", //重要程度
      inspectionValue: "", //查验结论
      detectionValue: "", //检测结论
      evaluationValue: "", //评定结论
      roleDisabled: true //角色归档
      // primaryTitleId: "",
      // primaryTitleIdOptopns: [],
      // secondaryTitleId: "",
      // secondaryTitleIdOptopns: []
    };
  },
  created() {
    this.getCategorysMethods();
    this.getProjectList();
    // console.log(this.$store.state.projectInfor)
    // console.log(this.projectValue)
    //清除筛选保存的条件
    this.$store.commit("saveScreeningRecordObj", {});

    // console.log(this.$store.state.projectInfor.projectId)
  },
  methods: {
    //权限控制
    roleControl() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode == 500 || roleCode == 700 || roleCode == 900) {
        this.roleDisabled = true;
      } else {
        this.roleDisabled = false;
      }
      if (roleCode == 600 || roleCode == 650 || roleCode == 700) {
        this.navList = this.navList.filter(item => {
          if (item.name == "资料核查" || item.name == "竣工查验") {
            return item;
          }
        });
      } else if (roleCode == 800 || roleCode == 850 || roleCode == 900) {
        this.navList = this.navList.filter(item => {
          if (item.name == "资料核查" || item.name == "消防检测") {
            return item;
          }
        });
      } else {
        this.navList = this.navList;
      }
      this.cindex = this.navList[0].standardId;
      this.standardName = this.navList[0].name;
      if (this.standardName == "资料核查") {
        this.isDataReview = false;
      } else {
        this.isDataReview = true;
      }
      // console.log(this.navList[0])
      this.$store.commit("saveRecodeStandard", this.navList[0]);
      this.$router.history.push(this.navList[0].path);
      this.constroShow(this.standardName);
    },
    // 获取项目列表
    getProjectList(name = "") {
      getProjects({ name, distribution: 2 })
        .then(res => {
          if (res.httpStatus == 200) {
            // this.projectList = res.result;
            this.ProjectOptions = res.result.map(item => {
              item.label = item.projectName;
              item.value = item.projectId;
              return item;
            });
            if (this.ProjectOptions.length > 0) {
              this.projectValue = this.ProjectOptions[0];
              this.status = this.projectValue.status == 1 ? false : true;
              this.pProjectName = this.projectValue.projectName;
              // if (!this.$store.state.projectInfor.standardId) {
              this.$store.commit("chosedProjectId", this.ProjectOptions[0]);
            } else {
              this.projectValue = {};
              this.status = false;
              this.pProjectName = "";
              // if (!this.$store.state.projectInfor.standardId) {
              this.$store.commit("chosedProjectId", {});
            }

            // }
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
      // if (
      //   this.$store.state.userRole.roleCode == 300 ||
      //   this.$store.state.userRole.roleCode == 600
      // ) {
      //   getProjectsByConstructionFactoryId()
      //     .then(res => {
      //       if (res.httpStatus == 200) {
      //         this.ProjectOptions = res.result.map(item => {
      //           item.label = item.projectName;
      //           item.value = item.projectId;
      //           return item;
      //         });
      //         if (!this.$store.state.projectInfor.standardId) {
      //           this.$store.commit("chosedProjectId", this.ProjectOptions[0]);
      //         }
      //       }
      //     })
      //     .catch(err => {
      //       this.$message({
      //         type: "warning",
      //         message: err.msg
      //       });
      //     });
      // } else {
      //   getProjectsByAcceptanceFactoryId()
      //     .then(res => {
      //       if (res.httpStatus == 200) {
      //         this.ProjectOptions = res.result.map(item => {
      //           item.label = item.projectName;
      //           item.value = item.projectId;
      //           return item;
      //         });
      //         if (!this.$store.state.projectInfor.standardId) {
      //           this.$store.commit("chosedProjectId", this.ProjectOptions[0]);
      //         }
      //       }
      //     })
      //     .catch(err => {
      //       this.$message({
      //         type: "warning",
      //         message: err.msg
      //       });
      //     });
      // }
    },
    //选中项目
    chosedProject() {
      // console.log(this.projectValue )
      this.$store.commit("chosedProjectId", this.projectValue);
      this.status = this.projectValue.status == 1 ? false : true;
    },
    //改变开关状态
    changeStatus() {
      // console.log(this.projectValue.status)
      let confirmText = this.projectValue.status == 1 ? "验收记录存档后, 验收任务自动终止！" : '取消归档后, 验收任务将重新启用！';
      this.$confirm(confirmText, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          toArchive({
            projectId: this.$store.state.projectInfor.projectId,
            standardId: this.cindex
            // status: this.status
          })
            .then(res => {
              if (res.httpStatus == 200) {
                if (res.result.result == 1) {
                  this.$message({
                    type: "success",
                    message: "档案归档成功"
                  });
                } else {
                  this.$message({
                    type: "info",
                    message: "档案已取消归档"
                  });
                }

                getProjectInfor({
                  projectId: this.$store.state.projectInfor.projectId
                }).then(res => {
                  if (res.httpStatus == 200) {
                    this.$store.commit("chosedProjectId", res.result.project);
                  }
                });
                this.getProjectList();
              } else {
                this.status = this.projectValue.status == 1 ? false : true;
                this.$message({
                  type: "warning",
                  message: res.msg
                });
              }
            })
            .catch(err => {
              this.status = this.projectValue.status == 1 ? false : true;
              this.$message({
                type: "info",
                message: err
              });
            });
        })
        .catch(() => {
              this.status = this.projectValue.status == 1 ? false : true;
          this.$message({
            type: "info",
            message: "已取消操作"
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
                case "资料核查":
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

            this.roleControl();
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
          if (res.httpStatus == 200) {
            this.primaryTitleIdOptopns = res.result.map(item => {
              // console.log(item.primaryId)
              item.secondaryId = "menuLevel1_" + item.primaryId;
              return item;
            });
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
          if (res.httpStatus == 200) {
            this.primaryTitleIdOptopns = res.result.map(item => {
              // console.log(item.primaryId)
              item.secondaryId = "menuLevel1_" + item.primaryId;
              return item;
            });
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
        projectId: this.$store.state.projectInfor.projectId,
        standardId: this.cindex
      })
        .then(res => {
          // console.log(res);
          if (res.httpStatus == 200) {
            this.primaryTitleIdOptopns = res.result.map(item => {
              // console.log(item.primaryId)
              item.secondaryId = "menuLevel1_" + item.primaryId;
              return item;
            });
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
      if (this.standardName == "资料核查") {
        this.isDataReview = false;
      } else if (
        this.standardName == "竣工查验" ||
        this.standardName == "消防检测"
      ) {
        if (
          this.$store.state.userRole.roleCode == 400 ||
          this.$store.state.userRole.roleCode == 450
        ) {
          this.isDataReview = false;
        } else {
          this.isDataReview = true;
        }
      } else {
        this.isDataReview = true;
      }

      // this.$store.commit("saveStandardId", i.standardId);
      this.$store.commit("saveRecodeStandard", i);
      this.$store.commit("saveScreeningRecordObj", {});
      this.constroShow(this.standardName);
      this.clearValue();
      this.$router.history.push(i.path);
    },
    //获取分部/分项选项
    getPrimaryTitleIdOptopns() {
      if (this.standardName == "现场评定") {
        this.getEvaluationRecode12();
      } else if (this.standardName == "资料核查") {
        this.getDataReviewRecode12();
      } else {
        this.getFireRecode12();
      }
    },
    //控制下拉框的隐藏显示
    constroShow(name) {
      switch (name) {
        case "现场评定":
          (this.completionInspectionShow = true),
            (this.fireDetectionShow = true),
            (this.evaluationShow = true);
          this.importantShow = true;
          break;
        case "资料核查":
          (this.importantShow = false),
            (this.completionInspectionShow = false),
            (this.fireDetectionShow = false),
            (this.evaluationShow = true);
          break;
        case "竣工查验":
          (this.importantShow = true),
            (this.completionInspectionShow = true),
            (this.fireDetectionShow = false),
            (this.evaluationShow = false);
          break;
        default:
          (this.completionInspectionShow = false),
            (this.importantShow = true),
            (this.fireDetectionShow = true),
            (this.evaluationShow = false);
      }
    },
    //点击查询
    RecodeCurrentChange() {
      // console.log(this.$refs.ascaderPrimaryTitleId.getCheckedNodes()[0].value);
      // console.log(this.primaryTitleIdValue);
      // let value = value
      let ascaderValue;
      if (this.$refs.ascaderPrimaryTitleId.getCheckedNodes().length > 0) {
        ascaderValue = this.$refs.ascaderPrimaryTitleId.getCheckedNodes()[0]
          .value;
      } else {
        ascaderValue = "";
      }
      let obj = {
        ascaderValue: ascaderValue, //分部分项
        importantValue: this.importantValue, //重要程度
        inspectionValue: this.inspectionValue, //查验结论
        detectionValue: this.detectionValue, //检测结论
        evaluationValue: this.evaluationValue //评定结论
      };
      // console.log(obj);
      this.$store.commit("saveScreeningRecordObj", obj);
    },
    //清空选项
    clearValue() {
      this.primaryTitleIdValue = ""; //分部分项
      this.importantValue = ""; //重要程度
      this.inspectionValue = ""; //查验结论
      this.detectionValue = ""; //检测结论
      this.evaluationValue = ""; //评定结论
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
    right: 60px;
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