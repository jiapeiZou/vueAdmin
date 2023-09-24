<template>
    <div class="bgbox">
        <button class="btn" @click="toHome">首页</button>
       <img src="../../assets/images/error_images/404.png" >
    </div>
</template>

<script lang="ts" setup>
import router from "@/router/index"


// 点击首页
const toHome = () => {
    router.push('/home')
}

</script>

<style lang="scss" scoped>
.bgbox{
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .btn{
        height: 40px;
        width: 60px;
        margin-left: calc(50vw - 30px);
    }
    img{
        margin-left: calc(50vw - 250px);
         height: 400px;
         width: 800px;
    }
}
</style>