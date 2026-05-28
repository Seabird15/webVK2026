<template>
  <div class="min-h-screen bg-black">
    <!-- Header with Vikingas Identity -->
    <header class="relative overflow-hidden border-b border-primary/20 bg-linear-to-b from-[#0b1718] via-[#071112] to-black pt-4 pb-6 text-white z-40 sm:pt-5 sm:pb-8">
      <!-- Background decorative elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-start justify-between gap-4 sm:gap-6 sm:flex-row sm:items-center">
          <!-- Title Section -->
          <div class="flex-1 min-w-0">
            <p class="text-[0.7rem] font-black uppercase tracking-[0.3em] text-primary/80 sm:text-[0.75rem]">
              Zona Jugadoras
            </p>
            <h1 class="mt-2 text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl" style="font-family: 'Gobold High', system-ui, sans-serif;">
              Entrenamientos
            </h1>
            <p v-if="equipoSeleccionado" class="mt-2 text-sm font-semibold text-white/70 sm:text-base">
              <span class="inline-block px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40">
                {{ equipoSeleccionado === 'ascenso' ? '🏆 Equipo Ascenso' : equipoSeleccionado === 'escuela' ? '📚 Equipo Escuela' : equipoSeleccionado === 'serieC' ? '⚽ Serie C' : '📅 Eventos' }}
              </span>
            </p>
          </div>

          <!-- Action Button -->
          <button
            @click="handleLogout"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/90 hover:bg-red-600 px-5 py-3 font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>

    <div v-if="bannerMensualidad.activo" class="mx-auto max-w-6xl px-4 mt-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-600/80 via-rose-500/80 to-red-600/80 p-4 sm:p-5 shadow-2xl border border-red-400/40 backdrop-blur-sm">
        <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-400/20 blur-3xl"></div>
        <div class="relative flex items-start gap-3">
          <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
            <span class="text-lg">⚠️</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[0.75rem] sm:text-xs font-black uppercase tracking-widest text-white/95">Importante</p>
            <p class="text-sm sm:text-base font-600 leading-snug mt-1 text-white/90">{{ bannerMensualidad.mensaje }}</p>
          </div>
        </div>
      </div>
    </div>

 

    <div class="max-w-6xl mx-auto px-6 mt-4">
      <CuestionarioSaludSemanal
        v-if="jugadoraAuthUser?.uid && jugadoraData"
        :jugadora-id="jugadoraAuthUser.uid"
        :jugadora-nombre="nombreCompletoJugadora"
        :equipo="equipoSeleccionado"
      />
    </div>

    <div class="mx-auto max-w-6xl px-4 mt-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-2xl border border-primary/25 bg-linear-to-br from-[#0f2425] to-black p-4 sm:p-6 shadow-2xl">
        <!-- Decorative elements -->
        <div class="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl"></div>

        <div class="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div class="flex-1">
            <p class="inline-flex items-center justify-center lg:justify-start rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.15em] text-primary/90">
              📊 Temporada 2026
            </p>
            <h3 class="mt-3 text-2xl sm:text-3xl font-black uppercase text-white leading-tight" style="font-family: 'Gobold High', system-ui, sans-serif;">
              Revisa las estadísticas del semestre
            </h3>
            <p class="mt-2 max-w-2xl text-sm sm:text-base text-white/70 font-semibold">
              Consulta el rendimiento de tu equipo en la competencia, estadísticas individuales y resultados.
            </p>
          </div>

          <router-link
            to="/competencias"
            @click="trackCTAClick('Ver temporada', 'entrenamientos_liga')"
            class="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-5 py-3.5 text-sm font-black uppercase tracking-widest text-black shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-2xl hover:shadow-primary/40 active:scale-95"
          >
            <span>Ver competencia</span>
            <svg class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <!-- Notificaciones de Feedback -->
      <div v-if="feedbacksPendientes && feedbacksPendientes.length > 0" class="mb-6">
        <div class="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600/80 to-green-600/80 shadow-2xl p-4 sm:p-5 border border-emerald-400/40 backdrop-blur-sm">
          <div class="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl"></div>
          <div class="relative flex items-start gap-3">
            <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
              <span class="text-lg">🔔</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[0.75rem] sm:text-xs font-black uppercase tracking-widest text-white/95">Mensajes del DT</p>
              <p class="text-sm sm:text-base font-600 mt-1 text-white/90">Tienes {{ feedbacksPendientes.length }} mensaje{{ feedbacksPendientes.length === 1 ? '' : 's' }} sin leer</p>
            </div>
          </div>
          
          <!-- Lista de feedbacks pendientes -->
          <div class="mt-4 space-y-2">
            <button
              v-for="feedback in feedbacksPendientes"
              :key="feedback.id"
              @click="abrirModalFeedback(feedback)"
              class="w-full text-left p-3 rounded-xl border border-emerald-300/40 hover:border-emerald-300/80 bg-white/10 hover:bg-white/20 transition-all cursor-pointer group backdrop-blur-sm"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-white capitalize">{{ feedback.tipo }}</p>
                  <p class="text-xs text-white/80 mt-1 line-clamp-1">{{ feedback.mensaje }}</p>
                  <p class="text-xs text-white/60 mt-2">{{ new Date(feedback.createdAt?.seconds ? feedback.createdAt.seconds * 1000 : feedback.createdAt).toLocaleString('es-ES') }}</p>
                </div>
                <div class="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <span class="text-white">→</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Información de jugadora compacta -->
      <div v-if="jugadoraData" class="mb-8 rounded-2xl border border-primary/25 bg-linear-to-br from-[#0f2425] to-black p-4 sm:p-5 shadow-xl overflow-hidden">
        <!-- Decorative background -->
        <div class="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
        
        <div class="relative grid grid-cols-1 gap-4 sm:gap-5">
          <!-- Main Player Card -->
          <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between rounded-xl border border-primary/20 bg-linear-to-r from-primary/10 to-primary/5 p-4 sm:p-5">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1 min-w-0">
              <!-- Photo -->
              <div v-if="jugadoraData.fotoPerfil" class="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl border-2 border-primary/40 shadow-lg">
                <img :src="jugadoraData.fotoPerfil" alt="Perfil" class="h-full w-full object-cover" />
              </div>
              <div v-else class="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl border-2 border-primary/40 bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <span class="text-4xl">👤</span>
              </div>

              <!-- Player Info -->
              <div class="text-center sm:text-left flex-1 min-w-0">
                <p class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary/70">Ficha Jugadora</p>
                <h3 class="mt-2 text-xl sm:text-2xl font-black uppercase text-white leading-tight">{{ jugadoraData.nombre }} {{ jugadoraData.apellido }}</h3>
                <div class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm sm:text-base">
                  <span class="font-semibold text-white/80">{{ jugadoraData.posicion || '—' }}</span>
                  <span class="text-white/40">•</span>
                  <span class="font-black text-primary text-lg">#{{ jugadoraData.dorsal || '—' }}</span>
                  <span class="text-white/40">•</span>
                  <span :class="[
                    'font-bold px-2.5 py-1 rounded-full text-xs',
                    jugadoraData.estadoSalud === 'lesionada' ? 'bg-red-500/20 text-red-300' :
                    jugadoraData.estadoSalud === 'recuperacion' ? 'bg-yellow-500/20 text-yellow-300' :
                    jugadoraData.estadoSalud === 'no_disponible' ? 'bg-gray-500/20 text-gray-300' :
                    'bg-green-500/20 text-green-300'
                  ]">
                    {{ formatearEstadoSalud(jugadoraData.estadoSalud) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Edit Profile Button -->
            <router-link
              to="/perfil"
              class="group w-full sm:w-auto relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary/80 to-primary px-4 py-3 font-bold text-black uppercase tracking-widest text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              <span>✎</span>
              <span>Editar</span>
            </router-link>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <!-- Racha -->
            <div v-if="rachaReciente" class="rounded-lg border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 p-3 text-center">
              <p class="text-[0.65rem] font-black uppercase tracking-wide text-primary/70">Racha</p>
              <p :class="['text-2xl font-black mt-1', rachaReciente.estado === 'confirmada' ? 'text-green-300' : 'text-red-300']">
                {{ rachaReciente.cantidad }}<span class="text-base ml-0.5">{{ rachaReciente.estado === 'confirmada' ? '✓' : '✗' }}</span>
              </p>
            </div>

            <!-- Asistencia -->
            <div v-if="estadisticasJugadora" class="rounded-lg border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 p-3 text-center">
              <p class="text-[0.65rem] font-black uppercase tracking-wide text-primary/70">Asistencia</p>
              <p class="text-2xl font-black text-primary mt-1">{{ porcentajeAsistencia }}%</p>
            </div>

            <!-- Goals -->
            <div v-if="estadisticasJugadora?.goles !== undefined" class="rounded-lg border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 p-3 text-center">
              <p class="text-[0.65rem] font-black uppercase tracking-wide text-primary/70">Goles</p>
              <p class="text-2xl font-black text-primary mt-1">{{ estadisticasJugadora.goles }}</p>
            </div>

            <!-- Assists -->
            <div v-if="estadisticasJugadora?.asistencias !== undefined" class="rounded-lg border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 p-3 text-center">
              <p class="text-[0.65rem] font-black uppercase tracking-wide text-primary/70">Asistencias</p>
              <p class="text-2xl font-black text-primary mt-1">{{ estadisticasJugadora.asistencias }}</p>
            </div>
          </div>

          <!-- Upcoming birthdays -->
          <div v-if="cumpleaniosHoy.length > 0 || proximoCumpleanios.length > 0" class="rounded-lg border border-primary/20 bg-linear-to-r from-primary/10 to-primary/5 p-4 sm:p-5">
            <div v-if="cumpleaniosHoy.length > 0" class="flex items-center gap-3 mb-3">
              <span class="text-2xl">🎂</span>
              <div>
                <p class="text-[0.7rem] font-black uppercase tracking-widest text-primary/70">¡HOY!</p>
                <p class="text-base font-black text-white mt-1">
                  <span v-if="cumpleaniosHoy.length === 1">{{ cumpleaniosHoy[0].nombre }}</span>
                  <span v-else>{{ cumpleaniosHoy.length }} cumpleaños</span>
                </p>
              </div>
            </div>
            <div v-else class="flex items-center gap-3">
              <span class="text-2xl">🎂</span>
              <div>
                <p class="text-[0.7rem] font-black uppercase tracking-widest text-primary/70">Próximo cumpleaños</p>
                <p class="text-base font-black text-white mt-1">{{ proximoCumpleanios[0]?.nombre }}</p>
                <p class="text-[0.75rem] text-white/60 mt-0.5">
                  <span v-if="proximoCumpleanios[0]?.diasRestantes === 1">Mañana</span>
                  <span v-else>En {{ proximoCumpleanios[0]?.diasRestantes }} días</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selector de equipo (si tiene ambos) -->
      <div v-if="mostrarSelectorEquipos" class="mb-8">
        <div class="rounded-2xl shadow-lg p-4 md:p-6 border border-primary/15 bg-linear-to-br from-[#0f2425] to-[#0a1415]">
          <div class="mb-4 md:mb-5">
            <h3 class="text-lg md:text-xl font-black uppercase tracking-widest text-white">Selecciona tu equipo</h3>
            <p class="text-xs md:text-sm text-white/60 mt-1 font-semibold">Cambia entre los equipos a los que perteneces</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              v-if="equiposDisponibles.includes('ascenso')"
              @click="cambiarEquipo('ascenso')"
              :class="[
                'relative px-3 py-2 sm:py-3 rounded-xl font-black transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 border-2 group overflow-hidden text-xs sm:text-sm',
                equipoSeleccionado === 'ascenso'
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/40 scale-105'
                  : 'bg-white/5 text-white border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg'
              ]"
            >
              <span class="text-lg">🏆</span>
              <span class="font-black uppercase tracking-wide">Ascenso</span>
            </button>
            <button
              v-if="equiposDisponibles.includes('serieC')"
              @click="cambiarEquipo('serieC')"
              :class="[
                'relative px-3 py-2 sm:py-3 rounded-xl font-black transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 border-2 group overflow-hidden text-xs sm:text-sm',
                equipoSeleccionado === 'serieC'
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/40 scale-105'
                  : 'bg-white/5 text-white border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg'
              ]"
            >
              <span class="text-lg">⚽</span>
              <span class="font-black uppercase tracking-wide">Serie C</span>
            </button>
            <button
              v-if="equiposDisponibles.includes('escuela')"
              @click="cambiarEquipo('escuela')"
              :class="[
                'relative px-3 py-2 sm:py-3 rounded-xl font-black transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 border-2 group overflow-hidden text-xs sm:text-sm',
                equipoSeleccionado === 'escuela'
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/40 scale-105'
                  : 'bg-white/5 text-white border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg'
              ]"
            >
              <span class="text-lg">📚</span>
              <span class="font-black uppercase tracking-wide">Escuela</span>
            </button>
            <button
              v-if="mostrarSelectorEquipos"
              @click="cambiarEquipo('ambos')"
              :class="[
                'relative px-3 py-2 sm:py-3 rounded-xl font-black transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 border-2 group overflow-hidden text-xs sm:text-sm',
                equipoSeleccionado === 'ambos'
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/40 scale-105'
                  : 'bg-white/5 text-white border-primary/30 hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg'
              ]"
            >
              <span class="text-lg">📅</span>
              <span class="font-black uppercase tracking-wide">Eventos</span>
            </button>
          </div>
        </div>
      </div>
            </button>
            <button
              v-if="equiposDisponibles.includes('escuela')"
              @click="cambiarEquipo('escuela')"
              :class="[
                'px-4 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border-2',
                equipoSeleccionado === 'escuela'
                  ? 'bg-yellow-500 text-white border-yellow-600 shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
              ]"
            >
              <AcademicCapIcon class="w-5 h-5" />
              Escuela
            </button>
            <button
              v-if="mostrarSelectorEquipos"
              @click="cambiarEquipo('ambos')"
              :class="[
                'px-4 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border-2',
                equipoSeleccionado === 'ambos'
                  ? 'bg-indigo-500 text-white border-indigo-600 shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              ]"
            >
              <CalendarIcon class="w-5 h-5" />
              Eventos
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading || primeraCarga" class="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-[#0f2425] to-black py-20 px-4">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary"></div>
          <div class="animate-pulse absolute inset-0 rounded-full h-16 w-16 border-4 border-primary/10"></div>
        </div>
        <p class="text-white mt-8 text-lg font-black uppercase tracking-widest">Cargando entrenamientos...</p>
        <p class="text-primary/60 mt-2 text-sm font-semibold">Esto puede tomar unos segundos</p>
      </div>

      <!-- Sin entrenamientos -->
      <div v-else-if="entrenamientosFiltered.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-[#0f2425] to-black p-12 text-center">
        <div class="text-6xl mb-4 opacity-40">📭</div>
        <p class="text-xl font-black text-white uppercase tracking-wide mb-2">Sin eventos disponibles</p>
        <p class="text-white/60 font-semibold">No hay entrenamientos o eventos programados en este momento</p>
        <router-link
          v-if="equipoSeleccionado !== 'ambos'"
          :to="equipoSeleccionado ? '#' : '/login-jugadora'"
          @click="cambiarEquipo('ambos')"
          class="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary/20 border border-primary/40 px-4 py-2.5 font-bold text-primary/90 transition-all hover:bg-primary/30 cursor-pointer"
        >
          <span>🔄</span>
          Ver todos los eventos
        </router-link>
      </div>

      <!-- Lista de entrenamientos -->
      <div v-if="!primeraCarga && entrenamientosFiltered.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="entrenamiento in entrenamientosFiltered"
          :key="entrenamiento.id"
          class="group relative flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-[#0f2425] via-[#0a1415] to-black shadow-lg transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 h-full"
        >
          <!-- Accent gradient on hover -->
          <div class="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/0 transition-all duration-300 pointer-events-none rounded-2xl"></div>

          <!-- Card Header with type indicator -->
          <div :class="[
            'relative z-10 flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-4 transition-all duration-300',
            entrenamiento.tipo?.toLowerCase() === 'partido' || entrenamiento.tipo?.toLowerCase() === 'amistoso'
              ? 'border-red-500/30 bg-linear-to-r from-red-500/10 to-red-500/5'
              : 'border-primary/25 bg-linear-to-r from-primary/10 to-primary/5'
          ]">
            <div class="flex items-center gap-3">
              <div :class="[
                'flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg transition-transform duration-300 group-hover:scale-110',
                entrenamiento.tipo?.toLowerCase() === 'partido' || entrenamiento.tipo?.toLowerCase() === 'amistoso'
                  ? 'bg-red-500/30 text-red-300'
                  : 'bg-primary/30 text-primary'
              ]">
                <span v-if="entrenamiento.tipo?.toLowerCase() === 'partido'">🏆</span>
                <span v-else-if="entrenamiento.tipo?.toLowerCase() === 'amistoso'">🤝</span>
                <span v-else>🔥</span>
              </div>
              <div>
                <p :class="[
                  'text-[0.7rem] font-black uppercase tracking-[0.15em]',
                  entrenamiento.tipo?.toLowerCase() === 'partido' || entrenamiento.tipo?.toLowerCase() === 'amistoso'
                    ? 'text-red-300'
                    : 'text-primary/80'
                ]">
                  {{ entrenamiento.tipo || 'Evento' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="!entrenamiento.eventoInformativo" :class="[
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide border',
                estadoInscripcion[entrenamiento.id] === 'confirmada'
                  ? 'border-green-500/50 bg-green-500/20 text-green-300'
                  : estadoInscripcion[entrenamiento.id] === 'baja'
                  ? 'border-red-500/50 bg-red-500/20 text-red-300'
                  : estadoInscripcion[entrenamiento.id] === 'pendiente'
                  ? 'border-yellow-500/50 bg-yellow-500/20 text-yellow-300'
                  : 'border-white/20 bg-white/10 text-white/70'
              ]">
                {{ 
                  estadoInscripcion[entrenamiento.id] === 'confirmada' ? '✓' :
                  estadoInscripcion[entrenamiento.id] === 'baja' ? '✗' :
                  estadoInscripcion[entrenamiento.id] === 'pendiente' ? '⏳' :
                  '○'
                }}
                <span class="hidden sm:inline">
                  {{ 
                    estadoInscripcion[entrenamiento.id] === 'confirmada' ? 'Confirmada' :
                    estadoInscripcion[entrenamiento.id] === 'baja' ? 'Baja' :
                    estadoInscripcion[entrenamiento.id] === 'pendiente' ? 'Pendiente' :
                    'Sin respuesta'
                  }}
                </span>
              </span>
              <span v-else class="inline-flex items-center gap-1 rounded-full border border-cyan-500/50 bg-cyan-500/20 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-cyan-300">
                ℹ️
                <span class="hidden sm:inline">Info</span>
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="relative z-10 flex flex-1 flex-col p-4 sm:p-5">
            <!-- Attendees badge -->
            <div class="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-[0.7rem] font-black uppercase tracking-widest text-primary/90 w-fit">
              <span>👥</span>
              <span>{{ contarConfirmadas(entrenamiento.id) }}</span>
              <span class="text-primary/70">confirmada{{ contarConfirmadas(entrenamiento.id) === 1 ? '' : 's' }}</span>
            </div>

            <!-- Title -->
            <h3 class="text-base sm:text-lg font-black uppercase text-white mb-4 line-clamp-2 leading-tight">{{ entrenamiento.nombre }}</h3>

            <!-- Info details -->
            <div class="mb-4 space-y-2.5 text-[0.85rem] flex-grow">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 flex-shrink-0">
                  <span class="text-xs">📅</span>
                </div>
                <div class="min-w-0">
                  <p class="text-[0.65rem] uppercase tracking-wide font-bold text-white/60">Fecha</p>
                  <p class="font-semibold text-white">{{ formatearFecha(entrenamiento.fecha) }}</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 flex-shrink-0">
                  <span class="text-xs">⏰</span>
                </div>
                <div class="min-w-0">
                  <p class="text-[0.65rem] uppercase tracking-wide font-bold text-white/60">Hora</p>
                  <p class="font-semibold text-white">
                    {{ entrenamiento.hora }}<template v-if="entrenamiento.horaFin"> - {{ entrenamiento.horaFin }}</template>
                  </p>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-primary/20 flex-shrink-0">
                  <span class="text-xs">📍</span>
                </div>
                <div class="min-w-0">
                  <p class="text-[0.65rem] uppercase tracking-wide font-bold text-white/60">Lugar</p>
                  <p class="font-semibold text-white line-clamp-2">{{ entrenamiento.lugar }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-[0.8rem] text-white/70 mb-4 line-clamp-2">{{ entrenamiento.descripcion }}</p>

            <!-- Special alerts -->
            <div v-if="entrenamiento.esConvocatoria && !esConvocada(entrenamiento)" class="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-2.5">
              <span class="mt-0.5 flex-shrink-0 text-base">⚠️</span>
              <p class="text-[0.7rem] font-bold text-red-200">No estás en la lista de convocadas</p>
            </div>

            <!-- Action buttons -->
            <div v-if="!entrenamiento.eventoInformativo" class="flex flex-col gap-2 mt-auto pt-2 border-t border-white/10">
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-if="estadoInscripcion[entrenamiento.id] === 'confirmada'"
                  @click="abrirModalBaja(entrenamiento)"
                  :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamiento)"
                  class="relative group/btn flex items-center justify-center gap-1 rounded-lg bg-orange-500/80 px-3 py-2.5 text-[0.7rem] font-black uppercase tracking-wide text-white transition-all duration-200 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <span>↔️</span>
                  <span class="hidden sm:inline">Cambiar</span>
                </button>
                <button
                  v-else-if="estadoInscripcion[entrenamiento.id] === 'baja'"
                  @click="handleInscribirse(entrenamiento)"
                  :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamiento)"
                  class="relative group/btn flex items-center justify-center gap-1 rounded-lg bg-blue-500/80 px-3 py-2.5 text-[0.7rem] font-black uppercase tracking-wide text-white transition-all duration-200 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <span>↔️</span>
                  <span class="hidden sm:inline">Cambiar</span>
                </button>
                <button
                  v-else
                  @click="handleInscribirse(entrenamiento)"
                  :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamiento)"
                  class="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-green-500/80 px-3 py-2.5 text-[0.7rem] font-black uppercase tracking-wide text-white transition-all duration-200 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <span>✓</span>
                  <span>Confirmar</span>
                </button>
              </div>

              <button
                v-if="!estaInscrita(entrenamiento.id) && estadoInscripcion[entrenamiento.id] !== 'baja'"
                @click="abrirModalBaja(entrenamiento)"
                :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamiento)"
                class="flex items-center justify-center gap-1 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2.5 text-[0.7rem] font-black uppercase tracking-wide text-red-300 transition-all duration-200 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <span>✕</span>
                <span>Baja</span>
              </button>

              <button
                @click="verDetalles(entrenamiento)"
                class="flex items-center justify-center gap-1.5 rounded-lg border border-primary/50 bg-primary/20 px-3 py-2.5 text-[0.7rem] font-black uppercase tracking-wide text-primary/90 transition-all duration-200 hover:bg-primary/30 hover:border-primary/70 active:scale-95"
              >
                <span>📋</span>
                <span>Detalles</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <!-- Historial (visible solo para admin) -->
    <div v-if="esAdmin && historialEntrenamientos.length > 0" class="max-w-6xl mx-auto p-6 mt-8">
      <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div class="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Historial de Eventos</h2>
            <p class="text-sm text-gray-500 mt-1">Eventos finalizados - Solo para administradores</p>
          </div>
          <div class="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
            {{ historialEntrenamientos.length }} eventos
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="ent in historialEntrenamientos" :key="ent.id" class="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 line-clamp-2">{{ ent.nombre }}</h3>
                <div class="text-xs text-gray-500 mt-1 space-y-0.5">
                  <div>📅 {{ formatearFecha(ent.fecha) }}</div>
                  <div>⏰ {{ ent.hora }}</div>
                </div>
              </div>
              <span class="text-xs bg-gray-700 text-white rounded-full px-3 py-1 whitespace-nowrap font-bold ml-2">Finalizado</span>
            </div>
            <p class="text-xs text-gray-700 mb-4 line-clamp-2">{{ ent.descripcion }}</p>
            <button @click="verDetalles(ent)" class="w-full px-3 py-2.5 text-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg cursor-pointer hover:shadow-md transition-all font-bold flex items-center justify-center gap-2">
              <PencilIcon class="w-4 h-4" />
              Editar Asistencia
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Vista de detalles -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div v-if="entrenamientoSeleccionado" class="fixed inset-0 bg-white overscroll-none z-50 overflow-y-auto">
        <div class="min-h-screen pb-10">
          <!-- Header con gradiente -->
          <div class="bg-linear-to-r from-primary-dark to-primary text-white p-5 sm:p-6 shadow-lg border-b border-white/10">
            <div class="max-w-4xl mx-auto">
              <button
                @click="entrenamientoSeleccionadoId = null"
                class="mb-4 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group bg-white/10 px-3 py-2 rounded-xl"
              >
                <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="font-bold text-sm uppercase tracking-wide">Volver a la lista</span>
              </button>
              
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1">
                  <h2 class="text-2xl font-bold mb-2">{{ entrenamientoSeleccionado.nombre }}</h2>
                  <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-sm opacity-90">
                    <span class="flex items-center gap-1">
                      <CalendarIcon class="w-4 h-4" />
                      {{ formatearFecha(entrenamientoSeleccionado.fecha) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <ClockIcon class="w-4 h-4" />
                      {{ entrenamientoSeleccionado.hora }}<template v-if="entrenamientoSeleccionado.horaFin"> - {{ entrenamientoSeleccionado.horaFin }}</template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenido -->
          <div class="max-w-4xl mx-auto p-4 space-y-4 pb-6">
            <!-- Indicador de convocatoria -->
            <div v-if="entrenamientoSeleccionado.esConvocatoria" class="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h3 class="font-bold text-purple-900 text-xs mb-1 flex items-center gap-1">
                <ClipboardDocumentListIcon class="w-4 h-4" />
                Partido con Convocatoria
              </h3>
              <p class="text-xs text-purple-700">
                Solo las jugadoras convocadas pueden confirmar su asistencia a este partido.
              </p>
            </div>

            <!-- Descripción -->
            <div class="bg-gray-50 rounded-lg p-3">
              <h3 class="font-bold text-gray-800 text-xs mb-1 flex items-center gap-1">
                <DocumentTextIcon class="w-4 h-4" />
                Descripción
              </h3>
              <p class="text-gray-700 text-xs leading-relaxed">{{ entrenamientoSeleccionado.descripcion }}</p>
            </div>

            <!-- Información del evento -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div class="flex items-start gap-2">
                  <MapPinIcon class="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 class="font-bold text-blue-900 text-xs mb-0.5">Lugar</h3>
                    <p class="text-blue-800 text-xs">{{ entrenamientoSeleccionado.lugar }}</p>
                    <button
                      v-if="obtenerMapaUrl(entrenamientoSeleccionado)"
                      type="button"
                      @click="abrirMapa(entrenamientoSeleccionado)"
                      class="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900"
                    >
                      <MapPinIcon class="w-3.5 h-3.5" />
                      Ver en Google Maps
                    </button>
                  </div>
                </div>
              </div>
              <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                <div class="flex items-start gap-2">
                  <UserGroupIcon class="w-5 h-5 text-green-600" />
                  <div>
                    <h3 class="font-bold text-green-900 text-xs mb-0.5">Equipo</h3>
                    <p class="text-green-800 text-xs capitalize">{{ entrenamientoSeleccionado.equipo }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="obtenerMapaEmbedUrl(entrenamientoSeleccionado)" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
                <p class="text-[11px] font-black uppercase tracking-wide text-gray-700">Mapa de la cancha</p>
                <button
                  type="button"
                  @click="abrirMapa(entrenamientoSeleccionado)"
                  class="text-[11px] font-bold text-primary-dark hover:text-primary"
                >
                  Abrir mapa
                </button>
              </div>
              <div class="relative">
                <div v-if="mapaCargando" class="absolute inset-0 z-10 bg-white/90 flex flex-col items-center justify-center gap-2">
                  <div class="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p class="text-[11px] font-bold text-gray-600">Cargando mapa...</p>
                </div>
              <iframe
                :src="obtenerMapaEmbedUrl(entrenamientoSeleccionado)"
                @load="mapaCargando = false"
                class="w-full h-56 border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Mapa del evento"
              ></iframe>
              </div>
            </div>

            <!-- Lista de Jugadoras Convocadas (si es convocatoria) -->
     

            <!-- CONVOCATORIA - Estilo App Deportiva -->
            <div class="bg-linear-to-b from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <!-- Stats Bar -->
              <div class="px-4 py-3 bg-white border-b border-gray-100">
                <h3 class="text-gray-900 font-black text-xs uppercase tracking-wider mb-2">Lista de Convocatoria</h3>
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-green-50 rounded-lg px-2 py-1.5 text-center border border-green-100">
                    <div class="text-green-600 font-black text-lg">{{ inscritasOrganizadas.confirmadas.length }}</div>
                    <div class="text-green-700 text-[9px] font-bold uppercase truncate">Confirmadas</div>
                  </div>
                  <div class="bg-red-50 rounded-lg px-2 py-1.5 text-center border border-red-100">
                    <div class="text-red-600 font-black text-lg">{{ inscritasOrganizadas.bajas.length }}</div>
                    <div class="text-red-700 text-[9px] font-bold uppercase">Ausentes</div>
                  </div>
                  <div class="bg-yellow-50 rounded-lg px-2 py-1.5 text-center border border-yellow-100">
                    <div class="text-yellow-600 font-black text-lg">{{ inscritasOrganizadas.pendientes.length }}</div>
                    <div class="text-yellow-700 text-[9px] font-bold uppercase">Pendientes</div>
                  </div>
                </div>
                <div
                  v-if="inscritasExcluidas.length > 0"
                  class="mt-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-sky-700 text-center"
                >
                  {{ inscritasExcluidas.length }} jugadora{{ inscritasExcluidas.length === 1 ? '' : 's' }} fuera del calculo de asistencia
                </div>
              </div>

              <!-- Tabs -->
              <div class="grid grid-cols-3 bg-gray-100 border-b border-gray-200">
                <button
                  @click="tabActivo = 'confirmadas'"
                  :class="[
                    'w-full py-2 px-1.5 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide transition-all relative cursor-pointer',
                    tabActivo === 'confirmadas'
                      ? 'text-green-700 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-center gap-1 min-w-0">
                    <span>✓</span>
                    <span class="hidden sm:inline truncate">Confirmadas</span>
                    <span class="sm:hidden">Conf.</span>
                    <span class="ml-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shrink-0">{{ inscritasOrganizadas.confirmadas.length }}</span>
                  </span>
                  <div v-if="tabActivo === 'confirmadas'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
                </button>
                <button
                  @click="tabActivo = 'bajas'"
                  :class="[
                    'w-full py-2 px-1.5 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide transition-all relative cursor-pointer',
                    tabActivo === 'bajas'
                      ? 'text-red-700 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-center gap-1 min-w-0">
                    <span>✕</span>
                    <span class="hidden sm:inline">Ausentes</span>
                    <span class="sm:hidden">Aus.</span>
                    <span class="ml-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shrink-0">{{ inscritasOrganizadas.bajas.length }}</span>
                  </span>
                  <div v-if="tabActivo === 'bajas'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                </button>
                <button
                  @click="tabActivo = 'pendientes'"
                  :class="[
                    'w-full py-2 px-1.5 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide transition-all relative cursor-pointer',
                    tabActivo === 'pendientes'
                      ? 'text-yellow-700 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-center gap-1 min-w-0">
                    <span>⏳</span>
                    <span class="hidden sm:inline">Pendientes</span>
                    <span class="sm:hidden">Pend.</span>
                    <span class="ml-1 bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shrink-0">{{ inscritasOrganizadas.pendientes.length }}</span>
                  </span>
                  <div v-if="tabActivo === 'pendientes'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
                </button>
              </div>

              <!-- Player List -->
              <div class="p-3">
                <!-- Loader mientras cargan inscripciones -->
                <div v-if="cargandoInscripciones[entrenamientoSeleccionado.id] !== false" class="flex flex-col items-center justify-center py-12">
                  <div class="relative">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <div class="animate-ping absolute inset-0 rounded-full h-12 w-12 border-b-2 border-primary opacity-20"></div>
                  </div>
                  <p class="text-gray-500 mt-4 text-sm font-medium">Cargando lista de jugadoras...</p>
                </div>

                <!-- Listas de jugadoras -->
                <div v-else>
                <!-- Confirmadas -->
                <div v-show="tabActivo === 'confirmadas'" class="space-y-1.5">
                  <div v-if="inscritasOrganizadas.confirmadas.length === 0" class="text-center py-8 text-gray-400">
                    <div class="text-3xl mb-2">⚽</div>
                    <p class="text-xs font-medium">Aún no hay confirmaciones</p>
                  </div>
                  <div
                    v-for="(inscrita, index) in inscritasOrganizadas.confirmadas"
                    :key="inscrita.id"
                    class="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-green-100 hover:border-green-300 hover:shadow-md transition-all group"
                  >
                    <div class="flex items-center gap-2 flex-1">
                      <div class="w-8 h-8 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">
                        {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                      </div>
                      <div class="flex-1">
                        <div class="text-xs font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                        <div class="text-[9px] text-gray-500 font-medium">Confirmó: {{ formatearFechaInscripcion(inscrita.updatedAt || inscrita.createdAt) }}</div>
                      </div>
                    </div>
                    <div v-if="esAdmin" class="flex items-center gap-1">
                      <button
                        @click="cambiarEstadoJugadora(inscrita.id, 'baja')"
                        class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[9px] font-bold transition-colors cursor-pointer"
                        title="Marcar como baja"
                      >
                        Baja
                      </button>
                      <button
                        @click="cambiarEstadoJugadora(inscrita.id, 'pendiente')"
                        class="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-[9px] font-bold transition-colors cursor-pointer"
                        title="Marcar como pendiente"
                      >
                        Pendiente
                      </button>
                    </div>
                    <div v-else class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span class="text-green-600 font-bold text-sm">✓</span>
                    </div>
                  </div>
                </div>

                <!-- Bajas -->
                <div v-show="tabActivo === 'bajas'" class="space-y-1.5">
                  <div v-if="inscritasOrganizadas.bajas.length === 0" class="text-center py-8 text-gray-400">
                    <div class="text-3xl mb-2">🎉</div>
                    <p class="text-xs font-medium">No hay ausencias</p>
                  </div>
                  <div
                    v-for="(inscrita, index) in inscritasOrganizadas.bajas"
                    :key="inscrita.id"
                    class="bg-white rounded-lg border border-red-100 hover:border-red-300 hover:shadow-md transition-all"
                  >
                    <div class="flex items-center gap-3 p-2.5">
                      <div class="flex items-center gap-2 flex-1">
                        <div class="w-8 h-8 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">
                          {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                        </div>
                        <div class="flex-1">
                          <div class="text-xs font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                          <div class="text-[9px] text-gray-500 font-medium">No asistirá</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-1">
                        <div v-if="inscrita.motivoBaja" class="px-2 py-0.5 bg-blue-100 rounded-full">
                          <span class="text-blue-600 text-[9px] font-bold">💬 Motivo</span>
                        </div>
                        <div v-if="esAdmin" class="flex items-center gap-1 ml-1">
                          <button
                            @click="cambiarEstadoJugadora(inscrita.id, 'confirmada')"
                            class="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-[9px] font-bold transition-colors cursor-pointer"
                            title="Marcar como confirmada"
                          >
                            Confirmar
                          </button>
                          <button
                            @click="cambiarEstadoJugadora(inscrita.id, 'pendiente')"
                            class="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-[9px] font-bold transition-colors cursor-pointer"
                            title="Marcar como pendiente"
                          >
                            Pendiente
                          </button>
                        </div>
                        <div v-else class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <span class="text-red-600 font-bold text-sm">✕</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="inscrita.motivoBaja" class="px-2.5 pb-2.5">
                      <div class="bg-gray-50 border-l-2 border-blue-500 p-2 rounded text-[10px] text-gray-700 italic">
                        💬 "{{ inscrita.motivoBaja }}"
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pendientes -->
                <div v-show="tabActivo === 'pendientes'" class="space-y-1.5">
                  <div v-if="inscritasOrganizadas.pendientes.length === 0" class="text-center py-8 text-gray-400">
                    <div class="text-3xl mb-2">✅</div>
                    <p class="text-xs font-medium">Todas respondieron</p>
                  </div>
                  <div
                    v-for="(inscrita, index) in inscritasOrganizadas.pendientes"
                    :key="inscrita.id"
                    class="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-yellow-100 hover:border-yellow-300 hover:shadow-md transition-all group"
                  >
                    <div class="flex items-center gap-2 flex-1">
                      <div class="w-8 h-8 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">
                        {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                      </div>
                      <div class="flex-1">
                        <div class="text-xs font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                        <div class="text-[9px] text-gray-500 font-medium">Esperando respuesta...</div>
                      </div>
                    </div>
                    <div v-if="esAdmin" class="flex items-center gap-1">
                      <button
                        @click="cambiarEstadoJugadora(inscrita.id, 'confirmada')"
                        class="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-[9px] font-bold transition-colors cursor-pointer"
                        title="Marcar como confirmada"
                      >
                        Confirmar
                      </button>
                      <button
                        @click="cambiarEstadoJugadora(inscrita.id, 'baja')"
                        class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[9px] font-bold transition-colors cursor-pointer"
                        title="Marcar como baja"
                      >
                        Baja
                      </button>
                    </div>
                    <div v-else class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span class="text-yellow-600 font-bold text-sm">⏳</span>
                    </div>
                  </div>
                </div>

                <div v-if="inscritasExcluidas.length > 0" class="mt-4 rounded-xl border border-sky-200 bg-sky-50/80 p-3">
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p class="text-[11px] text-sky-700">Ausencias definidas</p>
                    </div>
                    <span class="rounded-full bg-sky-600 px-2.5 py-1 text-[10px] font-black text-white">
                      {{ inscritasExcluidas.length }}
                    </span>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="inscrita in inscritasExcluidas"
                      :key="`excluida-${inscrita.id}`"
                      class="flex items-center gap-3 rounded-lg border border-sky-100 bg-white px-3 py-2"
                    >
                      <div class="w-8 h-8 rounded-full bg-linear-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                        {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</p>
                        <p class="text-[10px] text-gray-500">
                          {{ obtenerEtiquetaEstadoLista(inscrita.estadoLista) }}. Estado actual: {{ obtenerEstadoSaludExclusion(inscrita.estadoSalud) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones del evento -->
          <div class="max-w-4xl mx-auto px-4 pb-6">
            <div class="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
          <div v-if="mvpPendienteSeleccionado" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800 font-semibold flex items-center gap-2">
              <TrophyIcon class="w-4 h-4" />
              <span>Votación MVP disponible desde: {{ mvpDisponibleDesdeTextoSeleccionado }}</span>
            </p>
          </div>

          <div v-if="mvpDisponibleSeleccionado" class="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-bold text-gray-800">Votación MVP Post-Partido</p>
              <p class="text-xs text-gray-600">Total votos: <span class="font-black text-primary-dark">{{ totalVotosMvpSeleccionado }}</span></p>
            </div>

            <div v-if="mvpGanadoraSeleccionado" class="mb-3 p-3 rounded-2xl bg-linear-to-r from-yellow-50 via-amber-50 to-orange-100 border-2 border-yellow-300 shadow-lg relative overflow-hidden">
              <SparklesIcon class="absolute -top-3 -right-3 w-10 h-10 text-yellow-500 opacity-20 animate-pulse" />
              <TrophyIcon class="absolute -bottom-3 -left-2 w-8 h-8 text-yellow-600 opacity-20 animate-bounce" />

              <div class="flex items-center gap-3 relative z-10">
                <div class="relative shrink-0">
                  <img
                    v-if="mvpGanadoraFotoSeleccionado"
                    :src="mvpGanadoraFotoSeleccionado"
                    :alt="mvpGanadoraSeleccionado.nombre"
                    class="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 shadow"
                  />
                  <div
                    v-else
                    class="w-14 h-14 rounded-full bg-linear-to-br from-primary-dark to-primary text-white border-2 border-yellow-400 shadow flex items-center justify-center font-black"
                  >
                    {{ obtenerIniciales(mvpGanadoraSeleccionado.nombre) }}
                  </div>
                  <div class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center shadow animate-pulse">
                    <TrophyIcon class="w-4 h-4" />
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-[11px] font-black uppercase tracking-wider text-yellow-700 flex items-center gap-1">
                    <TrophyIcon class="w-3.5 h-3.5" />
                    <span>Jugadora del partido</span>
                  </p>
                  <p class="text-base font-black text-yellow-900 truncate">{{ mvpGanadoraSeleccionado.nombre }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <p class="text-xs font-semibold text-yellow-800">{{ mvpGanadoraSeleccionado.votos }} {{ mvpGanadoraSeleccionado.votos === 1 ? 'voto' : 'votos' }}</p>
                    <span v-if="mvpGanadoraFotoCargando" class="text-[10px] bg-white/70 text-yellow-900 px-2 py-0.5 rounded-full font-bold">cargando foto...</span>
                  </div>
                </div>
              </div>
            </div>

            <p v-if="mvpCerradaSeleccionado" class="mb-2 text-xs font-bold text-gray-700 bg-gray-200 border border-gray-300 rounded px-2 py-1 flex items-center gap-1.5">
              <LockClosedIcon class="w-3.5 h-3.5" />
              <span>Votación finalizada</span>
            </p>

            <div v-if="rankingMvpVisibleSeleccionado.length > 0" class="mb-2 p-2 bg-primary/10 border border-primary/20 rounded">
              <p class="text-[11px] font-black text-primary-dark uppercase tracking-wide mb-1">{{ mvpCerradaSeleccionado ? 'Top 3 MVP' : 'Ranking MVP' }}</p>
              <div class="space-y-1">
                <div v-for="(item, index) in rankingMvpVisibleSeleccionado" :key="`mvp-top-${entrenamientoSeleccionado.id}-${item.nombre}`" class="flex items-center justify-between text-xs text-primary-dark">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">{{ index + 1 }}</span>
                    <span class="font-bold truncate">{{ item.nombre }}</span>
                  </div>
                  <span class="font-black">{{ item.votos }} {{ item.votos === 1 ? 'voto' : 'votos' }}</span>
                </div>
              </div>
            </div>

            <div v-if="!mvpYaVotadoSeleccionado && candidatasMvpSeleccionado.length > 0" class="space-y-2">
              <p class="text-[11px] font-black text-gray-500 uppercase tracking-wide">Elige a la MVP</p>
              <button
                v-for="nombre in candidatasMvpSeleccionado"
                :key="`mvp-detalle-${entrenamientoSeleccionado.id}-${nombre}`"
                @click="votarMvpSeleccionado(nombre)"
                :disabled="!puedeVotarMvpSeleccionado || mvpVoteLoading"
                :class="[
                  'w-full px-3 py-2.5 rounded-xl text-sm border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-3',
                  mvpVotoSeleccionado === nombre
                    ? 'bg-primary text-white border-primary-dark shadow'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                ]"
              >
                <span class="flex items-center gap-2 min-w-0">
                  <span :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0',
                    mvpVotoSeleccionado === nombre ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary-dark'
                  ]">
                    {{ obtenerIniciales(nombre) }}
                  </span>
                  <span class="font-bold truncate text-left">{{ nombre }}</span>
                </span>
                <span v-if="mvpVotoSeleccionado === nombre" class="text-[11px] font-black uppercase tracking-wide">Tu voto</span>
              </button>
            </div>

            <p v-if="mvpVotoSeleccionado" class="text-xs text-gray-600 mt-2">
              Tu voto: <span class="font-black text-primary-dark">{{ mvpVotoSeleccionado }}</span>
            </p>

            <p v-if="mvpYaVotadoSeleccionado" class="text-xs text-amber-700 mt-2 font-bold">
              Ya registraste tu voto MVP en este partido. No se puede modificar.
            </p>

            <p v-if="!puedeVotarMvpSeleccionado && !mvpCerradaSeleccionado" class="text-xs text-gray-500 mt-2">
              Todas las jugadoras del plantel pueden votar, pero solo por jugadoras inscritas en el evento.
            </p>
          </div>

          <!-- Mensaje si la fecha pasó -->
          <div v-if="fechaPasada(entrenamientoSeleccionado)" class="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
            <p class="text-sm text-gray-700 font-semibold">
              ⚠️ Este evento ya finalizó. No se pueden realizar cambios en la inscripción.
            </p>
          </div>

          <!-- Estado actual (cuando ya respondió) -->
          <div v-if="estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada' || estadoInscripcion[entrenamientoSeleccionado.id] === 'baja'" class="mb-4">
            <p class="text-sm text-gray-600 font-semibold mb-2">Tu respuesta actual:</p>
            <div :class="[
              'p-2 rounded-lg border-2 flex items-center gap-3',
              estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada' 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            ]">
              <span :class="[
                'text-3xl',
                estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada' ? 'text-green-600' : 'text-red-600'
              ]">
                {{ estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada' ? '✓' : '✕' }}
              </span>
              <div>
                <p :class="[
                  'font-bold',
                  estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada' ? 'text-green-800' : 'text-red-800'
                ]">
                  {{ estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada' ? 'Asistencia Confirmada' : 'Te diste de Baja' }}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  Puedes cambiar tu respuesta hasta que termine el evento
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col gap-2">
            <div v-if="mensajeDetalle" :class="[
              'mb-2 px-3 py-2 rounded-lg border text-sm font-semibold',
              tipoMensajeDetalle === 'success'
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-red-50 border-red-300 text-red-700'
            ]">
              {{ mensajeDetalle }}
            </div>
            <div v-if="jugadoraRestringidaPorEstado" class="mb-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              {{ mensajeBloqueoPorEstado }}
            </div>
            <!-- Si ya confirmó - botón para cambiar a baja -->
            <button
              v-if="estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada'"
              @click="abrirModalBaja(entrenamientoSeleccionado)"
              :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
              :class="[
                'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50'
              ]"
            >
              {{ jugadoraRestringidaPorEstado ? '⛔ No disponible' : fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '🔄 Cambiar mi respuesta a Baja' }}
            </button>
            <!-- Si ya se dio de baja - botón para cambiar a confirmada -->
            <button
              v-else-if="estadoInscripcion[entrenamientoSeleccionado.id] === 'baja'"
              @click="handleInscribirse(entrenamientoSeleccionado)"
              :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
              :class="[
                'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
              ]"
            >
              {{ jugadoraRestringidaPorEstado ? '⛔ No disponible' : fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '🔄 Cambiar mi respuesta a Confirmada' }}
            </button>
            <!-- Si no ha respondido - botones de acción -->
            <template v-else>
              <button
                @click="handleInscribirse(entrenamientoSeleccionado)"
                :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                  jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
                ]"
              >
                {{ jugadoraRestringidaPorEstado ? '⛔ No disponible' : fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '✓ Confirmar mi Asistencia' }}
              </button>
              <button
                @click="abrirModalBaja(entrenamientoSeleccionado)"
                :disabled="isLoadingAccion || jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                  jugadoraRestringidaPorEstado || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
                ]"
              >
                {{ jugadoraRestringidaPorEstado ? '⛔ No disponible' : fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '✕ Darme de Baja' }}
              </button>
            </template>
          </div>
          </div>
            </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de motivo de baja -->
    <div v-if="mostrarModalBaja" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Dar de Baja</h2>
          <p class="text-sm text-gray-600 mt-1">Por favor indica el motivo de tu ausencia</p>
        </div>

        <div class="p-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Motivo (opcional):</label>
          <textarea
            v-model="motivoBaja"
            placeholder="Ej: Tengo un examen, Estoy enferma, Compromiso familiar..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="4"
            maxlength="200"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ motivoBaja.length }}/200 caracteres</p>
        </div>

        <div class="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            @click="cerrarModalBaja"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            :disabled="isLoadingAccion"
          >
            Cancelar
          </button>
          <button
            @click="confirmarBaja"
            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
            :disabled="isLoadingAccion"
          >
            {{ isLoadingAccion ? 'Procesando...' : 'Confirmar Baja' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de confirmación -->
    <div v-if="toastMensaje" :class="[
      'fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white font-bold transition-opacity',
      toastTipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]">
      {{ toastMensaje }}
    </div>

    <!-- Modal de Feedback del DT -->
    <div v-if="mostrarModalFeedback && feedbackSeleccionado" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <!-- Header - Tema Verde (Fútbol) -->
        <div class="bg-linear-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <BellIcon class="w-5 h-5" />
            </div>
            <h2 class="text-lg font-bold">Mensaje del DT</h2>
          </div>
          <button
            @click="cerrarModalFeedback"
            class="hover:bg-white/20 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <CloseIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Contenido -->
        <div class="p-6 space-y-5">
          <!-- Tipo de feedback -->
          <div class="bg-green-50 rounded-xl p-4 border border-green-200">
            <p class="text-xs font-bold text-green-600 uppercase tracking-wide">Tipo</p>
            <p class="text-base font-bold text-gray-900 mt-2 capitalize">{{ feedbackSeleccionado.tipo }}</p>
          </div>

          <!-- Mensaje -->
          <div>
            <p class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Mensaje</p>
            <p class="text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-4">{{ feedbackSeleccionado.mensaje }}</p>
          </div>

          <!-- Fecha -->
          <div class="text-xs text-gray-500 flex items-center gap-2">
            <span>📅</span>
            {{ new Date(feedbackSeleccionado.createdAt?.seconds ? feedbackSeleccionado.createdAt.seconds * 1000 : feedbackSeleccionado.createdAt).toLocaleString('es-ES') }}
          </div>

          <!-- Reacción actual (si existe) -->
          <div v-if="feedbackSeleccionado.reaccion" class="p-4 bg-green-100 rounded-xl border-2 border-green-300">
            <p class="text-xs font-bold text-green-700 uppercase">✓ Confirmado</p>
            <p class="text-base font-bold mt-2 text-green-700">Visto y confirmado</p>
          </div>
        </div>

        <!-- Reacciones (solo si no ha reaccionado) -->
        <div v-if="!feedbackSeleccionado.reaccion" class="px-6 pb-6 space-y-3">
          <p class="text-xs font-bold text-gray-700 uppercase tracking-wide">¿Lo viste?</p>
          <button
            @click="reaccionarFeedback('confirmado')"
            :disabled="isReaccionandoFeedback"
            class="w-full p-4 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircleIcon class="w-5 h-5" />
            <span>Sí, lo confirmé</span>
          </button>
        </div>

        <!-- Botón cerrar (cuando ya respondió) -->
        <div v-else class="px-6 pb-6">
          <button
            @click="cerrarModalFeedback"
            class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  
     <div class="max-w-6xl mx-auto px-6 mt-3">
      <div class="rounded-[28px] border border-white/10 bg-white/6 backdrop-blur-md p-4 sm:p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] overflow-hidden relative">
        <div class="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-cyan-300/10 to-transparent"></div>
        <div class="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/95 p-1 shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
            <img :src="kinesioLogo" alt="Kinesiosport" class="w-full h-full object-contain scale-175" />
          </div>
          <div class="flex-1 text-center sm:text-left">
            <p class="inline-flex items-center rounded-full border border-cyan-200/20 bg-cyan-300/8 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-cyan-100/85">Convenio Kinesiologia</p>
            <p class="text-white text-xl sm:text-2xl leading-none mt-3 tracking-widest" style="font-family: 'Gobold High', sans-serif;">Kinesiosport</p>
            <p class="text-white/88 text-sm sm:text-base font-semibold leading-snug mt-2">Recuerda que tenemos convenio con su centro especializado en recuperacion deportiva.</p>
            <p class="text-cyan-100/70 text-sm sm:text-[15px] mt-1.5">Precio especial por las 10 sesiones para jugadoras Vks</p >
          </div>
          <a
            href="https://www.instagram.com/kinesiosportchile/"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 inline-flex items-center justify-center rounded-full border border-cyan-200/20 bg-white text-slate-900 px-5 py-3 font-bold text-sm hover:bg-cyan-50 transition-colors shadow-lg"
          >
            Ir a Instagram
          </a>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  CakeIcon,
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  TrophyIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  PencilIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  ArrowTopRightOnSquareIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  PercentBadgeIcon,
  CalculatorIcon,
  BellIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
  HomeIcon,
  XMarkIcon as CloseIcon
} from '@heroicons/vue/24/outline';
import { logoutJugadora, jugadoraAuthUser, jugadoraData, actualizarCategoriaSeleccionadaJugadora, obtenerEquiposJugadoraDesdeDatos, fetchJugadorasRegistradasPorEquipo } from '../firebase/jugadorasAuth';
import { userRole } from '../firebase/auth';
import { fetchEntrenamientosPorEquipo, entrenamientos, isLoadingEntrenamientos, escucharEntrenamientosPorEquipo, votarMvpEntrenamiento } from '../firebase/entrenamientos';
import { 
  inscribirseEntrenamiento, 
  desuscribirseEntrenamiento, 
  fetchInscripcionesEntrenamiento,
  estaInscrita as checkInscrita,
  escucharEstadosInscripcionJugadora,
  escucharInscripcionesEntrenamiento,
  cambiarEstadoInscripcion,
  isLoadingInscripciones,
  errorInscripciones
} from '../firebase/inscripciones';
import { escucharFeedbackJugadora, marcarFeedbackComoLeido, agregarReaccionFeedback } from '../firebase/feedback';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { obtenerEventosEspeciales } from '../firebase/eventosEspeciales';
import { obtenerTotalesEstadisticasJugadora } from '../firebase/estadisticas';
import InfoUltimaActualizacion from '../components/InfoUltimaActualizacion.vue';
import CuestionarioSaludSemanal from '../components/CuestionarioSaludSemanal.vue';
import kinesioLogo from '../assets/sponsors/kinesio.png';
import { jugadoraCuentaParaAsistencia, jugadoraExcluidaDeAsistencia, jugadoraPuedeAsistirEntrenamiento, particionarInscripcionesPorAsistencia } from '../utils/disponibilidadEntrenamientos';

const router = useRouter();
const route = useRoute();
const normalizarEquipo = (equipo) => {
  if (!equipo) return '';
  const valor = equipo.toString().trim().toLowerCase();
  // Retornar 'serieC' consistente con el resto del código
  if (valor === 'seriec' || valor === 'serieC') return 'serieC';
  if (valor === 'ascenso' || valor === 'escuela' || valor === 'ambos') return valor;
  return '';
};

const obtenerEquiposDisponibles = (jugadora = jugadoraData.value) => {
  return obtenerEquiposJugadoraDesdeDatos(jugadora);
};

const obtenerEquipoSeleccionadoPermitido = (jugadora = jugadoraData.value, equipoActual = '') => {
  const equiposPermitidos = obtenerEquiposDisponibles(jugadora);
  if (equiposPermitidos.length === 0) {
    return normalizarEquipo(equipoActual) || 'ascenso';
  }

  const categoriaGuardada = normalizarEquipo(jugadora?.categoriaSeleccionada);
  if (equiposPermitidos.includes(categoriaGuardada)) {
    return categoriaGuardada;
  }

  if (categoriaGuardada === 'ambos' && equiposPermitidos.length > 1) {
    return 'ambos';
  }

  const equipoActualNormalizado = normalizarEquipo(equipoActual);
  if (equiposPermitidos.includes(equipoActualNormalizado)) {
    return equipoActualNormalizado;
  }

  if (equipoActualNormalizado === 'ambos' && equiposPermitidos.length > 1) {
    return 'ambos';
  }

  return equiposPermitidos[0];
};

const equipoSeleccionado = ref(obtenerEquipoSeleccionadoPermitido());
const entrenamientoSeleccionadoId = ref(null);
const inscritasEntrenamiento = ref([]);
// Guardar inscripciones organizadas de todos los entrenamientos
const todasInscritasOrganizadas = ref({});
const estadoInscripcion = ref({});
const conteoInscritas = ref({}); // NUEVO: Mapeo de conteos por entrenamiento
const unsubConteosEntrenamientos = ref({});
const toastMensaje = ref(null);
const toastTipo = ref('success');
const mensajeDetalle = ref('');
const tipoMensajeDetalle = ref('success');
const isLoadingAccion = ref(false);
const unsubEntrenamientos = ref(null);
const unsubEstadosInscripcion = ref(null);
const unsubInscripcionesDetalle = ref(null);
const unsubFeedback = ref(null);
const mostrarModalBaja = ref(false);
const motivoBaja = ref('');
const entrenamientoParaBaja = ref(null);
const tabActivo = ref('confirmadas'); // Para el modal de detalles
const cumpleaniosHoy = ref([]); // Cumpleaños de hoy
const proximoCumpleanios = ref([]); // Próximos cumpleaños (mismo día)
const cargandoInscripciones = ref({}); // Estado de carga por entrenamiento
const primeraCarga = ref(true); // Para mostrar loader en primera carga
const mvpVoteLoading = ref(false);
const mapaCargando = ref(false);
const mvpVotoSeleccionado = ref(null);
const mvpGanadoraFotoSeleccionado = ref('');
const mvpGanadoraFotoCargando = ref(false);
const cacheFotosJugadoras = ref({});
const jugadorasDisponiblesMvpSeleccionado = ref([]);
const jugadorasRegistradasPorId = ref(new Map());
const equiposDisponibles = computed(() => obtenerEquiposDisponibles());
const mostrarSelectorEquipos = computed(() => equiposDisponibles.value.length > 1);
const jugadoraRestringidaPorEstado = computed(() => !esAdmin.value && jugadoraExcluidaDeAsistencia(jugadoraData.value));
const mensajeBloqueoPorEstado = computed(() => {
  const estado = formatearEstadoSalud(jugadoraData.value?.estadoSalud);
  return `Tu estado actual es ${estado}. Solo administración puede modificarlo y no puedes anotarte a eventos.`;
});
const bannerMensualidad = ref({
  activo: true,
  mensaje: 'Recuerda el pago de la mensualidad. Gracias a esto seguimos existiendo.'
});
const feedbacks = ref([]);
const mostrarModalFeedback = ref(false);
const feedbackSeleccionado = ref(null);
const isReaccionandoFeedback = ref(false);
let timeoutMensajeDetalle = null;

// Computed para obtener el entrenamiento seleccionado actualizado en tiempo real
const entrenamientoSeleccionado = computed(() => {
  if (!entrenamientoSeleccionadoId.value) return null;
  return entrenamientos.value.find(e => e.id === entrenamientoSeleccionadoId.value) || null;
});

const nombreCompletoJugadora = computed(() => {
  return `${jugadoraData.value?.nombre || ''} ${jugadoraData.value?.apellido || ''}`.trim();
});

const VENTANA_HISTORIAL_MS = 24 * 60 * 60 * 1000;
const DURACION_PARTIDO_DEFAULT_MS = 90 * 60 * 1000;

const esPartidoOAmistoso = (entrenamiento) => {
  const tipo = (entrenamiento?.tipo || '').toString().toLowerCase();
  return tipo === 'partido' || tipo === 'amistoso';
};

const obtenerFechaBaseEntrenamiento = (entrenamiento) => {
  if (!entrenamiento?.fecha) return null;
  const fecha = new Date(entrenamiento.fecha.seconds ? entrenamiento.fecha.seconds * 1000 : entrenamiento.fecha);
  if (Number.isNaN(fecha.getTime())) return null;
  return fecha;
};

const parseHora = (horaTexto = '') => {
  const [horas, minutos] = (horaTexto || '').split(':').map(Number);
  return {
    horas: Number.isFinite(horas) ? horas : 0,
    minutos: Number.isFinite(minutos) ? minutos : 0
  };
};

const obtenerInicioFinEvento = (entrenamiento) => {
  const base = obtenerFechaBaseEntrenamiento(entrenamiento);
  if (!base) return { inicioMs: null, finMs: null };

  const horaTexto = (entrenamiento?.hora || '').toString().trim();
  const horaFinTexto = (entrenamiento?.horaFin || '').toString().trim();
  const partes = horaTexto.split('-').map((p) => p.trim()).filter(Boolean);
  const inicio = new Date(base);
  const fin = new Date(base);

  const inicioHora = parseHora(partes[0] || '00:00');
  inicio.setHours(inicioHora.horas, inicioHora.minutos, 0, 0);

  if (horaFinTexto) {
    const finHora = parseHora(horaFinTexto);
    fin.setHours(finHora.horas, finHora.minutos, 0, 0);
  } else if (partes.length > 1) {
    const finHora = parseHora(partes[1]);
    fin.setHours(finHora.horas, finHora.minutos, 0, 0);
  } else if (esPartidoOAmistoso(entrenamiento)) {
    fin.setTime(inicio.getTime() + DURACION_PARTIDO_DEFAULT_MS);
  } else {
    fin.setTime(inicio.getTime());
  }

  return {
    inicioMs: inicio.getTime(),
    finMs: fin.getTime()
  };
};

const eventoFinalizado = (entrenamiento) => {
  const { finMs } = obtenerInicioFinEvento(entrenamiento);
  if (!Number.isFinite(finMs)) return false;

  return Date.now() > finMs;
};

const mantenerEvento24HorasEnListado = (entrenamiento) => {
  if (esAdmin.value) return true;
  return esPartidoOAmistoso(entrenamiento);
};

const obtenerLimiteListadoMs = (entrenamiento) => {
  const { finMs } = obtenerInicioFinEvento(entrenamiento);
  if (!Number.isFinite(finMs)) return null;

  return finMs + (mantenerEvento24HorasEnListado(entrenamiento) ? VENTANA_HISTORIAL_MS : 0);
};

const eventoVisibleEnListado = (entrenamiento) => {
  const limiteMs = obtenerLimiteListadoMs(entrenamiento);
  if (!Number.isFinite(limiteMs)) return true;

  return Date.now() <= limiteMs;
};

const eventoVisibleEnHistorialAdmin = (entrenamiento) => {
  if (!esAdmin.value) return false;

  const limiteMs = obtenerLimiteListadoMs(entrenamiento);
  if (!Number.isFinite(limiteMs)) return false;

  return Date.now() > limiteMs;
};

// Computed para obtener inscripciones organizadas del entrenamiento seleccionado
const inscritasOrganizadasRaw = computed(() => {
  if (!entrenamientoSeleccionadoId.value) {
    return { confirmadas: [], bajas: [], pendientes: [] };
  }
  return todasInscritasOrganizadas.value[entrenamientoSeleccionadoId.value] || { confirmadas: [], bajas: [], pendientes: [] };
});

const particionInscripcionesSeleccionadas = computed(() => {
  return particionarInscripcionesPorAsistencia(inscritasOrganizadasRaw.value, jugadorasRegistradasPorId.value);
});

const inscritasOrganizadas = computed(() => particionInscripcionesSeleccionadas.value.visibles);
const inscritasExcluidas = computed(() => particionInscripcionesSeleccionadas.value.excluidas);

// Función auxiliar para obtener iniciales
const obtenerIniciales = (nombre) => {
  if (!nombre) return '?';
  const partes = nombre.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

const cargarJugadorasRegistradasMapa = async () => {
  try {
    const jugadoras = await fetchJugadorasRegistradasPorEquipo('ambos');
    jugadorasRegistradasPorId.value = new Map(jugadoras.map((jugadora) => [jugadora.id, jugadora]));
  } catch {
    jugadorasRegistradasPorId.value = new Map();
  }
};

const obtenerEstadoSaludExclusion = (estado) => {
  const map = {
    lesionada: 'Lesionada',
    recuperacion: 'En recuperación',
    vacaciones: 'De vacaciones',
    no_disponible: 'No disponible'
  };

  return map[estado] || 'No disponible';
};

const obtenerEtiquetaEstadoLista = (estadoLista) => {
  const map = {
    confirmadas: 'Confirmada',
    bajas: 'Baja',
    pendientes: 'Pendiente'
  };

  return map[estadoLista] || 'Sin estado';
};

// Verificar autenticación
if (!jugadoraAuthUser.value) {
  console.warn('⚠️ Usuario NO autenticado, redirigiendo a login-jugadora');
  router.push('/login-jugadora');
}

const entrenamientosFiltered = computed(() => {
  const resultado = entrenamientos.value
    .filter((e, index) => {
      // Filtrar por equipo: mostrar si coincide o si es "todos"
      if (e.equipo !== equipoSeleccionado.value && e.equipo !== 'todos') {
        console.log(`[FILTRO] "${e.nombre}" - Excluido: equipo no coincide (${e.equipo} != ${equipoSeleccionado.value})`);
        return false;
      }

      // ✅ Validar disponibilidad por días habilitados (solo si NO es admin)
      if (!esAdmin.value && jugadoraData.value) {
        const puedeAsistir = jugadoraPuedeAsistirEntrenamiento(jugadoraData.value, e);
        if (!puedeAsistir) {
          console.log(`[FILTRO] "${e.nombre}" - EXCLUIDO: Jugadora NO tiene este día habilitado`);
          return false;
        }
        console.log(`[FILTRO] "${e.nombre}" - OK: Jugadora tiene este día habilitado`);
      }

      // Mantener en listado según rol y tipo de evento
      const visible = eventoVisibleEnListado(e);
      if (!visible) {
        console.log(`[FILTRO] "${e.nombre}" - Excluido: No visible en listado (fecha pasada)`);
      }
      return visible;
    })
    .sort((a, b) => {
      // Ordenar por fecha: más próximo primero
      const fechaA = new Date(a.fecha?.seconds ? a.fecha.seconds * 1000 : a.fecha || 0);
      const fechaB = new Date(b.fecha?.seconds ? b.fecha.seconds * 1000 : b.fecha || 0);
      return fechaA.getTime() - fechaB.getTime();
    });

  // Log del estado del filtrado
  if (resultado.length === 0 && entrenamientos.value.length > 0) {
    console.warn(`[FILTRO] ⚠️ NINGÚN ENTRENAMIENTO VISIBLE para ${jugadoraData.value?.nombre} (${equipoSeleccionado.value})`);
    console.warn(`[DEBUG] Disponibilidad: ${JSON.stringify(jugadoraData.value?.disponibilidadEntrenamientos)}`);
  }

  return resultado;
});

const mvpHabilitadoEvento = (entrenamiento) => {
  const mvpRaw = entrenamiento?.mvpHabilitado;
  return mvpRaw === undefined || mvpRaw === null
    ? true
    : (mvpRaw === true || mvpRaw === 'true' || mvpRaw === 1);
};

const mvpCerradaEvento = (entrenamiento) => entrenamiento?.mvpCerrada === true;

const mvpCerradaSeleccionado = computed(() => {
  if (!entrenamientoSeleccionado.value) return false;
  return mvpCerradaEvento(entrenamientoSeleccionado.value);
});

const mvpDisponibleSeleccionado = computed(() => {
  if (!entrenamientoSeleccionado.value) return false;
  return esPartidoOAmistoso(entrenamientoSeleccionado.value)
    && mvpHabilitadoEvento(entrenamientoSeleccionado.value)
    && fechaPasada(entrenamientoSeleccionado.value);
});

const mvpPendienteSeleccionado = computed(() => {
  if (!entrenamientoSeleccionado.value) return false;
  return esPartidoOAmistoso(entrenamientoSeleccionado.value)
    && mvpHabilitadoEvento(entrenamientoSeleccionado.value)
    && !fechaPasada(entrenamientoSeleccionado.value);
});

const mvpDisponibleDesdeTextoSeleccionado = computed(() => {
  if (!entrenamientoSeleccionado.value) return '';
  const { finMs } = obtenerInicioFinEvento(entrenamientoSeleccionado.value);
  if (!Number.isFinite(finMs)) return 'Hora por confirmar';
  return new Date(finMs).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const normalizarNombreMvp = (nombre) => (nombre || '').toString().trim().toLowerCase();

const construirNombreJugadoraMvp = (jugadora = {}) => {
  const nombreCompleto = `${jugadora?.nombre || ''} ${jugadora?.apellido || ''}`.trim();
  return nombreCompleto || (jugadora?.displayName || '').toString().trim();
};

const obtenerJugadorasRegistradasParaMvp = async (equipo) => {
  if (!equipo) return [];

  if (equipo === 'ambos') {
    const [ascenso, escuela] = await Promise.all([
      fetchJugadorasRegistradasPorEquipo('ascenso'),
      fetchJugadorasRegistradasPorEquipo('escuela')
    ]);

    const mapa = new Map();
    [...ascenso, ...escuela].forEach((jugadora) => {
      if (jugadora?.id && !mapa.has(jugadora.id)) {
        mapa.set(jugadora.id, jugadora);
      }
    });

    return [...mapa.values()];
  }

  return fetchJugadorasRegistradasPorEquipo(equipo);
};

const cargarJugadorasDisponiblesMvpSeleccionado = async (equipo) => {
  if (!equipo) {
    jugadorasDisponiblesMvpSeleccionado.value = [];
    return;
  }

  try {
    jugadorasDisponiblesMvpSeleccionado.value = await obtenerJugadorasRegistradasParaMvp(equipo);
  } catch {
    jugadorasDisponiblesMvpSeleccionado.value = [];
  }
};

const candidatasMvpSeleccionado = computed(() => {
  const desdeInscripciones = [
    ...inscritasOrganizadas.value.confirmadas,
    ...inscritasOrganizadas.value.bajas,
    ...inscritasOrganizadas.value.pendientes
  ]
    .map((i) => (i?.jugadoraNombre || '').trim())
    .filter(Boolean);

  return [...new Set(desdeInscripciones)].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
});

const totalVotosMvpSeleccionado = computed(() => {
  if (!Array.isArray(entrenamientoSeleccionado.value?.mvpVotos)) return 0;
  return entrenamientoSeleccionado.value.mvpVotos.reduce((total, item) => total + (Number(item?.votos) || 0), 0);
});

const liderMvpSeleccionado = computed(() => {
  if (rankingMvpSeleccionado.value.length === 0) return null;
  return rankingMvpSeleccionado.value[0];
});

const rankingMvpSeleccionado = computed(() => {
  if (!Array.isArray(entrenamientoSeleccionado.value?.mvpVotos) || entrenamientoSeleccionado.value.mvpVotos.length === 0) return [];
  return [...entrenamientoSeleccionado.value.mvpVotos]
    .sort((a, b) => (Number(b?.votos) || 0) - (Number(a?.votos) || 0))
});

const rankingMvpVisibleSeleccionado = computed(() => {
  if (!mvpCerradaSeleccionado.value) return rankingMvpSeleccionado.value;
  return rankingMvpSeleccionado.value.slice(0, 3);
});

const mvpGanadoraSeleccionado = computed(() => {
  if (!mvpCerradaSeleccionado.value) return null;

  const nombreFinal = (entrenamientoSeleccionado.value?.mvpGanadoraFinal || '').toString().trim();
  if (nombreFinal) {
    const enVotos = Array.isArray(entrenamientoSeleccionado.value?.mvpVotos)
      ? entrenamientoSeleccionado.value.mvpVotos.find(
          (item) => (item?.nombre || '').toString().trim().toLowerCase() === nombreFinal.toLowerCase()
        )
      : null;

    return enVotos || { nombre: nombreFinal, votos: 0 };
  }

  return liderMvpSeleccionado.value;
});

const obtenerFotoCandidataSeleccionada = (nombre) => {
  if (!entrenamientoSeleccionado.value || !nombre) return '';

  const jugadoraRegistrada = jugadorasDisponiblesMvpSeleccionado.value.find(
    (jugadora) => normalizarNombreMvp(construirNombreJugadoraMvp(jugadora)) === normalizarNombreMvp(nombre)
  );

  if (jugadoraRegistrada) {
    return jugadoraRegistrada.fotoPerfil || jugadoraRegistrada.foto || jugadoraRegistrada.photoURL || jugadoraRegistrada.imagen || jugadoraRegistrada.urlFoto || '';
  }

  const convocadas = Array.isArray(entrenamientoSeleccionado.value.jugadorasConvocadas)
    ? entrenamientoSeleccionado.value.jugadorasConvocadas
    : [];

  const candidata = convocadas.find((j) => (j?.nombre || '').trim().toLowerCase() === nombre.trim().toLowerCase());
  if (!candidata) return '';

  return candidata.fotoPerfil || candidata.foto || candidata.imagen || candidata.photoURL || candidata.urlFoto || '';
};

const normalizarNombre = (nombre) => (nombre || '').toString().trim().toLowerCase();

const obtenerJugadoraIdGanadoraSeleccionada = () => {
  const nombreGanadora = normalizarNombre(mvpGanadoraSeleccionado.value?.nombre);
  if (!nombreGanadora) return null;

  const encontradaEnRegistro = jugadorasDisponiblesMvpSeleccionado.value.find(
    (jugadora) => normalizarNombre(construirNombreJugadoraMvp(jugadora)) === nombreGanadora && jugadora?.id
  );

  if (encontradaEnRegistro?.id) return encontradaEnRegistro.id;

  const inscripciones = [
    ...inscritasOrganizadas.value.confirmadas,
    ...inscritasOrganizadas.value.bajas,
    ...inscritasOrganizadas.value.pendientes
  ];

  const encontradaEnInscripciones = inscripciones.find(
    (item) => normalizarNombre(item?.jugadoraNombre) === nombreGanadora && item?.jugadoraId
  );

  if (encontradaEnInscripciones?.jugadoraId) return encontradaEnInscripciones.jugadoraId;

  const convocadas = Array.isArray(entrenamientoSeleccionado.value?.jugadorasConvocadas)
    ? entrenamientoSeleccionado.value.jugadorasConvocadas
    : [];
  const encontradaEnConvocadas = convocadas.find(
    (item) => normalizarNombre(item?.nombre) === nombreGanadora && item?.id
  );

  return encontradaEnConvocadas?.id || null;
};

const obtenerFotoPerfilJugadora = async (jugadoraId) => {
  if (!jugadoraId) return '';
  if (cacheFotosJugadoras.value[jugadoraId]) return cacheFotosJugadoras.value[jugadoraId];

  const snap = await getDoc(doc(db, 'jugadoraRegistro', jugadoraId));
  if (!snap.exists()) return '';

  const data = snap.data() || {};
  const foto = data.fotoPerfil || data.foto || data.photoURL || data.imagen || data.urlFoto || '';
  if (foto) {
    cacheFotosJugadoras.value[jugadoraId] = foto;
  }
  return foto;
};

const resolverFotoMvpGanadoraSeleccionada = async () => {
  mvpGanadoraFotoSeleccionado.value = '';

  if (!mvpGanadoraSeleccionado.value?.nombre) return;

  const fotoConvocada = obtenerFotoCandidataSeleccionada(mvpGanadoraSeleccionado.value.nombre);
  if (fotoConvocada) {
    mvpGanadoraFotoSeleccionado.value = fotoConvocada;
    return;
  }

  const jugadoraId = obtenerJugadoraIdGanadoraSeleccionada();
  if (!jugadoraId) return;

  try {
    mvpGanadoraFotoCargando.value = true;
    const fotoPerfil = await obtenerFotoPerfilJugadora(jugadoraId);
    mvpGanadoraFotoSeleccionado.value = fotoPerfil || '';
  } catch {
    mvpGanadoraFotoSeleccionado.value = '';
  } finally {
    mvpGanadoraFotoCargando.value = false;
  }
};

watch(
  () => [
    entrenamientoSeleccionado.value?.id,
    mvpGanadoraSeleccionado.value?.nombre,
    inscritasOrganizadas.value.confirmadas.length,
    inscritasOrganizadas.value.bajas.length,
    inscritasOrganizadas.value.pendientes.length
  ],
  () => {
    resolverFotoMvpGanadoraSeleccionada();
  },
  { immediate: true }
);

watch(
  () => entrenamientoSeleccionado.value?.equipo,
  (equipo) => {
    cargarJugadorasDisponiblesMvpSeleccionado(equipo || '');
  },
  { immediate: true }
);

const puedeVotarMvpSeleccionado = computed(() => {
  return !!jugadoraAuthUser.value
    && !esAdmin.value
    && mvpDisponibleSeleccionado.value
    && !mvpYaVotadoSeleccionado.value
    && !mvpCerradaSeleccionado.value;
});

const mvpYaVotadoSeleccionado = computed(() => {
  const uid = jugadoraAuthUser.value?.uid;
  if (!uid || !entrenamientoSeleccionado.value) return false;

  const votosRegistrados = entrenamientoSeleccionado.value.mvpVotantes;
  if (!votosRegistrados || typeof votosRegistrados !== 'object') return false;

  return !!votosRegistrados[uid];
});

const cargarVotoMvpSeleccionado = (entrenamientoId) => {
  if (!entrenamientoId) {
    mvpVotoSeleccionado.value = null;
    return;
  }

  const uid = jugadoraAuthUser.value?.uid;
  const votosRegistrados = entrenamientoSeleccionado.value?.mvpVotantes;
  mvpVotoSeleccionado.value = (uid && votosRegistrados && typeof votosRegistrados === 'object')
    ? votosRegistrados[uid]
    : null;
};

const votarMvpSeleccionado = async (jugadoraNombre) => {
  if (!entrenamientoSeleccionado.value?.id || !puedeVotarMvpSeleccionado.value || mvpVoteLoading.value) return;
  if (mvpYaVotadoSeleccionado.value || mvpVotoSeleccionado.value === jugadoraNombre) return;

  mvpVoteLoading.value = true;
  try {
    const votosActualizados = await votarMvpEntrenamiento(
      entrenamientoSeleccionado.value.id,
      jugadoraAuthUser.value.uid,
      jugadoraNombre
    );

    const idx = entrenamientos.value.findIndex(e => e.id === entrenamientoSeleccionado.value.id);
    if (idx !== -1) {
      entrenamientos.value[idx] = {
        ...entrenamientos.value[idx],
        mvpVotos: votosActualizados.mvpVotos,
        mvpVotantes: votosActualizados.mvpVotantes
      };
    }

    mvpVotoSeleccionado.value = jugadoraNombre;
    mostrarToast('¡Tu voto MVP fue registrado!', 'success');
  } catch (err) {
    mostrarToast(err?.message || 'No se pudo registrar el voto MVP', 'error');
  } finally {
    mvpVoteLoading.value = false;
  }
};

const rachaReciente = computed(() => {
  const historialConRespuesta = entrenamientos.value
    .filter(e => e.equipo === equipoSeleccionado.value && (!jugadoraData.value || jugadoraPuedeAsistirEntrenamiento(jugadoraData.value, e)))
    .map(e => {
      const fecha = new Date(e.fecha?.seconds ? e.fecha.seconds * 1000 : e.fecha || 0);
      return {
        id: e.id,
        fechaMs: Number.isNaN(fecha.getTime()) ? 0 : fecha.getTime(),
        estado: estadoInscripcion.value[e.id]
      };
    })
    .filter(item => item.estado === 'confirmada' || item.estado === 'baja')
    .sort((a, b) => b.fechaMs - a.fechaMs);

  if (!historialConRespuesta.length) return null;

  const estadoBase = historialConRespuesta[0].estado;
  let cantidad = 0;

  for (const item of historialConRespuesta) {
    if (item.estado !== estadoBase) break;
    cantidad += 1;
  }

  return {
    estado: estadoBase,
    cantidad
  };
});

const esEntrenamientoContabilizable = (entrenamiento) => {
  if (!entrenamiento || entrenamiento.equipo !== equipoSeleccionado.value) return false;
  return !esPartidoOAmistoso(entrenamiento);
};

const estadisticasJugadora = computed(() => {
  const entrenamientosTemporada = entrenamientos.value.filter(
    (entrenamiento) => esEntrenamientoContabilizable(entrenamiento) && (!jugadoraData.value || jugadoraCuentaParaAsistencia(jugadoraData.value, entrenamiento))
  );
  
  const confirmadas = entrenamientosTemporada.filter(
    (entrenamiento) => estadoInscripcion.value[entrenamiento.id] === 'confirmada'
  ).length;
  
  const total = entrenamientosTemporada.length;
  
  return {
    confirmadas,
    total,
    goles: jugadoraData.value?.goles,
    asistencias: jugadoraData.value?.asistencias
  };
});

const porcentajeAsistencia = computed(() => {
  const { confirmadas, total } = estadisticasJugadora.value;
  if (total === 0) return 0;
  return Math.round((confirmadas / total) * 100);
});

const esAdmin = computed(() => userRole.value === 'admin');

const historialEntrenamientos = computed(() => {
  return entrenamientos.value
    .filter(e => e.equipo === equipoSeleccionado.value && eventoVisibleEnHistorialAdmin(e))
    .sort((a, b) => {
      // Ordenar por fecha: más reciente primero en el historial
      const fechaA = new Date(a.fecha?.seconds ? a.fecha.seconds * 1000 : a.fecha || 0);
      const fechaB = new Date(b.fecha?.seconds ? b.fecha.seconds * 1000 : b.fecha || 0);
      return fechaB.getTime() - fechaA.getTime();
    });
});

const esConvocada = (entrenamiento) => {
  if (!entrenamiento.esConvocatoria) {
    return true; // Si no es convocatoria, todos pueden inscribirse
  }
  if (!entrenamiento.jugadorasConvocadas || !jugadoraAuthUser.value) {
    return false; // Si es convocatoria pero no hay lista o no hay usuario, no puede
  }
  // Verificar si el UID del usuario está en la lista de jugadoras convocadas
  return entrenamiento.jugadorasConvocadas.some(j => j.id === jugadoraAuthUser.value.uid);
};

const isLoading = computed(() => isLoadingEntrenamientos.value);

// Verificar si la fecha del entrenamiento ya pasó
const fechaPasada = (entrenamiento) => {
  const { finMs } = obtenerInicioFinEvento(entrenamiento);
  return Number.isFinite(finMs) ? Date.now() > finMs : false;
};

const cambiarEquipo = (equipo) => {
  primeraCarga.value = true; // Mostrar loader al cambiar equipo
  equipoSeleccionado.value = equipo;
  if (jugadoraAuthUser.value?.uid) {
    actualizarCategoriaSeleccionadaJugadora(jugadoraAuthUser.value.uid, equipo);
  }
  cargarEntrenamientos();
};

const cargarEntrenamientos = () => {
  // Limpiar listener anterior si existe
  if (unsubEntrenamientos.value) {
    unsubEntrenamientos.value();
    unsubEntrenamientos.value = null;
  }
  
  // Limpiar estado de detalle previo
  todasInscritasOrganizadas.value = {};
  cargandoInscripciones.value = {};
  
  // Iniciar listener en tiempo real de entrenamientos
  unsubEntrenamientos.value = escucharEntrenamientosPorEquipo(equipoSeleccionado.value, async () => {
    // Si no hay entrenamientos, ocultar loader inmediatamente
    if (entrenamientos.value.length === 0) {
      primeraCarga.value = false;
      entrenamientoSeleccionadoId.value = null;
      return;
    }

    if (entrenamientoSeleccionadoId.value && !entrenamientos.value.some(e => e.id === entrenamientoSeleccionadoId.value)) {
      entrenamientoSeleccionadoId.value = null;
    }

    if (primeraCarga.value) {
      setTimeout(() => {
        primeraCarga.value = false;
      }, 150);
    }
  });
};

const contarInscritas = (entrenamientoId) => {
  const conteo = conteoInscritas.value[entrenamientoId];
  if (!conteo) return 0;
  return conteo.confirmadas + conteo.bajas + conteo.pendientes;
};

const contarConfirmadas = (entrenamientoId) => {
  return conteoInscritas.value[entrenamientoId]?.confirmadas || 0;
};

const contarExcluidas = (entrenamientoId) => {
  return conteoInscritas.value[entrenamientoId]?.excluidas || 0;
};

const limpiarListenersConteoEntrenamientos = (idsMantener = []) => {
  const idsPermitidos = new Set(idsMantener);

  Object.entries(unsubConteosEntrenamientos.value).forEach(([entrenamientoId, unsubscribe]) => {
    if (idsPermitidos.has(entrenamientoId)) return;

    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }

    delete unsubConteosEntrenamientos.value[entrenamientoId];
  });
};

const sincronizarConteosEntrenamientosVisibles = () => {
  const entrenamientosVisibles = entrenamientosFiltered.value;
  const idsVisibles = entrenamientosVisibles.map((entrenamiento) => entrenamiento.id);

  limpiarListenersConteoEntrenamientos(idsVisibles);

  entrenamientosVisibles.forEach((entrenamiento) => {
    if (unsubConteosEntrenamientos.value[entrenamiento.id]) return;

    unsubConteosEntrenamientos.value[entrenamiento.id] = escucharInscripcionesEntrenamiento(
      entrenamiento.id,
      (organizadas) => {
        const { visibles, excluidas } = particionarInscripcionesPorAsistencia(organizadas, jugadorasRegistradasPorId.value);
        conteoInscritas.value = {
          ...conteoInscritas.value,
          [entrenamiento.id]: {
            confirmadas: visibles.confirmadas.length,
            bajas: visibles.bajas.length,
            pendientes: visibles.pendientes.length,
            excluidas: excluidas.length
          }
        };
      },
      () => entrenamientos.value.find((item) => item.id === entrenamiento.id)
    );
  });
};

const estaInscrita = (entrenamientoId) => {
  const estado = estadoInscripcion.value[entrenamientoId];
  // Considera inscrita si está confirmada (no pendiente ni baja)
  return estado === 'confirmada';
};

const verDetalles = (entrenamiento) => {
  entrenamientoSeleccionadoId.value = entrenamiento.id;
  mapaCargando.value = Boolean(obtenerMapaEmbedUrl(entrenamiento));
  cargarVotoMvpSeleccionado(entrenamiento.id);
  mensajeDetalle.value = '';
};

const limpiarListenerInscripcionesDetalle = () => {
  if (unsubInscripcionesDetalle.value) {
    unsubInscripcionesDetalle.value();
    unsubInscripcionesDetalle.value = null;
  }
};

const suscribirInscripcionesDetalle = (entrenamientoId) => {
  limpiarListenerInscripcionesDetalle();

  if (!entrenamientoId) return;

  cargandoInscripciones.value = {
    ...cargandoInscripciones.value,
    [entrenamientoId]: true
  };

  unsubInscripcionesDetalle.value = escucharInscripcionesEntrenamiento(entrenamientoId, (organizadas) => {
    const { visibles, excluidas } = particionarInscripcionesPorAsistencia(organizadas, jugadorasRegistradasPorId.value);
    conteoInscritas.value[entrenamientoId] = {
      confirmadas: visibles.confirmadas.length,
      bajas: visibles.bajas.length,
      pendientes: visibles.pendientes.length,
      excluidas: excluidas.length
    };

    todasInscritasOrganizadas.value[entrenamientoId] = organizadas;
    cargandoInscripciones.value[entrenamientoId] = false;
  }, () => entrenamientos.value.find(e => e.id === entrenamientoId));
};

const mostrarMensajeDetalle = (mensaje, tipo = 'success') => {
  mensajeDetalle.value = mensaje;
  tipoMensajeDetalle.value = tipo;
  if (timeoutMensajeDetalle) clearTimeout(timeoutMensajeDetalle);
  timeoutMensajeDetalle = setTimeout(() => {
    mensajeDetalle.value = '';
  }, 3000);
};

const handleInscribirse = async (entrenamiento) => {
  if (!jugadoraData.value) return;

  if (jugadoraRestringidaPorEstado.value) {
    mostrarToast(mensajeBloqueoPorEstado.value, 'error');
    return;
  }

  // Bloquear si es convocatoria y no está convocada (excepto admin)
  if (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin.value) {
    mostrarToast('No estás en la lista de convocadas para este partido.', 'error');
    return;
  }
  
  // Validar que tengamos los datos necesarios
  const nombreCompleto = `${jugadoraData.value.nombre || ''} ${jugadoraData.value.apellido || ''}`.trim();
  if (!nombreCompleto) {
    // // console.error('Datos de jugadora incompletos:', jugadoraData.value);
    mostrarToast('Error: datos de perfil incompletos', 'error');
    return;
  }
  
  
  isLoadingAccion.value = true;
  const success = await inscribirseEntrenamiento(
    entrenamiento.id,
    jugadoraAuthUser.value.uid,
    nombreCompleto
  );

  if (success) {
    estadoInscripcion.value = {
      ...estadoInscripcion.value,
      [entrenamiento.id]: 'confirmada'
    };
    mostrarToast('¡Asistencia confirmada!', 'success');
    if (entrenamientoSeleccionadoId.value === entrenamiento.id) {
      mostrarMensajeDetalle('✅ Asistencia confirmada correctamente', 'success');
    }
  } else {
    mostrarToast(errorInscripciones.value || 'Error al inscribirse', 'error');
  }
  isLoadingAccion.value = false;
};

const abrirModalBaja = (entrenamiento) => {
  if (jugadoraRestringidaPorEstado.value) {
    mostrarToast(mensajeBloqueoPorEstado.value, 'error');
    return;
  }

  // Bloquear si es convocatoria y no está convocada (excepto admin)
  if (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin.value) {
    mostrarToast('No estás en la lista de convocadas para este partido.', 'error');
    return;
  }
  entrenamientoParaBaja.value = entrenamiento;
  motivoBaja.value = '';
  mostrarModalBaja.value = true;
};

const cerrarModalBaja = () => {
  mostrarModalBaja.value = false;
  entrenamientoParaBaja.value = null;
  motivoBaja.value = '';
};

const confirmarBaja = async () => {
  if (!entrenamientoParaBaja.value) return;
  
  isLoadingAccion.value = true;
  const success = await desuscribirseEntrenamiento(
    entrenamientoParaBaja.value.id,
    jugadoraAuthUser.value.uid,
    motivoBaja.value
  );

  if (success) {
    estadoInscripcion.value = {
      ...estadoInscripcion.value,
      [entrenamientoParaBaja.value.id]: 'baja'
    };
    mostrarToast('Te diste de baja correctamente', 'success');
    if (entrenamientoSeleccionadoId.value === entrenamientoParaBaja.value.id) {
      mostrarMensajeDetalle('✕ Te diste de baja correctamente', 'error');
    }
    cerrarModalBaja();
  } else {
    mostrarToast(errorInscripciones.value || 'Error al darse de baja', 'error');
  }
  isLoadingAccion.value = false;
};

// Función para que admin cambie el estado de inscripción
const cambiarEstadoJugadora = async (inscripcionId, nuevoEstado) => {
  if (!esAdmin.value) return;
  
  isLoadingAccion.value = true;
  const success = await cambiarEstadoInscripcion(inscripcionId, nuevoEstado);

  if (success) {
    const mensajes = {
      confirmada: 'Jugadora marcada como confirmada',
      baja: 'Jugadora marcada como baja',
      pendiente: 'Jugadora marcada como pendiente'
    };
    mostrarToast(mensajes[nuevoEstado] || 'Estado actualizado', 'success');
  } else {
    mostrarToast('Error al cambiar estado', 'error');
  }
  isLoadingAccion.value = false;
};

const mostrarToast = (mensaje, tipo) => {
  toastMensaje.value = mensaje;
  toastTipo.value = tipo;
  setTimeout(() => {
    toastMensaje.value = null;
  }, 3000);
};

const formatearFecha = (date) => {
  if (!date) return '-';
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatearFechaInscripcion = (date) => {
  if (!date) return '-';
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatearEstadoSalud = (estado) => {
  const map = {
    disponible: 'Disponible',
    lesionada: 'Lesionada',
    recuperacion: 'En recuperación',
    vacaciones: 'De vacaciones',
    no_disponible: 'No disponible'
  };
  return map[estado] || 'Disponible';
};

const obtenerTextoMapa = (entrenamiento) => {
  const ubicacionMapa = (entrenamiento?.ubicacionMapa || '').toString().trim();
  if (ubicacionMapa) return ubicacionMapa;
  return (entrenamiento?.lugar || '').toString().trim();
};

const obtenerMapaUrl = (entrenamiento) => {
  const texto = obtenerTextoMapa(entrenamiento);
  if (!texto) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(texto)}`;
};

const obtenerMapaEmbedUrl = (entrenamiento) => {
  const texto = obtenerTextoMapa(entrenamiento);
  if (!texto) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(texto)}&output=embed`;
};

const abrirMapa = (entrenamiento) => {
  const url = obtenerMapaUrl(entrenamiento);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const cargarBannerMensualidad = async () => {
  try {
    const eventos = await obtenerEventosEspeciales();
    const banner = eventos?.bannerMensualidad || {};
    bannerMensualidad.value = {
      activo: typeof banner?.activo === 'boolean' ? banner.activo : true,
      mensaje: (banner?.mensaje || '').toString().trim() || 'Recuerda el pago de la mensualidad. Gracias a esto seguimos existiendo.'
    };
  } catch {
    bannerMensualidad.value = {
      activo: true,
      mensaje: 'Recuerda el pago de la mensualidad. Gracias a esto seguimos existiendo.'
    };
  }
};

// Función para calcular cumpleaños de hoy y próximos
// Función para calcular similitud de nombres (Levenshtein distance)
const calcularSimilitudNombre = (nombre1, nombre2) => {
  const a = (nombre1 || '').toString().trim().toLowerCase().replace(/[áéíóúñ]/g, c => {
    const map = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' };
    return map[c] || c;
  });
  const b = (nombre2 || '').toString().trim().toLowerCase().replace(/[áéíóúñ]/g, c => {
    const map = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n' };
    return map[c] || c;
  });
  
  if (a === b) return 1.0;
  if (a.length === 0 || b.length === 0) return 0;
  
  const m = a.length;
  const n = b.length;
  const dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[0][i] = i;
  for (let j = 0; j <= n; j++) dp[j][0] = j;
  
  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j][i] = Math.min(
        dp[j][i - 1] + 1,
        dp[j - 1][i] + 1,
        dp[j - 1][i - 1] + costo
      );
    }
  }
  
  const max = Math.max(m, n);
  return 1 - (dp[n][m] / max);
};

const cargarEstadisticasJugadora = async () => {
  if (!jugadoraAuthUser.value?.uid || !jugadoraData.value) return;

  try {
    const totales = await obtenerTotalesEstadisticasJugadora(jugadoraAuthUser.value.uid);
    jugadoraData.value.goles = Number(totales.goles || 0);
    jugadoraData.value.asistencias = Number(totales.asistencias || 0);
  } catch (err) {
    console.error('Error cargando estadísticas de la jugadora:', err);
  }
};

const cargarProximoCumpleanios = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
    const todasJugadoras = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diaHoy = hoy.getDate();
    const mesHoy = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    // Filtrar jugadoras que tengan fecha de nacimiento
    const jugadorasConCumple = todasJugadoras
      .filter(jugadora => jugadora.fechaNacimiento)
      .map(jugadora => {
        const [anioNacimiento, mes, dia] = jugadora.fechaNacimiento.split('-').map(Number);
        
        // Crear fecha del cumpleaños en el año actual
        let fechaCumple = new Date(anioActual, mes - 1, dia);
        fechaCumple.setHours(0, 0, 0, 0);
        
        // Si ya pasó este año, usar el próximo año
        if (fechaCumple < hoy) {
          fechaCumple = new Date(anioActual + 1, mes - 1, dia);
        }
        
        // Calcular edad
        const edad = fechaCumple.getFullYear() - anioNacimiento;
        
        return {
          nombre: `${jugadora.nombre} ${jugadora.apellido}`,
          fechaCumple: fechaCumple,
          dia: dia,
          mes: mes,
          edad: edad,
          anioNacimiento: anioNacimiento
        };
      });

    // Separar cumpleaños de hoy
    const hoyList = jugadorasConCumple.filter(j => j.dia === diaHoy && j.mes === mesHoy);
    
    if (hoyList.length > 0) {
      // Si hay cumpleaños hoy, mostrar solo esos
      cumpleaniosHoy.value = hoyList.map(j => ({
        nombre: j.nombre,
        edad: j.edad,
        fechaFormateada: j.fechaCumple.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long'
        }),
        diasRestantes: 0
      }));
      proximoCumpleanios.value = [];
    } else {
      // Si no hay cumpleaños hoy, buscar los próximos
      cumpleaniosHoy.value = [];
      
      // Ordenar por fecha más próxima
      jugadorasConCumple.sort((a, b) => a.fechaCumple - b.fechaCumple);

      if (jugadorasConCumple.length > 0) {
        const primeraCumple = jugadorasConCumple[0].fechaCumple;
        const diasRestantes = Math.ceil((primeraCumple - hoy) / (1000 * 60 * 60 * 24));
        
        // Obtener todos los cumpleaños del mismo día
        const cumplesMismoDia = jugadorasConCumple.filter(j => 
          j.fechaCumple.getTime() === primeraCumple.getTime()
        );
        
        proximoCumpleanios.value = cumplesMismoDia.map(j => ({
          nombre: j.nombre,
          edad: j.edad,
          fecha: j.fechaCumple,
          diasRestantes: diasRestantes,
          fechaFormateada: j.fechaCumple.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long'
          })
        }));
      }
    }
  } catch (err) {
    console.error('Error cargando cumpleaños:', err);
  }
};

// Funciones para feedback
const feedbacksPendientes = computed(() => 
  feedbacks.value.filter(f => !f.reaccion) // Solo mostrar feedbacks sin respuesta
);

const abrirModalFeedback = async (feedback) => {
  // NO marcar como leído aquí, solo cuando el usuario reacciona
  feedbackSeleccionado.value = feedback;
  mostrarModalFeedback.value = true;
};

const cerrarModalFeedback = () => {
  mostrarModalFeedback.value = false;
  feedbackSeleccionado.value = null;
};

const reaccionarFeedback = async (reaccion) => {
  if (!feedbackSeleccionado.value?.id) return;
  
  isReaccionandoFeedback.value = true;
  try {
    // Guardar que fue confirmado (se registra reaccion + timestamp de reaccionadoAt)
    await agregarReaccionFeedback(feedbackSeleccionado.value.id, reaccion);
    mostrarToast('¡Mensaje confirmado!', 'success');
    
    // Cerrar modal después de 500ms para que se vea el toast
    // El feedback desaparecerá because el listener filtra por reaccion == null
    setTimeout(async () => {
      cerrarModalFeedback();
    }, 500);
  } catch (err) {
    mostrarToast('Error al confirmar: ' + err.message, 'error');
  } finally {
    isReaccionandoFeedback.value = false;
  }
};

const handleLogout = async () => {
  await logoutJugadora();
  router.push('/');
};

onMounted(() => {
  cargarJugadorasRegistradasMapa();
  cargarEntrenamientos();
  cargarBannerMensualidad();
  cargarProximoCumpleanios(); // Cargar el próximo cumpleaños
  cargarEstadisticasJugadora();
});

// Watch para el listener de feedback (se suscribe cuando el UID esté disponible)
watch(
  () => jugadoraAuthUser.value?.uid,
  (uid) => {
    if (unsubEstadosInscripcion.value) {
      unsubEstadosInscripcion.value();
      unsubEstadosInscripcion.value = null;
    }

    estadoInscripcion.value = {};

    if (!uid) return;

    unsubEstadosInscripcion.value = escucharEstadosInscripcionJugadora(uid, (estados) => {
      estadoInscripcion.value = estados;
    });
  },
  { immediate: true }
);

watch(
  () => entrenamientoSeleccionadoId.value,
  (entrenamientoId) => {
    if (!entrenamientoId) {
      limpiarListenerInscripcionesDetalle();
      return;
    }

    suscribirInscripcionesDetalle(entrenamientoId);
  },
  { immediate: true }
);

watch(
  () => entrenamientosFiltered.value.map((entrenamiento) => entrenamiento.id).join('|'),
  () => {
    sincronizarConteosEntrenamientosVisibles();
  },
  { immediate: true }
);

watch(
  () => jugadoraAuthUser.value?.uid,
  (uid) => {
    
    // Limpiar listener anterior si existe
    if (unsubFeedback.value) {
      unsubFeedback.value();
    }
    
    // Suscribirse si hay UID disponible
    if (uid) {
      try {
        unsubFeedback.value = escucharFeedbackJugadora(uid, (data) => {
          feedbacks.value = data;
        });
      } catch (err) {
        console.error('❌ Error al suscribirse al listener de feedback:', err);
      }
    } else {
      console.warn('⚠️ UID no disponible aún en el watch de feedback');
    }
  },
  { immediate: true }
);

watch(
  [
    () => jugadoraData.value?.equipo,
    () => JSON.stringify(jugadoraData.value?.equipos || []),
    () => jugadoraData.value?.categoriaSeleccionada
  ],
  async () => {
    const equipoPermitido = obtenerEquipoSeleccionadoPermitido(jugadoraData.value, equipoSeleccionado.value);
    if (!equipoPermitido) return;

    const huboCambio = equipoSeleccionado.value !== equipoPermitido;
    equipoSeleccionado.value = equipoPermitido;

    if (jugadoraAuthUser.value?.uid && jugadoraData.value?.categoriaSeleccionada !== equipoPermitido) {
      await actualizarCategoriaSeleccionadaJugadora(jugadoraAuthUser.value.uid, equipoPermitido);
    }

    if (huboCambio) {
      primeraCarga.value = true;
      cargarEntrenamientos();
    }
  },
  { immediate: true }
);

// Limpiar listeners cuando se desmonta el componente
onUnmounted(() => {
  if (timeoutMensajeDetalle) {
    clearTimeout(timeoutMensajeDetalle);
    timeoutMensajeDetalle = null;
  }

  // Limpiar listener de entrenamientos
  if (unsubEntrenamientos.value) {
    unsubEntrenamientos.value();
  }

  if (unsubEstadosInscripcion.value) {
    unsubEstadosInscripcion.value();
  }

  limpiarListenerInscripcionesDetalle();
  limpiarListenersConteoEntrenamientos();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.fade-move {
  transition: transform 0.3s ease;
}
</style>
