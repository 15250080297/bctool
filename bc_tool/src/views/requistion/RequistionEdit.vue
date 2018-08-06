<template>
  <div class="edit-container">
    <SCModify id="purchaseModify" :show="showDetail">
      <ActionBar slot="menu">
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>
        <el-button class="action-item del" type="info" @click="del">{{$t('button.del')}}</el-button>

        <el-dropdown>
          <el-button class="action-item">
            {{$t('button.accessory.title')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{$t('button.accessory.sub.unionQuery')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

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
                <el-form-item label="事业部" prop="buName">
                    <el-input v-model="headerData.buName" @change="changeForm" readonly="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="备注" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.remark"  @change="changeForm" maxlength="50"></el-input>
                </el-form-item>
              </el-col>

              <!--<el-col :span="12">
                <el-form-item label="是否全部被引用:" label-width="120px" @change="changeForm" prop="remark">
                 <span v-if="headerData.finishStatus=='Y'" >是</span>
                 <span v-if="headerData.finishStatus=='N'"  >否</span>
                </el-form-item>
              </el-col>-->


            </el-row>


          </el-form>
        </SCContent>

        <!--详情 -->
        <SCTable :columnDefs="columnDefs"
                 :rowData="rowData"
                 :autoResize="true"
                 :enablePagination="false"
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
  import { updateRequistion ,delRequistion} from '@/api/requistion'
  import Datepicker from '@/components/Datepicker'
  import ProductSelect from '@/components/ProductSelect'
  export default {
    components: {ActionBar,SCContent, SCTable,SCModify,Datepicker,ProductSelect},

    data:function () {
      return {
        // gridInstance:null,
        currentPage:1,
        total:0,
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
        prs:'edit',
        coverIndex:''
  }
    },
    created:function () {
      this.$root.$off('onProSelectedit');
      this.$root.$on('onProSelectedit', (event)=>{
        this.selectPro(event);
      });
    },
    mounted:function () {

    },
    computed:{
      showDetail:function () {
        let val = this.$store.state.requistion.showDetail;
        this.preRowData = this.$store.state.requistion.detailData.list;
        if(null != this.preRowData){
          this.rowData =this.$clone(this.preRowData);
        }
        this.headerData = this.$store.state.requistion.detailData;
        this.total =this.$store.state.requistion.detailData.length;
        if(this.headerData.finishStatus == 'Y'){
          this.finishStatus = true;
        }else{
          this.finishStatus = false;
        }
        return val;
      }
    },
    methods:{
      onModifyTableCellValueChanged:function (event) {
     //   console.info(event.row);
        if(event.oldValue != event.newValue){
          this.hasModify = true
            for(var i=0;i<this.updateList.length;i++){
              if(this.updateList[i].id == event.row.id){
                this.updateList.splice(i, 1);
              }
            }
            this.updateList.push(event.row);
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
    //    console.log("=====> onRowDelete: ", nodes)
        this.delList.push(nodes.row);
      //  console.info(this.rowData.length)
        for(var i= 0;i<this.rowData.length;i++){
            if(null !=nodes.row.proKey && this.rowData[i].proKey == nodes.row.proKey){
              this.rowData.splice(i,1);
              break;
            }
          if(null !=nodes.row.id && this.rowData[i].id == nodes.row.id){
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
    //    console.info(this.$store.state.requistion.detailData);
        if(this.hasModify){
          this.$confirm("确定放弃修改?", "提示", {
            type:'info',
            callback:(action, instance)=>{
              if('confirm' == action){
                this.hasModify = false;
                this.$store.dispatch('HideRequistionDetail').then(()=>{});
                this.emptyList();
              }
            }
          });
        }else{
          this.$store.dispatch('HideRequistionDetail').then(()=>{});
        }



      },
      save:function () {
        this.$refs['headerData'].validateField('requisitionTime',(valid) => {
          if(''== valid){
            this.hasModify = false;
         //   this.headerData.list = this.rowData;
            for(let i=0;i<this.rowData.length;i++){
              if(null != this.rowData[i].proKey){
                let flag =false;
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
                if(null !=this.addList[i].id&&this.addList[i].id == this.delList[j].id ){
                   this.addList.splice(i,1);
                }
                if(null !=this.addList[i].proKey&&this.addList[i].proKey == this.delList[j].proKey ){
                  this.addList.splice(i,1);
                }
              }
            }
            for(let q =0 ;q <this.updateList.length; q++){
              for(let w=0; w < this.delList.length;w++){
                if(this.updateList[q].id == this.delList[w].id ){
                  this.updateList.splice(q,1);
                }
              }
            }


            for(let i =0 ;i <this.addList.length; i++){
              if(null ==this.addList[i].amount || ''==this.addList[i].amount){
                this.$alert('数量不能为空', '提示', {
                  confirmButtonText: '确定',
                });
                return;
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

            this.headerData.list = this.rowData;
            this.headerData.addList = this.addList;
            this.headerData.delList = this.delList;
            this.headerData.updateList =this.updateList;
           // console.info(this.addList);
            updateRequistion(JSON.stringify(this.headerData)).then((response) => {
              if(response.code == 0 ){
                this.$message({message: '修改成功', type: 'success'});
                this.$store.dispatch('HideRequistionDetail').then(()=>{});
                this.emptyList();
                this.$root.$emit('refreshData','');
              }
            })
          }else{

          }

        });

      },
      del:function () {
        this.$confirm("确定删除该请购单?", "提示", {
          type:'info',
          callback:(action, instance)=>{
            if('confirm' == action){
              delRequistion(JSON.stringify(this.headerData)).then((response) => {
                if(response.code == 0 ){
                  this.$message({message: '删除成功', type: 'success'});
                  this.$store.dispatch('HideRequistionDetail').then(()=>{});
                  this.emptyList();
                  this.$root.$emit('refreshData',null);
                }
              })

            }
          }
        });
      },
      changeForm:function () {
        this.hasModify = true
      },
      changeSele:function () {
        this.hasModify = true;
        this.headerData.buId = this.headerData.buName;
      },
      emptyList:function () {
        this.addList = [];
        this.delList = [];
        this.updateList=[];
        this.rowData=[];
        this.preRowData=[];
      },
      onDatepickerOk:function (event) {
       // console.log("onDatepickerOk:", event);
        if(event.cellEvent.column.colId == 'needTime'){
          var data = event.cellEvent.node.data;
          data.needTime = event.selectedDate;
          var itemsToUpdate = [];
          itemsToUpdate.push(data);
          if( data.id != null){
            this.updateList.push(data);
          }
          var res = event.cellEvent.api.updateRowData({update:itemsToUpdate});
          this.hasModify = true;
        //  console.log("res:", res);
        }

      },
      onCellDoubleClicked:function (event) {
        if(event.column.colId == 'needTime'){
          let tdEvent ={
            show:true,
            cellEvent:event
          };
          this.$store.dispatch('ShowTableDatepicker', tdEvent).then(()=>{});
        }
     //   console.info(event);
    //    console.info(this.rowData.length);
        if(event.column.colId == 'erpCode'){
          if(event.data.id != null){
            this.coverIndex = event.data.id;
          }

        //    console.info(this.coverIndex);


          let psEvent ={
            show:true,
            cellEvent:event,
            flag:this.prs
          };
          this.$store.dispatch('ShowProductSelect', psEvent).then(()=>{});
        }
        this.hasModify = true;
      },

      selectPro:function (event) {
     //   console.info("jin edit======");
        if( '' !=this.coverIndex && event.list.length > 0){
          for(let i=0;i<this.rowData.length;i++){
            if(this.rowData[i].id == this.coverIndex){
              this.rowData.splice(i,1);
              this.delList.push(this.rowData[i]);
            }
          }
        }
        for(let i =0 ;i <event.list.length;i++){
         this.rowData.push({"erpCode":event.list[i].erpCode,"productName":event.list[i].name,"specification":event.list[i].specification,"model":event.list[i].model,"proKey":event.list[i].erpCode,"supplierName":event.list[i].supplierName});
        }
        this.coverIndex ='';
        this.hasModify = true;
      }

    }
  }

</script>

<style scoped>

</style>
