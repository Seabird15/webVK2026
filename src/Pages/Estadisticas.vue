<template>
  <section class="estadisticas-page overflow-hidden bg-(--st-bg) text-(--st-text)">
    <div class="relative isolate">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.2)_0%,rgba(11,17,18,0.8)_55%,rgba(11,17,18,0.98)_100%)]"></div>
        <div class="absolute left-[-8%] top-10 h-56 w-56 rounded-full bg-(--st-primary)/14 blur-3xl"></div>
        <div class="absolute right-[-10%] top-0 h-72 w-72 rounded-full bg-(--st-accent)/8 blur-3xl"></div>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pb-14 lg:pt-18">
        <div class="st-fade grid gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] lg:items-stretch">
          <div class="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8 lg:p-10">
            <p class="text-sm font-semibold italic text-white/72 sm:text-base">
              El rendimiento también cuenta la historia
            </p>
            <h1 class="mt-4 max-w-[2ch] uppercase leading-[0.9]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(1rem, 10vw, 3.4rem);">
              <span class="block text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.85)]">Nuestras</span>
              <span class="block text-white">Estadísticas</span>
            </h1>
            <p class="mt-5 max-w-xl text-[clamp(0.98rem,2.2vw,1.16rem)] leading-relaxed text-white/76">
              Acá se ve otra parte del recorrido: quién empuja al equipo, quién convierte, quién asiste y cómo se reparte el esfuerzo en la cancha. No es solo número: también es constancia, crecimiento y aporte al grupo.
            </p>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <router-link
                to="/competencias"
                class="inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-[1.35rem] bg-white px-5 py-4 text-[#082022] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-1 sm:w-auto"
              >
                <span>
                  <span class="block text-[0.68rem] font-black uppercase tracking-[0.2em] text-(--st-primary)">Seguir el recorrido</span>
                  <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Ver competencias</span>
                </span>
                <TrophyIcon class="h-5 w-5 text-(--st-primary)" />
              </router-link>
            </div>

            <div class="mt-7 grid gap-3 sm:grid-cols-3">
              <div class="rounded-3xl border border-white/10 bg-black/18 px-4 py-4">
                <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/42">Equipo</p>
                <p class="mt-2 text-2xl font-black text-white">{{ equipoActivoInfo.label }}</p>
                <p class="mt-1 text-sm leading-relaxed text-white/60">Plantel actualmente seleccionado.</p>
              </div>

              <div class="rounded-3xl border border-white/10 bg-black/18 px-4 py-4">
                <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/42">Jugadoras</p>
                <p class="mt-2 text-2xl font-black text-white">{{ estadisticasCompletas.length }}</p>
                <p class="mt-1 text-sm leading-relaxed text-white/60">Con registros en esta vista.</p>
              </div>
            </div>
          </div>

          <div class="rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8 lg:p-10">
            <div>
              <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--st-primary)">Vista activa</p>
              <h2 class="mt-3 max-w-[12ch] text-[clamp(1.7rem,3.5vw,2.5rem)]  uppercase leading-10 text-white" style="font-family: 'Gobold High', sans-serif;">
                {{ tipoEstadisticaInfo.title }}
              </h2>
              <p class="mt-3 max-w-md text-[0.98rem] leading-7 text-white/66">
                Cambia entre equipos y entre competencia o amistosos para ver cómo se mueve el aporte ofensivo en cada plantel.
              </p>
            </div>

            <div class="mt-6">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-(--st-primary)">Equipos</p>
              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  v-for="equipo in equipos"
                  :key="equipo.id"
                  @click="equipoActivo = equipo.id"
                  class="w-full rounded-[1.6rem] border px-4 py-4 text-left transition cursor-pointer"
                  :class="equipoActivo === equipo.id ? 'border-(--st-primary) bg-(--st-primary)/12 text-white' : 'border-white/10 bg-white/4 text-white/78 hover:bg-white/7'"
                >
                  <p class="text-xs font-black uppercase tracking-[0.18em] text-(--st-primary)">Plantel</p>
                  <p class="mt-1 text-lg font-black">{{ equipo.label }}</p>
                </button>
              </div>
            </div>

            <div class="mt-6 rounded-[1.8rem] border border-(--st-primary)/20 bg-[linear-gradient(135deg,rgba(44,207,191,0.1),rgba(216,178,85,0.08))] p-5">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-(--st-primary)">Tipo de estadística</p>
              <div class="mt-3 flex flex-col gap-3">
                <button
                  @click="tipoEstadistica = 'competicion'"
                  class="w-full rounded-xl px-4 py-3 text-left text-sm font-black uppercase tracking-[0.08em] transition-all cursor-pointer"
                  :class="tipoEstadistica === 'competicion' ? 'bg-white text-[#082022]' : 'border border-white/14 bg-white/8 text-white hover:bg-white/12'"
                >
                  Estadísticas competición
                </button>
                <button
                  @click="tipoEstadistica = 'amistosos'"
                  class="w-full rounded-xl px-4 py-3 text-left text-sm font-black uppercase tracking-[0.08em] transition-all cursor-pointer"
                  :class="tipoEstadistica === 'amistosos' ? 'bg-white text-[#082022]' : 'border border-white/14 bg-white/8 text-white hover:bg-white/12'"
                >
                  Estadísticas amistosos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div v-if="isLoading" class="st-fade text-center py-12">
        <div class="inline-block">
          <div class="animate-spin h-12 w-12 rounded-full border-b-2 border-(--st-primary)"></div>
        </div>
        <p class="mt-4 font-medium text-white/70">Cargando estadísticas...</p>
      </div>

      <div v-else class="space-y-8">
        <div class="st-fade grid gap-6 lg:grid-cols-2">
          <section class="overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
            <div class="border-b border-white/8 bg-[linear-gradient(90deg,rgba(44,207,191,0.18),rgba(44,207,191,0.08),rgba(11,17,18,0.2))] px-6 py-5">
              <h2 class="flex items-center gap-3 text-[clamp(1.6rem,4vw,2.4rem)] font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">
                <FireIcon class="h-7 w-7 text-(--st-primary)" />
                Goleadoras
              </h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full min-w-md">
                <thead>
                  <tr class="border-b border-white/8 bg-white/4 text-left">
                    <th class="px-5 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">#</th>
                    <th class="px-5 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Nombre</th>
                    <th class="px-5 py-4 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Goles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(jugadora, index) in goleadorasOrdenadas"
                    :key="jugadora.id"
                    class="border-b border-white/8 transition-colors hover:bg-white/4"
                  >
                    <td class="px-5 py-4 text-sm font-black text-(--st-primary)">{{ index + 1 }}</td>
                    <td class="px-5 py-4 text-sm font-semibold text-white sm:text-base">{{ jugadora.nombre }} {{ jugadora.apellido }}</td>
                    <td class="px-5 py-4 text-center">
                      <span class="inline-flex min-w-12 justify-center rounded-full bg-(--st-primary) px-3 py-1 text-sm font-black text-[#082022] sm:text-base">
                        {{ jugadora.goles || 0 }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="goleadorasOrdenadas.length === 0">
                    <td colspan="3" class="px-5 py-8 text-center text-white/60">Sin registros de goles aún.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
            <div class="border-b border-white/8 bg-[linear-gradient(90deg,rgba(44,207,191,0.18),rgba(44,207,191,0.08),rgba(11,17,18,0.2))] px-6 py-5">
              <h2 class="flex items-center gap-3 text-[clamp(1.6rem,4vw,2.4rem)] font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">
                <SparklesIcon class="h-7 w-7 text-(--st-primary)" />
                Asistidoras
              </h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full min-w-md">
                <thead>
                  <tr class="border-b border-white/8 bg-white/4 text-left">
                    <th class="px-5 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">#</th>
                    <th class="px-5 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Nombre</th>
                    <th class="px-5 py-4 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Asistencias</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(jugadora, index) in asistidorasOrdenadas"
                    :key="jugadora.id"
                    class="border-b border-white/8 transition-colors hover:bg-white/4"
                  >
                    <td class="px-5 py-4 text-sm font-black text-(--st-primary)">{{ index + 1 }}</td>
                    <td class="px-5 py-4 text-sm font-semibold text-white sm:text-base">{{ jugadora.nombre }} {{ jugadora.apellido }}</td>
                    <td class="px-5 py-4 text-center">
                      <span class="inline-flex min-w-12 justify-center rounded-full bg-(--st-primary) px-3 py-1 text-sm font-black text-[#082022] sm:text-base">
                        {{ jugadora.asistencias || 0 }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="asistidorasOrdenadas.length === 0">
                    <td colspan="3" class="px-5 py-8 text-center text-white/60">Sin registros de asistencias aún.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section class="st-fade overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div class="border-b border-white/8 bg-[linear-gradient(90deg,rgba(44,207,191,0.18),rgba(44,207,191,0.08),rgba(11,17,18,0.2))] px-6 py-5">
            <h2 class="text-[clamp(1.7rem,4vw,2.6rem)] font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">
              Estadísticas completas
            </h2>
          </div>
          <div class="p-4 sm:p-6">
            <div class="overflow-x-auto">
              <table class="w-full min-w-2xl">
                <thead>
                  <tr class="border-b border-white/8 bg-white/4 text-left">
                    <th class="px-5 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">#</th>
                    <th class="px-5 py-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Nombre</th>
                    <th class="px-5 py-4 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Goles</th>
                    <th class="px-5 py-4 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Asistencias</th>
                    <th class="px-5 py-4 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Participaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(jugadora, index) in estadisticasCompletas"
                    :key="jugadora.id"
                    class="border-b border-white/8 transition-colors hover:bg-white/4"
                  >
                    <td class="px-5 py-4 text-sm font-black text-(--st-primary)">{{ index + 1 }}</td>
                    <td class="px-5 py-4 text-sm font-semibold text-white sm:text-base">{{ jugadora.nombre }} {{ jugadora.apellido }}</td>
                    <td class="px-5 py-4 text-center text-sm font-semibold text-white sm:text-base">{{ jugadora.goles || 0 }}</td>
                    <td class="px-5 py-4 text-center text-sm font-semibold text-white sm:text-base">{{ jugadora.asistencias || 0 }}</td>
                    <td class="px-5 py-4 text-center">
                      <span class="inline-flex min-w-12 justify-center rounded-full bg-(--st-primary) px-3 py-1 text-sm font-black text-[#082022] sm:text-base">
                        {{ (jugadora.goles || 0) + (jugadora.asistencias || 0) }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="estadisticasCompletas.length === 0">
                    <td colspan="5" class="px-5 py-8 text-center text-white/60">No hay jugadoras registradas en este equipo.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { TrophyIcon, FireIcon, SparklesIcon } from '@heroicons/vue/24/solid';
import { obtenerEstadisticasEquipo, obtenerResumenPorTipo } from '../firebase/estadisticas';

const isLoading = ref(false);
const equipoActivo = ref('ascenso');
const tipoEstadistica = ref('competicion');
const jugadoras = ref([]);

const equipos = [
  { id: 'ascenso', label: 'Ascenso' },
  { id: 'serieC', label: 'Serie C' }
];

const equipoActivoInfo = computed(() => {
  return equipos.find((equipo) => equipo.id === equipoActivo.value) || equipos[0];
});

const tipoEstadisticaInfo = computed(() => {
  if (tipoEstadistica.value === 'amistosos') {
    return {
      short: 'Amistosos',
      title: 'Lo que pasa también fuera del torneo',
      description: 'Lectura del rendimiento en partidos amistosos.'
    };
  }

  return {
    short: 'Competición',
    title: 'Lo que produce el equipo cuando compite',
    description: 'Rendimiento en contexto de competencia oficial.'
  };
});

const jugadorasFiltradasPorTipo = computed(() => {
  return jugadoras.value.map((jugadora) => {
    const resumen = obtenerResumenPorTipo(jugadora, tipoEstadistica.value);
    return {
      ...jugadora,
      goles: resumen.goles || 0,
      asistencias: resumen.asistencias || 0,
      partidos: resumen.partidos || 0
    };
  });
});

// Obtener goleadoras ordenadas por mayor a menor
const goleadorasOrdenadas = computed(() => {
  return [...jugadorasFiltradasPorTipo.value]
    .sort((a, b) => (b.goles || 0) - (a.goles || 0))
    .filter(j => (j.goles || 0) > 0);
});

// Obtener asistidoras ordenadas por mayor a menor
const asistidorasOrdenadas = computed(() => {
  return [...jugadorasFiltradasPorTipo.value]
    .sort((a, b) => (b.asistencias || 0) - (a.asistencias || 0))
    .filter(j => (j.asistencias || 0) > 0);
});

// Estadísticas completas ordenadas por mayor participación
const estadisticasCompletas = computed(() => {
  return [...jugadorasFiltradasPorTipo.value]
    .sort((a, b) => {
      const participacionA = (a.goles || 0) + (a.asistencias || 0);
      const participacionB = (b.goles || 0) + (b.asistencias || 0);
      return participacionB - participacionA;
    });
});

// Cargar jugadoras por equipo
const cargarJugadoras = async () => {
  isLoading.value = true;
  try {
    jugadoras.value = await obtenerEstadisticasEquipo(equipoActivo.value);
  } catch (err) {
    console.error('Error cargando estadísticas:', err);
    jugadoras.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  cargarJugadoras();
});

// Watcher para cambios de equipo
watch(() => equipoActivo.value, () => {
  cargarJugadoras();
});

</script>

<style scoped>
.estadisticas-page {
  --st-bg: #0b1112;
  --st-text: #f7fffd;
  --st-primary: #2ccfbf;
  --st-accent: #d8b255;
}

.st-fade {
  animation: st-rise 0.8s ease-out both;
}

@keyframes st-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .st-fade,
  .animate-spin {
    animation: none;
  }
}
</style>
