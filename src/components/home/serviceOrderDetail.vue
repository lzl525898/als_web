<template>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card body-style="min-height:600px">
        <als-order-table :tableDetail="orderDetail">
          <div class="order-success" v-if="orderDetail.status==1">
            <i class="el-icon-success"/><span style="margin-left:10px">订单状态：订购成功</span>
          </div>
          <div class="order-wait-paid" v-if="orderDetail.status==0">
            <i class="el-icon-warning"/><span style="margin-left:10px">订单状态：待支付</span>
          </div>
          <div class="order-wait-paid" v-if="orderDetail.status==3">
            <i class="el-icon-info"/><span style="margin-left:10px">订单状态：审核中</span>
          </div>
          <div class="order-fail" v-if="orderDetail.status==2">
            <i class="el-icon-error"/><span style="margin-left:10px">订单状态：订购失败</span>
          </div>
<!--          <div class="order-cancel" v-if="orderDetail.status==5">-->
<!--            <i class="el-icon-remove"/><span style="margin-left:10px">订单状态：订单已取消</span>-->
<!--          </div>-->
        </als-order-table>
      </el-card>
    </div>
</template>

<script>
    import childHeader from '../component/childHeader'
    import orderTable from "../component/order/orderTable"
    import '../../router/router'
    export default {
        name: "serviceOrderDetail",
        components: {'als-order-table':orderTable,'als-child-header':childHeader},
        data(){
            return {
                routerConfig: [{name:'订购记录',to:ROUTER_SERVICE_RECORD},{name:'详情',to:''}],
                orderDetail:{tableData:[],schoolName:'',totalPrice:'',status:'',orderId:''}
            }
        },
        mounted() {
            const detail = this.$store.state.orderDetail
            if(detail&&detail.tableData&&detail.tableData.length>0){
              this.orderDetail = detail
            }else{
                this.$router.replace({path:ROUTER_SERVICE_RECORD})
            }
        },
        methods: {

        }
    }
</script>

<style scoped>
  .order-success{
    line-height:60px;
    font-size:18px;
    border-bottom:1px solid #EBEEF5;
    color:#67C23A;
    font-family:PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
  }
  .order-wait-paid{
    line-height:60px;
    font-size:18px;
    border-bottom:1px solid #EBEEF5;
    color:#E6A23C;
    font-family:PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
  }
  .order-fail{
    line-height:60px;
    font-size:18px;
    border-bottom:1px solid #EBEEF5;
    color:#F56C6C;
    font-family:PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
  }
  .order-cancel{
    line-height:60px;
    font-size:18px;
    border-bottom:1px solid #EBEEF5;
    color:#909399;
    font-family:PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
  }
</style>
