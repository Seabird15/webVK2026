<template>
  <section v-if="sesionesPendientes.length" class="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
    <button
      type="button"
      class="flex min-h-11 w-full cursor-pointer items-start justify-between gap-4 text-left"
      :aria-expanded="expandido"
      @click="expandido = !expandido"
    >
      <span>
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-lg font-black text-gray-900">Sensaciones post-entrenamiento</span>
          <span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">{{ sesionesPendientes.length }} pendiente{{ sesionesPendientes.length === 1 ? '' : 's' }}</span>
        </span>
        <span class="mt-1 block text-sm text-gray-500">Cuestionario breve, disponible hasta 48 horas después de cada sesión.</span>
      </span>
      <ChevronDownIcon class="mt-1 size-5 shrink-0 text-gray-500 transition-transform" :class="expandido ? 'rotate-180' : ''" />
    </button>

    <div v-if="expandido" class="mt-5 space-y-4">
      <p v-if="cargando" class="py-4 text-center text-sm text-gray-500">Cargando cuestionario...</p>
      <template v-else>
        <div class="flex flex-wrap gap-2" aria-label="Entrenamientos pendientes">
          <button
            v-for="sesion in sesionesPendientes"
            :key="sesion.id"
            type="button"
            class="min-h-11 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-bold transition focus:outline-hidden focus:ring-2 focus:ring-primary"
            :class="sesionSeleccionada?.id === sesion.id ? 'border-primary bg-emerald-50 text-primary-dark' : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'"
            @click="seleccionarSesion(sesion)"
          >
              {{ etiquetaFechaSesion(sesion) }}
          </button>
        </div>

        <div v-if="sesionSeleccionada" class="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4 sm:p-5">
          <div class="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-[11px] font-black uppercase tracking-[0.18em] text-primary/75">Seguimiento de sesión</p>
              <h3 class="mt-1 text-lg font-black text-gray-900">{{ etiquetaFechaSesion(sesionSeleccionada) }}</h3>
              <p class="mt-1 text-sm text-gray-500">Disponible hasta {{ fechaLimite }}</p>
            </div>
          </div>

          <div v-if="preguntasActivas.length" class="mt-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div class="mb-4 flex items-center justify-between gap-3">
              <p class="text-xs font-black uppercase tracking-wide text-primary-dark">Pregunta {{ slideActual + 1 }} de {{ preguntasActivas.length }}</p>
              <div class="flex gap-1.5" aria-hidden="true">
                <span v-for="(_, index) in preguntasActivas" :key="`step-${index}`" class="h-2 rounded-full transition-all" :class="index === slideActual ? 'w-6 bg-primary' : 'w-2 bg-gray-300'"></span>
              </div>
            </div>

            <Transition name="question-slide" mode="out-in">
              <fieldset :key="preguntaActual?.id" class="min-h-40">
                <legend class="max-w-full text-base font-black text-gray-900 sm:text-lg">{{ preguntaActual?.label }}</legend>

                <template v-if="preguntaActual?.tipo === 'scale'">
                  <div class="mt-5 flex items-center justify-between gap-3">
                    <span class="text-xs text-gray-500">{{ preguntaActual.minimo ?? 0 }}</span>
                    <span class="rounded-md bg-amber-100 px-3 py-1.5 text-base font-black text-amber-950">{{ formAnswers[preguntaActual.id] }}/{{ preguntaActual.maximo ?? 10 }}</span>
                    <span class="text-xs text-gray-500">{{ preguntaActual.maximo ?? 10 }}</span>
                  </div>
                  <input
                    v-model.number="formAnswers[preguntaActual.id]"
                    type="range"
                    :min="preguntaActual.minimo ?? 0"
                    :max="preguntaActual.maximo ?? 10"
                    class="mt-2 min-h-12 w-full cursor-pointer accent-emerald-700"
                  />
                  <p class="text-xs text-gray-500">{{ preguntaActual.ayuda || '0 indica una sensación baja; el valor máximo, una sensación alta.' }}</p>
                </template>

                <div v-else-if="preguntaActual?.tipo === 'yesNo' || preguntaActual?.tipo === 'periodo'" class="mt-5 flex flex-wrap gap-2">
                  <template v-if="preguntaActual?.tipo === 'periodo'">
                    <label v-for="opcion in opcionesPeriodo" :key="String(opcion.valor)" class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-4" :class="formAnswers[preguntaActual.id] === opcion.valor ? 'border-primary bg-emerald-50 text-primary-dark' : 'border-gray-200 text-gray-700'">
                      <input v-model="formAnswers[preguntaActual.id]" type="radio" :name="`respuesta-${preguntaActual.id}`" :value="opcion.valor" class="cursor-pointer accent-emerald-700" />
                      <span class="text-sm font-bold">{{ opcion.label }}</span>
                    </label>
                  </template>
                  <template v-else>
                  <label v-for="opcion in [false, true]" :key="String(opcion)" class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-4" :class="formAnswers[preguntaActual.id] === opcion ? 'border-primary bg-emerald-50 text-primary-dark' : 'border-gray-200 text-gray-700'">
                    <input v-model="formAnswers[preguntaActual.id]" type="radio" :name="`respuesta-${preguntaActual.id}`" :value="opcion" class="cursor-pointer accent-emerald-700" />
                    <span class="text-sm font-bold">{{ opcion ? 'Sí' : 'No' }}</span>
                  </label>
                  </template>
                </div>

                <textarea
                  v-else
                  v-model.trim="formAnswers[preguntaActual.id]"
                  rows="3"
                  maxlength="300"
                  class="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  placeholder="Opcional"
                ></textarea>

                <fieldset v-if="preguntaActual?.id === 'molestias' && formAnswers.molestias === true" class="mt-4 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <legend class="px-1 text-sm font-black text-gray-900">Detalle de la molestia</legend>
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="text-sm font-bold text-gray-800">
                Zona corporal
                <select v-model="formAnswers.zonaMolestia" required class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30">
                  <option value="">Selecciona una zona</option>
                  <option v-for="zona in zonasCorporales" :key="zona" :value="zona">{{ zona }}</option>
                  <option value="otra">Otra</option>
                </select>
              </label>
              <label v-if="formAnswers.zonaMolestia === 'otra'" class="text-sm font-bold text-gray-800">
                Especifica la zona
                <input v-model.trim="formAnswers.zonaPersonalizada" required maxlength="80" class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 px-3 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30" />
              </label>
              <label class="text-sm font-bold text-gray-800">
                Intensidad (0–10)
                <input v-model.number="formAnswers.intensidadMolestia" type="range" min="0" max="10" class="mt-1 min-h-11 w-full accent-rose-600" />
                <span class="text-xs font-semibold text-gray-600">{{ formAnswers.intensidadMolestia }}/10</span>
              </label>
              <label class="text-sm font-bold text-gray-800">
                Momento de aparición
                <select v-model="formAnswers.momentoMolestia" class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30">
                  <option value="">Sin especificar</option>
                  <option value="durante">Durante el entrenamiento</option>
                  <option value="despues">Después del entrenamiento</option>
                  <option value="ambos">Durante y después</option>
                </select>
              </label>
            </div>
            <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <label class="flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-700"><input v-model="formAnswers.continuaMolestia" type="checkbox" class="size-4 accent-rose-600" /> Continúa ahora</label>
              <label class="flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-700"><input v-model="formAnswers.limitaMovimiento" type="checkbox" class="size-4 accent-rose-600" /> Limita algún movimiento</label>
            </div>
            <p v-if="formAnswers.intensidadMolestia >= 8 || formAnswers.limitaMovimiento" class="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              Esta señal merece seguimiento del cuerpo técnico. El formulario no realiza diagnósticos; considera buscar una evaluación profesional si te preocupa o empeora.
            </p>
                </fieldset>

                <label v-if="esUltimaPregunta" class="mt-4 block text-sm font-bold text-gray-800">
                  Comentario adicional <span class="font-normal text-gray-500">(opcional)</span>
                  <textarea v-model.trim="formAnswers.comentario" rows="2" maxlength="500" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30" placeholder="Algo más que quieras compartir con el staff"></textarea>
                </label>
              </fieldset>
            </Transition>
          </div>

          <p v-if="error" role="alert" class="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{{ error }}</p>
          <div class="mt-4 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs text-gray-500">Las respuestas ayudan al staff a seguir la carga y recuperación, no son un diagnóstico.</p>
            <div class="flex shrink-0 gap-2">
              <button v-if="slideActual > 0" type="button" class="min-h-11 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-primary" @click="retrocederPregunta">Anterior</button>
              <button v-if="!esUltimaPregunta" type="button" :disabled="!preguntaActualCompleta" class="min-h-11 cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-black text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50" @click="avanzarPregunta">Siguiente</button>
              <button v-else type="button" :disabled="guardando || !preguntasCompletas" class="min-h-11 cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-black text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50" @click="enviarRespuesta">
                {{ guardando ? 'Guardando...' : 'Enviar respuesta' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import {
  guardarRespuestaPostEntrenamiento,
  obtenerConfiguracionSeguimiento,
  obtenerRespuestasPostEntrenamientoJugadora,
  PREGUNTAS_SEGUIMIENTO_DEFAULT
} from '../firebase/seguimientoEntrenamientos';
import { obtenerEstadoPeriodoSemanal, guardarEstadoPeriodoSemanal } from '../firebase/saludSemanal';

const props = defineProps({
  entrenamientos: { type: Array, default: () => [] },
  equipo: { type: String, default: '' },
  jugadoraId: { type: String, required: true },
  jugadoraNombre: { type: String, default: '' }
});

const VENTANA_MS = 48 * 60 * 60 * 1000;
const zonasCorporales = ['Muslo', 'Rodilla', 'Tobillo', 'Cadera', 'Pantorrilla', 'Pie', 'Espalda', 'Hombro'];
const expandido = ref(false);
const cargando = ref(true);
const guardando = ref(false);
const error = ref('');
const ahora = ref(Date.now());
const preguntas = ref(PREGUNTAS_SEGUIMIENTO_DEFAULT.map((pregunta) => ({ ...pregunta })));
const respuestasRegistradas = ref(new Set());
const periodoRespondido = ref(false);
const tiposHabilitados = ref(['entrenamiento']);
const equiposHabilitados = ref(['ascenso', 'escuela', 'serieC']);
const sesionSeleccionada = ref(null);
const formAnswers = reactive({});
const slideActual = ref(0);
const opcionesPeriodo = [
  { valor: true, label: 'Sí' },
  { valor: false, label: 'No' },
  { valor: null, label: 'Prefiero no informar' }
];
let reloj = null;

const preguntasActivas = computed(() => {
  const activas = preguntas.value.filter((pregunta) => pregunta.activo !== false);
  if (!periodoRespondido.value) {
    activas.push({
      id: 'enPeriodo',
      label: '¿Estás en tu período esta semana?',
      tipo: 'periodo',
      activo: true,
      ayuda: 'Este dato se pregunta una vez por semana y ayuda a contextualizar la recuperación.'
    });
  }
  return activas;
});
const preguntaActual = computed(() => preguntasActivas.value[slideActual.value] || null);
const esUltimaPregunta = computed(() => slideActual.value >= preguntasActivas.value.length - 1);
const leerFecha = (valor) => {
  if (valor?.toDate) return valor.toDate();
  if (valor?.seconds) return new Date(valor.seconds * 1000);
  if (valor instanceof Date) return new Date(valor);
  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [anio, mes, dia] = valor.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const obtenerInicioSesion = (sesion) => {
  const fecha = leerFecha(sesion?.fecha);
  if (!fecha) return null;
  const hora = (sesion?.hora || '').toString().trim();
  const [horas, minutos] = (hora.split('-')[0] || '00:00').trim().split(':').map(Number);
  fecha.setHours(Number.isFinite(horas) ? horas : 0, Number.isFinite(minutos) ? minutos : 0, 0, 0);
  return fecha.getTime();
};

const etiquetaFechaSesion = (sesion) => {
  const fecha = leerFecha(sesion?.fecha);
  if (!fecha) return 'Fecha de entrenamiento';
  return new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'short' })
    .format(fecha)
    .replace(',', '')
    .replace('.', '')
    .replace(/^./, (letra) => letra.toLocaleUpperCase('es-CL'));
};

const normalizarEquipo = (equipo) => {
  const valor = (equipo || '').toString().trim().toLowerCase();
  if (valor === 'seriec') return 'serieC';
  return valor;
};

const equipoHabilitado = (sesion) => {
  if (!equiposHabilitados.value.length) return false;
  const equipoEvento = normalizarEquipo(sesion.equipo);
  const equipoVista = normalizarEquipo(props.equipo);
  if (equipoEvento === 'ambos') {
    return equipoVista === 'ambos'
      ? equiposHabilitados.value.length > 0
      : equiposHabilitados.value.includes(equipoVista);
  }
  if (equipoVista === 'ambos') return equiposHabilitados.value.includes(equipoEvento);
  return equipoEvento === equipoVista && equiposHabilitados.value.includes(equipoEvento);
};

const sesionesPendientes = computed(() => props.entrenamientos
  .filter((sesion) => {
    const tipo = (sesion.tipo || '').toString().toLowerCase();
    const inicio = obtenerInicioSesion(sesion);
    return !sesion.eventoInformativo
      && tiposHabilitados.value.includes(tipo)
      && equipoHabilitado(sesion)
      && inicio !== null
      && ahora.value >= inicio
      && ahora.value <= inicio + VENTANA_MS
      && !respuestasRegistradas.value.has(sesion.id);
  })
  .sort((a, b) => (obtenerInicioSesion(b) || 0) - (obtenerInicioSesion(a) || 0)));

const fechaLimite = computed(() => {
  const inicio = obtenerInicioSesion(sesionSeleccionada.value);
  return inicio ? new Date(inicio + VENTANA_MS).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
});

const preguntasCompletas = computed(() => preguntasActivas.value.every((pregunta) => {
  const valor = formAnswers[pregunta.id];
  return pregunta.tipo === 'text'
    || (pregunta.tipo === 'periodo' && opcionesPeriodo.some((opcion) => opcion.valor === valor))
    || (valor !== null && valor !== undefined && valor !== '');
}) && (formAnswers.molestias !== true || (formAnswers.zonaMolestia && (formAnswers.zonaMolestia !== 'otra' || formAnswers.zonaPersonalizada?.trim()))));

const preguntaActualCompleta = computed(() => {
  const pregunta = preguntaActual.value;
  if (!pregunta) return false;
  const valor = formAnswers[pregunta.id];
  if (pregunta.tipo === 'periodo') return opcionesPeriodo.some((opcion) => opcion.valor === valor);
  if (pregunta.tipo !== 'text' && (valor === null || valor === undefined || valor === '')) return false;
  if (pregunta.id === 'molestias' && valor === true) {
    return Boolean(formAnswers.zonaMolestia && (formAnswers.zonaMolestia !== 'otra' || formAnswers.zonaPersonalizada?.trim()));
  }
  return true;
});

const cargarConfiguracion = async () => {
  try {
    const configuracion = await obtenerConfiguracionSeguimiento();
    if (configuracion.preguntas.length) preguntas.value = configuracion.preguntas;
    tiposHabilitados.value = configuracion.tiposHabilitados;
    equiposHabilitados.value = configuracion.equiposHabilitados;
  } catch {
    preguntas.value = PREGUNTAS_SEGUIMIENTO_DEFAULT.map((pregunta) => ({ ...pregunta }));
  }
};

const cargarRespuestas = async (jugadoraId) => {
  cargando.value = true;
  respuestasRegistradas.value = new Set();
  try {
    const [respuestas, estadoPeriodo] = await Promise.all([
      obtenerRespuestasPostEntrenamientoJugadora(jugadorId),
      obtenerEstadoPeriodoSemanal(jugadorId)
    ]);
    respuestasRegistradas.value = new Set(respuestas.map((respuesta) => respuesta.entrenamientoId));
    periodoRespondido.value = estadoPeriodo !== null;
  } catch (err) {
    error.value = err?.message || 'No se pudieron cargar tus seguimientos.';
  } finally {
    cargando.value = false;
  }
};

const seleccionarSesion = (sesion) => {
  sesionSeleccionada.value = sesion;
  slideActual.value = 0;
  for (const clave of Object.keys(formAnswers)) delete formAnswers[clave];
  preguntasActivas.value.forEach((pregunta) => {
    formAnswers[pregunta.id] = pregunta.tipo === 'scale'
      ? Math.max(Number(pregunta.minimo ?? 0), 0)
      : pregunta.tipo === 'yesNo' || pregunta.tipo === 'periodo'
        ? null
        : '';
  });
  Object.assign(formAnswers, {
    intensidadMolestia: 0,
    zonaMolestia: '',
    zonaPersonalizada: '',
    momentoMolestia: '',
    continuaMolestia: false,
    limitaMovimiento: false,
    comentario: ''
  });
  error.value = '';
};

const avanzarPregunta = () => {
  if (!preguntaActualCompleta.value || esUltimaPregunta.value) return;
  slideActual.value++;
};

const retrocederPregunta = () => {
  slideActual.value = Math.max(0, slideActual.value - 1);
};

const enviarRespuesta = async () => {
  if (!sesionSeleccionada.value || !preguntasCompletas.value || guardando.value) return;
  const inicioSesion = obtenerInicioSesion(sesionSeleccionada.value);
  if (inicioSesion === null || Date.now() < inicioSesion || Date.now() > inicioSesion + VENTANA_MS) {
    error.value = 'El plazo de respuesta para esta sesión ya finalizó.';
    return;
  }

  guardando.value = true;
  error.value = '';
  try {
    const molestiaPregunta = preguntasActivas.value.find((pregunta) => pregunta.id === 'molestias');
    const valorZona = formAnswers.zonaMolestia === 'otra' ? formAnswers.zonaPersonalizada.trim() : formAnswers.zonaMolestia;
    await guardarRespuestaPostEntrenamiento({
      entrenamiento: {
        ...sesionSeleccionada.value,
        nombre: etiquetaFechaSesion(sesionSeleccionada.value)
      },
      jugadoraId: props.jugadoraId,
      jugadoraNombre: props.jugadoraNombre,
      preguntas: preguntasActivas.value,
      respuestas: {
        ...formAnswers,
        molestias: molestiaPregunta ? formAnswers.molestias === true : false,
        zonaMolestia: valorZona,
        comentario: formAnswers.comentario
      }
    });
    if (!periodoRespondido.value && Object.prototype.hasOwnProperty.call(formAnswers, 'enPeriodo')) {
      await guardarEstadoPeriodoSemanal({
        jugadoraId: props.jugadoraId,
        jugadoraNombre: props.jugadoraNombre,
        equipo: sesionSeleccionada.value.equipo,
        enPeriodo: formAnswers.enPeriodo
      });
      periodoRespondido.value = true;
    }
    respuestasRegistradas.value = new Set([...respuestasRegistradas.value, sesionSeleccionada.value.id]);
    sesionSeleccionada.value = null;
  } catch (err) {
    error.value = err?.message || 'No se pudo enviar la respuesta. Inténtalo nuevamente.';
  } finally {
    guardando.value = false;
  }
};

watch(() => props.jugadoraId, cargarRespuestas, { immediate: true });
onMounted(async () => {
  await cargarConfiguracion();
  reloj = window.setInterval(() => { ahora.value = Date.now(); }, 15_000);
});
onUnmounted(() => { if (reloj) window.clearInterval(reloj); });
</script>

<style scoped>
.question-slide-enter-active,
.question-slide-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.question-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.question-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .question-slide-enter-active,
  .question-slide-leave-active {
    transition: none;
  }
}
</style>
