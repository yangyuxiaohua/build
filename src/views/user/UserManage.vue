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
        <el-col :span="12" v-show="organizationTypeShow">
          <el-form-item label="机构类型">
            <el-select v-model="form.organizationType" placeholder="请选择活动区域" class="w400px" @change='changeOrganizationType()'>
              <el-option label="单位" value="5"></el-option>
              <el-option label="部门" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构名称">
            <el-input v-model="form.partsName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-show='unitTypeShow'>
        <el-col>
          <el-form-item label="单位类别">
            <el-select v-model="form.type" placeholder="请选择单位类别" class="w100">
              <el-option label="建设单位" value="1"></el-option>
              <el-option label="验收单位" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="机构地址">
            <el-input v-model="form.departmentPosition"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='12'>
          <el-form-item label="联系人1">
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
          <el-form-item label="联系人2">
            <el-input v-model="form.contactSecondaryUser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input v-model="form.contactSecondaryPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="tac">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="clickDelete()" v-show="deleteBtnShow">删除</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {
  getFactoryMenus,
  addPart,
  addFactory,
  deletedFactory,
  deletedPart,
  updateFactory,
  updatedPart
} from "@/apis/userUnit.js";
import { splitStr2 } from "@/utils/publictool";

export default {
  data() {
    return {
      organizationType: "", //组织机构类型
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
      organizationTypeShow: false, //选择单位
      factoryId: "",
      deleteBtnShow: false,
      updata: false, //判断新增还是修改
      confiStatus: 1,
      disabledAuthPart:false,// 禁用上级部门
    };
  },
  created() {
    // authPartsIds
    this.getLastFactoryMenus();
  },

  methods: {
    onSubmit() {
      if (!this.updata) {
        if (this.form.authPartsIds && this.form.authPartsIds != "") {
          addPart({
            authPartsIds: this.form.authPartsIds,
            contactMasterPhone: this.form.contactMasterPhone,
            contactMasterUser: this.form.contactMasterUser,
            contactSecondaryPhone: this.form.contactSecondaryPhone,
            contactSecondaryUser: this.form.contactSecondaryUser,
            departmentPosition: this.form.departmentPosition,
            factoryId: this.factoryId,
            partsName: this.form.partsName,
            type: this.form.organizationType
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
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err
              });
            });
        } else {
          addFactory({
            contactMasterPhone: this.form.contactMasterPhone,
            contactMasterUser: this.form.contactMasterUser,
            contactSecondaryPhone: this.form.contactSecondaryPhone,
            contactSecondaryUser: this.form.contactSecondaryUser,
            unitLocation: this.form.departmentPosition,
            // factoryId: this.$store.state.userInfor.factoryId,
            factoryName: this.form.partsName,
            type: this.form.type
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
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err
              });
            });
        }
      } else {
        if (
          this.$store.state.unitInfo.factoryId &&
          this.$store.state.unitInfo.factoryId != ""
        ) {
          updateFactory({
            authPartsIds: this.form.authPartsIds,
            contactMasterPhone: this.form.contactMasterPhone,
            contactMasterUser: this.form.contactMasterUser,
            contactSecondaryPhone: this.form.contactSecondaryPhone,
            contactSecondaryUser: this.form.contactSecondaryUser,
            unitLocation: this.form.departmentPosition,
            factoryId: this.$store.state.unitInfo.factoryId,
            factoryName: this.form.partsName,
            type: this.form.organizationType
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
        } else {
          updatedPart({
            contactMasterPhone: this.form.contactMasterPhone,
            contactMasterUser: this.form.contactMasterUser,
            contactSecondaryPhone: this.form.contactSecondaryPhone,
            contactSecondaryUser: this.form.contactSecondaryUser,
            departmentPosition: this.form.departmentPosition,
            partsName: this.form.partsName,
            type: this.form.type,
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
        }
      }
    },
    //选择机构类型
    changeOrganizationType() {},
    //获取上一级机构的数据
    getLastFactoryMenus() {
      getFactoryMenus()
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res)
            this.options = res.result.map(item => {
              // this.factoryId = item.factoryId;
              // item.id = item.factoryId;
              // item.authPartsIds = item.factoryId;
              // item.partsName = item.factoryName;
              return item;
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
    // 选中上一级机构
    chosedauthPartsIds() {
      if (this.form.authPartsIds) {
        if(this.form.authPartsIds.indexOf(',')==-1){
        this.factoryId = this.form.authPartsIds;
        }else{
          this.factoryId = splitStr2(this.form.authPartsIds)[0];
        }
        this.unitTypeShow = false;
        this.organizationTypeShow = true;
      } else {
        this.unitTypeShow = true;
        this.organizationTypeShow = false;
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
          if (this.$store.state.unitInfo.factoryId) {
            deletedFactory({
              factoryId: this.$store.state.unitInfo.factoryId
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
          } else {
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
          }
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
      this.form = {
        authPartsIds: val.authPartsIds,
        partsName: val.partsName,
        contactMasterUser: val.contactMasterUser,
        contactMasterPhone: val.contactMasterPhone,
        contactSecondaryUser: val.contactSecondaryUser,
        contactSecondaryPhone: val.contactSecondaryPhone,
        departmentPosition: val.unitLocation ? val.unitLocation  :val.departmentPosition ,
        type: val.type,
        organizationType: val.type
      };
      this.disabledAuthPart = true;
    },
    //修改,添加成功和删除成功修改操作的flag
    changeConfiStatus() {
      this.confiStatus = this.$store.state.confiflag == 1 ? 2 : 1;
      this.$store.commit("changeConfiFlag", this.confiStatus);
    }
  },
  computed: {
    getStoreFormData() {
      return this.$store.state.unitInfo;
    },
    getUnitStatus() {
      return this.$store.state.unitStatus;
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
        //  this.disabledAuthPart = true
        
      } else {
        this.form = {};
         this.disabledAuthPart = false
        this.unitTypeShow = true;
        this.deleteBtnShow = false;
        this.updata = false;
      }
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
}
</style>