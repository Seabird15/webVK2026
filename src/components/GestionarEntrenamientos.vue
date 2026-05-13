<template>
  <div class="rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header moderno -->
    <div class="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white p-6 shadow-xl">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <CalendarIcon class="w-8 h-8" />
          </div>
          <div>
            <h2 class="lg:text-3xl text-xl font-black uppercase tracking-wide">Entrenamientos</h2>
            <p class="text-sm opacity-90 tracking-widest mt-1">Gestión de Actividades</p>
          </div>
        </div>
        <button
          @click="mostrarFormularioNuevo"
          class="bg-white text-primary-dark px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 hover:scale-105 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircleIcon class="w-5 h-5" />
          Crear nuevo
        </button>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Filtros mejorados -->
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <UserGroupIcon class="w-4 h-4" />
              Equipo
            </label>
            <select
              v-model="filtroEquipo"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 font-semibold transition-all"
            >
              <option value="">Todos los equipos</option>
              <option value="ascenso">Ascenso</option>
              <option value="escuela">Escuela</option>
              <option value="serieC">Serie C</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <FlagIcon class="w-4 h-4" />
              Buscar
            </label>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por nombre o lugar..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 font-semibold transition-all"
            />
          </div>
        </div>
      </div>

    <!-- Modal Nuevo/Editar Entrenamiento -->
    <Teleport to="body">
      <div v-if="mostrarFormulario" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4 animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <!-- Encabezado Modal mejorado -->
          <div class="sticky top-0 bg-gradient-to-r from-primary-dark to-primary text-white p-6 z-10 shadow-lg">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CalendarIcon class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-black uppercase tracking-wide">
                  {{ entrenamientoEditando ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento' }}
                </h3>
                <p class="text-xs opacity-90 mt-1">Completa los datos del entrenamiento</p>
              </div>
            </div>
          </div>

        <!-- Formulario mejorado -->
        <form @submit.prevent="guardarEntrenamiento" class="p-6 space-y-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Nombre *</label>
            <input
              v-model="formulario.nombre"
              type="text"
              required
              placeholder="Ej: Entrenamiento Técnico"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            />
          </div>

          <!-- Equipo -->
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Equipo *</label>
            <select
              v-model="formulario.equipo"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            >
              <option value="">Selecciona equipo</option>
              <option value="ascenso">Ascenso</option>
              <option value="escuela">Escuela</option>
              <option value="serieC">Serie C</option>
              <option value="ambos">Ambos Equipos</option>
            </select>
          </div>

          <div class="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border-2 border-amber-200">
            <label class="flex items-start sm:items-center gap-3 cursor-pointer">
              <input
                v-model="formulario.enviarCorreoJugadoras"
                type="checkbox"
                class="w-5 h-5 mt-0.5 sm:mt-0 text-primary-dark focus:ring-2 focus:ring-primary rounded shrink-0"
              />
              <div class="flex-1">
                <span class="text-sm font-black text-gray-700 uppercase tracking-wide">Enviar correo para anotarse</span>
                <p class="text-xs text-gray-600 mt-1 font-medium">Al crear el entrenamiento se enviará un email a las jugadoras del equipo con el enlace para inscribirse.</p>
              </div>
            </label>
          </div>

          <!-- Tipo de actividad -->
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Tipo de actividad *</label>
            <select
              v-model="formulario.tipo"
              required
              @change="onTipoChange"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            >
              <option value="">Selecciona tipo</option>
              <option value="entrenamiento">Entrenamiento</option>
              <option value="partido">Partido</option>
              <option value="amistoso">Amistoso</option>
              <option value="evento">Evento</option>
            </select>
          </div>

          <div v-if="formulario.tipo === 'partido' || formulario.tipo === 'amistoso'">
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Rival <span v-if="formulario.tipo === 'partido'">*</span></label>
            <input
              v-model="formulario.rival"
              type="text"
              :required="formulario.tipo === 'partido'"
              placeholder="Ej: Club Deportivo XYZ"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            />
          </div>

          <div v-if="formulario.tipo === 'partido' || formulario.tipo === 'amistoso'" class="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
            <label class="flex items-start sm:items-center gap-3 cursor-pointer">
              <input
                v-model="formulario.mostrarEnProximoPartido"
                type="checkbox"
                class="w-5 h-5 mt-0.5 sm:mt-0 text-primary-dark focus:ring-2 focus:ring-primary rounded shrink-0"
              />
              <div class="flex-1">
                <span class="text-sm font-black text-gray-700 uppercase tracking-wide">Mostrar en caja “Próximo Partido” del home</span>
                <p class="text-xs text-gray-600 mt-1 font-medium">Si activas esta opción, este partido quedará como destacado en el inicio.</p>
              </div>
            </label>
          </div>

          <div v-if="formulario.tipo === 'partido' || formulario.tipo === 'amistoso'" class="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200">
            <label class="flex items-start sm:items-center gap-3 cursor-pointer">
              <input
                v-model="formulario.mvpHabilitado"
                type="checkbox"
                class="w-5 h-5 mt-0.5 sm:mt-0 text-primary-dark focus:ring-2 focus:ring-primary rounded shrink-0"
              />
              <div class="flex-1">
                <span class="text-sm font-black text-gray-700 uppercase tracking-wide">Habilitar votación MVP post-partido</span>
                <p class="text-xs text-gray-600 mt-1 font-medium">Las jugadoras podrán votar MVP cuando el evento haya finalizado.</p>
              </div>
            </label>
          </div>

          <!-- Opción de convocatoria (solo para partidos/amistosos) -->
          <div v-if="formulario.tipo === 'partido' || formulario.tipo === 'amistoso'" class="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
            <label class="flex items-start sm:items-center gap-3 cursor-pointer">
              <input
                v-model="formulario.esConvocatoria"
                type="checkbox"
                @change="onConvocatoriaChange"
                class="w-5 h-5 mt-0.5 sm:mt-0 text-primary-dark focus:ring-2 focus:ring-primary rounded shrink-0"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <ClipboardDocumentListIcon class="w-5 h-5 text-purple-600" />
                  <span class="text-sm font-black text-gray-700 uppercase tracking-wide">Crear convocatoria/nómina</span>
                </div>
                <p class="text-xs text-gray-600 mt-1 font-medium">Selecciona las jugadoras específicas que pueden anotarse a este partido</p>
              </div>
            </label>
            
            <!-- Selector de jugadoras para convocatoria -->
            <div v-if="formulario.esConvocatoria" class="mt-4 space-y-3">
              <div>
                <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Buscar jugadoras para convocar:</label>
                <input
                  v-model="busquedaConvocatoria"
                  type="text"
                  placeholder="Buscar por nombre..."
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <CalendarIcon class="w-4 h-4" />
                Fecha *
              </label>
              <input
                v-model="formulario.fecha"
                type="date"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
              />
            </div>
            <div>
              <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <ClockIcon class="w-4 h-4" />
                Hora *
              </label>
              <input
                v-model="formulario.hora"
                type="time"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
              />
            </div>
            <div>
              <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <ClockIcon class="w-4 h-4" />
                Hora finalización <span v-if="formulario.tipo === 'partido' || formulario.tipo === 'amistoso'">*</span>
              </label>
              <input
                v-model="formulario.horaFin"
                type="time"
                :required="formulario.tipo === 'partido' || formulario.tipo === 'amistoso'"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
              />
            </div>
          </div>

          <!-- Lugar -->
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <MapPinIcon class="w-4 h-4" />
              Lugar *
            </label>
            <input
              v-model="formulario.lugar"
              type="text"
              required
              placeholder="Ej: Gimnasio Central"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            />
          </div>

          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <MapPinIcon class="w-4 h-4" />
              Dirección para mapa (opcional)
            </label>
            <input
              v-model="formulario.ubicacionMapa"
              type="text"
              placeholder="Ej: Tricolor La Florida, Puente Alto, Chile"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            />
            <p class="mt-2 text-xs text-gray-500 font-medium">Si queda vacío, el mapa se genera con el campo “Lugar”.</p>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide">Descripción</label>
            <textarea
              v-model="formulario.descripcion"
              rows="3"
              placeholder="Describe el entrenamiento..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold resize-none"
            ></textarea>
          </div>

          <!-- Capacidad máxima -->
          <div>
            <label class="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <UserGroupIcon class="w-4 h-4" />
              Capacidad máxima (opcional)
            </label>
            <input
              v-model.number="formulario.capacidadMaxima"
              type="number"
              min="1"
              placeholder="Ej: 20"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-semibold"
            />
          </div>

          <!-- Error -->
          <div v-if="error" class="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl">
            <p class="text-red-700 text-sm font-bold">{{ error }}</p>
          </div>

          <!-- Botones -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200 sticky bottom-0 bg-white -mx-6 px-6 pb-6">
            <button
              type="button"
              @click="cerrarFormulario"
              :disabled="isLoading"
              class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 hover:scale-[1.02] transition-all disabled:opacity-50 order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-dark to-primary text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 order-1 sm:order-2 shadow-lg"
            >
              {{ isLoading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Teleport>

      <!-- Lista de Entrenamientos -->
      <div v-if="isLoadingEntrenamientos" class="text-center py-12">
        <p class="text-gray-200 text-lg">Cargando entrenamientos...</p>
      </div>

      <div v-else-if="entrenamientosFiltrados.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div
          v-for="entrenamiento in entrenamientosFiltrados"
          :key="entrenamiento.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-primary/30 hover:scale-[1.02]"
        >
          <!-- Header de la card con gradiente -->
          <div class="bg-gradient-to-r from-primary-dark to-primary p-4">
            <div class="flex justify-between items-start gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-black text-white mb-2 wrap-break-word">{{ entrenamiento.nombre }}</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-if="entrenamiento.tipo"
                    :class="[
                      'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap',
                      entrenamiento.tipo === 'partido' || entrenamiento.tipo === 'amistoso'
                        ? 'bg-blue-500 text-white'
                        : entrenamiento.tipo === 'evento'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-green-500 text-white'
                    ]"
                  >
                    {{ entrenamiento.tipo }}
                  </span>
                  <span v-if="entrenamiento.esConvocatoria" class="inline-flex items-center gap-1 text-xs bg-purple-500 text-white px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                    <ClipboardDocumentListIcon class="w-3 h-3" />
                    Convocatoria ({{ entrenamiento.jugadorasConvocadas?.length || 0 }})
                  </span>
                  <span v-if="entrenamiento.mostrarEnProximoPartido" class="inline-flex items-center gap-1 text-xs bg-yellow-500 text-black px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                    Próximo partido Home
                  </span>
                  <span v-if="mvpHabilitadoNormalizado(entrenamiento) && (entrenamiento.tipo === 'partido' || entrenamiento.tipo === 'amistoso')" class="inline-flex items-center gap-1 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                    MVP habilitado
                  </span>
                  <span v-if="mvpEmpatePendiente(entrenamiento)" class="inline-flex items-center gap-1 text-xs bg-amber-500 text-white px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                    Empate MVP pendiente
                  </span>
                  <span v-if="entrenamiento.mvpCerrada && (entrenamiento.tipo === 'partido' || entrenamiento.tipo === 'amistoso')" class="inline-flex items-center gap-1 text-xs bg-gray-700 text-white px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                    Votación MVP cerrada
                  </span>
                  <span v-if="fechaPasada(entrenamiento)" class="inline-flex items-center gap-1 text-xs bg-gray-500 text-white px-2.5 py-1 rounded-full font-bold whitespace-nowrap">
                    <ClockIcon class="w-3 h-3" />
                    Finalizado
                  </span>
                </div>
              </div>
              <span class="px-3 py-1.5 rounded-full text-xs font-black capitalize whitespace-nowrap bg-white/20 text-white backdrop-blur-sm shrink-0">
                {{ entrenamiento.equipo }}
              </span>
            </div>
          </div>

          <!-- Contenido de la card -->
          <div class="p-5">

            <div class="space-y-3 mb-5">
              <div class="flex items-center gap-3 text-sm">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarIcon class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-semibold uppercase">Fecha</div>
                  <div class="text-sm font-bold text-gray-900">{{ formatearFecha(entrenamiento.fecha) }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <ClockIcon class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <div class="text-xs text-gray-500 font-semibold uppercase">Hora</div>
                  <div class="text-sm font-bold text-gray-900">
                    {{ entrenamiento.hora }}
                    <span v-if="entrenamiento.horaFin" class="text-gray-500 font-semibold"> - {{ entrenamiento.horaFin }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <MapPinIcon class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-500 font-semibold uppercase">Lugar</div>
                  <div class="text-sm font-bold text-gray-900 truncate" :title="entrenamiento.lugar">{{ entrenamiento.lugar }}</div>
                </div>
              </div>
              <div v-if="entrenamiento.rival" class="flex items-center gap-3 text-sm">
                <div class="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0">
                  <FlagIcon class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-500 font-semibold uppercase">Rival</div>
                  <div class="text-sm font-bold text-gray-900 truncate" :title="entrenamiento.rival">{{ entrenamiento.rival }}</div>
                </div>
              </div>
            </div>

            <p v-if="entrenamiento.descripcion" class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ entrenamiento.descripcion }}
            </p>

            <!-- Resumen de estados mejorado -->
            <div class="grid grid-cols-3 gap-2 mb-5">
              <div class="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border-2 border-green-200 text-center">
                <div class="flex items-center justify-center mb-1">
                  <CheckCircleIcon class="w-5 h-5 text-green-600" />
                </div>
                <p class="text-2xl font-black text-green-700">{{ contarPorEstado(entrenamiento.id, 'confirmada') }}</p>
                <p class="text-[10px] text-green-600 font-bold uppercase truncate tracking-wide">Anotadas</p>
              </div>
              <div class="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-xl border-2 border-red-200 text-center">
                <div class="flex items-center justify-center mb-1">
                  <XCircleIcon class="w-5 h-5 text-red-600" />
                </div>
                <p class="text-2xl font-black text-red-700">{{ contarPorEstado(entrenamiento.id, 'baja') }}</p>
                <p class="text-[10px] text-red-600 font-bold uppercase tracking-wide">Bajas</p>
              </div>
              <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-xl border-2 border-yellow-200 text-center">
                <div class="flex items-center justify-center mb-1">
                  <QuestionMarkCircleIcon class="w-5 h-5 text-yellow-600" />
                </div>
                <p class="text-2xl font-black text-yellow-700">{{ contarPorEstado(entrenamiento.id, 'pendiente') }}</p>
                <p class="text-[10px] text-yellow-600 font-bold uppercase truncate tracking-wide">Pendientes</p>
              </div>
            </div>

            <div
              v-if="contarExcluidas(entrenamiento.id) > 0"
              class="mb-5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-sky-700"
            >
              {{ contarExcluidas(entrenamiento.id) }} fuera del calculo de asistencia
            </div>

            <div class="space-y-2">
              <button
                @click="verDetallesEntrenamiento(entrenamiento)"
                class="w-full px-4 py-3 bg-gradient-to-r from-primary-dark to-primary text-white rounded-xl font-bold hover:scale-[1.02] transition-all text-sm shadow-md flex items-center justify-center gap-2"
              >
                <UserGroupIcon class="w-4 h-4" />
                Ver Detalles
              </button>
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="editarEntrenamiento(entrenamiento)"
                  class="px-3 py-2.5 rounded-xl font-bold transition-all text-sm bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <PencilSquareIcon class="w-4 h-4" />
                  Editar
                </button>
                <button
                  @click="confirmarEliminar(entrenamiento.id)"
                  class="px-3 py-2.5 rounded-xl font-bold transition-all text-sm bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <TrashIcon class="w-4 h-4" />
                  Eliminar
                </button>
              </div>
              <button
                v-if="esPartidoOAmistoso(entrenamiento) && mvpHabilitadoNormalizado(entrenamiento) && !entrenamiento.mvpCerrada"
                @click="confirmarFinalizarVotacionMvp(entrenamiento)"
                class="w-full px-3 py-2.5 rounded-xl font-bold transition-all text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-black hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2"
              >
                <FlagIcon class="w-4 h-4" />
                <span>Finalizar votación MVP</span>
              </button>
              <button
                @click="regenerarInscripciones(entrenamiento)"
                class="w-full px-3 py-2.5 rounded-xl font-bold transition-all text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2"
                title="Crear inscripciones pendientes para jugadoras que faltan"
              >
                <ArrowPathIcon class="w-4 h-4" />
                Regenerar inscripciones
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
        <div class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 text-lg font-semibold mb-2">No hay entrenamientos disponibles</p>
        <p class="text-gray-400 text-sm mb-6">Comienza creando tu primer entrenamiento</p>
        <button
          @click="mostrarFormularioNuevo"
          class="px-6 py-3 bg-gradient-to-r from-primary-dark to-primary text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2"
        >
          <PlusCircleIcon class="w-5 h-5" />
          Crear el primer entrenamiento
        </button>
      </div>

    <!-- Vista de detalles de inscripciones -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div v-if="entrenamientoDetallado" class="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 z-50 overflow-y-auto overflow-x-hidden">
        <div class="min-h-screen pb-20">
          <!-- Header mejorado -->
          <div class="sticky top-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white p-6 z-10 shadow-lg">
            <div class="max-w-7xl mx-auto">
              <button
                @click="entrenamientoDetallado = null"
                class="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="font-bold text-sm uppercase tracking-wide">Volver</span>
              </button>
              
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1 min-w-0 flex items-start gap-4">
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <CalendarIcon class="w-8 h-8" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="lg:text-2xl text-xl font-black uppercase tracking-wide wrap-break-word">{{ entrenamientoDetallado.nombre }}</h2>
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mt-2 opacity-90">
                  <div class="flex items-center gap-1.5">
                    <CalendarIcon class="w-4 h-4" />
                    {{ formatearFecha(entrenamientoDetallado.fecha) }}
                  </div>
                  <span class="text-white/50">•</span>
                  <div class="flex items-center gap-1.5">
                    <ClockIcon class="w-4 h-4" />
                    {{ entrenamientoDetallado.hora }}
                  </div>
                </div>
                <div class="flex flex-wrap gap-2 mt-3">
                  <span class="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-black capitalize">{{ entrenamientoDetallado.equipo }}</span>
                  <span v-if="entrenamientoDetallado.tipo" class="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-black capitalize">{{ entrenamientoDetallado.tipo }}</span>
                  <span v-if="entrenamientoDetallado.rival" class="bg-yellow-400/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-xs font-black">
                    Rival: {{ entrenamientoDetallado.rival }}
                  </span>
                  <span v-if="entrenamientoDetallado.mostrarEnProximoPartido" class="bg-yellow-500/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-xs font-black">
                    Destacado en Home
                  </span>
                  <span v-if="entrenamientoDetallado.esConvocatoria" class="bg-purple-500/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1">
                    <ClipboardDocumentListIcon class="w-3 h-3" />
                    Convocatoria
                  </span>
                </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          <!-- Contenido mejorado -->
          <div class="max-w-7xl mx-auto p-4 sm:p-6">
          <div class="bg-white rounded-xl border-2 border-blue-100 p-4 shadow-sm mb-6">
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2">
                <MapPinIcon class="w-5 h-5 text-blue-600" />
                <h3 class="text-xs font-black uppercase tracking-wide text-blue-900">Ubicación del evento</h3>
              </div>
              <button
                type="button"
                @click="abrirMapaNuevaPestana(entrenamientoDetallado)"
                class="text-[11px] font-bold text-primary-dark hover:text-primary"
              >
                Abrir mapa
              </button>
            </div>
            <p class="text-sm font-bold text-gray-900 mb-1">{{ entrenamientoDetallado.lugar }}</p>
            <p v-if="entrenamientoDetallado.ubicacionMapa" class="text-xs text-gray-600 mb-3">{{ entrenamientoDetallado.ubicacionMapa }}</p>
            <div v-if="obtenerMapaEmbedUrl(entrenamientoDetallado)" class="relative">
              <div v-if="mapaCargandoAdmin" class="absolute inset-0 z-10 bg-white/90 rounded-lg border border-gray-200 flex flex-col items-center justify-center gap-2">
                <div class="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p class="text-[11px] font-bold text-gray-600">Cargando mapa...</p>
              </div>
              <iframe
                :src="obtenerMapaEmbedUrl(entrenamientoDetallado)"
                @load="mapaCargandoAdmin = false"
                class="w-full h-64 rounded-lg border border-gray-200"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Mapa del entrenamiento"
              ></iframe>
            </div>
          </div>

          <!-- Lista de Convocadas (solo si es convocatoria) -->
          <div v-if="entrenamientoDetallado.esConvocatoria && entrenamientoDetallado.jugadorasConvocadas && entrenamientoDetallado.jugadorasConvocadas.length > 0" class="bg-white rounded-xl border-2 border-purple-200 p-5 shadow-sm mb-6">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ClipboardDocumentListIcon class="w-5 h-5 text-white" />
              </div>
              <div class="text-xs text-gray-600 font-black uppercase tracking-wide">Jugadoras Convocadas ({{ entrenamientoDetallado.jugadorasConvocadas.length }})</div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              <div
                v-for="jugadora in entrenamientoDetallado.jugadorasConvocadas"
                :key="jugadora.id"
                class="flex items-center justify-between gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-400 transition-colors"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-purple-900 truncate">{{ jugadora.nombre }}</p>
                  <p class="text-xs text-purple-700">{{ jugadora.posicion }} - #{{ jugadora.dorsal }}</p>
                </div>
                <button
                  @click="desconvocarJugadora(jugadora.id)"
                  class="px-2 py-1 text-xs bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors whitespace-nowrap"
                  title="Desconvocar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Acciones y Notificaciones -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Acciones rápidas -->
            <div class="bg-white rounded-xl border-2 border-orange-200 p-5 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <ArrowPathIcon class="w-5 h-5 text-white" />
                </div>
                <div class="text-xs text-gray-600 font-black uppercase tracking-wide">Acciones rápidas</div>
              </div>
              <button
                @click="regenerarInscripciones(entrenamientoDetallado)"
                class="w-full px-4 py-3 rounded-xl font-bold transition-all text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
                title="Crear inscripciones pendientes para jugadoras que faltan"
              >
                <ArrowPathIcon class="w-5 h-5" />
                Regenerar pendientes
              </button>
            </div>
            <!-- Enviar Notificación -->
            <div class="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BellIcon class="w-5 h-5 text-white" />
                </div>
                <div class="text-xs text-gray-600 font-black uppercase tracking-wide">Enviar Notificación vía Correo</div>
              </div>
              <div class="space-y-3">
        
                <div class="pt-3 border-t border-gray-100">
                  <div class="flex items-center justify-between gap-3 mb-2">
                    <p class="text-[11px] font-black uppercase tracking-wide text-gray-500">Correo recordatorio</p>
                    <span v-if="entrenamientoDetallado?.emailNotification" class="text-[11px] font-semibold text-gray-500">
                      {{ formatearResumenEmail(entrenamientoDetallado.emailNotification) }}
                    </span>
                  </div>
                  <button
                    @click="reenviarCorreoRecordatorio"
                    :disabled="isSendingEmailReminder"
                    class="w-full px-4 py-3 rounded-xl font-bold transition-all text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-400 hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowPathIcon class="w-5 h-5" />
                    {{ isSendingEmailReminder ? 'Reenviando...' : 'Reenviar correo recordatorio' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs mejorados -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
            <div class="grid grid-cols-3 bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
              <button
                @click="tabDetalleAdmin = 'confirmadas'"
                :class="[
                  'w-full py-2.5 sm:py-4 px-1.5 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all relative',
                  tabDetalleAdmin === 'confirmadas'
                    ? 'text-green-700 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                ]"
              >
                <span class="flex flex-col items-center justify-center gap-2">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <CheckCircleIcon class="w-5 h-5" />
                    <span class="sm:hidden">Anot.</span>
                    <span class="hidden sm:inline">Anotadas</span>
                  </div>
                  <span :class="[
                    'rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black',
                    tabDetalleAdmin === 'confirmadas' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                  ]">
                    {{ inscritasOrganizadasAdmin.confirmadas.length }}
                  </span>
                </span>
                <div v-if="tabDetalleAdmin === 'confirmadas'" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
              </button>
              <button
                @click="tabDetalleAdmin = 'bajas'"
                :class="[
                  'w-full py-2.5 sm:py-4 px-1.5 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all relative',
                  tabDetalleAdmin === 'bajas'
                    ? 'text-red-700 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                ]"
              >
                <span class="flex flex-col items-center justify-center gap-2">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <XCircleIcon class="w-5 h-5" />
                    <span class="sm:hidden">Aus.</span>
                    <span class="hidden sm:inline">Ausentes</span>
                  </div>
                  <span :class="[
                    'rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black',
                    tabDetalleAdmin === 'bajas' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                  ]">
                    {{ inscritasOrganizadasAdmin.bajas.length }}
                  </span>
                </span>
                <div v-if="tabDetalleAdmin === 'bajas'" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              </button>
              <button
                @click="tabDetalleAdmin = 'pendientes'"
                :class="[
                  'w-full py-2.5 sm:py-4 px-1.5 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all relative',
                  tabDetalleAdmin === 'pendientes'
                    ? 'text-yellow-700 bg-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                ]"
              >
                <span class="flex flex-col items-center justify-center gap-2">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <QuestionMarkCircleIcon class="w-5 h-5" />
                    <span class="sm:hidden">Pend.</span>
                    <span class="hidden sm:inline">Pendientes</span>
                  </div>
                  <span :class="[
                    'rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black',
                    tabDetalleAdmin === 'pendientes' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'
                  ]">
                    {{ inscritasOrganizadasAdmin.pendientes.length }}
                  </span>
                </span>
                <div v-if="tabDetalleAdmin === 'pendientes'" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
              </button>
            </div>

            <!-- Contenido tabs -->
            <div class="p-4 min-h-60">
              <!-- Empty global -->
              <div
                v-if="
                  inscritasOrganizadasAdmin.confirmadas.length === 0 &&
                  inscritasOrganizadasAdmin.bajas.length === 0 &&
                  inscritasOrganizadasAdmin.pendientes.length === 0 &&
                  inscritasExcluidasAdmin.length === 0 &&
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
                  class="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all"
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
                  <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      @click="cambiarEstado(inscrita.id, 'pendiente')"
                      class="px-3 py-2 text-xs bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 transition-colors whitespace-nowrap w-full sm:w-auto"
                      title="Marcar como pendiente"
                    >
                      Pendiente
                    </button>
                    <button
                      @click="cambiarEstado(inscrita.id, 'baja')"
                      class="px-3 py-2 text-xs bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors whitespace-nowrap w-full sm:w-auto"
                      title="Marcar como ausente"
                    >
                      Ausente
                    </button>
                  </div>
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
                  class="bg-white rounded-lg border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all overflow-hidden"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center gap-3 p-3">
                    <div class="w-12 h-12 bg-linear-to-br from-primary-dark to-primary-light rounded-full flex items-center justify-center text-white font-black shadow-md shrink-0">
                      {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-bold text-gray-900 wrap-break-word">{{ inscrita.jugadoraNombre }}</div>
                      <div class="flex items-center gap-2 mt-1">
                        <div v-if="inscrita.fechaBaja" class="text-xs text-gray-400">
                          Baja: {{ formatFechaHora(inscrita.fechaBaja) }}
                        </div>
                        <div v-if="inscrita.motivoBaja" class="px-2 py-0.5 bg-blue-100 rounded-full">
                          <span class="text-blue-600 text-[10px] font-bold">💬 Motivo</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col gap-1 shrink-0">
                      <button
                        @click="cambiarEstado(inscrita.id, 'confirmada')"
                        class="px-3 py-1.5 text-xs bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition-colors whitespace-nowrap"
                        title="Marcar como presente"
                      >
                        Presente
                      </button>
                      <button
                        @click="cambiarEstado(inscrita.id, 'pendiente')"
                        class="px-3 py-1.5 text-xs bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 transition-colors whitespace-nowrap"
                        title="Marcar como pendiente"
                      >
                        Pendiente
                      </button>
                    </div>
                  </div>
                  <!-- Motivo de baja -->
                  <div v-if="inscrita.motivoBaja" class="px-3 pb-3">
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                      <div class="flex items-start gap-2">
                        <span class="text-blue-600 text-base shrink-0">💬</span>
                        <div class="flex-1">
                          <p class="text-xs font-bold text-blue-900 mb-1">Motivo de la ausencia:</p>
                          <p class="text-xs text-gray-700 italic leading-relaxed">"{{ inscrita.motivoBaja }}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  class="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all"
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
                  <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      @click="cambiarEstado(inscrita.id, 'confirmada')"
                      class="px-3 py-2 text-xs bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition-colors whitespace-nowrap w-full sm:w-auto"
                      title="Marcar como presente"
                    >
                      Presente
                    </button>
                    <button
                      @click="cambiarEstado(inscrita.id, 'baja')"
                      class="px-3 py-2 text-xs bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors whitespace-nowrap w-full sm:w-auto"
                      title="Marcar como ausente"
                    >
                      Ausente
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="inscritasExcluidasAdmin.length > 0" class="mt-4 rounded-xl border border-sky-200 bg-sky-50/80 p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h4 class="text-xs font-black uppercase tracking-wide text-sky-800">No contabilizan asistencia</h4>
                    <p class="text-xs text-sky-700">Quedan listadas aparte y no afectan los porcentajes.</p>
                  </div>
                  <span class="rounded-full bg-sky-600 px-3 py-1 text-xs font-black text-white">
                    {{ inscritasExcluidasAdmin.length }}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="inscrita in inscritasExcluidasAdmin"
                    :key="`admin-excluida-${inscrita.id}`"
                    class="flex items-center gap-3 rounded-lg border border-sky-100 bg-white p-3"
                  >
                    <div class="w-12 h-12 bg-linear-to-br from-sky-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-black shadow-md shrink-0">
                      {{ obtenerIniciales(inscrita.jugadoraNombre) }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-bold text-gray-900 wrap-break-word">{{ inscrita.jugadoraNombre }}</div>
                      <div class="text-xs text-gray-500 mt-1">Estado actual: {{ obtenerEstadoSaludExclusion(inscrita.estadoSalud) }}</div>
                    </div>
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

          <!-- Botón flotante de cerrar -->
          <div class="fixed bottom-6 right-6 z-20">
            <button
              @click="entrenamientoDetallado = null"
              class="bg-primary-dark text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-all shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          </div>
        </div>
      </div>
    </Transition>
    </div>
    
    <!-- Modal de confirmaci\u00f3n -->
    <Teleport to="body">
      <div v-if="mostrarModalDesempateMvp" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10000 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-gray-200 overflow-hidden">
          <div class="bg-linear-to-r from-primary-dark to-primary text-white p-5">
            <h3 class="text-lg font-black uppercase tracking-wide">Desempate MVP</h3>
            <p class="text-xs opacity-90 mt-1">Selecciona la MVP final para cerrar la votación</p>
          </div>

          <div class="p-5 space-y-4">
            <p class="text-sm text-gray-700 font-semibold">
              Hay empate en el primer lugar para
              <span class="font-black text-gray-900">{{ entrenamientoDesempateMvp?.nombre }}</span>.
            </p>

            <div class="space-y-2">
              <button
                v-for="item in candidatasEmpateMvp"
                :key="`desempate-${entrenamientoDesempateMvp?.id}-${item.nombre}`"
                @click="mvpSeleccionDesempate = item.nombre"
                :class="[
                  'w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all',
                  mvpSeleccionDesempate === item.nombre
                    ? 'border-primary bg-primary/10 text-primary-dark'
                    : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                ]"
              >
                <span class="font-bold">{{ item.nombre }}</span>
                <span class="text-xs font-black">{{ item.votos }} {{ item.votos === 1 ? 'voto' : 'votos' }}</span>
              </button>
            </div>
          </div>

          <div class="p-5 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              @click="cerrarModalDesempateMvp"
              :disabled="modalCargando"
              class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              @click="confirmarDesempateMvp"
              :disabled="!mvpSeleccionDesempate || modalCargando"
              class="flex-1 px-4 py-2.5 bg-linear-to-r from-primary-dark to-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {{ modalCargando ? 'Guardando...' : 'Elegir y cerrar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  BellIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  FlagIcon
} from '@heroicons/vue/24/outline';
import ModalConfirmacion from './ModalConfirmacion.vue';
import {
  crearEntrenamiento,
  fetchEntrenamientosPorEquipo,
  fetchTodosEntrenamientos,
  actualizarEntrenamiento,
  solicitarRecordatorioCorreoEntrenamiento,
  finalizarVotacionMvpEntrenamiento,
  eliminarEntrenamiento,
  isLoadingEntrenamientos,
  errorEntrenamientos,
  entrenamientos
} from '../firebase/entrenamientos';
import { escucharInscripcionesEntrenamiento, cambiarEstadoInscripcion, inscribirJugadoraManual, crearInscripcionesPendientes, sincronizarInscripcionesConvocatoria } from '../firebase/inscripciones';
import { fetchJugadorasRegistradasPorEquipo } from '../firebase/jugadorasAuth';
import { sendPushNotification } from '../firebase/notificaciones';
import { jugadoraExcluidaDeAsistencia, particionarInscripcionesPorAsistencia } from '../utils/disponibilidadEntrenamientos';

const mostrarFormulario = ref(false);
const isLoading = ref(false);
const error = ref(null);
const filtroEquipo = ref('');
const busqueda = ref('');
const entrenamientoEditando = ref(null);
const entrenamientoDetallado = ref(null);
const tabDetalleAdmin = ref('confirmadas');
const inscritasOrganizadasAdminRaw = ref({
  confirmadas: [],
  bajas: [],
  pendientes: []
});
const jugadorasRegistradasPorId = ref(new Map());
const unsubscribersListado = ref([]);
const unsubscribeDetalle = ref(null);
const busquedaJugadora = ref('');
const jugadorasDisponibles = ref([]);
const isSendingNotification = ref(false);
const isSendingEmailReminder = ref(false);
const notificationData = ref({ title: '', body: '' });
const mapaCargandoAdmin = ref(false);

const particionInscripcionesAdmin = computed(() => {
  return particionarInscripcionesPorAsistencia(inscritasOrganizadasAdminRaw.value, jugadorasRegistradasPorId.value);
});

const inscritasOrganizadasAdmin = computed(() => particionInscripcionesAdmin.value.visibles);
const inscritasExcluidasAdmin = computed(() => particionInscripcionesAdmin.value.excluidas);

// Mapeo para contar inscritas por estado
const conteoInscritas = ref({});

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

const formulario = ref({
  nombre: '',
  equipo: '',
  tipo: '',
  enviarCorreoJugadoras: true,
  rival: '',
  fecha: '',
  hora: '',
  horaFin: '',
  lugar: '',
  ubicacionMapa: '',
  descripcion: '',
  capacidadMaxima: null,
  mostrarEnProximoPartido: false,
  mvpHabilitado: false,
  esConvocatoria: false,
  jugadorasConvocadas: []
});

const busquedaConvocatoria = ref('');
const jugadorasParaConvocar = ref([]);
const mostrarModalDesempateMvp = ref(false);
const entrenamientoDesempateMvp = ref(null);
const candidatasEmpateMvp = ref([]);
const mvpSeleccionDesempate = ref('');

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

const esPartidoOAmistoso = (entrenamiento) => {
  const tipo = (entrenamiento?.tipo || '').toString().toLowerCase();
  return tipo === 'partido' || tipo === 'amistoso';
};

const mvpHabilitadoNormalizado = (entrenamiento) => {
  const mvpRaw = entrenamiento?.mvpHabilitado;
  return mvpRaw === undefined || mvpRaw === null
    ? true
    : (mvpRaw === true || mvpRaw === 'true' || mvpRaw === 1);
};

const mvpEmpatePendiente = (entrenamiento) => {
  if (!esPartidoOAmistoso(entrenamiento) || !mvpHabilitadoNormalizado(entrenamiento) || entrenamiento?.mvpCerrada) {
    return false;
  }

  const votosOrdenados = Array.isArray(entrenamiento?.mvpVotos)
    ? [...entrenamiento.mvpVotos]
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
    enviarCorreoJugadoras: true,
    rival: '',
    fecha: '',
    hora: '',
    horaFin: '',
    lugar: '',
    ubicacionMapa: '',
    descripcion: '',
    capacidadMaxima: null,
    mostrarEnProximoPartido: false,
    mvpHabilitado: false,
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
  
  // Manejar timestamp de Firestore (objeto con .seconds)
  if (fechaFormato && typeof fechaFormato === 'object' && fechaFormato.seconds) {
    const date = new Date(fechaFormato.seconds * 1000);
    fechaFormato = date.toISOString().split('T')[0];
  } else if (typeof fechaFormato === 'string' && fechaFormato.includes('T')) {
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
    enviarCorreoJugadoras: entrenamiento.enviarCorreoJugadoras !== false,
    rival: entrenamiento.rival || '',
    fecha: fechaFormato,
    hora: entrenamiento.hora,
    horaFin: entrenamiento.horaFin || '',
    lugar: entrenamiento.lugar,
    ubicacionMapa: entrenamiento.ubicacionMapa || '',
    descripcion: entrenamiento.descripcion || '',
    capacidadMaxima: entrenamiento.capacidadMaxima || null,
    mostrarEnProximoPartido: entrenamiento.mostrarEnProximoPartido || false,
    mvpHabilitado: entrenamiento.mvpHabilitado === true,
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
  mapaCargandoAdmin.value = Boolean(obtenerMapaEmbedUrl(entrenamiento));
  tabDetalleAdmin.value = 'confirmadas';
  busquedaJugadora.value = '';
  jugadorasDisponibles.value = [];
  notificationData.value = {
    title: entrenamiento.nombre,
    body: `Recordatorio: ${entrenamiento.tipo} el ${formatearFecha(entrenamiento.fecha)} a las ${entrenamiento.hora}`
  };

  // Desuscribir solo del listener anterior del detalle
  limpiarListenerDetalle();

  // Iniciar listener en tiempo real para este entrenamiento
  const unsubscribe = escucharInscripcionesEntrenamiento(entrenamiento.id, (organizadas) => {
    inscritasOrganizadasAdminRaw.value = organizadas;
    const { visibles, excluidas } = particionarInscripcionesPorAsistencia(organizadas, jugadorasRegistradasPorId.value);
    
    // Actualizar el conteo
    conteoInscritas.value[entrenamiento.id] = {
      confirmadas: visibles.confirmadas.length,
      bajas: visibles.bajas.length,
      pendientes: visibles.pendientes.length,
      excluidas: excluidas.length
    };
  }, () => entrenamientoDetallado.value); // Pasar función que retorna el entrenamiento actualizado

  unsubscribeDetalle.value = unsubscribe;
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

const limpiarListenersListado = () => {
  unsubscribersListado.value.forEach((unsub) => unsub?.());
  unsubscribersListado.value = [];
};

const limpiarListenerDetalle = () => {
  unsubscribeDetalle.value?.();
  unsubscribeDetalle.value = null;
};

const sincronizarListenersListado = () => {
  limpiarListenersListado();

  entrenamientos.value.forEach((ent) => {
    conteoInscritas.value[ent.id] = {
      confirmadas: 0,
      bajas: 0,
      pendientes: 0,
      excluidas: 0
    };

    const unsub = escucharInscripcionesEntrenamiento(ent.id, (organizadas) => {
      const { visibles, excluidas } = particionarInscripcionesPorAsistencia(organizadas, jugadorasRegistradasPorId.value);
      conteoInscritas.value[ent.id] = {
        confirmadas: visibles.confirmadas.length,
        bajas: visibles.bajas.length,
        pendientes: visibles.pendientes.length,
        excluidas: excluidas.length
      };
    }, ent);

    unsubscribersListado.value.push(unsub);
  });
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

const contarExcluidas = (entrenamientoId) => {
  return conteoInscritas.value[entrenamientoId]?.excluidas || 0;
};

// Cambiar estado de inscripción (admin)
const cambiarEstado = async (inscripcionId, nuevoEstado) => {
  try {
    const success = await cambiarEstadoInscripcion(inscripcionId, nuevoEstado);
    if (success) {
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
      ...inscritasOrganizadasAdminRaw.value.confirmadas,
      ...inscritasOrganizadasAdminRaw.value.bajas,
      ...inscritasOrganizadasAdminRaw.value.pendientes
    ].map(i => i.jugadoraId);
    
    // Filtrar por búsqueda y excluir inscritas
    jugadorasDisponibles.value = jugadorasRegistradas.filter(j => {
      const nombreCompleto = `${j.nombre} ${j.apellido}`.toLowerCase();
      return nombreCompleto.includes(busquedaJugadora.value.toLowerCase()) && 
             !jugadoraExcluidaDeAsistencia(j) &&
             !idsInscritas.includes(j.id);
    });
  } catch (err) {
    // // console.error('Error buscando jugadoras:', err);
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
      busquedaJugadora.value = '';
      jugadorasDisponibles.value = [];
    } else {
      alert('Error al agregar la jugadora');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

// Desconvocar jugadora (remover de la convocatoria)
const desconvocarJugadora = async (jugadoraId) => {
  if (!entrenamientoDetallado.value) return;
  
  try {
    // Confirmar acción
    if (!confirm('¿Estás seguro de que deseas desconvocar a esta jugadora?')) {
      return;
    }
    
    // Actualizar la lista de convocadas, removiendo esta jugadora
    const jugadorasActualizadas = entrenamientoDetallado.value.jugadorasConvocadas.filter(
      j => j.id !== jugadoraId
    );
    
    // Actualizar el entrenamiento en Firestore
    await actualizarEntrenamiento(entrenamientoDetallado.value.id, {
      jugadorasConvocadas: jugadorasActualizadas
    });
    
    // Sincronizar inscripciones (esto eliminará la inscripción pendiente o marcará como no convocada)
    await sincronizarInscripcionesConvocatoria(
      entrenamientoDetallado.value.id,
      jugadorasActualizadas
    );
    
    // Actualizar el objeto local
    entrenamientoDetallado.value.jugadorasConvocadas = jugadorasActualizadas;
    
    // Recargar todos los entrenamientos para actualizar la lista
    await fetchTodosEntrenamientos();
    
    alert('Jugadora desconvocada correctamente');
  } catch (err) {
    console.error('Error desconvocando jugadora:', err);
    alert('Error al desconvocar la jugadora: ' + err.message);
  }
};

// Función para manejar cambio de tipo de actividad
const onTipoChange = () => {
  // Si no es partido o amistoso, desactivar convocatoria
  if (formulario.value.tipo !== 'partido' && formulario.value.tipo !== 'amistoso') {
    formulario.value.rival = '';
    formulario.value.mostrarEnProximoPartido = false;
    formulario.value.mvpHabilitado = false;
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
    // // console.error('Error buscando jugadoras:', err);
  }
};

// Agregar jugadora a la convocatoria
const agregarJugadoraConvocatoria = (jugadora) => {
  formulario.value.jugadorasConvocadas.push({
    id: jugadora.id,
    nombre: `${jugadora.nombre} ${jugadora.apellido}`,
    posicion: jugadora.posicion,
    dorsal: jugadora.dorsal,
    fotoPerfil: jugadora.fotoPerfil || jugadora.foto || null
  });
  busquedaConvocatoria.value = '';
  jugadorasParaConvocar.value = [];
};

// Quitar jugadora de la convocatoria
const quitarJugadoraConvocatoria = (index) => {
  formulario.value.jugadorasConvocadas.splice(index, 1);
};

const enviarNotificacionEntrenamiento = async () => {
  if (!entrenamientoDetallado.value) return;
  if (!notificationData.value.title || !notificationData.value.body) {
    alert('Por favor, ingresa un título y un cuerpo para la notificación.');
    return;
  }

  isSendingNotification.value = true;
  try {
    const equipo = entrenamientoDetallado.value.equipo;
    const { title, body } = notificationData.value;
    if (equipo === 'ambos') {
      await sendPushNotification('ascenso', title, body);
      await sendPushNotification('escuela', title, body);
    } else {
      await sendPushNotification(equipo, title, body);
    }
    alert('Notificación enviada con éxito.');
  } catch (error) {
    alert('Error al enviar la notificación.');
    // // console.error(error);
  } finally {
    isSendingNotification.value = false;
  }
};

const aplicarEmailNotificationLocal = (emailNotification) => {
  if (!emailNotification || !entrenamientoDetallado.value) return;

  entrenamientoDetallado.value = {
    ...entrenamientoDetallado.value,
    emailNotification: {
      ...(entrenamientoDetallado.value.emailNotification || {}),
      ...emailNotification
    }
  };

  const entrenamientoIndex = entrenamientos.value.findIndex((item) => item.id === entrenamientoDetallado.value.id);
  if (entrenamientoIndex >= 0) {
    entrenamientos.value[entrenamientoIndex] = {
      ...entrenamientos.value[entrenamientoIndex],
      emailNotification: {
        ...(entrenamientos.value[entrenamientoIndex].emailNotification || {}),
        ...emailNotification
      }
    };
  }
};

const formatearResumenEmail = (emailNotification = {}) => {
  const estados = {
    queued: 'En cola',
    sent: 'Enviado',
    partial: 'Parcial',
    failed: 'Error',
    no_recipients: 'Sin destinatarias',
    skipped_missing_config: 'Falta configuración',
    disabled: 'Desactivado'
  };

  const estado = estados[emailNotification?.status] || 'Sin datos';
  const enviados = Number(emailNotification?.sentCount || 0);
  const destinatarias = Number(emailNotification?.recipientsCount || 0);

  if (destinatarias > 0) {
    return `${estado} · ${enviados}/${destinatarias}`;
  }

  return estado;
};

const reenviarCorreoRecordatorio = async () => {
  if (!entrenamientoDetallado.value?.id) return;

  isSendingEmailReminder.value = true;
  try {
    const result = await solicitarRecordatorioCorreoEntrenamiento(entrenamientoDetallado.value.id);
    aplicarEmailNotificationLocal(result?.emailNotification);
    alert(result?.success ? 'Solicitud de recordatorio enviada. El correo se procesará en unos segundos.' : 'La solicitud se registró con observaciones. Revisa el estado del entrenamiento.');
  } catch (error) {
    alert(error.message || 'No se pudo reenviar el correo recordatorio.');
  } finally {
    isSendingEmailReminder.value = false;
  }
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

const abrirMapaNuevaPestana = (entrenamiento) => {
  const url = obtenerMapaUrl(entrenamiento);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const guardarEntrenamiento = async () => {
  error.value = null;

  // Validar campos
  if (!formulario.value.nombre || !formulario.value.equipo || !formulario.value.tipo || !formulario.value.fecha || !formulario.value.hora || !formulario.value.lugar) {
    error.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  if (formulario.value.tipo === 'partido' && !formulario.value.rival?.trim()) {
    error.value = 'Para un partido debes ingresar el nombre del rival';
    return;
  }

  if ((formulario.value.tipo === 'partido' || formulario.value.tipo === 'amistoso') && !formulario.value.horaFin) {
    error.value = 'Para partidos o amistosos debes ingresar la hora de finalización';
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
        enviarCorreoJugadoras: formulario.value.enviarCorreoJugadoras === true,
        rival: formulario.value.rival?.trim() || '',
        fecha: fechaCorrecta,
        hora: formulario.value.hora,
        horaFin: formulario.value.horaFin || '',
        lugar: formulario.value.lugar,
        ubicacionMapa: formulario.value.ubicacionMapa?.trim() || '',
        descripcion: formulario.value.descripcion,
        capacidadMaxima: formulario.value.capacidadMaxima,
        mostrarEnProximoPartido: formulario.value.mostrarEnProximoPartido,
        mvpHabilitado: formulario.value.mvpHabilitado,
        esConvocatoria: formulario.value.esConvocatoria,
        jugadorasConvocadas: formulario.value.jugadorasConvocadas
      });
      
      // Si es una convocatoria, sincronizar las inscripciones
      if (formulario.value.esConvocatoria && formulario.value.jugadorasConvocadas.length > 0) {
        await sincronizarInscripcionesConvocatoria(
          entrenamientoEditando.value.id,
          formulario.value.jugadorasConvocadas
        );
      }
    } else {
      // Crear
      await crearEntrenamiento({
        nombre: formulario.value.nombre,
        equipo: formulario.value.equipo,
        tipo: formulario.value.tipo,
        enviarCorreoJugadoras: formulario.value.enviarCorreoJugadoras === true,
        rival: formulario.value.rival?.trim() || '',
        fecha: fechaCorrecta,
        hora: formulario.value.hora,
        horaFin: formulario.value.horaFin || '',
        lugar: formulario.value.lugar,
        ubicacionMapa: formulario.value.ubicacionMapa?.trim() || '',
        descripcion: formulario.value.descripcion,
        capacidadMaxima: formulario.value.capacidadMaxima,
        mostrarEnProximoPartido: formulario.value.mostrarEnProximoPartido,
        mvpHabilitado: formulario.value.mvpHabilitado,
        esConvocatoria: formulario.value.esConvocatoria,
        jugadorasConvocadas: formulario.value.jugadorasConvocadas
      });
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

const confirmarEliminar = (entrenamientoId) => {
  modalConfig.value = {
    titulo: '¿Eliminar entrenamiento?',
    mensaje: 'Esta acción eliminará el entrenamiento y todas las inscripciones asociadas.',
    detalles: 'Esta acción no se puede deshacer.',
    tipo: 'danger',
    textoConfirmar: 'Eliminar',
    accion: async () => {
      try {
        modalCargando.value = true;
        await eliminarEntrenamiento(entrenamientoId);
        
        // Recargar
        if (filtroEquipo.value) {
          await fetchEntrenamientosPorEquipo(filtroEquipo.value);
        } else {
          await fetchTodosEntrenamientos();
        }
        
        mostrarModal.value = false;
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      } finally {
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

// Regenerar inscripciones pendientes para un entrenamiento
const regenerarInscripciones = (entrenamiento) => {
  modalConfig.value = {
    titulo: '¿Crear inscripciones?',
    mensaje: `Se crearán inscripciones pendientes para todas las jugadoras del equipo ${entrenamiento.equipo}.`,
    detalles: 'Esto facilitará el control de asistencia.',
    tipo: 'info',
    textoConfirmar: 'Crear inscripciones',
    accion: async () => {
      try {
        modalCargando.value = true;
        const success = await crearInscripcionesPendientes(entrenamiento.id, entrenamiento.equipo);
        if (success) {
          alert('Inscripciones pendientes creadas correctamente');
          mostrarModal.value = false;
        } else {
          alert('No se pudieron crear las inscripciones. Verifica la consola.');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

const confirmarFinalizarVotacionMvp = (entrenamiento) => {
  const votosOrdenados = Array.isArray(entrenamiento?.mvpVotos)
    ? [...entrenamiento.mvpVotos]
        .map((item) => ({
          nombre: (item?.nombre || '').toString().trim(),
          votos: Math.max(0, Number(item?.votos) || 0)
        }))
        .filter((item) => item.nombre)
        .sort((a, b) => b.votos - a.votos)
    : [];

  const maxVotos = votosOrdenados.length > 0 ? votosOrdenados[0].votos : 0;
  const empatadas = maxVotos > 0
    ? votosOrdenados.filter((item) => item.votos === maxVotos)
    : [];

  if (empatadas.length > 1) {
    entrenamientoDesempateMvp.value = entrenamiento;
    candidatasEmpateMvp.value = empatadas;
    mvpSeleccionDesempate.value = '';
    mostrarModalDesempateMvp.value = true;
    return;
  }

  const ganadoraDirecta = empatadas.length === 1 ? empatadas[0].nombre : '';

  modalConfig.value = {
    titulo: '¿Finalizar votación MVP?',
    mensaje: `Se cerrará la votación MVP para "${entrenamiento.nombre}".`,
    detalles: 'Una vez finalizada, las jugadoras ya no podrán votar en este evento.',
    tipo: 'warning',
    textoConfirmar: 'Finalizar votación',
    accion: async () => {
      try {
        modalCargando.value = true;
        await finalizarVotacionMvpEntrenamiento(entrenamiento.id, ganadoraDirecta);

        if (filtroEquipo.value) {
          await fetchEntrenamientosPorEquipo(filtroEquipo.value);
        } else {
          await fetchTodosEntrenamientos();
        }

        if (entrenamientoDetallado.value?.id === entrenamiento.id) {
          entrenamientoDetallado.value = {
            ...entrenamientoDetallado.value,
            mvpCerrada: true,
            mvpCerradaAt: new Date(),
            mvpGanadoraFinal: ganadoraDirecta
          };
        }

        mostrarModal.value = false;
      } catch (err) {
        alert('Error al finalizar votación MVP: ' + err.message);
      } finally {
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

const cerrarModalDesempateMvp = () => {
  if (modalCargando.value) return;
  mostrarModalDesempateMvp.value = false;
  entrenamientoDesempateMvp.value = null;
  candidatasEmpateMvp.value = [];
  mvpSeleccionDesempate.value = '';
};

const confirmarDesempateMvp = async () => {
  if (!entrenamientoDesempateMvp.value?.id || !mvpSeleccionDesempate.value) return;

  try {
    modalCargando.value = true;
    await finalizarVotacionMvpEntrenamiento(
      entrenamientoDesempateMvp.value.id,
      mvpSeleccionDesempate.value
    );

    if (filtroEquipo.value) {
      await fetchEntrenamientosPorEquipo(filtroEquipo.value);
    } else {
      await fetchTodosEntrenamientos();
    }

    if (entrenamientoDetallado.value?.id === entrenamientoDesempateMvp.value.id) {
      entrenamientoDetallado.value = {
        ...entrenamientoDetallado.value,
        mvpCerrada: true,
        mvpCerradaAt: new Date(),
        mvpGanadoraFinal: mvpSeleccionDesempate.value
      };
    }

    cerrarModalDesempateMvp();
  } catch (err) {
    alert('Error al finalizar votación MVP: ' + err.message);
  } finally {
    modalCargando.value = false;
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
    await cargarJugadorasRegistradasMapa();
    // Cargar todos los entrenamientos (partidos, entrenamientos, eventos, ambos equipos)
    await fetchTodosEntrenamientos();
    sincronizarListenersListado();
  } catch (err) {
    // // console.error('Error cargando entrenamientos:', err);
  }
});

watch(entrenamientos, () => {
  sincronizarListenersListado();
});

// Limpiar listeners cuando se desmonta el componente
onUnmounted(() => {
  limpiarListenersListado();
  limpiarListenerDetalle();
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
