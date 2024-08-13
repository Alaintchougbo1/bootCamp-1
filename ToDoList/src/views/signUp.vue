<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-semibold mb-6 text-center">Inscription</h1>
      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label for="registerEmail" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="registerEmail"
            v-model="registerEmail"
            type="email"
            placeholder="Entrez votre email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="registerPassword" class="block text-sm font-medium text-gray-700"
            >Mot de passe</label
          >
          <input
            id="registerPassword"
            v-model="registerPassword"
            type="password"
            placeholder="Entrez votre mot de passe"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          S'inscrire
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Déjà inscrit ?
        <router-link to="/" class="text-blue-500 hover:text-blue-600">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/todo'
import { useRouter } from 'vue-router'

const registerEmail = ref('')
const registerPassword = ref('')
const router = useRouter()
const store = useAuthStore()

function register() {
  if (registerEmail.value && registerPassword.value) {
    store.registerUser({ email: registerEmail.value, password: registerPassword.value })
    registerEmail.value = ''
    registerPassword.value = ''
    router.push('/')
  }
}
</script>

<style scoped></style>
