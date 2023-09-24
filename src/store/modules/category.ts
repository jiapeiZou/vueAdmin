// 商品分类小仓库
import { defineStore } from "pinia";
import { ref } from 'vue'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index' // 商品分类接口

const useCategoryStore = defineStore('category',() => {
    // 一级分类 数据
    const c1Arr = ref([])
    const c1Id = ref()
    // 二级分类 数据
    const c2Arr = ref([])
    const c2Id = ref()
     // 三级分类 数据
     const c3Arr = ref([])
     const c3Id = ref()
    
    // 一级分类 数据接口
    const getC1 = async() => {
        const result = await reqC1()
        if (result.code === 200 ) {
            c1Arr.value = result.data 
        }
    }
    // 二级分类 数据接口
    const getC2 = async() => {
        const result = await reqC2(c1Id.value)
        if (result.code === 200 ) {
            c2Arr.value = result.data
        }
    }
    // 三级分类 数据接口
    const getC3 = async() => {
        const result = await reqC3(c2Id.value)
        if(result.code){
            c3Arr.value = result.data
        }
    }

    return {
        c1Arr, c1Id, c2Arr, c2Id, c3Arr, c3Id,
        getC1, getC2, getC3
    }
})
export default useCategoryStore