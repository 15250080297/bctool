<template>

  <el-dialog title="入库单生成销售发票"
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
                 @selectCurrentNode="selectCurrentNode">
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
  export default {

    components: {SCContent, SCTable},
    computed:{
      dataEvent:function () {
        this.getStorageData();
        this.detailRowData = [];
        return this.$store.state.invoice.importStorageEvent;
      }
    },
    data() {
      return {
        formLabelWidth: '120px',
        columnDefs: [
          {headerName: '单据号', field: 'code',checkboxSelection: true},
          {headerName: '单据日期', field: 'orderTime'},
          {headerName: '仓库', field: 'warehouseName'},
          {headerName: '库存组织TODO', field: 'TODO'},
          {headerName: '收发类别', field: 'sendReceiveType'},
          {headerName: '库管员TODO', field: 'subjectAccountName'},
          {headerName: '供应商', field: 'supplierName'},
          {headerName: '备注', field: 'remark'},
          {headerName: '是否退库', field: 'isReturn'},
          {headerName: '制单人', field: 'creatorName'},
          {headerName: '制单时间', field: 'createTime'},
          {headerName: '签字人', field: 'signerName'},
          {headerName: '签字时间', field: 'signTime'},
          {headerName: '最后修改人', field: 'updaterName'},
          {headerName: '最后修改时间', field: 'updateTime'}
        ],
        detailColumnDefs:[
          {headerName: '存货编码', field: 'erpCode'},
          {headerName: '存货名称', field: 'name'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'},
          {headerName: '单位', field: 'unitName'},
          {headerName: '批次号', field: 'batch'},
          {headerName: '生产日期', field: 'genetationTimeStr'},
          {headerName: '失效日期', field: 'expirationTimeStr'},
          {headerName: '应收数量', field: 'expectAmount'},
          {headerName: '实收数量', field: 'realAmount'},
          {headerName: '入库日期', field: 'createTime'},
          {headerName: '是否赠品', field: 'isGift'},
          {headerName: '备注', field: 'remark'}
        ],
        rowData:[],
        detailRowData:[],
        selectStorageData:{},
        selectStorageDetailData:[]
      }
    },
    mounted:function () {

    },
    methods:{
      onProSelect:function () {
        this.hide();
        let data = {};
        data.selectStorageData = this.selectStorageData;
        data.selectStorageDetailData = this.selectStorageDetailData;
        this.$store.dispatch('ShowInvoiceAdd',data).then(()=>{});
      },
      onCancelClick:function () {
        this.hide();
      },
      hide:function () {
        this.$store.dispatch('HideImportStorage').then(()=>{});
      },
      getStorageData:function () {
          if(this.$store.state.invoice.importStorageEvent.searchParam) {
            getStorageList(JSON.stringify(this.$store.state.invoice.importStorageEvent.searchParam)).then((response) => {
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
        getStorageDetailList(JSON.stringify({"storeId": selectId})).then((response) => {
            if (response.code == 0) {
              this.detailRowData = response.data;
              this.selectStorageDetailData = response.data;
            }
        });
      },
      selectCurrentNode:function (node) {
        if(node.selected == true){
          let selectId = node.data.id;
          this.loadDetail(selectId);
          this.selectStorageData = node.data;
        }
      }
    }
  }
</script>

<style scoped>


</style>
