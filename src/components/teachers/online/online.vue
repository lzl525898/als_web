<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <!--    查询条件-->
    <el-card style="margin-top:10px">
      <el-row>
        <el-col :span="9">
          <div class="fl">
            开始时间
            <el-date-picker
              size="small"
              @change="searchChangeTime"
              v-model="search.startTimeSearch"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="fl">
            直播状态
            <el-select v-model="search.liveState" clearable placeholder="请选择" size="small" @change="liveStateChange"
                       style="width: 55% !important;">
              <el-option
                v-for="item in search.liveStateArray"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
<!--        <el-col :span="5">-->
<!--          <div class="fl" style="margin-left: 4px">-->
<!--            回放状态-->
<!--            <el-select v-model="search.playbackState" clearable placeholder="请选择"-->
<!--                       size="small" style="width: 55% !important;">-->
<!--              <el-option-->
<!--                v-for="item in search.playbackStateArray"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </div>-->
<!--        </el-col>-->
        <el-col :span="5">
          <div>
            <el-input v-model="search.name" placeholder="搜索课程名称" style="float: left;width: 55% !important;"
                      size="small"></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" style="float: left" @click="searchName">搜索</el-button>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="addLiveClass('addRuleForm','1')">创建课程</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" size="small" @click="multiDelLive">删除</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--   列表-->
    <el-card style="margin-top: 20px;margin-bottom:20px">
      <el-table
        :data="tableData"
        border
        ref="multipleTable"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :header-row-style="{'color':'#409EFF'}"
        style="width: 100%">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="left"
          prop="name"
          label="课程名称"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="120px"
        >
        </el-table-column>
        <el-table-column
          width="120px"
          align="center"
          prop="backStatus"
          label="回放状态"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="teacher"
          label="主讲老师"
          width="120px"
        >
        </el-table-column>

        <el-table-column
          align="center"
          prop="startTime"
          label="开始时间"
          width="120px"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="endTime"
          label="结束日期"
          width="120px"
        >
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="120px"
        >
          <template slot-scope="scope">
            <el-dropdown placement="bottom">
              <span class="el-dropdown-link">
                <span slot="reference"><i class="el-icon-more"></i></span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="enterClass(scope.$index, scope.row)">进教室</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span  v-if="scope.row.backStatus!='直播已结束'"  @click="manage(scope.$index, scope.row)">管理</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="share(scope.$index, scope.row)">分享</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="playBack(scope.$index, scope.row)">回放</span>
                </el-dropdown-item>
<!--                <el-dropdown-item>-->
<!--                  <span @click="forbidden({index: scope.$index, row:scope.row})">禁用</span>-->
<!--                </el-dropdown-item>-->
                <el-dropdown-item>
                  <span @click="delRow({index: scope.$index, row:scope.row})">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--    分页-->
    <als-pagination @tableData="changeTableData($event)" ref="alsPageination"/>
    <!--   创建课程dialog-->
    <el-dialog
      title="创建课程"
      :visible.sync="addClassDialogVisible"
      width="450px"
      :before-close="handleClose">
      <el-form :model="addRuleForm" :rules="rules" ref="addRuleForm" label-width="200px" class="demo-ruleForm"
               style="margin: 0 auto">
        <el-form-item label="课程名称" prop="name">
          <el-input size="small" style="width: 60% !important;" v-model="addRuleForm.name"
                    placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="教室容量" style="float: left" :required="true">
            <el-input size="small" style="width: 80% !important;" v-model="addRuleForm.num" placeholder="请输入教室容量"
                      :disabled="limitDisable"></el-input>
          </el-form-item>
          <el-checkbox v-model="addRuleForm.limit" style="float: left;margin-top: 12px;margin-left: -20px"
                       @change="limitChange">不设上限
          </el-checkbox>
        </el-row>
        <el-form-item label="开始时间" prop="startTime">
          <div class="block">
            <el-date-picker
              size="small"
              style="width: 60% !important;"
              v-model="addRuleForm.startTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="课程时长" prop="longTime">
          <el-time-picker
            size="small"
            style="width: 60% !important;"
            v-model="addRuleForm.longTime"
            :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
            placeholder="请选择课程时长">
          </el-time-picker>
        </el-form-item>
        <div>
          <div v-if="role==1">
            <el-form-item label="主讲老师" prop="selectTeacher">
              <el-select v-model="addRuleForm.selectTeacher" size="small" placeholder="请选择主讲人"
                         style="width: 60% !important;"
                         @change="selectTeacherChange">
                <el-option
                  v-for="item in addRuleForm.teacherArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="主讲老师" prop="speakTeacher">
              <el-input size="small" style="width: 60% !important;" v-model="addRuleForm.speakTeacher"
                        disabled></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="指派班级" prop="classes">
          <el-cascader
            size="small"
            style="width: 60%;"
            v-model="addRuleForm.classes" :options="classesInfo" :props="props" collapse-tags
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="手机网页模板属性" prop="type">
          <el-radio v-model="addRuleForm.type" label="1">已视频为主</el-radio>
          <el-radio v-model="addRuleForm.type" label="2">已ppt为主</el-radio>
        </el-form-item>
      </el-form>


      <div>
        <div v-if="sign==1">
            <span slot="footer" class="dialog-footer">
              <el-button @click="addClassDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogAddClass('addRuleForm')">确 定</el-button>
            </span>
        </div>
        <div v-else>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addClassDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editDialogAddClass('addRuleForm')">确 定</el-button>
          </span>
        </div>
      </div>


    </el-dialog>
    <!--   进入教室dialog-->
    <el-dialog
      title="进入教室"
      top="29vh"
      :visible.sync="enterClassDialogVisible"
      width="300px"
      :before-close="handleClose">
      <span>请下载最新客户端，客户端观看直播更流畅，功能更强大。</span>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" size="small" @click="downloadUser">下载客户端</el-button>
        <el-button type="primary" size="small" @click="dialogEnterClass">网页进入教室</el-button>
      </span>
    </el-dialog>

    <!-- 删除多项dialog-->
    <el-dialog title="提示" :visible.sync="deleteMultipleDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{dialogdelContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
              <el-button @click="deleteMultipleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleDelteTableList"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
    </el-dialog>

    <!--  点击列表中的删除-->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{delDialogVisibleContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
              <el-button @click="delDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleRemoveTableList"
                         :loading="isLoadingDisableWithDel">确 定</el-button>
          </span>
    </el-dialog>
    <!--    分享dialog-->
    <el-dialog
      :visible.sync="shareDialogVisible"
      width="450px"
      :before-close="handleClose">
      <el-tabs type="border-card" v-model="activeName" @tab-click="shareHandleClick" style="margin-bottom:20px">
        <el-tab-pane label="教师" name="first">
          <el-form ref="studentShareForm" :model="teacherShareForm" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="6"><span style="line-height: 27px">教师参加码</span></el-col>
              <el-col :span="13"><span style="margin-top:15px;line-height: 27px;margin-left:8px;">
                 <el-input
                   v-model="teacherShareForm.shareCodestatus"
                   size="mini"
                   :disabled="true">
                             </el-input>
              </span>
              </el-col>
              <el-col :span="5">
                <el-button plain size="mini" style="margin-left:8px" @click="teacherVhangeCodeClick">复制</el-button>
              </el-col>
            </el-row>
<!--            <el-row :gutter="5" class="marginTop">-->
<!--              <el-col :span="6"><span style="line-height: 27px">客户端进入</span>-->
<!--              </el-col>-->
<!--              <el-col :span="11">-->
<!--              <span style="margin-top:15px;">-->
<!--              <el-input-->
<!--                v-model="teacherShareForm.userEnter"-->
<!--                size="mini"-->
<!--                :disabled="true">-->
<!--             </el-input>-->
<!--            </span>-->
<!--              </el-col>-->
<!--              <el-col :span="4" :offset="2">-->
<!--                <el-button plain size="mini" style="margin-left:8px" @click="teacherUserCopyClick">复制</el-button>-->
<!--              </el-col>-->

<!--            </el-row>-->
<!--            <el-row :gutter="5" class="marginTop">-->
<!--              <el-col :span="6"><span style="margin-left:8px;line-height: 27px">网页进入</span></el-col>-->
<!--              <el-col :span="9">-->
<!--                <el-input-->
<!--                  v-model="teacherShareForm.webEnter"-->
<!--                  size="mini"-->
<!--                  :disabled="true">-->
<!--                </el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                <template>-->
<!--                  <el-popover-->
<!--                    placement="top"-->
<!--                    width="150"-->
<!--                    trigger="hover"-->
<!--                  >-->
<!--                    <div-->
<!--                      style="width:100%;height: 120px;display: flex;justify-content: center;align-items: center;margin-top: 10px">-->
<!--                      <vue-qr-->
<!--                        :text="teacherShareForm.qrDataUrl"-->
<!--                        :logoSrc="require('../../../../static/images/base/logo.jpg')"-->
<!--                        colorDark="#00a2ff"-->
<!--                        colorLight="#fff"-->
<!--                        :margin="0"-->
<!--                        :logoScale="0.4"-->
<!--                        :size="130"-->
<!--                      ></vue-qr>-->
<!--                    </div>-->
<!--                    &lt;!&ndash;                <el-button slot="reference" style="float: right;border: none;color: #00a2ff;">手机试玩</el-button>&ndash;&gt;-->
<!--                    <span slot="reference"-->
<!--                          style="color: #00a2ff;cursor: pointer;font-size:10px !important;margin-top: 7px;display: block">二维码</span>-->
<!--                  </el-popover>-->
<!--                </template>-->
<!--              </el-col>-->
<!--              <el-col :span="5">-->
<!--                <el-button plain size="mini" style="margin-left:8px " @click="teacherWebCopyClick">复制</el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row :gutter="5" class="marginTop">-->
<!--              <el-col :span="6"><span style="margin-left:8px;line-height: 27px">app进入</span></el-col>-->
<!--              <el-col :span="9">-->
<!--                <el-input-->
<!--                  v-model="teacherShareForm.appEnter"-->
<!--                  size="mini"-->
<!--                  :disabled="true">-->
<!--                </el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                <template>-->
<!--                  <el-popover-->
<!--                    placement="top"-->
<!--                    width="150"-->
<!--                    trigger="hover"-->
<!--                  >-->
<!--                    <div-->
<!--                      style="width:100%;height: 120px;display: flex;justify-content: center;align-items: center;margin-top: 10px">-->
<!--                      <vue-qr-->
<!--                        :text="teacherShareForm.appQrDataUrl"-->
<!--                        :logoSrc="require('../../../../static/images/base/logo.jpg')"-->
<!--                        colorDark="#00a2ff"-->
<!--                        colorLight="#fff"-->
<!--                        :margin="0"-->
<!--                        :logoScale="0.4"-->
<!--                        :size="130"-->
<!--                      ></vue-qr>-->
<!--                    </div>-->
<!--                    <span slot="reference"-->
<!--                          style="color: #00a2ff;cursor: pointer;font-size:10px !important;margin-top: 7px;display: block">二维码</span>-->
<!--                  </el-popover>-->
<!--                </template>-->
<!--              </el-col>-->
<!--              <el-col :span="5">-->
<!--                <el-button plain size="mini" style="margin-left:8px" @click="teacherAppCopyClick">复制</el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="学员" name="second">
          <el-form ref="studentShareForm" :model="studentShareForm" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="6"><span style="line-height: 27px">学院参加码</span></el-col>
              <el-col :span="13"><span style="margin-top:15px;line-height: 27px;margin-left:8px;">
                 <el-input
                   v-model="studentShareForm.shareCodestatus"
                   size="mini"
                   :disabled="true">
                             </el-input>
              </span>
              </el-col>
              <el-col :span="5">
                <el-button plain size="mini" style="margin-left:8px" @click="studentChangeCodeClick">复制</el-button>
              </el-col>
            </el-row>
<!--            <el-row :gutter="20">-->
<!--              <el-col :span="6"><span style="line-height: 27px">学员参加码</span></el-col>-->
<!--              <el-col :span="11"><span style="margin-top:15px;line-height: 27px;margin-left:8px;">{{studentShareForm.shareCodestatus}}</span></el-col>-->
<!--              <el-col :span="7">-->
<!--                <el-button plain size="mini" style="margin-left:8px" @click="studentChangeCodeClick">更新参加码</el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row :gutter="5" class="marginTop">-->
<!--              <el-col :span="6"><span style="line-height: 27px">客户端进入</span>-->
<!--              </el-col>-->
<!--              <el-col :span="11">-->
<!--              <span style="margin-top:15px;">-->
<!--              <el-input-->
<!--                v-model="studentShareForm.userEnter"-->
<!--                size="mini"-->
<!--                :disabled="true">-->
<!--             </el-input>-->
<!--            </span>-->
<!--              </el-col>-->
<!--              <el-col :span="4" :offset="2">-->
<!--                <el-button plain size="mini" style="margin-left:8px" @click="teacherUserCopyClick">复制</el-button>-->
<!--              </el-col>-->

<!--            </el-row>-->
<!--            <el-row :gutter="5" class="marginTop">-->
<!--              <el-col :span="6"><span style="margin-left:8px;line-height: 27px">网页进入</span></el-col>-->
<!--              <el-col :span="9">-->
<!--                <el-input-->
<!--                  v-model="studentShareForm.webEnter"-->
<!--                  size="mini"-->
<!--                  :disabled="true">-->
<!--                </el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                <template>-->
<!--                  <el-popover-->
<!--                    placement="top"-->
<!--                    width="150"-->
<!--                    trigger="hover"-->
<!--                  >-->
<!--                    <div-->
<!--                      style="width:100%;height: 120px;display: flex;justify-content: center;align-items: center;margin-top: 10px">-->
<!--                      <vue-qr-->
<!--                        :text="studentShareForm.qrDataUrl"-->
<!--                        :logoSrc="require('../../../../static/images/base/logo.jpg')"-->
<!--                        colorDark="#00a2ff"-->
<!--                        colorLight="#fff"-->
<!--                        :margin="0"-->
<!--                        :logoScale="0.4"-->
<!--                        :size="130"-->
<!--                      ></vue-qr>-->
<!--                    </div>-->
<!--                    &lt;!&ndash;                <el-button slot="reference" style="float: right;border: none;color: #00a2ff;">手机试玩</el-button>&ndash;&gt;-->
<!--                    <span slot="reference"-->
<!--                          style="color: #00a2ff;cursor: pointer;font-size:10px !important;margin-top: 7px;display: block">二维码</span>-->
<!--                  </el-popover>-->
<!--                </template>-->
<!--              </el-col>-->
<!--              <el-col :span="5">-->
<!--                <el-button plain size="mini" style="margin-left:8px " @click="studentWebCopyClick">复制</el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row :gutter="5" class="marginTop">-->
<!--              <el-col :span="6"><span style="margin-left:8px;line-height: 27px">app进入</span></el-col>-->
<!--              <el-col :span="9">-->
<!--                <el-input-->
<!--                  v-model="studentShareForm.appEnter"-->
<!--                  size="mini"-->
<!--                  :disabled="true">-->
<!--                </el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                <template>-->
<!--                  <el-popover-->
<!--                    placement="top"-->
<!--                    width="150"-->
<!--                    trigger="hover"-->
<!--                  >-->
<!--                    <div-->
<!--                      style="width:100%;height: 120px;display: flex;justify-content: center;align-items: center;margin-top: 10px">-->
<!--                      <vue-qr-->
<!--                        :text="studentShareForm.appQrDataUrl"-->
<!--                        :logoSrc="require('../../../../static/images/base/logo.jpg')"-->
<!--                        colorDark="#00a2ff"-->
<!--                        colorLight="#fff"-->
<!--                        :margin="0"-->
<!--                        :logoScale="0.4"-->
<!--                        :size="130"-->
<!--                      ></vue-qr>-->
<!--                    </div>-->
<!--                    <span slot="reference"-->
<!--                          style="color: #00a2ff;cursor: pointer;font-size:10px !important;margin-top: 7px;display: block">二维码</span>-->
<!--                  </el-popover>-->
<!--                </template>-->
<!--              </el-col>-->
<!--              <el-col :span="5">-->
<!--                <el-button plain size="mini" style="margin-left:8px" @click="studentAppCopyClick">复制</el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--    回放dialog-->
    <el-dialog
      :visible.sync="playbackDialogVisible"
      width="400px"
      center
      destroy-on-close>
      <div slot="title" style="border-bottom: 1px solid #888889;padding-bottom: 20px">直播回放</div>
      <div style="margin-top: -20px">
        <el-table
          :data="playbackData"
          border
          style="width: 100%"
          :header-row-style="{'color':'#409EFF'}"
        >
          <el-table-column prop="name" label="课程名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="status" label="回放状态" width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='0'">未录制</span>
              <span v-if="scope.row.status=='10' || scope.row.status=='20'" style="color:#E6A23C">转码中</span>
              <span v-if="scope.row.status=='30'" style="color:red">生成失败</span>
              <span v-if="scope.row.status=='100'" style="color:green">转码成功</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="50">
            <template slot-scope="scope">
              <el-link :underline="false" @click="handleClickPlayback(scope.row)" :disabled="scope.row.status!='100'">播放</el-link>
<!--              <el-dropdown placement="bottom">-->
<!--              <span class="el-dropdown-link">-->
<!--                <span slot="reference"><i class="el-icon-more"></i></span>-->
<!--              </span>-->
<!--&lt;!&ndash;                <el-dropdown-menu slot="dropdown">&ndash;&gt;-->
<!--                  <el-dropdown-item>-->
<!--                    <el-link :underline="false" @click="handleClickPlayback(scope.row)" :disabled="scope.row.status!='100'">播放</el-link>-->
<!--                  </el-dropdown-item>-->
<!--                  <el-dropdown-item>-->
<!--                    <span @click="getSeeBackUrl(scope.$index, scope.row)">获取链接</span>-->
<!--                  </el-dropdown-item>-->
<!--                  <el-dropdown-item>-->
<!--                    <span @click="delBackLive(scope.$index, scope.row)">删除</span>-->
<!--                  </el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
<!--    回放获取链接dialog getBackUrlDialog-->
    <el-dialog title="提示" :visible.sync="getBackUrlDialog" width="20%">

      <span>5555</span>
    </el-dialog>
  </div>
</template>
<script>
  import PubSub from 'pubsub-js';
  import promptUtil from "../../../utils/promptUtil";
  import stringUtil from "../../../utils/stringUtil";
  import staticUtil from "../../../utils/staticUtil";
  import pagination from '../../commons/pagination/pagination';
  import vuexUtils from '../../../utils/vuexUtils';
  import {} from "../../../api/api";
  import '../../../api/restfulapi';
  import vueQr from "vue-qr";
  import childHeader from '../../component/childHeader'
  import {
    qs,
    getClassAndStudentByTeacher,
    getTeacherList,
    addLiveClass,
    getLiveList,
    editLiveClass,
    delTableListLiveInformation,
    disableLive
  } from "../../../api/api";
  import storageUtil from "../../../utils/storageUtil";
  import loginHeader from "../../home/loginHeader";

  export default {
    components: {"als-child-header": childHeader, "als-pagination": pagination, vueQr},
    data() {
      return {
        routerConfig: [{name: vuexUtils.checkMenuExist(this, 'online').target.name, to: ''}],
        search: {
          liveState: '',
          liveStateArray: [{
            value: 1,
            label: '直播中'
          }, {
            value: 0,
            label: '未开始'
          }, {
            value: 2,
            label: '已结束'
          }],
          startTimeSearch: '',
          playbackState: '',
          playbackStateArray: [{
            value: 1,
            label: '直播中'
          }, {
            value: 2,
            label: '未开始'
          }, {
            value: 3,
            label: '已结束'
          }],
          name: '',
        },
        tableData: [],
        multipleSelection: [],//列表中选中的直播
        sendDeleteArrayId: [],//传给后台的要删除的arrayId数组
        deleteMultipleDialogVisible: false,//多选显示删除dialog
        delDialogVisible: false,//列表中显示删除dialog
        isLoadingDisableWithDel: false, // 删除dialog确认对话框中确认按钮加载状态
        dialogdelContent: '',// 直播列表对话框中显示要删除的内容
        sendDelTableListArrayId: [],//传给后台表格中的删除ID
        saveDelTableListArrayIndex: '',
        saveDelTableListArrayId: '',//表格中删除row.id
        delDialogVisibleContent: '',//列表中删除提示信息
        addClassDialogVisible: false,
        shareDialogVisible: false,//分享dialog
        activeName: 'first',
        addRuleForm: {//创建课程表单
          name: '',
          num: '',
          startTime: '',
          longTime: '',
          speakTeacher: '',
          selectTeacher: '',
          teacherArray: [],
          classes: [],
          type: '1',
          limit: false,
        },
        rules: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          startTime: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          longTime: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          speakTeacher: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          selectTeacher: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          classes: {type: 'array', required: true, message: '请至少选择一个班级', trigger: 'change'}
        },
        classesInfo: [], // 获取教室的班级列表
        props: {multiple: true},
        role: '',
        limitDisable: false,
        sendLimit: null,//是否选择上限 true传0
        enterClassDialogVisible: false,//进入教室dialog
        webUrl: '',
        clientUrl: '',
        sign: '',//创建直播1，编辑直播2
        // pickerBeginDateBefore: {
        //   disabledDate(time) {
        //     return time.getTime() < Date.now - 8.64e7   //如果当天可选，就不用减8.64e7
        //   }
        // },
        rowId: '',
        //分享dialog教师
        teacherShareForm:{
          userEnter: '',//客户端进入网址  分享dialog
          webEnter: '',//网页进入
          appEnter:'',//app进入
          qrDataUrl: '',//网页进入二维码
          appQrDataUrl:'',//app进入二维码
          shareCodestatus:''//教师参加码
        },
        //分享dialog学员
        studentShareForm:{
          userEnter: '',//客户端进入网址  分享dialog
          webEnter: '',//网页进入
          appEnter:'',//app进入
          qrDataUrl: '',//网页进入二维码
          appQrDataUrl:'',//app进入二维码
          shareCodestatus:''//学生参加码
        },
        playbackDialogVisible:false,//回放
        playbackData:[
          {
            id: 1,
            name: 'scratch',
            status:'100' ,
          }
        ],
        backDialogPlay:'',//伙房dialog中的播放按钮
        getBackUrlDialog:false,
      }
    },
    mounted() {
      this.role = storageUtil.readTeacherInfo().school_admin
      //创建课程中获取班级以及学生呢个指派班级
      getClassAndStudentByTeacher(qs.stringify({teacher_id: storageUtil.readTeacherInfo().id})).then(res => {
        PubSub.publish("currentMenuIndex", "/taskMan");
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.classesInfo = res.data;
          }
        }
      }).catch(err => {
        promptUtil.LOG("teachOwnClass-err", err);
      })
      //获取直播列表
      this.getClassTableList()
    },
    methods: {
      searchName(){
        this.getClassTableList()
      },
      searchChangeTime(event){
        this.getClassTableList()
      },
      // 不设上限
      limitChange(val) {
        this.sendLimit = val
        if (val == true) {
          this.addRuleForm.num = ""
          this.limitDisable = true
        } else {
          this.limitDisable = false
        }

      },
      // 选择直播状态
      liveStateChange(val) {
        this.getClassTableList()
      },
      // 创建课程
      addLiveClass(formName, val) {
        this.sign = val
        this.limitDisable = false
        this.addRuleForm.classes = []
        // this.$refs[formName].resetFields();
        this.addClassDialogVisible = true
        this.resetAddRuleForm()
        if (this.role != 1) {
          this.addRuleForm.speakTeacher = storageUtil.readTeacherInfo().real_name
        }
        this.getAllTeacher()
      },
      getAllTeacher() {
        //获取所有教师
        getTeacherList(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != '[]') {
              res.data.forEach(item => {
                const classObj = {value: item.id, label: item.nick}
                this.addRuleForm.teacherArray.push(classObj);
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
      },
      //dialog中的添加课程按钮
      dialogAddClass(formName) {
        if (this.addRuleForm.num == "" && this.addRuleForm.limit == false) {
          promptUtil.warning(this, "请选择或填写教室最大容量")
          return
        }
        if (this.addRuleForm.limit == false) {
          if (!(/(^[1-9]\d*$)/.test(this.addRuleForm.num))) {
            promptUtil.warning(this, "请输入正整数")
            return
          }
        }
        const moment = require("moment");
        var hour = moment(this.addRuleForm.longTime).format("HH:mm").split(':')[0];
        var min = moment(this.addRuleForm.longTime).format("HH:mm").split(':')[1];
        let longTime = Number(hour * 3600) + Number(min * 60)
        const idsObj = this.getClassAndStudentIDS(this.addRuleForm.classes)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addLiveClass(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id: this.addRuleForm.speakTeacher == "" ? this.addRuleForm.selectTeacher : storageUtil.readTeacherInfo().id,//主讲教师
              create_id: storageUtil.readTeacherInfo().id,
              title: this.addRuleForm.name,
              starttime: parseInt(this.addRuleForm.startTime.getTime() / 1000),
              endtime: parseInt(this.addRuleForm.startTime.getTime() / 1000) + longTime,
              max_users: this.sendLimit == true ? 0 : this.addRuleForm.num,
              //class_id:idsObj.classes,
              student_ids: idsObj.students,
              is_video_main: this.addRuleForm.type
            })).then(res => {
              if (res.code == SUCCESS_CODE) {
                if (res.data && res.data != '[]') {
                  this.addClassDialogVisible = false
                  this.$refs[formName].resetFields();
                  this.resetAddRuleForm()
                  this.getClassTableList()
                }
              }
            }).catch(err => {
              promptUtil.LOG('queryExamList-err', err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //管理dialog中的编辑按钮课程按钮
      editDialogAddClass(formName) {
        if (this.addRuleForm.num == "" && this.addRuleForm.limit == false) {
          promptUtil.warning(this, "请选择或填写教室最大容量")
          return
        }
        if (this.addRuleForm.limit == false) {
          if (!(/(^[1-9]\d*$)/.test(this.addRuleForm.num))) {
            promptUtil.warning(this, "请输入正整数")
            return
          }
        }
        //longTime毫秒
        const moment = require("moment");
        var hour = moment(this.addRuleForm.longTime).format("HH:mm").split(':')[0];
        var min = moment(this.addRuleForm.longTime).format("HH:mm").split(':')[1];
        let longTime = Number(hour * 3600) + Number(min * 60)
        //startTime毫秒
        var changeStartTime = Date.parse(new Date(this.addRuleForm.startTime + '')) / 1000;// 参数为String 毫秒
        const idsObj = this.getClassAndStudentIDS(this.addRuleForm.classes)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            editLiveClass(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id: this.addRuleForm.speakTeacher == "" ? this.addRuleForm.selectTeacher : storageUtil.readTeacherInfo().id,//主讲教师
              course_id: this.rowId,
              create_id: storageUtil.readTeacherInfo().id,
              title: this.addRuleForm.name,
              starttime: changeStartTime,
              endtime: changeStartTime + longTime,
              max_users: this.sendLimit == true ? 0 : this.addRuleForm.num,
              student_ids: idsObj.students,
              is_video_main: this.addRuleForm.type
            })).then(res => {
              if (res.code == SUCCESS_CODE) {
                if (res.data && res.data != '[]') {
                  this.addClassDialogVisible = false
                  this.$refs[formName].resetFields();
                  this.resetAddRuleForm()
                  this.getClassTableList()
                }
              }else if(res.code == ERROR_CODE){
                  promptUtil.warning(this,msg)
              }
            }).catch(err => {
              promptUtil.LOG('queryExamList-err', err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置表单信息
      resetAddRuleForm() {
        this.addRuleForm = {//创建课程表单
          name: '',
          num: '',
          startTime: '',
          longTime: '',
          selectTeacher: '',
          teacherArray: [],
          classes: [],
          type: '1',
          limit: false,

        }
      },
      // 获取选择的班级id和学生id
      getClassAndStudentIDS(data) {
        const tmpIdsArr = []
        const stuIdsArr = [] // 学生id数组
        data.map(item => {
          tmpIdsArr.push(item[0])
          stuIdsArr.push(item[1])
        })
        const classIdsArr = Array.from(new Set(tmpIdsArr))  // 班级id数组
        const obj = {
          classes: stringUtil.array2String(classIdsArr, ","),
          students: stringUtil.array2String(stuIdsArr, ",")
        }
        return obj
      },

      // 选择教师时触发,返回对应的数据
      selectTeacherChange(val) {
      },
      //切换分页
      changeTableData(val) {
        this.tableData = val
      },
      handleClose(done) {
        done();
        // this.sign=""
      },
      //获取直播列表
      getClassTableList() {
        const moment = require("moment");
        const loading = promptUtil.loading(this)
        getLiveList(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          user_id: storageUtil.readTeacherInfo().id,
          starttime:this.search.startTimeSearch==""?"":moment(this.search.startTimeSearch[0]).format("YYYY-MM-DD HH:mm:ss"),
          endtime:this.search.startTimeSearch==""?"":moment(this.search.startTimeSearch[1]).format("YYYY-MM-DD HH:mm:ss"),
          title:this.search.name,
          type:this.search.liveState
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            this.tableData = []
            if (res.data && res.data != '[]') {
              res.data.forEach(res => {
                const obj = {
                  id: res.id,
                  status: res.bofang_msg,
                  name: res.title,
                  backStatus: res.back_msg,//转码成功 转码中
                  backType: res.back_status,//只有100的时候可以看回放
                  teacher: res.teacher_name,
                  startTime: res.starttime,
                  endTime: res.endtime,
                  longTime: res.long_str,
                  webUrl: res.web_url,
                  clientUrl: res.client_url,
                  maxUser: res.max_users,
                  type: res.is_video_main,
                  teacherId: res.teacher_id,
                  studentIdArray: res.student_ids,
                  studentCode:res.student_code,
                  teacherCode:res.teacher_code,
                  backArray:res.back,
                }
                this.tableData.push(obj)
              })
            }
          }
          loading.close()
          this.currentPage = 1
          this.$refs.alsPageination.setServerData(this.tableData)
          // this.examCurrentChange(this.currentPage)
        }).catch(err => {
          promptUtil.LOG('queryExamList-err', err)
          loading.close()
        })
      },

      //多选删除
      multiDelLive() {
        if (this.multipleSelection.length == 0) {
          promptUtil.warning(this, '请选择要删除直播')
        } else {
          this.deleteMultipleDialogVisible = true
          this.dialogdelContent = '确定要删除此直播么'
        }
      },
      //勾选删除项
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //删除对话框中的确定按钮
      handleDelteTableList() {
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.sendDeleteArrayId.push(this.multipleSelection[i].id)
        }
        delTableListLiveInformation(qs.stringify({
          course_id: this.sendDeleteArrayId,
          user_id: storageUtil.readTeacherInfo().id
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, '删除成功')
            for (var i = 0; i < this.multipleSelection.length; i++) {
              const index = this.tableData.findIndex(item => item.id == this.multipleSelection[i].id)
              this.tableData.splice(index, 1)
            }
            this.$refs.alsPageination.setServerData(this.tableData)
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg)
          } else {
            promptUtil.wait(this)
          }
        }).catch(error => {
          promptUtil.LOG('delTableListLiveInformation-err', error)
        })
        this.deleteMultipleDialogVisible = false;
      },
      //进教室
      enterClass(index, row) {
        this.webUrl = ""
        this.clientUrl = ""
        this.enterClassDialogVisible = true
        this.webUrl = row.webUrl
        this.clientUrl = row.clientUrl

      },
      //进入教室dialog中下载客户端
      downloadUser() {
        window.open(this.clientUrl, "_blank")
      },
      //进入教室dialog网页下载
      dialogEnterClass() {
        window.open(this.webUrl, "_blank")
      },

      // 管理    // 编辑直播
      manage(index, row) {
        this.getAllTeacher()
        this.rowId = row.id
        this.addClassDialogVisible = true
        //调用回显接口
        this.addRuleForm.name = row.name,
          this.addRuleForm.num = row.maxUser == 0 ? '不设上限' : row.maxUser,
          this.addRuleForm.limit = row.maxUser == 0 ? true : false,
          this.addRuleForm.limit == true ? this.limitDisable = true : this.limitDisable = false
        this.addRuleForm.startTime = row.startTime,
          this.addRuleForm.longTime = '2020-02-07 ' + row.longTime,
          this.addRuleForm.speakTeacher = row.teacher,
          this.addRuleForm.selectTeacher = row.teacher ,//需要id
          this.addRuleForm.type = row.type + '',
          this.addRuleForm.classes = row.studentIdArray
      },
      // 分享
      share(index,row) {
        this.shareDialogVisible = true
        this.studentShareForm.shareCodestatus=row. studentCode
        this. teacherShareForm.shareCodestatus=row. teacherCode
      },
      //分享dialog更新状态码
      teacherVhangeCodeClick() {
        this.copy(this. teacherShareForm.shareCodestatus)
      },
      //分享dialog客户端进入
      teacherUserCopyClick(){
        this.copy(this.teacherShareForm.userEnter)
      },
      //分享dialog中网页端进入
      teacherWebCopyClick() {
        this.copy(this.teacherShareForm.webEnter)
      },
      //分享dialog中app进入
      teacherAppCopyClick(){
        this.copy(this.teacherShareForm.appEnter)
      },
      shareHandleClick(tab, event) {
        // console.log(tab, event);
      },
      //学生分享
      //分享dialog更新状态码
      studentChangeCodeClick() {
        this.copy(this.studentShareForm.shareCodestatus)
      },
      //分享dialog客户端进入
      studentUserCopyClick(){
        this.copy(this.studentShareForm.userEnter)
      },
      //分享dialog中网页端进入
      studentWebCopyClick() {
        this.copy(this.studentShareForm.webEnter)
      },
      //分享dialog中app进入
      studentAppCopyClick(){
        this.copy(this.studentShareForm.appEnter)
      },
      shareHandleClick(tab, event) {
        console.log(tab, event);
      },
      copy(data)  {
        let url = data;
        let oInput = document.createElement('input');
        oInput.value = url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象;
        document.execCommand("Copy"); // 执行浏览器复制命令
        promptUtil.success(this,"复制成功")
        oInput.remove()
      },
      // 回放
      playBack(index,row) {
        this.backDialogPlay=row.webUrl
        this.playbackData=[]
        this.playbackDialogVisible=true
        if(row.backArray.length!=0){
            row.backArray.forEach(res=>{
              const obj={
                id:row.id,
                name:row.name,
                status:row.backType,
                webUrl: row.webUrl,
                clientUrl: row.clientUrl,
                backUrl:res.url
              }
            })
           this.playbackData.push(obj)
          }

      },
      // 回放dialog中的播放按钮
      handleClickPlayback(){
        window.open(this.backDialogPlay, "_blank")
      },
      // 回放dialog获取连接
      getSeeBackUrl(){
        this,getBackUrlDialog=true
      },
      // 回放dialog删除
      delBackLive(){},

      // 删除
      delRow(obj) {
        // delDialogVisibleContent
        // delDialogVisible
        this.saveDelTableListArrayId = obj.row.id
        this.saveDelTableListArrayIndex = obj.index
        this.delDialogVisible = true
        this.delDialogVisibleContent = '确定要删除此课程么'
      },
      //单个删除的确定按钮
      handleRemoveTableList() {
        this.sendDelTableListArrayId.push(this.saveDelTableListArrayId)
        delTableListLiveInformation(qs.stringify({
          course_id: this.sendDelTableListArrayId,
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, '删除成功')
            this.tableData.splice(this.saveDelTableListArrayIndex, 1)
            this.$refs.alsPageination.setServerData(this.tableData)
            this.getClassTableList()
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg)
          } else {
            promptUtil.wait(this)
          }
        }).catch(error => {
          promptUtil.LOG('delTableListLiveInformation-err', error)
        })
        this.delDialogVisible = false
      },

    }
  }
</script>

<style scoped>


  .fl {
    float: left;
    /*margin: 0;*/
    /*padding: 0;*/
  }

  /*.el-input {*/
  /*  width: 55% !important;*/
  /*}*/

  /*.el-select {*/
  /*  width: 55% !important;*/
  /*}*/

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 251px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .lineHeight {
    line-height: 40px;
  }

  .marginTop {
    margin-top: 10px;
  }

</style>
