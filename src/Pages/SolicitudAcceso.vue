<template>
  <div class="min-h-screen bg-black py-12 px-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-2xl p-8">
      <!-- Encabezado -->
      <div class="text-center mb-8">
        <h1 class="text-6xl font-bold text-primary-dark mb-2" style="font-family: 'Gobold High', sans-serif;">Vikingas</h1>
        <p class="text-gray-600">Solicitar acceso</p>
      </div>

      <!-- Mensaje de éxito -->
      <div v-if="solicitudEnviada" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 class="text-lg font-bold text-green-800 mb-2">¡Solicitud enviada!</h2>
        <p class="text-green-700 mb-4">
          Tu solicitud ha sido enviada correctamente. El administrador revisará tu solicitud y te notificará pronto.
        </p>
        <router-link
          to="/"
          class="inline-block bg-primary-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-primary transition-colors"
        >
          Volver al inicio
        </router-link>
      </div>

      <!-- Formulario -->
      <form v-else @submit.prevent="handleSolicitar" class="space-y-6">
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
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            :disabled="isLoading"
          />
          <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <!-- Confirmar contraseña -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <input
            v-model="passwordConfirm"
            type="password"
            required
            minlength="6"
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
          {{ isLoading ? 'Enviando...' : 'Solicitar acceso' }}
        </button>

        <!-- Link login -->
        <div class="text-center pt-4 border-t border-gray-200">
          <p class="text-gray-600 text-sm mb-2">¿Ya tienes acceso aprobado?</p>
          <router-link
            to="/login-jugadora"
            class="text-primary-dark font-bold hover:text-primary transition-colors"
          >
            Inicia sesión aquí
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { solicitarAcceso, isLoadingJugadora, errorJugadora } from '../firebase/jugadorasAuth';

const router = useRouter();
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const solicitudEnviada = ref(false);
const isLoading = ref(false);
const error = ref(null);

const handleSolicitar = async () => {
  error.value = null;

  // Validaciones
  if (password.value !== passwordConfirm.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  isLoading.value = true;
  const success = await solicitarAcceso(email.value, password.value);
  isLoading.value = false;

  if (success) {
    solicitudEnviada.value = true;
  } else {
    error.value = errorJugadora.value || 'Error al enviar la solicitud';
  }
};
</script>

<style scoped>
input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style>
