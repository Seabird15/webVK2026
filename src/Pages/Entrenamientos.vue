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
          <div class="flex flex-col lg:flex-row gap-4">
            <div v-if="jugadoraData.fotoPerfil" class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img :src="jugadoraData.fotoPerfil" alt="Perfil" class="w-full h-full object-cover" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ jugadoraData.nombre }} {{ jugadoraData.apellido }}
              </h2>
              <p class="text-gray-600">{{ jugadoraData.posicion }} - Dorsal #{{ jugadoraData.dorsal }}</p>
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
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Cargando entrenamientos...</p>
      </div>

      <!-- Sin entrenamientos -->
      <div v-else-if="entrenamientosFiltered.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-500 text-lg">No hay eventos disponibles en este momento</p>
      </div>

      <!-- Lista de entrenamientos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <span v-if="entrenamiento.esConvocatoria" class="inline-block mt-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                  📋 Convocatoria
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
                <span class="font-bold w-24">📅 Fecha:</span>
                <span>{{ formatearFecha(entrenamiento.fecha) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold w-24">🕐 Hora:</span>
                <span>{{ entrenamiento.hora }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold w-24">📍 Lugar:</span>
                <span>{{ entrenamiento.lugar }}</span>
              </div>
    
            </div>

            <!-- Descripción -->
            <p class="text-gray-600 text-sm mb-6 line-clamp-3">
              {{ entrenamiento.descripcion }}
            </p>

            <!-- Mensaje informativo para convocatorias -->
            <div v-if="entrenamiento.esConvocatoria && !esConvocada(entrenamiento)" class="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p class="text-xs text-red-800 font-semibold">
                ⛔ No estás en la lista de convocadas para este partido. No puedes inscribirte.
              </p>
            </div>
            <div v-else-if="entrenamiento.esConvocatoria && esConvocada(entrenamiento) && !estaInscrita(entrenamiento.id)" class="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p class="text-xs text-purple-800 font-semibold">
                ¡Has sido convocada! Por favor, confirma tu asistencia.
              </p>
            </div>

            <!-- Mensaje informativo cuando la fecha pasó -->
            <div v-if="fechaPasada(entrenamiento)" class="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
              <p class="text-xs text-gray-700 font-semibold">
                ⚠️ Este evento ya finalizó. No se pueden realizar cambios en la inscripción.
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
                    {{ estadoInscripcion[entrenamiento.id] === 'confirmada' ? '✓' : '✕' }}
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
                  'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer',
                  fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50'
                ]"
              >
                🔄 Cambiar a Baja
              </button>
              <!-- Cuando está de baja - botón para cambiar a confirmada -->
              <button
                v-else-if="estadoInscripcion[entrenamiento.id] === 'baja'"
                @click="handleInscribirse(entrenamiento)"
                :disabled="isLoadingAccion || fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer',
                  fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                ]"
              >
                🔄 Cambiar a Confirmada
              </button>
              <!-- Botones cuando no ha respondido -->
              <template v-else>
                <button
                  @click="handleInscribirse(entrenamiento)"
                  :disabled="isLoadingAccion || fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)"
                  :class="[
                    'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer',
                    fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 disabled:opacity-50'
                  ]"
                >
                  ✓ Confirmar
                </button>
                <button
                  @click="abrirModalBaja(entrenamiento)"
                  :disabled="isLoadingAccion || fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)"
                  :class="[
                    'flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm cursor-pointer',
                    fechaPasada(entrenamiento) || (entrenamiento.esConvocatoria && !esConvocada(entrenamiento) && !esAdmin)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50'
                  ]"
                >
                  ✕ Baja
                </button>
              </template>
              <button
                @click="verDetalles(entrenamiento)"
                class="flex-1 px-3 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors text-sm cursor-pointer"
              >
                📋 Detalles
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
              <button @click="verDetalles(ent)" class="flex-1 min-w-[80px] px-3 py-2 text-xs bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 font-bold transition-colors">
                ✏️ Editar Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="entrenamientoSeleccionado" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="entrenamientoSeleccionado = null">
      <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <!-- Header con gradiente -->
        <div class="sticky top-0 bg-linear-to-r from-primary-dark to-primary p-6 text-white flex justify-between items-start">
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2">{{ entrenamientoSeleccionado.nombre }}</h2>
            <div class="flex items-center gap-3 text-sm opacity-90">
              <span class="flex items-center gap-1">
                📅 {{ formatearFecha(entrenamientoSeleccionado.fecha) }}
              </span>
              <span class="flex items-center gap-1">
                🕐 {{ entrenamientoSeleccionado.hora }}
              </span>
            </div>
          </div>
          <button
            @click="entrenamientoSeleccionado = null"
            class="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div class="p-4 space-y-4">
            <!-- Indicador de convocatoria -->
            <div v-if="entrenamientoSeleccionado.esConvocatoria" class="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h3 class="font-bold text-purple-900 text-xs mb-1 flex items-center gap-1">
                📋 Partido con Convocatoria
              </h3>
              <p class="text-xs text-purple-700">
                Solo las jugadoras convocadas pueden confirmar su asistencia a este partido.
              </p>
            </div>

            <!-- Descripción -->
            <div class="bg-gray-50 rounded-lg p-3">
              <h3 class="font-bold text-gray-800 text-xs mb-1 flex items-center gap-1">
                <span class="text-sm">📝</span> Descripción
              </h3>
              <p class="text-gray-700 text-xs leading-relaxed">{{ entrenamientoSeleccionado.descripcion }}</p>
            </div>

            <!-- Información del evento -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div class="flex items-start gap-2">
                  <span class="text-lg">📍</span>
                  <div>
                    <h3 class="font-bold text-blue-900 text-xs mb-0.5">Lugar</h3>
                    <p class="text-blue-800 text-xs">{{ entrenamientoSeleccionado.lugar }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                <div class="flex items-start gap-2">
                  <span class="text-lg">👥</span>
                  <div>
                    <h3 class="font-bold text-green-900 text-xs mb-0.5">Equipo</h3>
                    <p class="text-green-800 text-xs capitalize">{{ entrenamientoSeleccionado.equipo }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lista de Jugadoras Convocadas (si es convocatoria) -->
            <div v-if="entrenamientoSeleccionado.esConvocatoria && entrenamientoSeleccionado.jugadorasConvocadas && entrenamientoSeleccionado.jugadorasConvocadas.length > 0" class="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 class="font-bold text-purple-900 text-sm mb-3 flex items-center gap-2">
                <span class="text-lg">📋</span> Jugadoras Convocadas ({{ entrenamientoSeleccionado.jugadorasConvocadas.length }})
              </h3>
              <div class="space-y-2">
                <div
                  v-for="jugadora in entrenamientoSeleccionado.jugadorasConvocadas"
                  :key="jugadora.id"
                  class="flex items-center gap-2 bg-white p-2 rounded border border-purple-100"
                >
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">
                    {{ obtenerIniciales(jugadora.nombre) }}
                  </div>
                  <div class="flex-1">
                    <div class="text-xs font-bold text-gray-900">{{ jugadora.nombre }}</div>
                    <div class="text-[9px] text-gray-500 font-medium">Convocada</div>
                  </div>
                  <div v-if="jugadora.id === jugadoraAuthUser?.uid" class="px-2 py-0.5 bg-green-100 rounded-full">
                    <span class="text-green-600 text-[9px] font-bold">Tú</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CONVOCATORIA - Estilo App Deportiva -->
            <div class="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
              <!-- Stats Bar -->
              <div class="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3">
                <h3 class="text-white font-black text-xs uppercase tracking-wider mb-2">Lista de Convocatoria</h3>
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-white/10 backdrop-blur rounded-lg px-2 py-1.5 text-center">
                    <div class="text-green-400 font-black text-lg">{{ inscritasOrganizadas.confirmadas.length }}</div>
                    <div class="text-white/70 text-[9px] font-bold uppercase">Confirmadas</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur rounded-lg px-2 py-1.5 text-center">
                    <div class="text-red-400 font-black text-lg">{{ inscritasOrganizadas.bajas.length }}</div>
                    <div class="text-white/70 text-[9px] font-bold uppercase">Ausentes</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur rounded-lg px-2 py-1.5 text-center">
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
                      <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">
                        {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                      </div>
                      <div class="flex-1">
                        <div class="text-xs font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                        <div class="text-[9px] text-gray-500 font-medium">Jugadora #{{ index + 1 }}</div>
                      </div>
                    </div>
                    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
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
                        <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">
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
                        <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
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
                      <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md">
                        {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                      </div>
                      <div class="flex-1">
                        <div class="text-xs font-bold text-gray-900">{{ inscrita.jugadoraNombre }}</div>
                        <div class="text-[9px] text-gray-500 font-medium">Esperando respuesta...</div>
                      </div>
                    </div>
                    <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span class="text-yellow-600 font-bold text-sm">⏳</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 p-2 border-t border-gray-200">
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
              @click="entrenamientoSeleccionado = null"
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
import { logoutJugadora, jugadoraAuthUser, jugadoraData } from '../firebase/jugadorasAuth';
import { userRole } from '../firebase/auth';
import { fetchEntrenamientosPorEquipo, entrenamientos, isLoadingEntrenamientos } from '../firebase/entrenamientos';
import { 
  inscribirseEntrenamiento, 
  desuscribirseEntrenamiento, 
  fetchInscripcionesEntrenamiento,
  estaInscrita as checkInscrita,
  obtenerEstadoInscripcion,
  escucharInscripcionesEntrenamiento,
  isLoadingInscripciones,
  errorInscripciones
} from '../firebase/inscripciones';

const router = useRouter();
const equipoSeleccionado = ref(localStorage.getItem('categoriaSeleccionada') || jugadoraData.value?.equipo || 'ascenso');
const entrenamientoSeleccionado = ref(null);
const inscritasEntrenamiento = ref([]);
const inscritasOrganizadas = ref({
  confirmadas: [],
  bajas: [],
  pendientes: []
});
const estadoInscripcion = ref({});
const conteoInscritas = ref({}); // NUEVO: Mapeo de conteos por entrenamiento
const toastMensaje = ref(null);
const toastTipo = ref('success');
const isLoadingAccion = ref(false);
const unsubscribers = ref([]);
const mostrarModalBaja = ref(false);
const motivoBaja = ref('');
const entrenamientoParaBaja = ref(null);
const tabActivo = ref('confirmadas'); // Para el modal de detalles

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
  equipoSeleccionado.value = equipo;
  localStorage.setItem('categoriaSeleccionada', equipo);
  cargarEntrenamientos();
  actualizarEstados();
};

const cargarEntrenamientos = async () => {
  await fetchEntrenamientosPorEquipo(equipoSeleccionado.value);
  await actualizarEstados();
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
  router.push(`/entrenamientos/${entrenamiento.id}`);
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
    entrenamientoSeleccionado.value = null;
  } else {
    mostrarToast(errorInscripciones.value || 'Error al darse de baja', 'error');
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

const handleLogout = async () => {
  await logoutJugadora();
  router.push('/');
};

onMounted(() => {
  cargarEntrenamientos();
  
  // NUEVO: Iniciar listeners para todos los entrenamientos para actualizar conteos
  const iniciarListenersTodos = async () => {
    await new Promise(r => setTimeout(r, 500)); // Esperar a que carguen entrenamientos
    
    for (const ent of entrenamientos.value) {
      const unsub = escucharInscripcionesEntrenamiento(ent.id, (organizadas) => {
        // Actualizar conteo para tarjetas
        conteoInscritas.value[ent.id] = {
          confirmadas: organizadas.confirmadas.length,
          bajas: organizadas.bajas.length,
          pendientes: organizadas.pendientes.length
        };
        
        // Si es el entrenamiento seleccionado en el modal, actualizar inscritasOrganizadas
        if (entrenamientoSeleccionado.value?.id === ent.id) {
          inscritasOrganizadas.value = organizadas;
        }
      }, ent); // Pasar el entrenamiento completo
      
      unsubscribers.value.push(unsub);
    }
  };
  
  iniciarListenersTodos();
});

// Limpiar listeners cuando se desmonta el componente
onUnmounted(() => {
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
