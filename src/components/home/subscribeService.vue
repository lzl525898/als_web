<template style="height:100%;">
  <div style="min-width:1100px">
    <el-row style="margin-bottom:20px">
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <div v-if="!isShowContent"></div>
    <el-card v-if="isShowContent">
      <div slot="header" class="service-header">
        <span>版本服务</span>
      </div>
      <als-service-card :content="content"/>
      <als-service-table :versionDetail="versionDetail" :versionList="versionArray"/>
    </el-card>
  </div>
</template>
<script>
    import PubSub from "pubsub-js"
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../component/childHeader'
    import serviceCard from '../component/service/serviceCard'
    import serviceTable from '../component/service/serviceTable'
    import {
        serviceFuncList,
        getVersionInfo,
    } from '../../api/api'
    import '../../api/restfulapi'
    import '../../router/router'
    export default {
        components: {
            "als-child-header": childHeader,
            'als-service-card': serviceCard,
            'als-service-table': serviceTable,
        },
        data() {
            return {
                isShowContent:false,
                routerConfig: [{name:'',to:''}],
                versionDetail: [{title:'',table:[{name:'',text:'',version:[],msg:[]}]}],
                content: [],
                versionArray: [],
            }
        },
        mounted() {
            this.routerConfig = [{name:this.$t(`message.subscribe_service_header_title`),to:''}]
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", ROUTER_SUB_SERVICE)
            this.initData()
        },
        methods: {
            initData(){
                const loading = promptUtil.loading(this)
                getVersionInfo().then(res=>{
                    if(res.code==SUCCESS_CODE){
                        this.content = res.data
                        this.content.map(item=>this.versionArray.push(item.title))
                    }
                    serviceFuncList().then(res=>{
                        if(res.code==SUCCESS_CODE){
                            this.versionDetail = res.data
                        }
                        loading.close()
                        this.isShowContent = true
                    }).catch(err=>{
                        loading.close()
                        this.isShowContent = true
                    })
                }).catch(err=>{
                    loading.close()
                    this.isShowContent = true
                })
            }
        }
    }
</script>
<style scoped>
</style>
