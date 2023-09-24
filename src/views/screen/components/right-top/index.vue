<template>
    <div class="box">
        <div class="text">热门景区排行</div>
        <img src="../../images/dataScreen-title.png">
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script lang="ts" setup>
import {ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(()=> {
    const mychart = echarts.init(charts.value)
    mychart.setOption({
        // 标题组件
        title:{
            top:'10%',
            left:'center', 
            text:'景区人气排行', // 主标题
            textStyle:{
                color:'#fff'
            },
            subtext:'预约数量', // 副标题
            subtextStyle:{
                color:'#e9942c',
                align:'center',
            }
        },
        // x|y轴 组件
        xAxis:{
            type:'category',
            data:["三亚", "北京", "桂林", "澳门", "泰国", "草原", "湖泊"]
        },
        yAxis:{
            splitLine: {
                show:false,
            },
             axisTick:{ // 是否显示坐标轴刻度
                show:true
            },
            axisLine:{ // 是否显示坐标轴
                show:true
            },
        },
        // 系列组件：决定显示哪一种图文图表（如果一个人容器要显示多个图表用数组，显示一个用对象）
        series:[
            { // 柱状图
                type:'bar',
                data:[130,147,242,78,427,348,165], // 数据
                label:{
                    show: true,
                    color:'#fff',
                    position:'top', // 标签的位置
                },
            },
            { // 折线图
                type:'line',
                data:[240,87,342,178,227,448,65], // 数据
                smooth : true, // 是否平滑曲线显示。
            }
        ],
        // 布局组件
        grid:{
            top:100,
            left:40,
            right:20,
            bottom:60,
            tooltip: {
                show: true,
                 backgroundColor:'rgba(50,50,50,0.7)'
            }
        },
    })
}) 
</script>

<style lang="scss" scoped>
.box{
    background: url(../../images/dataScreen-main-rt.png) no-repeat;
    background-size:cover;
    .text{
        color: #ffffff;
        font-size: 20px;
    }
    .charts{
        height: 370px;
    }
}
</style>