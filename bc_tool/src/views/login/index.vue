<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">
        <span class="logo"></span>
        <span class="txt">Beecloud后台管理</span>
      </h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" :loading="loading" @click.native.prevent="handleLogin">登 录</el-button>
      </el-form-item>
      <!--<div class="tips">-->
        <!--<span style="margin-right:20px;">username: admin</span>-->
        <!--<span> password: admin</span>-->
      <!--</div>-->
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
// const auth = require('../../utils/auth');
// const globalConfig = require('../../config');

export default {
  name: 'login',
  data() {
    // TODO 登陆验证规则
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/plugins' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    /**
     * 登陆操作
     *  1.validation
     *  2.ajax请求
     *  3.localStorage存储response
     **/
    // login: function () {
    //   let valid = true;
    //   let msgs = [];
    //
    //   if (!_checkisNotEmpty(this.accountName)) {
    //     valid = false;
    //     msgs.push(globalConfig.Messages.loginNameMandatory);
    //   }
    //   if (!_checkisNotEmpty(this.pwd)) {
    //     valid = false;
    //     msgs.push(globalConfig.Messages.pwdMandatory);
    //   }
    //
    //   if (valid) {
    //     this.$ajax(globalConfig.ApiURL.login,
    //       {
    //         accountName: this.accountName,
    //         pwd: md5(this.pwd),
    //         token: auth.getToken()
    //       },
    //       true,
    //       (res) => {
    //         localStorage.rememberAccount=this.accountName;
    //         localStorage.rememberPwd=this.pwd;
    //         this.initLogin(res.data);
    //
    //
    //       }, false);
    //     //this.loadAuthCode();
    //   } else {
    //     this.$showErrorMessage(msgs.join(' , '));
    //   }
    // },
    //
    // initLogin:function(data){
    //   localStorage.user = JSON.stringify({
    //                       accountName:data.accountName,
    //                       realName:data.realName,
    //                       avatar:data.avatar,
    //                       _i:data.id,
    //                       _pi:data.pid
    //                   });
    //   localStorage._rk = data.roleKey;
    //   localStorage._rt = data.roleType;
    //   localStorage._at = data.token;
    //   localStorage._ai = data.id;
    //
    //   localStorage._dm = data.domain;
    //   localStorage._l =null;
    //   localStorage._pk = null;
    //
    //   localStorage._l = JSON.stringify(data.menus);
    //   localStorage._pk = JSON.stringify(data.privileges);
    //
    //   // ipcRenderer.send('set-menu-data',localStorage._at,data.id+"",data.roleKey);
    //
    //   if(data.menus.length>0&&data.menus[0].children.length>0) {
    //     localStorage._sp = data.menus[0].children[0].id;
    //     localStorage._sm = data.menus[0].name+"/"+data.menus[0].children[0].name;
    //     localStorage._su = data.menus[0].children[0].url;
    //   }
    //
    // }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .login-btn{
    width: 100%;
    font-size: 1.2em;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: rgba(0, 6, 6, 0.56);
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    position: relative;
    height: 60px;
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .title span{
    position: absolute;
    display: inline-block;
  }
  .title .txt{
    right:calc(50% - 135px);;
    height: 50px;
    padding-top: 10px;
  }
  .title .logo{
    left: calc(50% - 140px);
    width: 50px;
    height: 50px;
    background-image: url("../../assets/img/logo.png");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
