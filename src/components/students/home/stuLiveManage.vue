<template>
    <div>
      <!-- 面包屑 -->
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>直播课</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <div v-if="liveInfo .length==0">
          <div style="font-size: 30px;color:#e6e6e6;font-weight: bold;display: flex;justify-content: center;align-items: center;height: 400px;">暂无直播课程</div>
        </div>
        <el-col>
          <div class="grid-content bg-purple-light">
            <div class="el-box" v-for="(item,index) in liveInfo" :key="index">
              <div class="el-card">
                <img
                  :src="item.img"
                  alt
                  class="cover"
                  @click="databaseLiveList"
                  :currentLive-id="item.id"
                >
                <div class="el-txt-box">
                  <div class="el-txtBox">
                    <span class="el-txt">标题：{{item.title}}</span><br>
                  </div>
                  <el-tooltip class="item" effect="dark"  :content="item.con" placement="bottom">
                    <div class="detailBox">
                      <span class="detail">简介：{{item.con}}</span><br>
                    </div>
                  </el-tooltip>
                  <span class="el-txt">最大并发量：{{item.max_users}}</span><br>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import '../../../api/restfulapi';
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import {getCoursesLivePackage} from "@/api/api.js";
    import PubSub from "pubsub-js";
    export default {
      data(){
        return{
          liveInfo:[]
        }
      },
      mounted:function(){
        promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
        const loading = promptUtil.loading(this);
        getCoursesLivePackage({
          user_id:storageUtil.readTeacherInfo().id
        })
          .then(res => {
            PubSub.publish("currentMenuIndex", "/resources");
            loading.close();
            if (res.code == SUCCESS_CODE) {
              this.liveInfo = [];
              if(res.data && res.data!='[]'){
                this.liveInfo = res.data;
              }
            } else {
              promptUtil.wait(this);
            }
          })
          .catch(err => {
            loading.close();
            promptUtil.timeout('getCoursesLivePackage-err',err);
          });
      },
      methods:{
        databaseLiveList(event) {
          this.$router.push({path: "/resourcesLiveList/"+ event.target.getAttribute("currentLive-id")});
        }
      }
    }
</script>


<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-box {
    margin: 15px 15px;
    float: left;
    width: 300px;
    margin-left: 55px;
  }
  .el-card {
    border-radius: 10%;
    box-shadow: 2px 2px 5px #eee;
    border: none;
  }
  .cover {
    /* height: calc(100% - 66px); */
    background-position: 50% !important;
    background-size: cover !important;
    height: 200px;
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
  .el-txtBox{
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-txt {
    height: 40px;
    line-height: 40px;
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
</style>
