<template>
  <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
    <header class="bg-[#17231d] px-5 py-6 text-white sm:px-7">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Campeonato interno 2026</p>
      <h2 class="mt-2 text-2xl font-black">Resultados en vivo</h2>
      <p class="mt-1 text-sm text-white/70">Anota los goles y el estado de cada partido. La vista pública se actualiza sola.</p>
    </header>

    <div class="space-y-6 p-4 sm:p-6">
      <!-- Editor de nóminas -->
      <details class="rounded-xl border border-gray-200 bg-gray-50">
        <summary class="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-black text-gray-800">
          Editar nóminas de los equipos
          <span class="text-xs font-semibold text-gray-500">Agregar o quitar jugadoras</span>
        </summary>
        <div class="space-y-4 border-t border-gray-200 p-4">
          <p class="text-xs text-gray-500">Las capitanas aparecen con (C). Estas nóminas alimentan el selector de goleadoras de cada partido.</p>

          <div class="grid gap-4 lg:grid-cols-3">
            <div v-for="equipo in EQUIPOS_CAMPEONATO" :key="equipo.id" class="rounded-xl border border-gray-200 bg-white p-4">
              <p class="text-sm font-black text-gray-900">{{ equipo.nombre }}</p>

              <ul class="mt-3 space-y-2">
                <li v-for="(jugadora, index) in nominasEditables[equipo.id]" :key="`${equipo.id}-${index}`" class="flex items-center gap-2">
                  <input
                    v-model.trim="nominasEditables[equipo.id][index]"
                    maxlength="60"
                    class="min-h-10 w-full rounded-lg border border-gray-300 px-3 text-sm font-semibold focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    :aria-label="`Quitar jugadora`"
                    class="flex size-10 shrink-0 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"
                    @click="nominasEditables[equipo.id].splice(index, 1)"
                  >✕</button>
                </li>
              </ul>

              <button
                type="button"
                class="mt-3 min-h-10 w-full rounded-lg border border-dashed border-gray-300 text-sm font-bold text-gray-600 hover:bg-gray-50"
                @click="nominasEditables[equipo.id].push('')"
              >+ Agregar jugadora</button>

              <button
                type="button"
                :disabled="guardandoNomina === equipo.id"
                class="mt-3 min-h-11 w-full rounded-lg bg-primary-dark text-sm font-black text-white hover:bg-primary disabled:opacity-50"
                @click="guardarNomina(equipo.id)"
              >
                {{ guardandoNomina === equipo.id ? 'Guardando...' : 'Guardar nómina' }}
              </button>
            </div>
          </div>

          <p v-if="errorNominas" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{{ errorNominas }}</p>
        </div>
      </details>

      <p v-if="cargando" class="py-8 text-center text-sm font-semibold text-gray-500">Cargando partidos...</p>

      <template v-else>
        <div v-for="grupo in partidosPorFecha" :key="grupo.fecha" class="space-y-3">
          <h3 class="text-sm font-black uppercase tracking-widest text-gray-600">
            {{ grupo.esFinal ? '★ Gran final' : `Fecha ${grupo.fecha}` }} · {{ grupo.fechaLabel }}
          </h3>

          <div class="grid gap-3 lg:grid-cols-2">
            <article
              v-for="partido in grupo.partidos"
              :key="partido.id"
              class="rounded-xl border p-4"
              :class="partido.estado === 'en_juego' ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50'"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-xs font-black uppercase tracking-widest text-gray-500">{{ partido.hora }}</p>
                <select
                  :value="partido.estado"
                  class="min-h-9 rounded-lg border border-gray-300 bg-white px-2 text-xs font-bold focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  @change="cambiarEstado(partido, $event.target.value)"
                >
                  <option value="programado">Programado</option>
                  <option value="en_juego">En juego</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div class="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div class="text-center">
                  <img :src="escudoDe(partido.local)" :alt="nombreDe(partido.local)" class="mx-auto size-12 object-contain" />
                  <p class="mt-1 text-xs font-black text-gray-900">{{ nombreDe(partido.local) }}</p>
                </div>

                <div class="flex items-center gap-2">
                  <input
                    :value="partido.golesLocal ?? ''"
                    type="number" min="0" max="99" inputmode="numeric"
                    class="h-12 w-14 rounded-lg border border-gray-300 text-center text-xl font-black tabular-nums focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                    @change="cambiarGoles(partido, 'golesLocal', $event.target.value)"
                  />
                  <span class="text-lg font-black text-gray-400">-</span>
                  <input
                    :value="partido.golesVisita ?? ''"
                    type="number" min="0" max="99" inputmode="numeric"
                    class="h-12 w-14 rounded-lg border border-gray-300 text-center text-xl font-black tabular-nums focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                    @change="cambiarGoles(partido, 'golesVisita', $event.target.value)"
                  />
                </div>

                <div class="text-center">
                  <img :src="escudoDe(partido.visita)" :alt="nombreDe(partido.visita)" class="mx-auto size-12 object-contain" />
                  <p class="mt-1 text-xs font-black text-gray-900">{{ nombreDe(partido.visita) }}</p>
                </div>
              </div>

              <!-- Goleadoras -->
              <div v-if="!partido.esFinal" class="mt-4 border-t border-gray-200 pt-3">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Goleadoras</p>
                  <span class="text-[0.65rem] font-semibold" :class="golesAnotados(partido) === totalGoles(partido) ? 'text-emerald-600' : 'text-amber-600'">
                    {{ golesAnotados(partido) }}/{{ totalGoles(partido) }} goles asignados
                  </span>
                </div>

                <ul v-if="goleadorasDe(partido).length" class="mt-2 space-y-1.5">
                  <li v-for="(gol, index) in goleadorasDe(partido)" :key="`${partido.id}-gol-${index}`" class="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-1.5 text-sm">
                    <span class="font-semibold text-gray-800">⚽ {{ gol.nombre }}</span>
                    <button type="button" class="text-xs font-bold text-rose-600 hover:underline" @click="quitarGol(partido, index)">Quitar</button>
                  </li>
                </ul>
                <p v-else class="mt-2 text-xs text-gray-500">Sin goles anotados todavía.</p>

                <div class="mt-2 flex gap-2">
                  <select
                    v-model="golSeleccionado[partido.id]"
                    class="min-h-10 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Anotar gol a...</option>
                    <optgroup :label="nombreDe(partido.local)">
                      <option v-for="jugadora in nominas[partido.local] || []" :key="`${partido.id}-l-${jugadora}`" :value="`${partido.local}|${jugadora}`">{{ jugadora }}</option>
                    </optgroup>
                    <optgroup :label="nombreDe(partido.visita)">
                      <option v-for="jugadora in nominas[partido.visita] || []" :key="`${partido.id}-v-${jugadora}`" :value="`${partido.visita}|${jugadora}`">{{ jugadora }}</option>
                    </optgroup>
                  </select>
                  <button
                    type="button"
                    :disabled="!golSeleccionado[partido.id]"
                    class="min-h-10 shrink-0 rounded-lg bg-primary-dark px-3 text-sm font-black text-white hover:bg-primary disabled:opacity-50"
                    @click="agregarGol(partido)"
                  >+ Gol</button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <p v-if="mensaje" class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{{ mensaje }}</p>
        <p v-if="error" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{{ error }}</p>

        <!-- Vista previa de la tabla -->
        <div class="rounded-xl border border-gray-200">
          <p class="border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-600">Tabla calculada en vivo</p>
          <div class="overflow-x-auto">
            <table class="w-full min-w-120 text-sm">
              <thead>
                <tr class="border-b border-gray-200 text-left text-[0.65rem] font-black uppercase tracking-widest text-gray-500">
                  <th class="px-3 py-2">Equipo</th>
                  <th class="px-3 py-2 text-center">PJ</th>
                  <th class="px-3 py-2 text-center">G-E-P</th>
                  <th class="px-3 py-2 text-center">GF</th>
                  <th class="px-3 py-2 text-center">GC</th>
                  <th class="px-3 py-2 text-center">DG</th>
                  <th class="px-3 py-2 text-center">Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(equipo, index) in tabla" :key="equipo.id">
                  <td class="px-3 py-2 font-bold text-gray-900">
                    <span class="mr-1 text-xs" :class="index < 2 ? 'text-amber-600' : 'text-gray-400'">{{ index + 1 }}.</span>
                    {{ equipo.nombreCorto }}
                  </td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ equipo.pj }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ equipo.pg }}-{{ equipo.pe }}-{{ equipo.pp }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ equipo.gf }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ equipo.gc }}</td>
                  <td class="px-3 py-2 text-center tabular-nums">{{ equipo.dg > 0 ? `+${equipo.dg}` : equipo.dg }}</td>
                  <td class="px-3 py-2 text-center font-black tabular-nums text-amber-700">{{ equipo.pts }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import {
  EQUIPOS_CAMPEONATO,
  NOMINAS_INICIALES,
  escucharCampeonatoCompleto,
  inicializarPartidosCampeonato,
  inicializarNominasCampeonato,
  actualizarPartidoCampeonato,
  guardarNominaCampeonato,
  calcularTabla
} from '../firebase/campeonatoInterno2';
import escudoTinky from '../assets/campeonato-interno/escudo-tinky-winky.jpeg';
import escudoLegion from '../assets/campeonato-interno/escudo-legion-roja.jpeg';
import escudoValkirias from '../assets/campeonato-interno/escudo-valkirias.jpeg';
import logoBlanco from '../assets/campeonato-interno/VK LOGO BLANCO PNG.png';

const partidos = ref([]);
const nominas = ref({ ...NOMINAS_INICIALES });
const nominasEditables = ref({
  tinky: [...NOMINAS_INICIALES.tinky],
  legion: [...NOMINAS_INICIALES.legion],
  valkirias: [...NOMINAS_INICIALES.valkirias]
});
const cargando = ref(true);
const error = ref('');
const errorNominas = ref('');
const mensaje = ref('');
const guardandoNomina = ref('');
const golSeleccionado = reactive({});
let unsubscribe = null;
let temporizadorMensaje = null;

const escudos = { tinky: escudoTinky, legion: escudoLegion, valkirias: escudoValkirias, primero: logoBlanco, segundo: logoBlanco };
const nombres = { tinky: 'Tinky Winky', legion: 'Legión Roja', valkirias: 'Valkirias', primero: '1º tabla', segundo: '2º tabla' };

const escudoDe = (id) => escudos[id] || logoBlanco;
const nombreDe = (id) => nombres[id] || id;

const tabla = computed(() => calcularTabla(partidos.value));

const partidosPorFecha = computed(() => {
  const grupos = new Map();
  partidos.value.forEach((partido) => {
    if (!grupos.has(partido.fecha)) {
      grupos.set(partido.fecha, { fecha: partido.fecha, fechaLabel: partido.fechaLabel, esFinal: partido.esFinal === true, partidos: [] });
    }
    grupos.get(partido.fecha).partidos.push(partido);
  });
  return [...grupos.values()].sort((a, b) => a.fecha - b.fecha);
});

const goleadorasDe = (partido) => (Array.isArray(partido.goleadoras) ? partido.goleadoras : []);
const golesAnotados = (partido) => goleadorasDe(partido).length;
const totalGoles = (partido) => (Number(partido.golesLocal) || 0) + (Number(partido.golesVisita) || 0);

const mostrarMensaje = (texto) => {
  mensaje.value = texto;
  window.clearTimeout(temporizadorMensaje);
  temporizadorMensaje = window.setTimeout(() => { mensaje.value = ''; }, 2500);
};

const guardarPartido = async (partido, goleadoras = null) => {
  await actualizarPartidoCampeonato(partido.id, {
    golesLocal: partido.golesLocal,
    golesVisita: partido.golesVisita,
    estado: partido.estado,
    goleadoras: goleadoras ?? goleadorasDe(partido)
  });
};

const cambiarGoles = async (partido, campo, valor) => {
  error.value = '';
  try {
    await guardarPartido({ ...partido, [campo]: valor });
    mostrarMensaje('Marcador actualizado.');
  } catch (err) {
    error.value = err?.message || 'No se pudo guardar el marcador.';
  }
};

const cambiarEstado = async (partido, estado) => {
  error.value = '';
  try {
    await guardarPartido({ ...partido, estado });
    mostrarMensaje('Estado actualizado.');
  } catch (err) {
    error.value = err?.message || 'No se pudo actualizar el estado.';
  }
};

const agregarGol = async (partido) => {
  const seleccion = golSeleccionado[partido.id];
  if (!seleccion) return;
  const [equipoId, ...resto] = seleccion.split('|');
  const nombre = resto.join('|');
  error.value = '';
  try {
    await guardarPartido(partido, [...goleadorasDe(partido), { nombre, equipoId }]);
    golSeleccionado[partido.id] = '';
    mostrarMensaje(`Gol de ${nombre} anotado.`);
  } catch (err) {
    error.value = err?.message || 'No se pudo anotar el gol.';
  }
};

const quitarGol = async (partido, index) => {
  error.value = '';
  try {
    const goleadoras = goleadorasDe(partido).filter((_, i) => i !== index);
    await guardarPartido(partido, goleadoras);
    mostrarMensaje('Gol eliminado.');
  } catch (err) {
    error.value = err?.message || 'No se pudo quitar el gol.';
  }
};

const guardarNomina = async (equipoId) => {
  guardandoNomina.value = equipoId;
  errorNominas.value = '';
  try {
    const guardada = await guardarNominaCampeonato(equipoId, nominasEditables.value[equipoId]);
    nominasEditables.value[equipoId] = [...guardada];
    mostrarMensaje('Nómina actualizada.');
  } catch (err) {
    errorNominas.value = err?.message || 'No se pudo guardar la nómina.';
  } finally {
    guardandoNomina.value = '';
  }
};

onMounted(async () => {
  await inicializarPartidosCampeonato();
  await inicializarNominasCampeonato();
  unsubscribe = escucharCampeonatoCompleto(({ partidos: items, nominas: nominasNuevas }) => {
    partidos.value = items;
    nominas.value = nominasNuevas;
    EQUIPOS_CAMPEONATO.forEach((equipo) => {
      nominasEditables.value[equipo.id] = [...(nominasNuevas[equipo.id] || [])];
    });
    cargando.value = false;
  }, (err) => {
    error.value = err?.message || 'No se pudieron cargar los partidos.';
    cargando.value = false;
  });
});

onUnmounted(() => {
  unsubscribe?.();
  window.clearTimeout(temporizadorMensaje);
});
</script>
