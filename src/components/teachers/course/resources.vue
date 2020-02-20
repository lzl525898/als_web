<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card shadow="always">
      <!-- 过滤 -->
<!--      <el-row type="flex" align="middle">-->
<!--        <el-col :span="2">全部</el-col>-->
<!--        <el-col :span="22">-->
<!--          <el-button round size="small" :autofocus="true" @click="onHandleAllResourceList">全部</el-button>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row type="flex" align="small" v-for="type in filterInfo" :key="type.id">
<!--        <el-col :span="2">{{type.type}}</el-col>-->
<!--        <el-col :span="10" >-->
<!--          <el-button-->
<!--            round-->
<!--            size="small"-->
<!--            v-for="(category,index) in type.category"-->
<!--            :key="index"-->
<!--            @click="onFilterClick(category,index)"-->
<!--          >{{category.label}}-->
<!--          </el-button>-->
<!--        </el-col>-->
        <el-col :span="24" >
          <el-checkbox-group v-model="categoryGroup" size="small" @change="categoryGroupChange">
            <el-checkbox-button v-for="(category,index) in type.category" :label="category.id" :key="index" >{{category.label}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <!-- 查询 -->
      <el-row :gutter="16">
        <el-col :span="24">
          <el-input
            style="width: 240px;"
            size="small"
            placeholder="请输入查询信息"
            v-model="inputQueryInfo"
            clearable
            @keydown.native.enter="queryClassInfo"
          ></el-input>
          <el-button  size="small" type="primary" icon="el-icon-search" @click="queryClassInfo">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- table切换 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col>
        <div class="grid-content bg-purple-light">
          <div v-if="!courseInfo || courseInfo.length==0">
            <div style="font-size: 30px;color:#e6e6e6;font-weight: bold;display: flex;justify-content: center;align-items: center;height: 400px;">暂未开通课程</div>
          </div>
          <div v-else class="el-box" v-for="(item,index) in courseInfo" :key="index">
            <div @click="databaseList" style="cursor: pointer;" v-if="item.if_in==1">
              <div style="border-radius: 10%;box-shadow: 5px 5px 5px #eee;border: none;" :current-id="item.id">
                <img
                  :src="item.img"
                  alt
                  class="cover"
                  :current-id="item.id"
                  style="border-top-left-radius: 10%;border-top-right-radius: 10%"
                >
                <el-tooltip class="item" effect="dark" :content="item.title" placement="top" :current-id="item.id">
                  <div class="el-txt" :current-id="item.id" style="font-size: 18px;margin-left: 9px;">{{item.title}}</div>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" :content="item.title2" placement="top" :current-id="item.id">
                  <div class="el-txt" :current-id="item.id" style="color:#999">{{item.title2}}</div>
                </el-tooltip>
                <div style="display: flex;justify-content: space-between" :current-id="item.id">
                  <div class="el-txt-box" :current-id="item.id">
                    <p :current-id="item.id">
                      <i class="el-icon-document" :current-id="item.id"></i>
                      {{item.lesson}}
                    </p>
                  </div>
                  <div style="padding-top: 10px;margin-right: 16px;"><el-tag :current-id="item.id" effect="plain" style="font-weight:bold">{{item.parent_name}}</el-tag></div>
                </div>
              </div>
            </div>
            <div style="cursor: pointer;" v-if="item.if_in==0" @click="lockClick">
              <div style="border-radius: 10%;position:relative;">
                <img src="../../../../static/images/base/courses/lock.png" style="position: absolute;z-index: 999;width: 60px;top:90px;left:90px"/>
                <div style="border-radius: 10%;box-shadow: 5px 5px 5px #eee;border: none;" :current-id="item.id">
                  <img
                    :src="item.img"
                    alt
                    class="cover"
                    :current-id="item.id"
                    style="border-top-left-radius: 10%;border-top-right-radius: 10%;opacity:0.5"
                  >
                  <div class="el-txt" :current-id="item.id" style="opacity:0.5;font-size: 18px;margin-left: 9px;">{{item.title}}</div>
                  <div class="el-txt" :current-id="item.id" style="opacity:0.5;color:#999">{{item.title2}}</div>
                  <div style="display: flex;justify-content: space-between;opacity:0.5;" :current-id="item.id">
                    <div class="el-txt-box" :current-id="item.id">
                      <p :current-id="item.id">
                        <i class="el-icon-document" :current-id="item.id"></i>
                        {{item.lesson}}
                      </p>
                    </div>
                    <div style="padding-top: 10px;margin-right: 16px;"><el-tag :current-id="item.id" effect="plain" style="font-weight:bold;opacity:0.5;">{{item.parent_name}}</el-tag></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js';
  import promptUtil from "../../../utils/promptUtil";
  import stringUtil from "../../../utils/stringUtil";
  import vuexUtils from '../../../utils/vuexUtils';
  import {
    qs,
    filterPackage,
    getCoursesCategory,
    filterPackageBatch,
    getCoursesPackage,
    getCoursesLivePackage
  } from "../../../api/api";
  import storageUtil from "../../../utils/storageUtil";
  import '../../../api/restfulapi';
  import childHeader from '../../component/childHeader'
  export default {
    components:{"als-child-header": childHeader},
    data() {
      return {
        routerConfig: [{name:vuexUtils.checkMenuExist(this,'resources').target.name,to:''}],
        inputQueryInfo: "", // 搜索内容
        courseInfo: [],
        liveInfo:[],
        filterInfo: [], // 过滤类型
        categoryGroup: [], // 类型数组
        isShowLiveInfo: false ,// 是否显示直播tab
      };
    },
    mounted() {
      //  面包屑显示首页效果
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", "/resources");
      // this.isShowLiveInfo = storageUtil.readUserRole()==1 ||storageUtil.readUserRole()==2 ? true : false
      this.initPackageCategory()
        //2.获取列表内容
      this.getCoursePackage();
    },
    methods: {
      initPackageCategory(){
        const loading = promptUtil.loading(this);
        getCoursesCategory(
          qs.stringify({school_id: storageUtil.readTeacherInfo().school_id, type: 3})
        )
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              this.filterInfo = [];
              if (res.data != '[]') {
                this.filterInfo = res.data
                loading.close()
              }
            } else {
              loading.close();
              promptUtil.wait(this);
            }
          })
          .catch(err => {
            loading.close();
            promptUtil.LOG('getCoursesCategory-err',err);
          });
      },
      // 获取课程类别改变状态
      categoryGroupChange(val){
        const ids = stringUtil.array2String(val,",")
        const loading  = promptUtil.loading(this)
        filterPackageBatch(qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          school_id: storageUtil.readTeacherInfo().school_id,
          category_id: ids,
          str:""
        })).then(res=>{
          if(res.data && res.data!='[]'){
            this.courseInfo = res.data;
          }else{
            this.courseInfo = []
          }
          loading.close()
        }).catch(err=>{
          promptUtil.LOG("filterPackageBatch-err",err)
          loading.close()
        })
      },
      // 获取课程包
      getCoursePackage(loading=null){
        filterPackageBatch(
          qs.stringify({
            user_id: storageUtil.readTeacherInfo().id,
            school_id: storageUtil.readTeacherInfo().school_id
          })
        )
          .then(res => {
            PubSub.publish("currentMenuIndex", "/resources");
            if(loading){
                loading.close();
            }
            if (res.code == SUCCESS_CODE) {
              this.courseInfo = [];
              if(res.data && res.data!='[]'){
                  this.courseInfo = res.data;
                 // console.log("this.courseInfo",this.courseInfo)
              }
            } else {
              promptUtil.wait(this);
            }
          })
          .catch(err => {
              if(loading){
                  loading.close();
              }
            promptUtil.LOG('getCoursesPackage-err',err);
          });
      },
      lockClick(){
        this.$notify({
          title: '系统通知',
          message: '您没有该门课程的访问权限，如需开通请联系我们',
          type: 'warning'
        });
      },
      queryClassInfo(){
        const ids = stringUtil.array2String(this.categoryGroup,",")
        const loading  = promptUtil.loading(this)
        filterPackageBatch(qs.stringify({
          user_id: storageUtil.readTeacherInfo().id,
          school_id: storageUtil.readTeacherInfo().school_id,
          category_id: ids,
          str: this.inputQueryInfo
        })).then(res=>{
          if(res.data && res.data!='[]'){
            this.courseInfo = res.data;
          }else{
            this.courseInfo = []
          }
          loading.close()
        }).catch(err=>{
          promptUtil.LOG("filterPackageBatch-err",err)
          loading.close()
        })
      },
      onFilterClick(category, index) { // index 为 0 表示父类的全部 1 表示子
        const loading = promptUtil.loading(this)
        filterPackage(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          parent_id: index,
          category_id: category.id
        })).then(res=>{
          if (res.code == SUCCESS_CODE) {
            loading.close();
            this.courseInfo = [];
            if(res.data && res.data!='[]'){
              this.courseInfo = res.data;
            }
          } else {
            promptUtil.wait(this);
          }
        }).catch(err=>promptUtil.LOG("filterPackage-err",err))
      },
      // 获取当前课程包下搜友课程
      onHandleAllResourceList() {
        const loading = promptUtil.loading(this);
        this.getCoursePackage(loading);
      },
      databaseList(event) {
        this.$router.push({
          path: "/resourcesList/" + event.target.getAttribute("current-id")
        });
      },
      databaseLiveList(event) {
        this.$router.push({
          path: "/resourcesLiveList/" + event.target.getAttribute("currentLive-id")
        });
      }
    }
  };
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
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-box {
    margin: 15px 15px;
    float: left;
    width: 240px;
    margin-left: 55px;
  }
  .cover {
    /* height: calc(100% - 66px); */
    background-position: 50% !important;
    background-size: cover !important;
    height: 160px;
    width: 100%;
    cursor: pointer;
    overflow: hidden;
    border-bottom: 1px  #e6e6e6 solid;
  }
  .el-txt-box {
    /* text-align: center */
    padding-left: 20px;
    margin-bottom: 6px;
  }
  .el-txtBox{
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    margin-left: 20px;
    height: 26px;
    line-height: 26px;
    font-size: 16px;
    font-weight: 500;
  }
  .detailBox{
    width: 240px;
    overflow: hidden;
    font-size: 16px;
    font-weight: 200;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /*加宽度width属来兼容部分浏览*/
  }
  .detail{
    width: 240px;
    height: 20px;
    line-height: 20px;
    font-weight: 200;
  }
  .ml-l {
    margin-left: 10px;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #409eff;
    background-color: #eee !important;
    border-right-color: #00a2ff;
    border-left-color: #00a2ff;
  }
  .el-tabs--border-card {
    background: #fff;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
</style>

