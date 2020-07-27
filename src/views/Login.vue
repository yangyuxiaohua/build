<template>
  <div id="login">

    <!-- 登录表单 -->
    <div class="loginForm">
      <div class="title tac">
        <h2>昆明市住房和城乡建设局</h2>
        <h1>建设工程消防验收</h1>
      </div>
      <el-form :model="loginForm" :rules="rules" status-icon label-width="60px" :hide-required-asterisk='hideRequiredAsterisk'>
        <!-- 账号 -->
        <el-form-item prop="phone" label="账号">
          <el-input v-model="loginForm.phone" prefix-icon="iconfont icon-zhanghao" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input @click.native="changeType" v-model="loginForm.password" :suffix-icon="isOpen ? 'iconfont icon-yanjing-zheng' : 'iconfont icon-yanjing_bi'" prefix-icon="iconfont icon-mima" :type="isOpen ? 'text' : 'password'" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 系统 -->
        <!-- <el-form-item label="系统" prop="system">
        <el-select v-model="loginForm.system" placeholder="请选择系统">
          <el-option label="预警系统" value="1"></el-option>
          <el-option label="平台系统" value="50"></el-option>
        </el-select>
      </el-form-item> -->
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="warning" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="img"><img src="../assets/imgs/index/zhujian.png" alt=""></div>
    <div class="appImg">
      <h2>下载app &nbsp;&nbsp;（Android）</h2>
      <img src="../assets/imgs/index/app.png" alt="">
    </div>
  </div>
</template>

<script>
// 引入本地存储工具函数
// import { setSid } from "@/utils/local";
// 引入请求接口的函数
import { login, getCurrentRole, getUserInfor } from "@/apis/login";
import { Message } from "element-ui";
// import { setKey } from "@/utils/local";
export default {
  data() {
    return {
      loginFlag: true, //防抖
      // 登录表单
      loginForm: {
        phone: "",
        password: "",
        system: 1
      },
      //  眼睛状态
      isOpen: false,
      //   验证规则
      rules: {
        phone: [
          { required: true, message: "账号不能为空", trigger: "blur" }, // 非空
          { min: 3, max: 15, message: "账号长度 3 ~ 15 位", trigger: "blur" } // 长度
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }, // 非空
          { min: 3, max: 15, message: "密码长度 3 ~ 15 位", trigger: "blur" } // 长度
        ],
        system: [{ required: true, message: "请选择系统", trigger: "blur" }]
      },
      hideRequiredAsterisk: false
    };
  },
  created() {
    this.$store.commit("saveUserRole", {});
    this.$store.commit("saveUserInfor", {});
    this.$store.commit("chosedProjectId", {});
    this.$store.commit("saveStandardId", "");
    this.$store.commit("savePoint", {});
    this.$store.commit("saveUnitInfo", {});
    this.$store.commit("changeUnitStatus", '');
    this.$store.commit("changeConfiFlag", '');
    this.$store.commit("filterMarkers", '');
    this.$store.commit("changeCindex", '');
    this.$store.commit("saveRecodeStandard", {});
    this.$store.commit("saveFactoryType", "");
    this.$store.commit("saveFactoryType", {});
  },
  methods: {
    //  切换眼睛开和闭
    changeType(e) {
      if (e.target.className.includes("icon-yanjing")) {
        this.isOpen = !this.isOpen;
      }
    },

    // 登录
    submitForm() {
      if (this.loginFlag) {
        login(this.loginForm)
          .then(res => {
            if (res.httpStatus === 200) {
              sessionStorage.sid = res.result;
              //获取用户详情
              getUserInfor()
                .then(res => {
                  if (res.httpStatus == 200) {
                    this.$store.commit("saveUserInfor", res.result);
                    getCurrentRole()
                      .then(res => {
                        if (res.httpStatus == 200) {
                          this.$store.commit("saveUserRole", res.result);
                          this.$router.history.push("/index/home");
                        }
                      })
                      .catch(err => {
                        this.$message({
                          type: "warning",
                          message: err
                        });
                      });
                  }
                })
                .catch(err => {
                  this.$message({
                    type: "warning",
                    message: err
                  });
                });
              //获取正在登录的角色
            } else {
              Message.error("账号/密码错误");
            }
          })
          .catch(err => {
            Message.error("账号/密码错误");
          });
        setTimeout(() => {
          this.loginFlag = true;
        }, 3000);
        this.loginFlag = false;
      }
    },
    // 注册
    register(){
      // this.$message({
      //   type:'info',
      //   message:'请扫描页面二维码，下载手机app注册'
      // })
      this.$router.history.push('/register')
    }
  }
};
</script>

<style lang="less" >
#login {
  width: 100%;
  height: 100%;
  background: url("../assets/imgs/index/back2.png") no-repeat 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  .loginForm {
    width: 400px;
    .title {
      margin-bottom: 30px;
      text-align: center;
      h1 {
        font-size: 26px;
        font-weight: 700;
        text-align: center;
      }
      h2 {
        font-size: 18px;
      }
    }
    .el-form {
      .el-button {
        width: 30%;
      }
      .btns{
        .el-form-item__content{
          display: flex;
          justify-content: space-between;
        }
        // width: 100%;
      }
    }
  }
  .tac {
    text-align: center;
  }
  .img {
    position: absolute;
    left: 0;
    bottom: 0;
    img {
      width: 100%;
    }
  }
  .appImg {
    position: absolute;
    bottom: 20px;
    right: 30px;
    width: 160px;
    img {
      width: 100%;
      // height: 100px;
    }
    h2 {
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>