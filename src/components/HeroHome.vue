<template>
  <section class="hero-home relative isolate min-h-screen overflow-hidden text-(--hero-text)">
    <div class="absolute inset-0" aria-hidden="true">
      <div
        class="absolute inset-0 scale-[1.02] bg-cover bg-center opacity-78 saturate-[0.85] brightness-[0.48]"
        :style="{ backgroundImage: `url(${resolvedBackground})`, backgroundPosition: 'center 20%' }"
      ></div>
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.28)_0%,rgba(11,17,18,0.12)_18%,rgba(11,17,18,0.52)_54%,rgba(11,17,18,0.88)_100%),radial-gradient(circle_at_15%_12%,rgba(216,178,85,0.16),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(44,207,191,0.1),transparent_26%)]"></div>
      <div class="absolute -left-10 top-20 h-56 w-56 rounded-full bg-(--hero-gold)/14 blur-3xl"></div>
      <div class="absolute right-0 top-10 h-72 w-72 rounded-full bg-(--hero-primary)/10 blur-3xl"></div>
      <div class="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(180deg,transparent,rgba(11,17,18,0.92))]"></div>
      <div class="absolute -right-20 top-[15%] h-px w-[60vw] rotate-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(216,178,85,0.28),transparent)]"></div>
      <div class="absolute -left-10 top-[58%] h-px w-[40vw] rotate-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(216,178,85,0.12),transparent)]"></div>
      <div class="hero-grain absolute inset-0 z-1"></div>
    </div>

    <div class="relative z-30 px-4 pt-3 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-screen-2xl">
        <Eventos :live-banner-only="true" :compact-banner="true" details-href="#eventos-home" />
      </div>
    </div>

    <div class="relative z-10 mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-screen-2xl flex-col px-4 pb-8 pt-5 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12 lg:pt-7">
      <header class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3 sm:gap-4">
        
          <div class="min-w-0">
            <p class="truncate text-[0.62rem] font-black uppercase tracking-[0.28em] text-(--hero-gold) sm:text-[0.72rem]">Club Deportivo Vikingas</p>
            <p class="mt-1 truncate text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/46 sm:text-[0.7rem]">Puente Alto · Fútbol femenino</p>
          </div>
        </div>

        <div class="hidden items-center gap-3 sm:flex">
          <div class="text-right">
            <p class="text-[0.56rem] font-black uppercase tracking-[0.26em] text-white/36">Est.</p>
            <p class="text-[1.6rem] font-black leading-none text-(--hero-gold)/60" style="font-family: 'Gobold High', sans-serif;">2019</p>
          </div>
        </div>
      </header>

      <div class="flex flex-1 items-center justify-center py-10 lg:py-14">
        <div class="max-w-4xl text-center">
          <div class="hero-reveal inline-flex max-w-full items-center justify-center px-2 text-center text-[0.9rem] font-bold italic tracking-[0.04em] text-white/92 sm:text-[1rem]">
            {{ normalizedHero.badgeCampeonato }}
          </div>

          <h1 class="hero-reveal mt-3 grid gap-2 leading-[0.9]" :aria-label="normalizedHero.titulo">
            <span class="uppercase tracking-[-0.035em] text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.92)]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(3.8rem, 11vw, 7.8rem); text-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
              {{ titlePrefix }}
            </span>
            <span
              class="uppercase tracking-[-0.03em] text-(--hero-text)"
              style="font-family: 'Gobold High', sans-serif; font-size: clamp(5.5rem, 18vw, 12rem); text-shadow: 0 12px 30px rgba(0, 0, 0, 0.14);"
            >
              {{ titleMain }}
            </span>
          </h1>

          <p class="hero-reveal mx-auto mt-6 max-w-2xl text-[clamp(1.04rem,3vw,1.4rem)] font-medium leading-relaxed text-white/88">
            {{ normalizedHero.subtitulo }}
          </p>

          <p class="hero-reveal mx-auto mt-5 max-w-xl text-sm leading-7 text-white/74 lg:text-[1rem]">
            Un espacio para volver a jugar, crecer juntas y construir comunidad desde el fútbol.
          </p>

          <div class="hero-reveal mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <router-link
              to="/historia"
              @click="trackCTAClick('Conocer la historia', 'hero')"
              class="group inline-flex min-h-14 items-center justify-between gap-4 rounded-[1.35rem] border border-white/30 bg-white px-5 py-4 text-left text-[#082022] shadow-[0_18px_34px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_22px_38px_rgba(0,0,0,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--hero-primary-soft)"
            >
              <span>
                <span class="block text-[0.68rem] font-black uppercase tracking-[0.2em] text-(--hero-primary)">Entrar al club</span>
                <span class="mt-1 block text-[0.95rem] font-black uppercase tracking-[0.08em]">Conocer la historia</span>
              </span>
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--hero-primary) text-[#082022] transition-transform duration-200 group-hover:translate-x-1">
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </router-link>
            <router-link
              to="/competencias"
              @click="trackCTAClick('Competencias y resultados', 'hero')"
              class="group inline-flex min-h-14 items-center justify-between gap-4 rounded-[1.35rem] border border-(--hero-primary-soft)/36 bg-[rgba(9,45,47,0.42)] px-5 py-4 text-left text-white shadow-[0_16px_30px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 hover:bg-[rgba(9,45,47,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--hero-primary-soft)"
            >
              <span>
                <span class="block text-[0.68rem] font-black uppercase tracking-[0.2em] text-(--hero-primary-soft)">Seguir la temporada</span>
                <span class="mt-1 block text-[0.95rem] font-black uppercase tracking-[0.08em] text-white">Competencias y resultados</span>
              </span>
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/26 bg-white/14 text-white transition-transform duration-200 group-hover:translate-x-1">
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import Eventos from './Eventos.vue'
import fallbackBackground from '../assets/hero/bghero.PNG'
import logoImage from '../assets/logoVk.png'
import { trackCTAClick } from '../composables/useAnalytics'

const props = defineProps({
  heroData: { type: Object, default: () => ({}) }
})

const normalizedHero = computed(() => ({
  titulo: props.heroData?.titulo || 'CD VIKINGAS',
  badgeCampeonato: props.heroData?.badgeCampeonato || 'Desde 2019 construyendo un espacio para jugar',
  subtitulo:
    props.heroData?.subtitulo ||
    'Un club nacido en Santiago para que más mujeres adultas pudieran volver a encontrarse con el fútbol desde la comunidad, el proceso y la confianza.',
  imagenFondo: props.heroData?.imagenFondo || fallbackBackground,
  temporada: props.heroData?.temporada || '2026'
}))

const resolvedBackground = computed(() => normalizedHero.value.imagenFondo || fallbackBackground)

const titleParts = computed(() => normalizedHero.value.titulo.trim().split(/\s+/).filter(Boolean))

const titlePrefix = computed(() => {
  if (titleParts.value.length <= 1) {
    return 'CD'
  }

  return titleParts.value.slice(0, -1).join(' ')
})

const titleMain = computed(() => titleParts.value[titleParts.value.length - 1] || 'VIKINGAS')
</script>

<style scoped>
.hero-home {
  --hero-primary: #2ccfbf;
  --hero-primary-strong: #25b7aa;
  --hero-primary-soft: #95f0e7;
  --hero-text: #f7fffd;
  --hero-bg: #0d2021;
  background-color: var(--hero-bg);
}

.hero-reveal {
  animation: hero-rise 0.8s ease-out both;
}

.hero-reveal:nth-child(2) {
  animation-delay: 0.08s;
}

.hero-reveal:nth-child(3) {
  animation-delay: 0.16s;
}

.hero-reveal:nth-child(4) {
  animation-delay: 0.24s;
}

.hero-reveal:nth-child(5) {
  animation-delay: 0.32s;
}

@keyframes hero-rise {
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
  .hero-reveal {
    animation: none;
  }
}
</style>
