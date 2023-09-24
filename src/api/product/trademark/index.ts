// 品牌管理 接口
import httpInstance from '@/utils/request'
// 数据类型
import type{ tradeMarkResponseData , TradeMark } from './type'


// 获取已有品牌的接口
// 参数 page :获取第几页的数据（默认第1页）
// 参数limit： 获取几个已有品牌的数据
export const hasTrademark = (page:number, limit:number) => httpInstance.get<any,tradeMarkResponseData>(`/admin/product/baseTrademark/${page}/${limit}`)
// 新增品牌 & 修改品牌 
export const getAddOrUpdateTrademark = (data: TradeMark) => {
    if (data.id){
        // 修改品牌
       return httpInstance.put<any,any>('/admin/product/baseTrademark/update', data)
    } else {
        // 新增品牌
       return httpInstance.post<any,any>('/admin/product/baseTrademark/save', data)
    }
}
// 删除品牌
export const getDeleteTrademark = (id:number) => httpInstance.delete(`/admin/product/baseTrademark/remove/${id}`)
