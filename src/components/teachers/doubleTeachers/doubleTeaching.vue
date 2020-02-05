<template>
  <div>
    <!-- 面包屑 -->
    <!--    <el-row>-->
    <!--      <el-col :span="24">-->
    <!--        <div class="grid-content bg-purple-dark">-->
    <!--          <el-breadcrumb separator="/">-->
    <!--            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>-->
    <!--            <el-breadcrumb-item>双师教学</el-breadcrumb-item>-->
    <!--          </el-breadcrumb>-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <!-- 面包屑 -->
    <!--    连锁查询-->
    <el-card shadow="always">
      <el-row type="flex" align="small" v-for="type in filterInfo" :key="type.id">
        <el-col :span="24">
          <el-checkbox-group v-model="categoryGroup" size="small" @change="categoryGroupChange">
            <el-checkbox-button v-for="(category,index) in type.category" :label="category.id" :key="index">
              {{category.label}}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <!-- 查询 -->
      <el-row :gutter="16">
        <el-col :span="24">
          <el-input
            style="width: 240px;"
            size="small"
            placeholder="请输入查询信息"
            v-model="inputQueryInfo"
            clearable
            @keydown.native.enter="queryClassInfo"
          ></el-input>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryClassInfo">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- table切换 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col>
        <div class="grid-content bg-purple-light">
          <div v-if="!doubleTeachingInfo || doubleTeachingInfo.length==0">
            <div
              style="font-size: 30px;color:#e6e6e6;font-weight: bold;display: flex;justify-content: center;align-items: center;height: 400px;">
              暂未开通课程
            </div>
          </div>
          <div v-else class="el-box" v-for="(item,index) in doubleTeachingInfo" :key="index">
            <div style="border-radius: 10%;box-shadow: 5px 5px 5px #eee;border: none;">
              <div @click="doubleTeachingList" style="cursor: pointer;">
                <img
                  :src="item.img"
                  alt
                  :current-id="item.id"
                  class="cover"
                  style="border-top-left-radius: 10%;border-top-right-radius: 10%"
                >
              </div>
              <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                <div class="el-txt">{{item.title}}</div>
              </el-tooltip>
              <div style="display: flex;justify-content: space-between">
                <div class="el-txt-box">
                  <p>
                    <i class="el-icon-document"></i>
                    {{item.lesson}}
                  </p>
                </div>
                <div style="padding-top: 10px;margin-right: 16px;">
                  <el-tag effect="plain" style="font-weight:bold">{{item.parent_name}}</el-tag>
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import PubSub from "pubsub-js";
    import {
        qs,
        getDoubleCoursePackage,
        getDoubleClickSearch
    } from "../../../api/api";
    import storageUtil from "../../../utils/storageUtil";
    import stringUtil from "../../../utils/stringUtil";
    import promptUtil from "../../../utils/promptUtil";
    import vuexUtils from "../../../utils/vuexUtils";
    import '../../../api/restfulapi';
    import childHeader from '../../component/childHeader'

    export default {
        components: {"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name: vuexUtils.checkMenuExist(this, 'cooperate').target.name, to: ''}],
                doubleTeachingInfo: [],
                inputQueryInfo: "", // 搜索内容
                liveInfo: [],
                filterInfo: [], // 过滤类型
                categoryGroup: [], // 类型数组
            }
        },
        mounted() {
            //  面包屑显示首页效果
            PubSub.publish("currentMenuIndex", "/cooperate");
            this.initPackageCategory()
        },
        methods: {
            initPackageCategory() {
                const loading = promptUtil.loading(this);
                getDoubleClickSearch(
                    qs.stringify({school_id: storageUtil.readTeacherInfo().school_id, type: 0})
                )
                    .then(res => {
                        if (res.code == SUCCESS_CODE) {
                            if (res.data && res.data != '[]') {
                                this.filterInfo = [];
                                if (res.data != '[]') {
                                    this.filterInfo = res.data;

                                }
                                //2.获取列表内容
                                this.getCoursePackage(loading);
                                loading.close()
                            }
                        } else {
                            loading.close();
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG('getCoursesCategory-err', err);
                    });
            },

            doubleTeachingList(event) {
                console.log("event", event)
                this.$router.push({
                    path: "/cooperateList/" + event.target.getAttribute("current-id")
                });
            },
            // 获取课程类别改变状态
            categoryGroupChange(val) {
                const ids = stringUtil.array2String(val, ",")
                const loading = promptUtil.loading(this)
                getDoubleCoursePackage(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    category_id: ids,
                    str: ""
                })).then(res => {
                    if (res.data && res.data != '[]') {
                        this.doubleTeachingInfo = res.data;
                    } else {
                        this.doubleTeachingInfo = []
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("filterPackageBatch-err", err)
                    loading.close()
                })
            },
            getCoursePackage(loading) {
                getDoubleCoursePackage(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                        if (res.data && res.data != '[]') {
                            this.doubleTeachingInfo = res.data
                        }
                    } else if (res.code == ERROR_CODE) {
                        promptUtil.error(this, res.msg)
                    } else {
                        promptUtil.wait(this)
                    }
                }).catch(err => {
                    promptUtil.LOG('getSystematicStatistics-err', err)
                })
            },
            queryClassInfo() {
                const ids = stringUtil.array2String(this.categoryGroup, ",")
                const loading = promptUtil.loading(this)
                getDoubleCoursePackage(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    category_id: ids,
                    str: this.inputQueryInfo
                })).then(res => {
                    if (res.data && res.data != '[]') {
                        this.doubleTeachingInfo = res.data;
                    } else {
                        this.doubleTeachingInfo = []
                    }
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("filterPackageBatch-err", err)
                    loading.close()
                })
            },
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

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-box {
    margin: 15px 15px;
    float: left;
    width: 240px;
    margin-left: 55px;
  }

  .cover {
    /* height: calc(100% - 66px); */
    background-position: 50% !important;
    background-size: cover !important;
    height: 160px;
    width: 100%;
    cursor: pointer;
    overflow: hidden;
    border-bottom: 1px #e6e6e6 solid;
  }

  .el-txt-box {
    /* text-align: center */
    padding-left: 20px;
    margin-bottom: 10px;
  }

  .el-txtBox {
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    margin-left: 20px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 500;
  }

  .detailBox {
    width: 240px;
    overflow: hidden;
    font-size: 16px;
    font-weight: 200;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /*加宽度width属来兼容部分浏览*/
  }

  .detail {
    width: 240px;
    height: 20px;
    line-height: 20px;
    font-weight: 200;
  }

  .ml-l {
    margin-left: 10px;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #409eff;
    background-color: #eee !important;
    border-right-color: #00a2ff;
    border-left-color: #00a2ff;
  }

  .el-tabs--border-card {
    background: #fff;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
</style>
