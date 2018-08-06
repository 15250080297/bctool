<template>
  <div class="edit-container">
    <SCModify id="storageTransferEditModify" :show="showEdit">
      <ActionBar slot="menu">
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item" type="primary" @click="del">{{$t('button.del')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">
          {{$t('button.save')}}
        </el-button>
      </ActionBar>

      <!-- detail -->
      <SCContent slot="content">
        <!-- form-->
        <SCContent>
          <el-form ref="headerData" :model="headerData" label-width="80px" :rules="rules">

            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="单据号">
                  <el-input v-model="headerData.code" @change="changeForm" readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="日期" prop="orderTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.orderTime" style="width: 100%;"
                                  @change="changeForm" value-format="yyyy-MM-dd" :editable=false></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出库部门" prop="outBuId">
                  <el-select v-model="headerData.outBuId" placeholder="" @change="changeForm">
                    <el-option label="粮油事业部" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出库仓库" prop="outWarehouseId">
                  <el-select v-model="headerData.outWarehouseId" placeholder="" @change="changeForm">
                    <el-option label="测试仓库" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入库部门" prop="inBuId">
                  <el-select v-model="headerData.inBuId" filterable placeholder="请选择" @change="changeForm">
                    <el-option label="粮油事业部" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入库仓库" prop="inWarehouseId">
                  <el-select v-model="headerData.inWarehouseId" placeholder="" @change="changeForm">
                    <el-option label="粮油事业部" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="期出日期" prop="expectOutWarehouseTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.expectOutWarehouseTime"
                                  style="width: 100%;" @change="changeForm" value-format="yyyy-MM-dd"
                                  :editable=false></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="出库日期" prop="realOutWarehouseTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.realOutWarehouseTime"
                                  style="width: 100%;" @change="changeForm" value-format="yyyy-MM-dd"
                                  :editable=false></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="期入日期" prop="expectInWarehouseTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.expectInWarehouseTime"
                                  style="width: 100%;" @change="changeForm" value-format="yyyy-MM-dd"
                                  :editable=false></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="入库日期" prop="realInWarehouseTime">
                  <el-date-picker type="date" placeholder="选择日期" v-model="headerData.realInWarehouseTime"
                                  style="width: 100%;" @change="changeForm" value-format="yyyy-MM-dd"
                                  :editable=false></el-date-picker>
                </el-form-item>
              </el-col>


              <el-col :span="6">
                <el-form-item label="中转仓" prop="onPassage">
                  <el-select v-model="headerData.onPassage" placeholder="" @change="changeForm">
                    <el-option label="启用" :value="'Y'"></el-option>
                    <el-option label="禁用" :value="'N'"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="备注" @change="changeForm" prop="remark">
                  <el-input v-model="headerData.remark" @change="changeForm" maxlength="50"></el-input>
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
                 @tableInstance="tableInstance">
          >
        </SCTable>

      </SCContent>

    </SCModify>
    <ProductSelect></ProductSelect>
    <WareHouse></WareHouse>
  </div>

</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import SCModify from '@/components/SCModify'
  import { getUpdateStorageTransfer } from '@/api/storage-transfer.js'
  import Datepicker from '@/components/Datepicker'
  import ProductSelect from '@/components/ProductSelect'
  import WareHouse from '@/components/WareHouse'
  import { findAllSupplier } from '@/api/supplier'

  export default {
    name: 'storageTransferEdit',
    components: {ActionBar, SCContent, SCTable, SCModify, Datepicker, ProductSelect, WareHouse},
    computed: {
      showEdit(){
        this.setStorageTransferEditData(this.$store.state.storageTransfer.detailData)
        return this.$store.state.storageTransfer.showEdit
      },
      switchTheData: {
        get: function () {
          return this.headerData.isReturn === 'Y' ? true : false
        },
        set: function (flag) {
          this.headerData.isReturn = flag === true ? 'Y' : 'N'
        }
      }
    },
    data: function () {
      return {
        columnDefs: [
          {headerName: '存货编码', field: 'productCode'},
          {headerName: '名称', field: 'productName', editable: false},
          {headerName: '规格', field: 'specification', editable: false},
          {headerName: '型号', field: 'model', editable: false},
          {headerName: '计量单位', field: 'productUnit', editable: false},
          {headerName: '批次号', field: 'batch'},
          {headerName: '生成日期', field: 'genetationTime', editable: false},
          {headerName: '失效日期', field: 'expirationTime', editable: false},
          {headerName: '应发数量', field: 'expectAmount'},
          {headerName: '应收数量', field: 'realAmount'},
          {headerName: '最后修改人', field: 'updater', editable: false},
          {headerName: '最后修改时间', field: 'updateTime', editable: false}
        ],
        hasModify: false,
        rules: {
          orderTime: [
            {required: true, message: '日期不能为空', trigger: 'change'}
          ],
          outBuId: [
            {required: true, message: '出库部门不能为空', trigger: 'change'}
          ],
          outWarehouseId: [
            {required: true, message: '出库仓库不能为空', trigger: 'change'}
          ],
          inBuId: [
            {required: true, message: '入库部门不能为空', trigger: 'change'}
          ],
          inWarehouseId: [
            {required: true, message: '入库仓库不能为空', trigger: 'change'}
          ],
          expectOutWarehouseTime: [
            {required: true, message: '期望出库时间不能为空', trigger: 'change'}
          ],
          expectInWarehouseTime: [
            {required: true, message: '期望入库时间不能为空', trigger: 'change'}
          ],
          onPassage: [
            {required: true, message: '是否启用中转仓不能为空', trigger: 'change'}
          ]
        },
        rowData: [],
        headerData: {},
        finishStatus: false,
        addList: [],
        newLine: 0,
        delList: [],
        updateList: [],
        preRowData: [],
        prs: 'edit',
        tabInstance: {},
        supplierList: []
      }
    },
    created: function () {
      this.$root.$off('onProSelectadd')
      this.$root.$on('onProSelectadd', (event) => {
        this.selectPro(event)
      })
    },
    methods: {
      onModifyTableCellValueChanged: function (event) {
        if (event.oldValue != event.newValue) {
          this.hasModify = true
        }
        //判断是否增加了新行
        if (this.rowData.length < (event.rowIndex + 1)) {
          if (this.newLine != event.rowIndex) {
            this.newLine = event.rowIndex
            this.addList.push(event.row)
          }
        }
      },
      onRowDelete: function (nodes) {
        console.log('=====> onRowDelete: ', nodes)
        this.delList.push(nodes.row)
        for (var i = 0; i < this.rowData.length; i++) {
          if (null != nodes.row.proKey && this.rowData[i].proKey == nodes.row.proKey) {
            this.rowData.splice(i, 1)
            break
          }
        }
        this.hasModify = true
      },
      onRowSelected: function (event) {
        let row = event.row
        let node = event.node
      },
      cancelModify: function () {
        if (this.hasModify) {
          this.$confirm('确定放弃添加?', '提示', {
            type: 'info',
            callback: (action, instance) => {
              if ('confirm' == action) {
                this.hasModify = false
                this.$store.dispatch('HideEditStorageTransFerDetail').then(() => {})
                this.emptyList()
                this.headerData = {}
              }
            }
          })
        } else {
          this.headerData = {}
          this.emptyList()
          this.$store.dispatch('HideEditStorageTransFerDetail').then(() => {})
        }
      },
      setStorageTransferEditData(data){
        if (data.id) {
          getUpdateStorageTransfer(JSON.stringify({'id': data.id})).then((response) => {
            if (response.code == 0) {
              this.headerData = response.data
              this.rowData = response.data.updateStoreTransferOrderDetailDtoList
            }
          })
        }
      },
      save: function () {
        this.addList = []
        this.headerData.createStoreTransferOrderDetailDtoList = []
        let check = true
        this.$refs['headerData'].validateField('orderTime', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })
        this.$refs['headerData'].validateField('outBuId', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })
        this.$refs['headerData'].validateField('outWarehouseId', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })

        this.$refs['headerData'].validateField('inBuId', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })

        this.$refs['headerData'].validateField('inWarehouseId', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })

        this.$refs['headerData'].validateField('expectOutWarehouseTime', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })

        this.$refs['headerData'].validateField('expectInWarehouseTime', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })

        this.$refs['headerData'].validateField('onPassage', (valid) => {
          if ('' != valid) {
            check = false
            return
          }
        })
        if (!check) {
          return
        }
        for (let i = 0; i < this.rowData.length; i++) {
          this.addList.push(this.rowData[i])
        }
        for (let i = 0; i < this.addList.length; i++) {
          for (let j = 0; j < this.delList.length; j++) {
            if (this.addList[i].productCode == this.delList[j].productCode) {
              this.addList.splice(i, 1)
            }
          }
        }
        if (this.addList.length == 0) {
          this.$alert('存货编码、批次、应发数量、应收数量', '提示', {
            confirmButtonText: '确定',
          })
          return
        }

        for (let i = 0; i < this.addList.length; i++) {
          if (null == this.addList[i].productCode || '' == this.addList[i].productCode) {
            this.$alert('商品编码不能为空', '提示', {
              confirmButtonText: '确定',
            })
            return
          }

          if (null == this.addList[i].batch || '' == this.addList[i].batch) {
            this.$alert('批次号不能为空', '提示', {
              confirmButtonText: '确定',
            })
            return
          }

          if (null == this.addList[i].expectAmount || '' == this.addList[i].expectAmount) {
            this.$alert('应发数量不能为空', '提示', {
              confirmButtonText: '确定',
            })
            return
          }

          if (null == this.addList[i].realAmount || '' == this.addList[i].realAmount) {
            this.$alert('应收数量不能为空', '提示', {
              confirmButtonText: '确定',
            })
            return
          }
        }
        this.headerData.createStoreTransferOrderDetailDtoList = this.addList
//        addStorageTransfer(JSON.stringify(this.headerData)).then((response) => {
//          if (response.code == 0) {
//            this.$message({message: '添加成功', type: 'success'})
//            this.$store.dispatch('HideAddSalesDetail').then(() => {
//            })
//            this.emptyList()
//            this.$root.$emit('refreshData', '')
//          }
//        })

      },
      changeForm: function () {
        this.hasModify = true
      },
      changeSele: function () {
        this.hasModify = true
      },
      emptyList: function () {
        this.addList = []
        this.delList = []
        this.rowData = []
        this.headerData = {}
      },
      onCellDoubleClicked: function (event) {
        if (event.column.colId == 'productCode') {
          let psEvent = {
            show: true,
            cellEvent: event,
            flag: this.prs
          }
          this.$store.dispatch('ShowProductSelect', psEvent).then(() => {})
        }
      },
      selectPro: function (event) {
        for (var i = 0; i < event.list.length; i++) {
          this.rowData.push({
            'productCode': event.list[i].erpCode,
            'productName': event.list[i].name,
            'specification': event.list[i].specification,
            'model': event.list[i].model,
            'productUnit': event.list[i].specification,
          })
        }
        this.hasModify = true
      },
      tableInstance: function (instance) {
        this.tabInstance = instance
      },
      getsupplier: function () {
        findAllSupplier().then((response) => {
          this.supplierList = response.data
        })
      },
      del(){
        this.$confirm('确定删除转库订单?', '提示', {
          type: 'info',
          callback: (action) => {
            if ('confirm' == action) {
              let data = {
                delIds: [this.storeId]
              }
              deleteStore(JSON.stringify(data)).then((resp) => {
                console.log('deleteStore, resp=', resp)
                if (resp.code === 0) {
                  this.$root.$emit('search:purchaseInSearch')
                }
              })
              this.hasModify = false
              this.emptyList()
              this.hide()
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
