<template>
  <div>
    <div style="display:flex;justify-content:center;" v-show="show">
      <el-pagination
        background
        @current-change="tableDataCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="tableDataList"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "pagination",
    props:{
      size: {
        type:Number,
        default: 10,
      },
    },
    data(){
      return{
        show:false,
        currentPage:1,
        pageSize:10,
        tableDataServer:[],
        tableData:[],
      }
    },
    computed:{
      tableDataList: {
        get() {
          return this.tableDataServer.length
        }
      }
    },
    watch:{
      size:{
        handler(val){
          this.pageSize = val
        },
        immediate: true
      },
      tableDataServer:{
        handler(val){
          this.show = val.length > 0 ? true : false
        },
        immediate: true,
        deep: true
      },
      tableData:{
        handler(){
          this.toParentTableData()
          this.toParentCurrentPage()
        },
        immediate: true,
        deep: true
      }
    },
    mounted(){
      this.pageSize = this.size
    },
    methods:{
      setCurrentPage(val){
        this.currentPage = val
      },
      getCurrentPage(){
        return this.currentPage
      },
      toParentTableData(){
        this.$emit('tableData',this.tableData)
      },
      toParentCurrentPage(){
        this.$emit('currentPage',this.currentPage)
      },
      getTableData(){
        return this.tableData
      },
      setServerData(data){
        this.tableDataServer = data
        this.tableDataCurrentChange(this.currentPage)
      },
      tableDataCurrentChange(val){
        this.currentPage = val
        if(this.tableDataServer.length%this.pageSize==0){
          if(this.tableDataServer.length/this.pageSize==(this.currentPage-1)){
            if(this.currentPage>1){
              this.currentPage = this.currentPage - 1
            }
          }
        }
        this.tableData = this.tableDataServer.slice((this.currentPage - 1) * this.pageSize, this.pageSize + (this.currentPage - 1) * this.pageSize)
      }
    }
  }
</script>

<style scoped>

</style>
