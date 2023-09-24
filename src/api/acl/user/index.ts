// 用户管理相关接口
import httpInstance from '@/utils/request'
import type { requestData, responseRole } from './type'

// 枚举地址
enum API {
    ALLUSER_URL = '/admin/acl/user/',         // 获取全部已有用户账号信息
    ADDUSER_URL = '/admin/acl/user/save',     // 新增 用户
    UPDATEUSER_URL = '/admin/acl/user/update', // 修改已有的账号信息
    HASANDALLROLE_URL = '/admin/acl/user/toAssign/',//根据用户获取角色数据 and 全部角色展示
    ADDANDUPDATE_URL = '/admin/acl/user/doAssignRole', //  获取用户已有角色数据 and 全部角色展示
    DELETE_URL = '/admin/acl/user/remove/',        // 单项删除用户数据
    DELETEMANY_URL = '/admin/acl/user/batchRemove',    // 批量删除 根据id列表删除用户
}

// 获取全部已有用户账号信息
export const getAllUser = (page:number, limit:number, username:string) => httpInstance.get<any,requestData>(API.ALLUSER_URL+`${page}/${limit}/?username=${username}`)
// 新增 & 编辑 用户（根据有无ID）
export const addOrUpdateUser = (data) => {
    // 有ID 编辑
    if(data.id){
        return  httpInstance.put(API.UPDATEUSER_URL, data)
        
        // 无ID 新增
    } else {
        return httpInstance.post(API.ADDUSER_URL, data)
    }
}
//  获取用户已有角色数据 and 全部角色展示
export const hasRole = (adminId:number) => httpInstance.get<any,responseRole>(API.HASANDALLROLE_URL+adminId)
// 新增或更改用户的角色
export const addAndUPdate = (data) => httpInstance.post(API.ADDANDUPDATE_URL,data)
// 单项删除用户数据
export const deleteUser = (id:number) => httpInstance.delete(API.DELETE_URL+id)
// 批量删除用户数据
export const deleteSomeUser = (idlist:number[]) => httpInstance.delete(API.DELETEMANY_URL,{data:idlist})