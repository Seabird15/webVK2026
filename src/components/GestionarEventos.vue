<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestionar Eventos</h2>

    <!-- Formulario para agregar evento -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6">{{ editandoId ? 'Editar Evento' : 'Crear Nuevo Evento' }}</h3>
      
      <form @submit.prevent="handleGuardarEvento" class="space-y-4">
        <!-- Título -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Título del Evento *
          </label>
          <input
            v-model="formulario.titulo"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: Entrenamiento Ascenso"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            v-model="formulario.descripcion"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Detalles del evento..."
          ></textarea>
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Fecha *
          </label>
          <input
            v-model="formulario.fecha"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Hora -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora *
          </label>
          <input
            v-model="formulario.hora"
            type="time"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Tipo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Evento *
          </label>
          <select
            v-model="formulario.tipo"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona un tipo</option>
            <option value="entrenamiento">Entrenamiento</option>
            <option value="partido">Partido</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <!-- Equipo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Equipo (opcional)
          </label>
          <select
            v-model="formulario.equipo"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los equipos</option>
            <option value="ascenso">Ascenso</option>
            <option value="escuela">Escuela</option>
            <option value="futsal">Futsal</option>
          </select>
        </div>

        <!-- Lugar -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Lugar (opcional)
          </label>
          <input
            v-model="formulario.lugar"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: Cancha Principal"
          />
        </div>

        <!-- Botones -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 disabled:bg-gray-400 text-white rounded-lg font-bold transition-colors cursor-pointer"
          >
            {{ isLoading ? 'Guardando...' : editandoId ? 'Actualizar' : 'Crear' }}
          </button>
          <button
            v-if="editandoId"
            type="button"
            @click="cancelarEdicion"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de eventos -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6">Eventos Próximos</h3>
      
      <div v-if="eventosProximos.length === 0" class="text-center py-12 text-gray-500">
        <p>No hay eventos próximos</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="evento in eventosProximos"
          :key="evento.id"
          class="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex-1">
            <h4 class="font-bold text-gray-900">{{ evento.titulo }}</h4>
            <p class="text-sm text-gray-600">
              📅 {{ formatearFecha(evento.fecha) }} a las {{ evento.hora }}
            </p>
            <div class="flex gap-2 mt-2">
              <span
                :class="[
                  'text-xs px-2 py-1 rounded font-semibold',
                  obtenerColorEvento(evento.equipo)
                ]"
              >
                {{ evento.equipo || 'general' }}
              </span>
              <span
                :class="[
                  'text-xs px-2 py-1 rounded font-semibold',
                  evento.tipo === 'partido'
                    ? 'bg-yellow-100 text-yellow-800'
                    : evento.tipo === 'entrenamiento'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-pink-100 text-pink-800'
                ]"
              >
                {{ evento.tipo }}
              </span>
            </div>
            <p v-if="evento.lugar" class="text-sm text-gray-700 mt-2">📍 {{ evento.lugar }}</p>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="cargarEvento(evento)"
              class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold text-sm transition-colors cursor-pointer"
            >
              Editar
            </button>
            <button
              @click="confirmarEliminar(evento.id)"
              class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-bold text-sm transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { crearEvento, actualizarEvento, eliminarEvento, obtenerTodosEventos } from '../firebase/eventos';

const formulario = ref({
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  tipo: '',
  equipo: '',
  lugar: ''
});

const isLoading = ref(false);
const editandoId = ref(null);
const eventos = ref([]);

const eventosProximos = computed(() => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return eventos.value
    .filter(evento => {
      const fecha = new Date(evento.fecha.seconds ? evento.fecha.seconds * 1000 : evento.fecha);
      return fecha >= hoy;
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fecha.seconds ? a.fecha.seconds * 1000 : a.fecha);
      const fechaB = new Date(b.fecha.seconds ? b.fecha.seconds * 1000 : b.fecha);
      return fechaA - fechaB;
    });
});

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha.seconds ? fecha.seconds * 1000 : fecha);
  const opciones = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('es-ES', opciones);
};

const obtenerColorEvento = (equipo) => {
  switch (equipo) {
    case 'ascenso':
      return 'bg-red-100 text-red-800';
    case 'escuela':
      return 'bg-blue-100 text-blue-800';
    case 'futsal':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const resetFormulario = () => {
  formulario.value = {
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    tipo: '',
    equipo: '',
    lugar: ''
  };
  editandoId.value = null;
};

const handleGuardarEvento = async () => {
  if (!formulario.value.titulo || !formulario.value.fecha || !formulario.value.hora || !formulario.value.tipo) {
    alert('Por favor completa todos los campos obligatorios');
    return;
  }

  isLoading.value = true;
  try {
    if (editandoId.value) {
      await actualizarEvento(editandoId.value, formulario.value);
      alert('Evento actualizado correctamente');
    } else {
      await crearEvento(formulario.value);
      alert('Evento creado correctamente');
    }
    resetFormulario();
    cargarEventos();
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    isLoading.value = false;
  }
};

const cargarEvento = (evento) => {
  const fecha = new Date(evento.fecha.seconds ? evento.fecha.seconds * 1000 : evento.fecha);
  const fechaStr = fecha.toISOString().split('T')[0];
  
  formulario.value = {
    titulo: evento.titulo,
    descripcion: evento.descripcion || '',
    fecha: fechaStr,
    hora: evento.hora,
    tipo: evento.tipo,
    equipo: evento.equipo || '',
    lugar: evento.lugar || ''
  };
  editandoId.value = evento.id;
  
  // Scroll al formulario
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelarEdicion = () => {
  resetFormulario();
};

const confirmarEliminar = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
    try {
      await eliminarEvento(id);
      alert('Evento eliminado correctamente');
      cargarEventos();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }
};

const cargarEventos = async () => {
  try {
    eventos.value = await obtenerTodosEventos();
  } catch (err) {
    // console.error('Error cargando eventos:', err);
  }
};

onMounted(() => {
  cargarEventos();
});
</script>
