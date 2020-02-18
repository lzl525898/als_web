<template>
  <el-container :style="{height:height+'px'}">
    <el-main class="container-wrapper">
      <el-card class="card-center-wrapper">
        <div class="card-title">奥松<span>云课堂</span>APE</div>
        <div class="card-title small">直播课堂</div>
        <el-form ref="form" :rules="rules" :model="form" style="margin-top: 20px">
          <el-form-item prop="code">
            <el-input
              v-model="form.code"
              placeholder="参加码"
              prefix-icon="el-icon-postcard"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input
              v-model="form.name"
              placeholder="姓名"
              prefix-icon="el-icon-user"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')" style="width:100%">登 录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
    import promptUtil from '../../../utils/promptUtil'
    import {
        qs,
        reqWebClient
    } from '../../../api/api'
    import '../../../api/restfulapi'
    export default {
        name: "intoLive",
        data(){
            const validateCode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('参加码不能为空'));
                }
                if(value){
                    if(value.trim()==''){
                        return callback(new Error('参加码不能为空'));
                    }
                }
                callback();
            }
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('姓名不能为空'));
                }
                if(value){
                    if(value.trim()==''){
                        return callback(new Error('姓名不能为空'));
                    }
                }
                callback();
            }
            return {
                height: 0,
                form:{code:'',name:''},
                rules: {
                    code: [
                        { validator: validateCode, trigger: 'blur' }
                    ],
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.height =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;
        },
        mounted() {
            window.onresize = ()=>{
                this.height =
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
            }
        },
        methods:{
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const loading = promptUtil.loading(this)
                        const {code, name} = this.form
                        reqWebClient(qs.stringify({
                            code: code,
                            name: name
                        })).then(res=>{
                            if(res.code==SUCCESS_CODE){
                                this.$refs[formName].resetFields();
                                window.open("baijiacloud://")
                                window.location.replace(res.data.web_url)
                            }else{
                                promptUtil.warning(this,res.msg)
                            }

                            loading.close()
                        }).catch(err=>{
                            promptUtil.LOG("reqWebClient-err",err)
                            loading.close()
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
  .container-wrapper {
    position: relative;
    background: url("../../../../static/images/base/index/newLoginBg.png") no-repeat;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card-center-wrapper {
    width: 400px;
    height: 320px;
    border-radius: 18px;
  }
  .card-title{
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    color: #707070;
  }
  .card-title span{
    color:#31A4FA;
  }
  .small {
    font-size: 24px;
    line-height: 36px;
  }
</style>
