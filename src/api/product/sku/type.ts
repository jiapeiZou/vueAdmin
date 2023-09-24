import {SkuData} from '@/api/product/spu/type'

export interface ResponseData {
    ok: boolean,
    code: number,
    message: string
}
// 定义SKU接口返回数据类型
export interface SkuResponse extends ResponseData{
    data:{
        records:SkuData[]
    }
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
}