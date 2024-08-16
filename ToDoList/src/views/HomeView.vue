<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/todo'
import { useAuthStore } from '@/stores/todo'

const router = useRouter()
const store = useTodoStore()
const authStore = useAuthStore()

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

async function addTask() {
  try {
    await store.addTask({ ...newTask.value, done: false })
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

async function removeTask(index) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    try {
      await store.removeTask(index)
    } catch (error) {
      alert(error.message)
    }
  }
}

function startEditTask(index) {
  if (!tasks.value[index].done) {
    editIndex.value = index
    editTask.value = { ...store.tasks[index] }
  }
}

async function saveEditTask() {
  try {
    await store.updateTask(editIndex.value, { ...editTask.value })
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

function logout() {
  authStore.logoutUser()
  router.push('/')
}

watch(tasks, (newTasks) => {
  console.log('Tâches mises à jour:', newTasks)
})
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-semibold text-center mb-6">Todo List</h1>
    <button
      @click="logout"
      class="mb-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Déconnexion
    </button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-4">Ajouter une tâche</h2>
        <div class="space-y-4">
          <div>
            <label for="new-title" class="block text-gray-700 font-medium">Titre</label>
            <input
              id="new-title"
              v-model="newTask.title"
              placeholder="Titre de la tâche"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label for="new-description" class="block text-gray-700 font-medium">Description</label>
            <textarea
              id="new-description"
              v-model="newTask.description"
              placeholder="Description de la tâche"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
            />
          </div>
          <div>
            <label for="new-start-date" class="block text-gray-700 font-medium"
              >Date de début</label
            >
            <input
              id="new-start-date"
              v-model="newTask.startDate"
              type="date"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label for="new-due-date" class="block text-gray-700 font-medium"
              >Date d'échéance</label
            >
            <input
              id="new-due-date"
              v-model="newTask.dueDate"
              type="date"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label for="new-priority" class="block text-gray-700 font-medium">Priorité</label>
            <select
              id="new-priority"
              v-model="newTask.priority"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>
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
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  v-model="task.done"
                  :disabled="task.done"
                  class="form-checkbox"
                />
                <span :class="{ 'line-through': task.done }" class="ml-2 font-bold">
                  {{ task.title }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2 mt-2 md:mt-0">
                <button
                  v-if="editIndex !== index && !task.done"
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
              <p>
                <strong>Description:</strong> <span class="truncate">{{ task.description }}</span>
              </p>
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
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 class="text-xl font-semibold mb-4">Modifier la tâche</h2>
        <div>
          <label for="edit-title" class="block text-gray-700 font-medium">Titre</label>
          <input
            id="edit-title"
            v-model="editTask.title"
            placeholder="Titre de la tâche"
            class="w-full p-3 border border-gray-300 rounded-md mb-2"
          />
        </div>
        <div>
          <label for="edit-description" class="block text-gray-700 font-medium">Description</label>
          <textarea
            id="edit-description"
            v-model="editTask.description"
            placeholder="Description de la tâche"
            class="w-full p-3 border border-gray-300 rounded-md mb-2"
            rows="4"
          />
        </div>
        <div>
          <label for="edit-start-date" class="block text-gray-700 font-medium">Date de début</label>
          <input
            id="edit-start-date"
            v-model="editTask.startDate"
            type="date"
            class="w-full p-3 border border-gray-300 rounded-md mb-2"
          />
        </div>
        <div>
          <label for="edit-due-date" class="block text-gray-700 font-medium">Date d'échéance</label>
          <input
            id="edit-due-date"
            v-model="editTask.dueDate"
            type="date"
            class="w-full p-3 border border-gray-300 rounded-md mb-2"
          />
        </div>
        <div>
          <label for="edit-priority" class="block text-gray-700 font-medium">Priorité</label>
          <select
            id="edit-priority"
            v-model="editTask.priority"
            class="w-full p-3 border border-gray-300 rounded-md mb-4"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
        </div>
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

.truncate {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .flex-row {
    flex-direction: column;
  }
}
</style>
