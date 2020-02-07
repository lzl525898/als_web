<template>
    <div>
      <el-row>
        <div style="font-size: 20px;font-weight:bold">直播课</div>
        <el-card v-if="livingList.length>0" class="box-card" style="width: 100%;margin-top: 20px;" body-style="padding-bottom:10px;padding-right:40px">
          <div style="display:flex;align-items:center;margin-bottom:16px">
            <div style="font-size:16px;font-weight:bold;color:#409EFF;">直播中</div>
            <div style="display:flex;justify-content:flex-end;flex:1">
              <el-button type="primary" size="mini" plain @click="getLiveList(true)" :loading="refreshLoading">刷新</el-button>
            </div>
          </div>
          <el-timeline>
            <als-education-item v-for="(liveItem,index) in livingList" :key="index" @statusFunc="showOnlineDialog($event)"
                                :sign="liveItem.sign"
                                :time="liveItem.time"
                                :code="liveItem.code"
                                :room="liveItem.room"
                                :name="liveItem.name"
                                :avatar="liveItem.teacher.avatar"
                                :phone="liveItem.teacher.phone"
                                :teacher="liveItem.teacher.name"
                                :webUrl="liveItem.web_url"
                                :clientUrl="liveItem.clientUrl"/>
          </el-timeline>
        </el-card>

        <el-card class="box-card" style="width: 100%;margin-top: 20px;">
          <div style="display:flex;align-items:center;height:32px;margin-bottom:16px">
            <div style="font-size: 16px;font-weight:bold;">直播课列表</div>
            <div style="flex:1;display:flex;justify-content:flex-end;">
              <el-button style="" type="primary" size="mini" plain @click="getAllLiveList(true)" :loading="refreshClassLoading">刷新</el-button>
            </div>
          </div>

          <el-table
            :data="tableData"
            border
            style="width: 100%"
            :header-row-style="{'color':'#409EFF'}"
          >
            <el-table-column prop="name" label="课程名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.name}}</div>
                <div style="font-size:12px;display:flex;align-items:center">
                  <el-tooltip class="item" effect="dark" :content="scope.row.teacher.phone" placement="bottom">
                    <i class="el-icon-phone" style="color:#409EFF;cursor:pointer"></i>
                  </el-tooltip>
                  <div>{{scope.row.teacher.name}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="90">
              <template slot-scope="scope">
                <span v-if="scope.row.type=='0'">未开始</span>
                <span v-if="scope.row.type=='1'" style="color:green">上课中</span>
                <span v-if="scope.row.type=='2'" style="color:gray">已结束</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="start" label="开始时间" width="160"></el-table-column>
            <el-table-column align="center" prop="end" label="结束时间" width="160"></el-table-column>
            <el-table-column align="center" prop="status" label="回放状态" width="110">
              <template slot-scope="scope">
                <span v-if="scope.row.status=='0'">未录制</span>
                <span v-if="scope.row.status=='10' || scope.row.status=='20'" style="color:#E6A23C">转码中</span>
                <span v-if="scope.row.status=='30'" style="color:red">生成失败</span>
                <span v-if="scope.row.status=='100'" style="color:green">转码成功</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
              <template slot-scope="scope">
                <el-link
                  size="mini"
                  type="primary"
                  :underline="false"
                  @click="handleClickIntoClassroom({row:scope.row})"
                >进入教室</el-link>
                |
                <el-link
                  size="mini"
                  type="primary"
                  :underline="false"
                  @click="showPlaybackDialog({row:scope.row})"
                >查看回放</el-link>
              </template>
            </el-table-column>
          </el-table>
          <als-pageination  :size="10" @tableData="changeLiveTableData($event)" ref="alsPageinationEducation" style="margin-top:20px;"></als-pageination>
        </el-card>
      </el-row>
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="380px"
        center>
          <div slot="title" style="border-bottom: 1px solid #888889;padding-bottom: 20px">进入教室</div>
          <div style="margin-top: -20px">
            <div>如果未安装或不能打开客户端，请下载最新客户端，客户端观看直播更流畅，功能更强大</div>
            <div style="display:flex;justify-content:center;align-items:center;margin-top:20px;">
              <el-button type="primary" size="large" @click="handleClickDownload">下载客户端</el-button>
              <el-button type="primary" size="large" style="margin-left:20px" @click="handleClickIntoWebClassroom">网页进入教室</el-button>
            </div>
          </div>
      </el-dialog>
      <el-dialog
        :visible.sync="playbackDialogVisible"
        width="400px"
        center
        destroy-on-close>
        <div slot="title" style="border-bottom: 1px solid #888889;padding-bottom: 20px">直播回放</div>
        <div style="margin-top: -20px">
          <el-table
            :data="playbackData"
            border
            style="width: 100%"
            :header-row-style="{'color':'#409EFF'}"
          >
            <el-table-column prop="name" label="课程名称" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="status" label="回放状态" width="110">
              <template slot-scope="scope">
                <span v-if="scope.row.status=='0'">未录制</span>
                <span v-if="scope.row.status=='10' || scope.row.status=='20'" style="color:#E6A23C">转码中</span>
                <span v-if="scope.row.status=='30'" style="color:red">生成失败</span>
                <span v-if="scope.row.status=='100'" style="color:green">转码成功</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="50">
              <template slot-scope="scope">
                <el-link :underline="false" @click="handleClickPlayback(scope.row)" :disabled="scope.row.status!='100'">播放</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import PubSub from 'pubsub-js'
    import pageination from '../../components/commons/pagination/pagination'
    import educationItem from '../../components/component/online/onlineEducationItem/onlineEducationItem'
    import storageUtil from '../../utils/storageUtil'
    import promptUtil from '../../utils/promptUtil'
    import {
        qs,
        getLivingWithStudent,
        getAllLivingWithStudent,
        getPlaybackListWithStudent
    } from '../../api/api'
    import '../../api/restfulapi'
    export default {
        name: "onlineEducation",
        components: {"als-pageination": pageination, "als-education-item": educationItem},
        data(){
            return {
                playbackDialogVisible:false,
                centerDialogVisible:false,
                refreshClassLoading:false,
                refreshLoading:false,
                onlineEducationArray: [],
                tableDataServer: [],
                playbackData: [],
                livingList: [],
                webLiveUrl:'',
                tableData: [],
            }
        },
        mounted(){
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", ROUTER_STUDENT_ONLINE)
            this.initData()
        },
        methods: {
            initData(){
                this.getLiveList()
                this.getAllLiveList()
            },
            getLiveList(loading=false){
                if(loading){
                    this.refreshLoading = loading
                }
                const {school_id, id} = storageUtil.readTeacherInfo()
                getLivingWithStudent(qs.stringify({
                    school_id: school_id,
                    user_id:id
                })).then(res=>{
                    if(res.code==SUCCESS_CODE) {
                        this.livingList = []
                        if (res.data && res.data != '[]') {
                            this.livingList = res.data
                        }
                    }
                    this.refreshLoading = false
                }).catch(err=>promptUtil.LOG('getLivingWithStudent-err',err))
            },
            getAllLiveList(loading=false){
                if(loading){
                    this.refreshClassLoading = loading
                }
                const {school_id, id} = storageUtil.readTeacherInfo()
                getAllLivingWithStudent(qs.stringify({
                    school_id: school_id,
                    user_id:id
                })).then(res=>{
                    if(res.code==SUCCESS_CODE) {
                        this.tableDataServer = []
                        if (res.data && res.data != '[]') {
                            this.tableDataServer = res.data
                        }
                    }
                    this.$refs.alsPageinationEducation.setCurrentPage(1)
                    this.$refs.alsPageinationEducation.setServerData(this.tableDataServer)
                    this.refreshClassLoading = false
                }).catch(err=>promptUtil.LOG('getAllLivingWithStudent-err',err))

            },
            handleClickPlayback(obj){
                this.playbackDialogVisible = false
                window.open(obj.url, "_blank")
            },
            changeLiveTableData(data){
                this.tableData = data
            },
            showOnlineDialog(obj){
                const {status, webUrl, clientUrl} = obj
                this.webLiveUrl = webUrl
                window.location.href = clientUrl
                this.centerDialogVisible = status
            },
            // 进入教室
            handleClickIntoClassroom(obj){
                window.location.href = obj.row.clientUrl
                this.webLiveUrl = obj.row.url
                this.centerDialogVisible = true
            },
            // 查看回放
            showPlaybackDialog(obj){
                const loading = promptUtil.loading(this)
                getPlaybackListWithStudent(qs.stringify({
                    course_id: obj.row.id
                })).then(res=>{
                    if(res.code==SUCCESS_CODE) {
                        this.playbackData = []
                        if(res.data && res.data!='[]'){
                            this.playbackData = res.data
                        }
                    }
                    loading.close()
                    this.playbackDialogVisible = true
                }).catch(err=>{promptUtil.LOG('getPlaybackListWithStudent-err',err),loading.close()})
            },
            handleClickDownload(){
                this.centerDialogVisible = false
                window.location.href="http://111.40.195.240/cache/img.baijiayun.com/video/bjyclient/win/www/bjyclient6.9.3.zip?ich_args2=641-05153611002820_4a77fa21a15b1d1ff223ba6409e5bf3f_10001002_9c896c2cdfcbf9d0913b518939a83798_e3244c0c04322c1f6363d3e2cf7c3172"
            },
            handleClickIntoWebClassroom(){
                window.open(this.webLiveUrl,"_blank")
                this.centerDialogVisible = false

            }
        }
    }
</script>

<style scoped>
  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 5px 12px 0 #00a2ff30;
  }
  .handle-item:hover{
    cursor: pointer;
    color:#409EFF;
  }
</style>
