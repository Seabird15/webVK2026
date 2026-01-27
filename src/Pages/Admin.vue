<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-primary text-white p-6">
      <div class="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">Panel de Administración</h1>
          <p class="text-sm text-whitet mt-1">{{ userGreeting }}</p>
        </div>
        <button
          @click="handleLogout"
          class="bg-primary-dark hover:bg-opacity-90 px-4 py-2 rounded-lg font-bold transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="flex border-b border-gray-200 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 font-bold uppercase text-sm transition-colors whitespace-nowrap',
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
      <div class="bg-white rounded-lg shadow p-6">
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
        <!-- <div v-if="activeTab === 'jugadoras'">
          <GestionarJugadoras />
        </div> -->

        <!-- Eventos -->
        <div v-if="activeTab === 'eventos'">
          <GestionarEventos />
        </div>

        <!-- Entrenamientos -->
        <div v-if="activeTab === 'entrenamientos'">
          <GestionarEntrenamientos />
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

        <!-- Configuración -->
        <div v-if="activeTab === 'configuracion'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
          <p class="text-gray-600">Aquí puedes configurar parámetros generales del sitio</p>
          <!-- Las configuraciones irán aquí -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout, authUser, userRole } from '../firebase/auth';
import GestionarJugadoras from '../components/GestionarJugadoras.vue';
import GestionarEventos from '../components/GestionarEventos.vue';
import GestionarGalerias from '../components/GestionarGalerias.vue';
import GestionarEventosEspeciales from '../components/GestionarEventosEspeciales.vue';
import GestionarEstadisticas from '../components/GestionarEstadisticas.vue';
import GestionarSliderHome from '../components/GestionarSliderHome.vue';
import GestionarSolicitudesRegistro from '../components/GestionarSolicitudesRegistro.vue';
import GestionarEntrenamientos from '../components/GestionarEntrenamientos.vue';

const router = useRouter();
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
  { id: 'equipo', label: 'Equipos' },
  { id: 'jugadoras', label: 'Jugadoras' },
  { id: 'entrenamientos', label: 'Entrenamientos' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'eventos-especiales', label: 'Próximo/Último Partido' },
  { id: 'galeria', label: 'Galería' },
  { id: 'estadisticas', label: 'Estadísticas' },
  { id: 'configuracion', label: 'Configuración' },
];

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>
