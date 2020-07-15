<template>
  <div id="userWrapper">
    <div class="left">
      <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#333f50" text-color="#fff" active-text-color="#409EFF" unique-opened router>
        <el-submenu v-for="item in list" :index="item.text" :key="item.text">
          <template slot="title">
            <i :class="item.class"></i>
            <span>{{item.text}}</span>
          </template>
          <el-menu-item-group v-for="i in item.submenu" :key="i.name">
            <el-menu-item :index="i.path">{{i.name}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="middle">
      <div class="unitNav">
        <span v-for="item in unitNavList" :key="item.type" @click="choseUnitType(item)" :class="{chosedNav:item.type==factoryType}">{{item.name}}</span>
      </div>
      <div class="search">
        <el-row>
          <el-col :span="18">
            <el-input v-model="projectName" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" plain @click="addUnit()" class="addBtn">新增</el-button>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="treeWrapper">
        <p>{{factoryTypeName}}</p>
        <el-tree :data="treeData1" :props="defaultProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node='expandOnClickNode' accordion :default-expand-all='expandAll' :indent='treeIndex'>
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span class="nodeText">{{node.label }}</span>
          </span>
        </el-tree>
        <!-- <p class="btLine">建设单位</p>
         <el-tree :data="treeData2" :props="defaultProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node='expandOnClickNode' accordion :default-expand-all='expandAll' :indent='treeIndex'>
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span class="nodeText">{{node.label }}</span>
          </span>
        </el-tree>  -->
      </div>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
import { getFactoryMenus } from "@/apis/userUnit.js";
export default {
  data() {
    return {
      defaultActive: "/index/user/userManage",
      list: [
        {
          id: 2,
          class: "el-icon-goods",
          text: "单位用户",
          submenu: [
            { name: "组织结构", path: "/index/user/userManage" },
            { name: "用户管理 ", path: "/index/user/userList" }
          ]
        }
      ],
      projectName: "", //项目搜索
      treeData1: [],
      // treeData2: [],
      defaultProps: {
        children: "departments",
        label: "partsName"
      },
      expandOnClickNode: false,
      expandAll: true,
      treeIndex: 10, //tree相邻节点之间的缩进
      addFlag: 1,
      unitNavList: [
        { type: 5, name: "验收单位" },
        { type: 1, name: "建设单位" },
        { type: 10, name: "服务机构" }
      ],
      factoryType: '', //单位类型
      factoryTypeName: "验收单位",
      // roleAddBtn:false,
    };
  },
  created() {
    this.roleControl()
    this.defaultActive = this.$route.path;
    // console.log(this.$store.state.userInfor.factoryType)
    this.getUnit(this.unitNavList[0].type);
      this.factoryTypeName = this.unitNavList[0].name
      this.factoryType = this.unitNavList[0].type
    
    this.$store.commit("saveFactoryType", this.unitNavList[0].type); //默认储存单位类型
    console.log(this.$store.state);
  },
  methods: {
    //权限控制
    roleControl() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (roleCode == 400 || roleCode == 450) {
        this.unitNavList = [{ type: 5, name: "验收单位" }];
      } else if (roleCode == 800 || roleCode == 850) {
        this.unitNavList = [{ type: 10, name: "服务机构" }];
      } else if (roleCode == 600 || roleCode == 650) {
        this.unitNavList = [{ type: 1, name: "建设单位" }];
      } else if (roleCode == 300) {
        this.unitNavList = [
          { type: 5, name: "验收单位" },
          { type: 1, name: "建设单位" },
          { type: 10, name: "服务机构" }
        ];
      }
    },
    //单位类型切换
    choseUnitType(i) {
      this.factoryType = i.type;
      this.factoryTypeName = i.name;
      this.getUnit(i.type);
      this.$store.commit("saveFactoryType", i.type);
    },
    getUnit(type) {
      getFactoryMenus({
        factoryType: type,
        onlyFactory: false,
        queryUser: false
      })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
            this.treeData1 = res.result.map(item => {
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
    handleNodeClick(data, node) {
      this.$store.commit("saveUnitInfo", data);
      this.addFlag =
        this.$store.state.unitStatus == "updata" ? "update2" : "updata";
      this.$store.commit("changeUnitStatus", this.addFlag);
    },
    addUnit() {
      this.addFlag = this.$store.state.unitStatus == 1 ? 2 : 1;
      this.$store.commit("saveUnitInfo", {});
      this.$store.commit("changeUnitStatus", this.addFlag);
    }
  },
  watch: {
    getConfiFlag: function() {
      this.getUnit(this.$store.state.factoryType);
    }
  },
  computed: {
    // 监听单位部门操作
    getConfiFlag() {
      return this.$store.state.confiflag;
    }
  }
};
</script>

<style lang="less">
#userWrapper {
  // width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  .left {
    height: 100%;
    // width: 300px;
    flex: 0 0 250px;
    background-color: #333f50;
    .el-menu {
      width: 100%;
      border: none;
    }
  }
  .middle {
    flex: 0 0 400px;
    // border-right:1px solid rgb(170, 162, 162);
    box-sizing: border-box;
    box-shadow: 10px 0px 0px #f2f2f2;
    padding: 10px;
    // height: 840px;
    overflow-x: hidden;
    // .el-row {
    //   display: flex;
    //   justify-content: space-between;
    // }
    .search {
      margin-top: 10px;
    }
    .unitNav {
      width: 100%;
      height: 40px;
      line-height: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

      span {
        display: inline-block;
        width: 33%;
        text-align: center;
        color: #409eff;
      }
      span:hover {
        cursor: pointer;
      }
      .chosedNav {
        background-color: #409eff;
        color: #fff;
      }
    }
    .addBtn {
      margin-left: 20px;
    }
    .el-divider {
      margin: 10px 0;
    }
    .treeWrapper {
      height: 720px;
      overflow-y: auto;
      // overflow: hidden;
      padding: 0 0 0 10px;
      .el-tree {
        .custom-tree-node {
          position: relative;
          padding-right: 150px;
          // overflow: none;
        }
      }
    }
  }
  .right {
    flex: 1;
  }
  .btLine {
    border-top: 1px solid #ccc;
    margin-top: 20px;
    line-height: 40px;
  }
}
</style>