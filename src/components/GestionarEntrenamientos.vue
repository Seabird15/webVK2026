<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestionar Entrenamientos</h2>
      <button
        @click="mostrarFormularioNuevo"
        class="bg-primary-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-primary transition-colors"
      >
        + Nuevo Entrenamiento
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
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <!-- Encabezado Modal -->
        <div class="bg-primary text-white p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold">
            {{ entrenamientoEditando ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento' }}
          </h3>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardarEntrenamiento" class="p-6 space-y-4">
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
            </select>
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
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="cerrarFormulario"
              :disabled="isLoading"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-4 py-2 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary transition-colors disabled:opacity-50"
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
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ entrenamiento.nombre }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ formatearFecha(entrenamiento.fecha) }} a las {{ entrenamiento.hora }}
            </p>
          </div>
          <span class="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold capitalize">
            {{ entrenamiento.equipo }}
          </span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p class="text-gray-600 font-semibold">Lugar</p>
            <p class="text-gray-900">{{ entrenamiento.lugar }}</p>
          </div>
          <div v-if="entrenamiento.capacidadMaxima">
            <p class="text-gray-600 font-semibold">Capacidad</p>
            <p class="text-gray-900">{{ entrenamiento.capacidadMaxima }} personas</p>
          </div>
          <div v-if="entrenamiento.descripcion">
            <p class="text-gray-600 font-semibold">Descripción</p>
            <p class="text-gray-900">{{ entrenamiento.descripcion.substring(0, 30) }}...</p>
          </div>
          <div>
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

        <div class="flex gap-2">
          <button
            @click="verDetallesEntrenamiento(entrenamiento)"
            class="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Ver Detalles
          </button>
          <button
            @click="editarEntrenamiento(entrenamiento)"
            class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-colors"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminar(entrenamiento.id)"
            class="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles de inscripciones -->
    <div v-if="entrenamientoDetallado" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">{{ entrenamientoDetallado.nombre }}</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ formatearFecha(entrenamientoDetallado.fecha) }} a las {{ entrenamientoDetallado.hora }}
            </p>
          </div>
          <button
            @click="entrenamientoDetallado = null"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Confirmadas -->
          <div v-if="inscritasOrganizadasAdmin.confirmadas.length > 0">
            <h3 class="font-bold text-green-700 text-lg mb-3 flex items-center gap-2">
              <span class="text-2xl">✓</span> Confirmadas ({{ inscritasOrganizadasAdmin.confirmadas.length }})
            </h3>
            <div class="space-y-2">
              <transition-group name="fade" tag="div">
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.confirmadas"
                  :key="inscrita.id"
                  class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 transition-all"
                >
                  <span class="text-gray-900 font-semibold">{{ inscrita.jugadoraNombre }}</span>
                  <span class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-bold">Confirmada</span>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- Bajas -->
          <div v-if="inscritasOrganizadasAdmin.bajas.length > 0">
            <h3 class="font-bold text-red-700 text-lg mb-3 flex items-center gap-2">
              <span class="text-2xl">✕</span> Bajas ({{ inscritasOrganizadasAdmin.bajas.length }})
            </h3>
            <div class="space-y-2">
              <transition-group name="fade" tag="div">
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.bajas"
                  :key="inscrita.id"
                  class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 transition-all"
                >
                  <span class="text-gray-900 font-semibold">{{ inscrita.jugadoraNombre }}</span>
                  <span class="text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-bold">Baja</span>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- Pendientes -->
          <div v-if="inscritasOrganizadasAdmin.pendientes.length > 0">
            <h3 class="font-bold text-yellow-700 text-lg mb-3 flex items-center gap-2">
              <span class="text-2xl">?</span> Sin respuesta ({{ inscritasOrganizadasAdmin.pendientes.length }})
            </h3>
            <div class="space-y-2">
              <transition-group name="fade" tag="div">
                <div
                  v-for="inscrita in inscritasOrganizadasAdmin.pendientes"
                  :key="inscrita.id"
                  class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 transition-all"
                >
                  <span class="text-gray-900 font-semibold">{{ inscrita.jugadoraNombre }}</span>
                  <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold">Pendiente</span>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- Sin inscritas -->
          <div v-if="inscritasOrganizadasAdmin.confirmadas.length === 0 && inscritasOrganizadasAdmin.bajas.length === 0 && inscritasOrganizadasAdmin.pendientes.length === 0" class="text-center py-8">
            <p class="text-gray-500 text-lg">No hay inscritas en este entrenamiento aún</p>
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
import { escucharInscripcionesEntrenamiento } from '../firebase/inscripciones';

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

// Mapeo para contar inscritas por estado
const conteoInscritas = ref({});

const formulario = ref({
  nombre: '',
  equipo: '',
  fecha: '',
  hora: '',
  lugar: '',
  descripcion: '',
  capacidadMaxima: null
});

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
    fecha: '',
    hora: '',
    lugar: '',
    descripcion: '',
    capacidadMaxima: null
  };
  error.value = null;
  mostrarFormulario.value = true;
};

const editarEntrenamiento = (entrenamiento) => {
  entrenamientoEditando.value = entrenamiento;
  formulario.value = {
    nombre: entrenamiento.nombre,
    equipo: entrenamiento.equipo,
    fecha: entrenamiento.fecha,
    hora: entrenamiento.hora,
    lugar: entrenamiento.lugar,
    descripcion: entrenamiento.descripcion || '',
    capacidadMaxima: entrenamiento.capacidadMaxima || null
  };
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

const guardarEntrenamiento = async () => {
  error.value = null;

  // Validar campos
  if (!formulario.value.nombre || !formulario.value.equipo || !formulario.value.fecha || !formulario.value.hora || !formulario.value.lugar) {
    error.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  isLoading.value = true;

  try {
    if (entrenamientoEditando.value) {
      // Actualizar
      await actualizarEntrenamiento(entrenamientoEditando.value.id, {
        nombre: formulario.value.nombre,
        equipo: formulario.value.equipo,
        fecha: formulario.value.fecha,
        hora: formulario.value.hora,
        lugar: formulario.value.lugar,
        descripcion: formulario.value.descripcion,
        capacidadMaxima: formulario.value.capacidadMaxima
      });
      console.log('Entrenamiento actualizado');
    } else {
      // Crear
      await crearEntrenamiento({
        nombre: formulario.value.nombre,
        equipo: formulario.value.equipo,
        fecha: formulario.value.fecha,
        hora: formulario.value.hora,
        lugar: formulario.value.lugar,
        descripcion: formulario.value.descripcion,
        capacidadMaxima: formulario.value.capacidadMaxima
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

const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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
