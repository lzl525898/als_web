<template>
  <div>
    <div class="mainContainer">
      <als-header/>
      <div style="display:flex;justify-content:center">
        <div style="width:1200px;margin-top: 30px">
          <div style="display:flex">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/discover' }">作品中心</el-breadcrumb-item>
              <el-breadcrumb-item>{{workName}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="margin-top:30px;">
            <div style="display: flex;">
              <div style="height: 24px;width: 3px;background-color: #00a2ff;"></div>
              <div style="line-height:24px;margin-left:5px;font-size:18px;font-weight:700">{{workName}}</div>
            </div>
            <div style="display:flex;align-items:center;margin-top:10px;">
              <el-avatar :src="avatar" style="width:40px;height:40px"></el-avatar>
              <div style="margin-left:10px;font-size:13px">{{userName}}</div>
              <div style="margin-left:10px;color:#666;font-size:13px">发布于:<span style="margin-left:5px">{{republishTime}}</span></div>
              <div style="margin-left:10px;color:#666;font-size:13px">更新于:<span style="margin-left:5px">{{updateTime}}</span></div>
              <div style="margin-left:20px;color:#666;font-size:13px">
                <i class="el-icon-view"></i><span style="margin-left:5px">{{seeCount}}</span></div>
            </div>
            <div style="color:#666;font-size:13px;margin-top:10px">如果没有出现，可能项目较大，请耐心等待一会儿</div>
            <el-row :gutter="20" style="margin-top:20px">
              <el-col :span="15">
                <div style="border:none;position:relative">
                  <div v-show="scratchLoading" style="z-index:100;width:640px;height:480px;position:absolute;display:flex;justify-content:center;align-items:center;color:#c3c3c3;border:1px solid #ccc">
                    <div style="width:80%">
                      <el-progress :text-inside="true" :stroke-width="40" :percentage="percentage"></el-progress>
                    </div>
                  </div>
                  <iframe id="worksIframe" :src=workUrl width="640" height="480" scrolling="no" frameborder="0" align="center" style="z-index:50"></iframe>
                </div>
              </el-col>
              <el-col :span="9">
                <div style="display: flex;align-items: center;">
                  <div class="classTitleCircle"></div>
                  <div style="font-weight:bold">作品简介</div>
                </div>
                <div style="height: 100px;margin-left:8px">
                  <el-tooltip class="item" effect="dark" :content="workDesc" placement="bottom">
                    <div class="text-wrapper">{{workDesc}}</div>
                  </el-tooltip>
                </div>
                <div style="display: flex;align-items: center;">
                  <div class="classTitleCircle"></div>
                  <div style="font-weight:bold">操作说明</div>
                </div>
                <div style="height: 100px;margin-left:8px">
                  <el-tooltip class="item" effect="dark" :content="handleInfo" placement="bottom">
                    <div class="text-wrapper">{{handleInfo}}</div>
                  </el-tooltip>
                </div>
                <div style="display: flex;align-items: center;">
                  <div class="classTitleCircle"></div>
                  <div style="font-weight:bold">类别</div>
                </div>
                <div style="height:100px;margin-top:10px;margin-left:18px">
                  <el-tag v-for="(obj,index) in category" :key="index" class="tag-item">{{obj}}</el-tag>
                </div>
                <div style="position:relative">
                  <div class="lookScratch" @click="onClickIntoScratch">查看积木</div>
                  <div style="height: 30px;border-radius: 10px;background-color: #ff7800;width:130px;position:absolute;top:29px;z-index:20"></div>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-divider></el-divider>
          <div style="display:flex;margin-bottom: 20px">
            <div class="works-handle-item" @click="onClickPraise">
              <img :src="praise? praiseOk :praiseNo" style="width: 20px;height:20px;"/>
              <span>{{praiseCount}}</span>
            </div>
            <div style="margin-top:2px;display:flex;">
              <div style="margin-top:-1px">分享到:</div>
              <el-popover placement="right-start" width="200" trigger="hover">
                <img slot="reference" :src="weixin" style="width:20px;height:20px;margin-left:5px"/>
                <als-qr slot :text="shareUrl" :logoSrc="require('../../../static/images/base/logo.jpg')" colorDark="#000" colorLight="#fff" :margin="0" :logoScale="0.4" :size="200"/>
              </el-popover>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-start;align-items:baseline">
            <div class="commentTitle">评论区</div>
            <div v-if="!isShowLoginLabel" style="font-size:13px;color:#777"><el-link :underline="false" @click="onClickUserLogin"><span style="color:#4caf50">登录</span></el-link>之后才能评论哦</div>
          </div>
          <div v-show="isShowLoginLabel" style="border-radius:5px;padding: 20px;border:1px solid #E4E7ED;margin-bottom: 30px">
            <als-comment :worksId="scratchId*1"/>
          </div>
        </div>
      </div>
    </div>
    <als-footer/>
  </div>
</template>

<script>
  import vueQr from "vue-qr"
  import PubSub from "pubsub-js"
  import alsHeader from '../../components/component/header'
  import alsFooter from '../../components/component/footer'
  import alsWorkItem from '../../components/component/discover/workItem'
  import alsComment from '../../components/component/commentComponent'
  import storageUtil from '../../utils/storageUtil'
  import promptUtil from '../../utils/promptUtil'
  import '../../router/router'
  import '../../api/restfulapi'
  import {
    qs,
    likeOperation,
    getScratchDetail
  } from '../../api/api'
  export default {
    components:{'als-header':alsHeader,'als-footer':alsFooter,'als-work-item':alsWorkItem,'als-qr':vueQr,"als-comment":alsComment},
    name: "alsWorks",
    data(){
      return{
        intervalId:null,
        scratchId:0,
        weixin: 'data:image/png;base64,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',
        praise:false,isShowLoginLabel:false,praiseCount:0,shareUrl:'',
        praiseOk: require('../../assets/discover/praise-ok.png'),praiseNo: require('../../assets/discover/praise-no.png'),
        sb3Value:'', workUrl:'', workName:'', category:[], userName:'',scratchLoading:true,seeCount:0,
        republishTime:'', updateTime:'', workDesc:'', handleInfo:'', avatar: '',percentage:0,
      }
    },
    destroyed(){
      clearInterval(this.intervalId)
      this.intervalId = null
    },
    mounted() {
      this.scratchId = this.$route.params.id
      // 订阅弹出登录框的消息
      PubSub.subscribe("showUserLoginStatusMsg", (msg, data) => {
        this.isShowLoginLabel = data
      });
      // 订阅刷新scratch作品页面数据
      PubSub.subscribe("updateScratchWorksDetail", (msg, data) => {
        this.getScratchDetailData()
      });
      if(storageUtil.getLoginStatus()==1){
        this.isShowLoginLabel = true
      }
      this.listenLoginStatus()
      this.getScratchDetailData()
    },
    methods:{
      listenLoginStatus(){ // 监听是否为登录状态
        this.intervalId = setInterval(()=>{
          if(storageUtil.getLoginStatus()!=1){
            this.isShowLoginLabel = false
          }else{
            this.isShowLoginLabel = true
            PubSub.publish("changeUserLoginStatus")
          }
        },1000)
      },
      getScratchDetailData(){
        const userId = storageUtil.readTeacherInfo() ? storageUtil.readTeacherInfo().id : 0
        getScratchDetail(qs.stringify({
          scratch_id: this.scratchId,
          user_id: userId,
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.seeCount = res.data.seeCount
              this.praise = res.data.praise==1 ? true : false
              this.praiseCount = res.data.praiseCount
              this.workDesc = res.data.workDesc
              this.handleInfo = res.data.handleInfo
              this.republishTime = res.data.republishTime
              this.updateTime = res.data.updateTime
              this.userName = res.data.userName
              this.workName = res.data.workName
              this.avatar = res.data.avatar
              this.sb3Value = res.data.worksUrl
              this.category = res.data.category
              this.shareUrl = res.data.shareUrl
              // if(global.DEBUG){
              //   this.workUrl = "https://www.alsrobot.vip/scratch/player.html?id=1572485356DWBMY0JM&edit=false&look=true"
              // }else{
              //
              // }
              this.workUrl = 'https://www.alsrobot.vip/scratch/player.html?id='+this.sb3Value+'&edit=false&look=true'
              for(let i=0;i<100;i++){
                setTimeout(()=>{
                  this.percentage = this.percentage + 1
                },10*i)
              }
              let $dom = document.getElementById("worksIframe")
              let that = this
              if ($dom) {
                if ($dom.attachEvent) {
                  $dom.attachEvent("onload", function () {
                    that.scratchLoading = false
                  });
                } else {
                  $dom.onload = function () {
                    that.scratchLoading = false
                  };
                }
              }
            }else{
              this.$router.replace({path:ROUTER_INDEX_DISCOVER})
            }
          }else{
            this.$router.replace({path:ROUTER_INDEX_DISCOVER})
          }
        }).catch(err=>promptUtil.LOG('getScratchDetail-err',err))
      },
      onClickUserLogin(){
        if(storageUtil.getLoginStatus()!=1){
          PubSub.publish("showUserLoginDialog", "show")
        }
      },
      onClickIntoScratch(){
        if(storageUtil.getLoginStatus()==1){ // 登录
          let url
          // if(global.DEBUG){
          //   url = "http://192.168.1.177:9527/creater/index.html" + "?id=" + this.sb3Value + "&edit=false"
          // }else{
          //   url = ROUTER_SCRATCH_CREATE + "?id=" + this.sb3Value + "&edit=false"
          // }
          url = ROUTER_SCRATCH_CREATE + "?id=" + this.sb3Value + "&edit=false"
          window.open(url)
        }else{
          PubSub.publish("showUserLoginDialog", "show")
        }
      },
      onClickPraise(){
        if(storageUtil.getLoginStatus()==1){
          likeOperation(qs.stringify({
            scratch_id: this.scratchId,
            user_id: storageUtil.readTeacherInfo().id
          })).then(res=>{
            this.praise = !this.praise
            if(this.praise){
              this.praiseCount = this.praiseCount+1
            }else{
              this.praiseCount = this.praiseCount-1
            }
            promptUtil.LOG('msg',res.msg)
          }).catch(err=>promptUtil.LOG('likeOperation-err',err))
        }else{
          PubSub.publish("showUserLoginDialog", "show")
        }
      },
    }
  }
</script>

<style scoped>
  .works-handle-item{
    font-size:16px;
    width:60px;
  }
  .works-handle-item:hover{
    cursor: pointer;
  }
  .mainContainer {
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0;
    font-family: 'syRegular';
  }
  .classTitleCircle {
    height: 8px;
    width: 8px;
    border-radius: 8px;
    background-color: #00a2ff;
    margin-right: 10px;
  }
  .text-wrapper{
    width:400px;
    overflow:hidden;
    display: -webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    margin:10px 0 10px 10px
  }
  .tag-item{
    margin-right: 10px;
  }
  .tag-item:hover{
    cursor: pointer;
  }
  .lookScratch{
    top:0px;
    z-index:30;
    position: absolute;
    background-color: #ffba02;
    border-radius: 10px;
    text-align: center;
    padding: 15px;
    height: 22px;
    width: 100px;
    color: #333;
    font-weight: 700;
    font-size: 14px;
    line-height: 1.42857143;
  }
  .lookScratch:hover{
    top:3px;
    cursor: pointer;
  }
  .commentTitle{
    color: #1f88e5;
    font-size: 24px;
    font-weight: 300;
    margin-right: 10px;
    margin-bottom: 20px;
  }
</style>
