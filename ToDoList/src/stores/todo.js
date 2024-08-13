import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useTodoStore = defineStore({
  id: 'todo',
  state: () => ({
    tasks: reactive([])
  }),
  actions: {
    loadTasks() {
      const savedTasks = localStorage.getItem('tasks')
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks)
      }
    },

    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    addTask({ title, description, startDate, dueDate, priority }) {
      if (new Date(startDate) > new Date(dueDate)) {
        throw new Error('La date de début ne peut pas être après la date d’échéance')
      }

      const newTask = {
        title,
        description,
        startDate,
        dueDate,
        priority,
        done: false
      }

      this.tasks.push(newTask)
      this.saveTasks()
    },

    removeTask(taskIndex) {
      if (taskIndex < 0 || taskIndex >= this.tasks.length) {
        throw new Error('Index de tâche invalide')
      }
      this.tasks.splice(taskIndex, 1)
      this.saveTasks()
    },

    updateTask(taskIndex, updatedTask) {
      if (taskIndex < 0 || taskIndex >= this.tasks.length) {
        throw new Error('Index de tâche invalide')
      }

      if (new Date(updatedTask.startDate) > new Date(updatedTask.dueDate)) {
        throw new Error('La date de début ne peut pas être après la date d’échéance')
      }

      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask }
      this.saveTasks()
    },

    toggleTaskStatus(taskIndex) {
      if (taskIndex < 0 || taskIndex >= this.tasks.length) {
        throw new Error('Index de tâche invalide')
      }
      this.tasks[taskIndex].done = !this.tasks[taskIndex].done
      this.saveTasks()
    }
  },

  persist: true
})

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    users: [],
    currentUser: null
  }),
  actions: {
    loadUsers() {
      const savedUsers = localStorage.getItem('users')
      if (savedUsers) {
        this.users = JSON.parse(savedUsers)
      }

      const savedCurrentUser = localStorage.getItem('currentUser')
      if (savedCurrentUser) {
        this.currentUser = JSON.parse(savedCurrentUser)
      }
    },

    saveUsers() {
      localStorage.setItem('users', JSON.stringify(this.users))
      if (this.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      } else {
        localStorage.removeItem('currentUser')
      }
    },

    registerUser(user) {
      this.users.push(user)
      this.saveUsers()
    },

    loginUser({ email, password }) {
      const user = this.users.find((u) => u.email === email && u.password === password)
      if (user) {
        this.currentUser = user
        this.saveUsers()
        return true
      }
      return false
    },

    logoutUser() {
      this.currentUser = null
      this.saveUsers()
    }
  },

  persist: true
})