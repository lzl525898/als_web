<template>
  <div>
    <als-child-header :config="routerConfig"/>
    <el-tabs type="border-card" v-model="tabActive" style="margin-top: 20px" @tab-click="onClickTabs">
      <el-tab-pane :label="$t(`message.record_header_title`)" :name="TAB_NAME_ARRAY[0]">
        <el-card shadow="always">
          <el-row>
            <el-col :span="24">
              <div style="display:flex;flex:1;justify-content:center">
                <el-radio-group v-model="filter.showRecordType" @change="changeRecordClassType">
                  <el-radio-button label="1">{{this.$t(`message.record_tab_title_today`)}}</el-radio-button>
                  <el-radio-button label="2">{{this.$t(`message.record_tab_title_list`)}}</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="8">
              <div v-show="filter.showRecordType==1">
                <div style="color: #898988">{{filter.today.week}}</div>
                <div style="margin-top:-10px;margin-bottom:-10px">
                  <span>{{filter.today.year}}/{{filter.today.month}}/</span><span
                  style="font-size: 36px;font-weight: bold">{{filter.today.day}}</span></div>
              </div>
              <div v-show="filter.showRecordType!=1">
                <div style="margin-top:10px;font-size:20px">{{filter.timeFrame[0]}}—{{filter.timeFrame[1]}}</div>
              </div>
            </el-col>
            <el-col :span="16" style="height:40px">
              <div style="display:flex;height:100%;justify-content:flex-end;align-items:center;">
                <el-date-picker
                  value-format="yyyy/MM/dd"
                  v-show="filter.showRecordType!=1"
                  style="margin-right:10px"
                  size="small"
                  :clearable="false"
                  v-model="filter.timeFrame"
                  type="daterange"
                  @change="onChangeRecordClassPicker"
                  :range-separator="$t(`message.picker_date_to_placeholder`)"
                  :start-placeholder="$t(`message.picker_date_start_placeholder`)"
                  :end-placeholder="$t(`message.picker_date_end_placeholder`)">
                </el-date-picker>
                <el-dropdown @command="filterCategoryCommand" trigger="click">
                  <el-button type="primary" size="small">
                    {{filter.search.targetCategory.label}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in filter.search.category" :key="index"
                                      :command="item.label+'_'+item.value" style="padding:0">
                      <div v-show="filter.search.targetCategory.value==item.value"
                           style="text-align: center;background-color: #409EFF;padding: 0 20px;color:#fff">
                        {{item.label}}
                      </div>
                      <div v-show="filter.search.targetCategory.value!=item.value"
                           style="text-align: center;padding: 0 20px;">{{item.label}}
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-input size="small" :placeholder="$t(`message.string_label_input`)+filter.search.targetCategory.label"
                          suffix-icon="el-icon-search" v-model="filter.search.keyWorks"
                          @keydown.native.enter="queryRecordClassKeyWords"
                          style="width:200px;margin-left:5px;margin-right:15px"></el-input>
                <el-popover
                  ref="filterRecordClassPopover"
                  placement="bottom-start"
                  width="260"
                  trigger="click">
                  <div style="margin-left:10px;margin-top:10px;margin-right:10px;">
                    <el-select v-model="filter.filter.classroomArray" collapse-tags multiple clearable :placeholder="$t(`message.string_label_classroom`)"
                               size="small" style="width: 240px;">
                      <el-option
                        v-for="(item,index) in filter.filter.classroomPackage"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div
                      style="background-color:#e6e6e6;border:none;height:1px;margin-top: 20px;margin-bottom: 20px"></div>
                    <el-select v-model="filter.filter.courseArray" collapse-tags multiple clearable :placeholder="$t(`message.string_label_course`)"
                               size="small" style="width: 240px;">
                      <el-option-group
                        v-for="group in filter.filter.coursePackage"
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
                    <div
                      style="background-color:#e6e6e6;border:none;height:1px;margin-top: 20px;margin-bottom: 20px"></div>
                    <el-select v-model="filter.filter.courseTypeArray" collapse-tags multiple clearable
                               :placeholder="$t(`message.index_course_class_type`)" size="small" style="width: 240px;">
                      <el-option
                        v-for="(item,index) in filter.filter.courseTypePackage"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div
                      style="background-color:#e6e6e6;border:none;height:1px;margin-top: 20px;margin-bottom: 20px"></div>
                    <div style="margin-top:10px;display:flex;margin-bottom:10px;">
                      <el-select v-model="filter.filter.recordStatus" clearable :placeholder="$t(`message.record_if_course`)" size="small"
                                 style="width: 150px;">
                        <el-option
                          v-for="(item,index) in filter.filter.recordCategory"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <div style="display:flex;justify-content:flex-end;flex:1">
                        <el-button type="primary" plain size="small" @click="onClickFilterQuery">{{$t(`message.string_label_search`)}}</el-button>
                      </div>
                    </div>
                  </div>
                  <div slot="reference">
                    <el-badge :value="getRecordClassBadge()" v-show="getRecordClassBadge()!=0">
                      <el-button type="primary" size="small">{{$t(`message.string_label_filter`)}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </el-badge>
                    <el-button v-show="getRecordClassBadge()==0" type="primary" size="small">{{$t(`message.string_label_filter`)}}<i
                      class="el-icon-arrow-down el-icon--right"></i></el-button>
                  </div>
                </el-popover>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-table :data="classRecordTableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}"
                    border>
            <el-table-column v-if="filter.showRecordType!=1" align="center" prop="openHours" :label="$t(`message.record_start_course_time`)" width="140"
                             sortable :sort-method="sortRecordStatus"></el-table-column>
            <el-table-column align="center" prop="date" :label="$t(`message.record_time_frame`)" sortable width="140"></el-table-column>
            <el-table-column align="center" :label="$t(`message.string_label_classroom`)" width="400">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.classInfo" placement="top">
                  <div style="display:flex;justify-content: center;flex-direction:row;">
                    <el-tag size="mini" style="margin-right:5px;">{{$t(`message.string_label_class`)}}</el-tag>
                    <div style="width:380px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                      {{scope.row.classInfo}}
                    </div>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="teacher" :label="$t(`message.string_label_teacher`)" width="200"></el-table-column>
            <el-table-column align="center" prop="course" :label="$t(`message.string_label_course`)"></el-table-column>
            <el-table-column align="center" :label="$t(`message.record_course_status`)" width="130">
              <template slot-scope="scope">
                <span v-show="scope.row.status==0" style="color:#E6A23C">{{$t(`message.string_label_record_no`)}}</span>
                <span v-show="scope.row.status==1" style="color:#67C23A">{{$t(`message.string_label_record_ok`)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t(`message.string_label_should_turn`)+'/'+$t(`message.string_label_should_arrive`)" width="130">
              <template slot-scope="scope">
                <el-link :underline="false" @click="seeStudentInfo(scope.row)">{{scope.row.student.label}}<i
                  style="margin-left: 5px" class="el-icon-view"></i></el-link>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t(`message.student_management_tableData_user_operation`)" width="300" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" plain size="mini" @click="onClickIntoDetail(scope.row)">{{$t(`message.calendar_dialog_manage_course_save`)}}</el-button>
                <el-button type="primary" plain size="mini" @click="onClickEditSchedule(scope.row)">{{$t(`message.record_edit_day`)}}</el-button>
                <el-button type="danger" plain size="mini" @click="onClickDelSchedule(scope.row)">{{$t(`message.record_delete_day`)}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center;margin-top:20px;" v-show="classRecordTableData.length>0">
            <el-pagination
              background
              @current-change="classRecordCurrentChange"
              :current-page="currentClassRecordPage"
              :page-size="classRecordPageSize"
              layout="total, prev, pager, next, jumper"
              :total="classRecordList"
            ></el-pagination>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t(`message.record_course_already`)" :name="TAB_NAME_ARRAY[1]">
        <el-card shadow="always">
          <el-row>
            <el-col :span="24">
              <div style="display:flex;flex:1;justify-content:center">
                <el-radio-group v-model="classRecordFilter.showRecordType" @change="changeRecordAlreadyClassType">
                  <el-radio-button label="1">{{$t(`message.record_type_class`)}}</el-radio-button>
                  <el-radio-button label="2">{{$t(`message.record_type_student`)}}</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="8">
              <div style="margin-top:10px;font-size:20px">
                {{classRecordFilter.timeFrame[0]}}—{{classRecordFilter.timeFrame[1]}}
              </div>
            </el-col>
            <el-col :span="16" style="height:40px">
              <div style="display:flex;height:100%;justify-content:flex-end;align-items:center;">
                <el-dropdown @command="filterRecrodCategoryCommand" trigger="click">
                  <el-button type="primary" size="small">
                    {{classRecordFilter.search.targetCategory.label}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in classRecordFilter.search.category" :key="index"
                                      :command="item.label+'_'+item.value" style="padding:0">
                      <div v-show="classRecordFilter.search.targetCategory.value==item.value"
                           style="text-align: center;background-color: #409EFF;padding: 0 20px;color:#fff">
                        {{item.label}}
                      </div>
                      <div v-show="classRecordFilter.search.targetCategory.value!=item.value"
                           style="text-align: center;padding: 0 20px;">{{item.label}}
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-input size="small" :placeholder="$t(`message.string_label_input`)+classRecordFilter.search.targetCategory.label"
                          suffix-icon="el-icon-search" v-model="classRecordFilter.search.keyWorks"
                          @keydown.native.enter="queryRecordAlreadyClassKeyWords"
                          style="width:200px;margin-left:5px;margin-right:15px"></el-input>
                <el-popover
                  ref="recordFilterRecordClassPopover"
                  placement="bottom-start"
                  width="340"
                  trigger="click">
                  <div style="margin-left:10px;margin-top:10px;margin-right:10px;">
                    <el-date-picker
                      value-format="yyyy/MM/dd"
                      style="width:320px"
                      size="small"
                      :clearable="false"
                      v-model="classRecordFilter.timeFrame"
                      type="daterange"
                      align="right"
                      unlink-panels
                      :range-separator="$t(`message.picker_date_to_placeholder`)"
                      :start-placeholder="$t(`message.record_course_start_date`)"
                      :end-placeholder="$t(`message.record_course_end_date`)"
                      :picker-options="classRecordFilter.filter.pickerOptions">
                    </el-date-picker>
                    <div
                      style="background-color:#e6e6e6;border:none;height:1px;margin-top: 20px;margin-bottom: 20px"></div>
                    <el-select v-model="classRecordFilter.filter.classroomArray" collapse-tags multiple clearable
                               :placeholder="$t(`message.string_label_classroom`)" size="small" style="width: 320px;">
                      <el-option
                        v-for="(item,index) in classRecordFilter.filter.classroomPackage"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div
                      style="background-color:#e6e6e6;border:none;height:1px;margin-top: 20px;margin-bottom: 20px"></div>
                    <el-select v-model="classRecordFilter.filter.courseArray" collapse-tags multiple clearable
                               :placeholder="$t(`message.string_label_course`)" size="small" style="width: 320px;">
                      <el-option-group
                        v-for="group in classRecordFilter.filter.coursePackage"
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
                    <div
                      style="background-color:#e6e6e6;border:none;height:1px;margin-top: 20px;margin-bottom: 20px"></div>
                    <div style="margin-top:10px;display:flex;margin-bottom:10px;">
                      <div style="display:flex;justify-content:flex-end;flex:1">
                        <el-button type="primary" plain size="small" @click="onClickRecordFilterQuery">{{$t(`message.string_label_search`)}}</el-button>
                      </div>
                    </div>
                  </div>
                  <div slot="reference">
                    <el-badge :value="getRecordAlreadyClassBadge()">
                      <el-button type="primary" size="small">{{$t(`message.string_label_filter`)}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </el-badge>
                  </div>
                </el-popover>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <div style="display:flex;margin-top:-10px;margin-bottom:-10px;">
            <div style="flex:1">
              <el-button plain size="small" @click="exportRecordResult">{{$t(`message.string_export_current_result`)}}</el-button>
            </div>
            <!--            <div style="flex:1;display:flex;justify-content:flex-end;margin-top:8px"><el-checkbox v-model="classRecordFilter.tuition">学费计算</el-checkbox></div>-->
          </div>
          <el-divider></el-divider>
          <div v-show="classRecordFilter.showRecordType==1"
               style="background-color:#D4DFE5;margin-top:-25px;height: 40px;display:flex;align-items:center;margin-left:-20px;padding-left:20px;margin-right:-20px;">
            {{$t(`message.string_current_result`)}}：{{$t(`message.string_label_total`)}}： <span class="record-span-color">{{recordListServerData.length}}</span>{{$t(`message.string_label_result_count`)}} | {{$t(`message.string_label_student_course_total`)}}: <span
            class="record-span-color">{{classRecordText.studentTotalHour}}</span>{{$t(`message.string_label_course_item`)}} | {{$t(`message.string_label_teacher_course_total`)}}: <span
            class="record-span-color">{{classRecordText.teacherTotalHour}}</span>{{$t(`message.string_label_course_item`)}}
          </div>
          <div v-show="classRecordFilter.showRecordType!=1"
               style="background-color:#D4DFE5;margin-top:-25px;height: 40px;display:flex;align-items:center;margin-left:-20px;padding-left:20px;margin-right:-20px;">
            {{$t(`message.string_current_result`)}}：{{$t(`message.string_label_total`)}}: <span class="record-span-color">{{recordStuListTableData.length}}</span>{{$t(`message.string_label_result_student_count`)}}
          </div>
          <div v-show="classRecordFilter.showRecordType==1">
            <el-table :data="recordListTableData" border style="width: 100%">
              <el-table-column prop="date" align="center" :label="$t(`message.record_course_start_date`)" width="150" sortable
                               :sort-method="sortRecordDate"></el-table-column>
              <el-table-column align="center" :label="$t(`message.string_label_classroom`)" min-width="300" sortable :sort-method="sortRecordClassroom">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.classroom" placement="top">
                    <div style="display:flex;justify-content: center;flex-direction:row;">
                      <el-tag size="mini" style="margin-right:5px;">{{$t(`message.string_label_class`)}}</el-tag>
                      <div style="width:380px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        {{scope.row.classroom}}
                      </div>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="course" align="center" :label="$t(`message.string_label_course`)" min-width="250"></el-table-column>
              <el-table-column prop="teacher" align="center" :label="$t(`message.string_label_teacher`)" width="150" sortable
                               :sort-method="sortRecordTeacher"></el-table-column>
              <el-table-column prop="begins" align="center" :label="$t(`message.record_course_begin`)" width="100"></el-table-column>
              <el-table-column prop="leave" align="center" :label="$t(`message.string_label_class_takeleave`)" width="100"></el-table-column>
              <el-table-column prop="truancy" align="center" :label="$t(`message.string_label_class_truancy`)" width="100"></el-table-column>
              <el-table-column prop="pending" align="center" :label="$t(`message.string_label_class_pending`)" width="100"></el-table-column>
              <el-table-column prop="studentHour" align="center" :label="$t(`message.string_label_student_course`)" width="100"></el-table-column>
              <el-table-column prop="teacherHour" align="center" :label="$t(`message.string_label_teacher_course`)" width="100"></el-table-column>
              <el-table-column prop="time" align="center" :label="$t(`message.calendar_dialog_course_time`)" width="150" v-if="analyticalData('1')"
                               sortable :sort-method="sortRecordTime"></el-table-column>
              <el-table-column align="center" :label="$t(`message.string_label_should_turn`)+'/'+$t(`message.string_label_should_arrive`)" width="100" v-if="analyticalData('2')">
                <template slot-scope="scope">
                  <el-link :underline="false" @click="seeStudentInfo(scope.row)">{{scope.row.student.label}}<i
                    style="margin-left: 5px" class="el-icon-view"></i></el-link>
                </template>
              </el-table-column>
              <el-table-column prop="school" align="center" :label="$t(`message.record_study_school`)" v-if="analyticalData('3')"
                               min-width="150"></el-table-column>
              <el-table-column prop="category" align="center" :label="$t(`message.record_study_level`)" v-if="analyticalData('4')"
                               min-width="150"></el-table-column>
              <el-table-column prop="desc" align="center" :label="$t(`message.string_label_remark`)" v-if="analyticalData('5')"
                               min-width="150"></el-table-column>
              <el-table-column prop="creator" align="center" :label="$t(`message.record_study_creator`)" width="150"
                               v-if="analyticalData('6')"></el-table-column>
              <el-table-column prop="createDate" align="center" :label="$t(`message.record_study_create_time`)" width="180" sortable
                               :sort-method="sortRecordCreateDate"></el-table-column>
              <el-table-column fixed="right" width="80" align="center">
                <template slot="header" slot-scope="scope">
                  <el-link :underline="false" style="color:#409EFF;font-weight:bold"
                           @click="classRecordFilter.customColumnVisible=true">{{$t(`message.string_label_handle`)}}
                  </el-link>
                </template>
                <template slot-scope="scope">
                  <el-button @click="handSeeByClass(scope.row)" type="primary" plain size="mini">{{$t(`message.string_label_see`)}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="display:flex;justify-content:center;margin-top:20px;" v-show="recordListTableData.length>0">
              <el-pagination
                background
                @current-change="recordClassroomCurrentChange"
                :current-page="currentRecordClassroomPage"
                :page-size="recordClassroomPageSize"
                layout="total, prev, pager, next, jumper"
                :total="recordClassroomList"
              ></el-pagination>
            </div>
          </div>
          <div v-show="classRecordFilter.showRecordType!=1">
            <el-table :data="recordStuListTableData" border style="width: 100%">
              <el-table-column prop="date" align="center" :label="$t(`message.record_course_start_date`)" width="150" sortable
                               :sort-method="sortRecordDate"></el-table-column>
              <el-table-column prop="student" align="center" :label="$t(`message.record_student_info`)" min-width="150"></el-table-column>
              <el-table-column prop="phone" align="center" :label="$t(`message.consult_table_title_student_tel`)" min-width="150"></el-table-column>
              <el-table-column align="center" :label="$t(`message.string_label_classroom`)" min-width="150">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.classroom" placement="top">
                    <div style="display:flex;justify-content: center;flex-direction:row;">
                      <el-tag size="mini" style="margin-right:5px;">{{$t(`message.string_label_class`)}}</el-tag>
                      <div style="width:380px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        {{scope.row.classroom}}
                      </div>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="course" align="center" :label="$t(`message.string_label_course`)" min-width="250"></el-table-column>
              <el-table-column align="center" :label="$t(`message.string_label_attendance_status`)" width="100">
                <template slot-scope="scope">
                  <el-tag v-show="scope.row.attendance==1" type="success" effect="dark" size="small">{{$t(`message.record_class_begin`)}}</el-tag>
                  <el-tag v-show="scope.row.attendance==2" type="danger" effect="dark" size="small">{{$t(`message.string_label_class_truancy`)}}</el-tag>
                  <el-tag v-show="scope.row.attendance==3" type="warning" effect="dark" size="small">{{$t(`message.string_label_class_takeleave`)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="classHour" align="center" :label="$t(`message.string_label_student_course`)" width="150"></el-table-column>
              <el-table-column prop="teacher" align="center" :label="$t(`message.string_label_teacher`)" min-width="150"></el-table-column>
              <el-table-column prop="school" align="center" :label="$t(`message.record_study_school`)" v-if="analyticalStuData('1')"
                               min-width="150"></el-table-column>
              <el-table-column prop="time" align="center" :label="$t(`message.calendar_dialog_course_time`)" width="150" v-if="analyticalStuData('2')"
                               sortable :sort-method="sortRecordTime"></el-table-column>
              <el-table-column prop="category" align="center" :label="$t(`message.record_study_level`)" v-if="analyticalStuData('3')"
                               min-width="150"></el-table-column>
              <el-table-column fixed="right" width="90" align="center">
                <template slot="header" slot-scope="scope">
                  <el-link :underline="false" style="color:#409EFF;font-weight:bold"
                           @click="studentRecordFilter.customColumnVisible=true">{{$t(`message.string_label_handle`)}}
                  </el-link>
                </template>
                <template slot-scope="scope">
                  <el-button @click="handSeeByStudent(scope.row)" type="primary" plain size="mini">{{$t(`message.string_label_see`)}}</el-button>
                  <!--                  <el-button type="danger" plain size="small">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <div style="display:flex;justify-content:center;margin-top:20px;" v-show="recordStuListTableData.length>0">
              <el-pagination
                background
                @current-change="recordStudentCurrentChange"
                :current-page="currentRecordStudentsPage"
                :page-size="recordStudentsPageSize"
                layout="total, prev, pager, next, jumper"
                :total="recordStudentsList"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane :label="$t(`message.record_class_item_all`)" :name="TAB_NAME_ARRAY[2]">
        <el-card shadow="always">
          <el-row>
            <el-row>
              <el-col :span="24">
                <div style="display:flex;flex:1;justify-content:center">
                  <el-radio-group v-model="classHourRecordFilter.showRecordType" @change="changeRecordClassHourType">
                    <el-radio-button label="1">{{$t(`message.string_label_teacher_course`)}}</el-radio-button>
                    <el-radio-button label="2">{{$t(`message.string_label_student_course`)}}</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-col :span="24">
              <el-date-picker
                value-format="yyyy/MM/dd" style="width:340px" size="small" :clearable="false" type="daterange"
                align="right"
                unlink-panels :range-separator="$t(`message.picker_date_to_placeholder`)" :start-placeholder="$t(`message.record_course_start_date`)" :end-placeholder="$t(`message.record_course_end_date`)"
                v-model="classHourRecordFilter.timeFrame" :picker-options="classHourRecordFilter.filter.pickerOptions">
              </el-date-picker>
              <el-select
                v-show="classHourRecordFilter.showRecordType==1"
                v-model="classHourRecordFilter.teacherArray"
                size="small" multiple collapse-tags style="margin-left: 20px;"
                :placeholder="$t(`message.record_please_select_teacher`)">
                <el-option
                  v-for="item in classHourRecordFilter.teacherPackage"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <div style="display: flex;align-items: center">
                    <div :style="'width:16px;height:16px;border-radius:16px;background-color:'+item.color"></div>
                    <div style="margin-left: 40px">{{ item.label }}</div>
                  </div>
                </el-option>
              </el-select>
              <el-select
                v-show="classHourRecordFilter.showRecordType==2"
                v-model="classHourRecordFilter.studentArray"
                size="small" multiple collapse-tags style="margin-left: 20px;"
                :placeholder="$t(`message.record_please_select_student`)">
                <el-option
                  v-for="item in classHourRecordFilter.studentPackage"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select
                v-show="classHourRecordFilter.showRecordType==2"
                v-model="classHourRecordFilter.classroomArray"
                size="small" multiple collapse-tags style="margin-left: 20px;"
                :placeholder="$t(`message.student_management_choose_class`)">
                <el-option
                  v-for="item in classHourRecordFilter.classroomPackage"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select
                v-model="classHourRecordFilter.courseArray"
                size="small" multiple collapse-tags style="margin-left: 20px;"
                :placeholder="$t(`message.calendar_filter_select_course`)">
                <el-option
                  v-for="(item,index) in classHourRecordFilter.coursePackage"
                  :key="index"
                  :label="item.label"
                  :value="item.value+'_'+item.table">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <div style="display:flex;margin-top:-10px;margin-bottom:12px;">

            <div style="flex:1">
              <el-button plain size="small" @click="exportClassHourRecordResult">{{$t(`message.string_export_current_result`)}}</el-button>
            </div>
            <div style="flex:1;display:flex;justify-content:flex-end;">
              <el-button type="primary" plain size="small" @click="onClickQueryAllHours">{{$t(`message.string_label_search`)}}</el-button>
            </div>
          </div>
          <div v-show="classHourRecordFilter.showRecordType==1">
            <el-table :data="teacherHourTableData" border style="width: 100%" @expand-change="expandChangeClick">
              <el-table-column type="expand" style="margin:0;padding:0">
                <template slot-scope="props">
                  <el-form style="margin: 0;padding:0">
                    <el-table :data="props.row.tableData" border style="width: 100%">
                      <el-table-column prop="date" align="center" :label="$t(`message.record_course_start_date`)"></el-table-column>
                      <el-table-column prop="school" align="center" :label="$t(`message.record_study_school`)"></el-table-column>
                      <el-table-column align="center" :label="$t(`message.string_label_classroom`)" width="330">
                        <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.class" placement="top">
                            <div style="display:flex;justify-content: center;flex-direction:row;">
                              <el-tag size="mini" style="margin-right:5px;">{{$t(`message.string_label_class`)}}</el-tag>
                              <div style="width:310px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                {{scope.row.class}}
                              </div>
                            </div>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column prop="course" align="center" :label="$t(`message.string_label_course`)"></el-table-column>
                      <el-table-column prop="studentCount" align="center" :label="$t(`message.record_use_class_students`)"
                                       width="150"></el-table-column>
                      <el-table-column prop="studentHour" align="center" :label="$t(`message.string_label_student_course`)" width="150"></el-table-column>
                      <el-table-column prop="teacherHour" align="center" :label="$t(`message.string_label_teacher_course`)" width="150"></el-table-column>
                    </el-table>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="teacher" align="left" :label="$t(`message.string_label_teacher`)"></el-table-column>
              <el-table-column prop="charge" align="center" :label="$t(`message.record_use_class_students`)" width="150"></el-table-column>
              <el-table-column prop="studentHour" align="center" :label="$t(`message.string_label_student_course`)" width="150"></el-table-column>
              <el-table-column prop="teacherHour" align="center" :label="$t(`message.string_label_teacher_course`)" width="150"></el-table-column>
            </el-table>
            <div style="display:flex;justify-content:center;margin-top:20px;" v-show="teacherHourServerData.length>0">
              <el-pagination
                background
                @current-change="teacherHourCurrentChange"
                :current-page="currentTeacherHourPage"
                :page-size="teacherHourPageSize"
                layout="total, prev, pager, next, jumper"
                :total="teacherHourList"
              ></el-pagination>
            </div>
          </div>
          <div v-show="classHourRecordFilter.showRecordType!=1">
            <el-table :data="studentHourTableData" border style="width: 100%" @expand-change="expandChangeClick">
              <el-table-column type="expand" style="margin:0;padding:0">
                <template slot-scope="props">
                  <el-form style="margin: 0;padding:0">
                    <el-table :data="props.row.tableData" border style="width: 100%">
                      <el-table-column prop="date" align="center" :label="$t(`message.record_course_start_date`)" width="150"></el-table-column>
                      <el-table-column prop="school" align="center" :label="$t(`message.record_study_school`)"></el-table-column>
                      <el-table-column align="center" :label="$t(`message.string_label_classroom`)">
                        <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.class" placement="top">
                            <el-tag size="mini" style="margin-right:5px;">{{$t(`message.string_label_class`)}}</el-tag>
                            <div>{{scope.row.class}}</div>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column prop="course" align="center" :label="$t(`message.string_label_course`)"></el-table-column>
                      <el-table-column prop="attendance" align="center" :label="$t(`message.string_label_attendance_status`)" width="120">
                        <template slot-scope="scope">
                          <el-tag size="small" type="success" v-show="scope.row.attendance==1">{{$t(`message.record_class_begin`)}}</el-tag>
                          <el-tag size="small" type="warning" v-show="scope.row.attendance==2">{{$t(`message.string_label_class_takeleave`)}}</el-tag>
                          <el-tag size="small" type="danger" v-show="scope.row.attendance==3">{{$t(`message.string_label_class_truancy`)}}</el-tag>
                          <el-tag size="small" type="info" v-show="scope.row.attendance==0">{{$t(`message.string_label_class_pending`)}}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="studentHour" align="center" :label="$t(`message.string_label_student_course`)" width="120"></el-table-column>
                    </el-table>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="student" align="left" :label="$t(`message.string_label_student`)"></el-table-column>
              <el-table-column prop="begins" align="center" :label="$t(`message.record_class_must_count`)" width="120"></el-table-column>
              <el-table-column prop="studentHour" align="center" :label="$t(`message.string_label_student_course`)" width="120"></el-table-column>
            </el-table>
            <div style="display:flex;justify-content:center;margin-top:20px;" v-show="studentHourTableData.length>0">
              <el-pagination
                background
                @current-change="studentHourCurrentChange"
                :current-page="currentStudentHourPage"
                :page-size="studentHourPageSize"
                layout="total, prev, pager, next, jumper"
                :total="studentHourList"
              ></el-pagination>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <als-class-report-dialog ref="classReportDialog"/>
    <als-class-edit-dialog ref="classReportEditDialog"/>
    <el-dialog
      :title="$t(`message.record_dialog_custom_title`)" :visible.sync="classRecordFilter.customColumnVisible" width="450px" center>
      <el-checkbox :indeterminate="classRecordFilter.columnStyle.isIndeterminate"
                   v-model="classRecordFilter.columnStyle.checkAll" @change="handleRecordCheckAllChange">{{$t(`message.string_label_select_all`)}}
      </el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="classRecordFilter.columnStyle.checkedCities"
                         @change="handleRecordCheckedCitiesChange">>
        <el-checkbox v-for="(city) in classRecordFilter.columnStyle.cities" :label="city.value" :key="city.value">{{city.label}}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="classRecordFilter.customColumnVisible = false">{{$t(`message.button_cancel`)}}</el-button>
        <el-button type="primary" @click="customReportTableColumn">{{$t(`message.button_confirm`)}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t(`message.record_dialog_custom_title`)" :visible.sync="studentRecordFilter.customColumnVisible" width="350px" center>
      <el-checkbox :indeterminate="studentRecordFilter.columnStyle.isIndeterminate"
                   v-model="studentRecordFilter.columnStyle.checkAll" @change="handleStuRecordCheckAllChange">{{$t(`message.string_label_select_all`)}}
      </el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="studentRecordFilter.columnStyle.checkedCities"
                         @change="handleStuRecordCheckedCitiesChange">>
        <el-checkbox v-for="(city) in studentRecordFilter.columnStyle.cities" :label="city.value" :key="city.value">
          {{city.label}}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="studentRecordFilter.customColumnVisible = false">{{$t(`message.button_cancel`)}}</el-button>
        <el-button type="primary" @click="customStuReportTableColumn">{{$t(`message.button_confirm`)}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    const moment = require("moment")
    import $ from 'jquery'
    import PubSub from 'pubsub-js'
    import '../../../router/router'
    import '../../../api/restfulapi'
    import classReportDialog from '../../component/classReportDialog'
    import classEditorDialog from '../../component/classEditorDialog'
    import recordDetail from './recordDetail.vue'
    import childHeader from '../../component/childHeader'
    import promptUtil from '../../../utils/promptUtil'
    import storageUtil from '../../../utils/storageUtil'
    import stringUtil from '../../../utils/stringUtil'
    import {
        qs,
        delScheduleById, // 删除课时记录
        getRecordClassList,// 获取记上课数据列表
        getAllHourFilterData,// 获取课时汇总过滤基础信息
        getAllHourStudentList,// 获取课时汇总学生列表
        getAllHourTeacherList,// 获取课时汇总教师列表
        getRecordClassFilterData, // 获取记上课过滤基础信息
        getRecordAlreadyClassList, // 获取已记课程过滤基础信息
    } from '../../../api/api'

    export default {
        name: "classRecord",
        components: {
            "als-child-header": childHeader,
            "als-class-report-dialog": classReportDialog,
            "als-class-edit-dialog": classEditorDialog,
            "als-recordDetail": recordDetail,
        },
        data() {
            return {
                routerConfig: [{name: '', to: ''}],
                TAB_NAME_ARRAY: ['record_1', 'record_2', 'record_3'],
                currentTabsName: '',
                currentStudentHourPage: 1,
                studentHourPageSize: 20,
                studentHourTableData: [],
                studentHourServerData: [],
                currentTeacherHourPage: 1,
                teacherHourPageSize: 20,
                teacherHourTableData: [],  //0-》未指定  1-》出勤 2-》缺勤 3-》请假
                teacherHourServerData: [],
                classHourRecordFilter: {
                    showRecordType: 1, // 1教师课时 2学员课时
                    timeFrame: [], // 时间段
                    filter: {
                        pickerOptions: {
                            shortcuts: [
                                {
                                    text: '',
                                    onClick(picker) {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                        picker.$emit('pick', [start, end]);
                                    }
                                }, {
                                    text: '',
                                    onClick(picker) {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                        picker.$emit('pick', [start, end]);
                                    }
                                }, {
                                    text: '',
                                    onClick(picker) {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                        picker.$emit('pick', [start, end]);
                                    }
                                }]
                        },
                    },
                    teacherArray: [],
                    teacherPackage: [],
                    courseArray: [],
                    coursePackage: [],
                    studentArray: [],
                    studentPackage: [],
                    classroomArray: [],
                    classroomPackage: []
                },
                currentRecordStudentsPage: 1,
                recordStudentsPageSize: 20,
                recordStuListServerData: [],
                recordStuListTableData: [],
                studentRecordFilter: {
                    columnStyle: {
                        showColumns: [],
                        checkAll: false,
                        checkedCities: [],
                        cities: [{label:'',value:1}, {label:'',value:2}, {label:'',value:3}],
                        isIndeterminate: true
                    },
                    customColumnVisible: false,
                },
                currentRecordClassroomPage: 1,
                recordClassroomPageSize: 20,
                recordListServerData: [],
                classRecordText: {studentTotalHour: '', teacherTotalHour: ''},
                recordListTableData: [],
                classRecordFilter: {
                    columnStyle: {
                        showColumns: [],
                        checkAll: false,
                        checkedCities: [],
                        cities: [{label:'',value:1}, {label:'',value:2}, {label: '',value: 3}, {label: '',value: 4}, {label: '',value: 5}, {label:'',value:6}],
                        isIndeterminate: true
                    },
                    customColumnVisible: false,
                    tuition: false, // 学费
                    showRecordType: 1, // 1按班级 2按学员
                    timeFrame: [], // 时间段
                    search: {
                        targetCategory: {label: '', value: 1},
                        category: [{label: '', value: 1}, {label: '', value: 3}, {label: '', value: 4}],
                        keyWorks: '',
                    },
                    filter: {
                        pickerOptions: {
                            shortcuts: [
                                {
                                    text: '',
                                    onClick(picker) {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                        picker.$emit('pick', [start, end]);
                                    }
                                }, {
                                    text: '',
                                    onClick(picker) {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                        picker.$emit('pick', [start, end]);
                                    }
                                }, {
                                    text: '',
                                    onClick(picker) {
                                        const end = new Date();
                                        const start = new Date();
                                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                        picker.$emit('pick', [start, end]);
                                    }
                                }]
                        },
                        classroomArray: [],
                        classroomPackage: [],
                        courseArray: [],
                        coursePackage: [],
                    },
                },
                currentClassRecordPage: 1,
                classRecordPageSize: 20,
                classRecordServerData: [],
                classRecordTableData: [],
                tabActive: 'record_1',
                filter: {
                    today: {week: '', year: '', month: '', day: ''},
                    showRecordType: 1, // 1今日上课 2记上课列表
                    timeFrame: [], // 时间段
                    filter: {
                        classroomArray: [],
                        classroomPackage: [],
                        courseArray: [],
                        courseTypeArray: [],
                        courseTypePackage: [],
                        coursePackage: [],
                        recordStatus: '', // 未选择 0  记上课 1 未记上课 2
                        recordCategory: [{label: '', value: 1}, {label: '', value: 2}],
                    },
                    search: {
                        targetCategory: {label: '', value: 1},
                        category: [{label: '', value: 1}, {label: '', value: 2}, {label: '', value: 3}, {label: '', value: 4}],
                        keyWorks: '',
                    }
                },
                recordClassTabValue: 1,
                recordAlreadyClassTabValue: 1,
                selectStudentInformation: {},
                totalCurrentTabs: '',//当前选择的tabs
            }
        },
        computed: {
            classRecordList: {
                get() {
                    return this.classRecordServerData.length
                }
            },
            recordClassroomList: {
                get() {
                    return this.recordListServerData.length
                }
            },
            recordStudentsList: {
                get() {
                    return this.recordStuListServerData.length
                }
            },
            teacherHourList: {
                get() {
                    return this.teacherHourServerData.length
                }
            },
            studentHourList: {
                get() {
                    return this.studentHourServerData.length
                }
            }
        },
        watch: {
            '$i18n.locale': function () {
                this.initLangData()
            }
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            // 订阅选中当前菜单项的消息
            PubSub.subscribe("REFRESH_COURSE_RECORD", (msg, data) => {
                if (this.tabActive == 'record_1') {
                    this.getRecordClassDataList(this.recordClassTabValue == 1)
                }
            });
            this.initLangData()
            if (this.$route.params.tabs && this.$route.params.item) {
                this.tabActive = this.$route.params.tabs
                this.totalCurrentTabs = this.$route.params.tabs
                if (this.$route.params.tabs == 'record_1') {
                    this.filter.showRecordType = this.$route.params.item
                    this.recordClassTabValue = this.$route.params.item
                } else if (this.$route.params.tabs == 'record_2') {
                    this.classRecordFilter.showRecordType = this.$route.params.item
                    this.recordAlreadyClassTabValue = this.$route.params.item  //按班级赋值
                }

            } else {
                this.tabActive = 'record_1'
                this.filter.showRecordType = '1'
            }
            if (this.tabActive == 'record_1') {
                this.$store.dispatch("setTodayEnterStudentInformation", this.filter.showRecordType)
            }
            PubSub.publish("currentMenuIndex", ROUTER_RECORD_CLASS);
            this.initData()
        },
        methods: {
            initLangData(){
                this.routerConfig[0].name = this.$t(`message.record_header_title`)
                this.classHourRecordFilter.filter.pickerOptions.shortcuts[0].text = this.$t(`message.string_label_nearest_week`)
                this.classHourRecordFilter.filter.pickerOptions.shortcuts[1].text = this.$t(`message.string_label_nearest_month`)
                this.classHourRecordFilter.filter.pickerOptions.shortcuts[2].text = this.$t(`message.string_label_nearest_quarter`)
                this.studentRecordFilter.columnStyle.cities[0].label = this.$t(`message.calendar_dialog_course_time`)
                this.studentRecordFilter.columnStyle.cities[1].label = this.$t(`message.record_study_school`)
                this.studentRecordFilter.columnStyle.cities[2].label = this.$t(`message.record_study_level`)
                this.classRecordFilter.columnStyle.cities[0].label = this.$t(`message.calendar_dialog_course_time`)
                this.classRecordFilter.columnStyle.cities[1].label = this.$t(`message.string_label_should_turn`) + '/' + this.$t(`message.string_label_should_arrive`)
                this.classRecordFilter.columnStyle.cities[2].label = this.$t(`message.record_study_school`)
                this.classRecordFilter.columnStyle.cities[3].label = this.$t(`message.record_study_level`)
                this.classRecordFilter.columnStyle.cities[4].label = this.$t(`message.string_label_remark`)
                this.classRecordFilter.columnStyle.cities[5].label = this.$t(`message.record_study_creator`)
                this.classRecordFilter.search.targetCategory.label = this.$t(`message.classroom_table_column_classname`)
                this.classRecordFilter.search.category[0].label= this.$t(`message.classroom_table_column_classname`)
                this.classRecordFilter.search.category[1].label= this.$t(`message.string_label_teacher_name`)
                this.classRecordFilter.search.category[2].label= this.$t(`message.string_label_student_name`)
                this.classRecordFilter.filter.pickerOptions.shortcuts[0].text = this.$t(`message.string_label_nearest_week`)
                this.classRecordFilter.filter.pickerOptions.shortcuts[1].text = this.$t(`message.string_label_nearest_month`)
                this.classRecordFilter.filter.pickerOptions.shortcuts[2].text = this.$t(`message.string_label_nearest_quarter`)
                this.filter.search.targetCategory.label = this.$t(`message.classroom_table_column_classname`)
                this.filter.search.category[0].label = this.$t(`message.classroom_table_column_classname`)
                this.filter.search.category[1].label = this.$t(`message.string_label_course_name`)
                this.filter.search.category[2].label = this.$t(`message.string_label_teacher_name`)
                this.filter.search.category[3].label = this.$t(`message.string_label_student_name`)
                this.filter.filter.recordCategory[0].label = this.$t(`message.string_label_record_ok`)
                this.filter.filter.recordCategory[1].label = this.$t(`message.string_label_record_no`)
            },
            // 点选 tabs时触发
            onClickTabs(obj) {
                this.totalCurrentTabs = obj.name
                if (obj.name == this.TAB_NAME_ARRAY[0]) {
                    this.$store.dispatch("setTodayEnterStudentInformation", 1)
                    this.filter.showRecordType = 1
                    this.getRecordClassDataList(true)
                } else if (obj.name == this.TAB_NAME_ARRAY[1]) {
                    this.$store.dispatch("setTodayEnterStudentInformation", 3)
                    this.classRecordFilter.showRecordType = 1
                    this.getRecordDataListWithClassRoom()
                } else if (obj.name == this.TAB_NAME_ARRAY[2]) {
                    this.classHourRecordFilter.showRecordType = 1
                    if (this.classHourRecordFilter.classroomArray.length == 0 &&
                        this.classHourRecordFilter.teacherArray.length == 0 &&
                        this.classHourRecordFilter.studentArray.length == 0 &&
                        this.classHourRecordFilter.courseArray.length == 0) {
                        this.getAllClassFilterData()
                    }
                    this.getClassHourDataList(1)
                }
            },
            //按班级 点击查看
            handSeeByClass(row) {
                this.$router.push({
                    name: 'recordDetail',
                    params: {
                        id: row.id,
                        tabs: this.totalCurrentTabs,//最上层tab
                        item: this.recordAlreadyClassTabValue,
                    }
                })
            },
            //按学员查看
            handSeeByStudent(row) {
                this.selectStudentInformation = row
                this.$store.dispatch("setEnterStudentInformation", row)
                this.$router.push({
                    name: 'recordDetail',
                    params: {
                        id: row.id,
                        tabs: this.totalCurrentTabs,
                        item: this.recordAlreadyClassTabValue,
                    }
                })
                // this.$router.push({path: '/recordDetail/' + row.id})
            },
            onClickQueryAllHours() {
                this.getClassHourDataList(this.classHourRecordFilter.showRecordType)
            },
            getAllClassFilterData() {
                getAllHourFilterData(qs.stringify({school_id: storageUtil.readTeacherInfo().school_id})).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.classHourRecordFilter.classroomPackage = res.data.classroomPackage
                            this.classHourRecordFilter.coursePackage = res.data.coursePackage
                            this.classHourRecordFilter.studentPackage = res.data.studentPackage
                            this.classHourRecordFilter.teacherPackage = res.data.teacherPackage
                        }
                    }
                }).catch(err => {
                    promptUtil.LOG('getAllHourFilterData-err', err)
                })
            },
            getClassHourDataList(type = 1) {
                // [{id:1,table:###_self},{id:2,table:###_self},]
                const teacherFilterArr = []
                this.classHourRecordFilter.courseArray.map(item => {
                    const teacherObj = {id: item.value, table: item.table}
                    teacherFilterArr.push(teacherObj)
                })
                const filter = {
                    student: stringUtil.array2String(this.classHourRecordFilter.studentArray, ","),
                    teacher: stringUtil.array2String(this.classHourRecordFilter.teacherArray, ","),
                    class: stringUtil.array2String(this.classHourRecordFilter.classroomArray, ","),
                }
                const loading = promptUtil.loading(this)
                if (type == 1) {
                    getAllHourTeacherList(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        start_date: this.classHourRecordFilter.timeFrame[0],
                        end_date: this.classHourRecordFilter.timeFrame[1],
                        teacher: filter.teacher,
                        course: JSON.stringify(teacherFilterArr)
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.teacherHourServerData = []
                            if (res.data && res.data != '[]') {
                                this.teacherHourServerData = res.data
                            }
                        }
                        this.teacherHourCurrentChange(this.currentTeacherHourPage)
                        loading.close()
                    }).catch(err => {
                        loading.close()
                        promptUtil.LOG('getAllHourTeacherList-err', err)
                    })
                } else {
                    getAllHourStudentList(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        start_date: this.classHourRecordFilter.timeFrame[0],
                        end_date: this.classHourRecordFilter.timeFrame[1],
                        class: filter.class,
                        student: filter.student,
                        course: JSON.stringify(teacherFilterArr)
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.studentHourServerData = []
                            if (res.data && res.data != '[]') {
                                this.studentHourServerData = res.data
                            }
                        }
                        this.studentHourCurrentChange(this.currentStudentHourPage)
                        loading.close()
                    }).catch(err => {
                        loading.close()
                        promptUtil.LOG('getAllHourStudentList-err', err)
                    })
                    loading.close()
                }
            },
            expandChangeClick() { // 解决不能沾满的问题
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        $(".el-table__expanded-cell[class*=cell]").css("padding", 0).css("margin", 0)
                    }, 50 * i)
                }
            },
            // 导出数据
            exportRecordResult() {
                const queryType = this.recordAlreadyClassTabValue == 1 ? 'class' : 'student'
                const filter = this.genRecordAlreadyClassFilter()
                const loading = promptUtil.loading(this)
                const startDate = this.classRecordFilter.timeFrame[0]
                const endDate = this.classRecordFilter.timeFrame[1]
                const queryInfo = {
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    start_date: startDate,
                    end_date: endDate,
                    class_id: filter.classId,
                    course_id: filter.courseId,
                    course_type: filter.courseType,
                    select: filter.select,
                    select_type: queryType,
                    excel_out: 'out'
                }
                getRecordAlreadyClassList(qs.stringify(queryInfo)).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        promptUtil.success(this, this.$t(`message.string_label_export_success`))
                        window.open(res.data, "_self")
                    }
                    loading.close()
                }).catch(err => {
                    loading.close()
                    promptUtil.LOG('getRecordAlreadyClassList-err', err)
                })
            },
            // 导出课时数据
            exportClassHourRecordResult() {
                const teacherFilterArr = []
                this.classHourRecordFilter.courseArray.map(item => {
                    const teacherObj = {id: item.value, table: item.table}
                    teacherFilterArr.push(teacherObj)
                })
                const filter = {
                    student: stringUtil.array2String(this.classHourRecordFilter.studentArray, ","),
                    teacher: stringUtil.array2String(this.classHourRecordFilter.teacherArray, ","),
                    class: stringUtil.array2String(this.classHourRecordFilter.classroomArray, ","),
                }
                if (this.classHourRecordFilter.showRecordType == 1) { // 教师课时
                    getAllHourTeacherList(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        start_date: this.classHourRecordFilter.timeFrame[0],
                        end_date: this.classHourRecordFilter.timeFrame[1],
                        teacher: filter.teacher,
                        course: JSON.stringify(teacherFilterArr),
                        excel_out: 'out'
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.getExcelFromUrl(res.data)
                        }
                    }).catch(err => {
                        promptUtil.LOG('getAllHourTeacherList-err', err)
                    })
                } else { // 学员课时
                    getAllHourStudentList(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        start_date: this.classHourRecordFilter.timeFrame[0],
                        end_date: this.classHourRecordFilter.timeFrame[1],
                        class: filter.class,
                        student: filter.student,
                        course: JSON.stringify(teacherFilterArr),
                        excel_out: 'out'
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.getExcelFromUrl(res.data)
                        }
                    }).catch(err => {
                        promptUtil.LOG('getAllHourStudentList-err', err)
                    })
                }
            },
            getExcelFromUrl(url){
              promptUtil.success(this, this.$t(`message.string_label_export_success`))
              window.open(url, "_self")
            },
            queryRecordAlreadyClassKeyWords() {
                this.getRecordDataListWithClassRoom()
            },
            queryRecordClassKeyWords() {
                this.getRecordClassDataList()
            },
            onChangeRecordClassPicker(date) {
                this.filter.timeFrame[0] = date[0]
                this.filter.timeFrame[1] = date[1]
                this.getRecordClassDataList()
            },
            getRecordAlreadyClassBadge() {
                let num = 1
                if (this.classRecordFilter.filter.classroomArray.length > 0) {
                    num = num + 1
                }
                if (this.classRecordFilter.filter.courseArray.length > 0) {
                    num = num + 1
                }
                return num
            },
            getRecordClassBadge() {
                let num = 0
                if (this.filter.filter.classroomArray.length > 0) {
                    num = num + 1
                }
                if (this.filter.filter.courseArray.length > 0) {
                    num = num + 1
                }
                if (this.filter.filter.courseTypeArray.length > 0) {
                    num = num + 1
                }
                if (this.filter.filter.recordStatus && this.filter.filter.recordStatus != '') {
                    num = num + 1
                }
                return num
            },
            changeRecordClassHourType(val) {
                this.classHourRecordFilter.courseArray = []
                this.classHourRecordFilter.teacherArray = []
                this.classHourRecordFilter.studentArray = []
                this.classHourRecordFilter.classroomArray = []
                this.genTimeFrameStringWithTime(new Date().getTime())
                this.getClassHourDataList(val)
            },
            changeRecordAlreadyClassType(val) {
                this.classRecordFilter.filter.classroomArray = []
                this.classRecordFilter.filter.classroomArray = []
                this.genTimeFrameStringWithTime(new Date().getTime())
                this.recordAlreadyClassTabValue = val
                if (val == 1) { // 按班级
                    this.getRecordDataListWithClassRoom()
                } else { // 按学生
                    this.getRecordDataListWithClassRoom('student')
                }
            },
            changeRecordClassType(val) {
                this.$store.dispatch("setTodayEnterStudentInformation", val)
                this.filter.filter.courseArray = []
                this.filter.filter.classroomArray = []
                this.filter.filter.courseTypeArray = []
                this.filter.filter.recordStatus = ''
                this.genTimeFrameByDataPicker(new Date().getTime())
                this.recordClassTabValue = val
                if (val == 1) { // 今日课程
                    this.getRecordClassDataList(true)
                } else { // 记上课列表
                    this.getRecordClassDataList()
                }
            },
            handleStuRecordCheckAllChange(val) {
                let indexArray = []
                this.studentRecordFilter.columnStyle.cities.map(item=>indexArray.push(item.value))
                this.studentRecordFilter.columnStyle.checkedCities = val ? indexArray : []
                this.studentRecordFilter.columnStyle.isIndeterminate = false
            },
            handleStuRecordCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.studentRecordFilter.columnStyle.checkAll = checkedCount === this.studentRecordFilter.columnStyle.cities.length;
                this.studentRecordFilter.columnStyle.isIndeterminate = checkedCount > 0 && checkedCount < this.studentRecordFilter.columnStyle.cities.length
            },
            customStuReportTableColumn() {
                this.studentRecordFilter.columnStyle.showColumns = this.studentRecordFilter.columnStyle.checkedCities
                this.studentRecordFilter.customColumnVisible = false
            },
            handleRecordCheckAllChange(val) {
                let indexArray = []
                this.classRecordFilter.columnStyle.cities.map(item=>indexArray.push(item.value))
                this.classRecordFilter.columnStyle.checkedCities = val ? indexArray : []
                this.classRecordFilter.columnStyle.isIndeterminate = false
            },
            handleRecordCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.classRecordFilter.columnStyle.checkAll = checkedCount === this.classRecordFilter.columnStyle.cities.length;
                this.classRecordFilter.columnStyle.isIndeterminate = checkedCount > 0 && checkedCount < this.classRecordFilter.columnStyle.cities.length;
            },
            customReportTableColumn() {
                this.classRecordFilter.columnStyle.showColumns = this.classRecordFilter.columnStyle.checkedCities
                this.classRecordFilter.customColumnVisible = false
            },
            // 学生解析数据
            analyticalStuData(value) {
                return this.studentRecordFilter.columnStyle.showColumns.findIndex(item => item == value) >= 0
            },
            // 班级解析数据
            analyticalData(value) {
                return this.classRecordFilter.columnStyle.showColumns.findIndex(item => item == value) >= 0
            },
            // 点选过滤查询按钮
            onClickRecordFilterQuery() {
                if (this.recordAlreadyClassTabValue == 1) { // 按照班级
                    this.getRecordDataListWithClassRoom()
                } else { // 按学员
                    this.getRecordDataListWithClassRoom('student')
                }
                this.$refs.recordFilterRecordClassPopover.doClose()
            },
            // 点选过滤查询按钮
            onClickFilterQuery() {
                this.getRecordClassDataList(this.recordClassTabValue == 1)
                this.$refs.filterRecordClassPopover.doClose()
            },
            studentHourCurrentChange(val) {
                this.currentStudentHourPage = val
                this.studentHourTableData = this.studentHourServerData.slice((this.currentStudentHourPage - 1) * this.studentHourPageSize,
                    this.studentHourPageSize + (this.currentStudentHourPage - 1) * this.studentHourPageSize)
            },
            teacherHourCurrentChange(val) {
                this.currentTeacherHourPage = val
                this.teacherHourTableData = this.teacherHourServerData.slice((this.currentTeacherHourPage - 1) * this.teacherHourPageSize,
                    this.teacherHourPageSize + (this.currentTeacherHourPage - 1) * this.teacherHourPageSize)
            },
            classRecordCurrentChange(val) {
                this.currentClassRecordPage = val
                this.classRecordTableData = this.classRecordServerData.slice((this.currentClassRecordPage - 1) * this.classRecordPageSize,
                    this.classRecordPageSize + (this.currentClassRecordPage - 1) * this.classRecordPageSize)
            },
            recordStudentCurrentChange(val) {
                this.currentRecordStudentsPage = val
                this.recordStuListTableData = this.recordStuListServerData.slice((this.currentRecordStudentsPage - 1) * this.recordStudentsPageSize,
                    this.recordStudentsPageSize + (this.currentRecordStudentsPage - 1) * this.recordStudentsPageSize)
            },
            recordClassroomCurrentChange(val) {
                this.currentRecordClassroomPage = val
                this.recordListTableData = this.recordListServerData.slice((this.currentRecordClassroomPage - 1) * this.recordClassroomPageSize,
                    this.recordClassroomPageSize + (this.currentRecordClassroomPage - 1) * this.recordClassroomPageSize)
            },
            // 点选记上课 班级名称过滤
            filterCategoryCommand(command) {
                const category = command.split('_')
                this.filter.search.targetCategory.label = category[0]
                this.filter.search.targetCategory.value = category[1]
            },
            filterRecrodCategoryCommand(command) {
                const category = command.split('_')
                this.classRecordFilter.search.targetCategory.label = category[0]
                this.classRecordFilter.search.targetCategory.value = category[1]
            },
            // 查看实到/未到学生信息
            seeStudentInfo(row) {
                this.$refs.classReportDialog.show(row.id)
            },
            onClickIntoDetail(row) {
                this.$router.push({
                    name: 'recordDetail',
                    params: {
                        id: row.id,
                        tabs: 'record_1',//最上层tab
                        item: this.recordClassTabValue,
                    }
                })
                // this.$router.push({path: '/recordDetail/' + row.id})
            },
            onClickEditSchedule(obj) {
                this.$refs.classReportEditDialog.showOrHideDialog(true, obj)
            },
            onClickAlreadyClassRecord(obj) {
                // this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                //   confirmButtonText: '确定',
                //   cancelButtonText: '取消',
                //   type: 'warning'
                // }).then(() => {
                //   delScheduleById(qs.stringify({
                //     school_id: storageUtil.readTeacherInfo().school_id,
                //     user_id: storageUtil.readTeacherInfo().id,
                //     calendar_id: obj.id,
                //     lsxg:1 // 周期课时  仅删除其中一堂课程时 传1  其他时不传或传其他值
                //   })).then(res=>{
                //     this.$message({
                //       type: 'success',
                //       message: '删除成功!'
                //     });
                //     if(this.recordAlreadyClassTabValue==1){ // 按照班级
                //       this.getRecordDataListWithClassRoom()
                //     } else { // 按学员
                //       this.getRecordDataListWithClassRoom('student')
                //     }
                //   }).catch(err=>{
                //     this.$message({
                //       type: 'info',
                //       message: '已取消删除'
                //     });
                //   })
                // }).catch(() => {
                //   this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                //   });
                // });
            },
            onClickDelSchedule(obj) {
                this.$confirm(this.$t(`message.record_dialog_content_delete_warning`), this.$t(`message.dialog_header_title_prompt`), {
                    confirmButtonText: this.$t(`message.button_confirm`),
                    cancelButtonText: this.$t(`message.button_cancel`),
                    type: 'warning'
                }).then(() => {
                    delScheduleById(qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        user_id: storageUtil.readTeacherInfo().id,
                        calendar_id: obj.id,
                        lsxg: 1 // 周期课时  仅删除其中一堂课程时 传1  其他时不传或传其他值
                    })).then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.$message({
                                type: 'success',
                                message: this.$t(`message.prompt_delete_finish`)
                            });
                            this.getRecordClassDataList(this.recordClassTabValue == 1)
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    }).catch(err => {
                        this.$message({
                            type: 'info',
                            message: this.$t(`message.prompt_delete_cancel`)
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t(`message.prompt_delete_cancel`)
                    });
                });
            },
            sortRecordStatus(a, b) {
                return a.status - b.status
            },
            sortRecordDate(a, b) {
                return (a.date).localeCompare(b.date)
            },
            sortRecordCreateDate(a, b) {
                return (a.createDate).localeCompare(b.createDate)
            },
            sortRecordClassroom(a, b) {
                return (a.classroom).localeCompare(b.classroom)
            },
            sortRecordTeacher(a, b) {
                return (a.teacher).localeCompare(b.teacher)
            },
            sortRecordTime(a, b) {
                return (a.time).localeCompare(b.time)
            },
            initData() {
                this.getTodayDetail(new Date().getTime())
                this.genTimeFrameByDataPicker(new Date().getTime())
                this.getRecordClassFilterBaseInfo()
                this.getRecordClassDataList(true)
                this.getRecordDataListWithClassRoom()
                if (this.$route.params.tabs == 'record_1' && this.$route.params.item == 2) {
                    this.getRecordClassDataList(false)
                }else if(this.$route.params.tabs == 'record_2' && this.$route.params.item == 2){
                    this.getRecordDataListWithClassRoom('student')
                }
            },
            getTodayDetail(timestamp) {
                this.filter.today.week = this.getWeekWithString(moment(timestamp).format("dddd"))
                this.filter.today.year = moment(timestamp).format("YYYY")
                this.filter.today.month = moment(timestamp).format("MM")
                this.filter.today.day = moment(timestamp).format("DD")
            },
            // 生成时间范围
            genTimeFrameByDataPicker(timestamp) {
                // weekValue  1~7 星期一~星期日
                const {startTimestamp, endTimestamp} = this.genStartAndEndTimestamp(timestamp)
                this.genTimeFrameStringWithTime(startTimestamp, endTimestamp)
            },
            genRecordAlreadyClassFilter() {
                let courseId = ''
                if (this.classRecordFilter.filter.courseArray.length > 0) {
                    const courseArr = []
                    this.classRecordFilter.filter.courseArray.map(item => {
                        const courseObj = {course_table: item.split(':')[1], course_id: item.split(':')[0]}
                        courseArr.push(courseObj)
                    })
                    courseId = JSON.stringify(courseArr)
                }
                const selectObj = {
                    type: this.classRecordFilter.search.targetCategory.value,
                    keyword: this.classRecordFilter.search.keyWorks
                }
                const filter = {
                    classId: stringUtil.array2String(this.classRecordFilter.filter.classroomArray, ","),
                    courseId: courseId,
                    select: JSON.stringify(selectObj)
                }
                return filter
            },
            genRecordClassFilter() {
                let courseEnd = ''
                if (this.filter.filter.recordStatus == 1) {
                    courseEnd = 'finished'
                } else if (this.filter.filter.recordStatus == 2) {
                    courseEnd = 'no_finished'
                }
                let courseId = ''
                if (this.filter.filter.courseArray.length > 0) {
                    const courseArr = []
                    this.filter.filter.courseArray.map(item => {
                        const courseObj = {course_table: item.split(':')[1], course_id: item.split(':')[0]}
                        courseArr.push(courseObj)
                    })
                    courseId = JSON.stringify(courseArr)
                }
                const selectObj = {
                    type: this.filter.search.targetCategory.value,
                    keyword: this.filter.search.keyWorks
                }
                const filter = {
                    classId: stringUtil.array2String(this.filter.filter.classroomArray, ","),
                    courseType: stringUtil.array2String(this.filter.filter.courseTypeArray, ","),
                    courseId: courseId,
                    courseEnd: courseEnd,
                    select: JSON.stringify(selectObj)
                }
                return filter
            },
            // 上课记录-按班级
            getRecordDataListWithClassRoom(queryType = 'teacher') {
                const filter = this.genRecordAlreadyClassFilter()
                const loading = promptUtil.loading(this)
                const startDate = this.classRecordFilter.timeFrame[0]
                const endDate = this.classRecordFilter.timeFrame[1]
                const queryInfo = {
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    start_date: startDate,
                    end_date: endDate,
                    class_id: filter.classId,
                    course_id: filter.courseId,
                    course_type: filter.courseType,
                    select: filter.select,
                    select_type: queryType
                }
                getRecordAlreadyClassList(qs.stringify(queryInfo)).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.recordListServerData = []
                        this.recordStuListServerData = []
                        this.classRecordFilter.search.keyWorks = "" // 用于清空输入框
                        if (queryType == 'student') {//按学员
                            if (res.data && res.data.table && res.data.table != '[]') {
                                res.data.table.forEach(item => this.recordStuListServerData.push(this.getRecordAlreadyStudentObj(item)))
                            }
                            this.recordStudentCurrentChange(this.currentRecordStudentsPage)
                        } else {
                            this.classRecordText.studentTotalHour = res.data.studentTotalHour
                            this.classRecordText.teacherTotalHour = res.data.teacherTotalHour
                            if (res.data && res.data.table && res.data.table != '[]') {
                                res.data.table.forEach(item => this.recordListServerData.push(this.getRecordAlreadyClassObj(item)))
                            }
                            this.recordClassroomCurrentChange(this.currentRecordClassroomPage)
                        }
                    }
                    loading.close()
                }).catch(err => {
                    loading.close()
                    promptUtil.LOG('getRecordAlreadyClassList-err', err)
                })
            },
            getRecordClassDataList(today = false) { // today == false 查周期 today == true 查当日
                const yyyymmdd = this.filter.today.year + '/' + this.filter.today.month + '/' + this.filter.today.day
                const filter = this.genRecordClassFilter()
                const loading = promptUtil.loading(this)
                const startDate = this.filter.timeFrame[0]
                const endDate = this.filter.timeFrame[1]
                getRecordClassList(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    start_date: today ? yyyymmdd : startDate,
                    end_date: today ? yyyymmdd : endDate,
                    class_id: filter.classId,
                    course_id: filter.courseId,
                    course_type: filter.courseType,
                    course_end: filter.courseEnd,
                    select: filter.select
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.classRecordServerData = []
                        if (res.data && res.data != '[]') {
                            res.data.forEach(item => this.classRecordServerData.push(this.getRecordClassObj(item)))
                        }
                    }
                    this.filter.search.keyWorks = "" // 用于清空输入框
                    this.classRecordCurrentChange(this.currentClassRecordPage)
                    loading.close()
                }).catch(err => {
                    loading.close()
                    promptUtil.LOG('getRecordClassList-err', err)
                })
            },
            getRecordClassFilterBaseInfo() {
                getRecordClassFilterData(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.filter.filter.classroomPackage = res.data.classroomPackage
                        this.filter.filter.coursePackage = res.data.coursePackage
                        this.filter.filter.courseTypePackage = res.data.courseTypePackage
                        this.classRecordFilter.filter.classroomPackage = res.data.classroomPackage
                        this.classRecordFilter.filter.coursePackage = res.data.coursePackage
                        this.classRecordFilter.filter.courseTypePackage = res.data.courseTypePackage
                    }
                }).catch(err => promptUtil.LOG("getRecordClassFilterData-err", err))
            },
            // 根据起始时间和结束时间生成字符串
            genTimeFrameStringWithTime(startTimestamp, endTimestamp) {
                const startTime = moment(startTimestamp).format("YYYY/MM/DD")
                const endTime = moment(endTimestamp).format("YYYY/MM/DD")
                this.filter.timeFrame = []
                this.filter.timeFrame.push(startTime)
                this.filter.timeFrame.push(endTime)
                this.classRecordFilter.timeFrame = []
                this.classRecordFilter.timeFrame.push(startTime)
                this.classRecordFilter.timeFrame.push(endTime)
                this.classHourRecordFilter.timeFrame = []
                this.classHourRecordFilter.timeFrame.push(startTime)
                this.classHourRecordFilter.timeFrame.push(endTime)
            },
            // 根据时间戳生成起始和结束时间戳
            genStartAndEndTimestamp(timestamp) {
                const currentTimestamp = new Date(timestamp).getTime()
                const weekValue = this.getWeekValueWithString(this.getWeekWithString(moment(currentTimestamp).format("dddd")))
                const startTimestamp = currentTimestamp - (weekValue - 1) * 24 * 3600 * 1000
                const endTimestamp = currentTimestamp + (7 - weekValue) * 24 * 3600 * 1000
                return {startTimestamp: startTimestamp, endTimestamp: endTimestamp}
            },
            getRecordAlreadyStudentObj(data) {
                const obj = {
                    id: data.id,
                    studentId: data.studentId,
                    time: data.time,
                    date: data.date,
                    student: data.studentStr,
                    school: data.school,
                    phone: data.phone,
                    classroom: data.classInfo,
                    course: data.course,
                    category: data.category,
                    attendance: data.attendance,  //0-》未指定  1-》出勤 2-》缺勤 3-》请假
                    classHour: data.studentHour,
                    teacher: data.teacher,
                }
                return obj
            },
            getRecordAlreadyClassObj(data) {
                const obj = {
                    id: data.id,
                    begins: data.begins,
                    category: data.category,
                    classInfo: data.classInfo,
                    classroom: data.classroom,
                    course: data.course,
                    courseId: data.courseId,
                    courseTable: data.courseTable,
                    createDate: data.createDate,
                    creator: data.creator,
                    date: data.date,
                    desc: data.desc && data.desc != '' ? data.desc : '--',
                    leave: data.leave,
                    pending: data.pending,
                    school: data.school,
                    student: {
                        label: data.student.label,
                        value: data.student.id
                    },
                    studentHour: data.studentHour,
                    teacher: data.teacher,
                    teacherHour: data.teacherHour,
                    time: data.time,
                    truancy: data.truancy
                }
                return obj
            },
            getRecordClassObj(data) {
                const obj = {
                    id: data.id,
                    studentsId: data.studentId,
                    date: data.date,
                    openHours: data.openHours,
                    classInfo: data.classInfo + (data.studentStr ? ' ' + data.studentStr : ''),
                    teacher: data.teacher,
                    course: data.course,
                    courseId: data.courseId,
                    status: data.status, // 1 已结课 0 未结课
                    student: {
                        label: data.student.label,
                        id: data.student.id
                    },
                    tableName: data.courseTable
                }
                return obj
            },


            // 根据字符串返回星期
            getWeekWithString(str) {
                switch (str) {
                    case 'Monday':
                        return this.$t(`message.string_label_mon`)
                    case 'Tuesday':
                        return this.$t(`message.string_label_tue`)
                    case 'Wednesday':
                        return this.$t(`message.string_label_wed`)
                    case 'Thursday':
                        return this.$t(`message.string_label_thur`)
                    case 'Friday':
                        return this.$t(`message.string_label_fri`)
                    case 'Saturday':
                        return this.$t(`message.string_label_sat`)
                    case 'Sunday':
                        return this.$t(`message.string_label_sun`)
                }
            },
            // 根据字符串返回周几的值1~7
            getWeekValueWithString(str) {
                const mon = this.$t(`message.string_label_mon`)   // Monday
                const tue = this.$t(`message.string_label_tue`)   // Tuesday
                const wed = this.$t(`message.string_label_wed`)   // Wednesday
                const thur = this.$t(`message.string_label_thur`) // Thursday
                const fri = this.$t(`message.string_label_fri`)   // Friday
                const sat = this.$t(`message.string_label_sat`)   // Saturday
                const sun = this.$t(`message.string_label_sun`)   // Sunday
                switch (str) {
                    case mon:
                        return 1
                    case tue:
                        return 2
                    case wed:
                        return 3
                    case thur:
                        return 4
                    case fri:
                        return 5
                    case sat:
                        return 6
                    case sun:
                        return 7
                    default:
                        return str
                }
            },
            goBack() {
                this.$router.push({path: '/'})
            },
            // getRecordClassObj(data) {
            //     const obj = {
            //         id: data.id,
            //         studentsId:data.studentId,
            //         date: data.date,
            //         openHours: data.openHours,
            //         classInfo: data.classInfo + (data.studentStr ? ' ' + data.studentStr : ''),
            //         teacher: data.teacher,
            //         course: data.course,
            //         courseId: data.courseId,
            //         status: data.status, // 1 已结课 0 未结课
            //         student: {
            //             label: data.student.label,
            //             id: data.student.id
            //         },
            //         tableName: data.courseTable
            //     }
            //     return obj
            // }
        }
    }
</script>

<style scoped>
  .record-span-color {
    color: #409EFF;
  }
  .el-icon-view:before{
    color:#409EFF !important;

  }

</style>
