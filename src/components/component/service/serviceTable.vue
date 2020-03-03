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
        <!--学堂首页-->
        <el-table
          v-for="(version,vIndex) in versionDetail"
          :key="vIndex"
          :data="version.table"
          :header-row-style="{'color':'#333','fontSize':'16px'}"
          style="width: 100%"
        >
          <el-table-column prop="name" :label="version.title"></el-table-column>
          <el-table-column :label="vIndex==0?'基础版':''" align="center" width="220" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="status-wrapper">
                <div v-show="scope.row.base==1" class="available-item"/>
                <div v-show="scope.row.base==2" class="un-available-item"/>
                <div v-show="scope.row.base==3" class="wait-available-item"/>
                <div v-show="scope.row.bMsg && scope.row.bMsg!=''" style="margin-top:10px"><span style="color:#333;font-weight:bold">{{scope.row.bMsg}}</span></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="professional" :label="vIndex==0?'专业版':''" align="center" width="220" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="status-wrapper">
                <div v-show="scope.row.professional==1" class="available-item"/>
                <div v-show="scope.row.professional==2" class="un-available-item"/>
                <div v-show="scope.row.professional==3" class="wait-available-item"/>
                <div v-show="scope.row.bMsg && scope.row.bMsg!=''" style="margin-top:10px"><span style="color:#333;font-weight:bold">{{scope.row.bMsg}}</span></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ultimate" :label="vIndex==0?'旗舰版':''" align="center" width="220" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="status-wrapper">
                <div v-show="scope.row.ultimate==1" class="available-item"/>
                <div v-show="scope.row.ultimate==2" class="un-available-item"/>
                <div v-show="scope.row.ultimate==3" class="wait-available-item"/>
                <div v-show="scope.row.bMsg && scope.row.bMsg!=''" style="margin-top:10px"><span style="color:#333;font-weight:bold">{{scope.row.bMsg}}</span></div>
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
            versionDetail: {
                type: Array,
                default: function(){
                    return [{title:'',table:[{name:'',base:1,professional:1,ultimate:1}]}]
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
