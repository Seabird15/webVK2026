<template>
    <!-- Hero Section con Imagen de Fondo -->
    <div class="relative w-full overflow-hidden">
      <!-- Imagen de fondo -->
      <div class="absolute inset-0 z-0">
        <img 
src="../assets/hero/bghero.PNG"
          alt="CD Vikingas"
          class="w-full h-full object-cover"
        />
        <!-- Overlay oscuro para legibilidad -->
        <div class="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80"></div>
        <div class="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/60 to-transparent"></div>
      </div>

      <div class="absolute top-3 left-0 right-0 z-20 px-4 sm:top-4 sm:px-6 lg:px-8">
        <Eventos :live-banner-only="true" :compact-banner="true" details-href="#eventos-home" />
      </div>

      <!-- Contenido principal -->
      <div class="relative z-10 flex items-center px-4 py-28 sm:px-6 sm:py-32 lg:px-8" style="min-height: max(100svh, 54rem);">
        <div class="w-full max-w-6xl mx-auto">
          <div class="mx-auto flex max-w-5xl flex-col items-center rounded-4xl border border-white/15 bg-white/8 px-5 py-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xs sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
            <!-- Logo o escudo -->
            <div class="mb-5 animate-fade-in sm:mb-6">
              <img 
                src="@/assets/logoVk.png" 
                alt="CD Vikingas Logo"
                class="h-18 w-auto mx-auto drop-shadow-2xl sm:h-22 md:h-28 lg:h-32"
              />
            </div>

            <!-- Badge de campeonato -->
            <div class="mb-5 animate-slide-up" style="animation-delay: 0.15s;">
              <div class="inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black shadow-2xl sm:px-6 sm:py-3 sm:text-sm md:text-base">
                <svg class="h-5 w-5 shrink-0 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span>{{ heroData.badgeCampeonato }}</span>
              </div>
            </div>

            <!-- Título principal -->
            <h1 class="mb-4 max-w-4xl text-4xl font-black leading-none text-white animate-slide-up sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl" style="font-family: 'Gobold High', sans-serif; text-shadow: 0 4px 20px rgba(0,0,0,0.5); animation-delay: 0.25s;">
              {{ heroData.titulo }}
            </h1>

            <!-- Subtítulo -->
            <p class="mb-8 max-w-3xl text-base font-bold leading-relaxed text-white/90 animate-slide-up sm:text-lg md:mb-10 md:text-xl lg:text-2xl" style="animation-delay: 0.35s; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
              {{ heroData.subtitulo }}
            </p>

            <!-- Stats Grid -->
            <div class="mb-8 grid w-full max-w-4xl grid-cols-1 gap-3 animate-slide-up sm:grid-cols-3 sm:gap-4 md:mb-10 md:gap-5" style="animation-delay: 0.45s;">
              <div class="rounded-2xl border border-white/20 bg-black/25 px-4 py-4 backdrop-blur-md transition-all hover:bg-black/35 sm:px-3 sm:py-5 md:px-5 md:py-6">
                <div class="mb-1 text-3xl font-black text-primary sm:text-4xl md:text-5xl">{{ heroData.stat1Numero }}</div>
                <div class="text-sm font-semibold text-white/80 md:text-base">{{ heroData.stat1Texto }}</div>
              </div>
              <div class="rounded-2xl border border-white/20 bg-black/25 px-4 py-4 backdrop-blur-md transition-all hover:bg-black/35 sm:px-3 sm:py-5 md:px-5 md:py-6">
                <div class="mb-1 text-3xl font-black text-primary sm:text-4xl md:text-5xl">{{ heroData.stat2Numero }}</div>
                <div class="text-sm font-semibold text-white/80 md:text-base">{{ heroData.stat2Texto }}</div>
              </div>
              <div class="rounded-2xl border border-white/20 bg-black/25 px-4 py-4 backdrop-blur-md transition-all hover:bg-black/35 sm:px-3 sm:py-5 md:px-5 md:py-6">
                <div class="mb-1 text-3xl font-black text-primary sm:text-4xl md:text-5xl">{{ heroData.stat3Numero }}</div>
                <div class="text-sm font-semibold text-white/80 md:text-base">{{ heroData.stat3Texto }}</div>
              </div>
            </div>

            <!-- CTAs -->
            <div class="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-3 animate-slide-up sm:flex-row sm:flex-wrap sm:gap-4" style="animation-delay: 0.55s;">
              <router-link
                to="/competencias"
                class="flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 text-base font-black text-black shadow-2xl transition-all hover:scale-105 hover:bg-primary/90 sm:w-auto sm:min-w-64 sm:px-8 sm:text-lg"
              >
                Acompaña la temporada
              </router-link>
              <router-link
                to="/historia"
                class="flex w-full items-center justify-center rounded-xl border-2 border-white/50 bg-white/15 px-6 py-4 text-base font-black text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-white/25 sm:w-auto sm:min-w-64 sm:px-8 sm:text-lg"
              >
                Conoce a Vikingas
              </router-link>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Banner de noticias -->
    <div class="bg-linear-to-r from-primary via-yellow-400 to-primary py-3 px-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnptMC0zNGMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyem0wIDY4YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <!-- Icono de trofeo -->
          <div class="shrink-0">
            <svg class="w-14 h-14 md:w-20 md:h-20 text-black animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          
          <!-- Contenido principal -->
          <div class="text-center md:text-left">
            <div class="inline-flex items-center gap-2 bg-black/20 text-black px-3 py-1 rounded-full text-[11px] md:text-xs font-black tracking-wider uppercase mb-2">
              <span class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              COMIENZA LA TEMPORADA 2026
            </div>
            <h2 class="text-3xl md:text-4xl font-black tracking-widest text-black mb-1 uppercase" style="font-family: 'Gobold High', sans-serif;">
              LIGA DOBLEVE SERIES B Y C
            </h2>
            <p class="text-black/90 font-bold text-sm md:text-base mb-2">
              Primer semestre en marcha. Vamos VKS.
            </p>
          </div>
          
          <!-- Botón de Like y CTA -->
          <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <router-link
              to="/competencias"
              class="flex items-center gap-2.5 bg-black text-primary hover:bg-black/90 px-5 py-3 rounded-lg font-black text-sm transition-all transform hover:scale-105 shadow-xl min-w-48 justify-center"
            >
              Ver resultados
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>

            <!-- Botón de Like -->
            <button
              @click="toggleLike"
              :disabled="isLikeLoading"
              class="flex items-center gap-2.5 bg-white/30 backdrop-blur-md hover:bg-white/40 text-black border-2 border-black/30 px-4 py-3 rounded-lg font-black text-sm transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-40 justify-center"
            >
              <HeartIconSolid v-if="hasLiked" class="w-6 h-6 text-red-500 transition-all" />
              <HeartIcon v-else class="w-6 h-6 text-black transition-all" />
              <span>{{ likesCount }}</span>
              <span class="text-xs font-bold opacity-80 my-auto">likes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Botón de acceso para jugadoras -->
    <div class="bg-linear-to-r from-black via-primary to-black  py-8 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-xl font-bold text-white mb-4">
          ¿Eres jugadora del club?
        </h2>
        <p class="text-white/90 mb-6 text-md">
          Accede a tu perfil, revisa entrenamientos y confirma tu asistencia 
        </p>
        <router-link
          to="/login-jugadora"
          class="inline-block bg-white text-primary-dark px-8 py-4 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
        >
          Acceso Jugadoras 
        </router-link>
      </div>
    </div>
    
    <div id="eventos-home">
      <Eventos />
    </div>
    <UltimosResultados />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { authUser } from '../firebase/auth';
import { jugadoraAuthUser } from '../firebase/jugadorasAuth';
import { HeartIcon } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
import Eventos from '../components/Eventos.vue';
import UltimosResultados from '../components/UltimosResultados.vue';

const heroData = ref({
  imagenFondo: 'https://firebasestorage.googleapis.com/v0/b/loginvk-955b2.firebasestorage.app/o/slide2.webp?alt=media&token=88083cd1-4f14-4e7f-9aef-0bb1421f92e0',
  titulo: 'CD VIKINGAS',
  badgeCampeonato: 'JUNTAS, SOMOS ETERNAS',
  subtitulo: 'Fút 7 femenino - Puente alto - desde 2019',
  stat1Numero: '6',
  stat1Texto: 'Años de Historia',
  stat2Numero: '50+',
  stat2Texto: 'Jugadoras',
  stat3Numero: '3',
  stat3Texto: 'Categorías'
});

const likesCount = ref(0);
const hasLiked = ref(false);
const isLikeLoading = ref(false);

const obtenerUidActivo = () => authUser.value?.uid || jugadoraAuthUser.value?.uid || null;

const cargarReaccionUsuario = async () => {
  const uid = obtenerUidActivo();
  if (!uid) {
    hasLiked.value = false;
    return;
  }

  const reaccionRef = doc(db, 'configuracion', 'campeonatoLikes', 'reacciones', uid);
  const reaccionSnap = await getDoc(reaccionRef);
  hasLiked.value = reaccionSnap.exists() && reaccionSnap.data()?.activo === true;
};

// Cargar contador de likes desde Firebase
const cargarLikes = async () => {
  try {
    const docRef = doc(db, 'configuracion', 'campeonatoLikes');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      likesCount.value = docSnap.data().count || 0;
    } else {
      // Crear documento si no existe
      await setDoc(docRef, { count: 0 });
      likesCount.value = 0;
    }
  } catch (error) {
    // // console.error('Error cargando likes:', error);
  }
};

// Toggle like
const toggleLike = async () => {
  if (isLikeLoading.value) return;

  const uid = obtenerUidActivo();
  if (!uid) return;
  
  isLikeLoading.value = true;
  
  try {
    const docRef = doc(db, 'configuracion', 'campeonatoLikes');
    const reaccionRef = doc(db, 'configuracion', 'campeonatoLikes', 'reacciones', uid);
    
    if (hasLiked.value) {
      // Quitar like
      await updateDoc(docRef, {
        count: increment(-1)
      });
      await setDoc(reaccionRef, {
        activo: false,
        updatedAt: new Date()
      }, { merge: true });
      likesCount.value = Math.max(0, likesCount.value - 1);
      hasLiked.value = false;
    } else {
      // Dar like
      await updateDoc(docRef, {
        count: increment(1)
      });
      await setDoc(reaccionRef, {
        activo: true,
        updatedAt: new Date()
      }, { merge: true });
      likesCount.value++;
      hasLiked.value = true;
    }
  } catch (error) {
    // // console.error('Error actualizando like:', error);
  } finally {
    isLikeLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const docRef = doc(db, 'configuracion', 'heroSection');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      heroData.value = { ...heroData.value, ...docSnap.data() };
    }
  } catch (error) {
    // // console.error('Error cargando datos del hero:', error);
  }
  
  // Cargar likes y estado de reacción del usuario
  await cargarLikes();
  await cargarReaccionUsuario();
});

</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
  opacity: 0;
}
</style>