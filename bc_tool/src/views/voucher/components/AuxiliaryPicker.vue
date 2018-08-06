<template>
  <el-dialog title="选择辅助核算"
             :visible.sync="auxiliaryEvent.show"
          width="1000px"
          center>
    <el-container>
      <div class="app-container" style="height: 400px;overflow-y:auto;">
        <el-input placeholder="搜索辅助核算名" v-model="filterText" style="margin-bottom:30px;"></el-input>
        <el-tree class="filter-tree" :data="data2" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2" @node-click="nodeSelected"></el-tree>
      </div>
    </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取 消</el-button>
        <el-button type="primary" @click="onOkClick">确 定</el-button>
      </span>
  </el-dialog>

</template>

<script>
  import {getAccountList,getAuxiliaryList} from '@/api/voucher'
  import SCContent from '@/components/SCContent'

  var moment = require('moment');
  export default {
    components:{SCContent},
    computed:{
      auxiliaryEvent:function () {
        return this.$store.state.voucher.auxiliaryEvent;
      }
    },
    data() {
      return {
        centerDialogVisible:false,
        data2: '',
        defaultProps: {
          children: 'children',
          label: 'codeName',
          id:'code'
        },
        filterText: '',
        chosenNode:{
          id:'',
          label:''
        },
        auxiliaryId:''
      }
    },
    watch:{
        filterText(val) {
          this.$refs.tree2.filter(val);
        }
    },
    mounted:function(){
    },
    created:function(){
      // let data={}
      // data.bdBdinfo = this.bdBdinfo
      // getAuxiliaryList(data).then(response =>{
      //   this.data2=response.data
      // })
    },
    methods:{
        onOkClick:function () {

            // console.log("dataEvent:",this.$store.state.voucher.showTree);

            this.$root.$emit('onOkClick:voucherAuxiliaryPicker',this.chosenNode,this.$store.state.voucher.auxiliaryEvent.cellEvent);

            this.hide();

        },
        onCancelClick:function () {
            this.hide();
        },
        hide:function () {
            this.$store.dispatch('AuxiliaryDialogHide').then(()=>{});
        },
        filterNode(value, data) {
          if (!value) return true
          return data.codeName.indexOf(value) !== -1
        },
        nodeSelected(event){
          console.log('nodeSelected')
          console.log(event)
          this.chosenNode.id=event.code
          this.chosenNode.label=event.codeName
        },
        initSupporter(){
          console.log("=====initSupporter====")
          this.auxiliaryId = this.$store.state.voucher.auxiliaryEvent.cellEvent.data.auxiliaryAccountingTypeCode
          let data={}
          data.bdBdinfo = this.auxiliaryId
            getAuxiliaryList(data).then(response =>{
              console.log('getAuxiliaryList')
              console.log(response)
              this.data2=response.data
            })
        }
    }
  }
</script>

<style scoped>
.cell-datepicker{
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 20px 20px;
}

.el-picker-panel .el-date-picker .el-popper  {
  display: block !important;
}

</style>
