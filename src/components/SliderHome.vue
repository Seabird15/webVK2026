<template>
  <div class="relative w-full mx-auto overflow-hidden py-4 md:py-8">
    <!-- Contenedor principal con sombra -->
    <div class="relative w-full mx-auto overflow-hidden rounded-2xl shadow-2xl" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <!-- Loader -->
      <div v-if="cargando" class="absolute inset-0 z-40 flex items-center justify-center bg-black/80 rounded-2xl">
        <div class="animate-pulse">
          <img 
            src="@/assets/logoVk.png" 
            alt="Cargando" 
            class="h-20 w-20 md:h-24 md:w-24 drop-shadow-lg"
          />
        </div>
      </div>

      <!-- Botón izquierda -->
      <button
        v-if="!cargando"
        @click="previousImage"
        class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20  hover:shadow-lg hover:scale-110 text-white font-bold text-lg md:text-2xl px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200"
        aria-label="Imagen anterior"
      >
        &#10094;
      </button>

      <!-- Contenedor de imágenes -->
      <div class="overflow-hidden rounded-2xl h-68 md:h-80 lg:h-184 2xl:h-184 2xl:container 2xl:mx-auto relative bg-black">
        <div
          class="flex transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <img
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            :alt="`Imagen ${index + 1}`"
            class="w-full h-full shrink-0 object-cover"
            style="filter: sepia(0.4)"
          />
        </div>
        
        <!-- Efecto de viñeta mejorado -->
        <div class="absolute inset-0 rounded-2xl pointer-events-none" style="background: radial-gradient(ellipse at center, transparent 25%, rgba(0, 0, 0, 0.5) 100%)"></div>
        
        <!-- Overlay degradado en la parte inferior -->
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

        <!-- Contador de imágenes -->
        <div class="absolute bottom-4 right-4 z-10 bg-primary text-black font-bold px-3 py-1 rounded-full text-sm">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>

      <!-- Botón derecha -->
      <button
        v-if="!cargando"
        @click="nextImage"
        class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20  hover:shadow-lg hover:scale-110 text-white font-bold text-lg md:text-2xl px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200"
        aria-label="Siguiente imagen"
      >
        &#10095;
      </button>
    </div>

    <!-- Indicadores mejorados -->
    <div v-if="!cargando" class="flex justify-center gap-2 md:gap-3 mt-5 md:mt-6 px-4">
      <span
        v-for="(_, index) in images"
        :key="index"
        @click="goToImage(index)"
        class="rounded-full cursor-pointer transition-all duration-300"
        :class="currentIndex === index 
          ? 'bg-primary w-8 md:w-10 h-2 md:h-3 shadow-lg shadow-primary' 
          : 'bg-gray-600 hover:bg-gray-500 w-2 md:w-3 h-2 md:h-3 hover:scale-125'"
        :aria-label="`Ir a imagen ${index + 1}`"
      ></span>
    </div>

    <!-- Indicador de swipe en móvil -->
    <div v-if="!cargando" class="md:hidden text-center mt-4 text-xs text-gray-400">
      👆 Desliza para cambiar
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { obtenerSliderHome } from '../firebase/sliderHome';

const currentIndex = ref(0);
const touchStartX = ref(0);
const images = ref([]);
const cargando = ref(true);

onMounted(async () => {
  try {
    const imagenesCargadas = await obtenerSliderHome();
    images.value = imagenesCargadas.map(img => img.url);
  } catch (error) {
    console.error('Error cargando slider:', error);
    // Imágenes de respaldo por si hay error
    images.value = [
      'https://firebasestorage.googleapis.com/v0/b/loginvk-955b2.firebasestorage.app/o/slide2.webp?alt=media&token=88083cd1-4f14-4e7f-9aef-0bb1421f92e0',
      'https://firebasestorage.googleapis.com/v0/b/loginvk-955b2.firebasestorage.app/o/slide1.webp?alt=media&token=78e2173d-ec32-451c-bf68-49279cc657dc',
      'https://firebasestorage.googleapis.com/v0/b/loginvk-955b2.firebasestorage.app/o/slide3.webp?alt=media&token=248c2a1e-743a-427d-b1cf-e31e8e2d62be'
    ];
  } finally {
    cargando.value = false;
  }
});

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};

const previousImage = () => {
  currentIndex.value =
    currentIndex.value === 0 ? images.value.length - 1 : currentIndex.value - 1;
};

const goToImage = (index) => {
  currentIndex.value = index;
};

// Soporte para gestos táctiles (swipe)
const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].clientX;
};

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const difference = touchStartX.value - touchEndX;
  
  // Si el swipe es mayor a 50px, cambiar imagen
  if (Math.abs(difference) > 50) {
    if (difference > 0) {
      nextImage();
    } else {
      previousImage();
    }
  }
};
</script>
