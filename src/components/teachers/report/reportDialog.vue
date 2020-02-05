<template>
  <div>
    <el-dialog
      title="预览"
      :visible.sync="reportDetailVisible"
      width="30%"
      @opened="reportDialogOpened"
    >
      <!-- :visible.sync="reportDetailVisible" -->
      <div style="height: 600px;overflow-y:scroll;margin-top:-20px;margin-bottom: 10px;">
        <div style="height: 240px;background: #409EFF;">
          <el-row>
            <el-col :span="12" :offset="6">
              <el-tooltip
                class="item"
                effect="dark"
                :content="reportDetailInfo.reportName"
                placement="top"
              >
                <div class="div-report-title">{{reportDetailInfo.reportName}}</div>
              </el-tooltip>
              <div
                style="display: flex;justify-content: center;align-items: center;margin-top: 20px;"
              >
                <el-avatar :src="reportDetailInfo.studentInfo.avatar" :size="80"></el-avatar>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="10">
              <el-tooltip
                class="item"
                effect="dark"
                :content="reportDetailInfo.studentInfo.name"
                placement="top"
              >
                <div class="div-report-name">{{reportDetailInfo.studentInfo.name}}</div>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <el-card class="box-card" style="margin-top: -30px;margin-left: 20px;margin-right: 20px;">
          <el-row>
            <el-col :span="4">
              <span style="font-weight: bold" class="color">任务说明:</span>
            </el-col>
            <!-- 文字提示-->
            <el-col :span="18" :offset="1">
              <el-tooltip
                class="item"
                effect="dark"
                :content="reportDetailInfo.taskspec"
                placement="top"
              >
                <div class="div-task-info">{{reportDetailInfo.taskspec}}</div>
              </el-tooltip>
            </el-col>
            <!-- 文字提示结束-->
          </el-row>
          <el-carousel
            v-show="reportDetailInfo.pictures.length>1"
            :interval="5000"
            arrow="always"
            class="elCarousel"
          >
            <el-carousel-item v-for="(item, index) in reportDetailInfo.pictures" :key="index" class="elCarouselItem">
              <div>
                <img :src="item" style="width: 100%;height: 100%;">
              </div>
            </el-carousel-item>
          </el-carousel>
          <div v-if="reportDetailInfo.pictures.length == 1" ><img :src="reportDetailInfo.pictures[0]" style="width: 100%;height: 100%;"></div>
        </el-card>
        <el-card
          v-show="reportDetailInfo.video!=''"
          style="margin-top: 10px;margin-left: 20px;margin-right: 20px;"
        >
          <video style="width:100%;height: 100%" controls="controls" :src="reportDetailInfo.video"></video>
        </el-card>
        <el-row style="margin-top: 10px;">
          <el-col :span="22" :offset="1">
            <div style="float:left;border: none;height:25px;width:3px;background:#409EFF"></div>
            <span style="font-size: 18px;font-weight: bold;margin-left:5px;">教师评语</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: -12px;">
          <el-col :span="22" :offset="1">{{reportDetailInfo.evaluation}}</el-col>
        </el-row>
        <el-row style="margin-top: -10px;">
          <el-col :span="22" :offset="1">
            <el-card class="box-card" style="margin: 0;padding: 0;">
              <el-row>
                <el-col :span="2">
                  <div style="display: flex;justify-content: center;align-items: center">
                    <img
                      :src="reportDetailInfo.teacherInfo.avatar"
                      style="width: 35px;height: 35px;"
                    >
                  </div>
                </el-col>
                <el-col :span="16" :offset="1">
                  <div>
                    任课教师:
                    <span>{{reportDetailInfo.teacherInfo.nick}}</span>
                  </div>
                  <div>
                    所在班级:
                    <span>{{reportDetailInfo.teacherInfo.class}}</span>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <div style="float:left;border: none;height:25px;width:3px;background:#409EFF"></div>
            <span style="font-size: 18px;font-weight: bold;margin-left:5px;">六大潜力</span>
          </el-col>
        </el-row>
        <el-row>
          <div id="echart-main" style="width:300px;height: 300px;margin: auto;"></div>
        </el-row>
        <div v-show="qrCodeVisible" style="font-size: 20px;color:#666666;font-weight:bold;text-align: center;">分享至朋友圈</div>
        <el-row v-show="qrCodeVisible">
          <div
            style="width:100%;height: 300px;display: flex;justify-content: center;align-items: center;">
            <vue-qr
              :text="reportDetailInfo.qrData.url"
              :logoSrc="require('../../../../static/images/base/logo.jpg')"
              colorDark="#000"
              colorLight="#fff"
              :margin="0"
              :logoScale="0.4"
              :size="200"
            ></vue-qr>
          </div>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  const echarts = require("echarts");
  import vueQr from "vue-qr";
  import storageUtil from "../../../utils/storageUtil";
  import promptUtil from "../../../utils/promptUtil";
  import staticUtil from "../../../utils/staticUtil";
  import {qs, getStudentReportDetail} from "../../../api/api";

  export default {
    components: {
      vueQr
    },

    data() {
      return {
        qrCodeVisible: false, //是否显示二维码
        reportDetailVisible: false, // 是否显示当前报告详情
        currentReportDetailId: 0, // 当前选中的报告id
        reportDetailInfo: {
          // 报告详情信息
          pictures: [],
          video: "",
          studentInfo: {avatar: ""},
          teacherInfo: {avatar: ""},
          qrData: {url: ""}
        }
      };
    },
    methods: {
      //学生管理学情报告查看
      start(obj) {
        this.reportDetailVisible = true;
        this.reportDetailInfo = obj;
        if(this.reportDetailInfo.qrData.url && this.reportDetailInfo.qrData.url!=''
          && this.reportDetailInfo.qrData.url.substr(this.reportDetailInfo.qrData.url.length-4)=='.png'){ // 判断是否有二维码
          this.qrCodeVisible = true
        }else{
          this.qrCodeVisible = false
        }
      },
      //查看点评查看报告
      seeRateReport(obj){
        this.reportDetailVisible = true;
        this.reportDetailInfo = obj;
        if(this.reportDetailInfo.qrData.url && this.reportDetailInfo.qrData.url!=''
          && this.reportDetailInfo.qrData.url.substr(this.reportDetailInfo.qrData.url.length-4)=='.png'){ // 判断是否有二维码
          this.qrCodeVisible = true
        }else{
          this.qrCodeVisible = false
        }
      },
      // 打开报告详情对话框回调
      reportDialogOpened() {
        echarts
          .init(document.getElementById("echart-main"))
          .setOption(
            staticUtil.genECharts(this.reportDetailInfo.dimension, echarts)
          );
      }
    },
    mounted() {
      // 显示查看报告对话框
      // this.currentReportDetailId=obj.row.id
      // const loading=promptUtil.loading(this)
      // console.log('school_id'+storageUtil.readTeacherInfo().school_id)
      // getStudentReportDetail(qs.stringify({
      //     school_id: storageUtil.readTeacherInfo().school_id,
      //     task_id: this.currentReportDetailId
      // })).then(res=>{
      //     loading.close()
      //     console.log(res)
      //     if(res.code==1){
      //     this.reportDetailInfo=res.data
      //     this.reportDetailVisible=true
      //     }else{
      //     promptUtil.wait(this)
      //     }
      // }).catch(err=>{
      //     loading.close()
      //     promptUtil.timeout(this)
      // })
    }
  };
</script>
<style scoped>
  .div-task-info {
    width: 100%;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .div-report-title {
    margin-top: 20px;
    width: 100%;
    color: #666666;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .div-report-name {
    text-align: center;
    margin: auto;
    font-size: 16px;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

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

  .bg-purple {
    background: #fff;
  }

  .bg-purple-light {
    background: #fff;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .grid1-content {
    border-radius: 4px;
    min-height: 46px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  /*>=1024的设备*/

  @media (min-width: 1100px) {
    .el-carousel__container {
      height: 135px !important;
    }

    .elCarouselItem {
      height: 135px !important;
    }

    .elCarousel {
      height: 135px;
    }


  }

  .el-carousel__container {
    height: 0px !important;
  }


  /*>=1100的设备*/

  @media (min-width: 1366px) {

    .elCarouselItem {
      height: 188px !important;
    }

    .elCarousel {
      height: 188px;
    }


  }

  @media (min-width: 1440px) {

    .elCarouselItem {
      height: 210px !important;
    }

    .elCarousel {
      height: 210px;
    }


  }

  @media (min-width: 1680px) {

    .elCarouselItem {
      height: 270px !important;
    }

    .elCarousel {
      height: 270px;
    }


  }

  @media (min-width: 1920px) {

    .elCarouselItem {
      height: 300px !important;
    }

    .elCarousel {
      height: 300px;
    }



  }
</style>

