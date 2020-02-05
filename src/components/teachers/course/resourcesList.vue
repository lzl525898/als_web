<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <!-- 过滤 -->
      <!--      <el-row type="flex" align="middle">-->
      <!--        <el-col :span="2">全部</el-col>-->
      <!--        <el-col :span="22" style="margin-left: -20px;">-->
      <!--          <el-button round size="small" :autofocus="true" @click="onHandleAllResourceList">全部</el-button>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row type="flex" align="middle" v-for="type in filterInfo" :key="type.id">
        <!--        <el-col :span="2">{{type.type}}</el-col>-->
        <!--        <el-col :span="22" style="margin-left: -20px;">-->
        <!--          <el-button-->
        <!--            round-->
        <!--            size="small"-->
        <!--            v-for="(category,index) in type.category"-->
        <!--            :key="index"-->
        <!--            @click="onFilterClick(category,index)"-->
        <!--          >{{category.label}}-->
        <!--          </el-button>-->
        <!--        </el-col>-->
        <el-col :span="24">
          <el-checkbox-group v-model="categoryGroup" size="small" @change="categoryGroupChange">
            <el-checkbox-button v-for="(category,index) in type.category" :label="category.id" :key="index">
              {{category.label}}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <!-- 查询 -->
      <el-row :gutter="16">
        <el-col :span="24">
          <el-input
            size="small"
            style="width: 240px"
            placeholder="请输入查询信息"
            v-model="inputQueryInfo"
            clearable
            @keydown.native.enter="queryClassInfo"
          ></el-input>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryClassInfo">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-row>
        <el-col :span="24" class="marginTop_10">
          <label>课程名称 : </label><label>{{packageInfo.course_name}}</label>
        </el-col>
        <el-col :span="24" class="marginTop_10">
          <label>培养对象 : </label><label>{{packageInfo.training}}</label>
        </el-col>
        <el-col :span="24" class="marginTop_10">
          <label>教具名称 : </label>
          <span v-if="packageInfo.software && packageInfo.software.length>0" >
            <span v-for="(item,index) in packageInfo.software" :key="index">
              <label>
                <el-tooltip v-if="item.con && item.con!=''" class="item" effect="dark" :content="item.con" placement="top">
                  <el-link v-if="item.url&&item.url!=''" type="primary" :underline="false" :href="item.url" target="_blank" style="margin-top:-4px;"><span style="margin-right:5px;font-weight:bold;font-size:16px;">{{item.name}}</span></el-link>
                  <span v-else :underline="false" style="color:#303133;margin-right:10px;font-size:16px;">{{item.name}}</span>
                </el-tooltip>
                <span v-else :underline="false" style="color:#303133;margin-right:10px;font-size:16px;">{{item.name}}</span>
              </label>
            </span>
          </span>
          <span v-else>--</span>
        </el-col>
        <el-col :span="24" class="marginTop_10">
          <label>课程简介 : </label><label>{{packageInfo.introduce}}</label>
        </el-col>
      </el-row>
    </el-card>
    <!-- 列表 -->
    <el-table
      class="table_hover"
      :data="tableData"
      style="width: 100%;margin-top: 20px;"
      :header-row-style="{'color':'#409EFF'}"
      @row-click="resourcesListShow"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="ke_xu"
        align="center"
        label="课序"
        width="100"
      >
<!--        :index="indexMethod"-->
      </el-table-column>
      <el-table-column label="课程名称" @click="resourcesListShow" width="370">
        <template slot-scope="scope">
          <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:350px">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="con" label="课程介绍" show-overflow-tooltip></el-table-column>
      <el-table-column label="阶段" width="220">
        <template slot-scope="scope">
          <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:200px">{{scope.row.stage}}</div>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="suit" align="center" label="教具名称"></el-table-column>-->
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="center" class="mt" v-show="tableData.length>0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="databaseInfoList"教具名称
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>

    import PubSub from "pubsub-js";
    import promptUtil from "../../../utils/promptUtil";
    import stringUtil from "../../../utils/stringUtil";
    import storageUtil from "../../../utils/storageUtil";
    import vuexUtils from "../../../utils/vuexUtils";
    import '../../../api/restfulapi';
    import {
        qs,
        getCoursesCategory,
        getCoursesPackageDetail,
        filterCoursesDetailByTag,
        filterCoursesDetailBatch,
        searchCoursesPackageDetail
    } from "../../../api/api";
    import childHeader from '../../component/childHeader'

    export default {
        components: {"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name: vuexUtils.checkMenuExist(this,'resources').target.name, to: '/resources'}, {name: '详细目录', to: ''}],
                inputQueryInfo: "", // 搜索内容
                pageSize: 10, // 分页页码大小
                currentPage: 1, // 分页当前页码
                tableData: [], //当前页面10条
                filterInfo: [], // 过滤类型
                categoryGroup: [], // 类型数组
                // packageInfo: {software:'',introduce:''}, // 课程包信息
                packageInfo: {course_name: '', training: '', introduce: '', software: ''},
                // course_name training_object desc software
                resourcesList: [] // 列表内容
            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            //  面包屑显示首页效果
            PubSub.publish("currentMenuIndex", "/resources");
            if(vuexUtils.checkMenuExist(this,'resources').target){
              let obj = {name:vuexUtils.checkMenuExist(this,'resources').target.name,id:this.$route.params.id}
              sessionStorage.setItem("currentPackageName",JSON.stringify(obj))
            }else{
              let obj = JSON.parse(sessionStorage.getItem("currentPackageName"))
              if(this.$route.params.id!=obj.id){ // 手动输入的id，需要跳转会课程包
                this.$router.replace({path:"/resources"})
              }else{
                this.routerConfig[0].name = obj.name
              }
            }
            this.$store.dispatch("setCoursePackageIdWithList", this.$route.params.id); // 触发消息action调用
            // this.noticeFlow()
            //1.获取过滤类型
            const loading = promptUtil.loading(this);
            getCoursesCategory(
                qs.stringify({school_id: storageUtil.readTeacherInfo().school_id, type: 1})
            )
                .then(res => {
                    // console.log("1",res)
                    PubSub.publish("currentMenuIndex", "/resources");
                    if (res.code == SUCCESS_CODE) {
                        this.filterInfo = [];
                        if (res.data != '[]') {
                            this.filterInfo = res.data;
                        }
                        //2.获取列表内容
                        this.getCourseFromPackage(loading);
                    } else {
                        loading.close();
                        promptUtil.wait(this);
                    }
                })
                .catch(err => {
                    loading.close();
                    promptUtil.LOG('getCoursesCategory-err', err);
                });
        },
        computed: {
            databaseInfoList: {
                get() {
                    if (this.resourcesList.length > 0) {
                        return this.resourcesList.length;
                    }
                }
            }
        },
        methods: {
            // 获取课程类别改变状态
            categoryGroupChange(val) {
                const ids = stringUtil.array2String(val, ",")
                const loading = promptUtil.loading(this)
                filterCoursesDetailBatch(qs.stringify({
                    user_id: storageUtil.readTeacherInfo().id,
                    school_id: storageUtil.readTeacherInfo().school_id,
                    category_id: ids,
                    class_id: this.$route.params.id, // 课程包id
                    str: ""
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                      this.resourcesList = []
                        if (res.data && res.data != '[]') {
                            this.resourcesList = res.data;
                        } else {
                            this.resourcesList = []
                        }
                        this.handleCurrentChange(1)
                    } else {
                        promptUtil.error(this, res.msg)
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("filterPackageBatch-err", err)
                    loading.close()
                })
            },
            onFilterClick(category, index) {
                const loading = promptUtil.loading(this);
                const type = index == 0 ? 0 : 1; // 0 父id 1 子id
                filterCoursesDetailBatch(
                    qs.stringify({
                        user_id: storageUtil.readTeacherInfo().id,
                        school_id: storageUtil.readTeacherInfo().school_id,
                        category_id: category.id,
                        class_id: this.$route.params.id, // 课程包id
                        fid: type
                    })
                )
                    .then(res => {
                        loading.close();
                        // console.log("filterCoursesDetailByTag",res);
                        if (res.code == SUCCESS_CODE) {
                            this.resourcesList = [];
                            if (res.data && res.data != '[]') {
                                this.resourcesList = res.data;
                            }
                            this.handleCurrentChange(1); //默认第一次访问使用第一页
                        } else {
                            promptUtil.error(this, res.msg);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG('filterCoursesDetailByTag-err', err);
                    });
            },
            queryClassInfo() {
                const ids = stringUtil.array2String(this.categoryGroup, ",")
                const loading = promptUtil.loading(this)
                filterCoursesDetailBatch(qs.stringify({
                    user_id: storageUtil.readTeacherInfo().id,
                    school_id: storageUtil.readTeacherInfo().school_id,
                    category_id: ids,
                    class_id: this.$route.params.id, // 课程包id
                    str: this.inputQueryInfo
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                      this.resourcesList = []
                        if (res.data && res.data != '[]') {
                            this.resourcesList = res.data;
                        } else {
                            this.resourcesList = []
                        }
                        this.handleCurrentChange(1)
                    } else {
                        promptUtil.error(this, res.msg)
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("filterPackageBatch-err", err)
                    loading.close()
                })
            },
            // 获取当前课程包下搜友课程
            onHandleAllResourceList() {
                const loading = promptUtil.loading(this);
                this.getCourseFromPackage(loading);
            },
            // 获取当前课程包下所有课程
            getCourseFromPackage(loading) {
                getCoursesPackageDetail(
                    qs.stringify({
                        user_id: storageUtil.readTeacherInfo().id,
                        school_id: storageUtil.readTeacherInfo().school_id,
                        class_id: this.$route.params.id
                    })
                )
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                          this.resourcesList = [];
                          if(res.data&&res.data!='[]'){
                                this.packageInfo.course_name = res.data.course_name && res.data.course_name != '' ? res.data.course_name : '--'
                                this.packageInfo.training = res.data.training_object && res.data.training_object != '' ? res.data.training_object : '--'
                                this.packageInfo.introduce = res.data.desc && res.data.desc != '' ? res.data.desc : '--'
                                let arrString = []
                                if(res.data.software && res.data.software!=''){
                                  arrString.push(res.data.software)
                                }
                                if(res.data.jiaoju && res.data.jiaoju!=''){
                                  arrString.push(res.data.jiaoju)
                                }
                                this.packageInfo.software = arrString
                                if (res.data.item != '[]') {
                                    this.resourcesList = res.data.item
                                }
                            }
                        } else {
                            promptUtil.error(this, res.msg)
                        }
                        this.handleCurrentChange(1); //默认第一次访问使用第一页，页码是1.
                    })
                    .catch(error => {
                        loading.close();
                        promptUtil.LOG('getCoursesPackageDetail-err', error);
                    });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                //当前页面需要显示得条数=所有条数
                if (this.resourcesList.length > 0) {
                    this.tableData = this.resourcesList.slice(
                        (this.currentPage - 1) * this.pageSize,
                        this.pageSize + (this.currentPage - 1) * this.pageSize
                    );
                }else{
                  this.tableData = []
                }
            },
            // 设置当前table索引
            indexMethod(index) {
                return "第"+(index + (this.currentPage - 1) * 10)+"课";
            },
            resourcesListShow(event) {
              if(event.if_in==1){
                this.$router.push({path: "/resourcesListShow/" + event.id});
              }else{
                this.$notify({
                  title: '系统通知',
                  message: '您没有该堂课程的访问权限，如需开通请联系我们',
                  type: 'warning'
                });
              }
            },
            tableRowClassName({row, rowIndex}) {
              if (row.if_in == 0) {
                return 'row-style-disable';
              }
              return '';
            }
        }
    };
</script>
<style>
  .row-style-disable {
    color: #909399 !important;
  }
</style>
<style scoped>
  .table_hover:hover {
    cursor: pointer;
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

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .lh {
    line-height: 50px;
    font-weight: bold;
  }

  .mt {
    margin-top: 50px;
  }

  .pointer {
    cursor: pointer;
  }

  .el-table .cell {
    cursor: pointer;
  }

  .el-table_2_column_6 {
    cursor: pointer;
  }

  .showTask {
    margin-top: 30px;
    /* background-color: #eee; */
    box-shadow: 2px 2px 8px #eee;
    border-radius: 10px;
    color: #606266;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 50px;
  }

  .marginTop_10 {
    margin-top: 10px;
  }
</style>

