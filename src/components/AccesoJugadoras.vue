<template>
  <div class="w-full bg-linear-to-r from-black via-primary-dark to-primary py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center mb-12">
        <h2 style="font-family: 'Gobold High', sans-serif;" class="text-lg lg:text-6xl md:text-4xl tracking-wider leading-2 font-bold text-white mb-4">
          ¿Eres parte de la comunidad Vikingas?
        </h2>
        <p class="text-white/80 text-md my-7">
          Accede a los entrenamientos y crea tu perfil
        </p>
      </div>

      <!-- Grid de opciones -->
      <div class="lg:w-2/6 mx-auto">
        <!-- Opción Jugadora -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-black p-6 text-white text-center">
          <img src="../assets/logoVk.png" alt="" class="w-24 mx-auto my-2 opacity-80">
            <h3 class="text-xl font-300  tracking-widest" style="font-family: 'Collegiate Black', sans-serif;">SOY JUGADORA VK</h3>
          </div>

          <div class="p-8 space-y-6">
            <div class="space-y-3">
              <h4 class="font-bold text-gray-900 text-lg">Con esta opción puedes:</h4>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-center gap-2">
                  <span class="text-secondary font-bold">✓</span> Solicitar acceso al sistema
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-secondary font-bold">✓</span> Ver entrenamientos
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-secondary font-bold">✓</span> Inscribirse a entrenamientos
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-secondary font-bold">✓</span> Gestionar tu perfil
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-gray-200 space-y-2">
              <!-- Si está autenticada -->
              <router-link
                v-if="esJugadoraAutenticada"
                to="/entrenamientos"
                class="block w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-center hover:bg-blue-600 transition-colors"
              >
                Ir a Entrenamientos
              </router-link>

              <!-- Si no está autenticada pero tiene acceso aprobado -->
              <router-link
                v-else-if="tieneAccesoAprobado"
                to="/login-jugadora"
                class="block w-full bg-primary text-white py-3 rounded-lg font-bold text-center hover:bg-blue-600 transition-colors"
              >
                Inicia Sesión
              </router-link>

              <!-- Si es nueva -->
              <div v-else class="space-y-2">
                <router-link
                  to="/solicitud-acceso"
                  class="block w-full bg-primary-dark text-white py-3 rounded-lg font-bold text-center hover:bg-primary-dark/80 transition-colors"
                >
                  Solicitar Acceso
                </router-link>
                <p class="text-xs text-gray-600 text-center">
                  O <router-link to="/login-jugadora" class="text-blue-500 font-bold hover:underline">inicia sesión</router-link> si ya fuiste aprobada
                </p>
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
import { jugadoraAuthUser } from '../firebase/jugadorasAuth';

const esJugadoraAutenticada = computed(() => jugadoraAuthUser.value !== null);

// Para verificar si tiene acceso aprobado pero no está autenticada
// (esto es más para UX, la verificación real ocurre en login)
const tieneAccesoAprobado = computed(() => false);
</script>
