// 菜单接口相关ts类型

// 接口基础数据
export interface responseData {
    ok:boolean,
    message: string,
    code:number,
}

// 单个权限管理
export interface MenuData {
    id?:number, // 独有的ID
    createTime:string,
    updateTime:string,
    pid:number,
    name:string, // 权限名称
    code:string,
    toCode:string,
    type:number,
    status:null,
    level:number, // 层级
    children?:MenuData[],
    select:boolean // 是否勾选
}

// 获取菜单接口返回数据
export interface reqMenu extends responseData {
    data:MenuData[]
}