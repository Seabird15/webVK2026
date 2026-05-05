const DIAS_SEMANA_LABELS = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miercoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sabado'
};

export const DIAS_ENTRENAMIENTO_POR_EQUIPO = {
  ascenso: [2, 5],
  escuela: [3, 0],
  serieC: [1]
};

const TIPOS_SIN_RESTRICCION_SEMANAL = new Set(['partido', 'amistoso']);
export const ESTADOS_EXCLUIDOS_ASISTENCIA = new Set(['lesionada', 'recuperacion', 'vacaciones']);

export const normalizarEquipoDisponibilidad = (equipo) => {
  const valor = (equipo || '').toString().trim().toLowerCase();

  if (valor === 'seriec' || valor === 'serie c') return 'serieC';
  if (valor === 'ascenso' || valor === 'escuela' || valor === 'ambos') return valor;

  return '';
};

export const normalizarDiaSemana = (dia) => {
  const numero = Number(dia);
  return Number.isInteger(numero) && numero >= 0 && numero <= 6 ? numero : null;
};

export const normalizarEstadoSalud = (estado) => {
  return (estado || '').toString().trim().toLowerCase();
};

export const normalizarDiasSemana = (dias = []) => {
  if (!Array.isArray(dias)) return [];

  const vistos = new Set();

  return dias
    .map((dia) => normalizarDiaSemana(dia))
    .filter((dia) => {
      if (dia === null || vistos.has(dia)) {
        return false;
      }

      vistos.add(dia);
      return true;
    })
    .sort((a, b) => a - b);
};

export const obtenerDiasBasePorEquipo = (equipo) => {
  const equipoNormalizado = normalizarEquipoDisponibilidad(equipo);
  return [...(DIAS_ENTRENAMIENTO_POR_EQUIPO[equipoNormalizado] || [])];
};

export const obtenerEtiquetasDiasSemana = (dias = []) => {
  return normalizarDiasSemana(dias).map((dia) => ({
    value: dia,
    label: DIAS_SEMANA_LABELS[dia] || `Dia ${dia}`
  }));
};

export const normalizarDisponibilidadEntrenamientos = (disponibilidad = {}, equipos = []) => {
  const equiposActivos = Array.isArray(equipos)
    ? equipos.map((equipo) => normalizarEquipoDisponibilidad(equipo)).filter(Boolean)
    : [];

  return equiposActivos.reduce((resultado, equipo) => {
    const diasPersonalizados = normalizarDiasSemana(disponibilidad?.[equipo]);
    resultado[equipo] = diasPersonalizados.length > 0
      ? diasPersonalizados
      : obtenerDiasBasePorEquipo(equipo);
    return resultado;
  }, {});
};

export const obtenerEquiposJugadoraDisponibilidad = (jugadora = {}) => {
  if (Array.isArray(jugadora?.equipos) && jugadora.equipos.length > 0) {
    return [...new Set(jugadora.equipos.map((equipo) => normalizarEquipoDisponibilidad(equipo)).filter(Boolean))];
  }

  const equipo = normalizarEquipoDisponibilidad(jugadora?.equipo);
  if (equipo === 'ambos') return ['ascenso', 'escuela'];
  if (equipo) return [equipo];
  return [];
};

export const obtenerDiasDisponiblesJugadora = (jugadora = {}, equipo) => {
  const equipoNormalizado = normalizarEquipoDisponibilidad(equipo);
  if (!equipoNormalizado || equipoNormalizado === 'ambos') return [];

  const equiposJugadora = obtenerEquiposJugadoraDisponibilidad(jugadora);
  if (!equiposJugadora.includes(equipoNormalizado)) return [];

  const disponibilidadNormalizada = normalizarDisponibilidadEntrenamientos(
    jugadora?.disponibilidadEntrenamientos || {},
    equiposJugadora
  );

  return disponibilidadNormalizada[equipoNormalizado] || obtenerDiasBasePorEquipo(equipoNormalizado);
};

export const esEventoConRestriccionSemanal = (entrenamiento = {}) => {
  const equipo = normalizarEquipoDisponibilidad(entrenamiento?.equipo);
  const tipo = (entrenamiento?.tipo || '').toString().trim().toLowerCase();

  if (!equipo || equipo === 'ambos') return false;
  if (entrenamiento?.esConvocatoria) return false;

  return !TIPOS_SIN_RESTRICCION_SEMANAL.has(tipo);
};

export const obtenerDiaSemanaEntrenamiento = (entrenamiento = {}) => {
  if (!entrenamiento?.fecha) return null;

  const fecha = new Date(entrenamiento.fecha?.seconds ? entrenamiento.fecha.seconds * 1000 : entrenamiento.fecha);
  if (Number.isNaN(fecha.getTime())) return null;

  return fecha.getDay();
};

export const jugadoraPuedeAsistirEntrenamiento = (jugadora = {}, entrenamiento = {}) => {
  if (!esEventoConRestriccionSemanal(entrenamiento)) {
    return true;
  }

  const equipo = normalizarEquipoDisponibilidad(entrenamiento?.equipo);
  const diaSemana = obtenerDiaSemanaEntrenamiento(entrenamiento);
  const diasDisponibles = obtenerDiasDisponiblesJugadora(jugadora, equipo);

  if (diaSemana === null) return true;
  if (diasDisponibles.length === 0) return false;

  return diasDisponibles.includes(diaSemana);
};

export const jugadoraExcluidaDeAsistencia = (jugadora = {}) => {
  return ESTADOS_EXCLUIDOS_ASISTENCIA.has(normalizarEstadoSalud(jugadora?.estadoSalud));
};

export const jugadoraCuentaParaAsistencia = (jugadora = {}, entrenamiento = {}) => {
  return !jugadoraExcluidaDeAsistencia(jugadora) && jugadoraPuedeAsistirEntrenamiento(jugadora, entrenamiento);
};

export const particionarInscripcionesPorAsistencia = (organizadas = {}, jugadorasPorId = new Map()) => {
  const visibles = {
    confirmadas: [],
    bajas: [],
    pendientes: []
  };
  const excluidas = [];

  ['confirmadas', 'bajas', 'pendientes'].forEach((estado) => {
    const items = Array.isArray(organizadas?.[estado]) ? organizadas[estado] : [];

    items.forEach((inscripcion) => {
      const jugadora = jugadorasPorId instanceof Map
        ? jugadorasPorId.get(inscripcion?.jugadoraId)
        : jugadorasPorId?.[inscripcion?.jugadoraId];

      if (jugadoraExcluidaDeAsistencia(jugadora)) {
        excluidas.push({
          ...inscripcion,
          estadoLista: estado,
          estadoSalud: normalizarEstadoSalud(jugadora?.estadoSalud)
        });
        return;
      }

      visibles[estado].push(inscripcion);
    });
  });

  return {
    visibles,
    excluidas
  };
};

export const obtenerResumenDisponibilidadJugadora = (jugadora = {}) => {
  const equipos = obtenerEquiposJugadoraDisponibilidad(jugadora);
  const disponibilidad = normalizarDisponibilidadEntrenamientos(jugadora?.disponibilidadEntrenamientos || {}, equipos);

  return equipos.map((equipo) => ({
    equipo,
    dias: obtenerEtiquetasDiasSemana(disponibilidad[equipo] || [])
  }));
};