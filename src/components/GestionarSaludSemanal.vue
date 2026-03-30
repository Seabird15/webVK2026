<template>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    <div class="bg-linear-to-r from-primary-dark via-primary to-primary-dark p-6 sm:p-8 text-white">
      <h2 class="text-2xl sm:text-3xl font-black">Salud semanal</h2>
      <p class="text-xs sm:text-sm text-white/80 mt-1">Chequeo semanal de dolor, fatiga, sueño y contexto de ciclo menstrual</p>
    </div>

    <div class="p-6 space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-red-50 border border-red-200 rounded-xl p-4">
          <p class="text-xs font-bold uppercase text-red-600">Nuevas sin ver</p>
          <p class="text-2xl font-black text-red-700 mt-1">{{ nuevasSinVer }}</p>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p class="text-xs font-bold uppercase text-amber-600">Pendientes revisión</p>
          <p class="text-2xl font-black text-amber-700 mt-1">{{ pendientesRevision }}</p>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p class="text-xs font-bold uppercase text-blue-600">Total respuestas</p>
          <p class="text-2xl font-black text-blue-700 mt-1">{{ respuestas.length }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          @click="filtro = 'todas'"
          class="px-3 py-2 rounded-lg text-sm font-bold border cursor-pointer"
          :class="filtro === 'todas' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'"
        >Todas</button>
        <button
          @click="filtro = 'nuevas'"
          class="px-3 py-2 rounded-lg text-sm font-bold border cursor-pointer"
          :class="filtro === 'nuevas' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'"
        >Nuevas</button>
        <button
          @click="filtro = 'pendientes'"
          class="px-3 py-2 rounded-lg text-sm font-bold border cursor-pointer"
          :class="filtro === 'pendientes' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'"
        >Pendientes revisión</button>
      </div>

   
      <div v-if="respuestasFiltradas.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 class="text-base font-black text-gray-900">Indicadores del grupo</h3>
              <p class="text-sm text-gray-500">Resumen rápido sobre las respuestas visibles</p>
            </div>
            <div class="text-sm font-bold text-gray-500">{{ respuestasFiltradas.length }} respuestas</div>
          </div>

          <div class="space-y-4">
            <div v-for="item in barrasResumen" :key="item.id">
              <div class="flex items-center justify-between gap-3 text-sm mb-1.5">
                <span class="font-semibold text-gray-700">{{ item.label }}</span>
                <span class="font-black" :class="item.textClass">{{ item.valor }} · {{ porcentaje(item.valor) }}</span>
              </div>
              <div class="h-3 rounded-full bg-white border border-gray-200 overflow-hidden">
                <div class="h-full rounded-full transition-all" :class="item.barClass" :style="{ width: anchoBarra(item.valor) }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-5">
          <div class="mb-4">
            <h3 class="text-base font-black text-gray-900">Promedios semanales</h3>
            <p class="text-sm text-gray-500">Lectura general del estado del plantel visible</p>
          </div>

          <div class="space-y-4">
            <div v-for="item in barrasPromedio" :key="item.id">
              <div class="flex items-center justify-between gap-3 text-sm mb-1.5">
                <span class="font-semibold text-gray-700">{{ item.label }}</span>
                <span class="font-black" :class="item.textClass">{{ item.valor }}/5</span>
              </div>
              <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full rounded-full transition-all" :class="item.barClass" :style="{ width: `${(item.valor / 5) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="respuestasFiltradas.length === 0" class="p-10 rounded-xl border border-gray-200 bg-gray-50 text-center text-gray-500 font-semibold">
        No hay respuestas para mostrar.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in respuestasFiltradas"
          :key="item.id"
          class="rounded-xl border border-gray-200 p-4 bg-white"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <p class="font-black text-gray-900">{{ item.jugadoraNombre }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ item.equipo || 'sin equipo' }} · {{ item.semanaClave }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="text-xs font-bold px-2 py-1 rounded-full" :class="item.riesgo === 'alto' ? 'bg-red-100 text-red-700' : item.riesgo === 'medio' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'">
                Riesgo {{ item.riesgo || 'bajo' }}
              </span>
              <span v-if="item.notificadaAdmin !== true" class="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">Nueva</span>
              <span v-if="item.revisada === true" class="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">Revisada</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
            <p><strong>Dolor:</strong> {{ item.dolor }}/5</p>
            <p><strong>Fatiga:</strong> {{ item.fatiga }}/5</p>
            <p><strong>Sueño:</strong> {{ item.sueno }}/5</p>
          </div>

          <p class="text-sm text-gray-600 mt-2"><strong>Respondido:</strong> {{ formatearFechaRespuesta(item.fechaRespuesta || item.updatedAt || item.createdAt) }}</p>

          <p class="text-sm text-gray-600 mt-2"><strong>Período esta semana:</strong> {{ item.enPeriodo === true ? 'Sí' : item.enPeriodo === false ? 'No' : 'Sin informar' }}</p>

          <p v-if="item.comentarios" class="text-sm text-gray-600 mt-2"><strong>Comentario:</strong> {{ item.comentarios }}</p>

          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-if="item.notificadaAdmin !== true"
              @click="marcarVista(item.id)"
              class="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold cursor-pointer"
            >Marcar vista</button>
            <button
              @click="toggleRevisada(item)"
              class="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
            >{{ item.revisada === true ? 'Quitar revisada' : 'Marcar revisada' }}</button>
          </div>
        </div>
      </div>

      <div class="pt-2">
        <button
          @click="marcarTodasVistas"
          class="px-4 py-2 rounded-xl bg-gray-800 text-white text-sm font-bold cursor-pointer"
        >Marcar todas las notificaciones como vistas</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  escucharRespuestasSaludSemanal,
  marcarNotificacionSaludVista,
  marcarRespuestaSaludRevisada,
  marcarTodasNotificacionesSaludVistas
} from '../firebase/saludSemanal';

const respuestas = ref([]);
const filtro = ref('todas');
let unsubscribe = null;

const nuevasSinVer = computed(() => respuestas.value.filter((item) => item.notificadaAdmin !== true).length);
const pendientesRevision = computed(() => respuestas.value.filter((item) => item.revisada !== true).length);

const respuestasFiltradas = computed(() => {
  if (filtro.value === 'nuevas') return respuestas.value.filter((item) => item.notificadaAdmin !== true);
  if (filtro.value === 'pendientes') return respuestas.value.filter((item) => item.revisada !== true);
  return respuestas.value;
});

const promedio = (valores = []) => {
  if (valores.length === 0) return 0;
  const suma = valores.reduce((acc, valor) => acc + Number(valor || 0), 0);
  return Number((suma / valores.length).toFixed(1));
};

const indicadores = computed(() => {
  const items = respuestasFiltradas.value;
  return {
    fatigaAlta: items.filter((item) => Number(item.fatiga) >= 4).length,
    dolorAlto: items.filter((item) => Number(item.dolor) >= 4).length,
    enPeriodo: items.filter((item) => item.enPeriodo === true).length,
    riesgoAlto: items.filter((item) => item.riesgo === 'alto').length,
    suenoBajo: items.filter((item) => Number(item.sueno) <= 2).length,
    riesgoMedioAlto: items.filter((item) => item.riesgo === 'alto' || item.riesgo === 'medio').length
  };
});

const barrasResumen = computed(() => ([
  {
    id: 'fatiga-alta',
    label: 'Fatiga alta',
    valor: indicadores.value.fatigaAlta,
    barClass: 'bg-rose-500',
    textClass: 'text-rose-700'
  },
  {
    id: 'dolor-alto',
    label: 'Dolor alto / lesionadas',
    valor: indicadores.value.dolorAlto,
    barClass: 'bg-red-500',
    textClass: 'text-red-700'
  },
  {
    id: 'en-periodo',
    label: 'En período',
    valor: indicadores.value.enPeriodo,
    barClass: 'bg-violet-500',
    textClass: 'text-violet-700'
  },
  {
    id: 'sueno-bajo',
    label: 'Sueño bajo',
    valor: indicadores.value.suenoBajo,
    barClass: 'bg-slate-500',
    textClass: 'text-slate-700'
  },
  {
    id: 'riesgo-medio-alto',
    label: 'Riesgo medio o alto',
    valor: indicadores.value.riesgoMedioAlto,
    barClass: 'bg-amber-500',
    textClass: 'text-amber-700'
  }
]));

const barrasPromedio = computed(() => {
  const items = respuestasFiltradas.value;
  return [
    {
      id: 'promedio-dolor',
      label: 'Dolor promedio',
      valor: promedio(items.map((item) => item.dolor)),
      barClass: 'bg-red-500',
      textClass: 'text-red-700'
    },
    {
      id: 'promedio-fatiga',
      label: 'Fatiga promedio',
      valor: promedio(items.map((item) => item.fatiga)),
      barClass: 'bg-rose-500',
      textClass: 'text-rose-700'
    },
    {
      id: 'promedio-sueno',
      label: 'Sueño promedio',
      valor: promedio(items.map((item) => item.sueno)),
      barClass: 'bg-blue-500',
      textClass: 'text-blue-700'
    }
  ];
});

const porcentaje = (valor) => {
  const total = respuestasFiltradas.value.length;
  if (!total) return '0%';
  return `${Math.round((Number(valor || 0) / total) * 100)}%`;
};

const anchoBarra = (valor) => {
  const total = respuestasFiltradas.value.length;
  if (!total) return '0%';
  return `${(Number(valor || 0) / total) * 100}%`;
};

const formatearFechaRespuesta = (valor) => {
  if (!valor) return 'Sin fecha';

  const fecha = valor?.seconds
    ? new Date(valor.seconds * 1000)
    : new Date(valor);

  if (Number.isNaN(fecha.getTime())) return 'Sin fecha';

  return fecha.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const cargar = () => {
  unsubscribe = escucharRespuestasSaludSemanal((items) => {
    respuestas.value = [...items].sort((a, b) => {
      const aMs = a?.fechaRespuesta?.seconds || a?.updatedAt?.seconds || a?.createdAt?.seconds || 0;
      const bMs = b?.fechaRespuesta?.seconds || b?.updatedAt?.seconds || b?.createdAt?.seconds || 0;
      return bMs - aMs;
    });
  });
};

const marcarVista = async (id) => {
  await marcarNotificacionSaludVista(id);
};

const toggleRevisada = async (item) => {
  await marcarRespuestaSaludRevisada(item.id, item.revisada !== true);
};

const marcarTodasVistas = async () => {
  await marcarTodasNotificacionesSaludVistas();
};

onMounted(cargar);
onUnmounted(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
});
</script>
