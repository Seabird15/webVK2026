<template>
  <main class="ci-page min-h-screen bg-[#0c0a09] text-stone-100">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute -left-24 top-0 h-96 w-96 rounded-full bg-violet-700/25 blur-3xl"></div>
        <div class="absolute right-0 top-24 h-96 w-96 rounded-full bg-red-700/20 blur-3xl"></div>
        <div class="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-stone-500/10 blur-3xl"></div>
        <div class="absolute inset-0 opacity-7 bg-[repeating-linear-gradient(115deg,transparent_0,transparent_14px,#fff_14px,#fff_15px)]"></div>
      </div>

      <div class="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
        <div class="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl">
            <p class="ci-fade inline-flex items-center gap-3 text-[0.7rem] font-black uppercase tracking-[0.3em] text-amber-400">
              <span class="h-px w-8 bg-amber-400"></span>
              Edición 2026 · 2ª versión
            </p>
            <h1 class="ci-fade mt-5 text-[clamp(3.2rem,10vw,7.5rem)] font-black uppercase leading-[0.82] text-white" style="font-family: 'Gobold High', system-ui, sans-serif; animation-delay: 80ms;">
              Campeonato<br />
              <span class="text-transparent [-webkit-text-stroke:2px_#fbbf24]">Interno</span><br />
              Vikingas
            </h1>
            <p class="ci-fade mt-6 max-w-xl text-pretty text-base leading-relaxed text-stone-400 sm:text-lg" style="animation-delay: 160ms;">
              Tres equipos, cuatro sábados, un solo trofeo. La casa se divide en colores y cada punto vale una corona.
            </p>
            <div class="ci-fade mt-8" style="animation-delay: 220ms;">
              <router-link
                to="/campeonato-interno-en-vivo"
                class="group inline-flex min-h-14 items-center gap-4 rounded-2xl bg-amber-400 px-6 text-stone-950 shadow-[0_16px_40px_rgba(251,191,36,0.25)] transition-transform duration-200 hover:-translate-y-1"
              >
                <span class="relative flex size-3">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
                  <span class="relative inline-flex size-3 rounded-full bg-red-600"></span>
                </span>
                <span class="text-left">
                  <span class="block text-[0.65rem] font-black uppercase tracking-[0.2em]">Sigue el torneo</span>
                  <span class="block text-base font-black uppercase tracking-wide">Resultados en vivo y tabla</span>
                </span>
                <span class="text-xl transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </router-link>
            </div>
          </div>

          <img :src="logoBlanco" alt="Vikingas" class="ci-fade hidden w-36 opacity-80 lg:block" style="animation-delay: 240ms;" />
        </div>

        <!-- Fechas strip -->
        <div class="ci-fade mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4" style="animation-delay: 320ms;">
          <div v-for="fecha in fechas" :key="fecha.numero" class="group bg-[#0c0a09] p-5 transition-colors duration-300 hover:bg-stone-900">
            <p class="text-[0.65rem] font-black uppercase tracking-[0.25em]" :class="fecha.esFinal ? 'text-amber-400' : 'text-stone-500'">{{ fecha.esFinal ? 'La gran' : 'Fecha' }}</p>
            <p class="mt-2 text-3xl font-black text-white" style="font-family: 'Gobold High', system-ui, sans-serif;">{{ fecha.titulo }}</p>
            <p class="mt-1 text-xs font-bold uppercase tracking-widest text-stone-500">{{ fecha.dia }}</p>
            <p class="mt-3 text-sm font-semibold text-stone-400">{{ fecha.detalle }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- EQUIPOS -->
    <section id="equipos" class="relative border-t border-white/10">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div class="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-amber-400">La competencia</p>
            <h2 class="mt-3 text-4xl font-black uppercase text-white sm:text-6xl" style="font-family: 'Gobold High', system-ui, sans-serif;">Tres equipos</h2>
          </div>
          <p class="max-w-sm text-sm leading-relaxed text-stone-500">Cada equipo eligió su color y su nombre. Todas juegan contra todas, dos veces, antes de la final.</p>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="(equipo, index) in equipos"
            :key="equipo.nombre"
            class="group relative overflow-hidden rounded-3xl border transition-transform duration-300 hover:-translate-y-2"
            :class="equipo.clasesCard"
            :style="{ animationDelay: `${index * 120}ms` }"
          >
            <div class="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40" :class="equipo.clasesGlow" aria-hidden="true"></div>

            <!-- Escudo + nombre -->
            <div class="relative flex flex-col items-center pt-4 text-center">
              <img :src="equipo.escudo" :alt="`Escudo ${equipo.nombre}`" class="w-40 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105 sm:w-48" />
              <p class="mt-4 text-[0.65rem] font-black uppercase tracking-[0.3em]" :class="equipo.clasesKicker">{{ equipo.kicker }}</p>
              <h3 class="mt-2 text-2xl font-black uppercase leading-none sm:text-3xl" style="font-family: 'Gobold High', system-ui, sans-serif;" :class="equipo.clasesTitulo">
                {{ equipo.nombre }}
              </h3>
            </div>

            <!-- Capitana -->
            <div class="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div class="relative shrink-0">
                <img :src="equipo.fotoCapitana" :alt="`Capitana ${equipo.capitana}`" class="size-16 rounded-xl border object-cover object-top" :class="equipo.clasesBorde" />
                <span class="absolute -bottom-2 -right-2 rounded-md px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-widest" :class="equipo.clasesBadge">C</span>
              </div>
              <div class="min-w-0">
                <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-500">Capitana</p>
                <p class="mt-1 truncate text-lg font-black text-white">{{ equipo.capitana }}</p>
                <p class="mt-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                  <span class="size-3 rounded-full ring-2 ring-white/20" :class="equipo.clasesColor"></span>
                  Color {{ equipo.color }}
                </p>
              </div>
            </div>

            <!-- Nómina estilo formación -->
            <div class="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div class="flex items-center justify-between bg-black/40 px-4 py-3">
                <p class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-stone-400">Nómina</p>
                <p class="text-[0.65rem] font-black uppercase tracking-[0.25em]" :class="equipo.clasesNumero">{{ plantelDe(equipo.equipoId).length }} jugadoras</p>
              </div>
              <ol class="divide-y divide-white/5">
                <li
                  v-for="(jugadora, jIndex) in plantelDe(equipo.equipoId)"
                  :key="`${equipo.nombre}-${jugadora}`"
                  class="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200"
                  :class="equipo.clasesFila"
                >
                  <span class="w-6 shrink-0 text-right text-xs font-black tabular-nums" :class="equipo.clasesNumero">{{ String(jIndex + 1).padStart(2, '0') }}</span>
                  <span class="h-px w-3 shrink-0 bg-white/20"></span>
                  <span class="truncate text-sm font-bold text-stone-200">{{ jugadora }}</span>
                </li>
              </ol>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FIXTURE -->
    <section id="fixture" class="border-t border-white/10 bg-stone-950/60">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div class="mb-12">
          <p class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-amber-400">Calendario</p>
          <h2 class="mt-3 text-4xl font-black uppercase text-white sm:text-6xl" style="font-family: 'Gobold High', system-ui, sans-serif;">El camino</h2>
        </div>

        <div class="space-y-8">
          <article
            v-for="(fecha, index) in fechas"
            :key="`fixture-${fecha.numero}`"
            class="overflow-hidden rounded-3xl border"
            :class="fecha.esFinal ? 'border-amber-400/40 bg-linear-to-br from-amber-400/10 to-transparent' : 'border-white/10 bg-white/3'"
          >
            <header class="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5" :class="fecha.esFinal ? 'border-amber-400/20' : 'border-white/10'">
              <div class="flex items-center gap-4">
                <span class="flex size-12 items-center justify-center rounded-2xl text-xl font-black" :class="fecha.esFinal ? 'bg-amber-400 text-stone-950' : 'bg-white/10 text-white'" style="font-family: 'Gobold High', system-ui, sans-serif;">
                  {{ fecha.esFinal ? '★' : fecha.numero }}
                </span>
                <div>
                  <h3 class="text-xl font-black uppercase text-white" style="font-family: 'Gobold High', system-ui, sans-serif;">{{ fecha.esFinal ? 'La gran final' : `Fecha ${fecha.numero}` }}</h3>
                  <p class="text-xs font-bold uppercase tracking-widest" :class="fecha.esFinal ? 'text-amber-400' : 'text-stone-500'">{{ fecha.diaCompleto }}</p>
                </div>
              </div>
              <p class="text-sm font-semibold text-stone-400">{{ fecha.detalle }}</p>
            </header>

            <div class="grid gap-px" :class="fecha.partidos.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'">
              <div
                v-for="(partido, pIndex) in fecha.partidos"
                :key="`${fecha.numero}-${pIndex}`"
                class="flex flex-col justify-between gap-4 p-6 transition-colors duration-300 hover:bg-white/4"
              >
                <p class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-stone-500">{{ partido.hora }}</p>
                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-3">
                    <span class="inline-flex items-center gap-2 text-base font-black text-white">
                      <span class="size-2.5 rounded-full" :class="colorDeEquipo(partido.local)"></span>
                      {{ partido.local }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 pl-4 text-[0.65rem] font-black uppercase tracking-[0.3em] text-stone-600">
                    <span class="h-px flex-1 bg-white/10"></span>
                    vs
                    <span class="h-px flex-1 bg-white/10"></span>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <span class="inline-flex items-center gap-2 text-base font-black text-white">
                      <span class="size-2.5 rounded-full" :class="colorDeEquipo(partido.visita)"></span>
                      {{ partido.visita }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FORMATO -->
    <section class="border-t border-white/10">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <p class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-amber-400">Cómo se juega</p>
          <h2 class="mt-3 text-4xl font-black uppercase text-white sm:text-5xl" style="font-family: 'Gobold High', system-ui, sans-serif;">Todos contra todos</h2>
          <p class="mt-5 max-w-lg text-pretty text-base leading-relaxed text-stone-400">
            Durante las tres primeras jornadas se construye la tabla de posiciones: cada equipo se enfrenta dos veces a cada rival. Al finalizar la fase regular, los dos primeros clasifican directo a la gran final, y el tercero se distribuye entre los finalistas para que todas jueguen por el título.
          </p>
        </div>

        <div class="grid gap-3">
          <div v-for="regla in reglas" :key="regla.titulo" class="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/3 p-5">
            <span class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-sm font-black text-amber-400">{{ regla.icono }}</span>
            <div>
              <p class="font-black text-white">{{ regla.titulo }}</p>
              <p class="mt-1 text-sm leading-relaxed text-stone-400">{{ regla.detalle }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CIERRE -->
    <section class="relative overflow-hidden border-t border-white/10">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 opacity-6 bg-[repeating-linear-gradient(115deg,transparent_0,transparent_14px,#fff_14px,#fff_15px)]"></div>
      </div>
      <div class="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <img :src="logoBlanco" alt="Vikingas" class="mx-auto w-16 opacity-60" />
        <p class="mt-8 text-balance text-3xl font-black uppercase leading-tight text-white sm:text-5xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
          Un solo equipo al final.<br />
          <span class="text-amber-400">Tres colores en guerra.</span>
        </p>
        <p class="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-stone-400">
          Queremos que este campeonato sea una instancia para reírnos, compartir y seguir fortaleciendo a las VKS dentro y fuera de la cancha. Nos vemos los sábados desde las 17:00 hasta la gran final del 7 de noviembre.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { escucharCampeonatoCompleto, inicializarNominasCampeonato, NOMINAS_INICIALES } from '../firebase/campeonatoInterno2'
import logoBlanco from '../assets/campeonato-interno/VK LOGO BLANCO PNG.png'
import fotoTiare from '../assets/campeonato-interno/Tiare.png'
import fotoMi from '../assets/campeonato-interno/Mi.png'
import fotoJesi from '../assets/campeonato-interno/Jesi.png'
import escudoTinky from '../assets/campeonato-interno/escudo-tinky-winky.jpeg'
import escudoLegion from '../assets/campeonato-interno/escudo-legion-roja.jpeg'
import escudoValkirias from '../assets/campeonato-interno/escudo-valkirias.jpeg'

const nominas = ref({ ...NOMINAS_INICIALES })
let unsubscribeCampeonato = null

onMounted(async () => {
  await inicializarNominasCampeonato()
  unsubscribeCampeonato = escucharCampeonatoCompleto(({ nominas: nuevas }) => {
    nominas.value = nuevas
  })
})

onUnmounted(() => unsubscribeCampeonato?.())

const equipos = [
  {
    nombre: 'Las Tinky Winky FC',
    nombreCorto: 'Tinky Winky',
    kicker: 'Clan morado',
    capitana: 'Tiare Bernal',
    color: 'morado',
    fotoCapitana: fotoTiare,
    escudo: escudoTinky,
    equipoId: 'tinky',
    plantel: [],
    clasesCard: 'border-violet-500/30 bg-linear-to-b from-violet-950/40 to-transparent',
    clasesGlow: 'bg-violet-500',
    clasesKicker: 'text-violet-400',
    clasesTitulo: 'text-violet-300',
    clasesBorde: 'border-violet-500/50',
    clasesBadge: 'bg-violet-500 text-white',
    clasesColor: 'bg-violet-500',
    clasesChip: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    clasesFila: 'hover:bg-violet-500/10',
    clasesNumero: 'text-violet-400',
  },
  {
    nombre: 'Legión Roja',
    nombreCorto: 'Legión Roja',
    kicker: 'Clan rojo',
    capitana: 'Mi Beaudout',
    color: 'rojo',
    fotoCapitana: fotoMi,
    escudo: escudoLegion,
    equipoId: 'legion',
    plantel: [],
    clasesCard: 'border-red-500/30 bg-linear-to-b from-red-950/40 to-transparent',
    clasesGlow: 'bg-red-500',
    clasesKicker: 'text-red-400',
    clasesTitulo: 'text-red-300',
    clasesBorde: 'border-red-500/50',
    clasesBadge: 'bg-red-500 text-white',
    clasesColor: 'bg-red-500',
    clasesChip: 'border-red-500/30 bg-red-500/10 text-red-200',
    clasesFila: 'hover:bg-red-500/10',
    clasesNumero: 'text-red-400',
  },
  {
    nombre: 'Valkirias',
    nombreCorto: 'Valkirias',
    kicker: 'Clan negro',
    capitana: 'Jesi Chirito',
    color: 'negro',
    fotoCapitana: fotoJesi,
    escudo: escudoValkirias,
    equipoId: 'valkirias',
    plantel: [],
    clasesCard: 'border-stone-400/30 bg-linear-to-b from-stone-800/60 to-transparent',
    clasesGlow: 'bg-stone-400',
    clasesKicker: 'text-stone-400',
    clasesTitulo: 'text-stone-200',
    clasesBorde: 'border-stone-400/50',
    clasesBadge: 'bg-stone-200 text-stone-950',
    clasesColor: 'bg-stone-300',
    clasesChip: 'border-stone-400/30 bg-stone-400/10 text-stone-200',
    clasesFila: 'hover:bg-stone-400/10',
    clasesNumero: 'text-stone-400',
  },
]

const coloresEquipo = {
  'Tinki Winkis': 'bg-violet-500',
  'Tinky Winky': 'bg-violet-500',
  'Legión Roja': 'bg-red-500',
  'Valkirias': 'bg-stone-300',
}

const colorDeEquipo = (nombre) => coloresEquipo[nombre] || 'bg-amber-400'
const plantelDe = (equipoId) => nominas.value[equipoId] || []

const fechas = [
  {
    numero: 1,
    titulo: '17 oct',
    dia: 'Sábado 17',
    diaCompleto: 'Sábado 17 de octubre',
    detalle: 'Se abre la guerra: doble jornada inaugural.',
    partidos: [
      { hora: '19:05', local: 'Tinky Winky', visita: 'Valkirias' },
      { hora: '20:05', local: 'Tinky Winky', visita: 'Legión Roja' },
    ],
  },
  {
    numero: 2,
    titulo: '24 oct',
    dia: 'Sábado 24',
    diaCompleto: 'Sábado 24 de octubre',
    detalle: 'Las revanchas empiezan a pesar.',
    partidos: [
      { hora: '19:05', local: 'Legión Roja', visita: 'Valkirias' },
      { hora: '20:05', local: 'Legión Roja', visita: 'Tinky Winky' },
    ],
  },
  {
    numero: 3,
    titulo: '31 oct',
    dia: 'Sábado 31',
    diaCompleto: 'Sábado 31 de octubre',
    detalle: 'Última fecha para definir la final.',
    partidos: [
      { hora: '19:05', local: 'Valkirias', visita: 'Tinky Winky' },
      { hora: '20:05', local: 'Valkirias', visita: 'Legión Roja' },
    ],
  },
  {
    numero: 4,
    titulo: '7 nov',
    dia: 'Sábado 7',
    diaCompleto: 'Sábado 7 de noviembre',
    detalle: 'Gran final y premiación.',
    esFinal: true,
    partidos: [
      { hora: 'Gran final', local: '1º de la tabla', visita: '2º de la tabla' },
      { hora: 'Cierre', local: 'Entrega de premios', visita: 'y celebración' },
    ],
  },
]

const reglas = [
  { icono: '×2', titulo: 'Ida y vuelta', detalle: 'Durante las tres primeras jornadas cada equipo se enfrenta dos veces a cada rival, construyendo la tabla de posiciones.' },
  { icono: '★', titulo: 'Final directa', detalle: 'Los dos primeros equipos de la tabla clasifican directamente a la gran final del 7 de noviembre.' },
  { icono: '3º', titulo: 'Todas juegan la final', detalle: 'El equipo que termine tercero se distribuye entre los dos finalistas, para que todas tengan la oportunidad de jugar la final.' },
]
</script>

<style scoped>
.ci-fade {
  animation: ci-rise 0.7s ease-out both;
}

@keyframes ci-rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ci-fade {
    animation: none;
  }
}

html {
  scroll-behavior: smooth;
}
</style>
