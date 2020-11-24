<!--业务报警-->
<template>
  <section class="driver-alarm">
    <div class="content-wrap">
      <!-- <el-row>
		  <el-col :span="3" class="alarm-type">
		  	<el-tabs v-model="alarmType" tab-position="left" @tab-click="handleAlarmType" style="height:100%">
		  		<el-tab-pane :label="'业务报警('+alarmTotal+')'" name="all"></el-tab-pane>
			    <el-tab-pane v-for="(item) in alarms" :key="item.id" :label="item.name+'('+item.num+')'" :name="item.id"></el-tab-pane>
			  </el-tabs>
		  </el-col> -->
      <ul class="menu">
        <li v-for="(item,index) in alarms" :key="item.alarmTypeId" :class="{ active:activeBg == item.alarmTypeId}" @click="selectAlarm(item)">{{item.alarmTypeName}}({{item.vehicleCount}})
        </li>
      </ul>
      <div class="right-content">
        <el-tabs v-model="activeType" @tab-click="handleTabType" lazy>
          <el-tab-pane label="实时报警" name="nowAlarm">
            <!--搜索-->
            <el-form :inline="true" :model="searchForm" class="demo-form-inline marg-left10">
              <el-form-item>
                <el-select v-model="searchForm.vehicleNo" size="mini" filterable placeholder="请选择车牌号码">
                  <el-option v-for="item in vehicleNoList"  :key="item.id"
                             :label="item.registrationNo"
                             :value="item.vehicleId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="timeSwitch" @change="changeCheckBox">禁止刷新</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button class="operate-btn" type="primary" size="mini" @click="getAlarmInfo">查询</el-button>
                <el-button class="operate-btn" type="primary" size="mini" @click="showPolice1" :disabled="multipleSelection.length>0?false:true">处警</el-button>
                <el-button class="operate-btn" type="primary" size="mini" @click="handleSentText1" :disabled="multipleSelection.length>0?false:true">文本下发</el-button>
              </el-form-item>
            </el-form>
            <div ref="table" class="table-info">
            <myTable
              :bodyData="alarmTable.bodyData"
              :headData="alarmTable.headData"
              :optionWidth="250"
              :ishasCheckbox="true"
              :pageSize="pageSize"
              :totalPage="totalPage"
              :currentPage="currentPage"
              :loading="loading"
              @checkBoxchange="handleSelectionChange"
              @sizeChange="nowSizeChange"
              @currentChange="nowCurrentChange"
               >
              <template slot-scope="scope">
                <el-button type="text" @click.stop.prevent="showPolice2(scope.data.row)" size="mini">处警</el-button>
                <el-button type="text" @click.stop.prevent="handleSentText2(scope.data.row)" size="mini">文本下发</el-button>
                <el-button type="text" @click.stop.prevent="openInterphone(scope.data.row)" size="mini">打开对讲</el-button>
                <el-button type="text" @click.stop.prevent="goToMap(scope.data.row)" size="mini">地图</el-button>
              </template>
            </myTable>
            </div>
          </el-tab-pane>
          <el-tab-pane label="今日报警" name="toDayAlarm" class="display-flex flex-column">
            <div class="todayForm">
              <el-form :inline="true" class="demo-form-inline marg-left10">
                <el-form-item>
                  <el-select v-model="todayAlarmForm.alarmType" size="mini" filterable placeholder="请选择报警类型">
                    <el-option v-for="item in alarmsSelect" :key="item.alarmTypeId" :label="item.alarmTypeName" :value="item.alarmTypeId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="handleTodaySearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="alarmShow flex1 display-flex flex-column">
              <div class="flex1">
                <div class="chart" id="alarmChart" ref="creatChart"></div>
              </div>
              <div class="tableShow flex1 marg-top20">
                <myTable
                  :bodyData="todayTable.bodyData"
                  :headData="todayTable.headData"
                  :isNeedOperate="false"
                  :pageSize="todayTable.pageSize"
                  :totalPage="todayTable.totalPage"
                  :currentPage="todayTable.currentPage"
                  :loading="todayTable.loading"
                  @sizeChange="todaySizeChange"
                  @currentChange="todayCurrentChange"
                  v-if="activeType ==='toDayAlarm'"
                  >
                </myTable>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--批量报警处理-->
    <el-dialog :title="policeType?'批量报警处理':'报警处理'" :visible.sync="policeVisible" width="40%" class="doPolice">
      <el-table size="mini" :data="policeType?multipleSelection:police" tooltip-effect="dark" max-height="150" style="width: 100%;margin-bottom: 10px;">
        <el-table-column label="车牌号" prop="registrationNo" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="自编号" prop="mySelfNo" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="vehicleTeamName" label="车队" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmSourceId" label="报警来源" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmTypeName" label="报警类型" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="content" label="报警内容" min-width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="alarmTime" label="报警时间" min-width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="speed" label="速度（km/h）" min-width="100" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-form :inline="true" :model="policeForm" class="demo-form-inline">
        <el-form-item label="报警类型" style="width:100%;" class="marg-top20" v-if="!policeType">
          <el-input v-model="policeForm.alarmType" disabled></el-input>
        </el-form-item>
        <el-form-item label="处理过程" style="width:100%;" class="marg-top20">
          <el-input type="textarea" :rows="2" style="width:490px;" v-model="policeForm.process" placeholder="请输入处理过程"></el-input>
        </el-form-item>
        <el-form-item label="处理结果" class="marg-top20">
          <el-select v-model="policeForm.result">
            <el-option label="真报警" value="真报警"></el-option>
            <el-option label="假报警" value="假报警"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人" class="marg-top20">
          <el-input v-model="policeForm.user" disabled></el-input>
        </el-form-item>
        <el-form-item label="处理时间" class="marg-top20">
          <el-input v-model="policeForm.time" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
		    <el-button @click="policeVisible = false" size="mini">取 消</el-button>
		    <el-button type="primary" @click="handleMultPolice" size="mini">处警</el-button>
		  </span>
    </el-dialog>
    <!--多车文本下发-->
    <el-dialog :title="sendTextType==0?'多车文本下发':'文本下发'" :visible.sync="sendTextVisible" width="50%" class="doText">
      <el-input type="textarea" :rows="5" v-model="sendTextContent" placeholder="请输入文本下发指令"></el-input>
      <span slot="footer" class="dialog-footer">
		    <el-button @click="sendTextVisible = false" size="mini">取 消</el-button>
		    <el-button type="primary" @click="handleMultSendText" size="mini">下发指令</el-button>
		  </span>
    </el-dialog>
    <!--查看证据-->
    <el-dialog title="查看证据" :visible.sync="evidenceVisible" width="1000px" class="evidence-dialog">
      <div class="information">
        车牌号：{{evidence.vehicleNo}}&nbsp;
        司机姓名：&nbsp;
        报警类型：{{evidence.alarmType}}&nbsp;
        报警时间：{{evidence.time}}&nbsp;
        报警地点：<div class="address" :title="evidence.address">{{evidence.address}}</div>
        <el-button type="primary" size="mini">下载</el-button>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col class="evidence-item" :span="11">
          <div class="item-content">
            <div class="evidence-item-title">
              不规范驾驶图片&nbsp;&nbsp;
              视觉角度：
              <el-select v-model="evidence.evidencePic" placeholder="请选择" @change="changePic()" size="mini">
                <el-option label="司机角度" value="0"> </el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col class="evidence-item" :span="11">
          <div class="item-content">
            <div class="evidence-item-title">
              不规范驾驶视频&nbsp;&nbsp;
              视觉角度：
              <el-select v-model="evidence.evidenceVideo" placeholder="请选择" @change="changeVideo()" size="mini">
                <el-option label="司机角度" value="0"> </el-option>
              </el-select>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col class="evidence-item" :span="11">
          <div class="item-content">
            <div class="evidence-item-title">车载视频</div>
          </div>
        </el-col>
        <el-col class="evidence-item" :span="11">
          <div class="item-content">地图</div>
        </el-col>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import myTable from '../../../components/table/table.vue';
import {mapGetters} from 'vuex';
import {util} from '../../../util/util';
import AMap from 'AMap';
const TIME = 30 * 1000;
const alarmTypeUrl = 'gateway/businessAlarm/alarmTypeList';
const alarmInfoUrl = 'gateway/businessAlarm/alarmInfoGroup';
const todayAlarmBarUrl = 'alarm/businessAlarm/todayAlarmHourGroup';
const todayAlarmTableUrl = 'alarm/businessAlarm/todayAlarmHourDetail';
 const doPoliceUrl = 'gateway/alarmHandle/handle';  // 处警
const textSendUrl = '/command/command/batchSendCommand';  // 文本下发
const getRegistrationNoUrl = '/sys/vehicle/queryAuthVehiclesByUserId';  // 权限下的车辆
export default {
  data () {
    return {
      vehicleIdList: [],
      timeSwitch: true,  // 是否定时刷新
      totalPage: 0,
      pageSize: 20,
      currentPage: 1,
      todayTable: {
        startTime: '',
        endTime: '',
        totalPage: 0,
        pageSize: 20,
        currentPage: 1,
        loading: false,
        headData: [
          {
            prop: 'registrationNo',
            label: '车牌号',
            width: 100
          },
          {
            prop: 'internalNumber',
            label: '自编号',
            width: 100
          },
          {
            prop: 'vehicleTeamName',
            label: '车队',
            width: 100
          },
          {
            prop: 'alarmTypeName',
            label: '报警类型',
            width: 100
          },
          {
            prop: 'alarmInfo',
            label: '报警说明',
            width: 100
          },
          {
            prop: 'alarmTime',
            label: '最新报警时间',
            width: 100
          }
        ],
        bodyData: []
      },
      loading: false,
      alarms: [], // 报警列表
      alarmsSelect: [], // 报警下拉框
      activeBg: 0,
      alarmTotal: 99,
      selectedItem: -1,
      activeType: 'nowAlarm',
      alarmType: 'all', // 报警类型tab
      searchForm: {
        vehicleNo: ''
      },
      vehicleNoList: [],
      alarmTable: {
        headData: [{
            prop: 'registrationNo',
            label: '车牌号'
          },
          {
            prop: 'mySelfNo',
            label: '自编号'
          },
          {
            prop: 'vehicleTeamName',
            label: '车队'
          },
          {
            prop: 'alarmTypeName',
            label: '报警类型'
          },
          {
            prop: 'alarmSourceId',
            label: '报警来源'
          },
          {
            prop: 'alarmTime',
            label: '最新报警时间'
          },
          {
            prop: 'speed',
            label: '速度'
          },
          {
            prop: 'address',
            label: '位置'
          }
        ],
        bodyData: []
      },
      multipleSelection: [], // 选中表格
      doPoliceParams: [],
      sendTextParams: [],
      policeVisible: false, // 批量报警处理对话框
      sendTextVisible: false, // 多车文本下发对话框
      evidenceVisible: false, // 查看证据对话框
      policeType: true, // true批量报警处理，false单条报警处理
      sendTextType: 0, // 0-多车文本下发，1-单车文本下发
      policeForm: {
        process: '',
        time: this.$util.format(false),
        user: sessionStorage.getItem('userName'),
        result: '真报警'
      },
      sendTextContent: '', // 文本下发内容
      todayAlarmForm: { // 今日报警查询form
        alarmType: ''
      },
      alarmTypeList: [
        {
        id: 1,
        name: '超速报警'
      }, {
        id: 2,
        name: '疲劳驾驶'
      }, {
        id: 3,
        name: '超速预警'
      }, {
        id: 4,
        name: '面板报警'
      }, {
        id: 5,
        name: '超速高速报警'
      }, {
        id: 6,
        name: '疲劳驾驶预警'
      }, {
        id: 7,
        name: '疲劳驾驶报警'
      }],
      police: [], // 处警对象
      sendText: {}, // 下发文本对象
      evidence: { // 查看证据对象
        evidencePic: 0,
        evidenceVideo: 0
      },
      option: {
        color: ['#409EFF'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {

          left: '4%',

          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['00:00-01:00', '02:00-03:00', '04:00-05:00', '06:00-07:00', '08:00-09:00', '10:00-11:00', '12:00-131:00']
        }],
        yAxis: [{
          type: 'value',
          name: '报警车辆数(辆)'
        }],
        series: [{
          name: '报警车辆数',
          type: 'bar',
          barWidth: '30',
          data: [10, 52, 200, 334, 390, 330, 220]
        }]
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
//      this.creatChart();
//      this.activeType = 'nowAlarm';
    });
  },
  name: 'businessAlarm',
  computed: {
    ...mapGetters(['getVehicleIdList'])
  },
  created () {
    // 获取用户车辆id集合
//    this.vehicleIdList = this.getVehicleIdList;
      this.vehicleIdList = [293, 92827];
    // 获取报警类型
    this.getAlarmType();
    // 车辆集合
    this.vehicleNoList = JSON.parse(sessionStorage.getItem('vehicleNoList'));
    if (!this.vehicleNoList || this.vehicleNoList.length === 0) {
      this.getregistrationNo();
    }
    // 获取总的报警表格数据
    this.getAlarmInfo();
  },
  watch: {
//    timeSwitch () {
//      this.getAlarmType();
//    }
  },
  destroyed () {
    if (this.timeInterval) {
      clearTimeout(this.timeInterval);
    }
  },
  methods: {
    openInterphone (data) {},
    goToMap (data) {
      if (!data.commNo) {
        this.$message('该车通讯号为空');
        return;
      }
      sessionStorage.setItem('singleCarCommNo', data.commNo);
      this.$router.push({
        path: '/myMap'
      });
    },
    changeCheckBox (data) {
      if (data) {
        return;
      }
      this.getAlarmType();
    },
    // 获取车牌
    getregistrationNo() {
      let that = this;
      this.$axiosUtil(
        {
          url: getRegistrationNoUrl,
          method: 'post'
        },
        response => {
          if (response.errcode === '0') {
            that.vehicleNoList = response.data;
          }
        }
      );
    },
    // 批量文本
    handleSentText1 () {
      this.sendTextVisible = true;
      this.sendTextType = 0;
      this.sendTextParams = [...this.multipleSelection];
    },
    // 单个文本
    handleSentText2 (data) {
      this.sendTextVisible = true;
      this.sendTextType = 1;
      this.sendTextParams = [data];
    },
    // 批量处警
    showPolice1 (tf) {
      this.doPoliceParams = [...this.multipleSelection];
      this.policeType = true;
      this.policeVisible = true;
    },
    // 单个处警
    showPolice2 (data) {
      this.policeType = false;
      this.policeVisible = true;
      this.doPoliceParams = [data];
      this.police = [data];
    },
    // 分页请求数据
    todaySizeChange (data) {
      this.todayTable.pageSize = data.pageSize;
      this.todayTable.currentPage = data.currentPage;
      this.getTodayAlarm();
    },
    todayCurrentChange (data) {
      this.todayTable.pageSize = data.pageSize;
      this.todayTable.currentPage = data.currentPage;
      this.getTodayAlarm();
    },
    nowSizeChange (data) {
      this.pageSize = data.pageSize;
      this.currentPage = data.currentPage;
      this.getAlarmInfo();
    },
    nowCurrentChange (data) {
      this.pageSize = data.pageSize;
      this.currentPage = data.currentPage;
      this.getAlarmInfo();
    },
    // 获取报警类型
    getAlarmType () {
      let that = this;
      this.$axiosUtil({
        url: alarmTypeUrl,
        method: 'post',
        params: {
          vehicleIdList: that.vehicleIdList
        }
      }, (response) => {
      if (response.errcode === '0') {
        let list = response.data;
        if (list.length === 0) {
          return;
        }
        that.alarmsSelect = [...response.data];
        let sumCount = list.reduce((a, b) => {
          return a + b.vehicleCount;
        }, 0);
        let sumAlarm = {
          vehicleCount: sumCount,
          alarmTypeName: '业务报警',
          alarmTypeId: ''
        };
        list.unshift(sumAlarm);
        this.alarms = list;
        console.log(response.data);
      }
      });
      if (!this.timeSwitch) {
        if (!this.timeInterval) {
          this.timeInterval = setTimeout(this.getAlarmType, TIME);
        } else {
          clearTimeout(this.timeInterval);
          this.timeInterval = setTimeout(this.getAlarmType, TIME);
        }
      } else {
        if (this.timeInterval) {
          clearTimeout(this.timeInterval);
        }
      }
    },
    // 获取待处理报警表格数据
    getAlarmInfo () {
      let vehicleIdList = [];
      if (this.searchForm.vehicleNo) {
        vehicleIdList = [this.searchForm.vehicleNo];
      } else {
        vehicleIdList = this.vehicleIdList;
      }
      this.loading = true;
      let that = this;
      this.$axiosUtil({
        url: alarmInfoUrl,
        params: {
          alarmTypeId: that.todayAlarmForm.alarmType,
          page: that.currentPage,
          limit: that.pageSize,
          vehicleIdList: vehicleIdList
        },
        method: 'post'
      }, (response) => {
        if (response.errcode === '0') {
          let dataList = response.data.list;
          if (dataList.length === 0) {
            that.loading = false;
            that.alarmTable.bodyData = [];
            that.totalPage = 0;
            return;
          }
          that.setTableAddress(dataList, 'longitude', 'latitude', 'address').then((da) => {
            that.loading = false;
            that.alarmTable.bodyData = dataList;
            that.totalPage = response.data.totalCount;
          });
        }
      });
    },
    // 获取今日报警柱状图数据
    getBarData () {
      let that = this;
      this.$axiosUtil({
        url: todayAlarmBarUrl,
        params: {
          vehicleIdList: that.vehicleIdList,
          alarmTypeId: that.todayAlarmForm.alarmType
        },
        method: 'post'
      }, (response) => {
        if (response.errcode === '0') {
          let xData = [];
          let seriesData = [];
          if (response.data.length === 0) {
            return;
          }
          response.data.forEach((p) => {
            xData.push(p.hour);
            seriesData.push(p.vehicleCount);
          });
          console.log(response.data);
          that.option.xAxis[0].data = xData;
          that.option.series[0].data = seriesData;
          that.creatChart();
          let startTime = xData[0].split('-')[0];
          let endTime = xData[0].split('-')[1];
          that.todayTable.startTime = startTime;
          that.todayTable.endTime = endTime;
          that.getTodayAlarm();
        }
      });
    },
     // 获取今日报警时间段内的报警详情
    getTodayAlarm () {
      let that = this;
      this.todayTable.loading = true;
      this.$axiosUtil({
        url: todayAlarmTableUrl,
        params: {
          vehicleIdList: that.vehicleIdList,
          startTime: `${util.format(new Date(), true).slice(0, -8)}${that.todayTable.startTime}:00`,
          endTime: `${util.format(new Date(), true).slice(0, -8)}${that.todayTable.endTime}:00`,
          page: that.todayTable.currentPage,
          limit: that.todayTable.pageSize,
          alarmTypeId: that.todayAlarmForm.alarmType
        },
        method: 'post'
      }, (response) => {
        if (response.errcode === '0') {
          this.todayTable.loading = false;
          let dataList = response.data;
          let alarmType = that.alarms.find(p => {
            return p.alarmTypeId === that.todayAlarmForm.alarmType;
          });
          let alarmTypeName = alarmType ? alarmType.alarmTypeName : '';
          dataList.list.forEach(p => {
            p.alarmTypeName = alarmTypeName;
          });
         that.todayTable.bodyData = dataList.list;
         that.todayTable.totalPage = dataList.totalCount;
        }
      });
    },
    // 点击业务报警列表
    selectAlarm (data) {
      this.activeBg = data.alarmTypeId;
      this.todayAlarmForm.alarmType = data.alarmTypeId;
      this.pageSize = 20;
      this.currentPage = 1;
      this.todayTable.currentPage = 1;
      this.todayTable.pageSize = 20;
      console.log(data);
      if (this.activeType === 'nowAlarm') {
        // 请求待处理报警let param = ;
        this.getAlarmInfo();
      } else {
        this.todayTable.currentPage = 1;
        this.todayTable.pageSize = 20;
        if (!this.todayAlarmForm.alarmType) {
          this.initTodayData();
          setTimeout(this.creatChart, 20);
          return;
        }
        this.getBarData();
      }
    },
    /*
   * 点击切换tab页
   * */
    handleTabType (tab, event) {
      if (this.alarms.length === 0) {
        this.initTodayData();
        this.alarmTable.bodyData = [];
        return;
      }
      if (this.activeType === 'toDayAlarm') {
        if (this.alarms.length === 0) {
          this.initTodayData();
          return;
        }
        this.todayTable.currentPage = 1;
        this.todayTable.pageSize = 20;
        if (!this.todayAlarmForm.alarmType) {
          this.initTodayData();
          setTimeout(this.creatChart, 20);
          return;
        }
        this.getBarData();
      } else {
        this.pageSize = 20;
        this.currentPage = 1;
        this.getAlarmInfo();
      }
    },
    // 点击bar
    selectBar (param) {
      let timeAry = this.option.xAxis[0].data[param.dataIndex].split('-');
      let startTime = timeAry[0];
      let endTime = timeAry[1];
      this.todayTable.bodyData = [];
      this.todayTable.totalPage = 0;
      this.todayTable.startTime = startTime;
      this.todayTable.endTime = endTime;
      this.todayTable.currentPage = 1;
      this.todayTable.pageSize = 20;
      this.getTodayAlarm();
    },
    // 初始化今日报警bar和table的数据
    initTodayData () {
      this.option.xAxis[0].data = [];
      this.option.series[0].data = [];
      this.todayTable.bodyData = [];
      this.todayTable.totalPage = 0;
    },
    /*
     * 初始化echart
     * */
    creatChart () {
      let that = this;
      if (!this.myChart) {
        this.myChart = this.$echarts.init(document.getElementById('alarmChart'));
        this.myChart.setOption(this.option);
        this.myChart.on('click', this.selectBar);
        window.onresize = function () { // 用于使chart自适应高度和宽度
          that.myChart.resize();
        };
      } else {
        this.myChart.setOption(this.option);
      }
    },

    /*
     * 点击切换报警类型
     * */
    handleAlarmType (tab, event) {
      console.log(tab, event);
    },

    /*
     * 点击切换报警类型
     * index :点击项
     * id :报警类型编号
     * */
    changeAlarmType (index, id) {
      this.selectedItem = index;
    },
    /*
     * 多条处警
     * */
    handleMultPolice () {
      this.policeVisible = false;
      let list = [];
      let that = this;
      let userId = sessionStorage.getItem('userId');
      let userName = sessionStorage.getItem('userName');
      this.doPoliceParams.forEach((p) => {
        let obj = {
          vehicleId: p.vehicleId,
          alarmKindId: p.alarmTypeId,
          alarmTime: p.alarmTime,
          transactResult: that.policeForm.result,
          transactContent: that.policeForm.process,
          transactMan: userId,
          userName: userName
        };
        list.push(obj);
      });
      this.$axiosUtil({
        url: doPoliceUrl,
        params: list,
        method: 'post'
      }, (res) => {
        if (res.errcode === '0') {
          this.$message('处警成功');
        }
      });
    },

    /*
     * 多条文本下发
     * */
    handleMultSendText () {
      // TODO 后期接口完善
      this.sendTextVisible = false;
      let list = [];
      let that = this;
      let userId = sessionStorage.getItem('userId');
      this.sendTextParams.forEach(p => {
        list.push({
          vehicleId: p.vehicleId,
          terminalId: p.terminalId,
          terminalType: p.terminalType,
          commNo: p.commNo,
          commandId: 33536,
          cmdArgs: `2,1,1,1,1,${that.sendTextContent}`,
          commandType: 'TEXT',
          userId: userId
        });
      });
      this.$axiosUtil({
        url: textSendUrl,
        params: list,
        method: 'post'
      }, (res) => {
        if (res.errcode === '0') {
          this.$message('文本下发成功');
        }
      });
    },
    getAddress (loc, func, prevIndexSum) {
      let that = this;
      let geocoder = new AMap.Geocoder({
        radius: 1000,
        batch: true,
        extensions: 'all'
      });
      geocoder.getAddress(loc, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result.info === 'OK' && typeof func === 'function') {
            func(result.regeocodes, prevIndexSum);
          } else {
            that.$message('获取地址失败0');
          }
        } else {
          console.log('有问题的经纬度', loc);
          that.$message('获取地址失败1');
        }
      });
    },
    // 设置表格数据的地址
    setTableAddress (data, lng, lat, address, func) {
      let that = this;
      let deleteAry = [];
      let deleteItem;
      // 先将没有经纬度的项删除掉
      for (let j = 0; j < data.length; j++) {
        if (!data[j][lng] || !data[j][lat]) {
          deleteItem = data.splice(j, 1)[0];
          deleteItem[address] = '';
          deleteItem.index = j;  // 记录删除index
          deleteAry.push(deleteItem);
          j--;
        }
      }
      return new Promise(function(resolve, reject) {
        if (data.length === 0) {
          data = [...deleteAry];
          resolve();
          return;
        }
        let startLngLatAry = [];
        let len = data.length;
        let count = Math.ceil(len / 20);
        for (let i = 0; i < count; i++) {
          let ary = [];
          data.slice(i * 20, (i + 1) * 20).forEach((p) => {
            if (p[lng] && p[lat]) {
              ary.push(new AMap.LngLat(p[lng], p[lat]));
            }
          });
          startLngLatAry.push(ary);
        }
        let prevIndex = 0;
        for (let n = 0, k = startLngLatAry.length; n < k; n++) {
          let count = n === 0 ? 0 : startLngLatAry[n - 1].length;
          prevIndex += count;
          that.getAddress(startLngLatAry[n], (result, prevIndex_) => {
            result.forEach((p1, index_) => {
              data[prevIndex_ + index_][address] = p1.formattedAddress;
              // 遍历完成
              if (prevIndex_ + index_ + 1 === len) {
                if (deleteAry.length > 0) {
                  // 还原原先数组顺序
                  deleteAry.forEach((p, index) => {
                    data.splice(p.index + index, 0, p);
                  });
                }
                resolve();
//                  if (typeof func === 'function') {
//                    func();
//                  }
              }
            });
          }, prevIndex);
        }
      });
    },
    /*
     * 表格选中
     * */
    handleSelectionChange (val) {
      console.log(val);
      this.multipleSelection = val;
    },
    // 地图
    handleMap (row) {
      console.log(row);
    },

    /*
     * 报警趋势
     * */
    handleAlarmTrend (row) {
      console.log(row);
    },

    /*
     * 查看证据
     * */
    handleEvidence (row) {
      this.evidenceVisible = true;
      this.evidence = Object.assign({}, row);
    },

    /*
     * 查看证据切换图片视觉角度
     * */
    changePic () {

    },

    /*
     * 查看证据切换视频视觉角度
     * */
    changeVideo () {

    },

    /*
     * 查询今日报警
     * */
    handleTodaySearch () {
      if (this.todayAlarmForm.alarmType) {
        this.activeBg = this.todayAlarmForm.alarmType;
        this.getBarData();
      } else {
        this.$message('请先选择报警类型');
      }
    },

    handleSizeChange (val) {
      console.log(val);
      this.pageSize = val;
    },

    handleCurrentChange (val) {
      this.currentPage = val;
    }
  },
  components: {
    myTable
  }
};

</script>
<style lang="less">
  @import "../../../common/less/const";
/* 全局样式 */
.doPolice,.doText{
  .el-dialog__headerbtn{
    top:7px;
    @media (max-width: 1600px) and (max-height: 1000px){
      top: 4px;
    }
  }
  .el-dialog__footer{
    padding-top: 0;
  }
  td,th{
    padding: 0;
  }
  th{
    color:rgba(0,0,0,0.85);
    font-weight: 600;
    background-color: #FAFAFA;
  }
  td{
    color:rgba(0,0,0,0.65);
  }
  .cell{
    height: 36px;
    line-height: 36px;
  }
  @media (max-height: 1000px) and (max-width: 1600px){
    .cell{
      height: 26px;
      line-height: 26px;
    }
  }
  @media (max-height: 1000px) and (max-width: 1600px) {
    .el-input__inner{
      height: 26px!important;
      font-size: 12px;
    }
    .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
      font-size: 12px;
    }
    i{
      line-height: 26px!important;
    }
    .el-date-editor .el-range-separator{
      line-height: 26px;
      font-size: 12px;
    }
  }
  .el-input__inner{
    height: @singleInputHeight;
  }
  i{
    line-height: @singleInputHeight;
  }
  .el-input, .el-date-editor.el-input__inner{
    width: @singleInputWidth;
  }
}
.driver-alarm {
  .el-tabs__header{
    padding-left: 10px;
    @media (max-height: 1000px) and (max-width: 1600px) {
      padding-left: 6px;
    }
  }
  .el-tabs{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .el-tab-pane{
    height: 100%;
  }
  .el-tabs__content{
    flex:1;
  }
  .alarm-type {
    .el-tabs--left .el-tabs__item.is-left {
      text-align: left;
      /*border-bottom: 1px dashed #ccc;*/
    }

    .el-tabs__item {
      padding: 0 10px;
    }

    .el-tabs--left,
    .el-tabs--right {
      height: 100%;
    }

    .el-tabs__header.is-left {
      width: 100%;
    }

    .is-active {
      background: #E6F7FF;
    }

  }
}

</style>
<style scoped lang="less">

.driver-alarm,
.el-row,
.el-col,
.alarm-type {
  height: 100%;
}
.marg-left10{
  margin-left: 10px;
  @media (max-width: 1600px) and (max-height: 1000px) {
    margin-left: 6px;
  }
}
.content-wrap{display: flex;overflow: hidden}
.right-content{
  flex: 1;
  overflow: hidden;
}
.driver-alarm {
  display: flex;
  overflow: hidden;
  .alarm-type {
    padding-right: 20px;
  }

  .chart {
    width: 100%;
    height: 100%;
  }

  .information {
    padding: 0 0 5px;

    .address {
      display: inline-block;
      width: 225px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .evidence-dialog {
    .evidence-item {
      position: relative;
      height: 175px;
      width: 480px;

      .item-content {
        height: 100%;
        border: 1px solid #ccc;
      }

      .evidence-item-title {
        position: absolute;
        display: inline-block;
        top: 5px;
        left: 15px;
      }
    }
  }
}

.menu {
  list-style: none;
  border: 1px #dedede solid;
  width: 150px;

  li {
    border-bottom: 1px #dedede solid;
    cursor: pointer;
    line-height: 40px;
    padding-left: 20px;
    display: block;
  }

  .active {
    background-color: #E6F7FF;
    border-right: 2px #008DFF solid;
    color: #008DFF;

  }
}
.el-tab-pane{
  display: flex;
  flex-direction: column;
}
.table-info{
  flex: 1;
}
.content{width:100%;float: none;}
</style>
