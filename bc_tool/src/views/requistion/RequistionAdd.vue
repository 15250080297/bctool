<template>
  <div class="edit-container">
    <SCModify id="purchaseModify" :show="showAdd">
      <ActionBar slot="menu">
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>


       <!-- <el-dropdown>
          <el-button class="action-item">
            {{$t('button.accessory.title')}}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{$t('button.accessory.sub.unionQuery')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->

      </ActionBar>

      <!-- detail -->
      <SCContent slot="content">

        <!-- form-->
        <SCContent>
          <el-form ref="headerData" :model="headerData" label-width="80px" :rules="rules">

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="请购单号" prop="code">
                  <el-input v-model="headerData.code" @change="changeForm" readonly="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="请购日期" prop="requisitionTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.requisitionTime" style="width: 100%;" @change="changeForm"   value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="事业部"  prop="buId">
                  <el-select v-model="headerData.buId" placeholder="" @change="changeForm">
                    <el-option label="粮油事业部" value="1"   ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="备注" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.remark"  @change="changeForm" maxlength="50"></el-input>
                </el-form-item>
              </el-col>



            </el-row>


          </el-form>
        </SCContent>

        <!--详情 -->
        <SCTable :columnDefs="columnDefs"
                 :enablePagination="false"
                 :rowData="rowData"
                 :autoResize="true"
                 @onCellValueChanged="onModifyTableCellValueChanged"
                 @onRowSelected="onRowSelected"
                 @onRowDelete="onRowDelete"
                 @onCellDoubleClicked="onCellDoubleClicked"

        >
        </SCTable>

      </SCContent>


    </SCModify>
    <Datepicker @onOkClick="onDatepickerOk"></Datepicker>
    <ProductSelect ></ProductSelect>
  </div>

</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import SCModify from '@/components/SCModify'
  import { addRequistion } from '@/api/requistion'
  import Datepicker from '@/components/Datepicker'
  import ProductSelect from '@/components/ProductSelect'
  export default {
    components: {ActionBar,SCContent, SCTable,SCModify,Datepicker,ProductSelect},

    data:function () {
      return {
        // gridInstance:null,
        currentPage:1,
        total:100,
        pageSize:50,
        columnDefs:[
          {headerName: '存货编码', field: 'erpCode',type:'dateColumn'},
          {headerName: '存货名称', field: 'productName', editable: false},
          {headerName: '规格', field: 'specification', editable: false},
          {headerName: '型号', field: 'model', editable: false},
          {headerName: '计量单位', field: 'weightUnitId', editable: false},
          {headerName: '数量', field: 'amount'},
          {headerName: '需求日期', field: 'needTime', type:'dateColumn'},
          {headerName: '总库存', field: 'grossInventory', editable: false},
          {headerName: '所属平台', field: 'channelId', editable: false},
          {headerName: '平台库存', field: 'channelInventory', editable: false},
          {headerName: '平台日销售', field: 'channelDms', editable: false},
          {headerName: '平台库存天数', field: 'channelDih', editable: false},
          {headerName: '总计库存可销天数', field: 'grossDih', editable: false},
          {headerName: '预计可销天数', field: 'expectDih', editable: false},
          {headerName: '供应商', field: 'supplierName', editable: false}
        ],
        hasModify:false,
        rules: {
          requisitionTime: [
            { required: true, message: '请购日期不能为空', trigger: 'change' }
          ],
          buId: [
            { required: true, message: '事业部不能为空', trigger: 'change' }
          ]
        },
        rowData:[],
        headerData:{},
        finishStatus:false,
        addList:[],
        newLine:0,
        delList:[],
        updateList:[],
        preRowData:[],
        prs:'add'

      }
    },
    created:function () {
      this.$root.$off('onProSelectadd');
      this.$root.$on('onProSelectadd', (event)=>{
        this.selectPro(event);
      });
    },
    mounted:function () {

    },
    computed:{
      showAdd:function () {
        let val = this.$store.state.requistion.showAdd;
        return val;
      }
    },
    methods:{
      onModifyTableCellValueChanged:function (event) {

        if(event.oldValue != event.newValue){
          this.hasModify = true
        }
        //判断是否增加了新行
        if(this.rowData.length < (event.rowIndex + 1)){
           //  console.log("has new row:", event.rowIndex);
          if(this.newLine !=event.rowIndex){
            this.newLine = event.rowIndex;
            this.addList.push(event.row);
          }

        }

      },
      onRowDelete:function (nodes) {
          console.log("=====> onRowDelete: ", nodes)
        this.delList.push(nodes.row);
        for(var i= 0;i<this.rowData.length;i++){
          if(null !=nodes.row.proKey && this.rowData[i].proKey == nodes.row.proKey){
            this.rowData.splice(i,1);
            break;
          }
        }
        this.hasModify =  true;
      },
      onRowSelected:function (event) {
        let row = event.row;
        let node = event.node;


      },
      cancelModify:function () {

        if(this.hasModify){
          this.$confirm("确定放弃添加?", "提示", {
            type:'info',
            callback:(action, instance)=>{
              if('confirm' == action){
                this.hasModify = false;
                this.$store.dispatch('HideAddRequistionDetail').then(()=>{});
                this.emptyList();
                this.headerData ={};
              }
            }
          });
        }else{
          this.headerData ={};
          this.emptyList();
          this.$store.dispatch('HideAddRequistionDetail').then(()=>{});
        }



      },
      save:function () {
        this.$refs['headerData'].validateField('requisitionTime',(valid) => {
          if(''== valid){
            this.$refs['headerData'].validateField('buId',(valid) => {
              if ('' == valid) {
                this.hasModify = false;
                for(let i=0;i<this.rowData.length;i++){
                    if(null != this.rowData[i].proKey){
                      var flag =false;
                      for(let n =0;n<this.addList.length;n++){
                        if(this.addList[n].proKey == this.rowData[i].proKey){
                           flag =true
                        }
                      }
                      if(!flag){
                        this.addList.push(this.rowData[i])
                      }
                    }
                }


                for(let i =0 ;i <this.addList.length; i++){
                  for(let j=0; j < this.delList.length;j++){
                    if(this.addList[i].proKey == this.delList[j].proKey ){
                      this.addList.splice(i,1);
                    }
                  }
                }

                if(this.addList.length == 0){
                    this.$alert('存货编码、数量、需求日期不能为空', '提示', {
                      confirmButtonText: '确定',
                  })
                  return;
                }


                for(let i =0 ;i <this.addList.length; i++){
                  if(null ==this.addList[i].amount || ''==this.addList[i].amount){
                    this.$alert('数量不能为空', '提示', {
                      confirmButtonText: '确定',
                    });
                    return;
                  }else{
                    if(!this.isInteger(this.addList[i].amount)){
                      this.$alert('数量必须是正整数', '提示', {
                        confirmButtonText: '确定',
                      });
                      return;
                    }
                  }
                  if(null ==this.addList[i].needTime){
                    this.$alert('需求日期不能为空', '提示', {
                      confirmButtonText: '确定',
                    });
                    return;
                  }
                }

                for(let i =0 ;i <this.updateList.length; i++){
                  if(null ==this.updateList[i].amount || ''==this.updateList[i].amount){
                    this.$alert('数量不能为空', '提示', {
                      confirmButtonText: '确定',
                    });
                    return;
                  }
                  if(null ==this.updateList[i].needTime){
                    this.$alert('需求日期不能为空', '提示', {
                      confirmButtonText: '确定',
                    });
                    return;
                  }
                }

                this.headerData.addList = this.addList;
                this.headerData.delList = this.delList;
                addRequistion(JSON.stringify(this.headerData)).then((response) => {
                  if(response.code == 0 ){
                    this.$message({message: '添加成功', type: 'success'});
                    this.$store.dispatch('HideAddRequistionDetail').then(()=>{});
                    this.emptyList();
                    this.$root.$emit('refreshData','');
                  }
                })
              }
            })


          }

        });

      },
      del:function () {

      },
      changeForm:function () {
        this.hasModify = true
      },
      changeSele:function () {
        this.hasModify = true;
       // this.headerData.bu_id = this.headerData.buName;
      },
      emptyList:function () {
        this.addList = [];
        this.delList = [];
        this.rowData =[];
        this.headerData ={};
      },
      onDatepickerOk:function (event) {
     //   console.log("onDatepickerOk:", event);
        if(event.cellEvent.column.colId == 'needTime'){
          var data = event.cellEvent.node.data;
          data.needTime = event.selectedDate;
          var itemsToUpdate = [];
          itemsToUpdate.push(data);

          var res = event.cellEvent.api.updateRowData({update:itemsToUpdate});
          this.hasModify = true;
      //    console.log("res:", res);
        }

      },
      onCellDoubleClicked:function (event) {
        if(event.column.colId == 'needTime'){
          // alert(222);

          let tdEvent ={
            show:true,
            cellEvent:event
          };

          this.$store.dispatch('ShowTableDatepicker', tdEvent).then(()=>{});
        }
        if(event.column.colId == 'erpCode'){
          let psEvent ={
            show:true,
            cellEvent:event,
            flag:this.prs
          };
          this.$store.dispatch('ShowProductSelect', psEvent).then(()=>{});
        }
      },

      selectPro:function (event) {
        console.info("jin add======");
        for(var i =0 ;i <event.list.length;i++){
          this.rowData.push({"erpCode":event.list[i].erpCode,"productName":event.list[i].name,"specification":event.list[i].specification,"model":event.list[i].model,"proKey":event.list[i].erpCode,"supplierName":event.list[i].supplierName});
        }
        this.hasModify = true;

      },
      isInteger:function (obj) {
        var regu = /^[1-9]\d*$/;
        if (!regu.test(obj)) {
          return false;
        } else {
         return true;
        }
      }

    }
  }

</script>

<style scoped>

</style>
