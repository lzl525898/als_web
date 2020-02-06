<template>
    <div style="border:1px solid #EBEEF5;border-radius:5px;padding:10px 20px;display:flex;align-items:center;margin-bottom:10px">
      <div class="image-wrapper">
        <img src="https://www.alsrobot.vip/als_classroom/public/zh/images/default-res.jpg" class="image"/>
      </div>
      <div style="display:flex;flex-direction:column">
        <div style="height:40px;">
          <el-tooltip class="item" effect="dark" :content="educationName" placement="top">
          <div style="width:600px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:bold">课程名称 ：{{educationName}}</div>
          </el-tooltip>
        </div>
        <div style="display:flex;align-items:center">
          <el-avatar size="medium" :src="teacherAvatar"></el-avatar>
          <div style="font-size:12px;margin-left:10px;margin-right:30px">
            <div><i class="el-icon-user-solid" style="color:#409EFF;"/> {{teacherName}}</div>
            <div style="padding-top:5px"><i class="el-icon-phone" style="color:#409EFF;"/> {{teacherPhone}}</div>
          </div>
          <div style="font-size:12px;margin-top:-18px;margin-left:20px">教室ID <el-tag style="cursor:pointer" effect="dark" size="small" @click.native="handleClickCopy(room)">{{room}}</el-tag></div>
          <div style="font-size:12px;margin-top:-18px;margin-left:20px">参加码
            <el-tag style="cursor:pointer" effect="dark" size="small" @click.native="handleClickCopy(code)">{{code}}</el-tag>
            <el-tooltip class="item" effect="dark" placement="right">
              <div slot="content">
                复制【参加码】后，通过本地客户端<br/>进入直播课，唤起本地<el-link :underline="false" @click="handleHandleClient"><span style="color:#409EFF">【客户端】</span></el-link>
              </div>
              <el-icon class="el-icon-question" style="color:#c3c3c3"/>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;align-items:center;flex:1">
        <el-button type="primary" @click="showDialog">进入教室</el-button>
      </div>
    </div>
</template>

<script>
    import storageUtil from "../../../../utils/storageUtil";
    import promptUtil from "../../../../utils/promptUtil";
    export default {
        name: "onlineEducationItem",
        props:{
            room: {
                type:String,
                default: '',
            },
            sign: {
                type:String,
                default: '',
            },
            code: {
                type:String,
                default: '',
            },
            webUrl: {
                type:String,
                default: '',
            },
            teacher: {
                type:String,
                default: '',
            },
            phone: {
                type:String,
                default: '',
            },
            avatar: {
                type:String,
                default: '',
            },
            name: {
                type:String,
                default: '',
            },
        },
        data(){
            return {
                educationName: '',
                teacherAvatar: '',
                teacherName:'',
                teacherPhone:'',
            }
        },
        mounted() {
            this.educationName = this.name
            this.teacherAvatar = this.avatar
            this.teacherName = this.teacher
            this.teacherPhone = this.phone
        },
        methods: {
            handleHandleClient(){
                window.location.href = "baijiacloud://"
            },
            handleClickCopy(text){
                let textarea = document.createElement("input");//创建input对象
                document.body.appendChild(textarea);//添加元素
                textarea.value = text;
                textarea.focus();
                if(textarea.setSelectionRange)
                    textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
                else
                    textarea.select();
                try {
                    document.execCommand("copy");//执行复制
                    promptUtil.success(this,'成功复制到剪切板')
                } catch(e) {}finally {
                    document.body.removeChild(textarea);//删除元素
                }
            },
            genClientUrl(){
                const params = {
                    room_id:1234567890,
                    user_number:storageUtil.readTeacherInfo().id,
                    user_role:0,  // 0:学生 1:老师 2:管理员
                    user_name:storageUtil.readTeacherInfo().real_name,
                    user_avatar:storageUtil.readTeacherInfo().avatar,
                    sign:this.sign
                }
                const web_url = "http://b62335672.at.baijiayun.com/web/room/enter?room_id="
                    +params.room_id+"&user_number="+params.user_number+"&user_name="+encodeURI(params.user_name)
                    +"&user_role="+params.user_role+"&user_avatar="+encodeURI(params.user_avatar)+"&sign="+params.sign
                let url = 'bjylive://token=token&ts=ts&urlpath='+encodeURIComponent(web_url)
                console.log(url)
                return url
            },
            showDialog(){
                this.$emit('statusFunc',{status:true,webUrl:this.webUrl,clientUrl:this.genClientUrl()})
            }
        }
    }
</script>

<style scoped>
  .image-wrapper{
    position: relative;
    cursor: pointer;
    margin-right: 20px;
  }
  .image{
    width: 150px;
    height: 120px;
    border-radius: 5px;
    object-fit: cover;
    transition: all 0.2s ease-out 0.1s;
  }
  .image:hover{
    transform: scale(1.05)
  }
</style>
