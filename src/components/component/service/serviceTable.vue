<template>
    <div style="padding: 50px;margin-top:20px">
      <div style="text-align: center;margin-bottom:20px;font-weight:bold;font-size:24px">功能列表展示</div>
      <div style="display:flex;justify-content:center;margin-bottom:50px">
        <div style="display:flex;align-items:center">
          <div class="available-item"/><span style="margin-left:5px">包含</span>
        </div>
        <div style="display:flex;align-items:center;margin-left:20px">
          <div class="wait-available-item"/><span style="margin-left:5px">不包含（支持独立购买）</span>
        </div>
        <div style="display:flex;align-items:center;margin-left:20px">
          <div class="un-available-item"/><span style="margin-left:5px">不包含（不支持独立购买）</span>
        </div>
      </div>
      <div style="border:1px solid #EBEEF5">
        <el-table
          v-for="(version,vIndex) in versionDetail"
          :key="vIndex"
          :data="version.table"
          :header-row-style="{'color':'#333','fontSize':'16px'}"
          style="width: 100%"
        >
          <el-table-column prop="name" :label="version.title"></el-table-column>
          <el-table-column :label="vIndex==0?versionList[index]:''" align="center" show-overflow-tooltip v-for="(type,index) in versionList" :key="index">
            <template slot-scope="scope">
              <div class="status-wrapper">
                <div v-show="version.table[scope.$index].version[index]==1" class="available-item"/>
                <div v-show="version.table[scope.$index].version[index]==2" class="un-available-item"/>
                <div v-show="version.table[scope.$index].version[index]==3" class="wait-available-item"/>
                <div v-show="version.table[scope.$index].msg[index] && version.table[scope.$index].msg[index]!=''" style="margin-top:10px">
                  <span style="color:#333;font-weight:bold">{{version.table[scope.$index].msg[index]}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
    export default {
        name: "serviceTable",
        props:{
            versionList: {
                type: Array,
                default: function(){
                    return []
                }
            },
            versionDetail: {
                type: Array,
                default: function(){
                    return []
                }
            }
        },// 1 可用 2不可用 3待定
    }
</script>

<style scoped>
  .status-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .available-item{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #40a9ff;
  }
  .un-available-item{
    width: 10px;
    height: 3px;
    background: #7a92b9;
  }
  .wait-available-item{
    width: 10px;
    height: 10px;
    opacity: 0.4;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 2px solid #7a92b9;
  }
</style>
