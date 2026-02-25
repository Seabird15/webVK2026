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
          <div class="flex items-center gap-2 my-2">
            <button
              @click="handleLogout"
              class="bg-white text-red-500 hover:bg-opacity-90 px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Cerrar Sesión
            </button>


          </div>

        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Información de jugadora -->
      <div v-if="jugadoraData" class="mb-6 p-4 sm:p-6 bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-white/60">
        <div class="flex flex-col  gap-4 lg:gap-6">
          <div class="flex flex-col  gap-4 sm:gap-5 flex-1 ">
            <div v-if="jugadoraData.fotoPerfil" class="w-40 h-40 mx-auto  rounded-2xl overflow-hidden bg-gray-100 ring-4 ring-primary/10 shrink-0 shadow-md">
              <img :src="jugadoraData.fotoPerfil" alt="Perfil" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-xl text-center sm:text-2xl font-black text-gray-900 leading-tight wrap-break-word">
                {{ jugadoraData.nombre }} {{ jugadoraData.apellido }}
              </h2>
              <p class="text-gray-600 text-center font-semibold mt-1 text-sm sm:text-base">{{ jugadoraData.posicion }} - Dorsal #{{ jugadoraData.dorsal }}</p>
              <div class="mt-2 flex justify-center">
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border',
                  jugadoraData.estadoSalud === 'lesionada'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : jugadoraData.estadoSalud === 'recuperacion'
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    : jugadoraData.estadoSalud === 'no_disponible'
                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                    : 'bg-green-100 text-green-700 border-green-200'
                ]">
                  Estado: {{ formatearEstadoSalud(jugadoraData.estadoSalud) }}
                </span>
              </div>

              <div v-if="rachaReciente" class="mt-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-[11px] uppercase tracking-wide font-black text-gray-500">Racha reciente</p>
                    <p :class="[
                      'text-sm font-black mt-0.5',
                      rachaReciente.estado === 'confirmada' ? 'text-green-700' : 'text-red-700'
                    ]">
                      {{ rachaReciente.cantidad }} {{ rachaReciente.estado === 'confirmada' ? (rachaReciente.cantidad === 1 ? 'confirmación seguida' : 'confirmaciones seguidas') : (rachaReciente.cantidad === 1 ? 'baja seguida' : 'bajas seguidas') }}
                    </p>
                  </div>
                  <div :class="[
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                    rachaReciente.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    <CheckIcon v-if="rachaReciente.estado === 'confirmada'" class="w-5 h-5" />
                    <XMarkIcon v-else class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div class="my-7">
           <router-link
            to="/perfil"
            class="self-start mx-auto lg:w-fit justify-center flex lg:self-start shrink-0 px-4 py-2.5 bg-primary-dark text-white rounded-xl font-bold hover:bg-primary transition-colors shadow-md"
          >
           Editar Mi Perfil
          </router-link>
              </div>
              <!-- Tarjeta de Cumpleaños Mejorada -->
              <div v-if="cumpleaniosHoy.length > 0 || proximoCumpleanios.length > 0" class="mt-3 space-y-2 lg:w-fit mx-auto">
                <!-- Cumpleaños HOY -->
                <div v-if="cumpleaniosHoy.length > 0" class="bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 p-3 sm:p-4 rounded-2xl shadow-xl border border-white/20">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
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
                      class="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-pink-300 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="w-8 h-8 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm shrink-0">
                            {{ obtenerIniciales(cumple.nombre) }}
                          </div>
                          <div class="min-w-0">
                            <p class="font-bold text-gray-900 text-xs truncate">{{ cumple.nombre }}</p>
                          </div>
                        </div>
                        <div class="flex flex-col items-end gap-0.5 shrink-0">
                          <span class="bg-linear-to-r from-pink-500 to-purple-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">HOY</span>
                          <span class="text-gray-600 text-[9px] font-medium">{{ cumple.fechaFormateada }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Próximos Cumpleaños (si no hay hoy) -->
                <div v-else-if="proximoCumpleanios.length > 0" class="w-bg-linear-to-r from-pink-50 via-purple-50 to-indigo-50 p-3 sm:p-4 rounded-2xl border border-pink-200 shadow-md">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-9 h-9 bg-linear-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center shadow-sm">
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
                      class="bg-white p-2.5 rounded-xl border border-pink-200 hover:border-pink-300 hover:shadow-sm transition-all"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="w-8 h-8 bg-linear-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm shrink-0">
                            {{ obtenerIniciales(cumple.nombre) }}
                          </div>
                          <div class="min-w-0">
                            <p class="font-bold text-gray-900 text-xs truncate">{{ cumple.nombre }}</p>
                          </div>
                        </div>
                        <div class="text-right shrink-0">
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
              <div class="mt-2 w-fit mx-auto">
                <div class="bg-linear-to-r from-blue-500 via-blue-600 to-indigo-600 p-3 sm:p-4 rounded-2xl shadow-xl border border-blue-400/30">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                      <ShoppingBagIcon class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-white font-black text-sm uppercase tracking-wide">Pedido camiseta 2026</h3>
                    </div>
                  </div>
                  <div class="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-blue-300 shadow-sm">
                    <p class="text-gray-700 text-[11px] font-semibold mb-2">Anota tu talla y número para el próximo pedido de camisetas</p>
                    <a
                      href="https://docs.google.com/spreadsheets/d/1u-22axEvNqGepC_yLpddVSYeWt2ZAUaQUZihyZlBRns/edit?usp=drivesdk"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
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
                <span>{{ entrenamiento.hora }}<template v-if="entrenamiento.horaFin"> - {{ entrenamiento.horaFin }}</template></span>
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

            <div v-if="topMvpSeleccionado.length > 0" class="mb-2 p-2 bg-primary/10 border border-primary/20 rounded">
              <p class="text-[11px] font-black text-primary-dark uppercase tracking-wide mb-1">Top 3 MVP</p>
              <div class="space-y-1">
                <div v-for="(item, index) in topMvpSeleccionado" :key="`mvp-top-${entrenamientoSeleccionado.id}-${item.nombre}`" class="flex items-center justify-between text-xs text-primary-dark">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">{{ index + 1 }}</span>
                    <span class="font-bold truncate">{{ item.nombre }}</span>
                  </div>
                  <span class="font-black">{{ item.votos }} {{ item.votos === 1 ? 'voto' : 'votos' }}</span>
                </div>
              </div>
            </div>

            <div v-if="!mvpYaVotadoSeleccionado && candidatasMvpSeleccionado.length > 0" class="space-y-2">
              <p class="text-[11px] font-black text-gray-500 uppercase tracking-wide">Elige una jugadora inscrita</p>
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
              Solo jugadoras inscritas pueden votar MVP.
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
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
  LockClosedIcon,
  ShoppingBagIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline';
import { logoutJugadora, jugadoraAuthUser, jugadoraData } from '../firebase/jugadorasAuth';
import { userRole } from '../firebase/auth';
import { fetchEntrenamientosPorEquipo, entrenamientos, isLoadingEntrenamientos, escucharEntrenamientosPorEquipo, votarMvpEntrenamiento } from '../firebase/entrenamientos';
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
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import InfoUltimaActualizacion from '../components/InfoUltimaActualizacion.vue';

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
const mensajeDetalle = ref('');
const tipoMensajeDetalle = ref('success');
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
const mvpVoteLoading = ref(false);
const mvpVotoSeleccionado = ref(null);
const mvpGanadoraFotoSeleccionado = ref('');
const mvpGanadoraFotoCargando = ref(false);
const cacheFotosJugadoras = ref({});
let timeoutMensajeDetalle = null;

// Computed para obtener el entrenamiento seleccionado actualizado en tiempo real
const entrenamientoSeleccionado = computed(() => {
  if (!entrenamientoSeleccionadoId.value) return null;
  return entrenamientos.value.find(e => e.id === entrenamientoSeleccionadoId.value) || null;
});

const VENTANA_VISIBILIDAD_JUGADORAS_MS = 24 * 60 * 60 * 1000;
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

const eventoFueraDeVentanaJugadora = (entrenamiento) => {
  const { finMs } = obtenerInicioFinEvento(entrenamiento);
  if (!Number.isFinite(finMs)) return false;

  return Date.now() > finMs + VENTANA_VISIBILIDAD_JUGADORAS_MS;
};

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
  return entrenamientos.value
    .filter(e => {
      // Filtrar por equipo
      if (e.equipo !== equipoSeleccionado.value) return false;

      // Mostrar mientras esté dentro de la ventana de visibilidad para jugadoras
      return !eventoFueraDeVentanaJugadora(e);
    })
    .sort((a, b) => {
      // Ordenar por fecha: más próximo primero
      const fechaA = new Date(a.fecha?.seconds ? a.fecha.seconds * 1000 : a.fecha || 0);
      const fechaB = new Date(b.fecha?.seconds ? b.fecha.seconds * 1000 : b.fecha || 0);
      return fechaA.getTime() - fechaB.getTime();
    });
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
  if (topMvpSeleccionado.value.length === 0) return null;
  return topMvpSeleccionado.value[0];
});

const topMvpSeleccionado = computed(() => {
  if (!Array.isArray(entrenamientoSeleccionado.value?.mvpVotos) || entrenamientoSeleccionado.value.mvpVotos.length === 0) return [];
  return [...entrenamientoSeleccionado.value.mvpVotos]
    .sort((a, b) => (Number(b?.votos) || 0) - (Number(a?.votos) || 0))
    .slice(0, 3);
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

const puedeVotarMvpSeleccionado = computed(() => {
  const uid = jugadoraAuthUser.value?.uid;
  const entrenamientoId = entrenamientoSeleccionado.value?.id;

  const inscritaEnDetalle = !!uid && (
    inscritasOrganizadas.value.confirmadas.some((item) => item?.jugadoraId === uid)
    || inscritasOrganizadas.value.bajas.some((item) => item?.jugadoraId === uid)
    || inscritasOrganizadas.value.pendientes.some((item) => item?.jugadoraId === uid)
  );

  const estadoActual = entrenamientoId ? estadoInscripcion.value[entrenamientoId] : null;
  const inscritaPorEstado = estadoActual === 'confirmada' || estadoActual === 'baja' || estadoActual === 'pendiente';

  return !!jugadoraAuthUser.value
    && !esAdmin.value
    && (inscritaEnDetalle || inscritaPorEstado)
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
    .filter(e => e.equipo === equipoSeleccionado.value)
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

const esAdmin = computed(() => userRole.value === 'admin');

const historialEntrenamientos = computed(() => {
  return entrenamientos.value
    .filter(e => e.equipo === equipoSeleccionado.value && eventoFueraDeVentanaJugadora(e))
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
  cargarVotoMvpSeleccionado(entrenamiento.id);
  mensajeDetalle.value = '';
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
    if (entrenamientoSeleccionadoId.value === entrenamiento.id) {
      mostrarMensajeDetalle('✅ Asistencia confirmada correctamente', 'success');
    }
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
    if (entrenamientoSeleccionadoId.value === entrenamientoParaBaja.value.id) {
      mostrarMensajeDetalle('✕ Te diste de baja correctamente', 'error');
    }
    await actualizarEstados();
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
    no_disponible: 'No disponible'
  };
  return map[estado] || 'Disponible';
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
  if (timeoutMensajeDetalle) {
    clearTimeout(timeoutMensajeDetalle);
    timeoutMensajeDetalle = null;
  }

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
