<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Jugadoras</h2>
        <p class="text-sm text-gray-600">Listado por equipo (las de "Ambos" aparecen en los dos).</p>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          class="w-full sm:w-80 px-3 py-2 border rounded-lg text-sm"
        />
        <button
          @click="cargar"
          class="px-3 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200"
          :disabled="isLoading"
        >
          Refrescar
        </button>
      </div>
    </div>

    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="isLoading" class="text-center py-10 text-gray-500">
      Cargando jugadoras...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Ascenso -->
      <section class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Ascenso</h3>
          <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">{{ ascensoFiltradas.length }}</span>
        </div>

        <div v-if="ascensoFiltradas.length === 0" class="p-6 text-sm text-gray-500">
          No hay jugadoras para mostrar.
        </div>

        <div v-else class="divide-y">
          <div v-for="j in ascensoFiltradas" :key="'ascenso-' + j.id" class="p-4 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="font-semibold text-gray-900 truncate">
                {{ j.apellido || '' }} {{ j.nombre || '' }}
              </div>
              <div class="text-xs text-gray-600 mt-0.5 truncate">
                {{ j.email || '-' }}
              </div>
              <div class="text-xs text-gray-600 mt-1">
                <span class="font-semibold">Posición:</span> {{ j.posicion || '-' }} · <span class="font-semibold">Dorsal:</span> {{ j.dorsal ?? '-' }}
              </div>
            </div>
            <div class="flex flex-col items-end gap-1 flex-shrink-0">
              <span class="text-[11px] bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 font-semibold">Ascenso</span>
              <span v-if="j.equipo === 'ambos'" class="text-[11px] bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 font-semibold">Ambos</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Escuela -->
      <section class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Escuela</h3>
          <span class="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">{{ escuelaFiltradas.length }}</span>
        </div>

        <div v-if="escuelaFiltradas.length === 0" class="p-6 text-sm text-gray-500">
          No hay jugadoras para mostrar.
        </div>

        <div v-else class="divide-y">
          <div v-for="j in escuelaFiltradas" :key="'escuela-' + j.id" class="p-4 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="font-semibold text-gray-900 truncate">
                {{ j.apellido || '' }} {{ j.nombre || '' }}
              </div>
              <div class="text-xs text-gray-600 mt-0.5 truncate">
                {{ j.email || '-' }}
              </div>
              <div class="text-xs text-gray-600 mt-1">
                <span class="font-semibold">Posición:</span> {{ j.posicion || '-' }} · <span class="font-semibold">Dorsal:</span> {{ j.dorsal ?? '-' }}
              </div>
            </div>
            <div class="flex flex-col items-end gap-1 flex-shrink-0">
              <span class="text-[11px] bg-green-100 text-green-800 rounded-full px-2 py-0.5 font-semibold">Escuela</span>
              <span v-if="j.equipo === 'ambos'" class="text-[11px] bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 font-semibold">Ambos</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchJugadorasRegistradasPorEquipo } from '../firebase/jugadorasAuth';

const isLoading = ref(false);
const error = ref(null);
const busqueda = ref('');
const jugadoras = ref([]);

const normalizar = (v) => (v || '').toString().trim().toLowerCase();

const cargar = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // "ambos" en esta función significa: traer todas
    jugadoras.value = await fetchJugadorasRegistradasPorEquipo('ambos');
  } catch (e) {
    error.value = e?.message || 'Error cargando jugadoras';
  } finally {
    isLoading.value = false;
  }
};

const termino = computed(() => normalizar(busqueda.value));

const filtrar = (lista) => {
  if (!termino.value) return lista;
  return lista.filter(j => {
    const haystack = [j.nombre, j.apellido, j.email].map(normalizar).join(' ');
    return haystack.includes(termino.value);
  });
};

const ordenar = (lista) => {
  return [...lista].sort((a, b) => {
    const apA = normalizar(a.apellido);
    const apB = normalizar(b.apellido);
    if (apA !== apB) return apA.localeCompare(apB, 'es');
    return normalizar(a.nombre).localeCompare(normalizar(b.nombre), 'es');
  });
};

const ascenso = computed(() => ordenar(jugadoras.value.filter(j => j.equipo === 'ascenso' || j.equipo === 'ambos')));
const escuela = computed(() => ordenar(jugadoras.value.filter(j => j.equipo === 'escuela' || j.equipo === 'ambos')));

const ascensoFiltradas = computed(() => filtrar(ascenso.value));
const escuelaFiltradas = computed(() => filtrar(escuela.value));

onMounted(cargar);
</script>
