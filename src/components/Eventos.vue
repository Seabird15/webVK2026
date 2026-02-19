<template>
    <div class="w-full py-12 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="grid lg:grid-cols-5 grid-cols-1 gap-8">
                <!-- Próximo Partido -->
                <div class="col-span-2 border-5 border-primary-dark bg-black/50 p-8 rounded-lg">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-white font-bold text-lg tracking-wide">PRÓXIMO PARTIDO</h2>
                        <span class="text-primary text-2xl">→</span>
                    </div>

                    <div v-if="proximoPartido" class="space-y-6">
                        <!-- Fecha y Liga -->
                        <div class="text-center space-y-1">
                            <p class="text-white text-sm uppercase">{{ proximoPartido.fecha }}</p>
                            <p class="text-white/70 text-xs uppercase">{{ proximoPartido.liga }}</p>
                        </div>

                        <!-- Equipos -->
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col items-center gap-2">
                                <img src="@/assets/logoVk.png" :alt="proximoPartido.equipo1.nombre"
                                    class="w-16 h-16">
                                <p class="text-white text-sm font-bold">{{ proximoPartido.equipo1.nombre }}</p>
                            </div>

                            <div class="text-center p-4 bg-primary">
                                <p class=" text-xs font-bold">{{ proximoPartido.hora }}</p>
                            </div>

                            <div class="flex flex-col items-center gap-2">
                                <p class="text-white text-sm font-bold">{{ proximoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>
                        
                        <!-- Lugar del partido -->
                        <div class="text-center">
                            <p class="text-white/70 text-xs">📍 {{ proximoPartido.lugar }}</p>
                        </div>
                    </div>
                    
                    <!-- Mensaje cuando no hay próximo partido -->
                    <div v-else class="text-center py-8">
                        <p class="text-white/50 text-sm">No hay partidos programados próximamente</p>
                    </div>
                </div>

                <!-- Logo Vikingas Centro -->
                <div class="hidden lg:block ">
                    <div class="col-span-1 flex items-center justify-center">
                        <img src="https://firebasestorage.googleapis.com/v0/b/fitapp-4fa5d.firebasestorage.app/o/VIKINGAS.svg?alt=media&token=9d4b0792-2e5a-4fe5-a1b7-f9f34a3b9099"
                            alt="Vikingas" class="h-32 w-auto">
                    </div>
                </div>
                    <p class="block lg:hidden font-bold text-white text-center text-4xl tracking-wider">VIKINGAS</p>



                <!-- Último Partido -->
                <div class="col-span-2 border-5 border-primary bg-black/50 p-8 rounded-lg">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-white font-bold text-lg tracking-wide">ÚLTIMO PARTIDO</h2>
                        <span class="text-primary text-2xl">→</span>
                    </div>

                    <div v-if="ultimoPartido" class="space-y-6">
                        <!-- Fecha y Liga -->
                        <div class="text-center space-y-1">
                            <p class="text-white text-sm uppercase">{{ ultimoPartido.fecha }}</p>
                            <p class="text-white/70 text-xs uppercase">{{ ultimoPartido.liga }}</p>
                        </div>

                        <!-- Equipos y Resultado -->
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col items-center gap-2">
                                <img src="@/assets/logoVk.png" :alt="ultimoPartido.equipo1.nombre"
                                    class="w-16 h-16">
                                <p class="text-white text-sm font-bold">{{ ultimoPartido.equipo1.nombre }}</p>
                            </div>

                            <div class="text-center space-y-2">
                                <div class="flex gap-2 justify-center">
                                    <span class="bg-primary text-black font-bold px-3 py-1 rounded text-lg">{{
                                        ultimoPartido.resultado.equipo1 }}</span>
                                    <span class="text-white/50">-</span>
                                    <span class="bg-primary text-black font-bold px-3 py-1 rounded text-lg">{{
                                        ultimoPartido.resultado.equipo2 }}</span>
                                </div>
                            </div>

                            <div class="flex flex-col items-center gap-2">
                                <p class="text-white text-sm font-bold">{{ ultimoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { obtenerEventosEspeciales } from '../firebase/eventosEspeciales.js';

const proximoPartido = ref(null);
const ultimoPartido = ref(null);
const cargando = ref(true);

// Función para formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha.seconds ? fecha.seconds * 1000 : fecha);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Función para obtener el nombre del equipo
const getNombreEquipo = (equipo) => {
  if (equipo === 'ascenso') return 'Ascenso';
  if (equipo === 'escuela') return 'Escuela';
  if (equipo === 'ambos') return 'Ambos Equipos';
  return equipo;
};

// Función para extraer el nombre del rival (última palabra del nombre)
const getNombreRival = (nombreCompleto) => {
  if (!nombreCompleto) return 'Rival';
  const palabras = nombreCompleto.trim().split(' ');
  return palabras[palabras.length - 1];
};

// Cargar próximo partido desde entrenamientos
const cargarProximoPartido = () => {
  try {
    const now = new Date();
    const q = query(
      collection(db, 'entrenamientos'),
      where('esConvocatoria', '==', true)
    );
    
    onSnapshot(q, (snapshot) => {
      const partidos = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const fechaPartido = new Date(data.fecha.seconds ? data.fecha.seconds * 1000 : data.fecha);
        
        // Solo agregar partidos futuros
        if (fechaPartido >= now) {
          partidos.push({
            id: doc.id,
            fecha: formatearFecha(data.fecha),
            liga: getNombreEquipo(data.equipo),
            hora: data.hora || '15:00',
            equipo1: {
              nombre: 'CD Vikingas'
            },
            equipo2: {
              nombre: getNombreRival(data.nombre)
            },
            lugar: data.lugar,
            fechaDate: fechaPartido
          });
        }
      });
      
      // Ordenar por fecha más cercana
      partidos.sort((a, b) => a.fechaDate - b.fechaDate);
      
      // Tomar el más próximo
      if (partidos.length > 0) {
        proximoPartido.value = partidos[0];
      } else {
        proximoPartido.value = null;
      }
    });
  } catch (error) {
    console.error('Error cargando próximo partido:', error);
  }
};

onMounted(async () => {
    try {
        // Cargar próximo partido automáticamente desde entrenamientos
        cargarProximoPartido();
        
        // Cargar último partido desde eventos especiales
        const datos = await obtenerEventosEspeciales();
        ultimoPartido.value = datos.ultimoPartido;
    } catch (error) {
        // console.error('Error cargando eventos especiales:', error);
    } finally {
        cargando.value = false;
    }
});
</script>