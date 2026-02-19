<template>
  <div class="min-h-screen bg-black">
    <!-- Header -->
    <div class="bg-linear-to-b from-primary-dark to-transparent text-white p-6  z-40">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">Entrenamientos</h1>
            <p class="text-sm text-white tracking-widest mt-1">
              <span v-if="equipoSeleccionado">{{ equipoSeleccionado === 'ascenso' ? 'Equipo Ascenso' : 'Equipo Escuela' }}</span>
            </p>
          </div>
          <button
            @click="handleLogout"
            class="bg-white text-red-500 my-2 hover:bg-opacity-90 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Información de jugadora -->
      <div v-if="jugadoraData" class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="flex justify-between items-start">
          <div class="flex flex-col lg:flex-row gap-4 flex-1">
            <div v-if="jugadoraData.fotoPerfil" class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img :src="jugadoraData.fotoPerfil" alt="Perfil" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ jugadoraData.nombre }} {{ jugadoraData.apellido }}
              </h2>
              <p class="text-gray-600">{{ jugadoraData.posicion }} - Dorsal #{{ jugadoraData.dorsal }}</p>
              
              <!-- Tarjeta de Cumpleaños Mejorada -->
              <div v-if="cumpleaniosHoy.length > 0 || proximoCumpleanios.length > 0" class="mt-3 space-y-2">
                <!-- Cumpleaños HOY -->
                <div v-if="cumpleaniosHoy.length > 0" class="bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 p-3 rounded-xl shadow-lg border border-white/20 animate-pulse">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center animate-bounce">
                      <CakeIcon class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-1.5">
                        <h3 class="text-white font-bold text-sm uppercase tracking-wide">¡Cumpleaños HOY!</h3>
                        <SparklesIcon class="w-4 h-4 text-yellow-300" />
                      </div>
                      <p class="text-white/90 text-[10px] font-medium">{{ cumpleaniosHoy.length === 1 ? 'Felicitemos a:' : 'Felicitemos a todas:' }}</p>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div
                      v-for="(cumple, index) in cumpleaniosHoy"
                      :key="index"
                      class="bg-white/95 backdrop-blur-sm p-2 rounded-lg border border-pink-300 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-7 h-7 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                            {{ obtenerIniciales(cumple.nombre) }}
                          </div>
                          <div>
                            <p class="font-bold text-gray-900 text-xs">{{ cumple.nombre }}</p>
                            <p class="text-pink-600 text-[10px] font-medium">{{ cumple.edad }} años</p>
                          </div>
                        </div>
                        <div class="flex flex-col items-end gap-0.5">
                          <span class="bg-linear-to-r from-pink-500 to-purple-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">HOY</span>
                          <span class="text-gray-600 text-[9px] font-medium">{{ cumple.fechaFormateada }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Próximos Cumpleaños (si no hay hoy) -->
                <div v-else-if="proximoCumpleanios.length > 0" class="bg-linear-to-r from-pink-50 via-purple-50 to-indigo-50 p-3 rounded-xl border border-pink-200 shadow-sm">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-linear-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <CakeIcon class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-pink-700 text-xs uppercase tracking-wide">Próximo{{ proximoCumpleanios.length > 1 ? 's' : '' }} Cumpleaños</h3>
                      <p class="text-gray-600 text-[10px] font-medium">{{ proximoCumpleanios[0].diasRestantes === 1 ? '¡Mañana!' : `En ${proximoCumpleanios[0].diasRestantes} días` }}</p>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div
                      v-for="(cumple, index) in proximoCumpleanios"
                      :key="index"
                      class="bg-white p-2 rounded-lg border border-pink-200 hover:border-pink-300 hover:shadow-sm transition-all"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-7 h-7 bg-linear-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                            {{ obtenerIniciales(cumple.nombre) }}
                          </div>
                          <div>
                            <p class="font-bold text-gray-900 text-xs">{{ cumple.nombre }}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-gray-900 font-bold text-[10px]">{{ cumple.fechaFormateada }}</p>
                          <p class="text-pink-600 text-[9px] font-medium">
                            {{ cumple.diasRestantes === 1 ? '¡Mañana!' : `${cumple.diasRestantes} días` }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recordatorio Camiseta 2026 -->
              <div class="mt-2">
                <div class="bg-linear-to-r from-blue-500 via-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg border border-blue-400/30">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <ShoppingBagIcon class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-white font-bold text-sm uppercase tracking-wide">Pedido camiseta 2026</h3>
                    </div>
                  </div>
                  <div class="bg-white/95 backdrop-blur-sm p-2.5 rounded-lg border border-blue-300 shadow-sm">
                    <p class="text-gray-700 text-[11px] font-medium mb-2">Anota tu talla y número para el próximo pedido de camisetas</p>
                    <a
                      href="https://docs.google.com/spreadsheets/d/1u-22axEvNqGepC_yLpddVSYeWt2ZAUaQUZihyZlBRns/edit?usp=drivesdk"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <ShoppingBagIcon class="w-4 h-4" />
                      Pedir Camiseta
                      <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <router-link
            to="/perfil"
            class="px-4 py-2 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Mi Perfil
          </router-link>
        </div>
      </div>

      <!-- Selector de equipo (si tiene ambos) -->
      <div v-if="jugadoraData?.equipo === 'ambos'" class="mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Selecciona equipo:</label>
          <div class="flex flex-col lg:flex-row gap-4">
            <button
              @click="cambiarEquipo('ascenso')"
              :class="[
                'px-6 py-2 rounded-lg font-bold transition-colors cursor-pointer',
                equipoSeleccionado === 'ascenso'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Ascenso
            </button>
            <button
              @click="cambiarEquipo('escuela')"
              :class="[
                'px-6 py-2 rounded-lg font-bold transition-colors cursor-pointer',
                equipoSeleccionado === 'escuela'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Escuela
            </button>
                   <button
              @click="cambiarEquipo('ambos')"
              :class="[
                'px-6 py-2 rounded-lg font-bold transition-colors cursor-pointer',
                equipoSeleccionado === 'ambos'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
             Eventos
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading || primeraCarga" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          <div class="animate-ping absolute inset-0 rounded-full h-16 w-16 border-b-4 border-primary opacity-20"></div>
        </div>
        <p class="text-white mt-6 text-lg font-semibold">Cargando entrenamientos...</p>
        <p class="text-gray-300 mt-2 text-sm">Esto puede tomar unos segundos</p>
      </div>

      <!-- Sin entrenamientos -->
      <div v-else-if="entrenamientosFiltered.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-500 text-lg">No hay eventos disponibles en este momento</p>
      </div>

      <!-- Lista de entrenamientos -->
      <div v-if="!primeraCarga && entrenamientosFiltered.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="entrenamiento in entrenamientosFiltered"
          :key="entrenamiento.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
        >
          <!-- Card superior -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-1">{{ entrenamiento.nombre }}</h3>
                <!-- Indicador de convocatoria -->
                <span v-if="entrenamiento.esConvocatoria" class="inline-flex items-center gap-1 mt-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                  <ClipboardDocumentListIcon class="w-3 h-3" />
                  Convocatoria
                </span>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold',
                  estadoInscripcion[entrenamiento.id] === 'confirmada'
                    ? 'bg-green-100 text-green-800'
                    : estadoInscripcion[entrenamiento.id] === 'baja'
                    ? 'bg-red-100 text-red-800'
                    : estadoInscripcion[entrenamiento.id] === 'pendiente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ 
                  estadoInscripcion[entrenamiento.id] === 'confirmada' ? 'Confirmada' :
                  estadoInscripcion[entrenamiento.id] === 'baja' ? 'Baja' :
                  estadoInscripcion[entrenamiento.id] === 'pendiente' ? 'Pendiente' :
                  'Sin inscribirse'
                }}
              </span>
            </div>

            <!-- Detalles -->
            <div class="space-y-2 mb-6 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <CalendarIcon class="w-4 h-4 text-primary-dark" />
                <span class="font-bold">Fecha:</span>
                <span>{{ formatearFecha(entrenamiento.fecha) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <ClockIcon class="w-4 h-4 text-primary-dark" />
                <span class="font-bold">Hora:</span>
                <span>{{ entrenamiento.hora }}</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPinIcon class="w-4 h-4 text-primary-dark" />
                <span class="font-bold">Lugar:</span>
                <span>{{ entrenamiento.lugar }}</span>
              </div>
            </div>

            <!-- Descripción -->
            <p class="text-gray-600 text-sm mb-6 line-clamp-3">
              {{ entrenamiento.descripcion }}
            </p>

            <!-- Mensaje informativo para convocatorias -->
            <div v-if="entrenamiento.esConvocatoria && !esConvocada(entrenamiento)" class="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p class="text-xs text-red-800 font-semibold flex items-center gap-2">
                <NoSymbolIcon class="w-4 h-4" />
                No estás en la lista de convocadas para este partido. No puedes inscribirte.
              </p>
            </div>
            <div v-else-if="entrenamiento.esConvocatoria && esConvocada(entrenamiento) && !estaInscrita(entrenamiento.id)" class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p class="text-xs text-purple-800 font-semibold flex items-center gap-2">
                <CheckCircleIcon class="w-4 h-4" />
                ¡Has sido convocada! Por favor, confirma tu asistencia.
              </p>
            </div>

            <!-- Mensaje informativo cuando la fecha pasó -->
            <div v-if="fechaPasada(entrenamiento)" class="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
              <p class="text-xs text-gray-700 font-semibold flex items-center gap-2">
                <ExclamationTriangleIcon class="w-4 h-4" />
                Este evento ya finalizó. No se pueden realizar cambios en la inscripción.
              </p>
            </div>

            <!-- Tu respuesta actual (cuando ya respondió) -->
            <div v-if="estadoInscripcion[entrenamiento.id] === 'confirmada' || estadoInscripcion[entrenamiento.id] === 'baja'" class="mb-3">
              <p class="text-xs text-gray-600 font-semibold mb-1">Tu respuesta:</p>
              <div :class="[
                'p-3 rounded-lg border-2 flex items-center justify-between',
                estadoInscripcion[entrenamiento.id] === 'confirmada' 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              ]">
                <div class="flex items-center gap-2">
                  <span :class="[
                    'text-2xl',
                    estadoInscripcion[entrenamiento.id] === 'confirmada' ? 'text-green-600' : 'text-red-600'
                  ]">
                    <CheckIcon v-if="estadoInscripcion[entrenamiento.id] === 'confirmada'" class="w-6 h-6" />
                    <XMarkIcon v-else class="w-6 h-6" />
                  </span>
                  <span :class="[
                    'font-bold text-sm',
                    estadoInscripcion[entrenamiento.id] === 'confirmada' ? 'text-green-800' : 'text-red-800'
                  ]">
                    {{ estadoInscripcion[entrenamiento.id] === 'confirmada' ? 'Asistencia Confirmada' : 'Te diste de Baja' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex flex-col lg:flex-row gap-2">
              <!-- Cuando está confirmada - botón para cambiar a baja -->
              <button
                v-if="estadoInscripcion[entrenamiento.id] === 'confirmada'"
                @click="abrirModalBaja(entrenamiento)"
                :disabled="isLoadingAccion || fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer flex items-center justify-center gap-1',
                  fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50'
                ]"
              >
                <ArrowPathIcon class="w-4 h-4" />
                Cambiar a Baja
              </button>
              <!-- Cuando está de baja - botón para cambiar a confirmada -->
              <button
                v-else-if="estadoInscripcion[entrenamiento.id] === 'baja'"
                @click="handleInscribirse(entrenamiento)"
                :disabled="isLoadingAccion || fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer flex items-center justify-center gap-1',
                  fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                ]"
              >
                <ArrowPathIcon class="w-4 h-4" />
                Cambiar a Confirmada
              </button>
              <!-- Botones cuando no ha respondido -->
              <template v-else>
                <button
                  @click="handleInscribirse(entrenamiento)"
                  :disabled="isLoadingAccion || fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)"
                  :class="[
                    'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer flex items-center justify-center gap-1',
                    fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
                  ]"
                >
                  <CheckIcon class="w-4 h-4" />
                  Confirmar
                </button>
                <button
                  @click="abrirModalBaja(entrenamiento)"
                  :disabled="isLoadingAccion || fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)"
                  :class="[
                    'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer flex items-center justify-center gap-1',
                    fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
                  ]"
                >
                  <XMarkIcon class="w-4 h-4" />
                  Baja
                </button>
              </template>
              <button
                @click="verDetalles(entrenamiento)"
                class="flex-1 px-3 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors text-sm cursor-pointer flex items-center justify-center gap-1"
              >
                <ClipboardDocumentListIcon class="w-4 h-4" />
                Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <!-- Historial (visible solo para admin) -->
    <div v-if="esAdmin && historialEntrenamientos.length > 0" class="max-w-6xl mx-auto p-6 mt-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Historial de entrenamientos</h2>
          <p class="text-sm text-gray-500">Solo visible para administradores</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="ent in historialEntrenamientos" :key="ent.id" class="bg-gray-50 rounded-lg p-4 border">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold text-sm text-gray-900">{{ ent.nombre }}</h3>
                <div class="text-xs text-gray-600">{{ formatearFecha(ent.fecha) }} • {{ ent.hora }}</div>
              </div>
              <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1">Finalizado</span>
            </div>
            <p class="text-xs text-gray-700 mb-3 line-clamp-2">{{ ent.descripcion }}</p>
            <div class="flex gap-2 flex-wrap">
              <button @click="verDetalles(ent)" class="flex-1 min-w-20 px-3 py-2 text-xs bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 font-bold transition-colors flex items-center justify-center gap-1">
                <PencilIcon class="w-3 h-3" />
                Editar Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="entrenamientoSeleccionado" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="entrenamientoSeleccionadoId = null">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <!-- Header con gradiente -->
        <div class="shrink-0 bg-linear-to-r from-primary-dark to-primary p-6 text-white flex justify-between items-start z-20">
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2">{{ entrenamientoSeleccionado.nombre }}</h2>
            <div class="flex items-center gap-3 text-sm opacity-90">
              <span class="flex items-center gap-1">
                <CalendarIcon class="w-4 h-4" />
                {{ formatearFecha(entrenamientoSeleccionado.fecha) }}
              </span>
              <span class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                {{ entrenamientoSeleccionado.hora }}
              </span>
            </div>
          </div>
          <button
            @click="entrenamientoSeleccionadoId = null"
            class="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="overflow-y-auto flex-1">
          <div class="p-4 space-y-4 pb-6">
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

            <!-- Lista de Jugadoras Convocadas (si es convocatoria) -->
     

            <!-- CONVOCATORIA - Estilo App Deportiva -->
            <div class="bg-linear-to-b from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
              <!-- Stats Bar -->
              <div class=" px-4 py-3">
                <h3 class="text-black font-black text-xs uppercase tracking-wider mb-2">Lista de Convocatoria</h3>
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-white/10 backdrop-blur rounded-lg px-2 py-1.5 text-center">
                    <div class="text-green-400 font-black text-lg">{{ inscritasOrganizadas.confirmadas.length }}</div>
                    <div class="text-white/70 text-[9px] font-bold uppercase">Confirmadas</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur rounded-lg px-2 py-1.5 text-center">
                    <div class="text-red-400 font-black text-lg">{{ inscritasOrganizadas.bajas.length }}</div>
                    <div class="text-white/70 text-[9px] font-bold uppercase">Ausentes</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur shadow rounded-lg px-2 py-1.5 text-center">
                    <div class="text-yellow-400 font-black text-lg">{{ inscritasOrganizadas.pendientes.length }}</div>
                    <div class="text-white/70 text-[9px] font-bold uppercase">Sin Respuesta</div>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div class="flex bg-gray-100 border-b border-gray-200">
                <button
                  @click="tabActivo = 'confirmadas'"
                  :class="[
                    'flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wide transition-all relative cursor-pointer',
                    tabActivo === 'confirmadas'
                      ? 'text-green-700 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-center gap-1">
                    <span>✓</span>
                    <span>Confirmadas</span>
                    <span class="ml-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{{ inscritasOrganizadas.confirmadas.length }}</span>
                  </span>
                  <div v-if="tabActivo === 'confirmadas'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
                </button>
                <button
                  @click="tabActivo = 'bajas'"
                  :class="[
                    'flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wide transition-all relative cursor-pointer',
                    tabActivo === 'bajas'
                      ? 'text-red-700 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-center gap-1">
                    <span>✕</span>
                    <span>Ausentes</span>
                    <span class="ml-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{{ inscritasOrganizadas.bajas.length }}</span>
                  </span>
                  <div v-if="tabActivo === 'bajas'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                </button>
                <button
                  @click="tabActivo = 'pendientes'"
                  :class="[
                    'flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wide transition-all relative cursor-pointer',
                    tabActivo === 'pendientes'
                      ? 'text-yellow-700 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <span class="flex items-center justify-center gap-1">
                    <span>⏳</span>
                    <span>Pendientes</span>
                    <span class="ml-1 bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{{ inscritasOrganizadas.pendientes.length }}</span>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="shrink-0 bg-gray-50 p-4 border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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
            <!-- Si ya confirmó - botón para cambiar a baja -->
            <button
              v-if="estadoInscripcion[entrenamientoSeleccionado.id] === 'confirmada'"
              @click="abrirModalBaja(entrenamientoSeleccionado)"
              :disabled="isLoadingAccion || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
              :class="[
                'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50'
              ]"
            >
              {{ fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '🔄 Cambiar mi respuesta a Baja' }}
            </button>
            <!-- Si ya se dio de baja - botón para cambiar a confirmada -->
            <button
              v-else-if="estadoInscripcion[entrenamientoSeleccionado.id] === 'baja'"
              @click="handleInscribirse(entrenamientoSeleccionado)"
              :disabled="isLoadingAccion || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
              :class="[
                'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
              ]"
            >
              {{ fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '🔄 Cambiar mi respuesta a Confirmada' }}
            </button>
            <!-- Si no ha respondido - botones de acción -->
            <template v-else>
              <button
                @click="handleInscribirse(entrenamientoSeleccionado)"
                :disabled="isLoadingAccion || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                  fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
                ]"
              >
                {{ fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '✓ Confirmar mi Asistencia' }}
              </button>
              <button
                @click="abrirModalBaja(entrenamientoSeleccionado)"
                :disabled="isLoadingAccion || fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-bold transition-colors cursor-pointer',
                  fechaPasada(entrenamientoSeleccionado) || (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
                ]"
              >
                {{ fechaPasada(entrenamientoSeleccionado) ? '⚠️ Fecha pasada' : (entrenamientoSeleccionado.esConvocatoria && !esConvocada(entrenamientoSeleccionado) && !esAdmin) ? '⛔ No convocada' : '✕ Darme de Baja' }}
              </button>
            </template>
            <button
              @click="entrenamientoSeleccionadoId = null"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
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
  ShoppingBagIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline';
import { logoutJugadora, jugadoraAuthUser, jugadoraData } from '../firebase/jugadorasAuth';
import { userRole } from '../firebase/auth';
import { fetchEntrenamientosPorEquipo, entrenamientos, isLoadingEntrenamientos, escucharEntrenamientosPorEquipo } from '../firebase/entrenamientos';
import { 
  inscribirseEntrenamiento, 
  desuscribirseEntrenamiento, 
  fetchInscripcionesEntrenamiento,
  estaInscrita as checkInscrita,
  obtenerEstadoInscripcion,
  escucharInscripcionesEntrenamiento,
  cambiarEstadoInscripcion,
  isLoadingInscripciones,
  errorInscripciones
} from '../firebase/inscripciones';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const router = useRouter();
const equipoSeleccionado = ref(localStorage.getItem('categoriaSeleccionada') || jugadoraData.value?.equipo || 'ascenso');
const entrenamientoSeleccionadoId = ref(null);
const inscritasEntrenamiento = ref([]);
// Guardar inscripciones organizadas de todos los entrenamientos
const todasInscritasOrganizadas = ref({});
const estadoInscripcion = ref({});
const conteoInscritas = ref({}); // NUEVO: Mapeo de conteos por entrenamiento
const toastMensaje = ref(null);
const toastTipo = ref('success');
const isLoadingAccion = ref(false);
const unsubscribers = ref([]);
const unsubEntrenamientos = ref(null);
const mostrarModalBaja = ref(false);
const motivoBaja = ref('');
const entrenamientoParaBaja = ref(null);
const tabActivo = ref('confirmadas'); // Para el modal de detalles
const cumpleaniosHoy = ref([]); // Cumpleaños de hoy
const proximoCumpleanios = ref([]); // Próximos cumpleaños (mismo día)
const cargandoInscripciones = ref({}); // Estado de carga por entrenamiento
const primeraCarga = ref(true); // Para mostrar loader en primera carga

// Computed para obtener el entrenamiento seleccionado actualizado en tiempo real
const entrenamientoSeleccionado = computed(() => {
  if (!entrenamientoSeleccionadoId.value) return null;
  return entrenamientos.value.find(e => e.id === entrenamientoSeleccionadoId.value) || null;
});

// Computed para obtener inscripciones organizadas del entrenamiento seleccionado
const inscritasOrganizadas = computed(() => {
  if (!entrenamientoSeleccionadoId.value) {
    return { confirmadas: [], bajas: [], pendientes: [] };
  }
  return todasInscritasOrganizadas.value[entrenamientoSeleccionadoId.value] || { confirmadas: [], bajas: [], pendientes: [] };
});

// Función auxiliar para obtener iniciales
const obtenerIniciales = (nombre) => {
  if (!nombre) return '?';
  const partes = nombre.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
};

// Verificar autenticación
if (!jugadoraAuthUser.value) {
  router.push('/login-jugadora');
}

const entrenamientosFiltered = computed(() => {
  const now = Date.now();
  return entrenamientos.value
    .filter(e => {
      // Filtrar por equipo
      if (e.equipo !== equipoSeleccionado.value) return false;

      // Si no hay fecha, mostrar por seguridad
      if (!e.fecha) return true;

      const fechaEvento = new Date(e.fecha.seconds ? e.fecha.seconds * 1000 : e.fecha);

      // Mostrar si el evento es en el futuro
      if (fechaEvento.getTime() > now) return true;

      // Mostrar si el evento terminó hace menos de 24 horas
      const diff = now - fechaEvento.getTime();
      const veinticuatroHoras = 24 * 60 * 60 * 1000;
      return diff <= veinticuatroHoras;
    })
    .sort((a, b) => {
      // Ordenar por fecha: más próximo primero
      const fechaA = new Date(a.fecha?.seconds ? a.fecha.seconds * 1000 : a.fecha || 0);
      const fechaB = new Date(b.fecha?.seconds ? b.fecha.seconds * 1000 : b.fecha || 0);
      return fechaA.getTime() - fechaB.getTime();
    });
});

// Retorna true si el evento terminó hace más de 24 horas
const eventoVencidoMas24h = (entrenamiento) => {
  if (!entrenamiento?.fecha) return false;
  const now = Date.now();
  const fechaEvento = new Date(entrenamiento.fecha.seconds ? entrenamiento.fecha.seconds * 1000 : entrenamiento.fecha);
  return (now - fechaEvento.getTime()) > (24 * 60 * 60 * 1000);
};

const esAdmin = computed(() => userRole.value === 'admin');

const historialEntrenamientos = computed(() => {
  return entrenamientos.value
    .filter(e => e.equipo === equipoSeleccionado.value && eventoVencidoMas24h(e))
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
  if (!entrenamiento.fecha) return false;
  const fechaEntrenamiento = new Date(entrenamiento.fecha.seconds ? entrenamiento.fecha.seconds * 1000 : entrenamiento.fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return fechaEntrenamiento < hoy;
};

const cambiarEquipo = (equipo) => {
  primeraCarga.value = true; // Mostrar loader al cambiar equipo
  equipoSeleccionado.value = equipo;
  localStorage.setItem('categoriaSeleccionada', equipo);
  cargarEntrenamientos();
  actualizarEstados();
};

const cargarEntrenamientos = () => {
  // Limpiar listener anterior si existe
  if (unsubEntrenamientos.value) {
    unsubEntrenamientos.value();
    unsubEntrenamientos.value = null;
  }
  
  // Limpiar listeners de inscripciones
  unsubscribers.value.forEach(unsub => unsub());
  unsubscribers.value = [];
  
  // Limpiar inscripciones organizadas
  todasInscritasOrganizadas.value = {};
  cargandoInscripciones.value = {};
  
  // Iniciar listener en tiempo real de entrenamientos
  unsubEntrenamientos.value = escucharEntrenamientosPorEquipo(equipoSeleccionado.value, async () => {
    await actualizarEstados();
    
    // Reiniciar listeners de inscripciones con los entrenamientos actualizados
    unsubscribers.value.forEach(unsub => unsub());
    unsubscribers.value = [];
    
    // Si no hay entrenamientos, ocultar loader inmediatamente
    if (entrenamientos.value.length === 0) {
      primeraCarga.value = false;
      return;
    }
    
    for (const ent of entrenamientos.value) {
      // Marcar como cargando antes de iniciar listener
      cargandoInscripciones.value[ent.id] = true;
      
      const unsub = escucharInscripcionesEntrenamiento(ent.id, (organizadas) => {
        conteoInscritas.value[ent.id] = {
          confirmadas: organizadas.confirmadas.length,
          bajas: organizadas.bajas.length,
          pendientes: organizadas.pendientes.length
        };
        
        // Guardar inscripciones organizadas para este entrenamiento
        todasInscritasOrganizadas.value[ent.id] = organizadas;
        
        // Marcar como cargado
        cargandoInscripciones.value[ent.id] = false;
        
        // Verificar si todas las inscripciones terminaron de cargar
        const todasCargadas = Object.values(cargandoInscripciones.value).every(val => val === false);
        if (todasCargadas && primeraCarga.value) {
          // Pequeño delay para suavizar la transición
          setTimeout(() => {
            primeraCarga.value = false;
          }, 300);
        }
      }, () => {
        // Pasar función que retorna el entrenamiento actualizado
        return entrenamientos.value.find(e => e.id === ent.id);
      });
      
      unsubscribers.value.push(unsub);
    }
  });
};

const actualizarEstados = async () => {
  for (const entrenamiento of entrenamientos.value) {
    const estado = await obtenerEstadoInscripcion(entrenamiento.id, jugadoraAuthUser.value.uid);
    estadoInscripcion.value[entrenamiento.id] = estado;
  }
};

const contarInscritas = (entrenamientoId) => {
  const conteo = conteoInscritas.value[entrenamientoId];
  if (!conteo) return 0;
  return conteo.confirmadas + conteo.bajas + conteo.pendientes;
};

const estaInscrita = (entrenamientoId) => {
  const estado = estadoInscripcion.value[entrenamientoId];
  // Considera inscrita si está confirmada (no pendiente ni baja)
  return estado === 'confirmada';
};

const verDetalles = (entrenamiento) => {
  entrenamientoSeleccionadoId.value = entrenamiento.id;
};

const handleInscribirse = async (entrenamiento) => {
  if (!jugadoraData.value) return;

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
  
  // // console.log('Inscribiendo con nombre:', nombreCompleto);
  
  isLoadingAccion.value = true;
  const success = await inscribirseEntrenamiento(
    entrenamiento.id,
    jugadoraAuthUser.value.uid,
    nombreCompleto
  );

  if (success) {
    mostrarToast('¡Asistencia confirmada!', 'success');
    await actualizarEstados();
  } else {
    mostrarToast(errorInscripciones.value || 'Error al inscribirse', 'error');
  }
  isLoadingAccion.value = false;
};

const abrirModalBaja = (entrenamiento) => {
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
    mostrarToast('Te diste de baja correctamente', 'success');
    await actualizarEstados();
    cerrarModalBaja();
    entrenamientoSeleccionadoId.value = null;
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

// Función para calcular cumpleaños de hoy y próximos
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

const handleLogout = async () => {
  await logoutJugadora();
  router.push('/');
};

onMounted(() => {
  cargarEntrenamientos();
  cargarProximoCumpleanios(); // Cargar el próximo cumpleaños
});

// Limpiar listeners cuando se desmonta el componente
onUnmounted(() => {
  // Limpiar listener de entrenamientos
  if (unsubEntrenamientos.value) {
    unsubEntrenamientos.value();
  }
  
  // Limpiar listeners de inscripciones
  unsubscribers.value.forEach(unsub => unsub());
  unsubscribers.value = [];
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
