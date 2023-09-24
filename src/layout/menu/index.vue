<template>
    <template v-for="(item, index) in menuList" :key="item.path">

        <!-- 没有子路由 (无需折叠)-->
        <template v-if="!item.children">
            <el-menu-item v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
                <el-icon >
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>{{ item.meta.title }}</template>
            </el-menu-item>
        </template>
    
        <!-- 如果有子路由，并且只有一个(无需折叠)  -->
        <template v-if="item.children && item.children.length === 1">
            <el-menu-item  :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
                <el-icon >
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>{{ item.children[0].meta.title }}</template>
            </el-menu-item>
        </template>

        <!--  如果有子路由, 子路由大于1个（需要折叠，下拉菜单） -->
        <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
            <template #title>
                <el-icon >
                    <!-- 动态组件 （element-plus 中所有icon图标 注册了全局组件。这里动态的使用icon） -->
                    <component :is="item.meta.icon" ></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <!-- 递归组件 子路由需要再次做一次判断，判断是否有子子组件 代替嵌套的循环-->
            <Menu :menuList="item.children"> </Menu>
        </el-sub-menu>

    </template>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router =  useRouter()

// props 父组件传递过来的 路由数组 
 defineProps(['menuList']);

// 点击菜单时的路由跳转 (vc参数是el-menu的click事件中，回调函数的参数 = el-menu-item实例 )
const goRoute = (vc) => {
    router.push(vc.index)
}


</script>
<!-- 递归组件 需要name -->
<script lang="ts">
export default {
    name:'Menu'
}
</script>

<style lang="scss" scoped>

</style>