// 已有品牌 ts类型
export interface TradeMark {
    id? : number,
    tmName: string,
    logoUrl: string
}
// 包含全部品牌数据的 ts类型
export type Records = TradeMark[]

// 获取已有全部品牌 返回的数据 ts类型
export interface tradeMarkResponseData{
   code: number,
   ok: string,
   message: string,
   data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: string,
    pages: number
   }
}
