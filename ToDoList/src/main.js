import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useTodoStore } from './stores/todo'
import { useAuthStore } from './stores/todo'
import piniaPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersistedState)
app.use(createPinia())
app.use(router)

const todoStore = useTodoStore()
const authStore = useAuthStore()

todoStore.loadTasks() // Chargement des tâches depuis le localStorage
authStore.loadUsers() // Chargement des utilisateurs depuis le localStorage

app.mount('#app')
