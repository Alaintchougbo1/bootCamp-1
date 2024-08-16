import { defineStore } from 'pinia'
import { reactive } from 'vue'
import bcrypt from 'bcryptjs'

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
      if (!title.trim() || !description.trim() || !startDate.trim() || !dueDate.trim()) {
        throw new Error('Tous les champs doivent être remplis')
      }

      if (new Date(startDate) > new Date(dueDate)) {
        throw new Error('La date de début ne peut pas être après la date d’échéance')
      }

      const newTask = {
        title: title.trim(),
        description: description.trim(),
        startDate: startDate.trim(),
        dueDate: dueDate.trim(),
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

      const { title, description, startDate, dueDate } = updatedTask

      if (title && !title.trim()) {
        throw new Error('Le titre ne peut pas être vide ou constitué uniquement d’espaces')
      }
      if (description && !description.trim()) {
        throw new Error('La description ne peut pas être vide ou constituée uniquement d’espaces')
      }
      if (startDate && !startDate.trim()) {
        throw new Error('La date de début ne peut pas être vide ou constituée uniquement d’espaces')
      }
      if (dueDate && !dueDate.trim()) {
        throw new Error(
          'La date d’échéance ne peut pas être vide ou constituée uniquement d’espaces'
        )
      }

      if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
        throw new Error('La date de début ne peut pas être après la date d’échéance')
      }

      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        title: title ? title.trim() : this.tasks[taskIndex].title,
        description: description ? description.trim() : this.tasks[taskIndex].description,
        startDate: startDate ? startDate.trim() : this.tasks[taskIndex].startDate,
        dueDate: dueDate ? dueDate.trim() : this.tasks[taskIndex].dueDate,
        priority:
          updatedTask.priority !== undefined
            ? updatedTask.priority
            : this.tasks[taskIndex].priority,
        done: updatedTask.done !== undefined ? updatedTask.done : this.tasks[taskIndex].done
      }

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

    async registerUser({ email, password }) {
      const existingUser = this.users.find((u) => u.email === email)
      if (existingUser) {
        throw new Error("L'email est déjà utilisé")
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = { email, password: hashedPassword }
      this.users.push(newUser)
      this.saveUsers()
    },

    async loginUser({ email, password }) {
      const user = this.users.find((u) => u.email === email)
      if (user) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
          this.currentUser = user
          this.saveUsers()
          return true
        }
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

// import { defineStore } from 'pinia'
// import { reactive } from 'vue'
// import bcrypt from 'bcryptjs'

// export const useTodoStore = defineStore({
//   id: 'todo',
//   state: () => ({
//     tasks: reactive([])
//   }),
//   actions: {
//     loadTasks() {
//       const savedTasks = localStorage.getItem('tasks')
//       if (savedTasks) {
//         this.tasks = JSON.parse(savedTasks)
//       }
//     },

//     saveTasks() {
//       localStorage.setItem('tasks', JSON.stringify(this.tasks))
//     },

//     addTask({ title, description, startDate, dueDate, priority }) {
//       if (new Date(startDate) > new Date(dueDate)) {
//         throw new Error('La date de début ne peut pas être après la date d’échéance')
//       }

//       const newTask = {
//         title,
//         description,
//         startDate,
//         dueDate,
//         priority,
//         done: false
//       }

//       this.tasks.push(newTask)
//       this.saveTasks()
//     },

//     removeTask(taskIndex) {
//       if (taskIndex < 0 || taskIndex >= this.tasks.length) {
//         throw new Error('Index de tâche invalide')
//       }
//       this.tasks.splice(taskIndex, 1)
//       this.saveTasks()
//     },

//     updateTask(taskIndex, updatedTask) {
//       if (taskIndex < 0 || taskIndex >= this.tasks.length) {
//         throw new Error('Index de tâche invalide')
//       }

//       if (new Date(updatedTask.startDate) > new Date(updatedTask.dueDate)) {
//         throw new Error('La date de début ne peut pas être après la date d’échéance')
//       }

//       this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask }
//       this.saveTasks()
//     },

//     toggleTaskStatus(taskIndex) {
//       if (taskIndex < 0 || taskIndex >= this.tasks.length) {
//         throw new Error('Index de tâche invalide')
//       }
//       this.tasks[taskIndex].done = !this.tasks[taskIndex].done
//       this.saveTasks()
//     }
//   },

//   persist: true
// })

// export const useAuthStore = defineStore({
//   id: 'auth',
//   state: () => ({
//     users: [],
//     currentUser: null
//   }),
//   actions: {
//     loadUsers() {
//       const savedUsers = localStorage.getItem('users')
//       if (savedUsers) {
//         this.users = JSON.parse(savedUsers)
//       }

//       const savedCurrentUser = localStorage.getItem('currentUser')
//       if (savedCurrentUser) {
//         this.currentUser = JSON.parse(savedCurrentUser)
//       }
//     },

//     saveUsers() {
//       localStorage.setItem('users', JSON.stringify(this.users))
//       if (this.currentUser) {
//         localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
//       } else {
//         localStorage.removeItem('currentUser')
//       }
//     },

//     async registerUser({ email, password }) {
//       const hashedPassword = await bcrypt.hash(password, 10)
//       const newUser = { email, password: hashedPassword }
//       this.users.push(newUser)
//       this.saveUsers()
//     },

//     async loginUser({ email, password }) {
//       const user = this.users.find((u) => u.email === email)
//       if (user) {
//         const match = await bcrypt.compare(password, user.password)
//         if (match) {
//           this.currentUser = user
//           this.saveUsers()
//           return true
//         }
//       }
//       return false
//     },

//     logoutUser() {
//       this.currentUser = null
//       this.saveUsers()
//     }
//   },

//   persist: true
// })
