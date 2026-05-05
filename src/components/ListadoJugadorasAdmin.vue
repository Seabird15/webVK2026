<template>
  <div class="space-y-6">
    <section class="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="min-w-0">
          <h2 class="text-2xl font-black text-slate-900">Jugadoras</h2>
          <p class="mt-1 text-sm text-slate-500">Vista compacta por equipo con detalle desplegable.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in tabsEquipo"
            :key="item.id"
            @click="equipoActivo = item.id"
            :class="[
              'min-h-11 rounded-full border px-4 py-2 text-sm font-black tracking-wide transition-all cursor-pointer',
              equipoActivo === item.id
                ? item.tabActiva
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
            ]"
          >
            {{ item.label }}
            <span class="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-slate-700">{{ item.total }}</span>
          </button>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="relative min-w-0 sm:w-80">
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por nombre, apellido o email"
              class="min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          </div>

          <button
            @click="cargar"
            class="min-h-11 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isLoading"
          >
            Refrescar
          </button>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span class="rounded-full bg-slate-100 px-3 py-1 font-semibold">{{ jugadorasFiltradasActivas.length }} visibles</span>
        <span class="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{{ jugadorasMultiEquipoActivas }} multi-equipo</span>
        <span class="rounded-full bg-slate-100 px-3 py-1 font-semibold">Ordenadas por apellido</span>
      </div>
    </section>

    <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {{ error }}
    </div>

    <div v-if="isLoading" class="rounded-[26px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div class="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
      <p class="mt-4 text-sm font-semibold text-slate-500">Cargando jugadoras...</p>
    </div>

    <section v-else class="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
      <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Vista actual</p>
          <h3 class="mt-1 text-2xl font-black text-slate-900">{{ tabActual.label }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ tabActual.descripcion }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
          <p class="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Total</p>
          <p class="mt-1 text-2xl font-black text-slate-900">{{ jugadorasFiltradasActivas.length }}</p>
        </div>
      </div>

      <div v-if="jugadorasFiltradasActivas.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
        <p class="text-base font-bold text-slate-700">No hay jugadoras para mostrar.</p>
        <p class="mt-2 text-sm text-slate-500">Prueba otro equipo o ajusta la busqueda.</p>
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="j in jugadorasFiltradasActivas"
          :key="`${equipoActivo}-${j.id}`"
          class="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
        >
          <div class="flex items-center gap-3 px-4 py-3 sm:px-5">
            <button
              type="button"
              @click="toggleExpandida(j.id)"
              class="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
            >
              <div :class="avatarClase(j)" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-md">
                {{ iniciales(j) }}
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h4 class="truncate text-sm font-black text-slate-900 sm:text-base">{{ nombreCompleto(j) }}</h4>
                  <span class="text-xs font-semibold text-slate-400">•</span>
                  <span class="text-xs font-semibold text-slate-600">{{ j.posicion || 'Sin posicion' }}</span>
                  <span class="text-xs font-semibold text-slate-400">•</span>
                  <span class="text-xs font-black text-slate-800">#{{ j.dorsal ?? '-' }}</span>
                </div>
                <p class="mt-1 truncate text-xs text-slate-500">{{ j.email || 'Sin email registrado' }}</p>
              </div>

              <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-600">
                {{ expandidaId === j.id ? 'Ocultar' : 'Ver' }}
              </span>
            </button>

            <button
              @click="abrirEdicion(j)"
              :class="['min-h-10 shrink-0 rounded-2xl px-3.5 py-2 text-xs font-black transition-colors cursor-pointer', tabActual.botonEditar]"
            >
              Editar
            </button>
          </div>

          <div v-if="expandidaId === j.id" class="border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Posicion</p>
                <p class="mt-1 text-sm font-semibold text-slate-700">{{ j.posicion || '-' }}</p>
              </div>
              <div class="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Dorsal</p>
                <p class="mt-1 text-sm font-semibold text-slate-700">{{ j.dorsal ?? '-' }}</p>
              </div>
              <div class="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Estado</p>
                <div class="mt-1">
                  <span :class="['inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide', estadoClase(j.estadoSalud)]">
                    {{ formatearEstadoSalud(j.estadoSalud) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="team in chipsEquipos(j)"
                  :key="`${j.id}-${team.id}`"
                  :class="team.clase"
                  class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide"
                >
                  {{ team.label }}
                </span>
            </div>
          </div>
        </article>
      </div>
    </section>

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
const equipoActivo = ref('ascenso');
const expandidaId = ref(null);

const tabsEquipo = [
  {
    id: 'ascenso',
    label: 'Ascenso',
    descripcion: 'Plantel principal y jugadoras compartidas con otros equipos.',
    tabActiva: 'border-sky-200 bg-sky-50 text-sky-800',
    botonEditar: 'bg-sky-600 text-white hover:bg-sky-700'
  },
  {
    id: 'escuela',
    label: 'Escuela',
    descripcion: 'Base formativa y seguimiento de jugadoras en desarrollo.',
    tabActiva: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    botonEditar: 'bg-emerald-600 text-white hover:bg-emerald-700'
  },
  {
    id: 'serieC',
    label: 'Serie C',
    descripcion: 'Plantel competitivo de Serie C con acceso directo a edicion.',
    tabActiva: 'border-violet-200 bg-violet-50 text-violet-800',
    botonEditar: 'bg-violet-600 text-white hover:bg-violet-700'
  }
];

const clasesEquipo = {
  ascenso: 'bg-sky-100 text-sky-800',
  escuela: 'bg-emerald-100 text-emerald-800',
  serieC: 'bg-violet-100 text-violet-800'
};

const avatarEquipo = {
  ascenso: 'bg-linear-to-br from-sky-500 to-sky-700',
  escuela: 'bg-linear-to-br from-emerald-500 to-emerald-700',
  serieC: 'bg-linear-to-br from-violet-500 to-violet-700'
};

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
    vacaciones: 'De vacaciones',
    no_disponible: 'No disponible'
  };
  return map[estado] || 'Disponible';
};

const nombreCompleto = (jugadora) => `${jugadora.apellido || ''} ${jugadora.nombre || ''}`.trim();

const iniciales = (jugadora) => {
  const nombre = nombreCompleto(jugadora);
  if (!nombre) return 'JV';
  const partes = nombre.split(' ').filter(Boolean);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
};

const estadoClase = (estado) => {
  if (estado === 'lesionada') return 'bg-red-100 text-red-700 border-red-200';
  if (estado === 'recuperacion') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (estado === 'vacaciones') return 'bg-sky-100 text-sky-700 border-sky-200';
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

const listadosPorEquipo = computed(() => ({
  ascenso: ascensoFiltradas.value,
  escuela: escuelaFiltradas.value,
  serieC: serieCFiltradas.value
}));

const jugadorasFiltradasActivas = computed(() => listadosPorEquipo.value[equipoActivo.value] || []);

const tabActual = computed(() => tabsEquipo.find((tab) => tab.id === equipoActivo.value) || tabsEquipo[0]);

const jugadorasMultiEquipoActivas = computed(() => {
  return jugadorasFiltradasActivas.value.filter((jugadora) => {
    if (Array.isArray(jugadora.equipos)) {
      return jugadora.equipos.length > 1;
    }
    return jugadora.equipo === 'ambos';
  }).length;
});

const chipsEquipos = (jugadora) => {
  const equipos = [];

  if (pertenecePorEquipo(jugadora, 'ascenso')) {
    equipos.push({ id: 'ascenso', label: 'Ascenso', clase: clasesEquipo.ascenso });
  }
  if (pertenecePorEquipo(jugadora, 'escuela')) {
    equipos.push({ id: 'escuela', label: 'Escuela', clase: clasesEquipo.escuela });
  }
  if (pertenecePorEquipo(jugadora, 'serieC')) {
    equipos.push({ id: 'serieC', label: 'Serie C', clase: clasesEquipo.serieC });
  }

  return equipos;
};

const avatarClase = (jugadora) => {
  if (pertenecePorEquipo(jugadora, equipoActivo.value)) {
    return avatarEquipo[equipoActivo.value];
  }

  return 'bg-linear-to-br from-slate-500 to-slate-700';
};

const toggleExpandida = (jugadoraId) => {
  expandidaId.value = expandidaId.value === jugadoraId ? null : jugadoraId;
};

onMounted(cargar);
</script>
