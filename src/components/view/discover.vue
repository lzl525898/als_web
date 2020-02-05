<template>
  <div>
    <div class="container">
      <als-header/>
      <div style="display:flex;justify-content:center">
        <div style="display:flex;flex-direction:column">
          <el-row :gutter="20" style="width:1200px">
            <el-col :span="24">
                <div style="margin-top: 30px;display:flex">
                  <div style="flex:2">
                    <el-radio-group v-model="filterInfo.category" @change="onChangeWorksCategory">
                      <el-radio-button label="0" border style="border:1px solid #409eff;border-radius:3px;">全部</el-radio-button>
                      <el-radio-button :label="cate.value" border style="border:1px solid #409eff;border-radius:3px;" v-for="(cate,index) in category" :key="index">{{cate.label}}</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div style="flex:1;display:flex;justify-content:flex-end">
                    <el-input placeholder="请输入内容" v-model="filterInfo.keyword" style="width:260px;border-top-right-radius:0;border-bottom-right-radius:0;margin-right:-2px;z-index:10"></el-input>
                    <el-button type="primary" style="height:40px;border-top-left-radius:0;border-bottom-left-radius:0;z-index:50" @click="onClickSearch">搜索</el-button>
                  </div>
                </div>
                <div style="margin-top: 30px;">
                  <el-radio-group v-model="filterInfo.type" @change="onChangeWorksType">
                    <el-radio-button label="1">最热</el-radio-button>
                    <el-radio-button label="2">最新</el-radio-button>
                  </el-radio-group>
                </div>
                <div class="works-wrapper" v-show="worksShowStatus==false">
                <div  style="height:550px;flex:1;display:flex;"></div>
              </div>
              <div class="works-wrapper" v-show="worksShowStatus&&works.server.length==0" style="flex:1">
                <div style="height:550px;flex:1;display:flex;justify-content:center;align-items:center"><img style="width:270px; height:330px" :src="noDataUrl" fit="fill"/></div>
              </div>
              <div class="works-wrapper" v-show="worksShowStatus && works.server.length>0" style="flex:1">
                <als-work-item class="works-item-wrapper" v-for="(work,workIndex) in works.data" :key="workIndex"
                               :avatar="work.avatar" :content="work.content" :imgUrl="work.imgUrl" :userName="work.userName" :worksId="work.worksId"
                               :seeCount="work.seeCount*1" :praiseCount="work.praiseCount*1" :praise="work.praise*1" :worksUrl="work.worksUrl"/>
              </div>
              <als-page :size="15" @tableData="changeWorksData($event)" ref="alsPageinationWorks"/>
              <div style="height: 30px;"></div>
            </el-col>
          </el-row>
        </div>
      </div>
      <als-footer id="alsFooter"/>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import PubSub from 'pubsub-js'
  import promptUtil from '../../utils/promptUtil'
  import storageUtil from '../../utils/storageUtil'
  import '../../router/router'
  import alsHeader from '../../components/component/header'
  import alsFooter from '../../components/component/footer'
  import alsWorkItem from '../../components/component/discover/workItem'
  import alsPagination from '../../components/commons/pagination/pagination'
  import '../../api/restfulapi'
  import {
    qs,
    getScratchCategory,
    getPublishedScratchWorksList
  } from '../../api/api'
  export default {
    components:{'als-header':alsHeader,'als-footer':alsFooter,'als-work-item':alsWorkItem,'als-page':alsPagination},
    name: "discover",
    data(){
      return{
        noDataUrl:require("../../../static/images/base/nodata.png"),
        worksShowStatus:false,
        category:[],
        filterInfo:{type:1,category:0,keyword:''},
        works:{
          server:[],
          data: [],
        },
      }
    },
    mounted(){
      // 订阅弹出发布对话框的消息
      PubSub.subscribe("updateScratchWorksList", (msg, data) => {
        this.onChangeWorksCategory()
      });
      this.initData()
    },
    methods:{
      setStyleConditions(){
        $('#alsFooter').removeClass('footer-bottom')
        let scrollHeight = document.body.scrollHeight
        let windowHeight = document.documentElement.clientHeight
        if(windowHeight>scrollHeight){
          $('#alsFooter').addClass('footer-bottom')
        }
      },
      initData(){
        if(sessionStorage.getItem('scratch_category')){
          this.category = JSON.parse(sessionStorage.getItem('scratch_category'))
        }else{
          getScratchCategory().then(res=>{
            if(res.code==SUCCESS_CODE){
              if(res.data && res.data!='[]'){
                res.data.map(item=>{
                  const obj = {value:item.id,label:item.category_name}
                  this.category.push(obj)
                  sessionStorage.setItem('scratch_category',JSON.stringify(this.category))
                })
              }
            }
          }).catch(err=>{
            promptUtil.LOG('getScratchCategory-err',err)
          })
        }
        this.onChangeWorksCategory()
      },
      getScratchWorksListFromServer(){
        const loading = promptUtil.loading(this)
        this.worksShowStatus = false
        const userId = storageUtil.readTeacherInfo() ? storageUtil.readTeacherInfo().id : 0
        getPublishedScratchWorksList(qs.stringify({
          user_id: userId,
          bq: this.filterInfo.category,
          type: this.filterInfo.type,
          keyword: this.filterInfo.keyword,
        })).then(res=>{
          this.works.server = []
          if(res.code==SUCCESS_CODE){
            if(res.data&&res.data!='[]'){
              this.works.server = res.data
            }
            this.$refs.alsPageinationWorks.setServerData(this.works.server)
          }
          this.worksShowStatus = true
          for(let i=0;i<20;i++){
            setTimeout(()=>{
              this.setStyleConditions()
            },10*i)
          }
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG('getScratchWorksList-err',err)
        })
      },
      onChangeWorksCategory(){
        this.getScratchWorksListFromServer()
        try{
          this.$refs.alsPageinationWorks.setCurrentPage(1)
        }catch (e) {}
      },
      onClickSearch(){
        this.onChangeWorksCategory()
      },
      onChangeWorksType(){
        this.onChangeWorksCategory()
      },
      changeWorksData(data){
        this.works.data = data
      },
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'syRegular';
  }
  .works-wrapper{
    padding:20px;
    display:flex;
    flex-flow:wrap;
    justify-content:flex-start;
  }
  .works-item-wrapper{
    width:205px;
    margin:10px;
    box-shadow:0 0 10px 2px #aaa;
    border-radius:8px;
    border:none;
  }
  .footer-bottom{
    width:100%;
    position: fixed;
    bottom:0
  }
</style>
