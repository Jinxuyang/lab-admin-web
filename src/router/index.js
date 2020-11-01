import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/Login'
import Home from '@/components/Home'
// import DashBoard from '@/views/dashborad/DashBoard'
import Member from '@/views/member/Member'
import Project from '@/views/project/Project'
import Direction from '@/views/direction/Direction'
import HomeNews from '@/views/homenews/HomeNews'
import Introduction from '@/views/introduction/Introduction'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/home',
    name: 'Home',
    redirect: '/member',
    component: Home,
    children: [
      // { path: '/dashboard', name: 'DashBoard', component: DashBoard },
      { path: '/member', name: 'Member', component: Member },
      { path: '/project', name: 'Project', component: Project },
      { path: '/direction', name: 'Direction', component: Direction },
      { path: '/homenews', name: 'HomeNews', component: HomeNews },
      { path: '/introduction', name: 'Introduction', component: Introduction }
    ]
  }
]

const router = new VueRouter({
  model: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
