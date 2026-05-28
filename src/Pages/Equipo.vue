<template>
  <section class="equipo-page overflow-hidden bg-(--eq-bg) text-(--eq-text)">

    <!-- Hero -->
    <div class="relative isolate">
      <div class="absolute inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,18,0.18)_0%,rgba(11,17,18,0.78)_55%,rgba(11,17,18,0.98)_100%)]"></div>
        <div class="absolute left-[-6%] top-16 h-56 w-56 rounded-full bg-(--eq-primary)/14 blur-3xl"></div>
        <div class="absolute right-[-8%] top-0 h-64 w-64 rounded-full bg-(--eq-accent)/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pb-12 lg:pt-18">
        <p class="eq-fade text-sm font-semibold italic text-white/70 sm:text-base">
          Formadas acá, juntas siempre
        </p>
        <h1 class="eq-fade mt-4 uppercase leading-[0.88]" style="font-family: 'Gobold High', sans-serif; font-size: clamp(3.5rem, 12vw, 7.5rem);">
          <span class="block text-transparent [-webkit-text-stroke:1.5px_rgba(247,255,253,0.85)]">Nuestro</span>
          <span class="block text-white">Equipo</span>
        </h1>
        <p class="eq-fade mt-6 max-w-2xl text-[clamp(1rem,2.6vw,1.28rem)] leading-relaxed text-white/80">
          Acá no se ficha para ganar rápido. Se entrena, se acompaña y se crece juntas. Cada jugadora que ves llegó para quedarse y construir algo de verdad.
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="sticky top-0 z-30 border-b border-white/10 bg-(--eq-bg)/95 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-1 md:gap-6 lg:gap-10 min-w-min md:min-w-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id; trackTabChange(tab.label, 'equipo')"
            class="py-4 px-3 md:px-4 text-xs md:text-sm font-black uppercase tracking-[0.14em] transition-all border-b-2 whitespace-nowrap cursor-pointer"
            :class="activeTab === tab.id
              ? 'border-(--eq-primary) text-(--eq-primary)'
              : 'border-transparent text-white/50 hover:text-white/80'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido de las pestañas -->
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

      <!-- Contenido especial para Cuerpo técnico -->
      <div v-if="activeTab === 'cuerpo-tecnico'">
        <div class="eq-fade eq-paper rounded-4xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
            <div>
              <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--eq-primary)">Procesos, formación y competencia</p>
              <h2 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-[0.94] text-(--eq-ink)" style="font-family: 'Gobold High', sans-serif;">
                Cuerpo técnico
              </h2>
            </div>
            <div class="space-y-4 text-[1rem] leading-8 text-(--eq-muted) sm:text-[1.05rem]">
              <p>
                Quienes sostienen el trabajo diario del club, acompañando el crecimiento del plantel desde la formación y la competencia.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-10 grid gap-6 xl:grid-cols-2">
          <article
            v-for="integrante in cuerpoTecnico"
            :key="integrante.id"
            class="eq-fade overflow-hidden rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-5"
          >
            <div class="grid gap-5 lg:grid-cols-[minmax(13rem,0.85fr)_minmax(0,1.15fr)] lg:items-stretch">
              <div class="overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/20 shadow-[0_18px_40px_rgba(0,0,0,0.22)] outline-1 outline-white/10">
                <img :src="integrante.foto" :alt="integrante.nombre" class="aspect-4/5 w-full object-cover" />
              </div>

              <div class="flex flex-col rounded-[1.7rem] border border-white/8 bg-black/16 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--eq-primary)">{{ integrante.kicker }}</p>
                    <h3 class="mt-3 text-[clamp(1.8rem,3vw,2.7rem)] font-black uppercase leading-12 text-white" style="font-family: 'Gobold High', sans-serif;">
                      {{ integrante.nombre }}
                    </h3>
                  </div>
                  <span class="inline-flex min-h-12 items-center rounded-full border border-(--eq-primary)/25 bg-(--eq-primary)/10 px-4 text-sm font-black uppercase text-(--eq-primary)">
                    {{ integrante.rol }}
                  </span>
                </div>

                <p class="mt-4 text-[0.98rem] leading-7 text-white/76">
                  {{ integrante.bajada }}
                </p>

                <div class="mt-5 flex flex-wrap gap-2">
                  <span
                    v-for="item in integrante.enfoque"
                    :key="`${integrante.id}-${item}`"
                    class="inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/6 px-4 text-[0.72rem] font-black uppercase tracking-[0.12em] text-white/78"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Contenido especial para Futsal -->
      <div v-else-if="activeTab === 'futsal'">
        <!-- Banner Futsal -->
        <div class="eq-fade eq-paper rounded-4xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
            <div>
              <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--eq-primary)">Proyecto Municipal Puente Alto</p>
              <h2 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-[0.94] text-(--eq-ink)" style="font-family: 'Gobold High', sans-serif;">
                Taller de Futsal
              </h2>
            </div>
            <div class="space-y-4 text-[1rem] leading-8 text-(--eq-muted) sm:text-[1.05rem]">
              <p>
                De noviembre a febrero, gracias a un proyecto ganado en la Municipalidad de Puente Alto,
                abrimos los espacios para entrenar una nueva disciplina: <strong class="text-(--eq-ink)">el Futsal</strong>.
              </p>
              <p>
                Este taller fue un hito para el club. Permitió que nuestras jugadoras desarrollaran nuevas
                habilidades y que llegaran nuevas integrantes que hoy son parte de la familia vikinga.
              </p>
            </div>
          </div>
        </div>

        <!-- Aviso partido amistoso -->
        <div class="eq-fade mt-8 rounded-4xl border border-(--eq-primary)/20 bg-[linear-gradient(135deg,rgba(44,207,191,0.08),rgba(216,178,85,0.06))] px-6 py-8 text-center sm:px-10">
          <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--eq-primary)">Próximamente</p>
          <h3 class="mt-3 text-[clamp(1.6rem,4vw,2.6rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
            Partido amistoso cierre Taller Futsal 2025-2026
          </h3>
        </div>

        <!-- Collage de fotos -->
        <div class="eq-fade mt-10 grid gap-6 lg:grid-cols-2">
          <div class="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5">
            <img :src="fotoFutsal1" alt="Taller de Futsal" class="h-80 w-full object-cover sm:h-96" />
          </div>
          <div class="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5">
            <img :src="fotoFutsal2" alt="Entrenamientos Futsal" class="h-80 w-full object-cover sm:h-96" />
          </div>
        </div>

        <!-- Logros del proyecto -->
        <div class="eq-fade mt-10 grid gap-4 sm:grid-cols-3">
          <div class="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-center">
            <ShoppingBagIcon class="mx-auto h-10 w-10 text-(--eq-primary)" />
            <h4 class="mt-3 text-sm font-black uppercase tracking-wide text-white">Mejores implementos</h4>
            <p class="mt-2 text-sm leading-relaxed text-white/60">Equipamiento de calidad para todas las categorías</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-center">
            <UserGroupIcon class="mx-auto h-10 w-10 text-(--eq-primary)" />
            <h4 class="mt-3 text-sm font-black uppercase tracking-wide text-white">Nuevas integrantes</h4>
            <p class="mt-2 text-sm leading-relaxed text-white/60">Jugadoras que se sumaron a Escuela y Ascenso</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-center">
            <BoltIcon class="mx-auto h-10 w-10 text-(--eq-primary)" />
            <h4 class="mt-3 text-sm font-black uppercase tracking-wide text-white">Continuidad</h4>
            <p class="mt-2 text-sm leading-relaxed text-white/60">Entrenamiento constante durante todo el proyecto</p>
          </div>
        </div>

        <!-- Cierre futsal -->
        <div class="eq-fade mt-10 rounded-4xl border border-white/10 bg-white/5 px-6 py-8 sm:px-10">
          <h3 class="text-[clamp(1.6rem,4vw,2.4rem)] font-black uppercase leading-[0.95] text-white" style="font-family: 'Gobold High', sans-serif;">
            Seguiremos abriendo espacios
          </h3>
          <p class="mt-4 max-w-3xl text-[1rem] leading-8 text-white/72 sm:text-[1.05rem]">
            El taller cerró en febrero dejando frutos importantes: nuevas compañeras, mejor equipamiento
            y la certeza de que cuando abrimos la puerta, llegan mujeres que quieren quedarse.
          </p>
          <div class="mt-6 flex flex-wrap gap-4">
            <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <CalendarIcon class="h-5 w-5 text-(--eq-primary)" />
              <span class="text-sm font-bold text-white/80">Nov – Feb</span>
            </div>
            <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <MapPinIcon class="h-5 w-5 text-(--eq-primary)" />
              <span class="text-sm font-bold text-white/80">Puente Alto</span>
            </div>
            <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <TrophyIcon class="h-5 w-5 text-(--eq-primary)" />
              <span class="text-sm font-bold text-white/80">Finalizado</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido normal para Ascenso, Serie C y Escuela -->
      <div v-else-if="equipoActual">
        <!-- Descripción del equipo -->
        <div class="eq-fade eq-paper rounded-4xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
            <div>
              <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--eq-primary)">{{ equipoActual.kicker }}</p>
              <h2 class="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black uppercase leading-[0.94] text-(--eq-ink)" style="font-family: 'Gobold High', sans-serif;">
                {{ equipoActual.titulo }}
              </h2>
            </div>
            <div class="text-[1rem] leading-8 text-(--eq-muted) sm:text-[1.05rem]">
              <p>{{ equipoActual.descripcion }}</p>
            </div>
          </div>
        </div>

        <!-- Estado cargando -->
        <div v-if="isLoading" class="eq-fade mt-10 text-center py-12">
          <p class="text-white/50 font-semibold">Cargando equipo...</p>
        </div>

        <div v-else class="mt-10 space-y-10">
       

       

          <!-- Secciones de jugadoras por posición -->
          <template v-for="seccion in secciones" :key="seccion.key">
            <div v-if="equipoActual[seccion.key].length > 0" class="eq-fade">
              <p class="text-[0.72rem] font-black uppercase tracking-[0.22em] text-(--eq-primary)">{{ seccion.label }}</p>
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <router-link
                  v-for="jugadora in equipoActual[seccion.key]"
                  :key="jugadora.id"
                  :to="`/jugadoras/${jugadora.id}`"
                  class="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-(--eq-primary)/30 hover:bg-white/8"
                >
                  <div class="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white/10 md:h-28 md:w-28">
                    <img :src="obtenerFoto(jugadora.foto)" :alt="jugadora.nombre" class="h-full w-full object-cover"/>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-[0.65rem] font-black uppercase tracking-[0.16em] text-(--eq-primary)">{{ jugadora.posicion }}</p>
                    <h4 class="mt-1 truncate text-base font-black text-white md:text-lg">{{ jugadora.nombre }} {{ jugadora.apellido }}</h4>
                    <p class="mt-1 text-3xl font-black text-(--eq-primary) md:text-4xl">{{ jugadora.numero?.toString().padStart(2, '0') || '00' }}</p>
                    <p class="mt-1 text-[0.7rem] font-black uppercase text-white/45">Ver ficha pública</p>
                  </div>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Frase cierre -->
    <div class="eq-fade mx-auto max-w-7xl border-t border-white/10 px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
      <p class="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3.6rem)] font-black italic leading-tight text-white" style="font-family: 'Gobold High', sans-serif;">
        Acá no llegan jugadoras de paso. Llegan mujeres que se quedan, que entrenan, que construyen. Y eso no se ficha. Se vive.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { ShoppingBagIcon, UserGroupIcon, BoltIcon, CalendarIcon, MapPinIcon, TrophyIcon } from '@heroicons/vue/24/outline';
import { trackTabChange } from '../composables/useAnalytics';
import logoBlanco from '@/assets/logoblanco.jpg';
import fotoFutsal1 from '@/assets/futsal1.jpeg';
import fotoFutsal2 from '@/assets/fustal2.jpeg';
import fotoYesi from '@/assets/ct/WhatsApp Image 2026-05-27 at 17.21.16.jpeg';
import fotoLucas from '@/assets/ct/701612690_18067511408679446_5594093179394221215_n.webp';
import { obtenerEquipoCompletoRegistro } from '../firebase/jugadorasAuth';
import { useLoader } from '../composables/useLoader.js';

const { show, hide } = useLoader();
const activeTab = ref('ascenso');

const tabs = [
  { id: 'ascenso', label: 'Ascenso' },
  { id: 'serie-c', label: 'Serie C' },
  { id: 'escuela', label: 'Escuela' },
  { id: 'cuerpo-tecnico', label: 'Cuerpo técnico' },
  { id: 'futsal', label: 'Futsal' },
];

const cuerpoTecnico = [
  {
    id: 'dt',
    kicker: 'Directora técnica',
    nombre: 'Yesennia Gallardo',
    rol: 'DT',
    foto: fotoYesi,
    bajada: 'Licenciada en educación física y entrenadora de Ascenso, Serie C y Escuela Formativa.',
  },
  {
    id: 'arqueras',
    kicker: 'Preparador arqueras',
    nombre: 'Lucas Hernandez',
    rol: 'PA',
    foto: fotoLucas,
    bajada: 'Preparador de arqueras del club, enfocado en técnica, lectura del juego y confianza bajo presión.',
  }
];

const secciones = [
  { key: 'porteras', label: 'Porteras' },
  { key: 'defensas', label: 'Defensas' },
  { key: 'alas', label: 'Alas' },
  { key: 'medio', label: 'Medio' },
  { key: 'delanteras', label: 'Delanteras' },
];

// Estructura base de equipos con descripciones alineadas a la identidad del club
const equiposBase = {
  ascenso: {
    titulo: 'Ascenso',
    kicker: 'Nuestra rama competitiva',
    descripcion: 'El equipo de Ascenso es donde se ve el fruto de los procesos. Acá juegan mujeres que llevan años entrenando juntas, conociéndose, bancándose. No se armó fichando: se construyó con paciencia, cancha y confianza. La garra sale de conocerse de verdad.',
  },
  'serie-c': {
    titulo: 'Serie C',
    kicker: 'Desarrollo competitivo',
    descripcion: 'Serie C es donde las jugadoras dan el salto. Un espacio para competir con exigencia pero sin perder lo esencial: el proceso. Acá cada una aporta desde su historia, y el equipo crece porque nadie queda atrás.',
  },
  escuela: {
    titulo: 'Escuela',
    kicker: 'Formadas en',
    descripcion: 'La Escuela es donde todo empieza. Mujeres que vuelven a la pelota después de años, que se atreven a entrar a la cancha por primera vez o que simplemente necesitaban un lugar donde sentirse parte. Acá se aprende fútbol, sí, pero sobre todo se aprende que siempre hay espacio para volver.',
  },
  futsal: {
    titulo: 'Futsal',
    kicker: 'Proyecto especial',
    descripcion: 'Fútbol de salón con toda la energía vikinga. Jugadoras ágiles, técnicas y rápidas en un formato que complementa lo que hacemos en cancha grande.',
  }
};

// Datos reactivos de los equipos desde Firestore
const equipos = ref({
  ascenso: { ...equiposBase.ascenso, directoraTecnica: null, preparadorPorteras: null, porteras: [], defensas: [], alas: [], medio: [], delanteras: [] },
  'serie-c': { ...equiposBase['serie-c'], directoraTecnica: null, preparadorPorteras: null, porteras: [], defensas: [], alas: [], medio: [], delanteras: [] },
  escuela: { ...equiposBase.escuela, directoraTecnica: null, preparadorPorteras: null, porteras: [], defensas: [], alas: [], medio: [], delanteras: [] },
  futsal: { ...equiposBase.futsal, directoraTecnica: null, preparadorPorteras: null, porteras: [], defensas: [], alas: [], medio: [], delanteras: [] },
});

const equipoActual = computed(() => equipos.value[activeTab.value]);

// Cargar datos del equipo desde Firestore
const cargarEquipo = async (equipoId) => {
  // No cargar datos para futsal ya que es contenido estático
  if (equipoId === 'futsal' || equipoId === 'cuerpo-tecnico') {
    return;
  }
  
  try {
    show('Cargando equipo...');
    // Convertir "serie-c" a "serieC" para la consulta de Firestore
    const equipoFirebase = equipoId === 'serie-c' ? 'serieC' : equipoId;
    const datosEquipo = await obtenerEquipoCompletoRegistro(equipoFirebase);
    
    equipos.value[equipoId] = {
      ...equiposBase[equipoId],
      directoraTecnica: datosEquipo.directoraTecnica,
      preparadorPorteras: datosEquipo.preparadorPorteras,
      porteras: datosEquipo.porteras,
      defensas: datosEquipo.defensas,
      alas: datosEquipo.alas,
      medio: datosEquipo.medio,
      delanteras: datosEquipo.delanteras
    };
  } catch (err) {
    // // console.error(`Error cargando equipo ${equipoId}:`, err);
  } finally {
    hide();
  }
};

// Función para obtener foto o logo por defecto
const obtenerFoto = (foto) => {
  return foto ? foto : logoBlanco;
};

// Función para verificar si una jugadora pertenece a un equipo
const pertenecePorEquipo = (jugadora, equipo) => {
  // Soportar formato nuevo: equipos como array
  if (Array.isArray(jugadora.equipos)) {
    return jugadora.equipos.includes(equipo);
  }
  // Soportar formato antiguo: equipo como string
  if (equipo === 'ascenso') {
    return jugadora.equipo === 'ascenso' || jugadora.equipo === 'ambos';
  } else if (equipo === 'escuela') {
    return jugadora.equipo === 'escuela' || jugadora.equipo === 'ambos';
  } else if (equipo === 'serieC') {
    return jugadora.equipo === 'serieC';
  }
  return false;
};

// Cargar datos cuando cambia la pestaña
watch(activeTab, (nuevoEquipo) => {
  cargarEquipo(nuevoEquipo);
});

// Cargar el equipo inicial al montar
onMounted(() => {
  cargarEquipo('ascenso');
});
</script>

<style scoped>
.equipo-page {
  --eq-bg: #0b1112;
  --eq-paper: #f2ece1;
  --eq-ink: #132022;
  --eq-muted: #425d5f;
  --eq-primary: #2ccfbf;
  --eq-accent: #d8b255;
  --eq-text: #f7fffd;
}

.eq-paper {
  background: var(--eq-paper);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.12);
}

.eq-fade {
  animation: eq-rise 0.8s ease-out both;
}

@keyframes eq-rise {
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
  .eq-fade {
    animation: none;
  }
}
</style>