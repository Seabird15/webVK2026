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
          class="w-full md:w-auto px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-sm md:text-base transition-colors cursor-pointer"
        >
          ← Anterior
        </button>
        
        <h2 class="text-xl md:text-3xl font-bold text-gray-900">
          {{ meses[mesActual] }} {{ anioActual }}
        </h2>
        
        <button
          @click="mesSiguiente"
          class="w-full md:w-auto px-3 md:px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-bold text-sm md:text-base transition-colors cursor-pointer"
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
                  'text-xs px-1 md:px-2 py-0.5 md:py-1 rounded font-semibold truncate cursor-pointer hover:opacity-80 border flex items-center gap-0.5 md:gap-1',
                  obtenerColorEvento(evento.equipo, evento.esCumplea\u00f1os)
                ]"
                @click="seleccionarEvento(evento)"
                :title="evento.titulo"
              >
                <component :is="obtenerIconoTipo(evento.tipo)" class="w-3 h-3 shrink-0" />
                <span class="hidden md:inline truncate">{{ evento.titulo }}</span>
                <span class="md:hidden truncate">{{ evento.titulo.substring(0, 6) }}...</span>
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
            <div class="flex-1 min-w-0">
              <h3 class="text-xl md:text-2xl font-bold text-gray-900 wrap-break-word">{{ eventoSeleccionado.titulo }}</h3>
              <!-- Indicador de convocatoria -->
              <span v-if="eventoSeleccionado.esConvocatoria" class="inline-flex items-center gap-1 mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                <ClipboardDocumentListIcon class="w-4 h-4" />
                Convocatoria - {{ eventoSeleccionado.jugadorasConvocadas?.length || 0 }} jugadoras
              </span>
            </div>
            <button
              @click="eventoSeleccionado = null"
              class="text-gray-500 hover:text-gray-700 text-2xl md:text-3xl font-bold shrink-0 ml-2 cursor-pointer"
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
            <div v-if="!eventoSeleccionado.esCumplea\u00f1os">
              <p class="text-xs md:text-sm font-medium text-gray-600">Hora</p>
              <p class="text-base md:text-lg text-gray-900">{{ eventoSeleccionado.hora }}</p>
            </div>
            <div>
              <p class="text-xs md:text-sm font-medium text-gray-600">Tipo</p>
              <p class="text-base md:text-lg text-gray-900 capitalize">{{ eventoSeleccionado.tipo }}</p>
            </div>
            <div v-if="eventoSeleccionado.equipo && !eventoSeleccionado.esCumplea\u00f1os">
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

          <!-- Botones de acción (solo para admins y no cumpleaños) -->
          <div v-if="isAdmin() && !eventoSeleccionado.esCumplea\u00f1os" class="flex flex-col md:flex-row gap-2 md:gap-3 mt-6">
            <button
              @click="editarEvento(eventoSeleccionado)"
              class="flex-1 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm md:text-base transition-colors cursor-pointer"
            >
              Editar
            </button>
            <button
              @click="confirmarEliminar(eventoSeleccionado.id)"
              class="flex-1 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm md:text-base transition-colors cursor-pointer"
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
              <h4 class="text-base md:text-lg font-bold text-gray-900 flex-1 min-w-0 wrap-break-word flex items-center gap-1.5">
                <component :is="obtenerIconoTipo(evento.tipo)" class="w-5 h-5 shrink-0" />
                <span class="truncate">{{ evento.titulo }}</span>
              </h4>
              <span
                v-if="!evento.esCumpleaños"
                :class="[
                  'text-xs px-2 py-1 rounded font-semibold border whitespace-nowrap shrink-0',
                  obtenerColorEvento(evento.equipo, evento.esCumpleaños)
                ]"
              >
                {{ evento.equipo || 'general' }}
              </span>
              <span
                v-else
                class="text-xs px-2 py-1 rounded font-semibold border whitespace-nowrap shrink-0 bg-pink-100 text-pink-800 border-pink-300"
              >
                Cumpleaños
              </span>
            </div>
            <!-- Indicador de convocatoria -->
            <p v-if="evento.esConvocatoria" class="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
              <ClipboardDocumentListIcon class="w-4 h-4" />
              Convocatoria ({{ evento.jugadorasConvocadas?.length || 0 }} jugadoras)
            </p>
            <p v-if="!evento.esCumplea\u00f1os" class="text-xs md:text-sm text-gray-600 mb-2">
              <CalendarIcon class="w-4 h-4 inline mr-1" />
              {{ formatearFecha(evento.fecha) }} <br class="md:hidden" /> a las {{ evento.hora }}
            </p>
            <p v-else class="text-xs md:text-sm text-gray-600 mb-2">
              <CakeIcon class="w-4 h-4 inline mr-1" />
              {{ formatearFecha(evento.fecha) }}
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
import { fetchEntrenamientosPorEquipo } from '../firebase/entrenamientos';
import { useLoader } from '../composables/useLoader.js';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { 
  CalendarIcon, 
  MapPinIcon, 
  TrophyIcon,
  UserGroupIcon,
  SparklesIcon,
  BoltIcon,
  ClipboardDocumentListIcon,
  CakeIcon
} from '@heroicons/vue/24/outline';

const { show, hide } = useLoader();
const mesActual = ref(new Date().getMonth());
const anioActual = ref(new Date().getFullYear());
const diaActual = ref(new Date().getDate());
const eventosDelMes = ref([]);
const cumpleaniosDelMes = ref([]);
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

// Obtener eventos de un día específico (incluyendo cumpleaños)
const obtenerEventosDia = (dia) => {
  const eventos = eventosDelMes.value.filter(evento => {
    const fecha = new Date(evento.fecha);
    return fecha.getDate() === dia && 
           fecha.getMonth() === mesActual.value && 
           fecha.getFullYear() === anioActual.value;
  });

  const cumples = cumpleaniosDelMes.value.filter(cumple => cumple.diaMes === dia);

  return [...cumples, ...eventos];
};

// Próximos eventos (incluyendo cumpleaños)
const proximosEventos = computed(() => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const todosEventos = [...eventosDelMes.value, ...cumpleaniosDelMes.value];
  
  return todosEventos
    .filter(evento => {
      const fecha = new Date(evento.fecha);
      return fecha >= hoy;
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaA - fechaB;
    });
});

// Formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', opciones);
};

// Obtener color del evento según el equipo o tipo
const obtenerColorEvento = (equipo, esCumpleaños = false) => {
  if (esCumpleaños) {
    return 'bg-pink-100 text-pink-800 border-pink-300';
  }
  
  switch (equipo) {
    case 'ascenso':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'escuela':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'ambos':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Obtener componente de icono según el tipo de evento
const obtenerIconoTipo = (tipo) => {
  switch (tipo) {
    case 'cumpleaños':
      return CakeIcon;
    case 'partido':
      return TrophyIcon;
    case 'amistoso':
      return UserGroupIcon;
    case 'evento':
      return SparklesIcon;
    default:
      return BoltIcon;
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

// Cargar cumpleaños de jugadoras
const cargarCumpleanios = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
    const todasJugadoras = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filtrar jugadoras que tengan fecha de nacimiento y procesarlas
    cumpleaniosDelMes.value = todasJugadoras
      .filter(jugadora => jugadora.fechaNacimiento)
      .map(jugadora => {
        const [anio, mes, dia] = jugadora.fechaNacimiento.split('-').map(Number);
        return {
          id: `cumple-${jugadora.id}`,
          titulo: `${jugadora.nombre} ${jugadora.apellido}`,
          tipo: 'cumpleaños',
          equipo: jugadora.equipo,
          diaMes: dia,
          mesNacimiento: mes - 1, // JavaScript usa meses 0-11
          fecha: new Date(anioActual.value, mes - 1, dia).toISOString(),
          hora: '00:00',
          descripcion: `Cumpleaños de ${jugadora.nombre} ${jugadora.apellido}`,
          esCumpleaños: true,
          nombreJugadora: `${jugadora.nombre} ${jugadora.apellido}`
        };
      })
      .filter(cumple => cumple.mesNacimiento === mesActual.value);
  } catch (err) {
    // // console.error('Error cargando cumpleaños:', err);
  }
};

// Cargar eventos (entrenamientos)
const cargarEventos = async () => {
  try {
    show('Cargando eventos...');
    // Obtener entrenamientos de ambos equipos
    const entrenamientosAscenso = await fetchEntrenamientosPorEquipo('ascenso');
    const entrenamientosEscuela = await fetchEntrenamientosPorEquipo('escuela');
    
    // Combinar y eliminar duplicados (los entrenamientos 'ambos' aparecen en ambos)
    const todosEntrenamientos = [...entrenamientosAscenso, ...entrenamientosEscuela];
    const entrenamientosUnicos = Array.from(
      new Map(todosEntrenamientos.map(ent => [ent.id, ent])).values()
    );
    
    // Filtrar por mes y año actual
    eventosDelMes.value = entrenamientosUnicos
      .filter(ent => {
        const fecha = new Date(ent.fecha);
        return fecha.getMonth() === mesActual.value && 
               fecha.getFullYear() === anioActual.value;
      })
      .map(ent => ({
        ...ent,
        titulo: ent.nombre,  // Mapear 'nombre' a 'titulo' para compatibilidad
        tipo: ent.tipo || 'entrenamiento'
      }));

    // Cargar cumpleaños del mes
    await cargarCumpleanios();
  } catch (err) {
    // // console.error('Error cargando eventos:', err);
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
  alert('Para editar este evento, ve a la sección de Administración');
};

// Confirmar y eliminar evento
const confirmarEliminar = async (id) => {
  alert('Para eliminar este evento, ve a la sección de Administración');

};

// Cargar eventos al montar
onMounted(() => {
  cargarEventos();
});
</script>

<style scoped>
/* Sin estilos adicionales necesarios */
</style>
