/**
 * Composable para gestionar la lógica del campeonato interno
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  obtenerDatosCampeonato,
  escucharCampeonato,
  agregarGol as agregarGolFirebase,
  restarGol as restarGolFirebase,
  calcularTotalGoles,
  obtenerTablaGoleadoras,
  equiposCampeonato,
  isLoading as loadingCampeonato,
  obtenerPartidos,
  escucharPartidos,
  escucharTabla,
  obtenerPartidosPorFecha,
  agregarGoleadoraPartido,
  removerGoleadoraPartido,
  actualizarEstadoPartido,
  obtenerTabla
} from '../firebase/campeonatoInterno';

export const useCampeonato = () => {
  // Estado
  const partidos = ref([]);
  const partidosPorFecha = ref({});
  const tablaPosiciones = ref([]);
  const tablaGoleadoras = ref([]);
  const loadingPartidos = ref(false);
  const guardandoGol = ref(false);
  const guardandoGoleadora = ref(false);
  
  // Referencias para edición
  const partidoEditandoGoleadoras = ref(null);
  const jugadoraSeleccionada = ref('');
  
  // Listeners
  let unsubscribe = null;
  let unsubscribePartidos = null;
  let unsubscribeTabla = null;

  // Computed
  const equipos = computed(() => equiposCampeonato.value);
  const loading = computed(() => loadingCampeonato.value);

  /**
   * GOLES POR EQUIPO
   */
  const agregarGol = async (equipoKey, jugadoraIndex) => {
    if (guardandoGol.value) return;
    
    guardandoGol.value = true;
    try {
      await agregarGolFirebase(equipoKey, jugadoraIndex);
      await cargarTablaGoleadoras();
    } catch (err) {
      console.error('Error agregando gol:', err);
      throw err;
    } finally {
      guardandoGol.value = false;
    }
  };

  const restarGol = async (equipoKey, jugadoraIndex) => {
    if (guardandoGol.value) return;
    if (!equipos.value[equipoKey]?.jugadoras?.[jugadoraIndex] || equipos.value[equipoKey]?.jugadoras?.[jugadoraIndex]?.goles === 0) {
      return;
    }
    
    guardandoGol.value = true;
    try {
      await restarGolFirebase(equipoKey, jugadoraIndex);
      await cargarTablaGoleadoras();
    } catch (err) {
      console.error('Error restando gol:', err);
      throw err;
    } finally {
      guardandoGol.value = false;
    }
  };

  const totalGoles = (equipoKey) => {
    return calcularTotalGoles(equipoKey);
  };

  /**
   * TABLA DE GOLEADORAS
   */
  const cargarTablaGoleadoras = async () => {
    try {
      tablaGoleadoras.value = await obtenerTablaGoleadoras();
    } catch (err) {
      console.error('Error cargando tabla de goleadoras:', err);
    }
  };

  const formatLastUpdate = () => {
    if (!equipos.value || !equipos.value.lastUpdated) return 'No disponible';
    const date = new Date(equipos.value.lastUpdated);
    return date.toLocaleString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * PARTIDOS
   */
  const cargarPartidos = async () => {
    loadingPartidos.value = true;
    try {
      partidos.value = await obtenerPartidos();
      partidosPorFecha.value = await obtenerPartidosPorFecha();
    } catch (err) {
      console.error('Error cargando partidos:', err);
    } finally {
      loadingPartidos.value = false;
    }
  };

  const cargarTablaPosiciones = async () => {
    try {
      tablaPosiciones.value = await obtenerTabla();
    } catch (err) {
      console.error('Error cargando tabla:', err);
    }
  };

  /**
   * GESTIÓN DE GOLEADORAS EN PARTIDOS
   */
  const editarGoleadoras = (partido) => {
    partidoEditandoGoleadoras.value = { ...partido };
    jugadoraSeleccionada.value = '';
  };

  const cancelarEdicionGoleadoras = () => {
    partidoEditandoGoleadoras.value = null;
    jugadoraSeleccionada.value = '';
  };

  const agregarGoleadoraAlPartido = async (equipoKey, nombreJugadora = null) => {
    const jugadora = nombreJugadora || jugadoraSeleccionada.value;
    if (!partidoEditandoGoleadoras.value || !jugadora || guardandoGoleadora.value) return;
    
    guardandoGoleadora.value = true;
    try {
      await agregarGoleadoraPartido(
        partidoEditandoGoleadoras.value.id,
        jugadora,
        equipoKey
      );
      jugadoraSeleccionada.value = '';
      await cargarPartidos();
      await cargarTablaPosiciones();
      
      // Actualizar el partido editando con los nuevos datos
      const partidoActualizado = partidos.value.find(p => p.id === partidoEditandoGoleadoras.value.id);
      if (partidoActualizado) {
        partidoEditandoGoleadoras.value = { ...partidoActualizado };
      }
    } catch (err) {
      console.error('Error agregando goleadora:', err);
      throw err;
    } finally {
      guardandoGoleadora.value = false;
    }
  };

  const removerUltimaGoleadora = async (equipoKey) => {
    if (!partidoEditandoGoleadoras.value || guardandoGoleadora.value) return;
    
    guardandoGoleadora.value = true;
    try {
      await removerGoleadoraPartido(
        partidoEditandoGoleadoras.value.id,
        equipoKey
      );
      await cargarPartidos();
      await cargarTablaPosiciones();
      
      const partidoActualizado = partidos.value.find(p => p.id === partidoEditandoGoleadoras.value.id);
      if (partidoActualizado) {
        partidoEditandoGoleadoras.value = { ...partidoActualizado };
      }
    } catch (err) {
      console.error('Error removiendo goleadora:', err);
      throw err;
    } finally {
      guardandoGoleadora.value = false;
    }
  };

  const cambiarEstadoPartido = async (partidoId, nuevoEstado) => {
    try {
      await actualizarEstadoPartido(partidoId, nuevoEstado);
      await cargarPartidos();
      await cargarTablaPosiciones();
    } catch (err) {
      console.error('Error cambiando estado:', err);
      throw err;
    }
  };

  const obtenerJugadorasEquipo = (equipoKey) => {
    return equipos.value[equipoKey]?.jugadoras?.map(j => j.nombre) || [];
  };

  const contarGolesEquipoEnPartido = (partido, equipoKey) => {
    if (!partido.goleadoras) return 0;
    return partido.goleadoras.filter(g => g.equipo === equipoKey).length;
  };

  const obtenerGoleadorasEquipoEnPartido = (partido, equipoKey) => {
    if (!partido.goleadoras) return [];
    return partido.goleadoras.filter(g => g.equipo === equipoKey);
  };

  /**
   * INICIALIZACIÓN Y CLEANUP
   */
  const inicializar = async () => {
    try {
      await obtenerDatosCampeonato();
      await cargarTablaGoleadoras();
      await cargarPartidos();
      await cargarTablaPosiciones();
      
      // Escuchar cambios en tiempo real
      unsubscribe = escucharCampeonato(async () => {
        await cargarTablaGoleadoras();
      });
      
      unsubscribePartidos = escucharPartidos(async (nuevosPartidos) => {
        partidos.value = nuevosPartidos;
        const porFecha = {};
        nuevosPartidos.forEach(p => {
          const numeroFecha = p.numeroFecha || 1;
          if (!porFecha[numeroFecha]) porFecha[numeroFecha] = [];
          porFecha[numeroFecha].push(p);
        });
        partidosPorFecha.value = porFecha;
      });
      
      unsubscribeTabla = escucharTabla(async (nuevaTabla) => {
        tablaPosiciones.value = nuevaTabla;
      });
    } catch (err) {
      console.error('Error inicializando campeonato:', err);
      throw err;
    }
  };

  const cleanup = () => {
    if (unsubscribe) unsubscribe();
    if (unsubscribePartidos) unsubscribePartidos();
    if (unsubscribeTabla) unsubscribeTabla();
  };

  return {
    // Estado
    equipos,
    partidos,
    partidosPorFecha,
    tablaPosiciones,
    tablaGoleadoras,
    loading,
    loadingPartidos,
    guardandoGol,
    guardandoGoleadora,
    partidoEditandoGoleadoras,
    jugadoraSeleccionada,
    
    // Métodos - Goles
    agregarGol,
    restarGol,
    totalGoles,
    
    // Métodos - Tabla Goleadoras
    cargarTablaGoleadoras,
    formatLastUpdate,
    
    // Métodos - Partidos
    cargarPartidos,
    cargarTablaPosiciones,
    editarGoleadoras,
    cancelarEdicionGoleadoras,
    agregarGoleadoraAlPartido,
    removerUltimaGoleadora,
    cambiarEstadoPartido,
    obtenerJugadorasEquipo,
    contarGolesEquipoEnPartido,
    obtenerGoleadorasEquipoEnPartido,
    
    // Lifecycle
    inicializar,
    cleanup
  };
};
