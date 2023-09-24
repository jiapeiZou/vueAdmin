<template>
    <div class="box">
        <div class="text"> 预约渠道数据统计</div>
        <img src="../../images/dataScreen-title.png" >
        <div class="charts2" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(()=> {
    const mychart = echarts.init(charts.value)
    mychart.setOption({
        // 图例组件
        legend: {
            orient:'vertical',
            itemWidth:14,
            left:10,
            top:40,
            data: ['携程','飞猪','广告','其他'],
            textStyle:{
                color:'#fff'
            }
        },
        // 布局组件

        // 类型组件
          series: [
            // 里层圆
            {
                type: 'pie',
                radius: [0, '30%'],
                label: { // 文本显示在内部
                    position: 'inner',
                    fontSize: 14
            },
            data: [
                { value: 1548, name: '团体' },
                { value: 1548, name: '个人' },
                { value: 775, name: '家庭' },
                { value: 679, name: '情侣',}
            ]
            },
            // 外层圆
            {
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: { // 线条连接长度
                length: 10
            },
            label: { // 文本显示在外部
                position:'outside'
            },
            data: [
                { value: 1048, name: '携程' },
                { value: 335, name: '飞猪' },
                { value: 310, name: '广告' },
                { value: 251, name: '其他' },
            ]
            }
        ]
    })
})
</script>

<style lang="scss" scoped>
.box{
    margin-top: 20px;
    background: url(../../images/dataScreen-main-lc.png) no-repeat;
    background-size: 100%;
    .text{
        color: #fff;
        font-size: 20px;
    }
    .charts2{
       height: 200px;
    }
}
</style>