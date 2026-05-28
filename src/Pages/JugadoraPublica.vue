<template>
  <section class="min-h-dvh overflow-hidden bg-[#081112] text-white">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <button
        type="button"
        @click="volverAtras"
        class="mb-6 inline-flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/8 active:scale-[0.96]"
      >
        <span aria-hidden="true">←</span>
        Volver atrás
      </button>

      <div v-if="isLoading" class="flex min-h-[60dvh] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center">
        <div class="size-12 animate-spin rounded-full border-4 border-primary/25 border-t-primary"></div>
        <p class="mt-5 text-sm font-black uppercase text-white/70">Cargando perfil</p>
      </div>

      <div v-else-if="error || !perfil" class="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl">
        <p class="text-[0.72rem] font-black uppercase text-primary">Perfil no disponible</p>
        <h1 class="mt-3 text-balance text-4xl font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">
          No pudimos encontrar esta ficha
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-pretty text-base font-semibold leading-7 text-white/68">
          Puede que la jugadora aún no tenga perfil público completo o que el enlace ya no esté disponible.
        </p>
        <router-link to="/equipo" class="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-black uppercase text-black">
          Ver planteles
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <aside class="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-2xl">
            <div class="overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_20px_45px_rgba(0,0,0,0.24)]">
              <img v-if="fotoPerfil" :src="fotoPerfil" :alt="nombreCompleto" class="aspect-4/5 w-full object-cover" />
              <div v-else class="flex aspect-4/5 items-center justify-center bg-white/5 text-7xl">⚽</div>
            </div>

            <div class="mt-5">
              <p class="text-[0.72rem] font-black uppercase text-primary">Perfil público</p>
              <h1 class="mt-2 text-balance text-4xl font-black uppercase leading-[0.94] text-white" style="font-family: 'Gobold High', sans-serif;">
                {{ nombreCompleto }}
              </h1>
              <p class="mt-3 text-base font-semibold text-white/74">{{ rolPrincipal }}</p>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <span v-for="equipo in equiposDisplay" :key="equipo" class="inline-flex min-h-10 items-center rounded-full border border-primary/30 bg-primary/10 px-4 text-xs font-black uppercase text-primary">
                {{ equipo }}
              </span>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div v-for="item in capsulasPerfil" :key="item.label" class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <p class="text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/46">{{ item.label }}</p>
                <p class="mt-2 text-lg font-black uppercase text-white">{{ item.valor }}</p>
              </div>
            </div>

            <a
              v-if="instagramUrl"
              :href="instagramUrl"
              target="_blank"
              rel="noreferrer"
              class="mt-5 inline-flex min-h-12 w-full items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black uppercase text-primary transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.96]"
            >
              <span>
                <span class="block text-[0.66rem] tracking-[0.16em] text-white/56">Instagram</span>
                <span class="mt-1 block">{{ instagramDisplay }}</span>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          </aside>

          <div class="space-y-6">
            <article class="rounded-3xl border border-white/10 bg-[#f4efe5] p-6 text-slate-950 shadow-2xl">
              <p class="text-[0.72rem] font-black uppercase text-primary-dark">Ficha Vikinga</p>
              <h2 class="mt-2 text-balance text-4xl font-black uppercase" style="font-family: 'Gobold High', sans-serif;">
                {{ titularPerfil }}
              </h2>
              <p class="mt-4 text-pretty text-base font-semibold leading-8 text-slate-600">
                {{ bioPrincipal }}
              </p>

              <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div v-for="item in fichaRapida" :key="item.label" class="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
                  <p class="text-[0.68rem] font-black uppercase text-slate-500">{{ item.label }}</p>
                  <p class="mt-2 text-lg font-black uppercase text-slate-950">{{ item.valor }}</p>
                </div>
              </div>

              <div v-if="mensajePerfil" class="mt-5 rounded-2xl border border-primary/18 bg-primary/8 px-4 py-4 text-sm font-semibold leading-7 text-slate-700">
                {{ mensajePerfil }}
              </div>
            </article>

            <article v-if="galeriaPublica.length > 0" class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-[0.72rem] font-black uppercase text-primary">Momentos del perfil</p>
                  <h2 class="mt-2 text-3xl font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">
                    Galería pública
                  </h2>
                </div>
                <router-link to="/fotos" class="text-sm font-black uppercase text-primary">
                  Ver más fotos
                </router-link>
              </div>

              <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <a
                  v-for="(foto, idx) in galeriaPublica"
                  :key="`${foto}-${idx}`"
                  :href="foto"
                  target="_blank"
                  rel="noreferrer"
                  class="group overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                >
                  <img :src="foto" :alt="`${nombreCompleto} foto ${idx + 1}`" class="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </a>
              </div>
            </article>

            <article v-if="mostrarEstadisticas" class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-[0.72rem] font-black uppercase text-primary">Producción</p>
                  <h2 class="mt-2 text-3xl font-black uppercase text-white" style="font-family: 'Gobold High', sans-serif;">
                    Números del perfil
                  </h2>
                </div>
                <router-link to="/estadisticas" class="text-sm font-black uppercase text-primary">
                  Ver tabla completa
                </router-link>
              </div>

              <div class="mt-5 grid gap-3 sm:grid-cols-3">
                <div class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-center">
                  <p class="text-[0.68rem] font-black uppercase text-white/48">Goles</p>
                  <p class="mt-2 text-3xl font-black text-primary">{{ totales.goles }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-center">
                  <p class="text-[0.68rem] font-black uppercase text-white/48">Asistencias</p>
                  <p class="mt-2 text-3xl font-black text-primary">{{ totales.asistencias }}</p>
                </div>
              </div>

              <div v-if="estadisticasPorEquipo.length > 0" class="mt-5 grid gap-3 sm:grid-cols-2">
                <div v-for="item in estadisticasPorEquipo" :key="item.equipo" class="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-4">
                  <p class="text-[0.68rem] font-black uppercase text-primary">{{ item.equipo }}</p>
                  <div class="mt-3 grid grid-cols-2 gap-2 text-center text-sm font-black tabular-nums text-white">
                    <div>
                      <p class="text-white/42">G</p>
                      <p class="mt-1 text-lg">{{ item.goles }}</p>
                    </div>
                    <div>
                      <p class="text-white/42">A</p>
                      <p class="mt-1 text-lg">{{ item.asistencias }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { obtenerTotalesEstadisticasJugadora, sincronizarEstadisticasEquipo } from '../firebase/estadisticas';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const error = ref('');
const perfil = ref(null);
const estadisticasAscenso = ref(null);
const estadisticasSerieC = ref(null);
const totalesDirectos = ref({ goles: 0, asistencias: 0, partidos: 0 });

const TEAM_LABELS = {
  ascenso: 'Ascenso',
  escuela: 'Escuela',
  serieC: 'Serie C'
};

const normalizarEquipo = (equipo = '') => {
  const valor = equipo.toString().trim().toLowerCase();
  if (valor === 'seriec' || valor === 'serie-c') return 'serieC';
  if (valor === 'ascenso' || valor === 'escuela' || valor === 'serieC') return valor;
  return '';
};

const extraerEquipos = (data = {}) => {
  if (Array.isArray(data.equipos) && data.equipos.length > 0) {
    return [...new Set(data.equipos.map(normalizarEquipo).filter(Boolean))];
  }

  const equipoNormalizado = normalizarEquipo(data.equipo);
  if (equipoNormalizado) {
    return [equipoNormalizado];
  }

  if ((data.equipo || '').toString().trim().toLowerCase() === 'ambos') {
    return ['ascenso', 'escuela'];
  }

  return [];
};

const esCuerpoTecnico = computed(() => {
  const posicion = perfil.value?.posicion || '';
  return posicion === 'Directora Técnica' || posicion === 'Preparador Porteras' || posicion === 'Profe';
});

const nombreCompleto = computed(() => {
  if (!perfil.value) return '';
  return `${perfil.value.nombre || ''} ${perfil.value.apellido || ''}`.trim();
});

const fotoPerfil = computed(() => perfil.value?.fotoPerfil || perfil.value?.foto || '');

const equiposDisplay = computed(() => extraerEquipos(perfil.value).map((equipo) => TEAM_LABELS[equipo] || equipo));

const rolPrincipal = computed(() => perfil.value?.posicion || 'Integrante del club');

const titularPerfil = computed(() => {
  if (!perfil.value) return 'Perfil de Vikinga';
  if (esCuerpoTecnico.value) {
    return 'Parte del cuerpo técnico del club';
  }
  return perfil.value?.bioPublica ? 'Una historia dentro del plantel' : 'Recorrido dentro del plantel';
});

const descripcionPerfil = computed(() => {
  if (!perfil.value) return '';

  const equipos = equiposDisplay.value.join(' y ');
  const dorsal = perfil.value?.dorsal ? ` Usa el dorsal #${perfil.value.dorsal}.` : '';

  if (esCuerpoTecnico.value) {
    return `${nombreCompleto.value} forma parte del trabajo formativo y competitivo de Vikingas${equipos ? ` en ${equipos}` : ''}.`;
  }

  return `${nombreCompleto.value} integra Vikingas${equipos ? ` en ${equipos}` : ''} y aporta desde ${perfil.value.posicion || 'su juego'} al proceso colectivo del club.${dorsal}`;
});

const bioPrincipal = computed(() => {
  const bio = perfil.value?.bioPublica?.toString().trim();
  return bio || descripcionPerfil.value;
});

const trayectoriaDisplay = computed(() => {
  const valor = Number(perfil.value?.aniosTrayectoria || 0);
  return valor > 0 ? `${valor} años` : '';
});

const instagramDisplay = computed(() => {
  const valor = (perfil.value?.instagram || '').toString().trim();
  if (!valor) return '';
  return valor.startsWith('@') ? valor : `@${valor.replace(/^@+/, '')}`;
});

const instagramUrl = computed(() => {
  if (!instagramDisplay.value) return '';
  return `https://instagram.com/${instagramDisplay.value.replace(/^@/, '')}`;
});

const galeriaPublica = computed(() => {
  const fotos = Array.isArray(perfil.value?.galeriaPublica) ? perfil.value.galeriaPublica : [];
  const imagenes = fotos.filter(item => typeof item === 'string' && /^https?:\/\//i.test(item));
  const fotoPrincipal = fotoPerfil.value;
  return [...new Set(imagenes.filter(item => item !== fotoPrincipal))].slice(0, 6);
});

const fichaRapida = computed(() => {
  const items = [
    { label: esCuerpoTecnico.value ? 'Rol' : 'Posición', valor: perfil.value?.posicion || 'Por definir' },
    { label: 'Dorsal', valor: perfil.value?.dorsal ? `#${perfil.value.dorsal}` : 'Sin dorsal' }
  ];

  if (perfil.value?.pieHabil) {
    items.push({ label: 'Pie hábil', valor: perfil.value.pieHabil });
  }

  if (trayectoriaDisplay.value) {
    items.push({ label: esCuerpoTecnico.value ? 'Trayectoria' : 'Experiencia', valor: trayectoriaDisplay.value });
  }

  return items;
});

const capsulasPerfil = computed(() => {
  const items = [
    { label: 'Categorías', valor: equiposDisplay.value.join(' / ') || 'Vikingas' },
    { label: 'Estado', valor: esCuerpoTecnico.value ? 'Staff activo' : 'Perfil activo' }
  ];

  if (trayectoriaDisplay.value) {
    items.push({ label: 'Recorrido', valor: trayectoriaDisplay.value });
  }

  if (perfil.value?.pieHabil && !esCuerpoTecnico.value) {
    items.push({ label: 'Pie fuerte', valor: perfil.value.pieHabil });
  }

  return items;
});

const mensajePerfil = computed(() => {
  if (esCuerpoTecnico.value) {
    return `${nombreCompleto.value} acompaña la construcción competitiva y formativa del club, sosteniendo una identidad de trabajo que se refleja dentro y fuera de la cancha.`;
  }

  if (trayectoriaDisplay.value && perfil.value?.pieHabil) {
    return `${nombreCompleto.value} suma ${trayectoriaDisplay.value.toLowerCase()} de recorrido y un perfil de juego desde ${perfil.value.pieHabil.toLowerCase()}, aportando identidad propia al plantel.`;
  }

  return '';
});

const estadisticasPorEquipo = computed(() => {
  const items = [];

  if (estadisticasAscenso.value?.totales) {
    items.push({ equipo: 'Ascenso', ...estadisticasAscenso.value.totales });
  }

  if (estadisticasSerieC.value?.totales) {
    items.push({ equipo: 'Serie C', ...estadisticasSerieC.value.totales });
  }

  return items;
});

const totales = computed(() => {
  const agregados = estadisticasPorEquipo.value.reduce((acc, item) => {
    acc.goles += Number(item.goles || 0);
    acc.asistencias += Number(item.asistencias || 0);
    acc.partidos += Number(item.partidos || 0);
    return acc;
  }, { goles: 0, asistencias: 0, partidos: 0 });

  return {
    goles: Math.max(agregados.goles, Number(totalesDirectos.value?.goles || 0)),
    asistencias: Math.max(agregados.asistencias, Number(totalesDirectos.value?.asistencias || 0)),
    partidos: Math.max(agregados.partidos, Number(totalesDirectos.value?.partidos || 0))
  };
});

const mostrarEstadisticas = computed(() => {
  if (esCuerpoTecnico.value) {
    return false;
  }

  return totales.value.goles > 0 || totales.value.asistencias > 0 || totales.value.partidos > 0 || estadisticasPorEquipo.value.length > 0;
});

const volverAtras = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
    return;
  }

  router.push('/equipo');
};

const cargarPerfil = async () => {
  isLoading.value = true;
  error.value = '';
  perfil.value = null;
  estadisticasAscenso.value = null;
  estadisticasSerieC.value = null;
  totalesDirectos.value = { goles: 0, asistencias: 0, partidos: 0 };

  try {
    const jugadoraId = route.params.id?.toString();
    if (!jugadoraId) {
      error.value = 'Perfil inválido.';
      return;
    }

    const perfilSnap = await getDoc(doc(db, 'jugadoraRegistro', jugadoraId));

    if (!perfilSnap.exists()) {
      error.value = 'Perfil no encontrado.';
      return;
    }

    perfil.value = {
      id: perfilSnap.id,
      ...perfilSnap.data()
    };

    const equiposPerfil = extraerEquipos({ id: perfilSnap.id, ...perfilSnap.data() }).filter((equipo) => equipo === 'ascenso' || equipo === 'serieC');

    if (equiposPerfil.length > 0) {
      await Promise.all(equiposPerfil.map((equipo) => sincronizarEstadisticasEquipo(equipo)));
    }

    const [ascensoSnap, serieCSnap, totalesSnap] = await Promise.all([
      getDoc(doc(db, 'estadisticasAscenso', jugadoraId)),
      getDoc(doc(db, 'estadisticasSerieC', jugadoraId)),
      obtenerTotalesEstadisticasJugadora(jugadoraId)
    ]);

    estadisticasAscenso.value = ascensoSnap.exists() ? ascensoSnap.data() : null;
    estadisticasSerieC.value = serieCSnap.exists() ? serieCSnap.data() : null;
    totalesDirectos.value = totalesSnap;
  } catch (err) {
    error.value = 'No pudimos cargar la ficha pública.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(cargarPerfil);
watch(() => route.params.id, cargarPerfil);
</script>