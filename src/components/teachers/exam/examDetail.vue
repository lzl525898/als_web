<template>
    <div>
      <als-exam-dialog ref="alsExamJudgDialog"/>
    </div>
</template>

<script>
  import staticUtil from '../../../utils/staticUtil'
  import promptUtil from '../../../utils/promptUtil'
  import examJudgingDialog from '../../component/examJudgingDialog'
  import '../../../api/restfulapi'
  import {
    qs,
    getExamAnalysis
  } from '../../../api/api'
  export default {
    name: "examDetail",
    components:{'als-exam-dialog':examJudgingDialog},
    mounted(){
      if(this.$route.params.id){
        const loading = promptUtil.loading(this)
        getExamAnalysis(qs.stringify({
          id: this.$route.params.id
        })).then(res=>{
          try{
            const examData = {examStatus: {status:'',content:''}, serverAnswers: "", answers:'',title:'',stuName:''}
            examData.stuName = res.data.student_name
            examData.title = res.data.title
            examData.examStatus.status=res.data.jige
            examData.examStatus.content=res.data.jige_text
            if(res.data.answer && res.data.answer!=''){
              examData.serverAnswers = res.data.answer
              examData.answers = staticUtil.clone(res.data.answer)
            }else{
              examData.serverAnswers = res.data.detail
              examData.answers = staticUtil.clone(res.data.detail)
            }
            loading.close()
            this.$refs.alsExamJudgDialog.show(examData)
          }catch (e) {
            promptUtil.warning(this,'请稍后再试...')
            loading.close()
          }
        }).catch(err=>{
          promptUtil.LOG('getExamAnalysis-err',err)
          loading.close()
        })
      }else{
        window.close()
      }
    },
  }
</script>

<style scoped>

</style>
