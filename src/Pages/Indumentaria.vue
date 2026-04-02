<template>
  <section class="indumentaria-page overflow-hidden bg-(--indu-bg) text-(--indu-text)">

    <!-- Hero -->
    <div class="relative isolate">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.18)_0%,rgba(11,17,18,0.78)_55%,rgba(11,17,18,0.98)_100%)]"></div>
        <div class="absolute left-[-6%] top-16 h-56 w-56 rounded-full bg-(--indu-primary)/14 blur-3xl"></div>
        <div class="absolute right-[-8%] top-0 h-64 w-64 rounded-full bg-(--indu-accent)/10 blur-3xl"></div>
      </div>

      <div class="mx-auto grid min-h-100 max-w-7xl items-end gap-8 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.9fr)] lg:px-8 lg:pb-16 lg:pt-18">
        <div class="relative z-10 max-w-2xl">
          <p class="indu-fade text-sm font-semibold italic text-white/70 sm:text-base">
            Más que una camiseta
          </p>
          <h1 class="indu-fade mt-4 uppercase leading-[0.88]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(3.5rem, 12vw, 7.5rem);">
            <span class="block text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.85)]">Nuestra</span>
            <span class="block text-white">Camiseta</span>
          </h1>
          <p class="indu-fade mt-6 max-w-xl text-[clamp(1rem,2.6vw,1.28rem)] leading-relaxed text-white/80">
            Ponerse estos colores es cargar con la historia de un barrio, la fuerza de un grupo de mujeres y el orgullo de ser parte de algo que se levantó de verdad.
          </p>
        </div>

        <div class="indu-fade relative z-10 lg:justify-self-end">
          <div class="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/6 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm">
            <img
              :src="imgCamiseta2026"
              alt="Camiseta Vikingas 2026"
              class="h-80 w-full rounded-[1.7rem] object-cover sm:h-96 lg:w-112"
            >
            <div class="absolute inset-x-6 bottom-6 rounded-[1.6rem] bg-[rgba(10,17,18,0.74)] px-5 py-4 backdrop-blur-sm">
              <p class="text-[0.72rem] font-black uppercase tracking-[0.2em] text-(--indu-primary)">Colección 2026</p>
              <p class="mt-2 text-sm leading-6 text-white/80 sm:text-base">
                Diseñada con identidad. Usada con orgullo.
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
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--indu-primary)">Identidad en cada tela</p>
            <h2 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-15 text-(--indu-ink)" style="font-family: 'Gobold High', sans-serif;">
              Colores de barrio, fuerza de equipo
            </h2>
          </div>

          <div class="space-y-4 text-[1rem] leading-8 text-(--indu-muted) sm:text-[1.05rem]">
            <p>
              Cada prenda de Vikingas nace del mismo lugar que el club: de la calle, del esfuerzo colectivo, de la convicción de que las mujeres merecemos un espacio propio en el fútbol. Ponerse la camiseta no es un gesto simbólico — es una declaración.
            </p>
            <p>
              No seguimos tendencias, seguimos nuestra historia. Cada diseño lleva trazos de lo que somos: barrio, comunidad y mujeres que no piden permiso pa' estar en la cancha.
            </p>
          </div>
        </div>
      </div>

      <!-- Prendas destacadas -->
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
              class="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            >
            <div class="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(11,17,18,0.9),transparent)]"></div>
            <span
              v-if="item.tag"
              class="absolute left-4 top-4 rounded-full bg-(--indu-primary) px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#082022]"
            >
              {{ item.tag }}
            </span>
          </div>
          <div class="px-5 pb-5 pt-4">
            <h3 class="text-lg font-black uppercase tracking-wide text-white" style="font-family: 'Gobold High', sans-serif;">
              {{ item.nombre }}
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-white/60">{{ item.desc }}</p>
          </div>
        </article>
      </div>

      <!-- Bloque poder femenino -->
      <div class="indu-fade mt-14 rounded-4xl border border-(--indu-primary)/20 bg-[linear-gradient(135deg,rgba(44,207,191,0.08),rgba(216,178,85,0.06))] px-6 py-10 sm:px-10 lg:mt-18 lg:px-14 lg:py-14">
        <div class="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--indu-primary)">Amor a la camiseta</p>
            <h3 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-[0.94] text-white" style="font-family: 'Gobold High', sans-serif;">
              La camiseta<br>se transpira
            </h3>
            <p class="mt-5 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.05rem]">
              Esta camiseta tiene historia. La de cada una que llegó sin conocer a nadie y hoy no se imagina un fin de semana sin cancha. La de las que se quedaron cuando todo costaba el doble.
            </p>
            <p class="mt-4 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.05rem]">
              Venimos de la cancha de cemento, de la falta de espacios, de hacernos un lugar entre la vida cotidiana para volver a jugar. Eso se nota en cada tela, en cada color, en cada detalle. Esto es ropa de cancha, de barrio, de club de verdad.
            </p>
            <p class="mt-4 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.05rem]">
              Este club pasó por todo: temporadas difíciles, lesiones, derrotas que dolieron y días en que éramos pocas. Y seguimos acá. Con la camiseta puesta por las que fueron, por las que somos, por las que serán.
            </p>
          </div>
          <div class="relative">
            <div class="absolute -inset-3 rounded-4xl bg-[linear-gradient(135deg,rgba(44,207,191,0.22),rgba(216,178,85,0.12)_60%,transparent)] blur-2xl"></div>
            <img
              :src="imgCortavientos"
              alt="Cortavientos oficial Vikingas"
              class="relative h-80 w-full rounded-4xl object-cover shadow-[0_22px_56px_rgba(0,0,0,0.22)] sm:h-96"
            >
          </div>
        </div>
      </div>

      <!-- CTA consultar -->
      <div class="indu-fade mt-12 text-center lg:mt-16">
        <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--indu-primary)">¿Te tincó algo?</p>
        <h3 class="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
          Consulta por tu prenda
        </h3>
        <p class="mx-auto mt-4 max-w-xl text-[1rem] leading-8 text-white/68 sm:text-[1.05rem]">
          Camisetas, cortavientos, polerones y más. Escríbenos por Instagram para ver disponibilidad y tallas.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://instagram.com/cdvikingas"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackOutboundClick('https://instagram.com/cdvikingas', 'Instagram indumentaria')"
            class="inline-flex min-h-14 items-center gap-3 rounded-[1.35rem] bg-white px-6 py-4 text-[#082022] shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-1"
          >
            <span class="text-[0.92rem] font-black uppercase tracking-[0.08em]">Escribir por Instagram</span>
            <svg class="h-5 w-5 text-(--indu-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Frase cierre -->
      <div class="indu-fade mt-14 border-t border-white/10 pt-12 text-center lg:mt-18">
        <p class="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3.8rem)] font-black italic leading-tight text-white" style="font-family: 'Gobold High', sans-serif;">
          No es merch. Es la piel de un club que se armó desde abajo, con barrio, con garra y con el orgullo de ser mujeres futbolistas que no le deben nada a nadie.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { trackOutboundClick } from '../composables/useAnalytics';

const imgCamiseta2026 = new URL('../assets/Indumentaria/Camiseta 2026.jpeg', import.meta.url).href
const imgCamiseta2025 = new URL('../assets/Indumentaria/Camiseta 2025 Frente.jpg', import.meta.url).href
const imgArquera = new URL('../assets/Indumentaria/Camiseta Arquera 2025.jpg', import.meta.url).href
const imgCortavientos = new URL('../assets/Indumentaria/Cortavientos 2025.jpg', import.meta.url).href
const imgPoleron = new URL('../assets/Indumentaria/Poleron Canguro Morado.jpg', import.meta.url).href
const imgCamiseta2024 = new URL('../assets/Indumentaria/Camiseta 2024.jpg', import.meta.url).href

const prendas = [
  {
    nombre: 'Camiseta 2026',
    desc: 'La nueva piel del club. Diseño que honra la historia y mira pa\' adelante.',
    image: imgCamiseta2026,
    tag: 'Nueva'
  },
  {
    nombre: 'Camiseta 2025',
    desc: 'Temporada de consagración. La camiseta que nos vio campeonas.',
    image: imgCamiseta2025,
    tag: null
  },
  {
    nombre: 'Camiseta Arquera',
    desc: 'Para las que cuidan el arco y sostienen al equipo desde atrás.',
    image: imgArquera,
    tag: null
  },
  {
    nombre: 'Cortavientos Oficial',
    desc: 'Pa\' los días helados de cancha. Abrigo con actitud vikinga.',
    image: imgCortavientos,
    tag: null
  },
  {
    nombre: 'Polerón Canguro',
    desc: 'Comodidad de barrio, estilo de club. Pa\' dentro y fuera de la cancha.',
    image: imgPoleron,
    tag: null
  },
  {
    nombre: 'Camiseta 2024',
    desc: 'La primera camiseta que marcó una era. Clásica e irrepetible.',
    image: imgCamiseta2024,
    tag: 'Clásica'
  }
]
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
