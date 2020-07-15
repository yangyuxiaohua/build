<template>
  <div id="mapWrapper">
    <baidu-map class="bm-view" ak="SNUcFOLFpX4Ra1HxR9OEHdSEdkzyDxll" :center="center" :zoom="zoom" @ready="map_handler" :scroll-wheel-zoom="true" :mapClick="false">

      <div v-for="marker in markers" :key="marker.projectId">
        <bm-marker :position="{lng: marker.lng, lat: marker.lat}" @click="markerClick($event,marker)">
        </bm-marker>
        <!-- <bm-label :content="marker.content" :offset="{width:-55,height:-65}" :position="{lng: marker.lng, lat: marker.lat}" :labelStyle="{border:'1px solid #6ea4cd', padding:'8px',fontWeight: '600',fontSize:'14px',cursor: 'pointer'}" :title="marker.content" @click="markerClick(marker)" /> -->
      </div>
    </baidu-map>
    <div class='infoWindow' v-show="infoFlag" :style="{left:infoL,top:infoT}">
      <div class="header">
        <p class="projectName">项目名称 : {{projectForm.projectName}}</p>
        <span @click="closeInfoWindow()">
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="infoWindowContainer">
        <div class="infoWindowNav">
          <span :class="{choseInfoWindowNav :cIwN==0}" @click="changeIWN(0)">项目基本情况</span>
          <span :class="{choseInfoWindowNav :cIwN==1}" @click="changeIWN(1)">消防验收情况</span>
        </div>
        <div class="infoWindowFooter">
          <div class="ProjectBasicInfoWrapper" v-show="ProjectBasicInfo">
            <p>工程地址 ：
              <span>{{projectForm.regionName}}</span>
            </p>
            <p>总建筑物面积 ：
              <span>{{projectForm.regionName}}</span>
            </p>
            <p>申请日期 ：
              <span>{{projectForm.time}}</span>
            </p>
            <p>建设单位 ：
              <span>{{projectForm.factoryName}}</span>
            </p>
            <p>建设单位项目负责人 ：
              <span>{{projectForm.constructionProjectLeader}}</span>
            </p>
            <p>建设单位项目负责人电话 ：
              <span>{{projectForm.constructionProjectLeaderPhone}}</span>
            </p>
            <p>服务机构 ：
              <span>{{projectForm.serviceFactoryName}}</span>
            </p>
            <p>服务机构项目负责人 ：
              <span>{{projectForm.serviceProjectLeader}}</span>
            </p>
            <p>服务机构项目负责人电话 ：
              <span>{{projectForm.serviceProjectLeaderPhone}}</span>
            </p>
            <p>验收单位 ：
              <span>{{projectForm.acceptanceFactoryName}}</span>
            </p>
            <p>消防验收申请受理凭证文号 ：
              <span>{{projectForm.certificateNumber}}</span>
            </p>
            <p>消防设计审查意见书文号 ：
              <span>{{projectForm.reviewCertificateNumber}}</span>
            </p>
            <p>工程类别 ：
              <span>{{projectForm.typeName}}</span>
            </p>
            <p>使用性质 ：
              <span>{{projectForm.usageName}}</span>
            </p>
            
          </div>
          <div class="ProjectAcceptanceInfoWrapper" v-show="ProjectAcceptanceInfo">
            <!-- titleName: item.titleName,
                  qualified -->
            <p v-for="(item,index) in qualifiyList" :key="index">
              <span>{{item.titleName}}</span>
              <span class="qualified" :class="{noQualified :item.color ==5 }">{{item.qualified}}</span>
            </p>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import BmMarker from "vue-baidu-map/components/overlays/Marker"; //点标注
import {
  getProjectsSites,
  getProjectInfo,
  getXianCHangPingDingDocStatisticalByProjectId
} from "@/apis/map.js";
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
// import BmInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
// import BmOverlay from "vue-baidu-map/components/overlays/Overlay.vue";
// import BmLabel from "vue-baidu-map/components/overlays/Label.vue";
import { getlTime, inDexOfStr, splitStr } from "@/utils/publictool";
export default {
  components: {
    BaiduMap,
    BmMarker
    // BmInfoWindow,
    // BmOverlay,
    // BmLabel
  },
  data() {
    return {
      BMap: {},
      map: {},
      center: { lng: 102.72, lat: 25.05 },
      zoom: 3,
      markers: [],
      infoFlag: false, //信息窗口隐藏
      infoL: "20px",
      infoT: "200px",
      cIwN: 0,
      pId: "",
      projectForm: {
        time: "",
        usageName: "",
        dangerousLevelName: "",
        typeName: "",
        contactUser: "",
        certificateNumber: "",
        factoryName: "",
        regionName: "",
        projectName: ""
      },
      ProjectAcceptanceInfo: false, //显示验收内容
      ProjectBasicInfo: true, //显示基本情况
      qualifiyList: [], //合格的数组
      markersSave: [] //保存所有的点数组
    };
  },
  created() {},
  mounted() {
    // let _this = this;
    // this.markers = [
    //   {
    //     lng: 116.404,
    //     lat: 39.915,
    //     content: "TCL液晶产业园"
    //   },
    //   {
    //     lng: 115.504,
    //     lat: 39.915,
    //     content: "TCL产业园"
    //   }
    // ];
    this.getProjectInforPosition();
  },
  methods: {
    map_handler({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      // this.center.lng = 102.72;
      // this.center.lat = 25.05;
      this.zoom = 12;
    },
    //获取项目位置及信息
    getProjectInforPosition() {
      getProjectsSites()
        .then(res => {
          console.log(res);
          if (res.httpStatus == 200) {
            this.markersSave = res.result.map(item => {
              return {
                lng: item.lon,
                lat: item.lat,
                content: item.projectName,
                projectId: item.projectId,
                regionId: item.regionId
              };
            });
          }
          this.markers = Object.assign(this.markersSave);
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.msg
          });
        });
    },
    markerClick(e, marker) {
      this.pId = marker.projectId;
      this.changeIWN(0);
      // this.getProjectInfor();
      this.infoFlag = true;
      if (
        e.clientY + 320 >
        document.getElementById("mapWrapper").offsetHeight
      ) {
        if (
          e.clientX + 600 >
          document.getElementById("mapWrapper").offsetWidth - 350
        ) {
          this.infoL = e.clientX - 600 + "px";
          this.infoT = e.clientY - 400 - 80 + "px";
        } else {
          this.infoL = e.clientX + "px";
          this.infoT = e.clientY - 400 - 80 + "px";
        }
      } else {
        if (
          e.clientX + 600 >
          document.getElementById("mapWrapper").offsetWidth - 350
        ) {
          this.infoL = e.clientX - 600 + "px";
          this.infoT = e.clientY - 80 + "px";
        } else {
          this.infoL = e.clientX + "px";
          this.infoT = e.clientY - 80 + "px";
        }
      }
    },
    closeInfoWindow() {
      // this.cIwN = 0;
      // this.projectForm = {}
      this.infoFlag = false;
    },
    //窗口内容切换
    changeIWN(index) {
      this.cIwN = index;
      if (index == 0) {
        this.ProjectBasicInfo = true;
        this.ProjectAcceptanceInfo = false;
        // this.getProjectInfor();

        getProjectInfo({
          projectId: this.pId
        })
          .then(res => {
            if (res.httpStatus == 200) {
              console.log(res);
              let usageName = res.result.projectInfoUsages.map(item=>{
                return item.usageName 
              })
              usageName = usageName.join(',')
              if (res.result.projectInfo) {
                this.projectForm = {
                  projectName: res.result.project.projectName,
                  regionName:res.result.projectInfo.regionName+ res.result.project.detailedAddress,
                  time: getlTime(res.result.projectInfo.time),
                  factoryName: res.result.projectInfo.factoryName,
                  constructionProjectLeader: res.result.projectInfo.constructionProjectLeader,
                  constructionProjectLeaderPhone: res.result.projectInfo.constructionProjectLeaderPhone,
                  
                  serviceFactoryName: res.result.projectInfo.serviceFactoryName,
                  serviceProjectLeader: res.result.projectInfo.serviceProjectLeader,
                  serviceProjectLeaderPhone: res.result.projectInfo.serviceProjectLeaderPhone,
                  
                  acceptanceFactoryName: res.result.projectInfo.acceptanceFactoryName,
                  
                  certificateNumber: res.result.project.certificateNumber,
                  
                  reviewCertificateNumber: res.result.project.reviewCertificateNumber,
                  typeName: res.result.projectInfo.typeName,
                  usageName,
                  
                 
                  
                };
              } else {
                this.projectForm = {};
                this.projectForm.projectName = res.result.project.projectName;
              }
            }
          })
          .catch(err => {
            this.$message({
              type: "warning",
              message: err.msg
            });
          });
      } else {
        this.ProjectBasicInfo = false;
        this.ProjectAcceptanceInfo = true;
        getXianCHangPingDingDocStatisticalByProjectId({
          projectId: this.pId
        })
          .then(res => {
            if (res.httpStatus == 200) {
              this.qualifiyList = res.result.primaryTitles.map(item => {
                return {
                  titleName: item.titleName,
                  qualified: item.qualified == 1 ? "合格" : "不合格",
                  color: item.qualified
                };
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
    }
  },
  computed: {
    filterMarkers() {
      return this.$store.state.filterMarkersData;
    }
  },
  watch: {
    filterMarkers: async function(val1, val2) {
      // console.log(typeof val1);
      if (val1) {
        if (inDexOfStr(val1, "项目")) {
          let projectId = splitStr(val1)[0];
          this.markers = this.markersSave.filter(item => {
            if (item.projectId == projectId) {
              return item;
            }
          });

          console.log(this.markers)
        } else {
          this.markers = this.markersSave.filter(item => {
            if (item.regionId == val1) {
              return item;
            }
            // console.log(item)
          });
          // console.log(this.markers);
          // this.center.lng = this.markers[0].lng
          // this.center.lat = this.markers[0].lat
        }
            this.center = {
              lng:this.markers[0].lng,
              lat:this.markers[0].lat
            }
      } else {
        this.markers = Object.assign(this.markersSave);
      }
    }
  }
};
</script>

<style lang="less" >
#mapWrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .bm-view {
    width: 100%;
    height: 100%;
  }
  .infoWindow {
    width: 600px;
    height: 400px;
    background-color: #fff;
    position: absolute;
    z-index: 100;
    background-color: #bfbfbf;
    display: flex;
    flex-direction: column;
    .header {
      width: 100%;
      height: 40px;
      flex: 0 0 40px;
      line-height: 40px;
      background-color: #413249;
      display: flex;
      justify-content: space-between;
      color: #fff;
      font-size: 16px;
      padding: 0 10px;
      box-sizing: border-box;
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .infoWindowContainer {
      flex: 1;
      .infoWindowNav {
        width: 100%;
        span {
          display: inline-block;
          width: 50%;
          height: 40px;
          line-height: 40px;
          border-bottom: 2px solid #828383;
          text-align: center;
          cursor: pointer;
        }
        .choseInfoWindowNav {
          border-bottom: 2px solid #60a2ce;
          color: #60a2ce;
        }
      }
      .infoWindowFooter {
        height: 318px;
        overflow: auto;
        .ProjectBasicInfoWrapper {
          padding: 0 40px;
          line-height: 30px;
        }
        .ProjectAcceptanceInfoWrapper {
          width: 100%;
          padding: 0 10px;
          display: flex;
          box-sizing: border-box;
          flex-wrap: wrap;
          justify-content: space-between;
          p {
            flex: 0 0 280px;
            height: 30px;
            line-height: 30px;
            display: flex;
            justify-content: space-between;
            .qualified {
              color: #000;
            }
            .noQualified {
              color: #d86547;
            }
          }
        }
      }
    }
  }
}
</style>