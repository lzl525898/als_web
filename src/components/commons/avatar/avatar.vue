<template>
  <div style="display:flex;justify-content:flex-start;align-items:center">
    <el-avatar :src="currentAvatar" :style="{height:size+'px',width:size+'px'}"></el-avatar>
    <el-link :underline="false" type="primary" style="margin-left: 20px" @click="avatarDialogVisible=true">
      更换头像
    </el-link>
    <el-dialog
      :visible.sync="avatarDialogVisible"
      append-to-body>
      <div class="cropper-content">
        <div class="cropper">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
            @imgLoad="imgLoad"></vueCropper>
        </div>
        <div class="show-preview"
             :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>
      <div class="footer-btn">
        <div class="scope-btn">
          <label class="btn" for="uploads">选择图片</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
                 accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
          <el-button size="mini" icon="el-icon-plus" @click="changeScale(1)"></el-button>
          <el-button size="mini" icon="el-icon-minus" @click="changeScale(-1)"></el-button>
          <el-button size="mini" style="font-weight: 600;" @click="rotateLeft">↺</el-button>
          <el-button size="mini" style="font-weight: 600;" @click="rotateRight">↻</el-button>
        </div>
        <div class="upload-btn">
          <el-button type="primary" style="margin-left: 46px;" size="mini" @click="down('base64')"
                     :loading="isUpdateAvatarLoading">上传头像
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { VueCropper } from 'vue-cropper'
  import storageUtil from '../../../utils/storageUtil'
  import promptUtil from '../../../utils/promptUtil'
  import '../../../api/restfulapi'
  import {
    qs,
    uploadBase64
  } from '../../../api/api'
  export default {
    components:{VueCropper},
    name: "avatar",
    props:{
      avatar:{
        type:String,
        default:'',
      },
      size:{
        type:Number,
        default:60,
      }
    },
    data(){
      return{
        avatarDialogVisible: false, // 是否显示头像对话框
        isUpdateAvatarLoading: false, // 更新头像当前状态
        downImg: '#',
        currentAvatar: '', //当前头像
        previews: {},
        option: {
          img: '',
          size: 1,
          full: false, // 输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true
        },
      }
    },
    watch:{
      avatar:{
        handler(val){
          this.currentAvatar = val
        },
        deep:false,
        immediate:true
      }
    },
    methods:{
      down(type) {
        // event.preventDefault()
        if (type === 'blob') {
          let aLink = document.createElement('a')
          aLink.download = 'author-img'
          this.$refs.cropper.getCropBlob(data => {
            this.downImg = window.URL.createObjectURL(data)
            //            aLink.download = this.downImg;
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else { // base64
          this.$refs.cropper.getCropData(data => {
            this.downImg = data
            this.isUpdateAvatarLoading = true
            uploadBase64(qs.stringify({
              file: this.downImg,
              user_id: storageUtil.readTeacherInfo().id
            })).then(res => {
              if (res.code == SUCCESS_CODE) {
                this.option.img = res.data.header_new
                this.currentAvatar = this.option.img
                this.$emit('userAvatarUrl',this.option.img)
              } else {
                promptUtil.timeout(this)
              }
              this.isUpdateAvatarLoading = false
              this.avatarDialogVisible = false
            }).catch(err => {
              this.isUpdateAvatarLoading = false
              promptUtil.LOG("uploadBase64-err", err)
            })
            // aLink.href = data
            // aLink.click()
            // 将头像图片数据发送给后台
          })
        }
      },
      uploadImg(e, num) {
        //上传图片
        // this.option.img
        let file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        const reader = new FileReader()
        reader.onload = e => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          }
        }
        // 转化为base64
        reader.readAsDataURL(file)
        // 转化为blob
        // reader.readAsArrayBuffer(file)
      },
      // 实时预览函数
      realTime(data) {
        if (!this.option.img) {
          this.option.img = this.$store.state.userAvatar
        }
        this.previews = data
      },
      imgLoad(msg) {
        promptUtil.LOG("imgLoad", msg)
        if (msg == 'error') {
          this.avatarDialogVisible = false
        }
      },
      // 改变图片大小
      changeScale(num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      // 向左旋转
      rotateLeft() {
        this.$refs.cropper.rotateLeft()
      },
      // 向右旋转
      rotateRight() {
        this.$refs.cropper.rotateRight()
      },
    }
  }
</script>

<style scoped>
  .cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }

  .cropper {
    width: 350px;
    height: 300px;
  }
  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .preview {
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid #cccccc;
    background: #cccccc;
    margin-left: 40px;
  }

  .footer-btn {
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }

  .scope-btn {
    width: 350px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
  }

  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 10px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
</style>
