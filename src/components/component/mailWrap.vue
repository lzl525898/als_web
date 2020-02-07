<template>
    <div class="mail-wrapper" @click="handleClickDetail">
      <div class="mail-header-wrapper">
        <div v-if="!isRead" class="mail-flag"></div>
        <div class="mail-header-title-content">{{title}}</div>
        <div class="mail-header-title-time">{{time}}</div>
      </div>
      <div class="mail-main-wrapper">
        <div v-html="content"></div>
      </div>
    </div>
</template>

<script>
    import {
        qs,
        remindStatus
    } from '../../api/api'
    import '../../api/restfulapi'
    import promptUtil from "../../utils/promptUtil";
    import storageUtil from "../../utils/storageUtil";
    export default {
        name: "mailWrap",
        props: {
            id: {
                type: Number
            },
            status: {
                type: Number
            },
            title: {
                type:String,
            },
            content: {
                type:String,
            },
            time: {
                type:String,
            }
        },
        data(){
            return{
                isRead: true,  // true 已读 false未读
            }
        },
        mounted() {
            this.isRead = this.status*1===1 ? true : false
        },
        methods: {
            handleClickDetail(){
                if(!this.isRead){
                    remindStatus(qs.stringify({
                        notice_id: this.id,
                        user_id: storageUtil.readTeacherInfo().id
                    })).then(res=>{
                        this.isRead = true
                        let count = this.$store.state.mailCount
                        if(count>0){
                            count = count-1
                        }
                        this.$store.dispatch('setMailCount',count)
                        this.$emit('read',{id:this.id,status:1})
                    }).catch(err=>promptUtil.LOG('remindStatus-ERR',err))
                }
                this.$emit('detail',{title:this.title,content:this.content})
            }
        }
    }
</script>

<style scoped>
  .mail-wrapper{
    border-bottom: 1px solid #ebeef5;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .mail-wrapper:hover{
    background-color: rgba(64,158,255,0.1);
  }
  .mail-flag {
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
    background-color: #F56C6C;
    position: absolute;
  }
  .mail-header-wrapper{
    height: 24px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .mail-header-title-content{
    font-size: 18px;
    color: #999999;
    line-height: 24px;
    margin-left: 8px;
    margin-right: 30px;
    font-weight: 500;
  }
  .mail-header-title-content:hover{
    cursor: pointer;
    color: #409EFF;
  }
  .mail-header-title-time{
    font-size: 14px;
    color: #999;
  }
  .mail-main-wrapper{
    margin-top: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    height: 60px;
    overflow: hidden;
    font-size: 14px;
    color: #666;
    line-height: 20px;
    word-break: break-all;
  }
</style>
