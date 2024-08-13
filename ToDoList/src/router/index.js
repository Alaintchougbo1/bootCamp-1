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
      component: HomeView
      // meta: { requiresAuth: true }
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

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // La route nécessite une authentification
    if (!isAuthenticated) {
      next('/')
    } else {
      next('/home')
    }
  } else {
    next()
  }
})

export default router
