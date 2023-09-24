<template>
    <div class="container">
        <!-- 数据大屏显示区域 -->
        <div class="scree" ref="scree">
            <div class="top">
                <top/>
            </div>
            <div class="bottom">
                <!-- 左 -->
                <div class="left">
                    <Lefttop class="t" />
                    <Leftcenter class="c" />
                    <Leftbottom class="b" />
                </div>
                <!-- 中 -->
                <div class="center">
                    <Map class="map"></map>
                    <Line class="line" />
                </div>
                <!-- 右 -->
                <div class="right">
                    <Righttop class="rt" /> 
                    <Rightcenter class="rc" />
                    <Rightbtn class="rb" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref ,onMounted } from 'vue';
import top from './components/top/index.vue'; // 顶部子组件
import Lefttop from './components/left-top/index.vue'; // 底部左侧三个组件
import Leftcenter from './components/left-center/index.vue';
import Leftbottom from './components/left-bottom/index.vue';
import Map from './components/map/index.vue'; // 底部中间二个组件
import Line from './components/line/index.vue';
import Righttop from './components/right-top/index.vue'; // 底部右侧三个组件
import Rightcenter  from './components/right-center/index.vue';
import Rightbtn  from './components/right-btn/index.vue';

const scree = ref() // 获取中间显示区域的dom实例 
onMounted(() => {
    // 用js把固定定位在父元素宽高的50%的scree拉回来
    // 通过获取它的DOM实例，修改它的样式 调整元素的 transform 属性来改变其大小和位置，以便它能适应不同屏幕尺寸
    // scale(1,2)在X轴和Y轴上分别缩放的比例 translate平移
    scree.value.style.transform = `scale(${screeSizeChange()}) translate(-50%,-50%)`
} )
 
// 缩放的比例
function screeSizeChange (w = 1920, h = 1080) {
    const ww = window.innerWidth / w;  // 当前屏幕宽度/1920px
    const wh = window.innerHeight / h; // 当前屏幕高度/1080px
    return ww < wh ? ww : wh  // 并返回较小的一个，以确保内容能完全显示在屏幕上。
}
// 监听适口 屏幕宽高的变化
window.onresize = () => {
    // 调整元素的 transform 属性来改变其大小和位置，以便它能适应不同屏幕尺寸
    scree.value.style.transform = `scale(${screeSizeChange()}) translate(-50%,-50%)`
}

</script>

<style lang="scss" scoped>
.container{
    margin: 0;
    height:100vh;
    width:100vw;
    background: url(./images/bg.png) no-repeat;
    background-size: cover;
    .scree{
        margin-top: 10px;
        width:1920px;
        height:1080px;
       
        position: fixed; // 固定定位
        left: 50%; // 父元素宽高的一半
        top: 50%;
        transform-origin: left top ; // 用于设置元素变形的原点
        .top{
            width:100%;
            height:40px;
        }
        .bottom{
            display: flex;
            .left{
                height:1040px;
                flex: 1;
                display: flex;
                flex-direction: column;
                .t{
                    flex: 1.5;
                    margin-top: 20px;
                }
                .c{
                    flex: 1;
                    margin-top: 20px;
                }
                .b{
                    flex: 1;
                    margin: 20px 0;
                }
            }
            .center{
                height:1040px;
                flex: 2;
                display: flex;
                flex-direction: column;
                .map{
                    flex:2;
                }
                .line{
                    flex:1;
                }
            }
            .right{
                height:1040px;
                flex: 1;
                display: flex;
                flex-direction: column;
                .rt{
                    flex: 1.5;
                    margin-top: 20px;
                }
                .rc{
                    flex: 1;
                    margin-top: 20px;
                }
                .rb{
                    flex: 1;
                    margin: 20px 0;
                }
            }
        }
    }
}
</style>