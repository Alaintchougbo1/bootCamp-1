

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'

const store = useTodoStore()
const newTask = ref('')
const editIndex = ref(null)
const editText = ref('')

const tasks = computed(() => store.tasks)

function addTask() {
  if (newTask.value.trim()) {
    store.addTask({ text: newTask.value, done: false })
    newTask.value = ''
  }
}

function removeTask(index) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    store.removeTask(index)
  }
}

function startEditTask(index) {
  editIndex.value = index
  editText.value = store.tasks[index].text
}

function saveEditTask() {
  if (editText.value.trim()) {
    store.updateTask(editIndex.value, {
      text: editText.value,
      done: store.tasks[editIndex.value].done
    })
    editIndex.value = null
    editText.value = ''
  }
}

function cancelEdit() {
  editIndex.value = null
  editText.value = ''
}
</script>

<template>
  <div class="p-6 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg">
    <h1 class="text-3xl font-semibold text-center mb-4">Todo List</h1>
    <div class="flex gap-4 mb-4">
      <input 
        v-model="newTask" 
        placeholder="Ajouter une tâche" 
        class="flex-grow p-3 border border-gray-300 rounded-md"
      />
      <button 
        @click="addTask" 
        class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Ajouter
      </button>
    </div>
    <ul class="space-y-2">
      <li 
        v-for="(task, index) in tasks" 
        :key="index" 
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
      >
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            v-model="task.done" 
            class="form-checkbox"
          />
          <span :class="{ 'line-through': task.done }" class="ml-2">{{ task.text }}</span>
        </div>
        <div class="flex space-x-2">
          <button 
            v-if="editIndex !== index" 
            @click="startEditTask(index)" 
            class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Éditer
          </button>
          <button 
            v-if="editIndex === index" 
            @click="saveEditTask" 
            class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Enregistrer
          </button>
          <button 
            v-if="editIndex === index" 
            @click="cancelEdit" 
            class="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button 
            v-if="editIndex !== index" 
            @click="removeTask(index)" 
            class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
    <!-- Modal for editing tasks -->
    <div v-if="editIndex !== null" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Modifier la tâche</h2>
        <input 
          v-model="editText" 
          placeholder="Modifier la tâche" 
          class="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <div class="flex justify-end space-x-2">
          <button 
            @click="saveEditTask" 
            class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Enregistrer
          </button>
          <button 
            @click="cancelEdit" 
            class="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
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