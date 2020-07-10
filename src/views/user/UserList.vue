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
        <el-table-column prop="opration" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size='small' plain @click="updateUser(scope.row)">详情</el-button>
            <el-dialog title="用户详情" :visible.sync="dialoguserFormVisible">
              <el-form :model="userForm">
                <el-form-item label="用户账号" :label-width="formLabelWidth">
                  <el-input v-model="userForm.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" :label-width="formLabelWidth">
                  <el-input v-model="userForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属组织" :label-width="formLabelWidth">
                  <!-- <el-input v-model="userForm.partId" autocomplete="off"></el-input> -->
                  <el-cascader :options="options" :props="props" clearable v-model="userForm.partIds" class="w100" ref="ascader2"></el-cascader>
                </el-form-item>
                <el-form-item label="用户角色" :label-width="formLabelWidth">
                  <el-select v-model="userForm.administrator" placeholder="请选择用户角色" class="w100" @focus="changeLastUnit()">
                    <el-option label="单位管理员" value="1"></el-option>
                    <el-option label="部门管理员" value="5" v-show="RoleShow"></el-option>
                    <el-option label="验收人员" value="10" v-show="RoleShow"></el-option>
                  </el-select>
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
            <el-form-item label="用户账号" :label-width="formLabelWidth">
              <el-input v-model="userForm.account" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" :label-width="formLabelWidth">
              <el-input v-model="userForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属组织" :label-width="formLabelWidth">
              <el-cascader :options="options" :props="props" clearable v-model="userForm.partIds" class="w100" ref="ascader2"></el-cascader>
            </el-form-item>
            <el-form-item label="用户角色" :label-width="formLabelWidth">
              <el-select v-model="userForm.administrator" placeholder="请选择用户角色" class="w100" @focus="changeLastUnit()">
                <el-option label="单位管理员" value="1"></el-option>
                <el-option label="部门管理员" value="5" v-show="RoleShow"></el-option>
                <el-option label="验收人员" value="10" v-show="RoleShow"></el-option>
              </el-select>
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
import { getTime } from "@/utils/publictool";

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
        multiple: true,
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
      partId:''
    };
  },
  created() {
    this.getUserLsit(1);
    this.getLastFactoryMenus();
  },
  methods: {
    //用户列表
    getUserLsit(index) {
      pageUser({ size: this.userCurrentNum, start: index,partId:this.partId})
        .then(res => {
          if (res.httpStatus == 200) {
            this.userTotal = res.result.countRows;
            this.userList = res.result.result.map(item => {
              item.createTime = getTime(item.createTime);
              if (typeof item.administrator == "number") {
                item.administrator = item.administrator.toString();
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
                this.getLastFactoryMenus();
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
    },
    //提交修改
    onSubmit() {
      if (this.updata) {
        updateUserAndParts({
          account: this.userForm.account,
          password: this.userForm.password,
          phone: this.userForm.phone,
          userId: this.userForm.userId,
          username: this.userForm.username,
          partIds: this.userForm.partIds,
          administrator: this.userForm.administrator
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.getUserLsit(this.userCurrentPage);
              this.getLastFactoryMenus();
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
        addUser(this.userForm)
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.getUserLsit(this.userCurrentPage);
              this.getLastFactoryMenus();
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
      getFactoryMenus()
        .then(res => {
          if (res.httpStatus == 200) {
            this.options = res.result.map(item => {
              // this.factoryId = item.factoryId;
              // item.id = item.factoryId;
              // item.partsName = item.factoryName;
              // item.disabled = "disabled";

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
    }
  },
  computed: {
    getUnitStatus() {
      return this.$store.state.unitStatus;
    },
    getUnitInfo(){
      return this.$store.state.unitInfo;
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
        this.updata = false;
      }
    },
    getUnitInfo:function(val){
      this.partId = val.id
      this.getUserLsit(1)
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
    width: 100%;
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
}
</style>