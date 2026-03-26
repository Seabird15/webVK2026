<template>
    <div class="w-full py-12 px-4">
        <div class="max-w-6xl mx-auto">
            <div
                v-if="proximoPartido && proximoPartido.estado === 'EN_CURSO'"
                class="mb-6 rounded-3xl border border-red-500/40 bg-linear-to-r from-red-600/20 via-red-500/15 to-black/40 p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.24)]"
            >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="text-center sm:text-left">
                        <div class="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            En vivo
                        </div>
                        <p class="text-white text-xl sm:text-2xl font-black mt-3">Se esta jugando ahora</p>
                        <p class="text-white/80 text-sm sm:text-base mt-1.5">
                            {{ proximoPartido.equipo1.nombre }} vs {{ proximoPartido.equipo2.nombre }}
                            <span class="text-red-300 font-bold">• {{ proximoPartido.liga }}</span>
                        </p>
                        <p class="text-red-200 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] mt-2">
                            {{ obtenerEtiquetaTiempoPartido(proximoPartido) }}
                        </p>
                    </div>

                    <div class="self-center rounded-2xl bg-black/55 px-4 py-3 text-center min-w-36 border border-white/10">
                        <div class="flex items-center justify-center gap-2 text-white font-black text-2xl">
                            <span>{{ proximoPartido.golesLocal }}</span>
                            <span class="text-white/40">-</span>
                            <span>{{ proximoPartido.golesVisita }}</span>
                        </div>
                        <p class="text-[11px] uppercase tracking-[0.16em] font-bold text-red-300 mt-1">Marcador actual</p>
                    </div>
                </div>
            </div>

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
                                    <p class="text-xs font-bold text-black animate-pulse">{{ obtenerEtiquetaTiempoPartido(proximoPartido) }}</p>
                                    <div v-if="proximoPartido.goleadoresLocal && proximoPartido.goleadoresLocal.length" class="mt-2">
                                        <p class="text-xs text-white/70">Goleadoras:</p>
                                        <ul class="text-white text-sm list-disc list-inside">
                                            <li v-for="(gol, idx) in proximoPartido.goleadoresLocal" :key="idx">
                                                {{ gol.jugadora }}<span v-if="tieneMinutoValido(gol.minuto)"> (min {{ gol.minuto }})</span>
                                            </li>
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
                                <img :src="ultimoPartido.equipo1.logo || logoUrlVikingas" :alt="ultimoPartido.equipo1.nombre"
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
                                <img v-if="ultimoPartido.equipo2.logo" :src="ultimoPartido.equipo2.logo" :alt="ultimoPartido.equipo2.nombre"
                                    class="w-16 h-16 object-contain">
                                <p class="text-white text-sm font-bold">{{ ultimoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>

                        <div v-if="ultimoPartido.goleadoresLocal && ultimoPartido.goleadoresLocal.length" class="rounded-2xl border border-white/10 bg-black/30 p-4">
                            <button
                                @click="mostrarGoleadorasUltimoPartido = true"
                                class="w-full flex items-center justify-between gap-3 text-left"
                            >
                                <div>
                                    <p class="text-primary text-[11px] font-black uppercase tracking-[0.18em]">Resumen del partido</p>
                                    <p class="text-white font-bold text-sm mt-1">Ver goleadoras de Vikingas</p>
                                </div>
                                <span class="text-primary text-xs font-black uppercase">Abrir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="mostrarGoleadorasUltimoPartido && ultimoPartido && ultimoPartido.goleadoresLocal && ultimoPartido.goleadoresLocal.length"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            @click.self="mostrarGoleadorasUltimoPartido = false"
        >
            <div class="w-full max-w-lg rounded-3xl border border-primary/25 bg-[#071311] p-5 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <div class="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <p class="text-primary text-[11px] font-black uppercase tracking-[0.2em]">Último partido</p>
                        <h3 class="text-white text-xl sm:text-2xl font-black mt-2">Goleadoras de Vikingas</h3>
                        <p class="text-white/60 text-sm mt-1">{{ ultimoPartido.equipo1.nombre }} vs {{ ultimoPartido.equipo2.nombre }}</p>
                    </div>

                    <button
                        @click="mostrarGoleadorasUltimoPartido = false"
                        class="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-white/10"
                    >
                        Cerrar
                    </button>
                </div>

                <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    <div
                        v-for="(gol, idx) in ultimoPartido.goleadoresLocal"
                        :key="`modal-ultimo-gol-${idx}`"
                        class="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white"
                    >
                        <span class="font-semibold">{{ gol.jugadoraNombre || gol.jugadora }}</span>
                        <span v-if="tieneMinutoValido(gol.minuto)" class="text-primary font-black">{{ gol.minuto }}'</span>
                        <span v-else class="text-white/40 text-xs font-bold uppercase">Gol</span>
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
const mostrarGoleadorasUltimoPartido = ref(false);
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
const ahora = ref(Date.now());
let intervaloReloj = null;

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

const tieneMinutoValido = (valor) => {
    const minuto = Number(valor);
    return Number.isFinite(minuto) && minuto > 0;
};

const obtenerFechaDesdeValor = (valor) => {
    if (!valor) return null;
    if (valor instanceof Date) return new Date(valor);
    if (typeof valor?.toDate === 'function') return valor.toDate();
    if (typeof valor?.seconds === 'number') return new Date(valor.seconds * 1000);

    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const obtenerFasePartido = (partido) => {
    const fase = (partido?.fasePartido || '').toString().trim();

    if (fase) return fase;
    if (partido?.estado === 'FINALIZADO') return 'FINALIZADO';
    if (partido?.estado === 'EN_CURSO') return 'PRIMER_TIEMPO';

    return 'PROGRAMADO';
};

const calcularMinutoDesdeInicio = (inicio, base, minimo, maximo) => {
    const fechaInicio = obtenerFechaDesdeValor(inicio);
    if (!fechaInicio) return base;

    const diferenciaMs = ahora.value - fechaInicio.getTime();
    if (diferenciaMs <= 0) return base;

    return Math.min(maximo, Math.max(minimo, Math.floor(diferenciaMs / 60000) + base));
};

const calcularRelojDesdeInicio = (inicio, minutoBase, minutoMinimo, minutoMaximo) => {
    const fechaInicio = obtenerFechaDesdeValor(inicio);
    if (!fechaInicio) {
        return {
            minuto: minutoBase,
            segundo: 0
        };
    }

    const diferenciaMs = Math.max(0, ahora.value - fechaInicio.getTime());
    const totalSegundos = Math.floor(diferenciaMs / 1000);
    const minuto = Math.min(minutoMaximo, Math.max(minutoMinimo, Math.floor(totalSegundos / 60) + minutoBase));
    const segundo = minuto >= minutoMaximo ? Math.min(59, totalSegundos % 60) : totalSegundos % 60;

    return { minuto, segundo };
};

const formatearRelojPartido = ({ minuto, segundo }) => {
    const minutoTexto = String(minuto).padStart(2, '0');
    const segundoTexto = String(segundo).padStart(2, '0');
    return `${minutoTexto}:${segundoTexto}`;
};

const obtenerMinutoActualPartido = (partido) => {
    const fase = obtenerFasePartido(partido);

    if (fase === 'PRIMER_TIEMPO') {
        return calcularMinutoDesdeInicio(partido?.inicioPrimerTiempoAt || partido?.inicioEnVivoAt || partido?.fechaDate, 1, 1, 25);
    }

    if (fase === 'ENTRETIEMPO') return 25;

    if (fase === 'SEGUNDO_TIEMPO') {
        return calcularMinutoDesdeInicio(partido?.inicioSegundoTiempoAt, 26, 26, 50);
    }

    return null;
};

const obtenerEtiquetaTiempoPartido = (partido) => {
    const fase = obtenerFasePartido(partido);
    if (fase === 'PRIMER_TIEMPO') {
        const reloj = calcularRelojDesdeInicio(partido?.inicioPrimerTiempoAt || partido?.inicioEnVivoAt || partido?.fechaDate, 1, 1, 25);
        return `1ER TIEMPO · ${formatearRelojPartido(reloj)}`;
    }
    if (fase === 'ENTRETIEMPO') return 'ENTRETIEMPO';
    if (fase === 'SEGUNDO_TIEMPO') {
        const reloj = calcularRelojDesdeInicio(partido?.inicioSegundoTiempoAt, 26, 26, 50);
        return `2DO TIEMPO · ${formatearRelojPartido(reloj)}`;
    }
    if (fase === 'FINALIZADO') return 'FINALIZADO';

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
            },
            goleadoresLocal: elegido.goleadoresLocal || elegido.goleadorasLocal || []
        };
    } else {
        ultimoPartido.value = null;
    }

    // Si hay algún partido en curso lo mostramos directamente
    if (enCurso.length > 0) {
        const primero = enCurso.sort((a, b) => a.fechaDate.getTime() - b.fechaDate.getTime())[0];
        proximoPartido.value = { ...primero };
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
        proximoPartido.value = { ...candidatos[0] };
  
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
        fasePartido: configData.fasePartido || null,
        inicioEnVivoAt: configData.inicioEnVivoAt || null,
        inicioPrimerTiempoAt: configData.inicioPrimerTiempoAt || null,
        inicioSegundoTiempoAt: configData.inicioSegundoTiempoAt || null,
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
        goleadoresVisita: data.goleadoresVisita || [],
        fasePartido: data.fasePartido || null,
        inicioEnVivoAt: data.inicioEnVivoAt || null,
        inicioPrimerTiempoAt: data.inicioPrimerTiempoAt || null,
        inicioSegundoTiempoAt: data.inicioSegundoTiempoAt || null,
        // nos ayuda a saber cuál fue el último partido editado
        updatedAt: data.updatedAt
            ? (data.updatedAt.seconds
                ? new Date(data.updatedAt.seconds * 1000)
                : new Date(data.updatedAt))
            : new Date(),
        fuente: 'partidos_new'
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
                        fasePartido: entrenamiento.fasePartido || null,
                        inicioEnVivoAt: entrenamiento.inicioEnVivoAt || null,
                        inicioPrimerTiempoAt: entrenamiento.inicioPrimerTiempoAt || null,
                        inicioSegundoTiempoAt: entrenamiento.inicioSegundoTiempoAt || null,
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
                        fasePartido: entrenamiento.fasePartido || null,
                        inicioEnVivoAt: entrenamiento.inicioEnVivoAt || null,
                        inicioPrimerTiempoAt: entrenamiento.inicioPrimerTiempoAt || null,
                        inicioSegundoTiempoAt: entrenamiento.inicioSegundoTiempoAt || null,
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
        intervaloReloj = window.setInterval(() => {
            ahora.value = Date.now();
        }, 1000);

        // Cargar próximo partido automáticamente desde entrenamientos
        cargarProximoPartido();
    } catch (error) {
        console.error('Error inicializando eventos:', error);
    } finally {
        cargando.value = false;
    }
});

onUnmounted(() => {
    if (intervaloReloj) {
        window.clearInterval(intervaloReloj);
    }

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