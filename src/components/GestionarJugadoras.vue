<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestionar Jugadoras</h2>

    <!-- Selector de equipo -->
    <div class="bg-white rounded-lg shadow p-6">
      <label class="block text-sm font-medium text-gray-700 mb-4">
        Selecciona un equipo
      </label>
      <div class="flex gap-4">
        <button
          v-for="eq in equipos"
          :key="eq.id"
          @click="equipoSeleccionado = eq.id"
          :class="[
            'px-6 py-2 rounded-lg font-bold uppercase transition-colors cursor-pointer',
            equipoSeleccionado === eq.id
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ eq.label }}
        </button>
      </div>
    </div>

    <!-- Formulario para agregar jugadora -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6">Agregar Nueva Jugadora</h3>
      
      <form @submit.prevent="handleAgregarJugadora" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            v-model="formulario.nombre"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nombre"
          />
        </div>

        <!-- Apellido -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Apellido
          </label>
          <input
            v-model="formulario.apellido"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Apellido"
          />
        </div>

        <!-- Posición -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Posición
          </label>
          <select
            v-model="formulario.posicion"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona una posición</option>
            <option value="Directora Técnica">Directora Técnica</option>
            <option value="Preparador Porteras">Preparador Porteras</option>
            <option value="Portera">Portera</option>
            <option value="Cierre">Cierre</option>
            <option value="Ala">Ala</option>
            <option value="Medio">Medio</option>
            <option value="Pívot">Pívot</option>
          </select>
        </div>

        <!-- Dorsal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Dorsal (número)
          </label>
          <input
            v-model.number="formulario.numero"
            type="number"
            min="0"
            max="99"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estado actual
          </label>
          <select
            v-model="formulario.estadoSalud"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="disponible">Disponible</option>
            <option value="lesionada">Lesionada</option>
            <option value="recuperacion">En recuperación</option>
            <option value="vacaciones">De vacaciones</option>
            <option value="no_disponible">No disponible</option>
          </select>
        </div>

        <!-- Foto -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Foto
          </label>
          <div class="flex gap-4">
            <input
              ref="inputFoto"
              type="file"
              accept="image/*"
              @change="handleFotoSeleccionada"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.inputFoto.click()"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Seleccionar foto
            </button>
            <span v-if="formulario.fotoNombre" class="text-sm text-gray-600">
              {{ formulario.fotoNombre }}
            </span>
          </div>
          <!-- Preview de foto -->
          <img
            v-if="formulario.fotoPreview"
            :src="formulario.fotoPreview"
            alt="Preview"
            class="mt-4 h-32 w-32 object-cover rounded-lg"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- Botón -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary text-white py-2 rounded-lg font-bold uppercase hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
        >
          {{ isLoading ? 'Guardando...' : 'Agregar Jugadora' }}
        </button>
      </form>
    </div>

    <!-- Lista de jugadoras -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6">
        Jugadoras del equipo {{ equipoActual?.label || 'Selecciona un equipo' }}
      </h3>

      <div v-if="isLoading" class="text-center text-gray-500">
        Cargando jugadoras...
      </div>

      <div v-else-if="jugadoras.length === 0" class="text-center text-gray-500">
        No hay jugadoras registradas en este equipo
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="jugadora in jugadoras" :key="jugadora.id" class="border border-gray-200 rounded-lg overflow-hidden">
          <!-- Foto -->
          <img
            v-if="jugadora.foto"
            :src="jugadora.foto"
            :alt="jugadora.nombre"
            class="w-full h-40 object-cover object-top"
          />
          <div v-else class="w-full h-40 bg-gray-200 flex items-center justify-center">
            <span class="text-gray-400">Sin foto</span>
          </div>

          <!-- Información -->
          <div class="p-4">
            <h4 class="text-lg font-bold text-black">
              {{ jugadora.nombre }} {{ jugadora.apellido }}
            </h4>
            <p class="text-primary font-bold">{{ jugadora.posicion }}</p>
            <p class="text-gray-600 text-sm">Dorsal: {{ jugadora.numero }}</p>
            <p class="text-gray-600 text-sm">Estado: {{ formatearEstadoSalud(jugadora.estadoSalud) }}</p>

            <!-- Acciones -->
            <div class="flex gap-2 mt-4">
              <button
                @click="editarJugadora(jugadora)"
                class="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm font-bold hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Editar
              </button>
              <button
                @click="confirmarEliminar(jugadora.id)"
                class="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm font-bold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición (opcional para después) -->
    <!-- Aquí podríamos agregar un modal para editar jugadoras -->
    
    <!-- Modal de confirmación -->
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
import { ref, computed, onMounted, watch } from 'vue';
import ModalConfirmacion from './ModalConfirmacion.vue';
import { 
  fetchJugadorasByEquipo, 
  crearJugadora, 
  eliminarJugadora,
  jugadoras,
  isLoading,
  error
} from '../firebase/jugadoras';

const equipoSeleccionado = ref('ascenso');
const inputFoto = ref(null);

const equipos = [
  { id: 'ascenso', label: 'Ascenso' },
  { id: 'escuela', label: 'Escuela' },
  { id: 'futsal', label: 'Futsal' },
];

const formulario = ref({
  nombre: '',
  apellido: '',
  posicion: '',
  numero: 0,
  estadoSalud: 'disponible',
  fotoFile: null,
  fotoNombre: '',
  fotoPreview: null
});

const formatearEstadoSalud = (estado) => {
  const map = {
    disponible: 'Disponible',
    lesionada: 'Lesionada',
    recuperacion: 'En recuperación',
    vacaciones: 'De vacaciones',
    no_disponible: 'No disponible'
  };

  return map[estado] || 'Disponible';
};

const equipoActual = computed(() => 
  equipos.find(e => e.id === equipoSeleccionado.value)
);

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

// Cargar jugadoras cuando cambia el equipo
watch(equipoSeleccionado, () => {
  cargarJugadoras();
});

const cargarJugadoras = async () => {
  await fetchJugadorasByEquipo(equipoSeleccionado.value);
};

const handleFotoSeleccionada = (event) => {
  const file = event.target.files[0];
  if (file) {
    formulario.value.fotoFile = file;
    formulario.value.fotoNombre = file.name;
    
    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      formulario.value.fotoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleAgregarJugadora = async () => {
  try {
    await crearJugadora(
      {
        nombre: formulario.value.nombre,
        apellido: formulario.value.apellido,
        posicion: formulario.value.posicion,
        numero: formulario.value.numero,
        estadoSalud: formulario.value.estadoSalud,
        equipo: equipoSeleccionado.value
      },
      formulario.value.fotoFile
    );
    
    // Limpiar formulario
    formulario.value = {
      nombre: '',
      apellido: '',
      posicion: '',
      numero: 0,
      estadoSalud: 'disponible',
      fotoFile: null,
      fotoNombre: '',
      fotoPreview: null
    };
    
    // Recargar jugadoras
    await cargarJugadoras();
  } catch (err) {
    // console.error('Error:', err);
  }
};

const confirmarEliminar = (jugadoraId) => {
  const jugadora = jugadoras.value.find(j => j.id === jugadoraId);
  
  modalConfig.value = {
    titulo: '¿Eliminar jugadora?',
    mensaje: `Estás a punto de eliminar a ${jugadora.nombre} ${jugadora.apellido}.`,
    detalles: 'Esta acción eliminará la jugadora y su foto. No se puede deshacer.',
    tipo: 'danger',
    textoConfirmar: 'Eliminar',
    accion: async () => {
      try {
        modalCargando.value = true;
        await eliminarJugadora(jugadoraId, jugadora.foto);
        await cargarJugadoras();
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

const editarJugadora = (jugadora) => {
  // Por ahora solo mostramos un alert
  alert(`Editar: ${jugadora.nombre} ${jugadora.apellido}\n(Función en desarrollo)`);
};

// Cargar jugadoras al montar el componente
onMounted(() => {
  cargarJugadoras();
});
</script>
