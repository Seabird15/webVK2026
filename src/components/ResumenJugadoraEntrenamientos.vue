<template>
  <section v-if="jugadora" class="mb-5 w-full max-w-full overflow-hidden rounded-2xl border border-white/60 bg-linear-to-br from-white to-gray-50 p-3 shadow-xl md:mb-8 md:p-5">
    <div class="space-y-4">
      <div class="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
        <div v-if="jugadora.fotoPerfil" class="size-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-2 ring-primary/10 sm:size-20">
          <img :src="jugadora.fotoPerfil" alt="Perfil" class="size-full object-cover" />
        </div>

        <div class="min-w-0 flex-1 overflow-hidden">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Ficha jugadora</p>
          <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
            <span class="max-w-full truncate font-black text-gray-900">{{ jugadora.nombre }} {{ jugadora.apellido }}</span>
            <span class="font-bold text-gray-300">|</span>
            <span class="font-semibold text-gray-600">{{ jugadora.posicion || 'Sin posición' }}</span>
            <span class="font-bold text-gray-300">|</span>
            <span class="font-black text-primary">#{{ jugadora.dorsal || '--' }}</span>
          </div>
          <p class="mt-1 text-xs font-semibold text-gray-600">
            <span class="font-bold" :class="claseEstadoSalud">{{ formatearEstadoSalud(jugadora.estadoSalud) }}</span>
          </p>
        </div>

        <router-link to="/perfil" aria-label="Editar perfil" class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-primary-dark to-primary text-white transition-all hover:shadow-md sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5">
          <PencilIcon class="size-4" />
          <span class="hidden sm:inline">Editar</span>
        </router-link>
      </div>

      <div class="grid grid-cols-2 gap-2 sm:gap-3">
        <div v-if="racha" class="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[9px] font-black uppercase tracking-wide text-gray-500">Racha reciente</p>
              <p class="mt-1 text-xl font-black tabular-nums" :class="racha.estado === 'confirmada' ? 'text-green-700' : 'text-red-700'">
                {{ racha.cantidad }} <span class="text-xs font-bold">{{ racha.estado === 'confirmada' ? '✓' : '✗' }}</span>
              </p>
            </div>
            <div class="flex size-10 items-center justify-center rounded-full" :class="racha.estado === 'confirmada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              <CheckIcon v-if="racha.estado === 'confirmada'" class="size-5" />
              <XMarkIcon v-else class="size-5" />
            </div>
          </div>
        </div>

        <div v-if="cumpleaniosHoy.length > 0" class="rounded-xl border border-pink-300/50 bg-linear-to-r from-pink-500 to-purple-500 p-3 text-white shadow-md">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[10px] font-black uppercase tracking-wide">¡HOY!</p>
              <p class="mt-1 text-sm font-black">Cumpleaños</p>
              <div class="mt-2 space-y-1">
                <p v-for="cumple in cumpleaniosHoy" :key="cumple.nombre" class="text-sm font-semibold text-white/95">{{ cumple.nombre }}</p>
              </div>
            </div>
            <CakeIcon class="size-6 shrink-0" />
          </div>
        </div>

        <div v-if="cumpleaniosHoy.length === 0 && proximoCumpleanios.length > 0" class="rounded-xl border border-purple-300/50 bg-linear-to-r from-purple-500 to-pink-500 p-3 text-white shadow-md sm:col-span-2">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[10px] font-black uppercase tracking-wide">Próximo</p>
              <p class="mt-1 text-sm font-black">Cumpleaños</p>
            </div>
            <CakeIcon class="size-6" />
          </div>
          <div class="mt-2 border-t border-white/30 pt-2 text-xs">
            <p class="font-bold">{{ proximoCumpleanios[0]?.nombre }}</p>
            <p class="mt-1 text-white/90">{{ proximoCumpleanios[0]?.diasRestantes === 1 ? 'Mañana' : `En ${proximoCumpleanios[0]?.diasRestantes} días` }}</p>
          </div>
        </div>
        <div v-if="estadisticas" class="min-w-0 rounded-xl border border-blue-200 bg-blue-50 p-3 shadow-sm">
          <p class="text-[9px] font-black uppercase leading-tight text-blue-700">Asistencia</p>
          <div class="mt-1 flex items-end justify-between gap-2">
            <p class="text-2xl font-black leading-none tabular-nums text-blue-800">{{ porcentajeAsistencia }}%</p>
            <p class="text-[10px] font-bold tabular-nums text-blue-700">{{ estadisticas.confirmadas }}/{{ estadisticas.total }}</p>
          </div>
        </div>

        <div v-if="estadisticas" class="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:col-span-2">
          <p class="mb-2 text-[9px] font-black uppercase tracking-wide text-gray-500">Rendimiento</p>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="rounded-lg bg-emerald-50 py-2">
              <p class="text-sm font-black leading-none text-emerald-700">G</p>
              <p class="mt-1 text-xl font-black leading-none tabular-nums text-emerald-800">{{ estadisticas.goles || 0 }}</p>
            </div>
            <div class="rounded-lg bg-sky-50 py-2">
              <p class="text-sm font-black leading-none text-sky-700">A</p>
              <p class="mt-1 text-xl font-black leading-none tabular-nums text-sky-800">{{ estadisticas.asistencias || 0 }}</p>
            </div>
            <div class="rounded-lg bg-amber-50 py-2">
              <p class="text-sm font-black leading-none text-amber-700">MVP</p>
              <p class="mt-1 text-xl font-black leading-none tabular-nums text-amber-800">{{ estadisticas.mvp || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { computed } from 'vue';
import { CakeIcon, CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  jugadora: { type: Object, default: null },
  racha: { type: Object, default: null },
  cumpleaniosHoy: { type: Array, default: () => [] },
  proximoCumpleanios: { type: Array, default: () => [] },
  estadisticas: { type: Object, default: null },
  porcentajeAsistencia: { type: Number, default: 0 }
});

const formatearEstadoSalud = (estado) => ({
  disponible: 'Disponible',
  lesionada: 'Lesionada',
  recuperacion: 'En recuperación',
  vacaciones: 'De vacaciones',
  no_disponible: 'No disponible'
}[estado] || 'Disponible');

const claseEstadoSalud = computed(() => ({
  lesionada: 'text-red-700',
  recuperacion: 'text-yellow-700',
  no_disponible: 'text-gray-700'
}[props.jugadora?.estadoSalud] || 'text-green-700'));
</script>
