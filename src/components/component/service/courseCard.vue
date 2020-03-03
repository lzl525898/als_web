<template>
    <el-card body-style="width:100%;min-width:300px;padding:0;" class="course-card-wrapper" :id="'course_card_item_'+ detail.id">
      <div @click="handleClickSelect">
        <div class="selected-tool-content">
          <img class="course-card-wrapper-cover" :src="detail.imgUrl"/>
          <div class="course-card-wrapper-content">
            <div class="course-title-nowrap course-title-first">{{detail.firstName}}</div>
            <div class="course-title-nowrap course-title-second">{{detail.secondName}}</div>
            <div class="course-card-price">
              <span class="course-card-price-symbol">￥</span>
              <span class="course-card-price-value price-value-base">{{detail.price}}</span>
              <span class="course-card-price-unit">/年</span>
              <div class="card-item-select" v-if="detail.type==0">
<!--                <el-tag effect="plain" class="card-item-select-tag" >详情</el-tag>-->
                <el-button plain type="primary" size="mini" @click="handleClickDetail" class="card-item-select-tag">详情</el-button>
              </div>
              <div class="card-item-select" v-else><el-tag effect="plain" class="card-item-select-tag">续订</el-tag></div>
            </div>
          </div>
        </div>
        <div v-if="detail.type==0" class="course-bottom">课程待开通</div>
        <div v-else class="course-bottom">有效期至：<span style="margin-left: 5px">{{detail.time}}</span></div>
      </div>
    </el-card>
</template>

<script>
    import $ from 'jquery'
    const WIDTH_OFFSET = 120 + 80
    export default {
        props: {
          detail: {
              type: Object,
              default: function(){return {}}
          },
          deleteItem: {
              type: Number,
              default: 0
          },
          selectItem: {
              type: Number,
              default: 0
          }
        },
        name: "courseCard",
        data() {
            return {
                titleWidth: 0,
                select: false,
            }
        },
        watch: {
            selectItem(val){
                if(val==this.detail.id){
                    let id = '#course_card_item_' + this.detail.id
                    $(id).addClass('course-card-wrapper-select').addClass('selected-tool-item')
                }
            },
            deleteItem(val){
                if(val==this.detail.id){
                    let id = '#course_card_item_' + this.detail.id
                    this.select = !this.select
                    if(this.select){
                        $(id).addClass('course-card-wrapper-select').addClass('selected-tool-item')
                    }else{
                        $(id).removeClass('selected-tool-item').removeClass('course-card-wrapper-select')
                    }
                }
            }
        },
        created() {
            window.onresize = ()=>{
                this.watchWidth()
            }
        },
        mounted() {
           this.watchWidth()
        },
        methods: {
            watchWidth(){
                this.titleWidth = $('.course-card-wrapper').width() - WIDTH_OFFSET
                $('.course-title-nowrap').width(this.titleWidth)
            },
            handleClickSelect(){
                let id = '#course_card_item_' + this.detail.id
                this.select = !this.select
                if(this.select){
                    $(id).addClass('course-card-wrapper-select').addClass('selected-tool-item')
                }else{
                    $(id).removeClass('selected-tool-item').removeClass('course-card-wrapper-select')
                }
                this.$emit('handleCheck',{status:this.select, price: this.detail.price*1, detail: this.detail})
            },
            handleClickDetail(){
                if(this.select){
                    this.handleClickSelect() // 清空上一次
                }
                this.$emit('handleDetail', this.detail)
            }
        }
    }
</script>

<style scoped>
  .course-card-wrapper{
    margin-right:30px;
    cursor: pointer;
  }
  .course-card-wrapper-select{
    border:1px solid #2878F0;
  }
  .course-card-wrapper-cover{
    width: 120px;
    height: 80px;
    border-radius:5px;
  }
  .course-card-wrapper-content{
    padding-left: 5px;
    position: relative;
  }
  .course-card-price{
    color: #FB6161;
    display: flex;
    align-items: baseline;
  }
  .course-card-price-symbol{
    font-size: 18px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
  }
  .course-card-price-unit{
    font-weight: 600;
    font-family: PingFangSC-Regular;
  }
  .course-card-price-value{
    display: inline-block;
    font-size: 18px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
  }
  .course-title-nowrap{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .course-title-first{
    line-height: 26px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
  }
  .course-title-second{
    line-height: 26px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #3e3e3e;
  }
  .course-bottom{
    height: 25px;
    font-size: 14px;
    color: #888;
    line-height: 25px;
    background: #eef5ff;
    padding-left:20px;
  }
  .selected-tool-content{
    display:flex;
    padding:10px 20px 10px 20px;
    position: relative;
  }
  .selected-tool-item:before{
    position: absolute;
    top: 2px;
    right: 9px;
    content: '';
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(50deg);
    z-index: 99;
    width: 7px;
    height: 14px;
    border-width: 0 1px 1px 0;
    border-color: #ffffff;
    border-style: solid;
  }
  .selected-tool-item{
    position: relative;
  }
  .selected-tool-item:after{
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    content: '';
    border: 22px solid;
    border-color: #2878F0 #2878F0 transparent transparent;
  }
  .card-item-select{
    display:flex;
    justify-content:flex-end;
    flex:1;
    margin-right:-30px;
  }
  .card-item-select-tag{
    width:60px;
    text-align:center;
  }
</style>
