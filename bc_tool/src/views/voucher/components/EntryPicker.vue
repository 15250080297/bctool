<template>
  <el-dialog title="选择科目"
             :visible.sync="showTree.show"
          width="1000px"
          center>
    <el-container>
      <div class="app-container" style="height: 400px;overflow-y:auto;">
        <el-input placeholder="搜索科目名" v-model="filterText" style="margin-bottom:30px;"></el-input>
        <el-tree class="filter-tree" :data="data2" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2" @node-click="nodeSelected"></el-tree>
      </div>
      <SCContent>
        <el-form>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="科目编码" prop="">
                {{accountSimpleDto.subjcode}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="科目名称">
                {{accountSimpleDto.subjname}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="科目类型">
                {{accountSimpleDto.pkSubjtypeName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科目方向">
                {{accountSimpleDto.balanorientName}}
              </el-form-item>
            </el-col>
          </el-row>



        </el-form>
      </SCContent>
    </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取 消</el-button>
        <el-button type="primary" @click="onOkClick">确 定</el-button>
      </span>
  </el-dialog>

</template>

<script>
  import {getAccountList} from '@/api/voucher'
  import SCContent from '@/components/SCContent'

  var moment = require('moment');
  export default {
    components:{SCContent},
    computed:{
        showTree:function () {
           console.log("this.data2==")
           console.log(this.data2)
           return this.$store.state.voucher.showTree;
        }
    },
    data() {
      return {
        centerDialogVisible:false,
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        chosenNode:{
          id:'',
          label:'',
          bdBdinfo:'',
          bdBdname:''
        },
        accountSimpleDto:{
          subjcode:'',
          subjname:'',
          pkSubjtypeName:'',
          balanorientName:''
        }
      }
    },
    watch:{
        filterText(val) {
          this.$refs.tree2.filter(val);
        }
    },
    mounted:function(){
      getAccountList().then(response =>{
        this.data2=response.data
      })
    },
    methods:{
        onOkClick:function () {

            this.$root.$emit('onOkClick:voucherEntryPicker',this.chosenNode,this.$store.state.voucher.showTree.cellEvent);

            this.hide();

        },
        onCancelClick:function () {
            this.hide();
        },
        hide:function () {
            this.$store.dispatch('TreeDialogHide').then(()=>{});
        },
        filterNode(value, data) {
          if (!value) return true
          return data.label.indexOf(value) !== -1
        },
        nodeSelected(event){
          this.chosenNode.id=event.id
          this.chosenNode.label=event.label
          this.chosenNode.fullLabel=event.fullLabel
          this.chosenNode.bdBdinfo=event.accountSimpleDto.bdBdinfo
          this.chosenNode.bdBdname = event.accountSimpleDto.bdBdname
          this.accountSimpleDto = event.accountSimpleDto
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
