import Vue              from 'vue'
import Router           from 'vue-router'
import Home             from './components/pages/home/Home'
import Posts            from './components/pages/post/Posts'
import PostCreateUpdate from './components/pages/post/PostCreateUpdate'
import Users            from './components/pages/user/Users'
import UserCreateUpdate from './components/pages/user/UserCreateUpdate'
import Categories       from './components/pages/category/Categories'

Vue.use(Router)

export default new Router({
	mode: 'history',
	linkActiveClass: 'active',
	// linkExactActiveClass: 'exact-active',
	routes: [
		{path: '/', redirect: 'home'},
		{path: '/home', name: 'home', component: Home},
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
		},
		{
			path: '/category', name: 'categories', component: Categories,
		},
	],
})
