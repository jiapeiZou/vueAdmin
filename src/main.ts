import { createApp } from 'vue'
import App from './App.vue'

//import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入 pinia 用户数据持久化，把数据存在localStorage中
import ElementPlus from 'element-plus' // 引入element-plus插件与样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 引入element-plus 暗黑模式

import 'virtual:svg-icons-register' //svg需要的配置代码
import allGloablComponent from '@/components' // 引入自定义全局组件
import '@/styles/index.scss' // 引入模版的全局样式
import pinia from './store' // 引入pinia仓库
import router from './router' // 引入路由
import './permission' // 执行路由守卫
import { isHasBtn  } from './directive/has' // 自定义指令


// 获取应用实例
const app = createApp(App)

isHasBtn(app)  // app作为参数传递给 自定义指令

//pinia.use(piniaPluginPersistedstate) //pinia注册 数据持久化 插件 
app.use(router) // 注册路由
app.use(pinia)  // 注册安装pinia仓库
app.use(ElementPlus) // 安装element-plus插件
app.use(allGloablComponent) // 注册自定义全局组件
app.mount('#app') // 将应用挂载到挂载点上
