<template>
    <div class="tab-container">

        <!-- 操作菜单项 -->
        <ActionBar>

            <el-button class="action-item" type="primary" @click="addVoucher">{{$t('button.add')}}</el-button>
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
        <SCSearch id="voucherSearcher" title="凭证查询">
            <el-form :model="form">
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


        <!--<VoucherEdit :rowData="detailRowData" ></VoucherEdit>-->


        <VoucherAdd></VoucherAdd>
    </div>
</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCTable from '@/components/SCTable'
    import SCSearch from '@/components/SCSearch'
    import SCDateRange from '@/components/SCDateRange'
    import VoucherAdd from './VoucherAdd'
    import tree from '@/views/tree'
    import {getVoucherList,getAuxiliaryList,getCashFlow,getVoucherDetail} from '@/api/voucher'

    export default {
        components: {ActionBar,SCContent, SCTable, SCSearch, SCDateRange,tree,VoucherAdd},
        data() {
            return {
                gridOptions:{
                    defaultColDef:{
                        editable: false
                    }
                },
                currentPage:1,
                total:100,
                pageSize:50,
                form: {
                    orderId:'',
                    name: '',
                    status: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '120px',
                columnDefs: [
                    {headerName: '主体账簿', field: 'subjectAccountName'},
                    {headerName: '日期', field: 'orderDateStr'},
                    {headerName: '凭证号', field: 'voucherNo'},
                    {headerName: '摘要', field: 'summary'},
                    // {headerName: '借方_bak', field: 'browCnt'},
                    // {headerName: '贷方_bak', field: 'payCnt'},
                    {headerName: '制单', field: 'maker'},
                    // {headerName: '出纳_bak', field: 'teller'},
                    // {headerName: '审核', field: 'auditer'},
                    // {headerName: '记账_bak', field: 'charger'},
                    {headerName: '备注', field: 'remark'},
                    // {headerName: '系统_bak', field: 'system'},
                    {headerName: '期间', field: 'time'}
                ],
                detailColumnDefs:[
                    {headerName: '分录号', field: 'id', editable: false},
                    {headerName: '摘要', field: 'aabstract'},
                    {headerName: '科目', field: 'accountCode'},
                    {headerName: '辅助核算', field: 'auxiliaryAccountingName'},
                    {headerName: '币种', field: 'currency'},
                    {headerName: '原币', field: 'sameAmount'},
                    {headerName: '借方', field: 'primaryDebitAmount'},
                    {headerName: '贷方', field: 'primaryCreditAmount'},
                    {headerName: '备注', field: 'remark'}
                ],
                rowData:[],
                detailRowData:[],
                dateValue:[1,2],
                searchParams:{
                  beginTime:'',
                  endTime:'',
                  pageNum:1,
                  pageSize:10
                },
                selectedRowData:{},
                nowDate:''

            }
        },
        created() {
          this.$root.$off('search:voucherSearcher')
          this.$root.$on('search:voucherSearcher',() =>{
            //fetch with search-params
            console.log("do voucherSearcher")
            this.fetchVouchers(this.searchParams.pageNum)
          })

        },
        mounted(){
          this.getNowTime()
          this.pageNum =1
          this.pageSize = 20
          this.dateValue[0] = this.nowDate
          this.dateValue[1] = this.nowDate
          this.fetchVouchers(this.searchParams.pageNum)

        },

        methods: {
            onRowSelected:function (event) {
              console.log("onRowSelected")
              console.log(this.detailRowData)
              let row = event.row;
              let node = event.node;
              this.GetVoucherDetail(event.row.voucherNo)
            },
            onPageChanged:function (page) {
              this.fetchVouchers(page)
              console.log("onPageChanged", page);
            },
            onRowDoubleClicked:function (event) {
              console.log("onRowDoubleClicked")
              console.log(event)
                this.$store.dispatch('ShowEDITVoucherSwitch', event.data.voucherNo).then(()=>{
                    console.log("ShowDetail proims...");
                });
            },
            onModifyTableCellValueChanged:function (event) {
                this.hasModify = true
            },
            showSearchForm:function () {
                this.$root.$emit('showSearch:voucherSearcher');
            },
            addVoucher: function () {
              this.$store.dispatch('ShowAddVoucherSwitch').then(()=>{});
            },
            onRowDelete:function () {

            },
            fetchVouchers: function (nextPage) {
              if(this.dateValue && this.dateValue.length >1){
                this.searchParams.beginTime = this.dateValue[0]
                this.searchParams.endTime = this.dateValue[1]
              }else{
                this.searchParams.beginTime = this.nowDate
                this.searchParams.endTime = this.nowDate
              }
              let data = this.searchParams
              data.pageNum = nextPage
              getVoucherList(data).then(resp => {
                console.log('fetchVouchers =')
                console.log(resp)
                this.rowData = resp.data
                this.currentPage = resp.pagination.pageNum
                this.pageSize =resp.pagination.pageSize
                this.total =resp.pagination.total
              });
            },
            getNowTime:function () {
              this.nowDate = new Date().getTime()
            },
            GetVoucherDetail: function(voucherNo){
              console.log('GetVoucherDetail')
              let data={id: voucherNo}
              getVoucherDetail(data).then(resp =>{
                this.detailRowData = resp.data.journalEntryDtoList
                this.detailRowData.forEach(resp =>{
                  console.log(resp)
                  if(Math.round(resp.primaryCreditAmount*1000)/1000 === 0 ){
                    resp.sameAmount = resp.primaryDebitAmount
                  }else{
                    resp.sameAmount = resp.primaryCreditAmount
                  }
                  console.log(resp)
                  return resp
                })
                console.log(this.detailRowData)

              })
            }

        }

    }
</script>

<style scoped>

</style>
