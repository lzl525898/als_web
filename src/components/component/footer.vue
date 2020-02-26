<template>
  <div>
    <div class="bottomBox">
      <div class="containerRef">
        <div class="bottom">
          <div class="bottomLeft">
            <ul>
              <li>
                <p class="bottomTitle">关于我们</p>
                <p><a href="http://www.alsedu.com/about.html#company" target="_blank">公司简介</a></p>
                <p><a href="http://www.alsedu.com/about.html#qualifications" target="_blank">资质荣誉</a></p>
                <p><a href="http://www.alsedu.com/about.html#development" target="_blank">发展历程</a></p>
                <p><a href="http://www.alsedu.com/about.html#contact" target="_blank">联系我们</a></p>
              </li>
              <li>
                <p class="bottomTitle">关注奥松</p>
                <p><a href="https://www.alsrobot.xin/news/news/newsList" target="_blank">官方新闻</a></p>
                <p><a href="http://www.alsedu.com/media.html" target="_blank">媒体合作</a></p>
                <p><a href="http://www.alsedu.com/business.html" target="_blank">商务合作</a></p>
                <p><a href="http://job.alsrobot.cn/" target="_blank">人才招聘</a></p>
              </li>
              <li>
                <p class="bottomTitle">优质资源</p>
                <p><a href="http://www.supermaker.tv/" target="_blank">秀创客</a></p>
                <p><a href="http://www.alsrobot.cn/wiki/" target="_blank">资料百科</a></p>
                <p><a href="http://www.makerspace.cn/forum.php" target="_blank">社区论坛</a></p>
              </li>
              <li>
                <p class="bottomTitle">产品购买</p>
                <p><a href="http://www.alsrobot.cn" target="_blank">奥松商城</a></p>
                <p><a href="https://robotbase.tmall.com/" target="_blank">天猫旗舰店</a></p>
                <p><a href="https://alsrobot.jd.com/" target="_blank">京东旗舰店</a></p>
                <p><a href="https://robotbase.taobao.com/" target="_blank">淘宝旗舰店</a></p>
              </li>
              <li>
                <p class="bottomTitle">服务协议</p>
                <p @click="onClickGoToUrl(1)" class="state-text" style="margin-top:6px">用户协议</p>
                <p @click="onClickGoToUrl(2)" class="state-text">隐私协议</p>
                <p @click="onClickGoToUrl(3)" class="state-text">免责声明</p>
              </li>
            </ul>
          </div>
          <div class="bottomRight">
            <p class="bottomTitle">订阅我们</p>
            <div class="readBox">
              <input type="text" placeholder="输入您的邮箱">
              <a href="">立即订阅</a>
            </div>
            <p class="bottomTitle">关注我们</p>
            <div style="width: 320px;height: 100px">
              <div style="float: left;cursor: pointer">
                <el-popover
                  placement="top"
                  width="150"
                  trigger="hover">
                  <div>
                    <img src="../../../static/images/base/newestIndex/ewm.png" alt="" style="width: 150px">
                  </div>
                  <img src="../../../static/images/base/newestIndex/wx.png" slot="reference" alt=""
                       style="display: block;">
                </el-popover>
              </div>
              <div style="float: left;margin-left: 8px">
                <el-popover
                  placement="top"
                  width="150"
                  trigger="hover">
                  <div>
                    <img src="../../../static/images/base/newestIndex/ewb.png" alt="" style="width: 150px">
                  </div>
                  <img src="../../../static/images/base/newestIndex/wb.png" slot="reference" alt=""
                       style="display: block;">
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyrightnformationBox">
      <div class="containerRef">
        <div class="copyrightnformation">
          <el-link :underline="false" href="http://www.beian.miit.gov.cn" target="_blank" style="color:#fff">
            奥松智能 ｜ 粤ICP备19107383号-1
          </el-link>
          <div class="international">
            <img src="../../../static/images/base/newestIndex/international.png" alt="">
            <div style="margin-top:-3px;display: inline;float: left;font-size: 14px;color: #cde0fe">
              <select name="" id="internationChange" style="border: none;background: none;outline: none;color: #fff">
                <option value="zh">简体中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="stateDialogVisible" width="600px" center>
      <div>
        <div style="font-size:20px;color:#3d3d3d;line-height:28px;text-align:center;margin-bottom:30px;font-weight:bold;margin-top:20px">版权与免责声明</div>
        <div style="font-size:16px;color:#3d3d3d;line-height:25px;margin-bottom:25px;margin-left: 60px;margin-right:60px">
          本网站发布的所有作品， 均为深圳奥松智能科技股份有限公司原创或获得正版授权刊载的作品， 未经本公司授权不得转载、摘编或利用其它方式使用上述作品。 已经本公司授权使用作品的，应在授权范围内使用， 并注明“来源： 奥松云课堂”。违反上述声明者， 本公司将追究其相关法律责任。
        </div>
        <div style="font-size:16px;color:#3d3d3d;line-height:25px;margin-bottom:25px;margin-left: 60px;margin-right:60px">
          本公司在制作上述作品时，采用了部分来源网络的内容， 该部分内容并未标明出处导致原作者不详， 因而本公司未能获取相应的授权。 本公司非常重视知识产权问题， 尊重原作者的智力成果，如果本司的上述作品使用了您的版权内容， 请您及时与本公司联系，本公司将立即与您协商解决版权相关事宜。
        </div>
        <div style="font-size:16px;color:#3d3d3d;line-height:25px;margin-bottom:25px;margin-left: 60px;margin-right:60px">
          邮箱：robotbase@alsrobot.com
        </div>
        <div style="font-size:16px;color:#3d3d3d;line-height:25px;margin-bottom:25px;margin-left: 60px;margin-right:60px;text-align:right">
          <div>深圳奥松智能科技股份有限公司</div>
          <div>2019年10月</div>
        </div>
        <div style="height:50px"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "alsFooter",
    data(){
      return{
        stateDialogVisible:false
      }
    },
    methods:{
      onClickGoToUrl(index){
        if(index==1){
          window.open('https://www.alsrobot.vip/admin.php/index/web/user_agreement')
        }else if(index==2){
          window.open('https://www.alsrobot.vip/admin.php/index/web/user_privacy')
        }else if(index==3){
          this.stateDialogVisible = true
        }
      }
    }
  }
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
  .containerRef {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
  }
  /*bottom*/
  .bottomBox {
    width: 100%;
    height: 330px;
    background-color: #475b7b;
  }

  .bottom {
    width: 100%;
    height: 196px;
    margin-top: 70px;
  }

  .bottomLeft {
    width: 837px;
    height: 100%;
    float: left;
  }

  .bottomLeft ul {
    overflow: hidden;
    width: 100%;

  }

  .bottomLeft ul li {
    float: left;
    width: 20%;
  }

  .bottomTitle {
    font-size: 16px;
    color: #cde0fe;
    line-height: 40px;
  }

  .bottomLeft ul li a {
    font-size: 14px;
    color: #c0d8ff;
    display: block;
    line-height: 30px;

  }

  .bottomLeft ul li a:hover {
    cursor: pointer;
    font-size: 14px;
    color: #fff;
  }

  .bottomRight {
    width: 320px;
    height: 100%;
    float: right;
  }

  .readBox {
    width: 320px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background-color: #566E93;
    margin-bottom: 35px;
    border-radius: 15px;
  }

  .readBox input {
    width: 190px;
    margin: 0 15px 0 15px;
    background: none;
    border: none;
    outline: none;
    color: #acc3e8;
  }

  .readBox input::-webkit-input-placeholder {
    color: #acc3e8;
    outline: none;
    border: none;
  }

  .readBox a {
    float: right;
    width: 100px;
    height: 30px;
    line-height: 30px;
    background: #0088FF;
    text-align: center;
    color: #fff;
    border-radius: 15px;
  }
  .copyrightnformationBox {
    width: 100%;
    height: 215px;
    background-color: #475b7b;
    margin-top: 1px;
  }

  .copyrightnformation {
    margin-top: 30px;
  }

  .copyrightnformation span {
    float: left;
    font-size: 14px;
    color: #cde0fe;
  }

  .international {
    float: right;
    width: 120px;
  }

  .international img {
    float: left;
  }

  .wx {

  }

  .wx a:hover {

  }
  .state-text{
    color:#cde0fe;
    font-size:14px;
    margin-top:8px;
  }
  .state-text:hover{
    cursor:pointer;
    color: #fff;
  }
  .selectOption {
    border: none !important;
    background-color: transparent !important;
    background: none !important;
  }
</style>
