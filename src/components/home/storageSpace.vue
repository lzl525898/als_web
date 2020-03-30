<template>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card style="padding-bottom:16px;min-height:660px">
        <div style="display:flex;align-items:center;margin-top:5px">
          <div style="display:flex;align-items:center">
            <span style="font-size:14px">操作路径</span><el-select v-model="filters.path" size="small" style="width:150px;margin-left:10px;margin-right:30px">
            <el-option v-for="(item,index) in filters.pathArray" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
            <span style="font-size:14px">上传时间</span><el-date-picker v-model="filters.date" type="daterange" :picker-options="pickerOptions" range-separator=""
                                             start-placeholder="选择时间范围" style="width:240px;margin-left:10px;" size="small">
          </el-date-picker>
          </div>
          <div style="display:flex;align-items:center;justify-content:flex-end;flex:1">
            <el-input placeholder="请输入查询信息" v-model="filters.keywords" size="small" style="margin-left:10px;width:240px;">
              <el-button slot="append" icon="el-icon-search" @click="handleClickStorageQuery"></el-button>
            </el-input>
          </div>
        </div>
        <div style="border-top:3px solid #EBEEF5;padding-top:10px;margin-top:20px;">
          <div class="storage-count-container">可用云存储空间：<div class="storage-count-number">{{freeStorage}}</div>
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
              content="计算机存储单位一般用bit、B、KB、MB、GB、TB、PB……来表示，它们之间的关系是：1PB=1024TB、1TB=1024GB、1GB=1024MB、1MB=1024KB、1KB=1024B、1B=8b">
              <el-link :underline="false" slot="reference" style="margin-top:4px;margin-left:5px"><span style="color:#409EFF">存储单位换算？</span></el-link>
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
        </div>
        <div style="display: flex;margin: 20px 0;">
          <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
          <div style="line-height:20px;margin-left:5px;">存储空间使用记录</div>
        </div>
        <el-table :data="storageTableData" style="width: 100%" :header-cell-style="{'color':'#353535','fontSize':'16px','background':'#eef1f6'}">
          <el-table-column prop="name" label="用户名" width="200px" show-overflow-tooltip/>
          <el-table-column prop="path" label="操作路径" show-overflow-tooltip/>
          <el-table-column prop="time" label="上传时间"/>
          <el-table-column prop="suffix" label="文件类型"/>
          <el-table-column prop="size" label="占用空间"/>
          <el-table-column label="操作" width="100px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-link :underline="false" @click="handleClickDelete(scope.row)"><span style="color:#409EFF">删除</span></el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
    const moment = require("moment")
    import PubSub from 'pubsub-js'
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../../components/component/childHeader'
    import '../../router/router'
    import {qs,getSchoolDueInfo,getStorageSpaceDetail,delOSSFile} from '../../api/api'
    import '../../api/restfulapi'
    export default {
        name: "storageSpace",
        components: {
            "als-child-header": childHeader,
        },
        data(){
            return {
                callUs:{tel:'',img:''},
                pickerOptions:{
                    shortcuts:[{
                        text: '全部时间',
                        onClick(picker) {
                            picker.$emit('pick','');
                        }
                    },{
                        text: '当月时间',
                        onClick(picker) {
                            picker.$emit('pick', [moment().startOf('month'), moment().endOf('month')]);
                        }
                    },{
                        text: '今年至今',
                        onClick(picker) {
                            picker.$emit('pick', [moment().startOf('year'), new Date()]);
                        }
                    }]
                },
                freeStorage:'',
                filters:{keywords:'',date:'',path:0,pathArray:[{label:'全部',value:0},{label:'有路径',value:1},{label:'无路径',value:2}]},
                storageTableData:[],
                routerConfig: [{name:'存储空间',to:''}],
            }
        },
        mounted(){
            PubSub.publish("currentMenuIndex", ROUTER_STORAGE_SPACE);
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            this.initData()
        },
        methods: {
            initData(){
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
                this.getStorageList()
            },
            handleClickDelete(row){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = row.id
                    delOSSFile(qs.stringify({
                        file_id:id
                    })).then(res=>{
                        if(res.code==SUCCESS_CODE){
                            try{
                                this.storageTableData.splice(this.storageTableData.findIndex(item=>item.id==id),1)
                            }catch (e) {}
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                type: 'warn',
                                message: res.msg
                            });
                        }
                    }).catch(err=>{
                        promptUtil.LOG('delOSSFile-err',err)
                    })
                }).catch(() => {});
            },
            getStorageList(){
                let startDate = ''
                let endDate = ''
                if(this.filters.date&&this.filters.date!=''){
                    if(this.filters.date.length&&this.filters.date.length>0){
                        startDate = moment(this.filters.date[0]).format("YYYY-MM-DD hh:mm:ss")
                        endDate = moment(this.filters.date[1]).format("YYYY-MM-DD hh:mm:ss")
                    }
                }
                const loading = promptUtil.loading(this)
                getStorageSpaceDetail(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    starttime:startDate,
                    endtime:endDate,
                    path: this.filters.path
                })).then(res=>{
                    if(res.code==SUCCESS_CODE){
                        this.freeStorage = res.data.last_space
                        if(res.data.data&&res.data.data!='[]'){
                            this.storageTableData = res.data.data
                        }
                    }
                    loading.close()
                }).catch(err=>{
                    loading.close()
                    promptUtil.LOG('getStorageSpaceDetail-err',err)
                })
                this.filters.keywords=''
                this.filters.date=''
                this.filters.path=0
            },
            handleClickStorageQuery(){
                this.getStorageList()
            }
        }
    }
</script>

<style scoped>
  .storage-count-container{
    display: flex;
    align-items: baseline;
    font-size: 14px;
    height: 36px;
  }
  .storage-count-number{
    font-size: 36px;
    height: 36px;
    color: #fb6161;
    margin-right:3px;
  }
</style>
