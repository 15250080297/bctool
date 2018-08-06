<template>

  <el-dialog title="销售订单生成结算单"
             :visible.sync="dataEvent.show"
             width="70%"
             center>
    <SCContent>
      <!--列表 -->
      <SCTable :columnDefs="columnDefs"
               :rowData="rowData"
               :editable="false"
               :autoResize="true"
               :enablePagination="false"
               :suppressRowClickSelection="true"
               :showTool="false"
               @onCellClicked="onCellClicked"
               @selectCurrentNode="selectCurrentNode"
               >
      </SCTable>
      <!--详情 -->
      <SCTable :columnDefs="detailColumnDefs"
               :editable="false"
               :autoResize="true"
               :enablePagination="false"
               :showTool="false"
               :rowData="detailRowData">
      </SCTable>
    </SCContent>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancelClick">取 消</el-button>
      <el-button type="primary" @click="onProSelect">确 定</el-button>
    </span>

  </el-dialog>

</template>

<script>
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import {getStorageList,getStorageDetailList} from '@/api/storage'
  import { findPage,findDetail ,couldUpdate} from '@/api/sales'
  import { addSettlement} from '@/api/settlement'
  export default {

    components: {SCContent, SCTable},
    computed:{
      dataEvent:function () {
        this.getSettlementData();
        this.detailRowData = [];
        return this.$store.state.settlement.importSettlementEvent;
      }
    },
    data() {
      return {
        formLabelWidth: '120px',
        columnDefs: [
          {headerName: '单据号', field: 'code',checkboxSelection: true},
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
        selectSettlementData:{},
        selectSettlementDetailData:[]
      }
    },
    mounted:function () {

    },
    methods:{
      onProSelect:function () {
        if( !this.selectSettlementData.id ){
          this.$alert('请选择销售订单', '提示', {
            confirmButtonText: '确定',
          })
        }else{
          this.hide();
          let data ={};
          data = this.selectSettlementData;
          data.sourceId = this.selectSettlementData.id;
          data.addList = this.selectSettlementDetailData;
          addSettlement(JSON.stringify(data)).then((response)=>{
            if(response.code == 0 ){
              this.$message({message: '添加成功', type: 'success'});
            }
            this.$root.$emit('refreshSettlementData','');
          });
          /* let data = {};
           data.selectSettlementData = this.selectSettlementData;
           data.selectSettlementDetailData = this.selectSettlementDetailData;
           this.$store.dispatch('ShowAddSettlementDetail',data).then(()=>{});*/
        }

      },
      onCancelClick:function () {
        this.hide();
      },
      hide:function () {
        this.$store.dispatch('HideImportSettlement').then(()=>{});
      },
      getSettlementData:function () {
        if(this.$store.state.settlement.importSettlementEvent.searchParam) {
          findPage(JSON.stringify(this.$store.state.settlement.importSettlementEvent.searchParam)).then((response) => {
            if (response.code == 0) {
              this.rowData = response.data;
            }
          })
        }
      },
      onCellClicked:function (event) {
        let selectId = event.data.id;
        this.loadDetail(selectId);
      },
      loadDetail(selectId){
        findDetail(JSON.stringify({"salesOrderId": selectId})).then((response) => {
          if (response.code == 0) {
            this.detailRowData = response.data;
            this.selectSettlementDetailData = response.data;
          }
        });
      },
      selectCurrentNode:function (node) {
        if(node.selected == true){
          let selectId = node.data.id;
          this.loadDetail(selectId);
          this.selectSettlementData = node.data;
        }
      }
    }
  }
</script>

<style scoped>


</style>
