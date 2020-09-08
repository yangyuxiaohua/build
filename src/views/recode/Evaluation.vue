<template>
  <div id="EvaluationWrapper">
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
      <div class="conclusion">查验结论</div>
      <div class="conclusion">检测结论</div>
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
            <span>{{i.conclusion1}}</span>
          </div>
          <div class="conclusion lh40">
            <span>{{i.conclusion2}}</span>
          </div>
          <div class="conclusion lh40">
            <span>{{i.conclusion3}}</span>
          </div>
          <div class="handle lh40">
            <span @click="handleModify(1,i.lookDetails)">详情</span>
            <span @click="handleModify(-1,i.lookDetails)" v-show="roleShow4">修改</span>
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
        <el-row class="ti30">
          <el-col :span="8">
            <div>分部工程 : {{form.checklistDtos.primaryTitle}}</div>
          </el-col>
          <el-col :span="8">
            <div> 分项工程 : {{form.checklistDtos.secondaryTitle}}</div>
          </el-col>
          <el-col :span="8">
            <div> 适用标准 : {{form.checklistDtos.standardName}}</div>
          </el-col>
        </el-row>
        <el-row class="ti30 lh30" >
          <el-col :span="16">
            <div>验收内容 : {{form.checklistDtos.checklistContent}}</div>
          </el-col>
          <el-col :span="8">
            <div> 重要程度 : {{form.checklistDtos.checkTypeName}}</div>
          </el-col>
        </el-row>

        <el-row class="borderLine">
          <el-col :span="8" class="rLine plr10">
            <p class="tit">竣工查验</p>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检查数量：</span>
              </el-col>
              <el-col :span="18">
                <el-input v-model="form.completChecklistDtos.checkNum" placeholder="" readonly></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检查部位：</span>
              </el-col>
              <el-col :span="18">
                <el-input type="textarea" v-model="form.completChecklistDtos.checkPart" placeholder="" readonly></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>查验记录：</span>
              </el-col>
              <el-col :span="18">
                <el-input type="textarea" v-model="form.completChecklistDtos.contentRecord" placeholder="" readonly></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>查验时间：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.completChecklistDtos.createTime}}</span>
              </el-col>
            </el-row>
            <el-row class="nopadding lh30">
              <el-col :span="6" class="w80">
                <span>查验人员：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.completChecklistDtos.usernames}}<span v-show="form.completChecklistDtos.otherUsernames">,</span>{{form.completChecklistDtos.otherUsernames}}</span>
              </el-col>
            </el-row>
            <el-row class="nopadding lh30">
              <el-col :span="6" class="w80">
                <span>查验结论：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.completChecklistDtos.result}}</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" class="rLine plr10">
            <p class="tit">消防检测</p>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检查数量：</span>
              </el-col>
              <el-col :span="18">
                <el-input v-model="form.inspectChecklistDtos.checkNum" placeholder="" readonly></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检查部位：</span>
              </el-col>
              <el-col :span="18">
                <el-input type="textarea" v-model="form.inspectChecklistDtos.checkPart" placeholder="" readonly></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检测记录：</span>
              </el-col>
              <el-col :span="18">
                <el-input type="textarea" v-model="form.inspectChecklistDtos.contentRecord" placeholder="" readonly></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检测时间：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.inspectChecklistDtos.createTime}}</span>
              </el-col>
            </el-row>
            <el-row class="nopadding lh30">
              <el-col :span="6" class="w80">
                <span>检测人员：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.inspectChecklistDtos.usernames}}<span v-show="form.inspectChecklistDtos.otherUsernames">,</span>{{form.inspectChecklistDtos.otherUsernames}}</span>
              </el-col>
            </el-row>
            <el-row class="nopadding lh30">
              <el-col :span="6" class="w80">
                <span>检测结论：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.inspectChecklistDtos.result}}</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" class="plr10">
            <p class="tit">现场评定</p>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检查数量：</span>
              </el-col>
              <el-col :span="18">
                <el-input v-model="form.curr2ChecklistDtos.checkNum" placeholder="" :readonly='readonly'></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>检查部位：</span>
              </el-col>
              <el-col :span="18">
                <el-input type="textarea" v-model="form.curr2ChecklistDtos.checkPart" placeholder="" :readonly='readonly'></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>评定记录：</span>
              </el-col>
              <el-col :span="18">
                <el-input type="textarea" v-model="form.curr2ChecklistDtos.contentRecord" placeholder="" :readonly='readonly'></el-input>
              </el-col>
            </el-row>
            <el-row class="nopadding">
              <el-col :span="6" class="w80">
                <span>评定时间：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.curr2ChecklistDtos.createTime}}</span>
              </el-col>
            </el-row>
            <el-row class="nopadding lh30">
              <el-col :span="6" class="w80">
                <span>评定人员：</span>
              </el-col>
              <el-col :span="18">
                <span>{{form.curr2ChecklistDtos.usernames}}<span v-show="form.curr2ChecklistDtos.otherUsernames">,</span>{{form.curr2ChecklistDtos.otherUsernames}}</span>
              </el-col>
            </el-row>
            <el-row class="nopadding lh30">
              <el-col :span="6" class="w80">
                <span>评定结论：</span>
              </el-col>
              <el-col :span="18">
                <!-- <span>{{form.curr2ChecklistDtos.result}}</span> -->
                 <el-radio-group v-model="form.curr2ChecklistDtos.result" :disabled='readonly'>
                <el-radio label="合格"></el-radio>
                <el-radio label="不合格"></el-radio>
              </el-radio-group>
              </el-col>
            </el-row>
          </el-col>

        </el-row>
        <el-row  class="ti30">
          <el-col :span="12" v-show="!readonly">
            <!-- bill -->
            <div>
              修改原由 :
              <el-input type="textarea" placeholder="请填写修改验收记录的原因" class="textarea" v-model="form.curr2ChecklistDtos.bill" :readonly='readonly'>
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
      <el-button type="primary" @click="downloadEvaiuationRecode()">导出</el-button>
    </div>
  </div>
</template>

<script>
import {
  getRecordsByProjectId2,
  updateRecode,
  getUploadsByChecklistId,
  IP,
  getRecordsByProjectIdGroup1,
  getRecordsByProjectIdGroup2,
  getRecordsBill,
  // downloadEvaiuation
} from "@/apis/evaluation";
import { getTime, changeEdit,splitStr,exportMethod} from "@/utils/publictool";

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
// import { functions } from 'lodash-es';
export default {
  components: {
    // quillEditor
  },
  data() {
    return {
      list: [],
      showMask: false,
      readonly: true,
      form: {
        completChecklistDtos: {}, //竣工查验
        inspectChecklistDtos: {}, //消防检测
        curr2ChecklistDtos: {}, //现场评定
        checklistDtos: {} // 合并
      }, //详情表格
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
      primaryTitleId:'',//下拉框的筛选
      secondaryTitleId:'',
      checkTypeName:'',
      copyCompleteRecordResult:'',
      copyInspectRecordResult:'',
      result: "", 
      resultOptions: [
        { label: "合格", value: "1" },
        { label: "不合格", value: "5" }
      ],
      updateRecodeBill: "", //修改记录
      loading:false
    };
  },
  created() {
    if(this.$store.state.projectInfor.projectId){
      this.unitCurrentChange(this.unitCurrentPage);
    }
    this.roleShow();
    // console.log(this.$store.state.recodeStandard)
  },
  mounted() {},
  methods: {
    //角色控制
    roleShow() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode == 400 || roleCode == 450 || roleCode == 300) {
        this.roleShow4 = true;
      }else{
        this.roleShow4 = false;
      }
    },
    //分页
    unitCurrentChange(val) {
      val = val <= 0 ? 1 : val;
      getRecordsByProjectId2({
        standardId:this.$store.state.projectInfor.standardId,
        projectId: this.$store.state.projectInfor.projectId,
        size: this.unitCurrentNum,
        start: val,
        //筛选
        primaryTitleId:this.primaryTitleId,
        secondaryTitleId:this.secondaryTitleId,
        checkTypeName:this.checkTypeName,
        copyCompleteRecordResult:this.copyCompleteRecordResult,
        copyInspectRecordResult:this.copyInspectRecordResult,
        result:this.result
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
                  listTit: item.checklistDtos.primaryTitle,
                  branch: item.checklistDtos.secondaryTitle,
                  way: item.checklistDtos.checklistContent,
                  parts: item.checklistDtos.checkPart,
                  num: item.checklistDtos.checkNum,
                  situation: item.checklistDtos.contentRecord,
                  recode: "",
                  importance: item.checklistDtos.checkTypeName,
                  conclusion1: item.completChecklistDtos
                    ? (item.completChecklistDtos.result == 1 ? "合格" : "不合格")
                    : "无",
                  conclusion2: item.inspectChecklistDtos
                    ? (item.inspectChecklistDtos.result == 1 ? "合格" : "不合格")
                    : "无",
                  conclusion3: item.curr2ChecklistDtos
                    ? (item.curr2ChecklistDtos.result == 1 ? "合格" : "不合格")
                    : "无",

                  // conclusion3: item.checklistDtos.result == 1 ? "合格" : "不合格",
                  // contentRecord: item.contentRecord,
                  // standardName: item.standardName,
                  // createTime: getTime(item.createTime),
                  // usernames: item.usernames,
                  projectId: item.checklistDtos.projectId,
                  checklistId: item.checklistDtos.checklistId,
                  sort: item.checklistDtos.sort,
                  lookDetails: {
                    //详情
                    completChecklistDtos: item.completChecklistDtos, //竣工查验
                    inspectChecklistDtos: item.inspectChecklistDtos, //消防检测
                    curr2ChecklistDtos: item.curr2ChecklistDtos, //现场评定
                    checklistDtos: item.checklistDtos // 合并数据
                  }
                });
              });
            });
            return {
              listTit: i.primaryTitle,
              children
            };
          });
          this.list = this.list.sort(function(a, b) {
            return a.sort - b.sort;
          });
          // console.log(this.list);
        })
        .catch(err => {
          // this.$message({
          //   type: "warning",
          //   message: err
          // });
        });
    },
    handleModify(flag, item) {
      // console.log(1111111)
      // curr2ChecklistDtos.id
      this.getRecordsBills(item.curr2ChecklistDtos.id);
      // console.log(item);
      if (flag == 1) {
        this.readonly = true;
        this.form = item;
        this.showSaveBtn = false;
      } else {
        this.form = item;
        this.readonly = false;
        this.showSaveBtn = true;
      }
        if(!this.form.completChecklistDtos){
          this.form.completChecklistDtos={}
        }else{
           this.form.completChecklistDtos.contentRecord = changeEdit(this.form.completChecklistDtos.contentRecord)
      this.form.completChecklistDtos.createTime = getTime(this.form.completChecklistDtos.createTime)
      this.form.completChecklistDtos.result = this.form.completChecklistDtos.result?(this.form.completChecklistDtos.result==1?'合格':'不合格'):''
        }
      if(!this.form.inspectChecklistDtos){
        this.form.inspectChecklistDtos={}
      }else{
         this.form.inspectChecklistDtos.contentRecord = changeEdit(this.form.inspectChecklistDtos.contentRecord)
      this.form.inspectChecklistDtos.createTime = getTime(this.form.inspectChecklistDtos.createTime)
      this.form.inspectChecklistDtos.result = this.form.inspectChecklistDtos.result?(this.form.inspectChecklistDtos.result==1?'合格':'不合格'):''
      }
      if(!this.form.curr2ChecklistDtos){
        this.form.curr2ChecklistDtos={}
      }else{
        this.form.curr2ChecklistDtos.contentRecord = changeEdit(this.form.curr2ChecklistDtos.contentRecord)
      this.form.curr2ChecklistDtos.createTime = getTime(this.form.curr2ChecklistDtos.createTime)
      this.form.curr2ChecklistDtos.result = this.form.curr2ChecklistDtos.result?(this.form.curr2ChecklistDtos.result==1?'合格':'不合格'):''
      }

      
      // console.log(this.form);
      this.showMask = true;
    },
     //根据recodeId获取验收记录修改日志
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
      if(this.form.curr2ChecklistDtos){
        if(this.form.curr2ChecklistDtos.bill){
           updateRecode({
        id: this.form.curr2ChecklistDtos.id,
        contentRecord: this.form.curr2ChecklistDtos.contentRecord,
        checkNum: this.form.curr2ChecklistDtos.checkNum,
        checkPart: this.form.curr2ChecklistDtos.checkPart,
        bill:this.form.curr2ChecklistDtos.bill,
        result:this.form.curr2ChecklistDtos.result=='合格'?1:5
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
        }else{
          this.$message({
            type:'info',
            message:'请填写修改原由'
          })
        }
         
      }else{
        this.$message({
          type:'info',
          message:'请检查现场评定记录已提交'
        })
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
      this.fileList=[]
      if (i == "MP3") {
        this.audioWrapper = true;
        this.imgWrapper = false;
        this.videoWrapper = false;
        this.$refs.audio.src=''
      } else if (i == "MP4") {
        this.audioWrapper = false;
        this.imgWrapper = false;
        this.videoWrapper = true;
         this.$refs.video.src = ''
      } else {
        this.audioWrapper = false;
        this.imgWrapper = true;
        this.videoWrapper = false;
        this.imgSrc=''
      }
      // console.log(item)
      getUploadsByChecklistId({
        checklistId: item.checklistId,
        projectId: item.projectId,
        type: i,
        standardId:this.$store.state.recodeStandard.standardId
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
    // 导出
     downloadEvaiuationRecode(){
              this.loading = true
      // console.log(this.$store.state.ScreeningRecordObj)
      // console.log(this.$store.state.projectInfor.standardId)
      let primaryTitleId='',secondaryTitleId='';
      if(this.$store.state.ScreeningRecordObj.ascaderValue){
         if(splitStr(this.$store.state.ScreeningRecordObj.ascaderValue)[0]=='menuLevel1'){
            primaryTitleId=splitStr(this.$store.state.ScreeningRecordObj.ascaderValue)[1];
            secondaryTitleId=''
        }else{
            primaryTitleId='';
            secondaryTitleId=this.$store.state.ScreeningRecordObj.ascaderValue
        }
      }else{
        primaryTitleId='';
        secondaryTitleId=''
      }
      let importantValue= this.$store.state.ScreeningRecordObj.importantValue?this.$store.state.ScreeningRecordObj.importantValue:''
      let inspectionValue= this.$store.state.ScreeningRecordObj.inspectionValue?this.$store.state.ScreeningRecordObj.inspectionValue:''
      let detectionValue= this.$store.state.ScreeningRecordObj.detectionValue?this.$store.state.ScreeningRecordObj.detectionValue:''
      let evaluationValue= this.$store.state.ScreeningRecordObj.evaluationValue?this.$store.state.ScreeningRecordObj.evaluationValue:'';
      // console.log(this.$store.state.ScreeningRecordObj.importantValue)
       exportMethod({
        projectId:this.$store.state.projectInfor.projectId,
        projectName:this.$store.state.projectInfor.projectName,
        standardId:this.$store.state.projectInfor.standardId,
        checkTypeName:importantValue,
        copyCompleteRecordResult:inspectionValue,
        copyInspectRecordResult:detectionValue,
        result:evaluationValue,
        primaryTitleId,
        secondaryTitleId,
      })
      .then(res=>{
            if(res){
              this.loading = false
            }
      }).catch(err=>{
              this.loading = false
        this.$message({
          type:'info',
          message:'导出失败'
        })
      })
    }
  },
  computed: {
    getProjectId() {
      return this.$store.state.projectInfor;
    },
    getSearchValue(){
      return this.$store.state.ScreeningRecordObj
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
      if(val1.ascaderValue){
        if(splitStr(val1.ascaderValue)[0]=='menuLevel1'){
          obj = {
            primaryTitleId:splitStr(val1.ascaderValue)[1],
            secondaryTitleId:'',
          }
        }else{
           obj = {
            primaryTitleId:'',
            secondaryTitleId:val1.ascaderValue,
          }
        }
      }else{
        obj = {
          primaryTitleId:'',
          secondaryTitleId:'',
        }
      }
      
       this.primaryTitleId = obj.primaryTitleId
       this.secondaryTitleId = obj.secondaryTitleId
       this.checkTypeName = val1.importantValue
       this.copyCompleteRecordResult = val1.inspectionValue
       this.copyInspectRecordResult = val1.detectionValue
       this.result = val1.evaluationValue
         this.unitCurrentPage = 1
         this.unitCurrentChange(this.unitCurrentPage)
    }
    
  }
};
</script>

<style lang="less" >
#EvaluationWrapper {
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
    flex: 0 0 80px;
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
    // display: flex;
    // justify-content: center;
    z-index:200;
    
    // background-color: #f4f4f4;
    // opacity: 0.8;
    background-color: rgba(0, 0, 0, 0.8);
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
        line-height: 30px;
        text-indent: 30px;
        color: #409eff;
      }
      & > .bottomLine {
        border-bottom: 2px solid #f4f4f4;
      }
      & > .el-row {
        // text-indent: 40px;
        // padding: 0 0 0 30px;
        line-height: 60px;
        // .el-input {
        //   width: 70%;
        //   margin-left: 10px;
        // }
        .el-textarea__inner {
          width: 100%;
          // display: inline-block;
        }
        .nopadding {
        }
        .textarea {
          width: 70% !important;
          margin-left: 40px;
        }
        .btns {
          text-align: center;
          margin-top: 20px;
        }
      }
      .lh30{
    line-height: 30px;
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
  .borderLine {
    border: 1px solid #ccc;
    margin: 10px 30px;
    .tit {
      text-align: center;
      line-height: 40px;
      color: #409eff;
    }
  }
  .rLine {
    border-right: 1px solid #ccc;
    height: 350px;
  }
  .ti30 {
    text-indent: 30px;
  }
  .plr10 {
    padding: 0 10px;
  }
  .w80 {
    width: 80px;
  }
  .el-radio-group {
    text-indent: 0;
    .el-radio {
      margin-right: 0;
      margin-left: 10px;
    }
  }
  .exportRecode{
    position: absolute;
    right:10px;
    top: -55px; 
    z-index: 100
  }
}
</style>