<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Gestionar Entrenamientos y Eventos</h2>
      <button
        @click="mostrarFormularioNuevo"
        class="bg-primary-dark text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-bold hover:bg-primary transition-colors whitespace-nowrap"
      >
        + Crear nuevo
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Equipo</label>
          <select
            v-model="filtroEquipo"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                class="w-5 h-5 mt-0.5 sm:mt-0 text-primary-dark focus:ring-2 focus:ring-primary rounded flex-shrink-0"
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
    <div v-if="entrenamientosFiltrados.length > 0" class="space-y-4">
      <div
        v-for="entrenamiento in entrenamientosFiltrados"
        :key="entrenamiento.id"
        class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 break-words">{{ entrenamiento.nombre }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 mt-1">
              {{ formatearFecha(entrenamiento.fecha) }} a las {{ entrenamiento.hora }}
            </p>
            <div class="flex flex-wrap gap-2 mt-2">
              <!-- Indicador de convocatoria -->
              <span v-if="entrenamiento.esConvocatoria" class="inline-block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold whitespace-nowrap">
                📋 Convocatoria - {{ entrenamiento.jugadorasConvocadas?.length || 0 }} jugadoras
              </span>
              <!-- Indicador de fecha pasada -->
              <span v-if="fechaPasada(entrenamiento)" class="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold whitespace-nowrap">
                ⏰ Fecha pasada - Solo edición admin
              </span>
            </div>
          </div>
          <span class="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap self-start">
            {{ entrenamiento.equipo }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs sm:text-sm">
          <div class="min-w-0">
            <p class="text-gray-600 font-semibold">Lugar</p>
            <p class="text-gray-900 truncate" :title="entrenamiento.lugar">{{ entrenamiento.lugar }}</p>
          </div>
          <div v-if="entrenamiento.capacidadMaxima" class="min-w-0">
            <p class="text-gray-600 font-semibold">Capacidad</p>
            <p class="text-gray-900">{{ entrenamiento.capacidadMaxima }} personas</p>
          </div>
          <div v-if="entrenamiento.descripcion" class="min-w-0">
            <p class="text-gray-600 font-semibold">Descripción</p>
            <p class="text-gray-900 truncate" :title="entrenamiento.descripcion">{{ entrenamiento.descripcion.substring(0, 30) }}...</p>
          </div>
          <div class="min-w-0">
            <p class="text-gray-600 font-semibold">Inscritas</p>
            <p class="text-gray-900">{{ contarInscriptasEntrenamiento(entrenamiento.id) }}</p>
          </div>
        </div>

        <!-- Resumen de estados -->
        <div class="grid grid-cols-3 gap-2 mb-4 text-xs">
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

        <div class="flex flex-col sm:flex-row gap-2">
          <button
            @click="verDetallesEntrenamiento(entrenamiento)"
            class="flex-1 px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors order-1"
          >
            Ver Detalles
          </button>
          <button
            @click="regenerarInscripciones(entrenamiento)"
            class="sm:px-3 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-bold hover:bg-yellow-100 transition-colors text-xs sm:text-sm order-4 sm:order-2"
            title="Crear inscripciones pendientes para jugadoras que faltan"
          >
            🔄 <span class="sm:hidden">Regenerar</span>
          </button>
          <button
            @click="editarEntrenamiento(entrenamiento)"
            class="flex-1 px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors order-2 sm:order-3"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminar(entrenamiento.id)"
            class="flex-1 px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors order-3 sm:order-4"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles de inscripciones -->
    <div v-if="entrenamientoDetallado" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-start sm:items-center gap-3 z-10">
          <div class="flex-1 min-w-0">
            <h2 class="text-lg sm:text-2xl font-bold break-words">{{ entrenamientoDetallado.nombre }}</h2>
            <p class="text-xs sm:text-sm text-gray-600 mt-1">
              {{ formatearFecha(entrenamientoDetallado.fecha) }} a las {{ entrenamientoDetallado.hora }}
            </p>
          </div>
          <button
            @click="entrenamientoDetallado = null"
            class="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <div class="p-4 sm:p-6 space-y-6">
          <!-- Confirmadas -->
          <div v-if="inscritasOrganizadasAdmin.confirmadas.length > 0">
            <h3 class="font-bold text-green-700 text-base sm:text-lg mb-3 flex items-center gap-2">
              <span class="text-xl sm:text-2xl">✓</span> Confirmadas ({{ inscritasOrganizadasAdmin.confirmadas.length }})
            </h3>
            <div class="space-y-2">
              <transition-group name="fade" tag="div">
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.confirmadas"
                  :key="inscrita.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200 transition-all"
                >
                  <span class="text-sm sm:text-base text-gray-900 font-semibold break-words">{{ inscrita.jugadoraNombre }}</span>
                  <div class="flex items-center gap-2 self-end sm:self-auto">
                    <span class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-bold whitespace-nowrap">Confirmada</span>
                    <!-- Botones de admin -->
                    <button
                      @click="cambiarEstado(inscrita.id, 'baja')"
                      class="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                      title="Marcar como baja"
                    >
                      Baja
                    </button>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- Bajas -->
          <div v-if="inscritasOrganizadasAdmin.bajas.length > 0">
            <h3 class="font-bold text-red-700 text-base sm:text-lg mb-3 flex items-center gap-2">
              <span class="text-xl sm:text-2xl">✕</span> Bajas ({{ inscritasOrganizadasAdmin.bajas.length }})
            </h3>
            <div class="space-y-2">
              <transition-group name="fade" tag="div">
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.bajas"
                  :key="inscrita.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200 transition-all"
                >
                  <span class="text-sm sm:text-base text-gray-900 font-semibold break-words">{{ inscrita.jugadoraNombre }}</span>
                  <div class="flex items-center gap-2 self-end sm:self-auto">
                    <span class="text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-bold whitespace-nowrap">Baja</span>
                    <!-- Botones de admin -->
                    <button
                      @click="cambiarEstado(inscrita.id, 'confirmada')"
                      class="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors whitespace-nowrap"
                      title="Marcar como confirmada"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- Pendientes -->
          <div v-if="inscritasOrganizadasAdmin.pendientes.length > 0">
            <h3 class="font-bold text-yellow-700 text-base sm:text-lg mb-3 flex items-center gap-2">
              <span class="text-xl sm:text-2xl">?</span> Sin respuesta ({{ inscritasOrganizadasAdmin.pendientes.length }})
            </h3>
            <div class="space-y-2">
              <transition-group name="fade" tag="div">
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.pendientes"
                  :key="inscrita.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200 transition-all"
                >
                  <span class="text-sm sm:text-base text-gray-900 font-semibold break-words">{{ inscrita.jugadoraNombre }}</span>
                  <div class="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold whitespace-nowrap">Pendiente</span>
                    <!-- Botones de admin -->
                    <button
                      @click="cambiarEstado(inscrita.id, 'confirmada')"
                      class="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors whitespace-nowrap"
                      title="Marcar como confirmada"
                    >
                      Confirmar
                    </button>
                    <button
                      @click="cambiarEstado(inscrita.id, 'baja')"
                      class="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                      title="Marcar como baja"
                    >
                      Baja
                    </button>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- Sin inscritas -->
          <div v-if="inscritasOrganizadasAdmin.confirmadas.length === 0 && inscritasOrganizadasAdmin.bajas.length === 0 && inscritasOrganizadasAdmin.pendientes.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-lg">No hay inscritas en este entrenamiento aún</p>
          </div>

          <!-- Sección para agregar jugadora manualmente -->
          <div class="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 class="font-bold text-blue-900 text-base sm:text-lg mb-3">➕ Agregar jugadora manualmente</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Buscar jugadora:</label>
                <input
                  v-model="busquedaJugadora"
                  type="text"
                  placeholder="Nombre de la jugadora..."
                  class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  @input="buscarJugadoras"
                />
              </div>
              <div v-if="jugadorasDisponibles.length > 0" class="max-h-48 overflow-y-auto space-y-2">
                <div
                  v-for="jugadora in jugadorasDisponibles"
                  :key="jugadora.id"
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
                >
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-900 break-words">{{ jugadora.nombre }} {{ jugadora.apellido }}</p>
                    <p class="text-xs text-gray-500">{{ jugadora.posicion }} - #{{ jugadora.dorsal }}</p>
                  </div>
                  <div class="flex gap-2 self-end sm:self-auto">
                    <button
                      @click="agregarJugadoraManual(jugadora, 'confirmada')"
                      class="text-xs px-2 sm:px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors whitespace-nowrap"
                    >
                      Presente
                    </button>
                    <button
                      @click="agregarJugadoraManual(jugadora, 'baja')"
                      class="text-xs px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                    >
                      Ausente
                    </button>
                  </div>
                </div>
              </div>
              <p v-else-if="busquedaJugadora.length > 0" class="text-sm text-gray-500 text-center py-2">
                No se encontraron jugadoras
              </p>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
          <button
            @click="entrenamientoDetallado = null"
            class="w-full px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600 text-lg">No hay entrenamientos disponibles</p>
      <button
        @click="mostrarFormularioNuevo"
        class="mt-4 text-primary-dark font-bold hover:text-primary"
      >
        Crear el primer entrenamiento
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  crearEntrenamiento,
  fetchEntrenamientosPorEquipo,
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

const entrenamientosFiltrados = computed(() => {
  return entrenamientos.value
    .filter(e => !filtroEquipo.value || e.equipo === filtroEquipo.value)
    .filter(e => {
      const termino = busqueda.value.toLowerCase();
      return (
        e.nombre.toLowerCase().includes(termino) ||
        e.lugar.toLowerCase().includes(termino)
      );
    })
    .sort((a, b) => new Date(a.fecha + ' ' + a.hora) - new Date(b.fecha + ' ' + b.hora));
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
      // Cargar todos (combinar ascenso y escuela)
      const ascenso = await fetchEntrenamientosPorEquipo('ascenso');
      const escuela = await fetchEntrenamientosPorEquipo('escuela');
      entrenamientos.value = [...ascenso, ...escuela];
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
        const ascenso = await fetchEntrenamientosPorEquipo('ascenso');
        const escuela = await fetchEntrenamientosPorEquipo('escuela');
        entrenamientos.value = [...ascenso, ...escuela];
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
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Verificar si la fecha del entrenamiento ya pasó
const fechaPasada = (entrenamiento) => {
  if (!entrenamiento.fecha) return false;
  const fechaEntrenamiento = new Date(entrenamiento.fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return fechaEntrenamiento < hoy;
};

// Cargar entrenamientos al montar
onMounted(async () => {
  try {
    const ascenso = await fetchEntrenamientosPorEquipo('ascenso');
    const escuela = await fetchEntrenamientosPorEquipo('escuela');
    entrenamientos.value = [...ascenso, ...escuela];
    
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
