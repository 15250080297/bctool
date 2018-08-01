<template>

  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="400px"><LeftMenu ></LeftMenu></el-aside>
      <el-main> <MainContent></MainContent></el-main>
    </el-container>
  </el-container>
</template>

<script>

  import LeftMenu from './LeftMenu.vue'
  import MainContent from './MainContent.vue'

  export default {
    name: 'Home',

    components:{
        LeftMenu,MainContent
    },
    data () {
      return {

      }
    },

    computed:{

    },


    mounted:function () {
        console.info("home in");
    },
    methods:{
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }






</style>
