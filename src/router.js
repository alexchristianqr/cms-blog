import Vue              from 'vue'
import Router           from 'vue-router'
import Home             from './components/pages/home/Home'
import Posts            from './components/pages/post/Posts'
import PostCreateUpdate from './components/pages/post/PostCreateUpdate'
import Users            from './components/pages/user/Users'
import UserCreateUpdate from './components/pages/user/UserCreateUpdate'
import Categories       from './components/pages/category/Categories'
import Portfolios       from './components/pages/portfolio/Portfolios'
import PortfolioCreateUpdate from './components/pages/portfolio/PortfolioCreateUpdate'
import Login            from './components/pages/login/Login'
import Storage          from 'vue-local-storage'
import Axios            from 'axios'
import AuthService      from './services/AuthService'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        {path: '*', redirect: 'login'},
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: {auth: true, title: 'Home'},
        },
        {
            path: '/post', name: 'posts', component: Posts,
            children: [
                {
                    path: '/post/create',
                    name: 'post-create',
                    component: PostCreateUpdate,
                },
                {
                    path: '/post/update',
                    name: 'post-update',
                    component: PostCreateUpdate,
                },
            ],
            meta: {auth: true, title: 'Posts'},
        },
        {
            path: '/user', name: 'users', component: Users,
            children: [
                {
                    path: '/user/create',
                    name: 'user-create',
                    component: UserCreateUpdate,
                },
                {
                    path: '/user/update',
                    name: 'user-update',
                    component: UserCreateUpdate,
                },
            ],
            meta: {auth: true, title: 'Users'},
        },
        {
            path: '/category',
            name: 'categories',
            component: Categories,
            meta: {auth: true, title: 'Categories'},
        },
        {
            path: '/portfolio', name: 'portfolios', component: Portfolios,
            children: [
                {
                    path: '/portfolio/create',
                    name: 'portfolio-create',
                    component: PortfolioCreateUpdate,
                },
                {
                    path: '/portfolio/update',
                    name: 'portfolio-update',
                    component: PortfolioCreateUpdate,
                },
            ],
            meta: {auth: true, title: 'Portfolios'},
        },
    ],
    methods: {
        verifyRoutesWithStorage(to){
            if(to.name !== 'portfolio-update'){
                Storage.remove('data-portfolio-temp')
            }
            if(to.name !== 'post-update'){
                Storage.remove('data-post-temp')
            }
        },
        validateToken(){
            return Storage.get('data-token') === null || Storage.get('data-token') === undefined
        },
        addHeaderAuthorization(){
            Axios.defaults.headers.common['Authorization'] = 'Bearer ' + Storage.get('data-token')
        },
        verifyTokenAuth(next){
            if(this.validateToken()){//true
                return this.validateToken()//true
            }else{//false
                next()
            }
        },
        verifyTokenNotAuth(from, next){
            if(this.validateToken()){//true
                return this.validateToken()//true
            }else{//false
                next({name: 'home'})
            }
        },
        validateSession(){
            AuthService.dispatch('validateSession',{self:router})
        }
    },
})

router.beforeEach((to, from, next) =>{
    document.title = '@AlexChristian MP : Home'
    router.options.methods.verifyRoutesWithStorage(to)
    router.options.methods.addHeaderAuthorization()
    const requireAuth = to.matched.some(record => record.meta.auth)

    if(requireAuth){//authorized

        if(to.name == 'login' && AuthService.state.isLoggedIn){
            next({name: 'login'})
        }else{
            if(router.options.methods.verifyTokenAuth(next)){//true
                next({name: 'login'})//Si paso algo con el token volvemos a login
            }else{//false
                if(router.options.methods.validateSession()){//Validamos si el token ha vencido
                    next()//Sino continuamos con la navegacion
                }
            }
        }

    }else{//not authorized

        if(router.options.methods.verifyTokenNotAuth(from, next)){//true
            next()//Si quieren ir a "login", ejecutara verifyTokenAuth()
        }else{//false
            next({name: 'home'})//Sino redireccionamos a "home", ejecutara verifyTokenAuth()
        }

    }
})

export default router