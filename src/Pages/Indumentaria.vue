<template>
  <section class="indumentaria-page overflow-hidden bg-(--indu-bg) text-(--indu-text)">

    <!-- Hero -->
    <div class="relative isolate overflow-hidden">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.18)_0%,rgba(11,17,18,0.78)_55%,rgba(11,17,18,0.98)_100%)]"></div>
        <div class="absolute left-[-18%] top-16 h-44 w-44 rounded-full bg-(--indu-primary)/14 blur-3xl sm:left-[-10%] sm:h-52 sm:w-52 lg:left-[-6%] lg:h-56 lg:w-56"></div>
        <div class="absolute right-[-14%] top-0 h-48 w-48 rounded-full bg-(--indu-accent)/10 blur-3xl sm:right-[-10%] sm:h-56 sm:w-56 lg:right-[-8%] lg:h-64 lg:w-64"></div>
      </div>

      <div class="mx-auto grid min-h-100 max-w-7xl items-end gap-8 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.9fr)] lg:px-8 lg:pb-16 lg:pt-18">
        <div class="relative z-10 min-w-0 max-w-2xl">
          <p class="indu-fade text-sm font-semibold italic text-white/70 sm:text-base">
            {{ pageContent.hero.kicker }}
          </p>
          <h1 class="indu-fade mt-4 max-w-[8.5ch] text-balance uppercase leading-[0.92] sm:leading-[0.9] lg:leading-[0.88]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(1.95rem, 6.4vw, 4.9rem);">
            <span class="block text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.85)]">{{ pageContent.hero.titleStroke }}</span>
            <span class="block text-white">{{ pageContent.hero.titleFill }}</span>
          </h1>
          <p class="indu-fade mt-6 max-w-xl text-[clamp(1rem,2.6vw,1.28rem)] leading-relaxed text-white/80">
            {{ pageContent.hero.description }}
          </p>
        </div>

        <div class="indu-fade relative z-10 min-w-0 lg:justify-self-end">
          <div class="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/6 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm">
            <img
              :src="pageContent.hero.image"
              :alt="pageContent.hero.imageAlt"
              class="h-80 w-full rounded-[1.7rem] object-cover sm:h-96 lg:w-md"
            >
            <div class="absolute inset-x-6 bottom-6 rounded-[1.6rem] bg-[rgba(10,17,18,0.74)] px-5 py-4 backdrop-blur-sm">
              <p class="text-[0.72rem] font-black uppercase tracking-[0.2em] text-(--indu-primary)">{{ pageContent.hero.badge }}</p>
              <p class="mt-2 text-sm leading-6 text-white/80 sm:text-base">
                {{ pageContent.hero.caption }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Identidad -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="indu-paper indu-fade rounded-4xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--indu-primary)">{{ pageContent.identity.kicker }}</p>
            <h2 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-15 text-(--indu-ink)" style="font-family: 'Gobold High', sans-serif;">
              {{ pageContent.identity.title }}
            </h2>
          </div>

          <div class="space-y-4 my-auto text-[1rem] leading-8 text-(--indu-muted) sm:text-[1.05rem]">
            <p v-for="paragraph in pageContent.identity.paragraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>

      <!-- Prendas destacadas -->
      <div class="mt-10 flex flex-col items-start gap-4 lg:mt-14 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--indu-primary)">{{ pageContent.catalog.kicker }}</p>
          <h2 class="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
            {{ pageContent.catalog.title }}
          </h2>
        </div>
        <p class="hidden max-w-sm text-right text-sm leading-6 text-white/55 lg:block">
          {{ pageContent.catalog.description }}
        </p>
      </div>
      <p class="mt-4 max-w-2xl text-[1rem] leading-7 text-white/68 lg:hidden">
        {{ pageContent.catalog.description }}
      </p>
      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        <article
          v-for="item in prendas"
          :key="item.nombre"
          class="indu-fade group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-(--indu-primary)/30 hover:bg-white/8"
        >
          <div class="relative overflow-hidden">
            <img
              :src="item.image"
              :alt="item.nombre"
              class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-80"
              loading="lazy"
            >
            <div class="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(11,17,18,0.9),transparent)]"></div>
            <span
              v-if="item.tag"
              class="absolute left-4 top-4 rounded-full bg-(--indu-primary) px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#082022]"
            >
              {{ item.tag }}
            </span>
            <span
              v-if="item.valor"
              class="absolute bottom-4 right-4 rounded-full border border-white/15 bg-[rgba(8,18,19,0.8)] px-3 py-1 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur-sm sm:text-xl sm:tracking-[0.12em]"
            >
              ${{ item.valor }}
            </span>
          </div>
          <div class="px-5 pb-5 pt-4">
            <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h3 class="min-w-0 text-xl leading-tight font-normal uppercase tracking-[0.12em] text-white sm:text-2xl sm:tracking-widest" style="font-family: 'Gobold High', sans-serif;">
                {{ item.nombre }}
              </h3>
              <p v-if="item.categoria" class="rounded-full border border-(--indu-primary)/25 px-2 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-(--indu-primary) sm:shrink-0 sm:border-0 sm:px-0 sm:py-0 sm:text-[0.72rem] sm:tracking-[0.16em]">
                {{ item.categoria }}
              </p>
            </div>
            <p v-if="item.subtitulo" class="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-white/82">{{ item.subtitulo }}</p>
            <p class="mt-2 text-sm leading-relaxed text-white/60">{{ item.desc }}</p>
          </div>
        </article>
      </div>

      <!-- Bloque poder femenino -->
      <div class="indu-fade mt-14 rounded-4xl border border-(--indu-primary)/20 bg-[linear-gradient(135deg,rgba(44,207,191,0.08),rgba(216,178,85,0.06))] px-6 py-10 sm:px-10 lg:mt-18 lg:px-14 lg:py-14">
        <div class="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--indu-primary)">{{ pageContent.story.kicker }}</p>
            <h3 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-14 text-white" style="font-family: 'Gobold High', sans-serif;">
              {{ pageContent.story.titleTop }}<br>{{ pageContent.story.titleBottom }}
            </h3>
            <p
              v-for="(paragraph, index) in pageContent.story.paragraphs"
              :key="paragraph"
              :class="index === 0 ? 'mt-5 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.05rem]' : 'mt-4 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.05rem]'"
            >
              {{ paragraph }}
            </p>
          </div>
          <div class="relative">
            <div class="absolute -inset-3 rounded-4xl bg-[linear-gradient(135deg,rgba(44,207,191,0.22),rgba(216,178,85,0.12)_60%,transparent)] blur-2xl"></div>
            <img
              :src="pageContent.story.image"
              :alt="pageContent.story.imageAlt"
              class="relative h-72 w-full rounded-4xl object-contain shadow-[0_22px_56px_rgba(0,0,0,0.22)] sm:h-96"
            >
          </div>
        </div>
      </div>

      <!-- CTA consultar -->
      <div class="indu-fade mt-12 text-center lg:mt-16">
        <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--indu-primary)">{{ pageContent.cta.kicker }}</p>
        <h3 class="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
          {{ pageContent.cta.title }}
        </h3>
        <p class="mx-auto mt-4 max-w-xl text-[1rem] leading-8 text-white/68 sm:text-[1.05rem]">
          {{ pageContent.cta.description }}
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            :href="pageContent.cta.link"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackOutboundClick(pageContent.cta.link, pageContent.cta.analyticsLabel)"
            class="inline-flex min-h-14 items-center gap-3 rounded-[1.35rem] bg-white px-6 py-4 text-[#082022] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-1"
          >
            <span class="text-[0.92rem] font-black uppercase tracking-[0.08em]">{{ pageContent.cta.buttonText }}</span>
            <svg class="h-5 w-5 text-(--indu-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Frase cierre -->
      <div class="indu-fade mt-14 border-t border-white/10 pt-12 text-center lg:mt-18">
        <p class="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3.8rem)] font-black italic leading-tight text-white" style="font-family: 'Gobold High', sans-serif;">
          {{ pageContent.closingQuote }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { trackOutboundClick } from '../composables/useAnalytics';
import { useLoader } from '../composables/useLoader.js';

const imgCamiseta2026 = new URL('../assets/Indumentaria/Camiseta2026.jpeg', import.meta.url).href
const imgHero = new URL('../assets/Indumentaria/Polera2026.png', import.meta.url).href
const imgArquera2025 = new URL('../assets/Indumentaria/CamisetaArquera2025.jpg', import.meta.url).href
const imgCamisetaClaraEspalda = new URL('../assets/Indumentaria/CamisetaClara2025Espalda.jpg', import.meta.url).href
const imgCamisetaClaraFrente = new URL('../assets/Indumentaria/CamisetaClara2025Frente.jpg', import.meta.url).href
const imgCamisetaArqueras = new URL('../assets/Indumentaria/CamisetArqueras.png', import.meta.url).href
const imgCamisetaTurquesa2024 = new URL('../assets/Indumentaria/CamisetaTurquesa2024.jpg', import.meta.url).href
const imgCortavientos2025 = new URL('../assets/Indumentaria/Cortavientos2025.jpg', import.meta.url).href

const imgHistoria = new URL('../assets/logoVk.png', import.meta.url).href

const imgCuelloPolar = new URL('../assets/Indumentaria/CuelloPolar.png', import.meta.url).href
const imgParkaVikingas = new URL('../assets/Indumentaria/Parka Vikingas.png', import.meta.url).href
const imgPoleraVerde = new URL('../assets/Indumentaria/PoleraVerde.png', import.meta.url).href
const imgShort = new URL('../assets/Indumentaria/short.PNG', import.meta.url).href
const poleronNegro = new URL('../assets/Indumentaria/PoleronNegro.png', import.meta.url).href
const poleronMorado = new URL('../assets/Indumentaria/PoleronCanguroMoradoInsigniaPro.jpg', import.meta.url).href
const indumentariaCompleta = new URL('../assets/Indumentaria/indumentariaCompleta.jpeg', import.meta.url).href
const pantalonBuzo = new URL('../assets/Indumentaria/pantalonbuzo.png', import.meta.url).href
const buzoCompleto = new URL('../assets/Indumentaria/buzocompleto.png', import.meta.url).href

const { show, hide } = useLoader()
const LOADER_MIN_DURATION = 600

const pageContent = {
  hero: {
    kicker: 'Más que una camiseta',
    titleStroke: 'Nuestra',
    titleFill: 'Indumentaria',
    description: 'Cada prenda de Vks es parte de nuestra historia, armadas con cariño e identidad para todo el Club.',
    badge: 'Catálogo actualizado',
    caption: 'Indumentarias 2026 Oficiales Vks',
    image: imgHero,
    imageAlt: 'Camiseta oficial Vikingas 2026'
  },
  identity: {
    kicker: 'Identidad en cada tela',
    title: 'Colores de barrio, fuerza de equipo',
    paragraphs: [
      'Cada prenda de Vikingas nace del mismo lugar que el club: de la calle, del esfuerzo colectivo y de la convicción de que las mujeres merecemos un espacio propio en el fútbol.',
    ]
  },
  catalog: {
    kicker: 'Catálogo Vikingas',
    title: 'Todas las prendas Vks',
    description: 'Desde la camiseta oficial de cada temporada hasta la parka para entrenar en invierno... Confeccionado por SPIRIT SPORT'
  },
  story: {
    kicker: 'Amor a la camiseta',
    titleTop: 'La camiseta',
    titleBottom: 'se transpira',
    paragraphs: [
      'Esta camiseta tiene historia. La de cada una que llegó sin conocer a nadie y hoy no se imagina un fin de semana sin cancha.',
      'Venimos de la cancha de cemento, de la falta de espacios y de hacernos un lugar entre la vida cotidiana para volver a jugar.',
      'Por eso la indumentaria no es adorno: es memoria, presencia y orgullo de Club.'
    ],
    image: imgHistoria,
    imageAlt: 'Cortavientos oficial Vikingas 2025'
  },
  cta: {
    kicker: '¿Quieres pedir algo?',
    title: 'Consulta por tu prenda',
    description: 'Hablanos por Instagram o directamente con la Profe Yesi para anotarte en el próximo pedido.',
    buttonText: 'Escribir por Instagram',
    link: 'https://instagram.com/cdvikingas',
    analyticsLabel: 'Instagram indumentaria'
  },
  closingQuote: 'No es merch. Es la piel de un club que se armó desde abajo, con barrio, con garra y con el orgullo de ser mujeres futbolistas que no le deben nada a nadie.'
}

const prendas = [
  {
    nombre: 'Camiseta 2026',
    subtitulo: 'OPCIONAL LOGO PRO $17.490',
    valor: '14.990',
    desc: 'Diseño principal de la temporada 2026.',
    image: imgCamiseta2026,
    tag: 'Nueva',
    categoria: 'Cancha'
  },
    {
    nombre: 'Polera alternativa Verde 2026',
    subtitulo: 'OPCIONAL LOGO PRO $17.490',
    valor: '14.990',
    desc: 'Polera alternativa 2026. Insignia, nombre y número.',
    image: imgPoleraVerde,
    tag: null,
    categoria: 'Cancha'
  },
   {
    nombre: 'Camiseta arqueras 2026',
    subtitulo: 'OPCIONAL LOGO PRO $17.490',
    valor: '14.990',
    desc: 'Camiseta arqueras 2026.',
    image: imgCamisetaArqueras,
    tag: 'Set',
    categoria: 'Portería'
  },
  {
    nombre: 'Camiseta arquera 2025',
    subtitulo: 'OPCIONAL LOGO PRO $17.490',
    valor: '14.990',
    desc: 'La camiseta de arquera. Opcional, manga larga.',
    image: imgArquera2025,
    tag: 'Arquera',
    categoria: 'Portería'
  },
  {
    nombre: 'Camiseta clara 2025',
    subtitulo: 'OPCIONAL LOGO PRO $17.490',
    valor: '14.990',
    desc: 'Registro de la camiseta clara con dorsal, nombre y sponsor.',
    image: imgCamisetaClaraEspalda,
    tag: 'Espalda',
    categoria: 'Cancha'
  },
  {
    nombre: 'Camiseta clara 2025 frente',
    subtitulo: 'OPCIONAL LOGO PRO $17.490',
    valor: '14.990',
    desc: 'Foto frontal de la camiseta clara 2025.',
    image: imgCamisetaClaraFrente,
    tag: null,
    categoria: 'Cancha'
  },
 
  {
    nombre: 'Camiseta turquesa 2024',
    subtitulo: 'Modelo clásico de cancha',
    valor: '14.990',
    desc: 'Camiseta temporada 2024',
    image: imgCamisetaTurquesa2024,
    tag: 'Clásica',
    categoria: 'Cancha'
  },
  {
    nombre: 'Cortavientos 2025',
    valor: '18.000',
    desc: 'Ideal para entrenar en días de viento o lluvia. A prueba de agua.',
    image: imgCortavientos2025,
    tag: 'Abrigo',
    categoria: 'Invierno'
  },
  {
    nombre: 'Cuello polar',
    valor: '3.500',
    desc: 'Complemento de invierno para los días más fríos, simple y funcional para entrenamientos nocturnos.',
    image: imgCuelloPolar,
    tag: null,
    categoria: 'Accesorios'
  },
  {
    nombre: 'Parka Vikingas',
    subtitulo: 'Abrigo grueso de temporada',
    valor: '40.000',
    desc: 'Parka acolchada con insignia Vikingas, ideal para el frío. Se puede agregar número.',
    image: imgParkaVikingas,
    tag: 'Invierno',
    categoria: 'Abrigo'
  },

  {
    nombre: 'Camiseta 2024/2025/2026 + short oficial',
    subtitulo: 'Indumentaria completa, Logo pro opcional',
    valor: '20.990',
    desc: 'Short negro con detalles turquesa y numeración visible, y camiseta oficial 2024/2025/2026.',
    image: indumentariaCompleta,
    tag: 'Uniforme',
    categoria: 'Cancha'
  },
   {
    nombre: 'Poleron Negro + logo PRO',
    subtitulo: 'Polerón de algodon version negro con logo pro',
    valor: '18.000',
    desc: 'Polerón negro de algodón con logo PRO, ideal para el invierno.',
    image: poleronNegro,
    tag: 'Polerón',
    categoria: 'Invierno'
  },
     {
    nombre: 'Poleron Morado + logo PRO',
    subtitulo: 'Polerón de algodon versión morado con logo pro',
    valor: '18.000',
    desc: 'Polerón morado de algodón con logo PRO, ideal para el invierno.',
    image: poleronMorado,
    tag: 'Polerón',
    categoria: 'Invierno'
  },
       {
    nombre: 'Pantalón de Buzo',
    subtitulo: 'Número opcional',
    valor: '14.000',
    desc: 'Pantalón de buzo de algodón con logo PRO, ideal para el invierno.',
    image: pantalonBuzo,
    tag: 'Pantalón',
    categoria: 'Invierno'
  },
         {
    nombre: 'Buzo completo ',
    subtitulo: 'Número opcional, polerón + pantalón',
    valor: '28.000',
    desc: 'Pantalón de buzo de algodón con logo PRO, ideal para el invierno. (Polerón negro o morado)',
    image: buzoCompleto,
    tag: 'Pantalón',
    categoria: 'Invierno'
  }
]

const preloadImage = (src) => new Promise((resolve) => {
  const image = new Image()

  image.onload = () => resolve(src)
  image.onerror = () => resolve(src)
  image.src = src

  if (image.complete) {
    resolve(src)
  }
})

const preloadIndumentariaImages = async () => {
  const sources = [
    pageContent.hero.image,
    pageContent.story.image,
    ...prendas.map((item) => item.image)
  ]

  const uniqueSources = [...new Set(sources.filter(Boolean))]
  await Promise.allSettled(uniqueSources.map(preloadImage))
}

const waitForPaint = async () => {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  show('Cargando indumentaria...')
  const startedAt = Date.now()

  try {
    await waitForPaint()
    await preloadIndumentariaImages()
  } finally {
    const elapsed = Date.now() - startedAt

    if (elapsed < LOADER_MIN_DURATION) {
      await wait(LOADER_MIN_DURATION - elapsed)
    }

    hide()
  }
})

onBeforeUnmount(() => {
  hide()
})
</script>

<style scoped>
.indumentaria-page {
  --indu-bg: #0b1112;
  --indu-paper: #f2ece1;
  --indu-ink: #132022;
  --indu-muted: #425d5f;
  --indu-primary: #2ccfbf;
  --indu-accent: #d8b255;
  --indu-line: #d8ddd3;
  --indu-text: #f7fffd;
}

.indu-paper {
  background: var(--indu-paper);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.12);
}

.indu-fade {
  animation: indu-rise 0.8s ease-out both;
}

@keyframes indu-rise {
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
  .indu-fade {
    animation: none;
  }
}
</style>
