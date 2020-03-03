<template>
    <div>
      <el-row style="margin-bottom:20px">
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-card shadow="never" body-style="padding-bottom:0px">
        <div slot="header" style="display:flex">
          <div class="course-header-title"><span style="color:#E6A23C;">未开通</span></div>
          <div class="course-header-filter-wrapper"><div style="color:#40a9ff;cursor: pointer;" @click="handleClickIntoRecord">订购记录</div></div>
        </div>
        <el-row style="padding-left: 30px;margin-top:10px;">
          <el-col :span="8" v-for="unBuyItem in unBuy" :key="unBuyItem.id" style="margin-bottom:30px;">
            <als-course-card :detail="unBuyItem" :deleteItem="currentDeleteId" :selectItem="currentSelectId"
                             @handleCheck="statisticsTotal($event)"
                             @handleDetail="handleShowDetail($event)"/>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" body-style="padding-bottom:0px">
        <div slot="header" style="display:flex">
          <div class="course-header-title"><span style="color:#67C23A">已开通</span></div>
        </div>
        <el-row style="padding-left: 30px;margin-top:10px;">
          <el-col :span="8" v-for="buyItem in buy" :key="buyItem.id" style="margin-bottom:30px;">
            <als-course-card :detail="buyItem" @handleCheck="statisticsTotal($event)" :deleteItem="currentDeleteId"/>
          </el-col>
        </el-row>
      </el-card>
      <div style="height:60px;"></div>
      <div class="course-footer">
        <el-row>
          <el-col :span="8" :offset="14">
            <el-popover
              placement="top"
              :offset="200"
              width="560"
              trigger="hover">
              <div>
                <div class="checked-item-header">已选课程</div>
                <div class="checked-list-wrapper">
                  <div class="checked-item">
                    <div v-show="totalInfo.details.length==0" style="height:240px;line-height:240px;text-align:center;color:#888888">暂无数据</div>
                    <div v-show="totalInfo.details.length!=0" class="checked-item-content" v-for="course in totalInfo.details" :key="course.id">
                      <img :src="course.imgUrl" class="checked-item-img"/>
                      <div class="checked-item-title">{{course.firstName}}</div>
                      <div class="checked-item-price">￥{{course.price}}/年</div>
                      <div class="checked-item-delete" @click="handleClickDeleteItem(course)"><i class="el-icon-delete"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="height:60px;display:flex;align-items:center;cursor:pointer" slot="reference">
                <div>已选课程:</div>
                <div style="color:#FB6161;margin-left:3px;margin-right:3px">{{totalInfo.count}}</div>
                <i class="el-icon-caret-top" style="color:#c1c4ca"/>
                <div style="margin-left: 20px">合计:</div>
                <div style="color:#FB6161">{{totalInfo.price}}<span style="margin-left:3px">元</span></div>
              </div>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <el-button type="primary" :disabled="totalInfo.details.length==0" style="position: absolute;right:30px;bottom:10px;z-index: 100" @click="handleClickBuyStep">下一步</el-button>
      <als-course-detail ref="selectCourseDetail" @targetCourse="addTargetCourse($event)"/>
    </div>
</template>

<script>
    import PubSub from "pubsub-js"
    import promptUtil from '../../utils/promptUtil'
    import storageUtil from '../../utils/storageUtil'
    import childHeader from '../component/childHeader'
    import courseCard from '../component/service/courseCard'
    import courseDetail from '../component/service/courseDetailDialog'
    import '../../router/router'
    import {qs,getSchoolDueInfo} from '../../api/api'
    import '../../api/restfulapi'
    export default {
        components: {
            "als-course-detail": courseDetail,
            "als-course-card": courseCard,
            "als-child-header": childHeader,
        },
        name: "courseBuy",
        data(){
            return {
                callUs:{tel:'',img:''},
                currentSelectId: 0,
                currentDeleteId: 0,
                totalInfo: {
                    count: 0,
                    price: 0,
                    details:[]
                },
                routerConfig: [{name:'',to:''}],
                buy: [
                    {id:11,imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',firstName:'百变奥聪的神奇之旅',secondName:'大颗粒积木搭建类课程 2',price:'2000',type:1,time:'2021-02-25 12:37:21'},
                    {id:12,imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',firstName:'百变奥聪的神奇之旅',secondName:'大颗粒积木搭建类课程 2',price:'101300',type:1,time:'2021-02-25 12:37:21'},
                    {id:13,imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',firstName:'百变奥聪的神奇之旅',secondName:'大颗粒积木搭建类课程 2',price:'10000',type:1,time:'2021-02-25 12:37:21'},
                    {id:14,imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',firstName:'百变奥聪的神奇之旅',secondName:'大颗粒积木搭建类课程 2',price:'10000',type:1,time:'2021-02-25 12:37:21'},
                ],
                unBuy: [
                    {
                        id:1,
                        imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',
                        firstName:'百变奥聪的神奇之旅',
                        secondName:'大颗粒积木搭建类课程 2',
                        price:'10000',
                        type:0,
                        time:'2021-02-25 12:37:21',
                        desc: '联系生活实际，锻炼动手能力、空间能力、表达能力',
                        level: 'level 1',
                        ageStage: '3-4+',
                        training: '奥松大颗粒积木套件1',
                        classes: 16,
                    },
                    {
                        id:2,
                        imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',
                        firstName:'百变奥聪的神奇之旅',
                        secondName:'大颗粒积木搭建类课程 2',
                        price:'10000',
                        type:0,
                        time:'2021-02-25 12:37:21',
                        desc: '联系生活实际，锻炼动手能力、空间能力、表达能力',
                        level: 'level 1',
                        ageStage: '3-4+',
                        training: '奥松大颗粒积木套件1',
                        classes: 16,
                    },
                    {
                        id:3,
                        imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',
                        firstName:'百变奥聪的神奇之旅',
                        secondName:'大颗粒积木搭建类课程 2',
                        price:'10000',
                        type:0,
                        time:'2021-02-25 12:37:21',
                        desc: '联系生活实际，锻炼动手能力、空间能力、表达能力',
                        level: 'level 1',
                        ageStage: '3-4+',
                        training: '奥松大颗粒积木套件1',
                        classes: 16,
                    },
                    {
                        id:4,
                        imgUrl:'https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/report/images/20191206/oss_宣导课.jpg',
                        firstName:'百变奥聪的神奇之旅',
                        secondName:'大颗粒积木搭建类课程 2',
                        price:'10000',
                        type:0,
                        time:'2021-02-25 12:37:21',
                        desc: '联系生活实际，锻炼动手能力、空间能力、表达能力',
                        level: 'level 1',
                        ageStage: '3-4+',
                        training: '奥松大颗粒积木套件1',
                        classes: 16,
                    }
                ],
            }
        },
        mounted() {
            this.routerConfig = [{name:this.$t(`message.course_buy_header_title`),to:''}]
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", ROUTER_COURSE_BUY)
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
            },
            addTargetCourse(data){
                let result = this.totalInfo.details.findIndex(detail=>detail.id==data.detail.id)
                if(result<0){ // 已经存在就不增加费用
                    this.totalInfo.count += 1
                    this.totalInfo.price += data.price
                    this.totalInfo.details.push(data.detail)
                    this.currentSelectId = data.detail.id * 1
                }
            },
            statisticsTotal(data){
                if(data.status){
                    this.totalInfo.count += 1
                    this.totalInfo.price += data.price
                    this.totalInfo.details.push(data.detail)
                }else{
                    this.totalInfo.count -= 1
                    this.totalInfo.price -= data.price
                    this.totalInfo.details.splice(this.totalInfo.details.findIndex(detail=>detail.id==data.detail.id),1)
                }
            },
            handleClickDeleteItem(course){
                this.totalInfo.count -= 1
                this.totalInfo.price -= course.price
                this.totalInfo.details.splice(this.totalInfo.details.findIndex(detail=>detail.id==course.id),1)
                this.currentDeleteId = course.id*1
            },
            handleShowDetail(detail){
                detail.callUs = this.callUs
                this.$refs.selectCourseDetail.show(detail)
            },
            handleClickBuyStep(){
                this.$router.push({path: ROUTER_BUY_STEP})
            },
            handleClickIntoRecord(){
                this.$router.push({path:ROUTER_SERVICE_RECORD})
            }
        }
    }
</script>

<style scoped>
  .course-header-title{
    font-size: 20px;
    font-family: PingFangSC-Medium;
    font-weight: 600;
    color: #333333;
  }
  .course-header-filter-wrapper{
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .course-footer{
    color: #353535;
    z-index: 99;
    position:fixed;
    bottom:0;
    width: 100%;
    margin-left:-20px;
    background-color:#fff;
    height:60px;
    box-shadow: 2px 2px 6px 3px #33333380;
  }
  .checked-list-wrapper{
    height: 240px;
    overflow-y: scroll;
  }
  .checked-item-header{
    padding-left: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    height: 30px;
    font-size:14px;
    color: #353535;
    line-height: 30px;
    border-bottom: 1px solid #c3c3c3;
  }
  .checked-item{
    padding:10px 0 10px 0;
  }
  .checked-item-content{
    display:flex;
    height:60px;
    align-items:center;
    flex: 1;
  }
  .checked-item-content:hover{
    cursor: pointer;
    background-color: #eef5ff;
  }
  .checked-item-img{
    width:40px;
    height:40px;
    border-radius:4px;
    padding: 0 10px;
  }
  .checked-item-title{
    width:298px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .checked-item-price{
    width:130px;
    font-family: PingFangSC-Regular;
  }
  .checked-item-delete{
    text-align: center;
  }
  .checked-item-delete:hover{
    color: #00a2d4;
  }
</style>
