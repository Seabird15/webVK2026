<template>
  <div :class="['bg-black/50 rounded-lg p-4 border-2', borderClass]">
    <h4 :class="[titleColorClass, 'font-bold mb-4 text-center']">{{ titulo }}</h4>
    <div class="space-y-2">
      <div 
        v-for="(jugadora, index) in jugadoras" 
        :key="index" 
        class="flex items-center justify-between bg-white/5 p-2 rounded"
      >
        <span class="text-white text-sm">{{ jugadora.nombre }}</span>
        <div class="flex items-center gap-2">
          <button
            @click="$emit('restar-gol', index)"
            class="bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="jugadora.goles === 0 || guardando"
          >-</button>
          <span class="text-primary font-bold w-8 text-center">{{ jugadora.goles }}</span>
          <button
            @click="$emit('agregar-gol', index)"
            class="bg-green-500 hover:bg-green-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="guardando"
          >+</button>
        </div>
      </div>
    </div>
    <div :class="['mt-4 pt-4 border-t-2 text-center', borderClass]">
      <span :class="[titleColorClass, 'font-bold']">Total: {{ totalGoles }} goles</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  jugadoras: {
    type: Array,
    required: true
  },
  colorTheme: {
    type: String,
    required: true,
    validator: (value) => ['cyan', 'gray', 'red'].includes(value)
  },
  guardando: {
    type: Boolean,
    default: false
  }
});

defineEmits(['agregar-gol', 'restar-gol']);

const totalGoles = computed(() => 
  props.jugadoras?.reduce((sum, j) => sum + j.goles, 0) || 0
);

const colorClasses = {
  cyan: {
    border: 'border-cyan-400',
    title: 'text-cyan-400'
  },
  gray: {
    border: 'border-gray-400',
    title: 'text-gray-400'
  },
  red: {
    border: 'border-red-400',
    title: 'text-red-400'
  }
};

const borderClass = computed(() => colorClasses[props.colorTheme].border);
const titleColorClass = computed(() => colorClasses[props.colorTheme].title);
</script>
