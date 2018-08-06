<template>
    <transition name="fade">
        <div v-if="show" class="modify-wrapper">

            <div class="modify-content">

                <div class="menu">
                    <slot name="menu"></slot>
                </div>
                <div class="content">
                    <slot name="content"></slot>
                </div>

            </div>
            <div class="overlay"></div>

        </div>
    </transition>

</template>
<script>
    export default{
        props:{
            id:{
                type:String,
                required:true
            },
            show:{
                type:Boolean,
                default:false
            }
        },
        data:function () {
            return {
            }
        },
        created:function () {

        },
        methods:{
        }
    }
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

.modify-wrapper{
    position: absolute;
    top:85px;
    bottom: 0;
    left:180px;
    right:0;
    z-index: 996;
}

.modify-content{
    position: relative;
    width: 100%;
    z-index: 999;
}

.modify-wrapper .overlay{
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    background-color: rgb(235, 245, 255);
    z-index: 997;
}

.modify-content .menu{
    width: 100%;
}

</style>
