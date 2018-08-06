<template>
  <div class="edit-container">
    <SCModify id="purchaseModify" :show="showAdd">
      <ActionBar slot="menu">
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>


        <!-- <el-dropdown>
           <el-button class="action-item">
             {{$t('button.accessory.title')}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
           </el-button>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item>{{$t('button.accessory.sub.unionQuery')}}</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown>-->

      </ActionBar>

      <!-- detail -->
      <SCContent slot="content">

        <!-- form-->
        <SCContent>
          <el-form ref="headerData" :model="headerData" label-width="80px" :rules="rules">

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="单据号">
                  <el-input v-model="headerData.code" @change="changeForm" readonly="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="日期" prop="salesOrderTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.salesOrderTime" style="width: 100%;" @change="changeForm"   value-format="yyyy-MM-dd" :editable=false></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="客户"  prop="supplierId">
                  <el-select v-model="headerData.supplierId" filterable placeholder="请选择" @change="changeForm">
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
                <el-form-item label="事业部" prop="buId" >
                  <el-select v-model="headerData.buId" placeholder="" @change="changeForm">
                    <el-option label="粮油事业部" value="1"   ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="备注" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.remark"  @change="changeForm" maxlength="50"></el-input>
                </el-form-item>
              </el-col>



            </el-row>


          </el-form>
        </SCContent>

        <!--详情 -->
        <SCTable :columnDefs="columnDefs"
                 :enablePagination="false"
                 :rowData="rowData"
                 :autoResize="true"
                 :showTool="false"
                 @onCellValueChanged="onModifyTableCellValueChanged"
                 @onRowSelected="onRowSelected"
                 @onRowDelete="onRowDelete"
                 @onCellDoubleClicked="onCellDoubleClicked"
                 :cellEditingStoppedEvent="cellEditingStoppedEvent"
                 @tableInstance="tableInstance">

          >
        </SCTable>

      </SCContent>


    </SCModify>
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
  import { addSales } from '@/api/sales'
  import Datepicker from '@/components/Datepicker'
  import ProductSelect from '@/components/ProductSelect'
  import WareHouse from '@/components/WareHouse'
  import { findAllSupplier} from '@/api/supplier'

  export default {
    components: {ActionBar,SCContent, SCTable,SCModify,Datepicker,ProductSelect,WareHouse},

    data:function () {
      return {
        // gridInstance:null,
        currentPage:1,
        total:100,
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
        prs:'add',
        tabInstance:{},
        supplierList:[]


      }
    },
    created:function () {
      this.$root.$off('onProSelectadd');
      this.$root.$on('onProSelectadd', (event)=>{
        this.selectPro(event);
      });
      this.$root.$off('onWarehouseClickAdd');
      this.$root.$on('onWarehouseClickAdd', (event)=>{
        this.onWarehousePickerOk(event);
      });
    },
    mounted:function () {

    },
    computed:{
      showAdd:function () {
        let val = this.$store.state.settlement.showAdd;
        if(this.$store.state.settlement.detailData.selectSettlementData) {
          this.rowData = this.$store.state.settlement.detailData.selectSettlementDetailData;
         /* for(let row of this.rowData){
            row.amount = row.erpCode;
            row.money = Number(row.realAmount * row.priceExclusiveTax).toFixed(2);
            row.taxRate = Number(row.tax / row.money).toFixed(2);
            row.sumMoney = Number(Number(row.tax) + Number(row.money)).toFixed(2);
          }*/
          this.headerData = this.$store.state.settlement.detailData.selectSettlementData;
          this.headerData.code ='';
          this.headerData.sourceId = this.$store.state.settlement.detailData.selectSettlementData.id;
          this.hasModify = true;

        }
        this.getsupplier();
        return val;
      }
    },
    methods:{
      onModifyTableCellValueChanged:function (event) {

        if(event.oldValue != event.newValue){
          this.hasModify = true
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
        console.log("=====> onRowDelete: ", nodes)
        this.delList.push(nodes.row);
        for(var i= 0;i<this.rowData.length;i++){
          if(null !=nodes.row.proKey && this.rowData[i].proKey == nodes.row.proKey){
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

        if(this.hasModify){
          this.$confirm("确定放弃添加?", "提示", {
            type:'info',
            callback:(action, instance)=>{
              if('confirm' == action){
                this.hasModify = false;
                this.$store.dispatch('HideAddSettlementDetail').then(()=>{});
                this.emptyList();
                this.headerData ={};
              }
            }
          });
        }else{
          this.headerData ={};
          this.emptyList();
          this.$store.dispatch('HideAddSettlementDetail').then(()=>{});
        }



      },
      save:function () {
        let check =true;
        this.$refs['headerData'].validateField('salesOrderTime', (valid) => {
          if ('' != valid) {
            check =false;
            return;

          }
        })
        this.$refs['headerData'].validateField('supplierId', (valid) => {
          if ('' != valid) {
            check =false;
            return;

          }
        })
        this.$refs['headerData'].validateField('buId', (valid) => {
          if ('' != valid) {
            check =false;
            return;

          }
        })
        if(!check){
          return;
        }


        for (let i = 0; i < this.rowData.length; i++) {
          if (null != this.rowData[i].proKey) {
            var flag = false;
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
            if (this.addList[i].proKey == this.delList[j].proKey) {
              this.addList.splice(i, 1);
            }
          }
        }

        if (this.addList.length == 0) {
          this.$alert('存货编码、数量、含税单价、仓库不能为空', '提示', {
            confirmButtonText: '确定',
          })
          return;
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

        this.headerData.addList = this.addList;
        addSales(JSON.stringify(this.headerData)).then((response) => {
          if (response.code == 0) {
            this.$message({message: '添加成功', type: 'success'});
            this.$store.dispatch('HideAddSettlementDetail').then(() => {
            });
            this.emptyList();
            this.$root.$emit('refreshData', '');
          }
        })

      },
      del:function () {

      },
      changeForm:function () {
        this.hasModify = true
      },
      changeSele:function () {
        this.hasModify = true;
        // this.headerData.bu_id = this.headerData.buName;
      },
      emptyList:function () {
        this.addList = [];
        this.delList = [];
        this.rowData =[];
        this.headerData ={};
      },
      onWarehousePickerOk:function (event) {
        //   console.log("onWarehousePickerOk:", event);
        if(event.cellEvent.column.colId == 'warehouseName'){
          var data = event.cellEvent.node.data;
          data.warehouseName = event.warehouseName;
          var itemsToUpdate = [];
          itemsToUpdate.push(data);

          var res = event.cellEvent.api.updateRowData({update:itemsToUpdate});
          this.hasModify = true;
          //    console.log("res:", res);
        }

      },
      onCellDoubleClicked:function (event) {
        if(event.column.colId == 'warehouseName'){
          let tdEvent ={
            show:true,
            cellEvent:event,
            flag:"Add"
          };

          this.$store.dispatch('ShowWareHouse', tdEvent).then(()=>{});
        }
        if(event.column.colId == 'erpCode'){
          let psEvent ={
            show:true,
            cellEvent:event,
            flag:this.prs
          };
          this.$store.dispatch('ShowProductSelect', psEvent).then(()=>{});
        }
      },

      selectPro:function (event) {
        console.info("jin add======");
        for(var i =0 ;i <event.list.length;i++){
          this.rowData.push({"erpCode":event.list[i].erpCode,"productName":event.list[i].name,"specification":event.list[i].specification,"model":event.list[i].model,"proKey":event.list[i].erpCode,"supplierName":event.list[i].supplierName,"tax":event.list[i].taxRate,"amount":0.00});
        }
        this.hasModify = true;

      },
      isInteger:function (obj) {
        var regu = /^[1-9]\d*$/;
        if (!regu.test(obj)) {
          return false;
        } else {
          return true;
        }
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
      getsupplier:function () {
        findAllSupplier().then((response)=>{
          this.supplierList = response.data;
        });
      },

    }
  }

</script>

<style scoped>

</style>
