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
        <img src="../assets/imgs/index/user.png" alt="" @click="dialoguserFormVisible = true">

        <div>
          <el-dialog title="用户详情" :visible.sync="dialoguserFormVisible">
            <el-form :model="userForm">
              <el-form-item label="用户账号" :label-width="formLabelWidth">
                <el-input v-model="userForm.account" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户密码" :label-width="formLabelWidth">
                <el-input v-model="userForm.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户姓名" :label-width="formLabelWidth">
                <el-input v-model="userForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" :label-width="formLabelWidth">
                <el-input v-model="userForm.phone" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialoguserFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onModify()">修改</el-button>
            </div>
          </el-dialog>

        </div>

        <div class="userInfo">
          <p>{{userName}}</p>
          <p @click="returnLogin()">安全退出</p>
        </div>
      </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { inDexOfStr } from "../utils/publictool.js";
import { getLoginAccountInfo } from "@/apis/login.js";
import { updateUser } from "@/apis/userUnit.js";
export default {
  data() {
    return {
      navList: [
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
      ],
      cindex: 0,
      userName: "用户未登录",
      dialoguserFormVisible: false,
      userForm: {},
      formLabelWidth: "100px",
      roleShow1: false, // admin
      roleShow2: false, // 验收单位管理员
      roleShow3: false, // 验收人员角色控制
      roleShow4: false // 建设单位
    };
  },
  created() {
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
    }else if(inDexOfStr(this.$route.path, "user")){
      this.cindex = 6;
    }else{
      this.cindex = 7;

    }
    getLoginAccountInfo()
      .then(res => {
        if (res.httpStatus != 200) {
          this.$router.history.push("/");
        } else {
          this.userName = res.result.account;
          this.userForm = res.result;
        }
      })
      .catch(err => {
        this.$message({
          type: "warning",
          message: "账号未登录"
        });
        this.$router.history.push("/");
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
      updateUser({
        userId: this.userForm.userId,
        account: this.userForm.account,
        password: this.userForm.password,
        username: this.userForm.username,
        phone: this.userForm.phone
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
      if (roleCode == 600 || roleCode == 650 || roleCode == 700) {
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
            img: require("../assets/imgs/index/gongchengxiangmu.png"),
            text: "验收任务",
            path: "/index/acaceptTask/taskArrangement",
            roleShow4: true
          },
          {
            id: 4,
            img: require("../assets/imgs/index/jilu.png"),
            text: "验收记录",
            path: "/index/recode",
            roleShow4: false
          },
          {
            id: 5,
            img: require("../assets/imgs/index/biaozhun.png"),
            text: "验收标准",
            path: "/index/standard",
            roleShow4: false
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
      } else if (roleCode == 500) {
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
            img: require("../assets/imgs/index/gongchengxiangmu.png"),
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
            roleShow4: false
          },
          {
            id: 6,
            img: require("../assets/imgs/index/yonghuguanli.png"),
            text: "用户管理",
            path: "/index/user/userManage",
            roleShow4: false
          }
        ];
      } else if (roleCode == 400 || roleCode == 450) {
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
            img: require("../assets/imgs/index/gongchengxiangmu.png"),
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
            roleShow4: false
          },
          {
            id: 6,
            img: require("../assets/imgs/index/yonghuguanli.png"),
            text: "用户管理",
            path: "/index/user/userManage",
            roleShow4: true
          }
        ];
      }
    }
    // //请求登录详情
    // getLoginAccountInfo(){

    // }
  },
  computed:{
    getCindex(){
      return this.$store.state.cindex
    }
  },
  watch:{
    getCindex(val1,val2){
      console.log(val1,val2)
      this.cindex = val1
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
}
</style>