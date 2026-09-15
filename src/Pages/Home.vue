<template>
    <HeroHome :hero-data="heroData" />

    <div class="bg-[#071112] px-4 pt-6 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-col items-center gap-2.5 rounded-2xl border border-primary/25 bg-[linear-gradient(120deg,rgba(201,168,76,0.14),rgba(7,17,18,0.65)_60%)] px-5 py-3.5 text-center shadow-[0_14px_36px_rgba(0,0,0,0.28)] sm:flex-row sm:justify-center sm:gap-4 sm:text-left">
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-primary">
            <CalendarDaysIcon class="h-3.5 w-3.5" />
            Próximamente
          </span>
          <p class="text-sm font-bold uppercase tracking-wide text-white sm:text-base">
            2da versión <span class="text-secondary">Campeonato Interno VK</span> · Noviembre
          </p>
        </div>
      </div>
    </div>

    <section class="relative overflow-hidden bg-[#071112] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="mx-auto max-w-6xl">
        <div
          class="group relative flex overflow-hidden border-y border-white/10 px-1 py-7 transition-all duration-300 sm:px-3 sm:py-9"
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
                Convocatoria abierta
              </span>
              <h2 class="mt-3 text-[clamp(1.7rem,4vw,2.8rem)] font-black leading-10 uppercase lg:leading-14 text-white" style="font-family: 'Gobold High', sans-serif;">
                Buscamos jugadoras<br>
      <span class="text-secondary">SERIE B Y SERIE C</span>

              </h2>
              <p class="mt-3 max-w-2xl text-sm leading-7 text-white/74 sm:text-[0.98rem]">
                Queremos seguir construyendo equipos con jugadoras que busquen comunidad, compromiso y un proceso deportivo para crecer juntas.
              </p>
            </div>

            <div class="relative flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:min-w-64">
              <router-link
                to="/contacto"
                @click="trackCTAClick('Contactar al club por convocatoria Serie B y Serie C', 'home_convocatoria_contacto')"
                class="inline-flex min-h-14 items-center justify-between gap-4 rounded-xl bg-[linear-gradient(135deg,#f0d481,#c9a84c)] px-5 py-4 text-[#081516] shadow-[0_18px_30px_rgba(201,168,76,0.24)] transition-transform duration-300 hover:-translate-y-1"
              >
                <span>
                  <span class="block text-[0.68rem] font-black uppercase tracking-[0.18em] text-black/70">Primer paso</span>
                  <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Contactar al club</span>
                </span>
                <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
              <router-link
                to="/historia"
                @click="trackCTAClick('Conocer historia de Vikingas', 'home_convocatoria_historia')"
                class="inline-flex min-h-14 items-center justify-between gap-4 rounded-xl bg-white/8 px-5 py-4 text-white transition-transform duration-300 hover:-translate-y-1"
              >
                <span>
                  <span class="block text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/55">Conoce el camino</span>
                  <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Ver nuestra historia</span>
                </span>
                <svg class="h-5 w-5 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

      <div id="eventos-home">
      <Eventos />
    </div>
    <UltimosResultados />


    <section class="relative overflow-hidden bg-[#071112] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div class="mx-auto max-w-6xl border-y border-primary/20 bg-[linear-gradient(135deg,rgba(201,168,76,0.08),rgba(7,17,18,0.5)_36%,rgba(7,17,18,0.2)_100%)]">
        <div class="grid gap-8 px-1 py-8 sm:px-3 sm:py-10 lg:px-8 lg:py-12">
          <div class="flex flex-col md:flex-row items-center md:gap-10 justify-center">
         
            <h2 class="mt-4 text-[clamp(2rem,5vw,3.7rem)] text-center font-black uppercase leading-[0.92] text-white" style="font-family: 'Gobold High', sans-serif;">
              ¿Quieres sumarte a<br>
              <span class="text-primary">Vikingas?</span>
            </h2>
          

            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <router-link
                to="/contacto"
                @click="trackCTAClick('Solicitar invitación a Vikingas', 'home_contacto_postulacion')"
                class="inline-flex min-h-14 items-center justify-between gap-3 rounded-[1.35rem] bg-[linear-gradient(135deg,#f0d481,#c9a84c)] px-5 py-4 text-[#081516] shadow-[0_18px_30px_rgba(201,168,76,0.24)] transition-transform duration-200 hover:-translate-y-1 active:scale-[0.96]"
              >
                <span>
                  <span class="block text-[0.68rem] font-black uppercase tracking-[0.18em] text-black/70">Primer paso</span>
                  <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Escríbenos primero</span>
                </span>
              </router-link>

              <router-link
                to="/equipo"
                @click="trackCTAClick('Ver perfiles del plantel', 'home_perfiles')"
                class="inline-flex min-h-14 items-center justify-between gap-3 rounded-[1.35rem] border border-white/16 bg-white/8 px-5 py-4 text-white backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 active:scale-[0.96]"
              >
                <span>
                  <span class="block text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/54">Conoce el club</span>
                  <span class="mt-1 block text-[0.92rem] font-black uppercase tracking-[0.08em]">Ver perfiles públicos</span>
                </span>
              </router-link>
            </div>
          </div>

        
        </div>
      </div>
    </section>
    
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { authUser } from '../firebase/auth';
import { jugadoraAuthUser } from '../firebase/jugadorasAuth';
import { HeartIcon } from '@heroicons/vue/24/outline';
import { CalendarDaysIcon } from '@heroicons/vue/24/outline';
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

