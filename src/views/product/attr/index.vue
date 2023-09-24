<template>
    <div>
        <!--  全局组件：分类下拉菜单 -->
         <Category :isDisabled="arrChange"/>
        <!-- 属性管理 -->
         <el-card style="margin:20px;">
            <div v-show="arrChange === 0">
                <el-button @click="handlechange" type="primary" icon="Plus" :disabled="categoryStore.c3Id?false:true">添加平台属性</el-button>
                <el-table :data="arrtList" border style="margin-top:20px;">
                    <el-table-column  label="序号" width="80" type="index" />
                    <el-table-column prop="attrName" label="属性名称" width="180" />
                    <el-table-column prop="date" label="属性值名称">
                        <template #="{row, $index}">
                            <el-tag v-for="item in row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" label="操作" width="180" >
                        <template #="{row, $index}">
                            <el-button type="warning" icon="Edit" @click="() => handleEditAttr(row, $index)"></el-button>
                            <el-popconfirm :title="`您确定要删除${row.attrName}吗?`" @confirm="() => handleDelete(row.id)" width="220px">
                                <template #reference>
                                    <el-button type="danger" icon="Delete" > </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="arrChange === 1">
                <el-form>
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" style="width: 260px;" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                    <el-button type="primary" icon="Plus" @click="addAttrValue" :disabled="attrParams.attrName?false:true">添加属性值</el-button>
                    <el-button @click="handleBack" >取消</el-button>
                    <el-table border   style="margin:20px 0;" :data="attrParams.attrValueList" >
                        <el-table-column label="序号" type="index" width="100"></el-table-column>
                        <el-table-column label="属性值">
                            <!-- row: 当前属性对象 -->
                            <template #="{row,$index}">
                                <el-input v-if="row.flag" @blur="()=>toLook(row,$index)" placeholder="请输入属性值名称" v-model=row.valueName size="samll" ></el-input>
                                <div v-else @click="()=>toEdit(row)">{{ row.valueName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #="{row,$index}">
                                <el-button type="primary" icon="Edit" ></el-button>
                                <el-button type="danger" icon="Delete" @click="() => attrParams.attrValueList.splice($index,1)" ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" @click="handleSubmit" :disabled="attrParams.attrValueList.length>0 ? false : true">保存</el-button>
                    <el-button @click="handleBack">取消</el-button>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { attr, addOrUpdateAttr, deleteAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
const categoryStore = useCategoryStore()
const arrtList = ref([])


const arrChange = ref(0)
// const {c1Id, c2Id, c3Id} = categoryStore
// 获取 添加 属性的接口 的参数data
const attrParams = reactive({
    //id: '',  //已有 属性ID
    attrName: "", //  属性名称
    categoryId: '',      // 三级分类ID （已有属性归属 哪个三级分类
    categoryLevel: 3,   // 三级分类
    attrValueList: [
    //   {
    //     attrId: '', // 属性值归属哪个属性
    //     id: '',     // 已有 属性值ID
    //     valueName: " "  //  属性值名称
    //   }
    ],
  })


//  获取分类属性值方法
const getAttr = async () => {
    const result =  await attr(categoryStore.c1Id, categoryStore.c2Id, categoryStore.c3Id)
        if ( result.code === 200 ) {
            arrtList.value = result.data
        }
}
// 监听仓库三级分类ID数据的变化，调接口 获取分类属性值
watch(() => categoryStore.c3Id , ()=>{
    // 判断如果有三级分类ID ，就调接口。因为之前写过 点击一级分类时，清空二三级分类ID，与数据，因此点击一级分类也会触发监听
    if(categoryStore.c3Id) {
        getAttr()
    }
})
// 点击添加属性事件
const handlechange = ()=> {
    attrParams.categoryId = categoryStore.c3Id // 收集 参数c3Id
    arrChange.value = 1
    categoryStore.isDisabled = true
    // 清空添加属性值 已填写过的内容
    attrParams.attrName = ''
    attrParams.attrValueList = []
    attrParams.categoryId = '' 
}
// 点击编辑属性事件
const handleEditAttr = (row, $index)=> {
    // 场景切换
    arrChange.value = 1
    // 禁用分类下拉菜单
    categoryStore.isDisabled = true
    // 回填数据 ES-6 -> Object.assign(对象1，对象2) 进行对象合并 、 JSON.parse(JSON.stringify(row）深拷贝，避免嵌套深的数据 被共享
    // Object.assign（ ）如果 row 和 attrParams 有相同的属性，row 中的值将覆盖 attrParams 中的值。
    Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
// 点击删除
const handleDelete = async (attrId:number) => {
    const result =  await deleteAttr(attrId)
    if (result.code === 200 ) {
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getAttr()
    } else {
        ElMessage.error('删除失败')
    }
}
// 添加属性值按钮的回调
const addAttrValue = () => {
    // 点击添加属性值按钮的时候，向数组添加属性值对象 // 添加一个控制属性值 编辑 与 查看 的切换 
    attrParams.attrValueList.push({ valueName:'', flag:true }) 
}
// 取消按钮
const handleBack = () => {
    // 返回 切换场景
    arrChange.value = 0
    // 清空添加属性值 已填写过的内容
    attrParams.attrName = ''
    attrParams.attrValueList = []
    attrParams.categoryId = '' 
}
// 保存按钮 添加属性值
const handleSubmit = async() => {
    // 调接口,发请求 参数有ID时为修改，无ID时为新增
    const result = await addOrUpdateAttr(attrParams)
    if (result.code === 200) {
        // 返回 切换场景
        arrChange.value = 0
        // 重新调接口 获取新数据 刷新页面
        getAttr()
        // 提示信息
        ElMessage({
            message: attrParams.id ? '添加成功' : '修改成功',
            type: 'success',
        })
    } else {
        ElMessage({
            message: attrParams.id ? '添加失败' : '修改失败',
            type: 'error',
        })
    }
    
}

// blur事件 input与查看切换
const toLook = (row, $index) => {
    // 排除情况1: 重复内容
    const nameSet = new Set() // 创建一个名为 nameSet 的空 Set 数据结构; 只存储任何类型的唯一值；如果有重复的值 那么这个值不会被添加。
    for (const item of attrParams.attrValueList) {
        nameSet.add(item.valueName); // 遍历 attrValueList 数组。并将其添加到 nameSet 中。
    }
    if ( nameSet.size  !== attrParams.attrValueList.length ) { // nameSet.size 获取 Set 的大小，也就是它包含的唯一元素的数量
        ElMessage.error('属性值不能重复') // 如果与之前数组长度不一致（小于原数组长度。则代表有重复内容）
        // 把重复的内容 从数组中删除
        attrParams.attrValueList.splice($index,1)
    }
    // 排除情况1: 空内容 
    if (row.valueName.trim() === '') {
         ElMessage.error('属性值不能为空')
    } 
    // 才能切换查看
    else {
        row.flag = false
    }
}
const toEdit = (row) => {
    row.flag = true
}
</script>

<style lang="scss" scoped>

</style>