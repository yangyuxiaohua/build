<template>
  <div id="assessWrapper">
    <div class="left" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="addBtn">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="inputSearch">
        </el-input>
        <el-button type="primary" plain @click="addBtnClick()">新增</el-button>
      </div>
      <el-divider></el-divider>
      <div class="treeWrapper">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node='expandOnClickNode' :accordion='accordion' node-key="id" :default-expanded-keys="defaultOnNode" draggable :allow-drop='allowDrop' @node-drop='successDrag'>
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
        <el-form ref="form" :model="form" label-width="120px">
          <el-row v-show="showData">
            <el-col :span="24">
              <el-form-item label="现场评定标识 :">
                <el-input v-model="form.copyStandardChecklistId"></el-input>
              </el-form-item>
            </el-col>

          </el-row>

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
                <div class="editWrapper">
                  <quill-editor v-model="form.checkContent" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="适用标准 :">
                <!-- <el-input type="textarea" :rows="13" placeholder="请输入内容" v-model="form.checkTypeId">

                </el-input> -->

                <el-radio-group v-model="form.checkTypeId">
                  <el-radio :label="item.value" v-for="item in StandarOptions" :key='item.value'>{{item.name}}</el-radio>
                  <!-- <el-radio label="v1">现行标准</el-radio> -->
                </el-radio-group>
              </el-form-item>
              <el-form-item label="标准名称 :">
                <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="form.standardName">

                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="记录模板 :">
                <div class="editWrapper">
                  <quill-editor v-model="form.remark" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="适用项目 :">
                <el-input type="textarea" :rows="13" placeholder="请输入内容" v-model="form.withProjects">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="评定规则 :">
                <div class="editWrapper">
                  <quill-editor v-model="form.rules" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="抽样要求 :">
                <el-input type="textarea" :rows="13" placeholder="请输入内容" v-model="form.samplingRequires">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="技术要求 :">
                <div class="editWrapper">
                  <quill-editor v-model="form.technologyRequires" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div>
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
    <div class="cloneBtn ">
      <el-button type="primary" size="small" @click="dialogFormVisible = true" v-show="showCopyBtn">复制</el-button>
      <el-dialog title="" :visible.sync="dialogFormVisible">
        <el-radio v-model="copyRadio" label="standard_001">复制到现场评定</el-radio>
        <el-radio v-model="copyRadio" label="standard_003">复制到竣工查验</el-radio>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="cloneCheckList">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="standardSelect">
        <el-select v-model="version" placeholder="请选择标准" @change="chosedStandard()">
          <el-option v-for="item in StandarOptions" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
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
  deletedChecklist,
  copyChecklist
} from "@/apis/standard";
import { uploadIp, ImgIp } from "@/apis/upload";
import { splitStr } from "@/utils/publictool";
//富文本
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
import { ImageDrop } from "quill-image-drop-module";
import { ImageResize } from "quill-image-resize-module";
import { quillRedefine } from "vue-quill-editor-upload"; //引入图片上传
Quill.register("modules/ImageExtend", ImageExtend);
Quill.register("modules/ImageResize", ImageResize);
Quill.register("modules/imageDrop", ImageDrop);
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
//======================================================
var Align = Quill.import("attributors/style/align");
Align.whitelist = ["right", "center", "justify"];
Quill.register(Align, true);
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      treeData: [],
      loading: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {},
      textarea: "",
      expandAll: true,
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
      showData: false, // 现场评定标识在资料审查不用显示
      // content: null,
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入
            name: "file", // 图片参数名
            size: 3, // 可选参数 图片大小，单位为M，1M = 1024kb
            // action: "http://192.168.0.200:2225/upload", // 服务器地址, 如果action为空，则采用base64插入图片
            action: "http://39.104.90.111:2225/upload", // 服务器地址, 如果action为空，则采用base64插入图片
            // response 为一个函数用来获取服务器返回的具体图片地址
            // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
            // 则 return res.data.url
            response: res => {
              //  console.log(res)
              const imgUrl = ImgIp + res.result;
              // console.log(imgUrl)
              return imgUrl;
              // return Ip + res.result;
            },
            // headers: xhr => {
            //   // xhr.setRequestHeader('myHeader','myValue')
            // }, // 可选参数 设置请求头部
            sizeError: () => {
              this.$message({
                type: "warning",
                message: "图片太大"
              });
            }, // 图片超过大小的回调
            start: () => {}, // 可选参数 自定义开始上传触发事件
            end: () => {}, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
            error: () => {
              this.$message({
                type: "warning",
                message: "上传失败"
              });
            }, // 可选参数 上传失败触发的事件
            success: () => {
              //  console.log(res)
            }, // 可选参数  上传成功触发的事件
            change: (xhr, formData) => {
              console.log(xhr);
              console.log(formData);
              return false;
              // xhr.setRequestHeader('myHeader','myValue')
              // formData.append('token', 'myToken')
            } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },
          ImageResize: {
            // ...
            // handleStyles: {
            //   backgroundColor: "black",
            //   border: "none",
            //   color: white
            //   // other camelCase styles for size display
            // }
            displaySize: true
          },
          imageDrop: true, //图片拖拽
          // toolbar: {
          //   // 如果不上传图片到服务器，此处不必配置
          //   container: container, // container为工具栏，此次引入了全部工具栏，也可自行配置
          //   handlers: {
          //     image: function() {
          //       // 劫持原来的图片点击按钮事件
          //       QuillWatch.emit(this.quill.id);
          //     }
          //   }
          // }
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [
              {
                size: [
                  "12px",
                  "14px",
                  false,
                  "18px",
                  "22px",
                  "26px",
                  "30px",
                  "36px",
                  "42px"
                ]
              }
            ],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            // ["link", "image", "video"]
            ["image"]
          ]
        }
      },
      accordion: true,
      defaultOnNode: [], //默认展开,
      standardName: "",
      showCopyBtn: false,
      dialogFormVisible: false,
      copyRadio: "",
      StandarOptions: [
        {name:'原有标准',value:'v0'},
        {name:'现行标准',value:'v1'}
      ],//标准
      version: 'v1',
    };
  },
  created() {
    if (this.$store.state.standardId.standardId) {
      this.loading = true;
      this.standardName = this.$store.state.standardId.standardName;
      if (this.standardName == "资料核查") {
        this.showData = false;
      } else {
        this.showData = true;
      }
      this.getTreeData(this.$store.state.standardId.standardId);
    }
  },
  mounted() {},
  methods: {
    //点击树形节点
    handleNodeClick(data, node) {
      // console.log(this.$store.state.standardId.standardId)

      this.showCopyBtn = false;
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

        // 判断是否显示复制按钮
        if (this.$store.state.standardId.standardName == "消防检测") {
          this.showCopyBtn = true;
        }
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
            // console.log(res);
            if (res.httpStatus == 200) {
              this.form = res.result;
              let copyStandardChecklistId = "";
              switch (this.standardName) {
                case "竣工查验":
                  this.form.copyStandardChecklistId = res.result
                    .copyStandardChecklistId
                    ? res.result.copyStandardChecklistId
                    : "";
                  break;
                case "消防检测":
                  this.form.copyStandardChecklistId = res.result
                    .copyStandardChecklistId
                    ? res.result.copyStandardChecklistId
                    : "";
                  break;
                default:
                  this.form.copyStandardChecklistId =
                    res.result.standardChecklistId;
              }
            }
          })
          .catch(err => {
            this.$message({
              type: "warning",
              message: err
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
          this.form = {
            subPart: this.treeNodeData.standardSecondaryTitle,
            subProject: this.treeNodeData.standardPrimaryTitle
          };
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
              } else {
                this.$message({
                  type: "info",
                  message: "请检查填写项"
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
        // 复制标准
        if (
          this.standardName == "现场评定" ||
          this.standardName == "资料核查"
        ) {
          this.form.copyStandardChecklistId = null;
        }
        if (this.addBtnClickFlag) {
          addChecklist({
            // checkTypeId: this.standardId,
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
          // console.log(this.form);

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
        standardId: id,
        version:this.version
      })
        .then(res => {
          // console.log(res);
          this.standardId = res.result.standardId;
          if (res.httpStatus == 200) {
            this.loading = false;
            this.treeData = res.result.primaryTitles.map(item => {
              return {
                id: "menuLevel1_" + item.standardPrimaryTitleId,
                label: item.titleName,
                iconShow: true,
                editIconShow: true,
                sort: item.sort,
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
                    sort: item.sort,
                    children: i.checklistList.map(j => {
                      if (j.selected) {
                        this.checkedList.push(j.standardChecklistId);
                      }
                      // console.log(j)

                      return {
                        id: "menuLevel3_" + j.standardChecklistId,
                        label: j.content,
                        confi: 1,
                        standardPrimaryId: j.standardPrimaryId,
                        standardSecondaryId: j.standardSecondaryId,
                        standardSecondaryTitle: i.titleName,
                        standardPrimaryTitle: i.titleName,
                        sort: item.sort
                      };
                    })
                  };
                })
              };
            });
            // console.log(this.treeData);
            this.treeData = [
              {
                id: "01",
                label: this.standardName,
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
            message: err
          });
        });
    },
    //筛选标准
    chosedStandard(){
        this.loading = true;
      this.getTreeData(this.standardId);
      this.form = {};
      this.rightMaskShow = true;
      this.parentShow = false; //父节点
        this.firstShow = false; //一级显示
      this.secondShow = false; //二级显示
      this.thirdShow = true; //三级显示
      this.nodeClickFlag = false;
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
    },
    //拖拽

    allowDrop(draggingNode, dropNode, type) {
      // console.log(draggingNode,dropNode,type)
      // console.log(draggingNode.level)
      // console.log(dropNode.level)
      if (draggingNode.level === dropNode.level) {
        //aboveId是父节点id
        if (draggingNode.data.aboveId === dropNode.data.aboveId) {
          return type === "prev" || type === "next";
        } else {
          return false;
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },
    //成功
    successDrag(draggingNode, dropNode, type) {
      // console.log(this.treeData)
      // console.log(dropNode.parent.childNodes);
      let sortsVo = dropNode.parent.childNodes.map((item, index) => {
        console.log(item.data.id);
        return {
          id: splitStr(item.data.id)[1],
          sort: index
        };
      });

      //   "sortsVo":
      // {
      //   "id": "string",
      //   "sort": 0
      // }
      // console.log(dropNode);
      // console.log(type);
      // let num = 0;
      // // if()
      // dropNode.parent.childNodes.forEach((item, index) => {
      //   // console.log(index);
      //   if (dropNode.data.id == item.data.id) {
      //     // console.log(dropNode.data.id);
      //     // console.log(item.data.id);
      //     // console.log(item.data.label);
      //     // console.log(index);
      //     num = index + 1;
      //     if (type == "after") {
      //       num += 1;
      //     } else {
      //       num -= 1;
      //       num = num < 1 ? 1 : num;
      //     }
      //     // console.log(num)
      //   }
      // });

      if (splitStr(draggingNode.data.id)[0] == "menuLevel1") {
        // if(type=='before'){
        //   num = dropNode.data.sort
        // }else{
        //   num = dropNode.data.sort - 1
        // }

        updatePrimaryMenu({
          standardPrimaryTitleId: splitStr(draggingNode.data.id)[1],
          sortsVo: sortsVo
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getTreeData(this.standardId);
            }
          })
          .catch(err => {
            this.$message({
              type: "info",
              message: "网络请求失败"
            });
          });
      } else if (splitStr(draggingNode.data.id)[0] == "menuLevel2") {
        updateSecondaryMenu({
          standardSecondaryTitleId: splitStr(draggingNode.data.id)[1],
          sortsVo: sortsVo
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getTreeData(this.standardId);
            }
          })
          .catch(err => {
            this.$message({
              type: "info",
              message: "网络请求失败"
            });
          });
      } else {
        updateChecklist({
          standardChecklistId: splitStr(draggingNode.data.id)[1],
          sortsVo: sortsVo
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getTreeData(this.standardId);
            }
          })
          .catch(err => {
            this.$message({
              type: "info",
              message: "网络请求失败"
            });
          });
      }
    },
    //复制标准
    cloneCheckList() {
      copyChecklist({
        checklistId: this.standardChecklistId,
        targetStandardId: this.copyRadio
      })
        .then(res => {
          if (res.httpStatus == 200) {
            // console.log(res)
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "复制成功"
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err.msg
          });
        });
      // console.log(111)
      // this.dialogFormVisible = false
    }
    // //拖拽失败
    // failDrag() {
    //   this.$message({
    //     type: "info",
    //     message: "只能在当前节点拖拽"
    //   });
    // }
  },
  computed: {
    getStandard() {
      return this.$store.state.standardId;
    }
  },
  watch: {
    getStandard: function(val1, val2) {
      this.loading = true;
      this.standardName = val1.standardName;
      if (this.standardName == "资料核查") {
        this.showData = false;
      } else {
        this.showData = true;
      }
      this.getTreeData(val1.standardId);
      this.form = {};
      this.rightMaskShow = true;
      (this.parentShow = false), //父节点
        (this.firstShow = false); //一级显示
      this.secondShow = false; //二级显示
      this.thirdShow = true; //三级显示
      this.nodeClickFlag = false;
    }
  }
};
</script>

<style lang="less">
#assessWrapper {
  width: 100%;
  height: 100%;
  // overflow: hidden;
  display: flex;
  background-color: #fff;
  position: relative;
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
      // height: 1400px;
      min-height: 720px;
      max-height: 1400px;
      overflow-y: auto;
      // background-color: red;
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
    .treeWrapper::-webkit-scrollbar {
      width: 4px;
      display: none;
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
      overflow-y: auto;
      // position: absolute;
    }
    .el-form {
      width: 100%;
      height: 100%;
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
  .cloneBtn {
    position: absolute;
    right: 10px;
    top: -46px;
  }
  .ql-editor {
    white-space: normal !important;
  }

  .ql-container {
    white-space: pre-wrap !important;
  }
   .standardSelect {
      position: absolute;
      width: 250px;
      height: 40px;
      left: 1100px;
      top: -120px;
      border-radius: 10px;
      .el-input__inner {
        background-color: #000;
      }
    }
}
</style>