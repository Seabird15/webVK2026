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
        </div>
        <p class="text-sm text-gray-500 mt-1">Mini chequeo pre-entreno para prevenir lesiones</p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <div v-if="yaRespondido && !isLoading" class="hidden sm:block text-right text-xs text-gray-500">
          <p>Dolor {{ form.dolor }}/5</p>
          <p>Fatiga {{ form.fatiga }}/5</p>
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
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p class="text-sm font-bold text-gray-700 mb-2">Dolor (1-5)</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="n in 5"
              :key="`dolor-${n}`"
              @click="form.dolor = n"
              class="w-9 h-9 rounded-lg text-sm font-bold border cursor-pointer"
              :class="form.dolor === n ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <div>
          <p class="text-sm font-bold text-gray-700 mb-2">Fatiga (1-5)</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="n in 5"
              :key="`fatiga-${n}`"
              @click="form.fatiga = n"
              class="w-9 h-9 rounded-lg text-sm font-bold border cursor-pointer"
              :class="form.fatiga === n ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <div>
          <p class="text-sm font-bold text-gray-700 mb-2">Sueño (1-5)</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="n in 5"
              :key="`sueno-${n}`"
              @click="form.sueno = n"
              class="w-9 h-9 rounded-lg text-sm font-bold border cursor-pointer"
              :class="form.sueno === n ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'"
            >
              {{ n }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label class="text-sm font-bold text-gray-700 mb-2 block">Comentario opcional</label>
        <textarea
          v-model="form.comentarios"
          rows="2"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
          placeholder="Ej: molestia en rodilla, dormí poco, etc."
        ></textarea>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p v-if="mensaje" class="text-sm font-semibold" :class="tipoMensaje === 'ok' ? 'text-green-600' : 'text-red-600'">{{ mensaje }}</p>
        <button
          @click="guardar"
          :disabled="guardando"
          class="px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark disabled:opacity-60 cursor-pointer"
        >
          {{ guardando ? 'Guardando...' : (yaRespondido ? 'Actualizar respuesta semanal' : 'Enviar respuesta semanal') }}
        </button>
      </div>
    </div>

    <div v-else-if="!isLoading" class="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
      <span v-if="yaRespondido" class="rounded-full bg-gray-100 px-3 py-1 font-semibold">Dolor {{ form.dolor }}/5</span>
      <span v-if="yaRespondido" class="rounded-full bg-gray-100 px-3 py-1 font-semibold">Fatiga {{ form.fatiga }}/5</span>
      <span v-if="yaRespondido" class="rounded-full bg-gray-100 px-3 py-1 font-semibold">Sueño {{ form.sueno }}/5</span>
      <span v-if="!yaRespondido" class="rounded-full bg-amber-50 text-amber-700 px-3 py-1 font-semibold">Tienes tu chequeo semanal pendiente</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
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

const form = reactive({
  dolor: 1,
  fatiga: 1,
  sueno: 5,
  comentarios: ''
});

const cargarRespuesta = async () => {
  isLoading.value = true;
  try {
    const respuesta = await obtenerRespuestaSemanalJugadora(props.jugadoraId, semanaClave);
    if (respuesta) {
      form.dolor = Number(respuesta.dolor) || 1;
      form.fatiga = Number(respuesta.fatiga) || 1;
      form.sueno = Number(respuesta.sueno) || 5;
      form.comentarios = (respuesta.comentarios || '').toString();
      yaRespondido.value = true;
    }
  } finally {
    isLoading.value = false;
  }
};

const guardar = async () => {
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
      comentarios: form.comentarios
    });

    yaRespondido.value = true;
    tipoMensaje.value = 'ok';
    mensaje.value = 'Respuesta semanal registrada correctamente.';
    expandido.value = false;
  } catch {
    tipoMensaje.value = 'error';
    mensaje.value = 'No se pudo guardar la respuesta. Inténtalo nuevamente.';
  } finally {
    guardando.value = false;
  }
};

onMounted(async () => {
  await cargarRespuesta();
  expandido.value = !yaRespondido.value;
});
</script>
