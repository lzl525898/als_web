<template>
  <div>
    <div class="bgTitle">
      <img src="../../../../static/images/base/mobileDialog/bgHeader.png" alt="" style="width: 100%;height: 100%">
      <div class="customButton" @click="customButton">立即申请</div>
    </div>
    <div class="contentBg">
      <div class="content">
        <!--      机构信息-->
        <div v-if="picArray&&picArray.length!=0">
          <div class="title">
            <img src="../../../../static/images/base/mobileDialog/title.png" alt="" style="width: 100%;height: 100%">
            <span class="titleLeft">机构信息</span>
            <span class="titleRight">敬请期待</span>
          </div>
          <!--      轮播-->
          <div class="block">
            <el-carousel height="150px">
              <el-carousel-item v-for="item in picArray" :key="item">
                <img :src=item alt="" style="width: 100%;height: 100%">
                <!--                <h3 class="small">{{ item }}</h3>-->
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <!--      课程展示-->
        <div class="courseInformation" v-if="showCourse&&showCourse.length!=0&&showCourse.length!=null">
          <div class="title">
            <img src="../../../../static/images/base/mobileDialog/title.png" alt="" style="width: 100%;height: 100%">
            <span class="titleLeft" style="color:#7eff00">课程展示</span>
            <span class="titleRight" style="cursor:pointer;" @click="seeMoreCourse">查看更多</span>
          </div>
          <div class="courseItem" v-for="(item,index) in showCourse">
            <div class="courseItemImgBox">
              <img :src=item.url alt="">
            </div>
            <div class="courseItemdesc">
              <div class="courseItemdescFont">
                <p>{{item.title}}</p>
                <div class="block">
                  <el-rate v-model=item.rate :disabled="true"></el-rate>
                </div>
                <p>{{item.tag}}</p>
                <div class="courseFontBox">
                  <span style="font-size:12px;">{{item.desc}}</span>
                </div>
                <div v-if="item.level=='初级课'">
                  <div class="courseBtn">{{item.level}}</div>
                </div>
                <div v-if="item.level=='中级课'">
                  <div class="courseBtn" style="background-color:#ff9204">{{item.level}}
                  </div>
                </div>
                <div v-if="item.level=='高级课'">
                  <div class="courseBtn" style="background-color:#ff0000">{{item.level}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--      名师风采-->
        <div class="teacherInformation" v-if="showTeacher&&showTeacher.length!=0&&showTeacher.length!=null">
          <div class="title">
            <img src="../../../../static/images/base/mobileDialog/title.png" alt="" style="width: 100%;height: 100%">
            <span class="titleLeft" style="color:#7eff00">名师风采</span>
            <span class="titleRight" style="cursor:pointer;" @click="seeMoreTeacher">查看更多</span>
          </div>
          <div class="teacherItem" v-for="item in showTeacher">
            <div class="itemBg">
              <div class="itemImgBox" v-if="item.sex=='女'" style="border: 5px solid #f8b551;">
                <img :src=item.url alt="">
              </div>
              <div class="itemImgBox" v-if="item.sex=='男'">
                <img :src=item.url alt="" style="border: 5px solid #0098e6">
              </div>
            </div>
            <div class="teacherDesc">
              <p>教师名称&nbsp&nbsp{{item.name}}</p>
              <p>性别&nbsp&nbsp{{item.sex}}</p>
              <p>教师标签&nbsp&nbsp{{item.tag}}</p>
              <!--              <div class="block" style="margin-top: -5px">-->
              <!--                <el-rate v-model=item.rate></el-rate>-->
              <!--              </div>-->
              <div class="block" style="margin-top: -5px">
                <el-rate v-model="item.rate" :disabled="true"></el-rate>
              </div>
              <div class="teacherDescButton" @click="teacherDescButton(item.id)">教师简介</div>
            </div>
          </div>
        </div>
        <!--      关于我们-->
        <div class="aboutUsInformation">
          <div class="title">
            <img src="../../../../static/images/base/mobileDialog/title.png" alt="" style="width: 100%;height: 100%">
            <span class="titleLeft" style="color:#7eff00">关于我们</span>
            <span class="titleRight">敬请期待</span>
          </div>
          <div v-if="schoolInformation.schoolName!=''">
            <div class="organName">
              <p class="organNameLine">机构名称<span class="marginLeft">Organization name</span></p>
              <p style="font-size: 14px;font-weight: bold;">{{schoolInformation.schoolName}}</p>
            </div>
          </div>
          <div v-if="schoolInformation.intro!=null">
            <div class="organName">
              <p class="organNameLine">机构简介<span class="marginLeft">Brief introduction of Organization</span></p>
              <p style="font-size: 12px;font-weight: bold;color: #333">{{schoolInformation.intro}}</p>
            </div>
          </div>
          <div class="organName">
            <p class="organNameLine">机构地址<span class="marginLeft">Organization address</span></p>
            <!--           地图-->
            <div id='container' style="width: 100%;height: 300px"></div>
            <div class="info" v-show="info">
              <h4 id='status'></h4>
              <hr>
              <p id='result'></p>
              <hr>
              <p>由于众多浏览器已不再支持非安全域的定位请求，为保位成功率和精度，请升级您的站点到HTTPS。</p>
            </div>

          </div>
          <div class="organName" v-if="schoolInformation.address!=''">
            <p class="organNameLine">地址信息<span class="marginLeft">Address information</span></p>
            <p style="font-size: 12px;font-weight: bold;color: #333">{{schoolInformation.address}}</p>
          </div>
          <div class="organName" v-if="schoolInformation.tel!=''">
            <p class="organNameLine">联系电话<span class="marginLeft">Contact number</span></p>
            <p style="font-size: 12px;font-weight: bold;color: #333">{{schoolInformation.tel}}</p>
          </div>

        </div>
        <div class="bottomCustomButton" @click="customButton">立即申请</div>
      </div>
    </div>
    <!--     教师简介dialog-->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      append-to-body
      :before-close="handleClose">
      <div class="teacherItemDialog" v-for="item in showTeacherDialog">
        <div class="itemBgDialog">
          <div class="itemImgBoxDialog" v-if="item.sex=='女'" style="border: 5px solid #f8b551;">
            <div style="display: block;width: 100%;height: 100%">
              <img :src=item.url alt="">
            </div>
          </div>
          <div class="itemImgBoxDialog" v-if="item.sex=='男'">
            <div style="display: block;width: 100%;height: 100%">
              <img :src=item.url alt="" style="border: 5px solid #0098e6">
            </div>
          </div>
        </div>
        <div class="teacherDescDialog">
          <p>教师名称&nbsp&nbsp{{item.name}}</p>
          <p>性别&nbsp&nbsp{{item.sex}}</p>
          <p>教师标签&nbsp&nbsp{{item.tag}}</p>
          <div class="block" style="margin-top: -5px">
            <el-rate v-model="item.rate" :disabled="true"></el-rate>
          </div>
        </div>
        <p style="font-weight: bold">教师简介</p>
        <p style="font-size: 12px;margin-bottom: 20px">{{item.descript}}</p>
      </div>
    </el-dialog>
    <!--    立即申请dialog-->
    <el-dialog
      class="dialogBox"
      style="margin-top:5vh;padding: 0px !important;"
      :visible.sync="applaydialogVisible"
      :width="dialogWidth"
      :before-close="handleClose"
      append-to-body>
      <div class="bg" style="padding-top: 20px">
        <div class="roundBg">
          <div>
            <el-form :model="consultForm" :rules="consultRules" ref="consultForm" size="small"
                     style="padding: 20px;">
              <el-form-item label="学员姓名" prop="name" :label-width="formLabelWidth">
                <el-input v-model="consultForm.name" autocomplete="off" placeholder="请输入学员名称"
                          :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="学员电话" prop="phone1" :label-width="formLabelWidth">
                <el-input v-model="consultForm.phone1" autocomplete="off" placeholder="请输入学员电话"
                          :disabled="disabled"></el-input>
              </el-form-item>
              <!--                </el-col>-->
              <!--                <el-col :span="8">-->
              <!--                  <div>-->
              <!--                    <el-upload-->
              <!--                      :disabled="disabled"-->
              <!--                      class="avatar-uploader"-->
              <!--                      :action="postUrl"-->
              <!--                      :show-file-list="false"-->
              <!--                      :on-success="handleAvatarSuccess"-->
              <!--                      :before-upload="beforeAvatarUpload">-->
              <!--                      <img v-if="consultForm.avatarUrl" :src="consultForm.avatarUrl" class="avatar">-->
              <!--                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
              <!--                    </el-upload>-->
              <!--                  </div>-->
              <!--                </el-col>-->

              <div v-for="(item,index) in showForm" :key="index">
                <div v-if="item&&item=='性别'">
                  <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-radio v-model="consultForm.sex" label="1" :disabled="disabled">男</el-radio>
                    <el-radio v-model="consultForm.sex" label="2" :disabled="disabled">女</el-radio>
                  </el-form-item>
                </div>
                <div v-if="item&&item=='家长姓名'">
                  <el-form-item label="家长姓名" :label-width="formLabelWidth">
                    <el-input v-model="consultForm.parent" autocomplete="off" placeholder="请输入家长姓名"
                              :disabled="disabled"></el-input>
                  </el-form-item>
                </div>
                <div v-if="item&&item=='备用电话'">
                  <el-form-item label="备用电话" prop="phone2" :label-width="formLabelWidth">
                    <el-input v-model="consultForm.phone2" autocomplete="off" placeholder="请输入备用电话"
                              :disabled="disabled"></el-input>
                  </el-form-item>
                </div>
                <div v-if="item&&item=='学校'">
                  <el-form-item label="学校" :label-width="formLabelWidth" prop="school">
                    <el-input v-model="consultForm.school" autocomplete="off" placeholder="请输入所在学校"
                              :disabled="disabled"></el-input>
                  </el-form-item>
                </div>
                <div v-if="item&&item=='年级班级'">
                  <el-form-item label="年级班级" :label-width="formLabelWidth">
                    <el-input v-model="consultForm.class" autocomplete="off" placeholder="请输入班级年级"
                              :disabled="disabled"></el-input>
                  </el-form-item>
                </div>
                <div v-if="item&&item=='生日'">
                  <el-form-item label="生日" :label-width="formLabelWidth">
                    <el-date-picker v-model="consultForm.birth" type="date" placeholder="请选择出生日期" style="width: 97%"
                                    :disabled="disabled">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div v-if="item&&item=='来源'">
                  <el-form-item label="来源" :label-width="formLabelWidth">
                    <el-select v-model="consultForm.source" placeholder="请选择学员来源" style="width: 97%"
                               :disabled="disabled">
                      <el-option label="地推采单" value="地推采单"></el-option>
                      <el-option label="门店到访" value="门店到访"></el-option>
                      <el-option label="转介绍" value="转介绍"></el-option>
                      <el-option label="活动转化" value="活动转化"></el-option>
                      <el-option label="网络推广" value="网络推广"></el-option>
                      <el-option label="其他" value="其他"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div v-if="item&&item=='意向程度'">
                  <el-form-item label="意向程度" :label-width="formLabelWidth">
                    <el-select v-model="consultForm.extent" placeholder="请选择意向程度" style="width: 97%"
                               :disabled="disabled">
                      <el-option label="高" value="3"></el-option>
                      <el-option label="中" value="2"></el-option>
                      <el-option label="低" value="1"></el-option>
                      <el-option label="不确定" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="consultForm.desc" placeholder="请输入备注"
                          style="width: 97%" :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item>
                <div style="display: flex;justify-content: center;margin-top: 20px">
                  <el-button @click="applaydialogVisible = false" size="small" :disabled="disabled">取 消</el-button>
                  <el-button type="primary" @click="onAddItemSubmit('consultForm')" size="small" :disabled="disabled">确
                    定
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>

    <!--    查看更多课程dialog-->
    <el-dialog
      title="课程展示"
      :visible.sync="seeMoreCoursedialogVisible"
      :width="dialogWidth"
      :before-close="handleClose"
      append-to-body
    >
      <div style="height: 500px !important;overflow-y: scroll !important;">
        <div class="courseItem" v-for="(item,index) in showAllCourse">
          <div class="courseItemImgBox">
            <img :src=item.url alt="">
          </div>
          <div class="courseItemdesc">
            <div class="courseItemdescFont">
              <p>{{item.title}}</p>
              <div class="block">
                <el-rate v-model=item.rate :disabled="true"></el-rate>
              </div>
              <p>{{item.tag}}</p>
              <div class="courseFontBox">
                <span style="font-size:12px;">{{item.desc}}</span>
              </div>
              <div v-if="item.level=='初级课'" style="margin-bottom: 10px">
                <div class="courseBtn">{{item.level}}</div>
              </div>
              <div v-if="item.level=='中级课'" style="margin-bottom: 10px">
                <div class="courseBtn" style="background-color:#ff9204">{{item.level}}
                </div>
              </div>
              <div v-if="item.level=='高级课'" style="margin-bottom: 10px">
                <div class="courseBtn" style="background-color:#ff0000">{{item.level}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--    查看更多教师dialog-->
    <el-dialog
      title="教师展示"
      :visible.sync="seeMoreTeacherdialogVisible"
      :width="dialogWidth"
      :before-close="handleClose"
      append-to-body
    >
      <div style="height: 500px !important;overflow-y: scroll !important;">
        <div class="teacherItem" v-for="item in showAllTeacher">
          <div class="itemBg">
            <div class="itemImgBox" v-if="item.sex=='女'" style="border: 5px solid #f8b551;">
              <img :src=item.url alt="">
            </div>
            <div class="itemImgBox" v-if="item.sex=='男'">
              <img :src=item.url alt="" style="border: 5px solid #0098e6">
            </div>
          </div>
          <div class="teacherDesc" style="right: 8px !important;top: 7px !important;">
            <p>教师名称&nbsp&nbsp{{item.name}}</p>
            <p>性别&nbsp&nbsp{{item.sex}}</p>
            <p>教师标签&nbsp&nbsp{{item.tag}}</p>
            <!--              <div class="block" style="margin-top: -5px">-->
            <!--                <el-rate v-model=item.rate></el-rate>-->
            <!--              </div>-->
            <div class="block" style="margin-top: -5px">
              <el-rate v-model="item.rate" :disabled="true"></el-rate>
            </div>
            <div class="teacherDescButton" @click="teacherDescButton(item.id)" style="cursor: pointer !important;">
              教师简介
            </div>
          </div>
        </div>
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

  const moment = require("moment")
  import {
    qs,
    uploadAvatarUrl,
    getCollectionFormInformation,
    submitCollectionForm
  } from '../../../api/api'

  export default {
    data() {
      return {
        dialogWidth: '',
        value1: null,
        showCourse: [],
        showAllCourse: [],
        showTeacher: [],
        showAllTeacher: [],
        showTeacherDialog: [],
        dialogVisible: false,
        applaydialogVisible: false,
        //表单dialog
        consultForm: {//表单
          name: '',
          sex: '',
          avatarUrl: '',
          class: "",
          birth: '',
          phone1: '', // 学员电话
          phone2: '', // 备用电话
          school: '',
          parent: '',
          source: '', // 1地推采单  2门店到访  3转介绍  4活动转化  5网络推广  0其他
          extent: '', // 1高2中3低0不明确、
          desc: '' // 备注
        },
        consultRules: {
          name: [
            {required: true, message: '请输入学员姓名', trigger: 'blur'},
            {min: 2, max: 5, message: '长度在 2 到 5 个字符'}
          ],
          phone1: [
            {required: true, message: '请输入正确的手机号'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号'}
          ],
          phone2: [
            {required: false, message: '请输入正确的手机号'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号'}
          ],
        },
        schoolInformation: {
          schoolName: "",
          tel: "",
          address: "",
          intro: ""
        },
        showForm: [],
        formLabelWidth: '80px',
        postUrl: uploadAvatarUrl, // 提交头像的url
        //定位
        map: null, // 地图对象
        lat: '',//精度
        lng: '',//纬度
        saveOriginAdress: '',//定位的地址
        info: false,
        collectionId: '',
        picArray: [],
        disabled: false,
        seeMoreCoursedialogVisible: false,
        seeMoreTeacherdialogVisible: false,
      }
    },
    mounted() {
      // 手机端进入页面
      this.dialogWidth = '90%'
      var str = window.location.href;
      var index = str.lastIndexOf("/");
      this.collectionId = str.substring(index + 1, str.length);
      this.getCodeTableList()
      // this.map = new AMap.Map('container', {
      //     resizeEnable: true
      // });
      if (!this.map || this.map == null) {
        this.map = new AMap.Map('container', {
          resizeEnable: true
        });

      }
      this.position()

    },
    // updated() {
    //   console.log("courseItemdesc",$(".courseItemdesc"))
    //   let height=$(".courseItemdesc").height()+'px'
    //   console.log("height",height)
    //   $(".courseItemImgBox>img").css({"height":height})
    // },
    methods: {
      start(obj) {
        var url = obj.seeData.address
        var index = url.lastIndexOf("\/");
        this.collectionId = url.substring(index + 1, url.length);
        this.dialogWidth = '400px'
        this.getCodeTableList()
        this.disabled = true
      },
      getCodeTableList() {
        getCollectionFormInformation(qs.stringify({
          id: this.collectionId,
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data != '[]') {
              this.showCourse = []
              this.showTeacher = []
              this.showAllTeacher = []
              if (res.data.show_course && res.data.show_course.length != 0 && res.data.show_course.length >= 2) {
                this.showCourse.push(res.data.show_course[0])
                this.showCourse.push(res.data.show_course[1])
              } else {
                this.showCourse = res.data.show_course
              }
              if (res.data.show_course && res.data.show_course.length != 0) {
                this.showAllCourse = res.data.show_course
              }
              if (res.data.show_teacher && res.data.show_teacher.length != 0) {
                res.data.show_teacher.forEach(item => {
                  const obj = {
                    desc: item.desc,
                    id: item.id,
                    name: item.name,
                    rate: item.rate == "初级教师" ? 2 : item.rate == "中级教师" ? 3 : 5,
                    sex: item.sex,
                    tag: item.tag,
                    url: item.url,
                  }
                  this.showAllTeacher.push(obj)
                })
                if (this.showAllTeacher.length != 0 || this.showAllTeacher.length > 2) {
                  if (this.showAllTeacher.length == 1) {
                    this.showTeacher.push(this.showAllTeacher[0])
                  } else {
                    this.showTeacher.push(this.showAllTeacher[0])
                    this.showTeacher.push(this.showAllTeacher[1])
                  }
                }
              }
              this.picArray = res.data.pics
              this.showForm = res.data.form
              this.schoolInformation = {
                schoolName: res.data.school_name,
                tel: res.data.tel,
                address: res.data.address,
                intro: res.data.intro
              }
            }
          } else if (res.code == ERROR_CODE) {
            // promptUtil.error(this, res.msg)
          } else {
            promptUtil.wait(this)
          }
        }).catch(err => {
          promptUtil.LOG('getCollectionFormInformation-err', err)
        })
      },
      seeMoreCourse() {
        this.seeMoreCoursedialogVisible = true
      },
      seeMoreTeacher() {
        this.seeMoreTeacherdialogVisible = true
      },
      teacherDescButton(id) {
        this.dialogVisible = true
        if (this.showAllTeacher && this.showAllTeacher.length != 0) {
          this.showTeacherDialog = []
          this.showAllTeacher.forEach(item => {
            if (item.id == id) {
              const obj = {
                id: item.id,
                url: item.url,
                name: item.name,
                sex: item.sex,
                tag: item.tag,
                rate: item.rate == "初级教师" ? 2 : item.rate == "中级教师" ? 3 : 5,
                descript: item.desc
              }
              this.showTeacherDialog.push(obj)
            }
          })
        }

      },
      handleClose(done) {
        done();
      },
      customButton() {
        this.applaydialogVisible = true
      },

      //表单
      handleAvatarSuccess(res, file) {
        this.consultForm.avatarUrl = res //URL.createObjectURL(file.raw);   file.response
      },
      // 限制图片格式
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/png" || file.type === "image/jpeg";
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isJPG) {
          this.$message.error('只能上传jpg/png文件，请重新选择文件');
        }
        if (!isLt1M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        return isJPG && isLt1M;
      },
      onAddItemSubmit() {
        // this.applaydialogVisible = false
        if (this.consultForm.name.trim() == "") {
          promptUtil.warning(this, "请输入学员姓名")
          return
        }
        if (this.consultForm.phone1.trim() == "") {
          promptUtil.warning(this, "请输入学员电话")
          return
        }
        submitCollectionForm(qs.stringify({
          create_id: this.collectionId,
          sex: this.consultForm.sex,
          name: this.consultForm.name,
          phone: this.consultForm.phone1,
          phone2: this.consultForm.phone2,
          parent_name: this.consultForm.parent,
          school_name: this.consultForm.school,
          class_name: this.consultForm.class,
          beizhu: this.consultForm.desc,
          birthday: this.consultForm.birth == '' ? "" : moment(this.consultForm.birth.getTime()).format('YYYY-MM-DD'),
          comefrom: this.consultForm.source,
          header: this.consultForm.avatarUrl,// JSON.stringify(this.consultForm.avatarUrl),
          level: this.consultForm.extent,
        })).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data == '[]') {
              promptUtil.success(this, res.msg)
              this.applaydialogVisible = false
              this.resetAddItemWithDialog()
            }
          } else if (res.code == ERROR_CODE) {
            promptUtil.error(this, res.msg)
          } else {
            promptUtil.wait(this)
          }
        }).catch(err => {
          promptUtil.LOG('submitCollectionForm-err', err)
        })
      },
      resetAddItemWithDialog() {
        this.consultForm = {//表单
          name: '',
          sex: '',
          avatarUrl: '',
          class: "",
          birth: '',
          phone1: '', // 学员电话
          phone2: '', // 备用电话
          school: '',
          parent: '',
          source: '', // 1地推采单  2门店到访  3转介绍  4活动转化  5网络推广  0其他
          extent: '', // 1高2中3低0不明确、
          desc: '' // 备注
        }
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
          document.getElementById('status').innerHTML = '定位失败'
          document.getElementById('result').innerHTML = '失败原因排查信息:' + data.message;
        }

        // var placeSearch = new AMap.PlaceSearch({
        //     city: _that.saveOriginAdress, // 兴趣点城市
        //     citylimit: true,  //是否强制限制在设置的城市内搜索
        //     pageSize: 10, // 单页显示结果条数
        //     children: 0, //不展示子节点数据
        //     pageIndex: 1, //页码
        //     extensions: 'base' //返回基本地址信息
        // });
        // //详情查询
        // placeSearch.getDetails("B000A83U0P", function (status, result) {
        //     if (status === 'complete' && result.info === 'OK') {
        //         placeSearch_CallBack(result);
        //     }
        // });
        // var infoWindow = new AMap.InfoWindow({
        //     autoMove: true,
        //     offset: {x: 0, y: -30}
        // });
        //
        // //回调函数
        // function placeSearch_CallBack(data) {
        //     var poiArr = data.poiList.pois;
        //     //添加marker
        //     var marker = new AMap.Marker({
        //         map: _that.map,
        //         position: poiArr[0].location
        //     });
        //     _that.map.setCenter(marker.getPosition());
        //     infoWindow.setContent(createContent(poiArr[0]));
        //     infoWindow.open(_that.map, marker.getPosition());
        // }
        //
        // function createContent(poi) {  //信息窗体内容
        //     var s = [];
        //     s.push("<b>名称：" + poi.name + "</b>");
        //     s.push("地址：" + poi.address);
        //     s.push("电话：" + poi.tel);
        //     s.push("类型：" + poi.type);
        //     return s.join("<br>");
        // }

      },

    },
  }
</script>
<style scoped>
  .dialogBox >>> .el-dialog__body {
    padding: 0 !important;
    overflow: hidden;
  }

  .dialogBox >>> .el-dialog__header {
    background-color: #00a2ff !important;
    /*background-image: linear-gradient(to right, #0078ff, #aa0def);*/
    /*background-image: linear-gradient(to bottom right, #00a2ff, blue);*/
  }

  .dialogBox >>> .el-dialog__headerbtn .el-dialog__close {
    color: #fff !important;
  }

  .contentBg {
    background: url("../../../../static/images/base/mobileDialog/bg.png") no-repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .bgTitle {
    width: 100%;
    position: relative;
  }

  .customButton {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translate(-50%);
    width: 140px;
    height: 30px;
    border-radius: 10px;
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    background-image: linear-gradient(to right, #0078ff, #aa0def);
    color: #fff;
    line-height: 30px;
    border: 2px #fff solid;
    cursor: pointer;
  }

  .bottomCustomButton {
    width: 140px;
    height: 30px;
    border-radius: 10px;
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    background-image: linear-gradient(to right, #0078ff, #aa0def);
    color: #fff;
    line-height: 30px;
    border: 2px #fff solid;
    margin: 0 auto;
    margin-bottom: 30px;
  }

  .title {
    margin: 20px auto;
    width: 160px;
    position: relative;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .content {
    margin-left: 20px;
    margin-right: 20px;

  }

  .titleLeft {
    position: absolute;
    left: 22px;
    top: 2px;
    color: #00cfff;
  }

  .titleRight {
    position: absolute;
    right: 9px;
    top: 32px;
    font-size: 10px;
    color: #fff;
  }

  .courseItem {
    color: #fff;
    overflow: hidden;
    margin-bottom: 30px;
    /*height: 250px;*/
  }

  .courseItemImgBox {
    width: 60%;
    float: left;
    /*height: 250px;*/
    position: relative;
    overflow: hidden;
  }

  .courseItemImgBox:before {
    content: "";
    display: block;
    padding-top: 130%;
  }

  .courseItemImgBox img {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 251px;
    object-fit: cover;
    width: 100%;
  }

  .courseItemdesc {
    width: 40%;
    background-color: #393c3b;
    float: right;
    font-size: 14px;
    height: 251px;
  }

  .courseItemdescFont {
    padding-left: 2px;
    padding-right: 2px;
  }

  .courseBtn {
    width: 80px;
    height: 20px;
    background-color: #31b28c;
    border-radius: 5px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 10px;

  }

  /*名师风采*/
  .teacherItem {
    margin-bottom: 30px;
    margin-top: 50px;
    position: relative;
  }

  .itemBg {
    background-color: #eee;
    border-radius: 10px;
    width: 100%;
    height: 150px;
  }

  .itemImgBox {
    width: 40%;
    height: 140px;
    z-index: 222;
    position: absolute;
    top: -20px;
    left: 22px;
  }

  .itemImgBox img {
    width: 100%;
    height: 140px;
    object-fit: cover;
  }

  .teacherDesc {
    position: absolute;
    top: 7px;
    right: 8px;
  }

  .teacherDesc p {
    font-size: 14px;
    line-height: 8px;
  }

  .teacherDescButton {
    width: 80px;
    height: 30px;
    background-color: red;
    text-align: center;
    color: #fff;
    border-radius: 20px;
    line-height: 30px;
    margin-top: 5px;
    font-size: 14px;
    margin-left: 18px;
    cursor: pointer;
  }

  .organName {
    margin-bottom: 40px;
  }

  .organNameLine {
    font-weight: bold;
    font-size: 14px;
    padding-bottom: 5px;
    border-bottom: 1px solid red;
  }

  .marginLeft {
    font-size: 12px;
    margin-left: 10px;
    color: #333;
  }

  /*教师dialog*/
  .teacherItemDialog {
    position: relative;
    margin: 10px 10px 10px 10px;
  }

  .itemBgDialog {
    border-radius: 10px;
    width: 100%;
  }

  .itemImgBoxDialog {
    width: 40%;
    height: 100px;
    z-index: 222;
    /*position: absolute;*/
    /*top: -20px;*/
    /*left: 22px;*/
  }

  .itemImgBoxDialog img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }

  .teacherDescDialog {
    position: absolute;
    top: 0;
    right: 0px;
  }

  .teacherDescDialog p {
    font-size: 14px;
    line-height: 8px;
  }

  .teacherDescButtonDialog {
    width: 80px;
    height: 30px;
    background-color: red;
    text-align: center;
    color: #fff;
    border-radius: 20px;
    line-height: 30px;
    margin-top: 8px;
    font-size: 14px;
    margin-left: 18px;
  }

  .marginLeft {
    font-size: 12px;
    margin-left: 10px;
    color: #333;
  }

  /*表单*/
  .el-dialog__body {
    background-image: linear-gradient(to bottom right, #00a2ff, blue);
  }

  .bg {
    /*background-image: linear-gradient(to bottom right, #00a2ff, blue);*/
    background-color: #00a2ff;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .roundBg {
    overflow: hidden;
    border-radius: 5px;
    background-color: #fff;
    /*margin: 40px 10px;*/
    /*margin-left: 10px;*/
    /*margin-right: 10px;*/
    margin: 10px 10px 20px 10px;
  }

  .el_input_width {
    width: 90% !important;
  }

  .margin_top_10 {
    margin-top: 10px;
  }

  .el-form-item {
    margin-bottom: 15px !important;
  }

  .avatar-uploader {
    width: 162px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: auto;
    height: 103px !important;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    line-height: 72px;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: block;
    /*width: 80px;*/
    /*height: 80px;*/
    /*display: block;*/
  }


  .el-dialog__body {
    padding: 0 !important;
  }

  .el-input {
    width: 97%;
  }

  .courseFontBox {
    height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }


</style>
