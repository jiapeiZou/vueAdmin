// 定义ts类型

// 登录接口 
//需要携带的参数ts类型
export interface loginForm {
    username: string, 
    password: string 
}
// 返回 登录接口数据类型
export interface loginResponseData { 
    code: number,
    data: string,
    message: string,
    ok: boolean
}

// 服务器 返回 用户信息相关的数据类型
export interface userResponseData {
    message: string,
    ok: boolean,
    code: number,
    data: {
        routes: string[],
        buttons: string[],
        roles: string[],
        name: string,
        avatar: string,
    }
}
