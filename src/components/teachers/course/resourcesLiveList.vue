<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
<!--    <el-row v-if="baseInfo.school_id == 1 && (userRole == 2 || userRole ==1)">-->
<!--      <el-button type="primary" size="medium" @click="downloadClient">下载客户端</el-button>-->
<!--    </el-row>-->
    <el-row>
      <el-button type="primary" size="medium" @click="downloadClient">下载客户端</el-button>
      <el-tooltip class="item" effect="dark" content="不清晰？可以下载客户端进行观看" placement="right">
        <el-link type="primary" :underline="false"><i class="el-icon-question"></i></el-link>
      </el-tooltip>
    </el-row>
    <!-- 列表 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :header-row-style="{'color':'#409EFF'}"
      style="width: 100%">
      <!--        <el-table-column-->
      <!--          type="selection"-->
      <!--          width="55">-->
      <!--        </el-table-column>-->
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
        props="id"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="create"
        label="创建者"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="className"
        align="center"
        label="直播课程名称"
      >
      </el-table-column>
<!--      <el-table-column v-if="baseInfo.school_id == 1 && (userRole == 2 || userRole ==1)"-->
<!--                       prop="cloudClassroomNickname"-->
<!--        align="center"-->
<!--        label="云课堂昵称"-->
<!--      >-->
      <el-table-column
        prop="speaker"
        label="房间号"
        align="center">
      </el-table-column>
<!--      <el-table-column v-if="baseInfo.school_id == 1 && (userRole == 2 || userRole ==1)"-->
<!--                       prop="teacherInviteCode"-->
<!--        align="center"-->
<!--        label="教师邀请码"-->
<!--      >-->
      <el-table-column v-if="userRole == 2 || userRole ==1"
                       prop="teacherInviteCode"
                       align="center"
                       label="参加码"
      >
      </el-table-column>
      <el-table-column
        prop="shelfTime"
        label="直播开始时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="underTime"
        label="直播结束时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="open"
        label="是否公开"
        align="center">
      </el-table-column>
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click.native="seeLiveClass({index: scope.$index, row:scope.row})"
            v-if="scope.row.bofang_type==1 || scope.row.bofang_type==0">观看直播
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native="seeLiveClass({index: scope.$index, row:scope.row})"
            v-else>直播结束
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="primary"-->
<!--            @click="seepPaybackLiveClass({index: scope.$index, row:scope.row})"-->
<!--            v-else>观看直播-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="center" class="mt">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="databaseInfoList"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>
  import PubSub from "pubsub-js";
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import '../../../api/restfulapi';
  import {
    qs,
    getCoursesCategory,
    getCoursesPackageDetail,
    filterCoursesDetailByTag,
    searchCoursesPackageDetail,
    getTableListLiveClass
  } from "../../../api/api";
  import childHeader from '../../component/childHeader'

  export default {
    components:{"als-child-header": childHeader},
    data() {
      return {
        routerConfig: [{name:'直播目录',to:''}],
        showSeeLiveClass:false,//显示观看直播
        showSeepPaybackLiveClass:false,//显示观看回放
        // inputQueryInfo: "", // 搜索内容
        pageSize: 10, // 分页页码大小
        currentPage: 1, // 分页当前页码
        tableData: [], //当前页面10条
        filterInfo: [], // 过滤类型
        resourcesList: [], // 列表内容
        baseInfo:{},//获取缓存中的teacher_info
        userRole:0,
      };
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      this.baseInfo = storageUtil.readTeacherInfo();
      this.userRole = storageUtil.readUserRole();
      //  面包屑显示首页效果
      // PubSub.publish("currentMenuIndex", "/resources");
      //1.获取过滤类型
      // const loading = promptUtil.loading(this);
      //获取表格信息
      getTableListLiveClass(
        qs.stringify({
             subject_id:this.$route.params.id,
             user_id:storageUtil.readTeacherInfo().id
        }))
        .then(res => {
          // PubSub.publish("currentMenuIndex", "/resources");
           if (res.code == SUCCESS_CODE) {
             this.tableData = []
             this.currentPage = 1;
             this.resourcesList = [];
             if (res.data && res.data != '[]') {
               for (var i = 0; i < res.data.length; i++) {
                 const obj = {
                   id: res.data[i].id,
                   create: res.data[i].create_name,
                   className: res.data[i].title,
                   speaker: res.data[i].room_id,
                   shelfTime: res.data[i].starttime,
                   underTime: res.data[i].endtime,
                   open: res.data[i].if_gk == 1 ? "否" : "是",
                   whetherAudit: res.data[i].sh,//= 1 ? "审核通过" : res.data[i].sh == 0 ? "审核中" : "审核失败"
                   whetherDisable: res.data[i].status,
                   bofang_type:res.data[i].bofang_type,
                   bofangUrl:res.data[i].bofang_url,
                   teacherInviteCode:res.data[i].student_code, // teacher_code
                   cloudClassroomNickname:res.data[i].teacher_name
                 }
                 this.tableData.push(obj)
               }
               this.resourcesList = this.tableData;
               this.handleCurrentChange(1)
             }
          } else {
            loading.close();
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          loading.close();
          promptUtil.LOG('getTableListLiveClass-err',err);
        });
    },
    computed: {
      databaseInfoList: {
        get() {
          return this.resourcesList.length;
        }
      }
    },
    methods: {
      onFilterClick(category, index) {
        const loading = promptUtil.loading(this);
        const type = index == 0 ? 0 : 1; // 0 父id 1 子id
        filterCoursesDetailByTag(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            category_id: category.id,
            class_id: this.$route.params.id, // 课程包id
            fid: type
          })
        )
          .then(res => {
            loading.close();
            if (res.code == SUCCESS_CODE) {
              this.resourcesList = [];
              if (res.data && res.data != '[]') {
                this.resourcesList = res.data;
              }
              this.handleCurrentChange(1); //默认第一次访问使用第一页
            } else {
              promptUtil.wait(this);
            }
          })
          .catch(err => {
            loading.close();
            promptUtil.LOG('filterCoursesDetailByTag-err',err);
          });
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        //当前页面需要显示得条数=所有条数
        this.tableData = this.resourcesList.slice(
          (this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize
        );
      },
      // 设置当前table索引
      indexMethod(index) {
        return index + 1 + (this.currentPage - 1) * 10;
      },
      resourcesListShow(event) {
        this.$router.push({path: "/resourcesListShow/" + event.id});
      },
      seeLiveClass(obj){
        // window.location.href=obj.row.bofangUrl
        window.open(obj.row.bofangUrl,'_blank')
      },
      seepPaybackLiveClass(obj){
       // console.log('obj',obj.row.bofangUrl.url)
        window.open(obj.row.bofangUrl.url,'_blank')
      },
      //下载客户端
      downloadClient(){
        window.open("http://www.baijiayun.com/classroomdown/", "_blank")
      }
    }
  };
</script>

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
</style>

