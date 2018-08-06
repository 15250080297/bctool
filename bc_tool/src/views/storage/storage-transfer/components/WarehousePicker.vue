<template>

  <el-dialog title="仓库选择"
             :visible.sync="showPicker.show"
             width="780px"
             center
             append-to-body
  >

    <div class="cell-transfer">
      <SCContent>
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :enablePagination="false"
                 :showTool="false"
                 :suppressRowClickSelection="true"
                 :gridOptions="gridOptions"
                 @selectCurrentNode="selectCurrentNode"
                 @onCellClicked="onCellClicked"
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
  import { getList,getDetailList } from '@/api/purchase'
  import { saveStoreOrder } from '@/api/storage'
  import { findWarehouse } from '@/api/warehouse'

  export default {
    name: "PurchasePicker",
    components:{SCContent,SCTable},
    computed:{
      showPicker(){
        this.currEvent=''
        this.currentObj=''
        this.findWarehouse()
        let eve = this.$store.state.app.wareHouseEvent;
        this.currEvent = eve
        console.log('eve',eve)
        if(eve){
          return eve
        }else{
          return {flag:false}
        }
      }
    },
    data(){
      return {
        currEvent:'',
        columnDefs:[
          {headerName: '仓库编号', field: 'id',checkboxSelection: true},
          {headerName: '仓库名称', field: 'name', editable: false}
        ],
        rowData:'',
        detailRowData:'',
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
        currentObj:''
      }
    },
    methods:{
      selectCurrentNode:function (event) {
        console.log('selectCurrentNode event=',event)
        console.log('selectCurrentNode currentObj=',this.currentObj)


        if(event.selected === true){
          this.currentObj = event.data
        }
        if(event.selected === false && event.data.id ===this.currentObj.id){
          this.currentObj = ''
        }

      },
      onOkClick:function () {

        this.$root.$emit('onWarehouseClick'+this.currEvent.flag, {
          warehouseName:this.currentObj.name,
          warehouseId:this.currentObj.id,
          cellEvent:this.currEvent.cellEvent
        });

        this.hide();

        // if(!this.currentObj){
        //   this.$alert('请选择仓库', '提示', {
        //     confirmButtonText: '确定',
        //   });
        //   return
        // }
        // this.$root.$emit('warehousePick',this.currentObj,this.currEvent.cellEvent)
        // this.hide()
      },
      onCancelClick:function () {
      },
      hide(){
        let eventTmp={
          show:false
        }
        this.$store.dispatch('ShowWareHouse',eventTmp).then()
      },
      findWarehouse:function () {
        console.log('findWarehouse ')
        findWarehouse().then((resp)=>{
          console.log('findWarehouse resp=',resp)
          this.rowData = resp.data
        })
      },
      onCellClicked:function (event) {
        console.log('onCellClicked do nothing')

      }
    }
  }
</script>

<style scoped>

</style>
