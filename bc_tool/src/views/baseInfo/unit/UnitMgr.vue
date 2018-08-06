<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <ActionBar>
      <el-button class="action-item cancel" type="info" :disabled="hasModify ? false : true" @click="cancelModify">{{$t('button.cancel')}}</el-button>
      <el-button class="action-item" type="primary" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>
      <el-button class="action-item" type="primary" @click="query">{{$t('button.refresh')}}</el-button>

    </ActionBar>

    <SCContent>
      <!--列表 -->
      <SCTable :columnDefs="columnDefs"
               :singleTable="true"
               :rowData="rowData"
               :showTool="true"
               :enablePagination="false"
               @onCellValueChanged="onCellValueChanged"
               @onRowDelete="onRowDelete"
               >

      </SCTable>

    </SCContent>


  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCModify from '@/components/SCModify'

  import {findUnitList, saveUnitUpdate} from '@/api/unitMgr'

  export default {
    components: {ActionBar,SCContent, SCTable},
    data() {
      return {
        editable: false,
        columnDefs: [
          {headerName: '计量单位名称', field: 'name'},
        ],
        rowData:[],
        detailRowData:[],
        hasModify:false,
        updateData:{
          del:[],
          edit:[]
        }
      }
    },
    mounted() {
      this.query();
    },
    methods: {
      resetUpdateData:function () {
        this.updateData={
          del:[],
          edit:[]
        }
      },
      query:function(){
        findUnitList().then( (response) => {
            this.rowData = response.data;
        });
      },
      onCellValueChanged:function (event) {
          console.log(event);
          if(event.oldValue != event.newValue){
            this.hasModify = true;

            this.updateData.edit.push(event.row);
          }

      },
      onRowDelete:function(rowEvent){

          //判断删除的是否有id,没有id表示删除的空行
          if(rowEvent.row.hasOwnProperty('id')){
            this.hasModify = true;
            let row = rowEvent.row;
            this.updateData.del.push(row);

          }
      },
      cancelModify:function () {
        this.$confirm("确定放弃修改?", "提示", {
          type:'info',
          callback:(action, instance)=>{
            if('confirm' == action){
              this.query();
              this.hasModify = false;
              this.resetUpdateData();
            }
          }
        });
      },
      save:function () {
        console.log("this.updateData:",this.updateData);
        saveUnitUpdate(this.updateData).then((response) => {

          this.$message({
            showClose: true,
            message: this.$t('message.success'),
            type: 'success',
            duration:5000
          });
          this.query();
          this.hasModify = false;
          this.resetUpdateData();
        });
      }

    }

  }
</script>

<style scoped>
  .s{
    color: #4ed5ff;
    color: #6f6f6f;
  }
</style>
