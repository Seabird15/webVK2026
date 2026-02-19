<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="cancelar">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
          <!-- Header con gradiente según tipo -->
          <div 
            :class="[
              'p-6 text-white',
              tipo === 'danger' ? 'bg-linear-to-r from-red-500 to-red-600' :
              tipo === 'warning' ? 'bg-linear-to-r from-yellow-500 to-orange-500' :
              'bg-linear-to-r from-blue-500 to-blue-600'
            ]"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <ExclamationTriangleIcon v-if="tipo === 'danger' || tipo === 'warning'" class="w-7 h-7" />
                <QuestionMarkCircleIcon v-else class="w-7 h-7" />
              </div>
              <h3 class="text-xl font-black flex-1">{{ titulo }}</h3>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <p class="text-gray-700 text-sm leading-relaxed">{{ mensaje }}</p>
            
            <!-- Detalles adicionales si existen -->
            <div v-if="detalles" class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs text-gray-600">{{ detalles }}</p>
            </div>
          </div>

          <!-- Footer con botones -->
          <div class="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              @click="cancelar"
              :disabled="cargando"
              class="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ textoCancelar }}
            </button>
            <button
              @click="confirmar"
              :disabled="cargando"
              :class="[
                'flex-1 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
                tipo === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' :
                tipo === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                'bg-blue-500 hover:bg-blue-600 text-white'
              ]"
            >
              <span v-if="!cargando">{{ textoConfirmar }}</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ExclamationTriangleIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  titulo: {
    type: String,
    default: '¿Estás seguro?'
  },
  mensaje: {
    type: String,
    required: true
  },
  detalles: {
    type: String,
    default: null
  },
  tipo: {
    type: String,
    default: 'warning', // 'danger', 'warning', 'info'
    validator: (value) => ['danger', 'warning', 'info'].includes(value)
  },
  textoConfirmar: {
    type: String,
    default: 'Confirmar'
  },
  textoCancelar: {
    type: String,
    default: 'Cancelar'
  },
  cargando: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'confirmar', 'cancelar']);

const confirmar = () => {
  if (!props.cargando) {
    emit('confirmar');
  }
};

const cancelar = () => {
  if (!props.cargando) {
    emit('update:modelValue', false);
    emit('cancelar');
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
