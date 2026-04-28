<template>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-6">
    <button
      type="button"
      @click="expandido = !expandido"
      class="w-full flex items-start justify-between gap-3 text-left cursor-pointer"
    >
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-lg sm:text-xl font-black text-gray-900">Estado de salud semanal</h3>
          <span class="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{{ semanaClave }}</span>
          <span
            class="text-xs font-bold px-2.5 py-1 rounded-full"
            :class="yaRespondido ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
          >
            {{ yaRespondido ? 'Respondido' : 'Pendiente' }}
          </span>
          <span v-if="!yaRespondido" class="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">Recordatorio activo</span>
        </div>
        <p class="text-sm text-gray-500 mt-1">Chequeo breve para ajustar carga y prevenir lesiones</p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <div v-if="yaRespondido && !isLoading" class="hidden sm:block text-right text-xs text-gray-500">
          <p>Dolor {{ form.dolor }}/5</p>
          <p>Fatiga {{ form.fatiga }}/5</p>
          <p v-if="fechaRespuestaTexto">Respondido {{ fechaRespuestaTexto }}</p>
        </div>
        <span class="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-transform" :class="expandido ? 'rotate-180' : ''">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </button>

    <div v-if="isLoading && expandido" class="py-6 text-center text-gray-500 text-sm">Cargando cuestionario...</div>

    <div v-else-if="expandido" class="space-y-5 mt-4">
      <div v-if="!yaRespondido" class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-black text-amber-900">Tienes este chequeo semanal pendiente</p>
        <p class="text-sm text-amber-800 mt-1">Solo se puede responder una vez por semana.</p>
      </div>

      <div v-else-if="fechaRespuestaTexto" class="rounded-2xl border border-green-200 bg-green-50 p-4">
        <p class="text-sm font-black text-green-900">Respuesta registrada</p>
        <p class="text-sm text-green-800 mt-1">Contestaste este chequeo el {{ fechaRespuestaTexto }}.</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4 sm:p-5 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[11px] font-black uppercase tracking-[0.22em] text-primary/75">Paso {{ slideActual + 1 }} de {{ totalSlides }}</p>
            <h4 class="mt-1 text-base font-black text-gray-900 sm:text-lg">{{ slideActualMeta.titulo }}</h4>
            <p class="mt-1 text-xs sm:text-sm text-gray-500">{{ slideActualMeta.descripcion }}</p>
          </div>
          <div class="flex items-center gap-1.5">
            <span
              v-for="(_, index) in slideSteps"
              :key="`slide-dot-${index}`"
              class="h-2.5 rounded-full transition-all duration-200"
              :class="index === slideActual ? 'w-7 bg-primary' : 'w-2.5 bg-gray-300'"
            ></span>
          </div>
        </div>

        <div class="mt-4 overflow-hidden">
          <Transition name="question-slide" mode="out-in">
            <div :key="slideActual" class="min-h-60 rounded-3xl border border-gray-200 bg-white p-4 sm:min-h-64 sm:p-5">
              <div v-if="slideActual === 0" class="flex h-full flex-col justify-between">
                <div>
                  <p class="text-sm font-bold text-gray-700">Dolor corporal o molestia física</p>
                  <p class="mt-1 text-xs text-gray-500">1 bajo, 5 alto</p>
                </div>
                <div class="mt-5 flex flex-wrap gap-2">
                  <button
                    v-for="n in 5"
                    :key="`dolor-${n}`"
                    type="button"
                    @click="form.dolor = n"
                    class="h-11 w-11 rounded-xl text-sm font-black border cursor-pointer transition-colors"
                    :disabled="yaRespondido"
                    :class="form.dolor === n ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/35'"
                  >
                    {{ n }}
                  </button>
                </div>
                <p class="mt-4 text-sm font-semibold text-gray-600">{{ dolorTexto }}</p>
              </div>

              <div v-else-if="slideActual === 1" class="flex h-full flex-col justify-between">
                <div>
                  <p class="text-sm font-bold text-gray-700">Fatiga o sensación de cansancio</p>
                  <p class="mt-1 text-xs text-gray-500">1 baja, 5 alta</p>
                </div>
                <div class="mt-5 flex flex-wrap gap-2">
                  <button
                    v-for="n in 5"
                    :key="`fatiga-${n}`"
                    type="button"
                    @click="form.fatiga = n"
                    class="h-11 w-11 rounded-xl text-sm font-black border cursor-pointer transition-colors"
                    :disabled="yaRespondido"
                    :class="form.fatiga === n ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/35'"
                  >
                    {{ n }}
                  </button>
                </div>
                <p class="mt-4 text-sm font-semibold text-gray-600">{{ fatigaTexto }}</p>
              </div>

              <div v-else-if="slideActual === 2" class="flex h-full flex-col justify-between">
                <div>
                  <p class="text-sm font-bold text-gray-700">Calidad del sueño y recuperación</p>
                  <p class="mt-1 text-xs text-gray-500">1 mala, 5 muy buena</p>
                </div>
                <div class="mt-5 flex flex-wrap gap-2">
                  <button
                    v-for="n in 5"
                    :key="`sueno-${n}`"
                    type="button"
                    @click="form.sueno = n"
                    class="h-11 w-11 rounded-xl text-sm font-black border cursor-pointer transition-colors"
                    :disabled="yaRespondido"
                    :class="form.sueno === n ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary/35'"
                  >
                    {{ n }}
                  </button>
                </div>
                <p class="mt-4 text-sm font-semibold text-gray-600">{{ suenoTexto }}</p>
              </div>

              <div v-else-if="slideActual === 3" class="flex h-full flex-col justify-between">
                <div>
                  <p class="text-sm font-bold text-gray-700">¿Estás en tu período esta semana?</p>
                  <p class="mt-1 text-xs text-gray-500">Nos permite ajustar mejor la carga, cuidar la recuperación y reducir riesgo de molestias o lesiones.</p>
                </div>
                <div class="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    @click="form.enPeriodo = true"
                    :disabled="yaRespondido"
                    class="min-h-11 px-4 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-colors"
                    :class="form.enPeriodo === true ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'"
                  >Sí</button>
                  <button
                    type="button"
                    @click="form.enPeriodo = false"
                    :disabled="yaRespondido"
                    class="min-h-11 px-4 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-colors"
                    :class="form.enPeriodo === false ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-gray-700 border-gray-200 hover:border-slate-300'"
                  >No</button>
                </div>
                <p class="mt-4 text-sm font-semibold text-gray-600">{{ periodoTexto }}</p>
              </div>

              <div v-else class="flex h-full flex-col justify-between">
                <div>
                  <label class="block text-sm font-bold text-gray-700">Comentario opcional</label>
                  <p class="mt-1 text-xs text-gray-500">Úsalo si quieres dejar contexto adicional para el staff.</p>
                </div>
                <textarea
                  v-model="form.comentarios"
                  rows="4"
                  :disabled="yaRespondido"
                  class="mt-5 w-full rounded-2xl border border-gray-200 px-3 py-3 text-sm focus:outline-hidden focus:border-primary"
                  placeholder="Ej: molestia en rodilla, dormí poco, etc."
                ></textarea>
                <p class="mt-4 text-sm font-semibold text-gray-500">Puedes dejarlo vacío si no tienes nada que agregar.</p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            @click="irSlideAnterior"
            :disabled="slideActual === 0"
            class="min-h-11 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >Anterior</button>

          <button
            v-if="!yaRespondido"
            type="button"
            @click="handleAccionPrincipal"
            :disabled="guardando || (!puedeAvanzarSlide && !esUltimoSlide)"
            class="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ guardando ? 'Guardando...' : esUltimoSlide ? 'Enviar respuesta semanal' : 'Siguiente' }}
          </button>

          <div v-else class="text-sm font-semibold text-green-700">Ya registraste tu chequeo de esta semana.</div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p v-if="mensaje" class="text-sm font-semibold" :class="tipoMensaje === 'ok' ? 'text-green-600' : 'text-red-600'">{{ mensaje }}</p>
      </div>
    </div>

    <div v-else-if="!isLoading" class="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
      <span v-if="yaRespondido && fechaRespuestaTexto" class="rounded-full bg-green-50 text-green-700 px-3 py-1 font-semibold">Respondido {{ fechaRespuestaTexto }}</span>
      <span v-if="yaRespondido" class="rounded-full bg-gray-100 px-3 py-1 font-semibold">Dolor {{ form.dolor }}/5</span>
      <span v-if="yaRespondido" class="rounded-full bg-gray-100 px-3 py-1 font-semibold">Fatiga {{ form.fatiga }}/5</span>
      <span v-if="yaRespondido" class="rounded-full bg-gray-100 px-3 py-1 font-semibold">Sueño {{ form.sueno }}/5</span>
      <span v-if="yaRespondido" class="rounded-full bg-rose-50 text-rose-700 px-3 py-1 font-semibold">Período {{ form.enPeriodo === true ? 'sí' : form.enPeriodo === false ? 'no' : 'sin informar' }}</span>
      <span v-if="!yaRespondido" class="rounded-full bg-amber-50 text-amber-700 px-3 py-1 font-semibold">Tienes tu chequeo semanal pendiente</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import {
  guardarRespuestaSaludSemanal,
  obtenerRespuestaSemanalJugadora,
  obtenerSemanaClave
} from '../firebase/saludSemanal';

const props = defineProps({
  jugadoraId: { type: String, required: true },
  jugadoraNombre: { type: String, default: '' },
  equipo: { type: String, default: '' }
});

const semanaClave = obtenerSemanaClave();
const isLoading = ref(true);
const guardando = ref(false);
const yaRespondido = ref(false);
const mensaje = ref('');
const tipoMensaje = ref('ok');
const expandido = ref(false);
const fechaRespuesta = ref(null);
const slideActual = ref(0);

const form = reactive({
  dolor: 1,
  fatiga: 1,
  sueno: 5,
  enPeriodo: null,
  comentarios: ''
});

const TEXTOS_DOLOR = {
  1: 'Sin dolor.',
  2: 'Molestia leve.',
  3: 'Dolor moderado.',
  4: 'Dolor alto.',
  5: 'Dolor muy alto.'
};

const TEXTOS_FATIGA = {
  1: 'Muy baja.',
  2: 'Baja.',
  3: 'Media.',
  4: 'Alta.',
  5: 'Muy alta.'
};

const TEXTOS_SUENO = {
  1: 'Muy malo.',
  2: 'Malo.',
  3: 'Regular.',
  4: 'Bueno.',
  5: 'Muy bueno.'
};

const dolorTexto = computed(() => TEXTOS_DOLOR[form.dolor] || 'Sin información.');
const fatigaTexto = computed(() => TEXTOS_FATIGA[form.fatiga] || 'Sin información.');
const suenoTexto = computed(() => TEXTOS_SUENO[form.sueno] || 'Sin información.');
const periodoTexto = computed(() => {
  if (form.enPeriodo === true) return 'Se considerará en la planificación de la semana.';
  if (form.enPeriodo === false) return 'Quedará registrado para esta semana.';
  return 'Selecciona una opción.';
});

const slideSteps = [
  {
    titulo: 'Dolor corporal',
    descripcion: 'Indica tu nivel actual de molestia física.'
  },
  {
    titulo: 'Fatiga',
    descripcion: 'Marca cómo se siente tu nivel de cansancio.'
  },
  {
    titulo: 'Sueño y recuperación',
    descripcion: 'Resume cómo descansaste y te recuperaste.'
  },
  {
    titulo: 'Período semanal',
    descripcion: 'Dato privado para ajustar mejor la carga.'
  },
  {
    titulo: 'Comentario final',
    descripcion: 'Espacio corto para agregar contexto adicional.'
  }
];

const totalSlides = slideSteps.length;

const slideActualMeta = computed(() => {
  return slideSteps[slideActual.value] || slideSteps[0];
});

const esUltimoSlide = computed(() => slideActual.value === totalSlides - 1);

const puedeAvanzarSlide = computed(() => {
  if (yaRespondido.value) return true;
  if (slideActual.value === 3) return form.enPeriodo !== null;
  return true;
});

const fechaRespuestaTexto = computed(() => {
  if (!fechaRespuesta.value) return '';

  const fecha = fechaRespuesta.value?.seconds
    ? new Date(fechaRespuesta.value.seconds * 1000)
    : new Date(fechaRespuesta.value);

  if (Number.isNaN(fecha.getTime())) return '';

  return fecha.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const cargarRespuesta = async () => {
  isLoading.value = true;
  mensaje.value = '';
  try {
    const respuesta = await obtenerRespuestaSemanalJugadora(props.jugadoraId, semanaClave);
    if (respuesta) {
      form.dolor = Number(respuesta.dolor) || 1;
      form.fatiga = Number(respuesta.fatiga) || 1;
      form.sueno = Number(respuesta.sueno) || 5;
      form.enPeriodo = typeof respuesta.enPeriodo === 'boolean' ? respuesta.enPeriodo : null;
      form.comentarios = (respuesta.comentarios || '').toString();
      fechaRespuesta.value = respuesta.fechaRespuesta || respuesta.updatedAt || respuesta.createdAt || null;
      yaRespondido.value = true;
      tipoMensaje.value = 'ok';
      mensaje.value = 'Tu chequeo de esta semana ya fue registrado.';
    } else {
      fechaRespuesta.value = null;
    }
  } finally {
    isLoading.value = false;
  }
};

const guardar = async () => {
  if (yaRespondido.value) return;
  if (form.enPeriodo === null) {
    slideActual.value = 3;
    tipoMensaje.value = 'error';
    mensaje.value = 'Indica si estás en tu período esta semana antes de enviar.';
    return;
  }

  guardando.value = true;
  mensaje.value = '';
  try {
    await guardarRespuestaSaludSemanal({
      jugadoraId: props.jugadoraId,
      jugadoraNombre: props.jugadoraNombre,
      equipo: props.equipo,
      dolor: form.dolor,
      fatiga: form.fatiga,
      sueno: form.sueno,
      enPeriodo: form.enPeriodo,
      comentarios: form.comentarios
    });

    fechaRespuesta.value = new Date();
    yaRespondido.value = true;
    tipoMensaje.value = 'ok';
    mensaje.value = 'Respuesta semanal registrada correctamente.';
    slideActual.value = 0;
    expandido.value = false;
  } catch (error) {
    tipoMensaje.value = 'error';
    mensaje.value = error?.message || 'No se pudo guardar la respuesta. Inténtalo nuevamente.';
  } finally {
    guardando.value = false;
  }
};

const irSlideAnterior = () => {
  if (slideActual.value === 0) return;
  slideActual.value -= 1;
};

const irSlideSiguiente = () => {
  if (esUltimoSlide.value || !puedeAvanzarSlide.value) return;
  slideActual.value += 1;
};

const handleAccionPrincipal = () => {
  if (esUltimoSlide.value) {
    guardar();
    return;
  }

  irSlideSiguiente();
};

onMounted(async () => {
  await cargarRespuesta();
  expandido.value = !yaRespondido.value;
  slideActual.value = 0;
});
</script>

<style scoped>
.question-slide-enter-active,
.question-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.question-slide-enter-from {
  opacity: 0;
  transform: translateX(18px);
}

.question-slide-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}
</style>
