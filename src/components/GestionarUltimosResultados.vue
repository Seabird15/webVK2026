<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Ultimos resultados</h2>
        <p class="mt-1 text-sm text-gray-500">Esta seccion ahora se genera automaticamente con todos los resultados finalizados de partidos y amistosos.</p>
      </div>
      <div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
        Sin carga manual
      </div>
    </div>

    <div class="rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-white p-4 text-sm text-blue-900 shadow-sm">
      La home toma los datos desde <span class="font-black">entrenamientos</span> y <span class="font-black">partidos</span>. Aqui ves exactamente lo que se publicara cuando el evento este marcado como <span class="font-black">FINALIZADO</span>.
    </div>

    <div v-if="isLoading" class="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">
      Cargando resultados automaticos...
    </div>

    <div v-else-if="bloques.length === 0" class="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">
      No hay partidos o amistosos finalizados para mostrar todavia.
    </div>

    <div v-else class="grid gap-5 lg:grid-cols-2">
      <article
        v-for="(bloque, index) in bloques"
        :key="bloque.id"
        class="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg"
      >
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.22em] text-primary">{{ bloque.nombreLiga }}</p>
            <h3 class="mt-2 text-xl font-black text-gray-900">{{ bloque.categoria }}</h3>
          </div>
          <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-600">
            #{{ index + 1 }}
          </span>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Fecha</p>
            <p class="mt-2 text-sm font-semibold text-gray-900">{{ bloque.fecha }}</p>
          </div>

          <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Rival</p>
            <p class="mt-2 text-sm font-semibold text-gray-900">{{ bloque.rival }}</p>
          </div>
        </div>

        <div class="mt-4 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4 text-center">
          <p class="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Marcador final</p>
          <p class="mt-3 text-3xl font-black text-gray-900">
            <span>{{ bloque.marcadorVikingas }}</span>
            <span class="mx-3 text-primary">-</span>
            <span>{{ bloque.marcadorRival }}</span>
          </p>
          <p class="mt-2 text-sm text-gray-600">Vikingas vs {{ bloque.rival }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { escucharUltimosResultados, obtenerUltimosResultados } from '../firebase/ultimosResultados';

const bloques = ref([]);
const isLoading = ref(false);
let unsubscribe = null;

const cargarBloques = async () => {
  isLoading.value = true;

  try {
    bloques.value = await obtenerUltimosResultados();
  } catch (error) {
    bloques.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await cargarBloques();

  unsubscribe = escucharUltimosResultados((datos) => {
    bloques.value = datos;
  });
});

onUnmounted(() => {
  if (typeof unsubscribe === 'function') {
    unsubscribe();
  }
});
</script>