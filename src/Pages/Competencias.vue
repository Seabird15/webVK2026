<template>
  <div class="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-2" style="font-family: 'Gobold High', sans-serif;">COMPETENCIAS</h1>
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="h-1 w-12 bg-primary rounded-full"></div>
          <p class="text-primary uppercase font-bold text-lg tracking-widest">
          temporada 2026
          </p>
          <div class="h-1 w-12 bg-primary rounded-full"></div>
        </div>
        
        <!-- Botón a Estadísticas -->
        <div class="mt-6">
          <router-link
            to="/estadisticas"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-xl"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Ver Estadísticas por Equipo
          </router-link>
        </div>

        <div class="mt-6 max-w-3xl mx-auto bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 border-2 border-primary rounded-xl px-4 py-4 sm:px-6 sm:py-5 shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
            <div>
              <p class="text-primary text-xs sm:text-sm font-black uppercase tracking-[0.2em]">Gran Final</p>
              <h2 class="text-white text-lg sm:text-2xl font-400" style="font-family: 'Collegiate Black', sans-serif;">
                Verserkers vs Inter Nadas
              </h2>
              <p class="text-white/80 text-sm sm:text-base font-semibold mt-1">Sábado 28 de febrero</p>
            </div>
            <div class="flex flex-col items-start sm:items-end gap-2">
              <button
                @click="reaccionarConFuego"
                :class="[
                  'inline-flex items-center gap-2 px-3 py-2 rounded-lg font-400 text-xs sm:text-sm transition-all duration-200 hover:scale-105',
                  dioFuegoFinal ? 'bg-primary text-black' : 'bg-white/10 text-white border border-primary/50 hover:bg-primary/20'
                ]"
                type="button"
              >
                <span class="text-base" :class="dioFuegoFinal ? 'animate-pulse' : ''">🔥</span>
                <span>{{ dioFuegoFinal ? 'Le di fueguito' : 'Dale fueguito' }}</span>
                <span class="bg-black/20 px-2 py-0.5 rounded-full">{{ fuegitosFinal }}</span>
              </button>
              <p class="text-white/60 text-[11px] sm:text-xs">Toca el fueguito para apoyar la final</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CAMPEONATO INTERNO VIKINGAS 2026 -->
      <div class="mb-8 bg-black border-2 border-primary rounded-lg overflow-hidden">
        <button
          @click="competenciaExpandida = competenciaExpandida === 'interno' ? null : 'interno'"
          class="w-full px-6 py-4 bg-primary-dark flex items-center justify-between hover:bg-primary transition-colors cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <div class="text-left">
              <h2 class="text-2xl tracking-wider font-400 text-white" style="font-family: 'Collegiate Black', sans-serif;">
                1ER CAMPEONATO INTERNO VIKINGAS
              </h2>
              <p class="text-black/70 text-sm">7 de Febrero 2026 • Cancha Tricolor La Florida</p>
            </div>
          </div>
          <svg 
            class="w-6 h-6 text-black transition-transform duration-300"
            :class="competenciaExpandida === 'interno' ? 'rotate-180' : ''"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <div 
          v-show="competenciaExpandida === 'interno'"
          class="p-8"
        >
          <!-- Loading State -->
          <div v-if="loadingCampeonato" class="text-center py-12">
            <div class="inline-block">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
            <p class="text-white/70 mt-4 font-medium">Cargando datos del campeonato...</p>
          </div>

          <div v-else>
          <!-- Info del torneo -->
          <div class="bg-primary/10 border border-primary rounded-lg p-6 mb-8">
            <div class="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p class="text-primary text-sm font-bold mb-1">INICIO</p>
                <p class="text-white font-bold">7 de Febrero 2026</p>
                <p class="text-white/70 text-sm">19:00 hrs</p>
              </div>
              <div>
                <p class="text-primary text-sm font-bold mb-1">LUGAR</p>
                <p class="text-white font-bold">Tricolor La Florida</p>
              </div>
              <div>
                <p class="text-primary text-sm font-bold mb-1">EQUIPOS</p>
                <p class="text-white font-bold">3 Equipos Mixtos</p>
                <p class="text-white/70 text-sm">Escuela + Ascenso</p>
              </div>
            </div>
          </div>

          <!-- Equipos participantes -->
          <div v-if="equipos.verserkers && equipos.internadas && equipos.siemprealpalo">
          <h3 class="text-primary font-bold text-xl mb-6 text-center flex items-center justify-center gap-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0-2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 11c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
            </svg>
            EQUIPOS PARTICIPANTES
          </h3>

          <div class="grid md:grid-cols-3 gap-6">
            <!-- Las Verserkers - EQUIPO 1 -->
            <div class="bg-linear-to-br from-cyan-900/50 to-cyan-700/30 border-2 border-cyan-400 rounded-lg p-6 hover:shadow-xl hover:scale-105 transition-all">
              <div class="flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-white rounded-full p-3 mb-4 shadow-lg">
                  <img src="../assets/versekersLogo.jpeg" alt="Las Versekers" class="w-full h-full object-contain" />
                </div>
                <h4 class="text-2xl font-400 text-white mb-2" style="font-family: 'Collegiate Black', sans-serif;">
                  LAS VERSERKERS
                </h4>
                <div class="flex items-center gap-2 text-cyan-300 mb-4">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span class="text-sm font-bold">Capitana: Barby</span>
                </div>
                <div class="w-full bg-cyan-900/30 rounded-lg p-4 text-left">
                  <p class="text-cyan-200 text-xs font-bold mb-2 uppercase">Plantel ({{ equipos.verserkers?.jugadoras?.length || 0 }} jugadoras)</p>
                  <div class="space-y-2">
                    <!-- Jugadoras con goles -->
                    <div v-if="equipos.verserkers?.jugadoras?.filter(j => j.goles > 0).length > 0" class="mb-3">
                      <p class="text-cyan-300 text-xs font-bold mb-2 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        GOLEADORAS
                      </p>
                      <div class="grid grid-cols-2 gap-2">
                        <div v-for="(jugadora, index) in equipos.verserkers?.jugadoras?.filter(j => j.goles > 0) || []" :key="index" 
                             class="flex items-center justify-between bg-cyan-400/10 px-2 py-1.5 rounded border border-cyan-400/30">
                          <div class="flex items-center gap-1">
                            <svg class="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" v-if="jugadora.capitana"/>
                              <circle cx="12" cy="12" r="3" v-else/>
                            </svg>
                            <span class="text-cyan-100 text-xs" :class="jugadora.capitana ? 'font-bold' : ''">{{ jugadora.nombre }}</span>
                          </div>
                          <span class="text-cyan-400 font-black text-sm">{{ jugadora.goles }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- Resto del plantel -->
                    <div>
                      <p class="text-cyan-200/60 text-xs font-bold mb-2">PLANTEL COMPLETO</p>
                      <div class="grid grid-cols-2 gap-1.5 text-white/70 text-xs">
                        <div v-for="(jugadora, index) in equipos.verserkers?.jugadoras || []" :key="index" class="flex items-center gap-1">
                          <svg class="w-2.5 h-2.5 text-cyan-400/50" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          <span>{{ jugadora.nombre }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-3 text-primary font-bold text-xl">
                  {{ totalGoles('verserkers') }} Goles
                </div>
              </div>
            </div>

            <!-- Inter Nadas - EQUIPO 2 -->
            <div class="bg-linear-to-br from-gray-900/50 to-gray-700/30 border-2 border-gray-400 rounded-lg p-6 hover:shadow-xl hover:scale-105 transition-all">
              <div class="flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-white rounded-full p-3 mb-4 shadow-lg">
                  <img src="../assets/internadasLogo.jpeg" alt="Inter Nadas" class="w-full h-full object-contain" />
                </div>
                <h4 class="text-2xl font-400 text-white mb-2" style="font-family: 'Collegiate Black', sans-serif;">
                  INTER NADAS
                </h4>
                <div class="flex items-center gap-2 text-gray-300 mb-4">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span class="text-sm font-bold">Capitana: Pau Motta</span>
                </div>
                <div class="w-full bg-gray-900/30 rounded-lg p-4 text-left">
                  <p class="text-gray-200 text-xs font-bold mb-2 uppercase">Plantel ({{ equipos.internadas?.jugadoras?.length || 0 }} jugadoras)</p>
                  <div class="space-y-2">
                    <!-- Jugadoras con goles -->
                    <div v-if="equipos.internadas?.jugadoras?.filter(j => j.goles > 0).length > 0" class="mb-3">
                      <p class="text-gray-300 text-xs font-bold mb-2 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        GOLEADORAS
                      </p>
                      <div class="grid grid-cols-2 gap-2">
                        <div v-for="(jugadora, index) in equipos.internadas?.jugadoras?.filter(j => j.goles > 0) || []" :key="index" 
                             class="flex items-center justify-between bg-gray-400/10 px-2 py-1.5 rounded border border-gray-400/30">
                          <div class="flex items-center gap-1">
                            <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" v-if="jugadora.capitana"/>
                              <circle cx="12" cy="12" r="3" v-else/>
                            </svg>
                            <span class="text-gray-100 text-xs" :class="jugadora.capitana ? 'font-bold' : ''">{{ jugadora.nombre }}</span>
                          </div>
                          <span class="text-gray-400 font-black text-sm">{{ jugadora.goles }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- Resto del plantel -->
                    <div>
                      <p class="text-gray-200/60 text-xs font-bold mb-2">PLANTEL COMPLETO</p>
                      <div class="grid grid-cols-2 gap-1.5 text-white/70 text-xs">
                        <div v-for="(jugadora, index) in equipos.internadas?.jugadoras || []" :key="index" class="flex items-center gap-1">
                          <svg class="w-2.5 h-2.5 text-gray-400/50" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          <span>{{ jugadora.nombre }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-3 text-primary font-bold text-xl">
                  {{ totalGoles('internadas') }} Goles
                </div>
              </div>
            </div>

            <!-- Siempre al Palo - EQUIPO 3 -->
            <div class="bg-linear-to-br from-red-900/50 to-red-700/30 border-2 border-red-400 rounded-lg p-6 hover:shadow-xl hover:scale-105 transition-all">
              <div class="flex flex-col items-center text-center">
                <div class="w-20 h-20 bg-white rounded-full p-3 mb-4 shadow-lg">
                  <img src="../assets/siemprealpaloLogo.jpeg" alt="Siempre al Palo" class="w-full h-full object-contain" />
                </div>
                <h4 class="text-2xl font-400 text-white mb-2" style="font-family: 'Collegiate Black', sans-serif;">
                  SIEMPRE AL PALO FC
                </h4>
                <div class="flex items-center gap-2 text-red-300 mb-4">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span class="text-sm font-bold">Capitana: Dany Farias</span>
                </div>
                <div class="w-full bg-red-900/30 rounded-lg p-4 text-left">
                  <p class="text-red-200 text-xs font-bold mb-2 uppercase">Plantel ({{ equipos.siemprealpalo?.jugadoras?.length || 0 }} jugadoras)</p>
                  <div class="space-y-2">
                    <!-- Jugadoras con goles -->
                    <div v-if="equipos.siemprealpalo?.jugadoras?.filter(j => j.goles > 0).length > 0" class="mb-3">
                      <p class="text-red-300 text-xs font-bold mb-2 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        GOLEADORAS
                      </p>
                      <div class="grid grid-cols-2 gap-2">
                        <div v-for="(jugadora, index) in equipos.siemprealpalo?.jugadoras?.filter(j => j.goles > 0) || []" :key="index" 
                             class="flex items-center justify-between bg-red-400/10 px-2 py-1.5 rounded border border-red-400/30">
                          <div class="flex items-center gap-1">
                            <svg class="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" v-if="jugadora.capitana"/>
                              <circle cx="12" cy="12" r="3" v-else/>
                            </svg>
                            <span class="text-red-100 text-xs" :class="jugadora.capitana ? 'font-bold' : ''">{{ jugadora.nombre }}</span>
                          </div>
                          <span class="text-red-400 font-black text-sm">{{ jugadora.goles }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- Resto del plantel -->
                    <div>
                      <p class="text-red-200/60 text-xs font-bold mb-2">PLANTEL COMPLETO</p>
                      <div class="grid grid-cols-2 gap-1.5 text-white/70 text-xs">
                        <div v-for="(jugadora, index) in equipos.siemprealpalo?.jugadoras || []" :key="index" class="flex items-center gap-1">
                          <svg class="w-2.5 h-2.5 text-red-400/50" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          <span>{{ jugadora.nombre }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-3 text-primary font-bold text-xl">
                  {{ totalGoles('siemprealpalo') }} Goles
                </div>
              </div>
            </div>
          </div>
          </div>

          <!-- Tabla General de Goleadoras -->
          <div class="mt-8">
            <div class="bg-black border-2 border-primary rounded-lg overflow-hidden">
              <button
                @click="mostrarTablaGoleadoras = !mostrarTablaGoleadoras"
                class="w-full px-6 py-3 bg-primary-dark flex items-center justify-between hover:bg-primary transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <div class="text-left">
                    <h2 class="text-xl font-400 tracking-wider text-white" style="font-family: 'Collegiate Black', sans-serif;">
                      TABLA DE GOLEADORAS
                    </h2>
                    <p class="text-black/70 text-xs">Rankings individuales por goles anotados</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-black font-bold text-xs bg-black/20 px-3 py-1 rounded-full">
                    {{ tablaGoleadoras.length }} {{ tablaGoleadoras.length === 1 ? 'goleadora' : 'goleadoras' }}
                  </span>
                  <svg 
                    class="w-5 h-5 text-black transition-transform duration-300"
                    :class="mostrarTablaGoleadoras ? 'rotate-180' : ''"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              <div v-show="mostrarTablaGoleadoras" class="p-6 bg-linear-to-br from-black via-gray-900 to-black">
                <!-- Última actualización -->
                <div class="mb-4 text-center">
                  <p class="text-white/60 text-xs">
                    Última actualización: <span class="text-primary font-bold">{{ formatLastUpdate() }}</span>
                  </p>
                </div>

                <!-- Mensaje si no hay goleadoras -->
                <div v-if="tablaGoleadoras.length === 0" class="text-center py-12">
                  <svg class="w-16 h-16 text-white/20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  <p class="text-white/60 text-lg font-medium">Aún no hay goles registrados</p>
                  <p class="text-white/40 text-sm mt-2">Los goles se mostrarán aquí una vez que comience el torneo</p>
                </div>

                <!-- Tabla completa de goleadoras -->
                <div v-if="tablaGoleadoras.length > 0" class="bg-black/50 rounded-lg border border-primary/30 overflow-hidden shadow-2xl">
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead>
                        <tr class="bg-primary/10 border-b border-primary/30">
                          <th class="px-3 py-2 text-center text-primary font-bold text-xs uppercase tracking-wider">#</th>
                          <th class="px-3 py-2 text-left text-primary font-bold text-xs uppercase tracking-wider">Jugadora</th>
                          <th class="px-3 py-2 text-left text-primary font-bold text-xs uppercase tracking-wider">Equipo</th>
                          <th class="px-3 py-2 text-center text-primary font-bold text-xs uppercase tracking-wider">Goles</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="(jugadora, index) in tablaGoleadoras" 
                          :key="index"
                          class="border-b border-white/5 transition-all duration-200"
                          :class="{
                            'bg-linear-to-r from-yellow-400/15 via-yellow-500/5 to-transparent hover:from-yellow-400/20 border-l-4 border-l-yellow-400': index === 0,
                            'bg-linear-to-r from-gray-300/15 via-gray-400/5 to-transparent hover:from-gray-300/20 border-l-4 border-l-gray-300': index === 1,
                            'bg-linear-to-r from-orange-400/15 via-orange-500/5 to-transparent hover:from-orange-400/20 border-l-4 border-l-orange-400': index === 2,
                            'hover:bg-primary/5': index > 2
                          }"
                        >
                          <td class="px-3 py-3 text-center">
                            <!-- 1er Lugar -->
                            <div v-if="index === 0" class="flex items-center justify-center">
                              <svg class="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                              </svg>
                            </div>
                            <!-- 2do Lugar -->
                            <div v-else-if="index === 1" class="flex items-center justify-center">
                              <svg class="w-7 h-7 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                              </svg>
                            </div>
                            <!-- 3er Lugar -->
                            <div v-else-if="index === 2" class="flex items-center justify-center">
                              <svg class="w-7 h-7 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                              </svg>
                            </div>
                            <!-- Resto -->
                            <span v-else class="text-white/60 text-sm font-semibold">{{ index + 1 }}</span>
                          </td>
                          <td class="px-3 py-3">
                            <div class="flex items-center gap-2">
                              <span 
                                class="font-bold text-sm"
                                :class="{
                                  'text-yellow-400': index === 0,
                                  'text-gray-300': index === 1,
                                  'text-orange-300': index === 2,
                                  'text-white': index > 2
                                }"
                              >
                                {{ jugadora.nombre }}
                              </span>
                              <span v-if="jugadora.capitana" class="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">C</span>
                            </div>
                          </td>
                          <td class="px-3 py-3">
                            <span 
                              class="text-xs font-semibold whitespace-nowrap px-2 py-1 rounded-full"
                              :class="{
                                'text-cyan-300 bg-cyan-400/15 border border-cyan-400/30': jugadora.color === 'cyan',
                                'text-gray-300 bg-gray-400/15 border border-gray-400/30': jugadora.color === 'gray',
                                'text-red-300 bg-red-400/15 border border-red-400/30': jugadora.color === 'red'
                              }"
                            >
                              {{ jugadora.equipo }}
                            </span>
                          </td>
                          <td class="px-3 py-3 text-center">
                            <div class="inline-flex items-center gap-1">
                              <svg class="w-4 h-4" 
                                :class="{
                                  'text-yellow-400': index === 0,
                                  'text-gray-300': index === 1,
                                  'text-orange-300': index === 2,
                                  'text-primary': index > 2
                                }"
                                fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/>
                              </svg>
                              <span 
                                class="font-black text-lg"
                                :class="{
                                  'text-yellow-400': index === 0,
                                  'text-gray-300': index === 1,
                                  'text-orange-300': index === 2,
                                  'text-primary': index > 2
                                }"
                              >
                                {{ jugadora.goles }}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel de Administración de Goles (Solo Admin) -->
          <div v-if="isAdmin && equipos.verserkers && equipos.internadas && equipos.siemprealpalo" class="mt-8 bg-primary-dark rounded-lg p-6 border-2 border-primary">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-black font-bold text-xl flex items-center gap-2">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                PANEL DE GOLES - ADMINISTRADOR
                <span v-if="guardandoGol" class="ml-2 inline-flex items-center gap-1 text-xs bg-black/30 text-black px-2 py-1 rounded">
                  <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              </h3>
              <button
                @click="mostrarPanelGoles = !mostrarPanelGoles"
                class="bg-black hover:bg-black/80 text-primary px-4 py-2 rounded font-bold transition text-sm"
              >
                {{ mostrarPanelGoles ? 'Ocultar' : 'Mostrar' }} Panel
              </button>
            </div>
            
            <div v-show="mostrarPanelGoles" class="grid md:grid-cols-3 gap-6">
              <!-- Verserkers -->
              <div class="bg-black/50 rounded-lg p-4 border-2 border-cyan-400">
                <h4 class="text-cyan-400 font-bold mb-4 text-center">LAS VERSERKERS</h4>
                <div class="space-y-2">
                  <div v-for="(jugadora, index) in equipos.verserkers?.jugadoras || []" :key="index" 
                       class="flex items-center justify-between bg-white/5 p-2 rounded">
                    <span class="text-white text-sm">{{ jugadora.nombre }}</span>
                    <div class="flex items-center gap-2">
                      <button
                        @click="restarGol('verserkers', index)"
                        class="bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="jugadora.goles === 0 || guardandoGol"
                      >-</button>
                      <span class="text-primary font-bold w-8 text-center">{{ jugadora.goles }}</span>
                      <button
                        @click="agregarGol('verserkers', index)"
                        class="bg-green-500 hover:bg-green-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="guardandoGol"
                      >+</button>
                    </div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t-2 border-cyan-400 text-center">
                  <span class="text-cyan-400 font-bold">Total: {{ totalGoles('verserkers') }} goles</span>
                </div>
              </div>

              <!-- Inter Nadas -->
              <div class="bg-black/50 rounded-lg p-4 border-2 border-gray-400">
                <h4 class="text-gray-400 font-bold mb-4 text-center">INTER NADAS</h4>
                <div class="space-y-2">
                  <div v-for="(jugadora, index) in equipos.internadas?.jugadoras || []" :key="index" 
                       class="flex items-center justify-between bg-white/5 p-2 rounded">
                    <span class="text-white text-sm">{{ jugadora.nombre }}</span>
                    <div class="flex items-center gap-2">
                      <button
                        @click="restarGol('internadas', index)"
                        class="bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="jugadora.goles === 0 || guardandoGol"
                      >-</button>
                      <span class="text-primary font-bold w-8 text-center">{{ jugadora.goles }}</span>
                      <button
                        @click="agregarGol('internadas', index)"
                        class="bg-green-500 hover:bg-green-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="guardandoGol"
                      >+</button>
                    </div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t-2 border-gray-400 text-center">
                  <span class="text-gray-400 font-bold">Total: {{ totalGoles('internadas') }} goles</span>
                </div>
              </div>

              <!-- Siempre al Palo -->
              <div class="bg-black/50 rounded-lg p-4 border-2 border-red-400">
                <h4 class="text-red-400 font-bold mb-4 text-center">SIEMPRE AL PALO FC</h4>
                <div class="space-y-2">
                  <div v-for="(jugadora, index) in equipos.siemprealpalo?.jugadoras || []" :key="index" 
                       class="flex items-center justify-between bg-white/5 p-2 rounded">
                    <span class="text-white text-sm">{{ jugadora.nombre }}</span>
                    <div class="flex items-center gap-2">
                      <button
                        @click="restarGol('siemprealpalo', index)"
                        class="bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="jugadora.goles === 0 || guardandoGol"
                      >-</button>
                      <span class="text-primary font-bold w-8 text-center">{{ jugadora.goles }}</span>
                      <button
                        @click="agregarGol('siemprealpalo', index)"
                        class="bg-green-500 hover:bg-green-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="guardandoGol"
                      >+</button>
                    </div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t-2 border-red-400 text-center">
                  <span class="text-red-400 font-bold">Total: {{ totalGoles('siemprealpalo') }} goles</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón Admin: Inicializar Fecha 2 -->
          <div v-if="isAdmin && !fechasOrdenadas.includes(2)" class="mt-8 text-center">
            <button
              @click="iniciarFecha2"
              :disabled="inicializandoFecha2"
              class="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="inicializandoFecha2">Inicializando...</span>
              <span v-else>➕ Inicializar Fecha 2</span>
            </button>
          </div>

          <!-- Botón Admin: Inicializar Fecha 3 -->
          <div v-if="isAdmin" class="mt-4 text-center">
            <button
              @click="iniciarFecha3"
              :disabled="inicializandoFecha3 || tieneFecha3"
              class="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="inicializandoFecha3">Inicializando...</span>
              <span v-else-if="tieneFecha3">✅ Fecha 3 ya inicializada</span>
              <span v-else>➕ Inicializar Fecha 3 (Hoy)</span>
            </button>
          </div>

          <!-- Resultados por Fecha (Dinámico) -->
          <div v-for="numeroFecha in fechasOrdenadas" :key="`fecha-${numeroFecha}`" class="bg-black border-2 border-primary rounded-lg p-4 sm:p-8 mt-8">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center flex items-center justify-center gap-2 sm:gap-3" style="font-family: 'Collegiate Black', sans-serif;">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v2h2v-2m4 0h-2v2h2v-2m4 0h-2v2h2v-2m2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V9h14v11z"/>
              </svg>
              <span class="hidden sm:inline">{{ obtenerTituloFecha(numeroFecha) }}</span>
              <span class="sm:hidden">FECHA {{ numeroFecha }}</span>
            </h2>
            
            <!-- Estado de la fecha -->
            <div class="text-center mb-4">
              <span 
                :class="['inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold', obtenerEstadoFecha(partidosPorFecha[numeroFecha]).class]"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                {{ obtenerEstadoFecha(partidosPorFecha[numeroFecha]).text }}
              </span>
            </div>
            
            <!-- Panel de Administración de Resultados (Solo Admin) -->
            <div v-if="isAdmin" class="mb-6 bg-primary/20 border-2 border-primary rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-primary font-bold text-sm flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  MODO EDICIÓN (ADMIN)
                </h3>
                <span v-if="editandoResultado" class="text-xs bg-black/30 text-primary px-2 py-1 rounded flex items-center gap-1">
                  <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              </div>
              <p class="text-primary/80 text-xs">Haz clic en "Editar" o en los botones de estado para modificar los partidos</p>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <!-- Partidos dinámicos desde Firebase -->
              <div v-for="partido in partidosPorFecha[numeroFecha]" :key="partido.id" class="bg-linear-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 border-2 border-primary rounded-lg p-3 sm:p-6">
                <div class="flex items-center justify-between mb-3 sm:mb-4">
                  <div class="flex items-center gap-1 sm:gap-2 text-primary">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                    <span class="font-bold text-xs sm:text-sm">{{ partido.horario }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span 
                      :class="['text-xs font-bold px-2 sm:px-3 py-1 rounded-full', obtenerEstadoBadge(partido).class]"
                    >
                      {{ obtenerEstadoBadge(partido).text }}
                    </span>
                    
                    <!-- Botones de admin -->
                    <div v-if="isAdmin && !partidoEditando" class="flex gap-1">
                      <button
                        v-if="partido.estado !== 'EN_CURSO'"
                        @click="cambiarEstadoPartido(partido.id, 'EN_CURSO')"
                        class="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded text-xs font-bold transition"
                        title="Iniciar partido"
                      >
                        ▶
                      </button>
                      <button
                        v-if="partido.estado === 'EN_CURSO'"
                        @click="cambiarEstadoPartido(partido.id, 'FINALIZADO')"
                        class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-bold transition"
                        title="Finalizar partido"
                      >
                        ✓
                      </button>
                      <button
                        @click="editarResultado(partido)"
                        class="bg-primary hover:bg-primary/80 text-black px-2 py-1 rounded text-xs font-bold transition"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Vista normal del partido -->
                <div v-if="!partidoEditando || partidoEditando.id !== partido.id" class="space-y-3">
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                    <div class="flex items-center gap-2 sm:gap-3 flex-1">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-2 shrink-0">
                        <img :src="resolverLogoEquipo(obtenerDatosEquipo(partido.equipoLocal).logo)" :alt="obtenerDatosEquipo(partido.equipoLocal).nombre" class="w-full h-full object-contain" />
                      </div>
                      <span 
                        class="font-bold text-sm sm:text-lg"
                        :class="partido.golesLocal > partido.golesVisita ? 'text-primary' : 'text-white/70'"
                      >
                        {{ obtenerDatosEquipo(partido.equipoLocal).nombre }}
                      </span>
                    </div>
                    <div class="flex items-center gap-3 sm:gap-4">
                      <span 
                        class="font-black text-2xl sm:text-3xl"
                        :class="partido.golesLocal > partido.golesVisita ? 'text-primary' : 'text-white/70'"
                      >
                        {{ partido.golesLocal }}
                      </span>
                      <span class="text-primary/50 font-bold text-lg">-</span>
                      <span 
                        class="font-black text-2xl sm:text-3xl"
                        :class="partido.golesVisita > partido.golesLocal ? 'text-primary' : 'text-white/70'"
                      >
                        {{ partido.golesVisita }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                      <span 
                        class="font-bold text-sm sm:text-lg text-right"
                        :class="partido.golesVisita > partido.golesLocal ? 'text-primary' : 'text-white/70'"
                      >
                        {{ obtenerDatosEquipo(partido.equipoVisita).nombre }}
                      </span>
                      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-2 shrink-0">
                        <img :src="resolverLogoEquipo(obtenerDatosEquipo(partido.equipoVisita).logo)" :alt="obtenerDatosEquipo(partido.equipoVisita).nombre" class="w-full h-full object-contain" />
                      </div>
                    </div>
                  </div>

                  <div v-if="partido.empate" class="bg-yellow-500/10 border border-yellow-400/40 rounded-lg p-3 text-center">
                    <p class="text-yellow-300 text-xs font-bold uppercase tracking-wide mb-1">Definición por penales</p>
                    <p class="text-white text-sm font-bold">
                      {{ obtenerDatosEquipo(partido.equipoLocal).nombre }} {{ partido.penalesLocal || 0 }} - {{ partido.penalesVisita || 0 }} {{ obtenerDatosEquipo(partido.equipoVisita).nombre }}
                    </p>
                    <p v-if="partido.ganadorPenales" class="text-primary text-xs font-bold mt-1">
                      Ganador: {{ obtenerDatosEquipo(partido.ganadorPenales).nombre }}
                    </p>
                  </div>
                </div>
                
                <!-- Modo de edición (solo admin) -->
                <div v-else class="space-y-4">
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div class="flex items-center gap-2 sm:gap-3 flex-1">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-2 shrink-0">
                        <img :src="resolverLogoEquipo(obtenerDatosEquipo(partido.equipoLocal).logo)" :alt="obtenerDatosEquipo(partido.equipoLocal).nombre" class="w-full h-full object-contain" />
                      </div>
                      <span class="text-white font-bold text-sm sm:text-lg">{{ obtenerDatosEquipo(partido.equipoLocal).nombre }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <button
                        @click="decrementarGol('local')"
                        :disabled="partidoEditando.golesLocalEdit === 0"
                        class="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >-</button>
                      <span class="text-primary font-black text-3xl w-12 text-center">{{ partidoEditando.golesLocalEdit }}</span>
                      <button
                        @click="incrementarGol('local')"
                        class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded font-bold transition"
                      >+</button>
                    </div>
                  </div>
                  
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div class="flex items-center gap-2 sm:gap-3 flex-1">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-2 shrink-0">
                        <img :src="resolverLogoEquipo(obtenerDatosEquipo(partido.equipoVisita).logo)" :alt="obtenerDatosEquipo(partido.equipoVisita).nombre" class="w-full h-full object-contain" />
                      </div>
                      <span class="text-white font-bold text-sm sm:text-lg">{{ obtenerDatosEquipo(partido.equipoVisita).nombre }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <button
                        @click="decrementarGol('visita')"
                        :disabled="partidoEditando.golesVisitaEdit === 0"
                        class="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >-</button>
                      <span class="text-primary font-black text-3xl w-12 text-center">{{ partidoEditando.golesVisitaEdit }}</span>
                      <button
                        @click="incrementarGol('visita')"
                        class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded font-bold transition"
                      >+</button>
                    </div>
                  </div>

                  <div class="bg-black/30 border border-primary/20 rounded-lg p-3 space-y-3">
                    <label class="flex items-center gap-2 text-sm font-bold text-primary cursor-pointer">
                      <input
                        v-model="partidoEditando.empateEdit"
                        type="checkbox"
                        class="w-4 h-4"
                      />
                      Definido por penales (empate en tiempo regular)
                    </label>

                    <div v-if="partidoEditando.empateEdit" class="space-y-3">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="bg-white/5 rounded p-2">
                          <p class="text-white/70 text-xs mb-2">Penales {{ obtenerDatosEquipo(partido.equipoLocal).nombre }}</p>
                          <div class="flex items-center justify-center gap-2">
                            <button
                              @click="decrementarPenal('local')"
                              :disabled="partidoEditando.penalesLocalEdit === 0"
                              class="bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >-</button>
                            <span class="text-primary font-black text-2xl w-10 text-center">{{ partidoEditando.penalesLocalEdit }}</span>
                            <button
                              @click="incrementarPenal('local')"
                              class="bg-green-500 hover:bg-green-600 text-white w-7 h-7 rounded font-bold transition"
                            >+</button>
                          </div>
                        </div>
                        <div class="bg-white/5 rounded p-2">
                          <p class="text-white/70 text-xs mb-2">Penales {{ obtenerDatosEquipo(partido.equipoVisita).nombre }}</p>
                          <div class="flex items-center justify-center gap-2">
                            <button
                              @click="decrementarPenal('visita')"
                              :disabled="partidoEditando.penalesVisitaEdit === 0"
                              class="bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >-</button>
                            <span class="text-primary font-black text-2xl w-10 text-center">{{ partidoEditando.penalesVisitaEdit }}</span>
                            <button
                              @click="incrementarPenal('visita')"
                              class="bg-green-500 hover:bg-green-600 text-white w-7 h-7 rounded font-bold transition"
                            >+</button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p class="text-white/70 text-xs mb-2">Ganador por penales</p>
                        <div class="flex flex-wrap gap-2">
                          <button
                            @click="seleccionarGanadorPenales(partido.equipoLocal)"
                            :class="[
                              'px-3 py-1.5 rounded text-xs font-bold transition',
                              partidoEditando.ganadorPenalesEdit === partido.equipoLocal
                                ? 'bg-primary text-black'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            ]"
                          >
                            {{ obtenerDatosEquipo(partido.equipoLocal).nombre }}
                          </button>
                          <button
                            @click="seleccionarGanadorPenales(partido.equipoVisita)"
                            :class="[
                              'px-3 py-1.5 rounded text-xs font-bold transition',
                              partidoEditando.ganadorPenalesEdit === partido.equipoVisita
                                ? 'bg-primary text-black'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            ]"
                          >
                            {{ obtenerDatosEquipo(partido.equipoVisita).nombre }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      @click="cancelarEdicion"
                      class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-bold transition text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      @click="guardarResultado(partido.id)"
                      :disabled="editandoResultado"
                      class="bg-primary hover:bg-primary/80 text-black px-4 py-2 rounded font-bold transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Posiciones (solo se muestra una vez al final) -->
            <div v-if="numeroFecha === fechasOrdenadas[fechasOrdenadas.length - 1]" class="mt-6 bg-black/50 border-2 border-primary/50 rounded-lg overflow-hidden shadow-lg">
              <div class="bg-primary/20 px-4 py-2 border-b border-primary/50">
                <h3 class="text-primary font-bold text-sm text-center flex items-center justify-center gap-2 uppercase tracking-wider">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  Tabla de Posiciones
                </h3>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-primary/10 border-b border-primary/30">
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs uppercase">#</th>
                      <th class="px-2 py-2 text-left text-primary font-bold text-xs uppercase">Equipo</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">PJ</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">G</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">E</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">P</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">GF</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">GC</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">DG</th>
                      <th class="px-2 py-2 text-center text-primary font-bold text-xs">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(equipo, index) in tablaPosiciones" 
                      :key="equipo.key"
                      class="border-b border-white/5 hover:bg-primary/5 transition-all border-l-4"
                      :class="[
                        index === 0 ? 'bg-linear-to-r from-yellow-400/10 to-transparent' : '',
                        index === 1 ? 'bg-linear-to-r from-gray-300/10 to-transparent' : '',
                        index === 2 ? 'bg-linear-to-r from-orange-400/10 to-transparent' : '',
                        obtenerColorBorde(equipo)
                      ]"
                    >
                      <td class="px-2 py-2 text-center">
                        <svg 
                          v-if="index < 3" 
                          class="w-6 h-6 mx-auto" 
                          :class="[
                            index === 0 ? 'text-yellow-400' : '',
                            index === 1 ? 'text-gray-300' : '',
                            index === 2 ? 'text-orange-400' : ''
                          ]"
                          fill="currentColor" viewBox="0 0 24 24"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        <span v-else class="text-white/70">{{ index + 1 }}</span>
                      </td>
                      <td class="px-2 py-2">
                        <div class="flex items-center gap-2">
                          <div class="w-5 h-5 bg-white rounded-full p-0.5 shrink-0">
                            <img :src="resolverLogoEquipo(equipo.logo)" :alt="equipo.nombre" class="w-full h-full object-contain" />
                          </div>
                          <span class="text-white font-bold text-xs">{{ equipo.nombre }}</span>
                        </div>
                      </td>
                      <td class="px-2 py-2 text-center text-white/70 font-medium text-xs">{{ equipo.pj }}</td>
                      <td class="px-2 py-2 text-center text-primary font-bold text-xs">{{ equipo.pg }}</td>
                      <td class="px-2 py-2 text-center text-yellow-300 font-bold text-xs">{{ equipo.pe || 0 }}</td>
                      <td class="px-2 py-2 text-center text-red-400 font-bold text-xs">{{ equipo.pp }}</td>
                      <td class="px-2 py-2 text-center text-white/70 font-medium text-xs">{{ equipo.gf }}</td>
                      <td class="px-2 py-2 text-center text-white/70 font-medium text-xs">{{ equipo.gc }}</td>
                      <td class="px-2 py-2 text-center font-bold text-xs" :class="equipo.dg >= 0 ? 'text-primary' : 'text-red-400'">
                        {{ equipo.dg >= 0 ? '+' : '' }}{{ equipo.dg }}
                      </td>
                      <td class="px-2 py-2 text-center text-primary font-bold text-base">{{ equipo.pts }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="bg-primary/10 px-3 py-1.5 border-t border-primary/30">
                <p class="text-white/60 text-xs text-center leading-relaxed">
                  <span class="font-semibold text-white">PJ:</span> Partidos Jugados • 
                  <span class="font-semibold text-white">G:</span> Ganados • 
                  <span class="font-semibold text-white">E:</span> Empatados • 
                  <span class="font-semibold text-white">P:</span> Perdidos • 
                  <span class="font-semibold text-white">GF:</span> Goles a Favor • 
                  <span class="font-semibold text-white">GC:</span> Goles en Contra • 
                  <span class="font-semibold text-white">DG:</span> Diferencia de Goles • 
                  <span class="font-semibold text-white">PTS:</span> Puntos
                </p>
              </div>
            </div>

            <!-- Información de la sede -->
            <div class="mt-4 sm:mt-6 bg-primary-dark rounded-lg p-3 sm:p-4 border-2 border-primary">
              <div class="flex items-center justify-center gap-2 sm:gap-3 text-black">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="font-bold text-sm sm:text-lg">Cancha Tricolor La Florida</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- LIGA DOBLEVE VERANO 2026 -->
      <div class="mb-8 bg-black border-2 border-primary rounded-lg overflow-hidden">
        <button
          @click="competenciaExpandida = competenciaExpandida === 'verano' ? null : 'verano'"
          class="w-full px-6 py-4 bg-primary-dark flex items-center justify-between hover:bg-primary transition-colors cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <div class="text-left">
              <h2 class="text-2xl font400 tracking-wider text-white" style="font-family: 'Collegiate Black', sans-serif;">
                LIGADOBLEVE SUMMER CUP 2026
              </h2>
              <p class="text-black/70 text-sm">🥇 Campeonas Serie AB+ • Vikingas Ascenso • Enero 2026</p>
            </div>
          </div>
          <svg 
            class="w-6 h-6 text-black transition-transform duration-300"
            :class="competenciaExpandida === 'verano' ? 'rotate-180' : ''"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <div 
          v-show="competenciaExpandida === 'verano'"
          class="p-8"
        >

      <!-- Loading State -->
      <!-- <div v-if="loading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p class="text-white/70 mt-4 font-medium">Cargando tabla de posiciones...</p>
      </div>

      <div v-else-if="error" class="bg-red-900/20 border border-primary text-primary px-6 py-4 rounded-lg mb-6">
        <h3 class="font-bold mb-2 text-white">Error al cargar los datos</h3>
        <p class="text-sm mb-4">{{ error }}</p>
        <button 
          @click="fetchTabla"
          class="bg-primary hover:bg-primary/80 text-black px-4 py-2 rounded font-bold transition cursor-pointer"
        >
          Intentar de nuevo
        </button>
      </div>

      <div v-else class="bg-black  border-2 border-primary rounded-lg shadow-2xl overflow-hidden">
        <div class="bg-primary-dark px-6 py-3 border-b-2 border-primary">
          <p class="text-black font-bold text-sm">
            Última actualización: {{ formatDate(lastUpdate) }}
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-primary-dark border-b-2 border-primary">
                <th class="px-4 py-4 text-left text-black font-bold">#</th>
                <th class="px-4 py-4 text-left text-black font-bold">EQUIPO</th>
                <th class="px-4 py-4 text-center text-black font-bold">PJ</th>
                <th class="px-4 py-4 text-center text-black font-bold">PG</th>
                <th class="px-4 py-4 text-center text-black font-bold">PE</th>
                <th class="px-4 py-4 text-center text-black font-bold">PP</th>
                <th class="px-4 py-4 text-center text-black font-bold">DG</th>
                <th class="px-4 py-4 text-center text-black font-bold">Pts</th>
                <th class="px-4 py-4 text-center text-black font-bold">GF</th>
                <th class="px-4 py-4 text-center text-black font-bold">GC</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(equipo, index) in tabla" 
                :key="index"
                :class="[
                  'border-b border-white/10 hover:bg-primary/5 transition',
                  index === 0 ? 'bg-primary/10' : index === 1 ? 'bg-primary/5' : ''
                ]"
              >
                <td class="px-4 py-4 text-center font-bold">
                  <span v-if="index === 0" class="text-2xl">🥇</span>
                  <span v-else-if="index === 1" class="text-2xl">🥈</span>
                  <span v-else-if="index === 2" class="text-2xl">🥉</span>
                  <span v-else class="text-primary font-bold text-lg">{{ equipo.posicion }}</span>
                </td>

                <td class="px-4 py-4 font-bold text-white">
                  {{ equipo.equipo }}
                  <span v-if="equipo.equipo === 'CD Vikingas'" class="ml-2 text-xs bg-primary text-black px-2 py-1 rounded font-bold">VIKINGAS</span>
                </td>

                <td class="px-4 py-4 text-center text-white/70 font-medium">{{ equipo.pj }}</td>
                <td class="px-4 py-4 text-center text-primary font-bold">{{ equipo.pg }}</td>
                <td class="px-4 py-4 text-center text-yellow-400 font-bold">{{ equipo.pe }}</td>
                <td class="px-4 py-4 text-center text-red-400 font-bold">{{ equipo.pp }}</td>
                <td class="px-4 py-4 text-center font-bold" :class="parseInt(equipo.dg) >= 0 ? 'text-primary' : 'text-red-400'">
                  {{ equipo.dg > 0 ? '+' : '' }}{{ equipo.dg }}
                </td>
                <td class="px-4 py-4 text-center text-primary font-bold text-lg">{{ equipo.ptos }}</td>
                <td class="px-4 py-4 text-center text-white/70 font-medium">{{ equipo.gf }}</td>
                <td class="px-4 py-4 text-center text-white/70 font-medium">{{ equipo.gc }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-primary-dark px-6 py-4 border-t-2 border-primary">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
            <div class="text-black font-bold"><span class="font-black">PJ:</span> Part. Jugados</div>
            <div class="text-black font-bold"><span class="font-black">PG:</span> Part. Ganados</div>
            <div class="text-black font-bold"><span class="font-black">PE:</span> Part. Empatados</div>
            <div class="text-black font-bold"><span class="font-black">PP:</span> Part. Perdidos</div>
            <div class="text-black font-bold"><span class="font-black">DG:</span> Dif. Goles</div>
            <div class="text-black font-bold"><span class="font-black">Pts:</span> Puntos</div>
            <div class="text-black font-bold"><span class="font-black">GF:</span> Goles a Favor</div>
            <div class="text-black font-bold"><span class="font-black">GC:</span> Goles en Contra</div>
          </div>
        </div>
      </div> -->

      <!-- Resultados del Torneo -->
      <div class="bg-black border-2 border-primary rounded-lg p-8">
        <h2 class="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3" style="font-family: 'Collegiate Black', sans-serif;">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h8v8H3V3m10 0h8v8h-8V3M3 13h8v8H3v-8m13.33 0L13 16l-1.33-3 3-1.33L16 9l1.33 3 3 1.33-3 1.34L16 17l-1.33-3-3 1.33 3-1.33Z"/>
          </svg>
          RESULTADOS LIGA DOBLEVE VERANO 2026
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Fase de Grupos -->
          <div>
            <h3 class="text-primary font-bold text-lg mb-4 border-b-2 border-primary pb-2">FASE DE GRUPOS</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Vieja Escuela</span>
                <span class="text-red-400 font-bold">1 - 5</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs De Cero</span>
                <span class="text-red-400 font-bold">3 - 4</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Panteras</span>
                <span class="text-red-400 font-bold">2 - 4</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Florida</span>
                <span class="text-red-400 font-bold">1 - 11</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Clever</span>
                <span class="text-red-400 font-bold">3 - 5</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Firegol</span>
                <span class="text-red-400 font-bold">1 - 4</span>
              </div>
              <div class="flex justify-between items-center bg-primary/20 border-2 border-primary p-3 rounded">
                <span class="text-white font-bold">Vikingas vs Leyendas</span>
                <span class="text-primary font-bold">5 - 2</span>
              </div>
            </div>
          </div>

          <!-- Playoffs/Final -->
          <div>
            <h3 class="text-primary font-bold text-lg mb-4 border-b-2 border-primary pb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              PLAYOFFS - FINAL
            </h3>
            <div class="space-y-3">
              <div class="bg-primary/20 border-2 border-primary p-3 rounded">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-primary text-xs font-bold uppercase">Semifinal</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-white font-bold">Vikingas vs Clever</span>
                  <span class="text-primary font-bold text-xl">7 - 2</span>
                </div>
              </div>
              
              <div class="bg-primary/20 border-2 border-primary p-3 rounded">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-primary text-xs font-bold uppercase flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    Final
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-white font-bold">Vikingas vs Firegol</span>
                  <span class="text-primary font-bold text-xl">4 - 2</span>
                </div>
              </div>
              
              <div class="mt-6 bg-primary-dark p-6 rounded-lg text-center">
                <p class="text-black text-2xl font-black mb-2 flex items-center justify-center gap-2">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  CAMPEONAS
                </p>
                <p class="text-black font-bold text-sm">Serie AB+ Liga de Verano</p>
                <p class="text-black/70 text-xs mt-2">Vikingas Ascenso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de la liga -->
      <div class="mt-8 bg-primary-dark rounded-lg p-8 border-2 border-primary">
        <h2 class="text-3xl font-bold text-black mb-6 flex items-center gap-3" style="font-family: 'Collegiate Black', sans-serif;">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          CAMPEONAS SERIE AB+
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-black font-bold text-lg mb-3">LIGADOBLEVE SUMMER CUP 2026</h3>
            <p class="text-black/80 text-sm mb-4 leading-relaxed">
              ¡CD Vikingas - categoría Vikingas Ascenso - es campeona de la Serie Oro AB+ Liga de Verano! El equipo demostró una gran recuperación tras una fase de grupos complicada, logrando victorias contundentes en los playoffs para coronarse campeonas.
            </p>
            <a 
              href="https://trotamundos.cl/index.php/ligadobleve-summer-cup/" 
              target="_blank" 
              class="inline-block bg-black hover:bg-black/80 text-primary px-4 py-2 rounded font-bold transition text-sm"
            >
              Ver página oficial →
            </a>
          </div>
          <div>
            <h3 class="text-black font-bold text-lg mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0-2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 11c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
              </svg>
              LOGROS DEL TORNEO
            </h3>
            <ul class="text-black/80 text-sm space-y-2">
              <li class="font-bold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Campeonas Serie Oro AB+ Liga de Verano
              </li>
              <li class="font-bold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Victoria 7-2 en semifinal vs Clever
              </li>
              <li class="font-bold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Victoria 4-2 en final vs Firegol
              </li>
              <li class="font-semibold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.71,4.14C12.76,4.3 12.79,4.47 12.8,4.64C12.81,4.85 12.8,5.05 12.76,5.24C12.72,5.43 12.65,5.61 12.55,5.78L10.55,9.13C10.32,9.5 9.97,9.78 9.56,9.92C9.15,10.06 8.71,10.06 8.3,9.91L4.5,8.45C4.3,8.38 4.11,8.29 3.94,8.18C3.77,8.07 3.61,7.93 3.48,7.77C3.35,7.61 3.24,7.43 3.16,7.23C3.08,7.04 3.03,6.83 3.01,6.62C2.99,6.41 3,6.19 3.04,5.98C3.08,5.77 3.16,5.56 3.27,5.37C3.38,5.18 3.52,5.01 3.68,4.87C3.85,4.73 4.03,4.61 4.23,4.53L8.03,3.07C8.45,2.92 8.89,2.92 9.3,3.06C9.71,3.2 10.06,3.48 10.29,3.85L12.29,7.2C12.47,7.5 12.57,7.84 12.6,8.19C12.63,8.54 12.57,8.89 12.45,9.21L11.6,9.56L12.71,4.14M20.77,5.98C20.81,6.19 20.82,6.41 20.8,6.62C20.78,6.83 20.73,7.04 20.65,7.23C20.57,7.43 20.46,7.61 20.33,7.77C20.2,7.93 20.04,8.07 19.87,8.18C19.7,8.29 19.51,8.38 19.31,8.45L15.51,9.91C15.1,10.06 14.66,10.06 14.25,9.92C13.84,9.78 13.49,9.5 13.26,9.13L11.26,5.78C11.16,5.61 11.09,5.43 11.05,5.24C11.01,5.05 11,4.85 11.01,4.64C11.02,4.47 11.05,4.3 11.1,4.14L12.21,9.56L11.36,9.21C11.24,8.89 11.18,8.54 11.21,8.19C11.24,7.84 11.34,7.5 11.52,7.2L13.52,3.85C13.75,3.48 14.1,3.2 14.51,3.06C14.92,2.92 15.36,2.92 15.78,3.07L19.58,4.53C19.78,4.61 19.96,4.73 20.13,4.87C20.29,5.01 20.43,5.18 20.54,5.37C20.65,5.56 20.73,5.77 20.77,5.98M17.64,14C17.64,15.96 16.62,17.76 15,18.85V21.97H9V18.85C7.38,17.76 6.36,15.96 6.36,14H17.64Z"/>
                </svg>
                Gran remontada en playoffs
              </li>
            </ul>
          </div>
        </div>
      </div>
        </div>
      </div>
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
import ModalConfirmacion from '../components/ModalConfirmacion.vue';
import { authUser, userRole } from '../firebase/auth';
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
  actualizarEstadoPartido,
  obtenerTabla,
  escucharPartidos,
  escucharTabla,
  calcularTabla,
  inicializarFecha2,
  inicializarFecha3
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
const competenciaExpandida = ref('interno'); // 'verano' o 'interno'

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

// Equipos del torneo interno (ahora vinculados a Firebase)
const equipos = computed(() => equiposCampeonato.value);

// Tabla de goleadoras general
const tablaGoleadoras = ref([]);
const mostrarTablaGoleadoras = ref(false);

const isAdmin = computed(() => userRole.value === 'admin');
const mostrarPanelGoles = ref(false);
const guardandoGol = ref(false);
const fuegitosFinal = ref(0);
const dioFuegoFinal = ref(false);

let unsubscribe = null;

const reaccionarConFuego = () => {
  if (dioFuegoFinal.value) {
    fuegitosFinal.value = Math.max(0, fuegitosFinal.value - 1);
    dioFuegoFinal.value = false;
  } else {
    fuegitosFinal.value += 1;
    dioFuegoFinal.value = true;
  }

  localStorage.setItem('final_fueguitos_count', String(fuegitosFinal.value));
  localStorage.setItem('final_fueguitos_user_reacted', dioFuegoFinal.value ? '1' : '0');
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
    
    // // console.log('API URL:', apiUrl);
    
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

const tieneFecha3 = computed(() => fechasOrdenadas.value.includes(3));

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
      nombre: 'Siempre al Palo FC',
      logo: 'siemprealpaloLogo.jpeg',
      color: 'red'
    }
  };
  return equiposData[equipoKey] || {};
};

const editarResultado = (partido) => {
  const empateEdit = partido.golesLocal === partido.golesVisita && (partido.empate === true || (partido.penalesLocal || 0) !== (partido.penalesVisita || 0));
  let ganadorPenalesEdit = partido.ganadorPenales || null;

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
    ganadorPenalesEdit
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
  const fueguitosGuardados = Number(localStorage.getItem('final_fueguitos_count') || '0');
  fuegitosFinal.value = Number.isFinite(fueguitosGuardados) && fueguitosGuardados >= 0 ? fueguitosGuardados : 0;
  dioFuegoFinal.value = localStorage.getItem('final_fueguitos_user_reacted') === '1';

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

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
