<template>
    <div>
      <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "mobileHomeContainer",
        data(){
            return {
                isMobile:false
            }
        },
        mounted() {
            this.$router.push({path: '/home/mobile/index'})
        },
        destroyed() {
            window.onresize = null
        }
    }
</script>

<style scoped>

</style>
