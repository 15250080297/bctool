<template>

  <el-dialog title="请购单生成采购单"
             :visible.sync="dataEvent.show"
             width="70%"
             center>
      <SCContent>
        <!--列表 -->
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :editable="false"
                 :enablePagination="false"
                 :showTool="false"
                 :suppressRowClickSelection="true"
                 :multiple="true"
                 @selectCurrentNode="selectCurrentNode"
                 @onCellClicked="onCellClicked"
                 @tableInstance="tableParentInstance">
        </SCTable>
        <!--详情 -->
        <SCTable :columnDefs="detailColumnDefs"
                 :editable="false"
                 :autoResize="true"
                 :enablePagination="false"
                 :showTool="false"
                 :suppressRowClickSelection="true"
                 :multiple="true"
                 :rowData="detailRowData"
                 @selectCurrentNode="detailSelectCurrentNode"
                 @tableInstance="tableDetailInstance"
                 :selectCheckbox="selectCheckbox"
                 :unSelectCheckbox="unSelectCheckbox"
                 :selectDetailIds="selectDetailIds">
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
  import { findPage,findDetail } from '@/api/requistion'
  export default {

    components: {SCContent, SCTable},
    computed:{
      dataEvent:function () {
        this.getRequistionData();
        this.detailRowData = [];
        this.selectParentId = 0;
        this.selectDetailIds = [];
        this.selectDetailIdsWithId = {};
        return this.$store.state.purchase.importRequistionEvent;
      }
    },
    data() {
      return {
        formLabelWidth: '120px',
        columnDefs: [
          {headerName: '请购单号', field: 'code',checkboxSelection: true},
          {headerName: '请购日期', field: 'requisitionTime'},
          {headerName: '事业部', field: 'buName'},
          {headerName: '制单人', field: 'createName'},
          {headerName: '审批人', field: 'approvalId'},
          {headerName: '制单时间', field: 'createTime'},
          {headerName: '最后修改人', field: 'updateName'},
          {headerName: '最后修改时间', field: 'updateTime'},
          {headerName: '备注', field: 'remark'}
        ],
        detailColumnDefs:[
          {headerName: '存货编码', field: 'erpCode',checkboxSelection: true},
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
        rowSelectNodes:{},
        detailSelectNodes:{},
        detailInstance:{},
        selectCheckbox:false,
        unSelectCheckbox:false,
        selectDetailIds:[],
        selectParentId:0,
        selectDetailIdsWithId:{},
        selectParentIds:[],
        parentInstance:{},
        selectAllCheckbox:true
      }
    },
    mounted:function () {

    },
    methods:{
      onProSelect:function () {
        //console.log(this.selectDetailIdsWithId);
        let dataList = [];
        for(let selectDetail in this.selectDetailIdsWithId){
            for(let rowSelect in this.rowSelectNodes){
                if(selectDetail == rowSelect){
                  for(let detail of this.rowSelectNodes[rowSelect]){
                      for(let detailIds of this.selectDetailIdsWithId[selectDetail]){
                          if(detail.id == detailIds){
                            dataList.push(detail);
                          }
                      }
                  }
                }
            }
        }
        let tmp;
        for(let oneData of dataList){
            oneData.amount = oneData.statusCount;
            if(tmp){
              if(tmp != oneData.supplierId){
                this.$alert('只能选择同一家供应商的商品', '提示', {
                  confirmButtonText: '确定',
                });
                return;
              }
            }else{
              tmp = oneData.supplierId;
            }
        }
        let data = {"list":dataList};
        console.log(data);
        this.hide();
        this.$store.dispatch('ShowAddPurchaseDetail',data).then(()=>{});
      },
      onCancelClick:function () {
        this.hide();
      },
      hide:function () {
        this.$store.dispatch('HideImportRequistion').then(()=>{});
      },
      getRequistionData:function () {
          if(this.$store.state.purchase.importRequistionEvent.searchParam) {
            findPage(JSON.stringify(this.$store.state.purchase.importRequistionEvent.searchParam)).then((response) => {
              if (response.code == 0) {
                this.rowData = response.data;
              }
            })
          }
      },
      selectCurrentNode:function (node) {
        console.log('checkbox click');
        //console.log('row: ' + node.data.id + ':' + node.selected);
        let selectId = node.data.id;
        let isNotLoadNewData;
        if(this.selectParentId == selectId){
          isNotLoadNewData = true;
        }else {
          isNotLoadNewData = false;
        }
        this.selectParentId = selectId;
        //this.selectDetailIds = this.selectDetailIdsWithId[this.selectParentId];
        let index = this.selectParentIds.indexOf(selectId);
        if(node.selected == true){
          if(isNotLoadNewData){
            if(this.selectAllCheckbox) {
              this.detailInstance.api.selectAll();
            }
          }else {
            if(this.selectAllCheckbox) {
              this.selectCheckbox = true;
            }else {
              this.selectCheckbox = false;
            }
            this.unSelectCheckbox = false;
            this.loadDetail(selectId);
          }
          if(index < 0){
            this.selectParentIds.push(selectId);
          }
          this.selectAllCheckbox = true;
        }
        else if(node.selected == false){
          if(isNotLoadNewData) {
            this.detailInstance.api.deselectAll();
          }else{
            this.unSelectCheckbox = true;
            this.selectCheckbox=false;
            this.loadDetail(selectId);
          }
          if(this.selectParentIds.length > 0 && index > -1) {
            this.selectParentIds.splice(index,1);
          }
        }
      },
      onCellClicked:function (event) {
        console.log('cell click');
        let selectId = event.data.id;
        this.selectParentId = selectId;
        this.selectDetailIds = this.selectDetailIdsWithId[this.selectParentId];
        //console.log('row: ' + selectId + ':' + event.selected);
        console.log(this.selectDetailIds);
        this.selectCheckbox=false;
        this.unSelectCheckbox = false;
        this.loadDetail(selectId);
      },
      detailSelectCurrentNode:function (node) {
        //console.log(node);
        let selectTempExclusive = this.selectDetailIdsWithId[this.selectParentId];
        if(!selectTempExclusive){
          selectTempExclusive = [];
        }
        let index = selectTempExclusive.indexOf(node.data.id);
        if(node.selected == true) {
            if(index < 0) {
              selectTempExclusive.push(node.data.id);
            }
            this.selectDetailIdsWithId[this.selectParentId] = selectTempExclusive;
            let parentIndex = this.selectParentIds.indexOf(node.data.requisitionOrderId);
            if(parentIndex < 0) {
              console.log('need select parent : ' + node.data.requisitionOrderId);
              this.parentInstance.api.forEachNode( (parentNode) => {
                  //console.log(node);
                if(node.data.requisitionOrderId == parentNode.data.id){
                  parentNode.setSelected(true);
                  this.selectAllCheckbox = false;
                }
              });
            }
        }
        else if(node.selected == false){
          if(selectTempExclusive.length > 0 && index > -1) {
             selectTempExclusive.splice(index,1);
          }
          this.selectDetailIdsWithId[this.selectParentId] = selectTempExclusive;
          let parentIndex = this.selectParentIds.indexOf(node.data.requisitionOrderId);
          if(parentIndex > -1 && selectTempExclusive.length == 0) {
            console.log('need unSelect parent : ' + node.data.requisitionOrderId);
            this.parentInstance.api.forEachNode( (parentNode) => {
              if(node.data.requisitionOrderId == parentNode.data.id){
                parentNode.setSelected(false);
              }
            });
          }
        }
        console.log(selectTempExclusive);
        //console.log(this.selectDetailIds);
      },
      tableDetailInstance:function (instance) {
          //console.log('int instance');
        this.detailInstance = instance;
      },
      tableParentInstance:function (instance) {
        //console.log('int instance');
        this.parentInstance = instance;
      },
      loadDetail(selectId){
        //if(this.rowSelectNodes[selectId]){
          //this.detailRowData = this.rowSelectNodes[selectId];
        //}else {
          findDetail(JSON.stringify({"requistionOrderId": selectId})).then((response) => {
            if (response.code == 0) {
              this.rowSelectNodes[selectId] = response.data;
              this.detailRowData = response.data;
            }
          });
        //}
      }
    }
  }
</script>

<style scoped>


</style>
