<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="bg-linear-to-r from-primary-dark to-primary text-white shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <HomeIcon class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-xl sm:text-3xl font-black">Panel de Administración</h1>
              <p class="text-xs sm:text-sm text-white/80 mt-0.5">{{ userGreeting }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleLogout"
              class="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105 active:scale-95"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenedor Principal -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Menú Lateral -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-5 sticky top-6 border border-gray-100 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div class="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <HomeIcon class="w-5 h-5 text-primary" />
              </div>
              <h2 class="text-lg font-black text-gray-900">Menú</h2>
            </div>
            <nav class="space-y-1.5">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center gap-3 group',
                  activeTab === tab.id
                    ? 'bg-linear-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]'
                ]"
              >
                <component 
                  :is="tab.icon" 
                  :class="[
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                  ]" 
                />
                <span>{{ tab.label }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="lg:col-span-3">
          <!-- Home/Dashboard -->
          <div v-if="activeTab === 'home'" class="space-y-6">
            <!-- Tarjeta de bienvenida -->
            <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-16 h-16 bg-linear-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                  <UsersIcon class="w-9 h-9 text-white" />
                </div>
                <div>
                  <h2 class="lg:text-3xl text-xl font-black text-gray-900">¡Bienvenida DT Yesi!</h2>
                  <p class="text-sm text-gray-500 mt-1">Gestiona tu equipo desde un solo lugar</p>
                </div>
              </div>
              
              <!-- Estadísticas Rápidas -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <!-- Próximo Entrenamiento -->
                <div class="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <CalendarIcon class="w-6 h-6" />
                    </div>
                  </div>
                  <p class="text-sm font-medium opacity-90 mb-1">Próximo Entrenamiento</p>
                  <div v-if="proximoEntrenamiento">
                    <p class="text-sm lg:text-xl font-black mb-2 line-clamp-1">{{ proximoEntrenamiento.nombre }}</p>
                    <div class="space-y-1 text-xs opacity-90">
                      <p>📅 En {{ proximoEntrenamiento.diasRestantes }} {{ proximoEntrenamiento.diasRestantes === 1 ? 'día' : 'días' }}</p>
                      <p>✓ {{ proximoEntrenamiento.inscripciones.confirmadas }} confirmadas</p>
                      <p>⏳ {{ proximoEntrenamiento.inscripciones.pendientes }} pendientes</p>
                    </div>
                  </div>
                  <p v-else class="text-xl font-black">No hay próximos</p>
                </div>
                
                <!-- Total de Jugadoras Activas -->
                <div class="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <UsersIcon class="w-6 h-6" />
                    </div>
                  </div>
                  <p class="text-sm font-medium opacity-90 mb-1">Total Jugadoras</p>
                  <div class="flex items-baseline gap-2 mb-3">
                    <p class="text-5xl font-black">{{ jugadorasPorEquipo.total }}</p>
                    <span class="text-xl font-bold opacity-90">activas</span>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="opacity-90 flex items-center gap-1">
                        <span class="w-2 h-2 bg-white rounded-full"></span>
                        Ascenso
                      </span>
                      <span class="font-bold">{{ jugadorasPorEquipo.ascenso }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="opacity-90 flex items-center gap-1">
                        <span class="w-2 h-2 bg-white rounded-full"></span>
                        Escuela
                      </span>
                      <span class="font-bold">{{ jugadorasPorEquipo.escuela }}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="opacity-90 flex items-center gap-1">
                        <span class="w-2 h-2 bg-white rounded-full"></span>
                        Ambos
                      </span>
                      <span class="font-bold">{{ jugadorasPorEquipo.ambos }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Tasa de Asistencia -->
                <div class="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <ChartBarIcon class="w-6 h-6" />
                    </div>
                  </div>
                  <p class="text-sm font-medium opacity-90 mb-1">Tasa de Asistencia</p>
                  <div class="flex items-baseline gap-2">
                    <p class="text-5xl font-black">{{ tasaAsistenciaPromedio }}</p>
                    <span class="text-2xl font-bold opacity-90">%</span>
                  </div>
                  <p class="text-xs opacity-75 mt-2">Promedio de entrenamientos finalizados</p>
                </div>
              </div>

              <div
                v-if="esAdmin && alertasSalud.nuevas > 0"
                class="mb-6 rounded-2xl border-2 border-red-200 bg-linear-to-r from-red-50 to-rose-50 p-5 shadow-md"
              >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p class="text-xs font-black uppercase tracking-wide text-red-600">Notificación de salud semanal</p>
                    <p class="text-lg font-black text-red-700 mt-1">Hay {{ alertasSalud.nuevas }} respuesta{{ alertasSalud.nuevas === 1 ? '' : 's' }} nueva{{ alertasSalud.nuevas === 1 ? '' : 's' }} para revisar</p>
                    <p class="text-sm text-red-600 mt-1">Pendientes totales de revisión: {{ alertasSalud.pendientesRevision }}</p>
                  </div>
                  <button
                    @click="activeTab = 'salud-semanal'"
                    class="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
                  >
                    Ver respuestas
                  </button>
                </div>
              </div>

              <!-- Próximo Cumpleaños -->
              <div v-if="proximoCumpleanios" class="bg-linear-to-r from-pink-50 via-purple-50 to-pink-50 border-2 border-pink-200 rounded-2xl p-6 mb-6 shadow-md hover:shadow-lg transition-all">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div class="w-20 h-20 bg-linear-to-br from-pink-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 animate-pulse">
                    <GiftIcon class="w-10 h-10" />
                  </div>
                  <div class="flex-1 text-center sm:text-left">
                    <h3 class="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-purple-600">Próximo Cumpleaños</h3>
                    <p class="text-gray-900 mt-2 text-lg">
                      <span class="font-black text-purple-700">{{ proximoCumpleanios.nombre }}</span>
                    </p>
                    <div class="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <CalendarIcon class="w-4 h-4 text-gray-500" />
                      <p class="text-sm text-gray-600">
                        {{ proximoCumpleanios.fechaFormateada }}
                      </p>
                    </div>
                    <div class="mt-3">
                      <span v-if="proximoCumpleanios.diasRestantes === 0" class="inline-block px-4 py-2 bg-pink-500 text-white font-bold rounded-xl shadow-md">¡Hoy es su cumpleaños! 🎉</span>
                      <span v-else-if="proximoCumpleanios.diasRestantes === 1" class="inline-block px-4 py-2 bg-pink-500 text-white font-bold rounded-xl shadow-md">¡Mañana cumple años! 🎈</span>
                      <span v-else class="inline-block px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-xl">Faltan {{ proximoCumpleanios.diasRestantes }} días</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acceso Rápido -->
              <div>
                <div class="flex items-center gap-2 mb-5">
                  <div class="w-2 h-8 bg-primary rounded-full"></div>
                  <h3 class="text-xl font-black text-gray-900">Acceso Rápido</h3>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    @click="activeTab = 'entrenamientos'"
                    class="group p-5 bg-linear-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <CalendarIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm truncate font-black text-blue-700">Entrenamientos</div>
                  </button>
                  <button
                    @click="activeTab = 'jugadoras'"
                    class="group p-5 bg-linear-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <UsersIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm font-black text-green-700">Jugadoras</div>
                  </button>
                  <button
                    @click="activeTab = 'historial'"
                    class="group p-5 bg-linear-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <ChartBarIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm font-black text-purple-700">Historial</div>
                  </button>
                  <button
                    @click="activeTab = 'galeria'"
                    class="group p-5 bg-linear-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-2 border-yellow-200 hover:border-yellow-400 rounded-2xl transition-all cursor-pointer text-center hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      <CameraIcon class="w-6 h-6 text-white" />
                    </div>
                    <div class="text-sm font-black text-yellow-700">Galería</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Solicitudes de Registro -->
          <div v-if="activeTab === 'solicitudes'">
            <GestionarSolicitudesRegistro />
          </div>

          <!-- Slider Home -->
          <div v-if="activeTab === 'slider'">
            <GestionarSliderHome />
          </div>

          <!-- Jugadoras -->
          <div v-if="activeTab === 'jugadoras'">
            <ListadoJugadorasAdmin />
          </div>

          <!-- Entrenamientos -->
          <div v-if="activeTab === 'entrenamientos'">
            <GestionarEntrenamientos />
          </div>

          <!-- Historial -->
          <div v-if="activeTab === 'historial'">
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <!-- Header -->
              <div class="bg-linear-to-r from-primary-dark via-primary to-primary-dark p-6 sm:p-8 text-white">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <ChartBarIcon class="w-6 h-6" />
                  </div>
                  <div>
                    <h2 class="text-2xl sm:text-3xl font-black">Historial de entrenamientos</h2>
                    <p class="text-xs sm:text-sm text-white/80 mt-1">Entrenamientos finalizados</p>
                  </div>
                </div>
              </div>

              <!-- Contenido -->
              <div class="p-6">
                <div v-if="historialFiltrado.length === 0" class="p-16 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl text-center">
                  <div class="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon class="w-10 h-10 text-gray-400" />
                  </div>
                  <p class="text-gray-500 font-bold text-lg">No hay items en el historial</p>
                  <p class="text-gray-400 text-sm mt-2">Los entrenamientos finalizados aparecerán aquí</p>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div 
                    v-for="ent in historialFiltrado" 
                    :key="ent.id" 
                    class="bg-white rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  >
                    <!-- Header de la tarjeta con gradiente -->
                    <div class="bg-linear-to-br from-gray-50 to-gray-100 p-5 border-b-2 border-gray-100 group-hover:from-primary/5 group-hover:to-primary/10 transition-all">
                      <div class="flex justify-between items-start gap-3 mb-4">
                        <h3 class="font-black text-base text-gray-900 line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                          {{ ent.nombre }}
                        </h3>
                        <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1.5 whitespace-nowrap shrink-0 font-bold">
                          ✓ Finalizado
                        </span>
                      </div>
                      
                      <!-- Info fecha y hora con iconos -->
                      <div class="space-y-2">
                        <div class="flex items-center gap-2.5 text-xs text-gray-600">
                          <div class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <CalendarIcon class="w-4 h-4 text-blue-600" />
                          </div>
                          <span class="font-medium">{{ formatearFecha(ent.fecha) }}</span>
                        </div>
                        <div class="flex items-center gap-2.5 text-xs text-gray-600">
                          <div class="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                            <ClockIcon class="w-4 h-4 text-purple-600" />
                          </div>
                          <span class="font-medium">{{ ent.hora }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Cuerpo de la tarjeta -->
                    <div class="p-5">
                      <!-- Tags con mejor diseño -->
                      <div class="flex flex-wrap items-center gap-2 mb-4">
                        <span class="text-xs bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full px-3 py-1.5 font-bold capitalize shadow-sm">
                          {{ ent.equipo }}
                        </span>
                        <span v-if="ent.tipo" class="text-xs bg-linear-to-r from-green-500 to-green-600 text-white rounded-full px-3 py-1.5 font-bold capitalize shadow-sm">
                          {{ ent.tipo }}
                        </span>
                        <span v-if="esPartidoOAmistoso(ent) && mvpHabilitadoNormalizado(ent)" class="text-xs bg-linear-to-r from-red-500 to-red-600 text-white rounded-full px-3 py-1.5 font-bold shadow-sm">
                          MVP habilitado
                        </span>
                        <span v-if="mvpEmpatePendiente(ent)" class="text-xs bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full px-3 py-1.5 font-bold shadow-sm">
                          Empate MVP pendiente
                        </span>
                        <span v-if="ent.mvpCerrada && esPartidoOAmistoso(ent)" class="text-xs bg-linear-to-r from-gray-600 to-gray-700 text-white rounded-full px-3 py-1.5 font-bold shadow-sm">
                          Votación MVP cerrada
                        </span>
                        <span v-if="ent.esConvocatoria" class="text-xs bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-full px-3 py-1.5 font-bold shadow-sm">
                          Convocatoria
                        </span>
                        <span v-if="mvpGanadora(ent)" class="text-xs bg-linear-to-r from-yellow-500 to-yellow-600 text-white rounded-full px-3 py-1.5 font-bold shadow-sm inline-flex items-center gap-1">
                          <TrophyIcon class="w-3.5 h-3.5" />
                          <span>Jugadora del partido: {{ mvpGanadora(ent).nombre }}</span>
                        </span>
                      </div>

                      <!-- Descripción -->
                      <p v-if="ent.descripcion" class="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                        {{ ent.descripcion }}
                      </p>

                      <!-- Botón de acción mejorado -->
                      <button 
                        @click="verDetalles(ent)" 
                        class="w-full px-4 py-3 bg-linear-to-r from-primary to-primary-dark text-white rounded-xl cursor-pointer hover:shadow-lg font-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
                      >
                        <PencilIcon class="w-4 h-4" />
                        Ver Asistencia
                      </button>

                      <button
                        v-if="esPartidoOAmistoso(ent) && mvpHabilitadoNormalizado(ent) && !ent.mvpCerrada"
                        @click="finalizarVotacionMvpDesdeHistorial(ent)"
                        class="w-full mt-2 px-4 py-3 bg-linear-to-r from-gray-700 to-gray-800 text-white rounded-xl cursor-pointer hover:shadow-lg font-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
                      >
                        <FlagIcon class="w-4 h-4" />
                        <span>Finalizar votación MVP</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feedback a Jugadoras -->
          <div v-if="activeTab === 'feedback'">
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <!-- Header -->
              <div class="bg-linear-to-r from-primary-dark via-primary to-primary-dark p-6 sm:p-8 text-white">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <BellAlertIcon class="w-6 h-6" />
                  </div>
                  <div>
                    <h2 class="text-2xl sm:text-3xl font-black">Feedback a Jugadoras</h2>
                    <p class="text-xs sm:text-sm text-white/80 mt-1">Envía mensajes personalizados de feedback a tus jugadoras</p>
                  </div>
                </div>
              </div>

              <!-- Contenido -->
              <div class="p-6 sm:p-8">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Formulario -->
                  <div class="lg:col-span-2">
                    <div class="space-y-6">
                      <!-- Selector de Jugadora -->
                      <div>
                        <label class="block text-sm font-black text-gray-800 mb-3">
                          Selecciona una jugadora
                        </label>
                        <select
                          v-model="jugadoraSeleccionadaFeedback"
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white text-gray-900 font-medium"
                        >
                          <option value="">-- Selecciona una jugadora --</option>
                          <option v-for="jugadora in todasJugadoras" :key="jugadora.id" :value="jugadora">
                            {{ jugadora.nombre }} {{ jugadora.apellido }}
                          </option>
                        </select>
                      </div>

                      <!-- Tipo de Feedback -->
                      <div>
                        <label class="block text-sm font-black text-gray-800 mb-3">
                          Tipo de feedback
                        </label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <button
                            v-for="tipo in ['general', 'recomendacion', 'salud', 'rendimiento']"
                            :key="tipo"
                            @click="tipoFeedback = tipo"
                            :class="{
                              'bg-primary text-white border-primary': tipoFeedback === tipo,
                              'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300': tipoFeedback !== tipo
                            }"
                            class="px-4 py-3 truncate border-2 rounded-xl font-bold transition-all capitalize"
                          >
                            {{ tipo }}
                          </button>
                        </div>
                      </div>

                      <!-- Mensaje -->
                      <div>
                        <label class="block text-sm font-black text-gray-800 mb-3">
                          Mensaje
                        </label>
                        <textarea
                          v-model="mensajeFeedback"
                          placeholder="Escribe tu mensaje de feedback aquí..."
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-white text-gray-900 font-medium resize-none"
                          rows="6"
                        ></textarea>
                        <div class="mt-2 text-xs text-gray-500 font-medium">
                          {{ mensajeFeedback.length }} / 500 caracteres
                        </div>
                      </div>

                      <!-- Botón Enviar -->
                      <button
                        @click="enviarFeedback"
                        :disabled="!jugadoraSeleccionadaFeedback || !mensajeFeedback.trim() || isEnviandoFeedback"
                        :class="{
                          'opacity-50 cursor-not-allowed': !jugadoraSeleccionadaFeedback || !mensajeFeedback.trim() || isEnviandoFeedback,
                          'hover:shadow-lg active:scale-95': jugadoraSeleccionadaFeedback && mensajeFeedback.trim() && !isEnviandoFeedback
                        }"
                        class="w-full px-6 py-4 bg-linear-to-r from-primary to-primary-dark text-white rounded-xl font-black transition-all duration-300"
                      >
                        <span v-if="isEnviandoFeedback" class="flex items-center justify-center gap-2">
                          <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Enviando...
                        </span>
                        <span v-else>Enviar Feedback</span>
                      </button>
                    </div>
                  </div>

                  <!-- Información y Tipos de Feedback -->
                  <div class="lg:col-span-1">
                    <div class="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                      <h3 class="font-black text-base text-blue-900 mb-4">Tipos de Feedback</h3>
                      <div class="space-y-4">
                        <div>
                          <div class="font-bold text-blue-900 text-sm mb-1">General</div>
                          <p class="text-xs text-blue-800">Mensaje general o información importante</p>
                        </div>
                        <div>
                          <div class="font-bold text-blue-900 text-sm mb-1">Recomendación</div>
                          <p class="text-xs text-blue-800">Suggestions para mejorar el rendimiento</p>
                        </div>
                        <div>
                          <div class="font-bold text-blue-900 text-sm mb-1">Salud</div>
                          <p class="text-xs text-blue-800">Información sobre salud y bienestar</p>
                        </div>
                        <div>
                          <div class="font-bold text-blue-900 text-sm mb-1">Rendimiento</div>
                          <p class="text-xs text-blue-800">Evaluación del rendimiento en entrenamientos</p>
                        </div>
                      </div>
                    </div>

                    <!-- Instrucciones -->
                    <div class="mt-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                      <h3 class="font-black text-base text-green-900 mb-4">💡 Consejos</h3>
                      <ul class="space-y-2 text-xs text-green-800">
                        <li class="flex gap-2">
                          <span class="shrink-0 font-bold">✓</span>
                          <span>Sé específico y constructivo</span>
                        </li>
                        <li class="flex gap-2">
                          <span class="shrink-0 font-bold">✓</span>
                          <span>Destaca logros y áreas de mejora</span>
                        </li>
                        <li class="flex gap-2">
                          <span class="shrink-0 font-bold">✓</span>
                          <span>La jugadora puede reaccionar al mensaje</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- SECCIÓN: Ver Respuestas -->
                <div class="mt-8 border-t-2 border-gray-200 pt-8">
                  <div class="mb-6">
                    <div class="flex items-center gap-3 mb-6">
                      <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircleIcon class="w-6 h-6 text-white" />
                      </div>
                      <h3 class="text-2xl font-black text-gray-900">Ver Respuestas</h3>
                    </div>

                    <!-- Estadísticas -->
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                      <div class="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                        <p class="text-xs text-blue-600 font-bold mb-1">Total Enviados</p>
                        <p class="text-3xl font-black text-blue-700">{{ estadisticasFeedback.total }}</p>
                      </div>
                      <div class="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                        <p class="text-xs text-green-600 font-bold mb-1">Respondidos</p>
                        <p class="text-3xl font-black text-green-700">{{ estadisticasFeedback.respondidos }}</p>
                      </div>
                      <div class="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
                        <p class="text-xs text-red-600 font-bold mb-1">Pendientes</p>
                        <p class="text-3xl font-black text-red-700">{{ estadisticasFeedback.pendientes }}</p>
                      </div>
                      <div class="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <p class="text-xs text-purple-600 font-bold mb-1">Tasa Respuesta</p>
                        <p class="text-3xl font-black text-purple-700">{{ estadisticasFeedback.tasaRespuesta }}%</p>
                      </div>
                      <div class="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
                        <p class="text-xs text-yellow-600 font-bold mb-1">Cargando...</p>
                        <p v-if="!isLoadingFeedbacks" class="text-xl font-black text-yellow-700">✓</p>
                        <div v-else class="w-6 h-6 border-2 border-yellow-600/30 border-t-yellow-600 rounded-full animate-spin"></div>
                      </div>
                    </div>

                    <!-- Lista de Feedbacks -->
                    <div v-if="isLoadingFeedbacks" class="flex justify-center py-12">
                      <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                    <div v-else-if="feedbacksFiltrados.length === 0" class="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
                      <div class="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                        <BellAlertIcon class="w-8 h-8 text-gray-500" />
                      </div>
                      <p class="text-gray-600 font-bold text-lg">Sin feedbacks para mostrar</p>
                      <p class="text-gray-500 text-sm mt-2">Los feedbacks enviados aparecerán aquí</p>
                    </div>
                    <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                      <div 
                        v-for="feedback in feedbacksFiltrados" 
                        :key="feedback.id"
                        :class="[
                          'p-4 rounded-xl border-2 transition-all hover:shadow-lg',
                          feedback.reaccion 
                            ? 'bg-green-50 border-green-200'
                            : 'bg-yellow-50 border-yellow-200'
                        ]"
                      >
                        <div class="flex items-start justify-between mb-2">
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <p class="font-black text-gray-900">{{ feedback.jugadoraNombre }}</p>
                              <span class="text-xs font-bold px-2 py-1 rounded-lg bg-gray-200 text-gray-700 capitalize">
                                {{ feedback.tipo }}
                              </span>
                            </div>
                            <p class="text-sm text-gray-600 line-clamp-2">{{ feedback.mensaje }}</p>
                          </div>
                          <div class="shrink-0">
                            <div v-if="feedback.reaccion" class="flex items-center gap-2">
                              <component 
                                v-if="feedback.reaccion === 'confirmado'"
                                :is="CheckCircleIcon"
                                class="w-6 h-6 text-green-500"
                              />
                              <component 
                                v-else-if="feedback.reaccion === 'revisar'"
                                :is="ExclamationCircleIcon"
                                class="w-6 h-6 text-yellow-500"
                              />
                              <component 
                                v-else-if="feedback.reaccion === 'pregunta'"
                                :is="QuestionMarkCircleIcon"
                                class="w-6 h-6 text-blue-500"
                              />
                              <span class="text-xs font-bold text-gray-600 whitespace-nowrap">
                                {{ formatearTiempoRelativo(feedback.reaccionadoAt) }}
                              </span>
                            </div>
                            <div v-else class="text-xs font-bold text-yellow-600">Sin respuesta</div>
                          </div>
                        </div>
                        <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>📅 {{ formatearTiempoRelativo(feedback.createdAt) }}</span>
                          <span v-if="feedback.reaccion" class="text-green-600 font-bold capitalize">
                            → {{ feedback.reaccion }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Galería -->
          <div v-if="activeTab === 'galeria'">
            <GestionarGalerias />
          </div>

          <!-- Eventos Especiales -->
          <div v-if="activeTab === 'eventos-especiales'">
            <GestionarEventosEspeciales />
          </div>

          <!-- Banner Mensualidad -->
          <div v-if="activeTab === 'banner-mensualidad'">
            <GestionarBannerMensualidad />
          </div>

          <!-- Ranking Asistencia (solo admin) -->
          <div v-if="activeTab === 'ranking-asistencia' && esAdmin">
            <GestionarRankingAsistencia />
          </div>

          <!-- Salud Semanal (solo admin) -->
          <div v-if="activeTab === 'salud-semanal' && esAdmin">
            <GestionarSaludSemanal />
          </div>

          <!-- Estadísticas -->
          <div v-if="activeTab === 'estadisticas'">
            <GestionarEstadisticas />
          </div>

          <!-- Partidos Campeonato Interno -->
          <div v-if="activeTab === 'partidos'">
            <GestionarPartidos />
          </div>

          <!-- Editar Resultados de Partidos -->
          <div v-if="activeTab === 'resultados-partidos'">
            <EditorResultadosPartidosAdmin />
          </div>

          <div v-if="activeTab === 'ultimos-resultados'">
            <GestionarUltimosResultados />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { logout, authUser, userRole } from '../firebase/auth';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  UsersIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  TrophyIcon, 
  CameraIcon, 
  ArrowTrendingUpIcon,
  BellAlertIcon,
  CheckIcon,
  ClockIcon,
  GiftIcon,
  PencilIcon,
  FlagIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline';
import GestionarGalerias from '../components/GestionarGalerias.vue';
import GestionarEventosEspeciales from '../components/GestionarEventosEspeciales.vue';
import GestionarBannerMensualidad from '../components/GestionarBannerMensualidad.vue';
import GestionarRankingAsistencia from '../components/GestionarRankingAsistencia.vue';
import GestionarSaludSemanal from '../components/GestionarSaludSemanal.vue';
import GestionarEstadisticas from '../components/GestionarEstadisticas.vue';
import GestionarSliderHome from '../components/GestionarSliderHome.vue';
import GestionarSolicitudesRegistro from '../components/GestionarSolicitudesRegistro.vue';
import GestionarEntrenamientos from '../components/GestionarEntrenamientos.vue';
import GestionarPartidos from '../components/GestionarPartidos.vue';
import EditorResultadosPartidosAdmin from '../components/EditorResultadosPartidosAdmin.vue';
import GestionarUltimosResultados from '../components/GestionarUltimosResultados.vue';
import { entrenamientos, fetchTodosEntrenamientos, finalizarVotacionMvpEntrenamiento } from '../firebase/entrenamientos';
import VistaJugadorasAdmin from '../components/VistaJugadorasAdmin.vue';
import ListadoJugadorasAdmin from '../components/ListadoJugadorasAdmin.vue';
import InfoUltimaActualizacion from '../components/InfoUltimaActualizacion.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { escucharAlertasSaludSemanalAdmin, limpiarSaludSemanalAntiguaS } from '../firebase/saludSemanal';
import { crearFeedback, obtenerTodosFeedbacks, limpiarFeedbacksAntiguos, escucharTodosFeedbacks } from '../firebase/feedback';

const router = useRouter();
const route = useRoute();
const activeTab = ref('home');
const proximoCumpleanios = ref(null);
const inscripcionesPorEntrenamiento = ref({});
const jugadorasPorEquipo = ref({ ascenso: 0, escuela: 0, ambos: 0, total: 0 });
const alertasSalud = ref({ nuevas: 0, pendientesRevision: 0, ultimas: [] });
const todasJugadoras = ref([]);
const jugadoraSeleccionadaFeedback = ref(null);
const mensajeFeedback = ref('');
const tipoFeedback = ref('general');
const isEnviandoFeedback = ref(false);
const todosFeedbacks = ref([]);
const isLoadingFeedbacks = ref(false);
let unsubscribeAlertasSalud = null;
let unsubscribeFeedbacks = null;

const userGreeting = computed(() => {
  if (authUser.value) {
    const rol = userRole.value === 'admin' ? '(Admin)' : '(Coach)';
    return `Bienvenida, ${authUser.value.email} ${rol}`;
  }
  return '';
});

const esAdmin = computed(() => userRole.value === 'admin');

const tabs = computed(() => {
  const baseTabs = [
    { id: 'home', label: 'Inicio', icon: HomeIcon },
    { id: 'solicitudes', label: 'Solicitudes', icon: DocumentTextIcon },
    { id: 'jugadoras', label: 'Jugadoras', icon: UsersIcon },
    { id: 'entrenamientos', label: 'Entrenamientos', icon: CalendarIcon },
    { id: 'banner-mensualidad', label: 'Banner Noticia/Mensualidad/Otros', icon: BellAlertIcon },
    { id: 'feedback', label: 'Feedback a Jugadoras', icon: BellAlertIcon },
    { id: 'historial', label: 'Historial', icon: ChartBarIcon },
    { id: 'galeria', label: 'Galería', icon: CameraIcon },
    { id: 'estadisticas', label: 'Estadísticas', icon: ArrowTrendingUpIcon },
    { id: 'resultados-partidos', label: 'Editar Resultados', icon: TrophyIcon },
    { id: 'ultimos-resultados', label: 'Ultimos Resultados Home', icon: FlagIcon },
  ];

  if (esAdmin.value) {
    baseTabs.splice(8, 0, {
      id: 'ranking-asistencia',
      label: 'Ranking Asistencia',
      icon: ChartBarIcon,
    });

    baseTabs.splice(9, 0, {
      id: 'salud-semanal',
      label: alertasSalud.value.nuevas > 0
        ? `Salud Semanal (${alertasSalud.value.nuevas})`
        : 'Salud Semanal',
      icon: BellAlertIcon,
    });
  }

  return baseTabs;
});

const feedbacksFiltrados = computed(() => todosFeedbacks.value);

const estadisticasFeedback = computed(() => {
  const total = todosFeedbacks.value.length;
  const respondidos = todosFeedbacks.value.filter(f => f.reaccion).length;
  const pendientes = total - respondidos;
  const confirmados = todosFeedbacks.value.filter(f => f.reaccion === 'confirmado').length;
  const revisar = todosFeedbacks.value.filter(f => f.reaccion === 'revisar').length;
  const preguntas = todosFeedbacks.value.filter(f => f.reaccion === 'pregunta').length;
  
  return {
    total,
    respondidos,
    pendientes,
    confirmados,
    revisar,
    preguntas,
    tasaRespuesta: total > 0 ? Math.round((respondidos / total) * 100) : 0
  };
});

const handleLogout = async () => {
  await logout();
  router.push('/login');
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

const formatearTiempoRelativo = (date) => {
  if (!date) return '-';
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  const ahora = new Date();
  const diferencia = Math.floor((ahora.getTime() - d.getTime()) / 1000);
  
  if (diferencia < 60) return 'hace unos segundos';
  if (diferencia < 3600) return `hace ${Math.floor(diferencia / 60)}m`;
  if (diferencia < 86400) return `hace ${Math.floor(diferencia / 3600)}h`;
  if (diferencia < 604800) return `hace ${Math.floor(diferencia / 86400)}d`;
  
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const parseFechaBase = (fecha) => {
  if (!fecha) return null;
  if (fecha?.seconds) return new Date(fecha.seconds * 1000);
  if (fecha instanceof Date) return fecha;

  if (typeof fecha === 'string') {
    const soloFecha = fecha.split('T')[0];
    const partes = soloFecha.split('-').map(Number);
    if (partes.length === 3 && partes.every(n => Number.isFinite(n))) {
      const [y, m, d] = partes;
      return new Date(y, m - 1, d);
    }
  }

  const d = new Date(fecha);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getFechaHoraMs = (ent) => {
  const base = parseFechaBase(ent?.fecha);
  if (!base) return null;
  const dt = new Date(base);
  if (typeof ent?.hora === 'string' && ent.hora.includes(':')) {
    const [hh, mm] = ent.hora.split(':').map(Number);
    dt.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0);
  } else {
    dt.setHours(0, 0, 0, 0);
  }
  return dt.getTime();
};

const eventoFinalizado = (ent) => {
  const ms = getFechaHoraMs(ent);
  return ms != null && ms < Date.now();
};

const esPartidoOAmistoso = (ent) => {
  const tipo = (ent?.tipo || '').toString().toLowerCase();
  return tipo === 'partido' || tipo === 'amistoso';
};

const mvpHabilitadoNormalizado = (ent) => {
  const mvpRaw = ent?.mvpHabilitado;
  return mvpRaw === undefined || mvpRaw === null
    ? true
    : (mvpRaw === true || mvpRaw === 'true' || mvpRaw === 1);
};

const mvpEmpatePendiente = (ent) => {
  if (!esPartidoOAmistoso(ent) || !mvpHabilitadoNormalizado(ent) || ent?.mvpCerrada) return false;

  const votosOrdenados = Array.isArray(ent?.mvpVotos)
    ? [...ent.mvpVotos]
        .map((item) => ({
          nombre: (item?.nombre || '').toString().trim(),
          votos: Math.max(0, Number(item?.votos) || 0)
        }))
        .filter((item) => item.nombre)
        .sort((a, b) => b.votos - a.votos)
    : [];

  if (votosOrdenados.length < 2) return false;

  const maxVotos = votosOrdenados[0].votos;
  if (maxVotos <= 0) return false;

  return votosOrdenados.filter((item) => item.votos === maxVotos).length > 1;
};

const mvpGanadora = (ent) => {
  if (!ent?.mvpCerrada) return null;

  const nombreFinal = (ent?.mvpGanadoraFinal || '').toString().trim();
  if (nombreFinal) {
    const enVotos = Array.isArray(ent?.mvpVotos)
      ? ent.mvpVotos.find((item) => (item?.nombre || '').toString().trim().toLowerCase() === nombreFinal.toLowerCase())
      : null;
    return enVotos || { nombre: nombreFinal, votos: 0 };
  }

  if (!Array.isArray(ent?.mvpVotos) || ent.mvpVotos.length === 0) return null;
  return [...ent.mvpVotos].sort((a, b) => (Number(b?.votos) || 0) - (Number(a?.votos) || 0))[0];
};

const finalizarVotacionMvpDesdeHistorial = async (ent) => {
  const confirmar = confirm(`¿Finalizar votación MVP para "${ent?.nombre || 'este evento'}"?`);
  if (!confirmar) return;

  const votosOrdenados = Array.isArray(ent?.mvpVotos)
    ? [...ent.mvpVotos]
        .map((item) => ({
          nombre: (item?.nombre || '').toString().trim(),
          votos: Math.max(0, Number(item?.votos) || 0)
        }))
        .filter((item) => item.nombre)
        .sort((a, b) => b.votos - a.votos)
    : [];

  const maxVotos = votosOrdenados.length > 0 ? votosOrdenados[0].votos : 0;
  const empatadas = maxVotos > 0 ? votosOrdenados.filter((item) => item.votos === maxVotos) : [];
  let ganadoraFinal = '';

  if (empatadas.length > 1) {
    const opciones = empatadas.map((item, idx) => `${idx + 1}. ${item.nombre} (${item.votos} votos)`).join('\n');
    const seleccionRaw = prompt(`Hay empate MVP. Elige la ganadora final escribiendo el número:\n\n${opciones}`);
    if (!seleccionRaw) return;

    const indice = Number(seleccionRaw);
    if (!Number.isFinite(indice) || indice < 1 || indice > empatadas.length) {
      alert('Selección inválida. Debes ingresar un número de la lista.');
      return;
    }

    ganadoraFinal = empatadas[indice - 1].nombre;
  } else if (empatadas.length === 1) {
    ganadoraFinal = empatadas[0].nombre;
  }

  try {
    await finalizarVotacionMvpEntrenamiento(ent.id, ganadoraFinal);
    await fetchTodosEntrenamientos();
  } catch (err) {
    alert(err?.message || 'No se pudo finalizar la votación MVP.');
  }
};

const historialEntrenamientos = computed(() => {
  return entrenamientos.value
    .filter(e => eventoFinalizado(e))
    .sort((a, b) => (getFechaHoraMs(b) ?? 0) - (getFechaHoraMs(a) ?? 0));
});

const entrenamientosFuturos = computed(() => {
  return entrenamientos.value
    .filter(e => !eventoFinalizado(e))
    .sort((a, b) => (getFechaHoraMs(a) ?? 0) - (getFechaHoraMs(b) ?? 0));
});

const totalEntrenamientos = computed(() => entrenamientos.value.length);

// Próximo entrenamiento con datos
const proximoEntrenamiento = computed(() => {
  const futuros = entrenamientosFuturos.value;
  if (futuros.length === 0) return null;
  
  const proximo = futuros[0];
  const inscripciones = inscripcionesPorEntrenamiento.value[proximo.id] || { confirmadas: 0, bajas: 0, pendientes: 0 };
  const fechaMs = getFechaHoraMs(proximo);
  const diasRestantes = fechaMs ? Math.ceil((fechaMs - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  
  return {
    ...proximo,
    diasRestantes,
    inscripciones
  };
});

// Tasa de asistencia promedio (solo entrenamientos finalizados)
const tasaAsistenciaPromedio = computed(() => {
  const finalizados = historialEntrenamientos.value.filter(e => inscripcionesPorEntrenamiento.value[e.id]);
  
  if (finalizados.length === 0) return 0;
  
  const tasas = finalizados.map(e => {
    const insc = inscripcionesPorEntrenamiento.value[e.id];
    const total = (insc?.confirmadas || 0) + (insc?.bajas || 0) + (insc?.pendientes || 0);
    return total > 0 ? ((insc?.confirmadas || 0) / total) * 100 : 0;
  });
  
  const promedio = tasas.reduce((acc, t) => acc + t, 0) / tasas.length;
  return Math.round(promedio);
});

// Búsqueda para el historial
const searchHist = ref('');
const historialFiltrado = computed(() => {
  if (!searchHist.value) return historialEntrenamientos.value;
  return historialEntrenamientos.value.filter(e => (e.nombre || '').toLowerCase().includes(searchHist.value.toLowerCase()));
});

// Función para calcular el próximo cumpleaños
const cargarProximoCumpleanios = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
    const todasJugadoras = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filtrar jugadoras que tengan fecha de nacimiento
    const jugadorasConCumple = todasJugadoras
      .filter(jugadora => jugadora.fechaNacimiento)
      .map(jugadora => {
        const [anio, mes, dia] = jugadora.fechaNacimiento.split('-').map(Number);
        const hoy = new Date();
        const anioActual = hoy.getFullYear();
        
        // Crear fecha del cumpleaños en el año actual
        let fechaCumple = new Date(anioActual, mes - 1, dia);
        
        // Si ya pasó este año, usar el próximo año
        if (fechaCumple < hoy) {
          fechaCumple = new Date(anioActual + 1, mes - 1, dia);
        }
        
        return {
          nombre: `${jugadora.nombre} ${jugadora.apellido}`,
          fechaCumple: fechaCumple,
          dia: dia,
          mes: mes
        };
      });

    // Ordenar por fecha más próxima
    jugadorasConCumple.sort((a, b) => a.fechaCumple - b.fechaCumple);

    // Obtener el próximo cumpleaños
    if (jugadorasConCumple.length > 0) {
      const proximo = jugadorasConCumple[0];
      const hoy = new Date();
      const diasRestantes = Math.ceil((proximo.fechaCumple - hoy) / (1000 * 60 * 60 * 24));
      
      proximoCumpleanios.value = {
        nombre: proximo.nombre,
        fecha: proximo.fechaCumple,
        diasRestantes: diasRestantes,
        fechaFormateada: proximo.fechaCumple.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long'
        })
      };
    }
  } catch (err) {
    console.error('Error cargando cumpleaños:', err);
  }
};

// Función para cargar inscripciones de todos los entrenamientos
const cargarInscripcionesEntrenamientos = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'inscripcionesEntrenamientos'));
    const inscripcionesPorId = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const entrenamientoId = data.entrenamientoId;
      
      if (!inscripcionesPorId[entrenamientoId]) {
        inscripcionesPorId[entrenamientoId] = {
          confirmadas: 0,
          bajas: 0,
          pendientes: 0
        };
      }
      
      if (data.estado === 'confirmada') {
        inscripcionesPorId[entrenamientoId].confirmadas++;
      } else if (data.estado === 'baja') {
        inscripcionesPorId[entrenamientoId].bajas++;
      } else if (data.estado === 'pendiente') {
        inscripcionesPorId[entrenamientoId].pendientes++;
      }
    });
    
    inscripcionesPorEntrenamiento.value = inscripcionesPorId;
  } catch (err) {
    console.error('Error cargando inscripciones:', err);
  }
};

// Función para cargar jugadoras por equipo
const cargarJugadorasPorEquipo = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
    const conteo = { ascenso: 0, escuela: 0, ambos: 0, total: 0 };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.equipo === 'ascenso') {
        conteo.ascenso++;
      } else if (data.equipo === 'escuela') {
        conteo.escuela++;
      } else if (data.equipo === 'ambos') {
        conteo.ambos++;
      }
      conteo.total++;
    });
    
    jugadorasPorEquipo.value = conteo;
  } catch (err) {
    console.error('Error cargando jugadoras:', err);
  }
};

// Función para cargar todas las jugadoras
const cargarTodasJugadoras = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
    todasJugadoras.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => {
      const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
      const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
  } catch (err) {
    console.error('Error cargando jugadoras:', err);
  }
};

// Función para iniciar el listener de feedbacks en tiempo real
const iniciarListenerFeedbacks = async () => {
  try {
    // Limpiar feedbacks más antiguos de 2 días (una sola vez al inicio)
    await limpiarFeedbacksAntiguos(2);
    
    // Configurar listener en tiempo real
    unsubscribeFeedbacks = escucharTodosFeedbacks((feedbacks) => {
      todosFeedbacks.value = feedbacks;
    });
  } catch (err) {
    console.error('Error iniciando listener de feedbacks:', err);
  }
};

// Función para enviar feedback
const enviarFeedback = async () => {
  if (!jugadoraSeleccionadaFeedback.value || !mensajeFeedback.value.trim()) {
    alert('Por favor selecciona una jugadora y escribe un mensaje');
    return;
  }

  isEnviandoFeedback.value = true;
  try {
    await crearFeedback(
      jugadoraSeleccionadaFeedback.value.id,
      `${jugadoraSeleccionadaFeedback.value.nombre} ${jugadoraSeleccionadaFeedback.value.apellido}`,
      mensajeFeedback.value,
      tipoFeedback.value
    );
    alert('Feedback enviado correctamente');
    mensajeFeedback.value = '';
    tipoFeedback.value = 'general';
    jugadoraSeleccionadaFeedback.value = null;
  } catch (err) {
    alert('Error al enviar feedback: ' + err.message);
  } finally {
    isEnviandoFeedback.value = false;
  }
};

onMounted(async () => {
  const tab = route.query?.tab;
  if (typeof tab === 'string' && tabs.value.some(t => t.id === tab)) {
    activeTab.value = tab;
  }
  await fetchTodosEntrenamientos();
  await cargarProximoCumpleanios();
  await cargarInscripcionesEntrenamientos();
  await cargarJugadorasPorEquipo();
  await cargarTodasJugadoras();
  await iniciarListenerFeedbacks();

  if (esAdmin.value) {
    // Limpiar salud semanal más antigua de 1 semana
    await limpiarSaludSemanalAntiguaS(1);
    unsubscribeAlertasSalud = escucharAlertasSaludSemanalAdmin((data) => {
      alertasSalud.value = data;
    });
  }
});

onUnmounted(() => {
  if (typeof unsubscribeAlertasSalud === 'function') {
    unsubscribeAlertasSalud();
  }
  if (typeof unsubscribeFeedbacks === 'function') {
    unsubscribeFeedbacks();
  }
});

watch(
  () => route.query?.tab,
  (tab) => {
    if (typeof tab === 'string' && tabs.value.some(t => t.id === tab)) {
      activeTab.value = tab;
    }
  }
);

const verDetalles = (ent) => {
  if (!ent || !ent.id) return;
  router.push({
    name: 'DetalleEntrenamiento',
    params: { id: ent.id },
    query: { from: 'admin', tab: 'historial' }
  });
};
</script>
