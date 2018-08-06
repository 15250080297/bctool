<template>

  <el-dialog title="审批状态"
             :visible.sync="dataEvent.show"
             center >

    <el-steps  align-center :active="activeNumber">
      <el-step :key="item.id" :title="item.userName" v-for="item of approvalDetailList"></el-step>
    </el-steps>

      <SCContent>
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :editable="false"
                 :showTool="false"
                 :enablePagination="false">
        </SCTable>
      </SCContent>


      <div v-if="dataEvent.approval" class="approval-div">
          <el-radio v-model="isPass" label="Y">批准</el-radio>
          <el-radio v-model="isPass" label="N">不批准</el-radio>
          <el-input class="approval-textarea" type="textarea" :rows="2" placeholder="批示内容" v-model="suggesion"></el-input>
      </div>

      <span slot="footer" class="dialog-footer" v-if="dataEvent.approval">
          <el-button type="primary" @click="doApproval">确 定</el-button>
          <el-button @click="onCancelClick">取 消</el-button>
      </span>

  </el-dialog>

</template>

<script>
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import { approvalLogList,approvalDetailList,doApproval} from '@/api/approval'

  export default {
    components: {SCContent, SCTable},
    computed:{
      dataEvent:function () {
        this.loadApprovalLogList();
        this.loadApprovalDetailList();
        return this.$store.state.app.approvalStreamEvent;
      }
    },
    data() {
      return {
        columnDefs: [
          {headerName: '发送人', field: 'sendUserName'},
          {headerName: '发送日期', field: 'sendTime'},
          {headerName: '审批人', field: 'approvalUserName'},
          {headerName: '审批日期', field: 'approvalTime'},
          {headerName: '历时', field: 'costTime'},
          {headerName: '审批状况', field: 'statusName'},
          {headerName: '说明', field: 'suggesion'}
        ],
        rowData:[],
        approvalDetailList:[],
        activeNumber:1,
        isPass:'Y',
        suggesion:''
      }
    },
    mounted:function () {
    },
    methods:{
      loadApprovalLogList:function () {
        let param = {
          "approvalId": this.$store.state.app.approvalStreamEvent.approvalId
        }
        approvalLogList(JSON.stringify(param)).then((response) => {
          if(0 == response.code){
              this.rowData = response.data;
          }
        })
      },
      loadApprovalDetailList:function () {
        let param = {
          "approvalId": this.$store.state.app.approvalStreamEvent.approvalId
        }
        approvalDetailList(JSON.stringify(param)).then((response) => {
          if(0 == response.code){
            this.approvalDetailList = [];
            if(response.data.length == 0){
              return;
            }
            this.activeNumber = 1;
            this.approvalDetailList.push({"userName":"开始","id":0});
            let flag = true;
            let i = 0;
            if(response.data.length == 0){
              this.approvalDetailList.push({"userName":"结束","id":999999999});
              this.activeNumber = 2;
            }
            for(let detail of response.data){
                console.log(this.approvalDetailList);
                if(flag && 'S' == detail.status){
                  this.activeNumber = this.activeNumber + 1;
                }else {
                    flag = false;
                }
                this.approvalDetailList.push(detail);
                if(this.activeNumber == response.data.length + 1){
                  this.activeNumber = this.activeNumber + 1;
                }
                i++;
                if(i == response.data.length){
                  this.approvalDetailList.push({"userName":"结束","id":999999999});
                }
            }
          }
        })
      },
      doApproval:function () {
        let param = {
          "approvalId": this.$store.state.app.approvalStreamEvent.approvalId,
          "isPass":this.isPass,
          "suggesion":this.suggesion,
          "approvalType":this.$store.state.app.approvalStreamEvent.approvalType
        }
        doApproval(JSON.stringify(param)).then((response) => {
          if(0 == response.code){
            this.hide();
          }
        })
      },
      onCancelClick:function () {
        this.hide();
      },
      hide:function () {
        this.$store.dispatch('HideApprovalStream').then(()=>{});
      }
    }
  }
</script>

<style scoped>
  .approval-div{
    text-align: center;
  }
  .approval-textarea{
    margin-top: 10px;
  }
</style>
