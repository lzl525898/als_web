<template>
  <div>
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-row type="flex" align="middle" v-for="type in filterInfo" :key="type.id">
        <!--        <el-col :span="2">{{type.type}}</el-col>-->
        <!--        <el-col :span="22" style="margin-left: -20px;">-->
        <!--          <el-button-->
        <!--            round-->
        <!--            size="small"-->
        <!--            v-for="(category,index) in type.category"-->
        <!--            :key="index"-->
        <!--            @click="onFilterClick(category,index)"-->
        <!--          >{{category.label}}-->
        <!--          </el-button>-->
        <!--        </el-col>-->
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
            size="small"
            style="width: 240px"
            placeholder="请输入查询信息"
            v-model="inputQueryInfo"
            clearable
            @keydown.native.enter="queryClassInfo"
          ></el-input>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryClassInfo">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-row>
        <el-col :span="24">
          <label>教学软件 : </label><label>{{packageInfo.software}}</label>
        </el-col>
        <el-col :span="24" style="margin-top: 10px;">
          <label>简要介绍 : </label><label>{{packageInfo.introduce}}</label>
        </el-col>
      </el-row>
    </el-card>
    <!-- 列表 -->
    <el-table
      class="table_hover"
      :data="tableData"
      style="width: 100%;margin-top: 20px;"
      :header-row-style="{'color':'#409EFF'}"
      @row-click="resourcesListShow"
    >
      <el-table-column
        props="index"
        type="index"
        align="center"
        :index="indexMethod"
        label="序号"
        width="80"
      ></el-table-column>
      <el-table-column prop="name" align="center" label="课程名称" @click="resourcesListShow"></el-table-column>
      <el-table-column prop="stage" align="center" label="阶段"></el-table-column>
<!--      <el-table-column prop="suit" align="center" label="教具名称"></el-table-column>-->
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="center" class="mt">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="databaseInfoList"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>
    import PubSub from "pubsub-js";
    import promptUtil from "../../../utils/promptUtil";
    import stringUtil from "../../../utils/stringUtil";
    import storageUtil from "../../../utils/storageUtil";
    import vuexUtils from "../../../utils/vuexUtils";
    import '../../../api/restfulapi';
    import childHeader from '../../component/childHeader'
    import {
        qs,
        getCoursesCategory,
        getCoursesPackageDetail,
        filterCoursesDetailByTag,
        filterCoursesDetailBatch,
        filterDoubleCoursesDetailBatch,
        getDoubleCoursesPackageDetail,
        getDoubleClickSearch
    } from "../../../api/api";

    export default {
        components:{"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name:vuexUtils.checkMenuExist(this,'cooperate').target.name,to:'/cooperate'},{name:'详细目录',to:''}],
                inputQueryInfo: "", // 搜索内容
                pageSize: 10, // 分页页码大小
                currentPage: 1, // 分页当前页码
                tableData: [], //当前页面10条
                filterInfo: [], // 过滤类型
                categoryGroup: [], // 类型数组
                packageInfo: {software: '', introduce: ''}, // 课程包信息
                resourcesList: [] // 列表内容
            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            //  面包屑显示首页效果
            PubSub.publish("currentMenuIndex", "/cooperate");
            this.$store.dispatch("setCoursePackageIdWithList", this.$route.params.id); // 触发消息action调用
            //1.获取过滤类型
            const loading = promptUtil.loading(this);
            getDoubleClickSearch(
                qs.stringify({school_id: storageUtil.readTeacherInfo().school_id, type: 1})
            )
                .then(res => {
                    PubSub.publish("currentMenuIndex", "/cooperate");
                    if (res.code == SUCCESS_CODE) {
                        this.filterInfo = [];
                        if (res.data && res.data != '[]') {
                            this.filterInfo = res.data;
                        }
                        //2.获取列表内容
                        this.getCourseFromPackage(loading);
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
        methods: {
            // 获取课程类别改变状态
            categoryGroupChange(val) {
                const ids = stringUtil.array2String(val, ",")
                const loading = promptUtil.loading(this)
                filterDoubleCoursesDetailBatch(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    category_id: ids,
                    class_id: this.$route.params.id, // 课程包id
                    str: ""
                })).then(res => {
                    if (res.data && res.data != '[]') {
                        this.resourcesList = res.data;
                    } else {
                        this.resourcesList = []
                    }
                    this.handleCurrentChange(1)
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("filterPackageBatch-err", err)
                    loading.close()
                })
            },
            onFilterClick(category, index) {
                const loading = promptUtil.loading(this);
                const type = index == 0 ? 0 : 1; // 0 父id 1 子id
                filterDoubleCoursesDetailBatch(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        category_id: category.id,
                        class_id: this.$route.params.id, // 课程包id
                        fid: type
                    })
                )
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            this.resourcesList = [];
                            if (res.data && res.data != '[]') {
                                this.resourcesList = res.data;
                            }
                            this.handleCurrentChange(1); //默认第一次访问使用第一页
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG('filterCoursesDetailByTag-err', err);
                    });
            },
            queryClassInfo() {
                const ids = stringUtil.array2String(this.categoryGroup, ",")
                const loading = promptUtil.loading(this)
                filterDoubleCoursesDetailBatch(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    category_id: ids,
                    class_id: this.$route.params.id, // 课程包id
                    str: this.inputQueryInfo
                })).then(res => {
                    if (res.data && res.data != '[]') {
                        this.resourcesList = res.data;
                    } else {
                        this.resourcesList = []
                    }
                    this.handleCurrentChange(1)
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("filterPackageBatch-err", err)
                    loading.close()
                })
            },
            // 获取当前课程包下搜友课程
            onHandleAllResourceList() {
                const loading = promptUtil.loading(this);
                this.getCourseFromPackage(loading);
            },
            // 获取当前课程包下所有课程
            getCourseFromPackage(loading) {
                //获取列表接口
                getDoubleCoursesPackageDetail(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        class_id: this.$route.params.id
                    })
                )
                    .then(res => {
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            if (res.data && res.data != '[]') {
                                this.resourcesList = [];
                                this.packageInfo.software = res.data.software && res.data.software != '' ? res.data.software : '--'
                                this.packageInfo.introduce = res.data.desc && res.data.desc != '' ? res.data.desc : '--'
                                if (res.data && res.data.item != '[]') {
                                    this.resourcesList = res.data.item
                                }
                            }
                        } else {
                            promptUtil.wait(this);
                        }
                        this.handleCurrentChange(1); //默认第一次访问使用第一页，页码是1.
                    })
                    .catch(error => {
                        loading.close();
                        promptUtil.LOG('getCoursesPackageDetail-err', error);
                    });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                //当前页面需要显示得条数=所有条数
                this.tableData = this.resourcesList.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.pageSize + (this.currentPage - 1) * this.pageSize
                );
            },
            // 设置当前table索引
            indexMethod(index) {
                return index + 1 + (this.currentPage - 1) * 10;
            },
            resourcesListShow(event) {
                this.$router.push({path: "/cooperateListShow/" + event.id});
            }
        },
        computed: {
            databaseInfoList: {
                get() {
                    return this.resourcesList.length;
                }
            }
        },
    };
</script>

<style scoped>
  .table_hover:hover {
    cursor: pointer;
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

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .lh {
    line-height: 50px;
    font-weight: bold;
  }

  .mt {
    margin-top: 50px;
  }

  .pointer {
    cursor: pointer;
  }

  .el-table .cell {
    cursor: pointer;
  }

  .el-table_2_column_6 {
    cursor: pointer;
  }

  .showTask {
    margin-top: 30px;
    /* background-color: #eee; */
    box-shadow: 2px 2px 8px #eee;
    border-radius: 10px;
    color: #606266;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 50px;
  }
</style>

