<template>
  <div >
    <div v-if="missionId==1" class="home" :style="{height:hei+'px'}">
      <el-container>
        <!-- header部分 -->
        <el-header>
          <login-header></login-header>
        </el-header>
        <el-container style="height: 100%;">
          <!-- src="https://www.superblockly.com/scratch3/index.html" -->
          <div class="closeTogg" v-if="showCloseTogg">
            <el-tooltip class="item" effect="light" content="隐藏side" placement="right">
              <i class="el-icon-d-arrow-right closeToggIcon" @click="closeToggIcon"></i>
            </el-tooltip>

          </div>
          <div class="openTogg" v-if="showOpenTogg">
            <el-tooltip class="item" effect="light" content="显示side" placement="right">
              <i class="el-icon-d-arrow-right openToggIcon" @click="openToggIcon"></i>
            </el-tooltip>

          </div>

          <el-aside style="width: 460px;background-color: #fff;" v-if="elAside">
            <div class="right-aside-wrapper">
              <div>
                <el-tooltip class="item" effect="dark" :content="taskDetail.taskName" placement="top">
                  <div
                    style="font-size: 26px;font-weight: bold;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 100%;"
                  >{{taskDetail.taskName}}
                  </div>
                </el-tooltip>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 14px;">
                {{taskDetail.stuName}}&nbsp;&nbsp;&nbsp;&nbsp;
                <i class="el-icon-time"></i>
                &nbsp;{{taskDetail.releaseTime}}
              </div>
              <div
                style="font-size:16px;color:#333;margin-top: 20px;"
              >当前班级&nbsp;&nbsp;:&nbsp;&nbsp;{{taskDetail.className}}
              </div>
              <div style="font-size:16px !important;color:#333;margin-top: 5px;">作品类型&nbsp;&nbsp;:&nbsp;&nbsp;
                <span style="margin-left: -7px;" v-if="taskDetail.missionId==1">Scratch3.0</span>
              </div>
              <div
                style="font-size:16px;color:#333;margin-top: 5px;"
              >作品状态&nbsp;&nbsp;:&nbsp;&nbsp;{{taskDetail.status}}
              </div>
              <div style="border: none;height: 1px;background-color: #D3DCE6;margin-top: 24px;"></div>
              <div style="font-size: 18px;font-weight: bold;margin-top: 24px;">维度评分</div>
              <div style="font-size:16px;color:#333;margin-top: 15px;display: flex">
                <div style="margin-right: 10px;">逻辑思维</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.logical"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">专注能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.absorbed"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">思考能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.reflect"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">沟通能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.communicate"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">创造能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.create"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">创新能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.innovate"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size: 18px;font-weight: bold;margin-top: 24px;">评语</div>
              <div style="margin-top: 15px;">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  placeholder="请输入评语"
                  v-model="currentEvaluateDetail.desc"
                ></el-input>
              </div>
              <div style="font-size: 18px;font-weight: bold;margin-top: 24px;">快捷评分</div>
              <div style="margin-top: 15px;">
                <el-row>
                  <el-col>
                    <el-button
                      style="margin-top: 10px;margin-left:10px;border-color:#9966ff"
                      round
                      v-for="(item,index) in evaluateQuick"
                      :key="index"
                      @click="onQuickRateClick(item)"
                    >{{item.label}}
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-row :gutter="20" style="margin-top:30px;">
                <el-col :span="8">
                  <el-button type="primary" @click="handleReturnTaskList">返回列表</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button v-if="$store.state.taskDetail.souceType==0" type="primary" @click="handleSaveEvaluate"
                             :disabled="$store.state.taskDetail.souceType!=0">创建评价
                  </el-button>
                  <el-button v-else type="primary" @click="handleSaveEvaluate"
                             :disabled="$store.state.taskDetail.souceType!=2">保存评价
                  </el-button>
                </el-col>
                <!--              1 查看点评 0 创建点评 2 继续点评-->
                <el-col :span="8">
                  <el-button
                    type="primary"
                    @click="handleReleaseEvaluate"
                    :disabled="$store.state.taskDetail && $store.state.taskDetail.souceType==1"
                  >发布评价
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-aside>
          <el-main style="margin: 0;padding: 5px;">
            <div id="scratch3.0" style="background-color: #00a2ff;height: 100%" v-loading="stratchloading">
              <iframe
                id="teacher_scratch"
                :src="iframeUrl"
                width="100%"
                height="100%"
                frameborder="0"
                name="iframe名称"
                scrolling="auto"
              ></iframe>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div v-else class="home" :style="{height:hei+'px'}">
      <el-container>
        <!-- header部分 -->
        <el-header>
          <login-header></login-header>
        </el-header>
        <el-container style="height: 100%;">
          <!-- src="https://www.superblockly.com/scratch3/index.html" -->
          <div class="closeTogg" v-if="showCloseTogg">
            <el-tooltip class="item" effect="light" content="隐藏side" placement="right">
              <i class="el-icon-d-arrow-right closeToggIcon" @click="closeToggIcon"></i>
            </el-tooltip>

          </div>
          <div class="openTogg" v-if="showOpenTogg">
            <el-tooltip class="item" effect="light" content="显示side" placement="right">
              <i class="el-icon-d-arrow-right openToggIcon" @click="openToggIcon"></i>
            </el-tooltip>

          </div>

          <el-aside style="width: 460px;background-color: #fff;" v-if="elAside">
            <div class="right-aside-wrapper">
              <div>
                <el-tooltip class="item" effect="dark" :content="stickerPrint.taskName" placement="top">
                  <div
                    style="font-size: 26px;font-weight: bold;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 100%;"
                  >{{stickerPrint.taskName}}
                  </div>
                </el-tooltip>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 14px;">
                {{stickerPrint.stuName}}&nbsp;&nbsp;&nbsp;&nbsp;
                <i class="el-icon-time"></i>
                {{stickerPrint.releaseTime}}
              </div>
              <div
                style="font-size:16px;color:#333;margin-top: 20px;"
              >当前班级&nbsp;&nbsp;:&nbsp;&nbsp;{{stickerPrint.className}}
              </div>
              <div
                style="font-size:16px;color:#333;margin-top: 5px;"
              >作品类型&nbsp;&nbsp;:&nbsp;&nbsp;{{stickerPrint.taskMission}}
              </div>
              <div
                style="font-size:16px;color:#333;margin-top: 5px;"
              >作品状态&nbsp;&nbsp;:&nbsp;&nbsp;{{stickerPrint.status}}
              </div>
              <div
                style="font-size:16px;color:#333;margin-top: 5px;"
              >
                <el-row >
                  <el-col :span="6">   作品描述&nbsp;&nbsp;:</el-col>
                  <el-col :span="18">{{stickerPrint.desc}}</el-col>
                </el-row>
<!--                作品描述&nbsp;&nbsp;:&nbsp;&nbsp;{{stickerPrint.desc}}-->
              </div>
              <div
                style="font-size:16px;color:#333;margin-top: 5px;"
              >
                <el-row >
                  <el-col :span="6">   作品要求&nbsp;&nbsp;:</el-col>
                  <el-col :span="18" class="buttonStyle">
                    <el-button type="text" @click="dialogVisible = true" style="margin-top: -10px" class="btn">点击查看作品要求</el-button>
                  </el-col>
                </el-row>
                <el-dialog
                  title="作品要求"
                  :visible.sync="dialogVisible"
                  width="40%"
                  :before-close="handleClose">
                  <div style="width: 100%;height: 500px;overflow-y: auto">
                    <div v-html="stickerPrint.workeRequire" style="width: 100% !important;">{{stickerPrint.workeRequire}} </div>
                  </div>
                </el-dialog>

<!--                作品要求&nbsp;&nbsp;:&nbsp;&nbsp;{{stickerPrint.workeRequire}}-->
              </div>
              <div style="border: none;height: 1px;background-color: #D3DCE6;margin-top: 24px;"></div>
              <div style="font-size: 18px;font-weight: bold;margin-top: 24px;">维度评分</div>
              <div style="font-size:16px;color:#333;margin-top: 15px;display: flex">
                <div style="margin-right: 10px;">逻辑思维</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.logical"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">专注能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.absorbed"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">思考能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.reflect"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">沟通能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.communicate"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">创造能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.create"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size:16px;color:#333;margin-top: 5px;display: flex">
                <div style="margin-right: 10px;">创新能力</div>
                <el-rate
                  v-model="currentEvaluateDetail.rate.innovate"
                  show-text
                  :texts="rateArrays"
                  :colors="['#FF4500', '#FF4500','#FF9900']"
                ></el-rate>
              </div>
              <div style="font-size: 18px;font-weight: bold;margin-top: 24px;">评语</div>
              <div style="margin-top: 15px;">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 5}"
                  placeholder="请输入评语"
                  v-model="currentEvaluateDetail.desc"
                ></el-input>
              </div>
              <div style="font-size: 18px;font-weight: bold;margin-top: 24px;">快捷评分</div>
              <div style="margin-top: 15px;">
                <el-row>
                  <el-col>
                    <el-button
                      style="margin-top: 10px;margin-left:10px;border-color:#9966ff"
                      round
                      v-for="(item,index) in evaluateQuick"
                      :key="index"
                      @click="onQuickRateClick(item)"
                    >{{item.label}}
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-row :gutter="20" style="margin-top:30px;">
                <el-col :span="8">
                  <el-button type="primary" @click="handleReturnTaskList">返回列表</el-button>
                </el-col>
                <el-col :span="8">
                  <el-button v-if="$store.state.taskDetail.souceType==0" type="primary" @click="handleSaveEvaluate"
                             :disabled="$store.state.taskDetail.souceType!=0">创建评价
                  </el-button>
                  <el-button v-else type="primary" @click="handleSaveEvaluate"
                             :disabled="$store.state.taskDetail.souceType!=2">保存评价
                  </el-button>
                </el-col>
                <!--              1 查看点评 0 创建点评 2 继续点评-->
                <el-col :span="8">
                  <el-button
                    type="primary"
                    @click="handleReleaseEvaluate"
                    :disabled="$store.state.taskDetail && $store.state.taskDetail.souceType==1"
                  >发布评价
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-aside>
          <el-main style="margin: 0;padding: 5px;">

            <!--            开始-->
            <div style="width: 100%;">
              <el-card shadow="always"
              >
                <el-row>
                  <el-col :span="24" style="background-color: #eee;">
                    <el-carousel :interval="3000" arrow="always" height="400px" indicator-position="outside"
                                 style="padding: 30px">
                      <el-carousel-item v-for="item in stickerPrint.picture" :key="item">
                        <el-image
                          style="width: 100%; height: 100%;"
                          :src="item"
                          fit="fill"></el-image>
                      </el-carousel-item>
                    </el-carousel>
                    <div style="padding: 30px;margin-top:-50px" v-if="stickerPrint.videoUrl!==''">
                      <video id="helpMovie" controls="controls"
                             style="width: 100%;border:3px solid #409EFF;border-radius:3px;padding:-3px;"
                             :src="stickerPrint.videoUrl"></video>
                    </div>

                  </el-col>
                  <!--                  <el-col :span="8">-->
                  <!--                    <div style="margin-left: 20px">-->
                  <!--                      <el-tooltip class="item" effect="dark" :content="stickerPrint.taskName" placement="top">-->
                  <!--                        <div style="width:380px;font-size:26px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">-->
                  <!--                          {{stickerPrint.taskName}}-->
                  <!--                        </div>-->
                  <!--                      </el-tooltip>-->
                  <!--                      <el-row style="margin-top: 30px;">-->
                  <!--                        <el-col :span="5">作品要求</el-col>-->
                  <!--                        <el-col :span="1"><span style="font-weight: bold">:</span></el-col>-->
                  <!--                        <div v-if="stickerPrint.workeRequire!=''">-->
                  <!--                          <el-col :span="18">-->
                  <!--                            {{stickerPrint.workeRequire}}-->
                  <!--                          </el-col>-->
                  <!--                        </div>-->
                  <!--                        <div v-else></div>-->

                  <!--                      </el-row>-->
                  <!--                      <div style="height: 1px;background-color:#e6e6e6;margin-top: 30px;"></div>-->
                  <!--                      <el-row style="margin-top: 30px;">-->
                  <!--                        <el-col :span="5">当前班级</el-col>-->
                  <!--                        <el-col :span="1"><span style="font-weight: bold">:</span></el-col>-->
                  <!--                        <el-col :span="18">{{stickerPrint.className}}</el-col>-->
                  <!--                      </el-row>-->
                  <!--                      <el-row style="margin-top: 10px;">-->
                  <!--                        <el-col :span="5">作品类型</el-col>-->
                  <!--                        <el-col :span="1"><span style="font-weight: bold">:</span></el-col>-->
                  <!--                        <el-col :span="18">{{stickerPrint.taskMission}}</el-col>-->
                  <!--                      </el-row>-->
                  <!--                      <el-row style="margin-top: 10px;">-->
                  <!--                        <el-col :span="5">作品状态</el-col>-->
                  <!--                        <el-col :span="1"><span style="font-weight: bold">:</span></el-col>-->
                  <!--                        <el-col :span="18">{{stickerPrint.status}}</el-col>-->
                  <!--                      </el-row>-->
                  <!--                      <div style="height: 1px;background-color:#e6e6e6;margin-top: 30px;"></div>-->
                  <!--                      <div style="display: flex;margin-top: 20px;">-->
                  <!--                        <div>{{stickerPrint.stuName}}</div>-->
                  <!--                        <div style="margin-left: 20px;"><i class="el-icon-timer"><span style="margin-left: 10px;">{{stickerPrint.releaseTime}}</span></i>-->
                  <!--                        </div>-->
                  <!--                      </div>-->
                  <!--                      <el-row style="margin-top: 10px;">-->
                  <!--                        <el-col :span="5">作品描述</el-col>-->
                  <!--                        <el-col :span="1"><span style="font-weight: bold">:</span></el-col>-->
                  <!--                        <el-col :span="18">{{stickerPrint.desc}}</el-col>-->
                  <!--                      </el-row>-->
                  <!--                    </div>-->
                  <!--                  </el-col>-->
                </el-row>
              </el-card>
            </div>
            <!--            结束-->
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import stringUtil from "../../../utils/stringUtil";
  import verifyUtil from "../../../utils/verifyUtil";
  import loginHeader from "../../home/loginHeader.vue";
  import '../../../api/restfulapi';
  import '../../../router/router';
  import $ from "jquery";
  import {
    qs,
    getTeacherInfoById,
    saveCourseReport,
    createCourseReport,
    releaseEditCourseReport,
    releaseCreateCourseReport,
    getStudentReportDetail,
    getTaskTypeInformation
  } from "../../../api/api";

  export default {
    name: "loginIndex",
    components: {
      loginHeader
    },
    data() {
      return {
        dialogVisible: false,
        elAside: true,
        reportName: "", // 作品名称
        show: true,
        count: "",
        timer: null,
        disabled: true,
        stratchloading: true,
        showOpenTogg: false,
        showCloseTogg: true,
        rateArrays: [],
        iframeUrl: '',
        storeTaskId: '',
        storeReportId: '',
        storeStudentId: '',
        missionId: '',
        reportID:'',
        // 弹出框 修改密码页面数据
        ruleForm: {currentmp: "", yzm: "", password: "", reptpassword: ""},
        // 弹出框 修改密码页面表单验证
        rules: {
          currentmp: [
            {required: true, message: "请输入当前手机号", trigger: "blur"}
          ],
          yzm: [{required: true, message: "请输入验证码", trigger: "blur"}],
          password: [
            {required: true, message: "请输入新手机号", trigger: "blur"}
          ],
          reptpassword: [
            {required: true, message: "再次输入密码", trigger: "blur"}
          ]
        },
        userBaseInfo: {
          // 用户基本信息
          avatar: "",
          nick: ""
        },
        isCollapse: false,
        currentItemActive: "/",
        hei: "", //获取屏幕宽度
        activeName: "first", //table切换
        //个人信息弹出框
        dialogTableVisible: false,
        dialogFormVisible: false,
        isReleaseble: false, // 是否允许发布
        isSaveRate: false, // 是否允许保存
        //任务详情信息
        taskDetail: {
          taskName: "",
          stuName: "",
          releaseTime: "",
          className: "",
          status: "",
          mission: ""
        },
        // 弹出框中得数据
        gridData: {
          id: "",
          account: "",
          classes: {className: "", classOwn: []},
          nick: "",
          phone: "",
          remark: ""
        },
        formLabelWidth: "120px",
        currentEvaluateDetail: {
          label: "惊喜很棒",
          desc:
            "太棒了！作品极具创意，设计感强，逻辑清晰，可见聪明的你编程技术之高！",
          rate: {
            logical: 5,
            innovate: 5,
            create: 5,
            communicate: 5,
            reflect: 5,
            absorbed: 5
          }
        },
        evaluateQuick: [
          {
            label: "惊喜很棒",
            desc:
              "太棒了！作品极具创意，设计感强，逻辑清晰，可见聪明的你编程技术之高！",
            rate: {
              logical: 5,
              innovate: 5,
              create: 5,
              communicate: 5,
              reflect: 5,
              absorbed: 5
            }
          },
          {
            label: "给力",
            desc:
              "太给力了！发挥创意和编程能力，作品充分运用课程所学内容，足见聪明的你编程功底之深！",
            rate: {
              logical: 4,
              innovate: 4,
              create: 4,
              communicate: 4,
              reflect: 4,
              absorbed: 4
            }
          },
          {
            label: "不错",
            desc:
              "本次作品效果不错，能够运用课程所学知识，按照要求完成作品，表扬！",
            rate: {
              logical: 3,
              innovate: 3,
              create: 3,
              communicate: 3,
              reflect: 3,
              absorbed: 3
            }
          },
          {
            label: "再认真一点",
            desc: "本次作品还有上升的空间，可以再认真一点做出更好的作品哦",
            rate: {
              logical: 2,
              innovate: 2,
              create: 2,
              communicate: 2,
              reflect: 2,
              absorbed: 2
            }
          },
          {
            label: "加把劲",
            desc: "再加把劲，你会做得更好哦！",
            rate: {
              logical: 1,
              innovate: 1,
              create: 1,
              communicate: 1,
              reflect: 1,
              absorbed: 1
            }
          }
        ],
        // 电子贴纸 3D打印
        //获取3D贴纸与电子打印页面
        //任务详情信息
        stickerPrint: {
          taskName: "",
          stuName: "",
          releaseTime: "",
          className: "",
          status: "",
          desc: '',
          require: '',
          picture: [],
          videoUrl: ''
        },

      };
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      this.missionId = this.$store.state.taskDetail.missionId
      this.showOpenTogg = false
      if (!this.$store.state.taskDetail) {
        this.$router.replace({path: '/taskMan/see/' + this.$route.params.taskId})
        this.isSaveRate = true;
        this.isReleaseble = true;
        return;
      }
      this.iframeUrl = storageUtil.readWorksDetail().worksUrl || "http://www.alsrobot.vip/scratch/index.html"  //http://192.168.1.187:8080/scratch/index.html?id=111&edit=true
      if (this.$store.state.taskDetail.souceType == 1
        || this.$store.state.taskDetail.souceType == 2) {
        const loading = promptUtil.loading(this);
        getStudentReportDetail(
          qs.stringify({
            // 根据id获取任务评价详情
            school_id: storageUtil.readTeacherInfo().school_id,
            task_id: this.$store.state.taskDetail.reportId
          })
        ).then(res => {
          loading.close();
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data == '[]') {
              promptUtil.wait(this);
              return
            }
            this.taskDetail.mission = res.data.mission
            this.reportName = res.data.taskspec
            this.currentEvaluateDetail.desc = res.data.evaluation;
            this.genDimension(res.data.dimension);
          } else {
            promptUtil.wait(this);
          }
        })
          .catch(err => {
            promptUtil.LOG("getStudentReportDetail-err", err);
          });
      }
      this.rateArrays = stringUtil.getEvaluateArray();
      this.initTopBaseInfo();

      //查看电子贴纸与电子打印

      getTaskTypeInformation(qs.stringify({
        school_id: storageUtil.readTeacherInfo().school_id,
        task_id: this.$store.state.taskDetail.taskId,
        student_id: this.$store.state.taskDetail.studentId
      })).then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.assignmentData(res.data)
          }
        } else if (res.code == ERROR_CODE) {
          promptUtil.error(this, res.msg)
        } else {
          promptUtil.wait(this)
        }
      }).catch(err => {
        promptUtil.LOG("getTaskTypeInformation-err", err)
      })


    },
    updated() {
      //加载iframe
      var $dom = document.getElementById("teacher_scratch");
      var that = this
      if ($dom) {
        if ($dom.attachEvent) {
          $dom.attachEvent("onload", function () {
            that.stratchloading = false
          });
        } else {
          $dom.onload = function () {
            that.stratchloading = false
          };
        }
      }
    },
    methods: {
        handleClose(done) {
            done();
        },
      // 返回列表响应
      handleReturnTaskList() {
        this.$router.replace({
          path: "/taskMan/see/" + this.$route.params.taskId
        });
      },
      // 评价学生任务发布
      handleReleaseEvaluate() {
        const loading = promptUtil.loading(this)
        // 1 查看点评 0 创建点评 2 继续点评
        if (this.$store.state.taskDetail.souceType == 2) {
          releaseEditCourseReport(qs.stringify(this.genRateDataUpdate(this.reportName)))
            .then(res => {
              loading.close();
              if (res.code == SUCCESS_CODE) {
                promptUtil.success(this, res.msg);
                this.$router.replace({
                  path: "/taskMan/see/" + this.$route.params.taskId
                });
                this.$store.dispatch("setTaskDetail", {
                  souceType: 2
                }); // 触发消息action调用  继续点评
              } else {
                promptUtil.wait(this);
              }
            }).catch(err => {
            loading.close();
            promptUtil.LOG("releaseEditCourseReport-err", err);
          });
        } else if (this.$store.state.taskDetail.souceType == 0) {
          releaseCreateCourseReport(qs.stringify(
            this.genRateData(),
            // this.reportID
          ))
            .then(res => {
              loading.close();
              if (res.code == SUCCESS_CODE) {
                promptUtil.success(this, res.msg);
                this.$store.dispatch("setTaskDetail", {
                  souceType: 1
                }); // 触发消息action调用
              } else {
                promptUtil.wait(this);
              }
            }).catch(err => {
            loading.close();
            promptUtil.LOG("releaseCreateCourseReport-err", err);
          });
        }
      },
      // 评价学生任务保存
      handleSaveEvaluate() {
        const loading = promptUtil.loading(this);
        // 1 查看点评 0 创建点评 2 继续点评
        if (this.$store.state.taskDetail.souceType == 0) {
          createCourseReport(qs.stringify(this.genRateData()))
            .then(res => {
              loading.close();
              if (res.code == SUCCESS_CODE) {
                if (res.data&&res.data!='[]'){
                  this.reportID=res.data[0].id
                  promptUtil.success(this, res.msg);
                  this.$store.dispatch("setTaskDetail", {
                    souceType: 2
                  }); // 触发消息action调用  继续点评
                }

              } else {
                promptUtil.wait(this);
              }
            })
            .catch(err => {
              loading.close();
              promptUtil.LOG("createCourseReport-err", err);
            });
        } else if (this.$store.state.taskDetail.souceType == 2) {
          saveCourseReport(qs.stringify(
            this.genRateDataUpdate(this.reportName),
          ))
            .then(res => {
              loading.close();
              if (res.code == SUCCESS_CODE) {
                promptUtil.success(this, res.msg);
              } else if (res.code == ERROR_CODE) {
                promptUtil.error(this, res.msg)
              } else {
                promptUtil.wait(this);
              }
            })
            .catch(err => {
              loading.close();
              promptUtil.LOG("saveCourseReport-err", err);
            });
        }
      },
      // 生成评价信息
      genRateData() {
        this.storeTaskId = this.storeTaskId && this.storeTaskId != "" ? this.storeTaskId : this.$store.state.taskDetail.taskId
        //this.storeReportId = this.storeReportId && this.storeReportId != "" ? this.storeReportId : this.$store.state.taskDetail.reportId
        this.storeReportId=this.reportID?this.reportID:(this.storeReportId && this.storeReportId != "" ? this.storeReportId : this.$store.state.taskDetail.reportId)
        this.storeStudentId = this.storeStudentId && this.storeStudentId != "" ? this.storeStudentId : this.$store.state.taskDetail.studentId
        const formData = {
          school_id: storageUtil.readTeacherInfo().school_id,
          teacher_id: storageUtil.readTeacherInfo().id,
          task_id: this.storeTaskId,
          student_id: this.storeStudentId,
           report_id: this.storeReportId,
          name:
            this.taskDetail.taskName +
            "-" +
            this.taskDetail.stuName +
            "的任务报告",
          type: 2,
          comment: this.currentEvaluateDetail.desc,
          video: "",
          picture: "",
          dimensionValues: JSON.stringify(this.currentEvaluateDetail.rate)
        };
        return formData;
      },
      // 生成评价信息
      genRateDataUpdate(name) {
        const formData = this.genRateData()
        formData.name = name
        return formData;
      },

      // 初始化基本信息
      initTopBaseInfo() {
        const baseInfo = storageUtil.readTeacherInfo();
        // 用户头像
        this.userBaseInfo.avatar = baseInfo.avatar;
        // 任务详情
        this.taskDetail = this.$store.state.taskDetail;
        this.taskDetail.status =
          this.$store.state.taskDetail.status == 0 ? "未发布" : "已发布";
      },
      // 根据请求数据返回对应的六位图数据
      genDimension(dimension) {
        this.currentEvaluateDetail.rate.logical = dimension[0];
        this.currentEvaluateDetail.rate.absorbed = dimension[1];
        this.currentEvaluateDetail.rate.reflect = dimension[2];
        this.currentEvaluateDetail.rate.communicate = dimension[3];
        this.currentEvaluateDetail.rate.create = dimension[4];
        this.currentEvaluateDetail.rate.innovate = dimension[5];
      },
      // 快速评价响应
      onQuickRateClick(item) {
        this.currentEvaluateDetail = item;
      },
      // 退出触发方法
      logout() {
        const loading = promptUtil.loading(this);
        setTimeout(() => {
          loading.close();
          // 清除登录状态
          storageUtil.logout();
          // 跳转到登录页面
          this.$router.replace({path: `/login`});
        }, 500);
      },
      // 下拉框处理
      handleCommand(command) {
        if (command === "logout") {
          this.logout();
        } else if (command === "persoinfo") {
          const loading = promptUtil.loading(this);
          //获取个人信息
          getTeacherInfoById(
            qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id: storageUtil.readTeacherInfo().id
            })
          )
            .then(res => {
              if (res.code == SUCCESS_CODE) {
                if (res.data && res.data != '[]') {
                  this.gridData = res.data;
                  if (this.gridData.classes == "") {
                    this.gridData.classes = {className: "", classOwn: []};
                  }
                } else {
                  promptUtil.wait(this);
                }
                this.dialogFormVisible = true;
              } else {
                promptUtil.wait(this);
              }
              loading.close();
            })
            .catch(err => {
              loading.close();
              promptUtil.LOG("getTeacherInfoById-err", err);
            });
        }
      },
      //table切换
      handleClick(tab, event) {
        if (tab.name == "second") {
          this.$refs.ruleForm.resetFields();
          this.ruleForm.currentmp = this.gridData.phone;
        }
      },
      getCode() {
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      },
      closeToggIcon() {
        this.elAside = false
        // $(".openTogg").show();
        // $(".closeTogg").hide();
        this.showOpenTogg = true
        this.showCloseTogg = false
      },

      openToggIcon() {
        this.elAside = true
        // $(".openTogg").hide();
        // $(".closeTogg").show();
        this.showOpenTogg = false
        this.showCloseTogg = true
      },

      //3d打印 电子贴纸获取信息
      //获取3D打印与电子贴纸信息页面
      assignmentData(data) {
        this.stickerPrint.taskName = data.task_name,
          this.stickerPrint.stuName = data.student_name,
          this.stickerPrint.releaseTime = data.endtime,
          this.stickerPrint.className = data.class_name,
          this.stickerPrint.taskMission = data.task_mission,
          this.stickerPrint.status = data.is_submit == 1 ? "已发布" : "未发布",
          this.stickerPrint.workeRequire = data.task_des,
          this.stickerPrint.require = data.mission_id == 2 ? "电子贴纸" : "3D打印",
          this.stickerPrint.picture = data.pic,
          this.stickerPrint.videoUrl = data.video,
          this.stickerPrint.desc = data.title
      },
    },
    created() {
      this.hei =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    },
    watch: {
      ruleForm: {
        handler(newVal, oldVal) {
          //当输入手机号时 验证码图标变换颜色
          if (verifyUtil.isPhone(newVal.currentmp)) {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
        },
        deep: true
      }
    }
  };
</script>

<style scoped>
  .buttonStyle>.btn:hover{
    color: #409EFF;
    background-color: transparent !important;
  }
  .el-button:focus,
  .el-button:hover {
    color: #fff;
    background-color: #9966ff;
  }
  .home {
    background-color: #eee;
  }

  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
  }

  .el-container {
    height: 100%;
    position: relative;
  }

  .el-aside {
    background-color: #abc4dc;
  }

  .closeTogg {
    position: absolute;
    top: 6%;
    left: 465px;
    z-index: 66666;

  }

  .closeToggIcon {
    cursor: pointer;
    /*width: 50px;*/
    /*height: 50px;*/
    font-size: 16px;
    /*background-color: rgb(153, 102, 255);*/
    /*background-color:rgba(0,0,9966ff,0.5);*/
    /*border-radius: 50px;*/
    /*color: #fff;*/
    /*line-height: 30px;*/
    /*text-align: center;*/
    width: 20px;
    height: 20px;
    border-radius: 0 20px 20px 0;
    color: #fff;
    background-color: rgb(153, 102, 255);
    opacity: 0.5;
    /*background-color:#fff;*/
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }

  .openTogg {
    /*position: absolute;*/
    /*bottom: 50%;*/
    /*right: 2px;*/
    /*z-index: 5555;*/
    position: absolute;
    top: 6%;
    left: 5px;
    z-index: 66666;
  }

  .openToggIcon {
    /*cursor: pointer;*/
    /*width: 50px;*/
    /*height: 50px;*/
    /*font-size: 36px;*/
    /*!*background-color:red;*!*/
    /*background-color: rgb(153, 102, 255);*/
    /*!*background-color:rgba(0,0,9966ff,0.5);*!*/
    /*border-radius: 50px;*/
    /*color: #fff;*/
    /*line-height: 50px;*/
    /*text-align: center;*/
    cursor: pointer;
    font-size: 16px;
    width: 20px;
    height: 20px;
    border-radius: 0 20px 20px 0;
    color: #fff;
    background-color: rgb(153, 102, 255);
    opacity: 0.5;
    line-height: 20px;
    text-align: center;
    cursor: pointer;

  }

  .el-menu-item {
    font-size: 16px;
  }

  .el-header {
    /* display: flex;
      justify-content: space-between;
      align-items: center; */
    background-color: #9966ff;
  }

  .logo {
    height: 150px;
    background-color: #595963;
    overflow: hidden;
    border-bottom: 0.5px solid #fff;
  }

  .institution {
    margin: auto;
    width: 150px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    text-align: center;
    line-height: 10px;
  }

  .tx {
    height: 50px;
    background-color: #595963;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toggle-btn {
    font-size: 36px;
    color: #989898;
    cursor: pointer;
    line-height: 60px;
  }

  .system-title {
    font-size: 28px;
    color: white;
  }

  .welcome {
    color: white;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-container {
    position: relative;
  }

  .logoout {
    color: #fff;
  }

  /* 下拉菜单 */
  .el-dropdown-link {
    cursor: pointer;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .width {
    width: 50% !important;
  }

  .el-menu {
    border-right: none;
  }

  .right-aside-wrapper {
    width: 400px;
    margin-top: 20px;
    margin-left: 30px;
    background-color: #fff;
  }

  .el-button--primary {
    background-color: #9966ff;
    border-color: #9966ff;
  }

  .el-button.is-disabled,
  .el-button.is-disabled:focus,
  .el-button.is-disabled:hover {
    background-color: #99bbff;
    border-color: #99bbff;
  }
</style>
