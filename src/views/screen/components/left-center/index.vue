<template>
    <div class="box">
        <div class="top">
            <div class="text">男女比例</div>
            <div class="bg"></div>
        </div>
        <div class="center">
            <div class="manbg">
                <div class="boy">男士</div>
                <div class="man"></div>
            </div>
            <div class="womanbg">
                <div class="gilr">女士</div>
                <div class="woman"></div>
            </div>
        </div>
        <div class="bottom">
            <p>男士58%</p>
            <p>女士42%</p>
        </div>
        <div class="echarts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'; // Echarts 图文图表插件
import { ref, onMounted } from 'vue'
const charts = ref() // 获取图形图表的Dom节点
// 页面加载完成后，执行
onMounted(() => { 
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(charts.value)
    // 绘制图表
    myChart.setOption({
        xAxis:{
            show:false, // 不显示x轴
            min:0,
            max:100,
        },
        yAxis:{
            show:false, // 不显示y轴
            type:'category' // 在y轴上显示
        },
        series:[{
            type:'bar', // 柱形图
            data:[58],
            barWidth:20, // 柱条宽度
            z:999, // 显示在上层 （默认为2，这样才能不被红色柱条覆盖）
            color: '#3973fc',
            itemStyle: { // 柱条样式 
                borderRadius:8, // 圆角
            }
            
        },{
            type:'bar', // 第二个柱形图
            data:[100],
            barWidth:20,
            color:'#f96161',
            barGap:'-100%', // 调整红色柱条，与蓝色重叠
            itemStyle: {
                borderRadius:8,
            }
        }
        ],
        grid:{ // 布局
            top:0,
            bottom:0,
            left:0,
            right:60,
        }
    })
})

</script>

<style lang="scss" scoped>
.box{
    background: url(../../images/dataScreen-main-lc.png) no-repeat;
    background-size: 100%;
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
    .center{
        padding: 0 40px;
        margin-top: 40px;
        display: flex;
        justify-content: space-around;
        .womanbg{
            height: 110px;
            width: 110px;
            background: url(../../images/woman-bg.png) no-repeat;
            background-size: 100% ;
            .gilr{
                 color:#fff;
                 font-size: 16px;
                 text-align: center;
            }
            .woman{
                margin:15px 0 0 30px;
                height: 60px;
                width: 60px;
                background: url(../../images/woman.png) no-repeat;
                background-size: 100% ;
            }
        }
        .manbg{
            height: 110px;
            width: 110px;
            background: url(../../images/man-bg.png) no-repeat;
            background-size:cover;
            .boy{
                text-align: center;
                color: #fff;
                font-size: 16px;
            }
            .man{
                height: 60px;
                width: 60px;
                margin:15px 0 0 30px;
                background: url(../../images/man.png) no-repeat;
                background-size: 100% ;
            }
        }
    }
    .bottom{
        display: flex;
        justify-content: space-around;
        margin-top:12px;
        p{
            color: #fff;
            font-size: 16px;
            margin: 0;
        }
    }
    .echarts{
        margin:0 0 10px 70px ;
        height: 40px;
        width: 350px;
       
    }
}
</style>