<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <div v-if="sidebar.opened == 1" class="brand">
      <div class="logo"><img src="../../assets/img/logo.png"></div>
    </div>
    <div v-if="device==='mobile'" class="min-button" @click="minBtnClick">
      <i class="el-icon-arrow-right"></i>
    </div>

    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <div class="main-container-wrapper">
        <tags-view></tags-view>
        <app-main></app-main>
      </div>

    </div>
  </div>
</template>

<script>
import { Top, Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import store from '@/store'
export default {
  name: 'layout',
  components: {
    Top,
    TagsView,
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    minBtnClick(){
        console.log("minBtnClick");
      store.dispatch('ToggleDevice', 'desktop');
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .min-button{
    position: fixed;
    width: 15px;
    height: 50px;
    padding-top:15px;
    left:0;
    top:calc(50% - 25px);
    background-color: rgba(0, 21, 40, 0.82);
    z-index: 1005;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    color:#fff;
    content: "\2140";
  }
  .min-button:hover{
    cursor: pointer;
  }
</style>
