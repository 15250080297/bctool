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
                    <el-form ref="form" :model="form" label-width="80px">

                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="请购单号">
                                    <el-input v-model="detailData.make"></el-input>
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

                <!--详情 -->
                <SCTable :columnDefs="columnDefs"
                         :currentPage="currentPage"
                         :total="total"
                         :pageSize="pageSize"
                         :rowData="detailData.details"
                         @onCellValueChanged="onModifyTableCellValueChanged"
                         @onRowSelected="onRowSelected"
                         @onRowDelete="onRowDelete"
                         @onCellDoubleClicked="onCellDoubleClicked"
                         :enablePagination="false"

                >
                </SCTable>

            </SCContent>

        </SCModify>
        <Datepicker @onOkClick="onDatepickerOk"></Datepicker>


    </div>

</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCTable from '@/components/SCTable'
    import SCSearch from '@/components/SCSearch'
    import SCDateRange from '@/components/SCDateRange'
    import SCModify from '@/components/SCModify'

    import Datepicker from '@/components/Datepicker'

    export default {
        components: {ActionBar,SCContent, SCTable,SCModify,Datepicker},

        data:function () {
            return {
               // gridInstance:null,
                currentPage:1,
                total:100,
                pageSize:50,
                columnDefs:[
                    {headerName: 'Type', field: 'type'},
                    {headerName: 'Year', field: 'year'},
                    {headerName: 'Seats', field: 'seats', type:'dateColumn'}
                ],
                hasModify:false,
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
                detailData:{}
            }
        },
        created:function () {
        },
        beforeMount:function () {
        },
        computed:{
            showDetail:function () {
                let val = this.$store.state.demo.showDetail;
                this.detailData = this.$store.state.demo.detailData;
                return val;
            }
        },
        methods:{

            onCellDoubleClicked:function (event) {
                if(event.column.colId == 'seats'){
                  // alert(222);

                    let tdEvent ={
                        show:true,
                        cellEvent:event
                    };

                    this.$store.dispatch('ShowTableDatepicker', tdEvent).then(()=>{});
                }
            },
            onDatepickerOk:function (event) {
                console.log("onDatepickerOk:", event);
                if(event.cellEvent.column.colId == 'seats'){
                    var data = event.cellEvent.node.data;
                    data.seats = event.selectedDate;
                    var itemsToUpdate = [];
                    itemsToUpdate.push(data);

                    var res = event.cellEvent.api.updateRowData({update:itemsToUpdate});
                    console.log("res:", res);
                }

            },
            onModifyTableCellValueChanged:function (event) {

                if(event.oldValue != event.newValue){
                    this.hasModify = true
                }

                //判断是否增加了新行
                if(this.detailData.details.length < (event.rowIndex + 1)){
                    console.log("has new row:", event.rowIndex);

                }


            },
            onRowDelete:function (nodes) {
                console.log("=====> onRowDelete: ", nodes)
            },
            onRowSelected:function (event) {
                let row = event.row;
                let node = event.node;


            },

            cancelModify:function () {

                if(this.hasModify){
                    this.$confirm("确定放弃修改?", "提示", {
                        type:'info',
                        callback:(action, instance)=>{
                            if('confirm' == action){
                                this.hasModify = false;
                                this.$store.dispatch('HideDetail').then(()=>{});
                            }
                        }
                    });
                }else{
                    this.$store.dispatch('HideDetail').then(()=>{});
                }


            },
            save:function () {
                this.hasModify = false;
            },
            del:function () {

            }
        }
    }

</script>

<style scoped>

</style>
