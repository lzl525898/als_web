<template>
  <div>
    <!-- 面包屑 -->
<!--    <el-row>-->
<!--      <el-col :span="24">-->
<!--        <div class="grid-content bg-purple-dark">-->
<!--          <el-breadcrumb separator="/">-->
<!--            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>-->
<!--            <el-breadcrumb-item :to="{ path: '/cooperate' }">双师教学</el-breadcrumb-item>-->
<!--            <el-breadcrumb-item :to="{ path: '/cooperateList/'+$store.state.currentCoursePackageId }">课程目录-->
<!--            </el-breadcrumb-item>-->
<!--            <el-breadcrumb-item>课程详情</el-breadcrumb-item>-->
<!--          </el-breadcrumb>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <!-- 面包屑 -->
    <el-card>

      <div v-if="showContent">
        <div id="video" style="width:60%;height:100%;margin: 0 auto;"></div>
        <el-steps :active="active" align-center style="margin-top: 50px">
<!--          <span class="el-icon-d-arrow-left preIcon" @click="preIconClick"></span>-->
          <el-step :title="item.title" :description="item.description" v-for="(item,index) in stepsInformation"
                   :key="index"  @click.native="handItemStepClick(index)" style="cursor: pointer">

<!--            handItemStepClick(active)-->
          </el-step>
<!--          <span class="el-icon-d-arrow-right nextIcon" @click="nextIconClick"></span>-->
        </el-steps>
      </div>
      <div style="text-align: center" v-if="nodata">暂无数据</div>
    </el-card>

  </div>
</template>
<script>
    import {ckplayer} from "../../../../static/ckplayer/ckplayer/ckplayer";
    import $ from "jquery";
    import PubSub from "pubsub-js";
    import '../../../api/restfulapi';
    import promptUtil from "../../../utils/promptUtil";
    import vuexUtils from "../../../utils/vuexUtils";
    import childHeader from '../../component/childHeader'
    import {
        qs,
        getDoubleListShow
    } from "../../../api/api";
    import storageUtil from "../../../utils/storageUtil";

    export default {
        components:{"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name:vuexUtils.checkMenuExist(this,'cooperate').target.name,to:'/cooperate'},{name:'课程目录',to:'/cooperateList/'+this.$store.state.currentCoursePackageId},{name:'课程详情',to:''}],
                active: 1,
                newActive:1,
                stepsInformation: [],
                videoObject: null,//视频对象
                playerObj: null,//new视频对象
                videoArry: [],
                showContent:true,
                nodata:false
            }
        },
        mounted() {
            PubSub.publish("currentMenuIndex", "/cooperate");
            this.nodata=false
            if (this.active == 1) {
                $(".preIcon").css({"color": "#eee", "cursor": "not-allowed"})
            }
            getDoubleListShow(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                cooperate_id: this.$route.params.id
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        this.videoArry = res.data.video
                        this.stepsInformation = []
                        res.data.video.forEach(item => {
                            const obj = {
                                title: item.title,
                                description: item.con,
                            }
                            this.stepsInformation.push(obj)
                        })
                        this.currentCkplayer(this.active)
                    }
                } else if (res.code == ERROR_CODE) {
                    promptUtil.error(this, res.msg)
                } else {
                    promptUtil.wait(this)
                }
            }).catch(err => {
                promptUtil.LOG('getSystematicStatistics-err', err)
            })
        },
        methods: {
            handItemStepClick(val){
                console.log("val",val)
                this.active=val+1
                this.currentCkplayer( this.active)
            },
            currentCkplayer(active) {
                if(this.videoArry.length!=0){
                    // console.log("this.videoArry",this.videoArry[0].image)
                    this.videoObject = {
                        container: "#video", //容器的ID或className
                        variable: "player", //播放函数名称
                        loop: true, //播放结束是否循环播放
                        flashplayer: false,
                        // poster: this.videoImg, //封面图片
                        poster: this.videoArry[active - 1].image,
                        debug: false, //是否开启调试模式
                        drag: "start", //拖动的属性
                        seek: 0, //默认跳转的时间
                        //video: [[this.videoUrl, "video/mp4"]]
                        video: [[this.videoArry[active - 1].video, "video/mp4"]]
                    };
                    this.playerObj = new window.ckplayer(this.videoObject);
                    this.playerObj != null ? this.playerObj.videoPause() : this.playerObj; // 切换页面后停止播放
                }else{
                    this.showContent=false
                    this.nodata=true

                }
            },
        }

    }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #eee;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;

  }

  .preIcon, .nextIcon {
    text-align: center;
    font-size: 30px;
    cursor: pointer;
    /*border: 1px solid #409EFF;*/
    padding-top: 30px;
    /*height: 22px;*/
    /*color: #00a2ff;*/
    width: 22px;
    /*background-color: #00a2ff;*/
    /*opacity: 0.6;*/
    /*color: #fff;*/
    /*border-radius: 50%;*/
    color: #00a2ff;
    /*color: #C0C4CC;*/

  }

  /*.preIcon:active,.preIcon:hover{*/
  /*     color: #00a2ff;*/
  /*   }*/
  /*.nextIcon:active,.nextIcon:hover{*/
  /*  color: #00a2ff;*/
  /*}*/

  .el-step__icon.is-text{
    cursor: pointer !important;
  }
</style>
