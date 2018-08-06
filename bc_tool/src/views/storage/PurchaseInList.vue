<template>
  <div class="edit-container">

      <PurchasePicker></PurchasePicker>

      <ActionBar slot="menu">

        <el-button class="action-item" type="primary" @click="showAddForm">{{$t('button.add')}}</el-button>

        <el-button class="action-item" type="primary" @click="doSignature">{{signBtnName}}</el-button>

        <el-button class="action-item" type="primary" @click="showSearchForm">{{$t('button.search')}}</el-button>

        <el-button class="action-item" type="primary" :disabled="initialization ? false : true" @click="doStamp">{{$t('button.stamp')}}</el-button>

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
      <SCSearch id="purchaseInSearch" title="采购入库单查询">
        <el-form :model="searchForm">
          <el-row>
            <el-col>
              <el-form-item label="日期" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="dateValue"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="单据号" :label-width="formLabelWidth">
                <el-input v-model="searchForm.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="仓库" :label-width="formLabelWidth">
                <el-input v-model="searchForm.warehouse"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="事业部" :label-width="formLabelWidth">
                <el-input v-model="searchForm.buId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="供应商名称" :label-width="formLabelWidth">
                <el-input v-model="searchForm.supplierName"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="供应商编码" :label-width="formLabelWidth">
                <el-input v-model="searchForm.supplierId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!--<el-row>-->
            <!--<el-col>-->
              <!--<el-form-item label="存货编码" :label-width="formLabelWidth">-->
                <!--<el-input v-model="searchForm.erpCode"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col>-->
              <!--<el-form-item label="存货名称" :label-width="formLabelWidth">-->
                <!--<el-input v-model="searchForm.productName"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->

          <el-row>
            <el-col>
              <el-form-item label="制单人" :label-width="formLabelWidth">
                <el-input v-model="searchForm.creatorId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </SCSearch>

      <!-- 查询 -->
      <SCSearch id="purchaseAddSearch" ref="purchaseAddSearch" title="采购单查询">
        <el-form :model="addForm">
          <el-form-item label="日期" :label-width="formLabelWidth">
            <el-date-picker
              v-model="addDateValue"
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
                 :autoResize="true"
                 :rowData="detailRowData">
        </SCTable>
      </SCContent>
      <PurchaseInEdit></PurchaseInEdit>
      <PurchaseInAdd></PurchaseInAdd>
  </div>
</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCSearch from '@/components/SCSearch'
    import SCTable from '@/components/SCTable'
    import {getList,getDetailList} from '@/api/purchase'
    import {getStorageList,getStorageDetailList,doSign} from '@/api/storage'
    import PurchasePicker from './components/PurchasePicker'
    import PurchaseInEdit from './PurchaseInEdit'
    import purchaseWarehousingPrintingPDF from '@/api/printingAll'
    import config from '@/config'
    import PurchaseInAdd from './PurchaseInAdd'
    export default {
      name: "PurchaseIn",
      components:{ActionBar,SCContent,SCTable,SCSearch,PurchasePicker,PurchaseInEdit,PurchaseInAdd},
      computed:{
      },
      data(){
        return{
          gridOptions:{
            defaultColDef:{
              editable: false
            }
          },
          signBtnName:'',
          currentPage:1,
          pageSize:20,
          total:50,
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
            type:'CG'
          },
          addForm:{
            beginTime:'',
            endTime:'',
            pageNum:1,
            pageSize:20
          },
          dateValue:[1,2],
          addDateValue:'',
          formLabelWidth: '120px',
          detailRowData:'',
          detailColumnDefs:[
            {headerName: '存货编码', field: 'erpCode'},//prd
            {headerName: '存货名称', field: 'name'},//prd
            {headerName: '规格', field: 'specification'},//prd
            {headerName: '型号', field: 'model'},//prd
            {headerName: '单位', field: 'unitName'},//unit
            {headerName: '批次号', field: 'batch'},//ordDtl
            {headerName: '生产日期', field: 'genetationTimeStr'},//ordDtl
            {headerName: '失效日期', field: 'expirationTimeStr'},//ordDtl
            {headerName: '应收数量', field: 'expectAmount'},//ordDtl
            {headerName: '实收数量', field: 'realAmount'},//ordDtl
            {headerName: '入库日期', field: 'createTime'},//ordDtl
            {headerName: '是否赠品', field: 'isGift'},//ordDtl
            {headerName: '备注', field: 'remark'}//ordDtl
          ],
          rowData:'',
          columnDefs:[
            {headerName: '单据号', field: 'code'},//store_ord
            {headerName: '单据日期', field: 'orderTime'},//s_ord
            {headerName: '仓库', field: 'warehouseName'},//warehouse
            {headerName: '库存组织TODO', field: 'TODO'},
            {headerName: '收发类别', field: 'sendReceiveType'},//s_ord
            {headerName: '库管员TODO', field: 'subjectAccountName'},
            {headerName: '供应商', field: 'supplierName'},
            {headerName: '备注', field: 'remark'},//s_ord
            {headerName: '是否退库', field: 'isReturn'},//s_ord
            {headerName: '制单人', field: 'creatorName'},//user
            {headerName: '制单时间', field: 'createTime'},//s_ord
            {headerName: '签字人', field: 'signerName'},//s_ord
            {headerName: '签字时间', field: 'signTime'},//s_ord
            {headerName: '最后修改人', field: 'updaterName'},//s_ord
            {headerName: '最后修改时间', field: 'updateTime'}//s_ord
          ],
          selectedId:'',
          initialization: false,
          printingId: null,
          selectedRow:''
        }
      },
      mounted(){
        this.signBtnName = this.$t('button.signature')
        this.getNowTime()
        this.dateValue[0] = this.nowDate
        this.dateValue[1] = this.nowDate
        this.searchForm.beginTime = this.dateValue[0]
        this.searchForm.endTime = this.dateValue[1]
        this.fetchStorageList(1)
      },
      created:function(){
        this.$root.$off('search:purchaseInSearch')
        this.$root.$on('search:purchaseInSearch', () => {
          this.searchForm.beginTime = this.dateValue[0]
          this.searchForm.endTime = this.dateValue[1]
          this.fetchStorageList(1)
          console.log(this.rowData)
        })

        this.$root.$off('search:purchaseAddSearch')
        this.$root.$on('search:purchaseAddSearch', () => {
          let eventTmp = {
            flag:true,
            cellData:this.fetchPurchaseList(1)
          }
          this.$refs.purchaseAddSearch.hide()
          //显示新增的选择窗口
          this.$store.dispatch('StorageAddEvent',eventTmp).then((res) =>console.log('PurchaseInList,res=',res))
        })
      },
      methods:{
        doSignature:function(){
          console.log('...doSignature')
          if(!this.selectedRow){
            this.$alert('请先选择需要签字的入库单', '提示', {
              confirmButtonText: '确定',
            })
            return
          }

          let data={
            sourceId:this.selectedRow.id,
            signState:'Y'
          }
          if(this.selectedRow.signState === 'Y'){
            data.signState = 'N'
          }

          doSign(JSON.stringify(data)).then((resp)=>{
            if(resp.code===0){

              if(data.signState === 'Y'){
                this.signBtnName = this.$t('button.unsign')
              }else{
                this.signBtnName = this.$t('button.signature')
              }

              this.$alert('签字操作成功', '提示', {
                confirmButtonText: '确定',
              }).then(()=>{

                this.fetchStorageList(this.currentPage)
              })
            }
          })

        },
        showSearchForm:function () {
          console.log('showSearchForm')
          this.$root.$emit('showSearch:purchaseInSearch');
        },
        showAddForm:function () {
          console.log('showSearchForm')
          this.$root.$emit('showSearch:purchaseAddSearch');
        },
        doStamp:function(){
          //打印
          console.log('选中id',this.printingId);
          window.open(process.env.BASE_API+config.ApiURL.purchase_warehousing_printing+"?purchaseWwarehousingId="+this.printingId);
        },
        onRowSelected:function (event) {
          this.printingId = event.row.id;
          console.log('onRowSelectedID:',this.printingId);
          this.initialization = true

          if(event.row.signState === 'Y'){
            this.signBtnName = this.$t('button.unsign')
          }else if(event.row.signState === 'N'){
            this.signBtnName = this.$t('button.signature')
          }
          console.log('onRowSelected event=',event)
          this.selectedRow = event.row
          let data = {
            storeId:event.row.id
          }
          getStorageDetailList(JSON.stringify(data)).then((resp)=>{this.detailRowData = resp.data})
        },
        onRowDoubleClicked:function (event) {
          console.log('onRowDoubleClicked event.data=',event.data)
          let eventTmp = {
            show:true,
            cellData:event.data
          }
          this.$store.dispatch('StorageEditEvent',eventTmp).then(()=>{
            console.log('StorageEditEvent')
          })
        },
        onPageChanged:function (page) {
          this.fetchStorageList(page)
        },
        getNowTime:function () {
          this.nowDate = new Date().getTime()
        },
        //获取采购单列表 TODO 取消开发新增逻辑
        fetchPurchaseList(pageNum){
          if(this.addDateValue && this.addDateValue.length >1){
            this.addForm.beginTime = this.addDateValue[0]
            this.addForm.endTime = this.addDateValue[1]
          }else{
            this.addForm.beginTime = this.nowDate
            this.addForm.endTime = this.nowDate
          }
          let data =this.$clone(this.addForm)
          data.pageNum = pageNum
          this.addForm.pageNum = pageNum
          return getList(JSON.stringify(data))
        },
        //获取采购入库列表
        fetchStorageList(pageNum){
          this.initialization = false;
          if(this.dateValue && this.dateValue.length >1){
            this.searchForm.beginTime = this.dateValue[0]
            this.searchForm.endTime = this.dateValue[1]
          }else{
            //TODO 便于调试改成了全查
            // this.searchForm.beginTime = this.nowDate
            // this.searchForm.endTime = this.nowDate
            this.searchForm.beginTime = ''
            this.searchForm.endTime = ''
          }
          // if(this.dateValue && this.dateValue.length >1){
          //   this.searchForm.beginTime = this.dateValue[0]
          //   this.searchForm.endTime = this.dateValue[1]
          // }else{
          //   //TODO 便于调试改成了全查
          //   // this.searchForm.beginTime = this.nowDate
          //   // this.searchForm.endTime = this.nowDate
          //   this.searchForm.beginTime = ''
          //   this.searchForm.endTime = ''
          // }
          // let data = this.$clone(this.purchase)
          // data.pageNum = pageNum
          this.searchForm.pageNum=pageNum
          return getStorageList(JSON.stringify(this.searchForm)).then((resp)=>{
            console.log('fetchStorageList,resp=',resp)
            this.currentPage = resp.pagination.pageNum
            this.pageSize = resp.pagination.pageSize
            this.total = resp.pagination.total
            this.rowData = resp.data
          })
        },
        purchaseOrder(){

        },
        //获取采购入库详情
        fetchPurchaseDetail() {

        }
      }
    }
</script>


<style scoped>

</style>
