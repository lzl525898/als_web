<template>
  <div>
    <el-row style="margin-bottom:20px">
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card>
      <div style="padding-bottom:16px">
        <div style="background-color:#E5F3FF;font-size:12px;padding:10px 12px;display:flex;align-items:center;margin-bottom:18px;border-radius:5px">
          <i class="el-icon-info" style="color:#409EFF;font-size:14px"/><span style="margin-left:10px;">仅统计当前 直播点 已合计数据，平均延迟 1-2 小时</span>
        </div>
        <div style="display:flex">
          <el-select v-model="filters.teacher" placeholder="授课教师" size="small" style="width:180px">
            <el-option v-for="item in filters.teachers" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="filters.type" placeholder="课程类型" size="small" style="width:180px;margin-left:10px">
            <el-option v-for="item in filters.types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <div style="display:flex;justify-content:flex-end;flex:1">
            <el-input placeholder="课程名称" v-model="filters.keywords" size="small" style="width:300px">
              <el-button slot="append" icon="el-icon-search" size="small" @click="handleClickSearch">查询</el-button>
            </el-input>
          </div>
        </div>
      </div>
      <div style="border-top:3px solid #EBEEF5;padding-top:10px">
        <div class="live-count-container">可用直播点数：<div class="live-count-number">{{contentData.detail.availablePoints}}<span style="font-size:14px;color:#303133;margin-left:5px">个</span></div>
          <el-popover
            placement="bottom-start"
            width="200"
            trigger="hover"
            content="直播点数在进行大、小班课直播时进行消耗,消耗完后无法进行大、小班直播课直播">
            <el-link :underline="false" slot="reference" style="margin-top:4px;margin-left:5px"><span style="color:#409EFF">什么是直播点数？</span></el-link>
          </el-popover>
          <div style="flex:1;display:flex;justify-content:flex-end">
            <el-popover
              placement="bottom"
              width="150"
              trigger="hover">
              <div>
                <img :src='callUs.img' alt="" style="width: 150px">
                <p style="text-align: center">{{callUs.tel}} </p>
              </div>
              <el-button slot="reference" class="consult-item" size="mini" type="primary" plain>
                <i class="el-icon-service"/><span style="margin-left: 5px">咨询</span>
              </el-button>
            </el-popover>
          </div>
        </div>
        <div style="display: flex;margin: 20px 0;">
          <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
          <div style="line-height:20px;margin-left:5px;">直播点计费记录</div>
        </div>
        <el-table :data="contentData.detail.tableData" show-summary :summary-method="getSummaries"
                  :header-cell-style="{'color':'#353535','fontSize':'16px','background':'#eef1f6'}">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table :data="scope.row.detailData">
                <el-table-column label="用户信息">
                  <template slot-scope="props">
                    <div>
                      <div>{{props.row.nick}}</div>
                      <div class="detail-record-label-item">角色：<span>{{props.row.role}}</span></div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="cType" label="登入端口"></el-table-column>
                <el-table-column prop="firstTime" label="最早进入教室"></el-table-column>
                <el-table-column prop="lastTime" label="最晚离开教室"></el-table-column>
                <el-table-column prop="actualTime" label="上课时长"></el-table-column>
                <el-table-column prop="point" label="消耗直播点数" width="120" align="center"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="课程信息">
            <template slot-scope="scope">
              <div style="display:flex;padding:10px 0 0 10px;">
                <div class="image-cover-wrapper">
                  <img :src="scope.row.cover" class="image-cover"/>
                </div>
                <div style="flex:1;margin-top:8px">
                  <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="right">
                    <div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:250px">
                      <span style="font-weight:600">{{scope.row.name}}</span>
                    </div>
                  </el-tooltip>
                  <div style="font-size:12px">课程类型: <span>{{scope.row.type}}</span></div>
                  <div style="font-size:12px">授课教师: <span>{{scope.row.teacher}}</span></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期" align="center"></el-table-column>
          <el-table-column label="消耗直播点数（单位:个）" width="220" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.count}}</div>
            </template>
          </el-table-column>
        </el-table>
        <als-pagination :size="10" ref="alsCountPagination" @tableData="changeTableData($event)" style="margin-top:20px"/>
      </div>
    </el-card>
  </div>
</template>

<script>
    import PubSub from 'pubsub-js'
    import childHeader from '../component/childHeader'
    import alsPagination from '../commons/pagination/pagination'
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import '../../router/router'
    import {qs,getSchoolDueInfo,getTeacherList,getLivePointDetail} from '../../api/api'
    import '../../api/restfulapi'
    export default {
        name: "livePoints",
        components: {
            "als-child-header": childHeader,
            "als-pagination": alsPagination,
        },
        data(){
            return {
                callUs:{tel:'',img:''},
                filters:{
                    keywords:'',
                    teacher:'',
                    teachers:[],
                    type: '',
                    types: [{value:'2',label:'大班课'},{value:'4',label:'小班课'}]
                },
                contentData: {  // 用户角色 0:学生 1:老师 2:助教
                    detail: {
                        availablePoints: '',
                        serverData: [],
                        tableData:[],
                        currentPage:1,
                    }
                },
                routerConfig: [{name:'直播点',to:''}],
            }
        },
        mounted() {
            PubSub.publish("currentMenuIndex", ROUTER_LIVE_POINT);
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.initData()
        },
        methods: {
            initData(){
                getTeacherList(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id
                })).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        if(res.data!='[]'){
                            this.filters.teachers = []
                            res.data.map(item=>{
                                const teacher = {value:item.id,label:item.nick}
                                this.filters.teachers.push(teacher)
                            })
                        }
                    }
                }).catch(err=>{
                    promptUtil.LOG('getTeacherList-err', err)
                })
                getSchoolDueInfo(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.callUs.tel = res.data.tel
                            this.callUs.img = res.data.qrcode
                        }
                    }
                }).catch(err => {
                    promptUtil.LOG('getSchoolDueInfo-err', err)
                })
                this.getCourseDetail()
            },
            getCourseDetail(){
                const loading = promptUtil.loading(this)
                let keyWorks = this.filters.keywords&&this.filters.keywords!='' ? this.filters.keywords.trim() : ''
                getLivePointDetail({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    class_type: this.filters.type,
                    teacher_id: this.filters.teacher,
                    key_words: keyWorks
                }).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        this.contentData.detail.serverData = []
                        this.contentData.detail.availablePoints = res.data.availablePoints
                        if(res.data.contentData&&res.data!='[]'){
                            if(res.data.contentData.length>0){
                                res.data.contentData.map(item=>{
                                    const {name,date,teacher,cover,count,type} = item;
                                    const obj = {
                                        name,date,teacher,type,cover,
                                        count: parseFloat(count).toFixed(2),
                                        detailData: item.detailData
                                    }
                                    this.contentData.detail.serverData.push(obj)
                                })
                            }
                        }
                    }
                    this.$refs.alsCountPagination.setCurrentPage(1)
                    this.$refs.alsCountPagination.setServerData(this.contentData.detail.serverData)
                    loading.close()
                }).catch(err=>{
                    loading.close()
                    promptUtil.LOG('getLivePointDetail-err',err)
                })
                this.filters.type = ''
                this.filters.teacher = ''
                this.filters.keywords = ''
            },
            handleClickSearch(){
              this.getCourseDetail()
            },
            getSummaries(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 1) {
                        this.contentData.detail.currentPage = this.$refs.alsCountPagination.getCurrentPage()
                        sums[index] = '第'+this.contentData.detail.currentPage  +'页';
                        return;
                    }
                    if(index === 3){
                        const values = data.map(item=>item.count);
                        if(values&&values.length>0){
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return parseFloat(this.floatAdd(prev,curr)).toFixed(2);
                                }else {
                                    return parseFloat(prev).toFixed(2);
                                }
                            },0);
                            sums[index] ='共记 ' +sums[index]+ ' 个';
                        }else{
                            sums[index] = '共记 ' +sums[index]+ ' 个';
                        }
                    }
                });
                return sums;
            },
            changeTableData(data){
                this.contentData.detail.tableData = data
            },
            //浮点数加法
            floatAdd(arg1,arg2){
                let r1,r2,m;
                try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
                try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
                m=Math.pow(10,Math.max(r1,r2));
                return (arg1*m+arg2*m)/m;
            },
            //浮点数减法
            floatSub(arg1,arg2){
                let r1,r2,m,n;
                try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
                try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
                m=Math.pow(10,Math.max(r1,r2));
                //动态控制精度长度
                n=(r1=r2)?r1:r2;
                return ((arg1*m-arg2*m)/m).toFixed(n);
            },
            // 浮点数乘法
            floatMul(arg1,arg2){
                let m=0,s1=arg1.toString(),s2=arg2.toString();
                try{m+=s1.split(".")[1].length}catch(e){}
                try{m+=s2.split(".")[1].length}catch(e){}
                return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
            },
            // 浮点数除法运算
            floatDiv(arg1,arg2){
                let t1=0,t2=0,r1,r2;
                try{t1=arg1.toString().split(".")[1].length}catch(e){}
                try{t2=arg2.toString().split(".")[1].length}catch(e){}
                r1=Number(arg1.toString().replace(".",""));
                r2=Number(arg2.toString().replace(".",""));
                return (r1/r2)*Math.pow(10,t2-t1);
            }
        }
    }
</script>

<style scoped>
  .live-count-container{
    display: flex;
    align-items: baseline;
    font-size: 14px;
    height: 36px;
  }
  .live-count-number{
    font-size: 36px;
    height: 36px;
    color: #fb6161;
    margin-right:3px;
  }
  .detail-record-label-item{
    font-size: 10px;
  }
  .detail-record-label-item span{
    color: #606266;
  }
  .consult-item{
  }

  .image-cover-wrapper {
    position: relative;
    cursor: pointer;
    margin-right: 20px;
  }
  .image-cover {
    width: 105px;
    height: 84px;
    border-radius: 5px;
    object-fit: cover;
    transition: all 0.2s ease-out 0.1s;
  }
  .image-cover:hover {
    transform: scale(1.05);
  }

</style>
