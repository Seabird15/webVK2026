# Entrenamientos con Actualizaciones en Tiempo Real

## Descripción

Se ha mejorado significativamente la vista de entrenamientos para mostrar los estados de las jugadoras y actualizarse automáticamente en tiempo real usando **Firebase Realtime Listeners** (`onSnapshot`).

## Características Principales

### 1. Vista de Jugadora (Entrenamientos.vue)

Ahora muestra un desglose completo de participantes al ver los detalles:

#### Estados Visuales:
- **✓ Confirmadas (Verde)**: Jugadoras inscritas y confirmadas
- **✕ Bajas (Rojo)**: Jugadoras que se han dado de baja
- **? Sin respuesta (Amarillo)**: Jugadoras aún sin confirmar

#### Características:
- 🔄 **Actualización en tiempo real**: Los cambios se reflejan instantáneamente
- 👀 **Listas organizadas**: Cada estado en su propia sección con color distintivo
- 📊 **Conteo de participantes**: Muestra el total en cada categoría
- 📱 **Scroll en listas largas**: Si hay muchas inscritas, la lista es scrolleable

### 2. Vista de Admin (GestionarEntrenamientos.vue)

#### Mejoras añadidas:
- **Botón "Ver Detalles"**: Abre un modal con información completa de inscripciones
- **Resumen de estados**: Muestra pills con conteos:
  - Confirmadas (verde)
  - Bajas (rojo)
  - Sin respuesta (amarillo)
- **Modal de detalles**: Organiza todas las inscritas por estado
- 🔄 **Actualización en tiempo real**: Refleja cambios instantáneamente mientras se ve

### 3. Servicio Firebase (inscripciones.js)

#### Nueva función:
```javascript
export const escucharInscripcionesEntrenamiento = (entrenamientoId, callback) => {
  // Escucha cambios en tiempo real
  // Organiza por estados automáticamente
  // Llama callback cada que hay cambios
}
```

**Ventajas:**
- Usa `onSnapshot` en lugar de `getDocs` para cambios en vivo
- Automáticamente organiza inscritas por estado
- Mantiene conexión abierta mientras se necesita

## Estructura de Datos

### Colección: inscripcionesEntrenamientos

```firestore
{
  id: "doc123",
  entrenamientoId: "ent456",
  jugadoraId: "uid789",
  jugadoraNombre: "María García",
  estado: "confirmada", // confirmada | baja | pendiente
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Flujo de Uso

### Desde la vista de Jugadora:

1. Jugadora abre "Entrenamientos"
2. Ve lista de entrenamientos con su estado personal (inscrita/sin inscribirse)
3. Clickea "Detalles" en un entrenamiento
4. Se abre modal con 3 secciones:
   - ✓ Confirmadas: Lista de inscritas
   - ✕ Bajas: Jugadoras que se dieron de baja
   - ? Sin respuesta: (No aparece si no hay)
5. 🔄 **Actualización en vivo**: Si otra jugadora se inscribe, aparece instantáneamente en la lista

### Desde la vista de Admin:

1. Admin ve entrenamientos con pills de conteos
2. Clickea "Ver Detalles"
3. Se abre modal con:
   - Información del entrenamiento
   - 3 secciones organizadas por estado
   - Nombres de todas las inscritas
4. 🔄 **Actualización en vivo**: Cambios se ven instantáneamente
5. **Sin necesidad de recargar**: Los datos están siempre actualizados

## Mejoras Técnicas

### 1. Listeners en Tiempo Real
```javascript
const unsubscribe = escucharInscripcionesEntrenamiento(id, (datos) => {
  // Se ejecuta cada que hay cambios en Firestore
  inscritasOrganizadas.value = datos;
});

// Limpiar listener cuando se cierre el modal
unsubscribe();
```

### 2. Gestión de Listeners
- Se crean cuando se abre un modal
- Se limpian cuando se cierra
- Se desuscriben en `onUnmounted` del componente
- Previene memory leaks

### 3. Organización Automática
```javascript
{
  confirmadas: [...],  // estado === 'confirmada'
  bajas: [...],        // estado === 'baja'
  pendientes: [...]    // estado === 'pendiente'
}
```

## Interfaz de Usuario

### Cards de Entrenamientos

Ahora muestran:
- Nombre del entrenamiento
- Fecha y hora
- Lugar
- Capacidad (si está configurada)
- **Nuevo**: Buttons "Inscribirse / Darse de baja / Ver Detalles"

### Modales de Detalles

#### Para Jugadora:
```
┌─────────────────────────┐
│ Detalles del Entrenamiento
│
│ ✓ Confirmadas (5)
│ ├─ María García
│ ├─ Ana Rodríguez
│ └─ ...
│
│ ✕ Bajas (1)
│ └─ Sofia López
│
│ ? Sin respuesta (2)
│ ├─ Laura Díaz
│ └─ ...
└─────────────────────────┘
```

#### Para Admin:
- Similar a jugadora pero con vista más completa
- Conteos visibles en pills de colores
- Mejor para monitoreo

## Rendimiento

### Optimizaciones:
1. **Listeners específicos**: Solo escucha el entrenamiento abierto
2. **Limpieza automática**: Se desuscribe al cerrar modal
3. **Colores y emojis**: Mejora visual sin impactar rendimiento
4. **Scroll eficiente**: Listas largas no ralentizan la UI

### Escalabilidad:
- Funciona bien incluso con muchas inscritas
- Firestore optimiza query automáticamente
- Real-time listeners son eficientes

## Estados Posibles

### Para una Inscripción:

1. **confirmada** ✓
   - Jugadora está inscrita y asistirá
   - Aparece en lista verde
   - Es la acción por defecto al inscribirse

2. **baja** ✕
   - Jugadora se dio de baja
   - Puede volver a inscribirse
   - Aparece en lista roja

3. **pendiente** ?
   - Jugadora fue agregada pero no confirma
   - No usada actualmente en el flujo
   - Aparece en lista amarilla si existe

## Casos de Uso

### Caso 1: Jugadora ve a quién le acompaña
```
1. Abre Entrenamientos
2. Ve un entrenamiento próximo
3. Clickea "Detalles"
4. Ve lista de compañeras inscritas
5. Decide si inscribirse o no
```

### Caso 2: Admin monitorea asistencia
```
1. Abre Admin > Entrenamientos
2. Ve lista de entrenamientos con conteos
3. Clickea "Ver Detalles" en uno
4. Ve exactamente quién confirmó, quién se dio de baja
5. Toma decisiones sobre el entrenamiento
```

### Caso 3: Actualización en vivo durante reunión
```
1. Varias personas viendo el mismo entrenamiento
2. Una jugadora se inscribe
3. Instantáneamente aparece en la lista de todas
4. Sin recargar página
```

## Cambios de Archivos

### inscripciones.js
- ✅ Agregado `onSnapshot` en imports
- ✅ Nueva función `escucharInscripcionesEntrenamiento()`
- Organiza automáticamente por estado

### Entrenamientos.vue
- ✅ Nuevo ref `inscritasOrganizadas`
- ✅ Gestión de listeners en `onMounted/onUnmounted`
- ✅ Modal mejorado con 3 secciones
- ✅ Actualización en tiempo real

### GestionarEntrenamientos.vue
- ✅ Botón "Ver Detalles" para admin
- ✅ Modal de detalles con estados
- ✅ Conteos en pills de colores
- ✅ Listeners en tiempo real para admin
- ✅ Limpieza en `onUnmounted`

## Flujo Técnico

```
Firestore inscripcionesEntrenamientos
         ↓
escucharInscripcionesEntrenamiento()
         ↓
onSnapshot (listener)
         ↓
Organiza por estado (confirmadas/bajas/pendientes)
         ↓
Actualiza refs reactivos
         ↓
Vue actualiza UI instantáneamente
```

## Testing

### Para probar en tiempo real:

1. **Abre el mismo entrenamiento en 2 pestañas**:
   - Pestaña A: Como jugadora
   - Pestaña B: Como otra jugadora

2. **En Pestaña B**: Clickea "Inscribirse"

3. **Observa Pestaña A**: 
   - La lista de "Confirmadas" se actualiza al instante
   - Sin recargar página
   - Sin clickear botón

4. **En Pestaña B**: Clickea "Darse de baja"

5. **Observa Pestaña A**:
   - Se mueve a lista de "Bajas"
   - Instantáneamente
   - Todo en tiempo real

## Troubleshooting

### Problema: No se actualiza en tiempo real
- **Solución**: Verifica que Firestore rules permitan read en inscripcionesEntrenamientos
- Abre console del navegador (F12)
- Busca errores de Firestore

### Problema: Listeners se acumulan
- **Solución**: Se limpian automáticamente en onUnmounted
- Si hay leak, revisar que unsubscribers.value se está limpiando

### Problema: Listas lentas
- **Solución**: Están optimizadas, pero si hay mucho volumen:
  - Implementar virtualización con `vue-virtual-scroll`
  - Filtrar por fechas pasadas/futuras

## Futuras Mejoras

1. **Notificaciones en vivo**:
   - Toast cuando alguien se inscribe
   - Pop-up de cambios importantes

2. **Historial de cambios**:
   - Ver quién se inscribió cuándo
   - Tracking de cambios de estado

3. **Auto-organización**:
   - Recordatorios automáticos antes del entrenamiento
   - Cambio automático de estado pasada la fecha

4. **Exportación**:
   - Descargar lista de inscritas en PDF
   - Enviar a WhatsApp/Email

5. **Comentarios**:
   - Las jugadoras dejen comentarios en el entrenamiento
   - Admin responda dudas
