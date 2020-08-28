<template>
  <div id="newsWrapper">
    <div class="lawsTab">
      <div class="lawsTabTit">
        <span class="infotype">消息类型</span>
        <span class="titText">标题</span>
        <span class="releaseUnit">发布人</span>
        <span class="releaseTime">发布时间</span>
        <span class="status">状态</span>
        <span class="handle">操作</span>
      </div>
      <div class="lawsCon">
        <div class="laws" v-for="(item,index) in lawsList" :key='index'>
          <span class="infotype">{{item.type}}</span>
          <span class="titText">{{item.title}}</span>
          <span class="releaseUnit">{{item.createUsername}}</span>
          <span class="releaseTime">{{item.createTime}}</span>
          <!-- <span class="status">{{item.status }}</span> -->
          <span class="status">{{item.status == '1'? '未读' : '已读' }}</span>
          <span class="handle">
            <span @click="lookLaw(item)">详情</span>
            <span @click="deleteLaw(item.id)" v-show="roleShow">删除</span>
          </span>
        </div>
      </div>
    </div>
    <div class="paging">
      <el-pagination background layout="prev, pager, next" :total="lawsTotal" :pager-count="pageCount" :page-size='lawsCurrentNum' :current-page.sync='lawsCurrentPage' @current-change='lawsCurrentChange2'>
      </el-pagination>
    </div>
    <div class="mask" v-show='maskShow'>
      <div class="maskContainer">
        <div class="maskHeader">
          <span>消息详情</span>
          <i class="el-icon-close closeIcon" @click="closeMask"></i>
        </div>
        <div class="titBox">
          <div class="h2Box">
            <h3>{{form.title}}</h3>
          </div>

          <div class="factoryNameTime">
            <span>{{form.createUsername}}</span>
            <span>{{form.createTime}}</span>
          </div>
        </div>
        <div class="lawsContainer" v-html="lawsContent"></div>
        <div class="maskBtns">
          <!-- <el-button type="primary" @click="modifyLaw()">修改</el-button> -->
          <el-button type="primary" plain @click="returnList()">返回</el-button>
        </div>
      </div>
    </div>
    <div class="releaseBtn" v-show="roleShow">
      <el-button type="primary" plain @click="addLaws">发布</el-button>
    </div>
    <div class="lawsFormMask" v-show="lawsFormMaskShow">
      <div class="maskContainer">
        <div class="maskHeader">
          <span>消息详情</span>
          <i class="el-icon-close closeIcon" @click="closeMask"></i>
        </div>
        <div class="lawsForm mg20">
          <el-row>
            <el-col :span="16">
              <el-form ref="form" :model="form" label-width="80px">
                <el-row>
                  <el-col :span="18">
                    <el-form-item label="标题">
                      <el-input v-model="form.title"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="类型">
                      <el-select v-model="form.regionId" placeholder="请选择类型">
                        <el-option v-for="(item,index) in typeOptions" :key="index" :label="item.name" :value="item.id">
                        </el-option>

                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="内容">
                    <div class="editWrapper">
                      <!-- <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" class="editContent">
                      </quill-editor> -->
                      <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="form.content">
                      </el-input>
                    </div>
                  </el-form-item>
                </el-row>

              </el-form>
            </el-col>
            <el-col :span="8" class="marL10">
              <p class="acceptPersonText">接收人员</p>
              <div class="treeWrapper">
                <el-tree :data="acceptancePersonData" show-checkbox ref="personTree" highlight-current :props="partDefaultProps" :default-checked-keys='checkedPersonList' :expand-on-click-node='expandOnClickNode' :check-on-click-node="checkOnClickNode" :check-strictly='checkStrictly' node-key="id" :default-expanded-keys="defaultOnNode">
                </el-tree>
              </div>
            </el-col>
          </el-row>

        </div>
        <div class="maskBtns">
          <el-button type="primary" @click="sumit()">提交</el-button>
          <el-button type="primary" plain @click="returnList">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pageByCondition, deletedNews, getNews, sendNews } from "@/apis/news";
import { splitStr } from "@/utils/publictool";
// import { getRegions } from "@/apis/project.js";
import { getFactoryMenus } from "@/apis/userUnit.js";
import { getTime } from "@/utils/publictool";
// import { uploadIp, ImgIp } from "@/apis/upload";
// //富文本
// import { quillEditor, Quill } from "vue-quill-editor";
// import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
// import { ImageDrop } from "quill-image-drop-module";
// import { ImageResize } from "quill-image-resize-module";
// import { quillRedefine } from "vue-quill-editor-upload"; //引入图片上传
// Quill.register("modules/ImageExtend", ImageExtend);
// Quill.register("modules/ImageResize", ImageResize);
// Quill.register("modules/imageDrop", ImageDrop);
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
export default {
  // components: {
  //   quillEditor
  // },
  data() {
    return {
      lawsList: [], //法规列表
      lawsCurrentPage: 1, //当前页
      lawsCurrentNum: 10, //每页显示条数
      pageCount: 5, // 按钮数
      lawsTotal: 0, //总条数
      maskShow: false, //详情蒙版
      lawsContent: "", // 法律法规的内容
      lawsFormMaskShow: false, // 发布蒙版
      form: {}, // 发布修改的表单
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
      //         // return Ip + res.result;
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
      //     // toolbar: {
      //     //   // 如果不上传图片到服务器，此处不必配置
      //     //   container: container, // container为工具栏，此次引入了全部工具栏，也可自行配置
      //     //   handlers: {
      //     //     image: function() {
      //     //       // 劫持原来的图片点击按钮事件
      //     //       QuillWatch.emit(this.quill.id);
      //     //     }
      //     //   }
      //     // }
      //     toolbar: [
      //       ["bold", "italic", "underline", "strike"],
      //       ["blockquote", "code-block"],
      //       [{ header: 1 }, { header: 2 }],
      //       [{ list: "ordered" }, { list: "bullet" }],
      //       [{ script: "sub" }, { script: "super" }],
      //       [{ indent: "-1" }, { indent: "+1" }],
      //       [{ direction: "rtl" }],
      //       [
      //         {
      //           size: [
      //             "12px",
      //             "14px",
      //             false,
      //             "18px",
      //             "22px",
      //             "26px",
      //             "30px",
      //             "36px",
      //             "42px"
      //           ]
      //         }
      //       ],
      //       [{ header: [1, 2, 3, 4, 5, 6, false] }],
      //       [{ color: [] }, { background: [] }],
      //       [{ font: [] }],
      //       [{ align: [] }],
      //       ["clean"],
      //       // ["link", "image", "video"]
      //       ["image"]
      //     ]
      //   }
      // },
      // addFlag: false, // 增加还是修改
      // countyOptions: [], //区域
      // btnShow: false ,//权限控制
      defaultOnNode: [], //人员默认展开
      checkStrictly: false, //父子之间不关联
      expandOnClickNode: false, //只有点击三角展开
      checkOnClickNode: false, //点击节点选中
      acceptancePersonData: [], // 人员列表
      partDefaultProps: {
        children: "departments",
        label: "partsName",
        disabled: "disabled"
      },
      checkedPersonList: [], // 默认选中人员
      typeOptions: [{ name: "公告", id: 1 }, { name: "通知", id: 5 }],
      roleShow: false
    };
  },
  created() {
    this.lawsCurrentChange(this.lawsCurrentPage);
    this.roleControl();
  },
  methods: {
    //权限控制
    roleControl() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode != 500 && roleCode != 700 && roleCode != 900) {
        this.roleShow = true;
      } else {
        this.roleShow = false;
      }
      
    },
    //分页
    lawsCurrentChange(val) {
      val = val < 1 ? 1 : val;
      pageByCondition({
        size: this.lawsCurrentNum,
        start: val
      })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
            this.lawsTotal = res.result.countRows;
            this.lawsList = res.result.result.notices.map(item => {
              item.createTime = getTime(item.createTime);
              let type = "";
              switch (item.type) {
                case 1:
                  type = "公告";
                  break;
                case 5:
                  type = "通知";
                  break;
                default:
                  type = "提醒";
              }
              item.type = type;
              return item;
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "287网络请求失败"
          });
        });
    },
    lawsCurrentChange2(val) {
      this.lawsCurrentChange(val);
    },
    //关闭蒙版
    closeMask() {
      this.maskShow = false;
      this.lawsFormMaskShow = false;
    },
    // 查看详情
    lookLaw(i) {
      this.maskShow = true;
      this.lawsContent = i.content;
      this.form = i;
      this.expenseNews(i.id);
    },
    //删除
    deleteLaw(id) {
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          deletedNews({
            id
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                if (this.lawsList.length == 1) {
                  this.lawsCurrentChange(this.lawsCurrentPage - 1);
                } else {
                  this.lawsCurrentChange(this.lawsCurrentPage);
                }
                // this.getLastFactoryMenus();
              } else {
                this.$message({
                  type: "info",
                  message: res.msg
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //修改
    // modifyLaw() {
    // this.addFlag = false;
    //   this.maskShow = false;
    //   this.lawsFormMaskShow = true;
    // },
    //提交
    sumit() {
      // if (this.addFlag) {
      let obj = {
        content: this.form.content,
        partIds: [],
        title: this.form.title,
        type: this.form.regionId,
        userIds: []
      };
      let arr3 = this.$refs.personTree.getCheckedKeys();
      console.log(arr3);
      arr3.forEach(item => {
        if (item.indexOf("_") == -1) {
          obj.partIds.push(item);
        } else {
          obj.userIds.push(splitStr(item)[1]);
        }
      });

      sendNews(obj)
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "发布成功"
            });
            this.lawsCurrentChange(this.lawsCurrentPage);
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
            message: "404网络请求失败"
          });
        });

      // } else {
      //   updateLaws({
      //     id: this.form.id,
      //     regionId: this.form.regionId,
      //     title: this.form.title,
      //     content: this.form.content
      //   })
      //     .then(res => {
      //       if (res.httpStatus == 200) {
      //         this.$message({
      //           type: "success",
      //           message: "修改成功"
      //         });
      //         this.lawsCurrentChange(this.lawsCurrentPage);
      //       } else {
      //         this.$message({
      //           type: "info",
      //           message: res.msg
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       this.$message({
      //         type: "info",
      //         message: "324网络请求失败"
      //       });
      //     });
      // }
    },
    // 返回
    returnList() {
      this.maskShow = false;
      this.lawsFormMaskShow = false;
    },
    //发布
    addLaws() {
      // this.addFlag = true;
      if(this.$store.state.userRole.roleCode==300){
      this.typeOptions = [{ name: "公告", id: 1 }, { name: "通知", id: 5 }]

      }else{
      this.typeOptions = [{ name: "通知", id: 5 }]

      }
      this.lawsFormMaskShow = true;
      this.form = {};
      this.getPersonData();
    },
    //获取人员列表
    getPersonData() {
      getFactoryMenus({
        // projectId: this.$store.state.projectInfor.projectId,
        factoryType: this.$store.state.userInfor.factoryType,
        onlyFactory: false,
        queryUser: true
        // standardId: this.cindex
      })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
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
            // if (e.selected) {
            //   _this.checkedPersonList.push(e.id);
            // }
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
            // if (e.selected) {
            //   _this.checkedPersonList.push(e.id);
            // }
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
    // 消费一条消息
    expenseNews(id) {
      getNews({ id })
        .then(res => {
          if (res.httpStatus == 200) {
            this.lawsCurrentChange(this.lawsCurrentPage);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "网络请求失败"
          });
        });
    }
  }
};
</script>

<style lang="less" >
#newsWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .lawsTab {
    flex: 1;
    .lawsTabTit {
      //   background-color: #ecf7fd;
      background-color: #014a77;
      color: #fff;
      span {
        // text-align: center;
        text-indent: 30px;
      }
    }
    .lawsTabTit,
    .laws {
      line-height: 50px;
      display: flex;
      span {
        display: inline-block;
      }
      .infotype {
        flex: 0 0 200px;
      }
      .titText {
        text-indent: 0;
        flex: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .releaseUnit {
        text-indent: 0;
        flex: 0 0 100px;
      }
      .releaseTime {
        flex: 0 0 180px;
        // padding-right: 20px;
      }
      .status {
        flex: 0 0 100px;
        text-indent: 0;
        text-align: center;
      }
      .handle {
        flex: 0 0 120px;
        display: flex;
        text-indent: 0px;
        justify-content: center;
        span {
          color: #409eff;
        }
        span:last-child {
          margin-left: 10px;
        }
        span:hover {
          cursor: pointer;
        }
        // display: flex;
        //   justify-content: space-around;
        // text-indent: 20px;
      }
    }
    .lawsCon {
      & > .laws:nth-child(2n) {
        background-color: #f3f3f3;
      }
      .laws {
        & > span:first-child {
          text-indent: 30px;
        }
      }
    }
  }
  .paging {
    flex: 0 0 80px;
    text-align: center;
    margin-top: 30px;
  }
  .mask,
  .lawsFormMask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    .maskContainer {
      background-color: #fff;
      width: 1200px;
      height: 700px;
      overflow-y: auto;
      position: absolute;
      // padding-bottom: 50px;
      display: flex;
      flex-direction: column;
      .maskHeader {
        flex: 0 0 40px;

        line-height: 40px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        background-color: #f2f2f2;
        .closeIcon {
          line-height: 40px;
          font-size: 18px;
        }
        .closeIcon:hover {
          cursor: pointer;
        }
      }
      .titBox {
        flex: 0 0 80px;

        .h2Box {
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        // h2 {
        //   line-height: 60px;
        // }
        .factoryNameTime {
          color: #c0c4cc;
          // line-height: 30px;
          text-align: center;

          span:last-child {
            margin-left: 20px;
          }
        }
      }
      .lawsContainer,
      .lawsForm {
        flex: 1;
        padding: 10px;
        line-height: 1.5em;
        .acceptPersonText {
          line-height: 40px;
        }
        .treeWrapper {
          width: 100%;
          height: 470px;
          margin-top: 22px;
          overflow: auto;
        }
      }
      .maskBtns {
        // height: 40px;
        flex: 0 0 80px;
        padding-right: 20px;
        text-align: end;
        line-height: 80px;
      }
    }
  }
  .releaseBtn {
    position: absolute;
    right: 0px;
    top: -56px;
  }
  .mg20 {
    margin-top: 20px;
  }
  .marL10 {
    padding-left: 20px;
  }
  .editWrapper {
    width: 100%;
    height: 100%;
    position: relative;
    // margin: 0 20px 0 0;
    // margin-bottom: 100px;
    .editContent {
      width: 100%;
      height: 400px;
    }
  }
  // .ql-editor {
  //   white-space: normal !important;
  // }

  // .ql-container {
  //   white-space: pre-wrap !important;
  // }
}
</style>