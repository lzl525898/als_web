<template>
  <div class="Date">
    <p class="date">{{h}}</p>
    <p>:</p>
    <p class="date">{{m}}</p>
    <p>:</p>
    <p class="date">{{s}}</p>
  </div>
</template>

<script>
  import PubSub from "pubsub-js"
  export default {
    props:{
      offsetTime: {
        default: 0,
      }
    },
    name: "timeDown",
    data() {
      return {
        pause:false,
        leftTime: '',
        d: '',
        h: '',
        m: '',
        s: '',
      }
    },
    methods: {
      getUnusedTime(){ // 获取剩余时间
        return this.leftTime
      },
      _start(offsetTime){
        this.leftTime = offsetTime + 1000
        this.pause = false
        this.countTime()
      },
      _pause(){
        this.pause = true
      },
      reset(){
        this.leftTime = ""
      },
      countTime() {
        //时间差
        if(this.leftTime!=''){
          this.leftTime = this.leftTime - 1000
        }
        //定义变量 d,h,m,s保存倒计时的时间
        if (this.leftTime >= 0) {
          this.d = Math.floor(this.leftTime / 1000 / 60 / 60 / 24)//天数我没用到，暂且写上
          this.h = (Math.floor((this.leftTime / 1000 / 60 / 60) % 24))/10 >= 1 ? Math.floor((this.leftTime / 1000 / 60 / 60) % 24) : '0' + Math.floor((this.leftTime / 1000 / 60 / 60) % 24)
          this.m = (Math.floor((this.leftTime / 1000 / 60) % 60))/10 >= 1 ? Math.floor((this.leftTime / 1000 / 60) % 60) : '0' + Math.floor((this.leftTime / 1000 / 60) % 60)
          this.s = (Math.floor((this.leftTime / 1000) % 60))/10 >= 1 ? Math.floor((this.leftTime / 1000) % 60) : '0'+ Math.floor((this.leftTime / 1000) % 60)
          //递归每秒调用countTime方法，显示动态时间效果
          if(this.leftTime!=0){
            if(!this.pause){ // 暂停操作
              setTimeout(this.countTime, 1000)
            }
          }else{
            if(this.leftTime==0){// 手动提交时执行
              setTimeout(()=>{
                PubSub.publish("markingScore", "ok")
              },200)
            }
          }
        }else{ // 到时后自动提交
          PubSub.publish("markingScore", "ok")
        }
      },
    },
  }
</script>

<style scoped>
  .Date{
    align-items: center;
    justify-content: center;
    margin-top: -10px;
    display: flex;
    font-size: 18px;
    color: #F00;
    font-weight: 600;
  }
</style>
