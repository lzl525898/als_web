<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px;">
      <el-row>
        <el-col :span="24" style="font-weight: bold;font-size: 24px;">
          <label>{{packageInfo.course}}</label>
        </el-col>
        <el-col :span="24" style="margin-top: 10px;">
          <label>教学软件 : </label><label>{{packageInfo.software}}</label>
        </el-col>
        <el-col :span="24" style="margin-top: 10px;">
          <label>简要介绍 : </label><label>{{packageInfo.introduce}}</label>
        </el-col>
      </el-row>
    </el-card>
    <!-- tableq切换 -->
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      style="height:95%;margin-top: 20px;"
    >
      <el-tab-pane label="课件" name="ppt">
        <el-row>
          <el-col :span="24">
            <div class="border_b">
              <h5>{{ruleForm.coursewareName}}</h5>
            </div>
          </el-col>
        </el-row>
        <div class="nopdfUrlImg" v-if="ruleForm.courseware==null || ruleForm.courseware==''">
          <img src="../../../../static/images/base/nodata.png" alt>
        </div>
        <div class="coverBox" ref="coverBox" v-show="ruleForm.courseware && ruleForm.courseware!=''">
          <div class="loadingPPtBox"><img src="../../../../static/images/base/loading.gif" alt="" id="loadingPPt"></div>
          <iframe class="ListIframe" id="iframe" :src="baseOfficeUrl+ruleForm.courseware"
                  style="border:1px solid #aabbcc;max-width: 100%;" allowfullscreen="true" mozallowfullscreen="true"
                  webkitallowfullscreen="true"></iframe>
        </div>
      </el-tab-pane>
      <el-tab-pane label="教案" name="pdf" >
        <als-loading v-show="isShowPdfLoading"></als-loading>
        <el-row>
          <el-col :span="24">
            <div class="border_b">
              <h5>{{ruleForm.planName}}</h5>
            </div>
          </el-col>
        </el-row>
        <!-- 放置品pdf  background-color:blue;-->
        <div>
          <div class="nopdfUrlImg" v-if="ruleForm.plan==null || ruleForm.plan==''">
            <img src="../../../../static/images/base/nodata.png" alt>
          </div>
          <div class="content" v-if="ruleForm.plan && ruleForm.plan!=''">
            <div class="my_teachingPlan">
              <!--                <div class="pdf">-->
              <!--                  <pdf-->
              <!--                    ref="pdf"-->
              <!--                    :src="ruleForm.plan"-->
              <!--                    :page="plan.pageNum"-->
              <!--                    :rotate="plan.pageRotate"-->
              <!--                    @page-loaded="pageLoaded($event)"-->
              <!--                    @num-pages="plan.pageTotalNum=$event"-->
              <!--                    @error="pdfError($event)"-->
              <!--                    @link-clicked="page = $event"-->
              <!--                  ></pdf>-->
              <!--                  <div class="pdf-tab fl">-->
              <!--                    <div class="btn-def btn-pre fl pointer" @click.stop="prePage">上一页</div>-->
              <!--                    <div class="btn-def btn-next fl pointer" @click.stop="nextPage">下一页</div>-->
              <!--                    <div class="fl">{{plan.pageNum}}/共{{plan.pageTotalNum}}页</div>-->
              <!--                  </div>-->
              <!--                </div>-->
              <pdf
                v-for="i in numPages"
                :key="i"
                :src="ruleForm.plan"
                :page="i"
                @progress="pdfProgress($event)"
              >
              </pdf>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!--        <el-tab-pane label="视频" name="video">-->
      <!--          <el-row>-->
      <!--            <el-col :span="24">-->
      <!--              <div class="border_b">-->
      <!--                <h5>{{ruleForm.videoName}}</h5>-->
      <!--              </div>-->
      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--          <div class="nopdfUrlImg" v-if="ruleForm.video==null || ruleForm.video==''">-->
      <!--            <img src="../../../../static/images/base/nodata.png" alt>-->
      <!--          </div>-->
      <!--          <div v-if="ruleForm.video && ruleForm.video!=''">-->
      <!--            <div style="display: flex;justify-content: center;">-->
      <!--              <div id="video" style="width:80%;height:70%;"></div>-->
      <!--            </div>-->
      <!--            <div style="display: flex;justify-content: center;"></div>-->
      <!--          </div>-->
      <!--        </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
    //引入pdf
    import pdf from "vue-pdf";
    import promtUtil from "../../../utils/promptUtil";
    import {ckplayer} from "../../../../static/ckplayer/ckplayer/ckplayer"
    import {
        qs,
        getCourseItemById, // 根据id获取课时数据
        trafficStatistics
    } from '../../../api/api'
    import '../../../api/restfulapi'
    import $ from "jquery"
    //引入swiper
    import "swiper/dist/css/swiper.min.css"
    import promptUtil from "../../../utils/promptUtil"
    import storageUtil from "../../../utils/storageUtil";
    import childHeader from '../../component/childHeader'
    import customLoading from '../../component/customLoading'

    export default {
        components: {
            'pdf': pdf,
            'als-loading': customLoading,
            "als-child-header": childHeader
        },
        data() {
            return {
                routerConfig: [{name: '自定义课程', to: '/custom'}, {
                    name: '自定义课程课时',
                    to: '/custom/see/' + this.$store.state.customCourseDetail.id
                }, {name: '自定义课程课时详情', to: ''}],
                baseOfficeUrl: 'https://ow365.cn/?i=18640&n=5&ssl=1&n=5&furl=',
                activeName: 'ppt', //  ppt  pdf video
                customCourseId: 0, // 课程id
                packageInfo: {course: '', software: '', introduce: ''},
                plan: {pageNum: 1, pageTotalNum: 1, pageRotate: 0, curPageNum: 1, },
                numPages: 1,
                videoObject: {}, // 视频对象
                pdfWebPath:'', // pdf 文件路径
                ruleForm: {
                    id: '', // 课时id
                    name: '', // 课程名称
                    sort: 500, // 课程排序
                    planName: "", // 教案名称
                    plan: "", // 教案文件 pdf
                    desc: "", // 简要介绍
                    tool: "", // 教学工具
                    picture: '',// 视频封面图地址
                    coursewareName: '', // 课件名称
                    courseware: '', // 课件文件 ppt
                    videoName: '', // 课程视频名称
                    video: '', // 课程视频 mp4
                    videoList: [], // 编辑页中视频返回需要
                    examine: -1, // 视频0 审核中 1 审核通过  2 审核失败  不显示-1
                },
                currentStatus:'',
                isShowPdfLoading: true,
                flowRecord:{ppt:'',pdf:''},
            }
        },
        mounted() {
            if (this.$store.state.customCourseDetail && this.$store.state.customCourseDetail.id != 0 && this.$store.state.customCourseDetail.id != "") {
                this.customCourseId = this.$store.state.customCourseDetail.id
                this.initData()
            } else {
                this.$router.replace({path: ROUTER_CUSTOM})
            }
        },
        methods: {
            initData() {
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
                const loading = promptUtil.loading(this)
                getCourseItemById(qs.stringify({id: this.$route.params.id})).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.analysisEditDataFromServer(res.data)
                        if (res.data.ppt_url && res.data.ppt_url != "") {
                            if(this.flowRecord.ppt==''&& this.flowRecord.pdf==''){
                                this.totalTrafficStatistics(res.data.ppt_url, '自定义课程课件', 'ppt')
                            }
                        }
                        if (res.data.pdf_url && res.data.pdf_url != "") {
                            if(this.flowRecord.ppt==''&&this.flowRecord.pdf==''){
                                this.totalTrafficStatistics(res.data.pdf_url, '自定义课程教案', 'pdf')
                            }
                        }
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("getCourseItemById-err", err)
                    loading.close()
                })
            },
            // 解析编辑数据
            analysisEditDataFromServer(data) {
                this.ruleForm.id = data.id
                this.ruleForm.name = data.class_name
                this.ruleForm.sort = data.weight
                this.ruleForm.planName = data.pdf_name
                this.ruleForm.plan = data.pdf_url
                this.pdfWebPath = data.pdf_url
                // if( this.ruleForm.plan!=""){
                //     this.pdfTask(this.ruleForm.plan)
                // }
                this.ruleForm.desc = data.con
                this.ruleForm.tool = data.jiaoju
                this.ruleForm.picture = data.video_img_url
                this.ruleForm.coursewareName = data.ppt_name
                this.ruleForm.courseware = data.ppt_url
                // this.ruleForm.videoList = JSON.parse(data.video_url)
                // if(data.video_url && data.video_url!=""){
                //   this.ruleForm.videoName = this.ruleForm.videoList[0].name
                //   this.ruleForm.video = this.ruleForm.videoList[0].url
                //   // 0 审核中 1 审核通过  2 审核失败
                //   this.ruleForm.examine = this.ruleForm.videoList[0].sh
                // }
                this.packageInfo.course = this.ruleForm.name
                this.packageInfo.introduce = (this.ruleForm.desc && this.ruleForm.desc != '') ? this.ruleForm.desc : '--'
                this.packageInfo.software = (this.ruleForm.tool && this.ruleForm.tool != '') ? this.ruleForm.tool : '--'
                // this.videoObject = {
                //   container: "#video", //容器的ID或className
                //   variable: "player", //播放函数名称
                //   loop: true, //播放结束是否循环播放
                //   flashplayer: false,
                //   poster: this.ruleForm.picture, //封面图片
                //   debug: false, //是否开启调试模式
                //   drag: "start", //拖动的属性
                //   seek: 0, //默认跳转的时间
                //   video: [[this.ruleForm.video, "video/mp4"]]
                // };
            },
            handleClick(tab, event) {
                let type = tab.name
                switch(type){
                    case 'ppt':
                        if(this.flowRecord.ppt==''){
                            this.totalTrafficStatistics(this.ruleForm.courseware, '自定义课程课件', type)
                        }
                        break;
                    case 'pdf':
                        this.pdfTask(this.ruleForm.plan)
                        if(this.flowRecord.pdf==''){
                            this.totalTrafficStatistics(this.pdfWebPath, '自定义课程教案', type)
                        }
                        break;
                    default:
                        break;
                }
                //视频
                // if (tab.index == 2 && this.playerObj == null) {
                // index0表示教案1课件2视频
                // this.playerObj = new window.ckplayer(this.videoObject);
                // this.keypress()
                // }
                // this.playerObj != null ? this.playerObj.videoPause() : this.playerObj; // 切换页面后停止播放
            },
            // //pdf
            // prePage() {
            //     var p = this.plan.pageNum;
            //     p = p > 1 ? p - 1 : this.plan.pageTotalNum;
            //     this.plan.pageNum = p;
            // },
            // nextPage() {
            //     var p = this.plan.pageNum;
            //     p = p < this.plan.pageTotalNum ? p + 1 : 1;
            //     this.plan.pageNum = p;
            // },
            // pageLoaded(e) {
            //     this.plan.curPageNum = e;
            // },
            // pdfError(error) {
            //     console.error(error);
            // }
            pdfTask(pdfUrl){
              if(!pdfUrl || pdfUrl==""){
                this.isShowPdfLoading = false
              }else{
                var self = this
                var loadingTask = pdf.createLoadingTask(pdfUrl)
                loadingTask.then(pdf => {
                  self.pdfUrl = loadingTask
                  self.numPages = pdf.numPages
                }).catch((err) => {
                  promptUtil.LOG('pdf加载失败')
                })
              }
            },
            pdfProgress(val){
                this.currentStatus=val
            },
            totalTrafficStatistics(file_url, text,type) {
                if(file_url&&file_url!=''){
                    let users = storageUtil.readTeacherInfo()
                    let schoolId = users.school_id
                    let userId = users.id
                    switch(type){
                        case 'pdf':
                            this.flowRecord.pdf = type
                            break;
                        case 'ppt':
                            file_url = this.baseOfficeUrl + file_url
                            this.flowRecord.ppt = type
                            break;
                        default:
                            break;
                    }
                    trafficStatistics(qs.stringify({
                        school_id: schoolId,
                        user_id: userId,
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
        },
        watch:{
            currentStatus(val){
                if(val==1){
                  this.isShowPdfLoading = false
                }
            }
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

  h5 {
    text-align: center;
  }

  .border_b {
    border-bottom: 1px #e0e0e0 solid;
  }

  .nopdfUrlImg {
    width: 300px;
    margin: 100px auto;

  }

  .nopdfUrlImg img {
    width: 100%;
    height: 100%;
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
