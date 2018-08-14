<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <el-button class="action-item" type="primary" @click="showAddForm">{{$t('button.add')}}</el-button>
      <el-button class="action-item" type="primary" @click="showSearchForm">{{$t('button.search')}}</el-button>
      <!--<el-button class="action-item" type="primary">{{$t('button.approval')}}</el-button>-->
    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="dutySearcher" title="任务查询">
      <el-form :model="searchParams">

        <el-form-item label="事件" :label-width="formLabelWidth">
          <el-select v-model="searchParams.action"   >
            <el-option value="" label="全部事件"></el-option>
            <el-option v-for="p in actionSelect" :value="p.action" :label="p.title" :key="p.action"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="searchParams.status"  >
            <el-option value="" label="全部状态"></el-option>
            <el-option value="S" label="成功"></el-option>
            <el-option value="F" label="失败"></el-option>
            <el-option value="P" label="执行中"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="searchParams.email"></el-input>
        </el-form-item>

        <el-form-item label="AppId" :label-width="formLabelWidth">
          <el-input v-model="searchParams.appid"></el-input>
        </el-form-item>



      </el-form>
    </SCSearch>


    <SCContent>
      <!--列表 -->
      <SCTable :columnDefs="columnDefs"
               :rowData="rowData"
               :editable="true"
               :showTool="false"
               :singleTable="true"
               :currentPage="searchParams.page"
               :total="searchParams.total"
               :pageSize="searchParams.limit"
      >
      </SCTable>

    </SCContent>

    <DutyAdd></DutyAdd>


  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import {search} from '@/api/tool/duty'
  import DutyAdd from './DutyAdd'


  const globalConfig = require('../../../config');
  var moment = require('moment');

  export default {
    components: {ActionBar, SCContent, SCTable, SCSearch, SCDateRange,DutyAdd},
    data() {
      return {
        searchParams: {
          action: '',
          email: '',
          appid: '',
          status: '',
          page: 1,
          limit: 20,
          total: 0
        },
        formLabelWidth: '120px',
        columnDefs: [
          {
            headerName: '事件名称', field: 'action', cellRenderer: function (data) {
              return globalConfig.ActionEnum[data.value]
            }
          },
          {headerName: '邮箱', field: 'email'},
          {headerName: 'AppId', field: 'appId'},
          {headerName: '起始时间', field: 'dutyStartTime',cellRenderer: function(data) {
              return moment(data.value).format('YYYY-MM-DD HH:mm:ss');
          }},
          {headerName: '结束时间', field: 'dutyEndTime',cellRenderer: function(data) {
              return moment(data.value).format('YYYY-MM-DD HH:mm:ss');
            }},
          {headerName: '完成度', field: 'totalCount',cellRenderer:function (params) {
               return '<span>'+params.data.doneCount+'/'+params.data.totalCount+'</span>'
            }},
          {headerName: '创建任务时间', field: 'createdat',cellRenderer: function(data) {
              return moment(data.value).format('YYYY-MM-DD HH:mm:ss');
            }},
          {headerName: '状态', field: 'status',cellRenderer:function (data) {
              if("P"==data.value){
                return "执行中";
              }else if("F"==data.value){
                return "失败";
              }else if("S"==data.value){
                return "已完成";
              }else {
                return "未执行";
              }
            }},

        ],
        rowData: [],
        actionSelect:[]
      }
    },
    created() {
      this.$root.$off('search:dutySearcher')
      this.$root.$on('search:dutySearcher',() =>{
        console.log("do dutySearcher")
        this.searchParams.page=1;
        this.search();
      })

    },
    mounted() {
      for(let ae in globalConfig.ActionEnum){
        this.actionSelect.push({'action':ae,'title':globalConfig.ActionEnum[ae]});
      }
      this.search();
    },
    methods: {

      search: function () {
        console.info(">>"+JSON.stringify(this.searchParams));
        search(this.searchParams).then(resp => {
          if (resp.code == 0) {
            this.rowData = resp.data.list;
            this.searchParams.total = resp.data.pagination.total;
          }
        });
      },
      showSearchForm:function () {
        this.$root.$emit('showSearch:dutySearcher');
      },
      showAddForm:function () {
        this.$root.$emit('showSearch:dutyAddModify');
        this.$store.dispatch('ShowAddDuty').then(()=>{});

      },
      cancelModify:function () {
        //this.$root.$emit('hideModify:purchaseModify');
      },
    }

  }
</script>

<style scoped>

</style>
