<template>
  <div class="w-full bg-gray-50 min-h-screen">
    <!-- Secciones de Galerías -->
    <div class="py-12 ">
      <div class=" mx-auto">
        <h1 class="text-4xl font-bold text-black mb-12 text-center">Galería de Fotos</h1>

        <div v-if="galerias.length === 0" class="text-center py-12 text-gray-500">
          No hay galerías disponibles
        </div>

        <div v-for="galeria in galerias" :key="galeria.id" class="mb-16">
          <!-- DISEÑO CARRUSEL MÚLTIPLE (orden === 2) -->
          <div v-if="galeria.orden === 2 && galeria.fotos && galeria.fotos.length > 0" class="mb-16 p-7">
            <!-- Encabezado con barra de color -->
            <div class="flex items-center gap-4 mb-8">
              <h2 class="text-3xl md:text-4xl font-bold text-black ">{{ galeria.titulo }}</h2>
              <div class="flex-1 h-3 bg-primary rounded-full"></div>
            </div>

            <!-- GRID ESTÁTICO (si hay 3 o menos fotos) -->
            <div v-if="galeria.fotos.length <= 3" class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div v-for="foto in galeria.fotos" :key="foto.url" class="relative overflow-hidden rounded-lg shadow-lg bg-black group cursor-pointer">
                <img 
                  :src="foto.url"
                  :alt="galeria.titulo"
                  class="w-full h-80 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <!-- CARRUSEL (si hay más de 3 fotos) -->
            <div v-else class="relative">
              <div class="overflow-hidden">
                <div 
                  class="flex transition-transform duration-300 ease-out"
                  :style="{ transform: `translateX(-${(indiceActual[galeria.id] || 0) * (100 / 3)}%)` }"
                >
                  <div v-for="foto in galeria.fotos" :key="foto.url" class="w-1/3 flex-shrink-0 px-2">
                    <div class="relative overflow-hidden rounded-lg shadow-lg bg-black">
                      <img 
                        :src="foto.url"
                        :alt="galeria.titulo"
                        class="w-full h-64 md:h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones navegación -->
              <button 
                @click="fotoAnterior(galeria.id, galeria.fotos.length)"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-8 bg-black hover:bg-primary text-white rounded-full p-4 md:p-5 transition-all duration-200 z-20 text-xl"
              >
                &#10094;
              </button>
              <button 
                @click="fotoSiguiente(galeria.id, galeria.fotos.length)"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-8 bg-black hover:bg-primary text-white rounded-full p-4 md:p-5 transition-all duration-200 z-20 text-xl"
              >
                &#10095;
              </button>

              <!-- Indicadores (dots) -->
              <div class="flex justify-center gap-2 mt-6">
                <button
                  v-for="(_, idx) in galeria.fotos"
                  :key="idx"
                  @click="indiceActual[galeria.id] = idx"
                  :class="[
                    'h-2 rounded-full transition-all duration-200',
                    idx === (indiceActual[galeria.id] || 0) ? 'bg-primary w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'
                  ]"
                ></button>
              </div>
            </div>

            <p v-if="galeria.descripcion" class="text-gray-600 mt-4">{{ galeria.descripcion }}</p>
          </div>

          <!-- DISEÑO DESTACADO (orden === 1) -->
          <div v-if="galeria.orden === 1 && galeria.fotos && galeria.fotos.length > 0" class="mb-16 bg-black  p-7">
         

            <!-- Layout: Imagen grande + Miniaturas -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <!-- Imagen principal (2/3 en desktop) -->
              <div class="lg:col-span-2">
                <div class="relative overflow-hidden rounded-xl shadow-2xl border-4 border-primary bg-black">
                  <img 
                    :src="galeria.fotos[indiceActual[galeria.id] || 0].url"
                    :alt="galeria.titulo"
                    class="w-full h-96 md:h-[500px] object-cover"
                  />
                  
                  <!-- Botones navegación -->
                  <button 
                    v-if="galeria.fotos.length > 1"
                    @click="fotoAnterior(galeria.id, galeria.fotos.length)"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary text-white rounded-full p-3 transition-all duration-200 z-10"
                  >
                    &#10094;
                  </button>
                  <button 
                    v-if="galeria.fotos.length > 1"
                    @click="fotoSiguiente(galeria.id, galeria.fotos.length)"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-primary text-white rounded-full p-3 transition-all duration-200 z-10"
                  >
                    &#10095;
                  </button>

                  <!-- Indicador de fotos -->
                  <div v-if="galeria.fotos.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <div 
                      v-for="(_, idx) in galeria.fotos" 
                      :key="idx"
                      :class="['h-2 rounded-full transition-all', idx === (indiceActual[galeria.id] || 0) ? 'bg-primary w-6' : 'bg-white/50 w-2']"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Miniaturas verticales (1/3 en desktop) -->
              <div v-if="galeria.fotos.length > 1" class="flex flex-col gap-3 md:gap-4">
                <button 
                  v-for="(foto, idx) in galeria.fotos.slice(0, 3)"
                  :key="idx"
                  @click="indiceActual[galeria.id] = idx"
                  :class="[
                    'relative overflow-hidden rounded-lg border-4 transition-all duration-200 h-24 md:h-32 cursor-pointer',
                    idx === (indiceActual[galeria.id] || 0) ? 'border-primary shadow-lg scale-105' : 'border-gray-300 hover:border-primary/50'
                  ]"
                >
                  <img 
                    :src="foto.url"
                    :alt="`Miniatura ${idx}`"
                    class="w-full h-full object-cover"
                  />
                </button>
                
                <!-- Más fotos indicador -->
                <div v-if="galeria.fotos.length > 3" class="text-center py-3 bg-primary/10 rounded-lg">
                  <p class="text-sm font-bold text-primary">+{{ galeria.fotos.length - 3 }} fotos más</p>
                </div>
              </div>
            </div>
               <!-- Encabezado -->
            <div class="mt-8">
              <h2 class="text-3xl md:text-xl uppercase font-bold text-white mb-2">{{ galeria.titulo }}</h2>
              <div class="h-1 w-32 bg-primary"></div>
              <p v-if="galeria.descripcion" class="text-gray-600 mt-2">{{ galeria.descripcion }}</p>
            </div>
          </div>

          <!-- DISEÑO ORDEN 3 (Imagen sola, sin carrusel) -->
          <div v-if="galeria.orden === 3 && galeria.fotos && galeria.fotos.length > 0" class="mb-16 p-7">
            <!-- Encabezado con barra de color -->
            <div class="flex items-center gap-4 mb-8">
              <h2 class="text-3xl md:text-4xl font-bold text-black whitespace-nowrap">{{ galeria.titulo }}</h2>
              <div class="flex-1 h-3 bg-primary rounded-full"></div>
            </div>

            <!-- Imagen principal única -->
            <div class="relative overflow-hidden rounded-lg shadow-2xl bg-black">
              <img 
                :src="galeria.fotos[0].url"
                :alt="galeria.titulo"
                class="w-full h-96 md:h-[500px] object-cover"
              />
            </div>

            <p v-if="galeria.descripcion" class="text-gray-600 mt-4">{{ galeria.descripcion }}</p>
          </div>

          <!-- DISEÑO ORDEN 4 (Carrusel flexible y moderno) -->
          <div v-if="galeria.orden === 4 && galeria.fotos && galeria.fotos.length > 0" class="mb-16 p-7">
            <!-- Encabezado con barra de color -->
            <div class="flex items-center gap-4 mb-10">
              <h2 class="text-3xl md:text-4xl font-bold text-black whitespace-nowrap">{{ galeria.titulo }}</h2>
              <div class="flex-1 h-3 bg-primary rounded-full"></div>
            </div>

            <!-- GRID ESTÁTICO (si hay 4 o menos fotos) -->
            <div v-if="galeria.fotos.length <= 4" :class="['grid gap-5 md:gap-6', {
              'grid-cols-1': galeria.fotos.length === 1,
              'grid-cols-1 md:grid-cols-2': galeria.fotos.length === 2,
              'grid-cols-1 md:grid-cols-3': galeria.fotos.length === 3,
              'grid-cols-2 md:grid-cols-4': galeria.fotos.length === 4
            }]">
              <div v-for="foto in galeria.fotos" :key="foto.url" class="relative overflow-hidden rounded-2xl shadow-xl bg-black group cursor-pointer">
                <img 
                  :src="foto.url"
                  :alt="galeria.titulo"
                  class="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            <!-- CARRUSEL DINÁMICO (si hay más de 4 fotos) -->
            <div v-else>
              <!-- Contenedor principal -->
              <div class="relative group">
                <!-- Carrusel con scroll suave -->
                <div class="relative overflow-hidden rounded-2xl shadow-2xl bg-black">
                  <div 
                    class="flex transition-transform duration-700 ease-out"
                    :style="{ transform: `translateX(-${(indiceActual[galeria.id] || 0) * (100 / obtenerColumnasCarrusel(galeria.fotos.length))}%)` }"
                  >
                    <div v-for="foto in galeria.fotos" :key="foto.url" :class="['shrink-0', {
                      'w-1/2': obtenerColumnasCarrusel() === 2,
                      'w-1/3': obtenerColumnasCarrusel() === 3,
                      'w-1/4': obtenerColumnasCarrusel() === 4
                    }]">
                      <img 
                        :src="foto.url"
                        :alt="galeria.titulo"
                        class="w-full h-80 md:h-96 object-cover"
                      />
                    </div>
                  </div>

                  <!-- Overlay gradiente -->
                  <div class="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>

                  <!-- Botones navegación premium -->
                  <button 
                    @click="fotoAnterior(galeria.id, galeria.fotos.length)"
                    class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary text-black hover:text-white rounded-full p-3 md:p-4 transition-all duration-200 z-20 shadow-xl hover:shadow-2xl opacity-0 group-hover:opacity-100 transform hover:scale-125"
                  >
                    <span class="text-2xl md:text-3xl font-bold">‹</span>
                  </button>
                  <button 
                    @click="fotoSiguiente(galeria.id, galeria.fotos.length)"
                    class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary text-black hover:text-white rounded-full p-3 md:p-4 transition-all duration-200 z-20 shadow-xl hover:shadow-2xl opacity-0 group-hover:opacity-100 transform hover:scale-125"
                  >
                    <span class="text-2xl md:text-3xl font-bold">›</span>
                  </button>

                  <!-- Contador elegante -->
                  <div class="absolute bottom-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                    {{ (indiceActual[galeria.id] || 0) + 1 }} / {{ galeria.fotos.length }}
                  </div>
                </div>

                <!-- Indicadores dinámicos -->
                <div class="flex justify-center gap-2 mt-8 px-4">
                  <button
                    v-for="(_, idx) in galeria.fotos"
                    :key="idx"
                    @click="indiceActual[galeria.id] = idx"
                    :class="[
                      'transition-all duration-300 rounded-full',
                      idx === (indiceActual[galeria.id] || 0) 
                        ? 'bg-primary w-10 h-3 shadow-lg' 
                        : 'bg-gray-400 w-2 h-2 hover:bg-gray-500'
                    ]"
                    :title="`Foto ${idx + 1}`"
                  ></button>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <p v-if="galeria.descripcion" class="text-gray-600 mt-6 text-center md:text-left">{{ galeria.descripcion }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { obtenerGalerias } from '../firebase/galerias';
import { useLoader } from '../composables/useLoader.js';

const { show, hide } = useLoader();
const galerias = ref([]);
const indiceActual = ref({});

const cargarGalerias = async () => {
  try {
    show('Cargando galerías...');
    galerias.value = await obtenerGalerias();
    // Inicializar índices
    galerias.value.forEach(g => {
      indiceActual.value[g.id] = 0;
    });
  } catch (error) {
    console.error('Error al cargar galerías:', error);
  } finally {
    hide();
  }
};

const fotoSiguiente = (galeriaId, total) => {
  const actual = indiceActual.value[galeriaId] || 0;
  indiceActual.value[galeriaId] = (actual + 1) % total;
};

const fotoAnterior = (galeriaId, total) => {
  const actual = indiceActual.value[galeriaId] || 0;
  indiceActual.value[galeriaId] = (actual - 1 + total) % total;
};

// Determinar cuántas columnas mostrar en el carrusel según pantalla y total de fotos
const obtenerColumnasCarrusel = (totalFotos) => {
  if (typeof window === 'undefined') return Math.min(3, totalFotos);
  const width = window.innerWidth;
  let columnasSegunPantalla;
  
  if (width < 768) columnasSegunPantalla = 2; // mobile: máximo 2 fotos
  else if (width < 1024) columnasSegunPantalla = 3; // tablet: máximo 3 fotos
  else columnasSegunPantalla = 4; // desktop: máximo 4 fotos
  
  // Retornar el MÍNIMO entre lo que cabe en pantalla y lo que realmente existe
  return Math.min(columnasSegunPantalla, totalFotos);
};

onMounted(() => {
  cargarGalerias();
});
</script>
