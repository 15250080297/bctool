<template>
  <div class="tab-container">




    <SCContent>
      <!--列表 -->
      <SCTable :columnDefs="columnDefs"
               :rowData="rowData"
               :enablePagination="false"
               :editable="false"
               :showTool="false"
               :singleTable="true"
      >
      </SCTable>

    </SCContent>

  </div>
</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCSearch from '@/components/SCSearch'
  import SCDateRange from '@/components/SCDateRange'
  import {listAll} from '@/api/balance/business'

  export default {
    components: {ActionBar,SCContent, SCTable, SCSearch, SCDateRange},
    data() {
      return {
        columnDefs: [
          {headerName: '企业名称', field: 'merchantName'},
          {headerName: '邮箱', field: 'email'},
          {headerName: '可用金额', field: 'usableAmount',cellRenderer:function (params) {
              var result='<a title="'+params.data.amount/100.00+'-'+params.data.freezeAmount/100.00+'"> ¥ '+params.data.usableAmount/100.00+' </a>'
              return result;
            }},
          {headerName: '可提分润', field: 'bcUsableAmount',
            cellRenderer:function (params) {

              var result='<a title="'+params.data.bcAmount/100.00+'-'+params.data.bcFreezeAmount/100.00+'"> ¥ '+params.data.bcUsableAmount/100.00+' </a>'
              return result;
           }
          },

        ],
        rowData:[],
      }
    },
    mounted(){
      this.listAll();
    },

    methods: {

      listAll: function () {
        listAll().then(resp => {
          if (resp.code == 0) {
            this.rowData =resp.data.rows;
          }

        });
      },
    }

  }
</script>

<style scoped>

</style>
