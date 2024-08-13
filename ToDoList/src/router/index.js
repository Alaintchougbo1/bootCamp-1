import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import signIn from '../views/signIn.vue'
import signUp from '../views/signUp.vue'
import { useAuthStore } from '../stores/todo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signin',
      component: signIn
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: signUp
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.currentUser

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Dans le cas où l'utilisateur n'est pas connecté
    next('/')
  } else if (isAuthenticated && to.path === '/') {
    // Redirection si l'utilisateur est connecté
    next('/home')
  } else {
    next()
  }
})

export default router
