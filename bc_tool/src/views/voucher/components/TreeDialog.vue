<template>
  <el-dialog title="现金流量项目"
             :visible.sync="showDialog.show"
             width="1000px"
             center append-to-body>
    <div class="tab-container">
      <slot name="tree"></slot>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取 消</el-button>
        <el-button type="primary" @click="onOkClick">保 存</el-button>
      </span>
  </el-dialog>
</template>

<script>
    export default {
        name: "TreeDialog",
        computed:{
          showDialog(){
            console.log('TreeDialog:showDialog')
            let event = {
              show:false
            }
            if(this.$store.state.voucher.cashFlowListEvent){
              event = this.$store.state.voucher.cashFlowListEvent
            }
           return event
          }
        },
      methods:{
        onOkClick(){
          this.$root.$emit('onOkClick:getCashFlow',this.$store.state.voucher.cashFlowListEvent.cellEvent)
          this.hide()
        },
        onCancelClick(){
          this.hide()
        },
        hide(){
          this.$store.dispatch('HideCashFlowList').then(response => {})

        }
      }
    }
</script>

<style scoped>

</style>
