<template>
  <div>
    <als-header/>
    <div style="display:flex;justify-content:center">
      <div style="width:1200px;margin-top: 30px;min-height: 690px">
        <div class="main-wrapper">
          <als-user-panel @target="onChangeMainWrapper($event)"/>
          <div v-show="targetMenu==1" class="right-wrapper">
            <el-card shadow="always" style="position: relative">
              <el-button size="small" style="position:absolute;right:20px;top:9px;z-index:10" type="primary" plain @click="onClickRefreshWorks">刷 新</el-button>
              <el-tabs style="margin-top: -10px">
                <el-tab-pane label="我的作品">
                  <div style="display:flex;justify-content:flex-start;align-items:center;margin-top:5px;">
                    <div class="work-type-label">类型</div>
                    <div id="work_type_scratch" class="work-type-item" @click="onClickWorksTypeAndStatus(1,1)">Scratch</div>
<!--                    <div id="work_type_stickers" class="work-type-item" @click="onClickWorksTypeAndStatus(1,2)">电子贴纸</div>-->
<!--                    <div id="work_type_printer" class="work-type-item" @click="onClickWorksTypeAndStatus(1,3)">3D打印</div>-->
                  </div>
                  <div style="display:flex;justify-content:flex-start;align-items:center;margin-top:20px;">
                    <div class="work-type-label">状态</div>
                    <div id="work_status_no" class="work-type-item" @click="onClickWorksTypeAndStatus(2,0)">未发布（{{publishNoNumber}}）</div>
                    <div id="work_status_ok" class="work-type-item" @click="onClickWorksTypeAndStatus(2,1)">已发布（{{publishOkNumber}}）</div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
            <div v-show="fetchLoading==true" style="height:530px;display:flex;justify-content:center;align-items:center;color:#00a2ff">加载中...</div>
            <div v-show="fetchLoading==false">
              <div v-show="worksListServer.length==0" style="height: 530px;display:flex;justify-content:center;align-items: center">
                <img style="width:270px; height:330px" :src="noDataUrl" fit="fill"/>
              </div>
              <div v-show="worksListServer.length>0">
                <div style="margin-top:10px;display:flex;justify-content:flex-start;align-items:center;flex-flow:wrap">
                  <als-works-item :data="work" v-for="(work,index) in worksList" :key="index" :style="{ marginLeft: (index%4!=0 ? 10 : 0) + 'px'}"/>
                </div>
                <als-page :size="8" @tableData="changeWorkListData($event)" ref="alsPageinationWorksItem"/>
              </div>
            </div>
          </div>
          <div v-show="targetMenu==2" class="right-wrapper">
            <el-card shadow="always" style="position: relative">
              <el-tabs style="margin-top: -10px;padding-bottom: 30px">
                <el-tab-pane label="账号信息">
                  <div style="margin-top:10px;">
                    个人信息 <span style="font-size:12px;color:#999">ID:100400{{userInfo.userId}}</span>
                  </div>
                  <el-divider></el-divider>
                  <div style="margin: 10px 280px 10px 120px">
                    <el-form ref="userInfoForm" :model="userInfo" label-width="100px" :rules="userInfoRules">
                      <el-form-item label="头像">
                        <als-avatar @userAvatarUrl="onChangeUserAvatarUrl($event)" :avatar="userInfo.avatar"/>
                      </el-form-item>
                      <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="userInfo.name" placeholder="请输入真实姓名"></el-input>
                      </el-form-item>
                      <div style="display:flex">
                        <el-form-item label="出生日期">
                          <el-date-picker v-model="userInfo.birth" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="flex:2"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="性别" label-width="60px">
                          <el-select v-model="userInfo.sex" placeholder="请选择" style="flex:1">
                            <el-option label="保密" :value="0"></el-option>
                            <el-option label="男" :value="1"></el-option>
                            <el-option label="女" :value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <el-form-item label="地区">
                        <el-cascader v-model="userInfo.addressIds" :options="areaOptions" @change="handleCascaderChange" style="width:100%;"></el-cascader>
                      </el-form-item>
                      <el-form-item label="个人签名">
                        <el-input type="textarea" :rows="2" placeholder="奥松云课堂真棒" v-model="userInfo.signature"></el-input>
                      </el-form-item>
                      <el-form-item label="常用手机" prop="phone">
                        <el-input v-model="userInfo.phone" placeholder="请输入手机号"></el-input>
                      </el-form-item>
                      <el-form-item label="微信号">
                        <el-input v-model="userInfo.wechat" placeholder="请输入微信号"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button class="user-info-save-btn" @click="onClickSubmitSaveUserInfo()">保 存</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div style="margin-top:30px;">账号信息</div>
                  <el-divider></el-divider>
                  <div style="display:flex">
                    <div style="margin-left:148px;flex:1">当前账号<span style="margin-left:10px;color:#999">{{userInfo.account}}</span></div>
                    <div style="flex:2;display:flex;justify-content:flex-start">
                      <el-link :underline="false" @click="updatePwdDialogVisible=true"><span style="color:#047FD8">修改密码</span></el-link>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <als-footer/>
    <als-publish-dialog @publishWorks="changWorkListDataByPublish($event)" ref="alsPublishDialog"/>
    <el-dialog
      title="修改密码"
      top="45vh"
      :visible.sync="updatePwdDialogVisible"
      :before-close="handleClose"
      width="400px"
      center>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="输入旧密码" prop="oldpassword">
            <el-input v-model="ruleForm.oldpassword" type="password" placeholder="请输入旧密" show-password @keydown.native.enter="onClickUpdatePassword"></el-input>
          </el-form-item>
          <el-form-item label="输入新密码" prop="password">
            <el-input v-model="ruleForm.password" placeholder="请输入新密码" type="password" show-password @keydown.native.enter="onClickUpdatePassword"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="reptpassword">
            <el-input v-model="ruleForm.reptpassword" placeholder="请确认新密码" type="password" show-password @keydown.native.enter="onClickUpdatePassword"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="onClickUpdatePassword" style="width:100%;" :loading="isLoadingUpdatePwd">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'
  import PubSub from "pubsub-js"
  import alsHeader from '../../components/component/header'
  import alsFooter from '../../components/component/footer'
  import avatarItem from '../../components/commons/avatar/avatar'
  import userPanel from '../../components/component/person/userPanel'
  import worksItem from '../../components/component/person/worksItem'
  import publishDialig from '../../components/component/person/publishDialog'
  import pagination from '../../components/commons/pagination/pagination'
  import vuexUtil from '../../utils/vuexUtils'
  import promptUtil from '../../utils/promptUtil'
  import storageUtil from '../../utils/storageUtil'
  import '../../api/restfulapi'
  import {
    qs,
    updateUserInfo,
    getScratchWorksList,
    deleteScratchWorks,
    updateUserPassword,
    getAreaInfoWithIndex
  } from '../../api/api'
  export default {
    name: "personCenter",
    components:{
      'als-header':alsHeader,
      'als-footer':alsFooter,
      'als-user-panel':userPanel,
      'als-works-item':worksItem,
      'als-page':pagination,
      'als-avatar':avatarItem,
      'als-publish-dialog':publishDialig
    },
    data(){
      const validateUserInfoName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('真实姓名不能为空'));
        }else{
          let pattern = new RegExp("/^[0-9a-zA-Z]|[\u4e00-\u9fa5]+$/")
          if(pattern.test(value)){
            callback(new Error('含有特殊字符'));
          }
        }
      }
      const validateUserInfoPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号'));
        }else{
          let mobile_mode=/^1[3456789]\d{9}$/;
          if(!mobile_mode.test(value)){
            callback(new Error('请输入正确的手机号'));
          }
        }
      }
      return{
        noDataUrl:require('../../../static/images/base/nodata.png'),
        updatePwdDialogVisible:false,
        fetchLoading:true,
        publishNoNumber:0,
        publishOkNumber:0,
        worksListServer:[],
        worksList:[],
        targetWorkFilter:{
          type:1, // 1 scratch  2 电子贴纸 3 3D打印
          status:0 // 0 未发布  1 发布
        },
        areaOptions: [],
        targetMenu: 1,
        userInfo:{},
        userInfoRules:{
          name: [
            { validator: validateUserInfoName, trigger: 'blur' }
          ],
          phone: [
            { validator: validateUserInfoPhone, trigger: 'blur' }
          ]
        },
        isLoadingUpdatePwd:false,
        ruleForm: {oldpassword: "", password: "", reptpassword: ""},
        // 弹出框 修改密码页面表单验证
        rules: {
          oldpassword: [
            {required: true, message: "请输入旧密码", trigger: "blur"},
            {min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入新密码", trigger: "blur"},
            {min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur"}
          ],
          reptpassword: [
            {required: true, message: "再次输入密码", trigger: "blur"},
            {min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur"}
          ]
        },
      }
    },
    mounted(){
      if(storageUtil.getAreaContent() && storageUtil.getAreaContent().length>0){
        this.areaOptions = storageUtil.getAreaContent()
      }else{
        getAreaInfoWithIndex().then(res=>{
          storageUtil.setAreaContent(res.data)
          this.areaOptions = res.data
        }).catch(err=>{
          promptUtil.LOG('getAreaInfoWithIndex-err',err)
        })
      }
      // 订阅弹出发布对话框的消息
      PubSub.subscribe("showWorksPublishDialog", (msg, data) => {
        this.$refs.alsPublishDialog.show(data)
      });
      // 订阅删除发布作品的消息
      PubSub.subscribe("deleteScratchWorkById", (msg, data) => {
        const loading = promptUtil.loading(this)
        deleteScratchWorks(qs.stringify({ id: data.id})).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.worksListServer.splice(this.worksListServer.findIndex(item=>item.worksId==data),1)
            if(this.targetWorkFilter.status==0){
              if(this.publishNoNumber>0){
                this.publishNoNumber = this.publishNoNumber -1
              }
            }else{
              if(this.publishOkNumber>0){
                this.publishOkNumber = this.publishOkNumber - 1
              }
            }
            this.worksItemPagination()
          }else{
            promptUtil.warning(this,res.msg)
          }
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG('deleteScratchWorks-err',err)
        })
      });
      this.listenLoginStatus()
      this.onClickWorksTypeAndStatus(1,1)
      this.onClickWorksTypeAndStatus(2,0)
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id)
      this.initData()
    },
    destroyed(){
      clearInterval(this.intervalId)
      this.intervalId = null
    },
    methods:{
      initData(){
        vuexUtil.setUserAvatarWithState(this, storageUtil.readTeacherInfo().avatar)
        this.getScratchWorksListFromServer()
      },
      handleCascaderChange(val){
        let province,city,area
        try{
          province = this.areaOptions.find(item=>item.value==this.userInfo.addressIds[0])
          city = province.children.find(item=>item.value==this.userInfo.addressIds[1])
          area = city.children.find(item=>item.value==this.userInfo.addressIds[2])
        }catch (e) {}
        this.userInfo.address = (province ? province.label : '') + (city ? city.label : '') + (area ? area.label : '')
      },
      changWorkListDataByPublish(data){
        this.worksListServer.splice(this.worksListServer.findIndex(item=>item.worksId==data),1)
        this.publishNoNumber = this.publishNoNumber - 1
        this.publishOkNumber = this.publishOkNumber + 1
        this.worksItemPagination()
      },
      getScratchWorksListFromServer(){
        this.fetchLoading = true
        getScratchWorksList(qs.stringify({id:storageUtil.readTeacherInfo().id,is_submit:this.targetWorkFilter.status})).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.worksListServer = []
            if(res.data && res.data.worksList && res.data.worksList!='[]'){
              this.worksListServer = res.data.worksList
            }
            this.publishNoNumber = res.data.unpublished
            this.publishOkNumber = res.data.published
            // if(this.targetWorkFilter.status==0){
            //   this.publishNoNumber = this.worksListServer.length
            // }else{
            //   this.publishOkNumber = this.worksListServer.length
            // }
            this.worksItemPagination()
          }
        }).catch(err=>{
          promptUtil.LOG('getScratchWorksList-err',err)
        })
      },
      changeWorkListData(data){
        this.worksList = data
      },
      onClickRefreshWorks(){
        this.getScratchWorksListFromServer()
      },
      worksItemPagination(){
        try{
          this.fetchLoading = false
          this.$refs.alsPageinationWorksItem.setCurrentPage(1)
          this.$refs.alsPageinationWorksItem.setServerData(this.worksListServer)
        }catch (e) {}
      },
      onClickWorksTypeAndStatus(tag,index){
        if(tag==1){
          $('#work_type_scratch').removeClass('work-type-item-type')
          $('#work_type_stickers').removeClass('work-type-item-type')
          $('#work_type_printer').removeClass('work-type-item-type')
          this.targetWorkFilter.type = index
          if(index==1){
            $('#work_type_scratch').addClass('work-type-item-type')
          }else if(index==2){
            $('#work_type_stickers').addClass('work-type-item-type')
          }else if(index==3){
            $('#work_type_printer').addClass('work-type-item-type')
          }
        }else{
          $('#work_status_ok').removeClass('work-type-item-type')
          $('#work_status_no').removeClass('work-type-item-type')
          this.targetWorkFilter.status = index
          if(index==0){
            $('#work_status_no').addClass('work-type-item-type')
          }else{
            $('#work_status_ok').addClass('work-type-item-type')
          }
        }
        if(this.targetWorkFilter.type==1){
          this.getScratchWorksListFromServer()
        }else if(this.targetWorkFilter.type==2){

        }else if(this.targetWorkFilter.type==3){

        }
      },
      listenLoginStatus(){ // 监听是否为登录状态
        this.intervalId = setInterval(()=>{
          if(storageUtil.getLoginStatus()!=1){
            try{
              window.close()
              this.$router.replace({path:"/home"})
            }catch (e) {}
          }
        },1000)
      },
      getUserInfoData(){
        this.userInfo = {
          account:storageUtil.readTeacherInfo().username,
            userId: storageUtil.readTeacherInfo().id,
            avatar:storageUtil.readTeacherInfo().avatar,name:storageUtil.readTeacherInfo().real_name,
            birth:storageUtil.readTeacherInfo().birthday?storageUtil.readTeacherInfo().birthday:'',
            sex:storageUtil.readTeacherInfo().sex?storageUtil.readTeacherInfo().sex*1:0,
            signature:storageUtil.readTeacherInfo().signature?storageUtil.readTeacherInfo().signature:'',
            phone:storageUtil.readTeacherInfo().phone?storageUtil.readTeacherInfo().phone:'',
            wechat:storageUtil.readTeacherInfo().wechat?storageUtil.readTeacherInfo().wechat:'',
            addressIds:storageUtil.readTeacherInfo().address_code ? JSON.parse(storageUtil.readTeacherInfo().address_code) : []
        }
      },
      onChangeMainWrapper(index){
        this.targetMenu = index
        if(index==2){ // 账户设置
          this.getUserInfoData()
        }
      },
      onChangeUserAvatarUrl(data){
        this.userInfo.avatar = data
      },
      onClickSubmitSaveUserInfo(){
        const loading = promptUtil.loading(this)
        if (!this.userInfo.name) {
          loading.close()
          return false
        }else{
          let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？1234567890]")
          if(pattern.test(this.userInfo.name)){
            loading.close()
            return false
          }
        }
        if (!this.userInfo.phone) {
          loading.close()
          return false
        }else{
          let mobile_mode=/^1[3456789]\d{9}$/;
          if(!mobile_mode.test(this.userInfo.phone)){
            loading.close()
            return false
          }else{
            updateUserInfo(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              user_id: storageUtil.readTeacherInfo().id,
              user_nick: this.userInfo.name,
              user_phone: this.userInfo.phone,
              user_remark: storageUtil.readTeacherInfo().des,
              address: this.userInfo.address,
              address_ids: JSON.stringify(this.userInfo.addressIds),
              birth: this.userInfo.birth,
              sex: this.userInfo.sex,
              signature: this.userInfo.signature,
              wechat: this.userInfo.wechat
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                const userInfoObj = storageUtil.readTeacherInfo()
                userInfoObj.address = this.userInfo.address
                userInfoObj.address_code = JSON.stringify(this.userInfo.addressIds)
                userInfoObj.birthday = this.userInfo.birth
                userInfoObj.sex = this.userInfo.sex
                userInfoObj.signature = this.userInfo.signature
                userInfoObj.wechat = this.userInfo.wechat
                userInfoObj.avatar = this.userInfo.avatar
                userInfoObj.real_name = this.userInfo.name
                storageUtil.saveTeacherInfo(userInfoObj)
                vuexUtil.setUserNameWithState(this, this.userInfo.name)
                vuexUtil.setUserAvatarWithState(this, this.userInfo.avatar)
                promptUtil.success(this,res.msg)
              }else{
                promptUtil.warning(this,res.msg)
              }
              loading.close()
            }).catch(err=>{
              loading.close()
              promptUtil.LOG('updateUserInfo-err',err)
            })
          }
        }
      },
      onClickUpdatePassword(){
        // 修改用户密码
        if (this.ruleForm.oldpassword == this.ruleForm.password) {
          promptUtil.warning(this, "新密码与旧密码一致");
          return;
        }
        let reg=/^[\da-z]{6,20}$/i
        if (!reg.test(this.ruleForm.password)||!reg.test(this.ruleForm.password)) {
          promptUtil.warning(this, "密码长度在 6 到 20 个字符");
          return
        }
        this.isLoadingUpdatePwd = true
        updateUserPassword(
          qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            old_pass: this.ruleForm.oldpassword,
            new_pass: this.ruleForm.password,
            confirm_pass: this.ruleForm.reptpassword
          })
        ).then(res=>{
          this.isLoadingUpdatePwd = false
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, res.msg);
            this.resetForm('ruleForm')
            this.updatePwdDialogVisible = false
          } else {
            promptUtil.warning(this, res.msg);
            this.updatePwdDialogVisible = true
          }
        }).catch(err=>{
          this.isLoadingUpdatePwd = false
          this.updatePwdDialogVisible = false
        })
      },
      resetForm(formName) {
        this.ruleForm = {oldpassword: "", password: "", reptpassword: ""}
        this.$refs[formName].resetFields();
      },
      handleClose(done){
        this.resetForm('ruleForm')
        done();
      },
    }
  }
</script>

<style scoped>
  .main-wrapper{
    display: flex;
  }
  .right-wrapper{
    margin-left: 10px;
    width: 960px;
    min-height: 700px;
    margin-bottom: 10px;
  }
  .work-type-label{
    width:60px;
    margin-right:10px;
    font-size:13px;
  }
  .work-type-item{
    width:110px;
    margin-right:10px;
    font-size:13px;
  }
  .work-type-item:hover{
    cursor: pointer;
    color: #047FD8;
  }
  .work-type-item-type{
    color: #00a2ff;
    font-weight: bold;
  }
  .user-info-save-btn{
    width: 120px;
    height: 45px;
    font-size: 20px;
    text-align: center;
    background-color:#047FD8;
    border-radius:60px;
    color:#fff;
  }
  .user-info-save-btn:hover{
    background-color:#00a2ff;
    cursor: pointer;
  }
</style>
