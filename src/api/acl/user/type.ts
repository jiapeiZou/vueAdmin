// 用户管理相关接口ts 类型

// 接口返回的基础数据
export interface requestUser {
    ok:boolean,
    message:string,
    code:number
}
// 一个账号 的信息
export interface user {
    id?: number,
    createTime: string,
    updateTime: string,
    username?: string, // 用户名
    password?: string,
    name?: string,   // 用户名称
    phone: null,
    roleName: string // 职位
}

// 获取全部用户信息接口返回的数据  
export interface requestData extends requestUser {
    data:{
        records:user[],
        total: number,
        size: number,
        current: number,
        pages: number,
    }
}



// 一个角色的数据类型
export interface role {
    id?:number,
    roleName: string,
    remark: null,
    createTime?: string,
    updateTime?: string,
}
// 获取用户角色 接口返回数据 类型
export  interface responseRole extends requestUser {
    data:{
        assignRoles: role[],
        allRolesList: role[]
    }
}