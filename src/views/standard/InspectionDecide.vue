<template>
    <div id="inspectionDecideWrapper">
        <div class="tableHeader">
            <div class="branch pl20">
                分部/分项工程
            </div>
            <div class="Anum">A类缺陷数</div>
            <!-- <div class="parts">检查部位</div>
      <div class="num">检查数量</div> -->
            <div class="Bnum">B类缺陷数</div>
            <div class="Cnum">C类缺陷数</div>
            <!-- <div class="importance">重要程度</div> -->
            <div class="decisionRules">合格判定规则</div>
            <div class="handle">操作</div>
        </div>
        <div class="container pl20">
            <div class="list" v-for="(item,index) in list" :key="index">
                <div class="listTitWrapper  c409">
                    <div class="branch">
                        <span>{{item.titleName}}</span>
                    </div>
                    <div class="Anum lh40">
                        <span>{{item.countA}}项</span>
                    </div>
                    <div class="Bnum lh40 ">
                        <span>{{item.countB}}项</span>
                    </div>
                    <div class="Cnum lh40">
                        <span>{{item.countC}}项</span>
                    </div>
                    <div class="decisionRules lh40">
                        <span class="W150px">A =
                            <el-input v-model="item.projectEvalRules.a" size="mini" :readonly="item.readOnly"></el-input>
                        </span>
                        <span class="W150px">B ≤
                            <el-input v-model="item.projectEvalRules.b" size="mini" :readonly="item.readOnly"></el-input>
                        </span>
                        <span class="W150px">B + C ≤
                            <el-input v-model="item.projectEvalRules.c" size="mini" :readonly="item.readOnly"></el-input>
                        </span>
                    </div>
                    <div class="handle lh40">
                        <span @click="handleModify(item)">修改</span>
                        <span @click="saveRules(item)">保存</span>
                    </div>
                </div>

                <div class="listContainer" v-for="(i,ind) in item.secondaryTitles" :key='ind'>
                    <div class="branch lh40 ">
                        <span>{{i.titleName}}</span>
                    </div>
                    <div class="Anum lh40">
                        <span>{{i.countA}}项</span>
                    </div>
                    <div class="Bnum lh40 ">
                        <span>{{i.countB}}项</span>
                    </div>
                    <div class="Cnum lh40">
                        <span>{{i.countC}}项</span>

                    </div>
                    <div class="decisionRules lh40">
                        <!-- <div></div> -->
                        <span class="W150px">A =
                            <el-input v-model="i.projectEvalRules.a" size="mini" :readonly="i.readOnly"></el-input>
                        </span>
                        <span class="W150px">B ≤
                            <el-input v-model="i.projectEvalRules.b" size="mini" :readonly="i.readOnly"></el-input>
                        </span>
                        <span class="W150px">C ≤
                            <el-input v-model="i.projectEvalRules.c" size="mini" :readonly="i.readOnly"></el-input>
                        </span>
                    </div>
                    <div class="handle lh40">
                        <span @click="handleModify(i)">修改</span>
                        <span @click="saveRules(i)">保存</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="paging">
            <el-pagination background layout="prev, pager, next" :total="unitTotal" :pager-count="pageCount" :page-size='unitCurrentNum' :current-page.sync='unitCurrentPage' @current-change='unitCurrentChange'>
            </el-pagination>
        </div>
        <div class="searchPrimary">
            <el-cascader :options="primaryTitleIdOptopns" :props="props" clearable placeholder='分部/分项' @focus='getPrimaryTitleIdOptopns()' ref="ascaderPrimaryTitleId" v-model="primaryTitleIdValue"></el-cascader>
            <el-button type="primary" size="small">查询</el-button>
        </div>

    </div>
</template>

<script>
import { getStandardRules, replaceStandardRules } from "@/apis/standard.js";
export default {
  data() {
    return {
      list: [],
      unitCurrentPage: 1, //当前页
      unitCurrentNum: 3, //每页显示条数
      pageCount: 5, // 按钮数
      unitTotal: 0, //总条数
      //   input: "",
      primaryTitleIdOptopns: [],
      props: {
        //级联选择器配置
        children: "secondaryCategory",
        label: "name",
        value: "secondaryId",
        checkStrictly: true
      },
      primaryTitleIdValue: "",
      form: {} //点击修改是=时的对象
    };
  },
  created() {
    this.unitCurrentChange(this.unitCurrentPage);
  },
  methods: {
    //修改
    handleModify(i) {
      console.log(i);
      i.readOnly = false;
    },
    //保存
    saveRules(i) {
      // console.log(i)
      replaceStandardRules({
        a: i.projectEvalRules.a,
        b: i.projectEvalRules.b,
        c: i.projectEvalRules.c,
        categoryCode: this.$store.state.standardId.categoryCode,
        code: "v1",
        level: i.level,
        titleId: i.id
      })
        .then(res => {
          if (res.httpStatus == 200) {
            // console.log(res);
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.unitCurrentChange(this.unitCurrentPage);
          }else{
               this.$message({
            type: "info",
            message: res.msg
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
    //分页
    unitCurrentChange(val) {
      //   console.log(getStandardRules);
      getStandardRules({
        categoryCode: this.$store.state.standardId.categoryCode,
        code: "v1",
        size: this.unitCurrentNum,
        start: val
      })
        .then(res => {
          //   console.log(res);
          if (res.httpStatus == 200) {
            this.unitTotal = res.result.countRows;
            this.list = res.result.result.primaryTitles.map(item => {
              //   console.log(typeof item.projectEvalRules);
              item.level = 1;
              item.readOnly = true;
              item.id = item.standardPrimaryTitleId;
              item.projectEvalRules = item.projectEvalRules
                ? item.projectEvalRules
                : {};
              item.secondaryTitles = item.secondaryTitles.map(i => {
                i.level = 2;
                i.readOnly = true;
                i.id = i.standardSecondaryTitleId;
                i.projectEvalRules = i.projectEvalRules
                  ? i.projectEvalRules
                  : {};

                return i;
              });
              return item;
            });
          }
        })
        .catch(err => {
          //   console.log(err)
          this.$message({
            type: "info",
            message: err
          });
        });
    },
    // 获取级联数据
    getPrimaryTitleIdOptopns() {}
  },
  computed: {
    getcategoryCode() {
      return this.$store.state.standardId;
    }
  },
  watch: {
    getcategoryCode: function(val1) {
      this.unitCurrentChange(1);
    }
  }
};
</script>

<style lang="less">
#inspectionDecideWrapper {
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  box-sizing: border-box;
  position: relative;
  .tableHeader {
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #014a77;
    color: #fff;
    display: flex;
    justify-content: space-around;
    // text-align: center;
    .decisionRules {
      text-align: center;
    }
  }
  .container {
    //   width: 150px;
    .list {
      width: 100%;
      // height: 40px;
      .listTitWrapper {
        display: flex;
        border-bottom: 1px solid #aca4a4;
        height: 40px;
        line-height: 40px;
      }

      .listContainer {
        height: 40px;
        line-height: 20px;
        // text-align: center;
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #aca4a4;
        & > div {
          //   display: flex;
          //   justify-content: center;
          // align-items: center;
          //   text-align: center;
          //=====================================超出显示省略号
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .decisionRules {
          // width: 100px;
          flex: 0 0 500px;
          // text-align: center;
          display: flex;
          justify-content: center;
        }
      }
    }
    .lh40 {
      line-height: 40px;
    }
  }
  .paging {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 40px;
    left: 0;
  }
  .branch {
    min-width: 300px;
    flex: 1;
    text-indent: 20px;
  }
  .Anum {
    flex: 0 0 150px;
    text-align: center;
  }
  .Bnum {
    flex: 0 0 150px;
    text-align: center;
    // min-width: 100px;
  }
  .Cnum {
    flex: 0 0 150px;
    text-align: center;
  }
  .decisionRules {
    // width: 100px;
    flex: 0 0 500px;
    // text-align: center;
    display: flex;
    justify-content: center;
    span {
      display: inline-block;
      margin-left: 10px;
      text-align: end;
      .el-input {
        width: 70px;
      }
    }
    // flex: 1;
  }
  .handle {
    // width: 100px;
    flex: 0 0 150px;
    text-align: center;
    // display: flex;
    // justify-content: space-around;
    // align-items: center;
    span {
      color: #014a77;
      margin: 5px;
    }
    span:hover {
      cursor: pointer;
    }
    .pl20 {
      padding-left: 20px;
    }
  }
  .searchPrimary {
    position: absolute;
    left: 850px;
    top: -50px;
    .el-button {
      margin-left: 20px;
    }
  }
  .c409 {
    color: #409eff;
  }
  .W150px {
    width: 150px;
  }
}
</style>