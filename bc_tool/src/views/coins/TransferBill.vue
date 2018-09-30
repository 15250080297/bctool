<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <el-button class="action-item" type="primary" @click="showSearchForm">查询</el-button>
      <el-button class="action-item" type="primary" @click="handleCurrentChange(1)">刷新</el-button>
    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="ctransferBillSearcher" title="查询条件">
      <el-form :model="searchParams">

        <el-form-item label="主账户" :label-width="formLabelWidth">
          <el-select v-model="searchParams.adminUserId">
            <el-option v-for="p in adminUserList" :value="p.userId" :label="p.account" :key="p.userId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="子用户id" :label-width="formLabelWidth">
          <el-input v-model="searchParams.subUserId" ></el-input>
        </el-form-item>

        <el-form-item label="hashcode" :label-width="formLabelWidth">
          <el-input v-model="searchParams.hashcode" ></el-input>
        </el-form-item>

        <el-form-item label="币种" :label-width="formLabelWidth">
          <el-select v-model="searchParams.coinsType">
            <el-option value="USDT" label="USDT"></el-option>
            <el-option value="BTC" label="BTC"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="transactionId" :label-width="formLabelWidth">
          <el-input v-model="searchParams.transactionId" ></el-input>

        </el-form-item>


        <el-form-item label="起始日期" :label-width="formLabelWidth">
          <el-date-picker format="yyyy-MM-dd" type="daterange" v-model="tiemRange"></el-date-picker>
        </el-form-item>


      </el-form>
    </SCSearch>


    <SCContent>

      <el-table  :data="rows" stripe border style="width: 100%" :height=tableHeight>
        <el-table-column prop="hashcode" label="hashcode"  >
          <template slot-scope="scope">
            <span :title="scope.row.hashcode">{{$longSrc2(scope.row.hashcode)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transactionId" label="transactionId"  >
          <template slot-scope="scope">
            <span :title="scope.row.transactionId">{{$longSrc2(scope.row.transactionId)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sourceAddress" label="原始地址"  >
          <template slot-scope="scope">
            <span :title="scope.row.sourceAddress">{{$longSrc2(scope.row.sourceAddress)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="destinationAddress" label="目的地址"  >
          <template slot-scope="scope">
            <span :title="scope.row.destinationAddress">{{$longSrc2(scope.row.destinationAddress)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额"></el-table-column>
        <el-table-column prop="channelFee" label="手续费"></el-table-column>
        <el-table-column prop="realAmount" label="实收金额"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==-1" class="red">失败</span>
            <span v-if="scope.row.status>=scope.row.monitorTimes" class="green">成功</span>
            <span v-if="scope.row.status<scope.row.monitorTimes && scope.row.status>=0">处理中</span>
          </template>

        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" :formatter="$timeFormat" width="160"></el-table-column>
        <el-table-column prop="tradeTime" label="交易时间" :formatter="$timeFormat" width="160"></el-table-column>

      </el-table>

      <div class="block" style="float: right">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="total,prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>









    </SCContent>


  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCSearch from '@/components/SCSearch'
  import {appsApi} from '@/api/common/common'
  import {listAll} from '@/api/coins/user'
  import {listApi} from '@/api/coins/transferBill'

  import echarts from 'echarts';


  const globalConfig = require('../../../config');
  var moment = require('moment');

  export default {
    components: {ActionBar, SCContent, SCSearch},
    data() {
      return {
        searchParams: {
          adminUserId: 0,
          subUserId: '',
          hashcode:'',
          coinsType:'USDT',
          transactionId:''
        },
        startTime:0,
        endTime:0,
        pageSize:20,
        page:1,
        total:0,
        tiemRange: [],
        apps: [],
        formLabelWidth: '80px',
        rows: [],
        tableHeight: document.documentElement.clientHeight - 200,
        detailRow: [],
        dialogDetail: false,
        adminUserList:[],
        accounts:[]

      }
    },
    created() {
      this.$root.$off('search:ctransferBillSearcher')
      this.$root.$on('search:ctransferBillSearcher', () => {
        this.search();
      })

    },
    mounted() {
      listAll().then(resp => {
        if (resp.code == 0) {
          this.adminUserList = resp.data.data.users;
        }

      });

      this.tiemRange[0] = moment(new Date()).startOf("day");
      this.tiemRange[1] = moment(new Date()).endOf("day");

      // this.search();
    },
    methods: {
      handleCurrentChange(val) {
        this.search(val)
      },

      search: function (page=1) {

        if (0==this.searchParams.adminUserId) {
          this.$errorMsg("请选择主账户");
          return;
        }
        this.page=page;

        this.startTime = moment(this.tiemRange[0]).format('X') * 1000;
        this.endTime = moment(this.tiemRange[1]).endOf("day").format('X') * 1000;


        listApi(this.searchParams.adminUserId, this.searchParams.subUserId,this.searchParams.hashcode,
          this.searchParams.coinsType,this.searchParams.transactionId,this.startTime,this.endTime,this.page)
          .then(resp => {
            if (resp.code == 0) {
              this.rows = resp.data.data.list;
              this.total=resp.data.data.total;
            }
          });


      },
      showSearchForm: function () {
        this.$root.$emit('showSearch:ctransferBillSearcher');
      },



    },

  }
</script>

<style scoped>


</style>
