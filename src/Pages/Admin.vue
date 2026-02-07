<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-linear-to-b from-primary-dark to-transparent text-white p-6">
      <div class="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">Panel de Administración</h1>
          <p class="text-sm text-black mt-1">{{ userGreeting }}</p>
        </div>
        <button
          @click="handleLogout"
          class="bg-primary-dark hover:bg-opacity-90 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Contenido -->
    <div class="w-full mx-auto ">
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="flex border-b border-gray-200 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 font-bold uppercase text-sm transition-colors whitespace-nowrap cursor-pointer',
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Contenido de Tabs -->
      <div class="bg-white rounded-lg shadow p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Main -->
        <div class="lg:col-span-2">
        <!-- Solicitudes de Registro -->
        <div v-if="activeTab === 'solicitudes'">
          <GestionarSolicitudesRegistro />
        </div>

        <!-- Slider Home -->
        <div v-if="activeTab === 'slider'">
          <GestionarSliderHome />
        </div>

        <!-- Equipo -->
        <div v-if="activeTab === 'equipo'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestionar Equipos</h2>
          <p class="text-gray-600">En proceso.....</p>
          <!-- Las funcionalidades de edición irán aquí -->
        </div>

        <!-- Jugadoras -->
        <div v-if="activeTab === 'jugadoras'">
          <ListadoJugadorasAdmin />
        </div>

        <!-- Entrenamientos -->
        <div v-if="activeTab === 'entrenamientos'">
          <GestionarEntrenamientos />
        </div>

        <!-- Historial -->
        <div v-if="activeTab === 'historial'">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-1">Historial de entrenamientos</h2>
                <p class="text-sm text-gray-600">Entrenamientos finalizados</p>
              </div>
             
            </div>

            <div v-if="historialFiltrado.length === 0" class="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
              No hay items en el historial
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="ent in historialFiltrado" :key="ent.id" class="bg-white rounded-lg p-4 border hover:shadow-lg transition">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-sm text-gray-900">{{ ent.nombre }}</h3>
                    <div class="text-xs text-gray-600">{{ formatearFecha(ent.fecha) }} • {{ ent.hora }}</div>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-[11px] bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">{{ ent.equipo }}</span>
                      <span v-if="ent.esConvocatoria" class="text-[11px] bg-purple-100 text-purple-800 rounded-full px-2 py-0.5">Convocatoria</span>
                    </div>
                  </div>
                  <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1">Finalizado</span>
                </div>
                <p class="text-xs text-gray-700 mb-3 line-clamp-3">{{ ent.descripcion }}</p>
                <div class="flex gap-2 flex-wrap">
                  <button @click="verDetalles(ent)" class="flex-1 min-w-[80px] px-3 py-2 text-xs bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 font-bold transition-colors">
                    ✏️ Editar Asistencia
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista Jugadoras -->
        <!-- <div v-if="activeTab === 'vista-jugadoras'">
          <VistaJugadorasAdmin />
        </div> -->

        <!-- Galería -->
        <div v-if="activeTab === 'galeria'">
          <GestionarGalerias />
        </div>

        <!-- Eventos Especiales -->
        <div v-if="activeTab === 'eventos-especiales'">
          <GestionarEventosEspeciales />
        </div>

        <!-- Estadísticas -->
        <div v-if="activeTab === 'estadisticas'">
          <GestionarEstadisticas />
        </div>

        <!-- Configuración -->
        <!-- <div v-if="activeTab === 'configuracion'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
          <p class="text-gray-600">Aquí puedes configurar parámetros generales del sitio</p>
        </div> -->

        </div>

     
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { logout, authUser, userRole } from '../firebase/auth';
import GestionarGalerias from '../components/GestionarGalerias.vue';
import GestionarEventosEspeciales from '../components/GestionarEventosEspeciales.vue';
import GestionarEstadisticas from '../components/GestionarEstadisticas.vue';
import GestionarSliderHome from '../components/GestionarSliderHome.vue';
import GestionarSolicitudesRegistro from '../components/GestionarSolicitudesRegistro.vue';
import GestionarEntrenamientos from '../components/GestionarEntrenamientos.vue';
import { entrenamientos, fetchTodosEntrenamientos } from '../firebase/entrenamientos';
import VistaJugadorasAdmin from '../components/VistaJugadorasAdmin.vue';
import ListadoJugadorasAdmin from '../components/ListadoJugadorasAdmin.vue';

const router = useRouter();
const route = useRoute();
const activeTab = ref('solicitudes');

const userGreeting = computed(() => {
  if (authUser.value) {
    const rol = userRole.value === 'admin' ? '(Admin)' : '(Coach)';
    return `Bienvenida, ${authUser.value.email} ${rol}`;
  }
  return '';
});

const tabs = [
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'slider', label: 'Slider Home' },
  { id: 'jugadoras', label: 'Jugadoras' },
  { id: 'entrenamientos', label: 'Entrenamientos' },
  { id: 'historial', label: 'Historial' },
  { id: 'vista-jugadoras', label: 'Vista Jugadoras' },
  { id: 'eventos-especiales', label: 'Próximo/Último Partido' },
  { id: 'galeria', label: 'Galería' },
  { id: 'estadisticas', label: 'Estadísticas' },
];

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const formatearFecha = (date) => {
  if (!date) return '-';
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const parseFechaBase = (fecha) => {
  if (!fecha) return null;
  if (fecha?.seconds) return new Date(fecha.seconds * 1000);
  if (fecha instanceof Date) return fecha;

  if (typeof fecha === 'string') {
    const soloFecha = fecha.split('T')[0];
    const partes = soloFecha.split('-').map(Number);
    if (partes.length === 3 && partes.every(n => Number.isFinite(n))) {
      const [y, m, d] = partes;
      return new Date(y, m - 1, d);
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

const eventoFinalizado = (ent) => {
  const ms = getFechaHoraMs(ent);
  return ms != null && ms < Date.now();
};

const historialEntrenamientos = computed(() => {
  return entrenamientos.value
    .filter(e => eventoFinalizado(e))
    .sort((a, b) => (getFechaHoraMs(b) ?? 0) - (getFechaHoraMs(a) ?? 0));
});

const totalEntrenamientos = computed(() => entrenamientos.value.length);

// Búsqueda para el historial
const searchHist = ref('');
const historialFiltrado = computed(() => {
  if (!searchHist.value) return historialEntrenamientos.value;
  return historialEntrenamientos.value.filter(e => (e.nombre || '').toLowerCase().includes(searchHist.value.toLowerCase()));
});

onMounted(async () => {
  const tab = route.query?.tab;
  if (typeof tab === 'string' && tabs.some(t => t.id === tab)) {
    activeTab.value = tab;
  }
  await fetchTodosEntrenamientos();
});

watch(
  () => route.query?.tab,
  (tab) => {
    if (typeof tab === 'string' && tabs.some(t => t.id === tab)) {
      activeTab.value = tab;
    }
  }
);

const verDetalles = (ent) => {
  if (!ent || !ent.id) return;
  router.push({
    name: 'DetalleEntrenamiento',
    params: { id: ent.id },
    query: { from: 'admin', tab: 'historial' }
  });
};
</script>
