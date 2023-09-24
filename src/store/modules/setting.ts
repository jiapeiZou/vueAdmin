import { ref } from "vue";
import { defineStore } from 'pinia'

// 小仓库：layout组件相关配置
export const  layOutSettingStore = defineStore('settingStore', () => {
    // 菜单 隐藏or展示
    const iscollapse = ref(false)
    // 点击刷新效果
    const refresh = ref(false)

    return { iscollapse, refresh }
})