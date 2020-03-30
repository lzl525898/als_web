<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="660px"
    >
    <div slot="title" class="dialog-header">课程详情</div>
    <el-dialog
      width="660px"
      :visible.sync="innerVisible"
      append-to-body>
      <div slot="title" class="dialog-header">试看课程</div>
      <div style="margin-top: -20px;border-top: 1px solid #EBEEF5;padding-top:5px;height:445px">
        <el-tabs v-model="innerDialog.activeName">
          <el-tab-pane label="课件" name="1" v-if="innerDialog.courseWare.label&&innerDialog.courseWare.label!=''">
            <div style="height:400px;overflow-y:auto;overflow-x:hidden">
              <div class="loadingPPtBox">
                <img src="../../../../static/images/base/loading.gif" alt="" id="loadingPPt"></div>
              <iframe id="trialIframe" :src="innerDialog.courseWare.url"
                      style="border:1px solid #aabbcc;width:620px;height:390px"
                      allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="教案" name="2" v-if="innerDialog.lesson.label&&innerDialog.lesson.label!=''">
            <div style="height:400px;overflow-y:auto;overflow-x:hidden">
              <pdf v-for="i in numPages" :key="i" :src="innerDialog.lesson.url" :page="i"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="视频" name="3" v-if="innerDialog.videos[0].label&&innerDialog.videos[0].label!=''">
            <div style="height:400px;display:flex;justify-content:center;flex-direction:column;">
              <div id="video" style="width:100%;height:100%;margin: 0 auto;"/>
              <el-steps :active="innerDialog.stepActive" align-center style="margin-top:20px">
                <el-step :title="item.title" v-for="(item,index) in innerDialog.videos" :key="index"
                         @click.native="handleClickStep(index)" style="cursor: pointer;"></el-step>
              </el-steps>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <div>
      <div class="base-btn btn-advice" style="position:absolute;right:20px;bottom:20px;width:132px" @click="handleClickTrip">试看</div>
      <div class="flex-row-wrapper" style="margin-top: -20px;border-top: 1px solid #EBEEF5;padding-top: 20px">
        <img class="course-cover" :src="detail.imgUrl"/>
        <div class="flex-column-wrapper">
          <el-tooltip class="item" effect="dark" :content="detail.firstName" placement="right-start">
            <div class="title-content title-first">{{detail.firstName}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="detail.secondName" placement="right-start">
            <div class="title-content title-second">{{detail.secondName}}</div>
          </el-tooltip>
          <div class="course-price">
            ￥{{detail.price}}/年
          </div>
          <div class="flex-row-wrapper">
            <div class="base-btn btn-buy" @click="handleClick">立即开通</div>
            <el-popover
              placement="bottom"
              width="150"
              trigger="click">
              <div>
                <img :src='detail.callUs.img' alt="" style="width: 150px">
                <p style="text-align: center">{{detail.callUs.tel}} </p>
              </div>
              <div slot="reference" class="base-btn btn-advice" style="margin-left:15px"><i class="el-icon-service"/><span style="margin-left: 5px">咨询</span></div>
            </el-popover>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px">
        <div class="detail-item" style="align-items:baseline">
          <div class="detail-item-label">课程简介:</div>
          <el-tooltip effect="dark" :content="detail.desc" placement="top-start">
            <div class="detail-item-value">{{detail.desc}}</div>
          </el-tooltip>
        </div>
        <div class="detail-item" style="align-items:baseline">
          <div class="detail-item-label">所需教具:</div>
          <el-tooltip effect="dark" :content="detail.training" placement="top-start">
            <div class="detail-item-value">{{detail.training}}</div>
          </el-tooltip>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">难度等级:</div>
          <el-tooltip effect="dark" :content="detail.level" placement="top-start">
            <div class="detail-item-value">{{detail.level}}</div>
          </el-tooltip>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">学龄段:</div>
          <el-tooltip effect="dark" :content="detail.ageStage" placement="top-start">
            <div class="detail-item-value">{{detail.ageStage}}</div>
          </el-tooltip>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">课时:</div>
          <div class="detail-item-value">{{detail.classes}}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
    import $ from 'jquery'
    import pdf from "vue-pdf"
    import '../../../../static/ckplayer/ckplayer/ckplayer'
    import {qs,getTrialClassDetail} from '../../../api/api'
    import '../../../api/restfulapi'
    import promptUtil from "../../../utils/promptUtil";
    export default {
        name: "courseDetailDialog",
        components:{'pdf': pdf},
        data(){
            return{
                dialogVisible: false,
                innerVisible:false,
                videoObject: null,
                numPages: 1,
                innerDialog:{
                    stepActive: 1,
                    activeName:'1',
                    courseWare: {label:'',url:''},
                    lesson:{label:'',url:''},
                    videos:[
                        {
                            title: "",
                            video: "",
                            image: ""
                        }]
                },
                detail: {callUs:{img:'',tel:''}}
            }
        },
        mounted(){
            $('#trialIframe').hide();
        },
        updated(){
            $("#loadingPPt").show();
            var $dom = document.getElementById("trialIframe");
            if ($dom) {
                if ($dom.attachEvent) {
                    $dom.attachEvent("onload", function () {
                        $("#loadingPPt").hide();
                        $(".loadingPPtBox").hide();
                        $('#trialIframe').show();
                    });
                } else {
                    $dom.onload = function () {
                        $("#loadingPPt").hide();
                        $(".loadingPPtBox").hide();
                        $('#trialIframe').show();
                    };
                }
            }
            this.currentPlayer(this.innerDialog.stepActive)
            $("#video").css({"width":"100%","height":"100%"})
        },
        mounted(){
        },
        methods: {
            show(detail){
                this.detail = detail
                this.dialogVisible = true
                this.pdfTask(this.innerDialog.lesson.url)
            },
            handleClickTrip(){
                getTrialClassDetail(qs.stringify({
                    course_id:this.detail.id
                })).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        if(res.data.courseWare.label&&res.data.courseWare.label!=''){
                            this.innerDialog.courseWare = res.data.courseWare
                        }
                        if(res.data.lesson.label&&res.data.lesson.label!=''){
                            this.innerDialog.lesson = res.data.lesson
                        }
                        if(res.data.videos&&res.data.videos[0]&&res.data.videos[0].title){
                            this.innerDialog.videos = res.data.videos
                        }
                        this.innerVisible=true
                    }else{
                        promptUtil.warning(this,'无试看内容')
                        this.innerVisible=false
                    }
                }).catch(err=>{
                    this.innerVisible=false
                })
            },
            handleClick(){
                this.$emit('targetCourse', {status:true, price: this.detail.price*1, detail: this.detail})
                this.dialogVisible = false
            },
            pdfTask(pdfUrl){
                if (pdfUrl && pdfUrl != "") {
                    const that = this
                    const loadingTask = pdf.createLoadingTask(pdfUrl)
                    loadingTask.then(pdf => {
                        that.numPages = pdf.numPages
                    }).catch((err) => {
                        console.error('pdf加载失败')
                    })
                }
            },
            handleClickStep(val) {
                this.innerDialog.stepActive = val + 1
                this.currentPlayer(this.innerDialog.stepActive)
            },
            currentPlayer(index) {
                try {
                    window.videoplayerObj != null ? window.videoplayerObj.videoPause() : window.videoplayerObj;
                } catch (e) {}
                if (this.innerDialog.videos.length != 0) {
                    this.videoObject = {
                        container: "#video", //容器的ID或className
                        variable: "player", //播放函数名称
                        loop: false, //播放结束是否循环播放
                        flashplayer: false,
                        poster: this.innerDialog.videos[index - 1].image, //封面图片
                        drag: "start", //拖动的属性
                        seek: 0, //默认跳转的时间
                        video: [[this.innerDialog.videos[index - 1].video, "video/mp4"]]
                    };
                }
                try {
                    // 切换页面后停止播放
                    window.videoplayerObj = new window.ckplayer(this.videoObject);
                    window.videoplayerObj != null ? window.videoplayerObj.videoPause() : window.videoplayerObj;
                } catch (e) {}
            }
        }
    }
</script>

<style scoped>
  .dialog-header{
    width: 430px;
    font-size: 20px;
    font-weight: bold;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .flex-row-wrapper{
    display: flex;
    flex-direction: row;
  }
  .flex-column-wrapper{
    flex:1;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
  }
  .title-content{
    width: 275px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title-first{
    margin-top: 10px;
    font-size: 22px;
    color:#333;
    margin-bottom: 20px;
  }
  .title-second{
    color:#999;
    margin-bottom: 20px;
  }
  .course-price{
    background-color:#dadada;
    border-radius: 3px;
    padding-left: 5px;
    font-size: 22px;
    color: #FB6161;
    height: 40px;
    line-height: 40px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .course-cover{
    width: 330px;
    height: 220px;
    border-radius:5px;
  }
  .base-btn{
    width: 130px;
    height: 44px;
    border: 1px solid #23b8ff;
    border-radius: 5px;
    line-height: 46px;
    font-size: 18px;
    text-align: center;
    vertical-align: middle;
  }
  .btn-buy{
    background-color: #23b8ff;
    color: #fff;
    cursor: pointer;
  }
  .btn-buy:hover{
    color: #fff;
    background-color: #31A4FA;
  }
  .btn-advice{
    display: flex;
    align-items: center;
    justify-content: center;
    color: #23b8ff;
    cursor: pointer;
  }
  .btn-advice:hover{
    color: #31A4FA;
    background-color: #F2F6FC;
  }
  .detail-item{
    color:#333;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .detail-item-label{
    width:72px;
    color: #999;
  }
  .detail-item-value{
    width:530px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-left:10px;
  }
  .loadingPPtBox{
    width:620px;
    height:390px;
  }
  .loadingPPtBox img {
    width: 101%;
    height: 101%;
  }
</style>
