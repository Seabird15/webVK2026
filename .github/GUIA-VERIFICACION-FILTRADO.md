# 🧪 GUÍA DE VERIFICACIÓN: Filtrado de Entrenamientos

**Objetivo:** Verificar que los entrenamientos se filtran correctamente según los días habilitados.

---

## ✅ VERIFICACIÓN RÁPIDA (5 minutos)

### Paso 1: Abre la Consola de Desarrollo

1. Ve a la página de **Entrenamientos** de cualquier jugadora
2. Presiona `F12` (o `Cmd+Option+I` en Mac)
3. Haz clic en la pestaña **"Consola"**

**Resultado esperado:** Ves mensajes azules/verdes con `[FILTRO]`

---

## 📊 VERIFICACIÓN DETALLADA

### Escenario 1: Verificar que se filtran por días

**Jugadora:** Ana (Ascenso)  
**Días habilitados:** Martes(2) y Viernes(5)  

**Test:**
1. En la consola, ejecuta:
```javascript
console.log('Disponibilidad:', jugadoraData.value.disponibilidadEntrenamientos)
```

**Resultado esperado:**
```
Disponibilidad: {
  ascenso: [2, 5],
  escuela: [1, 3, 0],
  serieC: [1]
}
```

### Escenario 2: Verificar entrenamientos filtrados

**En la consola, ejecuta:**
```javascript
console.log('Entrenamientos totales:', entrenamientos.value.length)
console.log('Entrenamientos filtrados:', entrenamientosFiltered.value.length)
```

**Resultado esperado:**
- Si hay entrenamientos en otros días → `filtrados < totales`
- Si todos están en los días correctos → `filtrados = totales`

### Escenario 3: Ver logs de filtrado detallado

**Recarga la página y observa la consola.**

**Logs a buscar:**
```
[FILTRO] "Entrenamiento Martes" - OK: Jugadora tiene este día habilitado ✅
[FILTRO] "Entrenamiento Sábado" - EXCLUIDO: Jugadora NO tiene este día habilitado ❌
```

---

## 🔧 PRUEBA PRÁCTICA: Cambiar Disponibilidad

### Paso A: Cambiar disponibilidad desde Perfil

1. Ve a **Mi Perfil**
2. Haz clic en la pestaña **"Disponibilidad"**
3. **Desmarca todos** los días de un equipo (ej: Ascenso)
4. Haz clic en **"Guardar Disponibilidad"**
5. Espera confirmación

### Paso B: Verificar cambios

1. Ve a **Entrenamientos**
2. Observa los logs en consola
3. Verás que entrenamientos de ese equipo desaparecen

**Resultado esperado:**
```
[FILTRO] "Entrenamiento Ascenso" - EXCLUIDO: Jugadora NO tiene este día habilitado ❌
```

### Paso C: Restaurar (opcional)

1. Vuelve a **Disponibilidad**
2. Haz clic en **"Restaurar valores por defecto"**
3. **Guardar**

---

## 🎯 CASOS DE PRUEBA ESPECIALES

### Caso 1: Eventos sin restricción (Partidos)

**Busca en la lista:**
- Un **Partido** programado para Sábado
- Una **Jugadora** que SOLO tiene habilitados Lunes y Martes

**Resultado esperado:**
- ✅ El partido APARECE (no se filtra por días)
- Logs muestran: `Evento sin restricción`

### Caso 2: Convocatoria

**Busca en la lista:**
- Una **Convocatoria** (esConvocatoria: true)
- Programada para un día que NO tiene la jugadora

**Resultado esperado:**
- ✅ La convocatoria APARECE (no se filtra por días)

### Caso 3: Múltiples equipos

**Si la jugadora está en Ascenso + Escuela:**

1. En Entrenamientos, selecciona **"Ambos"** (o "Eventos")
2. En la consola:
```javascript
console.log('Entrenamientos visibles:', entrenamientosFiltered.value.map(e => e.nombre))
```

**Resultado esperado:**
- Solo entrenamientos en días habilitados de AMBOS equipos

---

## 🐛 TROUBLESHOOTING

### Problema: No veo logs en consola

**Soluciones:**
1. ✅ Recarga la página (`F5`)
2. ✅ Abre DevTools ANTES de recargar
3. ✅ Mira si dice "⚠️ Usuario NO autenticado"
4. ✅ Verifica que sea una jugadora (no admin)

### Problema: Los entrenamientos desaparecen sin razón

**Verifica:**
1. ✅ La disponibilidad en Perfil → Disponibilidad
2. ✅ Los logs en consola (`[FILTRO]`)
3. ✅ Si hay errores en rojo en la consola

### Problema: Un entrenamiento aparece pero NO debería

**Chequea:**
1. ¿Es un **Partido** o **Amistoso**? (Estos no se filtran)
2. ¿Es una **Convocatoria**? (Tampoco se filtran)
3. Ejecuta en consola:
```javascript
debugFiltroEntrenamiento(jugadoraData.value, entrenamiento)
```

---

## 📝 CHECKLIST DE VERIFICACIÓN

| Item | Estado | Notas |
|------|--------|-------|
| Logs aparecen en consola | ☐ OK / ☐ NO | Busca `[FILTRO]` |
| Disponibilidad se guarda | ☐ OK / ☐ NO | Ve a Perfil → Disponibilidad |
| Entrenamientos se filtran | ☐ OK / ☐ NO | Desmarca todos y verifica |
| Partidos siempre aparecen | ☐ OK / ☐ NO | Busca un partido del sábado |
| Convocatorias siempre aparecen | ☐ OK / ☐ NO | Si existe convocatoria |
| Cambios se guardan en BD | ☐ OK / ☐ NO | Recarga la página |

---

## 📞 CONTACTO / SOPORTE

Si encontras un problema:

1. 📸 **Toma screenshot de la consola** (F12)
2. 📝 **Anota qué entrenamiento debería estar oculto**
3. 💾 **Anota la disponibilidad de la jugadora**
4. 📊 **Reporta con los logs de la consola**

---

## 🎓 CONCEPTOS CLAVE

### ¿Cómo funciona el filtrado?

1. Se lee `disponibilidadEntrenamientos` de la jugadora
2. Se obtiene el día del entrenamiento (0-6)
3. Se comprueba si el día está en `disponibilidadEntrenamientos`
4. Si SÍ → ✅ Se muestra | Si NO → ❌ Se oculta

### ¿Cuáles son los días por defecto?

- **Ascenso:** Martes (2) y Viernes (5)
- **Escuela:** Domingo (0), Lunes (1), Miércoles (3)
- **Serie C:** Lunes (1)

### ¿Qué NO se filtra?

- ✅ Partidos (siempre se muestran)
- ✅ Amistosos (siempre se muestran)
- ✅ Convocatorias (siempre se muestran)
- ❌ Entrenamientos normales (SÍ se filtran)

---

**Última actualización:** 15/05/2026  
**Versión:** 1.0  
**Nivel:** Verificación Técnica Completa ✅
