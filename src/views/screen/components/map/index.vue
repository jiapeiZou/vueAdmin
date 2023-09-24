<template>
    <div class="box">
        <div class="top">
            <div class="text">平台高峰预警信息(2条)</div>
        </div>
        <div class="left">景区实时客流量</div>
        <div class="map" ref="map">     
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref , onMounted } from 'vue';
import chinaJSON from './china.json'; // 地图图表所需的中国地图 json数据
import * as echarts from 'echarts' ;
const map = ref() // 获取dom 

// 注册中国地图  名称：'china', 文件：chinaJson
echarts.registerMap('china', chinaJSON)
// 页面加载完成后
onMounted(()=> {
    //基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(map.value)
    // 设置图表
    myChart.setOption({
        // 地图组件
        geo: {
            map: 'china',
            left: 100,
            top:0,
            right:120,
            // 地图组件的颜色 与边框颜色
            itemStyle:{ 
                areaColor:{ // 地图各区域的 线性渐变颜色
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{ 
                    offset: 0, color: '#1f83fe' // 0% 处的颜色
                }, {
                    offset: 1, color: '#18327a' // 100% 处的颜色
                }],
                global: false 
                },
                borderColor:'#29fcff', // 各地区边缘线的颜色
            }, 
            // 文本
            label: {
                color: '#fff',
                show:true,
            },
            // 各地区被选中时 高亮时
            emphasis:{ 
                itemStyle:{
                    areaColor:'#29fcff',
                },
                label: {
                    fontSize:18
                },
            },
        },
              // 路径组件
            series:[
                // 第一条路径
                {
                type: 'lines',
                data:[{
                    coords: [
                        [116.405285, 39.904989],  // 起点 (经度, 纬度)
                        [119.306239, 26.075302]  // 终点 (经度, 纬度)
                    ],
                }],
                lineStyle: {  // 线的样式
                    normal: {
                        color: '#fff',
                        width: 1,
                        curveness: 0.2 // 曲线的弯曲程度，0 是直线，1 是完全弯曲
                    }
                },
                effect:{ // 路径的特效效果（否则就是一条直线）
                    show: true, 
                    symbol:'triangle', // 三角形
                    symbolSize:20, // 移动物体大小
                    color:'#fff',
                    trailLength:0.1 // 移动时后面的阴影
                },
            },
            { // 第二条路径
                type: 'lines',
                data:[{
                    coords: [
                        [113.54909,
                    22.198951],  // 起点
                        [ 87.617733,
                    43.792818]  // 终点
                    ]
                }],
                effect:{ // 路径的特效效果（否则就是一条直线）
                    show: true, 
                    symbol:'triangle', // 三角形
                    symbolSize:20, // 移动物体大小
                    color:'#fff',
                    trailLength:0.1 // 移动时后面的阴影 
                },
                lineStyle: {  // 线的样式
                    normal: {
                        color: '#fff',
                        width: 1,
                        curveness: 0.2 // 曲线的弯曲程度，0 是直线，1 是完全弯曲
                    }
                }
            },{ // 第三条路径
                type: 'lines',
                data:[{
                    coords: [
                        [ 91.132212, 29.660361],  // 起点
                        [  111.670801, 40.818311]  // 终点
                    ]
                }],
                effect:{ // 路径的特效效果（否则就是一条直线）
                    show: true, 
                    symbol:'triangle', // 三角形
                    symbolSize:20, // 移动物体大小
                    color:'#fff',
                    trailLength:0.1 // 移动时后面的阴影  117.283042,31.86119
                },
                lineStyle: {  // 线的样式
                    normal: {
                        color: '#fff',
                        width: 1,
                        curveness: 0.2 // 曲线的弯曲程度，0 是直线，1 是完全弯曲
                    }
                }
            }
            ]
    })
})

</script>

<style lang="scss" scoped>
.box{
   .top{
    margin-top: 30px ;
    margin-left: 160px;
     width:100% ;
     height:50px;
    .text{
        padding-top: 10px;
        color:#fff;
        text-align: center;
        width:70% ;
        height: 100%;
        background: url(../../images/dataScreen-header-warn-bg.png)no-repeat;
        background-size: 100%;
    }
   } 
   .left{
    color: #fff;
    font-size: 16px;
    margin-left: 40px;
    padding-top: 5px;
    text-align: center;
    width: 250px ;
    height: 25px;
    background: url(../../images/map-title-bg.png) no-repeat;
    background-size: cover ;
   }
   .map{
    height: 670px;
    width: 100%;
   }
}
</style>