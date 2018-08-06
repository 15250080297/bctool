<template>
    <div class="edit-container">

      <EntryPicker id="voucherEntryPicker"></EntryPicker>

      <AuxiliaryPicker ref="auxiliary"></AuxiliaryPicker>

      <TableDialog id="cashFlowDialog"></TableDialog>

      <SCModify id="purchaseModify" :show="showAdd || showEdit">
            <ActionBar slot="menu">
                <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
                <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>
                <el-button class="action-item del" type="info" @click="del">{{$t('button.del')}}</el-button>
                <el-button class="action-item analyse" type="info" @click="cashAnalyse">{{$t('button.cashFlowAnalyse')}}</el-button>
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
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-row :gutter="10">
                          <el-col :span="6">
                            <el-form-item label="主体账簿">
                              {{voucherHead.getNcCompanyName}}
                            </el-form-item>
                          </el-col>
                        </el-row>
                      <el-row :gutter="10">
                        <el-col :span="6">
                          <el-form-item label="制单日期">
                            {{voucherHead.prepareddate}}
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                </SCContent>

                <!--详情 -->
                <SCTable :columnDefs="columnDefs"
                         :currentPage="currentPage"
                         :total="total"
                         :pageSize="pageSize"
                         :rowData="rowData"
                         :showTool="true"
                         :enablePagination="false"
                         @onCellDoubleClicked="onCellDoubleClicked"
                         @onCellValueChanged="onModifyTableCellValueChanged"
                         @onRowSelected="onRowSelected"
                         @onRowDelete="onRowDelete"
                         @onRowAdd="onRowAdd"
                         :cellEditingStoppedEvent="cellEditingStoppedEvent"
                         @tableInstance="tableInstance"
                >
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
    import EntryPicker from '@/views/voucher/components/EntryPicker'
    import AuxiliaryPicker from '@/views/voucher/components/AuxiliaryPicker'
    import TableDialog from '@/views/voucher/components/CashFlowDialog'
    import {getVoucherDetail,addVoucher,beforeAddVoucher,updatevoucher,getCashFlow,beforeCashFlow} from '@/api/voucher'
    export default {
        components: {ActionBar,SCContent, SCTable,SCModify,EntryPicker,AuxiliaryPicker,TableDialog},

        data:function () {
            return {
               // gridInstance:null,
                currentPage:1,
                total:100,
                pageSize:50,
                columnDefs:[
                  {headerName: '分录号', field: 'id'},
                  {headerName: '摘要', field: 'aabstract'},
                  {headerName: '科目', field: 'accountCodeFull' , editable: false},
                  {headerName: '辅助核算', field: 'auxiliaryAccountingTypeName', editable: false},
                  {headerName: '核算内容', field: 'auxiliaryAccountingName', editable: false},
                  {headerName: '币种', field: 'currency', cellEditor: "agSelectCellEditor",cellEditorParams: {
                      values: ['CNY']
                    }},
                  //TODO 与借方-贷方相同
                  {headerName: '原币', field: 'sameAmount',editable:false},
                  {headerName: '借方', field: 'primaryDebitAmount'},
                  {headerName: '贷方', field: 'primaryCreditAmount'},
                  {headerName: '备注', field: 'remark'}
                ],
                hasModify:false,
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
                events: {},
                master: '',
                detailData: {},
                gridOptions: {},
                rowData:[],
                headerData:{
                  //TODO 有哪些基础数据？
                },
                finish_status:false,
                addList:[],
                newLine:0,
                delList:[],
                voucherXlmDto:{
                  companyId: "",
                  voucherType: "记账凭证",
                  buId:1,
                  fiscalYear: "2018",
                  accountingPeriod: "07",
                  voucherId: "4",
                  attachmentNumber: "0",
                  prepareddate: "2018-07-09",
                  enter: "999",
                  signature: "N",
                  voucherMakingSystem: "外部系统交换平台",
                  journalEntryDtoList: []
                },
                journalEntryDto:{
                  id:'',
                  entryId: 2,
                  aabstract: "销售应收款单",
                  accountCode: "应收账款-集团外部",
                  currency: "CNY",
                  // unitPrice: "0.00000000",
                  // exchangeRate1: "1.00000000",
                  // exchangeRate2: "1.00000000",
                  debitQuantity: "0.00000000",
                  creditQuantity: "0.00000000",
                  secondaryDebitAmount: "0.00000000",
                  secondaryCreditAmount: "0.00000000",
                  auxiliaryAccountingTypeName: "客商辅助核算",
                  auxiliaryAccountingName: "苏宁云商集团股份有限公司苏宁采购中心",
                  primaryDebitAmount: 0,
                  naturalDebitCurrency: 0,
                  primaryCreditAmount: "10368.21",
                  naturalCreditCurrency: "10368.21",
                  otherUserDataDtoList: []
                },
                otherUserDataDto:{
                  money: "10368.21",
                  moneyass: 0,
                  moneymain: "10368.21",
                  pkCashflow: "销售商品、提供劳务收到的现金",
                  pkCashflowCode: '1111'
                },
                voucherHead:{
                  getNcCompanyName:'',
                  prepareddate: '',
                  ncCompanyId:''
                },
                saveOrUpdate:'save',
                cashFlowRowData:[],
                tabInstance:'',
                oldValueTmp:''
              // tmp:''
            }
        },
        created:function () {
          this.gridOptions = {
            columnDefs: this.columnDefs,
            rowData: this.detailData.details,
            enableColResize: true,
            defaultColDef: {
              editable: true
            }
          };
          this.$root.$off('onOkClick:voucherEntryPicker')
          // 科目选择
          this.$root.$on('onOkClick:voucherEntryPicker',(data,event) =>{

            this.hasModify = true

            var itemsToUpdate = [];
            console.log('onOkClick:voucherEntryPicker event=')
            console.log(event)


            //更新表格
            let dataTmp  = event.node.data
            dataTmp.accountCodeFull = data.id+''+data.fullLabel
            dataTmp.accountCode = data.label
            dataTmp.entryId = data.id
            dataTmp.auxiliaryAccountingTypeCode = data.bdBdinfo
            dataTmp.auxiliaryAccountingTypeName = data.bdBdname
            dataTmp.auxiliaryAccountingCode = ''
            dataTmp.auxiliaryAccountingName = ''
            itemsToUpdate.push(dataTmp);
            var res = event.api.updateRowData({update:itemsToUpdate});
            // event.api.refreshTable()
            console.log(res)

            console.log(' rowdata=',this.rowData)

            //更新表单数据
            this.updateListFormData(event.data.id,'accountCode',data.label)
            this.updateListFormData(event.data.id,'accountCodeFull',dataTmp.accountCodeFull)
            this.updateListFormData(event.data.id,'entryId',data.id)
            this.updateListFormData(event.data.id,'auxiliaryAccountingTypeCode',data.bdBdinfo)
            this.updateListFormData(event.data.id,'auxiliaryAccountingTypeName',data.bdBdname)
            this.updateListFormData(event.data.id,'auxiliaryAccountingCode','')
            this.updateListFormData(event.data.id,'auxiliaryAccountingName','')

            this.beforeCashFlow()

          })
          this.$root.$off('onOkClick:cashFlowDialog')
          this.$root.$on('onOkClick:cashFlowDialog',(voucherXlmDto,myDoms) => {
            // ()=>{}中的this 与 function（){}中的this不同
            this.voucherXlmDto = voucherXlmDto
          })
          this.$root.$on('onOkClick:voucherAuxiliaryPicker',(data,event) => {
            let dataTmp  = event.node.data
            dataTmp.auxiliaryAccountingCode = data.id
            dataTmp.auxiliaryAccountingName = data.label
            var itemsToUpdate = [];
            itemsToUpdate.push(dataTmp);
            var res = event.api.updateRowData({update:itemsToUpdate});
            console.log(res)

            this.updateListFormData(event.data.id,'auxiliaryAccountingCode',data.id)
            this.updateListFormData(event.data.id,'auxiliaryAccountingName',data.label)
            this.hasModify=true
          })
        },
        mounted:  function(){
          getCashFlow().then(resp => {console.log('getCashFlow');console.log(resp)})
        },
        computed:{
            showDetail:function () {
              this.rowData = this.$store.state.voucher.detailData;
            },
            showAdd: function(){
              this.saveOrUpdate='save'
              console.log("show Add!!!!")
              // 获取凭证头信息
              this.beforeAddVoucher()
              return this.$store.state.voucher.showAdd

            },
            showEdit:function () {
              this.saveOrUpdate='update'
              console.log("show Edit!!!!!")
              let val = this.$store.state.voucher.showEdit;
              let voucherNo = this.$store.state.voucher.voucherNo
              if(val){
                // 获取凭证基本信息
                this.GetVoucherDetail(voucherNo)
                // 获取凭证头信息
                this.beforeAddVoucher()
              }
              return val;
            },
        },
        methods:{
            onModifyTableCellValueChanged:function (event) {

              console.log('onModifyTableCellValueChanged')
              console.log(event)
              console.log(this.rowData)

              this.oldValueTmp = event.oldValue

              if(event.oldValue != event.newValue){
                this.hasModify = true
              }

              //判断是否增加了新行
              // if(this.rowData.length < (event.rowIndex + 1)){
              //   this.voucherXlmDto.journalEntryDtoList.push(event.row)
              //   this.rowData = this.voucherXlmDto.journalEntryDtoList
              // }

              //更新表单数据
              this.updateListFormData(event.row.id,event.colId,event.newValue)
              // this.voucherXlmDto.journalEntryDtoList[event.rowIndex][event.colId]=event.newValue

            },
            cellEditingStoppedEvent:function(event){
              console.log(' cellEditingStoppedEvent this.voucherXlmDto.journalEntryDtoLis=',this.voucherXlmDto.journalEntryDtoList)
              console.log('cellEditingStoppedEvent event=',event)
              let validFlag = true

              if(event.column.colId ==='primaryDebitAmount' || event.column.colId ==='primaryCreditAmount'){
                if(!event.data[event.column.colId]){
                  this.$alert('凭证借贷金额不能为空', '提示', {
                    confirmButtonText: '确定',
                  });
                  validFlag = false
                }else if(this.$notNumber(event.data[event.column.colId]) ){
                  this.$alert('凭证借贷金额必须为数字', '提示', {
                    confirmButtonText: '确定',
                  });
                  validFlag = false
                }
              }

              if(!validFlag){
                event.data[event.column.colId] = this.oldValueTmp
                this.tabInstance.api.refreshCells();
                return
              }


              // TODO 改为通过ag-grid api更新
              if(event.column.colId === 'primaryDebitAmount'){
                event.data.primaryCreditAmount = 0
                event.data.sameAmount = event.data.primaryDebitAmount
              }else if(event.column.colId === 'primaryCreditAmount'){
                event.data.primaryDebitAmount = 0
                event.data.sameAmount = event.data.primaryCreditAmount
              }
              this.tabInstance.api.refreshCells();

            },
            onCellDoubleClicked:function(event){
              console.log('onCellDoubleClicked')
              console.log(event)
              let tdEvent ={
                show:true,
                cellEvent:event
              };

              //科目 弹窗
              if(event.column.colId === 'accountCodeFull'){
                this.$store.dispatch('TreeDialogShow', tdEvent).then(()=>{});
              }

              //辅助核算 弹窗
              if(event.column.colId === 'auxiliaryAccountingName'){
                console.log('onCellDoubleClicked event=',event)
                if(!event.data.auxiliaryAccountingTypeCode){
                  this.$alert('该科目无辅助核算', '提示', {
                    confirmButtonText: '确定',
                  })
                  return;
                }
                this.$store.dispatch('AuxiliaryDialogShow', tdEvent).then(()=>{});
                this.$refs.auxiliary.initSupporter({})
              }
            },
            cancelModify:function () {
                if(this.hasModify){
                    this.$confirm("确定放弃修改?", "提示", {
                        type:'info',
                        callback:(action, instance)=>{
                            if('confirm' === action){
                                this.hasModify = false;
                                this.$store.dispatch('HideVoucherSwitch').then(()=>{});
                              this.emptyList();
                            }
                        }
                    });
                }else{
                    this.emptyList();
                    this.$store.dispatch('HideVoucherSwitch').then(()=>{});
                }
            },
            onRowSelected:function (event) {
              let row = event.row;
              let node = event.node;
            },
            // TODO: 实现SAVE 函数
            save:function () {
              this.hasModify = false;
              let validFlag = true;
              //1.validation

              //用于求账是否平
              let counting = []

              if(!this.voucherXlmDto.journalEntryDtoList || this.voucherXlmDto.journalEntryDtoList.length ===0){
                this.$alert('凭证没有分录', '提示', {
                  confirmButtonText: '确定',
                });
                validFlag = false;
                return;
              }

              this.voucherXlmDto.journalEntryDtoList.forEach((dto) => {
                if(dto.primaryDebitAmount === '' || dto.primaryCreditAmount === ''){
                  this.$alert('凭证借贷金额不能为空', '提示', {
                    confirmButtonText: '确定',
                  });
                  validFlag = false
                }else if(this.$notNumber(dto.primaryDebitAmount) || this.$notNumber(dto.primaryCreditAmount )){
                  this.$alert('凭证借贷金额必须为数字', '提示', {
                    confirmButtonText: '确定',
                  });
                  validFlag = false
                }else if(!dto.aabstract){
                  this.$alert('凭证摘要不能为空', '提示', {
                    confirmButtonText: '确定',
                  });
                  validFlag = false
                }else if(parseInt(dto.primaryDebitAmount) <0 || parseInt(dto.primaryCreditAmount) <0){

                }
                counting.push(+dto.primaryCreditAmount,-dto.primaryDebitAmount)
              });

              if(counting.reduce((a,b)=>a+b) !== 0){
                this.$alert('凭证总账不平，无法添加', '提示', {
                  confirmButtonText: '确定',
                });
                validFlag = false
              }

              if(!validFlag){
                this.hasModify = true;
                return
              }



              //2.save action

              //2.1 组装请求参数
              console.log('addVoucher,result=')
              // console.log(this.rowData)
              // this.voucherXlmDto.journalEntryDtoList=this.rowData
              //2.2 发送请求
              if(this.saveOrUpdate ==='save'){
                console.log('saveOrUpdate=save')
                console.log(this.voucherXlmDto)
                let res = addVoucher(this.voucherXlmDto).then((resp) => {
                  console.log('addVoucher then resp == ')
                  console.log(resp)
                  console.log(resp.code)
                  if(resp.code !== 0){
                    this.hasModify = true;
                  }else{
                    this.voucherXlmDto.id=resp.data
                    this.saveOrUpdate = 'update'
                  }
                })
                console.log('addVoucher return resp == ')
                console.log(res)
              }else{
                console.log('saveOrUpdate=update')
                console.log(this.voucherXlmDto)
                let res= updatevoucher(this.voucherXlmDto).then((resp) => {
                  console.log('addVoucher then resp == ')
                  console.log(resp)
                  console.log(resp.code)
                  if(resp.code !== 0){
                    this.hasModify = true;
                  }
                })
                console.log(res)
              }

              //3.call to refresh
              this.$root.$emit('search:voucherSearcher','')

            },
            del:function () {
              this.emptyList();
            },
            onRowDelete:function (data) {
              this.hasModify = true;

              console.log('onRowDelete')
              //删除对应的行数据
              console.log(data)
              // 根据分录号删除
              console.log(this.voucherXlmDto.journalEntryDtoList )
              this.voucherXlmDto.journalEntryDtoList= this.voucherXlmDto.journalEntryDtoList.filter(dto => {console.log(dto.id !== data.row.id);return dto.id !== data.row.id;})
              console.log(this.voucherXlmDto.journalEntryDtoList)
            },
            emptyList:function () {
              this.addList = [];
              this.delList = [];
              this.rowData =[];
              this.headerData ={};
              this.voucherXlmDto = {}
              this.voucherXlmDto.journalEntryDtoList = []
            },
            GetVoucherDetail: function(voucherNo){
              console.log('GetVoucherDetail')
              let data={id: voucherNo}
              getVoucherDetail(data).then(
                  resp =>{console.log(resp);
                    // 详情原数据
                    this.voucherXlmDto=resp.data
                    resp.data.journalEntryDtoList.forEach((data) =>{
                      //TODO
                      data.accountCodeFull =data.accountCode
                    })
                    if(resp.data.journalEntryDtoList && resp.data.journalEntryDtoList.length >0){
                      this.rowData = this.$clone(resp.data.journalEntryDtoList)

                      // this.rowData.forEach((data) =>{
                      //   //TODO
                      //   data.accountCodeFull =data.accountCode
                      // })

                      this.refreshTable()
                    }
                  }
              )
            },
            beforeAddVoucher: function(){
              beforeAddVoucher().then(resp =>{
                console.log("beforeAddVoucher")
                console.log(resp)
                this.voucherHead = resp.data
                Object.assign(this.voucherXlmDto, this.voucherHead)
                //设置凭证头信息
                this.voucherXlmDto.company = this.voucherHead.ncCompanyId

                //todo companyId?
                this.voucherXlmDto.companyId = this.voucherHead.ncCompanyId

              })
            },
            //现金流量分析
            cashAnalyse:function () {
              this.hasModify = true
              console.log('cashAnalyse  rowData=')
              console.log(this.rowData)
              console.log(this.voucherXlmDto)
              // this.hasModify = true
              let event = {
                show:true,
                allData: this.$clone(this.voucherXlmDto),
                doms:this
              }
              //todo
              this.$store.dispatch('CashFlowEvent',event).then(resp=>{})
            },
          //TOOD 前端更新错误
            updateListFormData(rowId,key,newValue){
              // this.voucherXlmDto.journalEntryDtoList.filter(data=> data.id === rowId)[key] = newValue
              this.voucherXlmDto.journalEntryDtoList.forEach(data => {
                console.log('updateListFormData, this.voucherXlmDto.journalEntryDtoList=',this.voucherXlmDto.journalEntryDtoList)
                if( data.id === rowId){
                  console.log(data)
                  console.log(rowId)
                  console.log(key)
                  console.log(newValue)
                  data[key]=newValue
                }
              })
            },
            tableInstance:function (instance) {
              this.tabInstance = instance;
            },
            onRowAdd:function (newItem) {
              // this.tmp = newItem
              console.log('onRowAdd event=',newItem)
              console.log('onRowAdd this.rowData=',this.rowData)
              let idList = []
              if(this.rowData.length !== 0){
                this.rowData.forEach((data)=>{
                  if(data.id){
                    idList.push(data.id)
                  }
                })
                let max = idList.reduce((a,b)=>a>b?a:b)
                if(!max){
                  max=0
                }
                newItem[0].id=parseInt(max)+1
              }else{
                newItem[0].id=1
              }
              console.log('onRowAdd event=',newItem[0])
              this.voucherXlmDto.journalEntryDtoList.push(newItem[0])
              this.rowData = this.voucherXlmDto.journalEntryDtoList
            },
            beforeCashFlow:function(){
              beforeCashFlow(this.voucherXlmDto).then((resp) =>{
                console.log('beforeCashFlow resp=',resp)
                if(resp.code === 0){
                  this.voucherXlmDto=resp.data
                  this.rowData = this.voucherXlmDto.journalEntryDtoList
                  this.refreshTable()
                }
              })
            },
            refreshTable(){
              console.log('refreshTable rowData=',this.rowData)
              this.rowData.forEach(resp =>{
                if(Math.round(resp.primaryCreditAmount*1000)/1000 === 0 ){
                  resp.sameAmount = resp.primaryDebitAmount
                }else{
                  resp.sameAmount = resp.primaryCreditAmount
                }
              })
            }
        }
    }

</script>

<style scoped>

</style>
