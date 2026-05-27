<template>
  <main class="bg-stone-50 text-slate-950">
    <section class="relative overflow-hidden bg-slate-950 text-white">
      <img
        :src="fotoCampeonas"
        alt="Vikingas Formativo celebrando el campeonato"
        class="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div class="absolute inset-0 bg-slate-950/55"></div>

      <div class="relative mx-auto grid min-h-[76dvh] max-w-7xl content-end px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pb-14">
        <div class="max-w-4xl">
          <p class="mb-4 inline-flex rounded-sm bg-[#d8b45d] px-3 py-2 text-xs font-black uppercase text-slate-950">
            Campeonato Vikingas Formativo 2026
          </p>
          <h1 class="text-balance text-5xl font-black leading-none sm:text-7xl lg:text-8xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
            Vikingas campeonas
          </h1>
          <p class="mt-6 max-w-2xl text-pretty text-lg font-semibold leading-relaxed text-white/85 sm:text-2xl">
            Una campaña invicta, un empate agónico y un torneo formativo que dejó historia propia.
          </p>
        </div>

        <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="stat in heroStats" :key="stat.label" class="border border-white/20 bg-slate-950/75 p-5">
            <p class="tabular-nums text-4xl font-black text-[#d8b45d]">{{ stat.value }}</p>
            <p class="mt-2 text-sm font-bold uppercase text-white/75">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p class="text-pretty text-sm font-semibold text-slate-700">
          Recorrido editorial por las cinco fechas, el podio, los equipos y los momentos que definieron la cuarta versión.
        </p>
        <nav class="flex flex-wrap gap-2 text-sm font-black uppercase">
          <a href="#cronica" class="rounded-sm bg-slate-950 px-4 py-3 text-white">Crónica</a>
          <a href="#podio" class="rounded-sm border border-slate-300 px-4 py-3 text-slate-950">Podio</a>
          <a href="#galeria" class="rounded-sm border border-slate-300 px-4 py-3 text-slate-950">Galería</a>
        </nav>
      </div>
    </section>

    <section id="cronica" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p class="mb-3 text-sm font-black uppercase text-[#9f7c26]">Fecha a fecha</p>
          <h2 class="text-balance text-4xl font-black text-slate-950 sm:text-6xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
            Crónica del torneo
          </h2>
        </div>
        
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <article
          v-for="jornada in jornadas"
          :key="jornada.titulo"
          class="overflow-hidden rounded-lg border border-slate-200 bg-white"
          :class="jornada.destacada ? 'border-[#d8b45d] bg-[#fffaf0]' : ''"
        >
          <div class="grid md:grid-cols-[0.9fr_1.1fr]">
            <div class="relative min-h-64 overflow-hidden md:min-h-full">
              <img :src="jornada.foto" :alt="jornada.titulo" class="absolute inset-0 h-full w-full object-cover" />
              <div class="absolute left-4 top-4 rounded-sm bg-white px-3 py-2 text-xs font-black uppercase text-slate-950">
                {{ jornada.libre }}
              </div>
            </div>

            <div class="flex flex-col gap-6 p-6 sm:p-8">
              <div>
                <p class="mb-2 text-sm font-black uppercase text-[#9f7c26]">{{ jornada.kicker }}</p>
                <h3 class="text-balance text-2xl font-black text-slate-950">{{ jornada.titulo }}</h3>
                <p class="mt-2 text-pretty text-sm font-semibold text-slate-500">{{ jornada.subtitulo }}</p>
              </div>

              <div class="grid gap-3">
                <div
                  v-for="partido in jornada.partidos"
                  :key="`${jornada.titulo}-${partido.cancha}`"
                  class="rounded-lg border border-slate-200 bg-stone-50 p-4"
                  :class="partido.destacado ? 'border-[#d8b45d] bg-white' : ''"
                >
                  <p class="mb-3 text-xs font-black uppercase text-slate-500">{{ partido.cancha }}</p>
                  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div>
                      <p class="line-clamp-1 text-sm font-black text-slate-950">{{ partido.local }}</p>
                      <p class="tabular-nums text-3xl font-black" :class="partido.golesLocal >= partido.golesVisita ? 'text-[#9f7c26]' : 'text-slate-400'">
                        {{ partido.golesLocal }}
                      </p>
                    </div>
                    <p class="rounded-sm bg-slate-950 px-2 py-1 text-xs font-black text-white">VS</p>
                    <div class="text-right">
                      <p class="line-clamp-1 text-sm font-black text-slate-950">{{ partido.visita }}</p>
                      <p class="tabular-nums text-3xl font-black" :class="partido.golesVisita >= partido.golesLocal ? 'text-[#9f7c26]' : 'text-slate-400'">
                        {{ partido.golesVisita }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p class="text-pretty text-sm leading-relaxed text-slate-700" v-html="jornada.relato"></p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="podio" class="bg-slate-950 py-16 text-white lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p class="mb-3 text-sm font-black uppercase text-[#d8b45d]">Tabla final</p>
            <h2 class="text-balance text-4xl font-black sm:text-6xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
              Podio y posiciones
            </h2>
          </div>
          <p class="text-pretty text-sm font-semibold text-white/70 lg:max-w-md">
            El campeonato se decidió por consistencia: Vikingas cerró invicta y sostuvo la diferencia cuando más pesaba.
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="equipo in podio"
              :key="equipo.nombre"
              class="overflow-hidden rounded-lg border border-white/15 bg-white text-slate-950"
              :class="equipo.posicion === 1 ? 'md:col-span-2 md:row-span-2' : ''"
            >
              <div class="relative aspect-[4/3] overflow-hidden" :class="equipo.posicion === 1 ? 'md:aspect-[5/4]' : ''">
                <img :src="equipo.foto" :alt="equipo.nombre" class="h-full w-full object-cover" />
                <div class="absolute left-4 top-4 rounded-sm bg-[#d8b45d] px-3 py-2 text-xs font-black uppercase text-slate-950">
                  {{ equipo.badge }}
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-2xl font-black">{{ equipo.nombre }}</h3>
                <p class="mt-2 tabular-nums text-5xl font-black text-[#9f7c26]">{{ equipo.puntos }} pts</p>
                <p class="mt-4 text-pretty text-sm font-semibold leading-relaxed text-slate-600">{{ equipo.detalle }}</p>
              </div>
            </article>
          </div>

          <div class="overflow-hidden rounded-lg border border-white/15 bg-white">
            <div class="border-b border-slate-200 bg-[#d8b45d] p-5 text-slate-950">
              <h3 class="text-xl font-black">Clasificación completa</h3>
              <p class="mt-1 text-sm font-semibold">Ordenada por puntos y diferencia de gol.</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full min-w-[520px] text-slate-950">
                <thead class="bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th class="px-4 py-4 text-left font-black">Equipo</th>
                    <th v-for="head in tableHeads" :key="head" class="px-3 py-4 text-center font-black">{{ head }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr v-for="equipo in tablaFinal" :key="equipo.equipo" :class="equipo.campeona ? 'bg-[#fff4d1]' : ''">
                    <td class="px-4 py-4 font-black">{{ equipo.equipo }}</td>
                    <td class="px-3 py-4 text-center font-bold tabular-nums">{{ equipo.pj }}</td>
                    <td class="px-3 py-4 text-center font-bold tabular-nums">{{ equipo.pg }}</td>
                    <td class="px-3 py-4 text-center font-bold tabular-nums">{{ equipo.pe }}</td>
                    <td class="px-3 py-4 text-center font-bold tabular-nums">{{ equipo.pp }}</td>
                    <td class="px-3 py-4 text-center font-bold tabular-nums">{{ equipo.gf }}</td>
                    <td class="px-3 py-4 text-center font-bold tabular-nums">{{ equipo.gc }}</td>
                    <td class="px-3 py-4 text-center font-black tabular-nums text-[#9f7c26]">{{ equipo.pts }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="mb-3 text-sm font-black uppercase text-[#9f7c26]">Participantes</p>
          <h2 class="text-balance text-4xl font-black text-slate-950 sm:text-5xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
            Equipos en juego
          </h2>
        </div>
        <p class="max-w-xl text-pretty text-sm leading-relaxed text-slate-600">
          Cinco equipos, dos canchas y una jornada larga diseñada para competir sin perder el foco formativo.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <article
          v-for="equipo in equiposParticipantes"
          :key="equipo.nombre"
          class="rounded-lg border bg-white p-5 text-center"
          :class="equipo.esLocal ? 'border-[#d8b45d]' : 'border-slate-200'"
        >
          <div class="mx-auto flex size-20 items-center justify-center rounded-lg bg-stone-100 p-3">
            <img v-if="equipo.logo" :src="equipo.logo" :alt="equipo.nombre" class="max-h-full max-w-full object-contain" />
          </div>
          <h3 class="mt-4 text-pretty text-sm font-black uppercase text-slate-950">{{ equipo.nombre }}</h3>
          <p class="mt-2 text-xs font-bold uppercase" :class="equipo.esLocal ? 'text-[#9f7c26]' : 'text-slate-500'">
            {{ equipo.etiqueta }}
          </p>
        </article>
      </div>
    </section>

    <section id="galeria" class="bg-white py-16 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 max-w-3xl">
          <p class="mb-3 text-sm font-black uppercase text-[#9f7c26]">Archivo visual</p>
          <h2 class="text-balance text-4xl font-black text-slate-950 sm:text-6xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
            Acción y momentos
          </h2>
      
        </div>

        <div class="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
          <figure
            v-for="foto in galeriaPrincipal"
            :key="foto.alt"
            class="overflow-hidden rounded-lg bg-slate-200"
            :class="foto.class"
          >
            <img loading="lazy" :src="foto.src" :alt="foto.alt" class="h-full w-full object-cover" />
          </figure>
        </div>
      </div>
    </section>

    <section class="bg-slate-950 py-16 text-white lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p class="mb-3 text-sm font-black uppercase text-[#d8b45d]">Lectura táctica</p>
            <h2 class="text-balance text-4xl font-black sm:text-5xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
              Registros del torneo
            </h2>
          </div>
        
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="record in records" :key="record.titulo" class="rounded-lg border border-white/15 bg-white p-6 text-slate-950">
            <div class="flex items-start gap-4">
              <img :src="record.logo" :alt="record.titulo" class="size-14 rounded-lg object-contain" />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-black uppercase text-[#9f7c26]">{{ record.kicker }}</p>
                <h3 class="mt-1 text-pretty text-xl font-black">{{ record.titulo }}</h3>
                <p class="mt-2 text-pretty text-sm font-semibold text-slate-600">{{ record.descripcion }}</p>
              </div>
              <p class="tabular-nums text-3xl font-black text-[#9f7c26]">{{ record.valor }}</p>
            </div>
          </article>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-3">
          <article v-for="equipo in comparativa" :key="equipo.nombre" class="rounded-lg border border-white/15 bg-slate-900 p-6">
            <p class="mb-2 text-xs font-black uppercase text-[#d8b45d]">{{ equipo.posicion }}</p>
            <h3 class="text-2xl font-black">{{ equipo.nombre }}</h3>
            <p class="mt-2 text-pretty text-sm font-semibold text-white/65">{{ equipo.clave }}</p>
            <div class="mt-6 grid gap-3">
              <div v-for="dato in equipo.datos" :key="dato.label" class="flex items-center justify-between border-t border-white/10 pt-3">
                <span class="text-sm font-semibold text-white/70">{{ dato.label }}</span>
                <span class="tabular-nums text-lg font-black text-white">{{ dato.valor }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
      <blockquote>
        <p class="text-balance text-3xl font-black text-slate-950 sm:text-5xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
          "Un espacio donde nuevas jugadoras escribieron su primer capítulo competitivo"
        </p>
        <p class="mt-6 text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
          El nivel formativo se respetó. Los duelos fueron apretados. Las jugadoras compitieron sin presión en un ambiente seguro, coherente con su etapa deportiva. Esto es lo que Vikingas significa: abrir espacios hasta que sobren.
        </p>
        <div class="mx-auto mt-8 h-1 w-16 bg-[#d8b45d]"></div>
      </blockquote>
    </section>
  </main>
</template>

<script setup>
import logoVikingas from '../assets/logoVk.png'
import logoZorzales from '../assets/logos/zorzaleslogo.webp'
import logoOdiosas from '../assets/logos/odiosas.jpg'
import logoFenix from '../assets/logos/fenix.png'
import logoPonshi from '../assets/logos/logoponshi.jpg'

import foto2dolugar from '../assets/fotosCampeonato/duplicado.JPG'
import foto3erlugar from '../assets/fotosCampeonato/3erlugar.JPG'
import fotoCampeonas from '../assets/fotosCampeonato/campeonas.JPG'
import fotoClubvikingas from '../assets/fotosCampeonato/clubvikingas.JPG'
import fotoDSC01076 from '../assets/fotosCampeonato/DSC01076.JPG'
import fotoDSC01125 from '../assets/fotosCampeonato/DSC01125.JPG'
import fotoDSC01157 from '../assets/fotosCampeonato/DSC01157.JPG'
import fotoDSC01199 from '../assets/fotosCampeonato/DSC01199.JPG'
import fotoDSC08128 from '../assets/fotosCampeonato/DSC08128.JPG'
import fotoDSC08154 from '../assets/fotosCampeonato/DSC08154.JPG'
import fotoDSC08167 from '../assets/fotosCampeonato/DSC08167.JPG'
import fotoDSC08191 from '../assets/fotosCampeonato/DSC08191.JPG'
import fotoDSC08264 from '../assets/fotosCampeonato/DSC08264.JPG'
import fotoDSC08283 from '../assets/fotosCampeonato/DSC08283.JPG'
import fotoDSC08334 from '../assets/fotosCampeonato/DSC08334.JPG'
import fotoDtTactico from '../assets/fotosCampeonato/foto-dt-tactico.JPG'
import fotoOrganizacion from '../assets/fotosCampeonato/organizacion.JPG'
import fotoPremios from '../assets/fotosCampeonato/premios.JPG'

const heroStats = [
  { value: '5', label: 'Equipos' },
  { value: '5', label: 'Fechas' },
  { value: '50+', label: 'Jugadoras' },
  { value: '10', label: 'Puntos campeonas' },
]

const equiposParticipantes = [
  { nombre: 'Vikingas Formativo', etiqueta: 'Equipo anfitrión', esLocal: true, logo: logoVikingas },
  { nombre: 'Zorzales FC', etiqueta: 'Equipo invitado', esLocal: false, logo: logoZorzales },
  { nombre: 'Fénix', etiqueta: 'Equipo invitado', esLocal: false, logo: logoFenix },
  { nombre: "O'Diosas FC", etiqueta: 'Equipo invitado', esLocal: false, logo: logoOdiosas },
  { nombre: 'PonchiCrack', etiqueta: 'Equipo invitado', esLocal: false, logo: logoPonshi },
]

const jornadas = [
  {
    kicker: 'Fecha 1',
    titulo: 'Debut local',
    subtitulo: 'Vikingas abre el torneo en su cancha',
    libre: 'Libre: Zorzales',
    foto: fotoDSC01076,
    partidos: [
      { cancha: 'Cancha 1', local: 'VK', golesLocal: 1, visita: 'Odiosas', golesVisita: 0, destacado: true },
      { cancha: 'Cancha 2', local: 'Ponchicrack', golesLocal: 4, visita: 'Las Fénix', golesVisita: 0 },
    ],
    relato: 'Las Vikingas partieron con una victoria limpia ante Odiosas. Ponchicrack también marcó presencia con un 4-0 que las instaló temprano como candidatas.',
  },
  {
    kicker: 'Fecha 2',
    titulo: 'Ascensos y caídas',
    subtitulo: 'Ponchicrack entra en la carrera',
    libre: 'Libre: Las Fénix',
    foto: fotoDSC01125,
    partidos: [
      { cancha: 'Cancha 1', local: 'VK', golesLocal: 2, visita: 'Zorzales', golesVisita: 0, destacado: true },
      { cancha: 'Cancha 2', local: 'Ponchicrack', golesLocal: 2, visita: 'Odiosas', golesVisita: 1 },
    ],
    relato: 'Vikingas confirmó que el arranque no fue casualidad. El triunfo ante Zorzales sostuvo el liderato, mientras Ponchicrack se metió de lleno en la pelea.',
  },
  {
    kicker: 'Fecha 3',
    titulo: 'El clásico defensivo',
    subtitulo: 'Vikingas y Ponchicrack se miden de frente',
    libre: 'Libre: Odiosas',
    foto: fotoDSC01157,
    partidos: [
      { cancha: 'Cancha 1', local: 'Las Fénix', golesLocal: 4, visita: 'Zorzales', golesVisita: 2 },
      { cancha: 'Cancha 2', local: 'VK', golesLocal: 1, visita: 'Ponchicrack', golesVisita: 0, destacado: true },
    ],
    relato: '<strong>El partido bisagra.</strong> Vikingas venció 1-0 a su perseguidor directo con un gol agónico de Belén, una diferencia mínima que terminó pesando todo el campeonato.',
  },
  {
    kicker: 'Fecha 4',
    titulo: 'Lucha por la cima',
    subtitulo: 'Fénix sigue persiguiendo a las líderes',
    libre: 'Libre: VK Formativo',
    foto: fotoDSC01199,
    partidos: [
      { cancha: 'Cancha 1', local: 'Odiosas', golesLocal: 1, visita: 'Las Fénix', golesVisita: 2 },
      { cancha: 'Cancha 2', local: 'Ponchicrack', golesLocal: 3, visita: 'Zorzales', golesVisita: 1 },
    ],
    relato: 'Con VK descansando, Fénix y Ponchicrack sumaron. La tabla se apretó y dejó todo listo para una última fecha con margen mínimo.',
  },
  {
    kicker: 'Fecha 5',
    titulo: 'Coronación final',
    subtitulo: 'Las campeonas cierran invictas',
    libre: 'Libre: Ponchicrack',
    foto: fotoDSC08128,
    destacada: true,
    partidos: [
      { cancha: 'Cancha 1', local: 'VK', golesLocal: 2, visita: 'Fénix', golesVisita: 2, destacado: true },
      { cancha: 'Cancha 2', local: 'Odiosas', golesLocal: 1, visita: 'Zorzales', golesVisita: 0 },
    ],
    relato: '<strong>El grito en el último suspiro.</strong> Fénix estuvo arriba dos veces, pero Vikingas respondió. El gol final de Belén selló el 2-2, sostuvo el invicto y dejó el título en casa.',
  },
]

const podio = [
  {
    posicion: 1,
    badge: 'Campeonas',
    nombre: 'Vikingas Formativo',
    puntos: 10,
    foto: fotoCampeonas,
    detalle: '3 victorias, 1 empate, 6 goles a favor y apenas 2 en contra. La campaña más equilibrada del torneo.',
  },
  {
    posicion: 2,
    badge: 'Segundo lugar',
    nombre: 'Ponchicrack',
    puntos: 9,
    foto: foto2dolugar,
    detalle: 'El mejor ataque del campeonato, con 9 goles y una presión constante hasta la última fecha.',
  },
  {
    posicion: 3,
    badge: 'Tercer lugar',
    nombre: 'Las Fénix',
    puntos: 7,
    foto: foto3erlugar,
    detalle: 'Ofensiva valiente, partidos abiertos y una final emocional que casi cambia la historia.',
  },
]

const tableHeads = ['J', 'G', 'E', 'P', 'GF', 'GC', 'Pts']

const tablaFinal = [
  { equipo: 'VK Formativo', pj: 4, pg: 3, pe: 1, pp: 0, gf: 6, gc: 2, pts: 10, campeona: true },
  { equipo: 'Ponchicrack', pj: 4, pg: 3, pe: 0, pp: 1, gf: 9, gc: 3, pts: 9 },
  { equipo: 'Las Fénix', pj: 4, pg: 2, pe: 1, pp: 1, gf: 8, gc: 9, pts: 7 },
  { equipo: 'Odiosas', pj: 4, pg: 1, pe: 0, pp: 3, gf: 3, gc: 5, pts: 3 },
  { equipo: 'Zorzales', pj: 4, pg: 0, pe: 0, pp: 4, gf: 3, gc: 10, pts: 0 },
]

const galeriaPrincipal = [
  { src: fotoDSC01076, alt: 'Acción de la primera fecha', class: 'col-span-2 row-span-2' },
  { src: fotoDSC01125, alt: 'Jugada en cancha' },
  { src: fotoDSC01157, alt: 'Disputa de balón' },
  { src: fotoDSC01199, alt: 'Partido del torneo' },
  { src: fotoDSC08128, alt: 'Momento de la fecha final' },
  { src: fotoOrganizacion, alt: 'Organización del torneo', class: 'col-span-2' },
  { src: fotoDSC08154, alt: 'Técnica durante el juego' },
  { src: fotoDtTactico, alt: 'Indicaciones técnicas' },
  { src: fotoDSC08167, alt: 'Celebración del equipo' },
  { src: fotoDSC08191, alt: 'Momento del campeonato' },
  { src: fotoDSC08264, alt: 'Acción adicional' },
  { src: fotoDSC08283, alt: 'Jugada adicional' },
  { src: fotoDSC08334, alt: 'Cierre de partido' },
  { src: fotoClubvikingas, alt: 'Club Vikingas', class: 'col-span-2' },
  { src: fotoPremios, alt: 'Premiación del torneo' },
]

const records = [
  { kicker: 'Mejor defensa', titulo: 'VK Formativo', descripcion: 'Solo 2 goles recibidos en cuatro partidos.', valor: '2', logo: logoVikingas },
  { kicker: 'Mayor ataque', titulo: 'Ponchicrack', descripcion: 'La producción ofensiva más alta del torneo.', valor: '9', logo: logoPonshi },
  { kicker: 'Momento decisivo', titulo: 'Gol de Belén', descripcion: 'Último minuto para cerrar el empate campeón.', valor: '+', logo: logoVikingas },
  { kicker: 'Consistencia', titulo: 'VK invicta', descripcion: 'Tres triunfos, un empate y ninguna derrota.', valor: '100%', logo: logoVikingas },
  { kicker: 'Mejor debut', titulo: 'Ponchicrack', descripcion: 'Goleada 4-0 en la primera fecha.', valor: '4-0', logo: logoPonshi },
  { kicker: 'Partido abierto', titulo: 'Las Fénix', descripcion: 'Victoria 4-2 ante Zorzales en la fecha 3.', valor: '4-2', logo: logoFenix },
]

const comparativa = [
  {
    posicion: 'Campeonas',
    nombre: 'VK Formativo',
    clave: 'Equilibrio defensivo y carácter para resolver los momentos estrechos.',
    datos: [
      { label: 'Ataque', valor: '6 GF' },
      { label: 'Defensa', valor: '2 GC' },
      { label: 'Diferencia', valor: '+4' },
    ],
  },
  {
    posicion: 'Segunda',
    nombre: 'Ponchicrack',
    clave: 'Potencia ofensiva alta, frenada por el duelo directo ante VK.',
    datos: [
      { label: 'Ataque', valor: '9 GF' },
      { label: 'Defensa', valor: '3 GC' },
      { label: 'Diferencia', valor: '+6' },
    ],
  },
  {
    posicion: 'Tercera',
    nombre: 'Las Fénix',
    clave: 'Equipo emocionante, agresivo en ataque y expuesto en transición.',
    datos: [
      { label: 'Ataque', valor: '8 GF' },
      { label: 'Defensa', valor: '9 GC' },
      { label: 'Diferencia', valor: '-1' },
    ],
  },
]
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
