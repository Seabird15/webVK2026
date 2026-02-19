# Configuración de Google Analytics 4

Este proyecto ya tiene Google Analytics 4 integrado. Solo necesitas configurar tu ID de medición.

## Paso 1: Obtener tu ID de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una cuenta si no tienes una, o selecciona una existente
3. Crea una nueva propiedad (Property) para "CD VIKINGAS"
4. Selecciona "Web" como plataforma
5. Copia tu **ID de medición** (formato: `G-XXXXXXXXXX`)

## Paso 2: Configurar el ID en el proyecto

Abre el archivo `index.html` y reemplaza `G-XXXXXXXXXX` con tu ID real en **2 lugares**:

```html
<!-- Línea 57: En el script src -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID-AQUI"></script>

<!-- Línea 62: En la configuración -->
gtag('config', 'TU-ID-AQUI', {
```

## Eventos que se trackean automáticamente

### Navegación
- ✅ **Page Views**: Cada cambio de página se trackea automáticamente

### Eventos personalizados disponibles
El composable `useAnalytics` proporciona las siguientes funciones:

- `trackInscripcionEntrenamiento(entrenamientoId, tipo)` - Cuando una jugadora se inscribe
- `trackBajaEntrenamiento(entrenamientoId, motivo)` - Cuando una jugadora se da de baja
- `trackLogin(tipo)` - Login de admin o jugadora
- `trackVisualizacionGaleria(galeriaId, titulo)` - Ver una galería de fotos
- `trackClickSponsor(sponsorNombre)` - Click en un sponsor
- `trackDescargaFixture()` - Descarga del fixture
- `trackAccesoPerfil(jugadoraId)` - Acceso al perfil
- `trackSolicitudRegistro(equipo)` - Nueva solicitud de registro

## Paso 3: Usar Analytics en componentes (opcional)

Para trackear eventos personalizados en tus componentes:

```javascript
import { useAnalytics } from '@/composables/useAnalytics';

// Dentro del componente
const { trackEvent, trackInscripcionEntrenamiento } = useAnalytics();

// Ejemplo de uso
const inscribirse = async (entrenamientoId) => {
  // Tu lógica de inscripción
  await inscribirJugadora(entrenamientoId);
  
  // Trackear el evento
  trackInscripcionEntrenamiento(entrenamientoId, 'entrenamiento');
};
```

## Verificar que funciona

1. Despliega tu sitio con el ID configurado
2. Visita tu sitio web
3. En Google Analytics, ve a **Realtime** → **Overview**
4. Deberías ver tu visita en tiempo real

## Ejemplo de implementación en Entrenamientos.vue

```javascript
import { useAnalytics } from '@/composables/useAnalytics';

const { trackInscripcionEntrenamiento, trackBajaEntrenamiento } = useAnalytics();

const confirmarInscripcion = async (entrenamiento) => {
  const success = await inscribirseEntrenamiento(entrenamiento.id, jugadoraAuthUser.value.uid);
  if (success) {
    // Trackear inscripción exitosa
    trackInscripcionEntrenamiento(entrenamiento.id, entrenamiento.tipo);
    mostrarToast('Inscripción confirmada', 'success');
  }
};

const confirmarBaja = async () => {
  const success = await desuscribirseEntrenamiento(
    entrenamientoParaBaja.value.id,
    jugadoraAuthUser.value.uid,
    motivoBaja.value
  );
  if (success) {
    // Trackear baja con motivo
    trackBajaEntrenamiento(entrenamientoParaBaja.value.id, motivoBaja.value);
    mostrarToast('Te diste de baja correctamente', 'success');
  }
};
```

## Notas importantes

- ⚠️ **No subas tu ID real a repositorios públicos** si quieres mantenerlo privado
- ✅ Los eventos solo se envían si `gtag` está disponible (producción)
- ✅ En desarrollo local verás warnings en consola, es normal
- ✅ Todos los page views se trackean automáticamente al navegar

## Configuración avanzada (opcional)

Si quieres excluir ciertas páginas del tracking, modifica el `router.afterEach` en `src/router/index.js`:

```javascript
router.afterEach((to, from) => {
  // Excluir página de login del tracking
  if (to.path === '/login' || to.path === '/login-jugadora') {
    return;
  }
  
  setTimeout(() => {
    const pageTitle = document.title || to.name || 'CD VIKINGAS';
    trackPageView(to.path, pageTitle);
  }, 100);
});
```
