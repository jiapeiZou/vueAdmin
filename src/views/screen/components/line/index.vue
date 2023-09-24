<template>
    <div class="box">
       <div class="text">未来30天游客量趋势图</div>
       <img src="src/views/screen/images/dataScreen-title.png" >
       <div class="line" ref="line"></div>
    </div>
</template>

<script setup lang="ts">
import { ref , onMounted } from 'vue';
import * as echarts from 'echarts';
const line = ref() // 获取DOM

onMounted(() => {
    const mychart = echarts.init(line.value)
    mychart.setOption({
        // 标题组件
        title:{
            text:'(访问量)',
            textStyle:{
                fontSize:15,
            } 
        },
        // x轴|y轴
        xAxis:{
            data:['09/25','09/26','09/27','09/28','09/29','09/30','10/01','10/02','10/03','10/04','10/05','10/06'],
            type:'category', // 均匀间隔
        },
        yAxis:{
            splitLine:{ // // 是否显示坐标分隔线
                show:false
            },
            axisTick:{ // 是否显示坐标轴刻度
                show:true
            },
            axisLine:{ // 是否显示坐标轴
                show:true
            },
        },
        // 系列
        series : [
           {
            type: 'line',
            smooth: true, // 平滑曲线
            areaStyle: {  // 区域填充样式（线性渐变
                color :{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'orange' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
            }},
            data: [1300,9208,21000,6638,18007,22634,30388,14000, 9374,13440,2344,6800],
           }
        ],
        // 布局
        grid:{
            left:50,
            top:30,
            bottom:30,
            right:0,
        }
     })
})

</script>

<style lang="scss" scoped>
.box{
    width: 1000px;
    height: 220px;
    margin: 0 40px 0 40px;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100%;
    .text{
        color: #fff;
        font-size: 20px;
    }
    // .img{
    //      width: 100%;
    //      height: 100%;
    // }
    .line{
        height: 180px;
    }
}
</style>