<template>
  <section v-if="resultados.length > 0" class="bg-linear-to-b from-neutral-950 via-black to-neutral-900 py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p class="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2">Resumen reciente</p>
          <h2 class="text-3xl md:text-5xl font-black text-white" style="font-family: 'Gobold High', sans-serif;">ULTIMOS RESULTADOS</h2>
        </div>
        <p class="text-white/65 text-sm md:max-w-sm">
         
        </p>
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="resultado in resultados"
          :key="resultado.id"
          class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
        >
          <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-yellow-300 to-primary"></div>

          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <p class="text-primary text-xs font-black uppercase tracking-[0.25em]">{{ resultado.nombreLiga }}</p>
              <h3 class="text-white text-xl font-black mt-2">{{ resultado.categoria }}</h3>
            </div>
            <span class="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
              {{ resultado.fecha }}
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-white/45 text-xs uppercase tracking-[0.2em] mb-1">Rival</p>
              <p class="text-white text-lg font-semibold">{{ resultado.rival }}</p>
            </div>

            <div class="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <p class="text-white/45 text-xs uppercase tracking-[0.2em] mb-2">Resultado final</p>
              <div class="flex items-center justify-around gap-4 text-sm text-white/70 mb-3">
                <span class="font-bold text-white">Vikingas</span>
                <span class="font-bold">{{ resultado.rival }}</span>
              </div>
              <p class="text-3xl font-black flex justify-around text-primary"><span>{{ resultado.marcadorVikingas }} </span>- <span>{{ resultado.marcadorRival }}</span></p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { escucharUltimosResultados, obtenerUltimosResultados } from '../firebase/ultimosResultados';

const resultados = ref([]);
let unsubscribe = null;

onMounted(async () => {
  try {
    resultados.value = await obtenerUltimosResultados();
  } catch (error) {
    resultados.value = [];
  }

  unsubscribe = escucharUltimosResultados((datos) => {
    resultados.value = datos;
  });
});

onUnmounted(() => {
  if (typeof unsubscribe === 'function') {
    unsubscribe();
  }
});
</script>