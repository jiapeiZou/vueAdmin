// 统一管理用户相关接口
import httpInstance from '@/utils/request'
import { loginForm, loginResponseData, userResponseData } from './type' // 接口 参数/返回 类型

// 统一管理接口
enum API {
    LOGIN_URL = '/admin/acl/index/login',

    USERINFO_URL = '/admin/acl/index/info',

    LOGOUT_URL = '/admin/acl/index/logout',
}
// 登录接口方法
export const reqLogin = (data:loginForm) => httpInstance.post<any, loginResponseData>(API.LOGIN_URL, data); // <any, loginResponseData> 表示请求体的类型为 any，响应体的类型则为 loginResponseData

// 获取用户信息接口方法
export const reqUserInfo = () => httpInstance.get<any,userResponseData>(API.USERINFO_URL);

// 退出登陆接口
export const reqLogout = () => httpInstance.post<any, any>(API.LOGOUT_URL)