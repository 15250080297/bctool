<template>
  <div class="tab-container">

    <!-- 操作菜单项 -->
    <TopActionBar>

      <el-button class="action-item" @click="handleCreate" type="primary">{{$t('table.add')}}</el-button>
      <el-button class="action-item" type="primary"  @click="handleSave">{{$t('table.save')}}</el-button>

      <el-dropdown @click="handleClick" @select="handleSelect" @command="handleCommand">
        <el-button class="action-item">
          {{queryParam.sortName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in sortOptions" :key="item.key" :command="item.label">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>


      <el-button class="action-item" type="primary" @click="handleSave">{{$t('table.mainten')}}</el-button>
      <el-button class="action-item" type="primary" @click="handleSave">{{$t('table.rowop')}}</el-button>
      <el-button class="action-item" type="primary" @click="handleSave">{{$t('table.audit')}}</el-button>
      <el-button class="action-item" type="primary" @click="handleSave">{{$t('table.exec')}}</el-button>
      <el-button class="action-item" type="primary" @click="handleSave">{{$t('table.chainq')}}</el-button>
      <el-button class="action-item" type="primary" @click="handleSave">{{$t('table.auditFlow')}}</el-button>

    </TopActionBar>

    <!-- 表单 -->
    <SCContent>
      <el-form ref="form" :model="form" label-width="80px">

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="请购单号">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="请购时间">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="请购类型">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否直运">
              <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="特殊资源">
              <el-radio-group v-model="form.resource">
                <el-radio label="线上品牌商赞助"></el-radio>
                <el-radio label="线下场地免费"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="备注">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
    </SCContent>

    <SCTable>
      <HotTable :settings="hotSettings"></HotTable>
    </SCTable>

  </div>
</template>

<script>
  import TopActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'

  import HotTable from '@handsontable/vue'

  export default {
    name: 'tab',
    components: {TopActionBar, SCContent ,SCTable, HotTable},
    listQuery: {
      page: 1,
      limit: 20,
      importance: undefined,
      title: undefined,
      type: undefined,
      sort: '+id'
    },
    created() {
      // this.getList()
    },
    data() {
      return {
        form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
        },
        tabMapOptions: [
          { label: '存货信息', key: 'list' },
          { label: '执行结果', key: 'result' }
        ],
        queryParam: {
          sortName: '按照金额排序'
        },
        createdTimes: 0,
        importanceOptions: [1, 2, 3],
        calendarTypeOptions: [1991, 1992, 1993],
        sortOptions: [
          { label: '按照时间排序', key: '0' },
          { label: '按照金额排序', key: '1' },
          { label: '按照数量排序', key: '2' }
        ],
        dropvalue: '',
        hotSettings:{
            data:[
                ['sample', 'data', '1','2'],
                ['aaa', 'zzz','3','4']],
            rowHeaders: true,
            colHeaders: true,
            manualColumnResize: true,
            manualRowResize: true,
            manualColumnMove: true,
            stretchH: 'all',
            colHeaders: ['商品名称', '商品条码', '天猫商品ID', 'SKU编码']
        }
      }
    },
    methods: {
      showCreatedTimes() {
        this.createdTimes = this.createdTimes + 1
      },
      handleFilter() {
        if (this.activeName === 'list') {
          this.$refs.result.query()
        } else if (this.activeName === 'result') {
          this.$refs.tabPane.query()
        }
      },
      handleCreate() {
        console.log('call child to do create')
      },
      handleSave() {
        console.log('call child to do save')
      },
      handleSelect(a, b) {
        console.log(a)
        console.log(b)
      },
      handleCommand(a, b) {
        this.queryParam.sortName = a
      },
      handleClick(a, b) {
        console.log(a)
        console.log(b)
      }
    }

  }
</script>
<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style scoped>
  .filter-container > div{
    float:left;
    width: 150px;
  }

  .filter-container{
    margin: 0;
    padding: 15px 16px;
    cursor: pointer;
  }
</style>
