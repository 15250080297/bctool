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
                <el-form-item label="公司"  prop="companyId">
                  <el-select v-model="headerData.companyId" placeholder="" @change="changeForm">
                    <el-option label="苏州暹罗猫电子商务" :value="1"   ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="事业部"  prop="buId">
                  <el-select v-model="headerData.buId" placeholder="" @change="changeForm">
                    <el-option label="粮油事业部" :value="1"   ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="发票日期" prop="invoiceTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.invoiceTime"  @change="changeForm"   value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="供应商"  prop="supplierId">
                  <el-select v-model="headerData.supplierId" placeholder="" @change="changeForm">
                    <el-option label="华东供应商" :value="1"   ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="备注" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.remark"  @change="changeForm"></el-input>
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
                 :cellEditingStoppedEvent="cellEditingStoppedEvent"
                 @tableInstance="tableInstance">
        </SCTable>

      </SCContent>


    </SCModify>

  </div>

</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import SCModify from '@/components/SCModify'
  import { updateInvoice,delInvoice} from '@/api/invoice'
  import Datepicker from '@/components/Datepicker'
  export default {
    components: {ActionBar,SCContent, SCTable,SCModify,Datepicker},

    data:function () {
      return {
        currentPage:1,
        total:100,
        pageSize:50,
        columnDefs:[
          {headerName: '存货编码', field: 'erpCode', editable: false},
          {headerName: '存货名称', field: 'productName', editable: false},
          {headerName: '规格', field: 'specification', editable: false},
          {headerName: '型号', field: 'model', editable: false},
          {headerName: '计量单位', field: 'weightUnitId', editable: false},
          {headerName: '数量', field: 'amount'},
          {headerName: '单价', field: 'priceExclusiveTax'},
          {headerName: '金额', field: 'money'},
          {headerName: '税额', field: 'tax'},
          {headerName: '价税合计', field: 'sumMoney'},
          {headerName: '含税单价', field: 'priceIncludeTax'},
          {headerName: '税率', field: 'taxRate'}
        ],
        hasModify:false,
        rules: {
          invoiceTime: [
            { required: true, message: '发票日期不能为空', trigger: 'change' }
          ],
          buId: [
            { required: true, message: '事业部不能为空', trigger: 'change' }
          ],
          companyId: [
            { required: true, message: '公司不能为空', trigger: 'change' }
          ],
          supplierId: [
            { required: true, message: '公司不能为空', trigger: 'change' }
          ]
        },
        rowData:[],
        headerData:{},
        finishStatus:false,
        addList:[],
        newLine:0,
        delList:[],
        updateList:[],
        inputWithId:[],
        tabInstance:{}
      }
    },
    created:function () {

    },
    mounted:function () {

    },
    computed:{
      showDetail:function () {
        let val = this.$store.state.invoice.showDetail;
        if(this.$store.state.invoice.detailData) {
          this.rowData = this.$store.state.invoice.detailData.list;
          this.headerData = this.$store.state.invoice.detailData;
        }
        return val;
      }
    },
    methods:{
      onModifyTableCellValueChanged:function (event) {

        if(event.oldValue != event.newValue){
          this.hasModify = true
          //this.updateList.push(event.row);
        }

      },
      cancelModify:function () {

        if(this.hasModify){
          this.$confirm("确定放弃修改?", "提示", {
            type:'info',
            callback:(action, instance)=>{
              if('confirm' == action){
                this.hasModify = false;
                this.$store.dispatch('HideInvoiceDetail').then(()=>{});
                this.emptyList();
              }
            }
          });
        }else{
          this.$store.dispatch('HideInvoiceDetail').then(()=>{});
        }



      },
      save:function () {
        this.$refs['headerData'].validate((valid) => {
          if (valid) {
            if(this.rowData.length == 0){
              this.$alert('采购订单详情不能为空', '提示', {
                confirmButtonText: '确定',
              });
              return;
            }
            for(let row of this.rowData){
              if(!row.amount || row.amount == ''){
                this.$alert('数量不能为空', '提示', {
                  confirmButtonText: '确定',
                });
                return;
              }
              if(!row.priceIncludeTax || row.priceIncludeTax == ''){
                this.$alert('含税单价不能为空', '提示', {
                  confirmButtonText: '确定',
                });
                return;
              }
              if(!row.priceExclusiveTax || row.priceExclusiveTax == ''){
                this.$alert('单价不能为空', '提示', {
                  confirmButtonText: '确定',
                });
                return;
              }
              if(!row.money || row.money == ''){
                this.$alert('金额不能为空', '提示', {
                  confirmButtonText: '确定',
                });
              }
              if(!row.taxRate || row.taxRate == ''){
                this.$alert('税率不能为空', '提示', {
                  confirmButtonText: '确定',
                });
                return;
              }
              if(!row.tax || row.tax == ''){
                this.$alert('税额不能为空', '提示', {
                  confirmButtonText: '确定',
                });
                return;
              }
              if(!row.sumMoney || row.sumMoney == ''){
                this.$alert('价税合计不能为空', '提示', {
                  confirmButtonText: '确定',
                });
                return;
              }
            }
            this.hasModify = false;
            //this.headerData.list = this.rowData;
            for (var i = 0; i < this.addList.length; i++) {
              for (var j = 0; j < this.delList.length; j++) {
                if (this.addList[i] == this.delList[j]) {
                  this.addList.splice(i, 1);
                }
              }
            }
            this.headerData.addList = this.addList;
            this.headerData.delList = this.delList;
            this.headerData.updateList = this.rowData;
            // console.info(this.addList);
            updateInvoice(JSON.stringify(this.headerData)).then((response) => {
              if (response.code == 0) {
                this.$message({message: '修改成功', type: 'success'});
                this.$store.dispatch('HideInvoiceDetail').then(() => {
                });
                this.emptyList();
                this.$root.$emit('refreshData', '');
              }
            });
          }else {
              return false;
          }
        });
      },
      del:function () {
        this.$confirm("确定删除该采购发票?", "提示", {
          type:'info',
          callback:(action, instance)=>{
            if('confirm' == action){
              delInvoice(JSON.stringify(this.headerData)).then((response) => {
                if(response.code == 0 ){
                  this.$message({message: '删除成功', type: 'success'});
                  this.$store.dispatch('HideInvoiceDetail').then(()=>{});
                  this.emptyList();
                  this.$root.$emit('refreshData','');
                }
              })

            }
          }
        });
      },
      changeForm:function () {
        this.hasModify = true
      },
      emptyList:function () {
        this.addList = [];
        this.delList = [];
        this.updateList=[];
      },
      cellEditingStoppedEvent:function (event) {
        let value = Number(event.value);
        if('amount' == event.column.colId){
          if(isNaN(value)){
            event.data.amount = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          if(event.data.priceIncludeTax && event.data.priceExclusiveTax){
            event.data.money = event.data.priceExclusiveTax * value;
            event.data.tax = (event.data.priceIncludeTax - event.data.priceExclusiveTax) * value;
            event.data.sumMoney =  event.data.priceIncludeTax * value;
          }
        }else if('priceIncludeTax' == event.column.colId){
          if(isNaN(value)){
            event.data.priceIncludeTax = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          event.data.priceExclusiveTax = value - (value * event.data.taxRate);
          event.data.money = (value - (value * event.data.taxRate)) * event.data.amount;
          event.data.tax = value * event.data.taxRate * event.data.amount;
          event.data.sumMoney = value * event.data.amount;
        }else if('priceExclusiveTax' == event.column.colId){
          if(isNaN(value)){
            event.data.priceExclusiveTax = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          event.data.priceIncludeTax = value + (value * event.data.taxRate);
          event.data.money = value * event.data.amount;
          event.data.tax = value * event.data.taxRate * event.data.amount;
          event.data.sumMoney = (value + (value * event.data.taxRate)) * event.data.amount;
        }else if('money' == event.column.colId){
          if(isNaN(value)){
            event.data.money = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          event.data.priceExclusiveTax = value / event.data.amount;
          event.data.priceIncludeTax = event.data.priceExclusiveTax + (event.data.priceExclusiveTax * event.data.taxRate);
          event.data.tax =  (event.data.priceIncludeTax - event.data.priceExclusiveTax) * event.data.amount;
          event.data.sumMoney = value + event.data.tax;
        }else if('taxRate' == event.column.colId){
          if(isNaN(value)){
            event.data.taxRate = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          if(event.data.priceIncludeTax && event.data.priceExclusiveTax) {
            event.data.priceExclusiveTax = event.data.priceIncludeTax / (1 + value);
            event.data.tax = (event.data.priceIncludeTax - event.data.priceExclusiveTax) * event.data.amount;
            event.data.sumMoney = value + event.data.tax;
          }
        }else if('tax' == event.column.colId){
          if(isNaN(value)){
            event.data.tax = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          event.data.money =  event.data.sumMoney - value;
        }else if('sumMoney' == event.column.colId){
          if(isNaN(value)){
            event.data.sumMoney = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          event.data.priceIncludeTax = value / event.data.amount;
          event.data.priceExclusiveTax = value / event.data.amount - (value / event.data.amount * event.data.taxRate);
          event.data.tax =  (event.data.priceIncludeTax - event.data.priceExclusiveTax) * event.data.amount;
          event.data.money = value - event.data.tax;
        }else if('giftNum' == event.column.colId) {
          if (isNaN(value) || value > event.data.amount) {
            event.data.giftNum = '';
            this.tabInstance.api.refreshCells();
            return;
          }
          if(!event.data.priceIncludeTax || !event.data.amount){
            this.tabInstance.api.refreshCells();
            return;
          }
        }
        event.data.amount = Number(event.data.amount).toFixed(0);
        event.data.priceIncludeTax = Number(event.data.priceIncludeTax).toFixed(2);
        event.data.priceExclusiveTax = Number(event.data.priceExclusiveTax).toFixed(2);
        event.data.money = Number(event.data.money).toFixed(2);
        event.data.tax = Number(event.data.tax).toFixed(2);
        event.data.sumMoney = Number(event.data.sumMoney).toFixed(2);
        //event.data.giftNum = Number(event.data.giftNum).toFixed(0);
        this.tabInstance.api.refreshCells();
      },
      tableInstance:function (instance) {
        this.tabInstance = instance;
      }

    }
  }

</script>

<style scoped>

</style>
