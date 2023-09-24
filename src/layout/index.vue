<template>
    <div class="container">
        <!-- 左侧菜单 -->
        <div class="slider" :class="{isFold: settingStore.iscollapse ? true : false }">
            <!-- 子组件:logo -->
            <Logo></Logo>
            <!-- 滚动效果 -->
            <el-scrollbar class="scrollbar">
                 <!-- 菜单 -->
                <el-menu  :collapse="settingStore.iscollapse" :default-active="route.path" background-color="$bace-menu-background"  text-color="#fff"  >
                    <!-- 子组件: 菜单 -->
                   <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>

        <!-- 顶部导航 -->
        <div class="tabber" :class="{is: settingStore.iscollapse ? true : false }">
            <!-- 子组件:顶部面包屑导航 -->
            <Tabbar></Tabbar>
        </div>

        <!-- 内容展示区域 -->
        <div class="main" :class="{is: settingStore.iscollapse ? true : false }" v-if="flag">
            <!-- 二级路由出口 -->
            <router-view></router-view>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '@/layout/logo/index.vue';// 引入子组件:左侧logo
import  Menu from '@/layout/menu/index.vue'; // 引入子组件: 菜单
import Tabbar from '@/layout/tabbar/index.vue'; // 引入子组件:顶部面包屑导航
import { useUserStore } from '@/store/modules/user'; // 引入小仓库
import pinia from '@/store';
import { layOutSettingStore } from '@/store/modules/setting'; // 引入小仓库

const route = useRoute()
const userStore = useUserStore(pinia)
const settingStore = layOutSettingStore(pinia)
// 监听仓库内部刷新数据 是否发生变化， 如果发生变化，说明用户点击来更新按钮，需要销毁 重建
const flag = ref(true)
watch(() => settingStore.refresh, () => {
   flag.value = false
   nextTick(()=>{ // nextTick 让你能在 DOM 实例被更新后立即执行某个操作
     // 这时候 DOM 已经更新(再让v-if重新创建)
    flag.value = true 
    //alert(123)
   })
})

</script>

<style>
body{
    margin: 0px;
}
</style>
<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100vh;
    .slider{
        width: $bace-menu-width;
        height: 100vh;
        background: $bace-menu-background;
        color: #fff;
        transition: all 0.6s;
        .scrollbar{
            height: calc(100vh - $bace-menu-logo-height - 40px);
            .el-menu{
                border-right: none; // 去除滚动条
            }
        }
    }
    .isFold{ // 菜单折叠后的样式
        width:$bace-menu-min--width;
    }
    .tabber{
        width: calc(100% - $bace-menu-width);
        height: $bace-tabber-height;
        position: fixed;
        top: 0;
        left:$bace-menu-width;
        color: #000;
        transition: all 0.6s;
        border-bottom: 1px solid #686767;
    }
    // .is{ // 顶部面包屑展开后的样式
    //     width: calc(100vw - $bace-menu-min--width);
    //     left:$bace-menu-min--width;
    // }
    .main{
        position: absolute;
        width: calc(100% - $bace-menu-width);
        height:calc(100vh - $bace-tabber-height);
        top: $bace-tabber-height;
        left: $bace-menu-width;
        overflow-y: auto;
        transition: all 0.6s;
    }
    .is{ // 顶部面包屑 & 内容区 展开后的样式
        width: calc(100vw - $bace-menu-min--width);
        left:$bace-menu-min--width;
    }
}
</style>