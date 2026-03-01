<template>
  <div class="space-y-8">
    <!-- Formulario para crear nueva galería -->
    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
      <h3 class="text-xl font-bold mb-6 text-black">Nueva Galería</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Título de la Galería</label>
          <input 
            v-model="formularioGaleria.titulo" 
            type="text" 
            placeholder="Ej: FINAL - VIKINGAS VS LEYENDAS"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
          <textarea 
            v-model="formularioGaleria.descripcion" 
            placeholder="Descripción opcional"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Orden</label>
          <input 
            v-model.number="formularioGaleria.orden" 
            type="number" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <button 
          @click="crearNuevaGaleria"
          :disabled="cargando"
          class="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {{ cargando ? 'Creando...' : 'Crear Galería' }}
        </button>
      </div>
    </div>

    <!-- Lista de galerías -->
    <div class="space-y-6">
      <h3 class="text-2xl font-bold text-black">Galerías Actuales</h3>
      
      <div v-if="galerias.length === 0" class="text-center py-8 text-gray-500">
        No hay galerías creadas aún
      </div>

      <div v-for="galeria in galerias" :key="galeria.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h4 class="text-xl font-bold text-black mb-2">{{ galeria.titulo }}</h4>
              <p class="text-gray-600 text-sm">{{ galeria.descripcion || 'Sin descripción' }}</p>
              <div class="flex gap-4 mt-3">
                <label class="text-xs text-gray-600 font-bold">
                  Orden: 
                  <input 
                    type="number" 
                    :value="galeria.orden"
                    @change="(e) => actualizarOrden(galeria.id, parseInt(e.target.value))"
                    class="w-12 px-2 py-1 border border-gray-300 rounded ml-1"
                  />
                </label>
                <span v-if="galeria.orden === 1" class="text-xs px-2 py-1 bg-primary/20 text-primary font-bold rounded">Destacado</span>
              </div>
            </div>
            <button 
              @click="eliminarGaleriaConfirm(galeria.id)"
              class="text-red-500 hover:text-red-700 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Upload de fotos -->
          <div class="mt-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">Agregar Fotos</label>
            <div class="flex gap-2 flex-col lg:flex-row">
              <input 
                type="file" 
                multiple
                accept="image/*"
                @change="(e) => seleccionarFotos(e, galeria.id)"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button 
                @click="subirFotosGaleria(galeria.id)"
                :disabled="!fotosSeleccionadas[galeria.id] || cargando"
                class="bg-primary text-black font-bold px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
              >
                Subir
              </button>
            </div>
          </div>
        </div>

        <!-- Galería de fotos -->
        <div v-if="galeria.fotos && galeria.fotos.length > 0" class="p-6 bg-gray-50">
          <h5 class="font-bold text-black mb-4">Fotos ({{ galeria.fotos.length }})</h5>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(foto, idx) in galeria.fotos" :key="idx" class="relative group">
              <img 
                :src="foto.url" 
                :alt="foto.nombre"
                class="w-full h-32 object-cover rounded-lg"
              />
              <button 
                @click="eliminarFoto(galeria.id, foto.url)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
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
import { ref, onMounted } from 'vue';
import ModalConfirmacion from './ModalConfirmacion.vue';
import { 
  crearGaleria as crearGaleriaFirebase,
  obtenerGalerias,
  actualizarGaleria,
  eliminarGaleria,
  subirFotoGaleria,
  agregarFotoAGaleria,
  eliminarFotoDeGaleria
} from '../firebase/galerias';

const galerias = ref([]);
const cargando = ref(false);
const fotosSeleccionadas = ref({});

const formularioGaleria = ref({
  titulo: '',
  descripcion: '',
  orden: 0
});

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

const cargarGalerias = async () => {
  try {
    galerias.value = await obtenerGalerias();
  } catch (error) {
    // console.error('Error al cargar galerías:', error);
  }
};

const crearNuevaGaleria = async () => {
  if (!formularioGaleria.value.titulo.trim()) {
    alert('Por favor ingresa un título');
    return;
  }

  cargando.value = true;
  try {
    await crearGaleriaFirebase(formularioGaleria.value);
    formularioGaleria.value = { titulo: '', descripcion: '', orden: 0 };
    await cargarGalerias();
    alert('Galería creada exitosamente');
  } catch (error) {
    // console.error('Error:', error);
    alert('Error al crear galería');
  } finally {
    cargando.value = false;
  }
};

const seleccionarFotos = (event, galeriaId) => {
  fotosSeleccionadas.value[galeriaId] = event.target.files;
};

const subirFotosGaleria = async (galeriaId) => {
  const archivos = fotosSeleccionadas.value[galeriaId];
  if (!archivos || archivos.length === 0) return;

  cargando.value = true;
  try {
    for (let i = 0; i < archivos.length; i++) {
      const fotoData = await subirFotoGaleria(galeriaId, archivos[i]);
      await agregarFotoAGaleria(galeriaId, fotoData);
    }
    delete fotosSeleccionadas.value[galeriaId];
    await cargarGalerias();
    alert('Fotos subidas exitosamente');
  } catch (error) {
    // console.error('Error:', error);
    alert('Error al subir fotos');
  } finally {
    cargando.value = false;
  }
};

const actualizarOrden = async (id, nuevoOrden) => {
  try {
    await actualizarGaleria(id, { orden: nuevoOrden });
    await cargarGalerias();
  } catch (error) {
    // console.error('Error:', error);
    alert('Error al actualizar el orden');
  }
};

const eliminarGaleriaConfirm = (id) => {
  const galeria = galerias.value.find(g => g.id === id);
  
  modalConfig.value = {
    titulo: '¿Eliminar galería?',
    mensaje: `Estás a punto de eliminar la galería "${galeria?.titulo || 'Sin título'}".`,
    detalles: 'Se eliminarán todas las fotos asociadas. Esta acción no se puede deshacer.',
    tipo: 'danger',
    textoConfirmar: 'Eliminar',
    accion: async () => {
      try {
        modalCargando.value = true;
        await eliminarGaleria(id);
        await cargarGalerias();
        alert('Galería eliminada');
        mostrarModal.value = false;
      } catch (error) {
        alert('Error al eliminar galería');
      } finally {
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

const eliminarFoto = (galeriaId, fotoUrl) => {
  modalConfig.value = {
    titulo: '¿Eliminar foto?',
    mensaje: 'Estás a punto de eliminar esta foto de la galería.',
    detalles: 'Esta acción no se puede deshacer.',
    tipo: 'danger',
    textoConfirmar: 'Eliminar',
    accion: async () => {
      try {
        modalCargando.value = true;
        await eliminarFotoDeGaleria(galeriaId, fotoUrl);
        await cargarGalerias();
        mostrarModal.value = false;
      } catch (error) {
        alert('Error al eliminar foto');
      } finally {
        modalCargando.value = false;
      }
    }
  };
  mostrarModal.value = true;
};

onMounted(() => {
  cargarGalerias();
});
</script>
