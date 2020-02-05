<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :span="24">
        <label>任务状态</label>
        <el-select v-model="currentSelectTaskStatus" @change="selectTaskStatusChange">
          <el-option
            v-for="item in allTaskStatus"
            :key="item.type"
            :label="item.desc"
            :value="item.type"
          ></el-option>
        </el-select>
        <label style="margin-left: 20px;">类型</label>
        <el-select v-model="currentType" @change="selectTaskTypeChange">
          <el-option
            v-for="item in selectType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入任务名称"
          v-model="inputQueryInfo"
          clearable
          style="width: 200px;margin-left: 20px;"
          @keydown.native.enter="queryClassInfo"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="queryClassInfo">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="addNewTask">添加任务</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-row-style="{'color':'#409EFF'}"
      >
        <el-table-column
          align="center"
          props="id"
          type="index"
          :index="indexMethod"
          label="序号"
          width="60"
        ></el-table-column>
        <el-table-column align="center" prop="name" label="任务名称"></el-table-column>
        <el-table-column align="center" prop="classCount" label="班级数量"></el-table-column>
        <el-table-column align="center" prop="completCount" label="完成人数"></el-table-column>
        <el-table-column align="center" prop="releaseTime" label="发布时间"></el-table-column>
        <el-table-column align="center" prop="typeStatus" label="类型"></el-table-column>
        <el-table-column align="center" prop="taskStatus" label="任务状态">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus==='待发布'" style="color:red">{{scope.row.taskStatus}}</span>
            <span v-else>{{scope.row.taskStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="teacher_name" label="发布人"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.taskStatus==='待发布'&& scope.row.caozuo==0 "
              plain
              size="mini"
              type="primary"
              :disabled="true"
              @click="onEditTask({index: scope.$index, row:scope.row})"
            >编辑
            </el-button>
            <el-button
              v-else-if="scope.row.taskStatus==='待发布'&& scope.row.caozuo==1 "
              plain
              size="mini"
              type="primary"
              @click="onEditTask({index: scope.$index, row:scope.row})"
            >编辑
            </el-button>
            <el-button
              plain
              v-show="scope.row.taskStatus==='已发布'"
              size="mini"
              @click="onSeekTask({index: scope.$index, row:scope.row})"
            >查看
            </el-button>
            <el-button
              plain
              v-if="scope.row.taskStatus==='待发布'&&scope.row.caozuo==0"
              size="mini"
              type="danger"
              :disabled="true"
              @click="handleDelTask({index: scope.$index, row:scope.row})"
            >删除
            </el-button>
            <el-button
              plain
              v-else-if="scope.row.taskStatus==='待发布'&&scope.row.caozuo==1"
              size="mini"
              type="danger"
              @click="handleDelTask({index: scope.$index, row:scope.row})"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="taskInfoList"
      ></el-pagination>
    </el-row>
    <el-dialog
      title="添加任务"
      :visible.sync="addTaskFormVisible"
      width="25%"
      :before-close="resetFormWithAddTask"
    >
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form
            :model="ruleFormWithTask"
            :rules="ruleWithTask"
            ref="ruleFormWithTask"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="ruleFormWithTask.name" placeholder="请输入任务名称"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormWithAddTask">取 消</el-button>
        <el-button type="primary" @click="onCreateTask" :loading="isCreateTask">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{delDialogContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDeleteTask" :loading="isLoadingWithDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import '../../../api/restfulapi';
    import {
        qs,
        addTask,
        delTask,
        getTaskList,
        getTaskType
    } from "../../../api/api";
    import childHeader from '../../component/childHeader'

    export default {
        components: {"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name: '任务管理', to: ''}],
                inputQueryInfo: "", // 搜索内容
                tableData: [], // 班级数据
                queryFromServer: [], // 服务器请求数据
                pageSize: 10, // 分页页码大小
                currentPage: 1, // 分页当前页码
                requestTimeout: 2000, // 请求服务器超时时间
                getTableContentTimeoutId: null, // 模拟异步请求定时id
                currentSelectTaskStatus: "全部", // 当前选择的任务状态
                currentSelectTaskStatusId: 2, // 当前点选任务状态id
                currentSelectTaskId: 0, // 当前选择的任务id
                addTaskFormVisible: false, // 添加任务对话框显示状态
                delDialogVisible: false, // 是否显示删除对话框
                delDialogContent: "", // 删除对话框内容
                isLoadingWithDel: false, //删除按钮加载状态
                currentDelTaskItem: null, // 当前要删除的任务信息
                isCreateTask: false, //创建按钮加载状态
                currentType: "全部",//当前选择的类型
                selectType: [{value: 0, label: '全部'}],//所有类型3D打印
                selectArray: [],
                selectTaskTypeId: '',//查询类型id
                ruleFormWithTask: {
                    // 添加任务数据集
                    name: ""
                },
                ruleWithTask: {
                    name: [{required: true, message: "请输入任务名称", trigger: "blur"}]
                },
                allTaskStatus: [
                    {type: 2, desc: "全部"},
                    {type: 1, desc: "已发布"},
                    {type: 0, desc: "未发布"}
                ]
            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", "/taskMan");
            // console.log("角色",storageUtil.readUserRole())  //1 校长 2 老师

            //获取所有类型3D打印
            getTaskType(qs.stringify({})).then(res => {
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        res.data.forEach(item => {
                            const obj = {value: item.id, label: item.name}
                            this.selectType.push(obj)
                        })
                    }
                } else if (res.code == ERROR_CODE) {
                    promptUtil.error(this, res.msg)
                } else {
                    promptUtil.wait(this)
                }
            }).catch(err => {
                promptUtil.LOG('getTaskType-err', err)
            })
            //获取列表
            const loading = promptUtil.loading(this);
            getTaskList(
                qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    teacher_id: storageUtil.readTeacherInfo().id
                })
            )
                .then(res => {
                    loading.close();
                    PubSub.publish("currentMenuIndex", "/taskMan");
                    if (res.code == SUCCESS_CODE) {
                        this.queryFromServer = [];
                        if (res.data && res.data != '[]') {
                            // 1可以操作 0 不可操作
                            res.data.forEach(item => {
                                this.queryFromServer.push(item)
                            })
                        }
                        this.tableData = this.queryFromServer.slice(
                            (this.currentPage - 1) * this.pageSize,
                            this.pageSize + (this.currentPage - 1) * this.pageSize
                        );
                    } else {
                        promptUtil.wait(this);
                    }
                })
                .catch(err => {
                    loading.close();
                    PubSub.publish("currentMenuIndex", "/taskMan");
                    promptUtil.LOG("getTaskList-err", err);
                });
        },
        computed: {
            taskInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            }
        },
        methods: {
            // 查询触发函数
            queryClassInfo() {
                const loading = promptUtil.loading(this);
                let queryText = "";
                if (this.inputQueryInfo == null || this.inputQueryInfo.trim() == "") {
                    queryText = "";
                } else {
                    queryText = this.inputQueryInfo.trim(); // 0 待发布 1 已发布 2全部
                }
                getTaskList(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        teacher_id: storageUtil.readTeacherInfo().id,
                        name: queryText,
                        taskStatus: this.currentSelectTaskStatusId,
                        mission_id: this.selectTaskTypeId
                    })
                )
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            this.inputQueryInfo = "";
                            // 重置当前页为1
                            this.currentPage = 1;
                            this.queryFromServer = [];
                            if (res.data && res.data != '[]') {
                                // 根据请求api返回值设置tableData
                                //  this.queryFromServer = res.data;
                                this.selectType.forEach(item => {
                                    this.selectArray[item.value] = item.label
                                })
                                res.data.forEach(item => {
                                    item.typeStatus = this.selectArray[item.mission_id]
                                    this.queryFromServer.push(item)
                                })
                            }
                            this.tableData = this.queryFromServer.slice(
                                (this.currentPage - 1) * this.pageSize,
                                this.pageSize + (this.currentPage - 1) * this.pageSize
                            );
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG("queryTaskList-err", err);
                    });
            },
            //按照类型搜索
            selectTaskTypeChange(val) {
                this.selectTaskTypeId = val
                this.queryClassInfo()
            },


            // 编辑任务
            onEditTask(item) {
                this.$router.push({path: `/taskMan/edit/` + item.row.id});
            },
            // 查看任务
            onSeekTask(item) {
                this.$router.push({path: `/taskMan/see/` + item.row.id});
            },
            // 确认删除任务响应
            onDeleteTask() {
                this.isLoadingWithDel = true;
                delTask(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        task_id: this.currentDelTaskItem.row.id,
                        user_id: storageUtil.readTeacherInfo().id
                    })
                )
                    .then(res => {
                        this.delDialogVisible = false;
                        this.isLoadingWithDel = false;
                        if (res.code == SUCCESS_CODE) {
                            const currentDelTaskIndex =
                                this.currentDelTaskItem.index +
                                (this.currentPage - 1) * this.pageSize; // 为教师索引，不是教师id
                            this.queryFromServer.splice(currentDelTaskIndex, 1);
                            this.tableData = this.queryFromServer.slice(
                                (this.currentPage - 1) * this.pageSize,
                                this.pageSize + (this.currentPage - 1) * this.pageSize
                            );
                            promptUtil.success(this, res.msg);
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        this.delDialogVisible = false;
                        this.isLoadingWithDel = false;
                        promptUtil.LOG("delTask-err", err);
                    });
            },
            // 删除任务操作
            handleDelTask(item) {
                this.currentDelTaskItem = item;
                this.delDialogVisible = true;
                this.delDialogContent =
                    "您确定要删除 【" + this.currentDelTaskItem.row.name + "】 吗";
            },
            // 添加新任务
            addNewTask() {
                this.addTaskFormVisible = true;
            },
            // 添加任务处理
            onCreateTask() {
                if (
                    this.ruleFormWithTask.name == null ||
                    this.ruleFormWithTask.name.trim() == ""
                ) {
                    promptUtil.warning(this, "请填写必要信息");
                    return;
                }
                addTask(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        teacher_id: storageUtil.readTeacherInfo().id,
                        task_name: this.ruleFormWithTask.name.trim()
                    })
                )
                    .then(res => {
                        this.isCreateTask = true;
                        if (res.code == SUCCESS_CODE) {
                            if (res.data && res.data != '[]') {
                                this.currentSelectTaskId = res.data;
                                setTimeout(() => {
                                    this.isCreateTask = false;
                                    this.addTaskFormVisible = false;
                                    this.$router.push({
                                        path: `/taskMan/edit/` + this.currentSelectTaskId
                                    });
                                }, 1000);
                            } else {
                                promptUtil.wait(this);
                            }
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        this.addTaskFormVisible = false;
                        promptUtil.LOG("addTask-err", err);
                    });
                // setTimeout(()=>{ //模拟异步请求
                //   this.addTaskFormVisible=false
                //   // 获取taskId   创建task也需要id
                //   this.currentSelectTaskId=100
                //   this.$router.push({ path: `/taskMan/edit/`+this.currentSelectTaskId})
                // },100)
            },
            // 重置添加班级对话框
            resetFormWithAddTask() {
                this.$refs.ruleFormWithTask.resetFields();
                this.addTaskFormVisible = false;
            },
            // 设置当前table索引
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * 10;
            },
            // 当前页触发函数
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableData = this.queryFromServer.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize
                );
            },
            // 点选任务状态发生改变时触发
            selectTaskStatusChange(val) {
                this.currentSelectTaskStatusId = val;
                this.queryClassInfo();
            }
        }
    };
</script>
<style scoped>
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

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

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
    font-size: 18px;
    line-height: 2.5;
    color: #00a2ff;
    font-weight: bold;
  }

  h4 {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    color: #00a2ff;
  }

  .ahref {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: #00a2ff;
    display: block;
  }

  .ml a {
    text-align: center;
  }
</style>
