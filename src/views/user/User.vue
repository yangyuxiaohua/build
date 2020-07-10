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
      <div class="search">
        <el-row>
          <el-col :span="16">
            <el-input v-model="projectName" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" plain @click="addUnit()">增加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="treeWrapper">
        <p>验收单位</p>
        <el-tree :data="treeData1" :props="defaultProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node='expandOnClickNode' accordion :default-expand-all='expandAll' :indent='treeIndex'>
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span class="nodeText">{{node.label }}</span>
          </span>
        </el-tree>
        <p class="btLine">建设单位</p>
         <el-tree :data="treeData2" :props="defaultProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node='expandOnClickNode' accordion :default-expand-all='expandAll' :indent='treeIndex'>
          <span class="custom-tree-node" slot-scope="{node,data}">
            <span class="nodeText">{{node.label }}</span>
          </span>
        </el-tree> 
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
      treeData2: [],
      defaultProps: {
        children: "departments",
        label: "partsName"
      },
      expandOnClickNode: false,
      expandAll: true,
      treeIndex: 10, //tree相邻节点之间的缩进
      addFlag: 1
    };
  },
  created() {
    this.defaultActive = this.$route.path;
    this.getUnit();
  },
  methods: {
    getUnit() {
      getFactoryMenus( {
        factoryType:5,
        onlyFactory:false,
// projectId
         queryUser:false
      })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res)
            this.treeData1 = res.result.map(item => {
              // console.log(item)
              // item.id = item.factoryId;
              // item.partsName = item.factoryName;
              // item.departments.map(i => {
              //   this.treeData1.push(i);
              // });
              return item;
            });
            // this.getUnittreeData(res.result.rootFactorys)
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
      getFactoryMenus({
        factoryType:1,
        onlyFactory:false,
// projectId
         queryUser:false
      })
        .then(res => {
          console.log(res )
          if (res.httpStatus == 200) {
            // this.treeData2 = res.result.rootFactorys.map(item => {
            //   item.id = item.factoryId;
            //   item.partsName = item.factoryName;
            //   // item.departments.map(i => {
            //   //   this.treeData1.push(i);
            //   // });
            //   return item;
            // });
            this.treeData2 = res.result.map(item => {
              // console.log(item)
              // item.id = item.factoryId;
              // item.partsName = item.factoryName;
              // item.departments.map(i => {
              //   this.treeData1.push(i);
              // });
              return item;
            });
            // this.getUnittreeData(res.result.rootFactorys)
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
      this.$store.commit("changeUnitStatus", this.addFlag);
    }
  },
  watch: {
    getConfiFlag: function() {
      this.getUnit();
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
  width: 100%;
  height: 100%;
  display: flex;
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
    box-shadow: 10px 0px 0px #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
    height: 840px;
    overflow-y: auto;
    .el-row {
      display: flex;
      justify-content: space-between;
    }
    .el-divider {
      margin: 10px 0;
    }
    .treeWrapper {
      height: 750px;
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