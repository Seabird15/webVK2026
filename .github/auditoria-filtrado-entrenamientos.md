# 📋 Auditoría Completa: Filtrado de Entrenamientos por Días Habilitados

**Fecha:** 15 de Mayo de 2026  
**Archivo bajo revisión:** `src/Pages/Entrenamientos.vue`  
**Archivos relacionados:** `src/utils/disponibilidadEntrenamientos.js`, `src/firebase/jugadorasAuth.js`

---

## ✅ CONCLUSIONES PRINCIPALES

### 1. **La lógica de filtrado SÍ está implementada correctamente**

El sistema **ya está filtrando** entrenamientos según los días habilitados en la configuración de cada jugadora:

- ✅ El computed `entrenamientosFiltered` (línea 1629) llama a `jugadoraPuedeAsistirEntrenamiento()`
- ✅ Esta función valida que el día del entrenamiento esté en los días disponibles de la jugadora
- ✅ Los datos se cargan correctamente desde Firebase con `disponibilidadEntrenamientos` normalizado
- ✅ El filtrado solo se aplica a jugadoras (admins ven todo)

### 2. **Estructura de almacenamiento en Firebase**

Cada jugadora tiene en su documento un campo:
```javascript
disponibilidadEntrenamientos: {
  ascenso: [2, 5],           // Martes(2) y Viernes(5)
  escuela: [1, 3, 0],        // Lunes(1), Miércoles(3), Domingo(0)
  serieC: [1]                // Lunes(1)
}
```

**Mapeo de días:** 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado

---

## 📊 FLUJO DE FUNCIONAMIENTO

### Paso 1: Carga de Datos de Jugadora
```
usuario.autenticar() 
  → onAuthStateChanged en jugadorasAuth.js
  → normalizarDatosJugadora() 
  → disponibilidadEntrenamientos normalizada
  → jugadoraData.value actualizado
```

### Paso 2: Filtrado de Entrenamientos
```
Entrenamientos.vue - computed entrenamientosFiltered
  ↓
.filter(entrenamiento)
  ├─ Verificar equipo (ascenso, escuela, serieC, todos)
  ├─ Si NO es admin:
  │   └─ jugadoraPuedeAsistirEntrenamiento(jugadora, entrenamiento)
  │       ├─ Si es evento sin restricción (partido/amistoso/convocatoria) → TRUE
  │       └─ Si es entrenamiento normal:
  │           ├─ Obtener día del entrenamiento
  │           ├─ Obtener días disponibles de jugadora
  │           └─ Verificar si día está en disponibles
  └─ Filtrar por visibilidad en listado (fecha no pasada)
```

### Paso 3: Visualización
```
Si entrenamientosFiltered está vacío:
  → Mostrar "No hay eventos disponibles"
Si entrenamientosFiltered tiene elementos:
  → Mostrar lista de entrenamientos permitidos
```

---

## 🔍 VALIDACIONES REALIZADAS

### ✅ Validación 1: Lógica de `jugadoraPuedeAsistirEntrenamiento`

```javascript
// En disponibilidadEntrenamientos.js línea 127
export const jugadoraPuedeAsistirEntrenamiento = (jugadora, entrenamiento) => {
  // 1. Si NO tiene restricción semanal → SIEMPRE puede asistir
  if (!esEventoConRestriccionSemanal(entrenamiento)) {
    return true;  // ✅ Partidos, amistosos, convocatorias
  }

  // 2. Si tiene restricción → validar días
  const diaSemana = obtenerDiaSemanaEntrenamiento(entrenamiento);
  const diasDisponibles = obtenerDiasDisponiblesJugadora(jugadora, equipo);
  
  return diasDisponibles.includes(diaSemana);  // ✅ Valida correctamente
};
```

### ✅ Validación 2: Normalización de Disponibilidad

```javascript
// En jugadorasAuth.js línea 100
const disponibilidadEntrenamientos = normalizarDisponibilidadEntrenamientos(
  data?.disponibilidadEntrenamientos || {},  // Datos de Firebase
  equipos                                     // Equipos de la jugadora
);
```

Si la jugadora tiene días personalizados → usa esos  
Si NO tiene → usa días base por equipo:
- **Ascenso:** Martes(2), Viernes(5)
- **Escuela:** Domingo(0), Lunes(1), Miércoles(3)
- **Serie C:** Lunes(1)

### ✅ Validación 3: Eventos sin Restricción

```javascript
// Estos eventos SÍ IGNORAN la restricción de días:
- Partidos (tipo: "partido")
- Amistosos (tipo: "amistoso")  
- Convocatorias (esConvocatoria: true)

// Estos eventos SÍ validan restricción de días:
- Entrenamientos (tipo: "entrenamiento")
- Otros eventos
```

---

## 🐛 POSIBLES PROBLEMAS DETECTADOS

### ⚠️ Problema 1: Jugadoras NO pueden editar su disponibilidad

**Ubicación:** `src/Pages/Perfil.vue`  
**Situación:** Las jugadoras no tienen forma de cambiar sus días habilitados desde su perfil.

**Solución:** Solo admins pueden hacerlo desde `EditarJugadoraAdmin.vue`

**Impacto:** Si una jugadora necesita cambiar sus días, debe pedir a un admin que lo haga.

### ⚠️ Problema 2: Sin validación en lista de inscriptas

**Ubicación:** `src/components/GestionarPartidos.vue` (admin)  
**Situación:** Cuando el admin ve la lista de inscriptas, no se valida si deberían estar filtradas por días.

**Impacto:** Admin ve todas las inscriptas sin considerar la disponibilidad.

### ⚠️ Problema 3: Campos vacíos en disponibilidadEntrenamientos

**Situación:** Si `data?.disponibilidadEntrenamientos` está vacío o malformado, se usan los días base.

**Impacto:** Menor impacto, pero se podría mejorar la validación.

---

## 📝 RECOMENDACIONES

### 🔧 Mejora 1: Agregar logging de debug (✅ YA IMPLEMENTADO)

Se agregó logging en:
- `entrenamientosFiltered` (Entrenamientos.vue)
- `jugadoraPuedeAsistirEntrenamiento` (disponibilidadEntrenamientos.js)

Para ver logs: Abrir DevTools (F12) → Consola

### 🔧 Mejora 2: Permitir que jugadoras editen su disponibilidad

**Archivo:** `src/Pages/Perfil.vue`  
**Cambio:** Agregar sección "Días Habilitados" con selector de días por equipo

```vue
<!-- Ejemplo de lo que falta -->
<div class="space-y-4">
  <label>Días habilitados - Ascenso</label>
  <div class="flex gap-2">
    <button v-for="dia in ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom']" ...>
      {{ dia }}
    </button>
  </div>
</div>
```

### 🔧 Mejora 3: Validar en admin también

**Archivo:** `src/components/EditarJugadoraAdmin.vue`  
**Cambio:** Mostrar qué entrenamientos la jugadora puede/no puede asistir basado en sus días

### 🔧 Mejora 4: Crear documento de configuración

**Archivo:** Nueva página `src/Pages/ConfiguracionDisponibilidad.vue`  
**Beneficio:** Interface dedicada para que jugadoras configuren sus días

---

## 📊 MATRIZ DE VERIFICACIÓN

| Aspecto | Estado | Evidencia |
|---------|--------|-----------|
| ✅ Datos cargados | OK | `jugadoraData.disponibilidadEntrenamientos` normalizado |
| ✅ Función de validación | OK | `jugadoraPuedeAsistirEntrenamiento()` implementada |
| ✅ Filtrado aplicado | OK | `entrenamientosFiltered.filter()` llama validación |
| ✅ Eventos sin restricción | OK | Partidos/amistosos/convocatorias no filtrados |
| ✅ Eventos con restricción | OK | Entrenamientos normales validados |
| ❌ UI para jugadoras editar | FALTA | No hay interface en Perfil.vue |
| ⚠️ Validación en admin | PARCIAL | Solo en vista de jugadora, no en admin |
| ✅ Almacenamiento Firebase | OK | Campo `disponibilidadEntrenamientos` |

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. **Verificar con console.log** (logs ya agregados):
   - Abrir DevTools
   - Ver si aparecen los logs de filtrado
   - Confirmar qué entrenamientos se excluyen

2. **Implementar UI para jugadoras** (Tarea 4):
   - Agregar formulario en Perfil.vue
   - Permitir editar días por equipo
   - Guardar cambios en Firebase

3. **Auditoría de admin**:
   - Verificar que lista de inscriptas sea correcta
   - Considerar si admin ve entrenamientos que jugadora no puede

---

## 📚 Referencias de Código

| Componente | Ruta | Función |
|-----------|------|---------|
| Filtrado principal | Entrenamientos.vue:1629 | `entrenamientosFiltered` |
| Validación de días | disponibilidadEntrenamientos.js:127 | `jugadoraPuedeAsistirEntrenamiento` |
| Carga de datos | jugadorasAuth.js:97 | `normalizarDatosJugadora` |
| Edición admin | EditarJugadoraAdmin.vue:103 | Selector de días (solo admin) |
| Días base | disponibilidadEntrenamientos.js:11 | `DIAS_ENTRENAMIENTO_POR_EQUIPO` |

---

**Auditoría completada por:** GitHub Copilot  
**Última actualización:** 15/05/2026 12:00 UTC
