
// 服务器全部返回的数据类型
export interface ResponseData {
    ok:boolean,
    message:string,
    code:number
}

// spu数据 类型
export interface hasSpu {
    id?: number,
    spuName: string,
    description: string,
    category3Id: 61,
    tmId: 6, // 品牌ID
    spuSaleAttrList: null, // spu销售属性
    spuImageList: null, // spu照片
}
// records 数组：元素都是 已有的spu数据 类型
export type Records =  hasSpu[]

// 获取已有的spu 接口返回的数据ts类型
export interface HasSpuResonse extends ResponseData {
    data:{ records:Records }
    total: number,
    size: number, 
    current: number, 
    searchCount: boolean,
    pages: number
}

// 品牌对象类型
export interface Trademark {
    id:number,
    tmName:string,
    logoUrl:string
}
// 全部的品牌 
export interface allTrademark extends ResponseData{
    data: Trademark[]

}
// 商品图片ts类型
export interface spuimg {
    id:number,
    spuId:number,
    imgName:string,
    imgUrl:string,
    createTime:null,
    updateTime:null
}
// 已有的spu的照片墙数据类型 
export interface spuHasImg extends ResponseData{
    data: spuimg[]
}

// 已有的销售属性值对象
export interface SaleAttrValue {
    id?:number,
    spuId:number,
    createTime:null,
    updateTime:null,
    baseSaleAttrId:number,
    saleAttrName:string,
    saleAttrValueName:string,
    isChecked:null
}

// 追加一个新增的sku 参数 数据类型 
export interface SkuData {
    category3Id: string|number, // 三级分类ID
    spuId: string|number, // 已有的spuId
    tmId: string|number, // 已有的spu品牌 ID
    skuName: string, // 新增的sku名字
    price: string|number, // sku价格
    weight: string|number,//  sku重量
    skuDesc: string, //  sku 描述  
    skuAttrValueList: [ //  sku平台属性
       {
         attrId: string|number, // 平台属性id
         valueId:string|number,  // 平台属性值id
       }
     ],
     skuSaleAttrValueList: [ //  sku 销售属性
       {
         saleAttrId: string|number,
         saleAttrValueId: string|number,
       }
     ],
     skuDefaultImg: string, //  sku 图片地址
  }
 
  // 获取sku数据接口返回的ts 类型
  export interface SkuInfoData extends ResponseData {
    data:SkuData[]
  }