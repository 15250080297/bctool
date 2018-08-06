<template>
    <div class="edit-container">

        <EntryPicker id="voucherEntryPicker"></EntryPicker>

        <SCModify id="voucherModify" :show="showEdit">
            <ActionBar slot="menu">
                <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
                <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">{{$t('button.save')}}</el-button>
                <el-button class="action-item del" type="info" @click="del">{{$t('button.del')}}</el-button>
                <!--<mBox :vNode="vNode"></mBox>-->
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
                            <el-form-item label="主体账簿">
                              苏州小灵猫信息科技有限公司集团
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
                         :rowData="rowData"
                         :showTool="true"
                         @onCellDoubleClicked="onCellDoubleClicked"
                         @onCellValueChanged="onModifyTableCellValueChanged"
                         @onRowSelected="onRowSelected"
                         @onRowDelete="onRowDelete"
                >
                </SCTable>

            </SCContent>


        </SCModify>
    </div>

</template>

<script>
    import ActionBar from '@/components/ActionBar'
    import SCContent from '@/components/SCContent'
    import SCTable from '@/components/SCTable'
    import SCSearch from '@/components/SCSearch'
    import SCDateRange from '@/components/SCDateRange'
    import SCModify from '@/components/SCModify'
    // import mBox from '@/components/Test/MessageBox'
    import tree from '@/views/tree'
    import EntryPicker from '@/views/voucher/components/EntryPicker'
    import {getVoucherList,getAuxiliaryList,getCashFlow,getVoucherDetail} from '@/api/voucher'

    export default {
        components: {ActionBar,SCContent, SCTable,SCModify,EntryPicker},

        props:{
          rowData:{}
        },

        data:function () {
            return {
               // gridInstance:null,
                currentPage:1,
                total:100,
                pageSize:50,
                columnDefs:[
                  {headerName: '分录号', field: 'id'},
                  {headerName: '摘要', field: 'aabstract'},
                  {headerName: '科目', field: 'accountCode'},
                  {headerName: '辅助核算', field: 'supporter'},
                  {headerName: '币种', field: 'currency', cellEditor: "agSelectCellEditor",cellEditorParams: {
                      values: ['CNY']
                    }},
                  //TODO 与借方-贷方相同
                  {headerName: '原币', field: 'sameAmount'},
                  {headerName: '借方', field: 'primaryDebitAmount'},
                  {headerName: '贷方', field: 'primaryCreditAmount'},
                  {headerName: '备注', field: 'remark'}
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
                events: {},
                master: '',
              detailData: {},
              gridOptions: {},
              vNode: tree,
              // rowData:[]
            }
        },
        created:function () {
          this.gridOptions = {
            columnDefs: this.columnDefs,
            enableColResize: true,
            defaultColDef: {
              editable: true
            },
          };
          this.$root.$off('onOkClick:voucherEntryPicker')
          this.$root.$on('onOkClick:voucherEntryPicker',(data,event) =>{

            this.rowData[event.rowIndex].accountCode=data.label
            this.rowData[event.rowIndex].entryId=data.id

          })
        },
        mounted:  function(){
          this.master = '苏州小灵猫信息科技有限公司集团'
        },
        computed:{
            showDetail:function () {
              // let val = this.$store.state.voucher.showDetail;
              this.rowData = this.$store.state.voucher.detailData;
              // return val;
            },
          showEdit:function () {
            let val = this.$store.state.voucher.showEdit;
            let voucherNo = this.$store.state.voucher.voucherNo
            if(val){
              this.GetVoucherDetail(voucherNo)
            }
            return val;
          },
          setAccount:function () {

          }
        },
        methods:{
            onModifyTableCellValueChanged:function (event) {
                if(event.oldValue != event.newValue){
                    this.hasModify = true
                }
            },
            onCellDoubleClicked:function(event){
              let tdEvent ={
                show:true,
                cellEvent:event
              };
              if(event.column.colId === 'accountCode'){
                this.$store.dispatch('TreeDialogShow', tdEvent).then(()=>{});
              }
            },
            cancelModify:function () {
                if(this.hasModify){
                    this.$confirm("确定放弃修改?", "提示", {
                        type:'info',
                        callback:(action, instance)=>{
                            if('confirm' == action){
                                this.hasModify = false;
                                this.$store.dispatch('HideEDITVoucherSwitch').then(()=>{});
                                this.emptyList()
                            }
                        }
                    });
                }else{
                    this.emptyList()
                    this.$store.dispatch('HideEDITVoucherSwitch').then(()=>{});
                }
            },
            onRowSelected:function (event) {
              let row = event.row;
              let node = event.node;
            },
            save:function () {
                this.hasModify = false;
            },
            del:function () {

            },
            onRowDelete:function () {

            },
            emptyList:function () {
              this.rowData = [];
            },
            GetVoucherDetail: function(voucherNo){
              console.log('GetVoucherDetail')
              let data={id: voucherNo}
              getVoucherDetail(data).then(
                resp =>{console.log(resp);
                this.rowData = resp.data.journalEntryDtoList}
                )
            }
        }
    }

</script>

<style scoped>

</style>
