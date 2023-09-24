// spu 接口
import type{ HasSpuResonse , SkuData, SkuInfoData} from './type'
import httpInstance from '@/utils/request'

enum API {
   HASSPU_URL = '/admin/product/', // 已有的SPU数据
   ALLTRDEMARK_URL = '/admin/product/baseTrademark/getTrademarkList', // 全部品牌的数据
   IMAGE_URL = '/admin/product/spuImageList/', // 某个spu下的全部售卖商品的图片数据
   SPUHASSALE_URL = '/admin/product/spuSaleAttrList/', // 某个spu下的 已有的销售属性
   ALLSALE_URL = '/admin/product/baseSaleAttrList',// 全部的销售属性(共三个：颜色，版本，尺码)
   ADDSPU_URL = '/admin/product/saveSpuInfo',      // 添加新的 SPU
   UPDATESPU_URL = '/admin/product/updateSpuInfo', // 更改已有 SPU
   DELETE_URL = '/admin/product/deleteSpu/', // 删除 已有SPU
   ADDSKU_URL = '/admin/product/saveSkuInfo', // 追加一个新增的sku
   SKUINFO_URL = '/admin/product/findBySpuId/'// 查看某一个已有的SPU下 全部在售商品
}
// 获取已有的SPU数据
export const  reqHasspu =(page:number, limit:number,category3Id:number) => httpInstance.get<any,HasSpuResonse>(API.HASSPU_URL+`${page}/${limit}?category3Id=${category3Id}`)
// 获取全部品牌的数据
export const allTrademark = () => httpInstance.get(API.ALLTRDEMARK_URL)
// 获取某个spu下的全部售卖商品的图片数据
export const spuImageList = (spuId:number) => httpInstance.get(API.IMAGE_URL+spuId)
// 获取某个spu下的 已有的销售属性
export const spuHasSale = (spuId:number) => httpInstance.get(API.SPUHASSALE_URL+spuId)
// 全部的销售属性(共三个：颜色，版本，尺码)
export const allSaleAttrList = () => httpInstance.get(API.ALLSALE_URL)
// 添加&更改 SPU(根据有无ID)
export const addAndUpdateSpu = (data) => {
   if (data.id) {
      return httpInstance.post<any,any>(API.UPDATESPU_URL, data)
   } else {
      return httpInstance.post<any,any>(API.ADDSPU_URL, data)
   }
}
// 删除 已有SPU
export const deleteSpu = (spuId:number)=> httpInstance.delete(API.DELETE_URL+spuId)
// 追加一个新增的sku
export const addSku = (data:SkuData) => httpInstance.post(API.ADDSKU_URL, data)
// 查看某一个已有的SPU下 全部在售商品
export const reqSkuList = (spuId:number) => httpInstance.get<any,SkuInfoData>(API.SKUINFO_URL+spuId)