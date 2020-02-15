<template>
  <div style="width:232px;margin-bottom:10px;">
    <el-card shadow="always" :body-style="{ padding: '0px', width: '232px', height: '288px'}">
      <div class="scale-works-wrapper" @click="onClickImage">
        <img class="scale-works-image base-img" :src="data.imgUrl">
      </div>
      <el-tooltip class="item" effect="dark" :content="data.content" placement="top">
        <div class="works-desc">{{data.content}}</div>
      </el-tooltip>
      <div class="works-update">更新时间 : {{data.updateTime}}</div>
      <div style="border:none;height:1px;margin-top:5px;background-color:#cccccc"></div>
      <div style="display:flex;justify-content:center;align-items:center;">
        <div v-if="data.is_submit!=1" class="works-item-button" @click="onClickWorksPublish"><i class="el-icon-position"></i><span style="margin-left:5px">发布</span></div>
        <div v-else class="works-item-button"><i class="el-icon-share"></i><span style="margin-left:5px">
          <el-dropdown>
            <span>分享</span>
            <el-dropdown-menu slot="dropdown">
              <div style="width:160px;height: 176px;display:flex;flex-direction:column;justify-content: center;align-items: center;padding:5px 5px 0 5px">
                <vue-qr
                  :text="data.shareUrl"
                  :logoSrc="require('../../../../static/images/base/logo.jpg')"
                  colorDark="#000"
                  colorLight="#fff"
                  :margin="0"
                  :logoScale="0.4"
                  :size="150"
                ></vue-qr>
                <div style="display:flex;align-items:flex-end;font-size:12px;justify-content:center;flex:1;height:16px;color:#3e3e3e">手机扫一扫</div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>

        </span></div>
        <div class="works-item-button" @click="onClickEdit"><i class="el-icon-edit"></i><span style="margin-left:5px">编辑</span></div>
        <div class="works-item-button" @click="onClickDelete"><i class="el-icon-delete"></i><span style="margin-left:5px">删除</span></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import vueQr from "vue-qr";
  import '../../../api/restfulapi'
  import PubSub from 'pubsub-js'
  import storageUtil from "../../../utils/storageUtil";
  export default {
    components: {vueQr},
    name: "worksItem",
    props:{
      data:{
        type:Object,
        default: function (){
          return{
            content:'',
            imgUrl:'',
            is_submit:'',
            updateTime:'',
            worksId:'',
            worksUrl:''
          }
        }
      },
    },
    data(){
      return{
        worksId:0,
      }
    },
    methods:{
      onClickEdit(){
          const roleId = storageUtil.readTeacherInfo().role_id
          let {href} = this.$router.resolve({path: '/create?user_id='+this.data.student_id+'&id='+this.data.worksId+'&type=1&role='+roleId+'&device=1'})
          window.open(href, '_blank')
      },
      onClickImage(){
        if(this.data.is_submit==1){
          this.onClickEdit()
        }else{
          this.onClickWorksPublish()
        }
      },
      onClickWorksPublish(){
        PubSub.publish("showWorksPublishDialog", {id:this.data.worksId,name:this.data.content})
      },
      onClickDelete(){
        this.$confirm('此操作将永久删除该作品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          PubSub.publish("deleteScratchWorkById", {id:this.data.worksId})
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(err=>console.log('取消删除操作'));
      }
    }
  }
</script>

<style scoped>
  .scale-works-wrapper{
    border:none;
    overflow: hidden;
    width: 232px;
    height: 185px;
  }
  .base-img{
    object-fit: scale-down;
  }
  .scale-works-image{
    width: 232px;
    height: 185px;
    transition: width 1s, height 1s;
    -moz-transition: width 1s, height 1s, -moz-transform 1s; /* Firefox 4 */
    -webkit-transition: width 1s, height 1s, -webkit-transform 1s; /* Safari and Chrome */
    -o-transition: width 1s, height 1s, -o-transform 1s; /* Opera */
  }
  .scale-works-image:hover{
    transform: scale(1.1);
    -webkit-transform: scale(1.1); /*兼容-webkit-引擎浏览器*/
    -moz-transform: scale(1.1); /*兼容-moz-引擎浏览器*/
    cursor: pointer;
  }
  .works-desc{
    margin-top: 5px;
    width: 210px;
    padding:5px 10px 5px 9px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
  .works-update{
    margin-left: 10px;
    margin-top: 5px;
    font-size: 13px;
    color: #999;
  }
  .works-item-button{
    display:flex;
    justify-content:center;
    align-items:center;
    flex:1;
    height:44px;
    color:#999;
    font-size:12px;
  }
  .works-item-button:hover{
    cursor: pointer;
    color:#047FD8;
  }
</style>
