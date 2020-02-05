<template>
  <div>
    <!--    面包屑-->
    <el-row>
      <el-col :span="24">
        <als-child-header :config="routerConfig"/>
      </el-col>
    </el-row>
    <div style="width: 1000px;margin: 0 auto">
    <el-row style="margin-top: 20px">
      <el-card>
        <el-col :span="11">
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item in productImgCarousel" :key="item.id">
              <img :src=item alt="" style="width: 100%;height: 100%;object-fit: scale-down;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="11" :offset="1">
          <h3 class="productTitle">{{productInformation.title}}</h3>
          <p>奥松售价:&nbsp&nbsp<span style="color: red;font-size: 18px">{{productInformation.price}}</span></p>
          <p>商品编号:&nbsp&nbsp{{productInformation.number}}</p>
          <p>商品库存:&nbsp&nbsp{{productInformation.stock}}</p>
          <p>商品重量:&nbsp&nbsp{{productInformation.weight}}</p>
          <p>商品品牌:&nbsp&nbsp{{productInformation.brand}}</p>
          <div v-if="optional!=null&&optional.length!=0">
            <p v-for="item in optional" v-if="item.title!=''&&item.con!=''">
              {{item.title}}:{{item.con}}
            </p>
          </div>
<!--          <p><el-link type="primary" :underline="false">购买请联系客服</el-link></p>-->
          <div style="float: left;">
            <el-popover
              placement="right"
              width="150"
              trigger="hover">
              <div>
                <img :src=callUs.img alt="" style="width: 150px">
                <p style="text-align: center">{{callUs.tel}} </p>
              </div>
              <el-link type="primary" :underline="false" slot="reference" style="margin-bottom: 20px">购买请联系客服</el-link>
            </el-popover>
          </div>
        </el-col>
      </el-card>
    </el-row>
    </div>

    <div style="width: 1000px;margin: 0 auto">
    <el-row>
      <el-card style="margin-top: 10px;">
        <div class="imgBorder">
          <p style="text-align: center"><span class="decTitle">商品详情</span></p>
          <div style="margin-top: 30px;margin-bottom: 20px">
            <div v-html="productInformation.productDes"> {{productInformation.productDes}}</div>
          </div>
        </div>
      </el-card>
    </el-row>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";
  import promptUtil from "../../../utils/promptUtil";
  import storageUtil from "../../../utils/storageUtil";
  import '../../../api/restfulapi';
  import {qs, getSchoolDueInfo, equipmentDesc} from "../../../api/api";
  import childHeader from '../../component/childHeader'
  import customLoading from '../../component/customLoading'
  import vuexUtils from "../../../utils/vuexUtils";
  import vueQr from "vue-qr";

  export default {
    components: {"als-child-header": childHeader,vueQr},
    data() {
      return {
        routerConfig: [{
          name: vuexUtils.checkMenuExist(this, 'equipment').target.name,
          to: '/equipment'
        }, {name: '产品详情', to: '/equipment/' + this.$route.params.id}],
        productInformation: {
          title: '',
          price: '',
          number: '',
          stock: '',
          weight: '',
          brand: '',
          productDes:'',
        },
        optional:[],
        productImgCarousel: [],
        callUs:{tel:'',img:''}

      }
    },
    mounted() {
      getSchoolDueInfo(qs.stringify({
        school_id: storageUtil.readTeacherInfo().school_id,
        user_id: storageUtil.readTeacherInfo().id
      })).then(res => {
        if (res.code == SUCCESS_CODE) {
          if (res.data && res.data != '[]') {
            this.callUs.tel = res.data.tel
            this.callUs.img = res.data.qrcode
          }
        } else if (res.code == ERROR_CODE) {
          promptUtil.error(this, res.msg)
        } else {
          promptUtil.wait(this)
        }
      }).catch(err => {
        promptUtil.LOG('getSystematicStatistics-err', err)
      })



      equipmentDesc(qs.stringify({
        equipment_id:this.$route.params.id,
      })).then(res=>{
        if (res.code==SUCCESS_CODE){
          if (res.data&&res.data!='[]'){
            this.assignmentDes(res.data)
          }
        } else if(res.code==ERROR_CODE){
          promptUtil.error(this,res.msg)
        }else{
          promptUtil.wait(this)
        }
      }).catch(err=>{
        promptUtil.LOG('equipmentDesc-err',err)
      })
    },
    methods: {

      assignmentDes(data){
        this.productInformation={
          title: data.title,
          price: data.price,
          number: data.product_num,
          stock: data.stock,
          weight: data.produc_weight,
          brand: data.produc_brand,
          productDes:data.text
        }
        this.productImgCarousel=data.pics
         this.optional=data.option
      }

    }
  }
</script>
<style scoped>
  .productTitle {
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 8px;
    color: #494949;
  }

  .decTitle {
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 8px;
  }

  .imgBorder {
    border: 1px solid #e6e6e6;
  }
</style>
