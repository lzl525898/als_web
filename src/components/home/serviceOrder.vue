<template>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card body-style="min-height:600px">
        <div class="filter-wrapper">
          <span style="font-size:14px">服务类型</span>
          <el-select v-model="filters.cate" style="margin-left:10px;width:160px" size="small">
            <el-option v-for="item in filters.categories" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <span style="font-size:14px;margin-left:30px">订购状态</span>
          <el-select v-model="filters.status" style="margin-left:10px;width:160px" size="small">
            <el-option v-for="item in filters.orderStatus" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <span style="font-size:14px;margin-left:30px">订购时间</span>
          <el-date-picker
            v-model="filters.date" type="daterange"
            :picker-options="pickerOptions"
            range-separator=""
            start-placeholder="选择时间范围" style="width:240px;margin-left:10px;" size="small">
          </el-date-picker>
          <div style="flex:1;display:flex;justify-content:flex-end">
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleClickQuery" :loading="searchLoading">查询</el-button>
          </div>
        </div>
        <el-table :data="tableData" :header-cell-style="{'color':'#353535','fontSize':'16px','background':'#eef1f6'}">
          <el-table-column prop="date" label="创建时间" min-width="156px"/>
          <el-table-column prop="name" label="服务内容" show-overflow-tooltip/>
          <el-table-column prop="category" label="类型" min-width="138px" align="center"/>
          <el-table-column prop="price" label="费用(元)" min-width="138px" align="center"/>
          <el-table-column prop="status" label="订单状态" min-width="138px" align="center"/>
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-link :underline="false"><span style="color:#409EFF" @click="handleClickDetail(scope.row)">查看</span></el-link>
              <el-link :underline="false">
                <span v-if="scope.row.del==1" style="color:#409EFF" @click="handleClickDelete(scope.row)">删除</span>
                <span v-else style="color:gray;cursor:not-allowed">删除</span>
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <als-pagination :size="20"  @tableData="changeTableData" style="margin-top:20px" ref="orderListPagination"/>
      </el-card>
    </div>
</template>

<script>
    const moment = require('moment')
    import PubSub from 'pubsub-js'
    import childHeader from '../component/childHeader'
    import pagination from '../commons/pagination/pagination'
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import {qs,getOrderFilters,getOrderList,delOrderItem,orderItemDetail} from '../../api/api'
    import '../../api/restfulapi'
    import '../../router/router'
    export default {
        name: "serviceOrder",
        components: {
            "als-child-header": childHeader,
            "als-pagination": pagination
        },
        data(){
            return {
                routerConfig: [{name:'订购记录',to:''}],
                filters:{cate:0,status:99,date:'',
                    categories:[{label:'全部',value:0}],
                    orderStatus:[{label:'全部',value:99}]
                },
                searchLoading: false,
                pickerOptions:{
                    shortcuts:[{
                        text: '全部时间',
                        onClick(picker) {
                            picker.$emit('pick','');
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
                serverData: [],
                tableData: [],
            }
        },
        mounted() {
            PubSub.publish("currentMenuIndex", '')
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.getFilterData()
            this.getTableList()
        },
        methods: {
            handleClickDelete(row){
                if(row.id){
                    delOrderItem(qs.stringify({
                        order_id: row.id
                    })).then(res=>{
                        if(res.code==SUCCESS_CODE){
                            promptUtil.success(this,'删除成功')
                            this.getTableList()
                        }else{
                            promptUtil.warn(this,res.msg)
                        }
                    }).catch(err=>{
                        promptUtil.warning(this,'请稍后再试')
                    })
                }
            },
            handleClickDetail(row){
                // console.log("setOrderDetail",this.$store.state.orderDetail)
                // console.log("订单id",row.id)
                orderItemDetail(qs.stringify({
                    order_id:row.id,
                    user_id: storageUtil.readTeacherInfo().id
                })).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        const detail = {
                            tableData:res.data.data,
                            schoolName:storageUtil.readTeacherInfo().school_name,
                            totalPrice:res.data.price,
                            status:res.data.state,
                            orderId:res.data.order_id}
                        this.$store.dispatch('setOrderDetail',detail)
                        this.$router.push({path:ROUTER_ORDER_DETAIL})
                    }else{
                        promptUtil.warning(this,'请稍后再试')
                    }
                }).catch(err=>{
                    promptUtil.warning(this,'请稍后再试')
                })
            },
            handleClickQuery(){
                this.searchLoading = true
                this.getTableList()
            },
            getFilterData(){
                getOrderFilters().then(res=>{
                    if(res.code==SUCCESS_CODE){
                        if(res.data.cate&&res.data.cate!='[]'){
                            this.filters.categories = [{label:'全部',value:0}]
                            res.data.cate.map(cateItem=>{
                                const obj = {label:cateItem.label,value:cateItem.value*1}
                                this.filters.categories.push(obj)
                            })
                        }
                        if(res.data.type&&res.data.type!='[]'){
                            this.filters.orderStatus = [{label:'全部',value:99}]
                            res.data.type.map(typeItem=>{
                                const obj = {label:typeItem.label,value:typeItem.value*1}
                                this.filters.orderStatus.push(obj)
                            })
                        }
                    }else{
                        this.filters = {cate:0,status:99,date:'',
                            categories:[{label:'全部',value:0}],
                            orderStatus:[{label:'全部',value:99}]
                        }
                    }
                }).catch(err=>{
                    this.filters = {cate:0,status:99,date:'',
                        categories:[{label:'全部',value:0}],
                        orderStatus:[{label:'全部',value:99}]
                    }
                })
            },
            getTableList(){
                let startDate = null
                let endDate = null
                if(this.filters.date&&this.filters.date!=''){
                    startDate = moment(this.filters.date[0]).format("YYYY-MM-DD")
                    endDate = moment(this.filters.date[1]).format("YYYY-MM-DD")
                }
                getOrderList(qs.stringify({
                    school_id:storageUtil.readTeacherInfo().school_id,
                    state: this.filters.status==99? 'all' : this.filters.status,
                    cate: this.filters.cate,
                    start_date:startDate,
                    end_date:endDate,
                })).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        if(res.data&&res.data!='[]'){
                            this.serverData = res.data
                        }
                        this.$refs.orderListPagination.setCurrentPage(1)
                        this.$refs.orderListPagination.setServerData(this.serverData)
                    }
                    this.filters.cate = 0
                    this.filters.status = 99
                    this.filters.date = ''
                    this.searchLoading = false
                }).catch(err=>{
                    this.filters.cate = 0
                    this.filters.status = 99
                    this.filters.date = ''
                    this.searchLoading = false
                })
            },
            changeTableData(data){
                this.tableData = data
            }
        }
    }
</script>

<style scoped>
  .filter-wrapper{
    display: flex;
    align-items: center;
    padding-bottom:18px;
  }
</style>
