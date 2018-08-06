<template>

  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>

      <el-button class="action-item" type="primary" @click="addConversion">{{$t('button.add')}}</el-button>
      <el-button class="action-item" type="primary" @click="doSignature">{{signBtnName}}</el-button>
      <el-button class="action-item" type="primary" @click="showSearchForm">{{$t('button.search')}}</el-button>
      <!--<el-button class="action-item" type="primary">{{$t('button.approval')}}</el-button>-->

      <!-- -->

      <el-dropdown>
        <el-button class="action-item">
          {{$t('button.accessory.title')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{$t('button.accessory.sub.unionQuery')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </ActionBar>

    <!-- 查询 -->
    <SCSearch id="conversionSearcher" title="形态转换查询">
      <el-form :model="searchForm">
        <el-form-item label="凭证日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </SCSearch>

    <SCContent>
      <!--列表 -->
      <SCTable :columnDefs="columnDefs"
               :rowData="rowData"
               :editable="false"
               :currentPage="currentPage"
               :total="total"
               :pageSize="pageSize"
               :showTool="false"
               @onRowSelected="onRowSelected"
               @onRowDoubleClicked="onRowDoubleClicked"
               @onPageChanged="onPageChanged">
      </SCTable>

      <!--详情 -->
      <SCTable :columnDefs="detailColumnDefs"
               :editable="false"
               :enablePagination="false"
               :showTool="false"
               :rowData="detailRowData">
      </SCTable>
    </SCContent>

    <ConversionAdd></ConversionAdd>
    <ConversionEdit></ConversionEdit>


  </div>

</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCSearch from '@/components/SCSearch'
    import SCTable from '@/components/SCTable'
    import ConversionAdd from './ConversionAdd'
    import ConversionEdit from './ConversionEdit'

    import {getStorageList,getStorageDetailList,XTC_getBOMList,doSign} from '@/api/conversion'

    export default {
      name: "StoreTransList",
      components:{ActionBar,SCContent,SCSearch,SCTable,ConversionAdd,ConversionEdit},
      computed:{
      },
      data(){
        return {
          currentPage:1,
          pageSize:20,
          total:50,
          rowData:'',
          detailRowData:'',
          columnDefs:[
            {headerName: '单据号', field: 'code'},
            {headerName: '单据日期', field: 'orderTime'},
            {headerName: '仓库名称', field: 'warehouseName'},
            {headerName: '部门', field: 'buName'},
            {headerName: '备注', field: 'remark'},
            {headerName: '制单人', field: 'creatorName'},
            {headerName: '制单时间', field: 'createTime'},
            {headerName: '最后修改人', field: 'updaterName'},
            {headerName: '最后修改时间', field: 'updateTime'}
          ],
          detailColumnDefs:[
            {headerName: '类型', field: 'type'},
            {headerName: '存货编码', field: 'erpCode', editable: false},
            {headerName: '存货名称', field: 'prdName'},
            {headerName: '规格', field: 'specification'},
            {headerName: '型号', field: 'model'},
            {headerName: '计量单位', field: 'proUnitName'},
            {headerName: '批次号', field: 'batch'},
            {headerName: '生产日期', field: 'genetationTimeStr'},
            {headerName: '失效日期', field: 'expirationTimeStr'},
            {headerName: '供应商', field: 'supplierName'},
            // {headerName: '数量', field: 'netPriceExclusiveTax'},
            {headerName: '单价', field: 'money'},
            {headerName: '金额', field: 'priceExclusiveTax'}
          ],
          bomlist:'',
          formLabelWidth: '120px',
          nowDate:'',
          searchForm:{
            beginTime:'',
            endTime:'',
            id:'',
            warehouse:'',
            buId:'',
            supplierName:'',
            supplierId:'',
            erpCode:'',
            productName:'',
            creatorId:'',
            pageNum:1,
            pageSize:20,
            type:'XT'
          },
          signBtnName:this.$t('button.signature'),
          dateValue:[1,2]

        }

      },
      mounted(){
        this.getNowTime()
        this.pageNum =1
        this.pageSize = 20
        this.dateValue[0] = this.nowDate
        this.dateValue[1] = this.nowDate
        this.getBOMList()
        this.getConversionList()
      },
      created(){

      },
      methods:{
        onRowSelected(event){
          this.getStorageDetailList(event.row.id)
        },

        onRowDoubleClicked(event){
          let addEvent={
            show:true,
            cellEvent:event
          }
          this.$store.dispatch('setAddEvent',addEvent).then()
        },

        getStorageDetailList(orderId){
          let data={
            storeConversionOrderId:orderId
          }
          getStorageDetailList(JSON.stringify(data)).then((resp)=>{
            if(resp.code === 0){
              this.rowData = resp.data
            }
          })
        },
        getConversionList(pageNum){
          this.searchForm.beginTime = this.dateValue[0]
          this.searchForm.endTime = this.dateValue[1]
          this.searchForm.pageNum = this.pageNum
          getStorageList(JSON.stringify(this.searchForm)).then((resp)=>{
            if(resp.code === 0){
              this.detailRowData = resp.data
            }
          })
        },

        getBOMList(){
          XTC_getBOMList(JSON.stringify({})).then((resp)=>{
            if(resp.code === 0){
              this.bomlist = resp.data
            }
          })
        },
        addConversion(event){
          let addEvent={
            show:true,
            addEvent:event
          }
          this.$store.dispatch('setAddEvent',addEvent)
        },
        getNowTime:function () {
          this.nowDate = new Date().getTime()
        },
        checkboxCellRenderer:function (params) {
          let input = document.createElement("input");
          input.type = "checkbox";
          input.disabled = true;
          if(params.data.isGift == 'Y'){
            input.checked = true;
          }
          return input;
        },
        doSignature:function () {

        },
        showSearchForm:function () {

        },
        onPageChanged:function () {

        }

      }
    }
</script>

<style scoped>

</style>
