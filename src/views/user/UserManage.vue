<template>
  <div id="userManageWrapper">
    <el-form ref="Unitform" :model="form" label-width="120px">
      <el-row>
        <el-col>
          <el-form-item label="上级机构">
            <el-cascader :options="options" :props="props" clearable v-model="form.authPartsIds" class="w100" ref="ascader1" @change='chosedauthPartsIds()' :disabled='disabledAuthPart'></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称">
            <el-input v-model="form.partsName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="机构地址">
            <el-input v-model="form.departmentPosition"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构类别">
            <el-select v-model="form.type" placeholder="请选择机构类型" class="w100" @change='changeOrganizationType()'>
              <el-option label="单位" value="5"></el-option>
              <el-option label="部门" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 建设单位 -->
        <el-col :span="12" v-show="isACceptShow">
          <el-form-item label="资质等级">
            <el-input v-model="form.qualificationLevel"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <!-- 建设单位 -->
      <el-row v-show="isACceptShow">
        <el-col :span="12">
          <el-form-item label="法定代表人">
            <el-input v-model="form.legalPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号">
            <el-input v-model="form.idcard"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row v-show="isService">
        <el-col :span="12">
          <el-form-item label="技术责任人">
            <el-input v-model="form.technicalDirectorPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号">
            <el-input v-model="form.technicalDirectorIdcard"></el-input>
          </el-form-item>
        </el-col>

      </el-row>

      <!-- <el-row v-show='unitTypeShow'>
        <el-col>
          <el-form-item label="单位类别">
            <el-select v-model="form.type" placeholder="请选择单位类别" class="w100">
              <el-option label="建设单位" value="1"></el-option>
              <el-option label="验收单位" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span='12'>
          <el-form-item label="联系人员">
            <el-input v-model="form.contactMasterUser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input v-model="form.contactMasterPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='12'>
          <el-form-item label="使用状态">
            <el-radio-group v-model="form.enable">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="-1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 建设单位 -->
        <el-col :span="12" v-show="isACceptShow">
          <el-form-item label="营业执照">
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
      <el-form-item class="tac">
        <el-button type="primary" @click="onSubmit" v-loading="loading2" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">{{btnText}}</el-button>
        <el-button @click="clickDelete()" v-show="deleteBtnShow">删除</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {
  getFactoryMenus,
  addPart,
  // addFactory,
  // deletedFactory,
  deletedPart,
  // updateFactory,
  updatedPart
} from "@/apis/userUnit.js";
import { uploadIp, ImgIp } from "@/apis/upload.js";
import { splitStr2 } from "@/utils/publictool";

export default {
  data() {
    return {
      // organizationType: "", //组织机构类型
      form: {},
      props: {
        // multiple: true,
        checkStrictly: true,
        children: "departments",
        label: "partsName",
        value: "authPartsIds",
        emitPath: false
      },
      options: [],
      unitTypeShow: true, //显示单位类别
      organizationTypeShow: true, //选择单位
      factoryId: "",
      deleteBtnShow: false,
      updata: false, //判断新增还是修改
      confiStatus: 1,
      disabledAuthPart: false, // 禁用上级部门
      imageUrl: "",
      uploadIp: "", //上传地址
      // businessLicense:'',//营业执照
      loading: false,
      loading2:false,
      dialogVisible: false, //查看大图
      isACceptShow: false, //验收单位表单隐藏
      isService: false, //服务机构
      btnText:'提交',
    };
  },
  created() {
    // authPartsIds
    this.getLastFactoryMenus();
    this.uploadIp = uploadIp;
    if (this.$store.state.factoryType == 5) {
      this.isACceptShow = false;
    } else {
      this.isACceptShow = true;
    }
    if (this.$store.state.factoryType == 10) {
      this.isService = true;
    } else {
      this.isService = false;
    }
    // console.log(this.$store.state)
  },

  methods: {
    onSubmit() {
      if (!this.updata) {
        // if (this.form.authPartsIds && this.form.authPartsIds != "") {
      this.loading2 = true
        addPart({
          authPartsIds: this.form.authPartsIds,
          partsName: this.form.partsName,
          departmentPosition: this.form.departmentPosition,
          // factoryId: this.factoryId,
          type: this.form.type,
          qualificationLevel: this.form.qualificationLevel,
          legalPerson: this.form.legalPerson,
          technicalDirectorPerson:this.form.technicalDirectorPerson,
          idcard: this.form.idcard,
          technicalDirectorIdcard: this.form.technicalDirectorIdcard,
          contactMasterUser: this.form.contactMasterUser,
          contactMasterPhone: this.form.contactMasterPhone,
          enable: this.form.enable,
          businessLicense: this.form.businessLicense,
          isRoot: this.form.isRoot,
          factoryType: this.$store.state.factoryType
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.changeConfiStatus();
              this.getLastFactoryMenus();
            } else {
              this.$message({
                type: "info",
                message: "网络请求失败"
              });
            }
              this.loading2 = false
          })
          .catch(err => {
              this.loading2 = false
            this.$message({
              type: "warning",
              message: err
            });
          });
        // } else {
        //   addFactory({
        //     contactMasterPhone: this.form.contactMasterPhone,
        //     contactMasterUser: this.form.contactMasterUser,
        //     // contactSecondaryPhone: this.form.contactSecondaryPhone,
        //     // contactSecondaryUser: this.form.contactSecondaryUser,
        //     unitLocation: this.form.departmentPosition,
        //     // factoryId: this.$store.state.userInfor.factoryId,
        //     factoryName: this.form.partsName,
        //     type: this.form.type
        //   })
        //     .then(res => {
        //       if (res.httpStatus == 200) {
        //         this.$message({
        //           type: "success",
        //           message: "添加成功"
        //         });
        //         this.changeConfiStatus();
        //         this.getLastFactoryMenus();
        //       } else {
        //         this.$message({
        //           type: "info",
        //           message: "网络请求失败"
        //         });
        //       }
        //     })
        //     .catch(err => {
        //       this.$message({
        //         type: "warning",
        //         message: err
        //       });
        //     });
        // }
      } else {
        // if (
        //   this.$store.state.unitInfo.factoryId &&
        //   this.$store.state.unitInfo.factoryId != ""
        // ) {
        //   updateFactory({
        //     authPartsIds: this.form.authPartsIds,
        //     contactMasterPhone: this.form.contactMasterPhone,
        //     contactMasterUser: this.form.contactMasterUser,
        //     // contactSecondaryPhone: this.form.contactSecondaryPhone,
        //     // contactSecondaryUser: this.form.contactSecondaryUser,
        //     unitLocation: this.form.departmentPosition,
        //     factoryId: this.$store.state.unitInfo.factoryId,
        //     factoryName: this.form.partsName,
        //     type: this.form.organizationType
        //   })
        //     .then(res => {
        //       if (res.httpStatus == 200) {
        //         this.$message({
        //           type: "success",
        //           message: "修改成功"
        //         });
        //         this.changeConfiStatus();
        //         this.getLastFactoryMenus();
        //       } else {
        //         this.$message({
        //           type: "info",
        //           message: "网络请求失败"
        //         });
        //       }
        //     })
        //     .catch(err => {
        //       this.$message({
        //         type: "warning",
        //         message: err
        //       });
        //     });
        // } else {
        updatedPart({
          // authPartsIds: this.form.authPartsIds,
          partsName: this.form.partsName,
          departmentPosition: this.form.departmentPosition,
          // factoryId: this.factoryId,
          type: this.form.type,
          qualificationLevel: this.form.qualificationLevel,
          legalPerson: this.form.legalPerson,
          technicalDirectorPerson: this.form.technicalDirectorPerson,
          idcard: this.form.idcard,
          idtechnicalDirectorIdcardcard: this.form.technicalDirectorIdcard,
          contactMasterUser: this.form.contactMasterUser,
          contactMasterPhone: this.form.contactMasterPhone,
          enable: this.form.enable,
          businessLicense: this.form.businessLicense,
          id: this.$store.state.unitInfo.id
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.changeConfiStatus();
              this.getLastFactoryMenus();
            } else {
              this.$message({
                type: "info",
                message: "网络请求失败"
              });
            }
          })
          .catch(err => {
            this.$message({
              type: "warning",
              message: err
            });
          });
        // }
      }
    },
    //选择机构类型
    changeOrganizationType() {},
    //获取上一级机构的数据
    getLastFactoryMenus() {
      getFactoryMenus({
        factoryType: this.$store.state.userInfor.factoryType
      })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
            this.options = res.result.map(item => {
              // console.log(item)
              // this.factoryId = item.factoryId;
              // item.id = item.factoryId;
              // item.authPartsIds = item.factoryId;
              // item.partsName = item.factoryName;
              return item;
            });
            console.log(this.options);
            this.options.unshift({ partsName: "无", authPartsIds: "000" });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    // 选中上一级机构
    chosedauthPartsIds() {
      // if (this.form.authPartsIds) {
      //   if (this.form.authPartsIds.indexOf(",") == -1) {
      //     this.factoryId = this.form.authPartsIds;
      //   } else {
      //     this.factoryId = splitStr2(this.form.authPartsIds)[0];
      //   }
      //   this.unitTypeShow = false;
      //   this.organizationTypeShow = true;
      // } else {
      //   this.unitTypeShow = true;
      //   this.organizationTypeShow = false;
      // }
      if (this.form.authPartsIds == "000") {
        this.form.isRoot = 1;
      } else {
        this.form.isRoot = -1;
      }
    },
    //删除
    clickDelete() {
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          // if (this.$store.state.unitInfo.factoryId) {
          //   deletedFactory({
          //     factoryId: this.$store.state.unitInfo.factoryId
          //   })
          //     .then(res => {
          //       if (res.httpStatus == 200) {
          //         this.$message({
          //           type: "success",
          //           message: "删除成功"
          //         });
          //         this.changeConfiStatus();
          //         this.getLastFactoryMenus();
          //       } else {
          //         this.$message({
          //           type: "success",
          //           message: "删除失败"
          //         });
          //       }
          //     })
          //     .catch(err => {
          //       this.$message({
          //         type: "warning",
          //         message: err
          //       });
          //     });
          // } else {
          deletedPart({
            id: this.$store.state.unitInfo.id
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.changeConfiStatus();
                this.getLastFactoryMenus();
              } else {
                this.$message({
                  type: "success",
                  message: "删除失败"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err
              });
            });
          // }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //数据回填
    getFormData(val) {
      console.log(val);
      this.form = {
        authPartsIds: val.isRoot == 1 ? "000" : val.authPartsIds,
        partsName: val.partsName,
        contactMasterUser: val.contactMasterUser,
        departmentPosition: val.departmentPosition,
        type: val.type,
        qualificationLevel: val.qualificationLevel,
        legalPerson: val.legalPerson,
        technicalDirectorPerson: val.technicalDirectorPerson,
        idcard: val.idcard,
        technicalDirectorIdcard: val.technicalDirectorIdcard,
        contactMasterUser: val.contactMasterUser,
        contactMasterPhone: val.contactMasterPhone,
        enable: val.enable,
        businessLicense: val.businessLicense
        // departmentPosition: val.unitLocation
        //   ? val.unitLocation
        //   : val.departmentPosition,
        // type: val.type,
      };
      this.disabledAuthPart = true;
      if (val.businessLicense) {
        this.imageUrl = ImgIp + val.businessLicense;
      } else {
        this.imageUrl = "";
      }
      console.log(this.form);
      console.log(this.options);
    },
    //修改,添加成功和删除成功修改操作的flag
    changeConfiStatus() {
      this.confiStatus = this.$store.state.confiflag == 1 ? 2 : 1;
      this.$store.commit("changeConfiFlag", this.confiStatus);
    },
    // 上传
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res, file);
      if (res.httpStatus == 200) {
        this.form.businessLicense = res.result;
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
    }
  },
  computed: {
    getStoreFormData() {
      return this.$store.state.unitInfo;
    },
    getUnitStatus() {
      return this.$store.state.unitStatus;
    },
    getFactorytype() {
      return this.$store.state.factoryType;
    }
  },
  watch: {
    getStoreFormData: function(val1, val2) {
      this.deleteBtnShow = true;
      this.getFormData(val1);
    },
    getUnitStatus: function(val1, val2) {
      if (val1 == "updata" || val1 == "update2") {
        this.updata = true;
        this.deleteBtnShow = true;
        this.btnText = '确定修改'
        //  this.disabledAuthPart = true
      } else {
        this.form = {};
        this.disabledAuthPart = false;
        this.unitTypeShow = true;
        this.deleteBtnShow = false;
        this.updata = false;
        this.btnText = '提交'
      }
    },
    getFactorytype: function(val1, val2) {
      if (val1 == 5) {
        this.isACceptShow = false;
      } else {
        this.isACceptShow = true;
      }
      if (val1==10) {
        this.isService = true;
      } else {
        this.isService = false;
      }
      this.form = {};
    }
  }
};
</script>

<style lang="less" >
#userManageWrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .el-form {
    width: 100%;
    height: 100%;
    padding: 20px 30px 40px 10px;
    box-sizing: border-box;
  }
  .w100 {
    width: 100%;
  }
  .w400px {
    width: 300px;
  }
  .tac {
    margin-top: 20px;
    text-align: center;
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
  .lookImg {
    // margin-left: 15px;
  }
}
</style>