<template>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-6">
    <div class="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 class="text-lg sm:text-xl font-black text-gray-900">Estado de salud semanal</h3>
        <p class="text-sm text-gray-500">Mini chequeo pre-entreno para prevenir lesiones</p>
      </div>
      <span class="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{{ semanaClave }}</span>
    </div>

    <div v-if="isLoading" class="py-6 text-center text-gray-500 text-sm">Cargando cuestionario...</div>

    <div v-else class="space-y-5">
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
  } catch {
    tipoMensaje.value = 'error';
    mensaje.value = 'No se pudo guardar la respuesta. Inténtalo nuevamente.';
  } finally {
    guardando.value = false;
  }
};

onMounted(cargarRespuesta);
</script>
