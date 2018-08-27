<template>
  <div class="tab-container">


    <SCContent>


      <el-table :data="rowData" stripe border style="width: 100%" :height=tableHeight show-summary
                :summary-method="getSummaries">
        <el-table-column fixed prop="merchantName" label="企业名称">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="可用金额" sortable prop="usableAmount">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       :title="scope.row.amount/100.00+' - '+scope.row.freezeAmount/100.00 ">
              ¥ {{scope.row.usableAmount /100.00}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="可提分润" sortable prop="bcUsableAmount">
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       :title="scope.row.bcAmount/100.00+' - '+scope.row.bcFreezeAmount/100.00 ">
              ¥ {{scope.row.bcUsableAmount /100.00}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="违规笔数" sortable prop="deductCount">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDeductList(scope.row.email)">
              {{scope.row.deductCount}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="90">
          <template slot-scope="scope">
            <el-button @click="showFreeze(scope.row.email)" type="text" size="small">冻结</el-button>
            <el-button @click="showWithdraw(scope.row.email,scope.row.bcUsableAmount)" type="text" size="small">提款
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="违规列表" :visible.sync="dialogDeduct" width="66%">

        <el-select v-model="freezeFlag" v-on:change="changeFeezeFlag">
          <el-option value="" label="全部"></el-option>
          <el-option value="I" label="只看冻结"></el-option>
          <el-option value="F" label="只看解冻"></el-option>
        </el-select>


        <el-table :data="deductRealList" border stripe style="width: 100%" show-summary :summary-method="getSummaries2">
          <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
          <el-table-column prop="amount" label="冻结金额" width="150" >
            <template slot-scope="scope">
           <div v-if="scope.row.status=='I'" class="red">
           <span >
              {{$money(scope.row.amount)}}
            </span>
           </div>
              <div v-if="scope.row.status=='F'" class="green">
                <span >
              {{$money(scope.row.amount)}}
            </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="冻结原因" width="350"></el-table-column>
          <el-table-column prop="status" label="状态" width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='I'" class="red">冻结中</span>
              <span v-if="scope.row.status=='F'" class="green">已解冻</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdat" label="冻结时间" :formatter="$timeFormat" width="200"></el-table-column>
          <el-table-column prop="updatedat" label="更新时间" :formatter="$timeFormat" width="200"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="70">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status=='I'" @click="deductcancelApi(scope.row.objectId,scope.row.amount)" type="text" size="small">解冻
              </el-button>
            </template>
          </el-table-column>
        </el-table>


      </el-dialog>


      <el-dialog title="冻结资金" :visible.sync="dialogFreeze">
        <el-form>
          <el-form-item label="冻结账户" :label-width="formLabelWidth">
            {{modifyEmail}}
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="冻结金额(元)" :label-width="formLabelWidth">
                <el-input v-model="freezeAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="冻结原因" :label-width="formLabelWidth">
            <el-input v-model="freezeMessage" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFreeze = false">取 消</el-button>
          <el-button type="primary" @click="freeze">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="提款操作" :visible.sync="dialogWithdraw">
        <el-form>
          <el-form-item label="提款账户" :label-width="formLabelWidth">
            {{modifyEmail}}
          </el-form-item>

          <el-form-item label="可提金额" :label-width="formLabelWidth">
            {{$money(canWithdrawAmount)}}
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="提款金额(元)" :label-width="formLabelWidth">
                <el-input v-model="withdrawAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="提款密码" :label-width="formLabelWidth">
                <el-input type='password' v-model="withdrawPwd" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogWithdraw = false">取 消</el-button>
          <el-button type="primary" @click="withdraw">确 定</el-button>
        </div>
      </el-dialog>

    </SCContent>

  </div>
</template>

<script>
  import SCContent from '@/components/SCContent'
  import {listAll, freeze, deductlist, deductcancel,drawApi} from '@/api/balance/business'

  export default {
    components: {SCContent},
    data() {
      return {
        rowData: [],
        dialogDeduct: false,
        deductList: [],
        deductRealList: [],
        dialogFreeze: false,
        modifyEmail: '',
        freezeAmount: 0,
        freezeMessage: '',
        formLabelWidth: '120px',
        dialogWithdraw: false,
        canWithdrawAmount: 0,
        withdrawAmount: 0,
        withdrawPwd: '',
        tableHeight:document.documentElement.clientHeight-100,
        freezeFlag:'I'

      }
    },
    mounted() {
      this.listAll();
    },

    methods: {

      listAll: function () {
        listAll().then(resp => {
          if (resp.code == 0) {
            this.rowData = resp.data.rows;
          }

        });
      },
      showDeductList: function (email) {
        this.dialogDeduct = true;
        this.deductList = [];
        this.modifyEmail = email;
        deductlist(email).then(resp => {
          if (resp.code == 0) {
            this.deductList = resp.data.list;
            this.changeFeezeFlag();
          }
        });
      },
      changeFeezeFlag:function(){
        this.deductRealList=[];
        for(let d of this.deductList){
          var amount=d.amount;
          if(''==this.freezeFlag||d.status==this.freezeFlag){
            if(d.status=='I')
              amount=-amount;
            this.deductRealList.push({
              status:d.status,
              amount:amount,
              email:d.email,
              remark:d.remark,
              createdat:d.createdat,
              updatedat:d.updatedat,
              objectId:d.objectId

            });
          }
        }


      },
      showFreeze: function (email) {
        this.modifyEmail = email;
        this.freezeAmount = 0;
        this.dialogFreeze = true;

      },
      freeze: function () {
        console.info("freeze in")
        if (this.freezeAmount <= 0) {
          this.$errorMsg("冻结金额不能为空");
          return;
        }

        if (!this.$checkisNotEmpty(this.freezeMessage)) {
          this.$errorMsg("请填写冻结原因");
          return;
        }

        freeze(this.modifyEmail, this.freezeAmount, this.freezeMessage).then(resp => {
          if (resp.code == 0) {
            this.rowData = resp.data.rows;
            this.$successMsg('冻结成功');
            this.dialogFreeze = false;
            this.listAll();
          }

        })
      },

      deductcancelApi: function (billid, amount) {
        var fa = amount / 100.00;
        this.$confirm('你确定将此笔冻结金额:' + fa + '元解冻吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deductcancel(billid).then(resp => {
            if (resp.code == 0) {
              this.showDeductList(this.modifyEmail);
              this.listAll();
              this.$successMsg('解冻成功');
            }
          });

        }).catch(() => {

        });
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index] / 100 + ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
      },
      getSummaries2(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          } else if (index === 1) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = sums[index] / 100 + ' 元';
            }
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      },
      showWithdraw: function (email, canWithdrawAmount) {
        this.modifyEmail = email;
        this.canWithdrawAmount = canWithdrawAmount;
        this.withdrawAmount = 0;
        this.withdrawPwd = '';
        this.dialogWithdraw = true;
      },
      withdraw:function () {
        if (this.withdrawAmount <= 0) {
          this.$errorMsg("提款金额不正确");
          return;
        }

        if (!this.$checkisNotEmpty(this.withdrawPwd)) {
          this.$errorMsg("请输入提款密码");
          return;
        }

        drawApi(this.modifyEmail,this.withdrawAmount,this.withdrawPwd).then(resp =>{
          if (resp.code == 0) {
            this.listAll();
            this.$successMsg('提款成功');
            this.dialogWithdraw = false;
          }
        });

      },
      testh:function () {
        return 333;
      }
    }

  }
</script>

<style scoped>

</style>
