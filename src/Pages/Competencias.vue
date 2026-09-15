<template>
  <main class="min-h-screen overflow-hidden bg-[#06100f] px-4 py-8 text-white sm:px-6 lg:px-8">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(0,168,150,0.24),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(255,215,0,0.08),transparent_24%),linear-gradient(180deg,#0b2420_0%,#06100f_48%,#020605_100%)]"></div>

    <div class="relative z-10 mx-auto max-w-7xl">
      <header class="mb-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
        <div>
          <p class="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary">CD Vikingas · temporada 2026</p>
          <h1 class="max-w-4xl text-5xl font-bold leading-[0.9] sm:text-7xl lg:text-8xl" style="font-family: 'Gobold High', sans-serif;">
            EL CAMINO<br /><span class="text-primary">SE JUEGA</span>
          </h1>
          <p class="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/70 sm:text-lg">
            La historia de nuestras dos series, fecha a fecha. Lo que ya vivimos, lo que viene y todo el proceso que construimos juntas.
          </p>
        </div>

        <div class="border-l border-primary/40 pl-5 lg:mb-2">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-white/45">Registro de competencia</p>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p class="text-3xl font-black text-primary">{{ totalPartidos }}</p>
              <p class="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/45">Partidos</p>
            </div>
            <div>
              <p class="text-3xl font-black text-secondary">{{ partidosJugados }}</p>
              <p class="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/45">Jugados</p>
            </div>
          </div>
          <p v-if="proximoPartido" class="mt-6 text-sm text-white/65">
            Próximo cruce: <strong class="text-white">{{ proximoPartido.rival }}</strong>
          </p>
        </div>
      </header>

      <div class="mb-8 flex flex-col gap-4 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2 text-sm text-white/55">
          <span class="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_rgba(0,168,150,0.8)]"></span>
          Actualizado en tiempo real desde la agenda Vikingas
        </div>
        <div class="flex gap-2" role="group" aria-label="Filtrar partidos">
          <button v-for="filtro in filtros" :key="filtro.id" type="button" class="rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition" :class="filtroActivo === filtro.id ? 'border-primary bg-primary text-black' : 'border-white/15 bg-white/5 text-white/65 hover:border-primary/60 hover:text-white'" @click="filtroActivo = filtro.id">
            {{ filtro.label }}
          </button>
        </div>
      </div>

      <div v-if="cargando" class="grid gap-5 md:grid-cols-2">
        <div v-for="n in 2" :key="n" class="h-96 animate-pulse rounded-4xl border border-white/10 bg-white/5"></div>
      </div>

      <div v-else-if="error" class="rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-center text-red-100">
        No pudimos cargar la historia de competencias. Intenta nuevamente más tarde.
      </div>

      <div v-else>
        <div class="mb-5 flex gap-2 xl:hidden" role="tablist" aria-label="Seleccionar serie">
          <button
            v-for="serie in series"
            :key="`tab-${serie.id}`"
            type="button"
            role="tab"
            :aria-selected="serieActivaMobile === serie.id"
            class="flex-1 rounded-full border px-3 py-2.5 text-xs font-black uppercase tracking-[0.14em] transition"
            :class="serieActivaMobile === serie.id ? 'border-primary bg-primary text-black' : 'border-white/15 bg-white/5 text-white/65 hover:border-primary/60 hover:text-white'"
            @click="serieActivaMobile = serie.id"
          >
            {{ serie.nombre }} <span class="opacity-70">({{ serie.partidos.length }})</span>
          </button>
        </div>

        <div class="grid gap-6 xl:grid-cols-2">
        <section
          v-for="serie in series"
          :key="serie.id"
          class="overflow-hidden rounded-4xl border border-white/10 bg-white/4.5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
          :class="serieActivaMobile === serie.id ? '' : 'hidden xl:block'"
        >
          <div class="relative overflow-hidden border-b border-white/10 p-6 sm:p-8" :class="serie.id === 'serieB' ? 'bg-[#103d36]' : 'bg-[#172f42]'">
            <div class="absolute -right-14 -top-20 h-44 w-44 rounded-full border-28 border-white/5"></div>
            <div class="relative flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.26em]" :class="serie.id === 'serieB' ? 'text-primary' : 'text-sky-300'">{{ serie.kicker }}</p>
                <h2 class="mt-2 text-4xl font-bold uppercase leading-none sm:text-5xl" style="font-family: 'Gobold High', sans-serif;">{{ serie.nombre }}</h2>
              </div>
              <span class="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white/70">{{ serie.partidos.length }} fechas</span>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <div v-if="serie.partidos.length === 0" class="rounded-2xl border border-dashed border-white/15 px-5 py-10 text-center text-sm text-white/50">
              Todavía no hay partidos registrados para esta serie.
            </div>

            <div v-else class="relative space-y-4 before:absolute before:bottom-5 before:left-[1.15rem] before:top-5 before:w-px before:bg-white/10 sm:before:left-[1.35rem]">
              <article v-for="partido in serie.partidos" :key="partido.id" class="relative pl-9 sm:pl-11">
                <span class="absolute left-2 top-6 h-3 w-3 rounded-full border-2 border-[#06100f] bg-primary sm:left-2.5"></span>
                <div class="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-primary/40 sm:p-5">
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]" :class="claseEstado(partido)">{{ etiquetaEstado(partido) }}</span>
                      <span class="text-xs font-bold uppercase tracking-[0.12em] text-white/40">{{ etiquetaTipo(partido.tipo) }}</span>
                    </div>
                    <time class="text-xs font-bold text-white/50">{{ formatearFecha(partido.fecha) }}</time>
                  </div>

                  <div class="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div>
                      <p class="text-sm font-black text-white sm:text-base">Vikingas</p>
                      <p class="mt-1 text-xs text-white/45">{{ partido.horario || partido.hora || 'Horario por confirmar' }}</p>
                    </div>
                    <div class="text-center">
                      <p v-if="tieneResultado(partido)" class="text-3xl font-black tracking-tight text-primary sm:text-4xl">{{ marcador(partido, 'local') }} <span class="text-white/35">-</span> {{ marcador(partido, 'visita') }}</p>
                      <p v-else class="text-lg font-black uppercase tracking-[0.16em] text-white/30">VS</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-black text-white sm:text-base">{{ partido.rival || 'Rival por confirmar' }}</p>
                      <p class="mt-1 text-xs text-white/45">{{ partido.lugar || 'Lugar por confirmar' }}</p>
                    </div>
                  </div>

                  <div v-if="partido.nombre || partido.esConvocatoria" class="mt-4 border-t border-white/10 pt-3 text-xs text-white/55">
                    <span v-if="partido.nombre" class="font-bold text-white/75">{{ partido.nombre }}</span>
                    <span v-if="partido.nombre && partido.esConvocatoria"> · </span>
                    <span v-if="partido.esConvocatoria">Convocatoria oficial</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        </div>
      </div>

      <footer class="mt-12 border-t border-white/10 py-8 text-center">
        <p class="text-sm font-semibold text-white/55">No se trata solo de ganar. Se trata de seguir estando juntas.</p>
        <p class="mt-2 text-xs font-black uppercase tracking-[0.22em] text-primary">Formar · entrenar · avanzar</p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { escucharTodosEntrenamientos } from '../firebase/entrenamientos';

const partidos = ref([]);
const cargando = ref(true);
const error = ref(false);
const filtroActivo = ref('todos');
const serieActivaMobile = ref('serieB');
let unsubscribe = null;

const filtros = [
  { id: 'todos', label: 'Todos' },
  { id: 'jugados', label: 'Jugados' },
  { id: 'agenda', label: 'Agendados' }
];

const esPartido = (item) => ['partido', 'amistoso', 'liga', 'competencia', 'competición'].includes((item?.tipo || '').toString().trim().toLowerCase());
const esFinalizado = (item) => item?.estado === 'FINALIZADO' || item?.fasePartido === 'FINALIZADO';
const obtenerFecha = (valor) => {
  if (!valor) return null;
  if (typeof valor?.toDate === 'function') return valor.toDate();
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};
const obtenerEquipo = (item) => (item?.equipo || '').toString().trim().toLowerCase();
const obtenerMarcador = (item, lado) => lado === 'local'
  ? (item?.resultadoLocal ?? item?.golesLocal)
  : (item?.resultadoVisita ?? item?.golesVisita);
const tieneValorMarcador = (valor) => valor !== null && valor !== undefined && valor.toString().trim() !== '';
const esPartidoVisible = (item) => {
  const rival = (item?.rival || '').toString().trim();
  return esPartido(item)
    && rival.length > 0
    && tieneValorMarcador(obtenerMarcador(item, 'local'))
    && tieneValorMarcador(obtenerMarcador(item, 'visita'));
};

const partidosFiltrados = computed(() => partidos.value
  .filter(esPartidoVisible)
  .filter((item) => filtroActivo.value === 'todos' || (filtroActivo.value === 'jugados' ? esFinalizado(item) : !esFinalizado(item)))
  .sort((a, b) => {
    const fechaA = obtenerFecha(a.fecha)?.getTime() || 0;
    const fechaB = obtenerFecha(b.fecha)?.getTime() || 0;
    return fechaB - fechaA;
  }));

const series = computed(() => [
  {
    id: 'serieB',
    nombre: 'Serie B',
    kicker: 'Ascenso',
    partidos: partidosFiltrados.value.filter((item) => obtenerEquipo(item) === 'ascenso' || obtenerEquipo(item) === 'ambos')
  },
  {
    id: 'serieC',
    nombre: 'Serie C',
    kicker: 'Serie C',
    partidos: partidosFiltrados.value.filter((item) => obtenerEquipo(item) === 'seriec' || obtenerEquipo(item) === 'serie c')
  }
]);

const todosLosPartidos = computed(() => partidos.value.filter(esPartidoVisible));
const totalPartidos = computed(() => todosLosPartidos.value.length);
const partidosJugados = computed(() => todosLosPartidos.value.filter(esFinalizado).length);
const proximoPartido = computed(() => todosLosPartidos.value.filter((item) => !esFinalizado(item)).sort((a, b) => (obtenerFecha(a.fecha)?.getTime() || 0) - (obtenerFecha(b.fecha)?.getTime() || 0))[0]);

const tieneResultado = (partido) => tieneValorMarcador(obtenerMarcador(partido, 'local')) && tieneValorMarcador(obtenerMarcador(partido, 'visita'));
const marcador = (partido, lado) => {
  const valor = obtenerMarcador(partido, lado);
  return valor === '' || valor === null || valor === undefined ? '-' : valor;
};
const formatearFecha = (valor) => {
  const fecha = obtenerFecha(valor);
  if (!fecha) return 'Fecha por confirmar';
  return fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
};
const etiquetaEstado = (partido) => esFinalizado(partido) ? 'Finalizado' : partido?.estado === 'EN_CURSO' ? 'En curso' : 'Agendado';
const claseEstado = (partido) => esFinalizado(partido) ? 'bg-primary/15 text-primary' : partido?.estado === 'EN_CURSO' ? 'bg-secondary/15 text-secondary' : 'bg-white/10 text-white/60';
const etiquetaTipo = (tipo) => (tipo || 'partido').toString().toLowerCase() === 'partido' ? 'Liga Dobleve' : (tipo || 'competencia');

onMounted(() => {
  unsubscribe = escucharTodosEntrenamientos((datos) => {
    partidos.value = Array.isArray(datos) ? datos : [];
    cargando.value = false;
  });
  if (!unsubscribe) cargando.value = false;
});

onUnmounted(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
});
</script>

<style scoped>
@keyframes pulse-soft {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.animate-pulse {
  animation: pulse-soft 1.8s ease-in-out infinite;
}
</style>
