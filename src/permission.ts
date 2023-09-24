// 路由鉴权 ：项目中路由能不能被访问的权限 的设置（某一个路由 什么条件可访问 ，什么条件下不可以访问）
import router from "@/router/index"
import nprogress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css'  // 引入进度条插件样式
import pinia from "./store"
import { useUserStore } from '@/store/modules/user'
import setting from "./setting"
nprogress.configure({ showSpinner: false }) // 去掉进度条 小圆圈 样式

// 全局路由守卫

// 全局路由前置守卫（页面跳转前）
router.beforeEach( async (to, from, next) => {
    const userStore = useUserStore(pinia)
    // to : 将要访问的目标路由对象
    // from : 正要离开的路由
    // next : 放行函数 
    nprogress.start() // 进度条：开始 
    // 判断是否登陆 有token 
    if(userStore.Token) {
    // 1.已登陆：不能再访问login 跳转到首页home
        if(to.path === '/login') {
            next({ path:'/' })
        } else{
            // 有用户信息 放行
            if(userStore.userName){
                next()
            }else{
                // 无用户信息，调接口获取
                try{
                    await userStore.getUserInfo();
                    // 解决异步路由跳转时白屏问题：有可能获取到用户信息，但异步路由还没有加载完毕，就前往该路由
                    next({...to});
                } catch (error) { // token 失效
                   await userStore.logout() // 退出登陆 清空用户信息
                    next({ path:'/login' }) // 跳转到login登陆页重新登陆
                }
            }
        }
    // 2.未登陆：只能访问login
    } else {
        // 2.1未登陆想去login页面 -> 放行
        if(to.path === '/login') {
            next()
        // 2.2未登陆想去其他页面 -> 直接跳转到login登录页
        } else {
            next({ path:'/login' })
        }
    }
})
// 全局路由后置守卫（页面跳转后）
router.afterEach((to, from, next ) => {
   document.title = `${setting.title}-${to.meta.title}` // 修改浏览器顶上的标题
   nprogress.done() // 进度条：结束
})