<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-semibold mb-6 text-center">Connexion</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="loginEmail" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="loginEmail"
            v-model="loginEmail"
            type="email"
            placeholder="Entrez votre email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="loginPassword" class="block text-sm font-medium text-gray-700"
            >Mot de passe</label
          >
          <input
            id="loginPassword"
            v-model="loginPassword"
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
          Se connecter
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Pas encore inscrit ?
        <router-link to="/signup" class="text-blue-500 hover:text-blue-600">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/todo'
import { useRouter } from 'vue-router'

const loginEmail = ref('')
const loginPassword = ref('')
const router = useRouter()
const store = useAuthStore()

function login() {
  if (loginEmail.value && loginPassword.value) {
    const success = store.loginUser({ email: loginEmail.value, password: loginPassword.value })
    if (success) {
      loginEmail.value = ''
      loginPassword.value = ''
      router.push('/home')
    } else {
      alert('Identifiants incorrects')
    }
  }
}
</script>

<style scoped></style>
