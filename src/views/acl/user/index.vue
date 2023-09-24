<template>
    <el-card style="margin: 20px; height: 80px;">
        <!-- 搜索栏 -->
        <el-form :inline="true" class="form">
                <el-form-item label="用户名:">
                    <el-input placeholder="请输入搜索用户名" v-model="inputValue"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="handleSearch" :disabled="inputValue.trim().length > 0 ? false : true">搜索</el-button>
                    <el-button type="primary" size="small" @click="handleRemack">重置</el-button>
                </el-form-item>
        </el-form>
    </el-card>
    <el-card  style="margin:0 20px; ">
        <!-- 用户按钮权限的判断 v-if="userStore.userBtn.includes('btn.User.add')  因为每一个页面都要使用长裤数据，并且每一个按钮都需要绑定一个指令，这里使用了全局自定义指令v-hasBtn替代了-->
        <el-button type="primary" @click="handleaddUser" v-hasBtn="`btn.User.add`">添加</el-button>
        <el-button type="danger" @click="handleDeleteUser" :disabled="checkUser.length>0 ? false : true">批量删除</el-button>
        <!-- 表格 -->
        <el-table style="margin:20px 0;" border :data="allUser" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55px" align="center" ></el-table-column>
            <el-table-column type="index" label="#" align="center" ></el-table-column>
            <el-table-column label="id" prop="id" align="center"></el-table-column>
            <el-table-column label="用户姓名" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{row,$index}">
                    <el-button type="primary" size="small" icon="User" @click="handleRole(row)" v-hasBtn="`btn.User.assgin`">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="handleupdate(row)" v-hasBtn="`btn.User.update`">编辑</el-button>
                    <el-popconfirm :title="`你确定删除${row.username}吗?`" @confirm="handleDelete(row)"  width="280px">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete" v-hasBtn="`btn.User.remove`">删除</el-button>
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
            @current-change="getuser"
            @size-change="limitChange"
        />
        <!-- 抽屉组件1:编辑用户or添加用户 -->
        <el-drawer v-model="drawer" >
            <template #header>
                <h4>{{userParams.id ? '编辑用户' : '添加用户'}}</h4>
            </template>
            <template #default>
                <el-form :model="userParams" :rules="rules" ref="refForm">
                    <el-form-item label="用户姓名" prop="username" >
                        <el-input placeholder="请填写用户姓名" v-model="userParams.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="name">
                        <el-input placeholder="请填写用户昵称" v-model="userParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password" v-if="userParams.id ? false : true" >
                        <el-input placeholder="请填写用户密码" v-model="userParams.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button @click="drawer=false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </template>
        </el-drawer>
        <!--抽屉组件2: 添加角色 -->
        <el-drawer v-model="drawer2">
            <template #header>
                <h4>分配用户角色</h4>
            </template>
            <template #default>
                <el-form>
                    <el-form-item label="用户姓名">
                        <el-input v-model="userParams.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="角色列表">
                        <el-checkbox
                            v-model="checkAll"
                            @change="handleCheckAllChange"
                            >全选</el-checkbox
                        >
                        <el-checkbox-group
                            v-model="hasChecked"
                            @change="handleCheckedCitiesChange"
                        >
                            <el-checkbox v-for="role in roles" :key="role" :label="role">{{role.roleName}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button type="primary" @click="drawer2=false">取消</el-button>
                <el-button type="primary" @click="handleDrawer2">确定</el-button>
            </template>
        </el-drawer>
    </el-card>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted, nextTick } from 'vue'
import  type{ requestData, responseRole } from '@/api/user/type' // 类型ts
import { getAllUser, addOrUpdateUser, hasRole, addAndUPdate, deleteUser, deleteSomeUser } from '@/api/acl/user/index' // 接口
import { useUserStore } from '@/store/modules/user' // 用户数据相关的仓库
const userStore = useUserStore()
const inputValue = ref('') // input框数据双向绑定
const page = ref(1)   // 当前页数
const limit = ref(5)  // 一页几条
const total = ref(0) // 总页数
const allUser = ref([]) // 全部已有用户账号信息
const drawer = ref(false)  // 控制添加与编辑抽屉组件显示
const drawer2 = ref(false)  // 控制角色抽屉组件显示
const refForm = ref() // form表单实例
const userParams = reactive({ // 新增or编辑用户（ID） 参数
    username: '', 
    password:'',
    name: '',
})
const roles = ref([])      // 全部角色
const hasChecked = ref([]) // 收集当前选中的项目
const checkAll = ref(false)// 全选的状态
const checkUser = ref<number[]>([]) // 被选中的用户的ID （批量删除接口的参数收集)


// 页面渲染完 请求数据
onMounted(() => getuser())
// 获取管理用户分页数据 
const getuser = async(pager=1) => {
    page.value = pager
    const result:requestData = await getAllUser(pager, limit.value, inputValue.value)
    if(result.code === 200){
        total.value = result.data.total
        allUser.value = result.data.records
    }  
}
// 分页器 limit变化时的 回调
const limitChange = () => {
    getuser()
}
// 添加按钮 回调
const handleaddUser = () => {
    // 打开抽屉组件
    drawer.value = true
    // 清空数据
    Object.assign(userParams,{
        username:'',
        name:'',
        password:'',
        id:0 // 点击编辑时向参数中添加了ID，新增时需要清空（因为根据有无ID来判断是新增还是编辑状态）
    })
    // 清理表单 上一次的错误 提示信息
    nextTick(()=>{
        refForm.value.clearValidate('username')
        refForm.value.clearValidate('name')
        refForm.value.clearValidate('password')
    })
}
// 编辑按钮
const handleupdate = (row) => {
    // 打开抽屉组件
    drawer.value = true
    // 回填数据 （当前row 赋值给参数）
    Object.assign(userParams,row)
    // 清除表单 上一次的错误 提示信息 (nextTick确保等待DOM更新完成后再执行里面的代码)
    nextTick(()=> {
        refForm.value.clearValidate('username')
        refForm.value.clearValidate('name')
    })
}
// drawer抽屉 确定按钮
const confirmClick = async() => {
    // 全部表单验证通过才放行
    await refForm.value.validate()
    // 确定按钮 可能是新增 or 编辑（根据ID判断）
    // 发请求 
    const result = await addOrUpdateUser(userParams)
    if (result.code === 200) {
        // 关闭抽屉组件
        drawer.value = false
        // 提示信息
        ElMessage({
            type:'success',
            message: userParams.id ? '更新成功' :'添加成功'
        })
        // 刷新页面 编辑：留在当前页|添加：留在第一页
        getuser(userParams.id? page.value : 1)
    } else {
        // 关闭抽屉组件
        drawer.value = false
        // 提示信息
        ElMessage.error(userParams.id ? '更新失败' :'添加失败')
    }
}
// 用户名 自定义验证规则
const validatorUsername = (rule: any, value: any, callback: any) => {
    // rule:校验规则对象
    // value: 表单文本内容
    // callback: 函数 if 符合条件执行callback()放行 ，else 不符合注入错误提示信息
    if (value.trim().length > 5) {
        callback()
    } else {
        callback(new Error('用户名必须大于5位!'))
    }
}
// 用户昵称 自定义验证规则
const validatorName = (rule:any, value:any, callback:any) => {
    if(value.trim().length > 5) {
        callback()
    } else {
        callback(new Error('用户昵称必须大于5位!'))
    }
}
// 用户密码 自定义验证规则
const validatorPassword = (rule:any, value:any, callback:any) => {
    if (/^[a-zA-Z0-9]{6,14}$/.test(value)){
        callback()
    } else {
        callback(new Error('用户密码 长度为5-12位之间的英文字母或数字!'))
    }
}
// 表单验证规则
const rules = reactive({
    username:[{required: true, trigger:'blur', validator:validatorUsername}],
    name:[{required: true, trigger:'blur', validator:validatorName}],
    password:[{required: true, trigger:'blur', validator:validatorPassword}],
})
// 分配角色按钮
const handleRole = async (row) => {
    // 赋值 并 回填用户名
    Object.assign(userParams,row)
    // 获取 用户已有的角色 与 全部角色 接口
    const result:responseRole = await hasRole(row.id)
    if (result.code === 200){
        // 存储全部角色
        roles.value = result.data.allRolesList
        // 存储用户已有角色
        hasChecked.value = result.data.assignRoles
        // 打开抽屉组件
        drawer2.value = true
    }
    
}
// 全选框 状态->控制 复选框
const handleCheckAllChange = (val:boolean) => {
    // val ：全选的状态  true：全选时 复选框全部勾上 false：取消全选 复选框为全不选
    hasChecked.value = val ? roles.value : []
}
// 复选框 
const handleCheckedCitiesChange = (value: string[]) => {
    // value:当前选中的项目 组成的数组
    if (value.length === roles.value.length) {
        // 应为全选状态 
        checkAll.value = true
    } else {
        checkAll.value = false
    }  
}
// drawer2抽屉 确认按钮
const handleDrawer2 = async() => {
    // 收集数据
    const params = {
        roleIdList:  hasChecked.value.map(item => item.id),
        userId: userParams.id
    }
    // 发请求
    const result = await addAndUPdate(params)
    if(result.code === 200){
        // 成功 提示 关闭抽屉组件 
        drawer2.value = false
        ElMessage({
            type:'success',
            message: '分配成功'
        })
        // 刷新渲染 留在当前页
        getuser(page.value)
    } else {
        // 失败 提示
        ElMessage.error('分配失败')
    }
    
    
    // 失败 提示 
}
// 删除按钮 
const handleDelete = async (row) => {
    // 发请求删除当前行用户信息
    const result = await deleteUser(row.id)
    if (result.code === 200){
        // 提示
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        // 重新获取数据刷新页面，留在当前页
        getuser(page.value)
    } else {
        ElMessage.error('删除失败')
    }
}
// 批量删除按钮
const handleDeleteUser = async() => {
    // 收集参数 id[ ]
    const idlist = checkUser.value.map(item => {
        return item.id;
    })
    // 发请求
    const result = await deleteSomeUser(idlist)
    if (result.code === 200){
        // 提示
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        // 重新获取数据刷新页面，留在当前页
        getuser(page.value)
    } else {
        ElMessage.error('删除失败')
    }
}
// 表格选择框 已勾选的数据
const handleSelectionChange = (val) => {
    checkUser.value = val 
}
// 搜索按钮
const handleSearch = () => {
    // 根据搜索字 发请求重新获取数据
    getuser()
}
// 重置按钮
const handleRemack = () => {
    inputValue.value = ''
    getuser()
}



</script>

<style lang="scss" scoped>
.form{
    display: flex;
    justify-content:space-between;
    align-items: center;
}
</style>