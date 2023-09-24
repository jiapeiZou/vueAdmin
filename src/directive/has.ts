import pinia from '@/store'
import { useUserStore } from '@/store/modules/user' // 用户数据相关的仓库

// 全局自定义指令 （解决：用户的按钮权限） v-hasBtn = " "
export const isHasBtn = (app:any) =>  {
   app.directive('hasBtn', {
        // 当被绑定的元素挂载到 DOM 中时执行 （使用这个全局自定义指令的Dom组件挂载完毕的时候会执行）
        mounted(el, options) {
        const userStore = useUserStore(pinia)
        // el: 使用这个全局自定义指令的Dom组件
        // options: opyions.value可以拿到自定义指令 等号右侧的值
        // 判断用户的按钮权限数组中 是否包含 当前使用自定义指令的值
        if(!userStore.userBtn.includes(options.value)){
            // 不包含：从DOM树上移除
            el.parentNode.removeChild(el)
        }
       }
   })
}