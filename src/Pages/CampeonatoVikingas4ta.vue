<template>
  <main class="bg-[#f3fbf8] text-[#152227]">
    <section class="relative overflow-hidden border-b border-[#d7ebe5] bg-[radial-gradient(circle_at_top_left,rgba(44,207,191,0.18),transparent_34%),linear-gradient(180deg,#f7fcfa_0%,#eef8f5_100%)]">
      <div class="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0))]"></div>
      <div class="absolute -right-12 top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl sm:h-64 sm:w-64"></div>
      <div class="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#d8b45d]/20 blur-3xl sm:h-56 sm:w-56"></div>

      <div class="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:px-8 lg:py-16 xl:gap-14">
        <div class="max-w-3xl">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.24em] text-primary">Campeonato Vikingas 4ta versión</p>
          <h1 class="mt-4 text-[clamp(2.4rem,8vw,5.8rem)] font-black uppercase leading-[0.88] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
            Fútbol formativo
            <span class="block text-primary">Un espacio real</span>
          </h1>
          <p class="mt-5 max-w-2xl text-[1rem] leading-7 text-[#546267] sm:text-[1.08rem] sm:leading-8">
            Una jornada pensada para equipos formativos reales, con jugadoras de poca o nula experiencia que merecen vivir la competencia en un entorno cuidado, claro y coherente con su etapa.
          </p>

          <div class="mt-7 grid gap-3 sm:grid-cols-3">
            <article class="rounded-[1.8rem] border border-[#d6ebe5] bg-white/88 px-4 py-4 shadow-[0_18px_40px_rgba(21,34,39,0.06)] backdrop-blur-sm">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Fecha</p>
              <p class="mt-2 text-lg font-black uppercase text-[#152227]">16 de mayo</p>
            </article>
            <article class="rounded-[1.8rem] border border-[#d6ebe5] bg-white/88 px-4 py-4 shadow-[0_18px_40px_rgba(21,34,39,0.06)] backdrop-blur-sm">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Horario</p>
              <p class="mt-2 text-lg font-black uppercase text-[#152227]">Desde 16:00</p>
            </article>
            <article class="rounded-[1.8rem] border border-[#d6ebe5] bg-white/88 px-4 py-4 shadow-[0_18px_40px_rgba(21,34,39,0.06)] backdrop-blur-sm sm:col-span-3 lg:col-span-1">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Lugar</p>
              <p class="mt-2 text-lg font-black uppercase text-[#152227]">Domingo Tocornal</p>
            </article>
          </div>

          <div class="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#equipos"
              class="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] bg-[#152227] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition-transform duration-200 hover:-translate-y-1"
            >
              Ver equipos
            </a>
            <a
              href="#formato"
              class="inline-flex min-h-12 items-center justify-center rounded-[1.2rem] border border-[#cfe5de] bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#152227] transition-transform duration-200 hover:-translate-y-1"
            >
              Cómo funciona
            </a>
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-0 translate-x-2 translate-y-3 rounded-[2.25rem] bg-[#d8b45d]/18 blur-2xl"></div>
          <div class="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white p-3 shadow-[0_28px_80px_rgba(21,34,39,0.12)] sm:p-4">
            <img
              src="../assets/seriec/eve.jpg"
              alt="Jugadoras Vikingas en jornada de campeonato"
              class=" h-96  w-full rounded-[1.75rem] object-cover object-top sm:h-70 lg:h-105"
            >
            <div class="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
              <div class="mx-auto flex h-20 w-20 items-center justify-center   sm:mx-0 sm:h-24 sm:w-24">
                <img :src="logoVikingas" alt="Logo Vikingas Formativo" class="h-12 w-12 object-contain sm:h-14 sm:w-14">
              </div>
              <div class="rounded-[1.6rem] border border-[#d8ebe5] bg-[#f5fbf9] px-4 py-4">
                <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-primary">Objetivo</p>
                <p class="mt-2 text-sm leading-7 text-[#4f5d63] sm:text-[0.98rem]">
                  Abrir un espacio competitivo para mujeres que están dando sus primeros pasos, con clubes que se toman en serio el trabajo formativo y el cuidado del entorno.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-start">
        <article class="rounded-4xl border border-[#d8ebe5] bg-white px-5 py-6 shadow-[0_18px_60px_rgba(21,34,39,0.07)] sm:px-7 sm:py-8">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Sobre el torneo</p>
          <h2 class="mt-4 text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-18 text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
            Un espacio para jugadoras que quieren competir por primera vez
          </h2>
          <div class="mt-6 space-y-5 text-[1rem] leading-8 text-[#55646a] sm:text-[1.04rem]">
            <p>
              Este campeonato nace para defender un espacio real para equipos formativos, con jugadoras que recién comienzan o que todavía tienen poca experiencia competitiva.
            </p>
            <p>
              La idea es reunir a clubes organizados que sí están abriendo lugar a nuevas jugadoras, sin mezclar niveles que terminen rompiendo el sentido del torneo.
            </p>
            <p>
              El foco está puesto en que cada partido se viva desde un contexto seguro, sano y coherente con la etapa formativa de las futbolistas que participan.
            </p>
          </div>
        </article>

        <aside class="rounded-4xl border border-[#d8b45d]/35 bg-[linear-gradient(180deg,#fffaf0_0%,#fff3d8_100%)] px-5 py-6 shadow-[0_22px_70px_rgba(138,107,45,0.16)] sm:px-7 sm:py-8">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#8a6b2d]">Sin excepciones</p>
          <h3 class="mt-3 text-[clamp(1.8rem,5vw,2.8rem)] font-black uppercase leading-[0.95] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
            Restricciones
          </h3>
          <p class="mt-4 max-w-md text-sm leading-7 text-[#6f5a28] sm:text-[0.98rem]">
            El campeonato está reservado para procesos formativos reales. Estas condiciones se aplican a todos los equipos invitados.
          </p>
          <ul class="mt-6 space-y-4 text-sm leading-7 text-[#4e4330] sm:text-[1rem]">
            <li class="flex items-start gap-3 rounded-[1.35rem] border border-[#e4c985] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(138,107,45,0.1)]">
              <span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8a6b2d] text-[0.72rem] font-black text-white">1</span>
              <span class="font-semibold">No se aceptan jugadoras de primera división.</span>
            </li>
            <li class="flex items-start gap-3 rounded-[1.35rem] border border-[#e4c985] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(138,107,45,0.1)]">
              <span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8a6b2d] text-[0.72rem] font-black text-white">2</span>
              <span class="font-semibold">No se aceptan jugadoras de serie B+.</span>
            </li>
            <li class="flex items-start gap-3 rounded-[1.35rem] border border-[#e4c985] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(138,107,45,0.1)]">
              <span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8a6b2d] text-[0.72rem] font-black text-white">3</span>
              <span class="font-semibold">No se aceptan jugadoras federadas.</span>
            </li>
            <li class="flex items-start gap-3 rounded-[1.35rem] border border-[#e4c985] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(138,107,45,0.1)]">
              <span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8a6b2d] text-[0.72rem] font-black text-white">4</span>
              <span class="font-semibold">No se aceptan ex federadas.</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section id="equipos" class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Equipos participantes</p>
          <h2 class="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-black uppercase leading-18 text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
            Cinco equipos en jornada todas contra todas
          </h2>
        </div>
        <p class="max-w-xl text-sm leading-7 text-[#56666b] sm:text-right sm:text-[0.98rem]">
            Vikingas Formativo participa junto a cuatro equipos invitados que comparten el enfoque de abrir competencia para nuevas jugadoras.
        </p>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article
          v-for="equipo in equiposParticipantes"
          :key="equipo.nombre"
          class="group rounded-[1.9rem] border border-[#d6ebe5] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(21,34,39,0.06)] transition-transform duration-200 hover:-translate-y-1"
        >
          <div class="flex flex-col gap-4" :class="equipo.esLocal ? 'items-center text-center' : 'items-start'">
            <div
              class="flex w-24 mx-auto shrink-0 items-center justify-center rounded-[1.35rem] "
            >
              <img v-if="equipo.logo" :src="equipo.logo" :alt="`Logo ${equipo.nombre}`" class=" rounded-full object-cover">
              <span v-else class="text-xs font-black uppercase tracking-[0.14em] py-7 ">Por confirmar</span>
            </div>

            <div class="min-w-0 flex flex-col item-center mx-auto justify-center " :class="equipo.esLocal ? 'w-full' : ''">
              <p class="text-[0.68rem] text-center font-black uppercase tracking-[0.2em]" :class="equipo.esLocal ? 'text-primary' : 'text-[#8a6b2d]'">
                {{ equipo.etiqueta }}
              </p>
              <h3 class="mt-2 text-xl text-center font-black uppercase leading-tight text-[#152227]">
                {{ equipo.nombre }}
              </h3>
            </div>
          </div>
        
        </article>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <article class="overflow-hidden rounded-4xl border border-[#d8ebe5] bg-white shadow-[0_18px_60px_rgba(21,34,39,0.07)]">
          <div class="border-b border-[#e2efeb] px-5 py-5 sm:px-7">
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Tabla de posiciones</p>
            <h2 class="mt-3 text-[clamp(1.9rem,5vw,3.2rem)] font-black uppercase leading-[0.95] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
              CAMPEONATO VK
            </h2>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm text-[#425158]">
              <thead class="bg-[#f4faf8] text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#55727a]">
                <tr>
                  <th scope="col" class="px-4 py-4 sm:px-6">Equipo</th>
                  <th scope="col" class="px-3 py-4 text-center">PJ</th>
                  <th scope="col" class="px-3 py-4 text-center">PG</th>
                  <th scope="col" class="px-3 py-4 text-center">PE</th>
                  <th scope="col" class="px-3 py-4 text-center">PP</th>
                  <th scope="col" class="px-3 py-4 text-center">GF</th>
                  <th scope="col" class="px-3 py-4 text-center">GC</th>
                  <th scope="col" class="px-4 py-4 text-center sm:px-6">Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fila in tablaPosiciones" :key="fila.equipo" class="border-t border-[#e5f0ed]">
                  <th scope="row" class="px-4 py-4 text-sm font-black uppercase text-[#152227] sm:px-6">{{ fila.equipo }}</th>
                  <td class="px-3 py-4 text-center">{{ fila.pj }}</td>
                  <td class="px-3 py-4 text-center">{{ fila.pg }}</td>
                  <td class="px-3 py-4 text-center">{{ fila.pe }}</td>
                  <td class="px-3 py-4 text-center">{{ fila.pp }}</td>
                  <td class="px-3 py-4 text-center">{{ fila.gf }}</td>
                  <td class="px-3 py-4 text-center">{{ fila.gc }}</td>
                  <td class="px-4 py-4 text-center font-black sm:px-6">{{ fila.pts }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article id="formato" class="rounded-4xl border border-[#d8ebe5] bg-[linear-gradient(180deg,#ffffff_0%,#f5faf8_100%)] px-5 py-6 shadow-[0_18px_60px_rgba(21,34,39,0.07)] sm:px-7 sm:py-8">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-primary">Formato</p>
          <h2 class="mt-3 text-[clamp(1.9rem,5vw,3rem)] font-black uppercase leading-[0.95] text-[#152227]" style="font-family: 'Gobold High', sans-serif;">
            Fácil de entender
          </h2>

          <div class="mt-6 space-y-4">
            <article class="rounded-[1.4rem] border border-[#deece7] bg-white px-4 py-4">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Paso 1</p>
              <p class="mt-2 text-sm leading-7 text-[#55636a]">Los cinco equipos juegan una fase todos contra todos durante la jornada.</p>
            </article>
            <article class="rounded-[1.4rem] border border-[#deece7] bg-white px-4 py-4">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Paso 2</p>
              <p class="mt-2 text-sm leading-7 text-[#55636a]">La tabla define a las campeonas y también el orden del segundo y tercer lugar.</p>
            </article>
            <article class="rounded-[1.4rem] border border-[#deece7] bg-white px-4 py-4">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Paso 3</p>
              <p class="mt-2 text-sm leading-7 text-[#55636a]">Lo importante no es solo competir: también sostener un ambiente seguro para procesos iniciales.</p>
            </article>
          </div>
        </article>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
      <div class="rounded-[2.2rem] border border-[#d8ebe5] bg-[#152227] px-5 py-7 shadow-[0_24px_80px_rgba(21,34,39,0.18)] sm:px-7 sm:py-9 lg:px-9">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#d8b45d]">Cruces del campeonato</p>
            <h2 class="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-black uppercase leading-[0.94] text-white" style="font-family: 'Gobold High', sans-serif;">
              Programación por definir
            </h2>
          </div>
 
        </div>

        <div class="mt-8 grid gap-4 lg:grid-cols-2">
          <article
            v-for="cruce in crucesDummy"
            :key="cruce.id"
            class="rounded-[1.7rem] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-sm sm:px-5"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#d8b45d]">{{ cruce.etapa }}</p>
                <p class="mt-1 text-sm leading-6 text-white/64">Por definir</p>
              </div>
              <span class="inline-flex w-fit rounded-full border border-white/12 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/70">
                Próximamente
              </span>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div class="rounded-[1.2rem] bg-white/8 px-4 py-4 text-center text-sm font-black uppercase leading-6 text-white">
                {{ cruce.local }}
              </div>
              <div class="text-center text-[0.7rem] font-black uppercase tracking-[0.22em] text-[#9dc9c2]">vs</div>
              <div class="rounded-[1.2rem] bg-white/8 px-4 py-4 text-center text-sm font-black uppercase leading-6 text-white">
                {{ cruce.visita }}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import bannerEquipos from '../assets/bannerequipos.webp'
import logoVikingas from '../assets/logoVk.png'
import logoZorzales from '../assets/logos/zorzaleslogo.webp'
import logoOdiosas from '../assets/logos/odiosas.jpg'
import logoFenix from '../assets/logos/fenix.png'
import logoPonshi from '../assets/logos/logoponshi.jpg'

const equiposParticipantes = [
  {
    nombre: 'Vikingas Formativo',
    etiqueta: 'Equipo anfitrión',
    esLocal: true,
    logo: logoVikingas,
  },
  {
    nombre: 'Zorzales FC',
    etiqueta: 'Equipo invitado',
    esLocal: false,
    logo: logoZorzales,
  },
  {
    nombre: 'Fénix',
    etiqueta: 'Equipo invitado',
    esLocal: false,
    logo: logoFenix,

  },
  {
    nombre: "O'Diosas FC",
    etiqueta: 'Equipo invitado',
    esLocal: false,
    logo: logoOdiosas,

  },
  {
    nombre: 'PonchiCrack',
    etiqueta: 'Equipo invitado',
    esLocal: false,
    logo: logoPonshi,


  },
]

const tablaPosiciones = equiposParticipantes.map(({ nombre }) => ({
  equipo: nombre,
  pj: 0,
  pg: 0,
  pe: 0,
  pp: 0,
  gf: 0,
  gc: 0,
  pts: 0,
}))

const crucesDummy = [
  {
    id: 1,
    etapa: 'Fecha 1',
    horario: '16:00 - Cancha 1',
    local: 'Equipo',
    visita: 'Equipo Invitado 1',
  },
  {
    id: 2,
    etapa: 'Fecha 1',
    horario: '16:00 - Cancha 2',
    local: 'Equipo Invitado 2',
    visita: 'Equipo Invitado 3',
  },
  {
    id: 3,
    etapa: 'Fecha 2',
    horario: '16:40 - Cancha 1',
    local: 'Equipo',
    visita: 'Equipo Invitado 4',
  },
  {
    id: 4,
    etapa: 'Fecha 2',
    horario: '16:40 - Cancha 2',
    local: 'Equipo Invitado 1',
    visita: 'Equipo Invitado 2',
  },
  {
    id: 5,
    etapa: 'Fecha 3',
    horario: '17:20 - Cancha 1',
    local: 'Equipo Invitado 3',
    visita: 'Equipo',
  },
  {
    id: 6,
    etapa: 'Fecha 3',
    horario: '17:20 - Cancha 2',
    local: 'Equipo Invitado 4',
    visita: 'Equipo Invitado 1',
  },
]
</script>

<style>

html {
    scroll-behavior: smooth;
}
</style>