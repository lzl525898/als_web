<template>
  <div>
    <el-dialog title="发布作品" :visible.sync="publishDialogVisible" width="600px" top="10vh" :before-close="handleClose">
      <el-form :model="scratchRuleForm"  ref="scratchRuleForm" label-width="100px" class="demo-ruleForm" style="margin-right: 15px">
        <el-form-item label="作品名称:">
          <el-input v-model="scratchRuleForm.name" placeholder="请输入作品名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="作品介绍:">
          <el-input type="textarea" v-model="scratchRuleForm.produce" :placeholder="producePlaceHolder"></el-input>
        </el-form-item>
        <el-form-item label="操作说明:">
          <el-input type="textarea" v-model="scratchRuleForm.explain" placeholder="如果你的作品需要操作互动，请不要忘记告诉大家操作的方法等信息哦。"></el-input>
        </el-form-item>
        <el-form-item label="标签:" prop="tag">
          <template>
            <div>
              <el-checkbox-group v-model="scratchRuleForm.tag" @change="scratchHandleChange">
                <el-checkbox-button
                  v-for="city in scratchRuleForm.cities"
                  :label="city.key"
                  :key="city.key"
                >{{city.label}}
                </el-checkbox-button>
              </el-checkbox-group>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="作品封面图:">
<!--          <template>-->
<!--            <el-popover placement="top" width="150" trigger="hover">-->
<!--              <div style="width:100%;height: 120px;display: flex;justify-content: center;align-items: center;margin-top: 10px">-->
<!--                <vue-qr :text="scratchRuleForm.qrUrl" :logoSrc="require('../../../../static/images/base/logo.jpg')"-->
<!--                  colorDark="#000" colorLight="#fff" :margin="0" :logoScale="0.4" :size="130"></vue-qr>-->
<!--              </div>-->
<!--              <div style="margin-top: 30px">手机扫码试玩需要你自己的帐号登录</div>-->
<!--              <el-button slot="reference" style="float: right;border: none;color: #00a2ff;">手机试玩</el-button>-->
<!--            </el-popover>-->
<!--          </template>-->
          <el-upload
            :action="uploadPictureAction"
            list-type="picture-card"
            :limit="1"
            :on-remove="handlePictureRemove"
            :on-preview="handlePictureCardPreview"
            :before-upload="handlePictureBeforeUpload"
            :on-success="handleSuccessUploadImage"
            :on-progress="handleRrogress"
            :file-list="scratchRuleForm.pictureList"
          >
            <div slot="trigger">
              <span style="color:#888888">添加图片</span>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>
          </el-upload>
          <el-dialog :visible.sync="stickerPrintDialogImageVisible" :fullscreen="true">
            <img width="100%;" height="100%;" :src="stickerPrintDialogImageUrl" alt>
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="margin-right: 15px">
<!--        <el-button @click="publishDialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="handlePublishWorks" :loading="isLoadingWithPublish"
                   :disabled="isPublishReport">发 布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import vueQr from "vue-qr"
  import stringUtil from '../../../utils/stringUtil'
  import promptUtil from '../../../utils/promptUtil'
  import storageUtil from '../../../utils/storageUtil'
  import '../../../api/restfulapi'
  import {
    qs,
    uploadFileUrl,
    delUploadFileByUrl,
    getScratchCategory,
    publishScratchWorks,
  } from '../../../api/api'
  export default {
    components:{vueQr},
    name: "publishDialog",
    data(){
      return{
        uploadPictureAction:uploadFileUrl,
        publishDialogVisible:false,
        isPublishReport:false,
        isLoadingWithPublish:false,
        stickerPrintDialogImageVisible:false,
        stickerPrintDialogImageUrl:'',
        producePlaceHolder:'我在奥松云课堂进行创意编程，这是我的作品，快来看看吧！',
        onReleaseTypeDisabled: false,//图片未上传成功disabled发布按钮
        onSaveTypeDisabled: false,//图片未上传成功disabled保存按钮
        dialogImageVisible: false, // 是否显示图片组件对话框
        dialogImageUrl: '', // 上传图片组件中图片地址
        uploadDialogPictureArray: [], // 发布dialog上传图片由服务器返回的图片地址
        scratchRuleForm:{id:'',name:'',produce:'',explain:'',tag:[],cities:[],qrUrl:'',pictureList:[]},
        scratchRules:[],
      }
    },
    methods:{
      initData(){
        this.publishDialogVisible=false
        this.isPublishReport=false
        this.isLoadingWithPublish=false
        this.stickerPrintDialogImageVisible=false
        this.stickerPrintDialogImageUrl=''
        this.producePlaceHolder='我在奥松云课堂进行创意编程，这是我的作品，快来看看吧！'
        this.onReleaseTypeDisabled=false
        this.onSaveTypeDisabled=false
        this.dialogImageVisible=false
        this.dialogImageUrl=''
        this.uploadDialogPictureArray=[]
        this.scratchRuleForm={id:'',name:'',produce:'',explain:'',tag:[],cities:[],qrUrl:'',pictureList:[]}
      },
      show(data){
        const loading = promptUtil.loading(this)
        this.scratchRuleForm.id = data.id
        this.scratchRuleForm.name = data.name
        this.scratchRuleForm.cities = []
        getScratchCategory().then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              res.data.map(item=>{
                const obj = {key:item.id,label:item.category_name}
                this.scratchRuleForm.cities.push(obj)
              })
            }
          }
          this.publishDialogVisible = true
          loading.close()
        }).catch(err=>{
          promptUtil.LOG('getScratchCategory-err',err)
          loading.close()
          this.publishDialogVisible = true
        })
      },
      handlePublishWorks(){
        this.isLoadingWithPublish = true
        if(this.scratchRuleForm.produce && this.scratchRuleForm.produce!=''){
          this.scratchRuleForm.produce = this.scratchRuleForm.produce.trim()
        }else{
          this.scratchRuleForm.produce = this.producePlaceHolder
        }
        let tags = ''
        if(this.scratchRuleForm.tag && this.scratchRuleForm.tag.length>0){
          tags = stringUtil.array2String(this.scratchRuleForm.tag,",")
        }
        publishScratchWorks(qs.stringify({
          scratch_id:this.scratchRuleForm.id,
          user_id:storageUtil.readTeacherInfo().id,
          school_id:storageUtil.readTeacherInfo().school_id,
          jieshao:this.scratchRuleForm.produce,
          con:this.scratchRuleForm.explain,
          cover_img:this.uploadDialogPictureArray.length == 0 ? "" : this.uploadDialogPictureArray[0],
          bq:tags
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.$emit('publishWorks',this.scratchRuleForm.id)
            promptUtil.success(this,res.msg)
          }else{
            promptUtil.warning(this,res.msg)
          }
          this.isLoadingWithPublish = false
          this.initData()
          this.publishDialogVisible = false
        }).catch(err=>{
          promptUtil.LOG('publishScratchWorks-err',err)
          this.initData()
          this.publishDialogVisible = false
        })
      },
      scratchHandleChange(val){

      },
      handleClose(done){
        this.initData()
        done();
      },
      // 预览选中上传的图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      },
      // 删除上传的图片监听
      handlePictureRemove(file, fileList) {
        //获取oss路径
        delUploadFileByUrl(qs.stringify({url: file.url.substring(55)}))
          .then(res => {
            if (res.code == SUCCESS_CODE) {
              if (this.valId == 1) {
                this.uploadDialogPictureArray.splice(this.uploadDialogPictureArray.findIndex(item => item === file.url), 1);
              } else {
                this.uploadPictureArray.splice(this.uploadPictureArray.findIndex(item => item === file.url), 1);
              }
            } else {
              promptUtil.wait(this);
            }
          })
          .catch(err => {
            promptUtil.timeout(this);
          });
      },
      //上传文件时回调
      handleRrogress(event, file, fileList) {
        this.onReleaseTypeDisabled = true
        this.onSaveTypeDisabled = true
      },
      // 上传图片成功回调
      handleSuccessUploadImage(response, file, fileList) {
        this.onReleaseTypeDisabled = false
        this.onSaveTypeDisabled = false
        this.uploadDialogPictureArray = []
        this.uploadDialogPictureArray.push(response)
      },
      // 上传图片监听函数
      handlePictureBeforeUpload(file) {
        const isJPG = file.type === "image/png" || file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message({
            message: "文件图片超过2MB，请重新选择文件",
            type: "error",
            duration: 1500
          });
        }
        if (!isJPG) {
          this.$message({
            message: "只能上传jpg/png文件，请重新选择文件",
            type: "error",
            duration: 1500
          });
        }
        if (isJPG && isLt2M) {
          console.log("处理上传图片操作");
        }
        return isJPG && isLt2M;
      },
    }
  }
</script>

<style scoped>

</style>
