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
                                                        <p v-if="proximoPartido.equipoCategoria" class="text-primary text-[11px] font-bold uppercase">
                                                            Equipo: {{ proximoPartido.equipoCategoria }}
                                                        </p>
                        </div>

                        <!-- Equipos -->
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex flex-col items-center gap-2">
                                <img v-if="proximoPartido.equipo1.logo" :src="proximoPartido.equipo1.logo" :alt="proximoPartido.equipo1.nombre"
                                    class="w-16 h-16 object-contain">
                                <p class="text-white text-sm font-bold">{{ proximoPartido.equipo1.nombre }}</p>
                            </div>

                            <div class="text-center p-4 bg-primary rounded-lg min-w-28">
                                <p class="text-xs font-black">{{ proximoPartido.hora }}</p>
                                <p class="text-[10px] font-bold mt-1" :class="proximoPartido.estado === 'EN_CURSO' ? 'text-red-700' : 'text-black/70'">
                                  {{ proximoPartido.estado === 'EN_CURSO' ? 'EN CURSO' : 'PROGRAMADO' }}
                                </p>
                            </div>

                            <div class="flex flex-col items-center gap-2">
                                <img v-if="proximoPartido.equipo2.logo" :src="proximoPartido.equipo2.logo" :alt="proximoPartido.equipo2.nombre"
                                    class="w-16 h-16 object-contain">
                                <p class="text-white text-sm font-bold">{{ proximoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>
                        
                        <!-- Lugar del partido -->
                        <div class="text-center space-y-1">
                            <p class="text-white/70 text-xs">📍 {{ proximoPartido.lugar }}</p>
                            <p v-if="proximoPartido.numeroFecha" class="text-primary text-[11px] font-bold uppercase">Fecha {{ proximoPartido.numeroFecha }}</p>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { obtenerEventosEspeciales } from '../firebase/eventosEspeciales.js';

const proximoPartido = ref(null);
const ultimoPartido = ref(null);
const cargando = ref(true);
let unsubscribeProximoPartido = null;
let unsubscribeConvocatorias = null;
let unsubscribeProximoPartidoHomeConfig = null;
const partidosInternos = ref([]);
const partidosAdmin = ref([]);
const partidoDestacadoHome = ref(null);

const logoUrlVikingas = new URL('../assets/logoVk.png', import.meta.url).href;
const logoUrlVerserkers = new URL('../assets/versekersLogo.jpeg', import.meta.url).href;
const logoUrlInternadas = new URL('../assets/internadasLogo.jpeg', import.meta.url).href;
const logoUrlSiempreAlPalo = new URL('../assets/siemprealpaloLogo.jpeg', import.meta.url).href;

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

const datosEquipo = {
    verserkers: {
        nombre: 'Las Verserkers',
        logo: logoUrlVerserkers,
        liga: 'Campeonato Interno'
    },
    internadas: {
        nombre: 'Inter Nadas',
        logo: logoUrlInternadas,
        liga: 'Campeonato Interno'
    },
    siemprealpalo: {
        nombre: 'Siempre al Palo FC',
        logo: logoUrlSiempreAlPalo,
        liga: 'Campeonato Interno'
    }
};

const getEquipoPartido = (equipoKey) => {
    return datosEquipo[equipoKey] || {
        nombre: equipoKey || 'Equipo',
        logo: null,
        liga: 'Campeonato Interno'
    };
};

const getFechaHoraPartido = (partido) => {
    const fechaBase = partido?.fecha ? new Date(`${partido.fecha}T00:00:00`) : new Date();
    const horaInicio = (partido?.horario || '00:00').split('-')[0].trim();
    const [horas, minutos] = horaInicio.split(':').map(v => Number(v || 0));
    fechaBase.setHours(horas || 0, minutos || 0, 0, 0);
    return fechaBase;
};

const getFechaHoraEntrenamiento = (entrenamiento) => {
    let fechaBase;
    if (entrenamiento?.fecha?.seconds) {
        fechaBase = new Date(entrenamiento.fecha.seconds * 1000);
    } else if (entrenamiento?.fecha instanceof Date) {
        fechaBase = new Date(entrenamiento.fecha);
    } else if (typeof entrenamiento?.fecha === 'string') {
        fechaBase = new Date(`${entrenamiento.fecha}T00:00:00`);
    } else {
        fechaBase = new Date();
    }

    const horaInicio = (entrenamiento?.hora || '00:00').split('-')[0].trim();
    const [horas, minutos] = horaInicio.split(':').map(v => Number(v || 0));
    fechaBase.setHours(horas || 0, minutos || 0, 0, 0);
    return fechaBase;
};

const extraerRival = (tituloPartido = '') => {
    const titulo = (tituloPartido || '').trim();
    if (!titulo) return 'Rival por confirmar';

    const separadores = [/\s+vs\.?\s+/i, /\s+v\.?\s+/i, /\s+-\s+/];
    for (const separador of separadores) {
        const partes = titulo.split(separador).map(parte => parte.trim()).filter(Boolean);
        if (partes.length >= 2) {
            const primer = partes[0];
            const segundo = partes[1];
            if (/vikingas/i.test(primer)) return segundo;
            if (/vikingas/i.test(segundo)) return primer;
            return segundo;
        }
    }

    return titulo
        .replace(/^(partido|amistoso|convocatoria)\s*/i, '')
        .trim() || 'Rival por confirmar';
};

const normalizarEstado = (estado) => {
    if (estado === 'EN_CURSO') return 'EN_CURSO';
    return 'PROGRAMADO';
};

const normalizarEquipoCategoria = (equipo) => {
    const valor = (equipo || '').toString().toLowerCase().trim();
    if (valor === 'ascenso') return 'Ascenso';
    if (valor === 'escuela') return 'Escuela';
    if (valor === 'ambos') return 'Ascenso y Escuela';
    return '';
};

const recalcularProximoPartido = () => {
    if (partidoDestacadoHome.value) {
        proximoPartido.value = partidoDestacadoHome.value;
        return;
    }

    const ahora = new Date();
    const limitePasadoMs = 6 * 60 * 60 * 1000;

    const candidatos = [...partidosInternos.value, ...partidosAdmin.value]
        .filter(partido => {
            if (partido.estado === 'EN_CURSO') return true;
            return partido.fechaDate.getTime() >= ahora.getTime() - limitePasadoMs;
        })
        .sort((a, b) => {
            const prioridadA = a.estado === 'EN_CURSO' ? 0 : 1;
            const prioridadB = b.estado === 'EN_CURSO' ? 0 : 1;
            if (prioridadA !== prioridadB) return prioridadA - prioridadB;
            return a.fechaDate.getTime() - b.fechaDate.getTime();
        });

    proximoPartido.value = candidatos.length > 0 ? candidatos[0] : null;
};

const mapearPartidoDestacadoDesdeConfig = (configData) => {
    if (!configData || configData.activo === false) return null;

    const rival = (configData.rival || '').trim() || extraerRival(configData.nombre || '');
    const fechaHora = getFechaHoraEntrenamiento({
        fecha: configData.fecha,
        hora: configData.hora
    });

    return {
        id: configData.entrenamientoId || 'proximoPartidoHome',
        fecha: formatearFecha(configData.fecha),
        liga: configData.tipo === 'amistoso' ? 'Partido Amistoso' : 'Partido Programado',
        equipoCategoria: normalizarEquipoCategoria(configData.equipo),
        hora: (configData.hora || '00:00').split('-')[0]?.trim() || '00:00',
        equipo1: {
            nombre: 'CD Vikingas',
            logo: logoUrlVikingas
        },
        equipo2: {
            nombre: rival || 'Rival por confirmar',
            logo: null
        },
        lugar: configData.lugar || 'Por confirmar',
        estado: 'PROGRAMADO',
        numeroFecha: null,
        fechaDate: fechaHora,
        fuente: 'admin_destacado'
    };
};

// Cargar próximo partido desde campeonato interno (estructura admin)
const cargarProximoPartido = () => {
  try {
        const proximoPartidoHomeRef = doc(db, 'configuracion', 'proximoPartidoHome');
        unsubscribeProximoPartidoHomeConfig = onSnapshot(proximoPartidoHomeRef, (docSnap) => {
            if (docSnap.exists()) {
                partidoDestacadoHome.value = mapearPartidoDestacadoDesdeConfig(docSnap.data());
            } else {
                partidoDestacadoHome.value = null;
            }
            recalcularProximoPartido();
        });

        const partidosRef = doc(db, 'campeonato_interno_2026', 'partidos');

        unsubscribeProximoPartido = onSnapshot(partidosRef, (docSnap) => {
            if (!docSnap.exists()) {
                partidosInternos.value = [];
                recalcularProximoPartido();
                return;
            }

            const data = docSnap.data();
            partidosInternos.value = (data.partidos || [])
                .filter(partido => partido.estado !== 'FINALIZADO')
                .map(partido => {
                    const fechaHora = getFechaHoraPartido(partido);
                    const equipoLocal = getEquipoPartido(partido.equipoLocal);
                    const equipoVisita = getEquipoPartido(partido.equipoVisita);
                    return {
                        id: partido.id,
                        fecha: formatearFecha(partido.fecha),
                        liga: equipoLocal.liga,
                        equipoCategoria: '',
                        hora: (partido.horario || '').split('-')[0]?.trim() || '00:00',
                        equipo1: {
                            nombre: equipoLocal.nombre,
                            logo: equipoLocal.logo
                        },
                        equipo2: {
                            nombre: equipoVisita.nombre,
                            logo: equipoVisita.logo
                        },
                        lugar: 'Cancha Tricolor La Florida',
                        estado: normalizarEstado(partido.estado),
                        numeroFecha: partido.numeroFecha,
                        fechaDate: fechaHora,
                        fuente: 'interno'
                    };
                });

            recalcularProximoPartido();
        });

        const convocatoriasRef = query(
            collection(db, 'entrenamientos'),
            where('esConvocatoria', '==', true)
        );

        unsubscribeConvocatorias = onSnapshot(convocatoriasRef, (snapshot) => {
            partidosAdmin.value = snapshot.docs
                .map((item) => {
                    const entrenamiento = item.data();
                    const fechaHora = getFechaHoraEntrenamiento(entrenamiento);
                    return {
                        id: item.id,
                        fecha: formatearFecha(entrenamiento.fecha),
                        liga: entrenamiento.tipo === 'amistoso' ? 'Partido Amistoso' : 'Convocatoria Admin',
                        equipoCategoria: normalizarEquipoCategoria(entrenamiento.equipo),
                        hora: (entrenamiento.hora || '00:00').split('-')[0]?.trim() || '00:00',
                        equipo1: {
                            nombre: 'CD Vikingas',
                            logo: logoUrlVikingas
                        },
                        equipo2: {
                            nombre: (entrenamiento.rival || '').trim() || extraerRival(entrenamiento.nombre),
                            logo: null
                        },
                        lugar: entrenamiento.lugar || 'Por confirmar',
                        estado: 'PROGRAMADO',
                        numeroFecha: null,
                        fechaDate: fechaHora,
                        fuente: 'admin'
                    };
                });

            recalcularProximoPartido();
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

onUnmounted(() => {
    if (unsubscribeProximoPartidoHomeConfig) {
        unsubscribeProximoPartidoHomeConfig();
    }
    if (unsubscribeProximoPartido) {
        unsubscribeProximoPartido();
    }
    if (unsubscribeConvocatorias) {
        unsubscribeConvocatorias();
    }
});
</script>