<template>
  <section class="historia-page overflow-hidden bg-(--historia-bg) text-(--historia-text)">
    <header class="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="historia-fade text-[0.68rem] font-black uppercase tracking-[0.24em] mb-4 text-(--historia-primary)">Club Deportivo Social y Cultural Vikingas · 2019</p>
          <h1 class="historia-fade mt-3 max-w-3xl text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-10 md:leading-20 text-white" style="font-family: 'Gobold High', sans-serif;">
            La historia<br /><span class="text-(--historia-primary)">de Vikingas</span>
          </h1>
          <p class="historia-fade mt-6 max-w-xl text-pretty text-base leading-6 text-white/62 sm:text-lg">
            Vikingas nació para que mujeres adultas pudieran comenzar, volver a jugar, aprender y competir en un espacio estable, seguro y exigente.
          </p>
        </div>
        <p class="max-w-xs text-sm leading-6 text-white/42 lg:pb-1 lg:text-right">
          Un proyecto deportivo, social y comunitario construido con tiempo, constancia y confianza.
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <section class="historia-paper historia-fade grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-12 lg:py-12">
        <div>
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">El punto de partida</p>
          <h2 class="mt-3 text-[clamp(2.2rem,5vw,4.2rem)] font-black uppercase leading-16 text-(--historia-ink)" style="font-family: 'Gobold High', sans-serif;">Volver a la pelota sin pedir permiso</h2>
        </div>
        <div class="space-y-4 text-[1rem] leading-8 text-(--historia-muted) sm:text-[1.08rem]">
          <p>Vikingas es un club hecho por mujeres, para mujeres. Nació porque muchas no habían tenido la oportunidad de jugar: por falta de espacios, responsabilidades personales o ambientes poco inclusivos.</p>
          <p>Acá no se exige llegar formada. Se puede comenzar, retomar, desarrollarse y competir. La cancha es el punto de encuentro; la pertenencia se construye con respeto, compromiso y compañerismo.</p>
        </div>
      </section>

      <section class="mt-16 lg:mt-24" aria-labelledby="ruta-vikingas">
        <div class="flex flex-col gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">La ruta Vikingas</p>
            <h2 id="ruta-vikingas" class="mt-3 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-10 md:leading-16 text-white" style="font-family: 'Gobold High', sans-serif;">Pertenecer. Formarse. Prepararse. Competir.</h2>
          </div>
          <p class="max-w-xs text-sm leading-6 text-white/60">Cuatro ideas que orientan el proyecto sin separar a la comunidad del rendimiento.</p>
        </div>

        <div class="mt-8 grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="(pillar, index) in pillars" :key="pillar.title" class="historia-pillar bg-(--historia-bg) p-6" :style="{ '--delay': `${index * 90}ms` }">
            <span class="text-4xl font-black text-(--historia-secondary)" style="font-family: 'Gobold High', sans-serif;">0{{ index + 1 }}</span>
            <h3 class="mt-8 text-2xl font-black uppercase leading-none text-white" style="font-family: 'Gobold High', sans-serif;">{{ pillar.title }}</h3>
            <p class="mt-4 text-sm leading-7 text-white/68">{{ pillar.copy }}</p>
          </article>
        </div>
      </section>

      <section class="mt-16 lg:mt-24" aria-labelledby="linea-tiempo">
        <div class="grid gap-10 lg:grid-cols-[minmax(13rem,0.45fr)_minmax(0,1.55fr)]">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">Una historia que sigue</p>
            <h2 id="linea-tiempo" class="mt-3 text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-10 md:leading-20 text-white" style="font-family: 'Gobold High', sans-serif;">De las ganas al equipo</h2>
          </div>

          <div class="space-y-10 border-l border-(--historia-primary)/45 pl-6 sm:pl-10">
            <article v-for="(chapter, index) in chapters" :key="chapter.title" class="historia-fade relative grid gap-6 sm:grid-cols-[minmax(8rem,0.4fr)_minmax(0,1fr)] sm:items-center" :style="{ '--delay': `${index * 120}ms` }">
              <span class="absolute -left-[2.05rem] top-1 size-3 rounded-full bg-(--historia-primary) ring-8 ring-(--historia-bg) sm:-left-[2.95rem]" aria-hidden="true"></span>
              <img :src="chapter.image" :alt="chapter.alt" loading="lazy" class="h-44 w-full object-cover sm:h-36">
              <div>
                <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-secondary)">{{ chapter.kicker }}</p>
                <h3 class="mt-2 text-2xl font-black uppercase leading-[0.95] text-white sm:text-3xl" style="font-family: 'Gobold High', sans-serif;">{{ chapter.title }}</h3>
                <p class="mt-3 text-[1rem] leading-7 text-white/70">{{ chapter.copy }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article class="historia-paper historia-fade px-6 py-8 sm:px-8 lg:px-10">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">Tres categorías, un escudo</p>
          <h2 class="mt-3 text-[clamp(2.1rem,4vw,3.4rem)] font-black uppercase leading-[0.9] text-(--historia-ink)" style="font-family: 'Gobold High', sans-serif;">Cada una tiene su propósito</h2>
          <p class="mt-4 text-[1rem] leading-8 text-(--historia-muted)">Escuela Formativa, Serie C y Serie B Ascenso tienen objetivos y niveles de exigencia distintos. Ninguna vale más que otra: todas representan a Vikingas.</p>
          <div class="mt-6 space-y-3">
            <div v-for="category in categories" :key="category.name" class="border-t border-(--historia-line) pt-3">
              <p class="font-black uppercase text-(--historia-ink)">{{ category.name }}</p>
              <p class="mt-1 text-sm leading-6 text-(--historia-muted)">{{ category.copy }}</p>
            </div>
          </div>
        </article>

        <article class="historia-fade border border-white/15 bg-white/5 px-6 py-8 sm:px-8 lg:px-10">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">Nuestra forma de competir</p>
          <h2 class="mt-3 text-[clamp(2.1rem,4vw,3.4rem)] font-black uppercase leading-[0.9] text-white" style="font-family: 'Gobold High', sans-serif;">El resultado se trabaja</h2>
          <p class="mt-4 text-[1rem] leading-8 text-white/72">Vikingas quiere ganar y alcanzar objetivos deportivos importantes. La diferencia está en cómo se construye ese resultado: con entrenamiento, desarrollo de jugadoras, decisiones coherentes y rendimiento colectivo.</p>
          <blockquote class="mt-8 border-l-4 border-(--historia-secondary) pl-5 text-2xl font-black uppercase leading-tight text-white sm:text-3xl" style="font-family: 'Gobold High', sans-serif;">Competimos para ganar, pero nunca a cualquier precio.</blockquote>
        </article>
      </section>

      <section class="mt-16 lg:mt-24" aria-labelledby="logros-historia">
        <div class="flex flex-col gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">La huella del proceso</p>
            <h2 id="logros-historia" class="mt-3 text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-[0.9] text-white" style="font-family: 'Gobold High', sans-serif;">Logros que cuentan el camino</h2>
          </div>
          <p class="max-w-sm text-sm leading-6 text-white/60">Cada copa reconoce al plantel, al cuerpo técnico y a la comunidad que sostuvo el trabajo.</p>
        </div>
        <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(achievement, index) in achievements" :key="achievement" class="historia-achievement border border-white/12 bg-white/5 px-5 py-5" :style="{ '--delay': `${index * 70}ms` }">
            <span class="text-sm font-black text-(--historia-secondary)">0{{ index + 1 }}</span>
            <p class="mt-4 text-sm font-bold leading-6 text-white/82">{{ achievement }}</p>
          </div>
        </div>
      </section>

      <section class="historia-fade mt-16 border-y border-(--historia-primary)/30 py-14 text-center lg:mt-24 lg:py-20">
        <p class="mx-auto max-w-4xl text-[clamp(2.3rem,6vw,5rem)] font-black uppercase leading-[0.9] text-white" style="font-family: 'Gobold High', sans-serif;">Nosotras al centro, siempre.</p>
        <p class="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-white/72 sm:text-[1.1rem]">Así se hizo Vikingas: estando juntas, pasando los momentos difíciles y siguiendo adelante con una identidad que se construye todos los días.</p>
      </section>
    </main>
  </section>
</template>

<script setup>
const imageStart = new URL('../assets/2026/grupo.webp', import.meta.url).href
const imageGrowth = new URL('../assets/2026/equipo2026.jpg', import.meta.url).href
const imageCompetition = new URL('../assets/2026/IMG_20260323_223534.jpg', import.meta.url).href

const pillars = [
  {
    title: 'Pertenecer',
    copy: 'Construir una comunidad donde la cancha se sienta cercana y cada mujer encuentre un lugar real.'
  },
  {
    title: 'Formarse',
    copy: 'Aprender fundamentos, adquirir hábitos deportivos y respetar el punto de partida de cada jugadora.'
  },
  {
    title: 'Prepararse',
    copy: 'Entrenar con constancia, puntualidad, intensidad y disposición para que el equipo pueda responder.'
  },
  {
    title: 'Competir',
    copy: 'Buscar el mejor resultado con disciplina, confianza y una identidad colectiva que no se negocia.'
  }
]

const chapters = [
  {
    kicker: 'Inicio',
    title: 'Primero hubo ganas, después equipo',
    copy:
      'Todo partió con mujeres que llevaban años guardándose las ganas de jugar. Vikingas apareció como aparecen las cosas necesarias: alguien abre una puerta, otra llega, otra se queda, y de pronto ya hay grupo, camiseta e historia.',
    image: imageStart,
    alt: 'Primeros momentos de CD Vikingas en sus inicios'
  },
  {
    kicker: 'Crecimiento',
    title: 'De grupo a familia futbolera',
    copy:
      'Con los años llegaron más jugadoras, más historias, más abrazos de cancha y más motivos para volver. El crecimiento nunca fue sumar por sumar, sino construir un lugar donde cada una sintiera, de verdad, que acá también pertenecía.',
    image: imageGrowth,
    alt: 'Crecimiento del grupo de jugadoras en Vikingas'
  },
  {
    kicker: 'Camino deportivo',
    title: 'Competir sin soltar lo nuestro',
    copy:
      'Hoy Vikingas sostiene Serie B Ascenso, Serie C y Escuela Formativa. La competencia importa, pero nunca por encima de la esencia: procesos largos, confianza, compañerismo y una manera de jugar que nace de conocerse de verdad.',
    image: imageCompetition,
    alt: 'Equipo de Vikingas compitiendo en cancha'
  }
]

const categories = [
  {
    name: 'Escuela Formativa',
    copy: 'El punto de entrada para aprender, disfrutar, adquirir hábitos y desarrollar pertenencia.'
  },
  {
    name: 'Serie C',
    copy: 'El puente entre formación y competencia, con nuevos desafíos y una exigencia progresiva.'
  },
  {
    name: 'Serie B Ascenso',
    copy: 'La categoría de mayor exigencia competitiva, preparada para buscar objetivos deportivos importantes.'
  }
]


const achievements = [
  'Campeonas Oro Liga Summer Serie AB+ 2026',
  'Campeonas Formativo Campeonato VK 2026',
  'Campeonas Oro Todo o Nada 2025',
  'Subcampeonas Copa Liga Dobleve Ascenso 2025',
  'Campeonas Oro Liga Dobleve Ascenso 2024',
  'Subcampeonas Copa Conferencia 2024'
]
</script>

<style scoped>
.historia-page {
  --historia-bg: #0b1112;
  --historia-paper: #f2ece1;
  --historia-ink: #132022;
  --historia-muted: #425d5f;
  --historia-primary: #2ccfbf;
  --historia-secondary: #d8b255;
  --historia-line: #d8ddd3;
  --historia-text: #f7fffd;
}

.historia-paper {
  background: var(--historia-paper);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.12);
}

.historia-fade {
  animation: historia-rise 0.8s ease-out var(--delay, 0ms) both;
}

.historia-pillar,
.historia-achievement {
  animation: historia-rise 0.7s ease-out var(--delay, 0ms) both;
}

@keyframes historia-rise {
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
  .historia-fade {
    animation: none;
  }

  .historia-pillar,
  .historia-achievement {
    animation: none;
  }
}
</style>
