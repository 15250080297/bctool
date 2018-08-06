<template>
    <el-row :id="id">
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <div class="form-wrapper">
                <slot></slot>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="search">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>

</template>
<script>
    export default{
        props:{
            id:{
                type:String,
                required:true
            },
            title:{
                type:String,
                required:true
            }
        },
        data:function () {
            return {
                dialogFormVisible: false
            };
        },
        created:function () {
            this.$root.$on('showSearch:'+this.id, ()=>{
                this.show();
            });
            this.$root.$on('hideSearch:'+this.id, ()=>{
                this.hide();
            });
        },
        methods:{
            show:function () {
                this.dialogFormVisible = true;
            },
            hide:function () {
                this.dialogFormVisible = false;
            },
            search:function () {
              this.dialogFormVisible = false;
              this.$root.$emit('search:'+this.id,'');
          }
        }
    }
</script>

<style scoped>
.form-wrapper{
    width: 60%;
}
</style>
