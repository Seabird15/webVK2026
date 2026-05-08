<template>
  <section v-if="resultadosVisibles.length > 0" class="bg-linear-to-b from-neutral-950 via-black to-neutral-900 py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p class="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2">Resumen reciente</p>
          <h2 class="text-3xl md:text-5xl font-black text-white" style="font-family: 'Gobold High', sans-serif;">ÚLTIMOS RESULTADOS</h2>
        </div>
        <p class="text-white/65 text-sm md:max-w-sm">
         
        </p>
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="resultado in resultadosVisibles"
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

            <button
              v-if="resultado.goleadoras && resultado.goleadoras.length"
              @click="abrirGoleadoras(resultado)"
              class="w-full cursor-pointer rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-left transition-colors duration-200 hover:border-primary/40 hover:bg-primary/12"
            >
              <p class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary">Goleadoras</p>
              <p class="mt-1 text-sm font-semibold text-white">Ver goleadoras de Vikingas</p>
            </button>
          </div>
        </article>
      </div>
    </div>

    <div
      v-if="resultadoSeleccionado"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      @click.self="cerrarGoleadoras"
    >
      <div class="w-full max-w-lg rounded-3xl border border-white/10 bg-[#121212] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-6">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-primary">Ultimos resultados</p>
            <h3 class="mt-2 text-xl font-black text-white sm:text-2xl">Goleadoras de Vikingas</h3>
            <p class="mt-1 text-sm text-white/60">Vikingas vs {{ resultadoSeleccionado.rival }}</p>
          </div>

          <button
            @click="cerrarGoleadoras"
            class="shrink-0 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>

        <div class="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          <div
            v-for="(gol, idx) in resultadoSeleccionado.goleadoras"
            :key="`${resultadoSeleccionado.id}-gol-${idx}`"
            class="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/8 bg-white/4 px-4 py-3 text-sm text-white"
          >
            <span class="font-semibold">{{ gol.jugadoraNombre || gol.jugadora || 'Goleadora' }}</span>
            <span v-if="mostrarMinuto(gol.minuto)" class="font-black text-primary">{{ mostrarMinuto(gol.minuto) }}</span>
            <span v-else class="text-xs font-bold uppercase text-white/40">Gol</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { escucharUltimosResultados, obtenerUltimosResultados } from '../firebase/ultimosResultados';

const resultados = ref([]);
const resultadosVisibles = computed(() => resultados.value.slice(1, 4));
const resultadoSeleccionado = ref(null);
let unsubscribe = null;

const mostrarMinuto = (valor) => {
  const minuto = Number(valor);
  return Number.isFinite(minuto) && minuto > 0 ? `${minuto}'` : '';
};

const abrirGoleadoras = (resultado) => {
  resultadoSeleccionado.value = resultado;
};

const cerrarGoleadoras = () => {
  resultadoSeleccionado.value = null;
};

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