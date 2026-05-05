<template>
    <div :class="liveBannerOnly ? 'w-full' : 'w-full bg-[#0f1718] py-14 px-4 sm:px-6 lg:px-8'">
        <div class="mx-auto max-w-6xl">
            <div
                v-if="mostrarBannerEnVivo"
                :class="[
                    'overflow-hidden rounded-4xl border border-white/10 bg-[#162122]/90 shadow-[0_18px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm',
                    compactBanner ? 'px-4 py-3 sm:px-5' : 'mb-8 px-5 py-5 sm:px-6 sm:py-6'
                ]"
            >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="text-center sm:text-left">
                        <div :class="[
                            'inline-flex items-center gap-2 rounded-full bg-[#3a1719] text-[#ffb4ae] font-black uppercase tracking-[0.18em]',
                            compactBanner ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1 text-[11px]'
                        ]">
                            <span class="h-2 w-2 rounded-full bg-[#ef4444] animate-pulse"></span>
                            En vivo
                        </div>
                        <p v-if="!compactBanner" class="mt-3 text-lg font-bold text-white sm:text-xl">
                            Se está jugando ahora
                        </p>
                        <p :class="['mt-1.5 text-white/78', compactBanner ? 'text-xs sm:text-sm' : 'text-sm sm:text-base']">
                            {{ proximoPartido.equipo1.nombre }} vs {{ proximoPartido.equipo2.nombre }}
                            <span class="font-semibold text-primary">• {{ proximoPartido.liga }}</span>
                        </p>
                    </div>

                    <div class="flex flex-col items-center gap-3 sm:items-end">
                        <p :class="['font-black uppercase tracking-[0.18em] text-[#b42318]', compactBanner ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm']">
                            {{ obtenerEtiquetaTiempoPartido(proximoPartido) }}
                        </p>
                        <a
                            v-if="detailsHref"
                            :href="detailsHref"
                            @click.prevent="irAMasDetalles"
                            class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-white/10"
                        >
                            Ver más detalles
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </div>
            </div>

            <div v-if="!liveBannerOnly" class="grid gap-5 lg:grid-cols-2">
                <article class="rounded-4xl border border-primary bg-[#162122] px-5 py-6 shadow-[0_18px_36px_rgba(0,0,0,0.18)] sm:px-6 sm:py-7">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 class="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-black uppercase leading-[0.92] text-white" style="font-family: 'Gobold High', sans-serif;">
                                Próximo partido
                            </h2>
                        </div>
                        <span class="mt-1 rounded-full bg-primary/12 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">
                            {{ proximoPartido?.liga || 'Agenda' }}
                        </span>
                    </div>

                    <div v-if="proximoPartido" class="mt-6 space-y-6">
                        <div class="text-center space-y-2">
                            <p class="text-sm font-semibold uppercase tracking-[0.14em] text-white/78">{{ proximoPartido.fecha }}</p>
                            <p class="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/48">{{ proximoPartido.hora }}</p>
                            <div class="flex flex-wrap items-center justify-center gap-2">
                                <p v-if="proximoPartido.equipoCategoria" class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-primary">
                                   Categoría {{ proximoPartido.equipoCategoria }}
                                </p>
                                <p class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/60">
                                 {{ obtenerEtiquetaTipoEvento(proximoPartido) }}
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-4xl bg-[#1b292a] px-4 py-5 sm:px-5">
                            <div class="flex flex-col items-center gap-3 text-center">
                                <img
                                    v-if="proximoPartido.equipo1.logo"
                                    :src="proximoPartido.equipo1.logo"
                                    :alt="proximoPartido.equipo1.nombre"
                                    class="h-16 w-16 object-contain sm:h-20 sm:w-20"
                                >
                                <p class="text-sm font-bold text-white">{{ proximoPartido.equipo1.nombre }}</p>
                            </div>

                            <div class="rounded-[1.6rem] bg-[#101819] px-4 py-3 text-center shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
                                <div v-if="proximoPartido.estado === 'EN_CURSO'" class="space-y-2">
                                    <div class="flex items-center justify-center gap-2 text-[1.1rem] font-black text-white">
                                        <span>{{ proximoPartido.golesLocal }}</span>
                                        <span class="text-white/40">-</span>
                                        <span>{{ proximoPartido.golesVisita }}</span>
                                    </div>
                                    <p class="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#b42318]">
                                        {{ obtenerEtiquetaTiempoPartido(proximoPartido) }}
                                    </p>
                                </div>
                                <div v-else>
                                    <p class="text-sm font-black uppercase tracking-[0.12em] text-white">{{ proximoPartido.hora }}</p>
                                    <p class="mt-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/42">Programado</p>
                                </div>
                            </div>

                            <div class="flex flex-col items-center gap-3 text-center">
                                <img
                                    v-if="proximoPartido.equipo2.logo"
                                    :src="proximoPartido.equipo2.logo"
                                    :alt="proximoPartido.equipo2.nombre"
                                    class="h-16 w-16 object-contain sm:h-20 sm:w-20"
                                >
                                <p class="text-sm font-bold text-white">{{ proximoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col items-center justify-center gap-2 text-center">
                            <p class="text-sm text-white/62">{{ proximoPartido.lugar }}</p>
                            <p v-if="proximoPartido.numeroFecha" class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-primary">
                                Fecha {{ proximoPartido.numeroFecha }}
                            </p>
                        </div>

                        <div v-if="proximoPartido.goleadoresLocal && proximoPartido.goleadoresLocal.length && proximoPartido.estado === 'EN_CURSO'" class="rounded-[1.6rem] bg-[#1b292a] px-4 py-4">
                            <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Goleadoras de Vikingas</p>
                            <ul class="mt-2 space-y-1 text-sm text-white/78">
                                <li v-for="(gol, idx) in proximoPartido.goleadoresLocal" :key="`gol-en-vivo-${idx}`">
                                    {{ gol.jugadora }}<span v-if="tieneMinutoValido(gol.minuto)"> · {{ gol.minuto }}'</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-else class="mt-6 rounded-[1.8rem] bg-[#1b292a] px-5 py-8 text-center text-sm text-white/46">
                        No hay partidos programados próximamente.
                    </div>
                </article>

                <article class="rounded-4xl border border-primary bg-[#162122] px-5 py-6 shadow-[0_18px_36px_rgba(0,0,0,0.18)] sm:px-6 sm:py-7">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 class="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-black uppercase leading-[0.92] text-white" style="font-family: 'Gobold High', sans-serif;">
                                Último partido
                            </h2>
                        </div>
                        <img :src="logoUrlVikingas" alt="Escudo Vikingas" class="h-12 w-12 object-contain opacity-90">
                    </div>

                    <div v-if="ultimoPartido" class="mt-6 space-y-6">
                        <div class="text-center space-y-2">
                            <p class="text-sm font-semibold uppercase tracking-[0.14em] text-white/78">{{ ultimoPartido.fecha }}</p>
                            <div class="flex flex-wrap items-center justify-center gap-2">
                                <p v-if="ultimoPartido.equipoCategoria" class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-primary">
                                 Categoría {{ ultimoPartido.equipoCategoria }}
                                </p>
                                <p class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/60">
                               {{ obtenerEtiquetaTipoEvento(ultimoPartido) }}
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-4xl bg-[#1b292a] px-4 py-5 sm:px-5">
                            <div class="flex flex-col items-center gap-3 text-center">
                                <img
                                    :src="ultimoPartido.equipo1.logo || logoUrlVikingas"
                                    :alt="ultimoPartido.equipo1.nombre"
                                    class="h-16 w-16 object-contain sm:h-20 sm:w-20"
                                >
                                <p class="text-sm font-bold text-white">{{ ultimoPartido.equipo1.nombre }}</p>
                            </div>

                            <div class="rounded-[1.6rem] bg-[#101819] px-4 py-3 text-center shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
                                <div class="flex items-center justify-center gap-2 text-[1.2rem] font-black text-white">
                                    <span>{{ ultimoPartido.resultado.equipo1 }}</span>
                                    <span class="text-white/40">-</span>
                                    <span>{{ ultimoPartido.resultado.equipo2 }}</span>
                                </div>
                            </div>

                            <div class="flex flex-col items-center gap-3 text-center">
                                <img
                                    v-if="ultimoPartido.equipo2.logo"
                                    :src="ultimoPartido.equipo2.logo"
                                    :alt="ultimoPartido.equipo2.nombre"
                                    class="h-16 w-16 object-contain sm:h-20 sm:w-20"
                                >
                                <p class="text-sm font-bold text-white">{{ ultimoPartido.equipo2.nombre }}</p>
                            </div>
                        </div>

                        <button
                            v-if="ultimoPartido.goleadoresLocal && ultimoPartido.goleadoresLocal.length"
                            @click="mostrarGoleadorasUltimoPartido = true"
                            class="flex w-full items-center justify-between gap-3 rounded-[1.6rem] border border-white/10 bg-[#1b292a] px-4 py-4 text-left transition-colors duration-200 hover:bg-[#213132]"
                        >
                            <div>
                                <p class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">Resumen</p>
                                <p class="mt-1 text-sm font-bold text-white">Ver goleadoras de Vikingas</p>
                            </div>
                            <span class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/50">Abrir</span>
                        </button>
                    </div>

                    <div v-else class="mt-6 rounded-[1.8rem] bg-[#1b292a] px-5 py-8 text-center text-sm text-white/46">
                        Aún no hay un resultado reciente para mostrar.
                    </div>
                </article>
            </div>
        </div>

        <div
            v-if="mostrarGoleadorasUltimoPartido && ultimoPartido && ultimoPartido.goleadoresLocal && ultimoPartido.goleadoresLocal.length"
            class="fixed inset-0 z-50 flex items-center justify-center bg-[#0d2021]/52 p-4 backdrop-blur-sm"
            @click.self="mostrarGoleadorasUltimoPartido = false"
        >
            <div class="w-full max-w-lg rounded-4xl border border-white/10 bg-[#162122] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] sm:p-6">
                <div class="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-primary">Último partido</p>
                        <h3 class="mt-2 text-xl font-black text-white sm:text-2xl">Goleadoras de Vikingas</h3>
                        <p class="mt-1 text-sm text-white/58">{{ ultimoPartido.equipo1.nombre }} vs {{ ultimoPartido.equipo2.nombre }}</p>
                    </div>

                    <button
                        @click="mostrarGoleadorasUltimoPartido = false"
                        class="shrink-0 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-white/10"
                    >
                        Cerrar
                    </button>
                </div>

                <div class="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                    <div
                        v-for="(gol, idx) in ultimoPartido.goleadoresLocal"
                        :key="`modal-ultimo-gol-${idx}`"
                        class="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/8 bg-[#1b292a] px-4 py-3 text-sm text-white"
                    >
                        <span class="font-semibold">{{ gol.jugadoraNombre || gol.jugadora }}</span>
                        <span v-if="tieneMinutoValido(gol.minuto)" class="font-black text-primary">{{ gol.minuto }}'</span>
                        <span v-else class="text-xs font-bold uppercase text-white/40">Gol</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const props = defineProps({
    liveBannerOnly: {
        type: Boolean,
        default: false
    },
    compactBanner: {
        type: Boolean,
        default: false
    },
    detailsHref: {
        type: String,
        default: ''
    }
});

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

const mostrarBannerEnVivo = computed(() => {
    return proximoPartido.value && proximoPartido.value.estado === 'EN_CURSO';
});

const irAMasDetalles = () => {
    if (!props.detailsHref) return;

    if (props.detailsHref.startsWith('#')) {
        const destino = document.querySelector(props.detailsHref);
        if (destino) {
            destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }

    window.location.href = props.detailsHref;
};

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
        .replace(/^(partido|amistoso|liga|competicion|competición|convocatoria)\s*/i, '')
        .trim() || 'Rival por confirmar';
};

const normalizarTipoPartido = (tipo) => {
    const valor = (tipo || '').toString().trim().toLowerCase();

    if (valor === 'amistoso') return 'amistoso';
    if (valor === 'liga' || valor === 'partido') return 'liga';
    if (valor === 'competicion' || valor === 'competición') return 'liga';

    return valor;
};

const esTipoPartido = (tipo) => {
    return ['amistoso', 'liga'].includes(normalizarTipoPartido(tipo));
};

const obtenerEtiquetaTipoPartido = (tipo) => {
    const tipoNormalizado = normalizarTipoPartido(tipo);

    if (tipoNormalizado === 'amistoso') return 'Amistoso';
    return 'Liga';
};

const obtenerEtiquetaCompetencia = (partido) => {
    const candidatos = [
        partido?.tipoPartido,
        partido?.tipo,
        partido?.liga,
        partido?.nombre,
        partido?.equipo2?.nombre
    ];

    const textoNormalizado = candidatos
        .map((valor) => (valor || '').toString().trim().toLowerCase())
        .find(Boolean) || '';

    if (textoNormalizado.includes('amistoso')) return 'Amistoso';
    if (textoNormalizado.includes('campeonato interno')) return 'Campeonato Interno';

    return 'Liga';
};

const obtenerEtiquetaTipoEvento = (partido) => {
    const tipoNormalizado = normalizarTipoPartido(partido?.tipoPartido || partido?.tipo || '');

    if (tipoNormalizado === 'amistoso') return 'Amistoso';
    if (tipoNormalizado === 'liga') return 'Liga';
    return 'Partido';
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
    if (valor === 'seriec' || valor === 'serie c') return 'Serie C';
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
            tipoPartido: elegido.tipoPartido || '',
            equipoCategoria: elegido.equipoCategoria || '',
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
        liga: obtenerEtiquetaTipoPartido(configData.tipo),
        tipoPartido: configData.tipo || '',
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
        liga: obtenerEtiquetaTipoPartido(data.tipo),
        tipoPartido: data.tipo || '',
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
                        tipoPartido: 'campeonato_interno',
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
            // Solo los que tienen esConvocatoria pero no son partidos visibles
            partidosAdmin.value = snapshot.docs
                .filter(doc => {
                    return !esTipoPartido(doc.data().tipo);
                })
                .map((item) => {
                    const entrenamiento = item.data();
                    const fechaHora = getFechaHoraEntrenamiento(entrenamiento);
                    return {
                        id: item.id,
                        fecha: formatearFecha(entrenamiento.fecha),
                        liga: 'Convocatoria Admin',
                        tipoPartido: entrenamiento.tipo || '',
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
                    const tipo = normalizarTipoPartido(entrenamiento.tipo);
                    if (!esTipoPartido(tipo)) return null;

                    const fechaHora = getFechaHoraEntrenamiento(entrenamiento);
                    const partido = {
                        id: item.id,
                        fecha: formatearFecha(entrenamiento.fecha),
                        liga: obtenerEtiquetaTipoPartido(tipo),
                        tipoPartido: entrenamiento.tipo || tipo,
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