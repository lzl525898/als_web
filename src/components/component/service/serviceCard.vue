<template>
    <div>
      <div class="order-record-wrapper">
        <span style="cursor: pointer;" @click="handleClickIntoRecord">订购记录</span>
      </div>
      <div class="service-card-container">
        <div class="service-card-wrapper" v-for="(item,index) in content" :key="index">
          <el-card body-style="padding:0;margin:0;height:450px" shadow="always">
            <div v-if="index%3==0" class="service-card-title base-color">{{item.title}}</div>
            <div v-if="index%3==1" class="service-card-title professional-color">{{item.title}}</div>
            <div v-if="index%3==2" class="service-card-title ultimate-color">{{item.title}}</div>
            <div class="service-card-intro">
              {{item.intro}}
            </div>
            <div class="service-card-summary">
              {{item.summary}}
            </div>
            <div v-if="index%3==0" class="service-card-button service-card-button-base" @click="handleClickIntoCourse">{{btnLabel}}</div>
            <div v-if="index%3==1" class="service-card-button service-card-button-professional" @click="handleClickIntoCourse">{{btnLabel}}</div>
            <div v-if="index%3==2" class="service-card-button service-card-button-ultimate" @click="handleClickIntoCourse">{{btnLabel}}</div>
          </el-card>
        </div>
      </div>
    </div>
</template>

<script>
    import '../../../router/router'
    export default {
        name: "serviceCard",
        props: {
            content:{
                type: Array,
                default: function(){
                    return []
                }
            }
        },
        data(){
            return {
                btnLabel: '开通课程包',
            }
        },
        methods: {
            handleClickIntoCourse(){
                this.$message({
                    center: true,
                    message: '近期开放，敬请期待...',
                    type: 'warning'
                });
                // this.$router.push({path:ROUTER_COURSE_BUY})
            },
            handleClickIntoRecord(){
                this.$router.push({path:ROUTER_SERVICE_RECORD})
            }
        }
    }
</script>

<style scoped>
  .order-record-wrapper{
    line-height: 30px;
    font-size: 16px;
    color: #353535;
    padding: 0 24px;
    margin-bottom: 20px;
    text-align: right;
    color: #40a9ff;
  }
  .service-card-container{
    padding-left: 120px;
    padding-right: 40px;
    display: flex;
    justify-content: space-between;
  }
  .service-card-wrapper{
    min-width: 240px;
    flex:1;
    border-radius: 5px;
    margin-right: 80px;
  }
  .service-card-title{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 84px;
    font-size: 28px;
    font-weight: bold;
    color: #fff;
  }
  .base-color{
    background: -webkit-gradient(linear, left top, right top, from(#40a9ff), to(#105cfb));
    background: -webkit-linear-gradient(left, #40a9ff 0%, #105cfb 100%);
    background: -o-linear-gradient(left, #40a9ff 0%, #105cfb 100%);
    background: linear-gradient(90deg, #40a9ff 0%, #105cfb 100%);
    -webkit-box-shadow: 0px 6px 12px 0px rgba(43, 101, 99, 0.08);
    box-shadow: 0px 6px 12px 0px rgba(43, 101, 99, 0.08);
  }
  .professional-color{
    background: -webkit-gradient(linear, left top, right top, from(#31e0d0), to(#2d6bf4));
    background: -webkit-linear-gradient(left, #31e0d0 0%, #2d6bf4 100%);
    background: -o-linear-gradient(left, #31e0d0 0%, #2d6bf4 100%);
    background: linear-gradient(90deg, #31e0d0 0%, #2d6bf4 100%);
    -webkit-box-shadow: 0px 6px 12px 0px rgba(43, 101, 99, 0.08);
    box-shadow: 0px 6px 12px 0px rgba(43, 101, 99, 0.08);
  }
  .ultimate-color{
    background: -webkit-gradient(linear, left top, right top, from(#ddb799), to(#b78463));
    background: -webkit-linear-gradient(left, #ddb799 0%, #b78463 100%);
    background: -o-linear-gradient(left, #ddb799 0%, #b78463 100%);
    background: linear-gradient(90deg, #ddb799 0%, #b78463 100%);
    -webkit-box-shadow: 0px 6px 12px 0px rgba(122, 93, 70, 0.08);
    box-shadow: 0px 6px 12px 0px rgba(122, 93, 70, 0.08);
  }
  .service-card-intro{
    width: 180px;
    line-height: 20px;
    font-size: 14px;
    color: #333333;
    font-weight: 400;
    box-sizing: border-box;
    text-align: center;
    height: 60px;
    margin: 40px auto 12px;
  }
  .service-card-summary{
    height: 130px;
    width: 180px;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #999;
    line-height: 24px;
  }
  .service-card-price{
    display: flex;
    justify-content: center;
    align-items: baseline;
    height: 56px;
    line-height: 56px;
    margin-top: 44px;
  }
  .service-card-price-symbol{
    width: 20px;
    height: 28px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 28px;
  }
  .service-card-price-unit{
    font-size: 16px;
    font-weight: 600;
    font-family: PingFangSC-Regular;
    color: #333333;
  }
  .service-card-price-value{
    display: inline-block;
    font-size: 40px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
  }
  .price-value-base{
    color:#3da4ff;
  }
  .price-value-professional{
    color:#2d74f1;
  }
  .price-value-ultimate{
    color:#b98666;
  }
  .service-card-button{
    width: 160px;
    height: 48px;
    line-height: 48px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    margin: 36px auto 0;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    font-family: PingFangSC-Regular;
    background-color: #fff;
    text-align: center;
  }
  .service-card-button-base{
    color: #2878f0;
    border: 1px solid #2878f0;
    cursor: pointer;
  }
  .service-card-button-base:hover{
    border: none;
    color: #fff;
    font-weight: 600;
    background: -webkit-gradient(linear, left top, right top, from(#40a9ff), to(#105cfb));
    background: -webkit-linear-gradient(left, #40a9ff 0%, #105cfb 100%);
    background: -o-linear-gradient(left, #40a9ff 0%, #105cfb 100%);
    background: linear-gradient(90deg, #40a9ff 0%, #105cfb 100%);
  }
  .service-card-button-professional{
    color: #0bbeae;
    border: 1px solid #0bbeae;
    cursor: pointer;
  }
  .service-card-button-professional:hover{
    border: none;
    color: #fff;
    font-weight: 600;
    background: -webkit-gradient(linear, left top, right top, from(#31e0d0), to(#2d6bf4));
    background: -webkit-linear-gradient(left, #31e0d0 0%, #2d6bf4 100%);
    background: -o-linear-gradient(left, #31e0d0 0%, #2d6bf4 100%);
    background: linear-gradient(90deg, #31e0d0 0%, #2d6bf4 100%);
  }
  .service-card-button-ultimate{
    color: #b78463;
    border: 1px solid #b78463;
    cursor: pointer;
  }
  .service-card-button-ultimate:hover{
    border: none;
    color: #fff;
    font-weight: 600;
    background: -webkit-gradient(linear, left top, right top, from(#ddb799), to(#b78463));
    background: -webkit-linear-gradient(left, #ddb799 0%, #b78463 100%);
    background: -o-linear-gradient(left, #ddb799 0%, #b78463 100%);
    background: linear-gradient(90deg, #ddb799 0%, #b78463 100%);
  }
</style>
