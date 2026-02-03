<template>
  <div class="min-h-screen bg-black py-12 px-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-2xl p-8">
      <!-- Encabezado -->
      <div class="text-center mb-8">
        <h1 class="text-6xl font-bold text-primary-dark mb-2" style="font-family: 'Gobold High', sans-serif;">Vikingas</h1>
        <p class="text-gray-600">App Entrenamientos</p>
      </div>

      <!-- Formulario login -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="tu@email.com"
            :disabled="isLoading"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            :disabled="isLoading"
          />
        </div>

        <!-- Errores -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm font-semibold">{{ error }}</p>
        </div>

        <!-- Botón submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary-dark text-white py-2 rounded-lg font-bold uppercase hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ isLoading ? 'Iniciando...' : 'Iniciar sesión' }}
        </button>

        <!-- Link registro -->
        <div class="text-center pt-4 border-t border-gray-200">
          <p class="text-gray-600 text-sm mb-2">¿No tienes cuenta?</p>
          <router-link
            to="/solicitud-acceso"
            class="text-primary-dark font-bold hover:text-primary transition-colors"
          >
            Solicita acceso aquí
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
    console.log('Login exitoso');
    // Verificar si tiene perfil completo
    const perfilCompleto = await tienePerfılCompleto();
    if (!perfilCompleto) {
      console.log('Perfil incompleto, redirigiendo a completar-perfil');
      // Ir a completar perfil
      router.push('/completar-perfil');
    } else {
      console.log('Perfil completo, redirigiendo según equipo');
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
    console.log('Login fallido:', error.value);
  }
};
</script>

<style scoped>
input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style>
