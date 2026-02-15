<template>
  <div class="space-y-6">
    <!-- Equipo Local -->
    <div :class="['bg-black/30 rounded-lg p-4 border-2', `border-${equipoLocalData.color}-400`]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white rounded-full p-2">
            <img :src="equipoLocalData.logoSrc" :alt="equipoLocalData.nombre" class="w-full h-full object-contain" />
          </div>
          <div>
            <h4 class="text-white font-bold">{{ equipoLocalData.nombre }}</h4>
            <p :class="['text-sm', `text-${equipoLocalData.color}-400`]">
              {{ golesLocal }} goles
            </p>
          </div>
        </div>
        <button
          @click="$emit('remover-gol-local')"
          :disabled="golesLocal === 0 || guardando"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          - Quitar Gol
        </button>
      </div>
      
      <!-- Goleadoras del equipo local -->
      <div v-if="goleadorasLocal.length > 0" class="mb-3 bg-white/5 rounded p-2">
        <p :class="['text-xs font-bold mb-2', `text-${equipoLocalData.color}-400`]">GOLEADORAS:</p>
        <div class="space-y-1">
          <div v-for="(gol, index) in goleadorasLocal" :key="index" class="text-white/80 text-xs flex items-center gap-2">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8"/>
            </svg>
            {{ gol.jugadora }}
          </div>
        </div>
      </div>
      
      <!-- Selector de jugadora local -->
      <div class="flex gap-2">
        <select 
          v-model="jugadoraLocalSeleccionada"
          class="flex-1 bg-white/10 text-white rounded px-3 py-2 text-sm border border-white/20 focus:border-primary focus:outline-none"
        >
          <option value="" class="bg-gray-800">Seleccionar jugadora...</option>
          <option 
            v-for="jugadora in jugadorasLocal" 
            :key="jugadora"
            :value="jugadora"
            class="bg-gray-800"
          >
            {{ jugadora }}
          </option>
        </select>
        <button
          @click="agregarLocal"
          :disabled="!jugadoraLocalSeleccionada || guardando"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          + Agregar
        </button>
      </div>
    </div>
    
    <!-- Equipo Visitante -->
    <div :class="['bg-black/30 rounded-lg p-4 border-2', `border-${equipoVisitaData.color}-400`]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white rounded-full p-2">
            <img :src="equipoVisitaData.logoSrc" :alt="equipoVisitaData.nombre" class="w-full h-full object-contain" />
          </div>
          <div>
            <h4 class="text-white font-bold">{{ equipoVisitaData.nombre }}</h4>
            <p :class="['text-sm', `text-${equipoVisitaData.color}-400`]">
              {{ golesVisita }} goles
            </p>
          </div>
        </div>
        <button
          @click="$emit('remover-gol-visita')"
          :disabled="golesVisita === 0 || guardando"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          - Quitar Gol
        </button>
      </div>
      
      <!-- Goleadoras del equipo visitante -->
      <div v-if="goleadorasVisita.length > 0" class="mb-3 bg-white/5 rounded p-2">
        <p :class="['text-xs font-bold mb-2', `text-${equipoVisitaData.color}-400`]">GOLEADORAS:</p>
        <div class="space-y-1">
          <div v-for="(gol, index) in goleadorasVisita" :key="index" class="text-white/80 text-xs flex items-center gap-2">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8"/>
            </svg>
            {{ gol.jugadora }}
          </div>
        </div>
      </div>
      
      <!-- Selector de jugadora visitante -->
      <div class="flex gap-2">
        <select 
          v-model="jugadoraVisitaSeleccionada"
          class="flex-1 bg-white/10 text-white rounded px-3 py-2 text-sm border border-white/20 focus:border-primary focus:outline-none"
        >
          <option value="" class="bg-gray-800">Seleccionar jugadora...</option>
          <option 
            v-for="jugadora in jugadorasVisita" 
            :key="jugadora"
            :value="jugadora"
            class="bg-gray-800"
          >
            {{ jugadora }}
          </option>
        </select>
        <button
          @click="agregarVisita"
          :disabled="!jugadoraVisitaSeleccionada || guardando"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          + Agregar
        </button>
      </div>
    </div>
    
    <!-- Botones de control -->
    <div class="flex justify-between items-center pt-3 border-t border-white/10">
      <div class="flex gap-2">
        <button
          v-if="partido.estado !== 'EN_CURSO'"
          @click="$emit('iniciar-partido')"
          class="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded font-bold transition text-xs"
        >
          ▶ Iniciar Partido
        </button>
        <button
          v-if="partido.estado === 'EN_CURSO'"
          @click="$emit('finalizar-partido')"
          class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-bold transition text-xs"
        >
          ✓ Finalizar Partido
        </button>
      </div>
      <button
        @click="$emit('cancelar')"
        class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-bold transition text-sm"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useEquipoConfig } from '../../composables/useEquipoConfig';

const props = defineProps({
  partido: {
    type: Object,
    required: true
  },
  jugadorasLocal: {
    type: Array,
    required: true
  },
  jugadorasVisita: {
    type: Array,
    required: true
  },
  golesLocal: {
    type: Number,
    required: true
  },
  golesVisita: {
    type: Number,
    required: true
  },
  goleadorasLocal: {
    type: Array,
    required: true
  },
  goleadorasVisita: {
    type: Array,
    required: true
  },
  guardando: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'agregar-gol-local',
  'agregar-gol-visita',
  'remover-gol-local',
  'remover-gol-visita',
  'iniciar-partido',
  'finalizar-partido',
  'cancelar'
]);

const { getEquipoData, getEquipoLogo } = useEquipoConfig();

const jugadoraLocalSeleccionada = ref('');
const jugadoraVisitaSeleccionada = ref('');

const equipoLocalData = computed(() => {
  const data = getEquipoData(props.partido.equipoLocal);
  return {
    ...data,
    logoSrc: getEquipoLogo(props.partido.equipoLocal)
  };
});

const equipoVisitaData = computed(() => {
  const data = getEquipoData(props.partido.equipoVisita);
  return {
    ...data,
    logoSrc: getEquipoLogo(props.partido.equipoVisita)
  };
});

const agregarLocal = () => {
  if (jugadoraLocalSeleccionada.value) {
    emit('agregar-gol-local', jugadoraLocalSeleccionada.value);
    jugadoraLocalSeleccionada.value = '';
  }
};

const agregarVisita = () => {
  if (jugadoraVisitaSeleccionada.value) {
    emit('agregar-gol-visita', jugadoraVisitaSeleccionada.value);
    jugadoraVisitaSeleccionada.value = '';
  }
};
</script>
