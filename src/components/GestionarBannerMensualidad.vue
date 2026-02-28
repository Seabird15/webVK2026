<template>
  <div class="bg-white/10 border border-primary/30 rounded-lg p-6">
    <h3 class="text-black text-xl font-bold mb-6 flex items-center gap-2">
      <span class="text-primary">→</span> BANNER MENSUALIDAD (JUGADORAS)
    </h3>

    <div class="space-y-4">
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          v-model="formBanner.activo"
          type="checkbox"
          class="w-5 h-5"
        />
        <span class="text-black text-sm font-semibold">Mostrar banner en Entrenamientos</span>
      </label>

      <div>
        <label class="block text-black text-sm font-semibold mb-2">Mensaje del banner</label>
        <textarea
          v-model="formBanner.mensaje"
          rows="3"
          placeholder="Ej: Recuerda el pago de la mensualidad. Gracias a esto seguimos existiendo."
          class="w-full bg-black/50 border border-primary/30 rounded px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary"
        ></textarea>
      </div>

      <button
        @click="guardarBannerMensualidad"
        class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-2 rounded transition-colors mt-2 cursor-pointer"
      >
        Guardar Banner Mensualidad
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  obtenerEventosEspeciales,
  actualizarBannerMensualidad,
  inicializarEventosEspeciales
} from '../firebase/eventosEspeciales.js';
import { useLoader } from '../composables/useLoader.js';

const { show, hide } = useLoader();

const formBanner = ref({
  activo: true,
  mensaje: 'Recuerda el pago de la mensualidad. Gracias a esto seguimos existiendo.'
});

onMounted(async () => {
  try {
    show('Cargando banner de mensualidad...');
    await inicializarEventosEspeciales();
    const datos = await obtenerEventosEspeciales();

    if (datos?.bannerMensualidad) {
      formBanner.value = {
        activo: typeof datos.bannerMensualidad.activo === 'boolean' ? datos.bannerMensualidad.activo : true,
        mensaje: (datos.bannerMensualidad.mensaje || '').toString().trim() || 'Recuerda el pago de la mensualidad. Gracias a esto seguimos existiendo.'
      };
    }

    hide();
  } catch (error) {
    hide();
    alert('Error al cargar el banner de mensualidad');
  }
});

const guardarBannerMensualidad = async () => {
  try {
    show('Guardando banner...');

    await actualizarBannerMensualidad({
      activo: formBanner.value.activo,
      mensaje: formBanner.value.mensaje
    });

    hide();
    alert('✓ Banner de mensualidad guardado correctamente');
  } catch (error) {
    hide();
    alert('Error al guardar el banner');
  }
};
</script>
