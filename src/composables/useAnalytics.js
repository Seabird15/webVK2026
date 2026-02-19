/**
 * Composable para Google Analytics
 * Proporciona funciones para tracking de eventos y páginas
 */

/**
 * Verifica si gtag está disponible
 */
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Envía un evento personalizado a Google Analytics
 * @param {string} eventName - Nombre del evento
 * @param {object} params - Parámetros adicionales del evento
 */
export const trackEvent = (eventName, params = {}) => {
  if (!isGtagAvailable()) {
    console.warn('Google Analytics no está disponible');
    return;
  }

  window.gtag('event', eventName, params);
};

/**
 * Trackea una vista de página
 * @param {string} pagePath - Ruta de la página
 * @param {string} pageTitle - Título de la página
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (!isGtagAvailable()) {
    console.warn('Google Analytics no está disponible');
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href
  });
};

/**
 * Trackea inscripción a entrenamiento
 * @param {string} entrenamientoId - ID del entrenamiento
 * @param {string} tipo - Tipo de entrenamiento (entrenamiento, partido, amistoso)
 */
export const trackInscripcionEntrenamiento = (entrenamientoId, tipo) => {
  trackEvent('inscripcion_entrenamiento', {
    entrenamiento_id: entrenamientoId,
    tipo_entrenamiento: tipo
  });
};

/**
 * Trackea baja de entrenamiento
 * @param {string} entrenamientoId - ID del entrenamiento
 * @param {string} motivo - Motivo de la baja
 */
export const trackBajaEntrenamiento = (entrenamientoId, motivo) => {
  trackEvent('baja_entrenamiento', {
    entrenamiento_id: entrenamientoId,
    tiene_motivo: !!motivo
  });
};

/**
 * Trackea login de usuario
 * @param {string} tipo - Tipo de usuario (admin, jugadora)
 */
export const trackLogin = (tipo) => {
  trackEvent('login', {
    tipo_usuario: tipo
  });
};

/**
 * Trackea visualización de galería
 * @param {string} galeriaId - ID de la galería
 * @param {string} titulo - Título de la galería
 */
export const trackVisualizacionGaleria = (galeriaId, titulo) => {
  trackEvent('ver_galeria', {
    galeria_id: galeriaId,
    galeria_titulo: titulo
  });
};

/**
 * Trackea click en sponsor
 * @param {string} sponsorNombre - Nombre del sponsor
 */
export const trackClickSponsor = (sponsorNombre) => {
  trackEvent('click_sponsor', {
    sponsor_nombre: sponsorNombre
  });
};

/**
 * Trackea descarga de fixture/calendario
 */
export const trackDescargaFixture = () => {
  trackEvent('descarga_fixture');
};

/**
 * Trackea acceso a perfil de jugadora
 * @param {string} jugadoraId - ID de la jugadora
 */
export const trackAccesoPerfil = (jugadoraId) => {
  trackEvent('acceso_perfil', {
    jugadora_id: jugadoraId
  });
};

/**
 * Trackea solicitud de registro
 * @param {string} equipo - Equipo seleccionado
 */
export const trackSolicitudRegistro = (equipo) => {
  trackEvent('solicitud_registro', {
    equipo: equipo
  });
};

/**
 * Hook principal para usar en componentes Vue
 */
export const useAnalytics = () => {
  return {
    trackEvent,
    trackPageView,
    trackInscripcionEntrenamiento,
    trackBajaEntrenamiento,
    trackLogin,
    trackVisualizacionGaleria,
    trackClickSponsor,
    trackDescargaFixture,
    trackAccesoPerfil,
    trackSolicitudRegistro
  };
};
