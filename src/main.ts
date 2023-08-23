import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' // 引入element-plus插件与样式
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register' //svg需要的配置代码
import allGloablComponent from '@/components' // 引入自定义全局组件

// 获取应用实例
const app = createApp(App)
app.use(ElementPlus) // 安装element-plus插件
app.use(allGloablComponent) // 注册自定义全局组件
app.mount('#app') // 将应用挂载到挂载点上
