<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <!-- <el-form-item label="Activity name">
         <el-input v-model="form.name"></el-input>
       </el-form-item>-->

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="KeySpace">
            <el-select v-model="form.keyspace" placeholder="请选择KeySpace" @change="changeForm">
              <el-option label="bill__" value="bill__"></el-option>
              <el-option label="system" value="system"></el-option>
              <el-option label="global_analysis__" value="global_analysis__"></el-option>
              <el-option label="system_traces" value="system_traces"></el-option>
              <el-option label="capital_keyspace__" value="capital_keyspace__"></el-option>
              <el-option label="global_info__" value="global_info__"></el-option>
              <el-option label="data_keyspace__" value="data_keyspace__"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Table">
            <el-input v-model="form.table" placeholder="请输入table" :disabled="tableDisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="ObjectId">
            <el-input v-model="form.objectid"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <SCContent>
        <!--详情 -->
        <SCTable :columnDefs="detailColumnDefs"
                 :editable="false"
                 :enablePagination="false"
                 :showTool="false"
                 :rowData="detailRowData">
        </SCTable>
      </SCContent>
<!--      <el-row :gutter="20" v-if="rowInfo">
        <el-col :span="20">
          <el-form-item label="Activity form">
            <el-input type="textarea" v-model="rowInfo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->


      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

  import {renew} from '@/api/tool/lucene'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'



  export default {
    components: {SCContent,SCTable},

    data() {
      return {
        form: {
          keyspace: '',
          table: '',
          objectid: '',
        },
        tableDisable: false,
        isSubmit: false,
        detailColumnDefs:[
          {headerName: '表字段', field: 'key', editable: false},
          {headerName: '值', field: 'value'},
        ],
        detailRowData:[]
      }
    },
    methods: {
      onSubmit() {
        if (this.isSubmit)
          return;

        this.detailRowData=[];
        if (!this.$checkisNotEmpty(this.form.keyspace)) {
          this.$errorMsg("请选择KeySpace");
          return;
        }
        var k;
        var t;
        if ("bill__" == this.form.keyspace) {
          k = 'data_keyspace__';
          t = "bill__";
        } else {
          k = this.form.keyspace;
          t = this.form.table;
        }
        if (!this.$checkisNotEmpty(t)) {
          this.$errorMsg("请输入Table");
          return;
        }

        if (!this.$checkisNotEmpty(this.form.objectid)) {
          this.$errorMsg("请输入objectId");
          return;
        }

        this.isSubmit = true;

        renew(k, t, this.form.objectid).then((response) => {
          if (response.code == 0) {
            var map = eval("("+JSON.stringify(response.data.row)+")");
            for (var key in map) {
              this.detailRowData.push({'key':key,'value':map[key]})
            }
            this.$successMsg('更新成功');
          } 
        });

        this.isSubmit = false;
      },
      changeForm: function () {
        /* this.hasModify = true*/
        var ks = this.form.keyspace;
        this.form.table = '';
        if ("bill__" == ks) {
          this.tableDisable = true;
        } else {
          this.tableDisable = false;
        }
      },
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

