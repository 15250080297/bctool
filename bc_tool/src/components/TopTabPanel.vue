<template>
    <div class="container-tab">
      <transition name="router-animation" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>


</template>


<script>

    var self;
    export default {
        data: function () {
            return {

            }
        },
        created: function () {
        },
        mounted: function () {

        },
        methods: {


        }
    }


</script>

<style scoped>
.container-tab{
  top:0px;
}
</style>
