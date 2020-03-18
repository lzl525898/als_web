<template>
    <div>
      <div v-if="!isAuth">
        <als-no-auth/>
      </div>
      <div v-if="isAuth">
        <el-row>
          <el-col :span="24">
            <als-child-header :config="routerConfig"/>
          </el-col>
        </el-row>
        <el-card shadow="always">
          <el-row>
            <el-col :span="20">
              <el-row type="flex" align="small" v-for="type in filterInfo" :key="type.id">
                <el-col>
                  <el-checkbox-group v-model="categoryGroup" size="small" @change="categoryGroupChange">
                    <el-checkbox-button v-for="(category,index) in type.category" :label="category.id" :key="index" >{{category.label}}</el-checkbox-button>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-input placeholder="请输入查询信息" v-model="queryInfo" size="small" style="width: 240px;"></el-input>
                  <el-button size="small" type="primary" icon="el-icon-search" @click="queryPackageInfo">搜索</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4">
              <div style="display: flex;width: 100%;justify-content: flex-end;">
                <el-button type="primary" @click="addCustomCourse">添加课程</el-button>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row :gutter="20" style="margin-top: 20px;">
            <el-col>
              <div v-show="courseShowStatus==0" style="height: 200px"></div>
              <div v-show="courseShowStatus==1">
                <div class="nodata">
                  <img style="width:300px;" src="../../../../static/images/base/nodata.png" alt>
                </div>
              </div>
              <div v-show="courseShowStatus==2" class="el-box" v-for="(item,index) in courseInfo" :key="index">
                <div style="cursor: pointer;">
                  <div style="border-radius: 10%;box-shadow: 5px 5px 5px #eee;border: none;">
                    <img
                      :src="item.img"
                      alt
                      class="cover"
                      :current-id="item.id"
                      @click="intoEditCourse(item)"
                      style="border-top-left-radius: 10%;border-top-right-radius: 10%"
                    >
                    <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                      <div class="el-txt">{{item.title}}</div>
                    </el-tooltip>
                    <div style="display: flex;justify-content: space-between">
                      <div class="el-txt-box">
                        <el-link :underline="false" @click="intoEditCourse(item)">
                          <p><i class="el-icon-document"></i>{{item.lesson}}</p>
                        </el-link>
                      </div>
                      <div style="padding-top: 13px;margin-right: 16px;">
                        <el-tooltip class="item" effect="dark" content="查看课程" placement="top">
                          <el-button type="primary" plain icon="el-icon-view" size="small" style="margin:0;padding:5px;" @click="seeCustomPackage(item)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑课程" placement="top">
                          <el-button type="primary" plain icon="el-icon-edit" size="small" style="margin:0;padding:5px;" @click="editCustomPackage(item)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除课时" placement="top">
                          <el-button type="danger" plain icon="el-icon-delete" size="small" style="margin:0;padding:5px;" @click="isDelCustomPackage(item)"></el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <!-- 面包屑 -->
      <el-dialog title="提示" :visible.sync="isDelCustomShow" width="20%">
        <el-row>
          <el-col :span="4">
            <i class="el-icon-question"></i>
          </el-col>
          <el-col :span="20">
            <span>{{delCustomContent}}</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelCustomShow = false">取 消</el-button>
          <el-button type="primary" @click="delCustomShow" :loading="isDelLoading">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  import '../../../api/restfulapi'
  import {
    qs,
    delCustomSelf,
    getCustomCategorySelf,
    filterCustomByWordsSelf,
  } from "../../../api/api";
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import stringUtil from "../../../utils/stringUtil";
  import childHeader from '../../component/childHeader';
  import noAuthContent from "../../component/noAuthContent";
  export default {
    name: "custom",
    components:{
        "als-child-header": childHeader,
        "als-no-auth": noAuthContent,
    },
    data(){
      return {
        isAuth: false,
        routerConfig: [{name:'自定义课程',to:''}],
        filterInfo: [], // 过滤类型
        categoryGroup: [], // 类型数组
        targetPackage: "", // 当前课程包对象
        queryInfo: "", // 查询关键字
        isDelCustomShow: false,
        delCustomContent: "",
        isDelLoading: false, // 删除按钮loading
        courseInfo: [], // 课程包信息
        courseShowStatus: 0, // 0 空 1 无数据 2 课程包
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", ROUTER_CUSTOM);
      let menuItem = storageUtil.getMenu().find(item=> item.url=='custom')
      if(menuItem && menuItem.if_in==1) { // 有权限
          this.isAuth = true
          this.initPackageInfo()
          this.initPackageCategory()
      }else{
          this.isAuth = false
      }
    },
    methods: {
      // 跳转添加自定义课程
      addCustomCourse(){
        this.$router.push({path: ROUTER_CUSTOM_ADD})
      },
      // 根据类别修改获取内容
      categoryGroupChange(val){
        this.categoryGroup = val
        this.initPackageInfo()
      },
      initPackageInfo(){
        const loading = promptUtil.loading(this)
        let ids = ""
        if(this.categoryGroup && this.categoryGroup.length>0){
          ids = stringUtil.array2String(this.categoryGroup,",")
        }
        filterCustomByWordsSelf(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          category_id: ids,
          str: this.queryInfo,
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.courseInfo = res.data
              if(this.courseInfo.length==0){
                this.courseShowStatus = 1
              } else {
                this.courseShowStatus = 2
              }
            }else{
              this.courseInfo = []
            }
          }
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG("filterCustomByWordsSelf-err",err)
        })
      },
      // 初始化类别
      initPackageCategory(){
        const loading = promptUtil.loading(this);
        getCustomCategorySelf(
          qs.stringify({school_id: storageUtil.readTeacherInfo().school_id}))
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              this.filterInfo = [];
              if (res.data != '[]') {
                this.filterInfo = res.data;
              }
            } else {
              promptUtil.wait(this);
            }
            loading.close();
          })
          .catch(err => {
            loading.close();
            promptUtil.LOG('getCoursesCategory-err',err);
          });
      },
      // 显示确认删除对话框
      isDelCustomPackage(obj){
        this.targetPackage = obj
        this.delCustomContent = "确定要删除【"+obj.title+"】这门课程吗？"
        this.isDelCustomShow = true
      },
      delCustomShow(){
        if(this.targetPackage && this.targetPackage.id){
          this.isDelLoading = true
          delCustomSelf(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            course_id: this.targetPackage.id
          })).then(res=>{
            if(res.code==SUCCESS_CODE){
              this.courseInfo.splice(this.courseInfo.findIndex(item=>item.id==this.targetPackage.id),1)
              promptUtil.success(this, '删除自定义课程成功')
            }else{
              promptUtil.error(this,res.msg)
            }
            this.isDelLoading = false
            this.isDelCustomShow = false
          }).catch(err=>{
            promptUtil.LOG("delCustomSelf-err",err)
            this.isDelLoading = false
            this.isDelCustomShow = false
          })
        }else{
          promptUtil.warning(this,'请稍后再试')
        }
      },
      // 查看课程包
      seeCustomPackage(obj){
        this.goCourseList(obj)
      },
      // 进入编辑课程包内容
      intoEditCourse(obj){
        this.goCourseList(obj)
      },
      // 编辑课程包
      editCustomPackage(obj){
        if(obj && obj.id){
          this.$router.push({path: ROUTER_CUSTOM_EDIT + "/" + obj.id})
        }
      },
      // 查询课程包内容
      queryPackageInfo(){
        this.initPackageInfo()
      },
      // 根据obj跳转至课时详情
      goCourseList(obj){
        if(obj && obj.id){
          this.$router.push({path: ROUTER_CUSTOM_SEE + "/" + obj.id})
        }
      }
    }
  }
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
  .nodata {
    display: flex;
    justify-content: center;
    align-items: center;
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
    margin-bottom: 10px;
  }
  .el-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    margin-left: 20px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 500;
  }
  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }
</style>
