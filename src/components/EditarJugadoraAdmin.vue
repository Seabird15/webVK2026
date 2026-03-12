<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 p-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h3 class="font-black text-lg text-gray-900">Editar Jugadora</h3>
          <p class="text-xs text-gray-500 mt-1">{{ jugadora.nombre }} {{ jugadora.apellido }}</p>
        </div>
        <button 
          @click="cerrar" 
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-6 space-y-6">
        <!-- Información básica (solo lectura) -->
        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700">Nombre Completo</label>
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
            {{ jugadora.nombre }} {{ jugadora.apellido }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700">Email</label>
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 text-sm truncate">
            {{ jugadora.email || '-' }}
          </div>
        </div>

        <!-- Sección de Equipos -->
        <div class="space-y-3">
          <label class="block text-sm font-bold text-gray-700">Equipos</label>
          <p class="text-xs text-gray-500">Selecciona a qué equipos pertenece la jugadora</p>
          
          <div class="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <!-- Ascenso -->
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input 
                v-model="equiposSeleccionados" 
                type="checkbox" 
                value="ascenso"
                class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span class="flex-1 text-sm font-medium text-gray-700">Ascenso</span>
              <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Primera</span>
            </label>

            <!-- Escuela -->
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input 
                v-model="equiposSeleccionados" 
                type="checkbox" 
                value="escuela"
                class="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
              />
              <span class="flex-1 text-sm font-medium text-gray-700">Escuela</span>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Base</span>
            </label>

            <!-- Serie C -->
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input 
                v-model="equiposSeleccionados" 
                type="checkbox" 
                value="serieC"
                class="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />
              <span class="flex-1 text-sm font-medium text-gray-700">Serie C</span>
              <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Tercera</span>
            </label>
          </div>

          <!-- Información sobre "Ambos" -->
          <div v-if="equiposSeleccionados.length > 1" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-xs text-blue-700 font-semibold">
              ℹ️ Jugadora pertenecerá a {{ equiposSeleccionados.length }} equipos
            </p>
          </div>
        </div>

        <!-- Sección de peligro: Eliminar -->
        <div class="border-t pt-6 border-gray-200">
          <div class="space-y-3">
            <h4 class="text-sm font-bold text-red-700 flex items-center gap-2">
              <span class="text-lg">⚠️</span> Zona de peligro
            </h4>
            <p class="text-xs text-gray-600">
              Si eliminas este perfil, la jugadora perderá acceso a su cuenta y todos sus datos serán eliminados. Esta acción no se puede deshacer.
            </p>
            <button
              @click="confirmarEliminacion"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🗑️</span>
              <span>Eliminar Perfil Permanentemente</span>
            </button>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-xs font-semibold text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Footer con botones -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
        <button
          @click="cerrar"
          :disabled="isLoading"
          class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          @click="guardarCambios"
          :disabled="isLoading || !cambiosDetectados"
          class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="!isLoading">💾</span>
          <span v-if="isLoading" class="inline-block animate-spin">⏳</span>
          <span>{{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { actualizarPerfilJugadora, eliminarJugadora } from '../firebase/jugadorasAuth';

const props = defineProps({
  jugadora: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'actualizado', 'eliminado']);

const isLoading = ref(false);
const error = ref(null);
const equiposSeleccionados = ref([]);

// Inicializar equipos seleccionados basado en el equipo actual
const inicializarEquipos = () => {
  equiposSeleccionados.value = [];

  // Soportar tanto el formato antiguo (equipo: string) como el nuevo (equipos: array)
  if (Array.isArray(props.jugadora.equipos)) {
    equiposSeleccionados.value = [...props.jugadora.equipos];
  } else {
    const equipo = (props.jugadora.equipo || '').toLowerCase();
    if (equipo === 'ambos') {
      equiposSeleccionados.value = ['ascenso', 'escuela'];
    } else if (equipo === 'ascenso') {
      equiposSeleccionados.value = ['ascenso'];
    } else if (equipo === 'escuela') {
      equiposSeleccionados.value = ['escuela'];
    } else if (equipo === 'seriec') {
      equiposSeleccionados.value = ['serieC'];
    }
  }
};

// Detectar cambios
const cambiosDetectados = computed(() => {
  const equiposActuales = Array.isArray(props.jugadora.equipos) 
    ? props.jugadora.equipos
    : (props.jugadora.equipo === 'ambos' ? ['ascenso', 'escuela'] : [props.jugadora.equipo]);
  
  // Comparar arrays
  const ordenAdos = equiposActuales.sort().join(',');
  const ordenNew = equiposSeleccionados.value.sort().join(',');
  return ordenAdos !== ordenNew;
});

// Determinar el valor final del equipo basado en las selecciones
const determinarEquipoFinal = () => {
  if (equiposSeleccionados.value.length === 0) return ['ascenso']; // Default
  return [...equiposSeleccionados.value];
};

const guardarCambios = async () => {
  if (!cambiosDetectados.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const equiposFinal = determinarEquipoFinal();
    
    const actualizado = await actualizarPerfilJugadora(
      props.jugadora.id,
      {
        ...props.jugadora,
        equipos: equiposFinal
      }
    );

    if (actualizado) {
      emit('actualizado', { ...props.jugadora, equipos: equiposFinal });
      cerrar();
    } else {
      error.value = 'No se pudo guardar los cambios. Intenta de nuevo.';
    }
  } catch (err) {
    error.value = err.message || 'Error al guardar cambios';
  } finally {
    isLoading.value = false;
  }
};

const confirmarEliminacion = () => {
  const mensaje = `¿Estás seguro de que deseas eliminar el perfil de ${props.jugadora.nombre} ${props.jugadora.apellido}? Esta acción no se puede deshacer.`;
  
  if (window.confirm(mensaje)) {
    eliminarPerfil();
  }
};

const eliminarPerfil = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const eliminado = await eliminarJugadora(props.jugadora.id);

    if (eliminado) {
      emit('eliminado', props.jugadora.id);
      cerrar();
    } else {
      error.value = 'No se pudo eliminar el perfil. Intenta de nuevo.';
    }
  } catch (err) {
    error.value = err.message || 'Error al eliminar perfil';
  } finally {
    isLoading.value = false;
  }
};

const cerrar = () => {
  emit('close');
};

// Watch para inicializar equipos cuando se abre el modal
import { watch } from 'vue';
watch(() => props.visible, (newVal) => {
  if (newVal) {
    inicializarEquipos();
    error.value = null;
  }
});
</script>

<style scoped>
input[type="checkbox"]:checked {
  background-color: currentColor;
}
</style>
