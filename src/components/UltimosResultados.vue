<template>
  <section v-if="resultadosVisibles.length > 0" class="bg-linear-to-b from-neutral-950 via-black to-neutral-900 px-4 py-20 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-10 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-primary font-black uppercase tracking-[0.3em] text-xs mb-2">Resumen reciente</p>
          <h2 class="text-3xl md:text-5xl font-black text-white" style="font-family: 'Gobold High', sans-serif;">ÚLTIMOS RESULTADOS</h2>
        </div>
        <p class="text-white/65 text-sm md:max-w-sm">
         
        </p>
      </div>

      <div class="grid items-stretch divide-y divide-white/10 md:grid-cols-3 md:auto-rows-fr md:divide-x md:divide-y-0 md:divide-white/10">
        <article
          v-for="(resultado, index) in resultadosVisibles"
          :key="resultado.id"
          class="group relative flex h-full flex-col overflow-hidden px-1 py-8 shadow-[0_0_16px_rgba(255,255,255,0.08)] transition-colors duration-300 hover:bg-white/4 sm:px-3 md:px-6 first:pt-0 md:first:pl-0 md:first:pt-8 md:last:pr-0"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-primary text-xs font-black uppercase tracking-[0.25em]">{{ resultado.nombreLiga }}</p>
              <h3 class="text-white text-xl font-black mt-2">{{ resultado.categoria }}</h3>
            </div>
            <span class="shrink-0 bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
              {{ resultado.fecha }}
            </span>
          </div>

          <div class="flex flex-1 flex-col justify-between space-y-4">
            <div>
              <p class="text-white/45 text-xs uppercase tracking-[0.2em] mb-1">Rival</p>
              <p class="text-white text-lg font-semibold">{{ resultado.rival }}</p>
            </div>

            <div class="border-y border-white/10 px-1 py-4">
              <p class="text-white/45 text-xs uppercase tracking-[0.2em] mb-2">Resultado final</p>
              <div class="flex items-center justify-around gap-4 text-sm text-white/70 mb-3">
                <span class="font-bold text-white">Vikingas</span>
                <span class="font-bold">{{ resultado.rival }}</span>
              </div>
              <p class="text-3xl font-black flex justify-around text-primary"><span>{{ resultado.marcadorVikingas }} </span>- <span>{{ resultado.marcadorRival }}</span></p>
            </div>

            <div
              v-if="index === 0 && resultado.mvp"
              class="flex items-center gap-4 border-l-2 border-primary/60 bg-primary/8 px-4 py-3"
            >
              <img
                v-if="resultado.mvp.foto"
                :src="resultado.mvp.foto"
                :alt="`Foto de ${resultado.mvp.nombre}`"
                class="size-14 shrink-0 rounded-full border-2 border-primary/60 object-cover"
              />
              <div
                v-else
                class="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-primary/60 bg-primary/20 text-lg font-black text-primary"
                aria-hidden="true"
              >
                {{ resultado.mvp.nombre.charAt(0) }}
              </div>
              <div class="min-w-0">
                <p class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary">MVP del partido</p>
                <p class="mt-1 truncate text-base font-black text-white">{{ resultado.mvp.nombre }}</p>
                <p class="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">{{ resultado.mvp.equipo }}</p>
              </div>
            </div>

            <button
              v-if="resultado.goleadoras && resultado.goleadoras.length"
              @click="abrirGoleadoras(resultado)"
              class="w-full cursor-pointer border-b border-primary/30 bg-primary/8 px-4 py-3 text-left transition-colors duration-200 hover:bg-primary/12"
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { escucharUltimosResultados, obtenerUltimosResultados } from '../firebase/ultimosResultados';
import { fetchJugadorasRegistradasPorEquipo } from '../firebase/jugadorasAuth';

const resultados = ref([]);
const resultadosVisibles = computed(() => resultados.value.slice(0, 3));
const resultadoSeleccionado = ref(null);
let unsubscribe = null;

const normalizarNombre = (nombre) => (nombre || '')
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .trim()
  .split(/\s+/)
  .sort()
  .join(' ');

const normalizarEquipo = (equipo) => {
  const valor = normalizarNombre(equipo).replace(/\s/g, '');
  if (valor === 'ascenso') return 'ascenso';
  if (valor === 'seriec') return 'serieC';
  if (valor === 'escuela') return 'escuela';
  if (valor === 'ascensoyseriec' || valor === 'ambos') return 'ambos';
  return equipo || 'ambos';
};

const obtenerNombreJugadora = (jugadora) => jugadora.nombreCompleto
  || `${jugadora.nombre || ''} ${jugadora.apellido || ''}`
  || `${jugadora.apellido || ''} ${jugadora.nombre || ''}`;

const cargarFotoMvp = async (resultado) => {
  if (!resultado?.mvp || resultado.mvp.foto) return;

  const jugadoras = await fetchJugadorasRegistradasPorEquipo(normalizarEquipo(resultado.mvp.equipo));
  const mvp = jugadoras.find(
    (jugadora) => normalizarNombre(obtenerNombreJugadora(jugadora)) === normalizarNombre(resultado.mvp.nombre)
  );

  if (mvp) {
    resultado.mvp = {
      ...resultado.mvp,
      foto: mvp.fotoPerfil || mvp.foto || mvp.photoURL || mvp.imagen || mvp.urlFoto || ''
    };
  }
};

watch(
  resultadosVisibles,
  (resultadosActualizados) => {
    cargarFotoMvp(resultadosActualizados[0]);
  },
  { immediate: true }
);

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