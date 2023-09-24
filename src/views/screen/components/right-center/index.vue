<template>
    <div class="box">
        <div class="text"> 年度游客量对比</div>
        <img src="../../images/dataScreen-title.png" >
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(()=> {
    const mychart = echarts.init(charts.value)
    mychart.setOption({
        // 标题组件
        title: {
            text: "游客量对比",
            right:5,
            textStyle:{
                color:'#29fcff',
            }
        },
        // 图例组件
        legend:{
            bottom:5,
            right:2,
            itemHeight:5,
            itemWidth:20,
            show:true,
            data: ["2022年", "2023年"],
            textStyle:{color:'#fff'} 
        },
        // 雷达组件
        radar:{
            indicator: [
                { name: '北京', max: 6500},
                { name: '杭州', max: 16000, color: 'red'}, // 标签设置为红色
                { name: '新疆', max: 30000},
                { name: '西藏', max: 38000},
                { name: '桂林', max: 52000},
                { name: '重庆', max: 25000}
            ]
         },
        // 系列组件
        series:{
            type:'radar', // 雷达图
            data: [{
                value: [4300, 10000, 28000, 35000, 50000, 19000],
                name: "2022年"
                }, {
                value: [5000, 14000, 28000, 31000, 42000, 21000],
                name: "2023年"
                }],
            itemStyle: {
                color:{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'red' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                    }
                }
        },
    })
})


</script>

<style lang="scss" scoped>
.box{
    margin-top: 20px;
    background: url(../../images/dataScreen-main-lc.png) no-repeat;
    background-size: cover;
    .text{
        color: #fff;
        font-size: 20px;
    }
    .charts{
      height: 230px;
    }
}
</style>