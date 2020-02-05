<template>
  <div class="work-wrapper">
    <el-card shadow="always" :body-style="{ padding: '0px', borderRadius: '8px', background: '#fffdf7', width: '205px'}">
      <div style="border:none;border-top-left-radius:8px;border-top-right-radius:8px;">
        <div class="scale-works-wrapper" @click="onClickIntoDetail">
          <img class="scale-works-image base-img" :src="imgUrl">
        </div>
        <el-tooltip class="item" effect="dark" :content="content" placement="top">
          <div class="works-desc">{{content}}</div>
        </el-tooltip>
        <div class="works-handle">
          <div class="works-handle-item" @click="onClickPraise">
            <img :src="praise==1 ? praiseOk :praiseNo"/>
            <span>{{praiseCount}}</span>
          </div>
          <div class="works-handle-item">
            <i class="el-icon-view"></i><span>{{seeCount}}</span></div>
        </div>
        <div class="dotted-line"></div>
      </div>
      <div class="works-user-wrapper" @click="onClickIntoDetail">
        <el-avatar :src="avatar" style="width:40px;height:40px"></el-avatar>
        <el-tooltip class="item" effect="dark" :content="userName" placement="top">
          <div class="student-name">{{userName}}</div>
        </el-tooltip>
      </div>
    </el-card>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js'
  import '../../../router/router'
  import storageUtil from '../../../utils/storageUtil'
  import promptUtil from '../../../utils/promptUtil'
  import '../../../api/restfulapi'
  import {
    qs,
    likeOperation
  } from '../../../api/api'
  export default {
    name: "workItem",
    props:{
      worksUrl: {
        type:String,
        default:'',
      },
      avatar: {
        type:String,
        default:'',
      },
      imgUrl: {
        type:String,
        default:'',
      },
      content: {
        type:String,
        default:'',
      },
      userName: {
        type:String,
        default:'',
      },
      seeCount: {
        type: Number,
        default: 0,
      },
      praiseCount: {
        type: Number,
        default: 0,
      },
      praise: {
        type: Number,
        default: 0,
      },
      worksId: {
        type:Number,
        default: 0,
      },
    },
    data(){
      return{
        praiseNo: require('../../../assets/discover/praise-no.png'),
        praiseOk: require('../../../assets/discover/praise-ok.png'),
        workUrl:'',
        stuUrl: 'this.stuUrl',
      }
    },
    mounted(){
      this.workUrl = ROUTER_INDEX_WORKS+'/' + this.worksId
    },
    methods:{
      onClickPraise(){
        if(storageUtil.getLoginStatus()==1){
          likeOperation(qs.stringify({
            scratch_id: this.worksId,
            user_id: storageUtil.readTeacherInfo().id
          })).then(res=>{
            this.praise = this.praise==1 ? 0 : 1
            if(this.praise==1){
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
      onClickIntoUser(){
        console.log("this.stuUrl",this.stuUrl)
      },
      onClickIntoDetail(){
        this.$router.push({path:this.workUrl})
        // const {href} = this.$router.resolve({path: this.workUrl})
        // window.open(href, '_blank')
      },
    }
  }
</script>

<style scoped>
  .work-wrapper{
    width:205px;
  }
  .work-wrapper:hover{
    cursor: pointer;
  }
  .student-name{
    font-size: 13px;
    margin-left:5px;
    width:130px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
  .works-user-wrapper{
    margin-left:5px;
    display:flex;
    align-items:center;
    height: 50px;
  }
  .dotted-line{
    border:1px dashed #ccc;
  }
  .works-handle{
    margin-bottom:10px;
    padding-left:10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .works-handle-item{
    font-size:12px;
    width:60px;
  }
  .works-handle-item span{
    margin-left: 5px;
  }
  .works-desc{
    text-align: center;
    width: 200px;
    padding:5px 5px 5px 2px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
  .base-img{
    object-fit: scale-down;
  }
  .scale-works-wrapper{
    border:none;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
    width: 205px;
    height: 170px;
  }
  .scale-works-image{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 205px;
    height: 170px;
    transition: width 1s, height 1s;
    -moz-transition: width 1s, height 1s, -moz-transform 1s; /* Firefox 4 */
    -webkit-transition: width 1s, height 1s, -webkit-transform 1s; /* Safari and Chrome */
    -o-transition: width 1s, height 1s, -o-transform 1s; /* Opera */
  }
  .scale-works-image:hover{
    transform: scale(1.1);
    -webkit-transform: scale(1.1); /*兼容-webkit-引擎浏览器*/
    -moz-transform: scale(1.1); /*兼容-moz-引擎浏览器*/
  }
</style>
