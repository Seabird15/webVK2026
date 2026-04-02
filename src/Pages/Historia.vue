<template>
  <section class="historia-page overflow-hidden bg-(--historia-bg) text-(--historia-text)">
    <div class="relative isolate">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.22)_0%,rgba(11,17,18,0.72)_55%,rgba(11,17,18,0.96)_100%)]"></div>
        <div class="absolute left-[-8%] top-10 h-56 w-56 rounded-full bg-(--historia-primary)/14 blur-3xl"></div>
        <div class="absolute right-[-10%] top-0 h-72 w-72 rounded-full bg-(--historia-secondary)/8 blur-3xl"></div>
      </div>

      <div class="mx-auto grid min-h-136 max-w-7xl items-end gap-8 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,1.05fr)] lg:px-8 lg:pb-16 lg:pt-18">
        <div class="relative z-10 max-w-2xl">
          <p class="historia-fade text-sm font-semibold italic text-white/74 sm:text-base">
            Desde diciembre de 2019
          </p>
          <h1 class="historia-fade mt-4 uppercase leading-[0.88]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(4rem, 13vw, 8.5rem);">
            <span class="block text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.88)]">Nuestra</span>
            <span class="block text-white">Historia</span>
          </h1>
          <p class="historia-fade mt-6 max-w-xl text-[clamp(1.02rem,2.8vw,1.34rem)] leading-relaxed text-white/84">
            Vikingas es un club creado por y para mujeres. Nació para que volver a la pelota no fuera un lujo ni una rareza, sino una cancha propia, una red de apoyo y un lugar donde quedarse de verdad.
          </p>
        </div>

        <div class="historia-fade relative z-10 lg:justify-self-end">
          <div class="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/6 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm">
            <img
              :src="heroImage"
              alt="Jugadoras de Vikingas reunidas en la cancha"
              class="h-80 w-full rounded-[1.7rem] object-cover sm:h-100 lg:w-136"
            >
            <div class="absolute inset-x-8 bottom-8 rounded-[1.6rem] bg-[rgba(10,17,18,0.72)] px-5 py-4 backdrop-blur-sm">
              <p class="text-[0.72rem] font-black uppercase tracking-[0.2em] text-(--historia-primary)">Creado por y para mujeres</p>
              <p class="mt-2 text-sm leading-6 text-white/82 sm:text-base">
                Acá el fútbol se vive con barrio, con abrazo y con paciencia. Primero se construye la casa; después, el juego encuentra su forma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="historia-paper historia-fade rounded-4xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">La idea que sostiene al club</p>
            <h2 class="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-black uppercase leading-[0.94] text-(--historia-ink)" style="font-family: 'Gobold High', sans-serif;">
              Una cancha para volver
            </h2>
          </div>

          <div class="space-y-4 text-[1rem] leading-8 text-(--historia-muted) sm:text-[1.05rem]">
            <p>
              Vikingas es un club hecho por mujeres, para mujeres. Nació en los barrios de Puente Alto porque hacía falta un espacio de verdad. Un lugar donde mujeres adultas pudieran volver a tocar la pelota sin pedir permiso, sin sentirse fuera de tiempo y sin tener que encajar en lógicas ajenas.
            </p>
            <p>
              Desde el comienzo, la apuesta fue otra: no salir a juntar jugadoras como piezas sueltas, sino armar comunidad con tiempo, constancia y confianza. Que la cancha se sintiera cercana. Que el club se sintiera casa. Nosotras al centro, siempre.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-10 grid gap-8 lg:mt-14">
        <article
          v-for="(chapter, index) in chapters"
          :key="chapter.title"
          class="historia-fade grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10"
        >
          <div :class="index % 2 === 1 ? 'lg:order-2' : ''" class="space-y-4">
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">
              {{ chapter.kicker }}
            </p>
            <h3 class="text-[clamp(2rem,4vw,3rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
              {{ chapter.title }}
            </h3>
            <p class="max-w-xl text-[1rem] leading-8 text-white/72 sm:text-[1.05rem]">
              {{ chapter.copy }}
            </p>
          </div>

          <div :class="index % 2 === 1 ? 'lg:order-1' : ''" class="relative">
            <div class="absolute -inset-3 rounded-4xl bg-[linear-gradient(135deg,rgba(44,207,191,0.18),transparent_60%)] blur-2xl"></div>
            <img
              :src="chapter.image"
              :alt="chapter.alt"
              class="relative h-72 w-full rounded-4xl object-cover shadow-[0_22px_56px_rgba(0,0,0,0.18)] sm:h-88"
            >
          </div>
        </article>
      </div>

      <div class="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section class="historia-paper historia-fade rounded-4xl px-6 py-8 sm:px-8 lg:px-10">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">Lo que cuidamos</p>
          <h3 class="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-black uppercase leading-[0.95] text-(--historia-ink)" style="font-family: 'Gobold High', sans-serif;">
            Más que un club, una red
          </h3>
          <p class="mt-4 max-w-2xl text-[1rem] leading-8 text-(--historia-muted) sm:text-[1.05rem]">
            En Vikingas se entrena y se compite, sí, pero también se acompaña. El club se sostiene porque hay pertenencia, porque existe un espacio seguro y porque los lazos siguen vivos mucho después de que se apagan las luces de la cancha.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <span
              v-for="value in values"
              :key="value"
              class="inline-flex min-h-11 items-center rounded-full border border-(--historia-line) bg-white px-4 py-2 text-[0.78rem] font-black uppercase tracking-[0.14em] text-(--historia-ink)"
            >
              {{ value }}
            </span>
          </div>
        </section>

        <section class="historia-fade rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-6 py-8 sm:px-8 lg:px-10">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">Huella reciente</p>
          <h3 class="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
            Copas que cuentan el camino
          </h3>

          <div class="mt-6 space-y-3">
            <div
              v-for="achievement in achievements"
              :key="achievement"
              class="rounded-[1.4rem] border border-white/8 bg-white/6 px-4 py-4 text-sm leading-6 text-white/78"
            >
              {{ achievement }}
            </div>
          </div>
        </section>
      </div>

      <div class="historia-fade mt-14 rounded-4xl border border-(--historia-primary)/20 bg-[linear-gradient(135deg,rgba(44,207,191,0.08),rgba(216,178,85,0.06))] px-6 py-10 sm:px-10 lg:mt-18 lg:px-14 lg:py-14">
        <div class="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--historia-primary)">Por y para mujeres</p>
            <h3 class="mt-3 text-[clamp(2rem,4vw,3.4rem)] font-black uppercase leading-15 text-white" style="font-family: 'Gobold High', sans-serif;">
              Nosotras al centro,<br>siempre
            </h3>
            <p class="mt-5 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.05rem]">
              Vikingas existe porque mujeres decidieron crear su propio espacio en el fútbol. No esperamos que alguien nos abriera la puerta: la abrimos nosotras. Y seguiremos abriéndola para que lleguen más.
            </p>
            <p class="mt-4 max-w-xl text-[1rem] leading-8 text-white/78 sm:text-[1.05rem]">
              Creemos en los procesos, en nuestras jugadoras, en formarnos paso a paso. Si logramos cosas —y las logramos— es porque tomamos el camino difícil, el más bonito: el que se construye con paciencia, compromiso y la convicción de que las mujeres merecemos más canchas, más espacios y más voz.
            </p>
          </div>
          <div class="relative">
            <div class="absolute -inset-3 rounded-4xl bg-[linear-gradient(135deg,rgba(44,207,191,0.22),rgba(216,178,85,0.12)_60%,transparent)] blur-2xl"></div>
            <img
              :src="imageProcess"
              alt="Vikingas celebrando un logro en equipo"
              class="relative h-80 w-full rounded-4xl object-cover shadow-[0_22px_56px_rgba(0,0,0,0.22)] sm:h-96"
            >
          </div>
        </div>
      </div>

      <div class="historia-fade mt-14 border-t border-white/10 pt-12 text-center lg:mt-18">
        <p class="mx-auto max-w-3xl text-[clamp(2rem,4vw,4.2rem)] font-black italic leading-tight text-white" style="font-family: 'Gobold High', sans-serif;">
          Un club creado por mujeres, para mujeres. Y vamos a seguir abriendo canchas hasta que sobren espacios donde jugar.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const heroImage = new URL('../assets/2026/equipo2026.jpg', import.meta.url).href
const imageStart = new URL('../assets/2026/grupo.webp', import.meta.url).href
const imageGrowth = new URL('../assets/2026/WhatsApp Image 2026-02-16 at 9.30.54 PM.jpeg', import.meta.url).href
const imageCompetition = new URL('../assets/2026/IMG_20260323_223534.jpg', import.meta.url).href
const imageProcess = new URL('../assets/2026/6L6A7821.jpg', import.meta.url).href

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

const values = [
  'Sentido de pertenencia',
  'Comunidad',
  'Procesos',
  'Espacio seguro',
  'Lazos más allá del fútbol'
]

const achievements = [
  'Campeonas Oro Liga Dobleve Ascenso 2024',
  'Subcampeonas Copa Conferencia 2024',
  'Subcampeonas Copa Liga Dobleve Ascenso 2025',
  'Campeonas Oro Todo o Nada 2025',
  'Campeonas Espartanos',
  'Campeonas Oro Liga Summer Serie AB+ 2026'
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
  animation: historia-rise 0.8s ease-out both;
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
}
</style>
