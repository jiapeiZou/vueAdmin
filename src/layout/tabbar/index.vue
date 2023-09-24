<template>
    <div class="tabbar">
        <!-- layout顶部 ：左侧 -->
       <div class="tabbar_left">
        <el-icon style="margin-right:10px;" @click="changeIcon">
            <!-- 动态组件 根据小仓库中的 是否展示or隐藏菜单 来切换icon -->
            <component :is=" settingStore.iscollapse ? 'Expand' : 'Fold' "></component>
        </el-icon>
        <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="(item, index) in route.matched" :key="index" v-show="item.meta.title" :to="item.path">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                {{ item.meta.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
       </div>
       <!-- layout顶部 ：右侧 -->
       <div class="tabbar_right">
            <el-button icon="Refresh"  circle  @click="handleRefresh"></el-button>
            <el-button icon="FullScreen"  circle @click="handleFullScreen"></el-button>
            <el-popover
                title="主题设置"
                :width="300"
                trigger="hover"
            >
                <el-form>
                    <el-form-item label="主题颜色">
                        <el-color-picker v-model="color" show-alpha :predefine="predefineColors" @change="newcolor" />
                    </el-form-item>
                    <el-form-item label="暗黑模式">
                        <el-switch v-model="isDark" @change="changeDark" />
                    </el-form-item>
                </el-form>
                <template #reference>
                    <el-button icon="Setting"  circle ></el-button>
                </template>
            </el-popover>
            <img :src="userStore.userAvatar" style="height:32px; width:32px; margin:0 15px; border-radius: 16px;">
            <el-dropdown>
                <span class="el-dropdown-link">
                {{ userStore.userName }}
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="handleLogOut">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
       </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { layOutSettingStore } from '@/store/modules/setting' // 仓库
import { useUserStore } from '@/store/modules/user' // 仓库获取用户信息
import pinia from '@/store'

const settingStore = layOutSettingStore(pinia)
const userStore = useUserStore(pinia)
const route = useRoute()
const router = useRouter()
const color = ref('rgba(255, 69, 0, 0.68)')
const isDark = ref(false)
 console.log(color.value);
 
// 展开 隐藏菜单
const changeIcon = () => {
    settingStore.iscollapse = !settingStore.iscollapse
}
// 点击刷新
const handleRefresh = () => { 
    settingStore.refresh = !settingStore.refresh
}
// 点击全屏切换
const handleFullScreen = () => {
    // 获取当前是否全屏 作为判断条件
    const isFull = document.fullscreenElement
    if(!isFull){
        // 非全屏 -> 文档根节点的方法requestFullscreen(),实现全屏模式
        document.documentElement.requestFullscreen()
    } else {
        // 全屏 -> 退出全屏
        document.exitFullscreen()
    }
}
// 点击退出登陆
const handleLogOut = async() => {
    // 1.向服务器发送请求 调退出登陆接口（mock中没有 忽略这一步）
    // 2.调用仓库方法 清空用户信息
    await userStore.logout()
    // 3.跳转到登陆页面
    router.push('/login')
}
// switch 开关变化时的回调【暗黑模式】
const  changeDark = () => {
   // 获取html根节点实例 ，添加class=dark 变成暗黑模式
   const html = document.documentElement
   isDark.value ? html.className='dark' : html.className=''
}

//---
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 主题切换：颜色提取器组件事件 ，当绑定值变化时触发
const newcolor = (val) => {
    // 获取到当前的颜色
    color.value = val
    // document.documentElement 是根组件，通过js来变化属性与属性值 达到主题颜色
    const el = document.documentElement
    // const el = document.getElementById('xxx')

    // 获取 css 变量
    getComputedStyle(el).getPropertyValue(`--el-color-primary`)

    // 设置 css 变量
    el.style.setProperty('--el-color-primary', color.value)
    
}
</script>

<style lang="scss" scoped>
.tabbar{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .tabbar_left{
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
    .tabbar_right{
        margin-right: 20px;
        display: flex;
        align-items: center;
    }
}
</style>