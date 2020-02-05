<template>
    <div>
      <!-- 面包屑 -->
      <el-row>
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <div class="option-wrapper">
        <div class="option-left-wrapper">
          <el-select v-model="currentPackage" clearable placeholder="请选择课程" style="width: 180px" @change="onChangeSelectPackage">
            <el-option-group
              v-for="group in calendarBaseInfo.courseArray"
              :key="group.label"
              :label="group.label">
              <el-option
                :tableName="group.table"
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value+':'+group.table">
              </el-option>
            </el-option-group>
          </el-select>
          <el-select v-model="currentTeacher" clearable placeholder="请选择授课教师" style="width: 180px" @change="onChangeSelectTeacher">
            <el-option
              v-for="item in calendarBaseInfo.teacherArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <div style="display: flex;align-items: center">
                <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
                <div style="margin-left: 40px">{{ item.label }}</div>
              </div>
            </el-option>
          </el-select>
          <el-select v-model="currentClassroom" clearable placeholder="请选择上课班级" style="width: 180px" @change="onChangeSelectClassroom">
            <el-option
              v-for="item in calendarBaseInfo.classRoomArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="option-right-wrapper">
          <div style="line-height: 40px;margin-right: 10px;font-size: 18px">{{timeFrame}}</div>
          <div style="margin-right: 10px;">
            <el-date-picker
              v-model="currentTimestamp"
              type="date"
              placeholder="选择日期" @change="onChangeDatePicker">
            </el-date-picker>
          </div>
          <el-button plain style="height: 40px;" size="small" @click="onClickPrev">上一周</el-button>
          <el-button plain style="height: 40px;" size="small" @click="onClickToday">今天</el-button>
          <el-button plain style="height: 40px;" size="small" @click="onClickNext">下一周</el-button>
        </div>
      </div>
      <div id="calendar" class="calendar-wrapper" :style="{height:calendarHeight+'px'}"></div>
      <el-dialog title="新增课程安排" :visible.sync="dialogClassVisible" width="900px" :before-close="resetAddClassDialog">
        <el-tabs tab-position="top" type="border-card" v-model="selectTabCourse" @tab-click="tabHandleClick">
          <el-tab-pane label="人工智能课程" name="tab-course-system">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="8">
                  <el-form-item label="课程分类" prop="coursePackage" size="mini" class="fontWeight">
                    <el-select v-model="ruleForm.coursePackage" placeholder="请选择课程分类" style="width: 150px" @change="onChangeCoursePackage">
                      <el-option-group
                        v-for="group in addSchedulesBaseInfo.courseArray"
                        :key="group.label"
                        :label="group.label">
                        <el-option
                          v-for="item in group.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="课程类型" prop="courseType" size="mini" class="fontWeight">
                    <el-select v-model="ruleForm.courseType" placeholder="请选择课程类型" style="width: 150px" @change="onChangeCourseType">
                      <el-option v-for="item in addSchedulesBaseInfo.courseTypeArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="isShowCourseStage">
                  <el-form-item label="课程阶段" prop="courseStage" size="mini" class="fontWeight">
                    <el-select v-model="ruleForm.courseStage" placeholder="请选择课程阶段" style="width: 150px" @change="onChangeCourseStage">
                      <el-option v-for="item in addSchedulesBaseInfo.courseStageArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="8">
                  <el-form-item label="授课教师 " prop="teacher" size="mini" class="fontWeight">
                    <el-select v-model="ruleForm.teacher.id" placeholder="请选择授课教师" style="width: 150px" @change="onChangeTeacher">
                      <el-option
                        v-for="item in addSchedulesBaseInfo.teacherArray"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        <div style="display: flex;align-items: center">
                          <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
                          <div style="margin-left: 40px">{{ item.label }}</div>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学生数量" prop="student" size="mini" class="fontWeight">
                    <el-input-number v-model="ruleForm.student" :min="1" :max="100" label="学生数量" style="width: 150px" @change="onChangeStudent"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="isShowClassRoom">
                  <el-form-item label="授课班级" prop="classroom" size="mini" class="fontWeight">
                    <el-select v-model="ruleForm.classroom" placeholder="请选择授课班级" style="width: 150px">
                      <el-option v-for="item in addSchedulesBaseInfo.classroomArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="8">
                  <el-form-item label="课程类型" prop="classType" size="mini" class="fontWeight">
                    <el-switch
                      style="margin-top: -4px;"
                      v-model="ruleForm.classType"
                      active-text="周期课"
                      inactive-text="临时课">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="ruleForm.classType">
                  <el-form-item label="课程周期" prop="courseCycle" size="mini" class="fontWeight">
                    <el-input placeholder="请输入内容" v-model="ruleForm.courseCycle" style="width: 150px;" @change="onChangeCourseCycle" @keyup.native="proving">
                      <template slot="append">周</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="24">
                  <el-form-item label="上课时间" size="mini" class="fontWeight" required>
                    <div v-show="!ruleForm.classType">
                      <div class="class-hours" v-for="item in ruleForm.schedulesTmp" :key="item.id">
                        <el-date-picker v-model="item.day" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item.startTime"
                          :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                        </el-time-select>
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item.endTime"
                          :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                        </el-time-select>
                        <i v-if="item.last==1" class="el-icon-circle-plus-outline add-time-rule" @click="addTimeRule(false,item.id)"></i>
                        <i v-else class="el-icon-remove-outline del-time-rule" @click="delTimeRule(false,item.id)"></i>
                      </div>
                    </div>
                    <div v-show="ruleForm.classType">
                      <div class="class-hours" v-for="item in ruleForm.schedulesCycle" :key="item.id">
                        <el-select v-model="item.week" placeholder="请选择课程周" style="width: 220px">
                          <el-option v-for="weekItem in weeksArray" :key="weekItem.value" :label="weekItem.label" :value="weekItem.value"></el-option>
                        </el-select>
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item.startTime"
                          :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                        </el-time-select>
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item.endTime"
                          :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                        </el-time-select>
                        <i v-if="item.last==1" class="el-icon-circle-plus-outline add-time-rule" @click="addTimeRule(true,item.id)"></i>
                        <i v-else class="el-icon-remove-outline del-time-rule" @click="delTimeRule(true,item.id)"></i>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="24">
                  <el-form-item label="备注" prop="desc" size="mini" class="fontWeight">
                    <el-input type="textarea" v-model="ruleForm.desc" :rows="2" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="display:flex;justify-content:flex-end;padding:0;margin: 0 10px 0 0;">
                <el-button @click="resetAddClassDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="addNewSchedules" size="small">确定</el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="自定义课程"  name="tab-course-custom" v-if="isShowCustomCourseTab">
            <el-form :model="customRuleForm" :rules="customRules" ref="customRuleForm" label-width="100px" class="demo-ruleForm">
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="8">
                  <el-form-item label="课程分类" prop="coursePackage" size="mini" class="fontWeight">
                    <el-select v-model="customRuleForm.coursePackage" placeholder="请选择课程分类" style="width: 150px" @change="onChangeSelfCoursePackage">
                      <el-option
                        v-for="item in addSchedulesBaseInfo.courseSelfArray"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="课程类型" prop="courseType" size="mini" class="fontWeight">
                    <el-select v-model="customRuleForm.courseType" placeholder="请选择课程类型" style="width: 150px" @change="onChangeSelfCourseType">
                      <el-option v-for="item in addSchedulesBaseInfo.courseSelfTypeArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="isShowSelfCourseStage">
                  <el-form-item label="课程阶段" prop="courseStage" size="mini" class="fontWeight">
                    <el-select v-model="customRuleForm.courseStage" placeholder="请选择课程阶段" style="width: 150px" @change="onChangeSelfCourseStage">
                      <el-option v-for="item in addSchedulesBaseInfo.courseSelfStageArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="8">
                  <el-form-item label="授课教师 " prop="teacher" size="mini" class="fontWeight">
                    <el-select v-model="customRuleForm.teacher.id" placeholder="请选择授课教师" style="width: 150px" @change="onChangeSelfTeacher">
                      <el-option
                        v-for="item in addSchedulesBaseInfo.teacherSelfArray"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        <div style="display: flex;align-items: center">
                          <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
                          <div style="margin-left: 40px">{{ item.label }}</div>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学生数量" prop="student" size="mini" class="fontWeight">
                    <el-input-number v-model="customRuleForm.student" :min="1" :max="100" label="学生数量" style="width: 150px" @change="onChangeSelfStudent"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="isShowSelfClassRoom">
                  <el-form-item label="授课班级" prop="classroom" size="mini" class="fontWeight">
                    <el-select v-model="customRuleForm.classroom" placeholder="请选择授课班级" style="width: 150px">
                      <el-option v-for="item in addSchedulesBaseInfo.classroomSelfArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="8">
                  <el-form-item label="课程类型" prop="classType" size="mini" class="fontWeight">
                    <el-switch
                      style="margin-top: -4px;"
                      v-model="customRuleForm.classType"
                      active-text="周期课"
                      inactive-text="临时课">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-show="customRuleForm.classType">
                  <el-form-item label="课程周期" prop="courseCycle" size="mini" class="fontWeight">
                    <el-input placeholder="请输入内容" v-model="customRuleForm.courseCycle" style="width: 150px;" @change="onChangeCourseCycle" @keyup.native="proving1">
                      <template slot="append">周</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="24">
                  <el-form-item label="上课时间" size="mini" class="fontWeight" required>
                    <div v-show="!customRuleForm.classType">
                      <div class="class-hours" v-for="item in customRuleForm.schedulesTmp" :key="item.id">
                        <el-date-picker v-model="item.day" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item.startTime"
                          :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                        </el-time-select>
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item.endTime"
                          :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                        </el-time-select>
                        <i v-if="item.last==1" class="el-icon-circle-plus-outline add-time-rule" @click="addTimeCustomRule(false,item.id)"></i>
                        <i v-else class="el-icon-remove-outline del-time-rule" @click="delTimeCustomRule(false,item.id)"></i>
                      </div>
                    </div>
                    <div v-show="customRuleForm.classType">
                      <div class="class-hours" v-for="item in customRuleForm.schedulesCycle" :key="item.id">
                        <el-select v-model="item.week" placeholder="请选择课程周" style="width: 220px">
                          <el-option v-for="weekItem in weeksArray" :key="weekItem.value" :label="weekItem.label" :value="weekItem.value"></el-option>
                        </el-select>
                        <el-time-select
                          placeholder="起始时间"
                          v-model="item.startTime"
                          :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                        </el-time-select>
                        <el-time-select
                          placeholder="结束时间"
                          v-model="item.endTime"
                          :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                        </el-time-select>
                        <i v-if="item.last==1" class="el-icon-circle-plus-outline add-time-rule" @click="addTimeCustomRule(true,item.id)"></i>
                        <i v-else class="el-icon-remove-outline del-time-rule" @click="delTimeCustomRule(true,item.id)"></i>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
                <el-col :span="24">
                  <el-form-item label="备注" prop="desc" size="mini" class="fontWeight">
                    <el-input type="textarea" v-model="customRuleForm.desc" :rows="2" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="display:flex;justify-content:flex-end;padding:0;margin: 0 10px 0 0;">
                <el-button @click="resetAddClassDialog" size="small">取 消</el-button>
                <el-button type="primary" @click="addNewCustomSchedules" size="small">确定</el-button>
              </div>
            </el-form>
          </el-tab-pane v-if=>
        </el-tabs>
      </el-dialog>
      <el-dialog title="管理课程" :visible.sync="dialogManageVisible" width="840px" :before-close="resetManageClassDialog">
        <el-row>
          <el-col :span="12">
            <span style="margin-right:20px;">所学课程</span>
            <el-select v-model="currentSelectPackageFromManager" placeholder="请选择" size="small">
              <el-option-group v-for="group in coursePackageWithStage" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-option-group>
            </el-select>
          </el-col>
          <el-col :offset="3" :span="9">
            <div style="display: flex;justify-content: flex-end;align-items: center;margin-right: 8px;">
              <el-button type="primary" size="small" @click="closeTargetCourse">记上课</el-button>
<!--              <el-button type="primary" size="small" @click="onClickSeeCoursePackage">查看课程</el-button>-->
              <el-button type="primary" @click="editTargetSchedules" size="small">修改排课</el-button>
              <el-button type="danger" @click="delTargetSchedules" size="small">删除课程</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span style="margin-right:20px;">班级学生</span>
            <el-select v-model="currentStudentWithManager" filterable placeholder="请选择" size="small">
              <el-option-group v-for="group in studentArrayWithManager" :key="group.lable" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-option-group>
            </el-select>
            <el-button type="primary" size="small" style="margin-left: 20px;" @click="onClickManagerAddClass(1)">加入班级</el-button>
            <el-button type="warning" size="small" style="margin-left: 20px;" @click="onClickManagerAddClass(0)">临时插班</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: -20px;margin-bottom:-30px;">
          <el-col>
            <div style="height: 510px;">
              <el-table
                :data="managerTableDataTmp"
                size="small"
                border
                style="height:433px;width:707px;margin-left: 83px;margin-top: 20px;">
                <el-table-column align="center" prop="label" label="姓名" width="150">
                  <template slot-scope="scope">
                    <div style="width:150px;height:100%;position: relative">
                      <span style="color:#409EFF" v-show="scope.row.type==1">{{scope.row.label}}</span>
                      <span style="color:#E6A23C" v-show="scope.row.type!=1">{{scope.row.label}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="phone" label="电话" width="150">
                </el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                  <template slot-scope="scope">
                    <span v-show="scope.row.status==0">- -</span>
                    <span v-show="scope.row.status==1">出勤</span>
                    <span v-show="scope.row.status==2">缺勤</span>
                    <span v-show="scope.row.status==3">请假</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button @click="removeHandleClick(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
                    <el-dropdown trigger="click" @command="managerTableHandleCommand">
                      <el-button @click="changeStuStatusClick(scope.row)" size="small" icon="el-icon-edit">签到</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1"><el-link icon="el-icon-check" :underline="false" ><span v-show="scope.row.status==1" style="color: #00a2ff">出勤</span><span v-show="scope.row.status!=1">出勤</span></el-link></el-dropdown-item>
                        <el-dropdown-item command="2"><el-link icon="el-icon-close" :underline="false"><span v-show="scope.row.status==2" style="color: #00a2ff">缺勤</span><span v-show="scope.row.status!=2">缺勤</span></el-link></el-dropdown-item>
                        <el-dropdown-item command="3"><el-link icon="el-icon-circle-plus-outline" :underline="false"><span v-show="scope.row.status==3" style="color: #00a2ff">请假</span><span v-show="scope.row.status!=3">请假</span></el-link></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
<!--                    <el-popover placement="right" width="400" trigger="click" :ref="'popover-' + scope.row.value" >-->
<!--                      <el-table :data="allSchoolCourseData" @row-click="tableScheduleRowClick" :cell-style="tableRowClassName">-->
<!--                        <el-table-column width="200" property="course" label="课程名称"></el-table-column>-->
<!--                        <el-table-column width="100" property="teacher" label="授课教师"></el-table-column>-->
<!--                        <el-table-column width="150" property="room" label="所在班级"></el-table-column>-->
<!--                        <el-table-column width="250" property="data" label="上课时间"></el-table-column>-->
<!--                      </el-table>-->
<!--                      <el-button slot="reference" @click="changeHandleClick(scope.row)" size="small" icon="el-icon-sort" :disabled="scope.row.type!=1">转班</el-button>-->
<!--                    </el-popover>-->
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-left: 83px;margin-top:20px;display: flex;justify-content: center;">
                  <el-pagination
                    background
                    @current-change="handleCurrentManageChange"
                    :current-page="currentManagePage"
                    :page-size="managePageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="manageInfoList"
                  ></el-pagination>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="delManagerTableDialogVisible" width="20%">
        <el-row>
          <el-col :span="4">
            <i class="el-icon-question"></i>
          </el-col>
          <el-col :span="20">
            <span>{{delManagerTableContent}}</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delManagerTableDialogVisible = false">取 消</el-button>
          <el-button v-if="delScheduleHandle" type="primary" @click="handleDelScheduleWithManageTable" :loading="isLoadingDelManager">确 定</el-button>
          <el-button v-else type="primary" @click="handleDelStudentWithManageTable">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="updateScheduleDialogVisible" width="20%">
        <el-row>
          <el-col :span="4">
            <i class="el-icon-warning"></i>
          </el-col>
          <el-col :span="20">
            <span>{{updateScheduleContent}}</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateScheduleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdateScheduleTime">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog title="编辑课程安排" :visible.sync="dialogEditClassVisible" width="840px" :before-close="resetEditClassDialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleEditForm" label-width="100px" class="demo-ruleForm">
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="8">
              <el-form-item label="课程分类" prop="coursePackage" size="mini" class="fontWeight">
                <el-select v-model="ruleForm.coursePackage" placeholder="请选择课程分类" style="width: 150px" @change="onChangeCoursePackage">
                  <el-option-group
                    v-for="group in addSchedulesBaseInfo.courseArray"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="课程类型" prop="courseType" size="mini" class="fontWeight">
                <el-select v-model="ruleForm.courseType" placeholder="请选择课程类型" style="width: 150px" @change="onChangeCourseType">
                  <el-option v-for="item in addSchedulesBaseInfo.courseTypeArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isShowCourseStage">
              <el-form-item label="课程阶段" prop="courseStage" size="mini" class="fontWeight">
                <el-select v-model="ruleForm.courseStage" placeholder="请选择课程阶段" style="width: 150px" @change="onChangeCourseStage">
                  <el-option v-for="item in addSchedulesBaseInfo.courseStageArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="8">
              <el-form-item label="授课教师" prop="teacher" size="mini" class="fontWeight">
                <el-select v-model="ruleForm.teacher.id" placeholder="请选择授课教师" style="width: 150px" @change="onChangeTeacher">
                  <el-option
                    v-for="item in addSchedulesBaseInfo.teacherArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <div style="display: flex;align-items: center">
                      <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
                      <div style="margin-left: 40px">{{ item.label }}</div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学生数量" prop="student" size="mini" class="fontWeight">
                <el-input-number v-model="ruleForm.student" :min="1" :max="100" label="学生数量" style="width: 150px" @change="onChangeStudent"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isShowClassRoom">
              <el-form-item label="授课班级" prop="classroom" size="mini" class="fontWeight">
                <el-select v-model="ruleForm.classroom" placeholder="请选择授课班级" style="width: 150px">
                  <el-option v-for="item in addSchedulesBaseInfo.classroomArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="8">
              <el-form-item label="课程类型" prop="classType" size="mini" class="fontWeight">
                <el-switch
                  :disabled="true"
                  style="margin-top: -4px;"
                  v-model="ruleForm.classType"
                  active-text="周期课"
                  inactive-text="临时课">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="24">
              <el-form-item label="上课时间" prop="schedules" size="mini" class="fontWeight">
                <div v-show="!ruleForm.classType">
                  <div class="class-hours" v-for="item in ruleForm.schedulesTmp" :key="item.id">
                    <el-date-picker v-model="item.day" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    <el-time-select
                      placeholder="起始时间"
                      v-model="item.startTime"
                      :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                    </el-time-select>
                    <el-time-select
                      placeholder="结束时间"
                      v-model="item.endTime"
                      :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                    </el-time-select>
                  </div>
                </div>
                <div v-show="ruleForm.classType">
                  <div class="class-hours" v-for="item in ruleForm.schedulesCycle" :key="item.id">
                    <el-select v-model="item.week" placeholder="请选择课程周" style="width: 220px">
                      <el-option v-for="weekItem in weeksArray" :key="weekItem.value" :label="weekItem.label" :value="weekItem.value"></el-option>
                    </el-select>
                    <el-time-select
                      placeholder="起始时间"
                      v-model="item.startTime"
                      :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                    </el-time-select>
                    <el-time-select
                      placeholder="结束时间"
                      v-model="item.endTime"
                      :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                    </el-time-select>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="24">
              <el-form-item label="备注" prop="desc" size="mini" class="fontWeight">
                <el-input type="textarea" v-model="ruleForm.desc" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display:flex;justify-content:flex-end;padding:0;margin: 0 10px 0 0;">
            <el-button @click="resetEditClassDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="editCurrentSchedules" size="small">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="编辑课程安排" :visible.sync="dialogCustomEditClassVisible" width="840px" :before-close="resetCustomEditClassDialog">
        <el-form :model="customRuleForm" :rules="rules" ref="customRuleEditForm" label-width="100px" class="demo-ruleForm">
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="8">
              <el-form-item label="课程分类" prop="coursePackage" size="mini" class="fontWeight">
                <el-select v-model="customRuleForm.coursePackage" placeholder="请选择课程分类" style="width: 150px" @change="onChangeSelfCoursePackage">
                  <el-option
                    v-for="item in addSchedulesBaseInfo.courseSelfArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="课程类型" prop="courseType" size="mini" class="fontWeight">
                <el-select v-model="customRuleForm.courseType" placeholder="请选择课程类型" style="width: 150px" @change="onChangeSelfCourseType">
                  <el-option v-for="item in addSchedulesBaseInfo.courseSelfTypeArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isShowSelfCourseStage">
              <el-form-item label="课程阶段" prop="courseStage" size="mini" class="fontWeight">
                <el-select v-model="customRuleForm.courseStage" placeholder="请选择课程阶段" style="width: 150px" @change="onChangeSelfCourseStage">
                  <el-option v-for="item in addSchedulesBaseInfo.courseSelfStageArray" :key="item.value" :label="item.label" :value="item.value" :disabled="item.status==1?false:true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="8">
              <el-form-item label="授课教师" prop="teacher" size="mini" class="fontWeight">
                <el-select v-model="customRuleForm.teacher.id" placeholder="请选择授课教师" style="width: 150px" @change="onChangeSelfTeacher">
                  <el-option
                    v-for="item in addSchedulesBaseInfo.teacherSelfArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <div style="display: flex;align-items: center">
                      <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
                      <div style="margin-left: 40px">{{ item.label }}</div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学生数量" prop="student" size="mini" class="fontWeight">
                <el-input-number v-model="customRuleForm.student" :min="1" :max="100" label="学生数量" style="width: 150px" @change="onChangeSelfStudent"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="isShowSelfClassRoom">
              <el-form-item label="授课班级" prop="classroom" size="mini" class="fontWeight">
                <el-select v-model="customRuleForm.classroom" placeholder="请选择授课班级" style="width: 150px">
                  <el-option v-for="item in addSchedulesBaseInfo.classroomSelfArray" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="8">
              <el-form-item label="课程类型" prop="classType" size="mini" class="fontWeight">
                <el-switch
                  :disabled="true"
                  style="margin-top: -4px;"
                  v-model="customRuleForm.classType"
                  active-text="周期课"
                  inactive-text="临时课">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="24">
              <el-form-item label="上课时间" prop="schedules" size="mini" class="fontWeight">
                <div v-show="!customRuleForm.classType">
                  <div class="class-hours" v-for="item in customRuleForm.schedulesTmp" :key="item.id">
                    <el-date-picker v-model="item.day" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    <el-time-select
                      placeholder="起始时间"
                      v-model="item.startTime"
                      :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                    </el-time-select>
                    <el-time-select
                      placeholder="结束时间"
                      v-model="item.endTime"
                      :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                    </el-time-select>
                  </div>
                </div>
                <div v-show="customRuleForm.classType">
                  <div class="class-hours" v-for="item in customRuleForm.schedulesCycle" :key="item.id">
                    <el-select v-model="item.week" placeholder="请选择课程周" style="width: 220px">
                      <el-option v-for="weekItem in weeksArray" :key="weekItem.value" :label="weekItem.label" :value="weekItem.value"></el-option>
                    </el-select>
                    <el-time-select
                      placeholder="起始时间"
                      v-model="item.startTime"
                      :picker-options="{
                        start: item.startRuleTime,
                        step: '00:15',
                        end: '21:15'
                      }">
                    </el-time-select>
                    <el-time-select
                      placeholder="结束时间"
                      v-model="item.endTime"
                      :picker-options="{
                        start: item.endRuleTime,
                        step: '00:15',
                        end: '22:00',
                        minTime: item.startTime
                      }">
                    </el-time-select>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin: 0 0 0 -20px;padding: 0;">
            <el-col :span="24">
              <el-form-item label="备注" prop="desc" size="mini" class="fontWeight">
                <el-input type="textarea" v-model="customRuleForm.desc" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display:flex;justify-content:flex-end;padding:0;margin: 0 10px 0 0;">
            <el-button @click="resetCustomEditClassDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="editCustomCurrentSchedules" size="small">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="delCloseCourseShow" width="20%">
        <el-row>
          <el-col :span="4">
            <i class="el-icon-question"></i>
          </el-col>
          <el-col :span="20">
            <span>执行该操作后将无法对该课程进行管理，确定要结束该课程吗？</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delCloseCourseShow = false">取 消</el-button>
          <el-button type="primary" @click="closeCourseShow">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  const moment = require("moment")
  import $ from "jquery"
  import PubSub from 'pubsub-js'
  import Calendar from 'tui-calendar'
  import "tui-calendar/dist/tui-calendar.css"
  import promptUtil from '../../../utils/promptUtil'
  import staticUtil from '../../../utils/staticUtil'
  import storageUtil from '../../../utils/storageUtil'
  import vuexUtils from '../../../utils/vuexUtils'
  import '../../../api/restfulapi'
  import {
    qs,
    addSchedules,
    updateSchedule,
    delScheduleById,
    getClassByTeacher,
    getCalendarInitData,
    updateScheduleByDate,
    getSchoolAllSchedules,
    studentChangeClassroom,
    updateManageDetailData,
    getIntoManageDetailData,
    getIntoAddSchedulesData,
    changeTeacherCourseStatus,
    querySchedulesByTimestamp
  } from '../../../api/api'
  import childHeader from '../../component/childHeader'
  const TAB_COURSE_SYSTEM = 'tab-course-system'
  const TAB_COURSE_CUSTOM = 'tab-course-custom'
  const COURSE_TABLE_SYSTEM = 'related_courses'
  const COURSE_TABLE_CUSTOM = 'related_courses_self'
  export default {
    components:{"als-child-header": childHeader},
    data(){
      return{
        calendarPopWindowTimeoutId: -1,
        calendarPopWindowOffsetTime: 0, // 需要停留1秒才显示
        currentSelectScheduleId:"",
        routerConfig: [{name:'排课',to:''}],
        targetEditType: COURSE_TABLE_SYSTEM, // 0 系统课程  1 自定义课程
        targetEditScheduleType: 0, // 0 系统课程  1 自定义课程
        selectTabCourse: TAB_COURSE_SYSTEM, // 当前选中的tab  tab-course-system tab-course-custom
        calendar: null, // 日历对象
        currentSelectTimeId: '', // 当前选中的时间段，用于后续删除使用
        dialogClassVisible: false, // 新增课程Dialog是否显示
        dialogEditClassVisible: false, // 编辑课程Dialog是否显示
        dialogCustomEditClassVisible: false, // 编辑自定义课程Dialog是否显示
        dialogManageVisible: false, // 管理课程Dialog是否显示
        schedulesDate: {start:'',end:'',week:''}, // 任务起始时间和结束时间
        currentClassroom: '', // 当前选择的班级
        currentPackage: '', // 当前选择的课程包
        currentTableName: '', // 当前选择的表名
        currentTeacher: '', // 当前选择的教师
        timeFrame: '', // 时间范围
        calendarBaseInfo: { // 获取基本信息
          courseArray: [], //课程信息
          teacherArray: [], //教师信息
          classRoomArray: [] // 班级信息
        },
        addSchedulesBaseInfo: { // 添加新课程时需要从服务器获取的数据
          courseArray: [], // 课程分类
          courseTypeArray: [], // 课程类型
          courseStageArray: [], // 课程阶段
          teacherArray: [], // 授课教师
          classroomArray: [], // 选择班级
          courseSelfArray: [], // 自定义课程分类
          courseSelfTypeArray: [], // 自定义课程类型
          courseSelfStageArray: [], // 自定义课程阶段
          teacherSelfArray: [], // 自定义授课教师
          classroomSelfArray:[], // 自定义选择班级
        },
        isShowCourseStage: false, // 是否显示课程阶段
        isShowClassRoom: false, // 是否显示授课班级
        isShowSelfCourseStage: false, // 是否显示课程阶段
        isShowSelfClassRoom: false, // 是否显示授课班级
        currentTimestamp: "", // 当前选择日期的时间戳
        customRuleForm: { // 自定义
          coursePackage: '', // 课程分类
          courseType: '', // 课程类型
          courseStage: '', // 课程阶段
          courseCycle: 1, // 课程周期
          teacher:{color:'',id:'',label:''}, // 教师
          student: 8, // 学生数量
          classroom: '', // 授课班级
          classType: false, // 课程类型 true-周期课 false-临时课
          schedulesCycle: [],// 周期课
          schedulesTmp: [],// 临时课
          desc: '', // 备注
        },
        ruleForm: {
          coursePackage: '', // 课程分类
          courseType: '', // 课程类型
          courseStage: '', // 课程阶段
          courseCycle: 1, // 课程周期
          teacher:{color:'',id:'',label:''}, // 教师
          student: 8, // 学生数量
          classroom: '', // 授课班级
          classType: false, // 课程类型 true-周期课 false-临时课
          schedulesCycle: [],// 周期课
          schedulesTmp: [],// 临时课
          desc: '', // 备注
        },
        customRules: {
          coursePackage: [
            { required: true, message: '请选择课程分类', trigger: 'blur' }
          ],
          courseType: [
            { required: true, message: '请选择课程类型', trigger: 'blur' }
          ],
          courseStage: [
            { required: true, message: '请选择课程阶段', trigger: 'blur' }
          ],
          teacher: [
            { required: true, message: '请选择授课教师', trigger: 'blur' }
          ],
          classroom: [
            { required: true, message: '请选择授课班级', trigger: 'blur' }
          ],
          // courseCycle: [
          //   { required: true, message: '请输入课程周期', trigger: 'blur' },
          //   {
          //     pattern: /^\+?[1-9][0-9]*$/,  //正则
          //     message: '请输入大于0的整数'
          //   }
          // ],
          student: [
            {
              pattern: /^\+?[1-9][0-9]*$/,  //正则
              message: '必须大于0'
            }
          ]
        },
        rules: {
          coursePackage: [
            { required: true, message: '请选择课程分类', trigger: 'blur' }
          ],
          courseType: [
            { required: true, message: '请选择课程类型', trigger: 'blur' }
          ],
          courseStage: [
            { required: true, message: '请选择课程阶段', trigger: 'blur' }
          ],
          teacher: [
            { required: true, message: '请选择授课教师', trigger: 'blur' }
          ],
          classroom: [
            { required: true, message: '请选择授课班级', trigger: 'blur' }
          ],
          // courseCycle: [
          //   { required: true, message: '请输入课程周期', trigger: 'blur' },
          //   {
          //     pattern: /^\+?[1-9][0-9]*$/,  //正则
          //     message: '请输入大于0的整数'
          //   }
          // ],
          student: [
            {
              pattern: /^\+?[1-9][0-9]*$/,  //正则
              message: '必须大于0'
            }
          ]
        },
        bgColor: {
          shiting: "#9B0AE3", // 试听
          zhengshi: "#388B01", // 正式
          jiaqi: "#01118B", // 假期
          duanqi: "#8B8901", // 短期
        },
        weeksArray: [
          {label:'星期一',value:1},
          {label:'星期二',value:2},
          {label:'星期三',value:3},
          {label:'星期四',value:4},
          {label:'星期五',value:5},
          {label:'星期六',value:6},
          {label:'星期日',value:7}
        ],
        initSchedulesArray: [],
        calendarHeight: 0,
        coursePackageWithStage: [], // 管理页面中课程包基本数据
        currentSelectPackageFromManager: '', // 在管理页面中点选课程列表的当前值
        studentArrayWithManager: [], // 管理页面中学生列表数据
        currentStudentWithManager: '',
        currentStudentWIthManagerObj: null,
        currentStudentWithChangeClass: null,
        managerTableData: [],
        managerTableDataTmp:[],
        managePageSize:8,
        currentManagePage:1,
        delManagerTableDialogVisible: false,// 是否显示提示删除操作对话框
        delManagerTableContent: '', // 提示删除操作对话框中显示内容
        delScheduleHandle: false, // true 表示删除课时操作，false表示删除学生操作
        targetSchedule: null,
        weekScheduleIds:[], // 本周内的所有课时基本信息
        tmpTargetPackageObj: "",// 用于存储修改管理页面中的课程包
        updateScheduleDialogVisible: false,
        updateScheduleContent: "",
        updateScheduleTime: {startTime:"",endTime:"",id:"",calendarId:""},
        updateScheduleObj: {}, // 从管理页面进入更新页面时需要的值
        isLoadingDelManager: false,// 删除课时的button响应事件
        allSchoolCourseData: [],
        isShowAllCourseTable: false,
        delCloseCourseShow: false,
        isShowCustomCourseTab: false, // 是否显示自定义课程
      }
    },
    created() {
      const windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      this.calendarHeight = windowHeight - 200
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", "/calendar")
      this.isShowCustomCourseTab = vuexUtils.checkMenuExist(this, 'custom')
      this.initData()
    },
    methods:{
      // 切换新增课程安排时触发
      tabHandleClick(tab, event){
        if(tab.name==TAB_COURSE_CUSTOM){
          // 判断是否已经有数据，如果有查询，如果没有放弃
        }
      },
      initData(){
        this.currentTimestamp = new Date().getTime()
        this.timeFrame = this.genTimeFrameByDataPicker(this.currentTimestamp)
        this.getBaseInfoFromServer()
        this.initCalendar()
      },
      // 上课时间的添加按钮
      addTimeRule(type,id){
        if(type){ // 周期课
          this.ruleForm.schedulesCycle.map(item=>{
            if(item.id==id){
              item.last = 0
            }
          })
          this.ruleForm.schedulesCycle.push(this.getCycleClassData(Math.random()+"", '', ''))
        }else{ // 临时课
          this.ruleForm.schedulesTmp.map(item=>{
            if(item.id==id){
              item.last = 0
            }
          })
          this.ruleForm.schedulesTmp.push(this.getTmpClassData(Math.random()+"", '', ''))
        }
      },
      // 自定义上课时间的添加按钮
      addTimeCustomRule(type,id){
        if(type){ // 周期课
          this.customRuleForm.schedulesCycle.map(item=>{
            if(item.id==id){
              item.last = 0
            }
          })
          this.customRuleForm.schedulesCycle.push(this.getCycleClassData(Math.random()+"", '', ''))
        }else{ // 临时课
          this.customRuleForm.schedulesTmp.map(item=>{
            if(item.id==id){
              item.last = 0
            }
          })
          this.customRuleForm.schedulesTmp.push(this.getTmpClassData(Math.random()+"", '', ''))
        }
      },
      // 下课时间的添加按钮
      delTimeRule(type,id){
        if(type){ // 周期课
          const index = this.ruleForm.schedulesCycle.findIndex(item=>{
            return item.id == id
          })
          this.ruleForm.schedulesCycle.splice(index,1) // 删除指定id下的item
        }else{ // 临时课
          const index = this.ruleForm.schedulesTmp.findIndex(item=>{
            return item.id == id
          })
          this.ruleForm.schedulesTmp.splice(index,1) // 删除指定id下的item
        }
      },
      // 自定义下课时间的添加按钮
      delTimeCustomRule(type,id){
        if(type){ // 周期课
          const index = this.customRuleForm.schedulesCycle.findIndex(item=>{
            return item.id == id
          })
          this.customRuleForm.schedulesCycle.splice(index,1) // 删除指定id下的item
        }else{ // 临时课
          const index = this.customRuleForm.schedulesTmp.findIndex(item=>{
            return item.id == id
          })
          this.customRuleForm.schedulesTmp.splice(index,1) // 删除指定id下的item
        }
      },
      // 重置管理课程对话框
      resetManageClassDialog(){
        if(this.currentStudentWithChangeClass && this.$refs[`popover-` + this.currentStudentWithChangeClass.value]){
          this.$refs[`popover-` + this.currentStudentWithChangeClass.value].doClose()
        }
        this.showOrHideManageDialog(false,this.targetSchedule)
      },
      // 重置编辑课程对话框
      resetEditClassDialog(){
        this.showOrHideEditDialog(false)
      },
      // 重置自定义编辑对话框
      resetCustomEditClassDialog(){
        this.showOrHideCustomEditDialog(false)
      },
      // 重置添加课程对话框
      resetAddClassDialog(){
        this.showOrHideAddDialog(false)
      },
      // 编辑自定义当前任务调度
      editCustomCurrentSchedules(){
        if(this.targetSchedule){
          const obj = staticUtil.clone(this.customRuleForm)
          obj.desc = obj.desc ? obj.desc : ""
          obj.id = this.targetSchedule.raw.id
          obj.classType = obj.classType ? 1: 0
          obj.courseType = (this.getCustomTargetObjByString(obj.courseType,4)).value
          obj.classroom = (this.getCustomTargetObjByString(obj.classroom,1)).value
          obj.courseStage = (this.getCustomTargetObjByString(obj.courseStage,3)).value
          obj.coursePackage = (this.getCustomTargetObjByString(obj.coursePackage,2)).value
          if(obj.classType==1){ // 周期课
            obj.schedulesTmp = ""
            obj.schedulesCycle = obj.schedulesCycle[0]
          }else{
            obj.schedulesCycle = ""
            obj.schedulesTmp = obj.schedulesTmp[0]
          }
          obj.teacher = this.getCustomTargetObjByString(obj.teacher.label,5)
          obj.teacher.id = obj.teacher.value
          obj.courseTable = COURSE_TABLE_CUSTOM
          updateSchedule(qs.stringify({
            schedule: obj
          })).then(res=>{
            if(res.code==SUCCESS_CODE){
              promptUtil.success(this,'修改成功')
              this.clearPackageClassTeacher()
              this.getSchedulesArrayWithFrame(promptUtil.loading(this), 0)
            }
          }).catch(err=>{
            promptUtil.LOG("updateSchedule-err",err)
          })
          this.showOrHideCustomEditDialog(false)
        }else{
          promptUtil.wait(this)
        }
      },
      // 编辑当前任务调度
      editCurrentSchedules(){
        if(this.targetSchedule){
          const obj = staticUtil.clone(this.ruleForm)
          obj.desc = obj.desc ? obj.desc : ""
          obj.id = this.targetSchedule.raw.id
          obj.classType = obj.classType ? 1: 0
          obj.courseType = (this.getTargetObjByString(obj.courseType,4)).value
          obj.classroom = (this.getTargetObjByString(obj.classroom,1)).value
          obj.courseStage = (this.getTargetObjByString(obj.courseStage,3)).value
          obj.coursePackage = (this.getTargetObjByString(obj.coursePackage,2)).value
          if(obj.classType==1){ // 周期课
            obj.schedulesTmp = ""
            obj.schedulesCycle = obj.schedulesCycle[0]
          }else{
            obj.schedulesCycle = ""
            obj.schedulesTmp = obj.schedulesTmp[0]
          }
          obj.teacher = this.getTargetObjByString(obj.teacher.label,5)
          obj.teacher.id = obj.teacher.value
          obj.courseTable = COURSE_TABLE_SYSTEM
          updateSchedule(qs.stringify({
            schedule: obj
          })).then(res=>{
            if(res.code==SUCCESS_CODE){
              promptUtil.success(this,'修改成功')
              this.clearPackageClassTeacher()
              this.getSchedulesArrayWithFrame(promptUtil.loading(this), 0)
            }
          }).catch(err=>{
            promptUtil.LOG("updateSchedule-err",err)
          })
          this.showOrHideEditDialog(false)
        }else{
          promptUtil.wait(this)
        }
      },
      // 自定义通过字符串找到对象
      getCustomTargetObjByString(value, type){
        if(this.addSchedulesBaseInfo){
          if(type==1){ // classroomArray
            let classObj = this.addSchedulesBaseInfo.classroomSelfArray.find(item=> item.label==value)
            if(!classObj || classObj==null || classObj==[]){
              classObj = this.addSchedulesBaseInfo.classroomSelfArray.find(item=> item.value==value)
            }
            return classObj
          } else if (type==2){ // courseArray
            let teaObj = this.addSchedulesBaseInfo.courseSelfArray.find(item=> item.label==value)
            if(!teaObj || teaObj==null || teaObj==[]){
              teaObj = this.addSchedulesBaseInfo.courseSelfArray.find(item=> item.value==value)
            }
            return teaObj
          } else if (type==3){ // courseStageArray
            let courseObj = this.addSchedulesBaseInfo.courseSelfStageArray.find(item=> item.label==value)
            if(!courseObj || courseObj==null || courseObj==[]){
              courseObj = this.addSchedulesBaseInfo.courseSelfStageArray.find(item=> item.value==value)
            }
            return courseObj
          } else if (type==4){ // courseTypeArray
            let typeObj = this.addSchedulesBaseInfo.courseSelfTypeArray.find(item=> item.label==value)
            if(!typeObj || typeObj==null || typeObj==[]){
              typeObj = this.addSchedulesBaseInfo.courseSelfTypeArray.find(item=> item.value==value)
            }
            return typeObj
          } else if (type==5){ // teacherArray
            let teachObj = this.addSchedulesBaseInfo.teacherSelfArray.find(item=> item.label==value)
            if(!teachObj || teachObj==null || teachObj==[]){
              teachObj = this.addSchedulesBaseInfo.teacherSelfArray.find(item=> item.value==value)
            }
            return teachObj
          }
        }else{
          return {value:0}
        }
      },
      // 通过字符串找到对象
      getTargetObjByString(value, type){
        if(this.addSchedulesBaseInfo){
          if(type==1){ // classroomArray
            let classObj = this.addSchedulesBaseInfo.classroomArray.find(item=> item.label==value)
            if(!classObj || classObj==null || classObj==[]){
              classObj = this.addSchedulesBaseInfo.classroomArray.find(item=> item.value==value)
            }
            return classObj
          } else if (type==2){ // courseArray
            const teacherObjArr = []
            this.addSchedulesBaseInfo.courseArray.map(item=>{
              item.options.map(val=>teacherObjArr.push(val))
            })
            let teaObj = teacherObjArr.find(item=> item.label==value)
            if(!teaObj || teaObj==null || teaObj==[]){
              teaObj = teacherObjArr.find(item=> item.value==value)
            }
            return teaObj
          } else if (type==3){ // courseStageArray
            let courseObj = this.addSchedulesBaseInfo.courseStageArray.find(item=> item.label==value)
            if(!courseObj || courseObj==null || courseObj==[]){
              courseObj = this.addSchedulesBaseInfo.courseStageArray.find(item=> item.value==value)
            }
            return courseObj
          } else if (type==4){ // courseTypeArray
            let typeObj = this.addSchedulesBaseInfo.courseTypeArray.find(item=> item.label==value)
            if(!typeObj || typeObj==null || typeObj==[]){
              typeObj = this.addSchedulesBaseInfo.courseTypeArray.find(item=> item.value==value)
            }
            return typeObj
          } else if (type==5){ // teacherArray
            let teachObj = this.addSchedulesBaseInfo.teacherArray.find(item=> item.label==value)
            if(!teachObj || teachObj==null || teachObj==[]){
              teachObj = this.addSchedulesBaseInfo.teacherArray.find(item=> item.value==value)
            }
            return teachObj
          }
        }else{
          return {value:0}
        }
      },
      // 添加新任务调度
      addNewSchedules(){
        this.$refs['ruleForm'].validate((valid) => {
          if(this.ruleForm.classType){ // 证明周期课
            if(!this.ruleForm.courseCycle || this.ruleForm.courseCycle=='' || this.ruleForm.courseCycle*1 <= 0){
              promptUtil.warning(this, '请正确填写课程周期')
            }else{
              this.ruleForm.courseCycle = this.ruleForm.courseCycle * 1
            }
          }
          if (valid && this.validRuleFormData()) {
            this.formatRuleFormData() // 格式化ruleForm数据格式，用于发送到服务端
            // getObjById 1课程包 2阶段 3教师 4班级
            // 课程包对象
            const courseObj = this.getObjById(this.ruleForm.coursePackage,1)
            // 课程阶段对象
            const stageObj = this.getObjById(this.ruleForm.courseStage,2)
            // 授课教师对象
            const teacherObj = this.getObjById(this.ruleForm.teacher.id,3)
            // 授课班级对象
            const classroomObj = this.getObjById(this.ruleForm.classroom,4)
            const schedulesArray = []
            if(!this.ruleForm.classType){ // 临时课 true
              this.ruleForm.schedulesTmp.map(item=>{
                item.create_id = storageUtil.readTeacherInfo().id
                item.create_name = storageUtil.readTeacherInfo().real_name
                item.cycle = 0 // 临时课
                item.courseObj = courseObj
                item.stageObj = stageObj
                item.teacherObj = teacherObj
                item.classroomObj = classroomObj
                item.desc = this.ruleForm.desc ? this.ruleForm.desc : ''
                item.currentStuNum = this.ruleForm.student
                item.totalStuNum = this.ruleForm.student
                item.courseType = this.ruleForm.courseType
                const obj = {
                  id: this.genSchedulesId(teacherObj.value),
                  bgColor: teacherObj.color,
                  calendarId: storageUtil.readTeacherInfo().school_id,
                  category: 'time',
                  raw: item,
                  start: item.day+" "+item.startTime,
                  end: item.day+" "+item.endTime
                }
                schedulesArray.push(obj)
              })
            }else{ // 周期课程 false
              const weekOffset = 7*24*3600*1000  // 一周的时间戳
              this.ruleForm.schedulesCycle.map(item=>{
                let cycleSum = 0
                while(cycleSum!=this.ruleForm.courseCycle){
                  item.create_id = storageUtil.readTeacherInfo().id
                  item.create_name = storageUtil.readTeacherInfo().real_name
                  item.cycle = 1 // 周期课
                  item.courseObj = courseObj
                  item.stageObj = stageObj
                  item.teacherObj = teacherObj
                  item.classroomObj = classroomObj
                  item.desc = this.ruleForm.desc ? this.ruleForm.desc : ''
                  item.currentStuNum = this.ruleForm.student
                  item.totalStuNum = this.ruleForm.student
                  item.courseType = this.ruleForm.courseType
                  item.timestamp = item.timestamp + ((cycleSum == 0) ? 0 : weekOffset)
                  const obj = {
                    id: this.genSchedulesId(teacherObj.value,item.timestamp),
                    bgColor: teacherObj.color,
                    calendarId: storageUtil.readTeacherInfo().school_id,
                    raw: item,
                    category: 'time',
                    start: this.getItemStarTimestamp(item.timestamp,item.startTime),
                    end: this.getItemStarTimestamp(item.timestamp,item.endTime)
                  }
                  schedulesArray.push(obj)
                  cycleSum = cycleSum + 1
                }
              })
            }
            const loading = promptUtil.loading(this)
            // console.log("课程数组schedulesArray",schedulesArray)
            schedulesArray.forEach(item=>{
              this.weekScheduleIds.push({
                id:item.id,
                calendarId:item.calendarId,
                teacherId:item.raw.teacherObj.value,
                packageId:item.raw.courseObj.value,
                classroomId:item.raw.classroomObj.value
              })
            })
            addSchedules(qs.stringify({
              data:schedulesArray
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                promptUtil.success(this,'添加成功')
                this.clearPackageClassTeacher()
                this.getSchedulesArrayWithFrame(promptUtil.loading(this), 0)
                this.showOrHideAddDialog(false)
                // schedulesArray.map(schedule=>{
                //   if(res.data&&res.data!='[]'){
                //     const resObj = res.data.find(item=>item.code==schedule.id)
                //     schedule.raw.id = resObj.id
                //   }
                // })
                // this.showOrHideAddDialog(false)
                // this.calendar.createSchedules(schedulesArray)
              }else{
                if(res.code==ERROR_CODE){
                  promptUtil.warning(this,res.msg)
                }else{
                  promptUtil.wait(this)
                }
              }
              loading.close()
            }).catch(err=>{
              promptUtil.LOG("addSchedules-err",err)
              loading.close()
            })
          } else {
            promptUtil.warning(this, '请正确填写必要信息')
            return false
          }
        })
      },
      // 添加自定义新任务调度
      addNewCustomSchedules(){
        this.$refs['customRuleForm'].validate((valid) => {
          if(this.customRuleForm.classType){ // 证明周期课
            if(!this.customRuleForm.courseCycle || this.customRuleForm.courseCycle=='' || this.customRuleForm.courseCycle*1 <= 0){
              promptUtil.warning(this, '请正确填写课程周期')
            }else{
              this.customRuleForm.courseCycle = this.customRuleForm.courseCycle * 1
            }
          }
          if (valid && this.validCustomRuleFormData()) {
            this.formatCustomRuleFormData() // 格式化ruleForm数据格式，用于发送到服务端
            // getObjById 1课程包 2阶段 3教师 4班级
            // 课程包对象
            const courseObj = this.getCustomObjById(this.customRuleForm.coursePackage,1)
            // 课程阶段对象
            const stageObj = this.getCustomObjById(this.customRuleForm.courseStage,2)
            // 授课教师对象
            const teacherObj = this.getCustomObjById(this.customRuleForm.teacher.id,3)
            // 授课班级对象
            const classroomObj = this.getCustomObjById(this.customRuleForm.classroom,4)
            const schedulesArray = []
            if(!this.customRuleForm.classType){ // 临时课 true
              this.customRuleForm.schedulesTmp.map(item=>{
                item.create_id = storageUtil.readTeacherInfo().id
                item.create_name = storageUtil.readTeacherInfo().real_name
                item.cycle = 0 // 临时课
                item.courseObj = courseObj
                item.stageObj = stageObj
                item.teacherObj = teacherObj
                item.classroomObj = classroomObj
                item.desc = this.customRuleForm.desc ? this.customRuleForm.desc : ''
                item.currentStuNum = this.customRuleForm.student
                item.totalStuNum = this.customRuleForm.student
                item.courseType = this.customRuleForm.courseType
                const obj = {
                  id: this.genSchedulesId(teacherObj.value),
                  bgColor: teacherObj.color,
                  calendarId: storageUtil.readTeacherInfo().school_id,
                  category: 'time',
                  raw: item,
                  start: item.day+" "+item.startTime,
                  end: item.day+" "+item.endTime
                }
                schedulesArray.push(obj)
              })
            }else{ // 周期课程 false
              const weekOffset = 7*24*3600*1000  // 一周的时间戳
              this.customRuleForm.schedulesCycle.map(item=>{
                let cycleSum = 0
                while(cycleSum!=this.customRuleForm.courseCycle){
                  item.create_id = storageUtil.readTeacherInfo().id
                  item.create_name = storageUtil.readTeacherInfo().real_name
                  item.cycle = 1 // 周期课
                  item.courseObj = courseObj
                  item.stageObj = stageObj
                  item.teacherObj = teacherObj
                  item.classroomObj = classroomObj
                  item.desc = this.customRuleForm.desc ? this.customRuleForm.desc : ''
                  item.currentStuNum = this.customRuleForm.student
                  item.totalStuNum = this.customRuleForm.student
                  item.courseType = this.customRuleForm.courseType
                  item.timestamp = item.timestamp + ((cycleSum == 0) ? 0 : weekOffset)
                  const obj = {
                    id: this.genSchedulesId(teacherObj.value,item.timestamp),
                    bgColor: teacherObj.color,
                    calendarId: storageUtil.readTeacherInfo().school_id,
                    raw: item,
                    category: 'time',
                    start: this.getItemStarTimestamp(item.timestamp,item.startTime),
                    end: this.getItemStarTimestamp(item.timestamp,item.endTime)
                  }
                  schedulesArray.push(obj)
                  cycleSum = cycleSum + 1
                }
              })
            }
            const loading = promptUtil.loading(this)
            // console.log("课程数组schedulesArray",schedulesArray)
            schedulesArray.forEach(item=>{
              this.weekScheduleIds.push({
                id:item.id,
                calendarId:item.calendarId,
                teacherId:item.raw.teacherObj.value,
                packageId:item.raw.courseObj.value,
                classroomId:item.raw.classroomObj.value
              })
            })
            addSchedules(qs.stringify({
              data:schedulesArray
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                promptUtil.success(this,'添加成功')
                this.clearPackageClassTeacher()
                this.getSchedulesArrayWithFrame(promptUtil.loading(this), 0)
                this.showOrHideAddDialog(false)
              }else{
                if(res.code==ERROR_CODE){
                  promptUtil.warning(this,res.msg)
                }else{
                  promptUtil.wait(this)
                }
              }
              loading.close()
            }).catch(err=>{
              promptUtil.LOG("addSchedules-err",err)
              loading.close()
            })
          } else {
            promptUtil.warning(this, '请正确填写必要信息')
            return false
          }
        })
      },
      // 初始化calendar
      initCalendar(){
        this.calendar = this.getCalendar()
        this.calendar.on('beforeCreateSchedule', (event) =>{
          this.schedulesDate.start = event.start._date
          this.schedulesDate.end = event.end._date
          const triggerEventName = event.triggerEventName
          this.currentSelectTimeId = "."+event.guide.guideElement.className
          if (triggerEventName==='mouseup' || triggerEventName==='click') { // 单击一次
            this.initRuleFormData()
            this.getSchedulesBaseDataFromServer('add')
          }
        });
        this.calendar.on('clickSchedule', (event) => {
          // const schedule = event.schedule
          // if(schedule.isFocused){ // 当前选中的
          //   this.showOrHideManageDialog(true,this.targetSchedule)
          // }else{
          //   if (this.targetSchedule) { // 增加当前焦点
          //     this.calendar.updateSchedule(this.targetSchedule.id, this.targetSchedule.calendarId, {
          //       isFocused: false
          //     });
          //   }
          //   this.calendar.updateSchedule(schedule.id, schedule.calendarId, {
          //     isFocused: true
          //   });
            $("#"+this.currentSelectScheduleId).remove();
            this.currentSelectScheduleId = ""
            this.targetSchedule = event.schedule
            this.showOrHideManageDialog(true,this.targetSchedule)
          // }
        });
        // this.calendar.on('clickTimezonesCollapseBtn', (clickTimezonesCollapseBtn) => {
        //   console.log("clickTimezonesCollapseBtn",clickTimezonesCollapseBtn)
        // });
        this.calendar.on('beforeUpdateSchedule', (event) =>{
          this.targetSchedule = event.schedule
          if(!this.isUpdateCourse()){
            return
          }
          let startTime = event.start
          let endTime = event.end
          this.updateScheduleTime.startTime = startTime
          this.updateScheduleTime.endTime = endTime
          this.updateScheduleTime.id = this.targetSchedule.id
          this.updateScheduleTime.calendarId = this.targetSchedule.calendarId
          this.updateScheduleDialogVisible = true
          this.updateScheduleContent = "确定要将该课的课程结束时间修改为:"+moment(new Date(endTime).getTime()).format('HH:mm')+"吗?"
        });
      },
      handleUpdateScheduleTime(){
        let day = ""
        let week = ""
        const {startTime,endTime,id,calendarId} = this.updateScheduleTime
        if(this.targetSchedule.raw.cycle==1){ // 周期课
          week = this.getWeekValueWithString(this.getWeekWithString(moment(new Date(startTime).getTime()).format("dddd")))
        }else { // 临时课
          day = moment(new Date(startTime).getTime()).format("YYYY-MM-DD")
        }
        updateScheduleByDate(qs.stringify({
          calendar_id: this.targetSchedule.raw.id,
          startTime: moment(new Date(startTime).getTime()).format("HH:mm"),
          endTime: moment(new Date(endTime).getTime()).format("HH:mm"),
          classType: this.targetSchedule.raw.cycle,
          week: week,
          day: day
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.calendar.updateSchedule(id,calendarId, {
              start: startTime,
              end: endTime
            });
            // console.log("this.targetSchedule",this.targetSchedule)
            this.initSchedulesArray.map(item=>{
              if(item.id==this.targetSchedule.id){
                item.end = moment(new Date(endTime).getTime()).format("YYYY-MM-DD HH:mm:ss")
                item.raw.endTime= moment(new Date(endTime).getTime()).format("HH:mm")
              }
            })
            promptUtil.success(this,'修改成功')
          }else if(res.code==ERROR_CODE){
            promptUtil.warning(this, res.msg)
          }
        }).catch(err=>{
          promptUtil.LOG("updateScheduleByDate-err",err)
        })
        this.updateScheduleDialogVisible = false
      },
      // 显示或隐藏管理课程对框框 true 显示， false隐藏
      showOrHideManageDialog(status,schedule=null){
        if(status){
          this.initManageRuleFormData(schedule,status)
        }else{
          if(this.targetSchedule.raw.status==0){ // 已经结课 无法修改
            this.dialogManageVisible = status
            return
          }
          const objArray = []
          this.coursePackageWithStage.map(item=>{
            item.options.map(itemOpt=>{
              objArray.push(itemOpt)
            })
          })
          this.targetEditType = objArray[0].table
          const tableData = this.managerTableData
          let packageId = this.currentSelectPackageFromManager
          try{
            packageId = this.getPackageObjByStringFromCalendar(this.currentSelectPackageFromManager).value
          }catch (e) {}
          const packageCourseId = packageId
          this.currentSelectPackageFromManager = packageCourseId
          const courseObj = objArray.find(item => item.value == this.currentSelectPackageFromManager)
          if(this.targetSchedule){
            this.updateScheduleObj = {
              maxStudent:this.targetSchedule.raw.totalStuNum, // 当前班级允许加入最大学生数
              curStudent:this.targetSchedule.raw.currentStuNum, // 当前班级已经加入的学生数
              courseTypeId: this.targetSchedule.raw.courseType, // 课程类型id
              packageId: packageCourseId, // 当前点选的课程id
              teacherObj:this.targetSchedule.raw.teacherObj, // 当前授课教师对象
              courseStage:this.targetSchedule.raw.stageObj, // 当前课程阶段对象
              classRoom: this.targetSchedule.raw.classroomObj, // 当前课程班级对象
              timestamp: this.targetSchedule.raw.timestamp, // 当前课程时间戳
              startTime: this.targetSchedule.raw.startTime,
              endTime: this.targetSchedule.raw.endTime,
              desc: this.targetSchedule.raw.desc,
              cycle: this.targetSchedule.raw.cycle
            }
          }
          if(schedule){ // 存在时进行修改  不存在时表明只需要关闭对话框
            updateManageDetailData(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              calendar_id: schedule.raw.id,
              students:JSON.stringify(tableData),
              package_id: packageCourseId
            })).then(res=>{
              if(res.code==SUCCESS_CODE){
                // 找到需要删除obj进行临时存储
                const tmpScheduleObj = this.initSchedulesArray.find(item=>item.id==schedule.id)
                tmpScheduleObj.raw.courseObj = courseObj
                tmpScheduleObj.raw.currentStuNum = tableData&&tableData.length>=0 ? tableData.length : 0 // 指定当前班级中的学生数
                this.calendar.updateSchedule(schedule.id, schedule.calendarId,tmpScheduleObj)
                // 删除数组中指定的那一个数据
                this.initSchedulesArray.splice(this.initSchedulesArray.findIndex(item=>item.id==schedule.id),1)
                // 向数组中添加修改后的值
                this.initSchedulesArray.push(tmpScheduleObj)
              }else if (res.code==ERROR_CODE){
                promptUtil.warning(this,res.msg)
              }
            }).catch(err=>{
              promptUtil.LOG("updateManageDetailData-err",err)
            })
          }
          this.dialogManageVisible = status
          if(!this.dialogManageVisible){
            const loading = promptUtil.loading(this)
            this.bindMouseEnterAndLeaveEvent(loading)
          }
        }
      },
      // 显示或隐藏自定义编辑对话框  true 显示， false隐藏
      showOrHideCustomEditDialog(status, info=null){
        try{
          this.customRuleForm.teacher.id = "";
          this.$refs['customRuleEditForm'].resetFields();
        }catch (e) {} finally {
          if (status) { // 打开编辑课程页面
            this.customRuleForm.coursePackage = this.getCustomPackageObjById(this.updateScheduleObj.packageId * 1,1).label
            this.customRuleForm.courseType = this.getCustomCourseTypeInfo(this.updateScheduleObj.courseTypeId * 1).label
            this.customRuleForm.courseStage = this.getCustomCourseStageById(this.updateScheduleObj.courseStage.value * 1).label
            // this.ruleForm.classroom = this.updateScheduleObj.classRoom.value * 1
            this.customRuleForm.student = this.updateScheduleObj.maxStudent * 1
            this.customRuleForm.teacher = {
              id: this.getCustomTeacherObjById(this.updateScheduleObj.teacherObj.value * 1).label,
              label:this.getCustomTeacherObjById(this.updateScheduleObj.teacherObj.value * 1).label,
              color:this.getCustomColorByTeacherId(this.updateScheduleObj.teacherObj.value)
            }
            this.customRuleForm.classType = this.updateScheduleObj.cycle * 1 == 1 ? true : false
            this.customRuleForm.desc = this.updateScheduleObj.desc
            if (this.customRuleForm.classType) {
              // console.log("this.ruleForm.schedulesCycle",this.ruleForm.schedulesCycle)
              this.customRuleForm.schedulesCycle[0].day = moment(this.updateScheduleObj.timestamp).format("YYYY-MM-DD")
              this.customRuleForm.schedulesCycle[0].startTime = this.updateScheduleObj.startTime
              this.customRuleForm.schedulesCycle[0].endTime = this.updateScheduleObj.endTime
              this.customRuleForm.schedulesCycle[0].startRuleTime = "08:00"
              this.customRuleForm.schedulesCycle[0].endRuleTime = "08:00"
              this.customRuleForm.schedulesCycle[0].timestamp = this.updateScheduleObj.timestamp
              this.customRuleForm.schedulesCycle[0].week = this.getWeekValueWithString(this.getWeekWithString(moment(this.updateScheduleObj.timestamp).format("dddd")))
              // this.getWeekValueWithString(this.ruleForm.schedulesCycle[0].week)
            } else {
              this.customRuleForm.schedulesTmp[0].day = moment(this.updateScheduleObj.timestamp).format("YYYY-MM-DD")
              this.customRuleForm.schedulesTmp[0].startTime = this.updateScheduleObj.startTime
              this.customRuleForm.schedulesTmp[0].endTime = this.updateScheduleObj.endTime
              this.customRuleForm.schedulesTmp[0].startRuleTime = "08:00"
              this.customRuleForm.schedulesTmp[0].endRuleTime = "08:00"
              this.customRuleForm.schedulesTmp[0].timestamp = this.updateScheduleObj.timestamp
            }
            getClassByTeacher(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id: this.updateScheduleObj.teacherObj.value * 1//this.ruleForm.teacher.id
            })).then(res => {
              if (res.code == SUCCESS_CODE) {
                if (res.data && res.data != '[]') {
                  this.addSchedulesBaseInfo.classroomSelfArray = this.getDataReturnArray(res.data)
                  this.customRuleForm.classroom = this.getCustomClassRoomObjById(this.updateScheduleObj.classRoom.value * 1).label
                }
              }
              // this.isShowClassRoom = true
            }).catch(err => {
              promptUtil.LOG("getClassByTeacher-err",err)
            })
          }
        }
        this.dialogCustomEditClassVisible = status
        if(!this.dialogCustomEditClassVisible){
          const loading = promptUtil.loading(this)
          this.bindMouseEnterAndLeaveEvent(loading)
        }
      },
      // 显示或隐藏编辑对话框  true 显示， false隐藏
      showOrHideEditDialog(status, info=null){
        try{
          this.ruleForm.teacher.id = "";
          this.$refs['ruleEditForm'].resetFields();
        }catch (e) {} finally {
          if (status) { // 打开编辑课程页面
            // console.log("this.updateScheduleObj", this.updateScheduleObj)
            this.ruleForm.coursePackage = this.getPackageObjById(this.updateScheduleObj.packageId * 1).label
            this.ruleForm.courseType = this.getCourseTypeInfo(this.updateScheduleObj.courseTypeId * 1).label
            this.ruleForm.courseStage = this.getCourseStageById(this.updateScheduleObj.courseStage.value * 1).label
            // this.ruleForm.classroom = this.updateScheduleObj.classRoom.value * 1
            this.ruleForm.student = this.updateScheduleObj.maxStudent * 1
            this.ruleForm.teacher = {
              id: this.getTeacherObjById(this.updateScheduleObj.teacherObj.value * 1).label,
              label:this.getTeacherObjById(this.updateScheduleObj.teacherObj.value * 1).label,
              color:this.getColorByTeacherId(this.updateScheduleObj.teacherObj.value)
            }
            this.ruleForm.classType = this.updateScheduleObj.cycle * 1 == 1 ? true : false
            this.ruleForm.desc = this.updateScheduleObj.desc
            if (this.ruleForm.classType) {
              // console.log("this.ruleForm.schedulesCycle",this.ruleForm.schedulesCycle)
              this.ruleForm.schedulesCycle[0].day = moment(this.updateScheduleObj.timestamp).format("YYYY-MM-DD")
              this.ruleForm.schedulesCycle[0].startTime = this.updateScheduleObj.startTime
              this.ruleForm.schedulesCycle[0].endTime = this.updateScheduleObj.endTime
              this.ruleForm.schedulesCycle[0].startRuleTime = "08:00"
              this.ruleForm.schedulesCycle[0].endRuleTime = "08:00"
              this.ruleForm.schedulesCycle[0].timestamp = this.updateScheduleObj.timestamp
              this.ruleForm.schedulesCycle[0].week = this.getWeekValueWithString(this.getWeekWithString(moment(this.updateScheduleObj.timestamp).format("dddd")))
              // this.getWeekValueWithString(this.ruleForm.schedulesCycle[0].week)
            } else {
              this.ruleForm.schedulesTmp[0].day = moment(this.updateScheduleObj.timestamp).format("YYYY-MM-DD")
              this.ruleForm.schedulesTmp[0].startTime = this.updateScheduleObj.startTime
              this.ruleForm.schedulesTmp[0].endTime = this.updateScheduleObj.endTime
              this.ruleForm.schedulesTmp[0].startRuleTime = "08:00"
              this.ruleForm.schedulesTmp[0].endRuleTime = "08:00"
              this.ruleForm.schedulesTmp[0].timestamp = this.updateScheduleObj.timestamp
            }
            getClassByTeacher(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id: this.updateScheduleObj.teacherObj.value * 1//this.ruleForm.teacher.id
            })).then(res => {
              if (res.code == SUCCESS_CODE) {
                if (res.data && res.data != '[]') {
                  this.addSchedulesBaseInfo.classroomArray = this.getDataReturnArray(res.data)
                  this.ruleForm.classroom = this.getClassRoomObjById(this.updateScheduleObj.classRoom.value * 1).label
                }
              }
              // this.isShowClassRoom = true
            }).catch(err => {
              promptUtil.LOG("getClassByTeacher-err",err)
            })
          }
        }
        this.dialogEditClassVisible = status
        if(!this.dialogEditClassVisible){
          const loading = promptUtil.loading(this)
          this.bindMouseEnterAndLeaveEvent(loading)
        }
      },
      // 显示或隐藏添加对话框  true 显示， false隐藏
      showOrHideAddDialog(status){
        try{
          this.ruleForm.teacher.id = "";
          this.$refs['ruleForm'].resetFields();
          this.customRuleForm.teacher.id = "";
          this.$refs['customRuleForm'].resetFields();
        }catch (e) {} finally {
          if(!status){
            $(this.currentSelectTimeId).remove();
          }
          this.dialogClassVisible = status
        }
      },
      // 获取新的周期课数据
      getCycleClassData(id, startTime, endTime, startRuleTime = '08:00',  endRuleTime = '08:00'){
        const obj = {
          id: id, // 排课id
          week:'', //星期几
          timestamp: '', // 具体时间 时间戳
          startTime: startTime, // 起始时间
          startRuleTime: startRuleTime,
          endRuleTime: endRuleTime,
          endTime: endTime, // 结束时间
          last: 1 // 是否是最后一项
        }
        return obj
      },
      // 获取新的临时课数据
      getTmpClassData(id, startTime, endTime, startRuleTime = '08:00',  endRuleTime = '08:00') {
        const obj = {
          id: id, // 排课id
          day: '', // 具体时间 时间戳
          startTime: startTime, // 起始时间
          endTime: endTime, // 结束时间
          startRuleTime: startRuleTime, // 规定起始时间
          endRuleTime: endRuleTime, //规定结束时间
          last: 1, // 是否为最后一个 1 不是 0 是
        }
        return obj
      },
      // 初始化manageRuleForm数据
      initManageRuleFormData(schedule, isShow){
        let courseTableType = COURSE_TABLE_SYSTEM
        if(schedule.raw.courseObj.table){
          courseTableType = schedule.raw.courseObj.table
        }
        const loading = promptUtil.loading(this)
        getIntoManageDetailData(qs.stringify({
          course_table: courseTableType,
          school_id:storageUtil.readTeacherInfo().school_id,
          calendar_id: schedule.raw.id
        })).then(res=>{
          //status: 0-》未指定  1-》出勤 2-》缺勤 3-》请假
          //type: 1 固定班 0临时班
          if(res.code==SUCCESS_CODE){
            if(courseTableType==COURSE_TABLE_SYSTEM){ // 系统课程
              this.targetEditScheduleType = 0
            } else if (courseTableType==COURSE_TABLE_CUSTOM){ // 自定义课程
              this.targetEditScheduleType = 1
            }
            this.coursePackageWithStage = res.data.coursePackageWithStage
            this.currentSelectPackageFromManager = this.getPackageObjByIdFromCalendar(res.data.currentSelectPackageFromManager * 1 ).label// 页面当前选中的课程
            this.studentArrayWithManager = res.data.studentArrayOption // 班级学生 select
            this.managerTableData = res.data.studentArrayWithManager // 插入班级学生 table
          }
          this.handleCurrentManageChange(this.currentManagePage)
          this.dialogManageVisible = isShow
          loading.close()
        }).catch(err=>{
          promptUtil.LOG("getIntoManageDetailData-err",err)
          loading.close()
        })
        getSchoolAllSchedules(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.setSchoolSchedulesData(res.data)
            }
          }
        }).catch(err=>{
          promptUtil.LOG("getSchoolAllSchedules-err",err)
        })
      },
      setSchoolSchedulesData(data){
        this.allSchoolCourseData = []
        data.map(item=>{
          const startTime = moment(item.start_time*1000).format("YYYY/MM/DD HH:mm")
          const endTime = moment(item.end_time*1000).format("HH:mm")
          const week = this.getWeekWithString(moment(item.start_time*1000).format("dddd"))
          const obj = {
            data : startTime + "—" + endTime + "(" + week + ")",
            course : item.course_name,
            room : item.class_name,
            teacher : item.teacher_name,
            color : item.color,
            classroom: item.class_id,
            id : item.id
          }
          if(this.targetSchedule.raw.id!=item.id){ // 将当前点选的课程排除
            this.allSchoolCourseData.push(obj)
          }
        })
      },
      tableRowClassName({row, column, rowIndex, columnIndex}){
        return "color:"+row.color
      },
      // 当某一行被点击时会触发该事件
      tableScheduleRowClick(row, column, event){
        // console.log("====tableScheduleRowClick",row)
        // console.log("====currentStudentWithChangeClass",this.currentStudentWithChangeClass)
        studentChangeClassroom(qs.stringify({
          cs_id: this.currentStudentWithChangeClass.cs_id,
          calendar_id: row.id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            this.resetManageClassDialog()
            promptUtil.success(this, '转班成功')
          }
          this.resetManageClassDialog()
        }).catch(err=>{
          this.resetManageClassDialog()
          promptUtil.LOG("studentChangeClassroom-err",err)
        })
      },
      // 在管理页面中添加学生操作时触发 0 临时添加 1 正式添加（所有周期课都加入到班级中）
      onClickManagerAddClass(type){
        if(!this.isUpdateCourse()){ // 已经结课 无法修改
          return
        }
        if(this.currentStudentWithManager){
          const studentsArray = []
          this.studentArrayWithManager.map(item=>{
            item.options.map(stu=>{
              stu.who = item.label=="本班学生" ? 1 : 0
              studentsArray.push(stu)
            })
          })
          const stuObj = studentsArray.find(item=>{
            return item.value==this.currentStudentWithManager
          })
          stuObj.status = 0   // 0-》未指定  1-》出勤 2-》缺勤 3-》请假
          stuObj.type = type
          this.studentArrayWithManager.map(item=>{
            item.options.splice(item.options.findIndex(stu=>stu.value==this.currentStudentWithManager),1)
          })
          // this.studentArrayWithManager.splice(this.studentArrayWithManager.findIndex(item=>item.value==this.currentStudentWithManager),1)
          this.currentStudentWithManager = ""
          this.currentStudentWIthManagerObj = stuObj
          this.managerTableData.push(stuObj)
          this.handleCurrentManageChange(this.currentManagePage)
        }else{
          promptUtil.warning(this,'请选择学生')
        }
      },
      // 初始化ruleForm数据
      initRuleFormData(){
        this.isShowCourseStage = false // 是否显示课程阶段
        this.isShowClassRoom = false // 是否显示授课班级
        this.isShowSelfCourseStage = false // 是否显示课程阶段
        this.isShowSelfClassRoom = false // 是否显示授课班级
        this.ruleForm = {
          desc: '',
          coursePackage: '', // 课程分类
          courseType: '', // 课程类型
          courseStage: '', // 课程阶段
          courseCycle: 1, // 课程周期
          teacher:{color:'',id:''}, // 教师
          student: 8, // 学生数量
          classroom: '', // 授课班级
          schedulesCycle: [],
          schedulesTmp: [],
          courseCycle: 1,
          classType: false, // 课程类型 true-周期课 false-临时课
        }
        this.customRuleForm = {
          coursePackage: '', // 课程分类
          courseType: '', // 课程类型
          courseStage: '', // 课程阶段
          courseCycle: 1, // 课程周期
          teacher:{color:'',id:''}, // 教师
          student: 8, // 学生数量
          classroom: '', // 授课班级
          schedulesCycle: [],
          schedulesTmp: [],
          courseCycle: 1,
          desc: '',
          classType: false, // 课程类型 true-周期课 false-临时课
        }
        this.initClassCycleOrTmp()
      },
      // 初始化周期课、临时课
      initClassCycleOrTmp(){
        this.ruleForm.schedulesCycle.push(this.getCycleClassData(Math.random()+"", '', ''))
        this.ruleForm.schedulesTmp.push(this.getTmpClassData(Math.random()+"", '', ''))
        this.customRuleForm.schedulesCycle.push(this.getCycleClassData(Math.random()+"", '', ''))
        this.customRuleForm.schedulesTmp.push(this.getTmpClassData(Math.random()+"", '', ''))
      },
      // 从服务器获取进入当前页面的基本信息
      getBaseInfoFromServer(){
        const loading = promptUtil.loading(this)
        getCalendarInitData(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.setCalendarBaseInfo(res.data)
            }
          }
          this.getSchedulesArrayWithFrame(loading,0)
        }).catch(err=>{
          promptUtil.LOG("getCalendarInitData-err",err)
          loading.close()
        })
      },
      // 从服务器获取添加任务时的基本数据
      getSchedulesBaseDataFromServer(status='add'){
        const loading = promptUtil.loading(this)
        getIntoAddSchedulesData(qs.stringify({
          school_id : storageUtil.readTeacherInfo().school_id
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.setAddSchedulesBaseData(res.data)
              if(status=='add'){ // 添加
                this.selectTabCourse = TAB_COURSE_SYSTEM
                this.initFirstCycleOrTmpData()
                this.showOrHideAddDialog(true)
              }else{ // 编辑
                this.initRuleFormData()
                this.initEditCycleOrTmpData()
                this.isShowClassAndStage(true)
                this.isShowSelfClassAndStage(true)
                if(this.targetEditType==COURSE_TABLE_SYSTEM){ // 系统课时
                  this.showOrHideEditDialog(true)
                } else if(this.targetEditType==COURSE_TABLE_CUSTOM){ // 自定义课时
                  this.showOrHideCustomEditDialog(true)
                }
              }
            }
          }
          loading.close()
        }).catch(err=>{
          promptUtil.LOG("getIntoAddSchedulesData-err",err)
          loading.close()
        })
      },
      // 是否显示课程阶段和班级
      isShowClassAndStage(classroom,stage=true){
        this.isShowClassRoom = classroom
        this.isShowCourseStage = stage
      },
      // 是否显示课程阶段和班级
      isShowSelfClassAndStage(classroom,stage=true){
        this.isShowSelfClassRoom = classroom
        this.isShowSelfCourseStage = stage
      },
      // 初始化修改课程周期和周期课中第一次时间范围设定
      initEditCycleOrTmpData(){
        const timestamp = new Date().getTime()
        const startTime = moment(timestamp).format("HH:mm")
        const endTime = moment(timestamp).format("HH:mm")
        const week = moment(timestamp).format("dddd")
        this.ruleForm.schedulesCycle[0].startTime = startTime
        this.ruleForm.schedulesCycle[0].endTime = endTime
        this.ruleForm.schedulesCycle[0].startRuleTime = startTime
        this.ruleForm.schedulesCycle[0].endRuleTime = endTime
        this.ruleForm.schedulesCycle[0].week = this.getWeekWithString(week)
        this.ruleForm.schedulesTmp[0].startTime = startTime
        this.ruleForm.schedulesTmp[0].endTime = endTime
        this.ruleForm.schedulesTmp[0].startRuleTime = startTime
        this.ruleForm.schedulesTmp[0].endRuleTime = endTime
        this.ruleForm.schedulesTmp[0].day = moment(timestamp).format("YYYY-MM-DD")
        this.customRuleForm.schedulesCycle[0].startTime = startTime
        this.customRuleForm.schedulesCycle[0].endTime = endTime
        this.customRuleForm.schedulesCycle[0].startRuleTime = startTime
        this.customRuleForm.schedulesCycle[0].endRuleTime = endTime
        this.customRuleForm.schedulesCycle[0].week = this.getWeekWithString(week)
        this.customRuleForm.schedulesTmp[0].startTime = startTime
        this.customRuleForm.schedulesTmp[0].endTime = endTime
        this.customRuleForm.schedulesTmp[0].startRuleTime = startTime
        this.customRuleForm.schedulesTmp[0].endRuleTime = endTime
        this.customRuleForm.schedulesTmp[0].day = moment(timestamp).format("YYYY-MM-DD")
      },
      // 初始化临时课和周期课中第一次时间范围设定
      initFirstCycleOrTmpData(){
        const startTime = moment(this.schedulesDate.start.getTime()).format("HH:mm")
        const endTime = moment(this.schedulesDate.end.getTime()).format("HH:mm")
        const week = moment(this.schedulesDate.start.getTime()).format("dddd")
        this.ruleForm.schedulesCycle[0].startTime = startTime
        this.ruleForm.schedulesCycle[0].endTime = endTime
        this.ruleForm.schedulesCycle[0].startRuleTime = startTime
        this.ruleForm.schedulesCycle[0].endRuleTime = endTime
        this.ruleForm.schedulesCycle[0].week = this.getWeekWithString(week)
        this.ruleForm.schedulesTmp[0].startTime = startTime
        this.ruleForm.schedulesTmp[0].endTime = endTime
        this.ruleForm.schedulesTmp[0].startRuleTime = startTime
        this.ruleForm.schedulesTmp[0].endRuleTime = endTime
        this.ruleForm.schedulesTmp[0].day = moment(this.schedulesDate.start.getTime()).format("YYYY-MM-DD")
        this.customRuleForm.schedulesCycle[0].startTime = startTime
        this.customRuleForm.schedulesCycle[0].endTime = endTime
        this.customRuleForm.schedulesCycle[0].startRuleTime = startTime
        this.customRuleForm.schedulesCycle[0].endRuleTime = endTime
        this.customRuleForm.schedulesCycle[0].week = this.getWeekWithString(week)
        this.customRuleForm.schedulesTmp[0].startTime = startTime
        this.customRuleForm.schedulesTmp[0].endTime = endTime
        this.customRuleForm.schedulesTmp[0].startRuleTime = startTime
        this.customRuleForm.schedulesTmp[0].endRuleTime = endTime
        this.customRuleForm.schedulesTmp[0].day = moment(this.schedulesDate.start.getTime()).format("YYYY-MM-DD")
      },
      // 上一周
      onClickPrev(){
        this.clearPackageClassTeacher()
        this.getSchedulesArrayWithFrame(promptUtil.loading(this), -1)
      },
      // 今天
      onClickToday(){
        this.clearPackageClassTeacher()
        this.getSchedulesArrayWithFrame(promptUtil.loading(this), 0)
      },
      // 下一周
      onClickNext(){
        this.clearPackageClassTeacher()
        this.getSchedulesArrayWithFrame(promptUtil.loading(this), 1)
      },
      //获取指定范围内的课程
      getSchedulesArrayWithFrame(loading, weekOffset, info=null){
        if(!info){
          info = {teacher_id:"",classroom_id:"",package_id:""}
        }
        // 根据courseTable字段判断自定义课程、系统课程
        let courseTable = this.currentTableName
        this.currentTimestamp = new Date().getTime()
        const currentTimestamp = this.currentTimestamp+(weekOffset*7*24*3600*1000)
        this.currentTimestamp = currentTimestamp
        this.timeFrame = this.genTimeFrameByDataPicker(currentTimestamp)
        const {startTime, endTime} = this.getTimestampByTimeString(this.timeFrame)
        // console.log("getSchedulesArrayWithFrame", this.weekScheduleIds)
        // 清空calendar中的schedules
        this.weekScheduleIds.map(item=>{
          this.calendar.deleteSchedule(item.id, item.calendarId)
        })
        // console.log("getSchedulesArrayWithFrame=>info",info)
        querySchedulesByTimestamp(qs.stringify({
          school_id:storageUtil.readTeacherInfo().school_id,
          start:startTime,
          end: endTime,
          course_table: courseTable,
          teacher_id: (info.teacher_id&&info.teacher_id!='') ? info.teacher_id : 0,
          class_id: (info.classroom_id&&info.classroom_id!='') ? info.classroom_id : 0,
          course_id: (info.package_id&&info.package_id!='') ? info.package_id : 0,
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data&&res.data!='[]'){
              this.initSchedulesArray = []
              this.weekScheduleIds = []
              res.data.forEach((item)=>{
                this.initSchedulesArray.push(item)
                this.weekScheduleIds.push({
                  id:item.id,
                  calendarId:item.calendarId,
                  teacherId:item.raw.teacherObj.value,
                  packageId:item.raw.courseObj.value,
                  classroomId:item.raw.classroomObj.value
                })
              })
            }else{ // 表明返回值为空
              this.initSchedulesArray = []
              this.weekScheduleIds = []
            }
            this.calendar.setDate(new Date(currentTimestamp))
            this.calendar.createSchedules(this.initSchedulesArray)
            // 增加鼠标移入时显示课时详情
          }
          this.bindMouseEnterAndLeaveEvent(loading)
        }).catch(err=>{
          promptUtil.LOG("querySchedulesByTimestamp-err",err)
          loading.close()
        })
      },
      // 选择课程分类时返回数据
      onChangeCoursePackage(val) {
        // console.log("选择课程分类时返回数据",val)
        this.isShowCourseStage = true
      },
      // 选择自定义课程分类时返回数据
      onChangeSelfCoursePackage(val) {
        // console.log("选择课程分类时返回数据",val)
        this.isShowSelfCourseStage = true
      },
      // 选择授课教师时返回数据
      onChangeTeacher(val) {
        this.ruleForm.teacher.id = val
        this.ruleForm.teacher.label = this.getTeacherObjById(val).label
        this.ruleForm.teacher.color = this.getColorByTeacherId(val)
        this.ruleForm.classroom = "" // 将授课班级内容清空
        getClassByTeacher(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          teacher_id: val
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.addSchedulesBaseInfo.classroomArray = this.getDataReturnArray(res.data)
            }
          }
          this.isShowClassRoom = true
        }).catch(err=>{
          promptUtil.LOG("getClassByTeacher-err",err)
        })
      },
      // 选择自定义授课教师时返回数据
      onChangeSelfTeacher(val) {
        this.customRuleForm.teacher.id = val
        this.customRuleForm.teacher.label = this.getTeacherObjById(val).label
        this.customRuleForm.teacher.color = this.getColorByTeacherId(val)
        this.customRuleForm.classroom = "" // 清空自定义班级
        getClassByTeacher(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          teacher_id: val
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            if(res.data && res.data!='[]'){
              this.addSchedulesBaseInfo.classroomSelfArray = this.getDataReturnArray(res.data)
            }
          }
          this.isShowSelfClassRoom = true
        }).catch(err=>{
          promptUtil.LOG("getClassByTeacher-err",err)
        })
      },
      // 根据课程、班级、教师进行触发
      changeScheduleBaseInfo(){
        let packageId = ''
        const packageObj = this.currentPackage
        if(packageObj.indexOf(":")>=0){ // 表明选择了指定的课时
          packageId = parseInt(packageObj.split(":")[0])
        }else{
          packageId = this.currentPackage
        }
        const obj = {package_id: packageId, classroom_id:this.currentClassroom, teacher_id:this.currentTeacher, course_table:''}
        this.getSchedulesArrayWithFrame(promptUtil.loading(this), 0, obj)
      },
      // 选择课程时触发
      onChangeSelectPackage(val){
        if(val&&val!=''){
          // id_table
          const valArr = val.split(':')
          this.currentPackage = val //parseInt(valArr[0])
          this.currentTableName = valArr[1]
        }else {
          this.currentPackage = val
          this.currentTableName = ""
        }
        this.changeScheduleBaseInfo()
      },
      // 选择授课教师时触发
      onChangeSelectTeacher(val){
        this.currentTeacher = val
        this.changeScheduleBaseInfo()
      },
      // 选择上课班级时触发
      onChangeSelectClassroom(val){
        this.currentClassroom = val
        this.changeScheduleBaseInfo()
      },
      // 验证只能输入正整数
      proving1(){
        this.customRuleForm.courseCycle = this.customRuleForm.courseCycle.replace(/[^\.\d]/g,'')
        this.customRuleForm.courseCycle = this.customRuleForm.courseCycle.replace('.','')
      },
      proving(){
        this.ruleForm.courseCycle = this.ruleForm.courseCycle.replace(/[^\.\d]/g,'')
        this.ruleForm.courseCycle = this.ruleForm.courseCycle.replace('.','')
      },
      // 选择课程周期时触发
      onChangeCourseCycle(val){
        this.ruleForm.courseCycle = val
      },
      clearPackageClassTeacher(){
        this.currentTeacher = null
        this.currentPackage = null
        this.currentClassroom = null
      },
      closeCourseShow(){
        changeTeacherCourseStatus(qs.stringify({
          calendar_id: this.targetSchedule.raw.id,
          type:1, //0上课  1结课
        })).then(res=>{
          if(res.code==SUCCESS_CODE){
            // 关闭manager对话框
            this.targetSchedule.raw.status = 0// 已经结课 无法修改
            this.delCloseCourseShow = false
            this.resetManageClassDialog(false)
          }else{
            promptUtil.warning(this,res.msg)
          }
        }).catch(err=>promptUtil.LOG("changeTeacherCourseStatus-err",err))
      },
      // 结束课程
      closeTargetCourse() {
          this.$router.push({path: '/recordDetail/' + this.targetSchedule.raw.id})
          // if(!this.isUpdateCourse()){ // 已经结课 无法修改
        //   return
        // }
        // this.delCloseCourseShow = true
      },
      // 根据点选管理页面中的课程包select后进入指定课程包
      onClickSeeCoursePackage(){
        let packageId = this.currentSelectPackageFromManager
        try{
          packageId = this.getPackageObjByStringFromCalendar(this.currentSelectPackageFromManager).value
        }catch (e) {}
        this.$router.push({
          path: "/resourcesList/" + packageId
        });
      },
      // 编辑指定排课
      editTargetSchedules(){
        if(!this.isUpdateCourse()){ // 已经结课 无法修改
          return
        }
        this.showOrHideManageDialog(false)
        this.getSchedulesBaseDataFromServer('edit')
      },
      // 删除指定排课
      delTargetSchedules(){
        if(!this.isUpdateCourse()){ // 已经结课 无法修改
          return
        }
        this.delScheduleHandle = true
        this.delManagerTableContent = "此操作将永久删除该课时及相关信息, 是否继续?"
        this.delManagerTableDialogVisible = true
      },


      // 选择日期是返回数据
      onChangeDatePicker(val) {
        this.clearPackageClassTeacher()
        if (val){
          const days = moment(new Date().getTime()).diff(moment(new Date(this.currentTimestamp).getTime()), 'days')
          this.getSchedulesArrayWithFrame(promptUtil.loading(this), -1*(Math.round(days/7)==0?0:Math.round(days/7)))
        } else {
          this.onClickToday()
        }
      },
      // 生成时间范围
      genTimeFrameByDataPicker(timestamp){
        // weekValue  1~7 星期一~星期日
        const {startTimestamp, endTimestamp} = this.genStartAndEndTimestamp(timestamp)
        return this.genTimeFrameStringWithTime(startTimestamp,endTimestamp)
      },
      // 根据时间戳生成起始和结束时间戳
      genStartAndEndTimestamp(timestamp){
        const currentTimestamp = new Date(timestamp).getTime()
        const weekValue = this.getWeekValueWithString(this.getWeekWithString(moment(currentTimestamp).format("dddd")))
        const startTimestamp = currentTimestamp - (weekValue-1)*24*3600*1000
        const endTimestamp = currentTimestamp + (7-weekValue)*24*3600*1000
        return {startTimestamp:startTimestamp, endTimestamp:endTimestamp}
      },
      // 选择课程类别时返回数据
      onChangeCourseType(val){
        this.ruleForm.courseType = val
      },
      // 选择自定义课程类别时返回数据
      onChangeSelfCourseType(val){
        this.customRuleForm.courseType = val
      },
      // 选择课程阶段时返回数据
      onChangeCourseStage(val){
        this.ruleForm.courseStage = val
      },
      // 选择自定义课程阶段时返回数据
      onChangeSelfCourseStage(val){
        this.customRuleForm.courseStage = val
      },
      // 修改学生个数时返回数据
      onChangeStudent(val){
        this.ruleForm.student = val
      },
      // 修改自定义学生个数时返回数据
      onChangeSelfStudent(val){
        this.customRuleForm.student = val
      },
      // 根据自定义teacherId返回教师颜色
      getCustomColorByTeacherId(id){
        const obj = this.addSchedulesBaseInfo.teacherSelfArray.find(item => item.value == id)
        return obj.color
      },
      // 根据teacherId返回教师颜色
      getColorByTeacherId(id){
        const obj = this.addSchedulesBaseInfo.teacherArray.find(item => item.value == id)
        return obj.color
      },
      // 根据id返回数据对象  1课程包 2阶段 3教师 4班级
      getObjById(id, type){
        switch (type) {
          case 1:
            return this.getPackageObjById(id)
          case 2:
            return this.getCourseStageById(id)
          case 3:
            return this.getTeacherObjById(id)
          case 4:
            return this.getClassRoomObjById(id)
        }
      },
      // 自定义根据id返回数据对象  1课程包 2阶段 3教师 4班级
      getCustomObjById(id, type){
        switch (type) {
          case 1:
            return this.getCustomPackageObjById(id)
          case 2:
            return this.getCustomCourseStageById(id)
          case 3:
            return this.getCustomTeacherObjById(id)
          case 4:
            return this.getCustomClassRoomObjById(id)
        }
      },
      // 完成删除课时确定操作时触发
      handleDelScheduleWithManageTable(){
        if(this.targetSchedule){
          this.weekScheduleIds.splice(this.weekScheduleIds.findIndex(item=>item.id==this.targetSchedule.id),1)
          this.calendar.deleteSchedule(this.targetSchedule.id, this.targetSchedule.calendarId)  // 删除指定排课
          this.isLoadingDelManager = true
          delScheduleById(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            calendar_id: this.targetSchedule.raw.id,
            lsxg:1 // 周期课时  仅删除其中一堂课程时 传1  其他时不传或传其他值
          })).then(res=>{
            if(res.code==SUCCESS_CODE){
              promptUtil.success(this,'课时删除成功')
              this.resetManageClassDialog(false)
            }else{
              promptUtil.success(this,'课时删除失败')
              this.resetManageClassDialog(false)
            }
            this.targetSchedule = null
            this.delScheduleHandle = false
            this.isLoadingDelManager = false
            this.delManagerTableDialogVisible = false
          }).catch(err=>{
            promptUtil.LOG("delScheduleById-err",err)
            this.targetSchedule = null
            this.delScheduleHandle = false
            this.isLoadingDelManager = false
            this.delManagerTableDialogVisible = false
          })
        }
      },
      // 完成删除确定操作时触发
      handleDelStudentWithManageTable(){
        if(!this.isUpdateCourse()){ // 已经结课 无法修改
          this.delManagerTableDialogVisible = false
          return
        }
        this.currentStudentWIthManagerObj.status = 0
        this.currentStudentWIthManagerObj.type = 0
        this.managerTableData.splice(this.managerTableData.findIndex(item=>item.value==this.currentStudentWIthManagerObj.value),1)
        if(this.currentStudentWIthManagerObj.who==1){ // 本班学生
          this.studentArrayWithManager.map(item=>{
            if(item.label=='本班学生'){
              item.options.push(this.currentStudentWIthManagerObj)
            }
          })
        } else { // 其他班学生
          this.studentArrayWithManager.map(item=>{
            if(item.label!='本班学生'){
              item.options.push(this.currentStudentWIthManagerObj)
            }
          })
        }
        // this.studentArrayWithManager.push(this.currentStudentWIthManagerObj)
        this.handleCurrentManageChange(this.currentManagePage)
        this.delManagerTableDialogVisible = false
      },
      // 从上课班级中删除掉
      removeHandleClick(obj){
        if(!this.isUpdateCourse()){ // 已经结课 无法修改
          return
        }
        this.currentStudentWIthManagerObj = obj
        this.delManagerTableContent = "您确定要将【"+this.currentStudentWIthManagerObj.label+"】从班级中移除吗？"
        this.delManagerTableDialogVisible = true
      },
      // 修改学生在班级的状态
      changeStuStatusClick(obj){
        this.currentStudentWIthManagerObj = obj
      },
      // 修改学生状态时点选对应状态后触发
      managerTableHandleCommand(command){
        if(!this.isUpdateCourse()){ // 已经结课 无法修改
          return
        }
        this.managerTableData.map(item=>{
          if(item.value==this.currentStudentWIthManagerObj.value){
            item.status = command
          }
        })
        this.handleCurrentManageChange(this.currentManagePage)
      },
      // 从课表中转移到其他班级
      changeHandleClick(obj){
        if(!this.isUpdateCourse()){
          return
        }
        this.$refs[`popover-` + obj.value].doShow()
        this.currentStudentWithChangeClass = obj
        promptUtil.LOG('currentStudentWithChangeClass',obj)
      },
      // 根据自定义课程包id返回课程对象
      getCustomPackageObjById(id){
        const obj = this.addSchedulesBaseInfo.courseSelfArray.find(item => item.value == id)
        return obj
      },
      // 根据课程包id返回课程对象
      getPackageObjById(id){
        const objArray = []
        this.addSchedulesBaseInfo.courseArray.map(item=>{
          item.options.map(itemOpt=>{
            objArray.push(itemOpt)
          })
        })
        const obj = objArray.find(item => item.value == id)
        return obj
      },
      // 根据自定义课程包id返回课程对象
      getCustomPackageObjById(id){
        const obj = this.addSchedulesBaseInfo.courseSelfArray.find(item => item.value == id)
        return obj
      },
      // 根据自定义阶段id返回阶段对象
      getCustomCourseStageById(id){
        const obj = this.addSchedulesBaseInfo.courseSelfStageArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据阶段id返回阶段对象
      getCourseStageById(id){
        const obj = this.addSchedulesBaseInfo.courseStageArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据自定义阶段id返回阶段对象
      getCustomCourseStageById(id){
        const obj = this.addSchedulesBaseInfo.courseSelfStageArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据教师id返回教师对象
      getCustomTeacherObjById(id){
        const obj = this.addSchedulesBaseInfo.teacherSelfArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据教师id返回教师对象
      getTeacherObjById(id){
        const obj = this.addSchedulesBaseInfo.teacherArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据自定义教师id返回教师对象
      getCustomTeacherObjById(id){
        const obj = this.addSchedulesBaseInfo.teacherSelfArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据班级id返回班级对象
      getClassRoomObjById(id){
        const obj = this.addSchedulesBaseInfo.classroomArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      // 根据自定义班级id返回班级对象
      getCustomClassRoomObjById(id){
        const obj = this.addSchedulesBaseInfo.classroomSelfArray.find(item=>{
          return item.value == id
        })
        return obj
      },
      isUpdateCourse(){
        if(this.targetSchedule.raw.status==0){ // 已经结课 无法修改
          promptUtil.warning(this,'该课程已结束,无法进行操作')
          return false
        } else {
          return true
        }
      },
      // 根据字符串返回星期
      getWeekWithString(str){
        switch (str) {
          case 'Monday':
            return '星期一'
          case 'Tuesday':
            return '星期二'
          case 'Wednesday':
            return '星期三'
          case 'Thursday':
            return '星期四'
          case 'Friday':
            return '星期五'
          case 'Saturday':
            return '星期六'
          case 'Sunday':
            return '星期日'
        }
      },
      // 根据字符串返回周几的值1~7
      getWeekValueWithString(str){
        switch (str) {
          case '星期一':
            return 1
          case '星期二':
            return 2
          case '星期三':
            return 3
          case '星期四':
            return 4
          case '星期五':
            return 5
          case '星期六':
            return 6
          case '星期日':
            return 7
          default:
            return str
        }
      },
      // 获取当前select选择的日期时间戳
      getCurrentTimestamp(curTimestamp,week){
        const curTimeValue = this.getWeekValueWithString(this.getWeekWithString(moment(curTimestamp).format("dddd")))
        const selTimeValue = this.getWeekValueWithString(week)
        const offsetTime = (selTimeValue - curTimeValue)*24*3600*1000 + curTimestamp
        return offsetTime
      },
      // 生成指定时间区域内的时间戳
      getItemStarTimestamp(timestamp, date){
        const yearmonthday = moment(timestamp).format("YYYY-MM-DD")
        return yearmonthday+' '+date
      },
      validRuleFormData(){
        let valid = true
        const classObjArray = []
        if(this.ruleForm.classType){ // 周期课
          if(this.ruleForm.schedulesCycle &&
            this.ruleForm.schedulesCycle.length>0 &&
            this.ruleForm.schedulesCycle[0].week &&
            this.ruleForm.schedulesCycle[0].week!="" &&
            this.ruleForm.schedulesCycle[0].startTime!="" &&
            this.ruleForm.schedulesCycle[0].startTime!="" &&
            this.ruleForm.schedulesCycle[0].endTime!="" &&
            this.ruleForm.schedulesCycle[0].endTime!=""
          ){
            this.ruleForm.schedulesCycle.map(item=>{
              classObjArray.push(item)
              if(item.week && item.week!="" && item.startTime && item.startTime!="" && item.endTime && item.endTime!=""){
              }else{
                promptUtil.warning(this, '请正确填写必要信息')
                valid = false
              }
            })
            this.ruleForm.schedulesCycle = classObjArray
          }else{
            promptUtil.warning(this, '请正确填写必要信息')
            valid = false
          }
        } else { // 临时课
          if(this.ruleForm.schedulesTmp &&
            this.ruleForm.schedulesTmp.length>0 &&
            this.ruleForm.schedulesTmp[0].day &&
            this.ruleForm.schedulesTmp[0].day!="" &&
            this.ruleForm.schedulesTmp[0].startTime!="" &&
            this.ruleForm.schedulesTmp[0].startTime!="" &&
            this.ruleForm.schedulesTmp[0].endTime!="" &&
            this.ruleForm.schedulesTmp[0].endTime!=""
          ){
            this.ruleForm.schedulesTmp.map(item=>{
              classObjArray.push(item)
              if(item.day && item.day!="" && item.startTime && item.startTime!="" && item.endTime && item.endTime!=""){
              }else{
                promptUtil.warning(this, '请正确填写必要信息')
                valid = false
              }
            })
            this.ruleForm.schedulesTmp = classObjArray
          }else{
            promptUtil.warning(this, '请正确填写必要信息')
            valid = false
          }
        }
        return valid
      },
      validCustomRuleFormData(){
        let valid = true
        const classObjArray = []
        if(this.customRuleForm.classType){ // 周期课
          if(this.customRuleForm.schedulesCycle &&
            this.customRuleForm.schedulesCycle.length>0 &&
            this.customRuleForm.schedulesCycle[0].week &&
            this.customRuleForm.schedulesCycle[0].week!="" &&
            this.customRuleForm.schedulesCycle[0].startTime!="" &&
            this.customRuleForm.schedulesCycle[0].startTime!="" &&
            this.customRuleForm.schedulesCycle[0].endTime!="" &&
            this.customRuleForm.schedulesCycle[0].endTime!=""
          ){
            this.customRuleForm.schedulesCycle.map(item=>{
              classObjArray.push(item)
              if(item.week && item.week!="" && item.startTime && item.startTime!="" && item.endTime && item.endTime!=""){
              }else{
                promptUtil.warning(this, '请正确填写必要信息')
                valid = false
              }
            })
            this.customRuleForm.schedulesCycle = classObjArray
          }else{
            promptUtil.warning(this, '请正确填写必要信息')
            valid = false
          }
        } else { // 临时课
          if(this.customRuleForm.schedulesTmp &&
            this.customRuleForm.schedulesTmp.length>0 &&
            this.customRuleForm.schedulesTmp[0].day &&
            this.customRuleForm.schedulesTmp[0].day!="" &&
            this.customRuleForm.schedulesTmp[0].startTime!="" &&
            this.customRuleForm.schedulesTmp[0].startTime!="" &&
            this.customRuleForm.schedulesTmp[0].endTime!="" &&
            this.customRuleForm.schedulesTmp[0].endTime!=""
          ){
            this.customRuleForm.schedulesTmp.map(item=>{
              classObjArray.push(item)
              if(item.day && item.day!="" && item.startTime && item.startTime!="" && item.endTime && item.endTime!=""){
              }else{
                promptUtil.warning(this, '请正确填写必要信息')
                valid = false
              }
            })
            this.customRuleForm.schedulesTmp = classObjArray
          }else{
            promptUtil.warning(this, '请正确填写必要信息')
            valid = false
          }
        }
        return valid
      },
      // 格式化ruleForm数据格式，用于发送到服务端
      formatRuleFormData(){
        this.ruleForm.schedulesCycle.map(item=>{
          item.week = this.getWeekValueWithString(item.week)
          item.timestamp = this.getCurrentTimestamp(this.currentTimestamp,item.week)
        })
      },
      // 格式化customRuleForm数据格式，用于发送到服务端
      formatCustomRuleFormData(){
        this.customRuleForm.schedulesCycle.map(item=>{
          item.week = this.getWeekValueWithString(item.week)
          item.timestamp = this.getCurrentTimestamp(this.currentTimestamp,item.week)
        })
      },
      // 根据教师id生成随机schedulesID
      genSchedulesId(teacherID, timestamp=null){
        if(timestamp){
          return this.randomNumber(timestamp) + "_" + teacherID
        }else{
          return this.randomNumber() + "_" + teacherID
        }
      },
      // 根据当前时间和随机数生成随机号
      randomNumber(timestamp=null) {
        let now
        if(timestamp){
          now = new Date(timestamp)
        }else{
          now = new Date()
        }
        const year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        let hour = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        String(month).length < 2 ? (month = Number("0" + month)) : month;
        String(day).length < 2 ? (day = Number("0" + day)) : day;
        String(hour).length < 2 ? (hour = Number("0" + hour)) : hour;
        String(minutes).length < 2 ? (minutes = Number("0" + minutes)) : minutes;
        String(seconds).length < 2 ? (seconds = Number("0" + seconds)) : seconds;
        const yyyyMMddHHmmss = `${year}${month}${day}${hour}${minutes}${seconds}`;
        return yyyyMMddHHmmss + '_' + Math.random().toString(36).substr(2, 9);
      },

      // 根据起始时间和结束时间生成字符串
      genTimeFrameStringWithTime(startTimestamp,endTimestamp){
        const startTime = moment(startTimestamp).format("YYYY/MM/DD")
        const endTime = moment(endTimestamp).format("YYYY/MM/DD")
        return startTime+'—'+endTime
      },
      // 根据日期字符串返回时间戳
      getTimestampByTimeString(dateString){
        const startDate = dateString.split("—")[0]
        const endDate = dateString.split("—")[1]
        //const endDate = startDate.substring(0, 4)+'/'+dateString.split("—")[1]
        return {startTime:startDate,endTime:endDate}
      },
      // 设置基本信息 从服务器获取的数据
      setCalendarBaseInfo(data){
        this.calendarBaseInfo.teacherArray = this.getDataReturnArray(data.teacherArray)
        this.calendarBaseInfo.courseArray = this.getDataReturnArray(data.courseArray)
        this.calendarBaseInfo.classRoomArray = this.getDataReturnArray(data.classRoomArray)
      },
      // 设置进入添加课时时的基本信息  从服务器获取的数据
      setAddSchedulesBaseData(data){
        this.addSchedulesBaseInfo.courseSelfArray = this.getDataReturnArray(data.courseSelfArray)
        this.addSchedulesBaseInfo.courseArray = this.getDataReturnArray(data.courseArray)
        this.addSchedulesBaseInfo.courseTypeArray  = this.getDataReturnArray(data.courseTypeArray)
        this.addSchedulesBaseInfo.courseSelfTypeArray = this.getDataReturnArray(data.courseTypeArray)
        this.addSchedulesBaseInfo.courseStageArray = this.getDataReturnArray(data.courseStageArray)
        this.addSchedulesBaseInfo.courseSelfStageArray = this.getDataReturnArray(data.courseStageArray)
        this.addSchedulesBaseInfo.teacherArray = this.getDataReturnArray(data.teacherArray)
        this.addSchedulesBaseInfo.teacherSelfArray = this.getDataReturnArray(data.teacherArray)
      },
      getDataReturnArray(data){
        return (data && data.length>0) ? data : []
      },
      getPackageObjByIdFromCalendar(id){
        const packageArrays = []
        this.calendarBaseInfo.courseArray.map(item=>{
          item.options.map(obj=>packageArrays.push(obj))
        })
        return packageArrays.find(item => item.value==id)
      },
      getPackageObjByStringFromCalendar(label){
        const packageArrays = []
        this.calendarBaseInfo.courseArray.map(item=>{
          item.options.map(obj=>packageArrays.push(obj))
        })
        return packageArrays.find(item => item.label==label)
      },
      // 根据自定义课程类型信息返回想要的对象
      getCustomCourseTypeInfo(data){
        if(Number.isInteger(data)){ // 通过id查
          return this.addSchedulesBaseInfo.courseSelfTypeArray.find(item=>item.value==data)
        }else{ // 通过名字查
          return this.addSchedulesBaseInfo.courseSelfTypeArray.find(item=>item.label==data)
        }
      },
      // 根据课程类型信息返回想要的对象
      getCourseTypeInfo(data){
        if(Number.isInteger(data)){ // 通过id查
          return this.addSchedulesBaseInfo.courseTypeArray.find(item=>item.value==data)
        }else{ // 通过名字查
          return this.addSchedulesBaseInfo.courseTypeArray.find(item=>item.label==data)
        }
      },
      // 生成time格式内容
      getScheduleTemplate(schedule){
        let bgClr,text;
        if(1==schedule.raw.courseType){
          bgClr = this.bgColor.zhengshi
          text = '正'
        }else if(2==schedule.raw.courseType){
          bgClr = this.bgColor.duanqi
          text = '短'
        }else if(3==schedule.raw.courseType){
          bgClr = this.bgColor.jiaqi
          text = '假'
        }else if(4==schedule.raw.courseType){
          bgClr = this.bgColor.shiting
          text = '试'
        }
        const template = '<div><div style="float:right;position: relative;margin-right:1px;margin-top:1px">'+
          '<div style="border-style:solid;border-width:18px 10px 7px 10px;width:0px;height:0px;border-left-color:'+bgClr+
          ';border-right-color:'+bgClr+';border-top-color:'+bgClr+
          ';border-bottom-color:'+schedule.bgColor+'";></div>'+
          '<span style="font-weight:bold;position:absolute;top:2px;left:4px;color:#fff">'+text+'</span>'+
          '</div><div><i class="el-icon-alarm-clock"></i>'+
          schedule.raw.startTime+'-'+schedule.raw.endTime+
          '</div><div><i class="el-icon-user"></i>'+
          schedule.raw.teacherObj.label +
          '</div><div><i class="el-icon-notebook-2"></i>'+
          schedule.raw.courseObj.label+
          '</div><div><i class="el-icon-collection-tag"></i>'+
          schedule.raw.stageObj.label+
          '</div><div><i class="el-icon-school"></i>'+
          schedule.raw.classroomObj.label+'' +
          '</div><div><i class="el-icon-user"></i>'+
          schedule.raw.currentStuNum+'/'+schedule.raw.totalStuNum+'(当前/总共)</div></div>'
        return template
      },
      // 获取日历对象
      getCalendar(){
        return new Calendar('#calendar', {
          defaultView: 'week',
          scheduleView: ['time'],
          week: {
            daynames: ['周日','周一','周二','周三','周四','周五','周六'],
            hourStart: 8,
            hourEnd: 21,
            narrowWeekend: false,
            startDayOfWeek: 1 // monday
          },
          taskView: false,
          template: {
            time: (schedule) => this.getScheduleTemplate(schedule)
          }
        });
      },
      getMonthScheduleTemplate(schedule){
        const template = '<div><div style=""></div></div>'
        return template
      },
      getCalendarMonth(){
        return new Calendar('#calendar', {
          defaultView: 'month',
          month:{
            daynames: ['周日','周一','周二','周三','周四','周五','周六'],
            isAlways6Week: false
          },
          taskView: false,
          template: {
            time: (schedule) => this.getMonthScheduleTemplate(schedule)
          }
        });
      },
      handleCurrentManageChange(val){
        this.currentManagePage = val;
        if (this.managerTableData.length % this.managePageSize == 0 && this.managerTableData.length != this.currentManagePage * this.managePageSize && this.currentManagePage!=1) { // 表明当前页面没有数据
          this.currentManagePage = this.currentManagePage - 1
        }
        this.managerTableDataTmp = this.managerTableData.slice(
          (this.currentManagePage - 1) * this.managePageSize,
          this.managePageSize + (this.currentManagePage - 1) * this.managePageSize
        );
      },
      bindMouseEnterAndLeaveEvent(loading){
        $('.tui-full-calendar-time-date-schedule-block').unbind('mouseenter').unbind('mouseleave') // mouseover mouseout mouseenter mouseleave
        setTimeout(()=>{
          $('.tui-full-calendar-time-date-schedule-block').mouseenter((event)=>{
            this.addCalendarPopWindow(event)
          })
          $('.tui-full-calendar-time-date-schedule-block').mouseleave(()=>{
            this.delCalendarPopWindow()
          })
          if(loading){
            loading.close()
          }
        },500)
      },
      addCalendarPopWindow(event){
        try{
          let  targetObj = $(event.currentTarget)
          let childWidth = targetObj[0].offsetWidth + "px"
          this.currentSelectScheduleId = targetObj[0].firstElementChild.getAttribute("data-schedule-id")
          let color=event.currentTarget.firstElementChild.style.backgroundColor
          let  wrapper = $($.parseHTML('<div></div>'));
          wrapper[0].setAttribute("id", this.currentSelectScheduleId)
          const popupDom = '<div style="z-index:2147483647;position:absolute;top:1px;left:1px;font-weight:bold;padding-bottom:30px;border:1px solid #333;background-color:'+color+';width:'+childWidth+'">'+event.currentTarget.firstElementChild.firstElementChild.innerHTML+'</div>'
          wrapper.append($($.parseHTML(popupDom)))
          targetObj.append(wrapper)
        }catch(e){promptUtil.LOG("addCalendarPopWindow-err",e)}
      },
      delCalendarPopWindow(){
        if(!this.currentSelectScheduleId || this.currentSelectScheduleId!=''){
          $("#"+this.currentSelectScheduleId).remove();
          this.currentSelectScheduleId = ''
        }
      }
    },
    computed: {
      manageInfoList: {
        get() {
          return this.managerTableData.length;
        }
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }
  .lh {
    line-height: 50px;
    font-weight: bold;
  }
  .bg-purple-dark {
    background: #eee;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-box {
    margin: 15px 15px;
    float: left;
  }
  .el-card {
    padding: 10px 10px 10px 10px;
  }
  .option-wrapper {
    margin-top: -10px;
    width: 100%;
    height: 50px;
    display: flex;
  }
  .option-left-wrapper {
    flex: 1;
    height: 50px;
  }
  .option-right-wrapper {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    height: 50px;
  }
  .calendar-wrapper {
    width: 100%;
  }
  .fontWeight{
    font-weight: bolder!important;
  }
  .class-hours {
    display: flex;
    justify-content: flex-start;
  }
  .add-time-rule {
    margin-left: 10px;
    line-height: 28px;
    color: #409EFF;
  }
  .add-time-rule:hover {
    cursor: pointer;
  }
  .add-time-rule:active {
    cursor: pointer;
  }
  .del-time-rule {
    margin-left: 10px;
    line-height: 28px;
    color: #F56C6C;
  }
  .del-time-rule:hover {
    cursor: pointer;
  }
  .del-time-rule:active {
    cursor: pointer;
  }
  .el-icon-warning {
    margin-top: -10px;
  }

  .el-icon-warning:before {
    font-size: 36px;
    color: #ffba42;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }
</style>
