<template>
  <div id="indexWrapper">
    <div class="header">
      <div class="nav">
        <div class="navList" v-for="(item,index) in navList" :key="index" @click="clickNav(item.path,item.id)" :class="{c409eff:cindex==item.id}" v-show="item.roleShow4">
          <span class="icon"><img :src="item.img" alt=""></span>
          <span class="text">{{item.text}}</span>
        </div>
      </div>
      <div class="user">
        <img src="../assets/imgs/index/user.png" alt="" @click="dialogUserFormVisibleIndex = true">

        <div class="userInfo">
          <p>{{userName}}</p>
          <p @click="returnLogin()">安全退出</p>
        </div>
      </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
    <el-dialog title="用户详情" :visible.sync="dialogUserFormVisibleIndex">
      <el-form :model="userForm">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="用户账号" :label-width="formLabelWidth">
              <el-input v-model="userForm.account" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户密码" :label-width="formLabelWidth">
              <el-input v-model="userForm.password" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="用户姓名" :label-width="formLabelWidth">
              <el-input v-model="userForm.username" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="userForm.phone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span='12'>
            <el-form-item label="所属组织" :label-width="formLabelWidth">
              <el-input v-model="userForm.partName" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户角色" :label-width="formLabelWidth">
              <el-input v-model="userForm.roleName" autocomplete="off" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input v-model="userForm.idcard" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="使用状态" :label-width="formLabelWidth">
              <el-radio-group v-model="userForm.enable" disabled>
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="-1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="isService">
          <el-col :span='12'>
            <el-form-item label="执业资格证" :label-width="formLabelWidth">
              <el-select v-model="userForm.professionalCertificate" placeholder="" class="w100">
                <el-option label="一级注册消防工程师" value="1"></el-option>
                <el-option label="消防设施操作员（三级/高级技能）" value="5"></el-option>
                <el-option label="消防设施操作员（四级/中级技能）" value="10"></el-option>
                <el-option label="消防设施操作员（五级/初级技能）" value="15"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>

            <el-form-item label="技术岗位" :label-width="formLabelWidth">
              <el-select v-model="userForm.technicalPositions" placeholder="" class="w100" disabled>
                <el-option label="技术责任人" value="5"></el-option>
                <el-option label="项目负责人" value="1"></el-option>
                <el-option label="检测人员" value="10"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row v-show="isService">
          <el-col :span='24'>
            <el-form-item label="资格证书" :label-width="formLabelWidth" class="flexFormItem">
              <div v-for="(item,index) in imgList" :key="index" class="imgList wh80px"><img :src="item" alt="" class="wh80px">
                <div class="imgMask">
                  <i class="el-icon-zoom-in" @click="lookImg(item)"></i>
                  <i class="el-icon-delete" @click="deleteImage(index)"></i>
                </div>
              </div>
              <el-upload class="avatar-uploader" :action="uploadIp" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" v-loading="loading">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>

              <el-dialog :visible.sync="dialogVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>

            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserFormVisibleIndex = false">取 消</el-button>
        <el-button type="primary" @click="onModify()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { inDexOfStr } from "../utils/publictool.js";
import { getLoginAccountInfo } from "@/apis/login.js";
import { updateUser } from "@/apis/userUnit.js";
import { uploadIp, ImgIp } from "@/apis/upload.js";

export default {
  data() {
    return {
      navList: [],
      cindex: 0,
      userName: "用户未登录",
      dialogUserFormVisibleIndex: false,
      userForm: {},
      formLabelWidth: "100px",
      roleShow1: false, // admin
      roleShow2: false, // 验收单位管理员
      roleShow3: false, // 验收人员角色控制
      roleShow4: false, // 建设单位
      isService: false,
      dialogVisible: false,
      dialogImageUrl: "",
      imgList: [],
      loading: false,
      uploadIp: ""
    };
  },
  created() {
    this.uploadIp = uploadIp;
    this.roleShow();
    if (inDexOfStr(this.$route.path, "home")) {
      this.cindex = 1;
    } else if (inDexOfStr(this.$route.path, "project")) {
      this.cindex = 2;
    } else if (inDexOfStr(this.$route.path, "acceptTask")) {
      this.cindex = 3;
    } else if (inDexOfStr(this.$route.path, "recode")) {
      this.cindex = 4;
    } else if (inDexOfStr(this.$route.path, "standard")) {
      this.cindex = 5;
    } else if (inDexOfStr(this.$route.path, "user")) {
      this.cindex = 6;
    } else {
      this.cindex = 7;
    }
    getLoginAccountInfo()
      .then(res => {
        console.log(res);
        if (res.httpStatus != 200) {
          this.$router.history.push("/");
        } else {
          this.userName = res.result.account;
          this.userForm = res.result;
          this.imgList = res.result.professionalImage2Url
            ? res.result.professionalImage2Url.split(",")
            : [];
        }
      })
      .catch(err => {
        console.log(err);
        this.$router.history.push("/");
        this.$message({
          type: "warning",
          message: "账号未登录"
        });
        // this.$router.history.push("/");
      });
  },
  methods: {
    clickNav(path, index) {
      this.$router.history.push(path);
      this.cindex = index;
    },
    returnLogin() {
      this.$router.history.push("/");
    },
    //修改账号
    onModify() {
      this.userForm.professionalImage2Url = this.imgList.join(',')
      
      updateUser({
          userId: this.userForm.userId,
            // account: this.userForm.account,
          account: this.userForm.account,
          password: this.userForm.password,
          username: this.userForm.username,
          phone: this.userForm.phone,
          idcard: this.userForm.idcard,
          professionalCertificate: this.userForm.professionalCertificate,
          professionalImage2Url: this.userForm.professionalImage2Url
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "修改成功，请重新登录"
            });
            this.$router.history.push("/");
          } else {
            this.$message({
              type: "info",
              message: "修改失败"
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err
          });
        });
    },
    //角色控制
    roleShow() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode == 300) {
        this.navList = [
          {
            id: 1,
            img: require("../assets/imgs/index/shouye.png"),
            text: "首页",
            path: "/index/home",
            roleShow4: true
          },
          {
            id: 2,
            img: require("../assets/imgs/index/gongchengxiangmu.png"),
            text: "工程项目",
            path: "/index/project/basicInfor",
            roleShow4: true
          },
          {
            id: 3,
            img: require("../assets/imgs/index/task.png"),
            text: "验收任务",
            path: "/index/acaceptTask/taskArrangement",
            roleShow4: true
          },
          {
            id: 4,
            img: require("../assets/imgs/index/jilu.png"),
            text: "验收记录",
            path: "/index/recode",
            roleShow4: true
          },
          {
            id: 5,
            img: require("../assets/imgs/index/biaozhun.png"),
            text: "验收标准",
            path: "/index/standard",
            roleShow4: true
          },
          {
            id: 6,
            img: require("../assets/imgs/index/yonghuguanli.png"),
            text: "用户管理",
            path: "/index/user/userManage",
            roleShow4: true
          },
          {
            id: 7,
            img: require("../assets/imgs/index/system.png"),
            text: "系统管理",
            path: "",
            roleShow4: true
          }
        ];
      } else {
        if (roleCode == 500 || roleCode == 700 || roleCode == 900) {
          this.navList = [
            {
              id: 1,
              img: require("../assets/imgs/index/shouye.png"),
              text: "首页",
              path: "/index/home",
              roleShow4: true
            },
            {
              id: 2,
              img: require("../assets/imgs/index/gongchengxiangmu.png"),
              text: "工程项目",
              path: "/index/project/basicInfor",
              roleShow4: true
            },
            {
              id: 3,
              img: require("../assets/imgs/index/task.png"),
              text: "验收任务",
              path: "/index/acaceptTask/taskArrangement",
              roleShow4: true
            },
            {
              id: 4,
              img: require("../assets/imgs/index/jilu.png"),
              text: "验收记录",
              path: "/index/recode",
              roleShow4: true
            },
            {
              id: 7,
              img: require("../assets/imgs/index/system.png"),
              text: "系统管理",
              path: "",
              roleShow4: true
            }
          ];
        } else {
          this.navList = [
            {
              id: 1,
              img: require("../assets/imgs/index/shouye.png"),
              text: "首页",
              path: "/index/home",
              roleShow4: true
            },
            {
              id: 2,
              img: require("../assets/imgs/index/gongchengxiangmu.png"),
              text: "工程项目",
              path: "/index/project/basicInfor",
              roleShow4: true
            },
            {
              id: 3,
              img: require("../assets/imgs/index/task.png"),
              text: "验收任务",
              path: "/index/acaceptTask/taskArrangement",
              roleShow4: true
            },
            {
              id: 4,
              img: require("../assets/imgs/index/jilu.png"),
              text: "验收记录",
              path: "/index/recode",
              roleShow4: true
            },
            {
              id: 6,
              img: require("../assets/imgs/index/yonghuguanli.png"),
              text: "用户管理",
              path: "/index/user/userManage",
              roleShow4: true
            },
            {
              id: 7,
              img: require("../assets/imgs/index/system.png"),
              text: "系统管理",
              path: "",
              roleShow4: true
            }
          ];
        }
      }
      if (
        roleCode == 300 ||
        roleCode == 400 ||
        roleCode == 450 ||
        roleCode == 500
      ) {
        this.isService = false;
      } else {
        this.isService = true;
      }
    },
    //上传相关
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(res, file);
      this.imgList.push(ImgIp + res.result);
      // if (res.httpStatus == 200) {
      //   this.form.businessLicense = res.result;
      //   this.imageUrl = ImgIp + res.result;
      // }
      this.userForm.professionalImage2Url = this.imgList.join(",");
      this.loading = false;
    },
    beforeAvatarUpload(file) {
      this.loading = true;
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    lookImg(src) {
      this.dialogVisible = true;
      this.dialogImageUrl = src;
    },
    //删除图片
    deleteImage(i) {
      this.imgList.splice(i, 1);
    }
    // //请求登录详情
    // getLoginAccountInfo(){

    // }
  },
  computed: {
    getCindex() {
      return this.$store.state.cindex;
    }
  },
  watch: {
    getCindex(val1, val2) {
      // console.log(val1, val2);
      this.cindex = val1;
    }
  }
};
</script>

<style lang="less">
#indexWrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .header {
    // height: 80px;
    flex: 0 0 80px;
    width: 100%;
    background-color: #01162b;
    display: flex;
    .nav {
      flex: 1;
      display: flex;
      align-items: center;
      color: #fff;
      .navList {
        display: flex;
        flex-direction: column;
        width: 80px;
        height: 60px;
        margin-left: 60px;
        align-items: center;
        .icon {
          img {
            width: 30px;
            height: 30px;
          }
        }
        .text {
          //   text-align: center;
          line-height: 30px;
        }
      }
      .navList:hover {
        cursor: pointer;
        color: #409eff;
      }
      .c409eff {
        color: #409eff;
      }
    }
    .user {
      // width: 120px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 100;
      cursor: pointer;
      img {
        width: 48px;
      }
      .userInfo {
        margin-left: 10px;
        line-height: 28px;
        & > p:first-child {
          color: #fff;
        }
        & > p:last-child {
          color: rgb(150, 46, 46);
        }
      }
    }
  }
  .container {
    flex: 1;
  }
  .flexFormItem {
    // display: flex;
    .el-form-item__content {
      margin-left: 0;
      width: 100%;
      display: flex;
    }
    // flex-direction: row;
    .wh80px {
      width: 80px;
      height: 80px;
    }
    .imgList {
      position: relative;
      margin-left: 10px;
      .imgMask {
        width: 100%;
        height: 100%;
        font-size: 20px;
        color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #000;
        opacity: 0.8;
        line-height: 80px;
        display: none;
        i {
          margin-left: 10px;
        }
      }
    }
    .imgList:hover .imgMask {
      display: block;
      cursor: pointer;
    }
    .el-upload,
    .el-upload--picture-card,
    .el-upload-list__item,
    .is-ready {
      width: 80px;
      height: 80px;
      line-height: 80px;
      border: 1px dotted #ccc;
    }
    // .uploadIcon{
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   border: 1px dotted red;
    // }
  }
}
</style>