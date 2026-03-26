<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Encabezado -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary-dark mb-2">Completa tu perfil</h1>
        <p class="text-gray-600">Tu solicitud fue aprobada. Por favor completa tu información personal.</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <!-- Nombre -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              v-model="formData.nombre"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tu nombre"
              :disabled="isLoading"
            />
          </div>

          <!-- Apellido -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Apellido *
            </label>
            <input
              v-model="formData.apellido"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tu apellido"
              :disabled="isLoading"
            />
          </div>
        </div>

        <!-- Equipos -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Equipos *
          </label>
          <p class="text-xs text-gray-500 mb-3">Puedes elegir uno, dos o los tres equipos.</p>
          <div class="space-y-2 border border-gray-300 rounded-lg p-4 bg-gray-50/60">
            <label
              v-for="opcion in opcionesEquipos"
              :key="opcion.value"
              class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white cursor-pointer transition-colors"
            >
              <input
                v-model="formData.equipos"
                type="checkbox"
                :value="opcion.value"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                :disabled="isLoading"
              />
              <span class="font-medium text-gray-700">{{ opcion.label }}</span>
            </label>
          </div>
        </div>

        <!-- Dorsal y Posición -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Dorsal *
            </label>
            <input
              v-model.number="formData.dorsal"
              type="number"
              required
              min="1"
              max="99"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: 7"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Posición *
            </label>
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

        <!-- Fecha de nacimiento -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Fecha de nacimiento *
          </label>
          <input
            v-model="formData.fechaNacimiento"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            :disabled="isLoading"
          />
        </div>

        <!-- Foto de perfil -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Foto de perfil
          </label>
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
            @click="handleCancel"
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
            {{ isLoading ? 'Guardando...' : 'Completar perfil' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { completarPerfilJugadora, isLoadingJugadora, errorJugadora, jugadoraAuthUser } from '../firebase/jugadorasAuth';

const opcionesEquipos = [
  { value: 'ascenso', label: 'Ascenso' },
  { value: 'serieC', label: 'Serie C' },
  { value: 'escuela', label: 'Escuela' }
];

const router = useRouter();
const inputFoto = ref(null);
const previewFoto = ref(null);
const fotoFile = ref(null);
const isLoading = ref(false);
const error = ref(null);

const formData = reactive({
  nombre: '',
  apellido: '',
  equipos: [],
  dorsal: null,
  posicion: '',
  fechaNacimiento: '',
  fotoPerfil: null
});

// Verificar autenticación cuando monta el componente
onMounted(() => {
  if (!jugadoraAuthUser.value) {
    router.push('/login-jugadora');
  }
});

const handleFotoChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    // Validar tamaño
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

const handleSubmit = async () => {
  error.value = null;

  // Validaciones
  if (!formData.nombre || !formData.apellido || formData.equipos.length === 0 || !formData.dorsal || !formData.posicion || !formData.fechaNacimiento) {
    error.value = 'Por favor completa todos los campos requeridos';
    // // console.warn('Validación fallida - campos incompletos');
    return;
  }


  isLoading.value = true;

  const success = await completarPerfilJugadora(
    jugadoraAuthUser.value.uid,
    {
      nombre: formData.nombre,
      apellido: formData.apellido,
      equipos: [...formData.equipos],
      dorsal: formData.dorsal,
      posicion: formData.posicion,
      fechaNacimiento: formData.fechaNacimiento
    },
    fotoFile.value
  );

  isLoading.value = false;


  if (success) {
    // Redirigir según equipo
    if (formData.equipos.length > 1) {
      router.push('/seleccionar-categoria');
    } else {
      router.push('/entrenamientos');
    }
  } else {
    error.value = errorJugadora.value || 'Error al guardar el perfil';
    // // console.error('Error al guardar perfil:', error.value);
  }
};

const handleCancel = () => {
  router.push('/');
};
</script>
