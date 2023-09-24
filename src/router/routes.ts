// 对外暴露配置路由 总共7个一级路由

// (常量路由)：大家都能访问到的页面 无需权限
export const constantRoute =  [
    {  // 一级：登陆
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name:'login',
        meta:{
            title:'登陆', // 菜单标题
            hidden: true, // 代表路由标题在菜单中是否隐藏 true:隐藏 false:不隐藏
        }
    },
    {  //  一级：layout 登陆成功后的页面
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',
        meta:{
            title:'',
            hidden: true,
        },
        redirect:'/home', // 路由重定向
        children: [ // 二级路由 :首页
            {
                path: '/home',// 默认显示当前
                component: () => import('@/views/home/index.vue'),
                meta:{
                    title:'首页' ,
                    hidden: false,
                    icon: 'Promotion'// 菜单文字左侧图标。支持elment-plas全部图标
                }
            },
        ]
    },
    { //  一级：数据大屏
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name:'Screen',
        meta:{
            title:'数据大屏',
            hidden: false,
            icon: 'Monitor'
        }
    },
    {  //  一级：404
        path:'/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta:{
            title:'404' ,
            hidden: true,
        }
    }
]
// (异步路由)：需要相关权限
export const asyncRoute = [
    {  // 一级：权限管理
        path: '/acl',
        component: () =>import('@/layout/index.vue'),
        name: 'Acl',
        redirect:'/acl/user',
        meta: {
            title:'权限管理',
            hidden: false,
            icon: 'Lock'
        },
        children: [
            {  //  二级路由: 用户管理
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'User'
                }
            },
            { //  二级路由: 角色管理
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'UserFilled'
                }
            },
            {   //  二级路由: 菜单管理
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'HomeFilled'
                }
            }
        ]
    },
    { // 一级：商品管理 
        path:'/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',
        redirect:'/product/trademark',
        meta:{
            title:'商品管理' ,
            hidden: false,
            icon: 'goods'
        },
        children: [
            { //  二级路由: 品牌管理
                path:'/product/trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta:{
                    title:'品牌管理' ,
                    hidden: false,
                    icon: 'ShoppingCartFull'
                }
            },
            { //  二级路由: 属性管理
                path:'/product/attr',
                component: () => import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta:{
                    title:'属性管理' ,
                    hidden: false,
                    icon: 'ChromeFilled'
                }
            }, 
            { //  二级路由: spu管理
                path:'/product/spu',
                component: () => import('@/views/product/spu/index.vue'),
                name: 'Spu',
                meta:{
                    title:'spu管理' ,
                    hidden: false,
                    icon: 'Calendar'
                }
            }, 
            { //  二级路由: sku管理
                path:'/product/sku',
                component: () => import('@/views/product/sku/index.vue'),
                name: 'Sku',
                meta:{
                    title:'sku管理' ,
                    hidden: false,
                    icon: 'Orange'
                }
            }
        ]
    }
]
// (任意路由)：访问的路径错误时展示的页面
export const anyRoute = [{  
    //  一级：路由重定向（当所有都请求不成功时，展示此页面
    path:'/:pathMatch(.*)*',
    redirect:'/404',
    name:'Any',
    meta:{
        title:'任意路由' ,
        hidden: true,
    }
}]

// 实现「菜单权限」
//---- 第一步：需要拆分路由为：1.静态（常量）路由 2.异步（动态）路由 3.任意路由
//---- 第二步：登陆后获取到用户信息  拿到该用户的权限，与异步路由数组，进行筛选。
//---- 第三步：筛选出的数据+任意路由 组合的数组， 对路由route进行追加
// [...userAsyncRoutes, ...anyRoute].forEach(item => { router.addRoute(item) })
// 