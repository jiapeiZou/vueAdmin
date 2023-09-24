<template>
    <el-card class="box-card">
        <!-- 卡片顶部添加品牌按钮 -->
        <el-button type="primary" icon="Plus" @click="addTrademark"> 添加品牌 </el-button>
        <!-- 表格组件 -->
        <el-table :data="trademarkList" border style="margin:20px 0;">
            <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
            <el-table-column prop="tmName" label="品牌名称"  ></el-table-column>
            <el-table-column label="品牌LOGO" >
                <template #="{ row, $index }" >
                    <img :src="row.logoUrl" style="width:100px; height:100px;">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作"  >
                <template #="{row, $index}" >
                    <el-button type="primary" size="small" icon="Edit" @click="()=> updataTrademark(row)"></el-button>
                    <el-popconfirm :title="`您确定删除${row.tmName}品牌吗？`" width="240px" icon="Delete"  @confirm="() => confirmEvent(row.id)" >
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
            @size-change="limitChange"
            @current-change="pageChange"
            v-model:current-page="pageNo"
            v-model:page-size="limit"
            :page-sizes="[3,5,7,9]"
            :background="true"
            layout=" prev, pager,next, jumper,->,sizes, total"
            :total=total />
        <!-- dialog对话框 -->
        <el-dialog v-model="isDialog" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
            <!-- form表单 -->
            <el-form style="width: 80%;" ref="formRef" :model="trademarkParams" :rules="rules">
                <!-- 品牌名 -->
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input placeholder="请上传品牌名称" v-model="trademarkParams.tmName"/>
                </el-form-item>
                <!-- 品牌logo -->
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <!-- upload组件属性：action-图片上传路径 -->
                    <el-upload
                        class="avatar-uploader"
                        action="/api/admin/product/fileUpload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!-- 具名插槽 foot -->
            <template #footer>
                <el-button @click="cancel" type="primary">取消</el-button>
                <el-button @click="confirm" type="primary" >确认</el-button>
            </template> 
        </el-dialog>
    </el-card>
</template>

<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type{ Records, tradeMarkResponseData, TradeMark } from '@/api/product/trademark/type' // ts类型
import { ref, onMounted , reactive, nextTick } from 'vue'
import { hasTrademark, getAddOrUpdateTrademark, getDeleteTrademark } from '@/api/product/trademark/index' // 品牌管理接口
// 当前页码
const pageNo = ref<number>(1)
// 每页展示3条数据
const limit = ref<number>(3)
// 总页数
const total = ref<number>(0)
// 存储已有品牌数据
const trademarkList = ref<Records>([])
// 控制 dialog对话框 
const isDialog = ref<boolean>(false)
// form组件 Dom 实例
const formRef = ref()
// 新增&修改品牌参数对象
const trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})


// 获取已有品牌的接口
const  getTrademark = async () => {
    const result: tradeMarkResponseData = await hasTrademark(pageNo.value, limit.value)
    if (result.code === 200) {
        total.value = result.data.total
        trademarkList.value = result.data.records
        console.log(result.data.records);    
    }
}
onMounted(()=>getTrademark())
// 分页器 跳转 (页数发送变化时 执行此函数)
const pageChange = () => {
    // pageNo, limit 的值，与v-model绑定 自动修改 不用再传值
    // 重新调 获取品牌接口
    getTrademark()
}
// 分页器 下拉菜单 切换时执行此函数
const limitChange = () => {
    pageNo.value = 1
    getTrademark()
}
// 新增品牌 dialog对话框
const addTrademark = () => {
    trademarkParams.tmName = '' // 清空数据
    trademarkParams.logoUrl = ''
    trademarkParams.id = 0 // 清空参数中的id  变成添加
    isDialog.value = true // 打开对话框
    nextTick(() => { // 页面渲染前 清空校验错误的提示信息
        formRef.value.clearValidate('tmName') 
        formRef.value.clearValidate('logoUrl') 
    })
}
// 修改品牌 dialog对话框
const updataTrademark = (row) => {
    trademarkParams.tmName = row.tmName  // 回填数据
    trademarkParams.logoUrl = row.logoUrl
    trademarkParams.id = row.id
    isDialog.value = true // 打开对话框
    nextTick(() => { // 页面渲染前 清空上一次校验错误的提示信息
        formRef.value.clearValidate('tmName') 
        formRef.value.clearValidate('logoUrl') 
    })
}
// 底部按钮 取消 对话框
const cancel = () => {
    isDialog.value = false   // 关闭对话框
}
// 底部按钮 确认 对话框
const confirm = async () => {
    // 在发请求之前 先进行表单校验
    await formRef.value.validate()
    const result = await getAddOrUpdateTrademark(trademarkParams) // 新增&修改 品牌接口请求
    if (result.code === 200) {
        isDialog.value = false  // 1.关闭对话框
        ElMessage({             // 2.提示成功
            type: 'success',
            message: trademarkParams.id ? '修改成功' : '添加成功'
        })
        getTrademark(trademarkParams.id ? pageNo.value : 1) // 3.重新调获取品牌接口
    } else {
        ElMessage.error('上传失败') // 1.提示失败信息
        isDialog.value = false     // 2.关闭对话框
    }
}
// 图片上传完成的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //response 为上传图片后 服务器返回成功的数据（图片 地址）
  trademarkParams.logoUrl = response.data
  // 图片上传成功后 清空上一次校验错误的提示信息
  formRef.value.clearValidate('logoUrl') 

  // 上传新增品牌接口
  //getAddTrademark(addTrademarkParams)
}
// 图片上传前的钩子 约束文件大小及类型 
// const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
//   if (rawFile.type === 'image/jpg' && rawFile.type === 'image/png' && rawFile.type === 'image/gif') {
//     if(rawFile.size/1024/1024 < 4){
//         return true
//     }
//     else {
//         ElMessage.error('上传文件大小不超过4M')
//         return false
//     }
//   } else {
//     ElMessage.error('上传文件类型为jpeg|png|gif')
//     return false
//   }
// }
console.log()

// 品牌名 自定义校验名规则
const validateName = (rule:any, value:any, callBack:any) => {
    // value：表单中填写的数据 
    if (value.trim().length >= 2) { // 判断字符串去掉空格 大于等于 2个字符
        callBack() // 放行
    } else {
        callBack(new Error('请上传品牌名称 名称大于2位')) 
    }
}
// 品牌logo 自定义校验名规则
const validateLogoUrl = (rule:any, value:any, callBack:any) => {
    if (value) { // value 图片的地址
        callBack()
    } else {
        callBack(new Error('请上传品牌logo图片'))
    }
}
// 添加 与修改 品牌的form表单校验
const rules = { 
    // required:必须校验的项，表单前会有红色五星
    // validator：自定义校验名
    // trigger：触发校验规则的时机[blur,change]
    tmName:[{ validator: validateName, trigger: 'blur' ,required: true}],
    logoUrl:[{ validator: validateLogoUrl, required: true}]
}
// pop确认框 确定按钮
const confirmEvent = async(id:number) => {
    const result = await getDeleteTrademark(id) // 删除接口
    if (result.code === 200 ) {
        ElMessage({
            type:'success',
            message:'删除此品牌成功'
        })
        getTrademark(pageNo.value) // 重新获取数据 
    } else {
        ElMessage.error('删除此品牌失败')
    }
}
</script>

<style lang="scss" scoped>
.box-card{
    margin: 20px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>