<template>

  <el-dialog title="选择日期"
          :visible.sync="dataEvent.show"
          width="400px"
          center>
    <div class="cell-datepicker">
      <el-date-picker type="date" v-model="selectedTimestamp" value-format="timestamp" placeholder="选择日期" :editable="false"></el-date-picker>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancelClick">取 消</el-button>
      <el-button type="primary" @click="onOkClick">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
  var moment = require('moment');
  export default {
    computed:{
        dataEvent:function () {
          this.selectedTimestamp='';
           return this.$store.state.app.tableDatePickerEvent;
        }
    },
    data() {
      return {
        selectedDate:'',
        selectedTimestamp:'',
        centerDialogVisible:false
      }
    },
    watch:{
        selectedTimestamp: function (newVal, oldVal) {
            this.selectedDate = moment(newVal).format("YYYY-MM-DD");
        }
    },
    methods:{
        onOkClick:function () {

         //   console.log("dataEvent:",this.dataEvent);

            this.$emit('onOkClick', {
              selectedTimestamp:this.selectedTimestamp,
              selectedDate:this.selectedDate,
              cellEvent:this.dataEvent.cellEvent
            });

            this.hide();

        },
        onCancelClick:function () {
            this.hide();
        },
        hide:function () {
            this.$store.dispatch('HideTableDatepicker').then(()=>{});
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
