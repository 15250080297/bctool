<template>
  <div class="edit-container">
    <SCModify id="dutyModify" :show="showAdd">

      <ActionBar slot="menu">
        <el-button class="action-item cancel" type="info" @click="cancelModify">{{$t('button.cancel')}}</el-button>
        <el-button class="action-item save" type="info" :disabled="hasModify ? false : true" @click="save">
          {{$t('button.save')}}
        </el-button>
      </ActionBar>


      <SCContent slot="content">
        <!-- form-->
        <SCContent>
          <el-form ref="form" :model="dutyBean" label-width="120px">
            <el-form-item label="任务时间">
              <el-select v-model="dutyBean.action" placeholder="请选择事件">
                <el-option v-for="p in actionSelect" :value="p.action" :label="p.title" :key="p.action"></el-option>
              </el-select>
              <label class="red">*</label>
            </el-form-item>

            <el-form-item label="开始日期" :label-width="formLabelWidth">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" v-model="dutyBean.startTime"></el-date-picker>
              <label class="red">*</label>
            </el-form-item>

            <el-form-item label="结束日期" :label-width="formLabelWidth">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" v-model="dutyBean.endTime"></el-date-picker>
              <label class="red">*</label>
            </el-form-item>


            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="目标邮箱">
                  <el-input v-model="dutyBean.email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="目标应用">
                  <el-input v-model="dutyBean.appid"></el-input>
                </el-form-item>
              </el-col>
            </el-row>


            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="CHANNEL">
                  <el-input v-model="dutyBean.channel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="SUB_CHANNEL">
                  <el-input v-model="dutyBean.subChannel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </SCContent>
      </SCContent>


    </SCModify>
  </div>

</template>

<script>
  import ActionBar from '@/components/ActionBar'
  import SCContent from '@/components/SCContent'
  import SCTable from '@/components/SCTable'
  import SCModify from '@/components/SCModify'
  import {addRequistion} from '@/api/requistion'
  import Datepicker from '@/components/Datepicker'

  import {action} from '@/api/tool/duty'


  const globalConfig = require('../../../config');


  export default {
    components: {ActionBar, SCContent, SCTable, SCModify, Datepicker},

    data: function () {
      return {
        dutyBean: {
          action: '',
          email:'zhihaoq@beecloud.cn',
          appid:'afae2a33-c9cb-4139-88c9-af5c1df472e1',
          channel:'',
          subChannel:'',
          startTime:null,
          endTime:null
        },
        actionSelect: [],
        formLabelWidth: '120px',
        hasModify:true,
        isSubmit: false,


      }
    },
    created: function () {
      this.$root.$off('onProSelectadd');
      this.$root.$on('onProSelectadd', (event) => {
        this.selectPro(event);
      });
    },
    mounted: function () {
      for (let ae in globalConfig.ActionEnum) {
        this.actionSelect.push({'action': ae, 'title': globalConfig.ActionEnum[ae]});
      }
    },
    computed: {
      showAdd: function () {
        let val = this.$store.state.duty.showAdd;
        return val;
      }
    },
    methods: {

      cancelModify: function () {
          this.dutyBean = {
            email:'zhihaoq@beecloud.cn',
            appid:'afae2a33-c9cb-4139-88c9-af5c1df472e1'
          };
          this.$store.dispatch('HideAddDuty').then(() => {
          });
      },
      save: function () {
        console.info(JSON.stringify(this.dutyBean))
        console.info(new Date(this.dutyBean.startTime).getTime());
        if (this.isSubmit)
          return;

        if (!this.$checkisNotEmpty(this.dutyBean.action)) {
          this.$errorMsg("请选择事件");
          return;
        }
        var st = new Date(this.dutyBean.startTime).getTime();
        var et = new Date(this.dutyBean.endTime).getTime();
        if (0 == st || et == 0) {
          this.$errorMsg("请选择事件范围");
          return;
        }

        this.isSubmit = true;

        action(this.dutyBean.action,this.dutyBean.email,this.dutyBean.appid,this.dutyBean.channel,this.dutyBean.subChannel,st,et).then((response) => {
          if (response.code == 0) {
            this.$successMsg('创建成功');
            this.dutyBean={
              email:'zhihaoq@beecloud.cn',
              appid:'afae2a33-c9cb-4139-88c9-af5c1df472e1'
            }
            this.$store.dispatch('HideAddDuty').then(()=>{});
            this.$root.$emit('search:dutySearcher');
          }
        });
        this.isSubmit = false;

      }
    }
  }

</script>

<style scoped>

</style>
