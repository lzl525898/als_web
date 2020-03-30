<template>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card shadow="always" body-style="min-height:500px">
        <div class="buy-step-title">
          <span class="step-finish">1.选择课程</span> - - - - -
          <span class="step-finish">2.确认订单信息</span> - - - - -
          <span id="course_step_3" class="step-wait">3.联系开通</span> - - - - -
          <span id="course_step_4" class="step-wait">4.等待客服开通</span>
        </div>
        <als-order-table :tableDetail="tableDetail" @protocol="onClickUserAgreement" :type="true"/>
      </el-card>
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false" :show-close="false"
        width="800px" :visible.sync="protocolVisible" append-to-body>
        <als-user-agreement-wrapper @changeDialogStatus="changeParentDialogStatus($event)"/>
      </el-dialog>
    </div>
</template>

<script>
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../component/childHeader'
    import orderTable from "../component/order/orderTable"
    import userAgreementWrapper from '../component/userAgreementWrapper'
    import '../../api/restfulapi'
    import '../../router/router'
    export default {
        components: {
            "als-child-header": childHeader,
            "als-order-table": orderTable,
            'als-user-agreement-wrapper': userAgreementWrapper,
        },
        name: "confirmOrder",
        data(){
            return {
                routerConfig: [{name:'',to:''}],
                isPay: false,
                btnLoading:false,
                protocolVisible:false,
                agree:true,
                totalPrice: '',
                tableData: [],
                tableDetail:{tableData:[],totalPrice:''},
            }
        },
        mounted() {
            const courseOrderDetail = this.$store.state.courseOrder
            if(courseOrderDetail&&courseOrderDetail.length>0){
                this.handleOrderData(courseOrderDetail)
            }else{
                this.$router.replace({path: ROUTER_COURSE_BUY})
            }
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.routerConfig = [{name:this.$t(`message.course_buy_header_title`),to:ROUTER_COURSE_BUY},{name:'订单确认',to:''}]
        },
        methods: {
            onClickUserAgreement(){
                this.protocolVisible = true
            },
            handleOrderData(data){
                this.tableData = []
                let price = 0
                data.map(item=>{
                    const obj = {id:item.id,name:item.firstName, desc:item.secondName, date:'12个月',price:parseFloat(item.price).toFixed(2)}
                    price += item.price*1
                    this.tableData.push(obj)
                })
                this.totalPrice = parseFloat(price).toFixed(2)
                this.tableDetail = {tableData:this.tableData,totalPrice:this.totalPrice,schoolName:storageUtil.readTeacherInfo().school_name,agree:this.agree}
            },
            changeParentDialogStatus(type) {
                if (type == 1) {
                    this.agree = true
                } else {
                    this.agree = false
                }
                this.tableDetail.agree = this.agree
                this.protocolVisible = false
            },
        }
    }
</script>

<style scoped>
  .step-finish{
    color: #353535;
  }
  .step-wait{
    color: #888888;
  }
  .buy-step-title{
    font-family:PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
    font-size: 14px;
    color: #353535;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    box-sizing:border-box;
  }
</style>
