<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <!--    运营数据-->
    <el-row v-if="!isShowBecomeDue">
      <el-col :span="24">
        <el-card class="box-card">
          <div style="margin-bottom: 20px"><span class="classTitle">{{$t(`message.user_operational_data`)}}</span></div>
          <div style="display: flex;justify-content:  center">
            <el-col :span="4">
              <div class="grid-content bg-purple classfont classCenter">
                {{$t(`message.user_operational_attending`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.all}}
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple-light classfont classCenter">
                {{$t(`message.user_operational_actual_attending`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.come}}
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple classfont classCenter">
                {{$t(`message.user_operational_absent`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.nocome}}<br>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple-light classfont classCenter">
                {{$t(`message.user_operational_leave`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.leave}}
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple classfont classCenter">
                {{$t(`message.user_operational_other`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.or}}
              </div>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else :gutter="20">
      <el-col :span="18">
        <el-card class="box-card" style="height:158px;">
          <div style="margin-bottom: 20px"><span class="classTitle">{{$t(`message.user_operational_data`)}}</span></div>
          <div style="display: flex;justify-content:  center">
            <el-col :span="4">
              <div class="grid-content bg-purple classfont classCenter">
                {{$t(`message.user_operational_attending`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.all}}
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple-light classfont classCenter">
                {{$t(`message.user_operational_actual_attending`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.come}}
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple classfont classCenter">
                {{$t(`message.user_operational_absent`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.nocome}}<br>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple-light classfont classCenter">
                {{$t(`message.user_operational_leave`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.leave}}
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple classfont classCenter">
                {{$t(`message.user_operational_other`)}}（{{$t(`message.string_label_person_times`)}}）<br>{{saveClassNumber.or}}
              </div>
            </el-col>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" style="height:158px;">
          <div style="margin-bottom: 20px"><span class="classTitle">{{$t(`message.user_system_info_title`)}}</span>
          </div>
          <div style="display: flex;justify-content:flex-start">
            <el-col :span="19">
              <div class="grid-content bg-purple" style="font-size:14px;font-weight: bold;color:#409EFF">
                {{$t(`message.user_system_info_start`)}}<label
                style="margin-left: 20px;color:#999;">{{$store.state.systemInfo.startTime}}</label></div>
              <div class="grid-content bg-purple" style="font-size:14px;font-weight: bold;color:#409EFF">
                {{$t(`message.user_system_info_end`)}}<label
                style="margin-left: 20px;color:#999">{{$store.state.systemInfo.endTime}}</label></div>
              <div class="grid-content bg-purple" style="font-size:14px;font-weight: bold;color:#409EFF">
                {{$t(`message.user_system_info_content`)}} <span
                style="color:#F56C6C">{{$store.state.systemInfo.authorizationCode}}</span>
                {{$t(`message.user_system_info_code`)}}
              </div>
            </el-col>
            <el-col :span="5">
              <div style="border:none;height:55px;width:2px;background-color:#e6e6e6">
                <el-popover
                  placement="left"
                  width="120"
                  trigger="click">
                  <el-card shadow="never">
                    <el-image
                      style="width: 108px; height: 108px"
                      :src="$store.state.systemInfo.qrcode"
                      fit="fill"></el-image>
                    <div style="margin-top:20px;width:108px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      <el-tooltip class="item" effect="dark" :content="$store.state.systemInfo.tel" placement="bottom">
                        <i class="el-icon-phone">{{$store.state.systemInfo.tel}}</i>
                      </el-tooltip>
                    </div>
                  </el-card>
                  <el-button slot="reference" type="warning" style="width:54px;margin-left:16px;margin-top:5px;"
                             size="small">{{$t(`message.user_system_info_btn_contact`)}}<br/>{{$t(`message.user_system_info_btn_custom`)}}
                  </el-button>
                </el-popover>
              </div>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--          今日课程内容-->
    <div v-show="isShowLiveCourse==true" style="min-height: 138px;height:100%;">
      <el-row v-show="$store.state.isShowTodaySchedules" :gutter="20" style="height: 100%;">
        <el-col :span="18">
          <el-card class="box-card" id="today-course-list">
            <el-row>
              <el-col :span="24">
                <div>
                  <span class="classTitle fl">{{$t(`message.user_system_course_today_title`)}}</span>
                  <div style="float: right;">
                    <template>
                      <el-select v-model="currentTeacher" size="mini" style="width: 150px"
                                 @change="selectTeacherWithSchedule">
                        <el-option
                          v-for="item in searchAllTeacher"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="isShowEmptyOrCourseListStatus==0"></el-row>
            <el-row v-if="isShowEmptyOrCourseListStatus==1">
              <el-col :span="24">
                <el-collapse v-model="activeTeacherScheduleName" accordion style="border:none"
                             @change="changeCollapseSchedule">
                  <el-collapse-item :name="item.id" v-for="(item, index) in newTeacherScheduleList" :key="index"
                                    :class="'collapse-item-parent-'+item.id">
                    <template slot="title">
                      <el-row style="margin:0;padding:0;height: 50px;width: 100%;border-radius:50px;" align="middle">
                        <el-col :span="2" style="height:50px;">
                          <el-avatar style="margin-top:5px;margin-left:5px;" :size="40"
                                     :src="item.teaAvatar"></el-avatar>
                        </el-col>
                        <el-col :span="2"><span style="font-size:16px;">{{item.teaName}}</span></el-col>
                        <el-col :span="3"><span style="font-size:16px;"><i class="el-icon-time"></i>{{item.date}}</span>
                        </el-col>
                        <el-col :span="2"><span style="font-size:16px;"><i
                          class="el-icon-user"></i>{{item.count}}人</span></el-col>
                        <el-col :span="7">
                          <div class="courseNameWidth1">
                            <span style="font-size:16px;"><i class="el-icon-notebook-2"></i>{{item.content}}</span>
                          </div>
                        </el-col>
                        <el-col :span="4"><span style="font-size:16px;"><i class="el-icon-school"></i>{{item.className}}</span>
                        </el-col>
                        <el-col :span="4">
                          <div style="display: flex;justify-content: center;align-items: center;height: 50px;">
                            <el-button round size="mini" v-on:click.native.stop="courseHandle(1,item)">
                              {{$t(`message.string_label_course_prepare`)}}
                            </el-button>
                            <!--                            <el-button round size="mini" v-on:click.native.stop="courseHandle(2,item)">上课</el-button>-->
                            <el-button round size="mini" v-on:click.native.stop="courseHandle(3,item)">
                              {{$t(`message.string_label_course_prepare`)}}
                            </el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </template>
                    <div>
                      <el-card shadow="always" :body-style="{ padding: '0px' }"
                               style="margin:0 20px 0 20px;padding-top:5px;padding-bottom:5px;">
                        <el-row style="padding:0;margin:0" :gutter="10">
                          <el-col :span="3" v-for="(stuItem, stuIndex) in item.studentArray" :key="stuIndex">
                            <el-card shadow="hover" :body-style="{ padding: '5px' }" style="width:100%;height:120px;">
                              <div style="height: 80px;display:flex">
                                <div style="position: relative">
                                  <el-avatar style="margin-top:5px;margin-left:5px;" :size="40"
                                             :src="stuItem.img_head"></el-avatar>
                                  <div v-show="stuItem.type==0"
                                       style="position:absolute;top:52px;left:5px;width:40px;height:20px;text-align:center;line-height:20px;border-radius:20px;font-size:12px;background-color:#E6A23C">
                                    {{$t(`message.string_label_course_student_temporary`)}}
                                  </div>
                                  <div v-show="stuItem.type==1"
                                       style="position:absolute;top:52px;left:5px;width:40px;height:20px;text-align:center;line-height:20px;border-radius:20px;font-size:12px;background-color:#409EFF">
                                    {{$t(`message.string_label_course_student_formal`)}}
                                  </div>
                                </div>
                                <div style="margin-left:10px;width:100%;">
                                  <div style="color:#666"><i class="el-icon-user-solid"></i><span
                                    style="margin-left:5px;">{{stuItem.label}}</span></div>
                                  <div style="color:#666"><i class="el-icon-phone"></i><span style="margin-left:5px;">{{stuItem.phone}}</span>
                                  </div>
                                  <div style="position:relative;float:right;width:10px;height:10px;">
                                    <div
                                      style="position:absolute;top:-45px;left:-10px;width:20px;height:20px;text-align:center;line-height:20px;border-radius:20px;">
                                      <el-link slot="reference" :underline="false" icon="el-icon-delete"
                                               @click="clickDeleleLink(stuItem)"></el-link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <el-dropdown trigger="click" @command="studentStatusCommand">
                                <div class="studentStatusCommand" :style="{'text-align':'center','font-size':'18px','color':'#fff','border-radius':'5px',
                                'background-color': stuItem.status==0 ? '#ccc' : (stuItem.status==1 ? '#67C23A' : (stuItem.status==2 ? '#F56C6C' : '#E6A23C'))
                              }" :id="'stu_status_command_'+stuItem.cs_id">
                                  <span v-show="stuItem.status==0">{{$t(`message.string_label_class_sign_in`)}}</span>
                                  <span
                                    v-show="stuItem.status==1">{{$t(`message.string_label_class_attendance`)}}</span>
                                  <span v-show="stuItem.status==2">{{$t(`message.string_label_class_absence`)}}</span>
                                  <span v-show="stuItem.status==3">{{$t(`message.string_label_class_takeleave`)}}</span>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item :command="'1-'+stuItem.cs_id+'-'+stuItem.value+'-'+stuItem.type">
                                    <el-link icon="el-icon-check" :underline="false"><span v-show="stuItem.status==1"
                                                                                           style="color: #00a2ff">{{$t(`message.string_label_class_attendance`)}}</span><span
                                      v-show="stuItem.status!=1">{{$t(`message.string_label_class_attendance`)}}</span>
                                    </el-link>
                                  </el-dropdown-item>
                                  <el-dropdown-item :command="'2-'+stuItem.cs_id+'-'+stuItem.value+'-'+stuItem.type">
                                    <el-link icon="el-icon-close" :underline="false"><span v-show="stuItem.status==2"
                                                                                           style="color: #00a2ff">{{$t(`message.string_label_class_absence`)}}</span><span
                                      v-show="stuItem.status!=2">{{$t(`message.string_label_class_absence`)}}</span>
                                    </el-link>
                                  </el-dropdown-item>
                                  <el-dropdown-item :command="'3-'+stuItem.cs_id+'-'+stuItem.value+'-'+stuItem.type">
                                    <el-link icon="el-icon-circle-plus-outline" :underline="false"><span
                                      v-show="stuItem.status==3" style="color: #00a2ff">{{$t(`message.string_label_class_takeleave`)}}</span><span
                                      v-show="stuItem.status!=3">{{$t(`message.string_label_class_takeleave`)}}</span>
                                    </el-link>
                                  </el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </el-card>
                          </el-col>
                          <el-col :span="3">
                            <el-card shadow="hover" :body-style="{ padding: '5px' }" style="width:100%;height:120px;">
                              <div v-show="showStudentSelect==0"
                                   style="display: flex;justify-content: center;align-items: center;flex-direction: column;margin-top:15px;"
                                   @click="showStudentSelect=1">
                                <i class="el-icon-plus" style="font-size: 48px;font-weight: bold"></i>
                                <div style="margin-top: 10px;font-size: 18px;color:#ccc">
                                  {{$t(`message.string_label_course_temp_insert_class`)}}
                                </div>
                              </div>
                              <div v-show="showStudentSelect==1"
                                   style="display: flex;justify-content: center;align-items: center;flex-direction: column;margin-top:15px;">
                                <div style="margin-top: 10px;font-size: 16px;color:#ccc">
                                  {{$t(`message.string_label_course_search_student_add`)}}
                                </div>
                                <el-select v-model="currentSelectScheduleStuValue" filterable
                                           :placeholder="$t(`message.string_label_please_select`)"
                                           size="mini" style="width:100%;margin-top: 10px;"
                                           @change="selectStudentToSchedule">
                                  <el-option
                                    v-for="item in item.studentNoArray"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div v-show="showStudentSelect==2"
                                   style="display: flex;justify-content: center;align-items: center;flex-direction: column">
                                <div style="height: 70px;display:flex;margin-top:10px;">
                                  <div>
                                    <el-avatar style="margin-top:5px;margin-left:5px;" :size="40"
                                               :src="currentSelectStudentToScheduleObj.img_head"></el-avatar>
                                  </div>
                                  <div style="margin-left:10px;width:100%;">
                                    <div style="color:#666"><i class="el-icon-user-solid"></i><span
                                      style="margin-left:5px;">{{currentSelectStudentToScheduleObj.label}}</span></div>
                                    <div style="color:#666"><i class="el-icon-phone"></i><span style="margin-left:5px;">{{currentSelectStudentToScheduleObj.phone}}</span>
                                    </div>
                                  </div>
                                </div>
                                <div style="display: flex;justify-content: center;align-items: center">
                                  <el-button type="success" plain size="mini" style="flex:1"
                                             @click="addStudentToSchedule" :loading="isAddStudentScheduleLoading">
                                    {{$t(`message.button_confirm`)}}
                                  </el-button>
                                  <el-button type="danger" plain style="flex:1" size="mini"
                                             @click="showStudentSelect=0;currentSelectScheduleStuValue=''">
                                    {{$t(`message.button_cancel`)}}
                                  </el-button>
                                </div>
                              </div>
                            </el-card>
                          </el-col>
                        </el-row>
                      </el-card>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
            <el-row v-if="isShowEmptyOrCourseListStatus==2">
              <div
                style="height: 100px;font-size: 46px;font-weight: bold;text-align: center;line-height: 100px;color:#ccc;padding-bottom: 40px;">
                {{$t(`message.user_system_course_today_nodata`)}}
              </div>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" id="live-course-enter">
            <div>
              <span class="classTitle fl">{{$t(`message.live_manage_training_title`)}}</span>
            </div>
            <div style="margin-top:44px;display: flex">
              <div style="display:flex;flex-direction: column;width: 200px">
                <el-tooltip class="item" effect="dark" :content="liveCourseInfo.title" placement="bottom">
                  <div style="width: 200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight: bold">
                    {{liveCourseInfo.title}}
                  </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="liveCourseInfo.desc" placement="bottom">
                  <div style="width: 200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top: 20px;">
                    {{liveCourseInfo.desc}}
                  </div>
                </el-tooltip>
              </div>
              <div style="display: flex;justify-content:flex-end;align-items: center;flex: 1">
                <el-button type="primary" style="width:54px;margin-left:16px;margin-top:5px;" size="small"
                           @click="intoLiveCourse">{{$t(`message.live_manage_training_click`)}}<br/>{{$t(`message.live_manage_training_watch`)}}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--          今日课程内容-->
    <div v-show="isShowLiveCourse==false">
      <el-row v-show="$store.state.isShowTodaySchedules">
        <el-col :span="24">
          <el-card class="box-card">
            <el-row>
              <el-col :span="24">
                <div>
                  <span class="classTitle fl">{{$t(`message.user_system_course_today_title`)}}</span>
                  <div style="float: right;">
                    <template>
                      <el-select v-model="currentTeacher" size="mini" style="width: 150px"
                                 @change="selectTeacherWithSchedule">
                        <el-option
                          v-for="item in searchAllTeacher"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="isShowEmptyOrCourseListStatus==0"></el-row>
            <el-row v-if="isShowEmptyOrCourseListStatus==1">
              <el-col :span="24">
                <el-collapse v-model="activeTeacherScheduleName" accordion style="border:none"
                             @change="changeCollapseSchedule">
                  <el-collapse-item :name="item.id" v-for="(item, index) in newTeacherScheduleList" :key="index"
                                    :class="'collapse-item-parent-'+item.id">
                    <template slot="title">
                      <el-row style="margin:0;padding:0;height: 50px;width: 100%;border-radius:50px;" align="middle">
                        <el-col :span="2" style="height:50px;">
                          <el-avatar style="margin-top:5px;margin-left:5px;" :size="40"
                                     :src="item.teaAvatar"></el-avatar>
                        </el-col>
                        <el-col :span="2"><span style="font-size:16px;">{{item.teaName}}</span></el-col>
                        <el-col :span="3"><span style="font-size:16px;"><i class="el-icon-time"></i>{{item.date}}</span>
                        </el-col>
                        <el-col :span="2"><span style="font-size:16px;"><i
                          class="el-icon-user"></i>{{item.count}}人</span></el-col>
                        <el-col :span="7" class="courseNameWidthBox">
                          <div class="courseNameWidth">
                            <span style="font-size:16px;"><i class="el-icon-notebook-2"></i>{{item.content}}</span>
                          </div>
                        </el-col>
                        <el-col :span="4" class="classNameWidthBox">
                          <div class="classNameWidth">
                            <span style="font-size:16px;margin-left: 20px"><i class="el-icon-school"></i>{{item.className}}</span>
                          </div>
                        </el-col>
                        <el-col :span="4">
                          <div style="display: flex;justify-content: center;align-items: center;height: 50px;">
                            <el-button round size="mini" v-on:click.native.stop="courseHandle(1,item)">
                              {{$t(`message.string_label_course_prepare`)}}
                            </el-button>
                            <!--                            <el-button round size="mini" v-on:click.native.stop="courseHandle(2,item)">上课</el-button>-->
                            <el-button round size="mini" v-on:click.native.stop="courseHandle(3,item)">
                              {{$t(`message.string_label_course_end`)}}
                            </el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </template>
                    <div>
                      <el-card shadow="always" :body-style="{ padding: '0px' }"
                               style="margin:0 20px 0 20px;padding-top:5px;padding-bottom:5px;">
                        <el-row style="padding:0;margin:0" :gutter="10">
                          <el-col :span="3" v-for="(stuItem, stuIndex) in item.studentArray" :key="stuIndex">
                            <el-card shadow="hover" :body-style="{ padding: '5px' }" style="width:100%;height:120px;">
                              <div style="height: 80px;display:flex">
                                <div style="position: relative">
                                  <el-avatar style="margin-top:5px;margin-left:5px;" :size="40"
                                             :src="stuItem.img_head"></el-avatar>
                                  <div v-show="stuItem.type==0"
                                       style="position:absolute;top:52px;left:5px;width:40px;height:20px;text-align:center;line-height:20px;border-radius:20px;font-size:12px;background-color:#E6A23C">
                                    {{$t(`message.string_label_course_student_temporary`)}}
                                  </div>
                                  <div v-show="stuItem.type==1"
                                       style="position:absolute;top:52px;left:5px;width:40px;height:20px;text-align:center;line-height:20px;border-radius:20px;font-size:12px;background-color:#409EFF">
                                    {{$t(`message.string_label_course_student_formal`)}}
                                  </div>
                                </div>
                                <div style="margin-left:10px;width:100%;">
                                  <div style="color:#666"><i class="el-icon-user-solid"></i><span
                                    style="margin-left:5px;">{{stuItem.label}}</span></div>
                                  <div style="color:#666"><i class="el-icon-phone"></i><span style="margin-left:5px;">{{stuItem.phone}}</span>
                                  </div>
                                  <div style="position:relative;float:right;width:10px;height:10px;">
                                    <div
                                      style="position:absolute;top:-45px;left:-10px;width:20px;height:20px;text-align:center;line-height:20px;border-radius:20px;">
                                      <el-link slot="reference" :underline="false" icon="el-icon-delete"
                                               @click="clickDeleleLink(stuItem)"></el-link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <el-dropdown trigger="click" @command="studentStatusCommand">
                                <div class="studentStatusCommand" :style="{'text-align':'center','font-size':'18px','color':'#fff','border-radius':'5px',
                                'background-color': stuItem.status==0 ? '#ccc' : (stuItem.status==1 ? '#67C23A' : (stuItem.status==2 ? '#F56C6C' : '#E6A23C'))
                              }" :id="'stu_status_command_'+stuItem.cs_id">
                                  <span v-show="stuItem.status==0">{{$t(`message.string_label_class_sign_in`)}}</span>
                                  <span
                                    v-show="stuItem.status==1">{{$t(`message.string_label_class_attendance`)}}</span>
                                  <span v-show="stuItem.status==2">{{$t(`message.string_label_class_absence`)}}</span>
                                  <span v-show="stuItem.status==3">{{$t(`message.string_label_class_takeleave`)}}</span>
                                </div>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item :command="'1-'+stuItem.cs_id+'-'+stuItem.value+'-'+stuItem.type">
                                    <el-link icon="el-icon-check" :underline="false"><span v-show="stuItem.status==1"
                                                                                           style="color: #00a2ff">{{$t(`message.string_label_class_attendance`)}}</span><span
                                      v-show="stuItem.status!=1">{{$t(`message.string_label_class_attendance`)}}</span>
                                    </el-link>
                                  </el-dropdown-item>
                                  <el-dropdown-item :command="'2-'+stuItem.cs_id+'-'+stuItem.value+'-'+stuItem.type">
                                    <el-link icon="el-icon-close" :underline="false"><span v-show="stuItem.status==2"
                                                                                           style="color: #00a2ff">{{$t(`message.string_label_class_absence`)}}</span><span
                                      v-show="stuItem.status!=2">{{$t(`message.string_label_class_absence`)}}</span>
                                    </el-link>
                                  </el-dropdown-item>
                                  <el-dropdown-item :command="'3-'+stuItem.cs_id+'-'+stuItem.value+'-'+stuItem.type">
                                    <el-link icon="el-icon-circle-plus-outline" :underline="false"><span
                                      v-show="stuItem.status==3" style="color: #00a2ff">{{$t(`message.string_label_class_takeleave`)}}</span><span
                                      v-show="stuItem.status!=3">{{$t(`message.string_label_class_takeleave`)}}</span>
                                    </el-link>
                                  </el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </el-card>
                          </el-col>
                          <el-col :span="3">
                            <el-card shadow="hover" :body-style="{ padding: '5px' }" style="width:100%;height:120px;">
                              <div v-show="showStudentSelect==0"
                                   style="display: flex;justify-content: center;align-items: center;flex-direction: column;margin-top:15px;"
                                   @click="showStudentSelect=1">
                                <i class="el-icon-plus" style="font-size: 48px;font-weight: bold"></i>
                                <div style="margin-top: 10px;font-size: 18px;color:#ccc">
                                  {{$t(`message.string_label_course_temp_insert_class`)}}
                                </div>
                              </div>
                              <div v-show="showStudentSelect==1"
                                   style="display: flex;justify-content: center;align-items: center;flex-direction: column;margin-top:15px;">
                                <div style="margin-top: 10px;font-size: 16px;color:#ccc">
                                  {{$t(`message.string_label_course_search_student_add`)}}
                                </div>
                                <el-select v-model="currentSelectScheduleStuValue" filterable
                                           :placeholder="$t(`message.string_label_please_select`)"
                                           size="mini" style="width:100%;margin-top: 10px;"
                                           @change="selectStudentToSchedule">
                                  <el-option
                                    v-for="item in item.studentNoArray"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                              <div v-show="showStudentSelect==2"
                                   style="display: flex;justify-content: center;align-items: center;flex-direction: column">
                                <div style="height: 70px;display:flex;margin-top:10px;">
                                  <div>
                                    <el-avatar style="margin-top:5px;margin-left:5px;" :size="40"
                                               :src="currentSelectStudentToScheduleObj.img_head"></el-avatar>
                                  </div>
                                  <div style="margin-left:10px;width:100%;">
                                    <div style="color:#666"><i class="el-icon-user-solid"></i><span
                                      style="margin-left:5px;">{{currentSelectStudentToScheduleObj.label}}</span></div>
                                    <div style="color:#666"><i class="el-icon-phone"></i><span style="margin-left:5px;">{{currentSelectStudentToScheduleObj.phone}}</span>
                                    </div>
                                  </div>
                                </div>
                                <div style="display: flex;justify-content: center;align-items: center">
                                  <el-button type="success" plain size="mini" style="flex:1"
                                             @click="addStudentToSchedule" :loading="isAddStudentScheduleLoading">
                                    {{$t(`message.button_confirm`)}}
                                  </el-button>
                                  <el-button type="danger" plain style="flex:1" size="mini"
                                             @click="showStudentSelect=0;currentSelectScheduleStuValue=''">
                                    {{$t(`message.button_cancel`)}}
                                  </el-button>
                                </div>
                              </div>
                            </el-card>
                          </el-col>
                        </el-row>
                      </el-card>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
            <el-row v-if="isShowEmptyOrCourseListStatus==2">
              <div
                style="height: 100px;font-size: 46px;font-weight: bold;text-align: center;line-height: 100px;color:#ccc;padding-bottom: 40px;">
                {{$t(`message.user_system_course_today_nodata`)}}
              </div>
            </el-row>
            <user-pagination @tableData="changeTableData($event)" :size="5" ref="usersPageination"/>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--   创作工具与教师数据-->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="box-card" style="height: 530px;">
          <div style="display: flex;justify-content: space-between">
            <span class="classTitle">{{$t(`message.user_system_traffic_data`)}}</span>
            <div>
              <el-switch
                @change="handleChageValue"
                v-model="changeValue"
                :active-text="$t('message.user_system_storage_situation')"
                :inactive-text="$t('message.user_system_visits')"
                style="font-size: 12px !important;">
              </el-switch>
            </div>
          </div>
          <el-row :gutter="40" style="margin-top: 20px;">
            <div v-show="storageShow">
              <div id="storage" style="height: 420px;width: 100%;margin-top:20px"></div>
            </div>
            <div v-show="visitsShow" style="width: 100%;height: 420px">
              <div id="visits" style="height: 420px;width: 100%;margin-top:20px"></div>
            </div>
            <!--            <el-col :span="12" v-for="(obj, index) in editorCardInfo" :key="index">-->
            <!--              <el-card :body-style="{ padding: '15px'}" style="margin-bottom:5px;">-->
            <!--                <div class="grid-content bg-purple">-->
            <!--                  <a :href="obj.goUrl" target="_blank">-->
            <!--                    <el-image :src="obj.imgUrl" fit="contain" style="height: 190px;"></el-image>-->
            <!--                  </a>-->
            <!--                </div>-->
            <!--              </el-card>-->
            <!--            </el-col>-->
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div style="margin-bottom: 20px;"><span
            class="classTitle">{{$t(`message.user_system_school_teacher_data`)}}</span></div>
          <el-row class="boder">
            <el-col :span="8">
              <div class="grid1-content bg-purple fs">
                {{$t(`message.user_system_school_teacher_count`)}}
                <!--                <i class="el-icon-arrow-down pointer show" @click="dropDown"></i>-->
                <!--                <i class="el-icon-arrow-up pointer close" @click="dropUp"></i>-->
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid1-content bg-purple fs">{{$t(`message.user_system_school_classes_count`)}} :
                {{schoolInfo.classnumber}}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid1-content bg-purple-light fs">{{$t(`message.user_system_school_student_count`)}} :
                {{schoolInfo.studynumber}}
              </div>
            </el-col>
            <!--            <el-col :span="6">-->
            <!--              <div class="grid1-content bg-purple fs">发布任务数量 : {{schoolInfo.tasknumber}}</div>-->
            <!--            </el-col>-->
          </el-row>
          <!--           table列表-->
          <div class="tableTogg" ref="tableTogg" v-if="show" style="margin: 0;padding: 0;">
            <el-table
              :data="tableData"
              border
              style="width: 100%;height: 333px;"
              :header-row-style="{'color':'#409EFF'}"
            >
              <!--              <el-table-column props="id" align="center" type="index" :index="indexMethod" label="序号" width="60"></el-table-column>-->
              <el-table-column align="center" :label="$t(`message.user_system_school_table_label_info`)" width="260px">
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center">
                    <div style="flex:1;"> {{scope.row.name}}</div>
                    <div style="flex:1;color:rgb(147, 147, 147)">{{scope.row.phone}}</div>
                    <div style="flex:1">
                      <span v-if="scope.row.act==='校长'" style="color:#0091e4"><el-tag>{{$t('message.string_label_principal')}}</el-tag></span>
                      <span v-else><el-tag type="info">{{$t('message.string_label_teacher')}}</el-tag></span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="date" align="center"
                               :label="$t(`message.user_system_school_table_label_join`)"></el-table-column>
              <el-table-column prop="tasknumber" align="center"
                               :label="$t(`message.user_system_school_table_label_task`)"></el-table-column>
              <el-table-column prop="remarks" align="center"
                               :label="$t(`message.user_system_school_table_label_desc`)"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <!--            <el-row type="flex" justify="center" v-show="teacherPagination" class="mt">-->
            <el-row type="flex" justify="center" class="mt">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="classInfoList"
              ></el-pagination>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="$t(`message.dialog_header_title_prompt`)" :visible.sync="delScheduleStudentShow" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{$t(`message.user_operational_dialog_delete_student`)}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
          <el-button @click="delScheduleStudentShow = false">{{$t(`message.button_cancel`)}}</el-button>
          <el-button type="primary" @click="delStudentFromSchedule">{{$t(`message.button_confirm`)}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t(`message.dialog_header_title_prompt`)" :visible.sync="delCloseCourseShow" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{$t(`message.user_operational_dialog_end_class`)}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
          <el-button @click="delCloseCourseShow = false">{{$t(`message.button_cancel`)}}</el-button>
          <el-button type="primary" @click="closeCourseShow">{{$t(`message.button_confirm`)}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  const moment = require("moment")
  const echarts = require("echarts");
  import PubSub from "pubsub-js";
  import storageUtil from "../../utils/storageUtil";
  import promptUtil from "../../utils/promptUtil";
  import userPagination from "../commons/pagination/pagination"
  import '../../api/restfulapi';
  import {
    getSchoolInfo,
    qs,
    getClassNumber,
    getClassContent,
    saveStudentInformation, //保存学生信息  删除学生
    changeTeacherCourseStatus,
    getTeacherList,
    getSchoolDueInfo,
    getCoursesLivePackage, // 获取直播课
    flowStatistics,//获取存储次数数据
    indexFlowStatistics,//获取图标信息
  } from "../../api/api";
  import $ from "jquery";
  import childHeader from '../component/childHeader'

  export default {
    components: {"als-child-header": childHeader, "user-pagination": userPagination},
    data() {
      return {
        routerConfig: [{name: '课堂首页', to: ''}],
        isShowLiveCourse: false, // 是否显示直播课时
        liveCourseInfo: {title: '', desc: '', id: 0},
        saveClassNumber: {}, // 运营数据
        tableData: [], // 班级数据
        pageSize: 5, // 分页页码大小
        currentPage: 1, // 分页当前页码
        requestTimeout: 2000, // 请求服务器超时时间
        getTableContentTimeoutId: null, // 模拟异步请求定时id
        searchAllTeacher: [],
        newTeacherScheduleList:[],
        currentTeacher: "",
        editorCardInfo: [
          // 获取编辑器相关信息
          {
            goUrl: "http://www.superblockly.com/coocoo",
            imgUrl: "https://alseduline.oss-cn-shenzhen.aliyuncs.com/alsclassroom/statics/programme_1.png"
          },
          {
            goUrl: "http://www.superblockly.com/mpython/index.html",
            imgUrl: "https://alseduline.oss-cn-shenzhen.aliyuncs.com/alsclassroom/statics/python_1.png"
          },
          {
            goUrl: "http://www.superblockly.com/create",
            imgUrl: "https://alseduline.oss-cn-shenzhen.aliyuncs.com/alsclassroom/statics/arduino_1.png"
          },
          {
            goUrl: "https://www.superblockly.com/scratch3/index.html",
            imgUrl: "https://alseduline.oss-cn-shenzhen.aliyuncs.com/alsclassroom/statics/scratch_1.png"
          }
        ],
        show: true,
        schoolInfo: {},
        queryFromServer: [],
        teacherPagination: false,
        activeTeacherScheduleName: "", // 当前展开的教师课时列表
        teacherScheduleList: [], // 获取教师课时列表（包括学生）所有
        fiveTeacherScheduleList: [],// 获取教师课时列表（包括学生）前5个
        delScheduleStudentShow: false, // 是否显示删除学生对话框
        showStudentSelect: 0, // 0显示添加学生 1显示学生搜索框 2
        isAddStudentScheduleLoading: false, // 添加学生时触发
        currentSelectScheduleStuValue: '', // 当前点选的学生id
        currentSelectStudentToScheduleObj: '', // 当前点选的学生对象
        currentClickScheduleId: '', // 当前点选的课时id  =》 calendar_id
        delCloseCourseShow: false,
        currentCloseCourseItem: null,
        isShowBecomeDue: false, // 是否显示到期时间 只有小区管理员才能看到
        isShowEmptyOrCourseListStatus: 0, // 显示今日课程内容 0 显示空 1 显示列表 2 显示今日无课
        storageCharts: null,
        changeValue: false,
        storageShow: false,
        visitsShow: true,
        statisticalData: {
          total: '',//总空间
          used: '',//剩余空间
          totaltimes: '',//总次数
          residualtimes: '',//剩余次数
        },
        flowData: {
          stroageDate: [],
          stroageValue: [],
          stroageMax: "",
          stroageUnit: '',
          visitDate: [],
          visitValue: [],
          visitMax: "",
          visitUnit: '',
        },
        visitOption: {},
        storageOption: {},
      };
    },
    watch: {
      '$i18n.locale': function () {
        if (this.searchAllTeacher.length > 0) {
          this.searchAllTeacher[0].label = this.$t('message.user_system_course_select_default_label')
        }
        this.storageOption = {
          title: {
            text: this.$t(`message.user_system_storage_situation`),
            textStyle: {
              color: '#000',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 14,
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [this.$t('message.user_system_storage_use')]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              // saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '44', '55', '88']
            data: this.flowData.stroageDate
          },
          yAxis: [{
            name: this.flowData.stroageUnit,
            type: 'value',
            max: this.flowData.stroageMax,
            min: 0,
            splitNumber: 10,
            splitArea: {
              show: true
            }
          }],
          series: [{
            symbolSize: 10,
            name: this.$t('message.user_system_storage_use'),
            type: 'line',
            stack: this.$t('message.user_system_storage_total'),
            // data: [10, 13, 10, 20, 30, 50, 60, 70, 80, 90],
            data: this.flowData.stroageValue,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#409EFF', //改变折线点的颜色
                lineStyle: {
                  color: '#00a2ff' //改变折线颜色
                }
              }
            },
            markLine: {
              // symbol: ['none', 'none'],//去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {//设置渐变
                      type: 'linear',
                      color: '#00a2ff',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: '#00a2ff '// 0% 处的颜色
                      }, {
                        offset: 1, color: '#00a2ff' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: true,
                    position: 'middle',
                    //formatter: `最大存储量(${})/剩余存储100G`,
                    formatter: this.$t(`message.user_system_storage_max`) + `(${this.statisticalData.total}G) ` + this.$t(`message.user_system_storage_remain_space`) + `(${this.statisticalData.used}G)`
                  }
                }
              },
              data: [{
                yAxis: this.flowData.stroageMax,//这里设置false是隐藏不了的，可以设置为-1
              },]
            }
          }]
        };
        this.storageCharts.setOption(this.storageOption);
        this.visitOption = {
          title: {
            text: this.$t('message.user_system_visits'),
            textStyle: {
              //文字颜色
              color: '#000',
              //字体风格,'normal','italic','oblique'
              fontStyle: 'normal',
              //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
              fontWeight: 'bold',
              //字体大小
              fontSize: 14,
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [this.$t('message.user_system_visits')]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              // saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            //  data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '', '11']
            data: this.flowData.visitDate
          },
          yAxis: [{
            name: this.flowData.visitUnit,
            type: 'value',
            min: 0,
            max: this.flowData.visitMax,
            splitNumber: 10,
            splitArea: {
              show: true
            }
          }],
          series: [{
            symbolSize: 10,
            name: this.$t('message.user_system_visits'),
            type: 'line',
            stack: this.$t('message.user_system_storage_total'),
            // data: [10, 13, 10, 134, 90, 230, 210, '', 22],
            data: this.flowData.visitValue,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#de9323', //改变折线点的颜色
                lineStyle: {
                  color: '#e6a23c' //改变折线颜色
                }
              }
            },
            markLine: {
              // symbol: ['none', 'none'],//去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {//设置渐变
                      type: 'linear',
                      color: '#00a2ff',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: '#e6a23c '// 0% 处的颜色
                      }, {
                        offset: 1, color: '#e6a23c' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: true,
                    position: 'middle',
                    formatter: this.$t(`message.user_system_visits_total`) + `(${this.statisticalData.totaltimes}) ` + this.$t(`message.user_system_visits_remain`) + `(${this.statisticalData.residualtimes})`
                  }
                }
              },
              data: [{
                yAxis: this.flowData.visitMax,
              },]
            }
          }]
        };
        this.storageCharts.setOption(this.visitOption);
      }
    },
    mounted() {
      PubSub.publish("currentMenuIndex", "/user");
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id)
      // 重置当前页为1
      this.currentPage = 1;
      if (storageUtil.readTeacherInfo().school_admin == 1) { // 证明是机构管理员
        getSchoolDueInfo(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          user_id: storageUtil.readTeacherInfo().id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            const {startTime, endTime, code_out7, qrcode, tel} = res.data
            this.$store.dispatch("setSystemInfo", {
              startTime: startTime,
              endTime: endTime,
              tel: tel,
              qrcode: qrcode,
              authorizationCode: code_out7
            });
          }
        }).catch(err => promptUtil.LOG("getSchoolDueInfo-err", err))
        this.isShowBecomeDue = true
      }
      this.getLiveCourseData()
      this.getOperationalData()
      this.initIndexPageBase()
      flowStatistics(qs.stringify({
        school_id: storageUtil.readTeacherInfo().school_id,
      })).then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.statisticalData.used = res.data.surplus_G
            this.statisticalData.residualtimes = res.data.surplus_cishu
            this.statisticalData.total = res.data.max_G
            this.statisticalData.totaltimes = res.data.max_cishu
          }
        } else if (res.code == ERROR_CODE) {
          promptUtil.error(this, res.msg)
        } else {
          promptUtil.wait(this)
        }
      }).catch(err => {
        promptUtil.LOG('getSystematicStatistics-err', err)
      })
      //获取图标信息
      indexFlowStatistics(qs.stringify({
        school_id: storageUtil.readTeacherInfo().school_id,
      })).then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.flowData = {
              stroageDate: res.data.cunchu.date,
              stroageValue: res.data.cunchu.value,
              stroageMax: res.data.cunchu.max,
              stroageUnit: res.data.cunchu.danwei,
              visitDate: res.data.use.date,
              visitValue: res.data.use.value,
              visitMax: res.data.use.max,
              visitUnit: res.data.use.danwei,
            }
            this.visitsFlowChart()
            var width = $("#visits").width();
            var height = $("#visits").height();
            $("#storage").css("width", width).css("height", height);
          }
        } else {
          promptUtil.warning(this, res.msg)
        }

      }).catch(err => {
        promptUtil.LOG('saveEduReporter-err', err)
      })
    },
    update() {
      let width=$(".courseNameWidthBox").width()+'px'
      $(".courseNameWidth").css({"width":width})
      let classnameWidth=$(".classNameWidthBox").width()+'px'
      $(".classNameWidth").css({"width":classnameWidth})
    },
    methods: {
      // 选择教师时触发,返回对应的数据
      selectTeacherWithSchedule(val) {
        this.getTeacherCollapseList(val)
        const loading = promptUtil.loading(this)
        setTimeout(() => {
          loading.close()
        }, 500)
      },
      // 获取直播课信息
      getLiveCourseData() {
        getCoursesLivePackage(qs.stringify({user_id: storageUtil.readTeacherInfo().id})).then(res => {
          if (res.code == SUCCESS_CODE && res.data && res.data != '[]') {
            const livePackage = res.data[0]
            this.liveCourseInfo = {title: livePackage.title, desc: livePackage.con, id: livePackage.id}
            this.isShowLiveCourse = true
          } else {
            this.isShowLiveCourse = false
          }
        }).catch(err => promptUtil.LOG("getCoursesLivePackage-err", err))
      },
      // 进入直播课页面
      intoLiveCourse() {
        this.$router.push({
          path: "/resourcesLiveList/" + this.liveCourseInfo.id
        });
      },
      // 获取运营数据
      getOperationalData() {
        //渲染今日上课人数
        getClassNumber(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != '[]') {
              this.saveClassNumber = res.data
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg)
          } else {
            promptUtil.wait(this)
          }
        }).catch(err => {
          promptUtil.LOG("getClassNumber-err", err)
        });
      },
      // 获取教师当前的课程安排
      getTeacherCollapseList(id = 0) {
        const yyyymmdd = moment(new Date().getTime()).format("YYYY-MM-DD")
        getClassContent(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          start: yyyymmdd,
          end: yyyymmdd,
          teacher_id: id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            this.teacherScheduleList = []
            let color = ""
            if (res.data && res.data != '[]') {
              res.data.map((item, key) => {
                // if(key==0){this.activeTeacherScheduleName = item.raw.id}
                this.teacherScheduleList.push(this.genTeacherScheduleObj(item))
                // setTimeout(() => {
                //   this.setCollapseStyle(item.raw.id, item.bgColor)
                // }, 40)
              })
              this.$refs.usersPageination.setServerData(this.teacherScheduleList)
            }
          }
          this.isShowEmptyOrCourseListStatus = 0
          if (this.teacherScheduleList.length == 0) {
            this.isShowEmptyOrCourseListStatus = 2 // 显示今日课程内容 0 显示空 1 显示列表 2 显示今日无课
          } else {
            this.isShowEmptyOrCourseListStatus = 1
          }
          if (this.isShowLiveCourse) {
            for (var i = 1; i <= 10; i++) {
              setTimeout(() => {
                const height = $("#today-course-list").height()
                $("#live-course-enter").height(height)
              }, 100 * i)
            }
          }
        }).catch(err => {
          promptUtil.LOG('getClassContent', err)
        })
      },
      // 教师名下所有学生列表
      courseHandle(type, item) {
        if (type == 1) { // 备课
          this.$router.push({
            path: `/resourcesList/` + item.courseId
          });
        } else if (type == 2) { // 上课
          // this.changeCourseStatus(0, item)
        } else if (type == 3) {  // 结课
          // this.delCloseCourseShow = true
          // this.currentCloseCourseItem = item
          this.$router.push({path: "/recordDetail/" + item.id})
        }
      },
      // 结课响应
      closeCourseShow() {
        const obj = this.currentCloseCourseItem
        changeTeacherCourseStatus(qs.stringify({
          calendar_id: obj.id,
          type: 1, //0上课  1结课
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            this.teacherScheduleList.splice(this.teacherScheduleList.findIndex(item => item.id == obj.id), 1)
            this.delCloseCourseShow = false
            if (this.teacherScheduleList.length == 0) {
              this.isShowEmptyOrCourseListStatus = 2
            }
          } else {
            promptUtil.warning(this, res.msg)
          }
        }).catch(err => promptUtil.LOG("changeTeacherCourseStatus-err", err))
      },
      // 上课\结课
      changeCourseStatus(type, obj) {
        changeTeacherCourseStatus(qs.stringify({
          calendar_id: obj.id,
          type: type, //上课  1结课
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            this.teacherScheduleList.splice(this.teacherScheduleList.findIndex(item => item.id == obj.id), 1)
          } else {
            promptUtil.warning(this, res.msg)
          }
        }).catch(err => promptUtil.LOG("changeTeacherCourseStatus-err", err))
      },
      // 通过属性设置Collapse的样式
      setCollapseStyle(id, style) {
        const color = style
        const parentClassName = '.collapse-item-parent-' + id
        $(parentClassName + " .el-collapse-item__header").css("background-color", color).css("border-radius", "50px")
      },
      delStudentFromSchedule() {
        if (this.currentSelectStudentToScheduleObj) {
          saveStudentInformation(qs.stringify({
            calendar_id: this.activeTeacherScheduleName,
            school_id: storageUtil.readTeacherInfo().school_id,
            student_id: this.currentSelectStudentToScheduleObj.value,
            cs_id: this.currentSelectStudentToScheduleObj.cs_id,
            del: 1,
            status: 0,
            type: 1, // 临时学生
          })).then(res => {
            if (res.code == SUCCESS_CODE) {
              if (res.data && res.data != '[]') {
                this.teacherScheduleList.map(teacher => {
                  const index = teacher.studentArray.findIndex(item => item.cs_id == this.currentSelectStudentToScheduleObj.cs_id)
                  const obj = teacher.studentArray.find(item => item.cs_id == this.currentSelectStudentToScheduleObj.cs_id)
                  if (index >= 0) {
                    teacher.studentNoArray.push(obj)
                  }
                  teacher.studentArray.splice(index, 1)
                  teacher.count = teacher.studentArray.length
                })
                this.getOperationalData()
                promptUtil.success(this, this.$t(`message.prompt_delete_finish`))
              }
            } else if (res.code == ERROR_CODE) {
              promptUtil.warning(this, res.msg)
            }
            this.isAddStudentScheduleLoading = false
          }).catch(err => {
            promptUtil.LOG("saveStudentInformation", err)
            this.isAddStudentScheduleLoading = false
          })
        } else {
          promptUtil.warning(this, this.$t(`message.prompt_warn_waiting`))
        }
        this.delScheduleStudentShow = false
      },
      // 添加学生到课时中
      addStudentToSchedule() {
        if (this.currentSelectStudentToScheduleObj && this.currentSelectStudentToScheduleObj.value) {
          this.isAddStudentScheduleLoading = true
          saveStudentInformation(qs.stringify({
            calendar_id: this.activeTeacherScheduleName,
            school_id: storageUtil.readTeacherInfo().school_id,
            student_id: this.currentSelectStudentToScheduleObj.value,
            status: 0,
            type: 0, // 临时学生
          })).then(res => {
            if (res.code == SUCCESS_CODE) {
              if (res.data && res.data != '[]') {
                this.teacherScheduleList.map(teacher => {
                  if (teacher.id == this.activeTeacherScheduleName) {
                    teacher.studentArray.push(this.convertNewStudentToStudent(res.data[0]))
                    teacher.studentNoArray.splice(teacher.studentNoArray.findIndex(item => item.value == this.currentSelectStudentToScheduleObj.value), 1) // 删除掉select中的数据
                    teacher.count = teacher.studentArray.length
                  }
                })
                this.getOperationalData()
                promptUtil.success(this, this.$t(`message.prompt_add_finish`))
              }
            } else if (res.code == ERROR_CODE) {
              promptUtil.warning(this, res.msg)
            }
            this.isAddStudentScheduleLoading = false
          }).catch(err => {
            promptUtil.LOG("saveStudentInformation", err)
            this.isAddStudentScheduleLoading = false
          })
        } else {
          promptUtil.warning(this, this.$t(`message.prompt_warn_waiting`))
        }
        this.showStudentSelect = 0
        this.currentSelectScheduleStuValue = ''
      },
      // 点选select将学生加入到课时
      selectStudentToSchedule(val) {
        this.showStudentSelect = 2
        const teacherObj = this.teacherScheduleList.find(teacher => teacher.id == this.activeTeacherScheduleName)
        if (teacherObj.studentNoArray && teacherObj.studentNoArray.length > 0) {
          this.currentSelectStudentToScheduleObj = teacherObj.studentNoArray.find(item => item.value == val)
        }
      },
      // 修改学生状态时点选对应状态后触发
      studentStatusCommand(command) {
        const comArr = command.split("-")
        const status = comArr[0] // 用户状态 请假等
        const csId = comArr[1] // 学生在课时中的id
        const type = comArr[3] // 学生类型
        const id = comArr[2] // 学生id
        saveStudentInformation(qs.stringify({
          calendar_id: this.activeTeacherScheduleName,
          school_id: storageUtil.readTeacherInfo().school_id,
          student_id: id,
          cs_id: csId,
          status: status,
          type: type, // 临时学生
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            this.teacherScheduleList.map(teacher => {
              if (teacher.id == this.activeTeacherScheduleName) {
                teacher.studentArray.map(stu => {
                  if (stu.cs_id == csId) {
                    stu.status = status
                    if (status == 1) {
                      $("#stu_status_command_" + csId).css("background-color", "#67C23A")
                    } else if (status == 2) {
                      $("#stu_status_command_" + csId).css("background-color", "#F56C6C")
                    } else if (status == 3) {
                      $("#stu_status_command_" + csId).css("background-color", "#E6A23C")
                    }
                  }
                })
              }
            })
            this.getOperationalData()
          } else {
            if (res.code == ERROR_CODE) {
              promptUtil.warning(this, res.msg)
            } else {
              promptUtil.warning(this, this.$t(`message.prompt_warn_waiting`))
            }
          }
        }).catch(err => promptUtil.LOG("saveStudentInformation", err))
      },
      // 点选对应教师课时时需要触发该方法
      changeCollapseSchedule() {
        this.showStudentSelect = 0 // 将添加学生重置为添加页面
        this.delScheduleStudentShow = false
        this.isAddStudentScheduleLoading = false
      },
      convertNewStudentToStudent(csId) {
        const {label, phone, username, img_head, value} = this.currentSelectStudentToScheduleObj
        const obj = {
          cs_id: csId,
          img_head: img_head,
          phone: phone,
          label: label,
          status: 0,
          type: 0,
          username: username,
          value: value
        }
        return obj
      },
      // 生成教师课时对象内容
      genTeacherScheduleObj(item) {
        const obj = {
          courseId: item.raw.courseObj.value, // 课程id
          id: item.raw.id, // 课时id
          count: item.raw.currentStuNum, // 当前班级人数
          max: item.raw.totalStuNum, // 班级最大人数
          teaAvatar: item.raw.teacherObj.head, // 教师头像
          teaName: item.raw.teacherObj.label, // 教师名称
          date: item.raw.startTime + "—" + item.raw.endTime, // 起始时间—结束时间
          content: item.raw.courseObj.label + "/" + item.raw.stageObj.label, // 课程名称/阶段
          className: item.raw.classroomObj.label, // 班级名称
          studentArray: item.raw.studentObj, // 学生列表
          studentNoArray: item.raw.studentNoObj, // no学生
          color: item.bgColor
        }
        return obj
      },
      clickDeleleLink(obj) {
        this.currentSelectStudentToScheduleObj = obj
        this.delScheduleStudentShow = true
      },
      // 解析服务器返回数据并拼装正确格式
      anysisDataFromServer(data) {
        const moment = require("moment");
        const dataRaw = data.map(item => {
          item.date = moment(parseInt(item.date) * 1000).format(
            "YYYY-MM-DD"
          );
          item.remarks = item.remake;
          return item;
        });
        return dataRaw;
      },
      dropDown: function () {
        $(".show").hide();
        $(".close").show();
        this.show = true;
      },
      dropUp: function (index) {
        $(".show").show();
        $(".close").hide();
        this.show = false;
      },
      //查看课程
      // seeCourse(courseId) {
      //   this.$router.push({path: '/resourcesList/' + courseId})
      // },
      // 设置当前table索引
      indexMethod(index) {
        return index + 1 + (this.currentPage - 1) * 3;
      },
      // 当前页触发函数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.tableData = this.queryFromServer.slice(
          (this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize
        );
      },
      // 加载index基本页面信息
      initIndexPageBase() {
        const loading = promptUtil.loading(this);
        // 返回教师值设置tableData
        //获取所有教师
        getSchoolInfo(
          qs.stringify({school_id: storageUtil.readTeacherInfo().school_id})
        )
          .then(res => {
            PubSub.publish("currentMenuIndex", "/user");
            if (res.code == SUCCESS_CODE) {
              this.schoolInfo = res.data.school_data;
              this.queryFromServer = this.anysisDataFromServer(
                res.data.teacher_data
              );
              this.tableData = this.queryFromServer.slice(
                (this.currentPage - 1) * this.pageSize,
                this.pageSize + (this.currentPage - 1) * this.pageSize
              );
              if (this.queryFromServer.length <= 3) {
                this.teacherPagination = false;
              } else {
                this.teacherPagination = true;
              }
            } else {
              promptUtil.wait(this);
            }
            loading.close();
            this.getTableContentTimeoutId = null;

          })
          .catch(err => {
            loading.close();
            PubSub.publish("currentMenuIndex", "/");
            promptUtil.LOG("getSchoolInfo-err", err)
          });
        //获取所有教师
        getTeacherList(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != '[]') {
              this.searchAllTeacher = []
              const firstObj = {value: 0, label: this.$t('message.user_system_course_select_default_label')}
              this.searchAllTeacher.push(firstObj)
              res.data.forEach(item => {
                const classObj = {value: item.id, label: item.nick}
                this.searchAllTeacher.push(classObj);
              });
            }
            this.currentTeacher = 0
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg)
          } else {
            promptUtil.wait(this)
          }
        }).catch(err => {
          promptUtil.LOG("getTeacherList-err", err)
        })
        // 获取教师课时列表
        this.getTeacherCollapseList()
      },
      handleChageValue(event) {
        if (event == false) {
          this.storageShow = false,
            this.visitsShow = true
          this.visitsFlowChart()

        } else {
          this.storageShow = true
          this.visitsShow = false
          this.storageFlowChart()
        }
      },
      storageFlowChart() {
        this.storageOption = {
          title: {
            text: this.$t(`message.user_system_storage_situation`),
            textStyle: {
              color: '#000',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 14,
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [this.$t('message.user_system_storage_use')]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              // saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '44', '55', '88']
            data: this.flowData.stroageDate
          },
          yAxis: [{
            name: this.flowData.stroageUnit,
            type: 'value',
            max: this.flowData.stroageMax,
            min: 0,
            splitNumber: 10,
            splitArea: {
              show: true
            }
          }],
          series: [{
            symbolSize: 10,
            name: this.$t('message.user_system_storage_use'),
            type: 'line',
            stack: this.$t('message.user_system_storage_total'),
            // data: [10, 13, 10, 20, 30, 50, 60, 70, 80, 90],
            data: this.flowData.stroageValue,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#409EFF', //改变折线点的颜色
                lineStyle: {
                  color: '#00a2ff' //改变折线颜色
                }
              }
            },
            markLine: {
              // symbol: ['none', 'none'],//去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {//设置渐变
                      type: 'linear',
                      color: '#00a2ff',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: '#00a2ff '// 0% 处的颜色
                      }, {
                        offset: 1, color: '#00a2ff' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: true,
                    position: 'middle',
                    //formatter: `最大存储量(${})/剩余存储100G`,
                    formatter: this.$t(`message.user_system_storage_max`) + `(${this.statisticalData.total}G) ` + this.$t(`message.user_system_storage_remain_space`) + `(${this.statisticalData.used}G)`
                  }
                }
              },
              data: [{
                yAxis: this.flowData.stroageMax,//这里设置false是隐藏不了的，可以设置为-1
              },]
            }
          }]
        };
        this.storageCharts = echarts.init(document.getElementById('storage'));
        this.storageCharts.setOption(this.storageOption);
      },
      visitsFlowChart() {
        this.visitOption = {
          title: {
            text: this.$t('message.user_system_visits'),
            textStyle: {
              //文字颜色
              color: '#000',
              //字体风格,'normal','italic','oblique'
              fontStyle: 'normal',
              //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
              fontWeight: 'bold',
              //字体大小
              fontSize: 14,
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [this.$t('message.user_system_visits')]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              // saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            //  data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '', '11']
            data: this.flowData.visitDate
          },
          yAxis: [{
            name: this.flowData.visitUnit,
            type: 'value',
            min: 0,
            max: this.flowData.visitMax,
            splitNumber: 10,
            splitArea: {
              show: true
            }
          }],
          series: [{
            symbolSize: 10,
            name: this.$t('message.user_system_visits'),
            type: 'line',
            stack: this.$t('message.user_system_storage_total'),
            // data: [10, 13, 10, 134, 90, 230, 210, '', 22],
            data: this.flowData.visitValue,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#de9323', //改变折线点的颜色
                lineStyle: {
                  color: '#e6a23c' //改变折线颜色
                }
              }
            },
            markLine: {
              // symbol: ['none', 'none'],//去掉箭头
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: {//设置渐变
                      type: 'linear',
                      color: '#00a2ff',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: '#e6a23c '// 0% 处的颜色
                      }, {
                        offset: 1, color: '#e6a23c' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  },
                  label: {
                    show: true,
                    position: 'middle',
                    formatter: this.$t(`message.user_system_visits_total`) + `(${this.statisticalData.totaltimes}) ` + this.$t(`message.user_system_visits_remain`) + `(${this.statisticalData.residualtimes})`
                  }
                }
              },
              data: [{
                yAxis: this.flowData.visitMax,
              },]
            }
          }]
        };
        this.storageCharts = echarts.init(document.getElementById('visits'));
        this.storageCharts.setOption(this.visitOption);
      },
      changeTableData(val){
        this.newTeacherScheduleList=val
        this.newTeacherScheduleList.forEach(item=>{
          setTimeout(()=>{
            this.setCollapseStyle(item.id, item.color)
          },40)
        })
      },
    },
    computed: {
      classInfoList: {
        get() {
          return this.queryFromServer.length;
        }
      }
    }
  };
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

  .bg-purple-dark {
    background: #eee;
  }

  .bg-purple {
    background: #fff;
  }

  .bg-purple-light {
    background: #fff;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .grid1-content {
    border-radius: 4px;
    min-height: 46px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .fs {
    font-size: 16px;
    line-height: 2.5;
    color: #00a2ff;
    font-weight: bold;
    text-align: center;
  }

  .classfont {
    font-size: 16px;
    line-height: 2.5;
    color: #00a2ff;
    font-weight: bold;

  }

  .classCenter {
    text-align: center;
  }

  h4 {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    color: #00a2ff;
  }

  .ml a {
    text-align: center;
  }

  .pointer {
    cursor: pointer;
  }

  .boder {
    border: 1px solid #eee;
    /* background-color: #eee; */
  }

  .img {
    width: 100%;
    height: 100%;
  }

  .mt {
    margin-top: 20px;
  }

  .adminColor {
    color: red;
    background-color: red;
  }

  .classTitle {
    border-left: 2px #00a2ff solid;
    padding-left: 2px
  }

  .classContentTitle {
    /*line-height: 60px;*/
    margin-top: 20px;
    width: 100%;
    height: 60px;
    border-radius: 30px;
    background-color: #00a2ff;
    opacity: 0.8;
    /*display: flex;*/
    /*justify-content:  center;*/

  }

  .classContentTitle span {
    line-height: 60px;
  }

  .classContent {
    width: 96%;
    /*height: 200px;*/
    margin: 0 auto;
    background-color: #eee;
    /*display: flex;*/
    /*justify-content:  left;*/
    overflow: hidden;
    display: none;

  }

  .todayClass {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    line-height: 50px;
    margin-top: 5px;
    margin-left: 3px;
  }

  .contentImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .classBoxCard {
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 5px;
    width: 180px;
    height: 110px;
    border: 1px #eee solid;
    background-color: #fff;
    /*background-color: #f2f2f2;*/
    border-radius: 10px;
    box-shadow: 1px 1px 8px 3px #e0e0e0;
    padding: 10px;
    float: left;
    margin-left: 10px;
  }

  .classButton {
    width: 100%;
    height: 30px;
    border-radius: 10px;
    text-align: center;
    background: rgb(204, 204, 204);
    cursor: pointer;
    display: block;
  }

  .classButton span {
    line-height: 30px;
    color: #fff;

  }

  .icon-xueshengguanli {
    font-weight: normal !important;
    font-size: 16px;
  }

  .down {
    cursor: pointer;
  }

  .up {
    cursor: pointer;
  }

  .el-dropdown {
    display: block;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-icon-plus {
    font-size: 50px !important;
    color: #e6e6e6;
  }

  .addStudentClass {
    text-align: center;
    cursor: pointer;
    /*margin-top: 10px;*/
  }

  .addStudentClass p {
    color: #e0e0e0;
  }

  .selectStudent {
    margin-top: 30px;
  }

  .buttonHeight {
    height: 25px;
    line-height: 0.2;
  }

  /*.el-button--primary {*/
  /*  background-color: #fff !important;*/
  /*  color: #409EFF !important;*/
  /*}*/

  .fl {
    float: left;
  }

  .buttonStatus {
    width: 100%;
    height: 25px;
    line-height: 0.2;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .up {
    display: none;
  }

  .studentStatusCommand {
    background-color: #cccccc;
  }

  .studentStatusCommand:hover {
    cursor: pointer;
  }

  .el-switch__label * {
    font-size: 12px !important;
  }

  .courseNameWidth,.classNameWidth{
    /*width: 260px !important;*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>





