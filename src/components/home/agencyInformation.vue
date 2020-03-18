<template>
  <div>
    <div v-show="!isAuth">
      <als-no-auth/>
    </div>
    <div v-show="isAuth">
      <!--   面包屑-->
      <el-row>
        <el-col :span="24">
          <als-child-header :config="routerConfig"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tabs v-model="currentSelectTab" @tab-click="handleClick" type="card">
            <el-tab-pane label="机构信息" name="first">
              <!--            地图开始-->
              <div id='container'></div>
              <div id="myPageTop">
                <table>
                  <tr>
                    <td>
                      <label>请输入关键字：</label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input id="tipinput"/>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="info" v-show="info">
                <h4 id='status'></h4>
                <hr>
                <p id='result'></p>
                <hr>
                <p>由于众多浏览器已不再支持非安全域的定位请求，为保位成功率和精度，请升级您的站点到HTTPS。</p>
              </div>
              <!--            地图结束-->
              <div class="el-formBox el-formBox_top">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="机构地址：" prop="adress">
                    <el-input v-model="ruleForm.adress" placeholder="请输入机构地址"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话：" prop="phone">
                    <el-input v-model="ruleForm.phone" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                  <el-form-item label="微信：" prop="wechat">
                    <el-input v-model="ruleForm.wechat" placeholder="请输入微信号"></el-input>
                  </el-form-item>
                  <el-form-item label="QQ：" prop="qq">
                    <el-input v-model="ruleForm.qq" placeholder="请输入QQ号"></el-input>
                  </el-form-item>
                  <el-form-item label="微博：" prop="weibo">
                    <el-input v-model="ruleForm.weibo" placeholder="请输入微博"></el-input>
                  </el-form-item>
                  <el-form-item label="机构宣传：">
                    <el-upload
                      :headers="headers"
                      :action="uploadPictureAction"
                      list-type="picture-card"
                      :limit="9"
                      :on-remove="handlePictureRemove"
                      :on-preview="handlePictureCardPreview"
                      :before-upload="handlePictureBeforeUpload"
                      :on-success="handleSuccessUploadImage"
                      :on-error="handleErrorUpload"
                      :on-progress="handleRrogress"
                      :file-list="ruleForm.pictureList"
                    >
                      <div slot="trigger">
                        <span style="color:#888888">添加图片</span>
                      </div>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多9张</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogImageVisibleOrigin" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveAgencyInfo" :disabled="saveAgencyInfoDisabled">保存</el-button>
                    <!--<el-button type="primary" @click="editAgencyInfo" v-if="editAgencyInfoBtn">编辑</el-button>-->
                  </el-form-item>
                </el-form>
              </div>
              <el-row>
                <el-col :span="24"></el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="课程展示" name="second">
              <div class="el-formBox">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="课程名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入课程名称"></el-input>
                  </el-form-item>
                  <el-form-item label="课程介绍：" prop="courseDetail">
                    <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入课程介绍"
                      v-model="ruleForm.courseDetail">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="标签：" prop="courseTag">
                    <el-input placeholder="请输入标签，例如：图形化编程、编程代码" v-model="ruleForm.courseTag">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="课程等级：" prop="courseLevel">
                    <el-radio v-model="ruleForm.courseLevel" label="初级课">初级课</el-radio>
                    <el-radio v-model="ruleForm.courseLevel" label="中级课">中级课</el-radio>
                    <el-radio v-model="ruleForm.courseLevel" label="高级课">高级课</el-radio>
                  </el-form-item>
                  <el-form-item label="难易度：" prop="facilityalue">
                    <el-rate v-model="ruleForm.facilityalue" style="margin-top: 10px"></el-rate>
                  </el-form-item>
                  <el-form-item label="课程封面：" prop="courseImg">
                    <el-upload
                      :action="uploadPictureAction"
                      list-type="picture-card"
                      :limit="1"
                      :on-remove="handlePictureRemove"
                      :on-preview="handlePictureCardPreview"
                      :before-upload="handlePictureBeforeUpload"
                      :on-success="handleSuccessUploadImage"
                      :on-error="handleErrorUpload"
                      :on-progress="handleRrogress"
                      ref="delClassUpload"
                    >
                      <div slot="trigger">
                        <span style="color:#888888">添加图片</span>
                      </div>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogImageVisibleClass" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveCourseInfor('ruleForm')" :disabled="saveCourseInforDisabled">
                      保存
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-row>
                <el-col :span="24">
                  <div class="line"></div>
                </el-col>
              </el-row>
              <el-row>

                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  :header-row-style="{'color':'#409EFF'}">
                  <el-table-column
                    align="center"
                    props="id"
                    type="index"
                    label="序号"
                    width="60"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="课程名称"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="detail"
                    label="课程介绍"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="tag"
                    label="课程标签"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="courseLevel"
                    label="课程等级"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="facilityalue"
                    label="难易度"
                    align="center">
                  </el-table-column>
                  <el-table-column label="课程封面" width="100" align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.avtar==''">未上传</div>
                      <div v-else>
                        <img :src="scope.row.avtar" width="40" height="40" class="head_pic"/>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="showCourseInfor(scope.$index, scope.row)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="名师风采" name="third">
              <div class="el-formBox">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="教师名称：" prop="teacherName">
                    <el-input v-model="ruleForm.teacherName" placeholder="请输入教师名称"></el-input>
                  </el-form-item>
                  <el-form-item label="性别：" prop="sex">
                    <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
                    <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
                  </el-form-item>
                  <el-form-item label="教师标签：" prop="teacherDetail">
                    <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入教师标签，如金牌讲师"
                      v-model="ruleForm.teacherDetail">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="教师简介：" prop="teacherIntroduction">
                    <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入教师简介"
                      v-model="ruleForm.teacherIntroduction">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="教师等级：" prop="level">
                    <el-radio v-model="ruleForm.level" label="初级教师">初级教师</el-radio>
                    <el-radio v-model="ruleForm.level" label="中级教师">中级教师</el-radio>
                    <el-radio v-model="ruleForm.level" label="高级教师">高级教师</el-radio>
                  </el-form-item>
                  <el-form-item label="教师头像：" prop="teacherImg">
                    <el-upload
                      :action="uploadPictureAction"
                      list-type="picture-card"
                      :limit="1"
                      :on-remove="handlePictureRemove"
                      :on-preview="handlePictureCardPreview"
                      :before-upload="handlePictureBeforeUpload"
                      :on-success="handleSuccessUploadImage"
                      :on-error="handleErrorUpload"
                      :on-progress="handleRrogress"
                      ref="delTeacherUpload"
                    >
                      <div slot="trigger">
                        <span style="color:#888888">添加图片</span>
                      </div>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogImageVisibleTeacher" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="saveTeacherInfo('ruleForm')" :disabled="saveTeacherInfoDisabled">保存
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-row>
                <el-col :span="24">
                  <div class="line"></div>
                </el-col>
              </el-row>
              <el-row>

                <el-table
                  :data="teacherTableData"
                  border
                  style="width: 100%"
                  :header-row-style="{'color':'#409EFF'}">
                  <el-table-column
                    align="center"
                    props="id"
                    type="index"
                    label="序号"
                    width="60"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="教师名称"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="sex"
                    label="性别"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="detail"
                    label="教师标签"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="teacherIntroduction"
                    label="教师简介"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="level"
                    label="教师等级"
                    align="center">
                  </el-table-column>
                  <el-table-column label="教师头像" width="100" align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.avtar==''">未上传</div>
                      <div v-else>
                        <img :src="scope.row.avtar" width="40" height="40" class="head_pic"/>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="showTeacherInfor(scope.$index, scope.row)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="关于我们" name="four">
              <div class="el-formBox">
                <el-form :model="aboutUsRuleForm" :rules="aboutUsRules" ref="aboutUsRuleForm" label-width="100px"
                         class="demo-ruleForm">
                  <el-form-item label="机构名称：" prop="aboutSchoolName">
                    <el-input v-model="aboutUsRuleForm.aboutSchoolName" placeholder="请输入机构名称"></el-input>
                  </el-form-item>
                  <el-form-item label="关于我们：" prop="schoolDescribed">
                    <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入信息"
                      v-model="aboutUsRuleForm.schoolDescribed">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="机构logo：">
                    <el-upload
                      :action="uploadPictureAction"
                      list-type="picture-card"
                      :limit="1"
                      :on-remove="handlePictureRemove"
                      :on-preview="handlePictureCardPreview"
                      :before-upload="handlePictureBeforeUpload"
                      :on-success="handleSuccessUploadImage"
                      :on-error="handleErrorUpload"
                      :on-progress="handleRrogress"
                      :file-list="aboutUsRuleForm.aboutUsPictureList"
                    >
                      <div slot="trigger">
                        <span style="color:#888888">添加图片</span>
                      </div>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB，最多1张</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogImageVisibleAboutUs" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </el-form-item>
                  <el-form-item label="编辑器logo:">
                    <div style="padding-top: 13px">
                      <el-link :underline="false" type="primary" style="margin-top: -30px;"
                               @click="avatarDialogVisible=true">上传logo
                      </el-link>
                    </div>
                    <el-avatar :src="currentAvatarImg"></el-avatar>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveAboutUsInfo(ruleForm)" v-if="saveAboutUsInfoBtn"
                               :disabled="saveAboutUsInfoDisabled">保存
                    </el-button>
                    <!--                  <el-button type="primary" @click="editAboutUsInfo" v-if="editAboutUsInfoBtn">编辑</el-button>-->
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
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
        <el-button type="primary" @click="handleDelCourseInfo" :loading="isLoadingWithDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delTeacherDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>{{delDialogTeacherContent}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delTeacherDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelTeacherInfort" :loading="isLoadingTeacherWithDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="avatarDialogVisible"
      append-to-body>
      <div class="cropper-content">
        <div class="cropper">
          <vueCropper
            ref="origin_cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
            @imgLoad="imgLoad"></vueCropper>
        </div>
        <div class="show-preview"
             :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden','background-position':'cover'}">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>
      <div class="footer-btn">
        <div class="scope-btn">
          <label class="btn" for="uploads">选择图片</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
                 accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
          <el-button size="mini" icon="el-icon-plus" @click="changeScale(1)"></el-button>
          <el-button size="mini" icon="el-icon-minus" @click="changeScale(-1)"></el-button>
          <el-button size="mini" style="font-weight: 600;" @click="rotateLeft">↺</el-button>
          <el-button size="mini" style="font-weight: 600;" @click="rotateRight">↻</el-button>
        </div>
        <div class="upload-btn">
          <el-button type="primary" style="margin-left: 46px;" size="mini" @click="down('base64')"
                     :loading="isUpdateAvatarLoading">上传logo
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PubSub from "pubsub-js"
  import {VueCropper} from 'vue-cropper';
  import childHeader from '../component/childHeader'
  import noAuthContent from "../component/noAuthContent"
  import promptUtil from "../../utils/promptUtil";
  import storageUtil from "../../utils/storageUtil";
  import '../../api/restfulapi';
  import {
    qs,
    uploadFileUrl,
    organUpdate,
    getOrganUpdate,
    delUploadFileByUrl,
    classUpdate,
    delClassUpdate,
    saveTeacherInformation,
    delTeacherUpdate,
    saveAboutUsInformation,
    uploadOriginBase64
  } from "../../api/api";

  export default {
    components: {
      "VueCropper": VueCropper,
      "als-child-header": childHeader,
      "als-no-auth":noAuthContent
    },
    data() {
      return {
        isAuth:false,
        routerConfig: [{name: '机构信息', to: ''}],
        saveAgencyInfoDisabled: false,//图片未上传成功disabled保存机构信息按钮
        saveCourseInforDisabled: false,//图片未上传成功disabled保存课程按钮
        saveTeacherInfoDisabled: false,//图片未上传成功disabled保存教师信息按钮
        saveAboutUsInfoDisabled: false,//图片未上传成功disabled保存关于我们按钮
        currentDelClassIndex: '',//删除课程信息id
        currentDelTeacherIndex: '',//删除课程信息id
        delClassInfoId: '',//传值给服务器删除课程信息id
        delTeacherInfoId: '',//传值给服务器删除教师信息id
        tableData: [],//服务器返回表格课程信息
        teacherTableData: [],//服务器返回表格教师信息
        originImgUrlfArray: [],//机构信息图片
        delArrayUrl: [],//待删除的机构信息图片
        saveClassImgUrlfArray: [],//课程信息图片地址
        classImgUrlfArray: [],//服务器返回课程信息图片地址
        teacherAvatarUrl: [],//教师信息图片地址
        teacherImgUrlfArray: [],//上传成功返回教师信息图片地址
        originLogoUrl: [],//关于我们信息图片地址
        delAboutUsArrayUrl: [],//待删除的机构信息图片
        saveAboutUsInfoBtn: true,
        dialogImageVisibleOrigin: false, // 是否显示机构信息图片组件对话框
        dialogImageVisibleClass: false,// 是否显示课程构信息图片组件对话框
        dialogImageVisibleTeacher: false,// 是否显示教师信息图片组件对话框
        dialogImageVisibleAboutUs: false,// 是否显示关于我们图片组件对话框
        info: false,//隐藏定位提示信息
        originAddress: '',//机构地址
        lat: '',//精度
        lng: '',//纬度
        map: null, // 地图对象
        saveOriginAdress: '',//定位的地址
        delTeacherDialogVisible: false,//显示teacherdilog弹出框
        delDialogTeacherContent: "",// 删除教师对话框中显示的内容
        delDialogVisible: false,//显示dilog弹出框
        delDialogContent: "", // 删除对话框中显示的内容
        isLoadingTeacherWithDel: false,// 删除教师确认对话框中确认按钮加载状态
        currentDelStudentIndex: 0, // 当前要删除课程信息index
        isLoadingWithDel: false, // 删除确认对话框中确认按钮加载状态
        uploadPictureAction: uploadFileUrl, // 上传图片action地址
        dialogImageUrl: "", // 上传图片组件中图片地址
        dialogVisible: false,// 是否显示图片组件对话框
        uploadPictureArray: [], // 上传图片由服务器返回的图片地址
        currentSelectTab: 'first',//显示第一个table页面
        ruleForm: {
          adress: '',
          phone: '',
          wechat: '',
          weibo: '',
          qq: '',
          name: '',
          courseDetail: '',
          teacherName: '',
          teacherDetail: '',
          teacherIntroduction: '',
          sex: '1',
          level: '初级教师',
          schoolName: '',
          schoolDescribed: '',
          picture: [], // 上传图片信息
          pictureList: [],
          courseTag: '',
          courseLevel: '初级课',
          facilityalue: null,
          aboutUsPictureList: [],
          classPictureList: ''
        },
        aboutUsRuleForm: {
          aboutSchoolName: '',
          schoolDescribed: ''
        },
        aboutUsRules: {
          aboutSchoolName: [
            {required: true, message: '请输入机构名称', trigger: 'blur'},
          ],
          schoolDescribed: [
            {required: true, message: '请输入相应信息', trigger: 'blur'},
          ]
        },
        // first 机构信息
        rules: {
          adress: [
            {required: true, message: '请输入机构地址', trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
          ],
          wechat: [
            {required: true, message: '请输入微信号', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          courseDetail: [
            {required: true, message: '请输入课程介绍', trigger: 'blur'},
          ],
          teacherName: [
            {required: true, message: '请输入教师名称', trigger: 'blur'},
          ],
          teacherDetail: [
            {required: true, message: '请输入教师标签', trigger: 'blur'},
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'},
          ],
          teacherIntroduction: [
            {required: true, message: '请输入教师简介', trigger: 'blur'},
          ],
          teacherImg: [
            {required: true, message: '请上传图片', trigger: 'blur'},
          ],
          level: [
            {required: true, message: '请选择教师等级', trigger: 'blur'},
          ],
          courseTag: [
            {required: true, message: '请输入标签', trigger: 'blur'},
          ],
          courseLevel: [
            {required: true, message: '请选择课程等级', trigger: 'blur'},
          ],
          facilityalue: [
            {required: true, message: '请选择教难易度', trigger: 'blur'},
          ],
          courseImg: [
            {required: true, message: '请上传图片', trigger: 'blur'},
          ],
          aboutSchoolName: [
            {required: true, message: '请输入机构名称', trigger: 'blur'},
          ],
          schoolDescribed: [
            {required: true, message: '请输入机构描述', trigger: 'blur'},
          ]

        },
        option: {
          img: '',
          size: 1,
          full: false, // 输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 206,
          autoCropHeight: 52,
          fixedBox: true
        },
        formLabelWidth: "120px",
        previews: {},
        currentAvatarImg: '',//当前头像
        avatarDialogVisible: false, // 是否显示头像对话框
        downImg: '#',
        isUpdateAvatarLoading: false, // 更新头像当前状态
        // currentAvatarImgBox:false,
      }
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      PubSub.publish("currentMenuIndex", "/eduinfo")
      let menuItem = storageUtil.getMenu().find(item=> item.url=='eduinfo')
      if(menuItem && menuItem.if_in==1){ // 有权限
          this.isAuth = true
          if (!this.map || this.map == null) {
              this.map = new AMap.Map('container', {
                  resizeEnable: true
              });
          }
          const loading = promptUtil.loading(this)
          getOrganUpdate(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
          })).then(res => {
              if (res.code == SUCCESS_CODE) {
                  if (res.data == '[]') {
                      // 根据当前地址定位
                      this.position()
                      this.searchPosition()
                      return
                  }
                  //关于我们赋值
                  this.aboutUsRuleForm.aboutSchoolName = res.data.school_name
                  this.aboutUsRuleForm.schoolDescribed = res.data.intro
                  if (res.data.logo && res.data.logo.length != 0) {
                      this.aboutUsRuleForm.aboutUsPictureList = res.data.logo
                      this.originLogoUrl.push(res.data.logo[0].url)
                  }
                  this.ruleForm.adress = res.data.address
                  this.ruleForm.phone = res.data.tel
                  this.ruleForm.wechat = res.data.wxnum
                  this.ruleForm.qq = res.data.qqnum
                  this.ruleForm.weibo = res.data.weibo
                  this.currentAvatarImg = res.data.logo_editor
                  this.ruleForm.pictureList = res.data.pics && res.data.pics != "" ? res.data.pics : [] //返回机构信息图片地址
                  this.ruleForm.classPictureList = res.data.class.pic //返回课程信息图片地址
                  for (var i = 0; i < res.data.pics.length; i++) {
                      this.originImgUrlfArray.push(res.data.pics[i].url);
                  }
                  // 从服务器取回的数据课程信息res.data.class赋值给this.tableData
                  if (res.data.class && res.data.class != "") {
                      for (var i = 0; i < res.data.class.length; i++) {
                          const obj = {
                              id: res.data.class[i].id,
                              name: res.data.class[i].class_name,
                              detail: res.data.class[i].intro,
                              avtar: res.data.class[i].pic,
                              tag: res.data.class[i].bq,
                              courseLevel: res.data.class[i].level,
                              facilityalue: res.data.class[i].easy,

                          }
                          this.tableData.push(obj)
                          this.classImgUrlfArray.push(res.data.class[i].pic);
                      }
                  }
                  // 从服务器取回的数据教师信息res.data.teacher赋值给this.tableTeacherData
                  if (res.data.teacher && res.data.teacher != "") {
                      for (var i = 0; i < res.data.teacher.length; i++) {
                          const obj = {
                              id: res.data.teacher[i].id,
                              name: res.data.teacher[i].real_name,
                              detail: res.data.teacher[i].intro,
                              avtar: res.data.teacher[i].pic,
                              teacherIntroduction: res.data.teacher[i].des,
                              sex: res.data.teacher[i].sex == 1 ? '男' : '女',
                              level: res.data.teacher[i].level
                          }
                          this.teacherTableData.push(obj)
                          this.teacherAvatarUrl.push(res.data.teacher[i].pic)
                      }
                  }
                  if (res.data.latitude && res.data.latitude != ""
                      && res.data.longitude && res.data.longitude != "") { // 需要地图按返回经纬度进行初始化
                      this.lng = res.data.latitude
                      this.lat = res.data.longitude
                      this.preciseSearch(res)
                      this.searchPosition()
                  } else {
                      this.searchPosition()
                  }
              } else {
                  promptUtil.wait(this)
              }
              loading.close()
          }).catch(error => {
              promptUtil.LOG("getOrganUpdate-err", error)
              loading.close()
          })
      }else{
          this.isAuth = false
      }
    },
    computed: {
      headers() {
        let token = storageUtil.readToken()
        return {
          'Authorization': token + "_" + (storageUtil.readTeacherInfo() ? storageUtil.readTeacherInfo().id : "0")
        }
      }
    },
    methods: {
      // 设置当前table索引
      handleClick(tab, event) {
        if (tab.name == "second" || tab.name == "third") {
          this.$refs.ruleForm.resetFields();
        }
      },
      // 删除上传的图片监听
      handlePictureRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 预览机构信息选中上传的图片
      handlePictureCardPreview(file) {
        if (this.currentSelectTab == 'first') {
          this.dialogImageUrl = file.url;
          this.dialogImageVisibleOrigin = true;
        } else if (this.currentSelectTab == 'second') {
          this.dialogImageUrl = file.url;
          this.dialogImageVisibleClass = true;
        } else if (this.currentSelectTab == 'third') {
          this.dialogImageUrl = file.url;
          this.dialogImageVisibleTeacher = true
        } else if (this.currentSelectTab == 'four') {
          this.dialogImageUrl = file.url;
          this.dialogImageVisibleAboutUs = true
        }
      },
      // 头像上传成功
      handleAvatarSuccess(res, file) {
        this.option.img = file.response //URL.createObjectURL(file.raw)
        // console.log("res", res)
        // console.log("file",)
        this.isShowCropper = true
        // console.log("handleAvatarSuccess", this.option.img)
      },
      // 上传图片之前监听
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/png" || file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message({
            message: "文件图片超过2MB，请重新选择文件",
            type: "error",
            duration: 1500
          });
        }
        if (!isJPG) {
          this.$message({
            message: "只能上传jpg/png文件，请重新选择文件",
            type: "error",
            duration: 1500
          });
        }
        if (isJPG && isLt2M) {
          this.ruleForm.picture.push(file.uid);
        }
        return isJPG && isLt2M;
      },
      // 上传图片监听函数
      handlePictureBeforeUpload(file) {
        const isJPG = file.type === "image/png" || file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message({
            message: "文件图片超过2MB，请重新选择文件",
            type: "error",
            duration: 1500
          });
        }
        if (!isJPG) {
          this.$message({
            message: "只能上传jpg/png文件，请重新选择文件",
            type: "error",
            duration: 1500
          });
        }
        if (isJPG && isLt2M) {
          this.ruleForm.picture.push(file.uid);
        }
        return isJPG && isLt2M;
        // console.log(file)
      },
      // 上传图片时
      handleRrogress(event, file, fileList) {
        this.saveAgencyInfoDisabled = true
        this.saveCourseInforDisabled = true
        this.saveTeacherInfoDisabled = true
        this.saveAboutUsInfoDisabled = true
      },
      // 上传图片成功回调
      handleSuccessUploadImage(response, file, fileList) {
        this.saveAgencyInfoDisabled = false
        this.saveCourseInforDisabled = false
        this.saveTeacherInfoDisabled = false
        this.saveAboutUsInfoDisabled = false
        if (this.currentSelectTab == 'first') {
          this.originImgUrlfArray.push(response)
          // console.log(" this.originImgUrlfArray", this.originImgUrlfArray)
        } else if (this.currentSelectTab == 'second') {
          this.saveClassImgUrlfArray = []
          this.saveClassImgUrlfArray.push(response)
        } else if (this.currentSelectTab == 'third') {
          this.teacherImgUrlfArray = []
          this.teacherImgUrlfArray.push(response)
        } else if (this.currentSelectTab == 'four') {
          this.originLogoUrl = []
          this.originLogoUrl.push(response);
          // console.log('originLogoUrl', this.originLogoUrl)
        } else {
          promptUtil.warning(this, '上传失败')
        }
      },
      //上传文件失败回调
      handleErrorUpload(err, file, fileList) {
        promptUtil.wait(this);
      },
      //删除文件回调
      handlePictureRemove(file, fileList) {
        if (this.currentSelectTab == 'first') {
          //1.获取要删除的url
          const delUrl = file.url
          //2.将获取的url加入到待删除url数组中
          this.delArrayUrl.push(delUrl)
          //3.将要删除的url从originImgUrlArray中删除掉
          this.originImgUrlfArray.splice(
            this.originImgUrlfArray.findIndex(item => item === file.url),
            1
          )
        } else if (this.currentSelectTab == 'second') {
          this.saveClassImgUrlfArray.splice(
            this.saveClassImgUrlfArray.findIndex(item => item === file.url),
            1
          )
        } else if (this.currentSelectTab == 'third') {
          this.teacherAvatarUrl.splice(
            this.teacherAvatarUrl.findIndex(item => item === file.url),
            1
          )
        } else if (this.currentSelectTab == 'four') {
          const delUrl = file.url
          this.delAboutUsArrayUrl.push(delUrl)
          this.originLogoUrl.splice(
            this.originLogoUrl.findIndex(item => item === file.url),
            1
          )

        }

      },
      //保存机构信息
      saveAgencyInfo() {
        // console.log('待删除',this.delArrayUrl)

        let phoneValdate = /^[1][3,4,5,7,8][0-9]{9}$/;
        let telValdate = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if (this.ruleForm.phone && parseInt(this.ruleForm.phone.substr(0, 1)) != 0 && this.ruleForm.phone.length == 11) {
          if (!phoneValdate.test(this.ruleForm.phone)) {
            promptUtil.warning(this, "手机格式不正确");
            return;
          }
        } else {
          if (!telValdate.test(this.ruleForm.phone)) {
            promptUtil.warning(this, "固话格式不正确");
            return;
          }

        }
        if (this.ruleForm.phone === "") {
          promptUtil.warning(this, "请填写必要信息");
          return;
        }

        // console.log('success',JSON.stringify(this.ruleForm.pictureList))
        // picture: JSON.stringify(this.ruleForm.pictureList)
        organUpdate(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            address: this.ruleForm.adress,
            tel: this.ruleForm.phone,
            wxnum: this.ruleForm.wechat,
            qqnum: this.ruleForm.qq,
            weibo: this.ruleForm.weibo,
            longitude: this.lat,
            latitude: this.lng,
            pics: this.originImgUrlfArray == 0 ? "" : JSON.stringify(this.originImgUrlfArray),
          })
        ).then(res => {
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, res.msg);
            if (this.delArrayUrl.length !== 0) {
              for (var i = 0; i < this.delArrayUrl.length; i++) {
                delUploadFileByUrl(qs.stringify({url: this.delArrayUrl[i].substring(55)})).then(res => {
                })
              }
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this)
          }
        }).catch(error => {
          promptUtil.LOG('organUpdate-err', error);
        })
      },

      //保存课程信息
      saveCourseInfor(formName) {
        if (this.tableData.length > 3) {
          promptUtil.warning(this, "最多仅能添加四门课程");
          this.resetCourseInformation()
          return;
        }
        if (this.ruleForm.name.trim() == "" || this.ruleForm.courseDetail.trim() == ""
          || this.ruleForm.courseTag.trim() == "" || this.ruleForm.courseLevel == "" || this.ruleForm.facilityalue == 0) {
          promptUtil.warning(this, "请填写必要信息");
          return;
        }
        if (this.saveClassImgUrlfArray.length == 0) {
          promptUtil.warning(this, "请上传图片");
          return;
        }
        classUpdate(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            class_name: this.ruleForm.name.trim(),
            intro: this.ruleForm.courseDetail.trim(),
            pic: this.saveClassImgUrlfArray.length == 0 ? "" : JSON.stringify(this.saveClassImgUrlfArray),
            bq: this.ruleForm.courseTag.trim(),
            level: this.ruleForm.courseLevel,
            easy: this.ruleForm.facilityalue,
          })
        ).then(res => {
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, res.msg);
            //保存信息成功后清空表单以及图片
            this.resetCourseInformation()
            //保存信息成功后 添加的数据 渲染在表格中
            getOrganUpdate(qs.stringify({
              school_id: storageUtil.readTeacherInfo().school_id,
            })).then(res => {
              this.tableData = []
              for (var i = 0; i < res.data.class.length; i++) {
                const obj = {
                  id: res.data.class[i].id,
                  name: res.data.class[i].class_name,
                  detail: res.data.class[i].intro,
                  avtar: res.data.class[i].pic,
                  tag: res.data.class[i].bq,
                  courseLevel: res.data.class[i].level,
                  facilityalue: res.data.class[i].easy,

                }
                this.tableData.push(obj)
                this.classImgUrlfArray.push(res.data.class[i].pic);
              }
            }).catch(error => {
              promptUtil.LOG("getOrganUpdate-err", error);
            })

          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this)
          }
        }).catch(error => {
          promptUtil.LOG('classUpdate-err', error);
        })
      },
      //课程信息
      // 显示删课程信息对话框
      showCourseInfor(index, row) {
        this.currentDelClassIndex = index
        this.delClassInfoId = row.id
        this.delDialogVisible = true;
        this.delDialogContent = "您确定要删除 【 " + row.name + " 】 吗？";
      },
      // 删除课程信息应函数
      handleDelCourseInfo() {
        const loading = promptUtil.loading(this)
        // console.log('obj66666',row)
        delClassUpdate(qs.stringify({
          id: this.delClassInfoId,
          user_id: storageUtil.readTeacherInfo().id
        })).then(res => {
          loading.close()
          if (res.code == SUCCESS_CODE) {
            this.tableData.splice(this.currentDelClassIndex, 1);
            promptUtil.success(this, res.msg)
          } else if (res.code == ERROR_CODE) {
            promptUtil.wait(this)
          }
        }).catch(error => {
          loading.close()
          promptUtil.LOG('delClassUpdate-err', error)
        })
        this.isLoadingWithDel = false;
        this.delDialogVisible = false;
      },
      //保存教师信息
      saveTeacherInfo(formName) {
        // console.log("this.teacherImgUrlfArray",this.teacherImgUrlfArray)
        // return
        if (this.teacherTableData.length > 3) {
          promptUtil.warning(this, "仅能添加四名教师");
          this.resetTeacherInformation()
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (this.ruleForm.teacherName == "" || this.ruleForm.teacherDetail == "" || this.ruleForm.teacherIntroduction == "") {
            promptUtil.warning(this, "请填写相应信息")
            return
          }
          if (this.teacherImgUrlfArray.length == 0) {
            promptUtil.warning(this, "请上传图片")
            return
          }
          saveTeacherInformation(qs.stringify({
            school_id: storageUtil.readTeacherInfo().school_id,
            user_id: storageUtil.readTeacherInfo().id,
            real_name: this.ruleForm.teacherName.trim(),
            intro: this.ruleForm.teacherDetail.trim(),
            // pic: this.teacherAvatarUrl.length == 0 ? "" : JSON.stringify(this.teacherAvatarUrl),
            pic: this.teacherImgUrlfArray.length == 0 ? "" : JSON.stringify(this.teacherImgUrlfArray),
            sex: this.ruleForm.sex,
            des: this.ruleForm.teacherIntroduction.trim(),
            level: this.ruleForm.level
          })).then(res => {
            if (res.code == SUCCESS_CODE) {
              promptUtil.success(this, res.msg);
              //保存后清空教师表单信息
              this.resetTeacherInformation()
              this.teacherAvatarUrl = []
              this.teacherImgUrlfArray = []
              //保存信息成功后 添加的数据 渲染在表格中
              getOrganUpdate(qs.stringify({
                school_id: storageUtil.readTeacherInfo().school_id,
              })).then(res => {
                // console.log('array',res)
                this.teacherTableData = []
                for (var i = 0; i < res.data.teacher.length; i++) {
                  const obj = {
                    id: res.data.teacher[i].id,
                    name: res.data.teacher[i].real_name,
                    detail: res.data.teacher[i].intro,
                    avtar: res.data.teacher[i].pic,
                    teacherIntroduction: res.data.teacher[i].des,
                    sex: res.data.teacher[i].sex == 1 ? '男' : '女',
                    level: res.data.teacher[i].level
                  }
                  this.teacherTableData.push(obj)
                  this.teacherAvatarUrl.push(res.data.teacher[i].pic);
                }
              }).catch(error => {
                promptUtil.LOG('getOrganUpdate-err', error);
              })
            } else if (res.code == ERROR_CODE) {
              promptUtil.error(this, res.msg);
            } else {
              promptUtil.wait(this)
            }
          }).catch(error => {
            promptUtil.LOG('saveTeacherInformation-err', error);
          })

        });
      },

      //教师信息
      // 显示删课程信息对话框
      showTeacherInfor(index, row) {
        this.currentDelTeacherIndex = index
        this.delTeacherInfoId = row.id
        // console.log(index, row);
        this.delTeacherDialogVisible = true;
        this.delDialogTeacherContent = "您确定要删除 【 " + row.name + " 】 吗？";
      },
      // 删除教师信息应函数
      handleDelTeacherInfort() {
        const loading = promptUtil.loading(this)
        delTeacherUpdate(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          id: this.delTeacherInfoId,
          user_id: storageUtil.readTeacherInfo().id
        })).then(res => {
          loading.close()
          if (res.code == SUCCESS_CODE) {
            this.teacherTableData.splice(this.currentDelTeacherIndex, 1);
            promptUtil.success(this, res.msg)
          } else if (res.code == ERROR_CODE) {
            promptUtil.wait(this)
          }
        }).catch(error => {
          loading.close()
          promptUtil.LOG('delTeacherUpdate-err', error)
        })
        this.delTeacherDialogVisible = false;
      },

      //保存关于我们信息
      saveAboutUsInfo() {
        if (!this.aboutUsRuleForm.aboutSchoolName || this.aboutUsRuleForm.aboutSchoolName.trim() == "") {
          promptUtil.warning(this, "请填写必要信息");
          return;
        }
        if (!this.aboutUsRuleForm.schoolDescribed || this.aboutUsRuleForm.schoolDescribed.trim() == "") {
          promptUtil.warning(this, "请填写必要信息");
          return;
        }
        saveAboutUsInformation(qs.stringify({
          school_id: storageUtil.readTeacherInfo().school_id,
          user_id: storageUtil.readTeacherInfo().id,
          school_name: this.aboutUsRuleForm.aboutSchoolName.trim(),
          intro: this.aboutUsRuleForm.schoolDescribed.trim(),
          logo_editor: this.currentAvatarImg,
          logo: this.originLogoUrl.length == 0 ? "" : JSON.stringify(this.originLogoUrl),
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            promptUtil.success(this, res.msg);
            //修改机构名称
            const teacherInfo = storageUtil.readTeacherInfo()
            teacherInfo.school_name = this.aboutUsRuleForm.aboutSchoolName
            teacherInfo.logo_editor = this.currentAvatarImg // 机构scratch3.0logo
            storageUtil.saveTeacherInfo(teacherInfo)
            this.$store.dispatch("updateSchoolName", this.aboutUsRuleForm.aboutSchoolName); // 触发消息action调用
            if (this.delAboutUsArrayUrl.length !== 0) {
              delUploadFileByUrl(qs.stringify({url: this.delAboutUsArrayUrl[0].substring(55)})).then(res => {
                // console.log('delUploadFileByUrl', res)
              })
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg);
          } else {
            promptUtil.wait(this)
          }
        }).catch(error => {
          promptUtil.error(this)
        })
      },
      //保存后重置课程信息表单
      resetCourseInformation() {
        this.$refs.ruleForm.resetFields();
        this.ruleForm.name = ""
        this.ruleForm.courseDetail = ""
        this.$refs.delClassUpload.clearFiles()
        this.classImgUrlfArray = []
        this.ruleForm.courseTag = ""
        this.ruleForm.courseLevel = "初级课"
        this.ruleForm.facilityalue = null
      },
      //保存后重置教师表单信息
      resetTeacherInformation() {
        this.$refs.ruleForm.resetFields();
        this.ruleForm.teacherName = ""
        this.ruleForm.teacherDetail = ""
        this.teacherAvatarUrl = []
        this.$refs.delTeacherUpload.clearFiles()
        this.ruleForm.teacherIntroduction = ""
        this.ruleForm.sex = "1"
        this.ruleForm.level = "初级教师"
      },
      // 进准地图查询
      preciseSearch(res) {
        const marker = new AMap.Marker();
        this.map.add(marker);
        marker.setPosition(new AMap.LngLat(res.data.latitude, res.data.longitude)) // 参数1=》lng 参数2=》lat
        this.map.setFitView(marker);
      },
      //定位地图
      position() {
        const _that = this
        AMap.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
            buttonPosition: 'RB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
          });
          _that.map.addControl(geolocation);
          geolocation.getCurrentPosition(function (status, result) {
            if (status == 'complete') {
              onComplete(result)
            } else {
              onError(result)
            }
          });
        });

        //解析定位结果
        function onComplete(data) {
          // console.log('successdata', data)
          _that.lat = data.position.lat
          _that.lng = data.position.lng
          _that.saveOriginAdress = data.formattedAddress
          document.getElementById('status').innerHTML = '定位成功'
          var str = [];
          str.push('定位结果：' + data.position);
          str.push('定位类别：' + data.location_type);
          if (data.accuracy) {
            str.push('精度：' + data.accuracy + ' 米');
          }//如为IP精确定位结果则没有精度信息
          str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
          document.getElementById('result').innerHTML = str.join('<br>');
        }

        //解析定位错误信息
        function onError(data) {
          // console.log("errorData", data)
          document.getElementById('status').innerHTML = '定位失败'
          document.getElementById('result').innerHTML = '失败原因排查信息:' + data.message;
        }

      },
      searchPosition() {
        const _that = this
        var autoOptions = {
          input: "tipinput"
        };
        var auto = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
          map: this.map
        });  //构造地点查询类
        AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          _that.lat = e.poi.location.lat
          _that.lng = e.poi.location.lng
          // _that.originAddress=e.poi.district +'-'+ e.poi.address
          if (!e.poi.address) {
            _that.ruleForm.adress = e.poi.district + e.poi.address + e.poi.name
          } else {
            _that.ruleForm.adress = e.poi.district + e.poi.name
          }
          placeSearch.setCity(e.poi.adcode)
          placeSearch.search(e.poi.name)  //关键字查询查询
        }
      },

      //上传封面图--------------------------------------------
      // 实时预览函数
      realTime(data) {
        if (!this.option.img) {
          this.option.img = this.currentAvatarImg //this.$store.state.userAvatar
        }
        this.previews = data
      },
      imgLoad(msg) {
        promptUtil.LOG("imgLoad", msg)
        if (msg == 'error') {
          this.avatarDialogVisible = false
        }
      },
      // 改变图片大小
      changeScale(num) {
        num = num || 1
        this.$refs.origin_cropper.changeScale(num)
      },
      // 向左旋转
      rotateLeft() {
        this.$refs.origin_cropper.rotateLeft()
      },
      // 向右旋转
      rotateRight() {
        this.$refs.origin_cropper.rotateRight()
      },
      uploadImg(e, num) {
        //上传图片
        // this.option.img
        let file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        const reader = new FileReader()
        reader.onload = e => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          }
        }
        // 转化为base64
        reader.readAsDataURL(file)
        // 转化为blob
        // reader.readAsArrayBuffer(file)
      },
      down(type) {
        // event.preventDefault()
        if (type === 'blob') {
          let aLink = document.createElement('a')
          aLink.download = 'author-img'
          this.$refs.origin_cropper.getCropBlob(data => {
            this.downImg = window.URL.createObjectURL(data)
            //            aLink.download = this.downImg;
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else { // base64
          this.$refs.origin_cropper.getCropData(data => {
            this.downImg = data
            this.isUpdateAvatarLoading = true
            uploadOriginBase64(qs.stringify({
              file: this.downImg,
              user_id: storageUtil.readTeacherInfo().id
            })).then(res => {
              if (res.code == SUCCESS_CODE) {
                promptUtil.success(this, '修改成功')
                this.currentAvatarImg = res.data.url
              } else {
                promptUtil.error(this, '修改失败')
              }
              this.isUpdateAvatarLoading = false
              this.avatarDialogVisible = false
            }).catch(err => {
              this.isUpdateAvatarLoading = false
              promptUtil.LOG("uploadBase64-err", err)
            })
            // aLink.href = data
            // aLink.click()
            // 将头像图片数据发送给后台
          })
        }
      },

    }
  }
</script>

<style scoped>

  #container {
    height: 500px;
  }

  .info {
    width: 26rem;
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

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .el-formBox {
    width: 50%;

    /* background-color: #eee; */
    /* box-shadow: 2px 2px 8px #eee;*/
    border-radius: 10px;
    color: #606266;
    margin-right: 10px;
    font-size: 16px;
    margin-top: 30px;
    /*margin: 80px auto;*/
  }

  .el-input {
    width: 100%;
  }

  .line {
    border-bottom: 1px solid #eee;
    margin-top: 30px;
  }

  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .info {
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border-radius: .25rem;
    /* position: fixed; */
    top: 1rem;
    position: absolute !important;
    background-color: white;
    min-width: 22rem;
    border-width: 0;
    right: 1rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  }

  #myPageTop {
    position: absolute;
    top: 3px;
    right: 20px;
  }

  .el-formBox_top {
    /*margin-top: 500px;*/
  }

  /*开始*/
  .el-avatar--circle {
    border-radius: 5% !important;
  }

  .el-avatar {
    width: 208px !important;
    height: 54px !important;
    border: 1px solid #eee;
    background-color: #e9e9e9 !important;
    /*opacity: 0.5;*/
  }

  .cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }

  .cropper {
    width: 350px;
    height: 300px;
  }

  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .preview {
    overflow: hidden;
    /*border-radius: 50%;*/
    /*border: 1px solid #cccccc;*/
    background: #cccccc;
    margin-left: 40px;
  }

  .footer-btn {
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }

  .scope-btn {
    width: 350px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
  }

  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 10px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
</style>
