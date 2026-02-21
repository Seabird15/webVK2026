<template>
  <div class="min-h-screen bg-linear-to-br from-black via-primary-dark to-black flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
      <div class="bg-linear-to-r from-primary-dark to-primary text-white px-8 py-7">
        <div class="flex items-center justify-center gap-3 mb-3">
      
        </div>
        <h1 class="text-5xl font-bold text-center" style="font-family: 'Gobold High', sans-serif;">A D M I N </h1>
        <p class="text-center text-white/90 text-sm mt-2 font-semibold">Panel administrativo y cuerpo técnico</p>
      </div>

      <div class="p-8">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="admin@example.com"
          />
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="••••••••"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {{ error }}
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-linear-to-r from-primary-dark to-primary text-white py-3 rounded-xl font-black uppercase tracking-wide hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer shadow-lg"
        >
          {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="mt-6 p-3 rounded-xl bg-blue-50 border border-blue-200">
        <p class="text-center text-blue-800 text-xs font-semibold">
          Sesión persistente activada: tu acceso queda iniciado en este dispositivo.
        </p>
      </div>

      <p class="text-center text-gray-600 text-sm mt-5">
        ¿No tienes cuenta? Solicítala al administrador principal.
      </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
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

watchEffect(() => {
  if (authUser.value && (userRole.value === 'admin' || userRole.value === 'coach')) {
    router.push('/admin');
  }
});

const handleLogin = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    router.push('/admin');
  }
};
</script>
