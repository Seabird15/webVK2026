<template>
  <div class="min-h-screen ">
    <!-- Header con gradiente -->
    <div class="bg-linear-to-b from-primary-dark to-transparent text-white  z-40 shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button
            @click="volver"
            class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeftIcon class="w-5 h-5" />
          </button>
          <div class="flex-1">
            <h1 class="text-xl font-black uppercase tracking-wide">{{ entrenamiento?.nombre || 'Cargando...' }}</h1>
            <div class="flex items-center gap-3 text-xs mt-1 opacity-90">
              <span class="flex items-center gap-1">
                <CalendarIcon class="w-4 h-4" />
                {{ formatearFecha(entrenamiento?.fecha) }}
              </span>
              <span class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                {{ entrenamiento?.hora }}<template v-if="entrenamiento?.horaFin"> - {{ entrenamiento?.horaFin }}</template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-if="entrenamiento" class="max-w-6xl mx-auto p-4 bg-black">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Columna izquierda - Info del evento -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Convocatoria Badge -->
          <div v-if="entrenamiento.esConvocatoria" class="bg-purple-500 text-white rounded-xl p-4 shadow-lg">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ClipboardDocumentListIcon class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-black text-sm uppercase">Convocatoria Oficial</h3>
                <p class="text-xs opacity-90">Solo convocadas</p>
              </div>
            </div>
          </div>

          <!-- Información del evento -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="px-4 py-3">
              <h2 class="text-black font-black text-xs uppercase">Información del Evento</h2>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-bold uppercase">Ubicación</p>
                  <p class="text-sm text-gray-900 font-semibold">{{ entrenamiento.lugar }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserGroupIcon class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-bold uppercase">Equipo</p>
                  <p class="text-sm text-gray-900 font-semibold capitalize">{{ entrenamiento.equipo }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentTextIcon class="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-bold uppercase">Descripción</p>
                  <p class="text-sm text-gray-700 leading-relaxed">{{ entrenamiento.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tu estado -->
          <div class="overflow-hidden">
   
            <div class="p-4">
              <!-- Mensaje si la fecha pasó -->
              <div v-if="fechaPasada(entrenamiento)" class="mb-3 p-3 bg-gray-100 rounded-lg border-l-4 border-gray-400">
                <p class="text-xs text-gray-700 font-bold flex items-center gap-2">
                  <ExclamationTriangleIcon class="w-4 h-4" />
                  Este evento ya finalizó
                </p>
              </div>

              <!-- Estado actual -->
              <div v-if="estadoInscripcion === 'confirmada' || estadoInscripcion === 'baja'" class="mb-3">
                <div :class="[
                  'p-3 rounded-lg border-l-4',
                  estadoInscripcion === 'confirmada' 
                    ? 'bg-green-50 border-green-700' 
                    : 'bg-red-50 border-red-700'
                ]">
                  <div class="flex items-center gap-2 mb-1">
                    <CheckCircleIcon v-if="estadoInscripcion === 'confirmada'" class="w-6 h-6 text-green-600" />
                    <XCircleIcon v-else class="w-6 h-6 text-red-600" />
                    <span :class="[
                      'font-black text-sm',
                      estadoInscripcion === 'confirmada' ? 'text-green-800' : 'text-red-800'
                    ]">
                      {{ estadoInscripcion === 'confirmada' ? 'CONFIRMADA' : 'AUSENTE' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 ml-8">
                    Puedes cambiar tu respuesta
                  </p>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="space-y-2">
                <!-- Solo mostrar botones de inscripción si NO es admin -->
                <template v-if="canInteract && !vieneDeAdmin">
                  <!-- Si ya confirmó y el evento no pasó -->
                  <button
                    v-if="estadoInscripcion === 'confirmada' && !fechaPasada(entrenamiento)"
                    @click="abrirModalBaja"
                    :disabled="isLoadingAccion"
                    class="w-full px-4 py-3 rounded-lg font-bold transition-all text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowPathIcon class="w-5 h-5" />
                    Cambiar a Ausente
                  </button>
                  <!-- Si se dio de baja y el evento no pasó -->
                  <button
                    v-else-if="estadoInscripcion === 'baja' && !fechaPasada(entrenamiento)"
                    @click="handleInscribirse"
                    :disabled="isLoadingAccion"
                    class="w-full px-4 py-3 rounded-lg font-bold transition-all text-sm bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowPathIcon class="w-5 h-5" />
                    Cambiar a Confirmada
                  </button>
                  <!-- Si no ha respondido y el evento no pasó -->
                  <template v-else-if="!estadoInscripcion || (estadoInscripcion === 'pendiente' && !fechaPasada(entrenamiento))">
                    <button
                      @click="handleInscribirse"
                      :disabled="isLoadingAccion"
                      class="w-full px-4 py-3 rounded-lg font-bold transition-all text-sm bg-green-700 text-white hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckIcon class="w-5 h-5" />
                      Confirmar Asistencia
                    </button>
                    <button
                      @click="abrirModalBaja"
                      :disabled="isLoadingAccion"
                      class="w-full px-4 py-3 rounded-lg font-bold transition-all text-sm bg-red-700 text-white hover:bg-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <XMarkIcon class="w-5 h-5" />
                      Darme de Baja
                    </button>
                  </template>
                </template>

                <!-- Mensaje informativo para admin -->
                <div v-if="vieneDeAdmin && adminPuedeVer" class="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p class="text-sm text-gray-700 font-semibold">
                    👨‍💼 Modo Administrador: Gestiona las asistencias de las jugadoras en la lista de convocatoria.
                  </p>
                </div>

                <div v-else-if="!canInteract && !vieneDeAdmin" class="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p class="text-sm text-gray-700 font-semibold">
                    <span v-if="entrenamiento.esConvocatoria && !isConvocada">No estás convocada para este entrenamiento. Solo puedes visualizar los detalles.</span>
                    <span v-else-if="fechaPasada(entrenamiento)">El evento ya finalizó. No se pueden hacer cambios.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="mvpPendienteHabilitacion" class="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p class="text-xs text-blue-800 font-bold">
              Votación MVP disponible desde: {{ mvpDisponibleDesdeTexto }}
            </p>
          </div>

          <div v-if="esMvpDisponible" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-200">
              <h2 class="text-black font-black text-xs uppercase">Votación MVP Post-Partido</h2>
              <p class="text-[11px] text-gray-500 mt-1">Vota por la jugadora destacada del partido</p>
            </div>

            <div class="p-4 space-y-3">
              <div v-if="mvpGanadora" class="bg-linear-to-r from-yellow-50 via-amber-50 to-orange-100 border-2 border-yellow-300 rounded-2xl p-3 shadow-lg relative overflow-hidden">
                <SparklesIcon class="absolute -top-3 -right-3 w-10 h-10 text-yellow-500 opacity-20 animate-pulse" />
                <TrophyIcon class="absolute -bottom-3 -left-2 w-8 h-8 text-yellow-600 opacity-20 animate-bounce" />

                <div class="flex items-center gap-3 relative z-10">
                  <div class="relative shrink-0">
                    <img
                      v-if="mvpGanadoraFoto"
                      :src="mvpGanadoraFoto"
                      :alt="mvpGanadora.nombre"
                      class="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 shadow"
                    />
                    <div
                      v-else
                      class="w-14 h-14 rounded-full bg-linear-to-br from-primary-dark to-primary text-white border-2 border-yellow-400 shadow flex items-center justify-center font-black"
                    >
                      {{ obtenerIniciales(mvpGanadora.nombre) }}
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
                    <p class="text-base font-black text-yellow-900 truncate">{{ mvpGanadora.nombre }}</p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <p class="text-xs font-semibold text-yellow-800">{{ mvpGanadora.votos }} {{ mvpGanadora.votos === 1 ? 'voto' : 'votos' }}</p>
                      <span v-if="mvpGanadoraFotoCargando" class="text-[10px] bg-white/70 text-yellow-900 px-2 py-0.5 rounded-full font-bold">cargando foto...</span>
                    </div>
                  </div>
                </div>
              </div>

              <p v-if="mvpCerrada" class="text-xs font-bold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg p-2 flex items-center gap-1.5">
                <LockClosedIcon class="w-3.5 h-3.5" />
                <span>Votación finalizada por administración.</span>
              </p>

              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 font-semibold">Total de votos</span>
                <span class="text-primary-dark font-black">{{ totalVotosMvp }}</span>
              </div>

              <div v-if="mvpLider" class="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p class="text-xs text-gray-600 font-semibold">Lidera actualmente</p>
                <p class="text-sm font-black text-primary-dark">{{ mvpLider.nombre }} ({{ mvpLider.votos }} {{ mvpLider.votos === 1 ? 'voto' : 'votos' }})</p>
              </div>

              <div v-if="candidatasMvp.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  v-for="nombre in candidatasMvp"
                  :key="`mvp-${entrenamiento.id}-${nombre}`"
                  @click="votarMvp(nombre)"
                  :disabled="!puedeVotarMvp || mvpVoteLoading"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    mvpVotoUsuario === nombre
                      ? 'bg-primary text-white border-primary-dark'
                      : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                  ]"
                >
                  {{ nombre }}
                </button>
              </div>

              <p v-if="mvpVotoUsuario" class="text-xs text-gray-600">
                Tu voto: <span class="font-black text-primary-dark">{{ mvpVotoUsuario }}</span>
              </p>

              <p v-if="!puedeVotarMvp && !mvpCerrada" class="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-2">
                Solo jugadoras pueden votar MVP desde su cuenta.
              </p>
            </div>
          </div>
        </div>

        <!-- Columna derecha - Lista de convocatoria -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <!-- Stats Header -->
       

            <!-- Tabs -->
            <div class="flex bg-gray-100 border-b-2 border-gray-200 overflow-visible">
              <button
                @click="tabActivo = 'confirmadas'"
                :class="[
                  'flex-1 py-2 px-2 sm:py-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wide transition-all relative min-h-[44px] cursor-pointer',
                  tabActivo === 'confirmadas'
                    ? 'text-green-700 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center whitespace-normal">
                  <CheckIcon class="w-4 h-4" />
                  <span>Confirmadas</span>
                  <span class="bg-green-700 text-white rounded-full px-2 py-0.5 text-[10px]">{{ inscritasOrganizadas.confirmadas.length }}</span>
                </span>
                <div v-if="tabActivo === 'confirmadas'" class="absolute bottom-0 left-0 right-0 h-1 bg-green-700"></div>
              </button>
              <button
                @click="tabActivo = 'bajas'"
                :class="[
                  'flex-1 py-2 px-2 sm:py-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wide transition-all relative min-h-[44px] cursor-pointer',
                  tabActivo === 'bajas'
                    ? 'text-red-700 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center whitespace-normal">
                  <XMarkIcon class="w-4 h-4" />
                  <span>Ausentes</span>
                  <span class="bg-red-700 text-white rounded-full px-2 py-0.5 text-[10px]">{{ inscritasOrganizadas.bajas.length }}</span>
                </span>
                <div v-if="tabActivo === 'bajas'" class="absolute bottom-0 left-0 right-0 h-1 bg-red-700"></div>
              </button>
              <button
                @click="tabActivo = 'pendientes'"
                :class="[
                  'flex-1 py-2 px-2 sm:py-3 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wide transition-all relative min-h-[44px] cursor-pointer',
                  tabActivo === 'pendientes'
                    ? 'text-yellow-700 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center whitespace-normal">
                  <ClockIcon class="w-4 h-4" />
                  <span>Pendientes</span>
                  <span class="bg-yellow-700 text-white rounded-full px-2 py-0.5 text-[10px]">{{ inscritasOrganizadas.pendientes.length }}</span>
                </span>
                <div v-if="tabActivo === 'pendientes'" class="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500"></div>
              </button>
            </div>

            <!-- Player List -->
            <div class="p-4 bg-gray-50 min-h-100">
              <!-- Confirmadas -->
              <div v-show="tabActivo === 'confirmadas'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-if="inscritasOrganizadas.confirmadas.length === 0" class="col-span-2 text-center py-12 text-gray-400">
                  <UserGroupIcon class="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p class="text-sm font-medium">Aún no hay confirmaciones</p>
                </div>
                <div
                  v-for="(inscrita, index) in inscritasOrganizadas.confirmadas"
                  :key="inscrita.id"
                  class="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all"
                >
                  <div class="w-12 h-12 bg-linear-to-br from-primary-dark to-primary-light rounded-full flex items-center justify-center text-white font-black shadow-md">
                    {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                    <div v-if="inscrita.updatedAt || inscrita.createdAt" class="text-xs text-gray-400 mt-1">Anotada: {{ formatFechaHora(inscrita.updatedAt || inscrita.createdAt) }}</div>
                  </div>
                  <div v-if="vieneDeAdmin && adminPuedeVer" class="flex gap-2">
                    <button
                      @click="cambiarEstadoInscripcion(inscrita.id, 'baja')"
                      class="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer"
                      title="Marcar como ausente"
                    >
                      Ausente
                    </button>
                    <button
                      @click="cambiarEstadoInscripcion(inscrita.id, 'pendiente')"
                      class="px-3 py-1.5 bg-yellow-500 text-white rounded-md text-xs font-bold hover:bg-yellow-600 transition-colors cursor-pointer"
                      title="Marcar como pendiente"
                    >
                      Pendiente
                    </button>
                  </div>
                  <div v-else class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckIcon class="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <!-- Bajas -->
              <div v-show="tabActivo === 'bajas'" class="grid grid-cols-1 gap-3">
                <div v-if="inscritasOrganizadas.bajas.length === 0" class="text-center py-12 text-gray-400">
                  <HandThumbUpIcon class="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p class="text-sm font-medium">No hay ausencias</p>
                </div>
                <div
                  v-for="(inscrita, index) in inscritasOrganizadas.bajas"
                  :key="inscrita.id"
                  class="bg-white rounded-lg border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all"
                >
                  <div class="flex items-center gap-3 p-3">
                    <div class="w-12 h-12 bg-linear-to-br from-red-700 to-red-800 rounded-full flex items-center justify-center text-white font-black shadow-md">
                      {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                      <div class="text-xs text-gray-500">No asistirá</div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div v-if="inscrita.motivoBaja" class="px-2 py-1 bg-blue-100 rounded-full flex items-center gap-1">
                        <ChatBubbleLeftIcon class="w-3 h-3 text-blue-700" />
                        <span class="text-blue-700 text-xs font-bold">Motivo</span>
                      </div>
                      <div v-if="vieneDeAdmin && adminPuedeVer" class="flex gap-2">
                        <button
                          @click="cambiarEstadoInscripcion(inscrita.id, 'confirmada')"
                          class="px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-bold hover:bg-green-600 transition-colors cursor-pointer"
                          title="Marcar como confirmada"
                        >
                          Confirmar
                        </button>
                        <button
                          @click="cambiarEstadoInscripcion(inscrita.id, 'pendiente')"
                          class="px-3 py-1.5 bg-yellow-500 text-white rounded-md text-xs font-bold hover:bg-yellow-600 transition-colors cursor-pointer"
                          title="Marcar como pendiente"
                        >
                          Pendiente
                        </button>
                      </div>
                      <div v-else class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <XMarkIcon class="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                  </div>
                  <div v-if="inscrita.motivoBaja" class="px-3 pb-3">
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded flex gap-2">
                      <ChatBubbleLeftIcon class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p class="text-xs text-gray-700 italic">"{{ inscrita.motivoBaja }}"</p>
                    </div>
                    <div class="px-3 pt-2 text-xs text-gray-400">Dada de baja: {{ formatFechaHora(inscrita.fechaBaja || inscrita.updatedAt) }}</div>
                  </div>
                </div>
              </div>

              <!-- Pendientes -->
              <div v-show="tabActivo === 'pendientes'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-if="inscritasOrganizadas.pendientes.length === 0" class="col-span-2 text-center py-12 text-gray-400">
                  <CheckBadgeIcon class="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p class="text-sm font-medium">Todas han respondido</p>
                </div>
                <div
                  v-for="(inscrita, index) in inscritasOrganizadas.pendientes"
                  :key="inscrita.id"
                  class="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all"
                >
                  <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-black shadow-md">
                    {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                    <div class="text-xs text-gray-500">Esperando respuesta...</div>
                  </div>
                  <div v-if="vieneDeAdmin && adminPuedeVer" class="flex gap-2">
                    <button
                      @click="cambiarEstadoInscripcion(inscrita.id, 'confirmada')"
                      class="px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-bold hover:bg-green-600 transition-colors cursor-pointer"
                      title="Marcar como confirmada"
                    >
                      Confirmar
                    </button>
                    <button
                      @click="cambiarEstadoInscripcion(inscrita.id, 'baja')"
                      class="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer"
                      title="Marcar como ausente"
                    >
                      Ausente
                    </button>
                  </div>
                  <div v-else class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <ClockIcon class="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <ArrowPathIcon class="w-16 h-16 mx-auto mb-4 text-gray-400 animate-spin" />
        <p class="text-gray-500">Cargando detalles...</p>
      </div>
    </div>

    <!-- Modal de motivo de baja -->
    <div v-if="mostrarModalBaja" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-black text-gray-900 uppercase">Dar de Baja</h2>
          <p class="text-sm text-gray-600 mt-1">Indica el motivo de tu ausencia</p>
        </div>

        <div class="p-6">
          <label class="block text-xs font-bold text-gray-700 mb-2 uppercase">Motivo (opcional):</label>
          <textarea
            v-model="motivoBaja"
            placeholder="Ej: Tengo un examen, Estoy enferma, Compromiso familiar..."
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows="4"
            maxlength="200"
          ></textarea>
          <p class="text-xs text-gray-500 mt-2">{{ motivoBaja.length }}/200 caracteres</p>
        </div>

        <div class="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            @click="cerrarModalBaja"
            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            :disabled="isLoadingAccion"
          >
            Cancelar
          </button>
          <button
            @click="confirmarBaja"
            class="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
            :disabled="isLoadingAccion"
          >
            {{ isLoadingAccion ? 'Procesando...' : 'Confirmar Baja' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMensaje" :class="[
      'fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white font-bold transition-opacity shadow-xl',
      toastTipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]">
      {{ toastMensaje }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  ChevronLeftIcon,
  CalendarIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  HandThumbUpIcon,
  CheckBadgeIcon,
  ChatBubbleLeftIcon,
  TrophyIcon,
  SparklesIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline';
import { jugadoraAuthUser, jugadoraData } from '../firebase/jugadorasAuth';
import { 
  inscribirseEntrenamiento, 
  desuscribirseEntrenamiento,
  obtenerEstadoInscripcion,
  escucharInscripcionesEntrenamiento,
  errorInscripciones,
  cambiarEstadoInscripcion as cambiarEstadoInscripcionFirebase
} from '../firebase/inscripciones';
import { entrenamientos, votarMvpEntrenamiento } from '../firebase/entrenamientos';
import { authUser, userRole } from '../firebase/auth';

const router = useRouter();
const route = useRoute();

const entrenamiento = ref(null);
const estadoInscripcion = ref(null);
const inscritasOrganizadas = ref({
  confirmadas: [],
  bajas: [],
  pendientes: []
});
const isConvocada = ref(true);
const tabActivo = ref('confirmadas');
const mostrarModalBaja = ref(false);
const motivoBaja = ref('');
const isLoadingAccion = ref(false);
const toastMensaje = ref(null);
const toastTipo = ref('success');
const unsubscribers = ref([]);
const mvpVoteLoading = ref(false);
const mvpVotoUsuario = ref(null);
const mvpGanadoraFoto = ref('');
const mvpGanadoraFotoCargando = ref(false);
const cacheFotosJugadoras = ref({});
const DOS_HORAS_MS = 2 * 60 * 60 * 1000;
const DURACION_PARTIDO_DEFAULT_MS = 90 * 60 * 1000;

const vieneDeAdmin = computed(() => route.query?.from === 'admin');
const adminPuedeVer = computed(() => {
  return !!authUser.value && (userRole.value === 'admin' || userRole.value === 'coach');
});

// Verificar autenticación
if (!jugadoraAuthUser.value && !(vieneDeAdmin.value && adminPuedeVer.value)) {
  router.push('/login-jugadora');
}

const volver = () => {
  if (vieneDeAdmin.value) {
    router.push({ path: '/admin', query: { tab: (route.query?.tab || 'historial') } });
    return;
  }
  router.push('/entrenamientos');
};

const obtenerIniciales = (nombre) => {
  if (!nombre) return '?';
  const partes = nombre.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
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

const esPartidoOAmistoso = (ent) => {
  const tipo = (ent?.tipo || '').toString().toLowerCase();
  return tipo === 'partido' || tipo === 'amistoso';
};

const parseHora = (horaTexto = '') => {
  const [horas, minutos] = (horaTexto || '').split(':').map(Number);
  return {
    horas: Number.isFinite(horas) ? horas : 0,
    minutos: Number.isFinite(minutos) ? minutos : 0
  };
};

const obtenerInicioFinEvento = (ent) => {
  if (!ent?.fecha) return { inicioMs: null, finMs: null };
  const base = new Date(ent.fecha.seconds ? ent.fecha.seconds * 1000 : ent.fecha);
  if (Number.isNaN(base.getTime())) return { inicioMs: null, finMs: null };

  const horaTexto = (ent?.hora || '').toString().trim();
  const horaFinTexto = (ent?.horaFin || '').toString().trim();
  const partes = horaTexto.split('-').map((p) => p.trim()).filter(Boolean);
  const inicio = new Date(base);
  const fin = new Date(base);

  const horaInicio = parseHora(partes[0] || '00:00');
  inicio.setHours(horaInicio.horas, horaInicio.minutos, 0, 0);

  if (horaFinTexto) {
    const horaFin = parseHora(horaFinTexto);
    fin.setHours(horaFin.horas, horaFin.minutos, 0, 0);
  } else if (partes.length > 1) {
    const horaFin = parseHora(partes[1]);
    fin.setHours(horaFin.horas, horaFin.minutos, 0, 0);
  } else if (esPartidoOAmistoso(ent)) {
    fin.setTime(inicio.getTime() + DURACION_PARTIDO_DEFAULT_MS);
  } else {
    fin.setTime(inicio.getTime());
  }

  return {
    inicioMs: inicio.getTime(),
    finMs: fin.getTime()
  };
};

const eventoFueraDeVentanaJugadora = (ent) => {
  const { finMs } = obtenerInicioFinEvento(ent);
  if (!Number.isFinite(finMs)) return false;

  if (esPartidoOAmistoso(ent)) {
    return Date.now() > finMs + DOS_HORAS_MS;
  }

  return Date.now() > finMs + (24 * 60 * 60 * 1000);
};

const formatFechaHora = (timestamp) => {
  if (!timestamp) return '-';
  const d = new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const fechaPasada = (ent) => {
  const { finMs } = obtenerInicioFinEvento(ent);
  return Number.isFinite(finMs) ? Date.now() > finMs : false;
};

const cargarDatos = async () => {
  const id = route.params.id;
  if (!id) {
    volver();
    return;
  }

  // Buscar el entrenamiento
  entrenamiento.value = entrenamientos.value.find(e => e.id === id);
  
  if (!entrenamiento.value) {
    volver();
    return;
  }

  if (!vieneDeAdmin.value && eventoFueraDeVentanaJugadora(entrenamiento.value)) {
    router.push('/entrenamientos');
    return;
  }

  cargarVotoMvpUsuario(id);

  const entrenamientoRef = doc(db, 'entrenamientos', id);
  const unsubscribeEntrenamiento = onSnapshot(entrenamientoRef, (docSnap) => {
    if (docSnap.exists()) {
      entrenamiento.value = {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
  });
  unsubscribers.value.push(unsubscribeEntrenamiento);

  // Obtener estado de inscripción
  if (jugadoraAuthUser.value) {
    estadoInscripcion.value = await obtenerEstadoInscripcion(id, jugadoraAuthUser.value.uid);
  }

console.log('📋 DEBUG - Entrenamiento cargado:', {
    id: entrenamiento.value.id,
    nombre: entrenamiento.value.nombre,
    esConvocatoria: entrenamiento.value.esConvocatoria,
    convocadas: entrenamiento.value.convocadas,
    tieneConvocadas: !!entrenamiento.value.convocadas,
    cantidadConvocadas: entrenamiento.value.convocadas?.length
  });

  // Escuchar cambios en inscripciones
  const unsubscribe = escucharInscripcionesEntrenamiento(id, (organizadas) => {
    inscritasOrganizadas.value = organizadas;
    // Actualizar si la jugadora actual forma parte de la convocatoria (si aplica)
    actualizarConvocatoriaUsuario(organizadas);
  }, () => entrenamiento.value); // Pasar función que retorna el entrenamiento actualizado

  unsubscribers.value.push(unsubscribe);
};

const actualizarConvocatoriaUsuario = (organizadas) => {
  // Si el entrenamiento no es convocatoria, todas pueden interactuar
  if (!entrenamiento.value?.esConvocatoria) {
    isConvocada.value = true;
    return;
  }

  // Buscar la inscripcion de la jugadora en cualquiera de los arrays
  const todas = [
    ...organizadas.confirmadas,
    ...organizadas.bajas,
    ...organizadas.pendientes
  ];

  const miInscripcion = todas.find(i => i.jugadoraId === jugadoraAuthUser.value?.uid);
  if (miInscripcion) {
    isConvocada.value = !!miInscripcion.esConvocada;
    return;
  }

  // Si no existe inscripción, verificar en el propio objeto de entrenamiento (por si se almacenó la nómina ahí)
  if (entrenamiento.value?.jugadorasConvocadas && Array.isArray(entrenamiento.value.jugadorasConvocadas)) {
    isConvocada.value = entrenamiento.value.jugadorasConvocadas.some(j => j.id === jugadoraAuthUser.value?.uid);
    return;
  }

  // Por defecto: no convocada
  isConvocada.value = false;
};

const canInteract = computed(() => {
  if (!entrenamiento.value) return false;
  
  // Si es admin, siempre puede interactuar (incluso con eventos pasados)
  if (vieneDeAdmin.value && adminPuedeVer.value) return true;
  
  // Si no es convocatoria, todas las jugadoras pueden interactuar (si el evento no pasó)
  if (!entrenamiento.value.esConvocatoria) return !fechaPasada(entrenamiento.value);
  // Si es convocatoria, solo las convocadas y si el evento no pasó
  return isConvocada.value && !fechaPasada(entrenamiento.value);
});

const mvpEsPartido = computed(() => {
  if (!entrenamiento.value) return false;
  const tipo = (entrenamiento.value.tipo || '').toLowerCase();
  return tipo === 'partido' || tipo === 'amistoso';
});

const mvpHabilitadoEvento = computed(() => {
  if (!entrenamiento.value) return false;
  const mvpRaw = entrenamiento.value.mvpHabilitado;
  return mvpRaw === undefined || mvpRaw === null
    ? true
    : (mvpRaw === true || mvpRaw === 'true' || mvpRaw === 1);
});

const mvpCerrada = computed(() => entrenamiento.value?.mvpCerrada === true);

const mvpDisponibleDesdeTexto = computed(() => {
  if (!entrenamiento.value) return '';
  const { finMs } = obtenerInicioFinEvento(entrenamiento.value);
  if (!Number.isFinite(finMs)) return 'Hora por confirmar';

  return new Date(finMs).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const esMvpDisponible = computed(() => {
  if (!entrenamiento.value) return false;
  return mvpEsPartido.value && mvpHabilitadoEvento.value && fechaPasada(entrenamiento.value);
});

const mvpPendienteHabilitacion = computed(() => {
  if (!entrenamiento.value) return false;
  return mvpEsPartido.value && mvpHabilitadoEvento.value && !fechaPasada(entrenamiento.value);
});

const candidatasMvp = computed(() => {
  if (!entrenamiento.value) return [];

  const desdeConvocatoria = Array.isArray(entrenamiento.value.jugadorasConvocadas)
    ? entrenamiento.value.jugadorasConvocadas.map((j) => (j?.nombre || '').trim()).filter(Boolean)
    : [];

  const desdeInscripciones = [
    ...inscritasOrganizadas.value.confirmadas,
    ...inscritasOrganizadas.value.bajas
  ]
    .map((i) => (i?.jugadoraNombre || '').trim())
    .filter(Boolean);

  return [...new Set([...desdeConvocatoria, ...desdeInscripciones])];
});

const totalVotosMvp = computed(() => {
  if (!Array.isArray(entrenamiento.value?.mvpVotos)) return 0;
  return entrenamiento.value.mvpVotos.reduce((total, item) => total + (Number(item?.votos) || 0), 0);
});

const mvpLider = computed(() => {
  if (!Array.isArray(entrenamiento.value?.mvpVotos) || entrenamiento.value.mvpVotos.length === 0) return null;
  return [...entrenamiento.value.mvpVotos].sort((a, b) => (Number(b?.votos) || 0) - (Number(a?.votos) || 0))[0];
});

const mvpGanadora = computed(() => {
  if (!mvpCerrada.value) return null;
  return mvpLider.value;
});

const obtenerFotoCandidata = (nombre) => {
  if (!entrenamiento.value || !nombre) return '';
  const convocadas = Array.isArray(entrenamiento.value.jugadorasConvocadas)
    ? entrenamiento.value.jugadorasConvocadas
    : [];

  const candidata = convocadas.find((j) => (j?.nombre || '').trim().toLowerCase() === nombre.trim().toLowerCase());
  if (!candidata) return '';

  return candidata.fotoPerfil || candidata.foto || candidata.imagen || candidata.photoURL || candidata.urlFoto || '';
};

const normalizarNombre = (nombre) => (nombre || '').toString().trim().toLowerCase();

const obtenerJugadoraIdGanadora = () => {
  const nombreGanadora = normalizarNombre(mvpGanadora.value?.nombre);
  if (!nombreGanadora) return null;

  const inscripciones = [
    ...inscritasOrganizadas.value.confirmadas,
    ...inscritasOrganizadas.value.bajas,
    ...inscritasOrganizadas.value.pendientes
  ];

  const encontradaEnInscripciones = inscripciones.find(
    (item) => normalizarNombre(item?.jugadoraNombre) === nombreGanadora && item?.jugadoraId
  );

  if (encontradaEnInscripciones?.jugadoraId) return encontradaEnInscripciones.jugadoraId;

  const convocadas = Array.isArray(entrenamiento.value?.jugadorasConvocadas)
    ? entrenamiento.value.jugadorasConvocadas
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

const resolverFotoMvpGanadora = async () => {
  mvpGanadoraFoto.value = '';

  if (!mvpGanadora.value?.nombre) return;

  const fotoConvocada = obtenerFotoCandidata(mvpGanadora.value.nombre);
  if (fotoConvocada) {
    mvpGanadoraFoto.value = fotoConvocada;
    return;
  }

  const jugadoraId = obtenerJugadoraIdGanadora();
  if (!jugadoraId) return;

  try {
    mvpGanadoraFotoCargando.value = true;
    const fotoPerfil = await obtenerFotoPerfilJugadora(jugadoraId);
    mvpGanadoraFoto.value = fotoPerfil || '';
  } catch {
    mvpGanadoraFoto.value = '';
  } finally {
    mvpGanadoraFotoCargando.value = false;
  }
};

watch(
  () => [
    entrenamiento.value?.id,
    mvpGanadora.value?.nombre,
    inscritasOrganizadas.value.confirmadas.length,
    inscritasOrganizadas.value.bajas.length,
    inscritasOrganizadas.value.pendientes.length
  ],
  () => {
    resolverFotoMvpGanadora();
  },
  { immediate: true }
);

const puedeVotarMvp = computed(() => {
  return esMvpDisponible.value
    && !!jugadoraAuthUser.value
    && !vieneDeAdmin.value
    && !mvpCerrada.value;
});

const cargarVotoMvpUsuario = (entrenamientoId) => {
  if (!entrenamientoId) {
    mvpVotoUsuario.value = null;
    return;
  }
  mvpVotoUsuario.value = localStorage.getItem(`mvp_voto_entrenamiento_${entrenamientoId}`);
};

const votarMvp = async (jugadoraNombre) => {
  if (!entrenamiento.value?.id || !puedeVotarMvp.value || mvpVoteLoading.value) return;
  if (mvpVotoUsuario.value === jugadoraNombre) return;

  mvpVoteLoading.value = true;
  try {
    const votosActualizados = await votarMvpEntrenamiento(
      entrenamiento.value.id,
      jugadoraNombre,
      mvpVotoUsuario.value || null
    );

    entrenamiento.value = {
      ...entrenamiento.value,
      mvpVotos: votosActualizados
    };

    mvpVotoUsuario.value = jugadoraNombre;
    localStorage.setItem(`mvp_voto_entrenamiento_${entrenamiento.value.id}`, jugadoraNombre);
    mostrarToast('¡Tu voto MVP fue registrado!', 'success');
  } catch (err) {
    mostrarToast(err?.message || 'No se pudo registrar el voto MVP', 'error');
  } finally {
    mvpVoteLoading.value = false;
  }
};

const handleInscribirse = async () => {
  if (!jugadoraData.value) return;
  if (!canInteract.value) {
    mostrarToast('No puedes interactuar en este entrenamiento', 'error');
    return;
  }
  
  const nombreCompleto = `${jugadoraData.value.nombre || ''} ${jugadoraData.value.apellido || ''}`.trim();
  if (!nombreCompleto) {
    mostrarToast('Error: datos de perfil incompletos', 'error');
    return;
  }
  
  isLoadingAccion.value = true;
  const success = await inscribirseEntrenamiento(
    entrenamiento.value.id,
    jugadoraAuthUser.value.uid,
    nombreCompleto
  );

  if (success) {
    mostrarToast('¡Asistencia confirmada!', 'success');
    estadoInscripcion.value = await obtenerEstadoInscripcion(entrenamiento.value.id, jugadoraAuthUser.value.uid);
  } else {
    mostrarToast(errorInscripciones.value || 'Error al inscribirse', 'error');
  }
  isLoadingAccion.value = false;
};

const abrirModalBaja = () => {
  if (!canInteract.value) {
    mostrarToast('No puedes interactuar en este entrenamiento', 'error');
    return;
  }
  motivoBaja.value = '';
  mostrarModalBaja.value = true;
};

const cerrarModalBaja = () => {
  mostrarModalBaja.value = false;
  motivoBaja.value = '';
};

const confirmarBaja = async () => {
  if (!canInteract.value) {
    cerrarModalBaja();
    mostrarToast('No puedes interactuar en este entrenamiento', 'error');
    return;
  }

  isLoadingAccion.value = true;
  const success = await desuscribirseEntrenamiento(
    entrenamiento.value.id,
    jugadoraAuthUser.value.uid,
    motivoBaja.value
  );

  if (success) {
    mostrarToast('Te diste de baja correctamente', 'success');
    estadoInscripcion.value = await obtenerEstadoInscripcion(entrenamiento.value.id, jugadoraAuthUser.value.uid);
    cerrarModalBaja();
  } else {
    mostrarToast(errorInscripciones.value || 'Error al darse de baja', 'error');
  }
  isLoadingAccion.value = false;
};

const cambiarEstadoInscripcion = async (inscripcionId, nuevoEstado) => {
  if (!adminPuedeVer.value) {
    mostrarToast('No tienes permisos para realizar esta acción', 'error');
    return;
  }

  const success = await cambiarEstadoInscripcionFirebase(inscripcionId, nuevoEstado);
  
  if (success) {
    const estadoTexto = nuevoEstado === 'confirmada' ? 'confirmada' : nuevoEstado === 'baja' ? 'ausente' : 'pendiente';
    mostrarToast(`Estado cambiado a ${estadoTexto}`, 'success');
  } else {
    mostrarToast(errorInscripciones.value || 'Error al cambiar estado', 'error');
  }
};

const mostrarToast = (mensaje, tipo) => {
  toastMensaje.value = mensaje;
  toastTipo.value = tipo;
  setTimeout(() => {
    toastMensaje.value = null;
  }, 3000);
};

onMounted(() => {
  cargarDatos();
});

onUnmounted(() => {
  unsubscribers.value.forEach(unsub => unsub());
  unsubscribers.value = [];
});
</script>
