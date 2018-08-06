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

  import {warehouseInsert, warehouseSelectAll, warehouseUpdate, warehouseDeleteUpdate} from '@/api/warehouse'

  export default {
    components: {ActionBar,SCContent, SCTable},
    data() {
      return {
        editable: false,
        columnDefs: [
          {headerName: '仓库编号', field: 'code'},
          {headerName: '仓库名称', field: 'name'},
          {headerName: '仓库地址', field: 'address'},
          {headerName: '负责人', field: 'contacts'},
          {headerName: '负责人电话', field: 'mobile'},
        ],
        rowData:[],
        detailRowData:[],
        hasModify:false,
        updateData:{
          del:[],
          edit:[],
          add:[]
        },
        newLine: 0,
        newList: []
      }
    },
    mounted() {
      this.query();
    },
    methods: {
      resetUpdateData: function () {
        this.updateData = {
          del: [],
          edit: [],
          add: []
        }
      },
      query: function () {
        warehouseSelectAll().then((response) => {
          this.rowData = response.data;
        });
      },
      onCellValueChanged: function (event) {
        if (event.oldValue != event.newValue) {
            this.hasModify = true;
            for(let i=0;i<this.updateData.edit.length;i++){
                if(event.row.id == this.updateData.edit[i].id){
                  this.updateData.edit.splice(i, 1);
                }
            }
          if(event.row.id != undefined) {
            this.updateData.edit.push(event.row);
          }
        }

        if (this.rowData.length < (event.rowIndex + 1)) {
            this.updateData.add.push(event.row);
        }
      },
      onRowDelete: function (rowEvent) {
        console.info("4445")
        //判断删除的是否有id,没有id表示删除的空行
        if (rowEvent.row.hasOwnProperty('id')) {
          this.hasModify = true;
          let row = rowEvent.row;
          this.updateData.del.push(row);
        }
      },
      cancelModify: function () {



        this.$confirm("确定放弃修改?", "提示", {
          type: 'info',
          callback: (action, instance) => {
            if ('confirm' == action) {
              this.query();
              this.hasModify = false;
              this.resetUpdateData();

            }
          }
        });
      },
      save: function () {
        for(let i= 0;i<this.updateData.add.length;i++){
            if(this.updateData.add[i].code == null || this.updateData.add[i].code == undefined){
              console.log("for判断仓库编号")
              console.log(this.updateData.add[i].code);
              this.hasModify = false;
              this.$alert('仓库编号不能为空', '提示', {
                confirmButtonText: '确定',
              });
              return;
            }
            else if(this.updateData.add[i].name == null || this.updateData.add[i].name == undefined){
            console.log("for判断仓库名字");
            console.log(this.updateData.add[i].name);
            this.hasModify = false;
            this.$alert('仓库名称不能为空', '提示', {
              confirmButtonText: '确定',
            });
            return;
          }

        }

        if(this.updateData.add != null){
          this.newList=Array.from(new Set(this.updateData.add));
          this.updateData.add=this.newList;
        }


//        /(^\s*)|(\s*$)/g
//        for(let i= 0;i<this.updateData.add.length;i++){
//          if(this.updateData.add[i].code == /^ *$/){
//            console.log("for判断")
//            this.hasModify = false;
//            this.$alert('仓库编号不能为空', '提示', {
//              confirmButtonText: '确定',
//            });
//            return;
//          }
//          else if(this.updateData.add[i].name == /^ *$/){
//            console.log("for判断")
//            this.hasModify = false;
//            this.$alert('仓库名称不能为空', '提示', {
//              confirmButtonText: '确定',
//            });
//            return;
//          }
//        }


//        let dd=/^[1][3,4,5,8][0-9]{9}$/;
//        for(let i= 0;i<this.updateData.add.length;i++){
//          if(this.updateData.add[i].mobile != dd){
//            console.log("for判断手机号");
//            this.$alert('手机号格式不正确', '提示', {
//              confirmButtonText: '确定',
//            });
//            return;
//          }
//        }



        warehouseUpdate(this.updateData).then((response) => {
          if(response.code==0){
            this.$message({
              showClose: true,
              message: this.$t('message.success'),
              type: 'success',
              duration: 5000
            });
            this.query();
            this.hasModify = false;
            this.resetUpdateData();
          }
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
