// sku 模块接口
import httpInstance from '@/utils/request'
import type{ SkuResponse } from './type'
// 枚举地址
enum API {
    SKU_URL ='/admin/product/list/',                // 获取已有的商品数据 -sku
    CANCELSALE_URL = '/admin/product/cancelSale/',  // 下架sku
    ONSALE_URL = '/admin/product/onSale/',          // 上架sku
    DELETE_URL = '/admin/product/deleteSku/',       // 删除当前sku 
    SKUINFO_URL = '/admin/product/getSkuInfo/', // 获取当前行的sku数据
}

// 获取已有的商品数据 -sku
export const getSku = (page:number, limit:number) => httpInstance.get<any,SkuResponse>(API.SKU_URL+ `${page}/${limit}`)
// 下架sku
export const cancelSku = (skuId:number) => httpInstance.get(API.CANCELSALE_URL+`${skuId}`)
// 上架sku
export const onSku = (skuId:number) => httpInstance.get(API.ONSALE_URL+`${skuId}`)
// 删除当前sku
export const deleteSku = (skuId:number) => httpInstance.delete(API.DELETE_URL+skuId)
// 获取当前行的sku数据
export const getSkuInfo = (skuId:number) => httpInstance.get(API.SKUINFO_URL+skuId)