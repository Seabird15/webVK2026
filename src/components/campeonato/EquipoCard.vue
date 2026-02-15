<template>
  <div 
    :class="[
      'bg-gradient-to-br rounded-lg p-6 hover:shadow-xl hover:scale-105 transition-all border-2',
      gradientClass,
      borderClass
    ]"
  >
    <div class="flex flex-col items-center text-center">
      <!-- Logo -->
      <div class="w-20 h-20 bg-white rounded-full p-3 mb-4 shadow-lg">
        <img :src="logoSrc" :alt="equipo.nombre" class="w-full h-full object-contain" />
      </div>
      
      <!-- Nombre y Capitana -->
      <h4 class="text-2xl font-400 text-white mb-2" style="font-family: 'Collegiate Black', sans-serif;">
        {{ equipo.nombre }}
      </h4>
      <div class="flex items-center gap-2 mb-4" :class="textColorClass">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        <span class="text-sm font-bold">Capitana: {{ equipo.capitana }}</span>
      </div>
      
      <!-- Plantel -->
      <div class="w-full rounded-lg p-4 text-left" :class="bgColorClass">
        <p :class="[textColorSecondary, 'text-xs font-bold mb-2 uppercase']">
          Plantel ({{ jugadorasCount }} jugadoras)
        </p>
        
        <div class="space-y-2">
          <!-- Goleadoras -->
          <div v-if="goleadoras.length > 0" class="mb-3">
            <p :class="[textColorClass, 'text-xs font-bold mb-2 flex items-center gap-1']">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              GOLEADORAS
            </p>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="jugadora in goleadoras" 
                :key="jugadora.nombre" 
                :class="[
                  'flex items-center justify-between px-2 py-1.5 rounded border',
                  bgGoleadoraClass,
                  borderGoleadoraClass
                ]"
              >
                <div class="flex items-center gap-1">
                  <svg :class="[iconColorClass, 'w-3 h-3']" fill="currentColor" viewBox="0 0 24 24">
                    <path v-if="jugadora.capitana" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    <circle v-else cx="12" cy="12" r="3"/>
                  </svg>
                  <span :class="[textClass, 'text-xs', jugadora.capitana ? 'font-bold' : '']">
                    {{ jugadora.nombre }}
                  </span>
                </div>
                <span :class="[iconColorClass, 'font-black text-sm']">{{ jugadora.goles }}</span>
              </div>
            </div>
          </div>
          
          <!-- Plantel completo -->
          <div>
            <p :class="[textColorSecondary, 'text-xs font-bold mb-2']">PLANTEL COMPLETO</p>
            <div class="grid grid-cols-2 gap-1.5 text-white/70 text-xs">
              <div v-for="jugadora in equipo.jugadoras" :key="jugadora.nombre" class="flex items-center gap-1">
                <svg :class="[iconColorClass, 'w-2.5 h-2.5 opacity-50']" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{{ jugadora.nombre }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Total de goles -->
      <div class="mt-3 text-primary font-bold text-xl">
        {{ totalGoles }} Goles
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  equipo: {
    type: Object,
    required: true
  },
  equipoKey: {
    type: String,
    required: true
  },
  colorTheme: {
    type: String,
    required: true,
    validator: (value) => ['cyan', 'gray', 'red'].includes(value)
  }
});

const logoSrc = computed(() => {
  const logos = {
    verserkers: '/src/assets/versekersLogo.jpeg',
    internadas: '/src/assets/internadasLogo.jpeg',
    siemprealpalo: '/src/assets/siemprealpaloLogo.jpeg'
  };
  return logos[props.equipoKey] || '';
});

const jugadorasCount = computed(() => props.equipo.jugadoras?.length || 0);
const goleadoras = computed(() => props.equipo.jugadoras?.filter(j => j.goles > 0) || []);
const totalGoles = computed(() => props.equipo.jugadoras?.reduce((sum, j) => sum + j.goles, 0) || 0);

// Clases dinámicas basadas en el tema de color
const colorClasses = {
  cyan: {
    gradient: 'from-cyan-900/50 to-cyan-700/30',
    border: 'border-cyan-400',
    text: 'text-cyan-300',
    textSecondary: 'text-cyan-200',
    textClass: 'text-cyan-100',
    bg: 'bg-cyan-900/30',
    bgGoleadora: 'bg-cyan-400/10',
    borderGoleadora: 'border-cyan-400/30',
    icon: 'text-cyan-400'
  },
  gray: {
    gradient: 'from-gray-900/50 to-gray-700/30',
    border: 'border-gray-400',
    text: 'text-gray-300',
    textSecondary: 'text-gray-200',
    textClass: 'text-gray-100',
    bg: 'bg-gray-900/30',
    bgGoleadora: 'bg-gray-400/10',
    borderGoleadora: 'border-gray-400/30',
    icon: 'text-gray-400'
  },
  red: {
    gradient: 'from-red-900/50 to-red-700/30',
    border: 'border-red-400',
    text: 'text-red-300',
    textSecondary: 'text-red-200',
    textClass: 'text-red-100',
    bg: 'bg-red-900/30',
    bgGoleadora: 'bg-red-400/10',
    borderGoleadora: 'border-red-400/30',
    icon: 'text-red-400'
  }
};

const gradientClass = computed(() => colorClasses[props.colorTheme].gradient);
const borderClass = computed(() => colorClasses[props.colorTheme].border);
const textColorClass = computed(() => colorClasses[props.colorTheme].text);
const textColorSecondary = computed(() => colorClasses[props.colorTheme].textSecondary);
const textClass = computed(() => colorClasses[props.colorTheme].textClass);
const bgColorClass = computed(() => colorClasses[props.colorTheme].bg);
const bgGoleadoraClass = computed(() => colorClasses[props.colorTheme].bgGoleadora);
const borderGoleadoraClass = computed(() => colorClasses[props.colorTheme].borderGoleadora);
const iconColorClass = computed(() => colorClasses[props.colorTheme].icon);
</script>
