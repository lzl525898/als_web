<template>
  <div>
    <div class="container">
      <div v-for="img in imgUrlArray">
<!--        <img :src="img">  -->
        <img v-lazy="img">
      </div>
    </div>
  </div>
</template>

<script>
  import PubSub from "pubsub-js";
  import $ from "jquery";
  import storageUtil from "../../utils/storageUtil";
  import promptUtil from "../../utils/promptUtil";
  import vuexUtil from "../../utils/vuexUtils";
  import loginHeader from "./loginHeader.vue";
  import '../../api/restfulapi';
  import {
    qs,
    getHelpImageUrl,
    getLiveHelpImageUrl
  } from "../../api/api";
  export default {
    data() {
      return {
        imgUrlArray:[],
      };
    },
    mounted() {
      promptUtil.checkOverdue(this, storageUtil.readTeacherInfo().id) // true 表示已过期 false表示未过期
      const loading = promptUtil.loading(this)
      // console.log("this.$store.state.helpPageType",this.$store.state.helpPageType)
      if(this.$store.state.helpPageType==2){ // 直播管理员帮助
        getLiveHelpImageUrl(qs.stringify({})).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data !='[]'){
              this.imgUrlArray=res.data
            }
          } else {
            promptUtil.wait(this)
          }
          loading.close()
        }).catch(error => {
          promptUtil.LOG('getLiveHelpImageUrl-err',error)
          loading.close()
        })
      }else {
        getHelpImageUrl(qs.stringify({})).then(res => {
          if (res.code == SUCCESS_CODE) {
            if (res.data && res.data !='[]'){
              this.imgUrlArray=res.data
            }
          } else {
            promptUtil.wait(this)
          }
          loading.close()
        }).catch(error => {
          promptUtil.LOG('getHelpImageUrl-err',error)
          loading.close()
        })
      }
    },
    methods:{

      }
  };
</script>
<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }

  .container img {
    width: 100%;
    height: 100%;
  }
</style>
