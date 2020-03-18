<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card style="margin-top:10px">
      <div slot="header">
        <div style="display: flex;">
          <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
          <div style="line-height:20px;margin-left:5px;">直播课程</div>
          <div style="flex:1;display:flex;justify-content:flex-end" v-if="role==1">
            <el-link :underline="false"><span style="color:#409EFF" @click="handleClickIntoLiveBuy">直播点数</span></el-link>
          </div>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div style="display:flex;">
              <el-image style="width: 120px; height: 120px"  :src="dabankeImg"></el-image>
              <div style="display:flex;flex:1;">
                <div style="display:flex;flex-direction:column;flex:1;padding-right:10px;width:360px">
                  <div class="course-title-base">大班课</div>
                  <div class="course-kind-base">场景:&nbsp;适用于公开课 / 精品课 / 串讲课 / 在线答疑 / 招生课</div>
                  <div class="course-kind-base">特色:&nbsp;支持支持音频 / 视频实景上课 / 发起点名 / 签到 / 桌面屏幕共享 / 课堂互动交流</div>
                  <div class="course-kind-base">直播端:&nbsp;PC客户端 / 网页端 / App</div>
                </div>
                <div style="display:flex;align-items:center">
                  <el-button type="primary" @click="handleClickCreateLiveCourse()">创建直播</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div style="display:flex;">
              <el-image style="width: 120px; height: 120px"  :src="xiaobankeImg"></el-image>
              <div style="display:flex;flex:1;">
                <div style="display:flex;flex-direction:column;flex:1;padding-right:10px;width:360px">
                  <div class="course-title-base">小班课</div>
                  <div class="course-kind-base">场景:&nbsp;适用于K12教育 / 少儿英语 / 职业培训 / 素质教育 / 语言培训</div>
                  <div class="course-kind-base">特色:&nbsp;支持多人同步音视频 / 多滚屏互动黑板 / 多维度教学场控 / 多元化互动课件</div>
                  <div class="course-kind-base">直播端:&nbsp;PC客户端 / 网页端 / App</div>
                </div>
                <div style="display:flex;align-items:center">
                  <el-button type="primary" @click="handleClickCreateLiveCourse()">创建直播</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top:20px;margin-bottom:20px;min-height:600px" v-show="isDataLoading">
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;color:#909399;min-height:600px">
        <div><i class="el-icon-loading"/></div>
        <div style="font-size:14px;margin-top:5px">玩命加载中</div>
      </div>
    </el-card>
    <!--   列表-->
    <div v-show="!isDataLoading">
      <el-card style="margin-top: 20px;margin-bottom:20px">
        <div slot="header">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">全部直播课程</div>
            <div style="flex:1;display:flex;justify-content:flex-end" v-if="role==1">
              <el-link :underline="false"><span style="color:#409EFF" @click="handleClickIntoLiveDetail">直播详情</span></el-link>
            </div>
          </div>
        </div>
        <!--    查询条件-->
        <div style="display:flex;margin-bottom:20px">
          <div style="display:flex;align-items:center;">
            <div style="margin-right:5px;font-size:14px">开始时间</div>
            <el-date-picker
              size="small"
              @change="searchChangeTime"
              v-model="search.startTimeSearch"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:280px"
              align="right"
            >
            </el-date-picker>
          </div>
          <div style="display:flex;align-items:center;margin-left:10px">
            <div style="margin-right:5px;font-size:14px">直播状态</div>
            <el-select
              v-model="search.liveState"
              clearable
              placeholder="请选择"
              size="small"
              @change="liveStateChange"
              style="width: 150px !important;"
            >
              <el-option
                v-for="item in search.liveStateArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!-- 课程类型 -->
          <div style="display:flex;align-items:center;margin-left:10px">
            <div style="margin-right:5px;font-size:14px">课程类型</div>
            <el-select
              v-model="search.liveType"
              clearable
              placeholder="请选择"
              size="small"
              @change="liveTypeChange"
              style="width:150px !important;"
            >
              <el-option
                v-for="item in search.liveTypeArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div style="display:flex;justify-content:flex-end;flex:1">
            <el-button type="danger" size="small" @click="multiDelLive" style="margin-right:10px">删除</el-button>
<!--            <el-button-->
<!--              type="primary"-->
<!--              size="small"-->
<!--              @click="addLiveClass('addRuleForm', '1')"-->
<!--              style="margin-right:10px"-->
<!--            >创建直播课-->
<!--            </el-button>-->
            <div style="display:flex;position: relative;margin-right:220px;background-color:red;">
              <el-input
                v-model="search.name"
                placeholder="搜索课程名称"
                style="width:150px;z-index:998;left:0;position:absolute"
                size="small"
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                style="z-index:999;left:146px;position:absolute"
                @click="searchName"
                :loading="searchLoading"
              >搜索
              </el-button
              >
            </div>
          </div>
        </div>
        <el-table
          :data="tableData"
          border
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          :header-row-style="{ color: '#409EFF' }"
          style="width: 100%"
        >
          <el-table-column align="center" type="selection" width="55">
          </el-table-column>
          <el-table-column label="课程名称" min-width="320px">
            <template slot-scope="scope">
              <div style="display:flex;padding:10px 0 0 10px;">
                <div class="image-wrapper">
                  <img :src="scope.row.cover" class="image"/>
                </div>
                <div style="flex:1;margin-top:8px">
                  <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="right">
                    <div style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:160px">
                      <span style="font-weight:600">{{scope.row.name}}</span>
                    </div>
                  </el-tooltip>
                  <div style="font-size:12px">创建者: <span>{{scope.row.createName}}</span></div>
                  <div style="font-size:12px">创建时间: <span>{{scope.row.createDate}}</span></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="类型" width="80px">
            <template slot-scope="scope">
              <span v-if="scope.row.classType==1">小班课</span>
              <span v-else  >大班课</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="预计消耗" width="110px">
            <template slot-scope="scope">{{scope.row.liveCount}}直播点</template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            label="状态"
            width="110px"
          >
          </el-table-column>
          <el-table-column
            width="110px"
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
            width="150px"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="endTime"
            label="结束日期"
            width="150px"
          >
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="100px"
          >
            <template slot-scope="scope">
              <el-dropdown placement="bottom">
              <span class="el-dropdown-link">
                <span slot="reference"><i class="el-icon-more"></i></span>
              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="enterClass(scope.$index, scope.row)"
                  >
                    <span>进教室</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="manage(scope.$index, scope.row)"
                  >
                    <span>管理</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="share(scope.$index, scope.row)"
                  >
                    <span>分享</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="playBack(scope.$index, scope.row)"
                  >
                    <span>回放</span>
                  </el-dropdown-item>
                  <!--                <el-dropdown-item>-->
                  <!--                  <span @click="forbidden({index: scope.$index, row:scope.row})">禁用</span>-->
                  <!--                </el-dropdown-item>-->
                  <el-dropdown-item
                    @click.native="
                    delRow({ index: scope.$index, row: scope.row })
                  "
                  >
                    <span>删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--    分页-->
      <als-pagination :size="8" @tableData="changeTableData($event)" @currentPage="changeOnlinePage($event)" ref="alsPageination"/>
    </div>
    <!--   创建课程dialog-->
    <el-dialog
      :title="addEditLiveTitle"
      :visible.sync="addClassDialogVisible"
      width="860px"
      @open="handleOpen"
      :before-close="handleClose"
    >
      <el-form
        :model="addRuleForm"
        :rules="rules"
        ref="addRuleForm"
        label-width="140px"
        :befor-colse="deleValidate"
        class="demo-ruleForm"
        style="margin: 0 auto"
      >
        <div style="display:flex;height:100%;">
          <div style="display:flex;flex:1;flex-direction:column">
            <el-form-item label="课程类型" prop="classType">
              <div style="display:flex">
                <div>
                  <el-radio-group v-model="addRuleForm.classType" @change="handleChangeClassType" :disabled="editBigSmallClass">
                    <el-radio label="1">小班课</el-radio>
                    <el-radio label="2">大班课</el-radio>
                  </el-radio-group>
                </div>
                <div style="margin-left: 10px">
                  <el-popover
                    placement="bottom-start"
                    title="课程类型说明"
                    width="200"
                    trigger="hover"
                    content="小班课适用于互动教学、一对一私教，最高支持9人同步面对面互动教学；大班课没有人数限制，适用于公开课、精品课、招生课。">
                    <i class="el-icon-warning" slot="reference"/>
                  </el-popover>
                </div>
              </div>
            </el-form-item>
            <div>
              <div v-if="role == 1">
                <el-form-item label="主讲老师" prop="selectTeacher">
                  <el-select
                    v-model="addRuleForm.selectTeacher"
                    size="mini"
                    placeholder="请选择主讲人"
                    style="width:195px;"
                    @change="selectTeacherChange"
                  >
                    <el-option
                      v-for="item in addRuleForm.teacherArray"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item label="主讲老师" prop="speakTeacher">
                  <el-input
                    size="mini"
                    style="width:195px;"
                    v-model="addRuleForm.speakTeacher"
                    disabled
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="课程名称" prop="name">
              <el-input
                size="mini"
                style="width:195px;"
                v-model="addRuleForm.name"
                placeholder="请输入课程名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <div class="block">
                <el-date-picker
                 :picker-options="pickerOptions1"
                  size="mini"
                  style="width:195px;"
                  v-model="addRuleForm.startTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  @change="changeDateTimeForm"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="课程时长" prop="longTime">
              <el-time-picker
                size="mini"
                style="width:195px;"

                v-model="addRuleForm.longTime"
                :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
              placeholder="请选择课程时长"
              >
              </el-time-picker>
            </el-form-item>
          </div>
          <div style="height:300px;width:1px;background-color:#EBEEF5"></div>
          <div style="display:flex;flex:1;flex-direction:column">
            <el-row>
              <el-form-item label="学生人数" prop="number" style="float: left">
                <el-input
                  size="mini"
                  style="width:195px;"
                  v-model="addRuleForm.num"
                  placeholder="请输入上课学生人数"
                  :disabled="limitDisable"
                ></el-input>
              </el-form-item>
              <el-checkbox
                v-model="addRuleForm.limit"
                style="float: left;margin-top: 12px;margin-left: -20px"
                :disabled="limitCheckBoxDisable"
                @change="limitChange"
              >不设上限
              </el-checkbox>
            </el-row>
            <el-form-item label="选择学生" prop="classes">
              <el-cascader
                size="mini"
                style="width:195px;"
                v-model="addRuleForm.classes"
                :options="classesInfo"
                :props="props"
                collapse-tags
                clearable
                @change="handleChangeCascader"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="手机模板属性" prop="type">
              <div style="display:flex">
                <div>
                  <el-radio v-model="addRuleForm.type" label="1">以视频为主</el-radio>
                  <el-radio v-model="addRuleForm.type" label="2">以ppt为主</el-radio>
                </div>
                <div style="margin-left: 10px">
                  <el-popover
                    placement="bottom-start"
                    title="模板说明"
                    width="200"
                    trigger="hover"
                    content="该属性只会影响家长端直播页面初始化显示风格，进入直播课程后仍然可以按照需求调整。">
                    <i class="el-icon-warning" slot="reference"/>
                  </el-popover>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="直播课封面图">
              <el-upload
                class="avatar-uploader"
                :action="postUrl"
                :show-file-list="false"
                :on-success="handleCoverSuccess"
                :before-upload="beforeCoverUpload">
                <img v-if="addRuleForm.coverUrl && addRuleForm.coverUrl!=''" :src="addRuleForm.coverUrl" class="avatar">
                <img v-else :src="defaultCoverUrl" class="avatar">
              </el-upload>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div>
        <div v-if="sign == 1">
          <div slot="footer" style="display:flex;justify-content:flex-end;padding-right:10px">
            <el-button @click="cancelDialog('addRuleForm')" style="margin-right:10px">取 消</el-button>
            <el-button type="primary" :loading="addLiveLoading" @click="dialogAddClass('addRuleForm')"
            >确 定</el-button
            >
          </div>
        </div>
        <div v-else>
          <div slot="footer" style="display:flex;justify-content:flex-end;padding-right:10px">
            <el-button @click="cancelDialog('addRuleForm')" style="margin-right:10px">取 消</el-button>
            <el-button type="primary" :loading="editLiveLoading" @click="editDialogAddClass('addRuleForm')"
            >确 定</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
    <!--   进入教室dialog-->
    <el-dialog
      title="进入教室"
      top="29vh"
      :visible.sync="enterClassDialogVisible"
      width="300px"
      :before-close="handleClose"
    >
      <el-dialog
        top="28vh"
        width="540px"
        title="客户端下载"
        :visible.sync="innerVisible"
        append-to-body>
        <div style="height:200px">
          <div style="color:#515151;font-size:20px;padding: 0 20px 10px 20px;font-weight:bold;margin-top:-10px">高清视频稳定&流畅</div>
          <div style="padding:0 20px 10px 20px" >客户端支持UDP私有协议，延时低、抗网络抖动强，
            为您提供更流畅更稳定的互动直播教学体验</div>
          <div style="color:#515151;font-size:20px;padding: 0 20px 10px 20px;font-weight:bold;">电子白板、多格式课件</div>
          <div style="padding:0 20px 30px 20px" >支持便捷的云端在线同步与分享，板书、 画图随心所欲，Office、图片通通支持</div>
          <div style="display:flex;justify-content:center;">
            <el-dropdown placement="top-end">
              <el-button icon="el-icon-mobile-phone" type="primary" style="width:160px">家长端入口</el-button>
              <el-dropdown-menu slot="dropdown">
                <div style="margin:0 5px 5px 5px">
                  <div style="margin-left:5px;margin-right:5px">
                    <img style="width: 100px; height: 100px" :src="qrCodeMobileImg"/>
                  </div>
                  <div style="font-size: 14px;color:#333;text-align: center;margin-top:5px;">微信扫一扫</div>
                  <div style="font-size: 10px;color:#888;text-align: center;margin-top:5px;">进入家长端</div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button icon="el-icon-mobile-phone" type="primary" style="width:160px;margin-left:10px" @click="downloadUser(1)">Mac版下载</el-button>
            <el-button icon="el-icon-mobile-phone" type="primary" style="width:160px" @click="downloadUser(2)">Windows版下载</el-button>
          </div>
        </div>
      </el-dialog>
      <span style="margin-top: -15px">请下载最新客户端，客户端观看直播更流畅，功能更强大。</span>
      <div style="display:flex;justify-content:center;margin-top:20px;align-items:center;">
           <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click= "innerVisible=true"
        >下载客户端</el-button>
        <el-button type="primary" size="small" @click="dialogEnterClass">网页进入教室</el-button
        >
      </span>
      </div>

    </el-dialog>

    <!-- 删除多项dialog-->
    <el-dialog
      title="提示"
      :visible.sync="deleteMultipleDialogVisible"
      width="20%"
    >
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{ dialogdelContent }}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteMultipleDialogVisible = false"
        >取 消</el-button
        >
        <el-button
          type="primary"
          @click="handleDelteTableList"
          :loading="isLoadingDisableWithDel"
        >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--  点击列表中的删除-->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{ delDialogVisibleContent }}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleRemoveTableList"
          :loading="isLoadingDisableWithDel"
        >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--    分享dialog-->
    <el-dialog
      :visible.sync="shareDialogVisible"
      width="450px"
      title="参加码"
      style="text-align:center"
      :before-close="handleClose"
    >
      <el-tabs
        type="border-card"
        v-model="activeName"
        @tab-click="shareHandleClick"
        style="margin-bottom:20px"
      >
        <el-tab-pane label="教师" name="first">
          <el-form
            ref="studentShareForm"
            :model="teacherShareForm"
            label-width="80px"
          >
            <el-row :gutter="20">
              <el-col :span="6"
              ><span style="line-height: 27px">教师参加码</span></el-col
              >
              <el-col :span="13"
              ><span
                style="margin-top:15px;line-height: 27px;margin-left:8px;"
              >
                  <el-input
                    v-model="teacherShareForm.shareCodestatus"
                    size="mini"
                    :disabled="true"
                  >
                  </el-input>
                </span>
              </el-col>
              <el-col :span="5">
                <el-button
                  plain
                  size="mini"
                  style="margin-left:8px"
                  @click="teacherVhangeCodeClick"
                >复制
                </el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="学员" name="second">
          <el-form
            ref="studentShareForm"
            :model="studentShareForm"
            label-width="80px"
          >
            <el-row :gutter="20">
              <el-col :span="6"
              ><span style="line-height: 27px">学员参加码</span></el-col
              >
              <el-col :span="13"
              ><span
                style="margin-top:15px;line-height: 27px;margin-left:8px;"
              >
                  <el-input
                    v-model="studentShareForm.shareCodestatus"
                    size="mini"
                    :disabled="true"
                  >
                  </el-input>
                </span>
              </el-col>
              <el-col :span="5">
                <el-button
                  plain
                  size="mini"
                  style="margin-left:8px"
                  @click="studentChangeCodeClick"
                >复制
                </el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--    回放dialog-->
    <el-dialog
      :visible.sync="playbackDialogVisible"
      width="400px"
      center
      destroy-on-close
    >
      <div
        slot="title"
        style="border-bottom: 1px solid #888889;padding-bottom: 20px"
      >
        直播回放
      </div>
      <div style="margin-top: -20px">
        <el-table
          :data="playbackData"
          border
          style="width: 100%"
          :header-row-style="{ color: '#409EFF' }"
        >
          <el-table-column
            prop="name"
            label="课程名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            label="回放状态"
            width="110"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">未录制</span>
              <span
                v-if="scope.row.status == '10' || scope.row.status == '20'"
                style="color:#E6A23C"
              >转码中</span
              >
              <span v-if="scope.row.status == '30'" style="color:red"
              >生成失败</span
              >
              <span v-if="scope.row.status == '100'" style="color:green"
              >转码成功</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="50">
            <template slot-scope="scope">
              <el-link
                :underline="false"
                @click="handleClickPlayback(scope.$index, scope.row)"
                :disabled="scope.row.status != '100'"
              >播放
              </el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PubSub from "pubsub-js";
import promptUtil from "../../../utils/promptUtil";
import stringUtil from "../../../utils/stringUtil";
import pagination from "../../commons/pagination/pagination";
import vuexUtils from "../../../utils/vuexUtils";
import "../../../api/restfulapi";
import "../../../router/router";
import vueQr from "vue-qr";
import childHeader from "../../component/childHeader";
import {
  qs,
  uploadAvatarUrl,
  getClassAndStudentByTeacher,
  getTeacherList,
  addLiveClass,
  getLiveList,
  editLiveClass,
  delTableListLiveInformation
} from "../../../api/api";
import storageUtil from "../../../utils/storageUtil";

export default {
  components: {
    "als-child-header": childHeader,
    "als-pagination": pagination,
    vueQr
  },
  data() {
    return {
      dabankeImg: require('../../../../static/images/base/online/dabanke_bg.png'),
      xiaobankeImg: require('../../../../static/images/base/online/xiaobanke_bg.png'),
      isDataLoading: true, // 是否第一次加载 显示加载中
      qrCodeMobileImg: require("../../../../static/images/base/moblie.png"),
      isLimit: "number",
      postUrl: uploadAvatarUrl, // 提交封面的url
      routerConfig: [
        { name: vuexUtils.checkMenuExist(this, "online").target.name, to: "" }
      ],
      dialogType: 1, // 1 直播dialog   2 编辑dialog
      search: {
        liveState: "",
        liveStateArray: [
          {
            value: 1,
            label: "直播中"
          },
          {
            value: 0,
            label: "未开始"
          },
          {
            value: 2,
            label: "已结束"
          }
        ],
        liveType: "",
        liveTypeArray: [
          {
            value: 0,
            label: "全部"
          },
          {
            value: 1,
            label: "小班课"
          },
          {
            value: 2,
            label: "大班课"
          }
        ],
        startTimeSearch: [],
        playbackState: "",
        name: ""
      },
      tableData: [],
      multipleSelection: [], //列表中选中的直播
      sendDeleteArrayId: [], //传给后台的要删除的arrayId数组
      deleteMultipleDialogVisible: false, //多选显示删除dialog
      delDialogVisible: false, //列表中显示删除dialog
      isLoadingDisableWithDel: false, // 删除dialog确认对话框中确认按钮加载状态
      dialogdelContent: "", // 直播列表对话框中显示要删除的内容
      sendDelTableListArrayId: [], //传给后台表格中的删除ID
      saveDelTableListArrayIndex: "",
      saveDelTableListArrayId: "", //表格中删除row.id
      delDialogVisibleContent: "", //列表中删除提示信息
      addClassDialogVisible: false,
      shareDialogVisible: false, //分享dialog
      activeName: "first",
      defaultCoverUrl:
        "https://www.alsrobot.vip/als_classroom/public/static/live_cover.png", // 默认封面图地址
      addRuleForm: {
        //创建课程表单
        classType: "1", //小班课1  大班课2
        name: "",
        num: "",
        startTime: "",
        longTime: "",
        speakTeacher: "",
        selectTeacher: "",
        teacherArray: [],
        classes: [],
        type: "1",
        limit: false,
        coverUrl: "" //封面图
      },
      rules: {
        classType: [{ required: true }],
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" }
        ],
        longTime: [
          { required: true, message: "请选择课程时长", trigger: "blur" }
        ],
        speakTeacher: [
          { required: true, message: "请选择主讲人", trigger: "blur" }
        ],
        selectTeacher: [
          { required: true, message: "请选择主讲人", trigger: "blur" }
        ],
        classes: [
          {
            type: "array",
            required: true,
            message: "请选择学生",
            trigger: "change"
          }
        ]
      },
      classesInfo: [], // 获取教室的班级列表
      props: { multiple: true },
      role: "",
      limitDisable: false,
      limitCheckBoxDisable: true,
      sendLimit: null, //是否选择上限 true传0
      enterClassDialogVisible: false, //进入教室dialog
      innerVisible: false, //打卡下载对话框
      webUrl: "",
      clientUrl: "",
      sign: "", //创建直播1，编辑直播2
      rowId: "",
      //分享dialog教师
      teacherShareForm: {
        userEnter: "", //客户端进入网址  分享dialog
        webEnter: "", //网页进入
        appEnter: "", //app进入
        qrDataUrl: "", //网页进入二维码
        appQrDataUrl: "", //app进入二维码
        shareCodestatus: "" //教师参加码
      },
      //分享dialog学员
      studentShareForm: {
        userEnter: "", //客户端进入网址  分享dialog
        webEnter: "", //网页进入
        appEnter: "", //app进入
        qrDataUrl: "", //网页进入二维码
        appQrDataUrl: "", //app进入二维码
        shareCodestatus: "" //学生参加码
      },
      playbackDialogVisible: false, //回放
      playbackData: [],
      backDialogPlay: "", //伙房dialog中的播放按钮
      getBackUrlDialog: false,
      addEditLiveTitle: "",
      currentPage: 1,
      searchLoading: false,
      addLiveLoading: false,
      editLiveLoading: false,
      editBigSmallClass: false, //编辑课程时为true
      changeStudent: [], //选择的学生
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      bofangTypeTime:'',
    };
  },
  mounted() {
    this.isDataLoading = true
    promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
    this.role = storageUtil.readTeacherInfo().school_admin; // 1 校长
    PubSub.publish("currentMenuIndex", "/online");
    //创建课程中获取班级以及学生呢个指派班级
    getClassAndStudentByTeacher(
      qs.stringify({ teacher_id: storageUtil.readTeacherInfo().id })
    )
      .then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != "[]") {
            this.classesInfo = res.data;
          }
        }
      })
      .catch(err => {
        promptUtil.LOG("teachOwnClass-err", err);
      });
    //获取直播列表
    this.getClassTableList();
  },
  methods: {
      handleClickIntoLiveDetail(){
          this.$router.push({path: ROUTER_STATISTICS_LIVE})
      },
      handleClickIntoLiveBuy(){
          this.$router.push({path: ROUTER_LIVE_POINT})
      },
      handleClickCreateLiveCourse(){
         this.addLiveClass('addRuleForm', '1')
      },
      changeDateTimeForm(val){
          if(val!=null){
                if(this.sign==1||this.bofangTypeTime==0){
            let d = new Date().getTime()
            if(val.getTime()<d){
              promptUtil.warning(this, "请选择大于当前的时间");
              this.addRuleForm.startTime=""
              return
           }
          }
          }
      },
    handleChangeCascader(values) {
      this.changeStudent = values;
      let maxNum =
        this.addRuleForm.num && this.addRuleForm.num != ""
          ? this.addRuleForm.num * 1
          : 0;
      if (this.addRuleForm.classType == 1) {
        // 小班课
        if (maxNum < values.length) {
          promptUtil.warning(this, "请调整上课学生人数");
          this.addRuleForm.classes = [];
          return;
        }
      } else {
        // 大班课
        if (!this.limitDisable) {
          // 未选择不设上限
          if (maxNum < values.length) {
            promptUtil.warning(this, "请调整上课学生人数");
            this.addRuleForm.classes = [];
            return;
          }
        }
      }
    },
    handleChangeClassType(type) {
      if (type == 2) {
        this.addRuleForm.num = "";
      } else {
        this.addRuleForm.num = "";
      }
      if (
        type == 1 &&
        this.changeStudent.length != 0 &&
        this.addRuleForm.num == ""
      ) {
        this.changeStudent = [];
        this.addRuleForm.classes = [];
      }
      this.limitCheckBoxDisable = type != 2;
      this.limitDisable = type == 2;
      this.addRuleForm.limit = type == 2;
    },
    handleCoverSuccess(res, file) {
      this.addRuleForm.coverUrl = res;
    },
    beforeCoverUpload(file) {
      const isJPG = file.type === "image/png" || file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传封面图片只能是 jpg/png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    searchName() {

      this.getClassTableList();
    },
    searchChangeTime(event) {
      this.getClassTableList();
    },
    // 不设上限
    limitChange(val) {
      this.sendLimit = val;
      this.addRuleForm.classes = [];
      if (val == true) {
        this.addRuleForm.num = "";
        this.limitDisable = true;
        this.isLimit = "number";
      } else {
        this.isLimit = "number1";
        this.limitDisable = false;
      }
    },
    // 选择直播状态
    liveStateChange(val) {
      this.getClassTableList();
    },
    // 选择直播状态
    liveTypeChange(val) {
      this.getClassTableList();
    },
    // 创建课程
    addLiveClass(formName, val) {
      this.sign = val;
      this.dialogType = 1;
      this.editBigSmallClass = false;
      this.addEditLiveTitle = "创建直播课";
      this.limitDisable = false;
      this.addClassDialogVisible = true;
      this.addRuleForm.classes = [];
      this.resetAddRuleForm();
      this.addRuleForm.longTime = "2020-02-07 01:00:00";
      if (this.role != 1) {
        this.addRuleForm.speakTeacher = storageUtil.readTeacherInfo().real_name;
      }
      this.getAllTeacher();
    },
    getAllTeacher() {
      //获取所有教师
      getTeacherList(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != "[]") {
              this.addRuleForm.teacherArray = [];
              res.data.forEach(item => {
                const classObj = { value: item.id, label: item.nick };
                this.addRuleForm.teacherArray.push(classObj);
              });
            }
            this.currentTeacher = 0;
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(err => {
          promptUtil.LOG("getTeacherList-err", err);
        });
    },
    deleValidate() {
      this.$nextTick(() => {
        try {
          // this.$refs.adduserform.resetFields();
          this.$refs["addRuleForm"].resetFields();
        } catch (e) {}
        try {
          this.$refs["addRuleForm"].clearValidate();
        } catch (e) {}
      });
    },
    //dialog中的添加课程按钮
    dialogAddClass(formName) {
     let _this = this;
      if (this.addRuleForm.num == "" && this.addRuleForm.limit == false) {
        promptUtil.warning(this, "请选择或填写教室最大容量");
        return;
      }
      if (this.addRuleForm.limit == false) {
        if (this.addRuleForm.classType == 2) {
          // 大班课
          if (!/(^[1-9]*$)/.test(this.addRuleForm.num)) {
            promptUtil.warning(this, "请输入正整数");
            return;
          }
        } else {
          // 小班课
          if (
            !/(^[1-9]*$)/.test(this.addRuleForm.num) ||
            this.addRuleForm.num > 9 ||
            this.addRuleForm.num < 1
          ) {
            this.addRuleForm.classes = []
            promptUtil.warning(this, "请输入1-9正整数");
            return;
          }
        }
      }
      this.addLiveLoading = true;
      const moment = require("moment");
      var hour = moment(this.addRuleForm.longTime)
        .format("HH:mm")
        .split(":")[0];
      var min = moment(this.addRuleForm.longTime)
        .format("HH:mm")
        .split(":")[1];
      let longTime = Number(hour * 3600) + Number(min * 60);
      const idsObj = this.getClassAndStudentIDS(this.addRuleForm.classes);
      this.$refs[formName].validate(valid => {
        if (valid) {
          const videoCover =
            this.addRuleForm.coverUrl && this.addRuleForm.coverUrl != ""
              ? this.addRuleForm.coverUrl
              : this.defaultCoverUrl;
          addLiveClass(
            qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id:
                this.addRuleForm.speakTeacher == "" ||
                this.addRuleForm.speakTeacher == undefined
                  ? this.addRuleForm.selectTeacher
                  : storageUtil.readTeacherInfo().id, //主讲教师
              create_id: storageUtil.readTeacherInfo().id,
              title: this.addRuleForm.name,
              starttime:this.addRuleForm.startTime!=null? parseInt(this.addRuleForm.startTime.getTime() / 1000):"",
              endtime:this.addRuleForm.startTime!=null? parseInt(this.addRuleForm.startTime.getTime() / 1000) +longTime:"",
              max_users: this.sendLimit == true ? 0 : this.addRuleForm.num,
              //class_id:idsObj.classes,
              student_ids: idsObj.students,
              is_video_main: this.addRuleForm.type,
              img: videoCover,
              class_type: this.addRuleForm.classType
            })
          )
            .then(res => {
              if (res.code == SUCCESS_CODE) {
                this.addLiveLoading = false;
                 promptUtil.success(this, res.msg);
                if (res.data && res.data != "[]") {
                  this.addClassDialogVisible = false;
                  this.$refs[formName].resetFields();
                  this.resetAddRuleForm();
                  this.getClassTableList();
                  _this.sign = 2;
                }
              } else if (res.code == ERROR_CODE) {
                this.addLiveLoading = false;
                promptUtil.warning(this, res.msg);
                _this.sign = 1;
              }
            })
            .catch(err => {
              _this.sign = 1;
              promptUtil.LOG("addLiveClass-err", err);
            });
        } else {
         this.addLiveLoading = false;
          console.log("error submit!!");
            _this.sign = 1;
          return false;
        }
      });
    },
    //管理dialog中的编辑按钮课程按钮
    editDialogAddClass(formName) {
      if (this.addRuleForm.num == "" && this.addRuleForm.limit == false) {
        promptUtil.warning(this, "请选择或填写教室最大容量");
        return;
      }
      if (this.addRuleForm.limit == false) {
        if (this.addRuleForm.classType == 2) {
          // 大班课
          if (!/(^[1-9]\d*$)/.test(this.addRuleForm.num)) {
            promptUtil.warning(this, "请输入正整数");
            return;
          }
        } else {
          // 小班课
          if (
            !/(^[1-9]\d*$)/.test(this.addRuleForm.num) ||
            this.addRuleForm.num > 9 ||
            this.addRuleForm.num < 1
          ) {
            this.addRuleForm.classes = []
            promptUtil.warning(this, "请输入1-9正整数");
            return;
          }
        }
      }

      this.editLiveLoading = true;
      //longTime毫秒
      const moment = require("moment");
      var hour = moment(this.addRuleForm.longTime)
        .format("HH:mm")
        .split(":")[0];
      var min = moment(this.addRuleForm.longTime)
        .format("HH:mm")
        .split(":")[1];
      let longTime = Number(hour * 3600) + Number(min * 60);
      //startTime毫秒
      if(this.addRuleForm.startTime!=null){
        var changeStartTime = Date.parse(new Date(this.addRuleForm.startTime + "")) / 1000; // 参数为String 毫秒
      }
      const idsObj = this.getClassAndStudentIDS(this.addRuleForm.classes);
      this.$refs[formName].validate(valid => {
        if (valid) {
          editLiveClass(
            qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
              teacher_id:
                this.addRuleForm.speakTeacher == "" ||
                this.addRuleForm.speakTeacher == undefined
                  ? this.addRuleForm.selectTeacher
                  : storageUtil.readTeacherInfo().id, //主讲教师
              course_id: this.rowId,
              create_id: storageUtil.readTeacherInfo().id,
              title: this.addRuleForm.name,
              starttime: changeStartTime,
              endtime: changeStartTime + longTime,
              max_users: this.sendLimit == true ? 0 : this.addRuleForm.num,
              student_ids: idsObj.students,
              is_video_main: this.addRuleForm.type,
              img: this.addRuleForm.coverUrl,
              class_type: this.addRuleForm.classType
            })
          )
            .then(res => {
              if (res.code == SUCCESS_CODE) {
                this.editLiveLoading = false;
                if (res.data && res.data != "[]") {
                  this.addClassDialogVisible = false;
                  this.$refs[formName].resetFields();
                  this.resetAddRuleForm();
                  try {
                    this.$refs[formName].clearValidate();
                  } catch (e) {}
                  this.getClassTableList();
                }
              } else if (res.code == ERROR_CODE) {
                this.editLiveLoading = false;
                promptUtil.warning(this, res.msg);
              }
            })
            .catch(err => {
              promptUtil.LOG("editLiveClass-err", err);
            });
        } else {
          console.log("error submit!!");
          this.editLiveLoading = false;
          return false;
        }
      });
    },
    // 重置表单信息
    resetAddRuleForm(classType="1") {
      this.addRuleForm = {
        //创建课程表单
        classType: classType,
        name: "",
        num: "",
        startTime: "",
        longTime: "",
        selectTeacher: "",
        teacherArray: [],
        classes: [],
        type: "1",
        limit: false,
        coverUrl: ""
      };
      this.addLiveLoading = false;
      this.editLiveLoading = false;
    },
    // 获取选择的班级id和学生id
    getClassAndStudentIDS(data) {
      const tmpIdsArr = [];
      const stuIdsArr = []; // 学生id数组
      data.map(item => {
        tmpIdsArr.push(item[0]);
        stuIdsArr.push(item[1]);
      });
      const classIdsArr = Array.from(new Set(tmpIdsArr)); // 班级id数组
      const obj = {
        classes: stringUtil.array2String(classIdsArr, ","),
        students: stringUtil.array2String(stuIdsArr, ",")
      };
      return obj;
    },

    // 选择教师时触发,返回对应的数据
    selectTeacherChange(val) {},
    //切换分页
    changeTableData(val) {
      this.tableData = val;
    },
    handleOpen() {
      if (this.dialogType == 1) {
        // 创建直播
        try {
          this.$refs["addRuleForm"].resetFields();
        } catch (e) {}
        try {
          this.$refs["addRuleForm"].clearValidate();
        } catch (e) {}
      }
    },
    handleClose(done) {
      done();
      try {
        this.$refs["addRuleForm"].resetFields();
      } catch (e) {}
      try {
        this.$refs["addRuleForm"].clearValidate();
      } catch (e) {}
      this.sign = "2";
    },
    changeOnlinePage(data) {
      this.currentpage = data;
    },
    //获取直播列表
    getClassTableList() {
      const moment = require("moment");
      getLiveList(
        qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          user_id: storageUtil.readTeacherInfo().id,
          starttime:
           this.search.startTimeSearch==null|| this.search.startTimeSearch.length == 0
              ? ""
              : moment(this.search.startTimeSearch[0]).format(
                  "YYYY-MM-DD HH:mm"
                ),
          endtime:
            this.search.startTimeSearch==null||this.search.startTimeSearch.length == 0
              ? ""
              : moment(this.search.startTimeSearch[1]).format(
                  "YYYY-MM-DD HH:mm"
                ),
          title: this.search.name.trim(),
          type: this.search.liveState,
          class_type: this.search.liveType //课程类型
        })
      )
        .then(res => {
         this.isDataLoading = false
         if (res.code == SUCCESS_CODE) {
             this.currentPage = 1;
             this.tableData = [];
             if (res.data && res.data != "[]") {
                res.data.forEach(res => {
                  const obj = {
                    id: res.id,
                    cover: res.cover,
                    createDate: res.create_date,
                    createName: res.create_name,
                    status: res.bofang_msg,
                    name: res.title,
                    backStatus: res.back_msg, //转码成功 转码中
                    backType: res.back_status, //只有100的时候可以看回放
                    teacher: res.teacher_name,
                    startTime: res.starttime,
                    bofangType: res.bofang_type, //!0时可以管理 未开播
                    endTime: res.endtime,
                    longTime: res.long_str,
                    webUrl: res.web_url,
                    clientUrl: res.client_url,
                    maxUser: res.max_users,
                    type: res.is_video_main,
                    teacherId: res.teacher_id,
                    studentIdArray: res.student_ids,
                    studentCode: res.student_code,
                    teacherCode: res.teacher_code,
                    backArray: res.back,
                    classType: res.class_type,
                    liveCount: res.liveCount,
                    // classTypeString: res.class_type == 1 ? "小班课" : "大班课"
                  };
                  this.tableData.push(obj);
                });
              }else{
                 this.currentPage = 1
             }
             this.$refs.alsPageination.setCurrentPage(this.currentPage);
             this.$refs.alsPageination.setServerData(this.tableData);
          } else if (res.code == ERROR_CODE) {
            promptUtil.warning(this, res.msg);
          }
        })
        .catch(err => {
            this.tableData = []
            this.currentPage = 1
            this.$refs.alsPageination.setCurrentPage(this.currentPage);
            this.$refs.alsPageination.setServerData(this.tableData);
            promptUtil.LOG("getLiveList-err", err);
        });
    },
    //多选删除
    multiDelLive() {
      if (this.multipleSelection.length == 0) {
        promptUtil.warning(this, "请选择要删除直播");
      } else {
        this.deleteMultipleDialogVisible = true;
        this.dialogdelContent = "确定要删除此直播么";
      }
    },
    //勾选删除项
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除对话框中的确定按钮
    handleDelteTableList() {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.sendDeleteArrayId.push(this.multipleSelection[i].id);
      }
      delTableListLiveInformation(
        qs.stringify({
          course_id: this.sendDeleteArrayId,
          user_id: storageUtil.readTeacherInfo().id
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, "删除成功");
            for (var i = 0; i < this.multipleSelection.length; i++) {
              const index = this.tableData.findIndex(
                item => item.id == this.multipleSelection[i].id
              );
              this.tableData.splice(index, 1);
            }
            this.$refs.alsPageination.setServerData(this.tableData);
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(error => {
          promptUtil.LOG("delTableListLiveInformation-err", error);
        });
      this.deleteMultipleDialogVisible = false;
    },
    //进教室
    enterClass(index, row) {
      window.open(row.clientUrl, "_blank");
      this.webUrl = row.webUrl;
      this.enterClassDialogVisible = true;
    },
    cancelDialog(formName) {

      this.addClassDialogVisible = false;
      // this.$refs[formName].resetFields();
      try {
        this.$refs[formName].resetFields();
        this.$refs[formName].clearValidate();
      } catch (e) {}
    },
    // 进入教室dialog中下载客户端
    downloadUser(type) {
      if (type == 1) {
        // mac
        window.open(
          "https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/live/clientmac.dmg",
          "_blank"
        );
      } else if (type == 2) {
        // windows
        window.open(
          "https://alseduline.oss-cn-shenzhen.aliyuncs.com/uploads/live/clientinstaller.zip",
          "_blank"
        );
      }
    },
    //进入教室dialog网页下载
    dialogEnterClass() {
      window.open(this.webUrl, "_blank");
    },

    // 管理    // 编辑直播
    manage(index, row) {
      this.dialogType = 2;
      this.editBigSmallClass = true;
      this.addEditLiveTitle = "编辑直播课";
      this.getAllTeacher();
      this.rowId = row.id;
      this.addClassDialogVisible = true;
      //调用回显接口
      this.addRuleForm.name = row.name;
      this.addRuleForm.num = row.maxUser == 0 ? "不设上限" : row.maxUser;
      this.addRuleForm.limit = row.maxUser == 0 ? true : false;
      this.addRuleForm.limit == true
        ? (this.limitDisable = true)
        : (this.limitDisable = false);
      this.addRuleForm.startTime = row.startTime;
      this.addRuleForm.longTime = "2020-02-07 " + row.longTime;
      this.addRuleForm.speakTeacher = row.teacher;
      this.addRuleForm.selectTeacher = row.teacher; //需要id
      this.addRuleForm.type = row.type + "";
      this.addRuleForm.classes = row.studentIdArray;
      this.addRuleForm.classType = row.classType + "";
      this.bofangTypeTime=row.bofangType
    //   找状态
      if (this.addRuleForm.classType == 2) {
        this.limitCheckBoxDisable = false;
        this.addRuleForm.num=""
      } else {
        this.limitCheckBoxDisable = true;
      }
    },
    // 分享
    share(index, row) {
      this.shareDialogVisible = true;
      this.studentShareForm.shareCodestatus = row.studentCode;
      this.teacherShareForm.shareCodestatus = row.teacherCode;
    },
    //分享dialog更新状态码
    teacherVhangeCodeClick() {
      this.copy(this.teacherShareForm.shareCodestatus);
    },
    //分享dialog客户端进入
    teacherUserCopyClick() {
      this.copy(this.teacherShareForm.userEnter);
    },
    //分享dialog中网页端进入
    teacherWebCopyClick() {
      this.copy(this.teacherShareForm.webEnter);
    },
    //分享dialog中app进入
    teacherAppCopyClick() {
      this.copy(this.teacherShareForm.appEnter);
    },
    shareHandleClick(tab, event) {
      // console.log(tab, event);
    },
    //学生分享
    //分享dialog更新状态码
    studentChangeCodeClick() {
      this.copy(this.studentShareForm.shareCodestatus);
    },
    //分享dialog客户端进入
    studentUserCopyClick() {
      this.copy(this.studentShareForm.userEnter);
    },
    //分享dialog中网页端进入
    studentWebCopyClick() {
      this.copy(this.studentShareForm.webEnter);
    },
    //分享dialog中app进入
    studentAppCopyClick() {
      this.copy(this.studentShareForm.appEnter);
    },
    shareHandleClick(tab, event) {
      console.log(tab, event);
    },
    copy(data) {
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      promptUtil.success(this, "复制成功");
      oInput.remove();
    },
    // 回放
    playBack(index, row) {
      this.playbackData = [];
      this.playbackDialogVisible = true;
      if (row.backArray.length != 0) {
        row.backArray.forEach(res => {
          const obj = {
            id: row.id,
            name: row.name,
            status: row.backType,
            webUrl: row.webUrl,
            clientUrl: row.clientUrl,
            backUrl: res.url
          };
          this.playbackData.push(obj);
        });
      }
    },
    // 回放dialog中的播放按钮
    handleClickPlayback(index, row) {
      window.open(row.backUrl, "_blank");
    },
    // 回放dialog获取连接
    getSeeBackUrl() {
      this, (getBackUrlDialog = true);
    },
    // 回放dialog删除
    delBackLive() {},

    // 删除
    delRow(obj) {
      // delDialogVisibleContent
      // delDialogVisible
      this.saveDelTableListArrayId = obj.row.id;
      this.saveDelTableListArrayIndex = obj.index;
      this.delDialogVisible = true;
      this.delDialogVisibleContent = "确定要删除此课程么";
    },
    //单个删除的确定按钮
    handleRemoveTableList() {
      this.sendDelTableListArrayId.push(this.saveDelTableListArrayId);
      delTableListLiveInformation(
        qs.stringify({
          course_id: this.sendDelTableListArrayId,
          user_id: storageUtil.readTeacherInfo().id
        })
      )
        .then(res => {
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, "删除成功");
            this.tableData.splice(this.saveDelTableListArrayIndex, 1);
            this.$refs.alsPageination.setServerData(this.tableData);
            this.getClassTableList();
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
        .catch(error => {
          promptUtil.LOG("delTableListLiveInformation-err", error);
        });
      this.delDialogVisible = false;
    }
  }
};
</script>

<style scoped>
  .course-title-base{
    height: 15px;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    font-size: 16px;
    font-family: PingFangSC-Medium,PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 15px;
  }
  .course-kind-base{
    margin-top: 9px;
    font-size: 11px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 22px;
  }
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

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 251px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
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
.avatar-uploader {
  width: 110px;
  height: 110px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
}
.avatar {
  width: 110px;
  height: 110px;
  display: block;
}
.image-wrapper {
  position: relative;
  cursor: pointer;
  margin-right: 20px;
}
.image {
  width: 105px;
  height: 84px;
  border-radius: 5px;
  object-fit: cover;
  transition: all 0.2s ease-out 0.1s;
}
.image:hover {
  transform: scale(1.05);
}
</style>
