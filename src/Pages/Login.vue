<template>
  <div class="min-h-screen bg-linear-to-br from-black to-primary-dark flex items-center justify-center px-4">
    <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-6xl font-bold text-primary-dark mb-2"  style="font-family: 'Gobold High', sans-serif;">Vikingas</h1>
        <p class="text-gray-600">Panel Profe y admin</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="admin@example.com"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary-dark text-white py-2 rounded-lg font-bold uppercase hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p class="text-center text-gray-600 text-sm mt-6">
        ¿No tienes cuenta? Solicítale al administrador
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { login, isLoading, error, authUser, userRole } from '../firebase/auth';

const router = useRouter();
const email = ref('');
const password = ref('');

// Mostrar información del usuario autenticado
const userInfo = computed(() => {
  if (authUser.value) {
    return `Autenticado como: ${authUser.value.email}`;
  }
  return null;
});

const handleLogin = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    router.push('/admin');
  }
};
</script>
