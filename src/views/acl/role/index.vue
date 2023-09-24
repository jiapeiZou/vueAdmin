<template>
    <!-- 搜索栏 -->
    <el-card style="margin:20px; height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="角色名称">
                <el-input placeholder="请输入角色名称" v-model="keyword" />
            </el-form-item>
            <el-form-item >
               <template #="{row,$index}">
                   <el-button type="primary" @click="handleKeyWord" :disabled="keyword.trim().length>0 ? false : true">搜索</el-button>
                   <el-button @click="handleNew">重置</el-button>
               </template>
            </el-form-item>
        </el-form>
    </el-card>
    <!-- table表格 -->
    <el-card style="margin:20px;" >
        <el-button type="primary" icon="Plus" @click="addRole">添加角色</el-button>
        <el-table border :data="allRoleList" style="margin:20px 0;">
            <el-table-column label="#" type="index" align="center"></el-table-column>
            <el-table-column label="id" prop="id" align="center"></el-table-column>
            <el-table-column label="角色名称" prop="roleName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{row,$index}">
                    <el-button type="primary" icon="User" size="small" @click="handleDrawer(row)">分配权限</el-button>
                    <el-button type="primary" icon="Edit" size="small" @click="handleUpdateRole(row)">编辑</el-button>
                    <el-popconfirm :title="`您确定删除${row.roleName}角色吗`" @confirm="handleDeleteRole(row)" width="280px"> 
                            <template #reference>
                                <el-button type="primary" icon="Delete" size="small">删除</el-button>
                            </template>
                    </el-popconfirm>
               </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination 
            v-model:current-page="page"
            v-model:page-size="limit"
            :page-sizes="[5,7,9]"
            :background="true"
            layout="prev, pager,next, jumper,->,sizes, total"
            :total="total"
            @current-change="allRole"
            @size-change="limitChange"
        />
        <!-- dialog 添加按钮对话框 -->
        <el-dialog v-model="isdialog" :title="roleParamas.id ? '更新成功': '添加成功'">
            <el-form  
                ref="formRef"
                :model="roleParamas"
                :rules="rules" >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleParamas.roleName"  />
                </el-form-item>
            </el-form>
            <template #footer>
                <span >
                    <el-button @click="isdialog = false">取消</el-button>
                    <el-button type="primary" @click="handleAddRole" :disabled="roleParamas.roleName.trim().length>0 ? false : true"> 确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- drawer 抽屉组件 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>分配权限</h4>
            </template>
            <template #default>
               <!-- Tree 树形控件 -->
                <el-tree
                    ref="treeRef"
                    :data="menuList"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="selectTrueArr"
                    :props="defaultProps"
                />
            </template>
            <template #footer>
                <div>
                    <el-button @click="drawer = false">取消</el-button>
                    <el-button type="primary" @click="confirmClick">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { getAllRole, deleteRole, addAndUpdate, getAllMenuList, setpermisstion,} from '@/api/acl/role/index' // 接口
import { ElMessage } from 'element-plus';

const page =ref(1)   // 当前页
const limit = ref(5) // 一页取几条数据
const total = ref(0) // 总页数
const allRoleList = ref([])  // 全部职位
const keyword = ref('') // input输入框 
const isdialog = ref(false) // 控制dialog对话框
const drawer = ref(false) // 控制drawer抽屉组件
const formRef = ref() // form实例
const roleParamas = reactive({
    roleName:''
})
const menuList = ref([]) // 接口返回的全部菜单数组
const treeRef = ref() // tree实例
const selectTrueArr = ref([]) // 存储菜单中select为true的ID，供树形控件展示

// 页面渲染完后 获取数据
onMounted(() => allRole())
// 获取全部角色接口
const allRole = async(pager=1) => {
    page.value = pager
    const result = await getAllRole(page.value,limit.value,keyword.value)
    console.log(result);
    if (result.code === 200 ) {
        total.value = result.data.total
        allRoleList.value = result.data.records
    }
}
// 一页取几条数据 变化时的回调
const limitChange = () => {
    // 重新获取数据
    allRole()
}
// 搜索 关键字按钮
const handleKeyWord = () => {
    allRole()
}
// 重置按钮 
const handleNew = () => {
    keyword.value = ''
    allRole()
}
// 删除按钮
const handleDeleteRole = async(row) => {
    // 删除接口
    const result = await deleteRole(row.id)
    console.log(result);
    // 成功 提示 
    if (result.code === 200){
        ElMessage({type:'success',message:'删除成功'})
        // 重新获取数据 刷新
        allRole()
    } else {
        // 失败 提示
        ElMessage.error('删除失败')
    }
}
// 新增角色按钮 
const addRole = () => {
    // 打开对话框
    isdialog.value = true
    // 清空上次输入数据
    Object.assign(roleParamas,{ roleName:'', id:0})
    // 清理上此的校验提示信息(nextTick 等到页面加载渲染完毕后执行 ，避免报错)
    nextTick(()=> {
        formRef.value.clearValidate('roleName')
    })
}
// dialog对话框 确定回调
const handleAddRole = async() => {
    // 校验通过后 再发请求
    await formRef.value.validate()
    // 收集数据 发请求
    const result = await addAndUpdate(roleParamas)
    if (result.code === 200) {
        // 成功提示
        ElMessage({type:'success',message:roleParamas.id ? '更新成功': '添加成功'})
        // 关闭对话框
        isdialog.value = false
    } else {
        // 失败提示
        ElMessage.error(  roleParamas.id ? '更新失败': '添加失败')
    }
    // 刷新页面
    allRole()
}
// 编辑角色按钮
const handleUpdateRole = (row) => {
    // 打开对话框
    isdialog.value = true
    // 回填信息 (把当前行row 数据 赋值给参数，因此参数中多了ID ，以此来判断新增还是编辑)
    Object.assign(roleParamas,row) 
    // 清理上此的校验提示信息
    nextTick(()=> {
        formRef.value.clearValidate('roleName')
    })
}
// 自定义校验规则 回调
const validatePass = (rule: any, value: any, callback: any) => {
    if(value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('角色名称至少两个字符!'))
    }
}
// 添加 编辑 角色 自定义校验规则
const rules = {
    roleName:[{validator: validatePass, trigger: 'blur', required:true}]
}
// 权限分配按钮
const handleDrawer = async (row) => {
    // 打开drawer抽屉组件
    drawer.value = true
    Object.assign(roleParamas,row)
    // 获取全部菜单 当前用户的权限数据
    const result = await getAllMenuList(roleParamas.id)
    if (result.code === 200){
        menuList.value = result.data
        selectTrueArr.value = filterSelect(menuList.value, [])
    }
}
// 筛选 接口数据返回的当前角色的权限为true的菜单权限
const filterSelect = (allMenu, selectTrue) => { // 接收调用时传来的参数 allMenu：为当前项角色的数据，selectTrue：为空数组 用于存储筛选后的数据
    allMenu.forEach(item => {
        if (item.select === true && item.children.length === 0){ // item.children.length === 0 表示为最后一层
            selectTrue.push(item.id) // 收集最后一层 ，并select=true的ID，
        }
        if ( item.children && item.children.length > 0 ){
            filterSelect(item.children, selectTrue) // 递归 遍历
        }
     })
     return selectTrue // 返回一个数组
}
// drawer确定按钮
const confirmClick = async() => {
    // 收集参数： tree树形组件的 方法（先获取到树形控件的实例，并调用它身上的方法）
    // 它将返回当前选中节点 key 的数组
    const treeArr = treeRef.value.getCheckedKeys()
    // 返回目前半选中的节点的 key 所组成的数组
    const treeArr1 = treeRef.value.getHalfCheckedKeys()
    // 合并两个数组
    const permissionId = treeArr.concat(treeArr1)
    // 发请求
    const result = await setpermisstion(roleParamas.id,permissionId)//(permissionId:选中ID和上层那些未确定状态的ID的数组)
    if(result.code === 200){
        // 关闭drawer抽屉组件
        drawer.value = false
        // 成功提示
        ElMessage({type:'success',message:'分配权限成功'})
        // 刷新页面 
        window.location.reload()
    } else {
        // 失败提示
        ElMessage.error('分配权限失败')
    }
}
// ---
const defaultProps = { // 展示的字段
  children: 'children',
  label: 'name',
}

</script>

<style lang="scss" scoped>
.form{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>