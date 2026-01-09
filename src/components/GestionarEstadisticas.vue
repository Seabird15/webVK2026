<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestionar Estadísticas 2026</h2>

    <!-- Selector de equipo -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <label class="block text-sm font-bold text-gray-700 mb-2">Seleccionar Equipo</label>
      <select
        v-model="equipoSeleccionado"
        @change="cargarJugadoras"
        class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="ascenso">Ascenso</option>
        <option value="escuela">Escuela</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-500">Cargando jugadoras...</p>
    </div>

    <!-- Tabla de edición -->
    <div v-else class="overflow-x-auto">
      <table class="w-full bg-white rounded-lg overflow-hidden shadow">
        <thead>
          <tr class="bg-primary text-white">
            <th class="px-6 py-3 text-left font-bold">Nombre</th>
            <th class="px-6 py-3 text-center font-bold">Goles</th>
            <th class="px-6 py-3 text-center font-bold">Asistencias</th>
            <th class="px-6 py-3 text-center font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="jugadora in jugadoras" :key="jugadora.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-3">
              <div class="font-semibold text-gray-900">{{ jugadora.nombre }} {{ jugadora.apellido }}</div>
              <div class="text-sm text-gray-500">{{ jugadora.posicion }}</div>
            </td>
            <td class="px-6 py-3">
              <div v-if="!editando || editando.id !== jugadora.id" class="text-center text-lg font-bold text-primary">
                {{ jugadora.goles || 0 }}
              </div>
              <input
                v-else
                v-model.number="editando.goles"
                type="number"
                min="0"
                class="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary"
              />
            </td>
            <td class="px-6 py-3">
              <div v-if="!editando || editando.id !== jugadora.id" class="text-center text-lg font-bold text-primary">
                {{ jugadora.asistencias || 0 }}
              </div>
              <input
                v-else
                v-model.number="editando.asistencias"
                type="number"
                min="0"
                class="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary"
              />
            </td>
            <td class="px-6 py-3 text-center">
              <div v-if="!editando || editando.id !== jugadora.id" class="flex gap-2 justify-center">
                <button
                  @click="iniciarEdicion(jugadora)"
                  class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold text-sm transition-colors flex items-center gap-1"
                >
                  <PencilIcon class="w-4 h-4" />
                  Editar
                </button>
              </div>
              <div v-else class="flex gap-2 justify-center">
                <button
                  @click="guardarEdicion"
                  class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-bold text-sm transition-colors flex items-center gap-1"
                  :disabled="guardando"
                >
                  <CheckIcon class="w-4 h-4" />
                  Guardar
                </button>
                <button
                  @click="cancelarEdicion"
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded font-bold text-sm transition-colors flex items-center gap-1"
                  :disabled="guardando"
                >
                  <XMarkIcon class="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="jugadoras.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
              No hay jugadoras registradas en este equipo
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensaje de éxito/error -->
    <div v-if="mensaje" :class="[
      'p-4 rounded-lg font-bold text-white',
      mensaje.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]">
      {{ mensaje.texto }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDocs, collection, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const equipoSeleccionado = ref('ascenso');
const jugadoras = ref([]);
const isLoading = ref(false);
const editando = ref(null);
const guardando = ref(false);
const mensaje = ref(null);

// Cargar jugadoras del equipo seleccionado
const cargarJugadoras = async () => {
  isLoading.value = true;
  try {
    const q = query(
      collection(db, 'jugadoras'),
      where('equipo', '==', equipoSeleccionado.value)
    );
    const snapshot = await getDocs(q);
    jugadoras.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      goles: doc.data().goles || 0,
      asistencias: doc.data().asistencias || 0
    }));
  } catch (err) {
    console.error('Error cargando jugadoras:', err);
    mostrarMensaje('Error al cargar las jugadoras', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Iniciar edición
const iniciarEdicion = (jugadora) => {
  editando.value = {
    id: jugadora.id,
    goles: jugadora.goles || 0,
    asistencias: jugadora.asistencias || 0
  };
};

// Cancelar edición
const cancelarEdicion = () => {
  editando.value = null;
};

// Guardar edición
const guardarEdicion = async () => {
  guardando.value = true;
  try {
    const docRef = doc(db, 'jugadoras', editando.value.id);
    await updateDoc(docRef, {
      goles: editando.value.goles || 0,
      asistencias: editando.value.asistencias || 0,
      updatedAt: new Date()
    });

    // Actualizar en la lista local
    const index = jugadoras.value.findIndex(j => j.id === editando.value.id);
    if (index !== -1) {
      jugadoras.value[index].goles = editando.value.goles;
      jugadoras.value[index].asistencias = editando.value.asistencias;
    }

    editando.value = null;
    mostrarMensaje('Estadísticas actualizadas correctamente', 'success');
  } catch (err) {
    console.error('Error guardando estadísticas:', err);
    mostrarMensaje('Error al guardar las estadísticas', 'error');
  } finally {
    guardando.value = false;
  }
};

// Mostrar mensaje temporal
const mostrarMensaje = (texto, tipo) => {
  mensaje.value = { texto, tipo };
  setTimeout(() => {
    mensaje.value = null;
  }, 3000);
};

// Cargar jugadoras al montar
onMounted(() => {
  cargarJugadoras();
});
</script>
