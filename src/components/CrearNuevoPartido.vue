<template>
  <div class="bg-white rounded-2xl shadow-xl p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <PlusIcon class="w-6 h-6 text-blue-600" />
        </div>
        <h2 class="text-2xl font-black text-gray-900">Crear Nuevo Partido</h2>
      </div>
      <button
        @click="mostrarFormulario = !mostrarFormulario"
        class="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
      >
        {{ mostrarFormulario ? 'Cancelar' : 'Nuevo Partido' }}
      </button>
    </div>

    <Transition name="fade">
      <div v-if="mostrarFormulario" class="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <form @submit.prevent="manejarCrearPartido" class="space-y-4">
          <!-- Grid de dos columnas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Equipo -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Equipo</label>
              <select
                v-model="formulario.equipo"
                required
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="">Seleccionar equipo</option>
                <option value="ascenso">Ascenso</option>
                <option value="escuela">Escuela</option>
              </select>
            </div>

            <!-- Tipo de partido -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Tipo</label>
              <select
                v-model="formulario.tipo"
                required
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="">Seleccionar tipo</option>
                <option value="competicion">Competición</option>
                <option value="amistoso">Amistoso</option>
                <option value="liga">Liga</option>
              </select>
            </div>

            <!-- Fecha -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Fecha</label>
              <input
                v-model="formulario.fecha"
                type="date"
                required
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            <!-- Hora -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Hora</label>
              <input
                v-model="formulario.hora"
                type="time"
                required
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            <!-- Rival -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Rival</label>
              <input
                v-model="formulario.rival"
                type="text"
                placeholder="Nombre del rival"
                required
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            <!-- Lugar -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Lugar</label>
              <input
                v-model="formulario.lugar"
                type="text"
                placeholder="Ubicación del partido"
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="guardando"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
            >
              {{ guardando ? 'Creando...' : 'Crear Partido' }}
            </button>
            <button
              type="button"
              @click="limpiarFormulario"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition"
            >
              Limpiar
            </button>
          </div>
        </form>

        <!-- Mensaje de éxito/error -->
        <Transition name="fade">
          <div v-if="mensaje" :class="[
            'mt-4 p-4 rounded-lg font-bold text-sm',
            mensaje.tipo === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          ]">
            {{ mensaje.texto }}
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { crearPartido as crearPartidoFirebase } from '../firebase/partidos';

const mostrarFormulario = ref(false);
const guardando = ref(false);
const mensaje = ref(null);

const formulario = ref({
  equipo: '',
  tipo: '',
  fecha: '',
  hora: '',
  rival: '',
  lugar: ''
});

const manejarCrearPartido = async () => {
  // Validar
  if (!formulario.value.equipo || !formulario.value.tipo || !formulario.value.fecha || 
      !formulario.value.hora || !formulario.value.rival) {
    mensaje.value = {
      tipo: 'error',
      texto: 'Por favor completa todos los campos requeridos'
    };
    return;
  }

  guardando.value = true;
  try {
    const id = await crearPartidoFirebase({
      fecha: formulario.value.fecha,
      hora: formulario.value.hora,
      equipo: formulario.value.equipo,
      tipo: formulario.value.tipo,
      rival: formulario.value.rival,
      lugar: formulario.value.lugar
    });

    mensaje.value = {
      tipo: 'success',
      texto: 'Partido creado correctamente ✓'
    };

    limpiarFormulario();

    setTimeout(() => {
      mostrarFormulario.value = false;
      mensaje.value = null;
    }, 2000);
  } catch (err) {
    console.error('Error:', err);
    mensaje.value = {
      tipo: 'error',
      texto: 'Error al crear el partido'
    };
  } finally {
    guardando.value = false;
  }
};

const limpiarFormulario = () => {
  formulario.value = {
    equipo: '',
    tipo: '',
    fecha: '',
    hora: '',
    rival: '',
    lugar: ''
  };
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
