<template>
  <section class="mb-8 w-full max-w-full overflow-hidden rounded-3xl border border-[#f3d98a] bg-linear-to-br from-[#fffaf0] via-white to-[#fff6de] p-4 shadow-xl sm:p-5 md:p-6">
    <button
      type="button"
      @click="abierto = !abierto"
      class="flex w-full cursor-pointer flex-col gap-3 text-left md:flex-row md:items-center md:justify-between"
    >
      <div class="min-w-0 flex-1">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Muro del plantel</p>
        <h2 class="mt-2 text-xl font-black text-gray-900">Mensajes abiertos</h2>
        <p class="mt-1 text-sm text-gray-600 break-words">Deja ánimo, recordatorios o lo que quieras compartir con tus compañeras.</p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span class="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-800">
          {{ mensajes.length }} {{ mensajes.length === 1 ? 'mensaje' : 'mensajes' }}
        </span>
        <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-200 text-amber-700 transition-transform" :class="abierto ? 'rotate-180' : ''">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.512a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </button>

    <div v-if="abierto" class="mt-5 space-y-5">
      <form @submit.prevent="enviar">
        <textarea
          v-model="mensaje"
          rows="3"
          maxlength="500"
          placeholder="Escribe tu mensaje para el plantel..."
          class="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        ></textarea>

        <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-gray-500">{{ mensaje.length }}/500 caracteres</p>
          <button
            type="submit"
            :disabled="enviando || !mensaje.trim()"
            class="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {{ enviando ? 'Publicando...' : 'Publicar mensaje' }}
          </button>
        </div>
      </form>

      <div class="border-t border-amber-100 pt-4">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Últimos mensajes</p>

        <div v-if="cargando" class="mt-3 text-sm font-semibold text-gray-500">Cargando mensajes...</div>
        <div v-else-if="mensajes.length === 0" class="mt-3 rounded-2xl border border-dashed border-amber-200 bg-white/60 p-5 text-center text-sm text-gray-500">
          Todavía no hay mensajes. ¡Sé la primera en escribir algo!
        </div>

        <div v-else class="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
          <article
            v-for="item in mensajes"
            :key="item.id"
            class="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-black text-gray-900">{{ item.nombre || 'Jugadora' }} {{ item.apellido || '' }}</p>
                <p class="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-600">{{ item.equipo || 'Club' }}</p>
              </div>
              <time class="shrink-0 text-[11px] font-semibold text-gray-400">{{ formatearFecha(item.createdAt) }}</time>
            </div>

            <p class="mt-2 text-sm leading-relaxed break-words whitespace-pre-line text-gray-700">{{ item.mensaje }}</p>

            <div class="mt-3 flex items-center justify-end">
              <button
                type="button"
                @click="$emit('like', item)"
                class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black transition"
                :class="leGusta(item) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'"
              >
                <svg class="size-4" :fill="leGusta(item) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z" />
                </svg>
                {{ contarLikes(item) }}
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  enviando: {
    type: Boolean,
    default: false
  },
  cargando: {
    type: Boolean,
    default: false
  },
  mensajes: {
    type: Array,
    default: () => []
  },
  jugadoraId: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['submit', 'update:modelValue', 'like']);

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

const contarLikes = (item) => (item.likes || []).length;
const leGusta = (item) => Boolean(props.jugadoraId) && (item.likes || []).includes(props.jugadoraId);

const formatearFecha = (valor) => {
  const fecha = typeof valor?.toDate === 'function' ? valor.toDate() : new Date(valor);
  return Number.isNaN(fecha.getTime()) ? '' : fecha.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
};
</script>
