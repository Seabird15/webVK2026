<template>
  <div class="min-h-screen bg-black py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Encabezado -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 class="text-3xl font-bold text-primary-dark mb-2">Selecciona tu categoría</h1>
        <p class="text-gray-600">Perteneces a ambos equipos. ¿En cuál deseas entrenar ahora?</p>
      </div>

      <!-- Opciones de categoría -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Ascenso -->
        <button
          @click="seleccionarCategoria('ascenso')"
          :disabled="isLoading"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow disabled:opacity-50 text-left"
        >
          <div class="text-center">
            <h2 class="text-2xl font-bold text-primary-dark mb-2">Equipo Ascenso</h2>
            <p class="text-gray-600 mb-6">
              Accede al área de entrenamientos del equipo de ascenso
            </p>
            <div class="text-sm text-gray-500">
              <p>• Ver entrenamientos</p>
              <p>• Inscribirse</p>
              <p>• Gestionar participación</p>
            </div>
          </div>
        </button>

        <!-- Escuela -->
        <button
          @click="seleccionarCategoria('escuela')"
          :disabled="isLoading"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow disabled:opacity-50 text-left"
        >
          <div class="text-center">
            <h2 class="text-2xl font-bold text-primary-dark mb-2">Equipo Escuela</h2>
            <p class="text-gray-600 mb-6">
              Accede al área de entrenamientos del equipo de escuela
            </p>
            <div class="text-sm text-gray-500">
              <p>• Ver entrenamientos</p>
              <p>• Inscribirse</p>
              <p>• Gestionar participación</p>
            </div>
          </div>
        </button>
      </div>

      <!-- Opción para cambiar después -->
      <div class="mt-8 text-center">
        <p class="text-white text-sm">
          Siempre podrás cambiar de categoría desde tu perfil
        </p>
      </div>

      <!-- Loader -->
      <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8">
          <p class="text-gray-600">Redirigiendo...</p>
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
  router.push('/entrenamientos');
};
</script>
