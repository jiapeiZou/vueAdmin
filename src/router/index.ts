
// 通过vue-router插件实现模版路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'

// 创建路由器
const router = createRouter({
    // hash路由模式
    history : createWebHashHistory(),
    routes : constantRoute,
    // 路由滚动行为定制（切换不同路由时 自动滚动到顶部）
    scrollBehavior() {
        return {
            top: 0,
            left: 0
        }
    }
})

export default router