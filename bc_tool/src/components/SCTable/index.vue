<template>
  <div class="table-content" >
      <div :style="{height: tableHeight +'px' }">
          <ag-grid-vue class="ag-table ag-theme-balham"
                       :animateRows="true"
                       :gridOptions="gridOptions"
                       :columnDefs="columnDefs"
                       :rowData="rowData"
                       :multiple="multiple"
                       :suppressRowClickSelection="suppressRowClickSelection"
                       :selectCheckbox="selectCheckbox"
                       :unSelectCheckbox="unSelectCheckbox"
                       :selectDetailIds="selectDetailIds"
                       :enableColResize="true"
                       :enableSorting="true"
                       :rowSelected="onRowSelected"
                       :selectionChanged="onSelectionChanged"
                       :cellClicked="onCellClicked"
                       :rowDoubleClicked="onRowDoubleClicked"
                       :cellDoubleClicked="onCellDoubleClicked"
                       :cellValueChanged="onCellValueChanged"
                       :cellEditingStoppedEvent="cellEditingStoppedEvent"
                       :rowDataChanged="rowDataChanged"
                       :gridReady="onReady"
                       :pagination="enablePagination"
                       :paginationPageSize="pageSize"
                       :suppressPaginationPanel="true"
                       overlayNoRowsTemplate='<span class="overlay-nodata-center">暂无数据</span>'
                       overlayLoadingTemplate='<span class="overlay-loading-center">正在加载...</span>'
          >
          </ag-grid-vue>
      </div>
      <div v-if="enablePagination || showTool" class="tool-wrapper">

          <div v-if="showTool" :class="editable ? 'tool-bar' : 'tool-bar disable'">
              <ul class="tool">
                  <li v-if="showAddIcon"><a @click="addRow"><i class="el-icon-plus"></i></a></li>
                  <li><a @click="delRow"><i class="el-icon-delete"></i></a></li>
              </ul>
          </div>

          <div class="pagination-wrapper">
              <el-pagination v-if="enablePagination"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-size="pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="total">
              </el-pagination>
          </div>

      </div>

  </div>
</template>

<script>
    import {AgGridVue} from "ag-grid-vue";
    export default{
        props:{
            singleTable:{
                type:Boolean,
                default:false
            },
            height:{},
            editable:{
                type:Boolean,
                default:true
            },
            columnDefs:{},
            enablePagination:{
                type:Boolean,
                default:true
            },
            rowData:{},
            pageSize:{
                default:50
            },
            currentPage:{},
            total:{},
            showTool:{
                type:Boolean,
                default:true
            },
            autoResize:{
                type:Boolean,
                default:false
            },
            suppressRowClickSelection:{
              type:Boolean,
              default:false
            },
            multiple:{
              type:Boolean,
              default:false
            },
            selectCheckbox:{
              type:Boolean,
              default:false
            },
            unSelectCheckbox:{
              type:Boolean,
              default:false
            },
            selectDetailIds:{
              type:Array,
              default: function () {
                return []
              }
            },
            cellEditingStoppedEvent:{

            },
            showAddIcon:{
              type:Boolean,
              default:true
            }
        },
        components: {AgGridVue},
        data:function () {
            return {
                instance:null,
                gridOptions:{
                    defaultColDef:{
                        editable: this.editable
                    }
                }
            };
        },
        computed:{
            tableHeight:function () {
                if(this.height && this.height != 'undefined'){
                    return this.height;
                }else{
                  if(this.singleTable){
                    return ($(window).height()-200);
                  }else{
                    return ($(window).height()-240)/2;
                  }
                }


            }
        },
        created:function(){
          this.$root.$off("onRowAdd");
          this.$root.$on("onRowAdd",()=>{
            this.addRow();
        });
        },
        methods:{
            onReady:function (params) {
                this.instance = params;
                let cls = params.columnApi.getAllGridColumns();
                cls.forEach((item)=>{
                    item.colDef.enableCellChangeFlash = true;
                    if(item.colDef.type == 'dateColumn'){
                        item.colDef.editable = false;
                        return ;
                    }
                    if(item.colDef.editable == false){
                        item.colDef.cellStyle = {'color': '#000', 'background-color': '#f5f5f5','opacity':0.8};
                    }


                });
                if(this.multiple){
                    this.gridOptions.rowSelection = 'multiple';
                }else {
                    this.gridOptions.rowSelection = 'single';
                }
                this.gridOptions.onCellEditingStopped = this.cellEditingStoppedEvent;
                if(this.autoResize){
                  params.columnApi.autoSizeColumns();
                }else{
                  params.api.sizeColumnsToFit();
                }
                params.api.redrawRows();
                this.$emit('afterInit', params);
                this.$emit('tableInstance', this.instance);
            },
            addRow:function (event,isAutoSet) {
                //加上event 用于子组件传递行数据，在addRow之后自动赋值
                let newItem = [{isNewRow:true,event:event}];
                if(isAutoSet && event){
                  this.instance.api.updateRowData({add: event});
                }else{
                  this.instance.api.updateRowData({add: newItem});
                }
                let index = this.instance.api.getLastDisplayedRow();
                let node = this.instance.api.getDisplayedRowAtIndex(index);
                node.setSelected(true, true);
                this.$emit('onRowAdd', newItem);

            },
            delRow:function () {
                let selectedNodes = this.instance.api.getSelectedNodes();
                let selectedRows = this.instance.api.getSelectedRows();

                if(selectedRows && selectedRows.length>0){
                    let row = selectedRows[0];
                    let node = selectedNodes[0];

                    this.$confirm("确定删除?", "提示", {
                      type:'info',
                      callback:(action, instance)=>{
                        if('confirm' == action){
                          this.$emit('onRowDelete', {row:row, node:node});
                          this.instance.api.updateRowData({remove: selectedRows});
                        }
                      }
                    });
                }
            },
            onSelectionChanged:function (params) {
                let selectedRows = params.api.getSelectedRows();
                let selectedNodes = params.api.getSelectedNodes();

                if(selectedRows && selectedRows.length>0){
                    let row = selectedRows[0];
                    let node = selectedNodes[0];
                    this.$emit('onRowSelected', {row:row, node:node});
                }
            },

            onRowSelected:function (event) {
              //this.$emit('selectNodes',this.instance.api.getSelectedNodes());
              this.$emit('selectCurrentNode',event.node);
            },
            onRowDoubleClicked:function (event) {
                this.$emit('onRowDoubleClicked', event );
            },
            onCellClicked:function (event) {
                this.$emit('onCellClicked', event );
            },
            onCellDoubleClicked:function (event) {
                this.$emit('onCellDoubleClicked', event );
            },
            onCellValueChanged:function (event) {
                let row = event.data;
                this.$emit('onCellValueChanged', {
                    oldValue:event.oldValue,
                    newValue:event.value,
                    rowIndex:event.rowIndex,
                    colId:event.column.colId,
                    row:row
                } );
            },
            handleCurrentChange:function (page) {
                this.$emit('onPageChanged', page);
            },
            rowDataChanged:function (event) {
                if(this.selectCheckbox && this.instance) {
                  this.instance.api.selectAll();
                }
                if(this.unSelectCheckbox && this.instance) {
                  this.instance.api.deselectAll();
                }
                if(this.selectDetailIds.length > 0 && this.instance) {
                  for (let detailId of this.selectDetailIds) {
                    this.instance.api.forEachNode(function (node) {
                        if(detailId == node.data.id){
                            console.log(node);
                            node.setSelected(true);
                        }
                    });
                  }
                }
            }
        }
    }
</script>


<style scoped>
  .table-content{
    position: relative;
    width: 100%;
    margin-top: 3px;
    margin-left: 3px;
    margin-right: 3px;
    margin-bottom: 10px;
    /*border: 1px solid #bcbcbc;*/
    background-color: #fff;
    /*overflow:hidden;*/
  }

  .table-content .tool-wrapper{
      position: relative;
      height: 33px;
      border-left: 1px solid #a7a7a7;
      border-right: 1px solid #a7a7a7;
      border-bottom: 1px solid #a7a7a7;
  }

  .table-content .tool-wrapper .tool-bar{
      position: absolute;
      width: 30%;
      height: 33px;
      left:0;
      padding: 5px 10px;
  }

  .table-content .tool-wrapper .pagination-wrapper{
      position: absolute;
      width: 40%;
      height: 33px;
      right:0;
      text-align: right;
      padding-right: 10px;
  }


  .table-content .tool-wrapper .tool-bar .tool{
      list-style: none;
      -webkit-padding-start: 0px;
      -webkit-margin-before: 3px;
      -webkit-margin-after: 0px;
  }
  .table-content .tool-wrapper .tool-bar .tool li{
      display: inline-block;
      width: 24px;
      height: 20px;
      margin-right: 5px;
      text-align: center;
      float: left;
  }

  .table-content .tool-wrapper .tool-bar .tool li a{
      display: inline-block;
  }

  .disable a{
      cursor: not-allowed;
  }


</style>
