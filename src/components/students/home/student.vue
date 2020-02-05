<template>
  <div>
    <el-row :gutter="40" class="relativeNotask">
      <div class="notask" v-if="noTask"></div>
      <div class="noAuthorization" v-if="noAuthorization"></div>
      <div v-if="content" style="margin: 0 20px">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的作品" name="mine">
            <div>
              <el-form :inline="true" :model="mineWorkFilter">
                <el-form-item label="作业/作品名">
                  <el-input v-model="mineWorkFilter.workName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="更新时间">
                  <el-date-picker v-model="mineWorkFilter.updateDate" value-format="yyyy/MM/dd" size="small"
                                  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                  :clearable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="评分状态">
                  <el-select v-model="mineWorkFilter.rateState" placeholder="请选择" size="small">
                    <el-option label="全部状态" value="0"></el-option>
                    <el-option label="已评分" value="1"></el-option>
                    <el-option label="未评分" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="作品状态">
                  <el-select v-model="mineWorkFilter.publishState" placeholder="请选择" size="small">
                    <el-option label="全部状态" value="0"></el-option>
                    <el-option label="已发布" value="1"></el-option>
                    <el-option label="未发布" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div
                style="flex:1;display:flex;justify-content:center;align-items:center;margin-bottom:10px;margin-top:-10px;">
                <el-button size="small" @click="resetMineFilter" plain>重置</el-button>
                <el-button type="primary" size="small" @click="queryMineFilter" :loading="isMineFilterLoading">查询
                </el-button>
              </div>
            </div>
            <el-table :data="formData" v-loading="isTableLoading" style="width: 100%"
                      :header-row-style="{'color':'#409EFF'}">
              <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
              <el-table-column label="作业名称">
                <template slot-scope="scope">
                  <div>{{scope.row.taskName}}</div>
                  <div style="font-size:10px;color:#999">{{scope.row.workName}}</div>
                </template>
              </el-table-column>
              <el-table-column label="作品类型" width="120">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.type==1" effect="plain">Scratch3.0</el-tag>
                  <el-tag v-if="scope.row.type==2" effect="plain">电子贴纸</el-tag>
                  <el-tag v-if="scope.row.type==3" effect="plain">3D打印</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="教师评价" width="150">
                <template slot-scope="scope">
                  <el-rate v-model="scope.row.rate" disabled text-color="#ff9900"></el-rate>
                </template>
              </el-table-column>
              <el-table-column label="作品状态" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.complete==1" style="color:#67C23A">已完成</div>
                  <div v-if="scope.row.complete==0" style="color:#E6A23C">未完成</div>
                </template>
              </el-table-column>
              <el-table-column label="更新时间" width="160">
                <template slot-scope="scope">{{scope.row.updateTime}}</template>
              </el-table-column>
              <el-table-column prop="teacherName" label="评分人" width="100"></el-table-column>
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain
                             @click="seeWorksDetail({index: scope.$index, row:scope.row})" class="no-margin">查看作品
                  </el-button>
                  <el-button
                    v-if="scope.row.type!=1 || scope.row.complete!=1 || !scope.row.shareUrl||scope.row.shareUrl==''"
                    disabled size="mini" type="primary" plain class="no-margin">分享
                  </el-button>
                  <el-popover v-else placement="top" width="150" trigger="hover">
                    <div
                      style="width:100%;height: 150px;display: flex;justify-content: center;align-items: center;margin-top: 5px">
                      <vue-qr :text="scope.row.shareUrl" :logoSrc="require('../../../../static/images/base/logo.jpg')"
                              colorDark="#00a2ff" colorLight="#fff" :margin="0" :logoScale="0.4" :size="130"></vue-qr>
                    </div>
                    <div style="margin-top: 10px;text-align:center">手机微信扫码试玩</div>
                    <el-button slot="reference" size="mini" type="primary" plain class="no-margin">分享</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <div style="display:flex;justify-content:center;margin-top:20px;" v-show="serverDataList>0">
              <el-pagination
                background @current-change="serverDataChange"
                :current-page="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next, jumper" :total="serverDataList">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我的考试" name="exam">
            <div>
              <el-form :inline="true" :model="examFilter">
                <el-form-item label="考试名称">
                  <el-input v-model="examFilter.examName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="考试时间">
                  <el-date-picker v-model="examFilter.updateDate" value-format="yyyy/MM/dd" size="small"
                                  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                  :clearable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="及格">
                  <el-select v-model="examFilter.passState" placeholder="请选择" size="small">
                    <el-option label="全部" value="-1"></el-option>
                    <el-option label="及格" value="1"></el-option>
                    <el-option label="不及格" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div
                style="flex:1;display:flex;justify-content:center;align-items:center;margin-bottom:10px;margin-top:-10px;">
                <el-button size="small" @click="resetExamFilter" plain>重置</el-button>
                <el-button type="primary" size="small" @click="queryExamFilter" :loading="isExamFilterLoading">查询
                </el-button>
              </div>
            </div>
            <el-table :data="formStudentData" v-loading="isExamLoading" style="width: 100%"
                      :header-row-style="{'color':'#409EFF'}">
              <el-table-column prop="examName" label="考试名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="startDate" label="开始时间" width="180"></el-table-column>
              <el-table-column prop="endDate" label="结束时间" width="180"></el-table-column>
              <el-table-column prop="examTime" label="考试时长" width="180"></el-table-column>
              <el-table-column label="考试分数" width="120">
                <template slot-scope="scope">
                  <div>{{(scope.row.score*1).toFixed(1)}}/{{(scope.row.totalScore*1).toFixed(1)}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="pass" label="及格" width="100">
              </el-table-column>
              <el-table-column label="评分人" width="150">机器阅卷</el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain
                             @click="onClickIntoExam({index: scope.$index, row:scope.row})" class="no-margin">进入考试
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="display:flex;justify-content:center;margin-top:20px;" v-show="serverStudentDataList>0">
              <el-pagination
                background @current-change="serverStudentDataChange"
                :current-page="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next, jumper" :total="serverStudentDataList">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="作品统计" name="statistics">
            <el-row style="margin-top:10px;margin-bottom:20px;">
              <el-col :span="24"><span style="font-weight: bold;">作品统计图</span></el-col>
            </el-row>
            <el-form>
              <el-form-item label="选择月份">
                <el-date-picker v-model="statisticsVal" :clearable="false" type="month" value-format="M"
                                placeholder="选择月" @change="onChangeMonth" size="small"></el-date-picker>
              </el-form-item>
            </el-form>
            <div id="workEchart" class="echart-wrapper"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-row>
    <als-exam-dialog ref="alsStudentExamDialog"></als-exam-dialog>
  </div>
</template>
<script>
    const echarts = require("echarts");
    const moment = require('moment');
    import vueQr from "vue-qr";
    import PubSub from "pubsub-js";
    import promptUtil from "../../../utils/promptUtil";
    import storageUtil from "../../../utils/storageUtil";
    import timeUtil from "../../../utils/timeUtil";
    import examinationDialog from '../../../components/component/examinationDialog'
    import '../../../api/restfulapi';
    import {
        qs,
        checkStudentPwd,
        getStudentTaskList,
        authorization,
        statisticsWorks,
        getExamStudentList,
        getStudentExam,
        submitPapers,
        startExam
    } from "../../../api/api";
    export default {
        components: {'vue-qr': vueQr, 'als-exam-dialog': examinationDialog},
        data() {
            return {
                delDialogVisible: false,
                isLoadingWithDel: false,
                targetData: "",
                currentPage: 1,
                pageSize: 10,
                isTableLoading: true,
                isExamLoading: true,
                isMineFilterLoading: false,
                isExamFilterLoading: false,
                activeName: 'mine',  // mine exam statistics
                mineWorkFilter: {workName: '', updateDate: '', rateState: "", publishState: ""},
                examFilter: {examName: '', updateDate: '', passState: ""},
                // otherWorkFilter:{workName:'',updateDate:'',publishState:""},
                authorizationStatus: '',//是否授权
                formData: [],
                serverData: [],
                scratchData: [],
                formStudentData: [],
                serverStudentData: [],
                content: true,
                noTask: false,
                noAuthorization: false,
                statisticsVal: moment().startOf('month').format('M'),
                eChart: {teachers: ''},
                eChartData: {weeks: [], all: [], ok: [], no: []}
            };
        },
        computed: {
            serverDataList: {
                get() {
                    return this.serverData.length
                }
            },
            serverStudentDataList: {
                get() {
                    return this.serverStudentData.length
                }
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            if (storageUtil.readToken()) {
                this.initData()
                PubSub.publish("currentMenuIndex", "/student");
                //未授权页面
                authorization(qs.stringify({
                    id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    this.authorizationStatus = res
                    if (this.authorizationStatus == 5) {
                        this.noAuthorization = true
                        this.content = false
                    } else {
                        this.noAuthorization = false
                        this.content = true
                        this.getMineFormData()
                    }
                }).catch(err => {
                    promptUtil.LOG('authorization-err', err)
                })
            } else {
                this.$router.replace({path: '/login'})
            }
          PubSub.subscribe("refreshStudentExamList", (msg, data) => { // 考试dialog退出时刷新学生考试列表
            this.isExamLoading = true
            this.getExamFormData()
          });
        },
        methods: {
            initData() {
                this.mineWorkFilter.updateDate = [((timeUtil.getCurrWeekDays("/")).split("-"))[0], ((timeUtil.getCurrWeekDays("/")).split("-"))[1]]
                this.examFilter.updateDate = [((timeUtil.getCurrWeekDays("/")).split("-"))[0], ((timeUtil.getCurrWeekDays("/")).split("-"))[1]]
            },
            seeWorksDetail(data) {
                this.$store.dispatch("saveStudentTaskId", {
                    taskId: data.row.worksId,
                    complete: data.row.complete,
                    worksUrl: data.row.worksUrl,
                    className: data.row.className,
                    taskName: data.row.taskName,
                    worksName: data.row.worksName,
                    taskDesc: data.row.desc
                }); // 触发消息action调用
                storageUtil.saveWorksDetail({ // 为scratch3.0准备相应参数
                    stuId: storageUtil.readTeacherInfo().id,
                    taskId: data.row.worksId,
                    worksName: data.row.worksName,
                    valId: data.row.type,
                    complete: data.row.complete,
                });
                this.$router.push({path: "/student/task"});
            },
            queryMineFilter() {
                this.isMineFilterLoading = true
                this.isTableLoading = true
                this.getMineFormData()
            },
            queryExamFilter() {
                this.isExamFilterLoading = true
                this.isExamLoading = true
                this.getExamFormData()
            },
            resetMineFilter() {
                this.mineWorkFilter = {
                    workName: '',
                    updateDate: [((timeUtil.getCurrWeekDays("/")).split("-"))[0], ((timeUtil.getCurrWeekDays("/")).split("-"))[1]],
                    rateState: "",
                    publishState: ""
                }
            },
            resetExamFilter() {
                this.examFilter = {
                    examName: '',
                    updateDate: [((timeUtil.getCurrWeekDays("/")).split("-"))[0], ((timeUtil.getCurrWeekDays("/")).split("-"))[1]],
                    passState: "",
                    submitState: ""
                }
            },
            getMineFormData() {
                const dateFrame = this.mineWorkFilter.updateDate && this.mineWorkFilter.updateDate != '' ? this.mineWorkFilter.updateDate : [0, 0]
                getStudentTaskList(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        student_id: storageUtil.readTeacherInfo().id,
                        works_name: this.mineWorkFilter.workName,
                        rate_status: this.mineWorkFilter.rateState,
                        publish_status: this.mineWorkFilter.publishState,
                        start_date: dateFrame[0],
                        end_date: dateFrame[1],
                    })
                ).then(res => {
                    PubSub.publish("currentMenuIndex", "/student");
                    if (res.code == SUCCESS_CODE) {
                        this.serverData = []
                        if (res.data && res.data != '[]') {
                            res.data.map(item => {
                                const obj = {
                                    className: item.className,
                                    taskName: item.taskName,
                                    teacherName: (item.tasks.teacher_name && item.tasks.teacher_name != "") ? item.tasks.teacher_name : '--',
                                    shareUrl: item.tasks.share_url,
                                    workName: item.tasks.worksName,
                                    rate: item.tasks.rate,
                                    type: item.mission_id,
                                    complete: item.tasks.complete,
                                    updateTime: (item.tasks.update_time && item.tasks.update_time != "" && item.tasks.update_time != 0) ? moment(item.tasks.update_time * 1000).format("YYYY-MM-DD hh:mm:ss") : '--',
                                    worksUrl: item.tasks.worksUrl,
                                    worksId: item.tasks.taskId,
                                    desc: item.desc
                                }
                                this.serverData.push(obj)
                            })
                            this.serverDataChange(this.currentPage)
                        } else {
                            this.currentPage = 1
                            this.serverDataChange(this.currentPage)
                        }
                        this.isTableLoading = false
                    } else {
                        promptUtil.wait(this);
                    }
                    this.isTableLoading = false
                    this.isMineFilterLoading = false
                }).catch(err => {
                    promptUtil.LOG('getStudentTaskList-err', err)
                    this.isTableLoading = false
                    this.isMineFilterLoading = false
                });
            },
            getExamFormData() {
                const loading = promptUtil.loading(this)
                const dateFrame = this.examFilter.updateDate && this.examFilter.updateDate != '' ? this.examFilter.updateDate : [0, 0]
                getExamStudentList(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    student_id: storageUtil.readTeacherInfo().id,
                    start_date: dateFrame[0],
                    end_date: dateFrame[1],
                    jige: this.examFilter.passState
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.serverStudentData = []
                        this.currentPage = 1
                        if (res.data && res.data != '[]') {
                            res.data.map(item => {
                                let timeObj = timeUtil.getTimestamp2String(item.long * 1000)
                                let obj = {
                                    id: item.id*1,
                                    examName: item.name,
                                    examTime: timeObj.hour + '小时' + timeObj.minute + '分',
                                    totalScore: item.paper_score*1,
                                    ctime: item.ctime, // 创建时间
                                    score: item.score*1,
                                    pass: item.jige,
                                    startDate: item.start,
                                    endDate: item.end,
                                    status: item.status*1, // 1 已经考过 0 未考过
                                }
                                this.serverStudentData.push(obj)
                            })
                            this.serverStudentDataChange(this.currentPage)
                        } else {
                            this.serverStudentDataChange(this.currentPage)
                        }
                    } else {
                        promptUtil.wait(this);
                    }
                    loading.close()
                    this.isExamLoading = false
                    this.isExamFilterLoading = false
                }).catch(err => {
                    loading.close()
                    promptUtil.LOG('getExamStudentList-err', err)
                })
            },
            checkExamFinished(data) {
                console.log("考试开始时间", moment.unix(data.time).format("YYYY-MM-DD HH:mm:ss"))
                let value = 0
                const currentTimestamp = new Date().getTime()
                if (data.answer && data.answer != "") {
                    // 进入查看分数
                    value = 3
                } else {
                    // 开始考试或继续考试
                    if (data.start != 0) { // 0 开始考试， 1 继续考试
                        // 继续考试
                        value = 1
                    } else {
                        // 开始考试
                        value = 0
                    }
                }
                return {type: value, offset: data.long - Math.round(currentTimestamp / 1000 - data.start)}
            },
            onClickIntoExam(obj) {
                const loading = promptUtil.loading(this)
                getStudentExam(qs.stringify({
                    student_id: storageUtil.readTeacherInfo().id,
                    paper_id: obj.row.id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        const {type, offset} = this.checkExamFinished(res.data)
                        if ((new Date(obj.row.endDate).getTime()) < (new Date().getTime())) { // 考试已结束
                            submitPapers(qs.stringify({
                                id: res.data.id
                            })).then(subRes => {
                                if (subRes.code == SUCCESS_CODE) {
                                    this.$refs.alsStudentExamDialog.show(subRes.data, 3)
                                }
                                loading.close()
                            }).catch(err => {
                                promptUtil.LOG('submitPapers-err', err)
                                loading.close()
                            })
                        } else {
                            if (type == 3) {
                                submitPapers(qs.stringify({
                                    id: res.data.id
                                })).then(subRes => {
                                    if (subRes.code == SUCCESS_CODE) {
                                        this.$refs.alsStudentExamDialog.show(subRes.data, type)
                                    }
                                    loading.close()
                                }).catch(err => {
                                    promptUtil.LOG('submitPapers-err', err)
                                    loading.close()
                                })
                            } else {
                                if (type == 1) { // 继续考试
                                    // 继续考试...
                                    res.data.long = offset
                                    this.$refs.alsStudentExamDialog.show(res.data, type)
                                    loading.close()
                                } else {
                                    startExam(qs.stringify({id: res.data.id})).then(startRes => {
                                        if (startRes.code == SUCCESS_CODE) {
                                            // 开始考试...
                                            this.$refs.alsStudentExamDialog.show(res.data, type)
                                        } else {
                                            promptUtil.warning(this, startRes.msg)
                                        }
                                        loading.close()
                                    }).catch(err => {
                                        loading.close()
                                        promptUtil.LOG("startExam-err", err)
                                    })
                                }
                            }
                        }
                    } else {
                        loading.close()
                        promptUtil.warning(this, res.msg)
                    }
                }).catch(err => {
                    promptUtil.LOG("getExamDetailById-err", err)
                    loading.close()
                })
            },
            // 设置当前table索引
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * this.pageSize;
            },
            serverDataChange(val) {
                this.currentPage = val
                this.formData = this.serverData.slice((this.currentPage - 1) * this.pageSize, this.pageSize + (this.currentPage - 1) * this.pageSize)
            },
            serverStudentDataChange(val) {
                this.currentPage = val
                this.formStudentData = this.serverStudentData.slice((this.currentPage - 1) * this.pageSize, this.pageSize + (this.currentPage - 1) * this.pageSize)
            },
            genEchart() {
                this.eChart.teachers = this.eChart.teachers && this.eChart.teachers != '' ? this.eChart.teachers : echarts.init(document.getElementById('workEchart'))
                const option = {
                    color: ['#006699', '#4cabce', '#e5323e'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['全部作品', '已发布作品', '未发布作品']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {show: false},
                            data: this.eChartData.weeks
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '全部作品',
                            type: 'bar',
                            barGap: 0,
                            data: this.eChartData.all
                        },
                        {
                            name: '已发布作品',
                            type: 'bar',
                            data: this.eChartData.ok
                        },
                        {
                            name: '未发布作品',
                            type: 'bar',
                            data: this.eChartData.no
                        }
                    ]
                };
                this.eChart.teachers.setOption(option)
            },
            onChangeMonth(val) {
                this.getStatisticsWorks(val)
            },
            getStatisticsWorks(val) {
                const loading = promptUtil.loading(this)
                const dateFrame = timeUtil.getTargetMonthDays(val, "/").split("-")
                statisticsWorks(qs.stringify({
                    student_id: storageUtil.readTeacherInfo().id,
                    start_date: dateFrame[0],
                    end_date: dateFrame[1]
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.date != '[]') {
                            this.eChartData = res.data
                            this.genEchart()
                        }
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG('getStatisticsWorks-err', err)
                    loading.close()
                })
            },
            handleClick(tab) {
                if (tab.index == 0) { // 我的作业
                    this.isTableLoading = true
                    this.getMineFormData()
                } else if (tab.index == 1) { // 我的考试
                    this.isExamLoading = true
                    this.getExamFormData()
                } else if (tab.index == 2) { // 统计页面
                    setTimeout(() => {
                        this.getStatisticsWorks(this.statisticsVal)
                    }, 200)
                }
            }
        }
    };
</script>
<style scoped>
  .relativeNotask {
    position: relative;
  }

  .notask {
    background: url(../../../../static/images/base/notask.png) no-repeat;
    background-size: cover;
    width: 300px;
    height: 400px;
    position: absolute;
    left: 41%;
    top: 300px;
  }

  .noAuthorization {
    background: url(../../../../static/images/base/xuke.png) no-repeat;
    background-size: cover;
    width: 400px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 200px;
    margin-left: -300px;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .no-margin {
    margin: 0;
  }

  .echart-wrapper {
    padding-left: 5px;
    padding-right: 5px;
    height: 400px;
    width: 100%;
    margin-top: 20px;
  }
</style>
