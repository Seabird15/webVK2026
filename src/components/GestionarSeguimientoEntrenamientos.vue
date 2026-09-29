<template>
  <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
    <header class="bg-[#17231d] px-5 py-6 text-white sm:px-7">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Preparación física</p>
      <h2 class="mt-2 text-2xl font-black">Seguimiento de bienestar</h2>
      <p class="mt-1 text-sm text-white/70">Un solo chequeo por sesión: esfuerzo, recuperación y molestias.</p>
    </header>

    <div class="space-y-5 p-4 sm:p-6">
      <div class="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
        <article class="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
          <p class="text-[10px] font-black uppercase leading-tight text-gray-500 sm:text-xs">Respuestas</p>
          <p class="mt-1 text-xl font-black leading-tight text-gray-900 sm:text-2xl">{{ respuestasFiltradas.length }}</p>
        </article>
        <article class="min-w-0 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
          <p class="text-[10px] font-black uppercase leading-tight text-amber-800 sm:text-xs">Esfuerzo medio</p>
          <p class="mt-1 text-xl font-black leading-tight text-amber-950 sm:text-2xl">{{ promedio('rpe') }}<span class="text-xs font-bold sm:text-sm">/10</span></p>
          <p class="mt-1 text-[10px] leading-tight text-amber-900 sm:text-xs">0 reposo · 10 máximo</p>
        </article>
        <article class="min-w-0 rounded-xl border border-blue-200 bg-blue-50 p-3 sm:p-4">
          <p class="text-[10px] font-black uppercase leading-tight text-blue-800 sm:text-xs">Recuperación media</p>
          <p class="mt-1 text-xl font-black leading-tight text-blue-950 sm:text-2xl">{{ promedio('recuperacion') }}<span class="text-xs font-bold sm:text-sm">/10</span></p>
          <p class="mt-1 text-[10px] leading-tight text-blue-900 sm:text-xs">Promedio en escala 0–10</p>
        </article>
        <article class="min-w-0 rounded-xl border border-rose-200 bg-rose-50 p-3 sm:p-4">
          <p class="text-[10px] font-black uppercase leading-tight text-rose-800 sm:text-xs">Para revisar</p>
          <p class="mt-1 text-xl font-black leading-tight text-rose-950 sm:text-2xl">{{ cantidadAtencion }}</p>
          <p class="mt-1 text-[10px] leading-tight text-rose-900 sm:text-xs">Señales de seguimiento</p>
        </article>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <label class="text-sm font-bold text-gray-700">
          Equipo
          <select v-model="filtroEquipo" class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30">
            <option value="">Todos</option>
            <option value="ascenso">Ascenso</option>
            <option value="escuela">Escuela</option>
            <option value="serieC">Serie C</option>
          </select>
        </label>
        <label class="text-sm font-bold text-gray-700">
          Entrenamiento o jugadora
          <input v-model.trim="busqueda" type="search" placeholder="Buscar..." class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30" />
        </label>
      </div>

      <details class="rounded-xl border border-gray-200 bg-gray-50">
        <summary class="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-black text-gray-800">
          Disponibilidad del formulario
          <span class="text-xs font-semibold text-gray-500">Tipos y equipos</span>
        </summary>
        <div class="space-y-4 border-t border-gray-200 p-4">
          <div class="grid gap-4 md:grid-cols-2">
            <fieldset class="rounded-lg border border-gray-200 bg-white p-3">
              <legend class="px-1 text-xs font-black uppercase text-gray-600">Tipos de evento</legend>
              <div class="mt-1 grid gap-1 sm:grid-cols-2">
                <label v-for="tipo in TIPOS_SEGUIMIENTO" :key="tipo.value" class="flex min-h-10 items-center gap-2 text-sm font-semibold text-gray-700">
                  <input v-model="tiposHabilitados" type="checkbox" :value="tipo.value" class="size-4 accent-emerald-700" />
                  {{ tipo.label }}
                </label>
              </div>
            </fieldset>
            <fieldset class="rounded-lg border border-gray-200 bg-white p-3">
              <legend class="px-1 text-xs font-black uppercase text-gray-600">Equipos incluidos</legend>
              <div class="mt-1 grid gap-1 sm:grid-cols-2">
                <label v-for="equipo in EQUIPOS_SEGUIMIENTO" :key="equipo.value" class="flex min-h-10 items-center gap-2 text-sm font-semibold text-gray-700">
                  <input v-model="equiposHabilitados" type="checkbox" :value="equipo.value" class="size-4 accent-emerald-700" />
                  {{ equipo.label }}
                </label>
              </div>
            </fieldset>
          </div>
          <p class="text-xs text-gray-500">Por defecto solo se muestra para entrenamientos. Si no seleccionas tipos o equipos, el formulario queda desactivado.</p>
          <p v-if="errorDisponibilidad" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{{ errorDisponibilidad }}</p>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p v-if="mensajeDisponibilidad" class="text-sm font-semibold text-emerald-700">{{ mensajeDisponibilidad }}</p>
            <button type="button" :disabled="guardandoDisponibilidad" class="min-h-11 rounded-lg bg-primary-dark px-4 text-sm font-black text-white hover:bg-primary disabled:opacity-50" @click="guardarDisponibilidad">
              {{ guardandoDisponibilidad ? 'Guardando...' : 'Guardar disponibilidad' }}
            </button>
          </div>
        </div>
      </details>

      <details class="rounded-xl border border-gray-200 bg-gray-50">
        <summary class="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-black text-gray-800">
          Editar preguntas del formulario
          <span class="text-xs font-semibold text-gray-500">{{ preguntasConfig.length }} preguntas configuradas</span>
        </summary>
        <div class="space-y-3 border-t border-gray-200 p-4">
          <div v-for="(pregunta, index) in preguntasConfig" :key="pregunta.id" class="grid gap-2 rounded-lg border border-gray-200 bg-white p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <label class="text-xs font-bold text-gray-600">
              Pregunta
              <input v-model.trim="pregunta.label" maxlength="140" class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-900 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30" />
            </label>
            <label class="flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-700">
              <input v-model="pregunta.activo" type="checkbox" class="size-4 accent-emerald-700" /> Activa
            </label>
            <button v-if="!pregunta.esBase" type="button" class="min-h-11 rounded-lg px-3 text-sm font-bold text-rose-700 hover:bg-rose-50" @click="quitarPregunta(index)">Eliminar</button>
            <span v-else class="text-xs font-semibold text-gray-500">{{ etiquetaTipo(pregunta.tipo) }}</span>
          </div>

          <div class="grid gap-2 rounded-lg border border-dashed border-gray-300 bg-white p-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
            <label class="text-xs font-bold text-gray-600">
              Nueva pregunta
              <input v-model.trim="nuevaPregunta.label" maxlength="140" placeholder="Escribe la pregunta" class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm font-normal focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30" />
            </label>
            <label class="text-xs font-bold text-gray-600">
              Tipo de respuesta
              <select v-model="nuevaPregunta.tipo" class="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30">
                <option value="scale">Escala 0–10</option>
                <option value="yesNo">Sí / No</option>
                <option value="text">Texto breve</option>
              </select>
            </label>
            <button type="button" :disabled="!nuevaPregunta.label" class="min-h-11 rounded-lg border border-gray-300 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50" @click="agregarPregunta">Agregar pregunta</button>
          </div>

          <p v-if="errorConfiguracion" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{{ errorConfiguracion }}</p>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p v-if="mensajeConfiguracion" class="text-sm font-semibold text-emerald-700">{{ mensajeConfiguracion }}</p>
            <button type="button" :disabled="guardandoConfiguracion" class="min-h-11 rounded-lg bg-primary-dark px-4 text-sm font-black text-white hover:bg-primary disabled:opacity-50" @click="guardarPreguntas">
              {{ guardandoConfiguracion ? 'Guardando...' : 'Guardar preguntas' }}
            </button>
          </div>
        </div>
      </details>

      <p v-if="error" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{{ error }}</p>
      <p v-else-if="cargando" class="py-8 text-center text-sm font-semibold text-gray-500">Cargando seguimientos...</p>
      <div v-else-if="!respuestasFiltradas.length" class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p class="font-bold text-gray-700">No hay respuestas para estos filtros.</p>
        <p class="mt-1 text-sm text-gray-500">Los seguimientos completados aparecerán aquí durante el análisis del equipo.</p>
      </div>

      <div v-else class="space-y-3">
        <article v-for="respuesta in respuestasFiltradas" :key="respuesta.id" class="rounded-xl border border-gray-200 p-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <h3 class="font-black text-gray-900">{{ respuesta.jugadoraNombre }}</h3>
              <p class="mt-0.5 text-sm text-gray-600">{{ respuesta.entrenamientoNombre }} · {{ respuesta.equipo || 'Sin equipo' }}</p>
              <p class="mt-0.5 text-xs text-gray-500">{{ formatearFecha(respuesta.createdAt) }}</p>
            </div>
            <span class="w-fit rounded-full px-3 py-1 text-xs font-black" :class="claseAlerta(respuesta).clase">{{ claseAlerta(respuesta).etiqueta }}</span>
          </div>

          <div v-if="respuesta.preguntasRespondidas?.length" class="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <p v-for="pregunta in respuesta.preguntasRespondidas" :key="pregunta.id"><strong>{{ pregunta.label }}:</strong> {{ valorPregunta(pregunta) }}</p>
          </div>
          <div v-else class="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <p><strong>Esfuerzo:</strong> {{ respuesta.rpe }}/10</p>
            <p><strong>Fatiga:</strong> {{ respuesta.fatiga }}/10</p>
            <p><strong>Recuperación:</strong> {{ respuesta.recuperacion }}/10</p>
            <p><strong>Sueño:</strong> {{ respuesta.sueno }}/10</p>
            <p><strong>Piernas pesadas:</strong> {{ respuesta.piernasPesadas }}/10</p>
            <p><strong>Molestias:</strong> {{ respuesta.molestias ? `${respuesta.zonaMolestia} · ${respuesta.intensidadMolestia}/10` : 'No reportadas' }}</p>
          </div>

          <p v-if="respuesta.molestias" class="mt-2 text-sm text-gray-700">
            <strong>Detalle:</strong> {{ momentoMolestia(respuesta) }}<span v-if="respuesta.continuaMolestia"> · continúa</span><span v-if="respuesta.limitaMovimiento"> · limita movimiento</span>
          </p>
          <p v-if="respuesta.comentario" class="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700"><strong>Comentario:</strong> {{ respuesta.comentario }}</p>

          <div class="mt-3 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-3">
            <button type="button" class="min-h-11 rounded-lg px-3 text-sm font-bold text-primary-dark hover:bg-emerald-50 focus:outline-hidden focus:ring-2 focus:ring-primary" @click="cambiarRevision(respuesta)">
              {{ respuesta.revisada ? 'Quitar marca de revisión' : 'Marcar como revisada' }}
            </button>
            <button type="button" :aria-label="`Eliminar respuesta de ${respuesta.jugadoraNombre}`" class="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-rose-700 hover:bg-rose-50 focus:outline-hidden focus:ring-2 focus:ring-rose-500" @click="eliminarRespuesta(respuesta)">
              <TrashIcon class="size-4" /> Eliminar respuesta
            </button>
          </div>
        </article>
      </div>

      <p class="border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
        Las alertas orientan el seguimiento del equipo; no son diagnósticos ni comparaciones entre jugadoras.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import {
  escucharRespuestasPostEntrenamiento,
  marcarRespuestaPostEntrenamientoRevisada,
  eliminarRespuestaPostEntrenamiento,
  obtenerConfiguracionSeguimiento,
  guardarConfiguracionSeguimiento,
  guardarDisponibilidadSeguimiento,
  TIPOS_SEGUIMIENTO,
  EQUIPOS_SEGUIMIENTO,
  PREGUNTAS_SEGUIMIENTO_DEFAULT
} from '../firebase/seguimientoEntrenamientos';

const respuestas = ref([]);
const filtroEquipo = ref('');
const busqueda = ref('');
const cargando = ref(true);
const error = ref('');
const preguntasConfig = ref([]);
const tiposHabilitados = ref(['entrenamiento']);
const equiposHabilitados = ref(['ascenso', 'escuela', 'serieC']);
const guardandoDisponibilidad = ref(false);
const errorDisponibilidad = ref('');
const mensajeDisponibilidad = ref('');
const nuevaPregunta = ref({ label: '', tipo: 'scale' });
const guardandoConfiguracion = ref(false);
const errorConfiguracion = ref('');
const mensajeConfiguracion = ref('');
let unsubscribe = null;

const respuestasFiltradas = computed(() => respuestas.value.filter((respuesta) => {
  const coincideEquipo = !filtroEquipo.value || respuesta.equipo === filtroEquipo.value;
  const texto = `${respuesta.entrenamientoNombre || ''} ${respuesta.jugadoraNombre || ''}`.toLowerCase();
  return coincideEquipo && texto.includes(busqueda.value.toLowerCase());
}));

const promedio = (campo) => {
  if (!respuestasFiltradas.value.length) return '0.0';
  const total = respuestasFiltradas.value.reduce((suma, item) => suma + (Number(item[campo]) || 0), 0);
  return (total / respuestasFiltradas.value.length).toFixed(1);
};

const claseAlerta = (respuesta) => {
  if (Number(respuesta.intensidadMolestia) >= 8 || respuesta.limitaMovimiento) {
    return { etiqueta: 'Atención prioritaria', clase: 'bg-rose-100 text-rose-800' };
  }
  if ((respuesta.molestias && Number(respuesta.intensidadMolestia) >= 5)
    || Number(respuesta.fatiga) >= 8
    || Number(respuesta.recuperacion) <= 3
    || Number(respuesta.rpe) >= 9) {
    return { etiqueta: 'Conviene vigilar', clase: 'bg-amber-100 text-amber-900' };
  }
  return { etiqueta: 'Sin señal relevante', clase: 'bg-emerald-100 text-emerald-800' };
};

const cantidadAtencion = computed(() => respuestasFiltradas.value.filter((item) => claseAlerta(item).etiqueta !== 'Sin señal relevante').length);
const formatearFecha = (valor) => {
  const fecha = valor?.toDate ? valor.toDate() : valor?.seconds ? new Date(valor.seconds * 1000) : new Date(valor);
  if (Number.isNaN(fecha.getTime())) return 'Fecha no disponible';
  return fecha.toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const momentoMolestia = (respuesta) => ({
  durante: 'Durante el entrenamiento',
  despues: 'Después del entrenamiento',
  ambos: 'Durante y después del entrenamiento'
}[respuesta.momentoMolestia] || 'Momento no indicado');

const cambiarRevision = async (respuesta) => {
  try {
    await marcarRespuestaPostEntrenamientoRevisada(respuesta.id, !respuesta.revisada);
  } catch (err) {
    error.value = err?.message || 'No se pudo actualizar la revisión.';
  }
};

const cargarPreguntas = async () => {
  try {
    const configuracion = await obtenerConfiguracionSeguimiento();
    tiposHabilitados.value = configuracion.tiposHabilitados;
    equiposHabilitados.value = configuracion.equiposHabilitados;
    const base = new Set(PREGUNTAS_SEGUIMIENTO_DEFAULT.map((pregunta) => pregunta.id));
    preguntasConfig.value = configuracion.preguntas.map((pregunta) => ({
      ...pregunta,
      esBase: base.has(pregunta.id)
    }));
  } catch (err) {
    tiposHabilitados.value = ['entrenamiento'];
    equiposHabilitados.value = ['ascenso', 'escuela', 'serieC'];
    preguntasConfig.value = PREGUNTAS_SEGUIMIENTO_DEFAULT.map((pregunta) => ({ ...pregunta, esBase: true }));
    errorConfiguracion.value = err?.message || 'No se pudo cargar la configuración de preguntas.';
  }
};

const etiquetaTipo = (tipo) => ({ scale: 'Escala 0–10', yesNo: 'Sí / No', text: 'Texto breve' }[tipo] || tipo);

const guardarDisponibilidad = async () => {
  guardandoDisponibilidad.value = true;
  errorDisponibilidad.value = '';
  mensajeDisponibilidad.value = '';
  try {
    const guardada = await guardarDisponibilidadSeguimiento({
      tiposHabilitados: tiposHabilitados.value,
      equiposHabilitados: equiposHabilitados.value
    });
    tiposHabilitados.value = guardada.tiposHabilitados;
    equiposHabilitados.value = guardada.equiposHabilitados;
    mensajeDisponibilidad.value = 'Disponibilidad actualizada.';
  } catch (err) {
    errorDisponibilidad.value = err?.message || 'No se pudo guardar la disponibilidad.';
  } finally {
    guardandoDisponibilidad.value = false;
  }
};

const agregarPregunta = () => {
  const label = nuevaPregunta.value.label.trim();
  if (!label) return;
  preguntasConfig.value.push({
    id: `extra_${Date.now()}`,
    label,
    tipo: nuevaPregunta.value.tipo,
    minimo: 0,
    maximo: 10,
    activo: true,
    esBase: false
  });
  nuevaPregunta.value = { label: '', tipo: 'scale' };
  mensajeConfiguracion.value = '';
};

const quitarPregunta = (index) => preguntasConfig.value.splice(index, 1);

const guardarPreguntas = async () => {
  guardandoConfiguracion.value = true;
  errorConfiguracion.value = '';
  mensajeConfiguracion.value = '';
  try {
    const preguntasGuardadas = await guardarConfiguracionSeguimiento(preguntasConfig.value);
    const base = new Set(PREGUNTAS_SEGUIMIENTO_DEFAULT.map((pregunta) => pregunta.id));
    preguntasConfig.value = preguntasGuardadas.map((pregunta) => ({ ...pregunta, esBase: base.has(pregunta.id) }));
    mensajeConfiguracion.value = 'Preguntas actualizadas.';
  } catch (err) {
    errorConfiguracion.value = err?.message || 'No se pudieron guardar las preguntas.';
  } finally {
    guardandoConfiguracion.value = false;
  }
};

const valorPregunta = (pregunta) => {
  if (pregunta.tipo === 'yesNo') return pregunta.valor === true ? 'Sí' : pregunta.valor === false ? 'No' : 'Sin respuesta';
  if (pregunta.tipo === 'scale') return `${pregunta.valor ?? '—'}/10`;
  return pregunta.valor || 'Sin respuesta';
};

const eliminarRespuesta = async (respuesta) => {
  const confirmar = window.confirm(`¿Eliminar la respuesta de ${respuesta.jugadoraNombre} para "${respuesta.entrenamientoNombre}"? Esta acción no se puede deshacer.`);
  if (!confirmar) return;
  try {
    await eliminarRespuestaPostEntrenamiento(respuesta.id);
  } catch (err) {
    error.value = err?.message || 'No se pudo eliminar la respuesta.';
  }
};

onMounted(() => {
  cargarPreguntas();
  unsubscribe = escucharRespuestasPostEntrenamiento((items) => {
    respuestas.value = items.sort((a, b) => {
      const fechaA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
      const fechaB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
      return fechaB - fechaA;
    });
    cargando.value = false;
  }, (err) => {
    error.value = err?.message || 'No se pudieron cargar los seguimientos.';
    cargando.value = false;
  });
});

onUnmounted(() => unsubscribe?.());
</script>