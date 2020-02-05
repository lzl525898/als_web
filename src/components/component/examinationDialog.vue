<template>
  <div style="background-color:#eff3f7;">
    <el-dialog :visible.sync="dialogVisible" fullscreen @open="previewExamEvent" @opened="openExamEvent" @close="closeExamEvent"
               :close-on-click-modal="false" :close-on-press-escape="false" style="background-color:#eff3f7;" :show-close="false">
      <el-dialog
        top="40vh"
        width="24%"
        :show-close="false"
        :visible.sync="submitVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        @open="previewExamSubmitEvent"
        append-to-body>
        <div class="submit_dialog" style="background: #fff;position: absolute;top:-30px;left:0;border-radius:5px;">
          <div style="text-align:center;font-size:24px;font-weight:500;line-height:40px;padding-top:20px;">交卷中</div>
          <div style="margin: 20px 40px 0 40px">
            <el-progress :percentage="submitProgress"></el-progress>
          </div>
          <div style="display:flex;flex-direction:column;justify-content:center;padding-top:40px;padding-bottom:40px;">
              <div v-show="submitProgress<=30" style="display:flex;flex:1;justify-content:center;align-items:center;color: gray">正在提交答案...</div>
              <div v-show="submitProgress<=80 && submitProgress>30" style="display:flex;flex:1;justify-content:center;align-items:center;color: gray">正在判分中...</div>
              <div v-show="submitProgress<=100 && submitProgress>80" style="display:flex;flex:1;justify-content:center;align-items:center;color: gray">正在出分中...</div>
            </div>
        </div>
      </el-dialog>
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
      <div v-if="isExamFinish==1" class="exmain_finish_container">
        <div class="exmain_finish_wrapper">
          <div class="exmain-div-wrapper">
            <el-avatar class="user_avatar" :src="studentAvatar" :size="80"></el-avatar>
            <el-card class="exmain-card">
              <div style="font-size:26px;font-weight:600;text-align:center;margin-top:35px;">{{studentName}}</div>
              <div class="exam_result_score">
                <img style="width:14px;height:17px;position: absolute;top:50px;left:220px" src="../../../static/images/base/exam/p_img_star1.png" alt/>
                <span class="score">{{(submitPaperDetail.score*1).toFixed(1)}}</span>
                <span>分</span>
                <img style="width:10px;height:12px;position: absolute;top:10px;left:340px" src="../../../static/images/base/exam/p_img_star2.png" alt/>
              </div>
              <div style="margin:20px 30px 10px 30px;display:flex;justify-content:center">考试评语:{{submitPaperDetail.comment}}</div>
              <div class="exam-result-percentage">{{submitPaperDetail.acc}}%</div>
              <div style="display:flex;justify-content:center;align-items:center;margin-top:10px;">
                <img src="../../../static/images/base/exam/p_icon_accuracy_rate.svg"/>
                <span style="margin-left: 10px;">正确率</span>
              </div>
              <als-exam-rank ref="alsExamRank"></als-exam-rank>
            </el-card>
            <div style="display:flex;justify-content:center;align-items:center;color:#fff;margin-top:15px;">
              <span style="font-size:14px;">奥松智能</span><span style="margin-left:10px;font-size:12px;">提供技术支持</span>
            </div>
            <el-button style="position: absolute;right:-110px;bottom:44px;" @click="onClickReExam" :loading="isReExamLoading">再考一次</el-button>
            <el-button style="position: absolute;right:-110px;bottom:94px;" @click="onClickExamDetail">查看试卷</el-button>
          </div>
        </div>
      </div>
      <div v-if="isExamFinish==0" class="examin_container">
        <div class="examin_left_wrapper">
          <div style="display: flex;margin-top:20px;margin-left:20px;">
            <div style="height: 20px;width: 4px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;font-size:18px;font-weight:bold;color:#3A3E51">答题卡</div>
          </div>
          <div>
            <div v-if="questions.single&&questions.single.length>0">
              <div class="examin_types">{{getQuestionTitleContent(1)}}</div>
              <div class="examin_list_box">
                <div class="examin_item" v-for="(question,index) in questions.single" :key="index">
                  <div :class="selectQuestion(question)" @click="moveToTargetQuestion(1,question)">{{question.question_index}}</div>
                  <div v-show="question.tag==1" class="examin_point"></div>
                </div>
              </div>
              <div class="line_divider"></div>
            </div>
            <div v-if="questions.multiple&&questions.multiple.length>0">
              <div class="examin_types">{{getQuestionTitleContent(2)}}</div>
              <div class="examin_list_box">
                <div class="examin_item" v-for="(question,index) in questions.multiple" :key="index">
                  <div :class="selectQuestion(question)" @click="moveToTargetQuestion(2,question)">{{question.question_index}}</div>
                  <div v-show="question.tag==1" class="examin_point"></div>
                </div>
              </div>
              <div class="line_divider"></div>
            </div>
            <div v-if="questions.judge&&questions.judge.length>0">
              <div class="examin_types">{{getQuestionTitleContent(3)}}</div>
              <div class="examin_list_box">
                <div class="examin_item" v-for="(question,index) in questions.judge" :key="index">
                  <div :class="selectQuestion(question)" @click="moveToTargetQuestion(3,question)">{{question.question_index}}</div>
                  <div v-show="question.tag==1" class="examin_point"></div>
                </div>
              </div>
              <div class="line_divider"></div>
            </div>
          </div>
          <div class="examin_left_wrapper_footer">
            <div style="height:15px;border-radius:50%;width:15px;background-color:#409EFF"></div><span style="margin-left: 5px;">已答</span>
            <div style="height:13px;border-radius:50%;width:13px;background-color:#fff;border:1px solid rgb(180, 182, 189);margin-left:15px;"></div><span style="margin-left: 5px;">未答</span>
            <div style=" background: #FE8545!important;border-radius: 100%; width: 5px!important; height: 5px!important;margin-left:15px;"></div><span style="margin-left: 5px;margin-right: 20px">标记</span>
          </div>
        </div>
        <div class="examin_center_wrapper">
          <div>
            <div v-if="questions.single&&questions.single.length>0">
              <div class="examin_questions_title">{{getQuestionTitleContent(1)}}</div>
              <div class="examin_questions_content">
                <div class="examin_question_content" v-for="(question,index) in questions.single" :key="index" :id="getQuestionItemId(1,question)">
                  <div class="examin_question_title">
                    <span class="examin_question_index examin_question_ellipsis">{{question.question_index}}.</span>{{question.question_content}}({{question.question_score}}分)
                    <div style="position:absolute;top: 0;right:0px;">
                      <el-tooltip effect="dark" :content="getQuestionTag(question)" placement="top">
                        <i :class="selectQuestionTag(question)" @click="setCurrentQuestionTag(1,question)"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="examin_answers">
                    <el-radio-group v-model="question.select_answer" @change="onChangeSingle" style="display:flex;flex-direction:column;">
                      <el-radio :label="answer.index" class="answer_select" v-for="(answer,indexAnswer) in question.answers" :key="indexAnswer">
                        <span class="words"><span class="words-option">{{answer.option}}. </span>{{answer.content}}</span>
                      </el-radio>
                    </el-radio-group>
                  </div>
                  <div style="border: none;height:1px;background-color: #e6e6e6;margin-bottom:-32px;margin-top: 20px;"></div>
                </div>
              </div>
            </div>
            <div v-if="questions.multiple&&questions.multiple.length>0">
              <div class="examin_questions_title">{{getQuestionTitleContent(2)}}</div>
              <div class="examin_questions_content">
                <div class="examin_question_content" v-for="(question,index) in questions.multiple" :key="index" :id="getQuestionItemId(2,question)">
                  <div class="examin_question_title">
                    <span class="examin_question_index examin_question_ellipsis">{{question.question_index}}.</span>{{question.question_content}}({{question.question_score}}分)
                    <div style="position:absolute;top: 0;right:0px;">
                      <el-tooltip effect="dark" :content="getQuestionTag(question)" placement="top">
                        <i :class="selectQuestionTag(question)" @click="setCurrentQuestionTag(2,question)"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="examin_answers">
                    <el-checkbox-group v-model="question.select_answer" @change="onChangeMultiple" style="display:flex;flex-direction:column;">
                      <el-checkbox :label="answer.index" class="answer_select" v-for="(answer,indexAnswer) in question.answers" :key="indexAnswer">
                        <span class="words"><span class="words-option">{{answer.option}}. </span>{{answer.content}}</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div style="border: none;height:1px;background-color: #e6e6e6;margin-bottom:-32px;margin-top: 20px;"></div>
                </div>
              </div>
            </div>
            <div v-if="questions.judge&&questions.judge.length>0">
              <div class="examin_questions_title">{{getQuestionTitleContent(3)}}</div>
              <div class="examin_questions_content">
                <div class="examin_question_content" v-for="(question,index) in questions.judge" :key="index" :id="getQuestionItemId(3,question)">
                  <div class="examin_question_title">
                    <span class="examin_question_index examin_question_ellipsis">{{question.question_index}}.</span>{{question.question_content}}({{question.question_score}}分)
                    <div style="position:absolute;top: 0;right:0px;">
                      <el-tooltip effect="dark" :content="getQuestionTag(question)" placement="top">
                        <i :class="selectQuestionTag(question)" @click="setCurrentQuestionTag(3,question)"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="examin_answers">
                    <el-radio-group v-model="question.select_answer" @change="onChangeJudge" style="display:flex;flex-direction:column;">
                      <el-radio :label="answer.index" class="answer_select" v-for="(answer,indexAnswer) in question.answers" :key="indexAnswer">
                        <span class="words"><span class="words-option">{{answer.content}}</span></span>
                      </el-radio>
                    </el-radio-group>
                  </div>
                  <div style="border: none;height:1px;background-color: #e6e6e6;margin-bottom:-32px;margin-top: 20px;"></div>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-top:2px;height: 60px;display:flex;align-items: center;justify-content: center;background-color: #eff3f7;border: unset">奥松智能 提供支持</div>
        </div>
        <div class="examin_right_wrapper">
          <div class="item_label">剩余时间</div>
          <als-timedown ref="timeDownPlug"></als-timedown>
          <div class="item_divider"></div>
          <div class="item_label">当前进度</div>
          <div class="item_progress">{{progress.target}}/{{progress.max}}</div>
          <el-progress :percentage="progress.progress" :show-text="false" style="margin:5px 10px 0 10px" :stroke-width="4"></el-progress>
          <div class="item_divider" style="margin-top:4px"></div>
          <div style="display:flex;justify-content:center;align-items:center;margin-top: 15px;margin-bottom:15px">
            <el-button type="primary" style="width:100px" @click="onExamSubmit">提交</el-button>
          </div>
<!--          <div style="display:flex;justify-content:center;align-items:center;margin-top:15px;margin-bottom:15px">-->
<!--            <el-button type="primary" style="width:100px" @click="onExamPause">暂停</el-button>-->
<!--          </div>-->
        </div>
      </div>
      <div v-if="isExamFinish==2" class="examin_finished_container" >
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
  import PubSub from "pubsub-js"
  import storageUtil from '../../utils/storageUtil'
  import staticUtil from '../../utils/staticUtil'
  import promptUtil from '../../utils/promptUtil'
  import timeDown from '../component/timeDown'
  import examRankLisk from '../component/examRankList'
  import '../../api/restfulapi'
  import {
    qs,
    handleExam, // 学生操作试卷并保存
    submitPapers, // 提交试卷
    startExam,// 开始考试
    getExamAnalysis, // 获取试题解析
  } from '../../api/api'
  export default {
    components:{'als-timedown': timeDown,'als-exam-rank':examRankLisk},
    name: "examination",
    data(){
      return{
        progress:{target:0,max:0,progress:0},
        questionFilter: {status:1,label:'全部'},
        examTime:0,
        examStatus:{status:0,content:'未通过'},
        serverAnswers:{
          // single:[{ question_index:1, question_content: '递接', question_score: '10.0', collect:1, student_answer: 2,student_content: 'B', right_answer: 1, right_content: 'B', analysis:'解析', answers: [{index: 1,option:'A',content:'正面朝向对方'}]}],
          // multiple:[{ question_index:1, question_content: '递接', question_score: '10.0', collect:1, student_answer: [1,2], student_content: 'A、B', right_answer: 0, right_content: 'A、B', analysis:'解析', answers: [{index: 1,option:'A',content:'正'}]},{ question_index:2, question_content: '递接', question_score: '10.0', collect:0, student_answer: [1,2,3], student_content: 'A、B、C', right_answer: 1, right_content: 'A、B', analysis:'解析', answers: [{index: 1,option:'A',content:'正面朝向对方'}]}],
          // judge:[{ question_index:1, question_content: '递接', question_score: '10.0', collect:1, student_answer: 2, student_content: '错', right_answer: 1, right_content: '正', analysis:'解析', answers: [{index: 1,content:'正确'}]},{ question_index:2, question_content: '递接', question_score: '10.0', collect:0, student_answer: 1, student_content: '正', right_answer: 0, right_content: '错', analysis:'解析', answers: [{index: 1,content:'正确'}]}]
        },
        answers:{},
        submitPaperDetail:{score:0,acc:0.0,comment:'感谢您的作答！',students:[]},
        questions: {
         // single:[{question_index:1, question_content: '题干', question_score: '10.0', tag:0, select_answer: 0, answers: [{index: 1,option:'A',content:'选项'}]}],
         // multiple:[{question_index:1, question_content: '题干。', question_score: '10.0', tag:0, select_answer: [], answers: [{index: 1,option:'A',content:'选项'}]}],
         // judge:[{question_index:1, question_content: '题干。', question_score: '10.0', tag:0, select_answer: 0, answers: [{index: 1,content:'选项'}]}],
        },
        mainWidth: '',
        baseHeight: '',
        studentName:'',
        studentAvatar:'',
        schoolName:'',
        examName:'',
        dialogVisible:false,
        submitVisible:false,
        isExamFinish:0, // 0 查看新题 1 查看成绩 2 查看错题
        submitProgress:0,
        intervalOffset:45,
        firstIntervalTimeoutId:null,
        secondIntervalTimeoutId:null,
        thirdIntervalTimeoutId:null,
        targetExamData:'',
        submitExamData:'', // 待提交的数据
        timeIntervalId:'', // 定时器id
        reExamId:'', //再次考试使用id
        isReExamLoading:false,
      }
    },
    watch:{
      isExamFinish:{
        handler(newObj){
          if(newObj==0){ // 考试页面
            for(let i=0;i<10;i++){
              setTimeout(()=>{
                this.mainWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 520
                const width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
                $(".examin_center_wrapper").width(this.mainWidth)
                $(".exmain_finish_wrapper").width(width)
              },10+10*i)
            }
          }
          if(newObj==1){ // 显示评分页面
            for(let i=0;i<10;i++){
              setTimeout(()=>{
                const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                try{
                  this.$refs.alsExamRank.students(this.submitPaperDetail.students)
                }catch (e) {}
                $(".exmain_finish_wrapper").width(width)
              },10+10*i)
            }
          }else if(newObj==2){ // 显示解析页面
            for(let i=0;i<10;i++){
              setTimeout(()=>{
                this.baseHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 100
                this.mainWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 520
                $(".examin_finished_container").css("minHeight",this.baseHeight+100)
                $(".examin_finished_left_wrapper").height(this.baseHeight).width(240)
                $(".examin_finished_center_wrapper").width(this.mainWidth)
              },10+10*i)
            }
          }
        },
        deep: false
      },
      submitProgress:{
        handler(newObj){
          if(newObj>=33){
            clearInterval(this.firstIntervalTimeoutId )
            this.firstIntervalTimeoutId = null
            if(!this.secondIntervalTimeoutId){
              this.intervalOffset = this.genRandom(20,70)
              this.secondIntervalTimeoutId = setInterval(()=>{
                if(this.submitProgress<=99){
                  this.submitProgress = this.submitProgress + 1
                }
              },this.intervalOffset)
            }
          }
          if(newObj==33){ // 提交试卷
            submitPapers(qs.stringify({
              id: this.targetExamData.id
            })).then(res=>{
              this.submitPaperDetail = res.data
              this.reExamId = res.data.id
              // 需要请求刷新list表
            }).catch(err=>promptUtil.LOG('submitPapers-err',err))
          }
          if(newObj>=66){
            clearInterval(this.secondIntervalTimeoutId )
            this.secondIntervalTimeoutId = null
            if(!this.thirdIntervalTimeoutId){
              this.intervalOffset = this.genRandom(20,70)
              this.thirdIntervalTimeoutId = setInterval(()=>{
                if(this.submitProgress<=99){
                  this.submitProgress = this.submitProgress + 1
                }
              },this.intervalOffset)
            }
          }
          if(newObj==100){
            clearInterval(this.thirdIntervalTimeoutId )
            this.thirdIntervalTimeoutId = null
            setTimeout(()=>{
              this.hideScore()
            },1000)
          }
        },
        deep: false
      },
      questions:{
        handler(newObj) {
          let targetSize = 0
          let maxSize = 0
          if(newObj){
            if(newObj.single && newObj.single.length && newObj.single.length > 0){
              newObj.single.map(item=>{
                maxSize = maxSize + 1
                if(item.select_answer!=-1){
                  targetSize = targetSize + 1
                }
              })
            }
            if(newObj.multiple && newObj.multiple.length && newObj.multiple.length > 0){
              newObj.multiple.map(item=>{
                maxSize = maxSize + 1
                if(item.select_answer && item.select_answer.length && item.select_answer.length!=0){
                  if(item.select_answer.length>0){
                    targetSize = targetSize + 1
                  }
                }
              })
            }
            if(newObj.judge && newObj.judge.length && newObj.judge.length > 0){
              newObj.judge.map(item=>{
                maxSize = maxSize + 1
                if(item.select_answer!=-1){
                  targetSize = targetSize + 1
                }
              })
            }
          }
          this.progress.target = targetSize
          this.progress.max = maxSize
          this.progress.progress = (this.progress.target/this.progress.max*1).toFixed(2) * 100
        },
        immediate: true,
        deep: true
      }
    },
    created() {
      let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      this.baseHeight = windowHeight - 100
      this.mainWidth = windowWidth - 520
    },
    mounted() {
      PubSub.subscribe("markingScore", (msg, data) => { // 订阅评分消息
        this.handleScore()
      });
      window.onresize = () => {
        if(this.isExamFinish==1){
          this.baseHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 100
          const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
          $(".exmain_finish_wrapper").width(width)
          $(".examin_container").css("minHeight",this.baseHeight+100)
        }else if (this.isExamFinish==0){
          this.mainWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 520
          const width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
          $(".examin_center_wrapper").width(this.mainWidth)
          $(".exmain_finish_wrapper").width(width)
        }else if(this.isExamFinish==2) {
          this.baseHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 100
          this.mainWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 520
          $(".examin_finished_container").css("minHeight",this.baseHeight+100)
          $(".examin_finished_left_wrapper").height(this.baseHeight).width(240)
          $(".examin_finished_center_wrapper").width(this.mainWidth)
        }
      };
    },
    methods:{
      initData(obj){
        this.schoolName = storageUtil.readTeacherInfo().school_name
        this.studentName = storageUtil.readTeacherInfo().real_name
        this.studentAvatar = storageUtil.readTeacherInfo().avatar
        if(obj.title & obj.title!=''){
          this.examName = obj.title
        }
      },
      initStyle(){
        $(".el-dialog").css("backgroundColor","#eff3f7")
        $(".el-dialog__header").css("margin",0).css("padding",0)
        $(".el-dialog__body").css("margin",0).css("padding",0).css("backgroundColor","#eff3f7")
        if(this.isExamFinish==0){
          $(".examin_container").css("minHeight",this.baseHeight+100)
          $(".examin_left_wrapper").height(this.baseHeight).width(240)
          $(".examin_center_wrapper").width(this.mainWidth)
        }else if(this.isExamFinish==1){
          this.baseHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 100
          const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
          $(".exmain_finish_wrapper").width(width)
          $(".exmain_finish_wrapper").height(this.baseHeight+40)
        }
      },
      analyzeExamData(data){
        const analyzeData= []
        const judgeObj = {title:'判断题',type:3,num:0,score:0,data:[]}
        const singleObj = {title:'单选题',type:1,num:0,score:0,data:[]}
        const multipleObj = {title:'多选题',type:2,num:0,score:0,data:[]}
        if(data.single && data.single.length>0){
          let allSingleScore = 0
          data.single.map(item=>{
            let resultSingleObj = item.answers.find(obj=>obj.index==item.select_answer)
            let dataSingleObj = {
              id:item.id,score:item.question_score,select:resultSingleObj? resultSingleObj.option:-1,tag:item.tag
            }
            allSingleScore=allSingleScore+item.question_score*1
            singleObj.data.push(dataSingleObj)
          })
          singleObj.type = data.single[0].type
          singleObj.title = data.single[0].title
          singleObj.num = data.single.length
          singleObj.score = allSingleScore
        }
        analyzeData.push(singleObj)
        if(data.multiple && data.multiple.length>0){
          let allMultipleScore = 0
          data.multiple.map(item=>{
            let optionLabel = ''
            if(item.select_answer.length>0){
              item.select_answer.map(sel=>{
                let result = item.answers.find(obj=>obj.index==sel)
                optionLabel=optionLabel+result.option
              })
            }
            let dataMultipleObj = {
              id:item.id,score:item.question_score,select:item.select_answer.length>0?optionLabel:-1,tag:item.tag
            }
            allMultipleScore=allMultipleScore+item.question_score*1
            multipleObj.data.push(dataMultipleObj)
          })
          multipleObj.type = data.multiple[0].type
          multipleObj.title = data.multiple[0].title
          multipleObj.num = data.multiple.length
          multipleObj.score = allMultipleScore
        }
        analyzeData.push(multipleObj)
        if(data.judge && data.judge.length>0){
          let allJudgeScore = 0
          data.judge.map(item=>{
            let resultSingleObj = item.answers.find(obj=>obj.index==item.select_answer)
            let dataJudgeObj = {
              id:item.id,score:item.question_score,select:resultSingleObj?resultSingleObj.option:-1,tag:item.tag
            }
            allJudgeScore=allJudgeScore+item.question_score*1
            judgeObj.data.push(dataJudgeObj)
          })
          judgeObj.type = data.judge[0].type
          judgeObj.title = data.judge[0].title
          judgeObj.num = data.judge.length
          judgeObj.score = allJudgeScore
        }
        analyzeData.push(judgeObj)
        this.submitExamData = analyzeData
      },
      // 定时发送考试内容
      delayedPostExamData(){
        setTimeout(()=>{
          this.timeIntervalId = setInterval(()=>{
            if(this.isExamFinish==0 && this.submitVisible!=true){
              this.postExamData()
            }
          },8000)
        },1500)
      },
      // 发送考试内容
      postExamData(){
        this.analyzeExamData(this.questions)
        handleExam(qs.stringify({
          student_id:storageUtil.readTeacherInfo().id,
          id:this.targetExamData.id,
          paper_con: JSON.stringify(this.submitExamData)
        })).then().catch(err=> promptUtil.LOG('handleExam-err',err))
      },
      // 选择单选时，保存考试数据
      onChangeSingle(){
        this.analyzeExamData(this.questions)
      },
      // 选择多选时，保存考试数据
      onChangeMultiple(){
        this.analyzeExamData(this.questions)
      },
      // 选择判断时，保存考试数据
      onChangeJudge(){
        this.analyzeExamData(this.questions)
      },
      show(data, type){
        if (type==0){ // 开始考试
          this.examTime = this.targetExamData.long * 1000
          this.targetExamData = data
          this.questions = this.targetExamData.detail
          this.isExamFinish = 0
        } else if (type==1){ // 继续考试
          this.targetExamData = data
          this.questions = this.targetExamData.detail
          this.isExamFinish = 0
        } else if (type==3){ // 查看分数
          this.isExamFinish = 1
          this.submitPaperDetail = data
          this.reExamId = data.id
          this.examName = data.title
        }
        this.dialogVisible = true
      },
      hide(){
        this.isExamFinish = 1
        this.submitVisible = false
        this.dialogVisible = false
      },
      hideScore(status=true){ // true 完成考试 false 再次考试
        this.submitVisible = false
        this.isExamFinish = status ? 1 : 0
        if(status){
          clearInterval(this.thirdIntervalTimeoutId)
          this.thirdIntervalTimeoutId = null
        }
      },
      handleScore(){
        this.postExamData() // 最终提交试卷
        if(this.isExamFinish==0){ // 防止进行二次出现评分页面
          try{
            // this.$refs.timeDownPlug._pause()
            this.$refs.timeDownPlug.reset()
          }catch (e) {}
          this.submitProgress = 0
          this.submitVisible = true
        }
      },
      onExamPause(){
        this.$confirm('是否现在暂停答卷？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.isExamFinish==0){
            const time = this.$refs.timeDownPlug.getUnusedTime()
            console.log("剩余时间【%s】秒",time/1000)
            this.$refs.timeDownPlug._pause()
            this.hide()
          }
        }).catch(() =>{})
      },
      onExamSubmit(){
        if(this.progress.target==this.progress.max && this.progress.target!=0){
          this.$confirm('是否现在交卷？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleScore()
          }).catch(() =>{})
        }else{
          this.$confirm('有试题未完成，是否现在交卷？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleScore()
          }).catch(() =>{})
        }
      },
      exitExam(){
        if(this.isExamFinish!=0){
          this.hide()
        }else if(this.isExamFinish==0){
          this.$confirm('退出后将提交试卷, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleScore()
          }).catch(() =>{});
        }
      },
      previewExamEvent() {
        this.examTime = this.targetExamData.long * 1000
        // this.questions = this.targetExamData.detail
        this.initData(this.targetExamData)
        this.initStyle()
      },
      previewExamSubmitEvent(){
        for(var i=0;i<10;i++){
          setTimeout(()=>{
            $(".submit_dialog").width((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)*0.24)
          },10+i*10)
        }
        this.intervalOffset = this.genRandom(20,70)
        this.firstIntervalTimeoutId = setInterval(()=>{
          if(this.submitProgress<=99){
            this.submitProgress = this.submitProgress + 1
          }
        },this.intervalOffset)
      },
      openExamEvent(){
        this.initStyle()
        this.startTimePlug()
        this.delayedPostExamData()
        this.initializData()
      },
      // 初始化显示内容数据
      initializData(){
        if(this.isExamFinish==1){
          this.$refs.alsExamRank.students(this.submitPaperDetail.students)
        }
      },
      closeExamEvent(){
        PubSub.publish("refreshStudentExamList", 'refresh');
        clearInterval(this.timeIntervalId)
      },
      // 启动定时器插件
      startTimePlug(offset){
        if(this.isExamFinish==0){
          this.$refs.timeDownPlug._start(offset ? offset : this.examTime)
        }
      },
      genRandom(left,right){
        return parseInt(left + (right - 20) * (Math.random()))
      },
      selectQuestion(item){
        if(item.select_answer && item.select_answer!=-1){
          if((item.select_answer) instanceof Array){ // 证明是多选题
            if(item.select_answer.length>0){
              return 'examin_button answer_already'
            } else{
              return 'examin_button'
            }
          }else{
            return 'examin_button answer_already'
          }
        }else{
          return 'examin_button'
        }
      },
      selectFinishedQuestion(item){
        if(item.right_answer==0){
          return 'examin_button answer_error'
        }else{
          return 'examin_button answer_right'
        }
      },
      moveToTargetQuestion(type,item){
        const targetId =  "#exam_question_" + type + "_" +  item.question_index
        const offsetTop = $(targetId).position().top
        document.getElementsByClassName('examin_container')[0].scrollTo(0,offsetTop)
      },
      moveToTargetFinishQuestion(type,item){
        const targetId =  "#exam_finished_question_" + type + "_" +  item.question_index
        const offsetTop = $(targetId).position().top
        document.getElementsByClassName('examin_finished_container')[0].scrollTo(0,offsetTop)
      },
      getQuestionItemId(type,item){
        return "exam_question_" + type + "_" +  item.question_index
      },
      getFinishedQuestionItemId(type,item){
        return "exam_finished_question_" + type + "_" +  item.question_index
      },
      getQuestionTag(item){
        if(item.tag&&item.tag==1){
          return '取消标记'
        }else{
          return '标记本题'
        }
      },
      getFinishedQuestionCollect(item){
        if(item.collect&&item.collect==1){
          return '取消收藏'
        }else{
          return '收藏本题'
        }
      },
      // 返回标记class属性
      selectQuestionTag(item){
        if(item.tag&&item.tag==1){
          return 'el-icon-s-flag examin_tag_ok'
        }else{
          return 'el-icon-s-flag examin_tag_no'
        }
      },
      selectQuestionCollect(item){
        if(item.collect&&item.collect==1){
          return 'el-icon-star-on examin_tag_ok'
        }else{
          return 'el-icon-star-on examin_tag_no'
        }
      },
      // 设置试题标记
      setCurrentQuestionTag(type,item){
        if(type==1){
          this.questions.single[item.question_index-1].tag = !item.tag
        }else if(type==2){
          this.questions.multiple[item.question_index-1].tag = !item.tag
        }else if(type==3){
          this.questions.judge[item.question_index-1].tag = !item.tag
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
        // promptUtil.warning(this,'敬请期待...')
      },
      // 计算试题数量
      computeQuestionsCount(type){
        if(type==1){
          return this.questions.single.length
        }else if(type==2){
          return this.questions.multiple.length
        }else if(type==3){
          return this.questions.judge.length
        }
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
      // 计算试题分数
      computeQuestionsScore(type){
        let allScore = 0.0
        if(type==1){
          if(this.questions.single&&this.questions.single.length>0){
            this.questions.single.map(item=>{
              allScore = allScore + item.question_score*1
            })
          }
        }else if(type==2){
          if(this.questions.multiple&&this.questions.multiple.length>0){
            this.questions.multiple.map(item=>{
              allScore = allScore + item.question_score*1
            })
          }
        }else if(type==3){
          if(this.questions.judge&&this.questions.judge.length>0){
            this.questions.judge.map(item=>{
              allScore = allScore + item.question_score*1
            })
          }
        }
        return (allScore*1).toFixed(1)
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
      // 返回标题内容
      getQuestionTitleContent(type){
        if(type==1){
          return "单选题（共"+this.computeQuestionsCount(type)+"题，合计"+this.computeQuestionsScore(type)+"分）"
        }else if (type==2){
          return "多选题（共"+this.computeQuestionsCount(type)+"题，合计"+this.computeQuestionsScore(type)+"分，漏选错选不得分）"
        }else if (type==3){
          return "判断题（共"+this.computeQuestionsCount(type)+"题，合计"+this.computeQuestionsScore(type)+"分）"
        }
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
      // 查看试卷
      onClickExamDetail(){
        const loading = promptUtil.loading(this)
        getExamAnalysis(qs.stringify({
          id: this.reExamId
        })).then(res=>{
          try{
            this.examStatus.status=res.data.jige
            this.examStatus.content=res.data.jige_text
            this.serverAnswers = res.data.answer
            this.answers = staticUtil.clone(this.serverAnswers)
            this.isExamFinish = 2
            loading.close()
            $(".el-dialog").css("backgroundColor","#eff3f7")
            $(".el-dialog__header").css("margin",0).css("padding",0)
            $(".el-dialog__body").css("margin",0).css("padding",0).css("backgroundColor","#eff3f7")
            for(let i=0;i<10;i++){
              setTimeout(()=>{
                $(".examin_finished_container").css("minHeight",this.baseHeight+100)
                $(".examin_finished_left_wrapper").height(this.baseHeight).width(240)
                $(".examin_finished_center_wrapper").width(this.mainWidth)
              },10+i*10)
            }
          }catch (e) {
            promptUtil.warning(this,'请稍后再试...')
            loading.close()
          }
        }).catch(err=>{
          promptUtil.LOG('getExamAnalysis-err',err)
          loading.close()
        })
      },
      // 再考一次
      onClickReExam(){
        this.progress.target = 0
        this.progress.max = 0
        this.progress.progress = 0.00
        const loading = promptUtil.loading(this)
        startExam(qs.stringify({id:this.reExamId})).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.show(res.data,0)
            this.hideScore(false)
            for(let i=0;i<10;i++){
              setTimeout(()=>{
                this.initStyle()
              },10+i*10)
            }
            setTimeout(()=>{
              this.startTimePlug(res.data.long*1000)
            },150)
          }else{
            promptUtil.warning(this,res.msg)
          }
          loading.close()
        }).catch(err=>{
          loading.close()
          promptUtil.LOG("startExam-err",err)
        })
      },
      // 返回触发
      onClickBack(){
        this.isExamFinish = 1
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
  .examin_container{
    background-color: #eff3f7;
    border: unset;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .examin_finished_container{
    background-color: #eff3f7;
    border: unset;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .title_header_wrapper{
    position: fixed;
    top: 0px;
    height: 79px;
    width: 100%;
    background: #eff3f7;
    z-index: 9999;
  }
  .examin_center_wrapper {
    border: unset;
    position: absolute;
    top: 80px;
    margin-left: 320px;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid rgba(58,62,81,0.10);
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
  .examin_left_wrapper {
    position: fixed;
    top: 80px;
    background-color: #fff;
    width: 240px;
    margin-left: 60px;
    border-radius: 3px;
    box-shadow:1px 1px 1px rgba(58,62,81,0.10),1px -1px 1px rgba(58,62,81,0.10),-1px 1px 1px rgba(58,62,81,0.10),-1px -1px 1px rgba(58,62,81,0.10);
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
  .examin_left_wrapper_footer{
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
  .answer_already {
    background-color: #409EFF;
    border-color: #409EFF;
    color: #fff;
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
  .examin_item{
    position:relative;
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
  .line_divider{
    margin: 0 20px;
    border:none;
    height:1px;
    background-color:#B4B6BD;
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
  }
  .examin_answers{
    overflow: auto;
  }
  .answer_select{
    padding-left: 12px;
    margin-right: 0px;
    height:40px;
    line-height: 40px;
  }
  .answer_select:hover{
    background-color: #e6e6e6;
    color: #409EFF;
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
  .words{
    margin-left: 20px;
  }
  .words-option {
    margin-left: -20px;
  }
  .examin_tag_no {
    font-size: 20px;
    color: #B4B6BD;
  }
  .examin_tag_no:hover {
    cursor: pointer;
  }
  .examin_tag_ok {
    font-size: 20px;
    color: #409EFF;
  }
  .examin_tag_ok:hover {
    cursor: pointer;
  }
  .item_label{
    color:#333;
    text-align: center;
    line-height:20px;
    font-weight:400;
    margin-top:14px;
  }
  .item_divider{
    border:none;
    height:1px;
    background-color:#B4B6BD;
    margin:-10px 10px 0 10px
  }
  .item_progress{
    color:#333;
    text-align: center;
    font-weight:400;
    margin-top:5px;
  }
  .exmain_finish_container{
    margin: 0;
    padding: 0;
    z-index: 9998;
    background: -webkit-linear-gradient(left, #268ffb, #4bcafd);
  }
  .user_avatar{
    position: absolute;
    left:260px;
    z-index: 10001;
  }
  .exmain_finish_wrapper{
    position:absolute;
    top:60px;
    z-index:10000;
    height:200px;
    background:-webkit-linear-gradient(left, #268ffb, #4bcafd);
    display:flex;
    justify-content: center;
  }
  .exmain-div-wrapper{
    position: relative;
    width: 600px;
    height: 500px;
    margin-top: 50px;
  }
  .exmain-card{
    width: 600px;

    margin-top: 40px;
  }
  .exam_result_score{
    position: relative;
    text-align: center;
    color: #1A8CFE;
    font-size: 20px;
    margin-top: 20px;
  }
  .exam-result-percentage{
    font-family:"Helvetica Neue,Helvetica,Arial,sans-serif";
    text-align: center;
    color: #1A8CFE;
    font-size: 16px;
    font-weight:400;
  }
  .score{
    font-family:"Helvetica Neue,Helvetica,Arial,sans-serif";
    margin-left: 20px;
    line-height: 62px;
    font-size: 44px;
    font-weight:500;
    text-align: center;
    text-size-adjust: 100%;
  }
  .examin_analysis{
    background: rgba(222,222,222,0.2);
    border-radius: 4px;
    padding: 15px 20px;
    line-height: 24px;
    margin-top: 10px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
