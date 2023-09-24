<template>
    <div>
         <!-- 分类下拉菜单 -->
         <el-card style="margin:20px;">
            <el-form :inline="true">
                <el-form-item label="一级分类"> 
                    <el-select v-model="categoryStore.c1Id"  @change="handleChange" :disabled="isDisabled===0 ? false : true">
                        <!-- label:下拉菜单的选项 value:下拉菜单收集的数据 disabled:是否禁用分类下拉菜单-->
                        <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id"  :label="c1.name" :value="c1.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类"> 
                    <el-select v-model="categoryStore.c2Id" @change="handleChangeC2" :disabled="isDisabled===0 ? false : true">
                        <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name"  :value="c2.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类"> 
                    <el-select v-model="categoryStore.c3Id" :disabled="isDisabled===0 ? false : true">
                        <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id"  :label="c3.name" :value="c3.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted } from "vue";
  import useCategoryStore from '@/store/modules/category' // 商品数据仓库
  const categoryStore = useCategoryStore()
  // 接收父组件传递过来的参数
  defineProps(['isDisabled'])


  // 一级分类 接口
  const getC1Store = () => {
    categoryStore.getC1()
  }
  onMounted(() => getC1Store())

  // 一级分类选项变化时 触发 change
  const handleChange = async () => {
    // 当重新选一级数据时 应清空 二级 三级的数据
    categoryStore.c2Id = ''
    categoryStore.c3Id = ''
    categoryStore.c3Arr = []
    // 调二级接口 （需要一级ID
    await categoryStore.getC2(categoryStore.c1Id)
  }

  // 二级分类选项变化时 触发 change
  const handleChangeC2 = async() => {
     // 当重新选二级数据时 应清空 三级的数据
    categoryStore.c3Id = ''
    // 调三级接口 （需要二级ID
    await categoryStore.getC3()
  }

  </script>
  
  <style scroped></style>
  