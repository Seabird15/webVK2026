<template>
  <section
    v-if="esAdmin"
    class="mx-auto max-w-6xl space-y-5 border-y border-amber-300/30 bg-[#171511] px-4 py-6 text-white sm:px-6"
    aria-labelledby="encuesta-vk-titulo"
  >
    <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex items-start gap-3">
        <div class="flex size-11 shrink-0 items-center justify-center border border-amber-300/40 bg-amber-300/10 text-amber-200">
          <TrophyIcon class="size-5" aria-hidden="true" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h2 id="encuesta-vk-titulo" class="text-base font-black uppercase tracking-wide sm:text-lg">Premio Jugadora VK</h2>
            <span class="border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="encuesta.finalizada ? 'border-emerald-300/40 text-emerald-200' : 'border-amber-300/40 text-amber-100'">
              {{ encuesta.finalizada ? 'Resultados publicados' : 'Votación abierta' }}
            </span>
          </div>
          <p class="mt-1 max-w-2xl text-sm leading-relaxed text-white/70">
            Resultados privados en vivo del reconocimiento a los valores del campeonato interno.
          </p>
        </div>
      </div>
      <div class="flex min-h-11 items-center gap-3 border border-white/10 px-4 py-2" aria-live="polite">
        <span v-if="!encuesta.finalizada" class="size-2 animate-pulse rounded-full bg-emerald-300" aria-hidden="true"></span>
        <span class="text-xs font-bold uppercase tracking-wide text-white/65">{{ encuesta.finalizada ? 'Total de votos' : 'En vivo' }}</span>
        <span class="text-xl font-black tabular-nums text-amber-200">{{ encuesta.resultados?.totalVotos || 0 }}</span>
      </div>
    </header>

    <p v-if="error" class="border border-red-300/40 bg-red-950/40 px-4 py-3 text-sm text-red-100" role="alert">
      {{ error }}
    </p>
    <div v-if="cargandoEstado && !encuesta.candidatas.length" class="py-8 text-center text-sm text-white/65" role="status">
      Cargando resultados...
    </div>

    <template v-else>
      <div v-if="encuesta.resultados?.candidatas?.length" class="space-y-4">
        <p v-if="encuesta.finalizada && ganadora" class="border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100" role="status">
          ¡Felicitaciones, {{ ganadora.nombre }}! Eres la ganadora del Premio Jugadora VK.
        </p>
        <ol class="space-y-4" aria-label="Resultados de la votación">
          <li v-for="(resultado, indice) in resultadosVisibles" :key="resultado.id">
            <div class="mb-1 flex items-center justify-between gap-3 text-sm">
              <span class="font-semibold"><span class="mr-2 text-amber-200">{{ indice + 1 }}.</span>{{ resultado.nombre }}</span>
              <span class="shrink-0 tabular-nums text-white/75">{{ resultado.votos }} · {{ porcentaje(resultado.votos) }}%</span>
            </div>
            <div class="h-2 overflow-hidden bg-white/10" role="progressbar" :aria-label="`Votos de ${resultado.nombre}`" :aria-valuenow="resultado.votos" :aria-valuemin="0" :aria-valuemax="encuesta.resultados.totalVotos || 0">
              <div class="h-full bg-amber-300 transition-[width] duration-300" :style="{ width: `${porcentaje(resultado.votos)}%` }"></div>
            </div>
          </li>
        </ol>
      </div>
      <p v-else-if="!cargandoEstado" class="border border-white/10 px-4 py-5 text-sm text-white/65">
        Aún no hay candidatas o votos registrados.
      </p>

      <div v-if="!encuesta.finalizada" class="border-t border-white/10 pt-4">
        <p class="mb-3 text-xs leading-relaxed text-white/55">Al finalizar, los resultados quedarán visibles para todas las jugadoras y la votación no podrá reabrirse.</p>
        <div v-if="confirmandoCierre" class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" class="min-h-11 border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10" @click="confirmandoCierre = false">Seguir votando</button>
          <button type="button" class="min-h-11 bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50" :disabled="finalizando" @click="cerrarEncuesta">{{ finalizando ? 'Finalizando...' : 'Confirmar cierre y publicar' }}</button>
        </div>
        <button v-else type="button" class="min-h-11 border border-red-300/50 px-4 py-2 text-sm font-bold text-red-100 transition-colors hover:bg-red-950/50" @click="confirmandoCierre = true">Finalizar y publicar resultados</button>
      </div>
    </template>
  </section>

  <section
    v-else
    class="mx-auto mt-3 max-w-6xl px-4 sm:mt-4 sm:px-6"
    aria-labelledby="encuesta-vk-titulo"
  >
    <div class="flex flex-col gap-4 border-y border-amber-300/30 bg-[#171511] px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div class="flex items-start gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center border border-amber-300/40 bg-amber-300/10 text-amber-200">
          <TrophyIcon class="size-5" aria-hidden="true" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h2 id="encuesta-vk-titulo" class="text-sm font-black uppercase tracking-wide sm:text-base">Premio Jugadora VK</h2>
            <span class="border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="encuesta.finalizada ? 'border-emerald-300/40 text-emerald-200' : 'border-amber-300/40 text-amber-100'">
              {{ encuesta.finalizada ? 'Resultados publicados' : 'Votación abierta' }}
            </span>
          </div>
          <p class="mt-1 max-w-2xl text-xs leading-relaxed text-white/70 sm:text-sm">
            Reconozcamos a quien representó el apañe, la motivación, la empatía, buena onda y sana competencia durante el campeonato interino.
          </p>
          <p v-if="encuesta.finalizada" class="mt-2 text-xs font-semibold text-emerald-200 sm:text-sm" role="status">
            La votación se cerró. Ya puedes ver los resultados oficiales.
          </p>
          <p v-else-if="encuesta.hasVoted" class="mt-2 text-xs font-semibold text-emerald-200 sm:text-sm" role="status">
            Ya emitiste tu voto. Gracias por participar.
          </p>
        </div>
      </div>
      <button
        v-if="!encuesta.hasVoted || encuesta.finalizada"
        type="button"
        class="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-amber-300 bg-amber-300 px-4 py-2 text-sm font-black text-[#171511] transition-colors hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        @click="abrirModal"
      >
        <span>{{ textoAccion }}</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="encuesta-modal">
      <div
        v-if="modalAbierta && !esAdmin"
        class="fixed inset-0 z-100 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
        @click.self="cerrarModal"
        @keydown.esc.stop.prevent="cerrarModal"
      >
        <section
          class="max-h-[92dvh] w-full max-w-xl overflow-y-auto border border-amber-300/30 bg-[#171511] text-white shadow-2xl sm:max-h-[85dvh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="encuesta-modal-titulo"
        >
          <header class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
            <div>
              <p class="text-[11px] font-black uppercase tracking-[0.16em] text-amber-200">Campeonato interno</p>
              <h2 id="encuesta-modal-titulo" class="mt-1 text-xl font-black sm:text-2xl">Elige a la Jugadora VK</h2>
              <p class="mt-2 text-sm leading-relaxed text-white/65">Un voto por cuenta. Tu elección es anónima.</p>
            </div>
            <button
              type="button"
              class="flex size-11 shrink-0 items-center justify-center text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              aria-label="Cerrar encuesta"
              @click="cerrarModal"
            >
              <XMarkIcon class="size-5" aria-hidden="true" />
            </button>
          </header>

          <div class="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
            <p v-if="error" class="border border-red-300/40 bg-red-950/40 px-4 py-3 text-sm text-red-100" role="alert">
              {{ error }}
            </p>

            <div v-if="cargandoEstado && !encuesta.candidatas.length" class="py-10 text-center text-sm text-white/65" role="status">
              Cargando encuesta...
            </div>

            <template v-else>
              <div v-if="esAdmin" class="flex items-center justify-between border-l-2 border-amber-300 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
                <span>Vista de administración</span>
                <span v-if="!encuesta.finalizada" class="inline-flex items-center gap-2">
                  <span class="size-2 animate-pulse rounded-full bg-emerald-300" aria-hidden="true"></span>
                  En vivo
                </span>
              </div>

              <div v-if="puedeVotar && !encuesta.finalizada && !encuesta.hasVoted" class="space-y-3">
                <p class="text-sm text-white/75">¿Quién encarnó estos valores transversalmente durante el campeonato?</p>
                <fieldset class="space-y-2">
                  <legend class="sr-only">Selecciona una jugadora</legend>
                  <section v-for="equipo in candidatasPorEquipo" :key="equipo.id" class="border border-white/10 p-3">
                    <h3 class="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-white/75">
                      <span class="size-2.5 rounded-full" :style="{ backgroundColor: equipo.color }" aria-hidden="true"></span>
                      {{ equipo.nombre }}
                    </h3>
                    <div class="space-y-2">
                      <label
                        v-for="candidata in equipo.candidatas"
                        :key="candidata.id"
                        class="flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 transition-colors"
                        :class="candidataSeleccionada === candidata.id ? 'border-amber-200 bg-amber-300/10' : 'border-white/10 bg-white/3 hover:border-white/30'"
                      >
                        <input
                          v-model="candidataSeleccionada"
                          class="size-4 accent-amber-300"
                          type="radio"
                          name="candidata-vk"
                          :value="candidata.id"
                          :disabled="enviandoVoto"
                        />
                        <span class="text-sm font-semibold">{{ candidata.nombre }}</span>
                      </label>
                    </div>
                  </section>
                </fieldset>
                <button
                  type="button"
                  class="min-h-11 w-full bg-amber-300 px-4 py-3 text-sm font-black text-[#171511] transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!candidataSeleccionada || enviandoVoto"
                  @click="emitirVoto"
                >
                  {{ enviandoVoto ? 'Registrando voto...' : 'Confirmar voto' }}
                </button>
              </div>

              <div v-else-if="puedeVotar && encuesta.hasVoted && !encuesta.finalizada" class="border border-emerald-300/30 bg-emerald-950/30 px-4 py-5 text-center">
                <CheckCircleIcon class="mx-auto size-8 text-emerald-200" aria-hidden="true" />
                <p class="mt-2 font-bold">Tu voto quedó registrado</p>
                <p class="mt-1 text-sm text-white/65">Los resultados se publicarán cuando administración cierre la votación.</p>
              </div>

              <div v-if="encuesta.finalizada || (esAdmin && encuesta.resultados)" class="space-y-4">
                <div class="flex items-end justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 class="font-black">{{ encuesta.finalizada ? 'Resultados publicados' : 'Resultados en tiempo real' }}</h3>
                    <p class="mt-1 text-xs text-white/60">{{ encuesta.resultados?.totalVotos || 0 }} votos</p>
                  </div>
                  <LockClosedIcon v-if="!encuesta.finalizada && esAdmin" class="mb-1 size-4 text-amber-200" aria-label="Resultados privados" />
                </div>
                <p v-if="encuesta.finalizada && ganadora" class="border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100" role="status">
                  ¡Felicitaciones, {{ ganadora.nombre }}! Eres la ganadora del Premio Jugadora VK.
                </p>
                <ol class="space-y-4">
                  <li v-for="(resultado, indice) in resultadosVisibles" :key="resultado.id">
                    <div class="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span class="font-semibold">{{ indice + 1 }}. {{ resultado.nombre }}</span>
                      <span class="shrink-0 tabular-nums text-white/70">{{ resultado.votos }} ({{ porcentaje(resultado.votos) }}%)</span>
                    </div>
                    <div class="h-2 overflow-hidden bg-white/10" role="progressbar" :aria-label="`Votos de ${resultado.nombre}`" :aria-valuenow="resultado.votos" :aria-valuemin="0" :aria-valuemax="encuesta.resultados?.totalVotos || 0">
                      <div class="h-full bg-amber-300 transition-[width] duration-300" :style="{ width: `${porcentaje(resultado.votos)}%` }"></div>
                    </div>
                  </li>
                </ol>
              </div>

              <div v-if="puedeVotar && encuesta.finalizada && !encuesta.hasVoted" class="border border-white/10 bg-white/3 px-4 py-3 text-sm text-white/70">
                 La votación ya cerró. Estos son los resultados oficiales.
              </div>

              <div v-if="esAdmin && !encuesta.finalizada" class="border-t border-white/10 pt-4">
                <p class="mb-3 text-xs leading-relaxed text-white/55">Al finalizar, los resultados quedarán visibles para todas las jugadoras y la votación no podrá reabrirse.</p>
                <div v-if="confirmandoCierre" class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button type="button" class="min-h-11 border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10" @click="confirmandoCierre = false">Seguir votando</button>
                  <button type="button" class="min-h-11 bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50" :disabled="finalizando" @click="cerrarEncuesta">{{ finalizando ? 'Finalizando...' : 'Confirmar cierre y publicar' }}</button>
                </div>
                <button v-else type="button" class="min-h-11 border border-red-300/50 px-4 py-2 text-sm font-bold text-red-100 transition-colors hover:bg-red-950/50" @click="confirmandoCierre = true">Finalizar y publicar resultados</button>
              </div>
            </template>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { CheckCircleIcon, LockClosedIcon, TrophyIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { finalizarEncuestaVK, obtenerEstadoEncuestaVK, votarJugadoraVK } from '../firebase/encuestaJugadoraVK';
import { EQUIPOS_CAMPEONATO, NOMINAS_INICIALES } from '../firebase/campeonatoInterno2';

const props = defineProps({
  esAdmin: { type: Boolean, default: false },
  puedeVotar: { type: Boolean, default: false }
});

const encuesta = ref({ finalizada: false, candidatas: [], hasVoted: false, resultados: null });
const resultadosVisibles = computed(() => {
  const candidatas = encuesta.value.resultados?.candidatas || [];
  return encuesta.value.finalizada ? candidatas.slice(0, 5) : candidatas;
});
const ganadora = computed(() => resultadosVisibles.value[0] || null);
const modalAbierta = ref(false);
const cargandoEstado = ref(false);
const enviandoVoto = ref(false);
const finalizando = ref(false);
const candidataSeleccionada = ref('');
const confirmandoCierre = ref(false);
const error = ref('');
let intervaloResultados = null;

const textoAccion = computed(() => {
  if (props.esAdmin) return 'Administrar encuesta';
  if (encuesta.value.finalizada) return 'Ver resultados';
  return 'Votar ahora';
});

const normalizarNombreCandidata = (nombre = '') => nombre
  .toString()
  .trim()
  .replace(/\s*\(C\)$/i, '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ')
  .toLowerCase();

const candidatasPorEquipo = computed(() => EQUIPOS_CAMPEONATO
  .map((equipo) => {
    const candidatasDisponibles = new Map(
      encuesta.value.candidatas.map((candidata) => [normalizarNombreCandidata(candidata.nombre), candidata])
    );
    const nombresVistos = new Set();
    const candidatas = (NOMINAS_INICIALES[equipo.id] || [])
      .map((nombre) => candidatasDisponibles.get(normalizarNombreCandidata(nombre)))
      .filter((candidata) => {
        if (!candidata || nombresVistos.has(candidata.id)) return false;
        nombresVistos.add(candidata.id);
        return true;
      });

    return { ...equipo, candidatas };
  })
  .filter((equipo) => equipo.candidatas.length > 0));

const cargarEstado = async () => {
  if (cargandoEstado.value) return;
  cargandoEstado.value = true;
  try {
    encuesta.value = await obtenerEstadoEncuestaVK();
    error.value = '';
  } catch (err) {
    console.error('Error cargando encuesta Jugadora VK:', err);
    const codigoError = (err?.code || '').replace(/^functions\//, '');
    error.value = codigoError === 'unauthenticated'
      ? 'Tu sesión no fue reconocida. Cierra sesión, vuelve a entrar y reintenta.'
      : codigoError === 'permission-denied'
        ? 'Tu cuenta no tiene permisos de administración para consultar esta encuesta.'
        : `No se pudo cargar la encuesta${codigoError ? ` (${codigoError})` : ''}. ${err?.message || 'Revisa tu conexión e inténtalo nuevamente.'}`;
  } finally {
    cargandoEstado.value = false;
  }
};

const abrirModal = async () => {
  modalAbierta.value = true;
  await cargarEstado();
};

const cerrarModal = () => {
  modalAbierta.value = false;
  confirmandoCierre.value = false;
  if (intervaloResultados) {
    window.clearInterval(intervaloResultados);
    intervaloResultados = null;
  }
};

const emitirVoto = async () => {
  if (!candidataSeleccionada.value || enviandoVoto.value) return;
  enviandoVoto.value = true;
  error.value = '';
  try {
    await votarJugadoraVK(candidataSeleccionada.value);
    await cargarEstado();
  } catch (err) {
    error.value = err.code === 'functions/already-exists'
      ? 'Ya registramos un voto de esta cuenta.'
      : err.code === 'functions/failed-precondition'
        ? 'La votación ya finalizó.'
        : 'No se pudo registrar tu voto. Inténtalo nuevamente.';
    await cargarEstado();
  } finally {
    enviandoVoto.value = false;
  }
};

const cerrarEncuesta = async () => {
  if (finalizando.value) return;
  finalizando.value = true;
  error.value = '';
  try {
    await finalizarEncuestaVK();
    confirmandoCierre.value = false;
    await cargarEstado();
    if (intervaloResultados) {
      window.clearInterval(intervaloResultados);
      intervaloResultados = null;
    }
  } catch (err) {
    error.value = 'No se pudo finalizar la encuesta. Inténtalo nuevamente.';
  } finally {
    finalizando.value = false;
  }
};

const porcentaje = (votos) => {
  const total = encuesta.value.resultados?.totalVotos || 0;
  return total ? Math.round((votos / total) * 100) : 0;
};

onMounted(async () => {
  await cargarEstado();
  if (props.esAdmin && !encuesta.value.finalizada) {
    intervaloResultados = window.setInterval(cargarEstado, 4000);
  }
});
onUnmounted(cerrarModal);
</script>

<style scoped>
.encuesta-modal-enter-active,
.encuesta-modal-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.encuesta-modal-enter-from,
.encuesta-modal-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .encuesta-modal-enter-active,
  .encuesta-modal-leave-active {
    transition: none;
  }
}
</style>