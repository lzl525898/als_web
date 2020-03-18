<template>
    <div class="no-auth-wrapper" :style="{height:height+'px',width:width+'px',position:'absolute',border:'none',top:'60px',left:'220px'}">
      <div :style="{display:'flex',justifyContent:'center',flex:'1',height:(imgHeight-30)+'px'}">
        <img src="../../../static/images/base/no_auth_bg.png" :style="{height:imgHeight+'px',width:imgWidth+'px',marginTop:'30px'}"/>
      </div>
      <div class="no-auth-content">
        <div class="no-auth-title">尚未开通此功能，请联系客服进行开通</div>
        <div class="no-auth-chat">
          <el-popover
            placement="bottom"
            width="150"
            trigger="hover">
            <div>
              <img :src='callUs.img' alt="" style="width: 150px">
              <p style="text-align: center">{{callUs.tel}} </p>
            </div>
            <div slot="reference" class="no-auth-consult-item no-auth-btn-advice" type="primary" plain>
              <i class="el-icon-service"/><span style="margin-left: 5px">咨询</span>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
</template>

<script>
    import {qs,getSchoolDueInfo} from '../../api/api'
    import storageUtil from '../../utils/storageUtil'
    import promptUtil from '../../utils/promptUtil'
    export default {
        name: "noAuthContent",
        data() {
            return {
                width: 0,
                height: 0,
                imgWidth: 0,
                imgHeight: 0,
                callUs: {img:'',tel:''}
            }
        },
        created() {
            let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            this.width = width -220
            this.height = height -60
            this.imgWidth = this.width * 0.8
            this.imgHeight = this.height * 0.8
        },
        mounted() {
            getSchoolDueInfo(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
                user_id: storageUtil.readTeacherInfo().id
            })).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        this.callUs.tel = res.data.tel
                        this.callUs.img = res.data.qrcode
                    }
                }
            }).catch(err => {
                promptUtil.LOG('getSchoolDueInfo-err', err)
            })
            window.onresize = ()=>{
                let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                this.width = width-220
                this.height = height -60
                this.imgWidth = this.width * 0.8
                this.imgHeight = this.height * 0.8
            }
        }
    }
</script>

<style scoped>
  .no-auth-wrapper{
    background: -webkit-gradient(linear, left top, right top, from(#F2F6FC), to(#DCDFE6));
    background: -webkit-linear-gradient(left, #F2F6FC 0%, #DCDFE6 100%);
    background: -o-linear-gradient(left, #F2F6FC 0%, #DCDFE6 100%);
    background: linear-gradient(90deg, #F2F6FC 0%, #DCDFE6 100%);
  }
  .no-auth-content{
    margin-top: -130px;
    height: 200px;
    width: 100%;
  }
  .no-auth-title{
    color: #909399;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
  }
  .no-auth-chat{
    padding-top: 60px;
    display: flex;
    justify-content: center;
  }
  .no-auth-consult-item{
    width: 170px;
    height: 56px;
    border: 1px solid #23b8ff;
    border-radius: 5px;
    line-height: 56px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
  }
  .no-auth-btn-advice{
    display: flex;
    align-items: center;
    justify-content: center;
    color: #23b8ff;
    cursor: pointer;
  }
</style>
