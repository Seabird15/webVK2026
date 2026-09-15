<template>
  <section class="mb-8 w-full max-w-full overflow-hidden rounded-3xl border border-[#f3d98a] bg-linear-to-br from-[#fffaf0] via-white to-[#fff6de] p-4 shadow-xl sm:p-5 md:p-6">
    <button
      type="button"
      @click="abierto = !abierto"
      class="flex w-full cursor-pointer flex-col gap-3 text-left md:flex-row md:items-center md:justify-between"
    >
      <div class="min-w-0 flex-1">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Sugerencias al club</p>
        <h2 class="mt-2 text-xl font-black text-gray-900">Dejanos tu mensaje</h2>
        <p class="mt-1 text-sm text-gray-600 break-words">Tu opinión ayuda a mejorar el club, el ambiente y el día a día.</p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span class="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-800">Mensaje abierto</span>
        <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-200 text-amber-700 transition-transform" :class="abierto ? 'rotate-180' : ''">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </button>

    <form v-if="abierto" class="mt-5" @submit.prevent="enviar">
      <textarea
        v-model="mensaje"
        rows="4"
        maxlength="500"
        placeholder="Escribí tu sugerencia, comentario o idea para el club..."
        class="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
      ></textarea>

      <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-gray-500">{{ mensaje.length }}/500 caracteres</p>
        <button
          type="submit"
          :disabled="enviando || !mensaje.trim()"
          class="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {{ enviando ? 'Enviando...' : 'Enviar sugerencia' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  enviando: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['submit', 'update:modelValue']);

const abierto = ref(false);

const mensaje = computed({
  get: () => props.modelValue,
  set: (valor) => emit('update:modelValue', valor)
});

const enviar = () => {
  const texto = mensaje.value.trim();
  if (!texto) return;

  emit('submit', texto);
};
</script>
