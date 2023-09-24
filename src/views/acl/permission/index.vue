<template>
    <div>
        <!-- table -->
        <el-table border style="margin:20px;" row-key="id" :data="permission">
            <el-table-column label="名称" prop="name" ></el-table-column>
            <el-table-column label="权限值" prop="code" ></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" ></el-table-column>
            <el-table-column label="操作"  >
                <template #={row,$index}>
                    <el-button type="primary" size="small" @click="addMenu(row)" :disabled="row.level === 4 ? true : false" >{{ row.level === 3 ? '添加功能' : '添加菜单' }}</el-button>
                    <el-button type="primary" size="small" @click="updateMenu(row)" :disabled="row.level === 1 ? true : false">编辑</el-button>
                    <el-popconfirm :title="`您确定删除${row.name}角色吗`" @confirm="handleDelete(row)" width="280px">
                        <template #reference>
                            <el-button type="primary" size="small" :disabled="row.level === 1 ? true : false" >删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog对话框 -->
        <el-dialog v-model="isdialog" :title="paramas.id?'修改菜单':'新增菜单'"  width="30%">
            <el-form label-width="70px" >
                <el-form-item label="名称" >
                    <el-input v-model="paramas.name" placeholder="请填写名称" />
                </el-form-item>
                <el-form-item label="权限" >
                    <el-input v-model="paramas.code" placeholder="请填写权限值" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="isdialog = false">取消</el-button>
                    <el-button type="primary" @click="dialogComirm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { getPermission, remove, addAndUpdate } from '@/api/acl/menu/index'
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus';
const permission = ref([]) // 全部菜单接口返回数据
const isdialog = ref(false) // 控制dialog
const paramas = reactive({
    name:'',  // 权限名称
    code:'',  // 权限值
    level:0, // 层级
    pid:0,
})

onMounted(()=> getAllMenu())
// 获取全部菜单与按钮
const getAllMenu = async() => {
    const result = await getPermission()
    if (result.code === 200) {
        permission.value = result.data
    }  
}
// 添加菜单按钮
const addMenu = (row) => {
    // 删除上一次的搜索信息
    Object.assign(paramas,{
        name:'',  // 权限名称
        code:'',  // 权限值
        level:0, // 层级
        pid:0,
        id:0
    })
    // 打开对话框
    isdialog.value = true
    // ---收集参数---
    paramas.level = row.level+1 // 新增的子菜单的层级，父亲等级+1
    paramas.pid = row.id // 给谁新增菜单 pid = 父亲的id
}
// 编辑菜单按钮
const updateMenu = (row) => {
    // 打开对话框
    isdialog.value = true
    // ---收集参数---覆盖对象，让paramas中多了ID，以便判断是新增还是修改编辑
    Object.assign(paramas,row)
}
// dialog 确定按钮
const dialogComirm = async () => {
    // 收集数据参数paramas:(根据有无ID 发送新增或修改的接口)
    // 发请求
    const result = await addAndUpdate(paramas)
    if ( result.code === 200 ){
        // 成功提示
        ElMessage({type:'success',message: paramas.id ? '更新成功' : '添加成功'})
        // 关闭dialog
        isdialog.value = false
        // 重新获取数据，刷新页面
        getAllMenu()
    } else {
        // 失败提示
        ElMessage.error(paramas.id ? '更新失败' : '添加失败')
        // 关闭dialog
        isdialog.value = false
    }
}
// 删除按钮
const handleDelete = async (row) => {
    // 发请求
    const result = await remove(row.id)
    console.log(result);  
    if ( result.code === 200 ) {
        // 成功提示
        ElMessage({type:'success', message:`删除${row.name}成功`})
        // 重新获取数据
        getAllMenu()
    } else {
        ElMessage.error(`删除失败${result.data}`)
    }
}
</script>

<style lang="scss" scoped>

</style>