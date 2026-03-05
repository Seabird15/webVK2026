<template>
  <div class="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- Patrón de líneas diagonales de fondo -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute w-full h-full" style="background: repeating-linear-gradient(45deg, white, white 10px, transparent 10px, transparent 20px);"></div>
    </div>

    <!-- Círculos decorativos sutiles -->
    <div class="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

    <div class="max-w-md w-full relative z-10">
      <!-- Card principal estilo jersey/credencial deportiva -->
      <div class="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border-4 border-primary">
        <!-- Franja superior deportiva -->
        <div class="h-3 bg-gradient-to-r from-primary-dark via-primary to-primary-light"></div>
        
        <!-- Header con logo -->
        <div class="bg-white px-8 pt-8 pb-6 text-center relative">
          <!-- Logo del club -->
          <div class="mb-4 relative inline-block">
            <div class="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            <img 
              src="@/assets/logoVk.png" 
              alt="VK Vikingas" 
              class="w-24 h-24 mx-auto relative z-10 drop-shadow-lg"
            />
          </div>
          
          <h1 class="text-4xl font-black mb-2 text-gray-900 tracking-tight" style="font-family: 'Gobold High', sans-serif;">
            VK VIKINGAS
          </h1>
          
          <!-- Badge de jugadora -->
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-primary-dark to-primary text-white px-6 py-2 rounded-full shadow-lg">
            <UserGroupIcon class="w-5 h-5" />
            <span class="font-black text-sm uppercase tracking-widest">Acceso Jugadoras</span>
          </div>

          <!-- Decoración tipo jersey -->
          <div class="absolute top-4 right-4 text-primary/10 font-black text-6xl" style="font-family: 'Gobold High', sans-serif;">
            #
          </div>
          <div class="absolute bottom-4 left-4 text-primary/10 font-black text-6xl" style="font-family: 'Gobold High', sans-serif;">
            VK
          </div>
        </div>

        <!-- Separador deportivo -->
        <div class="flex items-center justify-center gap-2 px-8 py-3 bg-gray-50">
          <div class="flex-1 h-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30 rounded"></div>
          <BoltIcon class="w-5 h-5 text-primary" />
          <div class="flex-1 h-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/30 rounded"></div>
        </div>

        <!-- Formulario -->
        <div class="p-8 bg-white">
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-wider">
                <EnvelopeIcon class="w-4 h-4 text-primary" />
                Correo Electrónico
              </label>
              <div class="relative group">
                <input
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold group-hover:border-gray-300"
                  placeholder="tuemail@ejemplo.com"
                  :disabled="isLoading"
                />
                <div class="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserCircleIcon class="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <!-- Contraseña -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-wider">
                <ShieldCheckIcon class="w-4 h-4 text-primary" />
                Contraseña
              </label>
              <div class="relative group">
                <input
                  v-model="password"
                  type="password"
                  required
                  class="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold group-hover:border-gray-300"
                  placeholder="••••••••"
                  :disabled="isLoading"
                />
                <div class="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                  <LockClosedIcon class="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <!-- Errores -->
            <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
              <ExclamationCircleIcon class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p class="text-red-700 text-sm font-bold">{{ error }}</p>
            </div>

            <!-- Botón submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-primary-dark to-primary text-white py-4 rounded-xl font-black uppercase tracking-wider hover:scale-[1.02] hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-base relative overflow-hidden group"
            >
              <!-- Efecto hover -->
              <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <template v-if="isLoading">
                <ArrowPathIcon class="w-5 h-5 animate-spin relative z-10" />
                <span class="relative z-10">Iniciando...</span>
              </template>
              <template v-else>
                <BoltIcon class="w-5 h-5 relative z-10" />
                <span class="relative z-10">Entrar al Equipo</span>
              </template>
            </button>
          </form>
        </div>

        <!-- Footer de la card -->
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200">
          <div class="text-center">
            <p class="text-gray-600 text-sm font-semibold mb-3">¿Primera vez en la app?</p>
            <router-link
              to="/solicitud-acceso"
              class="inline-flex items-center gap-2 text-primary-dark font-black hover:text-primary transition-colors group text-sm"
            >
              <UserPlusIcon class="w-5 h-5 group-hover:scale-110 transition-transform" />
              Solicitar Acceso al Equipo
              <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </router-link>
          </div>
        </div>

        <!-- Franja inferior deportiva -->
        <div class="h-3 bg-gradient-to-r from-primary-light via-primary to-primary-dark"></div>
      </div>

      <!-- Mensaje informativo -->
      <div class="mt-8 text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20">
          <SparklesIcon class="w-5 h-5 text-primary-light" />
          <p class="text-sm font-bold">
            Portal exclusivo para jugadoras VK Vikingas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  UserGroupIcon, 
  SparklesIcon, 
  EnvelopeIcon, 
  UserCircleIcon, 
  ShieldCheckIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  BoltIcon,
  ArrowPathIcon,
  UserPlusIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';
import { loginJugadora, isLoadingJugadora, errorJugadora, tienePerfılCompleto, obtenerEquipoJugadora } from '../firebase/jugadorasAuth';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  error.value = null;
  
  // Validar campos
  if (!email.value || !password.value) {
    error.value = 'Por favor completa email y contraseña';
    return;
  }

  isLoading.value = true;

  const success = await loginJugadora(email.value, password.value);
  isLoading.value = false;

  if (success) {
    // Verificar si tiene perfil completo
    const perfilCompleto = await tienePerfılCompleto();
    if (!perfilCompleto) {
      // Ir a completar perfil
      router.push('/completar-perfil');
    } else {
      // Verificar equipo y redirigir
      const equipo = obtenerEquipoJugadora();
      if (equipo === 'ambos') {
        router.push('/seleccionar-categoria');
      } else {
        router.push('/entrenamientos');
      }
    }
  } else {
    error.value = errorJugadora.value || 'Error al iniciar sesión';
  }
};
</script>

<style scoped>
input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Efecto sutil en el patrón de fondo */
@keyframes fadePattern {
  0%, 100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.08;
  }
}

.absolute.inset-0 > div {
  animation: fadePattern 4s ease-in-out infinite;
}

/* Efecto de brillo en el logo */
@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(var(--primary), 0.3));
  }
  50% {
    filter: drop-shadow(0 0 16px rgba(var(--primary), 0.5));
  }
}

img[alt="VK Vikingas"] {
  animation: glow 3s ease-in-out infinite;
}
</style>
