<template>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    <div class="bg-linear-to-r from-primary-dark via-primary to-primary-dark p-6 sm:p-8 text-white">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <ChartBarIcon class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl font-black">Ranking de asistencia</h2>
          <p class="text-xs sm:text-sm text-white/80 mt-1">Solo entrenamientos/eventos finalizados</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p class="text-xs text-blue-600 font-bold uppercase">Jugadoras en ranking</p>
          <p class="text-2xl font-black text-blue-700 mt-1">{{ rankingFiltrado.length }}</p>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-xl p-4">
          <p class="text-xs text-green-600 font-bold uppercase">Entrenamientos y partidos considerados</p>
          <p class="text-2xl font-black text-green-700 mt-1">{{ totalEventosFinalizadosFiltrados }}</p>
        </div>
        <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p class="text-xs text-purple-600 font-bold uppercase">Respuestas totales</p>
          <p class="text-2xl font-black text-purple-700 mt-1">{{ totalRespuestasFiltradas }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="equipo in equiposFiltro"
          :key="equipo.id"
          @click="equipoSeleccionado = equipo.id"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-bold border transition-colors cursor-pointer',
            equipoSeleccionado === equipo.id
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary/40 hover:text-primary'
          ]"
        >
          {{ equipo.label }} ({{ conteoPorEquipo[equipo.id] || 0 }})
        </button>
      </div>

      <div v-if="isLoading" class="py-14 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p class="text-gray-500 mt-3">Calculando ranking...</p>
      </div>

      <div v-else-if="rankingFiltrado.length === 0" class="py-14 text-center bg-gray-50 rounded-xl border border-gray-200">
        <p class="text-gray-500 font-semibold">No hay datos suficientes para mostrar ranking.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left border-b border-gray-200 text-gray-600">
              <th class="py-3 pr-4 font-black">#</th>
              <th class="py-3 pr-4 font-black">Jugadora</th>
              <th class="py-3 pr-4 font-black">Equipo</th>
              <th class="py-3 pr-4 font-black">Asistencia</th>
              <th class="py-3 pr-4 font-black">Confirmadas</th>
              <th class="py-3 pr-4 font-black">Bajas</th>
              <th class="py-3 pr-4 font-black">Pendientes</th>
              <th class="py-3 pr-4 font-black">Respuestas</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in rankingFiltrado"
              :key="`${equipoSeleccionado}-${item.jugadoraId}-${item.equipo}`"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-3 pr-4 font-black text-gray-700">{{ index + 1 }}</td>
              <td class="py-3 pr-4 font-semibold text-gray-900">{{ item.nombre }}</td>
              <td class="py-3 pr-4 text-gray-700 capitalize">{{ item.equipo }}</td>
              <td class="py-3 pr-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-black">
                  {{ item.porcentaje }}%
                </span>
              </td>
              <td class="py-3 pr-4 font-semibold text-green-700">{{ item.confirmadas }}</td>
              <td class="py-3 pr-4 font-semibold text-red-700">{{ item.bajas }}</td>
              <td class="py-3 pr-4 font-semibold text-amber-700">{{ item.pendientes }}</td>
              <td class="py-3 pr-4 text-gray-700">{{ item.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { ChartBarIcon } from '@heroicons/vue/24/outline';
import { db } from '../firebase/config';

const isLoading = ref(true);
const rankingPorEquipo = ref({
  todos: [],
  ascenso: [],
  escuela: []
});
const eventosFinalizadosPorEquipo = ref({
  todos: 0,
  ascenso: 0,
  escuela: 0
});
const equipoSeleccionado = ref('todos');

const equiposFiltro = [
  { id: 'todos', label: 'Todos' },
  { id: 'ascenso', label: 'Ascenso' },
  { id: 'escuela', label: 'Escuela' }
];

const normalizarEquipo = (equipo) => {
  const valor = (equipo || '').toString().trim().toLowerCase();
  if (valor === 'ascenso' || valor === 'escuela' || valor === 'ambos') return valor;
  return 'sin-equipo';
};

const normalizarNombre = (nombre) =>
  (nombre || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const nombresExcluidos = new Set([
  'yesi gallardo'
]);

const rankingFiltrado = computed(() => {
  return rankingPorEquipo.value[equipoSeleccionado.value] || [];
});

const totalRespuestasFiltradas = computed(() => rankingFiltrado.value.reduce((acc, item) => acc + item.total, 0));

const totalEventosFinalizadosFiltrados = computed(() => {
  return eventosFinalizadosPorEquipo.value[equipoSeleccionado.value] || 0;
});

const conteoPorEquipo = computed(() => {
  return {
    todos: rankingPorEquipo.value.todos.length,
    ascenso: rankingPorEquipo.value.ascenso.length,
    escuela: rankingPorEquipo.value.escuela.length
  };
});

const parseFechaBase = (fecha) => {
  if (!fecha) return null;
  if (fecha?.seconds) return new Date(fecha.seconds * 1000);
  if (fecha instanceof Date) return fecha;

  if (typeof fecha === 'string') {
    const soloFecha = fecha.split('T')[0];
    const partes = soloFecha.split('-').map(Number);
    if (partes.length === 3 && partes.every(n => Number.isFinite(n))) {
      const [anio, mes, dia] = partes;
      return new Date(anio, mes - 1, dia);
    }
  }

  const d = new Date(fecha);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getFechaHoraMs = (ent) => {
  const base = parseFechaBase(ent?.fecha);
  if (!base) return null;
  const dt = new Date(base);
  if (typeof ent?.hora === 'string' && ent.hora.includes(':')) {
    const [hh, mm] = ent.hora.split(':').map(Number);
    dt.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0);
  } else {
    dt.setHours(0, 0, 0, 0);
  }
  return dt.getTime();
};

const cargarRanking = async () => {
  isLoading.value = true;
  try {
    const [entrenamientosSnap, inscripcionesSnap, jugadorasSnap] = await Promise.all([
      getDocs(collection(db, 'entrenamientos')),
      getDocs(collection(db, 'inscripcionesEntrenamientos')),
      getDocs(collection(db, 'jugadoraRegistro'))
    ]);

    const equipoPorJugadoraId = new Map();
    jugadorasSnap.forEach((documento) => {
      const data = documento.data() || {};
      const equipo = normalizarEquipo(data.equipo);
      equipoPorJugadoraId.set(documento.id, equipo);

      const uid = (data.uid || '').toString().trim();
      if (uid) equipoPorJugadoraId.set(uid, equipo);
    });

    const now = Date.now();
    const entrenamientosFinalizados = entrenamientosSnap.docs
      .map((documento) => ({ id: documento.id, ...documento.data() }))
      .filter((ent) => {
        const ms = getFechaHoraMs(ent);
        return ms != null && ms < now;
      });

    const idsFinalizadosPorEquipo = {
      ascenso: new Set(),
      escuela: new Set()
    };

    entrenamientosFinalizados.forEach((ent) => {
      const equipoEntrenamiento = normalizarEquipo(ent?.equipo);
      if (equipoEntrenamiento === 'ascenso' || equipoEntrenamiento === 'escuela') {
        idsFinalizadosPorEquipo[equipoEntrenamiento].add(ent.id);
      }
    });

    eventosFinalizadosPorEquipo.value = {
      ascenso: idsFinalizadosPorEquipo.ascenso.size,
      escuela: idsFinalizadosPorEquipo.escuela.size,
      todos: idsFinalizadosPorEquipo.ascenso.size + idsFinalizadosPorEquipo.escuela.size
    };

    const acumuladoPorEquipo = {
      ascenso: new Map(),
      escuela: new Map()
    };

    const registrarInscripcion = (acumulado, jugadoraId, data, equipoJugadora) => {
      if (!acumulado.has(jugadoraId)) {
        acumulado.set(jugadoraId, {
          jugadoraId,
          nombre: (data.jugadoraNombre || 'Sin nombre').toString().trim() || 'Sin nombre',
          equipo: equipoJugadora,
          confirmadas: 0,
          bajas: 0,
          pendientes: 0,
          total: 0,
          porcentaje: 0
        });
      }

      const item = acumulado.get(jugadoraId);
      const estado = (data.estado || 'pendiente').toString().toLowerCase();

      if (estado === 'confirmada') item.confirmadas += 1;
      else if (estado === 'baja') item.bajas += 1;
      else item.pendientes += 1;

      item.total += 1;
      if (data.jugadoraNombre && (!item.nombre || item.nombre === 'Sin nombre')) {
        item.nombre = data.jugadoraNombre;
      }
    };

    inscripcionesSnap.forEach((documento) => {
      const data = documento.data();

      const jugadoraId = (data.jugadoraId || '').toString().trim();
      if (!jugadoraId) return;

      const nombreNormalizado = normalizarNombre(data.jugadoraNombre || '');
      if (nombresExcluidos.has(nombreNormalizado)) return;

      const equipoJugadora = equipoPorJugadoraId.get(jugadoraId) || 'sin-equipo';
      if (equipoJugadora !== 'ascenso' && equipoJugadora !== 'escuela' && equipoJugadora !== 'ambos') return;

      const esEventoAscenso = idsFinalizadosPorEquipo.ascenso.has(data.entrenamientoId);
      const esEventoEscuela = idsFinalizadosPorEquipo.escuela.has(data.entrenamientoId);

      if (esEventoAscenso && (equipoJugadora === 'ascenso' || equipoJugadora === 'ambos')) {
        registrarInscripcion(acumuladoPorEquipo.ascenso, jugadoraId, data, equipoJugadora);
      }

      if (esEventoEscuela && (equipoJugadora === 'escuela' || equipoJugadora === 'ambos')) {
        registrarInscripcion(acumuladoPorEquipo.escuela, jugadoraId, data, equipoJugadora);
      }
    });

    const ordenarLista = (listaBase) => {
      return listaBase
        .map((item) => ({
          ...item,
          porcentaje: item.total > 0 ? Math.round((item.confirmadas / item.total) * 100) : 0
        }))
        .sort((a, b) => {
          if (b.confirmadas !== a.confirmadas) return b.confirmadas - a.confirmadas;
          if (b.porcentaje !== a.porcentaje) return b.porcentaje - a.porcentaje;
          if (a.bajas !== b.bajas) return a.bajas - b.bajas;
          return a.nombre.localeCompare(b.nombre, 'es');
        });
    };

    const rankingAscenso = ordenarLista(Array.from(acumuladoPorEquipo.ascenso.values()));
    const rankingEscuela = ordenarLista(Array.from(acumuladoPorEquipo.escuela.values()));

    const acumuladoTodos = new Map();
    [...rankingAscenso, ...rankingEscuela].forEach((item) => {
      const existente = acumuladoTodos.get(item.jugadoraId);
      if (!existente) {
        acumuladoTodos.set(item.jugadoraId, {
          jugadoraId: item.jugadoraId,
          nombre: item.nombre,
          equipo: item.equipo,
          confirmadas: item.confirmadas,
          bajas: item.bajas,
          pendientes: item.pendientes,
          total: item.total,
          porcentaje: 0
        });
        return;
      }

      existente.confirmadas += item.confirmadas;
      existente.bajas += item.bajas;
      existente.pendientes += item.pendientes;
      existente.total += item.total;

      if (existente.equipo !== item.equipo) {
        existente.equipo = 'ambos';
      }
    });

    rankingPorEquipo.value = {
      ascenso: rankingAscenso,
      escuela: rankingEscuela,
      todos: ordenarLista(Array.from(acumuladoTodos.values()))
    };
  } finally {
    isLoading.value = false;
  }
};

onMounted(cargarRanking);
</script>
