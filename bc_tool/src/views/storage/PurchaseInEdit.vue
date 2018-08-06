<template>
  <div class="edit-container" >

    <PurchasePicker></PurchasePicker>

    <SCModify id="voucherModify" :show="showPurchaseInAdd.show">
      <ActionBar slot="menu">
        <el-button class="action-item" type="primary" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>
        <el-button class="action-item" type="primary" @click="del">{{$t('button.del')}}</el-button>
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
      </ActionBar>
      <SCContent>
        <el-form ref="form" :model="form" label-width="80px">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="签字状态">
                {{signState}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </SCContent>
      <SCContent slot="content">

        <SCContent>
          <el-form ref="headerData" :model="headerData" label-width="80px">

            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="单据号" prop="code">
                  <el-input v-model="headerData.code" @change="changeForm" readonly="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="单据日期" prop="requisitionTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.orderTime" style="width: 100%;" @change="changeForm"   value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="仓库"  prop="buId">
                  <el-input v-model="headerData.warehouseName" readonly="true" @change="changeForm" maxlength="50"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="供应商" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.supplierName" readonly="true" @change="changeForm" maxlength="50"></el-input>
                </el-form-item>
              </el-col>


            </el-row>
            <el-row>
              <!--<el-col :span="6">-->
                <!--<el-form-item label="收发类型" @change="changeForm" prop="remark">-->
                  <!--<el-input v-model="headerData.sendReceiveType"  @change="changeForm" maxlength="50"></el-input>-->
                <!--</el-form-item>-->
              <!--</el-col>-->
              <el-col :span="6">
                <el-form-item label="备注" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.remark"  @change="changeForm" maxlength="50"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="是否退货"  prop="remark">
                  <el-checkbox v-model="switchTheData" @change="changeForm"></el-checkbox>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="是否全部被引用TODO" prop="remark">
                  <el-checkbox v-model="headerData.isOver" @change="changeForm" readonly="true"></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </SCContent>

        <!--列表 -->
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :enablePagination="false"
                 :showTool="false"
                 @onRowSelected="onRowSelected"
                 @onCellDoubleClicked="onCellDoubleClicked"
                 @onCellClicked="onCellClicked"
                 @onCellValueChanged="onModifyTableCellValueChanged"
                 @onPageChanged="onPageChanged"
                 @tableInstance="tableParentInstance"
        >
        </SCTable>
      </SCContent>
    </SCModify>
    <Datepicker @onOkClick="onDatepickerOk"></Datepicker>

  </div>
</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCTable from '@/components/SCTable'
    import SCModify from '@/components/SCModify'
    import {getStorageList,getStorageDetailList,modifyStorageList,deleteStore} from '@/api/storage'
    import { getList,getDetailList } from '@/api/purchase'
    import Datepicker from '@/components/Datepicker'
    import PurchasePicker from './components/PurchasePicker'

    export default {
      name: "PurchaseIn",
      components:{ActionBar,SCContent,SCTable,SCModify,PurchasePicker,Datepicker},
      computed:{
        showPurchaseInAdd(){
          if(!this.$store.state.storage.editEvent){
            return {show:false}
          }
          if(!this.$store.state.storage.editEvent.show){
            return {show:false}
          }
          console.log('showPurchaseInAdd')
          let event = this.$store.state.storage.editEvent
          this.storeId = event.cellData.id
          this.headerData = event.cellData
          this.fetchDetailRowData(event.cellData.id,1)
          return event
        },
        switchTheData:{
          get:function () {
            return this.headerData.isReturn === "Y"?true:false
          },
          set:function (flag) {
            this.headerData.isReturn = flag===true?'Y':'N'
            console.log('switchTheData set flag=',flag)
            console.log('switchTheData this.headerData.isReturn = ',this.headerData.isReturn)
          }

        }
      },
      data(){
        return {
          form:'',
          signState:'',
          total:50,
          currentPage:1,
          pageSize:1,
          rowData:'',
          formData:{
            id:'',
            batch:'',

          },
          columnDefs:[
            {headerName: '存货编码', field: 'erpCode',editable:false},//prd
            {headerName: '存货名称', field: 'name',editable:false},//prd
            {headerName: '规格', field: 'specification',editable:false},//prd
            {headerName: '型号', field: 'model',editable:false},//prd
            {headerName: '单位', field: 'unitName',editable:false},//unit
            {headerName: '批次号', field: 'batch'},//ordDtl
            {headerName: '生产日期', field: 'genetationTimeStr', type:'dateColumn'},//ordDtl
            {headerName: '失效日期', field: 'expirationTimeStr', type:'dateColumn'},//ordDtl
            {headerName: '应收数量', field: 'expectAmount'},//ordDtl
            {headerName: '实收数量', field: 'realAmount'},//ordDtl
            {headerName: '入库日期', field: 'createTimeStr', type:'dateColumn'},//ordDtl
            {headerName: '是否赠品', field: 'isGift', cellRenderer: this.checkboxCellRenderer, editable: false},//ordDtl
            {headerName: '备注', field: 'remark'},//ordDtl
          ],
          storeId:'',
          gridOptions:{},
          hasModify:false,
          newLine:0,
          addList:[],
          deleteList:[],
          updateList:[],
          headerData:{
            id:'',
            code:'',
            orderTime:'',
            outWarehouseId:'',
            expectOutWarehouseTime:'',
            realOutWarehouseTime:'',
            inWarehouseId:'',
            expectInWarehouseTime:'',
            realInWarehouseTime:'',
            isReturn:'',
            remark:'',
            sendReceiveType:'',
            warehouseName:''
          },
          instance:''
        }
      },
      created:function(){
        // this.$root.$off('search:purchaseAddSearch')
        // this.$root.$on('search:purchaseAddSearch', () => {
        //   let eventTmp = {
        //     flag:true,
        //     cellData:this.fetchPurchaseList(1)
        //   }
        //   //显示新增的选择窗口
        //   this.$store.dispatch('StorageAddEvent',eventTmp).then((res) =>console.log('PurchaseInList,res=',res))
        // })
      },
      methods:{
        onRowDelete:function (nodes) {
          this.delList.push(nodes.row);
          for(var i= 0;i<this.rowData.length;i++){
            if(null !=nodes.row.id && this.rowData[i].id == nodes.row.id){
              this.rowData.splice(i,1);
              break;
            }
          }
          this.hasModify =  true;
        },
        onModifyTableCellValueChanged:function (event) {
          console.log('onModifyTableCellValueChanged')
          console.log(event)
          console.log(this.rowData)

          let len = this.updateList.length

          if(event.oldValue !== event.newValue){
            this.hasModify = true
            for(var i=len-1;i>0;i--){
              if(this.updateList[i].id === event.row.id){
                this.updateList.splice(i, 1);
              }
            }
            this.updateList.push(event.row);
          }

          //判断是否增加了新行
          if(this.rowData.length < (event.rowIndex + 1)){
            if(this.newLine !=event.rowIndex){
              this.newLine = event.rowIndex;
              this.addList.push(event.row);
            }
          }
        },
        onRowSelected(event){
          // event.row.isGift = 'Y'
          console.log('onRowSelected event',event)

          // event.row.realInAmount = 0;
          // event.row.expectInAmount = 0;
          // this.instance.api.refreshCells();
          // let len = this.updateList.length
          // for(var i=0;i<len;i++){
          //   if(this.updateList[i].id == event.row.id){
          //     this.updateList.splice(i, 1);
          //   }
          // }
          // if(  event.row.id != null){
          //   this.updateList.push(event.row);
          // }

        },
        onCellDoubleClicked(event){
          if(event.column.colId == 'genetationTimeStr'||event.column.colId == 'expirationTimeStr'||event.column.colId == 'createTimeStr'){

            let tdEvent ={
              show:true,
              cellEvent:event
            };

            this.$store.dispatch('ShowTableDatepicker', tdEvent).then(()=>{});
          }
        },
        onDatepickerOk:function (event) {

          console.log('onDatepickerOk',event)

          var data = event.cellEvent.node.data;

          let len = this.updateList.length
          for(var i=0;i<len;i++){
            if(this.updateList[i].id == data.id){
              this.updateList.splice(i, 1);
            }
          }
          if( data.id != null){
            this.updateList.push(data);
          }
          if(event.cellEvent.column.colId == 'genetationTimeStr'){
            data.genetationTimeStr = event.selectedDate;
          }else if(event.cellEvent.column.colId == 'expirationTimeStr'){
            data.expirationTimeStr = event.selectedDate;
            console.log("res:", res);
          }else if(event.cellEvent.column.colId == 'createTimeStr'){
            data.createTimeStr = event.selectedDate;
          }
          var itemsToUpdate = [];
          itemsToUpdate.push(data);
          var res = event.cellEvent.api.updateRowData({update:itemsToUpdate});
          console.log("res:", res);
          this.hasModify = true;
        },
        onPageChanged:function (page) {
          this.fetchVouchers(this.storeId,page)
          console.log("onPageChanged", page);
        },
        fetchDetailRowData(storeId,pageNum){
          let data = {
            storeId:storeId
          }
          getStorageDetailList(JSON.stringify(data)).then((resp)=>{
              this.rowData = resp.data
              this.rowData.forEach((data)=>{
                data.isGift = data.isGift ==='Y'
              })
            console.log('getStorageDetailList rowData=',this.rowData)
            }
          )
        },
        save(){
          let validFlag = true
          this.updateList.forEach((obj)=>{
            if(obj.batch !== '' && obj.batch !== null && this.isYYYYMMDD(obj.batch)){
              //do nothing
            }else{
              this.$alert('您输入的批次号为：'+obj.batch+',批次号必须是yyyymmdd格式，例如：19910606', '提示', {
                confirmButtonText: '确定',
              })
              validFlag = false
              return
            }
            if(this.$notNumber(obj.expectAmount)){
              this.$alert('应收数量必须为数字', '提示', {
                confirmButtonText: '确定',
              })
              validFlag = false
              return
            }
            if(obj.expectAmount.length >16){
              this.$alert('应收数量应小于16位', '提示', {
                confirmButtonText: '确定',
              })
              validFlag = false
              return
            }

            if(this.$notNumber(obj.realAmount)){
              this.$alert('实收数量必须为数字', '提示', {
                confirmButtonText: '确定',
              })
              validFlag = false
              return
            }
            if(obj.realAmount.length >16){
              this.$alert('实收数量应小于16位', '提示', {
                confirmButtonText: '确定',
              })
              validFlag = false
              return
            }

            if(obj.remark.length >16){
              this.$alert('备注应小于300个字符', '提示', {
                confirmButtonText: '确定',
              })
              validFlag = false
              return
            }
          })

          // this.addList.forEach((add)=>{
          //
          // })

          if(validFlag === false){
            return
          }

          this.headerData.id = this.storeId

          let reqData = {
            // storageDto:this.$clone(this.headerData),
            updateList:this.updateList,
            addList: this.addList,
            deleteList: this.deleteList
          }

          Object.assign(reqData,this.headerData)
          console.log(' Object.assign(reqData,this.headerData)  reqData=',reqData)


          modifyStorageList(JSON.stringify(reqData)).then((resp)=>{
            console.log('modifyStorageList resp=',resp)
            if(resp.code===0){
              this.hasModify=false
            }
          })

        },
        cancelModify(){
          if(this.hasModify){
            this.$confirm("确定放弃修改?", "提示", {
              type:'info',
              callback:(action)=>{
                if('confirm' == action){
                  this.hasModify = false;
                  this.emptyList();
                  this.hide()
                }
              }
            });
          }else{
            this.emptyList();
            this.hide()
          }
        },
        emptyList(){
            this.addList=[]
            this.deleteList=[]
            this.updateList=[]
            this.rowData=[]
        },
        hide(){
          let event={
            show:false
          }
          this.$store.dispatch('StorageEditEvent',event).then()
        },
        changeForm:function (event) {
          console.log('changeForm event=',event)
          console.log(this.headerData.isReturn)
          this.hasModify = true
        },
        isYYYYMMDD(batch) {
          if(!this.isRealNum(batch) || batch.length != 8){
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
        },
        isRealNum(val){
          // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
          if(val === "" || val ==null){
            return false;
          }
          if(!isNaN(val)){
            return true;
          }else{
            return false;
          }
        },
        tableParentInstance:function (instance) {
          //console.log('int instance');
          this.instance = instance;
        },
        // selectCurrentNode:function (event) {
        //   this.hasModify = true
        //   event.data.isGift = 'N'
        //   console.log('selectCurrentNode event=',event)
        //   this.instance.api.refreshCells();
        // },
        checkboxCellRenderer:function (event) {
          let input = document.createElement("input");
          input.type = "checkbox";
          input.id="isGiftBox"
          console.log('checkboxCellRenderer event=',event)
          if(event.data.isGift == true){
            input.checked='checked'
          }
          input.onclick = () => {
            if(input.checked === 'checked'){
              console.log("input.checked === 'checked' result = ",input.checked === 'checked')

            }
            if(input.checked === 'checked'){
              input.checked = ''
            }else{
              input.checked = 'checked'
            }


            this.hasModify = true
            console.log('checkboxCellRenderer input.checked',input.checked)
            let tmp = {};
            let len = this.updateList.length
            for(var i=len-1;i>0;i--){
              console.log('event',event)
              if(this.updateList[i].id == event.data.id){
                this.updateList.splice(i, 1);
              }
            }
            if(  event.data.id != null){
              this.updateList.push(event.data);
            }
            if(input.checked){
              event.data.isGift = 'Y'
              event.data.realAmount = 0;
              event.data.expectAmount = 0;
              this.instance.api.refreshCells();
              //TODO 禁用数量输入框
            }else{
              event.data.isGift = 'N'
            }
            this.updateList.push(event.data);
            //input.checked = true;
            //console.log(value);
            //this.rowData.push(params.data);
          };
          return input;
        },
        del(){
          this.$confirm("确定删除采购订单?", "提示", {
            type:'info',
            callback:(action)=>{
              if('confirm' == action){
                let data = {
                  delIds:[this.storeId]
                }
                deleteStore(JSON.stringify(data)).then((resp)=>{
                  console.log('deleteStore, resp=',resp)
                  if(resp.code === 0){
                    this.$root.$emit('search:purchaseInSearch')
                  }
                })
                this.hasModify = false;
                this.emptyList();
                this.hide()
              }
            }
          });
        },
        onCellClicked(event){
          console.log('onCellClicked event=',event)
          if(event.column.colId ==='isGift'){
            if(document.getElementById('isGiftBox').getAttribute('checked') === 'checked'){
              document.getElementById('isGiftBox').onclick()

              // document.getElementById('isGiftBox').removeAttribute('checked')
            }else{
              document.getElementById('isGiftBox').onclick()

              // document.getElementById('isGiftBox').setAttribute('checked','checked')
            }
          }
        }
    }

    }
</script>


<style scoped>

</style>
