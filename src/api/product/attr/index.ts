// 商品属性 分类管理 API1
import httpInstance from '@/utils/request'
import type{ CategoryResponse, AttrResponse } from './type'

enum API {
    C1_URL = '/admin/product/getCategory1',   // 获取一级分类接口
    C2_URL = '/admin/product/getCategory2/',  // 获取二级分类接口
    C3_URL = '/admin/product/getCategory3/',  // 获取三级分类接口
    ATTR_URL = '/admin/product/attrInfoList/',// 获取分类后的产品数据接口
    ADDORUODATEATTR_URL = '/admin/product/saveAttrInfo', // 获取添加 & 修改 已有属性的接口
    DELETE_URL = '/admin/product/deleteAttr/' // 获取删除分类属性接口
}

// 获取一级分类接口
export const reqC1 = () => httpInstance.get<any , CategoryResponse>(API.C1_URL)
// 获取二级分类接口
export const reqC2 = (category1Id:number) => httpInstance.get<any , CategoryResponse>(API.C2_URL+category1Id)
// 获取三级分类接口
export const reqC3 = (category2Id:number) => httpInstance.get<any , CategoryResponse>(API.C3_URL+category2Id)
// 获取分类后的 已有的属性与属性值接口
export const attr = (category1Id:number, category2Id:number, category3Id:number) =>httpInstance.get<any,AttrResponse>(API.ATTR_URL+ `${category1Id}/${category2Id}/${category3Id}`)
// 获取添加 & 修改 已有属性的接口
export const addOrUpdateAttr = (data:Attr) => httpInstance.post(API.ADDORUODATEATTR_URL, data)
// 获取删除分类属性接口
export const deleteAttr = (attrId:number) => httpInstance.delete(API.DELETE_URL+attrId)

// 修改属性 参数
// {
//     "id": 0,  //已有 属性ID
//     "attrName": "string", // 已有 属性名称
//     "categoryId": 0,      // 三级分类ID （已有属性归属 哪个三级分类
//     "categoryLevel": 3,   // 三级分类
//     "attrValueList": [
//       {
//         "attrId": 0, // 属性值归属哪个属性
//         "id": 0,     // 已有 属性值ID
//         "valueName": "string"  //  属性值名称
//       }
//     ],
//   }
// 新增属性 参数
// {
//     "attrName": "string", // 属性名称
//     "categoryId": ,      // 三级分类ID （属性 归属哪个三级分类
//     "categoryLevel": 3,   // 三级分类
//     "attrValueList": [
//       {
//         "valueName": " "  //  属性值名称
//       }
//     ],
//   }