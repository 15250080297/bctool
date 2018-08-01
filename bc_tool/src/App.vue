<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  body{
    /*background-color: #ebf5ff;*/
    overflow-y: hidden;
    background: url('./assets/img/bg.jpg') no-repeat top center fixed;
    background-size: cover;

  }

  .action-bar-container{
    margin: 0;
    padding: 5px 10px;
    cursor: pointer;
    border-bottom: 1px solid #d8dce5;
    /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);*/
    background-color: #ebf5ff;
  }

  .action-bar-container .el-dropdown{
    color:#1f2d3d !important;
  }

  .action-bar-container button.action-item, .action-bar-container .el-button{
    color:#1f2d3d !important;
    border: none !important;
    background-color: rgba(0, 0, 0, 0) !important;
  }

  .action-bar-container button.action-item:hover, .action-bar-container .el-button:hover{
    background-color: #409EFF !important;
    color:#fff !important;
  }

  .action-bar-container button.cancel{
    background-color: #949494 !important;
    color:#fff !important;
  }

  .action-bar-container button.cancel:hover{
    background-color: #7c7c7c !important;
    color:#fff !important;
  }

  .action-bar-container button.del{
    border: none !important;
    background-color: rgba(0, 0, 0, 0) !important;
    color:#1f2d3d !important;
  }

  .action-bar-container button.del:hover{
    background-color: #e84e36 !important;
    color:#fff !important;
  }


  .action-bar-container button[disabled]{
    color: #a1a1a1 !important;
    background-color: rgba(255, 255, 255, 0) !important;
  }

  .tags-view-item.active{
    background-color: #409EFF!important;
    border-color: rgba(66, 157, 255, 0.91) !important;
  }

  .tab-container{
    overflow-y: auto;
  }

  .hottable-srapper{
    height: 400px;
  }

  .ag-table{
    width: 100%;
    height: 100%;
  }
  .column-disable{
    background-color: rgba(245, 245, 245, 0.43);
  }




  .ag-header-cell-label .ag-header-cell-text{
    font-size: 12px;
    font-weight: bold;
    color: #17335b;
  }

  .overlay-nodata-center{
    color: #c0c8d1;
  }

  .overlay-loading-center{

  }
  .el-dialog__body{
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .el-dialog__footer{
    padding-top: 5px !important;
    padding-bottom: 10px !important;
  }

  .el-dialog__header{
    padding-top: 10px;
  }

  .el-dialog__headerbtn{
    top:13px;
  }

  .new-row{
    background-color: rgba(245, 112, 23, 0.67) !important;
  }

  .el-dropdown-menu--medium .el-dropdown-menu__item.el-dropdown-menu__item--divided:before {
    height: 1px;
  }


  .el-dropdown-menu__item--divided:before,
  .el-menu,
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
    background-color: rgba(14, 14, 14, 0.24) !important;
  }

  .el-menu--popup{
    background-color: rgb(18, 39, 70) !important;
  }
  .el-menu--popup .el-menu-item:hover{
    background-color: rgba(72, 72, 72, 0.24) !important;
  }

  @media screen and (max-width: 300px){

  }

</style>
