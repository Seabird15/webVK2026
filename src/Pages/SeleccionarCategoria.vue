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
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
          ¡Bienvenida de vuelta! 
        </h1>
        <p class="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
          Perteneces a <span class="text-primary font-bold">ambos equipos</span>. 
          Selecciona el equipo para ver los entrenamientos
        </p>
      </div>

      <!-- Opciones de categoría mejoradas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        <!-- Ascenso -->
        <button
          @click="seleccionarCategoria('ascenso')"
          :disabled="isLoading"
          class="group relative bg-white/95 backdrop-blur rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <!-- Efecto de brillo al hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-transparent group-hover:to-transparent transition-all duration-500"></div>
          
          <!-- Ícono decorativo -->
          <div class="absolute -top-8 -right-8 w-32 h-32 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          
          <div class="relative">
            <!-- Badge del equipo -->
            <div class="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold mb-4 md:mb-6">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>Equipo Competitivo</span>
            </div>

            <h2 class="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-red-600 transition-colors">
              Ascenso
            </h2>
            
            <p class="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
              Liga de ascenso, entrenamientos intensivos y partidos oficiales
            </p>

            <!-- Características -->
            <div class="space-y-3 mb-6 md:mb-8">
              <div class="flex items-center gap-3 text-sm md:text-base text-gray-700">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Ver entrenamientos y partidos</span>
              </div>
              <div class="flex items-center gap-3 text-sm md:text-base text-gray-700">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Confirmar asistencia</span>
              </div>
              <div class="flex items-center gap-3 text-sm md:text-base text-gray-700">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Gestionar convocatorias</span>
              </div>
            </div>

            <!-- Botón de acción -->
            <div class="flex items-center justify-center gap-2 text-red-600 font-bold group-hover:gap-4 transition-all">
              <span class="text-sm md:text-base">Seleccionar</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </button>

        <!-- Escuela -->
        <button
          @click="seleccionarCategoria('escuela')"
          :disabled="isLoading"
          class="group relative bg-white/95 backdrop-blur rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10 hover:shadow-primary-dark/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <!-- Efecto de brillo al hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-transparent group-hover:to-transparent transition-all duration-500"></div>
          
          <!-- Ícono decorativo -->
          <div class="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          
          <div class="relative">
            <!-- Badge del equipo -->
            <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-4 md:mb-6">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
              <span>Equipo Formación</span>
            </div>

            <h2 class="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-blue-600 transition-colors">
              Escuela
            </h2>
            
            <p class="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
              Desarrollo de habilidades, aprendizaje y crecimiento deportivo
            </p>

            <!-- Características -->
            <div class="space-y-3 mb-6 md:mb-8">
              <div class="flex items-center gap-3 text-sm md:text-base text-gray-700">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Ver entrenamientos y eventos</span>
              </div>
              <div class="flex items-center gap-3 text-sm md:text-base text-gray-700">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Confirmar asistencia</span>
              </div>
              <div class="flex items-center gap-3 text-sm md:text-base text-gray-700">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Participar en actividades</span>
              </div>
            </div>

            <!-- Botón de acción -->
            <div class="flex items-center justify-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
              <span class="text-sm md:text-base">Seleccionar</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </button>
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
import { jugadoraAuthUser, jugadoraData } from '../firebase/jugadorasAuth';

const router = useRouter();
const isLoading = ref(false);

// Verificar que el usuario esté autenticado y tenga equipo "ambos"
if (!jugadoraAuthUser.value || jugadoraData.value?.equipo !== 'ambos') {
  router.push('/login-jugadora');
}

const seleccionarCategoria = async (categoria) => {
  isLoading.value = true;
  // Guardar categoría seleccionada en localStorage o similar si es necesario
  localStorage.setItem('categoriaSeleccionada', categoria);
  
  // Pequeño delay para mostrar la animación
  setTimeout(() => {
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
