<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestionar Slider Home</h2>

    <!-- Vista previa del slider actual -->
    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
      <h3 class="font-bold text-lg mb-4 text-blue-900">Vista Previa</h3>
      <div class="flex gap-4 overflow-x-auto pb-4">
        <div 
          v-for="(imagen, idx) in imagenes" 
          :key="imagen.id"
          class="flex-shrink-0"
        >
          <img 
            :src="imagen.url" 
            :alt="`Slide ${idx + 1}`"
            class="w-40 h-24 object-cover rounded-lg border-2 border-blue-300"
          />
          <p class="text-sm text-gray-600 mt-2 text-center">Orden: {{ idx + 1 }}</p>
        </div>
      </div>
    </div>

    <!-- Cargar nueva imagen -->
    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
      <h3 class="font-bold text-lg mb-4">Agregar Nueva Imagen</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Seleccionar imagen
          </label>
          <input 
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-bold
              file:bg-primary file:text-white
              hover:file:bg-primary-dark
              cursor-pointer"
          />
          <p class="text-xs text-gray-600 mt-2">
            ✓ Formatos soportados: JPG, PNG, WebP. Se recomienda WebP para mejor rendimiento.
          </p>
        </div>

        <div v-if="archivoSeleccionado" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p class="text-sm text-gray-700">
            <strong>Archivo:</strong> {{ archivoSeleccionado.name }}
          </p>
          <p class="text-sm text-gray-700">
            <strong>Tamaño:</strong> {{ (archivoSeleccionado.size / 1024 / 1024).toFixed(2) }} MB
          </p>
        </div>

        <button 
          @click="subirImagen"
          :disabled="!archivoSeleccionado || cargando"
          class="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
        >
          <span v-if="!cargando">📤 Subir Imagen</span>
          <span v-else>Cargando...</span>
        </button>
      </div>
    </div>

    <!-- Lista de imágenes actuales -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="font-bold text-lg mb-4">Imágenes del Slider</h3>
      
      <div v-if="imagenes.length === 0" class="text-center py-8 text-gray-500">
        <p>No hay imágenes en el slider aún. ¡Agrega una para comenzar!</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="(imagen, idx) in imagenes"
          :key="imagen.id"
          class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <!-- Número de orden -->
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ idx + 1 }}</p>
            <p class="text-xs text-gray-600">Posición</p>
          </div>

          <!-- Miniatura -->
          <img 
            :src="imagen.url" 
            :alt="`Slide ${idx + 1}`"
            class="w-32 h-24 object-cover rounded-lg border border-gray-300"
          />

          <!-- Información -->
          <div class="flex-1">
            <p class="text-sm text-gray-600 break-all">{{ imagen.nombreArchivo }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ new Date(imagen.createdAt?.toDate?.()).toLocaleDateString('es-ES') || 'Fecha desconocida' }}
            </p>
          </div>

          <!-- Botones de control -->
          <div class="flex gap-2">
            <button 
              @click="moverArriba(idx)"
              :disabled="idx === 0 || cargando"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm cursor-pointer"
              title="Mover arriba"
            >
              ⬆️
            </button>

            <button 
              @click="moverAbajo(idx)"
              :disabled="idx === imagenes.length - 1 || cargando"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm cursor-pointer"
              title="Mover abajo"
            >
              ⬇️
            </button>

            <button 
              @click="eliminarImagen(imagen.id, imagen.nombreArchivo, idx)"
              :disabled="cargando"
              class="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm cursor-pointer"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>

        <!-- Información sobre reordenamiento -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <p class="text-sm text-yellow-800">
            💡 Usa los botones ⬆️ y ⬇️ para cambiar el orden de las imágenes en el slider.
          </p>
        </div>
      </div>
    </div>

    <!-- Información util -->
    <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6">
      <h3 class="font-bold text-lg text-green-900 mb-3">📋 Recomendaciones</h3>
      <ul class="text-sm text-green-800 space-y-2">
        <li>✓ <strong>Formato WebP:</strong> Proporciona mejor compresión (hasta 25-35% menor que JPG)</li>
        <li>✓ <strong>Tamaño recomendado:</strong> 1920x600px o superior (relación 16:5)</li>
        <li>✓ <strong>Peso máximo:</strong> Mantén cada imagen bajo 500KB</li>
        <li>✓ <strong>Conversión:</strong> Usa herramientas online como <a href="https://convertio.co/es/jpg-webp/" target="_blank" class="font-bold text-green-700 underline">Convertio</a> o <a href="https://imagify.io/" target="_blank" class="font-bold text-green-700 underline">Imagify</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { obtenerSliderHome, subirImagenSlider, actualizarOrdenSlider, eliminarImagenSlider } from '../firebase/sliderHome';

const imagenes = ref([]);
const cargando = ref(false);
const archivoSeleccionado = ref(null);

onMounted(async () => {
  await cargarImagenes();
});

const cargarImagenes = async () => {
  try {
    imagenes.value = await obtenerSliderHome();
  } catch (error) {
    console.error('Error cargando imágenes:', error);
    alert('Error al cargar las imágenes');
  }
};

const handleFileSelect = (event) => {
  archivoSeleccionado.value = event.target.files[0];
};

const subirImagen = async () => {
  if (!archivoSeleccionado.value) {
    alert('Por favor selecciona una imagen');
    return;
  }

  cargando.value = true;
  try {
    const orden = imagenes.value.length;
    await subirImagenSlider(archivoSeleccionado.value, orden);
    
    archivoSeleccionado.value = null;
    document.querySelector('input[type="file"]').value = '';
    
    await cargarImagenes();
    alert('Imagen subida exitosamente');
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    alert('Error al subir la imagen: ' + error.message);
  } finally {
    cargando.value = false;
  }
};

const moverArriba = async (index) => {
  if (index === 0) return;

  const temp = imagenes.value[index];
  imagenes.value[index] = imagenes.value[index - 1];
  imagenes.value[index - 1] = temp;

  cargando.value = true;
  try {
    await actualizarOrdenSlider(imagenes.value);
  } catch (error) {
    console.error('Error actualizando orden:', error);
    alert('Error al actualizar el orden');
    await cargarImagenes();
  } finally {
    cargando.value = false;
  }
};

const moverAbajo = async (index) => {
  if (index === imagenes.value.length - 1) return;

  const temp = imagenes.value[index];
  imagenes.value[index] = imagenes.value[index + 1];
  imagenes.value[index + 1] = temp;

  cargando.value = true;
  try {
    await actualizarOrdenSlider(imagenes.value);
  } catch (error) {
    console.error('Error actualizando orden:', error);
    alert('Error al actualizar el orden');
    await cargarImagenes();
  } finally {
    cargando.value = false;
  }
};

const eliminarImagen = async (imagenId, nombreArchivo, index) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
    return;
  }

  cargando.value = true;
  try {
    await eliminarImagenSlider(imagenId, nombreArchivo);
    await cargarImagenes();
    alert('Imagen eliminada exitosamente');
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    alert('Error al eliminar la imagen: ' + error.message);
  } finally {
    cargando.value = false;
  }
};
</script>
