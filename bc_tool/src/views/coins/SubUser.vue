<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <el-button class="action-item" type="primary" @click="showSearchForm">查询</el-button>
      <el-button class="action-item" type="primary" @click="handleCurrentChange(1)">刷新</el-button>
    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="csubUserSearcher" title="查询条件">
      <el-form :model="searchParams">

        <el-form-item label="主账户" :label-width="formLabelWidth">
          <el-select v-model="searchParams.adminUserId">
            <el-option v-for="p in adminUserList" :value="p.userId" :label="p.account" :key="p.userId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="子用户id" :label-width="formLabelWidth">
          <el-input v-model="searchParams.subUserId" ></el-input>
        </el-form-item>

      </el-form>
    </SCSearch>


    <SCContent>

      <el-table  :data="rows" stripe border style="width: 100%" :height=tableHeight>
        <el-table-column width="130%" prop="adminUserId" label="主账户id"></el-table-column>
        <el-table-column prop="subUserId" label="子账户id"></el-table-column>
        <el-table-column prop="userName" label="昵称"></el-table-column>
        <el-table-column prop="create_time" label="时间" :formatter="$timeFormat" width="200"></el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="210">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row.adminUserId,scope.row.subUserId)" type="text" size="small">明细</el-button>

            <el-button @click="showChargeBill(scope.row.adminUserId,scope.row.subUserId)" type="text" size="small">充值管理</el-button>
            <el-button @click="showTransferBill(scope.row.adminUserId,scope.row.subUserId)" type="text" size="small">打款管理</el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-dialog title="资金列表" :visible.sync="dialogDetail" width="66%">

        <el-table :data="accounts" border stripe style="width: 100%" >
          <el-table-column prop="coinsType" label="coinsType" ></el-table-column>
          <el-table-column prop="amount" label="余额" ></el-table-column>
          <el-table-column prop="coinAdress" label="地址" width="400px"></el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDetail = false">关 闭</el-button>
        </div>

      </el-dialog>


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
  import {listApi,accounts} from '@/api/coins/subuser'

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
        },
        tiemRange: [],
        apps: [],
        formLabelWidth: '80px',
        rows: [],
        tableHeight: document.documentElement.clientHeight - 200,
        detailRow: [],
        dialogDetail: false,
        adminUserList:[],
        accounts:[],
        pageSize:20,
        page:1,
        total:0,

      }
    },
    created() {
      this.$root.$off('search:csubUserSearcher')
      this.$root.$on('search:csubUserSearcher', () => {
        this.search();
      })

    },
    mounted() {
     //alert($route.params.auid);

      listAll().then(resp => {
        if (resp.code == 0) {
          this.adminUserList = resp.data.data.users;

          var auid=this.$route.query.auid;
          if(auid&&auid>0){
            this.searchParams.adminUserId=parseInt(auid);
            this.search();
          }
        }

      });



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

        listApi(this.searchParams.adminUserId, this.searchParams.subUserId,this.page)
          .then(resp => {
            if (resp.code == 0) {
              this.rows = resp.data.data.list;
              this.total = resp.data.data.total;
            }
          });


      },
      showSearchForm: function () {
        this.$root.$emit('showSearch:csubUserSearcher');
      },
      showDetail:function (adminUserId,subUserId) {
        this.accounts=[];
        accounts(adminUserId, subUserId)
          .then(resp => {
            if (resp.code == 0) {
              this.accounts = resp.data.data.accounts;
            }
          });
        this.dialogDetail=true;
      },
      showChargeBill:function (userId,subUserId) {
        this.$router.push({ path: '/coins/cchargeBillMgr?auid='+userId+'&suid='+subUserId})

      },
      showTransferBill:function (userId,subUserId) {
        this.$router.push({ path: '/coins/ctransferMgr?auid='+userId+'&suid='+subUserId})

      }


    },

  }
</script>

<style scoped>


</style>
