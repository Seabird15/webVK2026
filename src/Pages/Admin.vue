<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-linear-to-r from-primary-dark to-primary text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">Panel de Administración</h1>
            <p class="text-sm text-white/90 mt-1">{{ userGreeting }}</p>
          </div>
          <button
            @click="handleLogout"
            class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer backdrop-blur-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor Principal -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Menú Lateral -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg p-4 sticky top-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4 px-2">Menú</h2>
            <nav class="space-y-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer flex items-center gap-3',
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <span class="text-lg">{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="lg:col-span-3">
          <!-- Home/Dashboard -->
          <div v-if="activeTab === 'home'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Bienvenida DT Yesi</h2>
              
              <!-- Estadísticas Rápidas -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm opacity-90">Total Entrenamientos</p>
                      <p class="text-3xl font-bold mt-2">{{ totalEntrenamientos }}</p>
                    </div>
                    <div class="text-4xl opacity-80">📅</div>
                  </div>
                </div>
                
                <div class="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm opacity-90">Historial</p>
                      <p class="text-3xl font-bold mt-2">{{ historialEntrenamientos.length }}</p>
                    </div>
                    <div class="text-4xl opacity-80">✓</div>
                  </div>
                </div>
                
                <div class="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm opacity-90">Próximos</p>
                      <p class="text-3xl font-bold mt-2">{{ entrenamientosFuturos.length }}</p>
                    </div>
                    <div class="text-4xl opacity-80">⏰</div>
                  </div>
                </div>
              </div>

              <!-- Próximo Cumpleaños -->
              <div v-if="proximoCumpleanios" class="bg-linear-to-r from-pink-50 to-purple-50 border-2 border-pink-300 rounded-lg p-6 mb-6">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-linear-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    🎂
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-pink-700">Próximo Cumpleaños</h3>
                    <p class="text-gray-800 mt-1">
                      <span class="font-bold text-purple-700">{{ proximoCumpleanios.nombre }}</span>
                    </p>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ proximoCumpleanios.fechaFormateada }}
                      <span v-if="proximoCumpleanios.diasRestantes === 0" class="text-pink-600 font-bold ml-2">¡Hoy! 🎉</span>
                      <span v-else-if="proximoCumpleanios.diasRestantes === 1" class="text-pink-600 font-bold ml-2">¡Mañana! 🎈</span>
                      <span v-else class="text-gray-700 ml-2">(en {{ proximoCumpleanios.diasRestantes }} días)</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Acceso Rápido -->
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-4">Acceso Rápido</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    @click="activeTab = 'entrenamientos'"
                    class="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-all cursor-pointer text-center"
                  >
                    <div class="text-3xl mb-2">📅</div>
                    <div class="text-sm font-bold text-blue-700">Entrenamientos</div>
                  </button>
                  <button
                    @click="activeTab = 'jugadoras'"
                    class="p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition-all cursor-pointer text-center"
                  >
                    <div class="text-3xl mb-2">👥</div>
                    <div class="text-sm font-bold text-green-700">Jugadoras</div>
                  </button>
                  <button
                    @click="activeTab = 'historial'"
                    class="p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg transition-all cursor-pointer text-center"
                  >
                    <div class="text-3xl mb-2">📊</div>
                    <div class="text-sm font-bold text-purple-700">Historial</div>
                  </button>
                  <button
                    @click="activeTab = 'galeria'"
                    class="p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-lg transition-all cursor-pointer text-center"
                  >
                    <div class="text-3xl mb-2">📷</div>
                    <div class="text-sm font-bold text-yellow-700">Galería</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Solicitudes de Registro -->
          <div v-if="activeTab === 'solicitudes'">
            <GestionarSolicitudesRegistro />
          </div>

          <!-- Slider Home -->
          <div v-if="activeTab === 'slider'">
            <GestionarSliderHome />
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
            <div class="bg-white rounded-lg shadow-lg p-6 space-y-4">
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
                    <button @click="verDetalles(ent)" class="flex-1 min-w-20 px-3 py-2 text-xs bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 font-bold transition-colors">
                      ✏️ Editar Asistencia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          <!-- Partidos Campeonato Interno -->
          <div v-if="activeTab === 'partidos'">
            <GestionarPartidos />
          </div>
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
import GestionarPartidos from '../components/GestionarPartidos.vue';
import { entrenamientos, fetchTodosEntrenamientos } from '../firebase/entrenamientos';
import VistaJugadorasAdmin from '../components/VistaJugadorasAdmin.vue';
import ListadoJugadorasAdmin from '../components/ListadoJugadorasAdmin.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const router = useRouter();
const route = useRoute();
const activeTab = ref('home');
const proximoCumpleanios = ref(null);

const userGreeting = computed(() => {
  if (authUser.value) {
    const rol = userRole.value === 'admin' ? '(Admin)' : '(Coach)';
    return `Bienvenida, ${authUser.value.email} ${rol}`;
  }
  return '';
});

const tabs = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'solicitudes', label: 'Solicitudes', icon: '📝' },
  { id: 'slider', label: 'Slider Home', icon: '🖼️' },
  { id: 'jugadoras', label: 'Jugadoras', icon: '👥' },
  { id: 'entrenamientos', label: 'Entrenamientos', icon: '📅' },
  { id: 'historial', label: 'Historial', icon: '📊' },
  { id: 'eventos-especiales', label: 'Próx/Último Partido', icon: '⚽' },
  { id: 'galeria', label: 'Galería', icon: '📷' },
  { id: 'estadisticas', label: 'Estadísticas', icon: '📈' },
  { id: 'partidos', label: 'Campeonato', icon: '🏆' },
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

const entrenamientosFuturos = computed(() => {
  return entrenamientos.value
    .filter(e => !eventoFinalizado(e))
    .sort((a, b) => (getFechaHoraMs(a) ?? 0) - (getFechaHoraMs(b) ?? 0));
});

const totalEntrenamientos = computed(() => entrenamientos.value.length);

// Búsqueda para el historial
const searchHist = ref('');
const historialFiltrado = computed(() => {
  if (!searchHist.value) return historialEntrenamientos.value;
  return historialEntrenamientos.value.filter(e => (e.nombre || '').toLowerCase().includes(searchHist.value.toLowerCase()));
});

// Función para calcular el próximo cumpleaños
const cargarProximoCumpleanios = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
    const todasJugadoras = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filtrar jugadoras que tengan fecha de nacimiento
    const jugadorasConCumple = todasJugadoras
      .filter(jugadora => jugadora.fechaNacimiento)
      .map(jugadora => {
        const [anio, mes, dia] = jugadora.fechaNacimiento.split('-').map(Number);
        const hoy = new Date();
        const anioActual = hoy.getFullYear();
        
        // Crear fecha del cumpleaños en el año actual
        let fechaCumple = new Date(anioActual, mes - 1, dia);
        
        // Si ya pasó este año, usar el próximo año
        if (fechaCumple < hoy) {
          fechaCumple = new Date(anioActual + 1, mes - 1, dia);
        }
        
        return {
          nombre: `${jugadora.nombre} ${jugadora.apellido}`,
          fechaCumple: fechaCumple,
          dia: dia,
          mes: mes
        };
      });

    // Ordenar por fecha más próxima
    jugadorasConCumple.sort((a, b) => a.fechaCumple - b.fechaCumple);

    // Obtener el próximo cumpleaños
    if (jugadorasConCumple.length > 0) {
      const proximo = jugadorasConCumple[0];
      const hoy = new Date();
      const diasRestantes = Math.ceil((proximo.fechaCumple - hoy) / (1000 * 60 * 60 * 24));
      
      proximoCumpleanios.value = {
        nombre: proximo.nombre,
        fecha: proximo.fechaCumple,
        diasRestantes: diasRestantes,
        fechaFormateada: proximo.fechaCumple.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long'
        })
      };
    }
  } catch (err) {
    console.error('Error cargando cumpleaños:', err);
  }
};

onMounted(async () => {
  const tab = route.query?.tab;
  if (typeof tab === 'string' && tabs.some(t => t.id === tab)) {
    activeTab.value = tab;
  }
  await fetchTodosEntrenamientos();
  await cargarProximoCumpleanios();
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
