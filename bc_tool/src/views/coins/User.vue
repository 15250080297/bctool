<template>
  <div class="tab-container">


    <SCContent>


      <el-table :data="rowData" stripe border style="width: 100%" :height=tableHeight >
        <el-table-column fixed prop="userId" label="用户id">
        </el-table-column>
        <el-table-column prop="account" label="账户"></el-table-column>
        <el-table-column prop="create_time" label="时间" :formatter="$timeFormat" width="200"></el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="390">
          <template slot-scope="scope">
            <el-button @click="showConfig(scope.row.appId,scope.row.appKey,scope.row.webhook)" type="text" size="small">配置</el-button>
            <el-button @click="showService(scope.row.userId)" type="text" size="small">费率</el-button>
            <el-button @click="showBalance(scope.row.userId)" type="text" size="small">资金</el-button>
<!--
            <el-button @click="showSubUsers(scope.row.userId)" type="text" size="small">子账户</el-button>
-->
          </template>
        </el-table-column>
      </el-table>


      <el-dialog title="配置信息" :visible.sync="dialogConfig">
        <el-form>
          <el-form-item label="appId:" :label-width="formLabelWidth">
            {{appId}}
          </el-form-item>
          <el-form-item label="appKey:" :label-width="formLabelWidth">
            {{appKey}}
          </el-form-item>
          <el-form-item label="webHook:" :label-width="formLabelWidth">
            {{webHook}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogConfig = false">关 闭</el-button>
        </div>
      </el-dialog>


      <el-dialog title="费率配置" :visible.sync="dialogService" width="66%">

        <el-table :data="serviceInfoList" border stripe style="width: 100%" >
          <el-table-column prop="coinsType" label="coinsType" ></el-table-column>
          <el-table-column prop="chargeChannelFee" label="充值费率" ></el-table-column>
          <el-table-column prop="transferChannelFee" label="打款费率" ></el-table-column>
          <el-table-column prop="monitorTimes" label="回调阈值"></el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogService = false">关 闭</el-button>
        </div>

      </el-dialog>

      <el-dialog title="资金列表" :visible.sync="dialogBalance" width="66%">

        <el-table :data="balanceList" border stripe style="width: 100%" >
          <el-table-column prop="coinsType" label="coinsType" ></el-table-column>
          <el-table-column prop="amount" label="余额" ></el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBalance = false">关 闭</el-button>
        </div>

      </el-dialog>




    </SCContent>

  </div>
</template>

<script>
  import SCContent from '@/components/SCContent'
  import {listAll,serviceInfo,balancesApi} from '@/api/coins/user'

  export default {
    components: {SCContent},
    data() {
      return {
        rowData: [],
        tableHeight:document.documentElement.clientHeight-100,
        formLabelWidth: '120px',

        dialogConfig:false,
        dialogService:false,
        dialogBalance:false,
        appId:'',
        appKey:'',
        webHook:'',
        serviceInfoList:[],
        balanceList:[],

      }
    },
    mounted() {
      this.listAll();
    },

    methods: {

      listAll: function () {
        listAll().then(resp => {

          if (resp.code == 0) {
            this.rowData = resp.data.data.users;
          }

        });
      },
      showConfig:function (appId,appKey,webHook) {
          this.appId=appId;
          this.appKey=appKey;
          this.webHook=webHook;
          this.dialogConfig=true;
      },
      showService:function (userId) {
        this.serviceInfoList=[];
        serviceInfo(userId).then(resp => {
          if (resp.code == 0) {
            this.serviceInfoList = resp.data.data.infos;
          }

        });
        this.dialogService=true;
      },
      showBalance:function (userId) {
        this.balanceList=[];
        balancesApi(userId).then(resp => {
          if (resp.code == 0) {
            this.balanceList = resp.data.data.balances;
          }

        });
        this.dialogBalance=true;
      },
     /* showSubUsers:function (userId) {
        this.$router.push({ path: '/coins/csubUserMgr/'+userId})

      }*/

    }

  }
</script>

<style scoped>

</style>
