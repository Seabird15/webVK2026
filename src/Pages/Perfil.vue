<template>
  <div class="min-h-screen bg-black">
    <EntrenamientosHeader
      :titulo="'Mi Perfil'"
      :equipo="categoriaSeleccionada"
      @logout="handleLogout"
    />

    <main class="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      <div class="mb-5">
        <button
          type="button"
          @click="handleBack"
          class="min-h-11 cursor-pointer rounded-lg border border-white/20 px-4 py-2 font-bold text-white transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          ← Volver
        </button>
      </div>

      <div v-if="mensajeExito" class="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900 shadow-sm" role="status" aria-live="polite">
        <p class="font-bold">Perfil actualizado</p>
        <p class="mt-1 text-sm text-pretty">{{ mensajeExito }}</p>
      </div>

      <div v-if="cargandoPerfil" class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg" role="status">
        <p class="font-semibold text-gray-700">Consultando tus datos de perfil...</p>
        <div class="mx-auto mt-5 grid max-w-xl gap-3 sm:grid-cols-2" aria-hidden="true">
          <div class="h-11 rounded-lg bg-gray-100"></div>
          <div class="h-11 rounded-lg bg-gray-100"></div>
          <div class="h-11 rounded-lg bg-gray-100"></div>
          <div class="h-11 rounded-lg bg-gray-100"></div>
        </div>
      </div>
      <div v-else-if="errorCarga" class="rounded-2xl border border-red-200 bg-white p-6 shadow-lg" role="alert">
        <p class="font-bold text-red-800">No pudimos cargar tu perfil</p>
        <p class="mt-1 text-sm text-gray-700 text-pretty">{{ errorCarga }}</p>
        <button
          type="button"
          class="mt-4 min-h-11 rounded-lg bg-primary-dark px-4 py-2 font-bold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          @click="cargarPerfil"
        >
          Reintentar
        </button>
      </div>
      <template v-else>
      <!-- Tabs -->
      <div class="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
        <button
          @click="tabActivo = 'datos'"
          :class="[
            'min-h-11 cursor-pointer border-b-2 px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
            tabActivo === 'datos'
              ? 'border-primary text-primary-dark'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
          :aria-pressed="tabActivo === 'datos'"
        >
          Datos Personales
        </button>

      </div>

      <!-- Tab: Datos Personales -->
      <div v-if="tabActivo === 'datos'" class="space-y-6">
        <!-- Vista modo lectura -->
        <div v-if="!editando" class="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-8">
          <!-- Foto de perfil -->
          <div class="flex flex-col lg:flex-row gap-8">
            <div v-if="fotoPerfil" class="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img :src="fotoPerfil" alt="Perfil" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h2 class="text-3xl font-bold mb-2">
                {{ formData.nombre }} {{ formData.apellido }}
              </h2>
              <div class="space-y-2 text-gray-600">
                <p><strong>Email:</strong> {{ jugadoraAuthUser?.email }}</p>
                <p><strong>Posición:</strong> {{ formData.posicion }}</p>
                <p><strong>Dorsal:</strong> #{{ formData.dorsal }}</p>
                <p><strong>Equipos:</strong> {{ equiposSeleccionadosTexto }}</p>
                <p><strong>Estado:</strong> {{ formatearEstadoSalud(formData.estadoSalud) }}</p>
                <p><strong>Fecha de nacimiento:</strong> {{ formatearFecha(formData.fechaNacimiento) }}</p>
                <p v-if="formData.pieHabil"><strong>Pie hábil:</strong> {{ formData.pieHabil }}</p>
                <p v-if="formData.aniosTrayectoria"><strong>Trayectoria:</strong> {{ formData.aniosTrayectoria }} años</p>
                <p v-if="formData.instagram"><strong>Instagram:</strong> {{ formData.instagram }}</p>
              </div>
            </div>
          </div>

          <div v-if="formData.bioPublica" class="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
            <p class="text-xs font-bold uppercase tracking-wide text-gray-500">Bio pública</p>
            <p class="mt-2 text-sm leading-7 text-gray-700">{{ formData.bioPublica }}</p>
          </div>

          <div v-if="formData.galeriaPublica.length" class="space-y-3">
            <p class="text-xs font-bold uppercase tracking-wide text-gray-500">Galería pública</p>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
              <a
                v-for="(foto, idx) in formData.galeriaPublica"
                :key="`${foto}-${idx}`"
                :href="foto"
                target="_blank"
                rel="noreferrer"
                class="overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                <img :src="foto" :alt="`Foto pública ${idx + 1}`" class="h-28 w-full object-cover" />
              </a>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-200">
            <button
              @click="activarEdicion"
              class="px-6 py-2 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary transition-colors cursor-pointer"
            >
              Editar Perfil
            </button>
          </div>
        </div>

        <!-- Vista modo edición -->
        <form v-else @submit.prevent="handleGuardar" class="space-y-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-8">
          <div class="border-b border-gray-200 pb-5">
            <p class="text-xs font-bold uppercase text-primary-dark">Edición de ficha</p>
            <h2 class="mt-1 text-2xl font-bold text-gray-900 text-balance">Mantén tu perfil al día</h2>
            <p class="mt-2 text-sm text-gray-600 text-pretty">Actualiza tus datos deportivos y la información que quieres compartir.</p>
          </div>

          <section class="space-y-5" aria-labelledby="perfil-datos-personales">
            <div>
              <h3 id="perfil-datos-personales" class="text-lg font-bold text-gray-900">Datos personales</h3>
              <p class="mt-1 text-sm text-gray-500">Los campos con * son necesarios para tu ficha.</p>
            </div>
          <!-- Nombre y Apellido -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Nombre *</label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                class="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Apellido *</label>
              <input
                v-model="formData.apellido"
                type="text"
                required
                class="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
              />
            </div>
          </div>
          </section>

          <section class="space-y-5 border-t border-gray-200 pt-6" aria-labelledby="perfil-datos-deportivos">
            <div>
              <h3 id="perfil-datos-deportivos" class="text-lg font-bold text-gray-900">Información deportiva</h3>
              <p class="mt-1 text-sm text-gray-500">Elige tus equipos y completa tus datos en cancha.</p>
            </div>
          <!-- Dorsal y Posición -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Dorsal *</label>
              <input
                v-model.number="formData.dorsal"
                type="number"
                required
                min="1"
                max="99"
                class="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Posición *</label>
              <select
                v-model="formData.posicion"
                required
                class="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
              >
                <option value="">Selecciona posición</option>
                <option value="Profe">Profe</option>
                <option value="Portera">Portera</option>
                <option value="Cierre">Cierre</option>
                <option value="Medio">Medio</option>
                <option value="Pívot">Pívot</option>
                <option value="Ala">Ala</option>
              </select>
            </div>
          </div>

          <!-- Equipos y Fecha de nacimiento -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Equipos *</label>
              <p class="text-xs text-gray-500 mb-3">Puedes elegir uno, dos o los tres equipos.</p>
              <div               class="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <label
                  v-for="opcion in opcionesEquipos"
                  :key="opcion.value"
                  class="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white"
                >
                  <input
                    v-model="formData.equipos"
                    type="checkbox"
                    :value="opcion.value"
                    class="size-5 rounded border-gray-300 text-primary focus:ring-primary"
                    :disabled="isLoading"
                  />
                  <span class="font-medium text-gray-700">{{ opcion.label }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Fecha de nacimiento *</label>
              <input
                v-model="formData.fechaNacimiento"
                type="date"
                required
                class="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
              />
            </div>
          </div>
          </section>

          <section class="space-y-5 border-t border-gray-200 pt-6" aria-labelledby="perfil-publico">
            <div>
              <h3 id="perfil-publico" class="text-lg font-bold text-gray-900">Tu perfil público</h3>
              <p class="mt-1 text-sm text-gray-500">Comparte solo lo que te sientas cómoda mostrando.</p>
            </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Estado actual</label>
            <div class="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <p class="font-semibold">{{ formatearEstadoSalud(formData.estadoSalud) }}</p>
              <p class="mt-1 text-xs text-gray-500">Este estado solo puede ser modificado desde administración.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Pie hábil</label>
              <select
                v-model="formData.pieHabil"
                class="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
              >
                <option value="">Prefiero no mostrarlo</option>
                <option value="Derecha">Derecha</option>
                <option value="Izquierda">Izquierda</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Años de trayectoria</label>
              <input
                v-model.number="formData.aniosTrayectoria"
                type="number"
                min="0"
                max="60"
                class="min-h-24 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
                placeholder="Ej. 6"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Instagram público</label>
              <input
                v-model="formData.instagram"
                type="text"
                class="min-h-24 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
                placeholder="Ej. @tuusuario"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Fotos para ficha pública</label>
              <textarea
                v-model="galeriaPublicaTexto"
                rows="4"
                class="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:font-semibold focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                :disabled="isLoading"
                placeholder="Pega una URL por línea"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">Puedes pegar hasta 6 enlaces de fotos alojadas en Firebase o donde ya estén publicadas.</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Bio pública</label>
            <textarea
              v-model="formData.bioPublica"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              :disabled="isLoading"
              placeholder="Cuéntale a la gente qué te mueve, cómo juegas o qué significa Vikingas para ti."
            ></textarea>
          </div>

          <!-- Foto de perfil -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Foto de perfil</label>
            <div class="flex items-center gap-4">
              <div v-if="previewFoto" class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img :src="previewFoto" alt="Preview" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <input
                  ref="inputFoto"
                  type="file"
                  accept="image/*"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="handleFotoChange"
                  :disabled="isLoading"
                />
                <p class="text-xs text-gray-500 mt-1">JPG, PNG o GIF. Máximo 5MB</p>
              </div>
            </div>
          </div>
          </section>

          <!-- Errores -->
          <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4" role="alert" aria-live="assertive">
            <p class="text-sm font-semibold text-red-800 text-pretty">{{ error }}</p>
          </div>

          <!-- Botones -->
          <div class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:gap-4">
            <button
              type="button"
              @click="cancelarEdicion"
              :disabled="isLoading"
              class="min-h-12 flex-1 cursor-pointer rounded-xl border border-gray-300 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="min-h-12 flex-1 cursor-pointer rounded-xl bg-primary-dark px-6 py-3 font-bold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Mis Categorías -->

      <div v-if="tabActivo === 'categorias'" class="space-y-6">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-8">
          <h2 class="text-2xl font-bold mb-6">Mis equipos</h2>

          <div v-if="equiposDisponibles.length > 1" class="space-y-4">
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-blue-900 font-bold">Perteneces a varios equipos</p>
              <p class="text-blue-700 text-sm mt-1">Elige qué equipo quieres visualizar en la app.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <button
                v-for="opcion in equiposDisponibles"
                :key="opcion.value"
                @click="cambiarEquipoDesdePerf(opcion.value)"
                :class="[
                  'p-6 rounded-lg font-bold transition-colors cursor-pointer',
                  categoriaSeleccionada === opcion.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ opcion.emoji }} {{ opcion.ctaLabel }}
              </button>
            </div>
          </div>

          <div v-else class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-900 font-bold">Equipo: {{ equiposSeleccionadosTexto }}</p>
            <p class="text-green-700 text-sm mt-1">Estás inscrita en {{ equiposSeleccionadosTexto.toLowerCase() }}</p>
          </div>
        </div>
      </div>
      </template>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import EntrenamientosHeader from '../components/EntrenamientosHeader.vue';
import { 
  logoutJugadora, 
  jugadoraAuthUser, 
  jugadoraData, 
  actualizarPerfilJugadora,
  actualizarCategoriaSeleccionadaJugadora,
  errorJugadora,
  fetchJugadoraData,
  authReady as authJugadoraReady
} from '../firebase/jugadorasAuth';

const opcionesEquipos = [
  { value: 'ascenso', label: 'Ascenso', ctaLabel: 'Equipo Ascenso', emoji: '🏆' },
  { value: 'serieC', label: 'Serie C', ctaLabel: 'Equipo Serie C', emoji: '💜' },
  { value: 'escuela', label: 'Escuela', ctaLabel: 'Equipo Escuela', emoji: '📚' }
];

const normalizarEquipo = (equipo) => {
  const valor = (equipo || '').toString().trim().toLowerCase();
  if (valor === 'seriec') return 'serieC';
  if (valor === 'ascenso' || valor === 'escuela') return valor;
  return '';
};

const obtenerEquiposDesdeDatos = (data = {}) => {
  if (Array.isArray(data?.equipos) && data.equipos.length > 0) {
    return [...new Set(data.equipos.map(normalizarEquipo).filter(Boolean))];
  }

  if (data?.equipo === 'ambos') {
    return ['ascenso', 'escuela'];
  }

  const equipoNormalizado = normalizarEquipo(data?.equipo);
  return equipoNormalizado ? [equipoNormalizado] : [];
};

const formatearEquipos = (equipos = []) => {
  const labels = opcionesEquipos
    .filter(opcion => equipos.includes(opcion.value))
    .map(opcion => opcion.label);

  return labels.length ? labels.join(', ') : '-';
};

const router = useRouter();
const editando = ref(false);
const tabActivo = ref('datos');
const previewFoto = ref(null);
const fotoFile = ref(null);
const galeriaPublicaTexto = ref('');
const isLoading = ref(false);
const error = ref(null);
const mensajeExito = ref('');
const cargandoPerfil = ref(!jugadoraData.value);
const errorCarga = ref('');
const equiposIniciales = obtenerEquiposDesdeDatos(jugadoraData.value);
const categoriaSeleccionada = ref(jugadoraData.value?.categoriaSeleccionada || equiposIniciales[0] || 'ascenso');

const fotoPerfil = ref(jugadoraData.value?.fotoPerfil || null);

const formData = reactive({
  nombre: jugadoraData.value?.nombre || '',
  apellido: jugadoraData.value?.apellido || '',
  dorsal: jugadoraData.value?.dorsal || null,
  posicion: jugadoraData.value?.posicion || '',
  equipos: equiposIniciales,
  fechaNacimiento: jugadoraData.value?.fechaNacimiento || '',
  estadoSalud: jugadoraData.value?.estadoSalud || 'disponible',
  pieHabil: jugadoraData.value?.pieHabil || '',
  aniosTrayectoria: jugadoraData.value?.aniosTrayectoria || null,
  instagram: jugadoraData.value?.instagram || '',
  bioPublica: jugadoraData.value?.bioPublica || '',
  galeriaPublica: Array.isArray(jugadoraData.value?.galeriaPublica) ? jugadoraData.value.galeriaPublica : []
});

const equiposSeleccionadosTexto = computed(() => formatearEquipos(formData.equipos));
const equiposDisponibles = computed(() => opcionesEquipos.filter(opcion => formData.equipos.includes(opcion.value)));

const sincronizarFormulario = (datos = jugadoraData.value) => {
  if (!datos) return;
  formData.nombre = datos.nombre || '';
  formData.apellido = datos.apellido || '';
  formData.dorsal = datos.dorsal || null;
  formData.posicion = datos.posicion || '';
  formData.equipos = obtenerEquiposDesdeDatos(datos);
  formData.fechaNacimiento = datos.fechaNacimiento || '';
  formData.estadoSalud = datos.estadoSalud || 'disponible';
  formData.pieHabil = datos.pieHabil || '';
  formData.aniosTrayectoria = datos.aniosTrayectoria || null;
  formData.instagram = datos.instagram || '';
  formData.bioPublica = datos.bioPublica || '';
  formData.galeriaPublica = Array.isArray(datos.galeriaPublica) ? datos.galeriaPublica : [];
  categoriaSeleccionada.value = datos.categoriaSeleccionada || formData.equipos[0] || 'ascenso';
  fotoPerfil.value = datos.fotoPerfil || null;
};

watch(jugadoraData, (datos) => {
  if (!datos || datos.id !== jugadoraAuthUser.value?.uid) return;
  if (!editando.value) sincronizarFormulario(datos);
  cargandoPerfil.value = false;
  errorCarga.value = '';
}, { immediate: true });

watch(authJugadoraReady, (lista) => {
  if (lista && !jugadoraData.value && !cargandoPerfil.value) {
    errorCarga.value = errorJugadora.value || 'No encontramos información de perfil asociada a tu cuenta.';
  }
});

const formatearEstadoSalud = (estado) => {
  const map = {
    disponible: 'Disponible',
    lesionada: 'Lesionada',
    recuperacion: 'En recuperación',
    vacaciones: 'De vacaciones',
    no_disponible: 'No disponible'
  };
  return map[estado] || 'Disponible';
};

// Verificar autenticación
if (!jugadoraAuthUser.value) {
  router.push('/login-jugadora');
}

const formatearFecha = (date) => {
  if (!date) return '-';
  
  // Si es un string en formato YYYY-MM-DD, parsearlo manualmente
  if (typeof date === 'string' && date.includes('-')) {
    const [year, month, day] = date.split('-').map(Number);
    const d = new Date(year, month - 1, day); // month es 0-indexed
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Para otros formatos
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const parsearGaleriaPublica = (texto = '') => {
  return [...new Set(
    texto
      .split(/\r?\n|,/) 
      .map(item => item.trim())
      .filter(item => /^https?:\/\//i.test(item))
  )].slice(0, 6);
};

const formatearGaleriaPublica = (galeria = []) => {
  return (Array.isArray(galeria) ? galeria : []).join('\n');
};

const activarEdicion = () => {
  mensajeExito.value = '';
  error.value = null;
  editando.value = true;
  previewFoto.value = fotoPerfil.value;
  fotoFile.value = null;
  galeriaPublicaTexto.value = formatearGaleriaPublica(formData.galeriaPublica);
};

const cancelarEdicion = () => {
  editando.value = false;
  // Restaurar valores originales
  formData.nombre = jugadoraData.value?.nombre || '';
  formData.apellido = jugadoraData.value?.apellido || '';
  formData.dorsal = jugadoraData.value?.dorsal || null;
  formData.posicion = jugadoraData.value?.posicion || '';
  formData.equipos = obtenerEquiposDesdeDatos(jugadoraData.value);
  formData.fechaNacimiento = jugadoraData.value?.fechaNacimiento || '';
  formData.estadoSalud = jugadoraData.value?.estadoSalud || 'disponible';
  formData.pieHabil = jugadoraData.value?.pieHabil || '';
  formData.aniosTrayectoria = jugadoraData.value?.aniosTrayectoria || null;
  formData.instagram = jugadoraData.value?.instagram || '';
  formData.bioPublica = jugadoraData.value?.bioPublica || '';
  formData.galeriaPublica = Array.isArray(jugadoraData.value?.galeriaPublica) ? jugadoraData.value.galeriaPublica : [];
  previewFoto.value = null;
  fotoFile.value = null;
  galeriaPublicaTexto.value = '';
  error.value = null;
};

const handleFotoChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'La foto no debe superar 5MB';
      return;
    }

    fotoFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewFoto.value = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleGuardar = async () => {
  error.value = null;
  mensajeExito.value = '';

  if (!formData.nombre || !formData.apellido || formData.equipos.length === 0 || !formData.dorsal || !formData.posicion || !formData.fechaNacimiento) {
    error.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  const categoriaActualizada = formData.equipos.includes(categoriaSeleccionada.value)
    ? categoriaSeleccionada.value
    : formData.equipos[0];
  const galeriaPublica = parsearGaleriaPublica(galeriaPublicaTexto.value);

  isLoading.value = true;
  try {
    const success = await actualizarPerfilJugadora(
      jugadoraAuthUser.value.uid,
      {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dorsal: formData.dorsal,
        posicion: formData.posicion,
        equipos: [...formData.equipos],
        fechaNacimiento: formData.fechaNacimiento,
        categoriaSeleccionada: categoriaActualizada,
        pieHabil: formData.pieHabil,
        aniosTrayectoria: formData.aniosTrayectoria || null,
        instagram: formData.instagram.trim(),
        bioPublica: formData.bioPublica.trim(),
        galeriaPublica
      },
      fotoFile.value
    );

    if (success) {
      fotoPerfil.value = jugadoraData.value?.fotoPerfil || fotoPerfil.value;
      editando.value = false;
      mensajeExito.value = 'Tus cambios se guardaron correctamente.';
    } else {
      error.value = errorJugadora.value || 'Error al guardar cambios';
    }
  } catch (err) {
    error.value = errorJugadora.value || err?.message || 'Error al guardar cambios';
  } finally {
    isLoading.value = false;
  }
};

const cambiarEquipoDesdePerf = async (equipo) => {
  categoriaSeleccionada.value = equipo;
  if (jugadoraAuthUser.value?.uid) {
    await actualizarCategoriaSeleccionadaJugadora(jugadoraAuthUser.value.uid, equipo);
  }
};

const handleBack = () => {
  router.push('/entrenamientos');
};

const handleLogout = async () => {
  await logoutJugadora();
  router.push('/');
};

const cargarPerfil = async () => {
  const uid = jugadoraAuthUser.value?.uid;
  if (!uid) {
    cargandoPerfil.value = false;
    errorCarga.value = 'No se encontró una sesión activa de jugadora.';
    return;
  }

  cargandoPerfil.value = true;
  errorCarga.value = '';
  errorJugadora.value = null;

  if (jugadoraData.value?.id === uid) {
    sincronizarFormulario(jugadoraData.value);
    cargandoPerfil.value = false;
    return;
  }

  const datos = await fetchJugadoraData(uid, 'jugadoraRegistro');
  if (datos) {
    sincronizarFormulario(datos);
    cargandoPerfil.value = false;
  } else {
    cargandoPerfil.value = false;
    errorCarga.value = errorJugadora.value || 'No encontramos información de perfil asociada a tu cuenta.';
  }
};

cargarPerfil();
</script>
