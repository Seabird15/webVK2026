<template>
  <div class="space-y-4 pb-4">
    <!-- Editor de Resultados -->
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <TrophyIcon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-gray-900">Resultados</h2>
        </div>
        <span class="text-xs sm:text-sm text-gray-400 font-medium">⚡ Vivo</span>
      </div>

    <!-- Filtros Mejorados -->
    <div class="space-y-3 sm:space-y-4">
      <div class="flex gap-2">
        <button
          @click="filtroEquipo = 'ambos'"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-sm transition-all',
            filtroEquipo === 'ambos'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Todos
        </button>
        <button
          @click="filtroEquipo = 'ascenso'"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-sm transition-all',
            filtroEquipo === 'ascenso'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Ascenso
        </button>
        <button
          @click="filtroEquipo = 'escuela'"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-sm transition-all',
            filtroEquipo === 'escuela'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Escuela
        </button>
      </div>

      <div class="flex gap-2">
        <button
          @click="filtroTipo = 'todos'"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-sm transition-all',
            filtroTipo === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Todos
        </button>
        <button
          @click="filtroTipo = 'partido'"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-sm transition-all',
            filtroTipo === 'partido'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Partido
        </button>
        <button
          @click="filtroTipo = 'amistoso'"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-sm transition-all',
            filtroTipo === 'amistoso'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Amistoso
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
      <p class="text-gray-500 mt-4 font-medium">Cargando partidos...</p>
    </div>

    <!-- Partidos -->
    <div v-else class="space-y-3">
      <div
        v-for="partido in partidosFiltrados"
        :key="partido.id"
        class="border-l-4 border-l-blue-500 bg-linear-to-r from-blue-50 to-white rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
      >
        <!-- Info básica del partido -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <h3 class="font-bold text-base sm:text-lg text-gray-900">
              📅 {{ formatearFecha(partido.fecha) }}
            </h3>
            <div class="flex flex-wrap gap-1 mt-2">
              <span class="text-xs bg-blue-200 text-blue-800 px-2.5 py-1 rounded-full font-bold">
                {{ partido.equipo.toUpperCase() }}
              </span>
              <span class="text-xs bg-purple-200 text-purple-800 px-2.5 py-1 rounded-full font-bold">
                {{ partido.tipo.toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm sm:text-base font-bold text-blue-600">🕐 {{ partido.hora }}</p>
            <p class="text-xs sm:text-sm text-gray-600 mt-1">vs <span class="font-semibold">{{ partido.rival }}</span></p>
          </div>
        </div>

        <!-- Botón Editar si está FINALIZADO -->
        <div v-if="partido.estado === 'FINALIZADO' && !expandidosEdicion.has(partido.id)" class="mb-4">
          <button
            @click="toggleEdicion(partido.id)"
            class="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-3 rounded-lg font-bold text-base transition active:scale-95 flex items-center justify-center gap-2 shadow-md"
          >
            <span>✏️</span> Editar goles y asistencias
          </button>
        </div>

        <!-- Editor de goles (oculto si finalizado sin expandir) -->
        <div v-if="partido.estado !== 'FINALIZADO' || expandidosEdicion.has(partido.id)" class="space-y-4">
          <p class="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">⚽ Marcador</p>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <!-- Goles Local -->
            <div class="text-center">
              <p class="text-xs font-bold text-blue-700 mb-2">🏠 CD VIKINGAS</p>
              <div class="flex items-center justify-center gap-2 sm:gap-3">
                <button
                  @click="decrementarGol(partido, 'local')"
                  :disabled="partido.golesLocal === 0 || guardando"
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <input
                  :value="partido.golesLocal"
                  @change="e => actualizarGolDirecto(partido, 'local', parseInt(e.target.value))"
                  type="number"
                  min="0"
                  :disabled="guardando"
                  class="w-10 sm:w-16 mx-a text-center text-2xl sm:text-3xl font-black border-2 border-blue-300 rounded-lg py-1 sm:py-2 text-blue-600"
                />
                <button
                  @click="incrementarGol(partido, 'local')"
                  :disabled="guardando"
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Goles Visitante -->
            <div class="text-center">
              <p class="text-xs font-bold text-orange-700 mb-2">🚌 {{ partido.rival.toUpperCase() }}</p>
              <div class="flex items-center justify-center gap-2 sm:gap-3">
                <button
                  @click="decrementarGol(partido, 'visita')"
                  :disabled="partido.golesVisita === 0 || guardando"
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <input
                  :value="partido.golesVisita"
                  @change="e => actualizarGolDirecto(partido, 'visita', parseInt(e.target.value))"
                  type="number"
                  min="0"
                  :disabled="guardando"
                  class="w-14 sm:w-16 text-center text-2xl sm:text-3xl font-black border-2 border-orange-300 rounded-lg py-1 sm:py-2 text-orange-600"
                />
                <button
                  @click="incrementarGol(partido, 'visita')"
                  :disabled="guardando"
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Goleadores y Asistencias -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- 
              SECCIÓN DE GOLEADORES
              - Solo se pueden editar goleadores de CD VIKINGAS (equipo local)
              - Los goleadores del rival se muestran como LECTURA SOLAMENTE
              - Cuando agregas una goleadora en Vikingas, automáticamente se suma a Estadísticas.vue
              - La búsqueda usa distancia de Levenshtein para encontrar el nombre más similar
              - Tolerancia: hasta 3 caracteres de diferencia (permite errores tipográficos)
            -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Goleadores Local -->
            <div class="bg-white border-2 border-blue-200 rounded-lg p-3 sm:p-4">
              <p class="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">⚽ Goleadores</p>
              <div class="space-y-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
                <div
                  v-for="(gol, idx) in partido.goleadoresLocal"
                  :key="`local-${idx}`"
                  class="flex items-center justify-between bg-linear-to-r from-blue-50 to-transparent p-2.5 rounded-lg text-sm border-l-3 border-blue-400"
                >
                  <span class="font-semibold text-blue-900">
                    {{ gol.jugadora }}
                    <span class="text-xs text-blue-600 font-normal ml-1">{{ gol.minuto }}'</span>
                  </span>
                  <button
                    @click="removerGoleador(partido, 'local', idx)"
                    :disabled="guardando"
                    class="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold transition disabled:opacity-40 p-1 rounded"
                  >
                    ✕
                  </button>
                </div>
                <p v-if="!partido.goleadoresLocal || partido.goleadoresLocal.length === 0" class="text-xs text-gray-400 italic text-center py-2">
                  Sin goles registrados
                </p>
              </div>
              <div class="space-y-2">
                <input
                  v-model="nuevoGoleadorLocal"
                  @keyup.enter="agregarGoleador(partido, 'local')"
                  type="text"
                  placeholder="Nombre de la goleadora..."
                  :disabled="guardando"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  v-model.number="minutoLocal"
                  type="number"
                  min="0"
                  max="90"
                  placeholder="Minuto (0-90)"
                  :disabled="guardando"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  @click="agregarGoleador(partido, 'local')"
                  :disabled="!nuevoGoleadorLocal || guardando"
                  class="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 text-white px-3 py-2.5 rounded-lg font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>⚽</span> Registrar Gol
                </button>
              </div>
            </div>

            <!-- Asistencias Locales -->
            <div class="bg-white border-2 border-green-200 rounded-lg p-3 sm:p-4">
              <p class="text-xs font-bold text-green-700 mb-3 uppercase tracking-wide">🤝 Asistencias</p>
              <div class="space-y-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
                <div
                  v-for="(asistencia, idx) in partido.asistenciasLocal"
                  :key="`local-asist-${idx}`"
                  class="flex items-center justify-between bg-linear-to-r from-green-50 to-transparent p-2.5 rounded-lg text-sm border-l-3 border-green-400"
                >
                  <span class="font-semibold text-green-900">
                    {{ asistencia.asistente }}
                    <span class="text-xs text-green-600 font-normal ml-1">{{ asistencia.minuto }}'</span>
                  </span>
                  <button
                    @click="removerAsistencia(partido, idx)"
                    :disabled="guardando"
                    class="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold transition disabled:opacity-40 p-1 rounded"
                  >
                    ✕
                  </button>
                </div>
                <p v-if="!partido.asistenciasLocal || partido.asistenciasLocal.length === 0" class="text-xs text-gray-400 italic text-center py-2">
                  Sin asistencias registradas
                </p>
              </div>
              <div class="space-y-2">
                <input
                  v-model="nuevoAsistenteLocal"
                  @keyup.enter="agregarAsistencia(partido)"
                  type="text"
                  placeholder="Nombre de la asistente..."
                  :disabled="guardando"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  v-model.number="minutoAsistenteLocal"
                  type="number"
                  min="0"
                  max="90"
                  placeholder="Minuto (0-90)"
                  :disabled="guardando"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  @click="agregarAsistencia(partido)"
                  :disabled="!nuevoAsistenteLocal || guardando"
                  class="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:scale-95 text-white px-3 py-2.5 rounded-lg font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>🤝</span> Registrar Asistencia
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado -->
        <div class="flex items-center justify-between bg-linear-to-r from-gray-100 to-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
          <span class="text-sm font-bold text-gray-700">📊 Estado:</span>
          <select
            :value="partido.estado"
            @change="e => actualizarEstado(partido, e.target.value)"
            :disabled="guardando"
            class="px-3 py-2 rounded-lg font-bold text-sm border-2 border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 cursor-pointer"
          >
            <option value="PROGRAMADO">📋 Programado</option>
            <option value="EN_CURSO">⚡ En Curso</option>
            <option value="FINALIZADO">✅ Finalizado</option>
          </select>
        </div>

        <!-- Botón Cerrar si está expandido -->
        <div v-if="partido.estado === 'FINALIZADO' && expandidosEdicion.has(partido.id)">
          <button
            @click="toggleEdicion(partido.id)"
            class="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>✕</span> Cerrar edición
          </button>
        </div>

        <!-- Indicador de guardado -->
        <Transition name="slide">
          <div v-if="guardando" class="flex items-center gap-2 text-blue-600 text-sm font-medium bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
            <span>💾 Guardando cambios...</span>
          </div>
        </Transition>
      </div>

      <!-- Sin partidos -->
      <div v-if="partidosFiltrados.length === 0" class="text-center py-16">
        <div class="text-5xl mb-4">🏆</div>
        <p class="text-gray-500 text-lg font-medium">No hay partidos que mostrar</p>
        <p class="text-gray-400 text-sm mt-2">Ajusta los filtros para ver más partidos</p>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <Transition name="fade">
      <div
        v-if="mensajeExito"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        {{ mensajeExito }}
      </div>
    </Transition>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { TrophyIcon } from '@heroicons/vue/24/solid';
import {
  obtenerPartidosPorEquipoTipo,
  escucharPartidos,
  registrarGol,
  deshacerGol,
  actualizarResultado,
  registrarAsistencia,
  actualizarEstadisticaGol,
  decrementarEstadisticaGol,
  actualizarEstadisticaAsistencia,
  decrementarEstadisticaAsistencia
} from '../firebase/partidos';
import { updateDoc, doc, collection, query, where, onSnapshot, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

// Reactive state
const partidosAscenso = ref([]);
const partidosEscuela = ref([]);


const isLoading = ref(true);
const guardando = ref(false);
const filtroEquipo = ref('ambos');
const filtroTipo = ref('todos');
const mensajeExito = ref('');

// Inputs temporales para goleadores
const nuevoGoleadorLocal = ref('');
const nuevoGoleadorVisita = ref('');
const minutoLocal = ref(0);
const minutoVisita = ref(0);
// La goleadora SOLO se edita en Vikingas (equipo local)
// Los datos visitantes se muestran pero no se pueden editar

// Inputs temporales para asistencias
const nuevoAsistenteLocal = ref('');
const minutoAsistenteLocal = ref(0);
// Las asistencias SOLO se editan en Vikingas (equipo local)

// Control de expansión de edición en partidos finalizados
const expandidosEdicion = ref(new Set());

let unsubscribeAscenso = null;
let unsubscribeEscuela = null;
let unsubscribeEntrenamientos = null;

// Array para guardar todos los unsubscribers
const unsubscribers = [];

// Computed - filtrar partidos
const partidosFiltrados = computed(() => {
  let todos = [];
  
  if (filtroEquipo.value === 'ascenso' || filtroEquipo.value === 'ambos') {
    todos = [...todos, ...partidosAscenso.value];
  }
  
  if (filtroEquipo.value === 'escuela' || filtroEquipo.value === 'ambos') {
    todos = [...todos, ...partidosEscuela.value];
  }

  if (filtroTipo.value !== 'todos') {
    todos = todos.filter(p => p.tipo === filtroTipo.value);
  }

  const ordenados = todos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const limitados = ordenados.slice(0, 3);
  return limitados;
});

// Formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  }).toUpperCase();
};

// Incrementar gol
const incrementarGol = async (partido, lado) => {
  guardando.value = true;
  try {
    const nuevoGol = lado === 'local' ? partido.golesLocal + 1 : partido.golesVisita + 1;
    
    if (partido.fuente === 'entrenamientos') {
      const docRef = doc(db, 'entrenamientos', partido.id);
      await updateDoc(docRef, {
        [lado === 'local' ? 'resultadoLocal' : 'resultadoVisita']: nuevoGol
      });
    } else {
      await actualizarResultado(partido.id, 
        lado === 'local' ? nuevoGol : partido.golesLocal,
        lado === 'visita' ? nuevoGol : partido.golesVisita
      );
    }
    // actualizar estadísticas solo si es el equipo local
    if (lado === 'local') {
      await actualizarEstadisticaGol(nuevoGoleadorLocal.value || '', partido.equipo, partido.tipo);
    }
    mostrarMensaje('Gol registrado ✓');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Decrementar gol
const decrementarGol = async (partido, lado) => {
  guardando.value = true;
  try {
    const nuevoGol = Math.max(0, lado === 'local' ? partido.golesLocal - 1 : partido.golesVisita - 1);
    
    if (partido.fuente === 'entrenamientos') {
      const docRef = doc(db, 'entrenamientos', partido.id);
      await updateDoc(docRef, {
        [lado === 'local' ? 'resultadoLocal' : 'resultadoVisita']: nuevoGol
      });
    } else {
      await actualizarResultado(partido.id,
        lado === 'local' ? nuevoGol : partido.golesLocal,
        lado === 'visita' ? nuevoGol : partido.golesVisita
      );
    }
    if (lado === 'local') {
      // descontar de estadísticas si corresponde
      // no tenemos nombre aquí, así que no actualizamos stats
    }
    mostrarMensaje('Gol eliminado ✓');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Actualizar gol directo (input)
const actualizarGolDirecto = async (partido, lado, valor) => {
  guardando.value = true;
  try {
    if (partido.fuente === 'entrenamientos') {
      const docRef = doc(db, 'entrenamientos', partido.id);
      await updateDoc(docRef, {
        [lado === 'local' ? 'resultadoLocal' : 'resultadoVisita']: valor
      });
    } else {
      await actualizarResultado(partido.id,
        lado === 'local' ? valor : partido.golesLocal,
        lado === 'visita' ? valor : partido.golesVisita
      );
    }
    mostrarMensaje('Resultado actualizado ✓');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Agregar goleador
const agregarGoleador = async (partido, lado) => {
  // SOLO permitimos editar goleadoras locales (CD Vikingas)
  if (lado === 'visita') {
    console.warn('⊘ No se pueden editar goleadores del rival');
    return;
  }

  const nombre = lado === 'local' ? nuevoGoleadorLocal.value : nuevoGoleadorVisita.value;
  const minuto = lado === 'local' ? minutoLocal.value : minutoVisita.value;

  if (!nombre.trim()) return;

  guardando.value = true;
  try {
    const nuevoGol = {
      jugadora: nombre,
      minuto,
      timestamp: new Date()
    };

    if (partido.fuente === 'entrenamientos') {
      const campoGoleadores = lado === 'local' ? 'goleadoresLocal' : 'goleadoresVisita';
      const campoResultado = lado === 'local' ? 'resultadoLocal' : 'resultadoVisita';
      const docRef = doc(db, 'entrenamientos', partido.id);
      
      await updateDoc(docRef, {
        [campoGoleadores]: arrayUnion(nuevoGol),
        [campoResultado]: increment(1)
      });
    } else {
      await registrarGol(partido.id, lado, nombre, minuto);
    }
    // si es local, actualizar estadisticas usando la lógica difusa
    if (lado === 'local') {
      await actualizarEstadisticaGol(nombre, partido.equipo, partido.tipo);
    }
    
    // Limpiar inputs
    if (lado === 'local') {
      nuevoGoleadorLocal.value = '';
      minutoLocal.value = 0;
    } else {
      nuevoGoleadorVisita.value = '';
      minutoVisita.value = 0;
    }
    
    mostrarMensaje(`Gol registrado para ${nombre} ✓`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Remover goleador
const removerGoleador = async (partido, lado, indice) => {
  // SOLO permitimos eliminar goleadores locales
  if (lado === 'visita') {
    console.warn('⊘ No se puede eliminar goleadores del rival');
    return;
  }

  guardando.value = true;
  try {
    const goleadores = lado === 'local' ? partido.goleadoresLocal : partido.goleadoresVisita;
    const goleador = goleadores[indice];
    
    if (partido.fuente === 'entrenamientos') {
      const campoGoleadores = lado === 'local' ? 'goleadoresLocal' : 'goleadoresVisita';
      const campoResultado = lado === 'local' ? 'resultadoLocal' : 'resultadoVisita';
      const docRef = doc(db, 'entrenamientos', partido.id);
      const nuevoArray = goleadores.filter((_, i) => i !== indice);
      
      await updateDoc(docRef, {
        [campoGoleadores]: nuevoArray,
        [campoResultado]: increment(-1)
      });
    } else {
      await deshacerGol(partido.id, lado, goleador.jugadora);
    }
    // ajustar estadisticas si era local
    if (lado === 'local') {
      await decrementarEstadisticaGol(goleador.jugadora, partido.equipo, partido.tipo);
    }
    mostrarMensaje('Gol eliminado ✓');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Agregar asistencia
const agregarAsistencia = async (partido) => {
  // SOLO permitimos registrar asistencias locales (CD Vikingas)
  const nombre = nuevoAsistenteLocal.value;
  const minuto = minutoAsistenteLocal.value;

  if (!nombre.trim()) return;

  guardando.value = true;
  try {
    const nuevoAsistencia = {
      asistente: nombre,
      minuto,
      timestamp: new Date()
    };

    // Registrar en el partido (entrenamientos u otros)
    if (partido.fuente === 'entrenamientos') {
      const docRef = doc(db, 'entrenamientos', partido.id);
      await updateDoc(docRef, {
        'asistenciasLocal': arrayUnion(nuevoAsistencia)
      });
    } else {
      // Para partidos regulares, si existe campo similar
      const docRef = doc(db, 'partidos', partido.id);
      await updateDoc(docRef, {
        'asistenciasLocal': arrayUnion(nuevoAsistencia)
      });
    }
    
    // Actualizar estadísticas con lógica difusa
    await actualizarEstadisticaAsistencia(nombre, partido.equipo, partido.tipo);
    
    // Limpiar inputs
    nuevoAsistenteLocal.value = '';
    minutoAsistenteLocal.value = 0;
    
    mostrarMensaje(`Asistencia registrada para ${nombre} ✓`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Remover asistencia
const removerAsistencia = async (partido, indice) => {
  guardando.value = true;
  try {
    const asistencias = partido.asistenciasLocal || [];
    const asistencia = asistencias[indice];
    
    if (partido.fuente === 'entrenamientos') {
      const docRef = doc(db, 'entrenamientos', partido.id);
      const nuevoArray = asistencias.filter((_, i) => i !== indice);
      
      await updateDoc(docRef, {
        'asistenciasLocal': nuevoArray
      });
    } else {
      const docRef = doc(db, 'partidos', partido.id);
      const nuevoArray = asistencias.filter((_, i) => i !== indice);
      
      await updateDoc(docRef, {
        'asistenciasLocal': nuevoArray
      });
    }
    
    // Ajustar estadísticas
    await decrementarEstadisticaAsistencia(asistencia.asistente, partido.equipo, partido.tipo);
    
    mostrarMensaje('Asistencia eliminada ✓');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Actualizar estado del partido
const actualizarEstado = async (partido, nuevoEstado) => {
  guardando.value = true;
  try {
    // Determinar si es de la nueva colección 'partidos' o de 'entrenamientos'
    const coleccion = partido.fuente === 'entrenamientos' ? 'entrenamientos' : 'partidos';
    const docRef = doc(db, coleccion, partido.id);
    await updateDoc(docRef, { estado: nuevoEstado });
    mostrarMensaje('Estado actualizado ✓');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

// Toggle edición de goles y asistencias en partidos finalizados
const toggleEdicion = (partidoId) => {
  if (expandidosEdicion.value.has(partidoId)) {
    expandidosEdicion.value.delete(partidoId);
  } else {
    expandidosEdicion.value.add(partidoId);
  }
  // Trigger reactivity
  expandidosEdicion.value = new Set(expandidosEdicion.value);
};

const mostrarMensaje = (msg) => {
  mensajeExito.value = msg;
  setTimeout(() => {
    mensajeExito.value = '';
  }, 3000);
};

// Cargar partidos
onMounted(async () => {
  try {
    
    // flags para controlar primera respuesta de cada escucha
    const cargado = { ascenso: false, escuela: false, entrenamientos: false };
    const chequearCarga = () => {
      if (cargado.ascenso && cargado.escuela && cargado.entrenamientos) {
        isLoading.value = false;
      }
    };

    // Escuchar partidos de la nueva colección 'partidos'
    unsubscribeAscenso = escucharPartidos('ascenso', null, (datos) => {
      cargado.ascenso = true;
      chequearCarga();
      const partidosNuevos = datos.map(p => ({
        ...p,
        fuente: 'partidos'
      }));
      // conservar los que vienen de entrenamientos para evitar que se borren
      const entrenamientosPrevios = partidosAscenso.value.filter(p => p.fuente === 'entrenamientos');
      partidosAscenso.value = [...entrenamientosPrevios, ...partidosNuevos];
    });
    unsubscribers.push(unsubscribeAscenso);

    unsubscribeEscuela = escucharPartidos('escuela', null, (datos) => {
      cargado.escuela = true;
      chequearCarga();
      const partidosNuevos = datos.map(p => ({
        ...p,
        fuente: 'partidos'
      }));
      const entrenamientosPrevios = partidosEscuela.value.filter(p => p.fuente === 'entrenamientos');
      partidosEscuela.value = [...entrenamientosPrevios, ...partidosNuevos];
    });
    unsubscribers.push(unsubscribeEscuela);

    // IMPORTANTE: También buscar entrenamientos con tipo 'partido' o 'amistoso'
    const entrenamientosQuery = query(
      collection(db, 'entrenamientos'),
      where('tipo', 'in', ['partido', 'amistoso'])
    );

    unsubscribeEntrenamientos = onSnapshot(entrenamientosQuery, (snapshot) => {
      cargado.entrenamientos = true;
      chequearCarga();
      const entrenamientos = snapshot.docs.map(doc => {
        const data = doc.data();
        const item = {
          id: doc.id,
          fecha: data.fecha,
          hora: data.hora,
          equipo: data.equipo || 'ascenso',
          tipo: data.tipo,
          rival: data.rival || data.nombre || 'Por confirmar',
          lugar: data.lugar || '',
          golesLocal: data.golesLocal || data.resultadoLocal || 0,
          golesVisita: data.golesVisita || data.resultadoVisita || 0,
          goleadoresLocal: data.goleadoresLocal || [],
          goleadorasLocal: data.goleadorasLocal || [],
          goleadoresVisita: data.goleadoresVisita || [],
          estado: data.estado || 'PROGRAMADO',
          fuente: 'entrenamientos' // Para identificar que viene de entrenamientos
        };
    
        return item;
      });

      // Separar por equipo
      const ascenso = entrenamientos.filter(e => e.equipo === 'ascenso' || e.equipo === 'ambos');
      const escuela = entrenamientos.filter(e => e.equipo === 'escuela' || e.equipo === 'ambos');

      // Combinar con partidos existentes
      partidosAscenso.value = [
        ...ascenso,
        ...(partidosAscenso.value.filter(p => p.fuente === 'partidos') || [])
      ];

      partidosEscuela.value = [
        ...escuela,
        ...(partidosEscuela.value.filter(p => p.fuente === 'partidos') || [])
      ];


    });
    unsubscribers.push(unsubscribeEntrenamientos);

    // isLoading se desactivará cuando todas las escuchas hayan respondido al menos una vez
  } catch (err) {
    console.error('❌ Error cargando partidos:', err);
    isLoading.value = false;
  }
});

// Limpiar listeners
onUnmounted(() => {
  unsubscribers.forEach(unsub => {
    if (unsub && typeof unsub === 'function') {
      unsub();
    }
  });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
