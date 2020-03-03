<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="660px"
    destroy-on-close
    >
    <div slot="title" class="dialog-header">课程详情</div>
    <div>
      <div class="flex-row-wrapper" style="margin-top: -20px;border-top: 1px solid #EBEEF5;padding-top: 20px">
        <img class="course-cover" :src="detail.imgUrl"/>
        <div class="flex-column-wrapper">
          <el-tooltip class="item" effect="dark" :content="detail.firstName" placement="right-start">
            <div class="title-content title-first">{{detail.firstName}}</div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="detail.secondName" placement="right-start">
            <div class="title-content title-second">{{detail.secondName}}</div>
          </el-tooltip>
          <div class="course-price">
            ￥{{detail.price}}/年
          </div>
          <div class="flex-row-wrapper">
            <div class="base-btn btn-buy" @click="handleClick">立即开通</div>
            <el-popover
              placement="bottom"
              width="150"
              trigger="hover">
              <div>
                <img :src='detail.callUs.img' alt="" style="width: 150px">
                <p style="text-align: center">{{detail.callUs.tel}} </p>
              </div>
              <div slot="reference" class="base-btn btn-advice" style="margin-left:15px"><i class="el-icon-service"/><span style="margin-left: 5px">咨询</span></div>
            </el-popover>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px">
        <div class="detail-item" style="align-items:baseline">
          <div class="detail-item-label">课程简介:</div>
          <div class="detail-item-value">{{detail.desc}}</div>
        </div>
        <div class="detail-item" style="align-items:baseline">
          <div class="detail-item-label">所需教具:</div>
          <div class="detail-item-value">{{detail.training}}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">难度等级:</div>
          <div class="detail-item-value">{{detail.level}}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">学龄段:</div>
          <div class="detail-item-value">{{detail.ageStage}}</div>
        </div>
        <div class="detail-item">
          <div class="detail-item-label">课时:</div>
          <div class="detail-item-value">{{detail.classes}}课时</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "courseDetailDialog",
        data(){
            return{
                dialogVisible: false,
                detail: {callUs:{img:'',tel:''}}
            }
        },
        methods: {
            show(detail){
                this.detail = detail
                this.dialogVisible = true
            },
            handleClick(){
                this.$emit('targetCourse', {status:true, price: this.detail.price*1, detail: this.detail})
                this.dialogVisible = false
            }
        }
    }
</script>

<style scoped>
  .dialog-header{
    width: 430px;
    font-size: 20px;
    font-weight: bold;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .flex-row-wrapper{
    display: flex;
    flex-direction: row;
  }
  .flex-column-wrapper{
    flex:1;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
  }
  .title-content{
    width: 275px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title-first{
    margin-top: 10px;
    font-size: 22px;
    color:#333;
    margin-bottom: 20px;
  }
  .title-second{
    color:#999;
    margin-bottom: 20px;
  }
  .course-price{
    background-color:#dadada;
    border-radius: 3px;
    padding-left: 5px;
    font-size: 22px;
    color: #FB6161;
    height: 40px;
    line-height: 40px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .course-cover{
    width: 330px;
    height: 220px;
    border-radius:5px;
  }
  .base-btn{
    width: 130px;
    height: 44px;
    border: 1px solid #23b8ff;
    border-radius: 5px;
    line-height: 46px;
    font-size: 18px;
    text-align: center;
    vertical-align: middle;
  }
  .btn-buy{
    background-color: #23b8ff;
    color: #fff;
    cursor: pointer;
  }
  .btn-buy:hover{
    color: #fff;
    background-color: #31A4FA;
  }
  .btn-advice{
    display: flex;
    align-items: center;
    justify-content: center;
    color: #23b8ff;
    cursor: pointer;
  }
  .detail-item{
    color:#333;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .detail-item-label{
    width:72px;
    color: #999;
  }
  .detail-item-value{
    width:530px;
    padding-left:10px;
  }
</style>
