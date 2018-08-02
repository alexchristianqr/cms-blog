import Vue              from 'vue'
import Router           from 'vue-router'
import Home             from './components/pages/home/Home'
import Posts            from './components/pages/post/Posts'
import PostCreateUpdate from './components/pages/post/PostCreateUpdate'
import Users            from './components/pages/user/Users'
import UserCreateUpdate from './components/pages/user/UserCreateUpdate'
import Categories       from './components/pages/category/Categories'
import Login            from './components/login/Login'
import StoreToken from './token'
import Storage    from 'vue-local-storage'
import Axios      from 'axios'

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
    ],
})

const validateToken = ()=>{
    return Storage.get('data-token') === null || Storage.get('data-token') === undefined
}
const addHeaderAuthorization = () =>{
    Axios.defaults.headers.common['Authorization'] = 'Bearer ' + Storage.get('data-token')
}
const verifyTokenAuth = (next) =>{
    if(validateToken()){//true
        return validateToken()//true
    }else{//false
        next()
    }
}
const verifyTokenNotAuth = (from,next)=>{
    if(validateToken()){//true
        return validateToken()//true
    }else{//false
        next({name:'home'})
    }
}

router.beforeEach((to, from, next) =>{
    addHeaderAuthorization()
    const requireAuth = to.matched.some(record => record.meta.auth)
    if(requireAuth){//authorized
        if(to.name == 'login' && StoreToken.state.isLoggedIn){
            next({name: 'login'})
        }else{
            if(verifyTokenAuth(next)){//true
                next({name:'login'})//Si paso algo con el token volvemos a login
            }else{//false
                next()//Sino continuamos con la navegacion
            }
        }
    }else{//not authorized
        if(verifyTokenNotAuth(from,next)){//true
            next()//Si quieren ir a "login", ejecutara verifyTokenAuth()
        }else{//false
            next({name:'home'})//Sino redireccionamos a "home", ejecutara verifyTokenAuth()
        }
    }
})

export default router