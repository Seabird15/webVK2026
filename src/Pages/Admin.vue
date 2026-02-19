<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="bg-linear-to-r from-primary-dark to-primary text-white shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <HomeIcon class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black">Panel de Administración</h1>
              <p class="text-xs sm:text-sm text-white/80 mt-0.5">{{ userGreeting }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105 active:scale-95"
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
          <div class="bg-white rounded-2xl shadow-xl p-5 sticky top-6 border border-gray-100">
            <div class="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <HomeIcon class="w-5 h-5 text-primary" />
              </div>
              <h2 class="text-lg font-black text-gray-900">Menú</h2>
            </div>
            <nav class="space-y-1.5">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center gap-3 group',
                  activeTab === tab.id
                    ? 'bg-linear-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]'
                ]"
              >
                <component 
                  :is="tab.icon" 
                  :class="[
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                  ]" 
                />
                <span>{{ tab.label }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="lg:col-span-3">
          <!-- Home/Dashboard -->
          <div v-if="activeTab === 'home'" class="space-y-6">
            <!-- Tarjeta de bienvenida -->
            <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-16 h-16 bg-linear-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <UsersIcon class="w-9 h-9 text-white" />
                </div>
                <div>
                  <h2 class="text-3xl font-black text-gray-900">¡Bienvenida DT Yesi!</h2>
                  <p class="text-sm text-gray-500 mt-1">Gestiona tu equipo desde un solo lugar</p>
                </div>
              </div>
              
              <!-- Estadísticas Rápidas -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <!-- Próximo Entrenamiento -->
                <div class="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <CalendarIcon class="w-6 h-6" />
                    </div>
                  </div>
                  <p class="text-sm font-medium opacity-90 mb-1">Próximo Entrenamiento</p>
                  <div v-if="proximoEntrenamiento">
                    <p class="text-2xl font-black mb-2 line-clamp-1">{{ proximoEntrenamiento.nombre }}</p>
                    <div class="space-y-1 text-xs opacity-90">
                      <p>📅 En {{ proximoEntrenamiento.diasRestantes }} {{ proximoEntrenamiento.diasRestantes === 1 ? 'día' : 'días' }}</p>
                      <p>✓ {{ proximoEntrenamiento.inscripciones.confirmadas }} confirmadas</p>
                      <p>⏳ {{ proximoEntrenamiento.inscripciones.pendientes }} pendientes</p>
                    </div>
                  </div>
                  <p v-else class="text-xl font-black">No hay próximos</p>
                </div>
                
                <!-- Total de Jugadoras Activas -->
                <div class="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <UsersIcon class="w-6 h-6" />
                    </div>
                  </div>
                  <p class="text-sm font-medium opacity-90 mb-1">Total Jugadoras</p>
                  <div class="flex items-baseline gap-2 mb-3">
                    <p class="text-5xl font-black">{{ jugadorasPorEquipo.total }}</p>
                    <span class="text-xl font-bold opacity-90">activas</span>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="opacity-90 flex items-center gap-1">
                        <span class="w-2 h-2 bg-white rounded-full"></span>
                        Ascenso
                      </span>
                      <span class="font-bold">{{ jugadorasPorEquipo.ascenso }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="opacity-90 flex items-center gap-1">
                        <span class="w-2 h-2 bg-white rounded-full"></span>
                        Escuela
                      </span>
                      <span class="font-bold">{{ jugadorasPorEquipo.escuela }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="opacity-90 flex items-center gap-1">
                        <span class="w-2 h-2 bg-white rounded-full"></span>
                        Ambos
                      </span>
                      <span class="font-bold">{{ jugadorasPorEquipo.ambos }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Tasa de Asistencia -->
                <div class="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <ChartBarIcon class="w-6 h-6" />
                    </div>
                  </div>
                  <p class="text-sm font-medium opacity-90 mb-1">Tasa de Asistencia</p>
                  <div class="flex items-baseline gap-2">
                    <p class="text-5xl font-black">{{ tasaAsistenciaPromedio }}</p>
                    <span class="text-2xl font-bold opacity-90">%</span>
                  </div>
                  <p class="text-xs opacity-75 mt-2">Promedio de entrenamientos finalizados</p>
                </div>
              </div>

              <!-- Próximo Cumpleaños -->
              <div v-if="proximoCumpleanios" class="bg-linear-to-r from-pink-50 via-purple-50 to-pink-50 border-2 border-pink-200 rounded-2xl p-6 mb-6 shadow-md hover:shadow-lg transition-all">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div class="w-20 h-20 bg-linear-to-br from-pink-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 animate-pulse">
                    <GiftIcon class="w-10 h-10" />
                  </div>
                  <div class="flex-1 text-center sm:text-left">
                    <h3 class="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">Próximo Cumpleaños</h3>
                    <p class="text-gray-900 mt-2 text-lg">
                      <span class="font-black text-purple-700">{{ proximoCumpleanios.nombre }}</span>
                    </p>
                    <div class="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <CalendarIcon class="w-4 h-4 text-gray-500" />
                      <p class="text-sm text-gray-600">
                        {{ proximoCumpleanios.fechaFormateada }}
                      </p>
                    </div>
                    <div class="mt-3">
                      <span v-if="proximoCumpleanios.diasRestantes === 0" class="inline-block px-4 py-2 bg-pink-500 text-white font-bold rounded-xl shadow-md">¡Hoy es su cumpleaños! 🎉</span>
                      <span v-else-if="proximoCumpleanios.diasRestantes === 1" class="inline-block px-4 py-2 bg-pink-500 text-white font-bold rounded-xl shadow-md">¡Mañana cumple años! 🎈</span>
                      <span v-else class="inline-block px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-xl">Faltan {{ proximoCumpleanios.diasRestantes }} días</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acceso Rápido -->
              <div>
                <div class="flex items-center gap-2 mb-5">
                  <div class="w-2 h-8 bg-primary rounded-full"></div>
                  <h3 class="text-xl font-black text-gray-900">Acceso Rápido</h3>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    @click="activeTab = 'entrenamientos'"
                    class="group p-5 bg-linear-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <CalendarIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm font-black text-blue-700">Entrenamientos</div>
                  </button>
                  <button
                    @click="activeTab = 'jugadoras'"
                    class="group p-5 bg-linear-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <UsersIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm font-black text-green-700">Jugadoras</div>
                  </button>
                  <button
                    @click="activeTab = 'historial'"
                    class="group p-5 bg-linear-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <ChartBarIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm font-black text-purple-700">Historial</div>
                  </button>
                  <button
                    @click="activeTab = 'galeria'"
                    class="group p-5 bg-linear-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-2 border-yellow-200 hover:border-yellow-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <CameraIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm font-black text-yellow-700">Galería</div>
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
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <!-- Header -->
              <div class="bg-linear-to-r from-primary-dark via-primary to-primary-dark p-6 sm:p-8 text-white">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <ChartBarIcon class="w-6 h-6" />
                  </div>
                  <div>
                    <h2 class="text-2xl sm:text-3xl font-black">Historial de entrenamientos</h2>
                    <p class="text-xs sm:text-sm text-white/80 mt-1">Entrenamientos finalizados</p>
                  </div>
                </div>
              </div>

              <!-- Contenido -->
              <div class="p-6">
                <div v-if="historialFiltrado.length === 0" class="p-16 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl text-center">
                  <div class="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon class="w-10 h-10 text-gray-400" />
                  </div>
                  <p class="text-gray-500 font-bold text-lg">No hay items en el historial</p>
                  <p class="text-gray-400 text-sm mt-2">Los entrenamientos finalizados aparecerán aquí</p>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div 
                    v-for="ent in historialFiltrado" 
                    :key="ent.id" 
                    class="bg-white rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  >
                    <!-- Header de la tarjeta con gradiente -->
                    <div class="bg-linear-to-br from-gray-50 to-gray-100 p-5 border-b-2 border-gray-100 group-hover:from-primary/5 group-hover:to-primary/10 transition-all">
                      <div class="flex justify-between items-start gap-3 mb-4">
                        <h3 class="font-black text-base text-gray-900 line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                          {{ ent.nombre }}
                        </h3>
                        <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1.5 whitespace-nowrap shrink-0 font-bold">
                          ✓ Finalizado
                        </span>
                      </div>
                      
                      <!-- Info fecha y hora con iconos -->
                      <div class="space-y-2">
                        <div class="flex items-center gap-2.5 text-xs text-gray-600">
                          <div class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <CalendarIcon class="w-4 h-4 text-blue-600" />
                          </div>
                          <span class="font-medium">{{ formatearFecha(ent.fecha) }}</span>
                        </div>
                        <div class="flex items-center gap-2.5 text-xs text-gray-600">
                          <div class="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                            <ClockIcon class="w-4 h-4 text-purple-600" />
                          </div>
                          <span class="font-medium">{{ ent.hora }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Cuerpo de la tarjeta -->
                    <div class="p-5">
                      <!-- Tags con mejor diseño -->
                      <div class="flex flex-wrap items-center gap-2 mb-4">
                        <span class="text-xs bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full px-3 py-1.5 font-bold capitalize shadow-sm">
                          {{ ent.equipo }}
                        </span>
                        <span v-if="ent.tipo" class="text-xs bg-linear-to-r from-green-500 to-green-600 text-white rounded-full px-3 py-1.5 font-bold capitalize shadow-sm">
                          {{ ent.tipo }}
                        </span>
                        <span v-if="ent.esConvocatoria" class="text-xs bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-full px-3 py-1.5 font-bold shadow-sm">
                          Convocatoria
                        </span>
                      </div>

                      <!-- Descripción -->
                      <p v-if="ent.descripcion" class="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                        {{ ent.descripcion }}
                      </p>

                      <!-- Botón de acción mejorado -->
                      <button 
                        @click="verDetalles(ent)" 
                        class="w-full px-4 py-3 bg-linear-to-r from-primary to-primary-dark text-white rounded-xl cursor-pointer hover:shadow-lg font-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
                      >
                        <PencilIcon class="w-4 h-4" />
                        Ver Asistencia
                      </button>
                    </div>
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
import { 
  HomeIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  UsersIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  TrophyIcon, 
  CameraIcon, 
  ArrowTrendingUpIcon,
  CheckIcon,
  ClockIcon,
  GiftIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';
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
const inscripcionesPorEntrenamiento = ref({});
const jugadorasPorEquipo = ref({ ascenso: 0, escuela: 0, ambos: 0, total: 0 });

const userGreeting = computed(() => {
  if (authUser.value) {
    const rol = userRole.value === 'admin' ? '(Admin)' : '(Coach)';
    return `Bienvenida, ${authUser.value.email} ${rol}`;
  }
  return '';
});

const tabs = [
  { id: 'home', label: 'Inicio', icon: HomeIcon },
  { id: 'solicitudes', label: 'Solicitudes', icon: DocumentTextIcon },
  { id: 'slider', label: 'Slider Home', icon: PhotoIcon },
  { id: 'jugadoras', label: 'Jugadoras', icon: UsersIcon },
  { id: 'entrenamientos', label: 'Entrenamientos', icon: CalendarIcon },
  { id: 'historial', label: 'Historial', icon: ChartBarIcon },
  { id: 'eventos-especiales', label: 'Próx/Último Partido', icon: TrophyIcon },
  { id: 'galeria', label: 'Galería', icon: CameraIcon },
  { id: 'estadisticas', label: 'Estadísticas', icon: ArrowTrendingUpIcon },
  { id: 'partidos', label: 'Campeonato', icon: TrophyIcon },
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

// Próximo entrenamiento con datos
const proximoEntrenamiento = computed(() => {
  const futuros = entrenamientosFuturos.value;
  if (futuros.length === 0) return null;
  
  const proximo = futuros[0];
  const inscripciones = inscripcionesPorEntrenamiento.value[proximo.id] || { confirmadas: 0, bajas: 0, pendientes: 0 };
  const fechaMs = getFechaHoraMs(proximo);
  const diasRestantes = fechaMs ? Math.ceil((fechaMs - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  
  return {
    ...proximo,
    diasRestantes,
    inscripciones
  };
});

// Tasa de asistencia promedio (solo entrenamientos finalizados)
const tasaAsistenciaPromedio = computed(() => {
  const finalizados = historialEntrenamientos.value.filter(e => inscripcionesPorEntrenamiento.value[e.id]);
  
  if (finalizados.length === 0) return 0;
  
  const tasas = finalizados.map(e => {
    const insc = inscripcionesPorEntrenamiento.value[e.id];
    const total = (insc?.confirmadas || 0) + (insc?.bajas || 0) + (insc?.pendientes || 0);
    return total > 0 ? ((insc?.confirmadas || 0) / total) * 100 : 0;
  });
  
  const promedio = tasas.reduce((acc, t) => acc + t, 0) / tasas.length;
  return Math.round(promedio);
});

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

// Función para cargar inscripciones de todos los entrenamientos
const cargarInscripcionesEntrenamientos = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'inscripcionesEntrenamientos'));
    const inscripcionesPorId = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const entrenamientoId = data.entrenamientoId;
      
      if (!inscripcionesPorId[entrenamientoId]) {
        inscripcionesPorId[entrenamientoId] = {
          confirmadas: 0,
          bajas: 0,
          pendientes: 0
        };
      }
      
      if (data.estado === 'confirmada') {
        inscripcionesPorId[entrenamientoId].confirmadas++;
      } else if (data.estado === 'baja') {
        inscripcionesPorId[entrenamientoId].bajas++;
      } else if (data.estado === 'pendiente') {
        inscripcionesPorId[entrenamientoId].pendientes++;
      }
    });
    
    inscripcionesPorEntrenamiento.value = inscripcionesPorId;
  } catch (err) {
    console.error('Error cargando inscripciones:', err);
  }
};

// Función para cargar jugadoras por equipo
const cargarJugadorasPorEquipo = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
    const conteo = { ascenso: 0, escuela: 0, ambos: 0, total: 0 };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.equipo === 'ascenso') {
        conteo.ascenso++;
      } else if (data.equipo === 'escuela') {
        conteo.escuela++;
      } else if (data.equipo === 'ambos') {
        conteo.ambos++;
      }
      conteo.total++;
    });
    
    jugadorasPorEquipo.value = conteo;
  } catch (err) {
    console.error('Error cargando jugadoras:', err);
  }
};

onMounted(async () => {
  const tab = route.query?.tab;
  if (typeof tab === 'string' && tabs.some(t => t.id === tab)) {
    activeTab.value = tab;
  }
  await fetchTodosEntrenamientos();
  await cargarProximoCumpleanios();
  await cargarInscripcionesEntrenamientos();
  await cargarJugadorasPorEquipo();
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
