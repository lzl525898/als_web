<template style="height: 100%;">
    <div style="height: 100%;">
      <h2 class="title">奥松云课堂帮助文档</h2>
      <div class="container">
        <el-menu  default-active="1" class="el-menu-vertical-demo nav">
          <el-submenu index="1">
            <template slot="title">
              <a href="#nav1">班级管理</a>
            </template>
            <el-menu-item-group>
              <el-submenu index="1-1">
                <template slot="title">
                  <a href="#nav1-1">查看</a>
                </template>
                <el-menu-item index="1-1-1"><a href="#nav1-1-1">班级概览</a></el-menu-item>
                <el-menu-item index="1-1-2"><a href="#nav1-1-2">操作状态</a></el-menu-item>
                <el-menu-item index="1-1-3"><a href="#nav1-1-3">许可状态</a></el-menu-item>
              </el-submenu>
            </el-menu-item-group>
            <el-menu-item index="1-2"><a href="#nav1-2">编辑</a></el-menu-item>
            <el-menu-item index="1-3"><a href="#nav1-3">删除</a></el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <a href="#nav2" slot="title">教师管理</a>
            </template>
            <el-menu-item index="2-1"><a href="#nav2-1">搜索</a></el-menu-item>
            <el-menu-item index="2-2"><a href="#nav2-2">添加教师</a></el-menu-item>
            <el-menu-item index="2-3"><a href="#nav2-3">编辑</a></el-menu-item>
            <el-menu-item index="2-4"><a href="#nav2-4">密码重置</a></el-menu-item>
            <el-menu-item index="2-5"><a href="#nav2-5">删除</a></el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <a href="#nav3" slot="title">学生管理</a>
            </template>
            <el-menu-item index="3-1"><a href="#nav3-1">搜索</a></el-menu-item>
            <el-submenu index="3-2">
              <template slot="title">
                <a href="#nav3-2"  slot="title">学情报告</a>
              </template>
              <el-menu-item index="3-2-1"><a href="#nav3-2-1">切换学生</a></el-menu-item>
              <el-menu-item index="3-2-2"><a href="#nav3-2-2">创建报告</a></el-menu-item>
              <el-menu-item index="3-2-3"><a href="#nav3-2-3">查看</a></el-menu-item>
              <el-menu-item index="3-2-4"><a href="#nav3-2-4">删除</a></el-menu-item>
            </el-submenu>
            <el-menu-item index="3-3"><a href="#nav3-3">编辑</a></el-menu-item>
            <el-menu-item index="3-4"><a href="#nav3-4">密码重置</a></el-menu-item>
            <el-menu-item index="3-5"><a href="#nav3-5">删除</a></el-menu-item>
          </el-submenu>
        </el-menu>
        <div style="padding-left: 300px;">
          <div>
            <h3 id="nav1">班级管理</h3>
            <h4 id="nav1-1">查看</h4>
            <h5 id="nav1-1-1" >班级概览</h5>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h5 id="nav1-1-2" >操作状态</h5>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h5 id="nav1-1-3" >许可状态</h5>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav1-2">编辑</h4>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav1-3">删除</h4>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
          </div>
          <div>
            <h3 id="nav2">教师管理</h3>
            <h4 id="nav2-1">搜索</h4>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav2-2">添加教师</h4>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav2-3">编辑</h4>
            <p style="height: 500px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav2-4">编辑重置</h4>
            <p style="height: 500px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav2-5">删除</h4>
            <p style="height: 500px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
          </div>
          <div>
            <h3 id="nav3">学生管理</h3>
            <h4 id="nav3-1">搜索</h4>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav3-2">学情报告</h4>
            <h5 id="nav3-2-1">切换学生</h5>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说</p>
            <h5 id="nav3-2-2">创建报告</h5>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说</p>
            <h5 id="nav3-2-3">查看</h5>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说</p>
            <h5 id="nav3-2-4">删除</h5>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说</p>
            <p style="height: 200px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav3-3">编辑</h4>
            <p style="height: 500px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav3-4">编辑重置</h4>
            <p style="height: 500px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
            <h4 id="nav3-5">删除</h4>
            <p style="height: 500px;">使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明使用说明</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "helpDocs",
      data(){
          return{

          }
      },
      mounted(){

      }
    }
</script>

<style scoped>

  a{
    text-decoration:none;
    color:#333;
  }
  .title{
    padding: 20px;
    border-bottom: 1px solid #ddd;
    margin: 0;
    width: 100%;
    position: fixed;
    height: 30px;
    line-height: 30px
  }
  .container{
    width: 100%;
    position: absolute;
    top: 71px;
    height: calc(100% - 71px);
    display: flex;
    overflow-y: auto
  }
  .nav{
    height: calc(100% - 71px);
    width: 200px;
    position:fixed;
    left: 0;
    overflow-y:auto;
  }
  h2,h3,h4,h5{
    margin: 0;
    padding: 20px 0;
  }
</style>
