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
          @click="filtroEquipo = 'serieC'"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-sm transition-all',
            filtroEquipo === 'serieC'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          Serie C
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

          <div class="rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 to-white p-3 sm:p-4 space-y-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-wide text-amber-700">Reloj del partido</p>
                <p class="mt-1 text-lg font-black text-gray-900">{{ obtenerEtiquetaTiempoPartido(partido) }}</p>
                <p class="text-xs text-gray-500 mt-1">Los goles toman automaticamente el minuto visible de este reloj.</p>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  v-if="puedeIniciarPrimerTiempo(partido)"
                  @click="actualizarFasePartido(partido, 'PRIMER_TIEMPO')"
                  :disabled="guardando"
                  class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  Iniciar 1er tiempo
                </button>
                <button
                  v-if="puedeIrAEntretiempo(partido)"
                  @click="actualizarFasePartido(partido, 'ENTRETIEMPO')"
                  :disabled="guardando"
                  class="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
                >
                  Finalizar 1er tiempo
                </button>
                <button
                  v-if="puedeIniciarSegundoTiempo(partido)"
                  @click="actualizarFasePartido(partido, 'SEGUNDO_TIEMPO')"
                  :disabled="guardando"
                  class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Iniciar 2do tiempo
                </button>
                <button
                  v-if="puedeFinalizarPartido(partido)"
                  @click="actualizarFasePartido(partido, 'FINALIZADO')"
                  :disabled="guardando"
                  class="rounded-lg bg-gray-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-gray-900 disabled:opacity-50"
                >
                  Finalizar partido
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
                    {{ gol.jugadoraNombre || gol.jugadora }}
                    <span v-if="mostrarMinuto(gol.minuto)" class="text-xs text-blue-600 font-normal ml-1">{{ mostrarMinuto(gol.minuto) }}</span>
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
                <select
                  v-model="seleccionGoleadora[partido.id]"
                  :disabled="guardando"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una goleadora...</option>
                  <option
                    v-for="jugadora in obtenerJugadorasEquipo(partido)"
                    :key="`gol-${partido.id}-${jugadora.id}`"
                    :value="jugadora.id"
                  >
                    {{ jugadora.nombre }} {{ jugadora.apellido }}
                  </option>
                </select>
                <div class="w-full px-3 py-2 text-xs border border-blue-200 rounded-lg bg-blue-50 text-blue-800 font-semibold">
                  El gol se guarda con el minuto que marque el reloj del partido.
                </div>
                <button
                  @click="agregarGoleador(partido, 'local')"
                  :disabled="!seleccionGoleadora[partido.id] || guardando"
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
                    {{ asistencia.asistenteNombre || asistencia.asistente }}
                    <span v-if="mostrarMinuto(asistencia.minuto)" class="text-xs text-green-600 font-normal ml-1">{{ mostrarMinuto(asistencia.minuto) }}</span>
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
                <select
                  v-model="seleccionAsistente[partido.id]"
                  :disabled="guardando"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecciona una asistente...</option>
                  <option
                    v-for="jugadora in obtenerJugadorasEquipo(partido)"
                    :key="`asist-${partido.id}-${jugadora.id}`"
                    :value="jugadora.id"
                  >
                    {{ jugadora.nombre }} {{ jugadora.apellido }}
                  </option>
                </select>
                <input
                  v-model.number="minutoAsistente[partido.id]"
                  type="number"
                  min="0"
                  max="90"
                  placeholder="Minuto (opcional)"
                  :disabled="guardando"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  @click="agregarAsistencia(partido)"
                  :disabled="!seleccionAsistente[partido.id] || guardando"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { TrophyIcon } from '@heroicons/vue/24/solid';
import {
  escucharPartidos,
  actualizarResultado
} from '../firebase/partidos';
import { updateDoc, doc, collection, query, where, onSnapshot, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { fetchJugadorasRegistradasPorEquipo } from '../firebase/jugadorasAuth';
import { actualizarContadorEstadistica } from '../firebase/estadisticas';

// Reactive state
const partidosAscenso = ref([]);
const partidosSerieC = ref([]);


const isLoading = ref(true);
const guardando = ref(false);
const filtroEquipo = ref('ambos');
const filtroTipo = ref('todos');
const mensajeExito = ref('');
const plantelPorEquipo = ref({
  ascenso: [],
  serieC: []
});
const seleccionGoleadora = ref({});
const seleccionAsistente = ref({});
const minutoAsistente = ref({});
const ahora = ref(Date.now());
let intervaloReloj = null;

// Control de expansión de edición en partidos finalizados
const expandidosEdicion = ref(new Set());

let unsubscribeAscenso = null;
let unsubscribeSerieC = null;
let unsubscribeEntrenamientos = null;

// Array para guardar todos los unsubscribers
const unsubscribers = [];

// Computed - filtrar partidos
const partidosFiltrados = computed(() => {
  let todos = [];
  
  if (filtroEquipo.value === 'ascenso' || filtroEquipo.value === 'ambos') {
    todos = [...todos, ...partidosAscenso.value];
  }

  if (filtroEquipo.value === 'serieC' || filtroEquipo.value === 'ambos') {
    todos = [...todos, ...partidosSerieC.value];
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

const obtenerJugadorasEquipo = (partido) => {
  return plantelPorEquipo.value[partido.equipo] || [];
};

const buscarJugadoraEquipo = (partido, jugadoraId) => {
  return obtenerJugadorasEquipo(partido).find((jugadora) => jugadora.id === jugadoraId) || null;
};

const obtenerFechaDesdeValor = (valor) => {
  if (!valor) return null;
  if (valor instanceof Date) return new Date(valor);
  if (typeof valor?.toDate === 'function') return valor.toDate();

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const obtenerInicioProgramadoPartido = (partido) => {
  const fechaBase = obtenerFechaDesdeValor(partido?.fecha);
  if (!fechaBase) return null;

  const horaTexto = (partido?.hora || '').toString().split('-')[0].trim();
  const [horas, minutos] = horaTexto.split(':').map((valor) => Number(valor || 0));
  fechaBase.setHours(
    Number.isFinite(horas) ? horas : 0,
    Number.isFinite(minutos) ? minutos : 0,
    0,
    0
  );

  return fechaBase;
};

const obtenerFasePartido = (partido) => {
  const fase = (partido?.fasePartido || '').toString().trim();

  if (fase) return fase;
  if (partido?.estado === 'FINALIZADO') return 'FINALIZADO';
  if (partido?.estado === 'EN_CURSO') return 'PRIMER_TIEMPO';

  return 'PROGRAMADO';
};

const calcularMinutoDesdeInicio = (inicio, base, minimo, maximo) => {
  const fechaInicio = obtenerFechaDesdeValor(inicio);
  if (!fechaInicio) return base;

  const diferenciaMs = ahora.value - fechaInicio.getTime();
  if (diferenciaMs <= 0) return base;

  return Math.min(maximo, Math.max(minimo, Math.floor(diferenciaMs / 60000) + base));
};

const calcularRelojDesdeInicio = (inicio, minutoBase, minutoMinimo, minutoMaximo) => {
  const fechaInicio = obtenerFechaDesdeValor(inicio);
  if (!fechaInicio) {
    return {
      minuto: minutoBase,
      segundo: 0
    };
  }

  const diferenciaMs = Math.max(0, ahora.value - fechaInicio.getTime());
  const totalSegundos = Math.floor(diferenciaMs / 1000);
  const minuto = Math.min(minutoMaximo, Math.max(minutoMinimo, Math.floor(totalSegundos / 60) + minutoBase));
  const segundo = minuto >= minutoMaximo ? Math.min(59, totalSegundos % 60) : totalSegundos % 60;

  return { minuto, segundo };
};

const formatearRelojPartido = ({ minuto, segundo }) => {
  const minutoTexto = String(minuto).padStart(2, '0');
  const segundoTexto = String(segundo).padStart(2, '0');
  return `${minutoTexto}:${segundoTexto}`;
};

const obtenerMinutoActualPartido = (partido) => {
  const fase = obtenerFasePartido(partido);

  if (fase === 'PRIMER_TIEMPO') {
    return calcularMinutoDesdeInicio(
      partido?.inicioPrimerTiempoAt || partido?.inicioEnVivoAt || obtenerInicioProgramadoPartido(partido),
      1,
      1,
      25
    );
  }

  if (fase === 'ENTRETIEMPO') return 25;

  if (fase === 'SEGUNDO_TIEMPO') {
    return calcularMinutoDesdeInicio(partido?.inicioSegundoTiempoAt, 26, 26, 50);
  }

  if (fase === 'FINALIZADO') {
    return partido?.inicioSegundoTiempoAt ? 50 : 25;
  }

  return null;
};

const obtenerEtiquetaTiempoPartido = (partido) => {
  const fase = obtenerFasePartido(partido);
  if (fase === 'PRIMER_TIEMPO') {
    const reloj = calcularRelojDesdeInicio(
      partido?.inicioPrimerTiempoAt || partido?.inicioEnVivoAt || obtenerInicioProgramadoPartido(partido),
      1,
      1,
      25
    );
    return `1er tiempo · ${formatearRelojPartido(reloj)}`;
  }
  if (fase === 'ENTRETIEMPO') return 'Entretiempo';
  if (fase === 'SEGUNDO_TIEMPO') {
    const reloj = calcularRelojDesdeInicio(partido?.inicioSegundoTiempoAt, 26, 26, 50);
    return `2do tiempo · ${formatearRelojPartido(reloj)}`;
  }
  if (fase === 'FINALIZADO') return 'Finalizado';

  return 'Programado';
};

const calcularMinutoAutomaticoGol = (partido) => {
  const fase = obtenerFasePartido(partido);

  if (fase !== 'PRIMER_TIEMPO' && fase !== 'SEGUNDO_TIEMPO') {
    return null;
  }

  return obtenerMinutoActualPartido(partido);
};

const normalizarMinutoOpcional = (valor) => {
  const minuto = Number(valor);
  return Number.isFinite(minuto) && minuto > 0 ? minuto : null;
};

const mostrarMinuto = (valor) => {
  const minuto = normalizarMinutoOpcional(valor);
  return minuto !== null ? `${minuto}'` : '';
};

const limpiarFormularioGol = (partidoId) => {
  seleccionGoleadora.value[partidoId] = '';
};

const limpiarFormularioAsistencia = (partidoId) => {
  seleccionAsistente.value[partidoId] = '';
  minutoAsistente.value[partidoId] = '';
};

const obtenerColeccionPartido = (partido) => {
  return partido.fuente === 'entrenamientos' ? 'entrenamientos' : 'partidos';
};

const puedeIniciarPrimerTiempo = (partido) => {
  const fase = obtenerFasePartido(partido);
  return partido.estado === 'PROGRAMADO' || fase === 'PROGRAMADO';
};

const puedeIrAEntretiempo = (partido) => {
  return obtenerFasePartido(partido) === 'PRIMER_TIEMPO';
};

const puedeIniciarSegundoTiempo = (partido) => {
  return obtenerFasePartido(partido) === 'ENTRETIEMPO';
};

const puedeFinalizarPartido = (partido) => {
  const fase = obtenerFasePartido(partido);
  return fase === 'PRIMER_TIEMPO' || fase === 'ENTRETIEMPO' || fase === 'SEGUNDO_TIEMPO';
};

const obtenerCampoMarcador = (partido, lado) => {
  if (partido.fuente === 'entrenamientos') {
    return lado === 'local' ? 'resultadoLocal' : 'resultadoVisita';
  }

  return lado === 'local' ? 'golesLocal' : 'golesVisita';
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

  const jugadora = buscarJugadoraEquipo(partido, seleccionGoleadora.value[partido.id]);
  const minuto = calcularMinutoAutomaticoGol(partido);

  if (!jugadora) return;
  if (partido.estado !== 'EN_CURSO') {
    mostrarMensaje('Inicia el partido para registrar el gol con minuto automatico');
    return;
  }
  if (obtenerFasePartido(partido) === 'ENTRETIEMPO') {
    mostrarMensaje('No puedes registrar goles durante el entretiempo');
    return;
  }
  if (minuto === null) {
    mostrarMensaje('No se pudo calcular el minuto del gol');
    return;
  }

  const nombre = `${jugadora.nombre} ${jugadora.apellido}`.trim();

  guardando.value = true;
  try {
    const nuevoGol = {
      jugadora: nombre,
      jugadoraId: jugadora.id,
      jugadoraNombre: nombre,
      minuto,
      timestamp: new Date()
    };

    const campoGoleadores = lado === 'local' ? 'goleadoresLocal' : 'goleadoresVisita';
    const campoResultado = obtenerCampoMarcador(partido, lado);
    const docRef = doc(db, obtenerColeccionPartido(partido), partido.id);

    await updateDoc(docRef, {
      [campoGoleadores]: arrayUnion(nuevoGol),
      [campoResultado]: increment(1)
    });

    if (lado === 'local') {
      await actualizarContadorEstadistica({
        equipo: partido.equipo,
        jugadoraId: jugadora.id,
        jugadoraNombre: nombre,
        tipo: partido.tipo,
        campo: 'goles',
        delta: 1
      });
    }

    limpiarFormularioGol(partido.id);
    
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
    const campoGoleadores = lado === 'local' ? 'goleadoresLocal' : 'goleadoresVisita';
    const campoResultado = obtenerCampoMarcador(partido, lado);
    const docRef = doc(db, obtenerColeccionPartido(partido), partido.id);
    const nuevoArray = goleadores.filter((_, i) => i !== indice);
    
    await updateDoc(docRef, {
      [campoGoleadores]: nuevoArray,
      [campoResultado]: increment(-1)
    });

    if (lado === 'local') {
      await actualizarContadorEstadistica({
        equipo: partido.equipo,
        jugadoraId: goleador.jugadoraId,
        jugadoraNombre: goleador.jugadoraNombre || goleador.jugadora,
        tipo: partido.tipo,
        campo: 'goles',
        delta: -1
      });
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
  const jugadora = buscarJugadoraEquipo(partido, seleccionAsistente.value[partido.id]);
  const minuto = normalizarMinutoOpcional(minutoAsistente.value[partido.id]);

  if (!jugadora) return;

  const nombre = `${jugadora.nombre} ${jugadora.apellido}`.trim();

  guardando.value = true;
  try {
    const nuevoAsistencia = {
      asistente: nombre,
      asistenteId: jugadora.id,
      asistenteNombre: nombre,
      ...(minuto !== null ? { minuto } : {}),
      timestamp: new Date()
    };

    const docRef = doc(db, obtenerColeccionPartido(partido), partido.id);

    await updateDoc(docRef, {
      asistenciasLocal: arrayUnion(nuevoAsistencia)
    });

    await actualizarContadorEstadistica({
      equipo: partido.equipo,
      jugadoraId: jugadora.id,
      jugadoraNombre: nombre,
      tipo: partido.tipo,
      campo: 'asistencias',
      delta: 1
    });

    limpiarFormularioAsistencia(partido.id);
    
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
    const docRef = doc(db, obtenerColeccionPartido(partido), partido.id);
    const nuevoArray = asistencias.filter((_, i) => i !== indice);
    
    await updateDoc(docRef, {
      asistenciasLocal: nuevoArray
    });

    await actualizarContadorEstadistica({
      equipo: partido.equipo,
      jugadoraId: asistencia.asistenteId,
      jugadoraNombre: asistencia.asistenteNombre || asistencia.asistente,
      tipo: partido.tipo,
      campo: 'asistencias',
      delta: -1
    });
    
    mostrarMensaje('Asistencia eliminada ✓');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    guardando.value = false;
  }
};

const actualizarFasePartido = async (partido, nuevaFase) => {
  guardando.value = true;
  try {
    const docRef = doc(db, obtenerColeccionPartido(partido), partido.id);
    const ahoraPartido = new Date();
    const payload = {};

    if (nuevaFase === 'PRIMER_TIEMPO') {
      payload.estado = 'EN_CURSO';
      payload.fasePartido = 'PRIMER_TIEMPO';
      payload.inicioPrimerTiempoAt = ahoraPartido;
      payload.inicioEnVivoAt = ahoraPartido;
      payload.inicioSegundoTiempoAt = null;
      partido.estado = 'EN_CURSO';
      partido.fasePartido = 'PRIMER_TIEMPO';
      partido.inicioPrimerTiempoAt = ahoraPartido;
      partido.inicioEnVivoAt = ahoraPartido;
      partido.inicioSegundoTiempoAt = null;
    }

    if (nuevaFase === 'ENTRETIEMPO') {
      payload.estado = 'EN_CURSO';
      payload.fasePartido = 'ENTRETIEMPO';
      partido.estado = 'EN_CURSO';
      partido.fasePartido = 'ENTRETIEMPO';
    }

    if (nuevaFase === 'SEGUNDO_TIEMPO') {
      payload.estado = 'EN_CURSO';
      payload.fasePartido = 'SEGUNDO_TIEMPO';
      payload.inicioSegundoTiempoAt = ahoraPartido;
      partido.estado = 'EN_CURSO';
      partido.fasePartido = 'SEGUNDO_TIEMPO';
      partido.inicioSegundoTiempoAt = ahoraPartido;
    }

    if (nuevaFase === 'FINALIZADO') {
      payload.estado = 'FINALIZADO';
      payload.fasePartido = 'FINALIZADO';
      partido.estado = 'FINALIZADO';
      partido.fasePartido = 'FINALIZADO';
    }

    await updateDoc(docRef, payload);
    mostrarMensaje('Reloj del partido actualizado ✓');
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
    if (nuevoEstado === 'EN_CURSO') {
      await actualizarFasePartido(partido, 'PRIMER_TIEMPO');
      return;
    }

    const docRef = doc(db, obtenerColeccionPartido(partido), partido.id);
    const payload = { estado: nuevoEstado };

    if (nuevoEstado === 'PROGRAMADO') {
      payload.fasePartido = null;
      payload.inicioEnVivoAt = null;
      payload.inicioPrimerTiempoAt = null;
      payload.inicioSegundoTiempoAt = null;
      partido.fasePartido = null;
      partido.inicioEnVivoAt = null;
      partido.inicioPrimerTiempoAt = null;
      partido.inicioSegundoTiempoAt = null;
    }

    if (nuevoEstado === 'FINALIZADO') {
      payload.fasePartido = 'FINALIZADO';
      partido.fasePartido = 'FINALIZADO';
    }

    partido.estado = nuevoEstado;

    await updateDoc(docRef, payload);
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
    intervaloReloj = window.setInterval(() => {
      ahora.value = Date.now();
    }, 1000);

    const [ascenso, serieC] = await Promise.all([
      fetchJugadorasRegistradasPorEquipo('ascenso'),
      fetchJugadorasRegistradasPorEquipo('serieC')
    ]);

    plantelPorEquipo.value = { ascenso, serieC };
    
    // flags para controlar primera respuesta de cada escucha
    const cargado = { ascenso: false, serieC: false, entrenamientos: false };
    const chequearCarga = () => {
      if (cargado.ascenso && cargado.serieC && cargado.entrenamientos) {
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

    unsubscribeSerieC = escucharPartidos('serieC', null, (datos) => {
      cargado.serieC = true;
      chequearCarga();
      const partidosNuevos = datos.map(p => ({
        ...p,
        fuente: 'partidos'
      }));
      const entrenamientosPrevios = partidosSerieC.value.filter(p => p.fuente === 'entrenamientos');
      partidosSerieC.value = [...entrenamientosPrevios, ...partidosNuevos];
    });
    unsubscribers.push(unsubscribeSerieC);

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
          asistenciasLocal: data.asistenciasLocal || [],
          goleadoresVisita: data.goleadoresVisita || [],
          estado: data.estado || 'PROGRAMADO',
          inicioEnVivoAt: data.inicioEnVivoAt || null,
          inicioPrimerTiempoAt: data.inicioPrimerTiempoAt || null,
          inicioSegundoTiempoAt: data.inicioSegundoTiempoAt || null,
          fasePartido: data.fasePartido || null,
          fuente: 'entrenamientos' // Para identificar que viene de entrenamientos
        };
    
        return item;
      });

      // Separar por equipo
      const ascenso = entrenamientos.filter(e => e.equipo === 'ascenso' || e.equipo === 'ambos');
      const serieC = entrenamientos.filter(e => e.equipo === 'serieC');

      // Combinar con partidos existentes
      partidosAscenso.value = [
        ...ascenso,
        ...(partidosAscenso.value.filter(p => p.fuente === 'partidos') || [])
      ];

      partidosSerieC.value = [
        ...serieC,
        ...(partidosSerieC.value.filter(p => p.fuente === 'partidos') || [])
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
  if (intervaloReloj) {
    window.clearInterval(intervaloReloj);
  }

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
