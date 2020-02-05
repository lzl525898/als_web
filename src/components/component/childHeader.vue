<template>
    <div>
      <el-page-header @back="goBack" title="首页">
        <div slot="content" style="margin-top:5px;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="router.to" v-for="(router, index) in item" :key="index">{{router.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-page-header>
    </div>
</template>

<script>
  export default {
    name: "childHeader",
    props:{
      config:{
        default: []
      }
    },
    data(){ // this.config = [{to: '/classRecord', name: '记上课'},{to: '/classRecord', name: '记上课'},{to: '', name: '最后的记上课'}]
      return{
        item: ""
      }
    },
    watch:{
      config:{
        handler(newVal) {
          this.item = newVal
        },
        immediate: true,
        deep: true,
      }
    },
    mounted(){
      this.item = this.config
    },
    methods: {
      goBack() {
        this.$router.push({path: '/'})
      }
    }
  }
</script>

<style scoped>

</style>
