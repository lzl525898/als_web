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
          <span id="course_step_3" class="step-wait">3.确认开通</span> - - - - -
          <span id="course_step_4" class="step-wait">4.等待客服开通</span></div>
        <div class="school-title">订购机构：{{schoolName}}</div>
        <el-table :data="tableData" :header-cell-style="{'color':'#353535','fontSize':'16px','background':'#eef1f6'}">
          <el-table-column prop="name" label="课程名称"></el-table-column>
          <el-table-column prop="date" label="可用时长" width="90" align="center"></el-table-column>
          <el-table-column label="课程价格（元）" width="420" align="right">
            <template slot-scope="scope">
                <div style="float: right;padding-right:10px">{{scope.row.price}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="course-pay-wrapper">
          <div class="course-pay-real">应付款：<div class="course-pay-real-price">{{totalPrice}}</div></div>
          <div class="course-pay-btn">
            <el-button v-show="!isPay" type="danger" :disabled="!agree" :loading="btnLoading" @click="handleClickPay">确认开通</el-button>
            <el-popover
              placement="bottom"
              width="150"
              trigger="hover">
              <div>
                <img :src='callUs.img' alt="" style="width: 150px">
                <p style="text-align: center">{{callUs.tel}} </p>
              </div>
              <el-button v-show="isPay" slot="reference" type="warning">等待开通</el-button>
            </el-popover>
          </div>
        </div>
        <div class="course-pay-protocol">
          <el-checkbox v-model="agree">{{$t(`message.index_base_login_agree`)}}
            <el-link @click="onClickUserAgreement" style="margin-top:-1px"><span style="color:#409EFF">{{$t(`message.index_base_aep_protocol`)}}</span>
            </el-link>
          </el-checkbox>
        </div>
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
    import $ from 'jquery'
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../component/childHeader'
    import userAgreementWrapper from '../component/userAgreementWrapper'
    import {qs,getSchoolDueInfo} from '../../api/api'
    import '../../api/restfulapi'
    import '../../router/router'
    export default {
        components: {
            "als-child-header": childHeader,
            'als-user-agreement-wrapper': userAgreementWrapper,
        },
        name: "confirmOrder",
        data(){
            return {
                routerConfig: [{name:'',to:''}],
                callUs:{tel:'',img:''},
                schoolName: '',
                isPay: false,
                btnLoading:false,
                protocolVisible:false,
                agree:true,
                totalPrice: '3000.00',
                tableData: [
                    {
                        name: '课程名称',
                        date: '12个月',
                        price: '3988.00'
                    }
                ],
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.routerConfig = [{name:this.$t(`message.course_buy_header_title`),to:ROUTER_COURSE_BUY},{name:'订单预约',to:''}]
            this.schoolName = storageUtil.readTeacherInfo().school_name
            this.initData()
        },
        methods: {
            initData(){
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
            },
            handleClickPay(){
                this.btnLoading = true
                setTimeout(()=>{
                    $('#course_step_3').removeClass('step-wait').addClass('step-finish')
                    $('#course_step_4').removeClass('step-wait').addClass('step-finish')
                    this.btnLoading = false
                    this.isPay = true
                },500)
            },
            onClickUserAgreement(){
                this.protocolVisible = true
            },
            changeParentDialogStatus(type) {
                if (type == 1) {
                    this.agree = true
                } else {
                    this.agree = false
                }
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
  .school-title{
    font-family:PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
    color:#888;
    font-size: 14px;
    margin: 30px 0 20px 0;
  }
  .course-pay-wrapper{
    height: 120px;
    border-top: 1px solid #E4E7ED;
    background: #eef1f6;
  }
  .course-pay-real{
    font-family: PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
    font-weight: 400;
    text-align: right;
    font-size: 14px;
    height: 28px;
    line-height: 28px;
    margin: 14px 10px 20px;
    box-sizing: border-box;
  }
  .course-pay-real-price{
    display: inline-block;
    height: 28px;
    color: #FB6161;
    font-size: 20px;
    font-weight: bold;
    vertical-align: top;
    line-height: 28px;
  }
  .course-pay-btn{
    margin-right: 10px;
    float: right;
  }
  .course-pay-protocol{
    text-align: right;
    line-height: 28px;
  }
</style>
