<template>
    <div class="box">
        <div class="title">
            <div class="text"> 实时游客统计</div>
            <div class="bg"></div>
            <div class="totle"> 可预约总量 <span>99999</span> 人</div>
        </div>
        <div class="people">
            <span v-for="(item, index) in total" :key=index >{{item}}</span>
        </div>
        <!-- 水晶球 Echarts -->
        <div class="ball" ref="ball" ></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'; // Echarts 图文图表插件
import 'echarts-liquidfill' // 水晶球 Echarts拓展插件
const total = ref('216908人')
const ball = ref() // 获取需要图标的Dom

onMounted(()=> {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(ball.value);
    // 绘制图表
    myChart.setOption({
        // 标题
        title: { text: '水球图' },
        // x轴|y轴 组件
        // xAxis: {},
        // yAxis: {},
        // 类型组件
        series:{
            type: 'liquidFill', // 类型：柱状图，饼状图··
            data: [0.6,0.2,0.12], // 数据
            radius:'80%',
            outline: {
                itemStyle: {
                    borderColor:'#29fcff'
                }
            }
        },
    });
})
</script>

<style lang="scss" scoped>
.box{
    padding: 10px;
    background: url(../../images/dataScreen-main-lt.png) no-repeat;
    background-size: cover;
    .title{
        color: #fff;
        .text{
            font-size: 20px;
        }
        .bg{
            height: 7px;
            width: 69px;
            margin-top: 8px;
            background: url(../../images/dataScreen-title.png) no-repeat;
        }
    }
    .totle{
        float: right;
        color: #fff;
        span{
            color: #ed9818;
        }
    }
    .people{
        display: flex;
        margin:30px 0 10px 0;
        span {
            color: #29fcff;
            font-size: 40px;
            text-align: center;
            line-height: 70px;
            height: 70px;
            flex: 1;
            background: url(../../images/total.png);
        }
    }
    .ball {
        height: 250px;
    }
}
</style>