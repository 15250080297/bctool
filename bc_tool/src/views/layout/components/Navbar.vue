<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span class="name">{{name}}</span>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            <span @click="logout" style="display:block;">未读消息(0)</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout" style="display:block;">待办事务(0)</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout" style="display:block;">预警信息(0)</span>
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">注销</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import store from '@/store'

export default {
  data: function() {
    return {
      name: '',
      realTime: ''
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted: function(){
    let myDate = new Date()
    this.realTime = myDate.getFullYear() + '-' + (myDate.getMonth()+1) +'-'+(myDate.getDay()+1)
    this.name=store.getters.name
  },
  methods: {
    toggleSideBar() {
      //this.$store.dispatch('ToggleSideBar')
    },

    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .username{
    position: absolute;
    right: 90px;
    /*top: 16px;*/
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      color:#fff !important;
      .name{
        padding:10px 12px
      }
      .name:hover{

        background-color: rgba(230, 230, 230, 0.38);
        border-radius: 5px;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

