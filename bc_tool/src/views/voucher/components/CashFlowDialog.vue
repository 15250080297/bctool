<template>
  <el-dialog title="现金流量分析"
             :visible.sync="showDialog.show"
             width="1000px"
             center>

    <TreeDialog>
      <div class="app-container" style="height: 400px;overflow-y:auto;" slot="tree">
        <el-input placeholder="搜索科目名"  v-model="filterText" style="margin-bottom:30px;"></el-input>
        <el-tree class="filter-tree" :data="data2" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2" @node-click="nodeSelected"></el-tree>
      </div>
    </TreeDialog>

    <div class="tab-container">
      <SCContent>
        <!--列表 -->
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :editable="false"
                 :currentPage="currentPage"
                 :total="total"
                 :pageSize="pageSize"
                 :enablePagination="false"
                 :showTool="false"
                 @onRowSelected="onRowSelected"
                 @onCellDoubleClicked="onCellDoubleClicked"
                 @onRowDoubleClicked="onRowDoubleClicked"
                 @onPageChanged="onPageChanged">
        </SCTable>

      </SCContent>
    </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取 消</el-button>
        <el-button type="primary" @click="onOkClick">保 存</el-button>
      </span>
  </el-dialog>
</template>

<script>
    import SCContent from '@/components/SCContent'
    import SCTable from '@/components/SCTable'
    import TreeDialog from '@/views/voucher/components/TreeDialog'
    import {getCashFlow} from '@/api/voucher'
    export default {
      components: {SCContent, SCTable,TreeDialog},
      name: "TableDialog",
      data(){
        return{
          data2:'',
          currentPage:1,
          total:100,
          pageSize:50,
          rowData:'',
          columnDefs:[
            {headerName: '分录号', field: 'id'},
            {headerName: '会计科目', field: 'accountCode' , editable: false},
            {headerName: '辅助核算', field: 'auxiliaryAccountingTypeName', editable: false},
            {headerName: '币种', field: 'currency', cellEditor: "agSelectCellEditor",cellEditorParams: {
                values: ['CNY']
              }, editable: false},
            // {headerName: '方向', field: 'forward'},
            //TODO 与借方-贷方相同
            {headerName: '主表表项', field: 'pkCashflow',editable:false},
            {headerName: '原币', field: 'sameAmount'},
            {headerName: '本币', field: 'primaryDebitAmount'}
          ],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          filterText:'',
          chosenNode:{
            id:'',
            label:''
          },
          //TODO 保存现金流量分析的表单数据
          voucherXlmDto:'',
          par_doms:''
        }
      },
      watch:{
        filterText(val) {
          this.$refs.tree2.filter(val);
        }
      },
      methods:{
        onRowSelected(){

        },
        onCellDoubleClicked(event){
          let eventTmp = {
            show:true,
            cellEvent: event
          }
          if(event.column.colId === 'pkCashflow'){
            this.$store.dispatch('ShowCashFlowList', eventTmp).then(()=>{});
            this.GetCashFlowList()
          }
        },
        onRowDoubleClicked(event){

        },
        onPageChanged(){

        },
        generateInitData(data,doms){
          console.log(' generateInitData  this.voucherXlmDto=', this.voucherXlmDto)
          this.par_doms = doms
          // form表单数据赋值
          this.voucherXlmDto = data

          // 查询并返回应包含现金流的科目

          this.rowData = []
          let rowData = data.journalEntryDtoList
          let cashFlowRowData=[]
          for (let i = 0; i < rowData.length; i++) {
            if(rowData[i].otherUserDataDtoList && rowData[i].otherUserDataDtoList.length >0){
              cashFlowRowData.push(rowData[i])
            }
          }
          for (let i = 0; i < rowData.length; i++) {
            if(!rowData[i].otherUserDataDtoList){
              continue
            }
            for (let j = 0; j < rowData[i].otherUserDataDtoList.length; j++) {
            let thisRow = {}
            //分录号
            thisRow['id'] = rowData[i].id
            thisRow['accountCode'] = rowData[i].accountCode
            thisRow['auxiliaryAccountingTypeCode'] = rowData[i].auxiliaryAccountingTypeCode
            thisRow['auxiliaryAccountingTypeName'] = rowData[i].auxiliaryAccountingTypeName
            thisRow['currency'] = rowData[i].currency
            thisRow['sameAmount'] = rowData[i].otherUserDataDtoList[j].moneymain
            thisRow['primaryDebitAmount'] = rowData[i].otherUserDataDtoList[j].money
            thisRow['pkCashflow'] = rowData[i].otherUserDataDtoList[j].pkCashflow
            thisRow['forward'] = 'TODO'// data[i].otherUserDataDtoList[j].
            thisRow['journalEntry_index'] = i
            thisRow['otherUserData_index'] = j
            this.rowData.push(thisRow)
            }
          }
          console.log('generateInitData')
          console.log(this.rowData)
        },
        GetCashFlowList(){
          getCashFlow().then(response => {
            console.log('GetCashFlowList')
            console.log(response)
            this.data2 = response.data
          })
        },
        filterNode(value, data) {
          if (!value) return true
          return data.label.indexOf(value) !== -1
        },
        nodeSelected(event){
          this.chosenNode.id=event.id
          this.chosenNode.label=event.label
        },
        onOkClick(){
          // this.voucherXlmDto = 'shit'
          this.$root.$emit('onOkClick:cashFlowDialog',this.voucherXlmDto,this.par_doms)
          this.hide()
        },
        onCancelClick(){
          this.hide()
        },
        hide(){
          let event ={
            show:false
          };
          this.$store.dispatch('CashFlowEvent',event).then(resp=>{})
        },
        updateFormData(rowIndex1,rowIndex2,key,value){
          this.voucherXlmDto.journalEntryDtoList[rowIndex1].otherUserDataDtoList[rowIndex2][key]=value
        }
      },
      computed:{
        // Bug: dead logic
        showDialog(){
           console.log('showDialog')
           console.log(event)
           let event ={
             show:false
           };
           if(this.$store.state.voucher.cashFlowEvent && this.$store.state.voucher.cashFlowEvent.show ===true){
             event = this.$store.state.voucher.cashFlowEvent
             this.generateInitData(event.allData,event.doms)
           }

           return event;
        }
      },
      created:function () {
        this.$root.$off('onOkClick:getCashFlow')
        this.$root.$on('onOkClick:getCashFlow',(event)=>{
          console.log('onOkClick:getCashFlow')
          console.log(event)
          // 更新ag-grid 表格
          var itemUpdateList = []
          var dataTmp = event.node.data
          dataTmp.pkCashflow = this.chosenNode.label
          itemUpdateList.push(dataTmp)
          var res = event.api.updateRowData(itemUpdateList)
          console.log(res)

          // 更新Form表单
          this.updateFormData(event.data.journalEntry_index,event.data.otherUserData_index,'pkCashflow',this.chosenNode.label)
          this.updateFormData(event.data.journalEntry_index,event.data.otherUserData_index,'pkCashflowCode',this.chosenNode.id)

          console.log(this.voucherXlmDto)

        })
      }
    }
</script>

<style scoped>

</style>
