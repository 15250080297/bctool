<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

     <!-- <el-button class="action-item" type="primary" @click="importSales">{{$t('button.salesSelect')}}</el-button>-->
      <el-button class="action-item" type="primary" @click="showSearchForm">{{$t('button.search')}}</el-button>
      <el-button class="action-item" type="primary" @click="doApproval" :disabled="approval.cannotApproval">{{$t('button.approval')}}</el-button>

      <el-dropdown @command="execCommand">
        <el-button class="action-item">
          {{$t('button.exec.title')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="sendApproval" :disabled="approval.cannotSendApproval">{{$t('button.exec.sub.submit')}}</el-dropdown-item>
          <el-dropdown-item command="abandonApproval" :disabled="approval.cannotAbandonApproval">{{$t('button.exec.sub.abandon')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown @command="accessoryCommand">
        <el-button class="action-item">
          {{$t('button.accessory.title')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="approvalStream">{{$t('button.accessory.sub.approvalStream')}}</el-dropdown-item>
          <el-dropdown-item>{{$t('button.accessory.sub.unionQuery')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button class="action-item" type="primary" @click="delSettlement" :disabled="couldDel ? false : true">{{$t('button.del')}}</el-button>
      <!-- <el-button class="action-item" type="primary" :disabled="couldStamp ? false : true" @click="printPDF">{{$t('button.stamp')}}</el-button>-->
      <!--<el-button class="action-item" type="primary" @click="showImportForm">{{$t('button.importSelect')}}</el-button>-->
    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="settlementSearchForm" title="结算单查询">
      <el-form :model="form">
        <el-form-item label="销售日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" align="center" >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算单号" :label-width="formLabelWidth">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="审批状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="状态">
            <el-option label="所有" value=""></el-option>
            <el-option label="待审批" value="F"></el-option>
            <el-option label="审批中" value="P"></el-option>
            <el-option label="审批通过" value="S"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </SCSearch>


    <SCSearch id="searchSalesForm" title="销售订单查询">
      <el-form :model="salesForm">
        <el-form-item label="销售订单单号" :label-width="formLabelWidth">
          <el-input v-model="salesForm.code"></el-input>
        </el-form-item>
      </el-form>
    </SCSearch>

    <!-- 导入 -->
    <SalesImport id="salesImportForm" title="销售订单导入">
      <el-form >
        <el-form-item label="销售日期" :label-width="formLabelWidth">
          <el-date-picker type="date" v-model="upLoadData.selectedSaleOrderTime" value-format="yyyy-MM-dd" placeholder="选择日期" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="平台" :label-width="formLabelWidth">
          <el-select v-model="upLoadData.channelId" filterable placeholder="请选择" >
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客商" :label-width="formLabelWidth">
          <el-select v-model="upLoadData.supplierId" filterable placeholder="请选择" >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            ref="upload"
            :data="upLoadData"
            :beforeUpload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :action="importUrl"
            :file-list="fileList"
            :limit =1
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 20px;" size="small" type="success" @click="submitUpload">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </SalesImport>

    <SCContent>
      <!--列表 -->
      <SCTable :columnDefs="columnDefs"
               :rowData="rowData"
               :editable="false"
               :currentPage="currentPage"
               :total="total"
               :pageSize="pageSize"
               :showTool="false"
               @onRowSelected="onRowSelected"
               @onRowDoubleClicked="onRowDoubleClicked"
               @onPageChanged="onPageChanged">

      </SCTable>

      <!--详情 -->
      <SCTable :columnDefs="detailColumnDefs"
               :editable="false"
               :enablePagination="false"
               :showTool="false"
               :autoResize="true"
               :rowData="detailRowData">
      </SCTable>
    </SCContent>

    <ApprovalStream></ApprovalStream>
    <SettlementEdit ></SettlementEdit>

    <SettlementAdd ></SettlementAdd>

    <SalesSettlement></SalesSettlement>

  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SalesImport from '@/components/SalesImport'
  import SCDateRange from '@/components/SCDateRange'
  import SCModify from '@/components/SCModify'
  import { producePDF } from '@/api/requistion'
  import { findAllChannel } from '@/api/channel'
  import { findPage,findDetail ,delSettlement} from '@/api/settlement'
  import SettlementEdit from './SettlementEdit.vue'
  import SettlementAdd from './SettlementAddNew.vue'
  import config from '@/config'
  import { sendApproval,loadApprovalButtons,abandonApproval} from '@/api/approval'
  import { getUid} from '@/utils/auth'
  import ApprovalStream from '@/components/ApprovalStream'
  import { findAllSupplier} from '@/api/supplier'
  import SalesSettlement from './SalesSettlement.vue'
  export default {
    name: 'tab',
    components: {ActionBar,SCContent, SCTable, SCSearch, SCDateRange,SettlementEdit,SettlementAdd,ApprovalStream,SalesImport,SalesSettlement},
    data() {
      return {
        gridOptions:{
          defaultColDef:{
            editable: false
          }
        },
        currentPage:1,
        total:0,
        pageSize:20,
        form: {
          code:'',
          status: '',
          date1: '',
          date2: ''

        },
        fileList:[],
        formLabelWidth: '120px',
        columnDefs: [
          {headerName: '单据号', field: 'code'},
          {headerName: '日期', field: 'salesOrderTime'},
          {headerName: '客户', field: 'supplierName'},
          {headerName: '事业部', field: 'buName'},
          {headerName: '制单人', field: 'createName'},
          {headerName: '审批人', field: 'approvalUserName'},
          {headerName: '制单时间', field: 'createTime'},
          {headerName: '最后修改人', field: 'updateName'},
          {headerName: '最后修改时间', field: 'updateTime'},
          {headerName: '备注', field: 'remark'},

        ],
        detailColumnDefs:[
          {headerName: '存货编码', field: 'erpCode', editable: false},
          {headerName: '存货名称', field: 'productName'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'},
          {headerName: '计量单位', field: 'weightUnitId'},
          {headerName: '数量', field: 'amount'},
          {headerName: '无税单价', field: 'priceExclusiveTax'},
          {headerName: '税率', field: 'tax'},
          {headerName: '含税单价', field: 'priceIncludeTax'},
          {headerName: '无税金额', field: 'salePriceExclusiveTax'},
          {headerName: '价税合计', field: 'salePriceIncludeTax'},
          {headerName: '仓库', field: 'warehouseName'}
        ],
        rowData:[],
        detailRowData:[],
        headerData:[],
        dateValue:[],
        searchCol:{},
        nowDate:'',
        startTime:'',
        endTime:'',
        couldStamp:false,
        stampId:null,
        approvalId:0,
        approval:{
          cannotApproval:true,
          cannotSendApproval:true,
          cannotAbandonApproval:true
        },
        couldUpdate:true,
        importUrl:'',
        upLoadData: {
          selectedSaleOrderTime: '',
          channelId:'',
          uid:'',
          supplierId:''
        },
        channelList:[],
        supplierList:[],
        salesForm: {
          code:''
        },
        couldDel:false,
        delId:null


      }
    },
    created:function () {
      this.$root.$off('refreshSettlementData');
      this.$root.$on('refreshSettlementData',()=>{
        this.fetchData(1);
      });
      this.$root.$off('search:settlementSearchForm');
      this.$root.$on('search:settlementSearchForm',()=>{
        this.searchData();
      });

      this.$root.$off('search:searchSalesForm');
      this.$root.$on('search:searchSalesForm',()=>{
        this.searchSales();
      });

    },
    mounted: function() {
      this.getNowTime();
      this.startTime = this.nowDate;
      this.endTime = this.nowDate;
      //  console.info(this.startTime);
      this.dateValue[0] = this.nowDate;
      this.dateValue[1] = this.nowDate;
      this.fetchData(this.currentPage);
    },
    methods: {
      onRowSelected: function (event) {
        let row = event.row;
        let node = event.node;
        this.stampId = row.id;
        this.couldStamp = true;
        this.couldDel =true;
        this.delId = row.id;
        findDetail(JSON.stringify({"settlementId": row.id})).then((response) => {
          if (response.code == 0) {
            this.detailRowData = response.data;
            event.row.list = response.data;
          }
        });
        this.approvalId = row.approvalId;
        this.loadApprovalButtons();

      },
      onPageChanged: function (page) {
        this.fetchData(page);
      },
      onRowDoubleClicked: function (event) {
        //  console.log(event.data.id);
      },
      onModifyTableCellValueChanged: function (event) {
        this.hasModify = true
      },
      showSearchForm: function () {
        this.$root.$emit('showSearch:settlementSearchForm');
      },
      showImportForm: function () {
        findAllChannel().then((response)=>{
          this.channelList = response.data;
        });
        findAllSupplier().then((response)=>{
          this.supplierList = response.data;
        });
        this.fileList =[];
        this.$root.$emit('showImport:salesImportForm');
        this.importUrl = process.env.BASE_API + config.ApiURL.sales_importsalesorder;
        this.upLoadData.selectedSaleOrderTime = "";
        this.upLoadData.channelId='';
        this.upLoadData.supplierId='';
        this.upLoadData.uid=getUid();
      },
      cancelModify: function () {
        this.$root.$emit('hideModify:purchaseModify');
      },
      goCreateView: function () {
        this.$router.push({name: 'demoCreate'});
      },
      fetchData: function (pageNo) {
        this.couldStamp = false;
        this.getNowTime();
        this.searchCol = {
          "code": this.form.code,
          "startDate": this.startTime,
          "endDate": this.endTime,
          "pageNum": pageNo,
          "pageSize": this.pageSize,
          "approvalStatus": this.form.status
        }
        findPage(JSON.stringify(this.searchCol)).then((response) => {
          if (response.code == 0) {
            this.rowData = response.data;
            this.currentPage = response.pagination.pageNum;
            this.pageSize = response.pagination.pageSize;
            this.total = response.pagination.total;
            this.detailRowData = [];
          }
        })
      },
      addSales: function () {
        this.$store.dispatch('ShowAddSalesDetail').then(() => {
        });
      },
      searchData: function () {
        //   console.info(this.dateValue);
        if ('' != this.dateValue && null != this.dateValue) {
          this.startTime = this.dateValue[0];
          this.endTime = this.dateValue[1];

        } else {
          this.startTime = '';
          this.endTime = '';

        }
        this.fetchData(1);
      },
      getNowTime: function () {
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1 + '';
        var day = new Date().toLocaleDateString().substring(new Date().toLocaleDateString().lastIndexOf('/') + 1) + '';
        if (month.length == 1) {
          month = '0' + month;
        }
        if (day.length == 1) {
          day = '0' + day;
        }
        this.nowDate = year + '-' + month + '-' + day;
      },

      printPDF: function () {
        //  console.info(this.stampId);
        window.open(process.env.BASE_API + config.ApiURL.requistionorder_producepdf + "?requistionOrderId=" + this.stampId);
      },
      execCommand: function (command) {
        let param = {
          "approvalId": this.approvalId,
          "approvalType": "JS"
        }
        if ('sendApproval' == command) {
          sendApproval(JSON.stringify(param)).then((response) => {
            if (response.code == 0) {
              this.fetchData(this.currentPage);
            }
          })
          this.$root.$emit('refreshSettlementData',null);
        } else if ('abandonApproval' == command) {
          abandonApproval(JSON.stringify(param)).then((response) => {
            if (response.code == 0) {
              this.fetchData(this.currentPage);
            }
          })
        }
      },
      accessoryCommand: function (command) {
        if ('approvalStream' == command) {
          let psEvent = {
            show: true,
            approval: false,
            approvalType: 'JS',
            approvalId: this.approvalId
          };
          this.$store.dispatch('ShowApprovalStream', psEvent).then(() => {
          });
        }
      },
      loadApprovalButtons: function () {
        let param = {
          "approvalId": this.approvalId
        }
        loadApprovalButtons(JSON.stringify(param)).then((response) => {
          if (response.code == 0) {
            this.approval = response.data;
          }
        })
      },
      doApproval: function () {
        let psEvent = {
          show: true,
          approval: true,
          approvalType: 'JS',
          approvalId: this.approvalId
        };
        this.$store.dispatch('ShowApprovalStream', psEvent).then(() => {
        });
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      beforeAvatarUpload(file) {
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        let timeFlag =true;
        let channelFlag =true;
        let buFlag =true;
        if ('' ==this.upLoadData.selectedSaleOrderTime) {
          this.$alert('销售时间不能为空', '提示', {
            confirmButtonText: '确定',
          })
          timeFlag =false;
        }
        if ('' ==this.upLoadData.channelId) {
          this.$alert('平台不能为空', '提示', {
            confirmButtonText: '确定',
          })
          channelFlag =false;
        }
        if ('' ==this.upLoadData.supplierId) {
          this.$alert('客商不能为空', '提示', {
            confirmButtonText: '确定',
          })
          buFlag =false;
        }
        if (!extension && !extension2) {
          this.$alert('上传文件只能是 xls、xlsx格式!', '提示', {
            confirmButtonText: '确定',
          })
        }

        return (extension || extension2) && timeFlag && channelFlag && buFlag
      },
      handleAvatarSuccess:function (res, file) {
        //console.info("res====="+res.code);
        if(res.code == 0){
          this.$alert('上传成功', '提示', {
            confirmButtonText: '确定',
          })
          this.$root.$emit("hideImport:salesImportForm",null);
          this.$root.$emit('refreshData',null);
        }else{
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
          })
        }
      },
      importSales:function () {
        this.$root.$emit('showSearch:searchSalesForm');
      },

      searchSales:function () {
        let param ={
          "code":this.salesForm.code,
          "salesType":"N"
          /*"pageNum":1,
          "pageSize":this.pageSize*/
        }
        let dataEvent ={
          show:true,
          searchParam:param
        };
        this.$store.dispatch('ShowImportSettlement',dataEvent).then(()=>{});
      },
      delSettlement:function () {
        this.$confirm("确定删除该结算单?", "提示", {
          type:'info',
          callback:(action, instance)=>{
            if('confirm' == action){
              delSettlement(JSON.stringify({"id":this.delId})).then((response)=>{
                  if(response.code == 0 ){
                    this.$message({message: '删除成功', type: 'success'});
                    this.$root.$emit('refreshSettlementData',null);
                  }
                }
              );

            }
          }
        });
      }


    }

  }
</script>

<style scoped>

</style>
