<template>
    <HeroHome :hero-data="heroData" />

    <section class="relative overflow-hidden bg-[#071112] px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
      <div class="mx-auto max-w-6xl">
        <router-link
          to="/campeonato-vikingas-4ta"
          @click="trackCTAClick('Ver campeonato formativo VK', 'home_campeonato_banner')"
          class="group relative flex overflow-hidden rounded-4xl bg-[#081516] px-5 py-5 shadow-[0_24px_48px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 sm:px-7 sm:py-6"
        >
          <div
            class="absolute inset-0 scale-[1.02] bg-bottom opacity-40 transition-transform duration-500 group-hover:scale-[1.06]"
            :style="{ backgroundImage: `url(${campeonatoBannerImage})`, backgroundPosition: 'center 38%' }"
          ></div>
          <div class="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,17,18,0.86)_0%,rgba(7,17,18,0.72)_42%,rgba(7,17,18,0.88)_100%),radial-gradient(circle_at_16%_18%,rgba(201,168,76,0.34),transparent_28%),radial-gradient(circle_at_84%_76%,rgba(44,207,191,0.14),transparent_22%)]"></div>
          <div class="absolute -left-10 top-8 h-28 w-28 rounded-full bg-[#c9a84c]/18 blur-3xl"></div>

          <div class="relative flex w-full flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div class="min-w-0">
              <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#f2de9b] backdrop-blur-sm">
                Destacado en Vikingas
              </span>
              <h2 class="mt-3 text-[clamp(1.7rem,4vw,2.8rem)] font-black leading-10 uppercase lg:leading-14 text-white" style="font-family: 'Gobold High', sans-serif;">
                4ta versión del<br>
                Campeonato Formativo VK
              </h2>
              <p class="mt-3 max-w-2xl text-sm leading-7 text-white/74 sm:text-[0.98rem]">
                Revisa toda la información del campeonato, conoce el enfoque formativo de esta edición y entra directo a la página especial del evento.
              </p>
            </div>

            <span class="relative inline-flex min-h-14 shrink-0 items-center justify-between gap-4 rounded-[1.25rem] bg-[linear-gradient(135deg,#f0d481,#c9a84c)] px-5 py-4 text-[#081516] shadow-[0_18px_30px_rgba(201,168,76,0.24)] transition-transform duration-300 group-hover:translate-x-1">
              <span>
                <span class="block text-[0.68rem] font-black uppercase tracking-[0.18em] text-black/70">Ir al especial</span>
                <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Ver campeonato VK</span>
              </span>
              <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </router-link>
      </div>
    </section>
    
    <section class="relative bg-[#0b1718] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div class="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <article class="relative overflow-hidden rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-6 shadow-[0_18px_36px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:px-6 sm:py-7">
          <div class="absolute -left-16 top-0 h-32 w-32 rounded-full bg-primary/16 blur-3xl"></div>
          <div class="relative flex h-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl text-center lg:text-left">
              <p class="text-[0.78rem] font-bold italic tracking-[0.04em] text-white/84">
NUEVA TEMPORADA
              </p>
              <h2 class="mt-3 text-[clamp(2rem,5vw,3.6rem)] font-black uppercase xl:leading-15 text-white" style="font-family: 'Gobold High', sans-serif;">
                Liga Dobleve<br>
                Series B y C
              </h2>
              <p class="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-[0.98rem]">
                Seguimos compitiendo con la misma idea de siempre: procesos largos, compañerismo y una identidad que se construye fecha a fecha.
              </p>
            </div>

            <div class="flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col lg:items-end">
              <router-link
                to="/competencias"
                @click="trackCTAClick('Ver temporada', 'home_liga')"
                class="inline-flex min-h-14 items-center justify-between gap-3 rounded-[1.35rem] bg-white px-5 py-4 text-[#082022] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-1"
              >
                <span>
                  <span class="block text-[0.68rem] font-black uppercase tracking-[0.2em] text-primary">Ver temporada</span>
                  <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Resultados y calendario</span>
                </span>
              </router-link>

              <button
                @click="toggleLike"
                :disabled="isLikeLoading"
                class="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-[1.35rem] border border-white/16 bg-white/8 px-5 py-4 text-white backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HeartIconSolid v-if="hasLiked" class="h-5 w-5 text-red-400" />
                <HeartIcon v-else class="h-5 w-5 text-white" />
                <span class="text-[0.82rem] font-black uppercase tracking-[0.12em]">{{ likesCount }} apoyos</span>
              </button>
            </div>
          </div>
        </article>

        <article class="overflow-hidden rounded-4xl border border-primary/18 bg-[linear-gradient(180deg,rgba(44,207,191,0.14),rgba(11,23,24,0.72))] px-5 py-6 shadow-[0_18px_36px_rgba(0,0,0,0.14)] sm:px-6 sm:py-7">
          <p class="text-[0.78rem] font-bold italic tracking-[0.04em] text-white/84">
            Espacio interno del club
          </p>
          <h2 class="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
            Acceso jugadoras
          </h2>
          <p class="mt-4 text-sm leading-7 text-white/74 sm:text-[0.98rem]">
            Revisa entrenamientos, confirma asistencia y mantente conectada con la actividad del plantel.
          </p>
          <router-link
            to="/login-jugadora"
            @click="trackCTAClick('Entrar zona jugadoras', 'home_acceso')"
            class="mt-6 inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-[1.35rem] border border-white/22 bg-white/92 px-5 py-4 text-[#082022] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-1"
          >
            <span>
              <span class="block text-[0.68rem] font-black uppercase tracking-[0.2em] text-primary">Zona privada</span>
              <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Entrar ahora</span>
            </span>
            <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </article>
      </div>

      <router-link
        to="/historia"
        @click="trackCTAClick('Conoce nuestra historia', 'home_banner')"
        class="group mx-auto mt-4 flex max-w-6xl items-center gap-5 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white/8 sm:px-8"
      >
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/14 text-2xl transition-transform duration-300 group-hover:scale-110">⚔️</span>
        <span class="min-w-0 flex-1">
          <span class="block text-[0.68rem] font-black uppercase tracking-[0.22em] text-primary">Desde 2019</span>
          <span class="mt-1 block text-[1.05rem] font-bold text-white sm:text-lg">Conoce nuestra historia</span>
          <span class="mt-1 block text-sm leading-relaxed text-white/60">El camino difícil, el más bonito. Procesos, comunidad y una identidad que se construye fecha a fecha.</span>
        </span>
        <svg class="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </section>
    
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
import HeroHome from '../components/HeroHome.vue';
import UltimosResultados from '../components/UltimosResultados.vue';
import { trackCTAClick, trackSocialInteraction } from '../composables/useAnalytics';
import campeonatoBannerImage from '../assets/2026/grupo.webp';

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
    trackSocialInteraction(hasLiked.value ? 'like' : 'unlike', 'home_campeonato');
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

