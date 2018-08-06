<template>
  <div class="edit-container">
    <SCModify id="purchaseModify" :show="showDetail">
      <ActionBar slot="menu">
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>
        <el-button class="action-item del" type="info" @click="del">{{$t('button.del')}}</el-button>

        <el-dropdown>
          <el-button class="action-item">
            {{$t('button.accessory.title')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{$t('button.accessory.sub.unionQuery')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </ActionBar>

      <!-- detail -->
      <SCContent slot="content">

        <!-- form-->
        <SCContent>
          <el-form ref="headerData" :model="headerData" label-width="80px" :rules="rules">

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="单据号" prop="code">
                  <el-input v-model="headerData.code" @change="changeForm" readonly="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="日期" prop="salesOrderTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.salesOrderTime" style="width: 100%;" @change="changeForm"   value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="客户"  prop="supplierId">
                  <el-select v-model="headerData.supplierId" filterable placeholder="" @change="changeForm">
                    <el-option
                      v-for="item in supplierList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="事业部" prop="buName" >
                  <el-input v-model="headerData.buName" @change="changeForm" readonly="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="备注" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.remark"  @change="changeForm" maxlength="50"></el-input>
                </el-form-item>
              </el-col>

              <!--<el-col :span="12">
                <el-form-item label="是否全部被引用:" label-width="120px" @change="changeForm" prop="remark">
                 <span v-if="headerData.finishStatus=='Y'" >是</span>
                 <span v-if="headerData.finishStatus=='N'"  >否</span>
                </el-form-item>
              </el-col>-->


            </el-row>


          </el-form>
        </SCContent>

        <!--详情 -->
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :autoResize="true"
                 :enablePagination="false"
                 @onCellValueChanged="onModifyTableCellValueChanged"
                 @onRowSelected="onRowSelected"
                 @onRowDelete="onRowDelete"
                 @onCellDoubleClicked="onCellDoubleClicked"
                 :cellEditingStoppedEvent="cellEditingStoppedEvent"
                 @tableInstance="tableInstance"

        >
        </SCTable>

      </SCContent>


    </SCModify>

    <Datepicker @onOkClick="onDatepickerOk"></Datepicker>
    <ProductSelect ></ProductSelect>
    <WareHouse ></WareHouse>
  </div>

</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import SCModify from '@/components/SCModify'
  import { updateSales ,delSales} from '@/api/sales'
  import { findAllSupplier} from '@/api/supplier'
  import Datepicker from '@/components/Datepicker'
  import ProductSelect from '@/components/ProductSelect'
  import WareHouse from '@/components/WareHouse'
  export default {
    components: {ActionBar,SCContent, SCTable,SCModify,Datepicker,ProductSelect,WareHouse},

    data:function () {
      return {
        // gridInstance:null,
        currentPage:1,
        total:0,
        pageSize:50,
        columnDefs:[
          {headerName: '存货编码', field: 'erpCode', editable: false},
          {headerName: '存货名称', field: 'productName'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'},
          {headerName: '计量单位', field: 'weightUnitId'},
          {headerName: '数量', field: 'amount'},
          {headerName: '无税单价', field: 'priceExclusiveTax'},
          {headerName: '税率', field: 'tax', editable: false},
          {headerName: '含税单价', field: 'priceIncludeTax'},
          {headerName: '无税金额', field: 'salePriceExclusiveTax'},
          {headerName: '价税合计', field: 'salePriceIncludeTax'},
          {headerName: '仓库', field: 'warehouseName',type:'dateColumn'}
        ],
        hasModify:false,
        rules: {
          salesOrderTime: [
            { required: true, message: '日期不能为空', trigger: 'change' }
          ],
          supplierId: [
            { required: true, message: '客户不能为空', trigger: 'change' }
          ],
          buId: [
            { required: true, message: '事业部不能为空', trigger: 'change' }
          ]
        },
        rowData:[],
        headerData:{},
        finishStatus:false,
        addList:[],
        newLine:0,
        delList:[],
        updateList:[],
        preRowData:[],
        prs:'edit',
        coverIndex:'',
        supplierList:[],
        tabInstance:{}
      }
    },
    created:function () {
      this.$root.$off('onProSelectedit');
      this.$root.$on('onProSelectedit', (event)=>{
        this.selectPro(event);
      });
      this.$root.$off('onWarehouseClickEdit');
      this.$root.$on('onWarehouseClickEdit', (event)=>{
        this.onWarehousePickerOk(event);
      });
    },
    mounted:function () {

    },
    computed:{
      showDetail:function () {
        let val = this.$store.state.sales.showDetail;
        this.preRowData = this.$store.state.sales.detailData.list;
        if(null != this.preRowData){
          this.rowData =this.$clone(this.preRowData);
        }
        this.headerData = this.$store.state.sales.detailData;
        this.total =this.$store.state.sales.detailData.length;
        if(this.headerData.finishStatus == 'Y'){
          this.finishStatus = true;
        }else{
          this.finishStatus = false;
        }
        this.getsupplier();
        return val;
      }
    },
    methods:{
      onModifyTableCellValueChanged:function (event) {
        //   console.info(event.row);
        if(event.oldValue != event.newValue){
          this.hasModify = true
          for(var i=0;i<this.updateList.length;i++){
            if(this.updateList[i].id == event.row.id){
              this.updateList.splice(i, 1);
            }
          }
          this.updateList.push(event.row);
        }
        //判断是否增加了新行
        if(this.rowData.length < (event.rowIndex + 1)){
          //  console.log("has new row:", event.rowIndex);

          if(this.newLine !=event.rowIndex){
            this.newLine = event.rowIndex;
            this.addList.push(event.row);
          }
        }

      },
      onRowDelete:function (nodes) {
        //    console.log("=====> onRowDelete: ", nodes)
        this.delList.push(nodes.row);
        //  console.info(this.rowData.length)
        for(var i= 0;i<this.rowData.length;i++){
          if(null !=nodes.row.proKey && this.rowData[i].proKey == nodes.row.proKey){
            this.rowData.splice(i,1);
            break;
          }
          if(null !=nodes.row.id && this.rowData[i].id == nodes.row.id){
            this.rowData.splice(i,1);
            break;
          }
        }
        this.hasModify =  true;
      },
      onRowSelected:function (event) {
        let row = event.row;
        let node = event.node;


      },
      cancelModify:function () {
        //    console.info(this.$store.state.sales.detailData);
        if(this.hasModify){
          this.$confirm("确定放弃修改?", "提示", {
            type:'info',
            callback:(action, instance)=>{
              if('confirm' == action){
                this.hasModify = false;
                this.$store.dispatch('HideSalesDetail').then(()=>{});
                this.emptyList();
              }
            }
          });
        }else{
          this.$store.dispatch('HideSalesDetail').then(()=>{});
        }



      },
      save:function () {
        let check = true;
        this.$refs['headerData'].validateField('salesOrderTime', (valid) => {
          if ('' != valid) {
            check = false;
            return;

          }
        })
        this.$refs['headerData'].validateField('supplierId', (valid) => {
          if ('' != valid) {
            check = false;
            return;

          }
        })

        if (!check) {
          return;
        }


        //   this.headerData.list = this.rowData;
        for (let i = 0; i < this.rowData.length; i++) {
          if (null != this.rowData[i].proKey) {
            let flag = false;
            for (let n = 0; n < this.addList.length; n++) {
              if (this.addList[n].proKey == this.rowData[i].proKey) {
                flag = true
              }
            }
            if (!flag) {
              this.addList.push(this.rowData[i])
            }
          }
        }


        for (let i = 0; i < this.addList.length; i++) {
          for (let j = 0; j < this.delList.length; j++) {
            if (null != this.addList[i].id && this.addList[i].id == this.delList[j].id) {
              this.addList.splice(i, 1);
            }
            if (null != this.addList[i].proKey && this.addList[i].proKey == this.delList[j].proKey) {
              this.addList.splice(i, 1);
            }
          }
        }
        for (let q = 0; q < this.updateList.length; q++) {
          for (let w = 0; w < this.delList.length; w++) {
            if (this.updateList[q].id == this.delList[w].id) {
              this.updateList.splice(q, 1);
            }
          }
        }


        for (let i = 0; i < this.addList.length; i++) {
          if (null == this.addList[i].amount || '' == this.addList[i].amount) {
            this.$alert('数量不能为空或者0', '提示', {
              confirmButtonText: '确定',
            });
            return;
          } else {
            if (!this.isInteger(this.addList[i].amount)) {
              this.$alert('数量必须是正整数', '提示', {
                confirmButtonText: '确定',
              });
              return;
            }
          }
          if (null == this.addList[i].priceIncludeTax || '' == this.addList[i].priceIncludeTax) {
            this.$alert('含税单价不能为空', '提示', {
              confirmButtonText: '确定',
            });
            return;
          }

          if (null == this.addList[i].warehouseName || '' == this.addList[i].warehouseName) {
            this.$alert('仓库不能为空', '提示', {
              confirmButtonText: '确定',
            });
            return;
          }

        }
        for (let i = 0; i < this.updateList.length; i++) {
          if (null == this.updateList[i].amount || '' == this.updateList[i].amount) {
            this.$alert('数量不能为空或者0', '提示', {
              confirmButtonText: '确定',
            });
            return;
          }else {
            if (!this.isInteger(this.updateList[i].amount)) {
              this.$alert('数量必须是正整数', '提示', {
                confirmButtonText: '确定',
              });
              return;
            }
          }
          if (null == this.updateList[i].priceIncludeTax || '' == this.updateList[i].priceIncludeTax) {
            this.$alert('含税单价不能为空', '提示', {
              confirmButtonText: '确定',
            });
            return;
          }

          if (null == this.updateList[i].warehouseName || '' == this.updateList[i].warehouseName) {
            this.$alert('仓库不能为空', '提示', {
              confirmButtonText: '确定',
            });
            return;
          }

        }

        this.headerData.list = this.rowData;
        this.headerData.addList = this.addList;
        this.headerData.delList = this.delList;
        this.headerData.updateList = this.updateList;
        // console.info(this.addList);
        updateSales(JSON.stringify(this.headerData)).then((response) => {
          if (response.code == 0) {
            this.$message({message: '修改成功', type: 'success'});
            this.$store.dispatch('HideSalesDetail').then(() => {
            });
            this.emptyList();
            this.$root.$emit('refreshData', '');
          }
        })




      },
      del:function () {
        this.$confirm("确定删除该销售订单?", "提示", {
          type:'info',
          callback:(action, instance)=>{
            if('confirm' == action){
              delSales(JSON.stringify(this.headerData)).then((response) => {
                if(response.code == 0 ){
                  this.$message({message: '删除成功', type: 'success'});
                  this.$store.dispatch('HideSalesDetail').then(()=>{});
                  this.emptyList();
                  this.$root.$emit('refreshData',null);
                }
              })

            }
          }
        });
      },
      changeForm:function () {
        this.hasModify = true
      },
      changeSele:function () {
        this.hasModify = true;
        this.headerData.buId = this.headerData.buName;
      },
      emptyList:function () {
        this.addList = [];
        this.delList = [];
        this.updateList=[];
        this.rowData=[];
        this.preRowData=[];
      },
      onDatepickerOk:function (event) {
        // console.log("onDatepickerOk:", event);
        if(event.cellEvent.column.colId == 'needTime'){
          var data = event.cellEvent.node.data;
          data.needTime = event.selectedDate;
          var itemsToUpdate = [];
          itemsToUpdate.push(data);
          if( data.id != null){
            this.updateList.push(data);
          }
          var res = event.cellEvent.api.updateRowData({update:itemsToUpdate});
          this.hasModify = true;
          //  console.log("res:", res);
        }

      },
      onCellDoubleClicked:function (event) {
        if(event.column.colId == 'warehouseName'){
          let tdEvent ={
            show:true,
            cellEvent:event,
            flag:"Edit"
          };

          this.$store.dispatch('ShowWareHouse', tdEvent).then(()=>{});
        }
        if(event.column.colId == 'erpCode'){
          if(event.data.id != null){
            this.coverIndex = event.data.id;
          }

          //    console.info(this.coverIndex);


          let psEvent ={
            show:true,
            cellEvent:event,
            flag:this.prs
          };
          this.$store.dispatch('ShowProductSelect', psEvent).then(()=>{});
        }
        this.hasModify = true;
      },

      selectPro:function (event) {
        //   console.info("jin edit======");
        if( '' !=this.coverIndex && event.list.length > 0){
          for(let i=0;i<this.rowData.length;i++){
            if(this.rowData[i].id == this.coverIndex){
              this.rowData.splice(i,1);
              this.delList.push(this.rowData[i]);
            }
          }
        }
        for(let i =0 ;i <event.list.length;i++){
          this.rowData.push({"erpCode":event.list[i].erpCode,"productName":event.list[i].name,"specification":event.list[i].specification,"model":event.list[i].model,"proKey":event.list[i].erpCode,"supplierName":event.list[i].supplierName,"tax":event.list[i].taxRate,"amount":0.00});
        }
        this.coverIndex ='';
        this.hasModify = true;
      },
      getsupplier:function () {
        findAllSupplier().then((response)=>{
          this.supplierList = response.data;
        });
      },
      cellEditingStoppedEvent:function (event) {
        console.log( event);
        let value = Number(event.value);
        if('amount' == event.column.colId){
          if(event.data.priceIncludeTax && event.data.priceExclusiveTax){
            event.data.salePriceExclusiveTax = (value * event.data.priceExclusiveTax).toFixed(2);
            event.data.salePriceIncludeTax =(value * event.data.priceIncludeTax).toFixed(2);
          }
        }else if('priceIncludeTax' == event.column.colId){
          event.data.priceExclusiveTax = (value/(1+ event.data.tax)).toFixed(2);
          event.data.salePriceIncludeTax = (value * event.data.amount).toFixed(2);
          event.data.salePriceExclusiveTax = ((value/(1+ event.data.tax)) * event.data.amount).toFixed(2);
        }else if('priceExclusiveTax' == event.column.colId){
          event.data.priceIncludeTax = (value + (value * event.data.tax)).toFixed(2);
          event.data.salePriceExclusiveTax = (value * event.data.amount).toFixed(2);
          event.data.salePriceIncludeTax = ((value + (value * event.data.tax)) * event.data.amount).toFixed(2);
        }else if('salePriceIncludeTax' == event.column.colId){
          event.data.priceIncludeTax = (value /event.data.amount).toFixed(2);
          event.data.priceExclusiveTax = ((value / (1+event.data.tax)) /event.data.amount).toFixed(2);
          event.data.salePriceExclusiveTax = (value / (1+event.data.tax)).toFixed(2);
        }else if('salePriceExclusiveTax' == event.column.colId){
          event.data.priceIncludeTax = ((value * (1+event.data.tax)) /event.data.amount).toFixed(2);
          event.data.priceExclusiveTax = (value /event.data.amount).toFixed(2);
          event.data.salePriceIncludeTax = (value * (1+event.data.tax)).toFixed(2);
        }else if('tax' == event.column.colId){
          event.data.priceExclusiveTax = (event.data.priceIncludeTax /(1 +value)).toFixed(2);
          event.data.salePriceIncludeTax = (event.data.amount * event.data.priceIncludeTax).toFixed(2);
          event.data.salePriceExclusiveTax = ((event.data.priceIncludeTax /(1 +value)) * event.data.amount).toFixed(2);
        }
        this.tabInstance.api.refreshCells();
      },
      tableInstance:function (instance) {
        this.tabInstance = instance;
      },
      onWarehousePickerOk:function (event) {
        //    console.log("onWarehousePickerOk111:", event);
        if(event.cellEvent.column.colId == 'warehouseName'){
          var data = event.cellEvent.node.data;
          data.warehouseName = event.warehouseName;
          var itemsToUpdate = [];
          itemsToUpdate.push(data);
          if( data.id != null){
            this.updateList.push(data);
          }

          var res = event.cellEvent.api.updateRowData({update:itemsToUpdate});
          this.hasModify = true;
          //    console.log("res:", res);
        }

      },
      isInteger:function (obj) {
        var regu = /^[1-9]\d*$/;
        if (!regu.test(obj)) {
          return false;
        } else {
          return true;
        }
      }

    }
  }

</script>

<style scoped>

</style>
