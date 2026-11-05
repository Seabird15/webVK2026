/**
 * Archivo de debug para verificar el filtrado de entrenamientos
 * Este archivo ayuda a diagnosticar si el filtrado por días está funcionando correctamente
 */

import {
  jugadoraPuedeAsistirEntrenamiento
} from './disponibilidadEntrenamientos';

export const debugFiltroEntrenamiento = (jugadora = {}, entrenamiento = {}) =>
  jugadoraPuedeAsistirEntrenamiento(jugadora, entrenamiento);

export const debugListaFiltrada = (entrenamientos = [], jugadora = {}) => {
  return entrenamientos.map(entrenamiento => ({
    entrenamiento,
    puede: jugadoraPuedeAsistirEntrenamiento(jugadora, entrenamiento)
  }));
};
