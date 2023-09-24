// 分类相关的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
// 分类ts类型
export interface CategoryObj {
    category2Id?: number,
    category1Id?: number,
    id: number,
    name: string
}
// 相应接口返回数据类型
export interface CategoryResponse extends ResponseData{
    data: CategoryObj[]
}

// 属性与属性值的ts 类型

// 属性值对象
export interface attrValue {
    id?: number,
    valueName: string,
    attrId: number
} 
// 存储每一个属性值的数组类型
export interface Attr {
    id?: number,
    attrName: string,
    categoryId?: number,
    categoryLevel: number,
    attrValueList: attrValue[]
}
// 相应接口返回数据类型
export interface AttrResponse extends ResponseData{
    data: Attr[]
}