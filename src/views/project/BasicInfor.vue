<template>
  <div id="basicInforWrapper">
    <el-form ref="form" :model="form" label-width="100px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="工程名称">
            <el-input v-model="form.projectName" class="w80P" :disabled='roleDisabled'></el-input>
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
            <el-select v-model="form.regionId" :placeholder="coPh" @change="chosedCounty()" :disabled='roleDisabled'>
              <el-option v-for="(item,index) in countyOptions" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="详细地址">
            <el-input v-model="form.detailedAddress" :disabled='roleDisabled'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" v-show="roleHandle">
          <span class="coordinate">
            <i class="el-icon-map-location" @click="openMask()"></i>
          </span>
        </el-col>
      </el-row>
      <el-divider></el-divider>

      <el-row class="construction">
        <el-col :span="8">
          <el-form-item label="工程投资额" :disabled='roleDisabled'>
            <!-- <el-input v-model="form.name" class="w80P"></el-input> -->
            <el-input v-model="form.money" class="w80P" :disabled='roleDisabled'>
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item label="总建筑物面积">
            <el-input v-model="form.name" class="w80P"></el-input>
          </el-form-item> -->
          <el-form-item label="总建筑面积">
            <el-input v-model="form.constructionArea" class="w80P" :disabled='roleDisabled'>
              <template slot="append">m²</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item label="申请验收日期">
            <el-input v-model="form.detailedAddress"></el-input>
          </el-form-item> -->
          <el-form-item label="申请验收日期">
            <el-date-picker v-model="form.time" type="date" placeholder="选择日期" value-format="timestamp" class="w80P" :disabled='roleDisabled'>
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider></el-divider>

      <el-row class="construction prompBox">
        <el-col :span="8">
          <el-form-item label="建设单位">
            <!-- <el-select v-model="form.constructionPartId" class="w80P">
              <el-option v-for="j in constructionOptions" :key="j.factoryId" :label="j.factoryName" :value="j.factoryId">
              </el-option>
            </el-select> -->

            <el-cascader :options="constructionOptions" :props="props" clearable v-model="form.constructionPartId" class="w80P" :disabled='roleDisabled'></el-cascader>
            <i class="el-icon-question promptIcon" @click="showPromptText2 = !showPromptText2"></i>
            
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item label="项目负责人">
            <el-input v-model="person1" class="w80P" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话">
            <el-input v-model="phone1" class="w80P" disabled></el-input>
          </el-form-item>
        </el-col>
        <span class="promptText" v-show="showPromptText2">列表中没有显示的，需在【用户管理】中创建组织</span>
      </el-row>

      <el-divider></el-divider>
      <el-row class="construction prompBox">
        <el-col :span="8">
          <el-form-item label="技术服务机构" >
            <!-- <el-select v-model="form.servicePartId" class="w80P">
              <el-option v-for="j in serviceOptions" :key="j.factoryId" :label="j.factoryName" :value="j.factoryId">
              </el-option>
            </el-select> -->
            <el-cascader :options="serviceOptions" :props="props" clearable v-model="form.servicePartId" class="w80P" filterable :filter-method='filterservice' ref='filterserviceTree' :disabled='roleDisabled'></el-cascader>
            <i class="el-icon-question promptIcon" @click="showPromptText1 = !showPromptText1"></i>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目负责人">
            <el-input v-model="person2" class="w80P" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话">
            <el-input v-model="form.phone2" class="w80P" disabled></el-input>
          </el-form-item>
        </el-col>
            <span class="promptText" v-show="showPromptText1">列表中没有显示的，需告知对方注册新用户</span>
        
      </el-row>

      <el-divider></el-divider>

      <el-row class="construction">
        <el-col :span="8">
          <!-- <el-form-item label="验收单位">
            <el-select v-model="form.constructionUnitValue" class="w80P">
              <el-option v-for="j in constructionUnitOptions" :key="j.factoryId" :label="j.factoryName" :value="j.factoryId">
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="验收单位">
            <el-cascader :options="AcceptanceFactorysOptions" :props="props" clearable v-model="form.acceptancePartId" class="w80P" :disabled='roleDisabled'></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="消防验收申请受理凭证文号" label-width="180px">
            <el-input v-model="form.certificateNumber" class="w75P" :disabled='roleDisabled'></el-input>
          </el-form-item>
          <!-- <el-form-item label="联系人">
            <el-input v-model="form.person" class="w80P"></el-input>
          </el-form-item> -->
        </el-col>
        <el-col :span="8">
          <el-form-item label="消防设计审查意见书文号" label-width="180px">
            <el-input v-model="form.reviewCertificateNumber" class="w75P" :disabled='roleDisabled'></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider></el-divider>

      <!-- <el-row class="construction">
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
      </el-row> -->

      <!-- <el-divider></el-divider> -->

      <!-- <el-row class="construction">
        <el-col :span="12">
          <el-form-item label="验收凭证文号" label-width="100px">
            <el-input v-model="form.ProofDocument"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          
        </el-col>
        <el-col :span="6">
          
        </el-col>
      </el-row>
      <el-divider></el-divider> -->
      <el-row class="construction">
        <el-col :span="12">
          <el-form-item label="工程类别：" class="Engineering">
            <el-radio-group v-model="form.typeId" :disabled='roleDisabled'>
              <el-radio :label="item.dictionaryId" v-for="item in EngineeringList" :key="item.dictionaryId">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="火宅危险性：" label-width="100px">
            <el-radio-group v-model="form.fire">
              <el-radio :label="item.dictionaryId" v-for="item in fireList" :key="item.dictionaryId">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-divider></el-divider>

      <el-row class="construction">
        <el-col :span="18">
          <el-form-item label="特殊建设工程情形：" label-width="140px">
            <el-input v-model="userdListStr" class="w75P" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="clickZoom">
          <span @click="clickZoom()">{{zoomText}}</span>
          <span @click="clickZoom()">
            <i class="el-icon-arrow-down" v-show="zoomDown"></i>
            <i class="el-icon-arrow-up" v-show="zoomUp"></i>
          </span>

        </el-col>
      </el-row>
      <el-divider></el-divider>

      <transition name="el-zoom-in-top">
        <div v-show="show2" class="transition-box userd">
          <el-form-item>
            <span>(一)总建筑物面积大于二万平方米的 ：</span>
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_2w" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <span>（二）总建筑物面积大于一万五千平方米的 ：</span>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_15w" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->

            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_15w" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <span>（三）总建筑物面积大于一万平方米的 ：</span>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_1w" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_1w" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <span>（四）总建筑物面积大于二千五百平方米的 ：</span>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Water" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_Water" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <span>（五）总建筑物面积大于一千平方米的 ：</span>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_01" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_01" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <span>（六）总建筑物面积大于五百平方米的 ：</span>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_05" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_05" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Standard" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <span>（七） ：</span>
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_Standard" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <span>（八） ：</span>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Car" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_Car" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <span>（九）生产、储存、装卸易燃易爆危险物品的 ：</span>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Produce" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_Produce" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Gas" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <span>（十）生产、储存、装卸易燃易爆危险物品的 ：</span>
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_Gas" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_project" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <span>（十一）：</span>
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_project" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <!-- <el-radio-group v-model="form.userd">
            <el-radio :label="item.dictionaryId" v-for="item in getUsedList.Used_Public" :key="item.dictionaryId">{{item.name}}</el-radio>
          </el-radio-group> -->
            <span>（十二）：</span>
            <el-checkbox-group v-model="userdList" :disabled='roleDisabled'>
              <el-checkbox :label="item.dictionaryId" v-for="item in getUsedList.Used_Public" :key="item.dictionaryId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </transition>

      <!-- <el-divider></el-divider> -->

      <el-form-item class="btn construction">
        <div class="btnWrapper" v-show="roleHandle">
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
        <div class="mapBtn" v-show="roleHandle">
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
  getConstructionFactorys
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
        projectName: "", //工程名称
        regionId: "", //工程地址
        detailedAddress: "", //详细地址
        money: "", // 投资额
        constructionArea: "", //总建筑面积
        time: "", //申请验收日期
        constructionPartId: "", //建设单位
        servicePartId: "", //技术服务机构
        acceptancePartId: "", //验收单位
        certificateNumber: "", //消防验收申请受理凭证文号
        reviewCertificateNumber: "", //消防设计审查意见书文号
        typeId: "", //工程类别：
        provinceRegion: "云南省",
        cityRegion: "昆明市",
        lat: "",
        lon: ""
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
      AcceptanceFactorysOptions: [], //验收单位
      serviceOptions: [],
      constructionOptions: [],
      props: {
        // multiple: true,
        checkStrictly: true,
        children: "departments",
        label: "partsName",
        value: "id",
        emitPath: false
      },
      allUserdList: [], // 保存特殊建设工程情形的数据
      userdList: [], //特殊建设工程情形
      userdListStr: "", //特殊建设工程情形
      person1: "", //建设单位联系人
      person2: "", //技术服务机构联系人
      phone1: "", //建设单位电话
      phone2: "", //技术服务机构电话
      zoomText: "展开",
      zoomDown: true,
      zoomUp: false,
      show2: false,
      roleDisabled: true,
      roleHandle: false,
      showPromptText1:false,
      showPromptText2:false,
    };
  },
  mounted() {
    this.roleControl();
    this.getRegionsData();
    this.getEngineeringInfor();
    this.getFireInfor();
    this.getUsedInfor();
    this.getAcceptanceFactorysOptions();
    // this.getConstructionFactoryOptions();
    this.getProjectInformation();
    this.chosedcity();
  },
  updated() {
    // this.$nextTick(function(){
    //   this.filterservice()
    // })
  },
  methods: {
    roleControl() {
      let roleCode = this.$store.state.userRole.roleCode;
      if (
        roleCode == 300 ||
        roleCode == 600 ||
        roleCode == 650 ||
        roleCode == 700
      ) {
        this.roleDisabled = false;
        this.roleHandle = true;
      } else {
        this.roleDisabled = true;
        this.roleHandle = false;
      }
    },
    onSubmit() {
      if (!this.$store.state.projectInfor.projectId) {
        addProject2({
          projectName: this.form.projectName,
          regionId: this.form.regionId,
          detailedAddress: this.form.detailedAddress,
          money: this.form.money,
          time: this.form.time,
          constructionPartId: this.form.constructionPartId,
          servicePartId: this.form.servicePartId,
          acceptancePartId: this.form.acceptancePartId,
          certificateNumber: this.form.certificateNumber,
          reviewCertificateNumber: this.form.reviewCertificateNumber,
          typeId: this.form.typeId,
          lat: this.form.lat,
          lon: this.form.lon,
          constructionArea: this.form.constructionArea,
          usageId: this.userdList.join(",")
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.$message({
                type: "success",
                message: "提交成功"
              });
              this.$store.commit("saveContentId", res.result.contentId);
              this.$store.commit("chosedProjectId", {
                projectId: res.result.result.projectId,
                acContentId: res.result.result.contentId
              });
              let bool =
                this.$store.state.addProjectSuccessed == "1" ? "2" : "1";
              this.$store.commit("addProjectSuccess", bool);
              this.getProjectInformation();
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
          projectName: this.form.projectName,
          regionId: this.form.regionId,
          detailedAddress: this.form.detailedAddress,
          money: this.form.money,
          time: this.form.time,
          constructionPartId: this.form.constructionPartId,
          servicePartId: this.form.servicePartId,
          acceptancePartId: this.form.acceptancePartId,
          certificateNumber: this.form.certificateNumber,
          reviewCertificateNumber: this.form.reviewCertificateNumber,
          typeId: this.form.typeId,
          lat: this.form.lat,
          lon: this.form.lon,
          constructionArea: this.form.constructionArea,
          usageId: this.userdList.join(",")
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
              this.getProjectInformation();
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
        pid: "530100000000"
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
        id: this.form.regionId
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
          // console.log(res);
          if (res.httpStatus == 200) {
            this.allUserdList = res.result;
            this.getUsedList = res.result.reduce((res1, item) => {
              res1[item.code]
                ? res1[item.code].push(item)
                : (res1[item.code] = [item]);
              return res1;
            }, {});
          }
          // console.log(this.getUsedList);
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
          console.log(res);
          if (res.httpStatus == 200) {
            //h获取三级联动
            if (res.result.project.regionId) {
              this.getCity(res.result.project.regionId);
            } else {
              this.cPh = "市";
              this.pPh = "省";
              this.coPh = "区/县";
            }
            if (res.result.project.lat && res.result.project.lat != "") {
              this.$store.commit("savePoint", {
                lat: res.result.project.lat,
                lng: res.result.project.lon
              });
            }
            this.form = {
              projectName: res.result.project.projectName, //工程名称
              regionId: res.result.project.regionId, //工程地址
              detailedAddress: res.result.project.detailedAddress, //详细地址
              money: res.result.project.money, // 投资额
              constructionArea: res.result.project.constructionArea, //总建筑面积
              time: res.result.project.time, //申请验收日期
              constructionPartId: res.result.project.authConstructionIds[0], //建设单位
              servicePartId: res.result.project.authServiceIds[0], //技术服务机构
              acceptancePartId: res.result.project.authAcceptanceIds[0], //验收单位
              certificateNumber: res.result.project.certificateNumber, //消防验收申请受理凭证文号
              reviewCertificateNumber:
                res.result.project.reviewCertificateNumber, //消防设计审查意见书文号
              typeId: res.result.project.typeId, //工程类别：
              provinceRegion: "云南省",
              cityRegion: "昆明市",
              lat: res.result.project.lat,
              lon: res.result.project.lon
            };
            //建设单位联系
            this.person1 = res.result.constructionProjectLeader
              ? res.result.constructionProjectLeader
              : "";
            this.person2 = res.result.serviceProjectLeader
              ? res.result.serviceProjectLeader
              : "";
            this.phone1 = res.result.constructionProjectLeaderPhone
              ? res.result.constructionProjectLeaderPhone
              : "";
            this.phone2 = res.result.serviceProjectLeaderPhone
              ? res.result.serviceProjectLeaderPhone
              : "";
            // console.log(this.form)
            this.userdList = res.result.projectInfoUsages.map(item => {
              return item.dictionaryId;
            });
            let arr = res.result.projectInfoUsages.map(item => {
              return item.usageName;
            });
            this.userdListStr = arr.join(",");
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //查询（验收单位，建设单位，技术服务机构）
    getAcceptanceFactorysOptions() {
      //验收
      getFactoryMenus({
        factoryType: 5,
        onlyFactory: true,
        queryUser: false
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.AcceptanceFactorysOptions = res.result.map(item => {
              return item;
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: err
          });
        });
      // 建设
      getFactoryMenus({
        factoryType: 1,
        onlyFactory: true,
        queryUser: false
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.constructionOptions = res.result.map(item => {
              return item;
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: err
          });
        });
      //服务机构
      getFactoryMenus({
        factoryType: 10,
        onlyFactory: true,
        queryUser: false
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.serviceOptions = res.result.map(item => {
              return item;
            });
          }
        })
        .catch(err => {
          console.log(err);
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
    //点击缩放
    clickZoom() {
      this.zoomText = this.zoomText == "展开" ? "收缩" : "展开";
      this.zoomDown = this.zoomDown == true ? false : true;
      this.zoomUp = this.zoomUp == false ? true : false;
      this.show2 = this.show2 == false ? true : false;
    },
    //过滤服务机构
    filterservice(node, keyword) {
      return getFactoryMenus({
        factoryType: "10",
        onlyFactory: true,
        rootName: keyword
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.serviceOptions = res.result.map(item => {
              return item;
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "网络请求失败"
          });
        });
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
        border-bottom: 1px solid #f4f4f4;
        .el-form-item__label {
          line-height: 38px;
        }
        .el-form-item__content {
        }
        .el-radio__label {
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
    // align-items: center;
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
  .mT15 {
    margin-top: 15px;
  }
  .w80P {
    width: 80%;
  }
  .w75P {
    width: 75%;
  }
  .clickZoom {
    color: dodgerblue;
    font-size: 16px;
    line-height: 30px;
    margin-left: 10px;
  }
  .clickZoom:hover {
    cursor: pointer;
  }

  .prompBox {
    position: relative;
    .promptIcon {
      font-size: 16px;
      margin-left: 5px;
    }
    .promptIcon:hover {
      cursor: pointer;
    }
    .promptText {
      font-size: 12px;
      position: absolute;
      left: 200px;
      bottom: 2px;
    }
  }
}
</style>