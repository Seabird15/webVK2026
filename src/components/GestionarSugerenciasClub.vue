<template>
  <section class="space-y-5">
    <div class="rounded-2xl bg-linear-to-r from-primary-dark to-primary p-6 text-white shadow-xl sm:p-8">
      <p class="text-xs font-black uppercase tracking-[0.24em] text-white/70">Club</p>
      <h2 class="mt-2 text-2xl font-black sm:text-3xl">Sugerencias de jugadoras</h2>
      <p class="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
        Revisa mensajes abiertos, marca lo que ya se leyó y elimina los que no correspondan.
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="filtro in filtros"
        :key="filtro.id"
        type="button"
        class="rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition"
        :class="filtroActivo === filtro.id
          ? 'border-primary bg-primary text-white'
          : 'border-gray-200 bg-white text-gray-500 hover:border-primary hover:text-primary'"
        @click="filtroActivo = filtro.id"
      >
        {{ filtro.label }} <span class="ml-1 opacity-70">{{ contar(filtro.id) }}</span>
      </button>
    </div>

    <div v-if="cargando" class="rounded-2xl bg-white p-12 text-center font-semibold text-gray-500 shadow-xl">
      Cargando sugerencias...
    </div>
    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center font-semibold text-red-700">
      No se pudieron cargar las sugerencias del club.
    </div>
    <div v-else-if="sugerenciasVisibles.length === 0" class="rounded-2xl bg-white p-12 text-center shadow-xl">
      <p class="text-lg font-black text-gray-800">No hay sugerencias en esta vista</p>
      <p class="mt-2 text-sm text-gray-500">Las nuevas ideas de las jugadoras aparecerán aquí automáticamente.</p>
    </div>

    <div v-else class="grid gap-5 xl:grid-cols-2">
      <article v-for="sugerencia in sugerenciasVisibles" :key="sugerencia.id" class="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-black text-gray-900">
              {{ sugerencia.nombre || 'Jugadora' }} {{ sugerencia.apellido || '' }}
            </h3>
            <p class="mt-1 text-xs font-black uppercase tracking-[0.16em] text-primary">{{ sugerencia.equipo || 'Club' }}</p>
          </div>
          <span class="rounded-full px-3 py-1 text-[11px] font-black uppercase" :class="claseEstado(sugerencia.estado)">
            {{ etiquetaEstado(sugerencia.estado) }}
          </span>
        </div>

        <div class="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {{ sugerencia.mensaje }}
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <time class="text-xs font-semibold text-gray-400">{{ formatearFecha(sugerencia.createdAt) }}</time>

          <div class="flex items-center gap-2">
            <select v-model="sugerencia.estado" class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700" @change="guardarEstado(sugerencia)">
              <option value="pendiente">Pendiente</option>
              <option value="visto">Visto</option>
            </select>

            <button
              type="button"
              @click="borrarSugerencia(sugerencia.id)"
              class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-100"
            >
              Borrar
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  actualizarEstadoSugerenciaClub,
  eliminarSugerenciaClub,
  escucharSugerenciasClub
} from '../firebase/sugerenciasClub';

const sugerencias = ref([]);
const cargando = ref(true);
const error = ref(false);
const filtroActivo = ref('todos');
let unsubscribe = null;

const filtros = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'visto', label: 'Vistos' }
];

const sugerenciasVisibles = computed(() => filtroActivo.value === 'todos'
  ? sugerencias.value
  : sugerencias.value.filter((sugerencia) => sugerencia.estado === filtroActivo.value));

const contar = (estado) => estado === 'todos' ? sugerencias.value.length : sugerencias.value.filter((sugerencia) => sugerencia.estado === estado).length;
const etiquetaEstado = (estado) => ({ pendiente: 'Pendiente', visto: 'Visto' }[estado] || estado);
const claseEstado = (estado) => ({ pendiente: 'bg-amber-100 text-amber-800', visto: 'bg-emerald-100 text-emerald-800' }[estado] || 'bg-gray-100 text-gray-600');

const formatearFecha = (valor) => {
  const fecha = typeof valor?.toDate === 'function' ? valor.toDate() : new Date(valor);
  return Number.isNaN(fecha.getTime()) ? 'Fecha no disponible' : fecha.toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
};

const guardarEstado = async (sugerencia) => {
  try {
    await actualizarEstadoSugerenciaClub(sugerencia.id, sugerencia.estado);
  } catch (err) {
    console.error('Error actualizando sugerencia del club:', err);
    alert('No se pudo actualizar el estado.');
  }
};

const borrarSugerencia = async (id) => {
  const confirmar = window.confirm('¿Querés borrar esta sugerencia?');
  if (!confirmar) return;

  try {
    await eliminarSugerenciaClub(id);
  } catch (err) {
    console.error('Error borrando sugerencia del club:', err);
    alert('No se pudo borrar la sugerencia.');
  }
};

onMounted(() => {
  unsubscribe = escucharSugerenciasClub((datos) => {
    sugerencias.value = datos;
    cargando.value = false;
  }, () => {
    error.value = true;
    cargando.value = false;
  });
});

onUnmounted(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
});
</script>
