<template>
  <div class="rounded-xl overflow-hidden bg-black">
    <!-- Header estilo jugadoras -->
    <div class="bg-linear-to-b from-primary-dark to-transparent text-white p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 class="text-3xl font-bold">Entrenamientos</h2>
          <p class="text-sm opacity-90 tracking-widest mt-1">Panel Admin</p>
        </div>
        <button
          @click="mostrarFormularioNuevo"
          class="bg-white text-primary-dark px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors whitespace-nowrap"
        >
          + Crear nuevo
        </button>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Equipo</label>
            <select
              v-model="filtroEquipo"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
            >
              <option value="">Todos los equipos</option>
              <option value="ascenso">Ascenso</option>
              <option value="escuela">Escuela</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Buscar</label>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por nombre o lugar..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
            />
          </div>
        </div>
      </div>

    <!-- Modal Nuevo/Editar Entrenamiento -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <!-- Encabezado Modal -->
        <div class="sticky top-0 bg-primary text-white p-4 sm:p-6 border-b border-gray-200 z-10">
          <h3 class="text-lg sm:text-xl font-bold">
            {{ entrenamientoEditando ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento' }}
          </h3>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardarEntrenamiento" class="p-4 sm:p-6 space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nombre *</label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              placeholder="Ej: Entrenamiento Técnico"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- Equipo -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Equipo *</label>
            <select
              v-model="formulario.equipo"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecciona equipo</option>
              <option value="ascenso">Ascenso</option>
              <option value="escuela">Escuela</option>
              <option value="ambos">Ambos Equipos</option>
            </select>
          </div>

          <!-- Tipo de actividad -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Tipo de actividad *</label>
            <select
              v-model="formulario.tipo"
              required
              @change="onTipoChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecciona tipo</option>
              <option value="entrenamiento">Entrenamiento</option>
              <option value="partido">Partido</option>
              <option value="amistoso">Amistoso</option>
              <option value="evento">Evento</option>
            </select>
          </div>

          <!-- Opción de convocatoria (solo para partidos/amistosos) -->
          <div v-if="formulario.tipo === 'partido' || formulario.tipo === 'amistoso'" class="bg-blue-50 p-3 sm:p-4 rounded-lg border-2 border-blue-200">
            <label class="flex items-start sm:items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                v-model="formulario.esConvocatoria"
                type="checkbox"
                @change="onConvocatoriaChange"
                class="w-5 h-5 mt-0.5 sm:mt-0 text-primary-dark focus:ring-2 focus:ring-primary rounded shrink-0"
              />
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-700 block">Crear convocatoria/nómina</span>
                <p class="text-xs text-gray-600 mt-1">Selecciona las jugadoras específicas que pueden anotarse a este partido</p>
              </div>
            </label>
            
            <!-- Selector de jugadoras para convocatoria -->
            <div v-if="formulario.esConvocatoria" class="mt-4 space-y-3">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Buscar jugadoras para convocar:</label>
                <input
                  v-model="busquedaConvocatoria"
                  type="text"
                  placeholder="Buscar por nombre..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  @input="buscarJugadorasParaConvocar"
                />
              </div>
              
              <!-- Lista de jugadoras disponibles -->
              <div v-if="jugadorasParaConvocar.length > 0" class="max-h-40 overflow-y-auto space-y-2 bg-white p-2 rounded border">
                <div
                  v-for="jugadora in jugadorasParaConvocar"
                  :key="jugadora.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                    <span class="text-sm font-semibold truncate">{{ jugadora.nombre }} {{ jugadora.apellido }}</span>
                    <span class="text-xs text-gray-500">{{ jugadora.posicion }} - #{{ jugadora.dorsal }}</span>
                  </div>
                  <button
                    type="button"
                    @click="agregarJugadoraConvocatoria(jugadora)"
                    class="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors whitespace-nowrap self-end sm:self-auto"
                  >
                    + Convocar
                  </button>
                </div>
              </div>
              
              <!-- Lista de jugadoras convocadas -->
              <div v-if="formulario.jugadorasConvocadas.length > 0" class="mt-3">
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  Jugadoras convocadas ({{ formulario.jugadorasConvocadas.length }}):
                </label>
                <div class="space-y-1 max-h-40 overflow-y-auto">
                  <div
                    v-for="(jugadora, index) in formulario.jugadorasConvocadas"
                    :key="jugadora.id"
                    class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-green-50 rounded border border-green-200"
                  >
                    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                      <span class="text-sm font-semibold text-green-900 truncate">{{ jugadora.nombre }}</span>
                      <span class="text-xs text-green-700">{{ jugadora.posicion }} - #{{ jugadora.dorsal }}</span>
                    </div>
                    <button
                      type="button"
                      @click="quitarJugadoraConvocatoria(index)"
                      class="text-red-600 hover:text-red-800 font-bold text-lg self-end sm:self-auto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              
              <p v-if="formulario.jugadorasConvocadas.length === 0" class="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                ⚠️ Debes seleccionar al menos una jugadora para la convocatoria
              </p>
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Fecha *</label>
              <input
                v-model="formulario.fecha"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Hora *</label>
              <input
                v-model="formulario.hora"
                type="time"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <!-- Lugar -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Lugar *</label>
            <input
              v-model="formulario.lugar"
              type="text"
              required
              placeholder="Ej: Gimnasio Central"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
            <textarea
              v-model="formulario.descripcion"
              rows="3"
              placeholder="Describe el entrenamiento..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <!-- Capacidad máxima -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Capacidad máxima (opcional)</label>
            <input
              v-model.number="formulario.capacidadMaxima"
              type="number"
              min="1"
              placeholder="Ej: 20"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- Error -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm font-semibold">{{ error }}</p>
          </div>

          <!-- Botones -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 sm:pb-0">
            <button
              type="button"
              @click="cerrarFormulario"
              :disabled="isLoading"
              class="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-4 py-2.5 sm:py-2 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary transition-colors disabled:opacity-50 order-1 sm:order-2"
            >
              {{ isLoading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

      <!-- Lista de Entrenamientos -->
      <div v-if="isLoadingEntrenamientos" class="text-center py-12">
        <p class="text-gray-200 text-lg">Cargando entrenamientos...</p>
      </div>

      <div v-else-if="entrenamientosFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="entrenamiento in entrenamientosFiltrados"
          :key="entrenamiento.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div class="p-6">
            <div class="flex flex-col  justify-between items-start mb-4 gap-2">
              <div class="min-w-0 ">
                <h3 class="text-xl font-bold text-gray-900 mb-1 wrap-break-word">{{ entrenamiento.nombre }}</h3>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span
                    v-if="entrenamiento.tipo"
                    :class="[
                      'inline-block text-xs px-2 py-1 rounded font-semibold whitespace-nowrap',
                      entrenamiento.tipo === 'partido' || entrenamiento.tipo === 'amistoso'
                        ? 'bg-blue-100 text-blue-800'
                        : entrenamiento.tipo === 'evento'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ entrenamiento.tipo }}
                  </span>
                  <span v-if="entrenamiento.esConvocatoria" class="inline-block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold whitespace-nowrap">
                    📋 Convocatoria ({{ entrenamiento.jugadorasConvocadas?.length || 0 }})
                  </span>
                  <span v-if="fechaPasada(entrenamiento)" class="inline-block text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded font-semibold whitespace-nowrap">
                    ⏰ Finalizado
                  </span>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap bg-primary text-white shrink-0">
                {{ entrenamiento.equipo }}
              </span>
            </div>

            <div class="space-y-2 mb-4 text-sm text-gray-600">
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
                <span class="truncate" :title="entrenamiento.lugar">{{ entrenamiento.lugar }}</span>
              </div>
          
            </div>

            <p v-if="entrenamiento.descripcion" class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ entrenamiento.descripcion }}
            </p>

            <!-- Resumen de estados -->
            <div class="grid grid-cols-1 gap-2 mb-4 text-xs">
              <div class="bg-green-50 p-2 rounded border border-green-200">
                <p class="text-green-700 font-bold">✓ {{ contarPorEstado(entrenamiento.id, 'confirmada') }}</p>
                <p class="text-green-600">Confirmadas</p>
              </div>
              <div class="bg-red-50 p-2 rounded border border-red-200">
                <p class="text-red-700 font-bold">✕ {{ contarPorEstado(entrenamiento.id, 'baja') }}</p>
                <p class="text-red-600">Bajas</p>
              </div>
              <div class="bg-yellow-50 p-2 rounded border border-yellow-200">
                <p class="text-yellow-700 font-bold">? {{ contarPorEstado(entrenamiento.id, 'pendiente') }}</p>
                <p class="text-yellow-600">Sin respuesta</p>
              </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-2">
              <button
                @click="verDetallesEntrenamiento(entrenamiento)"
                class="flex-1 px-3 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors text-sm"
              >
                Ver Detalles
              </button>
              <button
                @click="editarEntrenamiento(entrenamiento)"
                class="flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm bg-blue-500 text-white hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                @click="confirmarEliminar(entrenamiento.id)"
                class="flex-1 px-3 py-2 rounded-lg font-bold transition-colors text-sm bg-red-500 text-white hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>

            <button
              @click="regenerarInscripciones(entrenamiento)"
              class="w-full mt-2 px-3 py-2 rounded-lg font-bold transition-colors text-sm bg-yellow-500 text-white hover:bg-yellow-600"
              title="Crear inscripciones pendientes para jugadoras que faltan"
            >
              🔄 Regenerar inscripciones
            </button>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-500 text-lg">No hay entrenamientos disponibles</p>
        <button
          @click="mostrarFormularioNuevo"
          class="mt-4 px-6 py-2 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary transition-colors"
        >
          Crear el primer entrenamiento
        </button>
      </div>

    <!-- Modal de detalles de inscripciones -->
    <div v-if="entrenamientoDetallado" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <!-- Header del modal -->
        <div class="sticky top-0 bg-linear-to-b from-primary-dark to-primary text-white p-4 sm:p-6 z-10">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <h2 class="text-lg sm:text-2xl font-black uppercase tracking-wide wrap-break-word">{{ entrenamientoDetallado.nombre }}</h2>
              <div class="text-xs sm:text-sm mt-1 opacity-90">
                {{ formatearFecha(entrenamientoDetallado.fecha) }} • {{ entrenamientoDetallado.hora }}
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold capitalize">{{ entrenamientoDetallado.equipo }}</span>
                <span v-if="entrenamientoDetallado.tipo" class="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold capitalize">{{ entrenamientoDetallado.tipo }}</span>
                <span v-if="entrenamientoDetallado.esConvocatoria" class="bg-purple-500/80 text-white px-3 py-1 rounded-full text-xs font-bold">📋 Convocatoria</span>
              </div>
            </div>
            <button
              @click="entrenamientoDetallado = null"
              class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors shrink-0"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Contenido -->
        <div class="p-2 sm:p-6 bg-gray-50">
          <!-- Resumen -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div class="bg-white rounded-lg border border-primary-dark p-4">
              <div class="text-xs text-gray-500 font-bold uppercase">📍 Lugar</div>
              <div class="text-sm font-semibold text-gray-900 mt-1">{{ entrenamientoDetallado.lugar || '-' }}</div>
            </div>
            <div class="bg-white rounded-lg border border-primary-dark p-4">
              <div class="text-xs text-gray-500 font-bold uppercase">👥 Total inscritas</div>
              <div class="text-sm font-semibold text-gray-900 mt-1">
                {{ inscritasOrganizadasAdmin.confirmadas.length + inscritasOrganizadasAdmin.bajas.length + inscritasOrganizadasAdmin.pendientes.length }}
                <span v-if="entrenamientoDetallado.capacidadMaxima" class="text-gray-400">/ {{ entrenamientoDetallado.capacidadMaxima }}</span>
              </div>
            </div>
            <div class="bg-white rounded-lg border border-primary-dark p-4">
              <div class="text-xs text-gray-500 font-bold uppercase">⚡ Acciones rápidas</div>
              <button
                @click="regenerarInscripciones(entrenamientoDetallado)"
                class="mt-2 w-full px-3 py-2 rounded-lg font-bold transition-colors text-sm bg-yellow-500 text-white hover:bg-yellow-600"
                title="Crear inscripciones pendientes para jugadoras que faltan"
              >
                🔄 Regenerar pendientes
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="flex bg-gray-100 border-b-2 border-gray-200 overflow-visible">
              <button
                @click="tabDetalleAdmin = 'confirmadas'"
                :class="[
                  'flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wide transition-all relative min-h-11',
                  tabDetalleAdmin === 'confirmadas'
                    ? 'text-green-700 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="flex flex-col items-center justify-center gap-2">
                  <span class="bg-green-700 text-white rounded-full px-2 py-0.5 text-[10px]">{{ inscritasOrganizadasAdmin.confirmadas.length }}</span>

                  ✓ Confirmadas
                </span>
                <div v-if="tabDetalleAdmin === 'confirmadas'" class="absolute bottom-0 left-0 right-0 h-1 bg-green-700"></div>
              </button>
              <button
                @click="tabDetalleAdmin = 'bajas'"
                :class="[
                  'flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wide transition-all relative min-h-11',
                  tabDetalleAdmin === 'bajas'
                    ? 'text-red-700 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="flex flex-col items-center justify-center gap-2">
                  ✕ Ausentes
                  <span class="bg-red-700 text-white rounded-full px-2 py-0.5 text-[10px]">{{ inscritasOrganizadasAdmin.bajas.length }}</span>
                </span>
                <div v-if="tabDetalleAdmin === 'bajas'" class="absolute bottom-0 left-0 right-0 h-1 bg-red-700"></div>
              </button>
              <button
                @click="tabDetalleAdmin = 'pendientes'"
                :class="[
                  'flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wide transition-all relative min-h-11',
                  tabDetalleAdmin === 'pendientes'
                    ? 'text-yellow-700 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="flex flex-col  items-center justify-center gap-2">
                  ? Pendientes
                  <span class="bg-yellow-700 text-white rounded-full px-2 py-0.5 text-[10px]">{{ inscritasOrganizadasAdmin.pendientes.length }}</span>
                </span>
                <div v-if="tabDetalleAdmin === 'pendientes'" class="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500"></div>
              </button>
             
            </div>

            <!-- Contenido tabs -->
            <div class=" min-h-60">
              <!-- Empty global -->
              <div
                v-if="
                  inscritasOrganizadasAdmin.confirmadas.length === 0 &&
                  inscritasOrganizadasAdmin.bajas.length === 0 &&
                  inscritasOrganizadasAdmin.pendientes.length === 0 &&
                  tabDetalleAdmin !== 'agregar'
                "
                class="text-center py-12 text-gray-400"
              >
                <div class="text-4xl mb-3">👥</div>
                <p class="text-sm font-medium">Aún no hay inscripciones</p>
              </div>

              <!-- Confirmadas -->
              <div v-show="tabDetalleAdmin === 'confirmadas'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-if="inscritasOrganizadasAdmin.confirmadas.length === 0" class="col-span-2 text-center py-12 text-gray-400">
                  <div class="text-4xl mb-3">✓</div>
                  <p class="text-sm font-medium">Aún no hay confirmaciones</p>
                </div>
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.confirmadas"
                  :key="inscrita.id"
                  class="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all"
                >
                  <div class="w-12 h-12 bg-linear-to-br from-primary-dark to-primary-light rounded-full flex items-center justify-center text-white font-black shadow-md">
                    {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-bold text-gray-900 wrap-break-word">{{ inscrita.jugadoraNombre }}</div>
                    <div v-if="inscrita.updatedAt || inscrita.createdAt" class="text-xs text-gray-400 mt-1">
                      Anotada: {{ formatFechaHora(inscrita.updatedAt || inscrita.createdAt) }}
                    </div>
                  </div>
                  <button
                    @click="cambiarEstado(inscrita.id, 'baja')"
                    class="px-3 py-2 text-xs bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors whitespace-nowrap"
                    title="Marcar como ausente"
                  >
                    Ausente
                  </button>
                </div>
              </div>

              <!-- Bajas -->
              <div v-show="tabDetalleAdmin === 'bajas'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-if="inscritasOrganizadasAdmin.bajas.length === 0" class="col-span-2 text-center py-12 text-gray-400">
                  <div class="text-4xl mb-3">✕</div>
                  <p class="text-sm font-medium">No hay ausentes</p>
                </div>
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.bajas"
                  :key="inscrita.id"
                  class="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all"
                >
                  <div class="w-12 h-12 bg-linear-to-br from-primary-dark to-primary-light rounded-full flex items-center justify-center text-white font-black shadow-md">
                    {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-bold text-gray-900 wrap-break-word">{{ inscrita.jugadoraNombre }}</div>
                    <div v-if="inscrita.updatedAt || inscrita.createdAt" class="text-xs text-gray-400 mt-1">
                      Anotada: {{ formatFechaHora(inscrita.updatedAt || inscrita.createdAt) }}
                    </div>
                  </div>
                  <button
                    @click="cambiarEstado(inscrita.id, 'confirmada')"
                    class="px-3 py-2 text-xs bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition-colors whitespace-nowrap"
                    title="Marcar como presente"
                  >
                    Presente
                  </button>
                </div>
              </div>

              <!-- Pendientes -->
              <div v-show="tabDetalleAdmin === 'pendientes'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-if="inscritasOrganizadasAdmin.pendientes.length === 0" class="col-span-2 text-center py-12 text-gray-400">
                  <div class="text-4xl mb-3">?</div>
                  <p class="text-sm font-medium">No hay pendientes</p>
                </div>
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.pendientes"
                  :key="inscrita.id"
                  class="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all"
                >
                  <div class="w-12 h-12 bg-linear-to-br from-primary-dark to-primary-light rounded-full flex items-center justify-center text-white font-black shadow-md">
                    {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-bold text-gray-900 wrap-break-word">{{ inscrita.jugadoraNombre }}</div>
                    <div v-if="inscrita.updatedAt || inscrita.createdAt" class="text-xs text-gray-400 mt-1">
                      Anotada: {{ formatFechaHora(inscrita.updatedAt || inscrita.createdAt) }}
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="cambiarEstado(inscrita.id, 'confirmada')"
                      class="px-3 py-2 text-xs bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition-colors whitespace-nowrap"
                      title="Marcar como presente"
                    >
                      Presente
                    </button>
                    <button
                      @click="cambiarEstado(inscrita.id, 'baja')"
                      class="px-3 py-2 text-xs bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors whitespace-nowrap"
                      title="Marcar como ausente"
                    >
                      Ausente
                    </button>
                  </div>
                </div>
              </div>

              <!-- Agregar -->
                 <div class="p-4 mt-7 bg-white rounded-lg border">
                  <h3 class="font-black text-sm uppercase tracking-wide text-gray-900 mb-3">➕ Agregar jugadora manualmente</h3>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Buscar jugadora:</label>
                      <input
                        v-model="busquedaJugadora"
                        type="text"
                        placeholder="Nombre de la jugadora..."
                        class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-gray-50"
                        @input="buscarJugadoras"
                      />
                      <p class="text-[11px] text-gray-500 mt-1">Escribe al menos 2 letras.</p>
                    </div>
                    <div v-if="jugadorasDisponibles.length > 0" class="max-h-60 overflow-y-auto space-y-2">
                      <div
                        v-for="jugadora in jugadorasDisponibles"
                        :key="jugadora.id"
                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
                      >
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-gray-900 wrap-break-word">{{ jugadora.nombre }} {{ jugadora.apellido }}</p>
                          <p class="text-xs text-gray-500">{{ jugadora.posicion }} - #{{ jugadora.dorsal }}</p>
                        </div>
                        <div class="flex gap-2 self-end sm:self-auto">
                          <button
                            @click="agregarJugadoraManual(jugadora, 'confirmada')"
                            class="text-xs px-3 py-2 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition-colors whitespace-nowrap"
                          >
                            Presente
                          </button>
                          <button
                            @click="agregarJugadoraManual(jugadora, 'baja')"
                            class="text-xs px-3 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors whitespace-nowrap"
                          >
                            Ausente
                          </button>
                        </div>
                      </div>
                    </div>
                    <p v-else-if="busquedaJugadora.length > 0" class="text-sm text-gray-500 text-center py-6">
                      No se encontraron jugadoras
                    </p>
                  </div>
                </div>
            
            </div>
           
          </div>
        </div>

        <div class="sticky bottom-0 bg-white p-4 sm:p-6 border-t border-gray-200">
          <button
            @click="entrenamientoDetallado = null"
            class="w-full px-4 py-3 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  crearEntrenamiento,
  fetchEntrenamientosPorEquipo,
  fetchTodosEntrenamientos,
  actualizarEntrenamiento,
  eliminarEntrenamiento,
  isLoadingEntrenamientos,
  errorEntrenamientos,
  entrenamientos
} from '../firebase/entrenamientos';
import { escucharInscripcionesEntrenamiento, cambiarEstadoInscripcion, inscribirJugadoraManual, crearInscripcionesPendientes } from '../firebase/inscripciones';
import { fetchJugadorasRegistradasPorEquipo } from '../firebase/jugadorasAuth';

const mostrarFormulario = ref(false);
const isLoading = ref(false);
const error = ref(null);
const filtroEquipo = ref('');
const busqueda = ref('');
const entrenamientoEditando = ref(null);
const entrenamientoDetallado = ref(null);
const tabDetalleAdmin = ref('confirmadas');
const inscritasOrganizadasAdmin = ref({
  confirmadas: [],
  bajas: [],
  pendientes: []
});
const unsubscribers = ref([]);
const busquedaJugadora = ref('');
const jugadorasDisponibles = ref([]);

// Mapeo para contar inscritas por estado
const conteoInscritas = ref({});

const formulario = ref({
  nombre: '',
  equipo: '',
  tipo: '',
  fecha: '',
  hora: '',
  lugar: '',
  descripcion: '',
  capacidadMaxima: null,
  esConvocatoria: false,
  jugadorasConvocadas: []
});

const busquedaConvocatoria = ref('');
const jugadorasParaConvocar = ref([]);

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

const entrenamientosFiltrados = computed(() => {
  const now = Date.now();
  return entrenamientos.value
    .filter(e => {
      if (!filtroEquipo.value) return true; // Sin filtro, mostrar todos
      // Si hay filtro, mostrar los del equipo seleccionado Y los de 'ambos'
      return e.equipo === filtroEquipo.value || e.equipo === 'ambos';
    })
    .filter(e => {
      const termino = busqueda.value.toLowerCase();
      return (
        (e.nombre || '').toLowerCase().includes(termino) ||
        (e.lugar || '').toLowerCase().includes(termino)
      );
    })
    // Mostrar solo los futuros; los finalizados van al Historial del Admin
    .filter(e => {
      const ms = getFechaHoraMs(e);
      return ms == null ? true : ms >= now;
    })
    .sort((a, b) => (getFechaHoraMs(a) ?? 0) - (getFechaHoraMs(b) ?? 0));
});

const mostrarFormularioNuevo = () => {
  entrenamientoEditando.value = null;
  formulario.value = {
    nombre: '',
    equipo: '',
    tipo: '',
    fecha: '',
    hora: '',
    lugar: '',
    descripcion: '',
    capacidadMaxima: null,
    esConvocatoria: false,
    jugadorasConvocadas: []
  };
  busquedaConvocatoria.value = '';
  jugadorasParaConvocar.value = [];
  error.value = null;
  mostrarFormulario.value = true;
};

const editarEntrenamiento = (entrenamiento) => {
  entrenamientoEditando.value = entrenamiento;
  
  // Convertir fecha a formato YYYY-MM-DD para el input date
  let fechaFormato = entrenamiento.fecha;
  if (typeof fechaFormato === 'string' && fechaFormato.includes('T')) {
    // Si ya tiene hora, extraer solo la fecha
    fechaFormato = fechaFormato.split('T')[0];
  } else if (fechaFormato instanceof Date) {
    // Si es un objeto Date
    fechaFormato = fechaFormato.toISOString().split('T')[0];
  }
  
  formulario.value = {
    nombre: entrenamiento.nombre,
    equipo: entrenamiento.equipo,
    tipo: entrenamiento.tipo || 'entrenamiento',
    fecha: fechaFormato,
    hora: entrenamiento.hora,
    lugar: entrenamiento.lugar,
    descripcion: entrenamiento.descripcion || '',
    capacidadMaxima: entrenamiento.capacidadMaxima || null,
    esConvocatoria: entrenamiento.esConvocatoria || false,
    jugadorasConvocadas: entrenamiento.jugadorasConvocadas || []
  };
  busquedaConvocatoria.value = '';
  jugadorasParaConvocar.value = [];
  error.value = null;
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
  entrenamientoEditando.value = null;
};

const verDetallesEntrenamiento = (entrenamiento) => {
  entrenamientoDetallado.value = entrenamiento;
  tabDetalleAdmin.value = 'confirmadas';
  busquedaJugadora.value = '';
  jugadorasDisponibles.value = [];

  // Desuscribir de listeners anteriores
  unsubscribers.value.forEach(unsub => unsub());
  unsubscribers.value = [];

  // Iniciar listener en tiempo real para este entrenamiento
  const unsubscribe = escucharInscripcionesEntrenamiento(entrenamiento.id, (organizadas) => {
    inscritasOrganizadasAdmin.value = organizadas;
    
    // Actualizar el conteo
    conteoInscritas.value[entrenamiento.id] = {
      confirmadas: organizadas.confirmadas.length,
      bajas: organizadas.bajas.length,
      pendientes: organizadas.pendientes.length
    };
  });

  unsubscribers.value.push(unsubscribe);
};

const obtenerIniciales = (nombreCompleto) => {
  const s = (nombreCompleto || '').trim();
  if (!s) return '??';
  const partes = s.split(/\s+/).filter(Boolean);
  const a = partes[0]?.[0] || '';
  const b = (partes.length > 1 ? partes[1]?.[0] : partes[0]?.[1]) || '';
  return (a + b).toUpperCase();
};

const formatFechaHora = (ts) => {
  if (!ts) return '-';
  const date = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const contarInscriptasEntrenamiento = (entrenamientoId) => {
  const conteo = conteoInscritas.value[entrenamientoId];
  if (!conteo) return 0;
  return conteo.confirmadas + conteo.bajas + conteo.pendientes;
};

const contarPorEstado = (entrenamientoId, estado) => {
  const conteo = conteoInscritas.value[entrenamientoId];
  if (!conteo) return 0;
  return conteo[estado + 's'] || 0;
};

// Cambiar estado de inscripción (admin)
const cambiarEstado = async (inscripcionId, nuevoEstado) => {
  try {
    const success = await cambiarEstadoInscripcion(inscripcionId, nuevoEstado);
    if (success) {
      console.log('Estado actualizado correctamente');
    } else {
      alert('Error al cambiar el estado');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

// Buscar jugadoras
const buscarJugadoras = async () => {
  if (!busquedaJugadora.value || busquedaJugadora.value.length < 2) {
    jugadorasDisponibles.value = [];
    return;
  }

  if (!entrenamientoDetallado.value) return;

  try {
    // Cargar jugadoras registradas del equipo del entrenamiento
    const jugadorasRegistradas = await fetchJugadorasRegistradasPorEquipo(entrenamientoDetallado.value.equipo);
    
    // Filtrar jugadoras que ya están inscritas
    const idsInscritas = [
      ...inscritasOrganizadasAdmin.value.confirmadas,
      ...inscritasOrganizadasAdmin.value.bajas,
      ...inscritasOrganizadasAdmin.value.pendientes
    ].map(i => i.jugadoraId);
    
    // Filtrar por búsqueda y excluir inscritas
    jugadorasDisponibles.value = jugadorasRegistradas.filter(j => {
      const nombreCompleto = `${j.nombre} ${j.apellido}`.toLowerCase();
      return nombreCompleto.includes(busquedaJugadora.value.toLowerCase()) && 
             !idsInscritas.includes(j.id);
    });
  } catch (err) {
    console.error('Error buscando jugadoras:', err);
  }
};

// Agregar jugadora manualmente
const agregarJugadoraManual = async (jugadora, estado) => {
  if (!entrenamientoDetallado.value) return;
  
  try {
    const success = await inscribirJugadoraManual(
      entrenamientoDetallado.value.id,
      jugadora.id,
      `${jugadora.nombre} ${jugadora.apellido}`,
      estado
    );
    
    if (success) {
      console.log('Jugadora agregada correctamente');
      busquedaJugadora.value = '';
      jugadorasDisponibles.value = [];
    } else {
      alert('Error al agregar la jugadora');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

// Función para manejar cambio de tipo de actividad
const onTipoChange = () => {
  // Si no es partido o amistoso, desactivar convocatoria
  if (formulario.value.tipo !== 'partido' && formulario.value.tipo !== 'amistoso') {
    formulario.value.esConvocatoria = false;
    formulario.value.jugadorasConvocadas = [];
  }
};

// Función para manejar cambio de checkbox de convocatoria
const onConvocatoriaChange = () => {
  if (!formulario.value.esConvocatoria) {
    formulario.value.jugadorasConvocadas = [];
    busquedaConvocatoria.value = '';
    jugadorasParaConvocar.value = [];
  }
};

// Buscar jugadoras para convocar
const buscarJugadorasParaConvocar = async () => {
  if (!busquedaConvocatoria.value || busquedaConvocatoria.value.length < 2 || !formulario.value.equipo) {
    jugadorasParaConvocar.value = [];
    return;
  }

  try {
    const jugadorasRegistradas = await fetchJugadorasRegistradasPorEquipo(formulario.value.equipo);
    
    // Filtrar jugadoras ya convocadas
    const idsConvocadas = formulario.value.jugadorasConvocadas.map(j => j.id);
    
    jugadorasParaConvocar.value = jugadorasRegistradas.filter(j => {
      const nombreCompleto = `${j.nombre} ${j.apellido}`.toLowerCase();
      return nombreCompleto.includes(busquedaConvocatoria.value.toLowerCase()) && 
             !idsConvocadas.includes(j.id);
    });
  } catch (err) {
    console.error('Error buscando jugadoras:', err);
  }
};

// Agregar jugadora a la convocatoria
const agregarJugadoraConvocatoria = (jugadora) => {
  formulario.value.jugadorasConvocadas.push({
    id: jugadora.id,
    nombre: `${jugadora.nombre} ${jugadora.apellido}`,
    posicion: jugadora.posicion,
    dorsal: jugadora.dorsal
  });
  busquedaConvocatoria.value = '';
  jugadorasParaConvocar.value = [];
};

// Quitar jugadora de la convocatoria
const quitarJugadoraConvocatoria = (index) => {
  formulario.value.jugadorasConvocadas.splice(index, 1);
};

const guardarEntrenamiento = async () => {
  error.value = null;

  // Validar campos
  if (!formulario.value.nombre || !formulario.value.equipo || !formulario.value.tipo || !formulario.value.fecha || !formulario.value.hora || !formulario.value.lugar) {
    error.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  // Validar convocatoria
  if (formulario.value.esConvocatoria && formulario.value.jugadorasConvocadas.length === 0) {
    error.value = 'Debes seleccionar al menos una jugadora para la convocatoria';
    return;
  }

  isLoading.value = true;

  try {
    // Convertir la fecha a formato correcto evitando problemas de zona horaria
    // Agregar 'T12:00:00' para asegurar que se guarde el día correcto sin importar la zona horaria
    const fechaCorrecta = formulario.value.fecha + 'T12:00:00';
    
    if (entrenamientoEditando.value) {
      // Actualizar
      await actualizarEntrenamiento(entrenamientoEditando.value.id, {
        nombre: formulario.value.nombre,
        equipo: formulario.value.equipo,
        tipo: formulario.value.tipo,
        fecha: fechaCorrecta,
        hora: formulario.value.hora,
        lugar: formulario.value.lugar,
        descripcion: formulario.value.descripcion,
        capacidadMaxima: formulario.value.capacidadMaxima,
        esConvocatoria: formulario.value.esConvocatoria,
        jugadorasConvocadas: formulario.value.jugadorasConvocadas
      });
      console.log('Entrenamiento actualizado');
    } else {
      // Crear
      await crearEntrenamiento({
        nombre: formulario.value.nombre,
        equipo: formulario.value.equipo,
        tipo: formulario.value.tipo,
        fecha: fechaCorrecta,
        hora: formulario.value.hora,
        lugar: formulario.value.lugar,
        descripcion: formulario.value.descripcion,
        capacidadMaxima: formulario.value.capacidadMaxima,
        esConvocatoria: formulario.value.esConvocatoria,
        jugadorasConvocadas: formulario.value.jugadorasConvocadas
      });
      console.log('Entrenamiento creado');
    }

    // Recargar entrenamientos
    if (filtroEquipo.value) {
      await fetchEntrenamientosPorEquipo(filtroEquipo.value);
    } else {
      // Cargar todos los entrenamientos
      await fetchTodosEntrenamientos();
    }

    cerrarFormulario();
  } catch (err) {
    error.value = err.message || 'Error al guardar el entrenamiento';
  } finally {
    isLoading.value = false;
  }
};

const confirmarEliminar = async (entrenamientoId) => {
  if (confirm('¿Estás seguro que deseas eliminar este entrenamiento? También se eliminarán todas las inscripciones.')) {
    try {
      await eliminarEntrenamiento(entrenamientoId);
      console.log('Entrenamiento eliminado');

      // Recargar
      if (filtroEquipo.value) {
        await fetchEntrenamientosPorEquipo(filtroEquipo.value);
      } else {
        await fetchTodosEntrenamientos();
      }
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  }
};

// Regenerar inscripciones pendientes para un entrenamiento
const regenerarInscripciones = async (entrenamiento) => {
  if (confirm(`¿Crear inscripciones pendientes para todas las jugadoras del equipo ${entrenamiento.equipo}?`)) {
    try {
      isLoading.value = true;
      const success = await crearInscripcionesPendientes(entrenamiento.id, entrenamiento.equipo);
      if (success) {
        alert('Inscripciones pendientes creadas correctamente');
      } else {
        alert('No se pudieron crear las inscripciones. Verifica la consola.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      isLoading.value = false;
    }
  }
};

const formatearFecha = (fecha) => {
  const base = parseFechaBase(fecha);
  if (!base) return '-';
  return base.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Verificar si la fecha del entrenamiento ya pasó
const fechaPasada = (entrenamiento) => {
  const ms = getFechaHoraMs(entrenamiento);
  return ms != null && ms < Date.now();
};

// Cargar entrenamientos al montar
onMounted(async () => {
  try {
    // Cargar todos los entrenamientos (partidos, entrenamientos, eventos, ambos equipos)
    await fetchTodosEntrenamientos();
    
    // Inicializar conteo para cada entrenamiento
    entrenamientos.value.forEach(ent => {
      conteoInscritas.value[ent.id] = {
        confirmadas: 0,
        bajas: 0,
        pendientes: 0
      };
      
      // Iniciar listeners en tiempo real para cada uno
      const unsub = escucharInscripcionesEntrenamiento(ent.id, (organizadas) => {
        conteoInscritas.value[ent.id] = {
          confirmadas: organizadas.confirmadas.length,
          bajas: organizadas.bajas.length,
          pendientes: organizadas.pendientes.length
        };
      });
      unsubscribers.value.push(unsub);
    });
  } catch (err) {
    console.error('Error cargando entrenamientos:', err);
  }
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
