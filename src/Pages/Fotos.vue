<template>
  <section class="fotos-page overflow-hidden bg-(--ft-bg) text-(--ft-text) min-h-screen">

    <!-- Hero -->
    <div class="relative isolate">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.18)_0%,rgba(11,17,18,0.78)_55%,rgba(11,17,18,0.98)_100%)]"></div>
        <div class="absolute left-[-6%] top-16 h-56 w-56 rounded-full bg-(--ft-primary)/14 blur-3xl"></div>
        <div class="absolute right-[-8%] top-0 h-64 w-64 rounded-full bg-(--ft-accent)/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pb-12 lg:pt-18">
        <p class="ft-fade text-sm font-semibold italic text-white/70 sm:text-base">
          Momentos que cuentan la historia
        </p>
        <h1 class="ft-fade mt-4 uppercase leading-[0.88]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(3.5rem, 12vw, 7.5rem);">
          <span class="block text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.85)]">Nuestra</span>
          <span class="block text-white">Galería</span>
        </h1>
        <p class="ft-fade mt-6 max-w-2xl text-[clamp(1rem,2.6vw,1.28rem)] leading-relaxed text-white/80">
          Cada foto es un pedazo de lo que somos. Entrenamientos, partidos, abrazos y cancha compartida. Acá se ve lo que no cabe en un resultado.
        </p>
      </div>
    </div>

    <!-- Galerías -->
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

      <div v-if="galerias.length === 0" class="ft-fade text-center py-16">
        <p class="text-white/50 font-semibold">No hay galerías disponibles</p>
      </div>

      <div v-for="galeria in galerias" :key="galeria.id" class="mb-14">

        <!-- DISEÑO CARRUSEL MÚLTIPLE (orden === 2) -->
        <div v-if="galeria.orden === 2 && galeria.fotos && galeria.fotos.length > 0" class="ft-fade">
          <div class="flex items-center gap-4 mb-8">
            <h2 class="text-[clamp(1.6rem,4vw,2.4rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">{{ galeria.titulo }}</h2>
            <div class="flex-1 h-[3px] bg-(--ft-primary)/40 rounded-full"></div>
          </div>

          <!-- GRID ESTÁTICO (3 o menos fotos) -->
          <div v-if="galeria.fotos.length <= 3" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="foto in galeria.fotos" :key="foto.url" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img :src="foto.url" :alt="galeria.titulo" class="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
          </div>

          <!-- CARRUSEL (más de 3 fotos) -->
          <div v-else class="relative group">
            <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${(indiceActual[galeria.id] || 0) * (100 / 3)}%)` }">
                <div v-for="foto in galeria.fotos" :key="foto.url" class="w-1/3 shrink-0 px-1.5">
                  <img :src="foto.url" :alt="galeria.titulo" class="w-full h-80 md:h-[500px] lg:h-[600px] object-cover rounded-2xl" />
                </div>
              </div>

              <button v-if="(indiceActual[galeria.id] || 0) > 0" @click="fotoAnteriorOrden2(galeria.id, galeria.fotos.length)" class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-all hover:bg-(--ft-primary) hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer md:h-12 md:w-12">
                <span class="text-2xl font-bold">‹</span>
              </button>
              <button v-if="(indiceActual[galeria.id] || 0) < galeria.fotos.length - 3" @click="fotoSiguienteOrden2(galeria.id, galeria.fotos.length)" class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-all hover:bg-(--ft-primary) hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer md:h-12 md:w-12">
                <span class="text-2xl font-bold">›</span>
              </button>

              <div class="absolute bottom-4 right-4 rounded-full bg-(--ft-primary) px-4 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#082022] shadow-lg">
                {{ (indiceActual[galeria.id] || 0) + 1 }} / {{ galeria.fotos.length }}
              </div>
            </div>

            <div class="flex justify-center gap-2 mt-5">
              <button v-for="(_, idx) in galeria.fotos" :key="idx" @click="indiceActual[galeria.id] = idx" :class="['transition-all duration-300 rounded-full cursor-pointer', idx === (indiceActual[galeria.id] || 0) ? 'bg-(--ft-primary) w-8 h-2.5' : 'bg-white/20 w-2 h-2 hover:bg-white/40']" :title="`Foto ${idx + 1}`"></button>
            </div>
          </div>

          <p v-if="galeria.descripcion" class="mt-4 text-sm leading-relaxed text-white/60">{{ galeria.descripcion }}</p>
        </div>

        <!-- DISEÑO DESTACADO (orden === 1) -->
        <div v-if="galeria.orden === 1 && galeria.fotos && galeria.fotos.length > 0" class="ft-fade">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Imagen principal -->
            <div class="lg:col-span-2">
              <div class="relative overflow-hidden rounded-3xl border-2 border-(--ft-primary)/30 bg-white/5">
                <img :src="galeria.fotos[indiceActual[galeria.id] || 0].url" :alt="galeria.titulo" class="w-full h-96 md:h-[500px] object-cover" />

                <button v-if="galeria.fotos.length > 1" @click="fotoAnterior(galeria.id, galeria.fotos.length)" class="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-all hover:bg-(--ft-primary) cursor-pointer">&#10094;</button>
                <button v-if="galeria.fotos.length > 1" @click="fotoSiguiente(galeria.id, galeria.fotos.length)" class="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-all hover:bg-(--ft-primary) cursor-pointer">&#10095;</button>

                <div v-if="galeria.fotos.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <div v-for="(_, idx) in galeria.fotos" :key="idx" :class="['h-2 rounded-full transition-all', idx === (indiceActual[galeria.id] || 0) ? 'bg-(--ft-primary) w-6' : 'bg-white/40 w-2']"></div>
                </div>
              </div>
            </div>

            <!-- Miniaturas -->
            <div v-if="galeria.fotos.length > 1" class="grid grid-cols-2 gap-3">
              <button v-for="(foto, idx) in galeria.fotos.slice(0, 4)" :key="idx" @click="indiceActual[galeria.id] = idx" :class="['relative overflow-hidden rounded-2xl border-2 transition-all duration-200 h-32 md:h-40 lg:h-48 cursor-pointer', idx === (indiceActual[galeria.id] || 0) ? 'border-(--ft-primary) shadow-lg scale-105' : 'border-white/10 hover:border-(--ft-primary)/40']">
                <img :src="foto.url" :alt="`Miniatura ${idx}`" class="w-full h-full object-cover" />
              </button>
              <div v-if="galeria.fotos.length > 3" class="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <p class="text-sm font-black uppercase tracking-wide text-(--ft-primary)">+{{ galeria.fotos.length - 3 }} más</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h2 class="text-[clamp(1.4rem,3vw,1.8rem)] font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">{{ galeria.titulo }}</h2>
            <div class="mt-2 h-[3px] w-28 rounded-full bg-(--ft-primary)"></div>
            <p v-if="galeria.descripcion" class="mt-3 text-sm leading-relaxed text-white/60">{{ galeria.descripcion }}</p>
          </div>
        </div>

        <!-- DISEÑO ORDEN 3 (Imagen sola) -->
        <div v-if="galeria.orden === 3 && galeria.fotos && galeria.fotos.length > 0" class="ft-fade">
          <div class="flex items-center gap-4 mb-8">
            <h2 class="text-[clamp(1.6rem,4vw,2.4rem)] font-black uppercase leading-[0.95] text-white whitespace-nowrap" style="font-family: 'Gobold High', sans-serif;">{{ galeria.titulo }}</h2>
            <div class="flex-1 h-[3px] bg-(--ft-primary)/40 rounded-full"></div>
          </div>

          <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_22px_56px_rgba(0,0,0,0.18)]">
            <img :src="galeria.fotos[0].url" :alt="galeria.titulo" class="w-full h-96 md:h-[500px] object-cover" />
          </div>
          <p v-if="galeria.descripcion" class="mt-4 text-sm leading-relaxed text-white/60">{{ galeria.descripcion }}</p>
        </div>

        <!-- DISEÑO ORDEN 4 (Carrusel flexible) -->
        <div v-if="galeria.orden === 4 && galeria.fotos && galeria.fotos.length > 0" class="ft-fade">
          <div class="flex items-center gap-4 mb-10">
            <h2 class="text-[clamp(1.6rem,4vw,2.4rem)] font-black uppercase leading-[0.95] text-white whitespace-nowrap" style="font-family: 'Gobold High', sans-serif;">{{ galeria.titulo }}</h2>
            <div class="flex-1 h-[3px] bg-(--ft-primary)/40 rounded-full"></div>
          </div>

          <!-- GRID ESTÁTICO (4 o menos) -->
          <div v-if="galeria.fotos.length <= 4" :class="['grid gap-4', {
            'grid-cols-1': galeria.fotos.length === 1,
            'grid-cols-1 md:grid-cols-2': galeria.fotos.length === 2,
            'grid-cols-1 md:grid-cols-3': galeria.fotos.length === 3,
            'grid-cols-2 md:grid-cols-4': galeria.fotos.length === 4
          }]">
            <div v-for="foto in galeria.fotos" :key="foto.url" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img :src="foto.url" :alt="galeria.titulo" class="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <div class="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,17,18,0.5),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <!-- CARRUSEL DINÁMICO (más de 4) -->
          <div v-else class="relative group">
            <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div class="flex transition-transform duration-700 ease-out" :style="{ transform: `translateX(-${(indiceActual[galeria.id] || 0) * (100 / obtenerColumnasCarrusel(galeria.fotos.length))}%)` }">
                <div v-for="foto in galeria.fotos" :key="foto.url" :class="['shrink-0', {
                  'w-1/2': obtenerColumnasCarrusel() === 2,
                  'w-1/3': obtenerColumnasCarrusel() === 3,
                  'w-1/4': obtenerColumnasCarrusel() === 4
                }]">
                  <img :src="foto.url" :alt="galeria.titulo" class="w-full h-80 md:h-96 object-cover" />
                </div>
              </div>

              <button @click="fotoAnterior(galeria.id, galeria.fotos.length)" class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-all hover:bg-(--ft-primary) hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer md:h-12 md:w-12">
                <span class="text-2xl font-bold">‹</span>
              </button>
              <button @click="fotoSiguiente(galeria.id, galeria.fotos.length)" class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-all hover:bg-(--ft-primary) hover:text-white hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer md:h-12 md:w-12">
                <span class="text-2xl font-bold">›</span>
              </button>

              <div class="absolute bottom-4 right-4 rounded-full bg-(--ft-primary) px-4 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#082022] shadow-lg">
                {{ (indiceActual[galeria.id] || 0) + 1 }} / {{ galeria.fotos.length }}
              </div>
            </div>

            <div class="flex justify-center gap-2 mt-6">
              <button v-for="(_, idx) in galeria.fotos" :key="idx" @click="indiceActual[galeria.id] = idx" :class="['transition-all duration-300 rounded-full cursor-pointer', idx === (indiceActual[galeria.id] || 0) ? 'bg-(--ft-primary) w-10 h-2.5' : 'bg-white/20 w-2 h-2 hover:bg-white/40']" :title="`Foto ${idx + 1}`"></button>
            </div>
          </div>

          <p v-if="galeria.descripcion" class="mt-5 text-sm leading-relaxed text-white/60 text-center md:text-left">{{ galeria.descripcion }}</p>
        </div>
      </div>
    </div>

    <!-- Frase cierre -->
    <div class="ft-fade mx-auto max-w-7xl border-t border-white/10 px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
      <p class="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3.6rem)] font-black italic leading-tight text-white" style="font-family: 'Gobold High', sans-serif;">
        Cada foto es un recuerdo de cancha, de grupo, de un club que se vive de verdad.
      </p>
    </div>
  </section>
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
    // // console.error('Error al cargar galerías:', error);
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

// Navegación para carrusel orden 2 (muestra 3 fotos a la vez)
const fotoSiguienteOrden2 = (galeriaId, total) => {
  const actual = indiceActual.value[galeriaId] || 0;
  const maxIndice = Math.max(0, total - 3);
  indiceActual.value[galeriaId] = Math.min(actual + 1, maxIndice);
};

const fotoAnteriorOrden2 = (galeriaId, total) => {
  const actual = indiceActual.value[galeriaId] || 0;
  indiceActual.value[galeriaId] = Math.max(actual - 1, 0);
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

<style scoped>
.fotos-page {
  --ft-bg: #0b1112;
  --ft-primary: #2ccfbf;
  --ft-accent: #d8b255;
  --ft-text: #f7fffd;
}

.ft-fade {
  animation: ft-rise 0.8s ease-out both;
}

@keyframes ft-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ft-fade {
    animation: none;
  }
}
</style>
