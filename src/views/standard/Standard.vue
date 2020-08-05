<template>
  <div id="standardWrapper">
    <div class="standardHeader">
      <div class="headerNav">
        <span class="navList" v-for="(item,index) in navList" :key='index' :class="{chosedNav:cindex==item.standardId}" @click="changeNav(item)">{{item.name}}</span>
      </div>
      <div class="standardSelect">
        <el-select v-model="standardValue" placeholder="请选择标准" @change="chosedStandar()">
          <el-option v-for="item in StandarOptions" :key="item.value" :label="item.label" :value="item">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="containner">
      <router-view></router-view>
      <!-- <div id="assessWrapper">
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
                    <div class="editWrapper">
                      <quill-editor v-model="form.checkContent" ref="myQuillEditor" :options="editorOption" class="editContent">
                      </quill-editor>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="适用标准 :">
                    <el-input type="textarea" :rows="13" placeholder="请输入内容" v-model="form.standardName">
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
      </div> -->
    </div>

  </div>
</template>

<script>
import { getCategorys } from "@/apis/standard";
//======================抽过来的
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
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      navList: [],
      cindex: 0,
      StandarOptions: [],
      standardValue: "",
      //==============抽过来
      // treeData: [],
      // loading: false,
      // defaultProps: {
      //   children: "children",
      //   label: "label"
      // },
      // form: {},
      // textarea: "",
      // expandAll: true,
      // formLabelWidth: "80px",
      // standardId: "",
      // standardChecklistId: "",
      // parentShow: false, //父节点
      // firstShow: false, //一级显示
      // secondShow: false, //二级显示
      // thirdShow: true, //三级显示
      // parentNodeValue: "",
      // firstValue: "",
      // secondValue: "",
      // expandOnClickNode: false,
      // rightMaskShow: true,
      // nodeClickFlag: false, //判断节点是否被点击
      // treeNodeData: {}, //点击树形节点传递的数据
      // addBtnClickFlag: false,
      // inputSearch: "",
      // // content: null,
      // editorOption: {
      //   modules: {
      //     ImageExtend: {
      //       loading: true,
      //       // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入
      //       name: "file", // 图片参数名
      //       size: 3, // 可选参数 图片大小，单位为M，1M = 1024kb
      //       // action: "http://192.168.0.200:2225/upload", // 服务器地址, 如果action为空，则采用base64插入图片
      //       action: "http://39.104.90.111:2225/upload", // 服务器地址, 如果action为空，则采用base64插入图片
      //       // response 为一个函数用来获取服务器返回的具体图片地址
      //       // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
      //       // 则 return res.data.url
      //       response: res => {
      //         //  console.log(res)
      //         const imgUrl = ImgIp + res.result;
      //         // console.log(imgUrl)
      //         return imgUrl;
      //         // return ImgIp + res.result;
      //       },
      //       // headers: xhr => {
      //       //   // xhr.setRequestHeader('myHeader','myValue')
      //       // }, // 可选参数 设置请求头部
      //       sizeError: () => {
      //         this.$message({
      //           type: "warning",
      //           message: "图片太大"
      //         });
      //       }, // 图片超过大小的回调
      //       start: () => {}, // 可选参数 自定义开始上传触发事件
      //       end: () => {}, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
      //       error: () => {
      //         this.$message({
      //           type: "warning",
      //           message: "上传失败"
      //         });
      //       }, // 可选参数 上传失败触发的事件
      //       success: () => {
      //         //  console.log(res)
      //       }, // 可选参数  上传成功触发的事件
      //       change: (xhr, formData) => {
      //         console.log(xhr);
      //         console.log(formData);
      //         return false;
      //         // xhr.setRequestHeader('myHeader','myValue')
      //         // formData.append('token', 'myToken')
      //       } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
      //     },
      //     ImageResize: {
      //       // ...
      //       // handleStyles: {
      //       //   backgroundColor: "black",
      //       //   border: "none",
      //       //   color: white
      //       //   // other camelCase styles for size display
      //       // }
      //       displaySize: true
      //     },
      //     imageDrop: true, //图片拖拽
      //     toolbar: {
      //       // 如果不上传图片到服务器，此处不必配置
      //       container: container, // container为工具栏，此次引入了全部工具栏，也可自行配置
      //       handlers: {
      //         image: function() {
      //           // 劫持原来的图片点击按钮事件
      //           QuillWatch.emit(this.quill.id);
      //         }
      //       }
      //     }
      //   }
      // },
      // accordion: true,
      // defaultOnNode: [], //默认展开
      // standardName:'',
      roles: [
        {
          id: 4,
          standardId: 4,
          name: "查验判定",
          role: true,
          path: "/index/standard/inspectionDecide",
          categoryCode:101
        },
        {
          id: 5,
          standardId: 5,
          name: "检测判定",
          role: true,
          path: "/index/standard/inspectionDecide",
          categoryCode:102
        }
      ]
    };
  },
  created() {
    this.$store.commit("saveStandardId", {});
    this.getCategorysMethods();
    // if (this.$route.path == "/index/standard/assess") {
    //   this.cindex = 0;
    // } else {
    //   this.cindex = 1;
    // }
  },
  mounted() {
    // this.changeNav(this.navList[0]);
  },

  methods: {
    changeNav(i) {
      this.cindex = i.standardId;
      if (i.role) {
        this.$router.history.push(i.path);
        this.$store.commit("saveStandardId", {
          categoryCode:i.categoryCode
        });
      } else {
        this.$store.commit("saveStandardId", {
          standardId: this.cindex,
          standardName: i.name
        });
        this.$router.history.push(i.path);
        // this.getTreeData(this.cindex);
        // this.loading = true;
        // this.form = {};
        // this.rightMaskShow = true;
        // this.firstShow = false; //一级显示
        // this.secondShow = false; //二级显示
        // this.thirdShow = true; //三级显示
        // this.nodeClickFlag = false;
      }

      // this.$router.history.push(i.path);
    },
    // chosedStandar() {},
    // 获取验收方式
    getCategorysMethods() {
      getCategorys()
        .then(res => {
          if (res.httpStatus == 200) {
            this.navList = res.result.map((item, index) => {
              return {
                id: index,
                standardId: item.standard.standardId,
                name: item.categoryName,
                role: false,
                path: "/index/standard/assess"
              };
            });
            this.navList = this.navList.concat(this.roles);
            this.cindex = this.navList[0].standardId;
            // this.standardName = this.navList[0].name;
            this.$store.commit("saveStandardId", {
              standardId: this.cindex,
              standardName: this.navList[0].name
            });
            this.$router.history.push("/index/standard/assess");
            // this.getTreeData(this.cindex);
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    }
    //=============================抽过来的页面

    //  methods: {
    // handleNodeClick(data, node) {
    //   this.treeNodeData = data;
    //   this.rightMaskShow = false;
    //   this.nodeClickFlag = true;
    //   this.addBtnClickFlag = false;
    //   if (splitStr(data.id)[0] == "menuLevel1") {
    //     this.firstShow = true;
    //     this.secondShow = false;
    //     this.thirdShow = false;
    //     this.parentShow = false;

    //     this.firstValue = data.label;
    //   } else if (splitStr(data.id)[0] == "menuLevel2") {
    //     this.firstShow = false;
    //     this.secondShow = true;
    //     this.thirdShow = false;
    //     this.parentShow = false;

    //     this.secondValue = data.label;
    //   } else if (splitStr(data.id)[0] == "menuLevel3") {
    //     this.firstShow = false;
    //     this.secondShow = false;
    //     this.thirdShow = true;
    //     this.parentShow = false;
    //   } else {
    //     this.firstShow = false;
    //     this.secondShow = false;
    //     this.thirdShow = false;
    //     this.parentShow = true;
    //     this.rightMaskShow = false;
    //     this.nodeClickFlag = true;
    //     this.parentNodeValue = data.label;
    //   }
    //   this.standardChecklistId = splitStr(data.id)[1];
    //   if (data.confi) {
    //     getCurrChecklistById({ checklistId: splitStr(data.id)[1] })
    //       .then(res => {
    //         if (res.httpStatus == 200) {
    //           this.form = res.result;
    //         }
    //       })
    //       .catch(err => {
    //         this.$message({
    //           type: "warning",
    //           message: err.msg
    //         });
    //       });
    //   }
    // },
    // //新增按钮
    // addBtnClick() {
    //   if (this.nodeClickFlag) {
    //     this.rightMaskShow = false;
    //     if (splitStr(this.treeNodeData.id)[0] == "menuLevel1") {
    //       this.secondValue = "";
    //       this.firstShow = false;
    //       this.secondShow = true;
    //       this.thirdShow = false;
    //       this.parentShow = false;
    //       this.firstValue = "";
    //     } else if (splitStr(this.treeNodeData.id)[0] == "menuLevel2") {
    //       this.form = {
    //         subPart: this.treeNodeData.standardSecondaryTitle,
    //         subProject: this.treeNodeData.standardPrimaryTitle
    //       };
    //       this.firstShow = false;
    //       this.secondShow = false;
    //       this.thirdShow = true;
    //       this.parentShow = false;
    //     } else if (splitStr(this.treeNodeData.id)[0] == "menuLevel3") {
    //     } else {
    //       this.firstValue = "";
    //       this.firstShow = true;
    //       this.secondShow = false;
    //       this.thirdShow = false;
    //       this.parentShow = false;
    //     }
    //     this.addBtnClickFlag = true;
    //   } else {
    //     this.$message({
    //       type: "info",
    //       message: "请选择有效父级节点"
    //     });
    //   }
    // },
    // onSubmit(num) {
    //   if (num == 1) {
    //     if (this.addBtnClickFlag) {
    //       addPrimaryMenu({
    //         standardId: this.standardId,
    //         titleName: this.firstValue
    //       })
    //         .then(res => {
    //           if (res.httpStatus == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "添加成功"
    //             });
    //             this.getTreeData(this.standardId);
    //           }
    //         })
    //         .catch(err => {
    //           this.$message({
    //             type: "warning",
    //             message: err.msg
    //           });
    //         });
    //     } else {
    //       updatePrimaryMenu({
    //         standardPrimaryTitleId: splitStr(this.treeNodeData.id)[1],
    //         titleName: this.firstValue
    //         // standardId:this.standardId
    //       })
    //         .then(res => {
    //           if (res.httpStatus == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "修改成功"
    //             });
    //             this.getTreeData(this.standardId);
    //           } else {
    //             this.$message({
    //               type: "info",
    //               message: "请检查填写项"
    //             });
    //           }
    //         })
    //         .catch(err => {
    //           this.$message({
    //             type: "warning",
    //             message: err.msg
    //           });
    //         });
    //     }
    //   } else if (num == 2) {
    //     if (this.addBtnClickFlag) {
    //       addSecondaryMenu({
    //         standardPrimaryTitleId: splitStr(this.treeNodeData.id)[1],
    //         standardId: this.standardId,
    //         titleName: this.secondValue
    //       })
    //         .then(res => {
    //           if (res.httpStatus == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "添加成功"
    //             });
    //             this.getTreeData(this.standardId);
    //           }
    //         })
    //         .catch(err => {
    //           this.$message({
    //             type: "warning",
    //             message: err.msg
    //           });
    //         });
    //     } else {
    //       updateSecondaryMenu({
    //         standardSecondaryTitleId: splitStr(this.treeNodeData.id)[1],
    //         titleName: this.secondValue
    //       })
    //         .then(res => {
    //           if (res.httpStatus == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "修改成功"
    //             });
    //             this.getTreeData(this.standardId);
    //           }
    //         })
    //         .catch(err => {
    //           this.$message({
    //             type: "warning",
    //             message: err.msg
    //           });
    //         });
    //     }
    //   } else {
    //     if (this.addBtnClickFlag) {
    //       addChecklist({
    //         checkTypeId: this.standardId,
    //         standardId: this.standardId,
    //         standardPrimaryId: this.treeNodeData.standardPrimaryId,
    //         standardSecondaryId: this.treeNodeData.standardSecondaryId,
    //         ...this.form
    //       })
    //         .then(res => {
    //           if (res.httpStatus == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "添加成功"
    //             });
    //             this.getTreeData(this.standardId);
    //           }
    //         })
    //         .catch(err => {
    //           this.$message({
    //             type: "warning",
    //             message: err.msg
    //           });
    //         });
    //     } else {
    //       console.log(this.form);

    //       updateChecklist({
    //         standardChecklistId: this.standardChecklistId,
    //         ...this.form
    //       })
    //         .then(res => {
    //           if (res.httpStatus == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "修改成功"
    //             });
    //           }
    //         })
    //         .catch(err => {
    //           this.$message({
    //             type: "warning",
    //             message: err.msg
    //           });
    //         });
    //     }
    //   }
    // },
    // getTreeData(id) {
    //   getCurrStandardDocument({
    //     standardId: id
    //   })
    //     .then(res => {
    //       console.log(res);
    //       this.standardId = res.result.standardId;
    //       if (res.httpStatus == 200) {
    //         this.loading = false;
    //         this.treeData = res.result.primaryTitles.map(item => {
    //           return {
    //             id: "menuLevel1_" + item.standardPrimaryTitleId,
    //             label: item.titleName,
    //             iconShow: true,
    //             editIconShow: true,
    //             sort: item.sort,
    //             children: item.secondaryTitles.map(i => {
    //               return {
    //                 id: "menuLevel2_" + i.standardSecondaryTitleId,
    //                 label: i.titleName,
    //                 iconShow: true,
    //                 editIconShow: true,
    //                 standardPrimaryId: i.standardPrimaryTitleId,
    //                 standardSecondaryId: i.standardSecondaryTitleId,
    //                 standardSecondaryTitle: item.titleName,
    //                 standardPrimaryTitle: i.titleName,
    //                 sort: item.sort,
    //                 children: i.checklistList.map(j => {
    //                   if (j.selected) {
    //                     this.checkedList.push(j.standardChecklistId);
    //                   }
    //                   return {
    //                     id: "menuLevel3_" + j.standardChecklistId,
    //                     label: j.content,
    //                     confi: 1,
    //                     standardPrimaryId: j.standardPrimaryId,
    //                     standardSecondaryId: j.standardSecondaryId,
    //                     standardSecondaryTitle: i.titleName,
    //                     standardPrimaryTitle: i.titleName,
    //                     sort: item.sort
    //                   };
    //                 })
    //               };
    //             })
    //           };
    //         });
    //         this.treeData = [
    //           {
    //             id: "01",
    //             label: this.standardName,
    //             children: this.treeData,
    //             iconShow: true,
    //             editIconShow: false
    //           }
    //         ];
    //         this.defaultOnNode.push(this.treeData[0].id);
    //       }
    //     })
    //     .catch(err => {
    //       this.$message({
    //         type: "warning",
    //         message: err.msg
    //       });
    //     });
    // },
    // //删除
    // deleteCon(index) {
    //   let id = splitStr(this.treeNodeData.id)[1];
    //   this.$confirm("确定删除, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "info"
    //   })
    //     .then(() => {
    //       if (index == 1) {
    //         this.deleteFirst(id);
    //       } else if (index == 2) {
    //         this.deleteSecond(id);
    //       } else {
    //         this.deleteThird(id);
    //       }
    //       this.form = {};
    //       this.firstShow = false;
    //       this.secondShow = false;
    //       this.thirdShow = true;
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消操作"
    //       });
    //     });
    // },
    // //删除一级
    // deleteFirst(id) {
    //   deletedPrimaryMenu({
    //     id: id
    //   })
    //     .then(res => {
    //       if (res.httpStatus == 200) {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功"
    //         });
    //         this.getTreeData(this.standardId);
    //       }
    //     })
    //     .catch(err => {
    //       this.$message({
    //         type: "warning",
    //         msg: err
    //       });
    //     });
    // },
    // //删除二级
    // deleteSecond(id) {
    //   deletedSecondaryMenu({
    //     id: id
    //   })
    //     .then(res => {
    //       if (res.httpStatus == 200) {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功"
    //         });
    //         this.getTreeData(this.standardId);
    //       }
    //     })
    //     .catch(err => {
    //       this.$message({
    //         type: "warning",
    //         msg: err
    //       });
    //     });
    // },
    // //删除三级
    // deleteThird(id) {
    //   deletedChecklist({
    //     id: id
    //   })
    //     .then(res => {
    //       if (res.httpStatus == 200) {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功"
    //         });
    //         this.getTreeData(this.standardId);
    //       }
    //     })
    //     .catch(err => {
    //       this.$message({
    //         type: "warning",
    //         msg: err
    //       });
    //     });
    // },
    // //拖拽

    // allowDrop(draggingNode, dropNode, type) {
    //   // console.log(draggingNode,dropNode,type)
    //   // console.log(draggingNode.level)
    //   // console.log(dropNode.level)
    //   if (draggingNode.level === dropNode.level) {
    //     //aboveId是父节点id
    //     if (draggingNode.data.aboveId === dropNode.data.aboveId) {
    //       return type === "prev" || type === "next";
    //     } else {
    //       return false;
    //     }
    //   } else {
    //     // 不同级进行处理
    //     return false;
    //   }
    // },
    // //成功
    // successDrag(draggingNode, dropNode, type) {
    //   // console.log(this.treeData)
    //   // console.log(dropNode.parent.childNodes);
    //   let sortsVo = dropNode.parent.childNodes.map((item, index) => {
    //     console.log(item.data.id);
    //     return {
    //       id: splitStr(item.data.id)[1],
    //       sort: index
    //     };
    //   });

    //   //   "sortsVo":
    //   // {
    //   //   "id": "string",
    //   //   "sort": 0
    //   // }
    //   // console.log(dropNode);
    //   // console.log(type);
    //   // let num = 0;
    //   // // if()
    //   // dropNode.parent.childNodes.forEach((item, index) => {
    //   //   // console.log(index);
    //   //   if (dropNode.data.id == item.data.id) {
    //   //     // console.log(dropNode.data.id);
    //   //     // console.log(item.data.id);
    //   //     // console.log(item.data.label);
    //   //     // console.log(index);
    //   //     num = index + 1;
    //   //     if (type == "after") {
    //   //       num += 1;
    //   //     } else {
    //   //       num -= 1;
    //   //       num = num < 1 ? 1 : num;
    //   //     }
    //   //     // console.log(num)
    //   //   }
    //   // });

    //   if (splitStr(draggingNode.data.id)[0] == "menuLevel1") {
    //     // if(type=='before'){
    //     //   num = dropNode.data.sort
    //     // }else{
    //     //   num = dropNode.data.sort - 1
    //     // }

    //     updatePrimaryMenu({
    //       standardPrimaryTitleId: splitStr(draggingNode.data.id)[1],
    //       sortsVo: sortsVo
    //     })
    //       .then(res => {
    //         if (res.httpStatus == 200) {
    //           this.$message({
    //             type: "success",
    //             message: "操作成功"
    //           });
    //           this.getTreeData(this.standardId);
    //         }
    //       })
    //       .catch(err => {
    //         this.$message({
    //           type: "info",
    //           message: "网络请求失败"
    //         });
    //       });
    //   } else if (splitStr(draggingNode.data.id)[0] == "menuLevel2") {
    //     updateSecondaryMenu({
    //       standardSecondaryTitleId: splitStr(draggingNode.data.id)[1],
    //       sortsVo: sortsVo
    //     })
    //       .then(res => {
    //         if (res.httpStatus == 200) {
    //           this.$message({
    //             type: "success",
    //             message: "操作成功"
    //           });
    //           this.getTreeData(this.standardId);
    //         }
    //       })
    //       .catch(err => {
    //         this.$message({
    //           type: "info",
    //           message: "网络请求失败"
    //         });
    //       });
    //   } else {
    //     updateChecklist({
    //       standardChecklistId: splitStr(draggingNode.data.id)[1],
    //       sortsVo: sortsVo
    //     })
    //       .then(res => {
    //         if (res.httpStatus == 200) {
    //           this.$message({
    //             type: "success",
    //             message: "操作成功"
    //           });
    //           this.getTreeData(this.standardId);
    //         }
    //       })
    //       .catch(err => {
    //         this.$message({
    //           type: "info",
    //           message: "网络请求失败"
    //         });
    //       });
    //   }
    // }
    //拖拽失败
    // failDrag() {
    //   this.$message({
    //     type: "info",
    //     message: "只能在当前节点拖拽"
    //   });
    // }
    // },
  }
};
</script>

<style lang="less">
#standardWrapper {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // position: relative;
  .standardHeader {
    flex: 0 0 40px;
    position: relative;
    .headerNav {
      width: 100%;
      // flex: 0 0 40px;
      line-height: 40px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      .navList {
        display: inline-block;
        width: 120px;
        text-align: center;
        border-right: 2px solid #f2f2f2;
        cursor: pointer;
      }
      .chosedNav {
        background-color: #409eff;
        color: #fff;
      }
    }

    .standardSelect {
      position: absolute;
      width: 250px;
      height: 40px;
      left: 1100px;
      top: -70px;
      border-radius: 10px;
      .el-input__inner {
        background-color: #000;
      }
    }
  }
  .containner {
    margin-top: 10px;
    flex: 1;
  }
}
</style>