<template>
  <div>
    <div class="bg">
      <div class="roundBg">
        <div style="margin:20px 10px 20px 10px">
          <el-form :model="consultForm" :rules="consultRules" ref="consultForm" size="small">
            <el-row :gutter="20">
              <el-col :span="15">
                <el-form-item label="学员姓名" prop="name" :label-width="formLabelWidth">
                  <el-input v-model="consultForm.name" autocomplete="off" placeholder="请输入学员名称"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                  <el-radio v-model="consultForm.sex" label="1">男</el-radio>
                  <el-radio v-model="consultForm.sex" label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="学员电话" prop="phone1" :label-width="formLabelWidth">
                  <el-input v-model="consultForm.phone1" autocomplete="off" placeholder="请输入学员电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <div>
                  <el-upload
                    class="avatar-uploader"
                    :action="postUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="consultForm.avatarUrl" :src="consultForm.avatarUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-col>
            </el-row>
            <el-form-item label="家长姓名" :label-width="formLabelWidth">
              <el-input v-model="consultForm.parent" autocomplete="off" placeholder="请输入家长姓名"></el-input>
            </el-form-item>
            <el-form-item label="备用电话" prop="phone2" :label-width="formLabelWidth">
              <el-input v-model="consultForm.phone2" autocomplete="off" placeholder="请输入备用电话"
              ></el-input>
            </el-form-item>

            <el-form-item label="学校" :label-width="formLabelWidth" prop="school">
              <el-input v-model="consultForm.school" autocomplete="off" placeholder="请输入所在学校"
              ></el-input>
            </el-form-item>
            <el-form-item label="年级班级" :label-width="formLabelWidth">
              <el-input v-model="consultForm.class" autocomplete="off" placeholder="请输入班级年级"
              ></el-input>
            </el-form-item>
            <el-form-item label="生日" :label-width="formLabelWidth">
              <el-date-picker v-model="consultForm.birth" type="date" placeholder="请选择出生日期" style="width: 100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="来源" :label-width="formLabelWidth">
              <el-select v-model="consultForm.source" placeholder="请选择学员来源" style="width: 100%">
                <el-option label="地推采单" value="地推采单"></el-option>
                <el-option label="门店到访" value="门店到访"></el-option>
                <el-option label="转介绍" value="转介绍"></el-option>
                <el-option label="活动转化" value="活动转化"></el-option>
                <el-option label="网络推广" value="网络推广"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="意向程度" :label-width="formLabelWidth" style="width: 100%">
              <el-select v-model="consultForm.extent" placeholder="请选择意向程度" style="width: 100%">
                <el-option label="高" value="3"></el-option>
                <el-option label="中" value="2"></el-option>
                <el-option label="低" value="1"></el-option>
                <el-option label="不确定" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="consultForm.desc" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="display: flex;justify-content: center;margin-top: 20px">
                <el-button @click="resetAddItemWithDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="onAddItemSubmit('consultForm')" size="small">确 定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import staticUtil from "../../../utils/staticUtil";
    import $ from "jquery"
    import PubSub from "pubsub-js"
    import promptUtil from '../../../utils/promptUtil'
    import stringUtil from '../../../utils/stringUtil'
    import storageUtil from '../../../utils/storageUtil'
    import {
        qs,
        uploadAvatarUrl,
    } from '../../../api/api'
    import childHeader from '../../component/childHeader'

    export default {
        data() {
            return {
                consultForm: {//表单
                    name: '',
                    sex: '1',
                    avatarUrl: '',
                    class: "",
                    birth: '',
                    phone1: '', // 学员电话
                    phone2: '', // 备用电话
                    school: '',
                    parent: '',
                    source: '', // 1地推采单  2门店到访  3转介绍  4活动转化  5网络推广  0其他
                    extent: '', // 1高2中3低0不明确、
                    desc: '' // 备注
                },
                consultRules: {
                    name: [
                        {required: true, message: '请输入学员姓名', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符'}
                    ],
                    phone1: [
                        {required: true, message: '请输入正确的手机号'},
                        {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号'}
                    ],
                    phone2: [
                        {required: false, message: '请输入正确的手机号'},
                        {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号'}
                    ],
                },
                formLabelWidth: '80px',
                postUrl: uploadAvatarUrl, // 提交头像的url
            }
        },
        mounted() {

        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.consultForm.avatarUrl = res //URL.createObjectURL(file.raw);   file.response
            },
            // 限制图片格式
            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/png" || file.type === "image/jpeg";
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isJPG) {
                    this.$message.error('只能上传jpg/png文件，请重新选择文件');
                }
                if (!isLt1M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                }
                return isJPG && isLt1M;
            },
            onAddItemSubmit() {
            },
            resetAddItemWithDialog() {
            },
        }
    }
</script>

<style scoped>
  .bg {
    background-image: linear-gradient(to bottom right, #00a2ff, blue);
    /*background-color: blue;*/
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .roundBg {
    overflow: hidden;
    border-radius: 26px;
    background-color: #fff;
    margin: 40px 10px;
  }

  .el_input_width {
    width: 90% !important;
  }

  .margin_top_10 {
    margin-top: 10px;
  }

  .el-form-item {
    margin-bottom: 15px !important;
  }
  .avatar-uploader {
    width: 162px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    line-height: 85px;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  .avatar {
    width: 100%;
    height: 100%;
    /*width: 80px;*/
    /*height: 80px;*/
    /*display: block;*/
  }
  .avatar-uploader{
    width: auto;
    height: 122px !important;
  }

</style>
