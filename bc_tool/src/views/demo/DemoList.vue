<template>
    <div class="tab-container">

        <!-- 操作菜单项 -->
        <ActionBar>

            <el-button class="action-item" type="primary" @click="goCreateView">{{$t('button.add')}}</el-button>
            <el-button class="action-item" type="primary" @click="showSearchForm">{{$t('button.search')}}</el-button>
            <el-button class="action-item" type="primary">{{$t('button.approval')}}</el-button>

            <el-dropdown>
                <el-button class="action-item">
                    {{$t('button.exec.title')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>{{$t('button.exec.sub.submit')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('button.exec.sub.abandon')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('button.exec.sub.close')}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

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
        <SCSearch id="purchaseSearchForm" title="采购订单查询">
            <el-form :model="form">
                <el-form-item label="订单日期" :label-width="formLabelWidth">
                    <SCDateRange></SCDateRange>
                </el-form-item>
                <el-form-item label="订单号" :label-width="formLabelWidth">
                    <el-input v-model="form.orderId"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="状态">
                        <el-option label="待审批" value="shanghai"></el-option>
                        <el-option label="审批通过" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
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
                     :showTool="true"
                     :enablePagination="true"
                     @onRowSelected="onRowSelected"
                     @onRowDoubleClicked="onRowDoubleClicked"
                     @onPageChanged="onPageChanged">

            </SCTable>

            <!--详情 -->
            <SCTable :columnDefs="detailColumnDefs"
                     :editable="false"
                     :currentPage="currentPage"
                     :total="total"
                     :pageSize="pageSize"
                     :showTool="false"
                     :rowData="detailRowData">
            </SCTable>
        </SCContent>


        <DemoEdit></DemoEdit>

    </div>
</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCTable from '@/components/SCTable'
    import SCSearch from '@/components/SCSearch'
    import SCDateRange from '@/components/SCDateRange'
    import SCModify from '@/components/SCModify'
    import DemoEdit from './DemoEdit.vue'

    export default {
        components: {ActionBar,SCContent, SCTable, SCSearch, SCDateRange, DemoEdit},
        data() {
            return {
                gridOptions:{
                    defaultColDef:{
                        editable: false
                    }
                },
                currentPage:1,
                total:100,
                pageSize:50,
                form: {
                    orderId:'',
                    name: '',
                    status: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '120px',
                columnDefs: [
                    {headerName: 'Make', field: 'make'},
                    {headerName: 'Model', field: 'model'},
                    {headerName: 'Price', field: 'price'}
                ],
                detailColumnDefs:[
                    {headerName: 'Type', field: 'type', editable: false},
                    {headerName: 'Year', field: 'year'},
                    {headerName: 'Seats', field: 'seats'}
                ],
                rowData:[],
                detailRowData:[]

            }
        },
        created() {

        },
        beforeMount() {
            //创建示例数据
            for(let i =0 ;i<15;i++){
                let o ={make: 'Toyota'+i, model: 'Celica', price: 35000};
                let d = [];

                for(let j =0 ;j<5;j++){
                    d.push({type:'Camary'+i+'-'+j, year:2018, seats:3*(j+1)});
                }

                o.details=d;

                this.rowData.push(o );
            }
        },

        methods: {
            onRowSelected:function (event) {
                let row = event.row;
                let node = event.node;
                this.detailRowData = row.details;
            },
            onPageChanged:function (page) {
                console.log("onPageChanged", page);
                //TODO 请求数据
            },
            onRowDoubleClicked:function (event) {
//                this.$root.$emit('showModify:purchaseModify');
                //console.log("ShowDetail proims...", row);
                this.$store.dispatch('ShowDetail', event.data).then(()=>{

                });
            },
            onModifyTableCellValueChanged:function (event) {
                this.hasModify = true
            },
            showSearchForm:function () {
                this.$root.$emit('showSearch:purchaseSearchForm');
            },
            cancelModify:function () {
                this.$root.$emit('hideModify:purchaseModify');
            },
            goCreateView:function () {
                this.$router.push({name:'demoCreate'});
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
