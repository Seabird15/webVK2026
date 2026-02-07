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
            class="py-3 md:py-4 px-2 md:px-4 font-bold text-xs md:text-base uppercase transition-all border-b-2 whitespace-nowrap cursor-pointer"
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
      <!-- Contenido especial para Futsal -->
      <div v-if="activeTab === 'futsal'">
        <!-- Banner Futsal -->
        <div class="bg-banner h-56 md:h-64 lg:h-80 px-3 md:px-8 lg:px-28 w-full">
          <div class="flex flex-col justify-center h-full bg-gradient-to-r from-black/85 via-black/70 to-transparent p-5 md:p-6 lg:p-8 rounded-lg">
            <h2 class="text-xl md:text-3xl lg:text-4xl font-bold text-primary uppercase mb-3 md:mb-4">
              Taller de Futsal
            </h2>
            <p class="text-white leading-relaxed text-xs md:text-base lg:text-lg">
              Un proyecto ganador que abrió nuevas oportunidades para nuestra comunidad
            </p>
          </div>
        </div>

        <!-- Contenido Futsal -->
        <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          
          <!-- Historia del proyecto con collage -->
              <div class="bg-secondary-dark text-black tracking-widest font-bold rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div class="relative z-10">
              <h3 class="text-lg md:text-xl text-center font-bold mb-4">           <span class="underline">PRONTO,</span> PARTIDO AMISTOSO CIERRE TALLER FUTSAL 2025-2026
</h3>
         
          
            </div>
          </div>
          <div class="mb-12">
            <div class="grid lg:grid-cols-2 gap-8 items-center">
              <!-- Collage de imágenes -->
              <div class="relative h-[400px] md:h-[500px] lg:h-[600px] order-2 lg:order-1">
                <!-- Imagen principal inclinada -->
                <div class="absolute top-0 left-0 w-[70%] h-[65%] transform rotate-3 shadow-2xl rounded-lg overflow-hidden border-4 border-white z-10">
                  <img :src="fotoFutsal1" alt="Taller de Futsal" class="w-full h-full object-cover" />
                </div>
                <!-- Imagen secundaria superpuesta -->
                <div class="absolute bottom-0 right-0 w-[60%] h-[55%] transform -rotate-2 shadow-2xl rounded-lg overflow-hidden border-4 border-white z-20">
                  <img :src="fotoFutsal2" alt="Entrenamientos Futsal" class="w-full h-full object-cover" />
                </div>
                <!-- Decoración con círculo de acento -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl z-0"></div>
              </div>
              
              <!-- Contenido del texto -->
              <div class="bg-white rounded-lg shadow-lg p-6 md:p-8 order-1 lg:order-2">
                <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Proyecto Municipal Puente Alto</h3>
                <div class="prose prose-lg max-w-none text-gray-700">
                  <p class="mb-4">
                    De noviembre a febrero, gracias a un proyecto ganado en la Municipalidad de Puente Alto, 
                    abrimos los espacios para entrenar una nueva disciplina relacionada al fútbol: 
                    <span class="font-bold text-primary">el Futsal</span>.
                  </p>
                  <p class="mb-4">
                    Este taller representó un hito importante para nuestro club, permitiendo a nuestras 
                    jugadoras desarrollar nuevas habilidades técnicas y tácticas en una disciplina que 
                    complementa perfectamente el fútbol tradicional.
                  </p>
                  <p class="mb-4">
                    El proyecto nos permitió seguir entrenando durante estos meses y sumar nuevas integrantes 
                    que se incorporarán a nuestras categorías Escuela o Ascenso, fortaleciendo así nuestra 
                    comunidad vikinga.
                  </p>
                  <p>
                    Además, gracias a este proyecto pudimos adquirir mejores implementos deportivos que 
                    beneficiarán a todas nuestras jugadoras en su desarrollo futbolístico.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Beneficios del Futsal -->
          <div class="mb-12">
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Logros del Proyecto</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border-2 border-primary/20 hover:shadow-lg transition-all hover:scale-105 duration-300">
                <div class="flex justify-center mb-4">
                  <ShoppingBagIcon class="w-12 h-12 text-primary" />
                </div>
                <h4 class="font-bold text-lg text-gray-900 mb-2 text-center">Mejores Implementos</h4>
                <p class="text-gray-600 text-center">Adquirimos equipamiento deportivo de calidad que beneficia a todas nuestras categorías</p>
              </div>
              <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border-2 border-primary/20 hover:shadow-lg transition-all hover:scale-105 duration-300">
                <div class="flex justify-center mb-4">
                  <UserGroupIcon class="w-12 h-12 text-primary" />
                </div>
                <h4 class="font-bold text-lg text-gray-900 mb-2 text-center">Nuevas Integrantes</h4>
                <p class="text-gray-600 text-center">Sumamos nuevas jugadoras que se integrarán a Escuela o Ascenso</p>
              </div>
              <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border-2 border-primary/20 hover:shadow-lg transition-all hover:scale-105 duration-300">
                <div class="flex justify-center mb-4">
                  <BoltIcon class="w-12 h-12 text-primary" />
                </div>
                <h4 class="font-bold text-lg text-gray-900 mb-2 text-center">Continuidad</h4>
                <p class="text-gray-600 text-center">Mantuvimos el entrenamiento constante durante los meses del proyecto</p>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="bg-primary-dark text-white rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div class="relative z-10">
              <h3 class="text-2xl md:text-3xl font-bold mb-4 uppercase">Seguiremos abriendo espacios</h3>
              <p class="text-lg mb-8 leading-relaxed">
                El taller de futsal finalizó exitosamente en febrero, dejando importantes frutos para 
                nuestro club: nuevas integrantes, mejores implementos y la oportunidad de seguir creciendo 
                como comunidad vikinga.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div class="flex items-center gap-3 mb-2">
                    <CalendarIcon class="w-8 h-8 text-white" />
                    <p class="font-bold text-xl">Período</p>
                  </div>
                  <p class="text-white/90 ml-11">Noviembre - Febrero</p>
                </div>
                <div class="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div class="flex items-center gap-3 mb-2">
                    <MapPinIcon class="w-8 h-8 text-white" />
                    <p class="font-bold text-xl">Ubicación</p>
                  </div>
                  <p class="text-white/90 ml-11">Puente Alto</p>
                </div>
                <div class="bg-white/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div class="flex items-center gap-3 mb-2">
                    <TrophyIcon class="w-8 h-8 text-white" />
                    <p class="font-bold text-xl">Estado</p>
                  </div>
                  <p class="text-white/90 ml-11">Finalizado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido normal para Ascenso y Escuela -->
      <div v-else-if="equipoActual">
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
              <div class="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-2xl h-48">
                <div class="w-48 h-48 shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
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
              <div class="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-2xl h-48">
                <div class="w-48 h-48 shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
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
                <div v-for="jugadora in equipoActual.porteras" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-40 md:h-44">
                  <div class="w-32 h-40 md:w-36 md:h-44 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
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
                <div v-for="jugadora in equipoActual.defensas" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-40 md:h-44">
                  <div class="w-32 h-40 md:w-36 md:h-44 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
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
                <div v-for="jugadora in equipoActual.alas" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-40 md:h-44">
                  <div class="w-32 h-40 md:w-36 md:h-44 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
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
                <div v-for="jugadora in equipoActual.medio" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-40 md:h-44">
                  <div class="w-32 h-40 md:w-36 md:h-44 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
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
                <div v-for="jugadora in equipoActual.delanteras" :key="jugadora.id" class="flex flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-40 md:h-44">
                  <div class="w-32 h-40 md:w-36 md:h-44 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
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
import { ShoppingBagIcon, UserGroupIcon, BoltIcon, CalendarIcon, MapPinIcon, TrophyIcon } from '@heroicons/vue/24/outline';
import logoBlanco from '@/assets/logoblanco.jpg';
import fotoFutsal1 from '@/assets/futsal1.jpeg';
import fotoFutsal2 from '@/assets/fustal2.jpeg';
import { obtenerEquipoCompletoRegistro } from '../firebase/jugadorasAuth';
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
  // No cargar datos para futsal ya que es contenido estático
  if (equipoId === 'futsal') {
    return;
  }
  
  try {
    show('Cargando equipo...');
    const datosEquipo = await obtenerEquipoCompletoRegistro(equipoId);
    
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
    // // console.error(`Error cargando equipo ${equipoId}:`, err);
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