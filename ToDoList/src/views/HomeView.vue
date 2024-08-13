<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'

const store = useTodoStore()
const newTask = ref({
  title: '',
  description: '',
  startDate: '',
  dueDate: '',
  priority: 'low'
})
const editIndex = ref(null)
const editTask = ref({ ...newTask.value })

const tasks = computed(() => store.tasks)

function addTask() {
  try {
    store.addTask({ ...newTask.value, done: false })
    newTask.value = {
      title: '',
      description: '',
      startDate: '',
      dueDate: '',
      priority: 'low'
    }
  } catch (error) {
    alert(error.message)
  }
}

function removeTask(index) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    store.removeTask(index)
  }
}

function startEditTask(index) {
  editIndex.value = index
  editTask.value = { ...store.tasks[index] }
}

function saveEditTask() {
  try {
    store.updateTask(editIndex.value, { ...editTask.value })
    editIndex.value = null
    editTask.value = {}
  } catch (error) {
    alert(error.message)
  }
}

function cancelEdit() {
  editIndex.value = null
  editTask.value = {}
}
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-semibold text-center mb-6">Todo List</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 max-h-[500px] rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">Ajouter une tâche</h2>
        <div class="space-y-4">
          <input
            v-model="newTask.title"
            placeholder="Titre de la tâche"
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <textarea
            v-model="newTask.description"
            placeholder="Description de la tâche"
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            v-model="newTask.startDate"
            type="date"
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            v-model="newTask.dueDate"
            type="date"
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            v-model="newTask.priority"
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
          <button
            @click="addTask"
            class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter
          </button>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">Liste des tâches</h2>
        <ul class="space-y-4">
          <li
            v-for="(task, index) in tasks"
            :key="index"
            class="p-4 border border-gray-200 rounded-md"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <input type="checkbox" v-model="task.done" class="form-checkbox" />
                <span :class="{ 'line-through': task.done }" class="ml-2 font-bold">{{
                  task.title
                }}</span>
              </div>
              <div class="flex space-x-2">
                <button
                  v-if="editIndex !== index"
                  @click="startEditTask(index)"
                  class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Éditer
                </button>
                <button
                  v-if="editIndex === index"
                  @click="saveEditTask"
                  class="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Enregistrer
                </button>
                <button
                  v-if="editIndex === index"
                  @click="cancelEdit"
                  class="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  v-if="editIndex !== index"
                  @click="removeTask(index)"
                  class="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              <p><strong>Description:</strong> {{ task.description }}</p>
              <p><strong>Date de début:</strong> {{ task.startDate }}</p>
              <p><strong>Date d'échéance:</strong> {{ task.dueDate }}</p>
              <p><strong>Priorité:</strong> {{ task.priority }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="editIndex !== null"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Modifier la tâche</h2>
        <input
          v-model="editTask.title"
          placeholder="Titre de la tâche"
          class="w-full p-3 border border-gray-300 rounded-md mb-2"
        />
        <textarea
          v-model="editTask.description"
          placeholder="Description de la tâche"
          class="w-full p-3 border border-gray-300 rounded-md mb-2"
        />
        <input
          v-model="editTask.startDate"
          type="date"
          class="w-full p-3 border border-gray-300 rounded-md mb-2"
        />
        <input
          v-model="editTask.dueDate"
          type="date"
          class="w-full p-3 border border-gray-300 rounded-md mb-2"
        />
        <select
          v-model="editTask.priority"
          class="w-full p-3 border border-gray-300 rounded-md mb-4"
        >
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élevée</option>
        </select>
        <div class="flex justify-end space-x-2">
          <button
            @click="saveEditTask"
            class="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Enregistrer
          </button>
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
