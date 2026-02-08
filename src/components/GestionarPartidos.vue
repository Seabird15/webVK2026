<template>
  <div class="bg-black/50 rounded-lg p-6">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 11H7v2h2v-2m4 0h-2v2h2v-2m4 0h-2v2h2v-2m2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V9h14v11z"/>
      </svg>
      Gestionar Partidos del Campeonato Interno
    </h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="text-white/70 mt-4">Cargando partidos...</p>
    </div>

    <!-- Lista de Partidos -->
    <div v-else class="space-y-4">
      <div
        v-for="partido in partidos"
        :key="partido.id"
        class="bg-primary-dark rounded-lg p-6 border-2 border-primary"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-black font-bold text-lg">Partido {{ partido.id }}</h3>
          <span class="text-black text-sm font-bold">{{ partido.horario }}</span>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-black/30 rounded-lg p-4">
            <label class="block text-black text-sm font-bold mb-2">Equipo Local</label>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white rounded-full p-2">
                <img 
                  :src="`/src/assets/${obtenerDatosEquipo(partido.equipoLocal).logo}`" 
                  :alt="obtenerDatosEquipo(partido.equipoLocal).nombre"
                  class="w-full h-full object-contain"
                />
              </div>
              <span class="text-white font-bold">{{ obtenerDatosEquipo(partido.equipoLocal).nombre }}</span>
            </div>
          </div>

          <div class="bg-black/30 rounded-lg p-4">
            <label class="block text-black text-sm font-bold mb-2">Equipo Visitante</label>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white rounded-full p-2">
                <img 
                  :src="`/src/assets/${obtenerDatosEquipo(partido.equipoVisita).logo}`" 
                  :alt="obtenerDatosEquipo(partido.equipoVisita).nombre"
                  class="w-full h-full object-contain"
                />
              </div>
              <span class="text-white font-bold">{{ obtenerDatosEquipo(partido.equipoVisita).nombre }}</span>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-black/30 rounded-lg p-4">
            <label class="block text-black text-sm font-bold mb-2">Goles Local</label>
            <div class="flex items-center gap-2">
              <button
                @click="decrementarGolPartido(partido, 'local')"
                :disabled="partido.golesLocal === 0 || guardando"
                class="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >-</button>
              <span class="text-primary font-black text-3xl w-16 text-center">{{ partido.golesLocal }}</span>
              <button
                @click="incrementarGolPartido(partido, 'local')"
                :disabled="guardando"
                class="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >+</button>
            </div>
          </div>

          <div class="bg-black/30 rounded-lg p-4">
            <label class="block text-black text-sm font-bold mb-2">Goles Visitante</label>
            <div class="flex items-center gap-2">
              <button
                @click="decrementarGolPartido(partido, 'visita')"
                :disabled="partido.golesVisita === 0 || guardando"
                class="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >-</button>
              <span class="text-primary font-black text-3xl w-16 text-center">{{ partido.golesVisita }}</span>
              <button
                @click="incrementarGolPartido(partido, 'visita')"
                :disabled="guardando"
                class="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >+</button>
            </div>
          </div>
        </div>

        <div class="bg-black/30 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <span class="text-black font-bold text-sm">Estado:</span>
            <span class="bg-green-500/20 text-green-400 border border-green-400 px-3 py-1 rounded-full text-xs font-bold">
              {{ partido.estado }}
            </span>
          </div>
        </div>
      </div>

      <!-- Botón para recalcular tabla manualmente -->
      <div class="mt-6 bg-primary/20 border-2 border-primary rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-primary font-bold text-sm mb-1">Recalcular Tabla de Posiciones</h3>
            <p class="text-white/70 text-xs">La tabla se actualiza automáticamente al cambiar resultados</p>
          </div>
          <button
            @click="recalcularTabla"
            :disabled="guardando"
            class="bg-primary hover:bg-primary/80 text-black px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Recalcular
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje de guardado -->
    <div v-if="mensaje" class="mt-4 rounded-lg p-4" :class="mensaje.tipo === 'success' ? 'bg-green-500/20 text-green-400 border border-green-400' : 'bg-red-500/20 text-red-400 border border-red-400'">
      {{ mensaje.texto }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  obtenerPartidos, 
  actualizarResultadoPartido,
  calcularTabla,
  escucharPartidos
} from '../firebase/campeonatoInterno';

const partidos = ref([]);
const loading = ref(true);
const guardando = ref(false);
const mensaje = ref(null);

let unsubscribe = null;

const obtenerDatosEquipo = (equipoKey) => {
  const equiposData = {
    verserkers: {
      nombre: 'Las Verserkers',
      logo: 'versekersLogo.jpeg',
      color: 'cyan'
    },
    internadas: {
      nombre: 'Inter Nadas',
      logo: 'internadasLogo.jpeg',
      color: 'gray'
    },
    siemprealpalo: {
      nombre: 'Siempre al Palo FC',
      logo: 'siemprealpaloLogo.jpeg',
      color: 'red'
    }
  };
  return equiposData[equipoKey] || {};
};

const cargarPartidos = async () => {
  loading.value = true;
  try {
    partidos.value = await obtenerPartidos();
  } catch (error) {
    console.error('Error cargando partidos:', error);
    mostrarMensaje('Error al cargar partidos', 'error');
  } finally {
    loading.value = false;
  }
};

const incrementarGolPartido = async (partido, tipo) => {
  guardando.value = true;
  try {
    const nuevoGolesLocal = tipo === 'local' ? partido.golesLocal + 1 : partido.golesLocal;
    const nuevoGolesVisita = tipo === 'visita' ? partido.golesVisita + 1 : partido.golesVisita;
    
    await actualizarResultadoPartido(partido.id, nuevoGolesLocal, nuevoGolesVisita);
    mostrarMensaje('Resultado actualizado correctamente', 'success');
  } catch (error) {
    console.error('Error actualizando resultado:', error);
    mostrarMensaje('Error al actualizar resultado', 'error');
  } finally {
    guardando.value = false;
  }
};

const decrementarGolPartido = async (partido, tipo) => {
  guardando.value = true;
  try {
    const nuevoGolesLocal = tipo === 'local' ? Math.max(0, partido.golesLocal - 1) : partido.golesLocal;
    const nuevoGolesVisita = tipo === 'visita' ? Math.max(0, partido.golesVisita - 1) : partido.golesVisita;
    
    await actualizarResultadoPartido(partido.id, nuevoGolesLocal, nuevoGolesVisita);
    mostrarMensaje('Resultado actualizado correctamente', 'success');
  } catch (error) {
    console.error('Error actualizando resultado:', error);
    mostrarMensaje('Error al actualizar resultado', 'error');
  } finally {
    guardando.value = false;
  }
};

const recalcularTabla = async () => {
  guardando.value = true;
  try {
    await calcularTabla();
    mostrarMensaje('Tabla de posiciones recalculada correctamente', 'success');
  } catch (error) {
    console.error('Error recalculando tabla:', error);
    mostrarMensaje('Error al recalcular tabla', 'error');
  } finally {
    guardando.value = false;
  }
};

const mostrarMensaje = (texto, tipo) => {
  mensaje.value = { texto, tipo };
  setTimeout(() => {
    mensaje.value = null;
  }, 3000);
};

onMounted(async () => {
  await cargarPartidos();
  
  // Escuchar cambios en tiempo real
  unsubscribe = escucharPartidos((nuevosPartidos) => {
    partidos.value = nuevosPartidos;
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
