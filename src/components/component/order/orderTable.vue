<template>
  <div>
    <slot></slot>
    <div class="header-wrapper">
      <div class="school-title">订购机构：{{tableDetail.schoolName}}</div>
      <div v-if="!type" class="order-title">订单编号：{{tableDetail.orderId}}</div>
    </div>
    <el-table :data="tableDetail.tableData" :header-cell-style="{'color':'#353535','fontSize':'16px','background':'#eef1f6'}">
      <el-table-column prop="name" label="课程名称">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
              <div style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{scope.row.name}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="scope.row.desc" placement="top">
              <div style="color:#999;font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:10px;">{{scope.row.desc}}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="可用时长" width="90" align="center"></el-table-column>
      <el-table-column label="课程价格（元）" width="420" align="right">
        <template slot-scope="scope">
          <div style="float: right;padding-right:10px">{{scope.row.price}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="course-pay-wrapper">
      <div class="course-pay-real">应付款：<div class="course-pay-real-price">{{tableDetail.totalPrice}}</div></div>
      <div class="course-pay-btn" v-if="type">
        <el-button v-show="!isPay" type="danger" :disabled="!tableDetail.agree" :loading="btnLoading" @click="handleClickPay">联系开通</el-button>
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
    <div class="course-pay-protocol" v-if="type">
      <el-checkbox v-model="tableDetail.agree">{{$t(`message.index_base_login_agree`)}}
        <el-link @click="onClickUserAgreement" style="margin-top:-1px"><span style="color:#409EFF">{{$t(`message.index_base_aep_protocol`)}}</span>
        </el-link>
      </el-checkbox>
    </div>
  </div>
</template>

<script>
    import $ from 'jquery'
    import storageUtil from '../../../utils/storageUtil'
    import promptUtil from '../../../utils/promptUtil'
    import {qs,getSchoolDueInfo,createCourseOrder} from '../../../api/api'
    import '../../../api/restfulapi'
    export default {
        name: "orderTable",
        props:{
            tableDetail:{
                type: Object,
                default:function(){
                    return {
                        tableData:[],schoolName:'--',totalPrice:'',agree:true,orderId:''
                    }
                }
            },
            type: {  // true 确认订单  false 订单详情
                type:Boolean,
                default: false,
            }
        },
        data(){
            return{
                callUs:{tel:'',img:''},
                isPay: false,
                btnLoading:false,
                agree:true,
            }
        },
        mounted(){
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
            onClickUserAgreement(){
                this.$emit('protocol', true)
            },
            handleClickPay(){
                this.btnLoading = true
                const data = {course: []}
                this.tableDetail.tableData.map(item=>{
                    const obj = {id:item.id,money:item.price,date_num:12, date_type:'month'}
                    data.course.push(obj)
                })
                createCourseOrder(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    money: this.tableDetail.totalPrice,
                    data: JSON.stringify(data),
                    text:'开通课程包',
                })).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        $('#course_step_3').removeClass('step-wait').addClass('step-finish')
                        $('#course_step_4').removeClass('step-wait').addClass('step-finish')
                        this.btnLoading = false
                        this.isPay = true
                    }
                    this.btnLoading = false
                }).catch(err=>{
                    this.btnLoading = false
                })
            },
        }
    }
</script>

<style scoped>
  .header-wrapper{
    display:flex;
    align-items:center;
    font-family:PingFangSC,"Microsoft Yahei",Helvetica,Tahoma,Arial,"Hiragino Sans GB","Hiragino Sans GB W3",STXihei,STHeiti,Heiti,SimSun,sans-serif!important;
  }
  .school-title{
    flex:1;
    color:#353535;
    font-size: 16px;
    margin: 20px 0 20px 0;
  }
  .order-title{
    flex:1;
    display:flex;
    justify-content:flex-end;
    font-size: 14px;
    color: #888888;
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
