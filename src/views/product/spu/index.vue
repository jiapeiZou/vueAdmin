<template>
    <div>
        <!--  全局组件：分类下拉菜单 -->
        <Category :isDisabled="scene" />
        <!-- spu  -->
        <el-card style="margin: 0 20px">
            <!-- 场景0:已有spu数据 场景1:spu 场景2:sku -->
            <div v-show="changeCard===0 " >
                <el-button icon="Plus" type="primary" :disabled="categoryStore.c3Id ? false : true" @click="handleAddSpu">添加spu </el-button>
                <!-- 表格 -->
                <el-table border style="margin:20px 0" :data="records" >
                    <el-table-column type="index" label="序号" width="80" > </el-table-column>
                    <el-table-column prop="spuName" label="SPU名称"></el-table-column>
                    <el-table-column prop="description" label="SPU描述" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                        <template #="{row,$index}">
                            <el-button icon="Plus" type="primary" size="small" @click="handleSku(row)" ></el-button>
                            <el-button icon="Edit" type="warning" size="small" @click="() => handleEditSpu(row)"></el-button>
                            <el-button type="info" icon="Message" size="small" @click="handleSkuList(row)"></el-button>
                            <el-popconfirm :title="`你确定删除${row.spuName}商品吗？`" width="300px" @confirm="handleDelete(row,$index)">
                                <template #reference>
                                <el-button icon="Delete" type="danger" size="small"> </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination
                    v-model:current-page="pageNo"
                    v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 7]"
                    :background="true"
                    layout=" prev, pager,next, jumper,->,sizes, total"
                    :total="total"
                    @size-change="pageSizeChange"
                    @current-change="pageChange"
                    />
            </div>
            <!-- 子组件Spu 场景1:spu -->
            <SpuForm v-show="changeCard === 1"  @changeScene="changeScene" ref="spu" />
            <!-- 子组件Sku 场景2:sku  -->
            <SkuForm v-show="changeCard === 2" @changeScene="changeScene" ref="sku"/>
            <!-- dialog对话框 -->
            <el-dialog v-model="isDialog" title="SKU列表">
                <el-table :data="skuList" border>
                    <el-table-column  label="sku名字" prop="skuName" />
                    <el-table-column  label="sku价格" prop="price" />
                    <el-table-column  label="sku重量" prop="weight" />
                    <el-table-column  label="sku图片" > 
                        <template #="{row,$index}">
                            <img :src="row.skuDefaultImg" style="width:100px; height:100px;" >
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import SkuForm from './skuForm.vue' // 子组件Sku
import SpuForm from './spuForm.vue' // 子组件Spu
import {reqHasspu, deleteSpu, reqSkuList} from '@/api/product/spu/index' // spu 接口
import useCategoryStore from '@/store/modules/category' // 仓库数据
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
const scene = ref<number>(0)  // 分类下拉菜单是否禁用
const changeCard = ref(0) // 场景卡片切换(0,1,2)
const pageSize = ref<number>(3) // 一页要几张
const total = ref(0) // 总共几页
const pageNo = ref(1) // 第几页
const records = ref([]) // 已有spu属性数据数组
const spu = ref() // 子组件Spu实例
const sku = ref() // 子组件Sku实例
const skuList = ref() // 存储 在售的全部商品sku list
const isDialog = ref<boolean>(false) // 控制dialog是否显示
// 获取已有的spu数据接口
const getHasSpu = async( )=> {
    if (categoryStore.c3Id) {
        console.log(pageNo.value)
        const result = await reqHasspu(pageNo.value, pageSize.value, categoryStore.c3Id)
        if (result.code === 200 ) {
            records.value = result.data.records
            total.value = result.data.total
        }
    }
}
// 监听三级分类ID的变化，发请求获取spu数据
watch(()=>categoryStore.c3Id , ()=> {
    getHasSpu()
})
// page 变化时
const pageChange = ()=> {
    getHasSpu() // 分页器这个事件不需要传参数 第几页 一页几个 因为，绑定了V-model 可自动传
}
// pageSize 变化时
const pageSizeChange = ()=> {
    pageNo.value = 1 // 切换一页几条数据时，变成第一页
    getHasSpu()
}
// 自定义事件 子传父 (SPU 子组件 点击取消&保存 时，切换回0场景)
const changeScene = (obj) => {
    changeCard.value = obj.flag // 切换为 SPU场景 0,1,2
    // 根据判断是新增 还是 编辑 获取第一页数据还是编辑那页的数据
    if (obj.params === 'update') {
        // 修改：留在当前页面 并刷新页面
        getHasSpu(pageNo.value) 
    } else {
        // 添加：留在第一页 并刷新页面
        pageNo.value = 1
        getHasSpu() 
    }
}
// 点击 添加 SPU
const handleAddSpu = () => {
    changeCard.value = 1 // 切换为:SPU场景1
    scene.value = 1 // 禁用分类下拉菜单
    const c3 = categoryStore.c3Id
    spu.value.initAddSpu(c3) // ---- 通过ref 获取到子组件的实例 ，并调用子组件身上的方法。 点击编辑时，调接口  -----
} 
// 点击 编辑 SPU
const handleEditSpu = (row) => {
    changeCard.value = 1 // 切换为:SPU场景1
    scene.value = 1 // 禁用分类下拉菜单
    //----- 通过ref 获取到子组件的实例 ，并调用子组件身上的方法。 点击编辑时，调接口 ，回填数据 -----
    spu.value.getSpuValue(row)
} 
// 点击删除 spu 
const handleDelete = async(row,$index) => {
    // records.value.splice($index,1)
    const result = await deleteSpu(row.id)
    if(result.code === 200){
        // 提示成功
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        // 刷新数据
        getHasSpu()
    } else {
        ElMessage.error('删除失败')
    }
}
// 点击 添加sku 
const handleSku = (row) => {
    // 切换为:SKU场景2
    changeCard.value = 2 
    // 禁用分类下拉菜单
    scene.value = 1
    // 获取到子组件实例，并调用子组件暴露的方法 调接口
    sku.value.initSku(row)
}
// 点击查看 sku 列表
const handleSkuList = async (row) => {
    //打开对话框 
    isDialog.value = true
    // 获取请求 查看该spu下，所以在售商品
    const result = await reqSkuList(row.id)
    console.log(result)
    skuList.value = result.data
}
// 路由组件销毁时 把仓库分类相关数据清空（跳转不同页面时 一二三级分类下拉菜单数据清空）
// onBeforeUnmount(()=>{
//     categoryStore.$reset()
// })
</script>

<style lang="scss" scoped>

</style>