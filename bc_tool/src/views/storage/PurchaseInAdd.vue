<template>
  <div class="edit-container" >
    <WarehousePicker></WarehousePicker>

    <SCModify id="purchaseInAdd" :show="showPurchaseInAdd.show">
      <ActionBar slot="menu">
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>
      </ActionBar>
      <SCContent slot="content">
        <!--列表 -->
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :enablePagination="false"
                 :showTool="false"
                 @onRowSelected="onRowSelected"
                 @onCellDoubleClicked="onCellDoubleClicked"
                 @onCellValueChanged="onModifyTableCellValueChanged"
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
    </SCModify>

  </div>
</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCTable from '@/components/SCTable'
    import SCModify from '@/components/SCModify'
    import { getList,getDetailList } from '@/api/purchase'
    import { saveStoreOrder } from '@/api/storage'
    import WarehousePicker from '@/components/WareHouse'
    export default {
      name: "PurchaseIn",
      components: {ActionBar, SCContent, SCTable, SCModify,WarehousePicker},

      computed: {
        showPurchaseInAdd() {
          let event = this.$store.state.storage.addListEvent
          if(event.selectEvent){
            let tmp = []
            tmp.push(event.selectEvent)
            this.rowData = tmp
          }else{
            return event
          }
          if(event.selectEvent.list){
            this.detailRowData = event.selectEvent.list
          }
          return event
        }
      },
      data() {
        return {
          formData: {},
          columnDefs:[
            {headerName: '采购单号', field: 'code', editable: false},
            {headerName: '公司', field: 'companyName', editable: false},
            {headerName: '采购日期', field: 'orderTime', editable: false},
            {headerName: '供应商', field: 'supplierName', editable: false},
            {headerName: '事业部', field: 'buName', editable: false},
            /*{headerName: '审批状态', field: 'approvalStatus'},*/
            {headerName: '仓库', field: 'warehouseName', editable: false},
            {headerName: '备注', field: 'remark'},
            // {headerName: '制单人', field: 'creatorName'},
            // {headerName: '修改人', field: 'updaterName'},
            // {headerName: '审批人', field: 'approvalName'},
            // {headerName: '制单时间', field: 'createTime'},
            // {headerName: '修改时间', field: 'updateTime'},
            // {headerName: '审批时间', field: 'approvalTime'}
          ],
          rowData:'',
          columnDetailDefs:[
            {headerName: '存货编码', field: 'barcode', editable: false},
            {headerName: '存货名称', field: 'productName', editable: false},
            {headerName: '规格', field: 'specification', editable: false},
            {headerName: '型号', field: 'model', editable: false},
            {headerName: '计量单位', field: 'weightUnitId', editable: false},
            {headerName: '批次号', field: 'batch'},
            {headerName: '数量', field: 'amount'}
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
          // selectedObject:'',
          // gridOptions : {
          //   rowSelection: 'multiple',
          //   groupSelectsChildren: true,
          //   suppressRowClickSelection: true,
          //   autoGroupColumnDef: {headerName: "Athlete", field: "athlete", width: 200,
          //     cellRenderer:'agGroupCellRenderer',
          //     cellRendererParams: {
          //       checkbox: true
          //     }}
          // },
          hasModify:true
        }
      },
      created:function(){
        // this.$root.$off('warehousePick')
        // this.$root.$on('warehousePick',(obj,event)=>{
        //
        //   let dataTmp  = event.node.data
        //   dataTmp.warehouseId = obj.id
        //   dataTmp.warehouseName= obj.name
        //   var itemsToUpdate = [];
        //   itemsToUpdate.push(dataTmp);
        //   event.api.updateRowData({itemsToUpdate})
        //   this.hasModify = true
        // })

        this.$root.$off('onWarehouseClickEdit');
        this.$root.$on('onWarehouseClickEdit', (event)=>{

          let dataTmp  = event.cellEvent.node.data
          dataTmp.warehouseId = event.warehouseId
          dataTmp.warehouseName= event.warehouseName
          var itemsToUpdate = [];
          itemsToUpdate.push(dataTmp);
          event.cellEvent.api.updateRowData({itemsToUpdate})
          this.hasModify = true

        });

      },
      methods:{
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
                response.data.forEach((data2)=>data2.batch=this.defaultBatch)
              }
              this.detailRowData = response.data;
              event.row.list = response.data;
            }
          })
        },
        onModifyTableCellValueChanged:function (event) {
          console.log('onModifyTableCellValueChanged event=',event)
          this.hasModify = true
        },
        onCellDoubleClicked:function (event) {
          console.log('onCellDoubleClicked event=',event)

          if(event.column.colId == 'warehouseName'){
            let tdEvent ={
              show:true,
              cellEvent:event,
              flag:"Edit"
            };

            this.$store.dispatch('ShowWareHouse', tdEvent).then(()=>{});
          }

        },
        // checkbox 选择事件
        // selectCurrentNode:function (node) {
        //   console.log('selectCurrentNode node=',node)
        //   if(node.selected == true){
        //     this.selectedObject=node.data
        //   }
        // },
        save:function () {
          console.log('save rowData=',this.rowData)
          let validFlag = true
          this.rowData.forEach((data)=>{
              if(!data.warehouseId){
                this.$alert('请选择仓库', '提示', {
                  confirmButtonText: '确定',
                });
                validFlag = false
                return
              }

              if(data.list){
                data.list.forEach((detail)=>{
                  if(detail.batch !== '' && detail.batch !== null && this.isYYYYMMDD(detail.batch)){
                    //do nothing
                  }else{
                    this.$alert('您输入的批次号为：'+detail.batch+',存货编码：'+detail.barcode+',批次号必须是yyyymmdd格式，例如：19910606', '提示', {
                      confirmButtonText: '确定',
                    })
                    validFlag = false
                    return
                  }

                  if(detail.amountBak < detail.amount){
                    this.$alert('数量不可以超过预设值：'+detail.amountBak+',存货编码：'+detail.barcode, '提示', {
                      confirmButtonText: '确定',
                    })
                    validFlag = false
                    return
                  }
                })

              }




          })

          if(!validFlag){
            return
          }

          this.rowData.forEach((data)=>{

            let reqDto={
              cgCode:data.code,
              warehouseId:data.warehouseId,
              remark:data.remark,
              cgOrderDetailDtoList:data.list.map((data) =>{return {id:data.id,batch:data.batch,amount:data.amount}})
            }

            saveStoreOrder(JSON.stringify(reqDto)).then((resp)=>{
              if(resp.code === 0){
                this.hasModify = false
                let eventTmp = {flag:false}
                // todo check
                this.$root.$emit('fetchStorageList',1)
                this.$store.dispatch('StorageAddEvent',eventTmp).then((res) =>console.log('PurchaseInList,res=',res))
              }
            })

          })


        },
        cancelModify:function () {
          if(this.hasModify){
            this.$confirm("确定放弃修改?", "提示", {
              type:'info',
              callback:(action, instance)=>{
                if('confirm' === action){
                  this.hasModify = false;
                  this.hide()
                  this.emptyList();
                }
              }
            });
          }else{
            this.hide()
            this.emptyList();
          }
        },
        hide(){
          let eventTmp={
            show:false
          }
          this.$store.dispatch('StorageAddListEvent',eventTmp).then()

        },
        isYYYYMMDD(batch) {
          if(!this.$isRealNum(batch) || batch.length != 8){
            return false
          }

          let year = batch.substring(0,4)
          let month = batch.substring(4,6)
          let lastDay = new Date(parseInt(year),parseInt(month),0).getDate()


          if(month > 12){
            return false
          }
          if(batch.substring(6,8) >lastDay){
            return false
          }

          return true
        }

      }

    }
</script>


<style scoped>

</style>
