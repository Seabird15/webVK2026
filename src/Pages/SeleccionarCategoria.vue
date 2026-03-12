<template>
  <div class="min-h-screen bg-black relative overflow-hidden">
    <!-- Elementos decorativos de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 -right-20 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 py-8 md:py-16">
      <!-- Encabezado mejorado -->
      <div class="text-center mb-12 md:mb-16 animate-fade-in">
        <div class="inline-block mb-4">
          <div class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4 transform hover:scale-110 transition-transform">
            <svg class="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3">
          ¡Bienvenida{{ jugadoraData?.nombre ? ', ' + jugadoraData.nombre.split(' ')[0] : '' }}! 
        </h1>
       
      </div>

      <!-- Tarjetas informativas (solo lectura) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        <!-- Ascenso - Competencia máxima -->
        <div class="relative overflow-hidden rounded-xl md:rounded-2xl bg-white border-l-4 border-teal-500 text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="p-6 md:p-8 flex flex-col min-h-[280px]">
            <h2 class="text-2xl md:text-3xl font-bold text-teal-700 mb-1">
              ASCENSO
            </h2>
            
            <p class="text-xs font-semibold text-teal-600 mb-4 uppercase tracking-wide">Objetivo: Competir</p>
            
            <p class="text-sm text-gray-700 mb-6 leading-relaxed flex-grow">
              Equipo competitivo Serie B donde la exigencia es máxima. Entrenamientos de alto rendimiento, tácticas avanzadas y partidos oficiales de máxima competencia. 
            </p>

            <div class="w-full px-4 py-2.5 bg-teal-100 text-teal-700 font-semibold rounded-lg text-sm text-center">
              Equipo competitivo
            </div>
          </div>
        </div>

        <!-- Serie C - Crecimiento competitivo -->
        <div class="relative overflow-hidden rounded-xl md:rounded-2xl bg-white border-l-4 border-purple-500 text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="p-6 md:p-8 flex flex-col min-h-[280px]">
            <h2 class="text-2xl md:text-3xl font-bold text-purple-700 mb-1">
              SERIE C
            </h2>
            
            <p class="text-xs font-semibold text-purple-600 mb-4 uppercase tracking-wide">Objetivo: Ganar Experiencia</p>
            
            <p class="text-sm text-gray-700 mb-6 leading-relaxed flex-grow">
              Equipo competitivo que está adquiriendo experiencia en ambiente de apoyo mutuo. Competencia real en partidos oficiales con entrenamientos progresivos. 
            </p>

            <div class="w-full px-4 py-2.5 bg-purple-100 text-purple-700 font-semibold rounded-lg text-sm text-center">
              Equipo en crecimiento
            </div>
          </div>
        </div>

        <!-- Escuela - Formación y diversión -->
        <div class="relative overflow-hidden rounded-xl md:rounded-2xl bg-white border-l-4 border-yellow-500 text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="p-6 md:p-8 flex flex-col min-h-[280px]">
            <h2 class="text-2xl md:text-3xl font-bold text-yellow-700 mb-1">
              ESCUELA
            </h2>
            
            <p class="text-xs font-semibold text-yellow-600 mb-4 uppercase tracking-wide">Objetivo: Aprender y Divertirse</p>
            
            <p class="text-sm text-gray-700 mb-6 leading-relaxed flex-grow">
              Equipo recreativo con enfoque en formación integral. Aprende fundamentos, mejora tus habilidades en ambiente inclusivo y positivo. Donde divertirse y crecer van de la mano.
            </p>

            <div class="w-full px-4 py-2.5 bg-yellow-100 text-yellow-700 font-semibold rounded-lg text-sm text-center">
              Equipo recreativo
            </div>
          </div>
        </div>
      </div>

      <!-- Botón único para ir a entrenamientos -->
      <div class="flex justify-center mt-12 md:mt-16">
        <button
          @click="irAEntrenamientos"
          :disabled="isLoading"
          class="px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          Ir a entrenamientos
        </button>
      </div>

      <!-- Leyenda inspiradora -->
      <div class="text-center mt-12 md:mt-16">
        <p class="text-white text-lg md:text-xl font-semibold italic">
          "Lo que nos une nos hace eternas"
        </p>
      </div>

      <!-- Loader mejorado -->
      <div v-if="isLoading" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 md:p-12 shadow-2xl max-w-sm mx-4 text-center">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-700 font-semibold text-lg">Redirigiendo...</p>
          <p class="text-gray-500 text-sm mt-2">Preparando tu área de entrenamientos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { jugadoraAuthUser, jugadoraData, actualizarCategoriaSeleccionadaJugadora } from '../firebase/jugadorasAuth';

const router = useRouter();
const isLoading = ref(false);

// Verificar que el usuario esté autenticado y tenga equipo "ambos"
if (!jugadoraAuthUser.value || jugadoraData.value?.equipo !== 'ambos') {
  router.push('/login-jugadora');
}

const seleccionarCategoria = async (categoria) => {
  isLoading.value = true;
  
  if (jugadoraAuthUser.value?.uid) {
    await actualizarCategoriaSeleccionadaJugadora(jugadoraAuthUser.value.uid, categoria);
  }
};

const irAEntrenamientos = async () => {
  isLoading.value = true;
  
  // Pequeño delay para mostrar la animación
  setTimeout(() => {
    // Navegar a entrenamientos sin query params
    // Entrenamientos.vue mostrará el equipo principal de la jugadora
    router.push('/entrenamientos');
  }, 800);
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

/* Animación suave para los elementos del fondo */
.absolute.top-20,
.absolute.bottom-20,
.absolute.top-1\/2 {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.absolute.bottom-20 {
  animation-delay: 2s;
}

.absolute.top-1\/2 {
  animation-delay: 4s;
}
</style>
