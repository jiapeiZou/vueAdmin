// 对axios的二次封装： 拦截器

// 第一步：引入axios
import axios from 'axios'
import { ElMessage } from 'element-plus'  // 消息提示插件
import { useUserStore } from '@/store/modules/user' // 存储在 pinia 中 的用户数据（token 从此取）
import pinia from '@/store'

// 第二步：创建axios实例 利用axios对象的create方法（其他的配置：基础路径、超时时间）
const httpInstance = axios.create({
    baseURL:'/api',
    timeout: 5000
})

// 第三步：httpInstance实例添加 请求拦截器（在调接口前 执行）
httpInstance.interceptors.request.use((config) => {
    // 1. 从pinia获取token数据
    const userStore = useUserStore(pinia)
    // 如果有token 请求头就携带token去发请求
    if(userStore.Token) {
        config.headers.token = userStore.Token
    }
    // config配置对象，headers属性请求头，经常给服务器携带公共参数 「例：token 用户认证」
    // 返回配置对象
    return config
})

// 第四步：httpInstance实例添加 响应拦截器（在调接口后 执行）
httpInstance.interceptors.response.use((res) => {
    // 成功回调 ：简化数据
    return res.data
},(error) => {
    // 失败回调： 处理http网络错误
    // 定义一个变量：存储网络错误信息
    let message = '';
    // http状态码
    const status = error?.response?.status;
    // （ 根据状态码进行判断 
    switch (status) {
        case 401:
            message = "TOKEN过期"
            break;
        case 403:
            message = "无权访问"
            break;
        case 404:
            message = "请求地址错误"
            break;
        case 500:
            message = "服务器出现问题"
            break;
        default:
            message = "网络出现错误"
            break;
    }
    // 错误提示
    ElMessage({
        type: 'error',
        message: message
    })

    return Promise.reject(error) // 返回失败对象
})

// 第五步：对外导出
export default httpInstance