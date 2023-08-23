// 引入项目中的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'

// 对外暴露插件对象  注册为全局插件 （自定义全局插件
// export const allGloablComponent = {
//     install(app){
//     //    Object.keys(allGloablComponent).forEach(key =>{
//         app.component("SvgIcon", SvgIcon)
//         app.component(Pagination, "Pagination")
//     }
// }

// 全局对象
const allGloablComponent = { SvgIcon, Pagination }
// console.log(allGloablComponent)
// 对外暴露插件对象 
export  default {
    install(app){
        Object.keys(allGloablComponent).forEach( key => {
            app.component(key , allGloablComponent[key])
         })
    }
}