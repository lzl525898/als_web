<template>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import childHeader from '../component/childHeader'
    export default {
        name: "serviceOrder",
        components: {
            "als-child-header": childHeader,
        },
        data(){
            return {
                routerConfig: [{name:'订购记录',to:''}],
            }
        },
    }
</script>

<style scoped>

</style>
