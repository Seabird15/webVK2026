<template>
  <section class="relative min-h-screen overflow-hidden bg-[#edf9f7] text-[#172126]">
    <div class="absolute inset-0" aria-hidden="true">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),transparent_22%),linear-gradient(180deg,rgba(237,249,247,0.98),rgba(237,249,247,1))]"></div>
      <div class="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-[#c9a84c]/20 blur-3xl"></div>
      <div class="absolute right-[-6%] top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
    </div>

    <div class="relative z-10">
      <section class="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
        <div class="overflow-hidden rounded-4xl border border-[#cfe9e4] bg-white shadow-[0_30px_80px_rgba(27,87,79,0.10)]">
          <div class="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div class="p-6 sm:p-8 lg:p-10">
              <div class="inline-flex items-center gap-3 rounded-full border border-[#cfe9e4] bg-[#f4fcfa] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#31756d]">
                <img :src="logoVikingas" alt="Vikingas" class="h-6 w-6 object-contain">
                Campeonato solidario Vikingas
              </div>

              <h1 class="mt-6 uppercase leading-[0.86] text-[#122126]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(3rem, 8vw, 6.6rem);">
                <span class="block text-[#8b6a2f]">Campeonato</span>
                <span class="block">Vikingas</span>
                <span class="block text-primary">4ta versión</span>
              </h1>

              <p class="mt-6 max-w-2xl text-[clamp(1rem,2.2vw,1.24rem)] leading-relaxed text-[#415059]">
                Relámpago de un día para recaudar fondos, enfocado exclusivamente en equipos de categoría C formativa. Una propuesta clara, justa y pensada para el contexto real del torneo.
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div class="rounded-full bg-[#152227] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">
                  16 de mayo · desde las 16 hrs
                </div>
                <div class="rounded-full border border-[#cfe9e4] bg-[#f4fcfa] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#31756d]">
                  Canchas Domingo Tocornal
                </div>
                <div class="rounded-full border border-primary/25 bg-primary/10 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-primary">
                  5 equipos participantes
                </div>
              </div>

              <div class="mt-10 max-w-3xl border-l-4 border-primary pl-5 sm:pl-6">
                <p class="text-[0.72rem] font-black uppercase tracking-[0.24em] text-primary">Condición obligatoria</p>
                <p class="mt-3 text-[clamp(1.35rem,3.1vw,2.45rem)] font-black leading-[1.08] text-[#152227]">
                  Solo categoría C formativa.
                  <span class="text-[#5b696f]"> No se aceptan jugadoras de primera división, serie B+, federadas ni ex federadas.</span>
                </p>
              </div>
            </div>

            <div class="relative min-h-88 border-t border-[#d7ede8] bg-[#dff4f0] lg:border-l lg:border-t-0">
              <img
                :src="bannerEquipos"
                alt="Ambiente Vikingas"
                class="h-full w-full object-cover"
              >
              <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(237,249,247,0.12),rgba(237,249,247,0.68)_65%,rgba(237,249,247,0.92))]"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div class="max-w-md rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_rgba(89,66,24,0.12)] backdrop-blur-sm">
                  <p class="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#8a6b2d]">Objetivo de la jornada</p>
                  <p class="mt-3 text-lg font-black text-[#152227]">Abrir espacios reales para mujeres que recién comienzan.</p>
                  <p class="mt-2 text-sm leading-7 text-[#546168]">
                    Queremos que mujeres con poca o nada de experiencia también puedan vivir una competencia en un ambiente seguro, sano y formativo. Hoy existen muy pocos espacios pensados para este perfil de jugadora.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div class="grid gap-4 md:grid-cols-3">
          <article class="rounded-[1.8rem] border border-[#d7ede8] bg-white px-5 py-6 shadow-[0_20px_55px_rgba(27,87,79,0.08)]">
            <p class="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#8a6b2d]">Fecha</p>
            <p class="mt-3 text-2xl font-black text-[#152227]">Viernes 16 de mayo</p>
            <p class="mt-2 text-sm leading-7 text-[#5b696f]">Inicio desde las 16:00 hrs.</p>
          </article>
          <article class="rounded-[1.8rem] border border-[#d7ede8] bg-white px-5 py-6 shadow-[0_20px_55px_rgba(27,87,79,0.08)]">
            <p class="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#8a6b2d]">Sede</p>
            <p class="mt-3 text-2xl font-black text-[#152227]">Domingo Tocornal</p>
            <p class="mt-2 text-sm leading-7 text-[#5b696f]">Canchas del campeonato y jornada completa por anunciar.</p>
          </article>
          <article class="rounded-[1.8rem] border border-[#d7eee9] bg-[#f3fbf9] px-5 py-6 shadow-[0_20px_55px_rgba(34,134,120,0.08)]">
            <p class="text-[0.68rem] font-black uppercase tracking-[0.22em] text-primary">Formato</p>
            <p class="mt-3 text-2xl font-black text-[#152227]">Campeonato relámpago</p>
            <p class="mt-2 text-sm leading-7 text-[#5b696f]">Cinco equipos, un día, tabla de posiciones y jornada solidaria.</p>
          </article>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Sobre el torneo</p>
            <h2 class="mt-4 xl:leading-18 text-[clamp(2rem,4.5vw,4rem)] font-black uppercase leading-[0.92] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
              Una jornada pensada para competir con reglas claras
            </h2>
            <div class="mt-6 max-w-3xl space-y-5 text-[1rem] leading-8 text-[#526067] sm:text-[1.05rem]">
              <p>
                Este campeonato quiere defender algo que hoy cuesta mucho encontrar: un espacio realmente pensado para equipos formativos de verdad, con <strong class="font-black text-[#152227]">jugadoras que recién están empezando</strong> o que todavía tienen poca experiencia competitiva.
              </p>
              <p>
                La intención no es mezclar niveles ni abrir una convocatoria ambigua. Queremos reunir a clubes organizados que también estén haciendo el trabajo de abrir cancha a nuevas jugadoras, sostener procesos iniciales y ofrecer experiencias sanas de competencia a mujeres que muchas veces quedan fuera de otros torneos.
              </p>
              <p>
                Por eso el foco está puesto en <strong class="font-black text-[#152227]">categoría C formativa real</strong>: equipos que buscan crecer con seriedad, cuidar el entorno y darles un lugar a futbolistas conpoca o nada de experiencia para que también puedan vivir el torneo desde un <strong class="font-black text-[#152227]">contexto seguro</strong> y coherente con su etapa.
              </p>
            </div>
          </div>

          <aside class="rounded-4xl border border-[#d6ece7] bg-[#f7fcfb] p-6 shadow-[0_22px_60px_rgba(27,87,79,0.08)] sm:p-7">
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#8a6b2d]">Sin excepciones</p>
            <h3 class="mt-3 text-3xl font-black uppercase leading-[0.94] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
              Restricciones
            </h3>
            <ul class="mt-6 space-y-4 text-sm leading-7 text-[#55626a] sm:text-[0.98rem]">
              <li class="border-b border-[#e0f1ee] pb-4">No se aceptan jugadoras de primera división.</li>
              <li class="border-b border-[#e0f1ee] pb-4">No se aceptan jugadoras de serie B+.</li>
              <li class="border-b border-[#e0f1ee] pb-4">No se aceptan jugadoras federadas.</li>
              <li>No se aceptan ex federadas.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div class="rounded-4xl border border-[#e8dcc5] bg-white p-6 shadow-[0_28px_70px_rgba(89,66,24,0.08)] sm:p-8">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Equipos participantes</p>
              <h2 class="mt-3 text-[clamp(2rem,4vw,3.3rem)] font-black uppercase leading-[0.92] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
                Cinco equipos para una sola tarde
              </h2>
            </div>
            <p class="max-w-xl text-sm leading-7 text-[#5a686e]">
              Vikingas Formativo ocupa uno de los cupos y los otros cuatro se muestran como equipos invitados hasta confirmar participación oficial.
            </p>
          </div>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <article
              v-for="equipo in equiposParticipantes"
              :key="equipo.nombre"
              class="flex flex-col items-center rounded-[1.6rem] border border-[#ece1cb] bg-[#fcfaf5] px-4 py-5 text-center"
            >
              <div class="flex h-24 w-24 items-center justify-center rounded-full border border-[#e7d8b7] bg-white shadow-[0_12px_30px_rgba(89,66,24,0.08)]">
                <img
                  v-if="equipo.logo"
                  :src="equipo.logo"
                  :alt="equipo.nombre"
                  class="h-16 w-16 object-contain"
                >
                <div
                  v-else
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-[#152227] to-primary text-lg font-black uppercase tracking-[0.14em] text-white"
                >
                  {{ equipo.sigla }}
                </div>
              </div>
              <p class="mt-4 text-sm font-black uppercase tracking-[0.08em] text-[#152227]">{{ equipo.nombre }}</p>
              <p class="mt-2 text-xs leading-6 text-[#67757b]">{{ equipo.estado }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div class="overflow-hidden rounded-4xl border border-[#d9ece8] bg-[#f7fbfa] shadow-[0_24px_60px_rgba(34,134,120,0.08)]">
          <div class="border-b border-[#dceeea] px-6 py-6 sm:px-8">
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Tabla de posiciones</p>
            <h2 class="mt-3 text-[clamp(2rem,4vw,3.1rem)] font-black uppercase leading-[0.92] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
              Cómo se verá la tabla del torneo
            </h2>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-[#5a686e]">
              Vista preliminar de la tabla de posiciones para mostrar el formato del campeonato mientras se definen los equipos y resultados oficiales.
            </p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left">
              <thead>
                <tr class="border-b border-[#dceeea] bg-white/70 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#5e6b72]">
                  <th class="px-6 py-4 sm:px-8">Pos</th>
                  <th class="px-6 py-4 sm:px-8">Equipo</th>
                  <th class="px-4 py-4 text-center">PJ</th>
                  <th class="px-4 py-4 text-center">G</th>
                  <th class="px-4 py-4 text-center">E</th>
                  <th class="px-4 py-4 text-center">P</th>
                  <th class="px-4 py-4 text-center">DG</th>
                  <th class="px-6 py-4 text-center sm:px-8">Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="fila in tablaPosiciones"
                  :key="fila.posicion"
                  class="border-b border-[#e3f0ed] text-sm text-[#203037] last:border-b-0"
                >
                  <td class="px-6 py-4 font-black sm:px-8">{{ fila.posicion }}</td>
                  <td class="px-6 py-4 sm:px-8">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#d6e9e4] bg-white">
                        <img
                          v-if="fila.logo"
                          :src="fila.logo"
                          :alt="fila.equipo"
                          class="h-7 w-7 object-contain"
                        >
                        <div
                          v-else
                          class="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#152227] to-primary text-[11px] font-black uppercase text-white"
                        >
                          {{ fila.sigla }}
                        </div>
                      </div>
                      <span class="font-bold">{{ fila.equipo }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-4 text-center font-semibold">{{ fila.pj }}</td>
                  <td class="px-4 py-4 text-center font-semibold">{{ fila.g }}</td>
                  <td class="px-4 py-4 text-center font-semibold">{{ fila.e }}</td>
                  <td class="px-4 py-4 text-center font-semibold">{{ fila.p }}</td>
                  <td class="px-4 py-4 text-center font-semibold">{{ fila.dg }}</td>
                  <td class="px-6 py-4 text-center font-black text-primary sm:px-8">{{ fila.pts }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div class="rounded-4xl border border-[#d6ebe7] bg-white p-6 shadow-[0_24px_60px_rgba(34,134,120,0.08)] sm:p-8">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Cruces del campeonato</p>
              <h2 class="mt-3 text-[clamp(2rem,4vw,3.1rem)] font-black uppercase leading-[0.92] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
                Formato todos contra todos
              </h2>
            </div>
            <p class="max-w-2xl text-sm leading-7 text-[#5a686e]">
              Los cinco equipos jugarán en modalidad todos contra todos. Las campeonas y los puestos de segundo y tercer lugar se definirán directamente por tabla de posiciones.
            </p>
          </div>

          <div class="mt-8 grid gap-4 lg:grid-cols-3">
            <article class="rounded-[1.6rem] border border-[#dff0ec] bg-[#f7fcfb] px-5 py-5">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Paso 1</p>
              <h3 class="mt-3 text-lg font-black text-[#152227]">Todos contra todos</h3>
              <p class="mt-2 text-sm leading-7 text-[#5c6a70]">
                Cada equipo juega contra los demás durante la misma jornada.
              </p>
            </article>

            <article class="rounded-[1.6rem] border border-[#dff0ec] bg-[#f7fcfb] px-5 py-5">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Paso 2</p>
              <h3 class="mt-3 text-lg font-black text-[#152227]">Se ordena la tabla</h3>
              <p class="mt-2 text-sm leading-7 text-[#5c6a70]">
                La ubicación final se define por puntos y diferencia de gol en la tabla general.
              </p>
            </article>

            <article class="rounded-[1.6rem] border border-[#dff0ec] bg-[#f7fcfb] px-5 py-5">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Paso 3</p>
              <h3 class="mt-3 text-lg font-black text-[#152227]">Se premian los lugares</h3>
              <p class="mt-2 text-sm leading-7 text-[#5c6a70]">
                Campeonas, segundo y tercer lugar se definen directamente por la tabla de posiciones.
              </p>
            </article>
          </div>

          <div class="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="cruce in crucesDummy"
              :key="cruce.id"
              class="rounded-[1.6rem] border border-[#e2f0ed] bg-[#f8fcfb] p-5"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">{{ cruce.fecha }}</p>
                  <p class="mt-2 text-sm font-semibold text-[#627177]">{{ cruce.hora }} · {{ cruce.cancha }}</p>
                </div>
                <span class="rounded-full border border-[#d6ebe7] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#627177]">
                  {{ cruce.ronda }}
                </span>
              </div>

              <div class="mt-5 space-y-3">
                <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <span class="text-center text-[0.95rem] font-black leading-5 text-[#152227] wrap-break-word">{{ cruce.local }}</span>
                  <span class="text-xs font-black uppercase tracking-[0.18em] text-[#6b7b80]">vs</span>
                  <span class="text-center text-[0.95rem] font-black leading-5 text-[#152227] wrap-break-word">{{ cruce.visita }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-5xl px-4 pb-18 text-center sm:px-6 lg:px-8 lg:pb-24">
        <p class="text-[0.72rem] font-black uppercase tracking-[0.24em] text-primary">Próximamente</p>
        <h2 class="mt-4 text-[clamp(2.2rem,4.8vw,4.2rem)] font-black uppercase leading-[0.9] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
          Más información muy pronto
        </h2>
        <p class="mx-auto mt-6 max-w-3xl text-[1rem] leading-8 text-[#5c696f] sm:text-[1.08rem]">
          Publicaremos fixture, equipos confirmados, bases y detalles de inscripción para que toda la información oficial quede clara antes del campeonato.
        </p>
      </section>
    </div>
  </section>
</template>

<script setup>
const logoVikingas = new URL('../assets/logoVk.png', import.meta.url).href;
const bannerEquipos = new URL('../assets/bannerequipos.webp', import.meta.url).href;

const equiposParticipantes = [
  {
    nombre: 'Vikingas Formativo',
    logo: logoVikingas,
    sigla: 'VF',
    estado: 'Cupo base del torneo'
  },
  {
    nombre: 'Equipo Invitado',
    logo: '',
    sigla: 'E1',
    estado: 'Cupo por confirmar'
  },
  {
    nombre: 'Equipo Invitado',
    logo: '',
    sigla: 'E2',
    estado: 'Cupo por confirmar'
  },
  {
    nombre: 'Equipo Invitado',
    logo: '',
    sigla: 'E3',
    estado: 'Cupo por confirmar'
  },
  {
    nombre: 'Equipo Invitado',
    logo: '',
    sigla: 'E4',
    estado: 'Cupo por confirmar'
  }
];

const tablaPosiciones = [
  { posicion: 1, equipo: 'Vikingas Formativo', logo: logoVikingas, sigla: 'VF', pj: 0, g: 0, e: 0, p: 0, dg: '0', pts: 0 },
  { posicion: 2, equipo: 'Equipo Invitado', logo: '', sigla: 'E1', pj: 0, g: 0, e: 0, p: 0, dg: '0', pts: 0 },
  { posicion: 3, equipo: 'Equipo Invitado', logo: '', sigla: 'E2', pj: 0, g: 0, e: 0, p: 0, dg: '0', pts: 0 },
  { posicion: 4, equipo: 'Equipo Invitado', logo: '', sigla: 'E3', pj: 0, g: 0, e: 0, p: 0, dg: '0', pts: 0 },
  { posicion: 5, equipo: 'Equipo Invitado', logo: '', sigla: 'E4', pj: 0, g: 0, e: 0, p: 0, dg: '0', pts: 0 }
];

const crucesDummy = [
  {
    id: 'r1-a',
    ronda: 'Fecha 1',
    fecha: '16 mayo',
    hora: '16:00',
    cancha: 'Cancha 1',
    local: 'Vikingas Formativo',
    visita: 'Equipo Invitado'
  },
  {
    id: 'r1-b',
    ronda: 'Fecha 1',
    fecha: '16 mayo',
    hora: '16:40',
    cancha: 'Cancha 2',
    local: 'Equipo Invitado',
    visita: 'Equipo Invitado'
  },
  {
    id: 'r2-a',
    ronda: 'Fecha 2',
    fecha: '16 mayo',
    hora: '17:20',
    cancha: 'Cancha 1',
    local: 'Equipo Invitado',
    visita: 'Vikingas Formativo'
  },
  {
    id: 'r2-b',
    ronda: 'Fecha 2',
    fecha: '16 mayo',
    hora: '18:00',
    cancha: 'Cancha 2',
    local: 'Equipo Invitado',
    visita: 'Equipo Invitado'
  },
  {
    id: 'r3-a',
    ronda: 'Fecha 3',
    fecha: '16 mayo',
    hora: '18:40',
    cancha: 'Cancha 1',
    local: 'Vikingas Formativo',
    visita: 'Equipo Invitado'
  },
  {
    id: 'r3-b',
    ronda: 'Fecha 3',
    fecha: '16 mayo',
    hora: '19:20',
    cancha: 'Cancha 2',
    local: 'Equipo Invitado',
    visita: 'Equipo Invitado'
  }
];
</script>