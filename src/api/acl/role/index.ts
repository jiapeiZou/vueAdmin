// 用户角色职位 相关接口
import httpInstance from "@/utils/request";
import type{ roleData, responseMenu } from './type'

enum API {
    ALLROLE_URL = '/admin/acl/role/', // 获取全部职位接口
    DELETE_URL = '/admin/acl/role/remove/', // 删除角色
    ADD_URL = '/admin/acl/role/save', // 新增角色
    UPDATE_URL = '/admin/acl/role/update', // 修改角色
    ALLMENU_URL = '/admin/acl/permission/toAssign/', // 获取全部的菜单与当前用户的权限
    SETPERMISTION_URL = '/admin/acl/permission/doAssign', // 给相应的职位分配权限

}

// 获取全部职位接口
export const getAllRole = (page:number,limit:number, roleName:string) => httpInstance.get(API.ALLROLE_URL+`${page}/${limit}/?roleName=${roleName}`)
// 删除角色
export const deleteRole = (id:number) => httpInstance.delete(API.DELETE_URL+id)
// 新增&修改 角色(判断有无ID)
export const addAndUpdate = (data:roleData) => {
    if (data.id){
        return httpInstance.put(API.UPDATE_URL,data)
    } else {
        return httpInstance.post(API.ADD_URL, data)
    }
}
// 获取全部的菜单与当前用户的权限
export const getAllMenuList = (id:number) => httpInstance.get<any,responseMenu>(API.ALLMENU_URL+id)
// 给相应的职位分配权限 (permissionId:选中和未确定状态的ID)
export const setpermisstion = (roleId:number, permissionId:number[]) => httpInstance.post(API.SETPERMISTION_URL+`?roleId=${roleId}&permissionId=${permissionId}`)