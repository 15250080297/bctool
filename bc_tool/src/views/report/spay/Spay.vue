<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <el-button class="action-item" type="primary" @click="showSearchForm">查询</el-button>
      <el-button class="action-item" type="primary" @click="search">刷新</el-button>
      <el-button class="action-item" type="primary" @click="showAddScript">新增</el-button>
      <el-button class="action-item" type="primary" @click="changeShowType">切换{{showType}}</el-button>
    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="spaySearcher" title="查询条件">
      <el-form :model="searchParams">

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="searchParams.email" @blur.prevent="commonApps(1)"></el-input>
        </el-form-item>

        <el-form-item label="应用" :label-width="formLabelWidth">
          <el-select v-model="searchParams.appid">
            <el-option v-for="p in apps" :value="p.appId" :label="p.nickName" :key="p.appId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="searchParams.duration">
            <el-option value="86400" label="日对账单"></el-option>
            <el-option value="3600" label="小时对账单"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="起始日期" :label-width="formLabelWidth">
          <el-date-picker format="yyyy-MM-dd" type="daterange" v-model="tiemRange"></el-date-picker>
        </el-form-item>


      </el-form>
    </SCSearch>


    <SCContent>

      <el-table v-if="showType=='L'" :data="rows" stripe border style="width: 100%" :height=tableHeight>
        <el-table-column prop="nick_name" label="应用名称"></el-table-column>
        <el-table-column prop="flag" label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.duration=='3600'">小时对账单</span>
            <span v-if="scope.row.duration!='3600'">日对账单</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_succfee" :formatter="$money_column" label="成功交易金额"></el-table-column>
        <el-table-column prop="start_time" :formatter="$timeFormat" label="起始日期"></el-table-column>
        <el-table-column prop="updatedat" :formatter="$timeFormat" label="更新时间"></el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="110">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="reset(scope.row)" type="text" size="small">更新</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="showType=='V'" style="margin-left: 30%">
        <el-radio v-model="cpday" label="1" border v-on:change="search">同比昨天</el-radio>
        <el-radio v-model="cpday" label="7" border v-on:change="search">同比7天</el-radio>
        <el-radio v-model="cpday" label="30" border v-on:change="search">同比上月</el-radio>
      </div>

      <div v-if="showType=='V'" id="spay_chart" class="charts" style="width: 100%;height: 500px">
      </div>


      <el-dialog title="详情" :visible.sync="dialogDetail" width="66%">

        <el-table :data="detailRow" border stripe style="width: 100%">
          <el-table-column prop="key" label="KEY" width="222"></el-table-column>
          <el-table-column prop="value" label="VALUE"></el-table-column>
        </el-table>

      </el-dialog>

      <el-dialog title="新增脚本[慎用]" :visible.sync="dialogAdd" width="40%">

        <el-form :model="spayBean">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="spayBean.email" @blur.prevent="commonApps(2)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="应用" :label-width="formLabelWidth">
            <el-select v-model="spayBean.appid">
              <el-option v-for="p in apps" :value="p.appId" :label="p.nickName" :key="p.appId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-select v-model="spayBean.duration">
              <el-option value="86400" label="日对账单"></el-option>
              <el-option value="3600" label="小时对账单"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="起始日期" :label-width="formLabelWidth">
            <el-date-picker format="yyyy-MM-dd HH" type="datetime" v-model="spayBean.startTime"
                            placeholder="选择日期时间"></el-date-picker>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button type="primary" @click="addScript">确 定</el-button>
        </div>


      </el-dialog>


    </SCContent>


  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCSearch from '@/components/SCSearch'
  import {appsApi} from '@/api/common/common'
  import {listApi, resetApi} from '@/api/report/spay'
  import echarts from 'echarts';


  const globalConfig = require('../../../config');
  var moment = require('moment');

  export default {
    components: {ActionBar, SCContent, SCSearch},
    data() {
      return {
        searchParams: {
          email: 'zhihaoq@beecloud.cn',
          appid: 'afae2a33-c9cb-4139-88c9-af5c1df472e1',
          duration: '86400',
          startTime: 0,
          endTime: 0
        },
        tiemRange: [],
        apps: [],
        formLabelWidth: '80px',
        rows: [],
        tableHeight: document.documentElement.clientHeight - 100,
        detailRow: [],
        dialogDetail: false,
        dialogAdd: false,
        spayBean: {
          email: 'zhihaoq@beecloud.cn',
          appid: 'afae2a33-c9cb-4139-88c9-af5c1df472e1',
        },
        showType: 'L',//L :list  V:view
        chart: null,
        cpday:"7",
        eclist:[],

      }
    },
    created() {
      this.$root.$off('search:spaySearcher')
      this.$root.$on('search:spaySearcher', () => {
        this.search();
      })

    },
    mounted() {
      this.tiemRange[0] = moment(new Date()).add(-7, "days");
      this.tiemRange[1] = moment(new Date());
      this.commonApps();
      this.searchParams.appid = 'afae2a33-c9cb-4139-88c9-af5c1df472e1';
      this.search();
    },
    methods: {

      search: function () {
        this.searchParams.startTime = moment(this.tiemRange[0]).format('X') * 1000;
        this.searchParams.endTime = moment(this.tiemRange[1]).format('X') * 1000;

        if (!this.$checkisNotEmpty(this.searchParams.email)) {
          this.$errorMsg("邮箱不能为空");
          return;
        }

        if (!this.$checkisNotEmpty(this.searchParams.appid)) {
          this.$errorMsg("应用不能为空");
          return;
        }

        listApi(this.searchParams.email, this.searchParams.appid, this.searchParams.duration, this.searchParams.startTime,
          this.searchParams.endTime,this.showType,this.cpday)
          .then(resp => {
            if (resp.code == 0) {
              this.rows = resp.data.list;
              this.eclist=resp.data.eclist;
              if(this.showType=='V') {
                this.loadChart();
              }
            }
          });


      },
      showSearchForm: function () {
        this.$root.$emit('showSearch:spaySearcher');
      },
      commonApps: function (flag) {
        var email;
        if (1 == flag) {
          email = this.searchParams.email;
          this.spayBean.email = this.searchParams.email;
        } else {
          email = this.spayBean.email;
          this.searchParams.email = this.spayBean.email;
        }
        this.apps = [];
        this.searchParams.appid = '';
        this.spayBean.appid = '';
        appsApi(email).then(resp => {
          if (resp.code == 0) {
            this.apps = resp.data.apps;
          }
        });
      },
      showDetail: function (row) {
        this.detailRow = [];
        this.dialogDetail = true;
        for (var key in row) {
          this.detailRow.push({
            key: key,
            value: row[key]
          })
        }
      },
      reset: function (row) {
        var src = "你确定重跑【";
        if (3600 == row.duration) {
          src += "小时】";
        } else {
          src += "日】";
        }

        src += this.$timeStampFormat(row.start_time) + " 脚本吗?";

        this.$confirm(src, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetApi(row.email, row.app_id, row.duration, row.start_time)
            .then(resp => {
              if (resp.code == 0) {
                this.$successMsg('更新成功');
                this.search();
              }
            });
        }).catch(() => {

        });

      },
      showAddScript: function () {
        this.dialogAdd = true;
        var now = moment();
        this.spayBean = {
          email: this.searchParams.email,
          appid: this.searchParams.appid,
          duration: '3600',
          startTime: now,
        }
      },
      addScript: function () {
        var st = new Date(this.spayBean.startTime).getTime();
        resetApi(this.spayBean.email, this.spayBean.appid, this.spayBean.duration, st)
          .then(resp => {
            if (resp.code == 0) {
              this.$successMsg('创建成功');
              this.search();
              this.dialogAdd = false;

            }
          });
      },
      changeShowType: function () {
        if (this.showType == 'L') {
          this.showType = 'V';
          this.search();
        } else {
          this.showType = 'L';
        }
      },
      loadChart: function () {
        var legendData=[];
        legendData.push("成功交易金额");
        legendData.push("成功交易手续费");
        legendData.push("成功交易笔数");
        var cpsrc;
        if(1==this.cpday){
          cpsrc="同比昨日"
        }else if(7==this.cpday){
          cpsrc="同比7天"
        }else {
          cpsrc="同比上月"
        }
        legendData.push(cpsrc+'成功交易金额');
        legendData.push(cpsrc+'成功交易手续费');
        legendData.push(cpsrc+'成功交易笔数');

        var xarr=[];
        var totalSuccessFee=[];
        var totalChannelFee=[];
        var totalSucctrade=[];
        var comparedSuccessFee=[];
        var comparedChannelFee=[];
        var comparedSucctrade=[];
        for (let c of this.eclist){
          xarr.push(c.xkey);
          totalSuccessFee.push(c.totalSuccessFee);
          totalChannelFee.push(c.totalChannelFee);
          totalSucctrade.push(c.totalSucctrade);
          comparedSuccessFee.push(c.comparedSuccessFee);
          comparedChannelFee.push(c.comparedChannelFee);
          comparedSucctrade.push(c.comparedSucctrade);
        }

        let myChart = this.$echarts.init(document.getElementById('spay_chart'))

        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:legendData
          },
          color:['#008000','#0000FF','#00CED1','#DC143C','#A52A2A','#D2691E'],
          xAxis: {
            type: 'category',
            data: xarr
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
            name: '成功交易金额',
            type: 'line',
            data: totalSuccessFee
            },
            {
              name: '成功交易手续费',
              type: 'line',
              data: totalChannelFee
            },
            {
              name: '成功交易笔数',
              type: 'line',
              data: totalSucctrade
            },
            {
              name: cpsrc+"成功交易金额",
              type: 'line',
              data: comparedSuccessFee
            },
            {
              name: cpsrc+"成功交易手续费",
              type: 'line',
              data: comparedChannelFee
            },
            {
              name: cpsrc+"成功交易笔数",
              type: 'line',
              data: comparedSucctrade
            },
          ]
        });

      },


    },

  }
</script>

<style scoped>


</style>
