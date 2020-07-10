<template>
  <div id="assessWrapper">
    <div class="left">
      <div class="addBtn">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="inputSearch">
        </el-input>
        <el-button type="primary" plain @click="addBtnClick()">新增</el-button>
      </div>
      <el-divider></el-divider>
      <div class="treeWrapper">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node='expandOnClickNode' :accordion='accordion' node-key="id" :default-expanded-keys="defaultOnNode">
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span class="nodeText">{{node.label }}</span>
          </span>
        </el-tree>
      </div>

    </div>
    <div class="right">
      <div class="parentNode" v-show="parentShow">
        <el-form label-width="100px">
          <el-form-item label="名称 :" class="fs18">
            <el-input v-model="parentNodeValue" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="firstInfor" v-show="firstShow">
        <el-form label-width="200px">
          <el-form-item label="分部工程名称 :" class="fs18">
            <el-input v-model="firstValue" placeholder="请输入"></el-input>
          </el-form-item>
          <el-row class="btns">
            <el-form-item>
              <el-button type="primary" @click="onSubmit(1)" plain>提交</el-button>
              <el-button type="danger" plain @click="deleteCon(1)">删除</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="secondInfor" v-show="secondShow">
        <el-form label-width="200px">
          <el-form-item label="分项工程名称 :" class="fs18">
            <el-input v-model="secondValue" placeholder="请输入"></el-input>
          </el-form-item>
          <el-row class="btns">
            <el-form-item>
              <el-button type="primary" @click="onSubmit(2)" plain>提交</el-button>
              <el-button type="danger" plain @click="deleteCon(2)">删除</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="thirdInfo" v-show="thirdShow">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="分部工程 :">
                <el-input v-model="form.subPart" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分项工程 :">
                <el-input v-model="form.subProject" disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="验收内容 :">
                <el-input v-model="form.content"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="重要程度 :">
                <el-input v-model="form.checkTypeName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="验收方法 :">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.checkContent">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="适用标准 :">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.standardName">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="记录模板 :">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark">
                </el-input>
                <!-- <div class="editWrapper">
                  <quill-editor v-model="form.remark" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="适用项目 :">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.withProjects">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="评定规则 :">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.rules">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="抽样要求 :">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.samplingRequires">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="技术要求 :">
                <!-- <div class="editWrapper">
                  <quill-editor v-model="form.technologyRequires" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div> -->
                 <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.technologyRequires">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="edit">
          </el-row>
          <el-row class="btns">
            <el-form-item>
              <el-button type="primary" @click="onSubmit(3)" plain>提交</el-button>
              <el-button type="danger" plain @click="deleteCon(3)">删除</el-button>
            </el-form-item>
          </el-row>

        </el-form>
      </div>
      <div class="rightMask" v-show="rightMaskShow"></div>
    </div>
  </div>
</template>

<script>
// import Edit from '../../components/Edit'
import {
  getCurrStandardDocument,
  getCurrChecklistById,
  addPrimaryMenu,
  updatePrimaryMenu,
  addSecondaryMenu,
  updateSecondaryMenu,
  addChecklist,
  updateChecklist,
  deletedPrimaryMenu,
  deletedSecondaryMenu,
  deletedChecklist
} from "@/apis/standard";
import { splitStr } from "@/utils/publictool";
//富文本
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {},
      textarea: "",
      formLabelWidth: "80px",
      standardId: "",
      standardChecklistId: "",
      parentShow: false, //父节点
      firstShow: false, //一级显示
      secondShow: false, //二级显示
      thirdShow: true, //三级显示
      parentNodeValue: "",
      firstValue: "",
      secondValue: "",
      expandOnClickNode: false,
      rightMaskShow: true,
      nodeClickFlag: false, //判断节点是否被点击
      treeNodeData: {}, //点击树形节点传递的数据
      addBtnClickFlag: false,
      inputSearch: "",
      // content: null,
      editorOption: {},
      accordion:true,
      defaultOnNode: [] //默认展开
    };
  },
  created() {},
  mounted() {
    this.getTreeData(this.$store.state.standardId);

  },
  methods: {
    handleNodeClick(data, node) {
      // this.defaultOnNode.push(1)
      this.treeNodeData = data;
      this.rightMaskShow = false;
      this.nodeClickFlag = true;
      this.addBtnClickFlag = false;
      if (splitStr(data.id)[0] == "menuLevel1") {
        this.firstShow = true;
        this.secondShow = false;
        this.thirdShow = false;
        this.parentShow = false;

        this.firstValue = data.label;
      } else if (splitStr(data.id)[0] == "menuLevel2") {
        this.firstShow = false;
        this.secondShow = true;
        this.thirdShow = false;
        this.parentShow = false;

        this.secondValue = data.label;
      } else if (splitStr(data.id)[0] == "menuLevel3") {
        this.firstShow = false;
        this.secondShow = false;
        this.thirdShow = true;
        this.parentShow = false;
      } else {
        this.firstShow = false;
        this.secondShow = false;
        this.thirdShow = false;
        this.parentShow = true;
        this.rightMaskShow = false;
        this.nodeClickFlag = true;
        this.parentNodeValue = data.label;
      }
      this.standardChecklistId = splitStr(data.id)[1];
      if (data.confi) {
        getCurrChecklistById({ checklistId: splitStr(data.id)[1] })
          .then(res => {
            if (res.httpStatus == 200) {
              this.form = res.result;
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
    //新增按钮
    addBtnClick() {
      if (this.nodeClickFlag) {
        this.rightMaskShow = false;
        if (splitStr(this.treeNodeData.id)[0] == "menuLevel1") {
          this.secondValue = "";
          this.firstShow = false;
          this.secondShow = true;
          this.thirdShow = false;
          this.parentShow = false;
          this.firstValue = "";
        } else if (splitStr(this.treeNodeData.id)[0] == "menuLevel2") {
          this.form = {};
          this.firstShow = false;
          this.secondShow = false;
          this.thirdShow = true;
          this.parentShow = false;
        } else if (splitStr(this.treeNodeData.id)[0] == "menuLevel3") {
        } else {
          this.firstValue = "";
          this.firstShow = true;
          this.secondShow = false;
          this.thirdShow = false;
          this.parentShow = false;
        }
        this.addBtnClickFlag = true;
      } else {
        this.$message({
          type: "info",
          message: "请选择有效父级节点"
        });
      }
    },
    onSubmit(num) {
      if (num == 1) {
        if (this.addBtnClickFlag) {
          addPrimaryMenu({
            standardId: this.standardId,
            titleName: this.firstValue
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.getTreeData(this.standardId);
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updatePrimaryMenu({
            standardPrimaryTitleId: splitStr(this.treeNodeData.id)[1],
            titleName: this.firstValue
            // standardId:this.standardId
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.getTreeData(this.standardId);
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      } else if (num == 2) {
        if (this.addBtnClickFlag) {
          addSecondaryMenu({
            standardPrimaryTitleId: splitStr(this.treeNodeData.id)[1],
            standardId: this.standardId,
            titleName: this.secondValue
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.getTreeData(this.standardId);
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updateSecondaryMenu({
            standardSecondaryTitleId: splitStr(this.treeNodeData.id)[1],
            titleName: this.secondValue
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.getTreeData(this.standardId);
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      } else {
        if (this.addBtnClickFlag) {
          addChecklist({
            checkTypeId: this.standardId,
            standardId: this.standardId,
            standardPrimaryId: this.treeNodeData.standardPrimaryId,
            standardSecondaryId: this.treeNodeData.standardSecondaryId,
            ...this.form
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.getTreeData(this.standardId);
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updateChecklist({
            standardChecklistId: this.standardChecklistId,
            ...this.form
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      }
    },
    getTreeData(id) {
      getCurrStandardDocument({
        standardId: id
      })
        .then(res => {
          this.standardId = res.result.standardId;
          if (res.httpStatus == 200) {
            this.treeData = res.result.primaryTitles.map(item => {
              return {
                id: "menuLevel1_" + item.standardPrimaryTitleId,
                label: item.titleName,
                iconShow: true,
                editIconShow: true,
                children: item.secondaryTitles.map(i => {
                  return {
                    id: "menuLevel2_" + i.standardSecondaryTitleId,
                    label: i.titleName,
                    iconShow: true,
                    editIconShow: true,
                    standardPrimaryId: i.standardPrimaryTitleId,
                    standardSecondaryId: i.standardSecondaryTitleId,
                    standardSecondaryTitle: item.titleName,
                    standardPrimaryTitle: i.titleName,
                    children: i.checklistList.map(j => {
                      if (j.selected) {
                        this.checkedList.push(j.standardChecklistId);
                      }
                      return {
                        id: "menuLevel3_" + j.standardChecklistId,
                        label: j.content,
                        confi: 1,
                        standardPrimaryId: j.standardPrimaryId,
                        standardSecondaryId: j.standardSecondaryId,
                        standardSecondaryTitle: i.titleName,
                        standardPrimaryTitle: i.titleName
                      };
                    })
                  };
                })
              };
            });
            this.treeData = [
              {
                id: "01",
                label: "资料审查",
                children: this.treeData,
                iconShow: true,
                editIconShow: false
              }
            ];
            this.defaultOnNode.push(this.treeData[0].id);
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    //删除
    deleteCon(index) {
      let id = splitStr(this.treeNodeData.id)[1];
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          if (index == 1) {
            this.deleteFirst(id);
          } else if (index == 2) {
            this.deleteSecond(id);
          } else {
            this.deleteThird(id);
          }
          this.form = {};
          this.firstShow = false;
          this.secondShow = false;
          this.thirdShow = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //删除一级
    deleteFirst(id) {
      deletedPrimaryMenu({
        id: id
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getTreeData(this.standardId);
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            msg: err
          });
        });
    },
    //删除二级
    deleteSecond(id) {
      deletedSecondaryMenu({
        id: id
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getTreeData(this.standardId);
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            msg: err
          });
        });
    },
    //删除三级
    deleteThird(id) {
      deletedChecklist({
        id: id
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getTreeData(this.standardId);
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            msg: err
          });
        });
    }
  }
};
</script>

<style lang="less">
#assessWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #fff;
  .left {
    flex: 0 0 400px;
    // height: 800px;
    height: 100%;
    border-right: 2px solid #f2f2f2;
    overflow: auto;
    font-size: 16px;
    // .leftTit{
    padding: 0 10px;
    // }
    // overflow-y:auto;
    .el-divider {
      margin: 10px 0;
    }
    .addBtn {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    .el-input {
      width: 300px;
    }
    .treeWrapper {
      height: 700px;
      overflow-y: auto;
      // overflow: hidden;
      .el-tree {
        margin-top: 10px;
        .custom-tree-node {
          position: relative;
          padding-right: 150px;
          // overflow: none;
          .iconWrapper {
            position: absolute;
            right: 0;
            font-size: 18px;
            // color: #409eff;
            cursor: pointer;
            .el-icon-edit {
              margin-left: 10px;
            }
            .el-input {
              width: 200px;
              .el-input__inner {
                width: 80%;
              }
            }
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    padding: 20px 20px 20px 30px;
    position: relative;
    .thirdInfo,
    .firstInfor,
    .firstInfor {
      width: 100%;
      height: 100%;
    }
    .el-form {
      .el-form-item__label {
        color: #000;
        font-weight: 500;
        font-size: 16px;
      }
      .btns {
        text-align: center;
        // margin-top: 100px;
      }
      .editWrapper {
        width: 100%;
        height: 100%;
        position: relative;
        margin-bottom: 100px;
        .editContent {
          width: 100%;
          height: 186px;
        }
      }
    }
    .rightMask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>