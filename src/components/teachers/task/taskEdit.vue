<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="taskData" :model="taskData" :rules="taskRule" label-width="80px">
          <el-form-item label="任务名称" style="width: 50%;" prop="name">
            <el-input v-model="taskData.name" placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="指派班级" style="width: 25%;" prop="classes">
            <el-cascader
              style="width: 100%;"
              v-model="taskData.classes" :options="classesInfo" :props="props" collapse-tags
              clearable></el-cascader>
          </el-form-item>
          <!--          <el-form-item label="指派班级" style="width: 25%;" prop="classes">-->
          <!--            <el-select v-model="taskData.classes" multiple placeholder="请选择" style="width: 100%;">-->
          <!--              <el-option-->
          <!--                v-for="item in classesInfo"-->
          <!--                :key="item.id"-->
          <!--                :label="item.name"-->
          <!--                :value="item.id"-->
          <!--              ></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="任务类型" style="width: 25%;" prop="currentType">
            <el-select v-model="taskData.currentType" clearable placeholder="请选择" style="width: 100%;"
                       @change="selectTaskTypeChange">
              <el-option
                v-for="item in selectType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="截至时间" prop="data">
            <el-date-picker
              v-model="taskData.data"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <span style="margin-left: 20px;color:#888888">[选填]</span>
          </el-form-item>
          <el-form-item label="作品数量">
            <el-input-number :value="1" :disabled="true"></el-input-number>
            <span style="margin-left: 5px;color:#333333">个</span>
          </el-form-item>
<!--          <el-form-item label="作品要求" style="width: 50%;">-->
<!--            <el-input-->
<!--              type="textarea"-->
<!--              v-model="taskData.describe"-->
<!--              :autosize="{ minRows: 5, maxRows: 5}"-->
<!--              :placeholder="`【选填】请输入作品的要求、规范、注意事项`"-->
<!--            >-->
<!--            </el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="作品要求" prop="worksRequire">
            <div style="width: 80%;">
              <vue-ueditor-wrap v-model="taskData.describe" :config="editConfig" :destroy="true"></vue-ueditor-wrap>
            </div>
          </el-form-item>
          <el-form-item label="编辑器" v-show="showScratch">
            <el-radio-group v-model="taskData.editor">
              <el-radio :label="1">scratch3.0</el-radio>
              <!--<el-radio :label="2">python</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <div
            style="border: none;background:#eeeeee;height: 1px;margin-top: 10px;margin-bottom: 20px;"
          ></div>
          <el-form-item>
            <el-button type="primary" @click="onReleaseTask">发布</el-button>
            <el-button @click="onSaveTask">保存</el-button>
            <el-button @click="onCancelTask">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="cancelDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>任务已经编辑并且没有进行保存，请问确认要继续取消编辑吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCancelTask">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import VueUeditorWrap from 'vue-ueditor-wrap'
    import PubSub from "pubsub-js";
    import promptUtil from "../../../utils/promptUtil";
    import storageUtil from "../../../utils/storageUtil";
    import stringUtil from "../../../utils/stringUtil";
    import staticUtil from "../../../utils/staticUtil";
    import '../../../api/restfulapi';
    import '../../../router/router';
    import {
        qs,
        editTask,
        getTaskById,
        releaseTask,
        teachOwnClass,
        getTaskType,
        getClassAndStudentByTeacher
    } from "../../../api/api";
    import childHeader from '../../component/childHeader'
    export default {
        components: {"als-child-header": childHeader, "VueUeditorWrap": VueUeditorWrap},
        data() {
            return {
                routerConfig: [{name: '任务管理', to: '/taskMan'}, {name: '任务编辑', to: ''}],
                props: {multiple: true},
                cascaderValue: [],
                requestTimeout: 2000, // 请求服务器超时时间
                getTableContentTimeoutId: null, // 模拟异步请求定时id
                queryDataFromServer: {}, // 从服务器获取指定任务信息
                cancelDialogVisible: false, // 确认取消编辑对话框显示状态
                showScratch: false,//是否显示scratch3.0编辑器
                classesInfo: [], // 获取教室的班级列表
                editTypeName: '',//编辑回显类型
                taskData: {data: "", currentType: '', classes: [],describe:'',}, // 本地任务信息数据
                taskRule: {
                    // 数据校验
                    currentType: [{required: true, message: '请选择任务类型', trigger: "blur"}],
                    name: [{required: true, message: "请输入任务名称", trigger: "blur"}],
                    classes: [{required: true, message: "请指派班级及学生", trigger: "blur"}],
                    data: [{required: false}]
                },
                selectType: [],
                pickerOptions: {
                    shortcuts: [
                        {
                            text: "明天",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24);
                                picker.$emit("pick", date);
                            }
                        },
                        {
                            text: "后天",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
                                picker.$emit("pick", date);
                            }
                        },
                        {
                            text: "一周后",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", date);
                            }
                        }
                    ]
                },
                classIdArray: [],
                changedClassId: '',
                newclassIdArray: [],
                //编辑器
                editConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight:350,
                    // serverUrl: 'http://192.168.1.177:9527/als_classroom/public/uedit/controller.php',
                    // serverUrl: 'http://192.168.1.177:9527/als_classroom/public/index.php/index/index/upload',
                    // serverUrl: '//192.168.1.177:9527/ueditor/php/controller.php',
                    serverUrl:'/static/ALSEditor/php/controller.php',

                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    UEDITOR_HOME_URL: '/static/ALSEditor/',
                    toolbars: [[
                        'fullscreen',  '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                         'insertimage', 'emotion',  'insertvideo',  'insertframe', 'insertcode',  'pagebreak', 'template', 'background', '|',
                        'horizontal', 'spechars',  'wordimage', '|',
                        'preview', 'time'
                    ]],
                },

            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", "/taskMan");
            const loading = promptUtil.loading(this);
            // teachOwnClass(
            //   qs.stringify({
            //     school_id: storageUtil.readTeacherIn.fo().school_id,
            //     teacher_id: storageUtil.readTeacherInfo().id,
            //     role_id: storageUtil.readTeacherInfo().school_admin
            //   })
            // )
            //   .then(res => {

            //--------------------
            getClassAndStudentByTeacher(qs.stringify({teacher_id: storageUtil.readTeacherInfo().id})).then(res => {
                PubSub.publish("currentMenuIndex", "/taskMan");
                if (res.code == SUCCESS_CODE) {
                    if (res.data && res.data != '[]') {
                        this.classesInfo = res.data;
                    }
                    getTaskById(
                        qs.stringify({
                            school_id: storageUtil.readTeacherInfo().school_id,
                            task_id: this.$route.params.id
                        })
                    )
                        .then(res => {
                            loading.close();
                            if (res.code == SUCCESS_CODE) {
                                this.taskData.currentType = res.data.mission_id
                                this.selectType.forEach(item => {
                                    if (item.value == res.data.mission_id) {
                                        this.editTypeName = item.label
                                    }
                                })
                                // this.taskData.currentType=res.data.mission_id
                                const moment = require("moment");
                                this.queryDataFromServer = {
                                    name: res.data.name,
                                    classes: res.data.students,
                                    describe:res.data.describe==""?"<h3>【选填】请输入作品的要求、规范、注意事项</h3>":res.data.describe,
                                    // classes: stringUtil.strArr2IntArr(res.data.classes),
                                    data: res.data.data == "Invalid Date" || res.data.data == "" ? "" : moment(res.data.data).toDate(),
                                    // describe: res.data.describe,
                                    editor: parseInt(res.data.editor),
                                    currentType: this.editTypeName
                                };
                                this.taskData = this.clone(this.queryDataFromServer);
                                // this.taskData.classes = this.getClassArrFromArray(this.taskData.classes, 2)
                            } else {
                                promptUtil.wait(this);
                            }
                        })
                        .catch(err => {
                            loading.close();
                            promptUtil.LOG('getTaskById-err', err);
                        });
                } else {
                    loading.close();
                    promptUtil.wait(this);
                }
            })
                .catch(err => {
                    loading.close();
                    promptUtil.LOG("teachOwnClass-err", err);
                });

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
        },
        methods: {
            // 查询班级
            getClassArrFromArray(arr, type) { // 数组  type类型 1 返回id数组  2 返回字符数组
                const classArray = []
                arr.map(item => {
                    let classObj = this.classesInfo.find(obj => obj.id == item)
                    if (!classObj || classObj == null || classObj == [] || classObj == '') {
                        classObj = this.classesInfo.find(obj => obj.name == item)
                    }
                    if (type == 1) { // 返回id数组
                        classArray.push(classObj.id)
                    } else { // 返回字符类型
                        classArray.push(classObj.name)
                    }
                })
                return classArray
            },
            // 查找对应的类型id
            getTypeIdFromArray(value) {
                let typeObj = this.selectType.find(item => item.label == value)
                if (!typeObj || typeObj == null || typeObj == [] || typeObj == '') {
                    typeObj = this.selectType.find(item => item.value == value)
                }
                return typeObj.value
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
            // 发布任务响应事件
            onReleaseTask() {
                if (this.taskData.name == null || this.taskData.name.trim() == "") {
                    promptUtil.warning(this, "请填写任务名称");
                    return;
                }
                if (this.taskData.classes.length == 0) {
                    promptUtil.warning(this, "请选择至少一名学生");
                    return;
                }
                if (!this.taskData.currentType || this.taskData.currentType == '' || this.taskData.currentType == null) {
                    promptUtil.warning(this, "请选择任务类型");
                    return;
                }
                this.taskData.currentType = this.getTypeIdFromArray(this.taskData.currentType)
                const moment = require("moment");
                const loading = promptUtil.loading(this);
                const idsObj = this.getClassAndStudentIDS(this.taskData.classes)
                const queryString = qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    task_id: this.$route.params.id,
                    user_id: storageUtil.readTeacherInfo().id,
                    name: this.taskData.name.trim(),
                    data: moment(this.taskData.data).format("YYYY-MM-DD HH:mm:ss"),
                    editor: this.taskData.editor,
                    classes: idsObj.classes,
                    students: idsObj.students,
                    describe: this.taskData.describe,
                    mission_id: this.taskData.currentType
                });
                releaseTask(queryString)
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            this.$router.push({path: ROUTER_TASK});
                        } else {
                            promptUtil.wait(this);
                        }
                        loading.close()
                    })
                    .catch(err => {
                        loading.close()
                        promptUtil.LOG('releaseTask', err);
                    });
            },
            // 保存任务响应事件
            onSaveTask() {
                // console.log("this.taskData.describe,",this.taskData.describe)
                // return
                const idsObj = this.getClassAndStudentIDS(this.taskData.classes)
                // this.classesInfo.forEach(item=>{
                //   const obj={value:item.id,label:item.name}
                //   this.classIdArray.push(obj)
                // })
                // this.taskData.classes.forEach(item=>{
                //   let arrId=staticUtil.(item,this.classIdArray)
                //   this.changedClassId=arrId
                //   this.newclassIdArray.push(arrId)
                // })
                if (this.taskData.name == null || this.taskData.name.trim() == "") {
                    promptUtil.warning(this, "请填写任务名称");
                    return;
                }
                if (this.taskData.classes.length == 0) {
                    promptUtil.warning(this, "请选择至少一名学生");
                    return;
                }
                if (!this.taskData.currentType || this.taskData.currentType == '' || this.taskData.currentType == null) {
                    promptUtil.warning(this, "请选择任务类型");
                    return;
                }
                const moment = require("moment");
                const loading = promptUtil.loading(this);
                const queryString = qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    task_id: this.$route.params.id,
                    name: this.taskData.name.trim(),
                    data: moment(this.taskData.data).format("YYYY-MM-DD HH:mm:ss"),
                    editor: this.taskData.editor,
                    classes: idsObj.classes,
                    students: idsObj.students,
                    describe: this.taskData.describe,
                    mission_id: this.taskData.currentType
                });
                editTask(queryString)
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            promptUtil.success(this, res.msg);
                            this.$router.replace({path: ROUTER_TASK})
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG("editTask-err", err);
                    });
            },
            // 取消任务操作响应事件
            onCancelTask() {
                const moment = require("moment");
                if (
                    this.taskData.name == this.queryDataFromServer.name &&
                    this.taskData.describe == this.queryDataFromServer.describe &&
                    this.taskData.editor == this.queryDataFromServer.editor &&
                    // && moment(this.taskData.data).format('YYYY-MM-DD HH:mm:ss')==moment(this.queryDataFromServer.data).format('YYYY-MM-DD HH:mm:ss')
                    this.taskData.classes == this.queryDataFromServer.classes
                ) {
                    this.$router.push({path: ROUTER_TASK});
                } else {
                    this.cancelDialogVisible = true;
                }
            },
            // 操作取消任务按钮触发
            handleCancelTask() {
                this.cancelDialogVisible = false;
                this.$router.push({path: ROUTER_TASK});
            },
            //点击scratch3.0显示编辑器
            selectTaskTypeChange(val) {
                if (val == 1) {
                    this.showScratch = true
                } else {
                    this.showScratch = false
                }
            },
            // 克隆对象
            clone(origin) {
                let originProto = Object.getPrototypeOf(origin);
                return Object.assign(Object.create(originProto), origin);
            },
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
