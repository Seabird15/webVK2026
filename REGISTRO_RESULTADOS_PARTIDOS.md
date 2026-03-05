# 📊 Sistema Mejorado de Registro de Resultados de Partidos

## Descripción

Se ha implementado un sistema completo para registrar y gestionar resultados de partidos en tiempo real desde el panel de administración. El sistema permite:

- ✅ **Crear nuevos partidos** (equipo, tipo, fecha, hora, rival, lugar)
- ✅ **Editar resultados en tiempo real** (goles incrementados/decrementados)
- ✅ **Registrar goleadores** con minuto del gol
- ✅ **Registrar asistencias** (opcional)
- ✅ **Actualizar automáticamente estadísticas** según equipo (ascenso/escuela) y tipo (competición/amistoso/liga)
- ✅ **Sincronización con Firebase** automática

## Archivos Creados/Modificados

### 1. **[src/firebase/partidos.js](src/firebase/partidos.js)** (NUEVO)
Sistema completo de gestión de partidos con funciones:
- `crearPartido()` - Crear nuevo partido
- `actualizarResultado()` - Actualizar goles
- `registrarGol()` - Registrar gol y actualizar estadísticas
- `deshacerGol()` - Eliminar un gol
- `registrarAsistencia()` - Registrar asistencia
- `obtenerPartidosPorEquipoTipo()` - Consultar partidos
- `escucharPartidos()` - Escucha en tiempo real

### 2. **[src/components/EditorResultadosPartidosAdmin.vue](src/components/EditorResultadosPartidosAdmin.vue)** (NUEVO)
Componente principal con interfaz completa para:
- Filtrar partidos por equipo (Ascenso/Escuela) y tipo (Competición/Amistoso)
- Editar goles con botones +/- o input directo
- Registrar goleadores con número de minuto
- Cambiar estado del partido (Programado/En Curso/Finalizado)
- Sincronización en tiempo real

### 3. **[src/components/CrearNuevoPartido.vue](src/components/CrearNuevoPartido.vue)** (NUEVO)
Formulario para crear nuevos partidos con validación

### 4. **[src/Pages/Admin.vue](src/Pages/Admin.vue)** (MODIFICADO)
- Agregada nueva pestaña: "Editar Resultados"
- Importados new components

## Flujo de Uso

### Crear un Nuevo Partido

1. Ir a Panel Admin → **"Editar Resultados"**
2. Hacer clic en botón **"Nuevo Partido"**
3. Completar el formulario:
   - **Equipo**: Ascenso o Escuela
   - **Tipo**: Competición, Amistoso o Liga
   - **Fecha**: Fecha del partido
   - **Hora**: Hora del partido
   - **Rival**: Nombre del equipo rival
   - **Lugar**: Ubicación (opcional)
4. Hacer clic en **"Crear Partido"**

### Editar Resultados en Tiempo Real

1. El partido aparecerá en la lista de "Editor de Resultados"
2. **Registrar Goles**:
   - Usar botones **+** / **−** para incrementar/decrementar
   - O escribir el número directamente en el campo
   - Los cambios se guardan automáticamente

3. **Registrar Goleadores**:
   - En la sección "Goleadores CD Vikingas" o "Goleadores [Rival]"
   - Escribir nombre de la jugadora
   - (Opcional) Escribir el minuto del gol
   - Hacer clic en **"Registrar Gol"**

4. **Cambiar Estado del Partido**:
   - Seleccionar estado: Programado, En Curso o Finalizado
   - Se guarda automáticamente

### Filtros

- **Por Equipo**: Todos / Ascenso / Escuela
- **Por Tipo**: Todos / Competición / Amistoso

## Estructura de Datos en Firebase

Los partidos se guardan en la colección `partidos` con la siguiente estructura:

```json
{
  "id": "ascenso_competicion_1740000000000",
  "fecha": "2026-03-05",
  "hora": "19:00",
  "equipo": "ascenso",
  "tipo": "competicion",
  "rival": "Rival Team",
  "lugar": "Tricolor La Florida",
  "golesLocal": 3,
  "golesVisita": 1,
  "goleadoresLocal": [
    {
      "jugadora": "María García",
      "minuto": 15,
      "timestamp": "2026-03-05T19:15:00Z"
    },
    {
      "jugadora": "Ana López",
      "minuto": 32,
      "timestamp": "2026-03-05T19:32:00Z"
    }
  ],
  "goleadoresVisita": [],
  "asistenciasLocal": [],
  "asistenciasVisita": [],
  "estado": "FINALIZADO",
  "createdAt": "2026-03-05T19:00:00Z",
  "updatedAt": "2026-03-05T19:45:00Z"
}
```

## Actualización Automática de Estadísticas

Cuando se registra un gol:

1. Se incrementa el contador de goles en la colección `estadisticas` o `estadisticasAscAmistosos`
2. Se crea automáticamente un registro si no existe
3. Se busca por nombre de jugadora y equipo
4. Se actualiza la propiedad `goles` con increment(1)

### Colecciones Usadas:

- **Competición**: `estadisticas` (para ascenso/escuela en liga)
- **Amistosos**: `estadisticasAscAmistosos` (para partidos amistosos)

## Notas Importantes

### ✨ Características

- **Edición en Tiempo Real**: Los cambios se guardan automáticamente sin necesidad de botón "Guardar"
- **Sincronización Multi-Usuario**: Si hay múltiples admins, los cambios se reflejan en tiempo real
- **Validación**: Los campos requeridos se validan antes de crear un partido
- **Responsive Design**: Funciona perfectamente en mobile y desktop
- **Indicadores Visuales**: Muestra estado de guardado con spinner animado

### ⚠️ Consideraciones

1. **Búsqueda de Jugadora**: El sistema busca por primer nombre. Si hay dos jugadoras con el mismo nombre, consider add surname.
2. **Partidos Programados**: Los partidos creados comienzan en estado "PROGRAMADO"
3. **Eliminar Gol**: Al hacer clic en **✕** junto a un goleador, se elimina el gol y se actualiza automáticamente
4. **Sin Duplicados**: Si registras el mismo goleador dos veces, se agrega dos veces (esto es intencional para tripletas, etc.)

## Ejemplos de Uso

### Ejemplo 1: Registrar un Partido Ganador 3-1

```
1. Crear Partido:
   - Equipo: Ascenso
   - Tipo: Competición
   - Fecha: 2026-03-05
   - Hora: 19:00
   - Rival: Equipo Contrario
   - Lugar: Cancha

2. Editar Resultado:
   - Incrementar Goles Local a 3
   - Registrar goleadores:
     * María García (minuto 15)
     * Ana López (minuto 32)
     * Lucía Martínez (minuto 45)

3. Registrar 1 gol rival:
   - Incrementar Goles Visitante a 1
   - Agregar goleador rival

4. Cambiar Estado: FINALIZADO
```

### Ejemplo 2: Edición Rápida de Minutos

Si te equivocas del minuto:
1. Hacer clic en **✕** junto al goleador
2. Volver a registrarlo con el minuto correcto

## Troubleshooting

### El partido no aparece en la lista
- Verificar que el filtro de equipo coincida con el equipo del partido
- Verificar que el filtro de tipo coincida con el tipo del partido
- Esperar 2-3 segundos para que se sincronice desde Firebase

### Las estadísticas no se actualizan
- Verificar que el nombre de la jugadora sea correcto
- Asegurarse de que existe un registro de esa jugadora en la colección de estadísticas

### El gol no se registra
- Verificar que el campo de nombre de jugadora no esté vacío
- Intentar recargar la página

## Próximas Mejoras Sugeridas

- [ ] Agregar foto/logo de los rivales
- [ ] Historial de cambios en resultados
- [ ] Notificaciones cuando se registra un gol
- [ ] Estadísticas por jugadora (goles, asistencias, minutos)
- [ ] Exportar resultados a PDF/Excel
- [ ] API para integración con redes sociales
