<template>
  <div class="w-full bg-white">
    <!-- Pestañas de categorías -->
    <div class="bg-white border-b border-gray-300 overflow-x-auto">
      <div class="max-w-6xl mx-auto px-1 md:px-4">
        <div class="flex gap-1 md:gap-8 lg:gap-12 min-w-min md:min-w-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-3 md:py-4 px-2 md:px-4 font-bold text-xs md:text-base uppercase transition-all border-b-2 whitespace-nowrap"
            :class="activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-primary'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido de las pestañas -->
    <div>
      <div v-if="equipoActual">
        <!-- Descripción del equipo -->
        <div class="bg-banner h-56 md:h-64 lg:h-80 px-3 md:px-8 lg:px-28 w-full">
          <div class="flex flex-col justify-center h-full bg-gradient-to-r from-black/85 via-black/70 to-transparent p-5 md:p-6 lg:p-8 rounded-lg">
            <h2 class="text-xl md:text-3xl lg:text-4xl font-bold text-primary uppercase mb-3 md:mb-4">
              {{ equipoActual.titulo }}
            </h2>
            <p class="text-white leading-relaxed text-xs md:text-base lg:text-lg">
              {{ equipoActual.descripcion }}
            </p>
          </div>
        </div>

        <!-- Contenido -->
        <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <!-- Estado cargando -->
          <div v-if="isLoading" class="text-center py-12">
            <p class="text-gray-500">Cargando equipo...</p>
          </div>

          <div v-else>
            <!-- Directora Técnica -->
            <div v-if="equipoActual.directoraTecnica" class="mb-12 md:mb-16">
              <h3 class="text-xl md:text-2xl font-bold uppercase mb-6 md:mb-8 text-black">Directora Técnica</h3>
              <div class="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-2xl">
                <div class="w-40 md:w-48 h-40 md:h-48 shrink-0 bg-gray-100 flex items-center justify-center">
                  <img :src="obtenerFoto(equipoActual.directoraTecnica.foto)" :alt="equipoActual.directoraTecnica.nombre" class="w-full h-full object-cover"/>
                </div>
                <div class="flex-1 p-4 md:p-6 flex flex-col justify-center">
                  <p class="text-primary text-xs md:text-sm font-bold uppercase mb-2">{{ equipoActual.directoraTecnica.posicion }}</p>
                  <h4 class="text-xl md:text-2xl font-bold text-black">{{ equipoActual.directoraTecnica.nombre }} {{ equipoActual.directoraTecnica.apellido }}</h4>
                  <p class="text-primary text-lg md:text-xl font-bold mt-2">DT</p>
                </div>
              </div>
            </div>

            <!-- Preparador Porteras -->
            <div v-if="equipoActual.preparadorPorteras" class="mb-12 md:mb-16">
              <h3 class="text-xl md:text-2xl font-bold uppercase mb-6 md:mb-8 text-black">Preparador Porteras</h3>
              <div class="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-2xl">
                <div class="w-40 md:w-48 h-40 md:h-48 shrink-0 bg-gray-100 flex items-center justify-center">
                  <img :src="obtenerFoto(equipoActual.preparadorPorteras.foto)" :alt="equipoActual.preparadorPorteras.nombre" class="w-full h-full object-cover"/>
                </div>
                <div class="flex-1 p-4 md:p-6 flex flex-col justify-center">
                  <p class="text-primary text-xs md:text-sm font-bold uppercase mb-2">{{ equipoActual.preparadorPorteras.posicion }}</p>
                  <h4 class="text-xl md:text-2xl font-bold text-black">{{ equipoActual.preparadorPorteras.nombre }} {{ equipoActual.preparadorPorteras.apellido }}</h4>
                  <p class="text-primary text-lg md:text-xl font-bold mt-2">PA</p>
                </div>
              </div>
            </div>

            <!-- Porteras -->
            <div v-if="equipoActual.porteras.length > 0" class="mb-12 md:mb-16">
              <h3 class="text-xl md:text-2xl font-bold uppercase mb-6 md:mb-8 text-black">Porteras</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div v-for="jugadora in equipoActual.porteras" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="w-38 h-auto bg-gray-100 flex items-center justify-center shrink-0">
                    <img :src="obtenerFoto(jugadora.foto)" :alt="jugadora.nombre" class="w-full h-full object-cover"/>
                  </div>
                  <div class="p-4 md:p-6 flex flex-col justify-center flex-1">
                    <p class="text-primary text-xs md:text-sm font-bold uppercase mb-2">{{ jugadora.posicion }}</p>
                    <h4 class="text-lg md:text-xl font-bold text-black">{{ jugadora.nombre }} {{ jugadora.apellido }}</h4>
                    <p class="text-3xl md:text-4xl font-bold text-primary mt-2">{{ jugadora.numero?.toString().padStart(2, '0') || '00' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Defensas -->
            <div v-if="equipoActual.defensas.length > 0" class="mb-12 md:mb-16">
              <h3 class="text-xl md:text-2xl font-bold uppercase mb-6 md:mb-8 text-black">Defensas</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div v-for="jugadora in equipoActual.defensas" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="w-38 h-auto bg-gray-100 flex items-center justify-center shrink-0">
                    <img :src="obtenerFoto(jugadora.foto)" :alt="jugadora.nombre" class="w-full h-full object-cover"/>
                  </div>
                  <div class="p-4 md:p-6 flex flex-col justify-center flex-1">
                    <p class="text-primary text-xs md:text-sm font-bold uppercase mb-2">{{ jugadora.posicion }}</p>
                    <h4 class="text-lg md:text-xl font-bold text-black">{{ jugadora.nombre }} {{ jugadora.apellido }}</h4>
                    <p class="text-3xl md:text-4xl font-bold text-primary mt-2">{{ jugadora.numero?.toString().padStart(2, '0') || '00' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alas -->
            <div v-if="equipoActual.alas.length > 0" class="mb-12 md:mb-16">
              <h3 class="text-xl md:text-2xl font-bold uppercase mb-6 md:mb-8 text-black">Alas</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div v-for="jugadora in equipoActual.alas" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="w-38 h-auto bg-gray-100 flex items-center justify-center shrink-0">
                    <img :src="obtenerFoto(jugadora.foto)" :alt="jugadora.nombre" class="w-full h-full object-cover"/>
                  </div>
                  <div class="p-4 md:p-6 flex flex-col justify-center flex-1">
                    <p class="text-primary text-xs md:text-sm font-bold uppercase mb-2">{{ jugadora.posicion }}</p>
                    <h4 class="text-lg md:text-xl font-bold text-black">{{ jugadora.nombre }} {{ jugadora.apellido }}</h4>
                    <p class="text-3xl md:text-4xl font-bold text-primary mt-2">{{ jugadora.numero?.toString().padStart(2, '0') || '00' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medio -->
            <div v-if="equipoActual.medio.length > 0" class="mb-12 md:mb-16">
              <h3 class="text-xl md:text-2xl font-bold uppercase mb-6 md:mb-8 text-black">Medio</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div v-for="jugadora in equipoActual.medio" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="w-38 h-auto bg-gray-100 flex items-center justify-center shrink-0">
                    <img :src="obtenerFoto(jugadora.foto)" :alt="jugadora.nombre" class="w-full h-full object-cover"/>
                  </div>
                  <div class="p-4 md:p-6 flex flex-col justify-center flex-1">
                    <p class="text-primary text-xs md:text-sm font-bold uppercase mb-2">{{ jugadora.posicion }}</p>
                    <h4 class="text-lg md:text-xl font-bold text-black">{{ jugadora.nombre }} {{ jugadora.apellido }}</h4>
                    <p class="text-3xl md:text-4xl font-bold text-primary mt-2">{{ jugadora.numero?.toString().padStart(2, '0') || '00' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delanteras -->
            <div v-if="equipoActual.delanteras.length > 0" class="mb-12 md:mb-16">
              <h3 class="text-xl md:text-2xl font-bold uppercase mb-6 md:mb-8 text-black">Delanteras</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div v-for="jugadora in equipoActual.delanteras" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="w-38 h-auto bg-gray-100 flex items-center justify-center shrink-0">
                    <img :src="obtenerFoto(jugadora.foto)" :alt="jugadora.nombre" class="w-full h-full object-cover"/>
                  </div>
                  <div class="p-4 md:p-6 flex flex-col justify-center flex-1">
                    <p class="text-primary text-xs md:text-sm font-bold uppercase mb-2">{{ jugadora.posicion }}</p>
                    <h4 class="text-lg md:text-xl font-bold text-black">{{ jugadora.nombre }} {{ jugadora.apellido }}</h4>
                    <p class="text-3xl md:text-4xl font-bold text-primary mt-2">{{ jugadora.numero?.toString().padStart(2, '0') || '00' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import logoBlanco from '@/assets/logoblanco.jpg';
import { obtenerEquipoCompleto } from '../firebase/jugadoras';
import { useLoader } from '../composables/useLoader.js';

const { show, hide } = useLoader();
const activeTab = ref('ascenso');

const tabs = [
  { id: 'ascenso', label: 'Ascenso' },
  { id: 'escuela', label: 'Escuela' },
  { id: 'futsal', label: 'Futsal' },
];

// Estructura base de equipos con descripciones
const equiposBase = {
  ascenso: {
    titulo: 'Equipo Ascenso',
    descripcion: 'El Equipo Ascenso es nuestra rama más competitiva. Un equipo comprometido con la excelencia, el rendimiento y la pasión por el fútbol. Cada entrenamiento y partido se vive con intensidad, disciplina y espíritu de lucha. Aquí es donde se representa con fuerza el carácter vikinga: garra, juego y mentalidad ganadora.',
  },
  escuela: {
    titulo: 'Equipo Escuela',
    descripcion: 'El Equipo Escuela es nuestro semillero de talento. Aquí formamos jugadoras con valores, técnica y actitud. Cada mujer que entra en nuestra escuela aprende que el fútbol es más que un deporte: es disciplina, teamwork y crecimiento personal. Es donde germina el espíritu vikinga.',
  },
  futsal: {
    titulo: 'Equipo Futsal',
    descripcion: 'El Equipo Futsal es nuestra rama de fútbol de salón. Aquí se concentran jugadoras ágiles, técnicas y rápidas. El futsal nos permite desarrollar jugadoras con mejor control de balón y toma de decisiones. Un equipo dinámico con toda la energía vikinga.',
  }
};

// Datos reactivos de los equipos desde Firestore
const equipos = ref({
  ascenso: { ...equiposBase.ascenso, directoraTecnica: null, preparadorPorteras: null, porteras: [], defensas: [], alas: [], medio: [], delanteras: [] },
  escuela: { ...equiposBase.escuela, directoraTecnica: null, preparadorPorteras: null, porteras: [], defensas: [], alas: [], medio: [], delanteras: [] },
  futsal: { ...equiposBase.futsal, directoraTecnica: null, preparadorPorteras: null, porteras: [], defensas: [], alas: [], medio: [], delanteras: [] },
});

const equipoActual = computed(() => equipos.value[activeTab.value]);

// Cargar datos del equipo desde Firestore
const cargarEquipo = async (equipoId) => {
  try {
    show('Cargando equipo...');
    const datosEquipo = await obtenerEquipoCompleto(equipoId);
    
    equipos.value[equipoId] = {
      ...equiposBase[equipoId],
      directoraTecnica: datosEquipo.directoraTecnica,
      preparadorPorteras: datosEquipo.preparadorPorteras,
      porteras: datosEquipo.porteras,
      defensas: datosEquipo.defensas,
      alas: datosEquipo.alas,
      medio: datosEquipo.medio,
      delanteras: datosEquipo.delanteras
    };
  } catch (err) {
    console.error(`Error cargando equipo ${equipoId}:`, err);
  } finally {
    hide();
  }
};

// Función para obtener foto o logo por defecto
const obtenerFoto = (foto) => {
  return foto ? foto : logoBlanco;
};

// Cargar datos cuando cambia la pestaña
watch(activeTab, (nuevoEquipo) => {
  cargarEquipo(nuevoEquipo);
});

// Cargar el equipo inicial al montar
onMounted(() => {
  cargarEquipo('ascenso');
});
</script>

<style scoped>
    .bg-banner{
        background-image: url('../assets/bannerequipos.webp');
        background-size: cover;
        background-repeat: no-repeat;
        
    }
</style>