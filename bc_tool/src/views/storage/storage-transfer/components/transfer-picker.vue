<template>

  <el-dialog title="采购单选择"
             :visible.sync="showPicker.flag"
             width="780px"
             center
  >
    <WarehousePicker></WarehousePicker>
    <div class="cell-transfer">
      <SCContent>
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :enablePagination="false"
                 :showTool="false"
                 :gridOptions="gridOptions"
                 @selectCurrentNode="selectCurrentNode"
                 @onRowSelected="onRowSelected"
                 @onCellDoubleClicked="onCellDoubleClicked"

                 :height="250">
        </SCTable>

        <SCTable :columnDefs="columnDetailDefs"
                 :rowData="detailRowData"
                 :enablePagination="false"
                 @onCellValueChanged="onModifyTableCellValueChanged"
                 :showTool="false"
                 :height="250">
        </SCTable>
      </SCContent>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取 消</el-button>
        <el-button type="primary" @click="onOkClick">确 定</el-button>
      </span>

  </el-dialog>

</template>


<script>
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import WarehousePicker from './WarehousePicker'

  import { getList,getDetailList } from '@/api/purchase'
  import { saveStoreOrder } from '@/api/storage'

  export default {
    name: "transferPicker",
    components:{SCContent,SCTable,WarehousePicker},
    computed:{
      showPicker(){
        this.initBatch()
        let eve = this.$store.state.storage.addEvent;
        console.log('eve',eve)
        // console.log('eve1',eve.cellData)
        if(eve.flag ===false){
          return eve
        }
        if(eve){
          this.$store.state.storage.addEvent.cellData.then((resp) => {
            console.log('his.$store.state.storage.addEvent.cellData=',this.$store.state.storage.addEvent.cellData)
            resp.data.forEach((data)=>{
              data.remark=''
            })
            // resp.data.list
            this.rowData = resp.data
          })
          // this.rowData = this.$store.state.storage.addEvent.cellData
          return this.$store.state.storage.addEvent
        }else{
          return {flag:false}
        }
      }
    },
    data(){
      return {
        columnDefs:[
          {headerName: '采购单号', field: 'code',checkboxSelection: true},
          {headerName: '公司', field: 'companyName', editable: false},
          {headerName: '采购日期', field: 'orderTime', editable: false},
          {headerName: '供应商', field: 'supplierName', editable: false},
          {headerName: '事业部', field: 'buName', editable: false},
          {headerName: '仓库', field: 'warehouseName', editable: false},
        ],
        rowData:'',
        columnDetailDefs:[
          {headerName: '存货编码', field: 'barcode', editable: false},
          {headerName: '存货名称', field: 'productName', editable: false},
          {headerName: '规格', field: 'specification', editable: false},
          {headerName: '型号', field: 'model', editable: false},
          {headerName: '计量单位', field: 'weightUnitId', editable: false},
          // {headerName: '批次号', field: 'batch'},
          {headerName: '数量', field: 'amount', editable: false}
          // {headerName: '含税单价', field: 'priceIncludeTax', editable: false},
          // {headerName: '单价', field: 'priceExclusiveTax', editable: false},
          // {headerName: '净含税单价', field: 'netPriceIncludeTax', editable: false},
          // {headerName: '净单价', field: 'netPriceExclusiveTax', editable: false},
          // {headerName: '金额', field: 'money', editable: false},
          // {headerName: '税率', field: 'taxRate', editable: false},
          // {headerName: '税额', field: 'tax', editable: false},
          // {headerName: '价税合计', field: 'sumMoney', editable: false},
          // {headerName: '备注', field: 'remark'}
        ],
        detailRowData:'',
        selectedObject:'',
        gridOptions : {
          rowSelection: 'multiple',
          groupSelectsChildren: true,
          suppressRowClickSelection: true,
          autoGroupColumnDef: {headerName: "Athlete", field: "athlete", width: 200,
            cellRenderer:'agGroupCellRenderer',
            cellRendererParams: {
              checkbox: true
            }}
        },
        defaultBatch:''
      }
    },
    methods:{
      onCellDoubleClicked:function (event) {
        console.log('onCellDoubleClicked event=',event)
        let eventTmp = {
          flag:true,
          cellEvent:event
        }
        if(event.column.colId == 'warehouseName'){
          this.$store.dispatch('WarehouseEvent',eventTmp).then()
        }

      },
      onRowSelected:function (event) {
        let row = event.row;
        let node = event.node;
        if(event.row.list){
          this.detailRowData =event.row.list
          return
        }
        getDetailList(JSON.stringify({"purchaseOrderId":row.id})).then((response)=>{
          if(response.code == 0){
            if(response.data){
              response.data.forEach((data2)=>{data2.batch=this.defaultBatch;data2.amountBak = data2.amount})
            }
            this.detailRowData = response.data;
            event.row.list = response.data;
          }
        })
      },
      hide:function () {
        let event={
          flag:false
        }
        this.$store.dispatch('StorageAddEvent',event).then()
      },
      onCancelClick:function () {
        console.log('onCancelClick ')
        this.hide()
      },
      onOkClick:function () {

        if(this.selectedObject.length === 0){
          // todo 提示
          this.$alert('请选择请购单', '提示', {
            confirmButtonText: '确定',
          });
          return
        }

        let addListEvent={
          show:true,
          selectEvent:this.selectedObject
        }

        this.$store.dispatch('StorageAddListEvent',addListEvent).then()
        this.hide()

      },
      // checkbox 选择事件
      selectCurrentNode:function (node) {
        console.log('selectCurrentNode node=',node)
        if(node.selected == true){
          this.selectedObject=node.data
        }
      },
      onModifyTableCellValueChanged:function (event) {
        console.log('onModifyTableCellValueChanged event=',event)



      },
      initBatch(){
        let date1= new Date()
        let year = date1.getFullYear()
        let month = date1.getMonth()+1
        let day = date1.getDate()
        this.defaultBatch= month>10?year+''+month+''+day:year+'0'+month+''+day

      }
    }
  }
</script>

<style scoped>

</style>

