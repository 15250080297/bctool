<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <el-button class="action-item" type="primary" @click="addRequistion">{{$t('button.add')}}</el-button>
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


      <el-button class="action-item" type="primary" :disabled="couldStamp ? false : true" @click="printPDF">{{$t('button.stamp')}}</el-button>
    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="requistionSearchForm" title="请购单查询">
      <el-form :model="form">
        <el-form-item label="请购日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" align="center" >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请购单号" :label-width="formLabelWidth">
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
    <RequistionEdit ></RequistionEdit>

    <RequistionAdd ></RequistionAdd>

  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import SCModify from '@/components/SCModify'
  import { findPage,findDetail,producePDF,couldUpdate } from '@/api/requistion'
  import RequistionEdit from './RequistionEdit.vue'
  import RequistionAdd from './RequistionAdd.vue'
  import config from '@/config'
  import { sendApproval,loadApprovalButtons,abandonApproval} from '@/api/approval'
  import ApprovalStream from '@/components/ApprovalStream'
  export default {
    name: 'tab',
    components: {ActionBar,SCContent, SCTable, SCSearch, SCDateRange,RequistionEdit,RequistionAdd,ApprovalStream},
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
        formLabelWidth: '120px',
        columnDefs: [
          {headerName: '请购单号', field: 'code'},
          {headerName: '请购日期', field: 'requisitionTime'},
          {headerName: '事业部', field: 'buName'},
          {headerName: '制单人', field: 'createName'},
          {headerName: '审批人', field: 'approvalUserName'},
          {headerName: '制单时间', field: 'createTime'},
          {headerName: '最后修改人', field: 'updateName'},
          {headerName: '最后修改时间', field: 'updateTime'},
          {headerName: '备注', field: 'remark'}
        ],
        detailColumnDefs:[
          {headerName: '存货编码', field: 'erpCode', editable: false},
          {headerName: '存货名称', field: 'productName'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'},
          {headerName: '计量单位', field: 'weightUnitId'},
          {headerName: '数量', field: 'amount'},
          {headerName: '需求日期', field: 'needTime'},
          {headerName: '总库存', field: 'grossInventory'},
          {headerName: '所属平台', field: 'channelId'},
          {headerName: '平台库存', field: 'channelInventory'},
          {headerName: '平台日销售', field: 'channelDms'},
          {headerName: '平台库存天数', field: 'channelDih'},
          {headerName: '总计库存可销天数', field: 'grossDih'},
          {headerName: '预计可销天数', field: 'expectDih'},
          {headerName: '供应商', field: 'supplierName'}
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
        couldUpdate:true

      }
    },
    created:function () {
      this.$root.$off('refreshData');
      this.$root.$on('refreshData',()=>{
        this.fetchData(1);
      });
      this.$root.$off('search:requistionSearchForm');
      this.$root.$on('search:requistionSearchForm',()=>{
          this.searchData();
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
        this.stampId = row.id;
        this.couldStamp = true;
        findDetail(JSON.stringify({"requistionOrderId":row.id})).then((response)=>{
          if(response.code == 0){
            this.detailRowData = response.data;
            event.row.list = response.data;
          }
        });
        this.approvalId = row.approvalId;
        this.loadApprovalButtons();

      },
      onPageChanged:function (page) {
        this.fetchData(page);
      },
      onRowDoubleClicked:function (event) {
      //  console.log(event.data.id);
        couldUpdate(JSON.stringify({"requistionOrderId":event.data.id})).then((response)=>{
            console.info(response.data)
              if(!response.data){
                this.$alert('该请购单已被引用，无法修改', '提示', {
                  confirmButtonText: '确定',
                });
              }else{
                  this.$store.dispatch('ShowRequistionDetail', event.data).then(()=>{
                  });
              }
          }
        );



      },
      onModifyTableCellValueChanged:function (event) {
        this.hasModify = true
      },
      showSearchForm:function () {
        this.$root.$emit('showSearch:requistionSearchForm');
      },
      cancelModify:function () {
        this.$root.$emit('hideModify:purchaseModify');
      },
      goCreateView:function () {
        this.$router.push({name:'demoCreate'});
      },
      fetchData: function(pageNo) {
        this.couldStamp = false;
        this.getNowTime();
        this.searchCol ={
          "code":this.form.code,
          "startDate":this.startTime,
          "endDate":this.endTime,
          "pageNum":pageNo,
          "pageSize":this.pageSize,
          "approvalStatus":this.form.status
        }
        findPage(JSON.stringify(this.searchCol)).then((response) => {
          if(response.code == 0 ){
            this.rowData = response.data;
            this.currentPage =response.pagination.pageNum;
            this.pageSize =response.pagination.pageSize;
            this.total =response.pagination.total;
            this.detailRowData =[];
          }
        })
      },
      addRequistion:function () {
        this.$store.dispatch('ShowAddRequistionDetail').then(()=>{});
      },
      searchData:function () {
     //   console.info(this.dateValue);
        if('' != this.dateValue && null != this.dateValue){
          this.startTime = this.dateValue[0];
          this.endTime = this.dateValue[1];

        }else{
          this.startTime = '';
          this.endTime = '';

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

      printPDF:function () {
       //  console.info(this.stampId);
        window.open(process.env.BASE_API+config.ApiURL.requistionorder_producepdf+"?requistionOrderId="+this.stampId);
      },
      execCommand:function (command) {
        let param = {
          "approvalId": this.approvalId,
          "approvalType": "QG"
        }
        if('sendApproval' == command) {
          sendApproval(JSON.stringify(param)).then((response) => {
            if (response.code == 0) {
              this.fetchData(this.currentPage);
            }
          })
          this.$root.$emit('refreshData',null);
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
            approvalType:'QG',
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
          approvalType:'QG',
          approvalId:this.approvalId
        };
        this.$store.dispatch('ShowApprovalStream',psEvent).then(()=>{});
      }
    }

  }
</script>

<style scoped>

</style>
