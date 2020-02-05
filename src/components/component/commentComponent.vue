<template>
  <div>
    <vue-ueditor-wrap v-model="comment" :config="editConfig" :destroy="true" ref="vueUeditorWrap"></vue-ueditor-wrap>
    <div style="display:flex;justify-content:flex-end;margin:20px 0 -5px 0"><el-button type="primary" plain @click="onClickAddComment" :loading="isCommentLoading" :disabled="commentDisabled">留 言</el-button></div>
    <div>
      <div v-for="(comm,index) in commentData" :key="index">
        <el-divider></el-divider>
        <div style="display:flex;">
          <div style="width: 80px;margin-left:10px;">
            <el-avatar :src="comm.userAvatar" :size="60"></el-avatar>
          </div>
          <div style="flex:1">
            <div>
              <span style="font-size:14px;color:#333;margin-right: 12px;">{{comm.userName}}<span v-show="comm.isAuthor==1" style="color:#999">（作者）</span></span><span style="font-size:12px;color:#999">{{comm.date}}</span>
            </div>
            <div v-html="comm.content" style="margin-top:10px;margin-bottom:10px"></div>
            <div style="display:flex;align-items:baseline">
              <div class="works-handle-item" @click="onClickPraise(comm)">
                <img :src="comm.praise==1? praiseOk :praiseNo" style="width: 14px;height:14px;"/>
                <span>{{comm.praiseCount>999 ? '999+' : comm.praiseCount}}</span>
              </div>
              <div class="works-handle-item" @click="onClickIsShowReply(comm)">
                <i class="el-icon-chat-line-round"></i>
                <span>回复</span>
              </div>
              <div class="works-handle-item">
                <el-dropdown size="mini" @command="handleCommand">
                  <i class="el-icon-more-outline"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-show="comm.isDelete==0" style="padding:0 10px;margin:0" :command="comm.id+'_'+comm.isDelete"><el-link :underline="false">举报</el-link></el-dropdown-item>
                    <el-dropdown-item v-show="comm.isDelete!=0" style="padding:0 10px;margin:0" :command="comm.id+'_'+comm.isDelete"><el-link :underline="false">删除</el-link></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div style="margin-top:10px" v-show="comm.isEditShow==1">
              <vue-ueditor-wrap v-model="comm.comment" :config="editConfig" :destroy="true"></vue-ueditor-wrap>
              <div style="display:flex;justify-content:flex-end;margin:20px 0 -5px 0"><el-button type="primary" size="small" plain @click="onClickReply(comm)">回 复</el-button></div>
            </div>
            <!-- 回复内容 -->
            <div style="margin-top:10px;background-color:#F2F6FC;padding:10px;border-radius:5px" v-for="(item,index) in comm.replayList" :key="index">
              <div style="display:flex;">
                <div style="width: 40px;">
                  <el-avatar :src="item.userAvatar" :size="30"></el-avatar>
                </div>
                <div style="flex:1">
                  <div>
                    <span style="font-size:14px;color:#333;margin-right: 12px;">{{item.userName}}<span v-show="item.isAuthor==1" style="color:#999">（作者）</span></span><span style="font-size:12px;color:#999">{{item.date}}</span>
                  </div>
                  <div v-html="item.content" style="margin-top:10px;margin-bottom:10px"></div>
                  <div style="display:flex;align-items:baseline">
                    <div class="works-handle-item" @click="onClickPraise(item,comm)">
                      <img :src="item.praise==1? praiseOk :praiseNo" style="width: 14px;height:14px;"/>
                      <span>{{item.praiseCount>999 ? '999+' : item.praiseCount}}</span>
                    </div>
                    <div class="works-handle-item" @click="onClickIsShowChildReply(comm,item)">
                      <i class="el-icon-chat-line-round"></i>
                      <span>回复</span>
                    </div>
                    <div class="works-handle-item">
                      <el-dropdown size="mini" @command="handleCommand">
                        <i class="el-icon-more-outline"></i>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-show="item.isDelete==0" style="padding:0 10px;margin:0" :command="item.id+'_'+item.isDelete"><el-link :underline="false">举报</el-link></el-dropdown-item>
                          <el-dropdown-item v-show="item.isDelete!=0" style="padding:0 10px;margin:0" :command="item.id+'_'+item.isDelete"><el-link :underline="false">删除</el-link></el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                  <div style="margin-top:10px;margin-bottom:10px;margin-right:5px" v-show="item.isEditShow==1">
                    <vue-ueditor-wrap v-model="item.comment" :config="editConfig" :destroy="true"></vue-ueditor-wrap>
                    <div style="display:flex;justify-content:flex-end;margin:20px 0 -5px 0"><el-button type="primary" size="small" plain @click="onClickSecondReply(comm,item)">回 复</el-button></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <als-pagination :size="6" style="margin-top: 20px" @currentPage="changeCommentsPage($event)" @tableData="changeCommentsData($event)" ref="alsPageinationCommentItem"/>
    <als-tip-offs ref="alsTipOffsDialog"/>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js'
  import storageUtil from '../../utils/storageUtil'
  import promptUtil from '../../utils/promptUtil'
  import tipoffsDialog from '../../components/component/tipoffsDialog'
  import '../../api/restfulapi'
  import {
    qs,
    likeOperation,
    addCommentWithWorks,
    getCommentWithWorks,
    delCommentWithWorks
  } from '../../api/api'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import alsPagination from '../commons/pagination/pagination'
  export default {
    name: "commentComponent",
    components:{"VueUeditorWrap": VueUeditorWrap,'als-pagination':alsPagination,'als-tip-offs':tipoffsDialog},
    props:{
      worksId:{
        type:Number,
        default:0
      }
    },
    data(){
      return{
        commentDisabled:false,
        isCommentLoading:false,
        praise:false,
        praiseCount:1000,
        praiseOk: require('../../assets/discover/praise-ok.png'),
        praiseNo: require('../../assets/discover/praise-no.png'),
        commentDataServer:[],
        commentData:[],
        currentCommentPage:1,
        baseComment:"<span style='color:#999'>作品有哪些值得鼓励或可以改进的地方呢？记得保持友善和礼貌，互相鼓励，互相学习呦~</span>",
        //编辑器
        comment:"<span style='color:#999'>作品有哪些值得鼓励或可以改进的地方呢？记得保持友善和礼貌，互相鼓励，互相学习呦~</span>",
        editConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight:150,
          // serverUrl: '//192.168.1.177:9527/ueditor/php/controller.php',
          serverUrl:'/static/ALSEditor/php/controller.php',
          // 初始容器宽度
          initialFrameWidth: '100%',
          wordOverFlowMsg:'<span style="color:red;">字符个数超出最大允许值</span>',
          UEDITOR_HOME_URL: '/static/ALSEditor/',
          maximumWords:150,
          elementPathEnabled:false,
          toolbars: [[
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'removeformat', 'formatmatch','|',
            'forecolor', 'backcolor', 'insertorderedlist','|',
            'horizontal', 'spechars', '|', 'time'
          ]],
        },
      }
    },
    watch:{
      comment:{
        handler(val){
          try{
            if(this.$refs.vueUeditorWrap && this.$refs.vueUeditorWrap.id){
              if(UE.getEditor(this.$refs.vueUeditorWrap.id).getContentTxt().length>150 || UE.getEditor(this.$refs.vueUeditorWrap.id).getContentTxt().length==0){
                this.commentDisabled = true
              }else{
                this.commentDisabled = false
              }
            }
          }catch (e) {}
        },
        immediate:false,
        deep:false,
      },
      worksId:{
        handler(val){
          if(val!=0){
            this.getCommentList()
          }
        }
      }
    },
    mounted(){
      // if(global.DEBUG==true){
      //   this.editConfig.serverUrl = '//192.168.1.177:9527/ueditor/php/controller.php'
      // }else{
      //   this.editConfig.serverUrl = '/static/ALSEditor/php/controller.php'
      // }
      this.editConfig.serverUrl = '/static/ALSEditor/php/controller.php'
      PubSub.subscribe('fetchCommentList',(msg,data)=>{
        this.getCommentList()
      })
    },
    methods:{
      handleCommand(command) {
        const arr = command.split('_')
        if(arr[1]==0){ // 举报操作
          const obj = {
            scratch_id:this.worksId,
            pid: arr[0],
            user_id:storageUtil.readTeacherInfo().id
          }
          this.$refs.alsTipOffsDialog.show(obj)
        }else {
          this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const loading = promptUtil.loading(this)
            delCommentWithWorks(qs.stringify({
              id: arr[0],
              user_id:storageUtil.readTeacherInfo().id
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                this.getCommentList()
                this.$message({type: 'success', message: '删除成功!'});
              }
              loading.close()
            }).catch(err=>{
              promptUtil.LOG('delCommentWithWorks-err',err)
              loading.close()
            })
          }).catch();
        }
      },
      onClickPraise(obj,parent){
        likeOperation(qs.stringify({
          scratch_id:this.worksId,
          pid:obj.id,
          user_id:storageUtil.readTeacherInfo().id,
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(obj.replayList){
              let parentId = this.commentDataServer.findIndex(item=>item.id==obj.id)
              this.commentDataServer[parentId].praise = this.commentDataServer[parentId].praise==1 ? 0 : 1
              if(this.commentDataServer[parentId].praise==1){ // 需要增加一个
                this.commentDataServer[parentId].praiseCount = this.commentDataServer[parentId].praiseCount + 1
              }else{
                if(this.commentDataServer[parentId].praiseCount>0){
                  this.commentDataServer[parentId].praiseCount = this.commentDataServer[parentId].praiseCount - 1
                }
              }
            }else{
              let parentId = this.commentDataServer.findIndex(item=>item.id==parent.id)
              let childId = this.commentDataServer[parentId].replayList.findIndex(item=>item.id==obj.id)
              this.commentDataServer[parentId].replayList[childId].praise = this.commentDataServer[parentId].replayList[childId].praise==1 ? 0 : 1
              if(this.commentDataServer[parentId].replayList[childId].praise==1){ // 需要增加一个
                this.commentDataServer[parentId].replayList[childId].praiseCount = this.commentDataServer[parentId].replayList[childId].praiseCount + 1
              }else{
                if(this.commentDataServer[parentId].replayList[childId].praiseCount>0){
                  this.commentDataServer[parentId].replayList[childId].praiseCount = this.commentDataServer[parentId].replayList[childId].praiseCount - 1
                }
              }
            }
            this.$refs.alsPageinationCommentItem.setServerData(this.commentDataServer)
          }
        }).catch(err=>{
          promptUtil.LOG('likeOperation-err',err)
        })
      },
      onClickSecondReply(parent,child){
        const replayUser = "<p style='color:#999'>@"+child.userName+":</p>"
        const pid = parent.id
        const loading = promptUtil.loading(this)
        addCommentWithWorks(qs.stringify({
          scratch_id:this.worksId,
          pid:pid,
          user_id: storageUtil.readTeacherInfo().id,
          text: replayUser + child.comment
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            promptUtil.success(this,res.msg)
          }
          loading.close()
          this.getCommentList()
        }).catch(err=>{
          promptUtil.LOG('addCommentWithWorks-err',err)
          loading.close()
        })
      },
      onClickReply(obj){
        const replayUser = "<p style='color:#999'>@"+obj.userName+":</p>"
        const loading = promptUtil.loading(this)
        addCommentWithWorks(qs.stringify({
          scratch_id:this.worksId,
          pid:obj.id,
          user_id: storageUtil.readTeacherInfo().id,
          text: replayUser + obj.comment
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            promptUtil.success(this,res.msg)
          }
          loading.close()
          this.getCommentList()
        }).catch(err=>{
          promptUtil.LOG('addCommentWithWorks-err',err)
          loading.close()
        })
      },
      changeCommentsPage(data){
        this.currentCommentPage = data
      },
      changeCommentsData(data){
        this.commentData = data
      },
      getCommentList(){
        getCommentWithWorks(qs.stringify({
          user_id:storageUtil.readTeacherInfo().id,
          scratch_id:this.worksId
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data&& res.data!='[]'){
              this.commentDataServer = res.data
            }
            this.$refs.alsPageinationCommentItem.setCurrentPage(this.currentCommentPage)
            this.$refs.alsPageinationCommentItem.setServerData(this.commentDataServer)
          }
        }).catch(err=>{
          promptUtil.LOG('getCommentWithWorks-err',err)
        })
      },
      onClickAddComment(){
        this.isCommentLoading = true
        addCommentWithWorks(qs.stringify({
          scratch_id:this.worksId,
          pid:0,
          user_id: storageUtil.readTeacherInfo().id,
          text: this.comment
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.comment = this.baseComment
            promptUtil.success(this,res.msg)
          }
          this.isCommentLoading = false
          this.getCommentList()
        }).catch(err=>{
          promptUtil.LOG('addCommentWithWorks-err',err)
          this.isCommentLoading = false
        })
      },
      onClickIsShowReply(obj){
        const index = this.commentData.findIndex(item=>item.id==obj.id)
        if(index>=0){
          this.commentData[index].isEditShow = this.commentData[index].isEditShow==1 ? 0 : 1
        }
      },
      onClickIsShowChildReply(parent,child){
        const parentIndex = this.commentData.findIndex(item=>item.id==parent.id)
        if(parentIndex>=0){
          const childIndex = this.commentData[parentIndex].replayList.findIndex(item=>item.id==child.id)
          if(childIndex>=0){
            this.commentData[parentIndex].replayList[childIndex].isEditShow = this.commentData[parentIndex].replayList[childIndex].isEditShow==1 ? 0 : 1
          }
        }
      }
    }
  }
</script>

<style scoped>
  .works-handle-item{
    font-size:14px;
    width:60px;
  }
  .works-handle-item:hover{
    cursor: pointer;
  }
</style>
