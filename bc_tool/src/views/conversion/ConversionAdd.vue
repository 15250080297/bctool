<template>
  <div class="edit-container">
  <WarehousePicker></WarehousePicker>
  <ProductSelect :productType="productType" :searchData="searchData"></ProductSelect>
  <SCModify id="purchaseModify" :show="conversionAdd.show">
    <ActionBar slot="menu">

        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>


    </ActionBar>

    <!-- detail -->
    <SCContent slot="content">
      <!-- form-->
      <SCContent>
        <el-form ref="headerData" :model="headerData" label-width="80px">

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="单据号">
                <el-input v-model="headerData.code" @change="changeForm" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单据日期">
                <el-input v-model="headerData.orderTime" @change="changeForm" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="事业部" >
                <el-select v-model="headerData.buId" placeholder="" @change="changeForm">
                  <el-option label="粮油事业部" value="1" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="仓库">
                <el-input v-model="headerData.warehouseName" @change="changeForm" @focus="selectStorage" readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </SCContent>

      <!--详情 -->
      <SCTable ref="sctable1" :columnDefs="columnDefs"
               :enablePagination="false"
               :rowData="rowData"
               :autoResize="true"
               @onRowAdd="onRowAdd"
               @onCellValueChanged="onModifyTableCellValueChanged"
               @onRowDelete="onRowDelete"
               @onCellDoubleClicked="onCellDoubleClicked"
               @tableInstance="tableParentInstance">
      </SCTable>

    </SCContent>
  </SCModify>
  </div>
</template>

<script>

  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCSearch from '@/components/SCSearch'
  import SCTable from '@/components/SCTable'
  import SCModify from '@/components/SCModify'
  import WarehousePicker from '@/components/WareHouse'
  import {getProductOfWarehouse} from '@/api/conversion'
  import ProductSelect from '@/components/ProductSelect'


  export default {
        name: "StoreTransAdd",
        components:{ActionBar,SCContent,SCSearch,SCTable,SCModify,WarehousePicker,ProductSelect},
        computed:{
          conversionAdd(){
            this.prs = 'add'
            if(this.$store.state.conversion){
              return this.$store.state.conversion.addEvent
            }
            return {show:false}
          },
        },
        created:function(){
          this.$root.$off('onWarehouseClickEdit');
          this.$root.$on('onWarehouseClickEdit', (event)=>{

            this.headerData.warehouseId = event.warehouseId
            this.headerData.warehouseName= event.warehouseName

            //设置商品的查询参数
            this.searchData.warehouseId=event.warehouseId

            this.hasModify = true
          });

          this.$root.$off('onProSelectadd');
          //TODO  为什么这里的event.api 无法操作当前行
          this.$root.$on('onProSelectadd', (event)=>{
            console.log('onProSelectadd event=',event)

            let rowNode = this.instance.api.getRowNode(0)

            rowNode.setData(event.list[0]);

            if(event.list[1]){
              for (let i = 1; i <  event.list.length; i++) {
                let datatmp = []
                datatmp.push(event.list[i])
                this.$refs.sctable1.addRow(datatmp,true)
              }
            }

          });

        },
        data(){
          return {
            productType:'XTC',
            searchData:'',
            hasModify:false,
            // formData:{
              headerData:{
                warehouseName:'',
                warehouseId:'',
                code:'',
                orderTime:'',
                buId:'',
              },
              dataList:[],
            // },
            columnDefs:[
              {headerName: '类型', field: 'type'},
              {headerName: '存货编码', field: 'erpCode',editable:false},
              {headerName: '存货名称', field: 'name'},
              {headerName: '规格', field: 'specification'},
              {headerName: '型号', field: 'model'},
              {headerName: '计量单位', field: 'proUnitName'},
              {headerName: '批次号', field: 'batch'},
              {headerName: '生产日期', field: 'genetationTimeStr'},
              {headerName: '失效日期', field: 'expirationTimeStr'},
              {headerName: '供应商', field: 'supplierName'},
              {headerName: '单价', field: 'priceExclusiveTax'},
              {headerName: '金额', field: 'money'}
            ],
            rowData:'',
            prs:'',
            instance:''
          }
        },
      methods:{
        onModifyTableCellValueChanged(){

        },
        onRowDelete(){

        },
        tableParentInstance:function (instance) {
          console.log('int instance:',instance);
          this.instance = instance;
        },
        onCellDoubleClicked(event){
          if(event.column.colId === 'erpCode'){
            let psEvent ={
              show:true,
              cellEvent:event,
              flag:this.prs
            };
            this.$store.dispatch('ShowProductSelect', psEvent).then(()=>{});
          }

        },
        hide(){
          this.$store.dispatch('setAddEvent',{show:false}).then()
        },
        changeForm(){

        },
        cancelModify(){
          if(this.hasModify){
            this.$confirm("确定放弃新增?", "提示", {
              type:'info',
              callback:(action, instance)=>{
                if('confirm' === action){
                  this.hasModify = false;
                  this.hide();
                  this.emptyList();
                }
              }
            });
          }else{
            this.emptyList();
            this.hide();
          }
        },
        emptyList(){
          this.formData= ''
          this.rowData= ''
        },
        save(){

        },
        selectStorage(){
          console.log('selectStorage....')
          let tdEvent ={
            show:true,
            cellEvent:event,
            flag:"Edit"
          };

          this.$store.dispatch('ShowWareHouse', tdEvent).then(()=>{});
        },
        // fetchWarehouseProductList(warehouseId){
        //   let reqData={
        //     warehouseId:warehouseId
        //   }
        //   getProductOfWarehouse().then()
        // }
        onRowAdd(event){
          console.log('do onRowAdd action event=',event)
        }
      }


    }
</script>

<style scoped>

</style>
