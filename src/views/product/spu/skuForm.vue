<template>
    <div>
        <el-form label-width="80px">
            <!--  -->
            <el-form-item label="SKU名称">
                <el-input placeholder="sku名称" v-model="skuparams.skuName"> </el-input>
            </el-form-item>
            <!--  -->
            <el-form-item label="价格(元)">
                <el-input placeholder="价格(元)" type="number" v-model="skuparams.price"> </el-input>
            </el-form-item>
            <!--  -->
            <el-form-item label="重量(克)">
                <el-input placeholder="重量(克)" type="number" v-model="skuparams.weight"> </el-input>
            </el-form-item>
            <!--  -->
            <el-form-item label="SKU描述">
                <el-input placeholder="sku描述" type="textarea" v-model="skuparams.skuDesc"> </el-input>
            </el-form-item>
            <!--  -->
            <el-form-item label="平台属性" >
                <el-form inline="true"  label-width="80px">
                    <el-form-item  v-for="item in attrArr" :key="item.id"  :label="item.attrName" style="margin-bottom: 10px;">
                        <!-- 在被选中的那一项的 attrArr 中新增一个属性，存储参数需要的数据 。 最后通过判断有新属性的则 是被选中的-->
                        <el-select v-model="item.attrIdAndValueId">
                            <el-option v-for="i in item.attrValueList" :key="i.id" :label="i.valueName" :value="`${item.id}:${i.id}`"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <!--  -->
            <el-form-item label="销售属性">
                <el-form>
                    <el-form-item v-for="sale in hasSale" :key="sale.id" :label="sale.saleAttrName" style="margin-bottom: 10px;">
                        <el-select v-model="sale.saleIdAndValueId">
                            <el-option  v-for="i in sale.spuSaleAttrValueList" :key="i.id" :label='i.saleAttrValueName' :value="`${sale.id}:${i.id}`"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <!--  -->
            <el-form-item label="图片名称">
                <el-table border :data="imgList" ref="table">
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column label="图片" align="center">
                        <template #="{row,$index}">
                           <img :src="row.imgUrl" style="width: 120px; height:120px;">
                        </template>
                      </el-table-column>
                      <el-table-column label="名称" prop="imgName"></el-table-column>
                      <el-table-column label="操作">
                        <template #="{row,$index}">
                            <el-button type="warning"  @click="handleCheck(row)">设置默认</el-button>
                        </template>
                      </el-table-column>
                </el-table>
            </el-form-item>
            <!--  -->
            <el-form-item>
               <el-button type="primary" @click="handleSave">保存</el-button>
               <el-button type="primary" @click="handleBack">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup >
import { spuImageList, spuHasSale, addSku } from '@/api/product/spu/index' // 产品图片 及 销售属性数据 接口
import { attr } from '@/api/product/attr/index' // 已有属性与属性值 接口
import useCategoryStore  from '@/store/modules/category' // 仓库
import type{ SkuData } from '@/api/product/spu/type'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
const attrArr = ref([]) // 已有属性与属性值
const hasSale = ref([]) // 销售属性 
const imgList = ref([]) // 图片
const table = ref() // 获取table组件实例，调用其中的方法 
// 新增的sku 参数数据收集
const skuparams = reactive<SkuData>({
   category3Id: '', // 三级分类ID
   spuId: '', // 已有的spuId
   tmId: '', // 已有的spu品牌 ID
   skuName: '', // 新增的sku名字 .
   price: '', // sku价格 .
   weight: '',//  sku重量 .
   skuDesc: '', //  sku 描述  .
   skuDefaultImg: '', //  sku 图片地址
   skuAttrValueList: [ //  sku平台属性
      {
        attrId: '', // 平台属性id
        valueId:'',  // 平台属性值id
      }
    ],
    skuSaleAttrValueList: [ //  sku 销售属性
      {
        saleAttrId: '',
        saleAttrValueId: '',
      }
    ],
 })



// 自定义事件 (点击取消时，通知父组件 切换回0场景)
const emit = defineEmits(['changeScene'])
// 取消按钮
const handleBack = () => {
    emit('changeScene', {flag:0, params:''})
}
// 对外暴露的方法
const initSku = async(row) => {
    // 发请求获取 图片，销售属性 , 已有属性与属性值
    const result2 = await spuImageList(row.id) // 参数：spuId  
    imgList.value = result2.data
    const result1 = await spuHasSale(row.id) // 参数：spuId
    hasSale.value = result1.data
    console.log(result1);
    const result = await attr(categoryStore.c1Id, categoryStore.c2Id, row.category3Id) // 参数：c1Id,c2Id,c3Id
    attrArr.value = result.data
    // 收集参数数据
    skuparams.category3Id = row.category3Id
    skuparams.spuId = row.id
    skuparams.tmId = row.tmId
    
}
// 设置默认按钮 回调
const handleCheck = (row) => {
    // 先让全部 不勾选状态!!!!!
    imgList.value.forEach(item =>table.value.toggleRowSelection(item,false))
    // 点击行 被选中
    table.value.toggleRowSelection(row,true)
  // 收集参数图片地址
  skuparams.skuDefaultImg = row.imgUrl
}
// 确定按钮
const handleSave = async() => {
    // 整理参数数据（销售属性 平台属性）
    const newattr = attrArr.value.filter(item => item.attrIdAndValueId) // 筛选出被标记的选项
    skuparams.skuAttrValueList = newattr.map(item => {
        const attrIdAndValueId = item.attrIdAndValueId;
        const attrId = attrIdAndValueId.split(':')[0];
        const valueId = attrIdAndValueId.split(':')[1];
        return {
            attrId, valueId
        }
    });
    const newsale = hasSale.value.filter(item => item.saleIdAndValueId) // 筛选出被标记的选项
    skuparams.skuSaleAttrValueList = newsale.map(item => {
        const saleIdAndValueId = item.saleIdAndValueId // =>[id1,id2]
        const saleAttrId = saleIdAndValueId.split(':')[0] 
        const saleAttrValueId = saleIdAndValueId.split(':')[1]
        return {
            saleAttrId,
            saleAttrValueId
        }
    })
    // 发请求
    const result = await addSku(skuparams)
    if(result.code === 200){
         // 成功 消息提示
        ElMessage({
            type:'success',
            message:'添加SKU成功'
        })
        // 通知父亲 返回0场景
        emit('changeScene', {flag:0, params:''})
    } else {
        // 失败 消息提示
        ElMessage.error('添加SKU失败')
    }
    
}
// 对外暴露 自己的方法
defineExpose({initSku})
</script>

<style lang="scss" scoped>

</style>