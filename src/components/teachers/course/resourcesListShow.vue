<template>
  <div style="height:100%">
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      style="height:95%"
      class="elContainer"
    >
      <el-tab-pane :label="$t(`message.course_ai_course_ware`)" name="first" v-if="pptUrl&&pptUrl!=''">
        <el-row>
          <el-col :span="24">
            <div class="border_b">
              <h5>{{pptName}}</h5>
            </div>
          </el-col>
        </el-row>
        <div class="coverBox" ref="coverBox" v-show="pptUrl&&pptUrl!=''">
          <div class="loadingPPtBox"><img src="../../../../static/images/base/loading.gif"
                                          alt="" id="loadingPPt"></div>
          <iframe class="ListIframe" id="iframe" :src="pptUrl" style="border:1px solid #aabbcc;max-width: 100%;"
                  allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
          <!-- <iframe id="iframe" src="https://show.zohopublic.com.cn/publish/gfdzn1a008a803acd4c68b0520dc80d63224a/params?toolbar=true&menu=false&loop=true" width="1193" height="707" style="border:1px solid #aabbcc;max-width: 100%;" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe> -->
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t(`message.course_ai_course_plan`)" name="second" v-if="pdfUrl&&pdfUrl!=''">
        <el-row>
          <el-col :span="24">
            <div class="border_b">
              <h5>{{pdfName}}</h5>
            </div>
          </el-col>
        </el-row>
        <!-- 放置品pdf  background-color:blue;-->
        <div>
          <div class="content">
            <div class="my_teachingPlan">
              <pdf
                v-for="i in numPages"
                :key="i"
                :src="pdfUrl"
                :page="i"
                @progress="pdfProgress($event)">
              </pdf>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t(`message.course_ai_course_video`)" name="third" v-if="stepsInformation&&stepsInformation.length!=0" >
        <el-row>
          <el-col :span="24">
            <div class="border_b">
              <h5>{{videoName}}</h5>
            </div>
          </el-col>
        </el-row>
        <div>
          <div style="display: flex;justify-content: center;flex-direction:column;">
            <div id="video" style="width:60%;height:100%;margin: 0 auto;"></div>
            <el-steps :active="stepActive" align-center style="margin-top: 50px">
              <el-step :title="item.title" v-for="(item,index) in stepsInformation" :key="index"
                       @click.native="handItemStepClick(index)" style="cursor: pointer"></el-step>
            </el-steps>
          </div>
        </div>
      </el-tab-pane>
      <div class="nopdfUrlImg" v-if="pptUrl==''&&pdfUrl==''&&stepsInformation.length==0">
        <img :src=noDataUrl alt>
      </div>
    </el-tabs>
  </div>
</template>
<script>

  import PubSub from "pubsub-js";
  //引入pdf
  import pdf from "vue-pdf";
  //引入swiper
  import Swiper from "swiper";
  import "swiper/dist/css/swiper.min.css";
  //引入jquery
  import $ from "jquery";
  import {ckplayer} from "../../../../static/ckplayer/ckplayer/ckplayer";
  import {wheelPlanting} from "../../../../static/js/customSwiper";
  import {play} from "../../../../static/js/customSwiper";
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import vuexUtils from '../../../utils/vuexUtils';
  import '../../../api/restfulapi';
  import {qs, intoCoursesPackageDetailById, trafficStatistics} from "../../../api/api";
  import alspdf from '../../commons/pdf/pdf'
  import childHeader from '../../component/childHeader'
  import customLoading from '../../component/customLoading'
  export default {
    //视频
    name: "Pdf",
    components: {
      'pdf': pdf,
      'als-loading': customLoading,
      'v-pdf': alspdf,
      "als-child-header": childHeader
    },
    data() {
      return {
        routerConfig: [{name: vuexUtils.checkMenuExist(this, 'resources').target.name, to: '/resources'},
            {name: '', to: '/resourcesList/' + this.$store.state.currentCoursePackageId}, {name: '', to: ''}],
        //pdf
        pdfName: "",
        pdfUrl: "",
        copyPdfUrl: "",
        pageNum: 1,
        pageTotalNum: 1,
        pageRotate: 0,
        curPageNum: 1,
        numPages: 1,
        //ppt
        pptName: "",
        pptUrl: "",
        copyPptUrl: '',
        //video
        videoName: "",
        videoUrl: "",
        videoImg: "",
        videos: [],
        stepActive: 1,
        stepsInformation: [],
        //table切换
        activeName: "first",
        videoObject: null,
        playerObj: null,
        initHeight: "",
        initWidth: "",
        nopdfUrlImge: false,
        nopptUrlImge: false,
        novideoUrlImge: false,
        content: false,
        coverBox: false,
        videoVisable: false,
        currentStatus: '',
        noDataUrl: '',
        // isShowPdfLoading: true,
        // videoIndex: '',
        // videoArray: [],
      };
    },
    watch: {
        '$i18n.locale': function () {
            this.initLangData()
        },
        // currentStatus(val, oldval) {
        //     if (val == 1) {
        //         // this.isShowPdfLoading = false
        //     }
        // }
    },
    mounted() {
      if (!this.$store.state.currentCoursePackageId || this.$store.state.currentCoursePackageId == '') {
        this.$router.replace({path: '/resources'})
      }
      this.initLangData()
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      //  面包屑显示首页效果
      PubSub.publish("currentMenuIndex", "/resources");

      // ppt 展示
      // $("#loadingPPt").show();
      // var $dom = document.getElementById("iframe");
      // if ($dom) {
      //     if ($dom.attachEvent) {
      //         $dom.attachEvent("onload", function () {
      //             $("#loadingPPt").hide();
      //             $(".loadingPPtBox").hide();
      //
      //        });
      //     } else {
      //         $dom.onload = function () {
      //             $("#loadingPPt").hide();
      //             $(".loadingPPtBox").hide();
      //
      //         };
      //     }
      // }
      const loading = promptUtil.loading(this);
      intoCoursesPackageDetailById(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          courses_id: this.$route.params.id
        })
      ).then(res => {
        PubSub.publish("currentMenuIndex", "/resources");
        loading.close();
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data == '[]') {
            promptUtil.wait(this);
            return
          }
          this.initDataFromServer(res.data);
          this.pdfUrl = res.data.lesson.url;
          this.pdfTask(this.pdfUrl)
          if (res.data.courseware.url && res.data.courseware.url != "") {
            this.totalTrafficStatistics(res.data.courseware.url, '人工智能课程ppt')
          }
          if (res.data.lesson.url && res.data.lesson.url != "") {
            this.totalTrafficStatistics(res.data.lesson.url, '人工智能课程pdf')
            this.copyPdfUrl = res.data.lesson.url
          }
          if (res.data.lesson.url == "" && res.data.courseware.url == "" && res.data.videos.length == 0) {
            this.activeName = ''
            this.noDataUrl = '../../../../static/images/base/nodata.png'
          } else if (res.data.courseware.url == "" && res.data.lesson.url == "") {
            this.activeName = 'third'
          } else if (res.data.courseware.url == "" && res.data.videos.length == 0) {
            this.activeName = 'second'
          }
        } else {
          promptUtil.wait(this);
          loading.close();
        }
        window.videoIndex = 1
      }).catch(err => {
        loading.close();
        promptUtil.timeout(this);
      });
    },
    updated() {
      // ppt 展示
      $("#loadingPPt").show();
      var $dom = document.getElementById("iframe");
      if ($dom) {
        if ($dom.attachEvent) {
          $dom.attachEvent("onload", function () {
            $("#loadingPPt").hide();
            $(".loadingPPtBox").hide();
          });
        } else {
          $dom.onload = function () {
            $("#loadingPPt").hide();
            $(".loadingPPtBox").hide();
          };
        }
      }
      this.currentCkplayer(this.stepActive)
      $("#video").css({"width":"60%","height":"100%"})
    },
    methods: {
      initLangData(){
          this.routerConfig[0].name = this.$t(`message.course_ai_header_title`)
          this.routerConfig[1].name = this.$t(`message.course_ai_course_catalog`)
          this.routerConfig[2].name = this.$t(`message.course_ai_course_detail`)
      },
      handItemStepClick(val) {
        this.stepActive = val + 1
        this.currentCkplayer(this.stepActive)
        $("#video").css({"width":"60%","height":"100%"})
      },
      currentCkplayer(index) {

        window.videoIndex = index;
        try {
          // this.playerObj != null ? this.playerObj.videoPause() : this.playerObj; // 切换页面后停止播放
          window.videoplayerObj != null ? window.videoplayerObj.videoPause() : window.videoplayerObj;
        } catch (e) {
        }
        if (this.videos.length != 0) {
          this.videoObject = {
            container: "#video", //容器的ID或className
            variable: "player", //播放函数名称
            loop: false, //播放结束是否循环播放
            flashplayer: false,
            poster: this.videos[index - 1].image, //封面图片
            // debug: false, //是否开启调试模式
            drag: "start", //拖动的属性
            seek: 0, //默认跳转的时间
            loaded: "loadedHandler",//监听播放器加载成功
            video: [[this.videos[index - 1].video, "video/mp4"]]
          };
          // this.playerObj = new window.ckplayer(this.videoObject);
          // window.videoplayerObj=new window.ckplayer(this.videoObject);
          window.loadedHandler = function () {//播放器加载后会调用该函数
            window.videoplayerObj.addListener('play', playHandler); //监听播放时间,addListener是监听函数，需要传递二个参数，'time'是监听属性，这里是监听时间，timeHandler是监听接受的函数
          }

          function playHandler() {
            if (!window.videoArray[(window.videoIndex - 1)] || window.videoArray[(window.videoIndex - 1)]["used"] !== "used") {
              let fileUrl = window.videoArray[(window.videoIndex - 1)].video
              window.videoArray[(window.videoIndex - 1)]["used"] = "used"
              trafficStatistics(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                user_id: storageUtil.readTeacherInfo().id,
                file_url: fileUrl,
                text: "人工智能video",
              })).then(res => {
                if (res.code == SUCCESS_CODE) {
                } else {
                }
              }).catch(err => {

                // promptUtil.LOG('trafficStatistics-err', err)
              })
            }
          }

          // window.loadedHandler = function () {//播放器加载后会调用该函数
          //     //_self.playerObj.addListener('play', playHandler);
          //     if(window.videoplayerObj) {
          //         window.videoplayerObj.addListener('play', playHandler); //监听播放时间,addListener是监听函数，需要传递二个参数，'time'是监听属性，这里是监听时间，timeHandler是监听接受的函数
          //     }
          // };
          // window.playHandler = function() {
          //     console.log("1111")
          //     //正在播放.
          //     if (!window.videoArray[(window.videoIndex - 1)] || window.videoArray[(window.videoIndex - 1)] !== "used") {
          //         let fileUrl = window.videoArray[(window.videoIndex - 1)].video
          //         window.videoArray[(window.videoIndex - 1)] = "used"
          //         trafficStatistics(qs.stringify({
          //             school_id: storageUtil.readTeacherInfo().school_id,
          //             user_id: storageUtil.readTeacherInfo().id,
          //             file_url: fileUrl,
          //             text: "人工智能video",
          //         })).then(res => {
          //             if (res.code == SUCCESS_CODE) {
          //             } else {
          //
          //             }
          //
          //         }).catch(err => {
          //
          //             // promptUtil.LOG('trafficStatistics-err', err)
          //         })
          //     }
          // }
        }
        try {
          // this.playerObj = new window.ckplayer(this.videoObject);
          window.videoplayerObj = new window.ckplayer(this.videoObject);
          // this.playerObj != null ? this.playerObj.videoPause() : this.playerObj; // 切换页面后停止播放
          window.videoplayerObj != null ? window.videoplayerObj.videoPause() : window.videoplayerObj;

        } catch (e) {
        }
      },
      // 从接口获取数据并赋值
      initDataFromServer(data) {
        this.videos = data.videos;
        this.stepsInformation = data.videos;
        this.pdfName = data.lesson.label;
        this.pdfUrl = data.lesson.url;
        this.pptName = data.courseware.label;
        this.videoName = data.video.label;
        this.videoUrl = data.video.url;
        this.videoImg = data.video.img;
        this.pptUrl = data.courseware.url;
        window.videoArray = data.videos;
        window.videoIndex = 0;
      },
      handleClick(tab, event) {
        //视频
        if (this.playerObj == null) {
          $("#video").css({"width":"60%","height":"100%"})
            // index0表示教案1课件2视频
             this.currentCkplayer(1)
             this.playerObj = new window.ckplayer(this.videoObject);
            // this.playerObj.addListener('play', playHandler);
            // window.videoplayerObj = this.playerObj;
        }

         this.playerObj != null ? this.playerObj.videoPause() : this.playerObj; // 切换页面后停止播放
      },

      pdfTask(pdfUrl) {
        if (!pdfUrl || pdfUrl == "") {
          // this.isShowPdfLoading = false
        } else {
          var self = this
          var loadingTask = pdf.createLoadingTask(pdfUrl)
          loadingTask.then(pdf => {
            self.pdfUrl = loadingTask
            self.numPages = pdf.numPages
          }).catch((err) => {
            console.error('pdf加载失败')
          })

        }
      },
      pdfProgress(val) {
        this.currentStatus = val
        // console.log("vallll",val)
        // if (val == 1 && this.pdfUrl != '') {
        //     this.totalTrafficStatistics(this.pdfUrl, '人工智能课程pdf')
        // }
      },
      totalTrafficStatistics(file_url, text) {
        trafficStatistics(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          user_id: storageUtil.readTeacherInfo().id,
          file_url: file_url,
          text: text,
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
          } else {

          }

        }).catch(err => {
          promptUtil.LOG('trafficStatistics-err', err)
        })
      }
    }
  };
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

  h5 {
    text-align: center;
  }

  .border_b {
    border-bottom: 1px #e0e0e0 solid;
  }

  /* 放置ppt */
  .content {
    width: 800px;
    margin: 0 auto;
    height: 100%;
    background-color: #dadada;
    overflow: hidden;
    z-index: 11;
  }

  .my_teachingPlan {
    margin-top: 20px;
    margin-bottom: 20px;
    /* height: 100%; */
    width: 700px;
    overflow: hidden;
    text-align: center;
    margin-left: 50px;
  }

  .viedo {
    width: 400px;
  }

  .el-box {
    margin: 15px 15px;
    float: left;
    width: 300px;
    margin-left: 55px;
  }

  .el-box p {
    line-height: 50px;
  }

  .el-card {
    /* border-radius: 10%; */
    box-shadow: 2px 2px 5px #eee;
    border: none;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  #containersecond {
    /* width: 1200px;
      height: 700px; */
    width: 60%;
    height: 50%;
    margin: 0 auto;
  }

  .my_swiper {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .swiper-container {
    margin: 0 auto;
  }

  .auto {
    margin: 0 auto !important;
  }

  .slide1 {
    width: 100%;
    height: 100%;
    overflow: none;
  }

  .slide1 img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .bottom {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 0px;
    background: #eee;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 2222;
  }

  /*播放*/
  .openautoplay {
    background: url(../../../../static/images/base/courses/start.jpg) no-repeat;
    background-repeat: no-repeat;
    width: 40px;
    height: 25px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }

  .closeautoplay {
    background: url(../../../../static/images/base/courses/open.png) no-repeat;
    background-repeat: no-repeat;
    width: 40px;
    height: 25px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }

  /*上一页*/
  .swiper-button-prev {
    background: url(../../../../static/images/base/courses/left_arr.jpg) no-repeat;
    background-repeat: no-repeat;
    width: 62px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
    z-index: 999 !important;
    outline: none;
    padding-left: 2px;
    top: 50%;
    left: 70%;
    transform: translateY(50%);
  }

  /*下一页*/
  .swiper-button-next {
    display: inline-block;
    background: url(../../../../static/images/base/courses/right_arr.jpg) no-repeat;
    background-repeat: no-repeat;
    top: 50%;
    left: 80%;
    width: 64px;
    margin-right: 10px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    outline: none;
    transform: translateY(50%);
  }

  .up {
    width: 25px;
    height: 25px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .up img {
    width: 25px;
    height: 25px;
    cursor: pointer;
  }

  .font_color {
    color: #fff;
    font-size: 14px;
  }

  .font_color:hover {
    color: blue;
  }

  .happy-scroll {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .pdf-tab {
    text-align: center;
    margin-top: 10px;
  }

  .fl {
    float: left;
    margin-left: 95px;
  }

  .pointer {
    cursor: pointer;
  }

  .pointer a {
    text-decoration: none;
    color: #000;
  }

  .pointer a:hover {
    color: #00a2ff;
  }

  .pausecenterchyqgauevogl {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  .pausecenterchoiugmlfpql {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }


  .nopdfUrlImg {
    width: 300px;
    margin: 100px auto;

  }

  .nopdfUrlImg img {
    width: 100%;
    height: 100%;
  }


  /*.loadingPPtBox img {*/
  /*  width: 101%;*/
  /*  height: 100%;*/
  /*}*/

  /*.cover {*/
  /*  width: 60px;*/
  /*  height: 30px;*/
  /*  display: block;*/
  /*  background-color: #2c2f34;*/
  /*  position: absolute;*/
  /*  bottom: 5px;*/
  /*  left: 2px;*/
  /*}*/

  /*.coverBox {*/
  /*  !*display: block; +21*!*/
  /*  width: 1193px;*/
  /*  height: 728px;*/
  /*  margin: 0 auto;*/
  /*  text-align: center;*/
  /*  z-index: 222;*/
  /*  position: relative;*/

  /*}*/

  /*.cover {*/
  /*  width: 60px;*/
  /*  height: 30px;*/
  /*  display: block;*/
  /*  background-color: #2c2f34;*/
  /*  position: absolute;*/
  /*  bottom: 22px;*/
  /*  left: 2px;*/
  /*}*/

  /*.loadingPPtBox {*/
  /*  position: absolute;*/
  /*  display: block;*/
  /*  width: 1193px;*/
  /*  height: 707px;*/
  /*  margin: 0 auto;*/
  /*  text-align: center;*/
  /*  z-index: 3333;*/
  /*}*/

  .loadingPPtBox img {
    width: 101%;
    height: 101%;
  }

  /* .ListIframe {*/
  /*   width: 1193px !important;*/
  /*   height: 707px !important;*/
  /*}*/


  @media (min-width: 1024px) {
    .spanColor {
      color: red;
    }

    .coverBox {
      /* display: block; */
      width: 520px;
      height: 355px;
      margin: 0 auto;
      text-align: center;
      z-index: 222;
      position: relative;
    }

    .loadingPPtBox {
      position: absolute;
      display: block;
      width: 520px;
      height: 355px;
      margin: 0 auto;
      text-align: center;
      z-index: 3333;
    }

    .ListIframe {
      width: 520px !important;
      height: 335px !important;

    }
  }

  /*>=1024的设备*/

  @media (min-width: 1100px) {
    .spanColor {
      color: blue;
    }

    .coverBox {
      /* display: block; 835px */
      width: 800px;
      height: 503px;
      margin: 0 auto;
      text-align: center;
      z-index: 222;
      position: relative;

    }


    .loadingPPtBox {
      position: absolute;
      display: block;
      width: 800px;
      height: 480px;
      margin: 0 auto;
      text-align: center;
      z-index: 3333;
    }


    .ListIframe {
      width: 800px !important;
      height: 480px !important;

    }

  }

  /*>=1100的设备*/

  @media (min-width: 1366px) {
    .spanColor {
      color: purple;
    }

    .coverBox {
      /* display: block; 835px */
      width: 835px;
      height: 533px;
      margin: 0 auto;
      text-align: center;
      z-index: 222;
      position: relative;

    }


    .loadingPPtBox {
      position: absolute;
      display: block;
      width: 835px;
      height: 512px;
      margin: 0 auto;
      text-align: center;
      z-index: 3333;
    }


    .ListIframe {
      width: 835px !important;
      height: 512px !important;

    }
  }

  @media (min-width: 1440px) {
    .spanColor {
      color: yellow;
    }

    .coverBox {
      /* display: block; */
      width: 900px;
      height: 569px;
      margin: 0 auto;
      text-align: center;
      z-index: 222;
      position: relative;

    }


    .loadingPPtBox {
      position: absolute;
      display: block;
      width: 900px;
      height: 548px;
      margin: 0 auto;
      text-align: center;
      z-index: 3333;
    }


    .ListIframe {
      width: 900px !important;
      height: 548px !important;

    }
  }

  @media (min-width: 1680px) {
    .spanColor {
      color: green;
    }

    .coverBox {
      /* display: block; */
      width: 1050px;
      height: 650px;
      margin: 0 auto;
      text-align: center;
      z-index: 222;
      position: relative;

    }


    .loadingPPtBox {
      position: absolute;
      display: block;
      width: 1050px;
      height: 629px;
      margin: 0 auto;
      text-align: center;
      z-index: 3333;
    }

    .ListIframe {
      width: 1050px !important;
      height: 629px !important;

    }
  }

  @media (min-width: 1920px) {
    .spanColor {
      color: #eee;
    }

    .coverBox {
      /* display: block; */
      width: 1193px;
      height: 728px;
      margin: 0 auto;
      text-align: center;
      z-index: 222;
      position: relative;

    }


    .loadingPPtBox {
      position: absolute;
      display: block;
      width: 1193px;
      height: 707px;
      margin: 0 auto;
      text-align: center;
      z-index: 3333;
    }

    .ListIframe {
      width: 1193px !important;
      height: 707px !important;

    }
  }
</style>



