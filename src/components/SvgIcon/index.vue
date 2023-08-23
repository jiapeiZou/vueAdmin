
 
 <!-- svg图标 公共组件-->
<template>
    <!-- svg:图标外层容器节点 ，内部需要与use标签结合使用 -->
    <svg :style="{width, height}">
        <!-- xlink：href 执行哪个图标，属性值以 # icon-图标名 ，fill属性可设置图标颜色  -->
        <use :xlink:href="prefix+name" :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
// 接收父组件传递的参数
defineProps({
    // xlink：href的前缀  默认值为：#icon- （如果不传 就显示默认值）
    prefix: {
        type: String,
        default: '#icon-'
    },
    // 提供使用的图标名字
    name: {
        type: String,
    },
    // 颜色
    color: {
        type: String,
        default: ''
    },
    // 宽
    width: {
        type: String,
        default: '16px'
    },
    // 高
    height: {
        type: String,
        default: '16px'
    }
})
</script>

<style scoped>

</style>