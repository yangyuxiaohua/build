<template>
  <div id="taskArrangementWrapper" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="rightNav">
      <span :class="{c409eff:cindex==item.id}" @click="clickRightNav(item.id,item.text)" v-for="item in rightNav" :key="item.id" v-show="item.roleShow4">{{item.text}}</span>

    </div>
    <div class="taskArrangementContent">
      <div class="acceptance">
        <p class="acceptanceText lh48">验收内容</p>
        <el-divider></el-divider>
        <div class="acceptanceContainer">
          <div class="acceptanceTree1">
            <el-tree :data="acceptanceData1" show-checkbox node-key="id" highlight-current :props="defaultProps" :default-checked-keys='checkedList' ref='acceptanceTree1' @check='getCheckList()'>
              <span class="custom-tree-node" slot-scope="{node,data}">
                <span class="nodeText">{{node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="apply">
        <p class="applyText lh48">适用标准</p>
        <el-divider></el-divider>
        <div class="applyContainer">
          <!-- <el-form ref="applyForm" :model="form" label-width="80px" size="small">
            <el-form-item label='' class="choseStandard">
              <el-radio-group v-model="form.standard" @change="changeStandard()">
                <el-radio :label="item.name" v-for="item in standardList" :key="item.standardId">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-divider></el-divider>
          </el-form> -->
          <div class="chickListWrapper">
            <p class="stanardTitName">现行标准</p>
            <el-checkbox-group v-model="checkList">
              <el-row v-for="(item,index) in StandardNames" :key='index'>
                <el-checkbox :label="item.value" @change="changeStandard(1,item.value)">{{item.name}}</el-checkbox>
              </el-row>

            </el-checkbox-group>
          <el-divider></el-divider>
            
            <p class="stanardTitName ">原有标准</p>
            <el-checkbox-group v-model="checkList2">
              <el-row v-for="(item,index) in StandardNames2" :key='index'>
                <el-checkbox :label="item.value" @change="changeStandard(-1,item.value)">{{item.name}}</el-checkbox>
              </el-row>
            
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="staffing">
        <p class="staffingText lh48">人员安排</p>
        <el-divider></el-divider>
        <div class="staffingConiner">
          <p class="personTit"> 项目负责人</p>
          <el-tree :data="acceptancePersonData2" show-checkbox ref="personTree2" highlight-current :props="partDefaultProps" :default-checked-keys='checkedPersonList2' :expand-on-click-node='expandOnClickNode' :check-on-click-node="checkOnClickNode" :check-strictly='checkStrictly' node-key="id" :default-expanded-keys="defaultOnNode">
          </el-tree>
          <el-divider></el-divider>
          <p class="personTit"> 验收人员</p>
          <el-tree :data="acceptancePersonData" show-checkbox ref="personTree" highlight-current :props="partDefaultProps" :default-checked-keys='checkedPersonList' :expand-on-click-node='expandOnClickNode' :check-on-click-node="checkOnClickNode" :check-strictly='checkStrictly' node-key="id" :default-expanded-keys="defaultOnNode">
          </el-tree>
        </div>
      </div>
      <div class="btns" v-show="roleShowBtn">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
    <div class="usedRecodeBtn">
      <!-- <el-button type="primary" plain size="small" @click="usedRecode()">使用</el-button> -->
      <el-dialog title="评定方式" :visible.sync="dialogFormVisible">
        <div class="dialogFormVisibleContent">
          <el-radio-group v-model="radio">
            <div v-for="item in useRecodeRadioList" :key="item.copyType">
              <el-radio :label="item.copyType">{{item.text}}</el-radio>
            </div>

            <!-- <el-radio :label="6">备选项</el-radio><br/>
              <el-radio :label="9">备选项</el-radio> -->
          </el-radio-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureUsedRecode()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {
  getStandards,
  getCurrStandardDocument,
  // getAcceptanceFactoryPartsMenuDto,
  submitData,
  getCurrCopyStatus,
  getChecklistStandards2,
  getStandardConflict
} from "@/apis/acceptMethods.js";
import { getFactoryMenus } from "@/apis/userUnit.js";
import { getChecklistStandards } from "@/apis/standard";
import { splitStr } from "@/utils/publictool";
import { indexOf } from 'lodash-es';
export default {
  data() {
    return {
      rightNav: [
        // { id: 1, text: "资料核查", roleShow4: true },
        // { id: 2, text: "竣工查验", roleShow4: true },
        // { id: 3, text: "消防检测", roleShow4: true },
        // { id: 4, text: "现场评定", roleShow4: true }
        // { id: 3, path: "/index/project/taskArrangement", text: "任务安排",roleShow4:true }
      ],
      cindex: 1,
      cText: "资料核查",
      loading: false, //加载
      acceptanceData1: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      partDefaultProps: {
        children: "departments",
        label: "partsName",
        disabled: "disabled"
      },
      acceptanceTree1Name: "", //tree名字
      acceptanceData2: [],
      acceptanceTree2Name: "",
      expandOnClickNode: false, //只有点击三角展开
      checkOnClickNode: false, //点击节点选中
      checkStrictly: false, //父子之间不关联
      form: {
        standard: "现行标准" //标准
      },
      standardList: [
        {
          name: "现行标准",
          // standardId: item.standardId,
          enable: 1
        }
      ],
      checkedList: [], //默认选中
      acceptancePersonData: [], // 人员列表
      acceptancePersonData2: [], //项目负责人列表
      checkedPersonList: [], // 默认选中人员
      checkedPersonList2: [], //默认选中项目负责人
      departments: [],
      StandardNames: [], //现行标准
      StandardNames2: [], //原有标准
      checkList: [], //筛选现行标准
      checkList2: [], //筛选原有标准
      projectInfor: {}, //项目信息
      factoryType: 1, //单位类型
      dialogFormVisible: false,
      radio: "", //使用记录
      useRecodeRadioList: [], //使用记录数据
      defaultOnNode: [], //人员默认展开
      roleShowBtn: false //
    };
  },
  created() {
    // this.projectInfor = this.$store.state.projectInfor;
    // this.factoryType = this.$store.state.userInfor.factoryType;
    // this.roleControl();
    if (this.$store.state.projectInfor.projectId) {
      this.init();
    }
  },
  mounted() {},
  methods: {
    //权限控制
    roleControl() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode == 400 || roleCode == 450 || roleCode == 500) {
        this.rightNav = [
          {
            id: this.projectInfor.reviewStandardId,
            text: "资料核查",
            roleShow4: true
          },
          {
            id: this.projectInfor.standardId,
            text: "现场评定",
            roleShow4: true
          }
        ];
      } else if (roleCode == 800 || roleCode == 850 || roleCode == 900) {
        this.rightNav = [
          {
            id: this.projectInfor.reviewStandardId,
            text: "资料核查",
            roleShow4: true
          },
          {
            id: this.projectInfor.inspectStandardId,
            text: "消防检测",
            roleShow4: true
          }
        ];
      } else if (roleCode == 600 || roleCode == 650 || roleCode == 700) {
        this.rightNav = [
          {
            id: this.projectInfor.reviewStandardId,
            text: "资料核查",
            roleShow4: true
          },
          {
            id: this.projectInfor.completStandardId,
            text: "竣工查验",
            roleShow4: true
          }
        ];
      } else if (roleCode == 300) {
        this.rightNav = [
          {
            id: this.projectInfor.reviewStandardId,
            text: "资料核查",
            roleShow4: true
          },
          {
            id: this.projectInfor.completStandardId,
            text: "竣工查验",
            roleShow4: true
          },
          {
            id: this.projectInfor.inspectStandardId,
            text: "消防检测",
            roleShow4: true
          },
          {
            id: this.projectInfor.standardId,
            text: "现场评定",
            roleShow4: true
          }
        ];
      }
      if (roleCode == 500 || roleCode == 700 || roleCode == 900) {
        this.roleShowBtn = false;
      } else {
        this.roleShowBtn = true;
      }
      // console.log(this.rightNav);

      // console.log(this.rightNav)
    },
    //初始化页面
    init() {
      this.projectInfor = this.$store.state.projectInfor;
      // console.log(this.projectInfor)
      this.factoryType = this.$store.state.userInfor.factoryType;
      this.roleControl();

      // console.log(this.projectInfor)
      this.cindex = this.rightNav[0].id;
      this.checkedList = [];
      this.checkedPersonList = [];
      this.checkedPersonList2 = [];
      this.getTree1Data();
      this.getPersonData();
      this.getPersonData2();
      this.getStandardNames();

      // console.log(this.projectInfor)
    },
    //点击筛选验收内容
    clickRightNav(id, text) {
      this.cindex = id;
      this.cText = text;
      this.loading = true;
      this.checkedList = [];
      this.checkedPersonList = [];
      this.checkedPersonList2 = [];
      this.getTree1Data();
      this.getPersonData();
      this.getPersonData2();
      this.getStandardNames();
    },
    //提交
    onSubmit() {
      if (
        this.$store.state.userRole.roleCode == 300 ||
        this.$store.state.userRole.roleCode == 400 ||
        this.$store.state.userRole.roleCode == 450
      ) {
        this.usedRecode();
      } else {
        this.loading = true;
        this.SubmitTask();
      }
    },
    SubmitTask(copyType = null) {
      this.loading = true;

      let obj = {
        copyType,
        primaryChecklistIds: [],
        secondaryChecklistIds: [],
        acceptancePartIds: [],
        standardId: this.cindex,
        placements: [],
        projectId: this.$store.state.projectInfor.projectId,
        standardNames: [], //标准名字
        projectLeaders: [
          // {
          //   "factoryId": "string",
          //   "factoryType": "string",
          //   "id": "string",
          //   "projectId": "string",
          //   "projectLeader": "string"
          // }
        ],
        checklistStandardIds: [] // 标准id
      };
      let arr1 = this.$refs.acceptanceTree1.getCheckedKeys();
      // let arr2 = this.$refs.acceptanceTree2.getCheckedKeys();
      let arr3 = this.$refs.personTree.getCheckedKeys();
      let arr4 = this.$refs.personTree2.getCheckedKeys();
      obj.projectLeaders = arr4.filter(item => {
        if (item.indexOf("_") !== -1) {
          // obj.acceptancePartIds.push(item);
          return item;
          // console.log(item)
          // return { projectLeader: splitStr(item)[1] };
        }
      });
      obj.projectLeaders = obj.projectLeaders.map(item => {
        return {
          projectLeader: splitStr(item)[1]
        };
      });
      // console.log(obj.projectLeaders);
      //================================================
      // let level1NoChecked = [];
      // let level2NoChecked = [];

      // 处理选中的
      arr1.forEach(item => {
        if (splitStr(item)[0] == "menuLevel2") {
          obj.secondaryChecklistIds.push({
            menuLevel: 2,
            projectId: this.$store.state.projectInfor.projectId,
            standardSecondaryTitleId: splitStr(item)[1]
            // deleted: 1
          });
        } else {
          obj.primaryChecklistIds.push({
            menuLevel: 1,
            projectId: this.$store.state.projectInfor.projectId,
            standardPrimaryTitleId: splitStr(item)[1]
            // deleted: 1
          });
        }
      });
      // arr2.forEach(item => {
      //   if (splitStr(item)[0] == "menuLevel2") {
      //     obj.secondaryChecklistIds.push({
      //       menuLevel: 2,
      //       projectId: this.$store.state.projectInfor.projectId,
      //       standardSecondaryTitleId: splitStr(item)[1]
      //       // deleted: 1
      //     });
      //   } else {
      //     obj.primaryChecklistIds.push({
      //       menuLevel: 1,
      //       projectId: this.$store.state.projectInfor.projectId,
      //       standardPrimaryTitleId: splitStr(item)[1]
      //       // deleted: 1
      //     });
      //   }
      // });

      // let total1 = this.acceptanceData1.map(item => {
      //   return {
      //     id: splitStr(item.id)[1]
      //   };
      // });
      // let total2 = this.acceptanceData2.map(item => {
      //   return {
      //     id: splitStr(item.id)[1]
      //   };
      // });
      // let totalF1 = total1.concat(total2);
      // for (let i = 0; i < totalF1.length; i++) {
      //   let flag1 = false;
      //   for (let j = 0; j < obj.primaryChecklistIds.length; j++) {
      //     if (
      //       totalF1[i].id == obj.primaryChecklistIds[j].standardPrimaryTitleId
      //     ) {
      //       flag1 = true;
      //       break;
      //     }
      //   }
      //   if (!flag1) {
      //     level1NoChecked.push(totalF1[i].id);
      //   }
      // }
      // let totalF2 = [];
      // this.acceptanceData1.forEach(item => {
      //   item.children.forEach(i => {
      //     totalF2.push(i.id);
      //   });
      // });
      // this.acceptanceData2.forEach(item => {
      //   item.children.forEach(i => {
      //     totalF2.push(i.id);
      //   });
      // });

      // for (let i = 0; i < totalF2.length; i++) {
      //   let flag2 = false;
      //   for (let j = 0; j < obj.secondaryChecklistIds.length; j++) {
      //     if (
      //       totalF2[i] == obj.secondaryChecklistIds[j].standardSecondaryTitleId
      //     ) {
      //       flag2 = true;
      //       break;
      //     }
      //   }
      //   if (!flag2) {
      //     level2NoChecked.push(totalF2[i]);
      //   }
      // }

      // console.log(arr4);
      arr3.forEach(item => {
        if (item.indexOf("_") == -1) {
          obj.acceptancePartIds.push(item);
        } else {
          let partId = splitStr(item)[0];
          // let userId = splitStr(item)[1];
          obj.acceptancePartIds.push(partId);
          obj.placements.push(item);
        }
      });

      // level1NoChecked = level1NoChecked.map(item => {
      //   return {
      //     menuLevel: 1,
      //     projectId: this.$store.state.projectInfor.projectId,
      //     standardPrimaryTitleId: item,
      //     deleted: -1
      //   };
      // });
      // level2NoChecked = level2NoChecked.map(item => {
      //   // console.log(splitStr(item)[1])
      //   return {
      //     menuLevel: 2,
      //     projectId: this.$store.state.projectInfor.projectId,
      //     standardSecondaryTitleId: splitStr(item)[1],
      //     deleted: -1
      //   };
      // });
      obj.placements = obj.placements.map(item => {
        return {
          acContentId: this.$store.state.projectInfor.acContentId,
          projectId: this.$store.state.projectInfor.projectId,
          userId: splitStr(item)[1],
          partId: splitStr(item)[0]
        };
      });
      obj.checklistStandardIds = this.checkList.concat(this.checkList2);
      // obj.primaryChecklistIds = obj.primaryChecklistIds.concat(level1NoChecked);
      // obj.secondaryChecklistIds = obj.secondaryChecklistIds.concat(
      //   level2NoChecked
      // );
      // console.log(this.StandardNames)
      this.checkList.forEach(item => {
        this.StandardNames.forEach(i => {
          if (i.value == item) {
            obj.standardNames.push(i.name);
          }
        });
      });
      this.checkList2.forEach(item => {
        this.StandardNames2.forEach(i => {
          if (i.value == item) {
            obj.standardNames.push(i.name);
          }
        });
      });
      // console.log(obj);

      // standardChecklistId

      submitData(obj)
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "提交成功"
            });
            let bool = this.$store.state.addProjectSuccessed == "1" ? "2" : "1";
            this.$store.commit("addProjectSuccess", bool);
          } else {
            this.$message({
              type: "warning",
              message: res.msg
            });
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: err
          });
          this.loading = false;
        });
    },

    //获取适用标准
    // getStandard() {
    //   getStandards()
    //     .then(res => {
    //       if (res.httpStatus == 200) {
    //         this.standardList = res.result.map(item => {
    //           return {
    //             name: item.name,
    //             standardId: item.standardId,
    //             enable: item.enable
    //           };
    //         });
    //         this.standardList.forEach(item => {
    //           if (item.enable == 1) {
    //             this.form.standard = item.standardId;
    //           }
    //         });
    //       }
    //     })
    //     .catch(err => {
    //       this.$message({
    //         type: "warning",
    //         message: err.msg
    //       });
    //     });
    // },
    //获取验收内容1
    getTree1Data() {
      getCurrStandardDocument({
        projectId: this.$store.state.projectInfor.projectId,
        standardId: this.cindex,
        level: 2
      })
        .then(res => {
          // console.log(res);
          if (res.httpStatus == 200) {
            this.loading = false;
            this.acceptanceTree1Name = res.result.name;
            this.acceptanceData1 = res.result.primaryTitles.map(item => {
              if (item.selected) {
                this.checkedList.push(
                  "menuLevel1_" + item.standardPrimaryTitleId
                );
              }
              return {
                id: "menuLevel1_" + item.standardPrimaryTitleId,
                label: item.titleName,

                children: item.secondaryTitles.map(i => {
                  if (i.selected) {
                    this.checkedList.push(
                      "menuLevel2_" + i.standardSecondaryTitleId
                    );
                  }
                  return {
                    id: "menuLevel2_" + i.standardSecondaryTitleId,
                    label: i.titleName
                  };
                })
              };
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    // //获取验收内容2
    // getTree2Data() {
    //   getCurrStandardDocument({
    //     projectId: this.$store.state.projectInfor.projectId,
    //     standardId: this.$store.state.projectInfor.reviewStandardId,
    //     level: 2
    //   })
    //     .then(res => {
    //       if (res.httpStatus == 200) {
    //         this.acceptanceTree2Name = res.result.name;
    //         this.acceptanceData2 = res.result.primaryTitles.map(item => {
    //           if (item.selected) {
    //             this.checkedList.push(
    //               "menuLevel1_" + item.standardPrimaryTitleId
    //             );
    //           }
    //           return {
    //             id: "menuLevel1_" + item.standardPrimaryTitleId,
    //             label: item.titleName,

    //             children: item.secondaryTitles.map(i => {
    //               if (i.selected) {
    //                 this.checkedList.push(
    //                   "menuLevel2_" + i.standardSecondaryTitleId
    //                 );
    //               }
    //               return {
    //                 id: "menuLevel2_" + i.standardSecondaryTitleId,
    //                 label: i.titleName
    //               };
    //             })
    //           };
    //         });
    //       }
    //     })
    //     .catch(err => {
    //       this.$message({
    //         type: "info",
    //         message: err
    //       });
    //     });
    // },
    //获取人员列表
    getPersonData() {
      getFactoryMenus({
        projectId: this.$store.state.projectInfor.projectId,
        factoryType: this.factoryType,
        onlyFactory: false,
        queryUser: true,
        standardId: this.cindex
      })
        .then(res => {
          if (res.httpStatus == 200) {
            // console.log(res);
            this.acceptancePersonData = res.result.map(item => {
              // return {
              //   id: item.factoryId,
              //   partsName: item.factoryName,
              //   departments: item.departments,
              //   disabled: false,
              //   selected: false
              // };
              return item;
            });
            this.ruleValidate(this.acceptancePersonData);
          } else {
            this.$message({
              type: "info",
              message: "获取人员失败"
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    // 递归人员进选中的数组checkedPersonList
    ruleValidate(data) {
      let _this = this;
      function judgeChildren(data) {
        data.forEach(e => {
          if (!e.departments) {
            if (e.selected) {
              _this.checkedPersonList.push(e.id);
            }
            if (e.userPartsDtos) {
              let arr = e.userPartsDtos.map(item => {
                if (item.selected) {
                  _this.checkedPersonList.push(item.id);
                }
                item.partsName = item.username;
                return item;
              });
              e.departments = e.departments.concat(arr);
            }
            return;
          } else {
            if (e.selected) {
              _this.checkedPersonList.push(e.id);
            }
            if (e.userPartsDtos) {
              let arr = e.userPartsDtos.map(item => {
                item.partsName = item.username;
                if (item.selected) {
                  _this.checkedPersonList.push(item.id);
                }
                return item;

                // return {
                //   id: item.id,
                //   partsName: item.username
                // };
              });
              e.departments = e.departments.concat(arr);
            }
            judgeChildren(e.departments);
          }
        });
      }
      judgeChildren(data);
    },
    //获取项目负责人人员列表
    getPersonData2() {
      getFactoryMenus({
        projectId: this.$store.state.projectInfor.projectId,
        factoryType: this.factoryType,
        onlyFactory: false,
        queryUser: true,
        leader: 1,
        standardId: this.cindex
      })
        .then(res => {
          if (res.httpStatus == 200) {
            // console.log(res);
            this.acceptancePersonData2 = res.result.map(item => {
              // return {
              //   id: item.factoryId,
              //   partsName: item.factoryName,
              //   departments: item.departments,
              //   disabled: false,
              //   selected: false
              // };
              return item;
            });
            this.ruleValidate2(this.acceptancePersonData2);
          } else {
            this.$message({
              type: "info",
              message: "获取人员失败"
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    // 递归人员进选中的数组checkedPersonList
    ruleValidate2(data) {
      let _this = this;
      function judgeChildren(data) {
        data.forEach(e => {
          if (!e.departments) {
            if (e.selected) {
              _this.checkedPersonList2.push(e.id);
            }
            if (e.userPartsDtos) {
              let arr = e.userPartsDtos.map(item => {
                if (item.selected) {
                  _this.checkedPersonList2.push(item.id);
                }
                item.partsName = item.username;
                return item;
              });
              e.departments = e.departments.concat(arr);
            }
            return;
          } else {
            if (e.selected) {
              _this.checkedPersonList2.push(e.id);
            }
            if (e.userPartsDtos) {
              let arr = e.userPartsDtos.map(item => {
                item.partsName = item.username;
                if (item.selected) {
                  _this.checkedPersonList2.push(item.id);
                }
                return item;

                // return {
                //   id: item.id,
                //   partsName: item.username
                // };
              });
              e.departments = e.departments.concat(arr);
            }
            judgeChildren(e.departments);
          }
        });
      }
      judgeChildren(data);
    },

    //切换标准
    changeStandard(num,val) {
      if(num===1){
          this.StandardConflict(val,this.checkList,this.checkList2)
      }else{
          this.StandardConflict(val,this.checkList2,this.checkList)
      }
    },
    //获取标准名称
    getStandardNames() {
      getChecklistStandards({
        projectId: this.$store.state.projectInfor.projectId,
        standardId: this.cindex,
        version: "v1"
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.checkList = [];
            this.StandardNames = res.result.filter(item => {
              if (item) {
                return item;
              }
            });
            this.StandardNames = this.StandardNames.map(item => {
              return {
                name: item.standardName,
                value: item.standardChecklistId,
                selected: item.selected
              };
            });

            this.StandardNames.forEach(item => {
              if (item.selected) {
                this.checkList.push(item.value);
              }
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "请求数据失败"
          });
        });
      getChecklistStandards({
        projectId: this.$store.state.projectInfor.projectId,
        standardId: this.cindex,
        version: "v0"
      })
        .then(res => {
          if (res.httpStatus == 200) {
            // console.log(res);
            this.checkList2 = []
            this.StandardNames2 = res.result.map(item => {
              return {
                name: item.standardName,
                value: item.standardChecklistId,
                selected: item.selected
              };
            });
             this.StandardNames2.forEach(item => {
              if (item.selected) {
                this.checkList2.push(item.value);
              }
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "请求数据失败"
          });
        });
    },
    // 筛选标准
    screeningStandards(names, standardId) {
      getChecklistStandards2({
        names,
        standardId
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.checkList = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err + "823"
          });
        });
    },
    //点击复选框
    getCheckList() {
      let arr1 = this.$refs.acceptanceTree1.getCheckedNodes();
      arr1 = arr1.filter(item => {
        if (splitStr(item.id)[0] === "menuLevel1") {
          return item;
        }
      });
      arr1 = arr1.map(item => {
        return item.label;
      });
      let arr2 = this.$refs.acceptanceTree1.getHalfCheckedNodes();
      arr2 = arr2.filter(item => {
        if (splitStr(item.id)[0] === "menuLevel1") {
          return item;
        }
      });
      arr2 = arr2.map(item => {
        return item.label;
      });
      let arr = arr1.concat(arr2);

      this.screeningStandards(arr, this.cindex);
    },
    // 使用记录
    usedRecode() {
      getCurrCopyStatus({
        projectId: this.$store.state.projectInfor.projectId
      })
        .then(res => {
          // console.log(res);
          if (res.httpStatus == 200) {
            if (this.cText == "资料核查") {
              this.useRecodeRadioList = [
                {
                  text: "使用建设单位已有的资料核查记录",
                  copyType: 15,
                  disabled: res.result.reviewComplete
                },
                {
                  text: "使用服务机构已有的资料核查记录",
                  copyType: 20,
                  disabled: res.result.reviewInspect
                },
                { text: "全部重新评定", copyType: 1, disabled: false }
              ];
            } else {
              this.useRecodeRadioList = [
                {
                  text: "使用建设单位已有的竣工查验记录",
                  copyType: 5,
                  disabled: res.result.complete
                },
                {
                  text: "使用服务机构已有的消防检测记录",
                  copyType: 10,
                  disabled: res.result.inspect
                },
                { text: "全部重新评定", copyType: 1, disabled: false }
              ];
            }
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "网络请求失败"
          });
        });
      this.dialogFormVisible = true;
    },
    // 确定使用
    sureUsedRecode() {
      // console.log()
      this.SubmitTask(this.radio);
    },
    //标准冲突
    StandardConflict(str='',arr1=[],arr2=[]){
      if(arr1.indexOf(str) !==-1 ){
        getStandardConflict({
                dictId:str
              }).then(res=>{
                if(res.httpStatus==200){
                  // console.log(res)
                  if(res.result.length>0){
                  let DictArr = res.result.map(item=>{
                      let s = '';
                     return s = str===item.originalDictId?item.purposeDictId:item.originalDictId
                    })
                    // console.log(DictArr)
                    for (let i=0;i<DictArr.length;i++){
                      let num1 = arr2.indexOf(DictArr[i])
                        if(num1!==-1){
                            arr2.splice(num1,1)
                        }
                    }
                  }
                }
              }).catch(err=>{
                this.$message({
                  type:'info',
                  message:'网络请求失败'
                })
              })
      }
     
    }
  },
  computed: {
    changeProject() {
      return this.$store.state.projectInfor;
    }
  },
  watch: {
    changeProject: function() {
      this.loading = true;
      this.init();
    }
  }
};
</script>

<style lang="less">
#taskArrangementWrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .rightNav {
    // height: 50px;
    flex: 0 0 50px;
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
  .taskArrangementContent {
    flex: 1;
    display: flex;
    padding-bottom: 80px;
    box-sizing: border-box;
    position: relative;
    .acceptance {
      flex: 0 0 400px;
      border: 1px solid #f2f2f2;
      .acceptanceText {
        font-size: 16px;
        // line-height: 40px;
        text-indent: 20px;
      }
      .acceptanceContainer {
        padding: 10px 0 0 25px;
        height: 637px;
        overflow-y: auto;
      }
    }
    .apply {
      flex: 1;
      border: 1px solid #f2f2f2;
      .applyText {
        font-size: 16px;
        // line-height: 40px;
        text-indent: 20px;
      }
      .applyContainer {
        padding: 10px 10px 10px 25px;
        height: 637px;
        overflow-y: auto;
        // border:1px solid red;
        .choseStandard {
          text-align: center;
        }
        .el-divider {
          margin: 0;
        }
        .chickListWrapper {
          padding: 0 10px;
          line-height: 20px;
          // .strandBtn {
          //   text-align: center;
          //   margin-top: 40px;
          // }
          .stanardTitName {
            line-height: 30px;
          }
          .el-divider{
            margin: 12px 0;
          }
        }
      }
    }
    .staffing {
      flex: 0 0 400px;
      border: 1px solid #f2f2f2;
      .staffingText {
        font-size: 16px;
        // line-height: 40px;
        text-indent: 20px;
      }
      .staffingConiner {
        height: 637px;
        overflow-y: auto;
        padding: 10px 0 0 25px;
        .personTit {
          line-height: 30px;
        }
        .el-divider {
          margin: 12px 0;
        }
      }
    }
    .btns {
      width: 100%;
      position: absolute;
      bottom: 20px;
      text-align: center;
    }
    .el-divider {
      margin: 0;
    }
  }
  .usedRecodeBtn {
    padding-left: 100px;
    .dialogFormVisibleContent {
      .el-radio {
        .el-radio__label {
          line-height: 30px;
          font-size: 16px;
        }
      }
    }
  }
  .l30 {
    line-height: 30px;
  }
  .lh48 {
    line-height: 48px;
  }
 
 
}
</style>