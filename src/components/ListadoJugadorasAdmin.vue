<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Jugadoras</h2>
        <p class="text-sm text-gray-600">Listado por equipo (las de "Ambos" aparecen en los dos).</p>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          class="w-full sm:w-80 px-3 py-2 border rounded-lg text-sm"
        />
        <button
          @click="cargar"
          class="px-3 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200 cursor-pointer"
          :disabled="isLoading"
        >
          Refrescar
        </button>
      </div>
    </div>

    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      Cargando jugadoras...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Ascenso -->
      <section class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Ascenso</h3>
          <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">{{ ascensoFiltradas.length }}</span>
        </div>

        <div v-if="ascensoFiltradas.length === 0" class="p-6 text-sm text-gray-500">
          No hay jugadoras para mostrar.
        </div>

        <div v-else class="divide-y">
          <div v-for="j in ascensoFiltradas" :key="'ascenso-' + j.id" class="p-4 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="font-semibold text-gray-900 truncate">
                {{ j.apellido || '' }} {{ j.nombre || '' }}
              </div>
              <div class="text-xs text-gray-600 mt-0.5 truncate">
                {{ j.email || '-' }}
              </div>
              <div class="text-xs text-gray-600 mt-1">
                <span class="font-semibold">Posición:</span> {{ j.posicion || '-' }} · <span class="font-semibold">Dorsal:</span> {{ j.dorsal ?? '-' }}
              </div>
              <div class="mt-2">
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                  estadoClase(j.estadoSalud)
                ]">
                  {{ formatearEstadoSalud(j.estadoSalud) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="text-[11px] bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 font-semibold">Ascenso</span>
              <span v-if="Array.isArray(j.equipos) ? j.equipos.includes('escuela') : j.equipo === 'ambos'" class="text-[11px] bg-green-100 text-green-800 rounded-full px-2 py-0.5 font-semibold">Escuela</span>
              <span v-if="Array.isArray(j.equipos) ? j.equipos.includes('serieC') : false" class="text-[11px] bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 font-semibold">Serie C</span>
              <button
                @click="abrirEdicion(j)"
                class="mt-1 text-[11px] px-2.5 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition-colors flex items-center gap-1"
              >
                <span>✏️</span>
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Escuela -->
      <section class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Escuela</h3>
          <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">{{ escuelaFiltradas.length }}</span>
        </div>

        <div v-if="escuelaFiltradas.length === 0" class="p-6 text-sm text-gray-500">
          No hay jugadoras para mostrar.
        </div>

        <div v-else class="divide-y">
          <div v-for="j in escuelaFiltradas" :key="'escuela-' + j.id" class="p-4 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="font-semibold text-gray-900 truncate">
                {{ j.apellido || '' }} {{ j.nombre || '' }}
              </div>
              <div class="text-xs text-gray-600 mt-0.5 truncate">
                {{ j.email || '-' }}
              </div>
              <div class="text-xs text-gray-600 mt-1">
                <span class="font-semibold">Posición:</span> {{ j.posicion || '-' }} · <span class="font-semibold">Dorsal:</span> {{ j.dorsal ?? '-' }}
              </div>
              <div class="mt-2">
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                  estadoClase(j.estadoSalud)
                ]">
                  {{ formatearEstadoSalud(j.estadoSalud) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="text-[11px] bg-green-100 text-green-800 rounded-full px-2 py-0.5 font-semibold">Escuela</span>
              <span v-if="Array.isArray(j.equipos) ? j.equipos.includes('ascenso') : j.equipo === 'ambos'" class="text-[11px] bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 font-semibold">Ascenso</span>
              <span v-if="Array.isArray(j.equipos) ? j.equipos.includes('serieC') : false" class="text-[11px] bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 font-semibold">Serie C</span>
              <button
                @click="abrirEdicion(j)"
                class="mt-1 text-[11px] px-2.5 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-semibold transition-colors flex items-center gap-1"
              >
                <span>✏️</span>
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Serie C -->
      <section class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Serie C</h3>
          <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">{{ serieCFiltradas.length }}</span>
        </div>

        <div v-if="serieCFiltradas.length === 0" class="p-6 text-sm text-gray-500">
          No hay jugadoras para mostrar.
        </div>

        <div v-else class="divide-y">
          <div v-for="j in serieCFiltradas" :key="'serieC-' + j.id" class="p-4 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="font-semibold text-gray-900 truncate">
                {{ j.apellido || '' }} {{ j.nombre || '' }}
              </div>
              <div class="text-xs text-gray-600 mt-0.5 truncate">
                {{ j.email || '-' }}
              </div>
              <div class="text-xs text-gray-600 mt-1">
                <span class="font-semibold">Posición:</span> {{ j.posicion || '-' }} · <span class="font-semibold">Dorsal:</span> {{ j.dorsal ?? '-' }}
              </div>
              <div class="mt-2">
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                  estadoClase(j.estadoSalud)
                ]">
                  {{ formatearEstadoSalud(j.estadoSalud) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span class="text-[11px] bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 font-semibold">Serie C</span>
              <button
                @click="abrirEdicion(j)"
                class="mt-1 text-[11px] px-2.5 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold transition-colors flex items-center gap-1"
              >
                <span>✏️</span>
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal de edición -->
    <EditarJugadoraAdmin
      :jugadora="jugadoraAEditar"
      :visible="mostrarEdicion"
      @close="cerrarEdicion"
      @actualizado="onJugadoraActualizada"
      @eliminado="onJugadoraEliminada"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchJugadorasRegistradasPorEquipo } from '../firebase/jugadorasAuth';
import EditarJugadoraAdmin from './EditarJugadoraAdmin.vue';

const isLoading = ref(false);
const error = ref(null);
const busqueda = ref('');
const jugadoras = ref([]);
const jugadoraAEditar = ref(null);
const mostrarEdicion = ref(false);

const normalizar = (v) => (v || '').toString().trim().toLowerCase();

const cargar = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // "ambos" en esta función significa: traer todas
    jugadoras.value = await fetchJugadorasRegistradasPorEquipo('ambos');
  } catch (e) {
    error.value = e?.message || 'Error cargando jugadoras';
  } finally {
    isLoading.value = false;
  }
};

const termino = computed(() => normalizar(busqueda.value));

const filtrar = (lista) => {
  if (!termino.value) return lista;
  return lista.filter(j => {
    const haystack = [j.nombre, j.apellido, j.email].map(normalizar).join(' ');
    return haystack.includes(termino.value);
  });
};

const formatearEstadoSalud = (estado) => {
  const map = {
    disponible: 'Disponible',
    lesionada: 'Lesionada',
    recuperacion: 'En recuperación',
    no_disponible: 'No disponible'
  };
  return map[estado] || 'Disponible';
};

const estadoClase = (estado) => {
  if (estado === 'lesionada') return 'bg-red-100 text-red-700 border-red-200';
  if (estado === 'recuperacion') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (estado === 'no_disponible') return 'bg-gray-100 text-gray-700 border-gray-200';
  return 'bg-green-100 text-green-700 border-green-200';
};

const abrirEdicion = (jugadora) => {
  jugadoraAEditar.value = jugadora;
  mostrarEdicion.value = true;
};

const cerrarEdicion = () => {
  mostrarEdicion.value = false;
  jugadoraAEditar.value = null;
};

const onJugadoraActualizada = (jugadoraActualizada) => {
  // Actualizar en la lista local
  const index = jugadoras.value.findIndex(j => j.id === jugadoraActualizada.id);
  if (index !== -1) {
    jugadoras.value[index] = jugadoraActualizada;
  }
};

const onJugadoraEliminada = (jugadoraId) => {
  // Eliminar de la lista local
  jugadoras.value = jugadoras.value.filter(j => j.id !== jugadoraId);
};

const ordenar = (lista) => {
  return [...lista].sort((a, b) => {
    const apA = normalizar(a.apellido);
    const apB = normalizar(b.apellido);
    if (apA !== apB) return apA.localeCompare(apB, 'es');
    return normalizar(a.nombre).localeCompare(normalizar(b.nombre), 'es');
  });
};

// Función helper para verificar si una jugadora pertenece a un equipo
const pertenecePorEquipo = (jugadora, equipo) => {
  // Soportar formato nuevo: equipos como array
  if (Array.isArray(jugadora.equipos)) {
    return jugadora.equipos.includes(equipo);
  }
  // Soportar formato antiguo: equipo como string
  if (equipo === 'ascenso') {
    return jugadora.equipo === 'ascenso' || jugadora.equipo === 'ambos';
  } else if (equipo === 'escuela') {
    return jugadora.equipo === 'escuela' || jugadora.equipo === 'ambos';
  } else if (equipo === 'serieC') {
    return jugadora.equipo === 'serieC';
  }
  return false;
};

const ascenso = computed(() => ordenar(jugadoras.value.filter(j => pertenecePorEquipo(j, 'ascenso'))));
const escuela = computed(() => ordenar(jugadoras.value.filter(j => pertenecePorEquipo(j, 'escuela'))));
const serieC = computed(() => ordenar(jugadoras.value.filter(j => pertenecePorEquipo(j, 'serieC'))));

const ascensoFiltradas = computed(() => filtrar(ascenso.value));
const escuelaFiltradas = computed(() => filtrar(escuela.value));
const serieCFiltradas = computed(() => filtrar(serieC.value));

onMounted(cargar);
</script>
