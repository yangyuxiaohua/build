<template>
  <div id="FireDetectionWrapper">
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
          <el-col :span="6" class="lh30">
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
        <el-row class="bottomLine">
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
            <div> 子项评定 :
              <el-radio-group v-model="form.conclusion" :disabled='readonly'>
                <el-radio label="合格"></el-radio>
                <el-radio label="不合格"></el-radio>
              </el-radio-group>
            </div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12" v-show="!readonly">
            <!-- bill -->
            <div>
              修改原由 :
              <el-input type="textarea" placeholder="请填写修改验收记录的原因" class="textarea" v-model="form.bill" :readonly='readonly'>
              </el-input>
            </div>

          </el-col>
          <el-col :span="12">
            <div>
              修改记录 :
              <el-input type="textarea" placeholder="" class="textarea" v-model="updateRecodeBill" readonly>
              </el-input>
            </div>
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
    <div class="exportRecode" v-loading="loading">
      <el-button type="primary" @click="dialogFormVisible = true">导出</el-button>
    </div>
    <el-dialog title="导出选择" :visible.sync="dialogFormVisible" :modal='true'>
      <el-form>
        <el-form-item label="">
          <el-radio-group v-model="choseLoadFormRecode">
            <el-radio label="1">消防检测记录</el-radio>
            <el-radio label="2">检测情况反馈</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="downloadFireDetectionRecode">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRecordsByProjectId3,
  updateRecode,
  getUploadsByChecklistId,
  IP,
  getRecordsBill
} from "@/apis/evaluation";
import {
  getTime,
  changeEdit,
  splitStr,
  exportMethod2,
  exportMethod4
} from "@/utils/publictool";

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
      readonly: true,
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

      primaryTitleId: "", //下拉框的筛选
      secondaryTitleId: "",
      checkTypeName: "",
      copyInspectRecordResult: "",
      result: "", //下拉框的筛选
      resultOptions: [
        { label: "合格", value: "1" },
        { label: "不合格", value: "5" }
      ],
      updateRecodeBill: "",
      loading: false,
      dialogFormVisible: false, //导出选择
      choseLoadFormRecode: ""
      // choseLoadForm: {} //导出选择的内容
    };
  },
  created() {
    if(this.$store.state.projectInfor.projectId){
    this.unitCurrentChange(this.unitCurrentPage);
    }
    this.roleShow();
  },
  mounted() {},
  methods: {
    //角色控制
    roleShow() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode == 800 || roleCode == 850 || roleCode == 300) {
        this.roleShow4 = true;
      } else {
        this.roleShow4 = false;
      }
    },
    //分页
    unitCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      getRecordsByProjectId3({
        standardId: this.$store.state.projectInfor.inspectStandardId,
        projectId: this.$store.state.projectInfor.projectId,
        size: this.unitCurrentNum,
        start: val,
        primaryTitleId: this.primaryTitleId,
        secondaryTitleId: this.secondaryTitleId,
        checkTypeName: this.checkTypeName,
        result: this.copyInspectRecordResult
      })
        .then(res => {
          // console.log(res);
          this.unitTotal = res.result.countRows;
          this.list = res.result.result.map(i => {
            let children = [];
            i.titleSecondaryDtos.forEach(j => {
              // console.log(i)
              j.recordsList.forEach(item => {
                // console.log(item)
                children.push({
                  checklistId: item.checklistId,
                  listTit: item.primaryTitle,
                  branch: item.secondaryTitle,
                  way: item.checklistContent,
                  parts: item.checkPart,
                  num: item.checkNum,
                  situation: item.contentRecord,
                  recode: "",
                  importance: item.checkTypeName,
                  conclusion: item.result == 1 ? "合格" : "不合格",
                  contentRecord: changeEdit(item.contentRecord),
                  standardName: item.standardName,
                  createTime: getTime(item.createTime),
                  usernames: item.otherUsernames
                    ? item.otherUsernames + "," + item.usernames
                    : item.usernames,
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
          // console.log(this.list);
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
          // this.$message({
          //   type: "warning",
          //   message: err
          // });
        });
    },
    handleModify(flag, item) {
      // console.log(item)
      this.getRecordsBills(item.id);
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
    //获取修改记录
    getRecordsBills(recordId) {
      getRecordsBill({ recordId })
        .then(res => {
          // console.log(res)
          if (res.httpStatus == 200) {
            let str = "";
            res.result.forEach((item, index) => {
              console.log(item);
              let s = `(${index + 1}) ${getTime(item.createTime)} ${
                item.createUserName
              } ${item.question}。`;
              str += s;
            });
            this.updateRecodeBill = str;
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err
          });
        });
    },
    save() {
      if (this.form.bill) {
        updateRecode({
          id: this.form.id,
          contentRecord: this.form.contentRecord,
          checkNum: this.form.num,
          checkPart: this.form.parts,
          result: this.form.conclusion == "合格" ? 1 : 5,
          bill: this.form.bill
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
      } else {
        this.$message({
          type: "info",
          message: "请填写修改原由"
        });
      }
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
      this.fileList = [];
      if (i == "MP3") {
        this.audioWrapper = true;
        this.imgWrapper = false;
        this.videoWrapper = false;
        this.$refs.audio.src = "";
      } else if (i == "MP4") {
        this.audioWrapper = false;
        this.imgWrapper = false;
        this.videoWrapper = true;
        this.$refs.video.src = "";
      } else {
        this.audioWrapper = false;
        this.imgWrapper = true;
        this.videoWrapper = false;
        this.imgSrc = "";
      }
      getUploadsByChecklistId({
        checklistId: item.checklistId,
        projectId: item.projectId,
        type: i,
        standardId: this.$store.state.recodeStandard.standardId
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
    //导出
    downloadFireDetectionRecode() {
      console.log(this.choseLoadFormRecode);
      if (!this.choseLoadFormRecode) {
        this.$message({
          type: "info",
          message: "请选择导出项"
        });
      } else if (this.choseLoadFormRecode == 1) {
        this.dialogFormVisible = false;
        this.loading = true;
        exportMethod2({
          projectId: this.$store.state.projectInfor.projectId,
          projectName: this.$store.state.projectInfor.projectName,
          standardId: this.$store.state.recodeStandard.standardId
        })
          .then(res => {
            if (res) {
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              type: "info",
              message: "导出失败"
            });
          });
      } else {
        this.dialogFormVisible = false;
        this.loading = true;
        exportMethod4({
          projectId: this.$store.state.projectInfor.projectId,
          projectName: this.$store.state.projectInfor.projectName,
          standardId: this.$store.state.recodeStandard.standardId,
          code: "v1"
        })
          .then(res => {
            if (res) {
              this.loading = false;
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              type: "info",
              message: "导出失败"
            });
          });
      }
    }
  },
  computed: {
    getProjectId() {
      return this.$store.state.projectInfor;
    },
    getSearchValue() {
      return this.$store.state.ScreeningRecordObj;
    }
  },
  watch: {
    getProjectId: function() {
      this.unitCurrentChange(this.unitCurrentPage);
      // this.getRecode12();
    },
    getSearchValue: function(val1) {
      // console.log(val1)
      // splitStr
      let obj;
      if (val1.ascaderValue) {
        if (splitStr(val1.ascaderValue)[0] == "menuLevel1") {
          obj = {
            primaryTitleId: splitStr(val1.ascaderValue)[1],
            secondaryTitleId: ""
          };
        } else {
          obj = {
            primaryTitleId: "",
            secondaryTitleId: val1.ascaderValue
          };
        }
      } else {
        obj = {
          primaryTitleId: "",
          secondaryTitleId: ""
        };
      }

      this.primaryTitleId = obj.primaryTitleId;
      this.secondaryTitleId = obj.secondaryTitleId;
      this.checkTypeName = val1.importantValue;
      this.copyInspectRecordResult = val1.detectionValue;
      this.unitCurrentPage = 1;
      this.unitCurrentChange(this.unitCurrentPage);
    }
  }
};
</script>

<style lang="less" >
#FireDetectionWrapper {
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
        // text-align: center;
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #aca4a4;
        & > div {
          //   display: flex;
          //   justify-content: center;
          // align-items: center;
          text-align: center;
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
    flex: 0 0 500px;
  }
  .parts {
    // width: 200px;
    flex: 0 0 200px;
  }
  .num {
    // width: 60px;
    flex: 0 0 200px;
  }
  .situation {
    // width: 350px;
    // flex: 0 0 200px;
    flex: 1;
    min-width: 100px;
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
    position: fixed;
    width: 100%;
    height: 100%;
    // background-color: #000;
    left: 0;
    top: 0;
    z-index: 200;
    // display: flex;
    // justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);

    // background-color: #f4f4f4;
    // opacity: 0.8;
    .maskInfor {
      width: 80%;
      min-width: 850px;
      height: 700px;
      position: fixed;
      margin: auto;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
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
  .el-radio-group {
    text-indent: 0;
    .el-radio {
      margin-right: 0;
      margin-left: 10px;
    }
  }
  .lh30 {
    line-height: 30px;
  }
  .exportRecode {
    position: absolute;
    right: 10px;
    top: -55px;
    z-index: 100;
  }
}
</style>