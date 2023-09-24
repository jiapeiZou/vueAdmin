
// 角色添加 与 编辑 参数的类型
export interface roleData {
    createTime?:string,
    id?: number,
    remark: null,
    roleName:string,
    updateTime?: string
}
// 菜单 权限管理 
export interface MenuData {
    id:number, // 独有的ID
    createTime:string,
    updateTime:string,
    pid:number,
    name:string, // 权限名称
    code:string,
    toCode:string,
    type:number,
    status:null,
    level:number, // 层级
    children?:MenuList,
    select:boolean // 是否勾选
}
export type MenuList = MenuData []
// 全部菜单 接口返回数据的类型
export interface responseMenu {
    ok:boolean,
    message: string,
    code:number,
    data: MenuData[]
}