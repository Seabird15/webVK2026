/**
 * Archivo de debug para verificar el filtrado de entrenamientos
 * Este archivo ayuda a diagnosticar si el filtrado por días está funcionando correctamente
 */

import {
  obtenerDiasDisponiblesJugadora,
  esEventoConRestriccionSemanal,
  obtenerDiaSemanaEntrenamiento,
  jugadoraPuedeAsistirEntrenamiento,
  normalizarEquipoDisponibilidad
} from './disponibilidadEntrenamientos';

export const debugFiltroEntrenamiento = (jugadora = {}, entrenamiento = {}) => {
  const nombreJugadora = `${jugadora?.nombre || ''} ${jugadora?.apellido || ''}`.trim();
  const nombreEntrenamiento = entrenamiento?.nombre || 'Sin nombre';

  console.group(`🔍 DEBUG FILTRO: ${nombreJugadora} → ${nombreEntrenamiento}`);

  // 1. Verificar estructura básica
  console.log('📋 Datos de jugadora:');
  console.log('  - Nombre:', nombreJugadora);
  console.log('  - Equipos:', jugadora?.equipos);
  console.log('  - disponibilidadEntrenamientos:', jugadora?.disponibilidadEntrenamientos);

  console.log('\n📋 Datos de entrenamiento:');
  console.log('  - Nombre:', nombreEntrenamiento);
  console.log('  - Tipo:', entrenamiento?.tipo);
  console.log('  - Equipo:', entrenamiento?.equipo);
  console.log('  - Fecha:', entrenamiento?.fecha);
  console.log('  - esConvocatoria:', entrenamiento?.esConvocatoria);

  // 2. Verificar restricción semanal
  const tieneRestriccion = esEventoConRestriccionSemanal(entrenamiento);
  console.log('\n🔐 Restricción semanal:');
  console.log('  - ¿Tiene restricción?:', tieneRestriccion);

  if (!tieneRestriccion) {
    console.log('  ✅ SIN RESTRICCIÓN → Jugadora PUEDE asistir (no necesita validar días)');
    console.log('  📍 Tipo de evento sin restricción (partido/amistoso/convocatoria)');
    console.groupEnd();
    return true;
  }

  // 3. Verificar día de semana del entrenamiento
  const diaSemana = obtenerDiaSemanaEntrenamiento(entrenamiento);
  const diasNombre = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  console.log('\n📅 Día del entrenamiento:');
  console.log('  - Número:', diaSemana);
  console.log('  - Nombre:', diasNombre[diaSemana] || 'Desconocido');

  // 4. Verificar días disponibles
  const equipo = normalizarEquipoDisponibilidad(entrenamiento?.equipo);
  const diasDisponibles = obtenerDiasDisponiblesJugadora(jugadora, equipo);
  console.log('\n📅 Días disponibles para la jugadora (equipo: ' + equipo + '):');
  console.log('  - Números:', diasDisponibles);
  console.log('  - Nombres:', diasDisponibles.map(d => diasNombre[d]).join(', '));

  // 5. Verificar resultado final
  const puedeAsistir = jugadoraPuedeAsistirEntrenamiento(jugadora, entrenamiento);
  console.log('\n✅ RESULTADO FINAL:');
  console.log('  - ¿Puede asistir?:', puedeAsistir);

  if (diaSemana === null) {
    console.log('  📍 Día es nulo → Se permite (default)');
  } else if (diasDisponibles.length === 0) {
    console.log('  ❌ No hay días disponibles → NO puede asistir');
  } else if (diasDisponibles.includes(diaSemana)) {
    console.log(`  ✅ ${diasNombre[diaSemana]} está en los días disponibles → PUEDE asistir`);
  } else {
    console.log(`  ❌ ${diasNombre[diaSemana]} NO está en los días disponibles → NO puede asistir`);
  }

  console.groupEnd();
  return puedeAsistir;
};

export const debugListaFiltrada = (entrenamientos = [], jugadora = {}) => {
  console.group('📊 ANÁLISIS DE FILTRADO COMPLETO');
  console.log(`Jugadora: ${jugadora?.nombre} ${jugadora?.apellido}`);
  console.log(`Total entrenamientos: ${entrenamientos.length}`);

  const resultados = entrenamientos.map(e => {
    const puede = jugadoraPuedeAsistirEntrenamiento(jugadora, e);
    return { entrenamiento: e, puede };
  });

  const filtrados = resultados.filter(r => r.puede);
  const excluidos = resultados.filter(r => !r.puede);

  console.log(`✅ Entrenamientos VISIBLES: ${filtrados.length}`);
  filtrados.forEach(r => {
    console.log(`   - ${r.entrenamiento?.nombre} (${r.entrenamiento?.tipo})`);
  });

  console.log(`\n❌ Entrenamientos EXCLUIDOS: ${excluidos.length}`);
  excluidos.forEach(r => {
    const diaSemana = obtenerDiaSemanaEntrenamiento(r.entrenamiento);
    const diasNombre = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    console.log(`   - ${r.entrenamiento?.nombre} (${diasNombre[diaSemana]})`);
  });

  console.groupEnd();
};
