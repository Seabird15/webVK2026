<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestionar ultimos resultados</h2>
        <p class="text-sm text-gray-500 mt-1">Crea y edita bloques que se mostraran debajo de Eventos en la Home.</p>
      </div>
      <button
        @click="agregarBloque"
        class="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-colors"
      >
        Agregar bloque
      </button>
    </div>

    <div v-if="mensaje.texto" :class="[
      'rounded-lg px-4 py-3 font-semibold',
      mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    ]">
      {{ mensaje.texto }}
    </div>

    <div v-if="isLoading" class="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
      Cargando bloques...
    </div>

    <div v-else class="grid gap-5">
      <div
        v-for="bloque in bloques"
        :key="bloque.localId"
        draggable="true"
        @dragstart="iniciarArrastre(bloque.localId)"
        @dragover.prevent
        @drop="soltarBloque(bloque.localId)"
        :class="[
          'bg-white rounded-2xl shadow-lg border p-5 space-y-4 transition-all',
          bloque.localId === bloqueArrastrado ? 'border-primary shadow-primary/20' : 'border-gray-100'
        ]"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <button
              type="button"
              class="mt-1 cursor-grab rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-gray-400 active:cursor-grabbing"
              title="Arrastra para reordenar"
            >
              ::
            </button>
            <h3 class="text-lg font-black text-gray-900">
              {{ bloque.id ? 'Bloque guardado' : 'Nuevo bloque' }}
            </h3>
            <div>
              <p class="text-sm text-gray-500">Completa los datos, arrastra para reordenar y guarda cuando este listo.</p>
              <p class="text-xs font-bold text-primary mt-1">Posicion {{ obtenerPosicionVisible(bloque.localId) }}</p>
            </div>
          </div>
          <button
            @click="eliminarBloque(bloque)"
            :disabled="guardandoId === bloque.localId"
            class="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-sm disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nombre liga</label>
            <input v-model="bloque.nombreLiga" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: Liga Dobleve" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
            <input v-model="bloque.categoria" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: Serie C" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Fecha</label>
            <input v-model="bloque.fecha" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: 10 marzo 2026" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Rival</label>
            <input v-model="bloque.rival" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: Deportivo Sur" />
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Marcador Vikingas</label>
            <input v-model="bloque.marcadorVikingas" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: 3" />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Marcador rival</label>
            <input v-model="bloque.marcadorRival" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Ej: 1" />
          </div>
        </div>

        <div class="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-gray-700">
          Se mostrara como: <span class="font-black text-gray-900">Vikingas {{ bloque.marcadorVikingas || '0' }} - {{ bloque.marcadorRival || '0' }} {{ bloque.rival || 'Rival' }}</span>
        </div>

        <div class="flex justify-end">
          <button
            @click="guardarBloque(bloque)"
            :disabled="guardandoId === bloque.localId"
            class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
          >
            {{ guardandoId === bloque.localId ? 'Guardando...' : 'Guardar bloque' }}
          </button>
        </div>
      </div>

      <div v-if="bloques.length === 0" class="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
        No hay bloques creados todavia.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {
  actualizarUltimoResultado,
  actualizarOrdenUltimosResultados,
  crearUltimoResultado,
  eliminarUltimoResultado,
  obtenerUltimosResultados
} from '../firebase/ultimosResultados';

const bloques = ref([]);
const isLoading = ref(false);
const guardandoId = ref('');
const mensaje = ref({ texto: '', tipo: 'success' });
const bloqueArrastrado = ref('');

const crearBloqueVacio = () => ({
  localId: `nuevo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  id: '',
  orden: bloques.value.length,
  nombreLiga: '',
  categoria: '',
  fecha: '',
  rival: '',
  marcadorVikingas: '',
  marcadorRival: '',
  resultadoFinal: ''
});

const mostrarMensaje = (texto, tipo = 'success') => {
  mensaje.value = { texto, tipo };
  setTimeout(() => {
    if (mensaje.value.texto === texto) {
      mensaje.value = { texto: '', tipo: 'success' };
    }
  }, 3000);
};

const cargarBloques = async () => {
  isLoading.value = true;
  try {
    const datos = await obtenerUltimosResultados();
    bloques.value = datos.map((item) => ({
      localId: item.id,
      ...item
    }));
  } catch (error) {
    bloques.value = [];
    mostrarMensaje('Error al cargar los resultados', 'error');
  } finally {
    isLoading.value = false;
  }
};

const agregarBloque = () => {
  const nuevoBloque = crearBloqueVacio();
  bloques.value.push(nuevoBloque);
};

const obtenerPosicionVisible = (localId) => {
  return bloques.value.findIndex((bloque) => bloque.localId === localId) + 1;
};

const iniciarArrastre = (localId) => {
  bloqueArrastrado.value = localId;
};

const reordenarBloques = (origenId, destinoId) => {
  const origenIndex = bloques.value.findIndex((bloque) => bloque.localId === origenId);
  const destinoIndex = bloques.value.findIndex((bloque) => bloque.localId === destinoId);

  if (origenIndex === -1 || destinoIndex === -1 || origenIndex === destinoIndex) {
    return false;
  }

  const [movido] = bloques.value.splice(origenIndex, 1);
  bloques.value.splice(destinoIndex, 0, movido);
  bloques.value = bloques.value.map((bloque, index) => ({ ...bloque, orden: index }));
  return true;
};

const persistirOrden = async () => {
  const bloquesGuardados = bloques.value.filter((bloque) => bloque.id);
  if (bloquesGuardados.length === 0) return;

  await actualizarOrdenUltimosResultados(bloquesGuardados.map((bloque, index) => ({
    id: bloque.id,
    orden: index
  })));
};

const soltarBloque = async (destinoId) => {
  const origenId = bloqueArrastrado.value;
  bloqueArrastrado.value = '';

  if (!origenId) return;

  const huboCambio = reordenarBloques(origenId, destinoId);
  if (!huboCambio) return;

  try {
    await persistirOrden();
    mostrarMensaje('Orden actualizado correctamente');
  } catch (error) {
    mostrarMensaje('No se pudo guardar el nuevo orden', 'error');
    await cargarBloques();
  }
};

const validarBloque = (bloque) => {
  return [bloque.nombreLiga, bloque.categoria, bloque.fecha, bloque.rival, bloque.marcadorVikingas, bloque.marcadorRival]
    .every((valor) => valor?.toString().trim());
};

const guardarBloque = async (bloque) => {
  if (!validarBloque(bloque)) {
    mostrarMensaje('Completa todos los campos del bloque antes de guardar', 'error');
    return;
  }

  guardandoId.value = bloque.localId;

  try {
    const payload = {
      orden: Number.isFinite(Number(bloque.orden)) ? Number(bloque.orden) : obtenerPosicionVisible(bloque.localId) - 1,
      nombreLiga: bloque.nombreLiga,
      categoria: bloque.categoria,
      fecha: bloque.fecha,
      rival: bloque.rival,
      marcadorVikingas: bloque.marcadorVikingas,
      marcadorRival: bloque.marcadorRival
    };

    if (bloque.id) {
      await actualizarUltimoResultado(bloque.id, payload);
      mostrarMensaje('Bloque actualizado correctamente');
    } else {
      await crearUltimoResultado(payload);
      mostrarMensaje('Bloque creado correctamente');
    }

    await cargarBloques();
  } catch (error) {
    mostrarMensaje('No se pudo guardar el bloque', 'error');
  } finally {
    guardandoId.value = '';
  }
};

const eliminarBloque = async (bloque) => {
  guardandoId.value = bloque.localId;

  try {
    if (bloque.id) {
      await eliminarUltimoResultado(bloque.id);
      mostrarMensaje('Bloque eliminado correctamente');
    }

    bloques.value = bloques.value.filter((item) => item.localId !== bloque.localId);
  } catch (error) {
    mostrarMensaje('No se pudo eliminar el bloque', 'error');
  } finally {
    guardandoId.value = '';
  }
};

onMounted(() => {
  cargarBloques();
});
</script>