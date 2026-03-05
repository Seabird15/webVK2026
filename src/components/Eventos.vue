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
                                <div v-if="proximoPartido.estado === 'EN_CURSO'" class="space-y-2">
                                    <!-- Mostrar resultado en tiempo real -->
                                    <div class="flex gap-1 justify-center">
                                        <span class="bg-black text-white font-black px-2 py-1 rounded text-sm">{{ proximoPartido.golesLocal }}</span>
                                        <span class="text-white/70 font-bold">-</span>
                                        <span class="bg-black text-white font-black px-2 py-1 rounded text-sm">{{ proximoPartido.golesVisita }}</span>
                                    </div>
                                    <p class="text-xs font-bold text-black animate-pulse">EN CURSO ⚽</p>
                                    <div v-if="proximoPartido.goleadoresLocal && proximoPartido.goleadoresLocal.length" class="mt-2">
                                        <p class="text-xs text-white/70">Goleadoras:</p>
                                        <ul class="text-white text-sm list-disc list-inside">
                                            <li v-for="(gol, idx) in proximoPartido.goleadoresLocal" :key="idx">{{ gol.jugadora }} (min {{ gol.minuto }})</li>
                                        </ul>
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="text-xs font-black">{{ proximoPartido.hora }}</p>
                                    <p class="text-[10px] font-bold mt-1" :class="proximoPartido.estado === 'EN_CURSO' ? 'text-red-700' : 'text-black/70'">
                                      {{ proximoPartido.estado === 'EN_CURSO' ? 'EN CURSO' : 'PROGRAMADO' }}
                                    </p>
                                </div>
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

const proximoPartido = ref(null);
const ultimoPartido = ref(null);
const cargando = ref(true);
let unsubscribeProximoPartido = null;
let unsubscribeConvocatorias = null;
let unsubscribeProximoPartidoHomeConfig = null;
let unsubscribePartidosNuevos = null;
let unsubscribeEntrenamientosPartidos = null;
const partidosInternos = ref([]);
const partidosAdmin = ref([]);  // Convocatorias (esConvocatoria === true, pero no tipo='partido'/'amistoso')
const entrenamientosPartidos = ref([]); // Entrenamientos con tipo='partido' o 'amistoso'
const partidosNuevos = ref([]);
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
        // si la cadena ya incluye tiempo lo dejamos tal cual; de lo contrario
        // el constructor de Date lo interpretará correctamente
        fechaBase = new Date(entrenamiento.fecha);
        if (isNaN(fechaBase.getTime())) {
            // fallback conservador
            fechaBase = new Date(`${entrenamiento.fecha}T00:00:00`);
        }
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
    const ahora = new Date();
    const limitePasadoMs = 6 * 60 * 60 * 1000;

    // Juntar todos los partidos disponibles de las CUATRO fuentes
    const todosLosPartidos = [
        ...partidosInternos.value, 
        ...partidosAdmin.value,      // Convocatorias
        ...entrenamientosPartidos.value,  // Entrenamientos tipo=partido/amistoso
        ...partidosNuevos.value
    ];


    // Separar en EN_CURSO y PROGRAMADOS
    const enCurso = todosLosPartidos.filter(p => p.estado === 'EN_CURSO');
    const programados = todosLosPartidos.filter(p => {
        if (p.estado === 'FINALIZADO') return false;
        return p.fechaDate.getTime() >= ahora.getTime() - limitePasadoMs;
    });


    // *** Cálculo de último partido siempre se ejecuta aunque haya partido en curso ***
    // ahora tomamos cualquiera FINALIZADO sin importar si la fecha es pasada o
    // futura; además priorizamos la última edición (updatedAt) en lugar de la
    // propia fecha de juego.
    const finalizadosEntrenamientos = entrenamientosPartidos.value
        .filter(p => p.estado === 'FINALIZADO');

    if (finalizadosEntrenamientos.length > 0) {
        const ordenadosUlt = finalizadosEntrenamientos.sort((a, b) => {
            const ta = a.updatedAt ? a.updatedAt.getTime() : a.fechaDate.getTime();
            const tb = b.updatedAt ? b.updatedAt.getTime() : b.fechaDate.getTime();
            return tb - ta;
        });
        const elegido = ordenadosUlt[0];
        ultimoPartido.value = {
            fecha: elegido.fecha,
            liga: elegido.liga,
            equipo1: elegido.equipo1,
            equipo2: elegido.equipo2,
            resultado: {
                equipo1: elegido.golesLocal || 0,
                equipo2: elegido.golesVisita || 0
            }
        };
    } else {
        ultimoPartido.value = null;
    }

    // Si hay algún partido en curso lo mostramos directamente
    if (enCurso.length > 0) {
        const primero = enCurso.sort((a, b) => a.fechaDate.getTime() - b.fechaDate.getTime())[0];
        proximoPartido.value = JSON.parse(JSON.stringify(primero));
        return;
    }

    // Si no hay en curso y tampoco hay partidos programados entonces no
    // mostramos nada (aunque exista un partido destacado antiguo)
    if (programados.length === 0) {
        proximoPartido.value = null;
        return;
    }

    // Si no hay en curso, podemos usar el partido destacado si existe y
    // todavía hay algún partido programado en la lista
    if (partidoDestacadoHome.value) {
        proximoPartido.value = { ...partidoDestacadoHome.value };
        return;
    }

    // Si llegamos aquí no había en curso ni destacado, entonces buscamos entre programados
    const candidatos = [...programados]
        .sort((a, b) => a.fechaDate.getTime() - b.fechaDate.getTime());

    if (candidatos.length > 0) {
        proximoPartido.value = JSON.parse(JSON.stringify(candidatos[0]));
  
    } else {
        proximoPartido.value = null;
    }

    // El cálculo del último partido ya se realizó al principio de la
    // función; no es necesario repetirlo aquí.
    // (se mantiene este comentario para referencia futura)

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
        estado: configData.estado || 'PROGRAMADO',
        numeroFecha: null,
        fechaDate: fechaHora,
        golesLocal: configData.golesLocal || 0,
        golesVisita: configData.golesVisita || 0,
        fuente: 'admin_destacado'
    };
};

// Mapear partidos de la nueva colección 'partidos'
const mapearPartidoNuevo = (doc) => {
    const data = doc.data();
    const fechaHora = getFechaHoraEntrenamiento({
        fecha: data.fecha,
        hora: data.hora
    });
    
    return {
        id: doc.id,
        fecha: formatearFecha(data.fecha),
        liga: data.tipo === 'amistoso' ? 'Partido Amistoso' : 
              data.tipo === 'competicion' ? 'Competición' : 'Liga',
        equipoCategoria: normalizarEquipoCategoria(data.equipo),
        hora: (data.hora || '00:00').split(':')[0]?.trim() || '00:00',
        equipo1: {
            nombre: 'CD Vikingas',
            logo: logoUrlVikingas
        },
        equipo2: {
            nombre: data.rival || 'Por confirmar',
            logo: null
        },
        lugar: data.lugar || 'Por confirmar',
        estado: data.estado || 'PROGRAMADO',
        numeroFecha: null,
        fechaDate: fechaHora,
        golesLocal: data.golesLocal || 0,
        golesVisita: data.golesVisita || 0,
        goleadoresLocal: data.goleadoresLocal || [],
        goleadoresVisita: data.goleadoresVisita || [],        // Firestore timestamp when the documento fue modificado,
        // nos ayuda a saber cuál fue el último partido editado
        updatedAt: data.updatedAt
            ? (data.updatedAt.seconds
                ? new Date(data.updatedAt.seconds * 1000)
                : new Date(data.updatedAt))
            : new Date(),        fuente: 'partidos_new'
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
                        golesLocal: partido.golesLocal || 0,
                        golesVisita: partido.golesVisita || 0,
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
            // Solo los que tienen esConvocatoria pero no son tipo 'partido' o 'amistoso'
            partidosAdmin.value = snapshot.docs
                .filter(doc => {
                    const tipo = doc.data().tipo;
                    return tipo !== 'partido' && tipo !== 'amistoso';
                })
                .map((item) => {
                    const entrenamiento = item.data();
                    const fechaHora = getFechaHoraEntrenamiento(entrenamiento);
                    return {
                        id: item.id,
                        fecha: formatearFecha(entrenamiento.fecha),
                        liga: 'Convocatoria Admin',
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
                        estado: entrenamiento.estado || 'PROGRAMADO',
                        numeroFecha: null,
                        fechaDate: fechaHora,
                        golesLocal: entrenamiento.golesLocal || entrenamiento.resultadoLocal || 0,
                        golesVisita: entrenamiento.golesVisita || entrenamiento.resultadoVisita || 0,
                        goleadoresLocal: entrenamiento.goleadoresLocal || [],
                        goleadoresVisita: entrenamiento.goleadoresVisita || [],
                        fuente: 'admin'
                    };
                });

            recalcularProximoPartido();
        });

        // Escuchar toda la colección de entrenamientos y filtrar aquí los
        // que son partidos / amistosos. Esto evita omisiones por coincidencias
        // de query (espacios, mayúsculas, etc.).
        const entrenamientosPartidosRef = collection(db, 'entrenamientos');

        unsubscribeEntrenamientosPartidos = onSnapshot(entrenamientosPartidosRef, (snapshot) => {
       
            
            snapshot.docChanges().forEach(change => {
                if (change.type === 'modified' && change.doc.data().estado === 'FINALIZADO') {
                }
            });

            entrenamientosPartidos.value = snapshot.docs
                .map((item) => {
                    const entrenamiento = item.data();
                    const tipo = (entrenamiento.tipo || '').toString().trim().toLowerCase();
                    if (tipo !== 'partido' && tipo !== 'amistoso') return null;

                    const fechaHora = getFechaHoraEntrenamiento(entrenamiento);
                    const partido = {
                        id: item.id,
                        fecha: formatearFecha(entrenamiento.fecha),
                        liga: tipo === 'amistoso' ? 'Partido Amistoso' : 'Partido',
                        equipoCategoria: normalizarEquipoCategoria(entrenamiento.equipo),
                        hora: (entrenamiento.hora || '00:00').split('-')[0]?.trim() || '00:00',
                        equipo1: { nombre: 'CD Vikingas', logo: logoUrlVikingas },
                        equipo2: {
                            nombre: (entrenamiento.rival || '').trim() || extraerRival(entrenamiento.nombre),
                            logo: null
                        },
                        lugar: entrenamiento.lugar || 'Por confirmar',
                        estado: entrenamiento.estado || 'PROGRAMADO',
                        numeroFecha: null,
                        fechaDate: fechaHora,
                        golesLocal: (entrenamiento.resultadoLocal ?? entrenamiento.golesLocal) || 0,
                        golesVisita: (entrenamiento.resultadoVisita ?? entrenamiento.golesVisita) || 0,
                        goleadoresLocal: entrenamiento.goleadoresLocal || [],
                        goleadorasLocal: entrenamiento.goleadorasLocal || [],
                        goleadoresVisita: entrenamiento.goleadorasVisita || [],
                        updatedAt: entrenamiento.updatedAt
                            ? (entrenamiento.updatedAt.seconds
                                ? new Date(entrenamiento.updatedAt.seconds * 1000)
                                : new Date(entrenamiento.updatedAt))
                            : new Date(),
                        fuente: 'entrenamientos_partidos'
                    };

                 
                    return partido;
                })
                .filter(Boolean);

           
            recalcularProximoPartido();
        });


        // NUEVO: Escuchar partidos de la colección 'partidos'
        const partidosQuery = query(collection(db, 'partidos'));
        unsubscribePartidosNuevos = onSnapshot(partidosQuery, (snapshot) => {
            // al detectar cambios finalizados, solo impresiones de log ya que
        // el cálculo del último partido depende exclusivamente de los
        // entrenamientos.
            snapshot.docChanges().forEach(change => {
                if (change.type === 'modified' && change.doc.data().estado === 'FINALIZADO') {
                }
            });
            partidosNuevos.value = snapshot.docs.map(doc => mapearPartidoNuevo(doc));
            recalcularProximoPartido();
        });


  } catch (error) {
  }
};

onMounted(async () => {
    try {
        // Cargar próximo partido automáticamente desde entrenamientos
        cargarProximoPartido();
    } catch (error) {
        console.error('Error inicializando eventos:', error);
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
    if (unsubscribePartidosNuevos) {
        unsubscribePartidosNuevos();
    }
    if (unsubscribeEntrenamientosPartidos) {
        unsubscribeEntrenamientosPartidos();
    }
});
</script>