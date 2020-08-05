<template>
  <div id="homeWrapper">

    <div class="navLeft">
      <div class="NavIconBox">
        <i class="el-icon-menu"></i>
      </div>
      <div class="navList" v-for="(item,index) in navList" :key="index" :class="{bc22:index==0}" @click="ToPage(item.path,item.id)">
        <span class="navText">{{item.text}}</span>
      </div>
    </div>
    <div class="content" v-show="contentShow">
      <div class="left">
        <Map></Map>
      </div>
      <div class="right">

        <div class="chartsWrapper">
          <el-divider content-position="left">验收完成率</el-divider>
          <div class="charts1" ref="completionEchrts1"></div>
        </div>
        <div class="chartsWrapper">
          <el-divider content-position="left">验收合格率</el-divider>
          <div class="charts2" ref="percentPassEchrts"></div>

        </div>
        <div class="chartsWrapper">
          <el-divider content-position="left">工程数量统计</el-divider>
          <div class="charts3" ref="projectsNumEchrts"></div>
        </div>
      </div>
      <div class="search">
        <el-row>
          <el-col :span="3 ">
            <span class="searchTit">选择建设工程</span>
          </el-col>
          <el-col :span="4">
            <el-select v-model="rangeValue" placeholder="昆明市" :loading="loading" clearable @focus="getRangeOptions" @change='changeRange()'>
              <el-option v-for="item in rangeOptions" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <!-- <el-input v-model="projectNameSearch" placeholder="请输入内容"></el-input> -->
            <!-- <el-select v-model="projectSearch" placeholder="选择项目">
            <el-option v-for="item in projectOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
            <el-select v-model="projectSearch" filterable remote reserve-keyword placeholder="全部需验收的工程" :remote-method="remoteMethod" :loading="loading" class='w100' clearable @focus='getProjectsOptions()'>
              <el-option v-for="item in projectOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-date-picker v-model="dataValue" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" value-format="timestamp" class="w100" @change='chosedDataValue'>
            </el-date-picker>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="onSearch()">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="statisticsBox">
        <div class="statisticsLitleBox">
          <div class="statisticsLitleBoxLeft"><img src="../../assets/imgs/index/1.png" alt=""></div>
          <div class="statisticsLitleBoxRight">
            <p>
              <span>{{num1}}</span>个</p>
            <p>报验工程总数</p>
          </div>
        </div>
        <div class="statisticsLitleBox">
          <div class="statisticsLitleBoxLeft"><img src="../../assets/imgs/index/2.png" alt=""></div>
          <div class="statisticsLitleBoxRight">
            <p>
              <span>{{num2}}</span>个</p>
            <p>验收已通过</p>
          </div>
        </div>
        <div class="statisticsLitleBox">
          <div class="statisticsLitleBoxLeft"><img src="../../assets/imgs/index/3.png" alt=""></div>
          <div class="statisticsLitleBoxRight">
            <p>
              <span>{{num3}}</span>个</p>
            <p>验收需整改</p>
          </div>
        </div>
        <div class="statisticsLitleBox">
          <div class="statisticsLitleBoxLeft"><img src="../../assets/imgs/index/4.png" alt=""></div>
          <div class="statisticsLitleBoxRight">
            <p>
              <span>{{num4}}</span>个</p>
            <p>待验收工程</p>
          </div>
        </div>
        <div class="statisticsLitleBox">
          <div class="statisticsLitleBoxLeft"><img src="../../assets/imgs/index/5.png" alt=""></div>
          <div class="statisticsLitleBoxRight">
            <p>
              <span>{{num5}}</span>个</p>
            <p>待查收消息</p>
          </div>
        </div>

      </div>
    </div>
    <div class="constructionContent" v-show="construContentShow">
      <div class="constructionContentLeft">
        <div class="constructionContentLeftTop">
          <div class="constructionSearch">
            <span class="tit">验收办理提示：</span>
            <el-select v-model="projectSearch" placeholder="全部需验收的工程" :loading="loading" clearable @focus='getProjectsOptions()'>
              <el-option v-for="item in projectOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="getHome2Data">查询</el-button>
          </div>
          <div class="steps">
            <div class="step">
              <div class="stepContent">
                <span class="round" @click="clickStep(1)" :class="{c00a0e9:stepChangeColor1}">1</span>
                <span class="line" :class="{c00a0e9Line:stepChangeColor1}"></span>
              </div>
              <div class="stepText">创建项目</div>
            </div>
            <div class="step">
              <div class="stepContent">
                <span class="round" @click="clickStep(2)" :class="{c00a0e9:stepChangeColor2}">2</span>
                <span class="line" :class="{c00a0e9Line:stepChangeColor2}"></span>
              </div>
              <div class="stepText">验收任务</div>
            </div>
            <div class="step">
              <div class="stepContent">
                <span class="round" @click="clickStep(3)" :class="{c00a0e9:stepChangeColor3}">3</span>
                <span class="line" :class="{c00a0e9Line:stepChangeColor3}"></span>
              </div>
              <div class="stepText">资料核查</div>
            </div>
            <div class="step">
              <div class="stepContent">
                <span class="round" @click="clickStep(4)" :class="{c00a0e9:stepChangeColor4}">4</span>
                <span class="line" :class="{c00a0e9Line:stepChangeColor4}"></span>
              </div>
              <div class="stepText">竣工查验</div>
            </div>
            <div class="step">
              <div class="stepContent">
                <span class="round" @click="clickStep(5)" :class="{c00a0e9:stepChangeColor5}">5</span>
                <span class="line" :class="{c00a0e9Line:stepChangeColor5}"></span>
              </div>
              <div class="stepText">消防检测</div>
            </div>
            <div class="step">
              <div class="stepContent">
                <span class="round" @click="clickStep(6)" :class="{c00a0e9:stepChangeColor6}">6</span>
              </div>
              <div class="stepText">现场评定</div>
            </div>
          </div>

          <div class="stepDescription">
            {{info}}
          </div>
        </div>
        <div class="constructionContentLeftBottom">
          <p class="lawsTit">政策法规</p>
          <div class="lawsTab">
            <div class="lawsTabTit">
              <span class="titText">标题</span>
              <span class="releaseUnit">发布单位</span>
              <span class="releaseTime">发布时间</span>
            </div>
            <div class="lawsCon">
              <div class="laws">
                <span class="titText">建设工程消防设计审查验收管理暂行规定</span>
                <span class="releaseUnit">住房和城乡建设部</span>
                <span class="releaseTime">2020-02-03 11：26</span>
              </div>
              <div class="laws">
                <span class="titText">建设工程消防设计审查验收工作细则</span>
                <span class="releaseUnit">住房和城乡建设部</span>
                <span class="releaseTime">2020-02-03 11：26</span>
              </div>
              <div class="laws">
                <span class="titText">昆明市房屋建筑和市政基础设施工程竣工联合验收工作细则（试行）</span>
                <span class="releaseUnit">昆明市住房和城乡建设局</span>
                <span class="releaseTime">2020-02-03 11：26</span>
              </div>
            </div>
            <div class="paging">
              <el-pagination background layout="prev, pager, next" :total="userTotal" :pager-count="pageCount" :page-size='userCurrentNum' :current-page.sync='userCurrentPage' @current-change='userCurrentChange'>
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="constructionContentRight">
        <div class="constructionContentRightTop">
          <el-divider content-position="left">验收完成率</el-divider>
          <div class="charts11" ref="completionEchrts11"></div>
        </div>
        <div class="constructionContentRightBottom">
          <div class="infoTit">
            <span class="infoTitText">消息通知</span>
            <div>
              <span class="infoTotal">共计
                <span> 1 </span>条</span>
              <span class="waitInfoNum">待验收
                <span class="c00a"> 0 </span>条</span>
            </div>

          </div>
          <div class="systemInfo">
            <div class="systemInfoTit">
              <div class="systemInfoText">系统通告</div>
              <div class="infoTime">2020-02-03 12：30</div>
            </div>
            <div class="info">
              <p class="infoText">
                自2020年3月9日起正式启用升级后的建设工程消防设计审查验收备案申报系统，实现建设工程消防业务全网办。系统升级后，建设单位登录市住房城乡建设局企业网上申报系统（网址：http：//kmzj.zjz01.gov.cn）填写申报信息，并上传申报材料扫描文件及具有电子签章的电子图纸，即可办理相关业务，住建部门不在收取纸质材料与图纸。建设单位在收到审批结果短信通知后，自行在申报系统打印结果文书。
              </p>
              <div class="infoPaging">
                <el-pagination background layout="prev, pager, next" :total="infoTotal" :pager-count="pageCount" :page-size='infoCurrentNum' :current-page.sync='infoCurrentPage' @current-change='infoCurrentChange'>
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mask">
      <span>建设工程消防验收</span>
    </div>

  </div>
</template>

<script>
import echarts from "echarts";
import Map from "./Map";
import {
  getPcStatisticalDto,
  getProjects,
  getProjectsRegion,
  getPcProjectsStatisticalDto,
  get6ConstructionProcess
} from "@/apis/home";
import { getYMTime, getTime, getYNumTime } from "@/utils/publictool";
import { defaults } from "lodash-es";

export default {
  components: {
    Map
  },
  data() {
    return {
      completionEchrtsOption: {},
      percentPassEchrtsOption: {},
      projectsNumEchrtsOption: {},
      text1: "", //表1显示的百分比
      text2: "", //表二显示的百分比
      projectSearch: "", //项目名称
      projectOptions: [],
      dataValue:[],
      loading: false,
      rangeValue: "", //辖区范围
      rangeOptions: [],
      navList: [
        //导航列表
        { id: 1, text: "首页", path: "/index/home", index: 0 },
        { id: 2, text: "工程项目", path: "/index/project/basicInfor" },
        { id: 3, text: "验收任务", path: "/index/acaceptTask/taskArrangement" },
        { id: 4, text: "验收记录", path: "/index/recode" },
        { id: 5, text: "验收标准", path: "/index/standard" },
        { id: 6, text: "用户管理", path: "/index/user/userManage" },
        { id: 7, text: "系统管理", path: "" }
      ],
      userCurrentPage: 1, //当前页
      userCurrentNum: 10, //每页显示条数
      pageCount: 5, // 按钮数
      userTotal: 0, //总条数
      infoCurrentPage: 1, //当前页
      infoCurrentNum: 1, //每页显示条数
      pageCount: 5, // 按钮数
      infoTotal: 0, //总条数
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0,
      num5: 0,
      contentShow: true, //除建设以外显示的首页1
      construContentShow: false, //建设显示的首页2
      info: "请在系统的【工程项目】中创建报验工程的“基本信息”和“验收内容”。",
      // searchFlag:'',
      constructionProcessDto: [], // 查询回来的数据（6步）
      stepChangeColor1: false,
      stepChangeColor2: false,
      stepChangeColor3: false,
      stepChangeColor4: false,
      stepChangeColor5: false,
      stepChangeColor6: false,
      //时间选择器
      dataFlag: true
    };
  },
  created() {},
  mounted() {
    this.getData();
    this.getRoleShow();
    // this.getProjectsOptions();
    // console.log(this.$store.state)
    this.$store.commit("changeCindex", 0);
  },
  methods: {
    //权限显示
    getRoleShow() {
      if (
        this.$store.state.userRole.roleCode == 600 ||
        this.$store.state.userRole.roleCode == 650 ||
        this.$store.state.userRole.roleCode == 800 ||
        this.$store.state.userRole.roleCode == 850 ||
        this.$store.state.userRole.roleCode == 400 ||
        this.$store.state.userRole.roleCode == 450
      ) {
        this.navList = [
          //导航列表
          { id: 1, text: "首页", path: "/index/home", index: 0 },
          { id: 2, text: "工程项目", path: "/index/project/basicInfor" },
          {
            id: 3,
            text: "验收任务",
            path: "/index/acaceptTask/taskArrangement"
          },
          { id: 4, text: "验收记录", path: "/index/recode" },
          // { id:5, text: "验收标准", path: "/index/standard" },
          { id: 6, text: "用户管理", path: "/index/user/userManage" },
          { id: 7, text: "系统管理", path: "" }
        ];
      } else if (
        this.$store.state.userRole.roleCode == 500 ||
        this.$store.state.userRole.roleCode == 700 ||
        this.$store.state.userRole.roleCode == 900
      ) {
        this.navList = [
          //导航列表
          { id: 1, text: "首页", path: "/index/home", index: 0 },
          { id: 2, text: "工程项目", path: "/index/project/basicInfor" },
          {
            id: 3,
            text: "验收任务",
            path: "/index/acaceptTask/taskArrangement"
          },
          { id: 4, text: "验收记录", path: "/index/recode" },
          // { id:5, text: "验收标准", path: "/index/standard" },
          // { id: 6, text: "用户管理", path: "/index/user/userManage" },
          { id: 7, text: "系统管理", path: "" }
        ];
      } else {
        this.navList = [
          //导航列表
          { id: 1, text: "首页", path: "/index/home", index: 0 },
          { id: 2, text: "工程项目", path: "/index/project/basicInfor" },
          {
            id: 3,
            text: "验收任务",
            path: "/index/acaceptTask/taskArrangement"
          },
          { id: 4, text: "验收记录", path: "/index/recode" },
          { id: 5, text: "验收标准", path: "/index/standard" },
          { id: 6, text: "用户管理", path: "/index/user/userManage" },
          { id: 7, text: "系统管理", path: "" }
        ];
      }

      if (
        this.$store.state.userRole.roleCode == 600 ||
        this.$store.state.userRole.roleCode == 650 ||
        this.$store.state.userRole.roleCode == 700
      ) {
        this.construContentShow = true;
        this.contentShow = false;
        this.getCharts2();
      } else {
        this.getFourData();
        this.getCharts();
        this.$store.commit("filterMarkers", {
           projectSearch: this.projectSearch,
          rangeValue: this.rangeValue.toString(),
          time: this.dataValue
        });
      }
    },
    // 模糊查询
    remoteMethod(query) {
      this.getProjectsOptions(query);
    },
    getCharts() {
      // 完成率
      this.chart1 = echarts.init(this.$refs.completionEchrts1);
      // 使用刚指定的配置项和数据显示图表。
      this.chart1.setOption(this.completionEchrtsOption);
      //合格率
      this.chart2 = echarts.init(this.$refs.percentPassEchrts);
      this.chart2.setOption(this.percentPassEchrtsOption);
      //验收项目数量
      this.chart3 = echarts.init(this.$refs.projectsNumEchrts);
      this.chart3.setOption(this.projectsNumEchrtsOption);
    },
    getCharts2() {
      this.chart11 = echarts.init(this.$refs.completionEchrts11);
      // 使用刚指定的配置项和数据显示图表。
      this.chart11.setOption(this.completionEchrtsOption);
    },
    //获取报表数据
    getData(projectId = "", regionId = "", startTime = null, endTime = null) {
      getPcStatisticalDto({ projectId, regionId, startTime, endTime })
        .then(res => {
          if (res.httpStatus == 200) {
            console.log(res);
            let {
              qualifiedProbabilityDto, // 验收合格率
              timeCompletionProbabilityDto, //项目总数
              totalCompletionProbabilityDto //完成率
            } = res.result.result.evaluationStatisticalDto;
            let op1 = [
              {
                value: totalCompletionProbabilityDto.finishTasks,
                name: "完成"
              },
              {
                value:
                  totalCompletionProbabilityDto.totalTasks -
                  totalCompletionProbabilityDto.finishTasks,
                name: "未完成"
              }
            ];
            if (totalCompletionProbabilityDto.totalTasks <= 0) {
              this.text1 = "0%";
            } else {
              this.text1 =
                Math.ceil(
                  totalCompletionProbabilityDto.finishTasks /
                    totalCompletionProbabilityDto.totalTasks *
                    100
                ) + "%";
            }

            if (
              this.$store.state.userRole.roleCode == 600 ||
              this.$store.state.userRole.roleCode == 650 ||
              this.$store.state.userRole.roleCode == 700
            ) {
              this.chart11.clear();
              this.chart11.setOption(this.getCompletionEchrtsOption(op1));
            } else {
              this.chart1.clear();
              this.chart1.setOption(this.getCompletionEchrtsOption(op1));
              let op2 = [
                {
                  value: qualifiedProbabilityDto.qualifiedPassesNum,
                  name: "合格"
                },
                {
                  value: qualifiedProbabilityDto.qualifiedNonPassesNum,
                  name: "不合格"
                }
              ];
              if (
                qualifiedProbabilityDto.qualifiedPassesNum +
                  qualifiedProbabilityDto.qualifiedNonPassesNum <=
                0
              ) {
                this.text2 = "0%";
              } else {
                this.text2 =
                  Math.ceil(
                    qualifiedProbabilityDto.qualifiedPassesNum /
                      (qualifiedProbabilityDto.qualifiedPassesNum +
                        qualifiedProbabilityDto.qualifiedNonPassesNum) *
                      100
                  ) + "%";
              }

              this.chart2.clear();
              this.chart2.setOption(this.getPercentPassEchrtsOption(op2));
              console.log(timeCompletionProbabilityDto.timeCompletionDtos);
              let op3 = timeCompletionProbabilityDto.timeCompletionDtos.sort(
                function(a, b) {
                  return a.startTime - b.startTime;
                }
              );
              // 搜索的时间回填
              this.dataValue = [
                op3[0].startTime,
                op3[op3.length - 1].startTime
              ];

              let dateArr = op3.map(item => {
                return getYMTime(item.startTime);
              });
              let finishData = op3.map(item => {
                return item.finishTasks;
              });
              let totalData = op3.map(item => {
                return item.totalTasks;
              });
              this.chart3.clear();
              this.chart3.setOption(
                this.getProjectsNumEchrtsOption(dateArr, finishData, totalData)
              );
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "warning",
            message: "报表暂无数据"
          });
        });
    },
    //获取验收完成率的option
    getCompletionEchrtsOption(data) {
      this.completionEchrtsOption = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        title: {
          text: this.text1,
          x: "center",
          y: "center",
          textStyle: {
            fontSize: 30,
            // color: "#fff",
            fontWeight: "800"
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: true,
            label: {
              show: false
              // position: "center"
            },
            labelLine: {
              show: false
            },
            color: ["#C4BCBA", "#E68143"],

            data: data
            // data: []
          }
        ]
      };
      return this.completionEchrtsOption;
    },
    //获取合格率的option
    getPercentPassEchrtsOption(data) {
      this.percentPassEchrtsOption = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        //   orient: "vertical",
        //   left: 10,
        //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        // },
        title: {
          text: this.text2,
          x: "center",
          y: "center",
          textStyle: {
            fontSize: 30,
            // color: "#fff",
            fontWeight: "800"
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: true,
            label: {
              show: false
              // position: "center"
            },
            emphasis: {
              // label: {
              //   show: true,
              //   fontSize: "30",
              //   fontWeight: "bold"
              // }
            },
            labelLine: {
              show: false
            },
            color: ["#8B8A8F", "#65BA8A"],

            data: data
          }
        ]
      };
      return this.percentPassEchrtsOption;
    },
    //获取验收数量的option
    getProjectsNumEchrtsOption(a, b, c) {
      this.projectsNumEchrtsOption = {
        title: {
          text: "Biu~简单柱状图示例",
          show: false
        },
        grid: {
          x: "10%", //x 偏移量
          y: "35px", // y 偏移量
          width: "85%", // 宽度
          height: "70%" // 高度
        },
        // tooltip: {},
        legend: {
          //图例
          data: ["总数", "完成数"], //与series的name对应
          left: "80%", //图例的位置，可以用像素，可以用百分比，也可以用center，right等
          show: true,
          top: -5, //图例的位置
          itemWidth: 10, //图例图标的宽
          itemHeight: 5, //图例图标的高
          textStyle: {
            color: "#878787" //值的具体的颜色
          }
        },
        xAxis: {
          data: a,
          type: "category",
          splitLine: { show: false }, //去除网格分割线
          // splitArea: {show: true},//保留网格区域
          axisLine: {
            //坐标线
            lineStyle: {
              type: "solid",
              color: "#06bec9", //轴线的颜色
              width: "1" //坐标线的宽度
            }
          },
          axisTick: {
            //刻度
            show: false //不显示刻度线
          },
          //   axisLine:{
          //     symbol : ['none', 'arrow']
          //   },
          axisLabel: {
            textStyle: {
              color: "#06bec9" //坐标值的具体的颜色
            }
          }
          // splitLine: {
          //   show: false //去掉分割线
          // }
          //   offset:'2px'
        },
        yAxis: {
          // data:['0','5','10','15','20']
          //   name: "单位：次", //轴的名字，默认位置在y轴上方显示
          //   max: 30, //最大刻度
          type: "value",
          axisLine: {
            //线
            lineStyle: {
              type: "solid",
              color: "#06bec9", //轴线的颜色
              width: "1" //坐标线的宽度
            }
            //  symbol : ['none', 'arrow']
          },
          axisTick: {
            //刻度
            show: false,
            inside: true
          },
          axisLabel: {
            textStyle: {
              color: "#06bec9" //坐标值得具体的颜色
            }
          },
          minInterval: 10, //标值的最小间隔
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "总数",
            type: "bar",
            data: c,
            color: "#006dfd",
            itemStyle: {
              normal: {
                label: {
                  show: true, //柱子上显示值
                  position: "top", //值在柱子上方显示
                  textStyle: {
                    color: "#fff" //值得颜色
                  }
                }
              }
            },
            barWidth: 10 //设置柱子宽度，单位为px
          },
          {
            name: "完成数",
            type: "bar",
            data: b,
            color: "#00c1ff",
            // color: "#000",
            itemStyle: {
              normal: {
                label: {
                  show: true, //柱子上显示值
                  position: "top", //值在柱子上方显示
                  textStyle: {
                    color: "#fff" //值得颜色
                  }
                }
              }
            },
            barWidth: 10 //设置柱子宽度，单位为px
          }
        ]
      };
      return this.projectsNumEchrtsOption;
    },
    //获取项目列表
    getProjectsOptions(name = "") {
      getProjects({ name, regionId: this.rangeValue })
        .then(res => {
          // if (res.result.length > 0) {
          //   this.$store.commit("chosedProjectId", res.result[0]);
          // }
          console.log(res);
          if (res.httpStatus == 200) {
            this.projectOptions = res.result.map(item => {
              return {
                label: item.projectName,
                value: item.projectId
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
    },
    // 获取辖区列表
    getRangeOptions() {
      getProjectsRegion()
        .then(res => {
          if (res.httpStatus == 200) {
            this.rangeOptions = res.result;
          }
          // console.log(res)
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err
          });
        });
    },
  //选中区域清空项目
    changeRange(){
      this.projectSearch = ''
    },
    // 时间选择器
    chosedDataValue() {
      //  console.log(this.dataValue)
      this.dataFlag = true;
      if (this.dataValue) {
        let date = new Date().getTime();
        this.dataValue.forEach(item => {
          console.log(getTime(item));
          if (item > date) {
            this.dataFlag = false;
            this.$message({
              type: "info",
              message: "请选择有效时间"
            });
          }
        });
        if (!this.dataFlag) return;
        // console.log(getYNumTime(this.dataValue[1]) - getYNumTime(this.dataValue[0]))
        if (
          getYNumTime(this.dataValue[1]) - getYNumTime(this.dataValue[0]) >=
          6
        ) {
          this.$message({
            type: "info",
            message: "选择时间间隔不能大于6个月，请重新选择"
          });
          this.dataFlag = false;
        }
      }
    },
    // 条件搜索
    onSearch() {
      // console.log(this.rangeValue)
      // if(data)
      if (this.dataFlag) {
        // if(this.dataValue)1
        // if (this.projectSearch) {
        //   this.$store.commit("filterMarkers", this.projectSearch + "_项目");
        // } else {
        //   if (this.rangeValue) {
        //     // let region
        //     this.$store.commit("filterMarkers", this.rangeValue.toString());
        //   } else {
        //     this.$store.commit("filterMarkers", "");
        //   }
        // }
        if (!this.dataValue) {
          this.dataValue = [];
        }
        this.$store.commit("filterMarkers", {
          projectSearch: this.projectSearch,
          rangeValue: this.rangeValue.toString(),
          time: this.dataValue
        });

        this.getData(
          this.projectSearch,
          this.rangeValue,
          this.dataValue[0],
          this.dataValue[1]
        );
        this.getFourData(
          this.projectSearch,
          this.rangeValue,
          this.dataValue[0],
          this.dataValue[1]
        );
      } else {
        this.$message({
          type: "info",
          message: "请选择有效时间"
        });
      }
    },
    //点击步骤条
    clickStep(num) {
      console.log(num);
      if (this.constructionProcessDto.length <= 0) {
        // console.log("没有项目");
        switch (num) {
          case 1:
            this.info =
              "请在系统的【工程项目】中创建报验工程的“基本信息”和“验收内容”。";
            break;
          case 2:
            this.info =
              "请在系统的【验收任务】中选择需要安排的任务，明确验收内容、适用标准，指定具体的任务执行人。";
            break;
          case 3:
            this.info =
              "请验收人员登录APP，按要求开展竣工资料核查，现场填写的验收记录同步在【验收记录】显示。";
            break;
          case 4:
            this.info =
              "请验收人员登录APP，按要求开展竣工验收消防查验，现场填写的验收记录同步在【验收记录】显示。";
            break;
          case 5:
            this.info =
              "请检测人员登录APP，按要求开展消防设施检测，现场填写的验收记录同步在【验收记录】显示。";
            break;
          default:
            this.info =
              "请联系“昆明市建设工程质量安全监督管理总站 杨某某 13577899123”，告知已具备现场评定条件，请安排现场评定。";
        }
      } else {
        // console.log("有项目");
        // console.log(this.constructionProcessDto);
        switch (num) {
          case 1:
            if (this.constructionProcessDto[0].selected) {
              this.info = `${getTime(
                this.constructionProcessDto[0].time
              )} 用户（${
                this.constructionProcessDto[0].username
              }）在系统中创建了报验工程的信息，请确保信息内容准确、完善。`;
            } else {
              this.info =
                "请在系统的【工程项目】中创建报验工程的“基本信息”和“验收内容”。";
            }
            break;
          case 2:
            if (this.constructionProcessDto[1].selected) {
              this.info = `${getTime(
                this.constructionProcessDto[1].time
              )} 用户（${
                this.constructionProcessDto[1].username
              }）在系统中安排了验收任务，请执行人登录APP按要求验收。`;
            } else {
              this.info =
                "请在系统的【验收任务】中选择需要安排的任务，明确验收内容、适用标准，指定具体的任务执行人";
            }
            break;
          case 3:
            if (this.constructionProcessDto[2].selected) {
              this.info = `${getTime(
                this.constructionProcessDto[2].time
              )} 用户（${
                this.constructionProcessDto[2].username
              }）在系统中确认“资料核查”工作完成，请责任人检查确认。`;
            } else {
              this.info =
                "请验收人员登录APP，按要求开展竣工资料核查，并据实填写验收记录。";
            }
            break;
          case 4:
            if (this.constructionProcessDto[3].selected) {
              this.info = `${getTime(
                this.constructionProcessDto[3].time
              )} 用户（${
                this.constructionProcessDto[3].username
              }）在系统中确认“竣工查验”工作完成，请责任人检查确认。`;
            } else {
              this.info =
                "请验收人员登录APP，按要求开展竣工验收消防查验，并据实填写验收记录。";
            }
            break;
          case 5:
            if (this.constructionProcessDto[4].selected) {
              this.info = `${getTime(
                this.constructionProcessDto[4].time
              )} 用户（${
                this.constructionProcessDto[4].username
              }）在系统中确认“消防检测”工作完成，请责任人检查确认`;
            } else {
              this.info =
                "请检测人员登录APP，按要求开展消防设施检测，并据实填写检测记录。";
            }
            break;
          default:
            if (this.constructionProcessDto[5].selected) {
              this.info = `${getTime(
                this.constructionProcessDto[5].time
              )} 用户（${
                this.constructionProcessDto[5].username
              }）在系统中确认“现场评定”工作完成，评定结论为“合格”。`;
            } else {
              // console.log(this.constructionProcessDto)
              this.info =
                `请联系“${this.constructionProcessDto[5].username}”，告知已具备现场评定条件，请安排现场评定。`;
            }
        }
      }
    },
    // 切换页码
    userCurrentChange(val) {
      // this.getUserLsit(val);
    },
    // 切换信息页码
    infoCurrentChange(val) {
      // this.getUserLsit(val);
    },
    //获取4项
    getFourData(
      projectId = "",
      regionId = "",
      startTime = null,
      endTime = null
    ) {
      getPcProjectsStatisticalDto({
        projectId,
        regionId,
        startTime,
        endTime
      })
        .then(res => {
          if (res.httpStatus == 200) {
            this.num1 = res.result.result.totalNums;
            this.num2 = res.result.result.passNums;
            this.num3 = res.result.result.noPassNums;
            this.num4 =
              res.result.result.totalNums - res.result.result.finishNums;
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: err
          });
        });
    },
    //页面跳转
    ToPage(path, i) {
      this.$store.commit("changeCindex", 0);
      this.$store.commit("changeCindex", i);
      this.$router.history.push(path);
    },
    //查询首页2数据
    getHome2Data() {
      this.getData(this.projectSearch);
      this.getHome2Data6(this.projectSearch);
      // console.log(this.projectSearch)
    },
    getHome2Data6(projectId) {
      this.constructionProcessDto = [];
      get6ConstructionProcess({ projectId })
        .then(res => {
          // console.log(res)
          if (res.httpStatus == 200) {
            this.constructionProcessDto =
              res.result.result.constructionProcessDto;
            res.result.result.constructionProcessDto.forEach(item => {
              if (item.index == 1) {
                if (item.selected) {
                  this.stepChangeColor1 = true;
                } else {
                  this.stepChangeColor1 = false;
                }
              } else if (item.index == 2) {
                if (item.selected) {
                  this.stepChangeColor2 = true;
                } else {
                  this.stepChangeColor2 = false;
                }
              } else if (item.index == 3) {
                if (item.selected) {
                  this.stepChangeColor3 = true;
                } else {
                  this.stepChangeColor3 = false;
                }
              } else if (item.index == 4) {
                if (item.selected) {
                  this.stepChangeColor4 = true;
                } else {
                  this.stepChangeColor4 = false;
                }
              } else if (item.index == 5) {
                if (item.selected) {
                  this.stepChangeColor5 = true;
                } else {
                  this.stepChangeColor5 = false;
                }
              } else if (item.index == 6) {
                if (item.selected) {
                  this.stepChangeColor6 = true;
                } else {
                  this.stepChangeColor6 = false;
                }
              }
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
  }
};
</script>

<style lang="less" >
#homeWrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  box-sizing: border-box;
  .navLeft {
    flex: 0 0 250px;
    background-color: #01162b;
    color: #fff;
    .NavIconBox {
      height: 40px;
      line-height: 40px;
      font-size: 24px;
      text-indent: 10px;
    }
    .NavIconBox:hover {
      cursor: pointer;
    }

    .navList {
      height: 60px;
      line-height: 60px;
      text-indent: 40px;
      .navText {
      }
    }
    .navList:hover {
      cursor: pointer;
      background-color: #322c3a;
    }
    .bc22 {
      background-color: #322c3a;
    }
  }
  .content {
    // display: none;
    flex: 1;
    display: flex;
    padding: 220px 10px 10px;
    position: relative;
    box-sizing: border-box;
    .statisticsBox {
      // width: 100%;
      height: 120px;
      padding: 0 10px;
      position: absolute;
      // left: 10px;
      top: 80px;
      display: flex;
      & > div:first-child {
        background-color: #57b8e9;
      }
      & > div:nth-child(2) {
        background-color: #6c5fa8;
      }
      & > div:nth-child(3) {
        background-color: #e94e50;
      }
      & > div:nth-child(4) {
        background-color: #f39500;
      }
      & > div:nth-child(5) {
        background-color: #646c78;
      }
      .statisticsLitleBox {
        margin-left: 20px;
        width: 300px;
        height: 100%;
        // border: 1px solid red;
        box-sizing: border-box;
        padding: 20px 0;
        display: flex;
        border-radius: 10px;
        .statisticsLitleBoxLeft {
          flex: 0 0 120px;
          border-right: 2px solid #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
          }
        }
        .statisticsLitleBoxRight {
          flex: 1;
          color: #fff;
          text-align: center;

          span {
            font-size: 28px;
            line-height: 48px;
          }
        }
      }
    }
    .left {
      // width: 100%;
      // height: 100%;
      flex: 1;
    }
    .right {
      // padding:200px 0 10px 0;
      margin-left: 10px;
      flex: 0 0 300px;
      box-sizing: border-box;
      // color: #fff;
      .chartsWrapper {
        width: 100%;
        box-sizing: border-box;
        height: 33.3%;
        display: flex;
        flex-direction: column;
        .el-divider {
          margin: 10px 0;
          // background-color: #000;
          .el-divider__text.is-left {
            left: 0;
            padding: 0 8px;
            font-size: 16px;
          }
        }
        .charts1,
        .charts2,
        .charts3 {
          flex: 1;
        }
      }
    }
    .search {
      width: 1000px;
      position: absolute;
      left: 50px;
      top: 20px;
      z-index: 100;
      .searchTit {
        font-size: 20px;
        line-height: 40px;
        color: #00a0e9;
      }
      .el-col {
        margin-left: 2px;
      }
      .el-button {
        margin-left: 20px;
      }
      // width: ;
    }
    .w100 {
      width: 100%;
    }
  }
  .constructionContent {
    flex: 1;
    background-color: #eeefef;
    display: flex;
    padding: 10px 0 10px 10px;
    .constructionContentLeft {
      flex: 1;
      display: flex;
      flex-direction: column;
      .constructionContentLeftTop {
        width: 100%;
        flex: 0 0 400px;
        background-color: #fff;
        .constructionSearch {
          margin: 20px 0 0 40px;
          .tit {
            color: #00a0e9;
            font-size: 18px;
          }
          .el-select {
            width: 280px;
          }
          .el-button {
            margin-left: 10px;
          }
        }
        .steps {
          padding: 60px 0 60px 40px;
          display: flex;
          justify-content: center;
          .step {
            flex: 0 0 140px;
            .stepContent {
              position: relative;
              span {
                display: inline-block;
                // padding: 10px;
              }
              .round {
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 40px;
                border: 1px solid #ccc;
                font-size: 20px;
              }
              .line {
                width: 100px;
                border-bottom: 4px solid #ccc;
                position: absolute;
                left: 41px;
                top: 20px;
              }
            }
            .stepText {
              line-height: 30px;
            }
          }
          .step:hover {
            cursor: pointer;
          }
          .c00a0e9 {
            color: #00a0e9;
            border: 1px solid #00a0e9 !important;
          }
          .c00a0e9Line {
            border-bottom: 4px solid #00a0e9 !important;
          }
        }
        .stepDescription {
          padding: 0 0 0 40px;
        }
      }
      .constructionContentLeftBottom {
        flex: 1;
        margin-top: 10px;
        background-color: #fff;
        .lawsTit {
          line-height: 40px;
          color: #00a0e9;
          text-indent: 20px;
          font-size: 18px;
        }
        .lawsTab {
          .lawsTabTit {
            background-color: #ecf7fd;
            span {
              // text-align: center;
              text-indent: 50px;
            }
          }
          .lawsTabTit,
          .laws {
            line-height: 40px;
            display: flex;
            span {
              display: inline-block;
            }
            .titText {
              flex: 1;
            }
            .releaseUnit {
              flex: 0 0 250px;
            }
            .releaseTime {
              flex: 0 0 180px;
              padding-right: 20px;
            }
          }
          .lawsCon {
            & > .laws:nth-child(2n) {
              background-color: #fcfcfc;
            }
            .laws {
              & > span:first-child {
                text-indent: 30px;
              }
            }
          }
          .paging {
            text-align: center;
            margin-top: 30px;
          }
        }
      }
    }
    .constructionContentRight {
      flex: 0 0 400px;
      margin-left: 10px;
      // background-color: #fff;
      display: flex;
      flex-direction: column;
      .constructionContentRightTop {
        width: 100%;
        flex: 0 0 400px;
        background-color: #fff;
        .el-divider {
          .el-divider__text {
            font-size: 18px;
            color: #00a0e9;
          }
        }
        .charts11 {
          // width: 100%;
          width: 400px;
          height: 300px;
        }
      }
      .constructionContentRightBottom {
        flex: 1;
        margin-top: 10px;
        background-color: #fff;
        .infoTit {
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          line-height: 40px;
          border-bottom: 2px solid #ccc;
          .infoTitText {
            font-size: 18px;
            color: #00a0e9;
          }
          & > div {
            .infoTotal {
              margin-right: 10px;
            }
          }
          .c00a {
            color: #00a0e9;
          }
        }
        .systemInfo {
          .systemInfoTit {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            line-height: 60px;
            // div{
            //   width: 100px;
            // }
          }
          .info {
            padding: 0 10px;
            position: relative;
            .infoText {
              text-indent: 30px;
              height: 250px;
              overflow: hidden;
              line-height: 26px;
            }
            .infoPaging {
              position: absolute;
              bottom: -40px;
              // width: 100%;
              left: 140px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .mask {
    width: 100%;
    height: 80px;
    background-color: #01162b;
    position: absolute;
    left: 0;
    top: -80px;
    color: #fff;
    font-size: 28px;
    line-height: 80px;
    text-indent: 40px;
    border-bottom: 2px solid #808080;
  }
}
</style>