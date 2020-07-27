<template>
  <div id="userListWrapper">
    <div class="userListTab">
      <el-table :data="userList" stripe>
        <!-- <el-table-column prop="username" label="姓名" width="250">
        </el-table-column> -->
        <el-table-column prop="account" label="用户名" width="200">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="200">
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="200">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="250">
        </el-table-column>
        <el-table-column prop="enable1" label="使用状态" width="100">
        </el-table-column>
        <el-table-column prop="opration" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size='small' plain @click="updateUser(scope.row)">详情</el-button>
            <el-dialog title="用户详情" :visible.sync="dialoguserFormVisible">
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
                <!-- <el-row>
                  <el-col :span='12'></el-col>
                  <el-col :span='12'></el-col>
                </el-row> -->
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
                      <!-- <el-input v-model="userForm.partId" autocomplete="off"></el-input> -->
                      <el-cascader :options="options" :props="props" clearable v-model="userForm.partIds" class="w100" ref="ascader2"></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>
                    <el-form-item label="用户角色" :label-width="formLabelWidth">
                      <el-select v-model="userForm.administrator" placeholder="请选择用户角色" class="w100" @focus="changeLastUnit()">
                        <el-option label="单位管理员" value="1"></el-option>
                        <el-option label="部门管理员" value="5" v-show="RoleShow"></el-option>
                        <el-option label="验收人员" value="10" v-show="RoleShow"></el-option>
                      </el-select>
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
                      <el-radio-group v-model="userForm.enable">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="-1">禁用</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row  v-show="isService">
                  <el-col :span='12'>
                    <el-form-item label="执业资格证" :label-width="formLabelWidth">
                      <!-- <el-input v-model="userForm.professionalCertificate" autocomplete="off"></el-input> -->

                      <el-select v-model="userForm.professionalCertificate" placeholder="执业资格证书" class="w100">
                        <el-option label="一级注册消防工程师" value="1"></el-option>
                        <el-option label="消防设施操作员（三级/高级技能）" value="5"></el-option>
                        <el-option label="消防设施操作员（四级/中级技能）" value="10"></el-option>
                        <el-option label="消防设施操作员（五级/初级技能）" value="15"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>

                    <el-form-item label="技术岗位" :label-width="formLabelWidth">
                      <!-- <el-input v-model="userForm.technicalPositions" autocomplete="off"></el-input> -->
                      <el-select v-model="userForm.technicalPositions" placeholder="技术岗位" class="w100">
                        <el-option label="技术责任人" value="5"></el-option>
                        <el-option label="项目负责人" value="1"></el-option>
                        <el-option label="检测人员" value="10"></el-option>
                      </el-select>
                    </el-form-item>

                  </el-col>
                </el-row>

                <el-row  v-show="isService">
                  <el-col :span='24'>
                    <!-- <el-input v-model="userForm.professionalImage2Url" autocomplete="off"></el-input> -->
                    <el-form-item label="资格证书" :label-width="formLabelWidth" class="flexFormItem">
                      <div v-for="(item,index) in imgList" :key="index" class="imgList wh80px"><img :src="item" alt="" class="wh80px">
                        <div class="imgMask">
                          <i class="el-icon-zoom-in" @click="lookImg(item)"></i>
                          <i class="el-icon-delete" @click="deleteImage(index)"></i>
                        </div>
                      </div>
                      <!-- <div class="uploadIcon wh80px">
                       <i class="el-icon-plus"></i>
                     </div> -->
                      <!-- <el-upload action="#" list-type="picture-card" :auto-upload="false">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                          <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                              <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                              <i class="el-icon-download"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                              <i class="el-icon-delete"></i>
                            </span>
                          </span>
                        </div>
                      </el-upload> -->
                      <el-upload class="avatar-uploader" :action="uploadIp" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" v-loading="loading">
                        <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar wh80px"> -->
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
                <el-button @click="dialoguserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit()">提交</el-button>
              </div>
            </el-dialog>

            <el-button type="danger" size='small' plain @click="deleteUser( scope.row)" class="deleteUnit">删除</el-button>

          </template>
        </el-table-column>
        <el-table-column>

        </el-table-column>
      </el-table>
      <div>
       <el-dialog title="用户详情" :visible.sync="dialoguserFormVisible">
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

                <el-row class="prompBox">
                  <el-col :span='12'>
                    <el-form-item label="所属组织" :label-width="formLabelWidth">
                      <!-- <el-input v-model="userForm.partId" autocomplete="off"></el-input> -->
                      <el-cascader :options="options" :props="props" clearable v-model="userForm.partIds" class="w100" ref="ascader2"></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>
                    <el-form-item label="用户角色" :label-width="formLabelWidth">
                      <el-select v-model="userForm.administrator" placeholder="请选择用户角色" class="w100" @focus="changeLastUnit()">
                        <el-option label="单位管理员" value="1"></el-option>
                        <el-option label="部门管理员" value="5" v-show="RoleShow"></el-option>
                        <el-option label="验收人员" value="10" v-show="RoleShow"></el-option>
                      </el-select>
                    </el-form-item>
                      <i class="el-icon-question promptIcon" @click="showPromptText1 = !showPromptText1"></i>
                  </el-col>
                   <span class="promptText" v-show="showPromptText1">列表中没有显示的，需告知对方注册新用户</span>
                </el-row>
                <el-row>
                  <el-col :span='12'>
                    <el-form-item label="身份证号" :label-width="formLabelWidth">
                      <el-input v-model="userForm.idcard" autocomplete="off"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>
                    <el-form-item label="使用状态" :label-width="formLabelWidth">
                      <el-radio-group v-model="userForm.enable">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="-1">禁用</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row  v-show="isService">
                  <el-col :span='12'>
                    <el-form-item label="执业资格证" :label-width="formLabelWidth">
                      <!-- <el-input v-model="userForm.professionalCertificate" autocomplete="off"></el-input> -->

                      <el-select v-model="userForm.professionalCertificate" placeholder="执业资格证书" class="w100">
                        <el-option label="一级注册消防工程师" value="1"></el-option>
                        <el-option label="消防设施操作员（三级/高级技能）" value="5"></el-option>
                        <el-option label="消防设施操作员（四级/中级技能）" value="10"></el-option>
                        <el-option label="消防设施操作员（五级/初级技能）" value="15"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span='12'>

                    <el-form-item label="技术岗位" :label-width="formLabelWidth">
                      <!-- <el-input v-model="userForm.technicalPositions" autocomplete="off"></el-input> -->
                      <el-select v-model="userForm.technicalPositions" placeholder="技术岗位" class="w100">
                        <el-option label="技术责任人" value="5"></el-option>
                        <el-option label="项目负责人" value="1"></el-option>
                        <el-option label="检测人员" value="10"></el-option>
                      </el-select>
                    </el-form-item>

                  </el-col>
                </el-row>

                <el-row  v-show="isService">
                  <el-col :span='24'>
                    <!-- <el-input v-model="userForm.professionalImage2Url" autocomplete="off"></el-input> -->
                    <el-form-item label="资格证书" :label-width="formLabelWidth" class="flexFormItem">
                      <div v-for="(item,index) in imgList" :key="index" class="imgList wh80px"><img :src="item" alt="" class="wh80px">
                        <div class="imgMask">
                          <i class="el-icon-zoom-in" @click="lookImg(item)"></i>
                          <i class="el-icon-delete" @click="deleteImage(index)"></i>
                        </div>
                      </div>
                      <!-- <div class="uploadIcon wh80px">
                       <i class="el-icon-plus"></i>
                     </div> -->
                      <!-- <el-upload action="#" list-type="picture-card" :auto-upload="false">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                          <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                              <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                              <i class="el-icon-download"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                              <i class="el-icon-delete"></i>
                            </span>
                          </span>
                        </div>
                      </el-upload> -->
                      <el-upload class="avatar-uploader" :action="uploadIp" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" v-loading="loading">
                        <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar wh80px"> -->
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
                <el-button @click="dialoguserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit()">提交</el-button>
              </div>
            </el-dialog>   

      </div>
    </div>
    <div class="userListpaging">
      <el-pagination background layout="prev, pager, next" :total="userTotal" :pager-count="pageCount" :page-size='userCurrentNum' :current-page.sync='userCurrentPage' @current-change='userCurrentChange'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  pageUser,
  deletedUser,
  updateUser,
  getFactoryMenus,
  addUser,
  updateUserAndParts,
  getFactoryByPartsId
} from "@/apis/userUnit.js";
import { getTime,changNull } from "@/utils/publictool";
import { uploadIp, ImgIp } from "@/apis/upload.js";

export default {
  data() {
    return {
      userList: [],
      formLabelWidth: "100px",
      userCurrentPage: 1, //当前页
      userCurrentNum: 10, //每页显示条数
      pageCount: 5, // 按钮数
      userTotal: 0, //总条数
      dialoguserFormVisible: false,
      userForm: {},
      options: [],
      props: {
        multiple: false,
        checkStrictly: true,
        children: "departments",
        label: "partsName",
        value: "id",
        emitPath: false,
        disabled: "disabled"
      },
      factoryId: "",
      updata: false,
      RoleShow: true,
      partId: "",
      //资格证书上传相关
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      imgList: [],
      loading: false,
      isService:false, //是否是服务机构
      showPromptText1:false
    };
  },
  created() {
    this.uploadIp = uploadIp;
    this.getUserLsit(1);
    this.getLastFactoryMenus();
    // console.log(this.$store.state.factoryType)
     if(this.$store.state.factoryType==10||this.$store.state.factoryType==1){
        this.isService = true
      }else{
        this.isService = false
        
      }
  },
  methods: {
    //用户列表
    getUserLsit(index) {
      pageUser({ size: this.userCurrentNum, start: index, partId: this.partId })
        .then(res => {
          if (res.httpStatus == 200) {
            this.userTotal = res.result.countRows;
            this.userList = res.result.result.map(item => {
              item.createTime = getTime(item.createTime);
              item.enable1 = item.enable == 1?'启用' :'禁用';
              if (typeof item.administrator == "number") {
                item.administrator = item.administrator.toString();
                item.partIds = item.partIds[0];
                // item.partIds = item.partIds[0];
              }
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
    // 切换页码
    userCurrentChange(val) {
      this.getUserLsit(val);
    },
    //删除用户
    deleteUser(ui) {
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          deletedUser({
            userId: ui.userId
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                if (this.userList.length == 1) {
                  this.getUserLsit(this.userCurrentPage - 1);
                } else {
                  this.getUserLsit(this.userCurrentPage);
                }
                // this.getLastFactoryMenus();
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
    //产看详情
    updateUser(ui) {
      this.updata = true;
      this.dialoguserFormVisible = true;
      this.userForm = ui;
      console.log(ui);
      this.imgList = ui.professionalImage2Url
        ? ui.professionalImage2Url.split(",")
        : [];
    },
    //提交修改
    onSubmit() {
      this.userForm.professionalImage2Url = this.imgList.join(',')
      if (this.updata) {
        updateUserAndParts({
          userId: this.userForm.userId,
          account: this.userForm.account,
          password: this.userForm.password,
          username: this.userForm.username,
          phone: this.userForm.phone,
          partIds: [this.userForm.partIds],
          administrator: this.userForm.administrator,
          idcard: this.userForm.idcard,
          enable: this.userForm.enable,
          professionalCertificate: this.userForm.professionalCertificate,
          technicalPositions: this.userForm.technicalPositions,
          professionalImage2Url: this.userForm.professionalImage2Url
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.getUserLsit(this.userCurrentPage);
              // this.getLastFactoryMenus();
            } else {
              this.$message({
                type: "info",
                message: "修改失败"
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
        addUser({
          account: this.userForm.account,
          password: this.userForm.password,
          username: this.userForm.username,
          phone: this.userForm.phone,
          partIds: [this.userForm.partIds],
          administrator: this.userForm.administrator,
          idcard: this.userForm.idcard,
          enable: this.userForm.enable,
          professionalCertificate: this.userForm.professionalCertificate,
          technicalPositions: this.userForm.technicalPositions,
          professionalImage2Url: this.userForm.professionalImage2Url
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.getUserLsit(this.userCurrentPage);
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
              message: err
            });
          });
      }
    },
    //获取所有部门
    getLastFactoryMenus() {
      getFactoryMenus(
        {
        factoryType:this.$store.state.userInfor.factoryType
        }
      )
        .then(res => {
          if (res.httpStatus == 200) {
            this.options = res.result.map(item => {
              // this.factoryId = item.factoryId;
              // item.id = item.factoryId;
              // item.partsName = item.factoryName;
              // item.disabled = "disabled";

              return item;
            });
            changNull(this.options)
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //根据上级部门类型变化角色数据
    changeLastUnit() {
      if (this.userForm.partIds) {
        getFactoryByPartsId({
          partId: this.userForm.partIds[0]
        })
          .then(res => {
            if (res.httpStatus == 200) {
              if (res.result.type == "5") {
                this.RoleShow = true;
              } else {
                this.RoleShow = false;
              }
            }
          })
          .catch(err => {
            this.message({
              type: "info",
              message: err
            });
          });
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
    //查看大图
    lookImg(src) {
      this.dialogVisible = true;
      this.dialogImageUrl = src;
    },
    //删除图片
    deleteImage(i) {
      this.imgList.splice(i, 1);
    }
    // handleDownload(file) {
    //   console.log(file);
    // }
  },
  computed: {
    getUnitStatus() {
      return this.$store.state.unitStatus;
    },
    getUnitInfo() {
      return this.$store.state.unitInfo;
    },
    getFactorytype() {
      return this.$store.state.factoryType;
    }
  },
  watch: {
    getUnitStatus: function(val1, val2) {
      if (val1 == "updata" || val1 == "update2") {
        this.updata = true;
        // this.deleteBtnShow = true;
      } else {
        this.userForm = {};
        this.dialoguserFormVisible = true;
        // this.unitTypeShow = true;
        // this.deleteBtnShow = false;
        this.imgList = [];
        this.updata = false;
      }
    },
    getUnitInfo: function(val) {
      this.partId = val.id;
      this.getUserLsit(1);
    },
    getFactorytype: function(val1, val2) {
      console.log(val1)
      if(val1==10||val1==1){
        this.isService = true
      }else{
        this.isService = false
      }
      // this.userList = []
      // this.userTotal = 0
    }
  }
};
</script>

<style lang="less">
#userListWrapper {
  width: 100%;
  height: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
  .userListTab {
    // width: 100%;
    box-sizing: border-box;
    .cell {
      .el-button {
        margin-left: 5px;
      }
    }
  }
  .userListpaging {
    width: 100%;
    margin-top: 40px;
    text-align: center;
  }
  .w100 {
    width: 100%;
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
  // .imgList {
  //   width: 80px;
  //   height: 80px;
  //   line-height: 80px;
  // }
  // .el-upload-list--picture-card,
  // .el-upload-list__item-actions {
  //   margin-left: 0;
  // }
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

    // .uploadIcon{
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   border: 1px dotted red;
    // }
  }
  .prompBox{
    position: relative;
    .promptIcon{
      position: absolute;
      right: 0;
      top: 0;
    }
    .promptText{
      position: absolute;
      bottom: 0;
      left: 100px;
    }
  }
}
</style>