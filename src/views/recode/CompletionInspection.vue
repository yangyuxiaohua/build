<template>
  <div id="CompletionInspectionWrapper">
    <div class="tableHeader">
      <div class="branch">
        分部/分项工程
      </div>
      <div class="way">内容和方法</div>
      <div class="parts">检查部位</div>
      <div class="num">检查数量</div>
      <div class="situation">验收检查情况</div>
      <div class="recode">记录附件</div>
      <div class="importance">重要程度</div>
      <div class="conclusion">评定结论</div>
      <div class="handle">操作</div>
    </div>
    <div class="container">
      <div class="list" v-for="(item,index) in list" :key="index">
        <div class="listTit">
          <span>{{item.listTit}}</span>
        </div>
        <div class="listContainer" v-for="(i,ind) in item.children" :key='ind'>
          <div class="branch lh40 ">
            <span>{{i.branch}}</span>
          </div>
          <div class="way lh40">
            <span>{{i.way}}</span>
          </div>
          <div class="parts lh40">
            <span>{{i.parts}}</span>
          </div>
          <div class="num lh40">
            <span>{{i.num}}</span>
          </div>
          <div class="situation lh40 ">
            <span v-html="i.situation"></span>
          </div>
          <div class="recode lh40">
            <span @click="lookAttachment('PNG',i)">图</span>
            <span @click="lookAttachment('MP3',i)">音</span>
            <span @click="lookAttachment('MP4',i)">影</span>
          </div>
          <div class="importance lh40">
            <span>{{i.importance}}</span>
          </div>
          <div class="conclusion lh40">
            <span>{{i.conclusion}}</span>
          </div>
          <div class="handle lh40">
            <span @click="handleModify(1,i)">详情</span>
            <span @click="handleModify(-1,i)" v-show="roleShow4">修改</span>
          </div>
        </div>
      </div>

    </div>
    <div class="paging">
      <el-pagination background layout="prev, pager, next" :total="unitTotal" :pager-count="pageCount" :page-size='unitCurrentNum' :current-page.sync='unitCurrentPage' @current-change='unitCurrentChange'>
      </el-pagination>
    </div>
    <div class="mask" v-show="showMask">
      <div class="maskInfor">
        <p>验收记录详情</p>
        <el-row class="bottomLine">
          <el-col :span="12">
            <div>分部工程 : {{form.listTit}}</div>
          </el-col>
          <el-col :span="12">
            <div> 分项工程 : {{form.branch}}</div>
          </el-col>
        </el-row>
        <el-row class="bottomLine">
          <el-col :span="12">
            <div>验收内容 : {{form.way}}</div>
          </el-col>
          <el-col :span="6">
            <div> 重要程度 : {{form.importance}}</div>
          </el-col>
          <el-col :span="6">
            <div> 适用标准 : {{form.standardName}}</div>
          </el-col>
        </el-row>
        <el-row class="bottomLine">
          <el-col :span="18">
            <div>检查部位 :
              <el-input :readonly='readonly' v-model="form.parts"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div> 验收时间 : {{form.createTime}}</div>
          </el-col>

        </el-row>
        <el-row class="bottomLine">
          <el-col :span="18">
            <div>检查数量 :
              <el-input :readonly='readonly' v-model="form.num"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div> 验收人员 : {{form.usernames}}</div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="18">
            <div>验收记录 :
              <el-input type="textarea" placeholder="请输入内容" class="textarea" :readonly='readonly' v-model="form.contentRecord">
              </el-input>
              <!-- <div class="editWrapper">
                  <quill-editor v-model="form.contentRecord" ref="myQuillEditor" :options="editorOption" class="editContent">
                  </quill-editor>
                </div> -->
              <!-- <el-form-item label="验收记录 :"> -->
              <!-- <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.checkContent">
                </el-input> -->
              <!-- <div class="editWrapper">
                <quill-editor v-model="form.contentRecord" ref="myQuillEditor" :options="editorOption" class="editContent">
                </quill-editor>
              </div> -->
            </div>
            <!-- </el-form-item> -->
          </el-col>
          <el-col :span="6">
            <div>子项评定 : {{form.conclusion}}</div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24" class="btns">
            <el-button type='primary' @click="save()" v-show="showSaveBtn">保存</el-button>
            <el-button plain @click="returnLast()">返回</el-button>
          </el-col>

        </el-row>
      </div>
    </div>
    <div class="attachment" v-show="attachment">
      <div class="returnLast">
        <el-button plain @click="returnLast()">返回</el-button>
      </div>
      <div class="attachmentContainer">
        <div class="list">
          <p v-for="item in fileList" :key="item.uploadUrl" @click="clickFile(item.uploadUrl,item.type)">{{item.uploadName}}</p>
        </div>
        <div class="attachmentBox">
          <div class="attachmentWrapper">
            <div class="imgWrapper" v-show="imgWrapper">
              <img :src="imgSrc" alt="">
            </div>
            <div class="audioWrapper" v-show="audioWrapper">
              <audio id="audio" controls ref="audio">
                <source :src="audioSrc">
              </audio>
            </div>
            <div class="videoWrapper" v-show="videoWrapper">
              <video controls="controls" width="600" height="400" ref="video">
                <source :src="videoSrc" type="video/mp4">
              </video>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getRecordsByProjectId3,
  updateRecode,
  getUploadsByChecklistId,
  IP
  // getRecordsByProjectIdGroup1,
  // getRecordsByProjectIdGroup2
} from "@/apis/evaluation";
import { getTime,changeEdit } from "@/utils/publictool";

//富文本
import { uploadIp, Ip } from "@/apis/upload";

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
      list: [],
      showMask: false,
      readonly: "readonly",
      form: {}, //详情表格
      showSaveBtn: false,
      unitCurrentPage: 1, //当前页
      unitCurrentNum: 5, //每页显示条数
      pageCount: 5, // 按钮数
      unitTotal: 0, //总条数
      attachment: false, //附件蒙版
      imgWrapper: false,
      audioWrapper: false,
      videoWrapper: false,
      // imgSrc:require('../../assets/imgs/index/app.png'),
      // audioSrc: require("../../assets/musics/fireWarning2.mp3"),
      // videoSrc: require("../../assets/musics/fireWarning2.mp3"),
      imgSrc: "",
      audioSrc: "",
      videoSrc: "",
      fileList: [], //文件数组
      roleShow4: true, //权限
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
      //         const imgUrl = Ip + res.result;
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
      result: "", //下拉框的筛选
      resultOptions: [
        { label: "合格", value: "1" },
        { label: "不合格", value: "5" }
      ],
    };
  },
  created() {
    this.unitCurrentChange(this.unitCurrentPage);
    this.roleShow();
  },
  mounted() {},
  methods: {
    //角色控制
    roleShow() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode == 500) {
        this.roleShow4 = false;
      }
    },
    //分页
    unitCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      getRecordsByProjectId3({
        projectId: this.$store.state.projectInfor.projectId,
        size: this.unitCurrentNum,
        start: val,
        result: this.result,
        secondaryTitleId: this.secondaryTitleId,
        primaryTitleId: this.primaryTitleId
      })
        .then(res => {
          console.log(res);
          this.unitTotal = res.result.countRows;
          this.list = res.result.result.map(i => {
            let children = [];
            i.titleSecondaryDtos.forEach(j => {
              // console.log(i)
              j.recordsList.forEach(item => {
                // console.log(item)
                children.push({
                  listTit: item.primaryTitle,
                  branch: item.secondaryTitle,
                  way: item.checklistContent,
                  parts: item.checkPart,
                  num: item.checkNum,
                  situation: item.contentRecord,
                  recode: "",
                  importance: item.checkTypeName,
                  conclusion: item.result == 1 ? "合格" : "不合格",
                  contentRecord:  changeEdit(item.contentRecord),
                  standardName: item.standardName,
                  createTime: getTime(item.createTime),
                  usernames: item.usernames,
                  projectId: item.projectId,
                  id: item.id
                });
              });
            });
            return {
              listTit: i.primaryTitle,
              children
            };
          });
          console.log(this.list);
          // if (res.httpStatus == 200) {
          //   this.unitTotal = res.result.countRows;
          //   // item.createTime = getTime(item.createTime);
          //   // item.result = item.result.toString();
          //   this.list = res.result.result.map(item => {
          //     return {
          //       listTit: item.primaryTitle,
          //       branch: item.secondaryTitle,
          //       way: item.checklistContent,
          //       parts: item.checkPart,
          //       num: item.checkNum,
          //       situation: item.contentRecord,
          //       recode: "",
          //       importance: item.checkTypeName,
          //       conclusion: item.result == 1 ? "合格" : "不合格",
          //       contentRecord: item.contentRecord,
          //       standardName: item.standardName,
          //       createTime: getTime(item.createTime),
          //       usernames: item.usernames,
          //       projectId: item.projectId,
          //       id: item.id
          //     };
          //     // return item;
          //   });
          // }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    handleModify(flag, item) {
      // console.log(item)
      if (flag == 1) {
        this.readonly = true;
        this.form = item;
        this.showSaveBtn = false;
      } else {
        this.form = item;
        this.readonly = false;
        this.showSaveBtn = true;
      }
      this.showMask = true;
    },
    save() {
      updateRecode({
        id: this.form.id,
        contentRecord: this.form.contentRecord,
        checkNum: this.form.num,
        checkPart: this.form.parts
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.unitCurrentChange(this.unitCurrentPage);
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
    },
    returnLast() {
      this.showMask = false;
      this.attachment = false;
      //  document.getElementById("video").pause()
      //  document.getElementById("audio").pause()
    },
    //点击附件
    lookAttachment(i, item) {
      this.attachment = true;
      if (i == "MP3") {
        this.audioWrapper = true;
        this.imgWrapper = false;
        this.videoWrapper = false;
      } else if (i == "MP4") {
        this.audioWrapper = false;
        this.imgWrapper = false;
        this.videoWrapper = true;
      } else {
        this.audioWrapper = false;
        this.imgWrapper = true;
        this.videoWrapper = false;
      }
      getUploadsByChecklistId({
        checklistId: i.checklistId,
        projectId: item.projectId,
        type: i
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.fileList = res.result.map(item => {
              item.uploadUrl = IP + item.uploadUrl;
              item.type = i;
              return item;
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
            message: "打开文件失败" + err
          });
        });
    },
    //点击文件
    clickFile(url, type) {
      if (type == "PNG") {
        this.imgSrc = url;
      } else if (type == "MP3") {
        this.$refs.audio.src = url;
      } else {
        //  this.videoSrc = url
        this.$refs.video.src = url;
      }
    },
   
  },
  computed: {
    getProjectId() {
      return this.$store.state.projectInfor;
    }
  },
  watch: {
    getProjectId: function() {
      this.unitCurrentChange(this.unitCurrentPage);
    // this.getRecode12();
      
    }
  }
};
</script>

<style lang="less" >
#CompletionInspectionWrapper {
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  box-sizing: border-box;
  position: relative;
  .tableHeader {
    height: 40px;
    line-height: 40px;
    background-color: #014a77;
    color: #fff;
    display: flex;
    justify-content: space-around;
    text-align: center;
  }
  .container {
    //   width: 150px;
    .list {
      width: 100%;
      // height: 40px;
      .listTit {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #aca4a4;
        color: #409eff;
      }
      .listContainer {
        height: 40px;
        line-height: 20px;
        text-align: center;
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #aca4a4;
        & > div {
            display: flex;
            justify-content:center;
          // align-items: center;
          // text-align: center;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }
    }
    .lh40 {
      line-height: 40px;
    }
  }
  .paging {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 40px;
    left: 0;
  }
  .branch {
    // width: 150px;
    flex: 0 0 150px;
  }
  .way {
    // width: 200px;
    flex: 0 0 200px;
  }
  .parts {
    // width: 200px;
    flex: 0 0 200px;
  }
  .num {
    // width: 60px;
    flex: 0 0 60px;
  }
  .situation {
    // width: 350px;
    flex: 0 0 340px;
  }
  .recode {
    flex: 0 0 150px;
    span {
      display: inline-block;
      border: 1px solid #b4acac;
      line-height: 20px;
      padding: 0 2px;
      margin: 0 0 0 4px;
      cursor: pointer;
    }
  }
  .importance {
    // width: 100px;
    flex: 0 0 100px;
  }
  .conclusion {
    // width: 100px;
    flex: 0 0 100px;
    // flex: 1;
  }
  .handle {
    // width: 100px;
    flex: 0 0 100px;
    // display: flex;
    // justify-content: space-around;
    // align-items: center;
    span {
      color: #014a77;
      margin: 5px;
    }
    span:hover {
      cursor: pointer;
    }
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    // background-color: #000;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    // background-color: #f4f4f4;
    // opacity: 0.8;
    .maskInfor {
      width: 80%;
      min-width: 850px;
      height: 700px;
      //   padding: 0 10px 60px 0;
      background-color: #fff;
      opacity: 1;
      border: 1px solid #000;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 0 10px rgba(0, 0, 0, 0.04);
      & > p {
        line-height: 60px;
        text-indent: 30px;
        color: #409eff;
      }
      & > .bottomLine {
        border-bottom: 2px solid #f4f4f4;
      }
      & > .el-row {
        text-indent: 40px;
        line-height: 60px;
        .el-input {
          width: 70%;
        }
        .textarea {
          width: 70% !important;
          margin-left: 40px;
        }
        .btns {
          text-align: center;
          margin-top: 40px;
        }
      }
    }
  }
  .attachment {
    width: 100%;
    height: 100%;
    background-color: rgba(32, 30, 30, 0.8);
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .returnLast {
      flex: 0 0 40px;
    }
    .attachmentContainer {
      flex: 1;
      display: flex;
      padding-top: 40px;
      color: #fff;
      .list {
        line-height: 30px;
        height: 650px;
        flex: 0 0 250px;
        border-right: 1px solid #f4f4f4;
        overflow-x: hidden;
        overflow-y: auto;
        p {
          text-indent: 10px;
          cursor: pointer;
        }
        p:hover {
          background-color: #000;
        }
      }
      .attachmentBox {
        flex: 1;
        display: flex;
        justify-content: center;
        .attachmentWrapper {
          width: 500px;
          img {
            width: 100%;
          }
        }
        .videoWrapper {
        }
        // .;
      }
    }
  }
  .editWrapper {
    width: 90%;
    // height: 100%;
    position: relative;
    margin-bottom: 100px;
    .editContent {
      width: 78%;
      height: 155px;
      margin-left: 158px;
      margin-top: -40px;
    }
  }
  .w50 {
    width: 50%;
  }
 
}
</style>