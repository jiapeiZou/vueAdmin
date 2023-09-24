// 菜单接口
import httpInstance from "@/utils/request";
import { reqMenu } from "./type"

// 枚举地址
enum API {
    PERMISSION_URL = '/admin/acl/permission',        // 获取全部菜单
    DELEYE_URL = '/admin/acl/permission/remove/',    // 删除接口
    ADD_URL = '/admin/acl/permission/save',     // 新增
    UPDATE_URL = '/admin/acl/permission/update', // 修改
}
// 获取全部菜单接口
export const getPermission = () => httpInstance.get<any,reqMenu>(API.PERMISSION_URL)
// 删除接口
export const remove = (id:number) => httpInstance.delete(API.DELEYE_URL+id)
// 新增&修改 
export const addAndUpdate = (data) => {
    if(data.id) {
        return httpInstance.put(API.UPDATE_URL,data)
    } else {
        return httpInstance.post(API.ADD_URL,data)
    }
}