
import { defineStore } from 'pinia'
import router from '@/router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index' // 登录请求接口 & 获取用户信息接口 & 退出登陆接口
import type { loginForm, loginResponseData, userResponseData } from '@/api/user/type' // 参数类型
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes' // 引入路由（常量路由, 异步路由, 任意路由)
import cloneDeep from 'lodash/cloneDeep' // 按需引入安装的lodash库 中的深拷贝方法



// 用于过滤当前用户需要展示的异步路由 
// 参数 asyncRoute：全部的异步路由数组 routes：用户登陆后获取到的能够访问的权限
function filterAsyncRouteName (asyncRoute:any, routes:any) {
  return asyncRoute.filter(item => {
    if(routes.includes(item.name)) {
        if( item.children && item.children.length>0 ){
          // 递归  因为asyncRoute异步路由包含子路由 有嵌套，需要对每一个路由都做一次判断
          item.children = filterAsyncRouteName(item.children, routes)// 返回符合条件的数组
        }
        return true
     }
  })
}

export const useUserStore = defineStore('User', () => {
  // 1.定义管理用户数据的state
  const Token = ref('')           // 存储Token
  const userAvatar = ref('')      // 存储用户头像
  const userName = ref('')        // 存储用户名
  const menuRoutes = ref<any>([]) // 存储生成菜单需要的数组（路由项 数组）
  const userBtn = ref<any>([])         // 存储用户de权限按钮

  // 2. 定义获取接口数据的action同步异步函数
  // 2-1;用户登录
  const userLogin = async (data: loginForm) => {
    const result: loginResponseData = await reqLogin(data)
    // 登录成功 -> 200 token
    if (result.code === 200) {
      // 存储token
      Token.value = result.data
      // 保证async函数返回一个成功的promise
      return 'yes'
    }
    // 登录失败 -> 201 message错误原因
    else {
      ElMessage({
        type: 'error',
        message: result.data
      })
      return Promise.reject(new Error(result.data))
    }
  }

  // 2-2;获取用户信息接口
  const getUserInfo = async () => {
    const result: userResponseData = await reqUserInfo()
    if (result.code === 200) {
      userAvatar.value = result.data.avatar // 用户头像
      userName.value = result.data.name     // 用户名
      userBtn.value = result.data.buttons   // 用户的权限按钮
      // 登陆成功后 执行（权限管理问题 函数筛选出用户拥有的权限的路由名）asyncRoute：包含全部的异步路由的数组，深拷贝后的数据。 result.data.routes:用户可以访问的 权限路由名
      const userAsyncRoutes = filterAsyncRouteName(cloneDeep(asyncRoute), result.data.routes); // 函数返回筛选后的数组
      
      // 存储生成菜单需要的数组（路由项 数组）
      menuRoutes.value = [...constantRoute, ...userAsyncRoutes, ...anyRoute];
      // 给路由动态追加注册 筛选出的动态路由
      [...userAsyncRoutes, ...anyRoute].forEach(item => {
        router.addRoute(item)
      })
      // 打印当前用户全部路由
      //console.log(router.getRoutes());

      return 'ok'
    } else {
      return Promise.reject('获取用户信息失败')
    }
  }
  // 2-3;退出登陆 清空用户信息
  const logout = async () => {
    const result = await reqLogout()
    if (result.code === 200) {
      userAvatar.value = ''
      userName.value = ''
      Token.value = ''
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
    // console.log('logout',result);

  }
  return {
    Token, menuRoutes, userAvatar, userName, userBtn,
    logout, userLogin, getUserInfo
  }
}
// pinia 持久化
  , {
    persist: {
      paths: ['Token'] // 只保存token 
    } 
  }
)