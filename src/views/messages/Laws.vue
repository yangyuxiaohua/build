<template>
  <div id="lawsWrapper">
    <div class="lawsTab">
      <div class="lawsTabTit">
        <span class="titText">标题</span>
        <span class="releaseUnit">发布单位</span>
        <span class="releaseTime">发布时间</span>
        <span class="handle">操作</span>
      </div>
      <div class="lawsCon">
        <div class="laws" v-for="(item,index) in lawsList" :key='index'>
          <span class="titText">{{item.title}}</span>
          <span class="releaseUnit">{{item.factoryName}}</span>
          <span class="releaseTime">{{item.createTime}}</span>
          <span class="handle">
            <span @click="lookLaw(item)">详情</span>
            <span @click="deleteLaw(item.id)" v-show="btnShow">删除</span>
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
          <span>法规详情</span>
          <i class="el-icon-close closeIcon" @click="closeMask"></i>
        </div>
        <div class="titBox">
           <div class="h2Box"><h3>{{form.title}}</h3></div>
          <div class="factoryNameTime">
            <span>{{form.factoryName}}</span>
            <span>{{form.createTime}}</span>
          </div>
        </div>
        <div class="lawsContainer" v-html="lawsContent"></div>
        <div class="maskBtns">
          <el-button type="primary" @click="modifyLaw()" v-show="btnShow">修改</el-button>
          <el-button type="primary" plain @click="returnList()">返回</el-button>
        </div>
      </div>
    </div>
    <div class="releaseBtn" v-show="btnShow">
      <el-button type="primary" plain @click="addLaws">发布</el-button>
    </div>
    <div class="lawsFormMask" v-show="lawsFormMaskShow">
      <div class="maskContainer">
        <div class="maskHeader">
          <span>政策法规</span>
          <i class="el-icon-close closeIcon" @click="closeMask"></i>
        </div>
        <div class="lawsForm mg20">
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="18">
                <el-form-item label="标题">
                  <el-input v-model="form.title"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="区域">
                  <el-select v-model="form.regionId" placeholder="请选择区域">
                    <el-option v-for="(item,index) in countyOptions" :key="index" :label="item.name" :value="item.id">
                    </el-option>

                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="内容">
                <div class="editWrapper">
                  <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div>
              </el-form-item>
            </el-row>

          </el-form>
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
import { pageByCondition, deletedLaw, addLaw, updateLaws } from "@/apis/laws";
import { getRegions } from "@/apis/project.js";
import { getTime } from "@/utils/publictool";
import { uploadIp, ImgIp } from "@/apis/upload";
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
//========================================

var Align = Quill.import("attributors/style/align");
Align.whitelist = ["right", "center", "justify"];
Quill.register(Align, true);
export default {
  components: {
    quillEditor
  },
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
      addFlag: false, // 增加还是修改
      countyOptions: [], //区域
      btnShow: false //权限控制
    };
  },
  created() {
    this.roleControl();
    this.lawsCurrentChange(this.lawsCurrentPage);
    this.chosedcity();
  },
  methods: {
    //权限控制
    roleControl() {
      // console.log(this.$store.state)
      if (
        this.$store.state.userRole.roleCode == 400 ||
        this.$store.state.userRole.roleCode == 450 ||
        this.$store.state.userRole.roleCode == 300
      ) {
        this.btnShow = true;
      } else {
        this.btnShow = false;
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
            this.lawsList = res.result.result.map(item => {
              item.createTime = getTime(item.createTime);
              return item;
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "65网络请求失败"
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
      console.log(i);
      this.maskShow = true;
      this.lawsContent = i.content;
      this.form = i;
    },
    //删除
    deleteLaw(id) {
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          deletedLaw({
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
    modifyLaw() {
      this.addFlag = false;
      this.maskShow = false;
      this.lawsFormMaskShow = true;
    },
    //提交
    sumit() {
      // console.log(this.form);
      if (this.addFlag) {
        addLaw(this.form)
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
              message: "324网络请求失败"
            });
          });
      } else {
        updateLaws({
          id: this.form.id,
          regionId: this.form.regionId,
          title: this.form.title,
          content: this.form.content
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
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
              message: "324网络请求失败"
            });
          });
      }
    },
    // 返回
    returnList() {
      this.maskShow = false;
      this.lawsFormMaskShow = false;
    },
    //发布
    addLaws() {
      this.addFlag = true;
      this.lawsFormMaskShow = true;
      this.form = {};
    },
    // 获取区域
    chosedcity() {
      // console.log( this.form.cityRegion)
      this.countyDisabled = false;
      getRegions({
        level: 3,
        pid: "530100000000"
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.countyOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    }
  }
};
</script>

<style lang="less" >
#lawsWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
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
      .titText {
        flex: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .releaseUnit {
        flex: 0 0 300px;
      }
      .releaseTime {
        flex: 0 0 180px;
        // padding-right: 20px;
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
    top: 80px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
    box-sizing: border-box;
    padding-bottom:60px ;
    .maskContainer {
      background-color: #fff;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      // position: absolute;
      // padding-bottom: 150px;
      display: flex;
      flex-direction: column;
      .maskHeader {
        flex: 0 0 40px;
        line-height: 40px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        color: #409eff;

        // background-color: #f2f2f2;
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
        .h2Box{
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .factoryNameTime {
          color: #c0c4cc;
          line-height: 20px;
        text-align: center;
          
          span:last-child {
            margin-left: 20px;
          }
        }
      }
      .lawsContainer {
        flex: 1;
        padding: 10px;
        line-height: 1.5em;
      }
      .lawsForm{
        flex: 1;
      }
      .maskBtns {
        flex: 0 0 80px;
        padding-right: 20px;
        text-align: end;
        // position: absolute;
        // bottom: 120px;
        // right: 10px;
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
  .editWrapper {
    width: 98%;
    height: 100%;
    position: relative;
    // margin: 0 20px 0 0;
    // margin-bottom: 100px;
    .editContent {
      width: 100%;
      height: 600px;
    }
  }
  .ql-editor {
    white-space: normal !important;
  }

  .ql-container {
    white-space: pre-wrap !important;
  }
}
</style>