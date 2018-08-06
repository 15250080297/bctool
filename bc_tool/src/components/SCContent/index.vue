<template>
    <div class="main-content">
        <slot></slot>
    </div>
</template>

<style>
    .main-content{
        position: relative;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left:5px;
        padding-right: 10px;
        width: 100%;

    }

    .main-content .el-tabs--border-card>.el-tabs__content{
        padding: 0px !important;
    }


</style>