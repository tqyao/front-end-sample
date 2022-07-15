import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from "../components/Welcome";
import User from "@/components/user/User";
import Right from "@/components/right/Right";
import Role from "@/components/right/Role";
import Cate from "@/components/goods/Cate";
import Params from "@/components/goods/Params";
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: User
            },
            {
                path: '/rights',
                component: Right
            },
            {
                path: '/roles',
                component: Role
            },
            {
                path: '/categories',
                component: Cate
            },
            {
                path: '/params',
                component: Params
            }

        ]

    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 添加全局路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token')
    // token 为空，强制跳转到登录页
    if (!tokenStr) return next('/login')
    next()
})

export default router
