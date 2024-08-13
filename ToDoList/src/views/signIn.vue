<template>
  <div>
    <h1>Authentification</h1>

    <div v-if="!currentUser">
      <h2>Connexion</h2>
      <input v-model="loginEmail" placeholder="Email" />
      <input v-model="loginPassword" type="password" placeholder="Mot de passe" />
      <button @click="login">Se connecter</button>
      <h2>Inscription</h2>
      <input v-model="registerEmail" placeholder="Email" />
      <input v-model="registerPassword" type="password" placeholder="Mot de passe" />

      <button @click="register">S'inscrire</button>
    </div>

    <div v-else>
      <p>Bienvenue, {{ currentUser.email }}!</p>
      <button @click="logout">Se déconnecter</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/todo'
// import router from '@/router';
import { useRouter } from 'vue-router'

const store = useAuthStore()
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const router = useRouter()

const currentUser = computed(() => store.currentUser)

function register() {
  if (registerEmail.value && registerPassword.value) {
    store.registerUser({ email: registerEmail.value, password: registerPassword.value })
    registerEmail.value = ''
    registerPassword.value = ''
  }
}

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

function logout() {
  store.logoutUser()
}
</script>

<style scoped></style>
