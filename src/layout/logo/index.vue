<template>
    <div class="logo">
        <img :src="setting.logo" alt="">
        <p>{{setting.title}}</p>
    </div>
</template>

<script lang="ts" setup>
import setting from '@/setting';// 引入logo/标题的配置文件
</script>

<style lang="scss" scoped>
.logo{
    width: 100% ;
    height:$bace-menu-logo-height ;
    display: flex;
    align-items: center;
    padding: 10px;
    
    img{
        width: 40px;
        height: 40px;
    }
    p{
        color: #fff;
        font-size: 20px;
        margin: 0 0 0 10px;
        width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>