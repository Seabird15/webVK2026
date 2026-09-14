<template>
  <section class="estadisticas-page overflow-hidden bg-(--st-bg) text-(--st-text)">
    <div class="hidden relative isolate">
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

    <div class="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
      <section class="relative overflow-hidden pb-10 sm:pb-12">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-[0.68rem] font-black uppercase tracking-[0.24em] text-(--st-primary)">Vikingas en números</p>
            <h1 class="mt-3 max-w-3xl text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.82] text-white" style="font-family: 'Gobold High', sans-serif;">Rendimiento<br /><span class="text-(--st-primary)">colectivo</span></h1>
            <p class="mt-6 max-w-xl text-pretty text-base leading-7 text-white/62 sm:text-lg">El rendimiento también cuenta la historia. Revisa el aporte de cada plantel, partido a partido.</p>
          </div>
          <p class="max-w-xs text-sm leading-6 text-white/42 lg:pb-1 lg:text-right">La competencia interna eleva al equipo. Cada cifra representa trabajo, constancia y compañerismo.</p>
        </div>

        <div class="mt-10 flex flex-col gap-7 border-y border-white/12 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p class="shrink-0 text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/42">Plantel</p>
            <div class="flex flex-wrap gap-x-6 gap-y-2">
              <button
                v-for="equipo in equipos"
                :key="equipo.id"
                type="button"
                @click="equipoActivo = equipo.id"
                class="relative min-h-10 cursor-pointer px-0 py-2 text-left text-sm font-black uppercase tracking-widest text-white/45 transition-colors duration-200 hover:text-white"
                :class="equipoActivo === equipo.id ? 'text-white after:absolute after:inset-x-0 after:-bottom-[1.35rem] after:h-0.5 after:bg-(--st-primary)' : ''"
              >
                {{ equipo.label }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-4 sm:justify-end">
            <p class="shrink-0 text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/42">Periodo</p>
            <div class="flex gap-1 border-l border-white/12 pl-4">
              <button
                type="button"
                @click="tipoEstadistica = 'competicion'"
                class="min-h-10 cursor-pointer px-3 text-xs font-black uppercase tracking-[0.08em] transition-colors duration-200"
                :class="tipoEstadistica === 'competicion' ? 'text-(--st-primary)' : 'text-white/45 hover:text-white'"
              >
                Competición
              </button>
              <button
                type="button"
                @click="tipoEstadistica = 'amistosos'"
                class="min-h-10 cursor-pointer px-3 text-xs font-black uppercase tracking-[0.08em] transition-colors duration-200"
                :class="tipoEstadistica === 'amistosos' ? 'text-(--st-primary)' : 'text-white/45 hover:text-white'"
              >
                Amistosos
              </button>
            </div>
          </div>
        </div>
      </section>

      <div v-if="isLoading" class="st-fade text-center py-12">
        <div class="inline-block">
          <div class="animate-spin h-12 w-12 rounded-full border-b-2 border-(--st-primary)"></div>
        </div>
        <p class="mt-4 font-medium text-white/70">Cargando estadísticas...</p>
      </div>

      <div v-else class="space-y-16">
        <div class="space-y-16">
          <section class="grid divide-y divide-white/12 border-y border-white/12 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4" aria-label="Resumen del equipo">
          <div class="px-1 py-5 sm:px-5">
            <div class="flex items-center justify-between gap-3">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-(--st-primary)">Goles del equipo</p>
              <FireIcon class="h-5 w-5 text-(--st-primary)" />
            </div>
            <p class="mt-3 text-4xl font-black tabular-nums text-white">{{ resumenEquipo.goles }}</p>
          </div>
          <div class="px-1 py-5 sm:px-5">
            <div class="flex items-center justify-between gap-3">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/55">Asistencias</p>
              <SparklesIcon class="h-5 w-5 text-(--st-primary)" />
            </div>
            <p class="mt-3 text-4xl font-black tabular-nums text-white">{{ resumenEquipo.asistencias }}</p>
          </div>
          <div class="px-1 py-5 sm:px-5">
            <div class="flex items-center justify-between gap-3">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/55">Partidos jugados</p>
              <ChartBarIcon class="h-5 w-5 text-(--st-primary)" />
            </div>
            <p class="mt-3 text-4xl font-black tabular-nums text-white">{{ resumenEquipo.partidos }}</p>
          </div>
          <div class="px-1 py-5 sm:px-5">
            <div class="flex items-center justify-between gap-3">
              <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-(--st-accent)">MVP elegidas</p>
              <TrophyIcon class="h-5 w-5 text-(--st-accent)" />
            </div>
            <p class="mt-3 text-4xl font-black tabular-nums text-white">{{ resumenEquipo.mvp }}</p>
          </div>
          </section>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-(--st-primary)">Lectura rápida</p>
              <h2 class="mt-2 text-3xl font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">Quién está marcando la diferencia</h2>
            </div>
            <p class="max-w-sm text-sm leading-6 text-white/48 sm:text-right">Ordenadas de mayor a menor según el indicador que define cada tabla.</p>
          </div>

          <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <section class="overflow-hidden border-t border-white/12">
              <div class="flex items-center justify-between px-0 py-5">
                <div>
                  <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-(--st-primary)">Aporte ofensivo</p>
                  <h3 class="mt-1 text-2xl font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">Goleadoras</h3>
                </div>
                <FireIcon class="size-7 text-(--st-primary)" />
              </div>
              <div class="divide-y divide-white/8 border-y border-white/8">
                <router-link
                  v-for="(jugadora, index) in goleadorasOrdenadas.slice(0, 5)"
                  :key="`top-gol-${jugadora.id}`"
                  :to="`/jugadoras/${jugadora.id}`"
                  class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/6 sm:px-6"
                >
                  <span class="w-6 text-lg font-black tabular-nums" :class="index === 0 ? 'text-(--st-accent)' : 'text-white/30'">{{ String(index + 1).padStart(2, '0') }}</span>
                  <span class="min-w-0 flex-1 truncate text-sm font-bold text-white sm:text-base">{{ jugadora.nombre }} {{ jugadora.apellido }}</span>
                  <span class="rounded-full bg-(--st-primary)/15 px-3 py-1 text-sm font-black tabular-nums text-(--st-primary)">{{ jugadora.goles }}</span>
                </router-link>
                <p v-if="goleadorasOrdenadas.length === 0" class="px-5 py-8 text-center text-sm text-white/50">Todavía no hay goles registrados.</p>
              </div>
            </section>

            <section class="overflow-hidden border-t border-white/12">
              <div class="flex items-center justify-between px-0 py-5">
                <div>
                  <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-(--st-primary)">Construcción de juego</p>
                  <h3 class="mt-1 text-2xl font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">Asistidoras</h3>
                </div>
                <SparklesIcon class="size-7 text-(--st-primary)" />
              </div>
              <div class="divide-y divide-white/8 border-y border-white/8">
                <router-link
                  v-for="(jugadora, index) in asistidorasOrdenadas.slice(0, 5)"
                  :key="`top-ast-${jugadora.id}`"
                  :to="`/jugadoras/${jugadora.id}`"
                  class="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/6 sm:px-6"
                >
                  <span class="w-6 text-lg font-black tabular-nums" :class="index === 0 ? 'text-(--st-accent)' : 'text-white/30'">{{ String(index + 1).padStart(2, '0') }}</span>
                  <span class="min-w-0 flex-1 truncate text-sm font-bold text-white sm:text-base">{{ jugadora.nombre }} {{ jugadora.apellido }}</span>
                  <span class="rounded-full bg-(--st-primary)/15 px-3 py-1 text-sm font-black tabular-nums text-(--st-primary)">{{ jugadora.asistencias }}</span>
                </router-link>
                <p v-if="asistidorasOrdenadas.length === 0" class="px-5 py-8 text-center text-sm text-white/50">Todavía no hay asistencias registradas.</p>
              </div>
            </section>
          </div>

          <section class="overflow-hidden border-t border-white/12">
            <div class="flex flex-col gap-3 border-b border-white/10 px-0 py-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-(--st-primary)">Plantel completo</p>
                <h3 class="mt-1 text-2xl font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">Detalle por jugadora</h3>
              </div>
              <span class="text-xs font-bold uppercase tracking-[0.14em] text-white/40">{{ estadisticasCompletas.length }} registros</span>
            </div>
            <div class="overflow-x-auto border-b border-white/8">
              <table class="w-full min-w-160">
                <thead>
                  <tr class="border-b border-white/8 bg-black/15 text-left">
                    <th class="px-5 py-4 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/40">#</th>
                    <th class="px-5 py-4 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/40">Jugadora</th>
                    <th class="px-5 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/40">Goles</th>
                    <th class="px-5 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/40">Asist.</th>
                    <th class="px-5 py-4 text-center text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/40">Partidos</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/8">
                  <tr v-for="(jugadora, index) in estadisticasCompletas" :key="jugadora.id" class="transition-colors hover:bg-white/5">
                    <td class="px-5 py-4 text-sm font-black tabular-nums text-white/30">{{ String(index + 1).padStart(2, '0') }}</td>
                    <td class="px-5 py-4">
                      <router-link :to="`/jugadoras/${jugadora.id}`" class="block min-w-40 text-sm font-bold text-white transition-colors hover:text-(--st-primary) sm:text-base">{{ jugadora.nombre }} {{ jugadora.apellido }}</router-link>
                      <span class="mt-1 block text-[0.63rem] font-black uppercase tracking-[0.12em] text-white/35">{{ jugadora.posicion || 'Plantel' }}</span>
                    </td>
                    <td class="px-5 py-4 text-center text-sm font-black tabular-nums text-white">{{ jugadora.goles || 0 }}</td>
                    <td class="px-5 py-4 text-center text-sm font-black tabular-nums text-white">{{ jugadora.asistencias || 0 }}</td>
                    <td class="px-5 py-4 text-center text-sm font-black tabular-nums text-(--st-primary)">{{ jugadora.partidos || 0 }}</td>
                  </tr>
                  <tr v-if="estadisticasCompletas.length === 0"><td colspan="5" class="px-5 py-10 text-center text-sm text-white/50">No hay jugadoras registradas en este equipo.</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="hidden">

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
                    <td class="px-5 py-4 text-sm font-semibold text-white sm:text-base">
                      <router-link :to="`/jugadoras/${jugadora.id}`" class="transition-colors hover:text-(--st-primary)">
                        {{ jugadora.nombre }} {{ jugadora.apellido }}
                      </router-link>
                    </td>
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
                    <td class="px-5 py-4 text-sm font-semibold text-white sm:text-base">
                      <router-link :to="`/jugadoras/${jugadora.id}`" class="transition-colors hover:text-(--st-primary)">
                        {{ jugadora.nombre }} {{ jugadora.apellido }}
                      </router-link>
                    </td>
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
                    <th class="px-5 py-4 text-center text-[0.72rem] font-black uppercase tracking-[0.16em] text-white/55">Partidos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(jugadora, index) in estadisticasCompletas"
                    :key="jugadora.id"
                    class="border-b border-white/8 transition-colors hover:bg-white/4"
                  >
                    <td class="px-5 py-4 text-sm font-black text-(--st-primary)">{{ index + 1 }}</td>
                    <td class="px-5 py-4 text-sm font-semibold text-white sm:text-base">
                      <router-link :to="`/jugadoras/${jugadora.id}`" class="transition-colors hover:text-(--st-primary)">
                        {{ jugadora.nombre }} {{ jugadora.apellido }}
                      </router-link>
                    </td>
                    <td class="px-5 py-4 text-center text-sm font-semibold text-white sm:text-base">{{ jugadora.goles || 0 }}</td>
                    <td class="px-5 py-4 text-center text-sm font-semibold text-white sm:text-base">{{ jugadora.asistencias || 0 }}</td>
                    <td class="px-5 py-4 text-center">
                      <span class="text-sm font-semibold tabular-nums text-white sm:text-base">
                        {{ jugadora.partidos || 0 }}
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
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { TrophyIcon, FireIcon, SparklesIcon, ChartBarIcon } from '@heroicons/vue/24/solid';
import { db } from '../firebase/config';
import { obtenerEstadisticasEquipo, obtenerResumenPorTipo } from '../firebase/estadisticas';

const isLoading = ref(false);
const equipoActivo = ref('ascenso');
const tipoEstadistica = ref('competicion');
const jugadoras = ref([]);
const mvpPorNombre = ref({});
const partidosPorNombre = ref({});
const partidosEquipo = ref(0);

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

const normalizarNombre = (jugadora) => `${jugadora?.nombre || ''} ${jugadora?.apellido || ''}`
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .trim()
  .split(/\s+/)
  .sort()
  .join(' ');

const normalizarNombreTexto = (nombre = '') => normalizarNombre({ nombre });

const normalizarEquipoTexto = (equipo = '') => equipo
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[-_\s]/g, '');

const perteneceAlEquipoActivo = (equipo = '') => {
  const equipoNormalizado = normalizarEquipoTexto(equipo);
  const equipoActivoNormalizado = normalizarEquipoTexto(equipoActivo.value);
  return equipoNormalizado === equipoActivoNormalizado || equipoNormalizado === 'ambos';
};

const esPartidoFinalizado = (data = {}) => data.estado === 'FINALIZADO' || data.fasePartido === 'FINALIZADO';

const jugadorasFiltradasPorTipo = computed(() => {
  return jugadoras.value.map((jugadora) => {
    const resumen = obtenerResumenPorTipo(jugadora, tipoEstadistica.value);
    return {
      ...jugadora,
      goles: resumen.goles || 0,
      asistencias: resumen.asistencias || 0,
      partidos: partidosPorNombre.value[normalizarNombre(jugadora)] || resumen.partidos || 0,
      mvp: mvpPorNombre.value[normalizarNombre(jugadora)] || 0
    };
  });
});

const esTipoSeleccionado = (tipo) => {
  const valor = (tipo || '').toString().trim().toLowerCase();
  return tipoEstadistica.value === 'amistosos'
    ? valor === 'amistoso' || valor === 'amistosos'
    : ['partido', 'competicion', 'competición', 'liga'].includes(valor);
};

const cargarMvp = async () => {
  const conteos = {};
  const apariciones = {};
  let totalPartidos = 0;

  try {
    const [entrenamientosSnap, partidosSnap] = await Promise.all([
      getDocs(collection(db, 'entrenamientos')),
      getDocs(collection(db, 'partidos'))
    ]);

    [...entrenamientosSnap.docs, ...partidosSnap.docs]
      .map((docSnap) => docSnap.data() || {})
      .filter((data) => esTipoSeleccionado(data.tipo) && perteneceAlEquipoActivo(data.equipo) && esPartidoFinalizado(data))
      .forEach((data) => {
        totalPartidos += 1;

        const mvp = data.mvp || data.mvpGanadora || {};
        const nombreMvp = typeof mvp === 'string'
          ? mvp
          : data.mvpGanadoraFinal || mvp.nombre || mvp.nombreCompleto || data.mvpNombre || '';
        const nombreMvpNormalizado = normalizarNombreTexto(nombreMvp);

        if (nombreMvpNormalizado) {
          conteos[nombreMvpNormalizado] = (conteos[nombreMvpNormalizado] || 0) + 1;
        }

        if (Array.isArray(data.jugadorasConvocadas)) {
          data.jugadorasConvocadas.forEach((jugadora) => {
            const nombreJugadora = normalizarNombreTexto(jugadora?.nombre || jugadora?.nombreCompleto || '');
            if (nombreJugadora) {
              apariciones[nombreJugadora] = (apariciones[nombreJugadora] || 0) + 1;
            }
          });
        }
      });

    mvpPorNombre.value = conteos;
    partidosPorNombre.value = apariciones;
    partidosEquipo.value = totalPartidos;
  } catch (err) {
    mvpPorNombre.value = {};
    partidosPorNombre.value = {};
    partidosEquipo.value = 0;
  }
};

const resumenEquipo = computed(() => {
  return jugadorasFiltradasPorTipo.value.reduce((totales, jugadora) => {
    totales.goles += Number(jugadora.goles || 0);
    totales.asistencias += Number(jugadora.asistencias || 0);
    totales.partidos = partidosEquipo.value;
    totales.mvp += Number(jugadora.mvp || 0);
    return totales;
  }, { goles: 0, asistencias: 0, partidos: 0, mvp: 0 });
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
      const participacionA = (a.goles || 0) + (a.asistencias || 0) + (a.mvp || 0);
      const participacionB = (b.goles || 0) + (b.asistencias || 0) + (b.mvp || 0);
      return participacionB - participacionA;
    });
});

// Cargar jugadoras por equipo
const cargarJugadoras = async () => {
  isLoading.value = true;
  try {
    jugadoras.value = await obtenerEstadisticasEquipo(equipoActivo.value);
    await cargarMvp();
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

watch(() => tipoEstadistica.value, () => {
  cargarMvp();
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
