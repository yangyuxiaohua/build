<template>
  <div id="acceptanceContentWrapper">
    <div class="top">

      <div class="individualBuild">
        <div class="individualBuildTit">
          <!-- <el-button type="primary" plain size=""  @click="addIndividualBuildInfor('individualBuildList')">新增+</el-button> -->
          <span class="arrowIcons" @click="changeArrow('individualBuildList')">
            <i :class="arrowIconClass1"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
          </span>
          <span class="individualText">单体建筑 <br>
            <el-button type="primary" plain @click="addIndividualBuildInfor('individualBuildList')" v-show="individualBuildShow">新增+</el-button>
          </span>
          <span class="individualName">建筑名称</span>
          <span class="individuaUsed">使用性质</span>
          <span class="individuaType">结构类型</span>
          <span class="individualRefractory">耐火等级</span>
          <span class="individualOnFloorNum">地上层数</span>
          <span class="individualUnderFloorNum">地下层数</span>
          <span class="individualHeight">建筑高度</span>
          <span class="individualLength">建筑长度</span>
          <span class="individualArea">占地面积</span>
          <span class="individualOnArea">地上建筑面积</span>
          <span class="individualUnderArea">地下建筑面积</span>
          <span class="handle">操作</span>
        </div>
        <div class="individualBuildContainer" v-show="individualBuildShow">
          <div class="individualBuildList" v-for="(item,index) in individualBuildList" :key="index">
            <span class="individualText">

            </span>
            <span class="individualName">
              <el-input v-model="item.individualName" :title="item.individualName"></el-input>
            </span>
            <span class="individuaUsed">
              <el-input v-model="item.usages" size=''></el-input>
            </span>
            <span class="individuaType">
              <el-select v-model="item.individuaType">
                <el-option v-for="i in individuaTypeOptions" :key="i.dictionaryId" :label="i.name" :value="i.dictionaryId">
                </el-option>
              </el-select>
            </span>
            <span class="individualRefractory">
              <el-select v-model="item.individualRefractory">
                <el-option v-for="j in individualRefractoryOptions" :key="j.dictionaryId" :label="j.name" :value="j.dictionaryId">
                </el-option>
              </el-select>
            </span>
            <span class="individualOnFloorNum">
              <el-input v-model="item.individualOnFloorNum" size=''>
                <template slot="append">层</template>

              </el-input>
            </span>
            <span class="individualUnderFloorNum">
              <el-input v-model="item.individualUnderFloorNum" size=''>
                <template slot="append">层</template>

              </el-input>
            </span>
            <span class="individualHeight">
              <el-input v-model="item.individualHeight" size=''>
                <template slot="append">m</template>

              </el-input>
            </span>
            <span class="individualLength">
              <el-input v-model="item.individualLength" size=''>
                <template slot="append">m</template>

              </el-input>
            </span>
            <span class="individualArea">
              <el-input v-model="item.individualArea" size=''>
                <template slot="append">m²</template>

              </el-input>
            </span>
            <span class="individualOnArea">
              <el-input v-model="item.individualOnArea" size=''>
                <template slot="append">m²</template>

              </el-input>
            </span>
            <span class="individualUnderArea">
              <el-input v-model="item.individualUnderArea" size=''>
                <template slot="append">m²</template>
              </el-input>
            </span>
            <span class="handle">
              <el-button type="primary" size="mini" @click="save('individualBuildList',item)">保存</el-button>
              <!-- <el-button type="danger" size="mini">修改</el-button> -->
              <el-button type="danger" size="mini" @click="deleteI('individualBuildList',item.acContentBuildId)">删除</el-button>
            </span>
          </div>
        </div>
      </div>
      <div class="individualBuild tank">
        <div class="individualBuildTit">
          <span class="arrowIcons" @click="changeArrow('tankList')">
            <i :class="arrowIconClass2"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
          </span>
          <span class="individualText">储罐<br>
            <el-button type="primary" plain size="" @click="addIndividualBuildInfor('tankList')" v-show="tankShow">新增+</el-button>
          </span>
          <span class="individualName">设备位置</span>
          <span class="individuaType">总容量</span>
          <span class="individualRefractory">设置形式</span>
          <span class="individualOnFloorNum w100px">储存形式</span>
          <span class="individualUnderFloorNum w100px">储存物质名称</span>
          <span class="handle">操作</span>

        </div>
        <div class="individualBuildContainer" v-show="tankShow">
          <div class="individualBuildList" v-for="(item,index) in tankList" :key="index">
            <span class="individualText">

            </span>
            <span class="individualName">
              <el-input v-model="item.individualName" size=''></el-input>
            </span>
            <span class="individuaType">
              <el-input v-model="item.individuaType" size=''>
                <template slot="append">m³</template>

              </el-input>
            </span>
            <span class="individualRefractory">
              <el-select v-model="item.individualRefractory">
                <el-option v-for="j in setTypesOptions" :key="j.dictionaryId" :label="j.name" :value="j.dictionaryId">
                </el-option>
              </el-select>
            </span>
            <span class="individualOnFloorNum w100px">

              <el-select v-model="item.individualOnFloorNum">
                <el-option v-for="i in saveTypesOptions" :key="i.dictionaryId" :label="i.name" :value="i.dictionaryId">
                </el-option>
              </el-select>
            </span>
            <span class="individualUnderFloorNum w100px">
              <el-input v-model="item.individualUnderFloorNum" size=''></el-input>
            </span>
            <span class="handle">
              <el-button type="primary" size="mini" @click="save('tankList',item)">保存</el-button>
              <el-button type="danger" size="mini" @click="deleteI('tankList',item.acContentStorageTankId)">删除</el-button>
            </span>
          </div>
        </div>
      </div>
      <div class="individualBuild yard">
        <div class="individualBuildTit ">
          <span class="arrowIcons" @click="changeArrow('yardList')">
            <i :class="arrowIconClass3"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
          </span>
          <span class="individualText">堆场<br>
            <el-button type="primary" plain size="" @click="addIndividualBuildInfor('yardList')" v-show="yardShow">新增+</el-button>
          </span>
          <span class="individualName">储存物质名称</span>
          <span class="individuaType">储量</span>
          <span class="handle">操作</span>

        </div>
        <div class="individualBuildContainer" v-show="yardShow">
          <div class="individualBuildList" v-for="(item,index) in yardList" :key="index">
            <span class="individualText">

            </span>
            <span class="individualName">
              <el-input v-model="item.individualName" size=''></el-input>
            </span>
            <span class="individuaType">

              <el-input v-model="item.individuaType" size=''>
                <template slot="append">m³</template>

              </el-input>
            </span>
            <span class="handle">
              <el-button type="primary" size="mini" @click="save('yardList',item)">保存</el-button>
              <el-button type="danger" size="mini" @click="deleteI('yardList',item.acceptanceContentYardId)">删除</el-button>
            </span>
          </div>
        </div>
      </div>
      <div class="individualBuild keepWarm">
        <div class="individualBuildTit">
          <span class="arrowIcons" @click="changeArrow('keepWarmList')">
            <i :class="arrowIconClass4"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
          </span>
          <span class="individualText">建筑保温 <br>
            <el-button type="primary" plain size="" @click="addIndividualBuildInfor('keepWarmList')" v-show="keepWarmShow">新增+</el-button>
          </span>
          <span class="individualName">材料类别</span>
          <span class="individuaType">保温所在层数</span>
          <span class="individualRefractory">保温部位</span>
          <span class="individualOnFloorNum">保温材料</span>
          <span class="handle">操作</span>

        </div>
        <div class="individualBuildContainer" v-show="keepWarmShow">
          <div class="individualBuildList" v-for="(item,index) in keepWarmList" :key="index">
            <span class="individualText">

            </span>
            <span class="individualName">
              <el-select v-model="item.individualName">
                <el-option v-for="i in materialTypesOptions" :key="i.dictionaryId" :label="i.name" :value="i.dictionaryId">
                </el-option>
              </el-select>
            </span>
            <span class="individuaType">
              <el-input v-model="item.individuaType" size=''>
                <template slot="append">层</template>

              </el-input>
            </span>
            <span class="individualRefractory">
              <el-input v-model="item.individualRefractory" size=''></el-input>
            </span>
            <span class="individualOnFloorNum">
              <el-input v-model="item.individualOnFloorNum" size=''></el-input>
            </span>
            <span class="handle">
              <el-button type="primary" size="mini" @click="save('keepWarmList',item)">保存</el-button>
              <el-button type="danger" size="mini" @click="deleteI('keepWarmList',item.acContentBuildingInsulationsId)">删除</el-button>
            </span>
          </div>
        </div>

      </div>
      <div class="individualBuild decorate">
        <div class="individualBuildTit ">
          <span class="arrowIcons" @click="changeArrow('decorateList')">
            <i :class="arrowIconClass5"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
          </span>
          <span class="individualText">装饰装修 <br>
            <el-button type="primary" plain size="" @click="addIndividualBuildInfor('decorateList')" v-show="decorateShow">新增+</el-button>
          </span>
          <span class="individualName">装修部位</span>
          <span class="individuaType">装修面积</span>
          <span class="individualRefractory">装修所在层数</span>
          <span class="handle">操作</span>

        </div>
        <div class="individualBuildContainer" v-show="decorateShow">
          <div class="individualBuildList" v-for="(item,index) in decorateList" :key="index">
            <span class="individualText">

            </span>
            <span class="individualName">

              <el-select v-model="item.individualName">
                <el-option v-for="i in partTypesOptions" :key="i.dictionaryId" :label="i.name" :value="i.dictionaryId">
                </el-option>
              </el-select>
            </span>
            <span class="individuaType">
              <el-input v-model="item.individuaType" size=''>
                <template slot="append">m²</template>

              </el-input>
            </span>
            <span class="individualRefractory">
              <el-input v-model="item.individualRefractory" size=''>
                <template slot="append">层</template>

              </el-input>
            </span>
            <span class="handle">
              <el-button type="primary" size="mini" @click="save('decorateList',item)">保存</el-button>
              <el-button type="danger" size="mini" @click="deleteI('decorateList',item.acDecorationId)">删除</el-button>
            </span>
          </div>
        </div>

      </div>

      <div class="individualBuild changeUse">
        <div class="individualBuildTit ">
          <span class="arrowIcons" @click="changeArrow('changeUseList')">
            <i :class="arrowIconClass6"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
          </span>
          <span class="individualText">用途改变<br>
            <el-button type="primary" plain size="" @click="addIndividualBuildInfor('changeUseList')" v-show="changeUseShow">新增+</el-button>
          </span>
          <span class="individualName">使用性质</span>
          <span class="individuaType">原有用途</span>
          <span class="handle">操作</span>

        </div>
        <div class="individualBuildContainer" v-show="changeUseShow">
          <div class="individualBuildList" v-for="(item,index) in changeUseList" :key="index">
            <span class="individualText">
            </span>
            <span class="individualName">

              <el-select v-model="item.individualName">
                <el-option v-for="i in useTypesOptions" :key="i.dictionaryId" :label="i.name" :value="i.dictionaryId">
                </el-option>
              </el-select>
            </span>
            <span class="individuaType">
              <el-input v-model="item.individuaType" size=''></el-input>
            </span>
            <!-- <span class="individualRefractory">
                            <el-input v-model="item.individualRefractory" size=''></el-input>
                        </span> -->
            <span class="handle">
              <el-button type="primary" size="mini" @click="save('changeUseList',item)">保存</el-button>
              <el-button type="danger" size="mini" @click="deleteI('changeUseList',item.acContentUsagesId)">删除</el-button>
            </span>
          </div>
        </div>

      </div>
      <div class="individualBuild fireFightingDevice">
        <div class="individualBuildTit ">
          <span class="individualText">消防设施</span>
        </div>
        <div class="individualBuildContainer fireFightingDeviceContainer">
          <el-checkbox-group v-model="fireFightingDevice">
            <el-checkbox :label="item.standardPrimaryTitleId" v-for="item in fireFightingDeviceList" :key="item.standardPrimaryTitleId">{{item.titleName}}</el-checkbox>
          </el-checkbox-group>
        </div>

      </div>
    </div>

    <div class="bottom">
      <div class="btns">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import {
  getConsTypes,
  getFireTypes,
  getSetTypes,
  getSaveTypes,
  getMaterialTypes,
  getPartTypes,
  getUseTypes,
  addAc1,
  addAc2,
  addAc3,
  addAc4,
  addAc5,
  addAc6,
  getAcceptInfor,
  deletedAc1,
  deletedAc2,
  deletedAc3,
  deletedAc4,
  deletedAc5,
  deletedAc6,
  updateAc1,
  updateAc2,
  updateAc3,
  updateAc4,
  updateAc5,
  updateAc6,
  getMenus,
  replaceMenus
} from "@/apis/acceptanceContent";
import { getCategorys } from "@/apis/acceptMethods.js";
// import { forEach } from "lodash-es";
export default {
  data() {
    return {
      individualBuildList: [{}], // 单体建筑
      tankList: [{}], //油罐
      yardList: [{}], //堆场
      keepWarmList: [{}], // 建筑保温
      decorateList: [{}], //装饰装修
      changeUseList: [{}], //用途改变
      fireFightingDevice: [], //默认选中消防设施
      individuaTypeOptions: [], // 结构类型
      individualRefractoryOptions: [], // 耐火等级
      setTypesOptions: [], //设置形式
      saveTypesOptions: [], // 储存形式
      materialTypesOptions: [], //材料类别
      partTypesOptions: [], //装修部位
      useTypesOptions: [], // 使用性质
      materialTypesOptions: [], //材料类别
      partTypesOptions: [], //装修部位
      useTypesOptions: [], // 使用性质
      standardId: "", //验收方式
      fireFightingDeviceList: [], //消防设施
      arrowIconClass1: "el-icon-arrow-up", //展开图标
      arrowIconClass2: "el-icon-arrow-down", //展开图标
      arrowIconClass3: "el-icon-arrow-down", //展开图标
      arrowIconClass4: "el-icon-arrow-down", //展开图标
      arrowIconClass5: "el-icon-arrow-down", //展开图标
      arrowIconClass6: "el-icon-arrow-down", //展开图标
      individualBuildShow: true,
      tankShow: false,
      yardShow: false,
      keepWarmShow: false,
      decorateShow: false,
      changeUseShow: false
    };
  },
  created() {
    this.getOptions();
    this.getFormInfor();
    this.getCheckMenus();
  },
  methods: {
    //保存消防设施
    onSubmit() {
      let fireNoCkecked = [];
      for (let i = 0; i < this.fireFightingDeviceList.length; i++) {
        if (this.fireFightingDevice.length > 0) {
          let fireFlag = false;
          for (let j = 0; j < this.fireFightingDevice.length; j++) {
            if (
              this.fireFightingDeviceList[i].standardPrimaryTitleId ==
              this.fireFightingDevice[j]
            ) {
              fireFlag = true;
              break;
            }
          }
          if (!fireFlag) {
            fireNoCkecked.push({
              menuLevel: 1,
              standardPrimaryTitleId: this.fireFightingDeviceList[i]
                .standardPrimaryTitleId,
              deleted: -1
            });
          }
        } else {
          fireNoCkecked.push({
            menuLevel: 1,
            standardPrimaryTitleId: this.fireFightingDeviceList[i]
              .standardPrimaryTitleId,
            deleted: -1
          });
        }
      }
      let arr = this.fireFightingDevice
        .map(item => {
          return {
            menuLevel: 1,
            standardPrimaryTitleId: item,
            deleted: 1
          };
        })
        .concat(fireNoCkecked);
      replaceMenus({
        projectId: this.$store.state.projectInfor.projectId,
        standardId: this.$store.state.projectInfor.standardId,
        checklistMenusList: arr
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: "网络请求失败"
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    // 获取页面信息
    getFormInfor() {
      getAcceptInfor({
        projectId: this.$store.state.projectInfor.projectId,
        contentId: this.$store.state.projectInfor.acContentId
      })
        .then(res => {
          console.log(res.result.ac1Builds);
          if (res.httpStatus == 200) {
            if (res.result.ac1Builds <= 0) {
              this.individualBuildList = [{}];
            } else {
              this.individualBuildList = res.result.ac1Builds.map(item => {
                item.individualName = item.buildName;
                item.individualOnArea = item.aboveGroundFloorArea;
                item.individualHeight = item.buildHeight;
                item.individualLength = item.buildLen;
                item.individuaType = item.buildTypeId;
                item.individualArea = item.coversArea;
                item.individualOnFloorNum = item.inTheUpperNumber;
                item.individualUnderFloorNum = item.numberOfUnderground;
                item.individualRefractory = item.refractoryLevelId;
                item.individualUnderArea = item.undergroundFloorSpace;
                // item.acContentBuildId

                return item;
              });
            }
            if (res.result.ac2StoragesTanks.length <= 0) {
              this.tankList = [{}];
            } else {
              this.tankList = res.result.ac2StoragesTanks.map(item => {
                item.individualName = item.position;
                item.individualRefractory = item.settingTypeId;
                item.individualUnderFloorNum = item.storageMaterialName;
                item.individualOnFloorNum = item.storageTypeId;
                item.individuaType = item.totalCapacity;
                return item;
              });
            }
            if (res.result.ac3Yards.length <= 0) {
              this.yardList = [{}];
            } else {
              this.yardList = res.result.ac3Yards.map(item => {
                item.individuaType = item.storageCapacity;
                item.individualName = item.storageMaterialName;
                return item;
              });
            }
            if (res.result.ac4BuildingInsulations.length <= 0) {
              this.keepWarmList = [{}];
            } else {
              this.keepWarmList = res.result.ac4BuildingInsulations.map(
                item => {
                  item.individualOnFloorNum = item.material;
                  item.individualName = item.materialClassesId;
                  item.individuaType = item.numberOfInsulationLayers;
                  item.individualRefractory = item.parts;
                  return item;
                }
              );
            }
            if (res.result.ac5Decorations.length <= 0) {
              this.decorateList = [{}];
            } else {
              this.decorateList = res.result.ac5Decorations.map(item => {
                item.individuaType = item.area;
                item.individualRefractory = item.layerNum;
                item.individualName = item.parts;
                return item;
              });
            }
            if (res.result.ac6Usages.length <= 0) {
              this.changeUseList = [{}];
            } else {
              this.changeUseList = res.result.ac6Usages.map(item => {
                item.individuaType = item.originalUsage;
                item.individualName = item.usingNatureId;
                return item;
              });
              // console.log(this.changeUseList)
            }
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.Msg
          });
        });
    },
    addIndividualBuildInfor(index) {
      if (index == "individualBuildList") {
        this.individualBuildList.push({});
      } else if (index == "tankList") {
        this.tankList.push({});
      } else if (index == "yardList") {
        this.yardList.push({});
      } else if (index == "keepWarmList") {
        this.keepWarmList.push({});
      } else if (index == "decorateList") {
        this.decorateList.push({});
      } else if (index == "changeUseList") {
        this.changeUseList.push({});
      }
    },
    save(index, i) {
      console.log(i);
      // if (!i.acContentBuildId) {
      if (index == "individualBuildList") {
        if (!i.acContentBuildId) {
          addAc1({
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            buildName: i.individualName,
            usages: i.usages,
            aboveGroundFloorArea: i.individualOnArea,
            buildHeight: i.individualHeight,
            buildLen: i.individualLength,
            buildTypeId: i.individuaType,
            coversArea: i.individualArea,
            inTheUpperNumber: i.individualOnFloorNum,
            numberOfUnderground: i.individualUnderFloorNum,
            refractoryLevelId: i.individualRefractory,
            undergroundFloorSpace: i.individualUnderArea
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.getFormInfor()
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updateAc1({
            acContentBuildId: i.acContentBuildId,
            projectId: this.$store.state.projectInfor.projectId,
            // acContentId: this.$store.state.projectInfor.acContentId,
            buildName: i.individualName,
            usages: i.usages,
            aboveGroundFloorArea: i.individualOnArea,
            buildHeight: i.individualHeight,
            buildLen: i.individualLength,
            buildTypeId: i.individuaType,
            coversArea: i.individualArea,
            inTheUpperNumber: i.individualOnFloorNum,
            numberOfUnderground: i.individualUnderFloorNum,
            refractoryLevelId: i.individualRefractory,
            undergroundFloorSpace: i.individualUnderArea
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      } else if (index == "tankList") {
        if (!i.acContentStorageTankId) {
          addAc2({
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            position: i.individualName,
            settingTypeId: i.individualRefractory,
            storageMaterialName: i.individualUnderFloorNum,
            storageTypeId: i.individualOnFloorNum,
            totalCapacity: i.individuaType
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.getFormInfor()
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updateAc2({
            acContentStorageTankId: i.acContentStorageTankId,
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            position: i.individualName,
            settingTypeId: i.individualRefractory,
            storageMaterialName: i.individualUnderFloorNum,
            storageTypeId: i.individualOnFloorNum,
            totalCapacity: i.individuaType
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      } else if (index == "yardList") {
        if (!i.acceptanceContentYardId) {
          addAc3({
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            storageCapacity: i.individuaType,
            storageMaterialName: i.individualName
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.getFormInfor()
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updateAc3({
            acceptanceContentYardId: i.acceptanceContentYardId,
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            storageCapacity: i.individuaType,
            storageMaterialName: i.individualName
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      } else if (index == "keepWarmList") {
        if (!i.acContentBuildingInsulationsId) {
          addAc4({
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            material: i.individualOnFloorNum,
            materialClassesId: i.individualName,
            numberOfInsulationLayers: i.individuaType,
            parts: i.individualRefractory
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.getFormInfor()
                
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updateAc4({
            acContentBuildingInsulationsId: i.acContentBuildingInsulationsId,
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            material: i.individualOnFloorNum,
            materialClassesId: i.individualName,
            numberOfInsulationLayers: i.individuaType,
            parts: i.individualRefractory
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      } else if (index == "decorateList") {
        if (!i.acDecorationId) {
          addAc5({
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            area: i.individuaType,
            layerNum: i.individualRefractory,
            parts: i.individualName
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
                this.getFormInfor()
              
            });
        } else {
          updateAc5({
            acDecorationId: i.acDecorationId,
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            area: i.individuaType,
            layerNum: i.individualRefractory,
            parts: i.individualName
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      } else if (index == "changeUseList") {
        if (!i.acContentUsagesId) {
          addAc6({
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            originalUsage: i.individuaType,
            usingNatureId: i.individualName
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        } else {
          updateAc6({
            acContentUsagesId: i.acContentUsagesId,
            projectId: this.$store.state.projectInfor.projectId,
            acContentId: this.$store.state.projectInfor.acContentId,
            originalUsage: i.individuaType,
            usingNatureId: i.individualName
          })
            .then(res => {
              if (res.httpStatus == 200) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.getFormInfor()
                
              }
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.msg
              });
            });
        }
      }
      // } else {
      //   this.$message({
      //     type: "info",
      //     message: "不能在原项中修改，请删除后重新添加"
      //   });
      // }
    },
    deleteI(index, id) {
      this.$confirm("确定删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          if (index == "individualBuildList") {
            deletedAc1({ id })
              .then(res => {
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.getFormInfor();
                }
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.msg
                });
              });
          } else if (index == "tankList") {
            deletedAc2({ id })
              .then(res => {
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.getFormInfor();
                }
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.msg
                });
              });
          } else if (index == "yardList") {
            deletedAc3({ id })
              .then(res => {
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.getFormInfor();
                }
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.msg
                });
              });
          } else if (index == "keepWarmList") {
            deletedAc4({ id })
              .then(res => {
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.getFormInfor();
                }
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.msg
                });
              });
          } else if (index == "decorateList") {
            deletedAc5({ id })
              .then(res => {
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.getFormInfor();
                }
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.msg
                });
              });
          } else if (index == "changeUseList") {
            deletedAc6({ id })
              .then(res => {
                if (res.httpStatus == 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.getFormInfor();
                }
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.msg
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
    //获取页面下拉框选项
    getOptions() {
      getConsTypes()
        .then(res => {
          if (res.httpStatus == 200) {
            this.individuaTypeOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
      getFireTypes()
        .then(res => {
          if (res.httpStatus == 200) {
            this.individualRefractoryOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
      getSetTypes()
        .then(res => {
          if (res.httpStatus == 200) {
            this.setTypesOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
      getSaveTypes()
        .then(res => {
          if (res.httpStatus == 200) {
            this.saveTypesOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
      getMaterialTypes()
        .then(res => {
          if (res.httpStatus == 200) {
            this.materialTypesOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
      getPartTypes()
        .then(res => {
          if (res.httpStatus == 200) {
            this.partTypesOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
      getUseTypes()
        .then(res => {
          if (res.httpStatus == 200) {
            this.useTypesOptions = res.result;
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    //获取消防设施选项
    getCheckMenus() {
      //获取验收方式
      getCategorys()
        .then(res => {
          if (res.httpStatus == 200) {
            res.result.forEach(item => {
              if (item.categoryCode == 99) {
                this.standardId = item.standard.standardId;
              }
            });
            getMenus({
              projectId: this.$store.state.projectInfor.projectId,
              standardId: this.standardId
            })
              .then(r => {
                if (r.httpStatus == 200) {
                  this.fireFightingDeviceList = r.result.primaryTitles.map(
                    item => {
                      return {
                        titleName: item.titleName,
                        selected: item.selected,
                        standardPrimaryTitleId: item.standardPrimaryTitleId
                      };
                    }
                  );
                  this.fireFightingDeviceList.forEach(item => {
                    if (item.selected == true) {
                      this.fireFightingDevice.push(item.standardPrimaryTitleId);
                    }
                  });
                }
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.msg
                });
              });
          }
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    // 点击伸缩图标
    changeArrow(index) {
      if (index == "individualBuildList") {
        if (this.arrowIconClass1 === "el-icon-arrow-down") {
          this.arrowIconClass1 = "el-icon-arrow-up";
          this.individualBuildShow = true;
        } else {
          this.arrowIconClass1 = "el-icon-arrow-down";
          this.individualBuildShow = false;
        }
      } else if (index == "tankList") {
        if (this.arrowIconClass2 === "el-icon-arrow-down") {
          this.arrowIconClass2 = "el-icon-arrow-up";
          this.tankShow = true;
        } else {
          this.arrowIconClass2 = "el-icon-arrow-down";
          this.tankShow = false;
        }
      } else if (index == "yardList") {
        if (this.arrowIconClass3 === "el-icon-arrow-down") {
          this.arrowIconClass3 = "el-icon-arrow-up";
          this.yardShow = true;
        } else {
          this.arrowIconClass3 = "el-icon-arrow-down";
          this.yardShow = false;
        }
      } else if (index == "keepWarmList") {
        if (this.arrowIconClass4 === "el-icon-arrow-down") {
          this.arrowIconClass4 = "el-icon-arrow-up";
          this.keepWarmShow = true;
        } else {
          this.arrowIconClass4 = "el-icon-arrow-down";
          this.keepWarmShow = false;
        }
      } else if (index == "decorateList") {
        if (this.arrowIconClass5 === "el-icon-arrow-down") {
          this.arrowIconClass5 = "el-icon-arrow-up";
          this.decorateShow = true;
        } else {
          this.arrowIconClass5 = "el-icon-arrow-down";
          this.decorateShow = false;
        }
      } else if (index == "changeUseList") {
        if (this.arrowIconClass6 === "el-icon-arrow-down") {
          this.arrowIconClass6 = "el-icon-arrow-up";
          this.changeUseShow = true;
        } else {
          this.arrowIconClass6 = "el-icon-arrow-down";
          this.changeUseShow = false;
        }
      }
    }
  }
};
</script>

<style lang="less">
#acceptanceContentWrapper {
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding-left: 20px;
  // box-sizing: border-box;
  .top {
    .individualBuild {
      span {
        display: inline-block;
        padding: 5px 5px;
        text-align: center;
      }
      .individualBuildTit {
        height: 40px;
        line-height: 40px;
        text-align: center;
        display: flex;
        position: relative;
        .arrowIcons {
          position: absolute;
          left: -25px;
          font-size: 20px;
          cursor: pointer;
        }
        // justify-content: space-between;
      }
    }
    .individualBuildContainer {
      background-color: #fff;
      .individualBuildList {
        display: flex;
        // justify-content: space-between;
        align-items: center;
      }
    }
    .individualText {
      width: 80px;
      .el-button {
        // height: 30px;
        // line-height: 5px;
        span {
          padding: 0;
          // line-height: 30px;
        }
      }
    }
    .individualName {
      width: 200px;
    }
    .individuaUsed {
      width: 120px;
    }
    .individuaType {
      width: 120px;
    }
    .individualRefractory {
      width: 100px;
    }
    .individualOnFloorNum {
      width: 80px;
    }
    .individualUnderFloorNum {
      width: 80px;
    }
    .individualHeight {
      width: 80px;
    }
    .individualLength {
      width: 80px;
    }
    .individualArea {
      width: 80px;
    }
    .individualOnArea {
      width: 80px;
    }
    .individualUnderArea {
      width: 80px;
    }
    .fireFightingDevice {
      line-height: 30px;
      .fireFightingDeviceContainer {
        padding: 10px 10px;
      }
    }
    .handle {
      width: 120px;
      padding: 5px;
      .el-button {
        padding: 5px;
        margin: 0 5px;
      }
    }
    .w100px {
      width: 100px;
    }
    .el-input-group__append {
      padding: 0 5px;
    }
  }
  .bottom {
    .btns {
      margin-top: 20px;
      margin-bottom: 40px;
      text-align: center;
    }
  }
  .el-input__icon {
    line-height: 0;
  }
  .el-input {
    // line-height: 40px;
  }
}
</style>