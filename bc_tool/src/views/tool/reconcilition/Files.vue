<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <el-button class="action-item" type="primary" @click="showSearchForm">查询</el-button>
      <el-button class="action-item" type="primary" @click="search">刷新</el-button>
    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="filesSearcher" title="查询条件">
      <el-form :model="searchParams">

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="searchParams.email" @blur.prevent="commonApps"></el-input>
        </el-form-item>

        <el-form-item label="应用" :label-width="formLabelWidth">
          <el-select v-model="searchParams.appid">
            <el-option value="" label="全部应用"></el-option>
            <el-option v-for="p in apps" :value="p.appId" :label="p.nickName" :key="p.appId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="对账模式" :label-width="formLabelWidth">
          <el-select v-model="searchParams.flag">
            <el-option value="DAY" label="按日对账"></el-option>
            <el-option value="MONTH" label="按月对账"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="起始日期" :label-width="formLabelWidth">
          <el-date-picker format="yyyy-MM-dd" type="daterange" v-model="tiemRange"></el-date-picker>
        </el-form-item>


      </el-form>
    </SCSearch>


    <SCContent>

      <el-table :data="files" stripe border style="width: 100%" :height=tableHeight>
        <el-table-column fixed prop="flagName" label="类型"></el-table-column>
        <el-table-column fixed prop="fileName" label="日期"></el-table-column>
        <el-table-column prop="appName" label="应用名称"></el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="90">
          <template slot-scope="scope">
            <el-button @click="downFile(scope.row.downloadUrl)" type="text" size="small">下载对账单</el-button>
            <el-button @click="delFile(scope.row.fileName,scope.row.appid)" type="text" size="small">删除</el-button>
           <!-- <el-button @click="showFreeze(scope.row.email)" type="text" size="small">冻结</el-button>
            <el-button @click="showWithdraw(scope.row.email,scope.row.bcUsableAmount)" type="text" size="small">提款
            </el-button>-->
          </template>
        </el-table-column>
      </el-table>


    </SCContent>


  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCSearch from '@/components/SCSearch'
  import {appsApi} from '@/api/common/common'
  import {filesApi,delApi} from '@/api/tool/renconcilition'


  const globalConfig = require('../../../config');
  var moment = require('moment');

  export default {
    components: {ActionBar, SCContent, SCSearch},
    data() {
      return {
        searchParams: {
          email: 'zhihaoq@beecloud.cn',
          appid: '',
          flag: 'DAY',
          startTime: 0,
          endTime: 0
        },
        tiemRange: [],
        apps: [],
        formLabelWidth: '80px',
        files:[],
        tableHeight:document.documentElement.clientHeight-100
      }
    },
    created() {
      this.$root.$off('search:filesSearcher')
      this.$root.$on('search:filesSearcher', () => {
        this.search();
      })

    },
    mounted() {
      this.tiemRange[0] = moment(new Date()).add(-1,"days");
      this.tiemRange[1] = moment(new Date()).add(-1,"days");

    },
    methods: {

      search: function () {
        this.searchParams.startTime = moment(this.tiemRange[0]).format('X')*1000;
        this.searchParams.endTime =moment(this.tiemRange[1]).format('X')*1000;

        if (!this.$checkisNotEmpty(this.searchParams.email)) {
          this.$errorMsg("邮箱不能为空");
          return;
        }

        filesApi(this.searchParams.email, this.searchParams.appid, this.searchParams.flag, this.searchParams.startTime, this.searchParams.endTime)
          .then(resp => {
              if(resp.code==0){
                this.files=resp.data.files;
              }
          });


      },
      showSearchForm: function () {
        this.$root.$emit('showSearch:filesSearcher');
      },
      commonApps:function() {
        console.info(this.searchParams.email)
        this.apps = [];
        this.searchParams.appid = '';
        appsApi(this.searchParams.email).then(resp => {
          if (resp.code == 0) {
            this.apps = resp.data.apps;
          }
        });
      },
      downFile:function (downloadUrl) {
        window.open(downloadUrl)

      },
      delFile:function (delKey,appid) {
        this.$confirm('你确定删除【' + delKey + '】对账文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delApi(delKey,appid).then(resp => {
            if (resp.code == 0) {
              this.search();
              this.$successMsg('删除成功');
            }
          });

        }).catch(() => {

        });

      }
    }

  }
</script>

<style scoped>

</style>
