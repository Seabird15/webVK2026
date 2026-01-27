<template>
  <div class="w-full bg-gradient-to-r from-black via-primary-dark to-primary py-16 md:py-20 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Encabezado -->
  

      <!-- Tarjeta de acceso -->
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]">
          <!-- Header de la tarjeta -->
          <div class="bg-gradient-to-r from-black to-gray-900 p-8 text-white text-center relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
            
            <div class="relative z-10">
              <img src="../assets/logoVk.png" alt="VK Vikingas" class="w-28 mx-auto mb-4 opacity-90 drop-shadow-lg">
              <h3 class="text-2xl md:text-3xl font-bold tracking-widest" style="font-family: 'Collegiate Black', sans-serif;">
                PORTAL JUGADORAS
              </h3>
              <div class="mt-2 h-1 w-24 bg-primary mx-auto rounded-full"></div>
            </div>
          </div>

          <!-- Contenido de la tarjeta -->
          <div class="p-8 md:p-10 space-y-8">
            <!-- Beneficios -->
            <div class="space-y-4">
              <h4 class="font-bold text-gray-900 text-md mb-4 flex items-center gap-2">
                <SparklesIcon class="w-6 h-6 text-primary" />
                Exclusivo para jugadoras
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <CheckCircleIcon class="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700 font-medium">Ver entrenamientos </span>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <CheckCircleIcon class="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700 font-medium">Confirmar asistencia</span>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <CheckCircleIcon class="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700 font-medium">Gestionar tu perfil</span>
                </div>
             
              </div>
            </div>

            <!-- Acciones -->
            <div class="pt-6 border-t border-gray-200 space-y-3">
              <!-- Si está autenticada -->
              <router-link
                v-if="esJugadoraAutenticada"
                to="/entrenamientos"
                class="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <CalendarDaysIcon class="w-6 h-6" />
                Ir a mi perfil
              </router-link>

              <!-- Si no está autenticada pero tiene acceso aprobado -->
              <router-link
                v-else-if="tieneAccesoAprobado"
                to="/login-jugadora"
                class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <ArrowRightOnRectangleIcon class="w-6 h-6" />
                Inicia Sesión
              </router-link>

              <!-- Si es nueva -->
              <div v-else class="space-y-3">
                <router-link
                  to="/solicitud-acceso"
                  class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary-dark to-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <UserPlusIcon class="w-6 h-6" />
                  Solicitar Acceso
                </router-link>
                
                <div class="text-center">
                  <p class="text-sm text-gray-600">
                    ¿Ya tienes cuenta? 
                    <router-link to="/login-jugadora" class="text-primary font-bold hover:underline inline-flex items-center gap-1">
                      Inicia sesión aquí
                      <ArrowRightIcon class="w-4 h-4" />
                    </router-link>
                  </p>
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
import { computed } from 'vue';
import { 
  CheckCircleIcon, 
  SparklesIcon, 
  CalendarDaysIcon, 
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';
import { jugadoraAuthUser } from '../firebase/jugadorasAuth';

const esJugadoraAutenticada = computed(() => jugadoraAuthUser.value !== null);

// Para verificar si tiene acceso aprobado pero no está autenticada
// (esto es más para UX, la verificación real ocurre en login)
const tieneAccesoAprobado = computed(() => false);
</script>
