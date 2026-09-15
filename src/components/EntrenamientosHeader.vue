<template>
  <header class="relative z-40 overflow-hidden border-b border-primary/20 bg-linear-to-b from-[#0b1718] via-[#071112] to-black pt-3 pb-4 text-white sm:pt-5 sm:pb-8">
    <div class="absolute inset-0 opacity-20">
      <div class="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary/5 blur-3xl"></div>
    </div>

    <div class="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6 lg:px-8">
      <div class="min-w-0 flex-1">
        <p class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-primary/80 sm:text-[0.75rem]">Zona Jugadoras</p>
        <h1 class="mt-1 text-3xl font-black uppercase leading-tight sm:mt-2 sm:text-5xl lg:text-6xl" style="font-family: 'Gobold High', system-ui, sans-serif;">Entrenamientos</h1>
        <p v-if="equipo" class="mt-1 text-xs font-semibold text-white/70 sm:mt-2 sm:text-base">
          <span class="inline-block rounded-full border border-primary/40 bg-primary/20 px-2.5 py-1 sm:px-3 sm:py-1.5">{{ etiquetaEquipo }}</span>
        </p>
      </div>

      <button
        type="button"
        aria-label="Cerrar sesión"
        class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-95 sm:w-auto sm:px-5 sm:py-3 sm:text-base"
        @click="$emit('logout')"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="text-sm">Cerrar sesión</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

defineEmits(['logout']);

const props = defineProps({
  equipo: {
    type: String,
    default: ''
  }
});

const etiquetaEquipo = computed(() => ({
  ascenso: 'Equipo Ascenso',
  escuela: 'Equipo Escuela',
  serieC: 'Serie C',
  ambos: 'Eventos'
}[props.equipo] || 'Eventos'));
</script>
