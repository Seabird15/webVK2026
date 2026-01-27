# Sistema de Convocatorias para Partidos

## Descripción General

Se ha implementado un sistema de convocatorias/nóminas para partidos que permite a los administradores seleccionar específicamente qué jugadoras pueden anotarse a un partido.

## Funcionalidades Implementadas

### 1. Para Administradores

#### Crear Convocatoria
Cuando el administrador crea un nuevo partido o amistoso, ahora tiene la opción de:
- Activar el modo "Convocatoria/Nómina" mediante un checkbox
- Buscar y seleccionar jugadoras específicas para la convocatoria
- Ver la lista de jugadoras convocadas antes de guardar

#### Características del Formulario
- **Checkbox de convocatoria**: Solo aparece cuando el tipo es "Partido" o "Amistoso"
- **Buscador de jugadoras**: Permite buscar por nombre
- **Lista de convocadas**: Muestra las jugadoras seleccionadas con posibilidad de eliminarlas
- **Validación**: No permite guardar sin al menos una jugadora seleccionada si la convocatoria está activada

#### Vista de Entrenamientos (Admin)
- Los partidos con convocatoria muestran un badge morado "📋 Convocatoria - X jugadoras"
- Se puede ver quiénes están convocadas desde los detalles del entrenamiento

### 2. Para Jugadoras

#### Vista de Partidos
- Los partidos con convocatoria muestran un badge "📋 Convocatoria"
- Mensaje informativo: "Este es un partido con convocatoria. Solo las jugadoras convocadas pueden confirmar asistencia."
- Solo las jugadoras convocadas pueden ver y confirmar su asistencia

#### Modal de Detalles
- Muestra claramente cuando un partido tiene convocatoria activada
- Información destacada en color morado para fácil identificación

## Cambios Técnicos Realizados

### 1. Modelo de Datos (`entrenamientos`)
Se agregaron los siguientes campos a los documentos de entrenamientos:
```javascript
{
  esConvocatoria: boolean,      // Indica si es una convocatoria
  jugadorasConvocadas: [        // Array de jugadoras convocadas
    {
      id: string,               // ID de la jugadora
      nombre: string,           // Nombre completo
      posicion: string,         // Posición
      dorsal: number            // Número de dorsal
    }
  ]
}
```

### 2. Modelo de Inscripciones
Se agregó el campo:
```javascript
{
  esConvocada: boolean          // Marca si la inscripción es parte de una convocatoria
}
```

### 3. Archivos Modificados

#### `src/components/GestionarEntrenamientos.vue`
- Agregado formulario de convocatoria con búsqueda de jugadoras
- Funciones nuevas:
  - `onTipoChange()`: Maneja el cambio de tipo de actividad
  - `onConvocatoriaChange()`: Maneja activación/desactivación de convocatoria
  - `buscarJugadorasParaConvocar()`: Busca jugadoras del equipo
  - `agregarJugadoraConvocatoria()`: Agrega jugadora a la lista
  - `quitarJugadoraConvocatoria()`: Remueve jugadora de la lista
- Actualizado `guardarEntrenamiento()` para incluir datos de convocatoria

#### `src/Pages/Entrenamientos.vue`
- Agregado indicador visual de convocatoria en tarjetas
- Mensaje informativo para jugadoras no convocadas
- Información de convocatoria en modal de detalles

#### `src/firebase/entrenamientos.js`
- Modificado `crearEntrenamiento()` para manejar convocatorias
- Lógica condicional: si es convocatoria, usa `crearInscripcionesConvocadas()`, de lo contrario usa `crearInscripcionesPendientes()`

#### `src/firebase/inscripciones.js`
- Nueva función `crearInscripcionesConvocadas()`:
  - Crea inscripciones solo para jugadoras convocadas
  - Marca las inscripciones con `esConvocada: true`
  - Crea inscripciones en estado "pendiente" inicialmente

## Flujo de Trabajo

### Crear Convocatoria
1. Admin crea un nuevo partido/amistoso
2. Selecciona el equipo
3. Activa checkbox "Crear convocatoria/nómina"
4. Busca y selecciona las jugadoras convocadas
5. Guarda el partido

### Resultado
- Se crea el partido con `esConvocatoria: true`
- Se crean inscripciones pendientes SOLO para las jugadoras convocadas
- Las jugadoras convocadas ven el partido y pueden confirmar/dar de baja
- Las jugadoras NO convocadas ven el partido pero con mensaje informativo

## Ventajas del Sistema

1. **Control preciso**: El admin decide exactamente quién puede asistir a cada partido
2. **Transparencia**: Las jugadoras saben si están convocadas o no
3. **Flexibilidad**: Se puede usar para partidos oficiales (convocatoria) o entrenamientos (todos pueden)
4. **Gestión eficiente**: Evita tener que revisar manualmente quién debe asistir

## Validaciones Implementadas

1. Solo se puede activar convocatoria en "Partido" o "Amistoso"
2. Si se activa convocatoria, debe haber al menos una jugadora seleccionada
3. No se pueden repetir jugadoras en la lista de convocadas
4. Las inscripciones solo se crean para jugadoras convocadas

## Próximas Mejoras Sugeridas

1. Notificaciones push cuando una jugadora es convocada
2. Estadísticas de convocatorias por jugadora
3. Plantillas de convocatorias (ej: "Titulares habituales")
4. Historial de convocatorias pasadas
5. Exportar lista de convocadas a PDF/Excel
