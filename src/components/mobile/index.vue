<template>
    <div class="mobile-index-wrapper">
      <div class="mobile-index-banner-box" :style="{width:imgWidth+'px',height:imgWidth+'px'}">
        <div class="mobile-index-banner-title">奥松<span>云课堂</span>(AEP)</div>
        <div class="mobile-index-banner-desc">智慧管理  |  智慧教学  |  智慧测评</div>
      </div>
      <div class="mobile-index-desc-box-1">
        <div class="mobile-index-title">我们能做什么?</div>
        <div class="mobile-index-base-line"></div>
        <div style="background-color: #06affa;margin-top:12px">
          <div class="mobile-index-do-wrapper-1" :style="{width:imgWidth+'px',height:imgWidth+'px'}">
            <div :style="{paddingTop:(imgWidth/4)+'px'}">
              <span class="mobile-index-do-title" >校长端</span>
            </div>
            <div class="mobile-index-do-label">智慧管理</div >
            <p class="mobile-index-do-line">----------------------</p>
            <div class="mobile-index-do-content">操作便捷的教务管理<br>推广引流入口，招生获客工具</div>
          </div>
        </div>
        <div style="background-color: #5fb5dd;">
          <div class="mobile-index-do-wrapper-2" :style="{width:imgWidth+'px',height:imgWidth+'px'}">
            <div :style="{paddingTop:(imgWidth/4)+'px'}">
              <span class="mobile-index-do-title" >教师端</span>
            </div>
            <div class="mobile-index-do-label">智慧教学</div >
            <p class="mobile-index-do-line">----------------------</p>
            <div class="mobile-index-do-content">丰富的精品课程资源<br>轻松备课省时省力</div>
          </div>
        </div>
        <div style="background-color: #06affa;">
          <div class="mobile-index-do-wrapper-3" :style="{width:imgWidth+'px',height:imgWidth+'px'}">
            <div :style="{paddingTop:(imgWidth/4)+'px'}">
              <span class="mobile-index-do-title" >学生/家长端</span>
            </div>
            <div class="mobile-index-do-label">智慧评测</div >
            <p class="mobile-index-do-line">----------------------</p>
            <div class="mobile-index-do-content">多维度成长轨迹<br>基于微信生态的家校服务平台</div>
          </div>
        </div>
      </div>
      <div class="mobile-index-desc-box-2">
        <div class="mobile-index-title">产品亮点</div>
        <div class="mobile-index-base-line"></div>
        <div class="mobile-index-point-wrapper" v-for="(produce,pIndex) in produceData" :key="pIndex">
          <img :src="produce.img" alt=""/>
          <div class="mobile-index-point-content">
            <div class="mobile-index-point-content-title">{{produce.title}}</div>
            <div class="mobile-index-point-content-desc" :style="{width:(imgWidth-70)+'px'}">{{produce.con}}</div>
          </div>
        </div>
      </div>
      <div class="mobile-index-page">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(course,cIndex) in coursesData" :key="cIndex">
            <div>
              <div style="display: flex;justify-content: center;" v-show="cIndex==2">
                <img :src="course.img" :style="{height:(imgWidth/2.3)+'px',width:(imgWidth-50)+'px',objectFit:'ontain',margin:'auto'}"/>
              </div>
              <img :src="course.img" :style="{width:(imgWidth-20)+'px',objectFit:'ontain'}" v-show="cIndex!=2"/>
              <div style="display:flex;">
                <div style="display:flex;padding: 20px">
                  <div style="background-color:#409EFF;width:3px;height:24px"/>
                  <div style="margin-left:5px;font-size:20px">{{course.title}}</div>
                </div>
              </div>
              <div style="font-size:12px;color:#999">{{course.con}}</div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="mobile-index-apply">
        <div class="mobile-index-apply-title">体验教育数字化新升级</div>
        <div class="mobile-index-apply-title">申请免费试用</div>
        <div class="mobile-index-apply-btn-wrapper">
          <div class="mobile-index-apply-btn" @click="applyDialogVisible=true">快速申请试用</div>
        </div>
      </div>
      <div class="mobile-index-footer">
        <div style="font-size:14px;font-weight:600">全球数字化教学教研服务平台</div>
        <el-divider/>
        <el-link :underline="false" href="http://www.beian.miit.gov.cn" target="_blank" style="color:#909090">
          奥松智能 ｜ 粤ICP备19107383号-1
        </el-link>
      </div>
      <el-dialog :model="applyForm" :visible.sync="applyDialogVisible" width="90%" @close="closeApplyDialog">
        <div style="margin-top:-30px;padding-left:10px;padding-right:10px">
          <div style="font-size:20px;text-align: center;margin-bottom:20px">申请试用</div>
          <el-form :model="applyForm" :rules="applyRule" ref="applyRuleForm">
            <el-form-item prop="school">
              <el-input prefix-icon="el-icon-s-shop" v-model="applyForm.school" size="small" placeholder="输入学校/机构"></el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input prefix-icon="el-icon-user-solid" v-model="applyForm.name" size="small" placeholder="输入联系人"></el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <el-input prefix-icon="el-icon-phone" v-model.number="applyForm.phone" size="small" placeholder="输入电话"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" style="width:100%;" :loading="isLoading" @click="handleClickSubmit">提 交</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import {qs,getViewIndexInformationGet,indexForm} from '../../api/api'
    import '../../api/restfulapi'
    export default {
        name: "index",
        data(){
            return {
                imgWidth:0,
                produceData:[],
                coursesData:[],
                isLoading:false,
                applyDialogVisible:false,
                applyForm:{name:'',school:'',phone:''},
                applyRule: {
                    school:[
                        {required: true, message: '请输入机构/学校', trigger: 'blur'},
                    ],
                    name:[
                        {required: true, message: '请输入联系人', trigger: 'blur'},
                    ],
                    phone:[
                        {required: true, message: '请输入电话', trigger: 'blur'},
                        { type: 'number', message: '电话必须为数字'}
                    ],
                }
            }
        },
        created(){
            this.imgWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        },
        mounted() {
            getViewIndexInformationGet().then(res=>{
                if(res.code==SUCCESS_CODE){
                    this.produceData = res.data.produceData
                    this.coursesData = res.data.coursesData
                }
            }).catch(err=>console.log('getViewIndexInformation-err',err))
        },
        methods: {
            closeApplyDialog(){
                this.applyForm = {name:'',school:'',phone:''}
                this.$refs['applyRuleForm'].resetFields();
            },
            handleClickSubmit(){
                this.$refs['applyRuleForm'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true
                        indexForm(qs.stringify({
                            name: this.applyForm.name,
                            phone: this.applyForm.phone,
                            schoolName: this.applyForm.school,
                            studentNum: 300,
                            address: '',
                        })).then(res => {
                            if(res.code==SUCCESS_CODE){
                                this.$message({
                                    message: '提交成功，我们会尽快联系您！',
                                    type: 'success'
                                });
                            }else{
                                this.$message({
                                    message: res.msg,
                                    type: 'warn'
                                });
                            }
                            this.isLoading = false
                            this.applyDialogVisible = false
                        }).catch(err=>{
                            this.isLoading = false
                            this.applyDialogVisible = false
                        })
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style scoped>
  .mobile-index-wrapper{
    box-sizing: border-box;
  }
  .mobile-index-banner-box{
    box-sizing: border-box;
    background: url("../../../static/images/mobile/banner-m.png") no-repeat center;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
  }
  .mobile-index-banner-title{
    padding-top: 12px;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color:#777778;
  }
  .mobile-index-banner-title span{
    color:#31A4FA;
  }
  .mobile-index-banner-desc{
    padding-top: 8px;
    text-align: center;
    font-size: 14px;
    color: #555555;
  }
  .mobile-index-desc-box-1{
    box-sizing: border-box;
    background-color: #ecf8ff;
    width: 100%;
  }
  .mobile-index-desc-box-2{
    box-sizing: border-box;
    background: url("../../../static/images/base/newestIndex/produtBg.png") center;
    width: 100%;
    padding-bottom: 30px;
  }
  .mobile-index-title{
    padding: 12px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #777778;
  }
  .mobile-index-base-line{
    width:30px;
    height:2px;
    background-color:#047FD8;
    margin:auto;
  }
  .mobile-index-do-wrapper-1{
    text-align: center;
    box-sizing: border-box;
    background: url("../../../static/images/base/newestIndex/doIt_1.png") no-repeat center;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
  }
  .mobile-index-do-wrapper-2{
    text-align: center;
    box-sizing: border-box;
    background: url("../../../static/images/base/newestIndex/doIt_2.png") no-repeat center;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
  }
  .mobile-index-do-wrapper-3{
    text-align: center;
    box-sizing: border-box;
    background: url("../../../static/images/base/newestIndex/doIt_3.png") no-repeat center;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
  }
  .mobile-index-do-title{
    background-color: #FFF;
    border-radius: 4px;
    padding: 4px 15px;
    font-size: 24px;
    color: #0E94D7;
  }
  .mobile-index-do-label{
    text-align: center;
    padding-top: 30px;
    color:#FFF;
    font-size: 24px;
  }
  .mobile-index-do-line{
    color:#FFF;
  }
  .mobile-index-do-content{
    text-align: center;
    color:#FFF;
    font-size: 16px;
  }
  .mobile-index-point-wrapper{
    margin-top: 8px;
    display:flex;
    align-items:center;
    height:60px;
  }
  .mobile-index-point-wrapper img{
    width:44px;
    height:44px;
    margin-left:8px;
    margin-right:8px
  }
  .mobile-index-point-content{
    display:flex;
    flex-direction:column;
  }
  .mobile-index-point-content-title{
    color:#333;
    font-size:20px;
    font-weight:bold;
  }
  .mobile-index-point-content-desc{
    color:#333;
    font-size:14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mobile-index-page {
    padding: 20px 10px 0 10px;
    background-color: #F7F7F7;
  }
  .mobile-index-footer {
    background: -moz-linear-gradient(top, #E4E7ED 0%, #ffffff 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#E4E7ED), color-stop(100%,#ffffff));
    background: -webkit-linear-gradient(top, #E4E7ED 0%,#ffffff 100%);
    background: -o-linear-gradient(top, #E4E7ED 0%,#ffffff 100%);
    background: -ms-linear-gradient(top, #E4E7ED 0%,#ffffff 100%);
    background: linear-gradient(to bottom,#E4E7ED 0%,#ffffff 100%);
    text-align: center;
    color: #909090;
    font-size: 14px;
    padding: 20px;
  }
  .mobile-index-apply{
    padding: 20px;
    background-color: #EDFBFF;
  }
  .mobile-index-apply-title{
    padding: 10px;
    text-align: center;
    font-size:24px;
    color: #62a2fd;
  }
  .mobile-index-apply-btn-wrapper{
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mobile-index-apply-btn{
    box-sizing: border-box;
    text-align: center;
    line-height: 40px;
    font-weight: 500;
    background-color: #409EFF;
    color: #FFF;
    height: 40px;
    width: 150px;
    border-radius: 40px;
  }
  .mobile-index-apply-btn:hover{
    background-color: #00A0E9;
  }
  .mobile-index-apply-btn:active{
    background-color: #00A0E9;
  }
</style>
