<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary-dark">Mi Perfil</h1>
        <button
          @click="handleBack"
          class="px-4 my-2 py-2 text-primary-dark border border-primary-dark rounded-lg hover:bg-primary-dark hover:text-white transition-colors cursor-pointer"
        >
          ← Volver
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 mb-6 border-b border-gray-200">
        <button
          @click="tabActivo = 'datos'"
          :class="[
            'px-6 py-3 font-bold uppercase text-sm transition-colors cursor-pointer',
            tabActivo === 'datos'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Datos Personales
        </button>
      
      </div>

      <!-- Tab: Datos Personales -->
      <div v-if="tabActivo === 'datos'" class="space-y-6">
        <!-- Vista modo lectura -->
        <div v-if="!editando" class="bg-white rounded-lg shadow-lg p-8 space-y-6">
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
                <p><strong>Equipo:</strong> {{ formData.equipo === 'ambos' ? 'Ascenso y Escuela' : formData.equipo }}</p>
                <p><strong>Fecha de nacimiento:</strong> {{ formatearFecha(formData.fechaNacimiento) }}</p>
              </div>
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
        <form v-else @submit.prevent="handleGuardar" class="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <!-- Nombre y Apellido -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Nombre *</label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Apellido *</label>
              <input
                v-model="formData.apellido"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
              />
            </div>
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
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Posición *</label>
              <select
                v-model="formData.posicion"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

          <!-- Equipo y Fecha de nacimiento -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Equipo *</label>
              <select
                v-model="formData.equipo"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
              >
                <option value="ascenso">Ascenso</option>
                <option value="escuela">Escuela</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Fecha de nacimiento *</label>
              <input
                v-model="formData.fechaNacimiento"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
              />
            </div>
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

          <!-- Errores -->
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm font-semibold">{{ error }}</p>
          </div>

          <!-- Botones -->
          <div class="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="cancelarEdicion"
              :disabled="isLoading"
              class="flex-1 px-6 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-6 py-2 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary transition-colors disabled:opacity-50 cursor-pointer"
            >
              {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Tab: Mis Categorías -->
      <div v-if="tabActivo === 'categorias'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6">Mis equipos</h2>

          <div v-if="formData.equipo === 'ambos'" class="space-y-4">
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-blue-900 font-bold">Perteneces a ambos equipos</p>
              <p class="text-blue-700 text-sm mt-1">Puedes entrenar en Ascenso o Escuela</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                @click="cambiarEquipoDesdePerf('ascenso')"
                :class="[
                  'p-6 rounded-lg font-bold transition-colors cursor-pointer',
                  categoriaSeleccionada === 'ascenso'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                🏆 Equipo Ascenso
              </button>
              <button
                @click="cambiarEquipoDesdePerf('escuela')"
                :class="[
                  'p-6 rounded-lg font-bold transition-colors cursor-pointer',
                  categoriaSeleccionada === 'escuela'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                📚 Equipo Escuela
              </button>
            </div>
          </div>

          <div v-else class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-900 font-bold">Equipo: {{ formData.equipo === 'ascenso' ? 'Ascenso' : 'Escuela' }}</p>
            <p class="text-green-700 text-sm mt-1">Estás inscrita en {{ formData.equipo }}</p>
          </div>
        </div>
      </div>

      <!-- Zona de Peligro -->
      <div class="mt-8 bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-500">
        <button
          @click="handleLogout"
          class="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  logoutJugadora, 
  jugadoraAuthUser, 
  jugadoraData, 
  actualizarPerfilJugadora,
  isLoadingJugadora,
  errorJugadora
} from '../firebase/jugadorasAuth';

const router = useRouter();
const editando = ref(false);
const tabActivo = ref('datos');
const previewFoto = ref(null);
const fotoFile = ref(null);
const isLoading = ref(false);
const error = ref(null);
const categoriaSeleccionada = ref(localStorage.getItem('categoriaSeleccionada') || 'ascenso');

const fotoPerfil = ref(jugadoraData.value?.fotoPerfil || null);

const formData = reactive({
  nombre: jugadoraData.value?.nombre || '',
  apellido: jugadoraData.value?.apellido || '',
  dorsal: jugadoraData.value?.dorsal || null,
  posicion: jugadoraData.value?.posicion || '',
  equipo: jugadoraData.value?.equipo || 'ascenso',
  fechaNacimiento: jugadoraData.value?.fechaNacimiento || ''
});

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

const activarEdicion = () => {
  editando.value = true;
  previewFoto.value = fotoPerfil.value;
  fotoFile.value = null;
};

const cancelarEdicion = () => {
  editando.value = false;
  // Restaurar valores originales
  formData.nombre = jugadoraData.value?.nombre || '';
  formData.apellido = jugadoraData.value?.apellido || '';
  formData.dorsal = jugadoraData.value?.dorsal || null;
  formData.posicion = jugadoraData.value?.posicion || '';
  formData.equipo = jugadoraData.value?.equipo || 'ascenso';
  formData.fechaNacimiento = jugadoraData.value?.fechaNacimiento || '';
  previewFoto.value = null;
  fotoFile.value = null;
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

  if (!formData.nombre || !formData.apellido || !formData.dorsal || !formData.posicion || !formData.fechaNacimiento) {
    error.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  isLoading.value = true;

  const success = await actualizarPerfilJugadora(
    jugadoraAuthUser.value.uid,
    {
      nombre: formData.nombre,
      apellido: formData.apellido,
      dorsal: formData.dorsal,
      posicion: formData.posicion,
      equipo: formData.equipo,
      fechaNacimiento: formData.fechaNacimiento
    },
    fotoFile.value
  );

  isLoading.value = false;

  if (success) {
    // Actualizar referencia local
    fotoPerfil.value = jugadoraData.value?.fotoPerfil || null;
    editando.value = false;
  } else {
    error.value = errorJugadora.value || 'Error al guardar cambios';
  }
};

const cambiarEquipoDesdePerf = (equipo) => {
  categoriaSeleccionada.value = equipo;
  localStorage.setItem('categoriaSeleccionada', equipo);
};

const handleBack = () => {
  router.push('/entrenamientos');
};

const handleLogout = async () => {
  await logoutJugadora();
  router.push('/');
};

onMounted(() => {
  if (jugadoraData.value) {
    formData.nombre = jugadoraData.value.nombre || '';
    formData.apellido = jugadoraData.value.apellido || '';
    formData.dorsal = jugadoraData.value.dorsal || null;
    formData.posicion = jugadoraData.value.posicion || '';
    formData.equipo = jugadoraData.value.equipo || 'ascenso';
    formData.fechaNacimiento = jugadoraData.value.fechaNacimiento || '';
    fotoPerfil.value = jugadoraData.value.fotoPerfil || null;
  }
});
</script>
