<template>
    <div class="login_container">
        <!-- Element UI 创建一个响应式的行列布局。 el-col代表列 这里有两列，左边(占位什么都没显示) 右边。总共24份 一边一半 ，当屏幕很小时 只显示右边-->
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="form" :rules="rules" :model="loginForm" ref="formRef">
                    <h1>Hello</h1>
                    <h2>欢迎来到甄选</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" placeholder="用户名" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
                    </el-form-item>
                    <el-button  :loading="loading" size="default" type="primary" class="button" @click="handleLoginClick">登陆</el-button>
                
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { User, Lock } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router'
import { reactive, ref  } from 'vue';
import { useUserStore } from '@/store/modules/user' // 引入用户pinia仓库
import pinia from '@/store';
import { ElNotification } from 'element-plus' // 消息提示框
import { getTime } from '@/utils/time' // 当前时间段

const loading = ref(false) // 等待加载时的 旋转效果 (网速慢时 明显)
const router = useRouter()
const loginForm = reactive({username: '', password: ''})
const userStore = useUserStore(pinia) // 仓库数据
const formRef = ref() // 表单元素dom

console.log('11111',userStore.menuRoutes)
// 点击登录时
const handleLoginClick = async () => {
    // 只有通过所有校验通过 才能发请求
    await formRef.value.validate()
    // 开始加载
    loading.value = true
    try {
        await userStore.userLogin(loginForm) // 点击登录 通知仓库发登录请求
        router.push('/') // 跳转到登陆成功页
        ElNotification({ // 消息提示框
            type: 'success',
            message: '欢迎回来',
            title:`Hi,${getTime()}好`
        })
        loading.value = false
    } catch (error) {
        loading.value = false
    }  
}

// form表单 自定义 校验规则
const validatorUserName = (rule: any, value: any, callback: any) => {
    // rule:校验规则对象
    // value: 表单文本内容
    // callback: 函数 if 符合条件执行callback()放行 ，else 不符合注入错误提示信息
    if ( value.length>4  ) { // /^[a-zA-Z]{5,12}$/.test(value)
        callback()
    } else {
        callback(new Error('用户名长度为5-12位之间的英文字母'))
    }
}
const validatorPassWord = (rule: any, value: any, callback: any) => {
    if ( value.length>=6 ) {
        callback()
    } else {
        callback( new Error('密码长度为6-14个字符'))
    }
}
// rules 准备规则对象 自定义
const rules = {
    username:[
        //{ required: true, min:4, max: 12, message: '用户名长度为4-12位之间', trigger: 'blur' }
        { validator: validatorUserName, trigger: 'change' }
    ],
    password:[
        //{ required: true, min: 6, max: 12, message: '密码长度为6-14个字符', trigger: 'blur' }
        { validator: validatorPassWord, trigger: 'change' }
    ]
}



</script>

<style lang="scss" scoped>
.login_container{
    margin: 0;
    padding: 0;
    width:100%;
    height:100vh;
    background:url('@/assets/images/background.jpg') no-repeat ;
    background-size: cover;
    .form{
        h1{
            margin: 0;
            color: #fff;
            font-weight: normal;
            font-size: 40px;
        }
        h2{
            color: #fff;
            font-weight: normal;
            font-size: 20px;
        }
        padding: 30px 20px;
        position: relative;
        width: 80%;
        top: 30vh;
        background: url('@/assets/images/login_form.png') no-repeat;
        background-size: cover;
        .button{
            width: 100%;
        }
    }
}
</style>