<template>
    <!-- Hero Section con Imagen de Fondo -->
    <div class="relative w-full h-screen min-h-[600px] overflow-hidden">
      <!-- Imagen de fondo -->
      <div class="absolute inset-0 z-0">
        <img 
          :src="heroData.imagenFondo || 'https://firebasestorage.googleapis.com/v0/b/loginvk-955b2.firebasestorage.app/o/slide2.webp?alt=media&token=88083cd1-4f14-4e7f-9aef-0bb1421f92e0'"
          alt="CD Vikingas"
          class="w-full h-full object-cover"
        />
        <!-- Overlay oscuro para legibilidad -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      <!-- Contenido principal -->
      <div class="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <!-- Logo o escudo (opcional) -->
        <div class="mb-6 animate-fade-in">
          <img 
            src="@/assets/logoVk.png" 
            alt="CD Vikingas Logo"
            class="h-24 md:h-32 w-auto mx-auto drop-shadow-2xl"
          />
        </div>

        <!-- Título principal -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 animate-slide-up" style="font-family: 'Gobold High', sans-serif; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          {{ heroData.titulo }}
        </h1>

        <!-- Badge de campeonato -->
        <div class="mb-6 animate-slide-up" style="animation-delay: 0.2s;">
          <div class="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-bold text-lg md:text-xl shadow-2xl">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <span>{{ heroData.badgeCampeonato }}</span>
          </div>
        </div>

        <!-- Subtítulo -->
        <p class="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl font-bold animate-slide-up" style="animation-delay: 0.3s; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
          {{ heroData.subtitulo }}
        </p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-4 md:gap-8 mb-10 max-w-4xl animate-slide-up" style="animation-delay: 0.4s;">
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/20 transition-all">
            <div class="text-3xl md:text-5xl font-black text-primary mb-2">{{ heroData.stat1Numero }}</div>
            <div class="text-xs md:text-sm text-white/80 font-semibold">{{ heroData.stat1Texto }}</div>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/20 transition-all">
            <div class="text-3xl md:text-5xl font-black text-primary mb-2">{{ heroData.stat2Numero }}</div>
            <div class="text-xs md:text-sm text-white/80 font-semibold">{{ heroData.stat2Texto }}</div>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/20 transition-all">
            <div class="text-3xl md:text-5xl font-black text-primary mb-2">{{ heroData.stat3Numero }}</div>
            <div class="text-xs md:text-sm text-white/80 font-semibold">{{ heroData.stat3Texto }}</div>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 animate-slide-up" style="animation-delay: 0.5s;">
          <router-link
            to="/competencias"
            class="bg-primary hover:bg-primary/90 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            Ver Campeonato
          </router-link>
          <router-link
            to="/historia"
            class="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/50 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
          >
            Conoce el Club
          </router-link>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Banner de Campeonato -->
    <div class="bg-gradient-to-r from-primary via-yellow-400 to-primary py-3 px-4 relative overflow-hidden">
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
            <h2 class="text-2xl md:text-4xl font-black text-black mb-1 uppercase" style="font-family: 'Gobold High', sans-serif;">
              ¡HOY: FECHA 3 DEL CAMPEONATO INTERNO VKS!
            </h2>
            <p class="text-black/90 font-bold text-sm md:text-base mb-2">
              Última jornada de la fase regular • Resultados en vivo y edición en tiempo real
            </p>
            <p class="text-black/70 text-xs md:text-sm font-semibold">
              Sábado 21 de Febrero 2026 | Tricolor La Florida | 3 equipos mixtos
            </p>
          </div>
          
          <!-- Botón de Like y CTA -->
          <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <!-- Botón de Like -->
            <button
              @click="toggleLike"
              :disabled="isLikeLoading"
              class="flex items-center gap-2.5 bg-white/30 backdrop-blur-md hover:bg-white/40 text-black border-2 border-black/30 px-4 py-3 rounded-lg font-black text-sm transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-40 justify-center"
            >
              <HeartIconSolid v-if="hasLiked" class="w-6 h-6 text-red-500 transition-all" />
              <HeartIcon v-else class="w-6 h-6 text-black transition-all" />
              <span>{{ likesCount }}</span>
              <span class="text-xs font-bold opacity-80">likes</span>
            </button>
            
            <!-- CTA Ver Resultados -->
            <router-link
              to="/competencias"
              class="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-primary px-6 py-3 rounded-lg font-black text-sm transition-all transform hover:scale-105 shadow-xl"
            >
              Ver Fecha 3 ahora
              <span aria-hidden="true">→</span>
            </router-link>

        
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
    
    <Eventos />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { HeartIcon } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
import Eventos from '../components/Eventos.vue';

const heroData = ref({
  imagenFondo: 'https://firebasestorage.googleapis.com/v0/b/loginvk-955b2.firebasestorage.app/o/slide2.webp?alt=media&token=88083cd1-4f14-4e7f-9aef-0bb1421f92e0',
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

const likesCount = ref(0);
const hasLiked = ref(false);
const isLikeLoading = ref(false);

// Verificar si el usuario ya dio like (usando localStorage)
const checkIfLiked = () => {
  const liked = localStorage.getItem('campeonato_liked');
  hasLiked.value = liked === 'true';
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
  
  isLikeLoading.value = true;
  
  try {
    const docRef = doc(db, 'configuracion', 'campeonatoLikes');
    
    if (hasLiked.value) {
      // Quitar like
      await updateDoc(docRef, {
        count: increment(-1)
      });
      likesCount.value = Math.max(0, likesCount.value - 1);
      hasLiked.value = false;
      localStorage.removeItem('campeonato_liked');
    } else {
      // Dar like
      await updateDoc(docRef, {
        count: increment(1)
      });
      likesCount.value++;
      hasLiked.value = true;
      localStorage.setItem('campeonato_liked', 'true');
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
  
  // Cargar likes y verificar si el usuario ya dio like
  checkIfLiked();
  await cargarLikes();
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