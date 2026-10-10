<template>
  <main class="min-h-screen bg-[#0c0a09] text-stone-100">
    <!-- HERO compacto -->
    <section class="relative overflow-hidden border-b border-white/10">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-700/20 blur-3xl"></div>
        <div class="absolute right-0 top-10 h-72 w-72 rounded-full bg-red-700/15 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pb-14 lg:pt-28">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="inline-flex items-center gap-3 text-[0.7rem] font-black uppercase tracking-[0.3em] text-amber-400">
              <span class="relative flex size-2.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span class="relative inline-flex size-2.5 rounded-full bg-red-500"></span>
              </span>
              Resultados en vivo
            </p>
            <h1 class="mt-4 text-[clamp(2.6rem,7vw,5rem)] font-black uppercase leading-12 lg:leading-20 text-white" style="font-family: 'Gobold High', system-ui, sans-serif;">
              Campeonato<br />Interno <span class="text-amber-400">2026</span>
            </h1>
          </div>
          <router-link
            to="/campeonato-interno"
            class="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-bold text-stone-300 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            ← Volver a la presentación
          </router-link>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p v-if="cargando" class="py-16 text-center text-sm font-semibold text-stone-500">Cargando resultados...</p>

      <template v-else>
        <!-- PARTIDOS POR FECHA -->
        <section class="space-y-10">
          <div v-for="grupo in partidosPorFecha" :key="grupo.fecha">
            <div class="mb-4 flex items-center gap-4">
              <span
                class="flex size-11 shrink-0 items-center justify-center rounded-2xl text-lg font-black"
                :class="grupo.esFinal ? 'bg-amber-400 text-stone-950' : 'bg-white/10 text-white'"
                style="font-family: 'Gobold High', system-ui, sans-serif;"
              >
                {{ grupo.esFinal ? '★' : grupo.fecha }}
              </span>
              <div>
                <h2 class="text-xl font-black uppercase text-white" style="font-family: 'Gobold High', system-ui, sans-serif;">
                  {{ grupo.esFinal ? 'La gran final' : `Fecha ${grupo.fecha}` }}
                </h2>
                <p class="text-xs font-bold uppercase tracking-widest" :class="grupo.esFinal ? 'text-amber-400' : 'text-stone-500'">{{ grupo.fechaLabel }}</p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <article
                v-for="partido in grupo.partidos"
                :key="partido.id"
                class="relative overflow-hidden rounded-3xl border p-5 sm:p-6"
                :class="clasesCardPartido(partido)"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-stone-500">{{ partido.hora }}</p>
                  <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest" :class="clasesEstado(partido.estado)">
                    <span v-if="partido.estado === 'en_juego'" class="relative flex size-2">
                      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"></span>
                      <span class="relative inline-flex size-2 rounded-full bg-current"></span>
                    </span>
                    {{ etiquetaEstado(partido.estado) }}
                  </span>
                </div>

                <div class="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div class="flex flex-col items-center gap-2 text-center">
                    <img :src="escudoDe(partido.local)" :alt="nombreDe(partido.local)" class="size-16 object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] sm:size-20" />
                    <p class="text-xs font-black uppercase leading-tight text-white sm:text-sm">{{ nombreDe(partido.local) }}</p>
                  </div>

                  <div class="text-center">
                    <p class="tabular-nums text-4xl font-black text-white sm:text-5xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
                      {{ marcador(partido) }}
                    </p>
                  </div>

                  <div class="flex flex-col items-center gap-2 text-center">
                    <img :src="escudoDe(partido.visita)" :alt="nombreDe(partido.visita)" class="size-16 object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] sm:size-20" />
                    <p class="text-xs font-black uppercase leading-tight text-white sm:text-sm">{{ nombreDe(partido.visita) }}</p>
                  </div>
                </div>

                <div v-if="goleadorasDe(partido).length" class="mt-5 border-t border-white/10 pt-4">
                  <p class="text-[0.6rem] font-black uppercase tracking-[0.25em] text-stone-500">Goles</p>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span
                      v-for="(gol, gIndex) in goleadorasDe(partido)"
                      :key="`${partido.id}-gol-${gIndex}`"
                      class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] font-bold text-stone-300"
                    >
                      ⚽ {{ gol.nombre }}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <!-- TABLA DE POSICIONES -->
        <section class="mt-16">
          <div class="mb-6 flex items-end justify-between gap-4">
            <div>
              <p class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-amber-400">En tiempo real</p>
              <h2 class="mt-2 text-3xl font-black uppercase text-white sm:text-4xl" style="font-family: 'Gobold High', system-ui, sans-serif;">Tabla de posiciones</h2>
            </div>
            <p class="hidden max-w-xs text-right text-xs leading-relaxed text-stone-500 sm:block">Se actualiza automáticamente mientras se disputan los partidos. Ganado 3 pts · Empatado 1 pt.</p>
          </div>

          <div class="overflow-hidden rounded-3xl border border-white/10">
            <div class="overflow-x-auto">
              <table class="w-full min-w-140">
                <thead>
                  <tr class="border-b border-white/10 bg-white/5 text-left">
                    <th class="px-4 py-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">#</th>
                    <th class="px-4 py-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">Equipo</th>
                    <th class="px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">PJ</th>
                    <th class="px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">G</th>
                    <th class="px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">E</th>
                    <th class="px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">P</th>
                    <th class="px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">GF</th>
                    <th class="px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">GC</th>
                    <th class="px-3 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">DG</th>
                    <th class="px-4 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-amber-400">Pts</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr
                    v-for="(equipo, index) in tabla"
                    :key="equipo.id"
                    class="transition-colors"
                    :class="index < 2 ? 'bg-amber-400/6 hover:bg-amber-400/10' : 'hover:bg-white/4'"
                  >
                    <td class="px-4 py-4">
                      <span class="text-sm font-black tabular-nums" :class="index < 2 ? 'text-amber-400' : 'text-stone-600'">{{ index + 1 }}</span>
                    </td>
                    <td class="px-4 py-4">
                      <div class="flex items-center gap-3">
                        <img :src="escudoDe(equipo.id)" :alt="equipo.nombre" class="size-9 object-contain" />
                        <div class="min-w-0">
                          <p class="truncate text-sm font-black text-white">{{ equipo.nombre }}</p>
                          <p v-if="index < 2" class="text-[0.6rem] font-black uppercase tracking-widest text-amber-400">Clasifica a la final</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-3 py-4 text-center text-sm font-bold tabular-nums text-stone-300">{{ equipo.pj }}</td>
                    <td class="px-3 py-4 text-center text-sm font-bold tabular-nums text-emerald-400">{{ equipo.pg }}</td>
                    <td class="px-3 py-4 text-center text-sm font-bold tabular-nums text-stone-300">{{ equipo.pe }}</td>
                    <td class="px-3 py-4 text-center text-sm font-bold tabular-nums text-red-400">{{ equipo.pp }}</td>
                    <td class="px-3 py-4 text-center text-sm font-bold tabular-nums text-stone-300">{{ equipo.gf }}</td>
                    <td class="px-3 py-4 text-center text-sm font-bold tabular-nums text-stone-300">{{ equipo.gc }}</td>
                    <td class="px-3 py-4 text-center text-sm font-bold tabular-nums" :class="equipo.dg > 0 ? 'text-emerald-400' : equipo.dg < 0 ? 'text-red-400' : 'text-stone-300'">
                      {{ equipo.dg > 0 ? `+${equipo.dg}` : equipo.dg }}
                    </td>
                    <td class="px-4 py-4 text-center">
                      <span class="text-lg font-black tabular-nums text-amber-400">{{ equipo.pts }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="mt-4 text-xs leading-relaxed text-stone-500">
            Los dos primeros clasifican a la gran final del 7 de noviembre. El tercero se distribuye entre los finalistas.
          </p>
        </section>

        <!-- GOLEADORAS -->
        <section v-if="goleadoras.length" class="mt-16">
          <div class="mb-6">
            <p class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-amber-400">Aporte ofensivo</p>
            <h2 class="mt-2 text-3xl font-black uppercase text-white sm:text-4xl" style="font-family: 'Gobold High', system-ui, sans-serif;">Goleadoras</h2>
          </div>

          <div class="overflow-hidden rounded-3xl border border-white/10">
            <ol class="divide-y divide-white/5">
              <li
                v-for="(goleadora, index) in goleadoras"
                :key="`${goleadora.nombre}-${goleadora.equipoId}`"
                class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/4"
              >
                <span class="w-7 text-lg font-black tabular-nums" :class="index === 0 ? 'text-amber-400' : 'text-stone-600'">{{ String(index + 1).padStart(2, '0') }}</span>
                <img :src="escudoDe(goleadora.equipoId)" :alt="nombreDe(goleadora.equipoId)" class="size-9 object-contain" />
                <span class="min-w-0 flex-1 truncate text-sm font-bold text-white">{{ goleadora.nombre }}</span>
                <span class="rounded-full bg-amber-400/15 px-3 py-1 text-sm font-black tabular-nums text-amber-400">{{ goleadora.goles }}</span>
              </li>
            </ol>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  escucharCampeonatoCompleto,
  inicializarPartidosCampeonato,
  inicializarNominasCampeonato,
  calcularTabla,
  calcularGoleadoras
} from '../firebase/campeonatoInterno2';
import escudoTinky from '../assets/campeonato-interno/escudo-tinky-winky.jpeg';
import escudoLegion from '../assets/campeonato-interno/escudo-legion-roja.jpeg';
import escudoValkirias from '../assets/campeonato-interno/escudo-valkirias.jpeg';
import logoBlanco from '../assets/campeonato-interno/VK LOGO BLANCO PNG.png';

const partidos = ref([]);
const cargando = ref(true);
let unsubscribe = null;

const escudos = {
  tinky: escudoTinky,
  legion: escudoLegion,
  valkirias: escudoValkirias,
  primero: logoBlanco,
  segundo: logoBlanco
};

const nombres = {
  tinky: 'Tinky Winky',
  legion: 'Legión Roja',
  valkirias: 'Valkirias',
  primero: '1º tabla',
  segundo: '2º tabla'
};

const escudoDe = (id) => escudos[id] || logoBlanco;
const nombreDe = (id) => nombres[id] || id;

const tabla = computed(() => calcularTabla(partidos.value));
const goleadoras = computed(() => calcularGoleadoras(partidos.value));
const goleadorasDe = (partido) => (Array.isArray(partido.goleadoras) ? partido.goleadoras : []);

const partidosPorFecha = computed(() => {
  const grupos = new Map();
  partidos.value.forEach((partido) => {
    if (!grupos.has(partido.fecha)) {
      grupos.set(partido.fecha, {
        fecha: partido.fecha,
        fechaLabel: partido.fechaLabel,
        esFinal: partido.esFinal === true,
        partidos: []
      });
    }
    grupos.get(partido.fecha).partidos.push(partido);
  });
  return [...grupos.values()].sort((a, b) => a.fecha - b.fecha);
});

const etiquetaEstado = (estado) => ({
  programado: 'Programado',
  en_juego: 'En juego',
  finalizado: 'Finalizado'
}[estado] || 'Programado');

const clasesEstado = (estado) => ({
  programado: 'bg-white/10 text-stone-400',
  en_juego: 'bg-red-500/20 text-red-400',
  finalizado: 'bg-emerald-500/20 text-emerald-400'
}[estado] || 'bg-white/10 text-stone-400');

const clasesCardPartido = (partido) => {
  if (partido.esFinal) return 'border-amber-400/40 bg-linear-to-br from-amber-400/10 to-transparent';
  if (partido.estado === 'en_juego') return 'border-red-500/40 bg-red-500/[0.06]';
  return 'border-white/10 bg-white/[0.03]';
};

const marcador = (partido) => {
  const gl = partido.golesLocal;
  const gv = partido.golesVisita;
  const validos = Number.isFinite(Number(gl)) && Number.isFinite(Number(gv)) && gl !== null && gv !== null;
  return validos ? `${gl} - ${gv}` : '—';
};

onMounted(async () => {
  await inicializarPartidosCampeonato();
  await inicializarNominasCampeonato();
  unsubscribe = escucharCampeonatoCompleto(({ partidos: items }) => {
    partidos.value = items;
    cargando.value = false;
  }, () => {
    cargando.value = false;
  });
});

onUnmounted(() => unsubscribe?.());
</script>
