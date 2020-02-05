<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><span style="font-weight: bold;font-size:18px;">基本情况</span></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card" shadow="always">
          <el-row :gutter="40">
            <el-col :span="8">
              <div class="reportBaseInfo">
                <div><el-avatar :src="teacher.avatar" style="width: 80px;height:80px;"></el-avatar></div>
                <div style="font-size: 20px;">{{$store.state.userName}}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="reportBaseInfo">
                <div><i class="iconfont icon-banjixinxi reportBaseInfoIcon baseInfoWrapper"></i></div>
                <div class="reportBaseInfoLabel baseInfoWrapper">班级个数</div>
                <el-link :underline="false" @click="intoClassRoom">
                  <div class="reportBaseInfoVal baseInfoWrapper">{{baseInfo.classCount}}</div>
                </el-link>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="reportBaseInfo">
                <div><i class="iconfont icon-zongrenshu reportBaseInfoIcon baseInfoWrapper"></i></div>
                <div class="reportBaseInfoLabel baseInfoWrapper">学生人数</div>
                <el-link :underline="false" @click="intoStudentRoom">
                  <div class="reportBaseInfoVal baseInfoWrapper">{{baseInfo.studentCount}}</div>
                </el-link>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="always">
          <el-row>
            <el-col :space="22" :offset="1">
              <div style="height: 140px;">
                <div>
                  <div style="display: flex;">
                    <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
                    <div style="line-height:20px;margin-left:5px;">已开通课程包</div>
                  </div>
                  <div v-show="!isShowCoursePackage"
                       style="height: 115px;width: 100%;font-size: 16px;color: #898988;display: flex;justify-content: center;align-items: center;">
                    暂未开通课程包
                  </div>
                  <div v-show="isShowCoursePackage"
                       style="margin-left:20px;margin-top: 10px;margin-right:20px;height: 115px;overflow-y:auto;">
                    <div v-for="(name, index) in coursesName" :key="index">
                      <div style="height: 30px;display: flex;align-items: center;">
                        <div class="classTitleCircle"></div>
                        <el-tooltip class="item" effect="dark" :content="name" placement="top-start">
                          <div>{{name}}</div>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <div v-show="isShowPerformanceCard">
      <el-card class="box-card" shadow="always">
        <div style="display: flex;align-items: center;">
          <div class="classTitleCircle"></div>
          <div>课堂表现</div>
        </div>
        <div style="display: flex;justify-content: center;align-items: center;">
          <div id="performance" :style="{height:'430px',width:performanceWidth+'px',marginTop:'10px'}"></div>
        </div>
      </el-card>
    </div>
    <el-card class="box-card" shadow="always" v-show="!isShowPerformanceCard">
      <div style="display: flex;align-items: center;">
        <div class="classTitleCircle"></div>
        <div>课堂表现</div>
      </div>
      <div
        style="height: 30px;width: 100%;font-size: 16px;color: #898988;display: flex;justify-content: center;align-items: center;">
        暂无数据
      </div>
    </el-card>
    <el-card class="box-card" shadow="always" style="margin-top: 20px;">
      <div style="display: flex;align-items: center;">
        <div class="classTitleCircle"></div>
        <div>课堂表现分平均分排名</div>
      </div>
      <el-table
        :data="studentAverageData"
        border
        style="width: 100%;margin-top: 20px;"
        :header-row-style="{'color':'#409EFF'}"
      >
        <el-table-column align="center" prop="rank" label="排名" width="100px;">
          <template slot-scope="scope">
            <div style="display: flex;justify-content:center;align-items: center;">
              <div v-if="scope.row.rank==1" class="rankCircle rankCircle_1">{{scope.row.rank}}</div>
              <div v-if="scope.row.rank==2" class="rankCircle rankCircle_2">{{scope.row.rank}}</div>
              <div v-if="scope.row.rank==3" class="rankCircle rankCircle_3">{{scope.row.rank}}</div>
              <div v-if="scope.row.rank>3" class="rankCircle rankCircle_4">{{scope.row.rank}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="class" label="班级"></el-table-column>
        <el-table-column align="center" prop="average" label="平均分"></el-table-column>
        <el-table-column align="center" prop="max" label="最高分"></el-table-column>
        <el-table-column align="center" prop="name" label="学生姓名"></el-table-column>
      </el-table>
      <el-row type="flex" justify="center" style="margin-top:20px;" v-show="stuAveragePageShow">
        <el-pagination
          background
          @current-change="stuAverageHandleCurrentChange"
          :current-page="stuAverageCurrentPage"
          :page-size="stuAveragePageSize"
          layout="total, prev, pager, next, jumper"
          :total="stuAverageList"
        ></el-pagination>
      </el-row>
    </el-card>
    <el-row style="margin-top:30px;margin-bottom: 30px;">
      <el-col :span="24"><span style="font-weight: bold;font-size:18px;">作品情况</span></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">本月作品</div>
          </div>
          <div id="monthWork" style="height:380px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="always">
          <div style="width: 100%;height: 410px;">
            <el-table :data="monthWorkData" border style="width: 100%;" :header-row-style="{'color':'#409EFF'}">
              <template v-for="(col, index) in monthWorkColumn" >
                <el-table-column align="center" :prop="col.prop+''" :label="col.label"></el-table-column>
              </template>
            </el-table>
          </div>
          <el-row type="flex" justify="center" style="margin-top: -32px;">
            <el-pagination
              background
              @current-change="monthWorkHandleCurrentChange"
              :current-page="monthWorkCurrentPage"
              :page-size="monthWorkPageSize"
              layout="total, prev, pager, next, jumper"
              :total="monthWorkList"
            ></el-pagination>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">累计作品</div>
          </div>
          <div id="allWork" style="height:380px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="always">
          <div style="width: 100%;height: 410px;">
            <el-table :data="allWorkData" border style="width: 100%;" :header-row-style="{'color':'#409EFF'}">
              <template v-for="(col, index) in allWorkColumn" >
                <el-table-column align="center" :prop="col.prop+''" :label="col.label"></el-table-column>
              </template>
            </el-table>
          </div>
          <el-row type="flex" justify="center" style="margin-top: -32px;">
            <el-pagination
              background
              @current-change="allWorkHandleCurrentChange"
              :current-page="allWorkCurrentPage"
              :page-size="allWorkPageSize"
              layout="total, prev, pager, next, jumper"
              :total="allWorkList"
            ></el-pagination>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="box-card" shadow="always" style="margin-top: 20px;">
      <div style="display: flex;">
        <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
        <div style="line-height:20px;margin-left:5px;"><span v-show="currentWorkStatistics">本月星级作品统计</span><span
          v-show="!currentWorkStatistics">累计星级作品统计</span></div>
        <div style="width:86%;display: flex;justify-content: flex-end;">
          <el-switch
            v-model="currentWorkStatistics"
            active-text="本月作品统计"
            inactive-text="累计作品统计">
          </el-switch>
        </div>
      </div>
      <div id="workRate" style="height:300px;width: 100%;margin-top:10px;"></div>
    </el-card>
    <el-card class="box-card" shadow="always" style="margin-top: 20px;">
      <el-table :data="classRateData" border style="width: 100%;" :header-row-style="{'color':'#409EFF'}">
        <el-table-column align="center" prop="class" label="班级"></el-table-column>
        <el-table-column align="center" prop="star1" label="1星"></el-table-column>
        <el-table-column align="center" prop="star2" label="2星"></el-table-column>
        <el-table-column align="center" prop="star3" label="3星"></el-table-column>
        <el-table-column align="center" prop="star4" label="4星"></el-table-column>
        <el-table-column align="center" prop="star5" label="5星"></el-table-column>
      </el-table>
      <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="classRatePageShow">
        <el-pagination
          background
          @current-change="classRateHandleCurrentChange"
          :current-page="classRateCurrentPage"
          :page-size="classRatePageSize"
          layout="total, prev, pager, next, jumper"
          :total="classRateList"
        ></el-pagination>
      </el-row>
    </el-card>
    <el-row style="margin-top:30px;margin-bottom: 30px;">
      <el-col :span="12"><span style="font-weight: bold;font-size:18px;">能力维度</span></el-col>
      <el-col :span="12">
        <div style="display: flex;justify-content: flex-end;">
          <el-select v-model="currentClassRoom" placeholder="请选择" @change="currentOwnClassRoom">
            <el-option
              v-for="item in ownClassRoom"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:-10px;">
      <el-col :span="12">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">逻辑思维</div>
          </div>
          <div
            style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;margin-left: 20px;">
            <div style="font-size: 14px;color: #898988;">平均成绩</div>
            <div style="margin-left: 10px;">
              <el-rate v-model="verageScore.logical.value" disabled show-text text-color="#ff9900"
                       :texts="verageScore.logical.label"></el-rate>
            </div>
          </div>
          <div id="logical" style="height:280px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">创新力</div>
          </div>
          <div
            style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;margin-left: 20px;">
            <div style="font-size: 14px;color: #898988;">平均成绩</div>
            <div style="margin-left: 10px;">
              <el-rate v-model="verageScore.innovate.value" disabled show-text text-color="#ff9900"
                       :texts="verageScore.innovate.label"></el-rate>
            </div>
          </div>
          <div id="innovate" style="height:280px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 20px;">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">创造力</div>
          </div>
          <div
            style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;margin-left: 20px;">
            <div style="font-size: 14px;color: #898988;">平均成绩</div>
            <div style="margin-left: 10px;">
              <el-rate v-model="verageScore.create.value" disabled show-text text-color="#ff9900"
                       :texts="verageScore.create.label"></el-rate>
            </div>
          </div>
          <div id="create" style="height:280px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 20px;">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">沟通力</div>
          </div>
          <div
            style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;margin-left: 20px;">
            <div style="font-size: 14px;color: #898988;">平均成绩</div>
            <div style="margin-left: 10px;">
              <el-rate v-model="verageScore.communicate.value" disabled show-text text-color="#ff9900"
                       :texts="verageScore.communicate.label"></el-rate>
            </div>
          </div>
          <div id="communicate" style="height:280px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 20px;">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">思考力</div>
          </div>
          <div
            style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;margin-left: 20px;">
            <div style="font-size: 14px;color: #898988;">平均成绩</div>
            <div style="margin-left: 10px;">
              <el-rate v-model="verageScore.reflection.value" disabled show-text text-color="#ff9900"
                       :texts="verageScore.reflection.label"></el-rate>
            </div>
          </div>
          <div id="reflection" style="height:280px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 20px;">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">专注力</div>
          </div>
          <div
            style="display: flex;justify-content: flex-start;align-items: center;margin-top: 10px;margin-left: 20px;">
            <div style="font-size: 14px;color: #898988;">平均成绩</div>
            <div style="margin-left: 10px;">
              <el-rate v-model="verageScore.absorbed.value" disabled show-text text-color="#ff9900"
                       :texts="verageScore.absorbed.label"></el-rate>
            </div>
          </div>
          <div id="absorbed" style="height:280px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card" shadow="always">
          <div style="display: flex;align-items: center;margin-top: -5px">
            <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
            <div style="line-height:20px;margin-left:5px;">学生能力雷达图</div>
            <div style="flex:1;display: flex;justify-content: flex-end;">
              <el-select v-model="currentClassRoom" placeholder="请选择" @change="currentOwnClassRoom">
                <el-option
                  v-for="item in ownClassRoom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div id="studentDimension" style="height:300px;width: 100%;margin-top:10px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><span style="font-weight: bold;font-size:18px;">学生详情</span></el-col>
    </el-row>
    <el-card class="box-card" shadow="always">
      <div style="display: flex;align-items: center;">
        <div style="height: 20px;width: 3px;background-color: #00a2ff;"></div>
        <div style="line-height:20px;margin-left:5px;">班级信息</div>
      </div>
      <div v-show="!isShowClassesInfo"
           style="height: 30px;width: 100%;font-size: 16px;color: #898988;display: flex;justify-content: center;align-items: center;">
        暂无数据
      </div>
      <el-tabs type="border-card" style="margin-top: 20px;" @tab-click="studentTabHandleClick"
               v-show="isShowClassesInfo">
        <el-tab-pane :label="item.class" v-for="item in classList" :key="item.id">
          <el-table :data="studentsData" border style="width: 100%;" :header-row-style="{'color':'#409EFF'}">
            <el-table-column align="center" type="index" :index="studentIndexMethod" label="序号"
                             width="60"></el-table-column>
            <el-table-column align="center" prop="account" label="账号"></el-table-column>
            <el-table-column align="center" prop="name" label="姓名"></el-table-column>
            <el-table-column align="center" prop="birth" label="出生日期"></el-table-column>
            <el-table-column align="center" prop="parent" label="家长电话"></el-table-column>
            <el-table-column align="center" label="班级">{{item.class}}</el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click.native="handleLearnReport({index: scope.$index, row:scope.row})"
                >学情报告
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" style="margin-top: 20px;" v-show="studentsPageShow">
          <el-pagination
            background
            @current-change="studentsHandleCurrentChange"
            :current-page="currentStudentPage"
            :page-size="studentPageSize"
            layout="total, prev, pager, next, jumper"
            :total="studentList"
          ></el-pagination>
        </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  const echarts = require("echarts");
  import storageUtil from "../../../utils/storageUtil";
  import promptUtil from '../../../utils/promptUtil';
  import stringUtil from '../../../utils/stringUtil';
  import '../../../router/router';
  import {
    qs,
    getReportAnalysis
  } from '../../../api/api'
  import childHeader from '../../component/childHeader'
  export default {
    components:{"als-child-header": childHeader},
    data() {
      return {
        routerConfig: [{name:'学情报告',to:''}],
        performanceWidth:'',
        lazyLoadTimeout: 100, // 延迟加载超时时间
        stuAveragePageSize: 5, // 学生平均分默认分页值
        stuAverageCurrentPage: 1, // 学生平均分当前页码
        stuAveragePageShow: false, // 学生平均分页是否显示
        classRatePageSize: 5, // 班级星级分默认分页值
        classRateCurrentPage: 1, // 班级星级当前页码
        classRatePageShow: false, // 班级星级分页是否显示
        monthWorkPageSize: 6, // 当月作品默认分页值
        monthWorkCurrentPage: 1, // 当月作品当前页码
        allWorkPageSize: 6, // 累计作品默认分页值
        allWorkCurrentPage: 1, // 累计作品当前页码
        currentWorkStatistics: false, // 按月统计 true/ 按年统计 false
        teacher: {
          avatar: "", // 教师头像
        },
        baseInfo: { // 基本信息
          studentCount: 0, // 学生总数
          classCount: 0, //班级总数
        },
        coursesName: [],// 课程包名称
        classPerformanceChart: null, // 课堂表现chart
        classPerformanceData: { // 课堂表现相关数据
          classesAxis: [], // 教师所拥有的班级
          classes: [], // 每个班级的学生平局评分,顺序与教师班级一致
          classesShadow: []
        },
        studentAverageFromServer: [], // 从服务器获取的学生评分列表
        studentAverageData: [], // 本地学生平分列表   rank: "", class: "", average: "", high: "", name: ""
        monthWorkChart: null,// 本月学生作品chart
        allWorkChart: null, // 累计学生作品chart
        workRateChart: null, // 作品星级分布chart
        worksRelevanceData: { // 作品相关信息
          monthWorksData: [],
          monthWorksSeries: [],
          allWorksData: [],
          allWorksSeries: []
        },
        monthWorkFromServer: [], // 从服务器获取的当月学生作品列表
        monthWorkColumn: [], // 当月学生作品表列信息
        monthWorkData: [], // 当月学生作品所用编辑器列表 class: '', scratch:0, arduino:0,python:0,coocoo:0
        allWorkFromServer: [], // 从服务器获取的当月学生作品列表
        allWorkColumn: [], // 当月学生作品表列信息
        allWorkData: [], // 当月学生作品所用编辑器列表 class: '', scratch:0, arduino:0,python:0,coocoo:0
        workRateData: {}, // 作品星级分布 month all
        classRateFromServer: [], // 从服务器获取的班级星级评分
        classRateData: [], // 班级星级评分
        ownClassRoom: [], // 教师拥有的班级
        currentClassRoom: 0, // 当前选择的班级  默认全部班级
        logicalChart: null, // 逻辑思维chart
        createChart: null, // 创造chart
        innovateChart: null, // 创新chart
        communicateChart: null, // 沟通chart
        reflectionChart: null, // 思考chart
        absorbedChart: null, // 专注chart
        studentDimensChart: null, // 学生维度chart
        verageScore: { // 六维评分
          logical: {value: 0, label: [], data: []},
          create: {value: 0, label: [], data: []},
          innovate: {value: 0, label: [], data: []},
          communicate: {value: 0, label: [], data: []},
          reflection: {value: 0, label: [], data: []},
          absorbed: {value: 0, label: [], data: []},
          student: [] // 学生六维
        },
        allVerageScoreFromServer: [],// 六维评分数组
        classList: [],// 班级列表及学生
        studentPageSize: 10, // 当月作品默认分页值
        currentStudentPage: 1, // 班级学生列表分页当前页码
        studentsPageShow: false, // 班级学生列表分页是否显示
        studentsFromServer: [], // 从服务器获取的当月学生作品列表
        studentsData: [], // 当月学生作品所用编辑器列表 class: '', scratch:0, arduino:0,python:0,coocoo:0
        isShowCoursePackage: false, // 是否显示课程包div
        isShowPerformanceCard: false, // 是否显示课堂表现div
        isShowClassesInfo: false,// 是否显示班级列表card
      };
    },
      created(){
          this.performanceWidth = (window.innerWidth ||
                  document.documentElement.clientWidth ||
                  document.body.clientWidth)-300
      },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", "/report");
      const loading = promptUtil.loading(this)
      this.teacher.avatar = storageUtil.readTeacherInfo().avatar;
      this.initChart()
      getReportAnalysis(qs.stringify({teacher_id: storageUtil.readTeacherInfo().id})).then(res => {
        if (res.code == SUCCESS_CODE) {
          this.analysisDataFromServer(res.data)
        }
        loading.close()
      }).catch(err => {
        promptUtil.LOG("getReportAnalysis-err",err)
      })
      loading.close()
    },
    methods: {
      // 初始化各种chart资源
      initChart() {
        this.classPerformanceChart = echarts.init(document.getElementById('performance'));
        this.workRateChart = echarts.init(document.getElementById('workRate'));
        this.monthWorkChart = echarts.init(document.getElementById('monthWork'));
        this.allWorkChart = echarts.init(document.getElementById('allWork'));
        this.logicalChart = echarts.init(document.getElementById('logical'));// 逻辑思维chart
        this.createChart = echarts.init(document.getElementById('create'));// 创造chart
        this.innovateChart = echarts.init(document.getElementById('innovate'));// 创新chart
        this.communicateChart = echarts.init(document.getElementById('communicate'));// 沟通chart
        this.reflectionChart = echarts.init(document.getElementById('reflection'));// 思考chart
        this.absorbedChart = echarts.init(document.getElementById('absorbed'));// 专注chart
        this.studentDimensChart = echarts.init(document.getElementById('studentDimension'));// 学生维度chart
      },
      // 从服务器解析数据
      analysisDataFromServer(data) {
        if (data.coursePackage && data.coursePackage != '' && data.coursePackage != '[]') {
          this.coursesName = data.coursePackage
          this.isShowCoursePackage = true
        }
        if (data.teacherInfo && data.teacherInfo != '' && data.teacherInfo != '[]') {
          this.baseInfo.studentCount = data.teacherInfo.student;
          this.baseInfo.classCount = data.teacherInfo.classes;
        }
        if (data.performance && data.performance != "" && data.performance != "[]") {
          this.classPerformanceData.classesAxis = data.performance.classes
          this.classPerformanceData.classes = data.performance.average
          this.classPerformanceData.classesShadow = data.performance.base
          this.isShowPerformanceCard = true
        }
        if (data.stuPerforman && data.stuPerforman != "" && data.stuPerforman != "[]") {
          this.studentAverageFromServer = data.stuPerforman
        }
        if (data.works) {
          if (data.works.all && data.works.all != '' && data.works.all != '[]') {
            if (data.works.all.ide && data.works.all.ide != '' && data.works.all.ide != '[]') {
              this.worksRelevanceData.allWorksData = data.works.all.ide
              this.worksRelevanceData.allWorksSeries = data.works.all.series
            }
            if (data.works.all.classes && data.works.all.classes != '' && data.works.all.classes != '[]') {
              this.allWorkColumn = data.works.all.classes.column
              this.allWorkFromServer = data.works.all.classes.data
            }
            if (data.works.all.rate && data.works.all.rate != '' && data.works.all.rate != '[]') {
              this.workRateData.all = data.works.all.rate
            }
          }
          if (data.works.month && data.works.month != '' && data.works.month != '[]') {
            if (data.works.month.ide && data.works.month.ide != '' && data.works.month.ide != '[]') {
              this.worksRelevanceData.monthWorksData = data.works.month.ide
              this.worksRelevanceData.monthWorksSeries = data.works.month.series
            }
            if (data.works.month.classes && data.works.month.classes != '' && data.works.month.classes != '[]') {
              this.monthWorkColumn = data.works.month.classes.column
              this.monthWorkFromServer = data.works.month.classes.data
            }
            if (data.works.month.rate && data.works.month.rate != '' && data.works.month.rate != '[]') {
              this.workRateData.month = data.works.month.rate
            }
          }
          if (data.works.classes && data.works.classes != '' && data.works.classes != '[]') {
            this.classRateFromServer = data.works.classes
          }
        }
        this.ownClassRoom = data.classes && data.classes.length > 0 ? data.classes : []
        this.analysisWorks(data.dimension)
        if (data.student && data.student != '' && data.student != '[]') {
          this.classList = data.student
          this.isShowClassesInfo = true
        }
        this.getStudentInfoWithClass(0)
        this.stuAverageHandleCurrentChange(1)
        this.monthWorkHandleCurrentChange(1)
        this.allWorkHandleCurrentChange(1)
        this.classRateHandleCurrentChange(1)
        this.genClassPerformanceChart()
        this.genWorkRateChart(this.currentWorkStatistics)
        this.genMonthWorkChart()
        this.genAllWorkChart()
        for (let i = 1; i <= 6; i++) {
          this.genLogicalChart(i)
        }
        this.genStudentDimensChart()
      },
      // 根据六维数据解析成需要的数据格式
      analysisWorks(works) {
        this.allVerageScoreFromServer = works
        this.getWorksById(0)
      },
      // 通过id获取指定班级的六维数据
      getWorksById(id) {
        const label = stringUtil.getEvaluateArray()
        this.verageScore.logical = {
          value: this.allVerageScoreFromServer[id].logical.average,
          label: label,
          data: this.allVerageScoreFromServer[id].logical.data
        }
        this.verageScore.absorbed = {
          value: this.allVerageScoreFromServer[id].absorbed.average,
          label: label,
          data: this.allVerageScoreFromServer[id].absorbed.data
        }
        this.verageScore.communicate = {
          value: this.allVerageScoreFromServer[id].communicate.average,
          label: label,
          data: this.allVerageScoreFromServer[id].communicate.data
        }
        this.verageScore.create = {
          value: this.allVerageScoreFromServer[id].create.average,
          label: label,
          data: this.allVerageScoreFromServer[id].create.data
        }
        this.verageScore.innovate = {
          value: this.allVerageScoreFromServer[id].innovate.average,
          label: label,
          data: this.allVerageScoreFromServer[id].innovate.data
        }
        this.verageScore.reflection = {
          value: this.allVerageScoreFromServer[id].reflection.average,
          label: label,
          data: this.allVerageScoreFromServer[id].reflection.data
        }
        this.verageScore.student = this.allVerageScoreFromServer[id].student
      },
      // 生成累计学生作品chart
      genAllWorkChart() {
        this.allWorkChart.showLoading();
        setTimeout(() => {
          this.allWorkChart.hideLoading();
          const option = {
            title: {
              text: '作品总数统计',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}份 ({d}%)"
            },
            color: ['#83bff6', '#d48265', '#c23531', '#188df0', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            legend: {
              orient: 'vertical',
              right: 10,
              top: 20,
              bottom: 20,
              data: this.worksRelevanceData.allWorksData
            },
            series: [
              {
                name: '作品总数',
                type: 'pie',
                radius: ['33%', '50%'],
                label: {
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '16',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                data: this.worksRelevanceData.allWorksSeries
              }
            ]
          }
          this.allWorkChart.setOption(option);
        }, this.lazyLoadTimeout)
      },
      // 生成当月学生作品chart
      genMonthWorkChart() {
        this.monthWorkChart.showLoading();
        setTimeout(() => {
          this.monthWorkChart.hideLoading();
          const option = {
            title: {
              text: '作品总数统计',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}份 ({d}%)"
            },
            color: ['#83bff6', '#d48265', '#c23531', '#188df0', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            legend: {
              orient: 'vertical',
              right: 10,
              top: 20,
              bottom: 20,
              data: this.worksRelevanceData.monthWorksData
            },
            series: [
              {
                name: '作品总数',
                type: 'pie',
                radius: ['33%', '50%'],
                label: {
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '16',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                data: this.worksRelevanceData.monthWorksSeries
              }
            ]
          }
          this.monthWorkChart.setOption(option);
        }, this.lazyLoadTimeout)
      },
      // 生成学生六维统计
      genStudentDimensChart() {
        this.studentDimensChart.showLoading()
        setTimeout(() => {
          this.studentDimensChart.hideLoading();
          const option = {
            radar: [
              {
                axisLine: {lineStyle: {color: 'rgba(255, 255, 255, 0.5)'}},
                splitLine: {lineStyle: {color: 'rgba(255, 255, 255, 0.5)'}}
              }, {
                indicator: [
                  {text: '逻辑思维', max: 5, color: 'rgba(0, 0, 0, 1)'},
                  {text: '专注力', max: 5, color: 'rgba(0, 0, 0, 1)'},
                  {text: '思考力', max: 5, color: 'rgba(0, 0, 0, 1)'},
                  {text: '沟通力', max: 5, color: 'rgba(0, 0, 0, 1)'},
                  {text: '创造力', max: 5, color: 'rgba(0, 0, 0, 1)'},
                  {text: '创新力', max: 5, color: 'rgba(0, 0, 0, 1)'}
                ], center: ['50%', '50%'], radius: 110
              }
            ],
            series: [{
              type: 'radar', radarIndex: 1,
              data: [
                {
                  value: this.verageScore.student,
                  areaStyle: {
                    normal: {
                      opacity: 0.9,
                      color: ["#02a2ff"]
                    }
                  }
                }
              ]
            }]
          }
          this.studentDimensChart.setOption(option);
        }, this.lazyLoadTimeout)
      },
      // 生成六维逻辑思维统计
      genLogicalChart(type) {
        var currentChart = null
        var dataArray = null
        switch (type) {
          case 1: // 逻辑
            dataArray = this.verageScore.logical.data
            currentChart = this.logicalChart
            break;
          case 2: // 创新
            dataArray = this.verageScore.innovate.data
            currentChart = this.innovateChart
            break;
          case 3: // 创造
            dataArray = this.verageScore.create.data
            currentChart = this.createChart
            break;
          case 4: // 沟通
            dataArray = this.verageScore.communicate.data
            currentChart = this.communicateChart
            break;
          case 5: // 思考
            dataArray = this.verageScore.reflection.data
            currentChart = this.reflectionChart
            break;
          case 6: // 专注
            dataArray = this.verageScore.absorbed.data
            currentChart = this.absorbedChart
            break;
        }
        const option = {
          color: ["#00a2ff"],
          xAxis: {
            type: 'category',
            data: ['1星', '2星', '3星', '4星', '5星']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: dataArray,
            type: 'line'
          }]
        }
        currentChart.showLoading()
        setTimeout(() => {
          currentChart.hideLoading();
          currentChart.setOption(option);
        }, this.lazyLoadTimeout)
      },
      // 生成星级评价统计
      genWorkRateChart(status) {
        const workData = status ? this.workRateData.month : this.workRateData.all;
        this.workRateChart.showLoading();
        setTimeout(() => {
          this.workRateChart.hideLoading();
          const option = {
            color: ['#00a2ff'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: ['1星', '2星', '3星', '4星', '5星'],
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '作品数量',
                type: 'bar',
                barWidth: '60%',
                data: workData
              }
            ]
          }
          this.workRateChart.setOption(option);
        }, this.lazyLoadTimeout)
      },
      // 生成课堂表现chart
      genClassPerformanceChart() {
        this.classPerformanceChart.showLoading();
        setTimeout(() => {
          this.classPerformanceChart.hideLoading();
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true
                }
              }
            },
            grid: {
              top: '12%',
              left: '5%',
              right: '5%',
              containLabel: true
            },
            xAxis: {
              data: this.classPerformanceData.classesAxis,
              axisLabel: {
                inside: true,
                textStyle: {
                  color: '#fff'
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              z: 10
            },
            yAxis: {
              name: '平均分',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#999'
                }
              }
            },
            dataZoom: [
              {
                type: 'inside'
              }
            ],
            series: [
              { // For shadow
                type: 'bar',
                itemStyle: {
                  normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: this.classPerformanceData.classesShadow,
                animation: false
              },
              {
                type: 'bar',
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: '#83bff6'},
                        {offset: 0.5, color: '#188df0'},
                        {offset: 1, color: '#188df0'}
                      ]
                    )
                  },
                  emphasis: {
                    color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: '#2378f7'},
                        {offset: 0.7, color: '#2378f7'},
                        {offset: 1, color: '#83bff6'}
                      ]
                    )
                  }
                },
                data:this.classPerformanceData.classes
              }
            ]
          };
          this.classPerformanceChart.setOption(option);
        }, this.lazyLoadTimeout)
      },
      // 进入班级管理
      intoClassRoom(){
        this.$router.push({path:ROUTER_CLASS_MAN})
      },
      // 进入学生管理
      intoStudentRoom(){
        this.$router.push({path:ROUTER_STUDENT_MAN})
      },
      // 当前选择的班级
      currentOwnClassRoom(val) {
        this.getWorksById(val)
        for (let i = 1; i <= 6; i++) {
          this.genLogicalChart(i)
        }
        this.genStudentDimensChart()
      },
      // 平均分当前页触发函数
      stuAverageHandleCurrentChange(val) {
        this.stuAverageCurrentPage = val;
        this.studentAverageData = this.studentAverageFromServer.slice(
          (this.stuAverageCurrentPage - 1) * this.stuAveragePageSize,
          this.stuAveragePageSize + (this.stuAverageCurrentPage - 1) * this.stuAveragePageSize
        );
      },
      // 当月作品当前页触发函数
      monthWorkHandleCurrentChange(val) {
        this.monthWorkCurrentPage = val;
        this.monthWorkData = this.monthWorkFromServer.slice(
          (this.monthWorkCurrentPage - 1) * this.monthWorkPageSize,
          this.monthWorkPageSize + (this.monthWorkCurrentPage - 1) * this.monthWorkPageSize
        );
      },
      // 累计作品当前页触发函数
      allWorkHandleCurrentChange(val) {
        this.allWorkCurrentPage = val;
        this.allWorkData = this.allWorkFromServer.slice(
          (this.allWorkCurrentPage - 1) * this.allWorkPageSize,
          this.allWorkPageSize + (this.allWorkCurrentPage - 1) * this.allWorkPageSize
        );
      },
      // 班级星级评价触发函数
      classRateHandleCurrentChange(val) {
        this.classRateCurrentPage = val;
        this.classRateData = this.classRateFromServer.slice(
          (this.classRateCurrentPage - 1) * this.classRatePageSize,
          this.classRatePageSize + (this.classRateCurrentPage - 1) * this.classRatePageSize
        );
      },
      // 班级学生列表分页出发函数
      studentsHandleCurrentChange(val) {
        this.currentStudentPage = val
        this.studentsData = this.studentsFromServer.slice(
          (this.currentStudentPage - 1) * this.studentPageSize,
          this.studentPageSize + (this.currentStudentPage - 1) * this.studentPageSize
        )
      },
      // 设置班级列表中学生的索引
      studentIndexMethod(index) {
        return index + 1 + (this.currentStudentPage - 1) * this.studentPageSize;
      },
      // 通过点选班级获取班级下的学生信息
      getStudentInfoWithClass(index) {
        this.studentsFromServer = []
        if (this.classList && this.classList.length > 0) {
          this.classList[index].students.forEach(item => {
            this.studentsFromServer.push(item)
          })
        }
        this.studentsHandleCurrentChange(1)
      },
      // 点选学生tab
      studentTabHandleClick(tab) {
        this.getStudentInfoWithClass(tab.index)
      },
      // 学情报告响应函数
      handleLearnReport(obj) {
        this.$store.dispatch("saveSCreateRateId", {
          status: 0 // 1 表示从任务管理进入创建报告  0 从学情报告进入创建报告
        });
        this.$router.push({path: ROUTER_REPORT_INFO + obj.row.id});
      }
    },
    watch: {
      currentWorkStatistics(status) {
        this.genWorkRateChart(status)
      }
    },
    computed: {
      stuAverageList: {
        get() {
          if (this.studentAverageFromServer.length > this.stuAveragePageSize) {
            this.stuAveragePageShow = true
          } else {
            this.stuAveragePageShow = false
          }
          return this.studentAverageFromServer.length;
        }
      },
      monthWorkList: {
        get() {
          return this.monthWorkFromServer.length;
        }
      },
      allWorkList: {
        get() {
          return this.allWorkFromServer.length;
        }
      },
      classRateList: {
        get() {
          if (this.classRateFromServer.length > this.classRatePageSize) {
            this.classRatePageShow = true
          } else {
            this.classRatePageShow = false
          }
          return this.classRateFromServer.length;
        }
      },
      studentList: {
        get() {
          if (this.studentsFromServer.length > this.studentPageSize) {
            this.studentsPageShow = true
          } else {
            this.studentsPageShow = false
          }
          return this.studentsFromServer.length;
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

  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 5px 12px 0 #00a2ff30;
  }

  .reportBaseInfo {
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .baseInfoWrapper {
    margin: 2px;
  }

  .reportBaseInfoIcon {
    font-size: 36px;
  }

  .reportBaseInfoLabel {
    font-size: 16px;
    color: #898988;
  }

  .reportBaseInfoVal {
    font-size: 26px;
    font-weight: bold;
  }

  .classTitleCircle {
    height: 8px;
    width: 8px;
    border-radius: 8px;
    background-color: #00a2ff;
    margin-right: 10px;
  }

  .rankCircle {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    line-height: 30px;
    font-size: 18px;
  }

  .rankCircle_1 {
    background-color: #00a2ff;
  }

  .rankCircle_2 {
    background-color: #00a2ff70;
  }

  .rankCircle_3 {
    background-color: #00a2ff36;
  }

  .rankCircle_4 {
    background-color: #aabbcc;
  }

  .icon-banjixinxi, .icon-zongrenshu {
    font-weight: normal;
  }

</style>
