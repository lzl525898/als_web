<template>
  <div style="background-color:#eff3f7;">
    <el-dialog :visible.sync="dialogVisible" fullscreen @open="previewExamEvent" @opened="openExamEvent"
               @close="closeExamEvent" style="background-color:#eff3f7;" :show-close="false">
      <div slot="title" class="title_header_wrapper">
        <el-row>
          <el-col :span="12">
            <div class="title_header_left">
              <div class="title_header_school">{{schoolName}}</div>
              <div class="title_header_exam">{{examName}}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="title_header_right">
              <div style="margin-right:40px;"><i class="el-icon-s-custom" style="color:#00a2ff"></i><span style="margin-left:20px;">{{studentName}}</span></div>
              <el-button type="primary" plain icon="el-icon-switch-button" style="width:100px;" @click="exitExam">退出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="examin_finished_container" >
        <div class="examin_finished_left_wrapper">
          <div style="display: flex;margin-top:20px;margin-left:20px;">
            <div style="height: 20px;width: 4px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;font-size:18px;font-weight:bold;color:#3A3E51">答题卡</div>
          </div>
          <div>
            <div v-if="answers.single&&answers.single.length>0">
              <div class="examin_types">单选题</div>
              <div class="examin_list_box">
                <div class="examin_item" v-for="(answer,index) in answers.single" :key="index">
                  <div :class="selectFinishedQuestion(answer)" @click="moveToTargetFinishQuestion(1,answer)">{{answer.question_index}}</div>
                  <div v-show="answer.collect==1" class="examin_point"></div>
                </div>
              </div>
              <div class="line_divider"></div>
            </div>
            <div v-if="answers.multiple&&answers.multiple.length>0">
              <div class="examin_types">多选题</div>
              <div class="examin_list_box">
                <div class="examin_item" v-for="(answer,index) in answers.multiple" :key="index">
                  <div :class="selectFinishedQuestion(answer)" @click="moveToTargetFinishQuestion(2,answer)">{{answer.question_index}}</div>
                  <div v-show="answer.collect==1" class="examin_point"></div>
                </div>
              </div>
              <div class="line_divider"></div>
            </div>
            <div v-if="answers.judge&&answers.judge.length>0">
              <div class="examin_types">判断题</div>
              <div class="examin_list_box">
                <div class="examin_item" v-for="(answer,index) in answers.judge" :key="index">
                  <div :class="selectFinishedQuestion(answer)" @click="moveToTargetFinishQuestion(3,answer)">{{answer.question_index}}</div>
                  <div v-show="answer.collect==1" class="examin_point"></div>
                </div>
              </div>
              <div class="line_divider"></div>
            </div>
          </div>
          <div class="examin_finished_left_wrapper_footer">
            <div style="height:15px;border-radius:50%;width:15px;background-color:#409EFF"></div><span style="margin-left: 5px;">正确</span>
            <div style="height:13px;border-radius:50%;width:15px;background-color:#ff0000;margin-left:15px;"></div><span style="margin-left: 5px;">错误</span>
            <div style=" background: #FE8545!important;border-radius: 100%; width: 5px!important; height: 5px!important;margin-left:15px;"></div><span style="margin-left: 5px;margin-right: 20px">收藏</span>
          </div>
        </div>
        <div class="examin_finished_center_wrapper">
          <div>
            <div class="examin_questions_title">{{getFinishedQuestionTitleContent(1)}}</div>
            <div v-if="answers.single&&answers.single.length>0">
              <div class="examin_questions_content">
                <div class="examin_question_content" v-for="(answer,index) in answers.single" :key="index" :id="'exam_finished_question_1_'+answer.question_index">
                  <div class="examin_question_title">
                    <span class="examin_question_index examin_question_ellipsis">{{answer.question_index}}.</span>{{answer.question_content}}({{answer.question_score}}分)
                    <div style="position:absolute;top: 0;right:0px;">
                      <el-tooltip effect="dark" :content="getFinishedQuestionCollect(answer)" placement="top">
                        <i :class="selectQuestionCollect(answer)" @click="setCurrentQuestionCollect(1,answer)"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="examin_answers">
                    <el-radio-group v-model="answer.student_answer" style="display:flex;flex-direction:column;">
                      <el-radio :label="answerItem.index" class="answer_finished_select" v-for="(answerItem,indexAnswer) in answer.answers" :key="indexAnswer" disabled>
                        <span class="words"><span class="words-option">{{answerItem.option}}. </span>{{answerItem.content}}</span>
                      </el-radio>
                    </el-radio-group>
                  </div>
                  <div class="examin_analysis">
                    <div style="display:flex;align-items:center;">
                      <div style="flex:1">考生答案:
                        <span v-if="answer.right_answer==1" style="margin-left:5px;color:#409EFF">{{answer.student_content}}</span>
                        <span v-else style="margin-left:5px;color:#ff0000">{{answer.student_content==-1 ? '': answer.student_content}}</span>
                      </div>
                      <div style="display:flex;justify-content:flex-end;align-items:center;flex:1">
                        <el-tag v-if="answer.right_answer==1" effect="dark">正确</el-tag>
                        <el-tag v-else effect="dark" type="danger">错误</el-tag>
                      </div>
                    </div>
                    <div style="margin-top:5px;">正确答案:<span style="margin-left:5px;">{{answer.right_content}}</span></div>
                    <div style="margin-top:5px;">解释说明:<span style="margin-left:5px;">{{answer.analysis}}</span></div>
                  </div>
                  <div style="border: none;height:1px;background-color: #e6e6e6;margin-bottom:-32px;margin-top: 20px;"></div>
                </div>
              </div>
            </div>
            <div class="examin_questions_title">{{getFinishedQuestionTitleContent(2)}}</div>
            <div v-if="answers.multiple&&answers.multiple.length>0">
              <div class="examin_questions_content">
                <div class="examin_question_content" v-for="(answer,index) in answers.multiple" :key="index" :id="'exam_finished_question_2_'+answer.question_index">
                  <div class="examin_question_title">
                    <span class="examin_question_index examin_question_ellipsis">{{answer.question_index}}.</span>{{answer.question_content}}({{answer.question_score}}分)
                    <div style="position:absolute;top: 0;right:0px;">
                      <el-tooltip effect="dark" :content="getFinishedQuestionCollect(answer)" placement="top">
                        <i :class="selectQuestionCollect(answer)" @click="setCurrentQuestionCollect(1,answer)"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="examin_answers">
                    <el-checkbox-group v-model="answer.student_answer" style="display:flex;flex-direction:column;">
                      <el-checkbox :label="answerItem.index" class="answer_finished_select" v-for="(answerItem,indexAnswer) in answer.answers" :key="indexAnswer" disabled>
                        <span class="words"><span class="words-option">{{answerItem.option}}. </span>{{answerItem.content}}</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="examin_analysis">
                    <div style="display:flex;align-items:center;">
                      <div style="flex:1">考生答案:
                        <span v-if="answer.right_answer==1" style="margin-left:5px;color:#409EFF">{{answer.student_content}}</span>
                        <span v-else style="margin-left:5px;color:#ff0000">{{answer.student_content==-1 ? '': answer.student_content}}</span>
                      </div>
                      <div style="display:flex;justify-content:flex-end;align-items:center;flex:1">
                        <el-tag v-if="answer.right_answer==1" effect="dark">正确</el-tag>
                        <el-tag v-else effect="dark" type="danger">错误</el-tag>
                      </div>
                    </div>
                    <div style="margin-top:5px;">正确答案:<span style="margin-left:5px;">{{answer.right_content}}</span></div>
                    <div style="margin-top:5px;">解释说明:<span style="margin-left:5px;">{{answer.analysis}}</span></div>
                  </div>
                  <div style="border: none;height:1px;background-color: #e6e6e6;margin-bottom:-32px;margin-top: 20px;"></div>
                </div>
              </div>
            </div>
            <div class="examin_questions_title">{{getFinishedQuestionTitleContent(3)}}</div>
            <div v-if="answers.judge&&answers.judge.length>0">
              <div class="examin_questions_content">
                <div class="examin_question_content" v-for="(answer,index) in answers.judge" :key="index" :id="'exam_finished_question_3_'+answer.question_index">
                  <div class="examin_question_title">
                    <span class="examin_question_index examin_question_ellipsis">{{answer.question_index}}.</span>{{answer.question_content}}({{answer.question_score}}分)
                    <div style="position:absolute;top: 0;right:0px;">
                      <el-tooltip effect="dark" :content="getFinishedQuestionCollect(answer)" placement="top">
                        <i :class="selectQuestionCollect(answer)" @click="setCurrentQuestionCollect(1,answer)"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="examin_answers">
                    <el-radio-group v-model="answer.student_answer" style="display:flex;flex-direction:column;">
                      <el-radio :label="answerItem.index" class="answer_finished_select" v-for="(answerItem,indexAnswer) in answer.answers" :key="indexAnswer" disabled>
                        <span class="words"><span class="words-option">{{answerItem.option}}. </span>{{answerItem.content}}</span>
                      </el-radio>
                    </el-radio-group>
                  </div>
                  <div class="examin_analysis">
                    <div style="display:flex;align-items:center;">
                      <div style="flex:1">考生答案:
                        <span v-if="answer.right_answer==1" style="margin-left:5px;color:#409EFF">{{answer.student_content}}</span>
                        <span v-else style="margin-left:5px;color:#ff0000">{{answer.student_content==-1 ? '': answer.student_content}}</span>
                      </div>
                      <div style="display:flex;justify-content:flex-end;align-items:center;flex:1">
                        <el-tag v-if="answer.right_answer==1" effect="dark">正确</el-tag>
                        <el-tag v-else effect="dark" type="danger">错误</el-tag>
                      </div>
                    </div>
                    <div style="margin-top:5px;">正确答案:<span style="margin-left:5px;">{{answer.right_content==1?'正确':'错误'}}</span></div>
                    <div style="margin-top:5px;">解释说明:<span style="margin-left:5px;">{{answer.analysis}}</span></div>
                  </div>
                  <div style="border: none;height:1px;background-color: #e6e6e6;margin-bottom:-32px;margin-top: 20px;"></div>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-top:2px;height: 60px;display:flex;align-items: center;justify-content: center;background-color: #eff3f7;border: unset">奥松智能 提供支持</div>
        </div>
        <div class="examin_right_wrapper">
          <div class="item_label">考试成绩</div>
          <div style="align-items:center;justify-content:center;margin-top:5px;display:flex;font-size: 18px;color: #F00;font-weight: 500;">{{getFinishedExamScore()}}</div>
          <div class="item_divider" style="margin-top:6px"></div>
          <div class="item_label">考试状态</div>
          <div style="align-items:center;justify-content:center;margin-top:5px;display:flex;font-size: 14px;font-weight: 500;">
            <span v-if="examStatus.status==1" style="color:#409EFF">{{examStatus.content}}</span>
            <span v-else style="color:#ff0000">{{examStatus.content}}</span>
          </div>
          <div class="item_divider" style="margin-top:8px"></div>
          <div class="item_label" >筛选试题</div>
          <div style="display:flex;justify-content:center;margin-top:6px;">
            <el-dropdown @command="onCommandExamType">
              <span class="el-dropdown-link">
                {{questionFilter.label}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" placement="bottom">
                <el-dropdown-item divided command="all"><span v-show="questionFilter.status==1" style="color:#409EFF">全部</span><span v-show="questionFilter.status!=1">全部</span></el-dropdown-item>
                <el-dropdown-item divided command="ok"><span v-show="questionFilter.status==2" style="color:#409EFF">答对</span><span v-show="questionFilter.status!=2">答对</span></el-dropdown-item>
                <el-dropdown-item divided command="no"><span v-show="questionFilter.status==3" style="color:#409EFF">答错</span><span v-show="questionFilter.status!=3">答错</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="item_divider" style="margin-top:8px"></div>
          <div style="display:flex;justify-content:center;align-items:center;margin-top:15px;margin-bottom:15px">
            <el-button type="primary" style="width:100px" @click="onClickBack">返回</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'
  import promptUtil from '../../utils/promptUtil'
  import storageUtil from '../../utils/storageUtil'
  import staticUtil from '../../utils/staticUtil'
  export default {
    name: "examJudgingDialog",
    data(){
      return{
        dialogVisible:false,
        examName:'',
        schoolName:'',
        studentName:'',
        mainWidth: '',
        baseHeight: '',
        questionFilter: {status:1,label:'全部'},
        examStatus:{status:0,content:'未通过'},
        serverAnswers:{},
        answers:{},
      }
    },
    created(){
      let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      this.baseHeight = windowHeight - 100
      this.mainWidth = windowWidth - 520
    },
    mounted(){
      window.onresize = () => {
        this.baseHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 100
        this.mainWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 520
        $(".examin_finished_container").css("minHeight",this.baseHeight+100)
        $(".examin_finished_left_wrapper").height(this.baseHeight).width(240)
        $(".examin_finished_center_wrapper").width(this.mainWidth)
      }
    },
    methods:{
      initStyle(){
        $(".el-dialog").css("backgroundColor","#eff3f7")
        $(".el-dialog__header").css("margin",0).css("padding",0)
        $(".el-dialog__body").css("margin",0).css("padding",0).css("backgroundColor","#eff3f7")
        for(let i=0;i<10;i++) {
          setTimeout(() => {
            $(".examin_finished_container").css("minHeight", this.baseHeight + 100)
            $(".examin_finished_left_wrapper").height(this.baseHeight).width(240)
            $(".examin_finished_center_wrapper").width(this.mainWidth)
          }, 10 + 10 * i)
        }
      },
      show(data){
        this.schoolName = storageUtil.readTeacherInfo().school_name
        this.examStatus = {status:data.examStatus.status,content:data.examStatus.content},
        this.serverAnswers = data.serverAnswers
        this.answers = data.answers
        this.examName = data.title
        this.studentName = data.stuName
        this.dialogVisible = true
      },
      hide(){
        this.closeExamEvent()
      },
      exitExam(){
        window.close()
      },
      onClickBack(){
        window.close()
      },
      closeExamEvent(){
        this.examName=''
        this.schoolName=''
        this.studentName=''
        this.mainWidth= ''
        this.baseHeight=''
        this.questionFilter={status:1,label:'全部'}
        this.examStatus={status:0,content:'未通过'}
        this.serverAnswers={}
        this.answers={}
        this.dialogVisible =false
      },
      openExamEvent(){
        this.initStyle()
      },
      previewExamEvent() {
        this.initStyle()
      },
      moveToTargetFinishQuestion(type,item){
        const targetId =  "#exam_finished_question_" + type + "_" +  item.question_index
        const offsetTop = $(targetId).position().top
        document.getElementsByClassName('examin_finished_container')[0].scrollTo(0,offsetTop)
      },
      getFinishedQuestionCollect(item){
        if(item.collect&&item.collect==1){
          return '取消收藏'
        }else{
          return '收藏本题'
        }
      },
      selectFinishedQuestion(item){
        if(item.right_answer==0){
          return 'examin_button answer_error'
        }else{
          return 'examin_button answer_right'
        }
      },
      selectQuestionCollect(item){
        if(item.collect&&item.collect==1){
          return 'el-icon-star-on examin_tag_ok'
        }else{
          return 'el-icon-star-on examin_tag_no'
        }
      },
      // 设置试题收藏
      setCurrentQuestionCollect(type,item){
        console.log("设置试题收藏coding....",type,item)
        if(type==1){
          this.answers.single[item.question_index-1].collect = !item.collect
        }else if(type==2){
          this.answers.multiple[item.question_index-1].collect = !item.collect
        }else if(type==3){
          this.answers.judge[item.question_index-1].collect = !item.collect
        }
        promptUtil.warning(this,'敬请期待...')
      },
      // 计算已完成试题数量
      computeFinishedQuestionCount(type){
        if(type==1){
          if(this.answers && this.answers.single && this.answers.single.length>0){
            return this.answers.single.length
          }else{
            return 0
          }
        }else if(type==2){
          if(this.answers && this.answers.multiple && this.answers.multiple.length>0){
            return this.answers.multiple.length
          }else{
            return 0
          }
        }else if(type==3){
          if(this.answers && this.answers.judge && this.answers.judge.length>0){
            return this.answers.judge.length
          }else{
            return 0
          }
        }
      },
      // 计算已完成试题分数
      computeFinishedQuestionScore(type){
        let allScore = 0.0
        if(type==1){
          if(this.answers.single&&this.answers.single.length>0){
            this.answers.single.map(item=>{
              allScore = allScore + item.question_score*1
            })
          }
        }else if(type==2){
          if(this.answers.multiple&&this.answers.multiple.length>0){
            this.answers.multiple.map(item=>{
              allScore = allScore + item.question_score*1
            })
          }
        }else if(type==3){
          if(this.answers.judge&&this.answers.judge.length>0){
            this.answers.judge.map(item=>{
              allScore = allScore + item.question_score*1
            })
          }
        }
        return (allScore*1).toFixed(1)
      },
      // 返回已完成作答的标题内容
      getFinishedQuestionTitleContent(type){
        if(type==1){
          return "单选题（共"+this.computeFinishedQuestionCount(type)+"题，合计"+this.computeFinishedQuestionScore(type)+"分）"
        }else if (type==2){
          return "多选题（共"+this.computeFinishedQuestionCount(type)+"题，合计"+this.computeFinishedQuestionScore(type)+"分，漏选错选不得分）"
        }else if (type==3){
          return "判断题（共"+this.computeFinishedQuestionCount(type)+"题，合计"+this.computeFinishedQuestionScore(type)+"分）"
        }
      },
      getFinishedExamScore(){
        let result = 0
        if(this.answers.single && this.answers.single.length && this.answers.single.length>0){
          this.answers.single.map(item=>{
            if(item.right_answer==1){
              result = result + item.question_score*1
            }
          })
        }
        if(this.answers.multiple && this.answers.multiple.length && this.answers.multiple.length>0){
          this.answers.multiple.map(item=>{
            if(item.right_answer==1){
              result = result + item.question_score*1
            }
          })
        }
        if(this.answers.judge && this.answers.judge.length && this.answers.judge.length>0){
          this.answers.judge.map(item=>{
            if(item.right_answer==1){
              result = result + item.question_score*1
            }
          })
        }
        return (result*1).toFixed(1)
      },
      onCommandExamType(val){
        if(val=='all'){
          this.questionFilter.status = 1
          this.questionFilter.label = '全部'
          this.answers = staticUtil.clone(this.serverAnswers)
        }else if (val=='ok'){
          this.questionFilter.status = 2
          this.questionFilter.label = '答对'
          this.filterQuestions(1)
        }else if (val=='no'){
          this.questionFilter.status = 3
          this.questionFilter.label = '答错'
          this.filterQuestions(0)
        }
      },
      filterQuestions(type){ // type 1 正确的 0 错误的
        const tmpSingle = []
        const tmpMultiple = []
        const tmpJudge = []
        this.answers = staticUtil.clone(this.serverAnswers)
        if(this.answers.single && this.answers.single.length && this.answers.single.length>0){
          this.answers.single.map(item=>{
            if(item.right_answer==type){
              tmpSingle.push(item)
            }
          })
        }
        if(this.answers.multiple && this.answers.multiple.length && this.answers.multiple.length>0){
          this.answers.multiple.map(item=>{
            if(item.right_answer==type){
              tmpMultiple.push(item)
            }
          })
        }
        if(this.answers.judge && this.answers.judge.length && this.answers.judge.length>0){
          this.answers.judge.map(item=>{
            if(item.right_answer==type){
              tmpJudge.push(item)
            }
          })
        }
        this.answers.single = tmpSingle
        this.answers.multiple = tmpMultiple
        this.answers.judge = tmpJudge
      }
    }
  }
</script>

<style scoped>
  .title_header_wrapper{
    position: fixed;
    top: 0px;
    height: 79px;
    width: 100%;
    background: #eff3f7;
    z-index: 9999;
  }
  .title_header_left{
    display:flex;
    padding-left: 60px;
    align-items: center;
    height: 60px;
    box-shadow:0px 15px 10px -15px rgba(58,62,81,0.10);
  }
  .title_header_right{
    display:flex;
    justify-content:flex-end;
    align-items: center;
    padding-right: 60px;
    height: 60px;
    box-shadow:0px 15px 10px -15px rgba(58,62,81,0.10);
  }
  .title_header_school{
    font-size: 22px;
  }
  .title_header_exam{
    margin-left: 30px;
    font-size: 22px;
  }
  .examin_finished_container{
    background-color: #eff3f7;
    border: unset;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .examin_finished_left_wrapper{
    position: fixed;
    top: 80px;
    background-color: #fff;
    width: 240px;
    margin-left: 60px;
    border-radius: 3px;
    box-shadow:1px 1px 1px rgba(58,62,81,0.10),1px -1px 1px rgba(58,62,81,0.10),-1px 1px 1px rgba(58,62,81,0.10),-1px -1px 1px rgba(58,62,81,0.10);
  }
  .examin_finished_left_wrapper_footer{
    border:unset;
    position:absolute;
    bottom:0;
    width:100%;
    display:flex;
    justify-content:flex-end;
    align-items:center;
    height:40px;
    box-shadow: 0 -2px 10px 0 rgba(58,62,81,0.10);
  }
  .examin_finished_center_wrapper{
    border: unset;
    position: absolute;
    top: 80px;
    margin-left: 320px;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid rgba(58,62,81,0.10);
  }
  .examin_right_wrapper{
    position: fixed;
    top:80px;
    right: 60px;
    background-color: #fff;
    width: 120px;
    margin-left: 60px;
    border-radius:3px;
    box-shadow:1px 1px 1px rgba(58,62,81,0.10),1px -1px 1px rgba(58,62,81,0.10),-1px 1px 1px rgba(58,62,81,0.10),-1px -1px 1px rgba(58,62,81,0.10);
  }
  .examin_types{
    margin: 20px 20px 15px 20px;
    color: #333;
    font-size: 13px;
    font-weight: 600;
  }
  .examin_list_box{
    display: flex;
    margin-left:20px;
    margin-right:20px;
    flex-flow:wrap;
    justify-content: flex-start;
  }
  .examin_item{
    position:relative;
  }
  .item_label{
    color:#333;
    text-align: center;
    line-height:20px;
    font-weight:400;
    margin-top:14px;
  }
  .line_divider{
    margin: 0 20px;
    border:none;
    height:1px;
    background-color:#B4B6BD;
  }
  .examin_point{
    position: absolute;
    top:30px;
    left: 11px;
    background: #FE8545!important;
    border-radius: 100%;
    width: 5px!important;
    height: 5px!important;
  }
  .examin_questions_title{
    font-size: 18px;
    line-height: 25px;
    padding: 18px 20px;
    background: #FAFAFA;
    border-bottom: 1px solid #DEDEDE;
  }
  .examin_questions_content{
    padding-left: 30px;
    padding-right: 75px;
  }
  .examin_question_content{
    padding: 30px 0;
    position: relative;
  }
  .examin_question_title{
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
  }
  .examin_question_index{
    color: #409EFF;
    position: absolute;
    left: -25px;
    top: 0;
    display: inline-block;
    width: 40px;
    line-height: 22px;
    text-align: right;
  }
  .examin_question_ellipsis{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }.examin_answers{
     overflow: auto;
   }
  .answer_finished_select{
    padding-left: 12px;
    margin-right: 0px;
    height:40px;
    line-height: 40px;
  }
  .answer_finished_select:hover{
    cursor: pointer;
  }
  .examin_analysis{
    background: rgba(222,222,222,0.2);
    border-radius: 4px;
    padding: 15px 20px;
    line-height: 24px;
    margin-top: 10px;
  }
  .examin_button{
    width:25px;
    height:25px;
    text-align: center;
    font-weight:600;
    color: #B4B6BD;
    line-height: 24px;
    border: 1px solid #B4B6BD;
    border-radius: 50%;
    margin-bottom:15px;
    margin-right:6px;
  }
  .examin_button:hover{
    cursor: pointer;
  }
  .answer_right {
    background-color: #409EFF;
    border-color: #409EFF;
    color: #fff;
  }
  .answer_error {
    background-color: #ff0000;
    border-color: #ff0000;
    color: #fff;
  }
</style>
