<template>
    <div>
        <el-card style="margin:20px">
            <!-- 表格 -->
            <el-table border  :data="skuList"  height="500" style="margin-bottom:20px">
                <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column label="名称" prop="skuName" show-overflow-tooltip width="200" ></el-table-column>
                <el-table-column label="描述" prop="skuDesc" show-overflow-tooltip  width="200" ></el-table-column>
                <el-table-column label="默认图片" width="200" align="center">
                    <template #="{row,$index}">
                        <img :src="row.skuDefaultImg" style="width:100px; height:100px;">
                    </template>
                </el-table-column>
                <el-table-column label="重量(g)" prop="weight" width="160" ></el-table-column>
                <el-table-column label="价格(元)" prop="price" width="160" ></el-table-column>
                <el-table-column label="操作" width="300" fixed="right" align="center">
                    <template #="{row,$index}">
                        <el-button :icon="row.isSale === 1 ? 'Bottom' : 'Top' " type="success" size="small" @click="handlesale(row)"></el-button>
                        <el-button icon="Edit" type="primary" size="small" @click="updateClick"></el-button>
                        <el-button icon="InfoFilled" type="info" size="small" @click="handleLook(row)" ></el-button>
                        <el-popconfirm title="确定删除此商品吗?" @confirm="handleDelete(row)" width="200px">
                            <template #reference>
                                <el-button icon="Delete" type="danger" size="small" ></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
                v-model:current-page="pageNo"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[5,10, 20]"
                :background="true"
                layout=" prev, pager,next, jumper,->,sizes, total"
                @size-change="handleSizeChange"
                @current-change="getHasSku"
             />
             <!-- 抽屉组件 -->
            <el-drawer v-model="isOpen" >
                <!-- 标题区 -->
                <template #header>
                    <h4>查看商品详情</h4>
                </template>
                <!-- 内容区 -->
                <template #default>
                    <!-- 描述 -->
                    <el-descriptions :column="1" >
                        <el-descriptions-item label="名称">{{skuInfo.skuName}}</el-descriptions-item>
                        <el-descriptions-item label="描述">{{skuInfo.skuDesc}}</el-descriptions-item>
                        <el-descriptions-item label="价格">{{skuInfo.price}}</el-descriptions-item>
                        <el-descriptions-item label="平台属性"> 
                            <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id"  style="margin: 5px;">{{ attr.attrName }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="销售属性" style="margin: 5px;">
                            <el-tag v-for="sale in skuInfo.skuSaleAttrValueList" :key="sale.id" type="success" style="margin: 5px;">{{ sale.saleAttrName }}:{{ sale.saleAttrValueName }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="商品图片">
                            <el-carousel :interval="4000" type="card" height="200px">
                                <el-carousel-item v-for="img in skuInfo.skuImageList" :key="img.id">
                                    <img :src="img.imgUrl" style="width:100%; height:100%;">
                                </el-carousel-item>
                            </el-carousel>
                        </el-descriptions-item>
                    </el-descriptions>
                </template>
            </el-drawer>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getSku, cancelSku, onSku, deleteSku, getSkuInfo} from '@/api/product/sku/index' // 接口
import { ElMessage } from 'element-plus';
const total = ref(0)     // 分页器总页数
const pageNo = ref(1)    // 分页器当前页码
const pageSize = ref(10) // 每一页展示几条数据
const skuList = ref([])  // 已有的sku 数据
const skuInfo = ref({})    // 当前行的sku 数据
const isOpen = ref(false)

// 组件挂载完毕获取数据
onMounted(() => {
    getHasSku()
})
// 获取sku数据
const getHasSku = async(pager=1) => {
    pageNo.value = pager
    const result = await getSku(pageNo.value, pageSize.value)
    if (result.code === 200){
        total.value = result.data.total
        skuList.value = result.data.records
        console.log(skuList.value)
    }
}
// 分页器 limit切换回调
const handleSizeChange = () => {
    getHasSku()
}
// 商品上架/下架
const handlesale = async (row) => {
    // isSale=1 在售商品状态 （需要下架）
    if (row.isSale === 1) {
        const result = await cancelSku(row.id)
        if (result.code === 200){
            // 消息提示
            ElMessage({
                type:'success',
                message:'下架成功'
            })
            // 刷新页面
            getHasSku()
        } else {
            ElMessage.error('下架失败')
        }
    } else {
        // isSale=0 下架商品状态 （需要上架）
        const result0 = await onSku(row.id)
        if (result0.code === 200){
            // 消息提示
            ElMessage({
                type:'success',
                message:'下架成功'
            })
             // 刷新页面
             getHasSku()
        }else {
            ElMessage.error('下架失败')
        }
    }
}
// 更新按钮
const updateClick = () => {
    ElMessage({
        type:'success',
        message:'程序员努力更新中'
    })
}
// 查看按钮
const handleLook = async(row) => {
    // 打开抽屉组件
    isOpen.value = true
    // 发请求 获取当前行sku数据 ，并展示出来
    const result = await getSkuInfo(row.id)
    if (result.code === 200 ) {
        skuInfo.value = result.data
        console.log(skuInfo.value)
        console.log(skuInfo.value.skuName );
        
    }
}
// 删除按钮
const handleDelete = async(row) => {
    const result = await deleteSku(row.id)
    if (result.code === 200){
            // 消息提示
            ElMessage({
                type:'success',
                message:'删除成功'
            })
             // 刷新页面
             getHasSku()
        }else {
            ElMessage.error('删除失败')
        }
}
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>