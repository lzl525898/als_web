<template>
  <div>
    <als-child-header :config="routerConfig"/>
    <el-row>
      <el-col :span="24">
        <div style="display:flex;flex:1;justify-content:center">
          <el-radio-group v-model="recordType" @change="changeLogType">
            <el-radio-button label="1">登录日志</el-radio-button>
            <el-radio-button label="2">操作日志</el-radio-button>
            <el-radio-button label="3">上传日志</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px;">
      <div style="display: flex;">
        <div class="v_line"></div>
        <div class="v_line_text">数据范围</div>
      </div>
      <el-row style="margin-left: 20px;margin-top: 20px;">
        <div style="display:flex;align-items: center;">
          <label>日期范围</label>
          <div style="margin-left:20px">
            <el-tooltip class="item" effect="dark" :content="tag.date" placement="top" v-for="(tag,index) in dataTag"
                        :key="index">
              <el-tag :type="tag.type" class="tag_width" :key="index" @click.native="onClickDataTag(tag.id)">
                {{tag.label}}
              </el-tag>
            </el-tooltip>
            <el-date-picker @change="onChangeDatePicker" style="width:220px" size="small" value-format="yyyy/MM/dd"
                            :clearable="false" v-model="dataFrame" type="daterange" range-separator=""
                            start-placeholder="请选择日期"></el-date-picker>
          </div>
          <div style="flex:1;margin-right:0;display:flex;justify-content:flex-end;">
            <el-button size="small" type="primary" @click="onClickQuery" :loading="isLoading">查询</el-button>
          </div>
        </div>
      </el-row>
    </el-card>
    <el-card style="margin-top: 20px;">
      <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;"
           v-show="recordType==1">
        当前结果：<span class="record-span-color">{{loginData.length}}</span>条数据
        <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onExportReport(1)">
          导出>>
        </el-link>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-show="recordType==1" ref="logLoginTable">
        <el-table-column prop="name" label="用户" align="center"></el-table-column>
        <el-table-column label="操作类型" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.type==1" style="color:#67C23A">{{scope.row.handle}}</div>
            <div v-show="scope.row.type==2" style="color:#E6A23C">{{scope.row.handle}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="browser" label="浏览器及版本号" align="center"></el-table-column>
        <el-table-column prop="system" label="操作系统" align="center"></el-table-column>
        <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
        <el-table-column prop="time" label="登录/登出时间" align="center"></el-table-column>
      </el-table>
      <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;"
           v-show="recordType==2">
        当前结果：<span class="record-span-color">{{handleData.length}}</span>条数据
        <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onExportReport(2)">
          导出>>
        </el-link>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-show="recordType==2" ref="logHandleTable">
        <el-table-column prop="handle" label="操作记录"></el-table-column>
        <el-table-column prop="time" label="操作时间" align="center" width="250"></el-table-column>
        <el-table-column prop="name" label="操作人员" align="center" width="250"></el-table-column>
        <el-table-column prop="system" label="操作系统" align="center" width="250"></el-table-column>
        <el-table-column prop="browser" label="浏览器及版本号" align="center" width="250"></el-table-column>
        <el-table-column prop="ip" label="IP地址" align="center" width="250"></el-table-column>
      </el-table>
      <div style="background-color:#D4DFE5;height: 40px;display:flex;align-items:center;padding-left:20px;"
           v-show="recordType==3">
        当前结果：<span class="record-span-color">{{uploadData.length}}</span>条数据
        <el-link type="primary" :underline="false" style="margin-top:1px;margin-left:5px;" @click="onExportReport(3)">
          导出>>
        </el-link>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-show="recordType==3" ref="logUploadinTable">
        <el-table-column prop="name" label="操作人" align="center"></el-table-column>
        <el-table-column prop="time" label="上传时间" align="center"></el-table-column>
        <el-table-column prop="file" label="上传文件格式" align="center"></el-table-column>
        <el-table-column prop="size" label="上传文件大小" align="center"></el-table-column>
      </el-table>
    </el-card>
    <div style="display:flex;justify-content:center;margin-top:20px;" v-show="serverDataList">
      <el-pagination
        background
        @current-change="serverDataChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="serverDataList"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    import PubSub from "pubsub-js"
    import '../../router/router'
    import '../../api/restfulapi'
    import {
        qs,
        getLogInfo,
        getHandleLogInfo,
        exportExcel,
        getUploadLogTableList
    } from '../../api/api'
    import timeUtil from '../../utils/timeUtil'
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../component/childHeader'

    export default {
        components: {"als-child-header": childHeader},
        name: "logInfo",
        data() {
            return {
                routerConfig: [{name: '日志信息', to: ''}],
                recordType: 1, // 1登录  2 操作
                tableData: [],
                loginData: [], // 登录数据
                handleData: [], // 操作数据
                uploadData: [],//上传数据
                dataTag: [
                    {type: "", label: '本月', date: timeUtil.getCurrMonthDays('/'), id: 0},
                    {type: "info", label: '上月', date: timeUtil.getLastMonthDays('/'), id: 1},
                    {type: "info", label: '今日', date: timeUtil.getCurrDays('/'), id: 2},
                    {type: "info", label: '昨日', date: timeUtil.getYesterday('/'), id: 3},
                    {type: "info", label: '本周', date: timeUtil.getCurrWeekDays('/'), id: 4},
                    {type: "info", label: '上周', date: timeUtil.getLastWeekDays('/'), id: 5},
                    {type: "info", label: '今年', date: timeUtil.getCurrYearDays('/'), id: 6},
                    {type: "info", label: '去年', date: timeUtil.getLastYearDays('/'), id: 7}
                ],
                currentPage: 1,
                pageSize: 15,
                dataFrame: [],
                curDateFrame: [],
                currentDataTag: 0,
                isLoading: false
            }
        },
        computed: {
            serverDataList: {
                get() {
                    if (this.recordType == 1) {
                        return this.loginData.length
                    } else if (this.recordType == 2) {
                        return this.handleData.length
                    } else {
                        return this.uploadData.length
                    }
                }
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", ROUTER_LOG_INFO)
            this.initData()
        },
        methods: {
            initData() {
                const loading = promptUtil.loading(this)
                if (this.currentDataTag == -1) { // 按日期进行查询
                    this.curDateFrame = this.dataFrame
                } else { // 按tag日期进行查询
                    this.curDateFrame = (this.dataTag[this.currentDataTag].date).split("-")
                }
                this.getLogDataFromServer(loading)
            },
            changeLogType(val) {
                const loading = promptUtil.loading(this)
                if (this.currentDataTag == -1) { // 按日期进行查询
                    this.curDateFrame = this.dataFrame
                } else { // 按tag日期进行查询
                    this.curDateFrame = (this.dataTag[this.currentDataTag].date).split("-")
                }
                if (val == 1) {
                    this.getLogDataFromServer(loading)
                } else if (val == 2) {
                    this.getHandleDataFromServer(loading)
                } else {
                    this.getuploadleDataFromServer(loading)
                }
            },
            onExportReport(type) {
                const moment = require('moment')
                const targetParams = []
                const params = {head: [], body: [], name: ''}
                const startTime = moment(this.curDateFrame[0]).format('YYYYMMDD')
                const endTime = moment(this.curDateFrame[1]).format('YYYYMMDD')
                if (type == 1) {
                    params.name = startTime + '—' + endTime + '登录日志'
                    params.head = ['用户', '操作类型', '浏览器及版本号', '操作系统', 'IP地址', '登录/登出时间']
                    this.loginData.map(item => {
                        const tmpArr = []
                        tmpArr.push(item.name)
                        tmpArr.push(item.handle)
                        tmpArr.push(item.browser)
                        tmpArr.push(item.system)
                        tmpArr.push(item.ip)
                        tmpArr.push(item.time)
                        targetParams.push(tmpArr)
                    })
                } else if(type == 2){
                    params.name = startTime + '—' + endTime + '操作日志'
                    params.head = ['操作记录', '操作时间', '操作人员', '操作系统', '浏览器及版本号', 'IP地址']
                    this.handleData.map(item => {
                        const tmpArr = []
                        tmpArr.push(item.handle)
                        tmpArr.push(item.time)
                        tmpArr.push(item.name)
                        tmpArr.push(item.system)
                        tmpArr.push(item.browser)
                        tmpArr.push(item.ip)
                        targetParams.push(tmpArr)
                    })
                }else{
                    params.name = startTime + '—' + endTime + '上传日志'
                    params.head = ['操作人', '上传时间', '上传文件格式', '上传文件大小']
                    this.uploadData.map(item => {
                        const tmpArr = []
                        tmpArr.push(item.name)
                        tmpArr.push(item.time)
                        tmpArr.push(item.file)
                        tmpArr.push(item.size)
                        targetParams.push(tmpArr)
                    })

                }
                params.body = targetParams
                exportExcel(qs.stringify({data: JSON.stringify(params)})).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, '数据准备完毕,等待下载中')
                        window.open(res.data, "_self")
                    }
                }).catch(err => {
                    promptUtil.LOG('exportExcel-err', err)
                })
            },
            onClickQuery() {
                this.isLoading = true
                if (this.currentDataTag == -1) { // 按日期进行查询
                    this.curDateFrame = this.dataFrame
                } else { // 按tag日期进行查询
                    this.curDateFrame = (this.dataTag[this.currentDataTag].date).split("-")
                }
                const loading = promptUtil.loading(this)
                if (this.recordType == 1) {
                    this.getLogDataFromServer(loading)
                } else if (this.recordType == 2) {
                    this.getHandleDataFromServer(loading)
                } else {
                    this.getuploadleDataFromServer(loading)
                }
            },
            getHandleDataFromServer(loading) {
                getHandleLogInfo(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date: this.curDateFrame[0],
                    end_date: this.curDateFrame[1]
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.handleData = res.data
                            this.serverDataChange(this.currentPage)
                        }
                    }
                    this.isLoading = false
                    if (loading) {
                        loading.close()
                    }
                }).catch(err => {
                    if (loading) {
                        loading.close()
                    }
                    promptUtil.LOG('getLogInfo-err', err)
                })
            },
            getLogDataFromServer(loading) {
                getLogInfo(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date: this.curDateFrame[0],
                    end_date: this.curDateFrame[1]
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.loginData = res.data
                            this.serverDataChange(this.currentPage)
                        }
                    }
                    this.isLoading = false
                    if (loading) {
                        loading.close()
                    }
                }).catch(err => {
                    if (loading) {
                        loading.close()
                    }
                    promptUtil.LOG('getLogInfo-err', err)
                })
            },
            getuploadleDataFromServer(loading) {
                const moment = require('moment')
                getUploadLogTableList(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    start_date: this.curDateFrame[0],
                    end_date: this.curDateFrame[1]
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.uploadData=[]
                            this.uploadData.length=0
                            res.data.size = res.data.size /1024/1024
                            res.data.forEach(item => {
                                const obj = {
                                    name: item.user_name,
                                    time: moment(item.create_time*1000).format('YYYY-MM-DD HH:mm:ss'),
                                    file: item.file_type,
                                    size: Math.floor((item.size/1024/1024) * 100) / 100+'MB'
                                }
                                this.uploadData.push(obj)
                                this.serverDataChange(this.currentPage)
                            })
                        }else{
                            this.uploadData=[]
                            this.serverDataChange(this.currentPage)
                        }
                    }
                    this.isLoading = false
                    if (loading) {
                        loading.close()
                    }
                }).catch(err => {
                    if (loading) {
                        loading.close()
                    }
                    promptUtil.LOG('getLogInfo-err', err)
                })
            },
            serverDataChange(val) {
                this.currentPage = val
                if (this.recordType == 1) {
                    this.tableData = this.loginData.slice((this.currentPage - 1) * this.pageSize,
                        this.pageSize + (this.currentPage - 1) * this.pageSize)
                } else if (this.recordType == 2) {
                    this.tableData = this.handleData.slice((this.currentPage - 1) * this.pageSize,
                        this.pageSize + (this.currentPage - 1) * this.pageSize)
                } else {
                    this.tableData = this.uploadData.slice((this.currentPage - 1) * this.pageSize,
                        this.pageSize + (this.currentPage - 1) * this.pageSize)
                }
            },
            onClickDataTag(id) {
                if (this.currentDataTag != -1) { // 没有选择任何一个
                    this.dataTag[this.currentDataTag].type = "info"
                }
                this.dataFrame = ""
                this.dataTag[id].type = ""
                this.currentDataTag = id
            },
            onChangeDatePicker(date) {
                this.dataTag[this.currentDataTag].type = "info"
                this.currentDataTag = -1
                this.dataFrame = date
            },
        }
    }
</script>

<style scoped>
  .v_line {
    height: 20px;
    width: 3px;
    background-color: #00a2ff;
  }

  .v_line_text {
    line-height: 20px;
    margin-left: 5px;
  }

  .tag_width {
    width: 60px;
    text-align: center;
    margin-right: 20px;
  }

  .tag_width:hover {
    cursor: pointer;
  }
</style>
