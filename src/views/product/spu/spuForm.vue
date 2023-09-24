<template>
   <el-form label-width="100px">
    <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
        <el-select placeholder="请选择品牌" v-model="SpuParams.tmId">
            <el-option v-for="item in allTrademarkName" :key="item.id" :label="item.tmName"  :value="item.id"></el-option>
            <el-option label="大米"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
        <el-input :rows="3" type="textarea" placeholder="请输入SPU描述" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
        <!-- v-model:file-list :展示默认图片 -->
        <!-- action : 上传图片的接口地址-->
        <!-- list-type： 文件列表的类型 -->
        <el-upload
            v-model:file-list="spuImg"
            action="/api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlelook"
            :on-remove="handleRemove"
            :before-upload="handleUplosd"
        >
            <el-icon><Plus /></el-icon>
        </el-upload>
        <!-- 照片墙 点击预览大图 -->
        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%; height:100%;" />
        </el-dialog>
    </el-form-item>
    <el-form-item  label="SPU销售属性">
        <el-select  v-model="saleIdAndName"  :placeholder="notHaveSale.length ? `还未选择${notHaveSale.length}个` : '无'" >
            <el-option  v-for="item in notHaveSale" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`"></el-option>
        </el-select>
        <el-button icon="Plus" type="primary" style="margin-left:10px;" :disabled="saleIdAndName? false : true" @click="addNewSaleAttr">添加属性</el-button>
        <el-table :data="hasSale" border style="margin:20px 0;" >
            <el-table-column  type="index" label="序号" width="80"></el-table-column>
            <el-table-column  label="属性名" prop="saleAttrName"  width="140"></el-table-column>
            <el-table-column label="属性值">
                <template #="{row,$index}">
                    <el-tag
                        v-for="tag in row.spuSaleAttrList"
                        @close="row.spuSaleAttrList.splice(index,1)"
                        :key="tag.id"
                        closable
                        :type="tag.type"
                        style="margin: 0 5px;"
                    >
                        {{ tag.saleAttrValueName }}
                    </el-tag>
                    <el-input v-if="row.flag===true" @blur="()=>toLook(row)" v-model="row.inputValue" placeholder="请输入属性值" style="width: 100px;"  size="small"></el-input>
                    <el-button v-else  @click="() => changeFlag(row)" icon="Plus" type="primary" size="small" ></el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="140">
                <template #="{row,$index}">
                    <el-button icon="Delete" type="primary" size="small" @click="handleDelete($index)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="handleBack" >取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
    </el-form-item>
   </el-form>
</template>

<script lang="ts" setup >
import { computed, ref } from 'vue'
import { allTrademark, spuImageList, spuHasSale, allSaleAttrList, addAndUpdateSpu } from '@/api/product/spu/index'
import { ElMessage } from 'element-plus';
// 存储：全部品牌的数据 name
const allTrademarkName = ref([])
// 存储：全部的销售属性(共三个：颜色，版本，尺码)
const allSaleAttr = ref([])
// 存储：某个spu下的全部售卖商品的图片数据
const spuImg = ref([])
// 存储：某个spu下的 已有的销售属性
const hasSale = ref([])
// 存储：某个spu下的 未选择的销售属性的ID 与属性值的name (id:name)类型
const saleIdAndName = ref('')
// 存储：计算某个spu下的 未选择的销售属性
const notHaveSale = computed(() => {
    // return allSaleAttr.value.filter(item => !hasSale.value.includes(item))
    return allSaleAttr.value.filter(item => !hasSale.value.map(i => parseInt(i.baseSaleAttrId)).includes(item.id))
})
// 控制 el-dialog 对话框（放大图片的展示）
const dialogVisible = ref(false)
// 放大图片的地址
const dialogImageUrl = ref('')
// 存储：spu对象 (接口参数)
const SpuParams = ref({
    // id: '', 新增不需要ID ，修改spu接口需要
    category3Id: '',      // 三级分类ID
    description: '',      // spu描述
    spuName: '',          // spu名称
    tmId:'',              // 品牌ID
    spuImageList: [ ],    // 照片墙
    spuSaleAttrList: [ ], // 销售属性
})

// 自定义事件 (点击取消时，通知父组件 切换回0场景)
const emit = defineEmits(['changeScene'])
// 取消按钮
const handleBack = () => {
    emit('changeScene', {flag:0, params: SpuParams.value?.id ? 'update' : 'add'})
}
// 父组件点击编辑时：调接口 发请求
const getSpuValue = async (row) => {
    // row 父组件传递过来的 点击的那行 spu 对象（数据中包含了 发送请求需要的ID/spu名称/spu描述）,转赋值存储在SpuParams中
    SpuParams.value = row 
    // 获取全部品牌的数据
    const result = await allTrademark()
    if (result.code === 200 ){
        allTrademarkName.value = result.data
    }
    // 获取某个spu下的全部售卖商品的图片数据
    const result1 = await spuImageList(row.tmId)
    if (result1.code === 200 ) {
        spuImg.value = result1.data.map(img => { // 转换为 upload 上传照片墙 的展示默认图片 需要的格式
            return { 
                name:img.imgName,
                url:img.imgUrl
            }
        })
    }
   
    // 获取某个spu下的 已有的销售属性
    const result2 = await spuHasSale(row.tmId)
    console.log(row.tmId);
    console.log(result2); 
    if (result2.code === 200 ) {
        hasSale.value = result2.data     
    }
    // 全部的销售属性(共三个：颜色，版本，尺码)
    const result3 = await allSaleAttrList()
    if (result3.code === 200 ) {
        allSaleAttr.value = result3.data
        console.log(result3);     
    }
}
// 照片墙 点击预览大图的钩子
const handlelook = (file) => {
    // file 参数是 upload :on-preview事件 自带的参数：为图片的数据对象 （包含图片 的name/URL/size..)
    dialogVisible.value = true
    dialogImageUrl.value = file.url
console.log(file)
}
// 照片墙删除文件的钩子
const handleRemove = () => {
    console.log('删除图片')
}
// 照片墙上传文件之前 约束文件的大小 与 类型
const handleUplosd = (File) => {
    if (File.size/1024/1024 < 4 ) {
        if (File.type === 'image/gif' || File.type === 'image/jpeg' || File.type === 'image/png') {
            return true
        } else {
            ElMessage.error('文件类型为GIF|JPG|PNG')
            return false
        } 
    }
    else {
        ElMessage.error('文件大小不超过4M')
        return false
    }
}
// 添加新的销售属性
const addNewSaleAttr = () => {
  const newsalevalue = saleIdAndName.value.split(":") // 将字符串id:name 变成数组[ id, name ]
  const [ id, name ] = newsalevalue // 结构出来
  // 准备一个新的销售属性对象：将来带给服务器
  const newSaleSttr = {
    baseSaleAttrId: id,
    saleAttrName: name,
    spuSaleAttrList: [ ],
  }
  // push到已有的销售属性数组中
  hasSale.value.push(newSaleSttr)
  // 清空下拉菜单中的数据
  saleIdAndName.value = ''
}
// 添加销售属性值时 input 与 button切换 
const changeFlag = (row) => {
    console.log(row)
    // 动态的给row 添加一个flag 属性， 点击某个属性的按钮时 将flag变为true,按钮切换为input (各个选项 不干扰)
    row.flag = true
    //  动态的给row 添加一个inputValue 属性。存储input中的值
    row.inputValue = ''
}
// input框 失去焦点时 
const toLook = (row) => {
    // 收集新的销售属性值
    const newSale = {
        baseSaleAttrId : row.baseSaleAttrId,
        saleAttrValueName : row.inputValue,
    }
    // 过滤掉空格 与 重复 的属性值
    if (row.inputValue.trim() !== '') {
        const isRecur = row.spuSaleAttrList.find( item => item.saleAttrValueName === row.inputValue ) 
        if(!isRecur) {
            // 追加新的属性值
            row.spuSaleAttrList.push(newSale)
            // 隐藏input ，切换为按钮
            row.flag = false
        } else{
            ElMessage.error('属性值不能重复')
        }
    } else {
        ElMessage.error('属性值不能为空')
    }
    console.log(row);
    
}
// 操作删除按钮 ：删除销售属性值
const handleDelete = ($index) => {
hasSale.value.splice($index,1)
}
// 保存按钮
const handleSave = async(  ) => {
    // 整理参数
    // 1.销售属性的数据
    SpuParams.value.spuSaleAttrList = hasSale.value
    // 2.照片墙的数据
    SpuParams.value.spuImageList = spuImg.value.map((item:any) => {
        return {
            imgName: item.name,
            imgUrl: item.url || item.response?.data
        }
    })
    // 调接口发请求：添加spu ｜｜ 更新spu （根据有无ID）
    const result = await addAndUpdateSpu(SpuParams.value)
    // 成功
    if (result.code === 200 ) {
        // 消息提示
        ElMessage({
            type:'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        // 通知父组件 切换回0场景 || 重新获取接口刷新页面
        emit('changeScene', {flag:0, params: SpuParams.value.id ? 'update' : 'add'})

    // 失败
    } else {
        ElMessage.error(SpuParams.value.id ? '更新失败' : '添加失败')
    }
}
// ===============================
// 父组件点击新增时：调接口 发请求
const initAddSpu = async(c3) => {
    // 清空数据 变成初始值 （合并对象 对象2覆盖对象1）
    Object.assign( SpuParams.value, {
        category3Id: '',      
        description: '',      
        spuName: '',          
        tmId:'',              
        spuImageList: [ ],    
        spuSaleAttrList: [ ], 
    })
    hasSale.value = []
    spuImg.value = []
    // 收集三级分类ID
    SpuParams.value.category3Id = c3
    // 获取全部品牌的数据
    const result = await allTrademark()
    if (result.code === 200 ){
        allTrademarkName.value = result.data
    }
     // 全部的销售属性(共三个：颜色，版本，尺码)
     const result3 = await allSaleAttrList()
    if (result3.code === 200 ) {
        allSaleAttr.value = result3.data
        console.log(result3);     
    }
}



// ---- 外部父组件通过ref 获取到子组件的实例 ，想要调用子组件身上的方法 。需要defineExpose()对外暴露方法 ----
defineExpose({getSpuValue, initAddSpu})
</script>

<style scoped lang="scss">

</style>


