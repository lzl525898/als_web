<template style="height: 100%;">
  <div style="height: 100%;position: relative">
    <!-- 面包屑 -->
    <el-row style="margin-bottom: 20px">
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>

    <!--      calc(100% - 240px)-->
    <!--      <div style="font-size: 18px;color: #2a2a2a;flex:8;display:flex;flex-direction:column;justify-content: center;align-items: center;width: 100%;" >-->
    <!--        &lt;!&ndash;&ndash;&gt;-->
    <!--        <div>-->
    <!--          <div class="imgBackgroundBox">-->
    <!--            <img src="../../../static/images/base/index/logo_blue.png" class="imgBackground" alt>-->
    <!--          </div>-->
    <!--          <el-row>-->
    <!--            <el-col :span="12">-->
    <!--              <div class="grid-content bg-purple">-->
    <!--                <p>电话：{{info.tel}}</p>-->
    <!--                <p>邮箱：{{info.email}}</p>-->
    <!--                <p>公众号：alsrobotbase</p>-->
    <!--                <p>地址：哈尔滨市香坊区衡山路18号</p>-->
    <!--              </div>-->
    <!--            </el-col>-->
    <!--            <el-col :span="12">-->
    <!--              <div class="grid-content bg-purple-light">-->
    <!--                <p>更新说明</p>-->
    <!--                <p>日期：2019年7月12日</p>-->
    <!--                <p>新增：帮助文档及使用指南</p>-->

    <!--              </div>-->
    <!--            </el-col>-->
    <!--          </el-row>-->

    <!--          &lt;!&ndash;          <div style="padding:0 20px;">&ndash;&gt;-->
    <!--          &lt;!&ndash;            <p>电话：{{info.tel}}</p>&ndash;&gt;-->
    <!--          &lt;!&ndash;            <p>邮箱：{{info.email}}</p>&ndash;&gt;-->
    <!--          &lt;!&ndash;            <p>公众号：alsrobotbase</p>&ndash;&gt;-->
    <!--          &lt;!&ndash;            <p>地址：哈尔滨市香坊区衡山路18号</p>&ndash;&gt;-->
    <!--                      <div style="text-align: center;">-->
    <!--                        <el-button type="primary" @click="goHelp">常见问题及使用指南</el-button>-->
    <!--                        <el-button type="primary">操作指引</el-button>-->
    <!--                      </div>-->
    <!--          &lt;!&ndash;          </div>&ndash;&gt;-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div style="flex:1;padding-left: 30px;">-->
    <!--        <h2>更新说明</h2>-->
    <!--        <h3>日期：2019年7月12日</h3>-->
    <!--        <p>新增：帮助文档及使用指南</p>-->
    <!--      </div>-->
    <div class="container">
      <div class="imgBackgroundBox">
        <el-image :src="info.icon">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <div style="margin-top: 30px;">
        <el-row :gutter="20">
          <el-col :span="13">
            <div class="grid-content bg-purple" style="float:right;border-right: 1px #eee solid;padding-right:10px;margin-right: -11px;">
              <p>电话：{{info.tel}}</p>
              <p>邮箱：{{info.email}}</p>
              <p>公众号：{{info.gz_wechart}}</p>
              <p>地址：{{info.address}}</p>
              <div style="text-align: center;margin-top: 100px;">
                <!--        <el-button type="primary" @click="goHelp">常见问题及使用指南</el-button>-->
                <el-button v-if="info.help_pdf && info.help_pdf!=''" type="primary" @click="goHelp">查看说明文档</el-button>
                <el-button type="primary" @click="helpVideo">操作指引</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="11" style="float:right;border-left: 1px #eee solid;padding-left:10px">
            <div class="grid-content bg-purple-light">
              <p>更新说明</p>
              <p>当前版本：{{this.update.version}}</p>
              <div v-for="(item, index) in update.info" :key="index">
                <p>日期：{{item.time}}</p>
                <div><div style="float:left">新增：</div>
                  <div v-for="(infoItem,infoIndex) in item.info" :key="infoIndex" style="display:flex;flex-direction:column;margin-left:48px">
                    <div>{{infoItem}}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      @close="helpDialogClose"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <video id="helpMovie" controls="controls" style="width: 100%;border:3px solid #409EFF;border-radius:3px;" :src="info.help_video"></video>
    </el-dialog>
  </div>
</template>

<script>
  const moment = require("moment")
  import PubSub from "pubsub-js"
  import childHeader from '../component/childHeader'
  import promptUtil from '../../utils/promptUtil'
  import storageUtil from '../../utils/storageUtil'
  import {
    contact
  } from "../../api/api"

  export default {
    components: {
      "als-child-header": childHeader
    },
    data() {
      return {
        routerConfig: [{name:'联系我们',to:''}],
        centerDialogVisible:false,
        info: {
          tel:"",email:"",address:"",gz_wechart:"",icon:"",help_video:"",help_pdf:""
        },
        update: {
          version: '',
          info: [],
        }
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", "/contactUs")
      const loading = promptUtil.loading(this);
      contact().then(res => {
        loading.close();
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.info = res.data;
            this.genUpdateInfo(this.info.update)
          }
        } else {
          promptUtil.wait(this);
        }
      })
        .catch(err => {
          loading.close();
          promptUtil.LOG("contact-err",err)
        });
    },
    methods: {
      genUpdateInfo(data){
        if(data && data.length>0){
          this.update.version = data[0].code
          data.map(item=>{
            const updateObj = {time:"",info:[]}
            updateObj.time = moment(item.time*1000).format("YYYY年MM月DD日")
            updateObj.info = JSON.parse(item.new_json)
            this.update.info.push(updateObj)
          })
        }
      },
      helpDialogClose(){
        const video = document.getElementById('helpMovie')
        video.pause()
        this.centerDialogVisible = false
      },
      helpVideo(){
        this.centerDialogVisible = true
      },
      goHelp() {
        window.open(this.info.help_pdf, '_blank');
      }
    }
  }
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .bg-purple-dark {
    background: #eee;
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

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .imgBackgroundBox {
    width: 400px;
    margin: 0 auto;
    /*overflow: hidden;*/
  }
  .imgBackground {
    margin: 0 auto;
  }
  .container{
    margin-top: 6%;
  }
</style>
