<template>
  <div id="main-view" >

    <div class="module-title">{{showTitle}}</div>

    <router-view ></router-view>
  </div>
</template>

<script>

  export default{
      data:function () {
        return {
          showTitle:''
        };
      },
      components: {

        },

    created:function () {
      this.$root.$off('contentText:change');
      this.$root.$on('contentText:change', (title)=>{
        this.showTitle=title;
      });
    },

      mounted:function () {
        this.showTitle=localStorage._st;
      },
      methods: {
      }
  }

</script>

<style scoped>




</style>
