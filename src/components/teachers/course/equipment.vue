<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row>
      <el-card class="mat_20">
        <el-row class="elCol">
          <el-col :span="3" style="width: 200px;" v-for="item in equipmentData" :key="item.id">
            <el-card :body-style="{ padding: '0px'}" shadow="hover" style="margin-bottom: 20px">
              <img :src=item.img class="image" @click="seeDesc(item.id)">
              <div style="padding: 14px;">
                <el-tooltip class="item" effect="dark" :content=item.title placement="top">
                  <span class="adapt">{{item.title}}</span>
                </el-tooltip>
                <div class="bottom clearfix">
                  <time class="price">{{item.price}}</time>
                  <el-button type="text" class="button" @click="seeDesc(item.id)">查看详情</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </el-row>


  </div>
</template>

<script>
  import PubSub from "pubsub-js";
  import vuexUtils from '../../../utils/vuexUtils'
  import storageUtil from '../../../utils/storageUtil'
  import promptUtil from '../../../utils/promptUtil'
  import childHeader from '../../component/childHeader'
  import '../../../router/router'
  import '../../../api/restfulapi'
  import {
    qs,
    equipmentList,
    equipmentDesc
  } from '../../../api/api'
  export default {
    components: {"als-child-header": childHeader},
    name: "equipment",
    data() {
      return {
        routerConfig: [{name: vuexUtils.checkMenuExist(this, 'equipment').target.name, to: ''}],
        currentDate: new Date(),
        equipmentData: []
      }
    },
    mounted() {
      equipmentList(qs.stringify({})).then(res=>{
        if (res.code==SUCCESS_CODE){
          if (res.data&&res.data!='[]'){
            this.equipmentData=res.data
          }
        } else if(res.code==ERROR_CODE){
          promptUtil.error(this,res.msg)
        }else{
          promptUtil.wait(this)
        }
      }).catch(err=>{
        promptUtil.LOG('equipmentList-err',err)
      })
    },
    methods: {
      // 查看详情
      seeDesc(itemId){
        this.$router.push({path:'/equipment/'+itemId})
      },

    }
  }
</script>

<style scoped>
  .mat_20 {
    margin-top: 20px;
  }

  .price {
    font-size: 16px;
    color: red;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    height: 198px;
    cursor: pointer;
    object-fit: scale-down;
    /*margin-left: 20px;*/
    /*margin-right: 20px;*/
    /*margin-top: 20px;*/
    overflow: hidden;
    width: 100%;
    /*width: 160px;*/
    /*height: 100%;*/
    transition: width 1s, height 1s;
    -moz-transition: width 1s, height 1s, -moz-transform 1s; /* Firefox 4 */
    -webkit-transition: width 1s, height 1s, -webkit-transform 1s; /* Safari and Chrome */
    -o-transition: width 1s, height 1s, -o-transform 1s; /* Opera */
  }
  .image:hover{
    transform: scale(1.1);
    -webkit-transform: scale(1.1); /*兼容-webkit-引擎浏览器*/
    -moz-transform: scale(1.1); /*兼容-moz-引擎浏览器*/
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .elCol>.el-col{
    margin-left: 20px;
    margin-top: 20px;
  }
  /*.elCol>.el-card:nth-child(n+7){*/
  /*  margin-top: 10px;*/
  /*  */
  /*}*/
  .elCol>.el-col:not(:first-child) {
  }
  .adapt{
    display: block;
    height: 66px;
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
