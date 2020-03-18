<template>
  <div>
    <div class="container">
      <!--    nav-->
      <als-header/>
      <!--    banner-->
      <div class="banner">
        <div class="containerRef">
          <div class="bannerDescBox">
            <div class="bannerDesc">
              <h3 class="bannerDescTitle">奥松<span style="color: #31a4fa">云课堂</span>(AEP)</h3>
              <p style="font-size: 32px;color: #555555">全球数字化教学教研服务平台</p>
              <p style="font-size: 20px;color: #3e3e3e">
                <span>智慧管理&nbsp&nbsp|&nbsp&nbsp智慧教学&nbsp&nbsp|&nbsp&nbsp智慧测评</span></p>
              <!--              <div class="applayBtnBox"><a href=""><p class="applayBtn">快速申请试用</p></a></div>-->
              <div class="applayBtn" @click="applayBtn">快速申请试用</div>
            </div>
          </div>
        </div>
      </div>
      <!--      我们能做什么-->
      <div class="doIt">
        <div class="containerRef">
          <div class="title">我们能做什么?</div>
          <div class="titleLine"></div>
          <div class="doItDesc">
            <ul>
              <li>
                <div class="doItItemBgCover">
                  <div class="doItItemBgPrincipal">
                    <div class="doItContent">
                      <span class="headmaster">校长端</span>
                      <div style="color: #fff;margin-top: 20px">
                        <p style="font-size: 24px">智慧管理</p>
                        <p>----------------------</p>
                        <span style="font-size: 16px">操作便捷的教务管理<br>推广引流入口，招生获客工具</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="doItItemBgCover">
                  <div class="doItItemBgTeacher">
                    <div class="doItContent">
                      <span class="headmaster">教师端</span>
                      <div style="color: #fff;margin-top: 20px">
                        <p style="font-size: 24px">智慧教学</p>
                        <p>----------------------</p>
                        <span style="font-size: 16px">丰富的精品课程资源<br>轻松备课省时省力</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="doItItemBgCover">
                  <div class="doItItemBgStudent">
                    <div class="doItContent">
                      <span class="headmaster">学生/家长端</span>
                      <div style="color: #fff;margin-top: 20px">
                        <p style="font-size: 24px">智慧评测</p>
                        <p>----------------------</p>
                        <span style="font-size: 16px">多维度成长轨迹<br>基于微信生态的家校服务平台</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--      产品亮点-->
      <div class="productHighlights">
        <div class="productHighlightsBg">
          <div class="containerRef">
            <div class="title">产品亮点</div>
            <div class="titleLine"></div>
            <div class="productHighlightsBox">
              <ul>
                <li v-for="item in produceData">
                  <div class="produceTotalBox">
                    <div class="productIconBox">
                      <img :src=item.img alt="">
                    </div>
                    <div class="productdescBox">
                      <div style="overflow: hidden">
                      <p>{{item.title}}</p>
                      <span>{{item.con}}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--产品-->
      <div class="course" v-for="(item,index) in coursesData" :key="index">
        <div class="courseTotalBox" v-if="index%2==0">
          <div class="containerRef">
            <div class="courseBox">
              <div class="courseImg">
                <img v-if="index==2" :src=item.img alt="" style="width:76%">
                <img v-else :src=item.img alt="">
              </div>
              <div class="courseDesc" style="margin-left: 30px;">
                <p><span class="pBorderLeft"></span>{{item.title}}</p>
                <span class="pBorderLeftSpan">{{item.con}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="courseTotalBox" style="background-color: #f7f7f7">
          <div class="containerRef">
            <div class="courseBox">
              <div class="courseDesc" style="margin-left: 30px;">
                <p><span class="pBorderLeft"></span>{{item.title}}</p>
                <span class="pBorderLeftSpan">{{item.con}}</span>
              </div>
              <div class="courseImg" style="float:right">
                <img :src=item.img alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      免费试用表单-->
      <div class="freeApplayForm">
        <div class="containerRef">
          <p>体验教育数字化新升级<br>
            申请免费试用</p>
          <div class="cardWhite">
            <div class="cardWhiteBox">
              <el-form ref="form" :rules="rules" :model="form" label-width="80px">

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="机构名称" prop="schoolName">
                      <el-input v-model="form.schoolName" placeholder="请输入机构（学校）名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所在地区" prop="province">
                      <el-input v-model="form.province" style="width: 20%"></el-input>
                      &nbsp&nbsp省&nbsp&nbsp
                      <el-input v-model="form.city" style="width: 20%"></el-input>
                      &nbsp&nbsp市&nbsp&nbsp
                      <el-input v-model="form.area" style="width: 20%"></el-input>
                      &nbsp&nbsp县区
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="margin-top: 30px" prop="name">
                  <el-col :span="12">
                    <el-form-item label="联系人" prop="name">
                      <el-input v-model="form.name" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系电话" prop="phone">
                      <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="freeApplayBtn" @click="freeApplayBtn('form')">立即试用</div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!--      bottom-->
      <als-footer/>
    </div>
    <el-dialog
      title="免费试用"
      :visible.sync="dialogVisible"
      width="440px"
      :modal="false"
      top="230px"
      style="left: 12%"
      :before-close="handleClose">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="机构名称" prop="schoolName">
          <el-input v-model="form.schoolName" placeholder="请输入机构（学校）名称"></el-input>
        </el-form-item>
        <el-form-item label="学员人数" prop="schoolName" class="marginTop">
          <el-input v-model="form.studentNum" placeholder="请输入学员人数"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="province" class="marginTop">
          <el-input v-model="form.province" style="width: 20%"></el-input>
          &nbsp&nbsp省&nbsp&nbsp
          <el-input v-model="form.city" style="width: 20%"></el-input>
          &nbsp&nbsp市&nbsp&nbsp
          <el-input v-model="form.area" style="width: 20%"></el-input>
          &nbsp&nbsp县区
        </el-form-item>
        <el-form-item label="联系人" prop="name" class="marginTop">
          <el-input v-model="form.name" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" class="marginTop">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <div class="freeApplayBtn" @click="freeApplayBtn('form')">立即试用</div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
    import {wheelPlanting} from "../../../static/js/customSwiper";
    //引入swiper
    import Swiper from "swiper";
    import "swiper/dist/css/swiper.min.css";
    //引入jquery
    import $ from "jquery";
    import promptUtil from '../../utils/promptUtil'
    import staticUtil from '../../utils/staticUtil'
    import storageUtil from '../../utils/storageUtil'
    import alsHeader from '../../components/component/header'
    import alsFooter from '../../components/component/footer'
    import '../../api/restfulapi'
    import '../../../static/fonts/fonts.css'
    import {
        qs,
        indexForm,
        getViewIndexInformation
    } from '../../api/api'

    export default {
        components:{'als-header':alsHeader,'als-footer':alsFooter},
        data() {
            return {
                produceData: [],
                coursesData: [],
                form: {
                    schoolName: '',
                    province: '',
                    city: '',
                    area: '',
                    name: '',
                    phone: '',
                    studentNum: ''
                },
                rules: {
                    schoolName: [
                        {required: true, message: '请输入机构学校名称', trigger: 'blur'},
                    ],
                    province: [
                        {required: true, message: '请输入所在地区', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入联系人', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                    ],
                },
                dialogVisible: false,
            };
        },
        mounted() {
            let lang = storageUtil.getLang()
            this.$i18n.locale = lang;
            storageUtil.setLang(lang)
            getViewIndexInformation(qs.stringify({})).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        this.produceData = res.data.produceData
                        this.coursesData = res.data.coursesData
                    }
                } else if (res.code == ERROR_CODE) {
                    promptUtil.error(this, res.msg)
                } else {
                    promptUtil.wait(this)
                }
            }).catch(err => {
                promptUtil.LOG('getSystematicStatistics-err', err)
            })
        },
        methods: {
            applayBtn() {
                // 新逻辑
                this.$router.push({path: '/register'})
                // 旧逻辑
                // this.dialogVisible = true
                // this.resetData()
            },
            handleClose(done) {
                done();
            },
            // 免费注册按钮
            freeApplayBtn(formName) {
                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //         alert('submit!');
                //         promptUtil.success(this, '提交成功，我们会尽快联系您！')
                //     } else {
                //         promptUtil.warning(this, '请输入相关信息')
                //         return false;
                //     }
                // });

                if (this.form.name == "" || this.form.phone == "" || this.form.city == "" ||
                    this.form.schoolName == "" || this.form.province == "" || this.form.area == "") {
                    promptUtil.warning(this, "请输入相关信息")
                    return
                }
                let phoneValdate = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!phoneValdate.test(this.form.phone)) {
                    promptUtil.warning(this, "手机号格式不正确");
                    return;
                }
                indexForm(qs.stringify({
                    name: this.form.name,
                    phone: this.form.phone,
                    schoolName: this.form.schoolName,
                    studentNum: this.form.studentNum,
                    address: this.form.province + this.form.city + this.form.area,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.dialogVisible = false
                        promptUtil.success(this, "提交成功，我们会尽快联系您！")
                        this.resetData()
                        if (res.data && res.data != '[]') {
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('JoinInUs-err', err)
                })
            },
            resetData() {
                this.form = {
                    schoolName: '',
                    province: '',
                    city: '',
                    area: '',
                    name: '',
                    phone: '',
                    studentNum: ''
                }
            }
        },

    };
</script>
<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  ul li {
    list-style: none;
  }

  a {
    text-decoration: none;
    outline: none;
  }

  .marginTop {
    margin-top: 15px;
  }

  .container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'syRegular';
  }

  .containerRef {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
  }

  /*nav*/

  .banner img {
    width: 100%;
    height: 100%;
  }

  .navBox {
    width: 100%;
    height: 80px;
    margin: 0 auto;
  }

  .navLogo {
    float: left;
    cursor: pointer;
  }

  .navLogo {
    /*width: 100%;*/
    /*height: 100%;*/
    margin-top: 11px;
  }

  .itemBox {
    float: right;
  }

  .ulList {
    list-style: none;
    font-size: 16px;
  }

  .ulList li {
    float: left;
    line-height: 80px;
    margin-left: 80px;
    color: #333;
  }

  .ulList li a {
    text-decoration: none;
    color: #1E1F1E;
  }

  .ulList li a:hover {
    text-decoration: none;
    /*color: #31a4fa;*/
    color: #047FD8;
  }

  /*banner*/
  /*.banner{*/
  /*  background: #EFEFF0;*/
  /*  height: 666px;*/
  /*  width: 100%;*/
  /*  overflow: hidden;*/
  /*  position: relative;*/

  /*}*/
  /*.bd{*/
  /*  background: url('../../../static/images/base/newestIndex/banner.png') center top  no-repeat;*/
  /*  position: absolute;*/
  /*  width: 1783px;*/
  /*  height: 666px;*/
  /*  left: 0px;*/
  /*  top: 0px;*/
  /*  display: list-item;*/
  /*}*/

  .banner {
    background: url('../../../static/images/base/newestIndex/banner.png') center top no-repeat;
    height: 666px;
    background-position: center;
  }

  /*.bannerDescBox{*/
  /*  position: relative;*/
  /*}*/
  .bannerDesc {
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 50px;*/
    margin-top: 200px;
    margin-left: 20px;
    overflow: hidden;
  }

  .bannerDesc p {
    line-height: 70px;
  }

  .applayBtn {
    width: 272px;
    height: 50px;
    background: #ff6600;
    text-align: center;
    border-radius: 8px;
    line-height: 50px;
    /*display: block;*/
    /*overflow: hidden;*/
    color: #fff;
    cursor: pointer;
    /*box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.9);*/
    /*box-shadow: 0px 0px 2px 3px rgba(252,153,85,1);*/
    transform: scale(1);
    transition: box-shadow 0.6s, transform 0.5s;
    margin-bottom: 20px;
  }

  .applayBtn:hover {
    width: 272px;
    height: 50px;
    background: #ff6600;
    border-radius: 8px;
    /*box-shadow: 0px 0px 50px 15px rgba(0,0,0,0.9);*/
    box-shadow: 0px 0px 5px 5px rgba(252, 153, 85, 0.9);
    transition: box-shadow 0.5s;
  }

  .bannerDescTitle {
    color: #777778;
    font-size: 40px;
    font-weight: bold;
  }

  /*我们能做什么*/
  .doIt {
    background-color: #ecf8ff;
    width: 100%;
    height: 630px;
  }

  .title {
    font-size: 36px;
    color: #333;
    text-align: center;
    margin-top: 70px;
    overflow: hidden;
  }

  .titleLine {
    width: 30px;
    height: 2px;
    background-color: #047fd8;
    margin: 0 auto;
    margin-top: 10px;
  }

  .doItDesc {
    width: 100%;
    height: 100%;
    margin-top: 20px;
  }

  .doItDesc ul {
    overflow: hidden;
    height: 400px;
    width: 100%;
  }

  .doItDesc ul li {
    overflow: hidden;
    width: 33%;
    height: 100%;
    float: left;
  }

  .doItItemBgCover {
    width: 100%;
    height: 100%;
    background-color: #06affa;
    overflow: hidden;
  }

  .doItItemBgCover:hover {
    width: 100%;
    height: 100%;
    background-color: #5fb5dd;

  }

  .doItItemBgPrincipal {
    background: url("../../../static/images/base/newestIndex/doIt_1.png") no-repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .doItItemBgTeacher {
    background: url("../../../static/images/base/newestIndex/doIt_2.png") no-repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .doItItemBgStudent {
    background: url("../../../static/images/base/newestIndex/doIt_3.png") no-repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .doItContent {
    overflow: hidden;
    width: 215px;
    height: 200px;
    margin: 0 auto;
    margin-top: 80px;
    text-align: center;
    transition: width 1s, height 1s;
    -moz-transition: width 1s, height 1s, -moz-transform 1s; /* Firefox 4 */
    -webkit-transition: width 1s, height 1s, -webkit-transform 1s; /* Safari and Chrome */
    -o-transition: width 1s, height 1s, -o-transform 1s; /* Opera */
  }

  .doItContent:hover {
    transform: scale(1.1);
    -webkit-transform: scale(1.1); /*兼容-webkit-引擎浏览器*/
    -moz-transform: scale(1.1); /*兼容-moz-引擎浏览器*/
  }

  .headmaster {
    border-radius: 2px;
    background-color: #fff;
    padding: 4px 15px;
    color: #0e94d7;
    font-size: 24px;
  }

  /*产品亮点*/
  .productHighlights {
    width: 100%;
    height: 500px;
    background-color: #f7f7f7;
  }

  .productHighlightsBg {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: url("../../../static/images/base/newestIndex/produtBg.png") center center no-repeat;
  }

  /*产品亮点*/
  .productHighlightsBox {
    width: 900px;
    /*width: 1000px;*/
    margin: 0 auto;
    overflow: hidden;
  }

  .productHighlightsBox ul {
    overflow: hidden;
    /*width: 950px;*/
    height: 100%;
    margin-top: 30px;
  }

  .productHighlightsBox ul li {
    /*width: 475px;*/
    height: 100%;
    float: left;
    overflow: hidden;
  }

  .produceTotalBox {
    overflow: hidden;
  }

  .productHighlightsBox ul li:nth-child(n+3) {
    margin-top: 25px;
  }
  .productHighlightsBox ul li:nth-child(2n-1) {
    /*float: right;*/
    width: 525px;
  }

  .productHighlightsBox ul li:nth-child(2n) {
    /*float: right;*/
    float: left;
  }


  /*.productHighlightsBox ul li:not(:first-child){*/
  /*  margin-top: 25px;*/
  /*  margin-left: 50px;*/
  /*}*/
  .productIconBox {
    width: 45px;
    height: 45px;
    float: left;
    margin-top: 8px;
  }

  .productIconBox img {
    width: 100%;
    height: 100%;
    float: left;
  }

  .productdescBox {
    float: left;
    padding-left: 10px;
    /*width: 420px;*/
  }

  .productdescBox p {
    font-size: 24px;
    color: #333;

  }

  .productdescBox span {
    font-size: 16px;
    color: #333;

  }

  /*.productIconBoxLeft{*/
  /*  width: 50%;*/
  /*  height: 100%;*/
  /*  float: left;*/
  /*}*/
  .productIconBoxRight {
    width: 50%;
    height: 100%;
    float: left;

  }

  .rightContent {
    overflow: hidden;
    /*margin-left: 70px;*/
    float: right;
  }

  /*课程*/
  .courseBox {
    margin-top: 80px;
    overflow: hidden;
    /*height: 550px;*/
  }

  .course {
    width: 100%;
  }

  .courseImg {
    width: 720px;
    height: 350px;
    float: left;
    transition: width 1s, height 1s;
    -moz-transition: width 1s, height 1s, -moz-transform 1s; /* Firefox 4 */
    -webkit-transition: width 1s, height 1s, -webkit-transform 1s; /* Safari and Chrome */
    -o-transition: width 1s, height 1s, -o-transform 1s; /* Opera */
  }

  .courseImg:hover {
    transform: scale(0.9);
    -webkit-transform: scale(0.9); /*兼容-webkit-引擎浏览器*/
    -moz-transform: scale(0.9); /*兼容-moz-引擎浏览器*/
    box-shadow: 0px 0px 2px 2px rgba(159, 219, 255, 0.1);
  }

  .course img {
    width: 100%;
  }

  .courseDesc {
    width: 323px;
    /*height: 180px;*/
    float: left;
    margin-top: 100px;
    overflow: hidden;
  }
  .pBorderLeft {
    display: inline-block;
    margin-top: 8px;
    margin-right: 8px;
    width: 4px;
    height: 27px;
    float: left;
    background-color: #047fd8;

  }

  .courseDesc p {
    font-size: 28px;
    /*border-left: 4px blue solid;*/
    color: #333;
    padding-left: 8px;
  }

  .pBorderLeftSpan {
    display: block;
    overflow: hidden;
    padding-top: 20px;
    font-size: 16px;
    color: #999;
  }

  .courseTotalBox {
    background-color: #fff;
    height: 500px;
    width: 100%;
    overflow: hidden
  }

  /*免费申请表单*/
  .freeApplayForm {
    height: 485px;
    width: 100%;
    background-color: #f5915a;
  }

  .freeApplayForm p {
    font-size: 36px;
    color: #fff;
    text-align: center;
    margin-top: 10px;
  }

  .cardWhite {
    width: 866px;
    height: 292px;
    background-color: #fff;
    margin: 0 auto;
    border-radius: 10px;
    margin-top: 18px;
    overflow: hidden;
  }

  .cardWhiteBox {
    width: 732px;
    height: 208px;
    margin: 0 auto;
    margin-top: 55px;
  }

  /*.el-input {*/
  /*  width: 80%;*/
  /*}*/

  .freeApplayBtn {
    cursor: pointer;
    width: 295px;
    height: 37px;
    background-color: #ff6600;
    line-height: 37px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    margin: 0 auto;
    margin-top: 22px;
    margin-bottom: 20px;
  }

  .freeApplayBtn:hover {
    cursor: pointer !important;
    box-shadow: 0px 0px 3px 2px rgba(245, 145, 90, 0.9);
  }
  /*.el-carousel__item:nth-child(2n) {*/
  /*  background-color: #99a9bf;*/
  /*}*/
  /*.el-carousel__item:nth-child(2n+1) {*/
  /*  background-color: #d3dce6;*/
  /*}*/
</style>


