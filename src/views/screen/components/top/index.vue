
<template>
    <div class="top">
        <div class="left">
            <span class="l-btn" @click="goHome">首页</span>
        </div>
        <div class="center">
            <div class="title">智慧旅游可视化大数据平台</div>
        </div>
        <div class="right">
            <span class="r-btn"> 统计报告</span>
            <span class="time">当前时间:{{time}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
// 数据大屏 top顶部 子组件
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import moment from 'moment'

const time = ref() // 存储当前时间
const timer = ref() // 存储 定时器1秒后的时间
const router = useRouter()
// 首页按钮
const goHome = () => {
    router.push('/home')
}
// 事实更新时间 页面渲染加载后 ，定时每秒更新一次时间
onMounted(() => {
    timer.value = setInterval(() => {
        time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
    }, 1000)
})
// 组件销毁时 清除定时器
onBeforeUnmount(()=> {
    clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.top{
    display:flex;
    width:100%;
    height:40px;
    .left{
        flex:1.5;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;

        .l-btn{
            float: right;
            color: #29fcff;
            width:150px ;
            height:40px ;
            background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
            background-size: 100% 100%;
            line-height: 40px;
            text-align: center;
            font-size: 20px;
        }
    }
    .center{
        flex:2;
        background: url(../../images/dataScreen-header-center-bg.png) no-repeat ;
        background-size: 100% 100%;
        width: 100%;
        height: 74px;
        line-height: 74px;
        text-align: center;
        color: #29fcff;
        font-size: 30px;
    }
    .right{
        flex:1.5;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
        background-size:cover;
        .r-btn{
            background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
            background-size: 100% 100%;
            width:150px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #29fcff;
            font-size: 20px;
        }
        .time{
            margin-right: 10px;
            line-height: 40px;
            color: #29fcff;
            text-align: center;
            font-size: 20px;
        }
    }
}
</style>
