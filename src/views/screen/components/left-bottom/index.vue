<template>
    <div class="box">
        <div class="top">
            <div class="text">年龄比例</div>
            <div class="bg"></div>
        </div>
        <!-- echarts图形图表的展示区域 -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import { ref , onMounted } from 'vue';
import * as echarts from 'echarts'; // Echarts 图文图表插件
const charts = ref() // 获取图形图表的Dom节点
// // 页面加载完成后执行,因为它需要获取dom,需要渲染完才能获取 
onMounted(()=> {
    // 获取图形图表echarts实例
    const myChart = echarts.init(charts.value) 
    // 绘制图表
    myChart.setOption({
        // 标题组件
        tooltip: {
            trigger: 'item'
        },
        // 侧边图例组件
        legend: {
            top: '20%', // 距离上面 左边的距离
            left: "68%",
            orient: "vertical", // 图例组件方向设置（默认水平
            textStyle: {
            color: "#fff"
            }
        },
        series: [
            {
            type: 'pie', // 类型：饼状图
            radius: ['40%', '70%'], // 圆角
            center: ['40%', '55%'], // 移动饼图到你希望的位置
            avoidLabelOverlap: true, 
            itemStyle: {
                borderRadius: 10,
                borderWidth:0,
            },
            label: {
                show: true,
                position: 'inside',
                color:'#fff',
            }, 
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: '10岁以下  16%' },
                { value: 735, name: '10-18岁  8%' },
                { value: 580, name: '18-30岁  12%' },
                { value: 484, name: '30-40岁  20%' },
                { value: 300, name: '40-60岁  20%' },
                { value: 300, name: '60岁以上  20%' }
            ]
            }
        ]
    })
})

</script>

<style lang="scss" scoped>
.box{
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: cover;
    .top{
        .text{
            color: #fff;
            font-size: 20px;
        }
        .bg{
            height: 7px;
            width: 69px;
            margin-top: 8px;
            background: url(../../images/dataScreen-title.png) no-repeat;
        }
    }
    .charts{
        height: 220px;
    }
}
</style>