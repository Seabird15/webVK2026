<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestionar Estadísticas 2026</h2>

    <!-- Selector de equipo y botones de acción -->
    <div class="bg-gray-50 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-bold text-gray-700 mb-2">Seleccionar Equipo</label>
        <select
          v-model="equipoSeleccionado"
          @change="cargarEstadisticas"
          class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="ascenso">Ascenso</option>
          <option value="escuela">Escuela</option>
        </select>
      </div>
      
      <div class="flex gap-2">
        <!-- Botón para agregar nueva jugadora -->
        <button
          @click="mostrarFormularioAgregar = true"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          Agregar Jugadora
        </button>

        <!-- Botón para inicializar datos (solo para Ascenso) -->
        <button
          v-if="equipoSeleccionado === 'ascenso'"
          @click="inicializarDatosAscenso"
          :disabled="inicializando"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ inicializando ? 'Inicializando...' : '⚡ Cargar Datos Iniciales' }}
        </button>
      </div>
    </div>

    <!-- Formulario para agregar jugadora -->
    <div v-if="mostrarFormularioAgregar" class="bg-white border-2 border-primary rounded-lg p-6 shadow-lg">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Agregar Nueva Jugadora</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
          <input
            v-model="nuevaJugadora.nombre"
            type="text"
            placeholder="Nombre"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Apellido</label>
          <input
            v-model="nuevaJugadora.apellido"
            type="text"
            placeholder="Apellido"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Goles</label>
          <input
            v-model.number="nuevaJugadora.goles"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Asistencias</label>
          <input
            v-model.number="nuevaJugadora.asistencias"
            type="number"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button
          @click="agregarJugadora"
          :disabled="!nuevaJugadora.nombre || !nuevaJugadora.apellido || guardando"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
        <button
          @click="cancelarAgregar"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
        >
          Cancelar
        </button>
      </div>
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
                <button
                  @click="confirmarEliminar(jugadora)"
                  class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-bold text-sm transition-colors flex items-center gap-1"
                >
                  <TrashIcon class="w-4 h-4" />
                  Eliminar
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
import { getDocs, collection, query, where, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { PencilIcon, CheckIcon, XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid';

const equipoSeleccionado = ref('ascenso');
const jugadoras = ref([]);
const isLoading = ref(false);
const editando = ref(null);
const guardando = ref(false);
const mensaje = ref(null);
const inicializando = ref(false);
const mostrarFormularioAgregar = ref(false);
const nuevaJugadora = ref({
  nombre: '',
  apellido: '',
  goles: 0,
  asistencias: 0
});

// Datos iniciales de estadísticas para Ascenso
const estadisticasIniciales = [
  { nombre: 'Paula', apellido: 'Santibañez', goles: 3, asistencias: 1 },
  { nombre: 'Gabriela', apellido: 'Cordero', goles: 3, asistencias: 1 },
  { nombre: 'Tiare', apellido: 'Bernal', goles: 1, asistencias: 3 },
  { nombre: 'Natalia', apellido: 'Gajardo', goles: 1, asistencias: 0 },
  { nombre: 'Juliana', apellido: 'Gundim', goles: 2, asistencias: 0 },
  { nombre: 'Eli', apellido: 'Ormeño', goles: 2, asistencias: 1 },
  { nombre: 'Genesis', apellido: 'Rodriguez', goles: 0, asistencias: 1 }
];

// Cargar estadísticas del equipo seleccionado
const cargarEstadisticas = async () => {
  isLoading.value = true;
  try {
    const q = query(
      collection(db, 'estadisticas'),
      where('equipo', '==', equipoSeleccionado.value)
    );
    const snapshot = await getDocs(q);
    jugadoras.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => {
      const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
      const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
  } catch (err) {
    console.error('Error cargando estadísticas:', err);
    mostrarMensaje('Error al cargar las estadísticas', 'error');
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
    const docRef = doc(db, 'estadisticas', editando.value.id);
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

// Agregar nueva jugadora
const agregarJugadora = async () => {
  guardando.value = true;
  try {
    await addDoc(collection(db, 'estadisticas'), {
      nombre: nuevaJugadora.value.nombre,
      apellido: nuevaJugadora.value.apellido,
      equipo: equipoSeleccionado.value,
      goles: nuevaJugadora.value.goles || 0,
      asistencias: nuevaJugadora.value.asistencias || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    mostrarMensaje('Jugadora agregada correctamente', 'success');
    cancelarAgregar();
    await cargarEstadisticas();
  } catch (err) {
    console.error('Error agregando jugadora:', err);
    mostrarMensaje('Error al agregar la jugadora', 'error');
  } finally {
    guardando.value = false;
  }
};

// Cancelar agregar
const cancelarAgregar = () => {
  mostrarFormularioAgregar.value = false;
  nuevaJugadora.value = {
    nombre: '',
    apellido: '',
    goles: 0,
    asistencias: 0
  };
};

// Confirmar eliminar
const confirmarEliminar = async (jugadora) => {
  if (!confirm(`¿Estás seguro de eliminar a ${jugadora.nombre} ${jugadora.apellido}?`)) {
    return;
  }

  try {
    await deleteDoc(doc(db, 'estadisticas', jugadora.id));
    jugadoras.value = jugadoras.value.filter(j => j.id !== jugadora.id);
    mostrarMensaje('Jugadora eliminada correctamente', 'success');
  } catch (err) {
    console.error('Error eliminando jugadora:', err);
    mostrarMensaje('Error al eliminar la jugadora', 'error');
  }
};

// Inicializar datos de Ascenso
const inicializarDatosAscenso = async () => {
  if (!confirm('¿Estás seguro de cargar los datos iniciales? Esto creará registros nuevos para las jugadoras especificadas.')) {
    return;
  }

  inicializando.value = true;
  try {
    let agregadas = 0;

    for (const estadistica of estadisticasIniciales) {
      await addDoc(collection(db, 'estadisticas'), {
        nombre: estadistica.nombre,
        apellido: estadistica.apellido,
        equipo: 'ascenso',
        goles: estadistica.goles,
        asistencias: estadistica.asistencias,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      agregadas++;
    }

    mostrarMensaje(`✅ ${agregadas} jugadoras agregadas correctamente`, 'success');
    await cargarEstadisticas();
  } catch (err) {
    console.error('Error inicializando datos:', err);
    mostrarMensaje('Error al cargar los datos iniciales', 'error');
  } finally {
    inicializando.value = false;
  }
};

// Cargar estadísticas al montar
onMounted(() => {
  cargarEstadisticas();
});
</script>
