<template>
  <section v-if="feedbacks.length > 0" class="mb-6 rounded-2xl border-2 border-green-300 bg-linear-to-r from-green-50 to-emerald-50 p-4 shadow-lg">
    <div class="flex items-start gap-3">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
        <BellIcon class="size-5" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold text-green-900">Tienes {{ feedbacks.length }} mensaje{{ feedbacks.length === 1 ? '' : 's' }} del DT</p>
        <p class="mt-1 text-xs text-green-700">Haz clic para leer y responder</p>
      </div>
    </div>

    <div class="mt-4 space-y-2">
      <button
        v-for="feedback in feedbacks"
        :key="feedback.id"
        type="button"
        class="group w-full rounded-xl border border-green-200 bg-white p-3 text-left transition-all hover:border-green-500 hover:shadow-md"
        @click="$emit('open', feedback)"
      >
        <div class="flex items-center justify-between">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold capitalize text-gray-900">{{ feedback.tipo }}</p>
            <p class="mt-1 line-clamp-1 text-xs text-gray-600">{{ feedback.mensaje }}</p>
            <p class="mt-2 text-xs text-gray-500">{{ formatearFecha(feedback.createdAt) }}</p>
          </div>
          <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
            <ChevronDownIcon class="size-4 rotate-180 text-green-700" />
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup>
import { BellIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';

defineProps({
  feedbacks: {
    type: Array,
    default: () => []
  }
});

defineEmits(['open']);

const formatearFecha = (valor) => {
  const fecha = new Date(valor?.seconds ? valor.seconds * 1000 : valor);
  return Number.isNaN(fecha.getTime()) ? 'Fecha no disponible' : fecha.toLocaleString('es-ES');
};
</script>
