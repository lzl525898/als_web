<script src="../../../api/api.js"></script>
<template>
  <div class="database">
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <!-- 过滤 -->
      <!--      <el-row type="flex" align="middle">-->
      <!--        <el-col :span="2">全部</el-col>-->
      <!--        <el-col :span="22">-->
      <!--          <el-button round size="small" :autofocus="true" @click="onHandleAllResourceList">全部</el-button>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row type="flex" align="middle" v-for="type in filterInfo" :key="type.id">
        <!--        <el-col :span="2">{{type.type}}</el-col>-->
        <!--        <el-col :span="22">-->
        <!--          <el-button-->
        <!--            round-->
        <!--            size="small"-->
        <!--            v-for="(category,index) in type.category"-->
        <!--            :key="index"-->
        <!--            @click="onFilterClick(category,index)"-->
        <!--          >{{category.label}}</el-button>-->
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
            style="width: 240px;"
            placeholder="请输入查询信息"
            v-model="inputQueryInfo"
            clearable
            @keydown.native.enter="queryClassInfo"
          ></el-input>
          <el-button size="small" type="primary" icon="el-icon-search" @click="queryClassInfo">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div style="display: flex">
      <div v-show="!showType" style="width: 200px;">

<!--        <el-row style="margin-top: 10px;margin-left: 10px;">-->
<!--          <el-button><i class="el-icon-download" size="small" @click="showBatchDownload">下载</i></el-button>-->
<!--        </el-row>-->

        <el-row style="margin-top: 10px;margin-left: 10px;">
<!--          <el-button><i class="el-icon-download" size="small" @click="showBatchDownload">下载</i></el-button>-->
        </el-row>

      </div>
      <div style="flex:1;display:flex;justify-content:flex-end;height: 30px;margin-top: 20px;">
        <a v-show="!showType" href="#" class="showType" @click="changeShowStyle">
          <el-tooltip content="切换到缩略图模式" placement="top">
            <i class="el-icon-tickets"></i>
          </el-tooltip>
        </a>
        <a v-show="showType" href="#" class="showType" @click="changeShowStyle">
          <el-tooltip content="切换到列表模式" placement="top">
            <i class="el-icon-menu"></i>
          </el-tooltip>
        </a>
      </div>
    </div>
    <!-- 下载课程包 -->
    <div v-show="!showType">
<!--      ref="multipleTable"-->
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
<!--        <el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="title" label="文件名"></el-table-column>
        <el-table-column prop="upload" label="上传时间" width="250"></el-table-column>
        <el-table-column prop="img" label="文件类型" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div @click="downloadTableData(scope.row)">
              <el-link :underline="false" :href="scope.row.url" type="primary">下载</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="center" class="mt" style="margin-top: 30px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="tablePageSize"
          layout="total, prev, pager, next, jumper"
          :total="databaseInfoList"
        ></el-pagination>
      </el-row>
    </div>
    <div v-show="showType">
      <el-row>
        <el-col>
          <div class="grid-content bg-purple-light">
            <div class="elbox" v-for="(item,index) in tableData" :key="index">
              <el-card shadow="hover" :body-style="{ padding: '15px  15px',backgroundColor: '#e6e6e6'}">
                <div style="height: 200px;width: 255px;">
                  <div style="display: flex;margin-top: 5px">
                    <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                      <div
                        style="height: 40px;width: 170px;color: #333333;font-weight: 600;font-size: 16px;white-space:nowrap; text-overflow:ellipsis;overflow: hidden">
                        {{item.title}}
                      </div>
                    </el-tooltip>
                    <div
                      style="width: 50px;border-left: 1px solid #fff;border-right: 1px solid #fff;height:20px;text-align: center">
                      <span style="margin-left: 5px;">{{item.img}}</span>
                    </div>
                    <div style="margin-left:10px;">
                      <el-link :underline="false" :href="item.url" target="_blank"><i class="el-icon-download"
                                                                                      style="font-weight: 400;font-size: 22px;"
                                                                                      @click="downloadData(item.url)"></i>
                      </el-link>
                    </div>
                  </div>
                  <div style="border: 1px dashed #fff;margin-top:-14px;"></div>
                  <el-link :underline="false" :href="item.openUrl" target="_blank">
                    <div style="width: 255px; height: 165px;margin-top:5px;">
                      <el-image
                        style="width: 240px; height: 150px;margin-top:7px;margin-left:7px"
                        :src="item.pic"
                        fit="fill"></el-image>
                    </div>
                  </el-link>
                </div>
              </el-card>
            </div>
          </div>
        </el-col>
      </el-row>
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
    <el-dialog title="提示" :visible.sync="fileDialogVisible" width="20%">
      <el-row>
        <el-col :span="4">
          <i class="el-icon-question"></i>
        </el-col>
        <el-col :span="20">
          <span>确定要批量下载选定文件吗？</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleBatchDownload" :loading="isLoadingWithDownload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import PubSub from "pubsub-js";
    import storageUtil from "../../../utils/storageUtil";
    import promptUtil from "../../../utils/promptUtil";
    import stringUtil from "../../../utils/stringUtil";
    import '../../../api/restfulapi';
    import {
        qs,
        getResourceList,
        getCoursesCategory,
        filterResourceByTag,
        queryResourceByKeys,
        trafficStatistics
    } from "../../../api/api";
    import childHeader from '../../component/childHeader'

    export default {
        components: {"als-child-header": childHeader},
        data() {
            return {
                routerConfig: [{name: '资料百科', to: ''}],
                categoryGroup: [], // 类型数组
                showType: true, // true 块展示 false 列表展示
                inputQueryInfo: "", // 搜索内容
                pageSize: 20, // 分页页码大小
                tablePageSize: 10,// table分页页码大小
                currentPage: 1, // 分页当前页码
                tableData: [], //当前页面20条
                queryFromServer: [], // 服务器请求数据
                filterInfo: [], // 过滤类型
                fileUrlArray: [], // 需要下载的文件url数组
                fileDialogVisible: false, // 是否显示提示对话框
                isLoadingWithDownload: false, // 下载是否完成的状态
                downloadUrl: ""
            };
        },
        mounted() {
            promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
            PubSub.publish("currentMenuIndex", "/database");
            const loading = promptUtil.loading(this);
            getCoursesCategory(
                qs.stringify({school_id: storageUtil.readTeacherInfo().school_id, type: 2})
            )
                .then(res => {
                    if (res.code == SUCCESS_CODE) {
                        this.filterInfo = [];
                        if (res.data != '[]') {
                            this.filterInfo = res.data;
                        }
                        this.getResourceListFromServer(loading);
                    } else {
                        loading.close();
                        promptUtil.wait(this);
                    }
                })
                .catch(err => {
                    loading.close();
                    promptUtil.LOG("getResourceCategory-err", err);
                });
            // this.tableData = this.queryFromServer;
        },
        methods: {
            // 获取课程类别改变状态
            categoryGroupChange(val) {
                const ids = stringUtil.array2String(val, ",")
                const loading = promptUtil.loading(this)
                queryResourceByKeys(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    category_id: ids,
                    file_name: ""
                })).then(res => {
                    if (res.data && res.data != '[]') {
                        this.queryFromServer = res.data;
                    } else {
                        this.queryFromServer = []
                    }
                    this.queryFromServer = res.data;
                    this.handleCurrentChange(1)
                    loading.close()
                }).catch(err => {
                    promptUtil.LOG("filterPackageBatch-err", err)
                    loading.close()
                })
            },
            // 改变显示形式
            changeShowStyle() {
                this.showType = !this.showType
                this.handleCurrentChange(1)
            },
            onFilterClick(category, index) {
                const loading = promptUtil.loading(this);
                const type = index == 0 ? 0 : 1; // 0 父id 1 子id
                filterResourceByTag(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        category_id: category.id,
                        fid: type
                    })
                )
                    .then(res => {
                        // console.log('filterResourceByTag',res)
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            this.tableData = [];
                            if (res.data != undefined) {
                                this.queryFromServer = res.data;
                                this.handleCurrentChange(1)
                            }
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        promptUtil.LOG("filterResourceByTag-err", err);
                    });
            },
            // 搜索按钮触发函数
            queryClassInfo() {
                const loading = promptUtil.loading(this);
                const ids = stringUtil.array2String(this.categoryGroup, ",")
                queryResourceByKeys(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id,
                        category_id: ids,
                        file_name: this.inputQueryInfo
                    })
                )
                    .then(res => {
                        this.inputQueryInfo = "";
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            this.queryFromServer = [];
                            if (res.data && res.data != '[]') {
                                this.queryFromServer = res.data;
                            }
                            this.handleCurrentChange(1)
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        this.inputQueryInfo = "";
                        loading.close();
                        promptUtil.LOG("queryResourceByKeys-err", err);
                    });
            },
            // 获取资源列表
            getResourceListFromServer(loading) {
                queryResourceByKeys(
                    qs.stringify({
                        school_id: storageUtil.readTeacherInfo().school_id
                    })
                )
                    .then(res => {
                        PubSub.publish("currentMenuIndex", "/database");
                        loading.close();
                        if (res.code == SUCCESS_CODE) {
                            this.queryFromServer = [];
                            if (res.data && res.data != '[]') {
                                res.data.map(item => {
                                    if (item.img == 'doc' || item.img == 'docx' || item.img == 'ppt' || item.img == 'pptx' || item.img == 'xls' || item.img == 'xlsx') {
                                        item.openUrl = "https://ow365.cn/?i=18640&ssl=1&furl=" + item.url
                                    } else {
                                        item.openUrl = item.url
                                    }
                                })
                                this.queryFromServer = res.data;
                            }
                            this.handleCurrentChange(1)
                        } else {
                            promptUtil.wait(this);
                        }
                    })
                    .catch(err => {
                        loading.close();
                        PubSub.publish("currentMenuIndex", "/database");
                        promptUtil.LOG("getResourceList-err", err);
                    });
            },
            // 分页页码改变出发
            handleCurrentChange(val) {
                let size = 0
                this.currentPage = val;
                if (this.showType) {
                    size = this.pageSize
                } else {
                    size = this.tablePageSize
                }
                //当前页面需要显示得条数=所有条数
                this.tableData = this.queryFromServer.slice(
                    (this.currentPage - 1) * size,
                    size + (this.currentPage - 1) * size
                );
            },
            // 显示批量下载页面
            showBatchDownload() {
                if (this.fileUrlArray.length == 0) {
                    promptUtil.warning(this, '请选择要下载的文件')
                } else {
                    this.fileDialogVisible = true
                    this.isLoadingWithDownload = false
                }
            },
            //获取 blob
            getBlob(url) {
                return new Promise(resolve => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.responseType = 'blob';
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve(xhr.response);
                        }
                    };
                    xhr.send();
                });
            },
            // 保存
            saveAs(blob, filename) {
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename);
                } else {
                    const link = document.createElement('a');
                    const body = document.querySelector('body');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.style.display = 'none';
                    body.appendChild(link);
                    link.click();
                    body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                }
            },
            // 批量下载事件响应
            handleBatchDownload() {
                this.isLoadingWithDownload = true
                this.fileUrlArray.forEach(url => {
                    this.getBlob(url).then(blob => {
                        const filename = url.split("/")[url.split("/").length - 1]
                        console.log(filename)
                        this.saveAs(blob, decodeURI(filename));
                    });
                })
                this.$refs.multipleTable.clearSelection();
                this.isLoadingWithDownload = false
                this.fileDialogVisible = false
            },
            // 操作checkbox时数据变动回调
            handleSelectionChange(val) {
                this.fileUrlArray = []
                val.forEach(item => {
                    this.fileUrlArray.push(item.url)
                })
            },
            // 获取所有资源列表
            onHandleAllResourceList() {
                const loading = promptUtil.loading(this);
                this.getResourceListFromServer(loading);
            },
            //下载
            downloadData(url) {
                this.totalTrafficStatistics(url, '下载资料百科')
            },
            downloadTableData(url) {
                this.totalTrafficStatistics(url.url, '下载资料百科')
            },
            totalTrafficStatistics(file_url, text) {
                trafficStatistics(qs.stringify({
                    school_id: storageUtil.readTeacherInfo().school_id,
                    user_id: storageUtil.readTeacherInfo().id,
                    file_url: file_url,
                    text: text,
                })).then(res => {
                    if (res.code == SUCCESS_CODE) {
                    } else {

                    }

                }).catch(err => {
                    promptUtil.LOG('trafficStatistics-err', err)
                })
            }

        },
        computed: {
            databaseInfoList: {
                get() {
                    return this.queryFromServer.length;
                }
            }
        }
    };
</script>
<style scoped>
  .el-icon-question {
    margin-top: -10px;
  }

  .el-icon-question:before {
    font-size: 40px;
    color: #f56c6c;
  }

  .el-row {
    margin-bottom: 10px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .el-breadcrumb {
    line-height: 2.5;
    margin-left: 10px;
  }

  .lh {
    line-height: 50px;
    font-weight: bold;
  }

  .bg-purple-dark {
    background: #eee;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .elbox {
    /*width: 107px;*/
    margin: 15px 15px;
    float: left;
  }

  .elcard {
    padding: 10px 10px 10px 10px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;

  }

  .cover {
    background-position: 50% !important;
    background-size: cover !important;
    height: 108px;
    overflow: hidden;
    width: auto !important;
  }

  .eltxtbox {
    text-align: center;
  }

  .eltxt {

    width: 60px;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    font-weight: 300;
  }

  .showType {
    font-size: 26px;
    color: #00a2ff;
  }

  .showType:active {
    cursor: pointer;
    color: #008ccf;
  }

  .showType:hover {
    cursor: pointer;
    color: #008ccf;
  }

  .el-col-offset-6 {
    margin-left: 14% !important;
  }

  span {
    display: block;
  }
</style>


