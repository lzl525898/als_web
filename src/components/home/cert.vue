<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card style="margin:20px 0" shadow="always">
      <el-row type="flex" align="middle">
        <el-col :span="12">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">证书模板
              <el-tooltip class="item" effect="dark" content="证书模板最多可以创建10个" placement="top-start">
                <el-link :underline="false" style="margin-left:5px;"><i class="el-icon-info"></i></el-link>
              </el-tooltip></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display:flex;justify-content:flex-end;">
            <el-button type="primary" size="small" @click="onClickCreate">创建模板</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div v-show="initStatus==true"></div>
    <div v-show="initStatus==false">
      <el-card style="margin-bottom:20px" shadow="always" body-style="min-height:640px;">
        <div v-show="certModalStatus==false">
          <div style="display:flex;justify-content:center;margin-top:40px;align-items:center;">
            <img style="width:300px;" src="../../../static/images/base/nodata.png" alt>
          </div>
        </div>
        <div v-show="certModalStatus==true">
          <div style="display:flex;justify-content:flex-start;flex-wrap:wrap">
            <div style="margin:20px 20px 20px 20px" v-for="(item,index) in certModal" :key="index">
              <el-card body-style="padding:0px;width:300px;" >
                <el-image  :src="item.src" class="image" :preview-src-list="item.srcList" :id="'print_cert_id_'+item.id"></el-image>
                <div style="padding: 14px;">
                  <span>{{item.title}}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{item.date}}</time>
                    <el-tooltip class="item" effect="dark" content="删除证书" placement="top-start" :hide-after="600">
                      <el-button type="danger" size="mini" plain icon="el-icon-delete" circle class="button" @click="onClickDelele(item)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="打印证书" placement="top-start" :hide-after="600">
                      <el-button type="primary" size="mini" plain icon="el-icon-printer" circle class="button" v-print="`#print_cert_id_`+item.id"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下载证书" placement="top-start" :hide-after="600">
                      <el-button type="primary" size="mini" plain icon="el-icon-download" circle class="button" @click="onClickDownload(item)"></el-button>
                    </el-tooltip>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <als-cert-dialog ref="alsCertGenDialog"></als-cert-dialog>
  </div>
</template>
<script>
  import PubSub from 'pubsub-js'
  import childHeader from '../component/childHeader'
  import certGenDialog from '../component/certGenDialog'
  import storageUtil from '../../utils/storageUtil'
  import promptUtil from '../../utils/promptUtil'
  import vuexUtils from '../../utils/vuexUtils'
  import '../../router/router'
  import '../../api/restfulapi'
  import {
    qs,
    getCertList,
    delEduReporter
  } from '../../api/api'
  export default {
    name: "cert",
    components:{"als-child-header": childHeader,"als-cert-dialog":certGenDialog},
    data(){
      return{
        initStatus: true,
        certModalStatus: false,
        certPrintId:'',
        routerConfig: [{name:vuexUtils.checkMenuExist(this,'cert').target.name,to:''}],
        certModal:[],
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", ROUTER_CERT);
      PubSub.subscribe("getCertList", (msg, data) => {
        this.initData(false)
      });
      this.initData()
    },
    watch:{
      certModal(val){
        this.certModalStatus = val.length!=0
      }
    },
    methods:{
      initData(status=true){
        if(status){
          const loading = promptUtil.loading(this)
          getCertList(qs.stringify({school_id:storageUtil.readTeacherInfo().school_id})).then(res=>{
            this.initStatus = false
            loading.close()
            if(res.code==SUCCESS_CODE){
              this.certModal = []
              if(res.data && res.data!='[]'){
                  this.certModal = res.data
              }
            }
          }).catch(err=>{
            loading.close()
            promptUtil.LOG('getCertList-err',err)
          })
        }else{
          getCertList(qs.stringify({school_id:storageUtil.readTeacherInfo().school_id})).then(res=>{
            if(res.code==SUCCESS_CODE){
              this.certModal = []
              if(res.data && res.data!='[]'){
                this.certModal = res.data
              }
            }
          }).catch(err=>{
            promptUtil.LOG('getCertList-err',err)
          })
        }
      },
      onClickCreate(){
        if(this.certModal.length>=10){
          promptUtil.warning(this,'证书模板已达上限，请删除不常用的模板')
        }else{
          this.$refs.alsCertGenDialog.show()
        }
      },
      onClickDownload(row){
        if(row.src && row.src!=''){
          window.open(row.src, "_blank ")
        }else{
          promptUtil.warning(this, '证书图片准备异常，请稍后再试')
        }
      },
      onClickDelele(row){
        this.$confirm('此操作将永久删除该证书模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            delEduReporter(qs.stringify({
                certificate_id:row.id
            })).then(res=>{
               if(res.code==SUCCESS_CODE){
                   this.certModal.splice(this.certModal.findIndex(item=>item.id==row.id),1)
                   this.$message({
                       type: 'success',
                       message: '删除成功!'
                   });
               }else{
                   promptUtil.warning(this,res.msg)
               }
            }).catch(err=>{
                promptUtil.LOG("delEduReporter-err",err)
            })

        }).catch(() => {});
      },
    }
  }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    margin-left:10px;
    float: right;
  }
  .image {
    width: 300px;
    height: 190px;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
