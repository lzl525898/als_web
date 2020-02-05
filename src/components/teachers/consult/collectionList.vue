<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <div style="margin-top: 20px">
      <el-card>
        <div style="width: 80%;margin: 0 auto;overflow:hidden;">
          <el-steps :active="active" :align-center="true">
            <el-step title="完善信息">
            </el-step>
            <el-step title="定制采单页面"></el-step>
            <el-step title="选择采单人"></el-step>
            <el-step title="生成采单">
            </el-step>
          </el-steps>
          <div style="height: 300px;position: relative">
            <div v-show="perfectInformation">
              <p style="text-align: center;padding-top: 130px;color: #00a2ff">使用采单功能前请完善机构管理中的信息，否则生成的页面将缺少信息。</p>
            </div>
            <div v-show="customPicking" style="margin: 40px auto">
              <p>请选择你要生成的采单表单:</p>
              <div>
                <el-row>
                  <el-col :span="2"><span style="font-size: 14px">必选项：</span></el-col>
                  <el-col :span="22">
                    <el-checkbox v-model="checked1" label="学生姓名" border size="small" :disabled="disabled"></el-checkbox>
                    <el-checkbox v-model="checked2" label="学员电话" border size="small" :disabled="disabled"></el-checkbox>
                    <!--                    <el-checkbox v-model="checked3" label="采单人" border size="small" :disabled="disabled"></el-checkbox>-->
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 20px">
                <el-row>
                  <el-col :span="2"><span style="font-size: 14px">选填项：</span></el-col>
                  <el-col :span="22">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="item in optionalItemArray" :label="item" :key="item" border size="small"
                                   style="margin-left: 0 !important;margin-top: 10px;color: #00a2ff;">{{item}}
                      </el-checkbox>
                    </el-checkbox-group>
                    <!--                    <el-upload-->
                    <!--                      style="width: 40%;margin-top: 30px;margin-bottom: 100px;height: 180px"-->
                    <!--                      class="upload-demo"-->
                    <!--                      :action=uploadPictureAction-->
                    <!--                      :on-preview="handlePreview"-->
                    <!--                      :on-remove="handleRemove"-->
                    <!--                      :file-list="fileList"-->
                    <!--                      list-type="picture">-->
                    <!--                      <el-button size="mini" type="primary">上传头像</el-button>-->
                    <!--                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                    <!--                    </el-upload>-->
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-show="singlePerson" style="display: flex;justify-content: center;margin-top: 120px">
              <span style="padding-top: 10px">请选择采单人：</span>
              <el-select v-model="currentTeacher" placeholder="请选择" style="width: 150px"
                         @change="selectTeacherWithSchedule">
                <el-option
                  v-for="item in searchAllTeacher"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div v-show="productionList" style="margin-top: 60px">
              <p style="text-align: center">生成的二维码与链接</p>
              <vue-qr
                :text="collectionUrl"
                :logoSrc="require('../../../../static/images/base/logo.jpg')"
                colorDark="#000"
                colorLight="#fff"
                :margin="0"
                :logoScale="0.4"
                :size="130"
                style="margin: 0 auto;display: block;width: 120px;"
              ></vue-qr>
              <!--              <img src="../../../../static/images/base/ewm.png" alt=""-->
              <!--                   style="margin: 0 auto;display: block;width: 120px;">-->
              <p style="text-align: center">{{collectionUrl}}</p>
            </div>
            <div style="position: absolute;bottom: 0;left: 50%;transform: translate(-50%)">
              <div v-if="active==1">
                <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
              </div>
              <div v-if="active==3">
                <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
                <el-button style="margin-top: 12px;" @click="next">生成采单</el-button>
              </div>
              <div v-if="active==4">
                <el-button style="margin-top: 12px;" @click="regenerate">重新生成</el-button>
              </div>
            </div>
            <div v-if="active==2" style="position: absolute;bottom: 0px;left: 50%;transform: translate(-50%)">
              <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
              <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
            </div>
          </div>

        </div>
      </el-card>
    </div>
    <!--    表单-->
    <el-card style="margin-top: 20px">
      <div style="margin-top: 20px">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="链接"
            align="center"
          >
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope" align="center">
              <el-button @click="handleClick(scope.row)" type="primary"
                         plain size="small">预览
              </el-button>
              <el-popover
                placement="top"
                width="150"
                trigger="click">
                <div>
                  <vue-qr
                    :text="tablistEwm"
                    :logoSrc="require('../../../../static/images/base/logo.jpg')"
                    colorDark="#000"
                    colorLight="#fff"
                    :margin="0"
                    :logoScale="0.4"
                    :size="130"
                    style="margin: 0 auto;display: block;width: 120px;"
                  ></vue-qr>
                </div>
                <el-button  type="primary" @click="handleEwm(scope.row)" plain size="small" slot="reference">二维码</el-button>
              </el-popover>
              <el-button type="danger" plain @click="handleDel({index: scope.$index, row:scope.row})" size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" class="mt" v-show="showType">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="consultInfoList"
          ></el-pagination>
        </el-row>
      </div>
    </el-card>
    <!--    是否删除对话框-->
    <!--    <el-dialog title="提示" :visible.sync="delCollectionDialogVisible" width="20%">-->
    <!--      <el-row>-->
    <!--        <el-col :span="4">-->
    <!--          <i class="el-icon-question"></i>-->
    <!--        </el-col>-->
    <!--        <el-col :span="20">-->
    <!--          <span>{{delDialogContent}}</span>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="delCollectionDialogVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="onDeleteCollection" :loading="isLoadingWithDel">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="455px"
      append-to-body
      :before-close="handleClose"
      @opened="outerDialog">
      <div style="height: 600px;overflow-y:scroll">
        <institution-dialog ref="institutionDialogRef" class="dialogBox"></institution-dialog>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import staticUtil from "../../../utils/staticUtil";
  import $ from "jquery"
  import PubSub from "pubsub-js"
  import promptUtil from '../../../utils/promptUtil'
  import stringUtil from '../../../utils/stringUtil'
  import storageUtil from '../../../utils/storageUtil'
  import vueQr from "vue-qr";
  import {
    qs,
    getTeacherList,
    uploadFileUrl,
    saveCollectionForm,
    getCollectionTableList,
    delCollectionTableList
  } from '../../../api/api'
  import childHeader from '../../component/childHeader'
  import institutionDialog from './institutionDialog.vue'

  export default {
    components: {"als-child-header": childHeader, "institution-dialog": institutionDialog, vueQr},
    data() {
      return {
        routerConfig: [{name: '定制采单', to: ''}],
        formLabelWidth: '100px',
        isLoadingItem: false, // 添加/编辑响应时状态
        checkAll: false,
        checkedCities: [],
        // optionalItem
        optionalItemArray: ['性别', '家长姓名', '备用电话', '学校', '年级班级', '生日', '来源', '意向程度'],
        isIndeterminate: true,
        checked1: true,
        checked2: true,
        disabled: true,
        active: 1,
        perfectInformation: true,
        customPicking: false,
        singlePerson: false,
        productionList: false,
        currentTeacher: "",
        searchAllTeacher: [],
        collectionUrl: '',
        showType: false, // 是否显示分页
        pageSize: 5, // 分页页码大小
        currentPage: 1, // 分页当前页码
        queryFromServer: [],// 列表数据从服务器返回
        tableData: [],
        dialogVisible: false,
        uploadPictureAction: uploadFileUrl, // 上传图片action地址
        delCollectionDialogVisible: false,//删除采单对话框
        isLoadingWithDel: false, //删除按钮加载状态
        delDialogContent: "", // 删除对话框内容
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        optionalItem: [],//选填项数组
        teacherName: [],
        teacherId: "",
        seeData: '',
        currentDelId: '',
        showSelectForm: [],
        tablistEwm:''

      }
    },
    mounted() {
      this.active = 1
      //获取所有教师
      getTeacherList(qs.stringify({
        school_id: storageUtil.readTeacherInfo().school_id
      })).then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.searchAllTeacher = []
            res.data.forEach(item => {
              const classObj = {value: item.id, label: item.nick}
              this.searchAllTeacher.push(classObj);
            });
          }
        } else if (res.code == ERROR_CODE) {
          promptUtil.error(this, res.msg)
        } else {
          promptUtil.wait(this)
        }
      }).catch(err => {
        promptUtil.LOG("getTeacherList-err", err)
      })
      this.getTableList()
    },
    methods: {
      // 重置添加Item对话框
      resetAddItemWithDialog() {
        this.consultForm = {
          name: '',
          sex: '1',
          avatarUrl: '',
          class: "",
          birth: '',
          phone1: '', // 学员电话
          phone2: '', // 备用电话
          school: '',
          parent: '',
          addStatus: '',
          // collector: '',// 采单人
          collector: {current: "", arrays: []}, // 采单人
          adviser: {current: "", arrays: []}, // 课程顾问
          source: '', // 1地推采单  2门店到访  3转介绍  4活动转化  5网络推广  0其他
          extent: '', // 1高2中3低0不明确、
          desc: '' // 备注
        }
        try {
          this.$refs['consultForm'].resetFields();
        } catch (err) {
        }
        this.showAddItem = false
      },
      //全选
      handleCheckAllChange(val) {
        if (val == true) {
          this.optionalItem = this.optionalItemArray
        }
        this.checkedCities = val ? this.optionalItemArray : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        this.optionalItem = value
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.optionalItemArray.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.optionalItemArray.length;
      },
      next() {
        if (this.active++ > 4) this.active = 4;
        if (this.active == 2) {
          this.isIndeterminate = true
          this.checkAll = false
          this.checkedCities = []
          this.perfectInformation = false
          this.customPicking = true
        } else if (this.active == 3) {
          this.customPicking = false
          this.singlePerson = true
          this.currentTeacher = ''
        } else {
          if (this.currentTeacher == "") {
            promptUtil.warning(this, "请选择采单人")
            this.active = 3
            return
          }
          this.singlePerson = false
          this.productionList = true
          // 二维码与链接
          saveCollectionForm(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            teacher_id: this.teacherId,
            form_con: JSON.stringify(this.optionalItem)
          })).then(res => {
            if (res.code == SUCCESS_CODE) {
              if (res.data && res.data != '[]') {
                this.collectionUrl = res.data
                this.getTableList()
              }
            } else if (res.code == ERROR_CODE) {
              promptUtil.error(this, res.msg)
            } else {
              promptUtil.wait(this)
            }
          }).catch(err => {
            promptUtil.LOG('saveCollectionForm-err', err)
          })

        }
      },
      getTableList() {
        //taabelList
        getCollectionTableList(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != '[]') {
              this.queryFromServer = res.data
              this.handleCurrentChange(this.currentPage)
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg)
          } else {
            promptUtil.wait(this)
          }
        }).catch(err => {
          promptUtil.LOG('getCollectionTableList-err', err)
        })
      },
      regenerate() {
        this.active = 1
        this.productionList = false
        this.perfectInformation = true
        this.getTableList()
      },
      pre() {
        if (this.active-- <= 1) this.active = 1;
        if (this.active == 1) {
          this.checkAll = false
          this.isIndeterminate = true;
          this.perfectInformation = true
          this.customPicking = false
        } else if (this.active == 2) {
          this.customPicking = true
          this.singlePerson = false
        } else {
          this.singlePerson = true
          this.productionList = false
        }
      },
      //选择教师
      selectTeacherWithSchedule(val) {
        this.teacherId = val
        this.teacherName = staticUtil.findLabelFromArray(val, this.searchAllTeacher)
      },
      handleClose(done) {
        done();
      },
      outerDialog() {
        const obj = {
          teacherName: this.teacherName,
          seeData: this.seeData
        }
        this.$refs.institutionDialogRef.start(obj)
      },
      handleClick(value) {
        this.dialogVisible = true
        this.seeData = value
      },
      handleEwm(item){
        this.tablistEwm=item.address
      },
      handleDel(item) {
        this.currentDelTaskItem = item;
        this.currentDelId = item.row.id
        // this.delCollectionDialogVisible = true;
        // this.delDialogContent =
        //   "您确定要删除 【" + item.row.name + "】 吗";

        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          delCollectionTableList(
            qs.stringify({
              id: this.currentDelId
            })).then(res => {
            this.delCollectionDialogVisible = false;
            this.isLoadingWithDel = false;
            if (res.code == SUCCESS_CODE) {
              const currentDelTaskIndex =
                this.currentDelTaskItem.index +
                (this.currentPage - 1) * this.pageSize; // 索引，不是id
              this.queryFromServer.splice(currentDelTaskIndex, 1);
              this.handleCurrentChange(this.currentPage)
              // promptUtil.success(this, res.msg);
              this.$message({
                type: 'success',
                message: res.msg
              });
            } else {
              promptUtil.wait(this);
            }
          })
            .catch(err => {
              this.delCollectionDialogVisible = false;
              this.isLoadingWithDel = false;
              promptUtil.LOG("delCollectionTableList-err", err);
            });

        }).catch(() => {
        });
      },
      //删除dialog中的确定按钮
      onDeleteCollection() {
        this.isLoadingWithDel = true;
        delCollectionTableList(
          qs.stringify({
            id: this.currentDelId
          })).then(res => {
          this.delCollectionDialogVisible = false;
          this.isLoadingWithDel = false;
          if (res.code == SUCCESS_CODE) {
            const currentDelTaskIndex =
              this.currentDelTaskItem.index +
              (this.currentPage - 1) * this.pageSize; // 索引，不是id
            this.queryFromServer.splice(currentDelTaskIndex, 1);
            this.handleCurrentChange(this.currentPage)
            promptUtil.success(this, res.msg);
          } else {
            promptUtil.wait(this);
          }
        })
          .catch(err => {
            this.delCollectionDialogVisible = false;
            this.isLoadingWithDel = false;
            promptUtil.LOG("delCollectionTableList-err", err);
          });

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 根据页码获取table数据
      handleCurrentChange(page) {
        if (this.queryFromServer.length > this.pageSize) {
          this.showType = true
        } else {
          this.showType = false
        }
        this.currentPage = page;
        //当前页面需要显示得条数=所有条数
        this.tableData = this.queryFromServer.slice(
          (this.currentPage - 1) * this.pageSize,
          this.pageSize + (this.currentPage - 1) * this.pageSize
        );
        // console.log(" this.tableData", this.tableData)
      },
    },
    computed: {
      consultInfoList: {
        get() {
          return this.queryFromServer.length;
        }
      }
    }

  }
</script>

<style scoped>
  .el-upload-list {
    width: 40% !important;
  }

  .dialogBox >>> .el-dialog__body {
    padding: 0 !important;
    overflow: hidden;
  }

  .dialogBox >>> .el-dialog__header {
    background-color: #00a2ff !important;
    /*background-image: linear-gradient(to right, #0078ff, #aa0def);*/
    /*background-image: linear-gradient(to bottom right, #00a2ff, blue);*/
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

</style>
