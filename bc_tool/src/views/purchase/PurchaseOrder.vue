<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <!--<el-button class="action-item" type="primary" @click="addData">{{$t('button.add')}}</el-button>-->
      <el-button class="action-item" type="primary" @click="importRequistion">{{$t('button.imp')}}</el-button>
      <el-button class="action-item" type="primary" @click="proPrRefundOrder" :disabled="canNotProRefund">{{$t('button.proPrRefundOrder')}}</el-button>
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

    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="searchForm" title="采购单查询">
      <el-form :model="form">
        <el-form-item label="采购日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采购单号" :label-width="formLabelWidth">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="审批状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="状态">
            <el-option label="所有" value=""></el-option>
            <el-option label="审批中" value="P"></el-option>
            <el-option label="审批通过" value="S"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </SCSearch>

    <SCSearch id="searchRequistionForm" title="请购单查询">
      <el-form :model="requistionForm">
        <el-form-item label="请购单号" :label-width="formLabelWidth">
          <el-input v-model="requistionForm.code"></el-input>
        </el-form-item>
        <el-form-item label="请购日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="requistionDateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </SCSearch>

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


    <PurchaseEdit ></PurchaseEdit>

    <PurchaseAdd ></PurchaseAdd>

    <ApprovalStream></ApprovalStream>

    <RequistionImport></RequistionImport>

    <PrRefundAdd></PrRefundAdd>

  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import SCModify from '@/components/SCModify'
  import { getList,getDetailList,loadCanProRefund} from '@/api/purchase'
  import { sendApproval,loadApprovalButtons,abandonApproval} from '@/api/approval'
  import PurchaseEdit from './PurchaseEdit.vue'
  import PurchaseAdd from './PurchaseAdd.vue'
  import RequistionImport from './RequistionImport.vue'
  import PrRefundAdd from './PrRefundAdd.vue'
  import ApprovalStream from '@/components/ApprovalStream'

  export default {
    name: 'tab',
    components: {ActionBar,SCContent, SCTable, SCSearch, SCDateRange,PurchaseEdit,PurchaseAdd,PrRefundAdd,RequistionImport,ApprovalStream},
    data() {
      return {
        gridOptions:{
          defaultColDef:{
            editable: false
          }
        },
        currentPage:1,
        total:0,
        pageSize:6,
        form: {
          code:'',
          status: ''
        },
        formLabelWidth: '120px',
        columnDefs: [
          {headerName: '公司', field: 'companyName'},
          {headerName: '采购单号', field: 'code'},
          {headerName: '采购日期', field: 'orderTime'},
          {headerName: '供应商', field: 'supplierName'},
          {headerName: '事业部', field: 'buName'},
          /*{headerName: '审批状态', field: 'approvalStatus'},*/
          {headerName: '备注', field: 'remark'},
          {headerName: '制单人', field: 'creatorName'},
          {headerName: '修改人', field: 'updaterName'},
          {headerName: '审批人', field: 'approvalUserName'},
          {headerName: '制单时间', field: 'createTime'},
          {headerName: '修改时间', field: 'updateTime'},
          {headerName: '审批时间', field: 'approvalTime'}
        ],
        detailColumnDefs:[
          {headerName: '存货编码', field: 'erpCode'},
          {headerName: '存货名称', field: 'productName'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'},
          {headerName: '计量单位', field: 'weightUnitId'},
          {headerName: '数量', field: 'amount'},
          {headerName: '含税单价', field: 'priceIncludeTax'},
          {headerName: '单价', field: 'priceExclusiveTax'},
          {headerName: '净含税单价', field: 'netPriceIncludeTax'},
          {headerName: '净单价', field: 'netPriceExclusiveTax'},
          {headerName: '金额', field: 'money'},
          {headerName: '税率', field: 'taxRate'},
          {headerName: '税额', field: 'tax'},
          {headerName: '价税合计', field: 'sumMoney'},
          {headerName: '是否有赠品', field: 'isGiftCheckbox',cellRenderer: this.checkboxCellRenderer, editable: false},
          {headerName: '赠品数量', field: 'giftNum'},
          {headerName: '备注', field: 'remark'}
        ],
        rowData:[],
        detailRowData:[],
        headerData:[],
        dateValue:[],
        requistionDateValue:[],
        searchCol:{},
        nowDate:'',
        startTime:'',
        endTime:'',
        approvalId:0,
        approval:{
          cannotApproval:true,
          cannotSendApproval:true,
          cannotAbandonApproval:true
        },
        requistionForm: {
          code:''
        },
        canNotProRefund:true,
        selectRow:{}
      }
    },
    created:function () {
      this.$root.$off('refreshData');
      this.$root.$on('refreshData',()=>{
        /* this.startTime = this.nowDate;
         this.endTime = this.nowDate;
         this.searchCol.code ='';*/
        this.fetchData(1);
      });
      this.$root.$off('search:searchForm');
      this.$root.$on('search:searchForm',()=>{
        this.searchData();
      });
      this.$root.$off('search:searchRequistionForm');
      this.$root.$on('search:searchRequistionForm',()=>{
        this.searchRequistion();
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
      onRowSelected:function (event) {
        let row = event.row;
        let node = event.node;
        getDetailList(JSON.stringify({"purchaseOrderId":row.id})).then((response)=>{
          if(response.code == 0){
            this.detailRowData = response.data;
            event.row.list = response.data;
            this.selectRow = event.row;
          }
        });
        this.approvalId = row.approvalId;
        this.loadApprovalButtons();
        this.loadCanProRefund(row);
      },
      onPageChanged:function (page) {
        this.fetchData(page);
      },
      onRowDoubleClicked:function (event) {
        this.$store.dispatch('ShowPurchaseDetail', event.data).then(()=>{

        });

      },
      showSearchForm:function () {
        this.$root.$emit('showSearch:searchForm');
      },
      fetchData: function(pageNo) {
        this.canNotProRefund = true;
        this.getNowTime();
        this.searchCol ={
          "type":'C',
          "code":this.form.code,
          "approvalStatus":this.form.status,
          "startDate":this.startTime,
          "endDate":this.endTime,
          "pageNum":pageNo,
          "pageSize":this.pageSize
        }
        getList(JSON.stringify(this.searchCol)).then((response) => {
          if(response.code == 0 ){
            this.rowData = response.data;
            this.currentPage =response.pagination.pageNum;
            this.pageSize =response.pagination.pageSize;
            this.total =response.pagination.total;
          }
        })
      },
      addData:function () {
        this.$store.dispatch('ShowAddPurchaseDetail').then(()=>{});
      },
      searchData:function () {
        //   console.info(this.dateValue);
        if('' != this.dateValue && null != this.dateValue){
          this.startTime = this.dateValue[0];
          this.endTime = this.dateValue[1];

        }else{
          //if(''==this.form.code ){
            //this.startTime = this.nowDate;
            //this.endTime = this.nowDate;
          //}else{
            this.startTime = '';
            this.endTime = '';
          //}

        }
        this.fetchData(1);
      },
      getNowTime:function () {
        var year =new Date().getFullYear();
        var month =new Date().getMonth()+1+'';
        var day =new Date().toLocaleDateString().substring(new Date().toLocaleDateString().lastIndexOf('/')+1)+'';
        if(month.length ==1){
          month='0'+month;
        }
        if(day.length ==1){
          day='0'+day;
        }
        this.nowDate = year+'-'+month+'-'+day;
      },
      execCommand:function (command) {
        let param = {
          "approvalId": this.approvalId,
          "approvalType": "CG"
        }
        if('sendApproval' == command) {
          sendApproval(JSON.stringify(param)).then((response) => {
            if (response.code == 0) {
              this.fetchData(this.currentPage);
            }
          })
        }else if('abandonApproval' == command){
          abandonApproval(JSON.stringify(param)).then((response) => {
            if (response.code == 0) {
              this.fetchData(this.currentPage);
            }
          })
        }
      },
      accessoryCommand:function (command) {
        if('approvalStream' == command){
          let psEvent ={
            show:true,
            approval:false,
            approvalType:'CG',
            approvalId:this.approvalId
          };
          this.$store.dispatch('ShowApprovalStream',psEvent).then(()=>{});
        }
      },
      loadApprovalButtons:function () {
        let param = {
          "approvalId": this.approvalId
        }
        loadApprovalButtons(JSON.stringify(param)).then((response) => {
          if (response.code == 0) {
            this.approval = response.data;
          }
        })
      },
      doApproval:function () {
        let psEvent ={
         show:true,
         approval:true,
         approvalType:'CG',
         approvalId:this.approvalId
         };
         this.$store.dispatch('ShowApprovalStream',psEvent).then(()=>{});
      },
      importRequistion:function () {
        this.$root.$emit('showSearch:searchRequistionForm');
      },
      searchRequistion:function () {
        let startDate;
        let endDate;
        if('' != this.requistionDateValue && null != this.requistionDateValue){
          startDate = this.requistionDateValue[0];
          endDate = this.requistionDateValue[1];
        }
        let param ={
          "code":this.requistionForm.code,
          "approvalStatus": "S",
          "startDate":startDate,
          "endDate":endDate
        }
        let dataEvent ={
          show:true,
          searchParam:param
        };
        this.$store.dispatch('ShowImportRequistion',dataEvent).then(()=>{});
      },
      checkboxCellRenderer:function (params) {
          let input = document.createElement("input");
          input.type = "checkbox";
          input.disabled = true;
          if(params.data.isGift == 'Y'){
            input.checked = true;
          }
          return input;
      },
      loadCanProRefund:function (row) {
        let param = {
          "code": row.code
        }
        loadCanProRefund(JSON.stringify(param)).then((response) => {
          if (response.code == 0) {
              if('Y' == response.data) {
                this.canNotProRefund = false;
              }else {
                this.canNotProRefund = true;
              }
          }
        })
      },
      proPrRefundOrder:function () {
        this.$store.dispatch('ShowPrOrderAdd',this.selectRow).then(()=>{

        });
      }
    }

  }
</script>

<style scoped>

</style>
