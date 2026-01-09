<template>
  <div class="w-full bg-white">
    <!-- Header -->
    <div class="bg-linear-to-r from-primary-dark to-primary/80 px-3 md:px-8 py-6 md:py-12">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl md:text-4xl font-bold text-white mb-1">Calendario</h1>
        <p class="text-white text-xs md:text-base">Eventos y entrenamientos de Vikingas</p>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-6xl mx-auto px-2 md:px-8 py-6 md:py-12">
      <!-- Navegación de meses -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
        <button
          @click="mesAnterior"
          class="w-full md:w-auto px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-sm md:text-base transition-colors"
        >
          ← Anterior
        </button>
        
        <h2 class="text-xl md:text-3xl font-bold text-gray-900">
          {{ meses[mesActual] }} {{ anioActual }}
        </h2>
        
        <button
          @click="mesSiguiente"
          class="w-full md:w-auto px-3 md:px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-bold text-sm md:text-base transition-colors"
        >
          Siguiente →
        </button>
      </div>

      <!-- Calendario -->
      <div class="grid grid-cols-7 gap-1 md:gap-3 mb-8 md:mb-12">
        <!-- Encabezados de días -->
        <div v-for="dia in dias" :key="dia" class="text-center font-bold text-gray-700 py-2 text-xs md:text-base">
          {{ dia }}
        </div>

        <!-- Días del mes -->
        <div
          v-for="(dia, index) in diasCalendario"
          :key="index"
          :class="[
            'min-h-20 md:min-h-28 p-1 md:p-3 rounded-lg border-2 transition-all',
            dia === 0
              ? 'bg-gray-100 border-gray-200'
              : dia === diaActual && mesActual === new Date().getMonth() && anioActual === new Date().getFullYear()
              ? 'bg-linear-to-br from-primary/20 to-primary/10 border-primary shadow-lg'
              : 'bg-white border-gray-200 hover:border-primary cursor-pointer hover:shadow-md'
          ]"
        >
          <div v-if="dia !== 0" class="space-y-0.5 md:space-y-1 h-full flex flex-col">
            <!-- Número del día con indicador de hoy -->
            <div class="flex items-center gap-2">
              <div class="font-bold text-sm md:text-lg text-gray-900">{{ dia }}</div>
              <div v-if="dia === diaActual && mesActual === new Date().getMonth() && anioActual === new Date().getFullYear()" class="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 bg-primary text-white rounded-full text-xs font-bold">
                ●
              </div>
            </div>
            
            <!-- Eventos del día (truncados en mobile) -->
            <div class="space-y-0.5 md:space-y-1 flex-1 overflow-hidden">
              <div
                v-for="(evento, idx) in obtenerEventosDia(dia)"
                :key="evento.id"
                :class="[
                  'text-xs px-1 md:px-2 py-0.5 md:py-1 rounded font-semibold truncate cursor-pointer hover:opacity-80 border',
                  obtenerColorEvento(evento.equipo)
                ]"
                @click="seleccionarEvento(evento)"
                :title="evento.titulo"
              >
                <span class="hidden md:inline">{{ evento.titulo }}</span>
                <span class="md:hidden">{{ evento.titulo.substring(0, 8) }}...</span>
              </div>
              <!-- Indicador de más eventos en mobile -->
              <div v-if="obtenerEventosDia(dia).length > 2" class="text-xs text-gray-500 px-1">
                +{{ obtenerEventosDia(dia).length - 2 }} más
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de evento seleccionado (Mejorado para mobile) -->
      <div v-if="eventoSeleccionado" class="fixed md:relative inset-0 md:inset-auto bg-black/50 md:bg-transparent z-50 md:z-auto flex items-end md:items-start rounded-none md:rounded-lg">
        <div class="bg-white rounded-t-2xl md:rounded-lg p-4 md:p-6 border-l-4 border-primary w-full md:max-w-2xl mx-0 md:mx-auto max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl md:text-2xl font-bold text-gray-900">{{ eventoSeleccionado.titulo }}</h3>
            <button
              @click="eventoSeleccionado = null"
              class="text-gray-500 hover:text-gray-700 text-2xl md:text-3xl font-bold"
            >
              ✕
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div>
              <p class="text-xs md:text-sm font-medium text-gray-600">Fecha</p>
              <p class="text-base md:text-lg text-gray-900">
                {{ formatearFecha(eventoSeleccionado.fecha) }}
              </p>
            </div>
            <div>
              <p class="text-xs md:text-sm font-medium text-gray-600">Hora</p>
              <p class="text-base md:text-lg text-gray-900">{{ eventoSeleccionado.hora }}</p>
            </div>
            <div>
              <p class="text-xs md:text-sm font-medium text-gray-600">Tipo</p>
              <p class="text-base md:text-lg text-gray-900 capitalize">{{ eventoSeleccionado.tipo }}</p>
            </div>
            <div v-if="eventoSeleccionado.equipo">
              <p class="text-xs md:text-sm font-medium text-gray-600">Equipo</p>
              <p class="text-base md:text-lg text-gray-900 capitalize">{{ eventoSeleccionado.equipo }}</p>
            </div>
          </div>

          <div v-if="eventoSeleccionado.lugar">
            <p class="text-xs md:text-sm font-medium text-gray-600 mb-1">Lugar</p>
            <p class="text-gray-900 text-sm md:text-base">{{ eventoSeleccionado.lugar }}</p>
          </div>

          <div v-if="eventoSeleccionado.descripcion">
            <p class="text-xs md:text-sm font-medium text-gray-600 mb-2 mt-4">Descripción</p>
            <p class="text-gray-900 text-sm md:text-base">{{ eventoSeleccionado.descripcion }}</p>
          </div>

          <!-- Botones de acción (solo para admins) -->
          <div v-if="isAdmin()" class="flex flex-col md:flex-row gap-2 md:gap-3 mt-6">
            <button
              @click="editarEvento(eventoSeleccionado)"
              class="flex-1 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm md:text-base transition-colors"
            >
              Editar
            </button>
            <button
              @click="confirmarEliminar(eventoSeleccionado.id)"
              class="flex-1 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm md:text-base transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de próximos eventos -->
      <div v-if="proximosEventos.length > 0" class="mt-8 md:mt-12">
        <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Próximos Eventos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <div
            v-for="evento in proximosEventos.slice(0, 6)"
            :key="evento.id"
            class="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
            @click="seleccionarEvento(evento)"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h4 class="text-base md:text-lg font-bold text-gray-900 flex-1">{{ evento.titulo }}</h4>
              <span
                :class="[
                  'text-xs px-2 py-1 rounded font-semibold border whitespace-nowrap',
                  obtenerColorEvento(evento.equipo)
                ]"
              >
                {{ evento.equipo || 'general' }}
              </span>
            </div>
            <p class="text-xs md:text-sm text-gray-600 mb-2">
              <CalendarIcon class="w-4 h-4 inline mr-1" />
              {{ formatearFecha(evento.fecha) }} <br class="md:hidden" /> a las {{ evento.hora }}
            </p>
            <p v-if="evento.lugar" class="text-xs md:text-sm text-gray-700">
              <MapPinIcon class="w-4 h-4 inline mr-1" />
              {{ evento.lugar }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { isAdmin } from '../firebase/auth';
import { obtenerEventosMes, obtenerTodosEventos, eliminarEvento } from '../firebase/eventos';
import { useLoader } from '../composables/useLoader.js';
import { CalendarIcon, MapPinIcon } from '@heroicons/vue/24/outline';

const { show, hide } = useLoader();
const mesActual = ref(new Date().getMonth());
const anioActual = ref(new Date().getFullYear());
const diaActual = ref(new Date().getDate());
const eventosDelMes = ref([]);
const eventoSeleccionado = ref(null);

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Calcular días del calendario
const diasCalendario = computed(() => {
  const primerDia = new Date(anioActual.value, mesActual.value, 1).getDay();
  const ultimoDia = new Date(anioActual.value, mesActual.value + 1, 0).getDate();
  
  const calendario = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < primerDia; i++) {
    calendario.push(0);
  }
  
  // Días del mes
  for (let i = 1; i <= ultimoDia; i++) {
    calendario.push(i);
  }
  
  return calendario;
});

// Obtener eventos de un día específico
const obtenerEventosDia = (dia) => {
  return eventosDelMes.value.filter(evento => {
    const fecha = new Date(evento.fecha.seconds ? evento.fecha.seconds * 1000 : evento.fecha);
    return fecha.getDate() === dia;
  });
};

// Próximos eventos
const proximosEventos = computed(() => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return eventosDelMes.value
    .filter(evento => {
      const fecha = new Date(evento.fecha.seconds ? evento.fecha.seconds * 1000 : evento.fecha);
      return fecha >= hoy;
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fecha.seconds ? a.fecha.seconds * 1000 : a.fecha);
      const fechaB = new Date(b.fecha.seconds ? b.fecha.seconds * 1000 : b.fecha);
      return fechaA - fechaB;
    });
});

// Formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha.seconds ? fecha.seconds * 1000 : fecha);
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', opciones);
};

// Obtener color del evento según el equipo
const obtenerColorEvento = (equipo) => {
  switch (equipo) {
    case 'ascenso':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'escuela':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'futsal':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Navegar entre meses
const mesAnterior = () => {
  if (mesActual.value === 0) {
    mesActual.value = 11;
    anioActual.value--;
  } else {
    mesActual.value--;
  }
  cargarEventos();
};

const mesSiguiente = () => {
  if (mesActual.value === 11) {
    mesActual.value = 0;
    anioActual.value++;
  } else {
    mesActual.value++;
  }
  cargarEventos();
};

// Cargar eventos
const cargarEventos = async () => {
  try {
    show('Cargando eventos...');
    eventosDelMes.value = await obtenerEventosMes(anioActual.value, mesActual.value);
  } catch (err) {
    console.error('Error cargando eventos:', err);
  } finally {
    hide();
  }
};

// Seleccionar evento
const seleccionarEvento = (evento) => {
  eventoSeleccionado.value = evento;
};

// Editar evento (redirigir al admin)
const editarEvento = (evento) => {
  console.log('Editar evento:', evento);
  // TODO: Implementar formulario de edición
};

// Confirmar y eliminar evento
const confirmarEliminar = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
    try {
      await eliminarEvento(id);
      eventoSeleccionado.value = null;
      cargarEventos();
    } catch (err) {
      console.error('Error eliminando evento:', err);
    }
  }
};

// Cargar eventos al montar
onMounted(() => {
  cargarEventos();
});
</script>

<style scoped>
/* Sin estilos adicionales necesarios */
</style>
