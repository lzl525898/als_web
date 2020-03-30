<template>
  <div>
    <el-row style="margin-bottom:20px">
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card style="min-height:660px">
      <div style="padding-bottom:16px">
        <div style="background-color:#E5F3FF;font-size:12px;padding:10px 12px;display:flex;align-items:center;margin-bottom:18px;border-radius:5px">
          <i class="el-icon-info" style="color:#409EFF;font-size:14px"/><span style="margin-left:10px;">仅统计当前 下行流量 已合计数据，平均延迟 1-2 小时</span>
        </div>
        <div style="display:flex;align-items:center;padding-bottom:16px">
          <span style="font-size:14px">访问时间</span>
          <el-date-picker v-model="filters.date" type="daterange" :picker-options="pickerOptions" range-separator="" @change="handleChangeDate"
                          start-placeholder="选择时间范围" style="width:240px;margin-left:10px;" size="small" :clearable="false"/>
        </div>
        <div style="border-top:3px solid #EBEEF5;padding-top:10px">
          <div class="flow-count-container">本月可用下行流量：<div class="flow-count-number">{{flowData.data}}</div>
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              content="下行流量就是从网络中下载的字节数，计算机流量单位一般用bit、B、KB、MB、GB……来表示，它们之间的关系是：1GB=1024MB、1MB=1024KB、1KB=1024B、1B=8b">
              <el-link :underline="false" slot="reference" style="margin-top:4px;margin-left:5px"><span style="color:#409EFF">下行流量？</span></el-link>
            </el-popover>
            <div style="flex:1;display:flex;justify-content:flex-end">
              <el-popover
                placement="bottom"
                width="150"
                trigger="hover">
                <div>
                  <img :src='callUs.img' alt="" style="width: 150px">
                  <p style="text-align: center">{{callUs.tel}} </p>
                </div>
                <el-button slot="reference" class="consult-item" size="mini" type="primary" plain>
                  <i class="el-icon-service"/><span style="margin-left: 5px">咨询</span>
                </el-button>
              </el-popover>
            </div>
          </div>
          <div style="display: flex;margin: 20px 0;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">下行流量记录</div>
          </div>
          <el-table :data="flowData.table"
                    :header-cell-style="{'color':'#353535','fontSize':'16px','background':'#eef1f6'}">
            <el-table-column prop="name" label="访问用户"/>
            <el-table-column prop="time" label="访问时间"/>
            <el-table-column prop="path" label="访问路径"/>
            <el-table-column prop="size" width="150px" align="center">
              <template slot="header" slot-scope="scope">
                <div style="display:flex;align-items:center;justify-content:center;width:100%;">消耗流量<el-tooltip class="item" effect="light" content="访问当前文件的下行流量" placement="top-start">
                  <el-link :underline="false"><span style="margin-left:5px;color:#909399"><i class="el-icon-info"/></span></el-link></el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <als-pagination :size="20" ref="alsFlowPagination" @tableData="changeTableData($event)" style="margin-top:20px"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
    const moment = require("moment");
    import PubSub from 'pubsub-js'
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../../components/component/childHeader'
    import alsPagination from '../commons/pagination/pagination'
    import '../../router/router'
    import {qs,getSchoolDueInfo,getFlowDataDetail} from '../../api/api'
    import '../../api/restfulapi'
    export default {
        name: "flowAccess",
        components: {
            "als-child-header": childHeader,
            "als-pagination": alsPagination
        },
        data() {
            return {
                routerConfig: [{name:'数据流量',to:''}],
                callUs:{tel:'',img:''},
                filters: {date:''},
                pickerOptions:{
                    shortcuts:[{
                        text: '本周时间',
                        onClick(picker) {
                            picker.$emit('pick', [moment().startOf('week'), moment().endOf('week')]);
                        }
                    },{
                        text: '当月时间',
                        onClick(picker) {
                            picker.$emit('pick', [moment().startOf('month'), moment().endOf('month')]);
                        }
                    },{
                        text: '今年至今',
                        onClick(picker) {
                            picker.$emit('pick', [moment().startOf('year'), new Date()]);
                        }
                    }]
                },
                flowData: {
                    data: '',
                    table:[],
                    server:[]
                }
            }
        },
        mounted() {
            PubSub.publish("currentMenuIndex", ROUTER_FLOW_ACCESS);
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.initData()
        },
        methods: {
            initData() {
                this.filters.date = [moment().startOf('month'), moment().endOf('month')]
                getSchoolDueInfo(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.callUs.tel = res.data.tel
                            this.callUs.img = res.data.qrcode
                        }
                    }
                }).catch(err => {
                    promptUtil.LOG('getSchoolDueInfo-err', err)
                })
                this.getFlowList()
            },
            getFlowList(){
                const loading = promptUtil.loading(this)
                let startData = null
                let endDate = null
                if(this.filters.date!=''){
                    startData = moment(this.filters.date[0]).format('YYYY-MM-DD')
                    endDate = moment(this.filters.date[1]).format('YYYY-MM-DD')
                }
                getFlowDataDetail(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date:startData,
                    end_date: endDate
                })).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        this.flowData.data = res.data.flow
                        if(res.data.data&&res.data.data!=''){
                            this.flowData.server = res.data.data
                        }else{
                            this.flowData.server = []
                        }
                    }
                    loading.close()
                    this.$refs.alsFlowPagination.setCurrentPage(1)
                    this.$refs.alsFlowPagination. setServerData(this.flowData.server)
                }).catch(err=>{
                    loading.close()
                    promptUtil.LOG('getFlowDataDetail-err',err)
                })
            },
            handleChangeDate(){
                this.getFlowList()
            },
            changeTableData(data){
                this.flowData.table = data
            }
        }
    }
</script>

<style scoped>
  .flow-count-container{
    display: flex;
    align-items: baseline;
    font-size: 14px;
    height: 36px;
  }
  .flow-count-number{
    font-size: 36px;
    height: 36px;
    color: #fb6161;
    margin-right:3px;
  }
</style>
