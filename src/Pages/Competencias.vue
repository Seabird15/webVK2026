<template>
  <div class="min-h-screen bg-[#020807] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0" style="background: radial-gradient(circle at top, rgba(20,184,166,0.18), transparent 38%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06), transparent 22%), linear-gradient(180deg, rgba(4,18,16,0.94), rgba(2,8,7,1));"></div>
    <div class="absolute top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-primary/12 blur-3xl"></div>
    <div class="max-w-6xl mx-auto relative z-10">
      <!-- Header -->
      <div class="mb-10 space-y-6">
        <div class="rounded-4xl border border-primary/20 bg-white/4 backdrop-blur-md shadow-[0_30px_90px_rgba(0,0,0,0.35)] overflow-hidden">
          <div class="grid lg:grid-cols-[1.4fr_0.9fr] gap-0">
            <div class="p-6 sm:p-8 lg:p-10">
              <div class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] text-primary">
                Temporada 2026
              </div>
              <h1 class="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-white mt-5 leading-none" style="font-family: 'Gobold High', sans-serif;">COMPETENCIAS</h1>
              <p class="max-w-2xl text-white/72 text-sm sm:text-base lg:text-lg font-semibold mt-4 leading-relaxed">
                Nuevo semestre competitivo para Vikingas. Desde aquí puedes seguir las ligas activas, cargar resultados y mantener al día cada fecha.
              </p>

              <div class="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <button
                  type="button"
                  @click="abrirCompetencia('semestre')"
                  class="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-primary text-black px-5 py-3 font-black text-sm shadow-lg hover:bg-primary/90 transition cursor-pointer"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-black"></span>
                  Ver semestre activo
                </button>

                <router-link
                  to="/estadisticas"
                  class="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-white/12 bg-white/4 text-white px-5 py-3 font-black text-sm hover:bg-white/8 transition"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  Ver estadísticas por equipo
                </router-link>
              </div>

              <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] font-black text-white/45">Ligas activas</p>
                  <p class="text-3xl font-black text-white mt-2">2</p>
                  <p class="text-sm text-white/60 mt-1">Jueves Serie B Ascenso y Domingos Serie C</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] font-black text-white/45">Fechas cargadas</p>
                  <p class="text-3xl font-black text-white mt-2">{{ resumenSemestreGlobal.totalFechas }}</p>
                  <p class="text-sm text-white/60 mt-1">{{ resumenSemestreGlobal.fechasConResultado }} con resultado ingresado</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] font-black text-white/45">En foco</p>
                  <p class="text-xl font-black text-white mt-2">{{ ligaActiva?.descripcion || 'Semestre activo' }}</p>
                  <p class="text-sm text-white/60 mt-1">Edita rival, marcador y goleadoras desde el bloque principal</p>
                </div>
              </div>
            </div>

            <div class="border-t lg:border-t-0 lg:border-l border-white/10 bg-black/25 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
              <div>
                <p class="text-[11px] uppercase tracking-[0.2em] font-black text-primary">Semestre activo</p>
                <div class="mt-4 grid gap-3 sm:space-y-0">
                  <button
                    type="button"
                    @click="ligaSeleccionada = 'dobleve_jueves_serie_b_ascenso'; abrirCompetencia('semestre')"
                    class="w-full rounded-2xl border text-left px-4 py-4 transition cursor-pointer"
                    :class="ligaSeleccionada === 'dobleve_jueves_serie_b_ascenso' && competenciaExpandida === 'semestre' ? 'border-primary bg-primary/15 text-white' : 'border-white/10 bg-white/3 text-white/78 hover:bg-white/6'"
                  >
                    <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Jueves</p>
                    <p class="text-lg font-black mt-1">Liga Dobleve Serie B Ascenso</p>
                  </button>
                  <button
                    type="button"
                    @click="ligaSeleccionada = 'dobleve_domingos_serie_c'; abrirCompetencia('semestre')"
                    class="w-full rounded-2xl border text-left px-4 py-4 transition cursor-pointer"
                    :class="ligaSeleccionada === 'dobleve_domingos_serie_c' && competenciaExpandida === 'semestre' ? 'border-primary bg-primary/15 text-white' : 'border-white/10 bg-white/3 text-white/78 hover:bg-white/6'"
                  >
                    <p class="text-xs font-black uppercase tracking-[0.18em] text-primary">Domingos</p>
                    <p class="text-lg font-black mt-1">Liga Dobleve Serie C</p>
                  </button>
                </div>
              </div>

              <div class="rounded-2xl border border-primary/20 bg-primary/10 p-4 sm:p-5">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
                  <div>
                    <h2 class="text-white text-lg sm:text-xl font-400" style="font-family: 'Collegiate Black', sans-serif;">
                      ¿Vamos por un nuevo Torneo Interno?
                    </h2>
                    <p class="text-white/72 text-sm font-semibold mt-1">Ayúdanos a decidir si hacemos una segunda versión.</p>
                  </div>
                  <div class="flex flex-col items-start sm:items-end gap-2">
                    <button
                      @click="reaccionarConFuego"
                      :class="[
                        'inline-flex items-center gap-2 px-3 py-2 rounded-xl font-400 text-xs sm:text-sm transition-all duration-200 hover:scale-105',
                        dioFuegoFinal ? 'bg-green-600 text-white' : 'bg-white/10 text-white border border-primary/50 hover:bg-primary/20'
                      ]"
                      type="button"
                    >
                      <span class="text-base" :class="dioFuegoFinal ? 'animate-pulse' : ''">👍</span>
                      <span>{{ dioFuegoFinal ? '¡Me interesa!' : '¡Quiero jugar!' }}</span>
                      <span class="bg-black/20 px-2 py-0.5 rounded-full">{{ fuegitosFinal }}</span>
                    </button>
                    <p class="text-white/50 text-[11px]">Toca el pulgar para votar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          <button
            type="button"
            @click="abrirCompetencia('semestre')"
            class="min-w-65 md:min-w-0 rounded-3xl border p-4 text-left transition-all cursor-pointer"
            :class="competenciaExpandida === 'semestre' ? 'border-primary bg-linear-to-br from-primary/18 via-primary/10 to-white/6 shadow-[0_18px_45px_rgba(20,184,166,0.18)]' : 'border-white/10 bg-white/3 hover:bg-white/6'"
          >
            <p class="text-[11px] font-black uppercase tracking-[0.22em]" :class="competenciaExpandida === 'semestre' ? 'text-primary' : 'text-white/55'">Hoy compite Vikingas</p>
            <p class="text-white text-lg font-black mt-2">Semestre activo</p>
            <p class="text-sm mt-2 leading-relaxed" :class="competenciaExpandida === 'semestre' ? 'text-white/82' : 'text-white/60'">Resultados, rivales y goleadoras de las ligas que están en juego ahora.</p>
          </button>

          <button
            type="button"
            @click="abrirCompetencia('verano')"
            class="min-w-65 md:min-w-0 rounded-3xl border p-4 text-left transition-all cursor-pointer"
            :class="competenciaExpandida === 'verano' ? 'border-primary bg-linear-to-br from-primary/18 via-primary/10 to-white/6 shadow-[0_18px_45px_rgba(20,184,166,0.18)]' : 'border-white/10 bg-white/3 hover:bg-white/6'"
          >
            <p class="text-[11px] font-black uppercase tracking-[0.22em]" :class="competenciaExpandida === 'verano' ? 'text-primary' : 'text-white/55'">Logro destacado</p>
            <p class="text-white text-lg font-black mt-2">Summer Cup 2026</p>
            <p class="text-sm mt-2 leading-relaxed" :class="competenciaExpandida === 'verano' ? 'text-white/82' : 'text-white/60'">Campaña campeona de Vikingas Ascenso, ideal para revisar el recorrido completo.</p>
          </button>

          <button
            type="button"
            @click="abrirCompetencia('interno')"
            class="min-w-65 md:min-w-0 rounded-3xl border p-4 text-left transition-all cursor-pointer"
            :class="competenciaExpandida === 'interno' ? 'border-primary bg-linear-to-br from-primary/18 via-primary/10 to-white/6 shadow-[0_18px_45px_rgba(20,184,166,0.18)]' : 'border-white/10 bg-white/3 hover:bg-white/6'"
          >
            <p class="text-[11px] font-black uppercase tracking-[0.22em]" :class="competenciaExpandida === 'interno' ? 'text-primary' : 'text-white/55'">Comunidad Vikinga</p>
            <p class="text-white text-lg font-black mt-2">Campeonato interno</p>
            <p class="text-sm mt-2 leading-relaxed" :class="competenciaExpandida === 'interno' ? 'text-white/82' : 'text-white/60'">Equipos, ambiente y próximos pasos del torneo hecho para la propia comunidad.</p>
          </button>
        </div>
      </div>

      <!-- LIGAS SEMESTRE 2026 -->
      <section v-if="competenciaExpandida === 'semestre'" class="mt-8 mb-8 rounded-[30px] border border-primary/35 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] ring-1 ring-primary/10 overflow-hidden">
        <div class="border-b border-white/8 bg-linear-to-r from-primary-dark via-primary/90 to-[#0d2924] px-4 py-5 sm:px-8 sm:py-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <p class="text-black/70 text-xs font-black uppercase tracking-[0.22em]">Panel principal</p>
              <h2 class="text-2xl sm:text-4xl tracking-wide font-400 text-white mt-2" style="font-family: 'Collegiate Black', sans-serif;">Ligas semestre 2026</h2>
              <p class="text-black/75 text-sm sm:text-base mt-3 font-semibold">El foco está en la competencia actual: rivales, resultados y goleadoras en una sola vista limpia para seguir el ritmo del semestre.</p>
            </div>

            <div class="grid grid-cols-2 gap-3 w-full sm:w-auto sm:min-w-70">
              <div class="rounded-2xl bg-black/18 px-4 py-3 backdrop-blur-sm">
                <p class="text-[11px] uppercase font-black tracking-[0.2em] text-black/60">Fechas</p>
                <p class="text-2xl font-black text-white mt-1">{{ resumenSemestreGlobal.totalFechas }}</p>
              </div>
              <div class="rounded-2xl bg-black/18 px-4 py-3 backdrop-blur-sm">
                <p class="text-[11px] uppercase font-black tracking-[0.2em] text-black/60">Resultados</p>
                <p class="text-2xl font-black text-white mt-1">{{ resumenSemestreGlobal.fechasConResultado }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-8 space-y-6 bg-linear-to-b from-white/2 to-transparent">
          <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6 items-start">
            <div class="rounded-[26px] border border-primary/25 bg-linear-to-b from-primary/14 to-black/20 p-5">
              <div class="flex items-start justify-between gap-3 mb-3">
                <div>
                  <label class="block text-xs font-black uppercase tracking-[0.2em] text-primary">Selecciona una liga</label>
                  <p class="text-sm text-white/68 mt-2">Abre este menú para cambiar entre la liga de jueves y la de domingos.</p>
                </div>
                <div class="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                  Menú
                </div>
              </div>

              <div class="relative">
                <select
                  v-model="ligaSeleccionada"
                  class="w-full appearance-none rounded-2xl border border-primary/35 bg-black/85 text-white px-4 py-3 pr-12 font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.18)] focus:outline-hidden focus:border-primary"
                >
                  <option v-for="liga in opcionesLigasSemestre" :key="liga.id" :value="liga.id">
                    {{ liga.label }}
                  </option>
                </select>

                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              <p class="text-[12px] text-white/50 mt-2">Toca el campo para ver las opciones disponibles.</p>

              <div v-if="ligaActiva" class="mt-5 space-y-4">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-white font-black text-lg">{{ ligaActiva.nombre }}</p>
                  <p class="text-white/72 text-sm mt-1">{{ ligaActiva.descripcion }} • {{ ligaActiva.equipo }}</p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-2xl bg-black/25 border border-white/10 p-3">
                    <p class="text-[11px] uppercase font-black tracking-[0.18em] text-white/50">Jugadas</p>
                    <p class="text-2xl font-black text-white mt-1">{{ resumenLigaActiva.fechasConResultado }}</p>
                  </div>
                  <div class="rounded-2xl bg-black/25 border border-white/10 p-3">
                    <p class="text-[11px] uppercase font-black tracking-[0.18em] text-white/50">Pendientes</p>
                    <p class="text-2xl font-black text-white mt-1">{{ resumenLigaActiva.totalFechas - resumenLigaActiva.fechasConResultado }}</p>
                  </div>
                  <div class="rounded-2xl bg-black/25 border border-white/10 p-3">
                    <p class="text-[11px] uppercase font-black tracking-[0.18em] text-white/50">GF</p>
                    <p class="text-2xl font-black text-white mt-1">{{ resumenLigaActiva.golesVikingas }}</p>
                  </div>
                  <div class="rounded-2xl bg-black/25 border border-white/10 p-3">
                    <p class="text-[11px] uppercase font-black tracking-[0.18em] text-white/50">GC</p>
                    <p class="text-2xl font-black text-white mt-1">{{ resumenLigaActiva.golesRival }}</p>
                  </div>
                </div>

                <button
                  v-if="isAdmin"
                  @click="agregarFechaLiga(ligaSeleccionada)"
                  :disabled="guardandoLiga"
                  class="w-full rounded-2xl bg-primary text-black font-black px-4 py-3 hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer"
                >
                  {{ guardandoLiga ? 'Guardando...' : 'Agregar nueva fecha' }}
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div v-if="cargandoLigas" class="rounded-[26px] border border-gray-800 bg-white/5 p-8 text-center text-white/70 font-semibold">
                Cargando ligas del semestre...
              </div>

              <div v-else-if="!ligaActiva" class="rounded-[26px] border border-gray-800 bg-white/5 p-8 text-center text-white/70 font-semibold">
                No se pudo cargar la liga seleccionada.
              </div>

              <div
                v-else
                v-for="partido in ligaActiva.partidos"
                :key="partido.id"
                class="rounded-[26px] border border-white/10 bg-linear-to-br from-white/6 to-black/18 p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
              >
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <p class="text-primary text-xs font-black uppercase tracking-[0.18em]">Fecha {{ partido.fechaNumero }}</p>
                    <h3 class="text-white text-lg sm:text-2xl font-black mt-1 leading-tight">{{ obtenerTituloPartidoLiga(partido) }}</h3>
                    <p class="text-white/62 text-sm mt-1">{{ obtenerEstadoPartidoLiga(partido) }}</p>
                  </div>

                  <div v-if="isAdmin" class="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full md:w-auto">
                    <button
                      @click="guardarPartidoLiga(ligaSeleccionada, partido.id)"
                      :disabled="guardandoLiga"
                      class="w-full sm:w-auto rounded-2xl bg-primary text-black font-black px-4 py-2.5 hover:bg-primary/90 transition disabled:opacity-60 cursor-pointer"
                    >
                      {{ guardandoLiga ? 'Guardando...' : 'Guardar fecha' }}
                    </button>
                    <button
                      @click="solicitarEliminarFechaLiga(ligaSeleccionada, partido.id)"
                      :disabled="guardandoLiga"
                      class="w-full sm:w-auto rounded-2xl border border-red-400/40 bg-red-500/10 text-red-200 font-black px-4 py-2.5 hover:bg-red-500/18 transition disabled:opacity-60 cursor-pointer"
                    >
                      Borrar fecha
                    </button>
                  </div>
                </div>

                <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_220px] gap-4">
                  <div class="rounded-2xl border border-white/10 bg-black/28 p-4">
                    <label class="block text-xs font-black uppercase tracking-[0.18em] text-white/55 mb-2">Partido</label>
                    <div class="flex flex-col items-start gap-2 text-white font-black">
                      <span class="shrink-0 text-sm sm:text-base">Vikingas vs</span>
                      <input
                        v-if="isAdmin"
                        v-model="partido.rival"
                        type="text"
                        class="w-full rounded-xl border border-gray-600 bg-black px-3 py-2 text-white font-semibold focus:outline-hidden focus:border-primary"
                        placeholder="Rival"
                      />
                      <span v-else class="text-white/80">{{ partido.rival || 'Por definir' }}</span>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-black/28 p-4">
                    <label class="block text-xs font-black uppercase tracking-[0.18em] text-white/55 mb-2">Goles Vikingas</label>
                    <input
                      v-if="isAdmin"
                      v-model.number="partido.golesVikingas"
                      type="number"
                      min="0"
                      class="w-full rounded-xl border border-gray-600 bg-black px-3 py-2 text-white font-semibold focus:outline-hidden focus:border-primary"
                      placeholder="0"
                    />
                    <p v-else class="text-2xl sm:text-3xl font-black text-white">{{ mostrarMarcador(partido.golesVikingas) }}</p>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-black/28 p-4">
                    <label class="block text-xs font-black uppercase tracking-[0.18em] text-white/55 mb-2">Goles rival</label>
                    <input
                      v-if="isAdmin"
                      v-model.number="partido.golesRival"
                      type="number"
                      min="0"
                      class="w-full rounded-xl border border-gray-600 bg-black px-3 py-2 text-white font-semibold focus:outline-hidden focus:border-primary"
                      placeholder="0"
                    />
                    <p v-else class="text-2xl sm:text-3xl font-black text-white">{{ mostrarMarcador(partido.golesRival) }}</p>
                  </div>
                </div>

                <div class="mt-4 rounded-2xl border border-white/10 bg-black/18 p-4">
                  <label class="block text-xs font-black uppercase tracking-[0.18em] text-white/55 mb-2">Goleadoras Vikingas</label>

                  <input
                    v-if="isAdmin"
                    v-model="partido.goleadorasVikingasTexto"
                    type="text"
                    class="w-full rounded-xl border border-gray-600 bg-black px-3 py-2 text-white font-semibold focus:outline-hidden focus:border-primary"
                  />

                  <div v-else-if="obtenerGoleadorasPartido(partido).length > 0" class="flex flex-wrap gap-2">
                    <span
                      v-for="goleadora in obtenerGoleadorasPartido(partido)"
                      :key="`${partido.id}-${goleadora}`"
                      class="rounded-full bg-primary/18 border border-primary/30 px-3 py-1 text-sm font-bold text-white"
                    >
                      {{ goleadora }}
                    </span>
                  </div>

                  <p v-else class="text-sm text-white/60">Sin goleadoras registradas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LIGA DOBLEVE VERANO 2026 -->
      <section v-if="competenciaExpandida === 'verano'" class="mb-8 rounded-[30px] border border-white/10 bg-white/4 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div class="border-b border-white/8 bg-linear-to-r from-primary-dark via-[#163531] to-[#1d4a42] px-4 py-5 sm:px-8 sm:py-6">
          <div class="grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p class="text-primary text-xs font-black uppercase tracking-[0.22em]">Archivo campeón</p>
              <h2 class="text-2xl sm:text-4xl font-400 tracking-wide text-white mt-2" style="font-family: 'Collegiate Black', sans-serif;">LigaDobleve Summer Cup 2026</h2>
              <p class="text-white/78 text-sm sm:text-base font-semibold mt-3">Un torneo que mezcló resistencia, carácter y cierre fuerte. Aquí queda ordenado el camino completo hasta el título.</p>
            </div>
            <div class="grid grid-cols-2 gap-3 w-full">
              <div class="rounded-2xl bg-black/18 px-4 py-3">
                <p class="text-[11px] uppercase font-black tracking-[0.2em] text-white/50">Categoría</p>
                <p class="text-white font-black mt-1">Serie AB+</p>
              </div>
              <div class="rounded-2xl bg-black/18 px-4 py-3">
                <p class="text-[11px] uppercase font-black tracking-[0.2em] text-white/50">Resultado</p>
                <p class="text-white font-black mt-1">Campeonas</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-8 space-y-8">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="rounded-[26px] border border-white/10 bg-black/35 p-6">
              <h3 class="text-primary font-black text-lg mb-4 uppercase tracking-[0.14em]">Fase de grupos</h3>
              <div class="space-y-3">
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between bg-white/5 p-3 rounded-2xl">
                  <span class="text-white font-medium">Vikingas vs Vieja Escuela</span>
                  <span class="text-red-400 font-bold">1 - 5</span>
                </div>
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between bg-white/5 p-3 rounded-2xl">
                  <span class="text-white font-medium">Vikingas vs De Cero</span>
                  <span class="text-red-400 font-bold">3 - 4</span>
                </div>
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between bg-white/5 p-3 rounded-2xl">
                  <span class="text-white font-medium">Vikingas vs Panteras</span>
                  <span class="text-red-400 font-bold">2 - 4</span>
                </div>
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between bg-white/5 p-3 rounded-2xl">
                  <span class="text-white font-medium">Vikingas vs Florida</span>
                  <span class="text-red-400 font-bold">1 - 11</span>
                </div>
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between bg-white/5 p-3 rounded-2xl">
                  <span class="text-white font-medium">Vikingas vs Clever</span>
                  <span class="text-red-400 font-bold">3 - 5</span>
                </div>
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between bg-white/5 p-3 rounded-2xl">
                  <span class="text-white font-medium">Vikingas vs Firegol</span>
                  <span class="text-red-400 font-bold">1 - 4</span>
                </div>
                <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between bg-primary/20 border border-primary p-3 rounded-2xl">
                  <span class="text-white font-bold">Vikingas vs Leyendas</span>
                  <span class="text-primary font-bold">5 - 2</span>
                </div>
              </div>
            </div>

            <div class="rounded-[26px] border border-primary/25 bg-linear-to-br from-primary/10 to-black/30 p-6">
              <h3 class="text-primary font-black text-lg mb-4 uppercase tracking-[0.14em]">Playoffs y final</h3>
              <div class="space-y-3">
                <div class="bg-primary/18 border border-primary/30 p-4 rounded-2xl">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-primary text-xs font-bold uppercase tracking-[0.18em]">Semifinal</span>
                  </div>
                  <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span class="text-white font-bold">Vikingas vs Clever</span>
                    <span class="text-primary font-bold text-xl">7 - 2</span>
                  </div>
                </div>

                <div class="bg-primary/18 border border-primary/30 p-4 rounded-2xl">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-primary text-xs font-bold uppercase flex items-center gap-1 tracking-[0.18em]">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      Final
                    </span>
                  </div>
                  <div class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span class="text-white font-bold">Vikingas vs Firegol</span>
                    <span class="text-primary font-bold text-xl">4 - 2</span>
                  </div>
                </div>

                <div class="mt-6 rounded-[26px] bg-primary-dark p-6 text-center">
                  <p class="text-black text-2xl font-black mb-2">Campeonas</p>
                  <p class="text-black font-bold text-sm uppercase tracking-[0.18em]">Serie AB+ Liga de Verano</p>
                  <p class="text-black/70 text-xs mt-2">Vikingas Ascenso</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="rounded-[26px] border border-primary/30 bg-primary-dark p-6">
              <h3 class="text-2xl font-bold text-black mb-3" style="font-family: 'Collegiate Black', sans-serif;">Campeonas Serie AB+</h3>
              <p class="text-black/80 text-sm leading-relaxed">CD Vikingas, en categoría Vikingas Ascenso, logró sobreponerse a una fase de grupos difícil y cerró el torneo con una identidad competitiva mucho más fuerte en playoffs.</p>
              <a
                href="https://trotamundos.cl/index.php/ligadobleve-summer-cup/"
                target="_blank"
                class="inline-flex mt-4 bg-black hover:bg-black/80 text-primary px-4 py-2 rounded-xl font-bold transition text-sm"
              >
                Ver página oficial →
              </a>
            </div>

            <div class="rounded-[26px] border border-white/10 bg-black/35 p-6">
              <h3 class="text-white font-black text-lg mb-4 uppercase tracking-[0.14em]">Claves del torneo</h3>
              <div class="space-y-3 text-sm text-white/80">
                <div class="rounded-2xl bg-white/5 p-4">Campeonas de la Serie Oro AB+ en la Liga de Verano.</div>
                <div class="rounded-2xl bg-white/5 p-4">Semifinal dominante: triunfo 7-2 ante Clever.</div>
                <div class="rounded-2xl bg-white/5 p-4">Final sólida: victoria 4-2 frente a Firegol.</div>
                <div class="rounded-2xl bg-white/5 p-4">Remontada emocional y deportiva que marcó el tono del año.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CAMPEONATO INTERNO VIKINGAS 2026 -->
      <section v-if="competenciaExpandida === 'interno'" class="mb-8 rounded-[30px] border border-white/10 bg-white/4 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div class="border-b border-white/8 bg-linear-to-r from-[#0f2f2a] via-[#18423b] to-primary-dark px-4 py-5 sm:px-8 sm:py-6">
          <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p class="text-primary text-xs font-black uppercase tracking-[0.22em]">Vikingas por dentro</p>
              <h2 class="text-2xl sm:text-4xl tracking-wide font-400 text-white mt-2" style="font-family: 'Collegiate Black', sans-serif;">1er Campeonato Interno Vikingas</h2>
              <p class="text-white/78 text-sm sm:text-base font-semibold mt-3">Una competencia creada para convivir, jugar y seguir fortaleciendo la identidad del club. Acá se muestran equipos, energía y próximas decisiones.</p>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <div class="rounded-2xl bg-black/18 px-4 py-3">
                <p class="text-[11px] uppercase font-black tracking-[0.18em] text-white/50">Inicio</p>
                <p class="text-white font-black mt-1">7 Feb</p>
              </div>
              <div class="rounded-2xl bg-black/18 px-4 py-3">
                <p class="text-[11px] uppercase font-black tracking-[0.18em] text-white/50">Lugar</p>
                <p class="text-white font-black mt-1">La Florida</p>
              </div>
              <div class="rounded-2xl bg-black/18 px-4 py-3">
                <p class="text-[11px] uppercase font-black tracking-[0.18em] text-white/50">Equipos</p>
                <p class="text-white font-black mt-1">3</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-8">
          <div v-if="loadingCampeonato" class="text-center py-12">
            <div class="inline-block">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
            <p class="text-white/70 mt-4 font-medium">Cargando datos del campeonato...</p>
          </div>

          <div v-else>
            <div class="bg-primary/10 border border-primary/35 rounded-[26px] p-4 sm:p-6 mb-8">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                <div>
                  <p class="text-primary text-sm font-bold mb-1 uppercase tracking-[0.18em]">Inicio</p>
                  <p class="text-white font-bold">7 de Febrero 2026</p>
                  <p class="text-white/70 text-sm">19:00 hrs</p>
                </div>
                <div>
                  <p class="text-primary text-sm font-bold mb-1 uppercase tracking-[0.18em]">Lugar</p>
                  <p class="text-white font-bold">Tricolor La Florida</p>
                </div>
                <div>
                  <p class="text-primary text-sm font-bold mb-1 uppercase tracking-[0.18em]">Formato</p>
                  <p class="text-white font-bold">3 Equipos Mixtos</p>
                  <p class="text-white/70 text-sm">Escuela + Ascenso</p>
                </div>
              </div>
            </div>

            <div v-if="equipos.verserkers && equipos.internadas && equipos.siemprealpalo">
              <h3 class="text-primary font-black text-xl mb-6 text-center uppercase tracking-[0.18em]">Equipos participantes</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div class="bg-linear-to-br from-cyan-900/50 to-cyan-700/30 border border-cyan-300/70 rounded-[26px] p-6 hover:shadow-xl hover:scale-[1.02] transition-all">
                  <div class="flex flex-col items-center text-center">
                    <div class="w-20 h-20 bg-white rounded-full p-3 mb-4 shadow-lg">
                      <img src="../assets/versekersLogo.jpeg" alt="Las Versekers" class="w-full h-full object-contain" />
                    </div>
                    <h4 class="text-2xl font-400 text-white mb-2" style="font-family: 'Collegiate Black', sans-serif;">LAS VERSERKERS</h4>
                    <span class="text-sm font-bold text-cyan-200">Capitana: Barby</span>
                  </div>
                </div>

                <div class="bg-linear-to-br from-gray-900/50 to-gray-700/30 border border-gray-300/70 rounded-[26px] p-6 hover:shadow-xl hover:scale-[1.02] transition-all relative">
                  <div class="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">Campeonas</div>
                  <div class="flex flex-col items-center text-center">
                    <div class="w-20 h-20 bg-white rounded-full p-3 mb-4 shadow-lg">
                      <img src="../assets/internadasLogo.jpeg" alt="Inter Nadas" class="w-full h-full object-contain" />
                    </div>
                    <h4 class="text-2xl font-400 text-white mb-2" style="font-family: 'Collegiate Black', sans-serif;">INTER NADAS</h4>
                    <span class="text-sm font-bold text-gray-200">Capitana: Pau Motta</span>
                  </div>
                </div>

                <div class="bg-linear-to-br from-red-900/50 to-red-700/30 border border-red-300/70 rounded-[26px] p-6 hover:shadow-xl hover:scale-[1.02] transition-all">
                  <div class="flex flex-col items-center text-center">
                    <div class="w-20 h-20 bg-white rounded-full p-3 mb-4 shadow-lg">
                      <img src="../assets/siemprealpaloLogo.jpeg" alt="Siempre al Palo" class="w-full h-full object-contain" />
                    </div>
                    <h4 class="text-2xl font-400 text-white mb-2" style="font-family: 'Collegiate Black', sans-serif;">SIEMPRE AL PALO</h4>
                    <span class="text-sm font-bold text-red-200">Capitana: Dany Farias</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 bg-linear-to-br from-[#113a4a]/70 to-[#30213f]/70 border border-primary/20 rounded-[26px] p-5 sm:p-8 text-center">
              <h3 class="text-white text-2xl font-300 mb-2" style="font-family: 'Collegiate Black', sans-serif;">Próximamente 2da versión</h3>
              <p class="text-white/80 text-base mb-4">Estamos preparando la segunda edición del torneo interno con nuevas energías y más espacio para compartir fútbol.</p>
              <p class="text-primary font-bold text-sm uppercase tracking-[0.16em]">Mantente atenta para más detalles</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Modal de confirmación -->
    <ModalConfirmacion
      v-model="mostrarModal"
      :titulo="modalConfig.titulo"
      :mensaje="modalConfig.mensaje"
      :detalles="modalConfig.detalles"
      :tipo="modalConfig.tipo"
      :texto-confirmar="modalConfig.textoConfirmar"
      :cargando="modalCargando"
      @confirmar="modalConfig.accion"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import ModalConfirmacion from '../components/ModalConfirmacion.vue';
import { authUser, userRole } from '../firebase/auth';
import { jugadoraAuthUser } from '../firebase/jugadorasAuth';
import { 
  obtenerDatosCampeonato,
  escucharCampeonato,
  agregarGol as agregarGolFirebase,
  restarGol as restarGolFirebase,
  calcularTotalGoles,
  obtenerTablaGoleadoras,
  equiposCampeonato,
  isLoading as loadingCampeonato,
  obtenerPartidos,
  obtenerPartidosPorFecha,
  actualizarResultadoPartido,
  actualizarFichaPartido,
  actualizarEstadoPartido,
  obtenerTabla,
  escucharPartidos,
  escucharTabla,
  calcularTabla,
  inicializarFecha2,
  inicializarFecha3,
  inicializarFechaFinal
} from '../firebase/campeonatoInterno';

const logoEquipos = {
  'versekersLogo.jpeg': new URL('../assets/versekersLogo.jpeg', import.meta.url).href,
  'internadasLogo.jpeg': new URL('../assets/internadasLogo.jpeg', import.meta.url).href,
  'siemprealpaloLogo.jpeg': new URL('../assets/siemprealpaloLogo.jpeg', import.meta.url).href
};

const resolverLogoEquipo = (logo) => logoEquipos[logo] || logo || '';

const tabla = ref([]);
const loading = ref(true);
const error = ref(null);
const lastUpdate = ref(null);
const competenciaExpandida = ref('semestre'); // 'verano', 'interno' o 'semestre'

// Estados para partidos y tabla del campeonato interno
const partidos = ref([]);
const partidosPorFecha = ref({});
const tablaPosiciones = ref([]);
const loadingPartidos = ref(false);
const editandoResultado = ref(false);
const partidoEditando = ref(null);

// Control del modal de confirmación
const mostrarModal = ref(false);
const modalCargando = ref(false);
const modalConfig = ref({
  titulo: '',
  mensaje: '',
  detalles: null,
  tipo: 'warning',
  textoConfirmar: 'Confirmar',
  accion: null
});
const inicializandoFecha2 = ref(false);
const inicializandoFecha3 = ref(false);
const inicializandoFechaFinal = ref(false);

// Equipos del torneo interno (ahora vinculados a Firebase)
const equipos = computed(() => equiposCampeonato.value);

// Tabla de goleadoras general
const tablaGoleadoras = ref([]);
const mostrarTablaGoleadoras = ref(false);
const topGoleadoras = computed(() => tablaGoleadoras.value.slice(0, 3));

const isAdmin = computed(() => userRole.value === 'admin');
const mostrarPanelGoles = ref(false);
const guardandoGol = ref(false);
const fuegitosFinal = ref(0);
const dioFuegoFinal = ref(false);
const fueguitoLoading = ref(false);
const invitadaSesionId = ref(`guest_${Math.random().toString(36).slice(2, 12)}`);
const ligaSeleccionada = ref('dobleve_jueves_serie_b_ascenso');
const ligasSemestre = ref({});
const cargandoLigas = ref(false);
const guardandoLiga = ref(false);

const COMPETENCIAS_SEMESTRE_DOC = 'competenciasSemestre2026';

let unsubscribe = null;

const crearFechaLiga = (fechaNumero = 1, overrides = {}) => ({
  id: overrides.id || `fecha_${fechaNumero}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  fechaNumero,
  rival: '',
  golesVikingas: '',
  golesRival: '',
  goleadorasVikingas: [],
  goleadorasVikingasTexto: '',
  ...overrides
});

const normalizarListadoTexto = (valor = '') => {
  return valor
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const obtenerLigasSemestreBase = () => ({
  dobleve_jueves_serie_b_ascenso: {
    id: 'dobleve_jueves_serie_b_ascenso',
    nombre: 'Liga Dobleve Jueves',
    descripcion: 'Serie B Ascenso',
    equipo: 'Vikingas Ascenso',
    dias: 'Jueves',
    categoria: 'Serie B Ascenso',
    partidos: [crearFechaLiga(1)]
  },
  dobleve_domingos_serie_c: {
    id: 'dobleve_domingos_serie_c',
    nombre: 'Liga Dobleve Domingos',
    descripcion: 'Serie C',
    equipo: 'Vikingas Serie C',
    dias: 'Domingos',
    categoria: 'Serie C',
    partidos: [crearFechaLiga(1)]
  }
});

const normalizarMarcadorEditable = (valor) => {
  if (valor === '' || valor === null || valor === undefined) return '';
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 ? Math.round(numero) : '';
};

const normalizarLigasSemestre = (data = {}) => {
  const base = obtenerLigasSemestreBase();
  const ligasNormalizadas = {};

  Object.entries(base).forEach(([ligaId, ligaBase]) => {
    const ligaData = data?.[ligaId] || {};
    const partidosOrigen = Array.isArray(ligaData.partidos) && ligaData.partidos.length > 0
      ? ligaData.partidos
      : ligaBase.partidos;

    ligasNormalizadas[ligaId] = {
      ...ligaBase,
      ...ligaData,
      partidos: partidosOrigen.map((partido, index) =>
        crearFechaLiga(Number(partido?.fechaNumero) || index + 1, {
          ...partido,
          fechaNumero: Number(partido?.fechaNumero) || index + 1,
          rival: (partido?.rival || '').toString(),
          golesVikingas: normalizarMarcadorEditable(partido?.golesVikingas),
          golesRival: normalizarMarcadorEditable(partido?.golesRival),
          goleadorasVikingas: Array.isArray(partido?.goleadorasVikingas)
            ? partido.goleadorasVikingas.map((item) => (item || '').toString().trim()).filter(Boolean)
            : [],
          goleadorasVikingasTexto: Array.isArray(partido?.goleadorasVikingas)
            ? partido.goleadorasVikingas.map((item) => (item || '').toString().trim()).filter(Boolean).join(', ')
            : ''
        })
      )
    };
  });

  return ligasNormalizadas;
};

const opcionesLigasSemestre = computed(() => {
  return Object.values(ligasSemestre.value).map((liga) => ({
    id: liga.id,
    label: `${liga.nombre} · ${liga.descripcion}`
  }));
});

const ligaActiva = computed(() => ligasSemestre.value[ligaSeleccionada.value] || null);

const resumenLigaActiva = computed(() => {
  const liga = ligaActiva.value;
  const partidosLiga = liga?.partidos || [];
  return {
    totalFechas: partidosLiga.length,
    fechasConResultado: partidosLiga.filter((partido) => partido.golesVikingas !== '' && partido.golesRival !== '').length,
    golesVikingas: partidosLiga.reduce((acc, partido) => acc + (Number(partido.golesVikingas) || 0), 0),
    golesRival: partidosLiga.reduce((acc, partido) => acc + (Number(partido.golesRival) || 0), 0)
  };
});

const resumenSemestreGlobal = computed(() => {
  const ligas = Object.values(ligasSemestre.value);
  const partidos = ligas.flatMap((liga) => liga?.partidos || []);

  return {
    totalFechas: partidos.length,
    fechasConResultado: partidos.filter((partido) => partido.golesVikingas !== '' && partido.golesRival !== '').length
  };
});

const abrirCompetencia = (competenciaId) => {
  competenciaExpandida.value = competenciaId;
};

const obtenerActorFuego = () => authUser.value?.uid || jugadoraAuthUser.value?.uid || invitadaSesionId.value;

const obtenerRefLigasSemestre = () => doc(db, 'configuracion', COMPETENCIAS_SEMESTRE_DOC);

const cargarLigasSemestre = async () => {
  cargandoLigas.value = true;
  try {
    const refDoc = obtenerRefLigasSemestre();
    const snap = await getDoc(refDoc);
    const ligas = normalizarLigasSemestre(snap.data()?.ligas || {});
    ligasSemestre.value = ligas;

    if (!snap.exists()) {
      await setDoc(refDoc, { ligas, updatedAt: new Date() }, { merge: true });
    }
  } catch (err) {
    console.error('Error cargando ligas del semestre:', err);
    ligasSemestre.value = normalizarLigasSemestre();
  } finally {
    cargandoLigas.value = false;
  }
};

const guardarLigasSemestre = async () => {
  guardandoLiga.value = true;
  try {
    const ligasNormalizadas = normalizarLigasSemestre(ligasSemestre.value);
    ligasSemestre.value = ligasNormalizadas;
    await setDoc(obtenerRefLigasSemestre(), {
      ligas: ligasNormalizadas,
      updatedAt: new Date()
    }, { merge: true });
  } finally {
    guardandoLiga.value = false;
  }
};

const agregarFechaLiga = async (ligaId) => {
  const liga = ligasSemestre.value[ligaId];
  if (!liga || guardandoLiga.value) return;

  const siguienteFecha = (liga.partidos?.length || 0) + 1;
  liga.partidos.push(crearFechaLiga(siguienteFecha));
  await guardarLigasSemestre();
};

const eliminarFechaLiga = async (ligaId, partidoId) => {
  const liga = ligasSemestre.value[ligaId];
  if (!liga || guardandoLiga.value) return;

  liga.partidos = (liga.partidos || [])
    .filter((partido) => partido.id !== partidoId)
    .map((partido, index) => ({
      ...partido,
      fechaNumero: index + 1
    }));

  await guardarLigasSemestre();
};

const solicitarEliminarFechaLiga = (ligaId, partidoId) => {
  const liga = ligasSemestre.value[ligaId];
  const partido = liga?.partidos?.find((item) => item.id === partidoId);
  if (!liga || !partido || guardandoLiga.value) return;

  modalConfig.value = {
    titulo: `¿Borrar Fecha ${partido.fechaNumero}?`,
    mensaje: `Se eliminará esta fecha de ${liga.nombre}.`,
    detalles: 'La numeración de las fechas restantes se ajustará automáticamente.',
    tipo: 'warning',
    textoConfirmar: 'Borrar fecha',
    accion: async () => {
      try {
        modalCargando.value = true;
        await eliminarFechaLiga(ligaId, partidoId);
        mostrarModal.value = false;
      } catch (err) {
        console.error('Error eliminando fecha de la liga:', err);
        alert('No se pudo borrar la fecha. Intenta nuevamente.');
      } finally {
        modalCargando.value = false;
      }
    }
  };

  mostrarModal.value = true;
};

const guardarPartidoLiga = async (ligaId, partidoId) => {
  const liga = ligasSemestre.value[ligaId];
  const partido = liga?.partidos?.find((item) => item.id === partidoId);
  if (!partido || guardandoLiga.value) return;

  partido.rival = (partido.rival || '').toString().trim();
  partido.golesVikingas = normalizarMarcadorEditable(partido.golesVikingas);
  partido.golesRival = normalizarMarcadorEditable(partido.golesRival);
  partido.goleadorasVikingas = normalizarListadoTexto((partido.goleadorasVikingasTexto || '').toString());
  partido.goleadorasVikingasTexto = partido.goleadorasVikingas.join(', ');
  await guardarLigasSemestre();
};

const mostrarMarcador = (valor) => {
  return valor === '' || valor === null || valor === undefined ? '-' : valor;
};

const obtenerTituloPartidoLiga = (partido) => {
  const rival = (partido?.rival || '').toString().trim();
  return `Vikingas vs ${rival || 'Por definir'}`;
};

const obtenerEstadoPartidoLiga = (partido) => {
  const tieneResultado = partido?.golesVikingas !== '' && partido?.golesRival !== '';
  return tieneResultado
    ? `Resultado cargado: ${mostrarMarcador(partido.golesVikingas)} - ${mostrarMarcador(partido.golesRival)}`
    : 'Resultado pendiente';
};

const obtenerGoleadorasPartido = (partido) => {
  if (Array.isArray(partido?.goleadorasVikingas) && partido.goleadorasVikingas.length > 0) {
    return partido.goleadorasVikingas;
  }

  return normalizarListadoTexto((partido?.goleadorasVikingasTexto || '').toString());
};

const cargarFueguitosFinal = async () => {
  try {
    const docRef = doc(db, 'configuracion', 'finalFueguitos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      fuegitosFinal.value = Number(docSnap.data()?.count) || 0;
    } else {
      await setDoc(docRef, { count: 0, updatedAt: new Date() });
      fuegitosFinal.value = 0;
    }

    const actorId = obtenerActorFuego();
    const reaccionRef = doc(db, 'configuracion', 'finalFueguitos', 'reacciones', actorId);
    const reaccionSnap = await getDoc(reaccionRef);
    dioFuegoFinal.value = reaccionSnap.exists() && reaccionSnap.data()?.activo === true;
  } catch (err) {
    console.error('Error cargando fueguitos de la final:', err);
  }
};

const reaccionarConFuego = async () => {
  if (fueguitoLoading.value) return;

  fueguitoLoading.value = true;
  if (dioFuegoFinal.value) {
    try {
      const actorId = obtenerActorFuego();
      const contadorRef = doc(db, 'configuracion', 'finalFueguitos');
      const reaccionRef = doc(db, 'configuracion', 'finalFueguitos', 'reacciones', actorId);

      await updateDoc(contadorRef, { count: increment(-1), updatedAt: new Date() });
      await setDoc(reaccionRef, { activo: false, updatedAt: new Date() }, { merge: true });

      fuegitosFinal.value = Math.max(0, fuegitosFinal.value - 1);
      dioFuegoFinal.value = false;
    } catch (err) {
      console.error('Error quitando fueguito:', err);
    }
  } else {
    try {
      const actorId = obtenerActorFuego();
      const contadorRef = doc(db, 'configuracion', 'finalFueguitos');
      const reaccionRef = doc(db, 'configuracion', 'finalFueguitos', 'reacciones', actorId);

      await updateDoc(contadorRef, { count: increment(1), updatedAt: new Date() });
      await setDoc(reaccionRef, { activo: true, updatedAt: new Date() }, { merge: true });

      fuegitosFinal.value += 1;
      dioFuegoFinal.value = true;
    } catch (err) {
      console.error('Error agregando fueguito:', err);
    }
  }

  fueguitoLoading.value = false;
};

const agregarGol = async (equipoKey, jugadoraIndex) => {
  if (guardandoGol.value) return;
  
  guardandoGol.value = true;
  try {
    await agregarGolFirebase(equipoKey, jugadoraIndex);
    // Actualizar tabla de goleadoras
    await cargarTablaGoleadoras();
  } catch (err) {
    console.error('Error agregando gol:', err);
    alert('Error al agregar gol. Por favor intenta nuevamente.');
  } finally {
    guardandoGol.value = false;
  }
};

const restarGol = async (equipoKey, jugadoraIndex) => {
  if (guardandoGol.value) return;
  if (!equipos.value[equipoKey]?.jugadoras?.[jugadoraIndex] || equipos.value[equipoKey]?.jugadoras?.[jugadoraIndex]?.goles === 0) {
    return;
  }
  
  guardandoGol.value = true;
  try {
    await restarGolFirebase(equipoKey, jugadoraIndex);
    // Actualizar tabla de goleadoras
    await cargarTablaGoleadoras();
  } catch (err) {
    console.error('Error restando gol:', err);
    alert('Error al restar gol. Por favor intenta nuevamente.');
  } finally {
    guardandoGol.value = false;
  }
};

const totalGoles = (equipoKey) => {
  return calcularTotalGoles(equipoKey);
};

const cargarTablaGoleadoras = async () => {
  try {
    tablaGoleadoras.value = await obtenerTablaGoleadoras();
  } catch (err) {
    console.error('Error cargando tabla de goleadoras:', err);
  }
};

const fetchTabla = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // En desarrollo, usar localhost
    // En producción, usar el mismo dominio que la app
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDev ? 'http://localhost:3001' : window.location.origin;
    
    
    const response = await fetch(`${apiUrl}/api/competencias`);
    const data = await response.json();

    if (data.success) {
      tabla.value = data.data;
      lastUpdate.value = data.timestamp;
    } else {
      error.value = data.message || 'Error al obtener los datos de la tabla';
    }
  } catch (err) {
    // // console.error('Error:', err);
    error.value = 'No se pudo conectar al servidor. Por favor intenta más tarde.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatLastUpdate = () => {
  if (!equipos.value || !equipos.value.lastUpdated) return 'No disponible';
  const date = new Date(equipos.value.lastUpdated);
  return date.toLocaleString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * ===================================
 * FUNCIONES PARA GESTIÓN DE PARTIDOS
 * ===================================
 */

const cargarPartidos = async () => {
  loadingPartidos.value = true;
  try {
    partidos.value = await obtenerPartidos();
    partidosPorFecha.value = await obtenerPartidosPorFecha();
  } catch (err) {
    console.error('Error cargando partidos:', err);
  } finally {
    loadingPartidos.value = false;
  }
};

const cargarTablaPosiciones = async () => {
  try {
    tablaPosiciones.value = await obtenerTabla();
  } catch (err) {
    console.error('Error cargando tabla:', err);
  }
};

const iniciarFecha2 = () => {
  if (inicializandoFecha2.value) return;
  
  modalConfig.value = {
    titulo: '¿Inicializar Fecha 2?',
    mensaje: 'Se agregarán los 3 partidos de la segunda fecha del campeonato.',
    detalles: 'Esta acción creará nuevos partidos en el sistema.',
    tipo: 'warning',
    textoConfirmar: 'Inicializar',
    accion: async () => {
      try {
        modalCargando.value = true;
        inicializandoFecha2.value = true;
        const resultado = await inicializarFecha2();
        if (resultado.success) {
          alert('Fecha 2 inicializada correctamente');
          await cargarPartidos();
          mostrarModal.value = false;
        } else {
          alert(resultado.message);
        }
      } catch (err) {
        console.error('Error inicializando Fecha 2:', err);
        alert('Error al inicializar Fecha 2. Por favor intenta nuevamente.');
      } finally {
        inicializandoFecha2.value = false;
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

const iniciarFecha3 = () => {
  if (inicializandoFecha3.value) return;

  modalConfig.value = {
    titulo: '¿Inicializar Fecha 3?',
    mensaje: 'Se agregarán los 3 partidos de la tercera fecha del campeonato (hoy).',
    detalles: 'Esta acción creará nuevos partidos en el sistema.',
    tipo: 'warning',
    textoConfirmar: 'Inicializar',
    accion: async () => {
      try {
        modalCargando.value = true;
        inicializandoFecha3.value = true;
        const resultado = await inicializarFecha3();
        if (resultado.success) {
          alert('Fecha 3 inicializada correctamente');
          await cargarPartidos();
          mostrarModal.value = false;
        } else {
          alert(resultado.message);
        }
      } catch (err) {
        console.error('Error inicializando Fecha 3:', err);
        alert('Error al inicializar Fecha 3. Por favor intenta nuevamente.');
      } finally {
        inicializandoFecha3.value = false;
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

const iniciarFechaFinal = () => {
  if (inicializandoFechaFinal.value) return;

  modalConfig.value = {
    titulo: '¿Inicializar Fecha Final?',
    mensaje: 'Se agregará el partido final de hoy: Verserkers vs Inter Nadas a las 20:00.',
    detalles: 'Esta acción creará el partido final en el sistema.',
    tipo: 'warning',
    textoConfirmar: 'Inicializar final',
    accion: async () => {
      try {
        modalCargando.value = true;
        inicializandoFechaFinal.value = true;
        const resultado = await inicializarFechaFinal();
        if (resultado.success) {
          alert('Fecha Final inicializada correctamente');
          await cargarPartidos();
          mostrarModal.value = false;
        } else {
          alert(resultado.message);
        }
      } catch (err) {
        console.error('Error inicializando Fecha Final:', err);
        alert('Error al inicializar Fecha Final. Por favor intenta nuevamente.');
      } finally {
        inicializandoFechaFinal.value = false;
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

const cambiarEstadoPartido = async (partidoId, nuevoEstado) => {
  try {
    await actualizarEstadoPartido(partidoId, nuevoEstado);
    await cargarPartidos();
    await cargarTablaPosiciones();
  } catch (err) {
    console.error('Error cambiando estado:', err);
    alert('Error al cambiar estado del partido.');
  }
};

const obtenerEstadoBadge = (partido) => {
  const estado = partido?.estado;
  if (estado === 'FINALIZADO') {
    if (partido?.empate) {
      return { text: '✓ FINALIZADO (PENALES)', class: 'bg-yellow-500/20 text-yellow-300 border border-yellow-400' };
    }
    return { text: '✓ FINALIZADO', class: 'bg-green-500/20 text-green-400 border border-green-400' };
  } else if (estado === 'EN_CURSO') {
    return { text: '⚽ EN CURSO', class: 'bg-yellow-500/20 text-yellow-400 border border-yellow-400 animate-pulse' };
  } else {
    return { text: '⏱ PRÓXIMAMENTE', class: 'bg-blue-500/20 text-blue-400 border border-blue-400' };
  }
};

const obtenerTituloFecha = (numeroFecha) => {
  if (numeroFecha == 1) {
    return 'FECHA 1 - SÁBADO 7 DE FEBRERO';
  } else if (numeroFecha == 2) {
    return 'FECHA 2 - SÁBADO 14 DE FEBRERO';
  } else if (numeroFecha == 3) {
    return 'FECHA 3 - SÁBADO 21 DE FEBRERO';
  } else if (numeroFecha == 4) {
    return ' FINAL - 28 MARZO 20:00';
  }
  return `FECHA ${numeroFecha}`;
};

const obtenerEstadoFecha = (partidos) => {
  if (partidos.every(p => p.estado === 'FINALIZADO')) {
    return { text: 'FECHA COMPLETADA', class: 'bg-green-500/20 text-green-400 border border-green-400' };
  } else if (partidos.some(p => p.estado === 'EN_CURSO')) {
    return { text: 'EN CURSO', class: 'bg-yellow-500/20 text-yellow-400 border border-yellow-400 animate-pulse' };
  } else {
    return { text: 'PRÓXIMAMENTE', class: 'bg-blue-500/20 text-blue-400 border border-blue-400' };
  }
};

const fechasOrdenadas = computed(() => {
  return Object.keys(partidosPorFecha.value).map(Number).sort((a, b) => a - b);
});

const resumenJornadas = computed(() => {
  return fechasOrdenadas.value.map((numeroFecha) => {
    const partidosFecha = partidosPorFecha.value[numeroFecha] || [];
    const finalizada = partidosFecha.length > 0 && partidosFecha.every((partido) => partido.estado === 'FINALIZADO');
    const enCurso = partidosFecha.some((partido) => partido.estado === 'EN_CURSO');

    return {
      numeroFecha,
      estado: finalizada ? 'Completada' : enCurso ? 'En curso' : 'Próximamente',
      finalizada,
      enCurso
    };
  });
});

const resumenInterno = computed(() => {
  const totalJornadas = fechasOrdenadas.value.length;
  const jornadasFinalizadas = resumenJornadas.value.filter((jornada) => jornada.finalizada).length;
  const totalPartidos = Object.values(partidosPorFecha.value).reduce((acumulado, lista) => acumulado + lista.length, 0);
  const partidosFinalizados = Object.values(partidosPorFecha.value).reduce(
    (acumulado, lista) => acumulado + lista.filter((partido) => partido.estado === 'FINALIZADO').length,
    0
  );

  return {
    totalJornadas,
    jornadasFinalizadas,
    totalPartidos,
    partidosFinalizados
  };
});

const campeonasInterno = computed(() => {
  const lider = tablaPosiciones.value?.[0];
  if (!lider) return null;

  const datosEquipo = obtenerDatosEquipo(lider.key);
  return {
    nombre: lider.nombre || datosEquipo.nombre || 'Por definir',
    logo: lider.logo || datosEquipo.logo || '',
    pts: lider.pts ?? 0,
    dg: lider.dg ?? 0
  };
});

const tieneFecha3 = computed(() => fechasOrdenadas.value.includes(3));
const tieneFechaFinal = computed(() => fechasOrdenadas.value.includes(4));

const obtenerDatosEquipo = (equipoKey) => {
  const equiposData = {
    verserkers: {
      nombre: 'Las Verserkers',
      logo: 'versekersLogo.jpeg',
      color: 'cyan'
    },
    internadas: {
      nombre: 'Inter Nadas',
      logo: 'internadasLogo.jpeg',
      color: 'gray'
    },
    siemprealpalo: {
      nombre: 'Siempre al Palo',
      logo: 'siemprealpaloLogo.jpeg',
      color: 'red'
    }
  };
  return equiposData[equipoKey] || {};
};

const editarResultado = (partido) => {
  const empateEdit = partido.golesLocal === partido.golesVisita && (partido.empate === true || (partido.penalesLocal || 0) !== (partido.penalesVisita || 0));
  let ganadorPenalesEdit = partido.ganadorPenales || null;
  const fichaActual = partido?.ficha || {};

  if (empateEdit && !ganadorPenalesEdit && (partido.penalesLocal || 0) !== (partido.penalesVisita || 0)) {
    ganadorPenalesEdit = (partido.penalesLocal || 0) > (partido.penalesVisita || 0)
      ? partido.equipoLocal
      : partido.equipoVisita;
  }

  partidoEditando.value = {
    ...partido,
    golesLocalEdit: partido.golesLocal,
    golesVisitaEdit: partido.golesVisita,
    empateEdit,
    penalesLocalEdit: partido.penalesLocal || 0,
    penalesVisitaEdit: partido.penalesVisita || 0,
    ganadorPenalesEdit,
    lugarEdit: fichaActual.lugar || 'Tricolor La Florida',
    arbitraEdit: fichaActual.arbitra || '',
    figuraEdit: fichaActual.figura || '',
    resumenEdit: fichaActual.resumen || '',
    goleadorasLocalEditText: Array.isArray(fichaActual.goleadorasLocal) ? fichaActual.goleadorasLocal.join(', ') : '',
    goleadorasVisitaEditText: Array.isArray(fichaActual.goleadorasVisita) ? fichaActual.goleadorasVisita.join(', ') : ''
  };
};

const cancelarEdicion = () => {
  partidoEditando.value = null;
};

const guardarResultado = async (partidoId) => {
  if (!partidoEditando.value || editandoResultado.value) return;

  if (partidoEditando.value.empateEdit) {
    if (partidoEditando.value.golesLocalEdit !== partidoEditando.value.golesVisitaEdit) {
      alert('Para definir por penales, el marcador del partido debe estar empatado.');
      return;
    }

    if (partidoEditando.value.penalesLocalEdit === partidoEditando.value.penalesVisitaEdit) {
      alert('El marcador de penales no puede terminar empatado.');
      return;
    }

    if (!partidoEditando.value.ganadorPenalesEdit) {
      alert('Debes seleccionar quién ganó en penales.');
      return;
    }
  }
  
  editandoResultado.value = true;
  try {
    await actualizarResultadoPartido(
      partidoId,
      partidoEditando.value.golesLocalEdit,
      partidoEditando.value.golesVisitaEdit,
      {
        empate: partidoEditando.value.empateEdit,
        penalesLocal: partidoEditando.value.penalesLocalEdit,
        penalesVisita: partidoEditando.value.penalesVisitaEdit,
        ganadorPenales: partidoEditando.value.empateEdit ? partidoEditando.value.ganadorPenalesEdit : null
      }
    );

    const parsearListadoGoleadoras = (texto = '') =>
      texto
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    await actualizarFichaPartido(partidoId, {
      lugar: partidoEditando.value.lugarEdit,
      arbitra: partidoEditando.value.arbitraEdit,
      figura: partidoEditando.value.figuraEdit,
      resumen: partidoEditando.value.resumenEdit,
      goleadorasLocal: parsearListadoGoleadoras(partidoEditando.value.goleadorasLocalEditText),
      goleadorasVisita: parsearListadoGoleadoras(partidoEditando.value.goleadorasVisitaEditText)
    });

    partidoEditando.value = null;
    await cargarPartidos();
    await cargarTablaPosiciones();
  } catch (err) {
    console.error('Error guardando resultado:', err);
    alert('Error al guardar el resultado. Por favor intenta nuevamente.');
  } finally {
    editandoResultado.value = false;
  }
};

const incrementarGol = (tipo) => {
  if (!partidoEditando.value) return;
  if (tipo === 'local') {
    partidoEditando.value.golesLocalEdit++;
  } else {
    partidoEditando.value.golesVisitaEdit++;
  }
};

const decrementarGol = (tipo) => {
  if (!partidoEditando.value) return;
  if (tipo === 'local' && partidoEditando.value.golesLocalEdit > 0) {
    partidoEditando.value.golesLocalEdit--;
  } else if (tipo === 'visita' && partidoEditando.value.golesVisitaEdit > 0) {
    partidoEditando.value.golesVisitaEdit--;
  }
};

const incrementarPenal = (tipo) => {
  if (!partidoEditando.value) return;
  if (tipo === 'local') {
    partidoEditando.value.penalesLocalEdit++;
  } else {
    partidoEditando.value.penalesVisitaEdit++;
  }
};

const decrementarPenal = (tipo) => {
  if (!partidoEditando.value) return;
  if (tipo === 'local' && partidoEditando.value.penalesLocalEdit > 0) {
    partidoEditando.value.penalesLocalEdit--;
  } else if (tipo === 'visita' && partidoEditando.value.penalesVisitaEdit > 0) {
    partidoEditando.value.penalesVisitaEdit--;
  }
};

const seleccionarGanadorPenales = (equipoKey) => {
  if (!partidoEditando.value) return;
  partidoEditando.value.ganadorPenalesEdit = equipoKey;
};

const obtenerIconoMedalla = (posicion) => {
  if (posicion === 0) return '🥇';
  if (posicion === 1) return '🥈';
  if (posicion === 2) return '🥉';
  return posicion + 1;
};

const obtenerColorBorde = (equipoData) => {
  if (equipoData.color === 'cyan') return 'border-l-cyan-400';
  if (equipoData.color === 'gray') return 'border-l-gray-300';
  if (equipoData.color === 'red') return 'border-l-red-400';
  return 'border-l-yellow-400';
};

const obtenerColorTexto = (equipoData) => {
  if (equipoData.color === 'cyan') return 'text-cyan-400';
  if (equipoData.color === 'gray') return 'text-gray-300';
  if (equipoData.color === 'red') return 'text-red-400';
  return 'text-yellow-400';
};

onMounted(async () => {
  await cargarFueguitosFinal();
  await cargarLigasSemestre();

  fetchTabla();
  
  // Cargar datos del campeonato desde Firebase
  try {
    await obtenerDatosCampeonato();
    await cargarTablaGoleadoras();
    await cargarPartidos();
    await cargarTablaPosiciones();
    
    // Escuchar cambios en tiempo real
    unsubscribe = escucharCampeonato(async () => {
      await cargarTablaGoleadoras();
    });
    
    // Escuchar cambios en partidos en tiempo real
    const unsubscribePartidos = escucharPartidos(async (nuevosPartidos) => {
      partidos.value = nuevosPartidos;
      // Reagrupar por numeroFecha
      const porFecha = {};
      nuevosPartidos.forEach(p => {
        const numeroFecha = p.numeroFecha || 1;
        if (!porFecha[numeroFecha]) porFecha[numeroFecha] = [];
        porFecha[numeroFecha].push(p);
      });
      partidosPorFecha.value = porFecha;
    });
    
    // Escuchar cambios en tabla en tiempo real
    const unsubscribeTabla = escucharTabla(async (nuevaTabla) => {
      tablaPosiciones.value = nuevaTabla;
    });
    
    // Guardar funciones de desuscripción para limpiar después
    if (!unsubscribe) {
      unsubscribe = () => {
        unsubscribePartidos();
        unsubscribeTabla();
      };
    } else {
      const oldUnsubscribe = unsubscribe;
      unsubscribe = () => {
        oldUnsubscribe();
        unsubscribePartidos();
        unsubscribeTabla();
      };
    }
  } catch (err) {
    console.error('Error cargando datos del campeonato:', err);
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes campeonas-suave {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.92;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-campeonas-suave {
  animation: campeonas-suave 3.2s ease-in-out infinite;
}
</style>
