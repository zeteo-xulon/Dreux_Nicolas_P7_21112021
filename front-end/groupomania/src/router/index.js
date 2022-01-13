import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunckName: "profle"*/ "../views/Profile.vue")
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import(/* webpackChunckName: "forum"*/ "../views/Forum.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
