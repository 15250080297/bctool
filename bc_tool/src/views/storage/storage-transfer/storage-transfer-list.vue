<template>
  <div class="edit-container">
    <TransferPicker></TransferPicker>
    <ActionBar slot="menu">
      <el-button class="action-item" type="primary" @click="addTransfer()">{{$t('button.add')}}</el-button>

      <el-button class="action-item" type="primary">{{signBtnName}}</el-button>

      <el-button class="action-item" type="primary" @click="showSearchForm()">{{$t('button.search')}}</el-button>

      <el-button class="action-item" type="primary">{{$t('button.stamp')}}</el-button>


      <el-dropdown>
        <el-button class="action-item">
          {{$t('button.accessory.title')}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{$t('button.accessory.sub.unionQuery')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </ActionBar>
    <!-- 查询 -->
    <SCSearch id="storageTransferSearch" ref="storageTransferSearch" title="转库单查询">
      <el-form :model="searchForm">
        <el-row>
          <el-col>
            <el-form-item label="日期" :label-width="formLabelWidth">
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="事业部门" :label-width="formLabelWidth">
              <el-input v-model="searchForm.buId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="转库单号" :label-width="formLabelWidth">
              <el-input v-model="searchForm.orderCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="出库仓库" :label-width="formLabelWidth">
              <el-input v-model="searchForm.outWarehouseId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="出库部门" :label-width="formLabelWidth">
              <el-input v-model="searchForm.outBuId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="出库仓库" :label-width="formLabelWidth">
              <el-input v-model="searchForm.inWarehouseId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="入库部门" :label-width="formLabelWidth">
              <el-input v-model="searchForm.inBuId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </SCSearch>


    <SCContent>
      <!--列表 -->
      <SCTable :columnDefs="columnDefs"
               :rowData="rowData"
               :editable="false"
               :currentPage="currentPage"
               :total="total"
               :pageSize="pageSize"
               :showTool="false"
               @onRowSelected="onRowSelected"
               @onRowDoubleClicked="onRowDoubleClicked"
               @onPageChanged="onPageChanged">

      </SCTable>

      <!--详情 -->
      <SCTable :columnDefs="detailColumnDefs"
               :editable="false"
               :enablePagination="false"
               :showTool="false"
               :autoResize="true"
               :rowData="detailRowData">
      </SCTable>
    </SCContent>


    <StorageTransferAdd></StorageTransferAdd>
    <StorageTransferEdit></StorageTransferEdit>

  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCSearch from '@/components/SCSearch'
  import SCTable from '@/components/SCTable'
  import StorageTransferAdd from './storage-transfer-add.vue'
  import StorageTransferEdit from './storage-transfer-edit.vue'
  import { getStorageTransferList, getStorageTransferDetail } from '@/api/storage-transfer.js'
  import TransferPicker from './components/transfer-picker.vue'
  export default {
    name: 'storageTransferList',
    components: {ActionBar, SCContent, SCTable, SCSearch, TransferPicker, StorageTransferAdd,StorageTransferEdit},
    data(){
      return {
        formLabelWidth: '120px',
        signBtnName: this.$t('button.unsign'),
        addForm: {
          beginTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 20
        },
        addDateValue: '',
        columnDefs: [
          {headerName: '单据号', field: 'code'},
          {headerName: '单据日期', field: 'orderTime'},
          {headerName: '出库部门', field: 'outBuName'},
          {headerName: '出库仓库', field: 'outWareHouse'},
          {headerName: '入库部门', field: 'inBuName'},
          {headerName: '入库仓库', field: 'inWareHouse'},
          {headerName: '期望出库日期', field: 'expectOutWarehouseTime'},
          {headerName: '出库日期', field: 'realOutWarehouseTime'},
          {headerName: '期望入库日期', field: 'expectInWarehouseTime'},
          {headerName: '入库日期', field: 'realInWarehouseTime'},
          {headerName: '中转仓库', field: 'onPassage'},
          {headerName: '备注', field: 'remark'},
          {headerName: '制单人', field: 'creator'},
          {headerName: '制单时间', field: 'createTime'},
          {headerName: '签字人', field: 'signUserId'},
          {headerName: '签字时间', field: 'signTime'},
          {headerName: '最后修改人', field: 'updater'},
          {headerName: '最后修改时间', field: 'updateTime'}
        ],
        detailColumnDefs: [
          {headerName: '存货编码', field: 'productCode'},
          {headerName: '名称', field: 'productName'},
          {headerName: '规格', field: 'specification'},
          {headerName: '型号', field: 'model'},
          {headerName: '计量单位', field: 'productUnit'},
          {headerName: '批次号', field: 'batch'},
          {headerName: '生成日期', field: 'genetationTime'},
          {headerName: '失效日期', field: 'expirationTime'},
          {headerName: '应发数量', field: 'expectAmount'},
          {headerName: '应收数量', field: 'realAmount'},
          {headerName: '最后修改人', field: 'updater'},
          {headerName: '最后修改时间', field: 'updateTime'}
        ],
        rowData: '',
        dateValue: [1, 2],
        currentPage: 1,
        pageSize: 20,
        total: 50,
        searchForm: {
          beginOrderTime: '',
          endOrderTime: '',
          orderCode: '',
          buId: '',
          inWarehouseId: '',
          inBuId: '',
          outWarehouseId: '',
          //TODO
          outBuId: '',
          pageNum: 1,
          pageSize: 20,
        },
        detailRowData: ''
      }
    },
    mounted(){
      this.getNowTime()
      this.dateValue[0] = this.nowDate
      this.dateValue[1] = this.nowDate
      this.searchForm.beginOrderTime = this.dateValue[0]
      this.searchForm.endOrderTime = this.dateValue[1]
      this.getStorageTransfer(1)

    },
    created: function () {
      this.$root.$on('search:storageTransferSearch', () => {
        this.searchForm.beginOrderTime = this.dateValue[0]
        this.searchForm.endOrderTime = this.dateValue[1]
        this.getStorageTransfer(1)
      })
    },
    methods: {
      showSearchForm: function () {
        this.$root.$emit('showSearch:storageTransferSearch')
      },
      getNowTime: function () {
        this.nowDate = new Date().getTime()
      },
      getStorageTransfer(pageNum){
        this.searchForm.pageNum = pageNum
        return getStorageTransferList(JSON.stringify(this.searchForm)).then((resp) => {
          this.currentPage = resp.pagination.pageNum
          this.pageSize = resp.pagination.pageSize
          this.total = resp.pagination.total
          this.rowData = resp.data
        })
      },
      onRowSelected: function (event) {
        let row = event.row
        getStorageTransferDetail(JSON.stringify({'id': row.id})).then((response) => {
          if (response.code == 0) {
            this.detailRowData = response.data
          }
        })
      },
      onRowDoubleClicked: function (event) {
        this.$store.dispatch('ShowEditStorageTransFerDetail',event.data).then(()=>{
          console.log('ShowEditStorageTransFerDetail')
        })
      },
      onPageChanged: function (page) {
        this.getStorageTransfer(page)
      },
      addTransfer: function () {
        this.$store.dispatch('ShowAddStorageTransferDetail').then(() => {
        });
      }
    }
  }
</script>
<style scoped>

</style>
