<template>
  <div id="basicInforWrapper">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-row>
        <el-col :span="9">
          <el-form-item label="工程名称" class="projectName">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工程地址" class="projectAddress">
            <el-select v-model="form.provinceRegion" :placeholder="pPh" @change="chosedProvice()" disabled>
              <el-option v-for="(item,index) in provinceOptions" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="form.cityRegion" :placeholder="cPh" @change="chosedcity()" disabled='disabled'>
              <el-option v-for="(item,index) in cityOptions" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="form.countyRegion" :placeholder="coPh" :disabled='countyDisabled' @change="chosedCounty()">
              <el-option v-for="(item,index) in countyOptions" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="详细地址" class="peojectName">
            <el-input v-model="form.detailedAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <span class="coordinate">
            <i class="el-icon-map-location" @click="openMask()"></i>
          </span>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <el-row class="construction">
        <el-col :span="6">
          <el-form-item label="建设单位">
            <el-select v-model="form.constructionUnitValue">
              <el-option v-for="j in constructionUnitOptions" :key="j.factoryId" :label="j.factoryName" :value="j.factoryId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="验收单位">
            <el-cascader :options="AcceptanceFactorysOptions" :props="props" clearable v-model="form.acceptancePartId" @change="change1()"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人" label-width="100px">
            <el-input v-model="form.person"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider></el-divider>
      <el-row class="construction">
        <el-col :span="12">
          <el-form-item label="验收凭证文号" label-width="100px">
            <el-input v-model="form.ProofDocument"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总建筑面积" label-width="100px">
            <el-input v-model="form.coveredArea">
              <template slot="append">m²</template>

            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请日期">
            <el-date-picker v-model="form.dataValue" type="date" placeholder="选择日期" value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row class="construction">
        <el-col :span="12">
          <el-form-item label="工程类别：" label-width="100px" class="Engineering">
            <el-radio-group v-model="form.Engineering">
              <el-radio :label="item.dictionaryId" v-for="item in EngineeringList" :key="item.dictionaryId">{{item.name}}</el-radio>
              <!-- <el-radio label="扩建"></el-radio>
                            <el-radio label="改建"></el-radio>
                        </el-radio-group>
                        （
                        <el-radio-group v-model="form.resource">
                            <el-radio label="装修"></el-radio>
                            <el-radio label="建筑保温"></el-radio>
                            <el-radio label="用途变更"></el-radio> -->
            </el-radio-group>
            <!-- ） -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="火宅危险性：" label-width="100px">
            <el-radio-group v-model="form.fire">
              <!-- <el-radio label="甲类"></el-radio>
                            <el-radio label="乙类"></el-radio>
                            <el-radio label="丙类"></el-radio>
                            <el-radio label="丁类"></el-radio>
                            <el-radio label="戊类"></el-radio> -->
              <el-radio :label="item.dictionaryId" v-for="item in fireList" :key="item.dictionaryId">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>
      <el-divider></el-divider>
      <div class="userd mT15">
        <el-form-item label="使用性质：" class="construction" label-width="82px">
          <span>总建筑物面积大于二万平方米的 ：</span>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_2w" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item>
          <span>总建筑物面积大于一万五千平方米的 ：</span>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_15w" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <span>总建筑物面积大于一万平方米的 ：</span>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_1w" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <span>总建筑物面积大于二千五百平方米的 ：</span>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Water" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <span>总建筑物面积大于一千平方米的 ：</span>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_01" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <span>总建筑物面积大于五百平方米的 ：</span>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_05" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Standard" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Car" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <span>生产、储存、装卸易燃易爆危险物品的 ：</span>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Produce" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Gas" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_project" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Public" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-divider></el-divider>

      <el-form-item class="btn construction">
        <div class="btnWrapper">
          <el-button type="primary" @click="onSubmit()">提交</el-button>
          <el-button>取消</el-button>
        </div>

      </el-form-item>
    </el-form>
    <div class="mask" v-if="maskShow">
      <div class="maskContainer">
        <div class="map">
          <MapCoordinateWrapper></MapCoordinateWrapper>
        </div>
        <div class="mapBtn">
          <el-button type="primary" @click="sureMap()">确定</el-button>
          <el-button @click="hideMask">返回</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import MapCoordinateWrapper from "@/components/MapCoordinate";
import {
  getRegions,
  getEngineering,
  getFire,
  getUsed,
  addProject2,
  addUsages,
  getProjectInfor,
  pageFactory,
  updateProject,
  getConstructionFactorys,
  // getAcceptanceFactorys
} from "@/apis/project.js";
import { getFactoryMenus } from "@/apis/userUnit.js";

export default {
  components: {
    MapCoordinateWrapper
  },
  data() {
    return {
      form: {
        name: "",
        projectAddress: "",
        constructionUnit: "",
        person: "",
        phone: "",
        ProofDocument: "",
        coveredArea: "",
        dataValue: "",
        provinceRegion: "云南省",
        cityRegion: "昆明市",
        countyRegion: "",
        detailedAddress: "",
        acceptanceFactoryId: ""
      },
      provinceOptions: [], // 省
      cityOptions: [], //市
      cityDisabled: false,
      countyOptions: [], // 县
      countyDisabled: false,
      EngineeringList: [], // 工程类别
      fireList: [], // 火灾危险性
      getUsedList: {}, // 使用性质
      maskShow: false, // 地图蒙版
      // submitFlag: true,
      pPh: "省",
      cPh: "市",
      coPh: "县",
      modifyShow: false,
      constructionUnitOptions: [], //建设单位
      AcceptanceFactorysOptions: [], //验收单位
      props: {
        // multiple: true,
        checkStrictly: true,
        children: "departments",
        label: "partsName",
        value: "id",
        emitPath: false
      },
      lat: "",
      lon: ""
    };
  },
  mounted() {
    this.getRegionsData();
    this.getEngineeringInfor();
    this.getFireInfor();
    this.getUsedInfor();
    this.getAcceptanceFactorysOptions();
    this.getConstructionFactoryOptions();
    this.getProjectInformation();
    this.chosedcity()
  },
  methods: {
    onSubmit() {
      if (!this.$store.state.projectInfor.projectId) {
        addProject2({
          certificateNumber: this.form.ProofDocument,
          constructionArea: this.form.coveredArea,
          contactPhone: this.form.phone,
          contactUser: this.form.person,
          dangerousLevelId: this.form.fire,
          regionId: this.form.countyRegion,
          typeId: this.form.Engineering,
          usageId: this.form.userd,
          time: this.form.dataValue,
          constructionFactoryId: this.form.constructionUnitValue,
          projectName: this.form.name,
          lat: this.form.lat,
          lon: this.form.lon,
          detailedAddress: this.form.detailedAddress,
          acceptancePartId: this.form.acceptancePartId
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "提交成功"
              });
              // console.log(res)
              this.$store.commit("saveContentId", res.result.contentId);
              this.$store.commit("chosedProjectId", {
                projectId:res.result.result.projectId,
                acContentId:res.result.result.contentId
              });
              let bool =
                this.$store.state.addProjectSuccessed == "1" ? "2" : "1";
              this.$store.commit("addProjectSuccess", bool);
            } else {
              this.$message({
                type: "warning",
                message: "提交失败"
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
        updateProject({
          projectId: this.$store.state.projectInfor.projectId,
          certificateNumber: this.form.ProofDocument,
          constructionArea: this.form.coveredArea,
          contactPhone: this.form.phone,
          contactUser: this.form.person,
          dangerousLevelId: this.form.fire,
          regionId: this.form.countyRegion,
          typeId: this.form.Engineering,
          usageId: this.form.userd,
          time: this.form.dataValue,
          constructionFactoryId: this.form.constructionUnitValue,
          lat: this.form.lat,
          lon: this.form.lon,
          detailedAddress: this.form.detailedAddress,
          acceptancePartId: this.form.acceptancePartId
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              let bool =
                this.$store.state.addProjectSuccessed == "1" ? "2" : "1";
              this.$store.commit("addProjectSuccess", bool);
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
      }
    },
    // 获取三级联动数据
    getRegionsData() {
      getRegions({ level: 1 })
        .then(res => {
          if (res.httpStatus == 200) {
            this.provinceOptions = res.result;
            // this.provinceRegion= "530000000000"
            // this.cityRegion="530100000000"
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    // 选中省份且获取市级信息
    chosedProvice() {
      // console.log(this.form.provinceRegion)
      if (this.form.provinceRegion) {
        this.cityDisabled = false;
        getRegions({
          level: 2,
          pid: this.form.provinceRegion
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.cityOptions = res.result;
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
    //选中市且获取县级信息
    chosedcity() {
      // console.log( this.form.cityRegion)
      this.countyDisabled = false;
      getRegions({
        level: 3,
        // pid: this.form.cityRegion
        pid:'530100000000'
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.countyOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //选中县级获取坐标
    chosedCounty() {
      getRegions({
        id: this.form.countyRegion
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$store.commit("savePoint", {
              lat: res.result[0].lat,
              lng: res.result[0].lon
            });
            this.form.lat = res.result[0].lat;
            this.form.lon = res.result[0].lon;
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err
          });
        });
    },
    //通过县级获得市，省信息(数据回填)
    getCity(countyId = "") {
      getRegions({
        level: 3,
        id: countyId
      })
        .then(res => {
          this.coPh = res.result[0].name;
          getRegions({
            level: 2,
            id: res.result[0].pid
          })
            .then(res => {
              this.cPh = res.result[0].name;

              getRegions({
                level: 1,
                id: res.result[0].pid
              })
                .then(res => {
                  this.pPh = res.result[0].name;
                })
                .catch(err => {
                  this.$message({
                    type: "warning",
                    message: err
                  });
                });
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err
              });
            });
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //请求工程类别选项
    getEngineeringInfor() {
      getEngineering()
        .then(res => {
          if (res.httpStatus == 200) {
            this.EngineeringList = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //请求火灾危险性选项
    getFireInfor() {
      getFire()
        .then(res => {
          if (res.httpStatus == 200) {
            this.fireList = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //请求使用性质选项
    getUsedInfor() {
      getUsed()
        .then(res => {
          console.log(res)
          if (res.httpStatus == 200) {
            this.getUsedList = res.result.reduce((res1, item) => {
              res1[item.code]
                ? res1[item.code].push(item)
                : (res1[item.code] = [item]);
              return res1;
            }, {});
          }
          console.log(this.getUsedList)
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //获取项目基本信息
    getProjectInformation() {
      getProjectInfor({
        projectId: this.$store.state.projectInfor.projectId
      })
        .then(res => {
          if (res.httpStatus == 200) {
            //h获取三级联动
            if (res.result.project.regionId) {
              this.getCity(res.result.project.regionId);
            } else {
              this.cPh = "市";
              this.pPh = "省";
              this.coPh = "区/县";
            }
            if( res.result.project.lat&& res.result.project.lat!=''){
              this.$store.commit('savePoint',{
                lat:res.result.project.lat,
                lng: res.result.project.lon
              })
            }
            this.form = {
              person: res.result.projectInfo.contactUser,
              phone: res.result.projectInfo.contactPhone,
              ProofDocument: res.result.projectInfo.certificateNumber,
              coveredArea: res.result.projectInfo.constructionArea,
              dataValue: res.result.projectInfo.time,
              Engineering: res.result.project.typeId,
              fire: res.result.project.dangerousLevelId,
              userd: res.result.projectInfoUsages[0].dictionaryId,
              constructionUnitValue: res.result.project.constructionFactoryId,
              name: res.result.project.projectName,
              lat: res.result.project.lat,
              lon: res.result.project.lon,
              detailedAddress: res.result.project.detailedAddress,
              acceptancePartId: res.result.project.authAcceptanceIds[0]
            };
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
              type: "warning",
              message: err
            });
        });
    },
    // 查询建设单位
    getConstructionFactoryOptions() {
      getConstructionFactorys()
        .then(res => {
      console.log(res)
          this.constructionUnitOptions = res.result.map(item => {
            return {
              factoryId: item.factoryId,
              factoryName: item.factoryName
            };
          });
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    //查询验收单位
    getAcceptanceFactorysOptions() {
      getFactoryMenus(
        {
           factoryType:5,
        onlyFactory:true,
         queryUser:false
        }
      )
        .then(res => {
          if (res.httpStatus == 200) {
            this.AcceptanceFactorysOptions = res.result.map(
              item => {
                // item.id = item.factoryId;
                // item.partsName = item.factoryName;
                return item;
              }
            );
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //打开地图
    openMask() {
      this.maskShow = true;
      this.$store.commit("savePoint", {
        lat: this.form.lat,
        lng: this.form.lon
      });
    },
    //地图返回
    hideMask() {
      this.maskShow = false;
    },
    //地图确定
    sureMap() {
      this.form.lat = this.$store.state.point.lat;
      this.form.lon = this.$store.state.point.lng;
      if (this.form.lat && this.form.lat != "") {
        this.$message({
          type: "success",
          message: "保存点位成功"
        });
      }
    },
    change1() {
    }
  },
  watch: {
    projectInfo: function changeProjectInfor(val1, val2) {
      // if(val1.length)
      if (val1.projectId) {
        this.getProjectInformation();
        // this.submitFlag = false;
      } else {
        this.form = {};
        // this.submitFlag = true;
      }
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.projectInfor;
    }
  }
};
</script>

<style lang="less">
#basicInforWrapper {
  width: 100%;
  height: 100%;
  color: #606266;
  padding-bottom: 30px; 
  background-color: #fff;
  position: relative;
  .el-divider {
    margin: 0;
  }
  .el-form {
    .projectName {
      width: 400px;
    }
    .projectAddress {
      // display: flex;
      // justify-content: space-around;
      .el-select {
        width: 100px;
        margin-left: 10px;
      }
      .el-select:first-child {
        margin-left: 0;
      }
    }
    .construction {
      margin-top: 15px;
      //   .Engineering{
      //       text-align: left;
      //   }
    }
    .btn {
      position: relative;
      .btnWrapper {
        width: 100%;
        height: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
        // z-index: 20;
      }
    }
    .coordinate {
      font-size: 22px;
      margin-left: 10px;
      cursor: pointer;
    }
    .el-form-item__label {
      // text-align: left;
    }
    .userd {
      line-height: 20px;
      .el-form-item {
        margin: 0;
        border-bottom :1px solid #f4f4f4;
        .el-form-item__label {
          line-height: 38px;
        }
        .el-form-item__content {
          }
        .el-radio__label{
          line-height: 40px;
          
        }
      }
    }
    .el-input-group__append {
      padding: 0 5px;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    .maskContainer {
      width: 800px;
      height: 600px;
      display: flex;
      flex-direction: column;
      background-color: #f2f2f2;
      border: 1px solid #000;
    }
    .map {
      flex: 1;
      border-bottom: 2px solid #f4f4f4;
    }
    .mapBtn {
      flex: 0 0 60px;
      text-align: center;
      line-height: 60px;
    }
  }
  .mT15{
      margin-top: 15px;
  }
}
</style>