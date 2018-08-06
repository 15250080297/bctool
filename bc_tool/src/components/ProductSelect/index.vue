<template>

  <el-dialog title="商品选择"
             :visible.sync="dataEvent.show"
             width="780px"
             :productType="productType"
             :searchData="searchData"
             center
             >
    <div  class="search-wrapper">
      <el-input placeholder="请输入编码或名称" v-model="searchData" class="input-with-select" type="small">
        <el-button slot="append" icon="el-icon-search" @click="searchPro"></el-button>
      </el-input>
    </div>
    <div class="cell-tree">
      <el-tree :data="data" :props="defaultProps" class="tree-class"  @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="cell-transfer">

      <SCContent>
        <!--列表 -->
        <SCTable
                 :columnDefs="columnDefs"
                 :rowData="rowData"
                 :editable="false"
                 :enablePagination="false"
                 :showTool="false"
                 :height="250"
                 @onRowSelected="onRowSelected"
                 @onRowDoubleClicked="onRowDoubleClicked"
                 @onPageChanged="onPageChanged">

        </SCTable>
       <!-- <div class="arrow-wrapper">
          <el-button  icon="el-icon-arrow-up" size = "medium " class="button-class" @click="addPro"></el-button>
          <el-button  icon="el-icon-arrow-down" size = "medium " class="button-class"></el-button>
        </div>-->
        <div class="title-wrapper">
          <span>
            <button type="button" class="el-button el-button--primary circle" @click="delPro">
              <span><i class="el-icon-arrow-up"></i></span>
            </button>
          </span>
          <span>
            <button type="button" class="el-button el-button--primary circle" @click="addPro">
              <span><i class="el-icon-arrow-down"></i></span>
            </button>
          </span>
        </div>
        <!--详情 -->
        <SCTable :columnDefs="detailColumnDefs"
                 :editable="false"
                 :enablePagination="false"
                 :showTool="false"
                 :autoResize="false"
                 :rowData="detailRowData"
                 :height="250"
                 @onRowSelected="onSelected"
                 @onRowDoubleClicked="onDoubleClicked"
                 @onPageChanged="onChanged">
        </SCTable>
      </SCContent>

    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取 消</el-button>
        <el-button type="primary" @click="onProSelect">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
  var moment = require('moment');
  import { findCategoryList,getProduct ,searchPro} from '@/api/product'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import { findSupplier } from '@/api/supplier'
  import {getProductOfWarehouse} from '@/api/conversion'
  export default {

    components: {SCContent, SCTable},
    props:{
      productType:'',
      searchData:''
    },
    computed:{
      dataEvent:function () {
        this.findCategoryList();
        this.rowData=[];
        this.detailRowData=[];
        this.categoryId ='';
        this.total =0;
        return this.$store.state.app.productSelectEvent;
      }
    },
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'list',
          label: 'name'
        },

        value3: [1],
        value4: [1],

        transData:[],
        transProps:{
          key: 'id',
          label: 'name'
        },

        gridOptions:{
          defaultColDef:{
            editable: false
          }
        },
        currentPage:1,
        total:0,
        pageSize:50,
        form: {
          code:'',
          status: '',
          date1: '',
          date2: ''

        },
        formLabelWidth: '120px',
        columnDefs: [
          {headerName: '存货编码', field: 'erpCode'},
          {headerName: '存货名称', field: 'name'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'}
        ],
        detailColumnDefs:[
          {headerName: '存货编码', field: 'erpCode', editable: false},
          {headerName: '存货名称', field: 'name'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'}
        ],
        rowData:[],
        detailRowData:[],
        dateValue:'',
        searchCol:{},
        categoryId:'',
        searchData:'',
        addData:{},
        delData:{}



      }
    },
    mounted:function () {

    },

    methods:{
      onProSelect:function () {
     //   console.info(this.dataEvent.flag);
        for(let i =0 ;i <this.detailRowData.length;i++){
          let sname ='';
          findSupplier(JSON.stringify({"id":this.detailRowData[i].supplierId})).then((response)=>{
            if(response.code == 0){
          //    alert(response.data.name);
              sname=response.data.name;
              this.detailRowData[i].supplierName = response.data.name;
            }
          });

        }
        this.$root.$emit('onProSelect'+this.dataEvent.flag, {list:this.detailRowData, cellEvent:this.dataEvent.cellEvent});
        this.hide();


      },
      onCancelClick:function () {
        this.hide();
      },
      hide:function () {
        this.$store.dispatch('HideProductEvent').then(()=>{});
      },
      findCategoryList:function () {
        findCategoryList().then((response)=>{
          if(0 == response.code){
            this.data =[];
            for(var i =0; i< response.data.length;i++){
              this.data.push({"id":response.data[i].id,"name":response.data[i].name,"list":response.data[i].list});
            }

          }
        });
      },
      handleNodeClick:function(data) {
        if(null == data.list ||data.list == 0){
          if(this.categoryId !=data.id){
            this.rowData =[];
            this.currentPage =1;
            this.total =0;
          }
          this.categoryId = data.id;

          let productsRes ;
          console.log('productType ',this.productType)
          if(this.productType === 'XTC'){
            let reqData={};
            if(this.searchData){
              Object.assign(this.searchData,reqData)
            }
            reqData.categoryId = data.id
            productsRes = getProductOfWarehouse(JSON.stringify(reqData))
          }else{
            productsRes = getProduct(JSON.stringify({"id":data.id}))
          }
          productsRes.then((response)=>{
            if(response.code == 0){
              if(null != response.data && response.data.length != 0){
                this.rowData = response.data;
              }else{
                this.rowData =[];

              }

            }
          });
        }
      },


      onRowSelected:function (event) {
       this.addData = event.row;
      },
      onPageChanged:function (page) {
        var data ={};
        data.id = this.categoryId;
        this.currentPage =page;
       this. handleNodeClick(data);
      },

      onSelected:function (event) {
        this.delData = event.row;
      },
      onChanged:function (page) {
        var data ={};
        data.id = this.categoryId;
        this.currentPage =page;
        this. handleNodeClick(data);
      },

      onRowDoubleClicked:function (event) {
        this.detailRowData.push(event.data);
        this.addData ={};
      },

      onDoubleClicked:function (event) {
        this.delData ={};
        for(var i=0; i< this.detailRowData.length; i++) {
          if( this.detailRowData[i] == event.data) {
            this.detailRowData.splice(i, 1);
            break;
          }
        }
      },
      searchPro:function () {
        if( ''==this.searchData){
          this.$alert('请输入搜索内容', '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        searchPro(JSON.stringify({"content":this.searchData})).then((response)=>{
            if(response.code == 0){
              this.rowData = response.data;
            }
        });

      },
      addPro:function () {
      //  console.info(this.addData)
        if( this.addData.id != null){
          this.detailRowData.push(this.addData);
          this.addData ={};
        }

      },

      delPro:function () {
        if( this.delData.id != null) {
          for(var i=0; i< this.detailRowData.length; i++) {
            if( this.detailRowData[i].id == this.delData.id) {
              this.detailRowData.splice(i, 1);
              break;
            }
          }
          this.delData = {};
        }

      }

    }
  }
</script>

<style scoped>
  .cell-tree{
    text-align: center;
    width: 160px;
    height: 566px;
    display: inline-block;
    vertical-align: top;
    margin-top: 8px;
    border: 1px solid #BDC3C7;
    overflow: auto;
  }


  .cell-transfer{
    display: inline-block;
    width: 595px;
    text-align: center;
  }

  .arrow-wrapper{
    margin-bottom: 15px;
  }

  .button-class{
    background-color: #c2c2c2;
    border: none;
  }

  .title-wrapper{
    text-align: center;
    padding-top: 5px;
    padding-bottom: 12px;
  }

  .search-wrapper{
    width: 99%;
    text-align: center;

  }
  .circle{
    margin: 0 auto;
    padding: 10px;
    border-radius: 50%;
    color:#c0c4cc;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    transition: all 0.3s;
  }
  .circle:hover {
    background-color: #e0e2e5;
  }




</style>
