<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Gestionar Hero Section</h2>

    <!-- Vista previa del Hero -->
    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
      <h3 class="font-bold text-lg mb-4 text-blue-900">Vista Previa Actual</h3>
      <div class="relative h-64 rounded-lg overflow-hidden">
        <img 
          :src="heroData.imagenFondo || 'https://via.placeholder.com/1920x600'" 
          alt="Fondo Hero"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
          <h1 class="text-3xl font-bold mb-2">{{ heroData.titulo || 'CD VIKINGAS' }}</h1>
          <div class="bg-primary text-black px-4 py-1 rounded-full text-sm font-bold mb-2">
            {{ heroData.badgeCampeonato || 'CAMPEONAS' }}
          </div>
          <p class="text-sm text-center mb-3">{{ heroData.subtitulo || 'Subtítulo del club' }}</p>
          <div class="grid grid-cols-3 gap-2 text-center text-xs">
            <div><span class="text-primary font-bold">{{ heroData.stat1Numero }}</span><br>{{ heroData.stat1Texto }}</div>
            <div><span class="text-primary font-bold">{{ heroData.stat2Numero }}</span><br>{{ heroData.stat2Texto }}</div>
            <div><span class="text-primary font-bold">{{ heroData.stat3Numero }}</span><br>{{ heroData.stat3Texto }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de edición -->
    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary space-y-6">
      <h3 class="font-bold text-lg mb-4">Editar Contenido del Hero</h3>
      
      <!-- Imagen de fondo -->
      <!-- Imagen de fondo -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          📸 Imagen de Fondo
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
        <p class="text-xs text-gray-600 mt-1">Recomendado: 1920x1080px o superior</p>
        <p v-if="heroData.imagenFondo" class="text-xs text-green-600 mt-1">✓ Imagen actual cargada</p>
      </div>

      <!-- Título principal -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          📝 Título Principal
        </label>
        <input 
          v-model="heroData.titulo"
          type="text"
          placeholder="CD VIKINGAS"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <!-- Badge de campeonato -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          🏆 Badge de Campeonato
        </label>
        <input 
          v-model="heroData.badgeCampeonato"
          type="text"
          placeholder="CAMPEONAS COPA ORO AB+"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <!-- Subtítulo -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">
          📄 Subtítulo
        </label>
        <input 
          v-model="heroData.subtitulo"
          type="text"
          placeholder="Fút 7 femenino - Puente alto - desde 2019"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <!-- Estadísticas -->
      <div class="border-t pt-4">
        <h4 class="font-bold text-gray-800 mb-3">📊 Estadísticas</h4>
        
        <div class="grid md:grid-cols-3 gap-4">
          <!-- Stat 1 -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Estadística 1</label>
            <input 
              v-model="heroData.stat1Numero"
              type="text"
              placeholder="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-bold"
            />
            <input 
              v-model="heroData.stat1Texto"
              type="text"
              placeholder="Años de Historia"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <!-- Stat 2 -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Estadística 2</label>
            <input 
              v-model="heroData.stat2Numero"
              type="text"
              placeholder="40+"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-bold"
            />
            <input 
              v-model="heroData.stat2Texto"
              type="text"
              placeholder="Jugadoras"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <!-- Stat 3 -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700">Estadística 3</label>
            <input 
              v-model="heroData.stat3Numero"
              type="text"
              placeholder="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-bold"
            />
            <input 
              v-model="heroData.stat3Texto"
              type="text"
              placeholder="Categorías"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Botón guardar -->
      <button 
        @click="guardarHero"
        :disabled="cargando"
        class="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
      >
        <span v-if="!cargando">💾 Guardar Cambios</span>
        <span v-else>Guardando...</span>
      </button>
    </div>

    <!-- Información útil -->
    <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6">
      <h3 class="font-bold text-lg text-green-900 mb-3">📋 Recomendaciones</h3>
      <ul class="text-sm text-green-800 space-y-2">
        <li>✓ <strong>Imagen de fondo:</strong> 1920x1080px mínimo, formato WebP preferido</li>
        <li>✓ <strong>Título:</strong> Mantenerlo corto y con impacto (máx 20 caracteres)</li>
        <li>✓ <strong>Badge:</strong> Resalta logros actuales del club</li>
        <li>✓ <strong>Estadísticas:</strong> Usa números que impresionen (ej: "5+" en lugar de "5")</li>
        <li>✓ <strong>Actualización:</strong> Los cambios se reflejan inmediatamente en el sitio</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const heroData = ref({
  imagenFondo: '',
  titulo: 'CD VIKINGAS',
  badgeCampeonato: 'CAMPEONAS COPA ORO AB+',
  subtitulo: 'Fút 7 femenino - Puente alto - desde 2019',
  stat1Numero: '6',
  stat1Texto: 'Años de Historia',
  stat2Numero: '40+',
  stat2Texto: 'Jugadoras',
  stat3Numero: '2',
  stat3Texto: 'Categorías'
});

const cargando = ref(false);
const archivoSeleccionado = ref(null);

onMounted(async () => {
  await cargarHeroData();
});

const cargarHeroData = async () => {
  try {
    const docRef = doc(db, 'configuracion', 'heroSection');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      heroData.value = { ...heroData.value, ...docSnap.data() };
    }
  } catch (error) {
    console.error('Error cargando datos del hero:', error);
  }
};

const handleFileSelect = (event) => {
  archivoSeleccionado.value = event.target.files[0];
};

const guardarHero = async () => {
  cargando.value = true;
  try {
    // Si hay una nueva imagen, subirla primero
    if (archivoSeleccionado.value) {
      const timestamp = Date.now();
      const fileName = `hero-${timestamp}-${archivoSeleccionado.value.name}`;
      const imageRef = storageRef(storage, `hero/${fileName}`);
      
      await uploadBytes(imageRef, archivoSeleccionado.value);
      const url = await getDownloadURL(imageRef);
      heroData.value.imagenFondo = url;
      
      archivoSeleccionado.value = null;
      document.querySelector('input[type="file"]').value = '';
    }
    
    // Guardar todos los datos en Firestore
    const docRef = doc(db, 'configuracion', 'heroSection');
    await setDoc(docRef, heroData.value);
    
    alert('✅ Hero actualizado exitosamente');
  } catch (error) {
    console.error('Error guardando hero:', error);
    alert('❌ Error al guardar: ' + error.message);
  } finally {
    cargando.value = false;
  }
};
</script>
