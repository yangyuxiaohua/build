<template>
    <div id="registerWrapper">
        <div class="registerHeader">
            <span class="registerHeaderTit">建设工程消防验收</span>
            <el-divider direction="vertical"></el-divider>
            <span>单位注册</span>
        </div>
        <div class="registerContainer">
            <p class="promptText">
                提示：业务办理将使用该注册信息，您需要确保填写的信息真实无误！
            </p>
            <div class="registerInfoBox">
                <div class="unitInfo">
                    <el-divider content-position="left">单位信息 </el-divider>
                    <el-form :model="unitForm">
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="企业名称" :label-width="formLabelWidth">
                                    <el-input v-model="unitForm.factoryName" autocomplete="off" placeholder="请填写单位全称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='7'>
                                <el-form-item label="注册地址" :label-width="formLabelWidth">
                                    <el-select placeholder="云南省" disabled class="w100px" v-model="r1">
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span='3'>
                                <el-select placeholder="昆明市" disabled class="w100px" v-model="r1">
                                </el-select>
                            </el-col>
                            <el-col :span='3'>
                                <el-select placeholder="请选择" v-model="unitForm.regionId" class="w100px" @focus="getRegion()">
                                    <el-option v-for="(item,index) in rangeOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>

                            </el-col>
                            <el-col :span='11'>
                                <el-input v-model="unitForm.unitLocation" autocomplete="off" placeholder='请填写详细位置'></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="统一社会信用代码" :label-width="formLabelWidth">
                                    <el-input v-model="unitForm.maleSignal" autocomplete="off" placeholder='请对照有效证件填写'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="单位类型" :label-width="formLabelWidth">
                                    <el-select placeholder="请选择" v-model="unitForm.type" class="w100">
                                        <el-option v-for="(item,index) in unitTypeOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="营业执照扫描件" :label-width="formLabelWidth">
                                    <!-- <el-input v-model="unitForm.businessLicense" autocomplete="off"></el-input> -->
                                    <div class="uploadBox" v-loading="loading">
                                        <el-upload class="avatar-uploader" :action="uploadIp" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                            <img v-if="imageUrl" :src="imageUrl" class="avatar wh80px">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                    </div>
                                    <el-button size='mini' plain class="lookImg" @click="dialogVisible = true" v-show="imageUrl">查看大图</el-button>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="imageUrl" alt="">
                                    </el-dialog>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>

                </div>
                <div class="accountInfo">
                    <el-divider content-position="left">账号信息 </el-divider>
                    <el-form :model="accountForm">
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="联系人员" :label-width="formLabelWidth">
                                    <el-input v-model="accountForm.contactMasterUser" autocomplete="off" placeholder='请填写您的真实姓名'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="联系电话" :label-width="formLabelWidth">
                                    <el-input v-model="accountForm.contactMasterPhone" autocomplete="off" placeholder='请填写您的手机号码'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="用户账号" :label-width="formLabelWidth">
                                    <el-input v-model="accountForm.account" autocomplete="off" placeholder='请设置使用该系统的账号'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="登录密码" :label-width="formLabelWidth">
                                    <el-input v-model="accountForm.password" autocomplete="off" placeholder='请填写您的密码'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='24'>
                                <el-form-item label="确认密码" :label-width="formLabelWidth">
                                    <el-input v-model="accountForm.password2" autocomplete="off" placeholder='请再次输入密码'></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                </div>
            </div>
            <div class="btns">
                <el-button type="primary" @click="agreeRegister()">同意注册</el-button>
                <el-button type="info" plain @click="returnLogin()">返回登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { uploadIp, ImgIp } from "@/apis/upload.js";
import { getRegions } from "@/apis/project.js";
import { register, registerRepeat } from "@/apis/login.js";
export default {
  data() {
    return {
      formLabelWidth: "150px",
      unitForm: {}, // 单位信息
      accountForm: {}, // 账号信息
      rangeOptions: [], //区县数据
      r1: "", //省市value
      unitTypeOptions: [
        { name: "建设单位", id: 1 },
        { name: "服务机构", id: 10 }
      ],
      loading: false,
      dialogVisible: false,
      imageUrl: "",
      uploadIp: ""
    };
  },
  created() {
    this.uploadIp = uploadIp;
  },
  methods: {
    getRegion() {
      //   console.log(1111);
      getRegions({
        level: 3,
        // pid: this.form.cityRegion
        pid: "530100000000"
      })
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            this.rangeOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    // 上传
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      //   console.log(res, file);
      if (res.httpStatus == 200) {
        this.unitForm.businessLicense = res.result;
        this.imageUrl = ImgIp + res.result;
      }
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
    agreeRegister() {
      if (this.unitForm.maleSignal) {
        registerRepeat({ maleSignal: this.unitForm.maleSignal }).then(res => {
          if (!res.result) {
            if (this.accountForm.password == this.accountForm.password2) {
              register({
                factoryName: this.unitForm.factoryName,
                regionId: this.unitForm.regionId,
                unitLocation: this.unitForm.unitLocation,
                maleSignal: this.unitForm.maleSignal,
                type: this.unitForm.type,
                businessLicense: this.unitForm.businessLicense,
                contactMasterUser: this.accountForm.contactMasterUser,
                username: this.accountForm.contactMasterUser,
                contactMasterPhone: this.accountForm.contactMasterPhone,
                account: this.accountForm.account,
                password: this.accountForm.password
              })
                .then(res => {
                  if (res.httpStatus == 200) {
                    this.$alert(
                      "请妥善保管注册账号信息！您需要登录系统pc端进一步完善单位信息，分配本单位的其他用户账号",
                      "注册成功",
                      {
                        confirmButtonText: "确定"
                      }
                    );
                  }
                })
                .catch(err => {
                  this.$message({
                    type: "info",
                    message: "请求失败"
                  });
                });
            } else {
              this.$message({
                type: "info",
                message: "两次输入密码不一致，请确认！！！"
              });
            }
          } else {
            this.$alert(
              "您注册的单位已经存在系统中，请联系系统管理员复核。联系电话0871-65710577",
              "注册失败",
              {
                confirmButtonText: "确定"
              }
            );
          }
        });
      } else {
        this.$message({
          type: "info",
          message: "请填写统一社会信用代码!"
        });
      }
      //    registerRepeat({})
    },
    returnLogin() {
      this.$router.history.push("/");
    }
  }
};
</script>

<style lang="less">
#registerWrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .registerHeader {
    width: 100%;
    height: 80px;
    line-height: 80px;
    background-color: #000;
    color: #fff;
    box-sizing: border-box;

    padding: 0 60px;
    .registerHeaderTit {
      font-size: 24px;
    }
    .el-divider {
      margin: 0 12px;
    }
  }
  .registerContainer {
    padding: 0 30px;
    .promptText {
      font-size: 12px;
      line-height: 80px;
    }
    .el-divider {
      .el-divider__text {
        // margin: 0 12px;
        left: 0;
      }
    }
    .registerInfoBox {
      display: flex;
      justify-content: space-around;
      font-size: 16 px;
      .unitInfo {
        width: 50%;
        padding: 0 20px;
        // .el-form{
        //     padding: 0 20px;
        //     .el-row{
        //         margin-top: 30px;
        //     }
        // }
      }
      .accountInfo {
        width: 50%;
        padding: 0 20px;
      }
      .el-form {
        padding: 0 20px;
        .el-row {
          margin-top: 30px;
        }
      }
    }
    .btns {
      margin-top: 100px;
      text-align: center;
    }
    .w100px {
      width: 90px;
    }
    .w100 {
      width: 100%;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .avatar-uploader-icon,
    .wh80px {
      width: 80px;
      height: 80px;
      line-height: 80px;
    }
    .uploadBox {
      width: 80px;
      height: 80px;
      position: relative;
    }
  }
}
</style>