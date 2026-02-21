<template>
  <div>
    <button
      @click="mostrarModal = true"
      class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl font-bold text-white transition-all cursor-pointer backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105 active:scale-95"
    >
      <InformationCircleIcon class="w-5 h-5" />
      Ver novedades
    </button>

    <Teleport to="body">
      <div
        v-if="mostrarModal"
        class="fixed inset-0 z-100 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="mostrarModal = false"
      >
        <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div class="bg-linear-to-r from-primary-dark to-primary text-white px-5 py-4 flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] font-black text-white/80">Novedades</p>
              <h3 class="text-lg sm:text-xl font-black">{{ titulo }}</h3>
            </div>
            <button
              @click="mostrarModal = false"
              class="shrink-0 w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Cerrar"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="px-5 py-5 space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary-dark border border-primary/20 text-xs font-black">
              <SparklesIcon class="w-4 h-4" />
              Versión actualizada: {{ fecha }}
            </div>

            <ul class="space-y-2">
              <li
                v-for="(item, index) in cambios"
                :key="index"
                class="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5"
              >
                {{ item }}
              </li>
            </ul>

            <button
              @click="mostrarModal = false"
              class="w-full bg-primary-dark text-white py-2.5 rounded-xl font-bold hover:bg-primary transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { InformationCircleIcon, XMarkIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  titulo: {
    type: String,
    default: 'Última actualización de la app'
  },
  fecha: {
    type: String,
    default: '21 de febrero de 2026'
  },
  cambios: {
    type: Array,
    default: () => [
      'Se mejoró la experiencia móvil en entrenamientos y vista detalle.',
      'Se agregó estado de salud de jugadora, donde podrás editar desde tu perfil tu estado y disponibilidad para encuentros y entrenamientos, y visualización para administración.',
      'Se incorporó una interfaz más moderna en accesos y paneles principales.'
    ]
  }
});

const mostrarModal = ref(false);
</script>
