<template>
  <div>
    <div class="container" :style="{height:hei+'px',width:wid+'px'}">
      <div class="banner">
        <div class="nav">
          <div class="containerRef">
            <div class="left">
<!--              <img src="../../../static/images/base/index/top_logo.png" alt style="margin-top: 11px">-->
              <div class="left">
                <img src="../../../static/images/base/newIndex/smallLogo.png" alt>
                <p style="float: left;line-height: 80px;padding-left: 8px"><span style="font-size: 30px;color: #fff">编程爸爸</span><span
                  style="width: 5px;height: 5px;background-color: #fff;display: inline-block;border-radius: 50%"></span><b
                  style="font-size: 25px;color: #fff;font-weight: normal">创学堂</b></p>
              </div>

            </div>
            <div class="right">
              <ul class="ulList">
                <li>
                  <router-link to="/home" replace>首页</router-link>
                </li>
                <li>
                  <router-link to="/login" replace>教师社区</router-link>
                </li>
                <li>
                  <router-link to="/join" replace>招商加盟</router-link>
                </li>
                <li>
                  <a href="https://vr.justeasy.cn/view/6580309.html" target="_blank" style="text-decoration: none;color: #fff"><span>实体教室</span></a>
                </li>
                <li>
                  <router-link to="/about" replace>联系我们</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="containerRef">
          <div class="content">
            <div class="contentBox">
              <p>“编程爸爸”是隶属于奥松智能科技（深圳）股份有限公司旗下的少儿编程教育品牌。以“奥松云课堂”SaaS平台为依托，“编程吧”在线编程软件为载体，结合奥松自研课程及专属教具，“编程爸爸创学堂”从课程研发、教学管理、教具采购等环节为教育机构提供全体系化教育解决方案，构建一站式少儿编程生态圈。</p>
              <p>“编程爸爸创学堂”倡导“亲子共学 快乐编程”的陪伴式学习理念，号召家长和孩子共同学习，为孩子在最具安全感的情况下创造轻松的学习氛围，增加家长与孩子的互动，在培养孩子编程思维及创造能力的同时，让家长见证孩子点滴成长。</p>
            </div>
          </div>
          <div class="footer">
            <div class="containerRef">
              <div class="lastleft">
<!--                <img src="../../../static/images/base/index/top_logo.png" alt>-->
                <!-- <span class="lf-l">校园</span> -->
                 <img src="../../../static/images/base/newIndex/smallLogo.png" alt >

                <p style="float: left;padding-left: 8px;padding-top: 20px"><span style="font-size: 30px;color: #fff">编程爸爸</span>
                  <span style="width: 5px;height: 5px;background-color: #fff;display: inline-block;border-radius: 50%"></span>
                  <b style="font-size: 25px;color: #fff;font-weight: normal">创学堂</b></p>
              </div>
              <div class="lastright">
<!--                <p>哈尔滨总公司地址：黑龙江哈尔滨香坊区衡山路18号远东大厦B区10层</p>-->
<!--                <p>Tel:18945688768 0451-86628691</p>-->
                <p>{{addressTitle}}：{{addressValue}}</p>
                <p>{{telTitle}}：{{telValue}}</p>
              </div>
            </div>
          </div>
        </div>
        <p style="position: absolute;bottom: 3px;left: 50%;transform: translate(-50%);color: #fff;font-size: 12px; font-family: 'syRegular';">奥松智能 ｜<el-link :underline="false" href="http://www.beian.miit.gov.cn" target="_blank" style="color:#fff">粤ICP备19107383号-1</el-link></p>
      </div>
    </div>
  </div>
</template>
<script>

    import promptUtil from '../../utils/promptUtil'
    import '../../api/restfulapi'
    import {
        qs,
        getTelAddress
    } from '../../api/api'
export default {
  data() {
    return {
        addressTitle: '',
        addressValue: '',
        telTitle: '',
        telValue: ''
    };
  },
    mounted(){
        this.getAdressTelInformation()
    },
    methods:{
        getAdressTelInformation() {
            getTelAddress(qs.stringify({
                config_key: "tel,address"
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        // console.log("res", res)
                        this.addressTitle=res.data.address.title
                        this.addressValue=res.data.address.value
                        this.telTitle= res.data.tel.title
                        this.telValue= res.data.tel.value

                    }
                } else if (res.code == ERROR_CODE) {
                    promptUtil.error(this, res.msg)
                } else {
                    promptUtil.wait(this)
                }
            })
        }
    },
  created() {
    this.hei =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.wid =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
  }
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
.container {
  width: 100%;
  height: 100%;
}
.containerRef {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.banner {
  background: url("../../../static/images/base/index/callUs.jpg") no-repeat;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-position: center;
  position: relative;
}
.nav {
  height: 80px;
  border-bottom: 2px #fff solid;
}
.left {
  float: left;
  font-family: 'syRegular';
}
.left img {
  float: left;
  /* margin-top: 10px; */
  display: block;
  /* border-right: 2px #fff solid; */
}
.lastleft {
  float: left;
  font-family: 'syRegular';
  /* margin-top: 10px; */
}
.lastleft img {
  float: left;
  /* margin-top: 10px; */
  display: block;
}
.right {
  float: right;
}
.f-l {
  float: left;
  line-height: 80px;
  font-size: 30px;
  display: block;
  color: #008ccf;
  padding-left: 8px;
  overflow: hidden;
}
.lf-l {
  float: left;
  line-height: 80px;
  font-size: 30px;
  display: block;
  color: #fff;
  padding-left: 8px;
  overflow: hidden;
}
.ulList {
  list-style: none;
  font-size: 20px;
}
.ulList li {
  float: left;
  line-height: 80px;
  margin-left: 40px;
  color: #fff;
  font-family: SimHei;
}
.ulList a,
.contentLeft a {
  text-decoration: none;
  color: #fff;
  font-family: SimHei;
}
/* a:hover */
.ulList li:hover {
  font-family: SimHei;
  border-bottom: 3px #008ccf solid;
}
.ulList a:hover {
  color: #fff;
  font-family: SimHei;
}

.footer {
  height: 80px;
  position: absolute;
  bottom: 0;
}
.lastright {
  float: right;
   margin-top: 14px;
}
.lastright p {
  color: #fff;
  line-height: 30px;
  text-align: right;
  font-family: SimHei;
}

/*
中间 */
/* .content{
    height: 300px;
    position: relative;

} */
.contentBox {
  width: 800px;
  height: 300px;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -400px;
}
.contentBox p {
  font-family: SimHei;
  font-size: 20px;
  color: #fff;
  line-height: 40px;
  /* margin-top: 40px; */
  text-indent: 35px;
}
</style>


