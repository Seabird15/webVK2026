# Sistema de Gestión de Goles - Campeonato Interno 2026

## 📋 Resumen de Mejoras Implementadas

Se ha mejorado significativamente el sistema de gestión de goles del Campeonato Interno Vikingas 2026, agregando integración con Firebase para persistencia de datos y mejoras visuales en las tablas de goleadoras.

---

## 🎯 Funcionalidades Nuevas

### 1. **Persistencia de Datos en Firebase**
- Los datos de goles se guardan automáticamente en Firestore
- Sincronización en tiempo real entre dispositivos
- Los datos se mantienen incluso después de recargar la página

### 2. **Tabla General de Goleadoras**
- Ranking global de todas las jugadoras con goles
- Top 3 destacado con medallas (🥇🥈🥉)
- Tabla completa de goleadoras del 4to lugar en adelante
- Colores por equipo para identificación rápida

### 3. **Visualización Mejorada por Equipo**
- Sección destacada de "GOLEADORAS" para jugadoras con goles
- Listado completo del plantel de cada equipo
- Indicadores visuales del número de goles
- Totales de goles por equipo

### 4. **Panel de Administración Mejorado**
- Indicador de "Guardando..." cuando se procesa un cambio
- Botones deshabilitados durante el guardado para evitar duplicados
- Feedback visual inmediato
- Última actualización mostrada

---

## 📁 Archivos Nuevos

### `src/firebase/campeonatoInterno.js`
Servicio de Firebase para gestionar el campeonato interno. Incluye:

#### Funciones principales:
- `obtenerDatosCampeonato()` - Obtener todos los datos del campeonato
- `escucharCampeonato(callback)` - Escuchar cambios en tiempo real
- `agregarGol(equipoKey, jugadoraIndex)` - Agregar un gol a una jugadora
- `restarGol(equipoKey, jugadoraIndex)` - Restar un gol a una jugadora
- `obtenerTablaGoleadoras()` - Obtener ranking de goleadoras
- `calcularTotalGoles(equipoKey)` - Calcular total de goles por equipo
- `resetearEstadisticas()` - Resetear todas las estadísticas (solo admin)

---

## 🎨 Mejoras Visuales

### Tabla de Goleadoras
- **Top 3 Destacado**: Tarjetas grandes con medallas y estadísticas
- **Colores por Equipo**:
  - 🔵 Las Verserkers: Cyan
  - ⚪ Inter Nadas: Gray
  - 🔴 Siempre al Palo FC: Red

### Tarjetas de Equipos
```
┌─────────────────────────────────┐
│  LOGO + NOMBRE DEL EQUIPO       │
├─────────────────────────────────┤
│  GOLEADORAS (con goles)         │
│  • Jugadora [X goles]           │
│  • Jugadora [X goles]           │
├─────────────────────────────────┤
│  PLANTEL COMPLETO               │
│  • Todas las jugadoras          │
├─────────────────────────────────┤
│  TOTAL: X Goles                 │
└─────────────────────────────────┘
```

---

## 🔐 Permisos y Seguridad

### Para Usuarios Regulares
- ✅ Ver tabla de goleadoras
- ✅ Ver estadísticas de equipos
- ✅ Ver fixture y resultados

### Para Administradores
- ✅ Todo lo anterior +
- ✅ Agregar/restar goles
- ✅ Acceso al panel de administración
- ✅ Ver última actualización

---

## 🚀 Cómo Usar

### Como Administrador:

1. **Expandir el Campeonato Interno**
   - Click en "1ER CAMPEONATO INTERNO VIKINGAS"

2. **Abrir Panel de Administración**
   - Scroll hasta "PANEL DE GOLES - ADMINISTRADOR"
   - Click en "Mostrar Panel"

3. **Registrar Goles**
   - Buscar la jugadora en su equipo
   - Click en botón `+` para agregar un gol
   - Click en botón `-` para quitar un gol
   - Los cambios se guardan automáticamente

4. **Ver Tabla de Goleadoras**
   - Click en "TABLA DE GOLEADORAS"
   - Ver el Top 3 destacado
   - Ver ranking completo

### Como Usuario:

1. **Ver Estadísticas**
   - Navegar a la página de Competencias
   - Expandir "1ER CAMPEONATO INTERNO VIKINGAS"
   - Ver los equipos y sus goleadoras

2. **Ver Tabla de Goleadoras**
   - Click en "TABLA DE GOLEADORAS"
   - Ver el ranking actualizado en tiempo real

---

## 📊 Estructura de Datos en Firebase

### Colección: `campeonato_interno_2026`
### Documento: `equipos`

```javascript
{
  verserkers: {
    nombre: "Las Verserkers",
    color: "cyan",
    capitana: "Barby",
    logo: "versekersLogo.jpeg",
    jugadoras: [
      { nombre: "May", goles: 0 },
      { nombre: "Barby", goles: 0, capitana: true },
      // ...
    ]
  },
  internadas: { /* ... */ },
  siemprealpalo: { /* ... */ },
  lastUpdated: "2026-02-08T...",
  createdAt: "2026-02-08T..."
}
```

---

## 🔄 Sincronización en Tiempo Real

El sistema utiliza `onSnapshot` de Firestore para mantener los datos sincronizados:
- Cuando un admin actualiza goles, todos los usuarios ven el cambio
- No requiere recargar la página
- Actualización instantánea de la tabla de goleadoras

---

## 🛠️ Mantenimiento

### Inicializar Datos
Si necesitas resetear o inicializar los datos del campeonato, el sistema lo hace automáticamente la primera vez que se accede.

### Modificar Planteles
Para agregar/quitar jugadoras o cambiar información de equipos:
1. Editar `src/firebase/campeonatoInterno.js`
2. Modificar la función `inicializarCampeonato()`
3. Eliminar el documento en Firebase para que se recree

### Resetear Estadísticas
```javascript
import { resetearEstadisticas } from '@/firebase/campeonatoInterno';
await resetearEstadisticas();
```

---

## 📱 Responsive Design

El diseño es completamente responsive:
- **Desktop**: Vista completa con 3 columnas para equipos
- **Tablet**: 2 columnas adaptativas
- **Mobile**: 1 columna con elementos apilados

---

## ⚡ Rendimiento

- Carga inicial optimizada con loading state
- Actualizaciones en tiempo real sin recargar página
- Prevención de clicks duplicados durante guardado
- Índices apropiados en Firebase para consultas rápidas

---

## 🐛 Solución de Problemas

### Los goles no se guardan
- Verificar conexión a Firebase
- Verificar permisos de administrador
- Revisar consola del navegador

### Los datos no se actualizan
- Verificar conexión a internet
- Recargar la página
- Verificar que Firebase esté configurado correctamente

### Error al cargar datos
- El sistema intentará inicializar automáticamente
- Si persiste, verificar configuración de Firebase en `src/firebase/config.js`

---

## 📞 Soporte

Para dudas o problemas:
1. Revisar la consola del navegador (F12)
2. Verificar la configuración de Firebase
3. Contactar al desarrollador

---

## 🎉 ¡Listo!

El sistema está completamente funcional y listo para registrar los goles del Campeonato Interno Vikingas 2026. ¡Buena suerte a todos los equipos! 🏆⚽
