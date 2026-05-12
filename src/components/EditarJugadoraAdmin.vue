<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 p-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h3 class="font-black text-lg text-gray-900">Editar Jugadora</h3>
          <p class="text-xs text-gray-500 mt-1">{{ jugadora.nombre }} {{ jugadora.apellido }}</p>
        </div>
        <button 
          @click="cerrar" 
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-6 space-y-6">
        <!-- Información básica (solo lectura) -->
        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700">Nombre Completo</label>
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
            {{ jugadora.nombre }} {{ jugadora.apellido }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700">Email</label>
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 text-sm truncate">
            {{ jugadora.email || '-' }}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700">Estado actual</label>
          <select
            v-model="estadoSalud"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="disponible">Disponible</option>
            <option value="lesionada">Lesionada</option>
            <option value="recuperacion">En recuperación</option>
            <option value="vacaciones">De vacaciones</option>
            <option value="no_disponible">No disponible</option>
          </select>
          <p class="text-xs text-gray-500">Lesionada, recuperación, vacaciones y no disponible quedan fuera del cálculo de asistencia y de las inscripciones.</p>
        </div>

        <!-- Sección de Equipos -->
        <div class="space-y-3">
          <label class="block text-sm font-bold text-gray-700">Equipos</label>
          <p class="text-xs text-gray-500">Selecciona a qué equipos pertenece la jugadora</p>
          
          <div class="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <!-- Ascenso -->
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input 
                v-model="equiposSeleccionados" 
                type="checkbox" 
                value="ascenso"
                class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span class="flex-1 text-sm font-medium text-gray-700">Ascenso</span>
              <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Primera</span>
            </label>

            <!-- Escuela -->
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input 
                v-model="equiposSeleccionados" 
                type="checkbox" 
                value="escuela"
                class="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
              />
              <span class="flex-1 text-sm font-medium text-gray-700">Escuela</span>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Base</span>
            </label>

            <!-- Serie C -->
            <label class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input 
                v-model="equiposSeleccionados" 
                type="checkbox" 
                value="serieC"
                class="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />
              <span class="flex-1 text-sm font-medium text-gray-700">Serie C</span>
              <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Tercera</span>
            </label>
          </div>

          <!-- Información sobre "Ambos" -->
          <div v-if="equiposSeleccionados.length > 1" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-xs text-blue-700 font-semibold">
              ℹ️ Jugadora pertenecerá a {{ equiposSeleccionados.length }} equipos
            </p>
          </div>
        </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-bold text-gray-700">Dias habilitados de entrenamiento</label>
              <p class="text-xs text-gray-500 mt-1">Solo contará en asistencias y pendientes de los dias marcados para cada equipo.</p>
            </div>

            <div v-if="configuracionDiasPorEquipo.length === 0" class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700">
              Selecciona al menos un equipo para configurar los dias de entrenamiento.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="config in configuracionDiasPorEquipo"
                :key="config.equipo"
                class="rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <div class="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p class="text-sm font-black text-gray-900">{{ config.label }}</p>
                    <p class="text-xs text-gray-500">Dias oficiales del equipo</p>
                  </div>
                  <button
                    type="button"
                    @click="restablecerDiasEquipo(config.equipo)"
                    class="text-xs font-bold text-primary hover:text-primary-dark cursor-pointer"
                  >
                    Restablecer
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    v-for="dia in config.opciones"
                    :key="`${config.equipo}-${dia.value}`"
                    type="button"
                    @click="toggleDiaEquipo(config.equipo, dia.value)"
                    :class="[
                      'rounded-lg border px-3 py-3 text-left transition-colors cursor-pointer',
                      (disponibilidadEditadaNormalizada[config.equipo] || []).includes(dia.value)
                        ? 'border-primary bg-primary/10 text-primary-dark'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary/40'
                    ]"
                  >
                    <span class="block text-sm font-bold">{{ dia.label }}</span>
                    <span class="block text-[11px] mt-1 font-medium">
                      {{ (disponibilidadEditadaNormalizada[config.equipo] || []).includes(dia.value) ? 'Contar asistencia' : 'Excluir de asistencia' }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        <!-- Sección de peligro: Eliminar -->
        <div class="border-t pt-6 border-gray-200">
          <div class="space-y-3">
            <h4 class="text-sm font-bold text-red-700 flex items-center gap-2">
              <span class="text-lg">⚠️</span> Zona de peligro
            </h4>
            <p class="text-xs text-gray-600">
              Si eliminas este perfil, la jugadora perderá acceso a su cuenta y todos sus datos serán eliminados. Esta acción no se puede deshacer.
            </p>
            <button
              @click="confirmarEliminacion"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🗑️</span>
              <span>Eliminar Perfil Permanentemente</span>
            </button>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-xs font-semibold text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Footer con botones -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
        <button
          @click="cerrar"
          :disabled="isLoading"
          class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          @click="guardarCambios"
          :disabled="isLoading || !cambiosDetectados"
          class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="!isLoading">💾</span>
          <span v-if="isLoading" class="inline-block animate-spin">⏳</span>
          <span>{{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { actualizarPerfilJugadora, eliminarJugadora } from '../firebase/jugadorasAuth';
import { sincronizarInscripcionesPorDisponibilidadJugadora } from '../firebase/inscripciones';
import {
  normalizarDisponibilidadEntrenamientos,
  obtenerDiasBasePorEquipo,
  obtenerEtiquetasDiasSemana,
  obtenerEquiposJugadoraDisponibilidad,
  normalizarEquipoDisponibilidad
} from '../utils/disponibilidadEntrenamientos';

const props = defineProps({
  jugadora: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'actualizado', 'eliminado']);

const isLoading = ref(false);
const error = ref(null);
const equiposSeleccionados = ref([]);
const disponibilidadEntrenamientos = ref({});
const estadoSalud = ref('disponible');

const etiquetasEquipo = {
  ascenso: 'Ascenso',
  escuela: 'Escuela',
  serieC: 'Serie C'
};

const serializarEquipos = (equipos = []) => {
  return [...equipos].sort().join(',');
};

const serializarDisponibilidad = (disponibilidad = {}) => {
  return JSON.stringify(
    Object.keys(disponibilidad)
      .sort()
      .reduce((acc, equipo) => {
        acc[equipo] = [...(disponibilidad[equipo] || [])].sort((a, b) => a - b);
        return acc;
      }, {})
  );
};

const disponibilidadActualNormalizada = computed(() => {
  return normalizarDisponibilidadEntrenamientos(
    props.jugadora?.disponibilidadEntrenamientos || {},
    obtenerEquiposJugadoraDisponibilidad(props.jugadora)
  );
});

const disponibilidadEditadaNormalizada = computed(() => {
  return normalizarDisponibilidadEntrenamientos(
    disponibilidadEntrenamientos.value,
    equiposSeleccionados.value
  );
});

const configuracionDiasPorEquipo = computed(() => {
  return equiposSeleccionados.value.map((equipo) => ({
    equipo,
    label: etiquetasEquipo[equipo] || equipo,
    opciones: obtenerEtiquetasDiasSemana(obtenerDiasBasePorEquipo(equipo)),
    base: obtenerEtiquetasDiasSemana(obtenerDiasBasePorEquipo(equipo))
  }));
});

// Inicializar equipos seleccionados basado en el equipo actual
const inicializarEquipos = () => {
  equiposSeleccionados.value = obtenerEquiposJugadoraDisponibilidad(props.jugadora);
  disponibilidadEntrenamientos.value = normalizarDisponibilidadEntrenamientos(
    props.jugadora?.disponibilidadEntrenamientos || {},
    equiposSeleccionados.value
  );
  estadoSalud.value = props.jugadora?.estadoSalud || 'disponible';
};

// Detectar cambios
const cambiosDetectados = computed(() => {
  const equiposActuales = obtenerEquiposJugadoraDisponibilidad(props.jugadora);
  const huboCambioEquipos = serializarEquipos(equiposActuales) !== serializarEquipos(equiposSeleccionados.value);
  const huboCambioDisponibilidad = serializarDisponibilidad(disponibilidadActualNormalizada.value) !== serializarDisponibilidad(disponibilidadEditadaNormalizada.value);
  const huboCambioEstado = (props.jugadora?.estadoSalud || 'disponible') !== estadoSalud.value;

  return huboCambioEquipos || huboCambioDisponibilidad || huboCambioEstado;
});

// Determinar el valor final del equipo basado en las selecciones
const determinarEquipoFinal = () => {
  if (equiposSeleccionados.value.length === 0) return ['ascenso']; // Default
  return [...equiposSeleccionados.value];
};

const toggleDiaEquipo = (equipo, dia) => {
  const equipoNormalizado = normalizarEquipoDisponibilidad(equipo);
  const actuales = new Set(disponibilidadEntrenamientos.value[equipoNormalizado] || []);

  if (actuales.has(dia)) {
    if (actuales.size === 1) {
      return;
    }
    actuales.delete(dia);
  } else {
    actuales.add(dia);
  }

  disponibilidadEntrenamientos.value = {
    ...disponibilidadEntrenamientos.value,
    [equipoNormalizado]: [...actuales].sort((a, b) => a - b)
  };
};

const restablecerDiasEquipo = (equipo) => {
  const equipoNormalizado = normalizarEquipoDisponibilidad(equipo);
  disponibilidadEntrenamientos.value = {
    ...disponibilidadEntrenamientos.value,
    [equipoNormalizado]: obtenerDiasBasePorEquipo(equipoNormalizado)
  };
};

const guardarCambios = async () => {
  if (!cambiosDetectados.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const equiposFinal = determinarEquipoFinal();
    const disponibilidadFinal = normalizarDisponibilidadEntrenamientos(
      disponibilidadEntrenamientos.value,
      equiposFinal
    );
    
    const actualizado = await actualizarPerfilJugadora(
      props.jugadora.id,
      {
        ...props.jugadora,
        equipos: equiposFinal,
        disponibilidadEntrenamientos: disponibilidadFinal,
        estadoSalud: estadoSalud.value
      }
    );

    if (actualizado) {
      const jugadoraActualizada = {
        ...props.jugadora,
        equipos: equiposFinal,
        disponibilidadEntrenamientos: disponibilidadFinal,
        estadoSalud: estadoSalud.value
      };

      const sincronizado = await sincronizarInscripcionesPorDisponibilidadJugadora({
        ...jugadoraActualizada,
        id: props.jugadora.id,
        uid: props.jugadora.uid || props.jugadora.id
      });

      if (!sincronizado) {
        error.value = 'Se guardo la disponibilidad, pero no se pudo sincronizar las inscripciones automaticamente.';
        return;
      }

      emit('actualizado', jugadoraActualizada);
      cerrar();
    } else {
      error.value = 'No se pudo guardar los cambios. Intenta de nuevo.';
    }
  } catch (err) {
    error.value = err.message || 'Error al guardar cambios';
  } finally {
    isLoading.value = false;
  }
};

const confirmarEliminacion = () => {
  const mensaje = `¿Estás seguro de que deseas eliminar el perfil de ${props.jugadora.nombre} ${props.jugadora.apellido}? Esta acción no se puede deshacer.`;
  
  if (window.confirm(mensaje)) {
    eliminarPerfil();
  }
};

const eliminarPerfil = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const eliminado = await eliminarJugadora(props.jugadora.id);

    if (eliminado) {
      emit('eliminado', props.jugadora.id);
      cerrar();
    } else {
      error.value = 'No se pudo eliminar el perfil. Intenta de nuevo.';
    }
  } catch (err) {
    error.value = err.message || 'Error al eliminar perfil';
  } finally {
    isLoading.value = false;
  }
};

const cerrar = () => {
  emit('close');
};

// Watch para inicializar equipos cuando se abre el modal
import { watch } from 'vue';
watch(() => props.visible, (newVal) => {
  if (newVal) {
    inicializarEquipos();
    error.value = null;
  }
});

watch(equiposSeleccionados, (equipos) => {
  disponibilidadEntrenamientos.value = normalizarDisponibilidadEntrenamientos(
    disponibilidadEntrenamientos.value,
    equipos
  );
}, { deep: true });
</script>

<style scoped>
input[type="checkbox"]:checked {
  background-color: currentColor;
}
</style>
